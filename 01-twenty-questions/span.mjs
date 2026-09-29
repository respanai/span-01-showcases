// Span-01 client shared by the server and the Sonnet agent. Reads RESPAN_API_KEY from ./.env or the environment.
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIR = path.dirname(fileURLToPath(import.meta.url));
try { process.loadEnvFile(path.join(DIR, ".env")); } catch {} // no .env is fine if the variables are already set

export const MODEL = process.env.SPAN_MODEL || "span-01-pro";
export const KEY = process.env.RESPAN_API_KEY;
if (!KEY) throw new Error("Set RESPAN_API_KEY in .env (see .env.example)");

const label = (r) =>
  r.p_present >= r.p_absent && r.p_present >= r.p_not_observable ? "Y" : r.p_absent >= r.p_not_observable ? "N" : "?";

// One request: every behavior is scored as a parallel branch over the same span.
export async function score(span, behaviors) {
  const started = performance.now();
  for (let attempt = 0; ; attempt++) {
    const res = await fetch("https://api.respan.ai/api/v1/scores", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${KEY}` },
      body: JSON.stringify({ model: MODEL, span, behaviors }),
    });
    if (res.ok) {
      const body = await res.json();
      return {
        labels: body.results.map(label),
        tokens: body.usage?.input_tokens ?? 0,
        upstream_ms: Math.round(performance.now() - started),
      };
    }
    const text = await res.text();
    if (attempt >= 3 || (res.status !== 429 && res.status < 500)) throw new Error(`Span-01 HTTP ${res.status}: ${text.slice(0, 300)}`);
    await new Promise((r) => setTimeout(r, 600 * 2 ** attempt));
  }
}
