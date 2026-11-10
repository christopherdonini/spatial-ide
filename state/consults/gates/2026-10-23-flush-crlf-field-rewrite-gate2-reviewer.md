Reviewed: PR #248 at 9beca99e3c99862d86684fee2c6bd18cce89e92c, gate 2 (scoped), reviewer
cut/flush-crlf-field-rewrite @ 9beca99e3c99862d86684fee2c6bd18cce89e92c
Verdict: PASS WITH NOTES

Correction round 1 does what Amendment 3 items 2 and 3 set. The C1 words are the architect's words, byte for byte. The five E1 lines are fix (i), placed where the architect said. Both suites pass at the head, the new assertions fail when they should, the tab case is now stated truthfully, §7 holds and CI is green at the head. One Documentation finding: the PR body is stale.

## Correctness
None.

## Evidence
None.

## Documentation (must fix before the merge; no re-gate)

**D1. The PR body is still written for 197d81ea and does not list the C1 words.**
- Amendment 3 item 2 says "the PR body lists it", and §31 says the same for words that are not the human's. The body read by `gh pr view 248 --json body` (rc 0) has none of the following:
  - the new contract words;
  - the correction commit;
  - the E1 assertion.
- Its **H** line names 197d81ea607027f26511d9df39f44aea8d726fb5.
- Its Scope line reads "5 lines in `scripts/hooks/flush.mjs` and 41 in `scripts/hooks/flush.test.mjs`, 46 in all". The counts at the head are 5, 46 and 51.
- Its Form line names Amendments 1 and 2 only.
- **Fix:**
  - Set H to 9beca99e3c99862d86684fee2c6bd18cce89e92c.
  - Add the commit line for 9beca99e.
  - Change the Scope line to 5, 46 and 51 in all.
  - Name Amendment 3 in the Form line.
  - List the replacement for `scripts/hooks/flush.mjs:23-24` (the architect's C1 words, not the human's, applied with no re-gate).
  - Name the E1 seam assertion in T2. It is a seam proof, not a mutation kill.

## What I checked, with evidence

**1. The correction diff, whole.**
- `git diff 197d81ea…9beca99e` rc 0. One commit, 9beca99e, whose parent is 197d81ea (`git log` rc 0).
- numstat rc 0: `flush.mjs` 2 added, 2 removed; `flush.test.mjs` 5 added, 0 removed. No other file.
- Comparison script `fcrlf-g2r-cmp.mjs`, rc 0, 0 fails:
  - `flush.mjs:23-24` at the head equal the fenced replacement in the architect's gate 1 report, its lines 17-18 at main 384de54b, byte for byte.
  - Only lines 23 and 24 of `flush.mjs` differ from the parent (296 lines either side), and the file has no CR.
  - E1 fix (i), each line where the architect placed it:
    - the import is head line 10, right after the parent's line 9;
    - `const parsed = {};` is line 321, right after `const printed = {};`;
    - `parsed[name] = parseSessionContinuity(written);` is line 331, right after `const written`;
    - the two assertions are lines 341-342, right after `assert.equal(printed.crlf, printed.lf);` and before `});`.
  - The head test file with those five lines removed equals the parent's file byte for byte, so no existing assertion was edited (§8 item 1).
- The seam was read on the consuming side, at the head:
  - `parseSessionContinuity` (`scripts/hooks/precompact-flush.mjs:61-79`) returns `{ flushedAt, tip, block }` and splits on `\r\n|\r|\n`.
  - Importing the module runs nothing, because its `main` is guarded at `precompact-flush.mjs:307`.
  - So `deepEqual` compares all three fields, and the `tip` assertion stops a pair of `null` results from passing trivially.
- Clause check of the new words at the head:
  - "written as `<label>: <value>`": `flush.mjs:187` writes `${key}: ${updates[key]}`. True.
  - "keeps the line ending of the line it replaces": `:187` adds a CR exactly when `lines[at].endsWith('\r')`, and the LF comes back through the `:162` split and the `:189` join. True.
  - "every other line is left byte for byte": `:185-188` assigns only `lines[lineForKey[key]]`. True.

**2. The new lines run** (throwaway `C:/dev/wt/fcrlf-g2r`, detached at the head, `worktree add` rc 0).
- `node --test scripts/hooks/flush.test.mjs` rc 0: 20 tests, 20 pass, 0 fail. T1 and T2 pass under their §4 names.
- `node --test scripts/plan/rotate-cut-state.test.mjs` rc 0: 9 tests, 9 pass, 0 fail.
- Both ran with `CUSTODIAN_TELEGRAM_DRY_RUN=1`, and the token and chat-id variables were unset.
- Liveness: I applied each edit by a script that requires exactly one occurrence, ran the suite, reverted with `git checkout`, and found the porcelain at 0 bytes after each revert.
  - The expected tip changed to `'feed1235'`: rc 1, 19 pass, 1 fail. T2 fails at `assert.equal(parsed.lf.tip, …)`, with actual `'feed1234'`.
  - `parsed.crlf.tip` forced to `'x'`: rc 1, 19 pass, 1 fail. T2 fails at `assert.deepEqual(parsed.crlf, parsed.lf)`.
  - So the new assertions execute and are not vacuous.
- Probe 4 again at the head (`fcrlf-g2r-probe4.mjs`):
  - Disclosure: the first run exited 1 because of a defect in my probe. The Bash tool collapsed `\\s` in the probe's targeted-line regex, so the targeted set held -1 and three targeted lines counted as "untargeted, differing". That run is not counted. I replaced those regexes with literals and checked by script that every other escape in the probe survived.
  - Rerun rc 0, 0 fails. Source: the head's ledger (263 elements, no CR), with a tab after `position:`. The CLI ran with `--file` and the `flushed_at`, `tip` and `position` fields.
  - LF copy:
    - the CLI exits 0;
    - the line is written as `position: probe position value`, so the tab is gone;
    - 0 of 260 untargeted lines differ;
    - lines 2, 3 and 5 keep LF.
  - CRLF copy:
    - the CLI exits 0;
    - the line is written as `position: probe position value` plus CR;
    - 0 of 260 untargeted lines differ;
    - lines 2, 3 and 5 keep CRLF;
    - no LF lacks a CR before it (262 CR, 262 LF).
  - The new words state this case truthfully: a rewritten line is written as `<label>: <value>`, which says the separator is normalized to one space, and every other line is left byte for byte.

**3. §7.** `git diff --numstat 1f669f21…9beca99e` (three dots) rc 0:
- `flush.mjs` 4 added, 1 removed, so 5;
- `flush.test.mjs` 46 added, 0 removed, so 46;
- 51 in all, against the ceilings 8, 60 and 68. This matches Amendment 3 item 3's prediction.
- The merge base of the head and main 384de54b is B (rc 0).
- Main has not changed `flush.mjs`, `flush.test.mjs`, `precompact-flush.mjs` or `session-resume.mjs` since B (`git diff --stat` rc 0, 0 bytes).

**4. CI.**
- `gh pr checks 248` rc 0: 8 of 8 pass.
- The PR's head is 9beca99e3c99862d86684fee2c6bd18cce89e92c, and it is a draft and open (`gh pr view` rc 0).
- `gh run view`, rc 0 each, head sha 9beca99e3c99862d86684fee2c6bd18cce89e92c and success for all:
  - 40002671380 and 40002677085: Governance CI, push and pull_request;
  - 40002677134: DCO;
  - 40002677188: Exposure scan;
  - 40002671355 and 40002677099: Ported notices, push and pull_request.

**Not run (outside this scope):** the three-glob scripts suite, verify-cites, verify-quotes, verify-test-claims and verify:plan locally. Branch CI's Governance job ran green at the head.

**End state.**
- `C:/dev/wt/fcrlf`: porcelain 0 bytes, HEAD 9beca99e3c99862d86684fee2c6bd18cce89e92c.
- The throwaway's porcelain was 0 bytes before `git worktree remove C:/dev/wt/fcrlf-g2r` (rc 0). `git worktree list` has 0 lines naming fcrlf-g2r, and the folder no longer exists.
- No commit, push or PR action, and no hold was needed: every run was light, the longest about 19 s.
- Scratch files are only `fcrlf-g2r-*` in my scratch folder.
