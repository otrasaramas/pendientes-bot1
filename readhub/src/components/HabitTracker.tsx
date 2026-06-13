"use client";

import { useState, useTransition } from "react";
import { toggleReadingDay } from "@/app/actions";
import type { ReadingStats } from "@/lib/queries";

const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const DIAS = ["L", "M", "X", "J", "V", "S", "D"];

const toStr = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function buildWeeks(year: number) {
  const start = new Date(year, 0, 1);
  const offset = (start.getDay() + 6) % 7; // días desde el lunes
  const cur = new Date(year, 0, 1 - offset);
  const end = new Date(year, 11, 31);
  const weeks: Date[][] = [];
  while (cur <= end) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

export default function HabitTracker({
  year,
  readDays,
  stats,
}: {
  year: number;
  readDays: string[];
  stats: ReadingStats;
}) {
  const [set, setSet] = useState<Set<string>>(new Set(readDays));
  const [, start] = useTransition();
  const weeks = buildWeeks(year);
  const todayStr = toStr(new Date());
  const isCurrentYear = new Date().getFullYear() === year;

  function toggle(dateStr: string, isFuture: boolean) {
    if (isFuture) return;
    setSet((prev) => {
      const next = new Set(prev);
      if (next.has(dateStr)) next.delete(dateStr);
      else next.add(dateStr);
      return next;
    });
    start(() => {
      toggleReadingDay(dateStr).catch(() => {
        // revertir si falla
        setSet((prev) => {
          const next = new Set(prev);
          if (next.has(dateStr)) next.delete(dateStr);
          else next.add(dateStr);
          return next;
        });
      });
    });
  }

  const readToday = set.has(todayStr);

  return (
    <div className="space-y-6">
      {isCurrentYear && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-surface p-6 text-center">
          <p className="font-serif text-lg">¿Leíste hoy?</p>
          <button
            onClick={() => toggle(todayStr, false)}
            className={`rounded-full px-8 py-3 text-base font-semibold transition-all ${
              readToday
                ? "bg-accent text-white shadow"
                : "border-2 border-primary text-primary hover:bg-primary-soft"
            }`}
          >
            {readToday ? "✅ ¡Leíste hoy! (toca para deshacer)" : "📖 Marcar que leí hoy"}
          </button>
          {stats.currentStreak > 0 && (
            <p className="text-sm text-muted">
              🔥 Racha actual: <strong>{stats.currentStreak}</strong>{" "}
              día{stats.currentStreak !== 1 ? "s" : ""} seguido{stats.currentStreak !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatBox label="Días leídos" value={stats.daysThisYear} hint={`de ${stats.daysElapsed} transcurridos`} />
        <StatBox label="Racha actual" value={`🔥 ${stats.currentStreak}`} />
        <StatBox label="Racha más larga" value={`🏆 ${stats.longestStreak}`} />
        <StatBox label="Este mes" value={stats.thisMonth} />
      </div>

      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="overflow-x-auto no-scrollbar">
          <div className="inline-flex gap-3">
            {/* Etiquetas de día de la semana */}
            <div className="flex flex-col gap-1 pt-5 text-[10px] text-muted">
              {DIAS.map((d, i) => (
                <span key={i} className="flex h-3.5 items-center">
                  {i % 2 === 1 ? d : ""}
                </span>
              ))}
            </div>

            <div>
              {/* Etiquetas de mes */}
              <div className="mb-1 flex gap-1">
                {weeks.map((week, wi) => {
                  const firstInYear = week.find((d) => d.getFullYear() === year);
                  const prevWeekMonth =
                    wi > 0 ? weeks[wi - 1].find((d) => d.getFullYear() === year)?.getMonth() : -1;
                  const show =
                    firstInYear && firstInYear.getMonth() !== prevWeekMonth && firstInYear.getDate() <= 7;
                  return (
                    <span key={wi} className="w-3.5 text-[10px] text-muted">
                      {show ? MESES[firstInYear!.getMonth()] : ""}
                    </span>
                  );
                })}
              </div>

              {/* Celdas */}
              <div className="flex gap-1">
                {weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-1">
                    {week.map((date, di) => {
                      const ds = toStr(date);
                      const inYear = date.getFullYear() === year;
                      const isFuture = ds > todayStr;
                      const read = set.has(ds);
                      const isToday = ds === todayStr;
                      return (
                        <button
                          key={di}
                          onClick={() => toggle(ds, isFuture || !inYear)}
                          disabled={isFuture || !inYear}
                          title={inYear ? `${ds}${read ? " · leído" : ""}` : ""}
                          className={`h-3.5 w-3.5 rounded-sm transition-colors ${
                            !inYear
                              ? "bg-transparent"
                              : read
                                ? "bg-accent hover:opacity-80"
                                : isFuture
                                  ? "bg-stone-100"
                                  : "bg-primary-soft hover:bg-primary/30"
                          } ${isToday ? "ring-2 ring-primary ring-offset-1" : ""}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-end gap-2 text-[11px] text-muted">
          <span>Menos</span>
          <span className="h-3 w-3 rounded-sm bg-primary-soft" />
          <span className="h-3 w-3 rounded-sm bg-accent/60" />
          <span className="h-3 w-3 rounded-sm bg-accent" />
          <span>Más</span>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 text-center">
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-sm text-muted">{label}</p>
      {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}
