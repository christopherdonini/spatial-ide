*Filed by the custodian, late: the worker's report of colour-by-refill's build to its stop at step 6 on I2, node:colour-by-refill-keeps-the-view@build, head da55b7a608369030a88182955840c6b33b9cebcf on cut/colour-by-refill-keeps-the-view, dispatched at 2026-11-23T18:28:54Z. Its run: Bash 140, Read 14, Write 10, Edit 1, SubagentHandback 1, by unique call ids, 4 calls errored; model claude-sonnet-5-5, from 2026-11-23T18:28:54Z to 2026-11-23T19:23:28Z by its transcript; 1 call named the main checkout (a Read of its own agent definition there, which changes nothing). The report below from its hand-back, 8577 bytes, sha256 c8b167ca7b4694e5cb9886bc938d373a89b341d1f8f71d11700b9f0b5c2bdc4e, byte for byte, nothing masked by the custodian (its masks are the worker's), with one final newline added. It should have been filed with Amendment 7 of the form in 1123ae; it is evidence for the build gates and the closing amendment, not a gate.*

---

STOPPED at step 6 on I2 (a file outside Scope is needed). Branch pushed, no PR. Everything else is done and green except one declared-unchanged test, `RF10`, in a file outside §7.

**Where it stands**
- Head `da55b7a608369030a88182955840c6b33b9cebcf`, pushed to `origin/cut/colour-by-refill-keeps-the-view`. Base `e4e6493d92ec941425dd6566c0a4ec154c7eb633`. Worktree status is clean.
- Commits:
  - P0 `8329a53c250cf9beea3634554b4babf9ecc176a7`
  - Fix `39d096e9a8c7a7ff33a7670833f6de3a67fe62df`
  - Words `95d9621cb240a3c9d2bf4d690671bb3233e3e03c`
  - A fourth, `da55b7a6`, which the brief did not name. It adds a 2-line RECORDED MUTATION comment (M-F1) for the fixture generator, because the first `verify-mutation` run reported that new `#[test]` as unnamed. Re-run afterwards: PASS, 11 of 11.
- Count: `git diff --numstat e4e6493d...HEAD` gives 907 added + 15 deleted = **922** over 11 paths, under the 980 ceiling. No file outside the 11 §7 paths is touched. The paths are:
  - `WorkingCanvas.tsx`, `candidateArmSession.ts`, `App.tsx`
  - `WorkingCanvas.wiring.test.tsx`, `candidateArmSession.refillKeepsView.test.ts`, `App.colourRefill.test.tsx`
  - `e2e/colour-refill.mjs`, `e2e/README.md`
  - `kernel/tests/manual_walkthrough_fixtures.rs`
  - `KNOWN-LIMITATIONS.md`, `MANUAL-WALKTHROUGH.md`

**The stop**
- `src/canvas/WorkingCanvas.test.ts` (outside §7, declared unchanged) fails in `npm run verify`: `RF10: a new filter generation and the unreported fit clear lastQueriedRef, and the camera is written in exactly three places`. The lines read `AssertionError: expected '' to contain 'lastQueriedRef.current = null;'`.
- Cause: line 855 does `source.indexOf("resetFitForNewGeneration() {")`. The form's §2.2 (i) signature `resetFitForNewGeneration(options?: {keepCamera: true})` makes the method `resetFitForNewGeneration(options) {`, so the index is -1 and the slice is empty. The form does not name this test.
- I did not edit the test, and I did not bend the signature to keep the text match. The one-line fix, `source.indexOf("resetFitForNewGeneration(")`, needs an amendment adding `WorkingCanvas.test.ts` to Scope.
- That run: `Test Files 1 failed | 127 passed (128)`, `Tests 1 failed | 1608 passed (1609)`. The typecheck, dev-origin, origin-event, adr-index, build, dist-clean and dist-notice steps before the test step passed (the chain stopped at `test`).

**P0 at the base** (saved in `D:/wt-data/cbr/p0-rkc.out`, `p0-rks.out`, `p0-rks-rka.out`)
- Wiring file: `Tests  1 failed | 22 passed (23)`. The one failure is RK-C1, and RK-C2 to RK-C5 are green.
- Session and App files together: `Tests  2 failed | 3 passed (5)`. The failures are RK-A1 and RK-S1; RK-S2, RK-S3 and RK-A2 are green.
- On the first run the session file alone reported `no tests`, because `generated/NOTICE.txt` was missing. It was fixed by `npm run pretypecheck` and counts as no red. I4 did not fire.
- Interface read at the build head: only PR 358's generation differs, so I1 did not fire.

**The fix** (commit 2): the three files plus the §2.5 doc comments, with the baseline binding and `applyFilterWith` untouched.
- Result for the 3 files: `Test Files 3 passed (3)`, `Tests 28 passed (28)`, rc 0. This includes the existing wiring tests.
- Caller-grep for every new option: the one product caller is the Colour-by effect in `App.tsx`, `issueQueryRef.current(null, null, activeFilterRef.current, { keepCamera: true })`. It reaches `reissueUnrestricted(bbox, filter, options)` and then `canvas?.resetFitForNewGeneration(options)`.
- A Colour-by issued inside an Apply's mint round trip (ordering (i)) is not covered, and is named in the `App.tsx` and `candidateArmSession.ts` comments.

**Mutations** (step 4)
- Each ran whole files with `--reporter=verbose` (outputs in `D:/wt-data/cbr/mut-M-*.out`). The tree was restored and `cmp` against `git show HEAD:<path>` was equal; the mutations were never committed and `git status` was clean. All were run at `39d096e9`.
- Failing tests by name, every one matching the register:
  - M-C1: RK-C1.
  - M-C2: RK-C2.
  - M-C3: RK-C3.
  - M-C4: RK-C4.
  - M-C5: RK-C4 and RK-C5.
  - M-S1: RK-A1 and RK-S1 (both files run).
  - M-S2: RK-S2.
  - M-S3: RK-S3 (part (b): `AssertionError: (b) no frame line: expected [ { xmin: +0, ymin: +0, …(2) } ] to deeply equal []`).
  - M-A1: RK-A1.
  - M-A2: RK-A1.
  - M-A3: RK-A2.
- M-A1's E-RK1 half is the tester's. E-RK1 was not run.

**Fixture** (E-RK1)
- Folder: `C:\dev\wt\cbr\target\fixtures\manual-walkthrough\colour-refill-300k.parquet`, written by the new `#[ignore]` generator `generate_the_colour_refill_fixture` (`MultiType`, 300,000 features, `avg_vertices` 4, no holes). It is gitignored.
- Deviation: I did not state the expected bytes in an output before making the file. My own estimate beforehand was roughly 150-330 MB, and I made it without stating it first.
- Made: **328,242,802 bytes**, sha256 `2ce715fd1a9e797099bcbe252b462069a523f390fd7561a99de813818830af84`, with 1,380,022 vertices (under 2,000,000).
- `df -m /c` reads:

| Time (UTC) | C: free (MB) |
|---|---|
| 18:36 | 43806 |
| 18:49 (after the file) | 43501 |
| 19:22 | 43343 |

- The floor is 40960 MB. The text column alone is 307.2 MB over the 268,435,456-byte ceiling by arithmetic. Whether the app's counter reaches the not-held fact is not shown, because E-RK1 was not run. That is the tester's I5 check.
- E-RK1 (`frontends/shell/e2e/colour-refill.mjs`) is run as `node e2e/colour-refill.mjs [--fixture <path>]`. It passes `node --check`.

**Suites** (all in shared holds; rc as printed)

| Suite | rc |
|---|---|
| `cargo fmt --all --check` | 0 |
| `cargo test --locked -p spatial-kernel --test manual_walkthrough_fixtures` | 0 |
| `node scripts/plan/verify.mjs` | 0 |
| `verify-cites.mjs` | 0 |
| `verify-quotes.mjs` | 0 |
| `verify-test-claims.mjs` | 0 |
| `verify-mutation.mjs` (a check only) | 0 at head; rc 1 on the first run, fixed by `da55b7a6` |
| `npm run test:residency-trace`, `test:citation-integrity`, `test:export-elapsed`, `test:s5d-verdict` | 0 each |
| `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"` | 0 (623 pass, 0 fail) |

- The last two rows (and the four npm scripts) were run after the stop, for information only, since the `npm run verify` chain had halted before them.
- `npm run verify` itself: rc 1 (the stop above).

**Words** (commit 3)
- Item 51's sentence (with D3), item 61's span (with D4) and AC12's third cell (with D5) were copied by `words.mjs`, which reads the form file; nothing retyped.
- `grep -c -F` results: 1 each in the target (`KNOWN-LIMITATIONS.md`, `KNOWN-LIMITATIONS.md`, `MANUAL-WALKTHROUGH.md`). The D4 and D5 New texts also occur once each in the form.
- My own drafts:
  - the suite entry in `frontends/shell/e2e/README.md` (appended at the end);
  - the source comments in `WorkingCanvas.tsx`, `candidateArmSession.ts` and `App.tsx`;
  - item 51's HTML comment, re-pinned at `39d096e9`: `candidateArmSession.ts:1769-1774` sha256 `9423a852c58ead0684eb562fbd45eda49a55a345bb6e289b1696463cfe0bec98`, and `WorkingCanvas.tsx:1665-1669` sha256 `6531c7230013437ec24ee33470257e406dda551a24a9087a4e217c30f075df30`, plus one added sentence on `keepCamera`.
- No app string changed.

**Holds**
- 11 shared holds, each with `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=<m> also=<m>` and a matching `MACHINE_RELEASED project=<m> shell=<m> affinity=FF`. The kernel build, with the bundled DuckDB, took 11m50s. No exit codes 96-99, no `MACHINE_WAITING`, no `MACHINE_ERROR`.

**Pre-gate classes**
- Cross-module interfaces: read at the build head and used as exposed. The reset's new parameter is optional, so the other callers are unchanged. The one failure is `RF10`, a source-text reader outside Scope.
- Completion claims have evidence: the P0 and fix outputs, the mutation outputs and the suite rcs are in `D:/wt-data/cbr/`. E-RK1 is not run and I do not claim it.
- User-facing messages: no app string changed. The doc words are the form's drafts, still drafts for the advisor.
- Tests reach their assertions: each red and each guard was shown by a P0 run or a mutation run, and the M-S3 failure fell on its part (b) assertion.

**Model:** Sonnet 5.5, observed by me. No model override. I produced no context handoff; I resumed from a compaction summary once.

**Other deviations**
- `kernel/tests/manual_walkthrough_fixtures.rs` already had the `dir()` helper, so the fixture is written inside the worktree on C:, not on D:.
- The stale-rlib and heredoc hazards from memory did not bite this run.
