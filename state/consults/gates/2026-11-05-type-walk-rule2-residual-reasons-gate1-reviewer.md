Reviewed: PR #282 at ae4d94d4e463a4b213f3ecaeb98bc09ba3d92ec2 (base 4009a97e), gate 1, reviewer
Verdict: PASS WITH NOTES
Branch: cut/type-walk-rule2-residual-reasons @ ae4d94d4e463a4b213f3ecaeb98bc09ba3d92ec2. The brief's sha256 (bf314ebf…a0a483, 9246 bytes) and the packet's sha256 (16c8c10e…ad5d89, 14629 bytes) both matched when checked by command.

## Findings

### Correctness: none.

### Evidence: none.
I ran the suite and M-1 myself, at the head and on an export of the head, and both came out as the form predicts (checks 2 and 3).

### Documentation: must be fixed before the merge (not the human's wording; the worker applies these words with no re-gate, and the PR body lists them)

**D-1. Two comments point to a path the form never had.** Both say `engine/TYPE-WALK-RULE2-RESIDUAL-REASONS-PREREGISTRATION.md`:
- engine/src/predicate.rs:1433 (W-2)
- engine/tests/filter_type_admission.rs:557 (T1's doc)

Evidence:
- `git log --all -- engine/TYPE-WALK-RULE2-RESIDUAL-REASONS-PREREGISTRATION.md` returns 0 commits.
- `governance/MOVED.tsv` has no row for that path. Its two neighbours do have rows (lines 44 and 57).
- The form was added at `governance/forms/engine/…` in 57d1eb00.
- verify-cites does not catch this, because it only resolves `path:line` cites. The packet's section 5 finding is confirmed.

Closure: apply the words below.

**D-2. W-2's first clause, "The `Display` sentence, never sent on the wire.", is not true of what a client can observe.**
- `sentence()` has one caller, `FilterError`'s Display (predicate.rs:386).
- The kernel sends that Display unedited as the SKP `message` (kernel/src/skp.rs:2244, `let message = e.to_string();`). Its product caller is skp.rs:1739.
- The form's own Change line also says the Display is the wire `message`.
- It is defensible in O-4's vocabulary ("a wording change never changes the wire"), where `message` sits outside the wire contract. That is why I file it as Documentation and not as a false limit.
- The clause was carried over from the base comment.

Closure: apply the words below.

**Replacement words.** Lines 1–10 replace engine/src/predicate.rs:1430-1437 at ae4d94d4. Lines 11–15 replace engine/tests/filter_type_admission.rs:557-561 at ae4d94d4. The text is byte-copied from my scratch file `twr2-g1r-words.txt` (sha256 5b42494f99703e6df84c91751d7610b58b21645820c912ccef4cd2276f1e2028). It was wrapped by script; the widest line is 99 columns and the text is ASCII.
```
    /// The `Display` sentence. It reaches the wire only inside `message`, as part of
    /// `FilterError`'s `Display`, never as a field: `reason`'s wire value is `wire_value`'s (O-4).
    /// The first four are copied byte for byte from
    /// `state/directives/B-1-RULINGS-AND-TYPED-TEXTS-2026-09-30.md` T-C by the script that wrote
    /// this file. The fifth, `ConversionRounds`'s, replaces T-C's under
    /// `governance/forms/engine/TYPE-WALK-RULE2-RESIDUAL-REASONS-PREREGISTRATION.md` and is a P6
    /// placeholder: T-C's named a value read from the file, which is false where the integer or
    /// decimal side is a constant NULL (`f32 > NULL + 100000`). This one states the type pair
    /// alone. It is still false of a double literal beside an INTEGER literal in `+`, `-` or `*`,
    /// which the walk refuses although no INTEGER value rounds in DOUBLE.
/// T1 (`governance/forms/engine/TYPE-WALK-RULE2-RESIDUAL-REASONS-PREREGISTRATION.md`,
/// Tests+mutation and note 1): each of the eleven predicates is refused `TypeNotAdmitted` with its
/// construct, operand types and the reason `ConversionRounds`, and its `Display` is the format of
/// `FilterError`'s `TypeNotAdmitted` arm carrying the type-level sentence (a P6 placeholder)
/// instead of one naming a value read from the file.
```
Each clause checked against the code at the head:
- **"reaches the wire only inside `message`, as part of `FilterError`'s `Display`"**: holds. `.sentence()` has one caller (predicate.rs:386, by grep), and Display becomes `message` at skp.rs:2244. The three fields are construct, operand_types and reason (skp.rs:2331-2333); none carries the sentence.
- **"never as a field: `reason`'s wire value is `wire_value`'s (O-4)"**: holds (skp.rs:2333).
- **"first four copied byte for byte"**: holds. A script compared the four arm strings with B-1-RULINGS-AND-TYPED-TEXTS-2026-09-30.md lines 53-56 and found them equal.
- **The form's path**: holds. It exists at the head and was added in 57d1eb00.
- **"T-C's named a value read from the file"**: holds (B-1 line 57).
- **"false where … constant NULL (`f32 > NULL + 100000`)"**: holds. T1's row 1 is refused with INTEGER expression, and that operand is NULL in every row.
- **"states the type pair alone"**: holds. W-1 names types only, never a row value.
- **"still false of a double literal beside an INTEGER literal in `+`, `-` or `*`, which the walk refuses"**: holds, and I observed it at ae4d94d4 (check 5). `admitted_arithmetic_result` does not depend on the operator. INTEGER is 32 bits, so every value is exact in DOUBLE.
- **T1's doc**: only the path changes; the other clauses hold (check 4).

The size after the words is 92 lines against a budget of 130 (+2 in predicate.rs, +1 in the test).

### For the human, with no replacement words: W-1 (the human's wording, a P6 placeholder)
I checked W-1 clause by clause against the code at the head. It holds for every residual shape I could list, with the two exceptions the record already knows:
- **F-A.** I observed it at ae4d94d4 with a throwaway probe on the export: `1e3 + 5 > 0` gives `TypeNotAdmitted { construct: "+", operand_types: ["DOUBLE literal", "INTEGER literal"], reason: ConversionRounds }`, and its Display carries W-1. Ordinary use reaches it. 8c is placed to fix it.
- **F-B.** `'1' + NULL > 0`, from Amendment 1. I did not re-run it. F-B (8d) is placed for it.

The same probe found no new false shape:
- `'1' + '1' > 0`, `zone + zone > 0`, `zone + '1' > 0`, `flag + flag > 0` and `'1' * NULL > 0` are refused `RejectedByBinder`.
- `TRUE + TRUE > 0` and `TRUE + NULL > 0` are refused `ConstructNotAdmitted` (CAST).
- `0.5 + 1e3 > 0` (DECIMAL(2,1) literal beside a DOUBLE literal) carries W-1. That is true at the type level, though it is an F-A-family refusal.

### Notes (not acceptance conditions)
- N-1: The enum doc at predicate.rs:1397-1399 (outside the diff and outside the Scope) carries the same "never on the wire" wording as D-2. It is a sibling for a later piece.
- N-2: The `RECORDED MUTATION` line describes M-1's content without using the label "M-1". It names the 40-hex commit, 853b5da6. The diff from 853b5da6 to ae4d94d4 changes comment lines only (6 `///` insertions), so that commit is equivalent to the head for M-1. What it claims matches my own observation of M-1.
- N-3: My probe wrote its fixture to the user temp folder (`twr2-g1r-probe`), outside the write locations the brief allows. I removed it (`test -e` rc 1). The suite and M-1 runs also write their own fixture to temp, as they always do.

## Checks

**1. The diff** (in C:/dev/wt/twr2)
- `git diff 4009a97e...ae4d94d4` rc 0. Its 118 lines match the packet's section 3.
- Only the `ConversionRounds` arm (two lines replace one) and `sentence`'s doc (8 lines replace 3) change in predicate.rs. The test file only gains T1 (75 insertions).
- W-1 against the form, by script (Rust's continuation rule applied: the trailing `\` is dropped and the next line's leading whitespace skipped, so the space before the `\` gives one space):
  - the arm's compiled string (lines 1447-1448) equals form line 56 with `> ` cut: `W1 equal: true`, and the string contains no backslash;
  - T1's `sentence` (line 572) equals the same line: true.
- W-2: predicate.rs:1430-1437, minus their 4-space indent, equal form lines 73-80 with `> ` cut: `W2 equal: true`.
- No new `pub`: `grep -c "^+.*\bpub\b"` on the diff gives 0. The pattern self-tests at 15 on predicate.rs.
- Files: two, both in the Scope.
- Size: `git diff --numstat` rc 0 gives `10 4 engine/src/predicate.rs` and `75 0 engine/tests/filter_type_admission.rs`, 89 against the budget of 130.
- Bytes, by script, rc 0: 85 added lines, CR 0, TAB 0, non-ASCII 0, no "No newline" marker; both files end in LF and contain no CR.
- Repository searches:
  - T-C's fifth sentence in code (`git grep "can round a value"` over engine, kernel, protocol, renderer, frontends): rc 1, none. In the whole tree it appears only in three state/ records (B-1 line 57, the 2026-09-29 draft, the 2026-11-04 worker report).
  - W-1 in code: only predicate.rs:1447-1448 and T1 at filter_type_admission.rs:572-573.

**2. The suite at the head** (D:/wt-targets/twr2, shared holds)
- `timeout 1800 cargo test -p spatial-engine --locked`: rc 0. 51 `test result:` lines, all `ok`; 0 FAILED or panicked; 476 passed, 0 failed, 19 ignored. T1 `every_conversion_rounds_refusal_states_a_conversion_refused_by_type ... ok`, and the filter_type_admission binary shows 4 passed.
- `cargo fmt --all -- --check`: rc 0, empty output.
- `cargo clippy -p spatial-engine --locked --tests --no-deps`: rc 0. No warning at a changed line. The one in filter_type_admission.rs is at line 1030 (`redundant pattern matching`), which blame puts at d036c112. The rest are in other files.

**3. M-1, observed by me**
- Export: `git archive ae4d94d4` (rc 0), unpacked with `tar --force-local` (rc 0) into the new D:/wt-targets/twr2-g1r-export. Its predicate.rs sha256 a0f69574…6fef equals the head's.
- Cold build with CARGO_TARGET_DIR=D:/wt-targets/twr2-g1r-target: `cargo test … --test filter_type_admission --no-run`, rc 0, 11m 12s.
- Mutation, by script: the arm (lines 1447-1448) replaced with base 4009a97e's line 1442 text, `"a conversion that can round a value read from the file before it is compared"`. The diff against the backup shows exactly that change.
- `timeout 1800 cargo test -p spatial-engine --locked --test filter_type_admission`: rc 101, after `Compiling spatial-engine` and a 12.41s finish.
  - Result: `3 passed; 1 failed`. T1 FAILED, panicking at filter_type_admission.rs:619 (the Display `assert_eq!`) with `"f32 > NULL + 100000": Display`.
  - Left: `…: a conversion that can round a value read from the file before it is compared (docs/01 principle 8)`. Right: the W-1 Display.
  - The other three tests were ok.
- Reverted from the backup. The sha256 a0f6957452700f005e27917022013dc91c136c8af89ed89c62c6865fcc4b6fef equals both the worktree's copy and `git show ae4d94d4:engine/src/predicate.rs`.
- The probe file was removed before cleanup. Both D:/wt-targets/twr2-g1r-export and D:/wt-targets/twr2-g1r-target were removed; `ls` reports both missing.

**4. The tests' soundness (item 7)**
- T1 calls the real `AdmittedPredicate::admit` on the real FX-1 `Dataset::open`. It matches the real `PredicateAdmitError::Filter(FilterError::TypeNotAdmitted {..})`, and any other outcome panics.
- Its eleven rows match the form's note 1 table and the Tests+mutation list row for row: construct, both operand types, and `ConversionRounds`.
- The expected Display is written independently. It matches the format at predicate.rs:384 (`` refused: `{construct}` over {}: {} (docs/01 principle 8) ``, with types joined by " and ").
- No sleep, no retry. The shared state is only the read-only OnceLock fixture, which other tests use too, and T1 checks its sha256 at the end.
- The `RECORDED MUTATION` line claims only what ran (see N-2).

**5. The comments**: see D-1, D-2 and the clause check above. Running the probe settled W-2's last clause, which the form's note 3 had held "by reading, not run". It is true.

**6. Verify scripts and CI** (at the head, in the worktree)
- `verify.mjs --offline`: rc 0, PASS.
- `verify-cites.mjs`: rc 0, PASS (2635 files, 131 loose advisories, none on this piece's files).
- `verify-quotes.mjs`: rc 0, PASS (135 checked, 0 errors).
- `verify-test-claims.mjs`: rc 0, PASS (729 claims).
- `gh pr checks 282`: the first read was rc 8, with Rust workspace windows-latest (run 42075524578) pending. The second read was rc 0, all 18 pass. 42075524578 has since completed with success.
- `gh run view` head sha: every run is ae4d94d4e463a4b213f3ecaeb98bc09ba3d92ec2. On push: 42069011049 Rust workspace, 42069011040 fmt, 42069011245 governance, 42069011234 shell, 42069011204 notices. On pull_request: 42075524578, 42075524274, 42075524215, 42075524451 DCO, 42075524676, 42075524219 exposure, 42075524338. All rc 0, all success. The PR is a draft and its head is ae4d94d4.

## The packet's gaps
- The base's location of T-C's arm for M-1 (4009a97e:engine/src/predicate.rs:1441-1443). The packet gave only the fc78efa6 pins and the head's lines; I read it from git.
- That `sentence()` feeds the SKP `message` through kernel/src/skp.rs:2244 and :1739. That was needed to judge W-2's "never sent on the wire".
- Whether F-A's shape had been run at any commit. The packet says "by reading", so I probed it.
- FX-1's helpers (`fixture()`, `dataset()`, the spec and seed), needed for the probe. I read them from the test file.
- The run time of the filter_type_admission binary (about 3 to 4 minutes) and of a cold export build (11 minutes), for sizing holds.

## Hold lines (my project's only; `also=` elided)
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:13140` / `MACHINE_RELEASED … bash.exe:13140` (cold build)
- `… shell=bash.exe:41636` hold and release (suite at the head)
- `… shell=bash.exe:36288` hold and release (M-1)
- `… shell=bash.exe:6808` hold and release (probe)
- `… shell=bash.exe:54976` hold and release (fmt)
- `… shell=bash.exe:39920` hold and release (clippy)

No hold was refused and no 96-99 code came back.

## Background shells
Four were started: b6t03iuc3 (cold build), bdagd1xy6 (verify-quotes), br0n131qq (suite) and bbwh4ea44 (M-1). All four exited and reported. `ps` shows 0 cargo, rustc or test processes left, so nothing needed killing.

## End state
- Worktree C:/dev/wt/twr2: HEAD ae4d94d4e463a4b213f3ecaeb98bc09ba3d92ec2, porcelain empty (0 bytes).
- D:/wt-targets/twr2-g1r-export and D:/wt-targets/twr2-g1r-target: gone.
- I wrote only `twr2-g1r-*` files in my scratch folder, plus the temp probe directory, which is removed (N-3). No commit, push or PR action.

Scratch evidence: <the session scratch folder>/ — twr2-g1r-suite.log, twr2-g1r-m1.log, twr2-g1r-probe.log, twr2-g1r-wcheck.out, twr2-g1r-words.txt, twr2-g1r-clippy.log
