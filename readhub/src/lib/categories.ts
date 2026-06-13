import type { BookStatus } from "./types";

/** Géneros principales sugeridos (puedes escribir cualquier otro). */
export const GENRES = [
  "Fantasía",
  "Ciencia ficción",
  "Romance",
  "Misterio / Thriller",
  "Terror",
  "Histórica",
  "Realismo / Contemporánea",
  "Clásicos",
  "Poesía",
  "Cómic / Novela gráfica",
  "Juvenil",
  "Infantil",
  "Ensayo",
  "Biografía / Memorias",
  "Autoayuda / Desarrollo personal",
  "Ciencia / Divulgación",
  "Historia",
  "Filosofía",
  "Negocios / Economía",
  "Espiritualidad",
  "Cocina",
  "Arte",
  "Viajes",
  "Otro",
];

/** Etiquetas libres de uso frecuente para autocompletar. */
export const COMMON_TAGS = [
  "favorito",
  "relectura",
  "club de lectura",
  "prestado",
  "saga",
  "premiado",
  "pendiente largo",
  "rápido",
];

export const STATUS_META: Record<
  BookStatus,
  { label: string; emoji: string; color: string }
> = {
  por_leer: { label: "Por leer", emoji: "📚", color: "#b08968" },
  leyendo: { label: "Leyendo", emoji: "📖", color: "#6b9080" },
  leido: { label: "Leído", emoji: "✅", color: "#8e7dbe" },
};

export const STATUS_ORDER: BookStatus[] = ["por_leer", "leyendo", "leido"];
