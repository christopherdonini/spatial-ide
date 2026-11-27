Reviewed: cut/shell-migration-milestone-5-pr-a at 9d990d79b3710c560605321b22eef9391fb00245 in D:/wt/m5a, and the records at main 7a07ca1c331eba03812e8e609115c0c4179ac5aa in the read checkout D:/wt/read-1124e, read only (the custodian's filing note, 2026-11-24: the architect's build gate on milestone 5 PR A, node:shell-migration-milestone-5@pr-a-build-gate-architect-1, the node's fifth architect row after its four form gates, under ADV-2026-11-24-08 item 2 for Part AF; it ran during no build; dispatched at 2026-11-24T04:42:51Z; its run: Read 52, Grep 23, Glob 3, SubagentHandback 1, by unique call ids, 1 calls errored; model claude-opus-5-5, from 2026-11-24T04:42:51Z to 2026-11-24T04:55:35Z by its transcript; 0 calls named the main checkout; handed back once, at 2026-11-24T04:55:34Z. Filed below the rule, 35457 bytes, sha256 92e0865452e1058330fb3df00ab8bc62abeeaec0c805c6fadeb9f24f22b4f763, byte for byte, nothing masked, with one final newline added.)

---

Verdict: PASS WITH NOTES (cut/shell-migration-milestone-5-pr-a @ 9d990d79b3710c560605321b22eef9391fb00245)
Reviewed: D:/wt/m5a @ 9d990d79b3710c560605321b22eef9391fb00245
REPORT PATH: state/consults/gates/2026-11-24-shell-migration-milestone-5-pr-a-build-gate-architect.md

The base is 6bc401267d2ea4532215397b79264869b4c83570. I read the records in `D:/wt/read-1124e` at main 7a07ca1c331eba03812e8e609115c0c4179ac5aa. "Form" means `governance/forms/frontends/SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md` at 7a07ca1c. The diff and numstat are `<S>/m5a-diff-9d990d79.txt` and `<S>/m5a-numstat-9d990d79.txt`.

I found nothing at the head that is a Correctness or Evidence block. There are four Documentation findings, D-1 to D-4. Each is must-fix before the merge. One evidence risk, ER-1, goes to the advisor; it is a question, not a block.

## Check 1. The list in §9

**§8, item by item:**

1. **Files.** 27 files are in the numstat, and all are in §2.6 as Amendments 2, 4 and 9 widen it. Nothing is under `protocol/`, `kernel/`, `engine/`, `src-tauri/`, `residency/`, `streaming/` or `skp/`. Holds.
2. **Dependencies.** `package.json` changes by one scripts line (class 9, Amendment 2). There is no lockfile in the numstat. Holds.
3. **No display text in `conditions/` and no code from prose.**
   - The identity key is (owner, route, code, ordinal, target, generation): `conditions.ts`, lines 142-153 at 9d990d79.
   - The ceiling code comes from the type: `ceilingKindOf` tests `instanceof` (`canvas/limits.ts`, lines 134-138 at 9d990d79), then `CEILING_CODE[kind]` (`App.tsx`, line 2480 at 9d990d79).
   - The record-notice code is `step-record-${report.kind}`.
   - Holds.
4. **A raise never ends a condition.** `raise` only adds or counts (`conditions.ts`, lines 138-170 at 9d990d79). Conditions end only by `dismiss`, `ownerClear` (viewport-refusal only), `opened` and `replaceBatch` (notice routes only). Holds.
5. **Owner element once; every kept condition reachable.**
   - The strip renders the top. Problems renders the top's row as S-10 only, then the others.
   - Every kept condition has a place: the strip, or Problems through S-3 and the Activity tab.
   - A raise while no view is drawn returns before dispatch (`viewTargetNow`, `App.tsx`, lines 951-955 at 9d990d79). It is not a kept condition, so the amended item does not apply. I found no owner call that can arrive with a null view. Note only.
   - The DOM side is proven by C-R2 and C-E2 step 3. C-E2 is not yet run.
6. **No remedy.** The only Dismiss is where the route declares `dismissed` (`ConditionView.tsx`, line 63 at 9d990d79). Holds.
7, 8. **Jobs.** PR B. Nothing of Jobs is in PR A.
9. **Product callers.**
   - `attentionOthers`: App.
   - `ceilingKindOf` and `CeilingKind`: `WorkingCanvas.tsx`.
   - `routeEnds`: `ConditionView`.
   - `visibleFor`, `ordered` and `attentionOf`: App and `ProblemsTab`.
   - The `onCanvasRefusal` `kind` argument: App's handler.
   - Holds.
10. **Messages and owner texts.**
    - Owner texts are moved whole: `RefusalBlock`, the save notice and the limits text.
    - The baseline stream-terminal text `` `stream ${terminal.kind}: ${refusal.message}` `` is the owner's text as it was before the piece. I took that from the diff and did not re-read the base.
    - Holds.
11. **Strings.**
    - S-1, S-3 to S-6 and S-10 match ADV-2026-11-23-30 item 1 byte for byte (`conditionsConstants.ts` at 9d990d79), and none carries the mark (ADV-2026-11-24-04 item 4).
    - S-12 (`console/surfaceRegistry.ts`, line 329 at 9d990d79) keeps the existing statement's `[P6 placeholder]` mark. ADV-2026-11-23-30 item 1, the S-12/S-13 bullet, says "The worker keeps each existing statement and changes only the names the form says change". So that is correct.
    - Sight is in Part AF row AF6.
12. **Seams.** See check 4. Holds.
13. **Round 25.**
    - Class 8 files: listed in check 9; they must be recorded.
    - Class 9: each scope addition has its amendment (Amendments 2, 4 and 9). The order of commit against amendment cannot be checked without `git log`; the reviewer checks it.
    - No dated line calls a `verify-mutation` run an observation.
    - Test-text cites carry commit ids.
14. **Quotes, ledger cites, self-lines.** None in the code diff. On "copied byte for byte" in KNOWN-LIMITATIONS 77 to 79, see D-3.
15. **Open OPEN items.** I found no code of an open OPEN item.

**Plan §2 rules 1, 3, 4, 5, 7, 10 and 11:** not read this session. These are not checked. I disclose that, and the closing amendment must not cite this gate for them.

**§9 against C-U2 to C-U5 and C-R1:**
- C-U2 pins `ordered`: urgency, then the oldest seq.
- C-U3 pins standing conditions and the top's move.
- C-U4 pins `visibleFor`. The R2 line is the generation clause's pin (`conditions.test.ts`, line 99 at 9d990d79).
- C-U5 pins "no merge by text".
- C-R1 pins `ConditionView` per place. It excludes session-ended, which `ConditionView.tsx` renders through `RefusalBlock` with no S-5 line.
- Holds.

**ADR-006:**
- All of it is view state. Dismiss records `canvas.dismissCanvasRefusal` / `canvas.dismissViewportRefusal`, class C (`surfaceRegistry.ts`, lines 237-253 at 9d990d79).
- S-3's click goes through `apply`, which calls `recordLayoutAction` (`layout/StudioLayout.tsx`, lines 193-203 at 9d990d79).
- Nothing is called undoable.
- The export cancel is PR B's.
- I did not re-read the ADR text this session. I checked against the form's restatement in §1.

**ADR-010 rule 1, ADR-018, ADR-021:**
- I did not re-read these ADRs this session.
- On the form's restatements: no duration or progress figure appears in code, strings or Part AF. Both e2e headers say waits are harness bounds.
- FilterPanel's Cancel is untouched (PR B).
- Not verified against the ADR text.

**Discharge claims and verbatim quotes:**
- Every OBSERVED / READ line I resolved names its commit.
- The KL comments' "byte for byte": see D-3.

## Check 2. docs/01

- **P1, typed resource.** Conditions are typed: route, code, generation, target. Holds.
- **P2, searchable.** Not engaged.
- **P3, reproducible.** Not engaged; the store is view state.
- **P4, scriptable.**
  - Dismiss records its class C action.
  - S-3 and the tab select record layout actions (`StudioLayout.tsx`, line 202 at 9d990d79).
  - Holds.
- **P5, AI-accessible.** Nothing GUI-only acts on data. Holds.
- **P6, platform first.** Shell-only. No kernel or protocol edit. Holds.
- **P7, async.** The reducer is synchronous and pure. No blocking call is added.
- **P8, no black boxes.** Each condition carries its owner's code and display, and S-6 counts what is not kept. Holds.
- **Derived rules.**
  - The canvas rule is not engaged; there is no perf claim.
  - CRS is not engaged.
  - Plain text is not engaged.
  - "Auditable beyond revertible": nothing claims undo. Holds.

## Check 3. The store's five cases

1. **A raise during a reopen.**
   - `setAdmitted` dispatches `opened` (`App.tsx`, line 1225 at 9d990d79) before `handleReopened` raises its notices (`App.tsx`, lines 1266-1268 at 9d990d79), in the same handler after `handleAdmitted(next)` (line 1249).
   - A raise under the old generation before `opened` is kept, then ended by `opened` (`conditions.ts`, line 186 at 9d990d79).
   - After `opened`, a raise under another generation is dropped (`conditions.ts`, line 140 at 9d990d79).
   - A refused reopen dispatches no `opened`, so the conditions stand.
   - Tests: C-U6a and C-A3.
2. **A late result.**
   - App's guards come first (`App.tsx`, lines 1635, 1652, 1931 and 2469 at 9d990d79).
   - Then `conditions.ts`, line 140, then `visibleFor`'s generation clause (lines 208-213).
   - `ownerClear` filters by generation (line 183), so a late clear from A reaches none of B's conditions. This is recorded at `App.lateResult.test.tsx`, line 475 at 9d990d79.
   - Tests: C-U6a, C-U7b, C-U4's R2 line, and the N8 tests of `App.lateResult.test.tsx`.
3. **A dismiss after a re-raise.**
   - `dismiss` ends the condition by id, every occurrence with it (`conditions.ts`, lines 176-180 at 9d990d79).
   - A later raise of the same key finds no match and mints a new id and seq, at occurrences 1 (lines 155-170).
   - **No unit or App test reaches this.** No case dismisses a condition with occurrences > 1, and none re-raises after a dismiss.
   - Only C-E1 step 4 reaches it in part: it dismisses a refusal raised at least twice. C-E1 is not run, and it does not re-raise. That is a finding under the brief's rule; see the closing amendment, item (n). It is not a block, because the line decides the case plainly.
4. **The cap.**
   - `conditions.ts`, line 155 at 9d990d79 governs: urgency > 1 and `keptForCap` (urgency > 1 only, line 130) ≥ 63 gives `notKept + 1`.
   - A re-raise of a kept key matches at lines 142-153, before line 155, so it is an occurrence and is not counted.
   - Urgency 1 is always kept. Only one is kept per open, because App's latch holds it (`handleSessionEnded`). The store does not hold it.
   - Tests: C-U7, C-U7a, C-U7b and C-U7c.
5. **An owner-clear on another owner's condition.**
   - Line 182 refuses a route without `owner-cleared`.
   - Line 183 filters by route, generation and target. A route has one owner (`CONDITION_ROUTES`, lines 45-53, pinned whole by C-U1), so filtering by route filters by owner.
   - Test: C-U6.

## Check 4. The seam rule, base against head

- **Seam 8, the store to its consumers.** `ConditionView`, `ProblemsTab` and `StudioLayout`'s `attentionOthers` are each written against the store's actual exports at the head.
- **End-to-end proof from the real shape:**
  - C-A7 raises the record notice from the real step queue, not a hand-made event (ADV-2026-11-24-04 item 2).
  - C-K2 runs `WorkingCanvas`'s real catch, with a `./limits` mock that passes through unless armed.
  - C-E1 and C-E2 are the app-level proofs. Both are not yet run.
- **Moved cites (the tree is authoritative):**
  - Amendment 4's `App.tsx:879` (the record notice, at the base): at the head, line 879 is `useReducer(conditionsReducer)`, and the record notice is lines 883-907. The tree is authoritative; the closing amendment pins the head lines.
  - ADV-2026-11-24-03 item 2's `conditions.ts:140`: unchanged at the head (raise's first line). Stable.
  - `saveProject.ts:115-121` and `openProject.ts:135-142` (form Amendment 4): those files are not in the diff. Stable.
  - The comparison's line numbers for the two files ahead of 7c816dd4 are not to be used (ADV-2026-11-24-08 item 6).
  - 9d990d79 adds only the walkthrough Part, at the file's end, so the draft Part report's source cites at 2e377679 hold at 9d990d79.
- **No imagined interface found.**

## Check 5. The evidence

- **§4 tests and mutations.** OBSERVED lines exist at a17db128 for C-U1 to C-U8, and at b9594a2f for the C-U8 record-notice case. Further runs:
  - C-U4: clause probe at 7c816dd4 (`conditions.test.ts`, line 99).
  - C-U6a: at 7c816dd4 (line 171).
  - C-A7: at 7c18e29f (`App.conditions.test.tsx`, line 516 at 9d990d79).
  - Three-stop and two-stop lines for X-1, X-2, G-1 and G-2 (`App.lateResult.test.tsx`, lines 475-477, 511-514 and 774-781 at 9d990d79).
  - READ lines for X-1 and X-2 (lines 477 and 514).
- **C-U1's post-fix run** is in the worker report, not in a dated line. See D-2.
- **§5's predictions.**
  - The C-E1 prediction "reopen, and both are empty" and §9 step 3 "both are gone" are contradicted by reading. The arm stays pinned, and the reopen's first look refuses again. Record this as class 2 in the closing amendment.
  - Amendment 4's predicted overrun of about 3,730 lines did not occur (2,393 in the count). Class 2.
- **The head carries §1's claims as Amendment 4 left them.** That includes "at most `CONDITIONS_MAX` (64) … and shows how many it did not keep" (form, Amendment 4, the Old/New of §1's third bullet). Jobs is PR B's.
- **Outstanding, not counted as findings.** What each must show:
  - **e2e at the base, then at the head,** after the sitting (ADV-2026-11-24-04 item 3).
    - Every base suite must be green at both.
    - `refusal-contract-baseline.mjs`'s status-after-Dismiss assertion must pass at the head, recorded by name (ADV-2026-11-24-08 item 3).
    - C-E1 and C-E2 must exit 0. A VOID is not a PASS.
  - **C-U6a again at the head.** Done at 7c816dd4 (line 171). If the custodian reads ADV-2026-11-24-07 item 3 as asking for the final head, run it once more there.
  - **The new N8 test (ADV-2026-11-24-09 item 4).** It needs an amendment first. It must fail at the assertion after the terminal with G-1's guard alone removed, and at the assertion after the canvas refusal with G-2's guard alone removed. It must pass with both guards in place. Each run is a dated line.
  - **The late Completed observation (ADV-2026-11-24-09 item 5).** With `onDeliveryCompleted`'s guard removed, the test must fail at its assertion that Cancel is shown. This is a dated line beside the 2026-09-23 line, and a pass is a stop.
  - **F-4 (a) comments.** The reviewer's attempt-2 words are applied to the `App.test.ts` block, comments only.

## Check 6. The commits after the reviewer's attempt 1

I classed these from the worker reports and the numstat. I did not read per-commit diffs.

- **18697749** — test code: C-A7.
- **7c18e29f** — code: one product line, the C-1 fix (record notice by `replaceBatch`).
- **7c816dd4** — comments and records only. C-U4 and C-U6a OBSERVED lines.
- **1b38e62c** — comments only. READ lines.
- **2e377679** — comments only.
- **9d990d79** — record only: Part AF.

C-1's fix meets ADV-2026-11-24-04 item 2:
- The test raises from the real report.
- It ran red at 12a9aa98 for the reviewer's reason, by the worker report and its log `D:/wt-data/m5a/c1-red.log`, which I did not read. It ran green after the fix.
- One mutation ("dispatches `raise` again") was observed at 7c18e29f (line 516).
- The closing amendment must still say that C-U8 proves the store and C-A7 proves App.
- The reviewer checks, by `git log`, that the class 9 amendment preceded 18697749.

## Check 7. The words, clause by clause

- **KNOWN-LIMITATIONS 77 (KL-A).**
  - "same kinds … and no others": the strip shows `attention.top` from the same store Problems lists.
  - "A refused open stays in Layers": no raise of an admission refusal is in the diff.
  - "status bar's items are not listed": `statusItems.ts` is not fed from the store.
  - True.
- **KNOWN-LIMITATIONS 78 (KL-D).**
  - "emptied at every successful open": `opened` at `App.tsx`, line 1225 at 9d990d79, then `conditions.ts`, line 186. No condition of the new generation can exist before `opened`, because line 140 drops it.
  - "a reopen of the same file included": a new handle per admit. This rests on the comment at `StylePanel.tsx`, line 106 at 9d990d79, and on the kernel; I did not read the kernel.
  - "lists only what that open raises", "Nothing is kept from before": true.
- **KNOWN-LIMITATIONS 79 (KL-E).**
  - "at most 63 … one place held": lines 130 and 155.
  - "Problems says how many were not kept": S-6.
  - "does not come back when others leave": nothing re-raises.
  - "ended session is always kept … first": urgency 1 and `ordered`.
  - "count starts again": line 186, `notKept: 0`.
  - The last sentence follows from `ordered`.
  - True.
  - The words match ADV-2026-11-23-30 item 2 word for word. The bytes differ by the bold mark and the line break (D-3).
- **The two surfaceRegistry statements (S-13), `surfaceRegistry.ts`, lines 241-243 and 250-251 at 9d990d79.**
  - "only clears local App state (the condition store's dismiss(id))": `dismissCondition` dispatches `dismiss` only.
  - "never reaches the kernel": true.
  - "never touches the status indicator": the reducer writes no status.
  - True.
- **The e2e README "Conditions spec" entries.**
  - True of what each suite checks.
  - The C-E1 paragraph's end state ("checks that the strip and Problems are empty") is the end state D-4 corrects.
- **S-1 to S-13 against ADV-2026-11-23-30 and Amendment 8.**
  - S-5's `{n}` is `occurrences`, shown when > 1 (`ConditionView.tsx`). Matches.
  - Amendment 8's "The placeholder mark stays as the form has it" is superseded by ADV-2026-11-24-04 item 4. The closing amendment pins that (reviewer's D-4).
- **On main?** None of these is on main at 7a07ca1c. The main walkthrough ends at Part AD (`frontends/shell/MANUAL-WALKTHROUGH.md`, line 2021 at 7a07ca1c).

## Check 8. Part AF (`frontends/shell/MANUAL-WALKTHROUGH.md`, lines 2073-2103 at 9d990d79)

**The clauses.** "Data/kernel" marks a clause that rests on the fixture, the watcher or the kernel; those cannot be checked by reading.

- **AF0a**
  - The call resolves `{ok:true}` before any open: holds.
  - "no operator reaches [the baseline arm] in the shipped build": holds.
- **AF1**
  - The refusal path (`WorkingCanvas` catch, then `App.tsx`, lines 2461-2486), the "accepting this batch would carry" text, and Dismiss: hold.
  - No S-3 and no S-5: holds (others = n−1; S-5 needs occurrences > 1).
  - **Data/kernel:** that the first look is refused at all.
- **AF2**
  - Ctrl+J, the Problems tab, and one S-10 row: hold.
  - **Data/kernel:** the same refusal is raised again on a pan (H3).
  - If it is raised again, S-5 shows `<n>` ≥ 2: holds.
  - **Data/kernel:** the touch and pan end the session (H2).
  - **Data/kernel:** the code `engine.source_changed`.
  - The block is the top, the refusal moves to Problems with S-5 and Dismiss, `1 more in Problems`, and the button opens Problems: hold.
  - **Data/kernel:** "2 more" plus a `stream ` row on the post-check route. If the route is taken, it holds by `viewportStreamManager.ts`, lines 338-367 at 9d990d79 (end, then `onTerminal`).
- **AF3**
  - Dismiss ends that row only, the block stays, and the button goes or reads 1: hold.
  - On admission everything ends, the strip is hidden, and S-4 shows: hold.
  - **Data/kernel:** the refusal comes back. The arm persists: holds by reading. The new first look trips the ceiling: data.
  - It comes back with no S-5 and no button: holds.
- **AF3a**
  - A fresh launch runs the shipped arm: holds.
  - The save line `The project was saved.` and no Dismiss on it: hold.
  - **Data/kernel:** "no button" (N-4's one notice).
  - **Data/kernel:** the block and the button (H7).
  - **Data/kernel:** "No row holds a refusal code" (H7).
  - S-4 after the second open: holds by reading. **Data:** that the shipped arm raises nothing on this file.
- **AF6**
  - The S-12 Console row is recorded by `selectTab` (`StudioLayout.tsx`, lines 313 and 202 at 9d990d79): holds.
  - The paths given exist: holds.

**The timing risk (point 1): real.**
- C-E1 step 4 (`e2e/conditions-baseline.mjs`, lines 162-165 at 9d990d79) polls for S-4 every 200 ms after `openPath` resolves. S-4 shows only between `opened` and the new open's refusal.
- If a poll lands in that window, the run PASSES, but by timing. If the refusal lands first, S-4 never shows again, and the run is a VOID (exit 2, "waited … for S-4 in Problems").
- Step 4 can never FAIL. A regression in which `opened` keeps the old conditions also shows as a VOID, not a FAIL. Line 165's record is then near-tautological, because it runs only once the predicate already holds.
- C-E2 step 4 (`e2e/conditions.mjs`, lines 156-159 at 9d990d79) has no returning refusal on the 100k fixture, so it has no window. It shares the VOID-not-FAIL shape for a broken `opened`.
- This is ER-1, for the advisor (question Q1).

**Letter, class and placement under ADV-2026-11-24-08 item 2:**
- **Letter: holds.** The head's tree ends at AE (line 2050 at 9d990d79), which came in with the re-link. Main at 7a07ca1c ends at AD. AF is the next unused letter.
- **Class: holds.** The walkthrough is a record of the piece in §2.6, and §9's Operator line places the Part "at each PR's merge", so it is owed work inside the Scope, not class 9.
- **Placement: holds.** At the end of the file, after AE2's log line.
- **Step coverage.** The Part holds §9 steps 0, 1, 2 and 3, with 0a and 3a from the amended §9, and step 6 for PR A's strings (item 2, first bullet). It also names S-13, which §9 step 6 ("S-1 to S-12") does not; that is harmless.

## Check 9. §7 and the Scope, recounted from the numstat

**In the count:** `frontends/shell`, excluding `MANUAL-WALKTHROUGH.md` and the e2e README: +2,272 / −121, 2,393 lines changed.

| Group | Lines | Ceiling |
|---|---|---|
| Product | about 631 | 994 |
| Tests | about 1,360 | 1,480 |
| e2e | 402 | 620 |
| PR A total | 2,393 | 3,094 |

The total is within its ceiling.

**Per-file overruns, each to be recorded as class 8:**
- `App.conditions.test.tsx`: 562 against 480.
- `conditionsConstants.ts`: 26 against 20. No amendment predicted it; ADV-2026-11-24-03 item 5 names it.
- `package.json`: 2 against 1.

**Files with no ceiling, each to be recorded as class 8 against a ceiling of 0:**
- `WorkingCanvas.wiring.test.tsx`: 51.
- `canvas/limits.ts`: 10.
- `canvas/limits.test.ts`: 19.
- `e2e/conditions-baseline.mjs`: 204.
- `App.lateResult.test.tsx`: 56.
- `App.table.test.tsx`: 2.
- `App.test.ts`: 4.

**Unused allowances (class 2 note):**
- No existing e2e suite edited; the declared selector edits are 0.
- `App.streamFailure` and `App.layout` are not edited. The re-sweep named `App.layout.test.tsx` as having a strip read, so the closing amendment says why no edit was needed. I did not read that file; this is a question for the reviewer.

**Records, outside the count:**

| File | Lines | Allowance |
|---|---|---|
| Walkthrough | 31 | 120 |
| e2e README | 17 | 40 |
| KNOWN-LIMITATIONS | 12 | 50 |

**§7 itself:** not edited in the diff. Holds.

## Findings

**Correctness:** none.

**Evidence:** none blocking. ER-1, the C-E1 step 4 window, is raised as advisor question Q1, because the fix would be a class 9 test change.

**D-1 (Documentation, must-fix): three App.tsx comments name state the piece removed.** Not the human's wording. Class 3.

(a) `frontends/shell/src/App.tsx`, lines 1631-1634 at 9d990d79.

Old:
```text
        // N8 correction round 1: a late arrival from a generation `App` has moved past must not
        // touch the LIVE generation's `viewportRefusal` either -- the same drop-not-act-on guard
        // `endSessionForDataset` already applies to ending the session (its own doc comment has the
        // full account), extended here to this arm's write (the rejected arm below carries the same guard).
```
New:
```text
        // N8 correction round 1: a late arrival from a generation `App` has moved past must not
        // act for the LIVE generation -- the same drop-not-act-on guard `endSessionForDataset`
        // already applies to ending the session (its own doc comment has the full account). Since
        // milestone 5 this arm's only write is the condition store's `ownerClear`, which carries
        // `forDataset` as its generation (the rejected arm below carries the same guard).
```
Clause check:
- "only write is … `ownerClear`": lines 1643-1645 write nothing else.
- "carries `forDataset` as its generation": line 1645.

(b) `frontends/shell/src/App.tsx`, lines 1649-1651 at 9d990d79.

Old:
```text
          // N8 correction round 1: same drop-not-act-on guard as the resolved arm above -- a late
          // rejection from a superseded generation (e.g. after `manager.stop()` or a rejection
          // following `closeDataset(old)`) must not write the LIVE generation's `viewportRefusal`.
```
New:
```text
          // N8 correction round 1: same drop-not-act-on guard as the resolved arm above -- a late
          // rejection from a superseded generation (e.g. after `manager.stop()` or a rejection
          // following `closeDataset(old)`) must not raise a condition for, or end, the LIVE session.
```
Clause check: after the guard come the raise (lines 1655-1666) and, for one code, the session end (from line 1667). Those are the two writes named, and they agree with `App.lateResult.test.tsx`, line 514 at 9d990d79.

(c) `frontends/shell/src/App.tsx`, lines 2462-2468 at 9d990d79.

Old:
```text
                    // N8 residual correction round 1: bound to the `admitted` this render built it for --
                    // a call arriving from a superseded instance must not run `handleCanvasCeilingRefusal`
                    // below. Unguarded, it would set the LIVE generation's `canvasRefusal` banner to A's
                    // own message and dispatch `{kind:"failed"}` onto the live scan-liveness state -- real
                    // contamination. Its `cancelStream(streamHandle)` call, by contrast, targets B's own
                    // manager with A's `streamHandle`, naming none of B's streams -- a no-op, not a
                    // correctness guarantee this guard relies on.
```
New:
```text
                    // N8 residual correction round 1: bound to the `admitted` this render built it for --
                    // a call arriving from a superseded instance must not run `handleCanvasCeilingRefusal`
                    // below. Unguarded, it would dispatch `{kind:"failed"}` onto the live scan-liveness
                    // state -- real contamination; its canvas-ceiling raise carries A's generation, which
                    // the condition store drops (`raise` in conditions/conditions.ts). Its
                    // `cancelStream(streamHandle)` call, by contrast, targets B's own manager with A's
                    // `streamHandle`, naming none of B's streams -- a no-op, not a correctness guarantee
                    // this guard relies on.
```
Clause check:
- "raise carries A's generation": `generation: admitted.dataset`, line 2483.
- "the store drops": `conditions.ts`, line 140.
- "`{kind:"failed"}`": `applyScanEvent` is passed at line 2487.
- The last sentence is unchanged.

**D-2 (Documentation, must-fix): C-U1's run after the fix has no dated line (ADV-2026-11-24-06 item 2).** Not the human's wording. Class 3.

`frontends/shell/src/conditions/conditions.test.ts`, lines 43-44 at 9d990d79, carry the a17db128 run only.

Old: none (a new line after line 44).

New, to be written only if the worker's log at 7c18e29f shows exactly this. If it shows otherwise, it goes to the advisor (ADV-2026-11-24-06 item 2), and nothing is written to match:
```text
  // OBSERVED 2026-11-24 at 7c18e29f, the same mutation run again at the head that holds the fix of C-1 (ADV-2026-11-24-06 item 2): FAILED -- this test; also failed: C-U6; C-U3 did not fail. Reverted after observing.
```
Clause check: this agrees with line 43's "Also fails C-U6", and with the C-1 worker report's re-run result as I read it.

**D-3 (Documentation, must-fix): "copied byte for byte" in the source comments of KNOWN-LIMITATIONS 77 to 79.** Not the human's wording. The comments are the worker's; the items are the advisor's.

The words match ADV-2026-11-23-30 item 2. The bytes do not: the item adds `**` around the first sentence and a line break with indent before the second. The advisor compares byte for byte at the merge check (ADV-2026-11-23-30 item 4). The reviewer confirms the word match by script.

In each of `KNOWN-LIMITATIONS.md`, lines 562, 566 and 570 at 9d990d79:

Old (line 562; for 566 and 570 read `KL-D` and `KL-E`):
```text
KL-A, copied byte for byte
```
New (likewise `KL-D` and `KL-E`):
```text
KL-A, its words copied byte for byte; the bold first sentence and the line break after it are this file's form for an item
```

**D-4 (Documentation, must-fix): C-E1's stated end state.** Not the human's wording. The comment is class 3. The README is a record.

`frontends/shell/e2e/conditions-baseline.mjs`, line 16 at 9d990d79.

Old:
```text
//   4. S-3 opens Problems; Dismiss the canvas refusal; reopen the copy, and both the strip and Problems are empty (S-4 shows).
```
New, if Q1 leaves the suite unchanged:
```text
//   4. S-3 opens Problems; Dismiss the canvas refusal; reopen the copy: once the reopen is admitted both the strip and Problems are empty (S-4 shows), until the new open's first look raises the refusal again on the pinned arm; a poll that misses that window ends the run VOID.
```
Clause check:
- "empty once admitted": `conditions.ts`, line 186.
- "raises again on the pinned arm": the arm persists (Part AF row AF3's own reading), and the first look trips the ceiling as a data fact.
- "VOID": lines 56-68 and 164 of the suite.

The README's C-E1 sentence ("reopens the copy, and checks that the strip and Problems are empty") takes the same qualifier.

If Q1 changes the suite, the words follow the suite, and the gate's narrow read checks them.

## The advisor's open questions, with words (the draft report's §6 points 1 to 12)

Each question puts the drafter's words, or mine, for the advisor to keep or replace. I decide none.

- **Q1 (point 1, ER-1).** C-E1 step 4 can only PASS by timing or VOID.
  - Option (a): a class 9 change, its amendment first. The step waits until `.canvas-session-ended` is gone after the reopen, then passes on either reading: S-4, or the strip's top a canvas refusal with no S-5 line and Problems listing only the top row. Any other reading FAILs.
  - Option (b): the suite stays. A VOID at step 4 comes to you, and D-4's words land.
  - Both options include a class 2 record: the form's "reopen, and both are empty" (C-E1) and "both are gone" (§9 step 3) are wrong for the baseline arm.
- **Q2 (point 2).** The copies go under `target\fixtures\manual-walkthrough\`, as Part Q does. I read §3's "the run's own TMP folder" as for the e2e runs. Is that the reading, and are operator copies not hashed?
- **Q3 (point 3).** Is "change the file" Part Q's mtime touch, which N-3 names?
- **Q4 (point 4).** AF2 opens Problems before the touch to see S-10, then closes Activity, so that S-3 visibly opens it. Keep?
- **Q5 (point 5).** AF2 asks for S-5, which form step 2 does not name but H3 and C-E1 do. Keep?
- **Q6 (point 6).** "Reopen the file" means **Open GeoParquet…** on the same copy, as both suites do, not **Open project…**. Confirm?
- **Q7 (point 7).** AF3a expects one save notice (N-4). A second is recorded, with every later count one higher. Keep?
- **Q8 (point 8).** "A fresh launch on the shipped arm" means a new `npm run tauri dev` start with no DevTools step, not a packaged build. Confirm?
- **Q9 (point 9).** S-6 and S-13 are sighted in the source, because no sitting raises 64 conditions or a viewport refusal. Is source sight enough for P6 here?
- **Q10 (point 10).** The rows are AF0, AF0a, AF1, AF2, AF3, AF3a and AF6, with the "(A)" marks dropped. PR B inserts AF4 and AF5 and widens the title. Keep?
- **Q11 (point 11).** Windows only (§2.8; the watcher arms on Windows alone). Keep?
- **Q12 (point 12).** AF0a has no `getResidencyArm()` read-back, which the e2e suite has. Add one row clause, "then run `window.__SPATIAL_E2E__.getResidencyArm()`: it returns `"baseline"`", or keep it as is?

## What the closing amendment must record

The closing amendment is references and hashes (record cap). Each hash is at a commit on main (round 15 (e)), or for a branch file at its named branch commit (round 25).

- **ADV-2026-11-24-08:**
  - **item 1:** three texts superseded by reference. §2.2's suppression sentence, by Amendment 2's C-A1 (F-1). The "both set sites raise" sentence, and the routes table's cite of the reset adapter (F-2).
  - **item 2:** the Part's letter AF; that this gate checked its clauses (check 8); the class-3 re-letter rule if AF is taken at the merge.
  - **item 3:** (a) the `App.test.ts` comment correction, with its exception amendment first. The `refusal-contract-baseline.mjs` status-after-Dismiss assertion's result at the head, by name. (b) The three e2e comments, recorded as owed.
  - **item 4:** the comparison's three likely breaks, as points to watch.
  - **item 5:** the three files found late, and the four base lines of `App.lateResult.test.tsx`.
  - **item 6:** head lines pinned from 7c816dd4 for the two files, none taken from the comparison.
- **ADV-2026-11-24-09:**
  - **item 2:** C-U4's third expect (the R2 line) as `visibleFor`'s clause pin, with the probe at 7c816dd4 (`conditions.test.ts`, line 99 at 9d990d79).
  - **item 3:** X-2 recorded as found (`App.lateResult.test.tsx`, line 514 at 9d990d79).
  - **item 4:** the new N8 test and its two mutations, with three dated lines.
  - **item 5:** the late Completed observation.
- **ADV-2026-11-24-07 item 3:** the three-stop and two-stop observations as dated (lines 475-477, 511-514 and 774-781 at 9d990d79), and C-U6a again.
- **ADV-2026-11-24-04:**
  - **item 2:** C-A7's red at 12a9aa98 and green, M-C1 at 7c18e29f, and the sentence that C-U8 proves the store and C-A7 proves App's use of it.
  - **item 4:** S-5 unmarked, superseding Amendment 8's placeholder-mark sentence.
  - **item 5:** D-1 to D-3, D-5 and D-6 with the reviewer's words, and the red intermediate push at 021d125a.
- **ADV-2026-11-24-03:**
  - **item 2:** C-U6a as the pin of `conditions.ts`, line 140 (`conditions.test.ts`, line 171 at 9d990d79).
  - **item 5:** the class 8 files of check 9.
- **ADV-2026-11-24-06:** the D-2 replacements as applied, and C-U1's run after the fix (this gate's D-2).
- **Class 8:** every file of check 9's two class 8 lists, each with its figure.
- **Class 2:**
  - Amendment 4's predicted overrun of about 3,730 against 2,393 actual.
  - The unused e2e selector allowance.
  - The wrong C-E1 and §9 step 3 end state (Q1).
- **H5:** superseded for one line (Amendment 9), pinned.
- **Superseded claim lines:** any claimed test of a moved line, pinned (a moved cite is item (a) below).
- **Not checked by this gate:** plan §2 rules 1, 3, 4, 5, 7, 10 and 11, and the ADR texts of 006, 010, 018 and 021. The closing amendment does not cite this gate for them.
- **(a) Moved cite:** Amendment 4's `App.tsx:879` against the head's lines 883-907.
- **(n) Untested store case:** check 3 case 3, the dismiss after a re-raise. It is decided by `conditions.ts`, lines 176-180, and no test reaches it.

## Files read

At 9d990d79 in `D:/wt/m5a`:
- `frontends/shell/src/conditions/conditions.ts`, `conditionsConstants.ts`, `ConditionView.tsx`, `ProblemsTab.tsx`, and their tests.
- `App.tsx` (the diff, and lines 949-955, 1215-1284, 1626-1669 and 2455-2492).
- `App.conditions.test.tsx`; `App.lateResult.test.tsx` (its dated lines).
- `layout/StudioLayout.tsx` (lines 193-203 and 308-396), `contributions.ts`, `console/surfaceRegistry.ts` (lines 234-253 and 329).
- `canvas/limits.ts` (lines 131-138), `canvas/WorkingCanvas.tsx` (the diff), `diagnostics/log.ts`, `streaming/viewportStreamManager.ts` (lines 330-374).
- `e2e/conditions.mjs`, `e2e/conditions-baseline.mjs`, the e2e README's diff.
- `KNOWN-LIMITATIONS.md` (lines 558-571), `frontends/shell/MANUAL-WALKTHROUGH.md` (Part AF and the Part headings).
- `docs/01_Principles.md`.

In `D:/wt/read-1124e` at 7a07ca1c:
- The form, whole.
- The rulings ADV-2026-11-23-30, ADV-2026-11-24-03, -04, -06, -07, -08 and -09.
- The reviewer's row-892 report, the C-1 fix worker report, and the walkthrough's Part headings.

In `<S>`: `m5a-diff-9d990d79.txt`, `m5a-numstat-9d990d79.txt`, and `report-m5a-part-arch-1.md` (read at 2e377679).

**Not read:** the ADR-006, 010, 018 and 021 texts; plan §2; the re-sweep and comparison reports; `App.layout.test.tsx`; the per-file diffs of `App.lateResult.test.tsx` beyond its dated lines, and of `App.test.ts`; the run logs.

**Model:** Opus 5.5 (claude-opus-5-5).
