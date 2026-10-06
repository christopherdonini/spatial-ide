# spatial-evidence-recorder (Evidence Recorder v0.1)

The second Spatial IDE mod: an observe-only plugin for sessions in this repository. It writes one line for each approved test command and, by design, one for each subagent turn; that subagent behaviour is unclaimed as live behaviour before its E-row E3. It never refuses, rewrites or answers a call, makes no model call and no network request, and writes nothing inside the repository. Every hook calls the next link once, with the event it received, and returns that call's own value. The forms are `tools/mods/EVIDENCE-RECORDER-V0-PREREGISTRATION.md` and `tools/mods/EVIDENCE-RECORDER-V0-1-PREREGISTRATION.md` (v0.1), and they govern this folder.

Built and tested against Claude Code 2.1.289 on Windows. The reads of the build's type declarations behind the hooks were made at 2.1.288 and are claims about that build only. Nothing here is claimed for another build, for macOS or for Linux.

## What it records

A Bash call is recorded when one of its segments (split at `&&`, `||`, `;`, `|`, `&` and newlines outside quotes, after leading `NAME=value` words and `timeout <duration>`) starts with one of these:

| Row | Starts with |
|---|---|
| A1 | `cargo test`, without `--no-run`, and without `--list` after a `--` |
| A2 | `npm`, an optional `--prefix <dir>`, then `test`, or `run` with `test`, `verify`, `test:e2e`, `test:residency-trace` or `test:citation-integrity` |
| A3 | `node --test` |
| A4 | `node` and the path of `scripts/plan/verify.mjs`, `verify-cites.mjs`, `verify-quotes.mjs` or `verify-test-claims.mjs` |
| A5 | `node`, the repeat-runner's path (`scripts/evidence/repeat.mjs`, spelled as A4 spells a script path), a count `<n>` (a positive integer, no sign, no leading zero), `--`, and then a command that rows A1 to A4 approve as it stands |

A leading `cd <absolute dir> &&` sets the directory the tree is read in. A leading `/`, one ASCII letter, then `/` or the end of the path is read as that letter, a colon and a slash, then the rest (`/c/x` is `c:/x`, a bare `/c` is `c:/`); nothing else is translated, so `/tmp`, `/home`, `/cygdrive/c` and `/mnt/c` stay as written. The translation assumes the Bash tool is Git Bash; off Windows a one-letter top-level directory reads `unavailable`. A call with an open quote, a heredoc or a substitution is not approved. A call run in the background is passed through with no work.

The Bash tool is the route. A test command meant to be recorded is run through the Bash tool, in one of the spellings above. From install on, the custodian's worker and tester briefs tell agents to run approved test commands through the Bash tool, so that they are recorded.

## The repeat-runner

`node scripts/evidence/repeat.mjs <n> -- <command> [<arg>...]` runs the command `<n>` times in sequence, each after the previous ends, with no shell, in the caller's directory and environment. Every token after the first `--` is the command's argument list, as given (a later `--` included). It prints `run <i>/<n> exit=<result>` after each run, where the result is the exit status, `signal:<NAME>` or `spawn-error:<code>`, then `summary runs=<n> failed=<k>`. A run fails unless its result is `0`. The exit is 0 when no run failed, 1 when any did, and 2 for a malformed call (one usage line on stderr, nothing run). It never retries, never stops early, never runs two at once, and reads nothing the command prints.

Limits: with no shell, a command that is a `.cmd` or `.bat` file, `npm` and `npx` among them, cannot start on Windows, so each run prints `spawn-error` and counts as failed. Row A5 still approves an `npm` tail (row A2), so such a call is recorded as it happened; use a `cargo` or `node` command. The runner parses no env prefix and no `timeout` word after the separator, so a tail led by `NAME=value` or `timeout` matches no row; put such a prefix before `node`, where the matcher drops it and the command inherits it. Known misses of row A5: shell loops; `node` options before the runner path; the runner reached through a variable; `<n>` given by a variable; a prefixed tail; a tail that is a chain (only its first command belongs to the runner).

A long run should be given a Bash tool timeout that covers all `<n>` runs. A call the tool backgrounds after its timeout loses its after-fields (`backgrounded_after_ms` is set instead).

From the merge on, the custodian's worker and tester briefs tell agents to run a repeated evidence run through this runner with the Bash tool, never through a shell loop, and to set a Bash timeout that covers all `<n>` runs; that is the custodian's practice, and the row alone does not make a loop recordable.

## What a record holds

Every field is set or the word `unavailable`. Nothing is estimated, and no record holds output, status or diff text.

- **Run record** (`kind` `run`): `schema` (`spatial-evidence-recorder/v0.1`; usage records carry it too), `agent_id` (`main` for the main loop), `agent_type`, `command`, `started_at` and `ended_at` (UTC, around the call, so they include any permission wait), `tree_basis` (`leading-cd`, `session-default` or `unresolved`), `toplevel`, `head`, `head_after`, `before` and `after` (each with `status_z_text_sha256` and `diff_binary_text_sha256`), `tree_changed_during_run`, `tool_is_error`, `interrupted`, `stdout`, `stderr` and `text` (each with `text_bytes` and `text_sha256`), `before_ceiling_reached`, `previous_write` and `recorder_ms` (`before`, `after`, `write`). `repeat` is added when the call is a row A5 call: the count `<n>` when exactly one segment of the command is one, `unavailable` when more than one is, and the key is absent otherwise. When present, `return_code_interpretation` is copied raw, and `backgrounded_after_ms` is set when the tool backgrounded the command after its timeout, in which case the after-fields and `tree_changed_during_run` read `unavailable`.
- **Usage record** (`kind` `usage`, a subagent's turn end only): `schema`, `agent_id`, `agent_type`, `turn_id`, `recorded_at` and `usage` (the four token counts and `model`).

`before_ceiling_reached` is `true` when the before side hit the ceiling below, `false` when it did not (an `unresolved` plan runs no git, so it is `false`), and `unavailable` only when the ceiling's timer could not be used. `previous_write` is `{ record, ms }`: the day folder and file name of the last record this load wrote, and how long that write took, timed with `Date.now()` from the entry of the write routine to the resolution of the file write; it is `unavailable` for the first write of a load, and it names the write it measured, which may be a usage record or another call's. A refused write is not a previous write. `recorder_ms.write` is still the lookup and the assembly only, not the write, so the sum of before, after and write is a lower bound; the write's own duration is in the next record's `previous_write`, and the last record before a reload or a session's end has no successor to carry it.

The ceiling: the three before-side git calls run together under 2000 ms each, and the wait before the command is raced against a timer of 2000 ms (`BEFORE_CEILING_MS`). When the timer wins, `toplevel`, `head` and both before-hashes read `unavailable`, `before_ceiling_reached` is `true`, and the command runs at once; the late git answers are discarded, and the git processes the host started run on. The timer is the engine's clock, one `$.clock.sleep` call made in `beforeCeiling` for each approved call on a resolved plan and stopped before the command runs, because a hooks module has no timers of its own. The after side has no stage ceiling: it keeps its per-call timeouts only. Nothing here claims a ceiling reached on the live engine, that the live clock keeps the mock clock's time, or whether the wait is charged against the hook's budget while git calls are in flight.

The tree is read with `git --no-optional-locks` (`rev-parse`, `status --porcelain=v1 -z`, `diff HEAD --binary`), each call under a 2000 ms timeout, before and after the command. `tree_changed_during_run` compares `head`, the status hash and the diff hash. A hash is the sha256 of the UTF-8 encoding of the decoded text the engine gave the hook, which is not the byte stream `sha256sum` sees on a file.

## Where the log goes

The log root is derived from git's common directory: the main working tree's parent, then `<main tree name>-local/evidence`. One record is one new file, `<root>/<YYYY-MM-DD>/<HHMMSSmmm>-<16 hex>.json`, holding one JSON line. Read a day with `cat <day>/*.json`. When the root cannot be found, or a write is refused, the record is dropped and the call is unaffected.

## Pruning, by hand

The mod never deletes. At the weekly window, the custodian prunes by hand the day folders older than 30 days.

## What it does not claim

- That any recorder line is citable evidence. It is not, in v0. A record does not show that a test's assertions establish a claim, and it is never a mutation observation. CI and the gates stay authoritative.
- A numeric exit status. The record carries the tool's error flag, and whether a non-zero exit sets it is unproven before the live row E2.
- That the tree identified is the tree the command ran in, beyond `tree_basis`: MSYS spellings, a shell directory kept from an earlier `cd`, and a subagent's own worktree with no leading `cd` are not covered.
- What the identity misses: untracked file content, ignored files, a change made and restored inside the run, and metadata.
- Coverage. Not recorded: the PowerShell tool, wrappers, scripts, loops, background calls, CI, cloud sessions, commands a script launches inside, and this mod's own `claude plugin test` and `validate` runs. Every form in the form's §2.2 not-approved table is also not recorded: `cargo test --no-run` and `--list`, `verify-mutation.mjs`, builds and checks, wrappers, background calls, unbalanced quotes and the PowerShell tool.
- Live behaviour before its E-row: the chain order with Guardian (E1, and only if E1's refused call is approved under the form's §2.2), subagent usage (E3), and the listing of an agent at its turn end (E3).
- That no record is lost. A rejected write drops its record.
- Latency: any docs/08 row, and any latency figure before the live row E5.
- That repeated runs made without the runner are recorded as repeats, that an `npm` tail runs on Windows, any bound on the after side, or what slowed an earlier before stage (the ceiling bounds the wait whatever the cause).
- Any build other than 2.1.289, and macOS and Linux.
- That an installed copy is isolated from later changes to this folder in the main checkout.
- That `claude plugin test` or `validate` loads the mod into a session.

## Install (the human's alone)

Installing a mod is a security-posture change. It needs the human's typed approval after both gates, and he installs it himself. Nothing in this repository installs, enables or loads it.

1. From a checkout on main, at local scope: `claude plugin install spatial-evidence-recorder@spatial-ide-mods --scope local`. The marketplace is the directory source at `tools/mods`; whether it needs a refresh first is the live row E0's to record.
2. `/reload-plugins`
3. Confirm the entry in `/plugin`.
4. Start the session after the binary of record is in place.

## Turning it off

`claude plugin disable spatial-evidence-recorder --scope local`, or disable it in `/plugin`.

`disableAllHooks` is not the way to turn it off. It also stops the repository's settings hooks, which are not this mod's.

## Acceptance and stop

The acceptance conditions are the brief's: `state/directives/MODS-EVIDENCE-RECORDER-V0-2026-10-03.md:55-59 @ 884fc727 sha256:d3c294b2624a53bd2b4042cf8ebe609e63161f657ebf0113ef762cf6c00a6225`. The stop conditions are the brief's: `state/directives/MODS-EVIDENCE-RECORDER-V0-2026-10-03.md:61-64 @ 884fc727 sha256:648fffdd48a3f672d0938ba1bb2b7e581cb0f2bcee47c0a9aefefd823e238714`.

The bounds the evaluation uses are declared in the form, in its §9 (Operator) and its §7.

## Uninstall

`claude plugin uninstall spatial-evidence-recorder --scope local`
