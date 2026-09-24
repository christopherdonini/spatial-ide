# Preregistration (five-line short form, AUTONOMY.md §21d)

```
Authority: PLAN.yaml node engine-tests-configured-connections; state/directives/2026-09-24-night-program.md item 5 (the human, verbatim, placed and approved: "engine-tests-configured-connections" as "a light-lane fix to a tool that can silently skip tests, not new policy").
Scope: engine/src/fixture.rs (new helper), engine/tests/first_batch_and_pruning.rs, engine/tests/import_layout_5gb_fixtures.rs, engine/tests/import_layout_fixtures.rs, engine/tests/publish_stream.rs, engine/tests/session_identity.rs (5 test files, 6 files total); declared line budget <= 150 insertions + deletions of non-generated code.
Change: adds one feature-gated test-support helper (spatial_engine::fixture::configured_connection) that opens an in-memory DuckDB connection and applies pool::configure_connection, and reroutes the 12 raw duckdb::Connection::open_in_memory() call sites across the five files above through it, so test connections carry the same autoload/autoinstall-off configuration product connections already carry.
Tests+mutation: new test pool::tests::a_connection_from_the_fixture_helper_opens_with_extension_autoload_and_autoinstall_off asserts current_setting('autoload_known_extensions') and current_setting('autoinstall_known_extensions') both read false on a connection from the helper; mutation: the helper skips the configure_connection call -> the test fails by name (both settings read true).
Out-of-scope: no ADR touched, no wire/data-plane change (protocol/** untouched), no new dependency/feature/build-script change, no new user-visible string, no undo class, no cancellation vocabulary, no lease-class/capacity change, no security-posture change (configure_connection's statement and effect are unchanged, only its set of callers grows).
```

Budget: declared <= 150 insertions + deletions (see Scope line).
