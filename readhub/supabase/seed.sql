-- ─────────────────────────────────────────────────────────────────────────
--  Read Hub · datos iniciales importados desde tu hoja de cálculo
--  (Base_de_Datos_Mis_Libros_COMPLETA). Ejecuta DESPUÉS de schema.sql.
--  26 libros. La columna 'Categoría' se mapea a 'genre'.
-- ─────────────────────────────────────────────────────────────────────────

insert into books (title, author, genre, categories, is_fiction, status, notes, created_at) values
  ('Chatter: The Voice in Our Head, Why It Matters, and How to Harness It', 'Ethan Kross', 'Psicología & Neurociencia', array['Psicología & Neurociencia'], false, 'por_leer', NULL, '2026-06-12'),
  ('Elastic: Unlocking Your Brain''s Ability to Embrace Change', 'Leonard Mlodinow', 'Psicología & Neurociencia', array['Psicología & Neurociencia'], false, 'por_leer', NULL, '2026-06-12'),
  ('The Brain That Changes Itself: Stories of Personal Triumph from the Frontiers of Neuroscience', 'Norman Doidge', 'Psicología & Neurociencia', array['Psicología & Neurociencia'], false, 'por_leer', NULL, '2026-06-12'),
  ('Neuro Thinking: How Your Brain Decides and Learn', 'Cole Payton', 'Psicología & Neurociencia', array['Psicología & Neurociencia'], false, 'por_leer', NULL, '2026-06-12'),
  ('The Science Behind Procrastination: How Your Brain Tricks You', 'Chloe Parkin', 'Psicología & Neurociencia', array['Psicología & Neurociencia'], false, 'por_leer', NULL, '2026-06-12'),
  ('A Brain That Breathes: Essential Habits for an Overwhelming World', 'Jodi Wilson', 'Psicología & Neurociencia', array['Psicología & Neurociencia'], false, 'por_leer', NULL, '2026-06-12'),
  ('El Arte de Crear Recuerdos: Cómo Hacer de tu Memoria un Aliado para Ser Más Feliz', 'Meik Wiking', 'Desarrollo Personal & Bienestar', array['Desarrollo Personal & Bienestar'], false, 'por_leer', NULL, '2026-06-12'),
  ('El Hábito del Monje: Pequeños Pasos para Transformar tu Vida', 'Sonia Rico', 'Desarrollo Personal & Bienestar', array['Desarrollo Personal & Bienestar'], false, 'por_leer', NULL, '2026-06-12'),
  ('Don''t Believe Everything You Think: Why Your Thinking is the Beginning & End of Suffering', 'Joseph Nguyen', 'Desarrollo Personal & Bienestar', array['Desarrollo Personal & Bienestar'], false, 'por_leer', NULL, '2026-06-12'),
  ('Mind to Matter: The Astonishing Science of How Your Thoughts Shape Your Life', 'Dawson Church', 'Desarrollo Personal & Bienestar', array['Desarrollo Personal & Bienestar'], false, 'por_leer', NULL, '2026-06-12'),
  ('Less Mess Less Stress: Minimalist Routines to Declutter Your Life', 'Zoe McKey', 'Desarrollo Personal & Bienestar', array['Desarrollo Personal & Bienestar'], false, 'por_leer', NULL, '2026-06-12'),
  ('A Little More Social: How Small Choices Create Unexpected Happiness, Health, and Connection', 'Nicholas Epley', 'Desarrollo Personal & Bienestar', array['Desarrollo Personal & Bienestar'], false, 'por_leer', NULL, '2026-06-12'),
  ('Life is a Brief Opportunity for Joy', 'Will Meyerhofer', 'Desarrollo Personal & Bienestar', array['Desarrollo Personal & Bienestar'], false, 'por_leer', NULL, '2026-06-12'),
  ('El Revolucionario Mundo de los Probióticos: Qué Son, Cómo Funcionan y para Qué Sirven', 'Dra. Olalla Otero', 'Salud', array['Salud'], false, 'por_leer', NULL, '2026-06-12'),
  ('Do No Harm: Stories of Life, Death, and Brain Surgery', 'Henry Marsh', 'Salud', array['Salud'], false, 'por_leer', NULL, '2026-06-12'),
  ('The Science of Meditation: How to Change Your Brain, Mind and Body', 'Daniel Goleman & Richard J. Davidson', 'Salud', array['Salud'], false, 'por_leer', NULL, '2026-06-12'),
  ('Either/Or: A Fragment of Life', 'Søren Kierkegaard', 'Filosofía', array['Filosofía'], false, 'por_leer', NULL, '2026-06-12'),
  ('Farmaconomía: Cómo las Grandes Farmacéuticas Contribuyen al Deterioro de la Salud Global', 'Nick Dearden', 'Sociedad & Política', array['Sociedad & Política'], false, 'por_leer', NULL, '2026-06-12'),
  ('Sin Velo: Cómo el Privilegio de Occidente Permitió Ignorar la Represión en el Mundo Musulmán', 'Yasmine Mohammed', 'Sociedad & Política', array['Sociedad & Política'], false, 'por_leer', NULL, '2026-06-12'),
  ('Astrophysics for People in a Hurry', 'Neil deGrasse Tyson', 'Ciencia', array['Ciencia'], false, 'por_leer', NULL, '2026-06-12'),
  ('The Meaning of It All: Thoughts of a Citizen-Scientist', 'Richard P. Feynman', 'Ciencia', array['Ciencia'], false, 'por_leer', NULL, '2026-06-12'),
  ('A Brief History of Intelligence: Evolution, AI, and the Five Breakthroughs That Made Our Brains', 'Max Bennett', 'Ciencia', array['Ciencia'], false, 'por_leer', NULL, '2026-06-12'),
  ('Amarse con los Ojos Abiertos: El Desarrollo Personal a Través de la Pareja', 'Jorge Bucay & Silvia Salinas', 'Relaciones', array['Relaciones'], false, 'por_leer', NULL, '2026-06-12'),
  ('Nada se Opone a la Noche', 'Delphine de Vigan', 'Ficción', array['Ficción'], true, 'por_leer', NULL, '2026-06-12'),
  ('The Girl in the Green Dress: A True Story of Resilience and Recovery from Trauma', 'Jeni Haynes & Dr. George Blair-West', 'Ficción', array['Ficción'], true, 'por_leer', NULL, '2026-06-12'),
  ('How to Manifest Instantly', 'Autor por determinar', 'Desarrollo Personal & Bienestar', array['Desarrollo Personal & Bienestar'], false, 'por_leer', NULL, '2026-06-12');
