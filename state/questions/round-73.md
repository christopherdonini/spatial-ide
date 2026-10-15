Question round 73 — 2026-10-14 (custodian → human; written by the round-mirror hook from the AskUserQuestion call). 4 items, asked in one call. RED LINE items: none. AskUserQuestion is the answer channel; this mirror is read-and-copy.

---

1. b2-piece-1b-recording stopped at I3: an existing test needs an edit outside the form's exception. Three unit tests were already edited by one line each, and e2e console.mjs's CLASSC' and GROUP' fail by design: style edits are now recorded steps, and each Apply now writes a record_step row between the grouped queries. How do you rule?
  (1) Allow, re-aim (Recommended) — The three one-line unit-test edits stand; e2e/console.mjs joins the piece's paths, and CLASSC' and GROUP' are re-aimed at the new behaviour. I show you the exact changes before any gate.
  (2) Hold for my words — Keep the piece stopped until you give your own ruling in a typed message.

---

2. Piece A, OPEN-1 (before A starts): the routine-read measurement script is written once and never changed. Which ledger part does it count?
  (1) Last 7 days (Recommended) — Ledger entries dated within the 168 hours before the block's flushed_at; after B's weekly rotation this is the live ledger.
  (2) Last 10 entries — The last 10 dated ledger entries.
  (3) Whole ledger — The whole ## Ledger section: matches B's new item 1, but overstates today's reading order.

---

3. Piece B, OPEN-1 (before B starts): your directive itself cites lines 332-333 of state/CUT-STATE.md. After the first rotation that citation points past the end of the file and verify-cites would fail on it. How should verify-cites treat it?
  (1) Unpinned ledger cites advisory (Recommended) — Any unpinned line citation into state/CUT-STATE.md is advisory wherever it sits, as your C.7 does for DECISIONS-PENDING; pinned ones stay checked. C extends it to DECISIONS-PENDING.
  (2) All directives advisory — state/directives/ joins the advisory prefixes, as drafts and gate reports already are.

---

4. Piece B, OPEN-2 (before B starts): you asked flush.mjs to write a refused block to a scratch file when it refuses "in the precompact or stop hook", but neither hook runs flush.mjs. Which way?
  (1) Every refusal writes it (Recommended) — Every cap refusal writes the refused block whole to the scratch file, which covers those cases; the hooks stay unchanged.
  (2) A flag from the hook — The custodian passes a flag when a hook's message asked for the flush; changes two tested messages, about 40 more lines.
