"use client";

import { useState, useTransition } from "react";
import { setBookRating } from "@/app/actions";

export default function StarRating({
  bookId,
  value,
  readOnly = false,
  size = "text-lg",
}: {
  bookId?: string;
  value: number | null;
  readOnly?: boolean;
  size?: string;
}) {
  const [optimistic, setOptimistic] = useState<number | null>(value);
  const [hover, setHover] = useState<number | null>(null);
  const [, startTransition] = useTransition();

  const shown = hover ?? optimistic ?? 0;

  function pick(star: number) {
    if (readOnly || !bookId) return;
    const next = optimistic === star ? null : star; // click again para quitar
    setOptimistic(next);
    startTransition(() => setBookRating(bookId, next));
  }

  return (
    <div className={`inline-flex ${size}`} role={readOnly ? undefined : "radiogroup"}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => pick(star)}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => !readOnly && setHover(null)}
          className={readOnly ? "cursor-default" : "cursor-pointer transition-transform hover:scale-110"}
          aria-label={`${star} estrella${star > 1 ? "s" : ""}`}
        >
          <span className={star <= shown ? "text-amber-500" : "text-stone-300"}>★</span>
        </button>
      ))}
    </div>
  );
}
