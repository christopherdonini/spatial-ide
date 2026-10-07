Question round 68 — 2026-10-07 (custodian → human; written by the round-mirror hook from the AskUserQuestion call). 1 item, asked in one call. RED LINE items: none. AskUserQuestion is the answer channel; this mirror is read-and-copy.

---

1. #187 (the race fix) has both gates passed and CI green at 1f5eef49, after I merged main into it three times today. Each of my record commits to main (state/, PLAN.yaml, forms, the generated queue and site) leaves it behind main again, and the latest, bdf85948, just did. Under item 4 of your 2026-10-07 direction, a PR counts as ready only while it is up to date with main. Does a record-only main commit, touching no file the PR changes, require another merge of main into a waiting PR? (a) No: re-merge only after another PR merges, or when main changes a file the waiting PR touches; #187 is ready now, as a merge commit. (b) Yes, every main commit: I merge main once more now, wait for CI, then hold all record commits until your click.
  (1) (a) Only after merges (Recommended) — Record-only main commits need no re-merge; #187 is ready for your merge-commit click now.
  (2) (b) Every main commit — Merge main into #187 once more, wait for CI, and hold record commits until the click.
