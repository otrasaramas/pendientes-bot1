import { getBooks } from "@/lib/queries";
import { isReady } from "@/lib/supabase";
import SetupNotice from "@/components/SetupNotice";
import KanbanBoard from "@/components/KanbanBoard";

export const dynamic = "force-dynamic";

export default async function TableroPage() {
  if (!isReady) return <SetupNotice />;
  const books = await getBooks();

  return (
    <div className="space-y-5">
      <header>
        <p className="kicker">Por leer · leyendo · leído</p>
        <h1 className="font-serif text-4xl">Tablero</h1>
      </header>
      <KanbanBoard books={books} />
    </div>
  );
}
