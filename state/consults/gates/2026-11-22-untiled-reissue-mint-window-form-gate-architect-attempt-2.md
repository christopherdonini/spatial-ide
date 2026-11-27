Reviewed: main at 466318621a13f00ae7b1114a4690582be42bdc94, the mint-window form `governance/forms/frontends/UNTILED-REISSUE-MINT-WINDOW-PREREGISTRATION.md` with its Amendment 1 read alone, in the custodian's copy of the amendment (32402 bytes, sha256 900e3af7653d5812388df86b29165c736e5613c4e3fb2aa5d497f896ef8f1033, the bytes appended at 9282833d2408d4ed31e7834fcd9a4b23ea401288) (the custodian's filing note, 2026-11-22: the architect's attempt 2 by ADV-2026-11-22-19, node:untiled-reissue-holds-earlier-look-handle-until-mint@form-gate-architect-2, dispatched at 2026-11-22T16:24:26.886Z; Read 26, Grep 10, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-22T16:24:31Z to 2026-11-22T16:34:16Z by its transcript; 0 calls named the main checkout; no compaction. Filed byte for byte below the rule from its hand-back, 21999 bytes, sha256 8c6bf14cedfff086eb9857b1daecfe73c01c36e08d4e1d62a645f7170b867790, with one final newline added. Its W1 to W10 and the added test are the form's Amendment 2.)

---

Verdict: PASS WITH NOTES. Reviewed: main @ 466318621a13f00ae7b1114a4690582be42bdc94 (detached read checkout C:/dev/wt/read-1122). I read the amendment `<S>/mint-a1-amendment.md` (sha256 900e3af7…1033, per the brief) alone, with the rest of the form carried forward (ADV-2026-11-22-16 item 4). Every path:line below is at that head.

Mapped onto AUTONOMY §22:
- **Correctness:** nothing is open once W1 and W2 land. Each is an untrue claim about a limit, in amendment words, and no code exists yet. My words close them with no re-gate (§31 (d)). Neither is the human's wording.
- **Evidence:** nothing is open. N-6 below is an option for the advisor, not a requirement.
- **Documentation:** W3 to W10 must be fixed before the custodian appends the amendment.

## Check 1. The amendment's item 6, points 1 to 8

1. **Old and new texts.**
   - Every old text occurs once in the form: R1 to R15, A1, A3 to A7 and N1. A8 names its span by description, not by literal text. That is unique, so it is acceptable.
   - Two markup defects (W3):
     - A2's old text is written as ``` ``establishFrameFromExtent` …`` ```. The opening double backtick swallows the text's own leading backtick, so the replacement would leave a stray backtick in §1.
     - N1's old text ends in a space inside its code span. That does not match "no tile `viewportQuery`," in MW1's row.
   - Each new text reads correctly in its sentence.
   - R1 to R15 old and new texts match my attempt-1 report byte for byte. Clause checks are the only exception: item 1's opening says they are written out against full paths, R8 and R11 take theirs from my §1 and §4, and each one says so.
2. **Item 2.1 against the code.** Every listed line does what the item says:
   - `:1150` feeds `latestUnionedExtent`.
   - `:1235` and `:1242` are the early return and the set of `frameEstablished`.
   - `:1283-1290` is `cancelUntiledStream`, which clears the handle at `:1287` before the cancel.
   - `:1293` is the `stopped` return; `:1322` assigns the handle; `:1328` builds the sink.
   - `:1376-1378` is the session-ended route; `:1394` is `wasSelfCancelled`.
   - `:1429-1431` is the gate; `:1503` is term (vi); `:1516` is `startStream`.
   - `:1746` and `:1758` are the reissue's resets; `:1886` is `relinquishFill`'s frame-only cancel.
   - `establishGridFrame` does not check `stopped` (`frontends/shell/src/streaming/tileViewportStreamManager.ts:468-471`).
   - One case statement is untrue: case (iii)'s variant says "no observable differs" (W1).
3. **OPEN-2 (a) against the premise, and the equivalence in 2.2 (3).**
   - The premise: see check 3.
   - The equivalence holds on every path the code reaches. Its stated reason covers only one ordering; W9 gives the full reason.
   - No test claims the difference: "Item 2.2 (3) is named and not mutated".
4. **FE1 to FE3.** Each base prediction holds by reading:
   - **FE1 (a):** at the base, sh_1's orphan terminal passes `:1429` and freezes the frame on E2.
   - **FE1 (b):** at the base, sh_2's terminal resets nothing. `frameEstablished` is false (`:1746`), so `:1241`, `:1242` and `:1254` run with E3. sh_3's terminal then returns at `:1235`.
   - **FE2:** at the base, the first promise is `issued` (`:1520`).
   - **FE3:** green at the base and at the head. It is self-cancelled at `:1286`, frameless, and of the same generation.
   - The fake canvas's union since the last reset matches the real canvas:
     - `frontends/shell/src/canvas/WorkingCanvas.tsx:1661` resets the anchor;
     - `:1762` is `priorExtent`;
     - `:1814` and `:1840` return `fitAnchor: outcome.unionedExtent`.
   - Terminals go only to started streams. FE3's exception to I3 is A6.
   - Drafter's open question (whether a real `stop()` cancel delivers `Cancelled`): FE3's frame assertion does not depend on the kind. Any terminal that `isSessionEndedTerminal` (`frontends/shell/src/streaming/liveTicketSet.ts:58-63`) does not route reaches `:1429` the same way.
5. **The mutations are specific, and P3's tests stay green.**
   - **M-5** fails FE1 (a) and FE1 (b) only.
   - **M-6** fails FE2 at its `startStream` assertion. It fails MW6 there before MW6's `pushTileBatch` assertion. MW7 survives M-6, and the amendment claims no more.
   - **M-7** fails FE3.
   - P3's tests stay green: candidateArmSession.test.ts:225's second terminal returns at `:1235`; `:264`; `:406`, whose extent is null; S-C at `:3339`, whose extent is null; and U-FL2 (b) at `:3925`. U-FL2 (d) at `:3945` stays green, but its description is wrong (W6). At its orphan terminal the extent is already null at the base, so no frame line is written at the base either.
6. **R3′, R13′, A6, item 4 (OPEN-6) and item 68's check.**
   - R3′, R13′ and A6: no defect.
   - OPEN-6: (a) is a sound class-9 reading, because it is declared before any code. Lines cannot be attributed to the addition over the same three files, so in effect the declared figure is 800. That is the advisor's to rule.
   - Item 68: see check 5.
7. **N3, and OPEN-7 to OPEN-9.**
   - N3 is kept as declared, and is correct: `frontends/shell/src/skp/client.ts:59-71` resolves the Console entry before it rethrows, which matches baseline at `frontends/shell/src/streaming/viewportStreamManager.ts:205` and `:211`.
   - OPEN-7 (a) follows ADV-2026-11-22-19 item 4.
   - OPEN-8 and OPEN-9: no defect.
8. **Record rules.**
   - No line cite into the ledger.
   - No bare self-line.
   - The pin is at a main commit, contiguous on one line.
   - The superseded index is present, and "Read the last amendment first" is present.
   - Two quote defects:
     - A5's clause check puts the words "before or after the mint" in quotation marks, but the draft reads "before or after the new look's mint" (W4).
     - P3's elided test name "the untiled first look's own terminal establishes the grid frame ... exactly once" drops the qualifier "from the union of EVERY batch it delivered". It is used only to name the test, which `:225` already locates. Note only.
   - The Cites paragraph's sentence about a "pin: hash by the custodian" marker is stale now that the pin is written in (W5).

## Check 2. The pin in item 2.1 (i)

The pin is `frontends/shell/src/residency/candidateArmSession.ts:1429-1431` @ 466318621a13f00ae7b1114a4690582be42bdc94. At that head those three lines are the `if (!(wasSelfCancelled && manager.gridFrame !== null)) {` line, the `establishFrameFromExtent(latestUnionedExtent);` line and the closing brace. That is the gate expression the item describes: gated only on that operand, not on `wasCurrent`. I have no shell, so I could not recompute the sha256. The custodian or the reviewer recomputes it.

## Check 3. The drafter's note, items 1 and 2 (for the advisor)

**Item 1, the premise of ADV-2026-11-22-16 item 3.** My reading agrees with the drafter's:
- **What OPEN-2 (a) does.** Per §2.3 item 3, it cancels a ticket at its mint, through `skpCancel` and not through `cancelUntiledStream`. That happens before the handle is assigned (`:1322`) and before the sink is built (`:1328`). So that look never joins `selfCancelledUntiledStreams`, and no terminal of it reaches the session.
- **What the premise describes.** "The reissue cancels the earlier look" describes OPEN-1 (c), which the form does not take.
- **Item 3's concern is still real.** A self-cancelled earlier look with no frame exists when `stop()` or the session's end runs inside a frameless mint window:
  - `cancelUntiledStream` reaches the handle the earlier look still holds (`:1283-1290`);
  - its terminal arrives with `wasCurrent` false (`:1287`), with `wasSelfCancelled` true, and with `gridFrame` null;
  - so the one term's `wasSelfCancelled && manager.gridFrame === null` lets it through.
- **A point for the advisor.** If OPEN-1 were ruled (c), the cancelled running look's terminal would arrive self-cancelled and frameless. `latestUnionedExtent` would then hold the newer look's union (`:1758`, `:1150`), so the one term would freeze the frame on it. The conjunct blocks that case. The conjunct holds under either OPEN-1 option; the one term holds only under (a).

**Item 2, whether `stop()` "must keep working as today".**
- **Bootstrap, with no later reissue begun.** Unchanged by construction. The generation operand is true and the rest of the expression is unedited. FE3 and M-7 prove it.
- **The variant, inside a frameless mint window.** Today it differs:
  - the earlier look's batches after the reissue are admitted, because the handle still matches (`:1331`, `:1150`);
  - its self-cancelled terminal passes `:1429`;
  - `establishGridFrame` freezes the frame (`frontends/shell/src/streaming/tileViewportStreamManager.ts:468-471` has no `stopped` check);
  - and it writes a `candidate-grid-frame-established` line (`:1254-1258`) on a superseded look's union.
- **Under the piece,** there is no frame and no line.
- **Nothing plans on that frame afterwards:**
  - `stop()`'s only caller is the teardown: `frontends/shell/src/App.tsx:1844` and `candidateArmSession.ts:1808-1812`;
  - `:1293`, `:1503` and `:1543` stop a stopped session;
  - after the session's end, `reissueUnrestricted` returns at `:1729`, and the manager returns at `frontends/shell/src/streaming/tileViewportStreamManager.ts:519` and `:523`.
- **My reading.** The variant's look is not the bootstrap's current look. Today's frame there is a sibling of item 1's fault, confined to a session that is over and visible only as a session-log line. The bootstrap case keeps working as today. The variant is a change, and W1 names it truthfully. The advisor rules.

## Check 4. The drafter's note, item 4 (R7)

I agree. `governance/AUTONOMY.md:391` reopens a verdict on "a change to source, tests, configuration or fixtures". R7's trigger, "a §7 file or any file under `frontends/shell/src/`", misses several kinds of change:
- `frontends/shell/e2e/`;
- `frontends/shell/src-tauri/`;
- `package.json`;
- `renderer/bundle-viewer/`;
- `kernel/`, `engine/` and `protocol/`.

Any of these can move the e2e result. R7 must stay byte-identical to my attempt-1 report (point 1), so the fix is a superseding R7′ (W7).

## Check 5. Item 68's draft words (A8)

Each clause reads true against the code as it will be built:
- **The four triggers:** `frontends/shell/src/App.tsx:1801` is the binding. It is reached from `:1119-1126` and `:1145-1146` (Apply and Clear), `:2168` (`changeClauses`) and `:2145` (Colour by). The generation rises inside `reissueUnrestricted` before its first await.
- **"its data is not drawn":** `:1744` clears what was drawn, and §2.3 item 4 drops later batches.
- **"asks for no tiles":** `:1497-1512`, gated on the generation-bearing `wasCurrent`.
- **"does not change the status line":** `:1406`, `:1458` and `:1472`, gated the same way.
- **"does not set the grid":** §2.3 item 7. The frame's origin and size are the grid (`frontends/shell/src/canvas/tileGrid.ts:46-51`).
- **"filled as after any other filter change":** `:1497-1512` at the new look's terminal, or the frame first when there is none.

R2's scan reset and R14's Cancel are correctly named as §31 (c) cases, because both need timing inside one round trip.

The `markTilePartial` bullet is not a §31 (c) case, because ordinary use reaches it. It also does not falsify the words:
- `untiledRowsSeen` restarts at the reissue (`:1760`) and, after it, counts only the newer look's admitted rows (`:1156`, with the `onBatch` term);
- so the mark states a true fact about the newer look;
- and the orphan's terminal emits no status.

It is filed in the wrong place (W8). The words are the architect's draft, not the human's. The advisor approves them or replaces them (ADV-2026-11-22-19 item 3).

## Check 6. Contradictions

- **docs/01:** none. Nothing awaits on the canvas. No message states another module's consequence.
- **Template classes:**
  - Class 1 opens the first line.
  - R8 to R10 are pointer fixes, so they are correctly class 3.
  - Class 9: the first line carries "scope addition", and every element it requires is declared before any code: §2 (item 2.2), §4 tests each with a mutation (item 2.3), §5 (R3′, P6, P7, falsification), §8 (R13′) and §9 (item 2.6).
  - Class 9's text says "a standing rule of the human, a permanent ruling or a standing directive". ADV-2026-11-22-16 is a one-off advisor ruling under the delegation. It names class 9 itself (item 3), so the label is the advisor's ruling. Note only.
- **AUTONOMY §21:** consistent; the form is full, with both gates.
- **AUTONOMY §22:** R7 is narrower than `:391`; W7 fixes that.
- **AUTONOMY §31:** the A8 `markTilePartial` placement; W8 fixes that.

## Replacement words

These are the architect's words. None is the human's wording, so under §31 (d) the worker or custodian applies them with no re-gate. Each old text occurs once in the amendment.

**W1 (Correctness; item 2.1 (iii)).** Old:
```text
It is named here and not tested, because no observable differs.
```
New:
```text
It is named here and not tested. The one observable that differs is the session log: today this path can write a `candidate-grid-frame-established` line on the earlier look's post-reissue union, and under the piece it writes none. No single mutation can show it, because two terms each prevent it: §2.3 item 4's `onBatch` term leaves the extent null, and §2.3 item 7's conjunct skips the call (item 2.2 (3)).
```
Clause check:
- "today … can write": `:1331` and `:1150` admit and union the batches; `:1287` and `:1429` let the self-cancelled terminal through; `tileViewportStreamManager.ts:468-471` has no stop check; `:1254-1258` writes the line. "Can" because a batch must arrive between the reissue and the stop.
- "two terms": with only M-2, the conjunct skips the call. With only M-5, the extent is null and the function returns at `:1235`.

**W2 (Correctness; A2's new text).** Old:
```text
It still writes its `candidate-untiled-terminal` line, clears the handle it held and syncs scan liveness; only its frame establishment is now gated (Amendment 1, item 2).
```
New:
```text
It still writes its `candidate-untiled-terminal` line unless it was self-cancelled, clears the handle when it still holds it, and syncs scan liveness; its frame establishment, like its plan, its status and its accounting (§2.3 item 4), is now gated on its generation (Amendment 1, item 2).
```
Clause check:
- `:1394-1405`: the line is written only if the terminal was not self-cancelled.
- `:1359`: the handle is cleared only while the terminal's stream still holds it.
- `:1513`: scan liveness.
- §2.3 items 4 and 7: the gates.
- "Only" was untrue against §1's first may-claim.

**W3 (Documentation; markup).**

A2. Old:
```text
Old: ``establishFrameFromExtent` still runs for it, unchanged (OPEN-3).`` New:
```
New:
```text
Old: `` `establishFrameFromExtent` still runs for it, unchanged (OPEN-3). `` New:
```

N1. Old:
```text
Old: ``no tile `viewportQuery` `` (the text
```
New:
```text
Old: `` no tile `viewportQuery` `` (the text
```

**W4 (Documentation; A5's clause check).** Old:
```text
"before or after the mint": the generation rises at the reissue (§2.3 item 2).
```
New:
```text
"before or after the new look's mint": the generation rises at the reissue (§2.3 item 2), and the look's own generation is captured before its first await (§2.3 item 3).
```

**W5 (Documentation; the Cites paragraph).** Old:
```text
A range marked "pin: hash by the custodian" is to be pinned at that commit.
```
New:
```text
The one pinned range, in item 2.1 (i), carries its hash at that commit.
```

**W6 (Documentation; item 2.4, P3).** Old:
```text
(d) no longer sees the orphan's frame line, and it asserts only planned lines.
```
New:
```text
at (d)'s orphan terminal the extent is null at the base and at the head (the reissue reset it at `:1758`, and sh_3 delivers nothing), so no frame line is written either way, and (d) asserts only planned lines.
```

**W7 (Documentation; R7′, the drafter's note item 4).**

Insertion. Old:
```text
Clause check: the gate cites `governance/AUTONOMY.md:391`.
```
New:
```text
Clause check: the gate cites `governance/AUTONOMY.md:391`.

**R7′ (§10, the architect's attempt 2),** read in place of R7's new text:
```
followed by a text block containing:
```text
If that merge changes any tracked file outside `governance/`, `state/`, `site/` and `docs/`, the reviewer makes a narrow read, and §9.3's e2e runs again at the final head (AUTONOMY §22: a change to source, tests, configuration or fixtures reopens the affected verdict).
```

Item 1's opening. Old:
```text
Items 2.4 and 2.5 supersede R3's new text, R13's item 11 and the line R15 keeps, because of the scope addition, not because those words were in error.
```
New:
```text
Items 2.4 and 2.5 supersede R3's new text, R13's item 11 and the line R15 keeps, because of the scope addition, not because those words were in error. R7′ supersedes R7's new text, whose trigger was narrower than `governance/AUTONOMY.md:391`.
```

The superseded index. Old:
```text
- R3's new text (by R3′);
```
New:
```text
- R3's new text (by R3′);
- R7's new text (by R7′);
```

**W8 (Documentation; A8's not-covered list).** Old:
```text
    - an orphan's terminal still marks the first look's tile partial once the newer look has reached the row limit (`candidateArmSession.ts:1440-1442`, ungated). By reading, the newer look's own terminal records that fact anyway.
```
New:
```text
  - **For the item's comment, true by reading and not a §31 (c) case** (ordinary use reaches it): an orphan's terminal still marks the first look's tile partial once the newer look has reached the row limit (`candidateArmSession.ts:1440-1442`, ungated). After the reissue only the newer look's admitted rows count toward that limit (`:1760`, `:1156`, with §2.3 item 4's `onBatch` term), so the mark states a fact about the newer look, which its own terminal records anyway.
```

**W9 (Documentation; item 2.2 (3)).** Old:
```text
the term and the conjunct give the same frame on every path the code reaches, because the path in (2) has a null extent.
```
New:
```text
the term and the conjunct give the same frame on every path the code reaches: they differ only for a self-cancelled look of an earlier generation while there is no frame, and every such look's terminal reads a null extent, because the only self-cancels that reach a look with no frame are `stop()` and the session's end, whose latches stop any later look from being started (`:1293`, `:1305-1313`, `:1318-1321`, `:1729`) and so from feeding `latestUnionedExtent` after the reissue reset it (`:1758`).
```
Clause check: `relinquishFill` cancels only with a frame (`:1886`). A frame never returns to null once established (`tileViewportStreamManager.ts:469`).

**W10 (Documentation; item 2.1 (iii)'s variant cites).** Old:
```text
`stop()`'s only caller is the teardown (`:1808-1812`).
```
New:
```text
`stop()`'s only caller is the teardown (`:1808-1812`); after the session's end, `reissueUnrestricted` returns at `:1729`, a late mint at `:1318-1321`, and the manager plans nothing (`frontends/shell/src/streaming/tileViewportStreamManager.ts:523`).
```

## Notes

- **N-1 (custodian).** N2 cites `governance/PLAN.yaml:7558` and `:7562`. Do not set the node's gate in the same commit that appends this amendment, if that edit could move those lines (round 14). Put it in a separate commit.
- **N-2 (custodian).** ADV-2026-11-22-19 is cited as Authority. It must be tracked under `state/directives/` before or with the append, because nothing tracked may cite an untracked file as Authority (round 14).
- **N-3 (OPEN-8).** A v0.2 line for the frame fault would land in KNOWN-LIMITATIONS, which is a §7 file. Stop I5 applies if that line's piece is in flight at dispatch.
- **N-4 (OPEN-9).** "the only effect is the cells' size and position" leaves out two other effects:
  - today the orphan's early frame also lets camera changes plan tiles before the current look ends;
  - it moves or drops the frame's session-log line.

  Neither is wrong data, so this is a note only. It is consistent with ADV-2026-11-22-16 item 2's grade.
- **N-5.** I could not recompute any hash. The pin in item 2.1 (i) and the amendment's own sha256 are for the reviewer or custodian.
- **N-6 (option for the advisor).** If the advisor wants case (iii)'s variant proven and not only named, an FE3 (b) would do it with one mutation that removes both terms together:
  - steps: sh_1 delivers E1; a reissue is held; sh_1 delivers E2; `stop()`; sh_1 is cancelled;
  - asserts: no frame and no frame line;
  - at the base it is red, with a frame on E2.

  That would add about 25 lines, inside item 4's ceiling.

## Files read

All under C:/dev/wt/read-1122 at the head:
- governance/forms/frontends/UNTILED-REISSUE-MINT-WINDOW-PREREGISTRATION.md (whole)
- frontends/shell/src/residency/candidateArmSession.ts (1100-1549, 1700-1918; grep for INITIAL_TILE_KEY)
- frontends/shell/src/residency/candidateArmSession.test.ts (200-439, 3280-3389, 3780-3969)
- frontends/shell/src/streaming/tileViewportStreamManager.ts (380-489, 514-525; grep)
- frontends/shell/src/streaming/transport.ts (1-90)
- frontends/shell/src/streaming/liveTicketSet.ts (58-63, by grep)
- frontends/shell/src/streaming/viewportStreamManager.ts (196-217)
- frontends/shell/src/canvas/WorkingCanvas.tsx (1655-1666, 1738-1887; grep)
- frontends/shell/src/canvas/tileGrid.ts (1-60)
- frontends/shell/src/skp/client.ts (40-79)
- frontends/shell/src/App.tsx (1110-1151, 1795-1844, 2136-2175; grep)
- KNOWN-LIMITATIONS.md (item 68's heading, by grep)
- governance/PLAN.yaml (the node, by grep)
- governance/AUTONOMY.md (370-409, 530-553)
- docs/PREREGISTRATION-TEMPLATE.md (95-178)

From `<S>`:
- mint-a1-amendment.md
- mint-a1-draft.md (160-171, 340-387)
- adv-2026-11-22-16-copy.md
- adv-2026-11-22-19-copy.md
- mint-gate-report.md

REPORT PATH: state/consults/gates/2026-11-22-untiled-reissue-mint-window-form-gate-architect-attempt-2.md
