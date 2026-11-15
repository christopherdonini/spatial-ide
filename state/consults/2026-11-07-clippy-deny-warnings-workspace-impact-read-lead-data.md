*Custodian's filing note (2026-11-07): lead-data's impact read for filler entry 12, `clippy-deny-warnings-workspace`, read only in the main checkout at 0bd29263, from the Windows read (`state/consults/2026-11-07-clippy-deny-warnings-workspace-windows-read-tester-report.md`) and the cloud's Linux report. Dispatched at 2026-11-07T11:10:28.445Z by its transcript from a brief of 8857 bytes (sha256 128e5ec8ca2fe968e582d2cf8188b29a4fceee57d8edcf86de21ac55af1c0365), carrying the human's Part 1 rulings of 2026-11-05 by reference; the run to its hand-back at 2026-11-07T11:24:53.628Z (claude-opus-5-5; unique calls Read 69, Grep 51, Glob 4 and the hand-back, 125; no shell and no write, so no background shell). This report is the hand-back, saved from it with one final newline (sha256 e3f8d5c9cf3606ec94e87c4880301aacb0b83a40aaec7114d8671e3570f71dea); nothing is changed.

Its four questions go to the human in the custodian's closing message. Q1 and Q2 are red lines (what CI installs): whether `components: clippy` fits the human's "nothing installed", and whether a floating `@stable` under `-D warnings` stands. Q3 and Q4 are what CI runs. None of them holds S1 to S3 or S5. The architect drafts the form or forms from this read next, and chooses the slicing with the custodian. Model output, not Authority.*

---

Impact read: clippy-deny-warnings-workspace (lead-data, 2026-11-07)

Unless it is in quotation marks, every sentence here is in my own words (lead-data's). Quoted text is byte-copied from the file cited. I have no shell, so this report gives no sha256, runs no clippy and lists no branch. I read the working tree of the main checkout. I could not print its HEAD; the session's git snapshot names 0bd29263 as its latest commit. Every site I read sits at the line number the Windows read gives (state/consults/2026-11-07-clippy-deny-warnings-workspace-windows-read-tester-report.md:46-92 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3), which fits with no Rust change since fbc905ec. Every pointer below is written at 0bd292637de7a4b628db92bf70df8b6e02c4d7c3.

What governs this read: the placement (state/directives/2026-11-06-8e-words-replaced-u1-h1-h2-class-8-m10-kl-c1-c3-draft-marks-u12-mark-n1-n3-slot-2-order-clippy-placed-288-clicked.md:22 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3), whose words are "(the toolchain's own clippy; nothing installed)"; the node (governance/PLAN.yaml:6634-6650 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3); its filler row (state/FILLER-QUEUE.md:35 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3); the lead-data paragraph (governance/AI_DEVELOPMENT.md:749 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3); and Part 1's items 1 to 9 (state/directives/2026-11-05-main-architect-gate-rounds-part-1-rulings-review-packet-design-part-3-additions.md:28-64 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3), applied by reference. The two findings are reports, not Authority.

## 1. Each diagnostic's smallest fix

Rows use the Windows read's numbers; "c" is the cloud report's number (state/consults/2026-11-03-cloud-suite-linux-report.md:208-257 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3). L7, L35 and L42 are the three Linux-only rustc `dead_code` items. Column P/T says whether the fix is in product or test code. MARK means the fix could change behaviour, a public signature, or what a test asserts.

| # (c) | Site | Smallest fix (mine) | P/T | MARK and notes |
|---|---|---|---|---|
| 1 (1) | engine/src/rowgroup.rs:331 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3 | `#[allow(clippy::too_many_arguments)]` on `pub fn build`, as engine/src/index.rs:313 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3 | P | none |
| 2 (2) | engine/src/stream.rs:2346 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3, in `attr_row_bytes` (engine/src/stream.rs:2323 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3) | (a) The cloud's fold of the Boolean arm into the Int8/UInt8 condition at :2348; the value 1 is unchanged and the arms are disjoint by type. (b) Leave the expression and give the Boolean arm a comment, the way the Float32 arm has one ("its own 4-byte arm, not folded into the 8-byte Int64/Float64 one", engine/src/stream.rs:2362 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3). (c) A fn-level allow; the workspace has no precedent for this lint. | P | **MARK.** This function's result sets publish batch boundaries, so it sets every partition hash. The rationale is engine/src/stream.rs:2299-2304 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3, which see section 7's note. No test pins the Boolean cost: the estimator test at engine/src/stream.rs:2863-2870 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3 covers Float32 only. The cloud's fix is right but risky for that reason. (b) or (c) leave the expression byte-identical. |
| 3 (3) | engine/src/stream.rs:2462 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3 (`fn flush`) | allow, as engine/src/stream.rs:1769 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3 | P | none (private) |
| 4 (4) | engine/src/stream.rs:3808 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3 (inside `mod tests`, :2713-2714) | a local `type` alias, as the cloud proposes | T | none |
| 5, 6 (5, 6) | engine/src/trace.rs:637, :658 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3 (inside `mod tests`, :562-563) | drop the `*` | T | none |
| L7 (7) | engine/src/watch.rs:73 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3 (`pub(crate) const WATCH_BUFFER_BYTES`). Its only readers are inside `#[cfg(windows)] mod windows_watch` (engine/src/watch.rs:105-107, :222, :250 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3). | `#[cfg(windows)]` on the const. watch.rs is on the OS-cfg allowlist (scripts/plan/cfg-boundary.mjs:28 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3). | P | No public API change, since the const is crate-private. The declared value stands (governance/forms/engine/SOURCE-WATCHER-PREREGISTRATION.md:392 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3). No Windows run can observe this fix. |
| 7 (8) | engine/tests/admission_p4_corpus.rs:363 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3 | allow on the test-local `enum Observed`, as the cloud proposes | T | none |
| 8 (9) | engine/tests/admission_property_campaign.rs:218 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3 | drop the `*`; `pick` returns `&'a T` (:106) | T | none; no RNG draw moves |
| 9 (10) | engine/tests/admission_property_campaign.rs:270-278 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3 | The cloud's inline: the inner `format!` was the last argument, so its two arguments go last and the draw order holds. | T | **MARK.** This is a seeded generator (seeds at :62-78), and no committed test asserts the bytes it generates. A slip changes the campaign silently. |
| 10, 11 (11, 12) | engine/tests/admission_property_campaign.rs:543, :556-561 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3 | drop the `*`; `.last()` becomes `.next_back()` | T | none; same element, no RNG draw |
| 12 (13) | engine/tests/filter_type_admission.rs:1267 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3, in `is_declared_cast` (:1250) | `if int_info(from).is_some() {` | T | **MARK.** This sits on the assertion path of `the_type_walk_agrees_with_the_binder_over_the_p0_matrix` (:1556). |
| 13-15 (14-16) | engine/tests/fixture_generation.rs:126, :127, :143 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3 | drop the `&`; `write_geoparquet` takes `impl AsRef<Path>` (engine/src/fixture.rs:860 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3) | T | none |
| 16, 17 (17, 18) | engine/tests/identity.rs:321, :324 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3, in `skipping_the_uniqueness_check_is_recorded_rather_than_hidden` (:296) | `!md.contains_key(..)` | T | **MARK** (the assertion): equivalent, but a dropped `!` would invert it |
| 18, 21-25 (19, 22-26) | the `assertions_on_constants` guards | see section 3 | T | the measurement guards |
| 19, 20 (20, 21) | engine/tests/import_layout_5gb_fixtures.rs:318, :326 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3; `log` is already `&mut String` (:265) | `log.as_str()` | T | none; the same bytes are written |
| 26 (27) | engine/tests/publish_stream.rs:534-536 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3, in `a_batch_reports_the_bounds_of_the_rows_it_actually_carries` (:492) | the cloud's `enumerate` form, over the 4-array at :508-513 | T | **MARK** (the assertion): it must keep `to_bits()` and all four bounds |
| 27 (28) | kernel/src/bin/publish-bundle.rs:149 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3 | `index.is_multiple_of(20)`; there is a usize precedent at engine/src/geoarrow.rs:296-297 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3, and no member declares `rust-version` | P | none (a progress print) |
| 28, 29 (29, 30) | kernel/src/lib.rs:414, :489 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3 (the private `create_from_raw_params` and `create_from_ticket`) | (a) An allow on each fn, following the precedent in the same file at kernel/src/lib.rs:559-562 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3, whose doc states the reason. (b) The cloud's alias `CreatedSource` (protocol/data-plane/src/transport.rs:151 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3), the identical type. | P | No behaviour change either way. The cloud's fix is incomplete: under (b), the precedent's stated reason at :559-560 becomes untrue beside it, so :559-566 would change too (a third site), and kernel/README.md:381 gains `CreatedSource`. The cloud also places that allow at :566; it is at :561. Overlap: 1c edits kernel/src/lib.rs. |
| 30 (31) | kernel/src/permission/boundary.rs:536 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3 | `bundle: &std::path::Path`, the spelling this file already uses at :517, so no import changes. The cloud's version edits the import at :104. The one caller (:436) coerces. | P | none (private fn) |
| 31 (32) | kernel/src/publish/mod.rs:839 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3 | `watch`; it is already `&CancelWatch<'_>` (:719) | P | none |
| 32 (33) | kernel/src/skp.rs:277 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3, on `pub fn redeem` (:274) | (a) allow; (b) the alias, plus the import at :22 | P | **MARK** under (b): it changes how a pub fn's return type is spelled, though the type is identical. (a) leaves it alone. |
| 33 (34) | kernel/tests/import_layout_factorial.rs:1858-1861 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3 | `[..].contains(&"UNMEASURED")` | T | **MARK.** It computes a recorded gate verdict in an ignored harness. |
| 34, 40, 41 (36, 43, 44) | guards | see section 3 | T | |
| L35 (35) | kernel/tests/indexed_budgets.rs:209 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3, in the `#[cfg(not(windows))]` stub (:205-216) | delete the field from the stub only | T | **Caution:** the Windows `#[repr(C)]` struct (:165-182) must keep its field. It is the layout `K32GetProcessMemoryInfo` fills (:184-201); removing the field would shift `working_set` and `private_usage`, and with them every memory figure the harness records. |
| 35 (37) | kernel/tests/indexed_budgets.rs:1166 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3; the inner call is at :1324 and its slot at :1214 | the cloud's `a_miss = a_report.miss` with `{a_miss:?}` (format arguments are borrowed, so nothing moves) | T | **MARK.** Right, the artifact's bytes are unchanged. Wrong, they change, and nobody can run the harness to check: it is release-only and docs/08 binds it. |
| 36-38 (38-40) | kernel/tests/publish.rs:279, :280 (inside :223's test) and :957 (inside :888's test) @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3 | `assert!(!..)` | T | **MARK** (the assertion): the same strength; the failure message loses left/right |
| 39 (41) | kernel/tests/scale_pass.rs:191 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3 | `n.is_multiple_of(50)` | T | none |
| L42 (42) | kernel/tests/slice_budgets.rs:186 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3, in the stub (:182-193) | as L35; the Windows FFI struct (:161-179) keeps its field | T | caution as L35 |
| 42, 43 (45, 46) | kernel/tests/wire_bytes_invariant.rs:191, :398 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3 | see section 3 | T | |
| 44 (47) | renderer/src/canonical.rs:240 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3, in `pub fn write_double` (:232) | the cloud's `!(MIN_ABS_DOUBLE..MAX_ABS_DOUBLE).contains(&mag)`. The half-open range is ADR-017's domain, "`0` or `1e-6 ≤ |v| < 1e15`" (docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:75 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3). NaN is refused earlier, at :233-235. An allow is the alternative. | P | **MARK:** equivalent only while :233 stands. Overlap: 1c edits this file. |
| 45 (48) | renderer/src/style.rs:10 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3; the cause is :9 | `\+` (state/consults/2026-11-03-cloud-suite-linux-report.md:288-298 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3) | P (doc) | none; see section 3 |

## 2. Allow or fix

- **Better allowed:**
  - `too_many_arguments` (1, 3);
  - `large_enum_variant` (7);
  - `await_holding_lock` (42, 43);
  - the nine `assertions_on_constants` (section 3);
  - `type_complexity` at kernel/src (28, 29, 32), following kernel/src/lib.rs:561 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3;
  - arguably `if_same_then_else` (2).
- **Fixed:** everything else, mechanically.
- **Item-level precedents:**
  - engine/src/watch.rs:293, :541; engine/src/stream.rs:1769; engine/src/rowgroup.rs:382; engine/src/index.rs:313; engine/src/lod.rs:1267, :1347, :1461;
  - kernel/src/publish/mod.rs:682, :1369; kernel/src/lib.rs:561; kernel/tests/scale_pass.rs:733; kernel/tests/scale_pass_a6.rs:508;
  - protocol/data-plane/src/adapter_ws.rs:70 (with an inline reason);
  - one file-level allow: kernel/tests/cancel_rescore.rs:28;
  - all @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3.
- **No lint configuration exists:** no `[lints]` or `[workspace.lints]` in Cargo.toml:1-103 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3 or in any member manifest, and no clippy.toml.
- **A workspace-level allow changes what CI enforces.** The step's command would stay the same while its lint set narrowed, through Cargo.toml rather than the workflow, for every member and every future diagnostic of that lint.
  - It needs the root table plus `[lints] workspace = true` in all five member manifests: six files.
  - A rustc lint placed there, such as `dead_code`, would also change what `cargo build` and `cargo test` report.
  - That makes it the human's, as what CI runs. My draft uses none.

## 3. The cautions

- **The nine `assertions_on_constants` guards.**
  - Sites, all @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3:
    - engine/tests/import_layout_5gb_digest.rs:394-398, import_layout_5gb_fixtures.rs:337-342, import_layout_digest.rs:460-466, import_layout_fixtures.rs:246-251;
    - lod_tier_measurements.rs:252-257 and :485-491 (the helper `five_gb_build`);
    - kernel/tests/indexed_budgets.rs:568-574, slice_budgets.rs:466-472, support/mod.rs:341-348 (`pub fn refuse_debug`, compiled into nine binaries).
  - Two forms keep the panic at run time in a debug build:
    - (i) `#[allow(clippy::assertions_on_constants)]` on each enclosing fn. The guard stays byte-identical, at 1 line each: 9 lines over 8 files.
    - (ii) The cloud's `if cfg!(debug_assertions) { panic!(<same message>) }` (state/consults/2026-11-03-cloud-suite-linux-report.md:283-286 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3). By my count it changes about 100 lines, because each message is re-indented.
  - Clippy's `const { assert!(..) }` breaks the debug build (the same report, :276-281).
  - Form (i) leaves untouched the mechanism docs/08 names, "both refusing a debug build outright" (docs/08_Testing.md:17 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3). It also keeps the guard text that governance/forms/engine/LOD-RELEASE-GUARD-PREREGISTRATION.md:8 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3 describes.
  - A file-level `#![allow]` would hide future constant assertions as well.
  - My draft is (i).
- **The two `await_holding_lock` sites.**
  - An allow on each test fn (kernel/tests/wire_bytes_invariant.rs:189-191, :396-398 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3) changes nothing about concurrency: the same std Mutex, the same hold, and the reason is already in `serial()`'s doc (:178-187).
  - `tokio::sync::Mutex` would change it. A waiting test would yield inside its own runtime instead of blocking its thread, and the poison recovery at :186 would be lost. It would also break the shape that piece's form fixed (governance/forms/kernel/WIRE-BYTES-INVARIANT-TRACE-FLAG-RACE-PREREGISTRATION.md:105, :111, :129 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3).
  - That form records "No workflow under .github/workflows runs clippy (search at 0c2be9cb). No allow attribute is added." (:131). The allow reverses that line, because the step removes its premise. The new form should say so. Test names and assertions stay byte-identical, as that form's :113 requires.
- **Row 45's doc list.**
  - The cause is line 9, `//! + same data …`, which quotes docs/06_Rendering.md:21 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3. A leading `+` opens a Markdown list.
  - Clippy's suggested indentation is wrong: it would keep the list.
  - `\+` changes one character and renders the sentence as docs/06 has it. The source bytes of the quotation change; the rendered words do not.
  - Reflowing lines 8-9 also works.

## 4. The CI step

- **Where.** .github/workflows/product-ci-rust.yml has one job, `workspace` (:188 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3). It is a matrix of windows-latest and ubuntu-24.04 (:194-197); each entry runs `dtolnay/rust-toolchain@stable` with no inputs (:205), then a per-OS rust-cache (:209-211).
  - My draft is one step in that job, after "Run the ordinary suite" (:233-234), running `cargo clippy --workspace --all-targets --locked -- -D warnings`.
  - It carries the list step's guard, `if: ${{ !cancelled() && steps.build.outcome == 'success' }}` (:238-240), so a lint failure and a test failure each report.
  - It runs on both entries, and the job names stay byte-identical (:195, :197; the watched Windows check name, :42-43).
  - `-D warnings` goes after `--`, never in RUSTFLAGS. RUSTFLAGS changes every unit's fingerprint, the vendored DuckDB's included, which is the cost :111-120 manages; PORT-1 treated it as block-on-sight for its own piece (governance/forms/root/PORT-1-LINUX-L1-PREREGISTRATION.md:307 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3).
  - The header's "What a green run here means" (:12-18) gains a sentence. That is a sentence about behaviour, so it is written after the code (Part 1, item 1).
  - I make no timing claim, including on whether the step reuses the build step's DuckDB build-script output.
- **`-D warnings` and rustc's own warnings.**
  - For the fix: L7, L35 and L42 belong in the piece even though no Windows run can see them, and their removal shows only on Linux. The existing Linux entry's build step already prints them as plain rustc warnings (state/consults/2026-11-03-cloud-suite-linux-report.md:265-266 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3), so the PR's own existing CI log checks them without the new step.
  - For the step: it has to run on the Linux entry, or those three never gate. On Linux it also lints `cfg(not(windows))` code that Windows clippy cannot see, so a Windows exit 0 is not a Linux pass.
  - From then on, every rustc warning fails CI on both entries, a dependency deprecation included.
- **The toolchain: a red line.**
  - :205 has no `components:` input, and nothing in the repository establishes whether that toolchain carries clippy.
  - The only precedent names its component (.github/workflows/rust-fmt.yml:68-70 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3). Its form reads that line as "The one install it implies:" and says "The runner image's preinstalled components are not relied on" (governance/forms/root/WORKSPACE-RUSTFMT-PREREGISTRATION.md:87 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3).
  - By the repository's own reading, then, `components: clippy` is an install: questions Q1 and Q2 below. I propose nothing past them.
- **What checks "passes."**
  - Windows: `cargo clippy --locked --workspace --all-targets -- -D warnings` exits 0 at the last code slice's head (the Windows read's command 2, state/consults/2026-11-07-clippy-deny-warnings-workspace-windows-read-tester-report.md:33 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3), with `cargo clippy --version` recorded.
  - Linux: no local run exists. That is Q4.

## 5. Slicing by module

Line counts are my estimates, as insertions plus deletions; tests count (governance/AUTONOMY.md:347-357 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3).

| Slice | Rows | Files | Lines | Confined or crosses | Waits on |
|---|---|---|---|---|---|
| S1 engine src | 1-6, L7 | engine/src/rowgroup.rs, stream.rs, trace.rs, watch.rs (4) | about 12-16 | engine/ | nothing |
| S2 engine tests | 7-17, 26 | engine/tests/admission_p4_corpus.rs, admission_property_campaign.rs, filter_type_admission.rs, fixture_generation.rs, identity.rs, publish_stream.rs (6) | about 30 | engine/ | nothing |
| S3 engine harnesses | 18-25 | engine/tests/import_layout_5gb_digest.rs, import_layout_5gb_fixtures.rs, import_layout_digest.rs, import_layout_fixtures.rs, lod_tier_measurements.rs (5) | about 10 with allows, about 70 in the runtime form | engine/ | nothing found (see entry 11 under "Not settled") |
| S4 kernel src | 27-32 | kernel/src/bin/publish-bundle.rs, lib.rs, permission/boundary.rs, publish/mod.rs, skp.rs (5) | about 9 with allows, about 19 with the alias | kernel/ | 1c, for lib.rs. Can split: S4a without lib.rs now, S4b after 1c. |
| S5 kernel tests | 33-43, L35, L42 | kernel/tests/import_layout_factorial.rs, indexed_budgets.rs, publish.rs, scale_pass.rs, slice_budgets.rs, support/mod.rs, wire_bytes_invariant.rs (7) | about 24 with allows | kernel/ | nothing |
| S6 renderer | 44, 45 | renderer/src/canonical.rs, style.rs (2) | about 4 | crosses into renderer/ | 1c, for canonical.rs |
| S7 the step | none | .github/workflows/product-ci-rust.yml (1) | about 10-20 | crosses into the workflow | port-2; Q1 to Q4 |

- Total: about 100-125 lines over 30 files. One form over all of it passes the line bound but not the file bound.
- Order: S1, S2, S3; then `cargo clippy -p spatial-engine --all-targets -- -D warnings` should exit 0. Then S5 and S4a; then S4b and S6 after 1c; then S7.
- kernel's exit-0 needs engine and renderer clean first, because clippy lints them as workspace members. The JSON check in section 6 lets any slice go first.
- The alternative is one full form with both gates over S1 to S6, then S7. That choice is the architect's and the custodian's.

## 6. Tests

- **Every slice.**
  - At the slice's head, the JSON run, counted by the read's rule (state/consults/2026-11-07-clippy-deny-warnings-workspace-windows-read-tester-report.md:42 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3), lists no diagnostic whose primary span is in the slice's files, and nothing new elsewhere.
  - `cargo fmt --all -- --check` passes (.github/workflows/rust-fmt.yml:76 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3).
  - `cargo test --workspace --locked` passes at the reviewed head before any gate is dispatched (Part 1, item 4). Corrections follow item 3.
- **Mutations a fix must still catch:**
  - identity.rs:321 — `id_js_exact` written on the declared-not-verified path;
  - publish.rs:279 — the sidecar's `hashed` written true; :957 — `query_surface.available` written true;
  - publish_stream.rs:534 — one extent bound taken from the wrong coordinate;
  - filter_type_admission.rs:1267 — `is_some` flipped to `is_none`.
- **Row 2 (S1).** If the fold is taken, add a Boolean twin of `float32_costs_four_bytes_in_the_estimate`, whose mutation is Boolean dropped from the condition so it falls to the 8-byte catch-all at engine/src/stream.rs:2369-2373 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3. No current test catches that mutation.
- **Rows 8-11 (S2).** No committed test asserts the generator's bytes. The worker compares each generator's output at its seed before and after the change, as a one-off observation.
- **The guards (S3, S5).**
  - Under (i), the diff is one attribute line per guard.
  - Under (ii), one debug `--ignored --exact` run per guarded binary has to panic with rc 101 on its own message (the precedent is governance/forms/engine/LOD-RELEASE-GUARD-PREREGISTRATION.md:9, :27 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3). Its mutation is the `if` negated.
- **wire_bytes_invariant.** An attribute-only change. The recorded mutation (governance/forms/kernel/WIRE-BYTES-INVARIANT-TRACE-FLAG-RACE-PREREGISTRATION.md:149 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3) still applies.
- **S6, as a note only.** `the_no_exponent_promise_is_kept_by_refusing_what_it_cannot_express` (renderer/src/canonical.rs:312-326 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3) does not catch `..` becoming `..=`: nothing there tests exactly 1e15. It does catch a lower bound made exclusive (:325). That test is renderer's.
- No timing claim (docs/08).

## 7. Files and overlap

- **Against the in-flight list:**
  - `.github/workflows/product-ci-rust.yml` overlaps port-2 (S7 waits).
  - `kernel/src/lib.rs` and `renderer/src/canonical.rs` overlap 1c (S4b and S6 wait).
  - The other 27 files are disjoint from #292, area A, port-2, 1c and the docs lane. port-2's lod_tier_builder, cancellation, preflight and root tests are not lod_tier_measurements.rs, and no slice touches protocol/.
- **Queued, not in flight:** entry 7d edits kernel/src/bin/publish-bundle.rs (state/FILLER-QUEUE.md:24 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3), and entry 3 edits kernel/src/lib.rs (:11).
- **Owner's index lines after the merge:**
  - engine/README.md:557 and kernel/README.md:387: the piece's form or forms. If filed in one module, engine/README.md:559 or kernel/README.md:389 as well.
  - engine/README.md:537 and kernel/README.md:360: the last-verified clauses for those pointers.
  - kernel/README.md:381 gains `CreatedSource`, only under the alias route.
  - engine/README.md:567's `WATCH_BUFFER_BYTES` pointer stays true.
  - No interface, pin, limit or ADR line changes.
  - All @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3.
- **Out of scope, named only:** engine/src/stream.rs:2299-2304 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3 is `attr_row_bytes`'s doc, but it runs into the doc of `decode_dictionary_chunk_column` (:2305-2314), so rustdoc attaches it to the wrong fn.

## 8. Risks and red lines to name before drafting

- **What CI installs:** Q1 and Q2. **What CI runs:** Q3 and Q4. A workspace-level allow (section 2).
- **Accepted ADR and docs text:** none is edited.
  - Code the piece touches: ADR-017's domain (S6); ADR-019's ticket path (kernel/src/lib.rs:463-489 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3); ADR-004 Amendment 4's tests (S5).
  - docs/08_Testing.md:13-21 binds the guards.
  - docs/06_Rendering.md:21 is quoted at style.rs:8-9.
- **Records the piece makes stale, to be named, not edited:**
  - governance/forms/root/PORT-1-LINUX-L1-PREREGISTRATION.md:49, :66 ("A warning-free Linux build is not claimed."), :87;
  - governance/forms/kernel/WIRE-BYTES-INVARIANT-TRACE-FLAG-RACE-PREREGISTRATION.md:131;
  - all @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3.
- **Behaviour:** rows 2, 44 and L7; the public signature on row 32 under (b); the Windows FFI structs (L35, L42).
- **Main moves.** Code from port-2 and 1c, and #278/#279's off-Windows code (merged 2026-11-04, state/FILLER-QUEUE.md:21-22 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3, after the cloud run), is in neither list. The last slice re-reads at its own head.
- **Gating.** The architect and the custodian choose the route; product code borders "any property currently under test" (governance/AUTONOMY.md:327 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3) on row 2.

## Not settled

- Whether the runners' toolchains carry clippy (Q1).
- Why Windows reports no `dead_code` on the unread `peak_working_set` of the `#[repr(C)]` struct.
- Whether a comment silences `if_same_then_else`. I infer it only from the unflagged Int32/Float32 pair at engine/src/stream.rs:2356-2363 @ 0bd292637de7a4b628db92bf70df8b6e02c4d7c3.
- Whether an allow on a `#[tokio::test]` fn reaches the async body. I expect yes; the clippy run checks it.
- The cloud's own inference on row 35.
- Whether filler entry 11 edits lod_tier_measurements.rs.
- The branches' contents.
- The HEAD I read.

I have no shell and leave no background shell.

---

Result: impact read done. Slices S1-S3 and S5 can start now, with item-level allows recommended. S4b and S6 wait on 1c, and S7 waits on port-2 and four questions.
- Q1 (red line, what CI installs): product-ci-rust.yml:205 sets up the toolchain without a clippy component, and the repo cannot show that it carries clippy; would adding `components: clippy` fit "nothing installed"?
- Q2 (red line): `@stable` floats, so with `-D warnings` a new clippy release can turn main red without a commit. Accept that, or pin the version (a change to what CI installs)?
- Q3 (what CI runs): does the step run on both matrix entries, and on macOS too if port-2 adds a macOS entry?
- Q4: before the step lands, what shows the Linux workspace "passes": the step's own first CI run in its PR, or a cloud Linux clippy run at that head?

Report path: C:/dev/spatial-ide/state/consults/2026-11-07-clippy-deny-warnings-workspace-impact-read-lead-data.md
sha256: none given (I have no shell).
