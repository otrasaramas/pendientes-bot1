/* eslint-disable @next/next/no-img-element */
import type { Book } from "@/lib/types";

const PALETTE = ["#9a6b4f", "#6b9080", "#8e7dbe", "#c08552", "#5e7a8f", "#a05c5c"];

function colorFor(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

export default function BookCover({
  book,
  className = "",
}: {
  book: Pick<Book, "title" | "author" | "cover_url">;
  className?: string;
}) {
  if (book.cover_url) {
    return (
      <img
        src={book.cover_url}
        alt={`Portada de ${book.title}`}
        className={`h-full w-full object-cover ${className}`}
        loading="lazy"
      />
    );
  }

  return (
    <div
      className={`flex h-full w-full flex-col justify-between p-3 text-white ${className}`}
      style={{ background: colorFor(book.title) }}
    >
      <span className="font-serif text-sm leading-tight font-semibold line-clamp-4">
        {book.title}
      </span>
      {book.author && (
        <span className="text-xs opacity-80 line-clamp-2">{book.author}</span>
      )}
    </div>
  );
}
