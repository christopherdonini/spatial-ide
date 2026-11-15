*Custodian's filing note (2026-11-06): the words worker's report for the KL pair's human answers (`state/directives/2026-11-06-8e-words-replaced-u1-h1-h2-class-8-m10-kl-c1-c3-draft-marks-u12-mark-n1-n3-slot-2-order-clippy-placed-288-clicked.md`, line 16; the form's Amendment 2): the reviewer's C-1 to C-3 and the form's sixteen DRAFT openings, applied as four byte-given replacements in `KNOWN-LIMITATIONS.md`, on a new branch made from main b005d555, with no re-gate. Dispatched at 2026-11-06T16:57:15.594Z by its transcript from a brief of 13385 bytes (sha256 413b1b9a420abb9bc5105a277ee29c109e29486c42ae1939927cd414d8a523e8), whose span files were byte-copied by script and whose expected file hashes and numstat the custodian computed by applying the spans to copies. The run to its hand-back at 2026-11-06T17:10:04.747Z by its transcript (claude-sonnet-5-5; unique calls Bash 13, Read 1, Write 2 and the hand-back, 17, equal to the notification's). Saved from the hand-back message, one final newline. Its sha256, from line 5 to the end, is 07a907dd7d2665c87b87aa1afe900f4e046f6f606f0551c7b76067d6af24fd21. The custodian re-read, after a fetch: `cut/kl-pair-human-answers-c1-c3-and-draft-marks` at 0c3687527cda0022df3b53c7a76f74da2f13b0af, the changed files' sha256 as given, and the numstat 19/19 against b005d555. Model output, not Authority.*

---

Built: the KL pair's human answers at 0c3687527cda0022df3b53c7a76f74da2f13b0af
- Start state: worktree C:/dev/wt/klg, branch cut/kl-pair-human-answers-c1-c3-and-draft-marks. HEAD and origin/main both b005d5556e4d2e7908a756d9463691d1b3d58938. Porcelain empty. The brief's sha256 matched (413b1b9a...).
- The 8 words files: every sha256 and byte count matched the brief (old-C1 48ec6783..., new-C1 ca53819e..., old-C2 8a277fc8..., new-C2 884c3537..., old-C3 b35f1a83..., new-C3 f0a86860..., old-R0 f526fd8c..., new-R0 f927285f...).
- Script (klg-w-apply.mjs, rc=0): C1, C2 and C3 each found exactly once, R0 exactly 16 times; bytes in, bytes out, LF only.
- Check 1: sha256 of KNOWN-LIMITATIONS.md after the edit is de2d09eb6ba22888721cae8847af981991890becc6af7770e693f5f0e423ddf9, equal to the brief's.
- Check 2: `git diff --numstat` gave exactly "19 19 KNOWN-LIMITATIONS.md".
- Check 3: CR count in the file is 0.
- Commit: subject "docs: KNOWN-LIMITATIONS, C-1 to C-3 in the reviewer's words and the KL form's sixteen DRAFT marks made the human's (its Amendment 2)". One file changed, 19 insertions and 19 deletions, signed off with `-s`. The message file's only `@` was on the Co-Authored-By line. The committed message has two `@` lines, the trailer and the `-s` sign-off.
- Checks at the new head (all rc=0):
  - verify-cites: PASS, every rooted path:line reference across 2707 files resolves (175 loose advised).
  - verify-quotes, inside the shared hold: PASS, 138 checked, 107 verified, 30 baselined, 0 errors.
  - verify-test-claims: PASS, 741 claimed tests across 238 files.
  - verify --offline: PASS, PLAN.yaml agrees with the repository.
  - node --test over scripts/plan, hooks and evidence: 598 tests, 598 pass, 0 fail.
  - `git diff --numstat origin/main...HEAD`: "19 19 KNOWN-LIMITATIONS.md", total 1 file.
- Hold line: MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:59168 also=... It was granted and released (MACHINE_RELEASED).
- Push: rc=0, new branch. origin/cut/kl-pair-human-answers-c1-c3-and-draft-marks equals HEAD, 0c3687527cda0022df3b53c7a76f74da2f13b0af. Porcelain empty. I did not wait for CI.
- Background shells left: none. The hold call and my wait loop both finished with exit code 0, and I killed no process.
- Model as the harness reports it: Sonnet 5.5 (claude-sonnet-5-5), no override.
