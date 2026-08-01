# 04 — AI and MCP

## Rule zero

AI acts through the public API (SKP/MCP), **never GUI automation**. Same surface, same permissions, same logging as humans and plugins.

## MCP adapter

MCP is an **adapter over the kernel's semantic API** (ADR-004), for external LLMs and agent hosts. It carries control and context — never bulk data; the renderer and data plane do not speak MCP.

- **Resources**: datasets, layers, project state, lineage, diagnostics, metadata.
- **Tools**: operations — query, import, style, export, branch — each declaring the capabilities it requires and its side-effect class (ADR-006).

## Permission model

Scoped, expiring capability grants per client — e.g. `read dataset A · write temporary datasets · network only to domain Y · cannot publish · expires in 20 minutes` (09). Identical for plugins and AI agents (01, "one extension surface"). Export and publish are distinct capabilities. Every grant and every action is logged. No unlogged mutations, ever.

## In-product AI roles

- **Explain diagnostics** — linting stays deterministic (03); AI explains findings and proposes fixes.
- **Data doctor assistant** — helps resolve ambiguous imports: guessed CRS, malformed schemas (05).
- **Metadata drafting** — auto-draft dataset descriptions and lineage summaries on save (05).
- **"Explain this result"** — answer lineage questions about any feature: which operations, which inputs, which parameters produced it.

## Guardrails

Every AI action is **auditable** (ADR-006): pure transformations are replayable; workspace mutations are transactional where supported; external side effects require explicit approval and declare whether they are reversible, compensatable, or irreversible. AI mutations go through the same transactional path as any client. Dataset contents are untrusted input — instructions found inside data are never executed (09).

## Development-time AI

Moved to `AI_DEVELOPMENT.md`, deliberately outside the constitution — models and agent practices change faster than architecture. The runtime product stays provider-neutral.

## Action traces

Local action traces (03) improve in-session assistance — the AI learns the platform's API from how it is used. Any external collection, for evaluation or training, is **explicit, redacted, and opt-in** (09). User workflows and project data never become training material by default.
