Reviewed: PR #246 at 35085072824b5bcd657c37e3ca1603cbb1693e93 (base c1f782db), gate 1, reviewer
Verdict: PASS WITH NOTES

`cut/b1-shell-half-pr-a @ 35085072824b5bcd657c37e3ca1603cbb1693e93`. I read the form at main e408606d, Amendment 5 first and then 4 to 1, and every consult the brief names.

Nothing blocks. Every Correctness and Evidence check closed. There are four Documentation findings. Each must be fixed before the merge, and none needs a re-gate.

## Correctness
None.

## Evidence
None that blocks. The 15 mutations each fail their named test at the head, and §7, the lock diff, the text checks and the suites all came out as the PR body says. One timing-sensitive failure is reported for you to re-run alone (under "What I checked", item 6).

## Documentation (each must be fixed before the merge, no re-gate)

**D1. The §7 per-file overruns are not yet recorded as class 8 in the form.**
- At the gate head there are four overruns, and no others. One of them, `frontends/shell/src/canvas/buildLayers.ts` 7 of 6, is in no amendment yet. Only the PR body and a filing note name it.
- `document.ts` is recorded in Amendment 4 item 1. The two manager test files are only declared ahead in Amendment 4 row 2.
- Fix: one closing-amendment row, references only, with §7 not edited. Proposed words (a record row, not the human's wording):
  > Class 8, by §7's command over c1f782db...35085072: `frontends/shell/src/canvas/buildLayers.ts` 7 of 6 (Amendment 2 item 5's four lines); `frontends/shell/src/style/document.ts` 7 of 6 (Amendment 4 item 1); `frontends/shell/src/streaming/viewportStreamManager.test.ts` 88 of 40 and `frontends/shell/src/residency/candidateArmSession.test.ts` 149 of 60 (Amendment 4 item 2). A-P 467 of 1,094, A-T 788 of 1,860 and A-E 433 of 570; Amendment 3's rows 19 of 48, 157 of 320 and 36 of 48; §7 is not edited.
- Clause check: my count script's output over the form's §7 command, listed under "What I checked", item 3.

**D2. The PA-E3 sentence in `frontends/shell/e2e/README.md:819` (at the head) is stale.**
- Row 15's commit 62d15cf1 added the `id = N` re-read, and it is now the half that catches PA-E3's mutation. The README was last edited at 3e14068e and still omits it.
- The span, byte-copied: `` `PA-E3` (six features clicked unfiltered show at least two different zones; under `zone = 'residential'` three features clicked all show `residential`). ``
- Replacement words (the README entry marks itself as not the human's wording):
  > `PA-E3` (six features clicked unfiltered show at least two different zones; each of them, clicked again at the same point under the filter `id = N`, shows the same id and zone; under `zone = 'residential'` three features clicked all show `residential`).
- Clause check against `stepZones` in `frontends/shell/e2e/attributes.mjs` at the head:
  - "six features … at least two different zones": `distinctFeatures(..., "PA-E3 unfiltered", 6)` and `zones.size >= 2`.
  - "clicked again at the same point under `id = N` … same id and zone": the `reread` loop applies `` `id = ${id}` ``, calls `zoneOf(point)` and expects `alone.id === id && alone.zone === zone`.
  - "under `zone = 'residential'` three … `residential`": `applyFilter("zone = 'residential'")`, then `distinctFeatures(..., 3)` and `every(... === "residential")`.
- The worker applies it and the PR body lists it.

**D3. The PR body's Runs bullet presents the `skp.projection_` grep as evidence for H2, but the grep is not shown to detect a refusal.**
- The full-series report (its line 66) gives the count as 0 "mutation runs included". In the PA-E1 mutation run, `filter-zoned.parquet` has one projectable column (`zone`). The mutated `projectionFor` returns `[]` for it, and `[]` is refused as `skp.projection_empty_list` at the SKP boundary (`protocol/skp/SKP-V0.md:1179` at the head; the custodian's reading in the 3e14068e evidence report's filing note).
- H2 itself holds: its discriminator in §0.4 is the suites, and all 15 suites passed.
- The span, byte-copied: `` each rc 0 on its first run; no `skp.projection_` line in any run's app stderr or session log (H2); ``
- Replacement words (the worker's, not the human's):
  > each rc 0 on its first run, which is H2's discriminator (§0.4); the tester's grep found no `skp.projection_` line in any run's app stderr or session log, but it also read 0 in the PA-E1 mutation's run, where `filter-zoned.parquet`'s projection becomes an empty list that the SKP boundary refuses, so it is not shown to detect a refusal;
- Clause check:
  - "rc 0 on its first run": the report's table, "Re-run: none" on all 15 rows.
  - "discriminator": the H2 row of §0.4.
  - "read 0 in the PA-E1 mutation's run": report lines 66 and 81.
  - "empty list … refuses": `projection.ts` with the recorded mutation applied, on the one-column schema that PA-E3 asserts (`["zone"]`), plus SKP-V0.md:1179.
- The worker applies it.

**D4. Two records the closing amendment should add (record rows, not the human's wording).**

(a) The joined text check in Amendment 2 item 2 (a), read literally, keeps the space after the `*`. The joined line then has a double space, and `Proposed, so it binds nothing` reads 0 at B in both runs. That fails the self-test the same amendment says passes. Removing the whitespace after the marker as well (this is what both workers did, and what I did on the second run) makes it positive at B over `viewTransitions.ts` lines 6 and 7. Proposed row:
  > Class 3: Amendment 2 item 2 (a)'s joined run is read with the whitespace after the comment marker also removed; under that reading `Proposed, so it binds nothing` is positive at 55618ab5, and every pattern is zero at 35085072 under both readings.

(b) §5 declares every existing string unchanged except §2.7's and §2.4's. PR A rewords the existing `feature.inspect` class-C statement at `frontends/shell/src/console/surfaceRegistry.ts:352` (commit 96a78eff; `ConsolePanel.tsx` shows it). The new text is true and marked P6, and Part AC row 10 sights it, but no amendment admits the change. Proposed row (the architect may choose to revert instead):
  > Class 1: the `feature.inspect` statement in `frontends/shell/src/console/surfaceRegistry.ts` is reworded at 96a78eff under §2.6's `surfaceRegistry.ts` entry, an exception to §5's declared-unchanged strings; it is a P6 placeholder sighted at Part AC row 10.

I give no replacement for the string itself, which stays under P6.

## §8, item by item (at 35085072)
1. Met. All 54 files are inside §2.6 plus Amendment 3 (51 code files and 3 records; `FeaturePanel.tsx` and `workspaceState.test.ts` are listed but untouched). Nothing is under `protocol/`, `kernel/src`, `engine/`, `src-tauri` or the bundle viewer, and nothing in §2.1 is touched (`e2e-test-surface.ts`, Filter and Publish files, `HoverReadoutView`, the `decodeBatch` frame check, the existing ceilings). In `residency/`, the edit is the `columns` dependency and its pass-through, as Amendment 4 item 2 orders.
2. Met. No lockfile changes. The only manifest change is one script line in `frontends/shell/package.json`.
3. Met. No SKP command, field or literal; no `+`/`-` line touches `SKP_VERSION`.
4. Met. `block.data` is indexed only in `values.ts`'s `readRow`. `rows[dst] = srcIdx` is written in `addBatch`'s `keepIdx` loop. The trim carries the block as the same object.
5. Met. `readCell` turns every integer into a `bigint`, and PA-U4's mutation is caught.
6, 7, 10, 11. Not applicable to PR A.
8. Met. `projectionFor` returns `null`, never `[]`, and reads only `projectable`.
9. Met. A NULL shows the marker; an empty string shows as an empty string (asserted in PA-U4).
12. Met. "undo" appears in no added line.
13. Met. Every new symbol has a product user (caller grep under item 1 below). The exports used only by tests (`ATTRIBUTE_NULL_MARKER`, `UnexpectedProjectionError`, `BatchAttributes`) are each used in product inside their own module. The `?.` at `WorkingCanvas.tsx:1064` on the now-required prop is disclosed and harmless.
14, 15. Met. The new messages state the shell's own facts and are all marked P6. The reworded `feature.inspect` string is D4 (b).
16. Met. No performance figure; harness numbers are labelled as bounds.
17. Met. PA-U2 compares against the committed request fixture's keys. `attributeBatchIpc` matches the shape built in `engine/src/envelope.rs`. PA-E1 and PA-E3 passed end to end at the head (tester). The rebuild seam is covered by PA-U8 to PA-U10 from a real decode.
18. Met except D1. Amendment 3 was committed on main (708f4169, 19:09:53+02:00) before 11ff097d (19:30:23+02:00), and Amendment 4 (0775b4bd, 21:17:53) before b64cf890 (21:23:42). No `verify-mutation` run is called an observation. Test text at 37b9d756 is named with its commit and not pinned by hash.
19. Met. No quote of the human's words, no line cite into the ledger in added text, no bare self-line.
20. Met. No OPEN-16 code; the 1c-shared files are edited under OPEN-17 (b).

## What I checked (command, exit code, result)

1. **The diff.**
   - `git diff origin/main...HEAD`, `--name-status` and `--name-only`: rc 0 each, 54 files, all 3,909 diff lines read. Merge base `c1f782db…`, origin/main `e408606d…`.
   - Greps for protocol/kernel/engine/src-tauri/bundle-viewer paths and for §2.1's files: 0 matches each (grep rc 1).
   - Caller grep over product files only: every new symbol has a non-test importer or user in its own module.
   - ADR-004: the only `JSON.parse` on the decode path reads the `attribute_columns` schema metadata (a list of names), which `engine/src/envelope.rs` writes as JSON on purpose. Not feature data. ADR-003 and CRS: nothing touched.

2. **Mutations, in a throwaway worktree `C:/dev/wt/m4a-g1r` detached at the head.**
   - Setup, each in a shared hold:
     - `npm ci` in `frontends/shell`: rc not printed (my line lacked `echo`); the call returned without error and the log ends normally.
     - `npm ci` in `renderer/bundle-viewer`: rc 0.
     - `npm run typecheck`: rc 0. This builds the viewer, generates the notice and runs `tsc --noEmit`, so `tsc` is clean at the head (Amendment 3 item 9).
     - A first `generate:notice` alone: rc 1, because the viewer metafile was missing. Fixed by the typecheck run.
   - Run 1, my script: rc 0. Run 2: rc 0. Run 1's three manager and App test files could not import `src/generated/NOTICE.txt`, so those three were not observations there; they were re-run in run 2 after the typecheck.
   - Each of the 15 named tests passed unmutated. With its mutation applied alone it failed by name ("Tests 1 failed"); it was reverted with `git checkout --` and the porcelain was `""` after every one. Errors, at 35085072:
     - PA-U1: `expected [] to be null`
     - PA-U2: `…to have property "columns" with value null`
     - PA-U3: `expected [ 'n', 'tag' ] to deeply equal [ 'tag', 'n' ]`
     - PA-U4: `'9223372036854775808'` against `'…807'`
     - PA-U5: the row read by the GPU ordinal gives a deep-equal failure
     - PA-U6: `… to be 'not-held'`
     - PA-U7, baseline manager: `expected [ null ] to deeply equal [ [ 'area', 'zone' ] ]`
     - PA-U7, tile manager: `[ null, null, null ]`
     - PA-U7, first look: `[ null, [ 'area', 'zone' ], …]`
     - PA-U8: `expected null to be {…}`
     - PA-U9: deep-equal failure on the `tag` cell
     - PA-U10: `expected null to be 'not-held'`
     - PA-U11: deep-equal failure on `inspect.set`
     - PA-R1: `expected [ 'n', 'f' ] to deeply equal [ 'tag', 'n', 'f' ]`
     - PA-R2: `expected [ '', '0' ] to deeply equal [ 'north', '10.5' ]`
   - Removed with `git worktree remove` (rc 0, no `--force`; its porcelain was empty first).

3. **§7.**
   - The form's numstat command over `c1f782db…35085072`: rc 0. My count script: rc 0.
   - 51 files, 1,900 lines (1,698 added, 202 deleted).
   - Overruns: exactly the four in D1.
   - Groups: A-P 467/1,094, A-T 788/1,860, A-E 433/570 (`attributes.mjs` 351/420, generator 82/90). Amendment 3's rows: 19/48, 157/320, 36/48.
   - The nine null-fill files carry only Amendment 3 item 6's four forms.
   - Outside the count: `MANUAL-WALKTHROUGH.md` 29/160, `e2e/README.md` 12/60, `KNOWN-LIMITATIONS.md` 8/70.

4. **Lock diff.**
   - Lockfile pattern over the name list: 0 matches (grep rc 1).
   - `git diff --stat origin/main...HEAD -- Cargo.lock '*.lock' '**/package-lock.json' package-lock.json`: rc 0, 0 bytes.

5. **§4's text checks** (my script; rc 0 on every run; line-by-line and joined).
   - At the head: all five patterns are 0 in both runs, in both readings (`requests none`, `requests no projection`, `gains no parameter`, `carries no attributes`, `Proposed, so it binds nothing`).
   - At B 55618ab5, positives:
     - `requests none`: `document.ts:20` and `style_shell_agreement.rs:39`
     - `requests no projection`: `client.ts:122` and `client.test.ts:43`
     - `gains no parameter`: `types.ts:262`
     - `carries no attributes`: `buildLayers.ts:31`
     - `Proposed, so it binds nothing`: joined run only, and only with the whitespace after the marker also removed (D4 (a)).
   - At b24e5281aef6…: `requests none` at `buildLayers.ts:33`, 1/1.

6. **`npm run verify` in `C:/dev/wt/m4a`** (shared hold).
   - Run 1: rc 1. `src/notices/noticeDeterminism.test.ts` timed out at 30000 ms, after 20 lines of "Blocking waiting for file lock on package cache". The test is not touched by the diff. This is timing-sensitive in a shared run, so I do not record it as a failure; it is for you to re-run alone.
   - Run 2: rc 0. 104 test files and 1,413 tests passed. The porcelain was empty afterwards.

7. **`cargo test -p spatial-renderer`** with `CARGO_TARGET_DIR=D:/wt-targets/m4a`, `CARGO_BUILD_JOBS=8` and `RUST_TEST_THREADS=8` (shared hold): rc 0. 30 + 1 + 1 (`style_shell_agreement`) + 0 passed, none failed.

8. **Governance checks at 35085072** (the scripts last changed at a382c508).
   - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"` (shared hold): rc 0, 527 of 527 passed. The guardian parity case did not occur.
   - `verify.mjs --offline`: rc 0, PASS.
   - `verify-cites.mjs`: rc 0, PASS over 2,245 files.
   - `verify-quotes.mjs`: rc 0, 131 checked, 100 verified, 30 baselined, 0 errors.
   - `verify-test-claims.mjs`: rc 0, 621 claimed tests.

9. **The PR body.**
   - My words script: rc 0. All seven word sets are found exactly once, byte for byte, at the head in the file each names, and each matches the form's text.
   - Figures:
     - §7: 51 files and 1,900 lines, the four overruns, and the outside-count figures all match.
     - The 11 commit lines match `git log --reverse origin/main..HEAD` (diff rc 0).
     - The vitest figures match my run 2.

10. **CI.** `gh pr checks 246`: rc 0, 13 of 13 pass. `gh run list`: every run at head sha 35085072824b… concluded success (DCO, ported notices ×2, exposure scan, Rust workspace, shell ×2, fmt, governance).

**Observations, no class, nothing owed:**
- `isReadableAttributeType` (`values.ts:34`) reads Utf8, Bool, Int and Float32/64. The engine also lets LargeUtf8 and Utf8View through unchanged (`admit_attribute_type` in `engine/src/attributes.rs`). The engine reads schemas through DuckDB's default Arrow export, and no `arrow_large_buffer_size` or `produce_arrow_string_view` setting appears in `engine/src` or `kernel/src`, so the shipped build does not reach those types. If a later source did, every batch would be refused. Worth widening the reader when that changes.
- The custodian's reading of PA-E3's failure under the PA-E1 mutation (an empty projection refused) is consistent with the code.

**End state.**
- `C:/dev/wt/m4a`: porcelain empty, HEAD 35085072824b5bcd657c37e3ca1603cbb1693e93.
- `git worktree list` no longer shows `m4a-g1r`.
- A process listing shows no vitest, node or cargo process of mine; the only matches were the listing's own shells.
- Every heavy command ran in a shared hold; all were granted, with no exit code 96 to 99.
- Scratch files are named `m4a-g1r-*` in my scratch folder. I made no commit, push or PR action.
