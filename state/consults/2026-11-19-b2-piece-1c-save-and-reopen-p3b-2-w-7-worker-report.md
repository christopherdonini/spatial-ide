*Filed by the custodian: the worker hand-back (claude-sonnet-5-5), 6011 bytes, sha256 04c8e160ac1ae667bb1adce3ae2599c7217dd938931649007150e3b2d065d21e, below the rule, byte for byte but for four hold-line project values as <m>, with one final newline added. Calls Bash 12, Read 3, Grep 2, Write 2, SubagentHandback 1, 1 errored, from 2026-11-19T23:51:25Z to 2026-11-19T23:54:42Z by its transcript. The record is its transcript.*

---

Built: b2-piece-1c-save-and-reopen P3b-2 W-7, worker (standard model, claude-sonnet-5-5; no override, no handoff).

**(b2) character:** U+0085 in `par\u{85}cels.parquet`. Linux file names forbid only `/` and NUL. NTFS forbids characters below U+0020 and its reserved ones, so U+0085 is allowed there. macOS APFS has no rule against it. I did not test it on macOS or Linux. The CI run is the evidence there.

**Doc as committed** (byte-copied; it matches the file's lines 613-629):
```
/// **W-7** (ADV-2026-11-19-32 item 6; changed under ADV-2026-11-19-34 item 3). (a) The saved
/// view's space identifier, edited to fill the string ceiling with a control character written as
/// an escape: `opened`, the view `saved-in-another-space`, and a `basis` under 1,024 bytes with no
/// control character. Runs on every platform. (b1) A recorded data path whose last name is 278
/// bytes (90 characters of 3 bytes each and `.parquet`), the file missing: `not_found`, with a
/// `file_name` of at most 262 bytes that ends with the cut's mark. Compiled everywhere but Linux:
/// Linux holds at most 255 bytes in one name, so there the metadata lookup in `data_at` does not
/// answer "not found" for it, the path goes to the engine, and the reply is an `engine.source`
/// refusal, not `not_found`; so on Linux the cut of `file_name` is shown by no test. (b2) On every
/// platform: a recorded data path whose last name is short and holds U+0085 (a control character
/// that Windows, macOS and Linux all accept in a file name: Linux forbids only `/` and NUL, NTFS
/// only characters below U+0020 and its reserved ones, APFS likewise), the file missing:
/// `not_found`, with a `file_name` holding no control character, holding U+FFFD, and not ending
/// with the cut's mark.
///
/// RECORDED MUTATION: W-4's (c), the bounding helper returns its input. Expected failure: (a)'s
/// `basis`, (b1)'s `file_name` (Windows and macOS) and (b2)'s `file_name` (with W-4's three cases).
```
(b1) is under `#[cfg(not(target_os = "linux"))]` with rig `w-7b`. (b2) uses rig `w-7c`. The test name is unchanged.

**Commit:** 63950d3668ea618988b2faa6aebb3da1d4aca9c8 "test: W-7 case (b) becomes (b1) the long name, not on Linux, and (b2) a control character in a short name, on every platform". The body names run 44633818992 at 8759491f and ADV-2026-11-19-33 item 2 (v). Signed off with the trailer, as specified.
**Push** (own call, rc=0): `8759491f..63950d36  cut/b2-piece-1c-p3b-2 -> cut/b2-piece-1c-p3b-2`. The remote head is 63950d36. No fetch.

**Step 3, head 63950d3668ea618988b2faa6aebb3da1d4aca9c8:** `cargo test --locked -p spatial-kernel --test project_reopen_skp`, exit 0, "7 passed; 0 failed". All seven tests were ok:
- a_not_found_reply_names_the_file_and_a_relink_through_the_command_opens_it
- a_refused_relink_through_the_command_leaves_no_catalog_entry_and_open_lock_free
- a_saved_project_reopens_through_the_command_from_its_wire_request
- a_copy_answer_whose_data_is_not_found_writes_nothing_and_its_second_call_keeps_the_file_name_and_the_previous_lineage
- a_question_reply_and_its_answered_second_call_through_the_command
- basis_and_file_name_carry_a_text_read_from_a_file_only_bounded_and_with_no_control_character
- each_reopen_refusal_reaches_the_wire_as_its_code_with_no_path_it_was_not_given

(b2) passed on Windows, so there was no stop under item 3 (e). `cargo fmt --check` in the root workspace gave rc=0. Both runs were on Windows, so (b1) was compiled and ran there.

**Mutation (once), applied at head 63950d36:** in `bounded` in `kernel/src/project/mod.rs` I inserted `return text.to_string();` at the top of the body (plus an `#[allow(unreachable_code)]` on the next line). Same target, one hold, exit 101, "5 passed; 2 failed":
- `each_reopen_refusal_reaches_the_wire_as_its_code_with_no_path_it_was_not_given` failed at project_reopen_skp.rs:376, the assertion `v.len() <= 262`. This is W-4's.
- `basis_and_file_name_carry_a_text_read_from_a_file_only_bounded_and_with_no_control_character` failed at project_reopen_skp.rs:640, case (a): `assert!(!basis.chars().any(char::is_control), ...)`. The panic message showed a `basis` holding `\u{1}` followed by about 4,000 E's.
- The test stopped at (a), so (b1) and (b2) were not seen to fail. Both are cases not seen to fail.
- Only one of W-4's "three" appeared in this target. I did not look for the others.
- Revert: `git checkout kernel/src/project/mod.rs`, then `git diff --quiet` rc=0 and an empty `git status --porcelain`. This was an applied mutation with a recorded failure, not a verify-mutation run.

**Numstat** (`git diff --numstat 8759491f30b346ea9e3be06aebc9ed7b61f276f7 HEAD`, as printed): `52	18	kernel/tests/project_reopen_skp.rs`. Nothing was changed to fit a ceiling.

**Holds:** each had one hold line and one release line, which I give masked.
- Hold 1: `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:44604 also=<m>`, then `MACHINE_RELEASED project=<m> shell=bash.exe:44604 affinity=FF (cores 0-7)`.
- Hold 2: `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:32408 also=<m>`, then `MACHINE_RELEASED project=<m> shell=bash.exe:32408 affinity=FF (cores 0-7)`.
- The hold-2 command exited 1 because the target exited 101 under the mutation. That is not a script code.

**Self-check:**
- Interfaces: the test uses the existing `locations_to_bytes`, `read_project` and `rig` helpers, and `data_at` and `bounded` as read.
- Claims: each claim above points to a log or an output in this transcript.
- No user-facing message changed.
- Required assertions: the head run reached (b1) and (b2). Under the mutation the test stopped at (a).

**Not done and departures:** none from the ruling, and no stop. The Linux/Ubuntu and macOS behaviour is unproven locally, so CI's run is the evidence. The build was one file and no background process is left running.

State: branch is at 63950d36 and pushed, with an empty porcelain. Scratch files are `<S>/1cp3b2w7-*`.
