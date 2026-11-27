Reviewed: main at b42c0ed72a8a94885bdd1f057c5c7463e5127a0e, in the detached read worktree C:/dev/wt/read-1123c (the custodian's filing note, 2026-11-23: the architect's form gate on the full form, attempt 1, node:colour-by-refill-keeps-the-view@form-gate-architect-1, dispatched at 2026-11-23T15:24:55Z; its run: Read 42, Grep 26, Glob 4, SubagentHandback 1, by unique call ids, 1 calls errored; model claude-opus-5-5, from 2026-11-23T15:24:58Z to 2026-11-23T15:35:54Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 20033 bytes, sha256 0c386885c1e6fb658a175879dbeb4383741eb5f81fa6bf31432ce3f31615e9a4, byte for byte, nothing masked, with one final newline added. FAIL: E1 (Evidence: seven of the eleven unit tests are green before the change, against stop I4) and E2 (Evidence: mutations with a known pass case under RK-S1, RK-S2, RK-S3, RK-A2, RK-C1 and RK-C2); no Correctness finding; D1 to D6 Documentation, D3 to D5 drafts of shown words for the advisor; OPEN-1 to OPEN-5 read for the advisor, not ruled.)

---

Verdict: FAIL
Reviewed: C:/dev/wt/read-1123c (detached, main) @ b42c0ed72a8a94885bdd1f057c5c7463e5127a0e

The form is `governance/forms/frontends/COLOUR-BY-REFILL-KEEPS-THE-VIEW-PREREGISTRATION.md`. There are no Correctness findings: the mechanism is sound against every race I traced. The gate fails on two Evidence findings, both in the §4 test and mutation plan. Both are closed by the exact replacement words below. None of those words is the human's or the advisor's. AUTONOMY §31 does not reach them, because the findings are Evidence findings, so the re-check covers only the applied words. There are also six Documentation findings, each must-fix before the merge.

## What holds

**The class.** Full form, both gates, holds under ADV-2026-11-16-06 item 2 (a) on three rows:
- concurrency and cancellation;
- what the user is told about a partial view (item 51);
- the size, about 840 lines, over 260.
- §21a also applies through §21c's size bound.
- The "seam" row is inside one docs/02 module (App, canvas and residency are all in `frontends/shell`). I applied the seam rule to it anyway; the class does not rest on that row.

**The defect.** §1's three steps hold on the shipped candidate arm:
- the effect's call: `App.tsx:2145`;
- the binding: `:1801`;
- the clear and the reset: `candidateArmSession.ts:1744-1745`;
- `hasAutoFitRef` set to false: `WorkingCanvas.tsx:1662`;
- the refit on the first batch: `:1817-1819`.

The baseline arm meets a different defect. Its binding (`App.tsx:1937-1958`) resets no fit, so the camera holds, but the map shows an unrestricted look until a pan. Item 51's own source comment says this (`KNOWN-LIMITATIONS.md:467`). That arm is dev-only and correctly out of scope.

**The fix against concurrency.** `hasAutoFitRef` is written only at:
- `WorkingCanvas.tsx:1017` (its initial value);
- `:1583` and `:1818` (a fit);
- `:1649` (`applyView`);
- `:1662` (the reset).

So keeping it is exact, and here is how each race comes out:
- **Apply, then a Colour by inside the Apply's mint.** The Apply's own session reset (`:1745`) has already set the flag false. `keepCamera` leaves it false, so the refill fits, as item 51 says. Whether the Apply itself is lost is PR 358's matter. The form names this case under §31 as (i).
- **Colour by, then an Apply.** The Apply's plain resets (`:1745`, `App.tsx:1138`) re-arm the fit, so the Apply still lands on its matches.
- **An earlier untiled look still running.** At main it is not cancelled (`candidateArmSession.ts:1350-1357`), and it delivers until the new mint (`:1331`). Under `keepCamera` its batches can no longer refit the camera, which is strictly better than today. Its anchor leak after the reset is the existing behaviour that PR 358 removes. I read that only through PR 358's form (`UNTILED-REISSUE-MINT-WINDOW-PREREGISTRATION.md`, items at lines 80-85 and 472), not its head.
- **Tile fills in flight.** `manager.clearAll()` at `:1740` cancels them, unchanged.
- **A source change.** The refill returns at `:1729` before doing anything; a source change seen later at a terminal is handled at `:1376-1378`.
- **A new open.** The canvas is keyed on the dataset (`App.tsx:2367`), so a new open gets fresh refs.
- **A reopen with a saved view.** The open's reissue runs (`:1834`), then `applyView` sets the flag (`:1836`, `WorkingCanvas.tsx:1649`), so the camera is kept.
- **A pending pan.** The debounce is cancelled at `:1731`, and the terminal plans the shown box, so the pan is no longer discarded.

**The map key.** The only state kept is a per-instance boolean. The anchor and the last-queried box are still cleared, which is right by §2.3 (`WorkingCanvas.tsx:1762`, `tileIngest.ts:180`, `WorkingCanvas.tsx:2117-2119`). No coordinate leaves the canvas (ADR-010 rule 1), and nothing outlives the open.

**The seams.** Each interface holds at b42c0ed7:
- `resetFitForNewGeneration(): void` at `WorkingCanvas.tsx:193`, body at `:1660-1664`;
- `reissueUnrestricted` at `candidateArmSession.ts:250`, body at `:1718-1787`;
- the session's canvas is typed `WorkingCanvasHandle | null` (`:119`), so there is no second interface to change;
- `issueQueryRef`'s type at `App.tsx:1055-1057`. Its callers pass three arguments (`:1125`, `:1811`, `:2145`), and the open calls the session directly (`:1834`).

Every new option has the Colour-by effect as its product caller. No `pub` item is added. Stop I1 covers PR 358's change.

**The constitution.**
- No wire or MCP touch (docs/10).
- No undo-class change: the camera is not workspace state (ADR-006).
- ADR-018's vocabulary holds.
- No performance claim (docs/08).
- In roadmap scope: a gap piece under ADV-2026-11-23-15 item 7 (d).

**The OPEN items.** All five recommendations are sound against the code.
- OPEN-1 (a) is the smallest change.
- OPEN-2 (a) is required: option (b) would break an Apply's landing on its matches.
- OPEN-3 (a) is ordinary use and the seam rule's end-to-end test. Its feasibility is limited by the fixture (D6).
- OPEN-4: yes.
- OPEN-5: yes, with D4's card-change gap.

**Records.**
- §0.2's quote matches ADV-2026-11-14-18 line 21 byte for byte.
- The item 61 span matches `KNOWN-LIMITATIONS.md:507`.
- The quoted start of item 51 matches `:466`.
- No line cite into the ledger, no bare self-line, and no pin read as current.
- Every (r) entry I read is the span the form means. I did not read `tileViewportStreamManager.ts:518-728` whole, `manual_walkthrough_fixtures.rs:44-758` (only its head), or all of PR 358's form. Hash recomputation is the reviewer's.

## Findings

### E1 (Evidence; §4's first paragraph and §11 I4): seven of the eleven unit tests are green before the change

The form says every test is red before the change, and stop I4 fires on any test that is green before it. In fact seven unit tests are green at the build head:
- RK-C2 to RK-C5, RK-S2, RK-S3 and RK-A2 pass there.
- An argument passed to today's reset is ignored, so today's plain reset already gives what they assert.
- vitest strips types, so the compile error from the extra argument does not make them red.

Only RK-C1, RK-S1, RK-A1 and E-RK1 are red before the change. As written, the worker stops at I4.

```text
Each test is red at the build head before the change and green after. Each mutation is observed by running the named test red against the mutated code and recording that run. A `verify-mutation` run is not an observation.
```
```text
RK-C1, RK-S1, RK-A1 and E-RK1 are red at the build head before the change and green after. RK-C2 to RK-C5, RK-S2, RK-S3 and RK-A2 are guards: green at the build head and after, each shown by its mutation. Each mutation is observed by running the named test red against the mutated code and recording that run. A `verify-mutation` run is not an observation.
```
```text
- **I4**: a §4 test is green before the change.
```
```text
- **I4**: RK-C1, RK-S1, RK-A1 or E-RK1 is green before the change, or a guard (RK-C2 to RK-C5, RK-S2, RK-S3, RK-A2) is red before it.
```

### E2 (Evidence; §4's rows): mutations that have a known pass case as the tests are written

**M-S3 under RK-S3.** At `candidateArmSession.ts:1150` the first admitted batch overwrites `latestUnionedExtent` with the canvas's anchor, and the anchor is reset at every reissue. So skipping `:1758` cannot show while the new look delivers a batch. Only a look that completes with no batch can show it.

```text
| RK-S3 | Frameless refill: the frame's observed union (the `candidate-grid-frame-established` log line) equals the new look's batch extent alone | M-S3: the keep-camera path skips `latestUnionedExtent = null` |
```
```text
| RK-S3 | Frameless refill, an earlier look having admitted a batch: (a) the new look admits batch B, and the `candidate-grid-frame-established` line's union equals B's extent alone; (b) the new look reaches its Completed terminal with no batch, and no `candidate-grid-frame-established` line is written. M-S3 is observed by (b): the first admitted batch overwrites `latestUnionedExtent` (`candidateArmSession.ts:1150`), so only (b) can show it | M-S3: the keep-camera path skips `latestUnionedExtent = null` |
```

**M-A3 under RK-A2.** App's post-issue reset (`App.tsx:1138`) is plain whatever the binding passes. So "a plain reset" is recorded even under M-A3.

```text
| RK-A2 | An Apply and a Clear each record a plain reset | M-A3: the binding always passes `keepCamera` |
```
```text
| RK-A2 | An Apply and a Clear: every reset each records is plain, the session's reset that follows `clearAllTiles` included (App's post-issue reset at `App.tsx:1138` is plain whatever the binding passes, so it alone cannot show M-A3) | M-A3: the binding always passes `keepCamera` |
```

**M-S2 under RK-S2.** M-S2 shows only if `hasPlanned` was already true before the refill.

```text
| RK-S2 | After a keep-camera refill with a frame, a Completed terminal plans the fake canvas's `shownViewportBbox()` under `f` | M-S2: the keep-camera path skips `hasPlanned = false` |
```
```text
| RK-S2 | With a frame and a plan already run (`hasPlanned` true from the earlier look's terminal plan), after a keep-camera refill a Completed terminal plans the fake canvas's `shownViewportBbox()` under `f` | M-S2: the keep-camera path skips `hasPlanned = false` |
```

**RK-S1 against §2.2 (ii).** Passing `options` through means the reset is called with `undefined`, not with no argument. A call-arguments match against no arguments then fails after the fix.

```text
| RK-S1 | `reissueUnrestricted(null, f, {keepCamera:true})` calls the canvas reset once with `{keepCamera:true}`. Without the option it is called with no argument | M-S1: the session drops the option |
```
```text
| RK-S1 | `reissueUnrestricted(null, f, {keepCamera:true})` calls the canvas reset once with `{keepCamera:true}`. Without the option it is called once with no `keepCamera` (its first argument `undefined`) | M-S1: the session drops the option |
```

**M-C1 and M-C2.** Refitting to the same extent gives the same camera, and a union with the same extent is unchanged. The wiring harness's default batch is one fixture (`WorkingCanvas.wiring.test.tsx:116`), so a second push of it hides both mutations.

```text
| RK-C1 | After an auto-fit, `reset({keepCamera:true})` then a batch elsewhere leaves `currentView()` bit for bit | M-C1: the option is ignored and `hasAutoFitRef` is cleared |
```
```text
| RK-C1 | After an auto-fit and a settled tick that moves the camera off the fit, `reset({keepCamera:true})` then a batch leaves `currentView()` bit for bit and calls `onViewShown` no more | M-C1: the option is ignored and `hasAutoFitRef` is cleared |
```
```text
| RK-C2 | After `reset({keepCamera:true})`, Zoom to layer after one new batch frames that batch alone | M-C2: `keepCamera` also keeps `fitAnchorRef` |
```
```text
| RK-C2 | After `reset({keepCamera:true})`, Zoom to layer after one new batch frames that batch alone; the new batch's extent is not inside the first batch's, asserted in the test | M-C2: `keepCamera` also keeps `fitAnchorRef` |
```

### D1 (Documentation; §10 "Built on" and "Ordered"): the overlap list and the fallback base

The filed-not-built `shell-scale-display` form shares five paths with this one: `App.tsx`, `WorkingCanvas.tsx` (a comment at `:148`), `e2e/README.md`, `KNOWN-LIMITATIONS.md` and `MANUAL-WALKTHROUGH.md`. This form does not name it (ADV-2026-11-16-06 item 4).

The fallback base also leaves out PR 359's head, although `e2e/README.md` overlaps it. ADV-2026-11-23-15 item 4, and the human's message of 2026-11-23 item 5, require that head to be taken in by a merge commit.

```text
If that head is not pushed, PR 358's head (`cut/untiled-reissue-mint-window`), with the README, item and AC12 regions taken in turn.
```
```text
If that head is not pushed, main's tip with the heads of PR 358 (`cut/untiled-reissue-mint-window`) and PR 359 taken in by merge commits (ADV-2026-11-23-15 item 4), and the re-link's item and AC12 regions taken in turn.
```
```text
- **Ordered** behind the filed-not-built milestone-5 and recovery-offer forms on `App.tsx` and `WorkingCanvas.tsx`. Regions: the Colour-by effect, the `issueQueryRef` declaration and binding, and the canvas reset.
```
```text
- **Ordered** behind the filed-not-built milestone-5 and recovery-offer forms on `App.tsx` and `WorkingCanvas.tsx`, and beside the filed-not-built `shell-scale-display` form, which shares `App.tsx`, `WorkingCanvas.tsx` (the comment in `currentView`'s doc), `e2e/README.md`, `KNOWN-LIMITATIONS.md` (a new item) and `MANUAL-WALKTHROUGH.md`; whichever is built later takes the other in before its gate (ADV-2026-11-16-06 item 4). Regions: the Colour-by effect, the `issueQueryRef` declaration and binding, the canvas reset (`resetFitForNewGeneration`'s doc, signature and body), items 51 and 61, row AC12, and one suite entry in `e2e/README.md`.
```

### D2 (Documentation; §4 E-RK1): the pre-refill view has no named instrument, and the open uses a DEV hook

E-RK1 compares the planned box with the view shown before the Colour by, but names no way to read that view. The existing `view-state` render-trace line can give it: `WorkingCanvas.tsx:2161`, with the trace function at `renderTrace.ts:52-54`.

The suite also opens its file through the DEV `openPath` hook (`AdmissionPanel.tsx:421`), and that hook acts.

```text
  - the `candidate-first-look-view-planned` box in the session log equals the view shown before the Colour by, within a pixel's world span;
```
```text
  - the `candidate-first-look-view-planned` box in the session log equals the view shown before the Colour by, within a pixel's world span; that view is computed from the last `view-state` render-trace line before the Colour by (`WorkingCanvas.tsx:2161`) at the canvas's client size;
```
```text
- It uses no DEV-only switch that acts.
```
```text
- Beyond the suites' own open through `openPath`, it uses no DEV-only hook that acts.
```

### D3 (Documentation; item 51's draft and §1): a card change is left out of the waiting case

A card change also arms the waiting fit. It reaches `applyFilterWith` at `App.tsx:2168` and so the plain resets at `:1745` and `:1138`. A refused Apply also arms it, through the recovery's reissue. A Colour by issued before a card change's first batch therefore moves the view, which the draft's words deny. Ordinary use can reach this (a slow scan).

```text
unless the map was still waiting to move the view to the first features of an open, an Apply or a Clear, and then it moves
```
```text
unless the map was still waiting to move the view to the first features after an open, an Apply, a Clear or any other change of the filter, and then it moves
```

Clause check of my words against the code:
- an open: `App.tsx:1834` reaches `candidateArmSession.ts:1745`;
- an Apply or a Clear: `:1745` and `App.tsx:1138`; a refused Apply reaches `:1745` at the attempt and again at the recovery (`App.tsx:377-380`);
- any other change of the filter: a card change at `:2168`;
- nothing else writes the flag false: the writers are listed under "The fix against concurrency" above.

```text
of an open, an Apply or a Clear (`hasAutoFitRef` false)
```
```text
of an open, an Apply, a Clear or a card change (`hasAutoFitRef` false)
```
```text
An Apply, a Clear and an open behave exactly as before.
```
```text
An Apply, a Clear, a card change and an open behave exactly as before.
```

### D4 (Documentation; item 61's draft span): a card change also restarts the union

A card change restarts the Zoom-to-layer union too: it reaches the reset at `:1745` and `:1138`, and the reset clears the anchor at `WorkingCanvas.tsx:1661`.

```text
> since the open, or since the last Apply or Clear, or since Colour by last cleared the map (item 51)
```
```text
> since the open, or since the last Apply, Clear or other change of the filter, or since Colour by last cleared the map (item 51)
```

The same gap exists in item 61's earlier sentence about the fit being armed again (`KNOWN-LIMITATIONS.md:507`). That sentence is outside the span; it goes to the advisor unreworded.

### D5 (Documentation; AC12's draft): the replaced span is not named, and the Felt question is stale

The draft does not say which part of the row it replaces. The row's Felt question, about the jump of the view and the map showing only part of the file, is stale after this piece (`MANUAL-WALKTHROUGH.md:1998`). The status-bar wording also drops "some features'".

```text
Draft expected outcome:
```
```text
Draft for the row's whole third cell:
```
```text
> The map clears and fills again for the view you had; the view does not move. The status bar still says that attributes were not held.
```
```text
> The map is cleared and, once its first data load completes, fills again for the view you had; the view does not move. The status bar still says that some features' attributes were not held (KNOWN-LIMITATIONS item 51). Record what the status bar says besides, and whether the view moved. **Felt:** did the map clearing and filling again surprise you, and is it clear from the screen when it has finished filling?
```

### D6 (Documentation; §3 e2e fixture and the class header)

**The fixture.** `AttributeMode` (`engine/src/fixture.rs:173-197`) has no large compressible text column; `MultiType`'s text column is about 1 KiB. A new mode would be an edit in `engine/`, outside Scope.

```text
A highly compressible text column keeps the file small; the worker states the file's bytes and the disk floor (I5).
```
```text
A highly compressible text column keeps the file small; the worker states the file's bytes and the disk floor (I5). `AttributeMode` (`engine/src/fixture.rs:173-197`) has no such column today (`MultiType`'s `text` is about 1 KiB); a new mode is an edit outside Scope, so stop I2 fires before it, and otherwise the generator uses an existing mode.
```

**The class header.** No current test asserts the refit after a refill: ADV-2026-11-14-15 item 8 says no PR B test asserts where the camera is after it.

```text
AUTONOMY §21a also applies: a property under test changes (the refit after a refill).
```
```text
AUTONOMY §21a also applies, by §21c's size bound. No current test asserts the refit after a refill (ADV-2026-11-14-15 item 8).
```

## Files read (at b42c0ed7, under C:/dev/wt/read-1123c)
- governance/forms/frontends/COLOUR-BY-REFILL-KEEPS-THE-VIEW-PREREGISTRATION.md (whole)
- governance/forms/frontends/UNTILED-REISSUE-MINT-WINDOW-PREREGISTRATION.md (searched)
- governance/forms/frontends/SHELL-SCALE-DISPLAY-PREREGISTRATION.md (searched)
- governance/forms/frontends/SHELL-MAP-REFILL-AFTER-RESIZE-PREREGISTRATION.md (searched)
- governance/AUTONOMY.md:315-357
- governance/PLAN.yaml (the nodes)
- state/directives: the human's message of 2026-11-23; ADV-2026-11-23-15; ADV-2026-11-16-06 (items 2, 4, 5); ADV-2026-11-14-15; ADV-2026-11-14-18; ADV-2026-11-13-02
- state/consults/2026-11-23-colour-by-refill-keeps-the-view-architect-draft.md (lines 1-4 and the note after its end mark)
- frontends/shell/src/App.tsx:290-405, :820-870, :1040-1149, :1745-1959, :2100-2160, :2365-2394, and searches
- frontends/shell/src/residency/candidateArmSession.ts:200-260, :1120-1260, :1283-1567, :1690-1819
- frontends/shell/src/canvas/WorkingCanvas.tsx:139-243, :1005-1019, :1080-1114, :1440-1464, :1560-1859, :2100-2134, :2380-2424
- frontends/shell/src/canvas/tileIngest.ts:172-183
- frontends/shell/src/canvas/limits.ts:80-99
- frontends/shell/src/diagnostics/renderTrace.ts:1-60
- frontends/shell/src/streaming/tileViewportStreamManager.ts:930-954
- frontends/shell/src/App.reopen.test.tsx:1-180
- frontends/shell/src/canvas/WorkingCanvas.wiring.test.tsx:1-200, :420-486
- frontends/shell/e2e/ (open-fills-fit-view.mjs and pan-anchor.mjs searched; the file list)
- KNOWN-LIMITATIONS.md:465-467, :486-487, :506-507, :514, :529-530
- frontends/shell/MANUAL-WALKTHROUGH.md:1996-2020
- kernel/tests/manual_walkthrough_fixtures.rs:1-60
- engine/src/fixture.rs:170-201

Model: claude-opus-5-5 (Opus 5.5).
