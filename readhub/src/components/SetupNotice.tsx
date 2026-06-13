export default function SetupNotice() {
  return (
    <div className="rounded-xl border border-amber-300 bg-amber-50 p-6 text-amber-900">
      <h2 className="font-serif text-lg font-semibold">⚙️ Falta configurar la base de datos</h2>
      <p className="mt-2 text-sm">
        Para que ReadHub funcione, crea un archivo{" "}
        <code className="rounded bg-amber-100 px-1">.env.local</code> en la carpeta{" "}
        <code className="rounded bg-amber-100 px-1">readhub/</code> con tus claves de
        Supabase y Anthropic (mira <code className="rounded bg-amber-100 px-1">.env.example</code>),
        y ejecuta el esquema{" "}
        <code className="rounded bg-amber-100 px-1">supabase/schema.sql</code> en tu proyecto
        de Supabase.
      </p>
    </div>
  );
}
