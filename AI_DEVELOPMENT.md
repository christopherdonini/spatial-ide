# AI Development Workflow

Development-time practice, deliberately **outside** the product constitution (00–13): models and agent practices change far faster than architecture, and the runtime product stays provider-neutral (04).

## Agent team

- **Architect agent** — designs and reviews against the constitution; proposes ADRs.
- **Coding agents** — implement against 02/10 module and protocol boundaries.
- **Review agents** — critique diffs for principle violations (01) before human review.
- **Testing agents** — write and run tests against the 08 budgets and conformance suites.

## Conventions

- Cite constitution docs by number; conflicts resolve lower-number-wins (01 beats 05).
- Agents never edit 01 or accepted ADRs; they propose new ADRs.
- Recorded agent sessions feed the MCP replay tests (08).
- Agent-generated code is labeled in commits for later audit.
