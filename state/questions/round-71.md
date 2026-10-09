Question round 71 — 2026-10-09 (custodian → human; written by the round-mirror hook from the AskUserQuestion call). 1 item, asked in one call. RED LINE items: none. AskUserQuestion is the answer channel; this mirror is read-and-copy.

---

1. The e2e re-aim hit its invalidator I3. Run alone, the console suite failed GROUP' once in three runs: on the shipped arm, two session-log lines from earlier queries landed between the second and third identical residential queries, so the three formed a group of 2 plus a lone entry. Your option 1 assumed nothing else is recorded between them. How should GROUP' be re-aimed? (Records: state/drafts/e2e-stale-expectations-reaim-solo-runs/.)
  (1) (A) Assert the grouping rule (Recommended) — GROUP' checks what the console's grouping actually promises: every run of consecutive identical entries shows as one group with the right count, and the three residential queries are all present. A session-log line between them correctly breaks the run. Test-side only; the architect amends the form first.
  (2) (B) Three calls in one go — Issue the three queries together in one page step so nothing can be recorded between them. Cheaper, but the worker judged it still racy, and it would be shown only by more solo runs.
  (3) (C) Pin the baseline arm — Your option 2: the suite pins the old arm, where nothing interleaves. You ruled the suite stays on the shipped arm, so this reverses that.
  (4) (D) Drop the e2e check — Remove GROUP' and rely on the grouping's unit tests. Loses the end-to-end check of grouping on the shipped arm.
