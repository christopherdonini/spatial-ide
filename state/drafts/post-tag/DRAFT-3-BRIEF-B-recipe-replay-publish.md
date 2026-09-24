> **Status: draft — Brief B (2026-09-09), for the human's review.**
> Record, not policy — moved from the untracked `RELEASE-DRAFTS-0.1.0/` directory on the human's round-14 ruling (2026-09-17); nothing here binds, and its cites are historical (advisory in `verify-cites`, never gated).

# DRAFT 3 — BRIEF B: the recipe — attributes, save/reopen, publish the intended result

*Fable, 2026-09-09. For the human's review. One design, three independently reviewable
stages (B1 → B2 → B3), each its own preregistered piece with its own gate and PR. The nine-step
walkthrough (Part O) runs only after B3 and is the ONLY place the milestone may be described as
complete. Follows Brief A. Boundaries SETTLED by the 2026-09-09 discussion; not reopenable here.*

**Branches:** `cut/recipe-b1-attributes`, `cut/recipe-b2-save-reopen`, `cut/recipe-b3-publish-v2`,
each from `main` after the previous merges. **Commits:** the signed identity command.
**Approval basis:** the settled boundaries; architect consult per stage; Draft 1 in force.

## The milestone, stated by the user's outcome (claimed only after Part O)

Open an ordinary supported file, inspect and filter it, colour it, save, reopen, and publish the
intended result. The recipe is how those actions agree — not the achievement by itself.

## Settled boundaries (binding across all stages)

1. **The recipe is a description, never a permission.** It grants no access to its named files
   and no publish authority. Replay-publish passes through ADR-024's boundary exactly like any
   publish; a completed verification job is not a reusable authorisation.
2. **Session identity and saved identity are separate.** The recipe persists the source
   **content hash** (ResourceRef identity, ADR-005) and the **identity policy** needed to
   reconstruct references (`native:id` | `mapped:<col>` | `session-ordinal`). It **never
   persists a generation, a handle, a grant, or a feature reference by ordinal**. Reopen creates
   a fresh generation. In v0.2 the recipe stores no feature-level references at all, so no
   session value can leak into save/reopen or shell/CLI agreement by construction. The
   conversion is explicit: recipe → (hash, policy, predicate, style, viewport, scope) → replay.
3. **Provisional replay is a real state**, named "preview": the saved recipe applied to
   *current* data. States: `preview` → `verified` | `mismatch` | `verification-cancelled` |
   `verification-failed`. **Only `verified` may say "verified"**, and only when the hash job
   completes under the same active generation it started under. Every admission re-runs on
   reopen — CRS, schema **types**, the predicate through all three stages, style against the
   schema — never column names alone. On mismatch the original recipe is preserved; the user
   explicitly rebinds (locate) and prepares a new version before publishing against changed
   bytes. Background hashing yields to interactive work; its disk cost is measured and reported,
   never assumed away.
4. **Save is atomic; exclusion is structural.** Temp-write, sync, rename. A cancelled first save
   leaves no file; a cancelled overwrite leaves the previous valid recipe; no truncated
   replacement ever. The schema is an explicit typed, versioned document (`spatial-recipe/1`,
   `deny_unknown_fields`) whose types cannot represent capabilities, credentials, handles, or
   generations; leakage tests serialize from a populated session and assert absence by type.
   Grepping output is supplementary evidence only.
5. **Locators are local; public provenance is portable.** Local recipe: ResourceRef identity +
   locator (relative where practical) + explicit locate/rebind when the file moves. Published
   provenance: identity only — no machine-local path. ADR-005's model reused, not competed with.
6. **Publish scope is declared**, not implied: `filtered-dataset` or `viewport`. Publishing
   re-validates the source itself (the existing publish-time pin must match the recipe's hash or
   refuse "source changed since save" at preflight) and takes its own permission grant every
   time. ADR-025's preflight applies to the filtered result.
7. **Reproducibility claims are named comparison tests over the artifact**, within ADR-017's
   declared determinism scope (execution sidecars excluded): **R0** manifest + deterministic
   payload files byte-identical; **R1** rows bag-equivalent (duplicate counts preserved);
   **R2** numeric aggregates within a stated tolerance. R-rungs are separate from ADR-005's
   provenance grades and prove nothing about source immutability.
8. **Style: connect before extending.** B1 exposes style v0's existing categorical `match`
   (named text column, null and unmatched fallbacks). Numeric classification is a separate
   design, out of scope.
9. **Filtering composes with future overviews by the current contract**: `duckdb-expr/0` admits
   no geometry references and no function calls, so every admissible predicate is
   geometry-independent. Named here so B1's projection does not widen it silently.
10. **ZERO performance claims** in any stage.

## Block-on-sight conditions (cite in every review)

- **B-1** No stage's PR, ledger, docs or release text describes the completed workflow before
  Part O; each stage states what it is and is not.
- **B-2** No generation, handle, grant or ordinal feature reference in the recipe or any
  published payload (typed schema + leakage tests + grep).
- **B-3** Non-success verification states never render "verified"; a stale job cannot promote.
- **B-4** Publish authorisation is never reused: replay-publish invokes the grant path (tested).
- **B-5** Data-plane changes (B1 only) reviewed under ADR-004: binary columns in the Arrow
  batch, no JSON, copy-minimized; the wire-bytes discipline and ADR-004 Amendment 4 intact.
- **B-6** ADR-005 ResourceRef vocabulary; no competing identity/locator model.
- **B-7** No perf claim; no duration in any walkthrough row.

## Stage B1 — named attribute projection + existing categorical styling

**Surface.** ADR-023 decided as **named-column projection on `viewport_query`**: an explicit
`columns: [..]` request (absent = `null`, never omitted); admitted types text / integer / float
/ boolean; geometry never; unknown or unadmitted columns refused by name
(`skp.projection_column_unknown`, `skp.projection_type_not_admitted`). Projected values ride the
data plane as additional Arrow columns (B-5). Hover shows the projected row beside the id (or
the pick refusal, unchanged). The style panel exposes the existing `match` rule over a projected
text column with its fallbacks; style remains ephemeral in B1.
**ADR touches.** ADR-023 acceptance text (decision: projection, types, refusals); SKP version bump
(coordinated with Brief A's — architect); ADR-004 review of the data-plane change.
**Gate.** E2E: hover shows projected attributes; a `match` style is visibly applied and
round-trips through the existing viewer (Part F's F7 pattern); identity and CRS invariants
unchanged; refusals typed. Reviewer + architect (data plane).
**Not the workflow:** no save exists; the PR says so.

## Stage B2 — recipe save / reopen / verification / rebind / cancellation

**Surface.** `spatial-recipe/1`: source ResourceRef (identity = sha256; locator = relative
path where practical; identity policy), CRS assertion + provenance class, predicate + dialect,
style document (ADR-017 §5a format), viewport, declared publish scope, recipe version,
host-attributed created/updated stamps (ADR-024 F-5 form). Save = reference Save, no whole-file scan; Prepare, a separate explicit verb (Save vs Prepare, below), is the Tier-2 acquisition (item 10's
cancellable, progress-reported hash) → atomic write. Reopen = the state machine in boundary 3
with re-admission; the "verifying source…" status; rebind action producing a new recipe version
on explicit prepare; the original preserved.
**ADR touches.** ADR-016 Amendment 1's verified tier lands here (Brief A defined it); ADR-006
class-2 for save; docs/11 gains the reproducibility ladder (R0/R1/R2 as comparison tests).
**Gate.** Atomic-save tests (cancel-first → no file; cancel-overwrite → previous intact;
simulated crash → no truncated file). Leakage tests by type. State-machine tests: each
non-success state never displays "verified"; a job started under generation G cannot promote
after G is invalidated. Re-admission tests: a column type change with unchanged names → typed
mismatch. E2E save → reopen → preview → verified. Walkthrough rows for the felt states (no
durations). Reviewer + architect (class-2, docs/11).
**Not the workflow:** publish still ignores the filter; the PR says so.

## Stage B3 — bundle v2 and CLI replay through the same publishing implementation

**Surface.** The renumbered filtered-subset ADR: `bundle_version 2` manifest carrying hash,
predicate + dialect, scope, CRS provenance class, identity policy (never a generation),
redacted provenance (no locator). ADR-017 §14 reader accepts degrees under the declared
equirectangular convention; the viewer renders the filtered result. Publish re-validates the
source (pin must equal the recipe hash) and takes its grant each time. CLI:
`spatial replay <recipe> --publish <dir>` on the **same kernel publish implementation** (asserted
by test — no second code path), interactive stdin approval route (exists), and its own ADR-017
exposure review as a new surface (human).
**ADR touches.** The bundle_version-2 ADR (Proposed → human acceptance); ADR-017 §14 amendment;
ADR-025 preflight over filtered results; ADR-024 exposure review for the CLI surface (human).
**Gate.** Reader conformance for v2. R0: shell publish vs CLI publish of the same recipe →
manifest + deterministic payload files byte-identical within ADR-017's scope; R1: bag-equivalent
rows; R2: any numeric aggregate within its stated tolerance. B-4 test: replay-publish after a
`verified` replay still invokes the grant path. Redaction test: no locator in any published
byte. Reviewer + architect; the exposure review is the human's.

## Part O — the nine-step walkthrough (after B3 only; operator-verified; no durations)

Two corpus files — one projected with integer ids, one CRS84 with string ids and no id column:
(1) open — map, provenance class, identity statement; (2) inspect — projected attributes on
hover; (3) filter — a `duckdb-expr/0` predicate, count shown; (4) colour — the existing `match`;
(5) save — the reference recipe, no whole-file scan; prepare (explicit) — cancel mid-hash writes nothing, typed; complete records the prepared revision; (6) reopen —
preview immediately, filter/style/viewport restored, promotion to `verified`; (7) mutate the
source, reopen — "source changed since save", attribute parts applied, identity parts declared
invalid, original recipe intact, rebind offered; (8) publish, scope = filtered dataset —
`bundle_version 2`, no local path, viewer renders the filtered result, over-ceiling refuses at
preflight; (9) CLI replay — R0/R1/R2 tests pass against the shell's artifact. The milestone
sentence is written into the record only when Part O's log carries the human's verdict.

## Save vs Prepare — proposed amendment to B2/B3 (recorded 2026-09-18)

Recorded 2026-09-18 from the human's handoff `HANDOFF-2026-09-18-source-consistency.md` (kept outside the repository); this tracked text is the record.

### Accepted product direction (the human, 2026-09-18)

Two verbs, kept distinct:

- **Save** — preserves the workspace/reference recipe: source locators (ADR-005 ResourceRef), the identity policy, workspace state (predicate, style, viewport, scope), and any **explicitly labelled structural observation available without a whole-file scan** — the four-component descriptor with its declared degradations, labelled as a *change-detection observation*, never as stable identity or proof the bytes are unchanged. Save performs **no whole-file scan** (say that, not "instant"). Reproducibility rung: best-effort, shown.
- **Prepare** — explicitly **acquires or selects** a stable, content-addressed revision for operations that require verified inputs. An already-managed immutable revision is selected, not copied again. Prepared operations **read the installed immutable artifact**; rebinding a preview to it creates a **new generation**; hashing a copy never upgrades a session still reading the mutable original. The guarantee actually established is recorded per artifact; **"Exact" is claimed only when ADR-005's full requirements hold** — immutable input identity, coherent acquisition, and reproducibility of the whole workflow are three distinct claims.
- **What requires Prepare**: publish-from-recipe, CLI replay that claims R0/R1/R2, and editing's base revision. **What does not**: ordinary CLI source queries, preview replay, reference Save — a CLI read is never silently a preparation.

### Awaiting preregistration (not decided here)

- **Acquisition**: the protected-handle capture (write-exclusive open; read through the same handle; protection retained through validation; atomic install; explicit rebind) is *one prospective Windows implementation*, a candidate for supported ordinary files.
- **Costs and lifecycle**: peak additional disk derived from the actual lifecycle (a temp file renamed into place is not automatically a second full copy; retained old revisions, partial captures and LOD tiers are counted) with its own preflight declared at its own site — the LOD disk rule is not borrowed as authority. "Preview does not wait for preparation" is the promise; scheduling, contention and cancellation are verified, not assumed. **Retention**: prepared artifacts referenced by saved work have an explicit retention policy and are never collected as disposable render cache.
- **Schema**: the recipe gains a `verification` field (`reference` | `prepared{hash, guarantee}`); B3's publish-from-recipe refuses by name without a prepared input.

## Non-goals

Numeric classification · geometry predicates · multi-layer recipes · editing · ordinal identity
for partitioned sources · notebooks/IR · MCP/plugin surfaces (each needs its own exposure review)
· any docs/08 row · any perf number.

## Open questions — routed

**Architect:** SKP bump coordination with Brief A; the projected-column type allowlist's
edges (timestamps, decimals); the recipe's relative-path base; the background-hash yield
mechanism; how `mismatch` interacts with residency; whether B2's verification job needs a
kernel-side operation id (non-authorising, never derived from a handle) or can remain
client-tracked — implementation-level unless it becomes a wire change.

**Human:** ADR-023's acceptance text (B1); the bundle_version-2 ADR acceptance and ADR-017 §14
amendment (B3); the CLI exposure review (B3); whether recipes record host-attributed
author stamps (privacy — user-visible); the default publish scope shown in the panel
(user-visible default).
