import { spawn } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";

const chrome = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const userDataDir = `D:\\download\\landing\\landing-page\\.codex-temp\\browser-cdp-profile-${Date.now()}`;
const output = "D:\\download\\landing\\landing-page\\.codex-temp\\mindmap-preview.png";
const url = "http://localhost:3000/#mind-map-feature";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let chromeError = "";
const proc = spawn(chrome, [
  "--headless=new",
  "--disable-gpu",
  "--disable-dev-shm-usage",
  "--no-sandbox",
  "--no-first-run",
  "--no-default-browser-check",
  "--hide-scrollbars",
  "--remote-allow-origins=*",
  "--remote-debugging-port=0",
  `--user-data-dir=${userDataDir}`,
  "--window-size=1365,768",
  "about:blank",
], { stdio: ["ignore", "ignore", "pipe"] });

proc.stderr?.on("data", (chunk) => {
  chromeError += chunk.toString();
});

let id = 0;
let ws;
const pending = new Map();

function send(method, params = {}) {
  const messageId = ++id;
  ws.send(JSON.stringify({ id: messageId, method, params }));
  return new Promise((resolve, reject) => {
    pending.set(messageId, { resolve, reject });
  });
}

try {
  let port;
  for (let i = 0; i < 80; i += 1) {
    try {
      const activePort = await readFile(`${userDataDir}\\DevToolsActivePort`, "utf8");
      port = activePort.trim().split(/\r?\n/)[0];
      break;
    } catch {
      await sleep(100);
    }
  }

  let version;
  if (port) {
    version = await fetch(`http://127.0.0.1:${port}/json/version`).then((response) => response.json());
  }

  if (!version?.webSocketDebuggerUrl) {
    throw new Error(`Chrome DevTools endpoint did not start. ${chromeError}`);
  }

  ws = new WebSocket(version.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve, { once: true });
    ws.addEventListener("error", reject, { once: true });
  });

  ws.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(new Error(data.error.message));
      else resolve(data.result);
    }
  });

  const { targetId } = await send("Target.createTarget", { url });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });

  const sessionSend = (method, params = {}) => {
    const messageId = ++id;
    ws.send(JSON.stringify({ id: messageId, sessionId, method, params }));
    return new Promise((resolve, reject) => {
      pending.set(messageId, { resolve, reject });
    });
  };

  await sessionSend("Page.enable");
  await sessionSend("Emulation.setDeviceMetricsOverride", {
    width: 1365,
    height: 768,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await sleep(1400);
  await sessionSend("Runtime.evaluate", {
    expression: "document.getElementById('mind-map-feature')?.scrollIntoView({ block: 'center' });",
    awaitPromise: false,
  });
  await sleep(8200);
  const shot = await sessionSend("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
  });
  await writeFile(output, Buffer.from(shot.data, "base64"));
  console.log(output);
} finally {
  try {
    ws?.close();
  } catch {}
  proc.kill();
}
