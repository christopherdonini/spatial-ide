Reviewed: PR #303 at 1889a28a69698be2f87e519668d634c2e52cdd19 (base f703b720), gate 1, reviewer
Branch and commit: cut/clippy-deny-warnings-workspace-12c @ 1889a28a69698be2f87e519668d634c2e52cdd19

Verdict: PASS WITH NOTES

The packet's sha256 matched: 11ea286c176a088e2c6fb210f977929bef2297861c4dabf6cc55283d7ebd81f8, 10000 bytes. I read Part 1 items 1 to 9 of the 2026-11-05 directive first. The form at the head is sha256 81d32ec6…, the same as on main.

## Findings by class

**Correctness:** none.

**Evidence:** none. Every observation the form predicted held when I re-ran it myself at the head (checks 3 to 7).

**Documentation (must be fixed before the merge; it does not block):**

D1. A sentence in the custodian's filing note is untrue. The note is the first line of `state/consults/2026-11-09-clippy-deny-warnings-workspace-12c-worker-report.md`, on main, outside this PR's diff. It says: "the guard runs' and the mutations' exit codes are in its output files".
- Requirement: Part 1 item 1 (sentences are checked against what they describe) and the record rule that a claim must resolve.
- Evidence: a grep over all of the worker's `c12c-*` outputs finds an exit-code line only in `c12c-ws.rc` (`ws_rc=0`). The six files `c12c-g34.txt`, `c12c-g40.txt`, `c12c-g41.txt`, `c12c-m36.txt`, `c12c-m37.txt` and `c12c-m38.txt` hold no rc line. I read each of them whole.
- Closure: the record is append-only, so an appended correction of at most three sentences. My words, which are the custodian's wording, not the human's: "Correction to the filing note: the worker's six guard-run and mutation output files (c12c-g34, -g40, -g41, -m36, -m37, -m38) hold no exit-code line; each holds its test's `test result: FAILED` line. Gate 1's reviewer observed rc 101 for all six at 1889a28a69698be2f87e519668d634c2e52cdd19."
- Clause check of my words:
  - "no exit-code line": the grep above.
  - "`test result: FAILED` line": present in each of the six files.
  - "rc 101 for all six": my own runs, in checks 4 and 5.

**Known finding 1 (packet §5), disposition confirmed; nothing follows for 12c:**
- The eight rows outside the seven files are the Windows read's rows 27 to 32 and 44 to 45. That is exactly the architect's table row 12d ("27-32, 44, 45").
- N3's reading that clippy lints only the `-p` package is wrong: the renderer path dependency is linted.
- The `-D` run therefore stops at the `spatial-renderer` lib, not at rows 27 to 32 as the Tests+mutation line expected. That run is recorded, not claimed (OPEN-C (a)). The JSON run still carries the claim, and the claim holds.
- Under the record cap, any closing amendment should cite this by reference, not restate it.

## Checks 1 to 12

**Before the cargo checks: D: free space**
- 197G available; the floor is 40 GiB. Output in `c12c-g1r-df.txt`.

**Check 1: the Out-of-scope line**
- Changed files: `git diff --name-only f703b720...1889a28a` lists exactly the seven Scope files.
- Cargo files: the same command restricted to Cargo.toml, Cargo.lock, `*/Cargo.toml` and `*clippy.toml` gave 0 bytes. No `clippy.toml` is tracked (grep rc 1), and `git grep '^\[lints'` over Cargo.toml files gave rc 1.
- The 11 added lines contain no `unsafe`, `pub `, `cfg`, `extern` or `use `. My positive control found the 2 deleted lines that contain `pub `.
  - Three added lines contain `"`. They are the rewritten publish.rs assertions, and they carry the same key literals as the base lines they replace (byte-identical expressions, check 2), so no string is new.
- ADR: none. No docs/adr file is changed, and the two wire-bytes tests' bodies and assertions are byte-equal to the base (check 2).
- Security: none. No product file is changed.
- Wire: none. No protocol/ file is changed, and `TRACE_SERIAL` and `serial()` are byte-equal.
- Guarantee: none.
  - The guards are byte-identical (check 2) and still refuse a debug build (check 5).
  - M36 to M38 fail (check 4).
  - No test is renamed, and the Windows FFI is byte-equal.
- §21d: the line names no §21a category as touched.

**Check 2: the diff against the Change line and N1** (script `c12c-g1r-cmp.mjs`, rc 0, ALL-OK)
- Row 33 (import_layout_factorial.rs): with its one allow line removed, the head is byte-equal to the base.
  - `#[allow(clippy::manual_contains)]` sits at head :1858, directly above `let gate_overall`.
- Row 34, row 35 and L35 (indexed_budgets.rs): the head minus its two allow lines equals the base minus base :209, byte for byte.
  - Base :209 is the only `pub peak_working_set: usize,` line inside the `#[cfg(not(windows))]` / `mod procmem {` / `#[derive(Default, Clone, Copy)]` / `pub struct Counters {` stub. The other one, :172, is the Windows `repr(C)` field and is unchanged.
  - `assertions_on_constants` sits directly above `fn refuse_debug() {`.
  - `format_in_format_args` sits directly above `let art = format!(`.
  - Row 35's template and inner `format!` are byte-identical.
- Rows 40 and L42 (slice_budgets.rs): the same result.
  - The deleted line is base :186, inside the stub. The Windows field is :148, unchanged.
  - The allow sits below the doc comment and directly above `fn refuse_debug() {`.
- Row 41 (support/mod.rs): with its allow removed, the head is byte-equal to the base. The allow sits directly above `pub fn refuse_debug(harness: &str) {`.
- Rows 42 and 43 (wire_bytes_invariant.rs): with its 2 allows removed, the head is byte-equal to the base.
  - Each allow sits between `#[tokio::test(flavor = "multi_thread")]` and its `async fn`, at head :190 and :398.
  - `TRACE_SERIAL`, `serial()`, both bodies and the RECORDED MUTATION comment are therefore unchanged.
- Rows 36 to 38 (publish.rs): the line count is equal (2148) and only lines 279, 280 and 957 differ.
  - Each `<expr>`, extracted from base `assert_eq!(<expr>, false);` and from head `assert!(!<expr>);`, is equal, with the same indent: `manifest["sidecar"]["hashed"].as_bool().unwrap()`, `manifest["sidecar"]["verified"].as_bool().unwrap()` and `m["query_surface"]["available"].as_bool().unwrap()`.
- Row 39 (scale_pass.rs): the line count is equal and only :191 differs.
  - `n` is `usize`: it is bound by `self.chunks.fetch_add(1, Ordering::Relaxed)`, and `chunks` is an `AtomicUsize` (:184).
  - `n.is_multiple_of(50)` equals `n % 50 == 0` for every usize, because the divisor is nonzero.
- Readers of `peak_working_set` that a non-Windows build compiles: none.
  - At the head, the remaining hits are:
    - the Windows `repr(C)` fields (indexed :172, slice :148);
    - `MemorySampler`'s own `Arc<AtomicUsize>` (:220/:229/:235/:252/:265 and :198/:207/:213/:230/:243);
    - the template keys `"peak_working_set_bytes"` (:1270 and :778).
  - The stub's readers use only `c.private_usage` and `c.working_set`.
- Every deleted line (6) and what replaced it:
  - indexed_budgets.rs base :209 and slice_budgets.rs base :186 (`pub peak_working_set: usize,`): nothing.
  - publish.rs :279, :280 and :957: `assert!(!<same expr>);`.
  - scale_pass.rs :191: `if n.is_multiple_of(50) {`.
- N5's list of what must not change holds:
  - no file outside the seven changed;
  - inside them, every byte outside the enumerated lines is equal to the base;
  - that covers every test name, every `#[test]`, `#[tokio::test]` and `#[ignore]` string, every message and guard, the structs and FFI, the stubs' remaining fields and `sample()`, `MemorySampler`, `#![allow(dead_code)]` and `GenProgress`'s print.

**Check 3: the clippy runs at the head, by me**
- JSON run: `cargo clippy --locked -p spatial-kernel --all-targets --message-format=json` gave rc 0 (`c12c-g1r-head.json`).
- My counter, `c12c-g1r-count.mjs`, counts by the Windows read's rule.
  - Head: 14 raw and 8 distinct, 0 of them in the seven files.
  - The worker's `c12c-base.json` (sha256 13919e463e13b676…, equal to the packet's first 16 hex): 33 raw and 19 distinct, 11 of them in Scope at N1's lines.
  - The rows outside the seven files, compared by (lint, file, start and end line and column, message): 8 at the head, 8 at the base, 0 only at the head, 0 only at the base.
  - The 8 rows by Windows read number: 27 publish-bundle.rs:149, 28 lib.rs:414, 29 lib.rs:489, 30 boundary.rs:536, 31 publish/mod.rs:839, 32 skp.rs:277, 44 renderer canonical.rs:240, 45 renderer style.rs:10.
- `-D` run: `cargo clippy --locked -p spatial-kernel --all-targets -- -D warnings` gave rc 101, recorded and not claimed. Its first and only `could not compile` line: `error: could not compile `spatial-renderer` (lib) due to 2 previous errors`.

**Check 4: the mutations, by me** (each on the committed head, in its own hold)
- M37: the old text occurs once, at :889. My `git diff` showed `-("hashed", Json::Bool(false)),` and `+("hashed", Json::Bool(true)),`. rc 101.
  `thread 'a_published_bundle_has_the_declared_layout_and_lists_every_asset_it_contains' (39248) panicked at kernel\tests\publish.rs:279:5:`
  `assertion failed: !manifest["sidecar"]["hashed"].as_bool().unwrap()`
  Reverted; porcelain 0 bytes.
- M38: the old text occurs once, at :890; the diff showed the verified line changed to `true`. rc 101.
  `thread 'a_published_bundle_has_the_declared_layout_and_lists_every_asset_it_contains' (31448) panicked at kernel\tests\publish.rs:280:5:`
  `assertion failed: !manifest["sidecar"]["verified"].as_bool().unwrap()`
  Reverted; porcelain 0 bytes.
- M36: the old text occurs once, at :874; the diff showed the available line changed to `true`. rc 101.
  `thread 'the_manifest_carries_the_docs_11_resource_refs_the_grade_and_the_transform_fact' (71572) panicked at kernel\tests\publish.rs:957:5:`
  `assertion failed: !m["query_surface"]["available"].as_bool().unwrap()`
  Reverted; porcelain 0 bytes.
- All three landed at their predicted lines. Nothing survived.

**Check 5: the guard runs, by me**
- `cargo test --locked -p spatial-kernel --no-run` gave rc 0.
- indexed_budgets `measure_the_indexed_slice_against_docs_08`: rc 101.
  `thread 'measure_the_indexed_slice_against_docs_08' (77584) panicked at kernel\tests\indexed_budgets.rs:569:5:`
  `this harness produces measurements, and a debug build invalidates every one of them. Run: cargo test --release -p spatial-kernel --test indexed_budgets -- --ignored --nocapture`
- slice_budgets `measure_the_slice_against_docs_08`: rc 101.
  `thread 'measure_the_slice_against_docs_08' (36584) panicked at kernel\tests\slice_budgets.rs:467:5:`
  `this harness produces measurements, and a debug build invalidates every one of them. Run: cargo test --release -p spatial-kernel --test slice_budgets -- --ignored --nocapture`
- import_layout_factorial `the_5gb_scored_cells`: rc 101.
  `thread 'the_5gb_scored_cells' (22724) panicked at kernel\tests\support\mod.rs:343:5:`
  `import_layout_factorial::5gb-scored produces measurements, and a debug build invalidates every one of them. A number taken on a debug build is not a smaller number, it is not a measurement. Run with --release.`
- Each panicked at its guard's `assert!`, on that guard's own message.

**Check 6: the suite at the head, by me**
- `cargo fmt --all -- --check` gave rc 0.
- `timeout 3600 cargo test --workspace --locked`, in one hold, gave rc 0.
  - 118 `test result:` lines, all ok: 1027 passed, 0 failed, 66 ignored, and no FAILED line.
- The four named tests, by their line in `c12c-g1r-ws.txt`:
  - :1310 `test the_manifest_carries_the_docs_11_resource_refs_the_grade_and_the_transform_fact ... ok`
  - :1315 `test a_published_bundle_has_the_declared_layout_and_lists_every_asset_it_contains ... ok`
  - :1659 `test tracing_changes_no_byte_on_the_wire ... ok`
  - :1660 `test wire_bytes_invariant_holds_for_the_projected_ticket_path_case_too ... ok`

**Check 7: L35 and L42 on Linux, by me** (`gh api --allow-escape-sequences`, rc 0 for both)
- Push run: job 129243243090, run 42641427641. PR run: job 129243973831, run 42641637598.
  - Both runs' head_sha is 1889a28a69698be2f87e519668d634c2e52cdd19, and both conclusions are success.
  - My logs are byte-equal to the custodian's (sha256 e727cb1c1254faaa… and 5200f022ebb2f7bd…).
- With ANSI codes stripped, each log has 0 lines naming `peak_working_set` and 0 lines containing `warning:`.
  - Positive control: 7 `Compiling` lines per log.
  - The only "warning" lines are git hints and `##[warning]Node.js 20 is deprecated…`.
- In each log, the step `##[group]Run cargo build --workspace --tests --locked` compiled `spatial-kernel`, for example `Compiling spatial-kernel v0.0.0 (…/kernel)`, followed by `Finished `dev` profile`.
- Both 0 and 0, as predicted.

**Check 8: the governance checks at the head**
- `node --test` over the three script globs, in a hold: rc 0, tests 598, pass 598, fail 0.
- verify-cites: rc 0, PASS.
- verify-quotes, in a hold: rc 0, PASS (152 checked, 121 verified, 30 baselined, 1 advisory, 0 errors).
- verify-test-claims: rc 0, PASS.
- `verify.mjs --offline`: rc 0, PASS.
- forms-layout: rc 0, PASS.

**Check 9: bytes**
- The 11 added lines hold 0 CR, 0 tab and 0 non-ASCII bytes. Positive control: the -U3 diff holds 3 non-ASCII bytes, the em dash in a context line.
- All seven files end in 0x0a and hold no CR.

**Check 10: the worker's report against its outputs** (script `c12c-g1r-rep.mjs`)
- All 12 quoted guard and mutation lines (panic lines and message lines) occur as whole lines in `c12c-g34`/`g40`/`g41`/`m37`/`m38`/`m36.txt`.
- The mutation diff texts are not in those files, which is expected because the files are test output. My own diffs confirm lines :889, :890 and :874.
- The counts "33 raw and 19 distinct" and the head's "8 distinct, 0 in the seven" match `c12c-base-count.txt` and `c12c-head-count.txt`.
- The suite totals "118 test-result lines: 1027 passed, 0 failed, 66 ignored" match `c12c-ws.txt` by my counter.
- I found no untrue sentence in the worker's own text. Its "each rc 101" for the guards and mutations is not shown by its output files (see D1), but my own runs observed rc 101 for all six.

**Check 11: CI**
- `gh pr checks 303` gave rc 0: 18 checks, all pass.
- `gh run view` on each of the 12 runs the packet lists: headSha 1889a28a69698be2f87e519668d634c2e52cdd19 and conclusion success for every one.
- PR #303's headRefOid is 1889a28a…, and it is a draft.

**Check 12: the porcelain afterwards**
- `git -C C:/dev/wt/c12c status --porcelain --untracked-files=no` gave rc 0 and 0 bytes. HEAD is 1889a28a69698be2f87e519668d634c2e52cdd19.

## For the human
Nothing.

## The packet's gaps
- The packet did not say that the worker's guard and mutation output files carry no exit code, a fact the filing note asserts (D1).
- The packet did not give `n`'s type for row 39. I read it at the head.
- The packet gave no head line numbers for the two allow-carrying `async fn`s or for the guarded tests. I found them by name.

## Hold lines (`also=` segments elided)
1. Clippy JSON run: `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:55848 …` and `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:55848 affinity=FF (cores 0-7)`.
2. Clippy `-D` run: shell=bash.exe:62224, held and released.
3. M37: bash.exe:26504.
4. M38: bash.exe:33080.
5. M36: bash.exe:64448.
6. `--no-run` build: bash.exe:56232.
7. Guard run, indexed_budgets: bash.exe:52084.
8. Guard run, slice_budgets: bash.exe:44484.
9. Guard run, import_layout_factorial: bash.exe:36696.
10. cargo fmt check: bash.exe:82068.
11. Workspace suite: bash.exe:74384.
12. node --test: bash.exe:71552.
13. verify-quotes: bash.exe:75652.

Every hold was granted and released, and every hold-script exit was outside 96 to 99. Each hold line has the form `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:<pid>`.

## Background shells left
None.
- Every background task I started has exited and reported completion (clippy JSON, clippy `-D`, M37, M38, M36, `--no-run`, the suite, the governance-check batch, the bounded wait loop, verify-quotes).
- One bounded wait loop ended on its hard timeout (115 turns of 5 s).
- `tasklist` shows no cargo.exe running. I killed nothing.

## Process notes
- Two of my heredoc scripts lost a backslash: `split('\\')` in the counter and `'\\['` in the Linux log regex. Each failed loudly or was caught by inspection. I repaired both with `String.fromCharCode(92)` before any result was used, and the repaired lines are shown in the transcript.
- The light governance batch (verify-cites, verify-test-claims, `verify --offline`, forms-layout) ran outside a hold; the brief requires a hold only for the scripts suite and verify-quotes. It overran its 120 s call timeout and finished in the background with rc 0 for each.

All scratch outputs are in <S>, the files named `c12c-g1r-*`.
