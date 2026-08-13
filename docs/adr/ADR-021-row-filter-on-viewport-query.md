# ADR-021 — A Row Filter on `viewport_query` (SKP v0.1)

**Status:** **Accepted — 2026-08-13, by the human**, carrying the acceptance condition below.
Immutable from this acceptance; corrections are dated corrigenda. It was implemented ahead of
acceptance under already-accepted ADR-004's license and within `docs/07`'s Prototype hero-slice
scope, the ADR-019/ADR-020 precedent (all three were implemented as Proposed code before their own
acceptance — the same standing on which `protocol/data-plane`'s WebSocket adapter itself proceeds
under ADR-012's still-provisional status). With acceptance, the pre-acceptance prohibitions lift:
the surface may now be described as SKP v0.1 and is subject to whatever conformance SKP-V0 defines.

**Acceptance condition (human, 2026-08-13 — binding):** the named batches-may-be-empty shortfall
below **carries forward as a binding obligation on the filter-panel cut**. Before any user-facing
filter UI ships, the panel must present **liveness and a working cancel affordance during
zero-batch filtered scans** — indeterminate progress plus a cancel that actually cancels is the
acceptable interim. True scan-progress reporting remains the named debt against **SKP-V0 §4.5**,
to be resolved there or explicitly re-deferred with a stated reason; it is never silently dropped.
A user typing a selective filter and staring at a silent canvas is `docs/01` principle 7 bleeding
through a UI we chose to ship, and this condition exists to prevent exactly that.
**Drafted by:** the architect design consult for the `cut/sql-filter` branch (2026-08-13), per
CLAUDE.md's architect-first workflow rule, filed from that consult's skeleton by this cut's own P6
docs piece.
**Related:** ADR-004 (control/data-plane split), ADR-006 (undo classes — this decision is class 1),
ADR-010 rule 6 (declared ceilings), ADR-016 (stable feature identity — the identity-alias refusal
this ADR names is written against ADR-016 §3's `Mapped` identity), ADR-019 (control-plane admission
tickets — the ticket this decision rides), `docs/09` (the security boundary this decision's
Consequences carries), `docs/11` (typed resources, ResourceRef — why this decision is deliberately
not one), `SKP-V0.md` §7 (the wire-level document this ADR's Decision underlies).

## Context

`docs/07`'s Prototype hero slice is "open a 5 GB GeoParquet → filter in SQL → style it → publish a
static interactive bundle." The second verb, filter in SQL, had no SKP surface: `viewport_query`
admitted a bounding box and a row limit, nothing that lets a caller narrow *which rows* stream at
all. The cut this ADR documents (`cut/sql-filter`) built that surface, admission for it, and its
composition into the engine's own query text.

Three facts bounded the design before any code was written:

1. **A predicate is caller-authored SQL text reaching a control-plane command.** Unlike a bbox
   (four floats) or a limit (one integer), a predicate's *shape*, not just its value, is untrusted
   input — the same class of surface `docs/09`'s posture treats as needing an explicit boundary, not
   an implicit trust that whatever a caller sends is safe to compose into a query.
2. **`docs/11`'s ResourceRef model and ADR-016's "stability across reopen" question are both
   unsatisfied.** A filtered result cannot be a new addressable, reproducible resource without
   answering questions this ADR does not attempt (see "What this ADR does not decide").
3. **No performance claim can attach to this slice.** `docs/07`'s ZERO-performance-claims scope for
   this op, and ADR-011's still-unmeasured status, both apply; nothing here is a `docs/08` claim.

## Decision

**`viewport_query` gains one optional parameter, `filter: Option<{predicate: String, dialect:
String}>`. No new command. No derived-dataset handle.**

1. **Parameter shape, not a new command or a derived handle.** A `sql` command, or a command that
   returns a handle naming "this dataset, filtered," were both considered and rejected: `docs/11`'s
   ResourceRef model and ADR-016's reopen-stability question are unsatisfied for anything that would
   need to be reproducible or stable across a session — a handle would claim resource-hood this slice
   cannot back. A parameter on the command that already streams rows makes the filter exactly what it
   is: a per-request shaping of one `viewport_query` call, never a new addressable thing.
2. **Version: `skp/0.1`, compared with `==`.** `skp/1` stays RESERVED for `docs/07`'s 1.0 freeze.
   Every fixture on both the Rust and TypeScript sides of the wire was updated in the same commit
   that bumped the literal, and `deny_unknown_fields` stays on every derived struct in both
   directions — schema evolution happens exactly once, as a version bump, never as a tolerant reader.
3. **`predicate` is a boolean expression, never a statement and never a `SELECT`.** The dialect field
   exists so a future second dialect gets its own version string rather than silently changing what
   `duckdb-expr/0` means; v0.1 admits exactly one value.
4. **Composition rule, stated as a string and tested as one**: `WHERE (<predicate verbatim>) AND
   <bbox> [AND <ranges>]` — exactly two transformations (one added paren pair, predicate leftmost).
   Every condition the query plan itself contributes is `AND`-appended after the predicate, never
   before. The predicate's text is never rewritten, normalized, or case-folded.
5. **Namespace rule**: `describe.schema` minus the geometry column minus any column whose type is not
   admitted for filtering — an unqualified name; the predicate never names a table, and it may never
   reference the geometry column (a predicate selects rows, it does not touch geometry — no `ST_*`,
   no CRS name, no reprojection is reachable through this surface at all).
6. **Three-stage validation, pre-lease and pre-mint, on `spawn_blocking`, each stage gating the
   next**, with **DuckDB's own parser** (`json_serialize_sql`) doing the structural parse — a second
   SQL grammar (a hand-rolled lexer) is not admitted, at any stage:
   1. *Structural admission* — the predicate is parsed by DuckDB itself and the returned expression
      tree is walked against a declared, allowlist-shaped construct list; every match arm names an
      admitted construct, and the final arm of every match refuses whatever it cannot name.
   2. *Namespace admission* — every column name the walk collected is checked against the dataset's
      resident schema (rule 5).
   3. *Bind admission* — the predicate is prepared against a zero-row, typed surrogate relation, and
      its inferred type is asserted `BOOLEAN`; an implicit coercion (int-to-bool or otherwise) is
      refused rather than silently accepted, per `docs/01` principle 8.
7. **Declared ceilings** (ADR-010 rule 6, declared not discovered): a byte ceiling on the predicate's
   own text, checked before the text ever reaches DuckDB's parser, and a depth ceiling on the parsed
   expression tree, checked during the walk. Two independent ceilings because they bound two
   different things: redundant grouping parentheses cost the parsed tree zero extra depth (measured),
   so a "paren bomb" built purely of nesting is caught by the byte ceiling, not the depth one; the
   depth ceiling instead bounds genuine nesting (`NOT`-chains, alternating `AND`/`OR` behind explicit
   parens) independent of text length.
8. **Eleven `skp.filter_*` refusal codes, exhaustive, no wildcard arm**: `filter_dialect_unsupported`,
   `filter_unparsable`, `filter_not_a_single_expression`, `filter_construct_not_admitted`,
   `filter_unknown_column`, `filter_column_not_filterable`, `filter_identity_alias_ambiguous`,
   `filter_not_boolean`, `filter_too_long`, `filter_too_deep`, `filter_rejected_by_binder` — each
   with its own named fields (`SKP-V0.md` §7.5's table). A twelfth failure mode is a build error
   until it is mapped into this list by name, the same discipline `error_of` already applies to
   `EngineError`; nothing here is a `String`-flattened catch-all.
9. **A differential two-sentinel admission probe closes the composition-escape class.** The predicate
   is parsed *twice*, wrapped with two distinct sentinel comparisons (`... AND 1=1` /
   `... AND 2=2`) standing in for the real `AND <bbox>` composition always supplies in that position,
   and admission requires both parses to independently resolve to a top-level `AND` ending in *their
   own* sentinel, with every operand before it identical between the two parses. **The escape this
   closes**: a predicate whose own text closes the admission wrapper's paren early — via an
   unbalanced paren, a trailing `--`/`;--` comment, or a forged trailing `1=1` of its own — can pass
   a naive structural check and then *reassociate* once real composition's own `AND <bbox>` lands
   after it, bypassing the bbox condition or eating the query's own `LIMIT` entirely. This was found
   and closed across **three adversarial reviews** of this cut (a paren/comment escape against the
   original bare wrapper; a comment-forgery escape against a first, single-sentinel fix; a third,
   independent adversarial re-review — 16 escape attempts refused, 10 legitimate predicates composed
   and streamed end-to-end with zero bbox bypasses and zero limit drops — that found no further
   survivor). The soundness argument is structural, not enumerative: the two wrapped probe texts
   differ only in their sentinel's own trailing digits, so a rightward escape truncates or
   reassociates both probes at the *same* textual position, and no single predicate text can
   independently end in both sentinels' distinct values at that position.
10. **Zero data-plane change.** The predicate rides the ticket mint (ADR-019); `TAG_START` stays
    ticket-only; the diff under `protocol/data-plane/` for this whole cut is empty, confirmed by
    `git diff` both before and after.

## Consequences

- **Security property (human-directed record): the predicate-admission parser is statically linked,
  and admission performs no runtime extension fetch of any kind.** Admission's structural stage
  (`json_serialize_sql`) runs on untrusted, caller-authored SQL text on the control path, and it must
  acquire its own parser at **build time**, never via DuckDB's runtime extension autoload — autoload
  would make the *first* admitted predicate cause a filesystem write to the extension directory and,
  for a non-bundled extension, a network fetch, which is an unacceptable runtime dependency for a
  component whose entire job is to bound what untrusted input can do. `engine/Cargo.toml` links
  DuckDB's own `json` feature statically (`duckdb = { features = ["bundled", "parquet", "json"] }` —
  no new crate, more of DuckDB's own vendored sources) specifically so `json_serialize_sql` is a
  build-time-resident, built-in function; a CI failure surfaced the latent runtime fetch (a fresh
  runner's extension-autoload attempt failing "Access is denied"), but the property recorded here is
  the reason for the fix, not the red build that happened to reveal it.
- **The construct allowlist is the `docs/09` boundary that stops a dataset-scoped grant from becoming
  arbitrary local-file read.** A capability grant that authorizes "read dataset A" must not become
  "read any local file" because a filter predicate can name `read_csv('c:/...')` or any other table
  or scalar function in a subquery — refusing every subquery and every function call outside two
  small, named sets (arithmetic, `LIKE`/`ILIKE` with a literal pattern) is what keeps that promise;
  this is a `docs/09` security boundary, not a style preference, and the code says so at the
  refusal site.
- **ADR-006 class 1 (pure transform).** A filter selects rows; it never mutates the workspace, never
  performs a side effect, and is fully replayable from its own predicate text — nothing here is
  undoable because nothing here is a workspace mutation, an external side effect, or anything ADR-006
  classes above 1.
- **Named batches-may-be-empty shortfall, not papered over.** A selective predicate over a large file
  can emit no batches for a long time. Progress on `viewport_query` is data-plane-batches-only
  (`SKP-V0.md` §4 item 5) — there is no other progress signal a filtered scan can emit — so `docs/01`
  principle 7's progress clause is **unmet** for a filtered scan whose predicate matches late, and
  `docs/08`'s first-pixels budget is **structurally unreachable** for such a predicate: there is
  nothing to measure "first pixels" against until a matching row is found. This is a property of the
  surface, not a bug to be silently absorbed.
- **Identity, CRS, and geometry are unchanged.** A filter selects rows; it never re-keys a projection
  (`AdmittedPredicate` composes into an existing `SELECT`, never a new one), never reprojects, cannot
  name a CRS, and admits no `ST_*` construct — the geometry column itself is refused as a filterable
  column outright (`skp.filter_column_not_filterable`).
- **New control-plane attack surface: caller-authored SQL text, now bounded rather than absent.**
  Before this ADR, `viewport_query`'s only caller-controlled text was a dataset name already resolved
  through the catalog. Predicate text is a materially different kind of input — the allowlist,
  namespace check, bind check, declared ceilings, and the differential sentinel probe together are
  what bound it, not any single one of them alone.
- **Cancellation is unchanged and stays a property, not a timed claim.** ADR-018's instant labels
  apply exactly as before; a filtered stream's cancellation reaches the producer the same way an
  unfiltered one does, asserted as REACHED, never as a duration.

## What this ADR does not decide

- **Derived views or a `ResourceRef`-shaped handle for a filtered result.** `docs/11`'s typed-resource
  model and ADR-016's "stability across reopen" question are both unsatisfied; a filter stays a
  per-request parameter, never a named, addressable thing.
- **Materialization of a filtered result** to any store, cache, or intermediate file.
- **Full `SELECT` support** — projection lists, aggregation, joins, or any construct beyond a single
  boolean expression over one dataset's own admitted namespace.
- **Spatial predicates.** No `ST_*` construct is admitted; a predicate cannot reference geometry at
  all, filterable or otherwise.
- **A general, extensible function allowlist.** The two named sets (arithmetic, `LIKE`/`ILIKE`) are
  fixed by this ADR, not a starting point for an open-ended admitted-function registry.
- **A `sql` command**, or any surface broader than one optional parameter on one existing command.
- **MCP exposure.** Nothing here says a predicate parameter is reachable from, or safe to expose to,
  an AI agent or any MCP adapter — `docs/04`'s AI/MCP architecture is untouched by this decision.
- **Predicate persistence** — in a project file, a lineage record, or anywhere durable. A predicate
  lives for the lifetime of one `viewport_query` call and nowhere else.
- **Any performance claim.** No number, no "fast," no `docs/08` conformance claim of any kind — this
  ADR's Context states why none is made, and the named shortfall above states the one property that
  is structurally unmeasurable for a late-matching predicate, not merely unmeasured yet.

## Open

- **The filter-panel liveness/cancel obligation** — the acceptance condition above. Binding on the
  filter-panel cut before any user-facing filter UI ships; the SKP-V0 §4.5 scan-progress debt it
  points at is resolved there or explicitly re-deferred with a reason, never dropped.
- **macOS/Linux hardware validation** for the surface this predicate composes against — inherited
  from `docs/07`'s own still-open item, not reopened or narrowed by this ADR.

*(Resolved at acceptance: the pre-acceptance "may not be described as an SKP capability / no
conformance claim" restriction — lifted 2026-08-13 by acceptance.)*
