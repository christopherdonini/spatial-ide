*Custodian's filing note (2026-10-23): the form for `walkthrough-stale-cites-l5-degrees-p1`, drafted ahead of its turn by the architect, read only at main cfbf1e80 (the docs lane's second, after adr-020-appended-note, by the human's item 4 of the weekend message). The run 13:03:52Z to 13:10:48Z by its transcript (Grep 28, Read 30, Glob 2; no Write, Edit or Bash). Nothing is committed from it until its turn. Its OPEN-1 (Part L's fixture-note cite) and OPEN-2 (L1's matching clause) are the human's; it departs from the sitting script's D1 and D2 words, as it says, and those words were never the human's. Extracted by script from its SubagentHandback call; nothing else is changed. Its sha256, from line 5 to the end, is a16d18dca62eebd97e143895dc29bd73eafb833f9a5a57dc1badcf9d789da7dc.*

---

Drafted: walkthrough-stale-cites-l5-degrees-p1, at main cfbf1e80

Scope of this draft. I read the main checkout only. Its HEAD is cfbf1e80, according to the session's git snapshot; I have no shell to confirm it. I computed no sha256, because I have no shell: the custodian pins every cite by script. In that checkout PLAN.yaml has uncommitted edits, so I cite the node by its id and not by line. Every other file cited below is clean in the working tree.

---

# MANUAL-WALKTHROUGH.md rows L5 and the degrees Part P's P1: stale line cites re-aimed by name. Preregistration (full form)

File: `frontends/shell/WALKTHROUGH-STALE-CITES-L5-DEGREES-P1-PREREGISTRATION.md`

**Authority.**
- **The node:** PLAN node `walkthrough-stale-cites-l5-degrees-p1`, cited by id. Its summary names the sitting script's D1 and D2, and it requires correction "by cite, not by verdict" (the custodian's summary, not the human's words).
- **Placement:** `state/directives/2026-10-23-weekend-covering-case-s1-session-log-redaction-s2-governance-and-docs-order-v0-2-scope-port-2-approved.md:14 @ cfbf1e80`, item 4. This is the docs lane's second piece, after `adr-020-appended-note`.
- **The findings:** `state/drafts/sitting-script-2026-10-23.md:383-387 @ cfbf1e80` (D1, D2), and C4's pointer to them at `state/drafts/sitting-script-2026-10-23.md:309 @ cfbf1e80`.
- **The lane's terms:** the docs lane, documents only. Rule (00) applies against both slots and every PR awaiting merge.
- **Verdicts:** proportional (`state/directives/2026-10-05-product-first-direction.md`, section 2). Wording follows the 2026-10-11 direction, item 2, and `AUTONOMY.md` §31.

**Drafted by** the architect, on the custodian's brief, read only at main cfbf1e80 (call this C).

**These words are the architect's, not the human's.** No quoted span in either row changes. Whether the explanatory text of L5 that this piece rewrites was typed by the human is confirmed by the worker at B (§5, invalidators). To my reading it is the custodian's correction text from 2026-09-06 and 2026-09-07.

**Committed before any code.** Append-only once committed. An amendment made after any outcome has been seen says so in its first line.

**Gating: full form and full gating** (`AUTONOMY.md` §21a, §25(e)).
- By size the piece is under §21c: 4 lines, and 1 non-generated file besides the form and PLAN.yaml.
- L5's rewritten clauses restate properties currently under test, which is §21a category 4:
  - while a within-budget fill has not settled, no status is sent: `frontends/shell/src/residency/candidateArmSession.test.ts:602 @ cfbf1e80` and `frontends/shell/src/residency/candidateArmSession.test.ts:3144 @ cfbf1e80`;
  - `candidate-fill-progress` reduces to no status: `frontends/shell/src/residency/residencyStatus.test.ts:399-403 @ cfbf1e80`;
  - a settle that is within budget but incomplete sends `settled: "partial"`: `frontends/shell/src/residency/candidateArmSession.test.ts:2406 @ cfbf1e80`;
  - that settle renders string 6: `frontends/shell/src/residency/residencyStatus.test.ts:195-203 @ cfbf1e80`.
- A five-line `Out-of-scope` line would have to name category 4, so by §25(e) no five-line form is committed. This is the precedent of `frontends/shell/WALKTHROUGH-CURRENT-VIEW-ROWS-G1-N5-PREREGISTRATION.md` (its Gating paragraph).

**Reuse index (the standing step).** The output below is the brief's, byte for byte (`node tools/reuse.mjs` in the private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c). Both queries miss. The miss is noted and does not block.

```text
$ node tools/reuse.mjs stale line cite
No prior art recorded for "stale line cite". Research it before planning an implementation.
$ node tools/reuse.mjs walkthrough row citation
No prior art recorded for "walkthrough row citation". Research it before planning an implementation.
```

## §0. Disclosure

- **Inputs:**
  - the node;
  - the sitting script's C4, D1 and D2;
  - Part L (`frontends/shell/MANUAL-WALKTHROUGH.md:766-833 @ cfbf1e80`) and its result logs (`frontends/shell/MANUAL-WALKTHROUGH.md:1266-1372 @ cfbf1e80`);
  - the degrees Part P (`frontends/shell/MANUAL-WALKTHROUGH.md:1455-1492 @ cfbf1e80`);
  - the code in §2.1, read at C;
  - `AUTONOMY.md` §21 and §25(e);
  - `docs/PREREGISTRATION-TEMPLATE.md`;
  - the G1/N5 form.
- **Two Parts are lettered P.** This piece edits the degrees one: "Part P — crs-unit-fact-and-bounds" (`frontends/shell/MANUAL-WALKTHROUGH.md:1455 @ cfbf1e80`). The points Part P has its own P1 (`frontends/shell/MANUAL-WALKTHROUGH.md:1637 @ cfbf1e80`), and that row is not touched.
- **The base.** B is the merge-base on main when the branch is cut. The worker re-reads every cite at B. A moved line is a class 3 row before any code, and B's tree is authoritative for it. A changed fact is an invalidator (§5).
- **Pins are historical.** Each `path:line @ cfbf1e80` here is a read at C. The custodian pins it by script, contiguous on one line (round 15 (d), (e)).
- **Precedent.** At C PLAN.yaml has one node whose id starts `walkthrough-row-`: `walkthrough-row-f7-cli-refusal` (#244). It is in progress, not merged. The merged precedent for correcting a row by cite is `walkthrough-current-view-rows-g1-n5` (PR #239, done). Its §2.0 rules, §4 evidence shape and §7 counting are reused here.
- **Found beyond the node, marked (A):**
  - **(A1)** Part L's fixture note cites `engine/src/fixture.rs:618` for the row-major layout (`frontends/shell/MANUAL-WALKTHROUGH.md:806 @ cfbf1e80`). At C, line 618 is the body of `SplitMix64::range`. The layout is `parcel`'s grid cell, `(id % cols, id / cols)` (`engine/src/fixture.rs:1258-1260 @ cfbf1e80`). The fact still holds: ids fill rows from `y_lo` upward (`engine/src/fixture.rs:1264-1266 @ cfbf1e80`). See OPEN-1.
  - **(A2)** L1 makes the same overbroad claim as L5, that a within-budget fill emits `candidate-fill-progress` (`frontends/shell/MANUAL-WALKTHROUGH.md:813 @ cfbf1e80`). It carries no line cite. See OPEN-2.
- Nothing is measured. There is no fixture run and no app run, so the drive confound does not apply.

## §1. What this preregistration may and may not claim

- **May claim:** each rewritten span states what the shipped shell does at B, checked clause by clause in §2.1.
- **May not claim:**
  - any change to code, a test, an assertion, or a string the app shows;
  - that the L5 re-check owed under entry 48 is discharged (that is C4's question to the human);
  - that P1 has been run (its result log is blank at `frontends/shell/MANUAL-WALKTHROUGH.md:1489-1492 @ cfbf1e80`);
  - any edit to a result log, to `KNOWN-LIMITATIONS.md` or to an ADR;
  - any performance figure.
- **ADRs cited, none amended:** ADR-010 rule 5 (named in the code comments only), ADR-018 (no duration enters either row).

## §2. The change

### 2.0 Rules

- **(a)** New text cites by item name (function, file). It never cites by a bare `path:line`.
- **(b)** Quotation marks wrap only text byte-copied from its source. Every existing quoted span in L5 and P1 stays byte-identical, including the string-6 quote in L5's 2026-09-07 bracket.
- **(c)** Each row stays one physical line. Only the span named for that row changes. No dated correction tag is added; the form and the PR are the record.
- **(d)** No backticked snake_case token with a test prefix is written, so `verify-test-claims` sees no new test claim.
- **(e)** The old spans below are copied from the architect's read at C. The worker's script at B is the proof (§4).

### 2.1 Rows

**W-L5: Part L, row L5, the Expected outcome cell** (`frontends/shell/MANUAL-WALKTHROUGH.md:817 @ cfbf1e80`).

- **Stale span** (copied from the read):

  `— the fill's silence is by 1b's own design, not a miss: a within-budget fill emits `candidate-fill-progress` → no status (`residencyStatus.ts:192`), and a within-budget settle that is incomplete by truncation is *"deliberately left silent"* (`candidateArmSession.ts:693-696`) — recorded as DECISIONS-PENDING entry 43 because it is silence representing state, the class entry 36 ruled against.`

- **What the cites claim, and what is there at C:**
  - `residencyStatus.ts:192` is meant to point at the `candidate-fill-progress` → no-status reduction. At C, line 192 is `stalled: event.stalled,` in the over-budget case (`frontends/shell/src/residency/residencyStatus.ts:187-194 @ cfbf1e80`). The reduction is `case "candidate-fill-progress": return null;` in `nextResidencyStatus` (`frontends/shell/src/residency/residencyStatus.ts:201-205 @ cfbf1e80`).
  - `candidateArmSession.ts:693-696` is meant to point at the silent truncated settle. At C, those lines are part of `currentSettledState`'s doc comment about the untiled-stream read (`frontends/shell/src/residency/candidateArmSession.ts:691-696 @ cfbf1e80`).
  - **The quoted words no longer exist in that file.** The phrase "deliberately left silent" has zero occurrences in `candidateArmSession.ts` at C. It survives only as history in `residencyStatus.ts`'s comments, naming the text F2 replaced (`frontends/shell/src/residency/residencyStatus.ts:56 @ cfbf1e80`, `frontends/shell/src/residency/residencyStatus.ts:396 @ cfbf1e80`).
  - Since F2, the truncated within-budget settle is the `settled-partial` branch, which sends `settled: "partial"` (`frontends/shell/src/residency/candidateArmSession.ts:796-804 @ cfbf1e80`).
- **A third defect, in the same span:** "a within-budget fill emits `candidate-fill-progress`" is overbroad. Mid-fill, `emitResidencyStatus` sends nothing, and sends `candidate-fill-progress` only once, to clear a complete reading that was standing (`frontends/shell/src/residency/candidateArmSession.ts:832-837 @ cfbf1e80`). The test at `frontends/shell/src/residency/candidateArmSession.test.ts:3144 @ cfbf1e80` pins exactly that.
- **New span (the architect's words, not the human's):**

  `— the fill's silence is by 1b's own design, not a miss: until a within-budget fill settles, `emitResidencyStatus` sends no status, except one `candidate-fill-progress` if the last status it sent was the complete one, and `nextResidencyStatus` reduces that event to no status. A within-budget settle left incomplete by truncation was silent before F2, which DECISIONS-PENDING entry 43 recorded as silence representing state, the class entry 36 ruled against; since F2, `emitResidencyStatus`'s `settled-partial` branch sends `settled: "partial"`, which `residencyStatusText` renders as string 6 (`emitResidencyStatus` in `frontends/shell/src/residency/candidateArmSession.ts`; `nextResidencyStatus` and `residencyStatusText` in `frontends/shell/src/residency/residencyStatus.ts`).`

- **Clause check (at C):**
  - **"until a within-budget fill settles, `emitResidencyStatus` sends no status":**
    - The over-budget branch returns early (`frontends/shell/src/residency/candidateArmSession.ts:722-753 @ cfbf1e80`).
    - The `settled-partial-failure` and `settled-partial` branches need a settled reading (`frontends/shell/src/residency/candidateArmSession.ts:772-804 @ cfbf1e80`; `settledState` at `frontends/shell/src/residency/residencyStatus.ts:330-336 @ cfbf1e80`).
    - A `not-settled` reading reaches `return; // mid-fill or a re-plan is pending -- absence is honest` (`frontends/shell/src/residency/candidateArmSession.ts:832-837 @ cfbf1e80`).
    - The test at `frontends/shell/src/residency/candidateArmSession.test.ts:602 @ cfbf1e80` pins this. True.
  - **"except one `candidate-fill-progress` if the last status it sent was the complete one":**
    - The flag is set only beside the `settled: "complete"` dispatch (`frontends/shell/src/residency/candidateArmSession.ts:839-844 @ cfbf1e80`).
    - Every other outcome clears it (`frontends/shell/src/residency/candidateArmSession.ts:505-514 @ cfbf1e80`).
    - The clear dispatches the event once and resets the flag (`frontends/shell/src/residency/candidateArmSession.ts:833-836 @ cfbf1e80`).
    - Tests at `frontends/shell/src/residency/candidateArmSession.test.ts:3085 @ cfbf1e80` and `frontends/shell/src/residency/candidateArmSession.test.ts:3144 @ cfbf1e80`. True.
    - Named, not claimed: `handleViewportChange` also sends one `candidate-fill-progress` after a Cancel (`frontends/shell/src/residency/candidateArmSession.ts:1493-1501 @ cfbf1e80`). L5 involves no Cancel, and the clause speaks only of `emitResidencyStatus`.
  - **"`nextResidencyStatus` reduces that event to no status":**
    - The reduction: `frontends/shell/src/residency/residencyStatus.ts:201-205 @ cfbf1e80`.
    - App threads every candidate event through it (`frontends/shell/src/App.tsx:1585-1590 @ cfbf1e80`).
    - App renders no `.residency-status` element when the status is null (`frontends/shell/src/App.tsx:2287-2290 @ cfbf1e80`).
    - Test at `frontends/shell/src/residency/residencyStatus.test.ts:399-403 @ cfbf1e80`. True.
  - **"A within-budget settle left incomplete by truncation was silent before F2, which DECISIONS-PENDING entry 43 recorded as silence representing state, the class entry 36 ruled against":**
    - The code's own history of the change: `frontends/shell/src/residency/candidateArmSession.ts:781-795 @ cfbf1e80` and `frontends/shell/src/residency/residencyStatus.ts:53-60 @ cfbf1e80`.
    - The row's own bracket already says so.
    - This keeps the old span's meaning, moved to the past tense. Entries 43 and 36 are cited by number (round 14 (a′)). The gate resolves entry 43 against the ledger. True.
  - **"since F2, `emitResidencyStatus`'s `settled-partial` branch sends `settled: "partial"`":**
    - Truncation makes `isFillComplete` false (`frontends/shell/src/residency/candidateArmSession.ts:668 @ cfbf1e80`).
    - With no failure recorded, a settled reading is `settled-partial` (`frontends/shell/src/residency/residencyStatus.ts:334-335 @ cfbf1e80`).
    - The branch: `frontends/shell/src/residency/candidateArmSession.ts:796-804 @ cfbf1e80`.
    - Test at `frontends/shell/src/residency/candidateArmSession.test.ts:2406 @ cfbf1e80`. That test uses a headroom-dropped tile, not truncation; both reach this branch by the same `isFillComplete` false. True.
  - **"which `residencyStatusText` renders as string 6":**
    - `frontends/shell/src/residency/residencyStatus.ts:462 @ cfbf1e80` returns `SETTLED_PARTIAL_WITHIN_BUDGET_TEXT`.
    - The constant is at `frontends/shell/src/residency/residencyStatus.ts:434-435 @ cfbf1e80`.
    - It is byte-equal to the string-6 quote in the row's bracket (§4 item 4 proves this by script).
    - Test at `frontends/shell/src/residency/residencyStatus.test.ts:196-203 @ cfbf1e80`. True.
  - **The named items' places:** `emitResidencyStatus` (`frontends/shell/src/residency/candidateArmSession.ts:710 @ cfbf1e80`), `nextResidencyStatus` (`frontends/shell/src/residency/residencyStatus.ts:175 @ cfbf1e80`), `residencyStatusText` (`frontends/shell/src/residency/residencyStatus.ts:450 @ cfbf1e80`).
- **Unchanged in L5:**
  - the Step cell;
  - both dated brackets;
  - the bold expectation "Expect no status text DURING this fill; at settle, string 6 if the covering set was truncated";
  - the `stalled` sentences (still true: `fillActivity`'s stalled reading needs `overBudget`, `frontends/shell/src/residency/residencyStatus.ts:214 @ cfbf1e80`);
  - "What to watch instead";
  - the optional probe, byte for byte.

**W-P1: the degrees Part P, row P1, the Step cell** (`frontends/shell/MANUAL-WALKTHROUGH.md:1474 @ cfbf1e80`).

- **Stale span** (copied from the read): `(`frontends/shell/src/residency/candidateArmSession.ts:1218-1221`)`.
- **What it claims, and what is there at C:**
  - The cite claims to point at where the `candidate-grid-frame-established` line is written.
  - At C, lines 1218-1221 are the middle of the doc comment above that call.
  - The call is `logSessionEvent(` at `frontends/shell/src/residency/candidateArmSession.ts:1224-1228 @ cfbf1e80`, with the event name on line 1225. It sits inside `establishFrameFromExtent` (`frontends/shell/src/residency/candidateArmSession.ts:1204-1230 @ cfbf1e80`).
  - D2's ":1224-1228" is confirmed.
- **New span (the architect's words, not the human's):**

  `(the `logSessionEvent` call in `establishFrameFromExtent` that writes the `candidate-grid-frame-established` event, `frontends/shell/src/residency/candidateArmSession.ts`)`

  D2's words carried `logSessionEvent("candidate-grid-frame-established", …)` as a code span. That is not byte-contiguous in the code: a newline and an indent sit between `(` and the string. I replaced it with words, so nothing reads as a quotation.
- **Clause check (at C):**
  - **"the `logSessionEvent` call in `establishFrameFromExtent`":** `frontends/shell/src/residency/candidateArmSession.ts:1224 @ cfbf1e80`, inside the function that opens at `frontends/shell/src/residency/candidateArmSession.ts:1204 @ cfbf1e80`. True.
  - **"that writes the `candidate-grid-frame-established` event":** `frontends/shell/src/residency/candidateArmSession.ts:1225 @ cfbf1e80`. It is written once per frame (the guards at `frontends/shell/src/residency/candidateArmSession.ts:1205 @ cfbf1e80` and `frontends/shell/src/residency/candidateArmSession.ts:1212 @ cfbf1e80`). Its text carries `baseSpan=${frame.baseSpan}` (`frontends/shell/src/residency/candidateArmSession.ts:1226 @ cfbf1e80`), the field P1's expected outcome reads. True.
- **Unchanged in P1:**
  - everything else in the row, including `residencyArm.ts:50`'s `DEFAULT_RESIDENCY_ARM`. That cite still reads: `frontends/shell/src/residency/residencyArm.ts:50 @ cfbf1e80`. It is kept as written. If it has moved at B, that is a class 3 row before code (§0).
  - the expected outcome, whose `MIN_ANCHOR_SPAN` degree value `1e-6` still holds at `frontends/shell/src/canvas/tileGrid.ts:97-102 @ cfbf1e80`.

### 2.2 In place; what stays

- Both rows are edited in place. No Part is renumbered, and no record under `state/` is edited.
- **The human's verdicts and logs are not touched.** For Part L these are the four result-log blocks at `frontends/shell/MANUAL-WALKTHROUGH.md:1266-1303 @ cfbf1e80`, `frontends/shell/MANUAL-WALKTHROUGH.md:1305-1330 @ cfbf1e80`, `frontends/shell/MANUAL-WALKTHROUGH.md:1332-1358 @ cfbf1e80` and `frontends/shell/MANUAL-WALKTHROUGH.md:1360-1372 @ cfbf1e80` onward. For the degrees Part P it is the blank log at `frontends/shell/MANUAL-WALKTHROUGH.md:1485-1492 @ cfbf1e80`.
- Part L's deviation paragraph (`frontends/shell/MANUAL-WALKTHROUGH.md:823-833 @ cfbf1e80`) stays as it is. "a silent truncated settle (entries 36/43 — by design, recorded)" is a historical clause, outside this node.

### 2.3 OPEN-1 (applied only on the human's yes; a yes is class 9, a no is class 5): Part L's fixture-note cite (A1)

- **The change on a yes:** in `frontends/shell/MANUAL-WALKTHROUGH.md:806 @ cfbf1e80`, `(`engine/src/fixture.rs:618`)` becomes `(`parcel`'s grid cell in `engine/src/fixture.rs`)`, with no rewrap.
- **Check:** `(gx, gy) = (id % cols, id / cols)` (`engine/src/fixture.rs:1259-1260 @ cfbf1e80`) is row-major by id. `parcel` is the generator's ring source (`engine/src/fixture.rs:1062 @ cfbf1e80`). The worker confirms at B that `polygons-100k` is written through that path.
- **§7 on a yes:** +2 lines. **Recommended: yes.** It is the same Part, the same defect class, and it is words only.

### 2.4 OPEN-2 (applied only on the human's yes; a yes is class 9, a no is class 5): L1's same clause (A2)

- **The change on a yes:** in L1 (`frontends/shell/MANUAL-WALKTHROUGH.md:813 @ cfbf1e80`), `a within-budget fill emits `candidate-fill-progress`, reduced to no status` becomes `until a within-budget fill settles it sends no status (L5 below has the account)`. The trailing `— entry 36's own "re-earn at settle" rule` stays byte-identical. The gate resolves its quoted span against entry 36 (round 10). I did not read the ledger.
- **Check:** as W-L5's first three clauses.
- **§7 on a yes:** +2 lines. **Recommended: yes.** L1 is read before L5 at a sitting, and as it stands it would repeat the claim this piece corrects.

### 2.5 Overlap (rule 00), walkthrough Parts counted as separate paths

- **This piece's paths:**
  - P1: `frontends/shell/MANUAL-WALKTHROUGH.md` Part L (row L5; also line 806 on OPEN-1 and row L1 on OPEN-2);
  - P2: the same file's degrees Part P (row P1 at the "crs-unit-fact-and-bounds" heading);
  - P3: this form;
  - P4: PLAN.yaml, with the files `queue.mjs` and `site.mjs` regenerate.
  - Nothing is under `protocol/`, `scripts/` or `state/drafts/`.
- **In flight at C, read from forms and PR bodies only:**
  - **#244** edits Part F only, and Part G under its OPEN-2 (`frontends/shell/WALKTHROUGH-ROW-F7-CLI-REFUSAL-PREREGISTRATION.md:164 @ cfbf1e80`). Disjoint.
  - **#246** (milestone 4 PR A) adds the new Part AC and KNOWN-LIMITATIONS items 51 and 52 (`frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:331 @ cfbf1e80`). Disjoint.
  - **Piece 1c step 1** adds a new Part letter (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:1002 @ cfbf1e80`). Disjoint.
  - **#241** has no walkthrough row (`kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:352 @ cfbf1e80`). Disjoint.
  - **#245** (`scripts/hooks/questions-mirror.mjs`, `scripts/hooks/README.md`). Disjoint.
  - **#247** (`scripts/plan/verify-cites.mjs` and its test). Disjoint by path. It changes the tool E2 runs, so E2 names `verify-cites`' commit.
  - **Port-2:** its §7 list (`PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md:260-276 @ cfbf1e80`) holds no walkthrough file. Disjoint.
  - **`adr-020-appended-note`:** one ADR file. Disjoint. It precedes this piece by the human's order.
  - **Covering-case** is stopped before code.
  - **`sitting-wording-n1-to-n7`** depends on this node.
  - PLAN.yaml and the generated files are shared by every node's status edits, serialized on main as usual.
- Rule (00) is re-checked at dispatch, against both slots and every PR awaiting merge.

### 2.6 Portability

No OS-dependent feature. R3 does not apply.

## §3. Fixtures

None.

## §4. Tests and evidence

- No test is added, renamed or changed, so no mutation is owed. No record of this piece calls any run, a `verify-mutation` run included, an observation of a mutation.
- **Evidence at H.** Each item is run by one script, in scratch and not committed, with its exit code checked:
  1. `git diff -U0 B...H -- frontends/shell/MANUAL-WALKTHROUGH.md` has exactly two hunks, each removing one line and adding one line. One starts `| L5 |`. The other starts `| P1 |` and lies between the degrees Part P heading and the next `## ` heading. OPEN items answered yes add their own hunks.
  2. Outside the named spans, each edited line is byte-identical between B and H. The script masks the spans and diffs the lines.
  3. **The new cites resolve by content.** At H:
     - `nextResidencyStatus`'s body holds `case "candidate-fill-progress":` in a group returning `null`;
     - `emitResidencyStatus`'s body holds `if (settled === "settled-partial")` followed by a dispatch carrying `settled: "partial"`, and holds `if (settled !== "settled-complete")` with a `{ kind: "candidate-fill-progress" }` dispatch inside `if (standingWithinBudgetComplete)`;
     - `residencyStatusText` returns `SETTLED_PARTIAL_WITHIN_BUDGET_TEXT` for `status.settled === "partial"` in the `candidate-within-budget` case;
     - `establishFrameFromExtent`'s body holds `logSessionEvent(`, then whitespace, then `"candidate-grid-frame-established"`;
     - line 50 of `residencyArm.ts` holds `export const DEFAULT_RESIDENCY_ARM`.
  4. L5's string-6 quote, extracted from the row, equals `SETTLED_PARTIAL_WITHIN_BUDGET_TEXT`'s literal at H, byte for byte.
  5. **Absence.** At H, rows L5 and P1 contain no match of `(residencyStatus|candidateArmSession)\.ts:[0-9]`, and the file contains no occurrence of `deliberately left silent`.
  6. **Positive self-test at B, on the old cites' failure.** The script's line-content mode is given (path, line range, needle).
     - At B it must **fail** on each old cite: `residencyStatus.ts` 192 with `candidate-fill-progress`; `candidateArmSession.ts` 693-696 with `deliberately left silent`; `candidateArmSession.ts` 1218-1221 with `candidate-grid-frame-established`.
     - At B it must **pass** on the moved places: 201-205; 796-804 with `settled-partial`; 1224-1228.
     - Item 5's two patterns must match at B: 3 cites and 1 phrase. A pattern that matches nothing at B voids its H result (Git Bash `grep -iF` is not used).

## §5. Predictions, declared unchanged, invalidators, falsification

- **Predicted:**
  - E1: §4 items 1 to 6 hold.
  - E2: `verify-cites`, `verify-quotes`, `verify-test-claims` and `verify.mjs` exit 0 at H and in the done commit, each named with the tool's commit. `queue.mjs --check` and `site.mjs --check` report current. The `node --test` scripts suites exit 0.
  - E3: PR CI green.
- **Declared unchanged:**
  - every file but P1 to P4;
  - every row but L5 and P1 (plus line 806 and L1 on the OPEN yeses);
  - every quoted span;
  - every result log;
  - all code, tests and app strings;
  - every record under `state/`.
- **Invalidators (stop and report):**
  - at B, any §2.1 fact differs as a fact and not as a moved line: the reduction, the mid-fill branch, the `settled-partial` branch, the string-6 mapping or literal, or the frame-log call's function or event name;
  - a changed span proves, at B, to be the human's typed words (`git log -L` on the line);
  - a new span would need a code, test or string change;
  - another piece in flight edits Part L or the degrees Part P.
- **Falsified if** a rewritten clause is shown untrue at B in the shipped app.

## §6. Instruments

Assertions only (§4, E1 to E3). No measurement. No operator step for this piece. Both rows are read at the next sitting with their Parts.

## §7. Declared values and ceilings

- **Counting:** `git diff --numstat B...H -- frontends/shell/MANUAL-WALKTHROUGH.md`, insertions plus deletions. B and H are named in the PR body.
- **Ceiling:** at most 4 lines (L5 1+1, P1 1+1). Each OPEN yes adds 2, for at most 8.
- **Files:** `git diff --name-only B...H` lists at most this form, `frontends/shell/MANUAL-WALKTHROUGH.md`, PLAN.yaml and the generated `CUSTODIAN-QUEUE.*` and `site/` files. That is at most 3 non-generated files.
- **Budget:** 30 minutes, as the node carries.
- **No constant is added.** An overrun is class 8, and this section is never edited.

## §8. Block-on-sight

1. A changed line other than those of §2.1 and §2.3 to §2.4 (the latter on a yes), or a span changed outside them.
2. Any code, test, assertion or app-string change, or anything under `scripts/`.
3. A quotation not byte-copied, or a byte changed in an existing quoted span.
4. A new clause claiming more than its cite shows: in particular that every within-budget fill emits `candidate-fill-progress`, that the L5 re-check is discharged, or that P1 has been run.
5. A new bare `path:line` in a rewritten span, a pin split across lines, or a pin at a branch commit.
6. The points Part P's P1 touched.
7. A result log or any record under `state/` edited.
8. OPEN items applied before the human's answer.
9. A §7 overrun not recorded as class 8, or §7 edited.
10. A scope addition not recorded as class 9 before its code.
11. A record calling a `verify-mutation` run an observation of a mutation.

## §9. Gates

- **Full gating, architect and reviewer.**
  - The architect checks each clause of §2.1 against the code at B, then §8 item by item.
  - The reviewer checks the diff, §4's items by script with exit codes, and E1 to E3.
- **Verdicts are proportional.** A clause's truth is Correctness. E1 to E3 are Evidence. Documentation findings are fixed before the merge, with no re-gate.
- **Wording (the 2026-10-11 direction, item 2; §31):** the new spans are not the human's wording, unless §5's authorship invalidator fires. A gate's replacement words are applied with no re-gate and listed in the PR body.
- **Briefs:** no build and no app run. If the custodian classes the `node --test` suites as heavy, the brief carries THE MACHINE paragraph as written.
- **Operator:** none for the piece. No KNOWN-LIMITATIONS item is added or edited.
- **The PR body asks for a merge commit.**

## §10. Amendments

Opens empty, append-only, classes 1 to 9. A yes to an OPEN item is class 9; a no is class 5.

## §11. Open items for the human

| Item | Subject | Recommended | Red line |
|---|---|---|---|
| OPEN-1 | Part L's fixture note: `engine/src/fixture.rs:618` re-aimed to `parcel` (§2.3), words only | yes | no |
| OPEN-2 | L1's matching overbroad `candidate-fill-progress` clause (§2.4), words only, the entry-36 quote kept | yes | no |

---

## How this draft departs from D1's and D2's words (both are the sitting script's architect words, not the human's)

- **D1, first replacement:** it re-aims the cite but keeps "a within-budget fill emits `candidate-fill-progress`". That claim is contradicted by `frontends/shell/src/residency/candidateArmSession.ts:832-837 @ cfbf1e80` and by the test at `frontends/shell/src/residency/candidateArmSession.test.ts:3144 @ cfbf1e80`. W-L5 corrects it.
- **D1, second replacement:** "was silent before F2, and now speaks string 6", once spliced in, leaves "because it is silence representing state" in the present tense, and that sits under "the fill's silence is by 1b's own design" although the settle now speaks. W-L5 splits the span into two sentences.
- **D2:** its code span is not byte-contiguous with the code (§2.1 W-P1). W-P1 uses words instead.

## What I could not settle

- Who wrote L5's explanatory text (I have no git blame). §5 makes it an invalidator, checked at B.
- Whether `polygons-100k` is generated through `parcel` (OPEN-1). I found one `parcel` call and did not trace the slice-budgets generator.
- Entry 36's wording for L1's quoted "re-earn at settle" (OPEN-2). I did not read the ledger; the gate resolves it.
- Whether HEAD is cfbf1e80, and the node's committed bytes: PLAN.yaml has uncommitted edits in the main checkout.
- The branches' actual paths. They are read from forms and PR bodies only, as briefed.
- Whether the degrees Part P is on the sitting's list. The sitting script's own open item carries over.
- All sha256 values (no shell).
