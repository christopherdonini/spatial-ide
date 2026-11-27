Reviewed: PR 359, branch cut/console-stream-lane at 1d20b313dbd3ed625cf02575e7d24a1240a31b8a, in its worktree C:/dev/wt/console67 (the custodian's filing note, 2026-11-22: the architect's narrow re-read after its build gate part 1, node:console-stream-lane-limitation-67@gate-architect-narrow-1, dispatched at 2026-11-22T20:18:50.249Z; its run: Read 15, Grep 11, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-22T20:18:57Z to 2026-11-22T20:22:08Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 8477 bytes, sha256 bb68450a7565965a4cf0abef048a9bae4f15bd5e0320c27198cf23c35c0b541a, byte for byte, nothing masked, with one final newline added. PASS: E1 closed; N1 and N2 Documentation; ADV-2026-11-22-36 item 2's clause read TRUE against push and its lane choice. The brief asked for FAIL if its item 3 did not hold; the architect gave PASS under the directive of 2026-10-05, section 2, and graded its item 3 as N1, Documentation. Its Documentation findings were applied at 12251bc8850127b72a9fb2b5fce63c33ef2d7075.)

---

Verdict: PASS
Reviewed: C:/dev/wt/console67 @ 1d20b313dbd3ed625cf02575e7d24a1240a31b8a
Branch: cut/console-stream-lane. REPORT PATH: state/consults/gates/2026-11-22-console-stream-lane-build-gate-architect-narrow-1.md. Line cites are at 1d20b313. Tag: node:console-stream-lane-limitation-67@gate-architect-narrow-1.

**Summary.** E1 is closed and no Correctness or Evidence finding remains. Under the directive of 2026-10-05, section 2, that is a PASS, even though the brief asks for FAIL when item 3 does not hold. Item 3 is partly a no: my own D3 left out the form's stop text. That is a Documentation finding (N1). It is listed below as must-fix before the merge, with replacement words, and needs no re-gate. N2 is a second Documentation finding of the same kind. Item 5 is TRUE.

## 1. E1

- **Yes, it is the check E1 asked for.** `frontends/shell/e2e/console.mjs:967` matches the reviewer's suggested EV-1 line (`<S>/console-rev-gate-1-report.md:27`) byte for byte. It is a named MEASURE' stop, in the same style as the S7 stops beside it (`:933`, `:936`).
- **It fails only a settled run whose total did not grow.**
  - An unsettled run has already returned at `:965`.
  - `:961` and `:966` have already thrown on a label that does not parse, so both totals are numbers (`parseConsoleLabel`, `:247-250`).
  - The test fires when the change in total is 0 or less. The total cannot go down (count plus drops), so in practice it fires only when the change is exactly 0.
- **Every earlier check stays in force.** The new line sits after `:956`, `:959`, `:961`, `:962`, `:965` and `:966`, and before the split (`:968`) and `measureReadAfterP1` (`:969`). That function's stops (`:931`, `:933`, `:936`, `:938-939`, `:943`) still run on every run that passes it.

## 2. D1 to D6, byte for byte against `<S>/console-arch-gate-1-report.md`

All six old texts are gone: one grep of `frontends/shell` for each old span finds nothing.

| Item | My report | New text at 1d20b313 | Match |
|---|---|---|---|
| D1 | `:131-136` | `console.mjs:38-41`; line 38 was unchanged context | equal |
| D2, first text | `:144` | `console.mjs:864` | equal |
| D2, second text | `:150` | `console.mjs:851`, inside the line | equal |
| D3 | `:158` | `console.mjs:936`, inside the line | equal |
| D4 | `:167` | `console.mjs:751`, inside the line | equal |
| D5 | `:174` | `console.mjs:741` | equal |
| D6 | `:186-190` | `recorder.ts:159-163` | equal |

D6's last clause, that item 67's comment names the report's path and commit, becomes true only with commit 4. The merge check must confirm it, as part 1 said.

## 3. D3 and D4 in place of DOC-2 and DOC-1

- **D4 for DOC-1: yes.** The R ≤ M branch at `console.mjs:751` now prints R, dropS and dropO. That is the R, ΔS and ΔO that Amendment 1 D5 requires, and it is what DOC-1 found missing.
- **D3 for DOC-2: yes in part, no in part.**
  - Yes: the untrue clause DOC-2 found, the drops "more than … the other ring held then", is gone. Every clause left at `:936` is true:
    - `names` holds the other-kind rows among the last L rows (`:912`, `:935`);
    - `a` counts the other-kind entries recorded after P0 (`:900`).
  - No: DOC-2 also pointed to §6 item 4. The form (`governance/forms/frontends/CONSOLE-STREAM-LANE-PREREGISTRATION.md:840`, Amendment 1) gives this stop as "S7, as in 2, with `their count <k> is not <a>`". My D3 does not contain that phrase, and the reviewer's DOC-2 did.
  - This is finding N1, below.

## 4. Nothing else

- The diff touches three files, with 17 lines added and 11 deleted.
  - `console.mjs`: E1 and D1 to D5, 9 lines added and 7 deleted.
  - `recorder.ts`: DOC-3 at `:149` and D6 at `:159-163`, 5 added and 4 deleted. Both edits are inside the comment block at `:135-164`.
  - `consoleViewModel.test.ts`: DOC-4 only, 3 lines added. They close the label `describe` at `:165` and open `describe("groupConsecutiveEntries after a drop (known limitation 67)"` at `:167`.
- In the test file, VL3 and VL3′ (`:168-194`) are the only tests that moved. They use no state from the first `describe`.
- No product line changed.
- The blank line at `consoleViewModel.test.ts:164` is cosmetic. The shell's `package.json` has no formatter, so it is not a finding.

## 5. ADV-2026-11-22-36 item 2: TRUE

The clause read is: "An entry of the first kind never drops an entry of the other kind:" (`<S>/ADV-2026-11-22-36.md:14`). An entry of the first kind cannot evict an entry of the other kind on any path.

- **Callers of `push`.** `push` is private. Its only callers are `record` (`recorder.ts:257`), `recordBindingCommand` (`:288`) and `recordGuiAction` (`:313`).
- **Product callers of those three.**
  - `skp/client.ts:59` always passes a `command: string`.
  - `diagnostics/log.ts:21` records `binding_log_session_event`.
  - `recordNamed` (`recorder.ts:438-443`).
- **Every value `laneOf` can return** (`:318-327`). It returns "stream" or "other", from kind and name only. The switch covers all three kinds.
- **Which entries go to the stream ring.** `isStreamLaneName` (`surfaceRegistry.ts:445-448`) reads exactly the three marked rows (`:88`, `:89`, `:119`). These are the rows K2 names as the first kind (form `:208`).
- **The one other-ring case for a request.** An entry recorded through `record()` with no command goes to the other ring. In the product it cannot happen, because `client.ts:59` always supplies the command. Even then it would not be one of those three rows.
- **The ring each lane writes to.** `push` (`recorder.ts:339-348`) picks one ring from the lane (`:341`). It shifts only that ring, and only when that ring holds 128 (`:342-343`). It counts the drop against that ring (`:344-345`), then pushes onto that ring (`:347`).
- **Nothing else removes or shifts an entry.**
  - Both rings are private and readonly (`:237-238`).
  - The class has no clear method.
  - `entries()` (`:363-373`) and `count()` (`:379-381`) only read.
  - A grep of the shell's `src` (test files excluded) finds no other shift, splice or length write on either ring.
- No own words are needed.

## Findings

**Correctness:** none. **Evidence:** none; E1 is closed.

**Documentation (must be fixed before the merge; neither is the human's wording, so the worker applies these words with no re-gate and the PR body lists them):**

**N1. `console.mjs:936`: the stop text leaves out the form's phrase.** This was my own miss in part 1's D3. The old span occurs once:
```text
${names.length} entries of the other kind are among the newest ${r.L}, not the ${r.a} recorded after P0 (P0:
```
New:
```text
the entries of the other kind among the newest ${r.L}: their count ${names.length} is not ${r.a} (P0:
```
Clause check:
- The prefix and the closing (P0 …; now …) part stay as in item 2 (`:933`, form `:838`). That is the form's "as in 2".
- "the entries of the other kind" are the rows `otherKindName` keeps (`:916-921`, `:935`).
- "among the newest ${r.L}": the rows are the last L (`:912`).
- "their count ${names.length} is not ${r.a}" is the condition at `:936`. It is the form's own text (`:840`).

**N2. `console.mjs:979`: the skip text says "the form" without naming the form.** D2's comment at `:864` does not reach text the run prints. Part 1 did not read this line. Old span (occurs once):
```text
(the form's section 6)
```
New:
```text
(section 6 of the Console form, governance/forms/frontends/CONSOLE-STREAM-LANE-PREREGISTRATION.md)
```
Clause check: the opt-in through `CONSOLE_MEASURE=1` is set out in the form's §6 MEASURE' paragraph (`:409`).

D7 and D8 and the reviewer's DOC-5 still stand for commit 4 and the closing amendment. No decision is missing, so no ADR skeleton is needed.

## Files read

- `<S>/brief-console-arch-narrow-1.md`
- `<S>/console-arch-gate-1-report.md`
- `<S>/console-rev-gate-1-report.md`: EV-1, DOC-1 to DOC-4
- `<S>/c67-fix1.diff`
- `<S>/ADV-2026-11-22-36.md`
- In C:/dev/wt/console67:
  - `frontends/shell/e2e/console.mjs`: 34-43, 245-251, 690-769, 845-1004, and greps
  - `frontends/shell/src/console/recorder.ts`: whole
  - `frontends/shell/src/console/surfaceRegistry.ts`: 112-121, 440-449, and grep
  - `frontends/shell/src/console/consoleViewModel.test.ts`: 120-196
  - `frontends/shell/src/skp/client.ts`: 50-61
  - `frontends/shell/package.json`: grep
  - `governance/forms/frontends/CONSOLE-STREAM-LANE-PREREGISTRATION.md`: 195-219, 820-849, and greps
  - `frontends/shell/src`: grep for ring mutations and `consoleRecorder.record`

Model: claude-opus-5-5
