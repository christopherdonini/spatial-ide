Reviewed: PR #341 at c60327e87c8990f8fdb430fcf9b734eb1393a46e (the custodian's filing note, 2026-11-20: the architect's gate of P4a; Read 41, Grep 35, Glob 4, SubagentHandback 1, none errored, model claude-opus-5-5, from 2026-11-20T11:29:59Z to 2026-11-20T11:41:29Z by its transcript; the report below byte for byte from its hand-back of 11521 bytes, sha256 b5787f1b420c1ca82b30c604b2fdcfb23291bfd5ac954f02653bd2b4e5e7da88, nothing masked by the custodian, with this note in its first line and one final newline), gate, architect, attempt 1
Gate: PR #341, b2-piece-1c-save-and-reopen P4a, architect, at c60327e87c8990f8fdb430fcf9b734eb1393a46e (cut/b2-piece-1c-p4a @ c60327e87c8990f8fdb430fcf9b734eb1393a46e; base 7f7eb6d60d18862278fe06f6488c762b831c63a8)

Verdict: FAIL, on the words of one doc sentence only (governance/AUTONOMY.md §31). The code's Correctness and Evidence are closed. The sentence is a worker's, so the worker applies my words below with no re-gate, and the PR body lists them. One more doc finding must be fixed before the merge.

Mapped onto §22's three verdicts:
- Correctness: one untrue limit clause in a doc comment, F-1. It is resolved by the replacement words below.
- Evidence: closed.
- Documentation: D-1, must be fixed before the merge.

## The eight questions

**1. The order at the reopen, and O-17's sentence (Amendment 61).** Holds.
- `handleReopened` (App.tsx) stores the saved view in `reopenViewRef`, keyed by the new dataset handle. It then calls `handleAdmitted`.
- The `[admitted]` effect takes the view at its start and clears the entry. It writes the view right after the first look's call, in both arms, synchronously and in the same turn:
  - candidate arm: App.tsx 1834, then 1836;
  - baseline arm: 2030, then 2033.
- The candidate arm's one reset is `reissueUnrestricted` → `canvas?.resetFitForNewGeneration()` (residency/candidateArmSession.ts, about line 1745). It is synchronous, before any await, so it comes before the write.
- The baseline arm's `issueViewportQuery` resets nothing. Its one-shot fit is unset because the canvas remounts per dataset.
- After the write, `hasAutoFitRef = true` stops the pushBatch and pushTileBatch auto-fits. Only a later generation (Apply) resets the fit. `establishTileGridContext` does not move the camera.
- Amendment 61's sentence is true clause by clause in both arms. It also removes the baseline defect that p4a-3-fix's report sent to the advisor.
- A second open cannot overlap the first in product use: the buttons are disabled while one is in flight, and `requestPick`/`requestProjectPick` check busy.
- A stale `reopenViewRef` entry left by another open does no harm, because dataset handles are unique.

**2. The run and cancellation.** Holds.
- `runAdmitPath` (AdmissionPanel.tsx 216–292) sends a `question` or `not_found` that arrives after Cancel to idle with "Open cancelled". The shell holds only the run's folder and options.
- `cancelledKeys` is a `useRef(new Set)`. Keys are added on Cancel and never cleared. Each is a fresh UUID, so this costs one string per press, with no behavioural effect.
- A reopen goes through `admitProject` only, with `formFamily: null`. No path re-enters `admitDataset` or `open_dataset`.
- A relink picker that is dismissed ends at "Open cancelled".

**3. The lock at a same-window reopen, and item 12's timing rows.** Holds.
- The new handle opens before the old one closes, by design. The close of the earlier dataset is fire-and-forget, over `selectClosable` (App.tsx 1645–1650).
- A same-window reopen of the held project shows S9-own. `heldProject()` compares against `admittedDatasetRef.current`.
- The timing inside one round trip is named in openProject.ts:60, as item 5 (e) requires.
- Note N-3 covers the export-consumer case.

**4. Refusal routing.** Holds, except for the doc sentence F-1.
- Routing: `reopenRefusalPlace` follows ADV-2026-11-20-05 item 4.
- The module-private set: `ASSERTION_GUIDANCE_CODES = new Set(["engine.crs_assertion_conflict"])` (RefusalBlock.tsx) is not exported.
- The other callers (CommandBar, PublishPanel, App's sessionEnded slot, TableTab, FilterPanel, ClauseCards) pass neither new prop, so each renders as it does on main.
- The bound: `shownRefusal(formatRefusal(...))` covers the refusal's message and fields, the logged "reopen-refused" line, `file_name`, `basis` and O-18's column. The workspace's own text applies whole (item 5 (k)). The Console's row shows the refusal whole (ConsolePanel.tsx:178, `formatRefusal(vm.refusal)`), as item 13 (P-14) allows. That is where F-1's sentence overclaims.
- `binding_log_session_event` and `diagnostics/log.ts` are not among the 31 paths. The reviewer confirms this by git.

**5. The workspace applied.** Holds.
- `applyView` → `fitToExtent(point bbox, false, saved)`:
  - The write is unreported, and `onViewShown` fires once.
  - `lastQueriedRef` becomes null.
  - The target is [0,0] at the saved centre, through the frame origin (ADR-010 rule 1).
  - T-17 checks centre and zoom with Object.is, then that no auto-fit follows.
- V1 to V3: the view is decoded only when `view.state` is `applies`. Otherwise the fit runs and S19 shows `shownText(basis)`.
- `projectSaver.adopt` adds the dataset, so the next save sends `folder: null`.
- Filter versus clauses: N-1, to the advisor.

**6. Scope and seams.** Holds.
- Exports match item 10's table, plus the types item 5 (a) declares. `OpenProjectRequest` has no caller, as the existing `SaveProjectRequest` has none (N-5).
- The seam to the kernel is written against the real reply shape:
  - `client.ts` `openProject` sends `{skp, folder, cancel_key, answer, relink}`, each null sent, never omitted.
  - `SKP_VERSION` is already skp/0.14 on main.
  - E-REOPEN R1 to R9 run against the real app.
- The three DEV hooks (`e2eOpenProjectFolder`, `e2eRelinkFile`, `e2eReadWorkspace`) are registered only under `isInstrumentedBuild()`. They are documented in e2e-test-surface.ts 191–205.
- All 31 paths are under frontends/shell/. None is under protocol, kernel, engine or src-tauri.
- I found no undeclared acts.
- The stale cites are D-1.

**7. The words.**
- Each string in reopenNotices.ts matches the ADV-05 and ADV-09 fences, each with its `[P6 placeholder] ` mark: S8 (the question and its three choices), S9-own, S9-other, S10, S12 and its two lead-space parts, S11, S11-none, the choice line, S16, S17, the refused line, S19 to S21, R-ENG, R-CODE and its locator line, S-PANIC, W-TEXT, O-18 (as replaced by -09), W-STYLE.
- O-9 is at saveProject.ts:33 and O-19b at actionRegistry.ts:90.
- I compared by reading. The reviewer recomputes the bytes.
- Both surfaceRegistry defects from Amendment 57 are fixed: line 11, and line 12's "eight", with `open_project` as the eighth class-A row.
- These strings are the advisor's words, and none needs rewording.
- The doc sentences the workers wrote are true, except F-1 and the stale cites in D-1.

**8. The suite.** Holds.
- `runStep` runs R1 to R9, then E-CHANGED, in order; the first failure ends the run (e2e/reopen.mjs 433–443).
- R8 opens another file first, with `waitClosed` in `afterOpen`. It then copies P to Q, opens Q expecting `question`, answers "same", and checks folders.json.
- R9 and E-CHANGED do their `waitClosed` reads in `afterOpen`.
- `waitClosed` knows the new row by its request text, which is not among `known`.
- R5 takes `known` before the open and calls `waitClosed` in `afterOpen`.
- R6 reads the Console right after the open, before the first look.
- `holdUntiled` lives in the vi.mock factory, so it is test only.
- The Amendment 60 case drives the real candidate session. It asserts one write, one reset before it and none after.
- The P-base T-6 file failed to load at a86af94b on the missing `./shownText` import. That counts as a missing-symbol failure. T-6's mutation is recorded in the p4a-1 report's table.

## Findings

**Blocking (wording only, §31, not the human's wording; the worker applies these words with no re-gate; to the advisor):**

**F-1.** frontends/shell/src/admission/formatRefusal.ts:17–21. Byte-copied from that file:
"**The one exception is a reopen's refusal** (B2 piece 1c, Amendment 54 item 5 (j)): its message and field values can repeat text read from a project file, so the reopen's run passes what this function returns through `project/shownText.ts`'s bound before it is shown or logged."

This is untrue in ordinary use. Every reopen refusal also appears in the Console's row, unbounded (ConsolePanel.tsx:178). The clause claims a limit the code does not hold.

Replacement for lines 17–21:
```
 * **The one exception is a reopen's refusal** (B2 piece 1c, Amendment 54 item 5 (j)): its message and
 * field values can repeat text read from a project file, so the reopen's run passes what this function
 * returns through `project/shownText.ts`'s bound before the run shows it or logs it. Control and
 * direction characters there are replaced, and a text over the bound is cut and marked as cut. The
 * Console's row of the `open_project` call is not bounded: it shows the refusal whole (Amendment 54
 * item 13). The code and the field names are untouched, and this function itself still changes nothing.
```

Clause check:
- (a) "the reopen's run passes … before the run shows it or logs it": openProject.ts `admitProject` builds `shownRefusal(formatRefusal(...))` before the "reopen-refused" log line and before the panel's state. True.
- (b) "replaced … cut and marked": shownText.ts 31–35. True.
- (c) "the Console's row … shows the refusal whole": ConsolePanel.tsx:178 calls `formatRefusal(vm.refusal)` with no bound. True.
- (d) "code and field names untouched": `shownRefusal` keeps `code` and each key. True.
- (e) "this function itself still changes nothing": the diff to `formatRefusal` is doc only. True.

**Must-fix before the merge (Documentation; the worker's words; apply with no re-gate):**

**D-1.** frontends/shell/src/App.tsx:696–697 cites `formatRefusal.ts:70-83` and `RefusalBlock.tsx:25`. P4a's own edits made both stale: `refusalGuidance` now starts at formatRefusal.ts:76, and the dispatch is RefusalBlock.tsx:30.

Replacement for lines 696–697, by symbol, so that later insertions cannot shift it:
```
 *   which is what makes `refusalGuidance("engine.source_changed")` (`formatRefusal.ts`'s `refusalGuidance`)
 *   actually reach an eye, since `RefusalBlock.tsx`'s `guidance` line is the only product dispatcher of it;
```
Clause check: a grep of `refusalGuidance(` across src finds its only product call at RefusalBlock.tsx:30. The other hits are tests, testUtils and comments. True.

**Notes:**
- **N-1 (to the advisor; the form's words, not reworded):** Amendment 58 item 5's first point covers filter and clauses that disagree. `handleReopened`'s `filter.apply` arm cannot be reached from a real reply. The kernel's `workspace()` (kernel/src/project/file.rs:393 on main) refuses any file whose filter is not what its enabled clauses combine to. The kernel's `combine` matches the shell's `combineClauses`.
- N-2: if `describe` fails after `opened`, `admitProject` never closes the handle, so the project lock stays held. `admitDataset` on main has the same pattern. Ordinary use does not reach it.
- **N-3 (to the advisor):** an export consumer can keep P open after a switch. A reopen of P from the same window then shows S9-other, because `heldProject` compares against the current dataset. Item 13's "S9 shows" row does not name which S9. The S9-other words do not say where the lock is held, so they stay true.
- N-4: the DEV hooks skip the busy check. They exist only in the instrumented build.
- N-5: `OpenProjectRequest` has no caller, the same as on main for `SaveProjectRequest` and `RecordStepRequest`. Item 5 (a) declares it.
- N-6: `cancelledKeys` is never cleared (see Q2). This is harmless.
- N-7, outside scope: publish/formatPublishRefusal.test.ts:50 also cites `RefusalBlock.tsx:25`, which is now stale. It goes to the docs lane.

Model: Opus 5.5 (claude-opus-5-5), as the harness reports it.
