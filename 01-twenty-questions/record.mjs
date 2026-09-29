// Records the demo to MP4 in real time (the Span-01 and Sonnet calls are live, so no virtual clock).
//   npm start   then, in another terminal,   npm run record -- [--out out/take.mp4] [--url http://localhost:4317/]
// Frames come from Chrome's screencast with their own timestamps; ffmpeg turns them into constant 30 fps.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const arg = (name, fallback) => { const i = process.argv.indexOf(`--${name}`); return i > 0 ? process.argv[i + 1] : fallback; };
const URL = arg("url", "http://localhost:4317/");
const OUT = path.resolve(DIR, arg("out", "out/twenty-tool-calls.mp4"));
const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const LEAD_IN = 1.5, HOLD_END = 3.5; // seconds of still frame before Space and after the last round

const frames = path.join(path.dirname(OUT), `frames-${path.basename(OUT, ".mp4")}`);
fs.rmSync(frames, { recursive: true, force: true });
fs.mkdirSync(frames, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME, headless: true,
  args: ["--window-size=1920,1080", "--force-device-scale-factor=1", "--disable-renderer-backgrounding", "--disable-background-timer-throttling", "--font-render-hinting=none"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
await page.goto(URL, { waitUntil: "networkidle0" });
await page.evaluate(() => document.fonts.ready);

const cdp = await page.createCDPSession();
const stamps = [];
cdp.on("Page.screencastFrame", async ({ data, metadata, sessionId }) => {
  const file = path.join(frames, `f${String(stamps.length).padStart(5, "0")}.jpg`);
  stamps.push({ file, t: metadata.timestamp });
  fs.writeFileSync(file, Buffer.from(data, "base64"));
  await cdp.send("Page.screencastFrameAck", { sessionId }).catch(() => {});
});
await cdp.send("Page.startScreencast", { format: "jpeg", quality: 95, maxWidth: 1920, maxHeight: 1080, everyNthFrame: 1 });
const t0 = Date.now();
await new Promise((r) => setTimeout(r, LEAD_IN * 1000));
await page.evaluate(() => window.__game.run()); // resolves after the last round
await new Promise((r) => setTimeout(r, HOLD_END * 1000));
await cdp.send("Page.stopScreencast");
const stats = await page.evaluate(() => window.__game.lanes.map((l) => l.el.querySelector(".stats").innerText.replace(/\s+/g, " ")));
await browser.close();

// Each frame lasts until the next one arrives; the last one covers the end hold.
const list = stamps.map((s, i) => `file '${s.file}'\nduration ${((stamps[i + 1]?.t ?? s.t + HOLD_END) - s.t).toFixed(4)}`).join("\n") + `\nfile '${stamps.at(-1).file}'\n`;
fs.writeFileSync(path.join(frames, "list.txt"), list);
const ff = spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", path.join(frames, "list.txt"),
  "-vf", "fps=30,scale=1920:1080:flags=lanczos,format=yuv420p", "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-movflags", "+faststart", OUT], { stdio: "inherit" });
if (ff.status !== 0) throw new Error("ffmpeg failed");
fs.rmSync(frames, { recursive: true, force: true });
console.log(`wrote ${path.relative(process.cwd(), OUT)} — ${stamps.length} frames over ${((Date.now() - t0) / 1000).toFixed(1)}s`);
console.log(`final stats (last round):\n  ${stats.join("\n  ")}`);
