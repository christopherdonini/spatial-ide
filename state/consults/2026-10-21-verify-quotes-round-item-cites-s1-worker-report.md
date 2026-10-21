*Custodian's filing note (2026-10-21): verify-quotes-round-item-cites's S1 (the code and tests, with each mutation observed) by a worker, built at 81a287a6 on its branch. It discloses one change the form does not name: resolveCitation and resolveInText gain an optional third parameter, against §2.6's unchanged signature. That goes to the gates with S2's record. The run 2026-10-21T21:46:02Z to 22:07:26Z by its transcript (Bash 33, Read 2, Edit 12, Write 6). Its claims were read against that transcript's calls before filing. Extracted by script from its SubagentHandback call, with nothing changed except one final newline. Its sha256, from line 5 to the end, is 041671b1ef9a1abf32e225afad90c7c64fc14ac4feea6e186b6fd2caf9786dc8.*

---

Built: verify-quotes-round-item-cites S1 at 81a287a667d13cfd989331ddcd65357dc6915092 (branch cut/verify-quotes-round-item-cites, pushed, no force; B = a1bbc81eda83075ee870240ba12738600372de4a).

Steps (all foreground, output to files, rc taken straight after the command):
- Step 0, suite at B, before any edit: `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"` rc=0, tests 527, pass 527, fail 0.
- Step 1, code: `resolveRoundItem(texts, round, item, roundFileText)` appended to `scripts/plan/rulingSet.mjs` (the only new export). `scripts/plan/verify-quotes.mjs` gains the cite pass (`extractRoundItemCites`, skipping backtick spans, double-quoted spans and `>` lines), `citeFindings` and `citesChecked`, the `FAIL — ruling cite:` lines, the exit condition and the PASS suffix. `scripts/plan/verify-test-claims.mjs`: `ledgerRoundItemResolves` keeps its name and position and delegates to the shared resolver. `withdrawnRiders` binds a round-file reader. The old local header, item and boundary constants are removed. `resolveCitation(texts, citationText)` and `resolveInText` gained an optional third parameter, `readRoundFile`; existing two-argument calls are unchanged. This is not in the form. If you object to it, I3 or U4 is where it would show.
- Step 2: 15 tests, named as §4 names them (Q1 to Q14 in `scripts/plan/verify-quotes.test.mjs`, C1 in `scripts/plan/verify-test-claims.test.mjs`).
  - Q1 to Q11 fixtures are header, item and bullet lines copied by script from the archive at 40b04b46, found by round with a regex, never by line number; the round files for rounds 66 and 67 are copied from `git show 40b04b46:state/questions/round-N.md`.
  - Q12 spawns the real CLI against the real repository.
  - Q13 and Q14 use `byteCopiedLine('40b04b46', …)` against REPO_ROOT.
  - Q13's cite counts came out 1, 2, 5 and 4, so P5 holds.
  - Each test carries a `// MQn:` comment naming its mutation; the observations are in this report, not in the test file.
- Step 3: committed with `git commit -s -F` on the five paths only; push rc=0. Message trailers as briefed. Seams read before writing, and cited in the commit body: `rulingSet.mjs` `rulingSetPaths` and `readRulingSet`, `verify-quotes.mjs` `rulingFiles`, and `verify-test-claims.mjs` `loadDecisionsPending` (string[]) and `resolveCitation`.
- Step 5, checks on the tree identical to the commit (run just before `git commit`; `git status --porcelain` after the commit prints nothing):
  - `verify.mjs` rc=0, "verify:plan PASS".
  - `verify-cites.mjs` rc=0, "verify:cites PASS … 2171 file(s) resolves".
  - `verify-quotes.mjs` rc=0, "verify:quotes PASS — 130 checked, 99 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 836 ruling cites resolved, 0 ruling-cite errors."
  - `verify-test-claims.mjs` rc=0, "PASS — all 611 claimed test(s) across 187 file(s)".
  - `queue.mjs --check` rc=0, "current".
  - `site.mjs --check` rc=0, "current".
  - Full suite rc=0: tests 542, pass 542, fail 0.

Tests passing at the commit (each name starts with `verify-quotes:` except C1, which starts `verify-test-claims:`):
- Q1 a round and item cite resolves against its RULED block's item line
- Q2 a cite naming an item its block lacks fails by name
- Q3 a cite of a round with no RULED block fails by name
- Q4 a bold item line resolves
- Q5 a plural round header with no item lines resolves its item in the round's question file
- Q6 an itemless block's cite fails by name when the question file lacks the item
- Q7 a block with item lines is authoritative over the question file
- Q8 a cite resolves when its block is only in an archived ruling file
- Q9 a header in one ruling file and the item in another does not resolve
- Q10 a cite inside a backtick span or a quoted span is not read
- Q11 list, range and no-comma forms resolve each named item
- Q12 the CLI exits 1 and names an unresolvable ruling cite
- Q13 real record lines' round and item cites resolve against this repository's ruling set
- Q14 a real record line with an item past its round's last item fails by name
- C1 a withdrawn-test row whose ruling cites a round with bold item lines resolves

Mutations (step 4). Each was applied in the working tree on 81a287a667d13cfd989331ddcd65357dc6915092 by a driver script, its named test run alone, the failure recorded, the file reverted with `git checkout -- <file>`, and `git status --porcelain` printed `[]`. All 15 failed on an AssertionError, and each failed alone (tests 1, fail 1). None was a verify-mutation run. In every row the commit is 81a287a667d13cfd989331ddcd65357dc6915092 and the test is the §4 name above.
- MQ1: Q1 failed.
- MQ2: Q2 failed.
- MQ3: Q3 failed.
- MQ4: Q4 failed.
- MQ5: Q5 failed.
- MQ6: Q6 failed.
- MQ7: Q7 failed.
- MQ8: Q8 failed.
- MQ9: Q9 failed.
- MQ10: Q10 failed.
- MQ11: Q11 failed.
- MQ12: Q12 failed.
- MQ13: Q13 failed.
- MQ14: Q14 failed.
- MC1: C1 failed.
The driver is `vqri-mutate-driver.mjs` in the scratchpad, and the outputs are `vqri-mut-<id>.txt` and `vqri-drv-<id>.txt` there.

Suite counts: B 527. At the commit 542, which is exactly +15 (U6). R11 is in that run and passed (all 542 pass).

§7 count, with the §7 command and B...81a287a6: the line count is 344 against the ceiling of 550, over 5 files against 7.
- `scripts/plan/rulingSet.mjs` 64/0.
- `scripts/plan/verify-quotes.mjs` 61/5.
- `scripts/plan/verify-quotes.test.mjs` 154/1.
- `scripts/plan/verify-test-claims.mjs` 17/26.
- `scripts/plan/verify-test-claims.test.mjs` 16/0.

Product caller of the new export, from my grep: `resolveRoundItem` is called at `scripts/plan/verify-quotes.mjs:994` and by `ledgerRoundItemResolves` in `scripts/plan/verify-test-claims.mjs`.

Ruling-cite findings in the branch's own records: none. verify-quotes at the commit reports 0 ruling-cite errors, so S2 has an empty list so far. P1 holds at S1: C = 836 against the floor of 400.

Pre-gate self-check:
- Cross-module code uses the interfaces as they actually are: the seams are read and cited above, and Q12 to Q14 and C1 start from the real shape.
- Every completion claim points to evidence that exists: the transcript and the files named above.
- User-facing messages describe behaviour implemented at this commit: the FAIL and PASS lines are exercised by Q12 and by the real run above.
- Every required test reaches its intended assertion, not only its setup: Q13 and Q14 have positive count assertions, and each mutation fails on an assertion.

Could not do, or off-scope: S2, S3 and S4 not touched, as briefed. The shared scratchpad folder already held other work's files; I wrote only files named `vqri-*`, `q-tests.txt`, `c-test.txt`, `edit1.mjs`, `edit2.mjs` (edit2.mjs failed on a syntax error before it ran) and `s1-commit-message.txt`, and read none of the others. Nothing needed the shared-machine hold: no heavy command ran.

Model: Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff received or produced.
