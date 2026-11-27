Reviewed: cut/hooks-readme-subagent-sentences at 17b0cf48bde716f611b78fe5d35b43d53b71e734 (the custodian's filing note, 2026-11-22: PR 352's single gate, the reviewer alone, attempt 1; Read 10, Bash 19, SubagentHandback 1, by unique call ids, two Bash calls errored (exit code 2 each, a listing of an output file before it was written), model claude-opus-5-5, from 2026-11-22T12:04:34Z to 2026-11-22T12:18:04Z by its transcript; no call named the main checkout; the report below byte for byte from its hand-back of 9737 bytes, sha256 5962ba95295305750d8819f777ca022323653f068712231b6069044da7da4c9f, nothing masked, with this note in its first line and one final newline), gate, reviewer
Verdict: PASS, PR #352 @ 17b0cf48bde716f611b78fe5d35b43d53b71e734

I reviewed branch `cut/hooks-readme-subagent-sentences` @ 17b0cf48bde716f611b78fe5d35b43d53b71e734 (`git rev-parse HEAD` rc=0, read at the start and again at the end). The base is 90bdeab78ea3dadd238d5dfe428e50b0df3840c6 and there is one commit in the range (`git log --oneline`, rc=0, `<S>/hr-log.txt`). Porcelain was empty at the start (`<S>/hr-status0.txt`, 0 bytes).

There are no Correctness, Evidence or Documentation findings.

## Correctness

**1. The Out-of-scope line, read first.** I read the form whole. Its line names no §21a category as touched. The line says "no hook, script, test, settings or permission change, and the hooks behave as merged in PR 349". That is true of the diff: the full diff (rc=0, `<S>/hr-diff.txt`) touches `scripts/hooks/README.md` only. Neither hook file, no test, no settings file and no workflow is in the range. Its "guarantee none" also holds, because the two sentences describe the code as it stands (check 5). No finding.

**2. The count and the files.**
- `git diff --numstat 90bdeab7...17b0cf48` rc=0 gave `5	1	scripts/hooks/README.md`. That is 6 changed lines, within the budget of 8 or fewer, and only the one file.
- `gh pr view 352 --json files,...` rc=0 listed the same file only, with additions 5, deletions 1, headRefOid 17b0cf48bde716f611b78fe5d35b43d53b71e734 and base main.
- No finding.

**3. The words**, compared by script (`<S>/hr-compare.mjs`, rc=0, output in `<S>/hr-compare.txt`).
- The script takes each sentence from the draft at the head: the text inside the backticks on draft lines 13 and 15, which are item 1 (a) and item 1 (b).
- It finds each one exactly once as a whole line of the README at the head: (a) at line 144, (b) at line 181. Neither file contains a CR.
- It then removes (b) and its blank line, and removes (a) with its line break. Rejoining the split line with a single space gives a file equal to the base README: `head minus sentences equals base: true`. The space between "`null`)." and "`custom_instructions` is" in the base became the line break, and nothing else changed.
- I hashed the lines separately (rc=0, `<S>/hr-sha.txt`):
  - line 144 = d67544b36f6b2a82b546e5a00941ed1d01fd9456e63257df3b5ec137edd8459d
  - line 181 = 14bcc3ebb24e64e22c1ba6bfa3c764e14f0c207c18b65973f62fbdbf30040060
  - the draft blob at the head = d2b64494ce52ca482afcb7b8f930333bf8f01d69846d0d74033aff3d641fe685, which is the value the custodian's `readme-sentences.mjs` requires.
- No finding.

**4. The placement.**
- Sentence (a) is in the PreCompact section's paragraph that opens "**The record.**" (README line 139). It sits on its own line directly after line 143, which now ends "`flushed_at` (the ledger block's value, else `null`).". Line 145 picks up at "`custom_instructions` is". This is a soft line break, so it is still one paragraph, as the Change line requires.
- Sentence (b) is a paragraph of its own at line 181. It comes after the resume-facts paragraph (lines 172–179) and before `## Notification` (line 183), so it is the last paragraph of the SessionStart section (lines 154–182), as the Placement paragraph requires.
- Each sentence is on one unwrapped line, and nothing comes from the draft's item 3.
- No finding.

**5. Each clause against the code at the head.** These are the human's words. Every clause is borne out by the code, so I propose no words.

Sentence (a), `precompact-flush.mjs`:
- "A call whose input carries agent_id … is allowed": the `if (input.agent_id)` branch at line 229 returns `{ decision: 'allow', … }` at line 246. `main` therefore exits 0 at line 325.
- "without a freshness judgment": the branch returns before either `checkFreshness` call (lines 250 and 276).
- "or the block record": `statePath`, `readJson` and `writeJson` (lines 262–263 and 282) are never reached.
- "decision allowed-subagent": line 235.
- "reason and flushed_at null": lines 236–237, written as literals. The ledger is not read.
- "a sixth field, agent_type (a string as received, else null)": line 238, `typeof input.agent_type === 'string' ? input.agent_type : null`. It is the sixth key after at, trigger, decision, reason and flushed_at (lines 233–238).
- I ran a probe against the head's module (`<S>/hr-probe.mjs`, rc=0, `<S>/hr-probe.txt`). It used an injected git that throws if called, and git was not called.
  - With `agent_type: 5` and trigger manual, the line was `{"at":…,"trigger":"manual","decision":"allowed-subagent","reason":null,"flushed_at":null,"agent_type":null}`.
  - With `agent_type: 'worker'` and no trigger, the line carried `"agent_type":"worker"`.
  - `block record exists: false`.
- The README's next sentence, that a line that cannot be written costs one stderr line and the decision stands, also holds for this branch: line 244 has the same message, and line 246 still returns allow.

Sentence (b), `session-resume.mjs`:
- "With agent_id in its input it prints nothing and exits 0": line 138, `if (input?.agent_id) process.exit(0);`, runs before any write to stdout (line 140) and before the stderr path (line 142).
- My probe ran the entry with `{"session_id":"q","source":"compact","agent_id":"a1"}` on stdin: rc=0, stdout 0 bytes, stderr 0 bytes (`<S>/hr-resume-out.txt`, `<S>/hr-resume-err.txt`).

## Evidence

**6. The checks in the checkout** (output in `<S>/hr-vc.txt`, `hr-vq.txt`, `hr-vtc.txt`, `hr-vp.txt` and `hr-test.txt`; the rc values are in the background task's output and in `<S>/hr-test-rc.txt`):

| Check | rc | Last line |
|---|---|---|
| `node scripts/plan/verify-cites.mjs` | 0 | `verify:cites PASS — every rooted (in-tree) path:line reference across 3569 file(s) resolves. (211 loose reference(s) advised above.)` |
| `node scripts/plan/verify-quotes.mjs` | 0 | `verify:quotes PASS — 159 checked, 128 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 937 ruling cites resolved, 0 ruling-cite errors.` |
| `node scripts/plan/verify-test-claims.mjs` | 0 | `verify:test-claims PASS — all 895 claimed test(s) across 283 file(s) exist or are planned, superseded or withdrawn (15 planned, 16 superseded, 17 withdrawn, advisory).` |
| `node scripts/plan/verify.mjs --offline` | 0 | `verify:plan PASS — C:\dev\wt\hooks-readme\governance\PLAN.yaml agrees with the repository.` |
| `node --test "scripts/hooks/*.test.mjs"` | 0 | `ℹ duration_ms 42332.6954` (tests 202, pass 202, fail 0) |

After the checks, `git status --porcelain` rc=0 gave 0 bytes (`<S>/hr-status1.txt`).

**7. CI, both reads.**
- At my start, `gh pr checks 352` returned rc=8 (`<S>/hr-checks-start.txt`). That code means checks were pending: both runs of `test · verify:plan · queue/site drift` (45020352748 and 45020268553) were pending. The two `cfg boundary`, `every commit is signed off`, `no profile path in the range` and both `ported-notices` checks had passed.
- Before this report, it returned rc=0 (`<S>/hr-checks-end.txt`). All 8 checks pass, including both `test · verify:plan · queue/site drift` runs (2m36s and 2m29s).

**8. The worker's report against its logs** (tails in `<S>/hr-workerlogs.txt` and counts in `<S>/hr-wtest.txt`, rc=0 each):
- README-OK: the report's line matches `hrd-run.log`. Both hashes in it equal my hashes of README lines 144 and 181.
- Numstat: the report's `5 1 scripts/hooks/README.md` matches my numstat and `hrd-commit.log` (`1 file changed, 5 insertions(+), 1 deletion(-)`).
- Exit codes: verify-cites, verify-quotes, verify-test-claims and verify:plan each match their log's last line.
- Tests: `hrd-test.log` shows tests 202, pass 202, fail 0.
- The worker says itself that it did not capture its test rc= line. The log carries no rc line, so its "exited 0" for the tests is supported only by `fail 0`. My own run gives rc=0 at the same head, which closes that gap.

## Documentation

None.

## Notes

These are recorded so they can go into the sentences' source comments if the advisor wants. None blocks.
- **Empty or null agent_id.** Both hooks test whether `agent_id` is truthy (line 229 and line 138), so an `agent_id` of `""` or `null` counts as absent. The harness sends a non-empty id, so ordinary use does not reach this.
- **Slow stdin in `session-resume.mjs`.** The stdin read gives up after 500 ms (line 126). If stdin were cut short there, the parse would fail, `input` would become `{}`, and the reading order would print even though `agent_id` was sent. This needs timing inside one hook round trip, so it does not block under the wording rule.
- **Test coverage.** `hooks.test.mjs:1634` asserts the decision, `agent_type: 'worker'` and `flushed_at: null`. It does not assert `reason: null`, the non-string `agent_type` → `null` fallback or empty stderr from session-resume. My probe covers these at the head. That is outside this docs-only piece.
- **Stale header comment.** `precompact-flush.mjs:13` still lists five record fields. Line 11 above it names the sixth for the subagent branch. That is outside this piece's Scope.
- **No hold taken.** No command was heavy. verify-quotes ran about 13 minutes wall-clock on 34 s of CPU (a process check, `<S>/hr-proc.txt`), and the test suite took 42 s.
- **Nothing left running.** Both backgrounded calls and the test run had completed before this report. My probe wrote only under `<S>/hr-probe-root`.

Files: `C:/dev/wt/hooks-readme/scripts/hooks/README.md`, `C:/dev/wt/hooks-readme/scripts/hooks/precompact-flush.mjs`, `C:/dev/wt/hooks-readme/scripts/hooks/session-resume.mjs`, `C:/dev/wt/hooks-readme/governance/forms/scripts/HOOKS-README-SUBAGENT-COMPACTION-SENTENCES-PREREGISTRATION.md`; my outputs are the `<S>/hr-*` files.
