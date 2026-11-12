# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

REST API example built with Node.js (CommonJS) + Express 4, persisting to SQLite via `better-sqlite3`. Code, comments, API field names and error messages are in Spanish.

## Commands

```
npm install      # installs express + better-sqlite3 (native module, uses prebuilt binaries)
npm start        # node src/index.js — listens on PORT (default 3000)
npm run dev      # node --watch src/index.js — restarts on file changes
```

There is no test runner, linter or build step configured. Manual check: `curl http://localhost:3000/health`.

Environment variables: `PORT` (default `3000`), `DB_PATH` (default `data/vendehumos.db`; `:memory:` is supported for throwaway runs).

Note: on this machine `node`/`npm` have not been reachable from Claude Code's shells (PowerShell and Git Bash), even though `node_modules` exists — the user runs commands from their own terminal. Check `node -v` before assuming you can run the app.

## Architecture

- `src/index.js` only starts the server; `src/app.js` builds and exports the Express app (kept separate so the app can be imported without listening, e.g. for future tests). Every router is mounted in `app.js`, followed by a JSON 404 fallback that must stay last.
- `src/db.js` is a singleton: requiring it opens the SQLite connection (WAL mode), creates the `data/` directory and runs `CREATE TABLE IF NOT EXISTS`. There are no migrations — schema changes to an existing table require deleting the DB file (`data/` is git-ignored) or writing an `ALTER TABLE`.
- `src/models/categorias.js` is the single source of truth for the `categoria` enum. It is used both for request validation in the router and to generate the SQL `CHECK (categoria IN (...))` constraint in `db.js`; changing the enum does not update the CHECK on an already-created table.
- Routers (`src/routes/*.js`) prepare their SQLite statements once at module load and validate request bodies by hand (no validation library).
- Naming convention: JSON uses camelCase (`fotoUrl`, `numVotos`), DB columns use snake_case (`foto_url`, `num_votos`); routers map rows to responses with a `toDto` function.
- Response conventions: creation returns `201` with a `Location` header and the created resource; validation failures return `400` with `{ error, detalles: [...] }`.

## API guidelines

`api-pagination.md` defines the pagination convention for collection endpoints: respond with a page object containing `items` (required) plus `self`, `first`, `prev` (omitted on the first page), `next` (omitted on the last page) and `last` as links or cursors, and `query` echoing the applied filters. Follow it when adding list endpoints.


<!-- cloude-code-toolbox:mcp-skills-awareness-begin -->

### MCP & Skills awareness (Claude Code ToolBox)

_Last synced: 2026-11-11T18:39:48.530Z._

- **Full report:** `.claude/cloude-code-toolbox-mcp-skills-awareness.md` in this workspace (auto-overwritten on each scan). Use it as ground truth for configured servers and skill folders.
- **MCP:** For **live tools** in Claude Code, enable the matching server via `/mcp`. Servers are configured in `~/.claude.json` (user) and `.mcp.json` (project).
- **When the user’s task matches a server** (e.g. Confluence work and a **Confluence** / **Atlassian** MCP is listed), **prefer that server id** and plan on tool use—not only file search.
- **Skills:** Folders below contain `SKILL.md`; attach or cite paths in chat when relevant.

#### Workspace MCP

- `c:\mgg\formacion\claude\api-ejemplo\.mcp.json` _(workspace: api-ejemplo)_ — _file missing_

_No active workspace servers in mcp.json._

#### User MCP

- `C:\Users\mrgonzales\.claude.json` — _no servers defined_

_No active user-scoped servers in mcp.json._

#### Project skills

_None found (or no workspace open)._

#### User skills

_None found._

<!-- cloude-code-toolbox:mcp-skills-awareness-end -->
