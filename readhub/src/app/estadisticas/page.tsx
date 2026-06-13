import { getBooks, computeStats } from "@/lib/queries";
import { isReady } from "@/lib/supabase";
import SetupNotice from "@/components/SetupNotice";
import StatsCharts from "@/components/StatsCharts";

export const dynamic = "force-dynamic";

function Big({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 text-center">
      <p className="text-3xl font-semibold">{value}</p>
      <p className="text-sm text-muted">{label}</p>
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
        <h1 className="font-serif text-2xl font-bold">📊 Estadísticas</h1>
        <p className="text-muted">Una mirada a tus hábitos de lectura.</p>
      </header>

      {books.length === 0 ? (
        <p className="text-muted">Agrega libros para ver tus estadísticas.</p>
      ) : (
        <>
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <Big label="Libros" value={stats.total} />
            <Big label="Leídos" value={stats.leido} />
            <Big label="% Ficción" value={`${stats.fictionPct}%`} />
            <Big label="Páginas leídas" value={stats.pagesRead.toLocaleString("es")} />
            <Big label="Valoración media" value={stats.avgRating ?? "—"} />
            <Big label="Leídos este año" value={stats.finishedThisYear} />
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
