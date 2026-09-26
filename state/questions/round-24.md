Question round 24 — 2026-09-26 (custodian → human). Four items, in ask order. This is wave 1's after-wave batch: the S1 candidates, with their evidence, in one batch, per the ruled wave-1 plan (`state/cloud/wave1-prompts.md` §4). Item 3 touches public exposure (ADR-009); its merge is your click in any case. Status at filing:
- all eight sessions are recorded and triaged in `state/cloud/wave1/` and `state/cloud/wave1.md`;
- the wave cost 31 dollars (250 to 219, whole dollars, no per-session figure);
- the S2 records (A1–A5, B, C, D) are written after this round, together, as KNOWN-LIMITATIONS rows or PLAN notes.

---

1. Which S1 candidates become cuts? Each would be a small fix piece, placed after the watcher. All three are reproduced on Windows in `C:/dev/wt/triage-a3-obs3` (untracked scratch, kept for this).
  (a) A3 3(b), the bundle viewer (`state/cloud/wave1/A3.md`, its triage update).
    - The defect: `renderer/bundle-viewer/src/partition.ts`'s ring and vertex loops run to the bundle's own offsets, and nothing checks them against the coordinate array.
    - Measured on Windows: a hash-consistent, 992-byte bundle drives the loop linearly, about 46 ns per iteration, 4.6 s at 1e8. No exception is raised.
    - About 99 s at the Int32 maximum, extrapolated, not timed.
    - The fix: bound every offset by the array, and refuse as partition-decode-failed. A3 3(a)'s S2 (the wrong failure state) rides along.
  (b) A1-1, the data plane (`state/cloud/wave1/A1.md`).
    - The defect: a stated foreign Origin carrying one non-ASCII byte is admitted as if no Origin were sent, when sec-fetch-site is same-origin. This goes against docs/09's exact-match validation and ADR-020's Decision.
    - Its bounds: the token is still required, and browsers send ASCII origins.
    - Reproduced on Windows: the control passes, and the two stated-Origin cases fail.
    - The fix: a present Origin that is not visible ASCII is refused like any other foreign origin.
  (c) A5-1, the data plane (`state/cloud/wave1/A5.md`).
    - The defect: `StreamRegistry` keeps every served stream's state and terminal for the life of the process, with no ceiling. It grows with every tile stream.
    - Its bounds: each entry is small.
    - Reproduced on Windows: 200 retained after 200 finished streams.
    - The fix: drop an entry at its terminal, or bound it by time as the kernel's registry already does.
  Custodian's recommendation: all three become cuts.

---

2. A2-1, for the record (`state/cloud/wave1/A2.md`).
  - The defect: the untiled manager admitted a ticket minted after its session ended. That is the client half of ADR-028 Amendment 4 item 2; the kernel refuses the redemption, so it was masked end to end.
  - Under wave-1 rule 2 its fix is already folded into the watcher (Amendment 4). SH12–SH16 cover both routes and the candidate arm's untiled sink, which the watcher's consult found beside it.
  - It is gated with the watcher; no separate cut is needed.
  Your call is the severity on record.
  (1) S1, as §4's letter reads it; the fold-in stands (Recommended).
  (2) S2, because the kernel masks it; the fold-in stands all the same, since Amendment 4 records the fix as owed under ADR-028 whatever the severity.

---

3. B's licences and PR #124 (`state/cloud/wave1/B.md`).
  - B could not reproduce the compatibility corpus from the tracked tree. The generator scripts, the commands and the full hashes sit only on this machine, untracked, under `target/fixtures/compat-corpus/`.
  - Eleven of the twelve files have no recorded licence. B stopped on that, correctly.
  - PR #124 adds `tools/corpus/`: a manifest (URLs, 12-hex prefixes, null licences), a fail-closed fetch script and a README. It adds no data. Its check is green.
  (1) Hold #124 unmerged. A later custodian piece completes `tools/corpus/` from the local corpus of record, with the full hashes, the scripts and the exact commands, and no data. It researches each file's licence at its primary source, and brings the licence table to you before anything merges (Recommended).
  (2) Close #124 and keep the corpus local-only.
  (3) Merge #124 as it is.

---

4. PR #123, C's SKP conformance fixtures (`state/cloud/wave1/C.md`).
  - It is written at skp/0.4, and its green checks ran against the baseline.
  - The watcher's architect gate found that once the watcher lands skp/0.5, #123 fails on main: every request literal changes, and `open_dataset`'s response gains `session`.
  - #123 also carries C-1, the cancel response's free-string state (S2), and its list of spec ambiguities.
  (1) Hold #123 until the watcher merges. Then the custodian merges main into `cloud/wave1-C`, updates the fixtures to skp/0.5, re-runs the harness and records the new counts, and brings #123 back for your click, with C-1 and the ambiguity list (Recommended).
  (2) Close #123.
  (3) Merge #123 now, at skp/0.4.
