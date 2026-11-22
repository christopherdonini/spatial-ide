# scripts: when a subagent compacts, the resume hook prints nothing and the pre-compaction hook allows it with one diagnostic line, the custodian's state left alone — five-line short form (`AUTONOMY.md` §21d)

Committed before any change, per the short-form discipline. The plan node subagent-compaction-hooks-quiet-for-subagents, placed by the advisor's ruling ADV-2026-11-22-01 item 4 under the human's delegation of 2026-11-13 (`state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-01-the-pieces-of-the-humans-message-placed-the-two-drafts-filed-on-main-before-their-ids.md`), on the human's message of 2026-11-22, item 2 (a) (`state/directives/2026-11-22-the-humans-message-the-idle-time-work-flaky-tests-are-findings-the-cancel-node-subagent-compaction-guardian-and-monitor-a-property-testing-trial.md`), which is the human's own approval of exactly this change to these two scripts and their tests. Its class is the five-line form and the reviewer alone, with the standard worker; it may merge before the v0.2 tag (item 4).

```
Authority: PLAN node subagent-compaction-hooks-quiet-for-subagents; the human's message of 2026-11-22, item 2 (a), the approval of this change to the two scripts and their tests and of nothing else; ADV-2026-11-22-01 items 4, 9 and 10; reuse index: no prior art recorded for subagent compaction hook (tools/reuse.mjs in the read-only reuse clone at 89bbac37, exit 1, run by the custodian on 2026-11-22).
Scope: 3 files: scripts/hooks/session-resume.mjs, scripts/hooks/precompact-flush.mjs and scripts/hooks/hooks.test.mjs; declared line budget <= 140 changed lines in the merged diff by §21c's counting, this form excluded. Block on sight: .claude/settings.json or any settings file, any other hook script, flush.mjs, cloud.mjs, cloud.test.mjs, the Guardian, any mod, a dependency, a lockfile. Anything beyond the two scripts and their tests goes to the human as a draft, not into this piece.
Change: when the hook input carries agent_id, (a) session-resume.mjs writes nothing to stdout and exits 0; (b) precompact-flush.mjs exits 0 without calling checkFreshness, without reading or writing the block state file (.claude/state/precompact-<session_id>.json), and appends exactly one line to the record log (.claude/state/precompact-<session_id>.jsonl) whose decision is allowed-subagent and which names the input's agent_type (null when absent), with no flushed_at read from the ledger. With no agent_id, both scripts behave exactly as before, byte for byte in their output, exit code and writes.
Tests+mutation: in hooks.test.mjs, tests that spawn the two real entry points (node on the script file, input on stdin, CLAUDE_PROJECT_DIR set to a temporary folder holding a state/CUT-STATE.md and an empty .claude/state, the cloud markers unset as cloud.test.mjs does): (1) session-resume with agent_id prints nothing and exits 0; (2) session-resume without it prints the reading order and the block as today; (3) precompact-flush with agent_id and trigger auto, and again with trigger manual over a stale block, exits 0, writes no .json and appends one allowed-subagent line naming the agent_type; (4) precompact-flush without agent_id over the same stale block and trigger manual still exits 2 and writes the .json, unchanged. Each new test is shown red before the script change for the intended reason and green after; the mutation removing each agent_id check turns (1) or (3) red, recorded in a comment above the test. Live unverified: no real subagent compaction has been seen; the piece says so until one is.
Out-of-scope: ADR: none. Security: none; no permission, settings, Guardian or mod change. Wire: none. Guarantee: none. No product code, no string the app shows; the parent session's freshness rule, block window and record fields are unchanged.
```

### §A. The rulings and facts (by reference)

The human's message of 2026-11-22, item 2 (a), is what may change and the approval of it; anything beyond those two scripts and their tests comes to the human as a draft. ADV-2026-11-22-01 item 4 places the class, the reviewer alone, and what the reviewer reads: the diff clause by clause against item 2 (a). The changelog of the Claude Code repository, CHANGELOG.md, under its heading 2.1.323, carries a fix by which the PreCompact, PostCompact and post-compaction SessionStart hooks receive agent_id and agent_type when a subagent compacts (the custodian's paraphrase, read on 2026-11-22; nothing here is a quotation). The running version, by `claude --version` on 2026-11-22, is 2.1.330.

Isolation (ADV-2026-11-22-01 item 9): the worktree is C:/dev/wt/subagent-compact on the branch cut/subagent-compaction-hooks, made from main at 662ea259eac2e5fd1f47e83cbee0eea3d17430b5; the piece has no build output, since its tests run under node's own test runner with nothing installed. The custodian's check at 2026-11-22T04:13:54Z read the main checkout's two target junctions to D:\spatial-ide\target and D:\spatial-ide\shell-target, found the worktree outside the main checkout and its target, src-tauri target and target/fixtures absent, and passed; the same check failed, as it must, on the main checkout itself and on D:\spatial-ide\target. The tests' temporary folders are under the system's temporary folder, never the main checkout or the sitting's fixtures.

### §B. What is not proven

That the installed harness hands these hooks agent_id when a subagent compacts. The tests feed the input the changelog names; a real subagent compaction is the only proof, and until one is seen the piece says live unverified.

### Amendments

*(Opens empty; append-only.)*

### Amendment 1 — 2026-11-22 — the gate: PASS WITH NOTES; D1, N1 and N4 closed by the reviewer's words; D2 here; D3 to the human as a draft

*Written by the custodian after the gate. The sentence of item 3 is the reviewer's words for its finding D2, applied as given and nothing else with them. References only otherwise.*

1. **The branch.** The worktree, made from 662ea259 (§A), was fast-forwarded to eb47ee33, the main commit that holds this form, before the worker started (the reviewer read the reflog: its report, Preflight). Its commits: T 4407e33f9e6803a96f60461674d3a72730f2742e, S f77c3fa9b0b553e62b192fe5424181b4e26db750, M 66fb4c2b51e540a5aec73529ee65d940959cd95d, and the correction C fdd1f545f0334fb6fbde9ede82a5da0cdd74219c. The merged diff by §21c's counting, three-dot from eb47ee33 at C: 92, 21 and 1 added lines and none removed over the three Scope files, 114 in all, within 140.

2. **The gate.** The reviewer read the branch at 66fb4c2b and ended PASS WITH NOTES; its report is at state/consults/gates/2026-11-22-subagent-compaction-hooks-gate-reviewer.md. Its D1 (the header comment of precompact-flush.mjs), N1 (the newline escape in the subagent branch's append) and N4 (the commit the two mutation comments name) are closed by C with the reviewer's words: C adds four lines and removes four, and the custodian's check by script found each added line equal to the report's words or, for N1, to the escape form the file's own appendRecord uses, and no other line changed. At C the file's 78 tests and CI's whole command of 615 tests pass (the correction worker's runs).

3. **D2, the Tests+mutation line's claim that each new test was shown red before the script change.** Tests (1) and (3) were shown red at 4407e33f for the intended reason and green at 66fb4c2b; tests (2) and (4) pin the parent behaviour and are green at both.

4. **D3, scripts/hooks/README.md.** Its record paragraph and its SessionStart section do not name the subagent branch. The README is outside this form's Scope, and the human's item 2 (a) sends anything beyond the two scripts and their tests to the human as a draft; the reviewer's words for it go to the advisor as that draft with the merge request. Nothing in this piece changes the README.

5. **The version, and live unverified.** The session's transcript records change from 2.1.314 to 2.1.330 at 2026-11-22T02:05:46.587Z, before the human's message (received 2026-11-22T02:58:16.223Z), and carry no later change; §A's reading and the reviewer's agree. No real subagent compaction has been seen: live unverified (§B).

6. **CI.** PR 349 at C: six runs, each success (Governance CI 44988716081 and 44988712665, Exposure scan 44988716083, DCO sign-off 44988716065, Ported notices 44988716140 and 44988712678), read at 2026-11-22T05:26:10Z.

7. **Next.** The pull request out of draft, then the merge request to the advisor, naming this amendment. The piece may merge before the v0.2 tag (ADV-2026-11-22-01 item 4).

Read the last amendment first.

Nothing above is edited.

### Amendment 2 — 2026-11-22 — merged; main green; the closing

*Written by the custodian after the merge. References only; nothing below is a quotation.*

1. **The merge.** The advisor merged PR 349 at fdd1f545 by merge commit 8a271655, at 2026-11-22T06:09:58Z by GitHub, so the branch commit that a test comment names stays reachable. The verdict, MERGE: state/consults/merge-checks/PR-349-fdd1f545f033.md. Main's CI at the merge commit: 4 runs, all success, read at 2026-11-22T06:16:59Z.

2. **Live unverified.** The two scripts act from the main checkout since its fast-forward to the merge commit. No subagent compaction has been seen, and none was forced. The change stays live unverified until one is seen and its record line read (the advisor's message with the verdict).

3. **The parent's guard.** If a compaction of the custodian's own session ever records the decision allowed-subagent, the parent's guard is off, and that is a stop to the advisor (ADV-2026-11-22-05 item 6; the verdict's closing paragraph). The custodian's compaction that ended at 06:11Z by its transcript ran its PreCompact hook at 06:02:45Z by its record line, before the merge and under the earlier script; that line carries recorded-only. The next compaction is the first under the merged script.

4. **Left as it is.** The hooks README waits for the human's approval of the draft ADV-2026-11-22-06; nothing is written to it before (Amendment 1 item 4). The reviewer's N2 and N3 are test gaps it does not ask to be closed, and N5 is named in the draft as left out (the verdict, item 3).

5. **The node** is done with this amendment, and its worktree is removed at this closing.

Read the last amendment first.

Nothing above is edited.
