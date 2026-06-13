import Link from "next/link";
import { getReadingDays, computeReadingStats } from "@/lib/queries";
import { isReady } from "@/lib/supabase";
import SetupNotice from "@/components/SetupNotice";
import HabitTracker from "@/components/HabitTracker";

export const dynamic = "force-dynamic";

export default async function HabitoPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string }>;
}) {
  if (!isReady) return <SetupNotice />;

  const { year: yearParam } = await searchParams;
  const currentYear = new Date().getFullYear();
  const year = Number(yearParam) || currentYear;

  const days = await getReadingDays(year);
  const stats = computeReadingStats(days, year);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="kicker">Marca los días que lees</p>
          <h1 className="font-serif text-4xl">Hábito de lectura</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/habito?year=${year - 1}`}
            className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-primary-soft"
          >
            ← {year - 1}
          </Link>
          <span className="font-serif text-lg font-semibold">{year}</span>
          {year < currentYear && (
            <Link
              href={`/habito?year=${year + 1}`}
              className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-primary-soft"
            >
              {year + 1} →
            </Link>
          )}
        </div>
      </header>

      <HabitTracker
        year={year}
        readDays={days.map((d) => ({ day: d.day, pages: d.pages }))}
        stats={stats}
      />
    </div>
  );
}
