Question round 31 — 2026-09-30 (custodian → human). A placement round, on your 2026-09-30 placement-round directive (the 2026-10-02 weekly window becomes round 32). Two items. Source: PLAN.yaml's proposed nodes in the engine, kernel-protocol and publish-viewer lanes, with the shell lane and the port nodes left out, as you asked. Severity is the wave triage rule's (S1 cut candidate, S2 record); "ungraded" means a gate-routed or ruled item that carries no wave severity. Budgets are the plan's declared estimates, not measurements. Each placed node runs under the usual gating: a short-form preregistration committed before any code, a worker, then the reviewer, plus the architect where section 21a applies.

The recommended order, highest severity first (15 nodes, about 860 declared minutes):
S2, from the waves and the weekly window:
 1. engine-cancel-before-stream-window: a cancel landing between the producer's last cancellation check and stream_arrow is lost for one query. Wave 1, A5 observation 4, S2. 90 min.
 2. kernel-ticket-liveness-redeem-wording: a generation end between ticket_liveness and redeem reports a cancelled-before-redeemed refusal instead of engine.source_changed; the fix re-reads liveness after a redeem refusal, with no new string. Wave 1, A2 observation 2, S2. 60 min.
 3. publish-refusal-codes-and-attempt-lifecycle, its kernel half: a publish refusal's code is lost, collapsed to publish.engine, absent at the pin phase, or unprefixed on the raw-params path. Wave 1, A4-1 to A4-4, S2. Item 2 asks about its shell half. About 90 of its 180 min.
 4. kernel-close-dataset-unknown-keeps-openrecord: close_dataset returns unknown_dataset before removing the OpenRecord, keeping a watch's threads alive; no product path reaches it today. Wave 2, W2-C observation 3, S2. 30 min.
 5. catalog-open-replace-drop-latency-note: a replaced dataset's teardown runs under the catalog write guard (no product path replaces one today), and Catalog::remove's doc drifts. Weekly window (d), round 25 item 1, S2. 30 min.
 6. audit-reader-char-boundary: the audit reader's plain_date panics publish-bundle --audit-show on a hand-edited audit log (trusted, local input). Wave 1, A3 observation 1, S2. 30 min.
 7. skp-cancel-state-closed-set: the cancel response's state is a free string on both sides while SKP-V0 lists three values; recommended: hold both sides to the spec's closed set. Widening the spec instead would be yours, and is not proposed. Wave 1, C-1, S2. 45 min.
Ungraded, correctness-bearing:
 8. kernel-ticket-drop-followups: PR #116's deferred items (the no-drop-under-guard invariant made unwind-safe, a debug_assert on insert, the invariant's enumeration). Full gating. 90 min.
 9. type-walk-null-literal-arithmetic: NULL-literal arithmetic in the filter type walk (NULL + NULL refused, a lost bound flag); constant-NULL expressions only, no wire change and no new reason. B-1 reviewer N1, ruled non-blocking by the architect. 90 min.
 10. watch-grandparent-spawn-signal: a grandparent spawn failure leaves a signal the watcher's ChecksOnly arm ignores. Watcher gate-2 reviewer, suggestion 1. 45 min.
 11. timing-tests-assert-property-not-budget: two CI timing flakes assert the property and its ordering, not an undeclared budget. Your round 25 item 1 (a) ruling. 60 min.
 12. timing-assertions-under-contention: two latency assertions fail under concurrent build load. It applies the same round 25 ruling; if either budget turns out to be docs/08-declared, it comes back to you instead. 45 min.
 13. b1-engine-kernel-half-followups: B1 gate 3's routed items, one test (publish's retention flag through flush) and doc and record nits. 90 min.
 14. kernel-close-races-followups: comment and cite text only, routed by the close-races Amendment 2. 45 min.
 15. data-plane-crowded-start-detail-spaces: restore the operator-visible crowded-start detail string's lost line continuation (runs of spaces). Round 26 item 4 (b). 20 min.

What waits on you, not placeable by this round (listed so you can see it):
 - covering-names-missing-column: the one S1 candidate (A2-1's P0, k3; Fable's S1-or-S2 grading is also pending). Dropping the covering at open, as A2-1 did for U+0000, refuses bbox queries with engine.no_covering_bbox and a true detail; that detail string is yours.
 - stream-evaluation-failure-fixed-detail: B-1's 5c merged with W2-B observation 2; its fixed, engine-authored detail strings are yours.
 - b1-session-ordinal-refusal-wording: wave 2, A1-1, S2; refusal wording is yours, and Fable put it in the refusal-wording review at B1's close.
 - adr-035-close-races-note: your word to append a dated Note to accepted ADR-035 (5 min).
 - adr-032-decision: the GeoParquet non-x-first axis order ruling (20 min).
 - geometry-points-cut and geometry-lines-cut: behind ADR-034's acceptance (geometry-types-beyond-polygons).
 - data-plane-crate-fmt: superseded if you adopt round 32's item A (the workspace rustfmt pass).
 - publish-refusal-codes-and-attempt-lifecycle's shell half, unless item 2 says otherwise.
 Elsewhere and unchanged: ADR-034's acceptance, the O-07 walkthrough, round 32 on 2026-10-02 (the window's A to F plus PORTABILITY section 7), and at B1's close ADR-023's amendment and ADR-021's Note together.

---

1. Placement of the 15 nodes above, in the recommended order.
  (1) Place all 15 in the recommended order (Recommended). Worked one at a time from the top, each under the usual gating; wave 3's triage interleaves at its wake-ups without interrupting a piece.
  (2) Place the seven S2 nodes only (1 to 7), in order; 8 to 15 stay proposed.
  (3) Hold: place nothing now.

---

2. publish-refusal-codes-and-attempt-lifecycle's shell half. Its A1 observations 1 and 2 (the attempt-id keyed cancel token, the grants mutex held across a publish) and A5-2 (a staging directory left when the window closes mid-publish) live in frontends/shell/src-tauri, under the shell hold.
  (1) Split: the kernel half (A4-1 to A4-4) is placed at position 3; the shell half becomes its own proposed node and waits with the shell lane (Recommended).
  (2) Place the whole node at position 3, shell half included, as bug fixes rather than structural shell work.
  (3) The whole node waits with the shell lane.
