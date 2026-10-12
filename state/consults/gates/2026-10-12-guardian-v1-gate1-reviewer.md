# PR #216 gate 1 — reviewer
Reviewed: cut/guardian-v1 @ 49b6a01296f2d55c53ccb12480a7127a9940a125

**Verdict: PASS.** I found no Correctness or Evidence finding. Six Documentation findings (D1 to D6) must be fixed in this PR before the merge. They get no re-gate. None of the sentences involved is the human's wording, so the worker applies my words and the PR body lists them.

Main is at 85933a085110c997d68f19ec183498ea737ad444. The form is read there; I read Amendment 9 first. Every tool claim below names the commit it ran at.

## Correctness (blocking: none)

I read the full diff, `git diff 241ba9e1...49b6a012`: 3 files, README 84, register.js 783 and guardian.test.ts 1,090 changed lines.

**§8 items 2 to 7, checked by reading at 49b6a012:**
- **Item 2, the log write.**
  - `$.fs.write` appears only in `logRefusal`: tools/mods/spatial-guardian/hooks/register.js:963 @ 49b6a012. `validate` also lists it only through logRefusal.
  - It is reached only through `refuse()` (register.js:975-978 @ 49b6a012), after the decision, from `guardShell` and `guardWrite` (:996-1004 and :1025-1033).
  - The root is `<parent>/<name>-local/guardian` (:925-930).
  - The record has exactly seven fields and no target text (:953-961).
  - Any failure is swallowed (:965-967).
- **Item 3, G1.** The only narrowing is the unbalanced-quote condition (:370-374, with §2.2 as Amendment 6 A.1 amends it). The segment check, the rescan and the depth cap are untouched (:275-281). The scan reads the whole `e.command` (`whole`, :272). There is no heredoc parser.
- **Item 4, G7 to G9.**
  - The spellings match §7 as Amendments 2 and 4 amend it. G8's lists at :445-450 equal Amendment 4, A.2 exactly.
  - Command words are read at any token (`tokens.some`).
  - The unbalanced case uses condition 1 plus restarts, not a substring test (:313-322).
  - There is no allow list, flag or option.
- **Item 5, G8.**
  - H is anchored on the resolved folder (:674-681).
  - Nothing under `<H>/projects/` is refused.
  - The only env name is `USERPROFILE` (:656).
  - L needs equality of the placed paths, not just the suffix (:690-696).
- **Item 6, G9.**
  - The base comes only from a leading `cd` chain, `git -C` or a named target folder (:738-757, :851-882).
  - An unknown base is read as M.
  - A restart's own level is read as M (:749).
  - There is no `agent.spawn` or `turn.step` hook and no process call.
- **Item 7, the catches.**
  - `next(e)` sits outside the try (:1003, :1032).
  - The catch body is the constant `CATCH_VERDICT` (:52).
  - All five gating registrations keep `.catch` (:1107-1111). `validate` confirms it.

**F64 to F66.** All rows of Amendment 7, A.4 are present: tools/mods/spatial-guardian/test/guardian.test.ts:1842-1919 @ 49b6a012. Two orders differ from the form, as Amendment 9, items 3(a) and 3(b) record: T74 runs the no-repository row first, and T75 runs (b), (a), (c). The assertions are A.4's.

**Code equality.**
- The code at e5afe5e6 equals the code at 49b6a012: `git diff --quiet e5afe5e6 49b6a012 -- tools/mods/spatial-guardian/hooks` exits 0.
- Between e5afe5e6 and 2548968a, the test file changes in comment lines only.
- The merge c4a50c3c changes nothing under tools/mods.
- `continuity.mjs`, `hooks.json`, both `.claude-plugin` folders and the Recorder are unchanged against 241ba9e1.
- In the v0 part of the test file, the only non-comment changes are Part B's `env` field and the `arm` default (guardian.test.ts:42 and :70-73 @ 49b6a012). One existing line changed: the header comment, as Part B permits. No RECORDED MUTATION line was edited (§8 item 12).

**Notes (not findings, no fix required):**
- **N-a.** In `logRefusal`, a NotebookEdit whose `notebook_path` is null or undefined falls back to hashing `e.file_path` (`?? e.file_path`, register.js:952 @ 49b6a012). §2.7 says it should log `unavailable`. Ordinary use cannot reach this, because the engine's NotebookEdit always carries `notebook_path`, and only a hash is recorded either way.
- **N-b.** For a candidate, if L's folder stat fails with an error other than ENOENT, `place` returns undefined (register.js:507-511 @ 49b6a012). The call is then refused with G8 and logged as `G8`, not as `catch` as Amendment 7, A.2's fail-closed bullet reads. The outcome is a deny either way. This is for the architect's A.2 reading.
- **N-c.** No replay has run the shipped register.js over the transcripts. P0b, P0c and P0d ran scratch copies, and §1 item 6 claims them only as such. A replay of the shipped module before the human's reload would test I8 against the code that ships. This is optional.

## Evidence (blocking: none)

**Build.** `claude --version` prints 2.1.296 (Claude Code), the build of record (Amendment 8, item 3). P0e (a) reproduced: the sha256s of `--version`, `timeout 60 claude --help`, `plugin --help`, `plugin marketplace --help` and `mcp --help` equal worker report 3's table (ced06c95…, 550db4f8…, afc31963…, e2c4fe9e…, 7119050d…).

**Plugin test and validate.**
- At 49b6a012, `claude plugin test tools/mods/spatial-guardian` gives 76 pass, 0 fail.
- `validate`, on `tools/mods/spatial-guardian` and on `tools/mods`, as text and `--json`, exits 0 four times.
  - The hooks line is byte-identical to §5's prediction.
  - The env reads line is `USERPROFILE`.
  - The calls line differs from §5 only in `(via …)` annotations. That is class 2, already recorded under Amendment 7, D.2 item 3.
  - The output equals the PR body's, apart from the worktree path.

**README's top-level verb list against `claude --help` at the head build (Amendment 4, Part B).**
- The help lists agents, attach, auth, auto-mode, doctor, gateway, import, install, logs, mcp, plugin|plugins, purge, respawn, rm, setup-token, stop|kill, ultrareview and update|upgrade.
- README.md:66 @ 49b6a012 lists every verb except mcp, plugin, doctor and logs. It names doctor and logs as read-only. The list matches.

**P0e (b).** Re-run at 5a9eb051: 70 pass, 0 fail, exit 0.

**C.5.** Re-run at the worker's merge commit 83044167: 73 pass, 0 fail. `validate` exits 0, and its hooks, calls and env lines equal the head's.

**C.6's table.** My script re-derived all 49 pins into the three files.
- 49 of 49 sha256s verify at their own commits.
- At 241ba9e1, the merged main commit:
  - every pin keeps its lines and bytes, except the registrations pin (457-464 @ 5c06b0c2), which is found at line 488;
  - the two test pins 29-40 and 49-96 @ 2d4fa886 have changed bytes.
  This is as C.6 predicted.
- At 83044167, all 14 moved spans in worker report 3's table sit at the lines it gives (for example register.js 60-63 → 87, 420-486 → 1018; guardian.test.ts 739-831 → 746, 769-773 → 776), and test 3-5 stays at line 3.

**F36 against Amendment 1's sha256s.** I parsed the six literals at guardian.test.ts:1111-1116 @ 49b6a012 independently and hashed them as UTF-8.
- All six equal the P0b report's table: c9f94404…, 2369f91a…, 6fcb389a…, 3c39fcb2…, 5fe9003e…, 3f077a2a…. Their lengths equal its redacted byte counts (422, 5317, 4291, 2579, 4671, 1581).
- The P0b report's lines 5 to the end hash to c3e12389…, the sha256 Amendment 1 names.
- No profile path is in them.

**The replay table, read against its method.**
- **P0c's table** (state/consults/2026-10-05-guardian-v1-p0c-report.md:34-40 @ 85933a08) matches A.7's method:
  - the scratch rules, with a fidelity check against P0b's id sets;
  - three runs through repeat.mjs with the same sha256;
  - A.6's rows matched by time and agent;
  - subset count 0, and no main-loop row beyond A.6.
  It is a scratch run, claimed only as such (§1 item 6).
- **P0e (c), reproduced by my own read-only scan** of this project's transcripts since 2026-09-20 (797 files, 5,977 Write, Edit and NotebookEdit calls up to my run): 0 paths end in `/.claude/settings.local.json`. As a control, 438 paths hold `/.claude/`, the worker's count. A.10's second invalidator does not fire.

**§7 by its own command.**
- `git diff --numstat 241ba9e1..49b6a012 -- . ':!tools/mods/GUARDIAN-V1-PREREGISTRATION.md' ':!PLAN.yaml' ':!CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**'` gives README 66+18, register.js 700+83 and test 1089+1: 1,957 lines over 3 files. `<base>` is 241ba9e1, the merge base.
- The overrun is recorded as class 8 (Amendment 9, item 1).
- §7's line is not edited. The form's history on main is append-only across all 9 of its commits (a8acdc46 to 85933a08); each commit's file starts with its parent's bytes.
- I5 holds.

**Mutations.** Every one of the 76 tests carries a RECORDED MUTATION with an e5afe5e6 observation and 2.1.296. No `OBSERVATION-T` placeholder remains, and the test file does not mention `verify-mutation`. My sample of 12 matches the recorded failing lists exactly (table below).

**Suites.**
- At main 85933a08, run inside a granted shared hold: `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"` gives 457 pass, 0 fail.
  - T35 is named in the output as `guardian parity: the mod's stale-block check and the Stop hook's stale-continuity check agree on every fixture`, passing.
  - T36 is named as `guardian parity: the fixture set reaches stale, fresh and not judged on the Stop hook`, passing.
- §6's tools at 49b6a012 and at 85933a08 (scripts/plan/ at each commit): verify:plan, verify-cites, verify-quotes and verify-test-claims all PASS.

**CI.** `gh pr checks 216`: all 10 checks pass, and every run is at 49b6a012 (Governance CI ×2, Ported notices ×2, Product CI shell and tauri build, DCO, exposure scan, cfg boundary ×2).

**Disclosure.** My 12 mutated runs held no shared hold. Each was one serial process of about 6 to 8 s, about 2 minutes in all, which is under the heavy threshold.

## Documentation (must fix before the merge, no re-gate; none is the human's wording)

**D1.** tools/mods/spatial-guardian/README.md:82 @ 49b6a012 labels the placement over-refusal as G1.
- Replace `G1, a Write to a new folder:` with: **Placement, a Write to a new folder:**
- Clause check:
  - the refusal is `decideWrite`'s placement step, rule `unplaceable` (register.js:1014 @ 49b6a012);
  - G1 runs only in `decideShell` (:989);
  - `place` returns undefined when the folder stat rejects (:505-511).

**D2.** README.md:3 @ 49b6a012 says the mod writes one local log file per refusal. The log section lists refusals that write none.
- Replace `It writes one local log file per refusal, outside the repository, and nothing else (see "The refusal log").` with: **It writes at most one local log file per refusal, outside the repository, and nothing else; "The refusal log" lists the refusals that write none.**
- Clause check:
  - one `$.fs.write` per `refuse()` (register.js:963 and :975-978 @ 49b6a012);
  - none on an overrun, because the registration `.catch` runs no hook code (:1107-1111);
  - none with no repository (:949-951);
  - a failed write is swallowed (:965-967);
  - the root is a sibling `<name>-local/guardian`, outside the repository (:925-930);
  - nothing else is written: `$.fs.write` is only in `logRefusal`.
- The sentence is a worker's README line. It follows the brief's §1 last bullet in substance (state/directives/MODS-V1-2026-10-05.md:12 @ 85933a08), and the brief is not edited.
- I place this under Documentation, not as a false guarantee, because the same README states the not-logged cases at README.md:53 @ 49b6a012.

**D3.** README.md:40 @ 49b6a012 says `G1 to G6 and G8 apply everywhere.` G8's L check is keyed on the session's repository.
- Replace it with: **G1 to G6 and G8 apply everywhere, except G8's check of `.claude/settings.local.json`, which guards the session's repository's main checkout and passes when the session is in no repository.**
- Clause check: `g8LocalSettingsRefuses` takes M from `mainTree`, which is `$.session.repo()`'s root (register.js:619-626 and :690-696 @ 49b6a012), and returns false when it is null (:693).

**D4.** README.md:96 @ 49b6a012 says `G8 refuses these commands to every agent.` Steps 3 and 4 are slash commands in a session, not tool calls.
- Replace it with: **G8 refuses the commands of steps 1 and 2 to every agent.**
- Clause check: `claude plugin marketplace add` and `claude plugin install` are refused by G8's segment check (group word `plugin`, then `add` or `install`; register.js:445-464 @ 49b6a012).

**D5.** The PR body lacks two items the form requires:
- P0c's table (Amendment 2, Part K, its §9 PR-body bullet);
- `claude --help`'s output with `claude --version` (Amendment 4, Part B, its §9 bullet).

Add both: the table from the P0c report's section (b), and the 2.1.296 help output, which hashes to 550db4f8….

**D6.** In the PR body's replay table, the control row reads `control: suffix `.claude/``. A tool write's path never ends in `/`.
- Replace it with: **control: path holds `/.claude/`**
- Check: my scan with that test gives 438, the PR body's count.

## Commands and exit codes

| Command | Exit | Result |
|---|---|---|
| `git fetch origin` | 0 | |
| `git diff --stat 241ba9e1...49b6a012`, and §7's numstat command | 0, 0 | |
| `git worktree add --detach C:/dev/wt/gv1-review/head 49b6a012…` | 0 | |
| `git worktree add --detach C:/dev/wt/gv1-review/main 85933a08…` | 0 | |
| `gh pr view 216`, `gh pr checks 216`, `gh run list --branch cut/guardian-v1` | 0, 0, 0 | |
| `claude --version` | 0 | 2.1.296 (Claude Code) |
| `claude plugin test tools/mods/spatial-guardian` at 49b6a012 | 0 | 76 pass, 0 fail |
| `claude plugin validate tools/mods/spatial-guardian`, and with `--json` | 0, 0 | |
| `claude plugin validate tools/mods`, and with `--json` | 0, 0 | |
| `timeout 60 claude --help` | 0 | |
| `claude plugin --help`, `claude plugin marketplace --help`, `claude mcp --help` | 0, 0, 0 | |
| Mutation runner (scratch script, 12 mutations, revert after each) | 0 | each mutated `claude plugin test` exited 1; tree clean after (porcelain empty, `git diff --quiet` 0) |
| `claude plugin test` and `validate` at 83044167 (C.5) | 0, 0 | 73 pass |
| `claude plugin test` at 5a9eb051 (P0e (b)) | 0 | 70 pass |
| `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"` at 85933a08, inside `hold shared -Project SpatialIDE` | 0 | 457 pass; hold granted and released, no code 96 to 99 |
| `node scripts/plan/{verify,verify-cites,verify-quotes,verify-test-claims}.mjs` at 49b6a012 and at 85933a08 | 0 each | |
| Pin re-derivation script | 0 | |
| Read-only transcript replay script | 0 | two earlier attempts exited 1 on a syntax error in my own script, then fixed |
| `git worktree remove` ×2, `rm -rf C:/dev/wt/gv1-review`, `git worktree prune` | 0 each | |

## Mutation table (observed at the gated head 49b6a012, build 2.1.296; each reverted after its run)

| Test | Mutation applied | Observed failing list | Matches record |
|---|---|---|---|
| T73 | candidate test reads the placed path only (`normalise(path)` disjunct dropped) | T73 | yes |
| T74 | `g8LocalSettingsRefuses` returns true for any candidate | T74 | yes |
| T75 | `mainTree(...).catch(() => null)` in `g8LocalSettingsRefuses` | T75 | yes |
| T16/T24/T25 shared | `guardWrite`'s in-hook catch returns `next(e)` | T16, T24, T25, T54, T56, T75 (6) | yes |
| T53 | `guardShell`'s in-hook catch returns `next(e)` | T53, T55 | yes |
| T58 | `logRefusal`'s catch removed (try/finally) | T58 and 40 others (41 fail) | yes |
| T44 | `g1Sequence`'s forcing test reads only `--force` and `-f` | T44 | yes |
| T61 | `isThisRepository` returns false on a non-ENOENT failure | T61 | yes |
| T66 | container test dropped (equality only) | T66 | yes |
| T46 | `isRebaseWord`'s short-cluster line returns false | T46 | yes |
| T5 (v0) | `:` refspec check dropped | T5, T44 | yes |
| T7 (v0) | G1's `unbalancedRefuses` returns false | T7, T44, T71 | yes |

## Scratch copy

Both detached worktrees, `C:/dev/wt/gv1-review/head` (49b6a012) and `C:/dev/wt/gv1-review/main` (85933a08), were clean before removal. They were removed with `git worktree remove`, the folder `C:/dev/wt/gv1-review`, which held my scripts and outputs, was deleted, and `git worktree prune` ran. `git worktree list` shows no gv1-review entry.

Nothing was written in the main checkout, in `C:/dev/wt/gv1` or under `tools/mods/spatial-guardian` in the main checkout. Its porcelain shows the same two untracked items as at the start. No plugin was installed, enabled, reloaded or uninstalled.
