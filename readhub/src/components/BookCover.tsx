/* eslint-disable @next/next/no-img-element */
import type { Book } from "@/lib/types";
import { getBookColor } from "@/lib/colors";

export default function BookCover({
  book,
  className = "",
}: {
  book: Pick<Book, "title" | "author" | "cover_url" | "genre">;
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

  const { bg, fg } = getBookColor(book);
  return (
    <div
      className={`flex h-full w-full flex-col justify-between p-2.5 ${className}`}
      style={{ background: bg, color: fg }}
    >
      <span className="font-serif text-[13px] leading-tight line-clamp-5">
        “{book.title}”
      </span>
      {book.author && (
        <span className="font-mono text-[9px] leading-tight opacity-80 line-clamp-2">
          {book.author}
        </span>
      )}
    </div>
  );
}
