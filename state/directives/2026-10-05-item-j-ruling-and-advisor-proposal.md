# Directive — window item J agreed, with the ideas advisor's context-management proposal as relayed (the human, verbatim)

*Custodian's filing note (2026-10-05): the human's message, received mid-turn at 10:30:41Z by the session transcript (its enqueue record). The text below the rule is the received text, extracted from the transcript by script, with nothing changed except one final newline. It has two parts. The first line below the rule is the human's ruling: item J of the 2026-10-09 window is agreed, with its conditions. It gets a RULED block in `DECISIONS-PENDING.md` (§105). The next line asks for the proposal to be filed beside Fable's evaluation (`state/directives/2026-10-05-fable-evaluation-context-management.md`). Everything from "Proposal from the ideas advisor" on is the ideas advisor's original proposal, as the human relayed it to Fable on 2026-10-05: by the human's own words, an idea for evaluation and not a directive. Cited as "the human's item J ruling" and "the ideas advisor's context-management proposal".*

---
Item J: agreed. Add step 1 to the 2026-10-09 window as item J and count as Fable's evaluation defines it: from existing records only, E and N1 reported separately. Nothing is built. Context Keeper v0 and the meter band are not approved. If the count is not zero, bring me the path that let the compaction through before proposing anything.

For the record, file this beside Fable's evaluation. It is the ideas advisor's original proposal, as I relayed it to Fable on 2026-10-05, verbatim. It is an idea for evaluation, not a directive:

Proposal from the ideas advisor (2026-10-05), for evaluation, not authorised work:
Context management via mods. Current layers: the PreCompact block, the Stop-hook staleness check (E,
done), Guardian's N1 nudge, and SessionStart re-print; reports-to-files reduces growth.
1. Decide by data. At the 2026-10-09 window, use the trial log to count automatic compactions since N1 and
   E landed that went through with a stale block (the 2026-10-04 11:19Z compaction is the first data
   point). If the count is zero, build nothing.
2. If it isn't zero, propose Context Keeper v0, observe-and-inform only:
   (a) at classic.PreCompact, write a mechanical snapshot to the local log root (the recorder's, outside
       the repo): lease, HEAD and origin/main, a porcelain summary, $.agent.list, the current branch and
       worktree, the ledger commits since flushed_at. Never judgment content;
   (b) if the API allows a mod to add instructions to the compaction summary request, add a fixed
       preservation list (lease id, current piece and step, open questions, rulings since the last flush).
       Verify this in P0 before relying on it;
   (c) after a compaction session start, inject one hidden line pointing to the snapshot and stating how
       many ledger commits the block is behind.
   Non-goals: no blocking (the settings hook stays the only blocker); no tracked writes, commits, model
   calls or auto-clear; no third-party mods installed.
3. Optional and low priority: a view-only context meter band for the human.
Same path as the other mods: brief, P0, gates, typed install.
