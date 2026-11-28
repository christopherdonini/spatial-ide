# Shell migration, milestone 5: conditions, Problems and Jobs. One home for failures and running work (PLAN node `shell-migration-milestone-5`)

*Committed by the custodian on 2026-11-23 from the architect's draft (`state/consults/2026-11-23-shell-migration-milestone-5-architect-draft.md`; the hand-back 42101 bytes, sha256 db482c10f384a236c0f692e3664c6ec90e68b24c63e501b5f696b7629a70cc56): its text from the title to the line before its end mark, byte for byte, with this note put after the title. The note after the end mark stays in the consult. Read the last amendment first.*

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

## Amendment 1 — 2026-11-23 — at the first commit: the authority on main, the node's gate, the span hashes, the OPEN items

*Written by the custodian at the form's first commit, before any code and before any gate. References and hashes only.*

1. **Authority on main.** The human's message of 2026-11-23 is filed at `state/directives/2026-11-23-the-humans-message-never-idle-product-first-what-to-build-now-the-pauses-lifted-for-product-pieces-what-does-not-change.md`, and the advisor's ruling ADV-2026-11-23-15 at `state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-15-the-humans-message-filed-the-relink-built-now-on-three-held-heads-two-forms-now-the-gap-pieces-the-sitting-hour.md`, both in commit 181e8894670c6bac49e3df78e659d63005c2b736. The draft is filed at `state/consults/2026-11-23-shell-migration-milestone-5-architect-draft.md`.
2. **The node's gate.** In the same commit the PLAN node `shell-migration-milestone-5` names this form as its gate. The split of §2 (PR A, then PR B; OPEN-7) is the draft's; both PRs are gated under this one form.
3. **Span hashes.** Every `path:line` cite above is read at 0bcf543452af79df6251cc7d86ab9f2cf644fcc2. Each entry below names the file and lines a cite is read as, the sha256 of those lines at that commit (each line with its LF, computed by script), and the sections that cite it. A short name is read as the one tracked file it names; a bare `:n` as the file named before it in the same passage; an entry marked (r) was read by the custodian against the file its sentence names.

- `governance/PLAN.yaml:5433-5449` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:fabb431fb36876ac24ae0c352a8148dd150ccead191ddc0d2282caa248fdfbbe — the header
- `state/directives/SHELL-MIGRATION-PLAN-2026-10-07.md:243-251` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:4a6a2611e29f04fd8880fe3390363b771347b7afc84fd353d72f7cc275932c14 — the header
- `state/directives/SHELL-MIGRATION-PLAN-2026-10-07.md:20-36` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:25665720a61efd64fc8d0f4f83a8ed9ff0fd84801790f06daefc1ec8d488f0fe — the header; as written `:20-36`
- `state/directives/SHELL-MIGRATION-PLAN-2026-10-07.md:64` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:da0a484dd2a7699463a7a8831b413dc00eb87091099d55717959da5ddd783c55 — the header; as written `:64`
- `state/directives/SHELL-MIGRATION-PLAN-2026-10-07.md:68` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:d073a002dfa51058e5ad6b7a2685232a5f7187be99876e19f3dfb0d826c61177 — the header; as written `:68`
- `state/drafts/design/SPATIAL-IDE-DESIGN-NOTEBOOK.md:613` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:0531cb2de4bc57d467b08f5b05573fab75ae28c45668fe3c3eace7ae1024e7b5 — the header
- `state/directives/SHELL-MIGRATION-PLAN-2026-10-07.md:3` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:4917f6474a95e5817e3e25c9161bf1dff7aec726070c7e8ff1ba09424d06ec36 — the header; as written `:3` (r)
- `state/drafts/design/SPATIAL-IDE-DESIGN-NOTEBOOK.md:602` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:a52d3d59550671e01ab9cd3394dfec861b4fb8ba6c5751e1168810608cf45c40 — the header; as written `:602`
- `state/drafts/design/SPATIAL-IDE-DESIGN-NOTEBOOK.md:796` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:4985bb7b904e1a027b718e277bb6a3e747ea0455ff4ab25867c625b16c41d569 — the header; as written `:796`
- `docs/03_UX.md:19-21` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:3c68b59ef6d3d6ee1a2b138d3708dd9e4d231ad4b085b4d1c03196e65622cc52 — the header
- `docs/07_Roadmap.md:39` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:5ea3375b36b6bc0f565883f1bf78af44db24acfbfde6f93ac44f79f0127b64cd — the header
- `docs/01_Principles.md:13` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:8c6bcdb7ff11f95750cac89842afa4c90b6dff5a3ed5e3aaaab8994b458bcf44 — the header
- `docs/01_Principles.md:20` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:6e49121b8e9dfcb3be371c4a50007e385092470d4601943c98cca95133f92637 — the header; as written `:20`
- `docs/adr/ADR-021-row-filter-on-viewport-query.md:11-16` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:6770c1c54c14c3264414de2178ad82d54f51f2be46e3d0abe6483561215c2cb5 — the header
- `frontends/shell/src/layout/contributions.ts:46-47` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:a8f29ec83a085ec86ed379727a876984d3f39fd89381136dce2fc97de16c96a4 — §0
- `frontends/shell/src/layout/StudioLayout.tsx:306` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:0acde372dcd4010fe4a016cbd9fc233ae0d156a1d1779d289abe7dc4629446a5 — §0
- `frontends/shell/src/layout/StudioLayout.tsx:379-383` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:e39f33fdc0a454d515504665d2bf5c52fcc826638bffd65643cece3d2c9d0851 — §0; as written `:379-383`
- `frontends/shell/src/App.tsx:2469-2532` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:8d3fa049dd04db60289f2344e5289123e932b1fcdbe72fb9f557b7427e9f008d — §0, §2.3; as written `App.tsx:2469-2532`
- `frontends/shell/src/App.tsx:872` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:f1a4efeac47f1642297d303829ad0da1d3636a0c43c0c33d45455c777676636b — §0; as written `App.tsx:872`
- `frontends/shell/src/App.tsx:887` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:8fd69fe3a6de9d820e5ce3b8c54dac03b373ec2c3c404073db132add427db5e8 — §0; as written `:887`
- `frontends/shell/src/App.tsx:889` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:ee6fa54fe7db51c44a95546dcc1455f8a6d121fe458fe74cceccc3afb0e1fdfe — §0; as written `:889`
- `frontends/shell/src/App.tsx:921-923` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:01e45844aff554df6bcb4fb81f87efa36faec489b77571545d676c66ae484ff5 — §0; as written `:921-923`
- `frontends/shell/src/App.tsx:944-945` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:41e2a8311d28f73ed35d32aa1bbc87ebfd4b62cd40dd6abd61ac564c0f950d03 — §0; as written `:944-945`
- `frontends/shell/src/App.tsx:958` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:05cc39ba9ad9b4eb95f5a7b7d9b1ae11f9a451ba39d5b26a76de4bfc4c0a489f — §0; as written `:958`
- `frontends/shell/src/App.tsx:667` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:a9372581663dc68f2b1f3b5df999bfc5b38fc0d1a063f4c26cf77ff2580dc303 — §0, §2.2; as written `App.tsx:667`, `:667`
- `frontends/shell/src/App.tsx:1892` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:adcb36706d2448fa73d6f341dc056226ed64aa067683c44511f254ddaae3327b — §0, §2.2, §4; as written `:1892` (r)
- `frontends/shell/src/App.tsx:1613` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:61f5775619d16c9d6aa6c7af372a6dfcf03aee8d50f726d396015e6d76cfc16b — §0, §2.2; as written `:1613`
- `frontends/shell/src/App.tsx:1623` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:e49b748a211956d4a874145b7693b9ffd395b053e7a19bbe9c0cb992b8fbecff — §0, §2.2; as written `:1623`
- `frontends/shell/src/App.tsx:1612` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:680e32e6526607337d9d66523459a47cf9a0d790529d03953b45dfd8df4d0102 — §0; as written `:1612`
- `frontends/shell/src/App.tsx:879` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:2fde41d75ddb4172f801f63af2f704902e524db3938d4e6a4cc88564e57290b2 — §0, §2.2; as written `:879`
- `frontends/shell/src/App.tsx:2193` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:04e07f0791b13cf4c4b55d63e8077a47f289f47a70dd896e1663af955327fbd8 — §0, §2.2; as written `:2193`
- `frontends/shell/src/App.tsx:1238` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:94840bbf7eb4872dd555a85171617164c3d205145df54adf4c248058820519a8 — §0, §2.2; as written `:1238`
- `frontends/shell/src/App.tsx:1194-1196` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:2aea2ec167a2a4845f7df0ab06c68a8b8871b53dcf4bba4a17662826dc6e001c — §0, §2.2; as written `:1194-1196`
- `frontends/shell/src/App.tsx:1492-1496` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:f1538721341fa3a5e7fb2cebe9f780f5182de354ea9ba272bd6b097621868f3b — §0, §2.2; as written `:1492-1496`
- `frontends/shell/src/App.tsx:251-262` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:b1786d54eacb1c9c52606ad18732fd0f946dfc5089820a27bcc5cc400c907097 — §0; as written `App.tsx:251-262`
- `frontends/shell/src/canvas/WorkingCanvas.tsx:563` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:df1390520f61c56b07f60e38cab3cfd708b93526388ef6ebfa725f8bed629990 — §0
- `frontends/shell/src/canvas/WorkingCanvas.tsx:1538-1540` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:816e827fef580c2ade3296f028597dfb261413284b9ce596ecd535edf1071b06 — §0; as written `:1538-1540`
- `frontends/shell/src/canvas/WorkingCanvas.tsx:1538` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:f16bb24e0d955b14cf7f671add908e520e57ae957f0779bf11a16213edebd06e — §0, §2.2; as written `:1538`, `WorkingCanvas.tsx:1538`
- `frontends/shell/src/App.tsx:726-729` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:d8731b61367e31d8b39f2c3b2470cec5440759cd9ee2accb1f8cae9c0f1c8473 — §0, §2.2; as written `App.tsx:726-729`
- `frontends/shell/src/App.tsx:2337-2339` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:b755ea668b01a9cb2ae7b59b0191b6cd9bac2aa4c48e0dd2dc7daf00bf71f3bb — §0; as written `:2337-2339`
- `frontends/shell/src/admission/admitDataset.ts:15-18` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:801d525453340418ccc48d1d2de0b81bb11edacb9e9ef723f69356ca41c60efd — §0
- `frontends/shell/src/workspace/workspaceState.ts:9-13` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:8a633e294ccd56a4aa4348da426ef9cb1d26ff31f2121494cacc172d5a9187b2 — §0
- `frontends/shell/src/workspace/workspaceState.ts:37-46` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:24c3b53bb19bd56195119ecd133076fdb5cb3fad6a1c6615bde0571a34854069 — §0; as written `:37-46`
- `frontends/shell/src/workspace/workspaceState.ts:92-97` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:d474c976efde7151f7906d8c9e3ed0463c3e1c93547c59c0fda7f9abe8fac3fa — §0; as written `:92-97`
- `frontends/shell/src/workspace/workspaceState.ts:16-17` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:7ae2e018d476e1c36cae2d58ed0a1e5eba27a755fe573d27364b644102c12f0c — §0; as written `:16-17`
- `frontends/shell/src/layout/contributions.ts:50-56` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:db972a32df2cf51c96750d865b2725296294c845e582d826e86e3da4bcb6df67 — §0; as written `contributions.ts:50-56`
- `frontends/shell/src/layout/statusItems.ts:37-45` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:632f81aca15a7748413ecad5b388340072de0db80adb13bcc446997e915dae98 — §0; as written `statusItems.ts:37-45`
- `frontends/shell/src/layout/contributions.ts:40-44` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:240d7f8fb3bd0e3c867065c937022d37f2c9da93d1a4247117b79b0de7f790d9 — §0; as written `contributions.ts:40-44`
- `frontends/shell/src/layout/layoutState.ts:34` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:4c2fe7ade60457000c371fefa36ad3900f020d9bbf36aef7a0d6c601fe289219 — §0
- `frontends/shell/src/layout/layoutState.ts:51` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:1a823b58e36c69146854c27e4da4dcd4eafee6f976282754b74bd6ee720346d5 — §0; as written `:51`
- `frontends/shell/src/layout/StudioLayout.tsx:41-42` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:c01b93e073bc1b4965ffee1afd14587d3e9da83f0b5baa21d03bbdcde290fd5b — §0; as written `StudioLayout.tsx:41-42`
- `frontends/shell/src/layout/StudioLayout.tsx:443-453` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:17add0c6d8c6950247da25df17e9da5d191395743b49a3c59f1a4ba5201273d8 — §0; as written `:443-453`
- `frontends/shell/src/layout/StudioLayout.tsx:256-259` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:e0ecaf4b2ab17b0ab4d7493cdd6f61a896a0d74393b3d074772d9ea92aa63c6c — §0, §2.3; as written `StudioLayout.tsx:256-259`
- `frontends/shell/src/layout/StudioLayout.tsx:171-172` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:75c61f1029b800bbfac7c46c06db8db59a3b5e3c70be8462b7f26970e2a9d7b8 — §0, §2.4; as written `StudioLayout.tsx:171-172`
- `frontends/shell/src/layout/StudioLayout.tsx:148` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:06e9c9cabef9fea548826f11c0f31de1a2fffe8e4f2a0e92ed9f74692650b69d — §0; as written `:148`
- `frontends/shell/src/App.tsx:450-457` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:d6e4156ccb5e7108cef140b024e7616e12f87295a24705f200582444c27db9eb — §0; as written `App.tsx:450-457`
- `frontends/shell/src/App.tsx:530-532` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:34c28f8d2afb547285bc29f62ac0adf3f3c7f83c19cd57b9528e09078e6f622e — §0; as written `:530-532`
- `frontends/shell/src/App.tsx:554-563` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:01bdae25da75308f66f2231f859efade98168b6473e6cf995ccae9e72af2ba29 — §0; as written `:554-563`
- `frontends/shell/src/App.tsx:549-553` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:f4d8245589bb60d9d38b58824ef2c11c291d675b4d6c40a0d25021967bccbd8f — §0; as written `:549-553`
- `frontends/shell/src/filter/FilterPanel.tsx:120-121` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:ca8ee8d0aede7518df2ad64cdec3a52167f056f992d295a60de10245eba4b26f — §0
- `frontends/shell/src/filter/FilterPanel.tsx:28` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:824ecb358eeb9f8d8676f3b59af1faaaccaa5dcd62a69e890bf2ee0fa4a1c1b4 — §0; as written `:28`
- `frontends/shell/src/App.tsx:2261-2330` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:4acc614194c620a1df82839ff545d5dd0ddb62d5cb3bb49fbae530b05593ae97 — §0, §2.4; as written `App.tsx:2261-2330`
- `frontends/shell/src/App.tsx:2306-2321` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:6f6091d51e67d9e2e69434e1f5f466482cd404520e1de12bdc7794af55e98614 — §0; as written `:2306-2321`
- `frontends/shell/src/App.tsx:2323-2329` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:ea68dfca760c8b777c285b5332d83481d957f800e1a007ca588f53fc336e09f0 — §0; as written `:2323-2329`
- `frontends/shell/src/publish/PublishPanel.tsx:33-41` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:25936073769b9b08d73920f49e392e677f9ce95130b783af4d4b316c380a9277 — §0
- `frontends/shell/src/publish/PublishPanel.tsx:35-36` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:7585704c273177e461a99c0c5bbfbd95b3c14d025fe7a85003b2cacdd617d5f9 — §0; as written `:35-36`
- `frontends/shell/src/publish/PublishPanel.tsx:402-408` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:53b9873ac01f59c6db77a0dd0633251951380be34cdfdb0ceae71a686dce94c5 — §0; as written `PublishPanel.tsx:402-408`
- `frontends/shell/src/publish/PublishPanel.tsx:517-521` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:838bbe712e11f7bcbaa72d60b2f628530b0bd6a28b0998ceaac8b592265f1046 — §0; as written `:517-521`
- `frontends/shell/src/App.tsx:1249-1282` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:eb303ec6bc760f6c153d1573adb4a26bbb18f0bfdd3bca4f7ce2c64b6627e8d9 — §0; as written `App.tsx:1249-1282`
- `frontends/shell/src/App.tsx:1299-1305` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:424157d4bc1227c3e76e7539e5e291c168a8c4b75b351c245d906f495fa23ad8 — §0, §2.4; as written `:1299-1305`
- `frontends/shell/src/publish/PublishPanel.tsx:148` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:18a318aab80a9aed934bf3e043c8a48a99dc75e9477b11a63bb91bc06306a819 — §0; as written `PublishPanel.tsx:148`
- `frontends/shell/src/publish/PublishPanel.tsx:720-727` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:58ebe76ef02397b6dbe880f6634f8549cfefaffa52a9608bd7226e748b16877f — §0; as written `:720-727`
- `frontends/shell/src/publish/PublishPanel.tsx:449-453` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:a64e22b45dcfc8b2b29a8b009e5dcda7a8bcd84884d7a7f8ee8a315b3327a23a — §0; as written `:449-453`
- `frontends/shell/src-tauri/src/commands.rs:413-418` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:3917172efbe982b0d9892a99968fb9bed0d6539dadb6ea324773bf8c602fdbc7 — §0
- `frontends/shell/src/publish/PublishDialog.tsx:228-231` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:28434e51d4374ef0ac833751f53e0801db3877c5d83d913d36347ce16447b9af — §0
- `frontends/shell/src/publish/PublishDialog.tsx:236` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:dd7762fa62f9f3a0335c47a1a406424cb853f89ca4914076b5af3c8f7a747abe — §0; as written `:236`
- `frontends/shell/src/console/surfaceRegistry.ts:318-324` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:c1436cb01c70e779dc9dd9800e8c9a2f6b6a18fde0aa6d98509e68327cda6072 — §0
- `frontends/shell/src/console/surfaceRegistry.ts:230-246` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:607a21fa68ec3ddc9e997eeb7d7661cfa48e75c67f5ae349cfedde12cb6cccab — §0; as written `:230-246`
- `frontends/shell/e2e/project.mjs:383-386` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:045169726a413e61b1af5cd80eb0bcf39926f9c44da73c275a763c2d56bbc03b — §0, §9a; as written `project.mjs:383-386`
- `frontends/shell/e2e/residency-harness.mjs:719` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:56bbfc05fdbbabd6b374300b71b53dff6f12fbc47bae38fea6fb3df77c93fd14 — §0, §9a; as written `e2e/residency-harness.mjs:719`, `residency-harness.mjs:719`
- `frontends/shell/e2e/source-changed.mjs:732-744` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:97be59c640c770ab5a98ef7fa728dca54132e324c156123b5553ddd2ee7cb79d — §0; as written `e2e/source-changed.mjs:732-744`
- `frontends/shell/e2e/source-watch-idle.mjs:249-250` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:22e53e810bc12b67180a0f1aacae48085a98da06a27606b7d8f6a3912661b264 — §0; as written `e2e/source-watch-idle.mjs:249-250`
- `frontends/shell/e2e/refusal-contract-baseline.mjs:188-191` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:3b4b6ca75b857aa3f7281b1eeeb99fbb11619bc06322c875f6c5e826039cd99e — §0; as written `e2e/refusal-contract-baseline.mjs:188-191`
- `frontends/shell/e2e/refusal-contract-baseline.mjs:261-273` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:e1e339ba685e6a78a8171785fcdb6a62cb8b31f6d4ea712619bd3410649b57dd — §0; as written `:261-273`
- `frontends/shell/e2e/regression.mjs:260-263` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:3b4b6ca75b857aa3f7281b1eeeb99fbb11619bc06322c875f6c5e826039cd99e — §0; as written `e2e/regression.mjs:260-263`
- `frontends/shell/e2e/reopen.mjs:366` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:6087908096121f8d25da32f9f29763b84c5d6298b5f7605a30f09f9b792baee9 — §0, §9a; as written `e2e/reopen.mjs:366`, `reopen.mjs:366`
- `frontends/shell/e2e/selection.mjs:161` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:f29e26a3ee93fe3fbbbb1804876b00b27b4c92d43c89d1e1109140a6b0696bfa — §0; as written `e2e/selection.mjs:161`
- `frontends/shell/e2e/selection.mjs:764` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:d5a08aaf11a3b326a0ef749d4fb2533c487864391af8caf3c4cda7e7efd37299 — §0; as written `:764`
- `frontends/shell/e2e/layout.mjs:288-320` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:0e8446232717f88a40bea62d365d47eabb743d292e6373a046d40acbbc194189 — §0; as written `e2e/layout.mjs:288-320`
- `frontends/shell/e2e/console.mjs:1041` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:f7f0f0c14a16e8250621b57b85f8b9273868ae5c6ac9d019572704ce708a4a3d — §0; as written `e2e/console.mjs:1041`
- `frontends/shell/e2e/admission-remediation.mjs:856` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:f7f0f0c14a16e8250621b57b85f8b9273868ae5c6ac9d019572704ce708a4a3d — §0; as written `e2e/admission-remediation.mjs:856`
- `frontends/shell/e2e/regression.mjs:2671` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:f7f0f0c14a16e8250621b57b85f8b9273868ae5c6ac9d019572704ce708a4a3d — §0; as written `e2e/regression.mjs:2671`
- `frontends/shell/src/App.streamFailure.test.tsx:4-11` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:338fb10ff54eeae429e29e4647e072ab369bda9c6a26f6698d266bdf977e82f8 — §0, §4; as written `App.streamFailure.test.tsx:4-11`
- `frontends/shell/MANUAL-WALKTHROUGH.md:2021` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:c9eda04d524351a7921f63fda8f085f969a91416e471d2d5e7f6bb4622179357 — §0
- `KNOWN-LIMITATIONS.md:557` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:7c5da1c5d4b831b46f63cb5eb33d5909ec4942d017d0c18822d56aee0ae13cd9 — §0
- `frontends/shell/e2e/source-changed.mjs:770` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:eb736c588760b597f0f96b71943c5b5cd63f482dca35fd1bc843412b209d86a4 — §0; as written `:770` (r)
- `frontends/shell/src/App.tsx:878` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:765a143dcd887a6af3aff61ed5cd8ae2b411b0f7c69dbc98628c8d9a0fa9a40b — §2.2; as written `:878`
- `frontends/shell/src/App.tsx:2518` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:f485c85c8d8307e98d9dfa9f24cf32656b2929309fd3f4051a33d4133d77f8af — §2.2; as written `:2518`
- `frontends/shell/src/App.tsx:851-853` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:289ca0f528ebd7906ca3a661a6dfbafe61304fb4701cc4eaf75b29d73276728f — §2.2; as written `App.tsx:851-853`
- `frontends/shell/src/App.tsx:1604` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:c35b539f316a52bf5e7175c6bc0d8366adcc08939aea3215412618e2bc6aa713 — §2.2; as written `App.tsx:1604`
- `frontends/shell/src/App.tsx:1620` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:13ba23f2facca56afff571b907900c72bebb3d0bf5b421145c1ef9fc018377d4 — §2.2; as written `:1620`
- `frontends/shell/src/App.tsx:1888` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:edaed0d228c8c260e0cf0a1c195cd78b63d0484f9561ac0b661ea59a90ef4a5c — §2.2; as written `:1888`
- `frontends/shell/src/App.tsx:2404` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:cf449b4cc0cfaeb915e5a350a4647824013730190ca4923a26ae90961c9347aa — §2.2; as written `:2404`
- `frontends/shell/src/App.tsx:1270` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:f89a6f0166d78d4f840b32076bb5f07883a643243a826dbffc6a16c4d94f629b — §2.4; as written `:1270`
- `frontends/shell/src/App.tsx:1279` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:f7d229b5d6f92298323ddb9e8c990cb97a56a522c61f06df3013f27d8e650981 — §2.4; as written `:1279`
- `frontends/shell/src/publish/PublishPanel.tsx:727` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:b3132303345bab8e7632fc379e84699cab0dc12754b143d46c75094142e5491b — §2.4; as written `PublishPanel.tsx:727`
- `frontends/shell/src/console/surfaceRegistry.ts:321` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:49f39fa21cc0a576ae19d8e8e612889729e47598d02b7bccf42c96426ca5316c — §2.7; as written `surfaceRegistry.ts:321`
- `state/directives/2026-10-06-machine-script-adopted.md:12-22` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:7350977156bed7c94b0da4e8db806ba34c25c6678e65c46447a62d791ba9e8e1 — §9
- `KNOWN-LIMITATIONS.md:185-189` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:e5c7c999c1c569958203c88cf1b9368ea2e9ee846a00d35d187309786e921cfe — §9a

4. **OPEN items.** OPEN-1 to OPEN-8, and the KNOWN-LIMITATIONS drafts KL-A to KL-D go to the advisor in one message (ADV-2026-11-23-15 item 8). Their answers come as later amendments; the gates do not wait for them.

Read the last amendment first.

Nothing above is edited.

## Amendment 2 — 2026-11-23 — post-result amendment after the architect's form gate, attempt 1 (FAIL): E-1, C-1 and the documentation findings

*Written after the outcome of the architect's form gate, attempt 1, was seen. The gate report is `state/consults/gates/2026-11-23-shell-migration-milestone-5-form-gate-architect.md`, cited by finding id. It is written before any code. Every `path:line` in this amendment is read at 96f56d28206e74d6992156f3f7735483d8063fa8. Between 0bcf5434 and that commit only records changed (the gate report's header). The custodian adds span hashes by script.*

### E-1. The arms

**E-1.0 The arm map. This is binding for every row below.**
- **Baseline-pinned process:**
  - C-E1, H2, H3 and §3 row 1.
  - Operator steps 0a to 3.
  - The new suite `frontends/shell/e2e/conditions-baseline.mjs` pins the arm once, in `main()`, before its first `openPath`. It calls `setResidencyArm("baseline")`, reads back `getResidencyArm()`, and fails the run on a refused pin, as `frontends/shell/e2e/refusal-contract-baseline.mjs:596-617` does.
- **Shipped candidate arm.** `setResidencyArm` is never called. Each e2e reads back `getResidencyArm()` as `"candidate"` before its first `openPath`.
  - The App tests: C-A1 to C-A4, J-A1 and J-A2. Their harness is `App.streamFailure.test.tsx`'s, on `DEFAULT_RESIDENCY_ARM` (`frontends/shell/src/residency/residencyArm.ts:50`).
  - The e2e tests C-E2, J-E1 and J-E2.
  - H4, H6 and H7.
  - §3 rows 2 and 3, and the new row.
  - Operator steps 3a, 4 and 5.
- **No arm:** the C-U, C-R, J-U, J-R and C-K1 tests (pure, or a component alone). H1 runs each existing suite on its own arm, as at the base. H5 has no arm.
- **Why.** Two routes exist only on the baseline arm:
  - canvas-ceiling: `App.tsx:667` is reached only from the baseline `pushBatch` catch (`frontends/shell/src/canvas/WorkingCanvas.tsx:1536-1548`);
  - stream-terminal: `App.tsx:1892` is in the baseline branch (`:1853` on). The candidate branch returns before it (`:1838-1850`).
- The other routes:
  - **viewport-refusal** is raised on candidate only at the first look (`App.tsx:1834`) and at the Colour-by refill (`:2146`), never from a pan. On baseline it is also raised at `:2012` and `:2031`.
  - **session-ended and the three notices** are raised on both arms.

**Addition, at the end of §2.2's bullets after the routes table:**

````text
- **Arms.** canvas-ceiling and stream-terminal are baseline-only routes (`App.tsx:667` from `WorkingCanvas.tsx:1536-1548`; `App.tsx:1892`, after the candidate branch has returned at `:1838-1850`). viewport-refusal is raised on candidate only at the first look (`:1834`) and the Colour-by refill (`:2146`). session-ended and the three notices are raised on both arms.
````

**E-1 item 1.** C-E1, H2, H3 and §3 row 1 run in their own baseline-pinned process (E-1.0).

Old:
````text
| H3 | A pan on that copy raises the same ceiling refusal again, under the same view and open. | C-E1, step 3 |
````
New:
````text
| H3 | A pan on that copy, on the pinned baseline arm, raises the same ceiling refusal again, under the same view and open. | C-E1, step 3 |
````

D-d below carries H2's arm clause.

Old:
````text
| `over-ceiling-refused.parquet` (copy) | C-E1 | A canvas refusal first. A pan re-raises it (H3). A write and a pan end the session (H2). Problems has 2 rows. |
````
New:
````text
| `over-ceiling-refused.parquet` (copy) | C-E1, in the baseline-pinned process (`e2e/conditions-baseline.mjs`) | A canvas refusal first. A pan re-raises it (H3). A write and a pan end the session (H2). Problems has 2 rows, or 3 when the session ended on the baseline post-check route (a stream-terminal row, declared unchanged in Amendment 2). |
````

Old:
````text
| C-E1 | A | the real app, §3: open the copy; the refusal is the top with no S-3; pan, and Problems shows 1 row with S-5; write and pan, and the top is session ended with S-3 at 1 and both rows standing; S-3 opens Problems; Dismiss the refusal; reopen, and both are empty | the session-ended raise ends the other conditions; {C-E1} |
````
New:
````text
| C-E1 | A | the real app on the baseline arm, in its own process (`e2e/conditions-baseline.mjs`), the arm pinned once in `main()` before the first `openPath` with a `getResidencyArm()` readback, a refused pin failing the run (`refusal-contract-baseline.mjs:596-617`); then §3: open the copy; the refusal is the top with no S-3; pan, and Problems shows 1 row with S-5; write and pan, and the top is session ended with S-3 at 1 and both rows standing, or S-3 at 2 only when the session log holds a `stream-terminal-failure` line whose detail opens with `engine.source_changed` (`App.tsx:1887`), the extra row being that stream-terminal condition; any other count fails; S-3 opens Problems; Dismiss the refusal; reopen, and both are empty | the session-ended raise ends the other conditions; {C-E1, C-E2} |
````

**E-1 item 2.** C-A1 moves to routes the candidate harness reaches: viewport-refusal, record-notice and session-ended.

Old:
````text
The test harness: `frontends/shell/src/App.streamFailure.test.tsx:4-11` (the real App, with the canvas stand-in capturing `WorkingCanvasProps`).
````
New:
````text
The test harness: `frontends/shell/src/App.streamFailure.test.tsx:4-11` (the real App on the shipped candidate arm, whose baseline `ViewportStreamManager` is a stub that captures no callbacks, with the canvas stand-in capturing `WorkingCanvasProps`). No App test reaches `App.tsx:667` from the canvas or `:1892`.
````

Old:
````text
| C-A1 | A | the real App: two terminal failures with different codes, then a session end; the strip's top is session ended, S-3 reads 2, and Problems has 3 entries | App clears before it raises at `:1892`; {C-A1} |
````
New:
````text
| C-A1 | A | the real App on the shipped candidate arm: the first look's untiled query refused once with `SkpCallError({code: "engine.connections_exhausted", …})` (the shape at `App.streamFailure.test.tsx:240`), giving a viewport-refusal condition; a style commit whose `recordStep` the transport mock refuses (the `refuseRecordWith` pattern, `App.recording.test.tsx:229`), giving a record notice; then a `DatasetSessionEnded` `{session, reason: "observed-change"}` for the open, delivered through the handler the `./skp/events` mock captures, giving session ended; the strip's top is session ended, S-3 reads 2, and Problems has 3 entries | App ends the viewport-refusal condition when it raises session ended; {C-A1} |
````

The transport mock gains `recordStep`, and the events mock keeps its handler. Both modules are already mocked by the harness, so no new module is mocked (I5).

**E-1 item 3. The shipped arm's proof of seam 8.**
- **Real App (candidate):**
  - C-A1 covers session-ended, viewport-refusal and a record notice.
  - C-A4 covers the viewport-refusal route's suppression.
  - C-A3 covers Dismiss, the owner-clear and the reopen notices.
- **Real app (candidate):** C-E2 (new) covers session-ended and a save notice, and checks that no viewport-refusal condition is raised on that route.
- **Not covered in the real app:** a viewport refusal that is not suppressed, on the shipped arm. No ordinary step or e2e hook produces a pre-check refusal at the candidate first look or refill on demand. The one that can be produced, a source change, takes the session route. So its raise is proven only in the real App (C-A1, C-A3).

Old:
````text
| C-A4 | A | the real App: a session-ended pre-check refusal gives one condition, not two | raise the viewport condition too; {C-A4} |
````
New:
````text
| C-A4 | A | the real App on the shipped candidate arm: the first look's untiled query refused with `engine.source_changed` (the pre-check route, `App.tsx:1623-1629`) gives one condition, session ended, not two | raise the viewport condition too; {C-A4} |
````

Old:
````text
| C-A3 | A | the real App: Dismiss; a resolved viewport outcome clears its condition; a refused reopen keeps session ended; a successful open clears everything | clear on a refused admission; {C-A3} |
````
New:
````text
| C-A3 | A | the real App on the shipped candidate arm: Dismiss; a resolved viewport outcome clears its condition (the first look refused, then the canvas stand-in calls the captured `onAttributesNotHeld`, `App.tsx:2373`, and a Colour-by change issues the refill, `:2137-2147`, whose resolved outcome reaches `:1613`); a refused reopen keeps session ended; a successful open clears everything; a reopen whose file carries a notice leaves its `.reopen-notice` standing after its own open | clear on a refused admission; {C-A3} |
````

Old:
````text
| C-A2 | A | the real App: two ceiling refusals with identical text, one vertex and one pick, through the captured `onCanvasRefusal`, give two conditions | App passes a constant `kind`; {C-A2} |
````
New:
````text
| C-A2 | A | the real App, App's consumer side of the callback (App passes the prop on both arms, `App.tsx:2396`; the producer is baseline-only, C-K1 and C-E1): two ceiling refusals with identical text, one vertex and one pick, through the captured `onCanvasRefusal`, give two conditions | App passes a constant `kind`; {C-A2} |
````

**Addition, after the row C-E1 in §4's table:**

````text
| C-E2 | A | **the shipped arm's real-app proof of seam 8:** `e2e/conditions.mjs`, `getResidencyArm()` read back as `"candidate"` before the first `openPath`, `setResidencyArm` never called; §3's 100k copy in the run's TMP folder: open it; save through `e2eSaveProjectToFolder` into a new folder under the run's TMP, and the strip's top is a `.save-notice`, the save notices include the owner's `SAVED_NOTICE` (read from `src/project/saveProject.ts` by name, as `project.mjs:372-378` reads S18), and S-3 is absent; write to the copy and pan (H7), and the top is session ended with S-3 at 1; S-3 opens Problems, which lists the top row and the `.save-notice` row; `.canvas-session-ended` and each `.save-notice` are each once in the DOM; no `.canvas-refusal` holds an `.admission-refusal-code` (no viewport-refusal condition); reopen the copy, and S-4 shows | the session-ended raise ends the other conditions; {C-E1, C-E2} |
````

**Addition, after the row C-R3 in §4's table:**

````text
| C-K1 | A | **the ceiling's kind comes from its class:** `ceilingKindOf` (new, `src/canvas/limits.ts`; its product caller is WorkingCanvas's catch at `:1538-1540`, which passes it as `kind`) returns `"vertex-ceiling"` for `new ResidentVertexCeilingExceeded(MAX_RESIDENT_VERTICES + 1)` and `"pick-ceiling"` for the error `checkPickCeiling(DECKGL_PICK_INDEX_CEILING + 1)` throws (`limits.test.ts:24-41`'s shapes) | return `"vertex-ceiling"` for both; {C-K1} |
````

**Addition, after the row `| `100k-happy-path.parquet` | J-E2 |…` in §3's table:**

````text
| `100k-happy-path.parquet` (copy) | C-E2, on the shipped candidate arm (`e2e/conditions.mjs`) | A save notice first. A write and a pan end the session (H7). Problems has 2 rows. A reopen empties it. |
````

**Addition, after the row H5 in §0.4's table:**

````text
| H6 | On the shipped candidate arm, after the slow fixture's first look has settled, a pan starts a tile fill during which the Jobs scan row stands until it is clicked. | J-E1, the pan step |
| H7 | On the shipped candidate arm, a write to the opened 100k copy and a pan end the session, and raise neither a viewport-refusal nor a stream-terminal condition. | C-E2, the write step |
````

**E-1 item 4. J-A1 and J-E1 are re-aimed at candidate.**
- The baseline `cancelStream` path is dropped from the Jobs tests, for this reason:
  - `handleCancelScan` is App's inline handler moved whole (`App.tsx:2261-2330`), and FilterPanel's Cancel calls it.
  - Its baseline branch is therefore reached through FilterPanel's Cancel by `refusal-contract-baseline.mjs`'s SLOW'/CANCEL' step (`:479-508`), which runs at every head.
  - A Jobs test on baseline would prove a branch of the same function, which the Jobs row does not choose.
- J-A1 observes `relinquishFill` through its owner's outcome, not a spy. The candidate session is not mocked (§4).

Old:
````text
| J-A1 | B | the real App: the Jobs Cancel calls `handleCancelScan`; the manager's `cancelStream(handle)` runs once; the state is `cancelled`; FilterPanel's Cancel and the row are gone | Jobs dispatches `cancelledByUser` without `cancelStream`; {J-A1, J-E1} |
````
New:
````text
| J-A1 | B | the real App on the shipped candidate arm, set up as APP-SR2 (`App.streamFailure.test.tsx:223-238`: open, the first look's batch and terminal, one pending tile): the Jobs scan row and `.filter-cancel` stand; the Jobs Cancel calls `handleCancelScan`, whose candidate branch calls `relinquishFill` (`App.tsx:2306-2321`): the row and `.filter-cancel` are gone, `.scan-incomplete` is absent, and `.residency-status` changes to the owner's relinquished statement (`src/residency/residencyStatus.ts:463`), equal to the text a twin case in the same file gives when `.filter-cancel` is clicked at the same point | the Jobs row's Cancel dispatches `applyScanEvent({kind: "reset"})` and does not call `handleCancelScan`; {J-A1, J-E1} |
````

Old:
````text
| J-E1 | B | the real app, §3: the Jobs scan row; Cancel; `.scan-incomplete`; a `cancel` row in Console; no stream left | Jobs Cancel not wired; {J-E1} |
````
New:
````text
| J-E1 | B | the real app on the shipped candidate arm, `getResidencyArm()` read back as `"candidate"` before the first `openPath`, `setResidencyArm` never called: open the slow fixture, wait for the first look's settle, pan (H6); the Jobs scan row and `button.filter-cancel` stand; Cancel from Jobs; the row and `button.filter-cancel` are gone, `.residency-status` matches the owner's relinquished statement (`src/residency/residencyStatus.ts:463`), and `.scan-incomplete` is absent over a bounded settle window | Jobs Cancel not wired; {J-E1} |
````

Old:
````text
| `slow-filter-scan.parquet` | J-E1 | The Jobs scan row, then Cancel from Jobs, then `.scan-incomplete`. |
````
New:
````text
| `slow-filter-scan.parquet` | J-E1, on the shipped candidate arm | The Jobs scan row during a tile fill after the first look (H6), then Cancel from Jobs, then the row and FilterPanel's Cancel gone, the relinquished status, and no `.scan-incomplete`. |
````

**§2.5, items 1, 2 and 4:**

Old:
````text
1. Seam 8: App's raise sites to ConditionView, ProblemsTab and the strip. It is proven from the real App by C-A1 to C-A4, and in the real app by C-E1.
````
New:
````text
1. Seam 8: App's raise sites to ConditionView, ProblemsTab and the strip. On the shipped candidate arm it is proven from the real App by C-A1, C-A3 and C-A4, and in the real app by C-E2. The baseline-only routes are proven in the real app by C-E1, in its own baseline-pinned process. A viewport refusal that is not suppressed is proven on the shipped arm in the real App only (Amendment 2, E-1 item 3).
````

Old:
````text
2. `onCanvasRefusal` with its kind (OPEN-2 (a)): C-A2 drives the captured real `WorkingCanvasProps`, and C-E1 runs it in the real app.
````
New:
````text
2. `onCanvasRefusal` with its kind (OPEN-2 (a)), a baseline-only producer: C-K1 proves the class-to-kind mapping, C-A2 drives App's consumer through the captured real `WorkingCanvasProps`, and C-E1 runs it in the real app on the pinned baseline arm.
````

Old:
````text
4. FilterPanel's `onCancel` and the Jobs Cancel as one function: J-A1, then J-E1.
````
New:
````text
4. FilterPanel's `onCancel` and the Jobs Cancel as one function, `handleCancelScan`: J-A1, then J-E1, on the shipped candidate arm, where it calls `relinquishFill`. Its baseline branch is reached through FilterPanel's Cancel by `refusal-contract-baseline.mjs`'s SLOW'/CANCEL' step, unchanged.
````

**E-1 item 5. The operator Part.** Step 0a pins baseline in a dev build, as Part D's D0 does (`frontends/shell/MANUAL-WALKTHROUGH.md:218`). Steps 3a and 4 run in a fresh launch on the shipped arm.

Old:
````text
  - 1 (A). Open the over-ceiling copy. The strip shows one refusal. Felt: do you know where the others would go?
  - 2 (A). Pan, then change the file and pan. The strip shows session ended and "1 more". Open Problems. Felt: is the count noticed, and does the strip feel calmer?
  - 3 (A). Dismiss the refusal in Problems. Reopen the file, and both are gone.
  - 4 (B). Slow fixture: filter, open Jobs, and cancel there. Felt: did you look in Jobs or in Filter?
````
New:
````text
  - 0a (A). In a dev build, before opening anything, open DevTools and run `await window.__SPATIAL_E2E__.setResidencyArm("baseline")`; it resolves `{ok:true}` (Part D's D0). Steps 1 to 3 show the baseline arm, which no operator reaches in the shipped build.
  - 1 (A). Open the over-ceiling copy. The strip shows one refusal. Felt: do you know where the others would go?
  - 2 (A). Pan, then change the file and pan. The strip shows session ended and "1 more". Open Problems. Felt: is the count noticed, and does the strip feel calmer?
  - 3 (A). Dismiss the refusal in Problems. Reopen the file, and both are gone.
  - 3a (A). Close the app and launch it again with no DevTools step (the shipped arm). Open a copy of the 100k fixture and save the project; the strip shows the save notice. Change the file and pan; the strip shows session ended and "1 more", and Problems lists the save notice. Reopen the file, and Problems is empty.
  - 4 (B). In a shipped-arm launch: slow fixture: wait for the map, filter, open Jobs, and cancel there. The row and Filter's Cancel go, the status bar says filling stopped, and no incomplete-scan line shows. Felt: did you look in Jobs or in Filter?
````

### C-1. The lifecycle of `notKept`, and the generation guard

Old:
````text
**The reducer** is `conditionsReducer(state, event)`. It is pure, and it holds `{ byId, nextId, nextSeq, notKept }`. Its events:
````
New:
````text
**The reducer** is `conditionsReducer(state, event)`. It is pure, and it holds `{ byId, nextId, nextSeq, notKept, current }`, where `current` is the open's generation, `null` before the first `opened`. Its events:
````

Old:
````text
  - A raise past `CONDITIONS_MAX` adds one to `notKept`. The oldest are kept.
````
New:
````text
  - A raise whose generation is not `current` (any raise while `current` is `null` included) is dropped first, before the identity match, the replacement and the cap: nothing is minted, and `occurrences`, `nextId`, `nextSeq` and `notKept` are unchanged. It applies at every raise site: session-ended (`App.tsx:1492-1496`), canvas-ceiling (`:667`), stream-terminal (`:1892`), viewport-refusal (`:1623`), record-notice (`:879`, generation `report.dataset`), save-notice (`:2193`, generation `held.dataset`) and reopen-notice (`:1238`, generation `next.dataset`).
  - A raise past `CONDITIONS_MAX` adds one to `notKept`. The oldest are kept.
````

Old:
````text
- `opened(resource)`: ends every condition whose generation is not `resource`. It is dispatched where `admitAndResetStaleUiState` runs on a successful admission, never on a refused one.
````
New:
````text
- `opened(resource)`: sets `current` to `resource`, ends every condition whose generation is not `resource`, and resets `notKept` to 0. It is dispatched where `admitAndResetStaleUiState` runs on a successful admission (`App.tsx:1182`), never on a refused one. On a reopen, `handleAdmitted(next)` runs before the reopen notices are set (`:1221`, `:1238`), so their raise follows `opened` and carries `next.dataset`.
````

Old:
````text
- Each raise sits after the site's existing generation guard (`App.tsx:1604`, `:1620`, `:1888`, `:2404`), so a late call is still logged and dropped as today.
````
New:
````text
- Each raise sits after the site's existing generation guard (`App.tsx:1604`, `:1620`, `:1888`, `:2404`, and `endSessionForDataset`'s at `:742` for session ended), so a late call is still logged and dropped as today. The step-queue report (`:879`), the save (`:2193`) and the reopen (`:1238`) have no guard in App; the reducer's generation drop is their guard.
````

**Addition, after the row C-U7 in §4's table.** These rows extend C-U6 and C-U7, one mutation each:

````text
| C-U6a | A | **a raise under another generation is dropped:** after `opened(R)`, a raise under R′, and in a fresh state a raise before any `opened`, leave `byId`, `nextId`, `nextSeq` and `notKept` unchanged | delete the generation drop from `raise`; {C-U6a, C-U7b} |
| C-U7a | A | **`opened` resets `notKept`:** `CONDITIONS_MAX + 1` raises under R give `notKept` 1; `opened(R′)` then gives `notKept` 0 and no condition | `opened` leaves `notKept` as it was; {C-U7a} |
| C-U7b | A | **a stale raise takes no cap room:** `opened(R)`, `CONDITIONS_MAX` raises under R, then one raise under R″: `notKept` stays 0 and the 64 are unchanged | apply the generation drop after the cap check; {C-U7b} |
````

### The new or changed tests: their files, red-before reasons and mutations

Every test below is red before its fix for the reason given. Each has one mutation, named in its table row with the set that fails.

| Test | File | Red before |
|---|---|---|
| C-U3 | `src/conditions/conditions.test.ts` | `conditions.ts` is absent |
| C-U6a, C-U7a, C-U7b | `src/conditions/conditions.test.ts` | `conditions.ts` is absent; without `current`, a stale raise mints and is counted |
| C-R1 | `src/conditions/ConditionView.test.tsx` | `ConditionView.tsx` is absent |
| C-K1 | `src/canvas/limits.test.ts` | `ceilingKindOf` is absent |
| C-A1 to C-A4 | `src/App.conditions.test.tsx` | no store, no S-3, no Problems; today App hides the viewport refusal while session ended stands (`App.tsx:2518`) |
| C-E1 | `e2e/conditions-baseline.mjs` | the suite, S-3 and Problems are absent |
| C-E2 | `e2e/conditions.mjs` | the suite, S-3 and Problems are absent |
| J-A1 | `src/App.jobs.test.tsx` | no Jobs tab |
| J-E1 | `e2e/jobs.mjs` | the suite and the Jobs tab are absent |

**Known pass cases.** I checked each mutation above against its set and found none.
- C-U3's mutation fails C-A1: the record notice (view target) raised after the viewport refusal (view target) would end it.
- C-U6a's mutation fails C-U7b: without the drop, the stale raise at the cap counts.
- J-A1 asserts the status both changes and matches the owner's statement, so a mutation that leaves the status standing cannot pass.

### The gate's notes

- **C-U3 and the C-U1 mutation.**

Old:
````text
| C-U3 | A | **a newer raise never ends an older blocker:** refusal A, refusal B, a notice, then session ended; all four stand, and the top goes from A to session ended | a raise ends earlier conditions of its target; {C-U3, C-A1} |
````
New:
````text
| C-U3 | A | **a newer raise never ends an older blocker:** refusal A, refusal B, a notice, then session ended; refusals A and B are both raised on the stream-terminal route, with the same view and generation and different codes, so that C-U1's mutation fails here; all four stand, and the top goes from A to session ended | a raise ends earlier conditions of its target; {C-U3, C-A1} |
````

- **The baseline post-check route is declared unchanged.**
  - There, a session-ended terminal calls `endSession` and then `opts.onTerminal` (`frontends/shell/src/streaming/viewportStreamManager.ts:338-367`).
  - So it raises session-ended and a stream-terminal condition with the same code, as today's banner already stands beside session ended.
  - C-E1's count names it.

  **Addition, at the end of §5's "Declared unchanged" list:**

````text
- the baseline post-check route (`streaming/viewportStreamManager.ts:338-367`): a session-ended terminal raises session-ended and a stream-terminal condition, as the banner stands beside session ended today.
````

- **C-A3, reopen notices.** C-A3 asserts them, as in its New row above.
- **C-R1, the alert role per place.**

Old:
````text
| C-R1 | A | **no remedy invented:** per route, ConditionView renders App's moved markup exactly; its buttons are exactly the owner's Dismiss; S-5 is the only added text | add a Reopen button to session ended; {C-R1} |
````
New:
````text
| C-R1 | A | **no remedy invented:** per route, ConditionView renders App's moved markup exactly; its buttons are exactly the owner's Dismiss; S-5 is the only added text; per place, the element in the strip carries `role="alert"`, and no Problems row, the `problem-row-top` row included, carries it | add a Reopen button to session ended; {C-R1} |
````

- **One re-sweep and one closing amendment per PR.**

Old:
````text
- **One re-sweep amendment** (0.3) before each PR's code.
````
New:
````text
- **One re-sweep amendment** (0.3) before each PR's code, and **one closing amendment** per PR, each naming its own PR.
````

### D-a to D-g, adopted in the gate's words

D-a:
````text
- All are cleared by `admitAndResetStaleUiState` (`App.tsx:251-262`).
````
````text
- `canvasRefusal`, `viewportRefusal` and `sessionEnded` are cleared by `admitAndResetStaleUiState` (`App.tsx:251-262`). The record, save and reopen notices are not cleared there: each carries its dataset and is shown only while that dataset is the open one (`:921-923`).
````

D-b:
````text
  - `:1194-1196` and `:1492-1496` (session ended).
````
````text
  - `:1492-1496` (session ended). `:1194-1196` is the reset's adapter, which only sets it to null: a clear site.
````
````text
| session-ended | `:1492-1496`, `:1194-1196` | session | `refusal.code` | resource | 1 | next-open |
````
````text
| session-ended | `:1492-1496` | session | `refusal.code` | resource | 1 | next-open |
````
````text
`sessionEnded` stays a state, because the hover latch, the table and the watcher read it. Its two set sites also raise.
````
````text
`sessionEnded` stays a state, because the hover latch, the table and the watcher read it. Its one set site (`:1492-1496`) also raises; its clear at `:1194-1196` runs where `opened` is dispatched.
````

D-c:
````text
The open-during-export ask calls `run.cancel()` (`:1299-1305`).
````
````text
The open-during-export ask (`:1299-1305`) calls `run.cancel()` (`:1313`).
````
````text
  - The ask's call (`:1299-1305`) is unchanged.
````
````text
  - The ask's call (`:1313`) is unchanged.
````

D-d:
````text
| H2 | A scratch copy of `over-ceiling-refused.parquet` ends its session after a write and a pan, as `source-changed.mjs` does with the 100k copy (`:770`). | C-E1, step 4 |
````
````text
| H2 | A scratch copy of `over-ceiling-refused.parquet`, opened on the pinned baseline arm, ends its session after a write to the copy and a pan. This is a new mechanism: `source-changed.mjs` copies its 100k fixture (`:770`) and changes the source by repointing a junction, not by a write (`:33-39`). | C-E1, step 4 |
````

D-e:
````text
- `surfaceRegistry.ts`: the statement of `layout.selectActivityTab` names the new tab (S-12).
````
````text
- `surfaceRegistry.ts`: the statement of `layout.selectActivityTab` names the new tab (S-12), and the statements of `canvas.dismissCanvasRefusal` and `canvas.dismissViewportRefusal` (`:234-236`, `:243-244`), which name the removed setters, name the store's `dismiss(id)` instead (S-13, a P6 draft).
````

**Addition, after the row S-12 in §2.7's table:**

````text
| S-13 | the `canvas.dismissCanvasRefusal` and `canvas.dismissViewportRefusal` statements, naming the store's `dismiss(id)` in place of the removed setters | `surfaceRegistry.ts:234-236`, `:243-244` |
````

Old:
````text
  - 6. P6 sight of S-1 to S-12.
````
New:
````text
  - 6. P6 sight of S-1 to S-13.
````

D-f:
````text
- the dismiss sweeps at `e2e/console.mjs:1041`, `e2e/admission-remediation.mjs:856` and `e2e/regression.mjs:2671`.
````
````text
- the dismiss sweeps at `e2e/console.mjs:1041`, `e2e/admission-remediation.mjs:856` and `e2e/regression.mjs:2671`;
- also `e2e/project.mjs:274`, `e2e/reopen.mjs:295`, `e2e/refusal-contract-baseline.mjs:377-382` and `:623`, and `e2e/residency-harness.mjs:829` and `:2754` (found at the form gate; the 0.3 re-sweep's list is the complete one).
````

D-g:
````text
  - the diff `origin/main...HEAD`;
````
````text
  - the diff from the recorded base to HEAD (ADV-2026-11-23-15 item 4), not `origin/main...HEAD`;
````

### For the advisor, not adopted (P6 drafts and a note)

- **D-h, S-7.** The gate's draft is `[P6 placeholder] No map loading or export is running.`, replacing `[P6 placeholder] Nothing is running.` Its reason: an open, a save or a reopen can run while Jobs is shown.
- **D-i, S-5.** The gate's draft defines `{n}` as `occurrences − 1`.
- **The gate's note on plan §9 and the cap:** whether `CONDITIONS_MAX` with `notKept` is declared as a bound under §9.

None of these is ruled here.

### Scope (class 9) and §7

The scope additions below are declared before any code. All are in PR A:
- `frontends/shell/e2e/conditions-baseline.mjs`, new: C-E1 in its baseline-pinned process. About 460 lines.
- `frontends/shell/src/canvas/limits.ts`: `ceilingKindOf`. About 10 lines.
- `frontends/shell/src/canvas/limits.test.ts`: C-K1. About 25 lines.
- `frontends/shell/package.json`: a second script line, `e2e:conditions-baseline`. 1 line.

`e2e/conditions.mjs` now carries C-E2 in place of C-E1, at about 420 lines. `WorkingCanvas.tsx` calls `ceilingKindOf` within its 12 lines.

Old:
````text
  - `frontends/shell/src/canvas/WorkingCanvas.tsx`, under OPEN-2 (a) only;
````
New:
````text
  - `frontends/shell/src/canvas/WorkingCanvas.tsx`, under OPEN-2 (a) only, and `frontends/shell/src/canvas/limits.ts` for `ceilingKindOf` (class 9, Amendment 2);
````

Old:
````text
  - `frontends/shell/src/layout/StudioLayout.test.tsx`;
````
New:
````text
  - `frontends/shell/src/layout/StudioLayout.test.tsx`;
  - `frontends/shell/src/canvas/limits.test.ts` (C-K1; class 9, Amendment 2);
````

Old:
````text
  - `frontends/shell/e2e/conditions.mjs`, new;
````
New:
````text
  - `frontends/shell/e2e/conditions.mjs`, new (C-E2, the shipped arm), and `frontends/shell/e2e/conditions-baseline.mjs`, new (C-E1, its own baseline-pinned process; class 9, Amendment 2);
````

Old:
````text
  - `frontends/shell/package.json`, one script line.
````
New:
````text
  - `frontends/shell/package.json`, two script lines (Amendment 2).
````

**§7 is not edited.** Its ceilings do not all hold under this amendment. These overruns are predicted:
- package.json: 2 against 1;
- A-E: about 960 against 620;
- App.conditions: about 560 against 480, from C-A1's and C-A3's harness lines;
- PR A's total: about 3,550 against 3,094.

Each overrun is recorded as class 8 at the count, in PR A's closing amendment. A-P's and A-T's other files, and PR B's groups, are predicted to hold. B-P's App 150 is the exception the gate named.

Read the last amendment first.

Nothing above is edited.

## Amendment 3 — 2026-11-23 — the custodian's, at the commit that files Amendment 2: references only

*Written by the custodian at the commit that files Amendment 2, before any code. References only.*

1. Amendment 2 is the architect's draft, appended byte for byte from its consult, `state/consults/2026-11-23-shell-migration-milestone-5-amendment-2-architect-draft.md` (the hand-back's sha256 ec866000d7d3afdc7c865dc6248161aa2d316aaaa3c05079c2eea9f8f0dc5d2e): the text between its two marker lines.
2. Its evidence is the architect's form gate, attempt 1, FAIL: `state/consults/gates/2026-11-23-shell-migration-milestone-5-form-gate-architect.md` (gate-log row 862).
3. Its cites are read at 96f56d28206e74d6992156f3f7735483d8063fa8. Its sentence that the custodian adds span hashes by script is not acted on: no hashes are added here. The architect's attempt 2 reads each cite at its own commit, and the form's re-sweep binds before code.
4. The points it could not settle (the consult's note after its end mark) go to the architect's attempt 2, and those that are rulings go to the advisor.
5. Next: the architect's form gate, attempt 2, on Amendment 2. No code is written before it ends PASS or PASS WITH NOTES.

Read the last amendment first.

Nothing above is edited.

## Amendment 4 — 2026-11-23 — post-result amendment after the architect's form gate, attempt 2 (FAIL), and ADV-2026-11-23-17: E-2, the documentation findings, the cap and the rulings

*Written after the outcome of the architect's form gate, attempt 2 (FAIL), and the advisor's ruling ADV-2026-11-23-17 were seen. The gate report is `state/consults/gates/2026-11-23-shell-migration-milestone-5-form-gate-architect-attempt-2.md`, cited by finding id. The ruling is cited by id and item. This amendment is written before any code. Every `path:line` in it is read at caea224a6cb081edc4577e978e408692c0c1172c. The custodian adds the span hashes by script.*

### R. The rulings (ADV-2026-11-23-17)

- **Ruled:** OPEN-1 (D) (item 1); OPEN-2 (a) (item 2); OPEN-3 (a), oldest first (item 3); OPEN-4 (a) (item 4); OPEN-5 (a) (item 5); OPEN-6 (a) (item 6); OPEN-7 (a) (item 7). I7 no longer stops their code.
- **Urgency classes confirmed** (item 3): 1, the session has ended; 2, refusals; 3, notices. These are §2.2's `Urgency` values as drafted.
- **OPEN-8 and the strings** (item 8): S-1 to S-13 and KL-A to KL-E stay drafts and are built under the placeholder mark. The advisor words them from the filed text after the form's gate has passed and before each PR's words commit. Operator step 6 stays.
- **Item 9.** These change the drafts. They do not rule them:

Old:
````text
| S-7 | `[P6 placeholder] Nothing is running.` | JobsTab, empty |
````
New:
````text
| S-7 | `[P6 placeholder] No map loading or export is running.` | JobsTab, empty |
````

Old:
````text
| S-5 | `[P6 placeholder] Raised again {n} times. The latest:` | ConditionView, when `occurrences > 1` |
````
New:
````text
| S-5 | `[P6 placeholder] Raised again {n} times. The latest:` | ConditionView, when `occurrences > 1`; `{n}` is `occurrences − 1` (ADV-2026-11-23-17 item 9) |
````

### A4-1. A save's notices are one batch (Correctness, found while drafting)

- **The defect.** In §2.2 every raise on a `replaced-by-owner` route ends that route's conditions before it mints. So in a two-notice save (`SAVED_NOTICE`, then `MARK_WITHHELD_NOTICE`: `src/project/saveProject.ts:115-117`), the raise of ordinal 1 ends ordinal 0. A save that answers `[]` (`saveProject.ts:110`) raises nothing, so the old notices stand. Today App replaces the whole list at `App.tsx:2193`, `[]` included.
- **The fix.** The owner's report is one event.

Old:
````text
  - A route declaring `replaced-by-owner` ends that route's conditions for the same target and generation before it mints.
````
New:
````text
  - A route declaring `replaced-by-owner` is never raised by `raise`. Its owner's report is one `replaceBatch(route, target, generation, displays)` event. If its generation is not `current`, it is dropped whole. Otherwise it ends that route's unresolved conditions for the same target and generation, once, and then raises each display in order through `raise`'s own path, the cap included, with `ordinal` its position for save-notice and `null` for record-notice. No condition of a batch ends another. An empty batch ends the old ones and mints nothing, as a save that answers `[]` (`src/project/saveProject.ts:110`) clears today's notices (`App.tsx:2193`). App's record-notice site (`:879`) and save site (`:2193`) dispatch it.
````

### Item 10. The cap

**The rule.** One place is held for urgency 1. It is not outside the count, because the store would then keep 65 conditions, and §7's bound ("the unresolved conditions kept per open", 64) would be untrue. Nothing kept leaves for a newer raise. Pushing out an urgency-2 condition would break §1's "a newer raise never ends an older refusal or blocker" and §8 item 4.

Old:
````text
  - A raise whose generation is not `current` (any raise while `current` is `null` included) is dropped first, before the identity match, the replacement and the cap: nothing is minted, and `occurrences`, `nextId`, `nextSeq` and `notKept` are unchanged. It applies at every raise site: session-ended (`App.tsx:1492-1496`), canvas-ceiling (`:667`), stream-terminal (`:1892`), viewport-refusal (`:1623`), record-notice (`:879`, generation `report.dataset`), save-notice (`:2193`, generation `held.dataset`) and reopen-notice (`:1238`, generation `next.dataset`).
  - A raise past `CONDITIONS_MAX` adds one to `notKept`. The oldest are kept.
````
New:
````text
  - A raise whose generation is not `current` (any raise while `current` is `null` included) is dropped first, before the identity match, the replacement and the cap: nothing is minted, and `occurrences`, `nextId`, `nextSeq` and `notKept` are unchanged. It applies at every raise site: session-ended (`App.tsx:1492-1496`), canvas-ceiling (`:667`), stream-terminal (`:1892`), viewport-refusal (`:1623`), record-notice (`:879`, generation `report.dataset`), save-notice (`:2193`, generation `held.dataset`) and reopen-notice (`:1238`, generation `next.dataset`).
  - **The cap** (ADV-2026-11-23-17 item 10). At most `CONDITIONS_MAX − 1` conditions of urgency 2 and 3 are kept for one open, and one place is held for urgency 1. A raise of urgency 2 or 3 that finds those places full is not kept and adds one to `notKept`. Nothing kept leaves for it, so the oldest are kept. A raise of urgency 1 under `current` is always kept. App raises urgency 1 at most once per open: the session-ended raise is made inside `endSession`'s `setSessionEnded` adapter (`App.tsx:1492-1496`), which `handleSessionEnded` reaches only past its latch (`:717`, with `isAlreadyEnded` at `:1491`; `App.test.ts:1201`). So the store keeps at most `CONDITIONS_MAX` for one open, as §7 declares.
````

**Why the strip's top stays the most urgent at the cap:**
1. Urgency 1 is always kept, and `ordered` sorts by urgency first. So a standing session-ended condition is the top. C-U7c asserts this.
2. The cap never removes a kept condition. A raise that is not kept is newer than every kept condition. So under OPEN-3 (a) it would not be the top while any kept condition of its urgency, or a more urgent one, stands. C-U7 asserts that the top at the cap is the first raise.
3. One open holds at most 13 notices at once:
   - 1 record notice, replaced by its owner (`App.tsx:879`);
   - 4 from a save (`saveProject.ts:115-121`);
   - 8 from a reopen (`src/project/openProject.ts:135-142`, with `lineagePlaces` giving at most 4, `:104-111`).
   So when the 63 places are full, at least 50 of them hold refusals, and a refusal that is not kept never outranks the top.
4. One case is left. If the operator dismisses every kept refusal while one that was not kept would still stand, the strip shows a notice or nothing. S-6's count stays until the next open, and KL-E says so.

The claim this changes:

Old:
````text
- Problems keeps every unresolved condition of the open on the map;
````
New:
````text
- Problems keeps the unresolved conditions of the open on the map, at most `CONDITIONS_MAX` (64) for one open with the session-ended condition always among them, and shows how many it did not keep (ADV-2026-11-23-17 item 10);
````

Old:
````text
5. An owner element twice in the DOM, or a condition with no place an operator can reach.
````
New:
````text
5. An owner element twice in the DOM, or a kept condition with no place an operator can reach. A raise past the cap is not kept, and S-6 counts it (ADV-2026-11-23-17 item 10).
````

**The tests.** D-1's words are adopted here, with item 10's counts. The words that are item 10's are the route and the counts.

Old:
````text
| C-U7 | A | `CONDITIONS_MAX + 1` raises: the oldest 64 are kept and `notKept` is 1 | drop the oldest; {C-U7} |
````
New:
````text
| C-U7 | A | after `opened(R)`, `CONDITIONS_MAX` raises under R, each with its own key on the stream-terminal route: the oldest `CONDITIONS_MAX − 1` are kept, `notKept` is 1, and `attentionOf(ordered(…))`'s top is the first raise | drop the oldest; {C-U7} |
````

Old:
````text
**`opened` resets `notKept`:** `CONDITIONS_MAX + 1` raises under R give `notKept` 1;
````
New:
````text
**`opened` resets `notKept`:** after `opened(R)`, `CONDITIONS_MAX` raises under R, each with its own key on the stream-terminal route, give `notKept` 1;
````

Old:
````text
| C-U7b | A | **a stale raise takes no cap room:** `opened(R)`, `CONDITIONS_MAX` raises under R, then one raise under R″: `notKept` stays 0 and the 64 are unchanged | apply the generation drop after the cap check; {C-U7b} |
````
New:
````text
| C-U7b | A | **a stale raise takes no cap room:** `opened(R)`, `CONDITIONS_MAX − 1` raises under R, each with its own key on the stream-terminal route, then one stream-terminal raise under R″: `notKept` stays 0 and the `CONDITIONS_MAX − 1` are unchanged | apply the generation drop after the cap check; {C-U7b} |
````

**Addition, after the row C-U7b in §4's table:**

````text
| C-U7c | A | **urgency 1 is always kept, in the held place:** after `opened(R)`, `CONDITIONS_MAX` stream-terminal raises under R, each with its own key (`CONDITIONS_MAX − 1` kept, `notKept` 1), then a session-ended raise under R: it is kept, the kept count is `CONDITIONS_MAX`, `notKept` stays 1, and `attentionOf(ordered(…))` gives it as the top with `others` = `CONDITIONS_MAX − 1` | an urgency-1 raise is kept only while fewer than `CONDITIONS_MAX − 1` conditions are kept, as urgency 2 and 3 are; {C-U7c} |
| C-U8 | A | **a notice batch is replaced whole:** after `opened(R)`, a viewport-refusal raise under R; `replaceBatch(save-notice, resource, R, [a, b])` gives two save-notice conditions with ordinals 0 and 1, both standing; `replaceBatch(save-notice, resource, R, [])` ends both and mints none; the viewport-refusal condition stands throughout | end the route's conditions before each display, not once per batch; {C-U8} |
````

**The KNOWN-LIMITATIONS draft for the bound** (P6, for the advisor; its number is the re-sweep's). Addition, after the line `- KL-D: …` in §9a's KNOWN-LIMITATIONS drafts:

````text
- KL-E: Problems keeps at most 64 problems for one open. Past that, a new refusal or notice is not kept, and Problems says how many were not kept; one that was not kept does not come back when others are dismissed. An ended session is always kept, and the attention strip shows it first. The count starts again at the next open.
````

The gate's KL-D note (every successful open empties Problems) as a changed draft:

Old:
````text
- KL-D: Problems is emptied when another dataset is opened. Nothing is kept.
````
New:
````text
- KL-D: Problems is emptied at every successful open, a reopen of the same file included; it then lists only what that open raises. Nothing is kept from before.
````

### E-2. Both (i) and (ii) are adopted

(i) C-E1's count becomes biconditional, in the gate's words:

Old:
````text
write and pan, and the top is session ended with S-3 at 1 and both rows standing, or S-3 at 2 only when the session log holds a `stream-terminal-failure` line whose detail opens with `engine.source_changed` (`App.tsx:1887`), the extra row being that stream-terminal condition; any other count fails;
````
New:
````text
write and pan, and the top is session ended; S-3 is at 1, with both rows standing, exactly when the session log from the write on holds no `stream-terminal-failure` line whose text after `— ` opens with `engine.source_changed` (`App.tsx:1887`), and S-3 is at 2, the extra row being that stream-terminal condition, exactly when it holds one; any other pairing fails;
````

(ii) C-A5 is adopted as the gate recommends. The other way is not taken, because a deterministic route exists:
- App constructs the baseline manager with `makeManagerCallbacks`'s `onTerminal` (`App.tsx:1863-1921`, `:601-632`).
- The harness already mocks that class (`App.streamFailure.test.tsx:95-104`).

**Addition, after the row C-A4 in §4's table:**

````text
| C-A5 | A | **the stream-terminal raise, from the real App on the pinned baseline arm:** in its own `describe` of `App.conditions.test.tsx`, whose `beforeEach` runs `__resetResidencyArmForTests()` and `setResidencyArm("baseline")` before the first `openPath` (`canvas/WorkingCanvas.wiring.test.tsx:84-85`) and whose `afterEach` resets the arm; the mocked `ViewportStreamManager` keeps the options App constructs it with (`App.tsx:1863-1921`); calling their `onTerminal(streamHandle, {kind: "ProducerFailed", detail})`, `detail` opening with a typed code, gives one stream-terminal condition: the strip's top is a `.canvas-refusal` holding App's `stream ProducerFailed: ` line (`:1892`), S-3 is absent, and Problems has one entry | App does not raise at `:1892`; {C-A5} |
````

Old:
````text
The test harness: `frontends/shell/src/App.streamFailure.test.tsx:4-11` (the real App on the shipped candidate arm, whose baseline `ViewportStreamManager` is a stub that captures no callbacks, with the canvas stand-in capturing `WorkingCanvasProps`). No App test reaches `App.tsx:667` from the canvas or `:1892`.
````
New:
````text
The test harness: `frontends/shell/src/App.streamFailure.test.tsx:4-11` (the real App on the shipped candidate arm, with the canvas stand-in capturing `WorkingCanvasProps`). In `App.conditions.test.tsx` the baseline `ViewportStreamManager` stub also keeps its constructor options, for C-A5 only; it is the module the harness already mocks. No App test reaches `App.tsx:667` from the canvas. C-A5 reaches `:1892` in its own baseline-pinned `describe`.
````

**Addition, after the line `  - C-E1, H2, H3 and §3 row 1.` in Amendment 2's E-1.0 arm map:**

````text
  - C-A5, the real App in its own `describe`, whose `beforeEach` pins the arm and whose `afterEach` resets it.
````

Old:
````text
1. Seam 8: App's raise sites to ConditionView, ProblemsTab and the strip. On the shipped candidate arm it is proven from the real App by C-A1, C-A3 and C-A4, and in the real app by C-E2. The baseline-only routes are proven in the real app by C-E1, in its own baseline-pinned process. A viewport refusal that is not suppressed is proven on the shipped arm in the real App only (Amendment 2, E-1 item 3).
````
New:
````text
1. Seam 8: App's raise sites to ConditionView, ProblemsTab and the strip. On the shipped candidate arm it is proven from the real App by C-A1, C-A3 and C-A4, and in the real app by C-E2. The canvas-ceiling route is proven in the real app by C-E1, in its own baseline-pinned process. The stream-terminal route is proven from the real App on the pinned baseline arm by C-A5, and in the real app by C-E1 only on a run that takes the post-check route, which C-E1's count tells apart. A viewport refusal that is not suppressed is proven on the shipped arm in the real App only (Amendment 2, E-1 item 3).
````

### D-1 to D-4, adopted in the gate's words

Each Old below occurs once in the form. D-1's C-U7 and C-U7a pairs are given under item 10, with its counts.

D-1:
````text
**What may be mocked:** the App tests mock only what `App.streamFailure.test.tsx:4-11` mocks. Mocking `conditionsReducer`, `ConditionView` or `jobsFrom` is I5.
````
````text
**What may be mocked:** the App tests mock only what `App.streamFailure.test.tsx:4-11` mocks. Mocking `conditionsReducer`, `ConditionView` or `jobsFrom` is I5. Every C-U case that raises dispatches `opened(R)` before its first raise, except C-U6a's fresh-state case (Amendment 2, C-1).
````

D-2:
````text
3. StudioLayout's `attention.top` slot and `attentionOthers`: C-R3, then C-E1.
````
````text
3. StudioLayout's `attention.top` slot and `attentionOthers`: C-R3, then C-E2 on the shipped candidate arm and C-E1 in its baseline-pinned process.
````
````text
| select Console; {C-R3, C-E1} |
````
````text
| select Console; {C-R3, C-E1, C-E2} |
````

D-3:
````text
The scope additions below are declared before any code. All are in PR A:
````
````text
Scope addition (class 9) on the seam rule (round 4, item 1), as the architect's form gate, attempt 1, E-1 applied it. The additions below are declared before any code. Declared unchanged for them (§5): `limits.ts`'s existing exports and every existing case in `limits.test.ts`; I1 to I8 invalidate them as they do the rest. All are in PR A:
````
````text
  - every e2e suite at the base plus the new one, by the suites' own launch;
````
````text
  - every e2e suite at the base plus the new ones (`conditions.mjs` and `conditions-baseline.mjs` for PR A, `jobs.mjs` for PR B), by the suites' own launch;
````

D-4:
````text
  - 0a (A). In a dev build, before opening anything, open DevTools and run `await window.__SPATIAL_E2E__.setResidencyArm("baseline")`; it resolves `{ok:true}` (Part D's D0). Steps 1 to 3 show the baseline arm, which no operator reaches in the shipped build.
````
````text
  - 0a (A). In a dev build, before opening anything, open DevTools and run `await window.__SPATIAL_E2E__.setResidencyArm("baseline")`; it resolves `{ok:true}` (Part D's D0). Steps 1 to 3 show the baseline arm, which no operator reaches in the shipped build. In step 2 the strip may show "2 more", and Problems a stream-terminal row, when the session ended on the post-check route (C-E1); in step 3 every row is then gone.
````
````text
Open a copy of the 100k fixture and save the project; the strip shows the save notice.
````
````text
Open a copy of the 100k fixture and save the project into a new folder that does not hold the copy; the strip shows the save notice.
````

### N-1 to N-6

- **N-1: adopted now, as C-K2.** Without it, a constant `"vertex-ceiling"` at `WorkingCanvas.tsx:1540` passes every test. OPEN-2 (a)'s producer then has no proof. A test file of its own is class 9 and must be declared before code.

  **Addition, after the row C-K1 in §4's table:**

````text
| C-K2 | A | **the producer passes the class's kind:** the real `WorkingCanvas` in `canvas/WorkingCanvas.wiring.test.tsx` (baseline pinned, `:84-85`); the file's `./limits` mock passes every call through to the original unless armed, and once armed its next `checkPickCeiling` call throws `new PickCeilingExceeded(n)` or `new ResidentVertexCeilingExceeded(n)` of the original module, reaching the catch at `WorkingCanvas.tsx:1538` from `ResidentSet.addBatch` (`residentSet.ts:73`); a `pushBatch` of a committed batch fixture then calls `onCanvasRefusal` with `"pick-ceiling"` and with `"vertex-ceiling"` respectively | WorkingCanvas passes `"vertex-ceiling"` at `:1540` for both classes; {C-K2} |
````

- **N-2: left to PR B's re-sweep and gates.** J-E1 is PR B's test, and PR B's base comes after PR A. If H6 is wrong, that is class 2 and a stop. The re-sweep can re-aim J-E1 at a FilterPanel Apply of the slow predicate.
- **N-3: adopted now.** The write is named as the mechanism `e2e/source-watch-idle.mjs:446-458` uses. In C-E1, C-E2 and §3's rows, "a write" means that touch.

Old:
````text
| H2 | A scratch copy of `over-ceiling-refused.parquet`, opened on the pinned baseline arm, ends its session after a write to the copy and a pan. This is a new mechanism: `source-changed.mjs` copies its 100k fixture (`:770`) and changes the source by repointing a junction, not by a write (`:33-39`). | C-E1, step 4 |
````
New:
````text
| H2 | A scratch copy of `over-ceiling-refused.parquet`, opened on the pinned baseline arm, ends its session after a write to the copy and a pan; the write is an mtime touch of the copy with its sha256 unchanged, as `e2e/source-watch-idle.mjs:446-458` does on the shipped arm. | C-E1, step 4 |
````

Old:
````text
| H7 | On the shipped candidate arm, a write to the opened 100k copy and a pan end the session, and raise neither a viewport-refusal nor a stream-terminal condition. | C-E2, the write step |
````
New:
````text
| H7 | On the shipped candidate arm, a write to the opened 100k copy (an mtime touch with its sha256 unchanged, as `e2e/source-watch-idle.mjs:446-458`) and a pan end the session, and raise neither a viewport-refusal nor a stream-terminal condition. | C-E2, the write step |
````

- **N-4: adopted now.** The later counts assume exactly one notice. A different count is a wrong prediction, class 2.

Old:
````text
the save notices include the owner's `SAVED_NOTICE`
````
New:
````text
the save notices are exactly `[SAVED_NOTICE]`, the owner's constant
````

- **N-5: adopted now.** C-A3's reopens need a client call that the transport mock does not answer today (`App.streamFailure.test.tsx:57-81`).

Old:
````text
The transport mock gains `recordStep`, and the events mock keeps its handler. Both modules are already mocked by the harness, so no new module is mocked (I5).
````
New:
````text
The transport mock gains `recordStep` and `openProject` (`src/skp/client.ts:145`, `:165`), and every other client call a reopen makes at PR A's base, which the re-sweep lists. C-A3's reopens go through the `e2eOpenProjectFolder` hook (`src/admission/AdmissionPanel.tsx:448-450`): the successful one is answered with an `OpenProjectResponse` whose reply gives at least one notice through `reopenApply` (`src/project/openProject.ts:132-144`), and the refused one with a `SkpCallError`. The events mock keeps its handler. Both modules are already mocked by the harness, so no new module is mocked (I5).
````

- **N-6: adopted now, in one line.** Addition, after D-3's new suites line (`  - every e2e suite at the base plus the new ones …, by the suites' own launch;`):

````text
    - `conditions.mjs` and `jobs.mjs` are never attached to an app another suite left pinned; attached so, their arm readback fails the run loudly.
````

- **N-7** is the custodian's.

### Item 11. The base

Old:
````text
So, by ADV-2026-11-23-15 item 4, PR A is built on the re-link's branch, which carries the heads of PR 353, PR 358 and PR 359. PR B is built on PR A.
````
New:
````text
So, by ADV-2026-11-23-15 item 4, as ADV-2026-11-23-17 item 11 confirms, PR A is built on the re-link's branch, `cut/relink-after-refusal`, which carries the heads of PR 353, PR 358 and PR 359. PR B is built on PR A. Neither merges before a piece it is built on.
````

### The new or changed tests: their files, red-before reasons and mutations

| Test | File | Red before | Mutation; set that fails |
|---|---|---|---|
| C-U5 (D-1) | `src/conditions/conditions.test.ts` | `conditions.ts` is absent | key on the display text; {C-U5, C-A2} |
| C-U7 | `src/conditions/conditions.test.ts` | `conditions.ts` is absent; as §2.2 drafted the cap, 64 urgency-2 conditions are kept, not 63 | drop the oldest; {C-U7} |
| C-U7a | `src/conditions/conditions.test.ts` | `conditions.ts` is absent | `opened` leaves `notKept` as it was; {C-U7a} |
| C-U7b | `src/conditions/conditions.test.ts` | `conditions.ts` is absent; without `current`, a stale raise mints and is counted | apply the generation drop after the cap check; {C-U7b} |
| C-U7c | `src/conditions/conditions.test.ts` | `conditions.ts` is absent; as drafted, a session-ended raise at the cap is not kept | an urgency-1 raise is kept only while fewer than `CONDITIONS_MAX − 1` are kept; {C-U7c} |
| C-U8 | `src/conditions/conditions.test.ts` | `conditions.ts` is absent; as drafted, a two-notice batch keeps one, and `[]` ends none | end the route's conditions before each display; {C-U8} |
| C-K2 | `src/canvas/WorkingCanvas.wiring.test.tsx` | `onCanvasRefusal` has no kind argument (`WorkingCanvas.tsx:1540`) | a constant `"vertex-ceiling"` at `:1540`; {C-K2} |
| C-R3 (D-2) | `src/layout/StudioLayout.test.tsx` | no S-3 button | select Console; {C-R3, C-E1, C-E2} |
| C-A3 (N-5) | `src/App.conditions.test.tsx` | no store; the transport mock answers no reopen | clear on a refused admission; {C-A3} |
| C-A5 | `src/App.conditions.test.tsx` | no store; today no App test reaches `App.tsx:1892` | App does not raise at `:1892`; {C-A5} |
| C-E1 (E-2 (i)) | `e2e/conditions-baseline.mjs` | the suite, S-3 and Problems are absent | the session-ended raise ends the other conditions; {C-E1, C-E2} |
| C-E2 (N-4) | `e2e/conditions.mjs` | the suite, S-3 and Problems are absent | the session-ended raise ends the other conditions; {C-E1, C-E2} |

**Known pass cases.** I checked each mutation above against its set and found none:
- **C-U7b.** With all `CONDITIONS_MAX − 1` places full, a stale urgency-2 raise checked against the cap first is counted, so `notKept` becomes 1.
- **C-U7c.** The mutation's threshold is the places for urgency 2 and 3, not the total, so the session-ended raise at 63 kept is refused.
- **C-U8.** It uses a two-display batch. A one-display batch would pass the mutation.
- **C-K2.** It asserts the pick class, which a constant cannot give.
- **C-U3.** Amendment 2 says C-U3's mutation fails C-A1. That still holds, because `replaceBatch` raises through `raise`'s path.

### Scope (class 9) and §7

Scope addition (class 9) on the seam rule (round 4, item 1), as the architect's form gate, attempt 2, N-1 applied it.
- It is declared before any code.
- Declared unchanged for it (§5): every existing case in `WorkingCanvas.wiring.test.tsx`, run with its `./limits` mock passing every call through. I1 to I8 invalidate it as they do the rest.
- It is in PR A: `frontends/shell/src/canvas/WorkingCanvas.wiring.test.tsx`, C-K2, about 45 lines.

**Addition, after the line `  - `frontends/shell/src/canvas/limits.test.ts` (C-K1; class 9, Amendment 2);` in §2.6's PR A Tests list:**

````text
  - `frontends/shell/src/canvas/WorkingCanvas.wiring.test.tsx` (C-K2; class 9, Amendment 4);
````

**§7 is not edited.** These overruns are predicted. Each is recorded as class 8 at the count, in PR A's closing amendment (ADV-2026-11-23-17 item 12):
- App.conditions: about 630 against 480 (Amendment 2's 560, C-A5 about 45, N-5 about 25);
- conditions.test: C-U7c and C-U8 add about 50 lines against 450;
- A-T: `WorkingCanvas.wiring.test.tsx` has no ceiling of its own, so all of its about 45 lines are over;
- PR A's total: about 3,730 against 3,094. That is Amendment 2's 3,550 plus about 180: C-A5 45, N-5 25, C-U7c and C-U8 50, `replaceBatch` 15, C-K2 45.

`conditions.ts` (280) is predicted to hold. PR B's groups are unchanged. If a build gate finds PR A too large to read as one, the split goes to the advisor (item 12).

Read the last amendment first.

Nothing above is edited.

## Amendment 5 — 2026-11-23 — the custodian's, at the commit that files Amendment 4: references only

*Written by the custodian at the commit that files Amendment 4, before any code. References only.*

1. Amendment 4 is the architect's draft, appended byte for byte from its consult, `state/consults/2026-11-23-shell-migration-milestone-5-amendment-4-architect-draft.md` (the hand-back's sha256 df2e361f56759b5c835e634dcefb23ee02a33871ba377ec9967796444230a1eb): the text between its two marker lines.
2. Its evidence is the architect's form gate, attempt 2, FAIL (`state/consults/gates/2026-11-23-shell-migration-milestone-5-form-gate-architect-attempt-2.md`, gate-log row 870), and the advisor's ruling ADV-2026-11-23-17 (`state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-17-milestone-5-open-items-as-recommended-the-cap-if-urgency-1-is-always-kept-pieces-that-share-a-file.md`).
3. Its cites are read at caea224a6cb081edc4577e978e408692c0c1172c. Its sentence that the custodian adds span hashes is not acted on: no hashes are added here. The architect's attempt 3 reads each cite at its own commit, and the form's re-sweep binds before code.
4. Its questions and drafts for the advisor go to the advisor in one message (ADV-2026-11-23-15 item 8); none is ruled here. The points it could not settle, and any finding of its own, go to the architect's attempt 3.
5. Next: the architect's form gate, attempt 3, on Amendment 4. No code is written before it ends PASS or PASS WITH NOTES.

Read the last amendment first.

Nothing above is edited.

## Amendment 6 — 2026-11-23 — the custodian's, after the architect's form gate, attempt 3 (FAIL): that gate's replacement words for E-3 and D-5 to D-7, carried byte for byte

*Written by the custodian before any code. It carries the attempt-3 gate's own replacement words, each copied by script from the filed report in the report's order; it words nothing of its own but where each goes and what follows.*

1. Evidence: the architect's form gate, attempt 3, FAIL (`state/consults/gates/2026-11-23-shell-migration-milestone-5-form-gate-architect-attempt-3.md`, gate-log row 874; the hand-back's sha256 92c51714868dadbb1c120fba24b77a99d9853eabc35b3659aea4a0f4d3f3011b). Its one blocking finding is E-3, Evidence: a save's notices as one batch has no test from the real App. Its Documentation findings are D-5, D-6 and D-7. Each Old text below occurs once in the form above this amendment, in Amendment 4; each New text occurs nowhere above it.

2. **E-3, Fix 1:** the A4-1 sentence of Amendment 4.

Old:

````text
App's record-notice site (`:879`) and save site (`:2193`) dispatch it.
````

New:

````text
App's record-notice site (`:879`) and save site (`:2193`) dispatch it. C-A6 proves the save site's batch from the real App. The empty batch is proven at store level only (C-U8): the harness reaches no folder picker that answers `null` without mocking `skp/dialog`, which it does not mock (I5).
````

3. **E-3, Fix 2:** a new row of §4's table, added after the row C-A5 as Amendment 4 adds it:

````text
| C-A6 | A | **a save's notices are one batch, from the real App on the shipped candidate arm:** the canvas stand-in answers `currentView` (`App.tsx:2190`); the transport mock gains `saveProject` (`src/skp/client.ts:155`), answering with `history_mark: "withheld"` and a `project_relative` that adds no notice; a save through the `e2eSaveProjectToFolder` hook (`App.tsx:1454-1462`) gives exactly `[SAVED_NOTICE, MARK_WITHHELD_NOTICE]` (`src/project/saveProject.ts:115-117`): the strip's top is the `.save-notice` holding `SAVED_NOTICE`, S-3 reads 1, and Problems' other row is the `.save-notice` holding `MARK_WITHHELD_NOTICE` | App dispatches one `replaceBatch` per notice at `:2193`; {C-A6} |
````

4. **E-3, Fix 3:** its row in the tests table.

Old:

````text
| C-A5 | `src/App.conditions.test.tsx` |
````

New:

````text
| C-A6 | `src/App.conditions.test.tsx` | no store; as drafted, the second notice's raise ends the first | one `replaceBatch` per notice at `:2193`; {C-A6} |
| C-A5 | `src/App.conditions.test.tsx` |
````

5. **D-5, first replacement:** the reasoning about the top at the cap.

Old:

````text
A raise that is not kept is newer than every kept condition.
````

New:

````text
Until a kept condition is dismissed, a raise that is not kept is newer than every kept condition.
````

6. **D-5, second replacement.**

Old:

````text
If the operator dismisses every kept refusal while one that was not kept would still stand, the strip shows a notice or nothing.
````

New:

````text
A dismissal frees a place, so a later raise can be kept while an earlier one was not. If the operator then dismisses every kept refusal older than one that was not kept, the strip shows a newer refusal, a notice or nothing where that refusal would have been the top.
````

7. **D-6, first replacement:** `replaceBatch` takes the route's code.

Old:

````text
Its owner's report is one `replaceBatch(route, target, generation, displays)` event.
````

New:

````text
Its owner's report is one `replaceBatch(route, code, target, generation, displays)` event, `code` being the route's typed code (`step-record-<kind>` from `report.kind`, `App.tsx:878`, or `project.save_notice`).
````

8. **D-6, second replacement.**

Old:

````text
`replaceBatch(save-notice, resource, R, [a, b])`
````

New:

````text
`replaceBatch(save-notice, project.save_notice, resource, R, [a, b])`
````

9. **D-6, third replacement.**

Old:

````text
`replaceBatch(save-notice, resource, R, [])`
````

New:

````text
`replaceBatch(save-notice, project.save_notice, resource, R, [])`
````

10. **D-7:** item 8's reach.

Old:

````text
S-1 to S-13 and KL-A to KL-E stay drafts and are built under the placeholder mark.
````

New:

````text
S-1 to S-12 and KL-A to KL-D stay drafts and are built under the placeholder mark (item 8); this amendment holds S-13 (Amendment 2) and KL-E (below) to the same, as item 8 does not name them.
````

11. **§7 is not edited.** C-A6 adds about 30 lines to App.conditions, recorded as class 8 at the count in PR A's closing amendment (ADV-2026-11-23-17 item 12), as the gate says.
12. **KL-E** stays a draft for the advisor. The gate finds one of its sentences untrue as drafted, since the 64th place is held for an ended session; it is not reworded here.
13. Next: the architect's form gate, attempt 4, on this amendment. No code is written before it ends PASS or PASS WITH NOTES.

Read the last amendment first.

Nothing above is edited.

## Amendment 7 — 2026-11-23 — the custodian's, after the architect's form gate, attempt 4 (PASS WITH NOTES): that gate's replacement words for D-8 to D-10, carried byte for byte

*Written by the custodian before any code. It carries the attempt-4 gate's own replacement words, each copied by script from the filed report in the report's order; it words nothing of its own but where each goes and what follows.*

1. Evidence: the architect's form gate, attempt 4, PASS WITH NOTES (`state/consults/gates/2026-11-23-shell-migration-milestone-5-form-gate-architect-attempt-4.md`, gate-log row 879; the hand-back's sha256 bb740e4c0f512505000f796c9fc4f0f01b844e460488566b9c723abf06e214ae). It has no Correctness and no Evidence finding. Its three Documentation findings, D-8 to D-10, are fixed before the merge, and none asks for another attempt (ADV-2026-11-21-20). Each Old text below occurs once in the form above this amendment, no two overlap, and each New text occurs nowhere above it.

2. **D-8, first replacement:** the reasoning about the top at the cap (Amendment 6 item 5's New text).

Old:

````text
Until a kept condition is dismissed, a raise that is not kept is newer than every kept condition.
````

New:

````text
Until a kept condition ends (by a dismissal, its owner's clear or its owner's replacement), a raise that is not kept is newer than every kept condition.
````

3. **D-8, second replacement** (Amendment 6 item 6's New text).

Old:

````text
A dismissal frees a place, so a later raise can be kept while an earlier one was not. If the operator then dismisses every kept refusal older than one that was not kept, the strip shows a newer refusal, a notice or nothing where that refusal would have been the top.
````

New:

````text
A condition that ends frees a place, so a later raise can be kept while an earlier one was not. If every kept refusal older than one that was not kept then ends, by the operator's dismissal or, for a viewport refusal, its owner's clear (`App.tsx:1613`), the strip shows a newer refusal, a notice or nothing where that refusal would have been the top.
````

4. **D-9:** the null-answering picker (Amendment 6 item 2's New text).

Old:

````text
the harness reaches no folder picker that answers `null` without mocking `skp/dialog`, which it does not mock (I5).
````

New:

````text
a folder picker that answers `null` needs a mock of `skp/dialog` or of `project/saveProject`'s `pickProjectFolder` (as `App.save.test.tsx:69-75` has), and this piece's App tests mock neither (I5, form §4's "What may be mocked").
````

5. **D-10:** §2.5 seam 1, as Amendment 4 replaced it.

Old:

````text
and in the real app by C-E2. The canvas-ceiling route is proven
````

New:

````text
and in the real app by C-E2. The save-notice route's batch is proven from the real App by C-A6, and its empty batch at store level only (C-U8). The canvas-ceiling route is proven
````

6. **KL-E** stays a draft for the advisor, with the gate's reading of each sentence and the leftover case at the top it names. It is not reworded here.
7. Next: the build of PR A. It shares `frontends/shell/src/App.tsx`, `frontends/shell/src/canvas/WorkingCanvas.tsx`, `KNOWN-LIMITATIONS.md`, `frontends/shell/e2e/README.md` and `frontends/shell/MANUAL-WALKTHROUGH.md` with colour-by-refill, whose build started before this gate ended; under ADV-2026-11-23-17 item 11 it does not build while that build changes them, and its base is put to the advisor. Nothing of it builds, tests or starts the app from 05:00Z on 2026-11-24 until the sitting is over.

Read the last amendment first.

Nothing above is edited.

## Amendment 8 — 2026-11-23 — the custodian's: S-5 and its {n}, as ADV-2026-11-23-30 rules them

*Written by the custodian before PR A's code, as the advisor's ruling ADV-2026-11-23-30 item 4 asks (`state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-30-milestone-5-strings-s-1-to-s-13-and-kl-a-to-kl-e-worded-s-5-counts-occurrences-recorded-before-pr-a.md`). It is a string and its number, so no further attempt of the form's gate is asked (that item). It words nothing of its own: the New text is the Old text with that ruling's S-5 and its definition of `{n}`.*

1. **S-5.** The Old text occurs once in the form above this amendment, and the New text nowhere.

Old:

````text
| S-5 | `[P6 placeholder] Raised again {n} times. The latest:` | ConditionView, when `occurrences > 1`; `{n}` is `occurrences − 1` (ADV-2026-11-23-17 item 9) |
````

New:

````text
| S-5 | `[P6 placeholder] Raised {n} times in all. The latest:` | ConditionView, when `occurrences > 1`; `{n}` is `occurrences` (ADV-2026-11-23-30 item 1, which replaces the definition of ADV-2026-11-23-17 item 9) |
````

2. The line is shown when `occurrences > 1`, so `{n}` is 2 or more (that ruling's item 1). The placeholder mark stays as the form has it. The other strings and KL-A to KL-E are built in that ruling's words; the build's gates check each clause by clause against the code, and the advisor compares each byte for byte at the merge check (its item 4).

3. Next: PR A, built on colour-by-refill's head by a merge commit once that branch's commit 5 is pushed and green (ADV-2026-11-23-25 item 1, `state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-25-pr-a-on-colour-by-refills-head-item-11-refined-records-commits-in-the-sitting-with-the-read-only-checks.md`). Nothing of it builds, tests or starts the app from 05:00Z on 2026-11-24 until the sitting is over.

Read the last amendment first.

Nothing above is edited.

## Amendment 9 — 2026-11-23 — the custodian's, under ADV-2026-11-23-37: three existing tests join PR A's Scope (class 9), the three N8 assertions re-aimed, KL-B and KL-C with PR B

*Written by the custodian before more of PR A's code, as the advisor's ruling ADV-2026-11-23-37 item 2 asks. It holds that ruling by reference and words none of its conditions. No further attempt of the form's gate is asked (its item 6).*

1. **Authority.** The advisor's ruling ADV-2026-11-23-37 (`state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-37-milestone-5-pr-a-three-n8-assertions-re-aimed-under-six-conditions-2-2-unchanged-three-tests-in-scope-kl-b-and-c-with-pr-b.md`), under the human's delegation of 2026-11-13; it is not the human's words. The evidence it rules on is the build worker's report to its stop (`state/consults/2026-11-23-shell-migration-milestone-5-pr-a-build-worker-report-stop-1.md`): at head `021d125a0874e9f24fd8b8d7fa778e325eb2a9b1` on `cut/shell-migration-milestone-5-pr-a`, base `6bc401267d2ea4532215397b79264869b4c83570`, three existing tests outside §2.6's list fail with PR A's change, and one of them also fails `tsc`.
2. **Scope, class 9, declared before their code.** PR A's Tests (§2.6) gain three existing files:
   - `frontends/shell/src/App.table.test.tsx`: the expected list of Activity's tabs gains Problems, which is §2.3's own change (that ruling's item 2).
   - `frontends/shell/src/App.test.ts`: the source-text pin on the line the design replaces moves to the line that replaces it, and still pins a line of product code (that ruling's item 2). No other line of the file changes.
   - `frontends/shell/src/App.lateResult.test.tsx`: the two calls of `onCanvasRefusal` that the form now makes take a kind pass it (that ruling's item 4); the three N8 assertions that read the first `.canvas-refusal` are replaced under that ruling's item 3, conditions (a) to (f), as written there.
3. **H5 (§5).** H5 holds that `App.test.ts` stays green and unedited. Under item 2 above it is edited at the one pin, so the word unedited no longer holds for that line; the rest of H5 stands, and the helpers it names keep their signatures. The closing amendment pins this as superseded for that line.
4. **§7.** The three files' lines are counted in PR A's count under A-T, which names no ceiling for them; §7 is never edited. The build reports each file's lines, and an overrun of PR A's 3,094 is class 8, recorded in the closing amendment.
5. **Mutations.** Item 3 (e) of that ruling (one mutation for each replaced assertion) and item 3 (f) (the three guard mutations named in those tests' comments, observed again at PR A's head, as dated lines beside the lines of 2026-09-23) are recorded by name with their commit in the build report and in the closing amendment.
6. **KNOWN-LIMITATIONS.** KL-A, KL-D and KL-E land with PR A; KL-B and KL-C, which describe Jobs, land with PR B (that ruling's item 5). No word of ADV-2026-11-23-30 changes.
7. **Next.** The build of PR A goes on from `021d125a0874e9f24fd8b8d7fa778e325eb2a9b1` with the worker's saved change, before 04:30Z on 2026-11-24; nothing of it builds, tests or starts the app from 05:00Z until the sitting is over. If a condition of that ruling's item 3 cannot be met as written, the build stops again and the advisor is told (its item 6). PR A's build gates read the three files and item 3's conditions with the rest of the diff.

Read the last amendment first.

Nothing above is edited.

## Amendment 10 — 2026-11-24 — the custodian's, under ADV-2026-11-24-03, ADV-2026-11-24-04 and ADV-2026-11-24-06: references only

*Written by the custodian before any code of ADV-2026-11-24-03 item 2 and ADV-2026-11-24-04 item 2. It holds the rulings by reference and words nothing of its own.*

1. **Authority.** The advisor's rulings ADV-2026-11-24-03 (`state/directives/2026-11-24-advisor-ruling-adv-2026-11-24-03-milestone-5-pr-a-replacing-the-unfiled-02-the-gates-start-q1-b-both-stops-removed-per-guard-q2-the-659-comment-q3-both-pins.md`), which replaces ADV-2026-11-24-02 (not filed; the same ruling), ADV-2026-11-24-04 (`state/directives/2026-11-24-advisor-ruling-adv-2026-11-24-04-milestone-5-pr-a-the-reviewers-fail-c-1-red-then-green-e-1-a-post-result-re-sweep-at-the-base-s-5-unmarked-attempt-2-narrow.md`) and ADV-2026-11-24-06 (`state/directives/2026-11-24-advisor-ruling-adv-2026-11-24-06-milestone-5-pr-a-the-reviewers-d-2-applied-to-the-comments-c-u1-checked-by-one-run-after-the-fix.md`), under the human's delegation of 2026-11-13; they are not the human's words. ADV-2026-11-24-03 answers the custodian's three questions on PR A's build at 12a9aa9853b25f88deb79c6cc8af1843537f1d37, whose report is `state/consults/2026-11-24-shell-migration-milestone-5-pr-a-build-worker-report-2.md`. ADV-2026-11-24-04 rules on the reviewer's build gate, attempt 1, at 12a9aa98 (FAIL, gate-log row 892, `state/consults/gates/2026-11-24-shell-migration-milestone-5-pr-a-build-gate-reviewer.md`), and ADV-2026-11-24-06 reads its item 5 for the gate's D-2.
2. **ADV-2026-11-24-03 item 2.** X-1 and X-2 get dated comment lines beside their lines of 2026-09-23 in `frontends/shell/src/App.lateResult.test.tsx`, a file this form's Scope already holds (Amendment 9); this is the one Scope line its item 2 names, comments only. For each of G-1, G-2, X-1 and X-2, one observation with both stops removed is recorded as its item 2 says, and a removal of both that does not fail is a stop to the advisor.
3. **The store's line.** For the same item, the piece's own test and mutation that pin `conditions.ts:140` at 12a9aa98 (the generation drop in `raise`) are C-U6a and its RECORDED MUTATION in `frontends/shell/src/conditions/conditions.test.ts`, whose OBSERVED line records a failure at a17db128. The closing amendment names them.
4. **ADV-2026-11-24-03 items 3 to 5.** The one-line class-3 correction of the comment at `App.lateResult.test.tsx:659` at 12a9aa98 (item 3); item 2 of ADV-2026-11-23-37 covers both moved pins in `App.test.ts` (item 4); the three files over their own section 7 figures are class 8 in the closing amendment, and section 7 is not edited (item 5).
5. **ADV-2026-11-24-04 item 2, the fix of C-1.** Class 9, inside the Scope of `frontends/shell/src/App.conditions.test.tsx`, built together with item 2 of ADV-2026-11-24-03, as that item says: the new App-level test, its red run at 12a9aa98 and its green run after the fix, both recorded, its one mutation, and C-U8 kept as the store's own test.
6. **ADV-2026-11-24-06, the gate's D-2.** The two replacements of the reviewer's D-2 are applied to the comments in `conditions.test.ts`, class 3 inside the Scope; C-U1's is checked by the one run that ruling's item 2 names, at the head that holds the fix, and a run that does not show the reviewer's words is a stop to the advisor.
7. **ADV-2026-11-24-04 items 3 to 7.** The re-sweep of section 0.3 is made by reading at the base 6bc40126, filed as a post-result amendment, and compared with what was built (item 3); S-5 carries no placeholder mark (item 4); D-1, D-3, D-5 and D-6 go into the closing amendment with the reviewer's words (item 5); attempt 2 of the reviewer's gate is narrow (item 6); the fix and its runs end by 04:30Z or wait until after the sitting, and PR A stays a draft until attempt 2 has passed (item 7).

Read the last amendment first.

Nothing above is edited.

## Amendment 11 — 2026-11-24 — post-result amendment: the section 0.3 re-sweep for PR A, made by reading at the base 6bc40126 after PR A's code (ADV-2026-11-24-04 item 3)

*Written by the custodian. References only.*

1. **The code existed when this re-sweep was made.** PR A's build was dispatched without the section 0.3 re-sweep. That was the custodian's miss, and it is the reviewer's E-1 (gate-log row 892). So the re-sweep is filed after the result, as ADV-2026-11-24-04 item 3 orders, and it is not a declaration before code.
2. **How it was made.**
   - The architect made it (node:shell-migration-milestone-5@pr-a-re-sweep-architect-1), an agent that did not build PR A.
   - It worked by reading alone. It read the code at 6bc40126 from that tree, and the form at f0718827 (its body and Amendments 1 to 8).
   - Its brief held no PR A diff. Its transcript shows no read of the branch, of the build worktree, of PR A's reports or of this form's later amendments.
   - Report: `state/consults/2026-11-24-shell-migration-milestone-5-pr-a-re-sweep-at-the-base-architect.md`.
3. **What it records**, by reference to that report's parts 1 to 5:
   - the section 0.2 interfaces: no code interface changed, and the moved cites are listed; two records facts also differ (the walkthrough's last Part is AE, not AD, and item 75 is at line 556);
   - the declared selector list: the eleven suites of section 2.6, and `App.layout.test.tsx`; `App.streamFailure.test.tsx` holds no strip read;
   - by its reading, Part AF and items 77 to 79 for PR A, with its open questions;
   - by its reading, the row-filter paragraph bears on PR B's Jobs row only;
   - the e2e runs at the base: not run here, and the suites they will be. ADV-2026-11-24-04 item 3 places them after the sitting, before any e2e run at the head.
4. **Beyond its brief**, its part 2 names strip reads in five unit-test files outside section 2.6's lists. They are carried to the comparison.
5. **Next: the comparison** (ADV-2026-11-24-04 item 3).
   - Each interface or selector that PR A changed and the form did not name goes to the advisor with the architect's reading.
   - The three test files of ADV-2026-11-23-37 are named as found late.
   - PR B's re-sweep is made before PR B's code.

Read the last amendment first.

Nothing above is edited.

## Amendment 12 — 2026-11-24 — the architect's, class 9 before code: C-E1 and C-E2 step 4 fail at the bound (ADV-2026-11-24-14 item 4), the store's re-raise guard (item 6), the N8 test (ADV-2026-11-24-09 item 4)

*Written by the architect before any code of the changes it declares and before any run of C-E1 or C-E2. Every "`path`, line N at 806ad308" below is read at 806ad30843269f8012ec1d89f0224703a8078ad7 on `cut/shell-migration-milestone-5-pr-a`, a branch commit; no span is pinned by hash.*

1. **Authority.** The advisor's rulings ADV-2026-11-24-14 (`state/directives/2026-11-24-advisor-ruling-adv-2026-11-24-14-milestone-5-pr-a-part-af-approved-af0a-read-back-q1-a-for-both-suites-a-narrow-read-a-store-guard.md`), items 4, 6 and 9, and ADV-2026-11-24-09 (`state/directives/2026-11-24-advisor-ruling-adv-2026-11-24-09-milestone-5-pr-a-after-adv-2026-11-24-07-no-stop-c-u4-the-pin-x-2-found-g-1-and-g-2-a-new-n8-test-after-the-sitting.md`), item 4, and ADV-2026-11-24-16 (`state/directives/2026-11-24-advisor-ruling-adv-2026-11-24-16-milestone-5-pr-a-amendment-12-as-drafted-q1-both-mutations-q2-all-words-q3-s-4-q4-the-real-apply.md`), items 1 to 5 and 7, which answers the draft's four questions, under the human's delegation of 2026-11-13; they are not the human's words. The evidence is the architect's build gate, gate-log row 898 (`state/consults/gates/2026-11-24-shell-migration-milestone-5-pr-a-build-gate-architect.md`): check 3 case 3, ER-1 with Q1, and D-4. All three changes are class 9 and inside the Scope (§2.6 as Amendments 2 and 9 widen it). Neither suite has run, so items 2 and 3 are changes before any result. Every run waits until the human says the sitting is over (ADV-2026-11-24-14 item 9); the N8 test is added after the sitting (ADV-2026-11-24-09 item 4).

2. **C-E1 step 4 as it becomes** (`frontends/shell/e2e/conditions-baseline.mjs`, lines 155-165 at 806ad308). Steps 1 to 3 and the start of step 4 are unchanged: S-3 opens Problems, Dismiss, the reopen, and a reopen that is not admitted ending the run VOID (line 163).
   - **The wait.** After the reopen is admitted, the step reads the strip and Problems (`read`, lines 86-102) every 200 ms, within `WAIT_TIMEOUT_MS` (90,000 ms, line 38; a harness bound on readiness, not a timing), until no `.canvas-session-ended` stands. This wait throws no `Void`, so `waitFor` (lines 56-69) is not used for it.
   - **FAIL at the bound.** If the old session's block still stands at the bound, the step records a FAIL with the last reading and ends. It does not end VOID. The hash check (lines 167-169) still runs, and the run exits 1.
   - **The passing readings,** judged on the first reading in which the block is gone:
     - (i) S-4: Problems' text holds S-4, the strip is hidden, Problems has no row, and no `.canvas-refusal` that is not a notice and no `.canvas-session-ended` stands (line 165's checks);
     - (ii) the new open's refusal: the strip's top element carries `canvas-refusal`, it is the one such refusal in the DOM, the strip carries no S-5 line (`.condition-occurrences`), and Problems' rows are exactly one, the top's row (`problem-row-top`, no owner class, S-10's text).
   - **Any other reading FAILS.**
   - **The no-`Raised`-line clause is kept.** By reading, the new open cannot raise the refusal twice without a pan:
     - Each open mounts a fresh canvas (`frontends/shell/src/App.tsx`, line 2433 at 806ad308).
     - The baseline open issues one query of its own, the first look (`App.tsx`, line 2087 at 806ad308). Any other query comes through the debounce from the canvas's `onViewportChanged` (`App.tsx`, lines 2064-2076 and 2507 at 806ad308).
     - The canvas calls `onViewportChanged` only through `reportViewport` (`frontends/shell/src/canvas/WorkingCanvas.tsx`, lines 1116-1119 at 806ad308). A resize asks for an area only once one has been asked for (lines 2123-2126), and a fresh canvas has asked for none (line 1113). A view shown by the auto-fit issues no query (`App.tsx`, lines 2452-2454 at 806ad308).
     - Within the first look's one stream, `pushBatch` is synchronous (`WorkingCanvas.tsx`, lines 1496-1541 at 806ad308): the refused batch calls `onCanvasRefusal` and returns (lines 1544-1554). App's handler calls `cancelStream` in the same turn (`App.tsx`, lines 2475 and 2493, through line 673, at 806ad308). `cancelStream` drops the stream as current before its first await (`frontends/shell/src/streaming/viewportStreamManager.ts`, lines 461-467 at 806ad308), so a later batch of that stream is dropped before the canvas (lines 280-288).
     - So a second raise needs a second stream, and a second stream needs a pan. A reading whose refusal carries an S-5 line is "any other reading": a FAIL.
   - This item supersedes, for step 4, the end of §4's C-E1 row ("reopen, and both are empty"). The row is not edited.

3. **C-E2 step 4 takes the same rule for the old conditions** (`frontends/shell/e2e/conditions.mjs`, lines 155-159 at 806ad308). Steps 1 to 3 and a reopen that is not admitted ending the run VOID (line 157) are unchanged.
   - **The wait.** After the admitted reopen, the step reads every 200 ms, within `WAIT_TIMEOUT_MS` (60,000 ms, line 39; a harness bound), until no `.canvas-session-ended` and no `.save-notice` stands.
   - **FAIL at the bound.** If session ended or the save notice is still shown at the bound, the step records a FAIL and ends, not VOID. The hash check (lines 161-163) still runs.
   - **The passing reading** is S-4: Problems' text holds S-4 and line 159's checks hold. Reading (ii) of item 2 is not taken here, because canvas-ceiling is a baseline-only route (Amendment 2, E-1.0).
   - **Any other reading FAILS.**
   - This item supersedes, for step 4, the end of §4's C-E2 row ("reopen the copy, and S-4 shows"). The row is not edited.

4. **D-4's words, following the suites as amended.** Each Old text is byte for byte from the file at 806ad308.

   (a) `frontends/shell/e2e/conditions-baseline.mjs`, line 16 at 806ad308.

Old:
````text
//   4. S-3 opens Problems; Dismiss the canvas refusal; reopen the copy, and both the strip and Problems are empty (S-4 shows).
````
New:
````text
//   4. S-3 opens Problems; Dismiss the canvas refusal; reopen the copy. Once the reopen is admitted, wait within WAIT_TIMEOUT_MS for the old session's block to go; if it still
//      stands at that bound the step FAILS. Then PASS on S-4, or on the new open's refusal as the strip's top with no S-5 line and Problems listing only the top's row; any other reading FAILS.
````

   (b) The same file, line 17 at 806ad308.

Old:
````text
// Exit 0 all PASS; 1 a check failed; 2 VOID (the arm pin, the fixture, a wait that timed out).
````
New:
````text
// Exit 0 all PASS; 1 a check failed (step 4's wait for the old session's block included); 2 VOID (the arm pin, the fixture, any other wait that timed out).
````

   (c) The same file, a span of line 5 at 806ad308.

Old:
````text
C-E1 as Amendments 2, 3 and 4 leave it
````
New:
````text
C-E1 as Amendments 2, 3, 4 and 12 leave it
````

   (d) `frontends/shell/e2e/conditions.mjs`: its header needs the same. Line 17 at 806ad308:

Old:
````text
//   4. reopen the copy, and S-4 shows.
````
New:
````text
//   4. reopen the copy. Once the reopen is admitted, wait within WAIT_TIMEOUT_MS for session ended and the save notice to go; if either still stands at that bound the step FAILS.
//      Then PASS on S-4; any other reading FAILS.
````
   Line 18 at 806ad308:

Old:
````text
// Exit 0 all PASS; 1 a check failed; 2 VOID (a precondition failed: the arm, the fixture, a wait that timed out).
````
New:
````text
// Exit 0 all PASS; 1 a check failed (step 4's wait for the old conditions included); 2 VOID (a precondition failed: the arm, the fixture, any other wait that timed out).
````
   A span of line 5 at 806ad308:

Old:
````text
C-E2 as Amendments 2 and 4 leave it
````
New:
````text
C-E2 as Amendments 2, 4 and 12 leave it
````

   (e) `frontends/shell/e2e/README.md`, the C-E1 sentence, the last sentence of line 931 at 806ad308.

Old:
````text
It clicks S-3, dismisses the canvas refusal, reopens the copy, and checks that the strip and Problems are empty.
````
New:
````text
It clicks S-3, dismisses the canvas refusal and reopens the copy. Once the reopen is admitted it waits, within the suite's bound, for the old session's block to go, and fails if the block still stands at that bound; it then passes when Problems shows S-4, or when the new open's canvas refusal is the strip's top with no S-5 line and Problems lists only the top's row, and fails on any other reading.
````

   (f) The same file, the C-E2 sentence, the last sentence of line 929 at 806ad308.

Old:
````text
It reopens the copy and checks that Problems then shows S-4.
````
New:
````text
It reopens the copy; once the reopen is admitted it waits, within the suite's bound, for session ended and the save notice to go, fails if either still stands at that bound, and then checks that Problems shows S-4, failing on any other reading.
````

   (g) The same file, a span of line 933 at 806ad308.

Old:
````text
Each exits 0 when all checks pass, 1 when one fails, and 2 when the run is VOID (the arm, the fixture, or a wait that timed out).
````
New:
````text
Each exits 0 when all checks pass, 1 when one fails (step 4's wait for the old conditions to go included), and 2 when the run is VOID (the arm, the fixture, or any other wait that timed out).
````

   None of these is the human's wording. The gate's narrow read checks them (ADV-2026-11-24-14 item 4).

5. **The store's re-raise guard, C-U6b (ADV-2026-11-24-14 item 6).**
   - **File and name:** `frontends/shell/src/conditions/conditions.test.ts`, in a new `describe` after C-U6a's (which ends at line 187 at 806ad308): `it("C-U6b: a condition raised twice, dismissed, then raised again: a new id, one occurrence, and no count carried over", …)`.
   - **Steps:**
     - `opened(R)`, then two raises of one key on the canvas-ceiling route (code `canvas.vertex_ceiling`, the view target, generation R) with two displays. This gives one condition with `occurrences` 2.
     - `dismiss` of its id: no condition stands.
     - A third raise of the same key with a third display gives exactly one condition. Its id is not the dismissed one's, its `occurrences` is 1, and its `first` and `latest` are both the third display. No `Raised` count is carried over; ConditionView shows S-5 only when `occurrences > 1` (`frontends/shell/src/conditions/ConditionView.tsx`, line 37 at 806ad308).
   - **It is a guard, green at the head.** No red run is asked.
   - **Mutation M12-1:** in `conditions.ts`'s `dismiss` case (line 179 at 806ad308), return `{ ...without(state, (c) => c.id === event.id), nextId: state.nextId - 1 }`, so that the next mint reuses the dismissed condition's id. §2.2 declares a condition's id "minted by the store, never reused in a session".
     - Expected failure: C-U6b, at its new-id assertion.
     - It is observed and recorded as one dated line beside the test (§4, "How a mutation is observed").
   - **Mutation M12-4** (ADV-2026-11-24-16 item 2): in the same `dismiss` case, `dismiss` ends nothing when the condition was raised more than once.
     - Expected failure: C-U6b, at its dismissal assertion. That is the half of the gate's check 3 case 3 that no test reached.
     - It is observed and recorded as its own dated line beside the test. A mutation that does not fail where it is predicted goes to the advisor; nothing is changed to make it fail.
   - **Declared unchanged:** every existing case of the file.

6. **The N8 test, N8-G (ADV-2026-11-24-09 item 4),** in `frontends/shell/src/App.lateResult.test.tsx`, in the baseline-arm `describe` (line 436 at 806ad308; the arm is pinned at line 452). It is a new `it` after the test that ends at line 870 at 806ad308.
   - **Name:** `it("A's late failure terminal and canvas refusal, after a reopen while B's own Apply is in flight with Cancel shown, leave B's Cancel shown (baseline arm)", …)`.
   - **Shape:** A admitted, then B admitted by a reopen, with both admissions flushed, as the item-7 probe does (lines 694-701 at 806ad308). A's `onTerminal` and A's `WorkingCanvas` props are captured as at lines 792-796.
   - **B's Apply in flight, with Cancel shown** (ADV-2026-11-24-16 item 5): B's Apply through the Filter panel's Apply button, by the pattern the file already has (`typeAndApply`, then B's second request resolved `{kind: "issued", …}`, lines 925-933 at 806ad308), not through the dev hook. The test asserts that `.filter-cancel` stands.
   - **A's late failure terminal:** `onTerminalA("a-stream-failed", { kind: "ProducerFailed", detail: "engine.upstream_failed: A's own stream" })`, the call of line 829. Then it asserts that `.filter-cancel` still stands (assertion T).
   - **A's late canvas refusal:** `canvasA.onCanvasRefusal("a-stream-ceiling", "A's own ceiling refusal", "vertex-ceiling")`, the call of line 831. Then it asserts that `.filter-cancel` still stands (assertion C).
   - **Mutations, each a dated line:**
     - M12-2: G-1's guard alone removed (`App.tsx`, line 1932 at 806ad308). It fails at assertion T.
     - M12-3: G-2's guard alone removed (`App.tsx`, line 2471 at 806ad308). It fails at assertion C.
     - With both guards in place, the test passes.
   - If either removal does not fail, that is recorded as found and goes to the advisor; nothing is changed to make it fail (ADV-2026-11-24-09 item 4, paraphrase).
   - The existing test (lines 791-870 at 806ad308) is not changed, and no assertion of the file is removed or loosened.

7. **§7.** No file outside the Scope, so no Scope addition. §7 is not edited, and any overrun is class 8 at the count, in PR A's closing amendment.
   - `conditions.test.ts` (A-T, 450): adds about 20 lines.
   - `App.lateResult.test.tsx` (in the Scope by Amendment 9; no §7 ceiling, so class 8 against 0, with its 56 of row 898): adds about 55 lines, the ten of the real Apply included (ADV-2026-11-24-16 item 5).
   - `conditions-baseline.mjs` (in the Scope by Amendment 2; no §7 ceiling, so class 8 against 0, with its 204): about 25 lines changed.
   - `conditions.mjs` (A-E, 480): about 15 lines changed.
   - Groups, against row 898's figures:
     - A-T: about 1,425 against 1,480;
     - A-E: about 440 against 620;
     - PR A: about 2,500 against 3,094.
   - `e2e/README.md` is a record, outside the count: 3 lines replaced, about 23 against its 40.

Read the last amendment first.

Nothing above is edited.

## Amendment 13 — 2026-11-27 — the custodian's: Amendment 12's unit-test parts built at d6c2daf6, no e2e run (ADV-2026-11-26-19 item 3; ADV-2026-11-27-02 item 3 (b))

*References and hashes only. Nothing above is edited. Every run of C-E1 and C-E2 still waits for port 5180.*

1. **The head** is d6c2daf69eb500027197945f5a4302f0508e0f69 on `cut/shell-migration-milestone-5-pr-a`, five commits on 806ad30843269f8012ec1d89f0224703a8078ad7 by a worker (Sonnet): items 2 to 4 in one commit (D-4's pairs copied by script, each Old found once), C-U6b, its mutations' record, N8-G, its mutations' record.
2. **The mutations,** each observed red where Amendment 12 predicts and recorded beside its test: M12-1 and M12-4 (C-U6b, its new-id and dismissal assertions), M12-2 and M12-3 (N8-G, assertions T and C).
3. **The suites at the head:** the shell's typecheck exit 0 and npm test exit 0, 1669 tests passed.
4. **What is owed:** the runs of C-E1 and C-E2 after port 5180 is free, then the reviewer's second attempt (ADV-2026-11-24-14 item 7), then piece A's code (ADV-2026-11-26-08 item 3). The identity route took this head in (its Amendment 10).

Read the last amendment first.

## Amendment 14 — 2026-11-27 — the custodian's: one line under ADV-2026-11-27-32

*References only. Nothing above is edited.*

1. **Class 2** (`state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-32-the-two-hooks-caller-lines-b-alone-brings-both-current-after-it-takes-main-in.md`, item 5): `e2e/conditions.mjs` calls the save hook `e2eSaveProjectToFolder`, and the declaration at this piece's head does not name it. The piece B (`reload-ends-the-old-pages-opens`) names the file under that ruling, and this piece does not edit the line.

## Amendment 15 — 2026-11-27 — the architect's, before PR B's code: the §0.3 re-sweep for PR B by reading at d6c2daf6; two existing tests join PR B's Scope (class 9); J-E1's start under N-2; the moved cites (class 3); App's predicted overrun (class 8)

*Written by the architect before any code of PR B and before any run of a J test. Every "`path`, line N at d6c2daf6" below is read at d6c2daf69eb500027197945f5a4302f0508e0f69 on `cut/shell-migration-milestone-5-pr-a`, a branch commit; no span is pinned by hash. It is made by reading alone: no suite was run (item 12, OPEN-B3).*

1. **Authority.** ADV-2026-11-27-37 item 6 (c) (`state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-37-the-recovery-offers-base-c1-with-b-merged-in-its-recover-open-counted-adr-037-amendment-1-the-posture-check-the-places.md`); ADV-2026-11-26-25 item 6, the finding for this part (`state/directives/2026-11-26-advisor-ruling-adv-2026-11-26-25-a-form-open-a1-to-a8-the-time-of-the-save-on-every-first-line-seven-walkthrough-spans.md`); Amendment 11 item 5 (PR B's re-sweep before PR B's code). These are the advisor's rulings under the human's delegation of 2026-11-13, not the human's words.

2. **The base** is PR A's head d6c2daf69eb500027197945f5a4302f0508e0f69 (Amendment 4 item 11; ADV-2026-11-27-37 item 6 (c)). How a later head of PR A comes in is OPEN-B3.

3. **The §0.2 interfaces PR B is written against, at d6c2daf6.** None differs in shape (no I4); the cites move (class 3):
   - `ScanState` and `isScanInFlight`: `frontends/shell/src/App.tsx`, lines 454-461 and 534-536 at d6c2daf6; `scanLivenessText`, lines 558-567.
   - FilterPanel's Cancel: `frontends/shell/src/filter/FilterPanel.tsx`, lines 28 and 120-121 at d6c2daf6.
   - App's inline Cancel handler, moved whole into `handleCancelScan` (§2.4): `App.tsx`, lines 2327-2396 at d6c2daf6; its candidate branch lines 2372-2388, its baseline branch lines 2389-2395.
   - `ExportRunReport`: `frontends/shell/src/publish/PublishPanel.tsx`, lines 33-41 at d6c2daf6; reported at lines 403-408 (prepare) and 518-521 (execute); the destination path registers no token (lines 449-453).
   - App's runs: the ref at `App.tsx` line 1283 at d6c2daf6; §2.4's two mirror sites are the set at line 1300 and the delete at line 1309; the ask's call is line 1343, inside `answerOpenAsk` (lines 1330-1347).
   - Labels: PublishPanel's Cancel and Cancelling, `PublishPanel.tsx` line 727 at d6c2daf6; the S-12 statement, `frontends/shell/src/console/surfaceRegistry.ts` line 329 at d6c2daf6; `ACTIVITY_TABS`, `frontends/shell/src/layout/contributions.ts` lines 41-46 at d6c2daf6, rendered by `StudioLayout.tsx` lines 457-463, so StudioLayout.tsx is not edited.
   - The Table is shown only with its tab selected (`StudioLayout.tsx`, lines 175-176 at d6c2daf6) and its load ends when hidden (`frontends/shell/src/table/TableTab.tsx`, lines 63-67 at d6c2daf6).
   - The relinquished statement J-A1 and J-E1 compare with: `frontends/shell/src/residency/residencyStatus.ts`, line 462 at d6c2daf6.
   - Not named in the form, unchanged by PR B: the run record's `cancelChosen` and `end` (`App.tsx`, lines 138-143 at d6c2daf6) and the late-cancel statement (`frontends/shell/src/feature/OpenDuringExportAsk.tsx`, lines 26-34 at d6c2daf6).
   - I8 is read for PR B as: PR A's change is the base, not an invalidator.

4. **Declared selector list for PR B.** e2e: none (the suites read Activity's tabs by id; `e2e/layout.mjs`'s Tab walk, lines 193-224 at d6c2daf6, counts regions). Unit: `frontends/shell/src/layout/StudioLayout.test.tsx`, lines 24-42 (the `Slots` literal lacks `activity.jobs`, a `tsc` error) and line 371 (the tab list) at d6c2daf6; `frontends/shell/src/App.table.test.tsx`, line 206 at d6c2daf6 (the tab list).

5. **Scope, class 9 on the seam rule, declared before their code.** PR B's Tests (§2.6) gain two existing files:
   - `frontends/shell/src/layout/StudioLayout.test.tsx`: `NO_SLOTS` gains `"activity.jobs": null`; the tab-list case expects Jobs after Problems, with its comment. No other line changes.
   - `frontends/shell/src/App.table.test.tsx`: the expected tab list gains Jobs. No other line changes.
   - Declared unchanged for them (§5): every other case of both files.
   - **Mutation M15-1:** in `contributions.ts`, put Jobs before Problems in `ACTIVITY_TABS`. Expected failure: both tab-list assertions. Observed and recorded as a dated line beside the StudioLayout case (§4, "How a mutation is observed").

6. **§2.4 at this base, declared.**
   - The Jobs export Cancel calls `run.cancel()` once and never sets `cancelChosen`. The late-cancel statement stays the ask's alone, as its own comment says (`OpenDuringExportAsk.tsx`, lines 14-17 at d6c2daf6). An execute cancelled from Jobs that ends in a bundle anyway shows no statement in Jobs. That needs the cancel to land within one request round trip (the same comment), a case named in the JobsTab comment and not tested.
   - `handleExportRunning` and `answerOpenAsk` keep every existing line byte for byte; the mirror adds lines beside lines 1300 and 1309 at d6c2daf6. The recorded mutations of `App.selection.test.tsx` name lines there (line 1103 at d6c2daf6).
   - S-2, S-7, S-8, S-9 and S-11 (ADV-2026-11-23-30 item 1) live in `jobs.ts`, copied by script from the ruling; `contributions.ts` imports S-2 from it. No constants file is added.
   - On the shipped arm the scan row shows S-8 alone: the candidate session dispatches only `issued` and `reset` (`candidateArmSession.ts`, lines 624-633 at d6c2daf6), for which `scanLivenessText` is null. The liveness text reaches the row on baseline only; J-R1 covers the digit clause.

7. **Tests.** The J rows are §4's as Amendment 2 leaves them, with each one mutation there. Three declarations, no row edited:
   - **J-A1 and J-A2's harness.** The PublishPanel stand-in keeps the `onExportRunning` that App passes, as `App.table.test.tsx` does (lines 97-102 at d6c2daf6). The test calls it with a report of `ExportRunReport`'s real shape. The module is already mocked by the harness, so this is not I5. J-A2 observes "releases the consumer" through the Table's first scope, which issues again once `ended` resolves, as the table suite observes `exportHeld`; it does not use a spy.
   - **J-E1's start, under N-2 (Amendment 4).** In place of the pan (H6), the step waits for the settle and applies the slow predicate through the Filter panel, as `e2e/filter-panel.mjs`'s FIND' does on the shipped arm (lines 304-334 at d6c2daf6). It then waits for `button.filter-cancel` and the Jobs scan row, and goes on as Amendment 2's J-E1 row. Why: FIND' shows that the predicate's scan of the 4,000,000-feature fixture runs long (its bound, lines 336-349 at d6c2daf6), while a fill after a pan has no recorded duration. H6 is then not tested; it is neither confirmed nor refuted. Operator step 4 already filters (Amendment 2, E-1 item 5). Any status other than the statement at `residencyStatus.ts` line 462 at d6c2daf6 FAILS the step.
   - **J-E2.** If the export row is gone before the click, the run is VOID (exit 2), never a PASS, as `e2e/admission-remediation.mjs` reports a fast open (line 655 at d6c2daf6).

8. **§7, not edited.** Predicted at the count:
   - B-P: jobs ~110 (120), JobsTab ~150 (170), contributions ~3 (5), surfaceRegistry ~2 (6), styles.css ~30 (40) and package.json 1 (1) hold. **App ~185 against 150, class 8:** the 70-line move counts about 140 under numstat, as the form gate's attempt 1 named it under "Ceiling risk", plus the mirror, the slot and the imports.
   - B-T: jobs.test, JobsTab.test and App.jobs.test within 260, 230 and 400. The two files of item 5 have no ceiling of their own, so their ~6 lines are class 8 against 0 (as Amendment 12 item 7 reads such files).
   - B-E: jobs.mjs within 420 plus 60.
   - PR B: about 1,850 against 1,862. Any overrun is class 8 in PR B's closing amendment.
   - Records, outside the count: walkthrough ~14 of 120, e2e/README ~6 of 40, KNOWN-LIMITATIONS ~6 of 50 (OPEN-B2 (b) adds ~5).

9. **KNOWN-LIMITATIONS.** KL-B and KL-C land with PR B (Amendment 9 item 6), in ADV-2026-11-23-30 item 2's words, at the numbers of item 10. Each has a source comment naming, by symbol, where the code does each clause. The build's gates check each clause, and the advisor compares the words byte for byte at the merge check.

10. **Part and numbers.** Part AF, rows AF4 and AF5 before AF6, and their Result log lines before AF6's (`frontends/shell/MANUAL-WALKTHROUGH.md`, lines 2075 and 2091 at d6c2daf6), from §9's steps 4 and 5 as Amendment 2 leaves step 4. AF6 gains S-2, S-7, S-8, S-9 and S-11. The S-12 row text that AF6 shows changes to the widened tab list. KL-B's and KL-C's numbers are the next unused under rule (00a) over the base and every unmerged branch, named by the custodian by script at this amendment's filing and checked again before their commit.

11. **The row-filter paragraph (§9a).** No note is added. Its correction speaks of v0.1.0. At d6c2daf6 a tile dropped on a refused mint ends its work (`frontends/shell/src/streaming/tileViewportStreamManager.ts`, lines 1004-1007 and 1032-1036; `candidateArmSession.ts`, lines 1083-1086 at d6c2daf6). The Jobs scan row uses FilterPanel's predicate exactly. Limit: other paths were not traced.

12. **OPEN-B1 to OPEN-B4** go to the advisor with this amendment. No code of OPEN-B1 (b) or (c), or of OPEN-B2 (b), before its ruling (I7). Under OPEN-B1 (b), the scope additions there are declared by this item and bind only on that ruling.

Read the last amendment first.

Nothing above is edited.

## Amendment 16 — 2026-11-28 — the custodian's: ADV-2026-11-27-42 carried (OPEN-B1 to OPEN-B4), the KNOWN-LIMITATIONS numbers named

*References only. Nothing above is edited.*

1. **Amendment 15** is the architect's, appended byte for byte from its draft `state/drafts/2026-11-27-shell-migration-milestone-5-second-part-pr-b-form-on-pr-a-head-architect-draft.md`: the text between the two four-backtick fences of its section 2 (9600 bytes with its final newline, sha256 2c7849ce3c95ae4d8c6a8c4d79d4cbf712c1dced92611dab7f1dc0190191b73a). Its cites are read at d6c2daf6, a branch commit, as its italic line says.
2. **ADV-2026-11-27-42** is filed at `state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-42-milestone-5-second-part-open-b1-b-in-pr-b-open-b2-b-in-the-advisors-words-open-b3-b-open-b4-a-amendment-15-appended-as-drafted.md`. Its words are the advisor's under the delegation of 2026-11-13, not the human's.
3. **OPEN-B1: (b), in PR B** (item 1). Within urgency 3 only, the notices of the route raised most recently come first, and each route keeps its own raise order. It is class 9 on that ruling, declared before code:
   - Scope: `frontends/shell/src/conditions/conditions.ts`; the new case C-U2b in `frontends/shell/src/conditions/conditions.test.ts`; one App test from the real App in `frontends/shell/src/App.conditions.test.tsx` (an open of a project that raises a notice, then a save, and the top is the save's first line).
   - Mutations: plain `seq` order fails C-U2b; newest first for every urgency fails C-U2 and C-U2b.
   - Ceiling: 1,862 plus the about 80 lines this adds (about 10, 30 and 40), so 1,942, and at most 1,950. That is not class 8. The overrun predicted for App's own row (Amendment 15 item 8) stays class 8 at the count.
   - The shared path `App.conditions.test.tsx` is met by the order: the a-second-save piece merges first, and PR B then takes main in by a merge commit with the reviewer's narrow read of that file.
   - The reviewer's read part says whether S-10 and KNOWN-LIMITATIONS items 77 to 79 at the base are still true under the new order.
4. **The KNOWN-LIMITATIONS numbers** (Amendment 15 item 10; rule (00a)). By script, the highest item number is 80, on cut/shell-scale-display, the only ref with it. It is 75 on main and 79 at PR A's head, and no other unmerged branch has an item above 79 (52 branches read). So KL-B is item 81, KL-C is item 82, and OPEN-B2's new item (item 2 of the ruling, NN) is item 83. The numbers are checked again before their commit.
5. **OPEN-B2: (b).** Item 83 is the advisor's words in the ruling's item 2, by reference, with NN as 83. Its source comment is the worker's, in the form of items 77 to 79. The build's gates check each clause against the landed code, and a clause the code does not meet goes to the advisor before the words are committed.
6. **OPEN-B3: (b)** (item 3). PR B's code and its vitest runs go ahead inside holds while the port is held. Its base runs come at the port before any J-E run. A later head of PR A comes in by a merge commit with the reviewer's narrow read, recorded by amendment.
7. **OPEN-B4: (a)** (item 4). KL-C stands as ruled. The case of a row that still reads Cancel after the ask's choice is named in KL-C's source comment, in the worker's words.
8. **Next** (items 5 and 6): the reviewer's form gate reads Amendments 15 and 16 alone, before code. Then PR B's code starts on d6c2daf6 when a place is free. Its build gates run in two parts. Its base runs and J-E runs go to the end of the port order, after E-SCALE. It merges after the a-second-save piece, and its pull request stays a draft until PR A is on main.

Read the last amendment first.

## Amendment 17 — 2026-11-28 — the custodian's: the reviewer's form gate (FAIL on E-1), its corrections, the shared paths met, item 83 to the advisor

*The reviewer's corrections and references. Nothing above is edited.*

1. **The reviewer's form gate** on Amendments 15 and 16 (ADV-2026-11-27-42 items 5 and 6), at main 9fca8614 and PR A's head d6c2daf6: FAIL, filed at `state/consults/gates/2026-11-28-shell-migration-milestone-5-pr-b-form-gate-reviewer.md` (its hand-back's sha256 4304e34d43d4559d77d9faae3ec35802088f4aface0af32d449a43eef9de5556). It has no Correctness finding, one Evidence finding (E-1, on the architect's words in Amendment 15 item 7) and Documentation findings D-1 to D-7. Each correction changes the form only and applies with no re-gate (§31). Items 2 to 8 are the reviewer's words, not the human's or the advisor's, copied by script from that report, with its escaped backticks written as backticks.
2. **E-1** (for Amendment 15 item 7's "Why"): Amendment 15 item 7's "Why" cites a bound as a duration: FIND' (`frontends/shell/e2e/filter-panel.mjs`, lines 304-349 at d6c2daf6) waits up to 30 s for Cancel to appear and up to 180 s for the scan to end, and records no duration. The one measurement is the fixture's own (`kernel/tests/manual_walkthrough_fixtures.rs`, lines 677-694 at d6c2daf6): 962.5 ms to the first batch in the engine alone, a lower bound on the app's scan. Whether the Jobs Cancel is clicked before that scan ends is not established before J-E1 runs, and a fill after a pan has no recorded duration either.
3. **D-1:** §7's count for PR B reads `<base>` as d6c2daf6 until PR B's first merge commit, and from then as the commit its last merge commit took in (a later head of PR A, or main), so no line that came in by a merge is counted.
4. **D-2** (for Amendment 16 item 3's ceiling bullet; the reviewer's reading of ADV-2026-11-27-42 item 1 is taken): The three files of item 3 have no §7 ceiling of their own: their lines are "the lines this adds" (ADV-2026-11-27-42 item 1) and are not class 8 against 0; the count is read against 1,862 plus those lines, never above 1,950, and 1,942 is the prediction.
5. **D-3** (for Amendment 16 item 3's mutations bullet): C-U2b, before its code: after `opened(R)`, two reopen notices (ordinals 0 and 1) raised one by one, a stream-terminal refusal, then one save-notice batch of two lines; `ordered` gives the refusal, the save's two lines in their order, then the two reopen notices in theirs. The App test is C-A8: `h.reopen(openedWithNotice())`, then a save through `e2eSaveProjectToFolder`; the strip's first element is the save's first line, and Problems lists the `.reopen-notice` after the top row. Plain `seq` order fails {C-U2b, C-A8}; newest first for every urgency fails {C-U2, C-U2b}.
6. **D-4** (added to Amendment 16 item 3's opening): The order is made in `ordered` alone (`conditions.ts`), which `attentionOf` and `ProblemsTab` both call (`App.tsx` line 937, `ProblemsTab.tsx` line 16 at d6c2daf6), so the strip and Problems follow one order and S-10 holds.
7. **D-5:** Amendment 15 items 3 and 7 cite `residencyStatus.ts` line 462 at d6c2daf6: that line is `relinquishedText`'s signature, and the statement is line 463 at d6c2daf6.
8. **D-6:** Also carried by reference: ADV-2026-11-27-42 item 1's last sentence, item 2's last bullet and item 6's fourth bullet.
9. **D-7, the shared paths the amendments do not name** (that report's check 5), each met as ADV-2026-11-27-42 item 1 meets `App.conditions.test.tsx`:
   - With cut/shell-scale-display (PR 368): `layout/contributions.ts`, `layout/StudioLayout.test.tsx`, `styles.css` and `App.tsx`. PR 368 merges before PR B, and PR B then takes main in by a merge commit with the reviewer's narrow read of those files.
   - With cut/a-second-save-is-announced: walkthrough Part AF. That piece merges first (Amendment 16 item 8), and the same narrow read covers Part AF.
   - `App.tsx`, with each other branch that report names for it: whichever of PR B and that branch merges second takes main in by a merge commit with the reviewer's narrow read of `App.tsx`.
10. **KNOWN-LIMITATIONS item 83** (that report's section for the advisor): a clause of ruled text read as untrue notice by notice. It goes to the advisor unreworded, under Amendment 16 item 5. PR B's code starts; item 83's words are not committed before the ruling.
11. **Next:** PR B's code on d6c2daf6, with C-U2b and C-A8 as item 5 declares them. Its build gates run in two parts, and its pull request stays a draft until PR A is on main.

Read the last amendment first.

## Amendment 18 — 2026-11-28 — the custodian's: ADV-2026-11-28-03 filed, item 83 in the advisor's words

*References only. Nothing above is edited.*

1. **The ruling** ADV-2026-11-28-03 is filed at `state/directives/2026-11-28-advisor-ruling-adv-2026-11-28-03-milestone-5-pr-b-known-limitations-item-83-in-the-advisors-words-notices-ordered-by-kind-item-1-stands.md`. It answers Amendment 17 item 10: the reviewer is right. Item 83's words are its item 2's fence, byte for byte, in place of the fenced text of ADV-2026-11-27-42 item 2 (`state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-42-milestone-5-second-part-open-b1-b-in-pr-b-open-b2-b-in-the-advisors-words-open-b3-b-open-b4-a-amendment-15-appended-as-drafted.md`). ADV-2026-11-27-42 item 1 stands: notices are ordered by route.
2. **The rest of ADV-2026-11-27-42 item 2 stands** (ADV-2026-11-28-03 item 3): the source comment is the worker's; the build's gates check each clause of item 83 against the landed code; a clause the code does not meet goes to the advisor before the words are committed. A later piece that adds a fourth kind of notice changes the item, and that goes to the advisor.
3. **Amendment 17 item 9's first bullet** is read with ADV-2026-11-28-03 item 4: PR 368's place among the later pieces is the custodian's order, not a ruling. If PR 368 is not on main at PR B's turn, the second of the two to merge takes main in by a merge commit, with the reviewer's narrow read of each shared file.
4. **Next:** PR B's code on d6c2daf6. Item 83 lands with ADV-2026-11-28-03's words, and the advisor compares it with that file at the merge check.

Read the last amendment first.

## Amendment 19 — 2026-11-28 — the custodian's: PR B's code at e958b913, the worker's report, the read part of the build gates

*References only. Nothing above is edited.*

1. **PR B's code** is pushed at e958b913240d296b7229cd976831b205fc8adbde on cut/shell-migration-milestone-5-pr-b, four commits over d6c2daf69eb500027197945f5a4302f0508e0f69: 0d38b74c (the tests, red), 12f326aa (the code), 9a10d12d (the mutations) and e958b913 (jobs.mjs, written and never run; KNOWN-LIMITATIONS items 81 to 83; Part AF's rows AF4 and AF5). The worker's report is filed at `state/consults/gates/2026-11-28-shell-migration-milestone-5-pr-b-code-worker-report.md` (its hand-back's sha256 1591f8a1403f532b8ef82a1b874ec340a32245a35a1dfdd2f358957bbfee0c24).
2. **By that report,** `npm run verify` exited 0 at e958b913 inside a shared hold, and no app, dev server or e2e suite ran. CI at e958b913 on push: Product CI — shell and Ported notices passed. The numstat names no file under `src-tauri/` or `capabilities/`.
3. **§7 at the count** (the report's table): App.tsx is 155 against 150. That is the overrun Amendment 15 item 8 predicts, and it is recorded as class 8 in PR B's closing amendment, as that item says. The report names no other row over its ceiling. The build gates count §7 by its command.
4. **Named for the gates, not ruled here:** `jobsFrom`'s third parameter where §2.4 shows two; 12f326aa's edit of J-A2's second test after 0d38b74c, and C-A8's change after its first red; J-A1's check by the status and the row, not a spy; AF4 and AF5's words, which the report calls its draft for the human's sight.
5. **The read part of the build gates** (ADV-2026-11-27-42 item 6) starts with the architect's, dispatched at e958b913 against main 51f5e1daf1c05dc39e0d3ac94e49657f83bbe47f; its report goes to `state/consults/gates/2026-11-28-shell-migration-milestone-5-pr-b-build-gate-architect.md`. The reviewer's read part follows when a place is free. The run part comes at the port, after E-SCALE.
6. **No pull request yet:** PR A has none, and PR B's stays a draft until PR A is on main (Amendment 17 item 11).

Read the last amendment first.

## Amendment 20 — 2026-11-28 — the custodian's: the architect's build gate, the read part (FAIL), its words to the branch, D-1 to the closing amendment

*References only. Nothing above is edited.*

1. **The architect's build gate,** the read part, at e958b913 and main 51f5e1da: FAIL, filed at `state/consults/gates/2026-11-28-shell-migration-milestone-5-pr-b-build-gate-architect.md` (its hand-back's sha256 4c5e25df000cef3506fd2e57c60c1fa049d57112fc31d104fa5369afe2b230c5). It has two Evidence findings (E-1, E-2), both in test code, and seven Documentation findings (D-1 to D-7). It has no Architecture or Correctness finding. Its words are the architect's, not the human's or the advisor's.
2. **To the branch, by a worker (Sonnet), each pair copied by script from that report:** E-1 (one line of `App.jobs.test.tsx`), E-2 (three changes of `e2e/jobs.mjs` and the two pairs that follow from it), and D-2 to D-7. J-A1's recorded mutation is observed again at the correction. The gate asks for the reviewer's narrow read of the corrected test lines; the reviewer's read part, at the corrected head, makes it.
3. **D-1 goes to PR B's closing amendment,** by reference to that report: App 155 against 150, class 8; Amendment 15 item 5's two files, 7 lines against 0, class 8; `jobsFrom`'s third parameter; 12f326aa's edit of J-A2's second test; C-U2b's second mutation failing C-U3 and C-U7 as well; how §4's first text check is read; §2.2's `ordered` sentence read with Amendment 16 item 3.
4. **For the advisor's sight** (that report's item 83 section): the cap of 63 notices, which item 83 cites only for Problems. No clause is found unmet, so nothing waits on it (ADV-2026-11-28-03 item 3).
5. **Named, not this piece's:** the passage the moved block in `handleCancelScan` marks verbatim from entry 32. It moved byte for byte; the gate found no source for it under governance/ or state/.
6. **Next:** the worker's corrected head, then the reviewer's read part there. The run part comes at the port, after E-SCALE.

Read the last amendment first.
