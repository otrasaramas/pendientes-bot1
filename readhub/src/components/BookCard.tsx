import type { Book } from "@/lib/types";
import { STATUS_META } from "@/lib/categories";
import BookCover from "./BookCover";
import StarRating from "./StarRating";

export default function BookCard({
  book,
  onClick,
}: {
  book: Book;
  onClick?: () => void;
}) {
  const status = STATUS_META[book.status];
  return (
    <button
      onClick={onClick}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-primary-soft">
        <BookCover book={book} />
        <span
          className="absolute right-2 top-2 rounded-full px-2 py-0.5 text-[11px] font-medium text-white shadow"
          style={{ background: status.color }}
        >
          {status.emoji} {status.label}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="font-serif text-sm leading-tight font-semibold line-clamp-2">
          {book.title}
        </h3>
        {book.author && <p className="text-xs text-muted line-clamp-1">{book.author}</p>}
        <div className="mt-auto flex items-center justify-between pt-1">
          {book.genre ? (
            <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[11px] text-primary line-clamp-1">
              {book.genre}
            </span>
          ) : (
            <span />
          )}
          {book.rating ? <StarRating value={book.rating} readOnly size="text-xs" /> : null}
        </div>
      </div>
    </button>
  );
}
