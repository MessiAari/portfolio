import { GoogleGenAI } from "@google/genai";
import { buildSystemPrompt } from "@/lib/portfolio-data";

type ChatMessage = { role: "user" | "assistant"; content: string };

const MODEL = "gemini-2.5-flash";
const MAX_MESSAGES = 12; // only the most recent turns are sent to Gemini
const MAX_CHARS = 1000; // per message

function isChatMessage(value: unknown): value is ChatMessage {
  const m = value as ChatMessage;
  return (
    typeof m === "object" &&
    m !== null &&
    (m.role === "user" || m.role === "assistant") &&
    typeof m.content === "string" &&
    m.content.trim().length > 0
  );
}

/**
 * POST /api/chat — body: { messages: [{ role: "user" | "assistant", content }] }
 * Returns { reply } on success, or { error } with a non-200 status.
 * Runs only on the server, so GEMINI_API_KEY never reaches the browser.
 */
export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set");
    return Response.json({ error: "The chatbot is not configured yet." }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const raw = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(raw) || !raw.every(isChatMessage)) {
    return Response.json({ error: "Expected { messages: [{ role, content }] }." }, { status: 400 });
  }

  // Keep the latest turns; Gemini expects the conversation to start with a user turn.
  const history = raw.slice(-MAX_MESSAGES);
  while (history.length && history[0].role !== "user") history.shift();
  if (!history.length || history[history.length - 1].role !== "user") {
    return Response.json({ error: "The last message must come from the user." }, { status: 400 });
  }

  const contents = history.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content.slice(0, MAX_CHARS) }],
  }));

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: MODEL,
      contents,
      config: {
        systemInstruction: buildSystemPrompt(),
        temperature: 0.4,
        maxOutputTokens: 800,
        thinkingConfig: { thinkingBudget: 0 }, // fast, direct answers
      },
    });

    const reply = response.text?.trim();
    if (!reply) {
      return Response.json({ error: "The AI returned an empty reply." }, { status: 502 });
    }
    return Response.json({ reply });
  } catch (error) {
    const status = (error as { status?: number }).status;
    console.error("Gemini request failed:", error);
    if (status === 429) {
      return Response.json({ error: "The AI quota is used up for now." }, { status: 429 });
    }
    return Response.json({ error: "Could not reach the AI." }, { status: 502 });
  }
}
