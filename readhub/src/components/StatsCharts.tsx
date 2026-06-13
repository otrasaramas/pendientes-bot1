"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import type { LibraryStats } from "@/lib/queries";
import { getBookColor } from "@/lib/colors";

const COLORS = ["#bb4a2c", "#6f8f76", "#a9722e", "#2f6fae", "#d8a7a0", "#f0bf2b", "#1f2f5e"];

const genreColor = (name: string) => getBookColor({ title: name, genre: name }).bg;

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h3 className="mb-4 font-serif font-semibold">{title}</h3>
      {children}
    </div>
  );
}

export default function StatsCharts({ stats }: { stats: LibraryStats }) {
  const fictionData = [
    { name: "Ficción", value: stats.fiction },
    { name: "No ficción", value: stats.nonFiction },
  ].filter((d) => d.value > 0);

  const genreData = stats.byGenre.slice(0, 8);
  const statusData = stats.byStatus.filter((s) => s.value > 0);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Panel title="Ficción vs. No ficción">
        {fictionData.length ? (
          <>
            <p className="mb-2 text-sm text-muted">
              <span className="text-2xl font-semibold text-foreground">{stats.fictionPct}%</span>{" "}
              de los libros clasificados son de ficción.
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={fictionData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {fictionData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </>
        ) : (
          <p className="text-sm text-muted">Aún no hay libros clasificados por tipo.</p>
        )}
      </Panel>

      <Panel title="Por estado de lectura">
        {statusData.length ? (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={80} label>
                {statusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-muted">Sin datos.</p>
        )}
      </Panel>

      <Panel title="Libros por género">
        {genreData.length ? (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={genreData}
                dataKey="count"
                nameKey="name"
                outerRadius={95}
                paddingAngle={2}
              >
                {genreData.map((g) => (
                  <Cell key={g.name} fill={genreColor(g.name)} />
                ))}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-muted">Aún no hay géneros registrados.</p>
        )}
      </Panel>

      <Panel title="Distribución de valoraciones">
        {stats.ratings.some((r) => r.count > 0) ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.ratings.map((r) => ({ name: "★".repeat(r.rating), count: r.count }))}>
              <XAxis dataKey="name" tick={{ fontSize: 14 }} />
              <YAxis allowDecimals={false} width={28} />
              <Tooltip />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#8e7dbe" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-muted">Aún no has valorado libros.</p>
        )}
      </Panel>
    </div>
  );
}
