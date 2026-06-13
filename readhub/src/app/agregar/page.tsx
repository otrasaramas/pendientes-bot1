import { isReady } from "@/lib/supabase";
import SetupNotice from "@/components/SetupNotice";
import AddBookForm from "@/components/AddBookForm";

export const dynamic = "force-dynamic";

export default function AgregarPage() {
  return (
    <div className="space-y-5">
      <header>
        <p className="kicker">Nuevo libro</p>
        <h1 className="font-serif text-4xl">Agregar</h1>
        <p className="mt-1 text-muted">
          Por foto de la portada, por título o manualmente. La IA propone los datos y tú confirmas.
        </p>
      </header>
      {isReady ? <AddBookForm /> : <SetupNotice />}
    </div>
  );
}
