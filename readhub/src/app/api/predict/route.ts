import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getBooks, getReviews, computeTasteProfile } from "@/lib/queries";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = "claude-sonnet-4-6";

const predictTool: Anthropic.Tool = {
  name: "predecir_afinidad",
  description: "Predice qué tanto le gustará un libro al lector según su perfil de gusto.",
  input_schema: {
    type: "object",
    properties: {
      match: {
        type: "integer",
        description: "Porcentaje de afinidad estimado (0-100).",
      },
      verdict: {
        type: "string",
        description: "Veredicto corto, ej: 'Te encantará', 'Probablemente sí', 'Quizá no sea para ti'.",
      },
      reasons: {
        type: "array",
        items: { type: "string" },
        description: "2-3 razones breves y personales basadas en su historial.",
      },
    },
    required: ["match", "verdict", "reasons"],
  },
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Falta ANTHROPIC_API_KEY." }, { status: 500 });
  }

  let bookId = "";
  try {
    bookId = (await req.json())?.bookId ?? "";
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const [books, reviews] = await Promise.all([getBooks(), getReviews()]);
  const target = books.find((b) => b.id === bookId);
  if (!target) {
    return NextResponse.json({ error: "Libro no encontrado." }, { status: 404 });
  }

  const profile = computeTasteProfile(reviews, books);
  const byId = new Map(books.map((b) => [b.id, b]));

  const history = reviews
    .slice(0, 12)
    .map((r) => {
      const b = byId.get(r.book_id);
      if (!b) return "";
      return `- "${b.title}"${b.genre ? ` (${b.genre})` : ""}: ${r.rating ?? "?"}/5${
        r.liked ? " ❤" : ""
      }${r.loved?.length ? `, le gustó: ${r.loved.join(", ")}` : ""}${
        r.moods?.length ? `, se sintió: ${r.moods.join(", ")}` : ""
      }${r.review ? ` — "${r.review}"` : ""}`;
    })
    .filter(Boolean)
    .join("\n");

  const prompt = `Eres un experto en gustos lectores. Estima qué tanto le gustará un libro a esta lectora.

Perfil de gusto (resumen): ${profile.summary || "todavía con pocos datos"}.

Historial de reseñas:
${history || "(aún no tiene reseñas)"}

Libro a evaluar:
- Título: "${target.title}"
- Autor: ${target.author ?? "desconocido"}
- Género: ${target.genre ?? "desconocido"}
- ${target.is_fiction === false ? "No ficción" : target.is_fiction ? "Ficción" : "Tipo desconocido"}
- Etiquetas: ${target.categories?.join(", ") || "—"}
${target.description ? `- Sinopsis: ${target.description}` : ""}

Estima un porcentaje de afinidad (0-100), un veredicto corto y 2-3 razones personales basadas en SU historial. Si hay pocos datos, sé honesta sobre la incertidumbre.`;

  try {
    const anthropic = new Anthropic({ apiKey });
    const resp = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 700,
      tools: [predictTool],
      tool_choice: { type: "tool", name: "predecir_afinidad" },
      messages: [{ role: "user", content: prompt }],
    });
    const toolUse = resp.content.find(
      (b): b is Anthropic.ToolUseBlock => b.type === "tool_use",
    );
    if (!toolUse) {
      return NextResponse.json({ error: "No se pudo predecir." }, { status: 422 });
    }
    const out = toolUse.input as { match: number; verdict: string; reasons: string[] };
    const match = Math.max(0, Math.min(100, Math.round(out.match)));
    return NextResponse.json({ match, verdict: out.verdict, reasons: out.reasons ?? [] });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: `Error al predecir: ${message}` }, { status: 502 });
  }
}
