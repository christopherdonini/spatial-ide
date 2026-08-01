# ADR-007 — Local Mutable Store and Editing Transaction Model

**Status:** Accepted — 2026-07-31

## Context

DuckDB is an excellent analytical engine, optimized for bulk/analytical workloads — not for many small interactive transactions. Using it as the fine-grained editing store would fight the tool.

## Decision

| Store | Role |
|---|---|
| **DuckDB** | Analysis, joins, aggregation, querying GeoParquet, temporary/materialized analytical results |
| **SQLite / GeoPackage (local delta store)** | Local mutable workspace, fine-grained feature edits, small transactions |
| **PostGIS** | Remote system of record, enterprise transactions, shared data |

Edited deltas overlay immutable GeoParquet and are compacted later; DuckDB queries across both. Transactions are delegated to the store that owns the mutation (per ADR-002 — transaction machinery is never reinvented).

## Consequences

- Undo, crash recovery, and editing semantics simplify: the delta store's transaction log is the workspace-mutation log (ADR-006).
- Requires stable feature IDs across edits, snapshots, and compaction (11).
