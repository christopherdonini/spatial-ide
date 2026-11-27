Reviewed: PR 359, branch cut/console-stream-lane at 1d20b313dbd3ed625cf02575e7d24a1240a31b8a, in its worktree C:/dev/wt/console67 (the custodian's filing note, 2026-11-22: the reviewer's narrow read after its build gate part 1, node:console-stream-lane-limitation-67@gate-reviewer-narrow-1 (ADV-2026-11-22-05 item 4), dispatched at 2026-11-22T20:18:53.490Z; its run: Read 3, Bash 13, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-22T20:18:57Z to 2026-11-22T20:21:35Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 8807 bytes, sha256 1b262107204fc0f810c2edc29d43523be355d300ec0a14bd7c7027ee5f37091a, byte for byte, nothing masked, with one final newline added. PASS: EV-1 closed; DOC-N1 Documentation. Its Documentation findings were applied at 12251bc8850127b72a9fb2b5fce63c33ef2d7075.)

---

Verdict: PASS
Reviewed: C:/dev/wt/console67 @ 1d20b313dbd3ed625cf02575e7d24a1240a31b8a
Branch `cut/console-stream-lane` (PR 359). The correction is one commit on 4eae8c9ce481cdd14319c1adebe20dd18dd5ec0d. Line cites are at 1d20b313.

Items 1 to 5 hold. There is no Correctness or Evidence finding. One Documentation finding (DOC-N1) is in the architect's D1 words, which the correction applied faithfully. It must be fixed before the merge; replacement words are below.

## 1. EV-1
- **Byte for byte: yes.** I compared line 27 of `<S>/console-rev-gate-1-report.md` with `frontends/shell/e2e/console.mjs:967` using `cmp`. Exit 0. Both have sha256 1fcd53d1f01b9e12357d00e7864c41a356b64bdfd1233f59c7c422b467317726.
- **Reached on every path to P1's later checks: yes.**
  - In `measureRun` (`console.mjs:950-973`), the only early exit after P1 is the unsettled return at `:965`, and that path makes no later check.
  - A settled run passes `:966` (the `p1.count === null` throw), then `:967`. Only then does it reach `streamAdded`/`otherAdded` (`:968`) and `measureReadAfterP1` (`:969`).
  - `measureRun` is the only caller of `measureReadAfterP1` (`stepMeasure`, `:1000`).
- **Fails exactly when the total did not grow: yes.**
  - `p0.count` is checked non-null at `:961`, and `p1.count` at `:966`.
  - `parseConsoleLabel` (`:245-251`) returns `total: null` only together with `count: null`. So both totals are numbers at `:967`.
  - The throw then fires exactly when `p1.total - p0.total <= 0`. That is the negation of §6's "Δtotal > 0 when settled".
- **The message reads the values it names: yes.** "P0" interpolates `p0.text` and "P1" interpolates `p1.text`, which are the label texts the two totals were parsed from.
- **This also closes the architect's E1.** E1 asked for a check after the `p1.count === null` check that fails by name when `p1.total - p0.total <= 0` on a settled run.

## 2. DOC-3 and DOC-4
- **DOC-3: applied as given.**
  - `recorder.ts:149` now reads "between them are dropped and both runs are still kept: `ConsoleGroupRow` …". The span is my New text, and the rest of the line is unchanged.
  - It is a comment, inside the `/** … */` block that closes at `:164`.
- **DOC-4: applied as given.**
  - `consoleViewModel.test.ts:165` closes `describe("consoleLabelText (known limitation 67: the label shows both drop counts)", …)`, which now holds VL1 (`:153`) and VL2 (`:159`).
  - `:167` opens `describe("groupConsecutiveEntries after a drop (known limitation 67)", () => {`, which holds VL3 (`:168`) and VL3′ (`:180`) and closes at `:195`.
  - At 4eae8c9c, VL3 and VL3′ were the last two tests of the old block (`:165`, `:177`; the block closed at `:192`). So every other test stays in its former block.
  - No `it(` line is changed: the diff has 0 `+`/`-` lines starting `  it(`.
  - The verbose run shows the full names "… > groupConsecutiveEntries after a drop (known limitation 67) > VL3: …" and "… > VL3': …".

## 3. DOC-1 and DOC-2, through the architect's D4 and D3
- **DOC-1 (`console.mjs:751`, D4): yes.**
  - Why: the R ≤ M branch now prints "the drops since the baseline, ${dropS} of the stream kind and ${dropO} of the other". `dropS` and `dropO` (`:747`) are each kind's drops since the baseline, so the PASS text names R, ΔS and ΔO, as Amendment 1 D5 requires.
- **DOC-2 (`console.mjs:936`, D3): yes.**
  - Why: the untrue first disjunct is gone. The message now states only the mismatch the condition tests, and each clause checks against the code:
    - `names` is the other-kind names (`otherKindName`, `:908-913`) of `r.rows`.
    - `r.rows` is the last `r.L` shown rows. This branch is reached only with `clicked === 0` (`:933`), and the rows are `flat.slice(flat.length - L)` (`:904`).
    - `r.a = n2 - n0 + (o2 - o0)` (`:892`) is the count of other-kind entries recorded after P0, given that the stream ring was full at P0. `p0.droppedS > 0` is checked at `:962`.

## 4. Nothing else
- **Product lines: none changed.**
  - The `recorder.ts` hunks are comment lines only (DOC-3 at `:149`, D6 at `:160-163`).
  - The other two files are test code (`e2e/console.mjs`, `consoleViewModel.test.ts`).
- **The diff's 3 files (+17/−11) map to the told items, hunk by hunk:**
  - In `console.mjs`, by line at the head: D1 (`:39-41`), D5 (`:741`), D4 (`:751`), D2 twice (`:851`, `:864`), D3 (`:936`) and EV-1 (`:967`).
  - In the test file: DOC-4.
  - In `recorder.ts`: DOC-3 and D6.
- **Applied byte for byte.** Each of D1, D2, D4, D5, D6's New lines and the D3 span occurs exactly once (`grep -cF`). The D6 lines are also whole-line matches (`grep -cxF`).
- **Not in this commit, as the brief says:** DOC-5, D7 and D8.

## 5. Runs
| Command | Where | Exit | Counts |
|---|---|---|---|
| `node --check frontends/shell/e2e/console.mjs` | worktree root | 0 | none |
| `npx vitest run src/console` | `frontends/shell` | 0 | Test Files 8 passed (8); Tests 106 passed (106). Output in `<S>/n1-vitest.txt` |
| `npx vitest run src/console/consoleViewModel.test.ts --reporter=verbose` | `frontends/shell` | 0 | 1 file, 17 tests; used for the DOC-4 names |
| `cmp` of my suggested line against `console.mjs:967` | as above | 0 | none |

- I made no mutation, as the brief says.
- The new e2e check at `:967` cannot run without the app. Instead I read the guards in item 1: the P0 and P1 null checks, the early settle return and the parser's null coupling.

## Correctness
None.

## Evidence
None.

## Documentation (must fix before the merge)
**DOC-N1. The architect's D1 words, now at `console.mjs:39`, are still untrue.**
- The sentence says "so the steps before LABEL' share one open".
- COPYTRUNC' runs before LABEL' (`:1243` before `:1245`), and it calls `callOpenPath(page, FIXTURE_SMALL, { crsAssertion })` (`:1081`). So the steps before LABEL' make two `openPath` calls.
- The words at B ("only ever opens a dataset once") were already untrue for the same reason.
- This is not the human's or the advisor's wording. It is a source comment, so under §31 the worker applies these words with no re-gate, and the PR body lists them.

Old (`:39-41`):
```text
// is about ONE openPath call producing two class-A entries, so the steps before LABEL' share one open.
// LABEL' opens the file again; the opt-in MEASURE' opens it up to three times to warm up, then it and
// `100k-happy-path.parquet` once per run.
```
New:
```text
// is about ONE openPath call producing two class-A entries, so the steps before COPYTRUNC' share one open.
// COPYTRUNC' opens the file again with a near-cap crsAssertion, and LABEL' opens it once more; the opt-in
// MEASURE' opens it up to three times to warm up, then it and `100k-happy-path.parquet` once per run.
```
Each clause, checked against the code:
- "the steps before COPYTRUNC' share one open": ECHO' is the only open before COPYTRUNC' (`:359`), and the run order is `:1234-1243`. The suite's hooks are `openPath`, `queryWithFilter`, `publishPrepareWithDestination`, `crsCatalog` and `getResidencyArm` (grep), and only `openPath` opens. Its calls are at `:359`, `:854`, `:958`, `:988` and `:1081`.
- "COPYTRUNC' opens the file again with a near-cap crsAssertion": `:1080-1081`.
- "LABEL' opens it once more": `:854`.
- "MEASURE' opens it up to three times to warm up": `:986-991`.
- "then it and `100k-happy-path.parquet` once per run": `measureRun` (`:958`) over `[FIXTURE_SMALL, FIXTURE_100K]` (`:997`).

**Carried, not new: D6's last clause.** At `recorder.ts:162`, "item 67's comment in KNOWN-LIMITATIONS.md names that report's path and commit" becomes true only with commit 4. As the architect's D6 says, the merge check must confirm it.

## Nits
- `recorder.ts:149` is now 132 characters, because DOC-3 was not reflowed. The file had 4 lines over 110 characters at 4eae8c9c, so this is precedent and not a finding.
- `consoleViewModel.test.ts:164` is a blank line before the old block's new `});`. This follows the shape of my DOC-4 text, and no formatter check is in `npm run verify` (`package.json:17`).

## Final state
- `git status --porcelain` printed nothing (empty).
- HEAD is 1d20b313dbd3ed625cf02575e7d24a1240a31b8a.
- I wrote nothing in the worktree. My scratch outputs are in `<S>`: `n1-sugg.txt`, `n1-line.txt` and `n1-vitest.txt`.

Files read:
- `<S>/brief-console-rev-narrow-1.md`
- `<S>/console-rev-gate-1-report.md`
- `<S>/console-arch-gate-1-report.md`, whole; I acted on its E1, D1 to D6
- `git diff 4eae8c9c 1d20b313`
- In C:/dev/wt/console67:
  - `frontends/shell/e2e/console.mjs`: 36-42, 245-251, 497-520, 725-760, 895-1000, 1027-1095, the run order 1234-1248, and the grep hits
  - `frontends/shell/src/console/consoleViewModel.test.ts`: its describe/it structure at both commits, and 160-168
  - `frontends/shell/package.json:17`
- B's `console.mjs`, by grep

Model: claude-opus-5-5
