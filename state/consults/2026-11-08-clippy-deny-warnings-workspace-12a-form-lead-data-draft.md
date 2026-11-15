*Custodian's filing note (2026-11-08): lead-data's five-line form draft for filler entry 12's first lettered piece, 12a (`clippy-deny-warnings-workspace`), read only at main e13fa13b, from the architect's outline (`state/consults/2026-11-07-clippy-deny-warnings-workspace-form-architect-draft.md`). Its brief was given by file (7601 bytes, sha256 8b6b769ab6a025578a980729334b70ce9311019c352f7dfa3e1324d52c4fd568), with the in-flight paths by git and the reuse index's output byte for byte. Dispatched at 2026-11-08T09:36:32.385Z by its transcript; the run went to 2026-11-08T09:46:54.569Z (claude-opus-5-5; unique calls: Read 42, Grep 32, Glob 2, the hand-back, 77 in all). The report below was extracted by script from the hand-back in that transcript (33703 bytes, sha256 117f53a4ea527e3d74d398b0ed66dc34c688191a00ba8ef7fec7f5d905045a5e) and is unchanged. The custodian checked by script, at e13fa13b: the thirteen code blocks it copies from the eight Scope files, each equal to the lines it cites (the other blocks are its proposed fixes, in its words); its quotations, each found in the tree but one: N3's M26 quotes the architect's draft as one span, where the architect's line closes its quotation marks after "bound 3" (the form corrects this). Its readings of whether a lint fires are its own and unobserved. The architect's OPEN-1 (A), OPEN-2 (A) and OPEN-3 (c) and its own OPEN-A (a), OPEN-B (a) and OPEN-C (a) are taken under item 4 of 2026-10-31; OPEN-C's question on rows in files no slice gives goes to the human. A draft, not Authority: the form is committed separately, beside this filing (`governance/forms/engine/CLIPPY-DENY-WARNINGS-WORKSPACE-12A-PREREGISTRATION.md`).*

---

Draft: clippy-deny-warnings-workspace 12a, five-line form, lead-data

Unless text is in quotation marks or in a block marked byte-copied, every sentence here is in my own words (lead-data's). Quoted and byte-copied text comes from the file cited. I have no shell, so I give no sha256 anywhere in this report. I read the working tree of the main checkout. The session's git snapshot names e13fa13b as its latest commit, and its only untracked files are outside every path read here. I could not print HEAD, so the custodian's pin script settles whether my reads match e13fa13bea35ae173907cac8ac53698b01c3f614. I ran no clippy, no cargo, no git and no node. Every judgement below on whether a lint fires is my reading of the code against that lint's rule, not an observation. I leave no background shell.

Owner's index: I read engine/README.md:533-567 @ e13fa13bea35ae173907cac8ac53698b01c3f614 and kernel/README.md:356-363 @ e13fa13bea35ae173907cac8ac53698b01c3f614. 12a is engine-only, and none of its changes alters the target of any pointer in either index (note N7, OPEN-B).

---

## The form

Form path: `governance/forms/engine/CLIPPY-DENY-WARNINGS-WORKSPACE-12A-PREREGISTRATION.md`. The template does not set a path. governance/README.md:19 @ e13fa13bea35ae173907cac8ac53698b01c3f614 gives one folder per original top-level folder, and governance/forms/ holds no index file (a Glob for `governance/forms/*.md` found none). Recent engine forms are at this folder: 4b's, and 8g's `governance/forms/engine/NARROW-INTEGER-ID-UNSTREAMABLE-PREREGISTRATION.md`. So the path stands as the brief gives it. CI's `node scripts/plan/forms-layout.mjs` (.github/workflows/governance-ci.yml:183 @ e13fa13bea35ae173907cac8ac53698b01c3f614) checks it.

```
Authority: PLAN node `clippy-deny-warnings-workspace` (governance/PLAN.yaml:6634-6650 @ e13fa13bea35ae173907cac8ac53698b01c3f614), filler queue entry 12 (state/FILLER-QUEUE.md:35 @ e13fa13bea35ae173907cac8ac53698b01c3f614), its lettered piece 12a as the custodian names the split; placed by the human (state/directives/2026-11-06-8e-words-replaced-u1-h1-h2-class-8-m10-kl-c1-c3-draft-marks-u12-mark-n1-n3-slot-2-order-clippy-placed-288-clicked.md:22 @ e13fa13bea35ae173907cac8ac53698b01c3f614); run in the filler slot under AUTONOMY.md §36 (governance/AUTONOMY.md:692 @ e13fa13bea35ae173907cac8ac53698b01c3f614): a five-line form under §21c's size, the reviewer and the architect gating from dispatch; its slicing and outline are the architect's draft (state/consults/2026-11-07-clippy-deny-warnings-workspace-form-architect-draft.md, sections 1, 2 and 6), whose OPEN-1 (A), OPEN-2 (A) and OPEN-3 (c) this piece takes under the human's direction of 2026-10-31 (state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md, item 4); evidence, not Authority: the Windows read's rows 1-6, 12-17 and 26 (state/consults/2026-11-07-clippy-deny-warnings-workspace-windows-read-tester-report.md:48-53, :59-64, :73 @ e13fa13bea35ae173907cac8ac53698b01c3f614), the cloud report's Linux-only row 7 (state/consults/2026-11-03-cloud-suite-linux-report.md:216 @ e13fa13bea35ae173907cac8ac53698b01c3f614) and lead-data's impact read (state/consults/2026-11-07-clippy-deny-warnings-workspace-impact-read-lead-data.md, sections 1 and 3); drafted by lead-data, read at main e13fa13bea35ae173907cac8ac53698b01c3f614; reuse index: four misses, no prior art recorded for "clippy deny warnings workspace" or "lint warnings ci step" (the architect's draft's two) or for "clippy warnings fix" or "lint deny warnings ci" (tools/reuse.mjs in the reuse clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c, exit 1 each, run by the custodian).
Scope: engine/src/rowgroup.rs (row 1); engine/src/stream.rs (rows 2, 3, 4); engine/src/trace.rs (rows 5, 6); engine/src/watch.rs (L7); engine/tests/filter_type_admission.rs (row 12); engine/tests/fixture_generation.rs (rows 13-15); engine/tests/identity.rs (rows 16, 17); engine/tests/publish_stream.rs (row 26); 8 files; declared line budget 80, counted as insertions plus deletions over non-generated code and tests under §21c's rule, this form excluded, by `git diff --numstat origin/main...HEAD -- engine/src/rowgroup.rs engine/src/stream.rs engine/src/trace.rs engine/src/watch.rs engine/tests/filter_type_admission.rs engine/tests/fixture_generation.rs engine/tests/identity.rs engine/tests/publish_stream.rs` at a named commit (estimate 44).
Change: the thirteen clippy diagnostics whose primary spans are in these files on Windows (rows 1-6, 12, 13-15, 16-17 and 26 of the Windows read, re-located at main e13fa13bea35ae173907cac8ac53698b01c3f614) and the Linux-only rustc `dead_code` on `WATCH_BUFFER_BYTES` (L7) are removed: rows 1 and 3 (`too_many_arguments`) and row 2 (`if_same_then_else`) by an item-level `#[allow(clippy::<lint>)]` with the fn's code byte-identical; row 4 by a fn-local `type` alias for the case tuple; rows 5-6 by dropping the `*`; L7 by moving the const and its two doc lines into `#[cfg(windows)] mod windows_watch`, which holds its only two readers, and dropping its name from that module's `use super::{…}`; row 12 by the single condition `in_division && int_info(from).is_some() && (to == "FLOAT" || to == "DOUBLE")`; rows 13-15 by dropping the `&`; rows 16-17 by `!md.contains_key(..)`; and row 26 by `for (i, bound) in union.iter().enumerate()`, which keeps `to_bits()` and the message `"bound {i}"`. After the change, the JSON run lists no diagnostic whose primary span is in these files, and lists the rows outside them as at the base; no behaviour, signature, value, test name, assertion strength or message changes.
Tests+mutation: no test is added. Changed test code, each assertion at equal strength: `the_where_composition_matrix_matches_the_declared_rule_exactly` (row 4, a type spelling); `the_spans_table_telescopes_by_construction` (rows 5-6); `is_declared_cast`, the helper of `the_type_walk_agrees_with_the_binder_over_the_p0_matrix` (row 12); `changing_the_row_group_size_changes_the_file_and_is_therefore_part_of_the_spec` and `generation_reports_progress_once_per_chunk_with_monotonic_counts` (rows 13-15); `skipping_the_uniqueness_check_is_recorded_rather_than_hidden` (rows 16-17); `a_batch_reports_the_bounds_of_the_rows_it_actually_carries` (row 26). Each mutation is applied at the head, the named test run, its failure recorded by name with the commit, and the mutation reverted, with `git status --porcelain` shown empty after the revert. M12: in row 12's condition, `int_info(from).is_some()` becomes `int_info(from).is_none()`. Predicted: `the_type_walk_agrees_with_the_binder_over_the_p0_matrix` fails at its `failures.is_empty()` assertion, reporting an undeclared integer-to-DOUBLE cast with `in_division=true`. A survival is class 2 and a coverage finding, and the fix stands as an equivalence under `&&`'s evaluation. M16: engine/src/envelope.rs:221-223 @ e13fa13bea35ae173907cac8ac53698b01c3f614 is replaced by `md.insert("id_js_exact".to_string(), identity.js_exact().unwrap_or(true).to_string());`. Predicted: `skipping_the_uniqueness_check_is_recorded_rather_than_hidden` fails with "unverified width must not read as exact". M17: engine/src/envelope.rs:214-216 @ e13fa13bea35ae173907cac8ac53698b01c3f614 is replaced by `md.insert("id_verified_rows".to_string(), identity.verified_rows().unwrap_or(0).to_string());`. Predicted: the same test fails at `!md.contains_key("id_verified_rows")`. M26: at engine/tests/publish_stream.rs:527 @ e13fa13bea35ae173907cac8ac53698b01c3f614, `.max(p[1])` becomes `.min(p[1])`. Predicted: `a_batch_reports_the_bounds_of_the_rows_it_actually_carries` fails with "bound 3". A survival of M16, M17 or M26 is a stop. Rows 1-3 and L7 carry no mutation: the code under each allow is byte-identical, and the moved const keeps its value, visibility and readers, all read from the diff; `float32_costs_four_bytes_in_the_estimate` and engine/tests/source_watch_adapter.rs pass unchanged. Rows 4-6 and 13-15 are proven by the type checker. At the head: `cargo clippy --locked -p spatial-engine --all-targets --message-format=json` exits 0 and, counted by the Windows read's rule, lists no row in the Scope files and the rows outside them as at the base; `node scripts/plan/cfg-boundary.mjs` exits 0 with its count line as at the base, engine/src/watch.rs at 3 sites; `cargo fmt --all -- --check` exits 0; `cargo test --workspace --locked` passes; and the PR's product-ci-rust Linux build-step log prints no `dead_code` for engine/src/watch.rs.
Out-of-scope: ADR: none (no status, text, note or amendment; ADR-016 §6's identity record, engine/src/envelope.rs:199-223 @ e13fa13bea35ae173907cac8ac53698b01c3f614, is only mutated temporarily by M16 and M17, and stays byte-identical). Security: none (the advisory watcher's `WATCH_BUFFER_BYTES` keeps 65536, `pub(crate)` and its two readers; nothing ADR-020, ADR-009 or ADR-021 governs is touched). Wire: none (no SKP, data-plane or MCP file; no envelope key or value). Guarantee: none (`attr_row_bytes`, whose result sets every publish partition boundary, is byte-identical under its allow; every changed assertion keeps its strength; no test is renamed). §25 (e) is set aside for a filler by §36. No new dependency, no `unsafe`, no new string, no new `pub` item, no new OS-cfg site, no `[lints]` table, no clippy.toml; Cargo.toml and Cargo.lock unchanged.
```

---

## Notes (mine)

### N1. Each row at main, re-located by content

The Windows read pinned fbc905ec and the architect's draft pinned 4cbcab1e. Since then, 8f (#294) and 8g (#297) edited engine/src/stream.rs, and 8g also edited engine/src/fixture.rs and engine/src/identity.rs. Below, each row is re-read at e13fa13bea35ae173907cac8ac53698b01c3f614. The lines in the code blocks are byte-copied from my Read results. Each "holds" is my reading, not a clippy run.

**Row 1, `too_many_arguments`, engine/src/rowgroup.rs:331 @ e13fa13bea35ae173907cac8ac53698b01c3f614.** The line has not moved.
```
    pub fn build(
```
- `RowGroupIndex::build` takes 8 parameters (engine/src/rowgroup.rs:332-339 @ e13fa13bea35ae173907cac8ac53698b01c3f614), against clippy's limit of 7, so the row holds.
- Fix: one line, `    #[allow(clippy::too_many_arguments)]`, between the doc at :330 and :331. This follows the precedent at engine/src/index.rs:313 @ e13fa13bea35ae173907cac8ac53698b01c3f614.
- The `pub` signature does not change.

**Row 2, `if_same_then_else`, engine/src/stream.rs:2346-2351 @ e13fa13bea35ae173907cac8ac53698b01c3f614.** Not moved. The fn is at :2323.
```
        } else if col.as_any().downcast_ref::<BooleanArray>().is_some() {
            1
        } else if col.as_any().downcast_ref::<Int8Array>().is_some()
            || col.as_any().downcast_ref::<UInt8Array>().is_some()
        {
            1
```
- Two consecutive arms have identical comment-free blocks `1`, so the row holds.
- Fix, under OPEN-3 (c): one line, `#[allow(clippy::if_same_then_else)]`, between :2322 and `fn attr_row_bytes(chunk_attrs: &[ArrayRef], row: usize) -> usize {` (:2323). The expression at :2323-2377 stays byte-identical.
- The out-of-scope doc misattachment (:2299-2304 running into :2305-2313) is left as it is.

**Row 3, `too_many_arguments` (10/7), engine/src/stream.rs:2462 @ e13fa13bea35ae173907cac8ac53698b01c3f614.** Not moved.
```
fn flush(
```
- 10 parameters at :2463-2472, so the row holds.
- Fix: `#[allow(clippy::too_many_arguments)]` between :2461 and :2462. The precedent is engine/src/stream.rs:1769 @ e13fa13bea35ae173907cac8ac53698b01c3f614.

**Row 4, `type_complexity`. Moved from :3808 to engine/src/stream.rs:3857 @ e13fa13bea35ae173907cac8ac53698b01c3f614.** It is in `the_where_composition_matrix_matches_the_declared_rule_exactly` (:3836), inside `#[cfg(test)] mod tests` (:2762-2763).
```
            let cases: [(Option<AdmittedPredicate>, Option<Bbox>, Option<u64>, String); 8] = [
```
- Fix: one line inserted immediately above the comment at :3854, `            type Case = (Option<AdmittedPredicate>, Option<Bbox>, Option<u64>, String);`. Then :3857 becomes `            let cases: [Case; 8] = [`.
- The alias is local to the fn, which is narrower than "a local alias in `mod tests`".
- My reading of the lint: type_complexity does not check a `type` alias's own definition. That is why clippy suggests an alias.

**Rows 5 and 6, `explicit_auto_deref`, engine/src/trace.rs:637 and :658 @ e13fa13bea35ae173907cac8ac53698b01c3f614.** Not moved. Both are in `the_spans_table_telescopes_by_construction` (:604), in `mod tests` (:562-563).
```
            pair(*five_leg.last().unwrap()).1,
```
```
            pair(*three_leg.last().unwrap()).1,
```
- `pair` takes `&str` (:605). `.last().unwrap()` yields `&&str`, which deref-coerces to `&str`. So both rows hold, and dropping the `*` yields the same value.

**L7, rustc `dead_code`, Linux only, engine/src/watch.rs:71-73 @ e13fa13bea35ae173907cac8ac53698b01c3f614.** Not moved.
```
/// The declared buffer size for each handle's `ReadDirectoryChangesW` call (§7), DWORD-aligned.
/// Overflow past it is [`WatchSignal::CoverageLost`], never silently dropped.
pub(crate) const WATCH_BUFFER_BYTES: usize = 65536;
```
- Its only readers are inside `#[cfg(windows)] mod windows_watch` (:105-106): the import at :107, and the uses at :222 and :250. A Grep over `*.rs`, `*.mjs` and `*.toml` finds no other code reader. engine/tests/source_watch_adapter.rs:276 names it in a comment only.
- Fix, under OPEN-2 (A):
  - Delete :71-74 (the three lines and the blank line after them).
  - Insert the same three lines, with a blank line before them, after the last `use` of `windows_watch` (:126). Each line gains only the four-space indent that rustfmt requires inside the module; that is my reading of rustfmt.
  - :107 becomes `    use super::{ArmOutcome, ArmedWatch, WatchSignal, WatchSink};`.
- The intra-doc link to `WatchSignal::CoverageLost` still resolves through that `use`.
- No OS-cfg site is added. watch.rs's sites stay at :88, :92 and :105 (3), matching the pin at scripts/plan/cfg-boundary.test.mjs:82-89 @ e13fa13bea35ae173907cac8ac53698b01c3f614.

**Row 12, `redundant_pattern_matching`, engine/tests/filter_type_admission.rs:1266-1272 @ e13fa13bea35ae173907cac8ac53698b01c3f614.** Not moved. It is in `is_declared_cast` (:1250).
```
    if in_division {
        if let Some(_) = int_info(from) {
            if to == "FLOAT" || to == "DOUBLE" {
                return true;
            }
        }
    }
```
- The row holds.
- The outline's fix, `if int_info(from).is_some() {`, leaves two nested plain `if`s with no `else`. The engine is edition 2021 (engine/Cargo.toml:4 @ e13fa13bea35ae173907cac8ac53698b01c3f614). By my reading, `clippy::collapsible_if` (style, warn by default) then reports the nest. Today it does not, because an `if let` cannot be collapsed in edition 2021.
- So the smallest fix that leaves no row is:
```
    if in_division && int_info(from).is_some() && (to == "FLOAT" || to == "DOUBLE") {
        return true;
    }
```
- It is equivalent: `int_info` (:1208) is a pure lookup, and `&&` evaluates in the same order as the nest.
- This is OPEN-A. It costs 10 lines rather than 2.

**Rows 13, 14 and 15, `needless_borrows_for_generic_args`, engine/tests/fixture_generation.rs:126, :127 and :143 @ e13fa13bea35ae173907cac8ac53698b01c3f614.** Not moved.
```
    let fa = write_geoparquet(&d.join("fa.parquet"), &base).unwrap();
    let fb = write_geoparquet(&d.join("fb.parquet"), &small).unwrap();
```
```
        write_geoparquet_cancellable(&d.join("f.parquet"), &spec, &CancelToken::new(), Some(&rec))
```
- Both callees take `path: impl AsRef<Path>` (engine/src/fixture.rs:998 and :1029-1030 @ e13fa13bea35ae173907cac8ac53698b01c3f614, moved from :860 by 8g; fixture.rs is not in Scope). Each borrowed value is a temporary, so the three rows hold.
- Fix: drop the `&` at each site. Rows 13-14 are in `changing_the_row_group_size_changes_the_file_and_is_therefore_part_of_the_spec` (:102), and row 15 is in `generation_reports_progress_once_per_chunk_with_monotonic_counts` (:134).

**Rows 16 and 17, `unnecessary_get_then_check`, engine/tests/identity.rs:321 and :324 @ e13fa13bea35ae173907cac8ac53698b01c3f614.** Not moved. They are in `skipping_the_uniqueness_check_is_recorded_rather_than_hidden` (:296).
```
        md.get("id_js_exact").is_none(),
```
```
    assert!(md.get("id_verified_rows").is_none());
```
- Fix: `        !md.contains_key("id_js_exact"),` and `    assert!(!md.contains_key("id_verified_rows"));`.
- By my reading, rustfmt keeps the three-line `assert!` at :320-323: its arguments are wider than the call-width heuristic.

**Row 26, `needless_range_loop`, engine/tests/publish_stream.rs:534-536 @ e13fa13bea35ae173907cac8ac53698b01c3f614.** Not moved. It is in `a_batch_reports_the_bounds_of_the_rows_it_actually_carries` (:492).
```
    for i in 0..4 {
        assert_eq!(union[i].to_bits(), facts.extent[i].to_bits(), "bound {i}");
    }
```
- `union` is a `[f64; 4]` (:508-513), and `facts.extent` is a `[f64; 4]` (engine/src/fixture.rs:733 @ e13fa13bea35ae173907cac8ac53698b01c3f614).
- Fix: `    for (i, bound) in union.iter().enumerate() {` and `        assert_eq!(bound.to_bits(), facts.extent[i].to_bits(), "bound {i}");`. It covers the same four indices with the same comparison and message.

**New diagnostics since the read: not settled.**
- In the Scope files, I read the code 8g added (`column_u64`, engine/src/stream.rs:2658-2741 @ e13fa13bea35ae173907cac8ac53698b01c3f614) and 8f's `build_sql` area (:1430-1452). I found no default-level lint there. I did not read the whole of `mod tests`.
- The worker's base JSON run is what settles this (OPEN-C).

### N2. The route

- **Files:** 8, which meets §21c's "≤ 8 files" (governance/AUTONOMY.md:350 @ e13fa13bea35ae173907cac8ac53698b01c3f614).
- **Lines,** my estimate, insertions plus deletions with tests counted (:357):

| Row | Lines |
|---|---|
| 1 | 1 |
| 2 | 1 |
| 3 | 1 |
| 4 | 3 |
| 5-6 | 4 |
| L7 | 10 (4 deleted, 4 inserted, 1 changed) |
| 12 | 10 (7 deleted, 3 inserted) |
| 13-15 | 6 |
| 16-17 | 4 |
| 26 | 4 |
| **Total** | **44** |

- The declared budget stays at the outline's 80. An overrun is class 6.
- **The other bounds** of §21c and §21a: no new exposure surface, no new dependency, no new user-visible behaviour, and none of §21a's four categories (governance/AUTONOMY.md:317-327 @ e13fa13bea35ae173907cac8ac53698b01c3f614).
- **The nearest category** is "any property currently under test" (:327), through row 2. The estimator's expression stays byte-identical, so the property is untouched.
- **So a five-line form fits.** The smallest true reading is 8 files and about 44 lines.
- **Gates:** the reviewer and the architect from dispatch, under §36 (:692). §25 (e) is set aside, though the Out-of-scope line names no category. Grade S3. There are no strings a user sees and no red-line text.
- **Scope is not trimmed.** The owner's-index line is the only candidate ninth file (OPEN-B).

### N3. Tests and mutations, re-checked at main

Each mutation is applied alone at the head. The worker runs the named test, records its failure by name with the commit, reverts, and shows `git status --porcelain` empty before applying the next. Part 1, item 9 keeps the observations the gates' own, so the gates re-observe them.

**M12.**
- Code: row 12's new condition, `.is_some()` becoming `.is_none()`.
- Command: `cargo test --locked -p spatial-engine --test filter_type_admission the_type_walk_agrees_with_the_binder_over_the_p0_matrix -- --exact`.
- Expected: rc 101, with the message "B-T1 counterexample(s); see the report above" (:1671-1675 @ e13fa13bea35ae173907cac8ac53698b01c3f614).
- Why I predict this, my reading:
  - The corpus has division families (`("arith / then > 0", "/")` at :1059, and `"arith / 0 = 0"` at :1073).
  - `walk_casts` marks a `/` operand's casts `in_division` (:1164-1171).
  - Under the mutation, an integer of 64 bits into DOUBLE falls to the general branch (`return fb <= 32;`, :1292-1293) and is pushed as undeclared (:1640-1645).
  - The test is not `#[ignore]` (:1555).
- If it survives: class 2 and a coverage finding, not a stop. The fix is an equivalence the language defines, and the gate reads it from the diff.

**M16.**
- Code: `if let Some(exact) = identity.js_exact() { … }` (engine/src/envelope.rs:221-223 @ e13fa13bea35ae173907cac8ac53698b01c3f614) becomes the unconditional insert given in the form. `js_exact` returns `Option<bool>` (engine/src/identity.rs:276 @ e13fa13bea35ae173907cac8ac53698b01c3f614).
- Command: `cargo test --locked -p spatial-engine --test identity skipping_the_uniqueness_check_is_recorded_rather_than_hidden -- --exact`.
- Expected: rc 101, with "unverified width must not read as exact". The assertions at :313-318 are untouched by the mutation and pass first.
- If it survives: a stop. The rewrite would have lost its negation.

**M17.**
- Code: :214-216 becomes the unconditional insert. `verified_rows` returns `Option<u64>` (engine/src/identity.rs:267 @ e13fa13bea35ae173907cac8ac53698b01c3f614).
- Command: the same as M16.
- Expected: rc 101, at `assertion failed: !md.contains_key("id_verified_rows")`. :321 passes, because M16 is reverted.
- If it survives: a stop.

**M26.**
- Code: engine/tests/publish_stream.rs:527 @ e13fa13bea35ae173907cac8ac53698b01c3f614, `union[3] = union[3].max(p[1]);`, with `.min`. The accumulator then stays at `NEG_INFINITY`.
- Command: `cargo test --locked -p spatial-engine --test publish_stream a_batch_reports_the_bounds_of_the_rows_it_actually_carries -- --exact`.
- Expected: rc 101, with "bound 3".
- Why the last index: it is the bound a shortened rewritten loop would miss, so it proves the loop still reaches the end. The architect allowed "bound 3 (or the bound of the coordinate mutated)".
- If it survives: a stop.

**No mutation:**
- Rows 1-3: one attribute line over byte-identical code. `float32_costs_four_bytes_in_the_estimate` (engine/src/stream.rs:2915-2919 @ e13fa13bea35ae173907cac8ac53698b01c3f614, moved from :2863) passes.
- L7: on Windows the const, its value and its readers are unchanged. engine/tests/source_watch_adapter.rs's `a_forced_overflow_signals_coverage_lost` passes in the suite. On Linux, the evidence is the PR's own build-step log.
- Rows 4-6 and 13-15: proven by the type checker.
- Option not taken: a `.last()` to `.first()` mutation for rows 5 and 6. It would add proof the gate can already read from the diff.

### N4. Verification

Every cargo call runs inside a shared hold (AUTONOMY Part B, item 2). Under §36, a filler takes a shared hold only.

**At the base:**
1. `git rev-parse HEAD` (rc 0), `cargo clippy --version` (rc 0), `rustc -V` (rc 0).
2. `cargo clippy --locked -p spatial-engine --all-targets --message-format=json`, stdout to a file outside the repository:
   - rc 0.
   - Counted by the Windows read's rule (state/consults/2026-11-07-clippy-deny-warnings-workspace-windows-read-tester-report.md:42 @ e13fa13bea35ae173907cac8ac53698b01c3f614).
   - Record the distinct total, the rows in the eight Scope files and the rows outside them.
   - Expected in Scope on Windows: 13, at the lines in N1.
   - The engine total was 26 at fbc905ec. It may differ at the base (OPEN-C).
   - The three targets that hold these rows are within this command: the lib with `cfg(test)`, the four test targets, and the example.
3. `node scripts/plan/cfg-boundary.mjs`: rc 0, with its last line recorded. At main it is expected to be `cfg-boundary: 18 sites in 6 files, 0 outside every boundary` (scripts/plan/cfg-boundary.test.mjs:75 @ e13fa13bea35ae173907cac8ac53698b01c3f614).

**At the head:**
1. The same clippy JSON run: rc 0, zero rows in the Scope files, and the rows outside them equal to the base's by (lint, file, span, message).
2. `cargo fmt --all -- --check`: rc 0.
3. `cargo test --workspace --locked`: rc 0, in one shared hold. This is Part 1, item 4's readiness condition.
4. M12, M16, M17 and M26 as in N3: each rc 101 as predicted, then reverted.
5. `node scripts/plan/cfg-boundary.mjs`: rc 0, last line equal to the base's, with engine/src/watch.rs listed 3 times. Then `node --test scripts/plan/cfg-boundary.test.mjs`: rc 0.
6. `git diff --numstat origin/main...HEAD` and `git diff --name-only origin/main...HEAD`: exactly the eight Scope files, and a total of 80 or less.
7. The governance checks, as CI runs them (.github/workflows/governance-ci.yml:150-183 @ e13fa13bea35ae173907cac8ac53698b01c3f614), each rc 0:
   - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`
   - `node scripts/plan/verify-cites.mjs`
   - `node scripts/plan/verify-quotes.mjs`
   - `node scripts/plan/verify-test-claims.mjs`
   - `node scripts/plan/verify.mjs`
   - `node scripts/plan/forms-layout.mjs`
8. After the push, the PR's product-ci-rust Linux build-step log shows no `dead_code` warning naming engine/src/watch.rs.

**Not claimed:**
- No `-D warnings` exit 0. Rows 7-11 and 18-25 are 12b's, so the package command still fails.
- Nothing on Linux beyond L7's log line, and no timing.

**The gates re-run at the reviewed head:**
- the full suite (Part 1, item 9: the reviewer does not yet rely on CI);
- the clippy JSON run;
- M12, M16, M17 and M26;
- `node scripts/plan/cfg-boundary.mjs`;
- a read of the Linux build-step log for L7.

### N5. What must not change

- **Files:** every file outside the eight, including engine/README.md (OPEN-B), engine/src/envelope.rs (mutated temporarily only), engine/src/fixture.rs, Cargo.toml, Cargo.lock, every kernel/, renderer/ and protocol/ file, scripts/plan/cfg-boundary.mjs and its test.
- **In the eight files:**
  - the code under each allow;
  - every test name, assertion and message;
  - the case strings at engine/src/stream.rs:3858-3890 @ e13fa13bea35ae173907cac8ac53698b01c3f614;
  - `WATCH_BUFFER_BYTES`'s name, value, `pub(crate)` visibility and doc words;
  - the `#[cfg(windows)]` and `#[cfg(not(windows))]` sites at engine/src/watch.rs:88, :92 and :105 @ e13fa13bea35ae173907cac8ac53698b01c3f614.
- **Public items:** every `pub` item and signature, including `RowGroupIndex::build`.
- **Pinned paths:** every path the owner's index pins (engine/README.md:539-567 @ e13fa13bea35ae173907cac8ac53698b01c3f614). No pinned test is renamed, and `WATCH_BUFFER_BYTES` stays in `engine/src/watch.rs`.
- **The value table:** the declared value table row at governance/forms/engine/SOURCE-WATCHER-PREREGISTRATION.md:392 @ e13fa13bea35ae173907cac8ac53698b01c3f614 stays true.

### N6. Rule (00) at main e13fa13bea35ae173907cac8ac53698b01c3f614

- **12a's paths:** the eight Scope files, this form, and the custodian's PLAN.yaml and FILLER-QUEUE.md edits.
- **None of them** is under protocol/, a wire fixture, Cargo.lock or package-lock.json.
- **The branches,** by the brief's `git diff --name-only origin/main...<branch>` lists, filtered to the eight files and protocol/:
  - `cut/port-2-macos-l1-and-app-dirs`: none;
  - `cut/b2-piece-1c-save-and-reopen`: none;
  - `cut/b1-shell-half-pr-c`: none;
  - `cut/publish-filter-sentence-e2e-shown-case`: frontends/shell/e2e/ only, by its ruling;
  - `cut/publish-filter-sentence-mark-comment-and-adr-024-note`: shell doc comments and an ADR-024 note.
- **Result:** disjoint, by those lists.
- **port-2 and cfg-boundary:** port-2 edits scripts/plan/cfg-boundary.test.mjs, which 12a only runs. If port-2 merges first, 12a's base count line changes. Its check is "equal at base and head", so it still holds.
- **The filler queue:** 8f and 8g are merged (state/FILLER-QUEUE.md:30-31 @ e13fa13bea35ae173907cac8ac53698b01c3f614), and entry 11 is skipped (:34).

### N7. Part 1 (items 1 to 9) as applied, and the records

- **Item 1:**
  - 12a writes no sentence about behaviour.
  - L7 moves two existing doc lines without changing their words.
  - The allows carry no comment, following the architect's principle.
  - Any comment a worker adds is written after the code and checked clause by clause.
- **Items 3 to 6:** a correction is checked as new work, and the full suite at the reviewed head comes before any gate. The packet is the same for both gates, and findings carry their closure.
- **Item 7:** no test double and no new test.
- **Owner's index:** under my reading of the index rule ("Updated in the PR of every piece that changes what a pointer points to", engine/README.md:535 @ e13fa13bea35ae173907cac8ac53698b01c3f614), 12a changes no pointer's target. What remains is only the addition of this form to the list at :557, which is OPEN-B.
- **Stale records, named and not edited:**
  - The WAVE3-1 row at governance/forms/root/PORT-1-LINUX-L1-PREREGISTRATION.md:66 @ e13fa13bea35ae173907cac8ac53698b01c3f614 is a historical pin. After 12a, the tree is authoritative for watch.rs. 12a does not claim a warning-free Linux build either.
  - The misattached doc at engine/src/stream.rs:2299-2304 @ e13fa13bea35ae173907cac8ac53698b01c3f614 stays out of scope.

### N8. The architect's OPEN items I rely on

- OPEN-1 (A): five lettered five-line pieces; 12a is the first.
- OPEN-2 (A): the const moves into the module.
- OPEN-3 (c): a fn-level allow on row 2.
- I take each under the human's direction of 2026-10-31, item 4. That direction holds while the human is away, until 2026-11-09, so it holds on 2026-11-08.
- OPEN-4 to OPEN-8 concern 12c, 12d and 12e. 12a does not rely on them.

---

## OPEN items

- **OPEN-A: row 12's shape.**
  - (a) The single condition (N1). It is equivalent and carries M12.
  - (b) `.is_some()` alone, as the outline gives it. By my reading this leaves a new `collapsible_if` row at the head, which fails the zero-row check and costs a correction round.
  - (c) `#[allow(clippy::redundant_pattern_matching)]` on `is_declared_cast`, with the code byte-identical and M12 still observed.
  - Recommend (a). Not a red line: the assertion's strength is unchanged.
- **OPEN-B: the owner's-index line for this form.**
  - (a) Outside 12a's Scope. I write the update after the merge, and a later engine piece or the docs lane applies it. For example, 12b's form, with 7 files, could carry engine/README.md as its eighth; that is 12b's form to decide. 12a's PR body names the pending line.
  - (b) engine/README.md in Scope. That is 9 files, which crosses §21c, closes the five-line form and takes the piece out of the filler route (§36).
  - Recommend (a). It matches the architect's section 1 and the pilot's "after a merge it writes the owner's-index update" (governance/AI_DEVELOPMENT.md:749 @ e13fa13bea35ae173907cac8ac53698b01c3f614). Not a red line.
- **OPEN-C: diagnostics at the base that the outline does not list.**
  - (a) Base step 2 (N4) is the worker's step 0.
    - A row in one of the eight Scope files that this form does not list stops the piece before any code. It returns as an amendment. The architect reads it as class 9, citing the placement by path; the custodian may overrule that reading.
    - A row in an engine file outside every slice is recorded and reported, never fixed in 12a. That covers the files 8f and 8g added or edited outside the eight (engine/tests/single_file_bracket_name.rs, engine/tests/narrow_integer_id_stream.rs, engine/src/fixture.rs, engine/src/identity.rs, and any other).
  - (b) The custodian has the JSON run at the base before this form is committed, and the form is re-drafted from it.
  - Recommend (a).
  - **Red line, as I read it:** what happens to a row in a file no slice gives. Adding that file to 12a, or to any ruled slice, is a scope change to a ruled item, so it goes to the human through the custodian. It does not hold 12a, but it bears on 12d's workspace exit-0 claim.

---

## What I could not settle

- Whether my reads are byte-identical to e13fa13bea35ae173907cac8ac53698b01c3f614. I read the working tree; the custodian's pin script settles it.
- Whether new clippy rows exist at the base:
  - in the Scope files, from 8f's or 8g's code beyond what I read (`column_u64`, `build_sql`'s projection; not the whole of `mod tests`);
  - in engine or kernel files outside every slice (OPEN-C).
- Four lint and formatting readings, all unobserved:
  - that `collapsible_if` fires after the outline's row-12 fix;
  - that type_complexity does not check a `type` alias;
  - that a fn-level allow silences `if_same_then_else`;
  - that rustfmt leaves engine/tests/fixture_generation.rs:142-144 and engine/tests/identity.rs:320-323 @ e13fa13bea35ae173907cac8ac53698b01c3f614 in their present shape, and re-indents the moved const only by four spaces.
- Whether M12 is caught. That depends on the binder casting a 64-bit integer to DOUBLE under `/` in an admitted case, which is my reading of the corpus.
- The exact form in which the Linux build step prints L7's warning.
- The branches' contents beyond the brief's lists.

I have no shell, so this report carries no sha256 of any file or of itself. I leave no background shell and wrote no file.

---

Result: 12a drafted as a five-line form. It covers 8 files, an estimated 44 changed lines against a declared budget of 80, and touches no §21a category. It builds on the architect's OPEN-1 (A), OPEN-2 (A) and OPEN-3 (c), and adds OPEN-A to OPEN-C. The main change from the outline is row 12: by my reading, its fix must collapse the nested `if`s or `collapsible_if` fires.
Blocking questions: none. One non-blocking red-line question goes to the human: what to do with clippy rows in engine or kernel files that no slice covers (OPEN-C).
Report path: C:/dev/spatial-ide/state/consults/2026-11-08-clippy-deny-warnings-workspace-12a-form-lead-data-draft.md
sha256: none (I have no shell).
