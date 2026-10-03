# spatial-guardian (Guardian v0)

The first Spatial IDE mod: a refuse-only plugin of function hooks for sessions in this repository. It never approves a call, rewrites a call's arguments, submits a prompt, calls a model, makes a network request or writes a file. Every refusing hook fails closed: it carries a catch that denies, so a hook that throws or overruns refuses the call instead of being skipped. The form is `tools/mods/GUARDIAN-V0-PREREGISTRATION.md`, and it governs this folder.

Built and tested against Claude Code 2.1.288 on Windows. Nothing here is claimed for another build, for macOS, or for Linux.

## What it refuses

Each reason Guardian returns starts with `spatial-guardian`, states Guardian's own fact, and carries no path from the call.

| Rule | Refuses | Ruling it enforces |
|---|---|---|
| G1 | A `git push` that force-pushes (`--force`, `-f`, a short-option cluster holding `f`, `--force-with-lease`, a `+` refspec, `--mirror`) or deletes a remote ref (`--delete`, `-d`, a `:` refspec, `--prune`), found through git's global options and inside a quoted command string. A segment holding `push` that cannot be tokenised is refused. Bash and PowerShell. | question round 34, item 3 |
| G2 | A Write or an Edit to `docs/01_Principles.md`, in any spelling of its path. | the project instructions: docs/01 is never edited |
| G3 | A change to an accepted ADR (any ADR whose status line is not Proposed, or has none) or to a filed preregistration (a `*PREREGISTRATION.md` that `git cat-file -e HEAD:./<name>` finds), except as a pure append. A Write must start with the file's current bytes. An Edit must have an `old_string` that occurs once, at the end of the file, and a `new_string` that starts with it. | ADRs are append-only, as are preregistrations; question round 44, item 1 (O-8) |
| G4 | An Edit under `state/directives/`, and a Write over a file that exists there. A Write that creates a new file is allowed. | directives are filed verbatim, once |
| G6 | For a subagent of type architect, lead-data or evidence-reader: a Write or Edit outside the path its brief declares on a line of the form `REPORT PATH: <absolute path>`. A brief with no such line, or several, refuses every write. | question round 41, item 3; question round 43, item 4 |
| N1 | Nothing. When the main conversation's context passes 80 percent and the continuity block is stale, a tool result gets one appended line for the model, at most once per 10-point band. | AUTONOMY section 7 (the flush) |

G2, G3, G4 and G6 guard Write and Edit, and NotebookEdit on its `notebook_path` as an Edit that is never an append. MultiEdit is not a tool in build 2.1.288, so nothing is registered for it. A path that cannot be placed (drive-relative, `\\` or `//`, an empty, `.` or `..` name, a name holding a drive, or one the file system cannot resolve) is refused. Paths are matched on the resolved path with both separators and ASCII case ignored, on every platform alike, so a case-sensitive volume can see a refusal a stricter match would not.

G5, the profile-path refusal, is not in v0 (question round 43, item 3). The commit-msg and pre-commit hooks and the CI range check remain that refusal.

N1's percentage is the compaction-window percentage from the local summary breakdown of the session's usage. When the engine returns no breakdown, N1 does nothing. N1's staleness check restates the Stop hook's predicate in `hooks/continuity.mjs`, and `scripts/hooks/guardian-continuity-parity.test.mjs` holds the two together on one fixture set. A change to either predicate is made with the other, in the same piece.

## What it does not claim

- Nothing live before its E-row in the form (section 4): `agentId` on a live subagent's calls, `context` reaching the model, the `realPath` spellings the engine returns, the live percent figure.
- Writes by Bash, PowerShell or any tool other than the ones registered here. A restore done with git is unseen by G3.
- For G1: aliases, scripts, configured `+` refspecs and environment variables. G1 reads the command string only.
- A case alias of a filed preregistration or of an accepted ADR on a case-insensitive volume may keep its own spelling, so git's lookup of it can miss.
- Parity for a history shape outside the parity fixtures, or for a ledger blob of 4194304 bytes or more (above that size the engine cuts the stream and the mod reads not judged).
- Parity for a session whose working directory differs from the Stop hook's project root.
- Cloud sessions and edits made on GitHub. CI and the gates stay.
- That the installed copy is isolated from later changes to this folder (E0 records whether an install copies or references it).
- Any build other than 2.1.288, any latency figure.

## Install (the human's alone)

Installing a mod is a security-posture change. It needs the human's typed approval after both gates, and he installs it himself. Nothing in this repository installs, enables or loads it.

1. `claude plugin marketplace add <repository>/tools/mods --scope user`
2. `claude plugin install spatial-guardian@spatial-ide-mods --scope user`
3. `/reload-plugins`
4. Confirm the `/plugin` line the brief names (`state/directives/MODS-GUARDIAN-V0-2026-10-03.md:44` @ 1bb94e19 sha256:b446fb1dad9f228df029d8ffea2628f3a99f15239b9b44ce3e76aac99fdd7013).

Install from a checkout on main, at user scope. Never use the `project` or `local` scope: a plugin enabled there would be declared by a repository file.

## Turning it off

- Guardian alone: disable it in `/plugin`, or run `claude plugin disable spatial-guardian --scope user`.
- One session: start with `--safe-mode`. It also disables the user's other customizations.
- Not `disableAllHooks`: it also stops the repository's settings hooks (the Stop hook and the round mirror).

To remove it: `claude plugin uninstall spatial-guardian`.

## Acceptance, stop conditions, false refusals

The acceptance and stop conditions are the brief's section 5: `state/directives/MODS-GUARDIAN-V0-2026-10-03.md:49-57` @ 1bb94e19 sha256:5336670a5a51fe3cc8b94d5195c596fdbc7d43d08cbaab7965f04ceb19c09eaa.

A false refusal is logged in the ledger and the rule is narrowed through the usual process. A call Guardian should have refused and did not is a stop condition.

## The REPORT PATH convention

A lead-data brief carries one line of the form `REPORT PATH: <absolute path>` (question round 43, item 4). G6 reads it from the first message of the subagent's conversation. The write audit (`scripts/hooks/subagent-write-audit.mjs`) stays the primary check until E5 passes, and the backstop after it.

## Files

- `.claude-plugin/plugin.json`: the manifest.
- `hooks/hooks.json`: names the one hooks module.
- `hooks/register.js`: the hooks.
- `hooks/continuity.mjs`: N1's staleness judgment, pure, with no import and no call.
- `test/guardian.test.ts`: the plugin tests, run with `claude plugin test tools/mods/spatial-guardian`.
- `.gitignore`: keeps the engine-written `.claude-plugin/types/` folder out of git.
