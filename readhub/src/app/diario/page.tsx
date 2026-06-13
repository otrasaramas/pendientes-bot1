import { getBooks, getReviews, computeTasteProfile } from "@/lib/queries";
import { isReady } from "@/lib/supabase";
import SetupNotice from "@/components/SetupNotice";
import DiarioClient from "@/components/DiarioClient";

export const dynamic = "force-dynamic";

export default async function DiarioPage() {
  if (!isReady) return <SetupNotice />;
  const [books, reviews] = await Promise.all([getBooks(), getReviews()]);
  const profile = computeTasteProfile(reviews, books);

  return (
    <div className="space-y-6">
      <header>
        <p className="kicker">Diario de lecturas</p>
        <h1 className="font-serif text-4xl">Reseñas</h1>
        <p className="mt-1 text-muted">
          Registra tus libros terminados con una reflexión corta. Con eso aprendo tu gusto y
          predigo si el próximo te gustará.
        </p>
      </header>
      <DiarioClient books={books} reviews={reviews} profile={profile} />
    </div>
  );
}
