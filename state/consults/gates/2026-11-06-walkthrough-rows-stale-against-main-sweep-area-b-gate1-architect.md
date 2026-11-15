Reviewed: PR #283 at 6c6d4564b9bcb33382dbf4ccb3c516d554277f79 (base 2c72923e), gate 1, architect. Branch and commit: cut/walkthrough-rows-stale-against-main-sweep-area-b @ 6c6d4564b9bcb33382dbf4ccb3c516d554277f79
Verdict: PASS WITH NOTES (WORDS-ONLY)

I have no shell, so I could not check any sha256: not the brief's (0a126fac…), not the packet's (b1c0a899…), and not any pin in the form. I ran no git command. I leave no background shell. I read every file in the worktree at the reviewed head. The packet reports no code change past the base, so code at the head is code at the base.

## Findings by class (governance/AUTONOMY.md §22)

### Correctness: one finding. It blocks, and only on words, so the verdict is WORDS-ONLY

**C-1. J1's new span (row B8) leaves out the `close_dataset` entry. An operator following J1 as written would record a deviation that is not one.**
- **Requirement broken:** the form's rule 2.0 (d) and its §1 "May claim" (each changed span states what the code does), plus §5's invalidator "a clause in 2.1 fails against the code".
- **Evidence:**
  - J1's own step says the canvas from Part I may still be on the map. Admitting `filter-zoned.parquet` rebinds the one view: `frontends/shell/src/workspace/workspaceState.ts:141-158` drops the view from the old resource's consumers.
  - The close effect then calls `closeDataset` for every resource with no consumers (`frontends/shell/src/App.tsx:1520-1525`).
  - `closeDataset` goes through `call()` (`frontends/shell/src/skp/client.ts:132-134`), and `call()` records every command it sends (`:55`).
  - So the click adds a class-A `close_dataset` entry after `describe`. The head's text, "produces two new class-A entries, in order", does not mention it.
- **Second clause in the same span:** "(and, the first time this app process loads map data, one `binding_data_plane_attach` class-B entry)" is not true of the code.
  - The cache is a module variable: `frontends/shell/src/streaming/dataPlaneClient.ts:20-41`. A window reload empties it, and a reload is a step this walkthrough uses (E4.5 at `MANUAL-WALKTHROUGH.md:248`).
  - The first data load after a reload records the entry again.
  - The first caller is not always the map: `frontends/shell/src/table/tableSource.ts:143` also attaches.
- **Closure:** replace the B8 span, whole, with the words below. They are the architect's words, not the human's (OPEN-6 (a)), so the worker applies them with no re-gate and the PR body lists them (§31).

> produces two new class-A entries, in order: an `open_dataset` entry, then a `describe` entry, each labeled `SKP <version> · control plane` with its own copyable request text and a **Copy** button — never one merged entry (`skp/client.ts::call()`'s own two sequential invocations, I2: each captured by reference at the one choke point). If a dataset was already on the map (the canvas from Part I), a `close_dataset` class-A entry for that dataset follows these two. Once the dataset is admitted, the map's first data load adds at least one `viewport_query` class-A entry after these two (and, if nothing has loaded data since the window was opened or last reloaded, one `binding_data_plane_attach` class-B entry).

Each clause, checked against the code:
1. **"two … in order … never one merged entry":** `frontends/shell/src/admission/admitDataset.ts:46-53` makes two sequential awaited calls, and `client.ts:55` records once per call. These words are unchanged from the form.
2. **"If a dataset was already on the map … a `close_dataset` … follows these two":** `workspaceState.ts:141-158` and `App.tsx:1520-1525` close the old dataset. The new dataset is admitted only after `describe` resolves (`admitDataset.ts:56`, then `AdmissionPanel.tsx:262-263`). The order the close effect's own comment gives (old session stopped, old handle closed, new session started) is at `App.tsx:1512-1519`. "Follows" claims order, not that nothing comes between: if the old dataset still had loads running, stopping it can record `cancel` entries first (`tileViewportStreamManager.ts:854-860`).
3. **"at least one `viewport_query` … after these two":** `App.tsx:1700`, then `candidateArmSession.ts:1279`, then `client.ts:107-126`. This is the form's own cite and unchanged.
4. **"if nothing has loaded data since the window was opened or last reloaded":** `dataPlaneClient.ts:20-41` caches the result on the first call from any caller: `candidateArmSession.ts:1284`, `tileViewportStreamManager.ts:1010`, `viewportStreamManager.ts:223`, `tableSource.ts:143`. That a reload re-initialises module state is page-reload behaviour, not a line of code. It is the same inference the form's §1 and B7's "Limits of the check" already declare.

### Evidence: none
- The custodian's git output gives the diff, the numstat (16+16=32, under §7's 90) and the file list. The worker's §4 script gives the revert-equality result. I relied on both; the reviewer re-runs §4 (form §9).
- CI was still in progress at assembly. That is a condition of the merge, not of this gate (Part 1, item 4).

### Documentation: must be fixed before the merge (none fails the gate)

**D-1. The Part H pointer (B4) does not say which arm a rerun is on.**
- The head says "a rerun of H1 or H2 shows no red-bordered ceiling banner and no `declared ceiling reached` line".
- In the walkthrough's own order, E4.5 pins `"baseline"` (`MANUAL-WALKTHROUGH.md:248`). Nothing in Parts F or G reloads, and Part H says no relaunch is needed (`:443`). So a sitting run in order reaches H on baseline, where the banner does appear.
- Under §31 this case needs a dev-only switch, so it does not block. It is named here so it is recorded.
- The words (architect's): replace "a rerun of H1 or H2 shows" with:

> a rerun of H1 or H2 on the candidate arm (the arm after a launch or a reload; Part E's E4.5 pins baseline until the next reload) shows

  - "after a launch or a reload": `frontends/shell/src/residency/residencyArm.ts:50,58` (initialised at module load; the reload is inferred, as in §1).
  - "E4.5 pins baseline": `MANUAL-WALKTHROUGH.md:248`.
  - "until the next reload": `residencyArm.ts:96-106` keeps the value it is set to, and the one caller is the dev hook at `App.tsx:1328`.

**D-2. Four dates read 2026-11-05.** They are Note 1, Note 2, the Part H pointer and B7's "[CORRECTED 2026-11-05". The form's row table writes `<merge date, date -u +%F>`, and the worker wrote the date of the edit (disclosure 4). Closure: at the last commit before the merge, set all four to that day's `date -u +%F`. Alternatively, the custodian records in the PR body that they carry the edit date.

### Notes (preferences, not acceptance conditions; Part 1, item 6)

- **N-1, the B4 pointer's "(Part K's K2 quotes its wording)".**
  - K2 quotes only the base sentence. At settle, a suffix can follow it (`frontends/shell/src/residency/residencyStatus.ts:464-474`).
  - `viewportTotal` is always `null` (`candidateArmSession.ts:750`), so the base sentence is K2's.
  - "(Part K's K2 quotes its opening sentence)" would be more exact.
- **N-2, J3 (B2).** Expanding Style records a class-C `style.togglePanelExpanded` entry (`frontends/shell/src/style/StylePanel.tsx:153`; `surfaceRegistry.ts:180-188`) just before the edit. J3's "No class-C entry appears for the edit" is true, because it is scoped to the edit. An optional clause naming the toggle's own entry would stop an operator crediting that entry to the edit.
- **N-3, method.** OPEN-6 (a) names `git log -L`, but the worker used `git log -S` on each span's exact text (disclosure 1). For finding the commit that introduced a span, `-S` answers the question. I could not re-run either.

## Check 1: the row table against the head
I read each hunk of the packet's diff against the head file:
- **B1, part 1 (B3) and part 2 (the `B2'`/`B3'` Covers cell):** applied.
- **B2 (J3), B3 (J2) and B8 (J1):** applied in Part J's step rows, not in its run record.
- **B4:** added after the 2026-09-08 pointer (`:462-467`), at `:469`. H1, H2 and H5 are untouched (OPEN-2 (b)).
- **B5:** Note 1 at `:99`, after the `NET'` row. Note 2 at `:130`, after the `FIND'` row (OPEN-3 (b)).
- **B7:** the Part L preamble at `:807`, L5's step at `:819`, and L1's level clause at `:815` (OPEN-4 (a)).
- **B9:** the three spans in N9 at `:954`.
- **B10:** both A3 insertions.
- **F2:** absent; there is no hunk in Part F (`:258-288`), so OPEN-1 (b) holds.
- **Nothing else changed:** this rests on the packet's diff and the worker's revert-equality evidence. I did not run git.

## Check 2: B7, clause by clause
Every clause holds against the code.
1. **"after a reload the arm is the shipped default, `"candidate"`":** `DEFAULT_RESIDENCY_ARM = "candidate"` and `currentArm` is initialised from it (`residencyArm.ts:50,58`). No code sets the arm at startup; the only caller of `setResidencyArm` is the hook at `App.tsx:1328`.
2. **"the tile-size level is unset (`null`)":** `residencyTileSizeLevel.ts:37,48-50`.
3. **"which a candidate session runs at `"medium"`":** `App.tsx:1624` passes the getter's value, `candidateArmSession.ts:924` passes `?? undefined`, `tileViewportStreamManager.ts:404` falls back with `?? DEFAULT_TILE_GRID_LEVEL`, and `tileGridConstants.ts:35` sets that to `"medium"`.
4. **"re-arm per K2 (both calls resolve `{ok:true}`)":** K2 (`MANUAL-WALKTHROUGH.md:746`) calls `setResidencyArm("candidate")` and then `setResidencyTileSizeLevel("fine")`. After a reload the `datasetOpen` flags are back to `false` (`residencyArm.ts:63`, `residencyTileSizeLevel.ts:43`). Nothing reopens a dataset on load: the shell has no `localStorage` or `sessionStorage` use. So both setters take the success branch (`residencyArm.ts:96-106`, `residencyTileSizeLevel.ts:62-72`).
5. **"run `getResidencyArm()` … print `"candidate"`; `getResidencyTileSizeLevel()` … print `"fine"`":** the hooks are at `App.tsx:1329,1335`. They return the module values, so they read `"candidate"` and `"fine"` after K2.
6. **The getter reads the selection for the next session, so it is read before the open:** `e2e-test-surface.ts:326-331`.
7. **What the operator sees at `fine`:** the preamble claims nothing new here, and the L rows' expected outcomes are unchanged and outside this piece.
8. **The reload is stated, not called observed,** so §8 item 11 holds. The hooks exist only in an instrumented build (`e2e-test-surface.ts:343-351`). That is a dev-only premise under §31 and Part K's own premise, and it does not block.

B7 also follows the human's ruling of 2026-11-05 (evening), item 2: re-arm, then read the level from `getResidencyTileSizeLevel()`.

## Check 3: every other new span
- **B3 row (B1 part 1):** holds.
  - There is no remediation note: `RefusalBlock.tsx:24-43` renders guidance only from `refusalGuidance`, which has no case for `engine.crs_undeclared` (`formatRefusal.ts:70-146`).
  - The form appears below the refusal block: `AdmissionPanel.tsx:29,396-413`.
  - The refusal block has no button: `RefusalBlock.tsx:24-43`.
  - It is replaced, not closed: `AdmissionPanel.tsx:214-218,243-258`.
  - Part I's I1 (`:592`) does describe the form.
- **`B2'`/`B3'` Covers cell (B1 part 2):** holds (`e2e/regression.mjs:2359-2394,2710-2712`).
- **J3:** holds.
  - The entry is recorded on the native `change` event, not per tick: `StylePanel.tsx:94-110`.
  - There is one `style.set` per value that differs from the last committed style: `App.tsx:1983-1995`.
  - The queue sends in order and does not coalesce: `stepRecorder.ts:44-77`.
  - The command is `record_step`, recorded at `client.ts:141-143` and `:55`.
  - The label and Copy button come from `ConsolePanel.tsx:143-174`.
  - The class-C table has no style-edit row and no ADR-022 owner: `surfaceRegistry.ts:180-196`.
  - The view's style survives a rebind (`workspaceState.ts:151-156`), so "one, for one control moved" holds.
- **J2:** holds. `client.ts:115-125` sends `columns` on every call (`types.ts:253-265`), and `console/render.ts:46` uses `JSON.stringify` without dropping keys.
- **J1:** see C-1.
- **B4 pointer:** see D-1 and N-1.
  - The other clauses hold: the arm default (`residencyArm.ts:50`); the candidate arm never refuses a batch (`WorkingCanvas.tsx:1742`); `declared ceiling reached` appears only in the `baseline-ceiling` case (`residencyStatus.ts:452-453`).
  - `record_step` goes to the kernel and the style dispatch issues no query: `App.tsx:855-857,1976-1995`.
  - The quote of H5, "no admission, no query, nothing round-trips through the kernel", is byte-exact at `:456`.
- **Note 1:** holds. `regression.mjs` runs K6, K7, `CURSOR'`, `FIND'`, `MP'`, `PT'` and `LN'` (`:2681-2709`), none of which has a row. The move is at `:2732`. `refusal-contract-baseline.mjs` pins the arm and reads it back (`:606-617`), then runs `OVERCEIL'`, `REOPEN'` and `SLOW'/CANCEL'` (`:627-629`). The npm script is at `package.json:27`.
- **Note 2:** holds. `filter-panel.mjs:484-488` runs exactly those five steps.
- **N9:** holds. `KNOWN-LIMITATIONS.md:202`'s heading is byte-exact, and items 19 to 23 (`:232,248,259,269,280`) map to (1) to (5).
- **A3:** holds. `DescribeSummary.tsx:29-63` has the labels byte-exact and the rows in the order the new text gives.

## Check 4: section 8 block-on-sight, and rule (00)
- **Item 1:** the first `## Result log` heading is at `:987`. Every hunk sits before it. No H row and no run record is edited.
- **Item 2:** the packet's numstat lists one file.
- **Items 3 to 11:**
  - There is no timing or figure (the item numbers 19 to 23 are labels).
  - Each clause has a code cite; the one omission is C-1.
  - Every quote marked verbatim matches its source (N9's heading, H5's words, the A3 labels).
  - There is no line cite into the ledger: L5 keeps "entry 43", unchanged.
  - The form is not edited.
  - No span is the human's, as reported.
  - Part F is not touched.
  - No e2e script is touched.
  - The reload is not called observed.
- **Rule (00):** nothing at the head touches Part F (`:258-288`), Part G (`:313-381`), the `e2e/publish.mjs` coverage table (`:381-406`) or the Result log.

## Check 5: whose words, and the operator sitting
- The packet's section 2 reports that the worker found no old span to be the human's typed words. The custodian checked commit 472e8839: its quotes of the human are in ledger entries 42 and 44, not in the Part L spans. I cannot run git, so I take this as reported. The new words are the architect's.
- A wrong result at the sitting would come from J1, through the unlisted `close_dataset` entry (C-1, closed by the words above). It could also come from the H pointer if H is rerun in order on E4.5's baseline pin (D-1). I found no other row that would lead an operator to a wrong record.

## The packet's gaps (for Part 2, section C)
- It does not give the introducing commit for each old span, the evidence behind "whose words", so I could not check it.
- It does not give the line of the first `## Result log` heading (I found it at `:987`).
- It does not say which arm the walkthrough's order leaves the app on at Part H, which D-1 needed.
- It does not say whether Ctrl+R works in the shipped release build, so I could not settle whether §31 counts the attach clause as reachable in ordinary use.
- It gives CI's final conclusions only as in progress.
