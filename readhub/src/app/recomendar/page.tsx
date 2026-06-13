import { isReady } from "@/lib/supabase";
import SetupNotice from "@/components/SetupNotice";
import RecommendQuiz from "@/components/RecommendQuiz";

export const dynamic = "force-dynamic";

export default function RecomendarPage() {
  return (
    <div className="space-y-6">
      <header className="text-center">
        <p className="kicker">Recomiéndame</p>
        <h1 className="font-serif text-4xl">¿Qué leo ahora?</h1>
        <p className="mt-1 text-muted">
          Responde 5 preguntas rápidas y te propongo 3 lecturas de tu lista pendiente.
        </p>
      </header>
      {isReady ? <RecommendQuiz /> : <SetupNotice />}
    </div>
  );
}
