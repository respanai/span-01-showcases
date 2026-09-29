// Twenty questions: Sonnet 5.5 vs. Sonnet 5.5 + Span-01. Local server for the demo page.
//   npm install && npm start   →   http://localhost:4317
// Keeps the API keys server-side and runs the live Sonnet + Span-01 agent, streaming its steps.
// board.json is every emoji scored by Span-01 against every bank question (one request per emoji,
// all questions as parallel branches); delete it to rebuild on the next start.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { EMOJIS, QUESTIONS, ORIGINAL, spanFor, behaviorFor } from "./data.mjs";
import { MODEL, score } from "./span.mjs";
import { play, SONNET, EFFORT, VIA } from "./agent.mjs";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 4317);
const BOARD = path.join(DIR, "board.json");

const scoreEmoji = (i, qs) => score(spanFor(EMOJIS[i]), qs.map(behaviorFor));

async function buildBoard() {
  const all = QUESTIONS.map((_, q) => q);
  const started = performance.now();
  const rows = new Array(EMOJIS.length);
  const queue = EMOJIS.map((_, i) => i);
  await Promise.all(
    Array.from({ length: 16 }, async () => {
      while (queue.length) {
        const i = queue.shift();
        rows[i] = (await scoreEmoji(i, all)).labels.join("");
      }
    }),
  );
  const board = { model: MODEL, emojis: EMOJIS.length, questions: QUESTIONS.length, rows };
  fs.writeFileSync(BOARD, JSON.stringify(board));
  console.log(
    `board: ${EMOJIS.length} emojis × ${QUESTIONS.length} questions = ${EMOJIS.length * QUESTIONS.length} Span-01 decisions in ${((performance.now() - started) / 1000).toFixed(1)}s`,
  );
  return board;
}

const board = fs.existsSync(BOARD) ? JSON.parse(fs.readFileSync(BOARD, "utf8")) : await buildBoard();
if (board.rows.length !== EMOJIS.length || board.rows[0].length !== QUESTIONS.length) {
  throw new Error("board.json is stale — delete it and restart");
}
await scoreEmoji(0, [0]); // warm the upstream connection so the first on-camera ask() isn't a cold TLS handshake

const STATIC = { "/": ["index.html", "text/html; charset=utf-8"], "/wordmark.png": ["respan-wordmark-black.png", "image/png"] };

http
  .createServer(async (req, res) => {
    try {
      if (req.method === "GET" && STATIC[req.url.split("?")[0]]) {
        const [file, type] = STATIC[req.url.split("?")[0]];
        res.writeHead(200, { "content-type": type, "cache-control": "no-store" });
        return res.end(fs.readFileSync(path.join(DIR, file)));
      }
      if (req.method === "GET" && req.url === "/data") {
        res.writeHead(200, { "content-type": "application/json" });
        return res.end(JSON.stringify({ model: MODEL, sonnet: SONNET, effort: EFFORT, via: VIA, emojis: EMOJIS, questions: QUESTIONS, rows: board.rows, original: ORIGINAL }));
      }
      if (req.method === "GET" && req.url.startsWith("/api/agent?")) {
        // One live game, streamed as newline-delimited JSON events (plain fetch, so nothing auto-reconnects and replays a paid run).
        const secret = Number(new URL(req.url, "http://localhost").searchParams.get("secret"));
        if (!Number.isInteger(secret) || !EMOJIS[secret]) return res.writeHead(400).end();
        res.writeHead(200, { "content-type": "application/x-ndjson", "cache-control": "no-store" });
        const send = (event) => res.write(JSON.stringify(event) + "\n");
        try {
          await play(secret, board.rows, send);
        } catch (error) {
          console.error(error);
          send({ type: "error", message: String(error.message || error) });
        }
        return res.end();
      }
      res.writeHead(404).end();
    } catch (error) {
      console.error(error);
      res.writeHead(500, { "content-type": "application/json" }).end(JSON.stringify({ error: String(error.message || error) }));
    }
  })
  .listen(PORT, () => console.log(`Twenty Tool Calls (${SONNET} + ${MODEL}) → http://localhost:${PORT}`));
