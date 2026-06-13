import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { GENRES } from "@/lib/categories";
import type { BookAnalysis } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = "claude-sonnet-4-6";

const analysisTool: Anthropic.Tool = {
  name: "registrar_libro",
  description:
    "Registra los datos estructurados de un libro identificado a partir de su portada o de un texto.",
  input_schema: {
    type: "object",
    properties: {
      title: { type: "string", description: "Título del libro" },
      author: { type: "string", description: "Autor/a. Cadena vacía si no se conoce." },
      is_fiction: {
        type: "boolean",
        description: "true si es ficción, false si es no ficción",
      },
      genre: {
        type: "string",
        description: `Género principal. Elige preferentemente uno de: ${GENRES.join(", ")}.`,
      },
      categories: {
        type: "array",
        items: { type: "string" },
        description:
          "2 a 4 etiquetas temáticas en minúsculas (ej: 'distopía', 'feminismo', 'aventuras').",
      },
      description: {
        type: "string",
        description: "Sinopsis breve (1-2 frases) en español.",
      },
      pages: { type: "integer", description: "Número aproximado de páginas, 0 si se desconoce." },
      year: { type: "integer", description: "Año de publicación, 0 si se desconoce." },
      language: { type: "string", description: "Idioma del libro (ej: Español, Inglés)." },
    },
    required: ["title", "is_fiction", "genre", "categories"],
  },
};

function normalize(input: Record<string, unknown>): BookAnalysis {
  const num = (v: unknown) => {
    const n = typeof v === "number" ? v : parseInt(String(v ?? ""), 10);
    return Number.isFinite(n) && n > 0 ? n : null;
  };
  const str = (v: unknown) => {
    const s = String(v ?? "").trim();
    return s.length ? s : null;
  };
  return {
    title: str(input.title) ?? "",
    author: str(input.author),
    is_fiction: typeof input.is_fiction === "boolean" ? input.is_fiction : null,
    genre: str(input.genre),
    categories: Array.isArray(input.categories)
      ? input.categories.map((c) => String(c).trim()).filter(Boolean)
      : [],
    description: str(input.description),
    pages: num(input.pages),
    year: num(input.year),
    language: str(input.language),
  };
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Falta ANTHROPIC_API_KEY en el servidor." },
      { status: 500 },
    );
  }

  let body: { image?: string; mediaType?: string; text?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const { image, mediaType, text } = body;
  if (!image && !text) {
    return NextResponse.json(
      { error: "Envía una imagen (base64) o un texto/título." },
      { status: 400 },
    );
  }

  const anthropic = new Anthropic({ apiKey });

  const content: Anthropic.ContentBlockParam[] = [];
  if (image) {
    // `image` viene como base64 puro (sin el prefijo data:).
    content.push({
      type: "image",
      source: {
        type: "base64",
        media_type: (mediaType as "image/jpeg") ?? "image/jpeg",
        data: image,
      },
    });
    content.push({
      type: "text",
      text: "Identifica el libro de esta portada y registra sus datos. Si reconoces la obra, completa el género, sinopsis, año y páginas con tu conocimiento.",
    });
  } else {
    content.push({
      type: "text",
      text: `Identifica este libro y registra sus datos a partir de la siguiente referencia (título y/o autor): "${text}". Completa el resto de campos con tu conocimiento de la obra.`,
    });
  }

  try {
    const resp = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1024,
      tools: [analysisTool],
      tool_choice: { type: "tool", name: "registrar_libro" },
      messages: [{ role: "user", content }],
    });

    const toolUse = resp.content.find(
      (b): b is Anthropic.ToolUseBlock => b.type === "tool_use",
    );
    if (!toolUse) {
      return NextResponse.json(
        { error: "No pude identificar el libro. Intenta con otra imagen o escribe el título." },
        { status: 422 },
      );
    }

    const analysis = normalize(toolUse.input as Record<string, unknown>);
    return NextResponse.json({ analysis });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json(
      { error: `Error analizando con IA: ${message}` },
      { status: 502 },
    );
  }
}
