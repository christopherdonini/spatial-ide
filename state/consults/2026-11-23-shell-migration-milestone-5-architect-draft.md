*Filed by the custodian: the architect's draft preregistration for shell migration milestone 5, conditions, Problems and Jobs (the human's message of 2026-11-23 item 3 (c); ADV-2026-11-23-15 item 7 (c)), node:shell-migration-milestone-5@architect-draft-1, dispatched at 2026-11-23T13:47:37.242Z. It read the repository at 0bcf5434 in a detached read worktree and ran nothing. Its run: Read 45, Grep 42, Glob 7, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-23T13:47:37Z to 2026-11-23T14:00:54Z by its transcript; 0 calls named the main checkout. The report below from its hand-back, 42101 bytes, sha256 db482c10f384a236c0f692e3664c6ec90e68b24c63e501b5f696b7629a70cc56, byte for byte, with one final newline added. Its form is filed beside it in the same commit.*

---

# Shell migration, milestone 5: conditions, Problems and Jobs. One home for failures and running work (PLAN node `shell-migration-milestone-5`)

- **Path:** `governance/forms/frontends/SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md`.
- **Authority:**
  - PLAN node `shell-migration-milestone-5` (`governance/PLAN.yaml:5433-5449` @ 0bcf5434), the whole summary.
  - The human's message of 2026-11-23, item 3 (c). The custodian files it in the records commit before this form. It is cited here by its item and not reproduced.
  - The advisor's ruling ADV-2026-11-23-15: item 7 (c) for this form, item 4 for building on a held branch, and item 8 for the OPEN items. These are the advisor's words under the human's delegation of 2026-11-13. They are cited by item.
  - The migration plan, §9: `state/directives/SHELL-MIGRATION-PLAN-2026-10-07.md:243-251` @ 0bcf5434. Also §2's rules (`:20-36`), §4's row 5 (`:64`) and the 2026-09-28 provision (`:68`). The plan's ruling is `state/directives/2026-10-07-migration-plan-v2-ruled.md`, item 2: the plan is the order, and §13 is ruled as written.
  - Seam 8 is defined at `state/drafts/design/SPATIAL-IDE-DESIGN-NOTEBOOK.md:613` @ 0bcf5434. The plan cites that table (`:3`). The table's own label is "discussion constraints" (`:602`). The plan's §9 is what binds. The notebook's target note is at `:796`.
  - docs/03 "Problems panel — spatial linting" (`docs/03_UX.md:19-21`); docs/07 Alpha (`docs/07_Roadmap.md:39`); docs/01 principle 7 (`docs/01_Principles.md:13`) and its derived rule (`:20`); ADR-021's acceptance condition (`docs/adr/ADR-021-row-filter-on-viewport-query.md:11-16`).
- **Drafted by** the architect agent, read-only, at main 0bcf543452af79df6251cc7d86ab9f2cf644fcc2. **None of these words is the human's.** Every string the app shows is a P6 draft for the advisor (§2.7).
- **Committed before any code.** It is append-only once committed. An amendment written after any outcome has been seen says so in its first line.
- **Pins:** every `path:line @ 0bcf5434` in this form is a historical pin. The custodian adds each span's sha256 by script in Amendment 1. Where the tree and a pin differ, the tree is authoritative from the §0.3 re-sweep on.
- **Form and gating:** full form, with full gating from dispatch (ADV-2026-11-23-15 item 7 (c)). The reasons:
  - it adds user-visible behaviour (the strip shows one condition, and there are two new tabs);
  - it adds a new seam;
  - it changes a canvas callback, under OPEN-2 (a);
  - it exceeds §21c.
- **Reuse index:** the custodian ran it twice in the private clone at 89bbac37 on 2026-11-23. Its output follows, byte for byte as briefed:

```
No prior art recorded for "problems panel diagnostics list". Research it before planning an implementation.
No prior art recorded for "background jobs panel progress list". Research it before planning an implementation.
```

  Both queries miss. The misses are noted, and they block nothing. Nothing is ported.

## §0. Disclosure

**0.1 Inputs.** No pilot, spike or measurement has been run. I read:
- plan §§1–9, §11–13, and the ruling;
- the notebook's §12 and its 28 September consolidation;
- milestone 4's form, for its structure;
- milestone 3's headings;
- the template's headings;
- every interface in 0.2.

**0.2 The interfaces this piece is written against (the seam rule).** All are pinned @ 0bcf5434.

The attention strip and the status bar today:
- The strip has three registered items (`frontends/shell/src/layout/contributions.ts:46-47`). StudioLayout renders each item's slot in that order, and hides the strip when none has content (`frontends/shell/src/layout/StudioLayout.tsx:306`, `:379-383`).
- App fills the three slots at `frontends/shell/src/App.tsx:2469-2532`:
  - session ended goes through `RefusalBlock`, has no Dismiss, and is ended only by a successful admission;
  - `canvasRefusal` is a `string | null` with a Dismiss;
  - the record, save and reopen notices are text lines with no Dismiss;
  - `viewportRefusal` has a Dismiss, and is suppressed while the session-ended item stands.
- The states are declared at `App.tsx:872`, `:887`, `:889`, `:921-923`, `:944-945` and `:958`.
- They are set at:
  - `App.tsx:667` (`handleCanvasCeilingRefusal`) and `:1892` (a stream terminal);
  - `:1613` and `:1623` (the viewport outcome; a resolved outcome clears it unless the session ended, `:1612`);
  - `:879` (the step queue's report, which replaces the last);
  - `:2193` (each save replaces the last save's notices);
  - `:1238` (the reopen);
  - `:1194-1196` and `:1492-1496` (session ended).
- All are cleared by `admitAndResetStaleUiState` (`App.tsx:251-262`).
- A second canvas refusal overwrites the first (`:667`, `:1892`). Two equal strings are one React state, so text decides.
- The canvas reports a ceiling refusal as a bare message (`frontends/shell/src/canvas/WorkingCanvas.tsx:563`, `:1538-1540`). The two error classes are known at `:1538` and are not passed on.
- Every open mints a new dataset handle (`App.tsx:726-729`, `:2337-2339`). `Admitted.session` is documented as used only to route the session-ended event (`frontends/shell/src/admission/admitDataset.ts:15-18`). So this piece does not use it.
- The workspace defines view, resource and generation (`frontends/shell/src/workspace/workspaceState.ts:9-13`, `:37-46`, `:92-97`). No action adds a second view (`:16-17`).
- The status bar's items are at `contributions.ts:50-56`. `statusItems.ts:37-45` keeps Cancel in FilterPanel (ADR-021).

Activity:
- The tabs are Console, Notices and Table (`contributions.ts:40-44`). The tab type is derived (`frontends/shell/src/layout/layoutState.ts:34`), and the default tab is `"console"` (`:51`).
- Every tab panel stays mounted under `hidden` (`StudioLayout.tsx:41-42`, `:443-453`). Reveal-a-tab follows the pattern at `StudioLayout.tsx:256-259`.
- A table load runs only while the Table tab is shown (`StudioLayout.tsx:171-172`, `:148`).

The scan's Cancel:
- `ScanState` and `isScanInFlight` are at `App.tsx:450-457` and `:530-532`. The liveness text is at `:554-563`, with no figure implying a duration (`:549-553`).
- FilterPanel shows Cancel exactly while `isScanInFlight` holds (`frontends/shell/src/filter/FilterPanel.tsx:120-121`), and calls `onCancel` (`:28`).
- App's handler is inline in the JSX (`App.tsx:2261-2330`). It covers the candidate arm's `relinquishFill` (`:2306-2321`) and the baseline's cancel (`:2323-2329`).

The export's Cancel:
- `ExportRunReport` is `{cancel, ended}` (`frontends/shell/src/publish/PublishPanel.tsx:33-41`). Paraphrase of `:35-36`: `cancel`'s `true` means a token was found and set, not that the run stopped.
- It is reported for a prepare (`PublishPanel.tsx:402-408`) and for an execute (`:517-521`).
- App holds the runs in a ref (`App.tsx:1249-1282`). The open-during-export ask calls `run.cancel()` (`:1299-1305`).
- The panel's own Cancel is shown only once a phase event has proved a token exists (`PublishPanel.tsx:148`, `:720-727`; MF1). The e2e destination path registers no token (`:449-453`).
- The native save picker is opened with no parent window (`frontends/shell/src-tauri/src/commands.rs:413-418`). Whether it is modal to the webview is not established (OPEN-4).
- The execute's Cancel is in the inline, non-overlay dialog (`frontends/shell/src/publish/PublishDialog.tsx:228-231`, `:236`).

Console registry:
- `layout.selectActivityTab`'s statement names "Console, Notices and Table" (`frontends/shell/src/console/surfaceRegistry.ts:318-324`). It becomes incomplete.
- The dismiss rows are at `:230-246`.

e2e reads of the strip's classes:
- `frontends/shell/e2e/project.mjs:383-386` (S18 once among `.save-notice`);
- `e2e/residency-harness.mjs:719` (Playwright `.first()` click, which waits for visibility);
- `e2e/source-changed.mjs:732-744`;
- `e2e/source-watch-idle.mjs:249-250`;
- `e2e/refusal-contract-baseline.mjs:188-191` and `:261-273`;
- `e2e/regression.mjs:260-263`;
- `e2e/reopen.mjs:366`;
- `e2e/selection.mjs:161` and `:764`;
- `e2e/layout.mjs:288-320`;
- the dismiss sweeps at `e2e/console.mjs:1041`, `e2e/admission-remediation.mjs:856` and `e2e/regression.mjs:2671`.

The test harness: `frontends/shell/src/App.streamFailure.test.tsx:4-11` (the real App, with the canvas stand-in capturing `WorkingCanvasProps`).

Records: the last walkthrough Part is AD (`frontends/shell/MANUAL-WALKTHROUGH.md:2021`), and the last KNOWN-LIMITATIONS item is 75 (`KNOWN-LIMITATIONS.md:557`).

**0.3 Re-sweep before each PR's code.** It is read-only and is recorded as an amendment before any code. It:
- re-reads every 0.2 interface at that PR's base;
- runs every e2e suite at the base;
- lists, by file and line, every e2e read that §2.3 changes (the declared selector list);
- names the Part letter and the KNOWN-LIMITATIONS numbers, distinct from every piece in flight.

A moved cite is class 3. A changed interface is I4.

**0.4 Hypotheses**, each with its discriminator:

| ID | Hypothesis | Discriminator |
|---|---|---|
| H1 | Under §2.3's DOM rule, every existing e2e suite stays green, apart from the re-sweep's declared list. | the suites at PR A's head |
| H2 | A scratch copy of `over-ceiling-refused.parquet` ends its session after a write and a pan, as `source-changed.mjs` does with the 100k copy (`:770`). | C-E1, step 4 |
| H3 | A pan on that copy raises the same ceiling refusal again, under the same view and open. | C-E1, step 3 |
| H4 | A prepare started through the e2e destination hook answers `false` to `cancel`. | J-E2 |
| H5 | Every exported helper that App.test.ts calls (`handleCanvasCeilingRefusal`, `handleSessionEnded`, `admitAndResetStaleUiState`) keeps its signature. | App.test.ts green, unedited |

## §1. May and may not claim

**May claim, each only as §4 tests it:**
- one typed condition store (seam 8);
- the strip shows the most urgent condition and a count of the others;
- Problems keeps every unresolved condition of the open on the map;
- a newer raise never ends an older refusal or blocker;
- a view's condition is absent from another view of the same source, at store level only, because the product has one view;
- no two conditions are merged by their text;
- no remedy is added;
- Jobs lists the scan and the export runs, each with the cancel that exists today.

**May not claim:**
- spatial linting, or anything of docs/03's Problems panel, including quick fixes. docs/07:39 keeps that in Alpha;
- any progress figure or duration (ADR-018's vocabulary; the ADR-029 ruling is the human's);
- that a cancel from Jobs stopped anything beyond what the existing cancel establishes;
- that conditions outlive the open (no history; B2 owns history);
- performance;
- macOS or Linux above L1.

**Other commitments:**
- No edit under `protocol/`, `kernel/`, `engine/`, `src-tauri/`, `residency/`, `streaming/` or `skp/`.
- No dependency or lockfile change.
- ADRs are cited and none is amended: 006, 010, 018, 021 and 024.
- Operator text: owners' texts are moved whole. The new lines state only the shell's facts.

## §2. The change

**Two PRs, A then B (OPEN-7).**

### 2.1 Unchanged
- Every owner's text, and `RefusalBlock`.
- FilterPanel's Cancel, PublishPanel's Cancel and PublishDialog's Cancel.
- The status bar's items.
- The layout reducer's actions.
- The map's key.
- The exported helpers of H5.
- `ExportRunReport`, under OPEN-4 (a).
- The table and its Cancel.
- The admission panel's refusals. They stay in Layers (plan §2 rule 3; OPEN-6).

### 2.2 PR A: the condition store (seam 8), in new `frontends/shell/src/conditions/conditions.ts`

```ts
export type ConditionRoute =                   // where it is raised, at a 0.2 site
  | "session-ended" | "canvas-ceiling" | "stream-terminal" | "viewport-refusal"
  | "record-notice" | "save-notice" | "reopen-notice";
export type ConditionOwner = "session" | "canvas" | "stream" | "viewport" | "recording" | "project";
export interface ConditionReason {
  readonly route: ConditionRoute;
  /** A typed code the fact already carries; never parsed from display text. */
  readonly code: string;
  /** Position in the owner's batch, for text-only notices (save, reopen); else null. */
  readonly ordinal: number | null;
}
export type ConditionTarget =
  | { readonly kind: "resource" }                          // the open as a whole
  | { readonly kind: "view"; readonly view: ViewId };       // one view of it
export type ConditionDisplay =                              // the owner's content, as App renders it today
  | { readonly kind: "refusal"; readonly refusal: FormattedRefusal }
  | { readonly kind: "text"; readonly text: string };
export type Urgency = 1 | 2 | 3;                            // 1 blocker, 2 refusal, 3 notice
export type EndCause = "dismissed" | "owner-cleared" | "replaced-by-owner" | "next-open";
export interface Condition {
  readonly id: `condition-${number}`;   // minted by the store, never reused in a session
  readonly reason: ConditionReason;
  readonly owner: ConditionOwner;
  readonly target: ConditionTarget;
  /** The open it was raised under: the dataset handle, which every open mints anew (App.tsx:726-729). */
  readonly generation: ResourceKey;
  readonly urgency: Urgency;
  readonly lifecycle: { readonly state: "unresolved"; readonly ends: readonly EndCause[] };
  readonly first: ConditionDisplay;
  readonly latest: ConditionDisplay;
  readonly occurrences: number;
  readonly seq: number;                 // raise order of `first`
}
```

The meaning of each field, as §9 names them:
- **reason** is a typed cause.
- **owner** is the component that raised the condition and owns its lifecycle and its consequence words.
- **target** is the resource or the view.
- **generation** is the open it was raised under.
- **lifecycle** is the declared ways it ends.

There is no `remedy` or action member. C-U1 holds this with `@ts-expect-error`.

**The routes table** is a static `as const` list, declared here and tested whole by C-U1:

| Route | Raised at (App, 0.2) | Owner | `code` | Target | Urgency | Ends |
|---|---|---|---|---|---|---|
| session-ended | `:1492-1496`, `:1194-1196` | session | `refusal.code` | resource | 1 | next-open |
| canvas-ceiling | `:667` | canvas | `canvas.vertex_ceiling` or `canvas.pick_ceiling` (OPEN-2 (a)) | view | 2 | dismissed, next-open |
| stream-terminal | `:1892` | stream | `formatTerminalRefusal(detail).code` | view | 2 | dismissed, next-open |
| viewport-refusal | `:1623` | viewport | `skpError.code` | view | 2 | dismissed, owner-cleared (`:1613`), next-open |
| record-notice | `:879` | recording | `step-record-<kind>` (`:878`) | view | 3 | replaced-by-owner, next-open |
| save-notice | `:2193` | project | `project.save_notice` with its ordinal | resource | 3 | replaced-by-owner, next-open |
| reopen-notice | `:1238` | project | `project.reopen_notice` with its ordinal | resource | 3 | next-open |

- **No route of urgency 1 or 2 declares `replaced-by-owner`.** This is §9's "never erases an older blocker".
- At `:1623`, when `isSessionEndedRefusal(e)` holds, no viewport condition is raised: the session route raises the same fact. This is the suppression App applies today, at `:2518`.

**The reducer** is `conditionsReducer(state, event)`. It is pure, and it holds `{ byId, nextId, nextSeq, notKept }`. Its events:
- `raise`: the identity key is `(owner, reason.route, reason.code, reason.ordinal, target, generation)`.
  - If an unresolved condition has the same key, its `occurrences` goes up by one and `latest` is replaced. `first` is kept.
  - Otherwise a new condition is minted.
  - Display text is never read or compared in `conditions/`.
  - A route declaring `replaced-by-owner` ends that route's conditions for the same target and generation before it mints.
  - A raise past `CONDITIONS_MAX` adds one to `notKept`. The oldest are kept.
- `dismiss(id)`: ends that condition only.
- `ownerClear(route, target, generation)`: only for routes that declare it.
- `opened(resource)`: ends every condition whose generation is not `resource`. It is dispatched where `admitAndResetStaleUiState` runs on a successful admission, never on a refused one.

**The selectors:**
- `visibleFor(state, {view, resource})` returns the conditions where `generation === resource`, and either `target.kind === "resource"` or `target.view === view`.
- `ordered(list)` orders by urgency, then by `seq` (oldest first; OPEN-3).
- `attentionOf(list)` returns `{top, others: n − 1}`, or `null`.
- App's caller is the drawn view (`App.tsx:851-853`).

**App (PR A):**
- The `canvasRefusal`, `viewportRefusal`, `recordNotice`, `saveNotices` and `reopenNotices` states are replaced by the store, through `useReducer`.
- Each 0.2 set site raises. Each 0.2 clear site dispatches its declared end.
- `sessionEnded` stays a state, because the hover latch, the table and the watcher read it. Its two set sites also raise.
- The exported helpers keep their signatures (H5). App passes adapters.
- Each raise sits after the site's existing generation guard (`App.tsx:1604`, `:1620`, `:1888`, `:2404`), so a late call is still logged and dropped as today.

**The canvas callback (OPEN-2 (a)):**
- `WorkingCanvasProps.onCanvasRefusal` gains `kind: "vertex-ceiling" | "pick-ceiling"`, from the class caught at `WorkingCanvas.tsx:1538`.
- Its one product caller is App.

### 2.3 PR A: the strip and the Problems tab
- `ATTENTION_ITEMS` becomes `[{ id: "top" }]` (`contributions.ts`).
- StudioLayout gains the prop `attentionOthers: number`, whose caller is App. When it is above 0, the strip renders a button (S-3) that opens Activity and selects `problems`, through `apply` as at `StudioLayout.tsx:256-259`. The layout rows record it.
- `ACTIVITY_TABS` gains `{ id: "problems" }` (S-1).
- **The DOM rule (OPEN-1 (D)):**
  - Each unresolved condition's owner element, with its outer owner class (`.canvas-session-ended`, `.canvas-refusal`, `.record-notice`, `.save-notice`, `.reopen-notice`), is in the DOM exactly once.
  - The top condition's element is in the strip, with `role="alert"`. Every other condition's element is a row of Problems.
  - Problems lists the top first, as a row with class `problem-row-top`. That row carries no outer owner class and no alert role.
  - One renderer does this: new `conditions/ConditionView.tsx`. It moves App's markup from `App.tsx:2469-2532` whole.
  - When `occurrences > 1` it adds one line (S-5) and the `latest` display after the `first`.
  - Dismiss shows only on the routes that declare `dismissed`, and dispatches `dismiss(id)`. The existing `canvas.dismiss*` rows are recorded as today.
- `conditions/ProblemsTab.tsx` (new) renders the empty text (S-4), the rows in `ordered` order, and the not-kept line (S-6).
- `surfaceRegistry.ts`: the statement of `layout.selectActivityTab` names the new tab (S-12).

### 2.4 PR B: Jobs, in new `frontends/shell/src/jobs/jobs.ts` and `JobsTab.tsx`
- `jobsFrom(scanState, exportJobs)` is pure:
  - one `{kind: "scan"}` job while `isScanInFlight(scanState)`, with its Cancel. This is FilterPanel's predicate exactly;
  - one `{kind: "export", id}` job per standing run, in report order.
- Nothing else is a job (OPEN-5). A table load cannot be running while Jobs is shown (`StudioLayout.tsx:171-172`).
- **The scan:** App's inline handler (`App.tsx:2261-2330`) is moved whole into a named `handleCancelScan`. FilterPanel's `onCancel` and the Jobs row both call it, so it is one function.
- **The export (OPEN-4 (a)):**
  - App mirrors `exportRunsRef` into an `exportJobs` state, set at `:1270` and at `:1279`.
  - The row's Cancel calls `run.cancel()` once and shows "Cancelling" until `ended` resolves.
  - If `cancel()` resolves `false` or rejects, the latch clears and S-11 shows, the same un-latch as MF1.
  - The ask's call (`:1299-1305`) is unchanged.
- **Labels:** the scan row is S-8 with `scanLivenessText` when it is non-null. The export row is S-9. Rows show no figure.
- `ACTIVITY_TABS` gains `{ id: "jobs" }` (S-2), and `surfaceRegistry.ts` gets S-12's second form.
- The Cancel button's word is the existing "Cancel" and "Cancelling" (`PublishPanel.tsx:727`).

### 2.5 Seams this piece crosses (the seam rule)
1. Seam 8: App's raise sites to ConditionView, ProblemsTab and the strip. It is proven from the real App by C-A1 to C-A4, and in the real app by C-E1.
2. `onCanvasRefusal` with its kind (OPEN-2 (a)): C-A2 drives the captured real `WorkingCanvasProps`, and C-E1 runs it in the real app.
3. StudioLayout's `attention.top` slot and `attentionOthers`: C-R3, then C-E1.
4. FilterPanel's `onCancel` and the Jobs Cancel as one function: J-A1, then J-E1.
5. `ExportRunReport` as consumed by Jobs (unchanged interface): J-A2, then J-E2.

There is no `pub` item, prop or callback without a product caller.

### 2.6 Files

The count is §7's. **Records are outside the count:** `frontends/shell/e2e/README.md`, `frontends/shell/MANUAL-WALKTHROUGH.md`, `KNOWN-LIMITATIONS.md`, this form and PLAN.yaml.

**PR A:**
- Product:
  - `frontends/shell/src/conditions/conditions.ts`, `conditionsConstants.ts`, `ConditionView.tsx` and `ProblemsTab.tsx`, all new;
  - `frontends/shell/src/App.tsx`;
  - `frontends/shell/src/layout/contributions.ts` and `StudioLayout.tsx`;
  - `frontends/shell/src/canvas/WorkingCanvas.tsx`, under OPEN-2 (a) only;
  - `frontends/shell/src/console/surfaceRegistry.ts`;
  - `frontends/shell/src/styles.css`;
  - `frontends/shell/package.json`, one script line.
- Tests:
  - `frontends/shell/src/conditions/conditions.test.ts`, `ConditionView.test.tsx` and `ProblemsTab.test.tsx`, all new;
  - `frontends/shell/src/App.conditions.test.tsx`, new;
  - `frontends/shell/src/layout/StudioLayout.test.tsx`;
  - `App.streamFailure.test.tsx` and `App.layout.test.tsx`, only where the re-sweep finds a strip read.
- E2E:
  - `frontends/shell/e2e/conditions.mjs`, new;
  - the existing suites on the re-sweep's declared list only, from: `project.mjs`, `residency-harness.mjs`, `source-changed.mjs`, `source-watch-idle.mjs`, `refusal-contract-baseline.mjs`, `regression.mjs`, `reopen.mjs`, `selection.mjs`, `layout.mjs`, `console.mjs` and `admission-remediation.mjs`.

**PR B:**
- Product:
  - `frontends/shell/src/jobs/jobs.ts` and `JobsTab.tsx`, both new;
  - `frontends/shell/src/App.tsx`, `layout/contributions.ts`, `console/surfaceRegistry.ts` and `styles.css`;
  - `frontends/shell/package.json`.
- Tests:
  - `frontends/shell/src/jobs/jobs.test.ts` and `JobsTab.test.tsx`, both new;
  - `frontends/shell/src/App.jobs.test.tsx`, new.
- E2E: `frontends/shell/e2e/jobs.mjs`, new.

**Shared with held pieces (rule 00), by path:**
- `frontends/shell/src/console/surfaceRegistry.ts`: PR 359.
- `frontends/shell/package.json`: PR 353. The lockfile is not touched.
- `frontends/shell/e2e/README.md`: PR 359 and the re-link.
- `frontends/shell/e2e/reopen.mjs` and `frontends/shell/e2e/console.mjs`, if they are on the re-sweep's list: PR 359 (both) and the re-link (`reopen.mjs`).
- `KNOWN-LIMITATIONS.md`: PR 358 and the re-link, as separate items.
- `frontends/shell/MANUAL-WALKTHROUGH.md`: the re-link, as a separate Part.

So, by ADV-2026-11-23-15 item 4, PR A is built on the re-link's branch, which carries the heads of PR 353, PR 358 and PR 359. PR B is built on PR A.

The milestone reads `src/console/` and edits only `surfaceRegistry.ts`. ConsolePanel, the recorder and the view model are not edited.

**Disjoint from:** PR 350, PR 356, PR 360 (it reads `Admitted`, and I4 covers a change), PR 361 and PR 362.

A file outside these lists is I1. A file added is class 9, declared before its code.

### 2.7 Strings, every one a P6 draft for the advisor, with where it goes

| ID | Draft | Where |
|---|---|---|
| S-1 | `[P6 placeholder] Problems` | `ACTIVITY_TABS` label |
| S-2 | `[P6 placeholder] Jobs` | `ACTIVITY_TABS` label |
| S-3 | `[P6 placeholder] {n} more in Problems` | the strip's button (StudioLayout) |
| S-4 | `[P6 placeholder] No problems for the dataset on the map.` | ProblemsTab, empty |
| S-5 | `[P6 placeholder] Raised again {n} times. The latest:` | ConditionView, when `occurrences > 1` |
| S-6 | `[P6 placeholder] {n} more problems were raised and not kept; the list keeps at most 64.` | ProblemsTab |
| S-7 | `[P6 placeholder] Nothing is running.` | JobsTab, empty |
| S-8 | `[P6 placeholder] Loading the map's features` | JobsTab, scan row |
| S-9 | `[P6 placeholder] Export interactive map` | JobsTab, export row |
| S-10 | `[P6 placeholder] Shown above in the attention strip.` | the Problems top row's note |
| S-11 | `[P6 placeholder] Nothing was cancelled.` | JobsTab, after `cancel()` is false or rejects |
| S-12 | the `layout.selectActivityTab` statement, with the tab list widened to the new tabs | `surfaceRegistry.ts:321` |

### 2.8 Portability (R3)

No path, chord or adapter is new. Windows is supported. macOS and Linux are L1, by unit tests.

## §3. Fixtures, with outcomes declared in advance

Each fixture is hash-verified before and after each run. Copies go to the run's own TMP folder, never to `C:`'s scratch.

| Fixture | Used by | Predicted |
|---|---|---|
| `over-ceiling-refused.parquet` (copy) | C-E1 | A canvas refusal first. A pan re-raises it (H3). A write and a pan end the session (H2). Problems has 2 rows. |
| `slow-filter-scan.parquet` | J-E1 | The Jobs scan row, then Cancel from Jobs, then `.scan-incomplete`. |
| `100k-happy-path.parquet` | J-E2 | The export row, then Cancel, then S-11 (H4). The row leaves at the prepare's end. |

## §4. Tests, and one mutation each

**How a mutation is observed:** apply it, run its named set, record the failure by name with the commit, and revert (round 25, item 2 (c)). No `verify-mutation` run is an observation.

**What may be mocked:** the App tests mock only what `App.streamFailure.test.tsx:4-11` mocks. Mocking `conditionsReducer`, `ConditionView` or `jobsFrom` is I5.

| ID | PR | Asserts (red before: the module or the behaviour is absent) | Mutation; named set that fails |
|---|---|---|---|
| C-U1 | A | the routes table is whole, as §2.2; no urgency 1–2 route declares `replaced-by-owner`; `Condition` has no remedy member | add `replaced-by-owner` to stream-terminal; {C-U1, C-U3} |
| C-U2 | A | **the most urgent, with the count of the others:** urgency first, then oldest; `others = n − 1`; empty gives `null` | newest first within an urgency; {C-U2} |
| C-U3 | A | **a newer raise never ends an older blocker:** refusal A, refusal B, a notice, then session ended; all four stand, and the top goes from A to session ended | a raise ends earlier conditions of its target; {C-U3, C-A1} |
| C-U4 | A | **a view's condition is absent from another view of the same source:** `view-1`'s is absent from `visibleFor({view-2, R})`; the resource's is present in both; another generation's is absent | match on generation alone; {C-U4} |
| C-U5 | A | **no merge by text:** equal text with different keys gives two conditions; the same key with different text gives one condition, `occurrences` 2, `first` kept | key on the display text; {C-U5, C-A2} |
| C-U6 | A | lifecycles: dismiss ends one; `opened(R′)` ends all not in R′; owner-clear only on viewport-refusal; replacement only on notice routes | `opened` ends nothing; {C-U6, C-A3} |
| C-U7 | A | `CONDITIONS_MAX + 1` raises: the oldest 64 are kept and `notKept` is 1 | drop the oldest; {C-U7} |
| C-R1 | A | **no remedy invented:** per route, ConditionView renders App's moved markup exactly; its buttons are exactly the owner's Dismiss; S-5 is the only added text | add a Reopen button to session ended; {C-R1} |
| C-R2 | A | Problems: every visible condition once, in order; the top row has no owner class; Dismiss dispatches `dismiss(id)`; S-4 and S-6 | list only the top; {C-R2} |
| C-R3 | A | strip: one slot; S-3 shows when `attentionOthers > 0`; the button opens Activity on Problems | select Console; {C-R3, C-E1} |
| C-A1 | A | the real App: two terminal failures with different codes, then a session end; the strip's top is session ended, S-3 reads 2, and Problems has 3 entries | App clears before it raises at `:1892`; {C-A1} |
| C-A2 | A | the real App: two ceiling refusals with identical text, one vertex and one pick, through the captured `onCanvasRefusal`, give two conditions | App passes a constant `kind`; {C-A2} |
| C-A3 | A | the real App: Dismiss; a resolved viewport outcome clears its condition; a refused reopen keeps session ended; a successful open clears everything | clear on a refused admission; {C-A3} |
| C-A4 | A | the real App: a session-ended pre-check refusal gives one condition, not two | raise the viewport condition too; {C-A4} |
| C-E1 | A | the real app, §3: open the copy; the refusal is the top with no S-3; pan, and Problems shows 1 row with S-5; write and pan, and the top is session ended with S-3 at 1 and both rows standing; S-3 opens Problems; Dismiss the refusal; reopen, and both are empty | the session-ended raise ends the other conditions; {C-E1} |
| J-U1 | B | `jobsFrom`: the in-flight states give the scan job with Cancel; idle, complete, cancelled and failed give none; one job per run, in order | list `complete`; {J-U1} |
| J-U2 | B | the export latch: Cancelling until `ended`; `false` or a rejection clears it and shows S-11 | no un-latch on `false`; {J-U2, J-E2} |
| J-R1 | B | JobsTab: S-7; rows; Cancel calls once and is disabled while Cancelling; no digit outside the owner's liveness text | Cancel stays enabled; {J-R1} |
| J-A1 | B | the real App: the Jobs Cancel calls `handleCancelScan`; the manager's `cancelStream(handle)` runs once; the state is `cancelled`; FilterPanel's Cancel and the row are gone | Jobs dispatches `cancelledByUser` without `cancelStream`; {J-A1, J-E1} |
| J-A2 | B | the real App: a report adds a row; `ended` removes it and releases the consumer; the row's Cancel calls `report.cancel` | keep the row at `ended`; {J-A2} |
| J-E1 | B | the real app, §3: the Jobs scan row; Cancel; `.scan-incomplete`; a `cancel` row in Console; no stream left | Jobs Cancel not wired; {J-E1} |
| J-E2 | B | the real app: export through the destination hook; the row; Cancel gives S-11; the row leaves | the row is not removed; {J-E2} |

**Text checks at each head**, by script, each pattern self-tested positive:
- no `%`, `ETA` or `remaining` in `src/jobs/`;
- no `.text ===` and no `.text !==` in `src/conditions/`.

## §5. Predictions, declared unchanged, invalidators, falsification

**Predicted:** H1 to H5, and §3. A wrong prediction is class 2.

**Declared unchanged:**
- §2.1;
- every existing e2e outcome outside the declared list;
- every owner's text;
- the lockfiles.

**Invalidators.** Each one means stop and report.
- I1: an edit outside §2.6.
- I2: a dependency, lockfile or port change.
- I3: an existing suite fails outside the declared list.
- I4: a 0.2 interface differs at the base.
- I5: a forbidden mock.
- I6: a route's code can be had only by parsing display text.
- I7: code of an OPEN item before its ruling.
- I8: the base changes App's attention slots, or the routing of the reopen notices.

**Falsification.** The form is wrong if either holds:
- a fact the strip shows today cannot be raised with a typed reason without parsing its text;
- showing only the top hides a blocker that has no other place an operator can reach.

## §6. Instruments

- **Assertions:** the U, R, A and E rows.
- **Measurements:** none.
- **The human's:** the felt rows.

## §7. Declared values and ceilings

| Constant | Value | Bounds |
|---|---|---|
| `CONDITIONS_MAX` | 64 | the unresolved conditions kept per open (`conditionsConstants.ts`) |

**Count:** `git diff --numstat <base>...HEAD -- frontends/shell ':(exclude)frontends/shell/MANUAL-WALKTHROUGH.md' ':(exclude)frontends/shell/e2e/README.md'`.

| Group | Files (ceiling each) | At most |
|---|---|---|
| A-P | conditions 280, constants 20, ConditionView 160, ProblemsTab 130, App 240, contributions 15, StudioLayout 60, WorkingCanvas 12, surfaceRegistry 6, styles.css 70, package.json 1 | 994 |
| A-T | conditions 450, ConditionView 200, ProblemsTab 200, StudioLayout 90, App.conditions 480, App.streamFailure and App.layout 60 | 1,480 |
| A-E | conditions.mjs 480, the declared selector edits 80, margin 60 | 620 |
| **PR A** | | **3,094** |
| B-P | jobs 120, JobsTab 170, App 150, contributions 5, surfaceRegistry 6, styles.css 40, package.json 1 | 492 |
| B-T | jobs 260, JobsTab 230, App.jobs 400 | 890 |
| B-E | jobs.mjs 420, margin 60 | 480 |
| **PR B** | | **1,862** |

- An overrun is class 8, and this section is never edited.
- Records are outside the count: the walkthrough 120 lines, e2e/README 40 and KNOWN-LIMITATIONS 50.

## §8. Block-on-sight

1. A file outside §2.6, or any edit under `protocol/`, `kernel/`, `engine/`, `src-tauri/`, `residency/`, `streaming/` or `skp/`.
2. A dependency or lockfile change.
3. Display text read, compared or parsed in `conditions/`, or a code derived from prose.
4. A raise that ends an urgency 1–2 condition, other than `dismiss`, an owner-clear declared in §2.2, or `opened`.
5. An owner element twice in the DOM, or a condition with no place an operator can reach.
6. A remedy, button or guidance added beyond the owner's.
7. A Jobs Cancel that calls anything other than `handleCancelScan` or `run.cancel()`; FilterPanel's Cancel removed (ADR-021).
8. A progress figure, an ETA, or "cancelled" claimed by Jobs (ADR-018).
9. A `pub` item, prop, callback or option without a product caller.
10. A message stating another module's consequence, or rewording an owner's text.
11. A new string neither marked P6 nor sighted.
12. A seam test written to an imagined interface (§2.5).
13. The round 25 items by name:
    - an overrun not recorded as class 8, or §7 edited;
    - a scope addition not recorded as class 9, or its code before its amendment;
    - a `verify-mutation` run called an observation;
    - a test-text span on a branch pinned at a branch commit, or named without its commit id.
14. A quote marked verbatim that is not byte-identical; a line cite into the ledger; a bare self-line.
15. Code of an open OPEN item.

## §9. Gates

- **Per PR:** architect and reviewer, full gating. Verdicts are proportional (`state/directives/2026-10-05-product-first-direction.md`, section 2). Wording blocks follow `state/directives/2026-10-11-direction-after-status-review.md`, item 2.
- **The architect checks:**
  - §8, item by item;
  - plan §2 rules 1, 3, 4, 5, 7, 10 and 11;
  - §9 against C-U2 to C-U5 and C-R1;
  - ADR-006: all of it is view state, and the export cancel stays class 3;
  - ADR-010 rule 1;
  - ADR-018 and ADR-021;
  - the seams of §2.5;
  - discharge claims and verbatim quotes.
- **The reviewer checks:**
  - the diff `origin/main...HEAD`;
  - every mutation, applied again;
  - §7 by its command;
  - an empty lock diff;
  - §4's text checks.
- **Suites, green first:**
  - `npm run verify` in `frontends/shell`;
  - every e2e suite at the base plus the new one, by the suites' own launch;
  - the governance `node --test` suites;
  - verify-cites, verify-quotes and verify-test-claims, each named with its commit.
- **Heavy runs:** THE MACHINE paragraph, `state/directives/2026-10-06-machine-script-adopted.md:12-22`, as written in every heavy-run brief.
- **Operator:** one new Part at the letter the re-sweep names, with a blank log. It joins `operator-sitting-queue` at each PR's merge.
  - 0. Read §10, last amendment first.
  - 1 (A). Open the over-ceiling copy. The strip shows one refusal. Felt: do you know where the others would go?
  - 2 (A). Pan, then change the file and pan. The strip shows session ended and "1 more". Open Problems. Felt: is the count noticed, and does the strip feel calmer?
  - 3 (A). Dismiss the refusal in Problems. Reopen the file, and both are gone.
  - 4 (B). Slow fixture: filter, open Jobs, and cancel there. Felt: did you look in Jobs or in Filter?
  - 5 (B). Export, open Jobs during Preparing, and cancel there.
  - 6. P6 sight of S-1 to S-12.
- **Merge:** after the tag, and after PR 353, PR 358, PR 359 and the re-link. PR B merges after PR A.

## §9a. OPEN items (to the advisor in one message, ADV-2026-11-23-15 item 8; the gate does not wait)

**OPEN-1. Where the owner elements live.**
- (A) Each owner element once in the strip, and Problems uses rows of a new class. `project.mjs:383-386` and `reopen.mjs:366` lose reads of non-top notices.
- (B) Owner elements only in Problems, with a summary in the strip. The Playwright click at `residency-harness.mjs:719` waits on a hidden element.
- (D) The top in the strip and the rest in Problems, each once, as in §2.3.
- **Recommend (D).** Every element stays unique. The visible top keeps its alert role, and the declared selector list stays smallest.

**OPEN-2. Identity.**
- (a) Identity is the §2.2 key. A re-raise is an occurrence. The canvas callback passes its ceiling's kind, so the two ceilings stay distinct.
- (b) Every raise is a new condition, under the cap. Panning an over-ceiling file fills Problems.
- **Recommend (a).** §9 forbids a merge by text; a merge by typed identity is not one.

**OPEN-3. The order within one urgency.**
- (a) Oldest first: a newer refusal never displaces an older one from the strip.
- (b) Newest first.
- **Recommend (a),** from §9's second bullet. The urgency classes in §2.2 are the advisor's to confirm.

**OPEN-4. The export's Cancel in Jobs.**
- (a) `run.cancel()`, with the MF1 un-latch and S-11. The panel's latch stays separate (KL-C).
- (b) `ExportRunReport` gains the panel's latch and visibility. That edits PublishPanel and PublishDialog.
- (c) No Cancel, only a reveal of Export.
- **Recommend (a).** It is the cancel App already holds. (c) misses §9.

**OPEN-5. What a job is.**
- (a) The scan and the export runs.
- (b) Also open, save and reopen. The open's Cancel is inside AdmissionPanel, which the re-link edits.
- **Recommend (a),** with (b) as a later node.

**OPEN-6. What a condition is.**
- (a) What the strip shows today.
- (b) Also the status bar's ceiling, scan-incomplete, attributes-not-held and selection-ended items, and the admission refusals.
- **Recommend (a).** Components move whole (plan §2 rule 1), and rule 3 keeps open attempts out.

**OPEN-7. The split.**
- (a) PR A, then PR B, as in §2.
- (b) One piece.
- **Recommend (a).**

**OPEN-8. When the strings are sighted.**
- **Recommend:** at the sitting, as placeholders until then (milestone 4's OPEN-14 pattern).

**KNOWN-LIMITATIONS drafts** (P6; the numbers are the re-sweep's):
- KL-A: Problems lists only what the attention strip reported before. A refused open stays in Layers, and the status bar's items are not listed.
- KL-B: Jobs lists the map's loading and an export run. Opening a dataset and saving or opening a project are not listed.
- KL-C: under OPEN-4 (a), the Export section's Cancel and the Jobs Cancel are separate buttons, and the one not pressed keeps its label.
- KL-D: Problems is emptied when another dataset is opened. Nothing is kept.

The re-sweep also reads whether the row-filter paragraph at `KNOWN-LIMITATIONS.md:185-189` (Cancel can stay up in the filter panel) now also holds for the Jobs row. If it does, a note is added there.

## §10. Amendments

The section opens empty and is append-only.
- **Amendment 1,** by the custodian at the commit: the span hashes by script, the rulings by reference, and the OPEN answers as they come.
- **One re-sweep amendment** (0.3) before each PR's code.
---END OF FORM---

**Note (what the code did not settle; what may need the human)**

1. **No hashes.** I have no shell. Every pin is `path:line @ 0bcf5434`, and Amendment 1 must add each span's sha256 by script before the form's gate. Until then the reviewer recomputes them. The human's item 3 (c) and ADV-2026-11-23-15 are cited by item because they are not on main yet.

2. **Seam 8's source is a draft.** The notebook's seam table (`state/drafts/design/SPATIAL-IDE-DESIGN-NOTEBOOK.md:602`, `:613`) calls itself "discussion constraints". The binding text is plan §9, which the human ruled. The form's field meanings (owner, generation) are my reading. Generation is the dataset handle, not `Admitted.session`, because `admitDataset.ts:15-18` limits `session` to routing the ended event. A gate may ask whether a separate `generation` field is redundant with the per-open key. It is kept because §9 names it, and B2 stage 3's rebinding (plan :356) will separate the two.

3. **E2E risk (H1) is the largest.** About eleven suites read the strip's classes. OPEN-1 (D) keeps each owner element unique, but a suite that waits for visibility on a non-top item will fail. The exact list can only come from the re-sweep's runs. If it touches `reopen.mjs` or `console.mjs`, those are shared with PR 359 and the re-link. I named them conditionally.

4. **The picker's modality is unknown.** `commands.rs:413-418` opens the save dialog with no parent. Whether the Jobs tab is clickable during the picker could not be settled from the code. OPEN-4 (a)'s S-11 is honest either way.

5. **The base.** By ADV-2026-11-23-15 item 4, PR A builds on the re-link's branch (heads of PR 353, PR 358 and PR 359). The form edits `package.json`, one script line, shared with PR 353's dependency change. It must never touch `package-lock.json`. No new dependency, no lockfile change and no workflow change is proposed, so nothing here is the human's by those red lines.

6. **The urgency classes are a product choice.** OPEN-3 and §2.2's table rank session ended over refusals over notices, and treat the record, save and reopen notices as replaceable by their owner, as today. If the advisor reads a not-recorded step as a blocker, C-U1's rule changes, and so do the record route's ends.

7. **Not read in this run:** ADR-018's and ADR-029's texts, `surfaceCompleteness.test.ts` and `layout.mjs`'s tab enumeration. Whether `surfaceCompleteness` demands a class-C row for the Jobs Cancel is unknown. The scan cancel sends `cancel` (class A) and the export cancel sends `binding_publish_cancel` (class B), so I added no row. The re-sweep confirms.
