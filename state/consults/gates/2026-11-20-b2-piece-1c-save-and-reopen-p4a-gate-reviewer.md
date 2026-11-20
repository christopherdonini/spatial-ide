Reviewed: PR #341 at c60327e87c8990f8fdb430fcf9b734eb1393a46e (the custodian's filing note, 2026-11-20: the reviewer's gate of P4a; Bash 78, Read 7, SubagentHandback 1, two errored, model claude-opus-5-5, from 2026-11-20T11:30:00Z to 2026-11-20T11:49:50Z by its transcript; the report below byte for byte from its hand-back of 15848 bytes, sha256 d749e06d0da5b3a64305df2abd05feebd5c5fd3d8d17efaa26ec35c51ae4d626, but for one masking by the custodian (one scratch-folder path as <S>), with this note in its first line and one final newline), gate, reviewer, attempt 1
Gate: PR #341, b2-piece-1c-save-and-reopen P4a, reviewer, at c60327e87c8990f8fdb430fcf9b734eb1393a46e
Verdict: PASS WITH NOTES

Reviewed: b2-piece-1c-save-and-reopen P4a @ c60327e87c8990f8fdb430fcf9b734eb1393a46e. In the cites below, B = 7f7eb6d6, W1 = daac1b62 and H = c60327e8. The worktree is C:/dev/wt/1c-p4a. The form is read at main 43b85053 (sha256 d371bb53511cd1b14f3b0e0c5872b239742977c5c2c809fffbbbda0c81d59efa).

Nothing fails on Correctness or Evidence. Six documentation findings must be fixed before the merge (D1 to D6), and one item goes to the advisor.

## The nine questions

**1. Scope**
- `git diff --name-only B...W1` gives 31 paths, all under frontends/shell/: src, e2e/README.md, e2e/reopen.mjs and package.json.
- From W1 to H, 15 files change, all under governance/, site/ and state/.
- No path under protocol/, kernel/, engine/ or src-tauri/ changes. diagnostics/log.ts does not change.
- The merge base of B and W1, and of W1 and main ffd451b7, is B. Since B, main has changed 15 record files only.
- Every new export has a product caller: I grepped with the tests excluded. Two exceptions are notes (N1, N2).

**2. Counts**
Counted by the form's section 2.11 command, with the form's path excluded, at B...W1.

| Group | Lines | Ceiling | Overrun |
|---|---|---|---|
| Shell product (18 files) | 846 (809 added, 37 deleted) | 820 | 26 over, class 8 |
| Strings file (within the product) | 122 | 90 | 32 over, class 8 |
| Shell tests (10 files) | 847 (842 added, 5 deleted) | 690 | 157 over, class 8 |
| e2e (3 files) | 484 | 485 | within |
| Every other group | 0 | 0 | within |

- Total: 2,177 lines in 31 files. Amendment 54 item 3 estimated 1,995 lines in about 27 files.
- Step 2 as a whole: PRs #331, #332, #333, #334, #337, #339 and #340 plus P4a give 682 + 754 + 244 + 198 + 2,209 + 357 + 2,406 + 2,177 = **9,027 lines against the step's Total of 5,170**, and **86 distinct files against 75**.
- Neither step overrun is yet recorded as class 8. ADV-2026-11-20-10, -12, -13 and -14 name only the group overruns. This is D1.

**3. By diff**
- RefusalBlock callers: comparing B and W1, only the AdmissionPanel and ConsolePanel call lines change. The calls in App.tsx, CommandBar, ClauseCards, FilterPanel, PublishPanel and TableTab are unchanged.
- A dataset refusal renders as before: `owner` defaults to null, `reopen` to false, and the panel's state is a fresh literal, so no owner carries over.
- `ASSERTION_GUIDANCE_CODES` is module-private and holds only `engine.crs_assertion_conflict`.
- saveProject.test.ts: the edit is one word (the loop's "through-link"), plus T-16, which is new.
- actionRegistry.test.ts: the edit is one line, `"project.open"` in its sorted place.
- package.json: the change is the one line `"e2e:reopen": "node e2e/reopen.mjs",`.
- Lockfiles: the shell and bundle-viewer package-lock.json files and both Cargo.lock files are unchanged from B to H (rc 0).

**4. The order**
- `git diff --quiet 20895dfb c60327e8 -- frontends/shell/src/App.tsx` gives rc 0.
- Mutation: I applied the reverse of 20895dfb's App.tsx change in a hold and ran `npx vitest run src/App.reopen.test.tsx`.
  - Exit 1: "Tests 1 failed | 12 passed (13)".
  - The failing case: "a reopen's saved view is written once, after the first look's call resets the fit, and no reset follows it (Amendment 60 item 4)".
  - The message: "AssertionError: no reset after the write: expected [ { call: 'reset' } ] to deeply equal []".
  - Reverted. `git diff --quiet` gives rc 0 and the porcelain is empty.
- O-17's sentence (Amendment 61), clause by clause:
  - "the write comes right after the first look's call, in the same turn of the effect": true. App.tsx takes the saved view at the effect's start (lines 1688 to 1695) and writes it right after each arm's call (line 2033 for the baseline).
  - "The candidate arm's call makes one such reset": true. candidateArmSession.ts:1745 resets synchronously, before the first await at line 1292.
  - "the baseline arm's makes none": true. The only resetFit callers outside the tests are the session's line 1745, `applyFilter` after an issued outcome (App.tsx:396) and the instrumented `queryWithFilter` dispatchers.
  - "The open makes no reset of the fit after the write": true in ordinary use. `handleReopened` dispatches reducer transitions (App.tsx:1221 to 1231), not `applyFilterWith`.
  - "A later generation's reset, a filter's Apply among them, fits the camera as after any open": true. Apply and a card change both reach `applyFilterWith`.
  - No clause is untrue.

**5. Cancellation, refusals and the bound**
- Cancel: the click adds the key to `cancelledKeys`. A late `question` or `not_found` ends at "Open cancelled".
  - Mutation: I disabled the `wasCancelled` check in `runAdmitPath` with one anchored sed and ran the same file in a hold.
  - Exit 1: "Tests 1 failed | 12 passed (13)". The failing case: "T-5: a question or not_found after Cancel asks nothing and ends at the cancelled note" ("AssertionError: no S8").
  - Reverted; rc 0, porcelain empty.
- Where file text reaches the screen, the Console or the log (grep at H), each place is bounded:
  - `not_found.file_name`: openProject.ts:68 bounds it, and S11 renders it (AdmissionPanel.tsx:538).
  - `view.basis`: bounded at line 137.
  - O-18's column: bounded at line 142.
  - Refusal message and fields: line 74, `shownRefusal(formatRefusal(...))`.
  - The one new log call (line 75) logs the bounded refusal.
  - The owner place is chosen from the bounded refusal.
  - Workspace text applies whole, with W-TEXT naming the member (item 5 (k)): lines 120 to 122.
- The Console row: ConsolePanel.tsx:178 calls `formatRefusal(vm.refusal)` with no bound, as the form allows (packet P-14; the form's item 13 names it as not covered).
- formatRefusal's doc exception: true of the reopen's run, but it does not name the Console row, so its "before it is shown" reads too wide. This is D2.

**6. The test surface**
- `e2eOpenProjectFolder`, `e2eRelinkFile` and `e2eReadWorkspace` are registered only behind `isInstrumentedBuild()` (AdmissionPanel.tsx:448 to 460, App.tsx:1469 to 1478). Their only caller outside src is e2e/reopen.mjs (`git grep`).
- `holdUntiled` is a mock switch in App.reopen.test.tsx only.
- surfaceRegistry.ts: line 11 is restored, and "one of the eight SKP commands" is fixed, which are Amendment 57's two defects.
- Amendment 58 item 5:
  - Point 1 goes to the advisor (below).
  - Point 2 (`cancelledKeys` is never cleared): note N3.
  - Point 3: at a86af94b the T-6 file did not load at all, because of a literal dynamic import. T-6's own assertion-level base failure is at 8d3bb394. The record discloses both, so this is not an Evidence finding.

**7. The tests**
- T-1 to T-18 each reach their assertions. Where they are:
  - client.test.ts: T-1.
  - App.reopen.test.tsx: T-2 to T-5, T-7, T-8, T-9 W-STYLE, T-10 to T-13, T-18 and the order case.
  - reopenNotices.test.ts: T-6.
  - document.test.ts: T-9.
  - RefusalBlock.test.tsx: T-11.
  - openProject.test.ts: T-14.
  - surfaceCompleteness.test.ts: T-15.
  - saveProject.test.ts: T-16.
  - WorkingCanvas.wiring.test.tsx: T-17.
- Base failures at 8d3bb394, a86af94b, 398600bd and 5e72c116: reused from the worker records. Two mutations are reproduced (Q4, Q5).
- e2e/reopen.mjs against R1 to R9 and E-CHANGED, with Amendments 61 and 62:
  - R8 opens another file first and waits for P's close row (lines 314 to 319).
  - The close rows of R5, R8, R9 and E-CHANGED are read in `afterOpen` and known by their request text (`waitClosed`, lines 172 to 180).
  - R6 reads the Console at once after the call (line 274).
  - E-CHANGED asserts "In the file: mtime." and no admission part.
  - The header and the README no longer describe R3 and R8 exactly. This is D4 and D5.

**8. Lints**
- `npm ci` in shell and in bundle-viewer: each in a hold, rc 0, no tracked change.
- `npm run verify`, whole, in a hold at H: exit 0.
  - "Test Files 123 passed (123)", "Tests 1570 passed (1570)".
  - typecheck, the build, the dist checks and every `node --test` suite passed (fail 0).
  - Porcelain empty afterwards.

**9. Runs**: listed below under "Runs".

## Correctness
None.

## Evidence
None.

## Documentation (must fix before the merge)
None of these is the human's wording. Each is a worker's comment, record or README line, so the worker applies the words given with no re-gate, and the PR body lists them.

**D1. Step 2's overruns.** The closing amendment records as class 8 (round 25, item 2): step 2's 86 files against 75 and 9,027 lines against 5,170, and P4a's group figures 846/820, 122/90 and 847/690. The step's per-PR figures are in Q2.

**D2. frontends/shell/src/admission/formatRefusal.ts, the exception paragraph.**
Replace "so the reopen's run passes what this function returns through `project/shownText.ts`'s bound before it is shown or logged." with:

"so the reopen's run (`project/openProject.ts`'s `admitProject`) passes what this function returns through `project/shownText.ts`'s bound before the admission panel shows it and before its session log line is written. The Console's row is the exception (the form's packet P-14): it calls this function on the refusal as it came and shows it whole, format characters included."

Clause check:
- The bound comes before the panel and the log: openProject.ts:74 to 76; the panel renders the outcome's refusal.
- The Console's row is unbounded: ConsolePanel.tsx:178.
- P-14 is the form's own exception (item 13, "The console row shows a reopen refusal whole").

**D3. frontends/shell/src/App.tsx:2022 to 2029, the baseline first-look comment.**
Two of its statements are now untrue at a reopen with a saved filter or saved clauses:
- "The first look is unfiltered".
- "always `null` here in practice". `handleReopened` sets the ref after `handleAdmitted` (lines 1221 to 1230).

Replace lines 2022 to 2029 with:

"// The first look has no box: `describe` establishes no dataset extent to aim a viewport at
// (SKP-V0.md's C1), so the canvas's own fit-to-bounds-on-open is what puts the camera somewhere
// the data actually is, unless a reopen's saved view applies (O-17, the write below). Issued
// immediately, not debounced -- there is nothing yet to coalesce. Reads `activeFilterRef.current`
// too (design section: "all three issue sites read the REF at issue time"). At a fresh open it is
// `null`, since `handleAdmitted`'s own `admitAndResetStaleUiState` call cleared it before this
// effect re-runs; at a reopen it is the file's filter, or the one its clauses combine to, which
// `handleReopened` sets after that call in the same turn (B2 piece 1c, O-16), so the first look
// runs under the saved filter."

Clause check:
- No box: the call is `issueViewportQuery(null, null, …)` (line 2030).
- The saved view stops the fit: `applyView` sets `hasAutoFitRef`, and it is written at line 2033.
- The fresh-open clear: `handleAdmitted` calls `admitAndResetStaleUiState` at line 1182.
- The reopen value: lines 1221, 1225 and 1229, then the dispatch in the same callback.

**D4. frontends/shell/e2e/reopen.mjs:15 to 17.** The header says only R5 and R6 read Console rows. R8, R9 and E-CHANGED read rows too, and R8's `same` row is polled after the click.
Replace lines 15 to 17 with:

"// **The Console is read, not trusted.** R5, R8, R9 and E-CHANGED read `close_dataset` rows and R6 and R8 read `open_project` rows (class A) from the Console, whose ring keeps 256 entries (ADV-2026-11-19-06, A4-1).
// R6's read follows its call at once; each close row is read while the open after it runs, and R8's `same` row after the click, each polled to a harness bound. The suite prints the ring's label at each read, and the entries newer than the row at each close read and at R6.
// A row that is not there by its bound fails the step by name; the close reads and R6 name the form's stop 13. Every bound below is a harness bound, never a claim about how long anything takes (ADR-018)."

Clause check:
- Who reads which rows: lines 267, 274, 318, 326 to 331, 345 and 361.
- Labels and counts: lines 268, 283, 319, 335, 346 and 362.
- Stop 13 is named at lines 174 and 279.

**D5. frontends/shell/e2e/README.md:894, the R3 and R8 entries.** Two parts of the line do not match what the code asserts:
- "locators `machine-recorded,project-relative`". The code asserts only that the locators include `project-relative`, and that the clauses read on, off (lines 239 to 241).
- R8 omits the other file it opens first.

Replace "`R3` (the save through the hook; locators `machine-recorded,project-relative`)" with:
"`R3` (the save through the hook; the file's locators include `project-relative` and its clauses read on, off)".

Replace "`R8` (a hand copy of the project gives S8" with:
"`R8` (another file is opened first and P's `close_dataset` row read; a hand copy of the project then gives S8".

Clause check: lines 239 to 241 and 316 to 321.

**D6. Amendment 54 item 9 versus R8.** Item 9 says each Console row is read right after its call. R8's `same` row is polled for up to 60 s after the click (lines 326 to 331). Record this on the form, or take D4's words as the record of it. It is a harness poll, not a timing claim.

## To the advisor (Amendment 58 item 5, point 1, unreworded)
- The form says nothing of a file whose saved filter and clauses disagree.
- The kernel refuses such a file: `kernel/src/project/file.rs:389-396` @ c60327e8, "the filter is not what the enabled clauses combine to". `combine` of zero enabled clauses is `None` (file.rs:227 to 234).
- So the shell's `else if (reopened.workspace.filter !== null)` → `filter.apply` arm (App.tsx:1228 to 1230) cannot be reached from a file the kernel admits.
- For the same reason, the clause-first choice never meets a disagreeing filter.

## Notes
- N1. `reopenRefusalPlace` and `lineagePlaces` are exported for the tests and called inside their module.
- N2. `OpenProjectRequest` has no caller, the same as `SaveProjectRequest` and `RecordStepRequest` on main.
- N3. `cancelledKeys` is never cleared. Its keys are fresh `randomUUID`s, so nothing is dropped by mistake, and the growth is one key per Cancel.
- N4. A `describe` failure after `opened` loses the handle, the same as `admitDataset`'s existing pattern.
- N5. T-12's row says "each notice". The App case checks the block and the log line. `file_name`, `basis` and the column are checked in openProject.test.ts and in T-7.
- N6. S9's own-window choice compares the bounded `project` field with the held identity (openProject.ts:88). They match unless the kernel's identity text holds a control character or runs past 1,024 units.

## Runs
**Reused:**
- CI at H: 6 successful runs, as the custodian read them at 2026-11-20T11:08:18Z.
- The workers' unit runs: 123 files, 1,570 tests.
- The workers' e2e runs on the port-5400 harness: w-r4 at 5b71520d and w-r5 at W1, both passing R1 to R9 and E-CHANGED.
- The workers' base-failure records at 8d3bb394, a86af94b, 398600bd and 5e72c116.

**Reproduced (each in a shared hold):**
- The order mutation: exit 1, the case named in Q4. Reverted.
- The T-5 cancel mutation: exit 1, the case named in Q5. Reverted.
- `npm ci` in shell and in bundle-viewer: rc 0.
- `npm run verify` whole at H: exit 0, 123 files and 1,570 tests.

Every hold printed MACHINE_HOLD shared with also=<m> and project=<m>, and then MACHINE_RELEASED. There were no WAITING or ERROR lines and no exit code from 96 to 99.

The tree is clean at H. No node process running belongs to the worktree: I listed the node.exe command lines.

The scratch logs are in <S>/: g341r-mut-order.log, g341r-mut-cancel.log, g341r-npmci-shell.log, g341r-npmci-bv.log, g341r-verify.log and g341r-stepfiles.txt.

Model: Opus 5.5 (claude-opus-5-5).
