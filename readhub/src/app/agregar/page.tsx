import { isSupabaseConfigured } from "@/lib/supabase";
import SetupNotice from "@/components/SetupNotice";
import AddBookForm from "@/components/AddBookForm";

export const dynamic = "force-dynamic";

export default function AgregarPage() {
  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-serif text-2xl font-bold">➕ Agregar libro</h1>
        <p className="text-muted">
          Por foto de la portada, por título o manualmente. La IA propone los datos y tú confirmas.
        </p>
      </header>
      {isSupabaseConfigured ? <AddBookForm /> : <SetupNotice />}
    </div>
  );
}
