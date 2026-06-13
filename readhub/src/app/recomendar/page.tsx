import { isSupabaseConfigured } from "@/lib/supabase";
import SetupNotice from "@/components/SetupNotice";
import RecommendQuiz from "@/components/RecommendQuiz";

export const dynamic = "force-dynamic";

export default function RecomendarPage() {
  return (
    <div className="space-y-6">
      <header className="text-center">
        <h1 className="font-serif text-2xl font-bold">✨ ¿Qué leo ahora?</h1>
        <p className="text-muted">
          Responde 5 preguntas rápidas y te propongo 3 lecturas de tu lista pendiente.
        </p>
      </header>
      {isSupabaseConfigured ? <RecommendQuiz /> : <SetupNotice />}
    </div>
  );
}
