*Custodian's filing note (2026-10-24): reading 3 for piece E (`state/directives/2026-10-24-governance-piece-e-rules-as-records-readings-e1-repin-fresh-session-practice.md`, the readings, item 3): the Claude Code docs agent's answers from the documentation. The run 15:46:06Z to 15:47:40Z by its transcript (WebFetch 8, Grep 4). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Beside it, the custodian's own reading of this environment, taken by script at main 1aef59df: `claude --version` printed `2.1.306 (Claude Code)`; `CLAUDE_CODE_EFFORT_LEVEL` is not set in the environment the custodian's shell inherits; the agent definitions' `effort:` lines are `architect.md` high; `evidence-reader.md` low; `lead-data.md` high; `reviewer.md` high; `tester-high.md` high; `tester.md` medium; `worker-high.md` high; `worker.md` medium; and the Agent tool this session dispatches with takes an `effort` value per call. The report is the docs agent's own account: its quotes came through a fetch tool that returns processed page text, as it says. Its sha256, from line 5 to the end, is 7c090bffe4e64384c6e2c5aa4803bf0fabfd1845ac10c25aa2c68d4a0666da54.*

---

Caveat first: the fetch tool returns model-processed page text, not raw bytes, so the quotes below are as returned by the fetch and I could not verify them byte-for-byte against the raw HTML or markdown. Where a page was too long, I read the saved fetch output and quote only what it contains.

## 1. Does /clear start a new session id (new transcript/session), or keep the same id?

**Answer: Yes as to a new session. The docs call /clear a new session and keep the old one saved, but they never say the session ID changes. "New session ID" is not documented.**

- https://code.claude.com/docs/en/sessions.md ("Manage context within a session"):
  - "**`/clear`**: start fresh with an empty context. Claude Code saves the previous session; resume it with `/resume`, or, in the same Claude Code process, from [the rewind menu's previous-session entry](...). With no argument, the new session keeps a name you set with `--name` or `/rename`, but not an AI-generated session title. To name the session you're leaving instead, pass the name, as in `/clear release-prep`; the new session then starts unnamed"
  - "Sessions are saved continuously to [local transcript files](#export-and-locate-session-data) as you work, so you can return to one after exiting or running `/clear`."
- https://code.claude.com/docs/en/commands.md (command table): "`/clear [name]` | Start a new conversation with empty context. Pass a name to label the previous conversation in the `/resume` picker. To free up context while continuing the same conversation, use `/compact` instead. Resume the previous conversation with `/resume`, or, in the same Claude Code process, restore it from [the rewind menu's previous-session entry](...). Aliases: `/reset`, `/new`"
- Session IDs are only discussed for /branch and --fork-session: "Sessions created with `/branch` or `--fork-session` get their own session IDs and appear as separate rows." The /clear text does not say this.
- Storage: sessions.md says transcripts are stored as "`~/.claude/projects/<project>/<session-id>.jsonl`", but it does not say /clear writes a new file.
- Changelog (https://code.claude.com/docs/en/changelog.md) has /clear entries only about bugs: 2.1.300 "Fixed resuming a conversation from before `/clear` reattaching to the Remote Control session of the conversation after it"; 2.1.307 "Fixed a conversation cleared with `/clear` sometimes coming back when a cloud or self-hosted runner session restarted". No version changed the session-ID behaviour.
- Not documented: whether the post-/clear session has a different session ID. What I searched: the sessions, commands, and memory pages, and the changelog. The docs-map pages on sessions and commands are the main ones.

## 2a. Can the Agent (Task) tool set a per-call effort, and does it override the subagent's `effort:` frontmatter?

**Answer: Yes, with a caveat. A per-invocation `effort` parameter exists for non-fork subagents and it overrides the frontmatter field. Not documented: whether the Agent tool exposes this parameter in all builds; the doc says it requires v2.1.292 or later, and 2.1.306 qualifies.**

Source: https://code.claude.com/docs/en/sub-agents.md
- Frontmatter table, `effort` row: "Effort level when this subagent is active. Overrides the session effort level, but not the [`CLAUDE_CODE_EFFORT_LEVEL`](https://code.claude.com/docs/en/env-vars#variables) environment variable. Options: `low`, `medium`, `high`, `xhigh`, `max`; available levels depend on the model."
- "When you ask Claude to run a non-fork subagent at a specific effort level, it can also pass an `effort` parameter for that invocation. The parameter overrides the `effort` field and stays in effect when the subagent is [resumed](...). The [`CLAUDE_CODE_EFFORT_LEVEL`](...) environment variable takes precedence over both. The per-invocation parameter requires Claude Code v2.1.292 or later."
- Version note: the changelog search found no entry about the subagent `effort` field or the per-call `effort` parameter, so no behaviour change is recorded there.

## 2b. Does CLAUDE_CODE_EFFORT_LEVEL exist, what does it set, and does it override frontmatter or per-call effort?

**Answer: Yes, it exists. It sets the effort level for supported models. It overrides subagent `effort:` frontmatter and per-call effort, and it also overrides `--effort`, `/effort`, and the settings.**

- https://code.claude.com/docs/en/env-vars.md (Variables table): "Set the effort level for supported models. Values: `low`, `medium`, `high`, `xhigh`, `max`, or `auto` to use the model default. Available levels depend on the model. Takes precedence over `--effort`, `/effort`, and the `modelSettings` and `effortLevel` settings. A [`maxEffortLevel`](...) cap still applies. See [Adjust effort level](...)"
- The env-vars row itself does not mention subagents. The override over subagent frontmatter and per-call values is stated on the sub-agents page quoted in 2a: "The [`CLAUDE_CODE_EFFORT_LEVEL`] environment variable takes precedence over both."
- Changelog: 2.1.304 "Fixed `/effort status`, `/effort ultracode` and the prompt's effort indicator showing a guessed effort level when `CLAUDE_CODE_EFFORT_LEVEL` is `auto` or `unset` and no level is sent". This is a bug fix, not a precedence change.

## 3. Subfolder CLAUDE.md on demand; same for subagents; does `omitClaudeMd` change it?

**Answer: For the main session, yes, subfolder CLAUDE.md files load on demand. For subagents, the docs say this for Explore, Plan, and `omitClaudeMd` subagents. The docs do not state it for ordinary custom subagents, so that is "not documented". `omitClaudeMd` does not stop subfolder loading.**

Main session, https://code.claude.com/docs/en/memory.md:
- "CLAUDE.md and CLAUDE.local.md files in the directory hierarchy above the working directory are loaded at launch. Files in subdirectories load on demand."
- "A `CLAUDE.md` in a subdirectory of your working directory doesn't appear under **Memory files**, because it loads on demand rather than at launch. When it loads, a `Loaded` line with its path appears in the terminal. To test a new one, create it from your shell rather than asking Claude to write it, then ask Claude to read a file in that subdirectory."
- Version note: "Before v2.1.309, Claude Code didn't apply this limit to files that load on demand." This refers to the size limit, not to whether they load. Changelog 2.1.309: "Fixed sessions compacting repeatedly after reading files under a very large nested CLAUDE.md; a nested CLAUDE.md over the size limit now loads only its start".

Subagents, https://code.claude.com/docs/en/sub-agents.md:
- "Explore and Plan start without your CLAUDE.md files and the git status snapshot to keep research fast and inexpensive. Other built-in and [custom subagents](...) load both, unless you set [`omitClaudeMd`](...) in a custom subagent's definition to start it without the user, project, and local CLAUDE.md files."
- "For Explore, Plan, and subagents with `omitClaudeMd`, a subdirectory's `CLAUDE.md` and matching [path-scoped rules](...) still [load](...) when the subagent works with files there."
- Startup loading for subagents without `omitClaudeMd` is the "load both" sentence above. The docs do not say whether an ordinary custom subagent loads subfolder CLAUDE.md on demand. Not documented.
- `omitClaudeMd` (frontmatter table): "Set to `true` to start this subagent without the user, project, and local CLAUDE.md files in its [initial context](...); [managed policy files](...) still load, except for [managed subagents](...). Use it for subagents that take everything they need from the delegation prompt. Ignored when the agent runs as the main session agent via `--agent` or the `agent` setting. Requires Claude Code v2.1.271 or later"
- "`CLAUDE.md` files and project memory still load through the normal message flow, even when the agent's definition sets [`omitClaudeMd`](...)." This is in "Invoke subagents explicitly".
- Changelog: no entry mentions `omitClaudeMd` or subagent CLAUDE.md loading in the parts I could read. Not verified for the full changelog. The changelog is long and I read only the first 100000 characters.

Note on version: 2.1.306 is at or above every version gate cited (2.1.271, 2.1.292, 2.1.309 is newer than 2.1.306, so its size-limit change does not yet apply to this build).

Sources:
- https://code.claude.com/docs/en/sessions.md
- https://code.claude.com/docs/en/commands.md
- https://code.claude.com/docs/en/sub-agents.md
- https://code.claude.com/docs/en/env-vars.md
- https://code.claude.com/docs/en/memory.md
- https://code.claude.com/docs/en/changelog.md
