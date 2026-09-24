Question round 18 — 2026-09-24 (custodian → human), after round 17's ruled work. Four items in ask order, one question set; DECISIONS-PENDING entries 129, 130 and 131 carry the full text. No item is a red line. Status at filing: PRs #109, #112, #113 and #115 ready for your click (#109 before #112; the custodian merges main into #112 after #109 lands); PR #115 (the fixture regeneration entry point; byte-identical output proven twice) closed under AI_DEVELOPMENT.md Amendment 1 §A; PR #114 (ADR-035) and PR #108 STOPPED under Rule 7.

1. ADR-035, PR #114 (entry 130) — STOPPED under Rule 7. The redraft resolved every first-gate finding, then failed its second gate in both halves on one sentence it added: that an end made by the post-check always reaches the shell on its own call. A cancelled or failed stream keeps its own terminal and a drop-path end delivers none, so such an end reaches the shell only at its next generation-scoped call's refusal; rider (a) keeps that correct, but the ADR said it did not happen.
  (1) Continue: one text round under a fresh count (Recommended). The clause is reduced to what the tree does and the residual named; whether post-check ends should also emit becomes an Open item; the record-only notes are corrected; a fourth form the architect found is added to Open item 1; entry 129 revised to match; both gates.
  (2) Hold: ADR-035 waits; the watcher waits with it.

---

2. ADR-035's Open item 1 (entry 129): the session reference's wire form, under rider (b), which excludes a handle. Today the only per-session identifier on the wire is the DatasetHandle, a handle by SKP-V0 §3. A fourth form, a non-invertible digest of the handle (no new member, no new mint), was found by the second gate and is not yet assessed; type it if you want it.
  (1) (ii) A kernel-minted, non-authorising reference (Recommended, the architect's): returned by open_dataset, accepted by no command. Meets the rider as written; costs a new minting rule in SKP-V0 §3, one open_dataset response member, and a session-to-handle map in the shell.
  (2) (i) Echo the DatasetHandle: no new wire value and the shell's guard is unchanged; needs your reading that the rider excludes only authority the recipient does not already hold.
  (3) (iii) A client-minted correlation value supplied on open_dataset (the CancelKey precedent): the kernel mints nothing; the guard's collision-freedom moves to the client.
  (4) Hold.

---

3. ADR-035's Open item 2 (entry 129): the reading of rider (a)'s every-later-call. The ADR reads it as every later generation-scoped call — viewport_query and redemption of a ticket from the ended generation. describe, cancel and close_dataset are not generation-scoped and answer after the end by design today.
  (1) Confirm the reading (Recommended): refusing describe or close_dataset after the end would strand the handle with no ordinary way to close it.
  (2) Every later call means every call: describe, cancel and close_dataset also refuse after the end (a new behaviour and a close path to design).
  (3) Hold.

---

4. PR #108, the verify-mutation narrowing (entry 131) — STOPPED under Rule 7 a second time. The rewind fix holds in both gates (0 lost against main's tool on 25+ inputs and the real tree: main 2240, branch 2253). The correction's own no-loss property test reads origin/main's tool and asserts one exact loss, so after merge it compares the tool with itself, fails, and turns main's governance CI red.
  (1) Continue, one round under a fresh count (Recommended): pin the test's baseline to a fixed commit on main before the piece (or assert the six fixtures' lists directly), give it a recorded mutation, clean its scratch directory; the architect reduces the record under the record cap; both gates.
  (2) Continue with the reviewer's union design: return the union of main's per-line scan and the tracked scan, a superset of main's by construction, which also closes the disclosed false-close residual — a departure from your ruled fallback design.
  (3) Drop: the 13 real tests behind multi-line ignore attributes stay invisible to the tool.
  (4) Hold.
