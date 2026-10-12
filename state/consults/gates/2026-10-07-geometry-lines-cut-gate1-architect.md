# PR #188 gate 1 — architect
Reviewed: cut/geometry-lines-cut @ e89bf9bf6c2c90965ff75a7fd892bc7b1bae3d40

**Verdict: pass with notes.** I found nothing under Correctness and nothing under Evidence. There are four Documentation and record findings (D-1 to D-4), and each must be fixed in this PR before the merge. None needs a correction round or a re-gate. Base B is 6f4cc949. I have no shell, so I read the files only, in C:/dev/wt/lines at the head and in main's records. I did not check hashes, diffs, CI or the PR body. Those are the reviewer's and the custodian's, and they are listed at the end.

## Correctness: none

**§8, item by item:**
- 1: §6 is the reviewer's. Worker reports 1 and 3 record the five sha256 values equal at base and head, and the four instruments green at the head.
- 2: the encoding is fixed in `encoding_for_declared_types`. S-L1 asserts that the key and the field agree, and K-L1 asserts `describe`.
- 3: S-L1 asserts one row per feature (5 rows for L-1, 3 rows and 6 parts for ML-1). `MultiLineStringBuilder` pushes one geometry offset per row.
- 4: `checkPickCeiling(batch.partCount)` runs before the line branch in `buildLayers`, and SH-L2 spies it.
- 5: the summary rows are unchanged, and LN' and T1 check both labels.
- 6: `read_line` refuses fewer than 2 positions, and every refusal truncates the builder and stops the stream. S-L2 asserts that nothing is skipped.
- 7: the out-of-set text renders `readable_set_phrase()` over five types. A mixed set is refused, and `MIXED_KINDS_DRAFT` is unchanged; the reviewer confirms the hash. A-L2 proves a polygonal-and-point set byte-equal to today.
- 8: every new string carries `[P6 placeholder]`. The engine strings state engine facts, and `UnexpectedEncodingError` and `PickCeilingExceeded` state the shell's own facts.
- 9: K-L2 covers both line encodings and L-11.
- 10: `estimate_bytes`' body is unchanged. Empty diffs for the rest of §5's list are the reviewer's to confirm.
- 11: the new engine items are `pub(crate)`, apart from E-L9's helpers behind the `fixture` feature. `multilinestring_ml1_rows_with_bounds` has a generator caller. No attribute hook was added.
- 12: `skp/0.11` is on both sides, with the version-refusal fixture at `skp/0.12`. The §8 entry is last before §9. Main is still `skp/0.10`.
- 13: OPEN-1 to OPEN-5 were ruled at 10:11Z, before the first work at 10:20Z (report 1).
- 14 and 15: none. L-L takes the LOD `cfg_attr` precedent.
- 16: see the round-25 checks below.
- 17: see Evidence.
- 18: the index edits are in §2's sections. The engine index drops item 34, and the reviewer counts the lines.
- 19: `pickingRadiusFor` returns `undefined` unless the kind is `line`. Both WorkingCanvas sites spread the prop or the argument only when it is defined.
- 20: nothing in `frontends/shell/src/style/` changed, and no save path exists.
- 21: `geometryKindOf` and the decode branch are keyed on the encoding string. `coordinate_values` walks a multilinestring by shape, but it decides no kind; the form endorses this (E-L5), and the walk is correct for sliced arrays. I-8 does not fire.
- 22: MP', PT' and P7 are not edited. Part P gets a dated note.

**ADR-034:**
- The inherited list, items 1 to 8, holds: E-L2, `declared_types`, S-L2, S-L1, `partToRow` (BF-ML through SH-L3), the sighted template, the encoding checks in decodeBatch, the viewer, K-L1 and K2, and K-L2.
- Decisions 1, 2, 3, 5, 6 (V-L confirmed in report 2), 7, 8, 9 and 10 hold.
- Acceptance item 5 holds: a row is refused, never counted. Item 6 holds: every new string is a placeholder.

**ADR-010 rules 1, 2, 3 and 6:**
- rule 1: the frame check is unchanged;
- rule 2: ordinal → `partToRow` → id;
- rule 3: `pathsForBatch` calls `frame.toLocal` in f64 and caches by batch and origin (SH-L2c);
- rule 6: the ceiling counts parts, and the two new constants are declared.

**ADR-016 §5:** S-L1 asserts the ids. **ADR-017 §4 and §5a:** no kernel product line changed, and the style document is unchanged.

**ADR-022 Decision 4, per OPEN-3:** the mapping is plumbing in `buildLayers` only. **ADR-028 item 4:** `pickResolutionExtentFor` returns `averageFeatureExtent` for lines, and the 9 px threshold is unchanged.

**SKP-V0 §4 item 13:** the reviewer confirms the one-commit condition at 26d4ccc0 (report 1: 9 + 12 shell lines in phase A).

**Seam rule:**
- S-L1, BF-L/BF-ML, K-L1 and K-L2 come from a real `Dataset::open`.
- SH-L1, SH-L2, SH-L3 and V-T-L read the engine's committed `lv95-linestring-batch.arrows` and `lv95-multilinestring-batch.arrows` through the product `decodeBatch` or `decodePartition`.
- O6: no attribute lookup, callback or row accessor was added.

**Amendments 2 and 3, class 2 and class 3:**
- A2.2: ML-1's bounds helper is needed by §2's "ML-1, with a covering".
- A2.3: a local rename.
- A2.4: a mutation site, re-observed.
- A2.5: the doc correction §2 orders.
- A3.2: the casing's rounding. This is within OPEN-3's ruling, which fixes the colour, the width, pickability and the placement beneath, and T4 sights it. It is not red-line text.
- A3.3: the fixture-existence line. It is not a step, so §8 item 22 does not apply.
- A3.4 and A3.5: honest corrections.
- A3.6: the index stamp.

All are correctly classed. None is a class 9 scope addition.

## Evidence: none

- **Discharge claims:**
  - A2.1–A2.8 resolve to report 1.
  - A3.1 resolves to report 2's V-L.
  - A3.7 and A3.8 resolve to report 3. The group arithmetic holds: 1,220 + 960 + 307 + 221 + 242 + 521 + 90 = 3,561 lines, and 6 + 6 + 4 + 17 + 7 + 9 + 3 = 52 files.
- **Verbatim quotes the diff adds:**
  - The A-L2 `RULED` constant matches the draft span of `state/directives/2026-10-06-round-62-rulings.md:7` byte for byte. Its final period is outside the span, as in the points precedent.
  - The viewer test's quoted sentence matches `docs/adr/ADR-034-geometry-type-admission-and-geoarrow-encoding-selection.md:128`.
  - The KNOWN-LIMITATIONS 37 and 38 comments carry no quotation marks.
- **Mutations:** each row's comment names the commit it was observed over. No record calls a `verify-mutation` run an observation.

## Round-25 checks

- **Class 8:** the two engine overruns are stated with their figures (A2.6, A3.7), and the branch's §7 is unedited. The explicit class 8 label is deferred (see D-2). This is a record finding under the proportional-gates rule.
- **Class 9:** none.
- **Mutation wording:** passes.
- **Test-text pins:** no amendment pins test text by hash at a branch commit, and every branch commit is named by id.
- **Five-line form:** none.

## Documentation and record (each must be fixed before the merge)

- **D-1 (medium): the ML-1 generator's doc names a consumer that does not use the fixture.**
  - Location: `kernel/tests/manual_walkthrough_fixtures.rs`, lines 365–369 at e89bf9bf.
  - The doc names the shell E2E's LN' step, but LN' opens only `line-l1.parquet` (`FIXTURE_LINE_L1`, `frontends/shell/e2e/regression.mjs`, line 463 at e89bf9bf). No E2E reference to ML-1 exists. This is the same defect as the points gate's D-1, against §2's rule that a generator's doc names only its users.
  - Fix: name T3 only. Also, the L-1 generator's doc (line 339) omits T5, which Part T's fixture table lists.
- **D-2 (low, record): the class 8 record is deferred and never made.**
  - Location: A2.6 and A3.7 each say the class 8 record is made "at the gated head". A3.7 is written at the gated head, but it does not say it is that record.
  - Fix: closing-record item 9 labels the engine product overrun (1,220 against 950) and the engine tests overrun (960 against 900) as class 8, by reference to A3.7 and at the merge count. §7 is not edited.
- **D-3 (low, record): the suites record covers four of §9's six verifiers.**
  - Location: A3.8. Report 3 records no run of `queue --check` or `site --check`. CI runs both (`.github/workflows/governance-ci.yml:166-169`).
  - Fix: the closing record cites the CI run at the reviewed head for both.
- **D-4 (low): KNOWN-LIMITATIONS item 37's draft does not say how casings layer across batches.**
  - Location: `KNOWN-LIMITATIONS.md`, line 360 at e89bf9bf, against `buildLayers.ts`, lines 398–427 at e89bf9bf.
  - `buildLayers` pushes each batch's casing and then its line, so a later batch's casing draws over an earlier batch's line where two lines cross. Within one batch, every line draws above every casing.
  - T4 runs on L-1, which is one batch, so it cannot show this.
  - Fix: add one clause to the P6 draft, or have T4 record it as unseen.
- **D-5 (nit): the multilinestring sentence in the `estimate_bytes` doc leaves its bound implicit.**
  - Location: `engine/src/stream.rs`, lines 2284–2287 at e89bf9bf.
  - The geometry offsets are rows + parts + 2 entries, and the `(rows + vertices) * 4` term covers them only when vertices ≥ parts + 2. Every batch of two or more rows meets that. A single-row batch of one two-position part exceeds the term by 4 B. No cut depends on it, because a single row is always emitted, and the sentence's stated fact (parts ≤ vertices ÷ 2) is true. That is why this is not Correctness.
  - Fix: scope the clause to batches of two or more rows. MP-1's polygon sentence has the same shape.

**Noticed, not findings:** `pick.ts`'s doc still says "polygon part" and "exterior ring" (report 2). The file is outside §7's lists, and the statements stay structurally true for a line part, whose ring 0 is the path. Route this to the next piece that touches `pick.ts`.

## For the reviewer and the custodian (I could not check these without a shell)

- **CI at e89bf9bf:** green across platforms. That covers I-4 for BF-L/BF-ML and D-3. A red CI is an Evidence failure.
- **§6:** run the four instruments at the base. No worker report did; PL-3 requires them.
- **Hashes:** the five files' and the default fixture's sha256, and `MIXED_KINDS_DRAFT`'s span hash.
- **PL-2:** the re-run.
- **§7:** the count by its command, with B = merge-base.
- **Commit 26d4ccc0:** the one-commit literal check.
- **Empty diffs:** `lod.rs`, `renderer/src/style.rs`, `protocol/data-plane/`, `kernel/src/publish/`, every ADR, and the MP-1 and points forms.
- **The PR body:** asks for a merge commit, names the OPEN rulings, and names B.

No ADR is needed.
