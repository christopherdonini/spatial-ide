*Custodian's filing note (2026-10-27): the worker's report on #263's words commit, the architect's gate 1 D1 (one sentence of kernel/FIXTURES.md, the output path), applied by script from the pair file. The custodian's check by git: the branch head is fb0f8b92, its diff from d033b201 one line in and one out of kernel/FIXTURES.md. The run 21:58:35Z to 22:05:36Z by its transcript (Bash 9). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is ae750736eddf30c480056155bd765ab6a9f2deb81e1fc319d975a393222cf4ce.*

---

Applied: fixture-s-regeneration-entry-point D1 at fb0f8b923a3a7d4319b9c84abf4d6edac0e5cf23

- Start state: the worktree HEAD was d033b201f1903564841b6233f21d5cfde5ecc763, equal to origin's branch, with a clean porcelain. The pair file's sha256 was 873d3ee7...6eba, as the brief gave it.
- Script (one-off, not committed): before the replace `old` occurred 1 time and `new` 0 times. After it, `old` occurred 0 times and `new` 1 time.
- Diff: `git diff --numstat` gave `1 1 kernel/FIXTURES.md` (rc 0). The only changed line is the Guardrails sentence, where "renames it to the Path only when" became "renames it to the output path only when".
- Checks, run in the worktree, all rc 0:
  - `verify.mjs --offline`: PASS, PLAN.yaml agrees with the repository.
  - `verify-cites.mjs`: PASS, 2442 files.
  - `verify-quotes.mjs`: PASS, 131 checked, 100 verified, 0 hash-reference errors, 0 ruling-cite errors. It ran past 180 s and was moved to the background.
  - `verify-test-claims.mjs`: PASS, 683 claimed tests across 208 files. This was the last command in the same loop, so it ran after verify-quotes finished.
  - I ran no cargo command.
- Commit: one commit, subject as the brief gave it. The message file's only `@` is in the Co-Authored-By trailer, and `-s` added one Signed-off-by line. It was committed with `git commit -s -F`, with `kernel/FIXTURES.md` added by path.
- Push: `git push origin cut/fixture-s-regeneration-entry-point` returned rc 0. After a fetch, HEAD and origin's branch are both fb0f8b923a3a7d4319b9c84abf4d6edac0e5cf23, and the porcelain is empty.
- Pre-gate classes:
  - Cross-module interfaces: none touched.
  - Completion claims: each one points to the counts, diff and exit codes above.
  - User-facing messages: none changed.
  - Test assertions: not applicable, since this was a one-line Markdown change.
- Model: Sonnet 5.5 (claude-sonnet-5-5) as the harness reports it, no override, no context handoff.
- Off-scope: nothing noticed. No PR action was taken.
