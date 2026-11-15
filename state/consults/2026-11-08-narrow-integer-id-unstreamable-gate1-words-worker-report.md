*Custodian's filing note (2026-11-08): the words worker's report for gate 1 of PR #297, from its hand-back (sha256 193699e6a232a0fb0b4cf7dfae294848f1d435e1fa8f1e16a970af769e32ac0b, 3739 bytes), byte for byte. Its transcript holds 30 unique calls (Bash 24, Read 4, Write 1, the hand-back 1), equal to its notification; model claude-sonnet-5-5; run 01:30:45Z to 02:09:07Z. Checked by the custodian at origin: the branch at 990402ab62a097dd9bfdfa4c3e366fcb1e5b98d2; from f82adfc5 only `engine/src/fixture.rs` changed, 5 added and 3 removed, its sha256 the brief's 0725fc2de62fb151dffcbe91d0bf2a76a069d8132b1c9961ea6c8018ce0550f7; against the base 47da4d05, 637 changed lines over the seven files. The reviewer's D1 words (gate-log 703), applied with no re-gate (Part 1, item 2).*

---

Built: 8g's gate 1 words at 990402ab62a097dd9bfdfa4c3e366fcb1e5b98d2

- **Start state:** HEAD and origin/cut/narrow-integer-id-unstreamable were both f82adfc519a98f0b5160e1fd0625c471a466a1b2, and the porcelain was empty. D: has 202G free (`df /d`); `df D:` itself failed in Git Bash.
- **Brief and report hashes:** the brief matched its sha256. The reviewer hand-back matched 1ead7393…8176b.
- **Words files:** old text is 393 bytes with sha256 1d1c208f…27b4. New text is 520 bytes with sha256 9e04fc5b…f155. Both matched the brief.
- **Script:** the script is 8gw2-apply.mjs in the scratchpad. It found the old text exactly once, replaced it at byte 28151, and exited 0.
- **Checks 1–3:** the hash after the edit is 0725fc2de62fb151dffcbe91d0bf2a76a069d8132b1c9961ea6c8018ce0550f7, as given. Numstat is exactly `5	3	engine/src/fixture.rs`. The file has 0 CR, and no added line is over 100 columns.
- **Check 4:** `cargo fmt --all -- --check` gave rc 0 with empty output.
- **Check 5:** the commit is 990402ab, signed off with `-s`. The message file had `@` only in the Co-Authored-By line. Subject: `docs: narrow-integer-id-unstreamable, gate 1's words: the reviewer's D1 in the NarrowInteger fixture doc, no re-gate`.
- **Check 6, suite:**
  - `cargo test --workspace --locked` exited 0.
  - 118 `test result:` lines, summing to 1027 passed, 0 failed, 66 ignored.
  - These passed by name:
    - `a_narrow_integer_identity_column_streams_every_row_with_its_source_value_widened_to_u64`
    - `a_negative_value_in_a_signed_narrow_identity_is_refused_at_open_and_at_stream_on_the_unverified_route`
    - `a_narrow_integer_id_file_opened_through_the_kernel_streams_to_the_data_plane_without_a_terminal_error`
    - `identity::tests::only_value_preserving_integer_types_are_admitted`
  - The two engine tests are E1 and E2 by their position in that file; I did not map them by name.
- **Check 7:**

| Command | rc | Last line |
|---|---|---|
| verify-cites | 0 | PASS, 2745 files, 174 loose references advised |
| verify-quotes | 0 | PASS, 138 checked, 107 verified, 30 baselined, 1 advisory |
| verify-test-claims | 0 | PASS, 756 claimed tests across 242 files |
| verify.mjs --offline | 0 | PASS, PLAN.yaml agrees with the repository |
| `node --test` | 0 | 598 tests, 598 pass, 0 fail |

- **Numstat** against 47da4d05…, three-dot:
  - `6 0 docs/adr/ADR-016-stable-feature-identity-admission.md`
  - `3 3 engine/README.md`
  - `148 2 engine/src/fixture.rs`
  - `16 1 engine/src/identity.rs`
  - `49 0 engine/src/stream.rs`
  - `293 0 engine/tests/narrow_integer_id_stream.rs`
  - `116 0 kernel/tests/narrow_integer_id_stream.rs`
  - Total +631 −6 across 7 files.
- **Hold lines:**
  - Suite: `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:20672 (commands started from now on inherit it; release when done)`, then `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:20672 affinity=FF (cores 0-7)`.
  - verify-quotes: the same two lines with shell=bash.exe:82396.
- **Push:** `f82adfc5..990402ab` was accepted. `git ls-remote` shows origin's branch equals HEAD, and the porcelain is empty.
- **Background shells left:** none. All of them (the suite, my wait loops and verify-quotes) had finished by the time I reported, so I killed nothing.
- **Model:** Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff.
- **Self-check:**
  - No cross-module seam was touched; this is a doc comment only.
  - Every completion claim above has a call behind it.
  - The user-facing text is the reviewer's own, byte-given.
  - The required tests reached their assertions: the three named seam tests and `only_value_preserving_integer_types_are_admitted` all ran and passed.

Nothing off-scope was done.
