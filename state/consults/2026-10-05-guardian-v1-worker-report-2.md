*Custodian's filing note (2026-10-05): `guardian-v1`'s resumed build worker (worker-high), report 2, on the custodian's brief of 19:45Z under Amendment 6. On the human's first typed fragment (20:16:33Z) the custodian stopped the worker at 20:16:53Z, before the full direction arrived, so it reached no hand-back by itself. At 20:18:46Z the custodian asked it, by message, to make no further change and to report what exists. This is that report, extracted by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 58fa0902bc3a9494f0840ed0056686966a258d22867d443d24f02351489126db. Its commit 5a9eb051 was pushed to `cut/guardian-v1` on origin on the human's clarification and confirmed there. The harness flagged the hand-back as matching an instruction-shaped pattern (a settings-file name), and the custodian reads it as a report. guardian-v1 is parked; this report is filed and not recorded as a form amendment, so the form's records stay as they are.*

---

# Guardian v1 — worker report 2 (stopped: parked by the human) against Claude Code 2.1.289

STOPPED at the coordinator's message. After it I made no change of any kind (read-only git and scratch reads only). The one background mutation run (obs1) was already running at that moment. It finished by itself, restored register.js, and the worktree is clean at 5a9eb051 (checked, `git status --porcelain` empty; register.js equals the committed copy).

## 1. Step 1 (Amendment 6, Part C): base check
- `claude --version`: `2.1.289 (Claude Code)`, exit 0.
- `claude plugin test tools/mods/spatial-guardian` on the unchanged base ccac14d2: 39 pass, 0 fail, exit 0 (v0's 39). Neither I2 nor I15 fired.

## 2. Step 2 (Amendment 4, Part B): `timeout 60 claude --help`
- Exit 0. Saved at `<scratchpad>/guardian-v1-build2/claude-help.txt`, sha256 a58ca2282c01312250fc8d861088dae6e46340ad55346557fcdbc0053f415367. `cmp` against the first build's file: identical.
- Top-level commands (from my run): agents, attach, auth, auto-mode, doctor, gateway, import, install, logs, mcp, plugin|plugins, purge, respawn, rm, setup-token, stop|kill, ultrareview, update|upgrade.
- README list (not read by any rule): agents, attach, auth, auto-mode, gateway, import, install, purge, respawn, rm, setup-token, stop (kill), ultrareview, update (upgrade). Read-only by their help lines: doctor, logs. It matches the first build's reading.

## 3. P0d (Amendment 6, A.6), read-only, ran in full before any code
- Scratch: P0c's engine and rules copied to `<scratchpad>/guardian-v1-build2/p0d/`, with (ii) added. Only `tokenise` gained a returned `openAt`, and G1 gained the (ii) test. `drafted.mjs` sha256 4c6130c8…0218, `p0d.mjs` 7bd3d21e…2dc1, output `p0d-out.txt` 42b09f2d…d681. Node over text only; nothing is an observation.
- **(a) F36, raw and redacted** (raw from the transcripts, scratch only): all six pass G1 v1+(ii) (v0 refuses each). I7 not fired.
- **(b) Replay over the 24740 calls** (P0c's `calls.jsonl`, sha256 c20c9dbb…6ee48):
  - Scratch G1 v0: 247 total, 173 since 09-27, id set equal to P0c's.
  - Scratch G1 v1 without (ii): 48 total, 40 since, id set equal to P0c's.
  - G1 v1 with (ii): 48 total, 40 since. 0 newly refused; 0 dropped; 0 in v1+(ii) that v0 allows; 0 throws.
  - By agent since 09-27: main 18, reviewer 10, worker 7, worker-high 5.
  - #2, #4, #5, #6 pass, so I14 not fired. I8 not fired: no main-loop row newly refused. No class 2 rows.
- **(c) Rows:** F37 (3), F38 (6, Part I's included), F39 (levels 1 and 4 allowed, 5 to 7 refused), F63 (2), the 27 v0 refusal rows and 7 v0 allowed rows: all as §3 predicts, 0 misses. F62: three rows as predicted. **One row differs, see deviation 1.**

## 4. F36 check (Amendment 1, item 4)
Re-extracted by script (`extract-f36.mjs`, a copy that also writes the raw strings). Each redacted command's sha256 equals P0b's table; `ALL SIX MATCH`; `f36.json` is byte-identical to the first build's (sha256 16a87944…c73):
c9f94404…56e3, 2369f91a…0c9fd, 6fcb389a…da06, 3c39fcb2…c910, 5fe9003e…e751, 3f077a2a…049d. No profile or user-name text remains in any redacted command or in the committed files (Grep: none).

## 5. Commits beyond ccac14d2 on `cut/guardian-v1`: one
**5a9eb051** `feat: guardian v1 code, tests and README (…; mutation observations follow)`, signed off, with the two trailer lines. Three files only; §7's command against merge base ccac14d2 gives:

| File | Changed lines |
|---|---|
| `tools/mods/spatial-guardian/hooks/register.js` | 683+/83-, 766 |
| `tools/mods/spatial-guardian/test/guardian.test.ts` | 794+/1-, 795 |
| `tools/mods/spatial-guardian/README.md` | 66+/18-, 84 |
| Total | 1645, over 3 files, over the 1300 ceiling (class 8, recorded by the custodian; not cut) |

This is before any observation lines, which would have added more.
- **register.js:**
  - G1: (ii) `pushBeforeOpenQuote`, `tokenise` returns `openAt`.
  - Shared reader with Amendment 2's restarts, in ascending order.
  - G7 with the gh api merge path; G8 command side (aliases and OPEN-6 verbs), path side and `.claude.json`; G9 with containers, data folders and globs.
  - The repository check (Part C) after a G7 or G9 candidate.
  - The in-hook try with a constant catch verdict, and the refusal log (one new file per refusal).
  - Calls: `$.env.get('USERPROFILE')` only; `$.fs.write` only in `logRefusal`.
- **guardian.test.ts:**
  - `arm` answers `env.get` by default and `World` gains `env` (Part B); header sentence added. No v0 assertion, fixture string or name was changed.
  - T42 to T72 added, each with its mutation described and an `OBSERVATION-Tnn` marker still unresolved.
  - The F36 literals are inlined, with an in-test sha256 check.
- **README.md:** R-a to R-j, Amendment 4's A.5 line, Part B's top-level list naming 2.1.289, Amendment 6's A.4 over-refusal, Part I's G1 line, Part C's reach, Part D to F limits, and the log section.
- **Plugin test at 5a9eb051 (uncommitted tree before commit, same bytes):** 70 pass, 0 fail (39 v0 + 31 new), exit 0, 2.1.289. The v0 T7 passes unchanged through (ii).
- **validate** (text only, on the first draft and on this code): `tools/mods/spatial-guardian` exit 0 with the one `version` warning. Hooks line unchanged. Calls line is §5's prediction except `(via …)` annotations (class 2): `$.agent.list (via agentKind, g6Refusal)` and `$.fs.stat (via isThisRepository, makeG9Rule, place, userClaudeFolder)`. Env reads: `USERPROFILE` alone. `--json` and `tools/mods` were not run.

## 6. Mutation observations made
- **Dry run before the commit** (`<scratchpad>/guardian-v1-build2/mut-results-dry1.json`; version 2.1.289; code equal to 5a9eb051; observed on the uncommitted tree, so not a commit observation): every one of the 71 mutations (T42 to T72, the shared in-hook-catch mutation, and the 36 other v0 re-observations T1 to T34 and T37 to T41 without T16, T24, T25) failed at least one test. For all 31 new tests the test's own test is among the failing ones.
- **Observation run at 5a9eb051** (obs1; version 2.1.289), completed only for **T42 to T52**, each failing at least its own test:
  - T42 (3 failing), T43 (2), T44 (1), T45 (1), T46 (1), T47 (1), T48 (2), T49 (2), T50 (1), T51 (1), T52 (2). The names are in `mut-results-obs1.json` and `mut-out/obs1-*.txt`.
  - From T53 on, every run exited `3221225794` with no output (the run died when the stop came). **Void.**
- **Nothing is recorded in any commit:** no `RECORDED MUTATION` comment holds an observation, and the v0 re-observation lines were never appended. Each new test still carries an `OBSERVATION-Tnn` placeholder. A verify-mutation run would therefore not be clean, and none was run.

## 7. Not done
- Steps 8 (mutation observations recorded), 9 (validate `--json`, and `tools/mods`), 10 (§7 recount at a final head) and 11 (all suites: node --test, verify-plan, verify-cites, verify-quotes, verify-test-claims, verify-mutation).
- T35 and T36 were not run.

## 8. Uncommitted in the worktree
Nothing. `git status --porcelain` is empty at 5a9eb051. Scratch (outside the repo): `<scratchpad>/guardian-v1-build2/` holds `tests-v1.ts`, `mutations.mjs`, `mut-run.mjs`, `apply-observations.mjs`, `assemble-tests.mjs`, the P0d files, the msg file, and the result and output files.

## 9. Deviations from the form, one line each
1. **F62 row 2 (class 2):**
   - As §3 prints it, `bash -c "git push 'origin"` has no closing quote. A.1 and A.2 allow it: its open quote is the outer `"`, which begins before the push, so P0d allowed it.
   - I used the closed form `bash -c "git push 'origin"` (T71's name says "inside a quoted command string"), and it is refused through the rescan.
   - The form's literal text and its A.2 disagree, and the architect should settle which is meant.
2. **Reading of "cached on success":** a session in no repository is not cached; only a found repository is. This lets T61 cover all three F52 conditions in one test (no repository, then a stat that cannot complete, then ENOENT).
3. **`validate` annotations** differ from §5's lines (class 2, above).
4. **§7:** 1645 lines against 1300 at 5a9eb051 (class 8, for the custodian).
5. **T58's mutation** (log write outside its own try) fails 39 tests, since many refusals have no write answer. The comment would carry the target test by name plus a count.
6. The v1 tests register `fs.stat`, `session.repo` and `fs.write` answers in new helpers beside `arm`. `arm` itself changed only by Part B's `env`.
7. **Test-kit fact:** the engine hands the log write's path to a test's `fs.write` handler with `\` separators, so T56 reads the path with `/`. The plugin writes `/` paths.

## 10. Commands I ran that touched git state (all exit 0)
- `git --no-optional-locks status --porcelain` (several, also in the observer harness)
- `git --no-optional-locks log --oneline -1` and `-2`
- `git --no-optional-locks -C C:/dev/spatial-ide show origin/main:tools/mods/GUARDIAN-V1-PREREGISTRATION.md | wc -lc`
- `git --no-optional-locks merge-base`
- `git --no-optional-locks diff --numstat` (also `--stat`)
- `git --no-optional-locks show --stat`
- `git --no-optional-locks rev-parse --short=8 HEAD` (inside the observer)
- `git --no-optional-locks add` of the three files
- `git commit -s -F <scratchpad>/guardian-v1-build2/msg-commit1.txt`, giving 5a9eb051

No publish, merge, rebase, pull, clean, amend or recursive delete. No `claude` verb beyond `--version`, `--help`, `plugin test` and `plugin validate`. None of G7, G8 or G9's targets was run. Nothing was written under `<claude-home>`, in the main checkout, in another worktree, or under `C:/dev/spatial-ide-local/`. The main checkout's `tools/mods/spatial-guardian/` was only read.

Model observed: Sonnet 5.5 (`claude-sonnet-5-5`), no override, no context handoff.

**Result:** the code, tests and README are built and committed at 5a9eb051 (70 of 70 plugin tests pass, P0d clean except F62 row 2's text). The mutation observations are not recorded: T42 to T52 are observed in scratch, the rest are void, and the build does not resume.
