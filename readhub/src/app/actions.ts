"use server";

import { revalidatePath } from "next/cache";
import { getSupabase } from "@/lib/supabase";
import type { BookInput, BookStatus } from "@/lib/types";

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/biblioteca");
  revalidatePath("/tablero");
  revalidatePath("/estadisticas");
  revalidatePath("/recomendar");
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
