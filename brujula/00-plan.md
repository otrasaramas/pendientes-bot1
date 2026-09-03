# Brújula — herramienta de diagnóstico para la clase de IA

## Qué es

Una página con un cuestionario corto que detecta **en qué punto está** una persona
y **en qué trampa está metida**, y le devuelve tres movimientos concretos.

No es un generador de ideas. La gente de la clase no está atascada por falta de
ideas: está atascada por falta de criterio para elegir y de permiso para empezar
pequeño. El generador de ideas existe, pero solo como una rama: la de quien
todavía no tiene nada.

## Por qué funciona con un salón mezclado

En el salón hay médicos, psicólogos, fotógrafos y chefs de chorizos. Ninguna
pregunta puede ser sobre la industria. Todas las preguntas son sobre el **estado
del proyecto**, que es idéntico para un consultorio y para unos chorizos:

- ¿ya existe la cosa o solo la idea?
- ¿alguien que no te quiere ya te pagó?
- ¿a quién le escribirías mañana si tuvieras que vender uno?

## Las dos leyes

Todo el catálogo de trampas cuelga de dos leyes. Casi todos los errores que ves
en el salón son una de las dos, disfrazada.

**Ley 1 — Orden.** La prueba va antes que la marca. Todo lo que construyes antes
de que alguien te pague es decoración, no conocimiento. *("Creen que necesitan
marca wow en vez de una prueba de producto primero.")*

**Ley 2 — Cancha.** Si compites en la dimensión donde el otro es imbatible,
pierdes, aunque tu trabajo sea mejor. *("Hacen a mano los sobres copiados de
China: el chino vale 1.000 y el de ellos 3.000.")* Lo hecho a mano tiene que
vender lo que la máquina no puede vender. Si vende lo mismo, es una copia cara.

## Piezas

| Archivo | Qué es | De quién es el trabajo |
|---|---|---|
| `01-trampas.md` | Catálogo de trampas: cómo suena, qué pasa en realidad, qué hacer | **Tuyo.** Yo dejé un borrador; tú corriges y agregas |
| `02-cuestionario.md` | Las 7 preguntas + cómo se lee cada respuesta | Mío el borrador, tuyo el ajuste |
| `03-estados.md` | Los 5 estados y qué recibe cada uno | Tuyo el contenido, mío la estructura |

## Los tres pasos

1. **Corregir el catálogo.** Las trampas que te faltan son las que ya has visto
   en persona y yo no puedo inventar. Cada trampa que agregues sube el valor de
   la herramienta más que cualquier línea de código.
2. **Probarlo a mano.** El cuestionario, en papel o por WhatsApp, con 5 personas
   del salón — que sean de áreas distintas a propósito: alguien de salud, el
   fotógrafo, el de los chorizos. 20 minutos cada uno. De ahí salen las trampas
   reales y el lenguaje con el que la gente las describe.
3. **Construirla.** Página publicada con Claude adentro: contesta las 7
   preguntas, la página diagnostica contra el catálogo y devuelve el plan. Sin
   servidor, sin desplegar, se comparte con un link.
