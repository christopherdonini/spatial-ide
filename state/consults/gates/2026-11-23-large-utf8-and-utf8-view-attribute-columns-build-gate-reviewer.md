Reviewed: branch cut/large-utf8-and-utf8-view-attribute-columns at b035ccb3727e2468ab289ecf539c83d928fe60a9, PR 364 (draft), in the branch worktree C:/dev/wt/lutf8, where it made its mutations by Bash; the records at main a2d58940d283be8eb050730216f0e90b6084a0fd in C:/dev/wt/read-1123ag (the custodian's filing note, 2026-11-24: the reviewer's build gate, node:large-utf8-and-utf8-view-attribute-columns@build-gate-reviewer-1, dispatched at 2026-11-23T22:07:55Z; its run: Bash 85, Read 4, SubagentHandback 1, by unique call ids, 2 calls errored; model claude-opus-5-5, from 2026-11-23T22:07:55Z to 2026-11-23T23:20:45Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 15730 bytes, sha256 591bb2bf897e4e5aa9308315283a06dac61cbe09eb59991b21d14406b0b47c72, byte for byte, nothing masked, with one final newline added. PASS WITH NOTES: no Correctness or Evidence finding; P0 observed again (T1, T2 and T4 red, T3 green, as predicted); M1 to M4 observed at b035ccb3, each failing its set, with the probes M1b, P1 and P2; DOC-1 to DOC-4 Documentation, the worker words, to fix in PR 364; DOC-5 (a) to (e) for the closing amendment (the file overrun, 7 files against 5, a class 8; the record of ADV-2026-11-23-28 for the ADR-021 note; I1; T1 at P0; the form T3 sentence); the ADR-023 and ADR-021 notes equal to the ruling fences byte for byte; the section 7 count 171 lines; the engine and kernel suites green; the PR checks 14 of 14 pass by its report.)

---

Verdict: PASS WITH NOTES — cut/large-utf8-and-utf8-view-attribute-columns @ b035ccb3727e2468ab289ecf539c83d928fe60a9
Reviewed: C:/dev/wt/lutf8 @ b035ccb3727e2468ab289ecf539c83d928fe60a9
REPORT PATH: state/consults/gates/2026-11-23-large-utf8-and-utf8-view-attribute-columns-build-gate-reviewer.md

## Correctness
None. All four predictions held. P0, all four mutations and two extra probes went red or green exactly as predicted. The engine and kernel suites passed, and nothing outside Scope changed.

## Evidence
None.

## Documentation (must fix before the merge; none of them fails the gate, per ADV-2026-11-21-20)

**DOC-1. T3's doc comment says more than T3 checks** (`engine/tests/large_utf8_and_utf8_view_admission.rs`, the T3 doc; worker's words).
- "red if a DuckDB bump or a configuration change makes ordinary text reach either refused type" is broader than what the test pins. T3 exports only a VARCHAR literal and reads no file.
- Amendment 2 E2's New text bounds T3 this way, and ADV-2026-11-23-28 item 1 cut ADR-023's matching sentence for the same reason.
- Probe P2 shows the gap: with `SET produce_arrow_string_view=true` added to `CONFIGURE_SQL`, T3 stays green, because the export stays `Utf8`.
- Old:
```text
/// T3. The premise pin: on a connection configured as the product configures it, with no `SET`
/// added, VARCHAR is exported as plain `Utf8`. Green before and after the change; red if a DuckDB
/// bump or a configuration change makes ordinary text reach either refused type.
```
- New:
```text
/// T3. The premise pin: on a connection configured as the product configures it, with no `SET`
/// added, VARCHAR is exported as plain `Utf8`. Green before and after the change; red if that
/// export stops being `Utf8`, as `SET arrow_large_buffer_size=true` added to `CONFIGURE_SQL` makes
/// it. It reads no file, so a reader change that types a file's text column as other than VARCHAR
/// is outside it.
```
- Clause check:
  - "configured as the product configures it": `fixture::configured_connection` calls `pool::configure_connection`.
  - "no `SET`" / VARCHAR as `Utf8`: the test runs `SELECT 'a'::VARCHAR` and asserts `assert_eq!(…, &DataType::Utf8)`.
  - "Green before and after": green at P0 and at head.
  - "red … as `SET arrow_large_buffer_size=true` … makes it": M3 fails with `left: LargeUtf8` at :88.
  - "reads no file": there is no file I/O in the test.

**DOC-2. T1's doc says "with one `SET` added (H-SET)"** (same file; worker's words). The Utf8View case adds two `SET`s.
- Old:
```text
/// T1. Each of the two types is made by the bundled DuckDB's own Arrow export on a connection the
/// product configures, with one `SET` added (H-SET); the engine then refuses it at projection
/// admission, which is what describe's `projectable` is computed from.
```
- New:
```text
/// T1. Each of the two types is made by the bundled DuckDB's own Arrow export on a connection the
/// product configures, with H-SET's setting added (and, for `Utf8View`, `arrow_output_version`
/// 1.4 beside it, as the form's I1 allows); the engine then refuses it at projection admission,
/// which is what describe's `projectable` is computed from.
```
- Clause check:
  - The `SET` strings are at :44-47.
  - I1 is as Amendment 2 D2 replaced it.
  - Both `admit_projection_column` and `admit_projection` are asserted `Err(TypeNotAdmitted)`.
  - kernel/src/skp.rs:2064 computes `projectable` from `admit_projection_column`.

**DOC-3. "recorded under I1" points at no record in the tree** (T1's inline comment; worker's words).
- The form at main a2d58940 ends at Amendment 4.
- The worker report that holds the fact is not on main yet.
- Old:
```text
    // `produce_arrow_string_view` alone leaves VARCHAR as `Utf8` on the bundled DuckDB (tried at
    // this piece's fix commit, recorded under I1); with `arrow_output_version` 1.4 it exports `Utf8View`.
```
- New:
```text
    // `produce_arrow_string_view` alone leaves VARCHAR as `Utf8` on the bundled DuckDB (tried at
    // `cea0ef8c`; the form's I1 allows the second setting); with `arrow_output_version` 1.4 it
    // exports `Utf8View`.
```
- Clause check:
  - "alone leaves … `Utf8`": probe P1 gives `left: Utf8`, `right: Utf8View` at :55.
  - "tried at `cea0ef8c`": `git diff e106af50 cea0ef8c` shows the `SET` string changed in the fix commit.
  - "with 1.4 it exports `Utf8View`": T1's precondition is green at head.

**DOC-4. The recorded-mutation line numbers for T2 and T4 are the mutated file's, not "at that commit".**
- At cea0ef8c the assertions are at attributes.rs:648 and predicate.rs:2732.
- 650 and 2735 are where the panic was reported, which is always in the mutated file being compiled.
- T1's and T3's records are exact, because their mutations do not touch the test file.
- `engine/src/attributes.rs`, Old:
```text
    // RECORDED MUTATION (observed at `cea0ef8c`, line numbers at that commit): in `is_admitted_scalar`,
```
- New:
```text
    // RECORDED MUTATION (observed at `cea0ef8c`, line number in the mutated file): in `is_admitted_scalar`,
```
- `engine/src/predicate.rs`, Old:
```text
    // RECORDED MUTATION (observed at `cea0ef8c`, line numbers at that commit): in
```
- New:
```text
    // RECORDED MUTATION (observed at `cea0ef8c`, line number in the mutated file): in
```
- Every Old text above occurs exactly once in its file at head, checked with `grep -c -F` on `git show b035ccb3:<file>`.

**DOC-5. Records owed in the form's closing amendment** (record findings, not code).
- (a) **§7 file overrun.** By §2's command the piece touches 7 files against §7's 5. Record it as class 8 at the closing (ADV-2026-11-23-28 item 4), and leave §7 unedited. It is unedited at head. The line count is 171, within 220.
- (b) **ADR-021's Scope addition.** It is class 9 by ADV-2026-11-23-28 item 2.
  - Amendment 2 item 4 says "the amendment that records the ruling says so before any change to that file".
  - No form amendment records ADV-2026-11-23-28; the form at a2d58940 ends at Amendment 4.
  - The note landed at b035ccb3, committed 2026-11-23T21:46:57Z.
  - The closing amendment must record the ruling and disclose that order. The note is not code, so the Round 25 "code landed before" clause does not fire. §8 item 7 is not tripped, because Amendment 2 item 4 extends it to ADR-021's note once OPEN-6 is ruled yes, and it was.
- (c) **I1.** Record the Utf8View half's `SET arrow_output_version='1.4'` under I1. D2 asks for it tried and recorded, and today it appears only in the test comment, the PR body and the unfiled worker report.
- (d) **T1's P0.** T1's `SET` string changed in the fix commit, after its P0 at e106af50.
  - The head's T1 was re-observed red at base here, at the LargeUtf8 refusal assertion.
  - Its loop never reaches the Utf8View case at base; probe M1b shows that half is live.
- (e) **The form's T3 sentence** (Amendment 2 E2's New text, the architect's words) says "a DuckDB bump that changes either setting's default, or either `SET` added to `CONFIGURE_SQL`". That is not exact for the string-view setting: alone it does not change the export (P1, P2). Record a correction; do not edit the form.

## The checks
1. **Diff against §2, §7 and §8 as amended.** It matches §2 items 1 to 5, E1 and E2.
   - The ADR-023 note is in Scope by Amendment 2; ADR-021's by ADV-2026-11-23-28 item 2 on Amendment 2 item 4's terms.
   - §8: no file outside Scope; no refusal text changed (the final-arm text is unchanged); no cast; `CONFIGURE_SQL` unchanged (pool.rs is not in the diff); T1's precondition is kept; all four tests carry a `RECORDED MUTATION`; no ADR line edited.
   - I5: the form and both ADRs are byte-identical at the base and at main a2d58940.
   - Seams: kernel/src/skp.rs:2064 uses `admit_projection_column`, and :1899 uses `admit_projection`. K-5 `describe_projectable_agrees_with_viewport_query_admission_for_every_column` passes.
   - Caller grep: nothing new is `pub`; the production edits remove match arms and change comments only.
2. **P0** (C1's attributes.rs, predicate.rs and stream.rs, with the head's test file). Matches the prediction.
   - T1 fails at large_utf8_and_utf8_view_admission.rs:60:9, "LargeUtf8 must be refused by admit_projection_column", after its precondition held.
   - T2 fails at attributes.rs:649:13, "Dictionary(Int32, LargeUtf8) must be refused".
   - T4 fails at predicate.rs:2737:13, "LargeUtf8 must not be filterable".
   - T3 is ok; every other lib test passes (221).
   - Restored; porcelain empty; sha256 equal to head.
3. **Mutations**, each one anchored `sed` (diff 1/1 or 1/0), then restored with porcelain empty and sha256 equal to head. Each was run over the lib binary and the admission binary, except M3, run in its own binary.
   - M1 (restore `| D::LargeUtf8 | D::Utf8View` in `admit_attribute_type`): T1 fails at :60:9 and T4 at predicate.rs:2736:13, both on LargeUtf8. Set {T1, T4}, as D3 predicts; 222 others pass.
   - M2 (restore the two in `is_admitted_scalar`): T2 fails at attributes.rs:651:13. Set {T2}; T1 and T3 ok.
   - M3 (`; SET arrow_large_buffer_size=true` appended to `CONFIGURE_SQL`, own binary): T3 fails at :88:5 with `left: LargeUtf8`, `right: Utf8`. T1 ok. Set {T3}.
   - M4 (early `Ok` for `LargeUtf8 | Utf8View` in `filterable_column_type`): T4 fails at predicate.rs:2737:13. Set {T4}.
   - No mutation turned red a test outside its set, and none failed to turn red its own test.
   - Extra probes, not owed by the form:
     - M1b (only `| D::Utf8View` restored): T1 fails at :60 with "Utf8View must be refused…" and T4 with "Utf8View must not be filterable".
     - P1 (`produce_arrow_string_view` alone in T1): the precondition fails with `left: Utf8`.
     - P2 (`; SET produce_arrow_string_view=true` in `CONFIGURE_SQL`): T1 and T3 both ok.
4. **I1.** The test sets `SET produce_arrow_string_view=true; SET arrow_output_version='1.4'` for the Utf8View case (:44-47). The build report says the string-view setting alone was tried and left `Utf8`, and P1 confirms it. That is D2's allowed variant, so I1 does not fire. It is recorded in the test comment, the PR body and the worker report, not yet on the form (DOC-3, DOC-5 c).
5. **T3 as a pin of the premise.** It asserts that the configured connection exports VARCHAR as `Utf8`. It is green at base and at head, and not the regression; ADV-2026-11-23-21 item 4 keeps it for exactly that. The PR body says "T3 is a pin of the premise". Its doc overclaims (DOC-1).
6. **The ADR notes** (script `<S>/lur-adr-notes.mjs`, output `<S>/lur-adr-notes.txt`, rc 0). The ruling's fences are at its lines 16-26 and 30-38.

   | | ADR-023 | ADR-021 |
   |---|---|---|
   | Base ends with LF | yes | yes |
   | Base is a byte prefix of head | yes | yes |
   | Appended bytes equal LF + fence | yes | yes |
   | Fence | fence 1: 2791 B, 9 lines | fence 2: 1264 B, 7 lines |
   | Fence sha256 | fde37ca2a01e794aba8c09d78d49abc229a60bb29788bdfa2cfe23c675b53b73 | 9ea4ba0023377d3f25d71556c06e42defd847c4827f9c8df68ee46e8b04e1774 |
   | Appended sha256 | d689d8773087613958cca8c5c9f34f593f65dd761ada2cf42cfa698a5a790281 | e9a1a0c8d72e6fe771e3669935166815f631317290150bb279139760a8a63c9e |
   | numstat, base...head | 10 / 0 | 8 / 0 |

   Every clause of both notes is true against the code at head; nothing goes to the advisor.
7. **Clause checks** of every other new or changed comment and doc line:
   - The README type sentence, the `admit_attribute_type` doc (D5's words), the stream.rs comment ("admits only types above": the admitted set is a subset of the estimator's arms), the T2 and T4 docs, the test-file module doc, `exported_zone_field` (dataset.rs:1127 drains the same way) and the README "Last verified at" clause are all true at head. The form is present at cea0ef8c.
   - The untrue ones are DOC-1 to DOC-4.
8. **Suites at head:**
   - `cargo test --locked -p spatial-engine`: rc 0; 56 binaries; 507 passed, 0 failed, 20 ignored.
   - `cargo test --locked -p spatial-kernel`: rc 0; 62 binaries; 520 passed, 0 failed, 47 ignored.
   - `cargo fmt --all -- --check`: rc 0, no output.
   - `cargo clippy --locked -p spatial-engine --tests`: rc 0. The one warning is `enum_variant_names` at engine/src/app_dirs.rs:39, a file outside the diff.
   - `node --test` over the three globs: rc 0; 623 pass, 0 fail.
   - Everything finished by 23:19Z on 2026-11-23, before the 04:30Z limit.
9. **§7** (§2's command with the seven files, range 69066c72...b035ccb3; output `<S>/lur-count.txt`, rc 0): 155 insertions plus 16 deletions is 171 lines against 220, within. 7 files against 5 is an overrun, to be recorded as class 8 (DOC-5 a). The merge-base is 69066c72.
10. **CI**, read at 2026-11-23T23:19:14Z (`<S>/lur-ci-2.txt`, rc 0): all 14 checks pass. The macOS L1 check was pending at the 22:10:22Z read (`<S>/lur-ci.txt`) and had passed by this one, in 10m14s.

## Runs relied on
- P0, lib then binary: `cargo test --locked -p spatial-engine --lib --test large_utf8_and_utf8_view_admission` rc 101 (lib failed, binary not reached; `<S>/lur-p0.txt`); then `--test large_utf8_and_utf8_view_admission` rc 101 (`<S>/lur-p0-bin.txt`).
- M1, M2, M4, M1b: `cargo test --locked --no-fail-fast -p spatial-engine --lib --test large_utf8_and_utf8_view_admission`, each rc 101 (`<S>/lur-m1.txt`, `<S>/lur-m2.txt`, `<S>/lur-m4.txt`, `<S>/lur-m1b.txt`).
- M3 and P1: `cargo test --locked --no-fail-fast -p spatial-engine --test large_utf8_and_utf8_view_admission`, each rc 101 (`<S>/lur-m3.txt`, `<S>/lur-p1.txt`).
- P2: the same command, rc 0 (`<S>/lur-p2.txt`).
- Engine suite rc 0 (`<S>/lur-suite-engine.txt`); kernel suite rc 0 (`<S>/lur-suite-kernel.txt`); fmt rc 0 (`<S>/lur-fmt.txt`); clippy rc 0 (`<S>/lur-clippy.txt`); node suite rc 0 (`<S>/lur-node.txt`).
- Head sha256 file: `<S>/lur-head-sha.txt`.
- Every cargo run used `CARGO_TARGET_DIR=D:/wt-targets/lutf8`, `TMP` and `TEMP` set to `D:/wt-data/lutf8`, and `CARGO_BUILD_JOBS=8`; the test runs also set `RUST_TEST_THREADS=8`.
- Every heavy run was in a shared hold with `<u>/Development/Claude/machine/machine.ps1`, and every hold was granted; no exit code 96 to 99.
  - Hold lines: `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=<m> also=<m>` and `MACHINE_RELEASED project=<m> shell=<m> affinity=FF (cores 0-7)`.
  - On the kernel and clippy holds: `MACHINE_WAITING shared: turn of <m> held by pid <m> since <m>`.
- C: free space stayed between 41410 and 41558 MB, above the 40960 MB floor, at every check.
- No timing failure was seen. The worktree is clean at b035ccb3 and its five touched files have their head sha256. Nothing was committed or pushed, and git stash was not used.

## Files read
- `C:/dev/wt/read-1123ag/governance/forms/engine/LARGE-UTF8-AND-UTF8-VIEW-ATTRIBUTE-COLUMNS-PREREGISTRATION.md`
- `C:/dev/wt/read-1123ag/state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-21-large-utf8-open-1-a-with-t3-adr-023-narrowed-by-an-appended-note-t3-kept-as-a-premise-pin.md`
- `C:/dev/wt/read-1123ag/state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-28-large-utf8-open-5-to-9-the-adr-023-note-with-two-changes-an-adr-021-note-class-9-no-skp-v0-note.md`
- `<S>/brief-lutf8-rev-1.md`, `<S>/lutf8-diff-b035ccb3.txt`, `<S>/report-lutf8-build.md`, `<S>/report-lutf8-words.md`
- PR 364's body (`gh pr view`)
- In C:/dev/wt/lutf8, at b035ccb3 (plus the C1 and cea0ef8c blobs named above): engine/src/attributes.rs, predicate.rs, stream.rs, pool.rs, fixture.rs and dataset.rs (probe_schema); engine/README.md; engine/tests/large_utf8_and_utf8_view_admission.rs; kernel/src/skp.rs (grep); docs/adr/ADR-021-row-filter-on-viewport-query.md and docs/adr/ADR-023-attribute-projection-on-viewport-query.md (via the script)

Model: Opus 5.5 (claude-opus-5-5).
