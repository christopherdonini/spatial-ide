# Rulings of 2026-10-17: the flake's read-only diagnosis by lead-data and S5d at slot 2's tail; item 44's OPEN-1 and OPEN-2; governance A's OPEN-2, B's OPEN-3 and OPEN-4, C's OPEN-1 to OPEN-4; clause composition's OPEN-1 and OPEN-2; e2e-readme's OPEN-1; item 41's source comment; the unknown-attempt triage item — the human, verbatim

*Custodian's filing note (2026-10-17): typed by the human, received at 07:11:53Z by the transcript (its user record). Below the rule is the message, byte-copied by script from that record, from line 6. One final newline is added and nothing else is changed. It names no other project. The message says several of its rulings are a resend of 2026-10-14; no earlier record in this session's transcript holds them. It gets a RULED block in `DECISIONS-PENDING.md`.*

---
To the custodian, 2026-10-17. Rulings, several of them a resend of 2026-10-14.

1. Placements.
connection-reuse-recycled-interrupt-flake: first a read-only diagnosis by the lead-data agent, no slot, alongside the running work: where the recycled connection's interrupt handle is bound relative to stream_with_cancel's return; whether a cancel in any window before the bind can still let a batch through; whether the test's is_bound() read can run before the bind. Then I grade: bound before return and still unbound in CI is S1 and goes to slot 1 ahead of the order; a window the producer closes by checking the token at bind is S3, a test fix with a comment on the window.
source-changed-post-route-s5d-race: S3, five-line form, tail of slot 2 after engine-clause-composition-properties and boundary-inventory. Its first step reproduces under load with timing; no piece is charged with it.

2. Item 44: OPEN-1, yes to §A's words as drafted. OPEN-2, no; the v0.1.0 page's paragraph is for corrections, and item 44 corrects nothing the notes claimed.

3. Governance.
A: OPEN-2, if O6 finds the hidden probe, the first sentence becomes the architect's H1 and the second and third stay as I wrote them. OPEN-3 waits for the assembled W.
B: OPEN-3, readings (i) to (iv) confirmed. OPEN-4, (a) the added sentence, (b) the notice with P as <commit>, (c) the pointer, all approved as drafted.
C: OPEN-1 (A); I strike in the PR body, and what I do not strike stays. OPEN-2 (A), the fourth reader. OPEN-3, my words: C.7's "pin the line" narrows round 12 (a). A line reference into DECISIONS-PENDING.md or into one of its archives under state/cut-archive/ is allowed when it is pinned, path:line @ <main commit> sha256:<hex>; an unpinned one fails by name as before. The gate definitions are read with this and not edited. The new file's archive lines are written in words, with no path:line token. OPEN-4, readings (i) to (v) confirmed.

4. engine-clause-composition-properties: OPEN-1 (A), the five-line form with the reviewer and the architect from dispatch. OPEN-2 (a), the drafted sentence.

5. e2e-readme-status-bar-steps, OPEN-1: land the words as drafted; they are the architect's under item 2d.

6. Item 41's source comment: its own docs-lane line, by the same procedure as item 40's, with the selection.ts pin on main.

7. The "unknown attempt" triage item: add it. Publish: the approval came back as "unknown attempt" under machine load (status-bar e2e run 2; the H3 order run). Establish the cause first: the pending attempt's 120 s TTL elapsing between prepare and execute, or an attempt the host lost. Then the product question: whether 120 s suits a person reading the approval dialog, which shows no expiry. Until it is triaged, the e2e export steps record the prepare-to-execute elapsed time and name a TTL expiry INCONCLUSIVE, not a failure. Grade at triage; S2 at most, since the refusal is visible and nothing wrong is produced.
