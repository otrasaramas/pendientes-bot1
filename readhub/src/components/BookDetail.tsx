"use client";

import { useState, useTransition } from "react";
import type { Book } from "@/lib/types";
import { STATUS_META, STATUS_ORDER } from "@/lib/categories";
import { bookToForm, formToInput, type BookForm } from "@/lib/form";
import { updateBook, deleteBook, setBookStatus } from "@/app/actions";
import BookCover from "./BookCover";
import BookFormFields from "./BookFormFields";
import StarRating from "./StarRating";

export default function BookDetail({
  book,
  onClose,
}: {
  book: Book;
  onClose: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<BookForm>(() => bookToForm(book));
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function save() {
    if (!form.title.trim()) return setError("El título es obligatorio.");
    setError(null);
    start(async () => {
      try {
        await updateBook(book.id, formToInput(form));
        setEditing(false);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error al guardar.");
      }
    });
  }

  function remove() {
    start(async () => {
      try {
        await deleteBook(book.id);
        onClose();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error al borrar.");
      }
    });
  }

  function changeStatus(s: Book["status"]) {
    start(() => setBookStatus(book.id, s));
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40"
      onClick={onClose}
    >
      <div
        className="h-full w-full max-w-md overflow-y-auto bg-background shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 className="font-serif text-lg font-semibold">
            {editing ? "Editar libro" : "Detalle"}
          </h2>
          <button onClick={onClose} className="text-2xl text-muted hover:text-foreground">
            ×
          </button>
        </div>

        <div className="space-y-5 p-5">
          {error && (
            <div className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {editing ? (
            <>
              <BookFormFields value={form} onChange={(p) => setForm((f) => ({ ...f, ...p }))} />
              <div className="flex gap-3">
                <button
                  onClick={save}
                  disabled={pending}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  Guardar cambios
                </button>
                <button
                  onClick={() => {
                    setForm(bookToForm(book));
                    setEditing(false);
                  }}
                  className="rounded-lg border border-border px-4 py-2 text-sm text-muted"
                >
                  Cancelar
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex gap-4">
                <div className="h-44 w-30 shrink-0 overflow-hidden rounded-lg shadow-md">
                  <BookCover book={book} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif text-xl font-semibold leading-tight">{book.title}</h3>
                  {book.author && <p className="text-muted">{book.author}</p>}
                  <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
                    {book.is_fiction != null && (
                      <span className="rounded-full bg-primary-soft px-2 py-0.5 text-primary">
                        {book.is_fiction ? "Ficción" : "No ficción"}
                      </span>
                    )}
                    {book.genre && (
                      <span className="rounded-full bg-primary-soft px-2 py-0.5 text-primary">
                        {book.genre}
                      </span>
                    )}
                    {book.year && (
                      <span className="rounded-full bg-stone-100 px-2 py-0.5 text-muted">
                        {book.year}
                      </span>
                    )}
                    {book.pages && (
                      <span className="rounded-full bg-stone-100 px-2 py-0.5 text-muted">
                        {book.pages} págs
                      </span>
                    )}
                  </div>
                  <div className="mt-3">
                    <StarRating bookId={book.id} value={book.rating} />
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-1.5 text-xs font-medium text-muted">Estado de lectura</p>
                <div className="flex gap-2">
                  {STATUS_ORDER.map((s) => (
                    <button
                      key={s}
                      onClick={() => changeStatus(s)}
                      disabled={pending}
                      className={`flex-1 rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${
                        book.status === s
                          ? "border-transparent text-white"
                          : "border-border text-muted hover:bg-primary-soft"
                      }`}
                      style={book.status === s ? { background: STATUS_META[s].color } : undefined}
                    >
                      {STATUS_META[s].emoji} {STATUS_META[s].label}
                    </button>
                  ))}
                </div>
              </div>

              {book.categories?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {book.categories.map((c) => (
                    <span key={c} className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-muted">
                      #{c}
                    </span>
                  ))}
                </div>
              )}

              {book.description && (
                <div>
                  <p className="mb-1 text-xs font-medium text-muted">Sinopsis</p>
                  <p className="text-sm leading-relaxed">{book.description}</p>
                </div>
              )}

              {book.notes && (
                <div>
                  <p className="mb-1 text-xs font-medium text-muted">Mis notas</p>
                  <p className="text-sm leading-relaxed italic">{book.notes}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setEditing(true)}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
                >
                  ✏️ Editar
                </button>
                {confirmDelete ? (
                  <button
                    onClick={remove}
                    disabled={pending}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                  >
                    ¿Seguro? Borrar
                  </button>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="rounded-lg border border-red-300 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    🗑 Borrar
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
