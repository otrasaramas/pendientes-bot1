"use client";

import { useMemo, useState } from "react";
import type { Book, Review } from "@/lib/types";
import type { TasteProfile } from "@/lib/queries";
import { getBookColor } from "@/lib/colors";
import ReviewForm from "./ReviewForm";

interface Rec {
  match: number;
  verdict: string;
  reasons: string[];
}

export default function DiarioClient({
  books,
  reviews,
  profile,
}: {
  books: Book[];
  reviews: Review[];
  profile: TasteProfile;
}) {
  const byId = useMemo(() => new Map(books.map((b) => [b.id, b])), [books]);
  const reviewedIds = useMemo(() => new Set(reviews.map((r) => r.book_id)), [reviews]);

  const [picking, setPicking] = useState(false);
  const [editing, setEditing] = useState<{ book: Book; review: Review | null } | null>(null);

  // Predictor
  const candidates = books.filter((b) => b.status !== "leido");
  const [target, setTarget] = useState<string>("");
  const [pred, setPred] = useState<Rec | null>(null);
  const [loadingPred, setLoadingPred] = useState(false);
  const [predErr, setPredErr] = useState<string | null>(null);

  async function predict() {
    if (!target) return;
    setLoadingPred(true);
    setPred(null);
    setPredErr(null);
    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: target }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "No se pudo predecir.");
      setPred(json as Rec);
    } catch (e) {
      setPredErr(e instanceof Error ? e.message : "Error.");
    } finally {
      setLoadingPred(false);
    }
  }

  const matchColor = (m: number) => (m >= 70 ? "#6f8f76" : m >= 45 ? "#e6b98f" : "#bb4a2c");

  return (
    <div className="space-y-8">
      {/* Perfil de gusto */}
      <section className="rounded-3xl bg-gradient-to-br from-primary-soft to-surface p-6">
        <p className="kicker">Tu perfil de lectura</p>
        {profile.reviewed === 0 ? (
          <p className="mt-2 text-muted">
            Aún no has reseñado libros. Registra tu primera lectura terminada para empezar a
            construir tu perfil de gusto.
          </p>
        ) : (
          <>
            <h2 className="mt-1 font-serif text-2xl">
              {profile.reviewed} reseñas · nota media {profile.avgRating ?? "—"}/5
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <ProfileBit title="Géneros que amas" items={profile.topGenres.map((g) => g.name)} />
              <ProfileBit title="Lo que más valoras" items={profile.topLoved.map((l) => l.name)} />
              <ProfileBit title="Buscas sentirte" items={profile.topMoods.map((m) => m.name)} />
            </div>
          </>
        )}
        <button
          onClick={() => setPicking(true)}
          className="mt-4 rounded-full bg-primary px-5 py-2.5 font-mono text-xs tracking-wide text-white"
        >
          + REGISTRAR LECTURA TERMINADA
        </button>
      </section>

      {/* Predictor */}
      <section className="rounded-3xl border border-border bg-surface p-6">
        <p className="kicker">Predicción</p>
        <h2 className="mt-1 font-serif text-2xl">¿Me gustará mi próximo libro?</h2>
        <p className="mt-1 text-sm text-muted">
          Elige un libro de tu lista y estimo tu afinidad según tu historial de reseñas.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="min-w-56 flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
          >
            <option value="">Elige un libro…</option>
            {candidates.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title}
              </option>
            ))}
          </select>
          <button
            onClick={predict}
            disabled={!target || loadingPred}
            className="rounded-full bg-primary px-5 py-2.5 font-mono text-xs tracking-wide text-white disabled:opacity-50"
          >
            {loadingPred ? "PENSANDO…" : "PREDECIR"}
          </button>
        </div>
        {predErr && <p className="mt-3 text-sm text-red-600">{predErr}</p>}
        {pred && (
          <div className="mt-4 flex flex-col gap-4 rounded-2xl bg-background p-5 sm:flex-row sm:items-center">
            <div className="flex flex-col items-center">
              <div
                className="flex h-24 w-24 items-center justify-center rounded-full font-serif text-3xl text-white"
                style={{ background: matchColor(pred.match) }}
              >
                {pred.match}%
              </div>
              <span className="kicker mt-2">afinidad</span>
            </div>
            <div className="flex-1">
              <p className="font-serif text-xl">{pred.verdict}</p>
              <ul className="mt-2 space-y-1 text-sm text-muted">
                {pred.reasons.map((r, i) => (
                  <li key={i}>• {r}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>

      {/* Feed de reseñas */}
      <section>
        <h2 className="mb-3 font-serif text-2xl">Mis reseñas</h2>
        {reviews.length === 0 ? (
          <p className="text-muted">Todavía no hay reseñas.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {reviews.map((r) => {
              const b = byId.get(r.book_id);
              if (!b) return null;
              const { bg, fg } = getBookColor(b);
              return (
                <button
                  key={r.id}
                  onClick={() => setEditing({ book: b, review: r })}
                  className="flex gap-4 rounded-2xl border border-border bg-surface p-4 text-left transition-shadow hover:shadow-md"
                >
                  <div
                    className="flex h-28 w-20 shrink-0 flex-col justify-between rounded-lg p-2.5"
                    style={{ background: bg, color: fg }}
                  >
                    <span className="font-serif text-[13px] leading-tight line-clamp-4">
                      “{b.title}”
                    </span>
                    <span className="font-mono text-[9px] opacity-80">{b.author}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-500">
                        {"★".repeat(r.rating ?? 0)}
                        <span className="text-stone-300">{"★".repeat(5 - (r.rating ?? 0))}</span>
                      </span>
                      {r.liked && <span title="Te gustó">❤</span>}
                    </div>
                    {r.review && <p className="mt-1.5 text-sm italic leading-snug">“{r.review}”</p>}
                    {r.loved?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {r.loved.slice(0, 3).map((l) => (
                          <span key={l} className="rounded-full bg-primary-soft px-2 py-0.5 text-[11px] text-maroon">
                            {l}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Selector de libro para reseñar */}
      {picking && (
        <div className="fixed inset-0 z-50 flex justify-center overflow-y-auto bg-black/40 p-4" onClick={() => setPicking(false)}>
          <div className="my-6 h-fit w-full max-w-md rounded-3xl bg-background p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-serif text-xl">¿Qué libro terminaste?</h2>
              <button onClick={() => setPicking(false)} className="text-2xl text-muted">×</button>
            </div>
            <div className="max-h-[60vh] space-y-1.5 overflow-y-auto">
              {books.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setPicking(false);
                    setEditing({ book: b, review: reviews.find((r) => r.book_id === b.id) ?? null });
                  }}
                  className="flex w-full items-center justify-between rounded-xl border border-border px-3 py-2 text-left text-sm hover:bg-primary-soft"
                >
                  <span className="min-w-0 truncate">
                    {b.title}
                    {b.author ? <span className="text-muted"> · {b.author}</span> : null}
                  </span>
                  {reviewedIds.has(b.id) && <span className="ml-2 shrink-0 text-xs text-accent">reseñado</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {editing && (
        <ReviewForm book={editing.book} existing={editing.review} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}

function ProfileBit({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl bg-surface/70 p-3">
      <p className="kicker">{title}</p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {items.length ? (
          items.map((i) => (
            <span key={i} className="rounded-full bg-primary-soft px-2.5 py-0.5 text-xs text-maroon">
              {i}
            </span>
          ))
        ) : (
          <span className="text-xs text-muted">—</span>
        )}
      </div>
    </div>
  );
}
