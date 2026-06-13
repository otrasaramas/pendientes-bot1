"use client";

import { useState } from "react";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
}

const QUESTIONS: QuizQuestion[] = [
  {
    id: "animo",
    question: "¿Cómo te sientes hoy / qué buscas?",
    options: ["Evadirme y soñar", "Aprender algo nuevo", "Emoción y tensión", "Algo reconfortante", "Reflexionar"],
  },
  {
    id: "tipo",
    question: "¿Ficción o realidad?",
    options: ["Ficción", "No ficción", "Me da igual"],
  },
  {
    id: "ritmo",
    question: "¿Qué ritmo te apetece?",
    options: ["Trepidante, que enganche", "Pausado y contemplativo", "Equilibrado"],
  },
  {
    id: "largo",
    question: "¿Cuánto tiempo tienes?",
    options: ["Poco: algo cortito", "Bastante: puedo con un tomo", "Lo que sea"],
  },
  {
    id: "tema",
    question: "¿Algún tema o ambiente que te llame ahora?",
    options: ["Amor y relaciones", "Aventura y mundos nuevos", "Crimen y misterio", "Historia y sociedad", "Crecimiento personal", "Sorpréndeme"],
  },
];

interface Rec {
  book_id?: string;
  title: string;
  author?: string;
  reason: string;
  in_library: boolean;
}

export default function RecommendQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [recs, setRecs] = useState<Rec[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const current = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;

  function choose(option: string) {
    const next = { ...answers, [current.id]: option };
    setAnswers(next);
    if (isLast) submit(next);
    else setStep(step + 1);
  }

  async function submit(finalAnswers: Record<string, string>) {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        answers: QUESTIONS.map((q) => ({
          question: q.question,
          answer: finalAnswers[q.id] ?? "(sin responder)",
        })),
      };
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "No se pudo recomendar.");
      setRecs(json.recommendations as Rec[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error.");
    } finally {
      setLoading(false);
    }
  }

  function restart() {
    setStep(0);
    setAnswers({});
    setRecs(null);
    setError(null);
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-surface p-10 text-center">
        <p className="animate-pulse text-lg text-primary">✨ Buscando tus 3 lecturas ideales…</p>
      </div>
    );
  }

  if (recs) {
    return (
      <div className="space-y-4">
        <h2 className="font-serif text-xl font-semibold">Tus 3 recomendaciones de hoy</h2>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="grid gap-4 md:grid-cols-3">
          {recs.map((r, i) => (
            <div key={i} className="flex flex-col rounded-xl border border-border bg-surface p-5">
              <span className="mb-2 text-3xl">{["🥇", "🥈", "🥉"][i] ?? "📕"}</span>
              <h3 className="font-serif text-lg font-semibold leading-tight">{r.title}</h3>
              {r.author && <p className="text-sm text-muted">{r.author}</p>}
              <span
                className={`mt-2 w-fit rounded-full px-2 py-0.5 text-[11px] ${
                  r.in_library ? "bg-accent/15 text-accent" : "bg-stone-100 text-muted"
                }`}
              >
                {r.in_library ? "📚 En tu biblioteca" : "💡 Sugerencia nueva"}
              </span>
              <p className="mt-3 text-sm leading-relaxed">{r.reason}</p>
            </div>
          ))}
        </div>
        <button
          onClick={restart}
          className="rounded-lg border border-border px-5 py-2.5 text-sm text-muted hover:bg-primary-soft"
        >
          🔄 Volver a empezar
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6 flex gap-1.5">
        {QUESTIONS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-border"}`}
          />
        ))}
      </div>

      <div className="rounded-xl border border-border bg-surface p-6">
        <p className="mb-1 text-xs text-muted">
          Pregunta {step + 1} de {QUESTIONS.length}
        </p>
        <h2 className="mb-5 font-serif text-xl font-semibold">{current.question}</h2>
        <div className="flex flex-col gap-2">
          {current.options.map((opt) => (
            <button
              key={opt}
              onClick={() => choose(opt)}
              className="rounded-lg border border-border px-4 py-3 text-left text-sm transition-colors hover:border-primary hover:bg-primary-soft"
            >
              {opt}
            </button>
          ))}
        </div>
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="mt-4 text-sm text-muted hover:text-foreground"
          >
            ← Atrás
          </button>
        )}
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}
