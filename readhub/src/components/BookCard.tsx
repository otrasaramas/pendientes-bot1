import type { Book } from "@/lib/types";
import { STATUS_META } from "@/lib/categories";
import { getBookColor } from "@/lib/colors";

export default function BookCard({
  book,
  onClick,
}: {
  book: Book;
  onClick?: () => void;
}) {
  const { bg, fg } = getBookColor(book);
  const status = STATUS_META[book.status];

  return (
    <button
      onClick={onClick}
      style={{ background: bg, color: fg }}
      className="group relative flex aspect-[3/4] flex-col justify-between rounded-md p-3 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
    >
      <span
        className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full"
        style={{ background: status.color }}
        title={status.label}
      />
      <p className="font-serif text-[15px] leading-tight" style={{ color: fg }}>
        “{book.title}”
      </p>
      <div className="font-mono text-[10px] leading-tight" style={{ color: fg }}>
        {book.genre && (
          <span className="mb-1 block uppercase tracking-wide opacity-70 line-clamp-2">
            {book.genre}
          </span>
        )}
        {book.author && <span className="block opacity-90 line-clamp-1">{book.author}</span>}
        {book.year && <span className="mt-1 block text-[13px]">{book.year}</span>}
      </div>
    </button>
  );
}
