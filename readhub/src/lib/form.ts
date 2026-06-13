import type { Book, BookInput, BookStatus, BookAnalysis } from "./types";

export interface BookForm {
  title: string;
  author: string;
  cover_url: string;
  description: string;
  is_fiction: "" | "si" | "no";
  genre: string;
  categories: string; // separadas por coma en la UI
  pages: string;
  language: string;
  year: string;
  isbn: string;
  publisher: string;
  status: BookStatus;
  notes: string;
}

export function emptyForm(): BookForm {
  return {
    title: "",
    author: "",
    cover_url: "",
    description: "",
    is_fiction: "",
    genre: "",
    categories: "",
    pages: "",
    language: "",
    year: "",
    isbn: "",
    publisher: "",
    status: "por_leer",
    notes: "",
  };
}

export function bookToForm(b: Book): BookForm {
  return {
    title: b.title ?? "",
    author: b.author ?? "",
    cover_url: b.cover_url ?? "",
    description: b.description ?? "",
    is_fiction: b.is_fiction === true ? "si" : b.is_fiction === false ? "no" : "",
    genre: b.genre ?? "",
    categories: (b.categories ?? []).join(", "),
    pages: b.pages != null ? String(b.pages) : "",
    language: b.language ?? "",
    year: b.year != null ? String(b.year) : "",
    isbn: b.isbn ?? "",
    publisher: b.publisher ?? "",
    status: b.status,
    notes: b.notes ?? "",
  };
}

export function analysisToForm(a: BookAnalysis, base?: BookForm): BookForm {
  const form = base ?? emptyForm();
  return {
    ...form,
    title: a.title || form.title,
    author: a.author ?? form.author,
    description: a.description ?? form.description,
    is_fiction: a.is_fiction === true ? "si" : a.is_fiction === false ? "no" : form.is_fiction,
    genre: a.genre ?? form.genre,
    categories: a.categories?.length ? a.categories.join(", ") : form.categories,
    pages: a.pages != null ? String(a.pages) : form.pages,
    year: a.year != null ? String(a.year) : form.year,
    language: a.language ?? form.language,
  };
}

export function formToInput(f: BookForm): BookInput {
  const toInt = (s: string) => {
    const n = parseInt(s, 10);
    return Number.isFinite(n) ? n : null;
  };
  return {
    title: f.title.trim(),
    author: f.author.trim() || null,
    cover_url: f.cover_url.trim() || null,
    description: f.description.trim() || null,
    is_fiction: f.is_fiction === "si" ? true : f.is_fiction === "no" ? false : null,
    genre: f.genre.trim() || null,
    categories: f.categories
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean),
    pages: toInt(f.pages),
    language: f.language.trim() || null,
    year: toInt(f.year),
    isbn: f.isbn.trim() || null,
    publisher: f.publisher.trim() || null,
    status: f.status,
    notes: f.notes.trim() || null,
  };
}
