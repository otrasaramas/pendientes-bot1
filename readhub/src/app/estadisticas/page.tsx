import { getBooks, computeStats } from "@/lib/queries";
import { isReady } from "@/lib/supabase";
import SetupNotice from "@/components/SetupNotice";
import StatsCharts from "@/components/StatsCharts";

export const dynamic = "force-dynamic";

const TINTS = ["#bcd0ec", "#f1c3d8", "#f2d35e", "#aecfb0", "#e6b98f", "#d9c9ec"];

function Big({ label, value, i }: { label: string; value: string | number; i: number }) {
  return (
    <div className="rounded-2xl p-4 text-center" style={{ background: TINTS[i % TINTS.length] + "66" }}>
      <p className="font-serif text-3xl">{value}</p>
      <p className="kicker mt-1">{label}</p>
    </div>
  );
}

export default async function EstadisticasPage() {
  if (!isReady) return <SetupNotice />;
  const books = await getBooks();
  const stats = computeStats(books);

  return (
    <div className="space-y-6">
      <header>
        <p className="kicker">Tus hábitos de lectura</p>
        <h1 className="font-serif text-4xl">Estadísticas</h1>
      </header>

      {books.length === 0 ? (
        <p className="text-muted">Agrega libros para ver tus estadísticas.</p>
      ) : (
        <>
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <Big i={0} label="Libros" value={stats.total} />
            <Big i={1} label="Leídos" value={stats.leido} />
            <Big i={2} label="% Ficción" value={`${stats.fictionPct}%`} />
            <Big i={3} label="Páginas leídas" value={stats.pagesRead.toLocaleString("es")} />
            <Big i={4} label="Valoración media" value={stats.avgRating ?? "—"} />
            <Big i={5} label="Leídos este año" value={stats.finishedThisYear} />
          </section>

          <StatsCharts stats={stats} />

          {stats.topAuthors.length > 0 && (
            <section className="rounded-xl border border-border bg-surface p-5">
              <h3 className="mb-4 font-serif font-semibold">✍️ Autores con más libros</h3>
              <div className="flex flex-wrap gap-2">
                {stats.topAuthors.map((a) => (
                  <span key={a.name} className="rounded-full bg-primary-soft px-3 py-1 text-sm text-primary">
                    {a.name} · {a.count}
                  </span>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
