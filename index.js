const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const Anthropic = require("@anthropic-ai/sdk").default || require("@anthropic-ai/sdk");
const twilio = require("twilio");

const app = express();
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => res.send("Bot activo ✅"));
app.get("/webhook", (req, res) => res.send("Webhook listo ✅"));

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
✅ *listo [N]* — Marcar tarea N como hecha (se archiva)
🗑 *borrar [N]* — Eliminar tarea N
📅 *calendario* — Calendario óptimo día por día con horarios
🎯 *plan [minutos]* — Plan rápido solo para hoy
🏷 *categorias* — Ver/ajustar prioridad de categorías
❓ *ayuda* — Ver este menú`;

const CATEGORIES = ["Trabajo", "Personal", "Salud", "Hogar", "Finanzas", "Educación", "Otro"];
const PRIORITIES = ["Alta", "Media", "Baja"];

// Eje de balance de vida: Trabajo vs Creatividad/Arte (meta 70/30)
const AREAS = ["Trabajo", "Creatividad"];
const AREA_EMOJI = { Trabajo: "💼", Creatividad: "🎨" };
const BALANCE_TARGET = { Trabajo: 0.7, Creatividad: 0.3 };

// Disponibilidad por defecto (lunes a viernes, sin fines de semana)
const AVAILABILITY = {
  workDays: [1, 2, 3, 4, 5], // 1 = lunes ... 5 = viernes (getDay: 0=domingo)
  blocks: [
    { start: "07:30", end: "09:00" }, // 90 min
    { start: "11:00", end: "13:00" }, // 120 min
    { start: "14:30", end: "17:00" }  // 150 min
  ]
};

const DAY_NAMES = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MONTH_NAMES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

// ─── FECHAS ────────────────────────────────────────────────────────────────

// Devuelve una fecha ISO (YYYY-MM-DD) a partir de texto libre, o null.
function parseDueDate(text) {
  const t = (text || "").trim().toLowerCase();
  if (!t || t === "-" || t === "no" || t === "ninguna" || t === "sin fecha") return null;

  const today = new Date();
  const toISO = d => d.toISOString().slice(0, 10);

  if (t === "hoy") return toISO(today);
  if (t === "mañana" || t === "manana") {
    const d = new Date(today); d.setDate(d.getDate() + 1); return toISO(d);
  }
  if (t === "pasado mañana" || t === "pasado manana") {
    const d = new Date(today); d.setDate(d.getDate() + 2); return toISO(d);
  }

  // "en N dias" / "en N semanas"
  let m = t.match(/^en\s+(\d+)\s+d[ií]as?$/);
  if (m) { const d = new Date(today); d.setDate(d.getDate() + parseInt(m[1])); return toISO(d); }
  m = t.match(/^en\s+(\d+)\s+semanas?$/);
  if (m) { const d = new Date(today); d.setDate(d.getDate() + parseInt(m[1]) * 7); return toISO(d); }

  // Próximo día de la semana: "lunes", "el viernes", etc.
  const dayIdx = DAY_NAMES.findIndex(n => t === n || t === `el ${n}` || t === `próximo ${n}` || t === `proximo ${n}`);
  if (dayIdx >= 0) {
    const d = new Date(today);
    let diff = (dayIdx - d.getDay() + 7) % 7;
    if (diff === 0) diff = 7;
    d.setDate(d.getDate() + diff);
    return toISO(d);
  }

  // YYYY-MM-DD
  m = t.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (m) return `${m[1]}-${String(m[2]).padStart(2, "0")}-${String(m[3]).padStart(2, "0")}`;

  // DD/MM o DD/MM/YYYY (también con guiones)
  m = t.match(/^(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?$/);
  if (m) {
    const day = parseInt(m[1]), month = parseInt(m[2]);
    let year = m[3] ? parseInt(m[3]) : today.getFullYear();
    if (year < 100) year += 2000;
    if (month < 1 || month > 12 || day < 1 || day > 31) return null;
    // Si la fecha (sin año) ya pasó este año, asumimos el próximo año
    let d = new Date(year, month - 1, day);
    if (!m[3] && d < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
      d = new Date(year + 1, month - 1, day);
    }
    return toISO(d);
  }

  return null;
}

// Muestra una fecha ISO de forma amable: "vie 20 jun"
function formatDate(iso) {
  if (!iso) return null;
  const d = new Date(iso + "T12:00:00");
  const dow = DAY_NAMES[d.getDay()].slice(0, 3);
  return `${dow} ${d.getDate()} ${MONTH_NAMES[d.getMonth()].slice(0, 3)}`;
}

// Días restantes hasta la fecha de entrega (puede ser negativo si venció)
function daysUntil(iso) {
  if (!iso) return null;
  const today = new Date();
  const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const d = new Date(iso + "T12:00:00");
  return Math.round((d - t0) / (1000 * 60 * 60 * 24));
}

// ─── TAREAS ────────────────────────────────────────────────────────────────

async function getTasks(phone) {
  const { data } = await supabase
    .from("tasks")
    .select("*")
    .eq("phone", phone)
    .eq("done", false)
    .order("due_date", { ascending: true, nullsFirst: false })
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
    const areaTag = t.area ? `${AREA_EMOJI[t.area]} ${t.area} · ` : "";
    msg += `${i + 1}. ${priorityLabel[t.priority]} *${t.name}*\n`;
    msg += `   ${areaTag}⏱ ${t.minutes}min · 📁 ${t.category}\n`;
    if (t.due_date) {
      const dias = daysUntil(t.due_date);
      let aviso = "";
      if (dias < 0) aviso = ` ⚠️ vencida hace ${Math.abs(dias)}d`;
      else if (dias === 0) aviso = " ⚠️ ¡es hoy!";
      else if (dias === 1) aviso = " ⏰ mañana";
      else if (dias <= 3) aviso = ` ⏰ en ${dias}d`;
      msg += `   📅 Entrega: ${formatDate(t.due_date)}${aviso}\n`;
    }
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
    s.step = "agregar_area";
    return twiReply(res, `🎯 ¿Es de *trabajo* o de *creatividad/arte*?\n\n1. 💼 Trabajo\n2. 🎨 Creatividad`);
  }

  if (s.step === "agregar_area") {
    const map = { "1": "Trabajo", "2": "Creatividad", trabajo: "Trabajo", t: "Trabajo", creatividad: "Creatividad", arte: "Creatividad", c: "Creatividad" };
    const area = map[msg.toLowerCase().trim()];
    if (!area) return twiReply(res, "Respondé 1 (Trabajo) o 2 (Creatividad).");
    s.data.area = area;
    s.step = "agregar_minutos";
    return twiReply(res, `⏱ ¿Cuántos minutos estimás que toma *${s.data.name}*?`);
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
    s.step = "agregar_fecha";
    return twiReply(res, `📅 ¿Para cuándo es? (fecha de entrega)\n\nEjemplos: *mañana*, *viernes*, *20/06*, *en 3 dias*.\nSi no tiene fecha, escribí *-*.`);
  }

  if (s.step === "agregar_fecha") {
    if (msg.trim() !== "-" && parseDueDate(msg) === null) {
      return twiReply(res, "No entendí la fecha 🤔. Probá con *mañana*, *viernes*, *20/06* o *en 3 dias*. Si no tiene fecha, escribí *-*.");
    }
    s.data.due_date = parseDueDate(msg); // null si "-"
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
      due_date: s.data.due_date || null,
      area: s.data.area || null,
      done: false
    });

    clearSession(phone);
    const fechaTxt = s.data.due_date ? `\n📅 Entrega: ${formatDate(s.data.due_date)}` : "";
    const areaTxt = s.data.area ? `${AREA_EMOJI[s.data.area]} ${s.data.area} · ` : "";
    return twiReply(res, `✅ Tarea guardada:\n\n*${s.data.name}*\n${areaTxt}⏱ ${s.data.minutes}min · ${s.data.priority} · ${category}${fechaTxt}\n\nEscribí *lista* para ver tus pendientes o *calendario* para tu plan.`);
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

// ─── GENERAR CALENDARIO DIARIO CON HORARIOS ────────────────────────────────

async function generateCalendar(phone, extraContext) {
  const tasks = await getTasks(phone);
  if (!tasks.length) return "No tenés tareas pendientes. Usá *agregar* para añadir una.";

  const today = new Date();
  const todayStr = `${DAY_NAMES[today.getDay()]} ${today.getDate()} de ${MONTH_NAMES[today.getMonth()]} de ${today.getFullYear()}`;

  const taskList = tasks
    .map(t => {
      const fecha = t.due_date ? formatDate(t.due_date) : "sin fecha";
      const dias = t.due_date ? daysUntil(t.due_date) : null;
      const venc = dias === null ? "" : dias < 0 ? ` (¡VENCIDA hace ${Math.abs(dias)} días!)` : ` (en ${dias} días)`;
      const area = t.area || "Sin clasificar";
      return `- "${t.name}" | Área: ${area} | ${t.minutes}min | Prioridad: ${t.priority} | Categoría: ${t.category} | Entrega: ${fecha}${venc}`;
    })
    .join("\n");

  // Balance actual de minutos pendientes por área (meta 70% Trabajo / 30% Creatividad)
  const mins = { Trabajo: 0, Creatividad: 0 };
  tasks.forEach(t => { if (t.area && mins[t.area] !== undefined) mins[t.area] += t.minutes; });
  const totalAreaMins = mins.Trabajo + mins.Creatividad;
  const balanceTxt = totalAreaMins === 0
    ? "Aún no hay tareas clasificadas por área."
    : `Trabajo: ${Math.round(mins.Trabajo / totalAreaMins * 100)}% (${mins.Trabajo}min) · Creatividad: ${Math.round(mins.Creatividad / totalAreaMins * 100)}% (${mins.Creatividad}min). Meta: 70% Trabajo / 30% Creatividad.`;

  const blocksTxt = AVAILABILITY.blocks.map(b => `${b.start}–${b.end}`).join(", ");

  const prompt = `Sos un experto en productividad y planificación. Tu objetivo es armar un CALENDARIO DIARIO con horarios concretos para que el usuario complete sus tareas a tiempo, sin agobiarse.

HOY es ${todayStr}.

DISPONIBILIDAD POR DEFECTO del usuario (de lunes a viernes, NO fines de semana):
Bloques horarios libres cada día: ${blocksTxt}.
El usuario aprovecha todo ese tiempo.

${extraContext ? `AVISOS DEL USUARIO PARA ESTA SEMANA (tienen prioridad sobre la disponibilidad por defecto): ${extraContext}\n` : ""}
BALANCE DE VIDA (importante para el usuario): busca un equilibrio de ~70% Trabajo y ~30% Creatividad/Arte en el tiempo dedicado.
Balance actual de tareas pendientes → ${balanceTxt}

Tareas pendientes:
${taskList}

Reglas para armar el calendario:
1. RESPETÁ las fechas de entrega: ninguna tarea puede quedar agendada después de su fecha. Las vencidas o más próximas van primero. (Esta regla manda sobre el balance.)
2. Dentro de lo posible, equilibrá el tiempo apuntando a 70% Trabajo / 30% Creatividad. Intercalá algo de creatividad la mayoría de los días para que no quede todo trabajo al inicio y arte al final.
3. Repartí las tareas en los bloques horarios disponibles, asignando una hora concreta a cada una (ej: 07:30–08:15).
4. No sobrecargues un bloque: si una tarea no entra completa, partila o pasala al siguiente bloque/día.
5. Empezá desde HOY. Solo usá días hábiles (lunes a viernes) salvo que el usuario avise lo contrario en sus avisos.
6. Si el usuario avisó que un día está por fuera o que tiene tiempo extra (ej: un domingo), ajustá ese día.
7. Si no alcanza el tiempo para entregar algo a tiempo, marcá una ⚠️ ALERTA al final indicando qué tarea está en riesgo.
8. Si el balance está muy lejos del 70/30 (ej: no hay tareas de creatividad), mencionalo amablemente en el resumen y sugerí sumar alguna.

Respondé en este formato (claro y para WhatsApp, usando *negritas* y emojis con moderación):

📅 *TU CALENDARIO*

*[Día fecha]*
🕐 HH:MM–HH:MM — Tarea (Xmin)
🕐 HH:MM–HH:MM — Tarea (Xmin)

*[Día fecha]*
... (continuá los días necesarios hasta agendar todo)

Al final agregá:
✅ *Resumen:* cuántos días toma, si llegás a todas las entregas y el balance Trabajo/Creatividad que quedó (ej: 68% / 32%).
⚠️ *Alertas:* (solo si hay tareas en riesgo de no llegar a tiempo o si el balance quedó lejos del 70/30)`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1500,
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

  if (session.step === "cal_contexto") {
    clearSession(phone);
    try {
      const cal = await generateCalendar(phone, msg.trim() === "-" ? "" : msg);
      return twiReply(res, cal);
    } catch (e) {
      return twiReply(res, "Error generando el calendario. Intentá de nuevo.");
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

  if (cmd === "calendario" || cmd === "agenda" || cmd === "cal") {
    session.step = "cal_contexto";
    session.data = {};
    return twiReply(res, `📅 Voy a armar tu calendario respetando tus horarios habituales (L–V: 7:30–9, 11–13, 14:30–17).\n\n¿Alguna novedad para estos días? Por ejemplo:\n• "el miércoles estoy por fuera"\n• "el jueves solo en la mañana"\n• "este domingo tengo libre de 9 a 12"\n\nEscribí *-* si tu semana es normal.`);
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
app.listen(PORT, "0.0.0.0", () => console.log(`Bot corriendo en puerto ${PORT}`));
