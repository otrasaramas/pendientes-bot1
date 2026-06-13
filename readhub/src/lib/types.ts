export type BookStatus = "por_leer" | "leyendo" | "leido";

export interface Book {
  id: string;
  created_at: string;
  title: string;
  author: string | null;
  cover_url: string | null;
  description: string | null;
  is_fiction: boolean | null;
  genre: string | null;
  categories: string[];
  pages: number | null;
  language: string | null;
  year: number | null;
  isbn: string | null;
  publisher: string | null;
  status: BookStatus;
  rating: number | null;
  date_started: string | null;
  date_finished: string | null;
  notes: string | null;
  position: number;
}

/** Campos editables por el usuario al crear o actualizar un libro. */
export type BookInput = Partial<Omit<Book, "id" | "created_at" | "position">>;

/** Un día registrado en el tracker de lectura. */
export interface ReadingDay {
  id: string;
  day: string; // YYYY-MM-DD
  minutes: number | null;
  pages: number | null;
  note: string | null;
  created_at: string;
}

/** Resultado del análisis de IA sobre una portada o un título. */
export interface BookAnalysis {
  title: string;
  author: string | null;
  is_fiction: boolean | null;
  genre: string | null;
  categories: string[];
  description: string | null;
  pages: number | null;
  year: number | null;
  language: string | null;
}
