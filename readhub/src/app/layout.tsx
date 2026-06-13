import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ReadHub · Tu centro de lecturas",
  description:
    "Organiza, clasifica y descubre tu próxima lectura. Tu biblioteca personal con estadísticas y recomendaciones por IA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Nav />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
          {children}
        </main>
        <footer className="border-t border-border py-6 text-center text-sm text-muted">
          ReadHub · hecho con cariño para tus libros 📚
        </footer>
      </body>
    </html>
  );
}
