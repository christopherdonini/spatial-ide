# Weekly window 2026-10-09 — process proposals (draft)

*This is the custodian's draft, opened on 2026-10-02. It is raised to the human at the 2026-10-09 window. Nothing in it is applied before the human's answer.*

## A. Block-on-sight path rules exempt the form's own appended §10 amendments

- **Source.** The 2026-10-02 window note, `state/directives/2026-10-02-window-amendment-exemption.md`. The human directs that this be proposed, not applied.
- **The gap.** #157's form barred in §8 item 3 any commit after C1 touching a path outside §7's two files. Its own appended amendment tripped that rule. The architect's gate 2 is `state/consults/gates/2026-10-02-workspace-rustfmt-gate2-architect.md`, S1-2. Question round 37 settled it for that piece only.
- **The proposal, one line** in `docs/PREREGISTRATION-TEMPLATE.md`, appended at the end of the file: a form's block-on-sight path rules exempt the form's own appended §10 amendments by default.
- **Not proposed:** any change to §7 counting commands. A form's counting command keeps naming its own exclusions, and a missed self-exclusion stays a class 8 record.

## B. The 2026-10-03 trial: the report owed at the window

- **Source.** `state/directives/2026-10-03-reports-to-files-two-pieces-trial.md`, the 2026-10-03 trial directive. At the window the human asks for two things:
  - whether the context lasted longer between compactions;
  - what two pieces at once cost in conflicts and in the human's attention.
- **Baseline, before the trial.** This session's (e12d1b11) auto-compactions, each at about 770k tokens:

  | Compaction | Interval |
  |---|---|
  | 2026-09-30T17:42Z | — |
  | 2026-10-02T06:06Z | 36.4 h |
  | 2026-10-02T15:43Z | 9.6 h |
  | 2026-10-03T07:06Z | 15.4 h |

  Wall-clock intervals depend on the human's hours, so the report also gives subagent hand-backs filed per interval, from the ledger.
- **What the custodian logs during the trial:**
  - each compaction's time, read from the transcript's `compact_boundary` entries;
  - each pair of pieces in flight, with lanes and paths;
  - each conflict: a merge conflict, a regeneration, a wait for overlapping paths, or a stale continuity block;
  - each time the human was asked or interrupted because two pieces ran at once.
- **The known gap.** The architect cannot write a file (no write tool), so its reports stay messages. The report says what that cost.
