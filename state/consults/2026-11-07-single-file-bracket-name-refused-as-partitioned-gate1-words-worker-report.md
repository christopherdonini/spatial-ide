*Custodian's filing note (2026-11-07): the words worker's report for gate 1 of PR #294 (8f), applying both gates' documentation findings with no re-gate (Part 1, item 2). Its brief was given by file (sha256 bffbfe9abcf8a7d7d38b3c22acd411a205f94de7f2f176fc2f0936e59b16cc72), with the nine spans as 18 files the custodian's script byte-copied from the two gate reports. Dispatched at 2026-11-07T18:06:32.300Z by its transcript; the run went to 18:45:18Z (claude-sonnet-5-5; unique calls: Bash 37, Write 2, Monitor 1 and the hand-back, 41 in all, equal to the notification's). The report below was extracted by script from the hand-back in that transcript (4036 bytes, sha256 08a336f56021722f64b4d4f90ee18c0e59a2641e12777c1c2ff1fc21b983df65) and is unchanged. The custodian checked at origin's branch head a435bcd9: the three files equal the after-files the custodian computed before dispatch, by sha256; the numstat against 0307fdfb is 20/14, 1/1 and 5/3 and no other file; the range against main is 626 added and 59 deleted. A report, not Authority.*

---

Built: 8f's gate 1 words at a435bcd9e8ab3ecb2c1485807995d3161514b33a

- **Start state:** HEAD and origin/cut/single-file-bracket-name-refused-as-partitioned were both 0307fdfb2106eb2030bcef2f04235e8c5989dbf1. The porcelain was empty. D: had 201.8 GiB free, above the 40 GiB floor.
- **Words files:** all 18 sha256 values matched the brief, checked by command before use.
- **Script:** `<S>/8fw2-apply.mjs`. Each of the 9 old texts occurred exactly once (W1, W2, W3-W3b, W4, W5, W6, W7, W8, W9, all "ok"). Exit 0.
- **Hashes after the edits:** all three match the brief.
  - bf392807… dataset.rs
  - cae0b8c2… single_file_bracket_name.rs
  - b389b2fd… session_identity.rs
- **Numstat:** exactly 20/14 dataset.rs, 1/1 session_identity.rs, 5/3 single_file_bracket_name.rs, and no other file.
- **Line checks:** no CR in any of the three files. Added lines are at most 100 characters. One line measured 101 by awk bytes, because it contains the multibyte `…`; counted in characters it is 99.
- **fmt:** `cargo fmt --all -- --check` exit 0, empty output.
- **Commit:** a435bcd9, subject exactly as the brief gives it.
  - It was made with `git add` on the three paths and `git commit -s -F`.
  - The message file had `@` only on its first trailer line.
  - A first run of the commit step was not repeated.
- **Suite:** `cargo test --workspace --locked` with CARGO_TARGET_DIR=D:/wt-targets/8f, inside a shared hold, exit 0.
  - 116 `test result:` lines.
  - Passed 1024, failed 0, ignored 66.
  - Every `test result:` line reads "0 failed".
  - These pass by name:
    - `dataset::tests::the_reader_path_matches_only_the_literal_file_and_nothing_once_it_is_gone` (T2).
    - `an_existing_single_file_whose_name_holds_a_bracket_or_a_brace_opens_and_streams_only_its_own_rows`. This is the only test in single_file_bracket_name.rs, so it is all of E1.
    - `open_dataset_admits_an_existing_bracket_named_file_and_describe_reports_only_its_rows`. This is the only test in single_file_bracket_name_open.rs, so it is all of K1.
    - `a_path_holding_any_glob_metacharacter_where_no_file_exists_is_refused_by_name`.
- **Check 7:**

| Command | Exit | Last line |
|---|---|---|
| `verify-cites.mjs` | 0 | `verify:cites PASS`, 2734 files, 169 loose references advised |
| `verify-quotes.mjs` (shared hold) | 0 | `verify:quotes PASS`, 138 checked, 107 verified, 30 baselined, 0 errors |
| `verify-test-claims.mjs` | 0 | `verify:test-claims PASS`, 751 claimed tests across 241 files |
| `verify.mjs --offline` | 0 | `verify:plan PASS` |
| `node --test` over the three script suites | 0 | tests 598, pass 598, fail 0 |

- **`git diff --numstat origin/main...HEAD`:** exit 0, 10 files, total 626 added and 59 deleted.
  - 14/9 KNOWN-LIMITATIONS.md
  - 3/3 engine/README.md
  - 225/32 engine/src/dataset.rs
  - 1/1 engine/src/index.rs
  - 1/1 engine/src/rowgroup.rs
  - 5/5 engine/src/stream.rs
  - 7/6 engine/tests/session_identity.rs
  - 230/0 engine/tests/single_file_bracket_name.rs
  - 135/0 kernel/tests/single_file_bracket_name_open.rs
  - 5/2 protocol/skp/SKP-V0.md
- **Hold lines, `also=` elided:**
  - `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:62136` (suite)
  - `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:69576` (verify-quotes)
  - Both were released and exited 0.
- **Push:** `0307fdfb..a435bcd9`, exit 0. origin's branch equals HEAD (a435bcd9e8ab…) and the porcelain is empty.
- **Background shells left:** none. Several of my own bounded wait-loop shells finished by their own timeouts. No process of mine is running.
- **Model:** Sonnet 5.5 (claude-sonnet-5-5), no override.
- **Self-check, the four failure classes:**
  - No cross-module code was touched; the edits are comments only.
  - Every completion claim points to a transcript call above.
  - No user-facing message was changed.
  - The required tests reach their assertions: each is listed as `... ok` inside a `test result: ok` block.
- **Context handoffs:** none.
- **Off-scope:** nothing noticed.
