# Guardian v1 — P0 against Claude Code 2.1.289 (types read at 2.1.288)

Builds: `claude --version` printed `2.1.289 (Claude Code)` at the start and at the end of the run. Every "typed at 2.1.288" fact is read from `<skill-root-a>` (`<skill-root-b>` is byte-identical, section 1); every "observed at 2.1.289" fact is a CLI or Node run on this machine. Main checkout HEAD during the run: 7af0290b; `git --no-optional-locks status --porcelain` before and after showed the same two untracked entries (`.codex-remote-attachments/`, `PROMPT-AUDIT-2026-10-04.md`). Repository line cites are at 7af0290b. `tools/mods/spatial-guardian/hooks/register.js` last changed at 71db3d7d, so the tree and the cites agree (its sha256 at 7af0290b and in the tree: dd420213ee0f05595e0d8704fbe7f00b77c92756b149b1a20456a438e1f96f45). `<scratch>` is this run's scratch folder; `<profile>` marks a redacted user-profile path. Brief: `state/directives/MODS-V1-2026-10-05.md` §2; the five questions are its §2.4.

Nothing was installed, enabled, loaded or started: no Claude session, no `claude plugin` subcommand other than `validate` and `test`, no write outside `<scratch>` and `D:/wt-targets/guardian-v1-p0/` (left empty).

## 1. The installed build, and whether the types read at 2.1.288 still hold

**Answer.** Observed at 2.1.289: the binary is 2.1.289, `claude plugin test` on a probe copy of the Guardian folder passes 39 of 39, and `validate` exits 0 with the same two hook lines Amendment 8 recorded. Typed at 2.1.288: the two plugin-authoring folders are byte-identical, so there is one 2.1.288 type text. The 2.1.289 bundle folder holds no plugin-authoring folder (observed), so the types cannot be re-read at 2.1.289: "still hold" is shown by behaviour (the test and `validate` runs), not by a type diff.

**Sources.**
- `diff -r <skill-root-a> <skill-root-b>`: exit 0, no difference. sha256 of `types/claude-code.d.ts` in both: 36af9e4799354bf878a91d1ea7c4632d0eca7c620b4557ace6afc8a87647cdb1; of `reference.md` in both: ad5f1688672600495233d09b597c1bc4ef5d8f790c32caf9490d4fd2e5bb71f4. Each folder holds `examples/`, `reference.md`, `types/claude-code.d.ts` (757081 bytes).
- Observed at 2.1.289: the bundled-skills folder named 2.1.289 holds one subfolder, whose listing starts `claude-api/`; no `plugin-authoring`.
- Declarations Guardian relies on (module line at 7af0290b; type line at 2.1.288 in `<skill-root-a>/types/claude-code.d.ts`):

| Guardian uses | register.js | typed at |
|---|---|---|
| `register(on)` export, both `on` forms (pattern; pattern plus `{ tool }` matcher) | :457-463 | `Register` :8673; `On` :6343-6346 |
| `.catch(() => ({ deny }))` on each refusing registration | :459-463 | `CatchHandler` :1002; `<skill-root-a>/reference.md`:72 |
| the hook result `{ deny: string }` | :406, :382-390 | `ToolCallResult` :11997, `deny` :12002 |
| the event: `e.tool`, `e.command` (Bash, PowerShell), `e.file_path`, `e.content`, `e.old_string`, `e.new_string` (Write, Edit), `e.notebook_path` (NotebookEdit) | :393-407 | `ToolCallInput` :11961 (envelope plus `AgentLoop`); inputs Bash :15177, Edit :15265, NotebookEdit :15427, PowerShell :15440, Write :15752 |
| `e.agentId`, absent on the main loop | :380, :413 | `AgentLoop` :172-182 |
| `$.fs.stat(path, { resolve: true })` and `realPath` | :266, :276 | `stat` :3113; `FsStat.realPath` :4721; `FsStatOptions` :4727 |
| `$.fs.read` (rejects over 4 MiB) | :319 | `read` :3034 (bound stated :3020-3022) |
| `$.process.run(argv, { timeoutMs })`, `exitCode`, `stdout`, `isStdoutTruncated` | :330, :449 | `run` :3307; `ProcessRunInit` :7538; `ProcessRunResult` :7565 |
| `$.agent.list()` rows `{ id, type }` | :359 | `list` :2979; `AgentInfo` :125-162 |
| `$.session.messages({ agentId })` | :363 | `messages` :2567 |
| `$.session.usage({ breakdown: 'summary' })`, `context.breakdown.percentage` | :426 | `usage` :2642; `SessionUsage` :11015; `percentage` :2000 |

**Probe and output** (copy of `tools/mods/spatial-guardian/` at `<scratch>/probe/spatial-guardian`; each run under `timeout`).
- `claude plugin test spatial-guardian`: exit 0. Lines byte-copied from its output:

```text
 39 pass
 0 fail
Ran 39 tests across 1 file. [1.57s]
```

- `claude plugin validate spatial-guardian`, text and `--json`: exit 0 each. The one warning, byte-copied:

```text
  ❯ version: No version specified. Consider adding a version following semver (e.g., "1.0.0")
```

- The `hooks:` and `calls:` lines are in section 5. Each is byte-identical to the line in Guardian's Amendment 8 (`grep -F -c` on `tools/mods/GUARDIAN-V0-PREREGISTRATION.md`: 1 for each), so nothing Guardian declares changed between the 2.1.288 engine (Amendment 8) and 2.1.289.

**For the brief:** keep. Not verifiable without a live session: that a live 2.1.289 session still hands `e.agentId` and refuses as Amendment 9 recorded (E1 to E5 at 2.1.289 are recorded there and stand); the probe is Amendment 9's E5 shape, which the live checks E7 to E9 repeat for the new rules.

## 2. For G7: every agent use since 2026-09-27 of `rebase`, `pull --rebase` or `pull -r`, `merge --squash` and `gh pr merge`

**Answer.** Observed in the record: exactly one use since 2026-09-27, `gh pr merge 138 --merge` by the custodian's main loop (session 805f1d1e, 2026-09-28T07:00:34Z, PR #138, docs-only under AUTONOMY §9; merge commit 32521982). It is legitimate under §9 and so is the brief's OPEN item (its §5, item 3). There is no `git rebase`, `git pull --rebase` or `-r`, or `git merge --squash` by any agent in this repository since 2026-09-27, in the reflog, the ledger or the transcripts.

**Sources and method.**
- Reflog: `git --no-optional-locks reflog --date=iso -n 100000` (1544 lines, 2026-08-01 to 2026-10-05). Since 2026-09-27 the main checkout's HEAD reflog holds no `rebase`, no `pull --rebase` and no squash entry. Of its 430 entries since 2026-09-27, the `merge` entries are 33 `merge origin/main: Fast-forward` and 3 `merge origin/main: Merge made by the 'ort' strategy` (not squash); the `pull` entries are `pull -q --ff-only: Fast-forward` (2026-09-27 15:55:47 +0200) and `pull -q: Fast-forward` (2026-10-04 13:11:56 +0200: a plain pull, which G7 does not refuse). Four entries hold the words rebase or squash only inside a commit subject, and three are `reset: moving to ...`, which G7 does not name. The three live worktrees' reflog files (`.git/worktrees/*/logs/HEAD`, read only) hold no rebase, pull, squash or cherry-pick entry since 2026-09-27; worktrees removed since have no reflog left to read (a limit).
- Transcripts: the 1000 `.jsonl` files of this project's folder (main sessions and subagent transcripts), read only; the 534 modified since 2026-09-20 were scanned for Bash and PowerShell tool calls (no PowerShell call in this project matched any scan in this report). Calls were matched at command position (start of line, or after `;`, `&`, `|`, `(`, backtick, `{`), with git's global options and `gh -R` skipped, by `<scratch>/g7strict.mjs` over `<scratch>/hits.jsonl`. A broader match (any line holding `git` and `rebase`, and so on) found 9 calls since 2026-09-27: the §9 merge itself, two worker test files that exercise `git rebase` in temporary repositories (below), and six that are text only (a PR body or `--body` saying "merge commit, not a squash or rebase", a `gh api` jq filter naming `allow_rebase_merge`, a `gh run view` log loop, a ledger or gate note), none a shell command.
- Ledger: the wave-2 prompts bullet in `state/CUT-STATE.md` at 7af0290b (line 423 there; the block carries no entry number, so this is a description, not a pinned ledger cite) says the prompts file went in as PR #138, merged by the custodian under AUTONOMY §9. `git --no-optional-locks log -3 --format='%h %cI %s' 32521982` shows the merge commit 32521982 at 2026-09-28T09:00:52+02:00 above the PR branch's commits.

| When | Agent | Shape (no profile path) | Result | Legitimate? |
|---|---|---|---|---|
| 2026-09-28T07:00:34Z | custodian main loop, session 805f1d1e | `cd C:/dev/wt/wave2-prompts && git fetch -q origin && node scripts/plan/docsOnly.mjs origin/main HEAD ... ; ... gh pr merge 138 --merge --subject "Merge pull request #138 from ..." --body "Docs-only (AUTONOMY.md §9): ..."` | `docsOnly=0 cites=0 quotes=0 plan=0`, then `MERGED` | Yes, by AUTONOMY §9 (docs-only, mechanically verified, merge commit): OPEN item |

Context before the window, for the form's rationale (not in the window):
- 2026-09-20T15:17:30Z `git pull -q --rebase origin main` (session 53e23d1b, custodian).
- 2026-09-24T00:37:51Z and 10:37:56Z `git rebase origin/main` (custodian, sessions 53e23d1b and 856bc41b; both ran).
- 2026-09-24T19:42:12Z `git rebase -q origin/main && ...` (session 856bc41b), denied by the auto-mode classifier.
- 2026-09-25T07:04:06Z `gh pr merge 121 --merge` (session 5d626cec, §9).

Outside this repository, under the same user-scope plugin (other projects' transcript folders, 234 files, 120 modified since 2026-09-20): three `git rebase -q ...` calls in the ClinicaNutri project, 2026-09-30T21:42:01Z, 2026-09-30T21:42:57Z and 2026-10-03T14:54:16Z (feature-branch rebases in that repository; whether legitimate is that project's rule).

Two worker test files exercise `git rebase` inside temporary repositories (subagent transcripts of session a2e86f25, 2026-09-27T16:14:41Z and 18:17:46Z; the second holds `run('git', ['rebase', 'main'], ...)`). The rebase runs from Node, not from a Bash command line, so G7's text reading would not see it.

**For the brief:**
- **OPEN (form):** the §9 case. One real use, legitimate; G7 as the brief words it refuses it. The recommended answer (§9 auto-merge not used while Guardian is installed) is the human's covering line (brief §5, item 3).
- **OPEN (form):** reach beyond this repository. Guardian is installed at user scope, so G7 would also refuse the 3 ClinicaNutri rebases of the last two weeks. Whether a user-scope rule can be scoped to one repository is not typed in the files read; not verifiable without a live session (probe: a session in another repository making a refused-shape call).
- **Keep:** the other three shapes; none occurred, so nothing legitimate is lost.
- Limits that stay true: aliases, scripts, `git config pull.rebase` and rebases run from code are not read.

## 3. For G8: every path under the user's Claude folder that an agent wrote through a tool in the last two weeks

**Answer.** Observed in the record (2026-09-20 to 2026-10-05): every write is under `<claude-home>/projects/<project>/memory/`, with one clean-up delete under a session's `tool-results` folder. Nothing was written at settings, plugins, skills, agents, commands or hooks locations, or to the user-level `.claude.json`. All are legitimate, and G8 as worded (settings, plugins, skills, agents, commands, hooks) refuses none. The risk is the other way: `.claude` folders that are not the user's (the repository's own) were written 388 times in the same period and must pass.

**Sources and method.** The same transcripts as section 2 (`<scratch>/scan.mjs`, `<scratch>/hits.jsonl`; other projects `<scratch>/hits-other.jsonl`): Write, Edit, NotebookEdit and MultiEdit `file_path` / `notebook_path`; and Bash command text naming the user's folder, read by hand for write verbs (`>`, `>>`, `tee`, `cp`, `mv`, `rm`, `sed -i`, `printf >>`, `mkdir`, `touch`).

| Location | Writes | By | Legitimate? |
|---|---|---|---|
| settings (`<claude-home>/settings*.json`; the user-level `.claude.json`) | 0 | none | n/a |
| plugins (`<claude-home>/plugins/`) | 0 written; 2 reads: `ls ~/.claude/plugins ~/.claude/skills` (2026-10-03T18:21:41Z) and `ls -la ~/.claude/plugins/` (2026-10-04T10:12:47Z), custodian main loop | custodian | reads, yes |
| skills, agents, commands, hooks (the user's) | 0 | none | n/a |
| `<claude-home>/projects/C--dev-spatial-ide/memory/*.md` through Write (18) and Edit (8): 20 distinct files (`MEMORY.md` and 19 topic files, e.g. `gate-commits-on-check-exit-code.md`, `worker-trailer-own-model.md`), 2026-09-22T21:33:55Z to 2026-10-05T11:22:09Z | 26 | main loops of the custodian sessions (53e23d1b, 856bc41b, 5d626cec, a2e86f25, 805f1d1e, 2ef99c1a, e12d1b11, 874d0083, 128d8fa3); no subagent | yes: the custodian's auto-memory |
| the same folder through Bash: 8 `cat >> <claude-home>/projects/C--dev-spatial-ide/memory/<file>.md` (heredoc or file), and 5 `sed -i` / `printf ... >>` calls on `MEMORY.md` or a topic file (some after `cd` into the folder), 2026-09-24T02:19:45Z to 2026-10-04T09:54:45Z | 13 calls | custodian main loops | yes; **not covered by G8 as worded** (a Bash write is not a Write, Edit or NotebookEdit) |
| `<claude-home>/projects/C--dev-spatial-ide/<session>/tool-results/<file>.txt` through Bash `rm -f` | 1 (2026-09-30T01:01:08Z, a worker subagent of session e06ab350, removing its own tool-result spill file) | worker subagent | harmless clean-up; not covered by G8 |
| other projects, memory only: the home-folder project 41 (Write 5, Edit 36); ClinicaNutri 44 (Write 10, Edit 34) | 85 | main loops in those projects | yes (outside this repository; Guardian is user-scope) |

False-alarm risk, observed in the same transcripts: Write and Edit calls whose path holds a `.claude` segment but is not the user's folder.
- the repository's `.claude/settings.json` (1 Edit);
- the repository's `.claude/agents/{evidence-reader,worker-high,tester-high}.md` (3 Writes);
- `.claude/worktrees/<name>/...` files (369 Edits, 15 Writes), which are worktree files of the repository.

G8 therefore has to anchor on the user's folder (a resolved real path under it), never on a `.claude/settings` or `.claude/agents` suffix.

Also checked: Bash `claude plugin ...` and `claude mcp ...` calls since 2026-09-20 (`<scratch>/hits-claudecmd.jsonl`, 157 calls whose text names the pair). The executed subcommands were `plugin test` (57 command lines), `plugin validate` (44), `plugin list` (5) and `plugin --help` (4). None was `install`, `uninstall`, `enable`, `disable`, `update`, `marketplace` or `mcp add|remove`; the other matches of those words are README drafts and reports inside heredocs or ledger text.

How a mod can know the user's folder (typed at 2.1.288): `$.env.get(name)`, the name a string literal (`<skill-root-a>/types/claude-code.d.ts`:3390, doc :3376-3379); `validate` at 2.1.289 then lists the names read (section 5). The engine's `memory_write` and `Projects` tools take a store and a path inside it, not a file path (`<skill-root-a>/types/claude-code.d.ts`:15404, :15452), and are not a path write.

**For the brief:**
- **Keep** the locations list; memory is correctly absent from it. Say in the form that `projects/…/memory` is deliberately allowed.
- **OPEN (form):** how G8 finds the user's Claude folder (`$.env.get` of a name, or a suffix test that cannot hit the repository's `.claude/settings.json` and `.claude/agents/`). The form declares the env names, and `validate` will show them.
- **OPEN (form):** Bash and PowerShell writes into the user's folder (13 memory appends, 1 `rm`) are legitimate and outside G8's wording; the brief names only `claude plugin` and `claude mcp` commands for the shell side, so these stay allowed. The form should say so.
- **OPEN (form):** the reach into other projects (85 memory writes there; none refused by the locations list).

## 4. For G9: how build targets are cleaned today, what G9 would refuse, and whether a subagent's call exposes its working directory

**Answer.** Observed in the record (2026-09-20 to 2026-10-05; 399 Bash calls, 413 matching lines, `<scratch>/hits-clean.jsonl`): targets are cleaned by removing a worktree's own target folder `D:/wt-targets/<name>` after `git worktree remove`. No call in the window is a `cargo clean` with no `-p`, a `git clean` with a force flag in the main checkout, or a recursive delete of the main checkout's `target` or data folders, so G9 as worded refuses none of the observed shapes. Typed at 2.1.288: a `tool.call` event carries no working directory and `$.agent.list()` rows carry none, so G9 cannot tell the main checkout from a worktree by the event alone; the one typed route is an `agent.spawn` hook's `cwd`.

**Sources.**
- The rule: `AI_DEVELOPMENT.md`:161-168 @ 7af0290b sha256:1274731d09667c5918b18a1f3d7f6b0ec73a62a90187361ad93aa5467cd805df (never wholesale-clean `target/`; reclaim by removing only `target/debug`, `target/release`, `frontends/shell/src-tauri/target`), and `AI_DEVELOPMENT.md`:169-174 @ 7af0290b sha256:ea2c4747c80047c97ac13a676dd032fe6d473a6d5a43ce1e95052c4786c21f2e (inspect before removing, in its own step; name both target directories on every cargo call).
- Ledger: the commit subjects of 7af0290b and ba988772 record "#177's worktree removed" and "#176's worktree and target removed" (`git --no-optional-locks log`), the same two-step shape.
- Transcripts, command shapes (counts are command lines; `<name>` stands for a worktree name):

| Shape | Count | Where it ran | G9 as worded |
|---|---|---|---|
| `git worktree remove C:/dev/wt/<name> && rm -rf D:/wt-targets/<name>` (also `/d/wt-targets/<name>`, two such folders in one `rm -rf`, `git worktree remove --force D:/wt-targets/<name>/scratch-b`) | 18 | custodian main loop and subagents, 2026-09-24 to 2026-10-05 | passes (not the main checkout's target) |
| `CARGO_TARGET_DIR=C:/dev/spatial-ide/target cargo clean -p spatial-skp` and `-p spatial-kernel`, run from a worktree (`cd C:/dev/wt/crs-unit-fact-and-bounds`), 2026-09-24T03:06:54Z and 03:07:09Z, a subagent of session 856bc41b; the second printed `Removed 19121 files, 12.0GiB total` in the main checkout's target | 2 | worktree cwd, main target by env | passes (limited to a package) |
| `rm -rf renderer/bundle-viewer/dist renderer/bundle-viewer/dist-metafile.json [frontends/shell/src/generated ...]` and `rm -rf node_modules` (relative operands) | 19 | cwd not in the call | passes (not `target`, not a data folder) |
| `cd C:/dev/wt/adr-035-dataset-session-ended && rm -rf target` (2026-09-24T22:20:34Z, subagent of 856bc41b) | 1 | a worktree, named by a `cd` prefix | passes only if G9 reads the `cd` prefix; a rule reading the operand `target` alone would refuse it |
| `rm -rf "frontends/shell/src-tauri/devspatial-idefrontendsshellsrc-tauritarget/"` and `rm -rf devspatial-idetarget` (a path mangled by a lost backslash, 2026-09-22T23:20:22Z and 2026-09-29T23:29:22Z) | 2 | worktrees | passes (not `target`) |
| `git clean -fdq` in `C:/dev/exp-gate-scratch/clone` (2026-09-27T14:39:08Z, subagent of a2e86f25), and `git clean -ndx` (a dry run, 2026-09-30T01:01:37Z) | 1 and 1 | a scratch clone; a worktree | the first is a force-flag `git clean` outside the main checkout: passes only if G9 knows the cwd |
| `rm -rf C:/dev/<scratch folder>`, `rm -rf $S/...`, `rm -rf /tmp/...`, `fs.rmSync(dir, { recursive: true, force: true })` from node | the rest | scratch folders | passes |

Whether a subagent's call exposes its cwd (typed at 2.1.288, `<skill-root-a>/types/claude-code.d.ts`):
- `ToolCallInput = ToolCallEnvelope & AgentLoop` (:11961). The Bash input is `command`, `timeout`, `description`, `run_in_background`, `dangerouslyDisableSandbox` (:15177-15188) and the PowerShell input has the same fields (:15440-15451). `AgentLoop` adds only `agentId` (:172-182). No cwd.
- `AgentInfo` (:125-162) has `id`, `description`, `type`, `status`, `parentId`, `spawnedBy` and `name`: no cwd.
- `$.session.cwd()` is "the directory the session runs in" (:2569-2571) and `$.session.root()` "where it started" (:2574-2579); neither says it follows a subagent. `$.process.run`'s default cwd is the session's (:7540-7541).
- `AgentSpawnInput` (:239) carries `cwd` (:317, the directory the subagent runs in when the call set one; undefined means the parent's) and `isolation: 'worktree'` (:444). Matching them to an `agentId` needs the hook's result (`AgentSpawnResult` :331). A new hook would add `agent.spawn` to `validate`'s `hooks:` line (predicted, not run).
- In every transcript call a worker's directory is spelled in the command (`cd C:/dev/wt/<name> && ...`), because an agent thread's shell cwd resets between calls.

**Probe and output.** The cwd question is typed, not run. Not verifiable without a live session: whether `$.session.cwd()` reads a worktree subagent's directory. The probe that would settle it: a probe mod logging `await $.session.cwd()` on a Bash call made by a subagent spawned with `isolation: 'worktree'`, run under the human's approval.

**For the brief:**
- **Keep** the three refused shapes and the allowed list (the build-output folders and a worktree's own target): no observed shape needs the rule loosened.
- **OPEN (form):** how G9 tells main from a worktree. The types allow two routes. One reads the operand's absolute spelling and a leading `cd <path> &&` only, and refuses when the base is unknown; its cost is that the 1 `rm -rf target` and 1 `git clean -fdq` above would be refused. The other adds an `agent.spawn` hook, a new declared hook that sits close to the brief's "not in v1: worktree protection beyond G9".
- **OPEN (form):** "its data folders". The rule text names `target/slice-evidence` and `target/fixtures` (the `AI_DEVELOPMENT.md` span above); the form should list them.
- Note for the form: `cargo clean -p <crate>` with `CARGO_TARGET_DIR` set to the main checkout's target, run from a worktree, did happen (2 calls, 12 GiB); it passes G9 as worded.

## 5. The log folder and the predicted `validate` lines

**Answer.** The Recorder's log root is `<parent of the main tree>/<main tree name>-local/evidence`: here `C:/dev/spatial-ide-local/evidence`, which exists (observed: a listing of `C:/dev/spatial-ide-local` shows only `evidence`). The folder beside it for Guardian is `C:/dev/spatial-ide-local/guardian`, which does not exist yet. Typed at 2.1.288: `$.fs` has `read`, `write`, `list`, `exists`, `stat` and `ancestors` and no append, so "one JSON line appended" is one new file per refusal (the Recorder's own shape) or a read-then-write of one file. Observed at 2.1.289 on a probe copy: a log write adds `$.fs.write` and `$.session.repo` to the `calls:` line, and `$.env.get` adds two `env` lines; the `hooks:` line does not change while G7 to G9 ride the existing Bash, PowerShell, Write, Edit and NotebookEdit registrations.

**Sources.**
- `tools/mods/spatial-evidence-recorder/hooks/register.js`:21 (`const LOG_SUFFIX = '-local/evidence';`), :365-375 (`logRootFrom`: the main tree is the git common directory's parent; root = `<its parent>/<its name>-local/evidence`), :395-400 (`resolveLogRoot`: `git rev-parse --path-format=absolute --git-common-dir`, cached on success), :383-391 (`writeRecord`: one new file per record, `$.fs.write`). The file is the same at 7af0290b and in the tree (last commit ba42e6f76117f4f579ff181f063492cfcdc1e631).
- `<skill-root-a>/types/claude-code.d.ts`: `fs.write` :3041 ("creating it and its directories as needed"); `$.session.repo()` :2600 and `SessionRepo.root` :10774-10779 (the main working tree's for a worktree); `$.env.get` :3390.
- Guardian declares no `$.fs.write`, no `$.session.repo` and no env read today (the baseline below), and its `README.md` says it writes no file (the brief, §1 last bullet and §2.1, corrects that sentence).

**Probe and output.** Observed at 2.1.289, `claude plugin validate` (text and `--json`, both exit 0) on `<scratch>/probe/spatial-guardian`. Baseline, byte-copied:

```text
  ❯ ./register.js hooks: tool.call, tool.call{tool=Bash}, tool.call{tool=PowerShell}, tool.call{tool=Write}, tool.call{tool=Edit}, tool.call{tool=NotebookEdit}
  ❯ ./register.js calls: $.agent.list (via g6Refusal), $.fs.read (via g3Refuses), $.fs.stat (via place), $.process.run, $.session.messages (via g6Refusal), $.session.usage (via contextFill)
```

The JSON form carries the same two strings under `contents[0].notes` (`<scratch>/validate.json`). Predicted v1 lines come from a second copy, `<scratch>/probe/spatial-guardian-v1pred`, whose `register.js` was edited to hold a `logRefusal` function using `$.session.repo()`, `$.env.get('USERPROFILE')` and `$.fs.write(...)`. It is a probe of what `validate` prints, not the v1 code; both `validate` runs exit 0. Byte-copied from the text output:

```text
  ❯ ./register.js hooks: tool.call, tool.call{tool=Bash}, tool.call{tool=PowerShell}, tool.call{tool=Write}, tool.call{tool=Edit}, tool.call{tool=NotebookEdit}
  ❯ ./register.js calls: $.agent.list (via g6Refusal), $.env.get (via logRefusal), $.fs.read (via g3Refuses), $.fs.stat (via place), $.fs.write (via logRefusal), $.process.run, $.session.messages (via g6Refusal), $.session.repo (via logRefusal), $.session.usage (via contextFill)
  ❯ ./register.js env writes: nothing
  ❯ ./register.js env reads: USERPROFILE
```

The `hooks:` line was byte-identical to the baseline in both probes. The `calls:` line differs only by the added entries, each named after the function that holds it. Not verifiable without a live session: that `$.session.repo()` and `$.fs.write` answer at 2.1.289 for a subagent in a worktree (probe: a hook that writes one file on a refused call, in a session the human starts).

**For the brief:**
- **Keep** the folder beside the Recorder's, `<main>-local/guardian`. **Narrow** "appends one JSON line" to "writes one new file per refusal", unless the form accepts a read-then-write (a race between two sessions, and a read that can fail).
- **OPEN (form):** find the root with `$.session.repo()` (no process call) or with the Recorder's `git rev-parse` call; the second adds a `$.process.run` on every refusal and its 2000 ms timeout.
- The form declares `$.fs.write`, `$.session.repo` and any `$.env.get` name; `validate` must show exactly those (brief §2.5's acceptance).

## 6. The G1 over-refusals on record

**Answer.** Observed in the record since the install on 2026-10-04: six G1 refusals in this project's transcripts (the ledger counts four), all six false alarms, none a real catch; no G1 refusal at all in the other projects' transcripts (234 files). Each is produced by one splitter state: an odd quote in heredoc text leaves the last quote open to the end of the command, so a segment holding the word `push` cannot be tokenised and is refused by the unbalanced-quote rule (`register.js`:215-218). On a scratch copy of the module with that one rule removed (`<scratch>/harness/nounbal.mjs`), none of the six is refused.

**Sources.**
- Guardian's Amendments 8 and 10 (`tools/mods/GUARDIAN-V0-PREREGISTRATION.md`, §10).
- The ledger: `state/CUT-STATE.md` at 7af0290b, the bullets naming two over-refusals at 11:33:53Z and 11:42:00Z and a "fourth G1 over-refusal" in the Recorder v0.1 build worker's run (no entry numbers in the block).
- The transcripts: `<scratch>/scan-refusals.mjs` over every `.jsonl` of the project, 2026-10-04 onward (`<scratch>/refusals.jsonl`). It holds 17 spatial-guardian refusals in all: 6 G1, 3 unplaceable-path, 2 G6 (the E5 probes of Amendments 8 and 9), and G2, G3 and G4 twice each (E1 to E3 of Amendments 8 and 9). One more transcript line only names the plugin (a directory listing of mine).
- The six G1 commands were re-run through a scratch copy of `register.js` with its helpers exported (`<scratch>/harness/trace.mjs`): `pushRefused` returns true for each, and the refusing step is `unbalanced-segment-with-push` in both readings for each. For the 11:34:45Z one the quoted-token rescan (:219-224) also matches a quoted token holding the words `git` and `push`; the unbalanced rule alone is enough to refuse it.

Byte-copied by `<scratch>/make-q6.mjs` from the transcripts (`<profile>` marks 4 redacted user-profile paths in the lines shown; nothing else is altered; an elision is marked with its byte count):

```text
CMD 1
  result time 2026-10-04T11:33:53.611Z; transcript 874d0083-a9e4-4662-82dc-77d80de1259a; command 422 bytes, 7 lines; 5 / 7 segments in reading 1 / reading 2
  reason (byte-copied from the tool result): <tool_use_error>spatial-guardian G1: refused, because this git push force-pushes or deletes a remote ref.</tool_use_error>
  command (byte-copied, whole):
    | git fetch -q origin && git status -sb | head -1 && git commit -s -q -F - <<'EOF'
    | docs(state): #170's gate-2 architect PASS filed (gate-log 384; no S1, no S2; read a byte-exact export of the head); the block flushed
    | 
    | Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>
    | Claude-Session: https://claude.ai/code/session_01JeU7h98xrTorztiep3Zgmg
    | EOF
    | git push -q origin main && git log --oneline -1 | cut -c1-100
CMD 2
  result time 2026-10-04T11:34:45.253Z; transcript 874d0083-a9e4-4662-82dc-77d80de1259a/subagents/agent-a6ab62bdc0788337b; command 5338 bytes, 100 lines; 4 / 6 segments in reading 1 / reading 2
  reason (byte-copied from the tool result): <tool_use_error>spatial-guardian G1: refused, because this git push force-pushes or deletes a remote ref.</tool_use_error>
  first apostrophe at byte 178, line 1 (byte-copied line, cut at 200 bytes):
    | S="<profile>/AppData/Local/Temp/claude/C--dev-spatial-ide/874d0083-a9e4-4662-82dc-77d80de1259a/scratchpad/recorder-p0"; cat > "$S/probe-recorder/test/recorder.test.ts" <<'EOF'
  first "push" at byte 1192, line 23 (byte-copied line, cut at 200 bytes):
    |   on('fs.write', async ($: any, e: any) => { writes.push(e.text); return { value: undefined } })
CMD 3
  result time 2026-10-04T11:42:00.825Z; transcript 874d0083-a9e4-4662-82dc-77d80de1259a; command 4299 bytes, 14 lines; 7 / 11 segments in reading 1 / reading 2
  reason (byte-copied from the tool result): <tool_use_error>spatial-guardian G1: refused, because this git push force-pushes or deletes a remote ref.</tool_use_error>
  first apostrophe at byte 355, line 2 (byte-copied line, cut at 200 bytes):
    | - $T - **Guardian v0 is INSTALLED by the human** at user scope (install record 11:28:29Z; plugins reloaded in this session, 11:31:18Z). **The E-rows are recorded** as the form's Amendment 8 (class 1), [... 9 bytes elided]
  first "push" at byte 1277, line 9 (byte-copied line, cut at 200 bytes):
    |   - **An unplanned live G1 over-refusal (not a probe), 11:33:53Z:** an apostrophe in a heredoc commit message left the later plain push in an unbalanced segment. Nothing ran. The commit and push ran a [... 39 bytes elided]
CMD 4
  result time 2026-10-05T07:45:36.618Z; transcript 128d8fa3-d9ec-4243-88f6-28712bd74344/subagents/agent-a92fc753f0d78f88f; command 2587 bytes, 34 lines; 4 / 5 segments in reading 1 / reading 2
  reason (byte-copied from the tool result): <tool_use_error>spatial-guardian G1: refused, because this git push force-pushes or deletes a remote ref.</tool_use_error>
  first apostrophe at byte 185, line 1 (byte-copied line, cut at 200 bytes):
    | SD="<profile>/AppData/Local/Temp/claude/C--dev-spatial-ide/128d8fa3-d9ec-4243-88f6-28712bd74344/scratchpad/recorder-v01-p0"; mkdir -p $SD/timing; cat > $SD/timing/gittime.mjs <<'EOF'
  first "push" at byte 1842, line 23 (byte-copied line, cut at 200 bytes):
    |   const b = await triple(BEFORE); bw.push(b.wall); b.calls.forEach((c) => codes.add(c.code));
CMD 5
  result time 2026-10-05T10:57:56.353Z; transcript 128d8fa3-d9ec-4243-88f6-28712bd74344/subagents/agent-a14bd64dce58dd3c4; command 4687 bytes, 106 lines; 23 / 57 segments in reading 1 / reading 2
  reason (byte-copied from the tool result): <tool_use_error>spatial-guardian G1: refused, because this git push force-pushes or deletes a remote ref.</tool_use_error>
  first apostrophe at byte 202, line 1 (byte-copied line, cut at 200 bytes):
    | cd C:/dev/wt/rec01/tools/mods/spatial-evidence-recorder/test && cat > "<profile>/AppData/Local/Temp/claude/C--dev-spatial-ide/128d8fa3-d9ec-4243-88f6-28712bd74344/scratchpad/edit-tests-1.mjs" <<'EOF'
  first "push" at byte 2405, line 57 (byte-copied line, cut at 200 bytes):
    |       w.sleeps.push(e.ms)
CMD 6
  result time 2026-10-05T14:04:00.699Z; transcript 128d8fa3-d9ec-4243-88f6-28712bd74344/subagents/agent-a607df38b2051c964; command 1589 bytes, 26 lines; 9 / 9 segments in reading 1 / reading 2
  reason (byte-copied from the tool result): <tool_use_error>spatial-guardian G1: refused, because this git push force-pushes or deletes a remote ref.</tool_use_error>
  first apostrophe at byte 165, line 1 (byte-copied line, cut at 200 bytes):
    | S="<profile>/AppData/Local/Temp/claude/C--dev-spatial-ide/128d8fa3-d9ec-4243-88f6-28712bd74344/scratchpad/guardian-v1-p0"; cd $S/harness; cat > opener.mjs <<'EOF'
  first "push" at byte 960, line 17 (byte-copied line, cut at 200 bytes):
    |     if (ch === "'" || ch === '"') { quote = ch; qStart = k; opens.push([k, ch]); continue; }
redactions marked <profile>: 4
```

Where the last open quote sits and who ran each (observed: a replica of the quote loop of `register.js`:58-97, `<scratch>/harness/opener.mjs`; the runs named by their `meta.json` `agentType` and description):

| # | Time (Z) | Run | Final open quote | Real catch or false alarm | Splitter state |
|---|---|---|---|---|---|
| 1 | 2026-10-04T11:33:53Z | custodian main loop, session 874d0083 (Amendment 8; ledger) | line 2, in `#170's` inside the heredoc | false alarm: a plain `git push -q origin main` on the last line, no forcing spelling | the single-quote state `register.js`:60-63 opened at :75-79 and never closed; `tokenise` returns `unbalanced` (:154); refused by :215-217 (second reading: the same) |
| 2 | 2026-10-04T11:34:45Z | worker "Evidence Recorder v0 P0 fact-finding" (agent a6ab62bd): a heredoc writing a test file with `writes.push(e.text)` | line 100, a trailing `sed` quote | false alarm: `.push(` is a JavaScript method, no git command | the same; the rescan state :219-224 matches too. **Not in the ledger.** |
| 3 | 2026-10-04T11:42:00Z | custodian main loop, session 874d0083 (Amendment 8; ledger) | line 8, in `custodian's` | false alarm: ledger text holding the word push, no git command at all | the same |
| 4 | 2026-10-05T07:45:36Z | worker "Evidence Recorder v0.1 P0" (agent a92fc753): a heredoc writing a JavaScript file with `bw.push(...)` (Amendment 10; ledger) | line 28, in a `join(',')` template | false alarm: no git command follows | the same |
| 5 | 2026-10-05T10:57:56Z | worker-high "Build Evidence Recorder v0.1" (agent a14bd64d): a heredoc holding `w.sleeps.push(e.ms)` and `w.writes.push(...)` in test text (the brief's named case; the ledger's "fourth") | line 104, in `console.log('ok')` | false alarm: `.push(` in test text | the same |
| 6 | 2026-10-05T14:04:00Z | this P0 run (agent a607df38): a heredoc writing `opener.mjs` with `opens.push(...)`; nothing ran | line 23 | false alarm: `.push(` in probe code | the same |

Also seen, not G1 and not in the brief's §2.1 (off scope, recorded for the form): three Writes refused with `spatial-guardian: refused, because the path cannot be placed.` for a new file whose folder did not exist yet. They are at 2026-10-05T07:45:45Z and 07:45:54Z (the Recorder v0.1 P0 worker, Amendment 10) and 13:57:46Z (this run, cleared by creating the folder with Bash first). `README.md` does not name that over-refusal.

**For the brief:**
- **Keep** §2.1's "both shapes pass": the six shapes have one cause, so the fix is confined to the unbalanced-quote rule's reading of heredoc text. The brief's own constraint (a force spelling inside a heredoc body is still refused, "a heredoc can feed a shell") means the fix cannot simply drop the rule.
- **OPEN (form):** how a heredoc body is read. Terminator-aware splitting (read `<<'WORD'` or `<<WORD`, then the body to the terminator line) or a narrower rule on the unbalanced segment. The six cases give the fixtures: #1 (an apostrophe in prose, then a plain `git push` after the heredoc: must pass); #2, #4, #5 and #6 (`.push(` in code text: must pass); #3 (the word in prose: must pass); and the force-spelling-in-heredoc shapes v0 refuses must stay refused.
- **OPEN (form):** the ledger counts four and the transcripts six (the run of #2 and this run's #6 are not in the ledger); the log of §2.2 is what makes the count mechanical.
- **Keep** the README correction (§2.1): its over-refusal list should name this shape and the unplaceable-path shape.

## 7. Open items for the form, in one list

1. G7 and AUTONOMY §9: one legitimate use (#138, 2026-09-28); the human's covering line (brief §5, item 3).
2. G7's reach in other repositories (ClinicaNutri, 3 rebases): a user-scope rule.
3. G8: how the user's Claude folder is found (`$.env.get`), anchored so the repository's `.claude/settings.json`, `.claude/agents/` and `.claude/worktrees/` pass.
4. G8: Bash and PowerShell writes into the user's folder (13 memory appends, 1 `rm`) are outside its wording.
5. G9: how main is told from a worktree (no cwd on `tool.call`); the fail-closed cost is 1 `rm -rf target` and 1 `git clean -fdq` seen.
6. G9: list the data folders (`target/slice-evidence`, `target/fixtures`).
7. Log: a new file per refusal or a read-then-write; the root by `$.session.repo()` or by the `git rev-parse` call; `validate`'s new `calls:` and `env` lines.
8. G1 fix: heredoc reading (terminator-aware), with the six fixtures above.
9. The unplaceable-path Write over-refusal (3 seen): outside §2.1, for the form to place or leave.
10. The ledger's count of G1 over-refusals (4) against the transcripts (6).

## 8. Commands run, with exit codes; probe folders left

Every command ran under a timeout (the Bash tool's, and `timeout N` for each `claude` call). Exit codes are the Bash tool's unless a line says otherwise.
- `claude --version` (start): 0, `2.1.289 (Claude Code)`; `claude --version` (end): 0, `2.1.289 (Claude Code)`.
- Read-only repository reads (`ls`, `wc`, `sed -n`, `grep`, `cat` of files under `C:/dev/spatial-ide`; `git --no-optional-locks` `reflog`, `log`, `show`, `ls-files`, `rev-parse`, `status --porcelain`): all 0.
- `diff -r <skill-root-a> <skill-root-b>`: 0; `sha256sum` of the type and reference files: 0.
- `claude plugin validate <probe>` (text, then `--json`) on `<scratch>/probe/spatial-guardian`: 0, 0. `claude plugin test <scratch>/probe/spatial-guardian`: 0 (39 pass, 0 fail). `claude plugin validate` (text, `--json`) on the prediction copy after its first edit: 0, 0; after its second edit: 0, 0.
- `node` over `<scratch>`: `scan.mjs`, `scan-other.mjs`, `scan-clean2.mjs`, `scan-claudecmd.mjs`, `scan-refusals.mjs` (three runs), `scan-refusals-other.mjs`, `scan-repo-claude.mjs`, `g7strict.mjs`, `harness/trace.mjs`, `harness/nounbal.mjs`, `harness/opener.mjs`, `make-q6.mjs`, `mk-claudecmd.mjs`, and short `node -e` summaries of their outputs: all 0, except one `node -e` summary that threw a TypeError on a shell-mangled regex (exit 1; rerun correctly, 0) and one `scan-clean.mjs` created by a quoted `node -e` that did not parse (exit 1; replaced by `scan-clean2.mjs`). The repeat-runner rule was not needed: no evidence run was repeated.
- One early `ls`, `find` and `du` over the transcripts folder passed the Bash tool's 60 s limit and finished in the background (exit 0); a `python3` line I put in a here-document returned nothing and was not used.
- Guardian refused, in this run, one Bash call (G1, #6 above; nothing ran) and one Write (unplaceable path); both were redone (the Bash call as a Write plus a plain run).
- Not run, by the hard limits: any `gh pr merge`, `git merge --squash`, `git rebase`, `git pull`, `cargo clean`, `git clean`, a recursive delete in the repository, a `claude plugin` subcommand other than `validate` and `test`, `claude mcp`, a Claude session; nothing under `<claude-home>` or `C:/dev/spatial-ide-local` was written; `C:/dev/wt/b1f` and `C:/dev/wt/b1f-b438c587` were not touched.

Probe folders left (sizes by `du -sk`, before this report was written):
- `<scratch>/probe/spatial-guardian` 83 KiB (copy of the Guardian folder), `<scratch>/probe/spatial-guardian-v1pred` 87 KiB (the prediction copy), `<scratch>/harness` 80 KiB (scratch copies of the module for the traces), `<scratch>` in all 1426 KiB (scans, traces, outputs).
- `D:/wt-targets/guardian-v1-p0/` 0 KiB (empty).

Model and handoffs: running as Sonnet 5.5 (`claude-sonnet-5-5`), no model override, no context handoff received or produced. Usage figures: none at hand.
