*Custodian's filing note (2026-10-12): the worker-high's report on guardian-v1's resume (P0e, the merge of main, Part A and the observations), branch cut/guardian-v1 at 2548968ad110f664faaf63592597242c1db313ee, the run 2026-10-12T05:16:51Z to 2026-10-12T05:44:50Z by its transcript (Read 21, Bash 90, Write 8, Edit 17, Monitor 1, Grep 1). It arrived as a message and is extracted here by script from the SubagentHandback call in its transcript. One change: the scratchpad's absolute path, which held a local profile path, is replaced by the bracketed placeholder in the section on the merge; one final newline is added; nothing else is changed. The message's sha256 as handed back is 143194235440b1aa31c25b47c077aa25538d9170eb96239982cd56d92237d8fb; this file's, from line 5 to the end, is 2acc6f20b2f0822622c9c8c6d906203912ad02d03c97aa8aff3ae56d4ddd2e82.*

---

guardian-v1 resume: DONE to Part F. No invalidator fired. Head 2548968ad110f664faaf63592597242c1db313ee, pushed to origin/cut/guardian-v1 with plain pushes. No PR, no rebase, no force-push. The start was as briefed: head 5a9eb051 on origin, porcelain empty. The final porcelain is empty. Nothing was written in C:/dev/spatial-ide, and no plugin was installed, enabled or reloaded. Model observed: Sonnet 5.5, no override, no context handoff.

**Commits on top of 5a9eb051 (all `git commit -s`, with the trailer)**
1. 83044167, the merge of main at 2ca3a53c (two parents; no squash).
2. e5afe5e6, Part A: G8 covers the main checkout's `.claude/settings.local.json`, plus T73 to T75. This is the observation commit.
3. 2548968a, the recorded observations. It changes comment lines of `guardian.test.ts` only, so its code equals e5afe5e6's code.

**P0e (read-only, before the merge)**
- (a) The build of record is `claude --version` = 2.1.296 (Claude Code). Under Amendment 8 item 3 it is the build for the whole piece.
  - Output sha256s:

    | Output | sha256 |
    |---|---|
    | version | ced06c95bb4c0780504b700880ceea37cd764283d2be9d3ea2555683183207ea |
    | `timeout 60 claude --help` | 550db4f88ae1d97bf7244ca96dc89554aabd3978241ceb69f79001e816c35f09 |
    | plugin | afc319633b0e4fbbafbb4160e4b120bd459e2073bd30f4f6182d4a1faaf7172a |
    | marketplace | e2c4fe9eb214da5b8136bcd09717609beef572de3b7b84f7492aceeeaee12894 |
    | mcp | 7119050de7984dc9d616f6b632fa3ee7fef92667eb5298ba57c73051e59cad46 |

  - All five commands exited 0.
  - Set against P0b (ii) and report 2 §2: verb and alias sets are identical, so I16 did not fire.
    - plugin|plugins: configure, details, disable, enable, eval, init|new, install|i, list, marketplace, prune|autoremove, tag, test, uninstall|remove, update, validate.
    - marketplace: add, list, remove|rm, update.
    - mcp: add, add-from-claude-desktop, add-json, get, list, login, logout, remove, reset-project-choices, serve.
  - The top-level command list is the same as report 2 §2. Against the 2.1.289 help file (sha256 a58ca228…5367), the only differences are three hunks: `attach <id|name>`, `logs <id|name>`, and one added clause on attach.
- (b) `claude plugin test tools/mods/spatial-guardian` at 5a9eb051: 70 pass, 0 fail, exit 0. I15 did not fire.
- (c) Replay of tool writes: 5853 Write, Edit and NotebookEdit calls from 2026-09-20 to 2026-10-12T05:18:37Z, over 799 transcript files. Rows whose normalised path ends in `/.claude/settings.local.json`: 0 (0 to the main checkout's L, so A.10's second invalidator did not fire).
  - Control: the same scan with the suffix swapped for `.claude/` finds 438 rows, so the extractor works.
  - Nothing was recorded beyond the counts.

**The merge (Part C)**
- Conflicts were in exactly three files, as foreseen. continuity.mjs merged clean, and so did the N1 section and `N1_BAND`.
  - `register.js`, 1 hunk, the header: v1's lines with main's N1 entry byte for byte. I kept v1's G5 line.
  - `guardian.test.ts`, 2 hunks:
    - `World` and `arm`: main's lines plus Part B's `env` field. `arm`'s default `env.get` answer merged on its own.
    - End of file: main's B section and its re-observation block first, then a divider, then v1's section.
  - `README.md`, 3 hunks:
    - G7 to G9 rows from v1, N1 row from main.
    - Limits: v1's installed-copy bullet, and the build bullet reading 2.1.296 with main's N1 clause plus v1's macOS and Linux.
    - Turning it off: main's text, verbatim.
  - Line 5 and the top-level verb list name 2.1.296. The v1 user-scope sentence was dropped, because the Install section took main's local-scope text.
- C.3 check, by diff against 2ca3a53c:
  - 0 diff lines in continuity.mjs.
  - No hunk touches main's N1 section (old lines 421 to 487) or main's B tests (`guardian.test.ts` hunks begin at old lines 6, 39, 66 and 831).
  - In Install and Turning it off, one sentence changed (v1's "G8 refuses these commands to every agent"). Turning it off is main's text.
- C.5, at the merged tree before the merge commit: `claude plugin test` gives 73 pass, 0 fail, exit 0 (v1's 70 plus B-T1, B-T2 and B-T4). `validate` exits 0. The hooks line, the calls line and `env reads: USERPROFILE` match report 2 §5. I17 did not fire.
- C.6: the script re-derived all 49 pins into the three files.
  - The sha256 verifies at the pin's own commit for 49 of 49.
  - At the merged main commit, as predicted:
    - Every `register.js` pin keeps its lines and bytes, except the registrations (457-464 @ 5c06b0c2), found at 488.
    - Pins 29-40 and 49-96 (@ 2d4fa886) keep their lines with changed bytes.
    - Every other test and README pin keeps its lines and bytes.
  - At the merge commit, v1's by-design changes read as changed. Spans that moved:

    | Span | Pin | Merge-commit line |
    |---|---|---|
    | register.js 60-63 | 5c06b0c2 | 87 |
    | register.js 168-193 | 5c06b0c2 | 217 |
    | register.js 272-280 | 5c06b0c2 | 504 |
    | register.js 189-190 | 3c802bcc | 238 |
    | register.js 15 | e7bc3718 | 24 |
    | register.js 23 | e7bc3718 | 32 |
    | register.js 251-281 | e7bc3718 | 483 |
    | register.js 284-286 | e7bc3718 | 516 |
    | register.js 420-486 | e7bc3718 | 1018 |
    | README 26 | cd539e79 | 58 |
    | guardian.test.ts 176-182 | 2d4fa886 | 183 |
    | guardian.test.ts 554-571 | 5c06b0c2 | 561 |
    | guardian.test.ts 739-831 | e7bc3718 | 746 |
    | guardian.test.ts 769-773 | e7bc3718 | 776 |

    guardian.test.ts 3-5 @ 2d4fa886 stays at line 3.
  - Evidence only, not a record. The table is `scratchpad/p0e/pins.out` under the session scratchpad ([a profile path, removed by the custodian]).

**Changes, by file (Part A and the observations)**
- `tools/mods/spatial-guardian/hooks/register.js`:
  - The new function `g8LocalSettingsRefuses` follows A.2.
  - A candidate is a call whose placed path, or whose path as received (normalised, with a `/` in front), ends in `/.claude/settings.local.json`.
  - It uses `mainTree` and `place`, and refuses on equality of the two placed paths.
  - An L that cannot be placed is refused. No repository lets the call pass. A rejected lookup reaches the catch.
  - It is called once, from `decideWrite`, directly after `g8PathRefuses`. The header comment is updated.
  - No new hook, call, env name or reason. `validate` is identical to the merged head's (diffed).
  - Caller grep: `register.js:1020` is the only caller.
  - Seam: it uses only `session.repo` and `fs.stat`, which the mod already uses, and the tests answer them through the existing `answerRepo` and `answerStat` helpers.
- `tools/mods/spatial-guardian/test/guardian.test.ts`:
  - T73, T74 and T75 are added at the end, with F64 to F66 as A.4 states them.
  - The 34 `OBSERVATION-Tnn` placeholders are replaced, 45 v1 lines are appended, and no placeholder remains.
  - Outside the tests, the diff against e5afe5e6 is comment lines only.
- `tools/mods/spatial-guardian/README.md`:
  - A.8: G8's row gains L, and its allowed list now reads "the repository's other `.claude` files".
  - G8 limits gain the four entries.
  - The kept over-refusal covers a permission change in L.
  - Install gains one sentence.

**Each test with its mutation and observed failure (observation commit e5afe5e6, `claude --version` 2.1.296)**
- The runner script applied each mutation, ran `claude plugin test`, and reverted. I read each failing list, and every mutation failed at least its own test. 80 mutated runs, each exiting 1 as expected, and the tree was clean after the run. Results: `scratchpad/obs/results-obs.json` and `scratchpad/obs/out-obs/` under the session scratchpad. They are recorded in the test file as lines saying "Re-observed at e5afe5e6 (guardian v1) …", with the failing tests by name.
- New tests, other failing tests beside the test's own:
  - T42 (+2)
  - T43 (+1)
  - T44 to T47: own only
  - T48 (+1)
  - T49 (+1)
  - T50 (+2: T74, T75)
  - T51: own only
  - T52 (+1)
  - T53 (+1)
  - T54 (+1)
  - T55: own only
  - T56: own only
  - T57 (+3)
  - T58 (+40: its line names its own test and counts the others)
  - T59: own only
  - T60 (+1)
  - T61 to T66: own only
  - T67 (+2)
  - T68: own only
  - T69 (+3)
  - T70: own only
  - T71: own only
  - T72 (+1)
- T73, T74 and T75:
  - T73 mutation: the candidate test reads the placed path only. Fails T73 alone.
  - T74 mutation: the suffix alone decides (L's comparison dropped). Fails T74 alone.
  - T75 mutation: a rejected lookup is read as no repository. Fails T75 alone.
- Shared in-hook-catch mutation: fails T16, T24 and T25 among 6 failures (T54, T56 and T75 are the other three).
- v0 re-observed: T1 to T15, T17 to T23, T26 to T34 (with T28 as B-T3 and T29 as B-T5), T37 to T41.
- B-T3: M3a, M3b and M3c each fail the B-T3 test alone.
- B-T5: the v0 mutation fails 3 tests; M5a and M5b each fail the B-T5 test alone.
- B-T1 and B-T4: M1a and M1b each fail 2; M4a and M4b each fail 1. B-T2's M2 fails 1.
- T35 and T36: run unchanged by `node --test`, named in the output, passing.
- T26 and T27 carry a v1 line under their v0 record, and a second under main's separate "re-observed" record.

**Runs and exit codes**
- All of these exited 0: `git fetch`, `claude --version`, `--help`, `plugin --help`, `plugin marketplace --help`, `mcp --help`, the replay and pin scripts, and the pushes.
- `claude plugin test`:
  - at 5a9eb051: 70 pass
  - on the merged tree: 73 pass
  - after Part A: 76 pass
  - at 2548968a: 76 pass, 0 fail
  - Exit 0 in each case. Before it passed, one run failed on my own T74 row order; I fixed the test, not the code (see "Not done as written").
- `claude plugin validate`: `tools/mods/spatial-guardian` and `tools/mods`, each as text and `--json`, all rc 0.
  - Output is only the one version warning on the plugin and two on the marketplace.
  - The guardian text output was diffed unchanged from the merged head.
- Governance scripts at 2548968a, all rc 0:

  | Script | Result |
  |---|---|
  | verify | `verify:plan PASS` |
  | verify-cites | PASS |
  | verify-quotes | PASS |
  | verify-test-claims | PASS (545 claimed tests exist) |

- Also rc 0: `verify-quotes --show-cites` on the three changed files (nothing to check in them).
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"` ran inside a granted shared hold: 457 pass, 0 fail, T35 and T36 named. The hold was granted and released; the script returned no 96 to 99 code. The output file records pass/fail counts but not the exit code, and the tool flagged no failure.
- The 80-run mutation battery ran with no hold. Each run is a serial single process of about 5 to 8 seconds, which I judged under the heavy threshold.

**Size against Part F (§7's command, base 2ca3a53c, head 2548968a)**
- README 66 insertions + 18 deletions = 84.
- register.js 700 + 83 = 783.
- guardian.test.ts 1089 + 1 = 1090.
- Total 1957 changed lines over 3 files (I5 holds), against the 1300 ceiling: over by 657, so class 8 at the gated head. Part F estimated about 1850; actual is about 107 more, almost all in the test file.

**Not done as written, or to flag**
- The build is 2.1.296, not 2.1.289 or 2.1.291. This follows Part B and Amendment 8 item 3. The README names 2.1.296 on line 5, in the limits bullet and in the top-level verb list.
- A.8's Install sentence ("G8 refuses an agent's tool write to that file") is in the Part A commit, not the merge commit, because it would have been false at the merge commit. C.3's check allows it.
- F65's no-repository row runs first in T74. A found repository is cached for the load, so a later "no repository" row could not be tested.
- T75's rows run in the order (b), (a), (c) (the form lists (a), (b), (c)). A repository found earlier is cached, which would hide a lookup made for a non-candidate. The assertions are those of F66.
- The mutations were applied, run and reverted by a script in my scratchpad. I read every failing list. No `verify-mutation` run is claimed as an observation, and I ran none.
- The README (log section, line 50) says the log folder sits "beside the Recorder's `-local/evidence` folder". The form's §2.7 says the same. This describes a location only. No form row, test or E-row assumes the Recorder is installed or running, so I did not treat it as an invalidator and left the wording unchanged. You may want to judge the README sentence given the 2026-10-11 uninstall.
- E15, the E-rows, installing, enabling and reloading were not touched (all the human's). I wrote nothing to L, to any settings file or to `state/`. PLAN.yaml and the form are untouched.
- No other model ran, so no model override applies.

**Pre-gate self-check (the four classes)**
- Cross-module code: `mainTree` and `place` are the mod's own helpers over `session.repo` and `fs.stat`. The tests answer those events in the shape the existing `answerRepo` and `answerStat` use.
- Completion claims point to evidence: the mutation results JSON and the `out-obs/` run outputs, `p0e/` (the P0e outputs and replay), `gov/` (suite outputs, validate), and `pins.out`.
- User-facing text describes behaviour implemented at this commit: the README G8 text matches `g8LocalSettingsRefuses`.
- Tests reach their assertions: each new test fails under its own mutation, and the failure is the intended assertion (the test's own name is among the failing list).

Final state: head 2548968a equals origin/cut/guardian-v1, `git status --porcelain` empty.
