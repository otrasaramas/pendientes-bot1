import Link from "next/link";
import { getBooks, computeStats, getReadingDays, computeReadingStats } from "@/lib/queries";
import { isReady } from "@/lib/supabase";
import { STATUS_META } from "@/lib/categories";
import { getBookColor } from "@/lib/colors";
import SetupNotice from "@/components/SetupNotice";
import BookCover from "@/components/BookCover";

export const dynamic = "force-dynamic";

function Stat({
  label,
  value,
  hint,
  tint,
}: {
  label: string;
  value: string | number;
  hint?: string;
  tint: string;
}) {
  return (
    <div className="rounded-2xl p-4" style={{ background: tint + "66" }}>
      <p className="font-serif text-3xl">{value}</p>
      <p className="kicker mt-1">{label}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export default async function HomePage() {
  if (!isReady) {
    return (
      <div className="space-y-6">
        <Hero />
        <SetupNotice />
      </div>
    );
  }

  const year = new Date().getFullYear();
  const [books, readingDays] = await Promise.all([getBooks(), getReadingDays(year)]);
  const stats = computeStats(books);
  const readingStats = computeReadingStats(readingDays, year);
  const reading = books.filter((b) => b.status === "leyendo").slice(0, 4);
  const recent = [...books]
    .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
    .slice(0, 6);

  return (
    <div className="space-y-8">
      <Hero />

      {books.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-8 text-center">
          <p className="text-lg">Tu biblioteca está vacía 📭</p>
          <p className="mt-1 text-sm text-muted">
            Empieza agregando tu primer libro o importa tu hoja de cálculo.
          </p>
          <Link
            href="/agregar"
            className="mt-4 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white"
          >
            ➕ Agregar mi primer libro
          </Link>
        </div>
      ) : (
        <>
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <Stat tint="#bcd0ec" label="Libros en total" value={stats.total} />
            <Stat tint="#f2d35e" label={STATUS_META.por_leer.label} value={stats.porLeer} hint="📚 en cola" />
            <Stat tint="#aecfb0" label={STATUS_META.leyendo.label} value={stats.leyendo} hint="📖 en curso" />
            <Stat tint="#f1c3d8" label={STATUS_META.leido.label} value={stats.leido} hint={`🏆 ${stats.finishedThisYear} este año`} />
            <Stat tint="#e6b98f" label="Racha" value={`🔥 ${readingStats.currentStreak}`} hint={`${readingStats.daysThisYear} días leídos`} />
          </section>

          {reading.length > 0 && (
            <section>
              <h2 className="mb-3 font-serif text-2xl">Leyendo ahora</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {reading.map((b) => (
                  <Link
                    key={b.id}
                    href="/biblioteca"
                    className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3 hover:shadow-sm"
                  >
                    <div className="h-16 w-11 shrink-0 overflow-hidden rounded shadow-sm">
                      <BookCover book={b} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-tight line-clamp-2">{b.title}</p>
                      {b.author && <p className="text-xs text-muted line-clamp-1">{b.author}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="mb-3 font-serif text-2xl">Añadidos recientemente</h2>
              <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
                {recent.map((b) => (
                  <Link key={b.id} href="/biblioteca" className="block">
                    <div className="aspect-[2/3] overflow-hidden rounded-lg shadow-sm transition-transform hover:-translate-y-0.5">
                      <BookCover book={b} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-3 font-serif text-2xl">Por género</h2>
              <div className="space-y-2.5">
                {(() => {
                  const max = Math.max(...stats.byGenre.map((g) => g.count), 1);
                  return stats.byGenre.slice(0, 8).map((g) => (
                    <div key={g.name}>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="text-muted">{g.name}</span>
                        <span className="font-mono font-bold">{g.count}</span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-primary-soft">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.round((g.count / max) * 100)}%`,
                            background: getBookColor({ title: g.name, genre: g.name }).bg,
                          }}
                        />
                      </div>
                    </div>
                  ));
                })()}
                {stats.byGenre.length === 0 && (
                  <p className="text-sm text-muted">Sin géneros aún.</p>
                )}
              </div>
              <Link href="/estadisticas" className="mt-3 inline-block text-sm text-primary hover:underline">
                Ver todas las estadísticas →
              </Link>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function Hero() {
  return (
    <section className="rounded-2xl border border-border bg-surface p-8 sm:p-10">
      <p className="kicker">La biblioteca personal de Sara</p>
      <h1 className="mt-1 font-serif text-5xl leading-none sm:text-6xl">
        bookclub <span className="text-primary italic">de sara</span>
      </h1>
      <p className="mt-4 max-w-2xl text-muted">
        Guarda tus libros, clasifícalos con ayuda de IA, sigue tu hábito de lectura y descubre
        qué leer a continuación.
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href="/agregar"
          className="rounded-full bg-primary px-5 py-2.5 font-mono text-xs tracking-wide text-white"
        >
          + AGREGAR LIBRO
        </Link>
        <Link
          href="/recomendar"
          className="rounded-full border border-primary px-5 py-2.5 font-mono text-xs tracking-wide text-primary hover:bg-primary-soft"
        >
          ✦ RECOMIÉNDAME
        </Link>
      </div>
    </section>
  );
}
