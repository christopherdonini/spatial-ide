*Custodian's filing note (2026-10-05): the worker-high's report 1 for `evidence-recorder-v0-1` (run 10:50:24Z to 11:15:58Z; 270,019 subagent tokens, 109 tool uses), written to the custodian's scratchpad and copied here byte-identical below the rule. Its sha256 as written, from this file's line 5 to the end, is 38ebbd6f6600edf7934359e647b40003504f008c50078ffbefbb181eb3482eae. The branch `cut/evidence-recorder-v0-1` stands at 05fc645d64c6c59b1f682f04f585e72243f8a272, clean. The main checkout's `tools/mods/spatial-evidence-recorder/` is unchanged. Its D2 and D3 are recorded as the form's Amendment 4 (class 2). Profile paths redacted at filing: none.

---

# Evidence Recorder v0.1 - worker report 1

Worktree C:/dev/wt/rec01, branch cut/evidence-recorder-v0-1. Final head 05fc645d64c6c59b1f682f04f585e72243f8a272; `git status --porcelain` empty. Nothing was published; no history was rewritten; the main checkout and the user's Claude folder were not written. Model I observe myself running as: Sonnet 5.5 (the harness note; the worker definition's model line is sonnet); no model override; no context handoff received or produced.

Result: the form's order was carried out to the end with no invalidator fired; R1 to R4 and T1 to T28 pass at the head; every new test and the re-observed T1 and T11 fail under their named mutations; `validate`'s calls line gained exactly one entry; section 7 is 633 lines over 6 files.

## 1. Merge

`git merge --no-edit origin/main` at origin/main c2d62c37b4ec79f3eca7f8b794b9b85c04bf00fb. The branch (0c382bda) was an ancestor of main, so git fast-forwarded: HEAD became c2d62c37 and there is NO merge commit (deviation D1). The branch carries the form's Amendments 1 to 3 and the typed rulings.

## 2. The reading r1 to r4 (written before any `beforeCeiling` code)

Typed at 2.1.288. Each line number is a line of `<skill-root>/types/claude-code.d.ts`, or of `<skill-root>/reference.md` where named. `<skill-root>` is the 2.1.288 bundled plugin-authoring folder. Each quotation below was checked by script against the file (comment prefixes stripped, lines joined) and is byte-copied.

**r1 - aborting the signal rejects a pending `$.clock.sleep` at once. I13 does not fire. `$.clock.after` is not needed. The one entry is `$.clock.sleep (via beforeCeiling)`.**
- `<skill-root>/types/claude-code.d.ts:3227`: "Resolves after `ms` milliseconds; rejects at once when `signal` aborts."
- `<skill-root>/types/claude-code.d.ts:3239`: `sleep: (ms: number, options?: SleepOptions) => Promise<void>;`
- `<skill-root>/types/claude-code.d.ts:11217-11222`: `SleepOptions` is `{ signal?: AbortSignal }`; its doc line (11219): "Aborting it rejects the sleep at once."
- `<skill-root>/types/claude-code.d.ts:6682-6685`: the event argument is `ClockWait` (`{ ms }`, defined at 1438-1443); doc: "the signal does not cross, it aborts the dispatch."
- `<skill-root>/types/claude-code.d.ts:13830-13837`: `AbortController` is a declared hook-module global (`signal`, `abort(reason?)`); `AbortSignal` at 13813-13829.
- Budget: the sleep counts against the hook's own time (`<skill-root>/types/claude-code.d.ts:3229-3231`, `<skill-root>/types/claude-code.d.ts:4796-4798`, `<skill-root>/reference.md:124`); `HookBudget.ms` is 10_000 (`<skill-root>/types/claude-code.d.ts:4812`), so `BEFORE_CEILING_MS` = 2000 is below it.

**r2 - the mock clock and an aborted sleep; `MockClock.settle`.**
- `<skill-root>/types/claude-code.d.ts:14463-14468`: "each wait is held" (14464), and (14466-14468) "A held wait resolves when an advance crosses the time it is due, and is dropped when its dispatch aborts; one held past a hook's budget (ten seconds of real time) is let go, as a hook that overran."
- So an aborted held wait is dropped, not left held. The lines do not say whether the dropped wait's promise rejects; the hook does not depend on it (a sleep that fails after the race is never read).
- `MockClock` is `<skill-root>/types/claude-code.d.ts:14505-14549`: `now` (14512), `advance(ms)` (14523), `set` (14530), `settle` (14540; its doc at 14535 says "The same as `advance(0)`" and at 14533 "every wait due now resolves and the event loop settles"), `sleep(ms)` (14548, a wait of the test's own).

**r3 - how a test gets the mock, and whether it can answer, count or reject `$.clock.sleep`.**
- `<skill-root>/types/claude-code.d.ts:14461-14474` and `<skill-root>/types/claude-code.d.ts:14499`: `import { test, expect, mock } from 'claude-code/testing'`; `mock.clock(on, options?)` returns the `MockClock`.
- `<skill-root>/types/claude-code.d.ts:6685` and `<skill-root>/types/claude-code.d.ts:6839`: `'clock.sleep'` is an event name (argument `ClockWait`, result `void`), so a test can register `on('clock.sleep', handler)` as it does for `fs.write`: count it and reject it with `{ deny }`. T28 is therefore written.
- OBSERVED at 2.1.289 (not typed): a test cannot register its own `on('clock.sleep')` beside an armed `mock.clock`: the module did not load with `on("clock.sleep") registered twice`. So `$.clock.sleep` calls are counted only in tests that do not arm the mock (T22, T28), and not in the tests that advance the clock (T24, T26).

**r4 - an unarmed `$.clock.sleep` fails.** `<skill-root>/types/claude-code.d.ts:14916-14917`: "A test: the engine's `$`, and `on`, a plugin's registrar, whose hooks sit beneath every plugin; beneath them the bottom hook throws, naming its event." So `arm()` arms the mock clock and the import line gains `mock`, as A2-1 records (class 2).

## 3. Commits (all `-s`, with the trailers; none published)

| Commit | Contents |
|---|---|
| 7bb137242931 | `scripts/evidence/repeat.mjs` (52 lines) and `scripts/evidence/repeat.test.mjs` (R1 to R4, 98 lines). |
| 25f35fc3 | The RECORDED MUTATION comments of R1 to R4 (13 lines), observed at 7bb137242931. |
| ba42e6f76117 | `register.js`: `BEFORE_CEILING_MS`, schema `spatial-evidence-recorder/v0.1`, `repeatOf` (row A5) and `repeat` in `planFor`, the drive translation in `leadingCdDir`, `lastWrite` and its timing in `writeRecord`, `beforeCeiling`, `raceBefore`, `stageAlone`, the three new record fields, the header comment. `recorder.test.ts`: import and `arm()` (mock clock, `late` hold, counters), T1 and T11 changes, T21 to T28. README (section 2.7, Amendments 1 and 2). `governance-ci.yml`: exactly section 2.0's edits (path filter twice, test step name and command, header sentence). |
| b90ed74c | `recorder.test.ts`: comments only: the RECORDED MUTATION of T21 to T28 and the re-observation lines of T1 and T11, observed at ba42e6f76117. |
| 05fc645d | `recorder.test.ts`: comment only: T24's mutation comment shortened, because verify-mutation (tool at c2d62c37) did not find T24's name within its 500-character window of the word mutation. |

`register.js` and the test code are identical between ba42e6f76117 and the head; later commits changed comments only. The observation commit named in every comment is ba42e6f76117 (the runner's: 7bb137242931).

## 4. Mutations, each observed by applying it, running the suite and reverting (tree clean after each)

Runner: `node --test scripts/evidence/repeat.test.mjs`, `node --version` v24.18.1, at 7bb137242931:
- R1 mutation (stop after the first failed run) fails: R1, R3 (`a command that cannot start counts as a failed run and the runner carries on`).
- R2 mutation (`shell: true`) fails: R1, R2, R3.
- R3 mutation (a null status read as 0) fails: R3.
- R4 mutation (an n of 0 accepted) fails: R4.
- The first attempt at R1's mutation did not apply (a shell-quoting slip; the diff was empty and the suite passed); it was redone with the anchor read from a file, and the result above is that one.

Plugin: `claude plugin test tools/mods/spatial-evidence-recorder`, `claude --version` 2.1.289 (Claude Code), at ba42e6f76117. Counts are the suite's own lines (28 tests):

| Mutation | Fails (by name) |
|---|---|
| T21: row A5 removed | T21; T23 `the record carries the repeat count`; T26 |
| T22: A5's tail check dropped | T22; T23 |
| T23: `repeat` fixed at 1 | T23 |
| T24: before stage awaited without the race | T24 (by assertion, 6007 ms: the result arrived after the real-time release at three ceilings; no hang); T28 |
| T25: the timer stopped before `$.fs.write` is awaited | T25 |
| T26: the Bash hook returns `{ ...ran, context: ["repeat"] }` on an A5 call | T21; T26 |
| T27: the translation dropped | T27 |
| T28: a rejected sleep read as the ceiling reached | T28 |
| T1's recorded mutation (the after-snapshot skipped), re-observed | 8 fail: `an approved command produces one complete run record`, `a failing or timed-out git call gives unavailable fields and leaves the result unchanged`, `an edit or a commit during the run sets tree_changed_during_run`, `a leading absolute cd sets the tree, and any other cd leaves it unresolved`, `every process call is git with no optional locks, a listed subcommand and the declared timeout`, T24, T27, T28 |
| T11's recorded mutation (`$.agent.list` dropped from the usage record), re-observed | `a subagent's turn end produces one usage record` only |

A `verify-mutation` run was not used as an observation of any mutation. Step C's statement held: its scan covers `scripts/evidence/*.test.mjs` and `tools/mods/**/*.test.ts` (it listed all 12 new tests, including the plugin file's). Tool commit: c2d62c37 (the branch changes nothing under `scripts/plan`).

T25's `ms >= 50` held in all 7 unmutated runs of the plugin suite (timer jitter did not break it).

## 5. `validate` (claude --version 2.1.289 (Claude Code), at 05fc645d; register.js identical to ba42e6f76117)

`claude plugin validate tools/mods/spatial-evidence-recorder`, rc 0:
```
⚠ Found 1 warning:

  ❯ version: No version specified. Consider adding a version following semver (e.g., "1.0.0")

  ❯ ./register.js hooks: tool.call{tool=Bash}, turn.complete
  ❯ ./register.js calls: $.agent.list (via agentTypeOf), $.clock.sleep (via beforeCeiling), $.fs.write (via writeRecord), $.process.run (via gitRun)

✔ Validation passed with warnings
```
(The first output line, `Validating plugin manifest: <path>`, and `Validating hooks: <path>`, hold the worktree path and are omitted.) The `--json` form: `"success": true`, `manifest.errors` empty, one warning (`version`), and `contents[0]` of type `hooks` whose `notes` are the two lines above byte for byte.
- The hooks line is unchanged. The calls line gained exactly one entry, `$.clock.sleep (via beforeCeiling)`, between `$.agent.list` and `$.fs.write`, as A2-1 predicted; the other three entries are unchanged.
- Baseline, the same command on a `git archive` copy of c2d62c37, printed the hooks line and a calls line of the three original entries, matching P0 section 5.

`claude plugin validate tools/mods`, rc 0: it prints the marketplace manifest, two `version` warnings (`plugins[0]` and `plugins[1]`), `Validation passed with warnings`, and NO hooks or calls lines; `--json` has `"success": true` and `"contents": []`. The same command on the c2d62c37 archive copy printed the same text. So the form's prediction (section 5 and A2-1) that `tools/mods` prints the hooks and calls lines does not hold at 2.1.289, before or after this change; P0 recorded a baseline only for the folder. This is an observation about the prediction (deviation D3), not a change in the code.

## 6. Section 7 (the form's counting command, base = the merge base c2d62c37b4ec79f3eca7f8b794b9b85c04bf00fb, head 05fc645d64c6c59b1f682f04f585e72243f8a272)

```
5	3	.github/workflows/governance-ci.yml
52	0	scripts/evidence/repeat.mjs
111	0	scripts/evidence/repeat.test.mjs
20	4	tools/mods/spatial-evidence-recorder/README.md
117	14	tools/mods/spatial-evidence-recorder/hooks/register.js
301	6	tools/mods/spatial-evidence-recorder/test/recorder.test.ts
```
Totals: 606 insertions plus 27 deletions = 633 changed lines over 6 files, against 1000 lines and 6 files. No class 8. (The estimate was 841; the runner tests came in at 111 lines against 180.)

## 7. Suites and tools, at 05fc645d (node v24.18.1; the verify tools are at c2d62c37, none changed by this branch)

- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`: rc 0, 444 tests, 444 pass, 0 fail (the four runner tests are among them).
- `node --test scripts/evidence/repeat.test.mjs`: rc 0, 4 pass.
- `claude plugin test tools/mods/spatial-evidence-recorder`: rc 0, 28 pass, 0 fail (2.1.289; full output in the run, T1 to T28 each `(pass)`).
- `node scripts/plan/verify.mjs`: rc 0, `verify:plan PASS`.
- `node scripts/plan/verify-cites.mjs`: rc 0, PASS, 1326 files, 35 loose references advised (all pre-existing, none in my files).
- `node scripts/plan/verify-quotes.mjs`: rc 0, PASS, 119 checked. With `--show-cites` on my six changed files: 0 checked (they hold no verbatim quotation).
- `node scripts/plan/verify-test-claims.mjs`: rc 0, PASS, 492 claimed tests exist.
- `node scripts/plan/verify-mutation.mjs --base origin/main --head HEAD`: rc 0, PASS, all 12 new tests name a recorded mutation (at b90ed74c it exited 1 on T24 alone, fixed by 05fc645d).

## 8. Pre-gate self-check (the four classes)

1. Cross-module code uses the interface the other side has: `$.clock.sleep(ms, { signal })` is read at `<skill-root>/types/claude-code.d.ts:3239`; `AbortController` at 13830-13837; the test kit's `mock.clock` at 14461-14474. The runner-to-matcher seam uses the real call string; the live proof is E8 (not run here).
2. Every completion claim points to evidence: the mutation table and the suite outputs above.
3. Every user-facing message describes behaviour implemented at this commit: the README states the ceiling, the fields and the translation as built; it claims no live ceiling.
4. Every required test reaches its intended assertion: each fails under its mutation by the assertion named; T24's mutated run fails on `expect(releasedBefore).toBe(false)` (Expected: false, Received: true: the result arrived after the answers were released), not on a timeout.
- Caller grep (all in `register.js`): `beforeCeiling` called once, by `raceBefore`; `raceBefore` once, by `recordRun`; `repeatOf` once, by `planFor`; `lastWrite` read by `recordRun`, set by `writeRecord`; `stageAlone` by `raceBefore`. `$` calls: `$.process.run` (gitRun), `$.agent.list`, `$.fs.write` (writeRecord), `$.clock.sleep` (beforeCeiling) only; no `setTimeout`, `clearTimeout` or `performance` in `register.js`.

## 9. Deviations from the form, one line each

- D1. The merge was a fast-forward (the branch was an ancestor of main): no merge commit exists; HEAD at that step was c2d62c37.
- D2. T22 and T28 run on an unarmed mock with the test's own `on('clock.sleep')` (count and refusal), because a test cannot register `clock.sleep` beside an armed mock (observed, section 2 r3); T24 and T26 therefore count no clock calls, and T26's "every `$` call rejecting" step leaves the mock clock answering. A2-1's "checked by reading" fallback is not needed: T22 counts zero `$.clock.sleep` calls on the F19 forms, and T28 counts exactly one on a resolved plan and none on an `unresolved` one.
- D3. `validate` on `tools/mods` prints no hooks or calls lines at 2.1.289 (also at c2d62c37), so section 5's prediction for that path cannot be compared; the folder's lines match the prediction.
- D4. F21's real-time release is a gate promise resolved by a `setTimeout` at 3 x 2000 ms, cleared on the passing path, with the test option `timeoutMs: 20000` on T24 and T26 (the default 5000 ms is below the release).
- D5. T25's stub resolves `fs.write` after exactly 50 ms and asserts `ms >= 50`, as F22 reads; it held in all 7 unmutated runs.
- D6. T24 and T26 call `MockClock.settle()` before `advance` so the timer is registered before the clock moves; the form's F21 names only the advance.
- D7. T27's name is mine (the form names none): `a leading cd in the Git Bash drive spelling is read as the drive, and no other spelling is translated`. The letter keeps the case typed (`/c/x` becomes `c:/x`), as Amendment 1's text reads. Untranslated cases: `/tmp/x`, `/home/x`, `/cygdrive/c/x`, `/mnt/c/x`.
- D8. `arm()` gained a third parameter and World fields (`late`, `lateGate`, `pending`, `onThree`, `reached`, `writeDelayMs`, `sleeps`, `clock`) beyond A2-1's mock clock line; no v0 test's own text changed apart from T1 and T11, and `nothingAsked` is unchanged.
- D9. Mutation comments name the commit the code was observed at (ba42e6f76117, runner 7bb137242931), not the commit that holds the comment, since a commit cannot name its own hash; the tip differs from it by comments only.
- D10. Row A5's tail check calls `isApproved` (rows A1 to A4 only), so a tail that is itself a runner call is not approved (nested runner calls match no row).
- D11. A no-op rejection handler is attached with `.catch(noop)` on the stage promise (not on a registration); v0 section 8 item 2 concerns registrations only.

## 10. Notes (not deviations)

- The first `claude plugin test` after the v0.1 edits failed all tests with `on("clock.sleep") registered twice` (my counting hook beside the mock); fixed in the same edit session, before the first commit of register.js.
- Guardian refused one Bash call (a heredoc holding `.push(` in test text). I wrote that text with the Write tool as instructed and did not work around the refusal otherwise.
- The README and the form's section 2.7 line about the brief rule are stated as the custodian's practice.
- Scratch copies (a `git archive` of c2d62c37's `tools/mods`, probe scripts, captured outputs) are in the session scratchpad only; nothing outside the worktree and the scratchpad was written. No `claude` session, install, enable, marketplace, mcp or eval command was run; only `claude plugin test`, `claude plugin validate` and `claude --version`.
