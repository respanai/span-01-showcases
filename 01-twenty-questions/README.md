# 01 · Twenty questions

[![Sonnet 5.5 vs. Sonnet 5.5 + Span-01, in real time](docs/demo.gif)](docs/demo.mp4)

▶ [Full video](docs/demo.mp4): 1920×1080, 41 s, real time, not sped up.

Sonnet 5.5 plays twenty questions with two tools, `ask()` and `guess()`. Its `ask()` tool is **Span-01**, Respan's decision model. Sonnet writes a batch of yes-or-no questions, and Span-01 answers all of them in a single forward pass: each question is a parallel branch over the same context, and no text is generated. Span-01 then checks which emojis still fit every answer, so Sonnet can go straight to a guess.

Inspired by [@edwinarbus's "Twenty tool calls"](https://x.com/edwinarbus/status/2104643996123603407), where Sonnet 5.5 asks one question per tool call. The demo page replays that original run at 1× next to a live Sonnet 5.5 + Span-01 game on the same three emojis.

## Run it

You need Node 20.12+ and a [Respan API key](https://platform.respan.ai/platform/api/api-keys) with Span-01 access. Span-01 is in early access; see the [quickstart](https://www.respan.ai/docs/documentation/span-01/quickstart).

```bash
cd 01-twenty-questions
cp .env.example .env   # add RESPAN_API_KEY
npm install
npm start              # http://localhost:4317, then press Space
```

Sonnet 5.5 runs through the Respan gateway with the same key. To call the Anthropic API directly instead, set `ANTHROPIC_API_KEY` in `.env`.

- `?secrets=Pizza,Rocket` plays other emojis (any name from `data.mjs`). Only the three original emojis have a replay on the left.
- `?hold=4000` changes the pause between rounds, in milliseconds.
- Press `R` to reset.

A full three-round game costs about $0.04, almost all of it Sonnet.

## How it works

| File | What it does |
|---|---|
| `agent.mjs` | Sonnet 5.5 (`claude-sonnet-5-5`, low effort) with `ask(questions[])` and `guess(name)`. |
| `span.mjs` | One call to `POST https://api.respan.ai/api/v1/scores`: every question becomes a behavior definition, and Span-01 returns `p_present` / `p_absent` / `p_not_observable` for each. |
| `data.mjs` | 100 emojis, each with a one-line description (Span-01 decides from evidence in the span), a 58-question bank, and the original Sonnet 5.5 run read frame by frame from the video. |
| `board.json` | 100 emojis × 58 bank questions = 5,800 Span-01 decisions, precomputed. Delete it to rebuild on the next start. |
| `server.mjs` | Serves the page, keeps the keys server-side, and streams each live game as newline-delimited JSON. |
| `index.html` | The 1920×1080 demo page. |
| `record.mjs` | Optional. Records the page to MP4 in real time with Chrome and ffmpeg: `npm run record`. |

One `ask()` is one Span-01 request:

```js
await fetch("https://api.respan.ai/api/v1/scores", {
  method: "POST",
  headers: { "content-type": "application/json", authorization: `Bearer ${RESPAN_API_KEY}` },
  body: JSON.stringify({
    model: "span-01-pro",
    span: {
      input: [{ role: "user", content: "Which emoji are you thinking of?" }],
      output: { role: "assistant", content: "The secret emoji is 🪙 Coin. A round, flat metal disc used as money." },
    },
    behaviors: questions.map((q, i) => ({
      id: `q${i}`,
      definition: `The thing the assistant names is an object for which the answer to "${q}" is yes, using common knowledge about that object.`,
    })),
  }),
});
// results[i] holds p_present / p_absent / p_not_observable for question i, all from one forward pass.
```

To work out which emojis still fit, questions worded exactly like a bank question are looked up in `board.json`. Span-01 checks the rest live against the remaining candidates, in parallel with the answer request.

## One run

From one recorded run; live results vary from run to run.

| Emoji | Sonnet 5.5 (original) | Sonnet 5.5 + Span-01 |
|---|---|---|
| 🏸 Badminton racket | 15 tool calls · 12.6 s · $0.060 | 3 tool calls · 6.9 s · $0.015 |
| ☎️ Telephone | 9 tool calls · 6.9 s · $0.033 | 2 tool calls · 4.1 s · $0.010 |
| 🪙 Coin | 9 tool calls · 6.5 s · $0.034 | 2 tool calls · 4.4 s · $0.010 |

## Caveats

- The left card replays the original run; it doesn't run live. That run used Claude Code defaults and a 365-emoji pool. This demo uses 100 emojis.
- Sonnet's system prompt says `ask()` answers questions in parallel, so asking about 20 at once is fastest.
- Sonnet's cost is computed at list price ($2 / $10 per million input / output tokens), Span-01's at $0.02 per million input tokens.
