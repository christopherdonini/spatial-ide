# Directive — a piece that only waits for the human's click leaves its slot (the human, verbatim)

*Custodian's filing note (2026-10-07): received mid-turn, enqueued at 16:34:47.637Z by the session transcript's queued-command record, while the custodian was writing #186's closing record. Below the rule is the received text, byte-copied by script from that record with one final newline added and nothing else changed (lines 6 to 13). It names no other project. It amends part 2 of the 2026-10-03 trial directive (`state/directives/2026-10-03-reports-to-files-two-pieces-trial.md`) from its receipt, and gets a DIRECTIVE block in `DECISIONS-PENDING.md`. Cited as "the 2026-10-07 awaiting-merge direction".*

---
HUMAN DIRECTION, 2026-10-07 (Chris): a piece that only waits for my click leaves its slot. This changes part 2 of the 2026-10-03 trial directive and applies from now.
1. A piece whose PR has every gate passed, CI green, and nothing left but my merge click is "awaiting merge". It no longer counts as one of the two pieces in progress.
2. At most three PRs await merge. At three, no new piece starts until one merges.
3. The trial's conditions count them too. A new piece's paths are disjoint from the other piece in progress and from every PR awaiting merge, and at most one of all of them touches protocol/, wire fixtures, Cargo.lock or package-lock.json. A piece that overlaps a waiting PR prepares its form and its question round, and starts code when that PR has merged.
4. A PR counts as ready only while it is up to date with main. After each merge, bring every waiting PR up to date by merging main into it, wait for CI, and tell me it is ready again. Re-run a gate only on what a conflict resolution changed.
5. The closing record after a merge needs no slot.
6. Unchanged: every merge is my click, as a merge commit; AUTONOMY section 9's auto-merge stays unused; at most two pieces in progress; heavy runs one at a time; you remain the only writer of shared records.
7. At the next window, report from the ledger the hours each slot sat idle waiting on a click, before and after this direction.
