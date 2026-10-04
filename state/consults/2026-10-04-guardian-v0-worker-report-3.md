*Custodian's filing note (2026-10-04): guardian-v0's worker-high report 3, correction round 1 (Amendments 2 and 4) under node:guardian-v0@g4. The tag became g5 mid-round, when Amendment 5 was handed over. Written by the worker to this path and committed as written below the rule. Its sha256, from this file's line 5 to the end, is 8a1aa9f5e9320fcdf0a668a3ef1ec85d6c831d1bc5749ef79dc47f73a1c9d4b0, equal to the hand-back. Its commits are 71db3d7d (code and tests), 38f23c4e (the mutation comments, observed at 71db3d7d at 2.1.289) and 946454d2 (README items R1 to R10). The custodian's mid-round message asked the worker to append Amendment 5 by `cat` from the custodian's scratchpad. The permission system denied that command as instruction poisoning, and the worker did not work around it. The custodian appended Amendment 5 itself after the worker stopped: its bytes matched sha256 ba6f20ab…, committed with `-s`, then main was merged in, at 5f8f2306. README item R11 went to a fresh worker brief. The §7 figure at 946454d2 is 1698 of 1650 over 10 files; the class 8 amendment follows R11. Worker cost: 190,064 subagent tokens, 66 tool uses, 669,217 ms.*

---

# guardian-v0 worker report 3 — correction round 1 (Amendments 2 and 4)

Tag: `node:guardian-v0@g4`. Branch `cut/guardian-v0`, `<worktree>` = the worktree named in the brief. Start: 7998dcce. Head: 946454d26c58369c8a80b2a74a53cb08b8bb5e7c, pushed (origin/cut/guardian-v0 equals it). No force-push, no rebase.

## Verdict: DONE. No invalidator fired. One declared prediction is met: §7 is over (1698 of 1650), left to the custodian as class 8.

Blocking findings: none.

## Commits (all `git commit -s`, pushed)

| Commit | What | Files |
|---|---|---|
| 71db3d7d6327a6c688005aff8667e3b7f123984c | **The observation commit.** Code and tests: G1's second reading, the PowerShell hook running G6 then G1, T37 to T41. The new tests' mutation comments say observation pending. | `tools/mods/spatial-guardian/hooks/register.js`, `tools/mods/spatial-guardian/test/guardian.test.ts` |
| 38f23c4e56eea698229dcc1e80d0a5e60348b7df | Comment-only: every `RECORDED MUTATION` comment of T1 to T9, T22, T23, T37 to T41 names 71db3d7d and `claude --version` 2.1.289, with the failing set observed. A diff filter showed no changed line that is not a `//` line. | the test file |
| 946454d26c58369c8a80b2a74a53cb08b8bb5e7c | README: R1 to R10, in words, no quotation. | `tools/mods/spatial-guardian/README.md` |

Code, by Amendment:
- Amendment 2, §2.2: `splitSegments(command, atGroups)` also splits at `(`, `)`, `{`, `}` and the backtick when `atGroups`, outside quotes and not escaped (the existing backslash handling is what keeps an escaped one out). The old body of `pushRefused` became `readingRefuses(command, depth, atGroups)`, unchanged except for the splitter's argument. `pushRefused` is now the two readings with `||`. The rescan of a quoted token calls `pushRefused`, so it runs both readings under the same depth count and cap. `isGit`, `tokenise`, `pushArgumentsRefuse`, `segmentPushRefused`, `MAX_RESCAN_DEPTH`, `G1_REASON` and both G1 registrations are untouched. All of it sits inside G1's section.
- Amendment 4, §2.7: new `guardPowerShell($, e, next)`: with `e.agentId` unset it makes no `$` call; otherwise it calls `g6Refusal($, e.agentId, undefined)` and denies on a returned reason; then it returns `refuseForcePush($, e, next)`. The PowerShell registration's hook is now `guardPowerShell`; its filter and `.catch` are as before. `g6Refusal`, `refuseForcePush`, `pushRefused`'s per-segment steps, the Bash registration and the Write, Edit and NotebookEdit guard are unchanged.
- The test file's header comment was also edited (comment only) to name T37 to T41.

## Runs of record, at head 946454d2 unless a row says otherwise. Every one at `claude --version` 2.1.289 (Claude Code)

| Run | Exit |
|---|---|
| `git status --porcelain` at the start of the round | 0, empty |
| `timeout 60 claude --version` before the first edit, at the observation commit, and at the head | 0, 0, 0; `2.1.289 (Claude Code)` each |
| `timeout 300 claude plugin test tools/mods/spatial-guardian` (full output below). It did not refuse with the rollout message. | 0 |
| `timeout 120 claude plugin validate tools/mods/spatial-guardian` (text) | 0 |
| the same with `--json` | 0 |
| `timeout 120 claude plugin validate tools/mods` (text) | 0 |
| the same with `--json` | 0 |
| `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` | 0; tests 440, pass 440, fail 0, cancelled 0, skipped 0, todo 0 |
| `node scripts/plan/verify-cites.mjs` (tool last commit 522e448d) | 0; `verify:cites PASS`, 1230 files, 38 loose references advised (all in files this round does not touch) |
| `node scripts/plan/verify-quotes.mjs` (tool last commit f9444a4d) | 0; `verify:quotes PASS`, 117 checked, 86 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors |
| `node scripts/plan/verify-test-claims.mjs` (tool last commit e9735d47) | 0; `verify:test-claims PASS`, 488 claimed tests across 117 files exist or are superseded or withdrawn |
| `node scripts/plan/verify.mjs` (tool last commit 26072022) | 0; `verify:plan PASS` |
| `node scripts/plan/verify-quotes.mjs --show-cites` on the README, the test file and register.js | 0; 0 checked (none of the three carries a marked quotation) |
| scans for a user-profile path in the mod folder and in the three commit messages | none found |
| `git push origin cut/guardian-v0` | 0; 7998dcce..946454d2 |
| `git status --porcelain` in `<worktree>` after the push | 0, empty |

`node --version` v24.18.1, `git --version` git version 2.49.0.windows.1.

The node suite names T35 and T36 in its output. T35 is the line `guardian parity: the mod's stale-block check and the Stop hook's stale-continuity check agree on every fixture`, with subtests PS1, PS2, PS3, PS4a, PS4b, PS5, PS6, PS7, PS8, PS9, PS10, PS18 and PS19 all passing, and each fixture's two outcomes printed as equal. T36 is the line `guardian parity: the fixture set reaches stale, fresh and not judged on the Stop hook`, passing. Neither file is touched by this round, and no `scripts/hooks/` file changed.

No `claude` command was run other than `--version`, `plugin validate` and `plugin test`, each under `timeout`. No install, enable, marketplace add, init, update, configure or eval. No session started. Nothing written under the user Claude directory. No Option B, C or D code was written: no G6 on Bash, no G2 to G4 on any shell.

### `claude plugin test tools/mods/spatial-guardian` at 946454d2 (exit 0), full output

```text

test\guardian.test.ts:
(pass) G1 refuses --force, -f and a short-flag cluster holding f [107.79ms]
(pass) G1 refuses --force-with-lease, bare and with a value [57.60ms]
(pass) G1 refuses a refspec that begins with + [57.05ms]
(pass) G1 refuses --mirror [47.60ms]
(pass) G1 refuses a push that deletes a remote ref [53.79ms]
(pass) G1 finds the push after git global options and inside a quoted command string [49.77ms]
(pass) G1 refuses a push segment it cannot tokenise [39.03ms]
(pass) G1 allows an ordinary push and a force flag that belongs to another command [47.00ms]
(pass) G1 refuses a force-push through the PowerShell tool [49.97ms]
(pass) G1 finds a force-push inside a subshell, a substitution, backticks or a brace block [49.70ms]
(pass) G1 keeps every refusal it made before the second reading [51.46ms]
(pass) G1 allows an ordinary push inside a subshell and a substitution that does not push [71.06ms]
(pass) G2 refuses a Write and an Edit to docs/01_Principles.md in every spelling [47.25ms]
(pass) G2 allows a Write beside docs/01_Principles.md [38.64ms]
(pass) G3 refuses an Edit to an accepted ADR [36.36ms]
(pass) G3 refuses a Write that does not start with a filed preregistration's current bytes [50.85ms]
(pass) G3 allows a pure-append Write to a filed preregistration [51.46ms]
(pass) G3 allows an Edit to a Proposed ADR and to an untracked preregistration [38.75ms]
(pass) G3 refuses when the current bytes cannot be read [32.06ms]
(pass) G3 allows an Edit that only appends at the end of a filed preregistration [33.66ms]
(pass) G4 refuses a Write to an existing directive and any Edit under state/directives/ [32.29ms]
(pass) G4 allows a Write that creates a new directive [31.44ms]
(pass) Write and Edit refuse a path that cannot be placed [33.00ms]
(pass) G6 refuses a lead-data Write outside its declared REPORT PATH [43.57ms]
(pass) G6 allows a lead-data Write to its declared REPORT PATH [32.56ms]
(pass) G6 refuses every Write by an architect run whose brief declares no REPORT PATH [34.95ms]
(pass) G6 leaves other subagents, unlisted agent ids and the main loop to the other rules [37.05ms]
(pass) G6 refuses every PowerShell call by a report-only subagent and leaves other subagents to G1 [38.62ms]
(pass) G6 makes no engine call on a main-loop PowerShell call [39.73ms]
(pass) a refusing hook that throws is refused by its catch [31.06ms]
(pass) a refusing hook whose process call times out is refused [30.42ms]
(pass) every process call is git and carries the declared timeout [36.82ms]
(pass) N1 appends no line below 80 percent and one line at 80 percent on a stale block [31.25ms]
(pass) N1 appends at most one line per 10-point band [36.54ms]
(pass) N1 appends nothing on a fresh block [31.93ms]
(pass) N1 appends nothing for a subagent call or a refused call [30.07ms]
(pass) N1 clears its bands after the fill falls below 80 percent [36.31ms]
(pass) N1's line is the declared text with the integer percent [33.25ms]
(pass) G2 to G4 cover NotebookEdit [38.95ms]

 39 pass
 0 fail
Ran 39 tests across 1 file. [2.03s]
```

39 = T1 to T34 and T37 to T41. Every F1 to F29 outcome and every T1 to T36 result is unchanged (I9 did not fire).

### `claude plugin validate` at 946454d2, full output (all four exit 0; the tool prints the worktree's absolute path, shown here as `<worktree>`)

`validate tools/mods/spatial-guardian`, text:

```text
Validating plugin manifest: <worktree>\tools\mods\spatial-guardian\.claude-plugin\plugin.json

⚠ Found 1 warning:

  ❯ version: No version specified. Consider adding a version following semver (e.g., "1.0.0")

Validating hooks: <worktree>\tools\mods\spatial-guardian\hooks\hooks.json

  ❯ ./register.js hooks: tool.call, tool.call{tool=Bash}, tool.call{tool=PowerShell}, tool.call{tool=Write}, tool.call{tool=Edit}, tool.call{tool=NotebookEdit}
  ❯ ./register.js calls: $.agent.list (via g6Refusal), $.fs.read (via g3Refuses), $.fs.stat (via place), $.process.run, $.session.messages (via g6Refusal), $.session.usage (via contextFill)

✔ Validation passed with warnings
```

`validate tools/mods/spatial-guardian --json`:

```json
{
  "success": true,
  "strict": false,
  "target": "<worktree>\\tools\\mods\\spatial-guardian\\.claude-plugin\\plugin.json",
  "manifest": {
    "file": "<worktree>\\tools\\mods\\spatial-guardian\\.claude-plugin\\plugin.json",
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
      "file": "<worktree>\\tools\\mods\\spatial-guardian\\hooks\\hooks.json",
      "type": "hooks",
      "errors": [],
      "warnings": [],
      "notes": [
        "./register.js hooks: tool.call, tool.call{tool=Bash}, tool.call{tool=PowerShell}, tool.call{tool=Write}, tool.call{tool=Edit}, tool.call{tool=NotebookEdit}",
        "./register.js calls: $.agent.list (via g6Refusal), $.fs.read (via g3Refuses), $.fs.stat (via place), $.process.run, $.session.messages (via g6Refusal), $.session.usage (via contextFill)"
      ]
    }
  ]
}
```

`validate tools/mods`, text:

```text
Validating marketplace manifest: <worktree>\tools\mods\.claude-plugin\marketplace.json

⚠ Found 1 warning:

  ❯ plugins[0] plugin.json → version: No version specified. Consider adding a version following semver (e.g., "1.0.0")

✔ Validation passed with warnings
```

`validate tools/mods --json`:

```json
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
      }
    ],
    "notes": []
  },
  "contents": []
}
```

The hooks line and the calls line are identical to the unchanged head's at 2.1.289 (worker report 2), including every `(via …)` annotation, so there is no I3 and no class 2 annotation difference.

## Mutations, each observed by applying it to 71db3d7d's `register.js`, running `timeout 300 claude plugin test tools/mods/spatial-guardian`, recording the failures by name, and reverting with `git checkout`

Observation commit 71db3d7d6327a6c688005aff8667e3b7f123984c. `claude --version` 2.1.289 (Claude Code) before and during the round. Each run was 39 tests: the count shown is passed/failed. Every run exited 1. `git status --porcelain` was empty after every revert, and was empty at the end of the set. A `verify-mutation` run was not used as an observation. The runner was a script that applies the one-string replacement, runs the plugin test, and reverts in a `finally`.

| Test | Mutation applied | Result | Tests that failed |
|---|---|---|---|
| T1 | the `/^-[A-Za-z0-9]*[fd]/` cluster line deleted from `pushArgumentsRefuse` | 37/2 | T1; T38 |
| T2 | `--force-with-lease` matched bare only | 38/1 | T2 |
| T3 | the `+` refspec line deleted | 37/2 | T3; T38 |
| T4 | the `--mirror` line deleted | 38/1 | T4 |
| T5 | the `:` refspec line deleted | 38/1 | T5 |
| T6 | the `pushRefused(token.value, depth + 1)` line deleted from `readingRefuses` | 37/2 | T6; T37 |
| T7 | the `text.includes('push')` line deleted | 38/1 | T7 |
| T8 | `readingRefuses` iterating `[command]` in place of `splitSegments(command, atGroups)` | 37/2 | T8; T37 |
| T9 | the PowerShell registration line deleted from `register()` | 35/4 | T9; T37; T40; T41 |
| T22 | zero REPORT PATH matches read as no refusal in `g6Refusal` | 37/2 | T22; T40 |
| T23 | `g6Refusal`'s report-only type check dropped (the unlisted-row check kept) | 37/2 | T23; T40 |
| T37 | `pushRefused` returning the first reading only | 38/1 | T37 |
| T38 | `pushRefused` returning the second reading only | 38/1 | T38 |
| T39 | in `readingRefuses`, `segmentPushRefused(tokens)` replaced by a git-then-push test with no argument check when `atGroups` | 36/3 | T8; T9; T39 |
| T40 | the PowerShell hook set back to `refuseForcePush` | 38/1 | T40 |
| T41 | the `agentId` condition in `guardPowerShell` replaced by `if (true)` | 36/3 | T9; T37; T41 |

Test names are those of the form's §4 and Amendments 2 and 4; the comments carry the full strings. Predictions met: T22's and T23's mutations also fail T40 (Amendment 4, §4); T41's mutation fails by the unanswered `agent.list` throwing into the catch. T39's mutation also fails T8's and T9's tests because the second reading then refuses an ordinary push in the main loop's plain commands.

The other mutation comments (T10 to T21, T24 to T36) keep their 54eba872 observations at 2.1.288 and were not edited (Amendment 4, Part C). T35's M35a, M35b and T36's M36 were not re-observed: they live in the node suite and this round changes nothing they read.

## §7's count at the head, by §7's own command

Command: `git diff --numstat <base>..<head> -- . ':!tools/mods/GUARDIAN-V0-PREREGISTRATION.md' ':!PLAN.yaml' ':!CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**'`, with `<base>` = `git merge-base origin/main HEAD` = 12478535f99e2b196df2566d4faa7d5e4bf132c8 (origin/main after a `git fetch`; it is the tip of origin/main) and `<head>` = 946454d26c58369c8a80b2a74a53cb08b8bb5e7c.

| Insertions | Deletions | Total | Files |
|---|---|---|---|
| 1698 | 0 | **1698** | 10 |

By file: governance-ci.yml 2; the parity test 347; marketplace.json 14; plugin.json 7; .gitignore 1; README 80; continuity.mjs 62; hooks.json 3; register.js 464; the plugin test file 718. The file count is at the ceiling of 10, and every file is on §7's list.

The figure is **48 over the 1650 ceiling**. The architect predicted about 1717, so it is under the prediction. At 71db3d7d, the code-and-tests commit, the same command gives 1683 over 10 files. I wrote no amendment: the custodian records class 8, and §7's size line is not edited.

## Self-check against the four failure classes, and the §8 items

- **Cross-module interface.** Nothing crosses a module boundary: the one seam is register.js to the mod API, whose shape the existing hooks already use. `guardPowerShell` calls `g6Refusal` with its existing signature, and `g6Refusal` is unchanged. Proven from the real shape by `claude plugin test`, which runs the engine's dispatch and `.catch` path. Caller grep: `guardPowerShell` has one caller, `register()`'s PowerShell registration; `readingRefuses` has one, `pushRefused`.
- **Completion claims point to evidence that exists.** Every "pass" above is the output pasted here; every mutation row is the runner's output at 71db3d7d; the comments name that commit.
- **User-facing messages describe implemented behaviour.** No reason string changed. The README's statements were each written against the code at the head (the second reading, the PowerShell route, the 4096-row window of Amendment 1 (P0b), item (iii), and `g6Refusal`'s first-row read, the ENOENT test in `isEnoent`).
- **Tests reach their assertion.** T37 asserts the deny reason on every F30 spelling (five Bash, two PowerShell). T38 asserts the deny on every F31 spelling. T39 asserts `next(e)` received the unchanged input for every F32 call. T40 asserts the three G6 refusals, the two `next(e)` passes and the G1 refusal, each against the engine tool's reach count. T41 asserts a pass with no stat, no process call and no unanswered `$` call, then a G1 refusal. Each fails under its mutation, by name, above.
- **§8 items 19 to 21 (Amendment 2):** the first reading is not removed, narrowed or reordered (it runs first, with the splitter's default); the second reading's boundaries apply only outside quotes and after no backslash (the splitter's quote and backslash branches run before the new branch); every G1 change is inside G1's section and `register.js`, with no new hook, call, option, export or §7 value.
- **§8 items 22 to 24 (Amendment 4):** no G2, G3 or G4 code on a shell registration, and no G6 check that reads a command (`g6Refusal` is called with `undefined` as its target and never sees `e.command`); no `$` call when `agentId` is unset (T41); `g6Refusal`, `refuseForcePush`, the Bash registration and the Write, Edit and NotebookEdit guard are unchanged; no new reason, hook, call, option, export or §7 value.
- **Invalidators:** I1 to I11 did not fire. I2: `claude --version` read 2.1.289 at every run of record (the build of record by Amendment 4, Part C).
- Model I observe myself running as: Sonnet 5.5 (claude-sonnet-5-5), the worker-high variant; the override reason is the dispatch's. Context handoff received: none beyond the brief. No local token figure at hand.

## The README (R1 to R10), what each landed as, in the README's own sections

- R1: the G1 row names the two readings.
- R2: the may-not-claim list adds brace expansion, variable expansion, `eval` of a variable, and PowerShell's backtick escape and line continuation, and says G1 reads every command by bash-shaped rules.
- R3: a bullet on G1's over-refusals: never-run text (a commit message, an `echo` string even single-quoted, a heredoc body line, a shell comment), the bare and the wrapped spellings, a long-option abbreviation, and the advice to write record text with the Write tool.
- R4: the REPORT PATH section says G6 reads the first of the newest 4096 rows, so a long lead-data run loses its line and every write is refused.
- R5: the case-alias bullet already in the README is kept, unedited.
- R6: a bullet saying a new-file Write passes only when the engine's missing-path rejection names ENOENT, otherwise every such Write is refused, until E4.
- R7: a new section, the shell route, with Part A's answer (PowerShell), what is established at 2.1.288 and at 2.1.289, and what is not established at 2.1.289.
- R8: the G6 row names the PowerShell route.
- R9: the Bash-and-PowerShell writes bullet now states the shell-write limit as the form's §2.10 now reads, and that there is no live G6 shell probe.
- R10: the build lines now name 2.1.289 for the tested behaviour and 2.1.288 for the type reads (the opening paragraph and the last may-not-claim bullet).

## Noticed, not done

- `register.js`'s file-header comment still describes G6 as a write guard only. It sits outside G1's section and outside the scope's named edits, so it is unchanged; the README and the new function's comment carry the PowerShell route.
- The brief asked for no `verify-mutation` run, and I made none; the form's §4 sentence on whether its scan covers `tools/mods/**/*.test.ts` is therefore not answered here.
- My first draft of the T40 and T41 tests lost two doubled backslashes to the Bash tool's quoting and failed to load (a syntax error at `claude plugin test`); I fixed it before any commit. No committed file was affected.
- Branch CI was not read: it needs the pushed head to run, and the brief did not list it for this round.

## Open: the mid-round scope addition (Amendment 5, R11) was NOT done

A message from the coordinator arrived after the README commit and the push. It asked me to append Amendment 5 to the form, byte-exact from a scratchpad file, as its own commit, and then to add README item R11 (tag `node:guardian-v0@g5`). I read the file (it is a class 9 amendment, no code, test or mutation, README 4 lines, §8 item 25). My one `cat <file> >> <form>` command was denied by the permission system, with the reason given as instruction poisoning. I checked afterwards: the form is unchanged, nothing was appended, and the worktree is clean. I did not retry it, split it, or reach the same outcome another way, because the denial applies to the outcome. Consequences:
- no Amendment 5 commit exists, and R11 is not in the README (writing R11 before its amendment would break the order the coordinator set);
- the report above is therefore at tag g4's scope, with R1 to R10 landed.
What the custodian can do: append the amendment itself (it holds the file), or tell me by a message the permission system will accept, then dispatch a short follow-up for R11 in a further commit. The amendment's text was read only; I wrote none of it.

## Exact state left

`<worktree>`: branch `cut/guardian-v0` at 946454d26c58369c8a80b2a74a53cb08b8bb5e7c, pushed, `git status --porcelain` empty. Scratch files (the mutation runner and its outputs) are in the session scratchpad outside the repository. This report is the one write outside the worktree.
