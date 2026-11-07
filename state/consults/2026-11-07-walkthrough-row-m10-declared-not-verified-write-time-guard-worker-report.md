*Custodian's filing note (2026-11-07): the worker's report for `walkthrough-row-m10-declared-not-verified-write-time-guard`, the docs lane, built at 2abc75cc on `cut/walkthrough-row-m10-declared-not-verified-write-time-guard` under its full form (`governance/forms/frontends/WALKTHROUGH-ROW-M10-DECLARED-NOT-VERIFIED-WRITE-TIME-GUARD-PREREGISTRATION.md`). Dispatched at 2026-11-07T11:10:28.430Z by its transcript from a brief of 8980 bytes (sha256 27e5561f266645a55dc9b1db4c2f430f35205bfa053329cdecc575b443881587); the run to its hand-back at 2026-11-07T11:22:08.332Z (claude-sonnet-5-5; unique calls Read 6, Bash 33, Edit 2, Write 2, Monitor 1 and the hand-back, 45). This report is the hand-back, saved from it with one final newline (sha256 7e5c1e4a4f5a23bf85f6875095a21173bb2f681b6832fd8f23cbf8ac6b54ae1f); nothing is changed.

The custodian re-read, after a fetch: the branch at 2abc75cc503ed4af163e1706c050fe9a8040513f; `git diff --numstat origin/main...` 1/1 in `frontends/shell/MANUAL-WALKTHROUGH.md`; the commit's one Co-Authored-By trailer is Claude Sonnet 5.5; line 884 at the head holds section 2.1's new span byte for byte, by script.

Against the brief:
- The brief's command for the scripts suite, `node --test scripts/plan scripts/hooks scripts/evidence`, was the custodian's error: Node takes the directories as test files, and it exits 1 with no test run. The worker ran the governance CI's own invocation instead (it read the workflow's lines 149 to 156) and disclosed it.
- The push ran in the same call as the evidence script, not in a call of its own.
- One `sleep 150` was refused by the harness, and one Monitor call failed (no such tool).
- Every wait loop it wrote carried a counter. At 2026-11-07T11:22:46Z the custodian found no process whose command line names the suite or the worktree.

PR #293 was opened by the custodian as a draft at 2026-11-07T11:23:24Z. Model output, not Authority.*

---

Built: walkthrough-row-m10-declared-not-verified-write-time-guard at 2abc75cc503ed4af163e1706c050fe9a8040513f

- Start: C:/dev/wt/m10 HEAD was 0bd292637de7a4b628db92bf70df8b6e02c4d7c3 (= B), porcelain empty.
- Whose words (`git log -L` over line 884 at B): five commits touched the line, and only one changed the old span.
  - f8e2d43ab136bf3407587fd9a0333dd2336d3b92, "feat(publish): cancellable, progress-reported pin phase; ADR-025 checks run before it". Trailer: Co-Authored-By: Claude Fable 5.1. It introduced the whole old span (`git log -S` on the full span returns only this commit).
  - 13df4cb5 (Claude Sonnet 5.5 trailer) rewrote the line but kept the span. 3275a1d4, 090f35c4 and d09e292f (Claude Fable 5.1 trailers) predate the span.
  - No commit without a Claude trailer wrote it, so no stop.
- Clause check at B (all borne out, none stopped):
  - ceilings.rs:172-177 (verified_rows `None` gives `None`), :187-201 (check_streamed_features, `saw > max_features`, returns CeilingExceeded).
  - mod.rs:410-421 (the kernel says the same), :570-578, :826-846 (guard before `write_partition`, with `rows_total` increased after it), :1542 and :1703 (destination only by `finalize`), :1495-1498.
  - error.rs:298-299, :312-314; skp.rs:1726-1736; identity.rs:176-183.
  - shell publish.rs:411-415, :455 and :468.
  - `skip_uniqueness_check = true` appears only under engine/tests and kernel/tests.
- Commit 2abc75cc503ed4af163e1706c050fe9a8040513f, "docs: walkthrough-row-m10-declared-not-verified-write-time-guard: M10's residual span states the write-time MAX_FEATURES refusal". Signed off with `-s`; the only `@` in the message file was the first trailer line.
- Line 884 at head, the changed sentence, byte-copied: "The named residual, stated rather than exercised here**: a dataset admitted `DeclaredNotVerified` (skip-uniqueness-check route) has no predictable feature count either way — its pin still runs and the attempt can still reach the approval dialog; over the ceiling it is refused only once the publish runs, by the write-time `MAX_FEATURES` check (`ceilings::check_streamed_features`, in the partition loop), as `publish.ceiling_exceeded` and not `publish.reader_ceiling_exceeded`, before the partition that would cross the ceiling is written, with nothing left at the destination (no product route opens a dataset `DeclaredNotVerified` — the wire carries no skip-uniqueness field — so ordinary use does not reach this);"
  - The new span equals section 2.1's byte for byte. Both spans were extracted by script from the form, and the line check passed.
- Evidence script (the one named below), run at head against B three-dot, rc=0; every line printed OK:
  - one hunk `@@ -884 +884 @@`;
  - line count 2006 = 2006;
  - line 884 at head equals line 884 at B with the old span replaced by the new, and the reverse replacement also reproduces B;
  - 0 other differing lines;
  - `check_streamed_features` and `publish.ceiling_exceeded` count 1 each at head and 0 each at B;
  - absence pattern `only the bundled viewer's own load-time check` counts 0 at head;
  - positive self-test: the pattern counts 1 at B;
  - name-only lists only frontends/shell/MANUAL-WALKTHROUGH.md;
  - the `Result log` heading sits at line 987, after the edit.
- CI on head 2abc75cc, both success: "Ported notices" 42367209564 and "Product CI — shell" 42367209645. These were the only two runs.
- Size: `git diff --numstat B...HEAD` gives 1 1 frontends/shell/MANUAL-WALKTHROUGH.md. That is 2 lines in 1 file, against the ceiling of 10 lines in 1 file. No overrun.
- Checks at head:
  - verify.mjs --offline rc=0, "verify:plan PASS — ... agrees with the repository."
  - verify-cites rc=0, "PASS — every rooted (in-tree) path:line reference across 2723 file(s) resolves. (168 loose reference(s) advised above.)"
  - verify-quotes rc=0, "PASS — 138 checked, 107 verified, 30 baselined, ... 0 ruling-cite errors."
  - verify-test-claims rc=0, "PASS — all 744 claimed test(s) across 240 file(s) exist or are planned, superseded or withdrawn ..."
  - Scripts suite, in a shared hold:
    - The brief's command `node --test scripts/plan scripts/hooks scripts/evidence` exited 1 on this Node: it takes the directories as test files and fails each in under 100 ms, with no test run.
    - I ran CI's own invocation instead (.github/workflows/governance-ci.yml:150, glob form `"scripts/plan/*.test.mjs" ...`): rc=0, tests 598, pass 598, fail 0.
- Stop rules: none met.
- Disclosure: the scratch evidence script is a single script run both before and after the commit. Its post-commit run is the one reported.
- Final state: origin's branch equals HEAD (2abc75cc503ed4af163e1706c050fe9a8040513f) and the porcelain is empty. No PR action taken.
- Background shells: none left running; all had exited.
- Model: Sonnet 5.5 (claude-sonnet-5-5), no override. No context handoff received or produced.
- Four failure classes:
  - Interfaces read at their real code, cited above.
  - Every completion claim has a transcript call behind it.
  - No user-facing message was added; this is an operator doc row, and the Display text in the row is unchanged.
  - The evidence script asserts the content, not only the setup.
- Caller grep: not applicable, because no code was added.

Scratch (all under the scratchpad folder): m10-evidence.mjs, m10-ev1.txt, m10-who.txt, m10-msg.txt, m10-nodetest2.txt.
