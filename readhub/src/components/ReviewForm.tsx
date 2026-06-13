"use client";

import { useState, useTransition } from "react";
import type { Book, Review } from "@/lib/types";
import { LOVED_OPTIONS, MOOD_OPTIONS, PACE_OPTIONS } from "@/lib/categories";
import { saveReview } from "@/app/actions";
import BookCover from "./BookCover";

export default function ReviewForm({
  book,
  existing,
  onClose,
}: {
  book: Book;
  existing?: Review | null;
  onClose: () => void;
}) {
  const [rating, setRating] = useState<number>(existing?.rating ?? 0);
  const [hover, setHover] = useState<number | null>(null);
  const [liked, setLiked] = useState<boolean | null>(existing?.liked ?? null);
  const [pace, setPace] = useState<string | null>(existing?.pace ?? null);
  const [loved, setLoved] = useState<string[]>(existing?.loved ?? []);
  const [moods, setMoods] = useState<string[]>(existing?.moods ?? []);
  const [rec, setRec] = useState<boolean | null>(existing?.would_recommend ?? null);
  const [text, setText] = useState<string>(existing?.review ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  function submit() {
    if (!rating) return setError("Ponle al menos una nota en estrellas.");
    setError(null);
    start(async () => {
      try {
        await saveReview(book.id, {
          rating,
          liked,
          pace,
          loved,
          moods,
          would_recommend: rec,
          review: text,
        });
        onClose();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error al guardar.");
      }
    });
  }

  const stars = hover ?? rating;

  return (
    <div className="fixed inset-0 z-50 flex justify-center overflow-y-auto bg-black/40 p-4" onClick={onClose}>
      <div
        className="my-6 h-fit w-full max-w-lg rounded-3xl bg-background p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start gap-4">
          <div className="h-24 w-16 shrink-0 overflow-hidden rounded-lg shadow">
            <BookCover book={book} />
          </div>
          <div className="flex-1">
            <p className="kicker">Reflexión de lectura</p>
            <h2 className="font-serif text-xl leading-tight">{book.title}</h2>
            {book.author && <p className="text-sm text-muted">{book.author}</p>}
          </div>
          <button onClick={onClose} className="text-2xl text-muted">×</button>
        </div>

        {error && (
          <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <div className="space-y-5">
          <div>
            <p className="kicker mb-1.5">¿Qué nota le das?</p>
            <div className="text-3xl">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onMouseEnter={() => setHover(s)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => setRating(rating === s ? 0 : s)}
                  className="transition-transform hover:scale-110"
                >
                  <span className={s <= stars ? "text-amber-500" : "text-stone-300"}>★</span>
                </button>
              ))}
            </div>
          </div>

          <Question label="¿Te gustó?">
            <Toggle value={liked} onChange={setLiked} yes="❤ Sí" no="No tanto" />
          </Question>

          <div>
            <p className="kicker mb-1.5">¿Qué fue lo que más te gustó?</p>
            <Chips options={LOVED_OPTIONS} selected={loved} onToggle={(v) => toggle(loved, setLoved, v)} />
          </div>

          <div>
            <p className="kicker mb-1.5">¿Cómo te hizo sentir?</p>
            <Chips options={MOOD_OPTIONS} selected={moods} onToggle={(v) => toggle(moods, setMoods, v)} />
          </div>

          <div>
            <p className="kicker mb-1.5">¿Qué ritmo tenía?</p>
            <div className="flex gap-2">
              {PACE_OPTIONS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPace(pace === p.value ? null : p.value)}
                  className={`rounded-full px-4 py-1.5 text-sm ${
                    pace === p.value ? "bg-primary text-white" : "border border-border text-muted hover:bg-primary-soft"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <Question label="¿Lo recomendarías?">
            <Toggle value={rec} onChange={setRec} yes="Sí" no="No" />
          </Question>

          <div>
            <p className="kicker mb-1.5">Tu reseña en una línea</p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Lo que te llevas de este libro…"
              className="min-h-16 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              onClick={submit}
              disabled={pending}
              className="rounded-full bg-primary px-6 py-2.5 font-mono text-xs tracking-wide text-white disabled:opacity-60"
            >
              {pending ? "GUARDANDO…" : "GUARDAR RESEÑA"}
            </button>
            <button onClick={onClose} className="rounded-full px-5 py-2.5 text-sm text-muted">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Question({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="kicker">{label}</p>
      {children}
    </div>
  );
}

function Toggle({
  value,
  onChange,
  yes,
  no,
}: {
  value: boolean | null;
  onChange: (v: boolean | null) => void;
  yes: string;
  no: string;
}) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onChange(value === true ? null : true)}
        className={`rounded-full px-3 py-1.5 text-sm ${value === true ? "bg-accent text-white" : "border border-border text-muted"}`}
      >
        {yes}
      </button>
      <button
        onClick={() => onChange(value === false ? null : false)}
        className={`rounded-full px-3 py-1.5 text-sm ${value === false ? "bg-maroon text-white" : "border border-border text-muted"}`}
      >
        {no}
      </button>
    </div>
  );
}

function Chips({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onToggle(o)}
          className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
            selected.includes(o) ? "bg-primary text-white" : "border border-border text-muted hover:bg-primary-soft"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
