Reviewed: PR #325 at 536e664dfc5b6296148e951896025516b71648bb (the custodian's filing note, 2026-11-15: the reviewer, PLAN node verify-quotes-and-docsonly-read-files-over-one-mebibyte, under its form (`governance/forms/scripts/VERIFY-QUOTES-AND-DOCSONLY-READ-FILES-OVER-ONE-MEBIBYTE-PREREGISTRATION.md`), the other of its two gates from dispatch; dispatched at 2026-11-15T09:20:09Z by the custodian's transcript, in the background, its prompt the brief's text without its final newline, the brief in the custodian's scratch folder (8157 bytes, sha256 f0516c4794da80864f8131a135eebe657e8f31bd2620e752ea40286025caf31f); the run 2026-11-15T09:20:10Z to 2026-11-15T09:53:27Z by its transcript, 55 calls (Bash 37, Read 16, Grep 1, SubagentHandback 1), none errored, model claude-opus-5-5; it wrote only its own scratch files and the two mutations, each reverted, and made the merge base's checkout and return; each run it claims has a call behind it; received at 2026-11-15T09:53:27Z by the custodian's transcript; the report below, byte for byte, from its hand-back of 14762 bytes, sha256 c7c4631021af51ed77aeba88367d9f6f9851aff34e95f822ae5f43156d4eb1b9, with this note added in its first line; its O3 names the staged files of the custodian's records commit then running), gate reviewer (cut/verify-quotes-and-docsonly-read-files-over-one-mebibyte @ 536e664dfc5b6296148e951896025516b71648bb)
Verdict: PASS

There are no Correctness, Evidence or Documentation findings. All four of the packet's flags are answered under check 10.

## Findings by class

**Correctness:** none.
**Evidence:** none.
**Documentation:** none. Nothing needs replacement words.

**Observations** (none blocks, none must be fixed):
- O1 (T2 covers only the eligible case). T2 asserts that a title-only edit of a plan over 1 MiB gives `[]`. It has no case where a priority change in a plan over 1 MiB is caught. §1's claim "judged by its content" still holds, for three reasons I read in the code (my reasoning, not a quote):
  - `[]` can only come from the parse branch (`scripts/plan/docsOnly.mjs` 144-150 at H).
  - A failed parse would add a "could not be parsed" line.
  - The priority and felt-verdict checks after the parse are the existing code, already covered by the existing small-plan tests.
  - Optional for a later piece: a test where a plan over 1 MiB has a lane priority change.
- O2 (flag 2's wording). At the head, E3 printed the tool's exit-0 line (`docsOnly.mjs:201` at H) and nothing else. The closing amendment should record that this line was printed. It should not say that "no line" was printed.
- O3. The main checkout `C:/dev/spatial-ide` has staged changes: PLAN.yaml, queue, site, CUT-STATE, gate-log, and three new state/consults files, including this piece's architect gate report. I did not make them; my only action on the main checkout was the fetch. I note them so the custodian's next commit is made knowingly.

## Check 1, the start
- In `C:/dev/wt/vqd`, each with rc 0:
  - `rev-parse HEAD` gave 536e664dfc5b6296148e951896025516b71648bb.
  - The branch is `cut/verify-quotes-and-docsonly-read-files-over-one-mebibyte`.
  - The porcelain was empty.
  - `ls-remote` gave 536e664d… for the branch.
- The merge base with origin/main is 5ed2d5037d1c4ac37b17946405050e60b2822757. origin/main is 1daef56a59b11de9d56c70fdb8b3d44b2a740c7c.
- There are two commits: e46167d5 (fix, 4 files) and 536e664d (test, 2 files). This matches the packet.
- The packet is 3316 bytes, sha256 70aa5a79…f247, as given.
- The form at origin/main is 220 lines, sha256 7c448e816901a2f40d5ec5c450009266224687b35cf69e5dd33ab00dbaedbae9. I read it whole, with Amendment 1.
- I also read the worker's report and Part 1, items 1 to 9, of the 2026-11-05 directive.

## Check 2, the diff
- `git diff --numstat B′...H` (rc 0): docsOnly.mjs 1/1, docsOnly.test.mjs 41/0, verify-quotes.mjs 1/1, verify-quotes.test.mjs 12/0.
- `--name-only` (rc 0) gave the same four paths.
- The whole diff is 4722 bytes, sha256 dfeec81a…b5ae1, the same as the packet's `p325-diff.patch`.
- Against §2:
  - 2.1: in `gitShowFile`, line 657 becomes `{ cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1 << 28 });`, last after `stdio`.
  - 2.2: in `gitShow`, line 73 becomes `{ cwd: repoRoot, encoding: 'utf8', maxBuffer: 1 << 28 });`, after `encoding`.
  - In both tools no other line changed, no import or export changed, and no line moved.
  - 2.3: both tests are appended at the end of their files. Each has a `// RECORDED MUTATION` comment that names code by file and function, with no `path:line`.
  - 2.4: no other path is in the diff.
- Against §7:
  - 4 files.
  - Each tool 1 insertion and 1 deletion; each test file 0 deletions.
  - Total 57, under the ceiling of 80 (the projection was about 61).
  - F1 is 2 lines plus 14000 × 79 bytes, about 1.12 MB. F2 is the eligible-edit plan plus 14000 × 79 bytes. Both are between 1 MiB and 2 MiB.
  - F2's plan text is byte-identical to the existing eligible-edit test (`docsOnly.test.mjs` 173-199 at H) with the padding appended. Only the title changes between its two commits.
- §8 items 1 to 9 all hold:
  - 1, 2, 3, 4: C1, C2, C3 below.
  - 5: see flag 3.
  - 6: see flag 4.
  - 7: the PR carries no record.
  - 8: no rooted `path:line` and no bare `:line` in the new comments.
  - 9: the form (27f4d167, 07:56:48Z) and Amendment 1 (5ed2d503) are ancestors of the branch's start. The code is committed at 08:44Z and 08:45Z.
- §8 item 10, CI, is check 9.
- The PR's paths changed on main between B′ and origin/main: by `git diff --name-only B′ origin/main` (7 paths) and `grep -cxF -f`, the count is 0. None, as expected.

## Check 3, C1 to C3
- I extracted the commands from the form's lines 188, 190 and 192 by `sed -n` with the 4-space indent stripped. Each is byte-identical (`cmp` rc 0) to the worker's `<S>/vqd-c188.sh`, `vqd-c190.sh` and `vqd-c192.sh` (762, 598 and 773 bytes).
- Run from `<W>` at H:
  - C1: rc 0, `ONE-LINE-OK`.
  - C2: rc 0, `PATHS-OK`.
  - C3: rc 0, `{"scripts/plan/docsOnly.mjs":[1,1],"scripts/plan/docsOnly.test.mjs":[41,0],"scripts/plan/verify-quotes.mjs":[1,1],"scripts/plan/verify-quotes.test.mjs":[12,0]} total 57`, then `APPEND-OK`.
- Each output is byte-identical to the worker's `.out` file (`cmp` rc 0).

## Check 4, the tests by name
- T1, `node --test --test-name-pattern="a_hash_checked_reference_into_a_file_over_one_mebibyte_verifies" scripts/plan/verify-quotes.test.mjs`: rc 0, tests 1, pass 1.
- T2, `node --test --test-name-pattern="a_plan_yaml_over_one_mebibyte_is_classed_by_its_content" scripts/plan/docsOnly.test.mjs`: rc 0, tests 1, pass 1.

## Check 5, the mutations, observed at H
I read the script `<S>/mut-vqd.mjs` before running it: 1571 bytes, sha256 0ccd955f…8c1d, as the packet says.

**M1**
- Applied: rc 0, `M1 scripts/plan/verify-quotes.mjs APPLIED`.
- `git diff`: one line in `gitShowFile`, from `stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1 << 28 });` back to `stdio: ['ignore', 'pipe', 'pipe'] });`. The blob index is 03492dbf..5c8ee2d9, which is exactly the base blob. This is §4's M1.
- T1 by its §9 command, output in `<S>/g325r-M1.txt`: rc 1, tests 1, fail 1. The only failing test is `a_hash_checked_reference_into_a_file_over_one_mebibyte_verifies`. Byte-copied:
```
  AssertionError [ERR_ASSERTION]: [{"relPath":"A.md","line":1,"reason":"unresolvable rev \"1e2ccf796e319a08e1882b9838199b20e424404a\" for \"T.md\" -- git show failed"}]
  
  1 !== 0
```
- It fails at `verify-quotes.test.mjs:1233:10`, the `assert.equal`, which is assertion (2). This is §4's expected failure: a JSON message of one finding whose reason begins `unresolvable rev` and names `T.md`.
- Reverted with `git -C <W> checkout -- scripts/plan/verify-quotes.mjs` (rc 0). T1 run again: rc 0, pass 1. `git diff` 0 bytes; porcelain 0 bytes.

**M2**
- Applied: rc 0, `M2 scripts/plan/docsOnly.mjs APPLIED`.
- `git diff`: one line in `gitShow`, `encoding: 'utf8', maxBuffer: 1 << 28 });` back to `encoding: 'utf8' });`. The blob index is b5135c87..fa1b4cad, the base blob. This is §4's M2.
- T2 by its §9 command, output in `<S>/g325r-M2.txt`: rc 1, tests 1, fail 1. The only failing test is `a_plan_yaml_over_one_mebibyte_is_classed_by_its_content`. Byte-copied:
```
  AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:
  + actual - expected
  
  + [
  +   'governance/PLAN.yaml: added or deleted — not a mechanical docs-only change'
  + ]
  - []
```
- It fails at `docsOnly.test.mjs:246:10`, the `assert.deepEqual`, which is assertion (2), with `operator: 'deepStrictEqual'`. This is §4's expected failure.
- Reverted with `git -C <W> checkout -- scripts/plan/docsOnly.mjs` (rc 0). T2 run again: rc 0, pass 1. `git diff` 0 bytes; porcelain 0 bytes; HEAD 536e664d.

**The two `RECORDED MUTATION` comments:**
- Each reads `RECORDED MUTATION at e46167d52fee, applied alone and reverted: \`maxBuffer: 1 << 28\` removed from the options of <fn> in <file> -> fails by name: \`<test name>\``. The function and file are named correctly for each, and the test name is the one that failed in my run.
- e46167d52fee is commit A, which holds both tests byte-identical to H apart from the comment line (`git diff e46167d5 536e664d` adds exactly the two comment lines).
- Neither comment calls a `verify-mutation` run an observation.
- §4's record rule and §8 item 6 are met. Neither mutation survived.

## Check 6, the code at H
**T1** (`verify-quotes.test.mjs` 1224-1234 at H)
- What it drives:
  - It builds F1 with the existing `gitTree` helper and commits `T.md` (2 known lines plus padding) in `os.tmpdir()`.
  - It asserts (1) that `T.md` is over 1024 × 1024 bytes.
  - It writes an untracked `A.md` that pins `T.md:1-2 @ <rev> sha256:<sha256 of the two LF lines>`.
  - It calls the exported `runVerifyQuotes({ repoRoot, files })`.
  - It asserts (2) `hashFindings.length === 0`, with the findings' JSON as the message.
- `checkHashRef` (`verify-quotes.mjs` 783-812 at H) returns a finding when the read is null and when the hash does not match. So (2) passes only if the file was read and the hash recomputed.
- It would fail if its claim were false: M1 shows exactly that.
- Cleanup is the existing `removeAfter`. No import changed.

**T2** (`docsOnly.test.mjs` 208-247 at H)
- What it drives:
  - It builds F2 with the existing `makeRepo` and `commitAll` helpers, and commits the plan twice with only the title changed.
  - It asserts (1) that the plan is over 1024 × 1024 bytes.
  - It asserts (2) that `checkDocsOnly(dir, base, head)` deep-equals `[]`.
- A null read gives the "added or deleted" line (M2). A parse failure would add the "could not be parsed" line. So `[]` proves the file was read and parsed and the limits diff ran (see O1).
- Cleanup is an inline `t.after` with `fs.rmSync`. No import changed.

**§2.3 and §8 item 5:** neither test spawns `node` or any tool's command line. T1 calls only `runVerifyQuotes`; T2 calls only `checkDocsOnly`. T2 asserts neither `main` output line.

**The seam to the product callers** (CI's verify:quotes step and the forms' run of the docs-only tool) is the command line. Its end-to-end proof from the real shape is E1 and E3 at H, run on the real repository's PLAN.yaml (check 8).

## Check 7, the suites (at H unless marked B′)
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`: rc 0, tests 606, pass 606, fail 0. This matches the worker's counts.
- `node scripts/plan/verify-cites.mjs`: rc 0, `verify:cites PASS — every rooted (in-tree) path:line reference across 3084 file(s) resolves. (201 loose reference(s) advised above.)`
- `node scripts/plan/verify-quotes.mjs` at H: rc 0, `verify:quotes PASS — 156 checked, 125 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 936 ruling cites resolved, 0 ruling-cite errors.`
- At B′:
  - `checkout -q --detach 5ed2d503…` rc 0; HEAD was 5ed2d503…, porcelain empty.
  - The run: rc 0, with the same PASS line.
  - The whole output at B′ against the whole output at H: `cmp` rc 0 (17349 bytes each), so the two PASS lines are byte-identical.
  - Against the worker's `<S>/vqd-vq-head.txt` and `<S>/vqd-vq-base.txt`: `cmp` rc 0 each.
  - The return, `checkout -q cut/verify-quotes-and-docsonly-read-files-over-one-mebibyte`: rc 0; HEAD 536e664d…, porcelain empty.
- `node scripts/plan/verify-test-claims.mjs`: rc 0, PASS, 812 claimed tests across 268 files.
- `node scripts/plan/verify.mjs --offline`: rc 0, `verify:plan PASS`.
- `node scripts/plan/forms-layout.mjs`: rc 0, PASS, 232 preregistration files.
- `node scripts/plan/verify-mutation.mjs`: rc 0. Both new tests show `ok`, and it printed `verify:mutation PASS — all 2 new test(s) have a recorded mutation naming them.` This is a pre-gate check, not an observation. The observations are those of check 5.

## Check 8, E1 to E3 at H (the scratch files read only)
The scratch files hold the one line §3 names. H1 = 26d515e4…68aa, which I recomputed from line 1 of the plan at 9c7a187b.

| Row | Command | rc | Output | §5's head prediction | Worker's file |
|---|---|---|---|---|---|
| E1 | `node scripts/plan/verify-quotes.mjs C:/dev/wt/mib-evidence/e1.md` | 0 | `verify:quotes PASS — 0 checked, … 0 hash-reference errors (0 hash-baselined), …` | PASS, 0 hash-reference errors, exit 0. Met. | identical (`cmp` 0) |
| E2 | the same with `e2.md` | 0 | the same PASS line | PASS. Met. | identical (`cmp` 0) |
| E3 | `git diff --name-only 8faccf89… 9c7a187b…` | 0 | the seven paths, PLAN.yaml among them | (name list, as in Amendment 1) | — |
| E3 | `node scripts/plan/docsOnly.mjs 8faccf89… 9c7a187b…` | 0 | only `docsOnly: eligible for delegation — 8faccf8958016e0d39095d8e53de1d8588623060..9c7a187b7c2497617f96c0174043706f0a7aa95f is mechanically docs-only.` | no PLAN.yaml line and no other offending line. Met (flag 2). | identical (`cmp` 0) |

## Check 9, CI
- `gh pr checks 325`, read 2026-11-15T09:34:24Z to 09:34:25Z by `date -u`: rc 0, 8 checks, all pass.
- Each run's head sha by `gh run view`: all eight are at 536e664dfc5b6296148e951896025516b71648bb, all success.

| Run | Workflow | Event |
|---|---|---|
| 43695978676 | Governance CI | push |
| 43695978644 | Ported notices | push |
| 43697999405 | Governance CI | pull_request |
| 43697999440 | DCO sign-off | pull_request |
| 43697999499 | Exposure scan | pull_request |
| 43697999420 | Ported notices | pull_request |

## Check 10, the packet's flags
1. **Yes.** The scripts the worker ran equal §9's commands byte for byte (`cmp` 0 for all three), and their outputs equal mine.
2. **Yes, it meets §5.** §5 predicts no PLAN.yaml line, the other predicted offending lines (none), and exit 0 when there are none. The eligible line is the tool's exit-0 output, not an offending line. See O2 for the closing amendment's wording.
3. **Confirmed.** T2 calls only `checkDocsOnly`; T1 calls only `runVerifyQuotes`; neither runs a tool's command line. §2.3 and §8 item 5 are met. The command-line path is proven by E1 and E3 at H.
4. **Yes.** Both comments name commit A, e46167d52fee, in the 12-hex form the other test files use. That is the commit where the tests stand byte-identical to H and where the worker observed the mutations. PRs here merge with merge commits (for example #323 and #322), so A will be reachable from main. My observations at H give the same failure.

**End:** `<W>` HEAD is 536e664dfc5b6296148e951896025516b71648bb and the porcelain is empty. I made no change in any repository other than the two mutations, each reverted, and the B′ checkout and return.

**Background shells:** four were started (b31xqqv9e, bjjxoyy8s, btt5z1y3m, btfq0notl). All four completed with exit 0 before this report; none is running and none was killed.

**Scratch:** only `<S>/g325r-*` files were written.

**Model:** Opus 5.5 (claude-opus-5-5).