import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const publicDir = path.join(rootDir, "public");
const videosDir = path.join(publicDir, "videos");
const audioDir = path.join(publicDir, "audio");
const tempRoot = path.join(rootDir, ".tmp", "onboarding-video-export");
const chromePath =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const httpPort = Number(process.env.EXPORT_HTTP_PORT || 4177);
const targetFps = Number(process.env.EXPORT_FPS || 30);
const backgroundMusicPath = path.join(audioDir, "onboarding-background-music.mp3");
const backgroundMusicVolume = 0.12;

const jobs = [
  {
    id: "clinic",
    urlPath: "/clinic-add-patient-demo.html?lang=en&manual=1&play=export",
    startExpression: "window.startClinicDemo()",
    outputPath: path.join(videosDir, "clinic-mode.mp4"),
    width: 1240,
    height: 720,
    fps: targetFps,
    durationSeconds: 30.484689,
    voiceoverPaths: [
      "clinic-onboarding-1.mp3",
      "clinic-onboarding-2.mp3",
      "clinic-onboarding-3.mp3",
      "clinic-onboarding-4.mp3",
      "clinic-onboarding-5.mp3",
      "clinic-onboarding-6.mp3",
      "clinic-onboarding-7.mp3",
    ].map((fileName) => path.join(audioDir, fileName)),
  },
  {
    id: "study",
    urlPath: "/study-get-started-demo.html?play=export",
    outputPath: path.join(videosDir, "study-mode.mp4"),
    width: 1366,
    height: 768,
    fps: targetFps,
    durationSeconds: 34.690612,
    voiceoverPaths: [path.join(audioDir, "study-get-started-voiceover.mp3")],
  },
];

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
      const relativePath = decodeURIComponent(
        requestUrl.pathname === "/" ? "/study-get-started-demo.html" : requestUrl.pathname,
      );
      const filePath = path.resolve(publicDir, `.${relativePath}`);

      if (!filePath.startsWith(publicDir)) {
        response.writeHead(403);
        response.end("Forbidden");
        return;
      }

      const body = await readFile(filePath);
      response.writeHead(200, {
        "content-type": mimeTypes.get(path.extname(filePath)) || "application/octet-stream",
      });
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

function ffconcatPath(filePath) {
  return filePath.replaceAll("\\", "/").replaceAll("'", "'\\''");
}

function writeFrameConcat(frameRecords, durationSeconds, outputPath) {
  const lines = ["ffconcat version 1.0"];

  for (let index = 0; index < frameRecords.length; index += 1) {
    const current = frameRecords[index];
    const next = frameRecords[index + 1];
    const duration = Math.max(0.001, (next?.time ?? durationSeconds) - current.time);
    lines.push(`file '${ffconcatPath(current.path)}'`);
    lines.push(`duration ${duration.toFixed(6)}`);
  }

  lines.push(`file '${ffconcatPath(frameRecords[frameRecords.length - 1].path)}'`);
  writeFileSync(outputPath, `${lines.join("\n")}\n`);
}

async function captureFrames(page, job, frameDir) {
  const frameRecords = [];
  const frameIntervalMs = 1000 / job.fps;
  const startedAt = performance.now();
  let nextFrameAt = 0;
  let frameIndex = 1;

  while (true) {
    const elapsed = (performance.now() - startedAt) / 1000;

    if (elapsed > job.durationSeconds) {
      break;
    }

    const framePath = path.join(frameDir, `frame-${String(frameIndex).padStart(5, "0")}.jpg`);
    await page.screenshot({ path: framePath, type: "jpeg", quality: 92, animations: "allow" });
    frameRecords.push({ path: framePath, time: elapsed });

    if (frameIndex % 120 === 0) {
      console.log(`[${job.id}] captured ${frameIndex} frames`);
    }

    frameIndex += 1;
    nextFrameAt += frameIntervalMs;
    const delay = nextFrameAt - (performance.now() - startedAt);

    if (delay > 0) {
      await wait(delay);
    }
  }

  console.log(`[${job.id}] captured ${frameRecords.length} frames total`);
  return frameRecords;
}

async function encodeVideo(job, tempDir, frameRecords) {
  const frameConcatPath = path.join(tempDir, `${job.id}-frames.ffconcat`);
  const voiceoverConcatPath = path.join(tempDir, `${job.id}-voiceover.ffconcat`);
  writeFrameConcat(frameRecords, job.durationSeconds, frameConcatPath);
  writeFileSync(
    voiceoverConcatPath,
    `${["ffconcat version 1.0", ...job.voiceoverPaths.map((audioPath) => `file '${ffconcatPath(audioPath)}'`)].join("\n")}\n`,
  );

  await run("ffmpeg", [
    "-y",
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    frameConcatPath,
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    voiceoverConcatPath,
    "-stream_loop",
    "-1",
    "-i",
    backgroundMusicPath,
    "-t",
    job.durationSeconds.toFixed(6),
    "-filter_complex",
    `[2:a]volume=${backgroundMusicVolume}[music];[1:a][music]amix=inputs=2:duration=first:dropout_transition=0:normalize=0[a]`,
    "-map",
    "0:v",
    "-map",
    "[a]",
    "-vf",
    `fps=${job.fps},format=yuv420p`,
    "-c:v",
    "libx264",
    "-preset",
    "medium",
    "-crf",
    "18",
    "-c:a",
    "aac",
    "-b:a",
    "160k",
    "-movflags",
    "+faststart",
    job.outputPath,
  ]);
}

async function exportJob(browser, job) {
  const tempDir = mkdtempSync(path.join(tempRoot, `${job.id}-mode-export-`));
  const frameDir = path.join(tempDir, "frames");
  mkdirSync(frameDir, { recursive: true });

  const page = await browser.newPage({
    viewport: { width: job.width, height: job.height },
    deviceScaleFactor: 1,
  });

  try {
    const pageUrl = `http://127.0.0.1:${httpPort}${job.urlPath}`;
    console.log(`[${job.id}] loading ${pageUrl}`);
    await page.goto(pageUrl, { waitUntil: "load" });
    await page.evaluate(() => (document.fonts ? document.fonts.ready : Promise.resolve()));
    await page.waitForTimeout(250);

    if (job.startExpression) {
      await page.evaluate(job.startExpression);
    }

    const frameRecords = await captureFrames(page, job, frameDir);
    await encodeVideo(job, tempDir, frameRecords);
  } finally {
    await page.close().catch(() => undefined);

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

async function main() {
  if (!existsSync(chromePath)) {
    throw new Error(`Chrome was not found at ${chromePath}. Set CHROME_PATH to the Chromium/Chrome executable.`);
  }

  mkdirSync(videosDir, { recursive: true });
  mkdirSync(tempRoot, { recursive: true });

  const server = await startStaticServer();
  const browser = await chromium.launch({
    executablePath: chromePath,
    headless: true,
    args: [
      "--disable-gpu",
      "--disable-gpu-sandbox",
      "--disable-dev-shm-usage",
      "--disable-crash-reporter",
      "--disable-breakpad",
      "--disable-background-networking",
      "--hide-scrollbars",
      "--mute-audio",
      "--no-first-run",
      "--no-default-browser-check",
      "--autoplay-policy=no-user-gesture-required",
    ],
  });

  try {
    for (const job of jobs) {
      console.log(`Exporting ${job.id} mode to ${job.outputPath}`);
      await exportJob(browser, job);
    }
  } finally {
    await browser.close().catch(() => undefined);
    server.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
