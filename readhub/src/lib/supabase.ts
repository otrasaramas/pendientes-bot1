import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase para uso EXCLUSIVO en el servidor.
 * Usa la service role key, por lo que nunca debe importarse en componentes
 * cliente (el `server-only` de arriba lo impide en tiempo de build).
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(url && serviceKey);

/** Modo demo (datos de muestra, sin base de datos real). */
export const isDemo = process.env.READHUB_DEMO === "1";

/** La app puede mostrar contenido si hay Supabase configurado o estamos en demo. */
export const isReady = isSupabaseConfigured || isDemo;

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase no está configurado. Define NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en tu .env.local",
    );
  }
  if (!client) {
    client = createClient(url!, serviceKey!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}
