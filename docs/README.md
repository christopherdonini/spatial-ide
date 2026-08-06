# Spatial IDE — Project Constitution

Stable reference set for humans and AI assistants working on Spatial IDE. Read `00` and `01` before anything else. Cite documents by number (e.g. "per 01, derived rule 2").

## Index

| Doc | Scope | Stability |
|---|---|---|
| [00_Vision](00_Vision.md) | Why this project exists | Changes rarely |
| [01_Principles](01_Principles.md) | 8 first principles + derived rules | Almost never changes |
| [02_Architecture](02_Architecture.md) | Kernel, protocol, modules, projects | Changes via ADR |
| [03_UX](03_UX.md) | Modes, palette, notebooks, linting | Evolves |
| [04_AI_and_MCP](04_AI_and_MCP.md) | AI architecture, MCP, permissions | Evolves |
| [05_Data_Engine](05_Data_Engine.md) | DuckDB, Arrow, formats, CRS | Evolves |
| [06_Rendering](06_Rendering.md) | GPU renderer, labels, styles | Evolves |
| [07_Roadmap](07_Roadmap.md) | Phases, hero slice, non-goals | Changes often |
| [08_Testing](08_Testing.md) | Benchmark matrix, corpus, CI | Evolves |
| [09_Security_and_Privacy](09_Security_and_Privacy.md) | Capability grants, threats, telemetry | Evolves |
| [10_SKP_Protocol](10_SKP_Protocol.md) | Semantic API, control/data plane | Changes via ADR |
| [11_Project_and_Resource_Model](11_Project_and_Resource_Model.md) | Typed resources, ResourceRef, reproducibility | Changes via ADR |
| [12_Plugin_Runtime](12_Plugin_Runtime.md) | Sandbox, capabilities, lifecycle | Evolves |
| [13_Workflow_IR_and_Notebooks](13_Workflow_IR_and_Notebooks.md) | Workflow IR, reactive notebooks | Evolves |
| [14_Governance_and_Licensing](14_Governance_and_Licensing.md) | License, open-core boundary, governance | Changes via ADR |

## Conventions

- Architectural decisions are recorded as ADRs in `adr/` (numbered, immutable once accepted; amendments are appended, never rewritten). Accepted: ADR-001 (amended), ADR-002 (amended), **ADR-003** (renderer + arbitrary CRS — accepted for Windows/WebView2 on the concluded EPSG:2056 spike evidence; macOS/Linux accepted at architecture level only, pending hardware validation — see 07), ADR-004–008, **ADR-010** (render frames, origins, and boundary rules — measured invariants from spike M2/M3/M4; architect-blockable in review), **ADR-015** (source CRS requirement and caller assertion — accepted 2026-08-05 after the §8 identity split; architect-blockable). **Proposed: ADR-011** (tiled render batches and GPU cache lifecycle — the *unmeasured* implementation direction split out of ADR-010's first draft; binds nothing and is **not** architect-blockable until its acceptance gates are met), **ADR-012** (data-plane transport — no measurement selects a candidate; status withheld twice), **ADR-013** (typed coordinate spaces and provenance — the vehicle ADR-010's OPEN block names; **must be accepted before the editing plugin's digitizing path is built**, per that block's own deadline), **ADR-016** (stable feature identity admission and source-key mapping — split out of ADR-015 §8 on 2026-08-05 so that accepting a CRS policy does not silently accept an identity policy; its Context states what the implemented check does *not* establish — dataset-wide uniqueness, stability across reopen), **ADR-017** (static bundle format and publish semantics — the contract for the artifact ADR-008's publishing clause names; the project's first persisted artifact, so it is where `docs/11`'s ResourceRef model and ADR-005's grades **would be discharged on acceptance**; **binds nothing and is not architect-blockable**). Also proposed and **not applied**: an **appended amendment to ADR-003** (`PROPOSED-amendment-to-ADR-003-projected-canvas-publishing.md`) proposing that a published bundle renders on the *projected* canvas when its source CRS is not web-Mercator-ready, MapLibre remaining the publishing canvas for web-ready sources — drafted as its own file so that accepting ADR-017 cannot silently accept a change to ADR-003, the same split ADR-015/016 and ADR-010/011 were given. **Open: ADR-009** (license and open-core boundary — see 14, before any public code). **Reserved: ADR-014** (data-plane stream concurrency and admission control — the question ADR-012's N=2 result left open; not yet drafted).
- Development-time AI practices live in `AI_DEVELOPMENT.md`, deliberately outside the constitution.
- Unresolved decisions are marked inline as `> OPEN:` blocks. Each names the doc/phase where it must be resolved.
- Changing 01 requires an ADR explaining why a first principle failed.
