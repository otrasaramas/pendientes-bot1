import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getBooks } from "@/lib/queries";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = "claude-sonnet-4-6";

const recommendTool: Anthropic.Tool = {
  name: "recomendar_lecturas",
  description: "Devuelve exactamente 3 recomendaciones de lectura para el usuario.",
  input_schema: {
    type: "object",
    properties: {
      recommendations: {
        type: "array",
        minItems: 3,
        maxItems: 3,
        items: {
          type: "object",
          properties: {
            book_id: {
              type: "string",
              description:
                "El id EXACTO del libro recomendado de la lista del usuario, o cadena vacía si es una sugerencia externa.",
            },
            title: { type: "string" },
            author: { type: "string" },
            reason: {
              type: "string",
              description: "1-2 frases personalizadas explicando por qué encaja ahora.",
            },
            in_library: {
              type: "boolean",
              description: "true si el libro está en la lista del usuario.",
            },
          },
          required: ["title", "reason", "in_library"],
        },
      },
    },
    required: ["recommendations"],
  },
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Falta ANTHROPIC_API_KEY en el servidor." },
      { status: 500 },
    );
  }

  let answers: { question: string; answer: string }[] = [];
  try {
    const body = await req.json();
    answers = Array.isArray(body?.answers) ? body.answers : [];
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const all = await getBooks();
  const candidates = all.filter(
    (b) => b.status === "por_leer" || b.status === "leyendo",
  );

  const catalog = candidates
    .map(
      (b) =>
        `- id:${b.id} | "${b.title}"${b.author ? ` de ${b.author}` : ""}` +
        `${b.genre ? ` | ${b.genre}` : ""}` +
        `${b.is_fiction === false ? " | no ficción" : b.is_fiction ? " | ficción" : ""}` +
        `${b.pages ? ` | ${b.pages} págs` : ""}` +
        `${b.categories?.length ? ` | etiquetas: ${b.categories.join(", ")}` : ""}`,
    )
    .join("\n");

  const quiz = answers
    .map((a) => `- ${a.question}: ${a.answer}`)
    .join("\n");

  const prompt = `Eres un librero experto y cálido que recomienda la próxima lectura.

Respuestas del lector a un breve cuestionario:
${quiz || "(sin respuestas)"}

Su lista de libros pendientes (por leer / leyendo):
${catalog || "(la lista está vacía)"}

Instrucciones:
1. Prioriza SIEMPRE libros de su lista pendiente que encajen con su estado de ánimo y preferencias. Usa el id EXACTO y marca in_library = true.
2. Si su lista tiene menos de 3 opciones adecuadas, completa con sugerencias externas conocidas (book_id vacío, in_library = false).
3. Da exactamente 3 recomendaciones, variadas entre sí.
4. Cada "reason" debe ser personal y mencionar por qué encaja con sus respuestas de HOY.`;

  try {
    const anthropic = new Anthropic({ apiKey });
    const resp = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1024,
      tools: [recommendTool],
      tool_choice: { type: "tool", name: "recomendar_lecturas" },
      messages: [{ role: "user", content: prompt }],
    });

    const toolUse = resp.content.find(
      (b): b is Anthropic.ToolUseBlock => b.type === "tool_use",
    );
    const recs =
      (toolUse?.input as { recommendations?: unknown[] })?.recommendations ?? [];

    return NextResponse.json({ recommendations: recs });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json(
      { error: `Error generando recomendaciones: ${message}` },
      { status: 502 },
    );
  }
}
