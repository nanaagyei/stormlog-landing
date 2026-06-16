// Tiny provider-agnostic AI client used by generate-updates.mjs.
//
// We try providers in priority order based on which API keys are present:
//   1. Anthropic    (claude-haiku-4-5)        — quality & voice match
//   2. Google AI    (gemini-2.0-flash)        — generous free tier
//   3. Groq         (llama-3.3-70b-versatile) — fastest free tier
//
// Each provider takes a system prompt + user prompt and returns the model's
// text response. We ask every provider to return raw JSON so the caller can
// validate against `updates.schema.json`.

const ANTHROPIC_MODEL = "claude-haiku-4-5";
const GEMINI_MODEL = "gemini-2.0-flash";
const GROQ_MODEL = "llama-3.3-70b-versatile";

function stripCodeFence(text) {
  // Models sometimes wrap JSON in ```json ... ``` fences — strip them.
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

async function callAnthropic({ apiKey, systemPrompt, userPrompt }) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });
  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Anthropic ${res.status}: ${errBody.slice(0, 300)}`);
  }
  const data = await res.json();
  const text = data?.content?.[0]?.text;
  if (typeof text !== "string") {
    throw new Error("Anthropic response missing text content");
  }
  return stripCodeFence(text);
}

async function callGemini({ apiKey, systemPrompt, userPrompt }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { role: "system", parts: [{ text: systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.4,
        maxOutputTokens: 2048,
      },
    }),
  });
  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Gemini ${res.status}: ${errBody.slice(0, 300)}`);
  }
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof text !== "string") {
    throw new Error("Gemini response missing text content");
  }
  return stripCodeFence(text);
}

async function callGroq({ apiKey, systemPrompt, userPrompt }) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0.4,
      max_tokens: 2048,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });
  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Groq ${res.status}: ${errBody.slice(0, 300)}`);
  }
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (typeof text !== "string") {
    throw new Error("Groq response missing text content");
  }
  return stripCodeFence(text);
}

export function detectProvider(env = process.env) {
  if (env.ANTHROPIC_API_KEY) {
    return { name: "anthropic", model: ANTHROPIC_MODEL, apiKey: env.ANTHROPIC_API_KEY };
  }
  if (env.GEMINI_API_KEY || env.GOOGLE_API_KEY) {
    return {
      name: "gemini",
      model: GEMINI_MODEL,
      apiKey: env.GEMINI_API_KEY || env.GOOGLE_API_KEY,
    };
  }
  if (env.GROQ_API_KEY) {
    return { name: "groq", model: GROQ_MODEL, apiKey: env.GROQ_API_KEY };
  }
  return null;
}

export async function generateJson({ provider, systemPrompt, userPrompt }) {
  const call =
    provider.name === "anthropic"
      ? callAnthropic
      : provider.name === "gemini"
        ? callGemini
        : callGroq;
  const raw = await call({ apiKey: provider.apiKey, systemPrompt, userPrompt });
  try {
    return JSON.parse(raw);
  } catch (err) {
    throw new Error(
      `Provider ${provider.name} returned invalid JSON: ${err.message}\n--- raw ---\n${raw.slice(0, 500)}`
    );
  }
}
