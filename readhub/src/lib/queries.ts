import "server-only";
import { getSupabase, isSupabaseConfigured } from "./supabase";
import type { Book, BookStatus, ReadingDay, Review } from "./types";

/** Modo demo: muestra datos de muestra sin necesidad de base de datos real. */
const DEMO = process.env.READHUB_DEMO === "1";

/** Devuelve todos los libros ordenados. Lista vacía si no hay configuración. */
export async function getBooks(): Promise<Book[]> {
  if (DEMO) {
    const { DEMO_BOOKS } = await import("./demo");
    return DEMO_BOOKS;
  }
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

// ── Diario de lecturas (reseñas) ────────────────────────────────────────────

export async function getReviews(): Promise<Review[]> {
  if (DEMO) {
    const { DEMO_REVIEWS } = await import("./demo");
    return DEMO_REVIEWS;
  }
  if (!isSupabaseConfigured) return [];
  const { data, error } = await getSupabase()
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Review[];
}

export interface TasteProfile {
  reviewed: number;
  avgRating: number | null;
  likedPct: number;
  topGenres: { name: string; count: number }[];
  topLoved: { name: string; count: number }[];
  topMoods: { name: string; count: number }[];
  pace: string | null;
  /** Resumen en texto para alimentar la IA. */
  summary: string;
}

export function computeTasteProfile(
  reviews: Review[],
  books: Book[],
): TasteProfile {
  const byId = new Map(books.map((b) => [b.id, b]));
  const reviewed = reviews.length;

  const rated = reviews.filter((r) => typeof r.rating === "number");
  const avgRating =
    rated.length > 0
      ? Math.round((rated.reduce((s, r) => s + (r.rating ?? 0), 0) / rated.length) * 10) / 10
      : null;

  const likedCount = reviews.filter((r) => r.liked === true).length;
  const likedPct = reviewed > 0 ? Math.round((likedCount / reviewed) * 100) : 0;

  const tally = (items: string[]) => {
    const m = new Map<string, number>();
    items.forEach((i) => i && m.set(i, (m.get(i) ?? 0) + 1));
    return [...m.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  };

  // Géneros de los libros que le gustaron (liked o rating>=4).
  const likedGenres: string[] = [];
  for (const r of reviews) {
    const liked = r.liked === true || (r.rating ?? 0) >= 4;
    const g = byId.get(r.book_id)?.genre;
    if (liked && g) likedGenres.push(g);
  }
  const topGenres = tally(likedGenres).slice(0, 5);
  const topLoved = tally(reviews.flatMap((r) => r.loved ?? [])).slice(0, 5);
  const topMoods = tally(reviews.flatMap((r) => r.moods ?? [])).slice(0, 5);

  const paceTally = tally(reviews.map((r) => r.pace ?? "").filter(Boolean));
  const pace = paceTally[0]?.name ?? null;

  const summary = [
    reviewed > 0 ? `${reviewed} libros reseñados` : "sin reseñas aún",
    avgRating != null ? `nota media ${avgRating}/5` : "",
    topGenres.length ? `géneros favoritos: ${topGenres.map((g) => g.name).join(", ")}` : "",
    topLoved.length ? `valora sobre todo: ${topLoved.map((l) => l.name).join(", ")}` : "",
    topMoods.length ? `busca sentirse: ${topMoods.map((m) => m.name).join(", ")}` : "",
    pace ? `ritmo preferido: ${pace}` : "",
  ]
    .filter(Boolean)
    .join("; ");

  return { reviewed, avgRating, likedPct, topGenres, topLoved, topMoods, pace, summary };
}

// ── Tracker de lectura ──────────────────────────────────────────────────────

/** Días registrados (ordenados) dentro del año indicado. */
export async function getReadingDays(year: number): Promise<ReadingDay[]> {
  if (DEMO) {
    const { DEMO_READING_DAYS } = await import("./demo");
    return DEMO_READING_DAYS.filter((d) => d.day.startsWith(String(year)));
  }
  if (!isSupabaseConfigured) return [];
  const { data, error } = await getSupabase()
    .from("reading_log")
    .select("*")
    .gte("day", `${year}-01-01`)
    .lte("day", `${year}-12-31`)
    .order("day", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as ReadingDay[];
}

export interface ReadingStats {
  daysThisYear: number;
  currentStreak: number;
  longestStreak: number;
  thisMonth: number;
  daysElapsed: number;
  totalMinutes: number;
  totalPages: number;
  avgPages: number;
  pagesThisMonth: number;
}

const dayStr = (d: Date) => d.toISOString().slice(0, 10);

export function computeReadingStats(
  days: ReadingDay[],
  year: number,
): ReadingStats {
  const set = new Set(days.map((d) => d.day));
  const today = new Date();
  const isCurrentYear = today.getFullYear() === year;

  // Racha más larga dentro del set.
  const sorted = [...set].sort();
  let longest = 0;
  let run = 0;
  let prev: Date | null = null;
  for (const s of sorted) {
    const d = new Date(s + "T00:00:00");
    if (prev && (d.getTime() - prev.getTime()) / 86400000 === 1) run += 1;
    else run = 1;
    longest = Math.max(longest, run);
    prev = d;
  }

  // Racha actual (hacia atrás desde hoy o ayer).
  let currentStreak = 0;
  if (isCurrentYear) {
    const cursor = new Date(today);
    if (!set.has(dayStr(cursor))) cursor.setDate(cursor.getDate() - 1); // permite contar si aún no marcó hoy
    while (set.has(dayStr(cursor))) {
      currentStreak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
  }

  const month = today.getMonth();
  const inThisMonth = (d: ReadingDay) =>
    new Date(d.day + "T00:00:00").getMonth() === month;
  const thisMonth = isCurrentYear ? days.filter(inThisMonth).length : 0;

  const startOfYear = new Date(year, 0, 1);
  const end = isCurrentYear ? today : new Date(year, 11, 31);
  const daysElapsed = Math.floor((end.getTime() - startOfYear.getTime()) / 86400000) + 1;

  const totalMinutes = days.reduce((s, d) => s + (d.minutes ?? 0), 0);
  const totalPages = days.reduce((s, d) => s + (d.pages ?? 0), 0);
  const avgPages = set.size > 0 ? Math.round(totalPages / set.size) : 0;
  const pagesThisMonth = isCurrentYear
    ? days.filter(inThisMonth).reduce((s, d) => s + (d.pages ?? 0), 0)
    : 0;

  return {
    daysThisYear: set.size,
    currentStreak,
    longestStreak: longest,
    thisMonth,
    daysElapsed,
    totalMinutes,
    totalPages,
    avgPages,
    pagesThisMonth,
  };
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
