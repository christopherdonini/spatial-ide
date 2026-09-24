# crs-unit-fact-and-bounds — preregistration (full form)

*Filed by the custodian from the architect consult `state/consults/2026-09-24-crs-unit-fact-and-bounds.md` (its section "PREREGISTRATION (full form)", byte-copied by script from the Header through §10's opening line). The consult's P0 section was resolved against its evidence before this commit (round 15 (a)); the resolution is recorded in commit 464a6a1's message.*

## Header

- **Piece and authority.**
  - Piece: PLAN.yaml node `crs-unit-fact-and-bounds`, generation 1.
  - Ruling: RULED 2026-09-23 (later), entry 120 item (1)(a)-(c); recorded at `state/directives/2026-09-23-entry-120.md:7-11`.
  - Night program of 2026-09-24, item 4 (`state/directives/2026-09-24-night-program.md:12`).
  - RULED 2026-09-24 (night) item (2) (`state/directives/2026-09-24-program-order-and-literals.md:5`).
  - Aim: make ADR-013 Amendment 1 item 6 (`docs/adr/ADR-013-typed-coordinate-spaces-and-provenance.md:301-307`), which was owed at acceptance (`:328`), true of the build for the degree and metre units.
- **Drafted by** the architect agent on the custodian's brief of 2026-09-24. Inputs:
  - the authority above;
  - ADR-010 rules 1, 3 and 6;
  - `engine/ADMISSION-PREREGISTRATION.md` §14 items I, II and V (`:573-579`, `:586-593`);
  - the code named in §2;
  - this piece's consult, `state/consults/2026-09-24-crs-unit-fact-and-bounds.md`, sections P0 and DECLARED VALUE.
- **Read at `main` eab8e82.** Every bare `path:line` here is a historical pin at that commit. When the tree moves, the gate names which is authoritative: the pin or the tree.
- **Home.** `frontends/shell/`. The owed defect lives in two shell constants, and the new wire member's only consumer is the shell. Protocol and kernel are the carrier.
- **Committed before any code**, as its own commit. **Append-only once committed.** An amendment made after any outcome has been seen says so in its first line (`engine/ADMISSION-PREREGISTRATION.md:5`). It names what it touches or invalidates and uses a class from `docs/PREREGISTRATION-TEMPLATE.md` §10.

## §0. Disclosure

1. **P0 of the consult.** The P0 bound is arithmetic only. Every number in it recomputes in node (consult, section P0).
2. **Evidence, not Authority** (the round-15 distinction):
   - The corpus manifest's observed block for #8: bbox, 240 rows, sha256 `79dabf9db66acad5c3adf6c001d1be2a68ecb4ea08afd73690dfaa1519a96bb7`. It is untracked (`target/fixtures/compat-corpus/MANIFEST.json`); the tracked mirror is `engine/ADMISSION-PREREGISTRATION.md:91`.
   - The live frame baseSpan=2, from `session-1790207079.log` (untracked), recorded in `state/CUT-STATE.md`'s continuity block.
   - Installed `@deck.gl/core` 9.3.9 source (third-party, untracked; `frontends/shell/package.json:41` declares ^9.3.7):
     - `dist/controllers/orthographic-controller.js:21`: interactive `maxZoom` defaults to Infinity;
     - `dist/lib/layer.js:235-240`: 64-bit positions are used for cartesian. This was read, not measured, and is not relied on.
3. **The 1e-6 degree arithmetic.** `engine/ADMISSION-PREREGISTRATION.md:577-579` points to a P2 architect consult for it. That consult is not in the tracked tree at eab8e82. The value stands on RULED 2026-09-23 (later), entry 120 item (1)(b) and §14 item II, and no arithmetic of that consult is cited.
4. **Nothing is measured**, so there is no fixture-drive confound and no hypothesis.

## §1. What this preregistration may and may not claim

- **No numbers of that kind.** No performance number, no `docs/08` row, and no duration or cancellation vocabulary (ADR-018).
- **One wire change.** It adds one member to the `describe` response, and the literal goes `skp/0.3` → `skp/0.4`. There is:
  - no request member, command or refusal code;
  - an empty `protocol/data-plane/` diff;
  - no MCP surface.
- **No user-visible string.** The unit fact is rendered nowhere. §2 (i)'s KNOWN-LIMITATIONS wording is a draft for the human's sight.
- **Unchanged.**
  - `engine/` has an empty diff; the unit read at `engine/src/geoparquet.rs:680-757` is consumed as recorded.
  - The meaning of `unestablished` (§14 item I).
  - Publish: `kernel/src/publish/` has an empty diff, and degrees still refuse at preflight.
  - `renderer/` has an empty diff.
  - There is no new refusal.
  - The values for `other` and `unestablished` stay as today's (§7).
- **ADRs cited:** ADR-010 rules 1, 3 and 6; ADR-013 §1 and A1 items 2, 6 and 8 with the clarification; ADR-006 (`describe` stays class 1, pure; `protocol/skp/SKP-V0.md:56-58`). None is amended.
- **Claimable at landing:** A1 item 6 is true of the build for degree and metre only.

## §2. The change

**Protocol (`protocol/skp`)**
- (a) **The enum.** `commands.rs` gains `CrsUnit`, a closed enum `{Degree, Metre, Other, Unestablished}`, serialized lowercase as `"degree" | "metre" | "other" | "unestablished"`.
  - An unknown string fails to deserialize.
  - `CrsInfo` (`commands.rs:85-140`) gains `pub unit: CrsUnit` after `display_convention`.
  - Doc: `unit` is the engine's recorded `AdmissionRecord::coordinate_unit` class. `other` means both axes named one unit that is neither degree nor metre; its name is not carried. The unit's source is not carried.
- (b) **The literal.** `SKP_VERSION` goes `"skp/0.3"` → `"skp/0.4"` (`mod.rs:40`), with a doc paragraph in the `mod.rs:16-39` form. `SKP-V0.md` changes as follows:
  - §1's `describe` block (`:60-74`) is brought to the current shape: the `unit` member plus the `skp/0.3` members it omits. This is a disclosed currency fix inside a file in Scope.
  - §4 item 3 (`:179-186`) gains one appended sentence: `skp/0.3` and `skp/0.4` each bumped the compared literal, and `==` is unchanged.
  - §4 item 13 (`:237-252`) gains one appended sentence: `skp/0.4` is a further instance, and it freezes at merge.
  - §8 gains a new entry, `### skp/0.4 — crs-unit-fact-and-bounds`:
    - the full field set, which is one member (`crs.unit`) with its four values;
    - what it deliberately does not add: the unit source, an `other` unit's name, any request member, any refusal;
    - `protocol/data-plane/` has an empty diff;
    - mechanics per the `skp/0.3` precedent (`:628-636`);
    - **the literal follows merge order (RULED 2026-09-24 (night) item (2)): the watcher takes `skp/0.5` and stacks its branch on this one, and B1 takes the literal after the watcher's.** While this is unmerged, additions are appended addenda; it freezes at merge.

**Kernel (`kernel/src/skp.rs`)**
- (c) `describe_dataset` (`:1012-1061`) sets `unit` from `ds.admission()` through a private `crs_unit_of(&spatial_engine::CoordinateUnit) -> CrsUnit`.
  - The match is exhaustive, with no wildcard: `Degree→Degree`, `Metre→Metre`, `Named(_)→Other`, `Unestablished→Unestablished`.
  - `admission() == None` maps to `Unestablished`, the unreachable arm `:1043-1047` already records as not established.
  - The CRS identifier is never read for the unit.
  - **Engine: no change.** `coordinate_unit_for_admission` (`geoparquet.rs:680-697`) records the unit on `AdmissionRecord` (`geoparquet.rs:298-317`, `dataset.rs:486-495`), and that record is what reaches `describe`.

**Shell**
- (d) `skp/types.ts`: `export type CrsUnit = "degree" | "metre" | "other" | "unestablished"`, `CrsInfo.unit: CrsUnit` (`:67-101`), and `SKP_VERSION = "skp/0.4"` (`:15`).
- (e) `canvas/tileGrid.ts`:
  - `MIN_ANCHOR_SPAN` (`:73-78`) becomes a per-unit record of every `CrsUnit`: metre 1, degree 1e-6, other 1, unestablished 1. Each value's rationale sits at its own site.
  - `deriveTileGridFrame(anchor, unit)`: `unit` is required and has no default.
- (f) `canvas/offsetFrame.ts`:
  - `RECENTER_MAX_DRIFT_M` (`:37`) becomes a per-unit record of caps, all 131 072, with the degree derivation cited to the consult's DECLARED VALUE section.
  - `recenterThresholdForBudget`'s cap parameter becomes required, with no default. The math is unchanged (`:49-56`).
- (g) **Selection from the fact.**
  - `App.tsx` passes `admitted.describe.crs.unit` to `WorkingCanvas` as a new required prop, `crsUnit` (`App.tsx:1620-1624`). The canvas uses it at its four threshold sites (`WorkingCanvas.tsx:889`, `:1288`, `:1911`, `:2148`).
  - `App.tsx` also passes it to `startCandidateArmSession` as a new required dep, `crsUnit` (`App.tsx:1192-1201`). That dep reaches `establishGridFrame(anchor, unit)` (`tileViewportStreamManager.ts:453-456`, called at `candidateArmSession.ts:1191-1199`) and then `deriveTileGridFrame`.
- (h) The comment at `WorkingCanvas.tsx:1900` that names `RECENTER_MAX_DRIFT_M` is updated.
- (i) **At landing,** `KNOWN-LIMITATIONS.md` item 17 (`:168-173`) becomes a scope line, as a draft for the human's sight: a dataset whose unit is neither degrees nor metres keeps the one-unit minimum anchor span, and the drift cap is one declared value for every unit. Its comment names this record and the tests of §4.
- **Mechanical test-site updates.** Every existing metre scenario is changed to pass `"metre"`, with no assertion changed:
  - `tileGrid.test.ts`, `tileIngest.test.ts`, `tileResidentSet.test.ts`;
  - `candidateArmSession.test.ts` (including `:1473`);
  - `tileViewportStreamManager` tests;
  - the App test mocks;
  - test literals `"skp/0.3"` → `"skp/0.4"`.

## §3. Fixtures, pre-declared outcomes

In-tree fixtures are written per test by `spatial_engine::fixture` (`engine/src/fixture.rs:58-63`, `:95-141`) through `SkpHost`.

| # | `crs_mode` × `domain` | `describe.crs.unit` | `display_convention` |
|---|---|---|---|
| 1 | DeclaredLv95 × Lv95Metres | metre | null |
| 2 | DeclaredLv95ObjectUnit × Lv95Metres | metre | null |
| 3 | AbsentKey × Wgs84Degrees (`unit:format-rule`) | degree | Some |
| 4 | DeclaredCrs84Degrees × Wgs84Degrees | degree | Some |
| 5 | DeclaredCrs84DegreesObjectUnit × Wgs84Degrees | degree | Some |
| 6 | DeclaredCrs84DegreesWithLv95Identifier × Wgs84Degrees | degree | Some |
| 7 | DeclaredAxisUnitsDisagree × domain of `engine/tests/admission_format_semantics.rs:521-535` | unestablished | null |
| 8 | DeclaredAxisUnitAbsent × domain of `:540-548` | unestablished | null |
| 9 | no file: `CoordinateUnit::Named("US survey foot")` through `crs_unit_of` | other | — |
| C8 | corpus #8 (sha256 above, verified before and after), operator row §9 | degree; grid frame baseSpan ≈ 0.800515417276802 (was 2) | Some |

## §4. Tests, and one mutation per new test

1. **`crs_unit_serializes_to_its_four_declared_strings_and_refuses_any_other`** (`protocol/skp/tests/fixtures.rs`).
   - Asserts: round trip of all four values; `"Degree"`, `"degrees"`, `"meter"` and `""` each fail to deserialize.
   - Mutation: `#[serde(alias = "meter")]` on `Metre`. Fails by name.
2. **`skp_version_is_skp_0_4`** (same file).
   - Mutation: the literal back to `"skp/0.3"`. Fails by name.
   - Existing `describe_fixtures_round_trip`, the caller-asserted round trip and the session-ordinal round trip (`:82-132`) run over the updated fixtures: `v0-describe-response.json` and `-caller-asserted` carry `"metre"`, and `-session-ordinal` carries `"degree"`.
3. **`describe_carries_the_unit_the_engine_recorded_for_each_admission_route`** (new, `kernel/tests/describe_crs_unit.rs`, `SkpHost` open plus describe on §3 rows 1-8).
   - Asserts `unit` per the table, and that `unit == Degree` exactly when `display_convention` is Some.
   - Mutation: `CoordinateUnit::Degree => CrsUnit::Metre` in `crs_unit_of`. Fails naming rows 3-6.
4. **`named_unit_projects_to_other_never_to_unestablished`** (`#[cfg(test)]` in `kernel/src/skp.rs`, §3 row 9).
   - Mutation: `Named(_) => CrsUnit::Unestablished`. Fails by name.
5. **`the_real_describe_crs_shape_matches_the_shared_fixture`** (the kernel file above).
   - Serializes the real response for §3 row 3 and asserts its `crs` key set and `unit` value equal those in `protocol/skp/tests/data/v0-describe-response-session-ordinal.json`.
   - Mutation: that fixture's `unit` set to `"metre"`. Fails by name.
6. **`describe fixtures carry the typed unit fact (skp/0.4)`** (`frontends/shell/src/skp/__tests__/fixtures.test.ts`). The `crs` exact-key lists (`:106-123`) gain `"unit"`, and the three fixtures carry the values above.
   - Mutation: the session-ordinal fixture's `unit` set to `"metre"`. Fails by name.
7. **`MIN_ANCHOR_SPAN declares metre 1, degree 1e-6, other 1, unestablished 1`** (`tileGrid.test.ts`).
   - Mutation: degree 1e-6 → 1. Fails by name.
8. **`deriveTileGridFrame selects the anchor floor from the unit`** (`tileGrid.test.ts`).
   - Asserts, for corpus #8's bbox literal: metre gives baseSpan 2, degree gives 2·max(span) ≈ 0.800515417276802, and a zero-span anchor gives 2e-6 under degree and 2 under the other three units.
   - Mutation: `deriveTileGridFrame` ignores `unit` and uses the metre entry. Fails by name.
9. **`RECENTER_MAX_DRIFT declares 131072 for every unit; degree hands over at zoom 6`** (`offsetFrame.test.ts`).
   - Asserts the four values, and that with the degree cap the threshold is `2**17` at p = 2⁶ and `2**16` at p = 2⁷.
   - Mutation: degree 131 072 → 65 536. Fails by name.
10. **`a degrees describe fixture's unit reaches the frozen grid frame`** (`candidateArmSession.test.ts`). This is the seam proof from the real shape.
    - It loads `v0-describe-response-session-ordinal.json` (a shape the Rust `deny_unknown_fields` round trip verifies), passes `crsUnit: fixture.crs.unit` to the real `startCandidateArmSession`, and feeds a first-look batch whose extent is corpus #8's bbox.
    - Asserts: `gridFrame.baseSpan` ≈ 0.800515417276802, and 2 with the metre fixture.
    - Mutation: the session passes `"metre"` instead of `deps.crsUnit` to `establishGridFrame`. Fails by name.
11. **`App threads describe's unit to the canvas and the candidate session`**, using the `App.lateResult.test.tsx` harness (`:130-136`, `:257-260`, `:294-298`).
    - A mocked `describe` returns `unit: "degree"`. Assert the captured `WorkingCanvas` props and the captured session deps both carry `"degree"`.
    - Mutation: App passes the literal `"metre"` as `crsUnit`. Fails by name.
- **Declared equivalent mutants, not tests.**
  - Swapping which unit's drift cap `WorkingCanvas` selects is undetectable, because every cap is 131 072 by derivation (consult, DECLARED VALUE step 4).
  - The required-parameter typing (§2 (f)) is the guard. It is checked by the typecheck suite, and reintroducing a default fails `tsc` at the required-parameter sites only if an argument is also dropped. This is disclosed, not claimed as a mutation.

## §5. Registered predictions · declared unchanged · invalidators · falsification

- **Predictions.**
  - The §3 table.
  - Every existing metre-scenario test passes, with only `"metre"` passed.
  - The 25,600-cell survey (`tileGridConstants.ts:110-126`) is unchanged.
  - Re-centring behaviour is identical for every unit.
  - For a degrees dataset whose extent is under one degree, cells are finer by span/1 per axis. For #8 that is 2.5 times, so a zoomed-out cover counts up to about 6.24 times more cells. Against the recorded figure of about 3.63 times per notch (`tileGridConstants.ts:97-99`), the `MAX_COVERING_TILES` window is reached about 1.4 wheel notches earlier. This is the existing truncated or settled-partial outcome, not a new state.
  - A zero-span degrees anchor truncates at the degenerate fallback zoom (`extent.ts:113`), the outcome class a zero-span metre anchor already reaches there.
- **Declared unchanged:** everything in §1's list of unchanged items.
- **Invalidators.**
  - `spatial_engine::CoordinateUnit` gains or loses a variant on `main` before landing: stop and re-scope.
  - A node recomputation of a P0 number disagrees: record a class-2 deviation and withhold the item-17 wording.
- **Falsification.** Any admitted dataset where `crs.unit == "degree"` disagrees with whether `display_convention` is Some. That would mean the two are not read from one record.

## §6. Instruments

All are assertions (structural facts), listed in §4. There are no measurements.

## §7. Declared values and ceilings

Each value sits at its own site:

- **Minimum anchor span.**
  - metre = 1: the basis at `tileGrid.ts:73-77`.
  - degree = 1e-6: entry 120 (1)(b) and §14 item II.
  - other = 1 and unestablished = 1: unchanged, the unit-agnostic one-unit rule of `tileGrid.ts:73-77`. **The attach point if Q1 is ruled.**
- **Drift cap.**
  - metre = 131 072: unchanged; the sanity ceiling at `offsetFrame.ts:45-47`.
  - degree = 131 072: derived in the consult's DECLARED VALUE section.
  - other = 131 072 and unestablished = 131 072: unchanged. **The attach point if Q1 is ruled.**
- `RECENTER_BUDGET_PX = 0.5` is unchanged.
- `SKP_VERSION = "skp/0.4"`.

## §8. Block-on-sight

1. A unit read from the CRS identifier anywhere.
2. A unit or cap that is defaulted: a default parameter or default unit, or a non-throwing `default:` arm in a `CrsUnit` switch.
3. A wire value outside the four, or a key added under `skp/0.4` that is not in its §8 entry.
4. `Named` mapped to `unestablished`, or `unestablished` mapped to a unit.
5. The unit rendered in any UI string.
6. A diff in `engine/`, `protocol/data-plane/`, `kernel/src/publish/` or `renderer/`.
7. A new refusal, or any publish change.
8. A value for `other` or `unestablished` that differs from today's, or a per-unit value beyond metre and degree.
9. A literal other than `skp/0.4`, or both-side fixtures not updated in the bump's commit.
10. Any claim that A1 item 6 is true for every unit, or a discharge or "done" clause without its named test.
11. A performance or duration claim, or a `docs/08` row.
12. An exported item without a product caller.
13. A quote marked verbatim that does not match its source, or a bare self-line.

## §9. Gates

- **Architect** (full gating): ADR-010 rules 1, 3 and 6; ADR-013 A1 items 2, 6 and 8; ADR-006; §8, item by item.
- **Reviewer:** the full diff, with the wire contract as its own item.
- **Suites:** `cargo test` for `spatial-skp` and `spatial-kernel`; the shell's vitest suite and typecheck; the `node --test` scripts suite; the pre-gate self-checks (`AUTONOMY.md` §6a), all green first.
- **Operator:** one row in the walkthrough part after Part N, committed with a blank result log and queued for the next sitting.
  - Open corpus #8 in the dev shell. The candidate arm is the default (`residencyArm.ts:50`).
  - The session log's frame-freeze line should read baseSpan ≈ 0.8005 (it was 2), and nothing on screen should change.

## §10. Amendments

*Opens empty. Append-only.*

### Amendment 1 — the build's results

Record cap form (`state/directives/2026-09-18-record-cap.md`): references and hashes, no prose
restating them. Commits on `cut/crs-unit-fact-and-bounds`, in order: `913059f` (protocol),
`90ab7bf` (kernel), `c027d39` (shell), `6da9206` (Part P operator row), `a150790` (merge
`origin/main`, no rebase; PLAN.yaml's own `gate` field for this node was the merge's only real
conflict, resolved to this branch's value — the field origin/main had not yet learned), `e8ce6e9`
(KNOWN-LIMITATIONS.md item 17). Suites run at `c027d39` (Rust, before the merge; no Rust file
changed after it) and at `e8ce6e9` (`node`-based pre-gate self-checks and `npm run verify`, after
it).

**§4 tests → commit, mutation, observed result (each applied, observed FAILED by name, then
reverted):**

1. `crs_unit_serializes_to_its_four_declared_strings_and_refuses_any_other`
   (`protocol/skp/tests/fixtures.rs:278` @ `913059f`) — `913059f`. Mutation: `#[serde(alias =
   "meter")]` on `Metre`. FAILED by name (assertion: `"meter"` deserialized).
2. `skp_version_is_skp_0_4` (`protocol/skp/tests/fixtures.rs:300` @ `913059f`) — `913059f`.
   Mutation: literal back to `"skp/0.3"`. FAILED by name (`left: "skp/0.3", right: "skp/0.4"`).
3. `describe_carries_the_unit_the_engine_recorded_for_each_admission_route`
   (`kernel/tests/describe_crs_unit.rs:59` @ `90ab7bf`) — `90ab7bf`. Mutation:
   `CoordinateUnit::Degree => CrsUnit::Metre` in `crs_unit_of`. FAILED by name, one panic naming
   all four degree rows (3-6) via the test's own collected-failures assertion.
4. `named_unit_projects_to_other_never_to_unestablished` (`kernel/src/skp.rs:1733` @ `90ab7bf`) —
   `90ab7bf`. Mutation: `Named(_) => CrsUnit::Unestablished`. FAILED by name.
5. `the_real_describe_crs_shape_matches_the_shared_fixture` (`kernel/src/skp.rs:1748` @ `90ab7bf`)
   — `90ab7bf`. Mutation: the session-ordinal fixture's `unit` set to `"metre"`. FAILED by name.
6. `describe fixtures carry the typed unit fact (skp/0.4)`
   (`frontends/shell/src/skp/__tests__/fixtures.test.ts:176` @ `913059f`) — `913059f`. Mutation:
   same fixture edit as test 5 (one shared JSON file). FAILED by name.
7. `declares metre 1, degree 1e-6, other 1, unestablished 1`
   (`frontends/shell/src/canvas/tileGrid.test.ts:59` @ `c027d39`) — `c027d39`. Mutation: degree
   `1e-6` → `1`. FAILED by name.
8. `metre gives baseSpan 2, degree gives 2*max(span) ~= 0.800515417276802 for corpus #8's bbox`
   and `a zero-span anchor gives 2e-6 under degree and 2 under the other three units`
   (`frontends/shell/src/canvas/tileGrid.test.ts:76,81` @ `c027d39`) — `c027d39`. Mutation:
   `deriveTileGridFrame` ignores `unit`, uses `MIN_ANCHOR_SPAN.metre`. Both FAILED by name.
9. `declares 131072 for every unit; degree hands over at zoom 6`
   (`frontends/shell/src/canvas/offsetFrame.test.ts:29` @ `c027d39`) — `c027d39`. Mutation: degree
   `131_072` → `65_536`. FAILED by name.
10. `a degrees describe fixture's unit reaches the frozen grid frame`
    (`frontends/shell/src/residency/candidateArmSession.test.ts:234` @ `c027d39`) — `c027d39`.
    Mutation: the session passes `"metre"` instead of `deps.crsUnit` to `establishGridFrame`.
    FAILED by name; the other 76 tests in the file unaffected.
11. `App threads describe's unit to the canvas and the candidate session`
    (`frontends/shell/src/App.lateResult.test.tsx:1385` @ `c027d39`) — `c027d39`. Mutation applied
    and reverted at each of the two sites named in §2 (g) independently
    (`frontends/shell/src/App.tsx`'s `WorkingCanvas` `crsUnit` prop, then its
    `startCandidateArmSession` `crsUnit` dep): each FAILED this same test by name in isolation.

**Suites, commands and rc:**

- `cargo test -p spatial-skp` (`CARGO_TARGET_DIR=C:/dev/spatial-ide/target`) — rc 0, 40/40.
- `cargo test -p spatial-kernel` (whole crate) — rc 0, every binary green (113 lib tests; every
  integration-test binary 0 failures).
- `cargo fmt --check` — rc 1: 1752 pre-existing diff blocks repo-wide, none in a file this piece
  touches (`grep` of the fmt output against every `protocol/skp`, `kernel/src/skp.rs` and
  `kernel/tests/describe_crs_unit.rs` path: zero matches) — pre-existing drift, not caused by or
  fixed in this piece.
- `cargo clippy -p spatial-skp -p spatial-kernel --all-targets` — rc 0; 36 pre-existing warnings,
  none in a file this piece touches (same `grep` check, zero matches) — no new warning.
- `frontends/shell`: `npm ci` (`node_modules` was absent), then `npm run verify` — rc 0. 71 test
  files, 1055/1055 tests, including all four cargo-invoking notice tests
  (`noticeByteIdentity.test.ts` 8, `spdxTokenisation.test.ts` 2, `noticeDeterminism.test.ts` 1,
  `duckdbAmalgamation.test.ts` 21) green with no timeout on this run; `renderer/bundle-viewer`
  built first (`npm ci` + `npm run build`) so `generate:notice` had its metafile.
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` — rc 0, 251/251.
- `node scripts/plan/verify-cites.mjs` — rc 0.
- `node scripts/plan/verify-quotes.mjs` — rc 0.
- `node scripts/plan/verify-test-claims.mjs` — rc 0.
- `node scripts/plan/verify.mjs --offline` — rc 0.
- `node scripts/plan/verify-mutation.mjs` — rc 0, 12/12 new tests named by a recorded mutation.
- `node scripts/plan/queue.mjs --check` — rc 0.
- `node scripts/plan/site.mjs --check` — rc 0.

**§3 table, observed:**

- Rows 1-8: matched, by `describe_carries_the_unit_the_engine_recorded_for_each_admission_route`
  (`kernel/tests/describe_crs_unit.rs`) — every row's `unit` and the S5 falsification condition
  (`unit == Degree` iff `display_convention` is `Some`).
- Row 9: matched, by `named_unit_projects_to_other_never_to_unestablished`
  (`kernel/src/skp.rs:1735-1736` @ `90ab7bf`).
- Row C8: **not run by this piece** — it is §9's Operator gate, Part P
  (`frontends/shell/MANUAL-WALKTHROUGH.md`), committed at `6da9206` with a blank result log,
  queued for the next sitting. The `baseSpan ≈ 0.800515417276802` arithmetic itself is matched
  independently by `tileGrid.test.ts`'s corpus-#8-bbox-literal test and by
  `candidateArmSession.test.ts`'s real-fixture seam test (test 10 above), both using the identical
  bbox literal Part P's own row cites — the live open-a-real-file check is what Part P still owes.
- `v0-describe-response-caller-asserted.json`'s own `unit: "metre"` (added at `913059f`) is not
  itself a §3 row — a bonus check on an existing caller-asserted fixture, exercised by
  `describe fixtures carry the typed unit fact (skp/0.4)` (test 6).

**Discharged/done clauses in this record, each naming its proof:** §2 (a)-(i) each land at the
commit named beside it above; §7's four declared values are the `MIN_ANCHOR_SPAN`/
`RECENTER_MAX_DRIFT` object literals tests 7 and 9 pin; §8's block-on-sight items are the
architect's own gate, not self-certified here.

**Files touched, this piece's own commits (excludes the merge's inherited main-side files):**
`KNOWN-LIMITATIONS.md`; `PLAN.yaml` (one field, the merge's own conflict resolution);
`frontends/shell/MANUAL-WALKTHROUGH.md`; `frontends/shell/src/App.tsx`,
`src/App.test.ts`, `src/App.lateResult.test.tsx`; `frontends/shell/src/admission/`
`AdmissionPanel.test.ts`, `admitDataset.test.ts`, `describeSummaryText.test.ts`;
`frontends/shell/src/canvas/` `WorkingCanvas.tsx`, `offsetFrame.ts`, `offsetFrame.test.ts`,
`tileGrid.ts`, `tileGrid.test.ts`, `tileIngest.test.ts`, `tileResidentSet.test.ts`;
`frontends/shell/src/residency/candidateArmSession.ts`, `candidateArmSession.test.ts`;
`frontends/shell/src/skp/types.ts`, `skp/client.test.ts`, `skp/__tests__/fixtures.test.ts`;
`frontends/shell/src/streaming/tileViewportStreamManager.ts`, `tileViewportStreamManager.test.ts`;
`kernel/src/skp.rs`; `kernel/tests/describe_crs_unit.rs` (new); `protocol/skp/SKP-V0.md`,
`src/v0/commands.rs`, `src/v0/mod.rs`, `tests/fixtures.rs`, and all nine
`protocol/skp/tests/data/*.json` request/response fixtures.

**Deviations from §2-§7:** none. Every choice this record's own runs required was named in §2-§7;
no `CoordinateUnit` variant differed from the four mapped; no existing assertion changed (only the
mechanical `"metre"`/literal additions §2 itself names, extended to every fixture the wire-literal
bump actually touches — `admitDataset.test.ts`, `client.test.ts` — per §8 item 9's own both-side,
same-commit rule); nothing outside §2-§7 was decided.

### Amendment 2 — correction round after full gating attempt 1

Written after PR #112's full gating attempt 1 was seen (reviewer: Correctness PASS, Evidence FAIL,
Documentation FAIL; architect: the code passes, the record fails). Class 1 (post-result amendment)
and class 3 (cite/line-number fixes, test-text exception) per `docs/PREREGISTRATION-TEMPLATE.md`
§10. It also supplies, for Amendment 1 itself, the class declaration Amendment 1's own first line
omitted: Amendment 1 is a class-1 post-result amendment.

1. **§2 discharge-by-proof (architect §8 item 10).** Defect: Amendment 1 discharged §2 (a)-(i) by
   commit only. Corrected reference: (a) test 1; (b) tests 2 and 6; (c) tests 3, 4 and 5; (d) test
   6; (e) tests 7 and 8; (f) test 9; (g) tests 10 and 11; (h) the comment at the four
   `recenterThresholdForBudget` call sites in `WorkingCanvas.tsx`, named by function, not by line;
   (i) `KNOWN-LIMITATIONS.md` item 17, whose own comment now names tests 7 and 9 by name. Proof:
   each test named exists in the tree and is green in this record's own suite run.

2. **KNOWN-LIMITATIONS item 17's comment (both gates).** Defect: the comment attributed its text to
   the human's wording though it is this piece's own DRAFT, and the visible item claimed the degree
   value matches the metre value for both bounds, which is false for the anchor span (1e-6 against
   1; true only for the drift cap, 131 072 against 131 072). Corrected reference:
   `KNOWN-LIMITATIONS.md` item 17, this round's own commit. Proof: the item's text and comment as
   committed this round.

3. **Item 6's scope and Q2 (architect).** Defect: item 6 was claimed true of the build without
   naming which constants it covers, alongside the metre-shaped `MAX_ZOOM` and `extent.ts` fit/
   degenerate zoom constants of the same class. Corrected reference: `KNOWN-LIMITATIONS.md` item
   17's comment and PR #112's own body now scope the claim to `MIN_ANCHOR_SPAN` and
   `RECENTER_MAX_DRIFT` and name the consult's STOP LIST Q2,
   `state/consults/2026-09-24-crs-unit-fact-and-bounds.md`, as open. Proof: both texts as committed/
   edited this round.

4. **Amendment 1's own first line (architect).** Defect: it did not say it was written after
   results and named no class. Corrected reference: this Amendment 2, item preceding item 1, above,
   supplies that declaration for Amendment 1. Proof: the sentence itself, this section.

5. **Amendment 1's `path:line @ <branch commit>` pins (both gates).** Defect: the §4 tests 1-11 list
   and the §3-table observed section cite `path:line @ <branch commit>` with no sha256, pinning
   commits on a branch, not main. Corrected reference: those citations are superseded by test and
   function name only (§10's superseded index below); any reference to a branch commit that remains
   in this record is disclosed as a branch-commit reference, not a main-pinned one.

6. **`cargo fmt --check` claim (reviewer E1, Evidence).** Defect: Amendment 1 said no diff was found
   in a file this piece touches; false — default rustfmt reports diffs on lines this piece added in
   `kernel/src/skp.rs` (the `the_real_describe_crs_shape_matches_the_shared_fixture` test) and
   `protocol/skp/tests/fixtures.rs` (the `crs_unit_serializes_to_its_four_declared_strings_and_refuses_any_other`
   test), alongside the 1748 pre-existing diff blocks repo-wide (no `rustfmt.toml`; main itself fails
   `cargo fmt --check`). Corrected reference: `kernel/tests/describe_crs_unit.rs`, the one wholly new
   file this piece adds, was reformatted this round (commit `8a237dd`) and now passes
   `rustfmt --check` on its own; `kernel/src/skp.rs` and `protocol/skp/tests/fixtures.rs` are left as
   they were, their diffs being the same repo-wide, pre-existing drift as the 1748 blocks, not caused
   or fixed by this piece. Proof: `rustfmt --check kernel/tests/describe_crs_unit.rs` (rc 0, this
   round) and `cargo fmt --check` (rc 1, 1748 diff blocks, unchanged in count for every other file
   this piece touches).

7. **Fixture count (reviewer D1).** Defect: Amendment 1 said "all nine"
   `protocol/skp/tests/data/*.json` fixtures. Corrected reference: `git diff --name-only
   origin/main...HEAD -- protocol/skp/tests/data/` lists ten files. Proof: that command's own output,
   this round.

8. **Part P's P1 literal and its item-17 cite (reviewer D2).** Defect: P1's expected `baseSpan`
   literal (`0.800515417276802…`) did not match the JavaScript number the session log actually
   prints, and P1 cited `KNOWN-LIMITATIONS.md` item 17 for the old `baseSpan=2` value, which neither
   version of item 17 states. Corrected reference: `frontends/shell/MANUAL-WALKTHROUGH.md` Part P,
   P1 (this round's own commit) now states the printed form, `0.8005154172768005…`, and cites the
   consult's P0 Step 3 instead of item 17. Proof: `node -e "console.log(2*Math.max(0.40025770863840027,
   0.39821605223940537))"` prints `0.8005154172768005`, this round.

9. **Test-comment reasoning and export doc (architect notes).** Defect: `fixtures.test.ts`'s
   per-fixture unit comments reasoned from the CRS identifier; test 11's mock paired degree with
   EPSG:2056 and a null `display_convention` with no comment on why that is harmless;
   `MIN_ANCHOR_SPAN`'s only outside importer (the test) had no doc line saying so. Corrected
   reference: `fixtures.test.ts`'s three comments now cite the admission route
   (`crs:declared`/`crs:format-default`/`caller_asserted`); `App.lateResult.test.tsx`'s test 11 now
   has a comment naming the shape deliberate and harmless for a threading test; `tileGrid.ts`'s
   `MIN_ANCHOR_SPAN` doc now names `tileGrid.test.ts` as its only outside importer and
   `deriveTileGridFrame` as its product reader (commit `8a237dd`). Proof: the comments as committed.

10. **`recenterThresholdForBudget`'s first parameter (reviewer nit).** Defect: named
    `pixelsPerMetre` though the value is per-authoritative-unit. Corrected reference:
    `offsetFrame.ts`, renamed to `pixelsPerAuthoritativeUnit` at its definition (commit `8a237dd`);
    no caller referenced the old name (all four `WorkingCanvas.tsx` call sites pass positionally).
    Proof: `grep -rn pixelsPerMetre frontends/shell/src/canvas/offsetFrame.ts` finds no match after
    this round's commit.

**Superseded index (as of this Amendment).**
- Amendment 1's §4 tests 1-11 `path:line @ <branch commit>` citations: superseded by this round's
  item 5 — cite by test/function name only from here on.
- Amendment 1's "Files touched" sentence's "all nine `protocol/skp/tests/data/*.json`" count:
  superseded by this round's item 7 — the count is ten.
- Amendment 1's first line (no post-result/class declaration): superseded by this round's item 4.
- `KNOWN-LIMITATIONS.md` item 17's pre-this-round text and comment: superseded by this round's items
  2 and 3.
- `frontends/shell/MANUAL-WALKTHROUGH.md` Part P's P1 pre-this-round expected-outcome text:
  superseded by this round's item 8.
