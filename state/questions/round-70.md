Question round 70 — 2026-10-09 (custodian → human; written by the round-mirror hook from the AskUserQuestion call). 4 items, asked in one call. RED LINE items: none. AskUserQuestion is the answer channel; this mirror is read-and-copy.

---

1. OPEN-1: the re-aim must keep proving refuse-then-declare on a file that still refuses and offers a column to declare. Today's fixture writer cannot make one (it writes either id or parcel_key, never both). How is that file written?
  (1) (A) Test-support variant (Recommended) — One feature-gated variant in engine/src/fixture.rs (test support, never shipped) writes a text id beside parcel_key; two generators in kernel/tests. Gives walkthrough I4 a route an operator can walk. Up to 40 lines under engine/src.
  (2) (B) No engine edit — Prove the route by first declaring a column the keyless file lacks (it refuses, offering parcel_key), then parcel_key. Not a refusal on a plain open, and I4 cannot be walked that way by hand.
  (3) (C) DuckDB rewrite — A kernel-test generator rewrites the keyless fixture through DuckDB to add a text id. Depends on DuckDB keeping the geo metadata, which is unproven.

---

2. OPEN-2: each re-aimed step is shown still able to fail by one observed mutation. Which kind of mutation?
  (1) (a) Test-side only (Recommended) — All mutations edit test lines or switch a fixture; no product line is touched, so no allowance is needed. REFUSAL-prime's mutation is a read-side stand-in.
  (2) (b) Two product-line ones — For REFUSAL-prime and GROUP-prime only: temporary edits to ConsolePanel.tsx and consoleViewModel.ts on your 2026-10-08 terms (worktree only, one at a time, restored). Stronger for REFUSAL-prime.

---

3. OPEN-3: your ruling names walkthrough rows C2/C3, I4 and I5. Rows I6 and I8, the Part C heading and three fixture-table rows also name a fixture that no longer refuses. Include those name changes, for your sight, in this PR?
  (1) (a) Include them (Recommended) — The same PR updates those rows and tables for your sight; no result log is edited.
  (2) (b) Leave them — Only the rows you named change; a proposed node records the rest.

---

4. The re-aim turns out to touch kernel/tests and, under OPEN-1 (A), engine/src/fixture.rs. You said the architect drafts it alone; the lead-data pilot puts an impact read first for pieces touching engine/ or kernel/. Which governs here?
  (1) Alone stands (Recommended) — No impact read for this test-support piece; lead-data checks the owner's index before the final gate only if a pointer changes.
  (2) Impact read now — lead-data reads it now and the architect amends the form; the code waits on the K6 merge anyway.
