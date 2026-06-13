-- ─────────────────────────────────────────────────────────────────────────
--  Read Hub · esquema de base de datos (Supabase / PostgreSQL)
--  Ejecuta este script en el editor SQL de tu proyecto Supabase.
-- ─────────────────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";

create table if not exists books (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),

  -- Datos del libro
  title       text not null,
  author      text,
  cover_url   text,
  description text,

  -- Clasificación
  is_fiction  boolean,                 -- true = ficción, false = no ficción
  genre       text,                    -- género principal (ej: Fantasía, Ensayo)
  categories  text[] not null default '{}',  -- etiquetas / categorías libres

  -- Metadatos
  pages       integer,
  language    text,
  year        integer,
  isbn        text,
  publisher   text,

  -- Estado de lectura
  status      text not null default 'por_leer'
              check (status in ('por_leer', 'leyendo', 'leido')),
  rating      integer check (rating between 1 and 5),
  date_started   date,
  date_finished  date,
  notes       text,

  -- Orden manual dentro de una columna del tablero
  position    integer not null default 0
);

create index if not exists books_status_idx on books (status);
create index if not exists books_genre_idx  on books (genre);

-- ─────────────────────────────────────────────────────────────────────────
--  Seguridad (RLS)
--  Esta app es de un solo usuario y accede a la base de datos SOLO desde el
--  servidor de Next.js usando la SERVICE ROLE KEY (que omite RLS). Por eso
--  activamos RLS y NO creamos políticas públicas: nadie puede leer/escribir
--  con la clave anónima. Si más adelante agregas Supabase Auth, crea políticas
--  por usuario aquí.
-- ─────────────────────────────────────────────────────────────────────────
alter table books enable row level security;

-- ─────────────────────────────────────────────────────────────────────────
--  Tracker de lectura: un registro por día en que leíste.
--  La existencia de la fila = "leí ese día". minutes/pages/note son opcionales.
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists reading_log (
  id         uuid primary key default gen_random_uuid(),
  day        date not null unique,
  minutes    integer,
  pages      integer,
  note       text,
  created_at timestamptz not null default now()
);

create index if not exists reading_log_day_idx on reading_log (day);

alter table reading_log enable row level security;
