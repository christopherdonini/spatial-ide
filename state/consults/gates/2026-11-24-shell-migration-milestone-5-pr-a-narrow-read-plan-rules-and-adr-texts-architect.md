Reviewed: cut/shell-migration-milestone-5-pr-a at 806ad30843269f8012ec1d89f0224703a8078ad7 in D:/wt/m5a, and the records at main 7a07ca1c331eba03812e8e609115c0c4179ac5aa in the read checkout D:/wt/read-1124e, read only (the custodian's filing note, 2026-11-24: the architect's narrow read of milestone 5 PR A under ADV-2026-11-24-14 item 5, node:shell-migration-milestone-5@pr-a-narrow-read-architect-1, the node's sixth architect row, a gate row of its own with its own verdict: plan section 2's rules 1, 3, 4, 5, 7, 10 and 11 and the texts of ADR-006, ADR-010, ADR-018 and ADR-021 against the head, which row 898's check 1 did not read; it only reads, so it ran in the sitting, during no build; dispatched at 2026-11-24T05:42:38Z; its run: Read 26, Grep 23, Glob 4, SubagentHandback 1, by unique call ids, 1 calls errored; model claude-opus-5-5, from 2026-11-24T05:42:58Z to 2026-11-24T05:48:25Z by its transcript; 0 calls named the main checkout; handed back once, at 2026-11-24T05:48:25Z. Filed below the rule, 12842 bytes, sha256 de8e91d14330abbbb4b244cbfc2a94b730552e51b281ad06620abf5a290d24b4, byte for byte, nothing masked, with one final newline added.)

---

Verdict: PASS WITH NOTES (cut/shell-migration-milestone-5-pr-a @ 806ad30843269f8012ec1d89f0224703a8078ad7)
Reviewed: D:/wt/m5a @ 806ad30843269f8012ec1d89f0224703a8078ad7
REPORT PATH: state/consults/gates/2026-11-24-shell-migration-milestone-5-pr-a-narrow-read-plan-rules-and-adr-texts-architect.md

This is a narrow read under ADV-2026-11-24-14 item 5. I checked plan §2's rules 1, 3, 4, 5, 7, 10 and 11, and the texts of ADR-006, ADR-010, ADR-018 and ADR-021, against the head. I checked nothing else and re-judged nothing row 898 settled. The base is 6bc401267d2ea4532215397b79264869b4c83570. "Plan" means `state/directives/SHELL-MIGRATION-PLAN-2026-10-07.md` and "form" means `governance/forms/frontends/SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md`, both read in `D:/wt/read-1124e` at main 7a07ca1c331eba03812e8e609115c0c4179ac5aa. Each head cite is at 806ad308.

All seven rules and all four ADRs hold or are not engaged. I have no Correctness, Evidence or Documentation finding, so nothing is must-fix. The two notes at the end are readings, not findings.

## The plan's rules

**Rule 1.** The plan, line 22: "1. **Components move whole.** A milestone changes behaviour only where its form says so (the 2026-09-23 direction, item (c))."
- **What engages it:**
  - App's attention markup moves into `frontends/shell/src/conditions/ConditionView.tsx`, lines 21-70. I compared it with the base markup the diff removes (the `"attention.sessionEnded"`, `"attention.canvasRefusal"` and `"attention.viewportRefusal"` slots). The classes, the `role="alert"` in the strip, the code-then-message body of the viewport refusal, and the Dismiss button on the two dismissible routes only are the same.
  - The behaviour changes at the head are these:
    - one top in the strip and the rest in Problems;
    - Dismiss on Problems rows;
    - S-5 for a repeated raise;
    - separate routes for canvas-ceiling and stream-terminal, which before shared one `canvasRefusal` state;
    - the viewport raise skipped only for a session-ended refusal (`App.tsx`, line 1657).
  - Each change is in the form's §2.2 routes table and its bullets (form lines 210-245) and in §2.3 (form lines 251-263).
- **Holds.**

**Rule 3.** The plan, line 24: "3. **Every fact display binds to the dataset on the map,** never to an open attempt still in flight (the 2026-09-23 ruling, entry 120, item 2)."
- **What engages it:**
  - `visibleFor` is called with `admitted.dataset`, where `admitted` is `selectAdmitted(workspace, view.id)` (`App.tsx`, lines 860 and 936). It keeps only conditions whose `generation` equals that resource (`frontends/shell/src/conditions/conditions.ts`, lines 208-213).
  - `opened` is dispatched only from `setAdmitted` on a successful admission (`App.tsx`, lines 1223-1226), never when an attempt starts.
  - A raise under any generation other than `current` is dropped (`conditions.ts`, line 140).
  - The reopen notices are raised after `handleAdmitted(next)` in the same callback, so their generation is current when the reducer runs them (`App.tsx`, lines 1249 and 1266-1268).
  - Refused opens are not raised into the store, so they stay in Layers (form line 159).
- **Holds.**

**Rule 4.** The plan, line 25: "4. **No new dependency.** If a form finds one necessary, that is a question for the human before any code."
- **What engages it:**
  - `frontends/shell/package.json`, lines 48-49, two `scripts` lines. Nothing changes under `dependencies` (line 58) or `devDependencies` (line 68).
  - There is no lockfile in the numstat.
  - Every import the diff adds is from `react`, `react-dom`, `vitest` or `node:` built-ins, or is a relative path.
- **Holds.**

**Rule 5.** The plan, line 26: "5. **Milestones 1 to 3 and 5 change no engine, kernel or protocol file.** They are shell-lane pieces."
- **What engages it:** all 27 numstat paths are under `frontends/shell/`, except `KNOWN-LIMITATIONS.md`.
- **Holds.**

**Rule 7.** The plan, line 28: "7. **Every new operator string is a P6 placeholder** for the human's sight."
- **What engages it:**
  - S-1, S-3 to S-6 and S-10 are in `frontends/shell/src/conditions/conditionsConstants.ts`, lines 17-26, without the mark.
  - S-12 (`frontends/shell/src/console/surfaceRegistry.ts`, line 329) keeps its `[P6 placeholder]` mark.
  - S-13 is at `surfaceRegistry.ts`, lines 242 and 251. `ConsolePanel.tsx`, line 197, shows these statements to the operator.
  - "Dismiss" is moved whole from the owner's markup, not new.
- **Holds.** The mark is left out by the advisor's ruling: ADV-2026-11-23-30 item 1 gives the strings "without the placeholder mark", and ADV-2026-11-24-04 item 4 keeps the human's sight in step 6. That sight is Part AF row AF6 (`frontends/shell/MANUAL-WALKTHROUGH.md`, line 2087). AF6 lists S-1, S-3 to S-6, S-10, S-12 and S-13, and says "None of them is the human's wording."
- Rule 7 holds as long as AF6 has not run; see note N-2.

**Rule 10.** The plan, line 35: "10. **Layout is not workspace.** Opening, moving or resizing a panel never marks anything unsaved and never becomes a history step (seam 9; decision 5 of 2026-10-07)."
- **What engages it:**
  - S-3's `revealProblems` (`frontends/shell/src/layout/StudioLayout.tsx`, lines 311-315) calls `apply` with the existing `toggle` and `selectTab` actions.
  - `apply` (lines 193-203) dispatches to the layout's own `useReducer` (line 174) and records a class-C console row through `recordLayoutAction` (lines 99-114). Nothing reaches the workspace reducer or session history.
  - Dismiss (`App.tsx`, lines 939-941) records a class-C row and dispatches to the separate conditions reducer (line 879).
- **Holds.**

**Rule 11.** The plan, line 36: "11. **No new permanent element over the map** (the 2026-09-23 direction, item (d)). Messages and status have homes outside it from milestone 1."
- **What engages it:**
  - The S-3 button is inside `section.attention-strip` (`StudioLayout.tsx`, lines 388-397). That section is a sibling of `main#region-map` (line 399).
  - In `frontends/shell/src/styles.css`, the strip has its own grid row, `grid-area: attention` (line 147, areas at lines 35-41). `.canvas-refusal` (lines 576-581) has no positioning.
  - The new rules at lines 592-616 position nothing.
  - Problems is a tab of Activity (`frontends/shell/src/layout/contributions.ts`, line 45).
- **Holds.**

## The ADRs

**ADR-006.** What the form asks (form line 484): view state only, and the export cancel stays class 3.
- **Its words:**
  - `docs/adr/ADR-006-lineage-undo-side-effects.md`, line 16: "| **Workspace mutations** | feature/style/notebook/config edits | Command/event log, transaction boundaries, MVCC or snapshots (ADR-007) |"
  - Line 17: "| **External side effects** | export file, publish map, remote DB write, network request | Audit log; explicit approval; declared **reversible / compensatable / irreversible** |"
  - Line 25: "- Undo is honest: users are never told something is revertible when it isn't. This distinction is central to trust."
- **What engages it:**
  - The condition store is a pure reducer in its own `useReducer` (`App.tsx`, line 879), outside the workspace reducer.
  - Dismiss records `canvas.dismissCanvasRefusal` or `canvas.dismissViewportRefusal` (`App.tsx`, line 940). Their statements say the click "never reaches the kernel" (`surfaceRegistry.ts`, lines 242 and 251).
  - A search of the diff finds no undo, revert or history-step wording.
  - The export cancel is PR B's and is not in this diff.
- **Holds** for what PR A touches. The export-cancel clause is not engaged.

**ADR-010 (rule 1, as the form names it at line 485).**
- **Its words:**
  - `docs/adr/ADR-010-render-frames-origins-boundaries.md`, line 17: "### 1. Coordinate spaces are discriminated types, and no untagged coordinate crosses a boundary"
  - Line 27, a sub-line span (the hash, if one is taken, is the whole line's): "A value that does not carry its space's tag does not leave the module that produced it."
- **What engages it:**
  - The new cross-module interfaces carry no coordinate:
    - `onCanvasRefusal(streamHandle, message, kind)` (`frontends/shell/src/canvas/WorkingCanvas.tsx`, lines 569 and 1547);
    - `ConditionTarget`, which is `{kind:"view", view: ViewId}` or `{kind:"resource"}` (`conditions.ts`, line 30);
    - `attentionOthers: number` (`StudioLayout.tsx`, line 126).
  - The map's key `key={admitted.dataset}` is unchanged (`App.tsx`, line 2433; no key line in the diff).
- **Holds.** See note N-1 on the form's label.

**ADR-018.**
- **Its words:** `docs/adr/ADR-018-what-cancellation-acknowledged-means.md`, lines 49-50: "**No cancellation figure may be published without naming which pair of instants it spans.** A figure" / "saying "cancellation = 37 ms" is not a figure."
- **What engages it:**
  - PR A adds no cancellable operation. The ceiling path still calls `cancelStream` unchanged (`App.tsx`, lines 662-674).
  - In operator-facing text, Part AF says "**No duration appears in any row or expected outcome**" (`MANUAL-WALKTHROUGH.md`, line 2075). AF2's `AddMinutes(2)` is a file-time argument, not a figure.
  - KNOWN-LIMITATIONS items 77-79 (lines 560-570) carry no cancellation figure and no duration.
  - The e2e README says the suites prove no timing (`frontends/shell/e2e/README.md`, the lines the diff adds at its end).
- **Not engaged** by product code. **Holds** in the records the diff adds.

**ADR-021.**
- **Its words:**
  - `docs/adr/ADR-021-row-filter-on-viewport-query.md`, lines 12-14: "below **carries forward as a binding obligation on the filter-panel cut**. Before any user-facing" / "filter UI ships, the panel must present **liveness and a working cancel affordance during" / "zero-batch filtered scans** — indeterminate progress plus a cancel that actually cancels is the"
  - Lines 162-164: "- **Cancellation is unchanged and stays a property, not a timed claim.** ADR-018's instant labels" / "  apply exactly as before; a filtered stream's cancellation reaches the producer the same way an" / "  unfiltered one does, asserted as REACHED, never as a duration."
- **What engages it:**
  - FilterPanel and `statusItems.ts` are not in the numstat.
  - The two raise sites that sit next to the scan machine still dispatch `applyScanEvent({kind:"failed"})` whether or not a condition is raised. The terminal handler does this at `App.tsx`, line 1953 (offset from the base by the diff), and the ceiling handler at lines 671-672. So the liveness the filter panel shows does not change.
- **Holds.**

## Findings

- **Correctness:** none.
- **Evidence:** none. The ruling's item 5 names the missing check, and this read makes it.
- **Documentation:** none.

**Notes (readings, not must-fix):**
- **N-1.** Plan line 12 and form line 485 attach "ADR-010 rule 1" to the keyed remount. The rule's text (ADR-010, lines 17-29) is about coordinate spaces and their tags, and says nothing of a remount. I checked the head against both the text and the key, and both hold. The label is in the records and outside this head, so I ask for no change.
- **N-2.** Rule 7 holds on the advisor's reading (ADV-2026-11-23-30 item 1; ADV-2026-11-24-04 item 4) that the human's sight is AF6, not a mark in the code. That holds while AF6 is still to run. If the sitting never runs AF6, rule 7's "for the human's sight" is not yet met for these strings. The ruling's item 5 does not ask me to decide this, so it is no open question.

No question goes to the advisor.

## Files read

- **Ruling:** `<S>/adv-24-14.md`, whole.
- **Row 898's report:** `<S>/report-m5a-arch-build-1.md`, lines 1-80 (its check 1).
- **Diff and numstat:** `<S>/m5a-numstat-806ad308.txt`, whole. `<S>/m5a-diff-806ad308.txt`, lines 1-85, 499-511, 1247-1671 and 2749-3056, plus searches across all of it.
- **At the head:**
  - `conditions/conditions.ts`, `ConditionView.tsx` and `ProblemsTab.tsx`, whole;
  - `App.tsx`, lines 225-265, 640-680 and 1190-1271, plus searches;
  - `StudioLayout.tsx`, lines 90-214, plus a search;
  - searches in `styles.css`, `contributions.ts`, `surfaceRegistry.ts`, `package.json` and `WorkingCanvas.tsx`;
  - a search of `src` for `.statement`.
- **In `D:/wt/read-1124e`:**
  - the plan, lines 1-60;
  - ADR-006, ADR-010, ADR-018 and ADR-021, whole, with their amendments and notes;
  - the form: lines 120-357, 477-511 and 1784-1845, plus searches for the ADRs, the rules and S-13.
- **Outside the brief's list:** two directives, needed for rule 7: `state/directives/2026-11-24-advisor-ruling-adv-2026-11-24-04-...md` and `state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-30-...md`, both whole.

**Not read:** the test files, the e2e scripts, and the rest of the form and of `App.tsx`. This read checks no mutation, no test's assertion, no run and no record cite, and none of row 898's other checks.

Model: Opus 5.5 (claude-opus-5-5).
