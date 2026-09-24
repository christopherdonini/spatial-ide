# Preregistration (five-line short form, AUTONOMY.md §21d)

```
Authority: PLAN.yaml node engine-tests-configured-connections; state/directives/2026-09-24-night-program.md item 5 (the human, verbatim, placed and approved: "engine-tests-configured-connections" as "a light-lane fix to a tool that can silently skip tests, not new policy").
Scope: engine/src/fixture.rs (new helper), engine/tests/first_batch_and_pruning.rs, engine/tests/import_layout_5gb_fixtures.rs, engine/tests/import_layout_fixtures.rs, engine/tests/publish_stream.rs, engine/tests/session_identity.rs (5 test files, 6 files total); declared line budget <= 150 insertions + deletions of non-generated code.
Change: adds one feature-gated test-support helper (spatial_engine::fixture::configured_connection) that opens an in-memory DuckDB connection and applies pool::configure_connection, and reroutes the 12 raw duckdb::Connection::open_in_memory() call sites across the five files above through it, so test connections carry the same autoload/autoinstall-off configuration product connections already carry.
Tests+mutation: new test pool::tests::a_connection_from_the_fixture_helper_opens_with_extension_autoload_and_autoinstall_off asserts current_setting('autoload_known_extensions') and current_setting('autoinstall_known_extensions') both read false on a connection from the helper; mutation: the helper skips the configure_connection call -> the test fails by name (both settings read true).
Out-of-scope: no ADR touched, no wire/data-plane change (protocol/** untouched), no new dependency/feature/build-script change, no new user-visible string, no undo class, no cancellation vocabulary, no lease-class/capacity change, no security-posture change (configure_connection's statement and effect are unchanged, only its set of callers grows).
```

Budget: declared <= 150 insertions + deletions (see Scope line).

### Correction round 1 -- reviewer attempt 1 (Correctness PASS, Evidence PASS-with-notes, Documentation FAIL). Fresh worker, per the dispatch mechanic (round 12, item 1 self-cite form; the fresh-worker rule for record-correction rounds).

**Classes used** (`docs/PREREGISTRATION-TEMPLATE.md:113-114` for item 1; `:128-131` for item 2; item 3 is a sibling-search finding for a later piece, not this piece's own class; item 4 is class 3 mechanical; item 5 is a class-3, comment-only code fix).

1. **B1 (class 5, scope-narrowing on a misattributed quote).** The Authority line's `"a light-lane fix to a tool that can silently skip tests, not new policy"` phrase is PLAN.yaml's paraphrase, not the human's words at the directive; the directive's own sentence differs. Corrected reference: `state/directives/2026-09-24-night-program.md:13 @ d41333f sha256:ebf8e30132dc4a77e337a494c6b74e7459fc3d92ea55135720d8b016863b86bc` (d41333f confirmed on `origin/main` by `git merge-base --is-ancestor d41333f origin/main`). No text is reproduced here; the Authority line stands byte-unedited above.

2. **B2 (class 6, budget deviation, Scope not edited).** The Scope line declares 6 files, but the code commit (`05e7819`) also edits `engine/src/pool.rs` for the new test, 7 files total; the final figure, `git diff --numstat origin/main...HEAD` with the form excluded, is 7 files / 83 insertions+deletions, both within the declared <= 150 / no declared file-count cap. The Scope line is unedited; this is the recorded final figure and the reason (the new unit test lives in the module it tests, `pool.rs`, not in a Scope-listed integration-test file).

3. **N2 (sibling-search finding, out of this piece's Scope; not fixed here).** Raw `duckdb::Connection::open_in_memory()` sites outside this piece's Scope remain at `engine/src/cancel.rs:143`, `:144`, `:169`, `:201` and `engine/src/predicate.rs:1150` (all `#[cfg(test)]` unit tests, not integration tests). Routed to a later piece, not corrected here.

4. **N3 (class 3, mechanical, no claim changed).** The Change line omits that two rerouted call sites in `first_batch_and_pruning.rs` (`a_file_whose_identity_is_not_row_group_ordered_is_refused_and_says_which_way`, `clustering_reorders_the_file_and_that_costs_it_lever_b2`) previously ran their own `SET enable_geoparquet_conversion=false` and now get it, and every other setting `CONFIGURE_SQL` applies, from `configured_connection`. The mutation claim ("both settings read true") is imprecise: run 2026-09-24 (helper's `configure_connection` call removed, reverted after) shows only the first assertion, `autoinstall_known_extensions`, is reached before the panic in `a_connection_from_the_fixture_helper_opens_with_extension_autoload_and_autoinstall_off` — `assertion left == right failed ... left: "true" / right: "false"` — and the second (`autoload_known_extensions`) is never evaluated in that run.

5. **N4 (class 3, comment-only code fix).** `pool.rs`'s doc comment above the `configure_connection` function named its two product callers and omitted the new test-support caller `fixture::configured_connection`; corrected in place, by name (`configure_connection`'s doc comment), on this branch's commit `8ccb8d7` — not a `path:line @ commit sha256` pin, because `8ccb8d7` is a branch commit, not yet on `origin/main` (round-15(e)). Proof: `pool::tests` (10/10) pass unchanged after the edit.

**Superseded index (round 12, item 1, clause (e)).** No form line above (Authority/Scope/Change/Tests+mutation/Out-of-scope) is edited or withdrawn by this correction round; each stands as originally written, referenced here by section only — never by line — because this document's own commits (`6e36e04`, `05e7819`, this correction) are branch commits, not on `origin/main`, and round-15(e) reserves a hash-pinned line reference in an append-only record to a commit on main:

| form line | referenced by | superseded by |
| --- | --- | --- |
| Authority line (section, this document) | name only, no line/hash pin (round 14's self-reference rule; round-15(e)) | not superseded; corrected reference supplied in item 1 above, line stands |
| Scope line (section, this document) | name only, no line/hash pin (round 14's self-reference rule; round-15(e)) | not superseded; final figure recorded in item 2 above, line stands |

Budget: `git diff --numstat origin/main...HEAD` (form excluded) totals 83 insertions+deletions over 7 files (`engine/src/fixture.rs`, `engine/src/pool.rs`, `engine/tests/first_batch_and_pruning.rs`, `engine/tests/import_layout_5gb_fixtures.rs`, `engine/tests/import_layout_fixtures.rs`, `engine/tests/publish_stream.rs`, `engine/tests/session_identity.rs`) -- within the declared <= 150 / <= 8 files.
