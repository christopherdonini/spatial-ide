*Custodian's filing note (2026-11-10): the words worker's report for gate 1 of PR #306, from its hand-back (sha256 46bdd4376dae297c778f47dbd6ebf33a76ad3404c81285999210300b2866762e, 2135 bytes), byte for byte. Its brief by file (6536 bytes, sha256 05b855c199944e9e3c321f8640be705965ced4e4d71a2a51522ee2ffed8d0a3e). Its transcript holds 19 unique calls (Bash 15, Read 1, Write 2, the hand-back 1); model claude-sonnet-5-5; run 02:11:32Z to 02:21:59Z; one hold-shaped call, for `verify-quotes`, held shared and released. Its one errored result is a call opening with `sleep 120`, which the harness blocked; its waits were then bounded loops. Checked by the custodian's script at origin: the branch at 8e31200734fc160399992cfcf5080c8065fca782, one commit on 6bb26b0c; only `frontends/shell/e2e/publish.mjs` changed, 9 added and 4 removed, the old head's file with the old words replaced by the words file (1192 bytes, sha256 c48b79cbf6ab91b62a03f9da87bf742570e97e7b7ceeba493bf109fd39e19834) and no other byte; against the base 391f5934, 31 added and 5 removed in the one file; the message the briefed subject and trailers with one sign-off. The reviewer's W1 to W3 words (gate-log 715), nine lines in place of lines 40 to 43, applied with no re-gate (Part 1, item 2).*

---

Words applied: PR #306 at 8e31200734fc160399992cfcf5080c8065fca782

Preconditions: HEAD was 6bb26b0ce94b45b15435638dea9ffea3a9346ab8, the branch was cut/publish-e2e-filtered-step-shared-run-failure, and the tracked porcelain was empty. The old file was 715 bytes with sha256 8b1ca06e…6621ee. The new file was 1192 bytes with sha256 c48b79cb…9834. Both equal the brief's values.

Steps (each exit code 0 unless noted):
1. Replace, by the scratch script pef-w-apply.mjs (apply mode), rc=0. Output: "occurrences 1; starts at line 40 to 43 / applied".
2. Verify, same script (verify mode), rc=0.
   - Head file had 683 lines, now 688, delta 5.
   - Lines 1-39 and the tail are byte-equal; the middle nine lines equal the new file.
   - RECORDED MUTATION true, Observed true.
   - Output ended "EQUAL-EXCEPT-WORDS".
3. Diffstat:
   - `git diff --numstat` gave `9 4 frontends/shell/e2e/publish.mjs`, nothing else.
   - Against 391f5934bc96…: `31 5`, 36 against the form's 40.
   - In the nine lines: CR false, tab false, nonascii false. The file ends with one newline.
4. `node --check frontends/shell/e2e/publish.mjs`: rc=0.
5. Verifiers, all rc=0:
   - verify-cites: PASS, 2799 files.
   - verify-quotes (in a shared hold): PASS, 155 checked, 124 verified.
   - verify-test-claims: PASS, 783 claimed tests.
   - verify.mjs --offline: PASS.
6. Commit 8e312007, `git commit -s -F`, rc=0: 1 file changed, 9 insertions, 4 deletions. The subject and trailers are as briefed. I typed no sign-off line and no email.
7. Push, in its own call: 6bb26b0c..8e312007 on the same branch name. Next call: HEAD and origin/cut/publish-e2e-filtered-step-shared-run-failure are both 8e31200734fc160399992cfcf5080c8065fca782, and porcelain is empty.

Hold lines (my project only, `also=` segment elided):
- MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF
- MACHINE_RELEASED project=SpatialIDE affinity=FF (cores 0-7)

Background shells left: none. Every background command I started has exited: the hold call, and the two wait loops that were bounded.
Model: Sonnet 5.5 (claude-sonnet-5-5), as the harness gives it.
Off-scope: none touched.
