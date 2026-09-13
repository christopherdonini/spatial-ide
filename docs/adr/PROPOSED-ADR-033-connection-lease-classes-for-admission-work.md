# PROPOSED ADR-033 — Connection lease classes for per-request admission work

**Status:** Proposed — **decision deliberately open; binds nothing.** Drafted 2026-09-13 by the architect agent on the custodian's brief while preregistering the "filter-and-hover polish" piece (DECISIONS-PENDING entry 87); filed on `polish/filter-and-hover` for the human's sight. Accepted only on the human's word. Number: 031 is reserved for LOD, 032 is filed; 014 stays reserved.

**Would decide:** how the engine's connection pool serves short, per-request admission work, so that a lease failure is reported as what it is.

## Context

`engine/src/pool.rs:129-152` declares two lease classes; `Maintenance` is documented as *"whole-file maintenance passes — today, an index build"* with capacity 1 (`:94-99`). Predicate admission — a short, per-request, control-plane check — was folded into that class for a good reason (`engine/src/predicate.rs:96-103`: no ad-hoc connections, nothing leaves the crate), but it is not a whole-file pass. The consequence, observed as DECISIONS-PENDING entry 87 (diagnosed 2026-09-13): concurrent `viewport_query` admissions under a row filter collide at capacity 1 and the losers are refused as binder rejections (`predicate.rs:118-122`, doc `:240-242` → `skp.filter_rejected_by_binder`, `kernel/src/skp.rs:749-753`), which the shell then discards. The pool never blocks or queues by design (`pool.rs:251-255`), and ordering the stream lease against the binding's permit is reserved to ADR-014 (`pool.rs:72-78`) — this question is neither.

## Decision (deliberately open at filing; the candidate is the polish preregistration's §2.3 (ii))

Per-request admission work gets its own declared lease class, sized to the concurrent admissions a binding can present (≥ `MAX_STREAM_CONNECTIONS`), with `MAX_PHYSICAL_CONNECTIONS` (`pool.rs:102`) re-derived and the new ceiling declared at its site with the quantity it bounds (ADR-010 rule 6); a residual failure is `EngineError::ConnectionsExhausted { class, capacity }` — never a binder rejection — which already maps to `engine.connections_exhausted` (`kernel/src/skp.rs:677-680`; SKP-V0's `engine.` + variant-name rule, `protocol/skp/SKP-V0.md:266`), so no wire change and no new code. Alternatives to weigh: raise `MAX_MAINTENANCE_CONNECTIONS` (conflates two budgets the header split on purpose); serialize admission (breaks the never-block contract and lands in ADR-014's territory); a bounded retry inside `admit` (hides a ceiling behind a spin).

## Consequences

One more physical connection per open dataset; one more declared ceiling under ADR-010 rule 6; no SKP surface change; ADR-021's eleven-code list untouched; the entry-87 refusal becomes truthful and, at the declared size, unreachable in composition for the shipped shell (three tile streams plus one baseline). Raw material for ADR-014 either way — the finding is appended to `pool.rs`'s existing note rather than cited as evidence for anything else.

## Acceptance

On the human's word, after the polish piece's engine half lands with its tests (the concurrent-admission test; the lease-failure-surfaces-as-`ConnectionsExhausted` test) and the architect gate affirms it.
