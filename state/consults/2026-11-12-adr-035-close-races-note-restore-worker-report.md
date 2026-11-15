*Custodian's filing note (2026-11-12): the #308 restore worker's report, from its hand-back (2178 bytes, sha256 6d157e4222dd44544b84dcb870cd8f471310b93dcb650aa5aeebbb786d07c1dd), below the rule; a final newline is added; nothing else is changed. Its brief by file (6427 bytes, sha256 4343d92d9f5e5dd6ec1bfb6f4f529e7310f53fedaeb4fb5a0ef7d4cef366095e); the run 22:04:17Z to 22:07:57Z by its transcript, 18 calls (Read 2, Bash 10, Write 4, Edit 1, SubagentHandback 1), no errored call, no heavy command and no hold, model claude-sonnet-5-5. Its git writes are the ones its brief names: a fetch, the ADR checked out from main, two commits of that one path, and the push in a call of its own. The custodian's check at this commit: the PR's diff against main is 8 lines added and none removed, in the ADR alone, and the human's line (line 39 of the 13:07Z message's file, without its quotation marks) is in the ADR once, as a whole line. A report, a reading and not Authority.*

---

Restored: #308 at a9455d48c0d7332327c4674eafc50a9f5058e720
Result: done

Brief sha256 matched (4343d92d…095e).

Step 0:
- HEAD and origin/cut/adr-035-close-races-note were both 1700ac8c13cbe4ade821a66165ce5f62bd833fab.
- Porcelain was empty.
- The `git diff --quiet` of the ADR between merge-base and origin/main exited 0.

Split script (`node --check` rc 0, run rc 0):
- main ADR 28260 bytes, sha256 f81031bb1ba5ef1cb711737824cf5f5611936594eb237a688f63e3e389566c85
- note old 1450 bytes, sha256 d26bcec60460367931426f6df1d574e3bc07b937456c68ba1153070f7e1c9197
- note new 1650 bytes, sha256 f0e0e80d31d9e9cfc4cd469d3557b0a7797acf0e206f80f7b17237fbbfbcd809
- line 39 without quotes 592 bytes, sha256 2cc1121588efb0de3ef1b695ad18fbf3b6e1bfda50128210badd54bef2aa879d
- differing lines: 1 (old item 1 at index 5 of 9)

Commit 1: 9ece7e13383f519fb172d17ef26ebe74effc77e9. `git show --stat` shows the ADR alone, 8 deletions. After `git checkout origin/main -- <ADR>`, `git diff --quiet origin/main` exited 0.

Commit 2: a9455d48c0d7332327c4674eafc50a9f5058e720. `git show --stat` shows the ADR alone, 8 insertions. The Edit succeeded on the first attempt.

Check script (rc 0):
- PASS worktree equals main plus note-new, byte for byte
- PASS no CR
- PASS no tab
- PASS final newline
- PASS no removed lines
- PASS one hunk, added after main's last line
- added lines 8, hunk `@@ -158,0 +159,8 @@`

Step 4:
- `git diff --stat origin/main...HEAD` names the ADR alone, 8 insertions.
- `git log --oneline origin/main..HEAD` shows a9455d48, 9ece7e13 and 1700ac8c.
- `verify-cites` rc 0: "verify:cites PASS … (277 loose reference(s) advised above.)"

Push: `1700ac8c..a9455d48  cut/adr-035-close-races-note -> cut/adr-035-close-races-note`, no force. `git ls-remote` shows `a9455d48c0d7332327c4674eafc50a9f5058e720 refs/heads/cut/adr-035-close-races-note`, equal to HEAD.

Porcelain at the end: empty.

Not named in the brief: I added "(rc)" check output lines and read the directive's lines 37-41. Both commit messages also name the human's item and end with the two required lines.

Model: Sonnet 5.5 (claude-sonnet-5-5), as the harness reports it. No override and no context handoff.
