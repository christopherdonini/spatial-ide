Reviewed: PR #229 at 620acf4f84ac5f9e38711b8545d21175a039e6dc (base 0ff2594e; gate 2, scoped to correction round 1). Branch and commit: cut/cut-state-cap-and-rotation @ 620acf4f84ac5f9e38711b8545d21175a039e6dc
Verdict: FAIL

The fail rests on one new Correctness finding, C-2. It is in lines the round added to R8, and it is small. Gate 1's C-1 is resolved. Gate 1's E-1 is resolved as I asked for it, but the way it was resolved causes C-2.

**Disclosure.** I have no shell. I read the head files in `C:/dev/wt/csr` and did not see the three commits' diffs. For the third commit, I took the list of touched lines from the worker's report and checked where they sit (below). I recomputed no hashes and made no mutations; those are the reviewer's.

## Correctness

**C-2. R8 will go red on main at the piece's own commit R, and stay red.**
- **Where:** `scripts/plan/rotate-cut-state.test.mjs:216` and `:221`. Both check that the live ledger is in its pre-rotation shape.
- **How R8 reads the ledger:** it reads the checkout's live ledger at `:198`. CI runs this file on main (`.github/workflows/governance-ci.yml:142`).
- **The order:** the form's §2 item 10 puts R, the first live rotation, "after the click, before any other main commit".
- **What changes at R:** after R, the live `state/CUT-STATE.md` is the script's own output. It has no title line, as OPEN-3 (iii) requires. Its `Previous ledger:` line holds three backticked `state/` paths (the new archive, `state/CUT-STATE.md`, and the old `Before it:` path).
- **So both checks fail:** `:216` (`seededLines[0].startsWith('# ') && h > 0`) is false, and `:221` reads 3, not 2.
- **Consequences:**
  - Main's CI is red at R and at F. That contradicts the §6 evidence E6 and E9 ("main's CI at F").
  - It cannot be fixed until main unfreezes.
  - It stays red at every later rotation.
- **Fix:**
  - Delete `:216` and `:221`.
  - Keep `:217`, `:219`, `:222` and `:223`. They hold for both shapes: the new file starts at the heading, its eight fields are the seeded lines, `Before it` is the first backticked path of the seeded line, and the file ends with the notice and `## Ledger`.
  - While the live ledger has a title line, `:217` still proves that the title line goes. After R, the real input has no title line to prove anything about.
  - Rewrite the comment at `:198` so it states no fixed shape. Suggested words (not the human's): `// the real ledger as main holds it (before the first rotation: a title line and a two-path Previous ledger line; after it, the rotated shape)`.
- **Evidence for the fix (reviewer):**
  - R8 passes at the fix commit.
  - R8 passes again in a scratch copy of the checkout whose `state/CUT-STATE.md` is replaced, uncommitted, by `buildRotatedLedger` output of the live ledger. At 620acf4f, this same run fails at `:216`, which reproduces C-2.
  - MR8 is made again and fails R8 at `:219`.
- **What reopens:** Correctness for `rotate-cut-state.test.mjs` only.

## Evidence

None beyond the re-observation C-2 needs.

## Documentation (must-fix before the merge)

**D-7. The export list differs from the form's §2 item 3.**
- §2 item 3 names four exports: `isDue`, `archiveNameFor`, `noticeLine` and `buildRotatedLedger`.
- `scripts/plan/rotate-cut-state.mjs:20` also exports `ROTATE_BYTES`. Its only importer is the test (`rotate-cut-state.test.mjs:12`, used at `:133`).
- It has a product use, inside `isDue` (`:33`), so this is not a caller-rule finding. It is a difference from the form.
- Fix, in the same commit as C-2: drop `export` at `:20`, take `ROTATE_BYTES` out of the import at `:12`, and delete `:133`. R4 already proves the threshold by behaviour, with ledgers of 153,600 and 153,601 bytes.
- Or, if it is kept: record it as a class 3 deviation in the closing amendment, by reference.

## The brief's checks

**1. C-1 at the head: resolved.**
- `main` takes no option. Any argument refuses with exit 2 (`rotate-cut-state.mjs:71`).
- The root comes from `git rev-parse --show-toplevel` run in `process.cwd()` (`:74`). This fits AUTONOMY §33 (ii)'s relative call (`AUTONOMY.md:598`).
- `REPO_ROOT` is gone from the script.
- Every export kept has a product caller in `main`:
  - `isDue` at `:93`;
  - `archiveNameFor` at `:105`;
  - `buildRotatedLedger` at `:107`;
  - `noticeLine` through `buildRotatedLedger` at `:67`;
  - `ROTATE_BYTES` through `isDue` (see D-7).
- The new refusal at `:76` comes before any write, and its message states a git fact.

**2. E-1 at the head: resolved as specified, with C-2.** R8 seeds its ledger from the real ledger through `updateBlockFields`: `flushed_at` and tip set, the other six fields `SENTINEL` (`:198-199`). It asserts each item gate 1 listed:
- `:217`: the file starts at the heading, with no line before it;
- `:219`: its eight fields are the seeded lines;
- `:222`: `Before it` is the first backticked path of the seeded line;
- `:223`: the file ends with the notice, a blank line, `## Ledger` and one newline.

It uses the real `decidePrecompact`, `decide`, flush CLI and session-resume CLI, with no git injected. MR8 at 143bf5615439 is recorded as failing R1 and R8 (`:76`); the reviewer makes it again.

**3. §8, the items the round's code touches.**
- **Item 1: pass.** Neither file is on §1's unchanged list.
- **Item 5: pass.** There is still no commit, push or fetch call, and the new refusal writes nothing.
- **Item 6: pass.** No user-profile path.
- **Item 7: pass.** No typed date. R8's times are relative to now.
- **Item 8: pass.** No rooted line cite into `state/CUT-STATE.md` was added. The `RECORDED MUTATION` lines name their commit (143bf5615439) and pin no test text by hash.

**The third commit (620acf4f).**
- `flush.mjs:42-45` is W-1, word for word.
- The `AUTONOMY.md` lines the worker reports, 569 to 634, all fall inside §33, which opens at `:565` and is the file's last section.
- I cannot see the commit's file list. The reviewer confirms that its numstat names only these two files.

## Notes (no finding)
- **N-1 (gate 1) stands.** Before the click, check `blockSizes(buildRotatedLedger(...))` on (b)'s ledger. That keeps `buildRotatedLedger`'s export useful to the custodian.
- **No ADR or decision is missing.**

## Re-gate scope
- The architect re-gates the C-2 fix diff in `scripts/plan/rotate-cut-state.test.mjs` only, plus D-7 if it is taken in code.
- The reviewer runs the C-2 evidence above and makes MR8 again.
- Every other verdict carries forward.

Files:
- C:/dev/wt/csr/scripts/plan/rotate-cut-state.test.mjs
- C:/dev/wt/csr/scripts/plan/rotate-cut-state.mjs
- C:/dev/wt/csr/.github/workflows/governance-ci.yml
- C:/dev/wt/csr/state/CUT-STATE.md
- C:/dev/spatial-ide/scripts/plan/CUT-STATE-CAP-AND-ROTATION-PREREGISTRATION.md
