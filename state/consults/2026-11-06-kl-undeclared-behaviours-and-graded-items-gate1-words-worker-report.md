*Custodian's filing note (2026-11-06): the words worker's report for the KL pair's single gate (`state/consults/gates/2026-11-06-kl-undeclared-behaviours-and-graded-items-gate1-reviewer.md`, gate-log 688): the reviewer's Documentation findings D-1, D-2 and D-4 to D-7 applied as nine byte-given replacements in `KNOWN-LIMITATIONS.md`, with no re-gate (the form's section C); D-3 is the custodian's, in PR #287's body. Dispatched at 2026-11-06T10:05:34Z by its transcript from a brief of 15093 bytes (sha256 132afc89c5ba8740189954d55619669c5586c99ffaef15ff83666be2917e9e01), whose span files were byte-copied by script from the filed report and the branch head 09216fd4, and whose expected file hash after the edits (c564656d) the custodian computed by applying them to a copy. The run to its hand-back by its transcript (claude-sonnet-5-5; unique calls Bash 14, Write 2, Read 1 and the hand-back, 18, equal to the notification's). Extracted by script from that hand-back, one final newline added. Its sha256, from line 5 to the end, is 61eee84214b1ac50227576c24e32906e3df57db7638b15f20c7dddbf363879af. The custodian re-read, after a fetch: the branch at f3f186ca9958d5fc6dc1d766d97884d96e9efbe6, the file's sha256 c564656d as given, and the numstat 9 and 9 against 09216fd4. Model output, not Authority.*

---

Built: the KL pair's Documentation findings at f3f186ca9958d5fc6dc1d766d97884d96e9efbe6

- Start state: HEAD and origin/cut/kl-undeclared-behaviours-and-graded-items both 09216fd499d96a67c77960309f0ace2ca8a4a0a7; porcelain empty.
- Words files: all eighteen sha256 matched the brief (shown by sha256sum before use).
- Script (klp-w-apply.mjs in the scratch folder): rc=0; D1a, D1b, D2a, D2b, D2c, D4, D5, D6 and D7 each found exactly once and replaced.
- Checks:
  - KNOWN-LIMITATIONS.md sha256 is c564656da9778d3b6b6663c561d1cd0f897ff98f7894dddd388c7c93d72324f8, as given.
  - `git diff --numstat` shows only `9 9 KNOWN-LIMITATIONS.md`.
  - The file has no CR (grep -c gives 0).
  - The message file had `@` only on its first trailer line.
- Commit: f3f186ca, signed off by `-s`. Subject: "docs: the KL pair, the single gate's Documentation findings (the reviewer's D-1, D-2 and D-4 to D-7)". It has one Signed-off-by line; the message file has none.
- Suite at the new head, each exit code and last line:
  - verify-cites: rc=0. "verify:cites PASS — every rooted (in-tree) path:line reference across 2685 file(s) resolves. (162 loose reference(s) advised above.)"
  - verify-quotes (shared hold): rc=0. "verify:quotes PASS — 138 checked, 107 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 915 ruling cites resolved, 0 ruling-cite errors."
  - verify-test-claims: rc=0. "verify:test-claims PASS — all 738 claimed test(s) across 236 file(s) exist or are planned, superseded or withdrawn (45 planned, 12 superseded, 17 withdrawn, advisory)."
  - verify.mjs --offline: rc=0. "verify:plan PASS — C:\dev\wt\klp\governance\PLAN.yaml agrees with the repository."
  - docsOnly.mjs origin/main HEAD: rc=0. "docsOnly: eligible for delegation — origin/main..HEAD is mechanically docs-only."
  - `node --test` with the three globs from governance-ci.yml line 150 (scripts/plan, scripts/hooks, scripts/evidence), second shared hold: rc=0; tests 598, pass 598, fail 0.
  - `git diff --numstat origin/main...HEAD -- KNOWN-LIMITATIONS.md`: rc=0. "74 30 KNOWN-LIMITATIONS.md" (the whole PR's change to that file, not this commit's).
- Hold lines:
  - Hold 1: MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:21768 also=… (then MACHINE_RELEASED).
  - Hold 2: MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:62908 also=… (then MACHINE_RELEASED).
  - Neither hold was refused.
- Push: `git push origin cut/kl-undeclared-behaviours-and-graded-items` rc=0 (09216fd4..f3f186ca). origin/cut/kl-undeclared-behaviours-and-graded-items equals HEAD, both f3f186ca9958d5fc6dc1d766d97884d96e9efbe6. Porcelain is empty. CI not awaited.
- Background shells: the verify-quotes hold call moved to the background after 180 s. Both background tasks (b9enz1do4 and the wait loop b7vcxwgpf) exited by themselves with code 0, so nothing is left running and I killed nothing.
- Self-check: the edits are fragments of one markdown file with no cross-module seam. Each completion claim above is backed by a call in this transcript. I added no user-facing behaviour text beyond the byte-given words.
- Model: Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff.
- Scratch files: in the scratchpad folder, names start `klp-w-`.
