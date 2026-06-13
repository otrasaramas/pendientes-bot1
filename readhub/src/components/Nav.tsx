"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/biblioteca", label: "Biblioteca" },
  { href: "/agregar", label: "Agregar" },
  { href: "/tablero", label: "Tablero" },
  { href: "/diario", label: "Diario" },
  { href: "/habito", label: "Hábito" },
  { href: "/estadisticas", label: "Estadísticas" },
  { href: "/recomendar", label: "Recomiéndame" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="font-serif text-2xl leading-none tracking-tight">
          bookclub <span className="text-primary italic">de sara</span>
        </Link>
        <ul className="flex flex-wrap items-center gap-x-1 gap-y-1">
          {LINKS.map((l) => {
            const active =
              l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`block rounded-full px-3 py-1 font-mono text-[11px] tracking-wide transition-colors ${
                    active
                      ? "bg-primary text-white"
                      : "text-muted hover:bg-primary-soft hover:text-foreground"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
