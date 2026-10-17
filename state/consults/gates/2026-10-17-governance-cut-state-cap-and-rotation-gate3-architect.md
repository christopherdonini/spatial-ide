Reviewed: PR #229 at 5201bc0b0ee432f9d1e001bdd9386332dfe72481 (base 0ff2594e; gate 3, scoped to correction round 2). Branch and commit: cut/cut-state-cap-and-rotation @ 5201bc0b0ee432f9d1e001bdd9386332dfe72481
Verdict: PASS WITH NOTES

Gate 2's C-2 is resolved. There are no Correctness or Evidence findings. One Documentation finding, D-8, must be fixed before the merge, with no re-gate.

**Disclosure.** I have no shell, so I ran no tests, made no mutations and recomputed no hashes. Those are the reviewer's. I confirmed the head by reading two files:
- `.git/worktrees/csr/HEAD` points to `refs/heads/cut/cut-state-cap-and-rotation`;
- that ref reads `5201bc0b0ee432f9d1e001bdd9386332dfe72481`.

I could not see the diffs of 1f4e8d5d or 5201bc0b. Two things rest on the worker's report and the custodian's filing note: that only `scripts/plan/rotate-cut-state.test.mjs` changed, and that the file is 276 lines. I read that file in full at the head. I also read `rotate-cut-state.mjs` and `flush.mjs`'s `updateBlockFields` and `findBlockRange`, and the first 20 lines of the head's `state/CUT-STATE.md`.

## Correctness
None.

## Evidence
None. MR8 and MR8b at 1f4e8d5d4194 rest on the worker's runs (`scripts/plan/rotate-cut-state.test.mjs:77-78`). Amendment 5 item 5 gives gate 3's reviewer the job of making them again.

## Documentation (must-fix before the merge)

**D-8. The comment at `scripts/plan/rotate-cut-state.test.mjs:201` describes `live`, but it sits on the line that defines `real`.**
- These are my own suggested words from gate 2, and they were applied byte for byte. But since this round, `real` has two branches. With `rotatedShape` set, `real` is not "the ledger as main holds it". It is that ledger rotated once more.
- This is not the human's wording. The worker applies it with no re-gate, and the PR body lists it.
- Replacement words for the comment at `:201`:
  `// live: the ledger as main holds it (before the first rotation, a title line and a two-path Previous ledger line; after it, the rotated shape). real: live, or with rotatedShape, live after one more rotation by buildRotatedLedger`
- Clause check:
  - "live: the ledger as main holds it": `:200` reads `state/CUT-STATE.md` under `REPO_ROOT`, the checkout's own file.
  - "before the first rotation, a title line and a two-path Previous ledger line": the head's `state/CUT-STATE.md:1` is a `# ` title, and `:13` holds two backticked `state/` paths.
  - "after it, the rotated shape": `rotate-cut-state.mjs:107` builds the file with `buildRotatedLedger`, and `:116` writes it.
  - "real: live, or with rotatedShape, live after one more rotation by buildRotatedLedger": the ternary at `rotate-cut-state.test.mjs:201`.

## The brief's checks

**1. Gate 2's C-2 at the head: resolved.**
- **The two shape guards are gone.** The title-line guard is now `assert.ok(h >= 0, …)` (`:219`). The two-path guard is now "at least one" backticked `state/` path (`:224`).
- **Every assertion holds on the ledger that every rotation from the second on will read.** That ledger is `buildRotatedLedger`'s output (`rotate-cut-state.mjs:54-67`) after a flush:
  - The heading is at index 0, so `h >= 0` holds.
  - The output starts at `BLOCK_HEADING`, so `:220` holds.
  - The body runs from the heading to `## Ledger`. With the `Previous ledger:` line, the notice and the trailing blank lines removed, it is exactly the eight field lines, so `:221-222` hold.
  - The new `Previous ledger:` line always begins with `` `state/cut-archive/<name>` ``, so `:224` holds, and `:225`'s first-backticked path is that archive.
  - The tail is the notice, a blank line, `## Ledger` and one newline (`:67`), so `:226` holds.
- **`r8(true)` proves this now, in the test.** It feeds `buildRotatedLedger(live)` through the same seeding (`:201-202`). That is the input my gate 2 asked to test in a scratch checkout, built in memory instead.
- **MR8b shows the rotated pass reaches its assertions.** With the old title guard restored, the test fails on that pass (worker's report; `:78`). That reproduces C-2.
- **On today's ledger, R8 still proves that the title line goes.** The live input at the head has a title line (`state/CUT-STATE.md:1`), and `:220` asserts that the output starts at the heading.

**2. R8 as the seam test from the real shape, both shapes: met.**
- Both inputs come from real code paths:
  - `r8(false)` uses the checkout's live ledger;
  - `r8(true)` uses that ledger through the product function `buildRotatedLedger`, called as `rotate-cut-state.mjs:54` defines it, `{ oldText, name, commit }`.
- Both are seeded through the real `updateBlockFields`. Both run the real script by spawn, and the real `decidePrecompact`, `decide`, flush CLI and session-resume CLI, with no git injected (`:213-255`).
- Gate 1's four assertions run on both shapes:
  - the file starts at the heading (`:220`);
  - its eight fields are the seeded lines (`:222`);
  - `Before it` is the first backticked path of the seeded line (`:225`);
  - the file ends with the notice, a blank line, `## Ledger` and one newline (`:226`).
- The test keeps its name (`:261`), so R8's name in the form and in the MR lines still resolves.

**3. Amendment 5 item 4 against D-7: matches.**
- D-7 gave a choice: drop the export, or record it as a class 3 deviation. Item 4 records it as class 3.
- Each of its claims resolves at the head:
  - the export is at `rotate-cut-state.mjs:20`;
  - §2 item 3 of the form lists four names;
  - the product use is inside `isDue` (`rotate-cut-state.mjs:33`, `:36`);
  - the only importer is the test (`rotate-cut-state.test.mjs:12`), used only in R4 (`:135`). A grep of the worktree finds no other importer.
- It is not a caller-rule finding: the constant is read on the product path. Gate 2's reading carries forward.

## Notes (no finding)
- **N-2. After R, no test covers lines before the heading.** R1's fixture has no title line, and the live ledger loses its title at R. From then on, a mutation that kept pre-heading lines would survive. The property is structural, though: `rotate-cut-state.mjs:67` builds the output from `BLOCK_HEADING` and the block body only. This is no finding.
- **N-3. The rotated-shape fixture's archive name is not a real one.** It uses `cut-state-r8.md` (`:201`), not a `CUT-STATE-<date>.md` name. No assertion depends on the name, so this does not weaken the seam.
- **No ADR or decision is missing.**

## Gate 2's finding
C-2 is resolved. D-7 is discharged by Amendment 5 item 4 (class 3). Every other verdict carries forward. If D-8 is applied as worded, this round needs no further architect gate.

Files:
- C:/dev/wt/csr/scripts/plan/rotate-cut-state.test.mjs
- C:/dev/wt/csr/scripts/plan/rotate-cut-state.mjs
- C:/dev/wt/csr/scripts/hooks/flush.mjs
- C:/dev/wt/csr/state/CUT-STATE.md
- C:/dev/spatial-ide/scripts/plan/CUT-STATE-CAP-AND-ROTATION-PREREGISTRATION.md
- C:/dev/spatial-ide/state/consults/2026-10-17-governance-cut-state-cap-and-rotation-round-2-worker-report.md
