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
