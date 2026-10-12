Question round 65 — 2026-10-07 (custodian → human; written by the round-mirror hook from the AskUserQuestion call). 2 items, asked in one call. RED LINE items: none. AskUserQuestion is the answer channel; this mirror is read-and-copy.

---

1. Round item 1 — typed-terminal-codes-post-check-race, OPEN-1 (form kernel/TYPED-TERMINAL-CODES-POST-CHECK-RACE-PREREGISTRATION.md): the fix itself edits only kernel/tests/typed_terminal_codes.rs, so your stop condition is not met by it. But the product-first direction (section 1) has the worker add the new form's line to kernel/README.md's owner's index in the same PR, and kernel/README.md is in the lines cut's file list. (1) Defer that one index line: the custodian adds it in this piece's closing record, after the lines cut has merged; the form declares the deviation; nothing else waits. RECOMMENDED by the architect. (2) The PR adds it after the lines cut merges and main is merged in, so this PR waits for the lines cut. Not a red line.
  (1) (1) Defer the index line (Recommended) — The custodian adds the kernel/README.md line in the closing record after the lines cut merges; this PR never touches a lines-cut file.
  (2) (2) PR waits for lines cut — The PR adds the index line after the lines cut merges and main is merged in; this PR's merge waits for the lines cut.
  (3) Hold — Keep OPEN-1 open; no code is dispatched yet.

---

2. Round item 2 — typed-terminal-codes-post-check-race, OPEN-2: Part B. The architect's sibling search (AUTONOMY's gate default: sibling search on every fix) found the same race in two tests in kernel/tests/session_end_event.rs, E2 and E3 (300-feature fixture, touch after the stream opens). That file is not a lines-cut file and not under protocol/. (1) Include Part B: E2 at 5,000 features with a batch-count assertion, E3 at 20,000 features so its producer is still blocked when E3 cancels; at most 70 more lines in that one file; each with its own recorded mutation. RECOMMENDED by the architect. (2) Route E2 and E3 to a separate proposed node, and keep this piece to the one test. Not a red line on the architect's reading. Part A proceeds either way.
  (1) (1) Include Part B (Recommended) — Fix E2 and E3 in kernel/tests/session_end_event.rs in this piece, under the sibling-search default.
  (2) (2) Separate node — Record E2 and E3 as a proposed node; this piece fixes only typed_terminal_codes.rs.
  (3) Hold — Keep OPEN-2 open; Part A may still proceed once OPEN-1 is ruled.
