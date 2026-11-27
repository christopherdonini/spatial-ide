# Milestone 5 PR A: row AF0a's read-back and its log line, the words of ADV-2026-11-24-14 item 3, the worker report

*Filed by the custodian from the worker's hand-back, as claims, not evidence: node:shell-migration-milestone-5@pr-a-part-af0a-words-1. Its commit 806ad30843269f8012ec1d89f0224703a8078ad7 on `cut/shell-migration-milestone-5-pr-a` changes one file (2 2 frontends/shell/MANUAL-WALKTHROUGH.md), as the custodian read from its diff; the file at the commit is the file at its parent with row AF0a's line and its log line replaced by the three fenced texts of ADV-2026-11-24-14 item 3, byte for byte, and nothing else in the walkthrough. It ran during no build, in the sitting. Dispatched at 2026-11-24T05:41:06Z; its run: Bash 6, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-sonnet-5-5, from 2026-11-24T05:41:06Z to 2026-11-24T05:41:38Z by its transcript; 0 calls named the main checkout; handed back at 2026-11-24T05:41:38Z. 1425 bytes, sha256 a0ed4775d2bbb1aeadcca41354be09689eb28a463d378714244eed344ed927ba, byte for byte, nothing masked, with one final newline added.*

---

Part AF row AF0a's words are committed and pushed on `cut/shell-migration-milestone-5-pr-a`. They changed the `| AF0a |` row and the `- **AF0a (` log line (the log line now reads "what each call returned"), and nothing else.

- **Commit:** 806ad30843269f8012ec1d89f0224703a8078ad7. Its parent is c62940ab70da475a056f1b6316e6fca08e8c8902.
- **`git diff --numstat c62940ab HEAD`:** `2	2	frontends/shell/MANUAL-WALKTHROUGH.md`
- **Push, last line:** `c62940ab..806ad308  cut/shell-migration-milestone-5-pr-a -> cut/shell-migration-milestone-5-pr-a`
- **`git status --porcelain` after the push:** empty.
- **Message file hash:** `msg-m5a-af0a-1.txt` hashed to `7ac06d34…6162b`, as required. The pre-commit hook ran and did not refuse.

Commands, in order (all exit 0):
1. `git rev-parse HEAD`, `git rev-parse --abbrev-ref HEAD` and `git status --porcelain` all passed the step 1 checks.
2. `node <S>/apply-m5a-af0a-1.cjs` printed `APPLIED 2 edits in 1 files`.
3. `git diff --numstat` and `git diff | grep '^[-+]' | cut -c1-60` showed only the two expected lines.
4. `git add -- frontends/shell/MANUAL-WALKTHROUGH.md`
5. `sha256sum <S>/msg-m5a-af0a-1.txt`
6. `git commit -s -F <S>/msg-m5a-af0a-1.txt`
7. `git rev-parse HEAD HEAD~1`
8. `git push origin cut/shell-migration-milestone-5-pr-a`, in its own call.
9. `git diff --numstat c62940ab HEAD` and `git status --porcelain`.

Model: Sonnet 5.5 (claude-sonnet-5-5), no override.
