# The human's message of 2026-10-28: Addendum 2 to piece E (the Claude Code upgrade and reading 2's tally; /clear and the lease handover; the auto-compact window; the prompt audit; E3 as path-scoped rules; the reviewer's model, two options)

*Filed verbatim by the custodian from the session transcript (received 2026-10-28T17:08:39.223Z), its text unchanged; nothing in it names another project. The RULED block in DECISIONS-PENDING.md is the custodian's summary; the text below is the ruling.*

---
Addendum 2 to piece E (2026-10-28).

1. I will upgrade Claude Code to 2.1.312 or later before your next session; you then re-run the hooks' own tests. Claude Code before 2.1.307 recorded placeholder token usage in subagent transcripts for streamed replies (its changelog: "Fixed subagent transcripts recording placeholder token usage and an empty stop reason for streamed responses"). Reading 2's table by agent type therefore comes from 2.1.306 transcripts that may be wrong: re-run that tally on three days of transcripts written after the upgrade, before E1 uses it as its baseline. The main-session table is not affected. Two consequences of the upgrade: it is the Guardian form's I2, so the live checks run again at 2.1.312 and the ledger records the build before any live row is cited; and 2.1.311 fixed SubagentStop hooks firing about twice a minute per running subagent, so the hook ledger's SubagentStop counts before the upgrade are not comparable with those after, and the ledger says so.

2. /clear gives a new session id. The docs say the session id is updated on /clear and that a bare /clear keeps a /rename name; I saw both on this machine in another Claude Code session, at 2.1.304 and at 2.1.312. No separate test is needed: the first fresh-session checkpoint records the old and the new id in the ledger. From then on:
   - the fresh-session practice runs the lease handover at every /clear (its steps 3 and 5);
   - the per-session hook counters start again;
   - a compaction keeps the same id and needs no handover: reading 2 shows one id across 14 days of compactions.

3. The auto-compact window: autoCompactWindow set to 300000 in this checkout's .claude/settings.local.json, never in the user settings, which also reach the other project's sessions, and not in the tracked .claude/settings.json, which is the public repository. The value is recorded in the ledger. Nothing sets CLAUDE_CODE_AUTO_COMPACT_WINDOW in the environment, which would override it.
   - Reading 2 shows a single main session over 14 days, re-reading about 375,000 tokens per reply on average.
   - An automatic compaction is never blocked (AUTONOMY §7), and the SessionStart hook re-injects the continuity block, so each compaction becomes a fresh start with a summary, with no lease handover.
   - Measure again with reading 2's method one week later; if the value stays, it moves into the tracked settings with piece E.

4. The prompt audit already run: file its output under state/consults/, redacted under the profile-path rule first, and use it beside the advisor's audit in E1's mapping.

5. E3 changes form: product rules by module become native path-scoped rules in .claude/rules/, not generated CLAUDE.md files.
   - Such a rule has a paths: list in its frontmatter, relative to the directory that holds the .claude folder. Claude Code reads only that field and ignores E1's other fields.
   - A rule with no paths: list never goes into .claude/rules/, because it loads unconditionally, for every agent.
   - Before E3 is placed, test whether a worker editing in a sibling worktree under C:/dev/wt/ loads them. The docs say such rules load for a sibling worktree only when Claude Code starts in that worktree or moves there with /cd; our workers are subagents of the main session, so expect no. If they don't load, E3 is redesigned or dropped.

6. The reviewer's model: /usage names reviewer subagents as the place a cheaper model would save the most. The switch exists: a subagent definition's model: and effort: frontmatter, or a model alias passed on the Agent call. Put these two options to me, each with its expected cost from /usage, and I decide:
   (a) A tester (Sonnet) runs the suite and the mutation observations at the reviewed commit. The reviewer (Opus) reads that report, cites it, and makes its own targeted probes.
   (b) A second reviewer definition on Sonnet at high effort, dispatched for single-gate pieces only, for ten pieces, compared against the gate-failure baseline.
   Mutation observations stay the gates' own until I rule.
