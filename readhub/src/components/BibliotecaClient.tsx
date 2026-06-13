"use client";

import { useMemo, useState } from "react";
import type { Book, BookStatus } from "@/lib/types";
import { STATUS_META, STATUS_ORDER } from "@/lib/categories";
import BookCard from "./BookCard";
import BookDetail from "./BookDetail";

type StatusFilter = BookStatus | "todos";

export default function BibliotecaClient({ books }: { books: Book[] }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("todos");
  const [genreFilter, setGenreFilter] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const genres = useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => b.genre && set.add(b.genre));
    return [...set].sort();
  }, [books]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return books.filter((b) => {
      if (statusFilter !== "todos" && b.status !== statusFilter) return false;
      if (genreFilter && b.genre !== genreFilter) return false;
      if (q) {
        const hay =
          `${b.title} ${b.author ?? ""} ${b.genre ?? ""} ${b.categories.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [books, query, statusFilter, genreFilter]);

  const selected = books.find((b) => b.id === selectedId) ?? null;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔎 Buscar por título, autor, categoría…"
          className="flex-1 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
        />
        {genres.length > 0 && (
          <select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary"
          >
            <option value="">Todos los géneros</option>
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {(["todos", ...STATUS_ORDER] as StatusFilter[]).map((s) => {
          const meta = s === "todos" ? null : STATUS_META[s];
          const count =
            s === "todos" ? books.length : books.filter((b) => b.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                statusFilter === s
                  ? "bg-primary text-white"
                  : "bg-surface text-muted hover:bg-primary-soft"
              }`}
            >
              {meta ? `${meta.emoji} ${meta.label}` : "📚 Todos"} ({count})
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-muted">
          No hay libros que coincidan. Prueba otros filtros o agrega uno nuevo.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map((b) => (
            <BookCard key={b.id} book={b} onClick={() => setSelectedId(b.id)} />
          ))}
        </div>
      )}

      {selected && <BookDetail book={selected} onClose={() => setSelectedId(null)} />}
    </div>
  );
}
