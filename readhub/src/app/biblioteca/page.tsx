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
        <p className="kicker">{books.length} libros · toca uno para ver o editar</p>
        <h1 className="font-serif text-4xl">Biblioteca</h1>
      </header>
      <BibliotecaClient books={books} />
    </div>
  );
}
