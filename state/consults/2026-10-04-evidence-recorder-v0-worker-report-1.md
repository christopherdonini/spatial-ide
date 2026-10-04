*Custodian's filing note (2026-10-04): evidence-recorder-v0's worker-high report 1, the build to its full-form preregistration under node:evidence-recorder-v0@g1. The worker wrote it to the custodian's scratchpad, and the custodian copied it here byte-identical below the rule. Its sha256, from this file's line 5 to the end, is 852f42ce65f666c729dd2e84e8c47c4393bd59a2d07ae9aafbac75f6e5b95f93, equal to the hand-back. Its commits are 9acc86b8 (the seven files of §7) and 32fc334f (the RECORDED MUTATION comments), both signed off, on `cut/evidence-recorder-v0`. **Checked by the custodian:** the branch head equals its upstream; the diff against main is exactly §7's seven files, 1109 insertions; nothing under `tools/mods/spatial-guardian/` changed; neither `C:/dev/spatial-ide-local` nor `C:/dev/recorder-local` exists; the session's dev-mods folder is empty; no process of the worker's remained. Its class-2 results C2-a to C2-c are recorded as the form's Amendment 1 on the branch, and the node moves to generation 2. Its readings R1 to R7 (§9) are for the gates. Worker cost: 278,388 subagent tokens, 80 tool uses, 1,376,957 ms. Profile paths redacted at filing: none.*

---

# evidence-recorder-v0 worker report 1

Tag `node:evidence-recorder-v0@g1`. Worktree `<worktree>`, branch `cut/evidence-recorder-v0`, published with upstream set. Head of record: `32fc334f43ec3667bb0d5474ece34bbb1f32cf67`. Build commit: `9acc86b8c55956d679f14c0df98981c80137d9ef`. Base: `ea5aba5d120ee173d32c786a53b291ec83ff3d71`.

Verdict: the piece is built to the form. No invalidator (I1 to I8) fired and no §8 item was crossed. Three class-2 results and seven readings are in section 9 for the custodian; none changes a §2 shape in my reading, and I did not edit the form.

## 1. Identity

- Model: I observe myself running as Sonnet 5.5 (model id claude-sonnet-5-5), invoked through the high-effort worker variant the brief names. No model override beyond that. No context handoff received or produced.
- Build of record: `claude --version` read at the start, by the mutation script before every mutation run, before the final runs and at the end: 2.1.289 (Claude Code), exit 0 each time. The binary did not change during the piece (I2 (a) did not fire).
- `node --version` v24.18.1. `git --version` git version 2.49.0.windows.1.

## 2. Type-source checks

`sha256sum` of each file under `<skill-root>/` against the value the form's §0.1 records (the form's three hash lines compared by string equality):

| File | sha256 computed | Equal to the form |
|---|---|---|
| `<skill-root>/types/claude-code.d.ts` | 36af9e4799354bf878a91d1ea7c4632d0eca7c620b4557ace6afc8a87647cdb1 | yes |
| `<skill-root>/reference.md` | ad5f1688672600495233d09b597c1bc4ef5d8f790c32caf9490d4fd2e5bb71f4 | yes |
| `<skill-root>/examples/tool-call.ts` | 76a0235a305b1a6ae53f87a2c91d84b502ceebab7f887bd036ad5054ef366f73 | yes |

## 3. Commits

| Commit | What |
|---|---|
| `9acc86b8c55956d679f14c0df98981c80137d9ef` | `feat(mods)`: the seven files of §7. Signed off (`-s`). |
| `32fc334f43ec3667bb0d5474ece34bbb1f32cf67` | `test(mods)`: the 20 `RECORDED MUTATION` comments filled with the observed failing tests at the build commit. Comment lines only: `git diff 9acc86b8c559 HEAD` has no changed line that is not a `//` line. |

Published twice with a plain publish (the first with `-u`, upstream set); no force, no rebase. After the second, `HEAD` and `origin/cut/evidence-recorder-v0` are both `32fc334f43ec`. The local `origin/main` ref gave merge base `ea5aba5d120e` (I did not fetch it).

Files changed against the base are exactly §7's seven: `tools/mods/.claude-plugin/marketplace.json` (one `plugins` entry added; Guardian's entry and every other byte unchanged), `tools/mods/spatial-evidence-recorder/.claude-plugin/plugin.json`, `.../hooks/hooks.json`, `.../hooks/register.js`, `.../test/recorder.test.ts`, `.../README.md`, `.../.gitignore`. Nothing under `tools/mods/spatial-guardian/` changed.

## 4. The §1 seam: git output shapes recorded before the tests were written

Method: each §2.4 argv run once from Node with no shell (`execFile`), in `<worktree>`, at commit `ea5aba5d120e`, `git version 2.49.0.windows.1`; once on the clean tree and once with a scratch edit to one tracked file plus one untracked file (reverted with `git checkout` and removed; `git status --porcelain` was empty after).

| argv (after `git --no-optional-locks`) | Shape observed |
|---|---|
| `rev-parse --show-toplevel HEAD` | exit 0; two lines, LF separator, trailing LF, 60 bytes; line 1 the toplevel with forward slashes (`C:/dev/wt/recorder`); line 2 the 40-hex head; no backslash |
| `status --porcelain=v1 -z` | exit 0; clean: 0 bytes. Dirty: NUL-terminated entries, no LF (` M .gitignore` NUL `?? untracked-probe.txt` NUL, 37 bytes) |
| `diff HEAD --binary` | exit 0; clean: 0 bytes. Dirty: unified diff text, LF lines, trailing LF (271 bytes, 9 lines) |
| `rev-parse HEAD` | exit 0; one line, 40 hex, trailing LF (41 bytes) |
| `rev-parse --path-format=absolute --git-common-dir` | exit 0; one line, trailing LF, forward slashes: `C:/dev/spatial-ide/.git` when run in the linked worktree (the main tree's `.git`, not the worktree's) |

I7 did not fire: every shape agrees with §2.4. The test stubs follow these shapes, and the test file's header comment names the commit and the git version. The log-root parser also accepts backslashes and rejects a common directory that does not end in `/.git`.

## 5. What was built, against §2

- `hooks/register.js` (464 lines): two top-level hook functions, `recordRun` (Bash `tool.call`) and `recordUsage` (`turn.complete`), registered by `register(on)`. Helpers: `splitCommand`, `tokenise`, `normalise`, `isApproved` (rows A1 to A4), `leadingCdDir`, `planFor`, `gitRun` (the only `$.process.run` site), `snapshotBefore` and `snapshotAfter` (the three calls issued together through `Promise.allSettled`), `treeChanged`, `agentTypeOf` (the only `$.agent.list` site), `outcomeOf`, `logRootFrom`, `writeRecord` (the only `$.fs.write` site), `resolveLogRoot`.
- Every hook calls `next(e)` once on every path and returns that call's own value. No `.catch`, no `deny`, `context`, `result` or `text` of its own. `PROCESS_TIMEOUT_MS` is 2000.
- `validate` lists exactly §2.0's hooks and calls (section 7).
- `test/recorder.test.ts` (564 lines): T1 to T20 with §4's names; each has its `// RECORDED MUTATION:` comment.
- `README.md` (65 lines): what is recorded, the schema and hash basis, the log root, pruning by hand, the limits, the Bash-tool rule and the brief rule, install, off, uninstall. It names no off-switch other than `claude plugin disable ... --scope user` and `/plugin`, and no scope other than user.

## 6. Every run, with its exit code

All at head `32fc334f43ec` unless the row says otherwise.

| Run | Exit | Result |
|---|---|---|
| `claude --version` (start; before the final runs; end) | 0, 0, 0 | 2.1.289 (Claude Code) |
| `claude plugin test` on the uncommitted tree, run 1 | 1 | 20 fail: the hooks module did not load (hooks declared inside `register`; item C2-b) |
| run 2, same tree after the fix | 1 | 16 pass, 4 fail (the `fs.write` path spelling, item C2-a) |
| run 3 | 0 | 20 pass |
| `claude plugin test tools/mods/spatial-evidence-recorder` at the head | 0 | 20 pass, 0 fail; full output below |
| `claude plugin validate tools/mods/spatial-evidence-recorder` | 0 | passed with one warning (no `version`); section 7 |
| `claude plugin validate tools/mods/spatial-evidence-recorder --json` | 0 | `success: true` |
| `claude plugin validate tools/mods` | 0 | passed with two warnings (no `version` on either plugin) |
| `claude plugin validate tools/mods --json` | 0 | `success: true` |
| `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` | 0 | 440 tests, 440 pass, 0 fail |
| `node scripts/plan/verify-cites.mjs` | 0 | PASS, 1259 files (39 loose references advised, none in my files) |
| `node scripts/plan/verify-quotes.mjs` | 0 | PASS, 117 checked, 86 verified, 30 baselined |
| `node scripts/plan/verify-quotes.mjs --show-cites <my README, test, register.js, marketplace.json>` | 0 | PASS, 0 checked: none of my files carries a quote or a path:line cite |
| `node scripts/plan/verify-test-claims.mjs` | 0 | PASS, 488 claimed tests exist or are planned, superseded or withdrawn |
| `node scripts/plan/verify.mjs` | 0 | `verify:plan PASS` |
| `node scripts/plan/verify-mutation.mjs --base ea5aba5d120e --head HEAD` | 0 | PASS, all 20 new tests have a recorded mutation naming them. A presence check, not an observation of any mutation |
| the §7 counting command | 0 | 1109 changed lines, 7 files (section 8) |
| 20 mutation runs (`claude plugin test` per mutation, section 10) | 1 each | each failed its named test |

Tool commits (round 15 (c)), the last commit that changed each script in this worktree: `verify-cites.mjs` 522e448d55e089b974e115e23f0c72bfc6e1120a; `verify-quotes.mjs` f9444a4d99a9087394c55d4b1d4c414a8b11f980; `verify-test-claims.mjs` e9735d4749f094f03b69a8b570e8bf10f511c279; `verify.mjs` 260720226f136d1ec7d72da64656f07d29400ed7; `verify-mutation.mjs` 7d24ed155a120556d6e726eea68237409270d975.

verify-mutation's scan, as §4 asks, at `7d24ed155a12`: its diff pathspec list includes `*.test.ts`, and a git pathspec `*` crosses `/`, so the scan covers `tools/mods/**/*.test.ts`; its JS test finder matches `test('...')` and `test("...")` lines. The run above listed all 20 recorder tests.

### `claude plugin test tools/mods/spatial-evidence-recorder` at the head (tool output, byte-copied; exit 0)

```
test\recorder.test.ts:
(pass) an approved command produces one complete run record [101.97ms]
(pass) a command outside the approved list produces no record and makes no engine call [82.53ms]
(pass) every approved spelling in the matcher table produces one record [146.66ms]
(pass) a failing or timed-out git call gives unavailable fields and leaves the result unchanged [88.11ms]
(pass) an edit or a commit during the run sets tree_changed_during_run [63.93ms]
(pass) an unavailable side reads tree_changed_during_run unavailable [48.15ms]
(pass) the errored arm records the tool's error flag and the text fields, never stdout or stderr [48.57ms]
(pass) persisted output gives unavailable stdout and stderr fields [38.94ms]
(pass) a refused call produces no record [56.51ms]
(pass) a background call passes with no engine call [38.07ms]
(pass) a subagent's turn end produces one usage record [41.31ms]
(pass) the main loop's turn end writes nothing, and missing values read unavailable [36.03ms]
(pass) every hook returns what next produced, byte for byte [72.36ms]
(pass) a leading absolute cd sets the tree, and any other cd leaves it unresolved [74.18ms]
(pass) the log root comes from git's common directory, one new file per record, with no read [83.19ms]
(pass) the before-side git calls are issued together [46.68ms]
(pass) every process call is git with no optional locks, a listed subcommand and the declared timeout [56.20ms]
(pass) a subagent's approved run records its listed type [49.10ms]
(pass) an auto-backgrounded result records backgrounded_after_ms with after fields unavailable [36.22ms]
(pass) a record carries no output, status or diff text [44.57ms]

 20 pass
 0 fail
Ran 20 tests across 1 file. [1.59s]
```

## 7. `claude plugin validate` outputs (tool output, byte-copied; `<worktree>` replaces the worktree path)

`validate tools/mods/spatial-evidence-recorder`, exit 0:

```
Validating plugin manifest: <worktree>\tools\mods\spatial-evidence-recorder\.claude-plugin\plugin.json

⚠ Found 1 warning:

  ❯ version: No version specified. Consider adding a version following semver (e.g., "1.0.0")

Validating hooks: <worktree>\tools\mods\spatial-evidence-recorder\hooks\hooks.json

  ❯ ./register.js hooks: tool.call{tool=Bash}, turn.complete
  ❯ ./register.js calls: $.agent.list (via agentTypeOf), $.fs.write (via writeRecord), $.process.run (via gitRun)

✔ Validation passed with warnings
```

`validate tools/mods/spatial-evidence-recorder --json`, exit 0:

```
{
  "success": true,
  "strict": false,
  "target": "<worktree>\\tools\\mods\\spatial-evidence-recorder\\.claude-plugin\\plugin.json",
  "manifest": {
    "file": "<worktree>\\tools\\mods\\spatial-evidence-recorder\\.claude-plugin\\plugin.json",
    "type": "plugin",
    "errors": [],
    "warnings": [
      {
        "path": "version",
        "message": "No version specified. Consider adding a version following semver (e.g., \"1.0.0\")",
        "code": null
      }
    ],
    "notes": []
  },
  "contents": [
    {
      "file": "<worktree>\\tools\\mods\\spatial-evidence-recorder\\hooks\\hooks.json",
      "type": "hooks",
      "errors": [],
      "warnings": [],
      "notes": [
        "./register.js hooks: tool.call{tool=Bash}, turn.complete",
        "./register.js calls: $.agent.list (via agentTypeOf), $.fs.write (via writeRecord), $.process.run (via gitRun)"
      ]
    }
  ]
}
```

`validate tools/mods`, exit 0:

```
Validating marketplace manifest: <worktree>\tools\mods\.claude-plugin\marketplace.json

⚠ Found 2 warnings:

  ❯ plugins[0] plugin.json → version: No version specified. Consider adding a version following semver (e.g., "1.0.0")
  ❯ plugins[1] plugin.json → version: No version specified. Consider adding a version following semver (e.g., "1.0.0")

✔ Validation passed with warnings
```

`validate tools/mods --json`, exit 0:

```
{
  "success": true,
  "strict": false,
  "target": "<worktree>\\tools\\mods\\.claude-plugin\\marketplace.json",
  "manifest": {
    "file": "<worktree>\\tools\\mods\\.claude-plugin\\marketplace.json",
    "type": "marketplace",
    "errors": [],
    "warnings": [
      {
        "path": "plugins[0] plugin.json → version",
        "message": "No version specified. Consider adding a version following semver (e.g., \"1.0.0\")",
        "code": null
      },
      {
        "path": "plugins[1] plugin.json → version",
        "message": "No version specified. Consider adding a version following semver (e.g., \"1.0.0\")",
        "code": null
      }
    ],
    "notes": []
  },
  "contents": []
}
```

Reading against §5: the hooks line is `tool.call{tool=Bash}, turn.complete`, and the calls line holds `$.agent.list`, `$.fs.write` and `$.process.run` and nothing else. The `(via agentTypeOf)`, `(via writeRecord)` and `(via gitRun)` annotations are the `(via ...)` kind §5 says is class 2 only when it is the whole difference. I3 did not fire.

## 8. §7's figure, by its own command

The form's command with the merge base and a named head: `git diff --numstat ea5aba5d120e..32fc334f43ec -- . ':!tools/mods/EVIDENCE-RECORDER-V0-PREREGISTRATION.md' ':!PLAN.yaml' ':!CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**'`. Output, byte-copied:

```
5	0	tools/mods/.claude-plugin/marketplace.json
7	0	tools/mods/spatial-evidence-recorder/.claude-plugin/plugin.json
1	0	tools/mods/spatial-evidence-recorder/.gitignore
65	0	tools/mods/spatial-evidence-recorder/README.md
3	0	tools/mods/spatial-evidence-recorder/hooks/hooks.json
464	0	tools/mods/spatial-evidence-recorder/hooks/register.js
564	0	tools/mods/spatial-evidence-recorder/test/recorder.test.ts
```

Sum of insertions and deletions: 1109 over 7 files (ceiling 1400 over 7). The form's estimate was register.js 345, tests 730, README 95, the rest 20; the actual is register.js 464, tests 564, README 65, the rest 16. I5 did not fire.

## 9. Class-2 results and readings for the custodian

Class-2 results (a result that differs from a §3 prediction or the form's wording; the form is not edited):

- **C2-a, the written path's spelling (F1, F14).** §3 predicts a record at `C:/r-local/evidence/<date>/...json`. The hook spells forward slashes (nothing in `register.js` writes a backslash path), but the test kit hands the `fs.write` stub the path with Windows separators (observed in run 2 at 2.1.289: the received path began `C:\r-local\evidence\`). `process.run`'s `cwd` is not rewritten (the tests saw `C:/x/wt/a` as spelled). The tests compare the written path with separators normalised and say so in a comment. What the live engine does is not claimed.
- **C2-b, the hooks module's shape.** The engine refuses a hook that is not a function declared at the top of the module (run 1: the load error names the hook and the rule). `recordRun` and `recordUsage` are therefore top-level declarations, and the log-root cache is a module-level `let`, which is the form's "once per module load, cached on success" read literally. In the kit each test loads the module fresh (T14 and T15 each saw their own common directory after other tests had cached a different one).
- **C2-c, `process.spawn` in the kit.** A stub for `process.spawn` must be an async generator, so the tests' "never asked" counters cover `fs.read`, `fs.list`, `fs.stat`, `fs.exists`, `session.root` and `session.cwd` but not `process.spawn`. `validate`'s calls line (no `$.process.spawn`) is the evidence for that one.

Readings I took where the form is silent or ambiguous (each may be overruled):

- **R1, `tree_changed_during_run` precedence.** §2.4 says true when any compared value differs and unavailable when any is unavailable. When one pair differs and another is unavailable, `register.js` returns true (a known difference wins). Every §3 fixture has at most one cause.
- **R2, optional keys.** `return_code_interpretation` and `backgrounded_after_ms` are absent from the record when the tool result lacks them (§2.5 says the key is absent otherwise for the first; I applied the same to the second). Every other field is set or `unavailable`.
- **R3, `recorder_ms.write`.** A record cannot hold the duration of its own write. `write` measures the log-root lookup and the record assembly up to just before serialisation; the `fs.write` call itself and the file-name hash are not in it. E5's before + after + write therefore under-counts by that latency. I did not estimate it.
- **R4, the matcher's heredoc and substitution rows.** A call holding an unquoted `<<`, backtick, `$(`, `<(` or `>(` (or a backtick or `$(` inside double quotes) is not approved, whatever else it holds. Loops, wrappers and subshells are not approved because their first words match no row.
- **R5, `leading-cd`.** The first segment's first word is exactly `cd` (no env prefix), it ends in `&&`, it has one absolute argument with none of `$`, backtick, `~`, `*`, `?`, and no other segment is a `cd`. A second `cd` anywhere makes the basis `unresolved`.
- **R6, the file name.** The date and time come from `ended_at` (the usage record: `recorded_at`), in UTC; the 16 hex are the head of the sha256 of the written line including its trailing LF.
- **R7, fixtures beyond the F table.** F7 also runs an errored `result` that is an object holding streams (the typed `result` is the error text, a string, and the string alone cannot kill T7's mutation). F4 also runs an exit-128 and a rejection on each of the three calls, and a non-result answer on the before side (the net the before-side `try` is observed through). F3 adds eight spellings, F14 adds six `cd` shapes and a backslash drive, T15 adds the no-root shapes and a refused write. F15's bottom answer carries `timedOutAfterMs` with a `backgroundTaskId`. A non-result answer on the after side has no net of its own: it drops the record inside the after-side `try`.

## 10. Each mutation's observation

Method for each of the 20: apply the edit to `hooks/register.js` in the worktree, run `claude plugin test tools/mods/spatial-evidence-recorder`, record the failing tests, restore the file with `git checkout` and confirm the folder is clean. All 20 at commit `9acc86b8c559`, `claude --version` 2.1.289 (Claude Code). The full failing lists are in each test's `// RECORDED MUTATION:` comment at the head; the test whose mutation it is is first in each list, and it failed in every case. The `verify-mutation` run is a presence check and is not one of these.

| Test | Mutation applied | Tests that failed (count) |
|---|---|---|
| T1 | after-snapshot skipped | 5, T1 among them |
| T2 | A4 matches any `verify-*.mjs` | 1 |
| T3 | env assignments not stripped | 1 |
| T4 | `try` around the before-snapshot removed | 1 |
| T5 | only the diff hashes compared | 3 |
| T6 | an unavailable side read as unchanged | 4 |
| T7 | errored arm's stdout and stderr read from `ran.result` | 1 |
| T8 | `persistedOutputPath` check dropped | 1 |
| T9 | deny check dropped | 1 |
| T10 | `run_in_background` check dropped | 1 |
| T11 | `$.agent.list` lookup dropped from the usage record | 1 |
| T12 | main-loop check dropped from the usage hook | 1 |
| T13 | Bash hook returns `{ ...ran, context: ['x'] }` | 14 |
| T14 | `cwd` not passed | 2 |
| T15 | log root taken from the toplevel | 4 |
| T16 | before-side calls awaited one after another | 1 |
| T17 | `timeoutMs` dropped from the after-side diff | 1 |
| T18 | agent type not looked up for run records | 1 |
| T19 | `timedOutAfterMs` check dropped | 1 |
| T20 | stdout copied into the record | 2 |

One difference from a first draft: T11's mutation as applied (the lookup dropped from the usage record) fails T11 only; T18's own mutation covers the run record. The comments at the head state the observed sets.

## 11. The log-root check

After the last test, validate and mutation run: `C:/dev/spatial-ide-local` does not exist and `C:/dev/recorder-local` does not exist (`ls` of both returned "No such file or directory"). The tests use the harness only, and every write in them goes to a stub.

## 12. Pre-gate self-check (the four failure classes) and the hard limits

1. Cross-module code uses the interface the other side exposes: the seam to git is the recorded shapes of section 4, taken by running each argv; the seam to the engine's mod API is the 2.1.288 types read at the form's cited lines and proven by the engine's own dispatch in `claude plugin test` at 2.1.289 (which refused my first module shape, C2-b). No `$` surface outside §2.0 is used (validate).
2. Every completion claim points to evidence that exists: the runs of section 6 and the mutation observations of section 10, each with its commit. No live (E-row) claim is made.
3. Every user-facing message describes behaviour implemented at this commit: the README states what `register.js` does at this head and names no command I ran.
4. Every required test reaches its intended assertion: each test's mutation failed that test by name (section 10), so each assertion is reached and can fail.

Hard limits kept: I ran none of `claude plugin install`, `enable`, `marketplace add`, `init`, `new`, `update`, `configure`, `eval`; started no Claude session (no `claude -p`, no `--plugin-dir`); the only `claude` commands were `--version`, `plugin validate` (text and `--json`) and `plugin test`, each under `timeout`. I wrote nothing under the user Claude directory (I made one read-only `ls` of its `dev-mods` folder after the last run, which listed two session-named subfolders and nothing of mine). Guardian refused none of my calls. No force-push-shaped command was run on purpose.

§8 self-scan by reading and grep: no `deny`/`allow`/`tool.check`/`context`/`result`/`text` of the hook's own; one `$.process.run` site (`argv[0]` `git`, `argv[1]` `--no-optional-locks`, subcommands `rev-parse`, `status`, `diff`, `timeoutMs` 2000); no `.catch`; no `$.model`, `$.ui`, `$.session`, `$.store`, `$.fs.read`, `$.fs.list`, `$.fs.stat`, `$.fs.exists`; no OS branch; the drive spelling appears only in `leadingCdDir`; no user-profile path in any file (grep clean at the head); no package.json; `.claude-plugin/types/` ignored and not committed; nothing under `spatial-guardian/`.

## 13. Off-scope noticed, not done

- `claude plugin validate` warns that neither plugin has a `version`. Adding one is outside §2.0's `plugin.json` fields (name, description, author); not done.
- The local `origin/main` ref was not fetched, so "merge base" above is against the ref as it stood in the worktree.

## 14. State left

`git status --porcelain` is empty in `<worktree>`; branch `cut/evidence-recorder-v0` at `32fc334f43ec3667bb0d5474ece34bbb1f32cf67`, equal to its upstream. Scratch files (mutation script, outputs, a debug copy of the plugin with print statements) are in the session scratchpad, outside the repository. The log root was never created.
