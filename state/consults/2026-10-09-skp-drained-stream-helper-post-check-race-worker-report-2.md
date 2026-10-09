*Custodian's filing note (2026-10-09): `skp-drained-stream-helper-post-check-race`'s worker report 2, the worker run that applied lead-data's owner's-index update (`state/consults/2026-10-09-skp-drained-stream-helper-post-check-race-owners-index-update.md`) on the branch, 15:38:24Z to 15:40:24Z by its transcript, head 82a3c8cd0fb7fcc30f4aae49da82e6e981a10ade, published. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is b12ebe692c17360e485037ca2bfd9cdc7a8334764b50cf02f191d1557a24d88b. The custodian checked: the worktree is clean at that head and origin holds it; the diff from be7eecb3 touches the two READMEs only. The rest is the worker's.*

---

I applied lead-data's owner's-index update on the piece's branch and pushed it to origin. Nothing was built or tested; I ran no heavy command.

**Commit:** 82a3c8cd0fb7fcc30f4aae49da82e6e981a10ade, `docs: owner's-index update for skp-drained-stream-helper-post-check-race (kernel and engine READMEs, lead-data's update)`. It is signed off, with the Co-Authored-By trailer you specified.

**Numstat:**
- 2 added, 1 deleted: `engine/README.md`
- 2 added, 2 deleted: `kernel/README.md`

**Changes applied.** A script copied each block from the update file, and each old line matched exactly one line before replacement:
- `kernel/README.md` line 375: the preregistrations line now ends with `kernel/SKP-DRAINED-STREAM-HELPER-POST-CHECK-RACE-PREREGISTRATION.md`.
- `kernel/README.md` line 350: "Last verified at" changed from a06a746b to be7eecb3.
- `engine/README.md` line 519: the measurement-passes line is kept, and the new sub-bullet "engine halves of pieces filed elsewhere" (§2, Part B) is inserted after it as line 520.
- `engine/README.md` line 499: "Last verified at" changed from a06a746b to be7eecb3.

**Diff scope.** `git diff -U0` has four hunks, at kernel 350 and 375 and engine 499 and 519/520. The Owner's index section heading is at `kernel/README.md:346` and `engine/README.md:495`. The update puts the section ends at kernel 384 and engine 527, and I took those from the update, not from the files. All four hunks fall inside those ranges.

**Checks, run in the worktree:**
- `node scripts/plan/verify-cites.mjs` exit code: 0
- `node scripts/plan/verify-quotes.mjs` exit code: 0

**State.** `git status --porcelain` is empty. HEAD is 82a3c8cd0fb7fcc30f4aae49da82e6e981a10ade, and `origin/cut/skp-drained-stream-helper-post-check-race` holds the same id (pushed without force, no pull request opened, main untouched).

**Self-check.**
- **Cross-module code:** none touched.
- **Completion claims:** each one points to the numstat, diff hunks and exit codes above.
- **User-facing messages:** none added.
- **Required tests:** none required.

**Model:** I observed myself running as Sonnet 5.5, with no override and no context handoff.
