---
description: Crea un commit siguiendo la especificación Conventional Commits
argument-hint: [pista opcional del tipo, scope o descripción]
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git add:*), Bash(git commit:*), Bash(git restore:*)
---

# Commit con Conventional Commits

Crea uno o varios commits siguiendo la especificación [Conventional Commits 1.0.0](https://www.conventionalcommits.org/es/v1.0.0/).

## Contexto

- Estado del repositorio: !`git status --short --branch`
- Cambios en staging: !`git diff --cached --stat`
- Cambios sin preparar: !`git diff --stat`
- Últimos commits (imita su estilo e idioma): !`git log --oneline -15`

Indicación del usuario: $ARGUMENTS

## Formato del mensaje

```
<tipo>[(scope)][!]: <descripción>

[cuerpo]

[pies]
```

### Tipos

| Tipo | Cuándo usarlo | SemVer |
|------|---------------|--------|
| `feat` | Nueva funcionalidad para el usuario | MINOR |
| `fix` | Corrección de un error | PATCH |
| `docs` | Solo documentación | — |
| `style` | Formato sin cambio de comportamiento | — |
| `refactor` | Reestructuración sin añadir función ni corregir error | — |
| `perf` | Mejora de rendimiento | — |
| `test` | Añadir o corregir tests | — |
| `build` | Sistema de compilación o dependencias | — |
| `ci` | Configuración de integración continua | — |
| `chore` | Mantenimiento fuera de `src` y de los tests | — |
| `revert` | Revierte un commit anterior | — |

### Reglas

- **Descripción**: imperativo presente (`añade`, no `añadido` ni `añade.`), minúscula inicial, sin punto final, máximo 72 caracteres en la primera línea.
- **Scope**: opcional, entre paréntesis, en minúsculas, nombra la zona afectada (`feat(auth):`, `fix(api):`). Omítelo si el cambio es transversal.
- **Breaking change**: añade `!` antes de los dos puntos y un pie `BREAKING CHANGE: <explicación>`. Equivale a un MAJOR de SemVer.
- **Cuerpo**: separado por una línea en blanco. Explica el *qué* y el *porqué*, nunca el *cómo* (eso ya está en el diff). Omítelo si la descripción se basta.
- **Pies**: formato `Token: valor`, uno por línea. Ejemplos: `Refs: #123`, `Closes: #45`, `BREAKING CHANGE: ...`.
- **Idioma**: el mismo que usen los commits recientes del repositorio.

## Pasos

1. Revisa el contexto de arriba. Si no hay ningún cambio (ni preparado ni sin preparar), avisa al usuario y detente.
2. Examina el diff completo (`git diff --cached` y `git diff`) para entender qué cambió realmente, no solo qué archivos.
3. **Agrupa por propósito**: si los cambios mezclan varios cambios lógicos (p. ej. una corrección y un refactor), propón al usuario dividirlos en varios commits y espera su confirmación antes de seguir.
4. Si no hay nada en staging, prepara con `git add <rutas concretas>` solo los archivos del cambio. No uses `git add -A` ni `git add .` a ciegas, y nunca añadas secretos (`.env`, claves, credenciales) ni artefactos de build.
5. Redacta el mensaje según el formato anterior, teniendo en cuenta `$ARGUMENTS` si el usuario dio alguna pista.
6. Haz el commit. Para mensajes con cuerpo o pies usa un heredoc:
   ```sh
   git commit -m "$(cat <<'EOF'
   fix(parser): evita desbordamiento con entradas vacías

   El bucle no comprobaba el final del buffer, lo que provocaba
   una lectura fuera de rango con ficheros de 0 bytes.

   Closes: #42
   EOF
   )"
   ```
7. Muestra el resultado con `git log -1 --stat`.

## Restricciones

- No hagas `git push`: el commit se queda en local.
- No uses `--no-verify` ni `--amend` salvo que el usuario lo pida explícitamente.
- Si un hook de pre-commit falla, corrige la causa y vuelve a commitear; no lo saltes.
- Si el hook modificó archivos, revisa esos cambios e inclúyelos antes de reintentar.
