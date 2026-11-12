---
name: implement-plan
description: Implementa un plan de plans/*.md tarea a tarea con TDD estricto, en una rama creada a partir de development, marcando cada tarea como hecha y haciendo un commit por tarea. Úsalo siempre que el usuario pida implementar, desarrollar o "ponerse con" un plan existente, mencione un archivo de plans/ o una issue que ya tenga plan, o diga cosas como "implementa el plan", "empieza con el 5" o "hazlo" después de haber revisado un plan — incluso si no nombra esta skill ni la palabra TDD. Si lo que pide es planificar y todavía no hay plan, usa antes la skill plan-feature.
---

# Implementar un plan

Convierte un plan de `plans/` en código, tarea a tarea, dejando un rastro legible: una
rama por plan, un commit por tarea y el propio plan actualizado conforme avanzas.

La disciplina importa más que la velocidad. Quien revise esta rama debe poder recorrer los
commits y ver cómo cada tarea se justificó con un test antes de existir el código.

## 1. Localiza el plan y entiéndelo

Si el usuario no dice cuál, lista `plans/` y pregúntale. No elijas por él: implementar el
plan equivocado cuesta mucho más que una pregunta.

Lee el plan **entero** antes de escribir nada, incluida la sección "Dudas y decisiones".

Si hay dudas pendientes que afectan a tareas concretas, plantéalas ahora. Empezar a
programar sobre una duda sin resolver suele significar tirar el trabajo después. Si la duda
solo afecta a las últimas tareas, puedes empezar y preguntar antes de llegar a ellas,
avisando de que lo harás.

## 2. Prepara la rama

Comprueba primero que estás en un repositorio git con el árbol limpio:

```bash
git rev-parse --is-inside-work-tree
git status --porcelain
```

Si hay cambios sin confirmar, para y pregunta al usuario qué hacer con ellos. Si no es un
repositorio git, díselo y detente: no ejecutes `git init` por tu cuenta, porque decidir
cómo se versiona un proyecto no te corresponde.

La rama base es `development`. Si no existe, se crea a partir de `main`:

```bash
# ¿existe development en local?
git show-ref --verify --quiet refs/heads/development && echo local || echo falta

# si falta en local pero está en el remoto, úsala:
git ls-remote --exit-code --heads origin development

# si no existe en ningún sitio, créala desde main:
git switch -c development main
```

Con `development` lista, crea la rama de trabajo con **el nombre del plan sin extensión**:

```bash
git switch development
git switch -c 000-login-y-registro
```

Si la rama ya existe, no la recrees: es casi seguro una implementación a medias. Cámbiate a
ella, mira qué tareas están ya marcadas en el plan y retoma por la primera sin marcar,
confirmándolo con el usuario.

## 3. Implementa cada tarea con TDD estricto

Recorre las tareas **en orden**: el plan las ordenó para que cada una se apoye en la
anterior. Para cada una, el ciclo es siempre el mismo.

### Rojo — escribe el test y míralo fallar

Escribe el test que describe lo que la tarea debe conseguir, ejecútalo y **comprueba que
falla**.

Verlo fallar no es burocracia: es la única prueba de que el test realmente ejercita el
código nuevo. Un test que pasa antes de implementar nada está mal escrito, o mide algo que
ya existía, y a partir de ahí dejará de avisarte cuando el código se rompa.

Mira además *por qué* falla. Debe fallar por la aserción, o porque falta lo que vas a
crear, no por una ruta mal escrita, un import roto o un error de sintaxis. Si falla por
otro motivo, arregla el test antes de seguir.

```bash
npm test -w @resttek/api
```

### Verde — el código mínimo que lo haga pasar

Escribe lo justo para que el test pase. Nada más.

La tentación es implementar de una vez todo lo que ya ves venir en las tareas siguientes.
Resístete: el código que escribes ahora sin un test que lo pida es código que nadie ha
justificado, y es donde se cuelan los errores que ningún test detecta. Lo que haga falta
después tendrá su propia tarea y su propio test.

Vuelve a ejecutar los tests y confirma que pasa el nuevo **y siguen pasando los demás**.

### Refactor — limpia con la red puesta

Con los tests en verde, mejora lo que haga falta: nombres, duplicación, estructura. Vuelve
a ejecutar los tests después. Si no hay nada que limpiar, sigue adelante; el refactor es
una oportunidad, no un trámite.

### Tareas sin test natural

Algunas tareas no admiten un test propio: crear un archivo de configuración, renombrar algo,
actualizar documentación. No inventes un test artificial para cumplir el ritual —un test
que solo comprueba que una constante vale lo que vale no protege de nada y hay que
mantenerlo igual.

En esos casos verifica la tarea de la forma que corresponda (los tests existentes siguen en
verde, el servidor arranca, el tipo compila) y **dilo en el commit**. Si una tarea del plan
dice explícitamente "añade un test de X", ese test *es* el rojo del ciclo: escríbelo,
compruébalo y pasa a la siguiente.

## 4. Marca la tarea y haz el commit

Solo cuando los tests están en verde:

1. Marca la tarea en el plan cambiando `- [ ] **T3**` por `- [x] **T3**`. Marca **solo** la
   tarea que acabas de terminar, nunca varias de golpe: el plan es el estado real del
   trabajo y marcar de más deja a quien lo lea sin saber dónde estás.
2. Invoca el slash command `/commit`, que redacta el mensaje siguiendo Conventional Commits.
   El commit incluye el código y el plan actualizado juntos, de modo que cada commit deja el
   repositorio coherente: lo que el plan dice hecho es exactamente lo que está hecho.

Un commit por tarea. No acumules varias tareas en un commit, aunque sean pequeñas, porque
pierdes la capacidad de revertir una sola cosa.

Si un hook de pre-commit falla, corrige la causa; no uses `--no-verify`.

## 5. Cuando el plan se equivoca

Pasa a menudo: al implementar la tarea T6 descubres que el archivo no está donde decía el
plan, o que el enfoque no funciona.

Para y dilo. No improvises una solución distinta en silencio, porque el plan deja de
describir lo que se está construyendo y la revisión se vuelve imposible.

- **Desajuste pequeño** (otra ruta, otro nombre): sigue adelante, pero corrige el plan en el
  mismo commit y menciónalo en el cuerpo del mensaje.
- **El enfoque no funciona, o hace falta trabajo que el plan no contempla**: para, explica
  al usuario qué te has encontrado y qué alternativas ves, y espera su decisión. Añadir
  tareas al plan es una decisión suya.

Nunca marques como hecha una tarea cuyo test no pasa. Si te quedas atascado, deja la tarea
sin marcar, no hagas commit a medias y cuenta dónde estás.

## 6. Cierra

Terminadas todas las tareas, recorre los **criterios de aceptación** del plan y comprueba
uno a uno si se cumplen. Son el contrato de la issue: las tareas describen el camino, pero
esto es lo que decide si está hecho.

Ejecuta la suite completa del repositorio, no solo los tests del paquete que tocaste:

```bash
npm test
```

Informa al usuario de forma que pueda fiarse:

- La rama creada y el número de commits.
- Criterios de aceptación cumplidos y, si alguno no lo está, **cuál y por qué**.
- Desajustes que encontraste respecto al plan.
- Lo que haya quedado pendiente.

Si algo falla, dilo con la salida del error. Un informe que esconde un test en rojo hace
perder mucho más tiempo del que ahorra.

No hagas `git push` ni abras un pull request salvo que el usuario lo pida.

## 7. Avisa en Slack

Con todas las tareas terminadas y el informe ya entregado al usuario, publica un aviso en
el canal `curso-claude-ed3` de Slack usando `mcp__slack__slack_post_message` con el
`channel_id` `C0CGZ01R9M2`. Si ese id falla porque el canal se recreó, localízalo por
nombre con `mcp__slack__slack_list_channels`.

El mensaje es un aviso, no el informe: quien lo lea debe saber de un vistazo qué se ha
implementado y si puede fiarse, sin tener que abrir el repositorio.

- Qué plan se ha implementado: número de issue y título, y la rama.
- Cuántas tareas y cuántos commits.
- El estado real al cerrar: tests en verde, o qué ha quedado en rojo o pendiente.

Di también aquí lo que haya salido mal. Un aviso que solo cuenta la parte buena es peor que
no avisar, porque quien lo lea dará por terminado algo que no lo está.

Ejemplo:

> ✅ Plan implementado: *#5 Gestión de mesas* — rama `5-gestion-de-mesas`, 8 tareas en 8
> commits. Suite completa en verde. Pendiente: CA4 queda sin cumplir hasta decidir el
> límite de comensales por mesa.

Envía el aviso **solo cuando el trabajo esté de verdad terminado**. Si paraste a mitad por
una duda o un bloqueo, no publiques nada: el canal pasaría a decir que algo está hecho
cuando no lo está.

Si el envío falla —el servidor MCP de Slack no está configurado, o el token no es válido—
no lo reintentes en bucle: díselo al usuario y dale el texto del mensaje para que lo
publique él. El aviso no debe bloquear un trabajo que ya está hecho.
