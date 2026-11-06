Reviewed: PR #290 at 2aca68983bd53f1d65cc993810c130ca9c09f5f9 (base 8963de60), gate 1, reviewer
Verdict: PASS WITH NOTES
Branch: cut/skp-filter-dialect-unsupported-ruling @ 2aca68983bd53f1d65cc993810c130ca9c09f5f9. Brief sha256 14589f59…eadfee82 and packet sha256 017a578c…ee1d57 both matched.

## Findings by class

**Correctness:** none.

**Evidence:** none. I ran the suite, M-1 and M-2 myself, and every result matches the form's predictions (checks 2 and 3).

**Documentation (must be fixed before merge):** none. I checked every clause of the worker's changed comments against the code at the head, and all of them are true (check 5). I have no replacement words to give.

**Notes (not blocking):**
- N-1. The size is 180 lines (113 insertions plus 67 deletions) against 150. This is already disposition 1, class 6. Every changed line is inside the nine Scope files, so the overrun carries nothing outside Scope.
- N-2. `cargo clippy --workspace --locked --tests --no-deps -- -D warnings` exits 101 at the head. The errors are in renderer/src/canonical.rs:240, renderer/src/style.rs:10, engine/src/rowgroup.rs:331 and engine/src/stream.rs:2346 and :2462. None of these is in the nine files. A full-coverage run without `-D` (rc 0) also warns inside three of the nine files: engine/tests/filter_type_admission.rs:1267, engine/tests/admission_property_campaign.rs:218, :270, :543 and :556, and kernel/src/skp.rs:277. Each of those lines is outside the diff's hunks, so the warnings come from code this piece did not change.
- N-3. The non-ASCII bytes in the worker's comment lines are `§` and `—`, as in "SKP-V0 §7.5". The same files already use them at the base: predicate.rs has § 13 times and — 128 times, skp.rs 106 and 219, commands.rs 24 and 41. They follow the files' own style, so this is not a finding.

## For the human (red-line text: the evidence only, no replacement words)

The piece applied the human's bytes exactly as ruled (check 6). The worker cannot close these items, so I do not treat them as a fail of this piece.

- H-1. **ADR-021's note:** "(SKP-V0's note of this date; …)". The ADR-021 note is dated 2026-11-06. The SKP-V0 note it points to, also the human's words, is dated 2026-11-05: SKP-V0.md:523 at the head opens "> Note 2026-11-05 (no literal change)". So no SKP-V0 note carries "this date". There is only one note about the strike, so a reader still finds the right one. Your options are to accept it as it stands or to give new words.
- H-2. **ADR-033's note:** "this ADR's two counts … each reads one lower".
  - The base ADR-033 holds three count words: line 19 "eleven admission-content refusals" and "eleven-code", and line 25 "eleven-code list". These are two distinct counted things, the `FilterError` variants and ADR-021's list, so "two counts" holds under that reading.
  - "One lower" gives ten for both. That is true as history: when ADR-033 was accepted (2026-09-14), `FilterError` had eleven variants including the dialect one. `TypeNotAdmitted` came later, in d036c112 on 2026-09-30.
  - At the head, `FilterError` has eleven variants. ADR-021's own new note says Decision 8's list, read with the code removed, is "eleven". So a reader who takes ADR-033's adjusted count as current gets ten, and that disagrees with the code and with ADR-021's note.
- H-3. **ADR-021's "Decision 8's list … read with that code removed, eleven":**
  - Decision 8's literal list, at line 93, names eleven codes including the struck one, so with it removed the list has ten.
  - "Eleven" is true under the ADR's own usage: its Note of 2026-10-03 already says "Decision 8's twelve codes stand", which counts the 2026-09-30 addition.
  - "Decision 8's exhaustive mapping stands over the eleven" is true: `filter_error_of` has 11 arms and no wildcard.
- H-4. **docs/02:**
  - Its "eleven" is true at the head: there are 11 distinct `filter_*` codes in kernel/src/skp.rs.
  - "(one fewer since the strike …)" is true: there were 12 at the base.
  - The human asked for "the count corrected in place, with … after it". The word did not change, and the parenthesis sits after "refusals". That is Amendment 1's reading, already disposition 8 for the click.
- The SKP-V0 note's clauses C1 to C6 are all true (check 6).

## Checks

**1. The diff against sections 2 to 4, read with Amendment 1**
- Changed files: `git diff --name-only 8963de60...2aca6898` (rc 0) lists exactly the nine files.
- The variant is gone: `git grep -n DialectUnsupported -- '*.rs'` at the head returns rc 1, no hits. The diff removes the variant and its doc, its Display arm, and exactly one arm each from `filter_error_of`, `code_of` and `campaign_code_of`.
- No other change to the type or the mapping: the head has 11 `FilterError` variants, 11 `filter_error_of` arms with 0 wildcard arms, and 11 Display arms. No other variant, field, code or arm changed.
- Tests: the diff's `#[test]` and `assert` lines show one test removed (`filter_dialect_unsupported_maps_to_its_code_and_field`) and one added (T1). No other assertion hunk exists, and `git diff --stat` over protocol/skp/tests is empty.
- SKP-V0.md: numstat 2/1. One row deleted, plus the note line and a blank line.
- Commit times (`git log --format='%H %cI'`, rc 0) are 13:21:34+01, 14:13:21+01, 14:17:52+01 and 14:18:26+01, that is 12:21:34Z to 13:18:26Z. All are after #286's merge: `gh pr view 286` gives mergedAt 2026-11-06T11:08:07Z, merge commit 3d4bd714, and `merge-base --is-ancestor 3d4bd714 8963de60` returns rc 0.
- Size: numstat gives 113 + 67 = 180 lines over 9 files (N-1).
- Bytes in the 113 added lines: 0 CR and 0 tab. All nine files end in a newline, 0 CR bytes in any of them, and the diff contains no "No newline" marker. Non-ASCII outside the human's words: N-3.

**2. The suite at the head** (worktree, `CARGO_TARGET_DIR=D:/wt-targets/sfdu`, shared holds, D: 167G free before the run)
- `timeout 3600 cargo test --workspace --locked`, rc 0:
  - 113 `test result` lines, all `ok`;
  - 1013 passed, 0 failed, 64 ignored;
  - T1 `... ok` by name;
  - the struck test has 0 occurrences.
- `tier_build_emits_zero_invalid_polygons ... ok`, so no LOD or tier test failed and no single re-run was needed.
- `cargo fmt --all -- --check`: rc 0, empty output.
- clippy `-D warnings`: rc 101, files listed in N-2, none among the nine. The full-coverage run without `-D`: rc 0.
- Porcelain afterwards: 0 bytes, HEAD still 2aca6898.

**3. M-1 and M-2 on the export** (`git archive 2aca6898` unpacked with `tar --force-local` into the new folder D:/wt-targets/sfdu-g1r-export; commands.rs sha256 4f256a4a…c66a5 equals the head blob; new cold target D:/wt-targets/sfdu-g1r-target; D: 177G free before the build)
- Unmutated, `timeout 3600 cargo test -p spatial-skp --locked --no-fail-fast`: rc 0. lib 31 passed (T1 ok), conformance 1, fixtures 25, doc 0.
- M-1: commands.rs:424 changed to `.map_err(|_| serde::de::Error::custom("unsupported filter dialect"))`.
  - rc 101. Only T1 failed: lib "30 passed; 1 failed", conformance 1 ok, fixtures 25 ok.
  - It panicked at commands.rs:930:9 with "V1: unsupported filter dialect". Line 930 is V1's message assertion.
  - This matches the prediction and T1's first `RECORDED MUTATION:` line.
- M-2: `Filter::new`'s `Err(format!(…))` replaced by `Err(String::new())`.
  - rc 101. Only T1 failed, with the same counts.
  - It panicked at 908:9 in the mutant, which is `assert!(expected.contains(wrong), "{expected}");`. That is check (iii)'s first assertion, at head line 910 shifted by the mutation's −2 lines.
  - This matches the prediction and the second `RECORDED MUTATION:` line.
- After each mutation the file was restored, and its sha256 4f256a4a…c66a5 equals `git show 2aca6898:…commands.rs | sha256sum`.
- The export, its target and both tmp folders were removed (rm rc 0); `ls` of them now fails with "No such file".

**4. T1's soundness**
- Inputs come from the real producer: `Filter::new(predicate, FILTER_DIALECT_DUCKDB_EXPR_0)` and a parsed `"ds_…".parse()` handle, serialized with `serde_json::to_value`. Only `["filter"]["dialect"]` (V1) and `["intent"]["params"]["filter"]["dialect"]` (R1) are replaced.
- Each row is asserted:
  - V0 and R0 decode `Ok` through `.expect`;
  - V1 and R1 return `Err` whose Display contains `Filter::new`'s Err;
  - check (iii) asserts both the declared dialect and the constant;
  - R1 decodes as a `RecordStepRequest` with `StepIntent::FilterApply`.
- It has no sleep, retry, timeout, `#[ignore]` or `cfg`.
- The boundary is real. The shell's `#[tauri::command]` functions `viewport_query` and `record_step` take `request: ViewportQueryRequest` and `request: RecordStepRequest`, decoded by serde. `Filter`'s Deserialize calls `Filter::new`, at commands.rs:424.
- The unchanged tests are unchanged:
  - `filter_refuses_any_other_dialect_at_construction_and_at_deserialization`: the extracted base and head bodies give `diff` rc 0.
  - protocol/skp/tests, which holds `spec_derived_fixtures_against_wire_types` and the fixtures: no diff.
- Both `RECORDED MUTATION:` lines name the mutation and 6444682c51783c02102fad3f33bf007483e592df, and claim only the failing test and the assertion. My own runs at the head reproduce both claims.

**5. Comments, clause by clause at the head**
- `admit`'s doc:
  - "eleven variants": the enum lists 11.
  - "admit can return each": each variant is constructed in non-test predicate.rs code, all below the `mod tests` at line 2588.
  - The one other possibility is `PredicateAdmitError::ConnectionsExhausted`: the enum has exactly `Filter` and `ConnectionsExhausted`.
- `FilterError`'s doc:
  - "ten table rows plus the `skp/0.8` note's row": §7.5 at the head has 10 rows plus the `skp.filter_type_not_admitted` row in the 0.8 note.
  - The struck code is recorded in the "note of 2026-11-05": true.
  - `filter_error_of` maps each variant by name: true.
  - "Every match on this enum in this module is exhaustive": the only `FilterError` match in predicate.rs is Display, with 11 arms and no wildcard.
- `PredicateAdmitError` doc and `Filter` variant doc: "eleven" is true. The history clause "had twelve variants until the dialect variant was removed" is true per the diff.
- skp.rs:1453 and :1456, "eleven typed codes" and "not one of those eleven": 11 distinct `filter_*` literals in skp.rs (`sort -u`).
- skp.rs:1779 (`predicate_admit_error_of`): it has two arms that delegate to `filter_error_of` and `error_of`, so it mints no new code. ADR-021 item 8, at line 93, does state "exhaustive, no wildcard arm".
- `filter_error_of`'s doc: "a twelfth variant fails this build" holds, because the match has no wildcard. "Field for field" holds: the fields match the §7.5 table and the 0.8 row.
- Test-block comment, "eleven variants gets its own test": 11 `filter_*_maps_to_its_code*` tests, each asserting its code and every field.
- skp.rs:2954, "eleven-code route": true.
- `FILTER_DIALECT_DUCKDB_EXPR_0` doc:
  - the only value `Filter::new` accepts: line 400;
  - refused at construction and through Deserialize: line 424;
  - "before any host code runs": in the shipped shell, Tauri decodes the arguments before the command body runs;
  - no `skp.filter_*` code for a wrong dialect: no constructor and no arm remain;
  - no "later phase" claim.
- The three stale `state/NEXT-CUT.md` "design essential 5" cites are gone: `git grep -c` at the base found 1 in predicate.rs and 2 in skp.rs, and the head has 0. NEXT-CUT.md at the base has only item 5 "Footer work is bounded and accounted".
- Every clause above is true, so I have no words to give.

**6. The human's words** (my own script, sfdu-g1r-words.mjs; rc 0; every line "TRUE"; the directive blobs at the head equal main's)
- The line 9 span (sha256 da4238b9…4176c) and the line 10 span (sha256 28006d01…1900) each occur once, as the last line of ADR-021 and ADR-033 respectively.
- Each base ADR is a prefix of its head. The tail is exactly a blank line, the heading, a blank line, the italic line, a blank line and the span.
- Line 23 of the 2026-11-05 directive has exactly 2 double quotes. The line `> ` plus its span occurs once at the head and 0 times at the base, with a blank line on each side and `### 7.6` two lines below.
- docs/02 has one changed line, :84, equal to the base line with the parenthesis inserted once, after "refusals".
- C1 to C6 against the head:
  - C1: the §7.5 row, the variant and the arm are all gone.
  - C2: at the base, the only constructor was the kernel test, at skp.rs:2806.
  - C3: T1 V1 and R1, and the unchanged test.
  - C4: decode comes before the handler.
  - C5: `skp/0.12` at mod.rs:115 and types.ts:15.
  - C6: no fixture or golden is in the diff.
- ADR-021, ADR-033 and docs/02: see H-1 to H-4.

**7. Verify scripts and CI** (worktree at the head)
- `verify.mjs --offline`: rc 0, PASS.
- `verify-cites.mjs`: rc 0, PASS.
- `verify-quotes.mjs`: rc 0, PASS, 138 checked, 0 errors.
- `verify-test-claims.mjs`: rc 0, PASS, 740 claims.
- `node --test` over the scripts suite: rc 0, 598 pass, 0 fail.
- `gh pr checks 290` at 14:56:54Z returned rc 8: every check passed except windows-latest on run 42235551339, which was still pending.
- `gh run view` gives headSha 2aca68983bd53f1d65cc993810c130ca9c09f5f9 for all 12 runs in the packet. All are completed/success except 42235551339. Re-read at 15:21:00Z, 42235551339 is completed/success.

## The packet's gaps
- It does not say whether `clippy -D warnings` is a gate condition, or whether it is already red at main. I needed this to judge N-2.
- It does not give the date `TypeNotAdmitted` entered `FilterError`, which I needed to read ADR-033's counts in H-2. I took it from git.
- It does not mention that SKP-V0's note is dated 2026-11-05 while the ADR notes say "this date" (2026-11-06), which bears on H-1.
- Everything else I needed was in it.

## Hold lines (SpatialIDE only, `also=` elided)
Six shared holds, in this order: the workspace test, clippy `-D`, clippy without `-D`, the unmutated export run, M-1 and M-2. Each logged `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF …` and then `MACHINE_RELEASED project=SpatialIDE …`. None returned an exit code from 96 to 99.

## Background shells
I started three background tasks: the workspace test, verify-quotes and one wait loop. All three completed, with notifications showing exit 0, so none of mine is still running and I killed nothing. The one `sleep` process that `ps` lists started at 14:31:51Z, before my first command, so it is not mine and I left it alone. The worktree's porcelain is empty. The export, its target and both tmp folders are gone. My scratch files are named `sfdu-g1r-*`, in my scratch folder.
