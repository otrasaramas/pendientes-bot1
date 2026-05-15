const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const Anthropic = require("@anthropic-ai/sdk").default || require("@anthropic-ai/sdk");
const twilio = require("twilio");

const app = express();
app.use(express.urlencoded({ extended: false }));

// Clientes
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Estado temporal de conversación por usuario
const sessions = {};

// ─── HELPERS ───────────────────────────────────────────────────────────────

function twiReply(res, msg) {
  res.set("Content-Type", "text/xml");
  res.send(`<Response><Message>${msg}</Message></Response>`);
}

function getSession(phone) {
  if (!sessions[phone]) sessions[phone] = { step: null, data: {} };
  return sessions[phone];
}

function clearSession(phone) {
  sessions[phone] = { step: null, data: {} };
}

const HELP_MSG = `📋 *Mis Pendientes Bot*

Comandos disponibles:

➕ *agregar* — Agregar nueva tarea
📋 *lista* — Ver todas tus tareas
✅ *listo [N]* — Marcar tarea N como hecha
🗑 *borrar [N]* — Eliminar tarea N
🎯 *plan [minutos]* — Generar plan del día
🏷 *categorias* — Ver/ajustar prioridad de categorías
❓ *ayuda* — Ver este menú`;

const CATEGORIES = ["Trabajo", "Personal", "Salud", "Hogar", "Finanzas", "Educación", "Otro"];
const PRIORITIES = ["Alta", "Media", "Baja"];

// ─── TAREAS ────────────────────────────────────────────────────────────────

async function getTasks(phone) {
  const { data } = await supabase
    .from("tasks")
    .select("*")
    .eq("phone", phone)
    .eq("done", false)
    .order("cat_priority", { ascending: true })
    .order("priority", { ascending: true });
  return data || [];
}

async function formatTaskList(phone) {
  const tasks = await getTasks(phone);
  if (!tasks.length) return "✨ No tienes tareas pendientes. Usa *agregar* para añadir una.";

  const priorityLabel = { Alta: "🔴", Media: "🟡", Baja: "🟢" };
  let msg = `📋 *Tus pendientes (${tasks.length})*\n\n`;
  tasks.forEach((t, i) => {
    msg += `${i + 1}. ${priorityLabel[t.priority]} *${t.name}*\n`;
    msg += `   ⏱ ${t.minutes}min · 📁 ${t.category}\n`;
  });
  const total = tasks.reduce((s, t) => s + t.minutes, 0);
  msg += `\n⏳ Total estimado: ${Math.floor(total / 60)}h ${total % 60}m`;
  return msg;
}

// ─── FLUJO AGREGAR TAREA ───────────────────────────────────────────────────

async function handleAgregar(phone, msg, session, res) {
  const s = session;

  if (!s.step) {
    s.step = "agregar_nombre";
    return twiReply(res, "➕ ¿Cómo se llama la tarea?");
  }

  if (s.step === "agregar_nombre") {
    s.data.name = msg;
    s.step = "agregar_minutos";
    return twiReply(res, `⏱ ¿Cuántos minutos estimás que toma *${msg}*?`);
  }

  if (s.step === "agregar_minutos") {
    const mins = parseInt(msg);
    if (isNaN(mins) || mins <= 0) return twiReply(res, "Por favor ingresá un número válido de minutos.");
    s.data.minutes = mins;
    s.step = "agregar_prioridad";
    return twiReply(res, `🎯 ¿Qué prioridad tiene?\n\n1. Alta\n2. Media\n3. Baja`);
  }

  if (s.step === "agregar_prioridad") {
    const map = { "1": "Alta", "2": "Media", "3": "Baja", alta: "Alta", media: "Media", baja: "Baja" };
    const priority = map[msg.toLowerCase()];
    if (!priority) return twiReply(res, "Respondé 1, 2 o 3 (o Alta/Media/Baja).");
    s.data.priority = priority;
    s.step = "agregar_categoria";
    return twiReply(res, `📁 ¿Categoría?\n\n${CATEGORIES.map((c, i) => `${i + 1}. ${c}`).join("\n")}`);
  }

  if (s.step === "agregar_categoria") {
    const idx = parseInt(msg) - 1;
    const byName = CATEGORIES.find(c => c.toLowerCase() === msg.toLowerCase());
    const category = CATEGORIES[idx] || byName;
    if (!category) return twiReply(res, `Elegí un número del 1 al ${CATEGORIES.length}.`);
    s.data.category = category;

    // Obtener prioridad de categoría del usuario
    const { data: catData } = await supabase
      .from("tasks")
      .select("category, cat_priority")
      .eq("phone", phone)
      .eq("category", category)
      .limit(1);

    const catPriority = catData?.[0]?.cat_priority ?? 5;

    await supabase.from("tasks").insert({
      phone,
      name: s.data.name,
      minutes: s.data.minutes,
      priority: s.data.priority,
      category,
      cat_priority: catPriority,
      done: false
    });

    clearSession(phone);
    return twiReply(res, `✅ Tarea guardada:\n\n*${s.data.name}*\n⏱ ${s.data.minutes}min · ${s.data.priority} · ${category}\n\nEscribí *lista* para ver todos tus pendientes.`);
  }
}

// ─── GENERAR PLAN CON IA ───────────────────────────────────────────────────

async function generatePlan(phone, availableMinutes, extraContext) {
  const tasks = await getTasks(phone);
  if (!tasks.length) return "No tenés tareas pendientes. Usá *agregar* para añadir una.";

  const taskList = tasks
    .map(t => `- "${t.name}" | ${t.minutes}min | Prioridad: ${t.priority} | Categoría: ${t.category} (prioridad de categoría: ${t.cat_priority}/10)`)
    .join("\n");

  const prompt = `Sos un experto en productividad y gestión del tiempo. Tu objetivo es ayudar al usuario a completar la mayor cantidad de tareas importantes en el menor tiempo posible.

El usuario tiene ${availableMinutes} minutos disponibles hoy.
${extraContext ? `Contexto: ${extraContext}` : ""}

Sus tareas pendientes (ordenadas por prioridad):
${taskList}

Generá un plan ultra-eficiente considerando:
1. Prioridad de categoría (número más bajo = más prioritaria)
2. Prioridad de tarea (Alta > Media > Baja)
3. Agrupá tareas de la misma categoría para evitar cambios de contexto
4. Sugerí técnicas de eficiencia si aplica (pomodoro, batching, etc.)
5. Si hay tareas que se pueden hacer en paralelo o mientras se espera algo, indicálo

Respondé en este formato:
PLAN:
[lista numerada, cada ítem: Número. Tarea - Xmin - tip de eficiencia si aplica]

TIEMPO TOTAL: Xmin de ${availableMinutes}min disponibles

ESTRATEGIA:
[2-3 oraciones sobre la lógica y cómo hacer todo más rápido]

CONSEJO:
[un tip concreto de productividad para hoy]`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }]
  });

  return response.content[0].text;
}

// ─── WEBHOOK PRINCIPAL ─────────────────────────────────────────────────────

app.post("/webhook", async (req, res) => {
  const phone = req.body.From?.replace("whatsapp:", "");
  const msg = req.body.Body?.trim();

  if (!phone || !msg) return twiReply(res, "Error procesando mensaje.");

  const session = getSession(phone);
  const cmd = msg.toLowerCase();

  // Si hay una sesión activa, continuar el flujo
  if (session.step?.startsWith("agregar")) {
    return handleAgregar(phone, msg, session, res);
  }

  if (session.step === "plan_contexto") {
    const { minutes } = session.data;
    clearSession(phone);
    try {
      const plan = await generatePlan(phone, minutes, msg === "-" ? "" : msg);
      return twiReply(res, plan);
    } catch {
      return twiReply(res, "Error generando el plan. Intentá de nuevo.");
    }
  }

  if (session.step?.startsWith("cat_")) {
    return handleCategorias(phone, msg, session, res);
  }

  // Comandos principales
  if (cmd === "agregar" || cmd === "nueva" || cmd === "add") {
    return handleAgregar(phone, msg, session, res);
  }

  if (cmd === "lista" || cmd === "pendientes" || cmd === "mis pendientes") {
    const list = await formatTaskList(phone);
    return twiReply(res, list);
  }

  if (cmd.startsWith("listo ") || cmd.startsWith("done ")) {
    const n = parseInt(cmd.split(" ")[1]);
    const tasks = await getTasks(phone);
    const task = tasks[n - 1];
    if (!task) return twiReply(res, `No encontré la tarea número ${n}. Escribí *lista* para ver tus tareas.`);
    await supabase.from("tasks").update({ done: true }).eq("id", task.id);
    return twiReply(res, `✅ *${task.name}* marcada como completada. 💪`);
  }

  if (cmd.startsWith("borrar ") || cmd.startsWith("eliminar ")) {
    const n = parseInt(cmd.split(" ")[1]);
    const tasks = await getTasks(phone);
    const task = tasks[n - 1];
    if (!task) return twiReply(res, `No encontré la tarea número ${n}.`);
    await supabase.from("tasks").delete().eq("id", task.id);
    return twiReply(res, `🗑 *${task.name}* eliminada.`);
  }

  if (cmd.startsWith("plan")) {
    const parts = cmd.split(" ");
    const minutes = parseInt(parts[1]);
    if (!minutes || isNaN(minutes)) {
      return twiReply(res, "Indicá los minutos disponibles. Ej: *plan 120*\n\nTambién podés agregar contexto: *plan 120 estoy cansado y tengo reunión a las 3*");
    }
    session.step = "plan_contexto";
    session.data.minutes = minutes;
    return twiReply(res, `⏱ Tenés ${minutes} minutos. ¿Algún contexto extra para hoy? (ej: "estoy cansado", "tengo reunión a las 3pm")\n\nEscribí *-* si no hay nada especial.`);
  }

  if (cmd === "categorias" || cmd === "categorías") {
    return handleCategorias(phone, msg, session, res);
  }

  if (cmd === "ayuda" || cmd === "help" || cmd === "hola" || cmd === "inicio") {
    return twiReply(res, HELP_MSG);
  }

  // Fallback
  return twiReply(res, `No entendí ese comando. Escribí *ayuda* para ver qué podés hacer.`);
});

// ─── FLUJO CATEGORÍAS ──────────────────────────────────────────────────────

async function handleCategorias(phone, msg, session, res) {
  if (!session.step || session.step === "cat_menu") {
    session.step = "cat_menu";
    let menuMsg = `🏷 *Prioridad de categorías*\n\nNúmero más bajo = más prioritaria\n\n`;
    
    const { data: cats } = await supabase
      .from("tasks")
      .select("category, cat_priority")
      .eq("phone", phone)
      .not("done", "eq", true);

    const catMap = {};
    (cats || []).forEach(t => { catMap[t.category] = t.cat_priority; });

    CATEGORIES.forEach((c, i) => {
      const p = catMap[c] ?? 5;
      menuMsg += `${i + 1}. ${c} — prioridad *${p}*\n`;
    });

    menuMsg += `\nEscribí el número de la categoría que querés cambiar, o *cancelar* para salir.`;
    return twiReply(res, menuMsg);
  }

  if (session.step === "cat_menu") {
    if (msg.toLowerCase() === "cancelar") { clearSession(phone); return twiReply(res, "Cancelado."); }
    const idx = parseInt(msg) - 1;
    const cat = CATEGORIES[idx];
    if (!cat) return twiReply(res, "Elegí un número válido o escribí *cancelar*.");
    session.data.editCat = cat;
    session.step = "cat_set_priority";
    return twiReply(res, `¿Qué prioridad le das a *${cat}*? (1 = máxima, 10 = mínima)`);
  }

  if (session.step === "cat_set_priority") {
    const p = parseInt(msg);
    if (isNaN(p) || p < 1 || p > 10) return twiReply(res, "Ingresá un número entre 1 y 10.");
    const cat = session.data.editCat;
    await supabase.from("tasks").update({ cat_priority: p }).eq("phone", phone).eq("category", cat).eq("done", false);
    clearSession(phone);
    return twiReply(res, `✅ *${cat}* ahora tiene prioridad ${p}.\n\nEscribí *categorias* para seguir ajustando o *lista* para ver tus tareas.`);
  }
}

// ─── INICIAR SERVIDOR ──────────────────────────────────────────────────────

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bot corriendo en puerto ${PORT}`));
