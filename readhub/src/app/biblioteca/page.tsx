import { getBooks } from "@/lib/queries";
import { isReady } from "@/lib/supabase";
import SetupNotice from "@/components/SetupNotice";
import BibliotecaClient from "@/components/BibliotecaClient";

export const dynamic = "force-dynamic";

export default async function BibliotecaPage() {
  if (!isReady) return <SetupNotice />;
  const books = await getBooks();

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-serif text-2xl font-bold">📚 Mi biblioteca</h1>
        <p className="text-muted">{books.length} libros guardados. Toca uno para ver o editar.</p>
      </header>
      <BibliotecaClient books={books} />
    </div>
  );
}
