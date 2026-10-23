Reviewed: PR #242 at 91ccdab4904b5937b53b296b03a91a62b41fd2f3, the scoped re-gate after correction round 1, reviewer
Branch and commit: cut/verify-quotes-round-item-cites @ 91ccdab4904b5937b53b296b03a91a62b41fd2f3
Verdict: PASS WITH NOTES

## Correctness

None. The round changes no product code (`verify-quotes.mjs` changes only in its header comment). The applied words hold against the code at the head:
- the tail is read only after `items`, not after `item` (`verify-quotes.mjs:854`);
- `CITE_TAIL_RE` covers the forms `, K`, `, and K`, `and K` and `to K` (`:842`);
- the skip spans and the `>` line test are at `:836` and `:838`.

## Evidence

None blocking.

**N-1 (note, non-blocking). The carrier route's reader is still unproven.**
- I dropped the round-file reader from the **carrier** call only (`verify-test-claims.mjs:557`). `node --test scripts/plan/verify-test-claims.test.mjs scripts/plan/rotate-decisions-pending.test.mjs` then gave rc=0, tests 82, pass 82. I reverted and the porcelain was empty.
- MC2 as the form's Amendment 4, item 2 defines it (both calls) fails C2. No record claims the carrier route is covered.
- If that line regressed, the check would fail closed: a valid carrier that cites an itemless round would be refused by name, not passed.
- Suggestion: in C2's `build`, also pass `carrier: 'round 66, item 2'` (or add a twin test). Not required for this merge.

**Commit id for MC2.** The worker observed MC2 on b08a1fec with C2 uncommitted. My re-observation below is at 91ccdab4904b5937b53b296b03a91a62b41fd2f3, so §4's "with the commit id" now holds.

## Documentation (must-fix before the merge, no re-gate)

None of these sentences is the human's wording.

**D-1. The PR body, lines 7, 8 and 23, are stale at the head.**

Line 7. Current: "- **Form:** `scripts/plan/VERIFY-QUOTES-ROUND-ITEM-CITES-PREREGISTRATION.md`, with Amendments 1 to 3. The human ruled OPEN-1 (A), OPEN-2 (B), OPEN-3 to OPEN-7 (A), and I4 (A)."
Replace with: "- **Form:** `scripts/plan/VERIFY-QUOTES-ROUND-ITEM-CITES-PREREGISTRATION.md`, with Amendments 1 to 5. The human ruled OPEN-1 (A), OPEN-2 (B), OPEN-3 to OPEN-7 (A), and I4 (A)."
- Clause check: the form at main dd1a405e carries §10 Amendments 1 to 5 (heading grep, lines 343 to 389). The rulings sentence is unchanged.

Line 8. Current: "- **B** is a1bbc81eda83075ee870240ba12738600372de4a. **H** is b08a1fec4e3405153b4998882427355fa18db319. Main was merged in twice, at c86b2c9c and 49a7f532."
Replace with: "- **B** is a1bbc81eda83075ee870240ba12738600372de4a. **H** is 91ccdab4904b5937b53b296b03a91a62b41fd2f3; S3 was b08a1fec4e3405153b4998882427355fa18db319. Main was merged in twice, at c86b2c9c and 49a7f532."
- Clause check: `gh pr view 242` gives headRefOid 91ccdab4…. In the first-parent log, b08a1fec is "docs(plan): … (S3)" and its parent 8e04dbe2 merges 49a7f532. 85ac5d78 merges c86b2c9c, and the root is a1bbc81e.

Line 23. Current: "the header of `verify-quotes.mjs` (lines 113 to 123)"
Replace with: "the header of `verify-quotes.mjs` (lines 113 to 123 at b08a1fec)"
- Clause check: the reconciled words' section 1 names lines 113 to 123 at b08a1fec. At the head, the hunk `@@ -111,16 +111,22 @@` moves them.

**D-2. The rest of gate 1's D-4: S4's closing amendment is still not on main.**
- §9 orders S4 (references and hashes only) before S5. It must land before the merge.
- It should carry, as references:
  - the §7 figures at the final head. At 91ccdab4 that is 415 lines over 7 files over 49a7f532...H, and 3,280 over 32 by §7's literal B...H. Amendment 4, item 4 records the literal figure only at b08a1fec (3,240 over 32; my recount matches).
  - Amendment 2, item 1, as corrected by Amendment 4, item 4, for S1's `readRoundFile` deviation.

## Gate 1 findings: closed or not

- **E-1: closed.**
  - C2 exists at `scripts/plan/verify-test-claims.test.mjs:85` @ 91ccdab4. It starts from the real `runVerifyTestClaims`, with the rounds 66 and 67 block and `state/questions/round-66.md` read by `git show 40b04b46:` and found by round.
  - It asserts the positive case (0 findings, 1 withdrawn row whose ruling is `round 66, item 2`) and the negative case (1 finding, `unresolvable ruling: round 66, item 9`).
  - MC2 fails it at the head (check 2).
- **D-1, D-2 and D-3: closed.** The reconciled words' sections 1 to 4 replace them, and they are applied byte for byte (check 1).
- **D-4: closed in content, S4 still due.**
  - The §7 range is recorded in Amendment 4, item 4 (375 over 7) and Amendment 5, item 1 (415 over 7). The `readRoundFile` deviation is in Amendment 2, item 1, as corrected by Amendment 4, item 4.
  - The labelled S4 closing amendment is still missing: D-2 above.
- **H-1** is the human's. Per Amendment 4, item 5, the merge waits for it.

## What I checked (commands and exit codes)

1. **Round diff.**
   - `git diff b08a1fec…...91ccdab4…` rc=0, saved and read file by file. There are 4 files, 53 insertions and 13 deletions, in one commit (91ccdab4, parent b08a1fec).
   - Contents:
     - `governance-ci.yml`: the comment and the step name.
     - `README.md`: the one paragraph.
     - `verify-quotes.mjs`: header comment lines only.
     - `verify-test-claims.test.mjs`: C2 only, plus its 3 comment lines.
   - Words check (a node script over the consult and `git show` of both commits) rc=0:
     - Sections 1 and 2: each current block occurs once at b08a1fec and 0 times at the head. Each replacement occurs once at the head. b08a1fec with the replacement applied equals the head byte for byte.
     - Sections 3 and 4: applied together, they equal the head's `governance-ci.yml`.
   - PR body, sections 5 and 6: each replacement occurs once (rc=0) and the old text 0 times.
   - Filing-note hashes, lines 5 to the end, recomputed. Both match: the round report 07462c7a…, the reconciled words 8352a124…. The form, those two consults and my gate 1 report are unchanged against main dd1a405e (`git diff --stat` empty, rc=0).
2. **C2 and MC2 at the head.**
   - C2 alone (`--test-name-pattern`): rc=0, tests 1, pass 1.
   - MC2 applied by a backslash-free node script ("mutated lines: 2"). The diff, shown before the run, drops `, (r) => trackedRoundFileText(root, r)` from `:551` and `:557`.
   - C2 alone then gave rc=1, tests 1, fail 1: "✖ verify-test-claims: a withdrawn-test row whose ruling cites an itemless round resolves through the tracked round file". AssertionError: `[{…,"message":"unresolvable ruling: round 66, item 2"}]`, 1 !== 0.
   - `git checkout -- scripts/plan/verify-test-claims.mjs` rc=0. Porcelain 0 bytes.
   - The N-1 probe (carrier only): rc=0, 82 of 82 pass. Reverted, porcelain 0 bytes.
3. **Full suite in a shared hold.**
   - Hold: `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF …`. Release: `MACHINE_RELEASED project=SpatialIDE … affinity=FF (cores 0-7)`.
   - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"` rc=0: tests 543, pass 543, fail 0, cancelled 0, skipped 0, duration 147 s.
   - The worker's four hooks tests passed in this run, so nothing needed a run alone.
   - Disclosed: I ran this call with run_in_background, not in the foreground, because the worker's shared run took 955 s and the foreground ceiling is 600 s. Its exit code was captured by the hold line's `echo rc=$rc ; exit $rc` (rc=0, task exit 0).
4. **Scripts at the head**, one call, each rc printed:
   - `verify-quotes.mjs` rc=0: "130 checked, 99 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 836 ruling cites resolved, 0 ruling-cite errors."
   - `verify-test-claims.mjs` rc=0: 613 claims across 188 files.
   - `verify-cites.mjs` rc=0: PASS, 2,189 files.
   - `verify.mjs` rc=0: PASS.
   - `queue.mjs --check` rc=0: current.
   - `site.mjs --check` rc=0: current.
   - Porcelain 0 bytes.
   - Disclosed: the call ran past 600 s and the harness moved it to the background. All six exit codes were in its output.
   - **U4:**
     - b08a1fec's `verify-test-claims.mjs`, copied untracked as `scripts/plan/vqri-g2r-B-verify-test-claims.mjs`: rc=0. Deleted (rm rc=0). `cmp` against the head's output rc=0 (17,853 bytes each). Porcelain 0 bytes.
     - The same with the form's B (a1bbc81e) as `vqri-g2r-B0-…`: rc=0, rm rc=0, `cmp` rc=0, porcelain 0 bytes.
5. **§7.**
   - `git diff --numstat 49a7f532…...91ccdab4… -- . <§7 exclusions>` rc=0: 381 + 34 = 415 lines over 7 files, within 550 and 7. 49a7f532 is the merge-base (rc=0).
   - The round adds net 40 (375 to 415): 53 insertions less 13 deletions of lines the piece itself added.
   - §7's literal B...H: 3,280 over 32 at the head, 3,240 over 32 at b08a1fec (rc=0 each).
   - Main changed none of the 7 files between a1bbc81e and 49a7f532 (`git diff --stat` empty, rc=0).
6. **CI.**
   - `gh pr checks 242` rc=0: 8 of 8 pass (cfg boundary ×2, sign-off, profile path, ported-notices ×2, test · verify:plan ×2).
   - `gh run list` rc=0. At head sha 91ccdab4904b5937b53b296b03a91a62b41fd2f3, these runs are all completed and successful:
     - Governance CI (pull_request 39798986981, push 39798978960);
     - DCO sign-off 39798987013;
     - Ported notices (39798987178, 39798978957);
     - Exposure scan 39798986943.
   - Product CI last ran at 8e04dbe2 (success). The round touches no product path.
7. **Gate 1 items:** as above.

The worktree is clean at the end, with HEAD 91ccdab4904b5937b53b296b03a91a62b41fd2f3. Scratch files are all named `vqri-g2r-*` in the session scratch folder. Nothing was committed, pushed or edited.
