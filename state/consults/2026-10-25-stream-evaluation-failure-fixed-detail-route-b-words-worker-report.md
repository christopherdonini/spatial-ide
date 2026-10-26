*Custodian's filing note (2026-10-25): the worker's route B words on filler 2 (draft PR #255), at 8cca70ae, under the form's Amendment 2: the architect's route B words 1 to 3 in three doc comments of engine/src/stream.rs and gate 1's D1 words in the campaign's doc, approved by the human on 2026-10-25. The custodian's check at the head: each word set, read from its report line, is in its file once the doc lines are joined; every changed line is a doc line; the diff from the merge base is 144 lines, under section 21c's 150. Its edits were made through the shell; no rebase, reset, PR action or force push. The run 08:39:09Z to 08:43:38Z by its transcript (Read 2, Bash 14, Monitor 1). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is dc78622dd50e42e6bb4cebf58a71fc27847f7a484adb6f0e68cfcd0dc8563f9a.*

---

Applied: #255's route B words at 8cca70aec09942b7eaa66a79292be4a35c7b2335

Commit: one commit on cut/stream-evaluation-failure-fixed-detail, signed with -s. The message file had no sign-off line and only the one `@` on the Co-Authored-By line. The `@` in the final log comes from the `-s` sign-off.

Doc comments (the words are byte-copied by a script from the cited lines, `> ` dropped, wrapped to 100 columns):
1. `OUT_OF_RANGE_DETAIL` in `engine/src/stream.rs` now carries the route draft's line 71. The old text was "The whole terminal detail for a stream whose evaluation went out of range (an admitted predicate's integer ... overflowing). ...".
2. `is_out_of_range` now carries line 85. The old text was "DuckDB's out-of-range class, read from `message` (DuckDB's own text, without the engine's phase prefix) by its label ...".
3. `classify`: its last clause is now line 90. The first two clauses are unchanged. The old last clause was "every other failure keeps `phase` and DuckDB's own `message`."
4. `is_declared_integer_arithmetic_overflow` in `engine/tests/admission_property_campaign.rs` now carries gate 1's D1 words (gate file line 58). It adds "and any integer literal" and "keyed on `i64` or `id` written beside ` + `, ` - ` or ` * `".

Size stop: before the commit, `git diff --numstat f0804432 -- .` summed to 144 (stream.rs 74+5, admission_property_campaign.rs 45+6, filter_type_admission.rs 9+5). That is under 150, so I went ahead. After the commit, `git diff --numstat f0804432...HEAD` gives the same three rows.

Checks:
- `git diff --stat 27924bbe HEAD` shows only the two files: stream.rs 23 lines, admission_property_campaign.rs 3 lines, 18 insertions and 8 deletions.
- A script over `git diff -U0 27924bbe HEAD` found 0 changed lines that do not begin with `///` once indentation is trimmed.
- `cargo fmt --check -p spatial-engine`: rc=0.
- `cargo check -p spatial-engine --tests` (CARGO_TARGET_DIR=D:/wt-targets/sefd, inside a shared hold): rc=0.
- `node scripts/plan/verify-cites.mjs`: rc=0, PASS (97 loose references advised).
- `node scripts/plan/verify-quotes.mjs`: rc=0, PASS (0 errors).
- Push: rc=0. HEAD and origin's branch are both 8cca70aec09942b7eaa66a79292be4a35c7b2335. `git status --porcelain` is empty.

Off-scope: none.

Model: Sonnet 5.5 (claude-sonnet-5-5) per the harness. No override and no context handoff.

Pre-gate self-check:
- Cross-module seams: none touched.
- Completion claims: each points to a transcript call above.
- User-facing messages: none changed.
- Required tests: no test body changed.
