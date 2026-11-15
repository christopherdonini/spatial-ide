Reviewed: PR #283 at 6c6d4564b9bcb33382dbf4ccb3c516d554277f79 (base 2c72923e), gate 1, reviewer
Verdict: PASS WITH NOTES (WORDS-ONLY)

Branch: cut/walkthrough-rows-stale-against-main-sweep-area-b @ 6c6d4564b9bcb33382dbf4ccb3c516d554277f79.

I checked the brief (sha256 6aa1ce2e…9d42c) and the packet (sha256 b1c0a899…c2fd, 59674 bytes) before starting, and both matched. The directive's Part 1 items 1 to 9 and the whole form were read before any check ran. The code under `frontends/`, `engine/`, `kernel/` and `KNOWN-LIMITATIONS.md` is the same at the form's read commit 8b9193a1 and at the head: `git diff --name-only 8b9193a1 6c6d4564` over those paths, rc 0, lists only the walkthrough. So the form's line cites resolve at the head.

## Correctness (blocking, closed by words)

**C-1. J1's new last sentence says the attach entry appears once per app process. It appears again after a window reload.**
- **Requirement broken:** Part 1 item 1 (each clause is checked against the code). The form's rule 2.0 (d), and its §5 invalidator "a clause in 2.1 fails against the code at the dispatch commit".
- **Evidence:**
  - `frontends/shell/src/streaming/dataPlaneClient.ts:20-41` keeps the attach in a module-scoped `cached` promise and records `binding_data_plane_attach` only when `cached` is null.
  - A Ctrl+R re-evaluates the page's modules, which empties both `cached` and the console's ring. The app process stays the same. The first data load after the reload therefore records a new attach entry (callers: `candidateArmSession.ts:1284`, `viewportStreamManager.ts:223`, `tileViewportStreamManager.ts:1010`, `table/tableSource.ts:143`).
  - The host command `src-tauri/src/commands.rs:169-177` answers every call.
  - The walkthrough's own steps use Ctrl+R (D4 recommends one, and K2, L2, L4 and L5 do one). So ordinary walkthrough use reaches this case: an operator whose J1 open is the first load since a reload sees an attach entry the sentence says is already spent.
  - That a reload re-runs the modules is inferred from page-reload behaviour, not executed. This is the same basis the form's §1 accepts for B7.
- **Same sentence, a Documentation must-fix folded into the same words:**
  - J1 opens with "canvas from Part I may still be visible". If it is, the open replaces that dataset.
  - `workspace/workspaceState.ts` `admit()` takes the view off the old resource's consumers. `selectClosable` (`:220-225`) then returns it, and the effect at `App.tsx:1520-1525` sends `closeDataset`. That is a class-A `close_dataset` entry (`console/surfaceRegistry.ts:85`; captured at `skp/client.ts:55`), recorded after `describe`, because the admission state is set only once describe resolves (`admission/admitDataset.ts:46-56`, `AdmissionPanel.tsx:265-266`).
  - The new words no longer claim "never more than two", so the omission is not false. But an operator will commonly see an unexplained entry.
- **Closure (not the human's wording: the architect's new span, introduced by 6c6d4564; the old J1 text came from 6039cf78, AI co-authored).** Replace this sentence of the J1 span (byte-copied from the head):
  > Once the dataset is admitted, the map's first data load adds at least one `viewport_query` class-A entry after these two (and, the first time this app process loads map data, one `binding_data_plane_attach` class-B entry).

  with:
  > Once the dataset is admitted, a `close_dataset` class-A entry for the dataset it replaced follows, if one was open, and the map's first data load adds at least one `viewport_query` class-A entry after these two (and, the first time map data loads since the app started or the window was last reloaded, one `binding_data_plane_attach` class-B entry).

  **Clause check of these words:**
  - "a `close_dataset` class-A entry for the dataset it replaced follows, if one was open":
    - `workspaceState.ts` `admit()` moves the view off the old resource.
    - `selectClosable` `:220-225` returns it, and `App.tsx:1520-1525` sends `closeDataset`.
    - `close_dataset` is in CLASS_A_ROWS (`surfaceRegistry.ts:80-87`), recorded at `client.ts:55`.
    - "Follows" holds because the admitted state is set after `describe` resolves.
    - Named case, not ordinary at J1: with an export running, the export's consumer (`App.tsx:1182`) holds the old resource, so the close waits until that export ends. The entry still appears, later.
  - "the map's first data load adds at least one `viewport_query` class-A entry after these two": the form's own clause, re-checked. `App.tsx:1697-1700` calls `reissueUnrestricted`, which reaches `viewportQuery` at `candidateArmSession.ts:1279`, recorded at `client.ts:55`.
  - "the first time map data loads since the app started or the window was last reloaded, one `binding_data_plane_attach` class-B entry":
    - `dataPlaneClient.ts:20-41`: memoised per page load, `recordNamed("binding-command", …)`.
    - Class B at `surfaceRegistry.ts:96-103`.
    - It is first called from a data load, after the first `viewportQuery` (`candidateArmSession.ts:1279` then `:1284`).
    - The reload half is inferred, as above.
  - Under the human's 2026-10-11 rule, the worker applies these words with no re-gate, and the PR body lists them.

No other clause of any new span failed against the code.

## Evidence

None blocking. Every claim of the packet's §4 that I relied on, I re-ran myself (checks 1, 3 and 5).

## Documentation (must-fix before the merge)

- **D-1:** folded into C-1's words (the `close_dataset` entry). There is nothing else to fix.

## Notes (not acceptance conditions; Part 1 item 6)

- **N-1, J3:** "No class-C entry appears for the edit" holds. But the step's own "expand ▸ Style" records a class-C `style.togglePanelExpanded` row ("no API equivalent exists …", `surfaceRegistry.ts:181-187`, recorded at `StylePanel.tsx:153`) just before the edit. That row's owner line names docs/03, not ADR-022, so "no entry names **ADR-022**" also holds. The sentence is true. An operator may still connect the toggle row to the edit, so a clarifying clause is optional.
- **N-2, Part H pointer (dev-only case, named for the record):**
  - "a rerun of H1 or H2 shows no red-bordered ceiling banner" holds on the shipped default arm.
  - The exception: Part D's D0 pins `"baseline"` through the dev-only hook, and D4 makes a reload "recommended, not required". If an operator skips that reload, the same app instance stays on baseline, and an H1 rerun shows the ceiling banner.
  - This needs a dev-only switch (`registerE2eHook` no-ops outside `isInstrumentedBuild()`, `e2e-test-surface.ts:343-351`), so it does not block. Optional words: "a rerun of H1 or H2 on that default arm shows …".
- **N-3:** verify-cites prints one pre-existing loose-reference advisory on an unchanged line of the walkthrough (it is present in the base too: `grep -cF` gives 1, rc 0). It is outside this diff.

## Check 1: each span against the form's row table

Script: `<the session scratch folder>/wrb-g1r-check1.mjs`, rc 0, output in `<the session scratch folder>/wrb-g1r-check1.out` (CHECK1 OK). It extracts every span from the form's own lines, with `<merge date>` set to 2026-11-05.
- **The form:** byte-identical at the base and the head.
- **The 12 old→new pairs** (B1 parts 1 and 2, B2, B3, the B7 preamble, L5, L1, B8, the three B9 spans, B10): each old span appears once at the base and 0 times at the head. Each new span appears 0 times at the base and once at the head.
- **The three additions** (the Part H pointer and both B5 notes): each is absent at the base and appears once at the head, as its own paragraph followed by a blank line.
- **B10's insertion "; **CRS provenance**":** its old context appears once at the base and 0 times at the head; its new context appears once at the head.
- **Revert:** with every span reverted and the additions removed, the head file is byte-identical to the base.
- **Result log:** the first `Result log` heading is at base line 987. All 11 `-U0` hunks start at or before old line 954.
- **`git diff --name-only base...head`:** only `frontends/shell/MANUAL-WALKTHROUGH.md`.
- **`--numstat`:** 16 16, so 32 changed lines against the ceiling of 90.
- **Bytes of the changed lines:**
  - 16 added lines, with 0 CR and 0 tab. The CR count of the whole file is 0 at the base and 0 at the head.
  - Non-ASCII in the added lines: U+2014 and U+00B7 come from the form's words. U+00A7, U+2026, U+25B8, U+25BE, U+2192 and U+00B1 come from unchanged text on the same lines, which the byte-identical revert proves came from the base.
- **The worker's disclosure 5:** the B10b placement matches the form.

## Check 2: every clause of every new span against the code at the head

Each clause below holds unless C-1 names it.
- **B1 part 1 (B3):**
  - `refusalGuidance` has no `engine.crs_undeclared` case: `grep -n crs_undeclared formatRefusal.ts` gives rc 1, and the switch's `default` returns null (`formatRefusal.ts:144-145`). So no note appears.
  - `formFamilyForCode` maps `crs_undeclared` to `"crs"` (`AdmissionPanel.tsx:29`).
  - `RefusalBlock` is rendered, then `CrsAssertionForm` as its sibling (`AdmissionPanel.tsx:396-412`).
  - Part I's I1 (walkthrough line 592) describes the form "Below it".
  - `RefusalBlock.tsx:24-43` renders no `<button>`.
  - "Replaced": a fresh path sets `{kind:"opening"}` (`AdmissionPanel.tsx:214-218`).
- **B1 part 2 (`B2'`/`B3'`):** `regression.mjs:2347-2390` asserts the code, the message verbatim, `hasButton` false inside `.admission-panel .admission-refusal`, `.crs-assertion-form` present, and `.describe-summary` absent from the Layers region. The step is at `:2710-2712`.
- **B2 (J3):**
  - `StylePanel.tsx:89-108`: the native `change` event is the only commit, so there is none per tick.
  - `App.tsx:1987-1995`: one `stepQueue.enqueue` per `styleTransitions` difference against `lastCommittedStyle`. `viewTransitions.ts:158-175` gives one transition per property. A rebind keeps the view's style (`workspaceState.ts:108-109, 146-155`), so moving one control gives one entry.
  - `record_step` goes through `client.ts:141-143` and is class A (`surfaceRegistry.ts:86`). Its label `SKP … · control plane` and its Copy button come from `ConsolePanel.tsx:143-173`.
  - No class-C row is recorded for the edit (`surfaceRegistry.ts:175-176`). No registry string names ADR-022: `grep` found only a comment example at `:62`.
- **B3 (J2):** `viewportQuery` always sends `columns` (`client.ts:115-126`; `types.ts:261-264`). The copy text is `JSON.stringify(request, null, 2)` (`console/render.ts:46`).
- **B4 (Part H pointer):**
  - The default arm is `"candidate"` (`residencyArm.ts:50, 58`).
  - The candidate arm never refuses a batch (`WorkingCanvas.tsx:1742`).
  - `declared ceiling reached` appears only in the `baseline-ceiling` case (`residencyStatus.ts:452-453`).
  - Over budget, the status shows the base text at `:464-468`. `viewportTotal` is always null (`candidateArmSession.ts:622, 750`), so that text is the wording K2 quotes (walkthrough line 746).
  - `record_step` is sent per changed value (`App.tsx:1987-1995`).
  - "No query": no style value reaches `streaming/` or `residency/` (grep; the only hit is a comment).
  - N-2 names the dev-only case.
- **B5 note 1:**
  - The `runStep` ids in `regression.mjs` are A1' to A9', K6, K7, CURSOR', FIND', MP', PT', LN', B2'/B3', ABSENTCRS', C2'/C3' and NET'. That is 18 literal calls plus the definition, matching `grep -c runStep(` = 19.
  - The regression table's rows (walkthrough lines 85-97) contain none of the seven named steps.
  - OVERCEIL' and REOPEN' are absent from the steps (`regression.mjs:2732`).
  - `refusal-contract-baseline.mjs` pins baseline with a readback at `:606-617`, before its steps at `:627-629`. The npm script is at `package.json:27`.
- **B5 note 2:** `filter-panel.mjs:484-488` runs exactly OPEN, PANEL', PANELREFUSE', CLEAR' and FIND' (6 `runStep(` matches = 5 calls plus the definition). SLOW'/CANCEL' is at `refusal-contract-baseline.mjs:629`. The status paragraph above records the 2026-08-15 run.
- **B7 (preamble, L1, L5):**
  - `currentArm` starts at `DEFAULT_RESIDENCY_ARM` = `"candidate"` (`residencyArm.ts:50, 58`).
  - `currentLevel` starts at null (`residencyTileSizeLevel.ts:37`). Null becomes `undefined` (`candidateArmSession.ts:924`), and then `DEFAULT_TILE_GRID_LEVEL` = `"medium"` (`tileViewportStreamManager.ts:404`, `tileGridConstants.ts:35`).
  - After a reload `datasetOpen` is false, so both K2 setters return `{ok:true}` (`residencyTileSizeLevel.ts:62-72`). The getters are registered at `App.tsx:1328-1335`.
  - The words call the reset a stated fact, never an observed one (§8 item 11 is respected).
- **B8 (J1):** the first sentence holds (`admitDataset.ts:46-56`; `client.ts:46-68`). The last sentence is C-1.
- **B9 (N9):**
  - `grep -nxF` finds the heading at `KNOWN-LIMITATIONS.md:202`, rc 0, byte-equal to the quoted text.
  - Items 19 to 23 (lines 232, 248, 259, 269 and 280) are the change detector, partitioned sources, degrees publish, sanity check and small pan, in the row's order.
- **B10 (A3):**
  - `DescribeSummary.tsx:28-63` labels the rows `[P6 placeholder] Geometry (encoding chosen by the engine)`, `[P6 placeholder] Geometry types declared by the file` and `CRS provenance`.
  - The order is CRS, encoding, types, Identity, Row count, Extent, Schema, License, CRS provenance.

## Check 3: the section 4 evidence, my own

Script: `<the session scratch folder>/wrb-g1r-check3.sh`, rc 0, output in `<the session scratch folder>/wrb-g1r-check3.out`. The base and head files were extracted with `git show` (rc 0 each), and the head copy is `cmp`-equal to the worktree file (rc 0).
- **Self-test:** `## Result log` counts 16 at the base and 16 at the head (rc 0). An absent string counts 0 (rc 1).
- **Content checks** (whole-file lines; rc 0 wherever the count is above 0):

| String | Base | Head |
|---|---|---|
| `getResidencyTileSizeLevel()` | 0 (rc 1) | 1 |
| `.crs-assertion-form` | 1 | 2 |
| `columns, filter, limit}` | 1 | 2 |
| `record_step` (lines) | 6 | 8 |

- **Inside the spans** (`wrb-g1r-occ.mjs`, rc 0): each string occurs once inside its own new span: the B7 preamble, `B2'`/`B3'`, J2, J3 and the H pointer. `record_step` occurs 9 times at the head. This confirms the worker's disclosure 2.
- **The seven absence patterns:** each counts 1 at the base (rc 0) and 0 at the head (rc 1).

## Check 4: whose words

`git log -S` on the exact text, path-limited to the walkthrough, rc 0 for each, output in `<the session scratch folder>/wrb-g1r-whose.txt`.
- **Part L spans** (the preamble's "silently resets to" and "recorded as arm-unverified", L1's "(verify the arm!)", and L5's "**verify the arm**"): introduced by 472e8839, trailer Co-Authored-By Claude Fable 5.1. That commit's message says the human's words are carried verbatim in entries 42 and 44, and its stat shows those went to the ledger file. The edited walkthrough spans are the commit's own corrected rows, not those quotes.
- **J3, J1 and J2:** 6039cf78, Claude Fable 5.
- **B3 and A3:** 76ee453e, Claude Sonnet 5.
- **The `B2'`/`B3'` cell:** 14c659f9, Claude Fable 5.
- **N9:** 9eb52ac1, Claude Sonnet 5.
- **Conclusion:** none of the edited spans is the human's typed words. The new words are the architect's, and C-1's replacement is not the human's wording.

## Check 5: verify scripts and CI

Run in `C:/dev/wt/wrb` at the head.
- `verify.mjs --offline`: rc 0, PASS.
- `verify-cites.mjs`: rc 0, PASS (2660 files).
- `verify-quotes.mjs`: rc 0, PASS (138 checked, 0 errors). It ran past 180 s, so the harness moved it to the background; I waited for it to complete.
- `verify-test-claims.mjs`: rc 0, PASS (733 claims).
- `gh pr checks 283`: rc 0, all 8 checks pass. `gh pr view`: headRefOid 6c6d4564…, draft.
- `gh run view`, rc 0 each, every run with headSha 6c6d4564b9bcb33382dbf4ccb3c516d554277f79, completed success:

| Run | Workflow | Event |
|---|---|---|
| 42134687165 | DCO sign-off | pull_request |
| 42134690358 | Exposure scan | pull_request |
| 42132652967 | Ported notices | push |
| 42134686969 | Ported notices | pull_request |
| 42132652931 | Product CI — shell | push |
| 42134686927 | Product CI — shell | pull_request |

- CI was read, not relied on (Part 1 item 9).

## The packet's gaps (for Part 2 section C)

- It did not state whether any cited code changed between the form's read commit 8b9193a1 and the reviewed head. I computed it: none.
- It did not name the console entries the code adds around J1 beyond the form's (the `close_dataset` on a rebind). I found that by reading.
- Nothing else was needed from outside the packet besides the form, the directive and the code it cites.

## Background shells

Both shells I started have ended: the verify-quotes run, and a bounded wait loop (56 iterations of 5 s). The worktree's porcelain is empty (`git status --porcelain`, rc 0, 0 bytes) and HEAD is still 6c6d4564b9bcb33382dbf4ccb3c516d554277f79. I wrote nothing outside the scratch folder.
