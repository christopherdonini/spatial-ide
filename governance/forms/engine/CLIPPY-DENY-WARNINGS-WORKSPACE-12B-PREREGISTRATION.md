# engine: clippy 12b, the thirteen Windows diagnostics in seven engine test files removed, no behaviour, seeded draw or guard changed — five-line short form (`AUTONOMY.md` §21d)

*Committed before any code. Append-only once committed; an amendment written after any run of this piece's tests or mutations has been seen says so in its first line. PLAN node clippy-deny-warnings-workspace (S3), filler entry 12, placed by the human's ruling of 2026-11-06 (15:59Z) (`state/directives/2026-11-06-8e-words-replaced-u1-h1-h2-class-8-m10-kl-c1-c3-draft-marks-u12-mark-n1-n3-slot-2-order-clippy-placed-288-clicked.md`); its second lettered piece, 12b, by the architect's draft's OPEN-1 (A) (`state/consults/2026-11-07-clippy-deny-warnings-workspace-form-architect-draft.md`). The form, the notes, the OPEN items and what is not settled are lead-data's draft (`state/consults/2026-11-08-clippy-deny-warnings-workspace-12b-form-lead-data-draft.md`, read only at main 05824408; extracted sha256 1c68cde82eb5b2a2dd5c611a30b50654e3067898ed4528178ffd9e842ec83523), carried byte for byte with these changes, all the custodian's: each cite the draft writes `path:line @ 05824408…` is expanded by script to `path:line @ <commit> sha256:<the lines with their LFs>` (39 pins; 0 by a file name that resolves to one tracked path at that commit; 0 by a file name that resolves to more than one, kept as written; bare line numbers kept as written); this title and lead line added; the draft's opening paragraphs (its words note and its owner's-index line, which N7 repeats) and its closing lines (its no-sha256 line and its result block) dropped; the custodian's settlement added. Form path: `governance/forms/engine/CLIPPY-DENY-WARNINGS-WORKSPACE-12B-PREREGISTRATION.md`. The custodian keeps the PLAN node on main.*

## The form

Form path: `governance/forms/engine/CLIPPY-DENY-WARNINGS-WORKSPACE-12B-PREREGISTRATION.md`.
- The template does not set a path.
- governance/README.md:23 @ 058244086f9914525ea8e4761c7baa07ea4f6e62 sha256:1a043fffd97b3db90f07c55a43d498dbda72f522eca034adc375ab8ebd153978 puts a new form in `governance/forms/<folder>/`, where the folder is the first path segment of the code it is about. Here that is `engine`.
- governance/forms/ holds no index file: a Glob for `governance/forms/*.md` found none.
- 12a's form sits in the same folder.
- So the path stands as the brief gives it.

```
Authority: PLAN node `clippy-deny-warnings-workspace` (governance/PLAN.yaml:6634-6650 @ 058244086f9914525ea8e4761c7baa07ea4f6e62 sha256:5a50c2a23855f7c42ad82c07d815ca3cfeb0e3511f1dc4898e3713ca0d5ca6a6), filler queue entry 12 (state/FILLER-QUEUE.md:35 @ 058244086f9914525ea8e4761c7baa07ea4f6e62 sha256:e6a58cf9febec91952927b3ac943f9fb24cf66112c900aa0e3ae4289ab5a538d), its lettered piece 12b as the custodian names the split; placed by the human (state/directives/2026-11-06-8e-words-replaced-u1-h1-h2-class-8-m10-kl-c1-c3-draft-marks-u12-mark-n1-n3-slot-2-order-clippy-placed-288-clicked.md:22 @ 058244086f9914525ea8e4761c7baa07ea4f6e62 sha256:5e39a328d5231c5a72ea22dbfda1ae186fc9903fb8e4037ff874d1f530674385); run in the filler slot under AUTONOMY.md §36 (governance/AUTONOMY.md:692 @ 058244086f9914525ea8e4761c7baa07ea4f6e62 sha256:1135b89c01d0e676bce0bc42a4d6710af445fa0ae95ed12ef6ca0fef7a4d4e84): a five-line form under §21c's size, the reviewer and the architect gating from dispatch; its slicing and outline are the architect's draft (state/consults/2026-11-07-clippy-deny-warnings-workspace-form-architect-draft.md, sections 1, 2, 3 and 6), whose OPEN-1 (A) this piece takes under the human's direction of 2026-10-31 (state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md, item 4); the guards' form (i) is that draft's section 3; evidence, not Authority: the Windows read's rows 7-11 and 18-25 (state/consults/2026-11-07-clippy-deny-warnings-workspace-windows-read-tester-report.md:54-58, :65-72 @ 058244086f9914525ea8e4761c7baa07ea4f6e62), 12a's gate 1 reviewer's count of the thirteen rows outside 12a at its base and head (state/consults/gates/2026-11-08-clippy-deny-warnings-workspace-12a-gate1-reviewer.md:95-109 @ 058244086f9914525ea8e4761c7baa07ea4f6e62 sha256:6604c5d455767151d7a3a6b911fda77782138ae493ac5688b01cdd1aa2403876) and lead-data's impact read (state/consults/2026-11-07-clippy-deny-warnings-workspace-impact-read-lead-data.md, sections 1, 3 and 6); the guard-run precedent governance/forms/engine/LOD-RELEASE-GUARD-PREREGISTRATION.md (its Tests+mutation line and its closing commit's item 2); drafted by lead-data, read at main 058244086f9914525ea8e4761c7baa07ea4f6e62; reuse index: four misses, no prior art recorded for "clippy deny warnings workspace" or "lint warnings ci step" (the architect's draft's two) or for "clippy assertions on constants" or "seeded generator draw order" (tools/reuse.mjs in the reuse clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c, exit 1 each, run by the custodian).
Scope: engine/tests/admission_p4_corpus.rs (row 7); engine/tests/admission_property_campaign.rs (rows 8, 9, 10, 11); engine/tests/import_layout_5gb_digest.rs (row 18); engine/tests/import_layout_5gb_fixtures.rs (rows 19, 20, 21); engine/tests/import_layout_digest.rs (row 22); engine/tests/import_layout_fixtures.rs (row 23); engine/tests/lod_tier_measurements.rs (rows 24, 25); 7 files; declared line budget 60, counted as insertions plus deletions over non-generated code and tests under §21c's rule, this form excluded, by `git diff --numstat origin/main...HEAD -- engine/tests/admission_p4_corpus.rs engine/tests/admission_property_campaign.rs engine/tests/import_layout_5gb_digest.rs engine/tests/import_layout_5gb_fixtures.rs engine/tests/import_layout_digest.rs engine/tests/import_layout_fixtures.rs engine/tests/lod_tier_measurements.rs` at a named commit (estimate 22).
Change: the thirteen clippy diagnostics whose primary spans are in these files on Windows (rows 7-11 and 18-25 of the Windows read, re-read at main 058244086f9914525ea8e4761c7baa07ea4f6e62, none moved) are removed: row 7 (`large_enum_variant`) by `#[allow(clippy::large_enum_variant)]` on `enum Observed`, its variants byte-identical; rows 8 and 10 (`explicit_auto_deref`) by dropping the `*`; row 9 (`format_in_format_args`) by inlining the inner `format!` into the outer one, its two arguments placed last in their own order, so that the text and the seeded draws are unchanged; row 11 (`double_ended_iterator_last`) by `.next_back()` for `.last()`, and, only if the head JSON run lists a row at that site, by `.rfind(|&b| b <= end)` for the `.filter(..)` and `.last()` lines (the declared fallback, recorded in the report); rows 19-20 (`needless_borrow`) by `log.as_str()` for `&log as &str`; rows 18 and 21-25 (`assertions_on_constants`) by `#[allow(clippy::assertions_on_constants)]` on each enclosing fn (`the_5gb_cross_file_digest_correctness_pass`, `generate_the_5gb_fixture_set`, `the_cross_file_digest_correctness_pass`, `generate_the_145mb_fixture_matrix`, `wall_time_arm_s_and_arm_p_over_polygons_100k`, `five_gb_build`), each guard's expression and message byte-identical. After the change, the JSON run lists no diagnostic whose primary span is in these files, and lists the rows outside them as at the base; no behaviour, seeded draw, signature, value, test name, assertion, guard, `#[ignore]` string or message changes.
Tests+mutation: no test is added. Changed test code: `enum Observed` (row 7, an attribute); the generators `ws`, `leaf` and `splice` (rows 8-11), which `filter_admission_property_campaign` and `a_join_of_clauses_each_admitted_alone_returns_their_intersection_and_its_subsets_admit` draw from; `ensure` in import_layout_5gb_fixtures.rs (rows 19-20, the same bytes written); six fns gaining one attribute line each (the guards). Draw-order observation, never committed: one scratch `#[test] #[ignore]` fn, the same bytes at the base and the head (its sha256 recorded), is appended to engine/tests/admission_property_campaign.rs. It replays `filter_admission_property_campaign`'s per-case draws for G1 to G4 at their committed seeds and case counts, without admission, and writes one line per case (2500 lines) to a file outside the repository. It is run at the base before any edit and at the head after the commit, and each time reverted with `git checkout -- engine/tests/admission_property_campaign.rs` and `git status --porcelain` shown empty. Predicted: the two outputs' sha256 are equal; a difference with no mutation applied is a stop. M9, at the head with the scratch fn appended: row 9's format string becomes `"({} {} {}) {} {} {6} {5}"` and its two trailing arguments are swapped, so the text keeps its order and the two draws are reversed. Predicted: the output's sha256 differs from the head's. It is then reverted, with porcelain shown empty. A survival of M9 is class 2 and a coverage finding, not a stop: the fix's order is read from the diff. Guard runs, after `cargo test --locked -p spatial-engine --no-run` has built the debug test binaries: for each guarded site, one debug run of one test that reaches it, `timeout 300 cargo test --locked -p spatial-engine --test <file> <test> -- --ignored --exact`, with these pairs: import_layout_5gb_digest `the_5gb_cross_file_digest_correctness_pass`; import_layout_5gb_fixtures `generate_the_5gb_fixture_set`; import_layout_digest `the_cross_file_digest_correctness_pass`; import_layout_fixtures `generate_the_145mb_fixture_matrix`; lod_tier_measurements `wall_time_arm_s_and_arm_p_over_polygons_100k`; lod_tier_measurements `wall_time_arm_s_over_parcels_5gb` (through `five_gb_build`). Each is expected to exit with rc 101, panicking at its guard's `assert!` on that guard's own message. This shows that the refusal stands; it is not a mutation, and any other exit (124 included) is a stop. Every failing line the report quotes is copied whole from the run's output file, the thread id included. At the head: `cargo clippy --locked -p spatial-engine --all-targets --message-format=json` exits 0 and, counted by the Windows read's rule, lists no row in the Scope files and the rows outside them as at the base; recorded, not claimed: `cargo clippy --locked -p spatial-engine --all-targets -- -D warnings` and its exit code (0 expected on Windows); `cargo fmt --all -- --check` exits 0; `cargo test --workspace --locked` passes.
Out-of-scope: ADR: none (no status, text, note or amendment; the campaign is evidence for ADR-021's admission boundary, and its seeded inputs are shown unchanged by the draw-order observation). Security: none (nothing ADR-020, ADR-009 or ADR-021 governs is touched; no product file). Wire: none (no SKP, data-plane or MCP file). Guarantee: none (every guard that refuses a debug build is byte-identical under its allow, no harness is run in release, no recorded figure or fixture hash changes, every assertion and message is unchanged, no test is renamed). §25 (e) is set aside for a filler by §36. No new dependency, no `unsafe`, no new string, no new `pub` item, no new cfg site, no `[lints]` table, no clippy.toml; Cargo.toml and Cargo.lock unchanged.
```

---

## Notes (mine)

### N1. Each row at main, re-read by content

The Windows read pinned fbc905ec, the architect's draft 4cbcab1e and my impact read 0bd29263. 8f (#294) and 8g (#297) merged after them. 12a's reviewer observed these thirteen rows by clippy at 12a's base 72842b52 (after both merges) and at its head, at the same lines (state/consults/gates/2026-11-08-clippy-deny-warnings-workspace-12a-gate1-reviewer.md:101-109 @ 058244086f9914525ea8e4761c7baa07ea4f6e62 sha256:19cc1885d4b43b403ff3681050143e811330711c333d04f94cf94bb4dba3bc52). 12a touches none of the seven files (its check 1, :49 of the same report). I re-read each site at 058244086f9914525ea8e4761c7baa07ea4f6e62 and every row sits at the Windows read's line, so none moved. The code blocks below are byte-copied from my Read results. Each "holds" is my reading, not a clippy run.

**8f and admission_p4_corpus.rs.**
- 8f's form names this file only in its §2.5 REFUSED route, as one arm in `code_of` (governance/forms/engine/SINGLE-FILE-BRACKET-NAME-REFUSED-AS-PARTITIONED-PREREGISTRATION.md:119-124 @ 058244086f9914525ea8e4761c7baa07ea4f6e62 sha256:d7f2f839ea3f149d6b4dffbb890473b8fda4d75333424f09ede466cab667c62a).
- At main, `refusal_code` (engine/tests/admission_p4_corpus.rs:393-412 @ 058244086f9914525ea8e4761c7baa07ea4f6e62 sha256:aa1de8a526eef19bc6f6e1d85a615076ec9fb84a059551cd164167d47655c452) maps no new variant, and a Grep for "bracket" or "escape" in the file finds nothing.
- Entry 13's summary says that 8f routes the index sites "through its escaping" (governance/PLAN.yaml:6819 @ 058244086f9914525ea8e4761c7baa07ea4f6e62 sha256:1ec4affe7021a50e47bec687011d6abd221983c3cdfe904f5e52d012465817a0).
- So, by my reading, 8f took another route and did not edit this file. Row 7 stands where the reviewer observed it.

**Row 7, `large_enum_variant`, engine/tests/admission_p4_corpus.rs:363 @ 058244086f9914525ea8e4761c7baa07ea4f6e62 sha256:d1fabc9a67d18299bed28b3aafb3d3df99bc854dee072646a44ce67b048239bf.** Not moved. Byte-copied:
```
enum Observed {
```
- `Admitted` (:364-381) holds six `String`s, four `Option<String>`s and one `&'static str`. That is about 256 bytes on x86-64, against `Refused`'s two `String`s (:382-385). By my reading the difference is over clippy's 200-byte default, so the row holds.
- Fix: one line, `#[allow(clippy::large_enum_variant)]`, inserted directly above :363 (below the blank line :362). The variants stay byte-identical.

**Row 8, `explicit_auto_deref`, engine/tests/admission_property_campaign.rs:218 @ 058244086f9914525ea8e4761c7baa07ea4f6e62 sha256:cbb9b9a4e923f96b8793f9b4adf72cf24d157c3e4e80ecc60ec4a87b789c6bd6.** Not moved. Byte-copied (:217-219):
```
fn ws(r: &mut Rng) -> &'static str {
    *r.pick(&[" ", " ", " ", "  ", "\t", "\n", " \n "])
}
```
- `pick` returns `&'a T` (:106-108). The return position is a coercion site, and the array of literals is promoted to `'static`. So, by my reading, dropping the `*` yields the same `&'static str` and the row holds.
- Fix: `    r.pick(&[" ", " ", " ", "  ", "\t", "\n", " \n "])`. It is the same single `pick` call, so it makes the same draw.

**Row 9, `format_in_format_args`, engine/tests/admission_property_campaign.rs:270-278 @ 058244086f9914525ea8e4761c7baa07ea4f6e62 sha256:061c0a555dc4ae61a9d5df964be0f96d3a5ff5e99c09b9b75ab1e2b1290dbc6c.** Not moved. It is arm 10 of `leaf` (:221). Byte-copied:
```
        10 => format!(
            "({} {} {}) {} {} {}",
            r.pick(NUM_COLS),
            r.pick(&["+", "-", "*", "/"]),
            num_lit(r),
            r.pick(&["*", "+"]),
            r.below(5) + 1,
            format!("{} {}", r.pick(&["<", ">", "="]), num_lit(r))
        ),
```
- Fix (my words, not copied):
```
        10 => format!(
            "({} {} {}) {} {} {} {}",
            r.pick(NUM_COLS),
            r.pick(&["+", "-", "*", "/"]),
            num_lit(r),
            r.pick(&["*", "+"]),
            r.below(5) + 1,
            r.pick(&["<", ">", "="]),
            num_lit(r)
        ),
```
- **The draw order holds, by my reading of the language.** A format macro evaluates each argument once, in argument-list order, before it formats anything. The inner `format!` was the last argument, so it ran after `r.below(5) + 1` and drew its own two arguments left to right. Both forms therefore draw the same seven expressions in the same order.
- **The text holds.** The outer template ends `{} {} {}` with the inner result `{} {}` in its last slot, so it renders the same bytes as one template ending `{} {} {} {}`.
- **Lints.** None of the arguments is a plain identifier, so by my reading `uninlined_format_args` has nothing to flag. rustfmt keeps the call vertical, as now, because the arguments are far wider than its call-width heuristic.
- **Another record stays true.** The column still comes first, so the record that "leaf 10 always puts a column in the arithmetic" stays true. That record pins this span as history (governance/forms/engine/LITERAL-ONLY-FLOAT-INTEGER-ARITHMETIC-REFUSED-PREREGISTRATION.md:228 @ 058244086f9914525ea8e4761c7baa07ea4f6e62 sha256:78f1844e52ad888b98c4ea58748e6f49ca61817ab878375d9c0f9380c5ee927b, its pin at 8b9193a1).

**Row 10, `explicit_auto_deref`, engine/tests/admission_property_campaign.rs:543 @ 058244086f9914525ea8e4761c7baa07ea4f6e62 sha256:942311f47185af677c0e06d91e1e3ca7585b5cfb82a8a69ff1044dd79aa1dac0.** Not moved. It is in `splice` (:536). Byte-copied:
```
                let t: &str = *r.pick(SPLICE_TOKENS);
```
- The `&str` annotation makes this a coercion site, so the row holds. The unannotated `*r.pick(..)` lines elsewhere (:226, :239, :248, :540) are not coercion sites, which is why the read does not list them.
- Fix: `                let t: &str = r.pick(SPLICE_TOKENS);`. It makes the same draw.

**Row 11, `double_ended_iterator_last`, engine/tests/admission_property_campaign.rs:556-561 @ 058244086f9914525ea8e4761c7baa07ea4f6e62 sha256:d7c2623621289fbe3c9a725b0fa60b79b59f42a31994798114685280845c99e9.** Not moved. Byte-copied (:555-561):
```
                let end = (at + r.below(8)).min(s.len());
                let end = boundaries
                    .iter()
                    .copied()
                    .filter(|&b| b <= end)
                    .last()
                    .unwrap_or(at);
```
- Fix: :560 becomes `                    .next_back()`.
- It is equivalent. The closure is pure and reads only `end`, and `Filter::next_back` returns the last element that passes, which is the element `.last()` returns. No draw sits in the chain: the `r.below(8)` at :555 is unchanged.
- rustfmt keeps the chain vertical, because the one-line chain is still wider than its chain-width heuristic. That is my reading.
- **Not settled:** whether this clippy's `filter_next` also reports `.filter(..).next_back()`. If it does, the head JSON shows a new row at :556. The form declares the fallback, `.rfind(|&b| b <= end)` in place of the `.filter(..)` and `.last()` lines, which is equivalent for the same reason. That is OPEN-A.

**Rows 19 and 20, `needless_borrow`, engine/tests/import_layout_5gb_fixtures.rs:318 and :326 @ 058244086f9914525ea8e4761c7baa07ea4f6e62.** Not moved. Both are in `ensure` (:258), whose `log` is `&mut String` (:265). Byte-copied (:316-319; :324-327 are the same four lines):
```
            std::fs::write(
                evidence_dir().join("import-layout-5gb-fixtures.log"),
                &log as &str,
            )
```
- Fix at each site: `                log.as_str(),`. It is the same `&str` of the same `String`, so `std::fs::write` writes the same bytes.
- The replacement is 12 characters, the same as `&log as &str`, so rustfmt keeps the call's layout. That is my reading.

**The six guards, `assertions_on_constants`.** None moved. Each is the first statement of its fn. Byte-copied:

Row 18, engine/tests/import_layout_5gb_digest.rs:394-398 @ 058244086f9914525ea8e4761c7baa07ea4f6e62 sha256:ff82b80f01af06015d3da42736baa297d315f9c9239c788079c253e5da50aae2 (its `#[test]` and `#[ignore = …]` at :391-393):
```
fn the_5gb_cross_file_digest_correctness_pass() {
    assert!(
        !cfg!(debug_assertions),
        "this phase's digests are compared for exact equality across files. Run with --release."
    );
```
Row 21, engine/tests/import_layout_5gb_fixtures.rs:337-342 @ 058244086f9914525ea8e4761c7baa07ea4f6e62 sha256:32ce75948472dccb94f371d65e931070372fc1d4cbd207534f3ff81dbfceaefb (attributes at :334-336):
```
fn generate_the_5gb_fixture_set() {
    assert!(
        !cfg!(debug_assertions),
        "this phase writes/verifies fixtures other phases score against; a debug build's numbers \
         are not measurements. Run with --release."
    );
```
Row 22, engine/tests/import_layout_digest.rs:460-466 @ 058244086f9914525ea8e4761c7baa07ea4f6e62 sha256:ecb5f1a2f76f73cb0955bf6d77cde0d3cb7767445d5e7c9f5c6e311080c3f7bf (attributes at :457-459):
```
fn the_cross_file_digest_correctness_pass() {
    assert!(
        !cfg!(debug_assertions),
        "this phase's digests are compared for exact equality across files; nothing here is a \
         timing, but every other pass in this family refuses a debug build on principle. Run with \
         --release."
    );
```
Row 23, engine/tests/import_layout_fixtures.rs:246-251 @ 058244086f9914525ea8e4761c7baa07ea4f6e62 sha256:84edbf3667f5a8871d0be68764e8b76297547989f51a9482ef7eccbd9c4612d7 (attributes at :244-245):
```
fn generate_the_145mb_fixture_matrix() {
    assert!(
        !cfg!(debug_assertions),
        "this phase writes fixtures other phases hash and time; a debug build's numbers (even the \
         elapsed-time-only ones reported here) are not measurements. Run with --release."
    );
```
Row 24, engine/tests/lod_tier_measurements.rs:252-257 @ 058244086f9914525ea8e4761c7baa07ea4f6e62 sha256:7f5dc3b8e515d34296970b7f6158ad7bc5c03e905d4524c5fd76552505af2848 (attributes at :248-251):
```
fn wall_time_arm_s_and_arm_p_over_polygons_100k() {
    assert!(
        !cfg!(debug_assertions),
        "this test measures build wall time; a debug build's numbers are not measurements, and \
         every other pass in this family refuses a debug build on principle. Run with --release."
    );
```
Row 25, engine/tests/lod_tier_measurements.rs:485-491 @ 058244086f9914525ea8e4761c7baa07ea4f6e62 sha256:78d5827e51f112b90cc2a0b0dcb29d94e00594bbea6aa6b3b213f03e29e48e7d (a helper with no attributes; its callers are at :338-339, :349-350 and :369-370):
```
fn five_gb_build(workers: usize, label: &str, verify: bool) {
    assert!(
        !cfg!(debug_assertions),
        "this helper is called by both wall-time measurements and an O1-O4 outcomes pass at 5 GB \
         scale; a debug build's wall time is not a measurement, and every other pass in this \
         family refuses a debug build on principle. Run with --release."
    );
```
- Fix: one line, `#[allow(clippy::assertions_on_constants)]`, directly above each `fn` line (after the `#[ignore = …]` attribute, where there is one). It follows the architect's form (i) (state/consults/2026-11-07-clippy-deny-warnings-workspace-form-architect-draft.md:235-239 @ 058244086f9914525ea8e4761c7baa07ea4f6e62 sha256:03d84cb00f1e09dd7f8c5a5775e1ea264021fe955d9fa471c520ae2801f32665).
- No precedent exists for an allow on a `#[test]` fn. The kernel precedents sit on helpers (kernel/tests/scale_pass.rs:733, kernel/tests/scale_pass_a6.rs:508 @ 058244086f9914525ea8e4761c7baa07ea4f6e62 sha256:5d613f6b937ab4074dbd4f69122448ab405955d1fa8868c2f11307140631e48c). By my reading, a lint emitted inside the fn body takes the fn's level, through the `assert!` expansion as well.

**New diagnostics since the read: not settled.** 12a's head JSON lists exactly these thirteen engine rows and no others (the reviewer's :98-109). Whether anything merged since 72842b52 adds one is settled by the worker's base run (OPEN-D).

### N2. The route

- **Files:** 7, which meets §21c's 8 (governance/AUTONOMY.md:350 @ 058244086f9914525ea8e4761c7baa07ea4f6e62 sha256:98f827948981d936522d9c9273e457c2f4f7e5e622aa917afc6fb73e0edf01f9).
- **Lines,** my estimate, insertions plus deletions with tests counted (:357):

| File | Rows | Lines |
|---|---|---|
| admission_p4_corpus.rs | 7 | 1 |
| admission_property_campaign.rs | 8 (2), 9 (5: 2 deleted, 3 inserted), 10 (2), 11 (2) | 11 |
| import_layout_5gb_digest.rs | 18 | 1 |
| import_layout_5gb_fixtures.rs | 19-20 (4), 21 (1) | 5 |
| import_layout_digest.rs | 22 | 1 |
| import_layout_fixtures.rs | 23 | 1 |
| lod_tier_measurements.rs | 24, 25 | 2 |
| **Total** | | **22** (23 under row 11's fallback) |

- The declared budget stays at the outline's 60 (the architect's draft :94). An overrun is class 6 (docs/PREREGISTRATION-TEMPLATE.md:125-131 @ 058244086f9914525ea8e4761c7baa07ea4f6e62 sha256:de5406a708458da2c3def1e4b685acd5dacb5aac5ea87f694d49090f7d6e48c9).
- **The other bounds** of §21c and §21a: no new exposure surface, no new dependency, no new user-visible behaviour, and none of §21a's four categories (governance/AUTONOMY.md:317-327 @ 058244086f9914525ea8e4761c7baa07ea4f6e62 sha256:436349471dc7ff504a46e7463ba78749089a99588938555b91e7b2f7d1d8fd6b).
- **The nearest category** is "any property currently under test", through two things:
  - The guards' debug refusal: it stays byte-identical under an attribute, and the guard runs show it stands.
  - The campaign's seeded inputs: the draw-order observation shows them unchanged.
- **So a five-line form fits.** The smallest true reading is 7 files and about 22 lines.
- **Gates:** the reviewer and the architect from dispatch, under §36 (:692), with §25 (e) set aside. The grade is S3. There is no string a user sees and no red-line text.
- **Scope is not trimmed.** It is the slicing's seven files (the architect's draft :30). The owner's-index file is not an option (N7).

### N3. Tests and observations, re-checked at main

**The generators the observation covers** (engine/tests/admission_property_campaign.rs @ 058244086f9914525ea8e4761c7baa07ea4f6e62):
- The seeds and case counts are at :62-79: `G1_SEED`/`G1_CASES` 500, `G2_SEED` 900, `G3_SEED` 900 and `G4_SEED` 200. `FIXTURE_SEED` is not a draw stream.
- `Rng` and its `pick`, which returns `&'a T`, are at :87-109.
- The campaign loop draws, per case, the predicate (:1069-1086) and then the five stream parameters and the projection (:1087-1097).
- Row 8 (`ws`) is reached by `gen_expr`'s arms 0 and 1 (:292-307), so through G1, G2 and G3.
- Row 9 is `leaf`'s arm 10, which G1 and every G1 fragment reach.
- Rows 10 and 11 are in `splice`, which only G3 reaches (:1080-1084).
- `a_join_of_clauses_each_admitted_alone_returns_their_intersection_and_its_subsets_admit` (:1412) draws from `gen_expr` with `P5_SEED` (:1289), but its draws depend on admission outcomes. By my reading, `gen_expr` shown unchanged as a function of the generator state over G1 to G3 covers it, so P5 is left out of the replay.

**The scratch fn (shape mine; the worker writes it, and its bytes are recorded by sha256):**
- One `#[test] #[ignore = "scratch, never committed"]` fn, `scratch_draw_digest`, appended after the file's last line (:1486).
  - The name has none of verify-test-claims' narrative prefixes (scripts/plan/verify-test-claims.mjs:15-18 @ 058244086f9914525ea8e4761c7baa07ea4f6e62 sha256:9d0555b7716941d6f65541f1af323920c11db226d1bdbc14d4e28b9a14742af6), so no record's check meets it.
- For G1 to G4 in the campaign's order, with each one's seed and case count, it creates `Rng::new(seed)` and, per case:
  - draws the predicate exactly as :1069-1086, with `render(t, &e, "<c>")` in place of the canary path, a constant that is the same at the base and the head;
  - then draws `r.below(1000)` twice, `r.below(700)` twice, the `limit` pick and the `PROJECTABLE` filter (:865) in the order of :1088-1097;
  - writes one line: the generator name, the case number, the predicate's Debug form, the four draws, the limit and the projection.
- It writes all 2500 lines to the path in `SCRATCH_DRAWS`, a file outside the repository.
- Run: `SCRATCH_DRAWS=<file> cargo test --locked -p spatial-engine --test admission_property_campaign scratch_draw_digest -- --ignored --exact`, expected rc 0. Recorded: each output's sha256 and line count.

**Where it is applied, and the sequence:**
1. **The base:** origin/main at dispatch, after #300 merges, before any edit. Append the fn, run, record B, then `git checkout -- engine/tests/admission_property_campaign.rs` and show porcelain empty.
2. **The head:** the committed 12b head. Append the same bytes, run, record H.
3. **M9,** with the fn still appended: row 9's format string becomes `"({} {} {}) {} {} {6} {5}"`, and its last two arguments are swapped to `num_lit(r),` then `r.pick(&["<", ">", "="])`. The five implicit `{}`s take 0 to 4, so the text renders the cmp and then the number, as before, while the draws run number first. Run, record H-M9, then check out the file (removing both the mutation and the fn) and show porcelain empty.
- The appended fn's context is the file's end, which no fix touches. So the same bytes apply at both commits.

**Predicted:**
- B equals H by sha256, each with 2500 lines. A difference with no mutation applied is a stop: the architect's invalidator (the draft :256).
- H-M9 differs from H. My reading: every case that reaches arm 10 swaps a `below(3)` value with `num_lit`'s draws, and G1 alone has 500 cases.
- If M9 survives, that is class 2 and a coverage finding. The observation would then be blind to a draw swap that keeps the text order. Row 9's fix stands, because the diff shows the same seven expressions in the same order, and the gate reads that from the diff.
- **Why this M9 rather than the outline's plain swap** (OPEN-B): a swap that also reverses the text is caught by any check on the text. A draw swap that keeps the text order is the slip row 9 could make unseen.

**The guard runs** (the outline's, after the precedent governance/forms/engine/LOD-RELEASE-GUARD-PREREGISTRATION.md:9, :27 @ 058244086f9914525ea8e4761c7baa07ea4f6e62):
- Build first: `cargo test --locked -p spatial-engine --no-run`, rc 0. This way no 300 s timeout covers a build.
- Then each run below is `timeout 300 cargo test --locked -p spatial-engine --test <file> <test> -- --ignored --exact`, expected rc 101, with the panic at the guard's `assert!`. The message spans are byte-copied sub-line spans of the source lines cited, each from a message's first source line. My reading of Rust's `\` continuation is that each span appears unbroken in the printed message.

| Site | `--test` | Test | Message span | Source line |
|---|---|---|---|---|
| 18 | import_layout_5gb_digest | `the_5gb_cross_file_digest_correctness_pass` | `this phase's digests are compared for exact equality across files. Run with --release.` | engine/tests/import_layout_5gb_digest.rs:397 |
| 21 | import_layout_5gb_fixtures | `generate_the_5gb_fixture_set` | `this phase writes/verifies fixtures other phases score against; a debug build's numbers` | engine/tests/import_layout_5gb_fixtures.rs:340 |
| 22 | import_layout_digest | `the_cross_file_digest_correctness_pass` | `this phase's digests are compared for exact equality across files; nothing here is a` | engine/tests/import_layout_digest.rs:463 |
| 23 | import_layout_fixtures | `generate_the_145mb_fixture_matrix` | `this phase writes fixtures other phases hash and time; a debug build's numbers (even the` | engine/tests/import_layout_fixtures.rs:249 |
| 24 | lod_tier_measurements | `wall_time_arm_s_and_arm_p_over_polygons_100k` | `this test measures build wall time; a debug build's numbers are not measurements, and` | engine/tests/lod_tier_measurements.rs:255 |
| 25 | lod_tier_measurements | `wall_time_arm_s_over_parcels_5gb` (via `five_gb_build`) | `this helper is called by both wall-time measurements and an O1-O4 outcomes pass at 5 GB` | engine/tests/lod_tier_measurements.rs:488 |

(All source lines @ 058244086f9914525ea8e4761c7baa07ea4f6e62.)
- An exit of 124 or 0, or a panic elsewhere, is a stop: the architect's invalidator "A guard not refusing a debug build" (the draft :257).
- **Quotes.** The report quotes each panic line whole, as printed, thread id included. A span cut from a line is marked with `…`, and the whole line is given beside it (12a's reviewer D2, state/consults/gates/2026-11-08-clippy-deny-warnings-workspace-12a-gate1-reviewer.md:24-29 @ 058244086f9914525ea8e4761c7baa07ea4f6e62 sha256:6044ade47b4f0ab6a47cb5cd965cd43369d1640ad3dd1452e86019ff9e3858ae).

**No mutation, read from the diff or proven by the type checker:**
- Row 7 and the six guards: one attribute line each over byte-identical code.
- Rows 8, 10 and 19-20: proven by the type checker.
- Row 11: its equivalence is also observed, because G3's lines are in the digest.

**The recorded -D command:**
- At the head: `cargo clippy --locked -p spatial-engine --all-targets -- -D warnings`. Its exit is recorded, with 0 expected on Windows. By my count, 12a and 12b together cover all 26 engine rows of the Windows read.
- engine has no path dependency on another workspace member (engine/Cargo.toml:22-91 @ 058244086f9914525ea8e4761c7baa07ea4f6e62 sha256:e55a5dd0863761730fbdcfc7da052b02ea1e267541ca46c46ba44bee5eb79aa2; engine/README.md:554 @ 058244086f9914525ea8e4761c7baa07ea4f6e62 sha256:616aacf09bb327beec4e913a95020c1e40db624fb400a1987e1073ace4d0f0d2). So the outline's case, a nonzero exit caused by a dependency outside the Scope, cannot arise here. That settles, for 12b, the architect's open question about path dependencies under `-p` (the draft :385).
- A nonzero exit caused only by a row in an engine file outside the seven is recorded and reported under OPEN-D. It is not a claim of this piece (OPEN-C).

### N4. Verification

Every cargo call runs inside a shared hold; under §36 a filler takes a shared hold only.

**At the base:**
1. `git rev-parse HEAD`, `cargo clippy --version` and `rustc -V`, rc 0 each.
2. `cargo clippy --locked -p spatial-engine --all-targets --message-format=json`, stdout to a file outside the repository, rc 0.
   - It is counted by the Windows read's rule (state/consults/2026-11-07-clippy-deny-warnings-workspace-windows-read-tester-report.md:42 @ 058244086f9914525ea8e4761c7baa07ea4f6e62 sha256:d17cd24e318ed4728e8b4f79bd1f57ab78bdbed76b78aa520abbad2a098e4832).
   - Expected: 13 distinct rows, all in the seven files at the lines in N1, and 0 outside them.
   - Any row in a Scope file that N1 does not list stops the piece before code (OPEN-D).
3. The draw digest B (N3).

**At the head:**
1. The same JSON run: rc 0, zero rows in the seven files, and the rows outside them equal to the base's by (lint, file, span, message). A row at :556 sends row 11 to its declared fallback, recorded, and the run is repeated.
2. `cargo clippy --locked -p spatial-engine --all-targets -- -D warnings`: its rc recorded.
3. `cargo fmt --all -- --check`: rc 0.
4. `cargo test --workspace --locked`: rc 0, in one shared hold (Part 1, item 4).
5. `cargo test --locked -p spatial-engine --no-run`, then the six guard runs: rc 101 each, on their message spans.
6. Draw digest H, then M9, each reverted, with porcelain empty after.
7. `git diff --numstat origin/main...HEAD` and `--name-only`: exactly the seven files, total 60 or less.
8. Governance checks as CI runs them, rc 0 each:
   - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`
   - `node scripts/plan/verify-cites.mjs`
   - `node scripts/plan/verify-quotes.mjs`
   - `node scripts/plan/verify-test-claims.mjs`
   - `node scripts/plan/verify.mjs`
   - `node scripts/plan/forms-layout.mjs`

**The gates re-run at the reviewed head:**
- the full suite (Part 1, item 9: the reviewer does not yet rely on CI);
- the clippy JSON run and the -D command;
- the draw digest at the base and the head, and M9 (mutation observations stay the gates' own, item 9);
- the six guard runs.

**Not claimed:** a workspace `-D warnings` exit 0 (12d's), anything on Linux or macOS, and any timing.

### N5. What must not change

- **Files:** every file outside the seven, including:
  - engine/README.md (N7);
  - 12a's eight files;
  - every engine/src, kernel/, renderer/ and protocol/ file;
  - engine/LOD-RESULTS.md and kernel/RESULTS.md;
  - Cargo.toml and Cargo.lock.
- **In the seven files:**
  - the variants of `Observed`;
  - every seed, case count and constant (:62-79, :865 and the harness constants);
  - `Rng`;
  - every generator's draws and text;
  - every test name, assertion, `#[test]` and `#[ignore = …]` string;
  - every guard's expression and message;
  - the bytes `ensure` writes;
  - `PARCELS_5GB`, `MIN_FREE_BYTES` and `SAMPLES_100K`;
  - every `KNOWN_SHA256` table;
  - every path a harness asserts or writes.
- **No new cfg site:** these files carry `cfg!(debug_assertions)` only.
- **No harness re-run** in release, and no recorded figure changed.
- **Pins elsewhere:** the in-code cites into these files point above every insertion and stay true (engine/src/lod.rs:171, engine/tests/lod_tier_measurements.rs:46, engine/tests/lod_tier_builder.rs:1367 @ 058244086f9914525ea8e4761c7baa07ea4f6e62 sha256:216675e7c5c85171d766ace6eef4beb4bde6a8e835dceb720739440d93b89d2e). The form records that cite lines in these files are historical pins. They are named, not edited.

### N6. Rule (00) at main 058244086f9914525ea8e4761c7baa07ea4f6e62

- **12b's paths:** the seven files, this form, and the custodian's PLAN.yaml and FILLER-QUEUE.md edits. None of them is under protocol/, a wire fixture, Cargo.lock or package-lock.json.
- **Branches:** filtered to the seven files and protocol/, by the brief's `git diff --name-only origin/main...<branch>` lists, none of the six branches touches these paths:
  - `cut/port-2-macos-l1-and-app-dirs`
  - `cut/b2-piece-1c-save-and-reopen`
  - `cut/b1-shell-half-pr-c`
  - `cut/publish-filter-sentence-mark-comment-and-adr-024-note` (#298)
  - `cut/publish-filter-sentence-e2e-shown-case` (#299)
  - `cut/clippy-deny-warnings-workspace-12a` (#300)
- **Result:** disjoint by those lists. One filler runs at a time, so no 12b code starts before #300 merges.
- **Entry 11** (governance/PLAN.yaml:4227-4243 @ 058244086f9914525ea8e4761c7baa07ea4f6e62 sha256:9900519e13062e07dbbc1a01e4a81a7253dc74483a70307cd94a0fb4b50adf8c) has no form.
  - Its summary names lod_tier_builder.rs's `clear_tier_directory`.
  - lod_tier_measurements.rs has its own `tier_directory` and `clear_tier_directory` over the machine-wide folder (:66-80 @ 058244086f9914525ea8e4761c7baa07ea4f6e62). By my reading, entry 11's form may reach this file.
  - The queue order puts entry 11 first once port-2 merges. Whichever of the two runs later re-reads at its base. The order is the human's.
- **Entry 13** (:6804-6820) is engine/src/index.rs, rowgroup.rs and their tests, disjoint from the seven.

### N7. Part 1 (items 1 to 9) as applied, and the records

- **Item 1:** 12b writes no sentence about behaviour and adds no comment, and no allow carries a comment. Any comment a worker adds is written after the code and checked clause by clause.
- **Items 3 to 6:** a correction is checked as new work; the full suite at the reviewed head comes before any gate; both gates get the same packet; findings carry their closure.
- **Item 7:** no test double and no new test.
- **Item 9:** the gates re-observe the digest, M9 and the guard runs.
- **Owner's index:**
  - 12b changes no pointer's target. No file at engine/README.md:539-567 @ 058244086f9914525ea8e4761c7baa07ea4f6e62 sha256:6d09869517cb7a790bb412372d41726f649d54949875eb199637a506feb3f39f is in Scope.
  - The pending lines, 12a's and 12b's forms in the list at :557, stay lead-data's after-merge update (governance/AI_DEVELOPMENT.md:749 @ 058244086f9914525ea8e4761c7baa07ea4f6e62 sha256:478ae83a5ea308b4b9d1a3b4c0812f1413897fa02ec89fe7881430dc7efa0f26).
  - 12a's OPEN-B (a) floated engine/README.md as 12b's eighth file (governance/forms/engine/CLIPPY-DENY-WARNINGS-WORKSPACE-12A-PREREGISTRATION.md:306 @ 058244086f9914525ea8e4761c7baa07ea4f6e62 sha256:ce3d1c985465d14519c63914cd8cf8af31acc0390bef20de78348b713ee12eb9). The brief reads adding a file that the slicing does not give 12b as a scope change to a ruled item, which is a red line. So that file is not in Scope. 12b's PR body names the pending line.
- **Stale records, named and not edited:**
  - LOD-RELEASE-GUARD's Change line ("no other line in the file moves", governance/forms/engine/LOD-RELEASE-GUARD-PREREGISTRATION.md:8 @ 058244086f9914525ea8e4761c7baa07ea4f6e62 sha256:659cfcea779aa10873c4587d8841b8b40b62bc0f75ad70a9febddff04aae34f6) bounded that piece's own diff. It is a historical pin, and the tree is authoritative after 12b.

### N8. The architect's OPEN items I rely on

- OPEN-1 (A): five lettered five-line pieces; 12b is the second.
- I take it under the human's direction of 2026-10-31, item 4. 12a's settlement records that direction as held until 2026-11-09 (governance/forms/engine/CLIPPY-DENY-WARNINGS-WORKSPACE-12A-PREREGISTRATION.md:336 @ 058244086f9914525ea8e4761c7baa07ea4f6e62 sha256:d0dee8f32c8af91e861c0a76318dbb6e8d780ab1694fb03f0b5ca62b8858d70f).
- The guards' form (i) and row 9 as a fix with the observation are the draft's section 3 principle, not OPEN items.
- OPEN-2 to OPEN-8 concern 12a, 12c, 12d and 12e. 12b does not rely on them.

---

## OPEN items

- **OPEN-A: row 11's shape.**
  - (a) `.next_back()`, the outline's fix, with the declared fallback to `.rfind(|&b| b <= end)` if the head JSON lists a row at :556, recorded in the report. No correction round is needed.
  - (b) `.rfind(..)` from the start.
  - (c) `#[allow(clippy::double_ended_iterator_last)]` on `splice`, with the code byte-identical.
  - Recommend (a). Not a red line: the element is the same, and the digest observes it.
- **OPEN-B: M9's shape.**
  - (a) Draw order only: the positional `{6} {5}` with the arguments swapped (N3).
  - (b) The outline's plain swap of the two trailing arguments, which also reverses the text.
  - Recommend (a). Not a red line.
- **OPEN-C: the per-package `-D warnings` run.**
  - (a) Recorded, not claimed, as the outline gives it. 12d carries the workspace claim.
  - (b) Claimed as the engine's Windows exit 0.
  - Recommend (a). Not a red line.
- **OPEN-D: diagnostics at the base that this form does not list.**
  - (a) Base step 2 is the worker's step 0.
    - A row in one of the seven files that N1 does not list stops the piece before code. It returns as an amendment: the architect's class 9 reading, citing the placement by path, which the custodian may overrule.
    - A row in an engine file outside the seven is recorded and reported, never fixed in 12b.
  - (b) The custodian runs the JSON at the base before this form is committed, and the form is redrafted from it.
  - Recommend (a). It is 12a's OPEN-C (a), which 12a's reviewer found unreached.
  - **Red line, as I read it:** what happens to a row in a file no slice gives. Adding it to any slice is a scope change to a ruled item, so it goes to the human through the custodian. It does not hold 12b.

## What I could not settle

- Whether my reads are byte-identical to 058244086f9914525ea8e4761c7baa07ea4f6e62 (I read the working tree; the custodian's pin script settles it).
- Whether any row exists at 12b's base beyond the thirteen (OPEN-D). Main's code may move between now and #300's merge.
- Five unobserved lint, compile and formatting readings:
  - whether `filter_next` reports `.filter(..).next_back()` (OPEN-A);
  - whether dropping the `*` at row 8 compiles through the promoted `'static` array;
  - whether a fn-level allow on a `#[test]` fn silences `assertions_on_constants` raised inside the `assert!` expansion;
  - whether rustfmt leaves rows 9, 11 and 19-20 in the shapes I give;
  - whether each guard's message prints its first-line span unbroken.
- Whether M9 is caught (my reading: yes, near certainly).
- Entry 11's files, and which of entry 11 and 12b runs first.
- Whether the direction of 2026-10-31, item 4 still holds when the form is committed. It holds until 2026-11-09. After the human returns, OPEN-A to OPEN-D and the use of OPEN-1 (A) for 12b may be theirs.
- The branches' contents beyond the brief's lists.

## The custodian's settlement (class 1, before any code)

- **The architect's OPEN-1 (A)** (`state/consults/2026-11-07-clippy-deny-warnings-workspace-form-architect-draft.md`, section 6), five lettered five-line pieces, 12b the second, taken for 12b on 2026-11-08 at this form's commit under the human's direction of 2026-10-31, item 4 (`state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md`), held until 2026-11-09, as 12a's form took it.
- **OPEN-A (a), OPEN-B (a), OPEN-C (a) and OPEN-D (a)**, each this draft's recommendation, taken on 2026-11-08 under the human's direction of 2026-10-31, item 4 (`state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md`), held until 2026-11-09.
- **OPEN-D's red line** (a clippy row at the base in a file no slice gives) goes to the human only if the worker's base run finds one. It does not hold 12b: under (a), such a row is recorded and reported, never fixed here.
- **The route:** filler entry 12, the slot's one in flight; a five-line form under §21c's size; the reviewer and the architect from dispatch (§36). Every cargo call runs inside a shared hold.
- **The copied code:** the custodian's script found each of the draft's twelve copied blocks equal to the lines it names at 05824408 (the block for rows 19 and 20 equal to both of its four-line ranges). Whether each lint fires, whether each fix compiles and how rustfmt lays it out are the draft's readings, unobserved; the worker's base JSON run (N4, base step 2) settles the first before any code. The draft's first unsettled item (whether its reads were 05824408's) is settled by that comparison.
- **The read commit and main:** `git diff --name-only 05824408 d233e85d` over the seven Scope files lists none. Over the 26 files the pins name it lists 2: `governance/PLAN.yaml`, `state/FILLER-QUEUE.md`, by the custodian's records only. The pins keep the read commit's lines.
- **12b's base** is main after #300 (12a) merged, so 12a's eight files are at their fixed state there; the base JSON run's rows outside the seven files are the ones 12a left (N4, base step 2: zero expected outside the seven).
- **The PLAN node:** one node holds entry 12. Its `gate` names the lettered piece in flight: this form now, the next lettered form when 12b is done.
- **Rule (00)** at main d233e85d, `git diff --name-only origin/main...<branch>` against the seven Scope files and protocol/: port-2 (`cut/port-2-macos-l1-and-app-dirs`): none; 1c (`cut/b2-piece-1c-save-and-reopen`): none; B1 shell half C (`cut/b1-shell-half-pr-c`): none. It is checked again at dispatch.

## Amendments (opens empty; append-only)
