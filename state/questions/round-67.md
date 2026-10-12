Question round 67 — 2026-10-07 (custodian → human; written by the round-mirror hook from the AskUserQuestion call). 3 items, asked in one call. RED LINE items: none. AskUserQuestion is the answer channel; this mirror is read-and-copy.

---

1. Milestone 1, OPEN-5: size. The form declares at most 3,250 changed lines over 25 files, tests included, against the plan's estimate of 1,500 (the App return block counts deletions, styles.css's old-layout comments are marked as history, a render test copies the WebGL mocks, and a new e2e suite needs its launch code). (a) One piece at the declared figure. (b) Split into 1a (seams, frame, unit tests) and 1b (e2e suite and walkthrough): two gate cycles and an intermediate shell without e2e proof. The architect recommends (a).
  (1) (a) One piece (Recommended) — Milestone 1 is built and gated as one piece at up to 3,250 lines.
  (2) (b) Split in two — 1a: seams, frame and unit tests; 1b: e2e suite and walkthrough.

---

2. Milestone 1, OPEN-6: ADR-021 keeps the scan's liveness line and Cancel in the Filter panel, so with the Inspector closed a scan with no batch yet would show nothing (the plan's move of liveness to the status bar conflicts with ADR-021). (a) A read-only mirror in the status bar, same strings and same delay gate, no Cancel. (b) No mirror. The architect recommends (a): progress stays visible whatever the layout (docs/01 principle 7).
  (1) (a) Status-bar mirror (Recommended) — A read-only liveness mirror in the status bar; Cancel stays in the Filter panel.
  (2) (b) No mirror — Liveness shows only in the Filter panel.

---

3. Milestone 1, OPEN-7: the form predicts (H1) that a layout change that resizes the map issues no viewport query, so an area the layout uncovers fills only on the next pan or zoom, as after a window resize today; an e2e step records it. If that holds: (a) one KNOWN-LIMITATIONS line now, worded for your P6 sight, with the fix in milestone 2, which already edits the canvas; (b) allow a WorkingCanvas edit in milestone 1, against the plan's ruled §5.5 boundary. The architect recommends (a).
  (1) (a) Limitation now, fix in M2 (Recommended) — A KNOWN-LIMITATIONS line if H1 holds; milestone 2 fixes it.
  (2) (b) Allow a canvas edit — Milestone 1 may edit WorkingCanvas to refill on a layout resize.
