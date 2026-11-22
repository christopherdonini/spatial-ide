*Filed by the custodian: the subagent compaction hooks (PR 349), the hand-back of the worker (claude-sonnet-5-5), 3872 bytes, sha256 594350d675b2029f6dcdecf213829b5902f60dde724adbc569281a2fd20dca7c, below the rule, nothing masked by the custodian. Its calls in the transcript, by unique call ids: Read 1, Bash 11, Write 3, SubagentHandback 1; none errored, from 2026-11-22T04:33:19Z to 2026-11-22T04:38:09Z. Read by the custodian: cut/subagent-compaction-hooks at 66fb4c2b51e540a5aec73529ee65d940959cd95d, the head and the remote branch equal, the porcelain empty; the numstat against eb47ee33 is 92, 21 and 1 inserted lines over the three Scope files; the red run of T, the two mutations and the runs at S are in its Bash results as reported.*

---

Built: the subagent compaction hooks at 66fb4c2b
Result: both hooks now treat a hook input with agent_id as a subagent compaction, and every test and gate named in the brief passed.

Start state: HEAD was eb47ee33 and `git status --porcelain` was empty, as the brief required.
Commits:
- T 4407e33f `test: hooks: a subagent's compaction leaves the custodian state alone (failing first)`
- S f77c3fa9 `fix: hooks: a subagent's compaction is allowed with one diagnostic line, and its resume prints nothing`
- M 66fb4c2b `test: hooks: the recorded mutations of the two agent_id checks`
- Push: new branch `cut/subagent-compaction-hooks` on origin, upstream set.

T's run (`node --test scripts/hooks/hooks.test.mjs`): 78 tests, 76 pass, 2 fail, and both failures were the intended ones.
- (1) session-resume with agent_id: FAIL. stdout was the whole reading order plus the block, where '' was expected.
- (2) session-resume without agent_id: pass.
- (3) precompact-flush with agent_id: FAIL at "auto: the decision", actual 'recorded-only', expected 'allowed-subagent'.
- (4) precompact-flush without agent_id, stale block, trigger manual: pass (exit 2, .json written, decision 'blocked').
- One fix inside the tests: my helper `recordLines` clashed with an existing function of that name, so I renamed it `subagentRecordLines` before the run above.

S's runs:
- The file: 78 of 78 pass, exit 0.
- The whole CI command (`node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`): 615 of 615 pass, exit 0.

Mutations (neither committed):
- m1: I deleted the agent_id check in session-resume.mjs. Test (1) failed, because stdout was the reading order instead of ''. I restored it with `git checkout -- <file>`, and `git status --porcelain` was empty.
- m2: I disabled the agent_id branch in precompact-flush.mjs by changing its condition to `if (false)`. Test (3) failed with "auto: the decision", 'recorded-only' for 'allowed-subagent'. I restored it the same way, with empty porcelain.
- M adds one RECORDED MUTATION comment line above each of tests (1) and (3). The file then passed again, rc=0. I did not read the totals of that run.

Numstat against eb47ee33: hooks.test.mjs 92/0, precompact-flush.mjs 21/0, session-resume.mjs 1/0. The total is 114 changed lines, under the 140 budget, over exactly the three Scope files.

Changed functions:
- `decidePrecompact` in precompact-flush.mjs: the agent_id check is the first statement after `sessionId`. It appends one line with the fields at, trigger, decision 'allowed-subagent', reason null, flushed_at null and agent_type (null when absent), then returns allow. It never reaches checkFreshness, the block state file or readFlushedAt.
- `main` in session-resume.mjs: one line, `if (input?.agent_id) process.exit(0)`, before any stdout write.
- hooks.test.mjs: new helpers `subagentEnv`, `subagentProject`, `runEntry` and `subagentRecordLines`, plus the four tests, appended at the end of the file.

Pre-gate self-check:
- Cross-module interface: the tests spawn the real script files with `spawnSync` on stdin input, using the `CLAUDE_PROJECT_DIR` and cloud-marker environment shape from cloud.test.mjs. No imagined interface.
- Completion claims: each rests on a run file in the scratchpad, `sch-t-run.txt`, `sch-s-run.txt`, `sch-s-ci.txt`, `sch-m1.txt`, `sch-m2.txt` and `sch-m-run.txt`.
- User-facing messages: the new stderr line describes only what the code does.
- Assertions: each test reaches its intended assertion, as the red messages above show.

Live unverified: no real subagent compaction has been seen, so the harness handing these hooks agent_id is untested.
Off-scope: I changed nothing outside the three files.
Final state: `git status --porcelain` is empty, and no background process is running.
Model: Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff.
