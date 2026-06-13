"use server";

import { revalidatePath } from "next/cache";
import { getSupabase } from "@/lib/supabase";
import type { BookInput, BookStatus, ReviewInput } from "@/lib/types";

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/biblioteca");
  revalidatePath("/tablero");
  revalidatePath("/estadisticas");
  revalidatePath("/recomendar");
  revalidatePath("/habito");
  revalidatePath("/diario");
}

function cleanInput(input: BookInput): BookInput {
  const out: BookInput = { ...input };
  // Normaliza strings vacíos a null para campos opcionales.
  for (const key of Object.keys(out) as (keyof BookInput)[]) {
    const v = out[key];
    if (v === "" || v === undefined) {
      // @ts-expect-error índice dinámico
      out[key] = null;
    }
  }
  return out;
}

export async function createBook(input: BookInput) {
  const data = cleanInput(input);
  if (!data.title) throw new Error("El título es obligatorio.");
  const { data: row, error } = await getSupabase()
    .from("books")
    .insert({ ...data, status: data.status ?? "por_leer" })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  revalidateAll();
  return row.id as string;
}

export async function updateBook(id: string, input: BookInput) {
  const data = cleanInput(input);
  const { error } = await getSupabase()
    .from("books")
    .update(data)
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAll();
}

export async function deleteBook(id: string) {
  const { error } = await getSupabase().from("books").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAll();
}

/** Cambia el estado de un libro (usado por el tablero y los detalles). */
export async function setBookStatus(id: string, status: BookStatus) {
  const patch: BookInput = { status };
  // Al marcar como leído, registramos la fecha si aún no existe.
  if (status === "leido") patch.date_finished = new Date().toISOString().slice(0, 10);
  if (status === "leyendo") patch.date_started = new Date().toISOString().slice(0, 10);
  const { error } = await getSupabase()
    .from("books")
    .update(patch)
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAll();
}

export async function setBookRating(id: string, rating: number | null) {
  const { error } = await getSupabase()
    .from("books")
    .update({ rating })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAll();
}

// ── Diario de lecturas (reseñas) ────────────────────────────────────────────

/**
 * Guarda (inserta o actualiza) la reseña de un libro y lo marca como leído.
 */
export async function saveReview(bookId: string, input: ReviewInput) {
  const sb = getSupabase();
  const row = {
    book_id: bookId,
    rating: input.rating ?? null,
    liked: input.liked ?? null,
    pace: input.pace ?? null,
    loved: input.loved ?? [],
    moods: input.moods ?? [],
    would_recommend: input.would_recommend ?? null,
    review: input.review?.trim() || null,
  };
  const { error } = await sb.from("reviews").upsert(row, { onConflict: "book_id" });
  if (error) throw new Error(error.message);

  // Marca el libro como leído y sincroniza la valoración.
  const patch: BookInput = {
    status: "leido",
    date_finished: new Date().toISOString().slice(0, 10),
  };
  if (input.rating != null) patch.rating = input.rating;
  await sb.from("books").update(patch).eq("id", bookId);

  revalidateAll();
}

export async function deleteReview(bookId: string) {
  const { error } = await getSupabase().from("reviews").delete().eq("book_id", bookId);
  if (error) throw new Error(error.message);
  revalidateAll();
}

// ── Tracker de lectura ──────────────────────────────────────────────────────

/** Marca/desmarca un día como leído. Devuelve el nuevo estado (true = leído). */
export async function toggleReadingDay(day: string): Promise<boolean> {
  const sb = getSupabase();
  const { data: existing, error: selErr } = await sb
    .from("reading_log")
    .select("id")
    .eq("day", day)
    .maybeSingle();
  if (selErr) throw new Error(selErr.message);

  if (existing) {
    const { error } = await sb.from("reading_log").delete().eq("id", existing.id);
    if (error) throw new Error(error.message);
    revalidatePath("/habito");
    revalidatePath("/");
    return false;
  }
  const { error } = await sb.from("reading_log").insert({ day });
  if (error) throw new Error(error.message);
  revalidatePath("/habito");
  revalidatePath("/");
  return true;
}

/**
 * Registra las páginas leídas en un día. Si pages > 0, marca el día como leído
 * (inserta o actualiza). Si pages es 0/null, elimina el registro de ese día.
 * Devuelve las páginas guardadas (0 si se quitó).
 */
export async function setReadingPages(
  day: string,
  pages: number | null,
): Promise<number> {
  const sb = getSupabase();
  const p = pages && pages > 0 ? Math.round(pages) : 0;

  if (p === 0) {
    const { error } = await sb.from("reading_log").delete().eq("day", day);
    if (error) throw new Error(error.message);
    revalidatePath("/habito");
    revalidatePath("/");
    return 0;
  }

  const { error } = await sb
    .from("reading_log")
    .upsert({ day, pages: p }, { onConflict: "day" });
  if (error) throw new Error(error.message);
  revalidatePath("/habito");
  revalidatePath("/");
  return p;
}

/** Actualiza detalles (minutos/nota) de un día ya marcado. */
export async function updateReadingDay(
  day: string,
  patch: { minutes?: number | null; pages?: number | null; note?: string | null },
) {
  const { error } = await getSupabase()
    .from("reading_log")
    .update(patch)
    .eq("day", day);
  if (error) throw new Error(error.message);
  revalidatePath("/habito");
}

/** Reordena/mueve un libro dentro del tablero. */
export async function moveBook(
  id: string,
  status: BookStatus,
  position: number,
) {
  const patch: Record<string, unknown> = { status, position };
  if (status === "leido") patch.date_finished = new Date().toISOString().slice(0, 10);
  const { error } = await getSupabase().from("books").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAll();
}
