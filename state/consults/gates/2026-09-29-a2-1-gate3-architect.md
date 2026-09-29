*Custodian's filing note (2026-09-29): gate 3 (architect) of PR #143 for PLAN node `b1-close-nul-column-names`. Reviewed: cut/b1-close-nul-names-2 @ f4d81c5 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message with the harness's two-space indent removed, and the text below the rule is the agent's. Its closing file list gives absolute paths, kept as the agent wrote them. Verdict FAIL, with blocking findings B1-B3: comment-level claims only (two observation citations and three misattributed or false comment claims). The architect prescribes a reduction instead of a correction round: one commit touching comment lines only, whose pass condition the reviewer checks. On the substance it finds no engine path that carries U+0000 to a prepare, items 26 and 27 pass, and 12.3's invalidators did not fire. Its B1 notes a check the custodian's filing of report 4 missed: that report's claim about N-15's citation, which is false. Profile paths redacted at filing: none.*

---

Reviewed: cut/b1-close-nul-names-2 @ f4d81c5 — **Verdict: FAIL**

Scope: PR #143, PLAN node `b1-close-nul-column-names`, governing form `engine/B1-PROJECTION-PREREGISTRATION.md` §10 Amendment 12 plus its appended correction of record (a2e8810). I read the worktree `C:\dev\wt\b1-close-nul-names`, whose HEAD is f4d81c51dc98 on `cut/b1-close-nul-names-2` according to the worktree reflog. I have no Bash, so I computed no hashes, ran no diffs and ran no mutations. Anything below that needs git goes to the gate-3 reviewer. Code is cited by symbol and file.

All three findings below would be handled by reduction. None needs another correction round. The prescribed commit is at the end.

## Blocking findings

**B1. N-15 still names no commit for its observation. Gate-2 A-B3 and R-B6 are not fixed for N-15.**
- The doc comment of `the_schema_probe_classifies_by_position_and_keeps_duckdbs_own_renames` in `engine/tests/b1_projection_hostile_names.rs` still reads "Observed (gate-1 correction round 1, uncommitted on base 303dca0)". It does not cite the gate-2 reviewer at b4d7aa1, whatever the brief and the worker report say. The report's A-B3 row claims "N-15's equivalent cites the gate-2 reviewer at b4d7aa1". That claim is false, and the custodian's filing note did not re-check it.
- Citing b4d7aa1 would not help anyway. The test body changed at a3be169, when `let _guard = serial_guard();` was removed.
- The same sentence quotes words it credits to "12.1(a)'s own" reasoning: "a bind check or `parquet_schema` cannot supply". 12.1(a) contains no such words. They come from `probe_schema`'s doc comment in `engine/src/dataset.rs`. This is a quote that does not match its named source, a failure by name under round 10.

**B2. N-6 cites an observation made on a body that has changed since.** Round 25, item 2 (c) is what brings in the commit.
- The doc of `a_filter_on_a_file_with_a_nul_named_column_binds_and_streams_its_other_columns` cites the gate-1 reviewer at 303dca0.
- The gate-1 reviewer's B5 says no new test hashed its fixture at 303dca0. At f4d81c5, N-6 hashes its fixture before and after the run, so the body changed at 6a366e2.
- 6a366e2 also added the guard, and a3be169 removed it. So neither 303dca0 nor b4d7aa1 is a commit after which N-6's body stayed the same.

**B3. Three comment claims are false or misattributed.**
- (a) The module doc of `b1_projection_hostile_names.rs` says "Every fixture this file writes is hash-verified before and after the test that writes it". The three control tests hash nothing, and under 12.2 they must stay unchanged. This is a done-claim that does not resolve (round 7).
- (b) The section comment in `engine/src/fixture.rs` says the local `write` is "used by every test in that file, control and hostile alike". N-8 (`a_geometry_column_whose_name_contains_u0000_refuses_open_naming_that_fact`) uses only `fixture::write_hostile_geometry_name`. This wording came from my own gate-2 B2 ("Every N-test in the file uses it"). The error is mine.
- (c) N-14's doc credits "the schema does not contain" to "R-S3's own … wording". R-S3 (`engine/ADMISSION-PREREGISTRATION.md` §2c) has no such words. The engine message, in `sanity_check` in `engine/src/dataset.rs`, reads "which the file's schema does not contain". This is a quote that does not match its source (round 10).

## Check 1: the gate-2 findings

| Finding | Status at f4d81c5 |
|---|---|
| A-B1 / R-B5 (the mutex) | **Fixed.** No `SERIAL` or `serial_guard` in either hostile file. The only match in `engine/tests/` is `source_watch_adapter.rs`, which this PR does not touch. The rationale is gone. |
| A-B2 (controls) | **Fixed.** The three control bodies carry no guard. I accept the custodian's and the worker's identical body hashes at c37b427 and f4d81c5. The `fixture.rs` comment no longer says "richer" or control-only, but see B3(b). |
| A-B3 / R-B6 (observation cites) | **N-15 not fixed (B1).** N-6 names a commit, but see B2. |
| A-B4 / R-B1 (N-14 leases) | **Fixed.** `leases_issued` is compared before and after the bbox refusal for both p1a and p1b. |
| A-B5 / R-B2 (K-2 fixture) | **Fixed.** The eighth case of `every_projection_refusal_is_synchronous_typed_and_pre_mint` hashes `skp-projection-k2-refusals-hostile.parquet` before and after. The stale "N-4" label is gone. |
| A-B6 / R-B3 (N-3's c02) | **Fixed.** `projectable_and_admission_agree_on_a_nul_named_column` now writes `zone\0x` (Int64) ahead of `zone` (Utf8). That is the `c02-nul-int-before-utf8` row of `state/drafts/a2-1-p0/p0-output.txt`. |
| A-B7 / R-B4 (N-10's fixture) | **Fixed.** `write_p3_native_id` matches p3 in `extra-probe.rs.txt` and `extra-output.txt` column for column: `key` UInt64, `geometry`, `id\0x` Utf8, `id` UInt64. `DataType::UInt64` is asserted through `file_schema()`. |
| A-B8 (instrument callers) | **Fixed.** The doc of `dataset::identity_verification_scans` names N-10 and N-11 beside `admission_instruments.rs`, which satisfies round 5, item 4's naming condition. |
| A-B9 (branch-commit hash) | **Passes.** The appended correction is two sentences, under round 12 (d)'s ceiling of three. It restates the reference as the path at c37b427 with no hash. That is round 25, item 2 (d)'s words form, applied to a whole file. It leaves the Reproducers line as the 2026-09-29 formatting ruling (`state/directives/2026-09-29-a2-1-amendment-12-formatting.md`) kept it. The reviewer should confirm a2e8810 only appends, measured against b4d7aa1. |

**B1 on the substance.** Round 2 changed no engine logic, as far as I can read. On re-reading, every prepare site that can carry a name still passes through (c) or the usable-covering rule:
- `probe_schema` and the DESCRIBE read bind only the path.
- `admit_identity` runs `not_addressable_for_field` before `run_identity_scan`.
- `covering_sample` and `covering_statistics` run only after `covering_not_addressable_reason`.
- `Dataset::covering()` is `None` for an unusable covering (`open_inner`), and every bbox path (`dataset.rs` and `stream.rs`) goes through it.
- The filter namespace goes through `filterable_column_type`.

Items 26 and 27 pass. 12.3's invalidators did not fire. 200 unserialized runs reproduced nothing: the worker's 120 with SQL printed in Debug form, plus the gate-2 reviewer's 80. The gate-2 reviewer's explanation (a mutated tree built during the worker's session) stands as the likelier cause.

## Check 2: regressions

- 12.1 (a)-(h), 12.3, §7 and §8 items 25-34 pass on reading at f4d81c5. `EXPORTED_NAME_KEY` is still internal. The renders in `ColumnUnknown`'s Display and publish's `From` arm do nothing for names without U+0000.
- **I cannot confirm that f4d81c5 is formatting only.** The reviewer must show every hunk of `git diff e8cf4bc f4d81c5` inside `rustfmt --check --edition 2021`'s output against e8cf4bc's copies of `engine/src/attributes.rs` and `kernel/src/skp.rs`.
- **The check is also too narrow.** The worker's count went from 55 to 0 across seven files, so `engine/src/dataset.rs`, `engine/src/fixture.rs` and the three test files were also reformatted, inside a3be169, cffce51, 02cfbd5 and e8cf4bc. Those commits' messages call them docs or fixes. The reviewer must show that `git diff b4d7aa1 f4d81c5 -- engine/src/dataset.rs engine/src/fixture.rs` contains only the doc edits plus rustfmt hunks.
- Round 25, item 2 checks: no §7 overrun; the class 9 amendment (1add801) comes before any code; no record calls a `verify-mutation` run an observation; no class-3 test-text row; not a five-line form.

## Check 3: test text

- N-15 fails (B1). N-6 fails (B2).
- No other test text this PR adds claims an observation. The N-3, N-13, N-14, N-16 and K-2 eighth-case docs only state a mutation and what it would do.
- Every test in both hostile files, plus K-2, N-3, N-10 and N-14, changed body after b4d7aa1. The gate-3 reviewer's mutation table at f4d81c5 is therefore the observation of record for all of them.

## The reduction (one commit, comment lines only; no correction round)

- `engine/tests/b1_projection_hostile_names.rs`:
  - In N-6's doc, delete from "Observed by the gate-1 reviewer" through "not a silent pass."
  - In N-15's doc, delete from "Observed" through "reasoning)."
  - In the module doc, change "Every fixture this file writes" to "Every fixture an N-test in this file writes".
- `engine/tests/b1_projection_hostile_covering.rs`: in N-14's doc, delete ", R-S3's own "the schema does not contain" wording".
- `engine/src/fixture.rs`: delete "and used by every test in that file, control and hostile alike,". Also delete "unchanged since c37b427" if the reviewer's hash of the local `write` differs between c37b427 and f4d81c5. The custodian hashed only the three control bodies.
- The observations then live in the gate reports, as 12.5's Record line provides.
- Pass condition: the reviewer shows the reduction commit's diff touches only `//`, `//!` and `///` lines. With the formatting proofs in check 2 and the re-observed mutation table at f4d81c5, the piece lands with no further round.

## Check 4: the closing record (not blocking now)

- 12.1(d)'s projection row names `admit_projection_column`. The real single site is `attributes::check_geometry_and_identity`, which `admit_projection` pass 2 and `admit_projection_column` both call. The closing amendment records this as one reference to that symbol at the merge commit, with no prose.
- The PR body must ask for a **non-squash** merge. 19f37da (SKP-V0 §8, the conformance README, AMBIGUITIES A9), 303dca0 and b4d7aa1 (gate reports) are all named in records and must stay reachable from main.
- c37b427 will never be on main: the form's correction and the control-test "unchanged since" claims name it on `cloud/wave2-A2`. Keep that ref on origin, or tag it. Otherwise both references stop resolving, and no hash pin can follow on main as round 25, item 2 (d) normally expects.
- Not blocking: the hostile-names module doc still pins the c37b427 file by sha256. That is test text, not an append-only record, so round 15 (e) does not reach it. It can drop the hash in the reduction commit for consistency.

No decision is missing, so no ADR skeleton is needed.

Files:
- `C:\dev\wt\b1-close-nul-names\engine\B1-PROJECTION-PREREGISTRATION.md`
- `C:\dev\wt\b1-close-nul-names\engine\tests\b1_projection_hostile_names.rs`
- `C:\dev\wt\b1-close-nul-names\engine\tests\b1_projection_hostile_covering.rs`
- `C:\dev\wt\b1-close-nul-names\engine\tests\b1_nul_native_id_scan_once.rs`
- `C:\dev\wt\b1-close-nul-names\engine\src\fixture.rs`
- `C:\dev\wt\b1-close-nul-names\engine\src\dataset.rs`
- `C:\dev\wt\b1-close-nul-names\engine\src\attributes.rs`
- `C:\dev\wt\b1-close-nul-names\kernel\tests\skp_projection.rs`
- `C:\dev\spatial-ide\state\consults\2026-09-29-a2-1-worker-report-4.md`
- `C:\dev\spatial-ide\state\consults\gates\2026-09-29-a2-1-gate1-reviewer.md`
- `C:\dev\spatial-ide\state\directives\2026-09-29-a2-1-amendment-12-formatting.md`
- `C:\dev\spatial-ide\state\drafts\a2-1-p0\extra-output.txt`
