Question round 28 — 2026-09-26 (custodian → human). Three items, in ask order; items 1 and 2 are RED LINES (public exposure, history). They come from your round 27 item 2 clause (iii): every earlier exposure check that used the broken grep, re-run properly with a canary and exit status, reported before the corpus push. No path or name is reproduced here.

The re-run: one check was broken outright (the corpus piece's own username check, already re-run: 140 accepted hits). Nine checks from entry 49's audit and the ADR-009 checklist recorded no flags; each was re-run properly. Seven match their original results. Two found things never reported:

---

1. RED LINE — commit messages. The message bodies of 7 pushed commits on main, entry-47 and entry-66(b) fixes from 2026-09-11, carry a scratchpad path that names your Windows profile, in the 8.3 short form and in full (14 occurrences). They are history; the only removal is a history rewrite and force-push, itself a red line. Your first name is already public as the GitHub owner and as the author of every commit.
  (1) Accept: history stays as it is; the class is recorded (Recommended).
  (2) Rewrite history to remove them (force-push; your explicit word, and every clone and open PR is affected).

---

2. RED LINE — the tree on main. 64 matches in 25 tracked files name your profile in a path. The public folder, placeholders and made-up example names are excluded. Most are scratchpad paths that agent reports carried in when they were filed; the rest are dependency-check outputs under spikes/lod-feasibility, archived ledgers, one line in the accepted ADR-020, one test fixture in the kernel's audit normalizer, and the two audit files themselves. Several are immutable records (gate reports, archives, an accepted ADR, the ledger), which the record rules say are never edited in place.
  (1) Fix forward in one docs piece: reword the paths in current-state files, spike outputs, drafts and the fixture; leave the immutable records as they are; and add a standing rule that a filed report's scratchpad paths are redacted at filing (Recommended).
  (2) As (1), and also edit the immutable records, by your word as an exception to the record rules.
  (3) Accept all as they stand, as F-1's class (a first name, no credential).

---

3. The corpus push. The corpus branch adds no such path: its C8 check over every added line is 0, and none of the 64 is in its diff. The push still waits for Amendment 3 (your round 27 answers) and a scoped gate read.
  (1) The corpus push does not wait for item 2's piece (Recommended).
  (2) The corpus push waits until item 2's piece has landed.
