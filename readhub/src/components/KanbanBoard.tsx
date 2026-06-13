"use client";

import { useState } from "react";
import type { Book, BookStatus } from "@/lib/types";
import { STATUS_META, STATUS_ORDER } from "@/lib/categories";
import { moveBook } from "@/app/actions";
import BookCover from "./BookCover";
import BookDetail from "./BookDetail";

export default function KanbanBoard({ books }: { books: Book[] }) {
  const [items, setItems] = useState<Book[]>(books);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<BookStatus | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Sincroniza con datos nuevos del servidor (patrón de prop previa, sin efecto).
  const [prevBooks, setPrevBooks] = useState(books);
  if (books !== prevBooks) {
    setPrevBooks(books);
    setItems(books);
  }

  function drop(status: BookStatus) {
    setOverCol(null);
    const id = dragId;
    setDragId(null);
    if (!id) return;
    const book = items.find((b) => b.id === id);
    if (!book || book.status === status) return;

    // Optimista
    setItems((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b)),
    );
    const position = items.filter((b) => b.status === status).length;
    moveBook(id, status, position).catch(() => setItems(books));
  }

  const selected = items.find((b) => b.id === selectedId) ?? null;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {STATUS_ORDER.map((status) => {
          const meta = STATUS_META[status];
          const colBooks = items.filter((b) => b.status === status);
          return (
            <div
              key={status}
              onDragOver={(e) => {
                e.preventDefault();
                setOverCol(status);
              }}
              onDragLeave={() => setOverCol((c) => (c === status ? null : c))}
              onDrop={() => drop(status)}
              className={`flex min-h-40 flex-col rounded-xl border p-3 transition-colors ${
                overCol === status
                  ? "border-primary bg-primary-soft"
                  : "border-border bg-surface"
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-serif font-semibold" style={{ color: meta.color }}>
                  {meta.emoji} {meta.label}
                </h2>
                <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-muted">
                  {colBooks.length}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-2">
                {colBooks.length === 0 && (
                  <p className="rounded-lg border border-dashed border-border py-6 text-center text-xs text-muted">
                    Arrastra libros aquí
                  </p>
                )}
                {colBooks.map((b) => (
                  <div
                    key={b.id}
                    draggable
                    onDragStart={() => setDragId(b.id)}
                    onDragEnd={() => setDragId(null)}
                    onClick={() => setSelectedId(b.id)}
                    className={`flex cursor-grab items-center gap-3 rounded-lg border border-border bg-background p-2 active:cursor-grabbing ${
                      dragId === b.id ? "opacity-50" : ""
                    }`}
                  >
                    <div className="h-14 w-10 shrink-0 overflow-hidden rounded shadow-sm">
                      <BookCover book={b} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-tight line-clamp-2">{b.title}</p>
                      {b.author && (
                        <p className="text-xs text-muted line-clamp-1">{b.author}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-center text-xs text-muted">
        Arrastra una tarjeta a otra columna para cambiar su estado, o toca para ver el detalle.
      </p>

      {selected && <BookDetail book={selected} onClose={() => setSelectedId(null)} />}
    </>
  );
}
