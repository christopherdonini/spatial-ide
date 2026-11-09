# kernel: clippy 12c, the eleven Windows diagnostics and the two Linux-only warnings in seven kernel test files removed, no behaviour, guard or assertion strength changed — five-line short form (`AUTONOMY.md` §21d)

*Committed before any code. Append-only once committed; an amendment written after any run of this piece's tests or mutations has been seen says so in its first line. PLAN node clippy-deny-warnings-workspace (S3), filler entry 12, placed by the human's ruling of 2026-11-06 (15:59Z) (`state/directives/2026-11-06-8e-words-replaced-u1-h1-h2-class-8-m10-kl-c1-c3-draft-marks-u12-mark-n1-n3-slot-2-order-clippy-placed-288-clicked.md`); its third lettered piece, 12c, by the architect's draft's OPEN-1 (A) (`state/consults/2026-11-07-clippy-deny-warnings-workspace-form-architect-draft.md`). The form, the notes, the OPEN items and what is not settled are lead-data's draft (`state/consults/2026-11-08-clippy-deny-warnings-workspace-12c-form-lead-data-draft.md`, read only at main 5bef37c0; extracted sha256 df15c92e9b2d5c05a1ddc67bf1ce35dcb2f3912e42474344f87ffde9a822738d), carried byte for byte with these changes, all the custodian's: each cite the draft writes `path:line @ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5` is expanded by script to `path:line @ <commit> sha256:<the lines with their LFs>` (30 pins; 0 by a file name that resolves to one tracked path at that commit; 0 by a file name that resolves to more than one, kept as written; bare line numbers kept as written); this title and lead line added; the draft's opening lines (its draft line and its read note) and its closing lines (its no-sha256 line and its result block) dropped; the custodian's settlement added. Form path: `governance/forms/kernel/CLIPPY-DENY-WARNINGS-WORKSPACE-12C-PREREGISTRATION.md`. The custodian keeps the PLAN node on main.*

## The form

Form path: `governance/forms/kernel/CLIPPY-DENY-WARNINGS-WORKSPACE-12C-PREREGISTRATION.md`.
- The template sets no path.
- governance/README.md:23 @ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5 sha256:1a043fffd97b3db90f07c55a43d498dbda72f522eca034adc375ab8ebd153978 puts a form in `governance/forms/<folder>/`, where the folder is the first path segment of the code the form is about. Here that is `kernel`.
- governance/forms/ has no index file, and no 12c form exists yet.
- The architect's table puts 12c in governance/forms/kernel/ (state/consults/2026-11-07-clippy-deny-warnings-workspace-form-architect-draft.md:31 @ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5 sha256:53a91ab6e6368d2fe5d1346a406f710329d45371ad6d32677443b369acefc176).
- So the brief's path stands.

```
Authority: PLAN node `clippy-deny-warnings-workspace` (governance/PLAN.yaml:6634-6650 @ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5 sha256:d265158a72f49de12dc3dd7c9be75d469862528e17b013ab310bab3f7e337599), filler queue entry 12 (state/FILLER-QUEUE.md:35 @ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5 sha256:3a235385016c6c50490c879de3a081cd61fb4a5e89f068f00c41c88e73b10510), its lettered piece 12c as the custodian names the split; placed by the human (state/directives/2026-11-06-8e-words-replaced-u1-h1-h2-class-8-m10-kl-c1-c3-draft-marks-u12-mark-n1-n3-slot-2-order-clippy-placed-288-clicked.md:22 @ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5 sha256:5e39a328d5231c5a72ea22dbfda1ae186fc9903fb8e4037ff874d1f530674385); run in the filler slot under AUTONOMY.md §36 (governance/AUTONOMY.md:692 @ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5 sha256:1135b89c01d0e676bce0bc42a4d6710af445fa0ae95ed12ef6ca0fef7a4d4e84): a five-line form under §21c's size, the reviewer and the architect gating from dispatch; its slicing and outline are the architect's draft (state/consults/2026-11-07-clippy-deny-warnings-workspace-form-architect-draft.md:31, :113-138 @ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5), whose OPEN-1 (A) and OPEN-6 (a) this piece takes under the human's direction of 2026-10-31 (state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md, item 4; held until 2026-11-09 by state/directives/2026-11-03-away-until-11-09-276-open-1-seven-clauses-open-4-c-placed-sitting-wording-leaves-slot-cloud-credit.md:6 @ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5 sha256:5c2e1399389aad0106932f484fda92f351ad5394ac421a6988115716a0452e83); the guards' form (i) is that draft's section 3 (:235-239); evidence, not Authority: the Windows read's rows 33-43 (state/consults/2026-11-07-clippy-deny-warnings-workspace-windows-read-tester-report.md:80-90 @ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5 sha256:47c3a9b3566ff9f8acee76d2d4839ed3f2ae4460c38734d9fc9dcf9216e966c6) and its Linux-only rows L35 and L42 (:128), 12a's gate 1 reviewer's Linux build-step read (state/consults/gates/2026-11-08-clippy-deny-warnings-workspace-12a-gate1-reviewer.md:129-131 @ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5 sha256:a5552fd55492a3e77a858df729b4a36df33e477e3ca5faef8a26d353ec0cc69c), lead-data's impact read (state/consults/2026-11-07-clippy-deny-warnings-workspace-impact-read-lead-data.md:42, :46, :87-90, :128 @ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5); the guard-run precedent governance/forms/engine/LOD-RELEASE-GUARD-PREREGISTRATION.md:9, :27 @ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5 and 12b's form (governance/forms/engine/CLIPPY-DENY-WARNINGS-WORKSPACE-12B-PREREGISTRATION.md); drafted by lead-data, read at main 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5; reuse index: four misses, no prior art recorded for "clippy deny warnings workspace" or "lint warnings ci step" (the architect's draft's two) or for "clippy await holding lock" or "cfg not windows stub" (tools/reuse.mjs in the reuse clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c, exit 1 each, run by the custodian).
Scope: kernel/tests/import_layout_factorial.rs (row 33); kernel/tests/indexed_budgets.rs (rows 34, 35, L35); kernel/tests/publish.rs (rows 36, 37, 38); kernel/tests/scale_pass.rs (row 39); kernel/tests/slice_budgets.rs (rows 40, L42); kernel/tests/support/mod.rs (row 41); kernel/tests/wire_bytes_invariant.rs (rows 42, 43); 7 files; declared line budget 40, counted as insertions plus deletions over non-generated code and tests under §21c's rule, this form excluded, by `git diff --numstat origin/main...HEAD -- kernel/tests/import_layout_factorial.rs kernel/tests/indexed_budgets.rs kernel/tests/publish.rs kernel/tests/scale_pass.rs kernel/tests/slice_budgets.rs kernel/tests/support/mod.rs kernel/tests/wire_bytes_invariant.rs` at a named commit (estimate 17).
Change: the eleven clippy diagnostics whose primary spans are in these files on Windows (rows 33-43 of the Windows read, re-read at main 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5, none moved) and the two Linux-only rustc dead_code warnings (L35, L42) are removed: row 33 (`manual_contains`) by a statement-level `#[allow(clippy::manual_contains)]` on `let gate_overall` in `the_5gb_scored_cells`, falling back to the same attribute on that fn if the head JSON run still lists the row; row 35 (`format_in_format_args`) by a statement-level `#[allow(clippy::format_in_format_args)]` on `let art` in `measure_the_indexed_slice_against_docs_08`, falling back to that fn (after its `#[tokio::test(..)]` line) if the row is still listed, the template and the inner `format!` byte-identical; rows 36-38 (`bool_assert_comparison`) by `assert!(!<expr>)` for `assert_eq!(<expr>, false)`, the same `<expr>` each; row 39 (`manual_is_multiple_of`) by `n.is_multiple_of(50)` for `n % 50 == 0`; rows 34, 40 and 41 (`assertions_on_constants`) by `#[allow(clippy::assertions_on_constants)]` directly above each `fn refuse_debug`, each guard's expression and message byte-identical; rows 42-43 (`await_holding_lock`) by `#[allow(clippy::await_holding_lock)]` between each `#[tokio::test(flavor = "multi_thread")]` line and its `async fn`, falling back to the line above `#[tokio::test(..)]` if the row is still listed, `TRACE_SERIAL`, `serial()` and both test bodies byte-identical; L35 and L42 by deleting the `pub peak_working_set: usize,` line from the `#[cfg(not(windows))] mod procmem` stub's `Counters` in indexed_budgets.rs and slice_budgets.rs, the Windows `#[repr(C)]` structs, their FFI and every reader byte-identical. After the change, the JSON run lists no diagnostic whose primary span is in these files, and lists the rows outside them as at the base; no behaviour, signature, value, test name, assertion's strength, guard, `#[ignore]` string, message or cfg attribute changes.
Tests+mutation: no test is added. Changed test code: one attribute line each on `let gate_overall`, `let art`, three `refuse_debug` fns and two `#[tokio::test]` fns; three assertions in publish.rs rewritten; one condition in `GenProgress::chunk_written`; one field line deleted in each of two non-Windows stubs. Product-side mutations, each applied at the committed head, run alone, recorded and then reverted with `git checkout -- kernel/src/bundle/mod.rs` and `git status --porcelain` shown empty, never committed: M37, `("hashed", Json::Bool(false)),` (kernel/src/bundle/mod.rs:889, occurring once) becomes `("hashed", Json::Bool(true)),`, run `cargo test --locked -p spatial-kernel --test publish a_published_bundle_has_the_declared_layout_and_lists_every_asset_it_contains -- --exact`, predicted rc 101 with the panic at the rewritten assertion (kernel\tests\publish.rs:279); M38, `("verified", Json::Bool(false)),` (:890, once) to `Json::Bool(true)`, the same command, predicted rc 101 at publish.rs:280; M36, `("available", Json::Bool(false)),` (:874, once) to `Json::Bool(true)`, run `cargo test --locked -p spatial-kernel --test publish the_manifest_carries_the_docs_11_resource_refs_the_grade_and_the_transform_fact -- --exact`, predicted rc 101 at publish.rs:957. A test failing before its rewritten line is class 2: the test-side mutation (the `!` dropped from that assertion, the product file untouched) is observed instead and must fail at that line; a survival of either is class 2 and a coverage finding, not a stop. Guard runs, after `cargo test --locked -p spatial-kernel --no-run` has built the debug test binaries: for each guarded site, one debug run of one test that reaches it, `timeout 300 cargo test --locked -p spatial-kernel --test <file> <test> -- --ignored --exact`, with these pairs: indexed_budgets `measure_the_indexed_slice_against_docs_08` (row 34); slice_budgets `measure_the_slice_against_docs_08` (row 40); import_layout_factorial `the_5gb_scored_cells` (row 41, through support/mod.rs). Each is expected to exit with rc 101, panicking at its guard's `assert!` on that guard's own message. This shows that the refusal stands; it is not a mutation, and any other exit (124 included) is a stop. Every failing line the report quotes is copied whole from the run's output file, the thread id included. L35 and L42, which a Windows run cannot see: the PR head's ubuntu-24.04 job "L1 portable correctness · cargo test --workspace (ubuntu-24.04)", step `cargo build --workspace --tests --locked`, its log read for lines naming `peak_working_set`: 0 predicted (12a's head showed 2). At the head: `cargo clippy --locked -p spatial-kernel --all-targets --message-format=json` exits 0 and, counted by the Windows read's rule, lists no row in the Scope files and the rows outside them as at the base; recorded, not claimed: `cargo clippy --locked -p spatial-kernel --all-targets -- -D warnings` and its exit code (101 expected on Windows, from rows 27-32 in kernel/src, 12d's); `cargo fmt --all -- --check` exits 0; `cargo test --workspace --locked` passes.
Out-of-scope: ADR: none (no status, text, note or amendment; ADR-004 Amendment 4's two wire-bytes tests keep their names, bodies and assertions, gaining one attribute line each). Security: none (nothing ADR-020, ADR-009 or ADR-021 governs is touched; no product file). Wire: none (no SKP, data-plane or MCP file; the wire-bytes invariant's tests and its lock unchanged). Guarantee: none (every guard that refuses a debug build is byte-identical under its allow, no harness is run in release, no recorded figure changes, the three rewritten assertions keep their strength as M36-M38 show, no test is renamed, no Windows FFI layout changes). §25 (e) is set aside for a filler by §36. No new dependency, no `unsafe`, no new string, no new `pub` item, no cfg attribute added or removed, no `[lints]` table, no clippy.toml; Cargo.toml and Cargo.lock unchanged.
```

---

## Notes (mine)

### N1. Each row at main, re-read by content

The Windows read pinned fbc905ec, and the architect's draft pinned 4cbcab1e. The brief says no commit since then touches the seven files or kernel/src/bundle/mod.rs. I re-read every site at 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5, and each row sits at the Windows read's line (state/consults/2026-11-07-clippy-deny-warnings-workspace-windows-read-tester-report.md:80-90 @ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5 sha256:47c3a9b3566ff9f8acee76d2d4839ed3f2ae4460c38734d9fc9dcf9216e966c6), so none moved. Each "holds" below is my reading of the code against the lint's rule.

**Row 33, `manual_contains`, kernel/tests/import_layout_factorial.rs:1858-1861 @ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5 sha256:2386cbb052bb076d4559726d8225af17743c15e2469a027e25022d842dc6b0e7.**
- It sits in `the_5gb_scored_cells`: `#[test]` at :1420, `#[ignore = …]` at :1421-1422, fn at :1423, and its first statement `refuse_debug("import_layout_factorial::5gb-scored");` at :1424. The comment line above the site is :1857.
- Byte-copied:
```
    let gate_overall = if [gate1_verdict, gate2_verdict, gate3_verdict]
        .iter()
        .any(|v| *v == "UNMEASURED")
    {
```
- The row holds: `.iter().any(|v| *v == X)` over an array is the lint's pattern.
- Fix: one line, `    #[allow(clippy::manual_contains)]`, inserted between :1857 and :1858.
- Reason: per the outline, a statement-level allow keeps the harness's code byte-identical and narrows the silence to one statement. By my reading, rustc applies lint attributes on a `let` statement through the late pass's local visit. That is unobserved.
- Fallback: if the head JSON still lists the row, the same attribute goes on the fn, between :1422 and :1423, and is recorded. This is the architect's invalidator (architect draft :258 @ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5).

**Row 34, `assertions_on_constants`, kernel/tests/indexed_budgets.rs:568-574 @ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5 sha256:dac07c7332a23bed3227ead19b076be57db922e10d42e2da72eed4c1069fca31.** Byte-copied:
```
fn refuse_debug() {
    assert!(
        !cfg!(debug_assertions),
        "this harness produces measurements, and a debug build invalidates every one of them. \
         Run: cargo test --release -p spatial-kernel --test indexed_budgets -- --ignored --nocapture"
    );
}
```
- Fix: `#[allow(clippy::assertions_on_constants)]` directly above :568. This is form (i) (architect draft :235-239 @ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5).
- 12b observed that a fn-level allow silences this lint inside `assert!`: its head JSON listed 0 rows (state/consults/2026-11-08-clippy-deny-warnings-workspace-12b-worker-report.md:38 @ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5 sha256:d07ee0220681a501ff1861d15be97d695ff2f7fed0d6c1944c4f6f40b476912f).

**Row 35, `format_in_format_args`, kernel/tests/indexed_budgets.rs:1166 @ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5 sha256:9e97c79d6208ba1e13ece2410e67abf9b6eb3bd956ed87b382aa6fa046d1283d.**
- Byte-copied: `    let art = format!(`
- The template slot is :1214, `      "miss_reason_on_first_build": "{a_miss}"`. The inner call is :1324, `        a_miss = format!("{:?}", a_report.miss),`.
- The row holds: a `format!` is a named argument of the outer `format!`.
- Fix: `    #[allow(clippy::format_in_format_args)]` between :1165 and :1166. The template and the argument stay byte-identical.
- Why not inline it: the template is a large JSON artifact, and inlining would change the artifact's writer. The outline gives the allow.
- Fallback: fn level, between `#[tokio::test(flavor = "multi_thread", worker_threads = 4)]` (:671) and `async fn measure_the_indexed_slice_against_docs_08` (:672).
- Two other `format!` sites do not fire, by my reading: :1297 is inside an `if`, and :602-605 is a match.

**L35, rustc `dead_code` on Linux, kernel/tests/indexed_budgets.rs:209 @ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5 sha256:dc123ae319174d2587236a4b73a8b11419acbfc6d443deb0128ba466187790ba.** Byte-copied (:205-216):
```
#[cfg(not(windows))]
mod procmem {
    #[derive(Default, Clone, Copy)]
    pub struct Counters {
        pub peak_working_set: usize,
        pub working_set: usize,
        pub private_usage: usize,
    }
    pub fn sample() -> Option<Counters> {
        None
    }
}
```
- Readers of `Counters`: :241-243 (`c.private_usage`, `c.working_set`) and :711 `procmem::sample().map(|c| (c.private_usage, c.working_set))`.
- No reader of `.peak_working_set` on a `Counters` exists. The `peak_working_set` at :221, :230, :236, :253 and :266 is `MemorySampler`'s own Arc, a different item.
- Fix: delete :209.
- The Windows `#[repr(C)]` struct (:165-182, its field at :172) and its FFI (:184-202) stay byte-identical.
- Why Windows does not warn, by my reading: rustc's dead-code pass treats the fields of a `repr(C)` struct as live.

**Rows 36-38, `bool_assert_comparison`, kernel/tests/publish.rs @ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5.**
- In `a_published_bundle_has_the_declared_layout_and_lists_every_asset_it_contains` (`#[test]` :222, fn :223), byte-copied:
```
    assert_eq!(manifest["sidecar"]["hashed"].as_bool().unwrap(), false);
    assert_eq!(manifest["sidecar"]["verified"].as_bool().unwrap(), false);
```
  These are :279-280. Its comment at :273-274 says the sidecar is named but not hashed and not verified.
- In `the_manifest_carries_the_docs_11_resource_refs_the_grade_and_the_transform_fact` (`#[test]` :887, fn :888), byte-copied (:957):
```
    assert_eq!(m["query_surface"]["available"].as_bool().unwrap(), false);
```
- Fixes, in my words:
  - `    assert!(!manifest["sidecar"]["hashed"].as_bool().unwrap());`
  - `    assert!(!manifest["sidecar"]["verified"].as_bool().unwrap());`
  - `    assert!(!m["query_surface"]["available"].as_bool().unwrap());`
- Each is a one-for-one line replacement, so no line in publish.rs moves.
- Strength: `.unwrap()` still panics on a non-bool, and the assertion still fails on `true`.
- What is lost: `assert_eq!`'s left/right values in the failure message. By my reading that is not strength, because the value is a bool and the failing line names it.

**Row 39, `manual_is_multiple_of`, kernel/tests/scale_pass.rs:191 @ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5 sha256:183d5172be6d565a6491e6f64dba58a6e9ea36c98685a0594963e2e0948428d5.**
- Byte-copied: `        if n % 50 == 0 {`
- It is in `GenProgress::chunk_written` (impl :187, fn :188). `n` is the usize from `self.chunks.fetch_add(1, Ordering::Relaxed)`, and the body only prints.
- Fix: `        if n.is_multiple_of(50) {`. It is equal for every usize, because the divisor is nonzero.
- The workspace already uses it: engine/src/geoarrow.rs:297 `    if !n_coords.is_multiple_of(2) {` and engine/src/fixture.rs:412, :1420 @ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5. So the toolchain supports it.

**Row 40, `assertions_on_constants`, kernel/tests/slice_budgets.rs:466-472 @ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5 sha256:bca6fb7113976e4b4b027ead3557a2ca17cfe2e72ec0078bcdecfcdc60e17378.** Its doc comment is :465. Byte-copied:
```
fn refuse_debug() {
    assert!(
        !cfg!(debug_assertions),
        "this harness produces measurements, and a debug build invalidates every one of them. \
         Run: cargo test --release -p spatial-kernel --test slice_budgets -- --ignored --nocapture"
    );
}
```
- Fix: `#[allow(clippy::assertions_on_constants)]` between :465 and :466, which is below the doc comment and directly above the fn.

**L42, rustc `dead_code` on Linux, kernel/tests/slice_budgets.rs:186 @ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5 sha256:dc123ae319174d2587236a4b73a8b11419acbfc6d443deb0128ba466187790ba.** Byte-copied (:182-193):
```
#[cfg(not(windows))]
mod procmem {
    #[derive(Default, Clone, Copy)]
    pub struct Counters {
        pub peak_working_set: usize,
        pub working_set: usize,
        pub private_usage: usize,
    }
    pub fn sample() -> Option<Counters> {
        None
    }
}
```
- Readers: :219-221 and :614 `procmem::sample().map(|c| (c.private_usage, c.working_set))`.
- Fix: delete :186.
- The Windows `#[repr(C)]` struct is :143-159 (field :148), inside `mod procmem` at :141-180 with its FFI at :161-179. It stays byte-identical.
- Correction to the outline: the outline says the slice_budgets struct ends "at :159" (architect draft :124 @ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5). That is the struct. The mod ends at :180.

**Row 41, `assertions_on_constants`, kernel/tests/support/mod.rs:341-348 @ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5 sha256:d63cd73fbcaf583dacd2f9990ad66f67f9caa1db20663a355808db3b021cae1c.** Byte-copied:
```
pub fn refuse_debug(harness: &str) {
    assert!(
        !cfg!(debug_assertions),
        "{harness} produces measurements, and a debug build invalidates every one of them. A \
         number taken on a debug build is not a smaller number, it is not a measurement. Run with \
         --release."
    );
}
```
- Fix: `#[allow(clippy::assertions_on_constants)]` directly above :341.
- Nine test binaries compile this module (`mod support;`): cancel_rescore, import_layout_factorial, first_batch_factorial, import_layout_publish_determinism, query_window_attribution, regenerate_fixture, regenerate_fixture_s, scale_pass and scale_pass_a6. The Windows read's rule counts the row once.
- The module's own non-Windows stub field (:181) is not flagged, because of `#![allow(dead_code)]` at :24. It is not in Scope and is not touched.

**Rows 42-43, `await_holding_lock`, kernel/tests/wire_bytes_invariant.rs @ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5.**
- Byte-copied (:189-191):
```
#[tokio::test(flavor = "multi_thread")]
async fn tracing_changes_no_byte_on_the_wire() {
    let _serial = serial();
```
- Byte-copied (:396-398):
```
#[tokio::test(flavor = "multi_thread")]
async fn wire_bytes_invariant_holds_for_the_projected_ticket_path_case_too() {
    let _serial = serial();
```
- `TRACE_SERIAL` is a `std::sync::Mutex<()>` (:183), and `serial()` (:185-187) locks it, recovering from poison (:186). Its doc (:168-182) says the hold across `.await` is deliberate. So the row holds, and the lint names a design the file already records.
- Fix: `#[allow(clippy::await_holding_lock)]` inserted between :189 and :190, and between :396 and :397.
- Reason, my reading: `#[tokio::test]` re-emits the item's other attributes on the sync fn it generates and moves the body into an async block inside it, so a fn-level allow reaches the lint's coroutine. A `let`-level allow would not, because the lint is reported for the async body, not the statement.
- No precedent: a multiline Grep over the workspace for an allow between `#[tokio::test` and `async fn` found none. Its positive control found the `#[ignore …]` then `#[tokio::test` pair twice.
- Fallback: the attribute placed above `#[tokio::test(..)]`, recorded (OPEN-A).

**In-code line cites in the seven files.**
- A Grep for `<file>.rs:<digit>` over the seven files found none. Its positive control, `fn refuse_debug` with the same glob, matched.
- The cites into the seven files from elsewhere are named in N5.

### N2. The route

- **Files:** 7, which meets §21c's 8 (governance/AUTONOMY.md:350 @ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5 sha256:98f827948981d936522d9c9273e457c2f4f7e5e622aa917afc6fb73e0edf01f9).
- **Lines,** my estimate, insertions plus deletions with tests counted (:357):

| File | Rows | Lines |
|---|---|---|
| import_layout_factorial.rs | 33 | 1 |
| indexed_budgets.rs | 34, 35, L35 | 3 |
| publish.rs | 36-38 (3 replaced) | 6 |
| scale_pass.rs | 39 | 2 |
| slice_budgets.rs | 40, L42 | 2 |
| support/mod.rs | 41 | 1 |
| wire_bytes_invariant.rs | 42, 43 | 2 |
| **Total** | | **17** |

  Fallbacks move an attribute line; they do not add one, so the total stays 17.
- The declared budget stays at the outline's 40 (architect draft :116 @ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5). An overrun is class 6 (docs/PREREGISTRATION-TEMPLATE.md:125-131 @ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5 sha256:de5406a708458da2c3def1e4b685acd5dacb5aac5ea87f694d49090f7d6e48c9).
- **The other bounds** of §21c and §21a (governance/AUTONOMY.md:317-327 @ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5 sha256:436349471dc7ff504a46e7463ba78749089a99588938555b91e7b2f7d1d8fd6b): no new exposure surface, dependency or user-visible behaviour, and none of the four categories.
- **The nearest category** is "any property currently under test". 12c touches it three ways:
  - The three publish.rs assertions are rewritten, and M36-M38 show they keep their strength.
  - The three debug refusals stay byte-identical, and the guard runs show they stand.
  - The wire-bytes invariant's two tests gain one attribute each, with their bodies and the lock byte-identical.
- **So a five-line form fits.** The smallest true reading is 7 files and about 17 lines.
- **Gates:** the reviewer and the architect from dispatch, under §36 (:692), with §25 (e) set aside and a shared hold only. The grade is S3. There is no string a user sees and no red-line text (governance/AI_DEVELOPMENT.md:451-454 @ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5 sha256:573c907fab55b870ebdc353b7f19459438e3b74c8667217b4c07f8f5a332d821).
- **Scope is not trimmed.** It is the slicing's seven files (architect draft :31).

### N3. Tests and observations, re-checked at main

**Mutation sites,** kernel/src/bundle/mod.rs @ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5. Byte-copied, and each text occurs once in kernel/src:
- :874 `                    ("available", Json::Bool(false)),` in the `"query_surface"` object (:871-884)
- :889 `                    ("hashed", Json::Bool(false)),` in `"sidecar"` (:885-900)
- :890 `                    ("verified", Json::Bool(false)),` in `"sidecar"` (:885-900)

No Rust reader of these keys exists in kernel/src, so a mutation changes only the emitted manifest.

**How each mutation is run:**
- **M37** (:889 to `true`): run `cargo test --locked -p spatial-kernel --test publish a_published_bundle_has_the_declared_layout_and_lists_every_asset_it_contains -- --exact`. Predicted rc 101, panicking at kernel\tests\publish.rs:279.
- **M38** (:890 to `true`): the same command. Predicted rc 101 at :280. :279 passes, because `hashed` is still false.
- **M36** (:874 to `true`): run `cargo test --locked -p spatial-kernel --test publish the_manifest_carries_the_docs_11_resource_refs_the_grade_and_the_transform_fact -- --exact`. Predicted rc 101 at :957.
  - `--exact` matters here. `the_emitted_manifest_has_exactly_the_key_sets_adr_017_declares` (:1193) also checks `available`, at :1352-1355, and a filtered run without `--exact` could catch M36 there instead.
- **Revert:** each mutation is reverted before the next, with `git checkout -- kernel/src/bundle/mod.rs` and the porcelain shown empty.
- **Neither test is ignored,** so each also runs in the suite.
- **The message:** I do not predict the panic message's bytes, because assert!'s stringified expression is not settled (see "could not settle"). The report quotes the panic line whole, thread id included, and the message line after it.
- **Class 2 rule:** if a test fails before its rewritten line, the declared test-side mutation is observed instead, which is the outline's rule (architect draft :129).

**Guard runs.** The precedent is governance/forms/engine/LOD-RELEASE-GUARD-PREREGISTRATION.md:9, :27 @ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5, and 12b's form.
- Build first: `cargo test --locked -p spatial-kernel --no-run`, rc 0.
- Each run: `timeout 300 cargo test --locked -p spatial-kernel --test <file> <test> -- --ignored --exact`, expected rc 101.

| Site | `--test` | Test (its call to the guard) | Panic location at the head, my computation | Message span |
|---|---|---|---|---|
| 34 | indexed_budgets | `measure_the_indexed_slice_against_docs_08` (:672, `refuse_debug();` :673) | kernel\tests\indexed_budgets.rs:569:5 | `Run: cargo test --release -p spatial-kernel --test indexed_budgets -- --ignored --nocapture` (from :572) |
| 40 | slice_budgets | `measure_the_slice_against_docs_08` (:476, `refuse_debug();` :477) | kernel\tests\slice_budgets.rs:467:5 | `Run: cargo test --release -p spatial-kernel --test slice_budgets -- --ignored --nocapture` (from :470) |
| 41 | import_layout_factorial | `the_5gb_scored_cells` (:1423, `refuse_debug("import_layout_factorial::5gb-scored");` :1424) | kernel\tests\support\mod.rs:343:5 | `produces measurements, and a debug build invalidates every one of them.` (from support/mod.rs:344), preceded in the printed message by `import_layout_factorial::5gb-scored` (the argument at :1424) |

(All source lines @ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5.)

- **How I computed the locations:**
  - indexed_budgets: one line is deleted at :209 and one inserted above :568, so the assert stays at :569.
  - slice_budgets: one line is deleted at :186 and one inserted above :466, so the assert stays at :467.
  - support/mod.rs: one line is inserted above :341, so the assert moves from :342 to :343.
  - A different location is not a stop if the panic is at the guard's `assert!` on its own message. The worker records it.
- **Message spans:** for 34 and 40 the second-line span is used, because both guards' first lines are identical. My reading of the `\` continuation is that each span prints unbroken.
- **Why the_5gb_scored_cells:** the outline lets the worker pick the support binary (architect draft :132). I name it so that no choice is left. Its guard call is its first statement, and it is also the fn that holds row 33 (OPEN-B).
- **Stops:** an exit of 124 or 0, or a panic elsewhere, is a stop: "A guard not refusing a debug build" (architect draft :257).
- **Quotes:** each panic line is quoted whole, thread id included. A cut span is marked `…`, with the whole line beside it. This answers 12a's D2.

**L35 and L42, shown gone through CI.**
- Where to read: product-ci-rust.yml's job "L1 portable correctness · cargo test --workspace (ubuntu-24.04)" (.github/workflows/product-ci-rust.yml:196-197 @ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5 sha256:6001cee2262c0ea4d0b2dae776762ca043e8b20f58ce2f6e6faee1446a322f44), step "Build the workspace and every test target" running `cargo build --workspace --tests --locked` (:221-223).
- The baseline: at 12a's head that step's only warnings were `warning: field `peak_working_set` is never read` (×2) and the two `spatial-kernel` summaries (state/consults/gates/2026-11-08-clippy-deny-warnings-workspace-12a-gate1-reviewer.md:131 @ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5 sha256:b5bccc28f85fa7dc3b6b2347f95a9310cc971574c184c807a4273b8d69fb5178).
- Predicted at 12c's PR head: 0 lines in that step naming `peak_working_set`, and no `spatial-kernel` warning summary for indexed_budgets or slice_budgets.
- Read with `gh api …/jobs/<job>/logs`, the method 12a's reviewer used. The job id and the checkout sha are recorded beside the result.
- Who reads it:
  - The worker cannot see it before the push. The custodian or the reviewer reads it at the PR head.
  - The gates read it themselves (architect draft :310).
- A remaining warning at either site is a stop, not a coverage finding.

**Not mutated: read from the diff, or proven by the compiler.**
- Rows 33, 34, 35, 40, 41, 42 and 43: one attribute line each over byte-identical code.
- Row 39: equivalent for a nonzero divisor.
- L35 and L42: the compiler proves that no reader of the field exists on Linux. If one existed, the Linux build would fail.
- The recorded M-1 for the wire-bytes race is not re-run:
  - M-1 (governance/forms/kernel/WIRE-BYTES-INVARIANT-TRACE-FLAG-RACE-PREREGISTRATION.md:148-152 @ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5 sha256:51437b920495ca02233616fcadb30f81904f8765c9b7fd3bb4a8eb2e74f970da) mutates `serial()`.
  - 12c leaves `serial()`, the lock and both bodies byte-identical, and an allow changes no generated code. So, by my reading, M-1's premise still holds.
  - The outline records the same (architect draft :133).

**Where a survival is a coverage finding:**
- M36-M38 surviving both the product-side and the test-side forms is class 2 and a coverage finding, not a stop.
- A guard not refusing, or a stub warning remaining, is a stop.

**The recorded -D command.**
- At the head: `cargo clippy --locked -p spatial-kernel --all-targets -- -D warnings`. Its exit is recorded, not claimed.
- Expected 101 on Windows. Rows 27-32 (kernel/src, 12d's five files) deny the lib, so the run stops before it reaches any test target.
- So it shows nothing about the seven files. The JSON run carries that claim.
- By my reading, clippy lints only the packages that `-p` names, so a workspace path dependency is not linted here.
- An exit 0 would mean rows 27-32 are gone at 12c's base, for example because 12d merged first. That is recorded and reported, not a stop.

### N4. Verification

Every cargo call runs inside a shared hold.

**At the base** (origin/main at dispatch, after #302 merges, before any edit):
1. `git rev-parse HEAD`, `cargo clippy --version` and `rustc -V`, rc 0 each.
2. `cargo clippy --locked -p spatial-kernel --all-targets --message-format=json`, stdout to a file outside the repository, rc 0.
   - It is counted by the Windows read's rule (state/consults/2026-11-07-clippy-deny-warnings-workspace-windows-read-tester-report.md:42 @ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5 sha256:d17cd24e318ed4728e8b4f79bd1f57ab78bdbed76b78aa520abbad2a098e4832).
   - Expected: the 11 rows of N1 in the seven files at N1's lines, and the rows outside them recorded. My expectation is rows 27-32, 6 rows.
   - A row in a Scope file that N1 does not list stops the piece before code (OPEN-D).

**At the head:**
1. The same JSON run: rc 0, zero rows in the seven files, and the rows outside them equal to the base's by (lint, file, span, message). A listed row 33, 35 or 42/43 sends that site to its declared fallback, recorded, and the run is repeated.
2. `cargo clippy --locked -p spatial-kernel --all-targets -- -D warnings`: its rc recorded (N3).
3. `cargo fmt --all -- --check`: rc 0.
4. `cargo test --workspace --locked`: rc 0, in one shared hold (Part 1, item 4).
5. `cargo test --locked -p spatial-kernel --no-run`, then the three guard runs: rc 101 each, on their spans.
6. M37, M38 and M36: rc 101 each at their lines, each reverted, with porcelain empty after.
7. `git diff --numstat origin/main...HEAD` and `--name-only`: exactly the seven files, total 40 or less.
8. Governance checks as CI runs them, rc 0 each:
   - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`
   - `node scripts/plan/verify-cites.mjs`
   - `node scripts/plan/verify-quotes.mjs`
   - `node scripts/plan/verify-test-claims.mjs`
   - `node scripts/plan/verify.mjs`
   - `node scripts/plan/forms-layout.mjs`

**After the push:** the Linux build-step read for L35 and L42 (N3).

**The gates re-run at the reviewed head:**
- the full suite (Part 1, item 4; item 9: the reviewer does not yet rely on CI);
- the JSON run and the -D command;
- M36-M38 (item 9: mutation observations stay the gates' own);
- the three guard runs;
- the Linux build-step log for L35 and L42 (architect draft :310).

**Not claimed:** a workspace or per-package `-D warnings` exit 0 (12d's), any Linux or macOS clippy result, and any timing.

**cfg-boundary:** it is not run as a claim. scripts/plan/cfg-boundary.mjs:10, :47 @ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5 excludes tests/ paths. No cfg attribute is added or removed; only a field line inside an existing `#[cfg(not(windows))]` module goes. By my reading this is not a platform-feature change under the architect's R3.

### N5. What must not change

- **Files:** every file outside the seven, including:
  - kernel/src/bundle/mod.rs (mutated and reverted only);
  - kernel/README.md;
  - every kernel/src, engine, renderer and protocol file;
  - 12a's and 12b's files;
  - kernel/RESULTS.md;
  - Cargo.toml and Cargo.lock.
- **In the seven files:**
  - every test name, `#[test]`, `#[tokio::test(..)]` and `#[ignore = …]` string;
  - every assertion other than the three rewritten, which keep their expressions;
  - every message;
  - every guard's expression and message;
  - the Windows `#[repr(C)]` structs and their FFI (indexed_budgets.rs:165-203; slice_budgets.rs:141-180);
  - the stubs' `working_set` and `private_usage` and their `sample()`;
  - `MemorySampler`;
  - `TRACE_SERIAL`, `serial()` and the RECORDED MUTATION comment (wire_bytes_invariant.rs:390-395);
  - support/mod.rs's `#![allow(dead_code)]` and its own stub;
  - every public item, path and figure a harness asserts or writes;
  - `GenProgress`'s print.
- **No harness run in release,** and no recorded figure changed.
- **Pins elsewhere, named and not edited:**
  - engine/tests/common/mod.rs:31, :61 cite `kernel/tests/slice_budgets.rs:472-486`, and engine/tests/lod_tier_builder.rs:9 cites `kernel/tests/slice_budgets.rs:472` (@ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5).
    - At main, :472 is `refuse_debug`'s closing `}`, and :472-486 runs to `let canary_start = Canary::take("start");` (:486). The fixture write they mean is at :497-511 (`let path = dir.join("polygons-100k.parquet");` :500, `write_geoparquet(` :502).
    - So they are stale at main already.
    - 12c's net shift in slice_budgets.rs is 0 from :466 on (−1 at :186, +1 above :466), so they land on the same bytes after 12c.
  - kernel/RESULTS.md:4711 and :4721 cite scale_pass.rs:860 and :610 as historical run output. Row 39 is a one-for-one line, so nothing moves.
  - kernel/README.md:372, :378 pin `publish.rs::the_emitted_manifest_has_exactly_the_key_sets_adr_017_declares` and both wire-bytes tests by name. The names are unchanged.
  - A Grep for cites with a line number into the other five files across kernel, engine, renderer, protocol and frontends found only the two RESULTS.md lines.
- **Stale record:** WIRE-BYTES-INVARIANT-TRACE-FLAG-RACE :129-131 (governance/forms/kernel/WIRE-BYTES-INVARIANT-TRACE-FLAG-RACE-PREREGISTRATION.md @ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5). Byte-copied from :131: "Clippy's await_holding_lock would name this hold. No workflow under .github/workflows runs clippy (search at 0c2be9cb). No allow attribute is added."
  - It was true of that piece's diff and its search.
  - From 12c's merge on, 12c's two allows end its last sentence's premise, and 12e's step ends the second. The tree is authoritative for the current state; the pin is authoritative for what that piece claimed.
  - Its :113 ("Unchanged, byte for byte: the test names, every assertion and message, …") bounded that piece's diff. 12c also keeps them.
  - No amendment (architect draft :268-270).

### N6. Rule (00) at main 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5 (governance/AUTONOMY.md:609)

- **12c's paths:** the seven files, this form, and the custodian's PLAN.yaml and FILLER-QUEUE.md edits. None is under protocol/, a wire fixture, Cargo.lock or package-lock.json.
- **Branches:** filtered to the seven files and protocol/, by the brief's `git diff --name-only origin/main...<branch>` lists, none of the five touches these paths:
  - `cut/port-2-macos-l1-and-app-dirs`
  - `cut/b2-piece-1c-save-and-reopen`
  - `cut/b1-shell-half-pr-c`
  - `cut/stale-harness-comments-find-prime-and-late-result` (#301)
  - `cut/clippy-deny-warnings-workspace-12b` (#302)
- **Result:** disjoint by those lists. One filler runs at a time, so no 12c code starts before #302 merges.
- **Entry 13** (governance/PLAN.yaml:6804-6820; state/FILLER-QUEUE.md:36 @ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5 sha256:7fbdf9e0332e82b5332610ca7433345ad0be9205cfedb0cbe7299d0864c96d4e) is engine/src/index.rs, rowgroup.rs and their tests, disjoint from the seven.
- **The PLAN node's gate** names the 12B form at :6643. The custodian moves it to this form at commit.

### N7. Part 1 (items 1 to 9) as applied, and the records

- **Item 1:** 12c writes no sentence about behaviour and adds no comment, and no allow carries a comment. A comment a worker adds is written after the code and checked clause by clause.
- **Items 3 to 6:** a correction is checked as new work; the full suite at the reviewed head comes before any gate; both gates get the same packet; findings carry their closure.
- **Item 7:** no test double and no new test. The mutations act on the product file, at the real boundary.
- **Item 9:** the gates re-observe M36-M38, the guard runs and the Linux log.
- **Owner's index:**
  - 12c changes no pointer's target. kernel/README.md:356-389 @ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5 sha256:6e4dde0e5b6e3a548476ea796261c504579f810d27526c6d45ff192e4f34cd7c names no Scope file's line, and the two test-name pointers keep their names.
  - The pending line, 12c's form in the preregistration list at :387, stays lead-data's after-merge update (governance/AI_DEVELOPMENT.md:749 @ 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5 sha256:478ae83a5ea308b4b9d1a3b4c0812f1413897fa02ec89fe7881430dc7efa0f26).
  - kernel/README.md is not in Scope. Adding it would add a file the slicing does not give 12c.

### N8. The architect's readings I rely on

- **OPEN-1 (A):** five lettered five-line pieces; 12c is the third.
- **OPEN-6 (a):** statement-level allows for rows 33 and 35, falling back to fn level (architect draft :118-119, :258).
- **The guards' form (i)** (section 3, :235-239): a fn-level allow, the guard byte-identical. This is a principle, not an OPEN item.
- **The outline's L35/L42 stub-field deletion** (:124) and its rows 36-38 fix with product mutations (:120, :125-129).
- I take them under the human's direction of 2026-10-31, item 4, held until 2026-11-09 (the 2026-11-03 directive, :6).
- OPEN-2, 3, 4, 5, 7 and 8 concern 12a, 12d and 12e. 12c does not rely on them.

---

## OPEN items

- **OPEN-A: the placement of the rows 42-43 allow.**
  - (a) Between `#[tokio::test(..)]` and `async fn`, with the declared fallback above `#[tokio::test(..)]`. If both leave the row listed, the piece stops, and an amendment follows.
  - (b) Above `#[tokio::test(..)]` from the start.
  - (c) A file-level `#![allow(clippy::await_holding_lock)]`. It is one line, but it silences every future test in the file.
  - Recommend (a). Not a red line: the code is unchanged, and the lock's hold is already the file's documented design.
  - Changing `serial()` or the lock instead would alter what the tests assert about tracing races. I do not offer it.
- **OPEN-B: the test that reaches support/mod.rs's guard.**
  - (a) `import_layout_factorial` `the_5gb_scored_cells`, named in the form.
  - (b) The worker picks one of the nine binaries, as the outline allows.
  - Recommend (a). Not a red line.
- **OPEN-C: the per-package `-D warnings` run.**
  - (a) Recorded, not claimed, with 101 expected, as the outline gives it. 12d carries the claim.
  - (b) Dropped from 12c, because it cannot reach the tests.
  - Recommend (a). Not a red line.
- **OPEN-D: diagnostics at the base that this form does not list.**
  - (a) Base step 2 is the worker's step 0.
    - A row in one of the seven files that N1 does not list stops the piece before code. It returns as an amendment: the architect's class 9 reading (architect draft :254), which the custodian may overrule.
    - A row in a kernel file outside the seven is recorded and reported, never fixed in 12c.
  - (b) The custodian runs the JSON at the base before this form is committed.
  - Recommend (a), as 12a and 12b took it.
  - **Red line, as I read it:** what happens to a row in a file no slice gives. Adding it to any slice is a scope change to a ruled item, so it goes to the human through the custodian. It does not hold 12c.

## What I could not settle

- Whether statement-level allows silence rows 33 and 35, and whether a fn-level allow after `#[tokio::test(..)]` silences rows 42-43. All are unobserved; the fallbacks are declared.
- The exact message assert! prints for `assert!(!expr)` (M36-M38): it is the stringified expression, and I do not predict its bytes.
- Whether the panic locations land where I computed. I predict them, but they are not a stop condition.
- Whether a Linux clippy run finds rows in the seven files beyond L35 and L42. That is 12e's to see.
- Whether rows 27-32 still stand at 12c's base, and so the -D exit.
- Whether my reads are byte-identical to 5bef37c052f5aa3356a1584bdcd9ac4d40be28b5. I read the working tree; the custodian's pin script settles it.
- Whether the direction of 2026-10-31, item 4 still holds when the form is committed. The human returns 2026-11-09, after which OPEN-A to OPEN-D may be theirs.
- The branches' contents beyond the brief's lists.

## The custodian's settlement (class 1, before any code)

- **The architect's OPEN-1 (A) and OPEN-6 (a)** (`state/consults/2026-11-07-clippy-deny-warnings-workspace-form-architect-draft.md`), which the draft's Authority line takes, taken for 12c on 2026-11-09 at this form's commit under the human's direction of 2026-10-31, item 4 (`state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md`), held to 2026-11-16 by the human's message of 2026-11-09 (`state/directives/2026-11-09-item-4-to-11-16-12c-open-a-d-taken-slot-2-order-pr-b-slot-1-availability-monday-list.md`, line 9), as 12a's and 12b's forms took OPEN-1 (A).
- **OPEN-A (a), OPEN-B (a), OPEN-C (a) and OPEN-D (a)**, each this draft's recommendation, taken on 2026-11-09 by the human's words in that message: "12c's OPEN-A to OPEN-D: taken as recommended under it." The draft's unsettled item on whether item 4 still holds when this form is committed is settled by the same message.
- **OPEN-D's red line** (a clippy row at the base in a file no slice gives) goes to the human only if the worker's base run finds one. It does not hold 12c: under (a), such a row is recorded and reported, never fixed here.
- **The route:** filler entry 12, the slot's one in flight; a five-line form under §21c's size; the reviewer and the architect from dispatch (§36). Every cargo call runs inside a shared hold.
- **The copied code:** at 5bef37c0 the custodian's script found the draft's ten code blocks copied from the seven Scope files each equal to the lines it names, its single-line quotations each equal to its line, and each of M36 to M38's mutation texts occurring once in kernel/src (the filing note of `state/consults/2026-11-08-clippy-deny-warnings-workspace-12c-form-lead-data-draft.md`). Whether each lint fires, whether an allow's placement silences it, and how each guard's message prints are the draft's readings, unobserved; the worker's base JSON run (OPEN-D (a)) settles the first before any code.
- **The read commit and main:** `git diff --name-only 5bef37c0 96fb7400` over the seven Scope files and kernel/src/bundle/mod.rs (M36 to M38's file) lists none. Over the 20 files the pins name it lists 2: `governance/PLAN.yaml`, `state/FILLER-QUEUE.md`, by the custodian's records only. The pins keep the read commit's lines.
- **12c's base** is main after #302 (12b) merged, so 12a's eight files and 12b's seven are at their fixed state there; the base JSON run records the rows outside the seven files.
- **The PLAN node:** one node holds entry 12. Its `gate` names the lettered piece in flight: this form now, the next lettered form when 12c is done.
- **Rule (00)** at main 96fb7400, `git diff --name-only origin/main...<branch>` against the seven Scope files and protocol/: port-2 (`cut/port-2-macos-l1-and-app-dirs`): none; 1c (`cut/b2-piece-1c-save-and-reopen`): none; B1 shell half C (`cut/b1-shell-half-pr-c`): none. It is checked again at dispatch.

## Amendments (opens empty; append-only)
