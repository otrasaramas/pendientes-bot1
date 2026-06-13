import type { Book } from "./types";

/** Datos de muestra (tu hoja de cálculo) para el modo demo: READHUB_DEMO=1.
 * Algunos estados/valoraciones/páginas son ilustrativos para mostrar todas las vistas. */
export const DEMO_BOOKS: Book[] = [
  {
    "id": "demo-1",
    "created_at": "2026-06-12T00:00:00Z",
    "title": "Chatter: The Voice in Our Head, Why It Matters, and How to Harness It",
    "author": "Ethan Kross",
    "cover_url": null,
    "description": null,
    "is_fiction": false,
    "genre": "Psicología & Neurociencia",
    "categories": [
      "Psicología & Neurociencia"
    ],
    "pages": 272,
    "language": null,
    "year": 2021,
    "isbn": null,
    "publisher": null,
    "status": "leido",
    "rating": 5,
    "date_started": null,
    "date_finished": "2026-05-20",
    "notes": null,
    "position": 0
  },
  {
    "id": "demo-2",
    "created_at": "2026-06-12T00:00:00Z",
    "title": "Elastic: Unlocking Your Brain's Ability to Embrace Change",
    "author": "Leonard Mlodinow",
    "cover_url": null,
    "description": null,
    "is_fiction": false,
    "genre": "Psicología & Neurociencia",
    "categories": [
      "Psicología & Neurociencia"
    ],
    "pages": 256,
    "language": null,
    "year": 2018,
    "isbn": null,
    "publisher": null,
    "status": "leyendo",
    "rating": null,
    "date_started": null,
    "date_finished": null,
    "notes": null,
    "position": 1
  },
  {
    "id": "demo-3",
    "created_at": "2026-06-12T00:00:00Z",
    "title": "The Brain That Changes Itself: Stories of Personal Triumph from the Frontiers of Neuroscience",
    "author": "Norman Doidge",
    "cover_url": null,
    "description": null,
    "is_fiction": false,
    "genre": "Psicología & Neurociencia",
    "categories": [
      "Psicología & Neurociencia"
    ],
    "pages": null,
    "language": null,
    "year": null,
    "isbn": null,
    "publisher": null,
    "status": "por_leer",
    "rating": null,
    "date_started": null,
    "date_finished": null,
    "notes": null,
    "position": 2
  },
  {
    "id": "demo-4",
    "created_at": "2026-06-12T00:00:00Z",
    "title": "Neuro Thinking: How Your Brain Decides and Learn",
    "author": "Cole Payton",
    "cover_url": null,
    "description": null,
    "is_fiction": false,
    "genre": "Psicología & Neurociencia",
    "categories": [
      "Psicología & Neurociencia"
    ],
    "pages": null,
    "language": null,
    "year": null,
    "isbn": null,
    "publisher": null,
    "status": "por_leer",
    "rating": null,
    "date_started": null,
    "date_finished": null,
    "notes": null,
    "position": 3
  },
  {
    "id": "demo-5",
    "created_at": "2026-06-12T00:00:00Z",
    "title": "The Science Behind Procrastination: How Your Brain Tricks You",
    "author": "Chloe Parkin",
    "cover_url": null,
    "description": null,
    "is_fiction": false,
    "genre": "Psicología & Neurociencia",
    "categories": [
      "Psicología & Neurociencia"
    ],
    "pages": null,
    "language": null,
    "year": null,
    "isbn": null,
    "publisher": null,
    "status": "por_leer",
    "rating": null,
    "date_started": null,
    "date_finished": null,
    "notes": null,
    "position": 4
  },
  {
    "id": "demo-6",
    "created_at": "2026-06-12T00:00:00Z",
    "title": "A Brain That Breathes: Essential Habits for an Overwhelming World",
    "author": "Jodi Wilson",
    "cover_url": null,
    "description": null,
    "is_fiction": false,
    "genre": "Psicología & Neurociencia",
    "categories": [
      "Psicología & Neurociencia"
    ],
    "pages": 208,
    "language": null,
    "year": 2018,
    "isbn": null,
    "publisher": null,
    "status": "leido",
    "rating": 4,
    "date_started": null,
    "date_finished": "2026-05-20",
    "notes": null,
    "position": 5
  },
  {
    "id": "demo-7",
    "created_at": "2026-06-12T00:00:00Z",
    "title": "El Arte de Crear Recuerdos: Cómo Hacer de tu Memoria un Aliado para Ser Más Feliz",
    "author": "Meik Wiking",
    "cover_url": null,
    "description": null,
    "is_fiction": false,
    "genre": "Desarrollo Personal & Bienestar",
    "categories": [
      "Desarrollo Personal & Bienestar"
    ],
    "pages": null,
    "language": null,
    "year": null,
    "isbn": null,
    "publisher": null,
    "status": "por_leer",
    "rating": null,
    "date_started": null,
    "date_finished": null,
    "notes": null,
    "position": 6
  },
  {
    "id": "demo-8",
    "created_at": "2026-06-12T00:00:00Z",
    "title": "El Hábito del Monje: Pequeños Pasos para Transformar tu Vida",
    "author": "Sonia Rico",
    "cover_url": null,
    "description": null,
    "is_fiction": false,
    "genre": "Desarrollo Personal & Bienestar",
    "categories": [
      "Desarrollo Personal & Bienestar"
    ],
    "pages": null,
    "language": null,
    "year": null,
    "isbn": null,
    "publisher": null,
    "status": "por_leer",
    "rating": null,
    "date_started": null,
    "date_finished": null,
    "notes": null,
    "position": 7
  },
  {
    "id": "demo-9",
    "created_at": "2026-06-12T00:00:00Z",
    "title": "Don't Believe Everything You Think: Why Your Thinking is the Beginning & End of Suffering",
    "author": "Joseph Nguyen",
    "cover_url": null,
    "description": null,
    "is_fiction": false,
    "genre": "Desarrollo Personal & Bienestar",
    "categories": [
      "Desarrollo Personal & Bienestar"
    ],
    "pages": null,
    "language": null,
    "year": null,
    "isbn": null,
    "publisher": null,
    "status": "por_leer",
    "rating": null,
    "date_started": null,
    "date_finished": null,
    "notes": null,
    "position": 8
  },
  {
    "id": "demo-10",
    "created_at": "2026-06-12T00:00:00Z",
    "title": "Mind to Matter: The Astonishing Science of How Your Thoughts Shape Your Life",
    "author": "Dawson Church",
    "cover_url": null,
    "description": null,
    "is_fiction": false,
    "genre": "Desarrollo Personal & Bienestar",
    "categories": [
      "Desarrollo Personal & Bienestar"
    ],
    "pages": null,
    "language": null,
    "year": null,
    "isbn": null,
    "publisher": null,
    "status": "por_leer",
    "rating": null,
    "date_started": null,
    "date_finished": null,
    "notes": null,
    "position": 9
  },
  {
    "id": "demo-11",
    "created_at": "2026-06-12T00:00:00Z",
    "title": "Less Mess Less Stress: Minimalist Routines to Declutter Your Life",
    "author": "Zoe McKey",
    "cover_url": null,
    "description": null,
    "is_fiction": false,
    "genre": "Desarrollo Personal & Bienestar",
    "categories": [
      "Desarrollo Personal & Bienestar"
    ],
    "pages": null,
    "language": null,
    "year": null,
    "isbn": null,
    "publisher": null,
    "status": "por_leer",
    "rating": null,
    "date_started": null,
    "date_finished": null,
    "notes": null,
    "position": 10
  },
  {
    "id": "demo-12",
    "created_at": "2026-06-12T00:00:00Z",
    "title": "A Little More Social: How Small Choices Create Unexpected Happiness, Health, and Connection",
    "author": "Nicholas Epley",
    "cover_url": null,
    "description": null,
    "is_fiction": false,
    "genre": "Desarrollo Personal & Bienestar",
    "categories": [
      "Desarrollo Personal & Bienestar"
    ],
    "pages": null,
    "language": null,
    "year": null,
    "isbn": null,
    "publisher": null,
    "status": "por_leer",
    "rating": null,
    "date_started": null,
    "date_finished": null,
    "notes": null,
    "position": 11
  },
  {
    "id": "demo-13",
    "created_at": "2026-06-12T00:00:00Z",
    "title": "Life is a Brief Opportunity for Joy",
    "author": "Will Meyerhofer",
    "cover_url": null,
    "description": null,
    "is_fiction": false,
    "genre": "Desarrollo Personal & Bienestar",
    "categories": [
      "Desarrollo Personal & Bienestar"
    ],
    "pages": null,
    "language": null,
    "year": null,
    "isbn": null,
    "publisher": null,
    "status": "por_leer",
    "rating": null,
    "date_started": null,
    "date_finished": null,
    "notes": null,
    "position": 12
  },
  {
    "id": "demo-14",
    "created_at": "2026-06-12T00:00:00Z",
    "title": "El Revolucionario Mundo de los Probióticos: Qué Son, Cómo Funcionan y para Qué Sirven",
    "author": "Dra. Olalla Otero",
    "cover_url": null,
    "description": null,
    "is_fiction": false,
    "genre": "Salud",
    "categories": [
      "Salud"
    ],
    "pages": null,
    "language": null,
    "year": null,
    "isbn": null,
    "publisher": null,
    "status": "por_leer",
    "rating": null,
    "date_started": null,
    "date_finished": null,
    "notes": null,
    "position": 13
  },
  {
    "id": "demo-15",
    "created_at": "2026-06-12T00:00:00Z",
    "title": "Do No Harm: Stories of Life, Death, and Brain Surgery",
    "author": "Henry Marsh",
    "cover_url": null,
    "description": null,
    "is_fiction": false,
    "genre": "Salud",
    "categories": [
      "Salud"
    ],
    "pages": null,
    "language": null,
    "year": null,
    "isbn": null,
    "publisher": null,
    "status": "por_leer",
    "rating": null,
    "date_started": null,
    "date_finished": null,
    "notes": null,
    "position": 14
  },
  {
    "id": "demo-16",
    "created_at": "2026-06-12T00:00:00Z",
    "title": "The Science of Meditation: How to Change Your Brain, Mind and Body",
    "author": "Daniel Goleman & Richard J. Davidson",
    "cover_url": null,
    "description": null,
    "is_fiction": false,
    "genre": "Salud",
    "categories": [
      "Salud"
    ],
    "pages": null,
    "language": null,
    "year": null,
    "isbn": null,
    "publisher": null,
    "status": "por_leer",
    "rating": null,
    "date_started": null,
    "date_finished": null,
    "notes": null,
    "position": 15
  },
  {
    "id": "demo-17",
    "created_at": "2026-06-12T00:00:00Z",
    "title": "Either/Or: A Fragment of Life",
    "author": "Søren Kierkegaard",
    "cover_url": null,
    "description": null,
    "is_fiction": false,
    "genre": "Filosofía",
    "categories": [
      "Filosofía"
    ],
    "pages": null,
    "language": null,
    "year": null,
    "isbn": null,
    "publisher": null,
    "status": "por_leer",
    "rating": null,
    "date_started": null,
    "date_finished": null,
    "notes": null,
    "position": 16
  },
  {
    "id": "demo-18",
    "created_at": "2026-06-12T00:00:00Z",
    "title": "Farmaconomía: Cómo las Grandes Farmacéuticas Contribuyen al Deterioro de la Salud Global",
    "author": "Nick Dearden",
    "cover_url": null,
    "description": null,
    "is_fiction": false,
    "genre": "Sociedad & Política",
    "categories": [
      "Sociedad & Política"
    ],
    "pages": null,
    "language": null,
    "year": null,
    "isbn": null,
    "publisher": null,
    "status": "por_leer",
    "rating": null,
    "date_started": null,
    "date_finished": null,
    "notes": null,
    "position": 17
  },
  {
    "id": "demo-19",
    "created_at": "2026-06-12T00:00:00Z",
    "title": "Sin Velo: Cómo el Privilegio de Occidente Permitió Ignorar la Represión en el Mundo Musulmán",
    "author": "Yasmine Mohammed",
    "cover_url": null,
    "description": null,
    "is_fiction": false,
    "genre": "Sociedad & Política",
    "categories": [
      "Sociedad & Política"
    ],
    "pages": 224,
    "language": null,
    "year": 2009,
    "isbn": null,
    "publisher": null,
    "status": "leido",
    "rating": 5,
    "date_started": null,
    "date_finished": "2026-05-20",
    "notes": null,
    "position": 18
  },
  {
    "id": "demo-20",
    "created_at": "2026-06-12T00:00:00Z",
    "title": "Astrophysics for People in a Hurry",
    "author": "Neil deGrasse Tyson",
    "cover_url": null,
    "description": null,
    "is_fiction": false,
    "genre": "Ciencia",
    "categories": [
      "Ciencia"
    ],
    "pages": 240,
    "language": null,
    "year": 2017,
    "isbn": null,
    "publisher": null,
    "status": "leyendo",
    "rating": null,
    "date_started": null,
    "date_finished": null,
    "notes": null,
    "position": 19
  },
  {
    "id": "demo-21",
    "created_at": "2026-06-12T00:00:00Z",
    "title": "The Meaning of It All: Thoughts of a Citizen-Scientist",
    "author": "Richard P. Feynman",
    "cover_url": null,
    "description": null,
    "is_fiction": false,
    "genre": "Ciencia",
    "categories": [
      "Ciencia"
    ],
    "pages": null,
    "language": null,
    "year": null,
    "isbn": null,
    "publisher": null,
    "status": "por_leer",
    "rating": null,
    "date_started": null,
    "date_finished": null,
    "notes": null,
    "position": 20
  },
  {
    "id": "demo-22",
    "created_at": "2026-06-12T00:00:00Z",
    "title": "A Brief History of Intelligence: Evolution, AI, and the Five Breakthroughs That Made Our Brains",
    "author": "Max Bennett",
    "cover_url": null,
    "description": null,
    "is_fiction": false,
    "genre": "Ciencia",
    "categories": [
      "Ciencia"
    ],
    "pages": null,
    "language": null,
    "year": null,
    "isbn": null,
    "publisher": null,
    "status": "por_leer",
    "rating": null,
    "date_started": null,
    "date_finished": null,
    "notes": null,
    "position": 21
  },
  {
    "id": "demo-23",
    "created_at": "2026-06-12T00:00:00Z",
    "title": "Amarse con los Ojos Abiertos: El Desarrollo Personal a Través de la Pareja",
    "author": "Jorge Bucay & Silvia Salinas",
    "cover_url": null,
    "description": null,
    "is_fiction": false,
    "genre": "Relaciones",
    "categories": [
      "Relaciones"
    ],
    "pages": null,
    "language": null,
    "year": null,
    "isbn": null,
    "publisher": null,
    "status": "por_leer",
    "rating": null,
    "date_started": null,
    "date_finished": null,
    "notes": null,
    "position": 22
  },
  {
    "id": "demo-24",
    "created_at": "2026-06-12T00:00:00Z",
    "title": "Nada se Opone a la Noche",
    "author": "Delphine de Vigan",
    "cover_url": null,
    "description": null,
    "is_fiction": true,
    "genre": "Ficción",
    "categories": [
      "Ficción"
    ],
    "pages": null,
    "language": null,
    "year": null,
    "isbn": null,
    "publisher": null,
    "status": "por_leer",
    "rating": null,
    "date_started": null,
    "date_finished": null,
    "notes": null,
    "position": 23
  },
  {
    "id": "demo-25",
    "created_at": "2026-06-12T00:00:00Z",
    "title": "The Girl in the Green Dress: A True Story of Resilience and Recovery from Trauma",
    "author": "Jeni Haynes & Dr. George Blair-West",
    "cover_url": null,
    "description": null,
    "is_fiction": true,
    "genre": "Ficción",
    "categories": [
      "Ficción"
    ],
    "pages": null,
    "language": null,
    "year": null,
    "isbn": null,
    "publisher": null,
    "status": "por_leer",
    "rating": null,
    "date_started": null,
    "date_finished": null,
    "notes": null,
    "position": 24
  },
  {
    "id": "demo-26",
    "created_at": "2026-06-12T00:00:00Z",
    "title": "How to Manifest Instantly",
    "author": "Autor por determinar",
    "cover_url": null,
    "description": null,
    "is_fiction": false,
    "genre": "Desarrollo Personal & Bienestar",
    "categories": [
      "Desarrollo Personal & Bienestar"
    ],
    "pages": null,
    "language": null,
    "year": null,
    "isbn": null,
    "publisher": null,
    "status": "por_leer",
    "rating": null,
    "date_started": null,
    "date_finished": null,
    "notes": null,
    "position": 25
  }
];

import type { ReadingDay } from "./types";

/** Días de lectura de muestra para el modo demo. */
export const DEMO_READING_DAYS: ReadingDay[] = [
  {
    "id": "rd-1",
    "day": "2026-01-01",
    "minutes": 43,
    "pages": 31,
    "note": null,
    "created_at": "2026-01-01T00:00:00Z"
  },
  {
    "id": "rd-2",
    "day": "2026-01-03",
    "minutes": 148,
    "pages": 106,
    "note": null,
    "created_at": "2026-01-03T00:00:00Z"
  },
  {
    "id": "rd-3",
    "day": "2026-01-05",
    "minutes": 73,
    "pages": 52,
    "note": null,
    "created_at": "2026-01-05T00:00:00Z"
  },
  {
    "id": "rd-4",
    "day": "2026-01-06",
    "minutes": 31,
    "pages": 22,
    "note": null,
    "created_at": "2026-01-06T00:00:00Z"
  },
  {
    "id": "rd-5",
    "day": "2026-01-07",
    "minutes": 57,
    "pages": 41,
    "note": null,
    "created_at": "2026-01-07T00:00:00Z"
  },
  {
    "id": "rd-6",
    "day": "2026-01-08",
    "minutes": 48,
    "pages": 34,
    "note": null,
    "created_at": "2026-01-08T00:00:00Z"
  },
  {
    "id": "rd-7",
    "day": "2026-01-09",
    "minutes": 136,
    "pages": 97,
    "note": null,
    "created_at": "2026-01-09T00:00:00Z"
  },
  {
    "id": "rd-8",
    "day": "2026-01-10",
    "minutes": 60,
    "pages": 43,
    "note": null,
    "created_at": "2026-01-10T00:00:00Z"
  },
  {
    "id": "rd-9",
    "day": "2026-01-11",
    "minutes": 52,
    "pages": 37,
    "note": null,
    "created_at": "2026-01-11T00:00:00Z"
  },
  {
    "id": "rd-10",
    "day": "2026-01-12",
    "minutes": 71,
    "pages": 51,
    "note": null,
    "created_at": "2026-01-12T00:00:00Z"
  },
  {
    "id": "rd-11",
    "day": "2026-01-13",
    "minutes": 24,
    "pages": 17,
    "note": null,
    "created_at": "2026-01-13T00:00:00Z"
  },
  {
    "id": "rd-12",
    "day": "2026-01-14",
    "minutes": 60,
    "pages": 43,
    "note": null,
    "created_at": "2026-01-14T00:00:00Z"
  },
  {
    "id": "rd-13",
    "day": "2026-01-15",
    "minutes": 112,
    "pages": 80,
    "note": null,
    "created_at": "2026-01-15T00:00:00Z"
  },
  {
    "id": "rd-14",
    "day": "2026-01-16",
    "minutes": 66,
    "pages": 47,
    "note": null,
    "created_at": "2026-01-16T00:00:00Z"
  },
  {
    "id": "rd-15",
    "day": "2026-01-18",
    "minutes": 123,
    "pages": 88,
    "note": null,
    "created_at": "2026-01-18T00:00:00Z"
  },
  {
    "id": "rd-16",
    "day": "2026-01-20",
    "minutes": 42,
    "pages": 30,
    "note": null,
    "created_at": "2026-01-20T00:00:00Z"
  },
  {
    "id": "rd-17",
    "day": "2026-01-21",
    "minutes": 36,
    "pages": 26,
    "note": null,
    "created_at": "2026-01-21T00:00:00Z"
  },
  {
    "id": "rd-18",
    "day": "2026-01-23",
    "minutes": 63,
    "pages": 45,
    "note": null,
    "created_at": "2026-01-23T00:00:00Z"
  },
  {
    "id": "rd-19",
    "day": "2026-01-25",
    "minutes": 38,
    "pages": 27,
    "note": null,
    "created_at": "2026-01-25T00:00:00Z"
  },
  {
    "id": "rd-20",
    "day": "2026-01-27",
    "minutes": 38,
    "pages": 27,
    "note": null,
    "created_at": "2026-01-27T00:00:00Z"
  },
  {
    "id": "rd-21",
    "day": "2026-01-28",
    "minutes": 59,
    "pages": 42,
    "note": null,
    "created_at": "2026-01-28T00:00:00Z"
  },
  {
    "id": "rd-22",
    "day": "2026-01-30",
    "minutes": 69,
    "pages": 49,
    "note": null,
    "created_at": "2026-01-30T00:00:00Z"
  },
  {
    "id": "rd-23",
    "day": "2026-02-01",
    "minutes": 27,
    "pages": 19,
    "note": null,
    "created_at": "2026-02-01T00:00:00Z"
  },
  {
    "id": "rd-24",
    "day": "2026-02-02",
    "minutes": 120,
    "pages": 86,
    "note": null,
    "created_at": "2026-02-02T00:00:00Z"
  },
  {
    "id": "rd-25",
    "day": "2026-02-03",
    "minutes": 69,
    "pages": 49,
    "note": null,
    "created_at": "2026-02-03T00:00:00Z"
  },
  {
    "id": "rd-26",
    "day": "2026-02-04",
    "minutes": 66,
    "pages": 47,
    "note": null,
    "created_at": "2026-02-04T00:00:00Z"
  },
  {
    "id": "rd-27",
    "day": "2026-02-05",
    "minutes": 59,
    "pages": 42,
    "note": null,
    "created_at": "2026-02-05T00:00:00Z"
  },
  {
    "id": "rd-28",
    "day": "2026-02-06",
    "minutes": 27,
    "pages": 19,
    "note": null,
    "created_at": "2026-02-06T00:00:00Z"
  },
  {
    "id": "rd-29",
    "day": "2026-02-09",
    "minutes": 64,
    "pages": 46,
    "note": null,
    "created_at": "2026-02-09T00:00:00Z"
  },
  {
    "id": "rd-30",
    "day": "2026-02-10",
    "minutes": 39,
    "pages": 28,
    "note": null,
    "created_at": "2026-02-10T00:00:00Z"
  },
  {
    "id": "rd-31",
    "day": "2026-02-11",
    "minutes": 35,
    "pages": 25,
    "note": null,
    "created_at": "2026-02-11T00:00:00Z"
  },
  {
    "id": "rd-32",
    "day": "2026-02-12",
    "minutes": 55,
    "pages": 39,
    "note": null,
    "created_at": "2026-02-12T00:00:00Z"
  },
  {
    "id": "rd-33",
    "day": "2026-02-13",
    "minutes": 67,
    "pages": 48,
    "note": null,
    "created_at": "2026-02-13T00:00:00Z"
  },
  {
    "id": "rd-34",
    "day": "2026-02-14",
    "minutes": 151,
    "pages": 108,
    "note": null,
    "created_at": "2026-02-14T00:00:00Z"
  },
  {
    "id": "rd-35",
    "day": "2026-02-16",
    "minutes": 45,
    "pages": 32,
    "note": null,
    "created_at": "2026-02-16T00:00:00Z"
  },
  {
    "id": "rd-36",
    "day": "2026-02-17",
    "minutes": 109,
    "pages": 78,
    "note": null,
    "created_at": "2026-02-17T00:00:00Z"
  },
  {
    "id": "rd-37",
    "day": "2026-02-18",
    "minutes": 27,
    "pages": 19,
    "note": null,
    "created_at": "2026-02-18T00:00:00Z"
  },
  {
    "id": "rd-38",
    "day": "2026-02-19",
    "minutes": 122,
    "pages": 87,
    "note": null,
    "created_at": "2026-02-19T00:00:00Z"
  },
  {
    "id": "rd-39",
    "day": "2026-02-20",
    "minutes": 24,
    "pages": 17,
    "note": null,
    "created_at": "2026-02-20T00:00:00Z"
  },
  {
    "id": "rd-40",
    "day": "2026-02-21",
    "minutes": 63,
    "pages": 45,
    "note": null,
    "created_at": "2026-02-21T00:00:00Z"
  },
  {
    "id": "rd-41",
    "day": "2026-02-23",
    "minutes": 119,
    "pages": 85,
    "note": null,
    "created_at": "2026-02-23T00:00:00Z"
  },
  {
    "id": "rd-42",
    "day": "2026-02-24",
    "minutes": 66,
    "pages": 47,
    "note": null,
    "created_at": "2026-02-24T00:00:00Z"
  },
  {
    "id": "rd-43",
    "day": "2026-02-26",
    "minutes": 20,
    "pages": 14,
    "note": null,
    "created_at": "2026-02-26T00:00:00Z"
  },
  {
    "id": "rd-44",
    "day": "2026-03-03",
    "minutes": 67,
    "pages": 48,
    "note": null,
    "created_at": "2026-03-03T00:00:00Z"
  },
  {
    "id": "rd-45",
    "day": "2026-03-04",
    "minutes": 76,
    "pages": 54,
    "note": null,
    "created_at": "2026-03-04T00:00:00Z"
  },
  {
    "id": "rd-46",
    "day": "2026-03-06",
    "minutes": 76,
    "pages": 54,
    "note": null,
    "created_at": "2026-03-06T00:00:00Z"
  },
  {
    "id": "rd-47",
    "day": "2026-03-10",
    "minutes": 76,
    "pages": 54,
    "note": null,
    "created_at": "2026-03-10T00:00:00Z"
  },
  {
    "id": "rd-48",
    "day": "2026-03-11",
    "minutes": 20,
    "pages": 14,
    "note": null,
    "created_at": "2026-03-11T00:00:00Z"
  },
  {
    "id": "rd-49",
    "day": "2026-03-12",
    "minutes": 66,
    "pages": 47,
    "note": null,
    "created_at": "2026-03-12T00:00:00Z"
  },
  {
    "id": "rd-50",
    "day": "2026-03-14",
    "minutes": 127,
    "pages": 91,
    "note": null,
    "created_at": "2026-03-14T00:00:00Z"
  },
  {
    "id": "rd-51",
    "day": "2026-03-15",
    "minutes": 69,
    "pages": 49,
    "note": null,
    "created_at": "2026-03-15T00:00:00Z"
  },
  {
    "id": "rd-52",
    "day": "2026-03-16",
    "minutes": 35,
    "pages": 25,
    "note": null,
    "created_at": "2026-03-16T00:00:00Z"
  },
  {
    "id": "rd-53",
    "day": "2026-03-18",
    "minutes": 76,
    "pages": 54,
    "note": null,
    "created_at": "2026-03-18T00:00:00Z"
  },
  {
    "id": "rd-54",
    "day": "2026-03-19",
    "minutes": 71,
    "pages": 51,
    "note": null,
    "created_at": "2026-03-19T00:00:00Z"
  },
  {
    "id": "rd-55",
    "day": "2026-03-20",
    "minutes": 111,
    "pages": 79,
    "note": null,
    "created_at": "2026-03-20T00:00:00Z"
  },
  {
    "id": "rd-56",
    "day": "2026-03-21",
    "minutes": 53,
    "pages": 38,
    "note": null,
    "created_at": "2026-03-21T00:00:00Z"
  },
  {
    "id": "rd-57",
    "day": "2026-03-22",
    "minutes": 69,
    "pages": 49,
    "note": null,
    "created_at": "2026-03-22T00:00:00Z"
  },
  {
    "id": "rd-58",
    "day": "2026-03-23",
    "minutes": 22,
    "pages": 16,
    "note": null,
    "created_at": "2026-03-23T00:00:00Z"
  },
  {
    "id": "rd-59",
    "day": "2026-03-24",
    "minutes": 76,
    "pages": 54,
    "note": null,
    "created_at": "2026-03-24T00:00:00Z"
  },
  {
    "id": "rd-60",
    "day": "2026-03-25",
    "minutes": 35,
    "pages": 25,
    "note": null,
    "created_at": "2026-03-25T00:00:00Z"
  },
  {
    "id": "rd-61",
    "day": "2026-03-28",
    "minutes": 76,
    "pages": 54,
    "note": null,
    "created_at": "2026-03-28T00:00:00Z"
  },
  {
    "id": "rd-62",
    "day": "2026-03-30",
    "minutes": 18,
    "pages": 13,
    "note": null,
    "created_at": "2026-03-30T00:00:00Z"
  },
  {
    "id": "rd-63",
    "day": "2026-03-31",
    "minutes": 53,
    "pages": 38,
    "note": null,
    "created_at": "2026-03-31T00:00:00Z"
  },
  {
    "id": "rd-64",
    "day": "2026-04-01",
    "minutes": 49,
    "pages": 35,
    "note": null,
    "created_at": "2026-04-01T00:00:00Z"
  },
  {
    "id": "rd-65",
    "day": "2026-04-03",
    "minutes": 29,
    "pages": 21,
    "note": null,
    "created_at": "2026-04-03T00:00:00Z"
  },
  {
    "id": "rd-66",
    "day": "2026-04-04",
    "minutes": 20,
    "pages": 14,
    "note": null,
    "created_at": "2026-04-04T00:00:00Z"
  },
  {
    "id": "rd-67",
    "day": "2026-04-06",
    "minutes": 63,
    "pages": 45,
    "note": null,
    "created_at": "2026-04-06T00:00:00Z"
  },
  {
    "id": "rd-68",
    "day": "2026-04-07",
    "minutes": 62,
    "pages": 44,
    "note": null,
    "created_at": "2026-04-07T00:00:00Z"
  },
  {
    "id": "rd-69",
    "day": "2026-04-08",
    "minutes": 70,
    "pages": 50,
    "note": null,
    "created_at": "2026-04-08T00:00:00Z"
  },
  {
    "id": "rd-70",
    "day": "2026-04-09",
    "minutes": 76,
    "pages": 54,
    "note": null,
    "created_at": "2026-04-09T00:00:00Z"
  },
  {
    "id": "rd-71",
    "day": "2026-04-10",
    "minutes": 71,
    "pages": 51,
    "note": null,
    "created_at": "2026-04-10T00:00:00Z"
  },
  {
    "id": "rd-72",
    "day": "2026-04-12",
    "minutes": 48,
    "pages": 34,
    "note": null,
    "created_at": "2026-04-12T00:00:00Z"
  },
  {
    "id": "rd-73",
    "day": "2026-04-14",
    "minutes": 36,
    "pages": 26,
    "note": null,
    "created_at": "2026-04-14T00:00:00Z"
  },
  {
    "id": "rd-74",
    "day": "2026-04-16",
    "minutes": 21,
    "pages": 15,
    "note": null,
    "created_at": "2026-04-16T00:00:00Z"
  },
  {
    "id": "rd-75",
    "day": "2026-04-17",
    "minutes": 18,
    "pages": 13,
    "note": null,
    "created_at": "2026-04-17T00:00:00Z"
  },
  {
    "id": "rd-76",
    "day": "2026-04-18",
    "minutes": 34,
    "pages": 24,
    "note": null,
    "created_at": "2026-04-18T00:00:00Z"
  },
  {
    "id": "rd-77",
    "day": "2026-04-20",
    "minutes": 31,
    "pages": 22,
    "note": null,
    "created_at": "2026-04-20T00:00:00Z"
  },
  {
    "id": "rd-78",
    "day": "2026-04-21",
    "minutes": 21,
    "pages": 15,
    "note": null,
    "created_at": "2026-04-21T00:00:00Z"
  },
  {
    "id": "rd-79",
    "day": "2026-04-22",
    "minutes": 112,
    "pages": 80,
    "note": null,
    "created_at": "2026-04-22T00:00:00Z"
  },
  {
    "id": "rd-80",
    "day": "2026-04-24",
    "minutes": 18,
    "pages": 13,
    "note": null,
    "created_at": "2026-04-24T00:00:00Z"
  },
  {
    "id": "rd-81",
    "day": "2026-04-25",
    "minutes": 112,
    "pages": 80,
    "note": null,
    "created_at": "2026-04-25T00:00:00Z"
  },
  {
    "id": "rd-82",
    "day": "2026-04-28",
    "minutes": 64,
    "pages": 46,
    "note": null,
    "created_at": "2026-04-28T00:00:00Z"
  },
  {
    "id": "rd-83",
    "day": "2026-04-29",
    "minutes": 62,
    "pages": 44,
    "note": null,
    "created_at": "2026-04-29T00:00:00Z"
  },
  {
    "id": "rd-84",
    "day": "2026-04-30",
    "minutes": 25,
    "pages": 18,
    "note": null,
    "created_at": "2026-04-30T00:00:00Z"
  },
  {
    "id": "rd-85",
    "day": "2026-05-03",
    "minutes": 28,
    "pages": 20,
    "note": null,
    "created_at": "2026-05-03T00:00:00Z"
  },
  {
    "id": "rd-86",
    "day": "2026-05-04",
    "minutes": 25,
    "pages": 18,
    "note": null,
    "created_at": "2026-05-04T00:00:00Z"
  },
  {
    "id": "rd-87",
    "day": "2026-05-06",
    "minutes": 146,
    "pages": 104,
    "note": null,
    "created_at": "2026-05-06T00:00:00Z"
  },
  {
    "id": "rd-88",
    "day": "2026-05-07",
    "minutes": 73,
    "pages": 52,
    "note": null,
    "created_at": "2026-05-07T00:00:00Z"
  },
  {
    "id": "rd-89",
    "day": "2026-05-09",
    "minutes": 56,
    "pages": 40,
    "note": null,
    "created_at": "2026-05-09T00:00:00Z"
  },
  {
    "id": "rd-90",
    "day": "2026-05-13",
    "minutes": 38,
    "pages": 27,
    "note": null,
    "created_at": "2026-05-13T00:00:00Z"
  },
  {
    "id": "rd-91",
    "day": "2026-05-14",
    "minutes": 77,
    "pages": 55,
    "note": null,
    "created_at": "2026-05-14T00:00:00Z"
  },
  {
    "id": "rd-92",
    "day": "2026-05-15",
    "minutes": 46,
    "pages": 33,
    "note": null,
    "created_at": "2026-05-15T00:00:00Z"
  },
  {
    "id": "rd-93",
    "day": "2026-05-18",
    "minutes": 76,
    "pages": 54,
    "note": null,
    "created_at": "2026-05-18T00:00:00Z"
  },
  {
    "id": "rd-94",
    "day": "2026-05-25",
    "minutes": 73,
    "pages": 52,
    "note": null,
    "created_at": "2026-05-25T00:00:00Z"
  },
  {
    "id": "rd-95",
    "day": "2026-05-27",
    "minutes": 36,
    "pages": 26,
    "note": null,
    "created_at": "2026-05-27T00:00:00Z"
  },
  {
    "id": "rd-96",
    "day": "2026-05-28",
    "minutes": 31,
    "pages": 22,
    "note": null,
    "created_at": "2026-05-28T00:00:00Z"
  },
  {
    "id": "rd-97",
    "day": "2026-05-29",
    "minutes": 46,
    "pages": 33,
    "note": null,
    "created_at": "2026-05-29T00:00:00Z"
  },
  {
    "id": "rd-98",
    "day": "2026-05-30",
    "minutes": 36,
    "pages": 26,
    "note": null,
    "created_at": "2026-05-30T00:00:00Z"
  },
  {
    "id": "rd-99",
    "day": "2026-06-01",
    "minutes": 71,
    "pages": 51,
    "note": null,
    "created_at": "2026-06-01T00:00:00Z"
  },
  {
    "id": "rd-100",
    "day": "2026-06-03",
    "minutes": 59,
    "pages": 42,
    "note": null,
    "created_at": "2026-06-03T00:00:00Z"
  },
  {
    "id": "rd-101",
    "day": "2026-06-04",
    "minutes": 101,
    "pages": 72,
    "note": null,
    "created_at": "2026-06-04T00:00:00Z"
  },
  {
    "id": "rd-102",
    "day": "2026-06-05",
    "minutes": 32,
    "pages": 23,
    "note": null,
    "created_at": "2026-06-05T00:00:00Z"
  },
  {
    "id": "rd-103",
    "day": "2026-06-06",
    "minutes": 29,
    "pages": 21,
    "note": null,
    "created_at": "2026-06-06T00:00:00Z"
  },
  {
    "id": "rd-104",
    "day": "2026-06-07",
    "minutes": 144,
    "pages": 103,
    "note": null,
    "created_at": "2026-06-07T00:00:00Z"
  },
  {
    "id": "rd-105",
    "day": "2026-06-08",
    "minutes": 127,
    "pages": 91,
    "note": null,
    "created_at": "2026-06-08T00:00:00Z"
  },
  {
    "id": "rd-106",
    "day": "2026-06-09",
    "minutes": 18,
    "pages": 13,
    "note": null,
    "created_at": "2026-06-09T00:00:00Z"
  },
  {
    "id": "rd-107",
    "day": "2026-06-10",
    "minutes": 71,
    "pages": 51,
    "note": null,
    "created_at": "2026-06-10T00:00:00Z"
  },
  {
    "id": "rd-108",
    "day": "2026-06-11",
    "minutes": 148,
    "pages": 106,
    "note": null,
    "created_at": "2026-06-11T00:00:00Z"
  },
  {
    "id": "rd-109",
    "day": "2026-06-12",
    "minutes": 98,
    "pages": 70,
    "note": null,
    "created_at": "2026-06-12T00:00:00Z"
  },
  {
    "id": "rd-110",
    "day": "2026-06-13",
    "minutes": 25,
    "pages": 18,
    "note": null,
    "created_at": "2026-06-13T00:00:00Z"
  }
];

import type { Review } from "./types";

/** Reseñas de muestra (libros 'leído') para el modo demo. */
export const DEMO_REVIEWS: Review[] = [
  {
    id: "rv-1", book_id: "demo-1", created_at: "2026-05-20T00:00:00Z",
    rating: 5, liked: true, pace: "medio",
    loved: ["Las ideas", "Lo que aprendí"], moods: ["Reflexiva", "Inspirada"],
    would_recommend: true, review: "Me cambió la forma de hablarme a mí misma.",
  },
  {
    id: "rv-2", book_id: "demo-6", created_at: "2026-04-28T00:00:00Z",
    rating: 4, liked: true, pace: "lento",
    loved: ["La escritura", "Las emociones"], moods: ["Reflexiva", "Conmovida"],
    would_recommend: true, review: "Calmado y necesario para tiempos abrumadores.",
  },
  {
    id: "rv-3", book_id: "demo-19", created_at: "2026-03-15T00:00:00Z",
    rating: 4, liked: true, pace: "lento",
    loved: ["Las ideas"], moods: ["Reflexiva"],
    would_recommend: false, review: "Denso pero brillante.",
  },
];
