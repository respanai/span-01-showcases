// Sonnet 5.5 + Span-01: Sonnet plays twenty questions and writes its own questions.
// Its ask() tool is Span-01: one request answers the whole batch about the secret (every question is a
// parallel branch of one forward pass), and Span-01 checks which candidates still fit the answers.
// Sonnet runs on the Anthropic API when ANTHROPIC_API_KEY is set, otherwise through the Respan gateway's
// Anthropic passthrough with the same RESPAN_API_KEY.
import Anthropic from "@anthropic-ai/sdk";
import { EMOJIS, QUESTIONS, spanFor, definitionFor } from "./data.mjs";
import { KEY, score } from "./span.mjs";

const client = process.env.ANTHROPIC_API_KEY
  ? new Anthropic()
  : new Anthropic({ baseURL: "https://api.respan.ai/api/anthropic/", apiKey: KEY });
export const VIA = process.env.ANTHROPIC_API_KEY ? "the Anthropic API" : "the Respan gateway";
export const SONNET = "claude-sonnet-5-5";
export const EFFORT = "low";
const PRICE = { input: 2 / 1e6, output: 10 / 1e6, cacheRead: 0.2 / 1e6, span: 0.02 / 1e6 }; // $/token, list price

const SYSTEM = `We're playing twenty questions. I've picked one secret emoji from the candidates below. Find it in as few tool calls as possible.

ask() takes a list of yes-or-no questions; every question in one call is answered at once, so it's usually fastest to ask about 20 well-chosen questions in your first call. Its result also lists the candidates that still fit every answer. guess() takes a candidate's name.

Candidates:
${EMOJIS.map(([e, name]) => `${e} ${name}`).join("\n")}`;

const TOOLS = [
  {
    name: "ask",
    description: "Ask yes-or-no questions about the secret emoji. Pass as many questions as you like: they are answered in parallel, so extra questions in the same call add no time.",
    input_schema: {
      type: "object",
      properties: { questions: { type: "array", items: { type: "string" } } },
      required: ["questions"],
      additionalProperties: false,
    },
    strict: true,
  },
  {
    name: "guess",
    description: "Guess the secret emoji by its candidate name.",
    input_schema: {
      type: "object",
      properties: { name: { type: "string" } },
      required: ["name"],
      additionalProperties: false,
    },
    strict: true,
  },
];

const WORD = { Y: "yes", N: "no", "?": "can't tell" };
const norm = (q) => q.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
const BANK = new Map(QUESTIONS.map((q, i) => [norm(q), i]));
const agree = (a, b) => a === b || a === "?" || b === "?";

// Plays one game; emit() receives progress events for the UI. `rows` is the precomputed Span-01 board
// (emoji × QUESTIONS labels), used for questions Sonnet words exactly like one in the bank.
export async function play(secret, rows, emit = () => {}) {
  const messages = [{ role: "user", content: "I've picked my emoji. Go." }];
  let alive = EMOJIS.map((_, i) => i);
  const usage = { calls: 0, sonnetTokens: 0, spanTokens: 0, cost: 0 };
  const spend = (r) => { usage.spanTokens += r.tokens; usage.cost += r.tokens * PRICE.span; };
  const report = () => emit({ type: "usage", ...usage });

  for (let turn = 0; turn < 20 && usage.calls < 20; turn++) {
    emit({ type: "thinking" });
    const t0 = performance.now();
    const res = await client.messages.create({ model: SONNET, max_tokens: 16000, system: SYSTEM, tools: TOOLS, messages, output_config: { effort: EFFORT } });
    const sonnetMs = performance.now() - t0;
    const u = res.usage;
    usage.sonnetTokens += u.input_tokens + (u.cache_creation_input_tokens ?? 0) + (u.cache_read_input_tokens ?? 0) + u.output_tokens;
    usage.cost += (u.input_tokens + (u.cache_creation_input_tokens ?? 0)) * PRICE.input + (u.cache_read_input_tokens ?? 0) * PRICE.cacheRead + u.output_tokens * PRICE.output;
    messages.push({ role: "assistant", content: res.content });
    if (res.stop_reason === "refusal") throw new Error("Sonnet refused");

    const uses = res.content.filter((b) => b.type === "tool_use");
    if (!uses.length) {
      report();
      messages.push({ role: "user", content: "Use ask() or guess()." });
      continue;
    }
    const results = [];
    for (const use of uses) {
      usage.calls++;
      if (use.name === "ask") {
        const questions = use.input.questions.filter((q) => q.trim()).slice(0, 60);
        emit({ type: "ask", questions, sonnetMs });
        const t1 = performance.now();
        // Questions worded like a bank question are already on the board: narrow instantly.
        const known = questions.map((q) => BANK.get(norm(q)));
        alive = alive.filter((i) => known.every((b, k) => b === undefined || agree(rows[i][b], rows[secret][b])));
        // Then, in parallel: one Span-01 request answers every question about the secret, and each
        // remaining candidate is checked on the questions the board doesn't cover.
        const fresh = known.map((b, k) => (b === undefined ? k : -1)).filter((k) => k >= 0);
        const toBehaviors = (ks) => ks.map((k) => ({ id: `q${k}`, definition: definitionFor(questions[k]) }));
        const check = fresh.length > 0 && alive.length <= 40; // a wide-open field isn't worth the wait; narrow it next round
        const others = check ? alive.filter((i) => i !== secret) : [];
        const [answer, ...checks] = await Promise.all([
          score(spanFor(EMOJIS[secret]), toBehaviors(questions.map((_, k) => k))),
          ...others.map((i) => score(spanFor(EMOJIS[i]), toBehaviors(fresh))),
        ]);
        [answer, ...checks].forEach(spend);
        const fits = new Set(others.filter((i, n) => checks[n].labels.every((l, m) => agree(l, answer.labels[fresh[m]]))));
        if (check) alive = alive.filter((i) => i === secret || fits.has(i));
        const spanMs = performance.now() - t1;
        emit({ type: "answers", questions, answers: answer.labels, alive, spanMs, checked: others.length });
        results.push({
          type: "tool_result",
          tool_use_id: use.id,
          content:
            questions.map((q, k) => `${q} ${WORD[answer.labels[k]]}`).join("\n") +
            `\n\nStill fits (${alive.length}): ${alive.map((i) => `${EMOJIS[i][0]} ${EMOJIS[i][1]}`).join(", ")}`,
        });
      } else {
        const name = String(use.input.name ?? "").trim().toLowerCase();
        const g = EMOJIS.findIndex(([e, n]) => n.toLowerCase() === name || name.includes(e) || name.endsWith(n.toLowerCase()));
        const correct = g === secret;
        if (!correct && g >= 0) alive = alive.filter((i) => i !== g);
        emit({ type: "guess", index: g, name: use.input.name, correct, sonnetMs, alive });
        results.push({ type: "tool_result", tool_use_id: use.id, content: correct ? "Correct!" : "No, that's not it." });
        if (correct) { report(); emit({ type: "done", ...usage }); return usage; }
      }
    }
    report();
    messages.push({ role: "user", content: results });
  }
  emit({ type: "done", ...usage, failed: true });
  return usage;
}
