import { getBooks } from "@/lib/queries";
import { isSupabaseConfigured } from "@/lib/supabase";
import SetupNotice from "@/components/SetupNotice";
import KanbanBoard from "@/components/KanbanBoard";

export const dynamic = "force-dynamic";

export default async function TableroPage() {
  if (!isSupabaseConfigured) return <SetupNotice />;
  const books = await getBooks();

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-serif text-2xl font-bold">🗂️ Tablero de lectura</h1>
        <p className="text-muted">Organiza tus libros entre por leer, leyendo y leídos.</p>
      </header>
      <KanbanBoard books={books} />
    </div>
  );
}
