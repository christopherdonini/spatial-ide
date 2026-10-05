# spatial-guardian (Guardian v1)

The first Spatial IDE mod: a plugin of function hooks for sessions in this repository that refuses calls. It never approves a call, rewrites a call's arguments, submits a prompt, calls a model or makes a network request. It writes one local log file per refusal, outside the repository, and nothing else (see "The refusal log"). Every refusing hook fails closed: it decides inside one try that denies, and every registration also carries a catch that denies, so a hook that throws or overruns refuses the call instead of being skipped. The forms are `tools/mods/GUARDIAN-V0-PREREGISTRATION.md` and `tools/mods/GUARDIAN-V1-PREREGISTRATION.md`, and both govern this folder: v1 governs what it changes and adds, and v0 stays the form of every v0 rule.

Built and tested against Claude Code 2.1.289 on Windows. The reads of the build's type declarations behind the hooks were made at 2.1.288 and are claims about that build only. Nothing here is claimed for another build, for macOS, or for Linux.

## What it refuses

Each reason Guardian returns starts with `spatial-guardian`, states Guardian's own fact, and carries no path from the call.

| Rule | Refuses | Ruling it enforces |
|---|---|---|
| G1 | A `git push` that force-pushes (`--force`, `-f`, a short-option cluster holding `f`, `--force-with-lease`, a `+` refspec, `--mirror`) or deletes a remote ref (`--delete`, `-d`, a `:` refspec, `--prune`), found through git's global options and inside a quoted command string. A segment that cannot be tokenised (a quote left open) and holds `push` is refused, except in the shapes G1's narrowing below lists. Bash and PowerShell. Each command is read twice, and refused when either reading refuses: once split at the shell's separators, and once also split at parentheses, braces and backticks, so a push inside a subshell, a substitution, a backtick pair or a brace block is found. | question round 34, item 3 |
| G2 | A Write or an Edit to `docs/01_Principles.md`, in any spelling of its path. | the project instructions: docs/01 is never edited |
| G3 | A change to an accepted ADR (any ADR whose status line is not Proposed, or has none) or to a filed preregistration (a `*PREREGISTRATION.md` that `git cat-file -e HEAD:./<name>` finds), except as a pure append. A Write must start with the file's current bytes. An Edit must have an `old_string` that occurs once, at the end of the file, and a `new_string` that starts with it. | ADRs are append-only, as are preregistrations; question round 44, item 1 (O-8) |
| G4 | An Edit under `state/directives/`, and a Write over a file that exists there. A Write that creates a new file is allowed. | directives are filed verbatim, once |
| G6 | For a subagent of type architect, lead-data or evidence-reader: a Write or Edit outside the path its brief declares on a line of the form `REPORT PATH: <absolute path>`. A brief with no such line, or several, refuses every write. On the PowerShell route, every PowerShell call by such a subagent is refused whatever its command, because a shell call carries no path to place; its Bash calls are not touched by G6. | question round 41, item 3; question round 43, item 4 |
| G7 | From any agent, the main loop included: a pull-request merge (`gh pr merge`, every form, `--help` included, and a `gh api` call on a pull request's `pulls/<number>/merge` path, whatever the method); `git rebase` (every form, `--abort`, `--continue` and `--help` included); `git merge` with `--squash` or a prefix of it; `git pull` with `--rebase`, a prefix of it, `-r`, or a short-option cluster holding `r`. Bash and PowerShell. Keyed on the session's repository (see "Reach"). | line 2 of the human's 2026-10-05 direction (every agent pull-request merge, the custodian's included); AUTONOMY section 27 and the history-rewrite entry of the precedents; question round 57, items OPEN-1 and OPEN-2 |
| G8 | From any agent: on the command line, `claude plugin` or `claude plugins` with `install`, `i`, `uninstall`, `remove`, `rm`, `enable`, `disable`, `update`, `add`, `prune`, `autoremove`, `init`, `new` or `configure` (so also `marketplace add`, `marketplace remove` and `marketplace update`), and `claude mcp` with a word that begins `add`, or with `remove`, `login`, `logout` or `reset-project-choices`; `--help` forms included. As a Write, Edit or NotebookEdit: a path at the user's Claude folder's `settings*.json`, directly under it, or at or under its `plugins`, `skills`, `agents`, `commands` or `hooks` folders, and the user-level `.claude.json` in the profile folder. Allowed: `plugin list`, `validate`, `test`, `details`, `tag`, `eval`, group-level `--help`; `mcp list`, `get`, `serve`; `claude --version`; everything under the user folder's `projects` folder; the repository's own `.claude` folders. | the brief's section 2.3 (`state/directives/MODS-V1-2026-10-05.md`); question round 57, item OPEN-3; question round 58, item OPEN-6 |
| G9 | From any agent: `cargo clean` with no package that does not name its target folder (or names the main checkout's); `git clean` with a force flag in the main checkout; a recursive delete (`rm`, `rmdir`, `rd`, `remove-item`, `ri`, `del`, `erase`) of the main checkout's `target`, of its `target/slice-evidence` or `target/fixtures`, of a folder above any of them, or of anything under the two data folders; and a delete, recursive or not, whose operand holds a glob and whose folder is a data folder or under one. Allowed: `target/debug`, `target/release`, `frontends/shell/src-tauri/target`, a worktree's own target, anything under `.claude/worktrees/`, a delete of a named file, and an operand that does not exist. Bash and PowerShell. Keyed on the session's repository (see "Reach"). | the shared-target rule of `AI_DEVELOPMENT.md`; question round 57, items OPEN-1 and OPEN-4 |
| N1 | Nothing. When the main conversation's context passes 80 percent and the continuity block is stale, a tool result gets one appended line for the model, at most once per 10-point band. | AUTONOMY section 7 (the flush) |

G2, G3, G4 and G6 guard Write and Edit, and NotebookEdit on its `notebook_path` as an Edit that is never an append. G8's path side guards the same three tools. MultiEdit is not a tool in build 2.1.288, so nothing is registered for it. A path that cannot be placed (drive-relative, `\\` or `//`, an empty, `.` or `..` name, a name holding a drive, or one the file system cannot resolve) is refused. Paths are matched on the resolved path with both separators and ASCII case ignored, on every platform alike, so a case-sensitive volume can see a refusal a stricter match would not.

G5, the profile-path refusal, is not in v0 or v1 (question round 43, item 3). The commit-msg and pre-commit hooks and the CI range check remain that refusal.

N1's percentage is the compaction-window percentage from the local summary breakdown of the session's usage. When the engine returns no breakdown, N1 does nothing. N1's staleness check restates the Stop hook's predicate in `hooks/continuity.mjs`, and `scripts/hooks/guardian-continuity-parity.test.mjs` holds the two together on one fixture set. A change to either predicate is made with the other, in the same piece.

### G1's narrowing

A segment that cannot be tokenised (an odd quote left open to the end of the command, as in a heredoc body that holds an apostrophe) is refused only when it holds `push` and either of these holds:

- the call's words, read over the whole command text (every line, heredoc bodies, comments and quoted text alike, with every quote deleted), hold a word naming git, then later the word `push`, then later a word that forces or deletes (a force or delete option, a `+` or `:` refspec);
- that segment's own `push` comes before its open quote: git, then git's global options, then `push`, in the text of that segment before the open quote.

So `.push(` in code text, the word push in prose, and a plain git push in a segment before the odd quote or after it pass. Every force or delete spelling is still refused, wherever it sits, a heredoc body included. The quoted-string rescan and its depth cap still refuse without this reading.

### Reach

G7 and G9 are keyed on the session's repository: they apply when the session's repository holds Guardian's own `plugin.json` (a clone counts as this repository, and a worktree resolves to the main tree), they apply when that check cannot complete, and they do not apply in another repository or in a session that is in none. A session started outside this repository that reaches into it is not read. G1 to G6 and G8 apply everywhere.

### After an odd quote

G7, G8 and G9 read a call that cannot be tokenised from each place where a command word or a quote begins, as if a new command started there. There, a leading `cd` is not read, so the base of a relative delete is the main checkout, and a `CARGO_TARGET_DIR=` word before `cargo` is not read either: name `--target-dir` instead.

### The refusal log

Each refusal writes one new file, and an allowed call writes none:

- the folder is `<parent of the main checkout>/<name of the main checkout>-local/guardian/<YYYY-MM-DD>/`, beside the Recorder's `-local/evidence` folder, found from the session's repository; with no repository, or a root that cannot be derived, no line is written;
- the file is `<HHMMSSmmm>-<16 hex of the line's sha256>.json`, one JSON line and an LF, written by one `$.fs.write`;
- the fields are `schema` (`spatial-guardian/v1`), `time` (UTC, ISO), `rule` (`G1`, `G2`, `G3`, `G4`, `G6`, `G7`, `G8`, `G9`, `unplaceable` or `catch`), `tool`, `agent` (the subagent's type, `main`, or `unavailable`), `target_sha256` (of the command, or of the file or notebook path as received; `unavailable` when it is not a string) and `reason`. Nothing else: no command, path, content or argument;
- not logged: a refusal by overrun (the engine's catch runs no hook code), N1, and any allowed call;
- a failed write changes neither the refusal nor its reason, and a hung write delays the refusal: the call still does not run, and no bound on the delay is claimed;
- two identical refusals in the same millisecond are not claimed to give two lines;
- a log line is not citable evidence. It holds a hash only, so the custodian classifies each refusal against its session transcript.

## What it does not claim

- Nothing live before its E-row in the form (section 4): `agentId` on a live subagent's calls, `context` reaching the model, the `realPath` spellings the engine returns, the live percent figure. G7, G8 and G9 and the log are not shown live before the live checks of the v1 form's section 4, and there is no live G1 probe, so G1's narrowing is shown live only by the log's count of false refusals.
- Writes by Bash, PowerShell or any tool other than the ones registered here, except that G6 refuses every PowerShell call by a report-only subagent. G2, G3 and G4 read no shell command, on either shell, so a shell write (a redirect, `tee`, `sed -i`, `Set-Content`) to a protected path is not refused by them. A restore done with git is unseen by G3. There is no live probe of G6's shell refusal, because no report-only agent definition holds a shell tool.
- A Write that creates a new file passes when the engine's rejection for a missing path names ENOENT, and E4 showed that live at 2.1.289 (the v0 form's Amendment 9): a Write into a scratch folder that exists was passed. A Write into a folder that does not exist yet is another case, listed under "Over-refusals".
- For every rule, what the shell rules do not read: aliases and scripts; configured `+` refspecs; variables and the output of a substitution; `eval`; brace expansion; a backslash inside a command word other than before a quote; PowerShell's escapes and line continuation (every command, PowerShell's included, is read by bash-shaped rules); arguments supplied by `xargs`; work done from code (Node, Python). ANSI-C quoting is not read: `$'...'` is read as plain single quoting, so an escaped quote inside it can desync the reader, as in v0.
- For G7: `pull.rebase` configuration and `-c pull.rebase=...`; GraphQL merges; MCP merge tools; a merge path whose number is a variable; a rebase run from code.
- For G8: writes into the user's Claude folder by Bash or PowerShell, which stay allowed (memory appends are legitimate); shell writes to the user-level `.claude.json`; project-scope configuration inside the repository (`.mcp.json`, the repository's own Claude settings), which is tracked and reaches review; the engine's LSP recommendation dialog and account sync, `/plugin`, and the human's own terminal; a user folder the engine places elsewhere than `USERPROFILE` plus `/.claude` (no override name is typed at 2.1.288; `CLAUDE_CONFIG_DIR` is not read); `claude plugin eval`, which is not refused (question round 58, item OPEN-6); the top-level `claude` verbs below.
- Top-level `claude` verbs, taken from `claude --help` at 2.1.289 and not read: `agents`, `attach`, `auth`, `auto-mode`, `gateway`, `import`, `install`, `purge`, `respawn`, `rm`, `setup-token`, `stop` (`kill`), `ultrareview` and `update` (`upgrade`). Their help lines do not show them to be read-only, and when in doubt a verb is listed. `doctor` and `logs` read only, by their help lines. A verb of that list is refused by no rule here; adding one is a later ruling.
- For G9: a call's working directory, which it reads only as the call states it (a leading `cd <absolute dir> &&`, `git -C`, or a named target folder); `find -delete`, rimraf, and deletes run from code.
- A case alias of a filed preregistration or of an accepted ADR on a case-insensitive volume may keep its own spelling, so git's lookup of it can miss.
- Parity for a history shape outside the parity fixtures, or for a ledger blob of 4194304 bytes or more (above that size the engine cuts the stream and the mod reads not judged).
- Parity for a session whose working directory differs from the Stop hook's project root.
- Cloud sessions and edits made on GitHub. CI and the gates stay.
- That the installed copy is isolated from later changes to this folder (E0 records the `Read from` line as the repository folder, and does not settle which bytes the engine runs).
- Any build other than 2.1.289 for the tested behaviour (the type reads are 2.1.288's), macOS, Linux, any latency figure.

## Over-refusals

Each of these is refused although nothing is run or nothing is wrong. Each fails closed, never open.

- G1: text that is never run, when it holds a force-push spelling: a commit message or an `echo` string (even single-quoted), a heredoc body line, or a shell comment. A bare spelling (`echo git push -f`) is refused, and since the second reading so is one inside parentheses, a substitution, backticks or braces. A long-option abbreviation is refused too, because git accepts one. Write record text (ledger rows, reports, notes) with the Write tool and not with a shell command, so that no shell rule reads it.
- G1, after an odd quote: when heredoc text holds an odd quote, a plain git push after it is still refused if any later word starts with `+` or `:` (a `date +%H:%M` format, a `key: value` line), or reads as a force or delete option. Run the push as its own call, or write the text with the Write tool.
- G1, a push that leaves a quote open: a push whose own segment later holds an odd quote that the shell does not read as a quote, such as a trailing `# don't` comment or `$'...'` text, is refused. Run the push as its own call.
- G1, a Write to a new folder: a Write that creates a file in a folder that does not exist yet is refused as unplaceable (the placement step finds neither the file nor its folder). Create the folder first, then Write. The log counts these under the rule id `unplaceable`.
- G7: the custodian's own docs-only merge under AUTONOMY section 9, which the human's line 2 suspends: AUTONOMY section 9's auto-merge is not used while Guardian is installed, and AUTONOMY is not edited here (its suspension goes to the 2026-10-09 window). `--help` forms. `git rebase --abort`, `--continue` and `--skip`. `git pull --rebase=false`. An ambiguous abbreviation such as `--s`. The read-only merged check through `gh api` on a pull request's merge path (`gh pr view` answers that question instead). A commit message or other text that names a spelling and is never run.
- G8: a settings change the human asks the custodian to make by a tool write (the human makes it himself). `--help` forms. Text that is never run, when within one command or one quoted string it names `claude`, then `plugin`, `plugins` or `mcp`, then one of the verbs above; the common words are `new`, `init`, `configure`, `login` and `logout` (a commit message such as "claude plugin test passed on the new build" is refused). Write such text with the Write tool.
- G9: a bare `cargo clean` anywhere; name the target folder, or remove the worktree's target folder with a delete. `--dry-run`, `--release`, `--profile` and `--doc` forms. A relative `rm -rf target`, `rm -rf .`, a glob under `target`, or a forced `git clean`, without a leading `cd <absolute dir> &&`: the main loop's persisted directory is not visible to a hook, so an unknown base is read as the main checkout. A leading `cd` joined by `;`, `||` or `|`. A glob in a data folder, whatever the delete's options. PowerShell's `-Force`, read as recursive. Text that is never run.
- Any rule, written text: record text that names any rule's spelling (a ledger row, a report, a form) is written with the Write tool and not through a shell command.

## The shell route

The shell route is PowerShell, and Guardian registers G1, G6, G7, G8 and G9 on it. The custodian's own session, on 2.1.288, holds a PowerShell tool. The 2.1.288 type reads name that tool with a string `command` field, and at 2.1.289 `claude plugin validate` lists the PowerShell registration. Not established at 2.1.289: that build's own type declarations, whether a 2.1.289 session exposes the tool, and which subagent types receive it. None of the three report-only agent definitions lists a shell tool, so G6's closure of this route is defensive today.

R11. G6's refusal of a report-only subagent's shell call is a backstop, not the guard those agents rely on. Their definitions (architect, lead-data and evidence-reader) grant no shell tool, and those tool lists are the guard, with the write audit as the backstop of their runs: E5 passed at 2.1.289, so a live subagent's calls carry the id G6 reads. G6 covers the PowerShell tool today. It does not cover the Bash tool. If any report-only definition gains Bash or PowerShell, G6 must cover that tool before the definition change merges; for Bash that means a G6 change, declared by its own amendment or piece, landing first.

## Install (the human's alone)

Installing a mod is a security-posture change. It needs the human's typed approval after both gates, and he installs it himself. Nothing in this repository installs, enables or loads it. G8 refuses these commands to every agent.

1. `claude plugin marketplace add <repository>/tools/mods --scope user`
2. `claude plugin install spatial-guardian@spatial-ide-mods --scope user`
3. `/reload-plugins`
4. Confirm the `/plugin` line the brief names (`state/directives/MODS-GUARDIAN-V0-2026-10-03.md:44` @ 1bb94e19 sha256:b446fb1dad9f228df029d8ffea2628f3a99f15239b9b44ce3e76aac99fdd7013).

Install from a checkout on main, at user scope. Never use the `project` or `local` scope: a plugin enabled there would be declared by a repository file.

## Turning it off

- Guardian alone: disable it in `/plugin`, or run `claude plugin disable spatial-guardian --scope user` in your own terminal.
- One session: start with `--safe-mode`. It also disables the user's other customizations.
- Not `disableAllHooks`: it also stops the repository's settings hooks (the Stop hook and the round mirror).

To remove it: `claude plugin uninstall spatial-guardian` in your own terminal.

## Acceptance, stop conditions, false refusals

The acceptance and stop conditions are the brief's section 5: `state/directives/MODS-GUARDIAN-V0-2026-10-03.md:49-57` @ 1bb94e19 sha256:5336670a5a51fe3cc8b94d5195c596fdbc7d43d08cbaab7965f04ceb19c09eaa.

False refusals are counted from the refusal log, by rule, and each is classified by the custodian against its session transcript; a log line is not citable evidence. A false refusal's rule is narrowed through the usual process. A call Guardian should have refused and did not is a stop condition.

## The REPORT PATH convention

A lead-data brief carries one line of the form `REPORT PATH: <absolute path>` (question round 43, item 4). G6 reads it from the first message of the subagent's conversation, taken from the newest 4096 rows, so a lead-data run longer than that loses its line and every write it makes is refused. E5 passed at 2.1.289, so the write audit (`scripts/hooks/subagent-write-audit.mjs`) is the backstop of report-only runs' writes and no longer their primary check.

## Files

- `.claude-plugin/plugin.json`: the manifest.
- `hooks/hooks.json`: names the one hooks module.
- `hooks/register.js`: the hooks.
- `hooks/continuity.mjs`: N1's staleness judgment, pure, with no import and no call.
- `test/guardian.test.ts`: the plugin tests, run with `claude plugin test tools/mods/spatial-guardian`.
- `.gitignore`: keeps the engine-written `.claude-plugin/types/` folder out of git.
