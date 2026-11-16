# The human's directive of 2026-11-16: the target is v0.2 (save, reopen, colour by category, and the first-look fix); record-keeping, repeated runs, pieces, the machine, models and focus, in force by ruling now, for a week

*Filed verbatim by the custodian: the human's typed message in the custodian's session, the user record of 2026-11-16T02:23:15Z by the custodian's transcript (1577 bytes, sha256 a4a983d5843f3082a5f13b30edb86e46683daa6ccff626858f6f5c2c25aa03b3), below the rule, with a final newline added. Nothing else is changed. These are the human's own words.*

---

I want the product to move faster. The target is v0.2: save, reopen, colour by category, and the first-look fix. Put what follows in force by ruling now; the wording goes into AUTONOMY later in one docs PR, not as a piece per change.

1. Record-keeping. Cut it to what protects the product. Propose which pieces keep the full form and both gates, which get a one-page form and one gate, and what is no longer filed. Keep the tests and the reviews.
2. Repeated runs. Focused tests while building; the full suites once, on the final candidate. CI is the full run for each commit; the laptop keeps the app-window and timing tests. Reviewers reuse a run tied to the exact commit and environment, and reproduce only what they doubt. No two workers share a build folder or a test data folder.
3. Pieces. Make them smaller, and let two pieces touch the same file when their regions do not overlap.
4. The machine. Draft for my approval a small queue in the machine script: a waiting request gets the next turn, with no agent polling and no question to me. Draft a CI build cache for my approval too, if it is worth it.
5. Models. The strongest model for architecture, concurrency, security and hard reviews. The cheapest configuration that reliably passes review for routine code, tests, wording fixes and evidence reading.
6. Focus. Pause any lane, research or experiment that does not serve the target, unless it blocks it.

Run this for a week. Each day in the digest, give me product lines merged per day before and after, laptop hours spent on runs, and any defect that got past.
