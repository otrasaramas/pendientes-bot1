# 📖 ReadHub

Tu centro personal de lecturas: guarda tus libros, clasifícalos con ayuda de IA,
mira estadísticas de tus hábitos y recibe recomendaciones de qué leer a continuación.

Construido con **Next.js 16** (App Router), **Supabase** (base de datos) y la
**API de Claude** (Anthropic) para analizar portadas y recomendar.

## Secciones

- **Inicio** — resumen: totales, % de ficción, leyendo ahora, recientes y por género.
- **Biblioteca** — todos tus libros con búsqueda y filtros; toca uno para ver/editar.
- **Agregar** — por foto de la portada 📷, por título 🔎 o manualmente ✍️. La IA propone
  los datos y la clasificación, y tú confirmas antes de guardar.
- **Tablero** — columnas Por leer / Leyendo / Leído con arrastrar y soltar.
- **Hábito** — tracker de lectura tipo "calendario de rachas": marca los días que lees,
  ve el año completo, tu racha actual, la racha más larga y los días leídos.
- **Estadísticas** — gráficos: ficción vs. no ficción, por género, por estado, valoraciones.
- **Recomiéndame** — un cuestionario de 5 preguntas y 3 sugerencias personalizadas.

## Puesta en marcha

### 1. Crear la base de datos en Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. En **SQL Editor**, pega y ejecuta el contenido de [`supabase/schema.sql`](./supabase/schema.sql).
3. (Opcional) Para cargar tus 26 libros ya existentes, ejecuta también
   [`supabase/seed.sql`](./supabase/seed.sql) — es tu hoja de cálculo convertida a SQL.

### 2. Variables de entorno

Copia `.env.example` a `.env.local` y rellena:

```bash
cp .env.example .env.local
```

- `NEXT_PUBLIC_SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` → Supabase → *Project Settings → API*.
  > Usamos la **service role key** porque toda la base de datos se accede solo desde el
  > servidor de Next.js. No la expongas en el cliente ni la subas al repositorio.
- `ANTHROPIC_API_KEY` → [console.anthropic.com](https://console.anthropic.com).

### 3. Instalar y arrancar

```bash
npm install
npm run dev      # http://localhost:3000
```

### 4. Importar tu hoja de cálculo (opcional)

**La forma más fácil** ya está hecha: ejecuta `supabase/seed.sql` (paso 1.3) y tendrás
tus libros cargados sin más.

Si en el futuro quieres importar otra hoja, expórtala como **CSV** y ejecuta:

```bash
node scripts/import-csv.mjs ruta/a/mis-libros.csv --dry   # ver el mapeo sin escribir
node scripts/import-csv.mjs ruta/a/mis-libros.csv          # importar de verdad
```

El script detecta automáticamente columnas comunes en español/inglés (título, autor,
género, estado, valoración, páginas, año, etc.). Si alguna no se reconoce, edita el objeto
`FIELD_ALIASES` dentro del script.

## Modo demo (previsualizar sin base de datos)

Para ver la app poblada con datos de muestra (tu hoja de cálculo) sin configurar Supabase:

```bash
READHUB_DEMO=1 npm run dev
```

En este modo las pantallas se ven con tus libros de ejemplo. Las acciones que escriben
(guardar, editar, recomendar con IA) necesitan la configuración real.

## Desplegar en Vercel

1. Sube el repositorio a GitHub.
2. En [vercel.com](https://vercel.com) importa el proyecto y elige la carpeta raíz `readhub`.
3. Añade las mismas variables de entorno del `.env.local` en *Settings → Environment Variables*.
4. Deploy.

## Instalarla en el celular (PWA)

ReadHub es una **PWA instalable**. Una vez desplegada (con tu URL de Vercel):

- **Android (Chrome):** abre la URL → menú ⋮ → *Instalar app* / *Añadir a pantalla de inicio*.
- **iPhone (Safari):** abre la URL → botón *Compartir* → *Añadir a pantalla de inicio*.

Queda con su ícono, abre a pantalla completa (sin barra del navegador) y el "shell" básico
funciona aunque no tengas conexión.

## Nota de seguridad

ReadHub está pensado como app de **un solo usuario**. La base de datos tiene RLS activado y
sin políticas públicas, así que solo el servidor (con la service role key) puede leer/escribir.
Si quieres exponerla a varias personas, añade [Supabase Auth](https://supabase.com/docs/guides/auth)
y políticas RLS por usuario.
