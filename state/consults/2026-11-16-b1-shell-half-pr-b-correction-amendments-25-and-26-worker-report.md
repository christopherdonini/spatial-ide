# b1-shell-half PR B (PR 327): the correction of Amendments 25 and 26, built at 2f704773; the worker-high's report

*Filed by the custodian from the hand-back: 10906 bytes, sha256 b925a165768387919499692adcb7dfec14e52c9649637cc5b603b9d1e1c77f92, claude-opus-5-5, 146 calls by its transcript. Byte for byte below the rule.*

---

Built: b1-shell-half PR B's correction (Amendments 25 and 26) at 2f7047737f64d9ca8a7a06332672ab9b3d25c9bc

**Where checks** (all as given). Brief 13876 B, sha256 73d10959…f9ca. Form sha256 97cdbaaa…6e616, last commit 20844fd884789ceb6a1a986ff275a8c6838b6d64. Worktree HEAD was 6f7e744c…de531f1a, parent 0cf05452…6586358, branch cut/b1-shell-half-pr-b, porcelain empty, ls-remote 6f7e744c. The 2abf3ea0..origin/main diff printed nothing (rc 0). Both `.package-lock.json` files exist. Free space: C: 50G, D: 375G. node v24.18.1, vitest/5.0.1.

**Commits** (the checks and exit codes; every focused run used `npx vitest run --maxWorkers=2`):
- **U1** fb9a825aff0596a0f84d2ad22bd640ea6de03c74 `test: …(PB-U13, PB-U9 (vi), PB-U14, PB-U15, PB-R5)`. 5 files, +138/−3. typecheck 0, citation-integrity 0 (30 passed), verify-cites 0, verify-test-claims 0, profile-path-scan --staged 0.
- **U2** 676553db8fdcbd0e746cc1f1d83a373bd2affb77 `fix: Colour by and One colour record their class C rows…`. surfaceRegistry.ts +16/−1, StylePanel.tsx +2. All five checks rc 0. Focused run: 4 failed | 53 passed; the 4 are U1's predicted tests still waiting for U3/U4. PB-U13 and the completeness test pass in the verbose run.
- **U3** 9beac0ebaccfe1b7b7dbf07f2ef1bd1b0290cf80 `fix: Colour by's Cancel cancels only the request its own wait issued`. categoryCases.ts +4/−2, tableSource.ts +6/−1. typecheck 0. PB-U9 (i) to (vi) pass.
- **U4** 09bba48e3efcdd0b38d6e615222de67638e13806 `fix: opening a file ends Colour by…`. App.colour.test.tsx +8/−5, App.tsx +3, StylePanel.tsx +18, workspaceState.ts +5/−3. typecheck 0. 21 passed (21).
- **U5** 2f7047737f64d9ca8a7a06332672ab9b3d25c9bc `docs: App's colour-column effect cites OPEN-20 (a)`. App.tsx +1/−2. typecheck 0, citation-integrity 0, verify-cites 0, verify-test-claims 0 (812 claims), profile-path-scan --staged 0 (nothing was staged at that point). Focused run over 35 files (src/style, workspace, console, table, App*.test.tsx): `Test Files  35 passed (35)` / `Tests  300 passed (300)`, rc 0. verify-quotes --show-cites on the changed files: PASS, rc 0.

**U1's run** (at 6f7e744c plus the staged tests): rc 1, `Tests  6 failed | 36 passed (42)`, as predicted. The failing lines:
- `AssertionError: every feature in the Fill colour, the default's: expected [Function color] to deeply equal [ 66, 133, 244, 180 ]`
- `AssertionError: expected [ 'style.resetToDefault' ] to deeply equal [ 'style.colourBy', …(2) ]`
- `AssertionError: cancel calls after Colour by's Cancel, the Table's request among none of them: expected [ [ 'sh_1' ], [ 'sh_2' ] ] to deeply equal [ [ 'sh_1' ] ]`
- `AssertionError: the Colour by row at the apply, before its outcome: expected [ +0, +0 ] to deeply equal [ 1, +0 ]`
- `AssertionError: the Colour by line after the match ended from outside: expected '[P6 placeholder] Coloured by tag: 2 d…' to be '' // Object.is equality`
- `AssertionError: the style after a later admission under the same dataset key: expected { fillColor: '#123456', …(4) } to deeply equal { fillColor: '#123456', …(4) }`

**U2's script** is `<S>/m4b-c25-apply-rows.mjs`. It takes each fence from `git show origin/main:<ruling>` after an anchor that must occur exactly once, refuses a multi-line fence, writes each statement with JSON.stringify, and inserts both rows before `style.resetToDefault`. The owner is `'docs/03 §"The action console"'`.
- I showed the match by command, twice. First, `--check` reads each literal back out of the file and compares bytes: `style.colourBy: statement bytes 444 fence bytes 444 equal true` and `style.oneColour: … 234 … 234 equal true`. Second, independent sha256: ruling line 16 = statement = d18f6d6d…28d7 (oneColour), and line 22 = statement = 7738284e…71b6 (colourBy).
- **U5's D1 check:** `<S>/m4b-c25-apply-d1.mjs`, `--check` gave `D1: comment bytes 384 report bytes 384 equal true`. Report line 59 without its quotes and App.tsx:2054 without its indent both hash to 35c7cd05…d98b.

**The production code** (worktree lines; full diffs are in the commits):
- surfaceRegistry.ts:201-214: the two rows, statements as above. :188-189: one doc-comment sentence.
- StylePanel.tsx:200: `recordNamed("gui-action", "style.colourBy")`, after the first return and before the wait. :228: `style.oneColour`, at the top of `handleOneColour`.
- StylePanel.tsx:105-119: a `[style.fillMatch]` effect clears the line when the match ends with `endedHereRef` false. `endedHereRef` is set by `handleFillColor`, `handleOneColour` and `handleReset`. An `[offered]` effect resets a column the candidates no longer list.
- tableSource.ts:45, :122, :281, plus EMPTY_TABLE: `request: number`, incremented in `start` and emitted in the snapshot.
- categoryCases.ts:64: `const own = issuedHere ? source.getSnapshot().request : null`. :70: `if (own !== null && source.getSnapshot().request === own) source.cancel()`. The abandon doc comment is updated to match.
- workspaceState.ts:155: `fillMatch` becomes null at a later admission; the other four properties are kept; the action's doc comment says so.
- App.tsx:1169 (`handleAdmitted`): the baseline's `fillMatch` becomes null. App.tsx:2054: D1's words.
- Caller grep for `request`: the only product readers are categoryCases.ts:64 and :70.

**Mutations.** Each was applied by an anchored script and reverted by `git checkout -- <file>`. Every revert left 0 bytes of diff against the index; all failed as declared:
- PB-U13 (1), Colour by's call removed: rc 1, `AssertionError: the Colour by row at the apply, before its outcome: expected [ +0, +0 ] to deeply equal [ 1, +0 ]`.
- PB-U13 (2), One colour's call removed: rc 1, `AssertionError: the One colour row before its commit, and the one commit: expected [ +0, 1 ] to deeply equal [ 1, 1 ]`.
- Amendment 26, `style.setFillColor` re-added: rc 1, `AssertionError: expected [ 'style.colourBy', …(3) ] to deeply equal [ 'style.colourBy', …(2) ]`.
- PB-U9 (vi), `if (own !== null) source.cancel();`: rc 1, `AssertionError: cancel calls after Colour by's Cancel, the Table's request among none of them: expected [ [ 'sh_1' ], [ 'sh_2' ] ] to deeply equal [ [ 'sh_1' ] ]`.
- PB-U14, `const style = rebound.style;`: rc 1, the same line as U1's PB-U14 line.
- PB-R5, baseline line removed: rc 1, `AssertionError: the next commit's steps: expected [ { …(2) }, { …(2) } ] to deeply equal [ { …(2) } ]`. The extra step is fillColor `#4285f4`.
- PB-U15 (1), keep the line: rc 1, the same line as U1's PB-U15 line.
- PB-U15 (2), keep the column: rc 1, `AssertionError: Apply with the chosen column no longer offered: expected false to be true // Object.is equality`.

The U2 and U4 mutations ran over their own staged changes, before those commits. In the U2 runs, PB-U15 also failed; its code was not built yet.

**D4 and D5**, observed at 2f704773; neither comment was edited:
- D4, PB-U5's `++matchFillRevision` mutation: 4 failed | 28 passed. PB-U5: `AssertionError: the trigger after ten pans: expected { getFillColor: [ 17 ] } to deeply equal { getFillColor: [ 7 ] }`. Also the three PB-U12 tests, polygonal, point and line: `AssertionError: deck.gl's view of the getFillColor change for polygonal: expected { matchToOneColour: true, …(4) } to deeply equal { matchToOneColour: true, …(4) }`, the same for point, and `…getColor change for line…`. Each diff is `-   "samePaintAgain": false,` / `+   "samePaintAgain": true,`.
- D5, PB-U6's literal-keeps-the-match mutation: 2 failed | 8 passed. `AssertionError: a literal fill: expected [ '#112233', { column: 'zone', …(3) } ] to deeply equal [ '#112233', null ]` and `AssertionError: the match after the transitions toward the default: expected { column: 'zone', …(3) } to be null`.

**Sizes**, insertions + deletions per file by §7's Count from 08ce9935:
- B-P:
  - StylePanel.tsx `136 12` = 148 of 200.
  - categoryCases.ts `106 0` = 106 of 120.
  - **workspaceState.ts `14 12` = 26 against 10, over: class 8.** It is also over Amendment 12 item 13's cumulative 25. Not trimmed.
  - App.tsx `53 22` = 75 of 120.
  - surfaceRegistry.ts `16 1` = 17 of 25.
  - tableSource.ts `6 1` = 7 of 30.
- B-T:
  - **StylePanel.test.tsx `201 0` + Legend.test.tsx `58 0` = 259 against 250, over: class 8.** Not trimmed.
  - categoryCases.test.ts `161 0` = 161 of 180.
  - App.colour.test.tsx `337 0` = 337 of 350.
  - workspaceState.test.ts `18 1` and surfaceCompleteness.test.ts `3 1` count toward the B-T total.

**Departures, and what I wrote that the brief does not name:**
1. The gate reports are not in the 6f7e744c tree, so I read them on main (f53f64c5).
2. **PB-R5's drawn fill is my judgment.** App builds no layers, and the canvas is a stand-in in this harness. The test takes the style App hands that stand-in, resolves it with the real `applyStyleChange` (loaded with `vi.importActual`), and builds the layer with the real `buildLayers` over a `decodeBatch` batch. I took that as reading the drawn fill, so I did not stop. The gates should confirm.
3. **PB-R5 changed after U1.** At U4 the import moved into a `beforeAll` to stop act warnings. U1's failure was observed on the async version; its mutation was observed on the final one.
4. **Comment wording.**
   - surfaceRegistry.ts gets one doc-comment sentence, so that "The one row that stays…" reads as history.
   - The completeness test's sentence starts "Milestone 4 PR B adds…"; no existing sentence in that file is edited.
   - categoryCases.ts gets an updated abandon doc comment plus one comment line, and tableSource.ts a field doc.
5. "Other than by the panel" is built with `endedHereRef`, set in three panel handlers. That is my design.
6. The extra typecheck runs at U3 and U4 are mine.
7. I wrote these files under `<S>`: `m4b-c25-*` (scripts, mutation specs, message files, run logs).
8. Observations, not acted on:
   - D1's words say "(after One colour, that is none)". After item 5, an open also makes the column none.
   - After a Fill colour change or a Reset, the "Coloured by" line stays as it did before this correction.

**Self-check of the four failure classes:**
- Each cross-module use is the real interface. TableSource's own snapshot is at tableSource.ts:40-49. The recorder's `recordNamed` is at recorder.ts:365-372.
- Every completion claim above names a run with its rc.
- The only user-facing strings added are the two ruled statements, which describe behaviour built at 2f704773.
- Every new test reaches its assertion; each mutation failed at a named assertion.

**Push:** `6f7e744c..2f704773  cut/b1-shell-half-pr-b -> cut/b1-shell-half-pr-b`. ls-remote afterwards gives `2f7047737f64d9ca8a7a06332672ab9b3d25c9bc`; porcelain is empty (0 bytes). I started no background shells, and none is left running.

**Model:** the harness reports Opus 5.5 (claude-opus-5-5), running the worker-high role. No override, and no context handoff received or produced.
