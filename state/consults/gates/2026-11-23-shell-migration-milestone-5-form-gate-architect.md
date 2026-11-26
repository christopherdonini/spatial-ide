Reviewed: main at 96f56d28206e74d6992156f3f7735483d8063fa8, in the detached read worktree C:/dev/wt/read-1123b (the custodian's filing note, 2026-11-23: the architect's form gate on the full form, attempt 1, node:shell-migration-milestone-5@form-gate-architect-1, dispatched at 2026-11-23T14:54:29Z; its run: Read 72, Grep 28, Glob 1, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-23T14:54:30Z to 2026-11-23T15:07:06Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 18471 bytes, sha256 c6e7e011b7f20c684073a3f656cc69b43e5ae1ebc60b6ba636e87b0abef95f76, byte for byte, nothing masked, with one final newline added. FAIL: E-1 (Evidence: the canvas-ceiling and stream-terminal routes and the scan Cancel its end-to-end tests need exist only on the dev-gated baseline arm, and the form pins no arm) and C-1 (Correctness: the count of conditions not kept has no declared lifecycle); D-a to D-i Documentation, D-h and D-i drafts of shown words for the advisor; OPEN-1 to OPEN-8 and KL-A to KL-D read for the advisor, not ruled.)

---

Verdict: FAIL
Reviewed: C:/dev/wt/read-1123b @ 96f56d28206e74d6992156f3f7735483d8063fa8

Every cite below is to the tree at 96f56d28. Between 0bcf5434 and 96f56d28 only records changed. Every code cite the form relies on still holds at the line it names, except where a finding below says otherwise.

## Correctness and Evidence findings (these block)

**E-1 (Evidence). The routes and Cancel path that the end-to-end tests need exist only on the dev-gated baseline arm. The form never says so and pins no arm. So its seam proofs are not taken on the shipped shape, which the seam rule requires.**

Places: §0.4 H2 and H3; §2.5 items 1, 2 and 4; §3 rows 1 and 2; §4 C-A1, C-E1, J-A1 and J-E1; §9 operator steps 1 to 3.

What the code does:
- **Canvas ceiling (`:667`).** It is reached only from the baseline `pushBatch` catch (`frontends/shell/src/canvas/WorkingCanvas.tsx:1538-1540`). The candidate arm's `pushTileBatch` never calls `onCanvasRefusal` (`WorkingCanvas.tsx:221-233`).
- **Stream terminal (`App.tsx:1892`).** It is in the baseline branch. That branch starts at `:1853`; the candidate branch returns before it (`:1745-1851`). On candidate, tile terminals are only logged (`frontends/shell/src/residency/candidateArmSession.ts:1013-1020`).
- **The suite already records this.** `frontends/shell/e2e/refusal-contract-baseline.mjs:209-217` says `.canvas-refusal` cannot be reached under the shipped candidate default, and pins baseline once in its own process.
- **C-A1's harness.** It runs the real App on the candidate arm, and its baseline `ViewportStreamManager` is a stub that captures no callbacks (`frontends/shell/src/App.streamFailure.test.tsx:4-11`). C-A1 cannot reach `:1892` as written.
- **J-A1 and J-E1.** On candidate, the inline Cancel calls `session.relinquishFill()` (`App.tsx:2306-2321`). Scan liveness only dispatches issued and reset (`candidateArmSession.ts:610-617`), so the state goes to idle. It never becomes `cancelled`, and `.scan-incomplete` never renders (`App.tsx:2562` needs `scanState.kind === "cancelled"`). The other branch, `cancelStream` with state `cancelled`, is baseline only (`:2323-2329`). J-A1's mutation acts on a branch the shipped build never takes.
- **Operator steps 1 to 3.** No operator can choose baseline in the shipped build. The walkthrough's Part D needs a DevTools `setResidencyArm("baseline")` step first. The form's Part has no such step.

What the form must say before any code (by amendment):
1. Canvas-ceiling and stream-terminal are baseline-arm routes. C-E1, together with H2, H3 and §3 row 1, runs in its own baseline-pinned process, as `refusal-contract-baseline.mjs` does.
2. C-A1 names how its harness reaches `:1892` on the real shape, or it moves to a route the candidate harness reaches.
3. Seam 8 also gets a shipped-arm proof, a real-App and real-app test on candidate covering session-ended, viewport-refusal and a notice.
4. J-A1 and J-E1 assert what candidate actually does: `relinquishFill` called once, the scan row and FilterPanel's Cancel gone, and no `.scan-incomplete`. The baseline `cancelStream` path goes to the baseline process, or is dropped with a reason.
5. The operator Part gets a step 0 that pins the arm, or its steps are re-aimed at what candidate shows.

**C-1 (Correctness). The `notKept` count has no declared lifecycle, so S-6 can show an untrue count.**

Places: §2.2's reducer; §2.7 S-6; §4 C-U6 and C-U7.
- `opened(resource)` ends conditions, but the form never says it resets `notKept`. S-6 counts per open (§7 bounds conditions "per open"). After a new open it could show a count from an earlier dataset.
- Three raise sites have no generation guard: the step-queue report (`App.tsx:879`), the save (`:2193`) and the reopen (`:1238`). §2.2 lists guards only at `:1604`, `:1620`, `:1888` and `:2404`. A late raise from an earlier open would take cap room it can never use, because `visibleFor` hides it.
- Fix:
  - declare that `opened` resets `notKept`;
  - declare that a raise whose generation is not the current open is dropped before the cap;
  - add both to C-U6 and C-U7, each with a mutation.

## Documentation findings (each must be fixed before the merge, by amendment)

**D-a, §0.2.** This is untrue. `admitAndResetStaleUiState` (`App.tsx:251-262`) does not clear the record, save or reopen notices. Each of those is tagged with its dataset and filtered at `:921-923`.
```text
- All are cleared by `admitAndResetStaleUiState` (`App.tsx:251-262`).
```
```text
- `canvasRefusal`, `viewportRefusal` and `sessionEnded` are cleared by `admitAndResetStaleUiState` (`App.tsx:251-262`). The record, save and reopen notices are not cleared there: each carries its dataset and is shown only while that dataset is the open one (`:921-923`).
```

**D-b, §0.2, §2.2's routes table and §2.2's App paragraph.** `:1194-1196` is the reset's adapter, and it only ever passes null (`App.tsx:254`, `:1194-1196`). It is a clear site, not a raise site. `sessionEnded` has one set site, inside `endSession` (`:1492-1496`).
```text
  - `:1194-1196` and `:1492-1496` (session ended).
```
```text
  - `:1492-1496` (session ended). `:1194-1196` is the reset's adapter, which only sets it to null: a clear site.
```
```text
| session-ended | `:1492-1496`, `:1194-1196` | session | `refusal.code` | resource | 1 | next-open |
```
```text
| session-ended | `:1492-1496` | session | `refusal.code` | resource | 1 | next-open |
```
```text
`sessionEnded` stays a state, because the hover latch, the table and the watcher read it. Its two set sites also raise.
```
```text
`sessionEnded` stays a state, because the hover latch, the table and the watcher read it. Its one set site (`:1492-1496`) also raises; its clear at `:1194-1196` runs where `opened` is dispatched.
```

**D-c, §0.2 and §2.4.** `:1299-1305` is the doc comment and head of `answerOpenAsk`. The `run.cancel()` call itself is at `App.tsx:1313`.
```text
The open-during-export ask calls `run.cancel()` (`:1299-1305`).
```
```text
The open-during-export ask (`:1299-1305`) calls `run.cancel()` (`:1313`).
```
```text
  - The ask's call (`:1299-1305`) is unchanged.
```
```text
  - The ask's call (`:1313`) is unchanged.
```

**D-d, §0.4 H2.** `source-changed.mjs` never writes to its copy. It changes the source by repointing a directory junction, and the copies hash equal (`frontends/shell/e2e/source-changed.mjs:33-39`). `:770` only copies the fixture. The (r) pin `:770` is the line the form means, but that line does not support the sentence. The arm clause comes from E-1.
```text
| H2 | A scratch copy of `over-ceiling-refused.parquet` ends its session after a write and a pan, as `source-changed.mjs` does with the 100k copy (`:770`). | C-E1, step 4 |
```
```text
| H2 | A scratch copy of `over-ceiling-refused.parquet`, opened on the pinned baseline arm, ends its session after a write to the copy and a pan. This is a new mechanism: `source-changed.mjs` copies its 100k fixture (`:770`) and changes the source by repointing a junction, not by a write (`:33-39`). | C-E1, step 4 |
```

**D-e, §2.3 (the files and the ceiling).** Two Console registry statements go stale under the store. `canvas.dismissCanvasRefusal` and `canvas.dismissViewportRefusal` name `setCanvasRefusal(null)` and `setViewportRefusal(null)` (`frontends/shell/src/console/surfaceRegistry.ts:234-236`, `:243-244`), and the store removes both setters. Their new words are a P6 draft. If the edit takes surfaceRegistry past its ceiling of 6, the overrun is recorded as class 8 (§7 is not edited).
```text
- `surfaceRegistry.ts`: the statement of `layout.selectActivityTab` names the new tab (S-12).
```
```text
- `surfaceRegistry.ts`: the statement of `layout.selectActivityTab` names the new tab (S-12), and the statements of `canvas.dismissCanvasRefusal` and `canvas.dismissViewportRefusal` (`:234-236`, `:243-244`), which name the removed setters, name the store's `dismiss(id)` instead (S-13, a P6 draft).
```

**D-f, §0.2's selector list.** The list is incomplete. Six reads of the strip's classes are missing: `e2e/project.mjs:274`, `e2e/reopen.mjs:295`, `e2e/refusal-contract-baseline.mjs:377-382` and `:623`, and `e2e/residency-harness.mjs:829` and `:2754`. All of their files are already in §2.6, and the 0.3 re-sweep is what binds.
```text
- the dismiss sweeps at `e2e/console.mjs:1041`, `e2e/admission-remediation.mjs:856` and `e2e/regression.mjs:2671`.
```
```text
- the dismiss sweeps at `e2e/console.mjs:1041`, `e2e/admission-remediation.mjs:856` and `e2e/regression.mjs:2671`;
- also `e2e/project.mjs:274`, `e2e/reopen.mjs:295`, `e2e/refusal-contract-baseline.mjs:377-382` and `:623`, and `e2e/residency-harness.mjs:829` and `:2754` (found at the form gate; the 0.3 re-sweep's list is the complete one).
```

**D-g, §9's reviewer checks.** Under ADV-2026-11-23-15 item 4, the piece's diff runs from its recorded base to its head. `origin/main...HEAD` would also count the changes of the re-link and of PR 353, PR 358 and PR 359. §7's count command already uses `<base>`.
```text
  - the diff `origin/main...HEAD`;
```
```text
  - the diff from the recorded base to HEAD (ADV-2026-11-23-15 item 4), not `origin/main...HEAD`;
```

**D-h, §2.7 S-7. A P6 draft for the advisor; I do not rule it.** The draft says nothing is running, which is untrue in ordinary use. An open, a save or a reopen can be running while Jobs is shown, and Jobs lists none of them (OPEN-5 (a)).
```text
| S-7 | `[P6 placeholder] Nothing is running.` | JobsTab, empty |
```
```text
| S-7 | `[P6 placeholder] No map loading or export is running.` | JobsTab, empty |
```

**D-i, §2.7 S-5. A P6 draft.** `{n}` is not defined. If it is `occurrences`, the line overstates by one: after a single pan, it would say "Raised again 2 times".
```text
| S-5 | `[P6 placeholder] Raised again {n} times. The latest:` | ConditionView, when `occurrences > 1` |
```
```text
| S-5 | `[P6 placeholder] Raised again {n} times. The latest:` | ConditionView, when `occurrences > 1`, with `{n}` = `occurrences − 1` |
```

## Notes (none blocks)

- **Plan §9 against the cap.** Plan §9 binds that Problems keeps every unresolved condition (`state/directives/SHELL-MIGRATION-PLAN-2026-10-07.md:247`). `CONDITIONS_MAX` with `notKept` departs from that. Because raises merge by typed key, the cap is practically unreachable, but the closing should declare it as a bound under §9. Advisor's to confirm.
- **C-U3 can pass the C-U1 mutation.** The mutation adds `replaced-by-owner` to stream-terminal, and C-U3 is named in its failing set. C-U3 fails it only if refusals A and B are both raised on the stream-terminal route, with the same view and generation. Declare that in C-U3 before code.
- **A fact shown twice (baseline post-check route).** There, a session-ended terminal calls `endSession` and then `opts.onTerminal` (`frontends/shell/src/streaming/viewportStreamManager.ts:338-367`). That raises session-ended and a stream-terminal condition with the same code. Today the canvas banner already shows beside session-ended, so this is not new. C-A4 covers only the pre-check route. Name it as unchanged, or add a case.
- **Reopen notices.** `setReopenNotices` runs after `handleAdmitted(next)` (`App.tsx:1238`), so its raise must come after `opened` and carry the new handle. C-A3 should assert that reopen notices survive their own open.
- **Problems rows.** Owner elements moved into Problems rows: §2.3 gives `role="alert"` only to the top, so other rows must drop the role they carry today. ConditionView moves `App.tsx:2469-2532` whole, and C-R1 should assert the role per place.
- **Ceiling risk.** B-P gives App 150. Moving the 70-line inline handler (`App.tsx:2261-2330`) counts about 140 lines under numstat before the `exportJobs` mirror. A class-8 overrun is likely. Not a block.
- **The split (OPEN-7 (a)) is sound.** Each PR has its own §7 group, file list, tests and gates, and PR B is built on PR A. One form serves, provided each PR gets its own re-sweep and closing amendment. §10 names one re-sweep per PR but no closing per PR; say so.
- **The class holds as full.** ADV-2026-11-23-15 item 7 (c) sets it. ADV-2026-11-16-06 item 2 (a) agrees: what the user is told (refusals), cancellation, and well over 260 lines. §21c is exceeded too. ADV-2026-11-16-06 ran for the week from 2026-11-16, and that week has now run, but item 7 (c) stands on its own.
- **The base.** The re-link is in progress on `cut/relink-after-refusal`, not a held PR. Building PR A on its branch extends item 4's reading of a held branch. That reading is the advisor's; I tell them of it. Scope and merge order agree: §9's merge line and item 5's order.
- **Never block the canvas.** Reducer dispatch is synchronous, and no wait is added on the canvas path. The Jobs scan Cancel is FilterPanel's own function, as §2.4 says. The export Cancel is `run.cancel()`, so ADR-006 class 3 is unchanged and nothing claims undo. ADR-018: no figure, and Jobs claims nothing was cancelled. ADR-021: FilterPanel's Cancel stays. ADR-010 rule 1: the map key is unchanged. docs/02: everything stays inside `frontends/shell`, with no wire or MCP surface.
- **Seams, against the actual signatures.**
  - `onCanvasRefusal(streamHandle, message)` (`WorkingCanvas.tsx:563`): adding `kind` is sound, with H5's adapters, but its route is baseline only (E-1).
  - `ExportRunReport` (`frontends/shell/src/publish/PublishPanel.tsx:33-41`) and the StudioLayout slots (`frontends/shell/src/layout/StudioLayout.tsx:306`, `:379-383`) match the form.
  - FilterPanel's `onCancel` (`frontends/shell/src/filter/FilterPanel.tsx:28`) matches the form.
- **Records.**
  - Every quoted passage I checked is byte-identical to its source:
    - "discussion constraints" (`state/drafts/design/SPATIAL-IDE-DESIGN-NOTEBOOK.md:602`);
    - "Problems panel — spatial linting" (`docs/03_UX.md:19`);
    - "Console, Notices and Table" (`frontends/shell/src/console/surfaceRegistry.ts:322`);
    - "never erases an older blocker" (plan `:247`);
    - "Cancel" and "Cancelling" (`PublishPanel.tsx:727`).
  - I cannot check the reuse output against its run; the reviewer can.
  - The form has no ledger line cite and no bare self-line. Its pins are declared historical, and the tree is authoritative from the re-sweep on.
  - The (r) entries:
    - plan `:3` is the header naming the nine seams: correct.
    - `App.tsx:1892` is the right line, but on the baseline branch only (E-1).
    - `source-changed.mjs:770` is the right line, but it does not support H2 (D-d).
- **Mutations without a known pass case:** C-U2, C-U4 to C-U7, C-R1 to C-R3, C-A2 to C-A4, J-U1, J-U2, J-R1, J-A2 and J-E2. For C-U1, see the C-U3 note. C-A1, C-E1, J-A1 and J-E1 wait on E-1.

## OPEN items and KL drafts (to the advisor; not ruled)

- **OPEN-1 (D):** sound.
- **OPEN-2 (a):** sound against §9; note that its route is baseline only.
- **OPEN-3 (a):** sound.
- **OPEN-4 (a):** sound.
  - `run.cancel()` keeps class 3. The prepare row can exist during the picker window, when `cancel` returns false, which leads to S-11 (`frontends/shell/src-tauri/src/commands.rs:413-421`; `PublishPanel.tsx:402-408`).
  - S-11 is true for `false`, since no token was set. For a rejection, the panel's own comment asserts the same (`PublishPanel.tsx:215`), but no code shows that the host set nothing before an IPC failure.
- **OPEN-5 (a):** sound. A table load cannot run while Jobs is shown (`StudioLayout.tsx:171-172`; `frontends/shell/src/table/TableTab.tsx:63-67`).
- **OPEN-6 (a) and OPEN-7 (a):** sound.
- **OPEN-8:** sound.
- **KL-A and KL-C:** true against the design.
- **KL-B:** "the map's loading" is true only as far as `isScanInFlight` holds. It does not mention the Table tab's load.
- **KL-D:** Problems also empties when the same file is opened again, because every open mints a new handle (`App.tsx:726-729`). The draft names only another dataset.
- **The `KNOWN-LIMITATIONS.md:185-189` paragraph:** it does hold for the Jobs row, which mirrors `isScanInFlight`.

## Files read (all at 96f56d28, in `C:/dev/wt/read-1123b`)

- **The form and its draft:**
  - `governance/forms/frontends/SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md`
  - `state/consults/2026-11-23-shell-migration-milestone-5-architect-draft.md` (only the lines before its title and the note after its end mark)
- **The authority:**
  - `state/directives/2026-11-23-the-humans-message-never-idle-product-first-what-to-build-now-the-pauses-lifted-for-product-pieces-what-does-not-change.md`
  - `state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-15-the-humans-message-filed-the-relink-built-now-on-three-held-heads-two-forms-now-the-gap-pieces-the-sitting-hour.md`
  - `state/directives/2026-11-16-advisor-ruling-adv-2026-11-16-06-the-humans-directive-of-2026-11-16-put-in-force-focus-record-classes-runs-pieces-models-the-two-drafts-the-held-dispatches-go.md`
  - `state/directives/SHELL-MIGRATION-PLAN-2026-10-07.md`
  - `state/directives/2026-10-07-migration-plan-v2-ruled.md`
  - `state/drafts/design/SPATIAL-IDE-DESIGN-NOTEBOOK.md`, lines 600-615 and 794-797
  - `governance/AUTONOMY.md`, lines 306-357
  - `governance/PLAN.yaml`, lines 5433-5449, and the re-link's node
- **The constitution:**
  - `docs/01_Principles.md`, `docs/03_UX.md`, `docs/07_Roadmap.md`
  - `docs/adr/ADR-006-lineage-undo-side-effects.md`, `docs/adr/ADR-018-what-cancellation-acknowledged-means.md`, `docs/adr/ADR-021-row-filter-on-viewport-query.md`
- **Shell code, under `frontends/shell/src/`:**
  - `App.tsx`
  - `canvas/WorkingCanvas.tsx`
  - `residency/candidateArmSession.ts`
  - `streaming/viewportStreamManager.ts`
  - `formatTerminalRefusal.ts`
  - `publish/PublishPanel.tsx`, `publish/PublishDialog.tsx`
  - `layout/StudioLayout.tsx`, `layout/contributions.ts`, `layout/layoutState.ts`, `layout/statusItems.ts`
  - `table/TableTab.tsx`
  - `filter/FilterPanel.tsx`
  - `console/surfaceRegistry.ts`
  - `workspace/workspaceState.ts`
  - `admission/admitDataset.ts`
  - `App.streamFailure.test.tsx`
- **Host code:** `frontends/shell/src-tauri/src/commands.rs`
- **e2e suites, under `frontends/shell/e2e/`:**
  - `refusal-contract-baseline.mjs`, `source-changed.mjs`
  - `project.mjs`, `reopen.mjs`, `residency-harness.mjs`
  - `source-watch-idle.mjs`, `regression.mjs`, `selection.mjs`, `layout.mjs`, `console.mjs`, `admission-remediation.mjs`
- **Records:**
  - `frontends/shell/MANUAL-WALKTHROUGH.md`
  - `KNOWN-LIMITATIONS.md`

Model: Opus 5.5.
