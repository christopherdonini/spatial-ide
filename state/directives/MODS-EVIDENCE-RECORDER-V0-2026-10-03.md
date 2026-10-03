# Evidence Recorder v0 — the second Spatial IDE mod, and the mods roadmap (brief, 2026-10-03)

*Fable, 2026-10-03, on the human's approval of the same date. The custodian files this under `state/directives/` with the human's covering line. It authorises building and gating one observe-only mod **after guardian-v0 passes its gates**. **Installing it is a security-posture change and waits for the human's typed approval after its own gates; the human installs it himself.** API facts come from the Guardian v0 P0 (`state/consults/2026-10-03-guardian-v0-p0-report.md`, build 2.1.288), and every one is re-verified in this mod's own P0.*

## 1. Purpose and principle

The mod observes test runs in local sessions and records what actually ran, where, and how it ended, so that evidence in records no longer depends on hand-typed facts. **It observes only:**
- it never refuses, rewrites, retries or answers a tool call;
- it adds nothing the model reads, and injects nothing into prompts or context;
- it makes no model call and no network request, and never commits or pushes;
- every hook returns the tool's result exactly as `next(e)` produced it.

It records that a command ran at a revision, with a state and an outcome. **It does not prove that a test's assertions establish a claim, and it is not a mutation observation.** CI and the independent gates remain authoritative.

## 2. Scope

**Approved commands only.** The list is fixed in P0 from what the repository runs: `cargo test` (the workspace and `frontends/shell/src-tauri`), the shell's and the viewer's npm test scripts, `node scripts/plan/verify-*.mjs`, and `node --test` over `scripts/hooks/`. Any other Bash command is passed through untouched, with no work done.

**For each approved run, one record:**
- the agent ID and agent type (main loop or subagent);
- the working tree's top-level path, and the HEAD commit;
- the dirty-tree identity before and after: the sha256 of `git status --porcelain=v1 -z`, plus the sha256 of `git diff HEAD --binary`;
- the command, the start and end times, the exit status (if the build exposes it), and the interrupted flag;
- the byte counts and sha256 of stdout and stderr, never their content;
- `tree_changed_during_run`: true when the before and after identities differ.

**At each subagent's turn end, one usage record:** the agent ID, its type, and its token counts, for the pilot's cost measures. Unknown values are recorded as `"unavailable"`, never estimated.

**Storage:** append-only JSON lines in a local, gitignored folder (P0 confirms the path, for example `.claude/state/evidence/<date>.jsonl`), pruned after 30 days. Raw data never leaves the machine. A line copied into a tracked record passes the existing exposure scan and its CI backstop like any other text; there is no separate redaction.

**Not covered, stated as scope:** cloud sessions and CI runs; commands that scripts launch internally; non-Bash routes.

## 3. P0, before any code: verify against the installed build

1. The Bash result's fields: the exit status, the interrupted flag, and output sizes.
2. Whether `turn.complete` carries usage and `agentId` for a subagent, and how `$.agent.list()` maps the ID to a type.
3. The approved-command list, as it is actually invoked in this repository (from the CI workflows, package.json and scripts/).
4. The cost of the dirty-tree identity on this repository (excluding gitignored `target/`), with a short `timeoutMs` on every `git` call.
5. The local log path: gitignored, and outside every tracked directory.
6. The chain order with Guardian: both hook Bash tool calls. A call Guardian refuses is not a test run and produces no record.
7. `claude plugin validate`: its hooks line is `tool.call{tool=Bash}` and `turn.complete`. Its calls line is `process.run` for `git`, file appends for the log, and `agent.list`. Nothing else.

## 4. Tests, gates, acceptance, stop

**Tests (the mod test harness), one recorded mutation each:**
- an approved command produces a complete record, and any other command produces none;
- a failing or timed-out `git` produces `"unavailable"` fields, with the tool result unchanged;
- an edit during a run sets `tree_changed_during_run`;
- a subagent's turn end produces a usage record;
- the result passes through byte for byte;
- overhead is measured: zero for other commands, a stated bound (target under 300 ms) for approved ones.

**Gates:** the reviewer and the architect, with the `validate` output in the PR body. Governance lane.

**Evaluation:** two weeks after install, or the next six gated pieces, whichever comes first. Measured against the gate log's recent baseline:
- the evidence corrections the gates find (wrong commit, dirty tree, misstated command);
- the filings that cite recorder lines;
- false `tree_changed_during_run` flags;
- the overhead.

**Stop and uninstall if:**
- any tool result is ever altered;
- the overhead exceeds its bound;
- `"unavailable"` is common enough to make the record useless.

## 5. The mods roadmap: what is tracked, and how

| Item | Status | Tracked as |
|---|---|---|
| Guardian v0 | Placed; P0 done | PLAN `guardian-v0`; install waits on the human |
| Evidence Recorder v0 | Approved; placed after Guardian's gates | PLAN `evidence-recorder-v0`, depends on `guardian-v0`; install waits on the human |
| Recorder lines as citable evidence | An evidence-rule change | An item on the 2026-10-09 window |
| Workboard (read-only pane) | Deferred | PLAN `mod-workboard`, unscheduled. Revisit once the recorder exists to feed its "observed" column. |
| Worktree and resource protection | Deferred | PLAN `mod-worktree-resource-protection`, unscheduled. Revisit once worktree ownership is recorded machine-readably; advisory first. |
| Contract-impact assistance | Not a mod | No node. lead-data's impact read covers it; a script, if ever needed. |
