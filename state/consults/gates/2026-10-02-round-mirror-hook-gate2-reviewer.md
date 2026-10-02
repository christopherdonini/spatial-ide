*Custodian's filing note (2026-10-02): the reviewer's gate 2 on PR #154, for PLAN node `round-mirror-pretooluse-hook`, scoped to correction round 1, full gating. Reviewed: cut/round-mirror-hook @ 2e364d699659d851469ef34f72ab82f391cd3fd2 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b), transcribed from the hand-back message with the harness's two-space indent removed; the text below the rule is the agent's. Its branch-only `path:line` cites are read at 2e364d6. Verdict PASS with notes only. N-1 (where the non-object check sits relative to the silent cases) goes to the closing record. With the architect's gate 2, the PR is PASS/PASS at 2e364d6. It merges after #156, and §28's heading is fixed at the merge with main, under a scoped reviewer pass. Profile paths redacted at filing: none.*

---

VERDICT: PASS. Reviewed `cut/round-mirror-hook @ 2e364d699659d851469ef34f72ab82f391cd3fd2`. Diff `948f126..2e364d6` (commits fa674a7 and 2e364d6). The merge-base with origin/main is 01b5ba0.

Correction round 1 discharges S1-1 and S2-2. The non-object JSON change behaves as Amendment 2 item 3 says. I re-observed M1, M9, M10 and M11 at 2e364d6 and each first failure matches its comment. Amendment 2 meets the record-form rules I was asked to check. There are no S1 findings.

## S1 (blocking)
None.

## S2
None.

## N

**N-1. The amendment does not say where the non-object check sits relative to §2 item 4's silent cases.**
- §2 item 4 puts the silent cases "after parsing", and validation comes after them.
- Amendment 2 item 3 reclassifies non-object JSON as malformed input, but `questions-mirror.mjs:161-164` checks it before the `agent_id` and lease cases (`:165-167`).
- So stdin `[]` or `7` with no `session_id` prints the malformed line, while `{}` with no `session_id` stays silent under item 4(b).
- This is coherent if "parsing" is read as "parses to an object", and it is unreachable in practice because Claude Code sends an object.
- Suggestion: the closing record should state that reading in one sentence, so nobody later counts it as a "silent case prints" falsification (§5).

**N-2. Class 2 fits item 3 loosely.**
- Class 2 in `docs/PREREGISTRATION-TEMPLATE.md` covers a run whose outcome differs from a §3/§5 prediction.
- No §3/§5 prediction covered non-object JSON. Item 3 changes behaviour on a gate note that the architect's N2 said needed no amendment.
- Item 2 fits class 2 better, since §3 declares the fixture's envelope.
- The first line correctly declares the whole amendment post-result (class 1), so nothing is mis-recorded by name.
- It is not class 9: no standing rule adds work, and the line used is already one of §7's six.
- It is not class 8: see the §7 recount below.

**N-3. The three new T10 cases have no recorded mutation of their own.** The worker said so. They do not need one, because T10 keeps M10 and §8 item 7 is per test. I observed two probes; neither is recorded in the branch:
- **X1, the 948f126 routing restored:** T10 fails at `questions-mirror.test.mjs:289`, case `null`. It prints the not-JSON line where the malformed line is expected.
- **X2, the object check removed:** T10 fails at `:289`, case `null`, with `hook error (Cannot read properties of null (reading 'agent_id'))`.

**N-4. The cited reports are not on the branch yet.**
- Amendment 2 cites `state/consults/gates/…gate1-architect.md`, `…gate1-reviewer.md` and `state/consults/2026-10-02-round-mirror-hook-worker-report-2.md` by path only.
- None exists at 2e364d6. They are on main at 7b45af8, 4952b6f and a0f0da7, so they resolve once main is merged into the branch.
- verify-cites passes, and the exposure-scan form's Amendment 2 did the same.

**N-5. "References only" overstates slightly.** Items 2 to 4 describe the change in a sentence each. The record cap's no-prose rule binds the closing amendment, and these sentences restate no earlier amendment's claim.

## Item by item

**1. S1-1 is discharged.**
- **The envelope.** The fixture's top-level keys are now: `session_id`, `transcript_path`, `cwd`, `permission_mode` (`:5`, "default"), `hook_event_name`, `tool_name` (`:7`, "AskUserQuestion"), `tool_input`, `tool_use_id` (`:76`, "fixture-tool-use") and `prompt_id` (`:77`, "fixture-prompt"). All values are invented.
- **No secrets.** A grep for profile paths, tokens, chat ids and long digit runs returned rc 1, and `file` shows LF.
- **`tool_input` is unchanged.** The byte-copy's sha256 is fb91cef546225ded1d0ff102d335154cf91dc4041be93c7350f31e06140f21c2. `assert.deepStrictEqual(fixture.tool_input, copy)` passes, and the key order is equal.
- **T1 and T11 pass with the extra keys.** T1 sends the whole fixture (`questions-mirror.test.mjs:169`). T11 sends `JSON.stringify(fixture)` through the real settings command (`:315`) under Git Bash.
- **The hook still reads none of the new keys** (`questions-mirror.mjs:153-172`).

**2. S2-2 is discharged.** `scripts/hooks/README.md:228-229` now labels H4 a hypothesis. H1 to H3 were already labelled at `:226-228`, which meets §2 item 14.

**3. Valid non-object JSON.**
- `questions-mirror.mjs:157-160` keeps the not-JSON line for input that fails to parse.
- `:161-164` gives the malformed line for `null`, arrays and primitives, then returns before any read, write, send or outcome-line append.
- T10 (`questions-mirror.test.mjs:285-290`) covers `null`, `[]` and `7`. For each it asserts exit 0, empty stdout and the exact stderr line (so no dry-run send line appears), and afterwards that only `round-7.md` remains.

Re-observed at 2e364d6. Its code, tests and settings are identical to fa674a7's; `git diff fa674a7 2e364d6` touches only the form. Each mutation was applied, run by name, restored with `git checkout --` and re-run green:
- **M1:** T1 fails at `assert.equal(text, S1_BODY(date))`; the option lines lack their description tails. This matches `:166`.
- **M9:** T9 fails at `:265`, with the `hook error (Unexpected token 'o', …)` line where the not-JSON line is expected. This matches `:260`.
- **M10:** T10 fails at `:283` on the first case (`[]`), with a dry-run send of a 0-item round. This matches `:269`.
- **M11:** T11 fails at `assertQuiet` (`:319`) with status 1 against 0. This matches `:294`.
- This supports Amendment 2 item 5.

**4. Amendment 2** (`ROUND-MIRROR-PRETOOLUSE-HOOK-PREREGISTRATION.md:301-315`).
- **Append-only.** The form's diff is 16 insertions and 0 deletions, at the end of the file.
- **First line.** `:303` says post-result, as class 1 requires.
- **References.** It cites gate reports and the worker report by path, and commit fa674a7 by id.
- **No hash pins.** It contains no sha256 at all, so nothing is pinned at a branch commit.
- **No forbidden cites.** There is no line cite into `DECISIONS-PENDING.md`, no bare self-line and no verbatim quotation.
- **No discharge words.** No clause says "discharged" or "done". Item 4 resolves at `README.md:228-229` and item 5 at my re-observation above.
- **Classes.** These are acceptable; see N-2.
- **Superseded index "None": correct.**
  - No `RECORDED MUTATION` comment changed: the test file's diff only adds T10's three cases.
  - Amendment 1 is untouched, and §2 and §3 are not edited.
  - The 753dcaf observations still stand, and the fa674a7 re-observations confirm them.
  - Worker report 1's deviation 3 described behaviour that is now changed, but it is evidence, not a record row.

**5. Scope.**
- `948f126..2e364d6` touches five files: the README, the form, the fixture, `questions-mirror.mjs` and `questions-mirror.test.mjs`.
- AUTONOMY.md, and so §28's heading, is not touched, as the brief intends.
- Commit messages carry sign-off and trailers, with no profile path.

**6. §7 recount at 2e364d6.**
- This uses §7's own command over `01b5ba0...2e364d6`.
- Result: 7 files, 497 insertions, 3 deletions, 500 changed lines, against the ≤700 / ≤7 ceiling. There is no overrun and no class 8.
- The breakdown is: settings 12, AUTONOMY 11, README 25, fixture 78, hook 110/1, test 260/1, stop-queue 1/1.
- It matches the worker's figure at fa674a7.

## What I ran (exit codes captured directly)
- `git fetch -q origin` in the worktree: rc 0. HEAD is 2e364d6 on `cut/round-mirror-hook`, and the porcelain was empty before and after.
- **Full suite:** `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`, rc 0: 379 tests, 379 pass, 0 fail, 0 skipped, 0 cancelled.
  - My outer shell held real Telegram variables, which this run did not strip (I unset the wrong variable names).
  - No test reached the network. The hook tests build their environment explicitly; `cloud.test.mjs` inherits it but forces dry-run, and `hooks.test.mjs` deletes the credentials.
  - The mutation runs stripped the real variable names.
- **Mutation script** (scratchpad, M1, M9, M10, M11, X1, X2): rc 0. Every mutated run gave rc 1 and every restored run rc 0, and the tree ended clean.
- **verify-mutation** (tool 7d24ed1), `--base origin/main --head HEAD`: rc 0, "PASS — all 13 new test(s) have a recorded mutation naming them". This only checks that the comments exist; it is not an observation of any mutation. Item 3 is the observation.
- **verify-cites** (522e448): rc 0, PASS, 1067 files, 32 loose advisories.
- **verify-quotes** (f9444a4): rc 0, PASS, 113 checked.
- **verify-test-claims** (57c626f): rc 0, PASS, 463 claims.
- **verify.mjs / verify:plan** (2607202): rc 0, PASS.
- **`gh pr checks 154`:** rc 0, 4 of 4 pass, all at head 2e364d6 according to `gh run view`:
  - DCO sign-off (pull_request), run 37005273976;
  - the exposure scan (pull_request), run 37005273948;
  - Governance CI on push, run 37005270066;
  - Governance CI on pull_request, run 37005273916.
- The PR is OPEN, with mergeable state UNKNOWN.
- **Clean-up:** no `round-mirror-hook-*` temp directory remains and no background process is left. The hook ran only through the tests, in `os.tmpdir()` projects. I did not touch `C:/dev/spatial-ide`'s working tree.

Paths:
- `C:/dev/wt/round-mirror-hook/scripts/hooks/questions-mirror.mjs`
- `C:/dev/wt/round-mirror-hook/scripts/hooks/questions-mirror.test.mjs`
- `C:/dev/wt/round-mirror-hook/scripts/hooks/fixtures/pretooluse-askuserquestion.json`
- `C:/dev/wt/round-mirror-hook/scripts/hooks/README.md`
- `C:/dev/wt/round-mirror-hook/scripts/hooks/ROUND-MIRROR-PRETOOLUSE-HOOK-PREREGISTRATION.md`
