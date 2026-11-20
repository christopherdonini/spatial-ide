*Filed by the custodian: the correction worker's hand-back (claude-sonnet-5-5), 3947 bytes, sha256 24d69703e69d5dd6a98d22b3258570f6e96617c4ac0897a101d7e5317f42ce1d, below the rule, byte for byte but for two hold-line project values as <m>, with one final newline added. Calls Bash 19, Write 4, Read 1, SubagentHandback 1, one errored, by unique call ids, from 2026-11-20T01:34:10Z to 2026-11-20T01:38:29Z by its transcript. The record is its transcript.*

---

Built: b2-piece-1c-save-and-reopen P3b-2 correction, worker. Model: claude-sonnet-5-5 (no override; no handoff received or produced).

Commits (branch cut/b2-piece-1c-p3b-2, base ddd74c34):
- c759c2cc12c1e2c3167b54ad70be44bd9f9cac77 docs: the reopen's words as ADV-2026-11-20-01 and -02 rule them, and the architect's D-6, D-7 and item 7 (P3b-2)
- 231b32cc388b293dc6030f5f92c8b044c85c663a test: W-7's doc as ADV-2026-11-20-01 (i) rules it, its second copy of case (a) deleted, U+0085 as an escape (P3b-2)
Push (own call, rc=0): `ddd74c34..231b32cc  cut/b2-piece-1c-p3b-2 -> cut/b2-piece-1c-p3b-2`. Remote head 231b32cc. No fetch was run.

Data files: sizes and sha256 of the brief, both rulings and both JSON files matched. I read the rulings against pairs a-h, i, j, k, l (g carries ADV-02 item 5's New) and found them identical. m, n and o match the architect's report (D-6 line 125, D-7 line 126, item 7's six lines at report lines 74-85). Pair o's Old matches lines 929-932 of skp.rs. No difference found.

Checks:
- Commit 1, script 1cp3b2c-apply.mjs. Each Old was found once in J(file at ddd74c34). J(base with Olds replaced by News) equals J(my file) for all six files: commands.rs (protocol), mod.rs (protocol), SKP-V0.md, project/mod.rs, kernel skp.rs and shell commands.rs, each printed "J EQUAL". The SKP-V0.md changes are single-line in-place replacements (a-h plus m, 6 lines).
- Over-width: 33 added Rust lines checked, 0 over 100 columns.
- Commit 2, script 1cp3b2c-test.mjs. The two copies of case (a) (lines 632-641 and 643-652) are byte-identical. The blank at 642 and the one at 653 are both empty, and line 654 is the `#[cfg(not(target_os = "linux"))]` line. The file held one U+0085. "J equal: true". Of the changed doc lines, 0 of 3 are over 100 columns. No raw U+0085 is left.

Test at head 231b32cc, in one shared hold: `cargo test --locked -p spatial-kernel --test project_reopen_skp`, exit 0, 7 passed; 0 failed. All seven tests ok:
- a_not_found_reply_names_the_file_and_a_relink_through_the_command_opens_it
- a_refused_relink_through_the_command_leaves_no_catalog_entry_and_open_lock_free
- a_question_reply_and_its_answered_second_call_through_the_command
- a_saved_project_reopens_through_the_command_from_its_wire_request
- a_copy_answer_whose_data_is_not_found_writes_nothing_and_its_second_call_keeps_the_file_name_and_the_previous_lineage
- basis_and_file_name_carry_a_text_read_from_a_file_only_bounded_and_with_no_control_character
- each_reopen_refusal_reaches_the_wire_as_its_code_with_no_path_it_was_not_given
`cargo fmt --check`: root workspace exit 0, `frontends/shell/src-tauri` exit 0 (run before commit 1), root again at the head exit 0.

numstat, added / deleted per file.
Whole (ddd74c34..HEAD):
- 5/3 shell src-tauri/src/commands.rs
- 11/5 kernel/src/project/mod.rs
- 6/4 kernel/src/skp.rs
- 4/15 kernel/tests/project_reopen_skp.rs
- 6/6 protocol/skp/SKP-V0.md
- 7/5 protocol/skp/src/v0/commands.rs
- 4/1 protocol/skp/src/v0/mod.rs
Commit 1: the same lines except the test file, which is absent.
Commit 2: 4/15 kernel/tests/project_reopen_skp.rs.
No ceiling was touched.

Hold lines (values masked): `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:77272 also=<m> (commands started from now on inherit it; release when done)`, then `MACHINE_RELEASED project=<m> shell=bash.exe:77272 affinity=FF (cores 0-7)`. No MACHINE_WAITING or MACHINE_ERROR line.

New texts I think untrue: none was checked against the code beyond what the gates will do; all applied as ruled.
Not done: clippy, e2e, workspace-wide tests, and the closing amendment. None was in scope.
Departures: none. No stops. The paragraph wraps in the Rust comments were greedy at 100 columns, from the changed line to the paragraph end. In the shell commands.rs the wrap (pair n) starts at line 8. No background process is left running.
State: `git status --porcelain` is empty; HEAD is 231b32cc, pushed.
