# spatial-evidence-recorder (Evidence Recorder v0)

The second Spatial IDE mod: an observe-only plugin for sessions in this repository. It writes one line for each approved test command and, by design, one for each subagent turn; that subagent behaviour is unclaimed as live behaviour before its E-row E3. It never refuses, rewrites or answers a call, makes no model call and no network request, and writes nothing inside the repository. Every hook calls the next link once, with the event it received, and returns that call's own value. The form is `tools/mods/EVIDENCE-RECORDER-V0-PREREGISTRATION.md`, and it governs this folder.

Built and tested against Claude Code 2.1.289 on Windows. The reads of the build's type declarations behind the hooks were made at 2.1.288 and are claims about that build only. Nothing here is claimed for another build, for macOS or for Linux.

## What it records

A Bash call is recorded when one of its segments (split at `&&`, `||`, `;`, `|`, `&` and newlines outside quotes, after leading `NAME=value` words and `timeout <duration>`) starts with one of these:

| Row | Starts with |
|---|---|
| A1 | `cargo test`, without `--no-run`, and without `--list` after a `--` |
| A2 | `npm`, an optional `--prefix <dir>`, then `test`, or `run` with `test`, `verify`, `test:e2e`, `test:residency-trace` or `test:citation-integrity` |
| A3 | `node --test` |
| A4 | `node` and the path of `scripts/plan/verify.mjs`, `verify-cites.mjs`, `verify-quotes.mjs` or `verify-test-claims.mjs` |

A leading `cd <absolute dir> &&` sets the directory the tree is read in. A call with an open quote, a heredoc or a substitution is not approved. A call run in the background is passed through with no work.

The Bash tool is the route. A test command meant to be recorded is run through the Bash tool, in one of the spellings above. From install on, the custodian's worker and tester briefs tell agents to run approved test commands through the Bash tool, so that they are recorded.

## What a record holds

Every field is set or the word `unavailable`. Nothing is estimated, and no record holds output, status or diff text.

- **Run record** (`kind` `run`): `schema` (`spatial-evidence-recorder/v0`), `agent_id` (`main` for the main loop), `agent_type`, `command`, `started_at` and `ended_at` (UTC, around the call, so they include any permission wait), `tree_basis` (`leading-cd`, `session-default` or `unresolved`), `toplevel`, `head`, `head_after`, `before` and `after` (each with `status_z_text_sha256` and `diff_binary_text_sha256`), `tree_changed_during_run`, `tool_is_error`, `interrupted`, `stdout`, `stderr` and `text` (each with `text_bytes` and `text_sha256`), and `recorder_ms` (`before`, `after`, `write`). When present, `return_code_interpretation` is copied raw, and `backgrounded_after_ms` is set when the tool backgrounded the command after its timeout, in which case the after-fields and `tree_changed_during_run` read `unavailable`.
- **Usage record** (`kind` `usage`, a subagent's turn end only): `schema`, `agent_id`, `agent_type`, `turn_id`, `recorded_at` and `usage` (the four token counts and `model`).

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
- Any build other than 2.1.289, and macOS and Linux.
- That an installed copy is isolated from later changes to this folder in the main checkout.
- That `claude plugin test` or `validate` loads the mod into a session.

## Install (the human's alone)

Installing a mod is a security-posture change. It needs the human's typed approval after both gates, and he installs it himself. Nothing in this repository installs, enables or loads it.

1. From a checkout on main, at user scope: `claude plugin install spatial-evidence-recorder@spatial-ide-mods --scope user`. The marketplace is the directory source at `tools/mods`; whether it needs a refresh first is the live row E0's to record.
2. `/reload-plugins`
3. Confirm the entry in `/plugin`.
4. Start the session after the binary of record is in place.

## Turning it off

`claude plugin disable spatial-evidence-recorder --scope user`, or disable it in `/plugin`.

`disableAllHooks` is not the way to turn it off. It also stops the repository's settings hooks, which are not this mod's.

## Acceptance and stop

The acceptance conditions are the brief's: `state/directives/MODS-EVIDENCE-RECORDER-V0-2026-10-03.md:55-59 @ 884fc727 sha256:d3c294b2624a53bd2b4042cf8ebe609e63161f657ebf0113ef762cf6c00a6225`. The stop conditions are the brief's: `state/directives/MODS-EVIDENCE-RECORDER-V0-2026-10-03.md:61-64 @ 884fc727 sha256:648fffdd48a3f672d0938ba1bb2b7e581cb0f2bcee47c0a9aefefd823e238714`.

The bounds the evaluation uses are declared in the form, in its §9 (Operator) and its §7.

## Uninstall

`claude plugin uninstall spatial-evidence-recorder`
