---
name: plan-feature
description: Planifica una nueva funcionalidad o el arreglo de un error antes de escribir código, y guarda el plan en plans/<num_issue>-<breve-descripcion>.md siguiendo una plantilla común. Úsalo siempre que el usuario mencione una issue por su número ("la issue 7", "#12"), pida planificar, diseñar o "ver cómo abordar" una feature o un bug, pregunte qué habría que tocar para implementar algo, o pida un plan de trabajo o un desglose de tareas — incluso si no dice la palabra "plan" ni menciona esta plantilla. Úsalo también antes de empezar a implementar una issue, para que exista un plan revisable primero.
allowed-tools: Read, Glob, Grep, Write, Bash(gh issue view:*), Bash(gh issue list:*), Bash(git log:*), Bash(git status:*), Bash(ls:*), mcp__slack__slack_post_message, mcp__slack__slack_list_channels
---

# Planificar una funcionalidad o un bugfix

Produce un plan revisable **antes** de tocar código. El valor del plan está en que otra
persona pueda leerlo y saber exactamente qué se va a hacer, qué se va a tocar y cómo se
sabrá que está terminado, sin tener que leer el código.

Este skill **planifica, no implementa**. Al terminar entrega el archivo del plan y para,
salvo que el usuario pida explícitamente continuar con la implementación.

## 1. Identifica la issue

Necesitas tres datos: **número**, **tipo** (`feature` o `bug`) y **paquetes afectados**.

En este repositorio las issues viven en GitHub y se crean desde `scripts/issues.json`:

```bash
gh issue view <num> --json number,title,body,labels
```

Las etiquetas traen el tipo (`bug` / `feature`) y los paquetes (`proyecto:api`,
`proyecto:web-admin`, …). Si `gh` no está disponible o falla, busca la issue por su
título en `scripts/issues.json` — el mismo contenido está ahí.

Si el usuario describe el trabajo sin dar número, pregúntale cuál es antes de seguir: el
número forma parte del nombre del archivo y del título del plan. Si confirma que no
existe issue, usa `000` y déjalo anotado en "Dudas y decisiones".

## 2. Investiga antes de escribir

Un plan escrito sin mirar el código es una lista de deseos. Antes de redactar nada,
localiza el código real que vas a tocar: busca los símbolos, rutas o pantallas que
menciona la issue y lee los archivos implicados.

Esta es la parte que más determina la calidad del plan. Un plan que nombra archivos que
no existen, o que se inventa una capa que el repositorio no tiene, hace perder más tiempo
del que ahorra.

Mira también cómo está resuelto algo parecido ya en el repositorio: si hay un CRUD
equivalente, un guard equivalente o un endpoint equivalente, el plan debe seguir ese
patrón en lugar de inventar uno nuevo. Al planificar, nombra el precedente que sigues.

Para un **bug**, añade un paso más: identifica la causa real antes de proponer el
arreglo. Un plan que describe el síntoma ("la página se queda en blanco") sin señalar la
línea que lo provoca no le sirve a quien lo implemente.

## 3. Redacta el plan con la plantilla

Usa `assets/plantilla-plan.md` como estructura exacta. Mantén sus secciones, su orden y
sus encabezados: el formato común es lo que permite comparar y revisar planes distintos.

Qué poner en cada sección:

**Objetivo** — El problema y para quién, no la solución. Si al leerlo solo se entiende
*qué se va a programar* pero no *por qué*, reescríbelo.

**Alcance** — Lo que entra y, sobre todo, lo que no. El apartado "No incluye" es el que
evita discusiones a mitad de la implementación: úsalo para lo que alguien podría asumir
razonablemente que está incluido y no lo está.

**Archivos afectados** — Rutas reales y verificadas, con la acción (crear / modificar /
eliminar) y el motivo. Si no estás seguro de que un archivo haga falta, no lo pongas:
anótalo como duda.

**Tareas** — Ver la sección 4.

**Criterios de aceptación** — Ver la sección 5.

**Dudas y decisiones** — Ver la sección 6.

## 4. Dimensiona las tareas: 5-10 minutos cada una

Una tarea son **5-10 minutos** de trabajo. Esa granularidad existe por una razón: a ese
tamaño cada tarea toca una cosa concreta, se puede verificar sola y se puede repartir o
retomar sin contexto previo. Si una tarea no se puede estimar, es que todavía no se ha
entendido el problema.

Reglas prácticas:

- Una tarea toca normalmente **un archivo o una unidad coherente** (un endpoint, un
  componente, un test).
- Empieza cada una con un verbo de acción: *añade*, *crea*, *extrae*, *valida*.
- Ordénalas de modo que se puedan ejecutar en secuencia, de abajo arriba: modelo y datos
  → lógica y API → interfaz → tests.
- Si te salen más de ~15 tareas, el alcance es demasiado grande: propón partir la issue y
  dilo en "Dudas y decisiones".
- Si solo te salen 2 o 3, revisa si estás escondiendo trabajo dentro de una tarea vaga.

Ejemplos del tamaño correcto:

| Mal | Por qué | Bien |
|---|---|---|
| Implementar la gestión de mesas | Son horas, no minutos | Añade la tabla `tables` al esquema SQLite en `packages/api/src/db/schema.ts` |
| Arreglar el frontend | No es verificable ni acotado | Suscribe `DishesComponent` al cambio de `restaurantId` para recargar el listado |
| Crear tests | No dice cuáles | Añade un test de `GET /restaurants/:id/tables` que cubra el 404 de restaurante inexistente |

## 5. Escribe criterios de aceptación verificables

Los criterios responden a "¿está hecho?" sin que haga falta discutirlo. Deben ser
observables desde fuera: un comportamiento de la aplicación, una respuesta de la API, un
test que pasa.

Usa la forma **Dado / Cuando / Entonces** cuando describas comportamiento, porque obliga
a nombrar el contexto y evita criterios ambiguos:

> **CA2** — Dado un camarero autenticado, cuando navega a `/cocina`, entonces se le
> redirige a `/barra` y no ve el contenido de cocina.

Un criterio como "funciona correctamente" o "el código está limpio" no es verificable:
reescríbelo o elimínalo. Para un bug, incluye siempre un criterio que describa el caso
concreto que fallaba. Incluye también la comprobación de tests del repositorio
(`npm test`) cuando el cambio toque `packages/api`.

Los criterios describen el **resultado**, las tareas describen el **camino**. No repitas
las tareas aquí.

## 6. Deja constancia de dudas y decisiones

Esta sección es obligatoria y va al final, y rara vez está vacía. Durante la
planificación casi siempre tomas decisiones que la issue no especifica: cómo se llama un
campo, qué pasa en un caso límite, qué librería usar.

Anota en **Decisiones tomadas** todo lo que hayas elegido por tu cuenta, con el motivo y
la alternativa descartada. Quien revise el plan necesita poder contradecirte barato, antes
de que el código exista.

Anota en **Dudas pendientes** lo que de verdad necesita respuesta del usuario. Para cada
duda, di qué asumes mientras tanto y qué parte del plan cambiaría según la respuesta, para
que la implementación no se bloquee esperando.

Si una duda invalida el plan entero, no la escondas al final: dilo también al usuario
cuando le entregues el plan.

## 7. Guarda el archivo

Ruta: `plans/<num_issue>-<breve-descripcion>.md`

- `<num_issue>`: el número tal cual, sin `#` ni ceros de relleno (`7`, no `#007`).
- `<breve-descripcion>`: 2-5 palabras en kebab-case, en minúsculas y sin acentos ni `ñ`,
  derivadas del título de la issue.

Ejemplos: `plans/4-seed-no-borra-datos.md`, `plans/5-gestion-de-mesas.md`,
`plans/12-codigos-de-descuento.md`.

Crea el directorio `plans/` si no existe. Si ya hay un plan para esa issue, léelo y
pregunta al usuario si quiere reemplazarlo o partir de él, en lugar de sobrescribirlo sin
avisar.

Al terminar, resume al usuario en pocas líneas: la ruta del archivo, el número de tareas,
y las dudas pendientes que necesiten su respuesta. No vuelques el plan entero en el chat
—ya está en el archivo—, pero sí saca a la superficie lo que requiera una decisión suya.

## 8. Avisa en Slack

Guardado el plan y resumido al usuario, publica un aviso en el canal `curso-claude-ed3` de
Slack usando `mcp__slack__slack_post_message` con el `channel_id` `C0CGZ01R9M2`. Si ese id
falla porque el canal se recreó, localízalo por nombre con
`mcp__slack__slack_list_channels`.

El aviso sirve para que el equipo sepa que hay un plan listo para revisar. No vuelques el
plan en el canal: está en el repositorio y ahí se revisa.

- Qué se ha planificado: número de issue y título.
- La ruta del archivo del plan.
- Cuántas tareas tiene.
- Las dudas pendientes que necesitan una respuesta, si las hay.

Ejemplo:

> 📋 Plan listo para revisar: *#5 Gestión de mesas* — `plans/5-gestion-de-mesas.md`, 8
> tareas. Duda pendiente: si una mesa puede quedar asignada a dos camareros a la vez.

Las dudas son lo más importante del aviso: es lo que puede hacer que alguien conteste antes
de que se escriba código que haya que tirar.

Publica el aviso aunque el plan quede a la espera de respuestas —un plan con dudas sigue
siendo revisable—, pero no lo publiques si has parado sin llegar a guardar el archivo.

Si el envío falla —el servidor MCP de Slack no está configurado, o el token no es válido—
no lo reintentes en bucle: díselo al usuario y dale el texto del mensaje para que lo
publique él. El plan ya está guardado y eso es lo que importa.
