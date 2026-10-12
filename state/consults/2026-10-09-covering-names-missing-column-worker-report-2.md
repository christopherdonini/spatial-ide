*Custodian's filing note (2026-10-09): `covering-names-missing-column`'s worker report 2, the worker run that applied lead-data's owner's-index update (`state/drafts/covering-names-missing-column-owners-index-update.md`) on `cut/covering-names-missing-column`, 11:45:31Z to 11:47:22Z by its transcript, head 9340c5f885d88dc8effc1275c53b79a309c661e3, pushed. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 8571bf6f6e7990165641dbb608baae8b2d2f4c3f87addc520379f216e358b7c9. The custodian checked: the worktree is clean at that head and origin holds it; `git diff --numstat a06a746b..9340c5f8` is 3 and 3 in each README and nothing else; the six hunks are at engine 499, 501 and 518 and kernel 350, 352 and 377. The rest is the worker's.*

---

All six replacements (1a, 1b, 1c, 2a, 2b, 2c) are applied, committed and pushed to origin. I ran no build or tests.

- **Commit:** 9340c5f885d88dc8effc1275c53b79a309c661e3, `9340c5f8 docs: owner's-index update for covering-names-missing-column (engine and kernel READMEs, lead-data's update)`. It is signed off and carries the Co-Authored-By trailer.
- **Method:** a script read the 12 fenced `text` blocks from lead-data's file. It required each old line to match exactly one whole line in its README, then replaced it with the new line byte for byte. Every old line matched exactly once, so there was no STOP.
- **Lines changed:**
  - `engine/README.md`: 499 (1a), 501 (1b), 518 (1c).
  - `kernel/README.md`: 350 (2a), 352 (2b), 377 (2c).
- **numstat:**
  - `3	3	engine/README.md`
  - `3	3	kernel/README.md`
  - Nothing else changed.
- **Section check:** `git diff -U0` shows six hunks, at lines 499, 501 and 518 in the engine README and 350, 352 and 377 in the kernel README. Per lead-data's file the sections span 495–527 and 346–384, and `grep` puts the headings at engine 495 and kernel 346. So no changed line is outside the two `## Owner's index` sections. I did not read the section end lines in the READMEs themselves.
- **Checks:** `node scripts/plan/verify-cites.mjs` exited 0. `node scripts/plan/verify-quotes.mjs` exited 0. I discarded their output and kept only the exit codes.
- **State:** `git status --porcelain` is empty. HEAD is 9340c5f885d88dc8effc1275c53b79a309c661e3, and `origin/cut/covering-names-missing-column` is at the same id (`a06a746b..9340c5f8` pushed, no force). I opened no pull request and did not touch main or lead-data's draft file.
