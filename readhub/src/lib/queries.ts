import "server-only";
import { getSupabase, isSupabaseConfigured } from "./supabase";
import type { Book, BookStatus } from "./types";

/** Devuelve todos los libros ordenados. Lista vacía si no hay configuración. */
export async function getBooks(): Promise<Book[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await getSupabase()
    .from("books")
    .select("*")
    .order("status", { ascending: true })
    .order("position", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Book[];
}

export async function getBook(id: string): Promise<Book | null> {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await getSupabase()
    .from("books")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as Book) ?? null;
}

export async function getBooksByStatus(
  status: BookStatus,
): Promise<Book[]> {
  const all = await getBooks();
  return all.filter((b) => b.status === status);
}

// ── Estadísticas derivadas (se calculan en memoria sobre el set completo) ──

export interface LibraryStats {
  total: number;
  porLeer: number;
  leyendo: number;
  leido: number;
  fiction: number;
  nonFiction: number;
  fictionPct: number;
  pagesRead: number;
  byGenre: { name: string; count: number }[];
  byStatus: { name: string; value: number; status: BookStatus }[];
  ratings: { rating: number; count: number }[];
  topAuthors: { name: string; count: number }[];
  avgRating: number | null;
  finishedThisYear: number;
}

export function computeStats(books: Book[]): LibraryStats {
  const total = books.length;
  const porLeer = books.filter((b) => b.status === "por_leer").length;
  const leyendo = books.filter((b) => b.status === "leyendo").length;
  const leido = books.filter((b) => b.status === "leido").length;

  const classified = books.filter((b) => b.is_fiction !== null);
  const fiction = classified.filter((b) => b.is_fiction === true).length;
  const nonFiction = classified.filter((b) => b.is_fiction === false).length;
  const fictionPct =
    classified.length > 0 ? Math.round((fiction / classified.length) * 100) : 0;

  const pagesRead = books
    .filter((b) => b.status === "leido" && b.pages)
    .reduce((sum, b) => sum + (b.pages ?? 0), 0);

  const genreMap = new Map<string, number>();
  for (const b of books) {
    const g = b.genre?.trim();
    if (g) genreMap.set(g, (genreMap.get(g) ?? 0) + 1);
  }
  const byGenre = [...genreMap.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const byStatus = [
    { name: "Por leer", value: porLeer, status: "por_leer" as BookStatus },
    { name: "Leyendo", value: leyendo, status: "leyendo" as BookStatus },
    { name: "Leído", value: leido, status: "leido" as BookStatus },
  ];

  const ratings = [1, 2, 3, 4, 5].map((rating) => ({
    rating,
    count: books.filter((b) => b.rating === rating).length,
  }));

  const rated = books.filter((b) => typeof b.rating === "number");
  const avgRating =
    rated.length > 0
      ? Math.round(
          (rated.reduce((s, b) => s + (b.rating ?? 0), 0) / rated.length) * 10,
        ) / 10
      : null;

  const authorMap = new Map<string, number>();
  for (const b of books) {
    const a = b.author?.trim();
    if (a) authorMap.set(a, (authorMap.get(a) ?? 0) + 1);
  }
  const topAuthors = [...authorMap.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const currentYear = new Date().getFullYear();
  const finishedThisYear = books.filter(
    (b) =>
      b.date_finished &&
      new Date(b.date_finished).getFullYear() === currentYear,
  ).length;

  return {
    total,
    porLeer,
    leyendo,
    leido,
    fiction,
    nonFiction,
    fictionPct,
    pagesRead,
    byGenre,
    byStatus,
    ratings,
    topAuthors,
    avgRating,
    finishedThisYear,
  };
}
