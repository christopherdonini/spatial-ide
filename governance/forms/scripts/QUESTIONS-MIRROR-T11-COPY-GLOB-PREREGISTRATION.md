# T11 copies every top-level script it may import, not a fixed list — five-line preregistration (`AUTONOMY.md` §21d)

*Committed before any code. Found by `stop-hook-stale-continuity`'s invalidator I1 (`state/consults/2026-10-02-stop-hook-stale-continuity-worker-report-1.md`). Routed by that form's architect (`state/consults/gates/2026-10-02-stop-hook-stale-continuity-i1-architect-ruling.md`). Placed by question round 36 (RULED 2026-10-02), item 1. A single combined reviewer gate (§21b) applies, because none of §21a's four categories is touched.*

```
Authority: PLAN node questions-mirror-t11-copy-glob; question round 36 (RULED 2026-10-02), item 1; the architect's I1 ruling for stop-hook-stale-continuity (state/consults/gates/2026-10-02-stop-hook-stale-continuity-i1-architect-ruling.md)
Scope: scripts/hooks/questions-mirror.test.mjs only -- the copy of scripts into the test project made by T11 (the_settings_command_mirrors_a_recorded_askuserquestion_payload); 1 file; <= 10 changed lines, this form excluded
Change: T11 copies every top-level .mjs file of scripts/hooks/ and scripts/plan/ (not recursive, so no fixtures) into its test project instead of its fixed six-file list; T11's name, its assertions and its recorded M11 are unchanged
Tests+mutation: T11 itself -- mutation: scripts/plan/ dropped from the copy, so T11 fails by name at its quiet-run assertion (exit 1), since stop-queue.mjs imports plan.mjs; observed, reverted and recorded in a RECORDED MUTATION comment with its commit; seam proof (an observation, not a committed test): the changed T11 passes with scripts/hooks/stop-queue.mjs as on main and as at stop-hook-stale-continuity's 8c96695 (which imports precompact-flush.mjs), each checked out into the working tree and then restored
Out-of-scope: ADR none; security none; wire none; guarantee none -- §21a's four categories untouched, so the single reviewer gate applies (round 25 item 2 (e)); no product, workflow or record-rule change; the hook scripts and the settings command unchanged
```

Amendment: class 1, the closing record. It was written after the results and the merge, and holds references only.
- **The merge.** PR #159 merged on 2026-10-02 at 19:56:51Z as merge commit ec74652, at head 0aac516.
- **The mutation** (`scripts/plan/` dropped from the copy). The worker observed it on a660a93 with this change (`state/consults/2026-10-02-questions-mirror-t11-copy-glob-worker-report-1.md`). The gate-1 reviewer reproduced it at 0aac516 (`state/consults/gates/2026-10-02-questions-mirror-t11-copy-glob-gate1-reviewer.md`, item 3).
- **The seam proof.** The changed T11 is green against main's stop-queue.mjs and against stop-hook-stale-continuity's 8c96695. The old list fails against 8c96695. The worker and that reviewer report both observed this.
- **The node it unblocks.** stop-hook-stale-continuity's I1 is cleared on main.
- **P-034** was not used. Question round 36, item 1 placed this node.
