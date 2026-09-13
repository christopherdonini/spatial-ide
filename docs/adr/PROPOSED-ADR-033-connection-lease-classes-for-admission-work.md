# PROPOSED ADR-033 — Connection lease classes for per-request admission work

**Status:** Proposed — **decision deliberately open; binds nothing.** Drafted 2026-09-13 by the architect agent on the custodian's brief while preregistering the "filter-and-hover polish" piece (DECISIONS-PENDING entry 87); filed on `polish/filter-and-hover` for the human's sight. Accepted only on the human's word. Number: 031 is reserved for LOD, 032 is filed; 014 stays reserved.

**Would decide:** how the engine's connection pool serves short, per-request admission work, so that a lease failure is reported as what it is.

## Context

`engine/src/pool.rs:129-152` declares two lease classes; `Maintenance` is documented as *"whole-file maintenance passes — today, an index build"* with capacity 1 (`:94-99`). Predicate admission — a short, per-request, control-plane check — was folded into that class for a good reason (`engine/src/predicate.rs:96-103`: no ad-hoc connections, nothing leaves the crate), but it is not a whole-file pass. The consequence, observed as DECISIONS-PENDING entry 87 (diagnosed 2026-09-13): concurrent `viewport_query` admissions under a row filter collide at capacity 1 and the losers are refused as binder rejections (`predicate.rs:118-122`, doc `:240-242` → `skp.filter_rejected_by_binder`, `kernel/src/skp.rs:749-753`), which the shell then discards. The pool never blocks or queues by design (`pool.rs:251-255`), and ordering the stream lease against the binding's permit is reserved to ADR-014 (`pool.rs:72-78`) — this question is neither.

## Decision (the engine half has landed on `polish/engine-lease-class`, per entry 91 (a)'s ruling; Acceptance below is unchanged — this ADR stays Proposed until the human's word)

The pool now declares **three** lease classes, each its own capacity, each a **chosen ceiling under ADR-010 rule 6** — declared, not discovered or measured:

- **`LeaseClass::Stream`** — `MAX_STREAM_CONNECTIONS = 4` (`engine/src/pool.rs:92`). One streaming query. Unchanged by this ADR.
- **`LeaseClass::Maintenance`** — `MAX_MAINTENANCE_CONNECTIONS = 1` (`engine/src/pool.rs:99`). A whole-file pass — today, an index build, and `Dataset::open`'s own one-time admission work. Unchanged by this ADR.
- **`LeaseClass::Admission`** — `MAX_ADMISSION_CONNECTIONS = 4` (`engine/src/pool.rs:125`), new. Bounds the concurrent per-request predicate admissions (`engine/src/predicate.rs`'s three admission stages) one binding can present at once: the shell's declared tile-stream concurrency, `MAX_IN_FLIGHT_TILE_STREAMS = 3` (`frontends/shell/src/canvas/tileGridConstants.ts:38`), plus the baseline (non-tiled) viewport query, `1` — `3 + 1 = 4`. **This is admission-side capacity, not stream concurrency, and does not pre-empt reserved ADR-014**: it says nothing about how many *streams* a binding may run concurrently (that is `MAX_STREAM_CONNECTIONS`) or about the lease/permit release ordering ADR-014 owns (`pool.rs:72-78`, unchanged).

`MAX_PHYSICAL_CONNECTIONS` (`engine/src/pool.rs:129-131`) is re-derived as the sum of all three. `engine/src/predicate.rs`'s `AdmittedPredicate::admit` leases `Admission` instead of `Maintenance`; a residual exhaustion of that class is `EngineError::ConnectionsExhausted { class: "admission", capacity: 4 }` — never a binder rejection — which already maps to `engine.connections_exhausted` (`kernel/src/skp.rs:677-680`; SKP-V0's `engine.` + variant-name rule, `protocol/skp/SKP-V0.md:266`): **no wire change, no new `skp.*` code.** Alternatives weighed and rejected, unchanged from filing: raising `MAX_MAINTENANCE_CONNECTIONS` (conflates two budgets the header split on purpose); serializing admission (breaks the never-block contract and lands in ADR-014's territory); a bounded retry inside `admit` (hides a ceiling behind a spin).

**One recorded gap, engine-only scope.** `admit`'s own Rust return type (`PredicateAdmitError`, `engine/src/predicate.rs`) now distinguishes a lease-capacity failure from all eleven `FilterError` admission-content refusals at the type level, and this is verified directly by this ADR's own acceptance tests. `kernel/src/skp.rs`'s `build_viewport_query`/`filter_error_of` were **not** changed (this piece's build scope is engine-only), so the one existing external call site still compiles by folding `PredicateAdmitError::ConnectionsExhausted` back into `FilterError::RejectedByBinder` at that boundary (`engine/src/predicate.rs`'s own `From` impl, documented there as exactly this gap). At the declared ceiling this is composition-unreachable for the shipped shell (below), so no acceptance test in this piece exercises it, but a caller could in principle still see a mislabeled refusal there until a follow-on kernel change routes `PredicateAdmitError::ConnectionsExhausted` through `error_of` instead. Recorded here as the honest state of the wire-level claim, not asserted as closed.

## Consequences

One more physical connection per open dataset; three declared ceilings under ADR-010 rule 6 instead of two; no SKP surface change; ADR-021's eleven-code list untouched; the entry-87 refusal is truthful at the engine's own type boundary and, at the declared size, unreachable in composition for the shipped shell (three tile streams plus one baseline) — so the kernel-routing gap noted above has no shipped-composition consequence today. Raw material for ADR-014 either way — the finding is appended to `pool.rs`'s existing note rather than cited as evidence for anything else.

## Acceptance

On the human's word, after the polish piece's engine half lands with its tests (the concurrent-admission test; the lease-failure-surfaces-as-`ConnectionsExhausted` test) and the architect gate affirms it.
