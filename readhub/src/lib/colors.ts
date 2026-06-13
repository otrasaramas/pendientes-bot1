import type { Book } from "./types";

export interface BlockColor {
  bg: string;
  fg: string;
}

/** Paleta editorial cálida inspirada en las referencias. */
export const PALETTE: BlockColor[] = [
  { bg: "#f0bf2b", fg: "#3a2d12" }, // mostaza
  { bg: "#f3a884", fg: "#5a2f1f" }, // durazno
  { bg: "#e2673f", fg: "#fbf2e7" }, // coral
  { bg: "#a9722e", fg: "#fbf2e7" }, // ocre
  { bg: "#2f6fae", fg: "#eef4fb" }, // azul
  { bg: "#c5d2c2", fg: "#2c3a2e" }, // salvia
  { bg: "#1f2f5e", fg: "#e9ecf6" }, // azul marino
  { bg: "#d8a7a0", fg: "#4a2723" }, // rosa polvo
  { bg: "#21402f", fg: "#e7efe5" }, // verde oscuro
  { bg: "#9c3b2e", fg: "#f7e9df" }, // ladrillo
];

/** Asigna colores fijos a los géneros de la biblioteca para agrupar visualmente. */
const GENRE_COLOR: Record<string, number> = {
  "Desarrollo Personal & Bienestar": 0, // mostaza
  "Psicología & Neurociencia": 4, // azul
  Salud: 5, // salvia
  Ciencia: 1, // durazno
  "Sociedad & Política": 6, // marino
  Ficción: 2, // coral
  Filosofía: 3, // ocre
  Relaciones: 7, // rosa
};

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

export function getBookColor(
  book: Pick<Book, "title" | "genre">,
): BlockColor {
  const g = book.genre?.trim();
  if (g && g in GENRE_COLOR) return PALETTE[GENRE_COLOR[g]];
  const seed = g || book.title || "";
  return PALETTE[hash(seed) % PALETTE.length];
}
