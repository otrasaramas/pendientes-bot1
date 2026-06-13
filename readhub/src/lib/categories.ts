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
  por_leer: { label: "Por leer", emoji: "📚", color: "#a9722e" },
  leyendo: { label: "Leyendo", emoji: "📖", color: "#6f8f76" },
  leido: { label: "Leído", emoji: "✅", color: "#bb4a2c" },
};

export const STATUS_ORDER: BookStatus[] = ["por_leer", "leyendo", "leido"];

// ── Diario de lecturas: opciones de las preguntas de reflexión ──────────────
export const LOVED_OPTIONS = [
  "La historia",
  "Los personajes",
  "Las ideas",
  "La escritura",
  "El ritmo",
  "Las emociones",
  "Lo que aprendí",
  "El final",
];

export const MOOD_OPTIONS = [
  "Inspirada",
  "Conmovida",
  "Entretenida",
  "Reflexiva",
  "Enganchada",
  "Incómoda",
  "Aburrida",
  "Sorprendida",
];

export const PACE_OPTIONS = [
  { value: "lento", label: "Lento" },
  { value: "medio", label: "Medio" },
  { value: "rapido", label: "Rápido" },
];
