# Worker report 1 — questions-mirror-t11-copy-glob (2026-10-02)

*Custodian's filing note: the worker's hand-back on the brief for PLAN node `questions-mirror-t11-copy-glob` (five-line form `scripts/hooks/QUESTIONS-MIRROR-T11-COPY-GLOB-PREREGISTRATION.md`, committed a660a93), recorded verbatim below with the harness's report indentation removed. No rooted `path:line` cite needed de-rooting; nothing in the text is changed.*

*The custodian's checks:*
- *branch `cut/questions-mirror-t11-copy-glob` at 0aac516, read from origin, one commit on a660a93;*
- *the diff is the one Scope file, 4 insertions and 3 deletions;*
- *the seam proof's 8c96695 is stop-hook-stale-continuity's local implementation commit (unpushed), read through the shared object store.*

*Profile paths redacted at filing: none.*

---

T11 now copies every top-level `.mjs` of `scripts/hooks/` and `scripts/plan/` into its temp project. Commit 0aac516 is pushed to `cut/questions-mirror-t11-copy-glob`, signed off, and the tree is clean.

**Commit and budget:** numstat `4 3 scripts/hooks/questions-mirror.test.mjs` (`git diff --numstat origin/main...HEAD`), within the 10-line budget. The new comment line is included in the 4.

**Mutation:** applied as dropping `scripts/plan/` from the copy, run, then reverted. It was observed on a660a93 with this change, applied to the uncommitted edit. T11 fails by name at its quiet-run assertion: `assertQuiet` reports status 1 where 0 is expected. Suite result with the mutation: pass 16, fail 1. It is recorded in one comment line above T11, tagged M14, naming T11 and the same commit. `verify-mutation` against the committed change is a separate check below, not part of this observation.

**Seam proof** (nothing committed; each restored with `git checkout -- scripts/hooks/stop-queue.mjs`):
1. With 8c96695's `stop-queue.mjs` and the new T11: pass 17, fail 0.
2. After restoring main's `stop-queue.mjs`: pass 17, fail 0.
3. a660a93's old test file, copied temporarily into `scripts/hooks/` and deleted afterwards, with 8c96695's `stop-queue.mjs`: T11 fails (pass 16, fail 1). That reproduces I1.

**Check exit codes:**
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`: rc 0, tests 389, pass 389, fail 0.
- `verify-cites`, `verify-quotes`, `verify-test-claims`: rc 0 each.
- `profile-path-scan --staged`: rc 0, clean.
- `verify-mutation --base origin/main --head HEAD`: rc 0, "PASS — all 0 new test(s)". This tool only checks that a mutation is recorded and runs none. It was run after the commit because it needs a committed HEAD.

**Self-check:**
- **Interface:** the only cross-module seam here is `stop-queue.mjs`'s imports, which I read, and the seam proof exercises it.
- **Evidence:** each completion claim above comes from a run in this session.
- **Messages:** no user-facing text changed.
- **Assertions:** the mutation reaches `assertQuiet` at T11's line 319 (before the commit's one-line shift), not just the setup.

**Deviations:** none. M14 is also a mutation id in the stop-hook-stale-continuity form's table. That is a different file and form, so I treated the numbering as per-form and did not touch it.

**Model:** claude-sonnet-5-5, no override, no context handoff.
