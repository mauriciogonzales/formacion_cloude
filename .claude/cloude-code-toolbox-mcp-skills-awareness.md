# Claude Code ToolBox — MCP & Skills awareness

_Generated: 2026-11-11T16:54:16.466Z_

## How to use this report

- **Saved copy:** This file is **`.claude/cloude-code-toolbox-mcp-skills-awareness.md`** — refreshed whenever the toolbox runs an MCP & Skills scan (including on workspace open when auto-scan is enabled). It is meant for **Claude Code workspace context** together with `CLAUDE.md` (which gets a shorter replaceable summary when auto-merge is on).
- **MCP:** Lists **configured** servers from Claude Code config (`~/.claude.json` for user scope, `.mcp.json` for project scope). Use `/mcp` in the Claude Code panel to connect servers for your session.
- **Skills:** **On-disk** folders with `SKILL.md`. Claude Code does not auto-load them; attach `SKILL.md` or paths in chat when useful.
- **Task routing:** When the user’s request matches a server’s purpose (e.g. Confluence → Confluence/Atlassian MCP), prefer that **server id** from the tables below.

---

## MCP — workspace

Workspace `mcp.json` _(folder: base-curso-desarrollo-con-ia)_

- **c:\mgg\formacion\claude\proyecto2\base-curso-desarrollo-con-ia\.mcp.json** — _File exists — servers defined_

| Server id | Kind | Detail |
|-----------|------|--------|
| context7 | http | https://mcp.context7.com/mcp |

## MCP — user profile

- **C:\Users\mrgonzales\.claude.json** — _File exists — servers defined_

| Server id | Kind | Detail |
|-----------|------|--------|
| slack | stdio | C:/Users/mrgonzales/AppData/Roaming/fnm/aliases/default/npx.cmd -y @modelcontextprotocol/server-slack |

## Skills (local `SKILL.md` folders)

### Project-scoped

- **implement-plan** — `c:\mgg\formacion\claude\proyecto2\base-curso-desarrollo-con-ia\.claude\skills\implement-plan`
  - Implementa un plan de plans/*.md tarea a tarea con TDD estricto, en una rama creada a partir de development, marcando cada tarea como hecha y haciendo un commit por tarea. Úsalo siempre que el usuario pida implementar, d

- **plan-feature** — `c:\mgg\formacion\claude\proyecto2\base-curso-desarrollo-con-ia\.claude\skills\plan-feature`
  - Planifica una nueva funcionalidad o el arreglo de un error antes de escribir código, y guarda el plan en plans/<num_issue>-<breve-descripcion>.md siguiendo una plantilla común. Úsalo siempre que el usuario mencione una i

### User-scoped

_None found._

---

## Suggested next steps

- **MCP:** Use this extension’s hub **MCP** tab, or `claude mcp list` in the terminal. In Claude Code, use `/mcp` to connect servers for the session.
- **Edit config:** Open `~/.claude.json` (user MCP) or `<workspace>/.mcp.json` (project MCP) via the extension commands.
- **Refresh this report:** run **Intelligence — scan MCP & Skills awareness** again after changing MCP config or adding skills.

_Report from Claude Code ToolBox extension._
