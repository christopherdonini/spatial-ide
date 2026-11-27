# Partitioned refusal: the worker's reports of M-K1b with the D-1 words, and of the D-2 words

*Filed by the custodian: two workers on `cut/partitioned-ordinal-refusal-opens-the-identity-form` (PR 366, draft), one after the architect's build gate attempt 1 and one after its re-gate attempt 2, each in its own section below. Evidence for the closing amendment, not a gate.*

---

## node:partitioned-ordinal-refusal-opens-the-identity-form@mk1b-1: M-K1b run and the architect's D-1 words, 8d1fe83a to 78a36aaa

*Dispatched at 2026-11-24T01:05:00Z; its run: Bash 24, Read 2, Grep 1, Monitor 1, SubagentHandback 1, by unique call ids, 2 calls errored; model claude-sonnet-5-5, from 2026-11-24T01:05:02Z to 2026-11-24T01:22:41Z by its transcript; 0 calls named the main checkout; handed back at 2026-11-24T01:22:41Z. The report below from its hand-back, 3424 bytes, sha256 206e7b927a6cbb17c609ad9d206fc3f183c6b1f1559f948f9dfb0b73778690c8, byte for byte but for 3 values of the hold's lines, written as <m>, <u> and <t> by the custodian, with one final newline added.*

DONE. Head before 8d1fe83acfaede6873b6366e6594b99ddf9943ad; after (commit) 78a36aaad6f93c501f4a3dd95d03d17798d4b158. Push: "8d1fe83a..78a36aaa cut/partitioned-ordinal-refusal-opens-the-identity-form -> same". Tree clean after commit.

STEP 1 (M-K1b): replace count 1. sha256 of engine/src/dataset.rs saved and restored: bf392807dd3e0eef88b09bf393e4a56b09ed1863b141a83e5cb69e9784e83c7e (equal; status clean). Mutated K1 run exit 101. Failing test: a_folder_opened_with_or_without_a_declared_identity_is_refused_by_name_and_offered_no_declaration. Panic, byte for byte from <S>/pmk-k1-mut.log:
thread '...' panicked at kernel\tests\partitioned_refusal_offers_no_declaration.rs:75:5:
assertion `left == right` failed: source: C:\dev\wt\partref\target/fixtures/partitioned-refusal-remedy/parts is not a readable file
  left: "engine.source"
 right: "engine.identity_ordinal_partitioned_unsupported"
Line 75 is assertion (a) on the declared open, as predicted.

STEP 2, paragraph added after the existing RECORDED MUTATION paragraph (preceded by a `///` line):
/// RECORDED MUTATION M-K1b (observed at `8d1fe83acfaede6873b6366e6594b99ddf9943ad`):
/// the partitioned gate in `engine/src/dataset.rs` guarded with `declared_identity.is_none()`, so
/// a declared open gets past it. Observed outcome: this test fails by name at (a), line 75, the
/// code assertion on the declared open, which saw `engine.source`. Applied, run, reverted; the
/// file's sha256 matched.

STEP 3 (D-1): exactly 2 blocks. Old: 6 lines, sha256 b01e611190087ab6a493444021a6e27510bb07df05543e7c55d9427c05037160. New: 9 lines, sha256 219a2d098a72d2de04c35198b33ec96d12c9f5e7eb84e6609f96985c58158574. formatRefusal.ts had no CR. Old count 1 -> 0; New count 0 -> 1.

STEP 4: `git diff --name-only` showed exactly the two files. Stat: formatRefusal.ts 11 changed, K1 test 6 added; 13 insertions, 4 deletions. The whole diff is the D-1 hunk in formatRefusal.ts plus the 6 added doc lines in the K1 test (shown above in substance). Numstat against 2095a7ac over the five files: 8+7, 9+4, 28+7, 21+9, 99+0 = 192, under the 200 ceiling.
Check results, all exit 0:
- `cargo fmt --all -- --check`
- `npx tsc --noEmit`
- vitest formatRefusal.test.ts: 15 passed
- K1 unmutated (<S>/pmk-k1-head.log): "1 passed; 0 failed"
- verify.mjs: PASS
- verify-cites.mjs: PASS (237 loose advisories)
- verify-quotes.mjs: PASS
- verify-test-claims.mjs: PASS (901 claimed tests)
- verify-mutation.mjs --base 2095a7ac... --head HEAD: PASS, all 3 new tests have a recorded mutation naming them. At the commit that section names, the tool checks that a mutation is recorded and runs none. The M-K1b observation is the run in step 1.

Hold lines (two holds, both granted and released, run exit codes 101 then 0):
- MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=<m> also=<m>
- MACHINE_RELEASED project=<m> ... affinity=FF (cores 0-7)
- The second hold also printed MACHINE_WAITING shared: <m>

Deviations:
(1) I ran verify, verify-cites, verify-quotes and verify-test-claims in one Bash call as a loop instead of one script per call. The tool moved it to the background and all four passed.
(2) The step 2 doc lines are within 100 characters. Two older lines in that file already exceed 100; I did not touch them.
(3) Nothing else outside the brief. Off-scope noticed: none.

Model: Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff.

## node:partitioned-ordinal-refusal-opens-the-identity-form@d2-words-1: the architect's D-2 words, 78a36aaa to e4116cad

*Dispatched at 2026-11-24T01:31:28Z; its run: Bash 15, Read 2, SubagentHandback 1, by unique call ids, 1 calls errored; model claude-sonnet-5-5, from 2026-11-24T01:31:28Z to 2026-11-24T01:43:05Z by its transcript; 0 calls named the main checkout; handed back at 2026-11-24T01:43:05Z. The report below from its hand-back, 2207 bytes, sha256 2b6e2e1827204b6f90c82bc35bd170b884e0d3b46bb82f3fd9831077b79e2334, byte for byte but for 1 of the profile's path or the account's name, written as <m>, <u> and <t> by the custodian, with one final newline added.*

D-2 applied, committed and pushed; every check exited 0.

HEAD before: 78a36aaad6f93c501f4a3dd95d03d17798d4b158. HEAD after: e4116cadbedcd6916dd38bab2681592909a85e4a. Preflight was clean: right branch, right HEAD, empty porcelain. THE REPORT matched 7322 bytes and sha256 68244a88...a87ac2d3aa7d.

Step 1: the D-2 section held 4 fence lines and 2 blocks. The Old and New blocks are 3 lines each.
- Old sha256: 5ec2c8643143fa2d82d1129bbc4cb71c6433bb868d7688fc6d671e3722d7465f
- New sha256: 566760911f2bcb7f4ddc88a646f8f1807feddfe916e083f9accae1c9461b07b1
- The file held no CR.
- Old count: 1 before, 0 after. New count before: 0.

Step 2:
- `git diff --name-only` printed only kernel/tests/partitioned_refusal_offers_no_declaration.rs (rc 0).
- `git diff` showed a single hunk replacing the 3 lines in K1's RECORDED MUTATION paragraph. "at (a), line 75, the code assertion on the declared open, which saw `engine.source`" became "at (a), the code assertion on the declared open (`declared.code`), which saw `engine.source`". The paragraph was re-wrapped (rc 0).
- The numstat sum against 2095a7ac printed 192 (rc 0).
- `cargo fmt --all -- --check` gave rc 0.
- `verify-cites` printed PASS with 237 loose references advised, all in state/drafts, rc 0.
- `verify-quotes` printed PASS (159 checked, 128 verified, 0 errors), rc 0. It ran past the 120 s timeout, so the harness moved it to the background. I ran it once and read its output file afterwards.
- `verify-test-claims` printed PASS (901 claimed tests), rc 0.

Step 3: one commit, `git commit -s -F D:/wt-data/partref/msg.txt`, with 1 file changed, 3 insertions and 3 deletions. The message has no typed Signed-off-by line and no email, and ends with the Co-Authored-By line. Porcelain after the commit was empty.

Step 4 push output: `78a36aaa..e4116cad  cut/partitioned-ordinal-refusal-opens-the-identity-form -> cut/partitioned-ordinal-refusal-opens-the-identity-form`, rc 0.

I changed nothing beyond the brief. My apply script is in the scratchpad: <u>/AppData/Local/Temp/claude/3eed48519155ece4/da685a21-245c-4f3e-8f40-060e581f487c/scratchpad/apply-d2.mjs.

Model: Sonnet 5.5 (claude-sonnet-5-5). No override and no context handoff.

