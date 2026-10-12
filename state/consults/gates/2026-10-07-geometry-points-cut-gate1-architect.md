# PR #185 gate 1 — architect
Reviewed: cut/geometry-points-cut @ 2e481e743e48a73b402acdf51c02ade172cce0dc

**Verdict: pass with notes.** I found nothing under Correctness or Evidence. There are six Documentation and record findings (D-1 to D-6). Each must be fixed in this PR before the merge; none needs a correction round or a re-gate. Base B is d3fe60558568d2db8ffdc09220134442acff8144. I have no shell, so I read files only. I did not open the PR body, CI, hashes or diffs; the reviewer owns those (listed at the end).

## Correctness: none

- **§8, item by item:**
  - 1: reviewer's §6 run. Worker reports 1 and 2 show the four sha256 values equal at base and head.
  - 2: PE-7 and K-P1.
  - 3: S-P1.
  - 4: `buildLayers` calls `checkPickCeiling(batch.partCount)` before the point branch.
  - 5: the encoding and the declaration are shown as separate labelled rows (PT', P1).
  - 6: `PointBuilder::push_wkb` refuses NaN, EWKB flags, types other than 1, and trailing bytes. Nothing is skipped.
  - 7: the out-of-set detail renders `readable_set_phrase()` over the three types. The mixed set is refused.
  - 8: every new string carries `[P6 placeholder]`. The engine strings state engine facts only.
  - 9: K-P2.
  - 10 and 15: the 53 changed files equal the sum of §7's groups (Amendment 4 item 3), so no file outside §7's lists changed. Reviewer to confirm by diff.
  - 11: N-1 holds (`EXT_NAME_MULTIPOLYGON` and `BatchEnvelope::geometry_encoding` are `pub(crate)`). The new `pub` items in `fixture` are E-P9's own, feature-gated, on the `encode_multipolygon` precedent.
  - 12: `skp/0.10` on both sides, and the §8 entry is last before §9.
  - 13: OPEN-3 and OPEN-4 were ruled before commit 4.
  - 14: none found.
  - 16: see the round-25 section below.
  - 17: see the quotes section below.
  - 18: the index edits are in the listed sections, and the index stays under 60 lines.
  - 19: no `pickingRadius` in `frontends/shell/src`. The threshold is unchanged.
  - 20: `toStyleDocument` still writes `polygon`.
  - **Amendment 1 item 3 (no path that saves a point layer's style document):** none was added. StylePanel's text is read-only, with no Save. PublishPanel's style document dies at K2's preflight before any destination exists (K-P2 asserts this).
- **ADR-034:**
  - inherited list 1–8: E-P2, K1 unchanged, E-P4, S-P1, identity `partToRow`, the sighted template, the encoding checks in SH-P1, V-P and K-P1, and K-P2.
  - Decisions 1 (one declaration, read by the gate and the text), 2 (`{Point}` gives point; `None` or `[]` still gives MultiPolygon), 5, 6, 7 (the mixed-kind set is refused; the ruling stands as Decision 7's later decision), 8 (one literal), 9 and 10: hold.
- **Acceptance items 5 and 6:** a row is refused, never counted. Every new wording is a placeholder.
- **ADR-010:**
  - rule 1: frame check unchanged;
  - rule 2: ordinal → identity `partToRow` → id;
  - rule 3: `pointsForBatch` runs `frame.toLocal` in f64, cached;
  - rule 6: `POINT_RADIUS_PX` is declared, and no new ceiling is added.
- **ADR-016 §5:** S-P1 asserts unique ids.
- **ADR-017 §4 and §5a:** unchanged (no kernel product line; style document unchanged).
- **ADR-022 Decision 4, read per OPEN-3:** the mapping lives only in `buildLayers`.
- **ADR-028 item 4, per OPEN-4:** `pickResolutionExtentFor` feeds the same `isBelowPickResolution` threshold, state and text, once per render (WorkingCanvas.tsx line 1261 at 2e481e74).
- **SKP-V0 §4 item 13 and the `skp/0.10` entry:** the value is recorded alone, the version-refusal fixture moves to `skp/0.11`, and main is still `skp/0.9`. If an earlier merge forces another number, the closing record states it.
- **Seam rule:** every RS row reads the real shape.
  - S-P1, BF-P, K-P1 and K-P2 come from a real `Dataset::open`.
  - SH-P1, SH-P2, SH-P3 and V-T read the engine's committed `lv95-point-batch.arrows` through the product `decodeBatch` or `decodePartition`.
  - O6: no attribute hook in the files read.
- **OPEN-2 placeholder:** `MIXED_KINDS_DRAFT` (line 95 of engine/src/geoarrow.rs at 2e481e74) is byte-equal to the draft span in `state/directives/2026-10-06-round-62-rulings.md:7`, without its final period, as Amendment 2 item 5 records.

## Evidence: none

- **Discharge claims (Amendments 2–4):** each resolves to worker reports 1–3. The per-group arithmetic is consistent: 2,621 + 38 + 1 = 2,660.
- **Verbatim quotes the diff adds:** only the span "as drafted, for my P6 sight", in the comments under KNOWN-LIMITATIONS items 35 and 36. It matches round-62 lines 8 and 9 byte for byte.
- **The pile figures:** Amendment 4 item 5 and worker report 3 check out against `averagePointSpacing` and `pixelsPerWorldUnitAtZoom` (2^zoom): refusal below zoom ≈1.07, overlap up to zoom ≈6.8.

## Round-25 checks

- **Class 8:** Amendment 4 records the kernel overrun (306 against 220), with §7 unedited. The branch's §7 is identical to main's. Pass.
- **Class 9:** Amendment 3, which declares the pile generator, was committed in 4ea0c6c0 at 22:21:14Z. The fix worker's run began at 22:21:58Z (worker report 3's filing note), and 2e481e74 was pushed at 22:41:24Z. The commit and push times are from the main checkout's reflog, which is evidence, not Authority. Pass.
- **Mutation wording:** no record calls a `verify-mutation` run an observation. Pass.
- **T-1:** no record pins the branch span by hash. The PR body must name it with its commit id, which I could not check (reviewer).
- **Five-line form:** none; this piece uses the full form.

## Documentation and record (each must be fixed before the merge)

- **D-1 (medium): the F-1c generator's doc names a consumer that does not exist.** Location: kernel/tests/manual_walkthrough_fixtures.rs, line 338 at 2e481e74. The doc says the fixture is for the shell E2E's MP' step. MP' still opens `multipolygon-f1.parquet`, the F-1 fixture with no covering (frontends/shell/e2e/regression.mjs, lines 71–72 and 408 at 2e481e74). Fix: name Part S's S2 only.
- **D-2 (low): the generated P3 line names only #8 as excluded by primary-provenance precedence; #5 is now excluded too.** Location: engine/ADMISSION-RESULTS.md, line 65 at 2e481e74. Line 68 already counts two `crs:format-default` rows. Fix the literal in `engine/tests/admission_p4_corpus.rs` (class 3, like Amendment 3 item 6), then re-run at a committed tree, as DR-4 requires.
- **D-3 (low): walkthrough row P2, step (d), says P-1's points are at least 10 m apart.** Location: frontends/shell/MANUAL-WALKTHROUGH.md, line 1633 at 2e481e74. The closest pairs, k and k+3 in `point_p1` (engine/src/fixture.rs, lines 1298–1307 at 2e481e74), are about 9.64 m apart. The conclusion still holds: about 15 px apart where the refusal starts. Fix the row. Amendment 3 item 7 repeats the figure; the closing record corrects it by reference, in at most three sentences.
- **D-4 (low): one sentence in KNOWN-LIMITATIONS item 31 reads as covering both refusals.** Location: line 336 at 2e481e74. The sentence saying the refusal lists the declared types and the readable set comes after the mixed-kind sentence. The mixed-kind detail does not list the readable set. Move the sentence before the mixed-kind sentence, or scope it to the out-of-set refusal.
- **D-5 (nit): the `decodeBatch` doc still says "neither encoding".** Location: frontends/shell/src/canvas/decodeBatch.ts, line 108 at 2e481e74. The shell now reads three encodings.
- **D-6 (record, low): PP-5's ignored set, which ends "and nothing else", now gains a 50th ignored test, the pile generator.** Amendment 3's superseded index does not list PP-5. The closing record names it by reference to Amendment 3 item 7.

## The worker's noticed items (Amendment 3 item 8)

1. **MP' still opens F-1, which has no covering:** not a finding against this PR. It is MP-1's merged step, and the new-step rule forbids editing it here. A new step on F-1c would be a class 9 addition. Route it as a follow-up: MP' is predicted to fail at its next run (Amendment 1 item 6). Only the false consumer clause in this PR is a finding (D-1).
2. **The generated P3 line naming only #8:** a finding, D-2, Documentation, low.
3. **The engine README's Declared-limits line:** not a finding.
   - Items 35 and 36 are limits of the shell's `buildLayers.ts` and `pickResolution.ts`, not of the engine.
   - §8 item 18 keeps that line out of this PR's index edit.
   - Carry it to the next piece that touches the indexes. MP-1 already listed its shell item 34 in the engine index, so that piece should settle where shell-owned limits are indexed.
4. **No KNOWN-LIMITATIONS line for a Point file with no covering:** not a finding. Item 9's covering clause (`KNOWN-LIMITATIONS.md:110-114`, on main and unchanged at 2e481e74) applies to every file. Item 31 replaces only item 9's polygon-only half.

## The walkthrough's two Part P sections (Amendment 3 item 2)

The operator can tell them apart:
- the titles differ (line 1450 and line 1609 at 2e481e74);
- the new Part's first paragraph names the earlier one and sets the "P2 (points)" convention;
- its result log is headed as the points cut's.

The earlier Part P has a single row, P1, so only "P1" can collide. The convention covers it if the result log is filled as "P1 (points)".

## For the reviewer (I could not check these without a shell)

- the PR body: it asks for a merge commit, names T-1's span by commit id, names the OPEN rulings, and names B;
- CI green at 2e481e74, and the `noticeDeterminism` re-run (Amendment 3 item 9);
- §6's hashes at base and head;
- empty diffs for `lod.rs`, `renderer/src/style.rs`, `protocol/data-plane/`, `kernel/src/publish/mod.rs`, every ADR, MP-1's form and `engine/ADMISSION-PREREGISTRATION.md`.

No ADR is needed.
