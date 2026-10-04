Question round 52 — 2026-10-04 (custodian → human; written by the round-mirror hook from the AskUserQuestion call). 4 items, asked in one call. RED LINE items: none. AskUserQuestion is the answer channel; this mirror is read-and-copy.

---

1. OPEN-1 — RED LINE (a docs/08 normative row; type your ruling via Other). engine/tests/slice.rs asserts docs/08:8's 100 ms on its own declared pair (cancel_requested → cancel_observed); you ordered it in round 5, item 3. It once missed by 1.33 ms (101.33 ms) during a concurrent DuckDB build. Options for your typed answer: (a) B-keep — keep the assertion; a contention failure is re-run once alone, with the failing log filed before the re-run (architect recommends); (b) B-retry — up to 3 fresh attempts, fail only if all miss (weaker than the row; not recommended); (c) B-move — assert the property and ordering, report the timing, leave the budget to a measurement harness (no automated docs/08:8 check until OPEN-4's harness exists). Phase R's R-5 to R-7 are its evidence and run now.
  (1) Hold for Phase R — Rule after Phase R's slice.rs runs (R-5 alone, R-6 and R-7 under load) are filed. No Part B code waits on anything else.
  (2) Hold, decide later — Keep OPEN-1 open past this piece; slice.rs stays exactly as it is meanwhile (the default if unruled).

---

2. OPEN-2: is h2_a's 100 ms assertion (kernel/tests/end_to_end.rs) docs/08:8's budget? It borrows the number but spans a different interval: a client instant before the CANCEL is sent, to the data-plane adapter's receipt stamp (taken before the engine is told), not ADR-018's cancel_requested → cancel_observed. Its own comment claims docs/08's budget, and the docs/08 harness scores this same interval (OPEN-4).
  (1) No, not docs/08's row (Recommended) — ADR-018's pair and the engine's own mapping govern; round 25 item 1 (a) applies: Part A1 removes the 100 ms assert, keeps the property (TERM_CANCELLED, zero batches, observed), adds ordering (observed ≥ sent) and a 5 s liveness bound, and prints the interval with its pair named.
  (2) Yes, it is docs/08's row — The adapter's receipt is read as the data-plane path's cancel_observed; Part A1 does not land, h2_a joins OPEN-1's options, and the harness stays as it is.
  (3) Hold — Leave h2_a as it is for now; Part A1 waits.

---

3. OPEN-3 — RED LINE (a scope change to a ruled item; type your ruling via Other). The sibling test h2_cancellation_is_observed_by_the_producer_inside_the_budget (kernel/tests/end_to_end.rs:415-418) has the identical interval and a 100 ms assert whose message calls it docs/08's budget. The node names only h2_a. Options for your typed answer: (1) include it as Part A2 — same file, interval, defect class and ruling; its name stays because docs/07:21 cites it (architect recommends, and only if OPEN-2 is No); (2) exclude it and append a proposed node.
  (1) Hold for OPEN-2 — Rule OPEN-3 once OPEN-2 is settled; Part A2 waits.
  (2) Hold, decide later — Keep OPEN-3 open; the sibling test stays as it is meanwhile.

---

4. OPEN-4: kernel/tests/slice_budgets.rs (the docs/08 measurement harness) scores its cancellation p95 on the same client→adapter interval, not on ADR-018's pair. What happens to that finding? No code in this piece either way.
  (1) Propose a harness node (Recommended) — Append a proposed node, after this one, with its own full form: re-aim the harness's cancellation cells to the engine trace pair (release build, reference hardware), keep the adapter interval as a reported figure; existing kernel/RESULTS.md figures are not rescored (ADR-018). Only if OPEN-2 is No; OPEN-1 (c) would need it.
  (2) Disclose only — Record the finding in this piece's record and change nothing.
  (3) Hold — Decide later; nothing is appended.
