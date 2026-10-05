# PR #177 gate 1 — reviewer
Reviewed: cut/evidence-recorder-v0-1 @ 05fc645d64c6c59b1f682f04f585e72243f8a272

**Verdict: FAIL** (one S1: the preregistered T24 test name does not exist at the gated head, and nothing records the change). The code and the tests are otherwise sound. Every recorded mutation reproduces exactly, the ruled conditions hold, and §7 is inside its bound.

Base: c2d62c37b4ec79f3eca7f8b794b9b85c04bf00fb (merge base with origin/main 9c40d22f53271a4dfce29a7e71d84ac4293f9b77). Diff: `git diff origin/main...HEAD`, six files. Worktree C:/dev/wt/rec01, left clean at 05fc645d (porcelain empty after every mutation). Builds: node v24.18.1; claude 2.1.289 (Claude Code); git 2.49.0.windows.1. Tools: `scripts/plan` at 05fc645d is byte-identical to c2d62c37 and to origin/main 9c40d22f (last change 859375c9); every verify-* claim below is about the tool at that tree.

## S1

**S1-1. T24 is built under a name the form does not declare. The deviation is unrecorded.**
- Declared name, `tools/mods/EVIDENCE-RECORDER-V0-1-PREREGISTRATION.md:262 @ 9c40d22f5327 sha256:c16a2e8ffdd7062ee3437a6ce9874a7409d5557d3d81b9fdcd0c2742d5b3f859`: `reaching the wait ceiling before a command gives unavailable before-fields and runs the command at once`.
- Amendment 2, A2-1 (`tools/mods/EVIDENCE-RECORDER-V0-1-PREREGISTRATION.md:498 @ 9c40d22f5327 sha256:5081d7f4317e3ad4be287670cd58200d29966784869910a2db5b6c3fdad659d6`) says T24's "name and mutation are unchanged".
- Built name, `tools/mods/spatial-evidence-recorder/test/recorder.test.ts:723` at branch commit 05fc645d64c6c59b1f682f04f585e72243f8a272 (and the same text at ba42e6f76117): `reaching the wait ceiling before a command gives unavailable fields and runs the command at once`.
- A fixed-string search of both test files for the declared name finds 0. The other ten declared names (R1 to R4, T21 to T23, T25, T26, T28) each find 1.
- None of these records the rename:
  - worker report 1's D1 to D11 (D7 claims a name only for T27, because "the form names none");
  - Amendment 4;
  - the PR body.
- The worker report and the PR body say "T1 to T28 pass" and "T21 to T28". Read through the form's §4, the T24 in those statements resolves to a test that does not exist.
- verify-test-claims PASS does not catch this. Its scan does not resolve this table's names, so it is a floor.
- **Remedy, either one:**
  - (a) A class 2 row in a §10 amendment that names the built test text at branch commit ba42e6f76117. Per round 25, item 2 (d), name the commit id and give no hash pin at a branch commit.
  - (b) Rename the test to the declared name. Then re-observe, at the rename commit, every mutation whose comment names it: T24's own comment and T1's re-observation comment. Then update both comments.

## S2

**S2-1. No test detects the round-56 condition "stopped before next(e)". It holds by reading only.**
- Probe P-abort comments out `controller?.abort();` in raceBefore's `finally`. The plugin suite then reads 28 pass, 0 fail.
- By reading, the abort is present and runs before raceBefore returns. recordRun calls `next(e)` only after that return, at register.js:471 and register.js:478 (05fc645d).
- The kit's MockClock surface, as read in worker report 1 §2 r2, exposes no held-wait count. So the property may not be test-reachable.
- Suggest that the next amendment records it as a by-reading property under §8 item 18, so that it is not read as tested. Not blocking: the form preregisters no test for it.

**S2-2. The PR body carries summaries where the form's §9 PR-body list asks for outputs** (`tools/mods/EVIDENCE-RECORDER-V0-1-PREREGISTRATION.md:408-411 @ 9c40d22f5327 sha256:2b1018b0e29790501dcc5934e43462703268cb3fd78795a83425befa8e4b50f2`).
- The folder's `validate` text output is reproduced.
- Given as one-line summaries only:
  - the folder's `--json`;
  - `tools/mods` text and `--json`;
  - the plugin test output;
  - the runner test output.
- Every summary agrees with my runs below. Suggest that the full text goes in the body, with paths redacted.

## N

- **N-1. D7 and the drive letter's case.**
  - The ruling (`state/directives/2026-10-05-round-55-open-1-ruling.md:6 @ 9c40d22f5327 sha256:e3a5377ec9f34014404c82a243cd41a7e81e953b7b6dfa96fca10cac8542656d`) names the output `<LETTER>:/`.
  - The text admits both readings: the letter as typed, or the letter upper-cased. It says neither "as typed" nor "upper-cased". Amendment 1's pre-code row (line 428 of the same file @ 9c40d22f5327 sha256:d5bdf466d98f3c7e4d2f46bc6764565899fd73a1cd541f041547b854d26b04c5) reads "that letter". So the ruling's text supports D7 without compelling it.
  - The case has no observed consequence for a record. git, run by Node spawn with cwd `c:/dev/wt/rec01` and with cwd `C:/dev/wt/rec01`, printed the toplevel `C:/dev/wt/rec01` both times (git 2.49.0.windows.1). The cwd itself is not a record field.
  - T27 pins the typed case: probe P-upper fails T27. If the human reads `<LETTER>` as upper-case, the code and T27 change together.
- **N-2. The no-op rejection handler is undetectable by the suite.** Probe P-catch, which removes `staged.catch(noop);`, reads 28 pass. No path in the suite makes the stage reject. By reading, the handler is present (register.js:419 @ 05fc645d), as §2.1 and §8 item 4 require.
- **N-3.** register.js line 1 still says "Evidence Recorder v0".
- **N-4.** The governance-ci header line edited by §2.0 is now 118 columns wide.
- **N-5. T25's `ms >= 50` compares Date.now spans against a 50 ms setTimeout in the stub.** The hook's span starts before hashing and dispatch, so the margin is positive, but the bound is still timer-sensitive. It passed in my unmutated runs.

## Mutations, each observed by me at 05fc645d

Method: a scratch Node harness, outside the repository. For each mutation it checked that the anchor occurs exactly once, applied the mutation, ran the suite, recorded each failing test by name and restored the original bytes. Each restore was byte-checked, and git porcelain was empty after every batch. A verify-mutation run is not an observation, and none was used as one.

**Runner suite:** `node --test scripts/evidence/repeat.test.mjs`, node v24.18.1. Every result matches its recorded comment.

| Mutation | rc | Failing tests |
|---|---|---|
| R1, `if (failed > 0) break;` after the per-run line | 1 | `the runner runs the command n times in order, reports each exit and never stops early`; `a command that cannot start counts as a failed run and the runner carries on` |
| R2, `shell: true` | 1 | R1; `the runner passes the arguments after the separator to the command unchanged, with no shell`; R3 |
| R3, a null status read as 0 | 1 | R3 only |
| R4, an n of 0 accepted | 1 | `a malformed call runs nothing and exits 2` only |

**Plugin suite:** `claude plugin test tools/mods/spatial-evidence-recorder`, claude 2.1.289 (Claude Code). Every result matches its recorded comment.

| Mutation | rc | Failing tests |
|---|---|---|
| T21, row A5 removed | 1 | T21; T23; T26 |
| T22, the tail check dropped | 1 | T22; T23 |
| T23, `repeat` fixed at 1 | 1 | T23 |
| T24, the stage awaited without the race | 1 | T24 (built name); T28. 15.1 s, no hang |
| T25, `lastWrite` set above the awaited write | 1 | T25 |
| T26, a context added on an A5 call | 1 | T21; T26 |
| T27, the translation dropped | 1 | T27 |
| T28, a rejected sleep read as the ceiling | 1 | T28 |
| T1 (re-observed), snapshotAfter all-unavailable | 1 | 8 fail, the eight its re-observation comment names |
| T11 (re-observed), the agent listing dropped from recordUsage | 1 | the usage-record test only |

**v0's recorded mutations T2 to T10 and T12 to T20, re-observed at the head.** A2-1 records `arm()`'s change to shared v0 fixtures as class 2 and asks for every mutation to be observed, and D8 widened `arm()` further. Each mutation was applied in its v0.1 equivalent (for T4, the `try` around `raceBefore` removed). Each exits rc 1, and its own v0 test is among the failures. So no v0 test was weakened by the fixture change. Some lists now also name v0.1 tests, for example T6 adds T24 and T16 adds T24.

**My probes, not recorded mutations:**

| Probe | rc | Result |
|---|---|---|
| P-abort, the abort removed | 0 | 28 pass: survives (S2-1) |
| P-catch, `staged.catch(noop)` removed | 0 | 28 pass: survives (N-2) |
| P-unresolved, a sleep on an unresolved plan | 1 | T28 fails |
| P-twosleeps, a second sleep per dispatch | 1 | T28 fails |
| P-ceiling3000, `BEFORE_CEILING_MS = 3000` | 1 | T24 and T28 fail |
| P-upper, the letter upper-cased | 1 | T27 fails |
| P-cygdrive, `/cygdrive/` or `/mnt/` translated | 1 | T27 fails |

## Round 56's conditions on beforeCeiling, by reading at 05fc645d, with probes

- **One call per dispatch:** raceBefore is called once per recordRun (register.js:471). It calls beforeCeiling once (register.js:424). P-twosleeps is killed. Pass.
- **Only on a resolved plan of an approved call:**
  - An unresolved plan returns before the sleep (register.js:417), and P-unresolved is killed.
  - A not-approved call returns `next(e)` at register.js:465 before raceBefore, and T22 counts `sleeps` as `[]` over every F19 form.
  - Pass.
- **Stopped before `next(e)`:** the `finally` at register.js:440-446 aborts before raceBefore returns. Pass by reading; untested (S2-1).
- **`BEFORE_CEILING_MS` at 2000:** register.js:19, below `HookBudget.ms` 10_000. P-ceiling3000 is killed. Pass.
- **No other `$.clock` member and no other new `$` call:**
  - A grep finds one `$.clock.` code use (register.js:408). There is no setTimeout, clearTimeout, performance or process in register.js.
  - The `validate` calls line matches (below).
  - Pass.

## The translation against round 55's typed text

- **Shape:** register.js:206-207 reads a leading slash, one ASCII letter (`[A-Za-z]`), then a slash or the end. The output is the letter, a colon, a slash and the rest. It is inside `leadingCdDir` only, and the rest of `leadingCdDir` is unchanged. Pass.
- **Untranslated spellings:** `/tmp`, `/home`, `/cygdrive/c` and `/mnt/c` do not match, and T27 asserts all four. P-cygdrive is killed. Pass.
- **No OS branch and no new `$` call:** a grep of register.js finds no `process.platform`. Pass.
- **T27's cases:** `/c/x`, a bare `/c`, and the four untranslated spellings. The ruling asks for two untranslated spellings; four exceed it. Pass.
- **README:** the translation line, the Git Bash assumption, and the off-Windows `unavailable` sentence are present. Pass.
- **D7:** see N-1.

## §8 items 2 to 5, and 16 to 18, by reading at 05fc645d

- **Item 2, the runner** (`scripts/evidence/repeat.mjs`): one `spawnSync` with argv and `shell: false`, and `stdio: 'inherit'`. There is:
  - no exec or execSync;
  - no retry, parallel run or early stop;
  - no timer and no `timeout` option;
  - no env or `timeout` parse and no special case for an executable;
  - no reading of the child's output;
  - no file write and no network call;
  - no dependency and no package.json.
  - Pass.
- **Item 3, A5:** the tail is `t.slice(4)` of a segment whose leading prefix alone was normalised away, so the tail is unnormalised. The runner path is judged as A4 judges a script path. The tail passes through `isApproved` (register.js:190-196). Pass.
- **Item 4, the ceiling:**
  - When the ceiling wins, the `NO_BEFORE` fields are returned at once, and late values are never read.
  - `next` is called once, in recordRun.
  - The stage has `.catch(noop)`. The sleep has both handlers through `.then(a, b)`. In the stage-alone path, the stage is awaited inside a try.
  - Pass.
- **Item 5, previous_write:** Date.now at entry and after `$.fs.write` resolves. A rejected write leaves `lastWrite` unchanged. There is no performance.now and no `$.clock`. `$.fs.write` stays in writeRecord, and `validate` shows `(via writeRecord)`. Pass.
- **Item 16 (Amendment 1):** pass, see the translation section.
- **Item 17:** the `$.clock` call is only in beforeCeiling. There is no undeclared global; AbortController is declared, per worker report 1 §2 r1. Pass.
- **Item 18:**
  - The sleep is aborted in `finally`.
  - A rejected sleep reads `unavailable` and never `true` (T28 kills its mutation).
  - The ceiling, 2000, is below 10_000.
  - Pass.

## The calls line and validate

- Hooks line baseline: `state/consults/2026-10-05-evidence-recorder-v0-1-p0-report.md:191 @ 0c382bda sha256:ac33290040aba88205c3a2cc3f74dc2984ca202bb192421af218de5dd8202a7f`. Calls line baseline: line 192 of the same file, `@ 0c382bda sha256:9d3f95b73da1f97611a54c4b53cac5223fed32f7f5ebae52cb008a4aae0154df`. I recomputed both hashes and both match. 0c382bda is on main.
- The expected calls line was built by inserting `$.clock.sleep (via beforeCeiling), ` after the `$.agent.list` entry. It string-equals the live `validate` calls line (CALLS_MATCH), and the hooks line string-equals the baseline (HOOKS_MATCH).
- The calls line gained exactly that one entry, between `$.agent.list` and `$.fs.write`, and nothing else.
- The PR body's folder `validate` block is identical to my text run, path lines aside.

## §7, recounted by its own command

- Command: `git diff --numstat c2d62c37b4ec79f3eca7f8b794b9b85c04bf00fb..HEAD` with §7's pathspecs, rc 0.
- Result: 606 insertions plus 27 deletions, 633 changed lines over 6 files, against 1000 lines and 6 files. No class 8.
- The six files are §7's list exactly.
- The workflow diff is exactly §2.0's four edits: two path filters, the step name and command, and the header sentence. No permission, trigger, action or secret changes.

## The worker's deviations D1 to D11

- **D1, a fast-forward with no merge commit:** sound, because the branch was an ancestor of c2d62c37.
- **D2, how clock calls are counted:** sound, and recorded in Amendment 4. T22 counts zero sleeps on F19. Consequence: T26's "every `$` call rejecting" step leaves the mock clock answering, and the rejected-sleep path is covered by T28.
- **D3, `validate` on `tools/mods`:** sound. I confirmed it at 05fc645d: no hooks or calls lines, and `"contents": []`.
- **D4:** sound. The `timeoutMs: 20000` sits only on T24 and T26, and the failsafe timer is cleared on the passing path.
- **D5:** sound (N-5).
- **D6, settle before advance:** sound.
- **D7:** see N-1. The ruling supports it without compelling it, and it has no consequence for a record.
- **D8, the `arm()` widening:** sound in effect. All v0 mutations still fail their own tests at the head. The widening goes beyond A2-1's class-2 line, and Amendment 4 leaves it to the gates.
- **D9, mutation comments name the observation commit:**
  - Sound. Between ba42e6f7 and the head, register.js is identical, and the test file differs only in comment lines (non-comment diff empty).
  - Between 7bb13724 and the head, repeat.mjs is identical and repeat.test.mjs differs only in comment lines.
  - This satisfies round 25, item 2 (d), and no span is pinned by hash at a branch commit.
- **D10, a nested runner tail is not approved:** sound, per §2.3 (A1 to A4 as the tail stands).
- **D11, `.catch(noop)` on the stage promise:** sound. §2.1 requires it, and v0 §8 item 2 concerns registrations.
- **Undisclosed: T24's name.** This is S1-1.

## Seams and callers (the caller rule)

- **Runner to A5:** T21 and T22 use the form's F18 and F19 strings verbatim. R1 to R4 invoke the runner with the same `node <runner> <n> -- <argv>` shape. The live end-to-end proof is E8, after the merge, if the human names it (§2.8).
- **register.js to `$.clock`:** proven at 2.1.289 through the kit's mock clock and a test-registered `clock.sleep` handler. The live proof is E8 (A2-1's E8 read).
- **Callers:** every new function and variable has a product caller in register.js:
  - `repeatOf` (230);
  - `beforeCeiling` (424);
  - `raceBefore` (471);
  - `stageAlone` (430, 438);
  - `lastWrite` (390, 517).
  - The runner's caller is the brief rule (§9 Operator), as §2.8 declares.
- No `pub` or export was added beyond `register`.

## Round 25, item 2 checks

- No §7 overrun.
- The class-9 rows (Amendments 1 and 3) are present at c2d62c37, before the first code commit 7bb13724.
- No record calls a verify-mutation run an observation. Worker report 1 §4 says it was not one.
- No test-text span is pinned by hash at a branch commit.
- The full form is used.

## Commands and exit codes (all at 05fc645d in C:/dev/wt/rec01 unless named)

- `git status --porcelain=v1 -b`: rc 0, clean. `git fetch origin`: rc 0.
- `git diff --stat origin/main...HEAD`, `--numstat`: rc 0.
- `node --version`: v24.18.1, rc 0.
- `node --test scripts/evidence/repeat.test.mjs`: rc 0, 4 pass, 0 fail.
- `claude --version`: 2.1.289 (Claude Code), rc 0.
- `claude plugin test tools/mods/spatial-evidence-recorder`: rc 0, 28 pass, 0 fail.
- `claude plugin validate tools/mods/spatial-evidence-recorder`: rc 0, with one `version` warning, and the hooks and calls lines as above.
- `claude plugin validate tools/mods/spatial-evidence-recorder --json`: rc 0. `"success": true`, `manifest.errors` empty, one warning, and `contents[0].notes` equal to the two lines.
- `claude plugin validate tools/mods`: rc 0. Marketplace manifest, two `version` warnings, no hooks or calls lines.
- `claude plugin validate tools/mods --json`: rc 0, `"success": true`, `"contents": []`.
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`: rc 0, 444 tests, 444 pass, 0 fail.
- `node scripts/plan/verify.mjs`: rc 0, `verify:plan PASS`.
- `node scripts/plan/verify-cites.mjs`: rc 0, PASS, 1326 files, 35 loose references advised.
- `node scripts/plan/verify-quotes.mjs`: rc 0, PASS, 119 checked.
- `node scripts/plan/verify-test-claims.mjs`: rc 0, PASS, 492 claimed tests.
- `node scripts/plan/verify-mutation.mjs --base origin/main --head HEAD`: rc 0, PASS, 12 new tests named. Its scan covers `scripts/evidence/*.test.mjs` and `tools/mods/**/*.test.ts`, as Amendment 2's Step C stated. This is a claim about the tool at the tree named above.
- `gh pr checks 177`: rc 0, six checks pass.
  - Runs 37302063544 (the branch-update event) and 37302070106 (pull_request) are both at headSha 05fc645d, both success.
  - The pull_request job's log shows the new test command with all four runner tests, and 444 pass on ubuntu-latest.
- `gh pr view 177`: rc 0. The head is 05fc645d, the PR is OPEN and not a draft.
- Mutation harness runs: rc 0 per batch. Per-mutation suite exit codes are in the tables above.
- `git diff`, `git show` and `git log` reads for D9, the amendment order and the callers: rc 0.
- Node spawn of `git rev-parse --show-toplevel HEAD` under both drive cases: rc 0 (N-1).
