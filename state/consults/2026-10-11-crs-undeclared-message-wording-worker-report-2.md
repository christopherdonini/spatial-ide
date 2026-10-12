*Custodian's filing note (2026-10-11): crs-undeclared-message-wording worker report 2, the owner's-index update applied (the worker run 00:26:54Z to 00:28:43Z by its transcript), on cut/crs-undeclared-message-wording, head d88636ef7a0c4035e9c9e9fc6fc962ff1218d60c, published; the update is state/consults/2026-10-11-crs-undeclared-message-wording-owners-index-update.md. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is e0e1e9f40393812e3c263b8806ece5175895d6bbd4a84c68480ca1ac24a095b9.*

---

Commit d88636ef7a0c4035e9c9e9fc6fc962ff1218d60c: "docs: crs-undeclared-message-wording owner's-index update (engine/README.md: T-1 pin, this form listed, Last verified at fb95bec0)". It is signed off and has the Co-Authored-By trailer.

Replacements, applied by one script that read the update's six `text` blocks, byte for byte, from the update file. Each old line was a whole line in `engine/README.md` and matched exactly once:
- §1.1: old line was line 510 (Typed refusals), count 1.
- §1.2: old line was line 519 (preregistrations in this module), count 1.
- §1.3: old line was line 499 (Last verified at), count 1.

Checks:
- `git diff --numstat fb95bec0 HEAD`: `3 3 engine/README.md`, nothing else.
- `node scripts/plan/verify-cites.mjs`: exit 0, run in the worktree at d88636ef.
- `node scripts/plan/verify-quotes.mjs`: exit 0, run in the worktree at d88636ef.
- `file engine/README.md` reports "Unicode text, UTF-8 text, with very long lines (1246)". It names no CRLF, and the script found no CR before editing. The file stays LF.
- `kernel/README.md` is untouched.

Final state of branch `cut/crs-undeclared-message-wording`:
- `git status --porcelain` is empty.
- HEAD is d88636ef7a0c4035e9c9e9fc6fc962ff1218d60c.
- It is published: the push went from fb95bec0 to d88636ef.
- No pull request was opened.
