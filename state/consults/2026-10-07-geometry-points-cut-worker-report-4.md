*Custodian's filing note (2026-10-07): `geometry-points-cut`'s worker report 4, the batched gate-1 Documentation fixes (the architect's D-1 to D-5, the reviewer's D-1 to D-4), by the worker (Sonnet 5.5, by its definition) on the custodian's brief. It arrived as the worker's hand-back message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is cd27bcab2418d9436f2439c18d654a444c2bc188ba442f2b234c01d6ec2c4ea1. Write audit PASS: 2 Edits in the worktree `C:/dev/wt/points`, the rest of its changes by shell in that worktree, and no write in the main checkout or under the user's Claude folder. Tool calls Bash 43, Edit 2, Read 2, Monitor 1, SubagentHandback 1. Run window from the transcript: 2026-10-07T00:40:27.712Z to 01:07:45.320Z. The custodian checked each fix against its finding by the diff 2e481e74..6d5a6cf3: six files, 13 lines changed, and `ADMISSION-RESULTS.md` changed only in its P3 row and its commit and date lines.*

---

All fixes landed on `cut/geometry-points-cut` and pushed to origin as ordinary updates. The tree is clean at 6d5a6cf3 and every check exits 0. I did not run `verify-mutation`.

**Commits** (each signed off)
- 2ff9a8e6 "docs: gate-1 Documentation fixes for the points cut (F-1c doc, P2 row, items 31, 35, 36, decodeBatch doc)"
- 0a6324e0 "docs: the P3 line of the P4 generator names #5 beside #8 (class 3 test text; architect D-2, reviewer D-2)"
- 6d5a6cf3 "docs: ADMISSION-RESULTS.md regenerated at the committed tree 0a6324e0 (the P3 line, the commit-id and date lines)"

**Fixes** (old to new, from `git diff`)
- **F-1c doc** in `kernel/tests/manual_walkthrough_fixtures.rs` (architect D-1, reviewer D-1)
  - Old: `for the shell E2E's MP' step and Part S's S2: the same three`
  - New: `for Part S's S2 note: the same three`
- **P3 literal** in `engine/tests/admission_p4_corpus.rs` (architect D-2, reviewer D-2), committed alone
  - Old: `— #8 is excluded from this count on that \` then `precedence)"`
  - New: `— #5 and #8 are excluded from this count on \` then `that precedence)"`
- **Row P2 (d)** in `frontends/shell/MANUAL-WALKTHROUGH.md` (architect D-3, reviewer D-3)
  - Old: `where five symbols overlap on screen` and `P-1's own points sit at least 10 m apart`
  - New: `where six symbols overlap on screen` and `P-1's own points sit about 9.6 m apart or more`
- **Item 31** in `KNOWN-LIMITATIONS.md` (architect D-4): the sentence "The refusal lists the declared types and the types this build reads." moved, wording unchanged. It now follows "...and a Z or M name." and comes before the mixed-kind sentence.
- **Item 35** (reviewer D-4)
  - Old: `a radius of 4 screen pixels`
  - New: `a radius of 4 CSS pixels`
- **Item 36** (reviewer D-4 and the observation)
  - Old: `of the points in view with`
  - New: `of the resident points with`
  - Added the clause `When every resident point coincides, the spacing is 0 and every hover is refused.` before "Part P of the manual walkthrough".
  - Both items remain drafts; I touched no source comment.
- **`decodeBatch` doc** in `frontends/shell/src/canvas/decodeBatch.ts` (architect D-5)
  - Old: `or is neither encoding the shell reads,`
  - New: `or is none of the three encodings the shell reads,`

**Re-run of the P4 generator**
- Command: `cargo test --workspace --locked --features spatial-engine/fixture --test admission_p4_corpus -- --ignored --nocapture`. It passed, 17 rows opened, 0 unrun, 2 DEVIATION rows.
- Its tree was 0a6324e09e64baa3cf6bc3c38ee9ee1b721dbee3, clean, the P3-literal commit.
- Changed lines of `engine/ADMISSION-RESULTS.md`, and only these:
  - the `<!-- commit: -->` line, from ac54f4d3... to 0a6324e0...
  - the `<!-- generated: -->` line, from 2026-10-06 to 2026-10-07
  - the "Generated from the tree at" and "Generated:" values in the Generator paragraph, which carry the same commit id and date
  - the P3 row, which now reads `#5 and #8 are excluded from this count on that precedence`

**Checks**
| Check | Result |
|---|---|
| `cargo test --workspace --locked --features spatial-engine/fixture` | exit 0; 885 passed, 0 failed, 50 ignored |
| `cargo fmt --all --check` | exit 0 |
| shell `npx tsc --noEmit` | exit 0 |
| shell `npm test` | exit 0; vitest 73 files, 1119 tests passed |
| `verify-cites.mjs` | exit 0 |
| `verify-quotes.mjs` | exit 0 |
| `verify-test-claims.mjs` | exit 0 |
| `verify.mjs` | exit 0 |

**§7 at my head**
- The command gives 2,666 lines (2,400 added, 266 deleted) over 53 files. Amendment 4's figure at the gated head is 2,660 over 53, so the fixes add 6 lines and no files.
- I could not map my per-directory grouping onto §7's table. By top-level directory: engine 1,393; frontends 671; kernel 306; protocol 209; renderer 61; `KNOWN-LIMITATIONS.md` 26.
- Kernel is 306, equal to Amendment 4's kernel figure, so it stays over its 220 budget by the same 86.
- The 6-line delta is the fixes' own files: `KNOWN-LIMITATIONS.md` 3/3, `admission_p4_corpus.rs` 2/2, `MANUAL-WALKTHROUGH.md` 1/1, `decodeBatch.ts` 1/1 and `manual_walkthrough_fixtures.rs` 1/1 (added/deleted lines between 2e481e74 and HEAD).

**Heavy commands**, all under a shared hold (`machine.ps1`, project SpatialIDE, cores 0-7), with CARGO_BUILD_JOBS=8, RUST_TEST_THREADS=8 and CARGO_TARGET_DIR=D:/wt-targets/points:
1. the P4 generator run (hold granted);
2. the full workspace cargo test (hold granted);
3. the shell's `npm test`, which includes the pretest build (hold granted).

`cargo fmt --check`, `npx tsc --noEmit` and the four `verify` scripts ran unheld, as light checks.

No timing-sensitive failure appeared.

**Noticed, not done:** the record findings (architect D-6, reviewer D-5) are left for you. My model as the harness reports it: Sonnet 5.5 (claude-sonnet-5-5); no override and no context handoff.
