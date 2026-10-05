*Custodian's filing note (2026-10-05): `guardian-v1`'s P0b (`tools/mods/GUARDIAN-V1-PREREGISTRATION.md` §0.5), the worker's report. The harness refused the worker's Write of its report file (the tool error said subagents should return findings as text), and the worker did not work around it; the report arrived as its hand-back message and is extracted here by script from the SubagentHandback call in the subagent's own transcript. Changes: one final newline, and 1 user-profile path prefix(es) of the bundled-skills folder written as `<temp>/claude/bundled-skills/2.1.288/` at filing (the pre-commit profile-path rule). The hand-back's sha256 as received is c8fafbd25e0af54dba963ad6c8cd37dce9e4c9771bc51410c0cb6348b8fd4abd; this file's sha256 from line 5 to the end is c3e12389b17cad7742ae095f696339f821ca0f81fa4d6e206c93521c19efb7c7. Write audit: 29 Write or Edit calls, 0 outside its scratch folder; tool calls Read 6, Bash 56, Write 17, Edit 12, SubagentHandback 1. Run window from the transcript: 2026-10-05T16:07:41.552Z to 2026-10-05T17:06:19.790Z. Refusals in its run: 2026-10-05T17:04:33.879Z Write <tool_use_error>Subagents should return findings as text, not write report files. Include this content in your final response instead.</tool_use_error>. The custodian records it as the form's Amendment 1 (P0b, class 1).*

---

P0B RESULT: I could not write the report file. The harness refused my Write of the report (tool error: "Subagents should return findings as text, not write report files"). I did not route around it, so there is NO P0B-REPORT.md and no sha256 for it. The report is below. The bulk replay tables were produced by my Node scripts and exist as data files (paths and sha256 at the end). Say if you want me to write the report file some other way.

# Guardian v1 — P0b (§0.5) against Claude Code 2.1.289 (types read at 2.1.288)

Form: `tools/mods/GUARDIAN-V1-PREREGISTRATION.md` at main 71e3258b, §0.5. Run 2026-10-05, last data read 17:01:43Z. Nothing was written in the repository, `<claude-home>` or the Recorder's log folder. No mod was installed, enabled, loaded or reloaded, and no Claude session was started. Guardian refused none of my calls.

**Builds, kept apart (round 15 (c)).**
- A type read is a claim about 2.1.288. `<skill-root>` = `<temp>/claude/bundled-skills/2.1.288/16e75ddb0deead983951dbbf6b044ef9/plugin-authoring`.
- A CLI spelling is a claim about 2.1.289 (`claude --version` printed `2.1.289 (Claude Code)` once, at the start).
- The replay is a Node run of a scratch copy of the rules over recorded command text. Node v24.18.1, git 2.49.0.windows.1.

**The scratch copy, checked.**
- Its v0 functions copy `tools/mods/spatial-guardian/hooks/register.js` (main 71e3258b, sha256 dd420213ee0f05595e0d8704fbe7f00b77c92756b149b1a20456a438e1f96f45, same as P0's).
- It matches the shipped `pushRefused`: both refuse the same 247 of 24740 calls, 0 mismatches. v1 refuses 48 of those 247 and refuses nothing v0 allows (§2.2's subset claim holds on this record).
- §3 fixtures F37, F38, F40 to F45 (command side) all come out as predicted, with M = `C:/r` and every operand read as existing. F39 and G8's Write side were not run.
- v0 replayed from the install record (2026-10-04T11:28:29Z) refuses 7 calls. Six are P0 §6's. The seventh, 11:30:09Z, precedes the reload at 11:31:18Z (`state/consults/2026-10-05-guardian-v1-p0-report.md:212`). The replay reproduces the live record.

## (i) Types at 2.1.288

**File check.** sha256 of `<skill-root>/types/claude-code.d.ts` = 36af9e4799354bf878a91d1ea7c4632d0eca7c620b4557ace6afc8a87647cdb1, equal to §0.1's. The second 2.1.288 folder (`.../a78bdae9a929b85b7800488dc8d5c189/plugin-authoring`) has the same hash.

**`$.fs.write`.**
- Signature `write: (path: string, text: string) => Promise<void>`, `<skill-root>/types/claude-code.d.ts:3041`; doc :3035-3040 says it creates the file and its directories.
- Rejections stated at `<skill-root>/types/claude-code.d.ts:3007-3014`: "A read or write over 4 MiB rejects" (verbatim fragment of :3012); a network location is rejected untouched; "an OS refusal with its errno" (verbatim fragment of :3013).
- No duration bound on `fs.write`. The hook budget is `ms: 10_000` (`<skill-root>/types/claude-code.d.ts:4812`), but it counts only the hook's own time, "the clock stops while a `next(e)` call or any `$` call of the hook's is in flight" (paraphrase of :4796-4798). So a hung `$.fs.write` is not cut by the budget. `catchMs: 1_000` (:4820).
- A test makes it reject with a `{ deny }` answer (:13697-13699).

**`$.session.repo()`.** `Promise<SessionRepo | null>` (`<skill-root>/types/claude-code.d.ts:2600`). It is read from the working copy on each call and is `null` when the directory is not in a repository (:2593-2595). `SessionRepo` is `{ root, remote, internal, ... }` (:10774-10792); `root` is absolute, the main working tree's for a worktree (:10776). I1's second clause is not triggered by the types.

**`$.env.get`.** `Promise<string | undefined>` (`<skill-root>/types/claude-code.d.ts:3390`); an unset name gives `undefined` (:3381-3382); the name is a string literal and `validate` lists it (:3384-3385, :3376-3379).

**Test-kit answers.** Each is an event answered with `{ value }` or `{ deny }` (`<skill-root>/types/claude-code.d.ts:6734-6738`).

| call | event | argument | value |
|---|---|---|---|
| `$.fs.write` | `fs.write` | `{ path, text }` :6613-6616 | `void` :6817 |
| `$.session.repo` | `session.repo` | `NoArgs` :6478 | `SessionRepo \| null` :6762 |
| `$.env.get` | `env.get` | `{ name }` :6721-6723 | `string \| undefined` :6846 |

- `mock.env(on, variables)` answers `$.env.get`; "one not listed is unset" (verbatim fragment, :14484; signature :14489).
- An unanswered event throws at the bottom (:14915-14917); plugins load at the test's first `$` call (:14919-14920).
- `fs.stat` rejects ENOENT (:3072-3073).
- Contradiction with §2 from (i): none.

## (ii) CLI spellings at 2.1.289

From `claude plugin --help`, `claude plugin marketplace --help` and `claude mcp --help`, each run once under `timeout 60`, exit 0. Words are the help's; the grouping is mine.

`claude plugin|plugins` (usage line `claude plugin|plugins`, so **`plugins` is an alias of the group word**):
- `install|i`, `uninstall|remove`, `enable`, `disable`, `update`.
- `marketplace add`, `marketplace remove|rm`, `marketplace update`.
- Not in §7's list: `prune|autoremove` (removes auto-installed dependencies), `init|new` (scaffolds into `~/.claude/skills/<name>/`), `configure` (saves option values), `eval` (loads and runs a plugin's evals).
- Read-only or local: `details`, `list`, `marketplace list`, `test`, `validate`, `tag`.

`claude mcp` (no group alias printed):
- `add`, `add-from-claude-desktop`, `add-json` (all begin `add`), `remove`.
- Also `login`, `logout`, `reset-project-choices`, `serve`; read-only: `get`, `list`.

Against §7:
- Aliases to record: `i`, `rm`, and the group word `plugins`.
- Add/remove/write verbs in no list: `prune|autoremove`, `init|new`, `configure`, `eval`; for mcp, `login`, `logout`, `reset-project-choices`.
- None of these occurs in the recorded calls (`aliases.mjs`).

## (iii) User folder's override

- `CLAUDE_CONFIG_DIR` is named nowhere in `<skill-root>/types/claude-code.d.ts` or `<skill-root>/reference.md`, nor in the second 2.1.288 folder. No other name is given for the user folder.
- The files say the user's config directory is unnamed (`<skill-root>/types/claude-code.d.ts:3140-3141`); `~/.claude.json` is the global config (:3352-3353); the user settings source is `~/.claude/settings.json` (:11122); `claude plugin init` scaffolds under `~/.claude/skills` (`<skill-root>/reference.md:9`). The only env names near it are plugin-folder names, `CLAUDE_CODE_PLUGIN_DIRS` and `CLAUDE_CODE_PLUGIN_DIR_WATCH` (`<skill-root>/reference.md:68-69`).
- Result: **no override name**. §7's env list is `USERPROFILE` alone, per §0.4 item 3 and §5.
- README limit: a G8 anchored on `USERPROFILE` + `/.claude` misses a user folder the engine places elsewhere. `CLAUDE_CONFIG_DIR` is unset in this shell (this process only).

## (iv) Offline replay

### (a) P0 §6's six commands through §2.2's G1

- Matched in the transcripts by session, agent id, byte length (equal to P0 §6's 422, 5338, 4299, 2587, 4687 and 1589) and time.
- Redaction replaces each drive + `Users` + user-name spelling with `<profile>`; no `Users/` or user name is left in any redacted command.
- Each sha256 is of the redacted command's UTF-8 bytes, no trailing newline.

| # | result time | transcript | agent | raw bytes | redactions | redacted bytes | v0 raw/redacted | G1 v1 raw/redacted | sha256 of redacted command |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 2026-10-04T11:33:53Z | 874d0083-a9e4-4662-82dc-77d80de1259a | main | 422 | 0 | 422 | refused (unbalanced) both | allowed both | c9f9440438ec5d01e4f6dab7cc68dac0988e021e950db2bb5d6fddd822d956e3 |
| 2 | 2026-10-04T11:34:45Z | 874d0083-…/subagents/agent-a6ab62bdc0788337b | worker | 5338 | 2 | 5317 | refused (unbalanced) both | allowed both | 2369f91acd3ea4ba445bbedd0d632ced2f1a8da6cf5f1b094695f2333fd0c916 |
| 3 | 2026-10-04T11:42:00Z | 874d0083-a9e4-4662-82dc-77d80de1259a | main | 4299 | 1 | 4291 | refused (unbalanced) both | allowed both | 6fcb389a4ca9d65bb798812884b0d209bb39c366850bf0e9844387d4f6eada06 |
| 4 | 2026-10-05T07:45:36Z | 128d8fa3-…/subagents/agent-a92fc753f0d78f88f | worker | 2587 | 1 | 2579 | refused (unbalanced) both | allowed both | 3c39fcb25eb1a39f97235f3757f4d333a0ade73fac789174290266270ecbc910 |
| 5 | 2026-10-05T10:57:56Z | 128d8fa3-…/subagents/agent-a14bd64dce58dd3c4 | worker-high | 4687 | 2 | 4671 | refused (unbalanced) both | allowed both | 5fe9003e6d7961e48814b905d40170c3110fb0292087ba25996a9572abbce751 |
| 6 | 2026-10-05T14:04:00Z | 128d8fa3-…/subagents/agent-a607df38b2051c964 | worker | 1589 | 1 | 1581 | refused (unbalanced) both | allowed both | 3f077a2aac0a4792254e3972ffe85cb2295472e1fb14bb7f956f654f1119049d |

- The session ids abbreviated `128d8fa3-…` and `874d0083-…` are the full ids in the table's session cells (128d8fa3-d9ec-4243-88f6-28712bd74344 and 874d0083-a9e4-4662-82dc-77d80de1259a).
- v0 refuses each through the unbalanced-quote rule alone, never the segment check, rescan or depth cap.
- **All six pass G1 v1, raw and redacted.** #1 and #3 pass (I7 not triggered); #2, #4, #5 and #6 pass as predicted. The G1 sequence is absent from all six. #1's raw and redacted hashes are equal.

### (b) Every Bash and PowerShell call, 2026-09-20 to this run

**Data.**
- This project's transcript folder, read-only: 1006 `.jsonl` files, 549 scanned.
- 24740 calls (24657 Bash, 83 PowerShell) with `tool_use` timestamps from 2026-09-20T00:00Z to 2026-10-05T16:19:01Z, deduplicated by `tool_use` id.
- `agent` is `main` for a session's own file, else the subagent's `agentType`.
- No command text is reproduced.

**Method and classes.**
- Each rule is run alone on every call. 0 throws.
- Step: `segment`, `rescan`, `depthcap` or `unbalanced`.
- Classes are mine, from the match position:
  - *real catch (command spelling)*: a tokenised segment outside any heredoc body holds the spelling. I read each such segment for the 9 G1, 6 G7 and 1 G9 rows.
  - *§9 merge*: a `gh pr merge` command spelling.
  - *odd quote only*: the call is refused only through the unbalanced rule, including a rescan whose inner segment is unbalanced.
  - *text in a heredoc body* and *quoted text*: never run as that command.
- The heredoc test is a classification aid only.
- G9 runs with M = the main checkout and Node's read-only `realpath`. In the main checkout `target` is a symlink to the D: drive's `spatial-ide/target` (observed `ls -l`), so protected members are compared on resolved paths as §2.6 says.
- Existence is read at replay time. G9 was run as operands exist now and with every operand assumed to exist; the two lists are identical.

**Counts.** `before 09-27` is 2026-09-20 to 26; the form's §5 prediction was written for `since 09-27`.

| rule | refused | before 09-27 | since 09-27 | since reload 2026-10-04T11:31:18Z | classes (before / since) |
|---|---|---|---|---|---|
| G1 v0 | 247 | 74 | 173 | 6 | odd quote only 71/152; real catch 2/7; text in heredoc body 1/3; quoted text in heredoc body 0/11 |
| G1 v1 | 48 | 8 | 40 | 0 | odd quote only 5/19; real catch 2/7; text in heredoc body 1/3; quoted text in heredoc body 0/11 |
| G7 | 27 | 8 | 19 | 6 | real catch 4/0; §9 merge 1/1; odd quote only 3/16; quoted text 0/2 |
| G8 | 9 | 0 | 9 | 2 | odd quote only 0/8; quoted text in heredoc body 0/1 |
| G9 | 7 | 3 | 4 | 0 | odd quote only 3/3; scratch-clone `git clean` after a `;` 0/1 |

By agent, since 09-27:
- G1 v1: main 18, reviewer 10, worker 7, worker-high 5.
- G7: main 8 (the §9 merge plus 7 false alarms), reviewer 9, worker 2.
- G8: main 5, reviewer 3, worker-high 1.
- G9: main 1, reviewer 3.

Per rule:
- **G1.** The 9 real catches are `--force-with-lease` and `--delete` pushes (custodian main loop, workers), 2026-09-22 to 2026-10-03. 24 odd-quote-only refusals remain under v1. Of the 25 calls refused through the unbalanced rule, 21 meet the forcing-word test only through a word beginning `+` or `:` (a `date` format string, prose), 1 through a short option cluster, and 3 through prose spellings of `-f` or `--force`. A plain `git push` after an odd-quote heredoc is therefore still refused when any later word is of that kind. §2.2's "What stays refused" implies this; it narrows N2's value, and F37's N2 fixture has no such later word.
- **G7.**
  - Real catches: `git pull --rebase` 2026-09-20T15:17:30Z; `git rebase` 2026-09-24T00:37:51Z, 10:37:56Z and 19:42:12Z (the last was classifier-denied per P0 §2).
  - §9 merges: #121 2026-09-25T07:04:06Z (session 5d626cec) and #138 2026-09-28T07:00:34Z (session 805f1d1e).
  - The 19 odd-quote-only refusals are 8 `gh pr create|view|checks` calls with a later word `merge`, and 11 prose naming a rebase. None is a merge or rebase.
- **G8.** 9 false alarms: record text naming `claude plugin` with a later word `update`, `add` or `remove` in an odd-quote call or quoted token.
- **G9.** 7 false alarms: 6 odd-quote-only, and 1 reviewer `git clean -fdq` in a scratch clone after `cd C:/dev/b1-gate3-scratch/src && export …;`, where the `;` ended the cd chain so the base read as M.

**Rows** (UTC; main = custodian-session main loop; id-resolvable rows for G1 are in the data file).

G7 (27):
- 09-20T15:17:30 main segment real catch
- 09-22T21:26:14 main unbalanced odd quote
- 09-24T00:37:51 main segment real catch
- 09-24T10:37:56 main segment real catch
- 09-24T19:42:12 main segment real catch
- 09-25T00:58:54 main unbalanced odd quote
- 09-25T06:51:56 main unbalanced odd quote
- 09-25T07:04:06 main segment §9 merge
- 09-27T14:50:57 main unbalanced odd quote
- 09-27T16:13:35 reviewer ab5d2a72 unbalanced odd quote
- 09-27T16:14:41 reviewer ab5d2a72 unbalanced odd quote
- 09-27T18:14:48 reviewer ad80b9bf unbalanced odd quote
- 09-27T18:16:19 reviewer ad80b9bf unbalanced odd quote
- 09-27T18:17:46 reviewer ad80b9bf unbalanced odd quote
- 09-28T07:00:34 main segment §9 merge
- 09-29T11:22:29 main unbalanced odd quote
- 09-30T17:34:22 main rescan odd quote
- 10-01T06:40:13 main unbalanced odd quote
- 10-02T06:54:37 main unbalanced odd quote
- 10-02T11:27:24 main unbalanced odd quote
- 10-02T12:27:03 main unbalanced odd quote
- 10-04T11:47:43 reviewer a13cfb0e unbalanced odd quote
- 10-04T12:30:08 reviewer ad2bd451 unbalanced odd quote
- 10-04T13:42:31 reviewer a99f0c3b unbalanced odd quote
- 10-05T11:48:03 reviewer a977bead unbalanced odd quote
- 10-05T13:49:26 worker a607df38 rescan quoted text
- 10-05T13:49:37 worker a607df38 rescan quoted text

G8 (9), all false alarms:
- 10-03T22:05:24 reviewer ad264aa2 rescan
- 10-03T22:08:28 main rescan
- 10-04T08:57:52 main unbalanced
- 10-04T09:21:36 main unbalanced
- 10-04T09:41:02 worker-high a30067ee unbalanced
- 10-04T10:08:47 reviewer a8d47573 unbalanced
- 10-04T10:24:11 main rescan (heredoc body)
- 10-04T11:42:00 main unbalanced
- 10-04T13:42:31 reviewer a99f0c3b unbalanced

G9 (7), all false alarms:
- 09-24T02:00:07 worker ac3f7bc6 rescan
- 09-24T02:04:31 main rescan
- 09-24T03:37:16 main rescan
- 09-27T18:31:06 reviewer a0af58a2 segment (scratch clone, `;` after the cd)
- 10-02T05:52:58 main unbalanced
- 10-03T16:30:39 reviewer aa15237d unbalanced
- 10-03T16:31:39 reviewer aa15237d unbalanced

## Round-57 additions (informs Amendment 2; not §0.5's record)

Same data, rulings applied.
- OPEN-1 (b): repository gate on G7/G9.
- OPEN-2 (b): `gh api` `pulls/<n>/merge` in G7.
- OPEN-3 (b): `.claude.json` Write/Edit/NotebookEdit in G8.
- OPEN-4 (b): G9 containers, data-folder contents, and the glob addition.
- All implemented in the scratch copy (`engine.mjs` option `open4`, `r57.mjs`).

**Over the recorded calls: no call changes outcome under any ruling.**
- **OPEN-1.** Every one of the 24740 calls carries session cwd = main checkout (24298) or its `.claude/worktrees` (442), so the gate removes no refusal. The entry's `cwd` is the session's, not each subagent's. The ClinicaNutri rebases (P0 §2) are in other projects' transcripts and were not replayed.
  - Guardian's `plugin.json` is `tools/mods/spatial-guardian/.claude-plugin/plugin.json` (`git ls-files`), not at the repository root. The ruling's "at the repository root" needs a stated path. A clone of this repository carries the same file, so a clone counts as "this repository".
- **OPEN-2.** 0 recorded calls hold `gh` with a `pulls/<n>/merge` path, so there is no new refusal and no new over-refusal.
  - Shapes: `gh api repos/o/r/pulls/N/merge` with `-X PUT`, `--method=PUT`, no method, or `--method GET`: refused. `gh api repos/o/r/pulls/N`, `gh api graphql …` and `gh pr view N --json mergedAt`: allowed. `pulls/$N/merge` is allowed (a `$` variable is not a number).
- **OPEN-3.** 3981 Write/Edit/NotebookEdit calls in the window: 26 under `<claude-home>/projects/…` (memory), 388 under repository `.claude` folders, 0 to the user-level `.claude.json` (any spelling ending `/.claude.json`: 0), and 0 refused by G8 as declared. No override location exists ((iii)).
  - Shapes through the scratch check: `<profile>/.claude.json`, its backslash spelling and `<profile>/.CLAUDE.JSON`: refused. `<profile>/.claude.json.bak` and `<repo>/.claude.json`: allowed.
- **OPEN-4.** 0 recorded calls newly refused or released.

**Fable's item 2 shapes, through G9 (`shapes.mjs`, M = the real checkout, operands read as they exist now).**

| shape | as drafted | as ruled (base unknown, read as M) | after `cd` to the main checkout | after `cd` to a worktree |
|---|---|---|---|---|
| `rm target/slice-evidence/*` | allowed | refused | refused | allowed |
| `rm -f target/fixtures/*.parquet` | allowed | refused | refused | allowed |
| PowerShell `Remove-Item target\fixtures\*` | allowed | refused | refused | allowed |
| `del /q target\fixtures\*` | allowed | refused | refused | allowed |
| `rm target/fixtures/x.parquet` | allowed | allowed | allowed | allowed |

- "As drafted" allows all four refused shapes, as Fable says (shape 3 needs a recursive option).
- Implementation reading: `del /q`'s `/q` is read as an operand, since §2.6 names `/s` and `/q` as options only for `rd` and `rmdir`. The glob-in-a-data-folder test is applied to every delete word, recursive or not.

**Other OPEN-4 shapes (same method; every row matched the ruling's text):**
- `rm -rf C:/dev/spatial-ide`, `rm -rf C:/dev`, `rm -rf .` (base unknown): refused. After a worktree `cd`, `rm -rf .` is allowed; `rm -rf C:/dev` and `rm -rf C:/dev/spatial-ide` stay refused.
- `rm -rf D:/spatial-ide`: refused, because the target's resolved location is under it (the symlink).
- `rm -rf <checkout>/target/fixtures/admission-remediation` and `rm -rf target/slice-evidence/cancel-rescore`: refused; `rm -rf target/fixtures/nothing-here` (ENOENT): allowed.
- `rm -rf target/fixtures/*.tmp` and `rm target/fixtures/*`: refused.
- Allowed: `rm -rf target/debug`, `target/release`, `frontends/shell/src-tauri/target`, `D:/wt-targets/x`, `C:/dev/wt`, `<checkout>/.claude/worktrees/foo`, `rm -f target/fixtures/admission.parquet`, `rm target/*`.

## Findings that contradict §2 or §5

Nothing found contradicts §2's design or hits I1 or I7. Two items need your decision; I only report them.

1. **§5's replay prediction, and a possible I8.** §5 predicts G7 refuses one call (the 2026-09-28 §9 merge) and G8 and G9 refuse none. Since 2026-09-27 the replay gives G7 19, G8 9 and G9 4 (the table above).
   - The extras are §2.3's unbalanced-segment sequence refusing record, report and PR text. Main-loop calls: G7 7 false alarms plus the §9 merge, G8 5, G9 1.
   - Examples are the custodian's ledger writes, and `gh pr create|view|checks` with an odd quote and a later word `merge`.
   - §5 says a different count is class 2 and its shapes join the README. Whether I8 ("a flow the human performs through the custodian") applies to the custodian's record writes is your call.
   - The brief's window from 09-20 adds the real catches (the 09-20 `pull --rebase`, three `git rebase`) and the #121 §9 merge to G7.
2. **§2.5/§7's spelling list omits the CLI's own spellings.** The group word `plugin` has the alias `plugins`, so `claude plugins install …` would escape §2.5's `claude…plugin…action`.
   - Also unlisted: `i` (install), `rm` (marketplace remove), and `prune|autoremove`, `init|new`, `configure`, `eval`; for mcp `login`, `logout`, `reset-project-choices`.
   - None occurs in the record.

Also recorded, not contradictions:
- N2 survives only when no later word begins `+` or `:` (G1 paragraph above).
- `target` in the main checkout is a symlink to the D: drive, so §2.6's resolved comparison, and OPEN-4's "folder above", reach the D: folders.
- A hung `$.fs.write` is outside the hook's 10 s budget (`<skill-root>/types/claude-code.d.ts:4796-4798`), consistent with §2.7 and §1.

## Commands run, exit codes

- **claude (4 total):** `claude --version` 0 (`2.1.289 (Claude Code)`); `claude plugin --help` 0; `claude plugin marketplace --help` 0; `claude mcp --help` 0. Each help under `timeout 60`.
- **`claude plugin validate` and `claude plugin test`:** not run (§0.5 needs neither).
- **Reads:**
  - `sha256sum` of the two 2.1.288 type files and the reference file, plus `ls`, `cat -n | sed` and `grep` over `<skill-root>` and the repository: all 0.
  - `git --no-optional-locks` `rev-parse HEAD`, `log -1`, `status --porcelain`, `ls-files` and `worktree list`: all 0.
  - `ls -ld target …` 0; `printenv CLAUDE_CONFIG_DIR` 0 (empty); `date -u`, `node --version`, `git --version`, `du -sk`: all 0.
  - Main HEAD 71e3258b; porcelain showed only the two untracked entries.
- **Node scripts over scratch (all exit 0 unless noted):**
  - `extract.mjs` twice (the second run's compound command exited 1 on a mangled `node -e` regex after `extract.mjs` itself exited 0).
  - `replay-a.mjs` twice, `replay-b.mjs`.
  - `classify.mjs`: the first run hit its 500 s `timeout` (exit 124, outputs already written); the rerun with prefilters exited 0 in 48 s and produced identical tables.
  - `nounbal.mjs`, `fixtures.mjs`, `fidelity.mjs`, `subseq.mjs`, `ghshape.mjs`, `agentsplit.mjs`, `aliases.mjs`, `r57.mjs`, `shapes.mjs`, `cat2.mjs`, `seg.mjs`, `snip.mjs`.
  - `cat1.mjs` exited 1 (a heredoc collapsed a backslash); I rewrote it as `cat2.mjs`.
- **Never run:** `claude plugin install`, `uninstall`, `enable`, `disable`, `update`, `marketplace add`, `remove` or `update`, `claude mcp add` or `remove`, any session, `gh pr merge`, `gh api` merge, `git merge --squash`, `rebase`, `pull`, `cargo clean`, `git clean`, any recursive delete.
- No write under `<claude-home>`, `C:/dev/spatial-ide-local/`, `C:/dev/spatial-ide` or any worktree. `C:/dev/wt/b1f*` untouched.

Scratch folders left:
- `<scratchpad>/guardian-v1-p0b/` 34230 KiB, including `replay/` 34210 KiB (the two `calls*.jsonl` files are ~33 MB) and `real/` 24 KiB (scratch copy of `register.js` with an export line).
- `D:/wt-targets/guardian-v1-p0b/` 0 KiB.

Data files in `<scratchpad>/guardian-v1-p0b/replay/` (sha256):
- `tables-b.md` db8089b51d72a28d81fe9039c372f1c315b2e0dcfc36e1171981face11d3c187: every refused call for G1 v0, G1 v1, G7, G8 and G9, with time, session, agent, step, class and `tool_use` id; no command text.
- `summary-b.json` c464fff40d06b0b8d3231e88368e2aa1fbc050688b11764069bfff6660a951dd.
- `a2.json` 0a893955e195a148e8395d30c54bebe3651a1bfd874edf14e32bccf752589e7d: the six-command replay.
- `r57.json` b0e310135d313b1c6711df0436afda6b4c2dbf4749a200338209ac9ce21cfd9f.
- `shapes.json` 28aa585b672e33a9ab43bd15449bfd2c8b66165f0babd11c7f96fe8dde1e1762.
- `engine.mjs` 3d1e422876e1642a57eb13cdbfb89c933cd9e402e452e088a6048adacbb57927: the scratch rules.
- `calls.jsonl` c20c9dbbda8378d71bc831e967a8db6fee876cd8e4410870bf9c7f4531ee6488: the 24740 extracted calls, which hold command text, so keep it out of the repository.

**Self-check (the four classes).**
- No code crossing a module boundary was written.
- Every completion claim above points to a file, a line or a counted run.
- No user-facing message was written.
- Each required replay reached its assertion: the six outcomes, the per-rule counts, and the fixtures check.

Model: Sonnet 5.5 (`claude-sonnet-5-5`), no override, no context handoff received or produced. No usage figures at hand.
