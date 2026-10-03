# Guardian v0 — the first Spatial IDE mod (brief, 2026-10-03)

*Fable, 2026-10-03, on the human's request to introduce mods now that Claude Code is updated. The custodian files this under `state/directives/` with the human's covering line. It authorises building and gating one mod. **Installing it is a security-posture change and waits for the human's typed approval after its gates.** Sources read for this brief: the Claude Code docs pages "Mods overview" and "React to events with a mod", as fetched on 2026-10-03. Every API fact below that the brief relies on is re-verified in P0 against the installed build's own types.*

## 1. Purpose and principle

Rules the custodian currently has to remember become code that runs around it. Guardian **only refuses**:
- it never approves a tool call (no `tool.check` hook, no `allow` decision);
- it never rewrites a tool call's arguments;
- it never submits a prompt, calls a model, or makes a network request.

Every hook that can refuse **fails closed**: it carries a `.catch` handler that denies, because a hook that throws or times out is otherwise skipped, and the call would run. Each rule cites the ruling it enforces. Guardian adds defence in depth: CI checks and gates stay, because cloud sessions and edits made on GitHub never pass through a local mod.

## 2. Scope: the rules

| Id | Refuses | Enforces |
|---|---|---|
| G1 | Any `git push` that force-pushes, in every spelling: `--force`, `-f`, `--force-with-lease`, a `+refspec`, `--mirror`, and pushes that delete a branch. The human runs any approved force-push himself. | Red line: no force-push (AUTONOMY red lines; question round 34, item 3) |
| G2 | Any Write or Edit to `docs/01_Principles.md` | CLAUDE.md: never edit docs/01 |
| G3 | Changing an accepted ADR or a filed preregistration, except as a pure append. Edit is refused. Write is allowed only when the new content starts with the file's current bytes. | ADRs immutable, amendments appended; preregistrations append-only |
| G4 | Any Write or Edit to an existing file under `state/directives/` | Directives are filed verbatim, once |
| G5 | Any Write or Edit whose new content contains a user-profile path, using the existing scanner's own matcher, never a copy | The exposure rule (round 29; the profile-path scan) |
| G6 | For a report-only subagent (architect, lead-data, evidence-reader), any Write or Edit outside the report path its brief declares, on a line of the form `REPORT PATH: <path>` | The 2026-10-03 trial's write scope (question round 41, item 3). The write-audit script stays as the backstop. |
| N1 | Not a refusal, a nudge. When the main conversation's context passes **80%** and the continuity block's `flushed_at` predates the newest ledger commit, a tool result gets one appended line: "Context at N%: flush the continuity block now (rewrite, commit, push), then continue." It is shown at most once per 10 percentage points. | The 2026-09-29 missed flush; AUTONOMY §7 |

**Out of scope for v0:** dashboards (Mission Control), evidence packaging (Handoff), Context Keeper, any approval or override path, and cloud sessions.

## 3. P0, before any code: verify against the installed build

Record each answer, with its source (the build's types, a doc page, or a probe), in the preregistration's §0:
1. **Agent identity.** Does a `tool.call` event identify which subagent made the call (for example `e.agentId`), and can the subagent's type and brief be linked to it, for example from the parent's Agent or Task call? If not, G6 is dropped from v0, and the write-audit script remains the primary check.
2. **The tool-result shape** that N1 would append to, for at least Bash, Read and Grep results; and whether an appended line reaches the model unchanged.
3. **Context fill.** The main conversation's fill, from `turn.step`'s `result.usage` with `e.agentId` unset: the formula, and the window size to divide by. If it can't be computed reliably, N1 is dropped.
4. **Install scope.** How a plugin kept in this repository installs from a local marketplace on the human's machine only, and how it is kept out of cloud sessions ("a plugin that reaches the cloud session").
5. **Tests.** The documented way to test a mod without a session, and how each rule's event is raised in a test.
6. **Limits.** The hook time limit (10 s) and the `.catch` limit (1 s), and that every refusing hook's `.catch` denies.
7. **`claude plugin validate`.** Its `hooks:` and `calls:` lines must list only `tool.call`, `turn.step`, and the reads and `git` calls that G3 to G6 and N1 need. Nothing else.

## 4. Packaging, tests, gates

- **Where it lives:** a plugin at `tools/mods/spatial-guardian/` (`.claude-plugin/plugin.json`, `hooks/hooks.json`, `hooks/register.js`), with a local marketplace manifest in `tools/mods/`. No npm dependency is added; type definitions come from the installed build.
- **Tests, one per rule:** a refusal case and an allowed case for each of G1 to G6; a fail-closed case (the hook throws, and the call is refused); and N1's threshold and once-per-10-points rule. Each test gets one recorded mutation.
- **Gates:** the reviewer and the architect, with the `claude plugin validate` output in the PR body. It is in the governance lane, its paths are disjoint from engine/ and kernel/, and it fits beside node 10 under the two-pieces limit.
- **Install:** only after both gates pass **and** the human's typed approval. The human installs it himself, with `claude plugin install spatial-guardian@<local marketplace>`, then runs `/reload-plugins`, and confirms the `/plugin` line shows `1 mod active · spatial-guardian`.
- **Turning it off:** disable it in `/plugin`, or start with `--safe-mode`. Record this in the README.

## 5. Acceptance and stop

**Acceptance:**
- every rule's tests pass;
- `validate` lists nothing beyond §3 item 7;
- in the first week after install, no legitimate action is refused. Each false refusal is logged, and the rule is narrowed through the usual process.

**Stop and uninstall if:**
- Guardian ever lets through a call it should refuse, because a hook was skipped without a deny;
- a false refusal blocks a red-line flow that the human performs through the custodian;
- `validate` ever shows a call outside §3 item 7.
