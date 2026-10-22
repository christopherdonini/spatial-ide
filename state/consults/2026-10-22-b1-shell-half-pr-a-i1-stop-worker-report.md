*Custodian's filing note (2026-10-22): milestone 4 PR A's code by a worker-high, STOPPED at I1 before any code, at B 55618ab5: three product files outside §2.6 (`feature/clickEffect.ts`, `canvas/tileIngest.ts`, `canvas/tileResidentSet.ts`) and the required-or-optional decision for the new members. The run 16:43:10Z to 16:51:28Z by its transcript (Read 9, Bash 40); its claims were read against that transcript's calls before filing; no commit, no push, the porcelain empty. The custodian takes its option (A): the architect drafts a class 9 amendment before code. Extracted by script from its SubagentHandback call, with any scratch-folder path written as a placeholder and one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 09667d604f8c882f43173741ac7d1db7e64b36264b1c4bccbe6c0b3939b89716.*

---

STOPPED at I1 (a need outside §2.6). No PR A code was written, committed or pushed.

Built: nothing. b1-shell-half PR A is NOT built. Worktree HEAD = origin/cut/b1-shell-half-pr-a = 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f (B). `git status --porcelain` is empty (rc 0). No commits, so no pushes. No hold was taken, because I ran only reads and a ~12 s `npx tsc --noEmit`, which counts as a small build. No process I started is still running. `tasklist` shows no node.exe.

**Why I stopped**
§2.6 says "A need outside this list is I1", and the brief says to stop and never route around. I read the form (Amendments 1 and 2 first), the re-sweep, and the code at B. I found three needs that §2.6's 37-file list does not cover. Two of them cannot be met cleanly inside the list.

**Need 1: `frontends/shell/src/feature/clickEffect.ts` (not in §2.6).**
- It builds the `inspect.set` transition from the click. The line is `transitions: [{ action: "inspect.set", params: { pick, bounds } }]`, and its `ClickInput` type is documented as mirroring `canvas/clickPick.ts`'s `ClickPick` member for member.
- §2.2 (e) says `resolveClickPick` reads the row and `inspect.set`'s params gain `row`. That flow passes through this file.
- Without an edit, `row` is dropped on the way to `InspectedFeature`.
- The only in-list route is for `App.handleClickPick` (in the list) to re-decorate each `inspect.set` transition with `click.row` after `clickEffect` returns. I judge that a contortion.

**Need 2: `frontends/shell/src/canvas/tileIngest.ts` and `frontends/shell/src/canvas/tileResidentSet.ts` (not in §2.6).**
- `trimBatchToVertexBudget` in `tileIngest.ts` rebuilds a `ResidentBatch` from named fields: the literal at `tileIngest.ts:221-229`, with `partToRow` at :227. `TileResidentSet.addBatch` does the same when it drops cross-tile duplicates: the literal at `tileResidentSet.ts:~243-251`, with `partToRow` at :250.
- Both would drop the new `attributes` member. The candidate arm is the default arm, so this is the default path.
- After a duplicate drop, the rows are re-indexed. Any attribute data kept from the original decode would no longer be co-indexed with `ids`, `parts` and `partToRow`. That is the §5 falsification and §8 item 4 hazard.
- If `attributes` is required on `ResidentBatch`, `tsc` fails in both files. If it is optional, the data is silently lost for trimmed or deduped batches.
- The only in-list route is a post-ingest patch in `WorkingCanvas.pushTileBatch`. It would find the accepted batch in `tileResidentRef.getBatches()` by (streamHandle, batchSeq) and re-map its attributes by id. I judge that also a contortion.

**Need 3: required versus optional members (a decision, not a file).**
- I prototyped making `ResidentBatch.attributes`, `InspectedFeature.row`, `inspect.set` params `row` and `ClickPick.row` required, then ran `tsc`. It gave 30 errors across 19 files. These are the files outside §2.6:
  - Product: `feature/clickEffect.ts`, `canvas/tileIngest.ts`, `canvas/tileResidentSet.ts`.
  - Tests: `App.command.test.tsx`, `App.selection.test.tsx`, `canvas/buildLayers.test.ts`, `canvas/highlightLayers.test.ts`, `canvas/pick.test.ts`, `canvas/residentSet.test.ts`, `canvas/tileIngest.test.ts`, `canvas/tileResidentSet.test.ts`, `workspace/scope.test.ts`, `workspace/selection.test.ts`.
- The in-list files that also failed are `clickPick.ts`, `decodeBatch.ts`, `viewTransitions.ts`, `clickPick.test.ts`, `FeatureTab.test.tsx` and `viewTransitions.test.ts`.
- Unlisted tests and fixtures also call `decodeBatch` with 5 arguments (`buildLayers.test.ts`, `pick.test.ts`, `WorkingCanvas.wiring.test.tsx`).
- So the list only holds if the new members are optional (`?:`), `decodeBatch`'s projection parameter defaults to `null`, and `WorkingCanvas`'s `projection` prop is optional. I would do that. It is a reading of §2.2 (c) and (e), because the form writes them as `... | null`.

**Options for the custodian**
- **(A) Amend the list (class 9, by amendment before code):**
  - Add `feature/clickEffect.ts`, about 6 lines: `ClickInput.row?`, and `row` passed into the `inspect.set` params.
  - Add `canvas/tileIngest.ts`, about 6 lines: a prefix trim keeps row indices valid, so `attributes: batch.attributes` carries through.
  - Add `canvas/tileResidentSet.ts`, about 20 lines: on a duplicate drop, carry the attributes with a row map, or mark the batch `not-held`.
  - Add their tests, `tileIngest.test.ts` and `tileResidentSet.test.ts`, about 100 lines, each with one mutation.
  - Decide optional versus required for the new members.
  - Leave A-P, A-T and §7 as they stand. §7 is never edited, and the added lines are a class-9 declaration.
- **(B) Tell me to proceed with the two in-list contortions.** I estimate about 40 more product lines and 60 more test lines. They fit WorkingCanvas 80 and App 150 only if I stay terse. I would disclose both in the report.

**Design decisions reached, for whoever builds it**
- `projection.ts` exports `projectionFor`, plus a summary that also gives the non-projectable names and the count left out over 32. FeatureTab needs both for the "not projected" line.
- `viewportQuery(dataset, bbox, bboxCrs, limit, filter, columns)`. `columns` is sixth, matching §2.4 (b)'s PR C call shape, and is required. `filter` stays `Filter | null`, with its default removed or kept.
- `decodeBatch` copies the attribute columns into fresh bytes. I would use `tableToIPC(table.select(names))`, so `data.buffer !== ipcBytes.buffer` (H6). The expected-projection check compares the `attribute_columns` metadata and the schema field names after `id` and geometry. The refusal is a typed shell error with a P6 placeholder text.
- The ceiling arithmetic goes in `limits.ts`: sum over `getBatches()` of both sets, and mark the new batch `not-held` when it would pass the ceiling.

**Notes**
- I did not run the text checks, §7 or the other checks listed in the brief. No code existed to check.
- Not edited: `buildLayers.ts`, which waits for #243's merge per Amendment 2 items 5 and 10.
- Housekeeping, disclosed: I made a stray empty directory at `C:/dev/wt/m4a-scratch` by mistake and removed it. I also made two scratch copies under `/tmp` and removed them. Scratch files that remain, all in my scratchpad folder and named `m4a-pa-*`: `m4a-pa-form.md`, `m4a-pa-tsc-base.txt` and `m4a-pa-tsc-proto.txt`.
- `m4a-pa-tsc-base.txt` is the baseline `tsc` output at B; the baseline run printed rc=0.
- `m4a-pa-tsc-proto.txt` is the prototype's `tsc` output, rc=2 with 30 errors. The prototype edits to four files were reverted with `git checkout`, and the porcelain was empty afterwards.
- Hold lines: none, no hold was taken.
- Model as the harness reports it: Sonnet 5.5, model ID claude-sonnet-5-5.
