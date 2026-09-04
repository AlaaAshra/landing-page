import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const publicDir = path.join(rootDir, "public");
const outputPath = path.join(publicDir, "videos", "clinic-onboarding-demo.mp4");
const audioPaths = [
  "clinic-onboarding-1.mp3",
  "clinic-onboarding-2.mp3",
  "clinic-onboarding-3.mp3",
  "clinic-onboarding-4.mp3",
  "clinic-onboarding-5.mp3",
  "clinic-onboarding-6.mp3",
  "clinic-onboarding-7.mp3",
].map((fileName) => path.join(publicDir, "audio", fileName));
const chromePath = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const httpPort = Number(process.env.EXPORT_HTTP_PORT || 4177);
const debugPort = Number(process.env.EXPORT_DEBUG_PORT || 9223);
const captureSeconds = Number(process.env.EXPORT_DURATION || 31);
const targetFps = Number(process.env.EXPORT_FPS || 15);
const width = Number(process.env.EXPORT_WIDTH || 1240);
const height = Number(process.env.EXPORT_HEIGHT || 720);

const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".svg", "image/svg+xml"],
  [".mp3", "audio/mpeg"],
  [".mp4", "video/mp4"],
  [".woff2", "font/woff2"],
  [".ttf", "font/ttf"],
]);

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit", ...options });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} exited with code ${code}`));
    });
  });
}

function startStaticServer() {
  const server = createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url || "/", `http://127.0.0.1:${httpPort}`);
      const relativePath = decodeURIComponent(requestUrl.pathname === "/" ? "/clinic-add-patient-demo.html" : requestUrl.pathname);
      const filePath = path.resolve(publicDir, `.${relativePath}`);

      if (!filePath.startsWith(publicDir)) {
        response.writeHead(403);
        response.end("Forbidden");
        return;
      }

      const body = await readFile(filePath);
      response.writeHead(200, { "content-type": mimeTypes.get(path.extname(filePath)) || "application/octet-stream" });
      response.end(body);
    } catch {
      response.writeHead(404);
      response.end("Not found");
    }
  });

  return new Promise((resolve, reject) => {
    server.on("error", reject);
    server.listen(httpPort, "127.0.0.1", () => resolve(server));
  });
}

class CdpClient {
  constructor(url) {
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = new Map();
    this.socket = new WebSocket(url);
  }

  async connect() {
    await new Promise((resolve, reject) => {
      this.socket.addEventListener("open", resolve, { once: true });
      this.socket.addEventListener("error", reject, { once: true });
      this.socket.addEventListener("message", (event) => this.handleMessage(event));
    });
  }

  handleMessage(event) {
    const message = JSON.parse(event.data);

    if (message.id && this.pending.has(message.id)) {
      const { resolve, reject } = this.pending.get(message.id);
      this.pending.delete(message.id);

      if (message.error) {
        reject(new Error(message.error.message));
        return;
      }

      resolve(message.result);
      return;
    }

    const callbacks = this.listeners.get(message.method) || [];
    callbacks.forEach((callback) => callback(message));
  }

  call(method, params = {}, sessionId) {
    const id = this.nextId;
    this.nextId += 1;
    const message = { id, method, params };

    if (sessionId) {
      message.sessionId = sessionId;
    }

    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.send(JSON.stringify(message));
    });
  }

  once(method, predicate = () => true) {
    return new Promise((resolve) => {
      const wrapped = (message) => {
        if (!predicate(message)) {
          return;
        }

        const callbacks = this.listeners.get(method) || [];
        this.listeners.set(method, callbacks.filter((callback) => callback !== wrapped));
        resolve(message);
      };

      const callbacks = this.listeners.get(method) || [];
      callbacks.push(wrapped);
      this.listeners.set(method, callbacks);
    });
  }

  close() {
    this.socket.close();
  }
}

async function getBrowserWebSocketUrl() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${debugPort}/json/version`);
      const payload = await response.json();
      return payload.webSocketDebuggerUrl;
    } catch {
      await wait(250);
    }
  }

  throw new Error("Chrome DevTools endpoint did not become available.");
}

function concatPath(filePath) {
  return filePath.replaceAll("\\", "/").replaceAll("'", "'\\''");
}

async function main() {
  mkdirSync(path.dirname(outputPath), { recursive: true });

  const tempDir = mkdtempSync(path.join(tmpdir(), "clinic-demo-export-"));
  const frameDir = path.join(tempDir, "frames");
  mkdirSync(frameDir, { recursive: true });

  const server = await startStaticServer();
  const userDataDir = path.join(tempDir, "chrome-profile");
  const chrome = spawn(chromePath, [
    "--headless=new",
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--hide-scrollbars",
    "--mute-audio",
    "--autoplay-policy=no-user-gesture-required",
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${userDataDir}`,
    `--window-size=${width},${height}`,
    "about:blank",
  ], { stdio: "ignore" });

  let cdp;

  try {
    const wsUrl = await getBrowserWebSocketUrl();
    cdp = new CdpClient(wsUrl);
    await cdp.connect();

    const { targetId } = await cdp.call("Target.createTarget", {
      url: "about:blank",
    });
    const { sessionId } = await cdp.call("Target.attachToTarget", {
      targetId,
      flatten: true,
    });

    await cdp.call("Page.enable", {}, sessionId);
    await cdp.call("Runtime.enable", {}, sessionId);
    await cdp.call("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: false,
    }, sessionId);

    const pageUrl = `http://127.0.0.1:${httpPort}/clinic-add-patient-demo.html?lang=en&manual=1`;
    const loaded = cdp.once("Page.loadEventFired", (message) => message.sessionId === sessionId);
    await cdp.call("Page.navigate", { url: pageUrl }, sessionId);
    await loaded;
    await cdp.call("Runtime.evaluate", {
      expression: "window.startClinicDemo()",
      awaitPromise: false,
    }, sessionId);

    const timestamps = [];
    const startedAt = performance.now();
    let nextFrameAt = 0;
    let index = 1;

    while (true) {
      const elapsed = (performance.now() - startedAt) / 1000;

      if (elapsed > captureSeconds) {
        break;
      }

      const capture = await cdp.call("Page.captureScreenshot", {
        format: "jpeg",
        quality: 88,
        fromSurface: true,
      }, sessionId);
      const framePath = path.join(frameDir, `frame-${String(index).padStart(5, "0")}.jpg`);
      writeFileSync(framePath, Buffer.from(capture.data, "base64"));
      timestamps.push({ path: framePath, time: elapsed });
      index += 1;

      nextFrameAt += 1 / targetFps;
      const delay = Math.max(0, nextFrameAt - ((performance.now() - startedAt) / 1000));
      await wait(delay * 1000);
    }

    const concatLines = ["ffconcat version 1.0"];
    for (let i = 0; i < timestamps.length; i += 1) {
      const current = timestamps[i];
      const next = timestamps[i + 1];
      const duration = Math.max(0.001, (next?.time ?? captureSeconds) - current.time);
      concatLines.push(`file '${concatPath(current.path)}'`);
      concatLines.push(`duration ${duration.toFixed(6)}`);
    }
    concatLines.push(`file '${concatPath(timestamps[timestamps.length - 1].path)}'`);

    const concatPathname = path.join(tempDir, "frames.ffconcat");
    writeFileSync(concatPathname, `${concatLines.join("\n")}\n`);

    const audioConcatPathname = path.join(tempDir, "audio.ffconcat");
    writeFileSync(
      audioConcatPathname,
      `${["ffconcat version 1.0", ...audioPaths.map((audioPath) => `file '${concatPath(audioPath)}'`)].join("\n")}\n`,
    );

    await run("ffmpeg", [
      "-y",
      "-f", "concat",
      "-safe", "0",
      "-i", concatPathname,
      "-f", "concat",
      "-safe", "0",
      "-i", audioConcatPathname,
      "-t", String(captureSeconds),
      "-vf", "fps=30,format=yuv420p",
      "-c:v", "libx264",
      "-preset", "medium",
      "-crf", "18",
      "-c:a", "aac",
      "-b:a", "160k",
      "-movflags", "+faststart",
      outputPath,
    ]);

    console.log(`Exported ${outputPath}`);
  } finally {
    cdp?.close();
    const chromeExit = new Promise((resolve) => {
      if (chrome.exitCode !== null) {
        resolve();
        return;
      }

      chrome.once("exit", resolve);
    });
    chrome.kill();
    await Promise.race([chromeExit, wait(5000)]);
    server.close();

    for (let attempt = 0; attempt < 5; attempt += 1) {
      try {
        rmSync(tempDir, { recursive: true, force: true });
        break;
      } catch {
        await wait(500);
      }
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
