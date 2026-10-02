Question round 36 — 2026-10-02 (custodian → human; written by the round-mirror hook from the AskUserQuestion call). 1 item, asked in one call. RED LINE items: none. AskUserQuestion is the answer channel; this mirror is read-and-copy.

---

1. Item 1. Placing a small test fix ahead of the Stop-hook piece (stop-hook-stale-continuity, node E). E's worker stopped on the form's invalidator I1 before its first code commit, which is what the form tells it to do. E makes stop-queue.mjs import precompact-flush.mjs. #154's test T11 in scripts/hooks/questions-mirror.test.mjs copies a hand-kept list of six scripts into a temp project, and that list lacks the new import, so its hook exits 1. Production is unaffected. The form's architect ruled against widening E's scope and routed the fix to its own test-only node, questions-mirror-t11-copy-glob. T11 will copy every top-level .mjs file in scripts/hooks/ and scripts/plan/ instead of the fixed list. It is 1 file, at most 10 lines, with a reviewer-only gate, and it lands on main before E. E's implementation waits locally (8c96695, unpushed). Not a red line.
  (1) Place it ahead of E (Recommended) — Its five-line form is committed and the fix is dispatched next. E merges main after it lands, then observes its mutations and opens its PR.
  (2) Hold — The node stays proposed, and E stays stopped on I1 with its commits local.
