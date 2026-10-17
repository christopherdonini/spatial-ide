# Rulings of 2026-10-17, the second message: #223 and #224 merged; governance A's OPEN-3, W approved; milestone 3's OPEN-12 (a); the flake graded S3; the unknown-attempt node's first step in slot 1; S5d's OPEN-1 (A); the session-ended sentence for the sitting — the human, verbatim

*Custodian's filing note (2026-10-17): typed by the human, received at 16:39:19Z by the transcript (its user record). Below the rule is the message, byte-copied by script from that record, from line 6. One final newline is added and nothing else is changed. It names no other project. Its first line reports both merges: PR #223 at 16:36:08Z (merge commit cb46f85acf691a9e8535f084d2bc67df1d3f2449) and PR #224 at 16:36:21Z (merge commit 46e56dc9aba8c63eff8c08fe8ddb14a4af0cee8d), by GitHub's record. It gets a RULED block in `DECISIONS-PENDING.md`.*

---
Both merged,

To the custodian, 2026-10-17.

1. Governance A, OPEN-3: W approved as assembled, in the architect's words. S4 follows.

2. Milestone 3, OPEN-12: (a). PublishPanel's Props at B are the interface. The two members that differ from §0.5 are #219's, merged before this base, and this piece consumes neither. Re-pin them as class 3 and continue; nothing else of I4 applies.

3. connection-reuse-recycled-interrupt-flake: S3. The pool is right; the test's is_bound() read can run after a producer that matched nothing has finished and released the handle. The fix records the binding at bind time, in the stream's connection facts or an equivalent test-only fact, and the test asserts that fact instead of the live token. Five-line form, slot 2 tail, after S5d.

4. The unknown-attempt node: yes, its first step records the prepare-to-execute elapsed time in every export step, and a TTL expiry reads INCONCLUSIVE, not a failure. Slot 1 now; milestone 3's code starts when it has merged, since the two share e2e paths.

5. S5d, OPEN-1: (A). A five-line form for step 1's runs; a new form after, written from what the runs show.

6. The session-ended sentence: noted for the sitting. At P6 I take words that do not name the watcher where a pre-check or post-check ended the session; until then the placeholder stands.
