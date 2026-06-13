#!/usr/bin/env node
/**
 * Importa libros desde un CSV a tu tabla `books` de Supabase.
 *
 * Uso:
 *   1. Exporta tu hoja de cálculo como CSV (separado por comas, UTF-8).
 *   2. Asegúrate de tener .env.local con NEXT_PUBLIC_SUPABASE_URL y
 *      SUPABASE_SERVICE_ROLE_KEY (o expórtalas en tu shell).
 *   3. node scripts/import-csv.mjs ruta/a/mis-libros.csv
 *      Añade --dry para ver el mapeo sin escribir nada.
 *
 * El script intenta adivinar las columnas por su nombre (en español o inglés).
 * Si alguna no se detecta, edita el objeto FIELD_ALIASES de abajo.
 */

import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

// ── Carga .env.local de forma sencilla (sin dependencias) ──────────────────
try {
  const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  for (const line of env.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {
  /* sin .env.local, usamos variables del shell */
}

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const file = process.argv[2];
const dry = process.argv.includes("--dry");

if (!file) {
  console.error("Indica la ruta del CSV: node scripts/import-csv.mjs libros.csv [--dry]");
  process.exit(1);
}
if (!URL || !KEY) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

// ── Parser CSV mínimo con soporte de comillas ──────────────────────────────
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

const norm = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

// ── Alias de columnas → campo de la base de datos ──────────────────────────
const FIELD_ALIASES = {
  title: ["titulo", "title", "nombre", "libro", "name"],
  author: ["autor", "author", "escritor", "autora", "writer"],
  genre: ["genero", "genre", "categoria principal", "género"],
  categories: ["categorias", "categories", "etiquetas", "tags", "temas"],
  is_fiction: ["ficcion", "fiction", "tipo", "ficcion/no ficcion"],
  status: ["estado", "status", "situacion"],
  rating: ["valoracion", "rating", "estrellas", "puntuacion", "nota", "score"],
  pages: ["paginas", "pages", "num paginas", "nº paginas"],
  year: ["ano", "año", "year", "publicacion", "fecha publicacion"],
  language: ["idioma", "language", "lengua"],
  isbn: ["isbn"],
  publisher: ["editorial", "publisher", "edicion"],
  cover_url: ["portada", "cover", "imagen", "cover_url", "url portada", "caratula"],
  description: ["sinopsis", "descripcion", "resumen", "description", "argumento"],
  notes: ["notas", "comentarios", "resena", "reseña", "notes", "opinion"],
  read_flag: ["leido", "leído", "read", "terminado", "finalizado"],
};

function buildHeaderMap(headers) {
  const map = {};
  headers.forEach((h, idx) => {
    const n = norm(h);
    for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
      if (aliases.some((a) => n === a || n.includes(a))) {
        if (map[field] === undefined) map[field] = idx;
      }
    }
  });
  return map;
}

const truthy = (v) => /^(s[ií]|si|yes|true|x|1|verdadero)$/i.test(v.trim());

function parseStatus(statusVal, readFlagVal) {
  const s = norm(statusVal || "");
  if (/leyendo|reading|en curso|empezado/.test(s)) return "leyendo";
  if (/leido|read|terminado|finalizado|completado/.test(s)) return "leido";
  if (readFlagVal !== undefined && truthy(readFlagVal)) return "leido";
  if (/por leer|pendiente|to read|wishlist|sin leer/.test(s)) return "por_leer";
  return "por_leer";
}

function parseFiction(v) {
  if (!v) return null;
  const n = norm(v);
  if (/no ficcion|nonfiction|ensayo|no-ficcion|noficcion/.test(n)) return false;
  if (/ficcion|fiction|novela|si|true/.test(n)) return true;
  return null;
}

function parseInt0(v) {
  const n = parseInt(String(v).replace(/[^\d-]/g, ""), 10);
  return Number.isFinite(n) ? n : null;
}

function parseRating(v) {
  const n = parseFloat(String(v).replace(",", "."));
  if (!Number.isFinite(n)) return null;
  const r = Math.round(n);
  return r >= 1 && r <= 5 ? r : null;
}

const rows = parseCSV(readFileSync(file, "utf8"));
if (rows.length < 2) {
  console.error("El CSV no tiene filas de datos.");
  process.exit(1);
}

const headers = rows[0];
const hmap = buildHeaderMap(headers);

console.log("Encabezados detectados:");
for (const [field, idx] of Object.entries(hmap)) {
  console.log(`  ${field.padEnd(12)} ← "${headers[idx]}"`);
}
const unmapped = headers.filter((_, i) => !Object.values(hmap).includes(i));
if (unmapped.length) console.log("Columnas sin mapear (se ignoran):", unmapped.join(", "));

if (hmap.title === undefined) {
  console.error("\n⚠️  No encontré la columna de título. Edita FIELD_ALIASES.title.");
  process.exit(1);
}

const get = (row, field) => (hmap[field] !== undefined ? (row[hmap[field]] ?? "").trim() : "");

const books = rows.slice(1).map((row) => {
  const title = get(row, "title");
  if (!title) return null;
  return {
    title,
    author: get(row, "author") || null,
    genre: get(row, "genre") || null,
    categories: get(row, "categories")
      ? get(row, "categories").split(/[;,/]/).map((c) => c.trim()).filter(Boolean)
      : [],
    is_fiction: parseFiction(get(row, "is_fiction")),
    status: parseStatus(get(row, "status"), hmap.read_flag !== undefined ? get(row, "read_flag") : undefined),
    rating: parseRating(get(row, "rating")),
    pages: parseInt0(get(row, "pages")),
    year: parseInt0(get(row, "year")),
    language: get(row, "language") || null,
    isbn: get(row, "isbn") || null,
    publisher: get(row, "publisher") || null,
    cover_url: get(row, "cover_url") || null,
    description: get(row, "description") || null,
    notes: get(row, "notes") || null,
  };
}).filter(Boolean);

console.log(`\n${books.length} libros listos para importar.`);
console.log("Ejemplo:", JSON.stringify(books[0], null, 2));

if (dry) {
  console.log("\n--dry: no se escribió nada. Quita --dry para importar de verdad.");
  process.exit(0);
}

const supabase = createClient(URL, KEY, { auth: { persistSession: false } });

let ok = 0;
for (let i = 0; i < books.length; i += 100) {
  const batch = books.slice(i, i + 100);
  const { error } = await supabase.from("books").insert(batch);
  if (error) {
    console.error(`Error en lote ${i}-${i + batch.length}:`, error.message);
  } else {
    ok += batch.length;
    console.log(`Insertados ${ok}/${books.length}…`);
  }
}
console.log(`\n✅ Importación completa: ${ok} libros.`);
