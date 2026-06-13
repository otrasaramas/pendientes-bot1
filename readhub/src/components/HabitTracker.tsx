"use client";

import { useState, useTransition } from "react";
import { setReadingPages } from "@/app/actions";
import type { ReadingStats } from "@/lib/queries";

const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const QUICK = [15, 25, 40, 60];

const toStr = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function buildWeeks(year: number) {
  const start = new Date(year, 0, 1);
  const offset = (start.getDay() + 6) % 7;
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
  readDays: { day: string; pages: number | null }[];
  stats: ReadingStats;
}) {
  const [map, setMap] = useState<Map<string, number>>(
    () => new Map(readDays.map((d) => [d.day, d.pages ?? 0])),
  );
  const [input, setInput] = useState("");
  const [, start] = useTransition();
  const weeks = buildWeeks(year);
  const todayStr = toStr(new Date());
  const isCurrentYear = new Date().getFullYear() === year;
  const todayPages = map.get(todayStr) ?? 0;
  const maxPages = Math.max(1, ...[...map.values()]);

  function save(dateStr: string, pages: number, isFuture: boolean) {
    if (isFuture) return;
    setMap((prev) => {
      const next = new Map(prev);
      if (pages > 0) next.set(dateStr, pages);
      else next.delete(dateStr);
      return next;
    });
    start(() => {
      setReadingPages(dateStr, pages).catch(() => setMap(new Map(readDays.map((d) => [d.day, d.pages ?? 0]))));
    });
  }

  function saveToday() {
    const n = parseInt(input, 10);
    if (Number.isFinite(n) && n > 0) {
      save(todayStr, n, false);
      setInput("");
    }
  }

  // tamaño del punto según páginas (percepción por área)
  function dotSize(pages: number) {
    if (!pages) return 6;
    return Math.round(7 + Math.sqrt(pages / maxPages) * 12); // 7..19 px
  }

  return (
    <div className="space-y-6">
      {isCurrentYear && (
        <div className="rounded-3xl bg-gradient-to-br from-primary-soft to-surface p-6 sm:p-7">
          <p className="kicker">Registro de hoy</p>
          <h2 className="mt-1 font-serif text-2xl">¿Cuántas páginas leíste hoy?</h2>
          {todayPages > 0 && (
            <p className="mt-1 text-sm text-accent">
              ✅ Hoy llevas <strong>{todayPages}</strong> páginas registradas.
            </p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <input
              type="number"
              min={0}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveToday()}
              placeholder={todayPages ? String(todayPages) : "páginas"}
              className="w-28 rounded-full border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
            <button
              onClick={saveToday}
              className="rounded-full bg-primary px-5 py-2.5 font-mono text-xs tracking-wide text-white"
            >
              GUARDAR
            </button>
            {QUICK.map((q) => (
              <button
                key={q}
                onClick={() => save(todayStr, (map.get(todayStr) ?? 0) + q, false)}
                className="rounded-full border border-border bg-surface px-3 py-2 text-xs hover:bg-primary-soft"
                title={`Sumar ${q} páginas`}
              >
                +{q}
              </button>
            ))}
            {todayPages > 0 && (
              <button
                onClick={() => save(todayStr, 0, false)}
                className="rounded-full px-3 py-2 text-xs text-muted hover:text-foreground"
              >
                No leí hoy
              </button>
            )}
          </div>
          {stats.currentStreak > 0 && (
            <p className="mt-3 text-sm text-muted">
              🔥 Racha actual: <strong>{stats.currentStreak}</strong>{" "}
              día{stats.currentStreak !== 1 ? "s" : ""} seguido{stats.currentStreak !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatBox tint="#f1c3d8" label="Días leídos" value={stats.daysThisYear} hint={`de ${stats.daysElapsed}`} />
        <StatBox tint="#f2d35e" label="Racha actual" value={`🔥 ${stats.currentStreak}`} hint={`máx ${stats.longestStreak}`} />
        <StatBox tint="#bcd0ec" label="Páginas del año" value={stats.totalPages.toLocaleString("es")} />
        <StatBox tint="#aecfb0" label="Prom. páginas/día" value={stats.avgPages} hint={`${stats.pagesThisMonth} este mes`} />
      </div>

      <div className="rounded-3xl border border-border bg-surface p-5 sm:p-6">
        <div className="mb-3 flex items-center justify-between">
          <p className="kicker">Cada punto es un día · tamaño = páginas leídas</p>
        </div>
        <div className="overflow-x-auto no-scrollbar">
          <div>
            {/* etiquetas de mes */}
            <div className="mb-1 flex gap-1 pl-1">
              {weeks.map((week, wi) => {
                const firstInYear = week.find((d) => d.getFullYear() === year);
                const prevMonth =
                  wi > 0 ? weeks[wi - 1].find((d) => d.getFullYear() === year)?.getMonth() : -1;
                const show =
                  firstInYear && firstInYear.getMonth() !== prevMonth && firstInYear.getDate() <= 7;
                return (
                  <span key={wi} className="w-[18px] font-mono text-[9px] text-muted">
                    {show ? MESES[firstInYear!.getMonth()] : ""}
                  </span>
                );
              })}
            </div>
            <div className="flex gap-1">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  {week.map((date, di) => {
                    const ds = toStr(date);
                    const inYear = date.getFullYear() === year;
                    const isFuture = ds > todayStr;
                    const pages = map.get(ds) ?? 0;
                    const read = map.has(ds);
                    const isToday = ds === todayStr;
                    const s = dotSize(pages);
                    return (
                      <button
                        key={di}
                        onClick={() => {
                          if (isFuture || !inYear) return;
                          if (read) save(ds, 0, false);
                          else {
                            const v = prompt(`Páginas leídas el ${ds}:`, "20");
                            if (v !== null) save(ds, parseInt(v, 10) || 0, false);
                          }
                        }}
                        disabled={isFuture || !inYear}
                        title={inYear ? `${ds}${read ? ` · ${pages || "leído"} págs` : ""}` : ""}
                        className={`flex h-[18px] w-[18px] items-center justify-center rounded-md ${
                          !inYear ? "" : "bg-primary-soft/40"
                        } ${isToday ? "ring-2 ring-primary ring-offset-1" : ""}`}
                        style={{ background: inYear ? undefined : "transparent" }}
                      >
                        {inYear && (
                          <span
                            className="block rounded-full"
                            style={{
                              width: read ? s : 5,
                              height: read ? s : 5,
                              background: read ? "var(--primary)" : isFuture ? "#e6dcc8" : "#d8cdb6",
                            }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-end gap-2 font-mono text-[10px] text-muted">
          <span>menos</span>
          <span className="block h-2 w-2 rounded-full" style={{ background: "var(--primary)" }} />
          <span className="block h-3 w-3 rounded-full" style={{ background: "var(--primary)" }} />
          <span className="block h-4 w-4 rounded-full" style={{ background: "var(--primary)" }} />
          <span>más páginas</span>
        </div>
      </div>
      <p className="text-center text-xs text-muted">
        Toca un día para registrarlo o quitarlo. Usa el campo de arriba para sumar las de hoy.
      </p>
    </div>
  );
}

function StatBox({
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
    <div className="rounded-2xl p-4 text-center" style={{ background: tint + "55" }}>
      <p className="font-serif text-2xl">{value}</p>
      <p className="kicker mt-1">{label}</p>
      {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}
