Question round 19 — 2026-09-24 evening (custodian → human). Two items in ask order, one question set; DECISIONS-PENDING entries 132 and 133 carry the full text. No item is a red line. Status at filing: #109, #113 and #115 merged; #112 re-merged with main after them (item 17 takes #112's gated text; CI running) and ready for your click; PR #116 (a kernel hang fix, found through ADR-035's gate) in its full gate.

1. ADR-035, PR #114 (entry 132) — STOPPED under Rule 7 a second time, on a kernel defect rather than ADR text. The architect found that a pending stream ticket's source is dropped while StreamRegistry's lock is held; if its post-check had seen a source change, the drop ends the generation and re-locks the same lock — a hang. The custodian confirmed it by reading, and PR #116's regression tests confirmed it by failing on the unfixed tree. With the fix in, that case becomes an ordinary drop-path end, which the ADR's residual case 2 already names. The reviewer passed the ADR at the same attempt.
  (1) Fix first, then one confirmation read (Recommended): PR #116 lands through its gate; then one read of ADR-035 under a fresh count, carrying the reviewer's non-blocking point (whether option (b)'s emission includes pre-check ends) and the record nits.
  (2) Hold ADR-035; the watcher waits.

---

2. PR #108, the verify-mutation union design (entry 133). The code passed both gates (0 tests lost against main's tool on the real tree and on 200,000 random inputs); both failed on the record only, and the record-cap reduction is applied and custodian-verified. Landing problem: the record's committed amendments name twelve tests the union round removed; verify-test-claims binds them once the node is done, turning main red; only the held superseded-name scanner would clear them. The custodian reads round 18 item 4's "if it stops again" as a Rule 7 stop, not a record-only FAIL — your choice below confirms or rejects that reading.
  (1) Merge; the node stays in progress until the scanner lands (Recommended): its gate names the form so the names stay advisory — your round-16 item-4 P3b precedent extended to this node; confirms the reading.
  (2) Scanner first: schedule the superseded-name scanner; #108 waits for it; confirms the reading.
  (3) Drop #108 (rejects the reading): the 13 tests are listed as a known limit of the tool.
