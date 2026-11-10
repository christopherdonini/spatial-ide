Reviewed: PR #248 at 197d81ea607027f26511d9df39f44aea8d726fb5, gate 1, reviewer
cut/flush-crlf-field-rewrite @ 197d81ea607027f26511d9df39f44aea8d726fb5
Verdict: FAIL

The code change and its evidence are sound. One sentence fails, and it is the only thing that fails: a guarantee in the contract comment that the code does not support. That counts as Correctness under the proportional-gates rule, but it is a wording block. Replacement words are below. They are not the human's wording, so the worker applies them with no re-gate and the PR body lists them.

## Correctness

**C1. The contract comment claims more than the code does.**
- Where: `scripts/hooks/flush.mjs:24` at the head. The clause is "and no byte outside the rewritten values changes."
- What is wrong: the matcher is `^<label>:\s` (`scripts/hooks/flush.mjs:172`), and the rewrite always writes `${key}: ${value}` (`scripts/hooks/flush.mjs:187`). So the separator after the colon is always written back as one space, whatever it was before.
- Observed in probe 4 (below): a copy of the real ledger with `position:` followed by a tab. The CLI exited 0 and wrote `position: probe position value\n`. The tab is gone ("tab before: true; tab after: false"). That is a byte outside the rewritten value, changed.
- Ordinary use can reach it: the ledger is a plain-text file, and anyone can hand-edit it.
- The same over-broad words are the form's §1 may-claim 3. The worker copied them faithfully, so §8 item 4 holds as worded.
- Fix (replacement words). Line 23 stays byte for byte. Line 24 becomes:
  `//     LF), and no line other than the rewritten ones changes.`
- Clause check against the code at the head:
  - (1) "keeps the line ending of the line it replaces (CRLF stays CRLF, LF stays LF)". Line 23 is unchanged. Proof: the text is split on LF (`flush.mjs:162`), each targeted element gets a CR exactly when it ended with one (`flush.mjs:187`), and the lines are joined on LF (`flush.mjs:189`). T1 (a) and (b) assert it, and probes 1 and 3 found 3 of 3 targeted lines with their own terminator.
  - (2) "no line other than the rewritten ones changes". Proof: only `lines[at]`, for the keys located in `lineForKey`, is reassigned (`flush.mjs:185-188`), and splitting and rejoining on LF leaves every other element as it was. T1's exact equalities assert it, and probes 1, 2 and 3 found 0 untargeted lines differing over 264 lines each.
  - These words claim less than may-claim 3 and the same as may-claim 1, so §8 item 4 still holds.
  - Not the human's wording. It is the worker's doc comment, carrying the architect's may-claim 3.

## Evidence

None.

## Documentation (must fix before the merge; no re-gate)

**D1.** The form's §1 may-claim 3 (on main; append-only) carries the same over-broad clause. When C1's words land, the custodian records in the next amendment, by reference, that the comment states may-claim 3 narrowed to lines. That keeps the comment and the form from reading as two different claims. §1 is not edited.

## §8 items

1. No existing test's assertion edited. Holds: the test file numstat is 41 added and 0 deleted, and the diff hunks are additions only.
2. No new export, option or CLI flag. Holds: `crlf`, `onlyTipCrlf` and `at` are local, and `parseArgs` is unchanged.
3. No byte changed on an untargeted line, and a mixed file not normalized. Holds: probe 3 (mixed file) left 0 untargeted lines differing, and the untargeted CRLF `branches` line is still CRLF.
4. The contract comment claims no more than may-claims 1 and 3. Holds as worded, but may-claim 3 itself overclaims (C1).
5. No mutation recorded as observed by a `verify-mutation` run. Holds: MC8 to MC10 read "applied alone and reverted", and I re-observed all three by hand. I did not run `verify-mutation`.
6. No diff outside §7. Holds: two files.

## What I checked, with its evidence

**1. Diff.** Commands: `git diff 1f669f21…197d81ea` rc 0, and `git log` of the range rc 0.
- Two commits, 8bfc3e69 and 197d81ea. `flush.mjs` is identical at 8bfc3e69 and at the head (`git diff --stat` between them shows only the test file, +3).
- `flush.mjs`: a two-line comment bullet, and the rewrite now ends with `${lines[at].endsWith('\r') ? '\r' : ''}`. That matches §2.1 (per line, from that line alone) and §2.2 (one bullet).
- `flush.test.mjs`: MC8 to MC10 at lines 184-186, T1 at 306 and T2 at 316, each under its exact §4 name.
- T2 reads the real ledger normalized to LF, writes CRLF and LF copies, runs the CLI with `--file` and the three fields given explicitly, then compares `buildOutput` up to `\n\nResume facts:`. That is the real producer shape into the real reader seam.
- Main has not changed the two files since B (`git diff --stat 1f669f21 5328670b` over them: empty). The form on main has no deleted line since B, so Amendments 1 and 2 are append-only. The merge base of the head and main is B.

**2. Mutations.** Made in the throwaway `C:/dev/wt/fcrlf-g1r`, detached at the head. I applied each by a script that requires exactly one occurrence of the line, ran `node --test` on `scripts/hooks/flush.test.mjs` and `scripts/plan/rotate-cut-state.test.mjs`, then ran `git checkout` on the file. The porcelain was 0 bytes after each revert.
- Disclosure: my first apply attempt exited 2 ("expected 1 occurrence, got 0", the Bash tool collapsed a backslash), so nothing was mutated. Both suites then ran unmutated, rc 0 (20/20, 9/9). That run is not counted. The working version builds the backslash with `String.fromCharCode(92)`.
- Head baseline: flush rc 0, 20 pass. rotate rc 0, 9 pass.
- M1, the CR dropped: flush rc 1, 18 pass, 2 fail. T1 fails with (a) and (b) differing and (c) equal; I compared the three array elements by script. T2 fails at "an LF without a CR before it in the CRLF file" (`flush.test.mjs:329`). rotate rc 0, 9 pass. This matches MC8 and P2.
- M2, `text.includes('\r\n')`: flush rc 1, 19 pass, 1 fail. T1 differs at (b) only (`position` gets a CR). T2 passes. rotate rc 0, 9 pass. This matches MC9.
- M3, a CR always: flush rc 1, 19 pass, 1 fail. T1 differs at (b) and (c), not (a). rotate rc 1, 8 pass, 1 fail. The rotate failure is `rotate-cut-state: after the rotation commit and a ledger-only flush commit, session-resume prints the block, the precompact hook allows and the stop hook's continuity step passes`, at "its fields are the eight seeded lines" (`rotate-cut-state.test.mjs:222`): the seeded lines carry `\r` while the rotated file's lines do not. This matches MC10 and Amendment 2.

**3. §7 count.** `git diff --numstat B...H` rc 0: `flush.mjs` 4 added and 1 deleted (5), `flush.test.mjs` 41 and 0 (41). 46 in all, against 8, 60 and 68. Within all three.

**4. Hash pins.** I recomputed all 24 pin occurrences in the form on main by script, each over its cited lines at cfbf1e80 joined with a final newline: rc 0, 24 of 24 OK, 0 bad.
- That is 23 written as `path:line @ rev sha256:hex` plus the `.gitattributes:5` pin written in words.
- Two pins repeat (`flush.mjs:14-24` and `flush.test.mjs:82-94`), which accounts for Amendment 1's count of 24.
- The 11 cited files do not differ between cfbf1e80 and B (`git diff --stat`: empty).

**5. CRLF probe.** Source: the real ledger, `git show 5328670b:state/CUT-STATE.md`, 264 lines, no CR. Each copy was written to my scratch folder and the head's CLI run on it with `--field` `flushed_at`, `tip` and `position`, with `CUSTODIAN_TELEGRAM_DRY_RUN=1` and no bot token or chat id in the environment. Probe script rc 0, 0 fails.
- (1) Every LF made CRLF: exit 0. No LF without a CR before it, the CR count equals the LF count, 3 of 3 targeted lines are `label: value` plus CRLF, and 0 of 264 untargeted lines differ from the copy.
- (2) The LF control: exit 0 and no CR. Probe 1's result with CRLF made LF equals probe 2's result byte for byte.
- (3) Mixed, with only `tip` and `branches` CRLF: 3 of 3 targeted lines keep their own terminator, 0 untargeted lines differ, `branches` is still CRLF and `flushed_at` is still LF.
- (4) A tab after `position:`: the tab is replaced by a space (C1).

**6. Suites at the head,** run in the throwaway.
- `verify.mjs` rc 0: "verify:plan PASS".
- `verify-cites.mjs` rc 0: "PASS — … 2291 file(s) resolves".
- `verify-quotes.mjs` rc 0: "131 checked, 100 verified, 30 baselined … 0 ruling-cite errors".
- `verify-test-claims.mjs` rc 0: "PASS — all 640 claimed test(s) across 195 file(s)".
- `queue.mjs --check` rc 0: "current".
- `site.mjs --check` rc 0: "site/ is current".
- The `node --test` scripts suite, three globs, inside a shared hold: rc 1, tests 553, pass 551, fail 2. Both failures are the guardian parity test and its subtest `PS1`, reading `'not judged'` where `'stale'` was expected. The parent test took 140470 ms. The suite ran while my own verify-quotes run was still going, so it was under my own extra load.
- `scripts/hooks/guardian-continuity-parity.test.mjs` alone, inside a shared hold: rc 0, 15 of 15 pass, 9.5 s.
- This is a timing-sensitive failure seen in a shared run, so I have not recorded it as a failure. It goes to the custodian for a solo re-run if wanted.

**7. CI.** `gh pr checks 248` rc 0 on the second read; the first read was rc 8, with one check still pending. All 8 checks pass. Each run's head sha, from `gh run view`, is 197d81ea607027f26511d9df39f44aea8d726fb5:
- 39993607625 and 39995895469: Governance CI, push and pull_request.
- 39995895234: DCO.
- 39995895158: Exposure scan.
- 39993607611 and 39995895169: Ported notices.

**End state.**
- `C:/dev/wt/fcrlf`: porcelain 0 bytes, HEAD 197d81ea607027f26511d9df39f44aea8d726fb5.
- `git worktree remove C:/dev/wt/fcrlf-g1r` rc 0. `git worktree list` has 0 lines naming fcrlf-g1r, and the folder no longer exists.
- No commit, push or PR action. Scratch files are only `fcrlf-g1r-*` in my scratch folder.
