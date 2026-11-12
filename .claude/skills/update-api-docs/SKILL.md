---
name: update-api-docs
description: Mantiene al día docs/api/openapi.yml cuando cambia la API y regenera la documentación HTML con Redocly ejecutando scripts/generate-api-docs.sh. Úsalo siempre que se añadan, cambien o eliminen rutas, controladores, modelos o roles en packages/api, cuando el usuario pida actualizar, regenerar o publicar la documentación de la API, el openapi.yml o el HTML de Redoc, y al terminar de implementar un plan que haya tocado la API — incluso si no menciona OpenAPI ni esta skill.
allowed-tools: Read, Glob, Grep, Edit, Write, Bash(git diff:*), Bash(git status:*), Bash(git log:*), Bash(ls:*), Bash(./scripts/generate-api-docs.sh:*), Bash(bash scripts/generate-api-docs.sh:*), Bash(npm run docs:api:*)
---

# Actualizar la documentación de la API

`docs/api/openapi.yml` es el contrato publicado de la API: lo que dice es lo que sus
consumidores creen que pueden pedir. Una documentación desactualizada es peor que no tener
documentación, porque nadie duda de ella hasta que algo falla en producción.

Esta skill tiene un único trabajo: que el YAML describa exactamente lo que expone
`packages/api/src/app.ts` hoy, y que el HTML publicado corresponda a ese YAML.

## 1. Averigua qué ha cambiado

No repases la API entera: mira el cambio concreto que has hecho o que te piden documentar.

```bash
git status --porcelain
git diff --stat HEAD -- packages/api/src
```

Lo que afecta al contrato está en estos sitios:

| Dónde | Qué puede cambiar en el contrato |
|---|---|
| `packages/api/src/app.ts` | Prefijos de ruta y grupos nuevos o retirados |
| `packages/api/src/routes/*.ts` y `contexts/**/http/*.routes.ts` | Métodos, rutas, `authenticate`, `authorize([...])` |
| `packages/api/src/controllers/`, `contexts/**/http/*Controller.ts` | Cuerpos de petición y respuesta, códigos de estado |
| `packages/api/src/models/*.ts`, `contexts/**/domain/` | Campos y enums de las entidades |
| `contexts/shared/infrastructure/http/middlewares/errorHandler.ts` | Códigos de error y el schema `Error` |

Si el cambio no toca ninguno de esos puntos —un refactor interno, un repositorio, un
test—, el contrato no cambia. Dilo y no toques el YAML: un commit que solo mueve la fecha
del documento hace ruido en las revisiones.

## 2. Compara el YAML con las rutas reales

Antes de escribir, comprueba qué dice ya el documento sobre lo que ha cambiado. Interesa
tanto lo que falta como lo que sobra: un endpoint eliminado que sigue documentado manda a
los consumidores contra un 404.

Lista las rutas registradas y contrástalas una a una con las `paths` del YAML:

```bash
grep -rnE "router\.(get|post|put|patch|delete)" packages/api/src --include=*.routes.ts
```

## 3. Actualiza `docs/api/openapi.yml`

Toca solo lo que el cambio exige. Reescribir secciones enteras que no han cambiado hace
ilegible el diff y esconde lo que de verdad se ha modificado.

Reglas que el documento ya sigue y hay que mantener:

- **Los parámetros de ruta de Express van en `{llaves}`**: `/restaurants/{restaurantId}/dishes`,
  no `:restaurantId`. Y todo parámetro de la ruta necesita su entrada en `parameters`.
- **Cada operación protegida lleva `security: [{ bearerAuth: [] }]`**; las públicas llevan
  `security: []` explícito, no la ausencia de la clave.
- **El rol exigido se documenta**. Si la ruta tiene `authorize(['admin', 'manager'])`, dilo
  en la descripción de la operación y añade la respuesta `403`. Quien lee el contrato no ve
  el middleware.
- **Los enums salen de los modelos, no de la memoria**: categorías de plato, estados de
  pedido y roles están definidos como `const` en `packages/api/src/models/` y en
  `contexts/employee/domain/value-objects/Role.ts`. Cópialos de ahí.
- **Las respuestas de error apuntan al schema `Error`** (`error` y `message`), que es lo que
  construye `errorHandler`. No inventes otro formato.
- **Añade `operationId` a cada operación nueva**: Redocly lo avisa si falta y es lo que usan
  los generadores de clientes.

Si al documentar descubres que el código hace algo que no estaba previsto —un endpoint que
devuelve un campo de más, un `authorize` que no coincide con lo esperado— documenta lo que
el código hace de verdad y dilo al usuario. El contrato describe la realidad; corregir la
realidad es otra tarea.

## 4. Regenera el HTML

Nunca edites `docs/api/index.html` a mano: es un artefacto generado y el siguiente script lo
sobrescribe entero.

```bash
./scripts/generate-api-docs.sh
```

El script valida el YAML con `redocly lint` **antes** de generar, y si la validación falla
no escribe nada. Es deliberado: un HTML construido sobre un documento con errores parece
correcto y documenta algo que no es.

Opciones útiles: `-n` valida sin escribir, `--no-lint` genera saltándose la validación (no
lo uses para cerrar un cambio), `-s` y `-o` cambian entrada y salida. `REDOCLY_VERSION=2.77.0`
fija la versión del CLI.

Si el proyecto ya tiene el script npm equivalente, `npm run docs:api` hace lo mismo.

### Cuando el lint falla

El conjunto de reglas por defecto de Redocly es el `recommended`, y es exigente. Los
errores que de verdad paran la generación suelen ser estos dos:

- **`no-empty-servers`**: falta el bloque `servers` en la raíz del documento.
- **`security-defined`**: una operación sin `security` ni herencia de la raíz. Si es pública,
  la solución es `security: []`, no quitar la clave.

Lo demás (`info-license`, `operation-operationId`, `operation-4xx-response`) son avisos:
conviene atenderlos, pero no impiden generar. Corrige la causa en el YAML; no añadas un
archivo de ignorados para silenciar el lint.

## 5. Informa de forma verificable

Al terminar, cuenta en pocas líneas:

- Qué endpoints se han añadido, cambiado o eliminado en el documento.
- Si el lint pasó y si el HTML se regeneró.
- Lo que hayas decidido documentar de una forma discutible, para que puedan contradecirte.

Si el lint falló y no has podido arreglarlo, dilo con la salida del error y deja claro que
el HTML **no** se ha regenerado. Un informe que da por publicada una documentación que no
existe hace perder más tiempo del que ahorra.

Incluye `docs/api/openapi.yml` y `docs/api/index.html` en el mismo commit que el cambio de
la API que los motiva, de modo que el repositorio nunca quede con el código por delante del
contrato.
