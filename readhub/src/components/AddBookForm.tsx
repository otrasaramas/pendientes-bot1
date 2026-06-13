"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import BookFormFields from "./BookFormFields";
import BookCover from "./BookCover";
import { createBook } from "@/app/actions";
import {
  emptyForm,
  analysisToForm,
  formToInput,
  type BookForm,
} from "@/lib/form";
import type { BookAnalysis } from "@/lib/types";

type Mode = "imagen" | "titulo" | "manual";

const TABS: { id: Mode; label: string; emoji: string }[] = [
  { id: "imagen", label: "Por foto de portada", emoji: "📷" },
  { id: "titulo", label: "Por título", emoji: "🔎" },
  { id: "manual", label: "Manual", emoji: "✍️" },
];

async function fileToBase64(file: File): Promise<{ data: string; mediaType: string }> {
  const buf = await file.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return { data: btoa(binary), mediaType: file.type || "image/jpeg" };
}

export default function AddBookForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("imagen");
  const [form, setForm] = useState<BookForm>(emptyForm());
  const [hasDraft, setHasDraft] = useState(false);
  const [titleQuery, setTitleQuery] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [saving, startSave] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  function patch(p: Partial<BookForm>) {
    setForm((f) => ({ ...f, ...p }));
  }

  async function callAnalyze(payload: object) {
    setAnalyzing(true);
    setError(null);
    setSaved(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "No se pudo analizar.");
      const analysis = json.analysis as BookAnalysis;
      setForm((f) => analysisToForm(analysis, f));
      setHasDraft(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al analizar.");
    } finally {
      setAnalyzing(false);
    }
  }

  async function onPickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const { data, mediaType } = await fileToBase64(file);
    // Guardamos la imagen como cover por defecto (data URL) hasta que el usuario ponga otra.
    patch({ cover_url: `data:${mediaType};base64,${data}` });
    await callAnalyze({ image: data, mediaType });
  }

  function onSearchTitle() {
    if (!titleQuery.trim()) return;
    callAnalyze({ text: titleQuery.trim() });
  }

  function reset() {
    setForm(emptyForm());
    setHasDraft(false);
    setTitleQuery("");
    setError(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  function save() {
    if (!form.title.trim()) {
      setError("El título es obligatorio.");
      return;
    }
    setError(null);
    startSave(async () => {
      try {
        await createBook(formToInput(form));
        setSaved(form.title);
        reset();
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error al guardar.");
      }
    });
  }

  const showForm = mode === "manual" || hasDraft;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setMode(t.id);
              setError(null);
              if (t.id === "manual") setHasDraft(false);
            }}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              mode === t.id
                ? "bg-primary text-white"
                : "bg-surface text-muted hover:bg-primary-soft"
            }`}
          >
            <span aria-hidden>{t.emoji}</span> {t.label}
          </button>
        ))}
      </div>

      {saved && (
        <div className="rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-accent">
          ✅ Guardado «{saved}». Puedes agregar otro o verlo en la biblioteca.
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {mode === "imagen" && (
        <div className="rounded-xl border border-dashed border-border bg-surface p-6 text-center">
          <p className="mb-3 text-sm text-muted">
            Sube o toma una foto de la portada. La IA detectará el libro y rellenará los datos
            para que los revises antes de guardar.
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={onPickImage}
            className="block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-white"
          />
          {analyzing && <p className="mt-3 text-sm text-primary">🔍 Analizando portada…</p>}
        </div>
      )}

      {mode === "titulo" && (
        <div className="rounded-xl border border-border bg-surface p-6">
          <p className="mb-3 text-sm text-muted">
            Escribe el título (y autor si lo sabes) y la IA completará el resto.
          </p>
          <div className="flex gap-2">
            <input
              value={titleQuery}
              onChange={(e) => setTitleQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearchTitle()}
              placeholder="Ej: Cien años de soledad, García Márquez"
              className="flex-1 rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <button
              onClick={onSearchTitle}
              disabled={analyzing}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {analyzing ? "Buscando…" : "Buscar"}
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <div className="rounded-xl border border-border bg-surface p-6">
          <div className="mb-4 flex items-start gap-4">
            <div className="h-28 w-20 shrink-0 overflow-hidden rounded-md shadow">
              <BookCover book={{ title: form.title || "Nuevo libro", author: form.author, cover_url: form.cover_url, genre: form.genre }} />
            </div>
            <div className="flex-1">
              <h2 className="font-serif text-lg font-semibold">
                {hasDraft ? "Revisa y confirma" : "Datos del libro"}
              </h2>
              <p className="text-sm text-muted">
                {hasDraft
                  ? "La IA propuso estos datos. Ajusta lo que quieras antes de guardar."
                  : "Completa los campos del libro."}
              </p>
            </div>
          </div>

          <BookFormFields value={form} onChange={patch} />

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={save}
              disabled={saving}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? "Guardando…" : "💾 Guardar libro"}
            </button>
            <button
              onClick={reset}
              className="rounded-lg border border-border px-5 py-2.5 text-sm text-muted hover:bg-primary-soft"
            >
              Limpiar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
