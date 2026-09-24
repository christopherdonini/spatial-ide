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
