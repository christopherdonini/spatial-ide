*Custodian's filing note (2026-11-01): the architect's read-only re-draft of the full form for `walkthrough-stale-cites-l5-degrees-p1`, the docs lane's next piece, read at main 346dc358 (dispatched 2026-11-01T04:04:25Z by the main transcript, its prompt equal to its brief by script). Its form is committed in the same commit at its governance path, with Amendment 1. The run 04:04:26Z to 04:11:17Z by its transcript (Read 38, Grep 29, Glob 1; no write tool; no call outside the repository but one Grep over the harness's saved copy of its own earlier Grep result, a tool-results file in this session's folder, which held its own search of a repository file). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256 from line 5 to the end is 2d01f55a6c5c8d1383813b0d28d4c2df08da6acaed356a8f4cccefbe1fd3b9a9.*

---

Re-drafted: walkthrough-stale-cites-l5-degrees-p1, at main 346dc358

I read only the main checkout. The session's git snapshot gives its HEAD as 346dc358 with no tracked edits; I have no shell to confirm that. For the same reason I computed no sha256: the custodian pins every cite by script. Every `path:line @ 346dc358` below is my read of that checkout. Everything in this report is my own wording unless it is marked as byte-copied.

---

# MANUAL-WALKTHROUGH.md: Part L's rows L1 and L5 and its fixture note, and the degrees Part P's row P1. Stale line cites re-aimed by name. Preregistration (full form)

File: `governance/forms/frontends/WALKTHROUGH-STALE-CITES-L5-DEGREES-P1-PREREGISTRATION.md`

**Authority.**
- **The node:** `governance/PLAN.yaml:6064-6080 @ 346dc358`, node `walkthrough-stale-cites-l5-degrees-p1`. It requires correction "by cite, not by verdict". Those are the custodian's summary words, not the human's.
- **Placement:** `state/directives/2026-10-23-weekend-covering-case-s1-session-log-redaction-s2-governance-and-docs-order-v0-2-scope-port-2-approved.md:14 @ 346dc358`, item 4. The order is restated in `state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md:16 @ 346dc358`, item 5: after `adr-020-appended-note`.
- **Rulings:** `state/directives/2026-10-23-clicks-245-246-247-sort-window-fix-before-port-2-covering-case-route-1-244-c1-milestone-4-and-1c-open-items-ruled.md:22 @ 346dc358` rules the draft's OPEN-1 yes and OPEN-2 yes. Both are carried in §2 as ruled.
- **Findings:** the sitting script's D1 and D2 (`state/drafts/sitting-script-2026-10-23.md:383-387 @ 346dc358`) and C4's pointer to them (`state/drafts/sitting-script-2026-10-23.md:309 @ 346dc358`).
- **Lane:** the docs lane, documents only. Rule (00) is `governance/AUTONOMY.md:609 @ 346dc358`. Walkthrough Parts count as separate paths under `state/directives/2026-10-18-229-not-i6-item-23-words-approved-no-release-line-rule-00-e2e-readme-entries-227-merged.md:14 @ 346dc358`, item 3.
- **Verdicts:** proportional (`state/directives/2026-10-05-product-first-direction.md`, section 2). Wording follows the 2026-10-11 direction, item 2, and `governance/AUTONOMY.md` §31.

**Drafted by** the architect on the custodian's brief, read only at main 346dc358 (call it C). It re-drafts `state/consults/2026-10-23-walkthrough-stale-cites-l5-degrees-p1-architect-draft.md`, which was read at cfbf1e80.

**Whose words.** The new spans are the architect's. The human approved the W-FN and W-L1 words by the OPEN-1 and OPEN-2 yeses, but did not type them. No existing quoted span changes. Whether the L1 and L5 text being replaced was typed by the human is checked at B (§5).

**Committed before any change**, on main, by the custodian. Append-only once committed. An amendment made after any outcome has been seen says so in its first line.

**Gating: full form and full gating** (`governance/AUTONOMY.md` §21a, §25(e)).
- By size the piece is under §21c: 8 lines in one non-generated file.
- W-L5 and W-L1 restate properties currently under test, which is §21a's fourth category (`governance/AUTONOMY.md:325-327 @ 346dc358`):
  - mid-fill silence: `frontends/shell/src/residency/candidateArmSession.test.ts:629 @ 346dc358` and `frontends/shell/src/residency/candidateArmSession.test.ts:3172 @ 346dc358`;
  - the one clear: `frontends/shell/src/residency/candidateArmSession.test.ts:3113 @ 346dc358`;
  - no clear after a Cancel: `frontends/shell/src/residency/candidateArmSession.test.ts:3053 @ 346dc358`;
  - the reduction: `frontends/shell/src/residency/residencyStatus.test.ts:399-403 @ 346dc358`;
  - the partial settle: `frontends/shell/src/residency/candidateArmSession.test.ts:2434 @ 346dc358`;
  - string 6: `frontends/shell/src/residency/residencyStatus.test.ts:196-203 @ 346dc358`.
- A five-line `Out-of-scope` line would have to name that category, so no five-line form is committed. The precedent is `governance/forms/frontends/WALKTHROUGH-CURRENT-VIEW-ROWS-G1-N5-PREREGISTRATION.md:23-27 @ 346dc358`.

**Reuse index (the standing step).** This is the brief's output, byte for byte, from the private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c. The query missed. The miss is noted and does not block.

```text
$ node tools/reuse.mjs walkthrough stale line cites   (exit 1)
No prior art recorded for "walkthrough stale line cites". Research it before planning an implementation.
```

## §0. Disclosure

- **Inputs, all read at C:**
  - the node and the rulings above;
  - the sitting script's C4, D1 and D2;
  - Part L (`frontends/shell/MANUAL-WALKTHROUGH.md:768-835 @ 346dc358`);
  - the degrees Part P (`frontends/shell/MANUAL-WALKTHROUGH.md:1457-1494 @ 346dc358`);
  - the code in §2.1;
  - `docs/PREREGISTRATION-TEMPLATE.md`;
  - `governance/AUTONOMY.md` §21 and §25.
- **Two Parts are lettered P.** This piece edits the degrees one (`frontends/shell/MANUAL-WALKTHROUGH.md:1457 @ 346dc358`). The points Part P (`frontends/shell/MANUAL-WALKTHROUGH.md:1616 @ 346dc358`) has its own P1 at `frontends/shell/MANUAL-WALKTHROUGH.md:1639 @ 346dc358`. That row is not touched.
- **B and pins.** B is the merge-base when the branch is cut. The worker re-reads every cite at B. A moved line is a class 3 row before any change, and B's tree is authoritative for it. A changed fact is an invalidator (§5). Every pin here is historical, a read at C. Each is pinned by script, contiguous on one line (round 15 (d) and (e)).
- **Precedents:** `walkthrough-current-view-rows-g1-n5` (`governance/PLAN.yaml:5490 @ 346dc358`, done) and `walkthrough-row-f7-cli-refusal` (`governance/PLAN.yaml:4762 @ 346dc358`, done).
- **Dispatch (the custodian's call, not an OPEN item):** the node is `blocked` on `adr-020-appended-note` (`governance/PLAN.yaml:6069-6071 @ 346dc358`). That piece is held on a red line. The 2026-10-31 direction, item 4, says such a piece leaves its slot and the next one runs (`state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md:14 @ 346dc358`).
- Nothing is measured: no fixture run and no app run.

## §1. What this preregistration may and may not claim

- **May claim:** each rewritten span states what the shipped shell does at B, checked clause by clause in §2.1.
- **May not claim:**
  - any change to code, a test, an assertion or a string the app shows;
  - that entry 48's L5 re-check is discharged (that is C4's question);
  - that P1 has been run: its result log is blank at `frontends/shell/MANUAL-WALKTHROUGH.md:1491-1494 @ 346dc358`;
  - any edit to a result log, `KNOWN-LIMITATIONS.md` or an ADR;
  - any performance figure or duration (ADR-018).
- **ADRs:** none is amended. ADR-010 rule 5 is named only by the code comments.

## §2. The change

### 2.0 Rules

- (a) New text cites items by name. It never uses a bare `path:line`.
- (b) Quotation marks wrap only text byte-copied from its source. Every existing quoted span stays byte-identical: string 6 in L5's bracket, entry 36's quote in L1, and the probe.
- (c) Each row stays one physical line. Only the named span changes. No dated tag is added.
- (d) No backticked snake_case token with a test prefix is written.
- (e) Old spans are copied from my read at C. The worker's script at B is the proof (§4).

### 2.1 Rows

**W-L5: row L5, the Expected outcome cell** (`frontends/shell/MANUAL-WALKTHROUGH.md:819 @ 346dc358`)

- **Old span:**
  `— the fill's silence is by 1b's own design, not a miss: a within-budget fill emits `candidate-fill-progress` → no status (`residencyStatus.ts:192`), and a within-budget settle that is incomplete by truncation is *"deliberately left silent"* (`candidateArmSession.ts:693-696`) — recorded as DECISIONS-PENDING entry 43 because it is silence representing state, the class entry 36 ruled against.`
- **Defects at C:**
  - `residencyStatus.ts:192` is `stalled: event.stalled,` in the over-budget case (`frontends/shell/src/residency/residencyStatus.ts:187-194 @ 346dc358`). The reduction it should name is `frontends/shell/src/residency/residencyStatus.ts:201-205 @ 346dc358`.
  - `candidateArmSession.ts:693-696` is now the middle of `currentSettledState`'s doc comment (`frontends/shell/src/residency/candidateArmSession.ts:687-699 @ 346dc358`).
  - "deliberately left silent" has no occurrence in `candidateArmSession.ts`. It survives only as history at `frontends/shell/src/residency/residencyStatus.ts:56 @ 346dc358` and `frontends/shell/src/residency/residencyStatus.ts:396 @ 346dc358`.
  - "a within-budget fill emits `candidate-fill-progress`" claims too much: mid-fill, nothing is sent except the one clear (`frontends/shell/src/residency/candidateArmSession.ts:835-841 @ 346dc358`).
- **New span (the architect's words):**
  `— the fill's silence is by 1b's own design, not a miss: until a within-budget fill settles, `emitResidencyStatus` sends no status, except one `candidate-fill-progress` while the complete status it sent last is still standing, and `nextResidencyStatus` reduces that event to no status. A within-budget settle left incomplete by truncation was silent before F2, which DECISIONS-PENDING entry 43 recorded as silence representing state, the class entry 36 ruled against; since F2, `emitResidencyStatus`'s `settled-partial` branch sends `settled: "partial"`, which `residencyStatusText` renders as string 6 (`emitResidencyStatus` in `frontends/shell/src/residency/candidateArmSession.ts`; `nextResidencyStatus` and `residencyStatusText` in `frontends/shell/src/residency/residencyStatus.ts`).`
- **Clause check at C:**
  - **"until a within-budget fill settles, `emitResidencyStatus` sends no status".** True.
    - The over-budget branch returns before the within-budget branches (`frontends/shell/src/residency/candidateArmSession.ts:725-756 @ 346dc358`).
    - The partial-failure and partial branches need a settled reading (`frontends/shell/src/residency/candidateArmSession.ts:775-807 @ 346dc358`; `settledState` at `frontends/shell/src/residency/residencyStatus.ts:330-336 @ 346dc358`).
    - A not-settled reading returns at `frontends/shell/src/residency/candidateArmSession.ts:840 @ 346dc358`.
    - Pinned by `frontends/shell/src/residency/candidateArmSession.test.ts:629-658 @ 346dc358` and `frontends/shell/src/residency/candidateArmSession.test.ts:3172-3194 @ 346dc358`.
  - **"except one `candidate-fill-progress` while the complete status it sent last is still standing".** True.
    - The flag is set only beside the `settled: "complete"` dispatch (`frontends/shell/src/residency/candidateArmSession.ts:842-847 @ 346dc358`).
    - It is cleared by every other dispatch of the function (`frontends/shell/src/residency/candidateArmSession.ts:754 @ 346dc358`, `:781`, `:805`, all @ 346dc358).
    - It is cleared by a fresh generation (`frontends/shell/src/residency/candidateArmSession.ts:1669 @ 346dc358`).
    - It is cleared by `relinquishFill`, the Cancel (`frontends/shell/src/residency/candidateArmSession.ts:1780-1788 @ 346dc358`).
    - The clear fires once and resets the flag (`frontends/shell/src/residency/candidateArmSession.ts:835-839 @ 346dc358`).
    - Pinned by `frontends/shell/src/residency/candidateArmSession.test.ts:3113-3170 @ 346dc358` (one clear) and `frontends/shell/src/residency/candidateArmSession.test.ts:3053-3099 @ 346dc358` (none after a Cancel).
    - Named, not claimed: `handleViewportChange` also sends one clear after a Cancel (`frontends/shell/src/residency/candidateArmSession.ts:1498-1506 @ 346dc358`). L5 has no Cancel.
  - **"`nextResidencyStatus` reduces that event to no status".** True.
    - The reduction: `frontends/shell/src/residency/residencyStatus.ts:201-205 @ 346dc358`.
    - App threads every candidate event through it (`frontends/shell/src/App.tsx:1638-1644 @ 346dc358`).
    - No `.residency-status` element is rendered while the status is null (`frontends/shell/src/App.tsx:2349-2352 @ 346dc358`).
    - Pinned by `frontends/shell/src/residency/residencyStatus.test.ts:399-403 @ 346dc358`.
  - **"was silent before F2, which … entry 43 recorded … entry 36 ruled against".** True.
    - The code's own history: `frontends/shell/src/residency/candidateArmSession.ts:784-798 @ 346dc358` and `frontends/shell/src/residency/residencyStatus.ts:53-60 @ 346dc358`.
    - The entries are cited by number (round 14 (a′)). The gate resolves entry 43.
  - **"since F2, … `settled-partial` branch sends `settled: "partial"`".** True.
    - Truncation makes `isFillComplete` false (`frontends/shell/src/residency/candidateArmSession.ts:671 @ 346dc358`).
    - With no failure, a settled reading is `settled-partial` (`frontends/shell/src/residency/residencyStatus.ts:334-335 @ 346dc358`).
    - The branch: `frontends/shell/src/residency/candidateArmSession.ts:799-807 @ 346dc358`.
    - Pinned by `frontends/shell/src/residency/candidateArmSession.test.ts:2434-2462 @ 346dc358`. That test uses a headroom-dropped tile rather than truncation; both cases make `isFillComplete` false.
  - **"which `residencyStatusText` renders as string 6".** True.
    - `frontends/shell/src/residency/residencyStatus.ts:462 @ 346dc358` returns the constant at `frontends/shell/src/residency/residencyStatus.ts:434-435 @ 346dc358`.
    - Its literal matches L5's string-6 quote (§4 item 4 proves this).
    - Pinned by `frontends/shell/src/residency/residencyStatus.test.ts:196-203 @ 346dc358`.
  - **Where the named items are:** `emitResidencyStatus` at `frontends/shell/src/residency/candidateArmSession.ts:713 @ 346dc358`; `nextResidencyStatus` at `frontends/shell/src/residency/residencyStatus.ts:175 @ 346dc358`; `residencyStatusText` at `frontends/shell/src/residency/residencyStatus.ts:450 @ 346dc358`.
- **Unchanged in L5:**
  - the Step cell and both dated brackets;
  - the bold expectation;
  - the `stalled` sentences: `fillActivity` is computed only on the over-budget branch (`frontends/shell/src/residency/candidateArmSession.ts:725-736 @ 346dc358`);
  - "What to watch instead" and the probe.

**W-P1: the degrees Part P, row P1, the Step cell** (`frontends/shell/MANUAL-WALKTHROUGH.md:1476 @ 346dc358`)

- **Old span:** `(`frontends/shell/src/residency/candidateArmSession.ts:1218-1221`)`.
- **Defect at C:** those lines are the middle of the "Re-review S5" comment. The call is `frontends/shell/src/residency/candidateArmSession.ts:1229-1233 @ 346dc358`, inside `establishFrameFromExtent` (`frontends/shell/src/residency/candidateArmSession.ts:1209-1235 @ 346dc358`). D2's own ":1224-1228" is now stale too.
- **New span (the architect's words):** `(the `logSessionEvent` call in `establishFrameFromExtent` that writes the `candidate-grid-frame-established` event, `frontends/shell/src/residency/candidateArmSession.ts`)`
- **Clause check at C:**
  - The call is at `frontends/shell/src/residency/candidateArmSession.ts:1229 @ 346dc358`, inside the function that opens at `:1209`.
  - The event name is at `:1230`.
  - It is written once per frame: see the guards at `:1210` and `:1215-1217`.
  - The text carries `baseSpan=${frame.baseSpan}` (`:1231`).
  - All four cites are @ 346dc358. True.
- **Unchanged in P1:**
  - `residencyArm.ts:50`'s `DEFAULT_RESIDENCY_ARM`, which still holds at `frontends/shell/src/residency/residencyArm.ts:50 @ 346dc358`;
  - the expected outcome: `MIN_ANCHOR_SPAN`'s degree value `1e-6` is at `frontends/shell/src/canvas/tileGrid.ts:97-101 @ 346dc358`.

**W-FN: Part L's fixture note** (OPEN-1, ruled yes; `frontends/shell/MANUAL-WALKTHROUGH.md:808 @ 346dc358`)

- **Change:** `(`engine/src/fixture.rs:618`)` becomes `(`parcel`'s grid cell in `engine/src/fixture.rs`)`, with no rewrap. These are the ruled words.
- **Defect at C:** `engine/src/fixture.rs:618 @ 346dc358` is the closing brace of `SplitMix64::unit`.
- **Check:**
  - `(gx, gy) = (id % cols, id / cols)` (`engine/src/fixture.rs:1259-1260 @ 346dc358`), with rows rising from `y_lo` (`engine/src/fixture.rs:1264-1266 @ 346dc358`): the layout is row-major by id.
  - `polygons-100k` is regenerated from `FixtureSpec { .. Default::default() }` (`engine/tests/common/mod.rs:81-89 @ 346dc358`).
  - That default is `GeometryMode::Polygon` (`engine/src/fixture.rs:571 @ 346dc358`), which calls `parcel` (`engine/src/fixture.rs:1061-1062 @ 346dc358`). True.

**W-L1: row L1, the Expected outcome cell** (OPEN-2, ruled yes; `frontends/shell/MANUAL-WALKTHROUGH.md:815 @ 346dc358`)

- **Change:** `a within-budget fill emits `candidate-fill-progress`, reduced to no status` becomes `until a within-budget fill settles it sends no status (L5 below has the account)`. These are the ruled words. The trailing `— entry 36's own "re-earn at settle" rule` stays byte-identical, and the gate resolves it against entry 36.
- **Check:** as W-L5's first and third clauses. L1 has no Cancel.

### 2.2 In place; what stays

- **Edited in place:** the four lines named above. No Part is renumbered, and no record under `state/` is edited.
- **Not touched, Part L's result logs:**
  - `frontends/shell/MANUAL-WALKTHROUGH.md:1268-1305 @ 346dc358`;
  - `frontends/shell/MANUAL-WALKTHROUGH.md:1307-1332 @ 346dc358`;
  - `frontends/shell/MANUAL-WALKTHROUGH.md:1334-1360 @ 346dc358`;
  - `frontends/shell/MANUAL-WALKTHROUGH.md:1362-1388 @ 346dc358`.
- **Not touched, the degrees Part P's log:** `frontends/shell/MANUAL-WALKTHROUGH.md:1487-1494 @ 346dc358`.
- **Not touched, Part L's deviation paragraph** (`frontends/shell/MANUAL-WALKTHROUGH.md:825-835 @ 346dc358`). Its words are historical.

### 2.3 Overlap (rule (00); walkthrough Parts are separate paths, a shared Part overlaps)

- **This piece's paths:**
  - (1) `frontends/shell/MANUAL-WALKTHROUGH.md` Part L: rows L1 and L5, and the fixture note;
  - (2) the same file's degrees Part P, row P1;
  - (3) this form, committed on main before the branch;
  - (4) `governance/PLAN.yaml`, with the generated `CUSTODIAN-QUEUE.*` and `site/` files.
- **Not touched:** nothing under `protocol/`, no wire fixture, no `Cargo.lock`, no `package-lock.json`.
- **In flight at C (the brief's lists):**
  - `cut/b2-piece-1c-save-and-reopen`, `cut/port-2-macos-l1-and-app-dirs`, `cut/b1-shell-half-pr-c`, #273, #272 and #271 have no path under `frontends/`. Disjoint.
  - No committed form under `governance/forms/` names Part L or the degrees Part P (my grep at C).
- **Shared:** PLAN.yaml and the generated files, serialized on main.
- **Re-check:** at dispatch, against both slots, the filler slot and every PR awaiting merge.

### 2.4 Portability

No OS-dependent feature, so R3 does not apply.

## §3. Fixtures

None.

## §4. Tests and evidence

- No test is added, renamed or changed, so no mutation is owed. No record of this piece calls any run, a `verify-mutation` run included, an observation of a mutation.
- **Evidence at H.** Each item is one script, run in scratch, with its exit code checked:
  1. `git diff -U0 B...H -- frontends/shell/MANUAL-WALKTHROUGH.md` has exactly four hunks, each removing one line and adding one. They start `| L1 |`, `| L5 |` and `| P1 |`, and the fourth is the line holding `verified this sitting (`. The P1 hunk lies between the degrees Part P heading and the next `## ` heading.
  2. Each edited line is byte-identical between B and H outside its named span.
  3. **The new cites resolve by content at H:**
     - `nextResidencyStatus` holds `case "candidate-fill-progress":` in the group returning `null`;
     - `emitResidencyStatus` holds `if (settled === "settled-partial")` followed by a dispatch with `settled: "partial"`;
     - `emitResidencyStatus` holds `if (settled !== "settled-complete")` with the `{ kind: "candidate-fill-progress" }` dispatch inside `if (standingWithinBudgetComplete)`;
     - `relinquishFill`'s body sets `standingWithinBudgetComplete = false`;
     - `residencyStatusText` returns `SETTLED_PARTIAL_WITHIN_BUDGET_TEXT` for `status.settled === "partial"`;
     - `establishFrameFromExtent` holds `logSessionEvent(`, then whitespace, then `"candidate-grid-frame-established"`;
     - `parcel` holds `(id % cols, id / cols)`;
     - `residencyArm.ts` line 50 holds `export const DEFAULT_RESIDENCY_ARM`.
  4. L5's string-6 quote equals the constant's literal at H, byte for byte.
  5. **Absence at H:**
     - rows L1, L5 and P1 hold no match of `(residencyStatus|candidateArmSession)\.ts:[0-9]`;
     - Part L holds no `fixture\.rs:[0-9]`;
     - the file holds no `deliberately left silent`.
  6. **Positive self-test at B:**
     - The line-content check must fail on each old cite: `residencyStatus.ts` line 192 with `candidate-fill-progress`; `candidateArmSession.ts` lines 693-696 with `deliberately left silent`; lines 1218-1221 with `candidate-grid-frame-established`; `fixture.rs` line 618 with `id % cols`.
     - Item 3's content checks must pass at B.
     - Item 5's patterns must match at B: 3 line cites, 1 `fixture.rs` cite and 1 phrase. A pattern that matches nothing at B voids its H result. No `grep -iF` is used.

## §5. Predictions, declared unchanged, invalidators, falsification

- **Predicted:**
  - E1: §4 items 1 to 6 hold.
  - E2: `verify-cites`, `verify-quotes`, `verify-test-claims` and `verify.mjs` exit 0 at H and in the done commit, each named with the tool's commit. The `queue.mjs` and `site.mjs` checks report current. The `node --test` scripts suites exit 0.
  - E3: PR CI is green.
- **Declared unchanged:**
  - every file except paths (1) to (4);
  - every line except the four in §2.1;
  - every quoted span and every result log;
  - all code, tests and app strings;
  - every record under `state/`.
- **Invalidators (stop and report):**
  - at B, a §2.1 fact differs as a fact and not merely as a moved line: the reduction, the mid-fill return, the flag's set and clear sites, the partial branch, the string-6 mapping or literal, the frame-log call, or `parcel`'s cell;
  - a changed span proves to be the human's typed words (`git log -L`);
  - a new span would need a code, test or string change;
  - another piece in flight edits Part L or the degrees Part P.
- **Falsified if** a rewritten clause is shown untrue at B in the shipped app.

## §6. Instruments

Assertions only (E1 to E3). No measurement and no operator step.

## §7. Declared values and ceilings

- **Counting:** `git diff --numstat B...H -- frontends/shell/MANUAL-WALKTHROUGH.md`, insertions plus deletions. B and H are named in the PR body.
- **Ceiling:** 8 lines (four rows at 1+1 each).
- **Files:** `git diff --name-only B...H` lists at most `frontends/shell/MANUAL-WALKTHROUGH.md`, PLAN.yaml and the generated `CUSTODIAN-QUEUE.*` and `site/` files.
- **Budget:** 30 minutes, as the node carries.
- **No constant is added.** An overrun is class 8, and this section is never edited.

## §8. Block-on-sight

1. A line changed other than the four in §2.1, or a span changed outside them.
2. Any change to code, a test, an assertion or an app string, or anything under `scripts/`.
3. A quotation that is not byte-copied, or a changed byte in an existing quoted span.
4. A clause that claims more than its cite shows. In particular: that every within-budget fill emits `candidate-fill-progress`; that the L5 re-check is discharged; that P1 has been run.
5. A new bare `path:line`, a pin split across lines, or a pin at a branch commit.
6. The points Part P's P1 is touched.
7. A result log or any record under `state/` is edited.
8. W-FN or W-L1 words other than the ruled ones, unless they are a gate's replacement words under §31.
9. A §7 overrun not recorded as class 8, or §7 edited.
10. A scope addition not recorded as class 9 before its change.
11. A record that calls a `verify-mutation` run an observation of a mutation.

## §9. Gates

- **Architect:** each §2.1 clause against the code at B, then §8 item by item.
- **Reviewer:** the diff, §4's items by script with their exit codes, and E1 to E3.
- **Verdicts:** proportional. A clause's truth is Correctness, and E1 to E3 are Evidence. Documentation findings are fixed before the merge, with no re-gate.
- **Wording (§31):** no span is the human's own wording unless the §5 authorship invalidator fires. A gate's replacement words are applied with no re-gate and listed in the PR body.
- **Briefs:** no build and no app run. If the `node --test` suites are classed as heavy, the brief carries THE MACHINE paragraph as written.
- **Operator:** none, and no KNOWN-LIMITATIONS item.
- **Merge:** the PR body asks for a merge commit.

## §10. Amendments

Opens empty and append-only, with classes 1 to 9.

## §11. Open items

| Item | Subject | Status | Red line |
|---|---|---|---|
| OPEN-1 | W-FN | ruled yes (`state/directives/2026-10-23-clicks-245-246-247-sort-window-fix-before-port-2-covering-case-route-1-244-c1-milestone-4-and-1c-open-items-ruled.md:22 @ 346dc358`) | — |
| OPEN-2 | W-L1 | ruled yes (same line) | — |
| OPEN-3 | Stale lines in the same sources (below) | recommended (a) | (a) no; (b) yes |

---

## What changed from the draft of 2026-10-23, and why

1. **Every cite was re-read at 346dc358.**
   - The walkthrough shifted +2 above Part L: L5 is now 819, P1 1476, the fixture note 808, L1 815.
   - `candidateArmSession.ts` shifted by +3 to +5 lines.
   - The test file shifted by +27 or +28 lines.
   - `App.tsx` also moved (1638-1644 and 2349-2352). `App.tsx` is missing from the brief's diff stat, so the custodian should re-run the stat with it included.
   - `residencyStatus.ts` and `residencyStatus.test.ts` did not move.
2. **The stale cites (task 1).**
   - All five old cites are still stale: `residencyStatus.ts:192`, `candidateArmSession.ts:693-696`, `candidateArmSession.ts:1218-1221`, `fixture.rs:618`, and L1's overbroad clause.
   - None was fixed by a later commit.
   - One is stale in a new way: D2's replacement ":1224-1228", which the old draft confirmed, is now stale too. That supports re-aiming by name.
   - L5 and P1 say what the draft says they say: their contents are unchanged, only shifted.
3. **W-L5's second clause was reworded.** "if the last status it sent was the complete one" became "while the complete status it sent last is still standing". At C, `relinquishFill` clears the flag (`frontends/shell/src/residency/candidateArmSession.ts:1780-1788 @ 346dc358`), so after a Cancel the old wording would claim a clear the code does not send. The pinning test is `frontends/shell/src/residency/candidateArmSession.test.ts:3053 @ 346dc358`. The new clause is checked against all three clear sites.
4. **The rulings (task 2).** OPEN-1 and OPEN-2 are folded into §2 as ruled, with their words unchanged, and both still apply at C. §7 rises from 4 to 8 lines, and the reverted-OPEN rows of §8 and §10 are dropped.
5. **The draft's open question on `polygons-100k` is settled.** The engine's regenerator writes through `parcel` (W-FN check).
6. **Other updates:**
   - the form path is now under `governance/forms/frontends/`;
   - the reuse block is the brief's;
   - the in-flight list is the brief's branch lists;
   - both precedents are now done;
   - §4 item 6 locates the moved places by content, not by line;
   - the dependency edge is noted for dispatch.

## OPEN items

**OPEN-3 (new): stale lines found beyond the node, in the sources this piece cites.**
- (i) `frontends/shell/src/residency/candidateArmSession.test.ts:3081-3084 @ 346dc358` says `relinquishFill` "never touches" the flag. That is contradicted by `frontends/shell/src/residency/candidateArmSession.ts:1780-1788 @ 346dc358`.
- (ii) `frontends/shell/src/residency/candidateArmSession.ts:788-791 @ 346dc358` carries bare self-lines "~:546" and ":745". Line 546 is `countedIssuedTileKeys`' doc comment; the phrase it means is at `:637` and the restatement at `:840` (both @ 346dc358).
- **Options:**
  - (a) A finding only. The custodian routes it to a new docs-lane node or adds it to `stale-lines-outside-the-four-files`.
  - (b) Join this piece. That adds a test file and a source file to a ruled walkthrough piece, which is a scope change to an item the human ruled: a red line under the 2026-10-31 direction, item 4.
- **Recommendation: (a).** It is not a red line, so it may be taken under the 2026-10-31 direction, item 4, recorded with its date.

## What I could not settle

- Who typed the L1 and L5 text being replaced (I have no `git log`). It is a §5 invalidator, checked at B.
- Whether HEAD is 346dc358 (no shell), and why `App.tsx` is missing from the diff stat.
- Whether the kernel harness (`kernel/tests/slice_budgets.rs`) writes the same spec. `engine/tests/common/mod.rs:31 @ 346dc358` says it does; I did not trace it.
- Entry 36's wording behind L1's kept quote. I did not read the ledger; the gate resolves it.
- In the ruled W-L1 words, "it" reads as the fill. If a gate finds that unclear, its replacement words apply under §31.
- Whether the degrees Part P is on the sitting's list (the sitting script's own open item).
- All sha256 values (no shell).
