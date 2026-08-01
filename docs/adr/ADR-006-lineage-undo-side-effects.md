# ADR-006 — Lineage vs Undo vs External Side Effects

**Status:** Accepted — 2026-07-31

## Context

"Transactional undo/redo falls out of the DAG" was too optimistic. A lineage DAG explains how derived outputs were produced. It does not undo an edit to a remote PostGIS table, an overwritten file, a published map, an external API call, a credential change, or a nondeterministic operation.

## Decision

Three operation classes, each with its own machinery:

| Class | Examples | Machinery |
|---|---|---|
| **Pure transformations** | input snapshots + parameters → derived output | Lineage DAG: cacheable, replayable |
| **Workspace mutations** | feature/style/notebook/config edits | Command/event log, transaction boundaries, MVCC or snapshots (ADR-007) |
| **External side effects** | export file, publish map, remote DB write, network request | Audit log; explicit approval; declared **reversible / compensatable / irreversible** |

Guardrail wording (replaces "every AI action is reproducible and revertible"):

> Every AI action is **auditable**. Pure transformations are replayable; workspace mutations are transactional where supported; external side effects require explicit approval and declare whether they are reversible, compensatable, or irreversible.

## Consequences

- Undo is honest: users are never told something is revertible when it isn't. This distinction is central to trust.
- Workflow IR steps (13) declare their side-effect class; the permission system (09) gates class 3.
