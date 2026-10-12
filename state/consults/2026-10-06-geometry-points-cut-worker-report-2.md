*Custodian's filing note (2026-10-06): `geometry-points-cut`'s worker report 2, phase B (the shell, the docs, the P4 generator edits and the re-run), by worker-high (Sonnet 5.5, by its definition) on the custodian's brief. It arrived as the worker's hand-back message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 42d59115baa75256c300a1f80f12c32c763fd5eb88bd3978a4911d46d1918207. Write audit PASS: 14 Edits and 1 Write in the worktree `C:/dev/wt/points`, 13 Writes in the session's scratch folder, and no write in the main checkout (its porcelain unchanged) or under the user's Claude folder. Tool calls Read 24, Bash 145, Edit 14, Write 14, Monitor 1, SubagentHandback 1. Run window from the transcript: 2026-10-06T21:01:44.829Z to 2026-10-06T22:05:35.940Z. The custodian checked: origin's branch head is 7620550a, the worktree is clean, and §7's command at 7620550a gives 2,621 lines over 53 files.*

---

**Phase B of `node:geometry-points-cut@g3` is built and pushed.** Commits 4 and 5 are done, including the P4 generator edits and the P4 re-run. The worktree `C:/dev/wt/points` is clean, with HEAD = origin/cut/geometry-points-cut = `7620550a8a5cbf1bca5f9f43059c28fe834115af`. All the checks you listed passed, with one shared-run failure noted below. Every ordinary push went to origin with no force.

## Commits (each signed off)
| hash | subject |
|---|---|
| `70bcb3295970937c02105751ff8b9399bd3689e0` | feat: points cut, shell (V-P, SH-P1 to SH-P7), V-T and PT' |
| `55df46fd1b52de15f152439dd15664f75b1f04a6` | docs: points cut, KNOWN-LIMITATIONS 31 to 36, the owner's indexes, Part P and Part S's two notes |
| `ac54f4d399b0c05379f4a9e1145b6abac7927e65` | test: points cut, the P4 generator's rows #2, #4, #5 and its P1 and P2 literals cite the points form |
| `7620550a8a5cbf1bca5f9f43059c28fe834115af` | docs: points cut, the P4 admission table regenerated at ac54f4d399b0c05379f4a9e1145b6abac7927e65 |

I split commit 5 into docs, generator edits and results (three commits), because the re-run had to run at a clean committed tree.

## V-P (PP-4 holds)
- `@deck.gl/layers` resolves to 9.3.9 in `package-lock.json`.
- `dist/scatterplot-layer/scatterplot-layer.js` is an instanced layer, so one datum is one point.
- The vertex shader sets `geometry.pickingColor = instancePickingColors`. core's `Layer.calculateInstancePickingColors` fills that with `encodePickingColor(i)` for datum index i (`@deck.gl/core` 9.3.9, `dist/lib/layer.js`).
- `UNIT` in `dist/lib/constants.js` is `{common, meters, pixels}`, so `radiusUnits` and `lineWidthUnits` accept `pixels`.

## §7's count by its command, at head
Command: `git diff --numstat d3fe6055 HEAD -- . ':!engine/GEOMETRY-POINTS-PREREGISTRATION.md' ':!engine/ADMISSION-RESULTS.md'`.

**Total: 2,621 lines (+2,358 −263) over 53 files, against 3,220 over 64. The kernel group is over its ceiling.**

| group | lines | files | ceiling |
|---|---|---|---|
| engine product | 573 | 6 | 750 |
| engine tests | 806 | 7 | 850 |
| kernel | 268 | 4 | 220, over by 48 |
| protocol | 209 | 17 | 260 |
| shell product | 245 | 7 | 380 |
| shell tests and seams | 425 | 9 | 560 |
| docs | 95 | 3 | 200 |

- Kernel was 260 after phase A; the kernel README's index lines added 8. This is for you to record as class 8; §7 is not edited.
- The 7 engine-tests files include BF-P, a binary counted as a file only.

## Mutations
Each was applied by hand over `edbc0f3c` on the uncommitted tree of commit `70bcb329`. The named test was run alone, the failure was recorded in the test's own comment, and the file was restored. A byte-identity check confirmed each restore. No `verify-mutation` run was used. All rows are reverted: yes.

| row | test | mutation | failing assertion |
|---|---|---|---|
| SH-2 (changed) | `a mismatched, unknown or missing geometry_encoding throws UnexpectedEncodingError (SH-2)` | delete the throw in the encoding check | first assertion (multipolygon under a polygon expectation): `expected function to throw an error, but it didn't` |
| SH-P1 | `the engine's point batch decodes to one single-position part per row, partToRow the identity, bits unchanged (SH-P1)` | delete the point branch, so the row is walked as a ring list | `TypeError: ring is not iterable`, thrown at the decode call before any assertion |
| SH-P2 | `a point batch gives one pickable ScatterplotLayer … (SH-P2)` | ignore `kind` | `expected SolidPolygonLayer{…} to be an instance of ScatterplotLayer` |
| SH-P2 cache rule (extra test) | `a point batch's data is reference-stable at an unchanged origin and recomputed after a recenter (SH-P2, the cache rule)` | delete the cache hit in `pointsForBatch` | `expect(second).toBe(first)` |
| SH-P3 | `an ordinal on a point resolves that row's id, anchored at the point (SH-P3)` | the point row produces no part | `expected null not to be null` |
| SH-P4 spacing (test 1 of the SH-P4 row, split in two) | `the spacing branches: grid, coincident, collinear, one point and none` | `Math.sqrt(w * h)` without `/ n` | `expected 90 to be 9` |
| SH-P4 selector (test 2 of the SH-P4 row) | `selects the average feature extent for a polygonal open and the average point spacing for a point open` | return `averageFeatureExtent` for points | `expected 10 to be close to 36.666666666666664` |
| V-T | `the engine's point batch, offered as a partition, is refused at the encoding check` (`partition-point-encoding.test.mjs`) | delete the viewer's `geometry_encoding` check | the `e.state` assertion: got `partition-decode-failed`, expected `envelope-encoding-mismatch` |
| PT' | no mutation | operator-run | not run; `node --check` only |

- SH-P3's first observation failed at a `partCount` precondition. I removed that precondition and re-observed, so the recorded failure is at the pick assertion.
- The P4 generator test's own recorded mutation was not re-observed. Its test was edited but is not new.

## Checks, with exit codes
All 0, except `npm test` in the shared run, which failed once (below).

| check | rc | detail |
|---|---|---|
| `cargo test --workspace --locked --features spatial-engine/fixture` | 0 | 885 passed, 0 failed, 49 ignored |
| `cargo fmt --all --check` | 0 | |
| `cargo clippy --workspace --all-targets --locked --features spatial-engine/fixture --message-format=short` | 0 | 43 distinct warnings, none on a line this branch adds (checked by a diff-hunk intersection against `d3fe6055...HEAD`), 0 errors |
| `cargo test --manifest-path frontends/shell/src-tauri/Cargo.toml --locked` | 0 | 68 passed, 0 failed |
| `npx tsc --noEmit` in `frontends/shell` | 0 | |
| `npm test` in `frontends/shell` | 0 | 73 files, 1,119 tests |
| viewer `node --test "scripts/**/*.test.mjs"` | 0 | 82 pass |
| `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs` | 0 | 450 pass |
| `node scripts/plan/verify.mjs` | 0 | |
| `node scripts/plan/verify-cites.mjs` | 0 | |
| `node scripts/plan/verify-quotes.mjs` | 0 | 121 checked, 90 verified, 30 baselined |
| `node scripts/plan/verify-test-claims.mjs` | 0 | 502 claims |

- Also run (they are CI's `npm run verify` steps, so beyond your list): `node e2e/citationIntegrity.test.mjs` (30 passed, rc 0), and `npm run build` in the viewer and the shell, which the src-tauri build needs.

**Timing-sensitive failure in a shared run, not recorded as a failure.** `npm test` once failed `src/notices/noticeDeterminism.test.ts` ("produces byte-identical output across two independent runs, including two real cargo calls"). It ran while my held src-tauri cargo build was running, and that test makes real cargo calls. Re-run alone on an idle machine, `npm test` passed: 73 files, 1,119 tests, rc 0. You may want to re-run it alone.

## §6, the four files' sha256 (equal at base and head)
G-1 (`the_polygon_only_wire_matches_the_golden_file`), G-2 (`the_published_partitions_and_manifest_match_the_golden_file`) and BF-1 (`the_committed_batches_equal_the_engines_output_from_a_real_open_and_stream`) all passed in the workspace run at head. The default fixture hash is unchanged, since G-1 is green. The only file added under test data is `engine/tests/data/geoarrow/lv95-point-batch.arrows`.

| file | sha256, base `d3fe6055` = head |
|---|---|
| `engine/tests/data/golden/polygon-wire.golden` | d810e6a8659c82c322231d9c784e8d9fbb4e0f074bb325e3cebf1f94ddcab15d |
| `kernel/tests/data/golden/publish-partitions.golden` | 5b10ddd64ca60db9009ab1453cf99098353e4a9b93bcf012dca089586b0c7e01 |
| `engine/tests/data/geoarrow/lv95-polygon-batch.arrows` | d0afe93e143c0e2de16f7fad6eb9272a687195dfec6f68999e7dc7b24ba78197 |
| `engine/tests/data/geoarrow/lv95-multipolygon-batch.arrows` | 831eb54076cf565eac33b673749f8fa3a6a2f481ff3c831a371f740abf6673fa |

## The P4 re-run
- It ran on the committed, clean tree `ac54f4d399b0c05379f4a9e1145b6abac7927e65`, and the header of `engine/ADMISSION-RESULTS.md` names it. The file is the generator's output, never hand-edited.
- 17 rows were opened and 0 were unrun. The DEVIATION rows are #12 and M-4, as at the base.
- **#2:** refused as `engine.crs_undeclared` (was `engine.geo_metadata`).
- **#4:** refused as `engine.format_default_contradicted` at level `metadata` (was `engine.geo_metadata`).
- **#5:** admitted under the format rule (`crs:format-default`, `axis:format-override`, `geoparquet:1.0.0#crs-absent-default`, degree, sanity `metadata`, session-ordinal), boundary-8 component unrun. It was `engine.geo_metadata`.
- **Totals:** admitted-under-format-rule 2→3 and refused-by-name 7→6.
- **Predictions table:** PP-2 held. P1 is the empty set and P2 is #4 and #6, both "borne out". P6's count reads 2 `crs:format-default` instances. The boundary-8 line names #3, #5, #8 and #12.
- No row other than #2, #4 and #5 changed.

## Deviations and decisions, with the class by my reading
1. **Part P collision.** `MANUAL-WALKTHROUGH.md` already has a Part P (crs-unit-fact-and-bounds), and Part O is reserved. I kept the form's name and rows P1 to P7, and the new Part's first paragraph says so. A reader may still mistake "P2". Class 2, for you to decide; renaming would break the form's and Amendment 1's cross-references to "Part P, row P2".
2. **No fixture draws a pile of points (Amendment 1 item 5).** P-1's six points are at least 10 m apart, and the average-spacing refusal begins before their symbols touch, so P-1 shows no pile that the hover still answers. Row P2 step (d) has a "no pile available" fallback, and the result log has its own blank verdict line. Closing the verdict needs a pile fixture, which is a new generator and so a scope addition (class 9). I did not add one.
3. **KNOWN-LIMITATIONS items 31, 32 and 33 are edited in place for Point**, because the form's §2 lists them and they would otherwise state falsehoods. Your brief named only 35 and 36. Items 35 and 36 are as drafted, each with a source comment. This is within the form.
4. **Extra tests beyond §4's rows:** the SH-P2 cache-rule test, and SH-P4 written as two tests (spacing branches, and the selector). Each carries a mutation. Class: yours to name.
5. **`buildLayers`'s `kind` is a required parameter, with no default**, as `geometryEncoding` is. This changed 25 existing call sites in `buildLayers.test.ts` (+25/−25 of that file's lines). The polygonal path is behaviourally unchanged.
6. **P4 generator literals beyond the listed ones.** I made the boundary-8 summary line (and its table row label) name #5, since #5 now carries that unrun component. The generated P1 and P2 lines print an empty set as "none". Class 3 by my reading.
7. **Kernel group over its ceiling:** 268 against 220 (class 8, §7 not edited).

## Noticed and not done
- **The MP' E2E step still opens F-1, which has no covering.** Under C-1 it likely meets `engine.no_covering_bbox`. I did not edit it, because a new step is "never an edit to an existing one". The F-1c generator's own comment calls it the fixture for MP'.
- **The generated P3 text** still names only #8 as excluded by the primary-provenance precedence. #5 is now excluded too. The result is still "borne out", and I did not edit that literal.
- **`ADMISSION-PREREGISTRATION.md` rows 2, 4 and 5** now differ from the generator's predictions. I did not edit it, as the form says.
- **The two index "Declared limits" lines are not edited.** That would be an index edit outside §2's list, which block-on-sight item 18 forbids. The engine README's line lists 31, 33 and 34 but not 35 or 36.
- **No KNOWN-LIMITATIONS line exists for a Point file with no covering** meeting `engine.no_covering_bbox` on the canvas. The form lists none.

## Machine paragraph
Held shared runs, each a single command with only its environment assignments in front of it: `cargo test --no-run` for the P4 test, the P4 re-run, `cargo test --workspace`, `cargo clippy`, and the src-tauri `cargo test`. Each ran in its own Bash call.

Not held, because each is light and under about three minutes:
- `cargo fmt --check`;
- `npm ci` in `renderer/bundle-viewer` (its `node_modules` was missing; git-ignored);
- the viewer and shell `npm run build`;
- vitest and tsc;
- the node suites and the verify scripts (the 450-test suite took about 64 s).

Cold builds all ran under a hold. The src-tauri crate recompiled duckdb, which took about 20 minutes inside that hold. No refused hold, and no exit code 96 to 99.

## Pre-gate self-check
- **Cross-module:** `buildLayers` and `decodeBatch` consume the engine's real BF-P batch through `loadBatchFixture` and `decodeBatch`; there is no hand-built imitation of the interface. The viewer test feeds the real batch to `decodePartition`.
- **Completion claims:** each points to a test name, a commit or a command's exit code, as above.
- **User-facing text:** every new operator string is `[P6 placeholder]`: the `UnexpectedEncodingError` and `PickCeilingExceeded` texts, and the KNOWN-LIMITATIONS drafts. None describes behaviour not implemented at this commit.
- **Tests reach their intended assertion**, not only setup. SH-P1's mutation fails with a `TypeError` at the decode call, before any assertion; that is stated in its comment.
- **Caller grep:** `POINT_RADIUS_PX`, `geometryKindOf`, `ENCODING_POINT`, `averagePointSpacing` and `pickResolutionExtentFor` are exported, and all have a product caller (`buildLayers.ts`, `WorkingCanvas.tsx`, `pickResolution.ts`). `PolygonalLayer` is a type used only in `buildLayers.ts`. No `pub` Rust item was added in phase B.

**Files touched in phase B.** In `frontends/shell/src/canvas/`: `decodeBatch.ts`, `buildLayers.ts`, `pickResolution.ts`, `WorkingCanvas.tsx`, `limits.ts`, `PICKING.md`, and their tests (`decodeBatch.test.ts`, `buildLayers.test.ts`, `pick.test.ts`, `pickResolution.test.ts`). Also: `testUtils/batchFixtures.ts`, `e2e/regression.mjs`, the new `renderer/bundle-viewer/scripts/partition-point-encoding.test.mjs`, `KNOWN-LIMITATIONS.md`, `engine/README.md`, `kernel/README.md`, `frontends/shell/MANUAL-WALKTHROUGH.md`, `engine/tests/admission_p4_corpus.rs` and `engine/ADMISSION-RESULTS.md`.

Model as the harness reports it: Sonnet 5.5 (`claude-sonnet-5-5`). No model override, and no context handoff received or produced. I wrote nothing to the main checkout; its porcelain is unchanged.
