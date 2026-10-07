*Custodian's filing note (2026-10-07): `geometry-lines-cut`'s fix worker report for the gate-1 architect's D-1, D-4 and D-5, at the branch head c3acb40b095784738d4b77e1eededa77963f7dae. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 04e4c99034d079f6d95ed2d3c3251288bd83753f69cad1d40663b4d7b2d2ebbb. The custodian checked each fix against its finding by the diff 248d5f33..c3acb40b (3 files, 6 lines added and 6 removed). D-1: the ML-1 generator's doc names only T3, and the L-1 generator's doc adds T5. D-4: item 37's draft gains the casings-across-batches clause. D-5: the multilinestring sentence of `estimate_bytes`' doc is scoped to batches of two or more rows. Paths and lines below are at the branch head, not main.*

---

Commit c3acb40b095784738d4b77e1eededa77963f7dae "docs: geometry-lines-cut gate-1 architect D-1, D-4, D-5 fixed (comments and text only)", signed off with the two trailers. It is pushed to origin as an ordinary update (248d5f33..c3acb40b). The worktree is clean.

Fixes (comments and text only, no code changed):
- D-1, `kernel/tests/manual_walkthrough_fixtures.rs`: line 339, the L-1 generator doc, now reads "T1, T2, T4 and T5". Line 365, the ML-1 generator doc, now reads "for Part T's T3" and drops the E2E LN' mention.
- D-4, `KNOWN-LIMITATIONS.md` line 360: item 37's draft gains the sentence "Each batch's casing is drawn beneath that batch's lines, so where lines from two batches cross, a later batch's casing can draw over an earlier batch's line." The DRAFT source comment is unchanged.
- D-5, `engine/src/stream.rs` lines 2285-2287: the `estimate_bytes` doc now says "for a multilinestring batch of two or more rows, each part has at least 2 vertices...". I rewrapped the three comment lines to stay under 100 columns. The function body is untouched.

Checks, exit codes:
- `cargo fmt --all --check`: 0
- `verify-cites.mjs`: 0
- `verify-quotes.mjs`: 0
- `verify-test-claims.mjs`: 0

No build or test run, since the changes are comment-only and doc text.

Noticed and not done: D-2 and D-3 of the architect's report are out of my scope. MP-1's polygon sentence in the same doc has the same shape as D-5, and the architect notes it, but it was not in my three fixes, so I left it.

Model as the harness reports it: Sonnet 5.5 (claude-sonnet-5-5). No override and no context handoff.
