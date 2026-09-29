*Custodian's filing note (2026-09-29): the reviewer's narrow check of the gate-3 reduction commit of PR #143 (PLAN node `b1-close-nul-column-names`). Reviewed: cut/b1-close-nul-names-2 @ 720f930 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message with the harness's two-space indent removed, and the text below the rule is the agent's. Verdict PASS on the reduction's pass condition: comment lines only, every fn body hash unchanged, and the prescription carried out. CI on 720f930 was still pending. Profile paths redacted at filing: none.*

---

Reviewed: cut/b1-close-nul-names-2 @ 720f930
Verdict: PASS. This is on the reduction's pass condition. CI on 720f930 is still pending (item 5).

Worktree: `C:\dev\wt\b1-close-nul-names`. HEAD is 720f93041f46 and the tree is clean. Its parent is f4d81c51dc98. The PR #143 head is 720f930.

**1. Only comment lines changed: PASS**
- `git diff --stat f4d81c5 720f930` shows three files: `engine/src/fixture.rs` (4 lines), `engine/tests/b1_projection_hostile_covering.rs` (2 lines) and `engine/tests/b1_projection_hostile_names.rs` (23 lines). That is 9 insertions and 20 deletions. No other file is touched.
- `git diff f4d81c5 720f930 | grep -E '^[+-]' | grep -vE '^(\+\+\+|---) ' | wc -l` gives 29, which matches 9 + 20.
- Filtering those 29 lines with `grep -vE '^[+-][[:space:]]*//'` leaves 0 lines (grep rc=1). Every added or removed line is a `//`, `//!` or `///` line. I read every hunk by eye: none is inside a function body.
- A second check: I removed all comment lines from each file and hashed what was left. The hashes are identical at f4d81c5 and 720f930:
  - hostile_names: 636ed46c…
  - hostile_covering: 312d8be4…
  - fixture: bbd5dcfd…

**2. The prescription, item by item: PASS**
- N-6: removed from "Observed by the gate-1 reviewer" through "not a silent pass." This clears my gate-3 B2 and the architect's B2.
- N-15: removed from "Observed" through "reasoning)." This clears my B1 and the architect's B1, including its misattributed 12.1(a) quote.
- Module doc: now reads "Every fixture an N-test in this file writes is hash-verified…" The line was re-wrapped and the wording is otherwise unchanged. This clears architect B3(a).
- N-14: ", R-S3's own "the schema does not contain" wording" is removed. The line now ends "falls straight to `field_path_exists`)." This clears architect B3(c).
- fixture.rs: "and used by every test in that file, control and hostile alike," is removed. "unchanged since c37b427" stays, which is correct. I re-hashed the local `write` in hostile_names.rs (from `fn` to its matching brace) at c37b427 and at 720f930, and it is the SAME. This clears architect B3(b).
- The addition beyond the prescription: the module doc's c37b427 reference drops its sha256 and now reads "…reproducer commit, c37b427."
- A `git grep` at 720f930 for `303dca0`, `b4d7aa1`, `gate-[0-9]`, `FAILED`, `every test in that file` and `sha256 515db` across the three files plus `b1_nul_native_id_scan_once.rs` finds nothing.
- The one R-S3 match is `fixture.rs:356` ("R-S3's case"). It is already on origin/main at line 353, so this branch did not add it, and it is a reference, not a quote.

**3. No test body changed: PASS**
- I extracted each `fn` from `fn` to its matching brace and hashed it with sha256. The script is in my scratchpad, `fnh.mjs`.
- At f4d81c5 and 720f930 the function lists match, with no hash differences: hostile_names 22/22, hostile_covering 7/7, fixture.rs 32/32.
- hostile_names at c37b427 against 720f930 shows these as SAME:
  - the three control tests: `hostile_names_round_trip_to_their_own_columns`, `hostile_names_colliding_after_case_folding_bind_one_column_each` and `hostile_names_an_uppercase_id_under_a_mapped_identity_is_admitted_beside_id`;
  - the helpers `drain`, `expected`, `file_names`, `path_for`, `string_values`, `text` and `write`.
- So my gate-3 mutation table at f4d81c5 stays the observation of record at 720f930.

**4. No observation claims left: PASS**
- I grepped the added lines of `git diff origin/main...720f930` (merge-base d37fd760) for "observ", case-insensitive. The pattern is proven to work: it matches the 2 removed "Observed" lines in the f4d81c5..720f930 diff.
- None of the added lines is a mutation-observation claim in test text:
  - Prereg lines: the finding's "unproven observation 3", the observable carve-out, "each mutation observed", and "the gate reports are the observation of record".
  - A function name: `build_index_observed`.
  - `hostile_names.rs:272`: "Recorded as observed, not as a defect: every name still binds one column." This is the uppercase-ID control test's doc. It is byte-identical to c37b427, where it is line 258, and 12.2 keeps it unchanged. It states the behaviour the test itself asserts on every run, not a mutation result.
- The "Observed:" lines in `kernel/tests/skp_projection.rs` come from main and are not added by this branch.

**5. Governance**
- At 720f930 all three checks pass with rc=0 (only advisories, none in this piece's files):
  - `node scripts/plan/verify-cites.mjs`: PASS, 921 files.
  - `verify-quotes.mjs`: PASS, 112 checked, 0 hash-reference errors.
  - `verify-test-claims.mjs`: PASS, 388 claims.
- `gh pr checks 143` on 720f930 (exit 8, some checks pending):
  - pass: "every commit is signed off" and "test · verify:plan · queue/site drift".
  - pending: both "cargo test --workspace (windows-latest)" runs, both "typecheck · build · vitest · cargo test" runs and both "tauri build (NSIS…)" runs.
  - The custodian should re-read CI before merging.
- 720f930 carries its Signed-off-by.

Blocking: none.

Suggestions: none within this check's scope. The architect's check 4 items stand for the closing record: a non-squash merge, keeping c37b427 reachable (ref or tag), and the 12.1(d) site as a reference.

Nit: the line-4 control-test wording ("Recorded as observed") could be misread as an observation claim. It must stay under 12.2, and it is not one.

Files:
- C:\dev\wt\b1-close-nul-names\engine\tests\b1_projection_hostile_names.rs
- C:\dev\wt\b1-close-nul-names\engine\tests\b1_projection_hostile_covering.rs
- C:\dev\wt\b1-close-nul-names\engine\src\fixture.rs
- C:\dev\spatial-ide\state\consults\gates\2026-09-29-a2-1-gate3-architect.md
