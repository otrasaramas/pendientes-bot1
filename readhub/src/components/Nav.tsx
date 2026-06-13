"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Inicio", emoji: "🏠" },
  { href: "/biblioteca", label: "Biblioteca", emoji: "📚" },
  { href: "/agregar", label: "Agregar", emoji: "➕" },
  { href: "/tablero", label: "Tablero", emoji: "🗂️" },
  { href: "/estadisticas", label: "Estadísticas", emoji: "📊" },
  { href: "/recomendar", label: "Recomiéndame", emoji: "✨" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-serif text-xl font-semibold">
          <span className="text-2xl">📖</span>
          <span>
            Read<span className="text-primary">Hub</span>
          </span>
        </Link>
        <ul className="flex flex-1 flex-wrap items-center justify-end gap-1 text-sm">
          {LINKS.slice(1).map((l) => {
            const active =
              l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors ${
                    active
                      ? "bg-primary text-white"
                      : "text-muted hover:bg-primary-soft hover:text-foreground"
                  }`}
                >
                  <span aria-hidden>{l.emoji}</span>
                  <span className="hidden sm:inline">{l.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
