# CUT-STATE — sql-filter cut, phases P0 / P1

**Untracked** (`NIGHT-STATE.md` / `CUT-STATE-import-layout.md` pattern — this is a fresh file for
this cut; the import-layout cut's record is archived as `CUT-STATE-import-layout.md`, untouched by
this piece). Piece scope: `NEXT-CUT.md` phases P0 and P1 only — the `json_serialize_sql`
feasibility probe (hard gate), and `protocol/skp`'s `Filter` type / `ViewportQueryRequest.filter` /
`SKP_VERSION` bump / fixtures. No admission logic, no engine `build_sql`, no kernel validation
wiring (those are P2–P4). Budgets: P0 20 min, P1 45 min (ceilings, not targets).

Branch: `cut/sql-filter`, stacked on `cut/import-layout`.

---

## Phase P0 — feasibility probe: **PASSED**

**Question:** from the bundled DuckDB build `engine/Cargo.toml` actually links (`duckdb =
"1.10505.0"`, features `["bundled", "parquet"]` — the same crate/feature set `engine/` depends on),
is `json_serialize_sql` reachable, does a malformed parse return its own error rather than panic,
and does a WHERE-style boolean expression wrapped in a `SELECT` expose a recognizable expression
tree?

**Mechanism:** a throwaway example, `engine/examples/pilot_json_serialize_sql.rs` — built, run, and
deleted (the same disposal convention `CUT-STATE-import-layout.md` phase 0b's `pilot_page_index.rs`
used: not retained, none of its numbers are a measurement, this is a reachability probe only).
Command: `cargo run --release -p spatial-engine --example pilot_json_serialize_sql`. Console
captured before deletion: `target/slice-evidence/sql-filter/logs/p0-probe-console.log`. Wall time:
compile 4–12 s + run, seconds total — nowhere near the 20-minute budget.

### Findings

1. **A passing parse works, unparameterized:** `SELECT json_serialize_sql('SELECT 1 WHERE x > 3')`
   returns `{"error":false,"statements":[...]}` — 864 bytes, a full expression tree.
2. **A failing parse does not panic and does not even surface as a Rust-level `Err`** — it succeeds
   at the SQL-execution layer and returns its own error *inside* the JSON payload:
   `SELECT json_serialize_sql('SELECT FROM WHERE this is not sql (((')` →
   `{"error":true,"error_type":"parser","error_message":"syntax error at or near \"WHERE\"","position":"12","error_subtype":"SYNTAX_ERROR"}`.
   This is the "returns its error rather than panicking" condition the piece asks for, satisfied by
   an `error: true` field a caller must check, not by a `Result::Err` — **P3's admission code must
   check the JSON's own `"error"` field**, not rely on `query_row` returning `Err` for a malformed
   inner SQL string.
3. **A WHERE-style boolean expression, wrapped in `SELECT 1 WHERE ( <predicate> )`, exposes a real
   expression tree with recognizable node types.** Example (`zone = 3 AND area > 100.0`): top-level
   `"where_clause"` is a `"class":"CONJUNCTION"` / `"type":"CONJUNCTION_AND"` node with two
   `"class":"COMPARISON"` children (`"type":"COMPARE_EQUAL"`, `"type":"COMPARE_GREATERTHAN"`), each
   with `"class":"COLUMN_REF"` (`"column_names":["zone"]` / `["area"]`) and `"class":"CONSTANT"`
   (`"type":"VALUE_CONSTANT"`) leaves. A second predicate (`(a = 1 OR b = 2) AND NOT c`) additionally
   showed `"type":"CONJUNCTION_OR"` and a `"class":"OPERATOR"` / `"type":"OPERATOR_NOT"` node with a
   `children` array (not `left`/`right`) — worth noting for P3's walker, which must handle both
   shapes. **Node-type names observed, three-plus as asked:** `COMPARISON` (with
   `COMPARE_EQUAL`/`COMPARE_GREATERTHAN`), `CONJUNCTION` (`CONJUNCTION_AND`/`CONJUNCTION_OR`),
   `COLUMN_REF`, plus `CONSTANT`/`VALUE_CONSTANT` and `OPERATOR`/`OPERATOR_NOT`.
4. **A real binder finding, not just a reachability fact:** passing the predicate text as a bare `?`
   bind parameter to `json_serialize_sql(?)` **fails** — `Invalid type Error: json_serialize_sql
   first argument must be a VARCHAR` — even though the bound value is a `&str`. The working form is
   `json_serialize_sql(CAST(? AS VARCHAR))`; re-tried the bare `?` form a second time after the cast
   form had already run on the same connection (probe 4) to rule out a one-off binder-inference
   fluke, and it still failed identically. **P3 must standardize on `CAST(? AS VARCHAR)`** for this
   call, not a bare placeholder, or bind the parameter with an explicit `duckdb` type hint if the
   crate's API offers one — this probe used the array-literal `[value]` binding form
   (`conn.query_row(sql, [x], ...)`), not a typed `params![]` macro; a typed macro might avoid the
   inference gap, but that's untested here and left for P3, not assumed.

**Full JSON samples** (both the compact and pretty-printed forms for probe 3, plus probes 1/2/4/5)
are in `target/slice-evidence/sql-filter/logs/p0-probe-console.log` — not reproduced in full above,
excerpted to the shapes that matter.

**Verdict: P0 PASSED — not a hard-gate stop.** P3 is not blocked. Two concrete implementation notes
carried forward for P3 (not acted on in this piece, which is P0/P1 only): (a) check the JSON's own
`"error"` boolean, don't rely on a Rust `Err`; (b) bind the predicate string via
`CAST(? AS VARCHAR)`, not a bare `?`.

---

## Phase P1 — `protocol/skp`: `Filter` type, `ViewportQueryRequest.filter`, version bump, fixtures

### 1. `SKP_VERSION` bump

`protocol/skp/src/v0/mod.rs`: `SKP_VERSION` → `"skp/0.1"`, `==` comparison untouched (the comparison
site, `kernel/src/skp.rs::check_version`, was not touched — it already compares the imported
constant with `==` and needed no logic change, only its own literal test fixture updated, see §4).
Grepped every occurrence of the literal `"skp/0"` across the repo before starting and updated every
hit that is source or fixture (not `NEXT-CUT.md`'s own brief text, and not `SKP-V0.md`'s two
existing occurrences — design note item 2 says `SKP-V0.md` keeps its old §§1–6 text unrewritten; a
"v0.1" section is *appended*, which is P6's job, not this piece's).

### 2. `Filter` type (`protocol/skp/src/v0/commands.rs`)

```rust
pub const FILTER_DIALECT_DUCKDB_EXPR_0: &str = "duckdb-expr/0";

pub struct Filter { pub predicate: String, pub dialect: String }

impl Filter {
    pub fn new(predicate: impl Into<String>, dialect: impl Into<String>) -> Result<Self, String>
    // refuses any dialect != FILTER_DIALECT_DUCKDB_EXPR_0
}
// custom Deserialize: an inner `#[serde(deny_unknown_fields)]` Raw{predicate,dialect} struct,
// routed through Filter::new so the same check backs both construction and deserialization
// (following the file's own TryFrom+custom-Deserialize convention already used by
// `CancelKey`/`DatasetHandle`/`StreamHandle` in `handles.rs` and `HexF64`/`DecU64` in `codec.rs` --
// `commands.rs` itself had no prior field-level validation to mirror, so the crate's established
// pattern was used instead of inventing a new one).
```

`ViewportQueryRequest` gains `pub filter: Option<Filter>` as its last field. No `#[serde(default)]`
anywhere — the field must be present (as `null` or a value) on every wire request, exactly the
`bbox_crs` discipline (an absent key is a deserialize failure, not a tolerated omission; a present
`Option<T>` with no `skip_serializing_if` always serializes to `null` when `None`). `describe` is
untouched (design note item 1). `deny_unknown_fields` kept on every derived struct.

**New unit tests in `commands.rs`** (mirroring the file's existing style):
`filter_accepts_its_one_admitted_dialect_and_round_trips`,
`filter_refuses_any_other_dialect_at_construction_and_at_deserialization`,
`filter_deserialization_refuses_unknown_fields_too`,
`viewport_query_request_carries_filter_as_explicit_null_when_absent`,
`viewport_query_request_with_a_filter_round_trips`.

### 3. Fixtures

- `protocol/skp/tests/data/v0-viewport_query-request.json`: added `"filter": null`.
- **New:** `protocol/skp/tests/data/v0-viewport_query-request-with-filter.json` — `bbox`/`bbox_crs`/
  `limit` all `null`, `filter: {"predicate": "zone = 3 AND area > 100", "dialect":
  "duckdb-expr/0"}`, isolating the new field.
- `v0-open_dataset-request.json`, `v0-describe-request.json`, `v0-cancel-request.json`,
  `v0-close_dataset-request.json`: `"skp"` bumped to `"skp/0.1"`. (Response fixtures carry no `skp`
  field; untouched.)
- `protocol/skp/tests/fixtures.rs`: new test
  `viewport_query_request_with_a_filter_round_trips`; the with-filter fixture added to
  `every_request_fixture_carries_the_current_skp_version`'s file list.

### 4. TS mirror (`frontends/shell/src/skp/`)

- `types.ts`: `SKP_VERSION = "skp/0.1"`; new `FILTER_DIALECT_DUCKDB_EXPR_0` const; new `Filter`
  interface (`predicate: string; dialect: string`); `ViewportQueryRequest.filter: Filter | null`
  added as the last field.
- `__tests__/fixtures.test.ts`: the `viewport_query` test's key-set assertion gains `"filter"`, plus
  `expect(req.filter).toBeNull()`; new test `"viewport_query request with a filter present
  (skp/0.1)"` round-tripping the new fixture; the with-filter fixture added to the SKP_VERSION-carry
  list, mirroring the Rust side exactly (both lists now agree in content and order).

### 5. Off-scope breakage found and fixed as a minimal, mechanical necessity (not a scope expansion)

Bumping `filter` onto `ViewportQueryRequest` (a plain, non-`#[serde(default)]` field) broke three
Rust **struct-literal** construction sites that build `ViewportQueryRequest` directly (not via JSON)
in `kernel/tests/skp_admission.rs` (lines ~77, ~273, ~379) — added `filter: None,` to each, a
one-line addition, no logic change. Also updated `kernel/src/skp.rs`'s own
`version_mismatch_is_refused_before_anything_else` test, which hardcoded the literal `"skp/0"`
rather than the `SKP_VERSION` const, to `"skp/0.1"` — this test would otherwise fail (not fail to
compile) after the bump. Both are outside this piece's literal "Key files" list but are mechanical
consequences of the version/field changes this piece *was* asked to make; leaving them broken would
hand the next piece a red `cargo test -p spatial-kernel` for a reason unrelated to anything it did.
**Not touched:** `frontends/shell/src/skp/client.ts`'s `viewportQuery()` function still does not send
a `filter` field at all — this is a real gap (a live Tauri `viewport_query` invoke from the shell
today would now fail to deserialize on the Rust side, missing the required `filter` key), but
`client.ts` is explicitly P5's file ("thin typed client wrapper... client only"), not P1's, and no
test in this piece's required verify step exercises the real invoke path end-to-end (`viewportQuery`
is always mocked at the module boundary in `viewportStreamManager.test.ts`, so the gap is invisible
to `npm run test` today). **Flagged for P5, not fixed here.**

---

## Verify — both required commands, tails

**`cargo test -p spatial-skp`** (full pass, log:
`target/slice-evidence/sql-filter/logs/p1-cargo-test-spatial-skp.log`):

```
running 22 tests
...
test result: ok. 22 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

     Running tests\fixtures.rs (target\debug\deps\fixtures-eec5ba8304f5b153.exe)

running 8 tests
...
test result: ok. 8 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
```

**`npm run typecheck`** (shell): clean, no output, exit 0.

**`npm run test`** (shell, log: `target/slice-evidence/sql-filter/logs/p1-shell-test.log`):

```
 ✓ src/skp/__tests__/fixtures.test.ts (8 tests) 19ms
 ...
 Test Files  20 passed (20)
      Tests  137 passed (137)
```

**Not required by this piece's verify step, run anyway as a sanity check on the two kernel edits in
§5 above** (both green, logs `target/slice-evidence/sql-filter/logs/p1-kernel-skp-admission.log` and
inline): `cargo test -p spatial-kernel --test skp_admission` → `7 passed; 0 failed` (including the
`cancel_reaches_the_producer_directly_and_is_observed_on_its_own_clock` test that
`CUT-STATE-import-layout.md` phase 3 recorded as intermittently racy elsewhere — passed here);
`cargo test -p spatial-kernel --lib skp::` → `10 passed; 0 failed`. `cargo check -p spatial-kernel
--tests` and `cargo check` from `frontends/shell/src-tauri` (the Tauri backend crate, excluded from
the workspace, checked from its own manifest) both clean.

---

## Deviations from the piece as declared

**None in scope or gate outcome.** P0 needed a second probe iteration (adding the `CAST(? AS
VARCHAR)` form after the bare-`?` form failed) — that is itself the intended content of the probe,
not a deviation; both attempts and the reasoning are recorded above. P1 required three small
off-scope-but-mechanical fixes (§5) to keep `cargo test -p spatial-kernel` compiling and its
existing version test meaningful; none change behavior, all are one field/one literal each, and each
is disclosed above rather than silently folded in. `frontends/shell/src/skp/client.ts` was
deliberately left unchanged (P5's file) even though it now sends a wire-incomplete
`viewport_query` request in the real (unmocked) path — flagged, not fixed, per P1's literal file
scope.

## State left for this piece, before commit

```
git status --porcelain
 M frontends/shell/src/admission/admitDataset.test.ts
 M frontends/shell/src/skp/__tests__/fixtures.test.ts
 M frontends/shell/src/skp/types.ts
 M kernel/src/skp.rs
 M kernel/tests/skp_admission.rs
 M protocol/skp/src/v0/commands.rs
 M protocol/skp/src/v0/mod.rs
 M protocol/skp/tests/data/v0-cancel-request.json
 M protocol/skp/tests/data/v0-close_dataset-request.json
 M protocol/skp/tests/data/v0-describe-request.json
 M protocol/skp/tests/data/v0-open_dataset-request.json
 M protocol/skp/tests/data/v0-viewport_query-request.json
 M protocol/skp/tests/fixtures.rs
?? CUT-STATE-import-layout.md
?? CUT-STATE.md
?? E2E-STATE.md
?? NEXT-CUT.md
?? NIGHT-STATE.md
?? protocol/skp/tests/data/v0-viewport_query-request-with-filter.json
```

`CUT-STATE-import-layout.md`, `E2E-STATE.md`, `NEXT-CUT.md`, `NIGHT-STATE.md` predate this piece
(other cuts/sessions, `NEXT-CUT.md` itself retired only by this cut's own final docs commit) — none
touched. `CUT-STATE.md` (this file) stays untracked, per the piece and prior-cut convention. All
twelve modified/new source+fixture files above are staged and committed by this piece (see below);
nothing else.

**Next piece:** `NEXT-CUT.md` phase P2 — engine `ViewportQuery.filter: Option<AdmittedPredicate>`,
`build_sql` composition (`WHERE ( <predicate verbatim> ) AND <bbox> [AND ranges]`) + the
composition-as-string test matrix + identity/CRS preservation tests. `AdmittedPredicate` copies
`PublishedProjection`'s single-constructor discipline (`engine/src/attributes.rs`). P0's two carried
notes (§ above) are P3's concern (admission), not P2's — P2 only needs `Option<AdmittedPredicate>`
to exist as a type it can compose into SQL text; it does not itself call `json_serialize_sql`.

---

## Phase P2 — engine composition: `AdmittedPredicate`, `build_sql`, tests, kernel pass-through

### 1. `AdmittedPredicate` (`engine/src/predicate.rs`, new module)

Copies `PublishedProjection`'s single-constructor discipline (`attributes.rs`) exactly: one private
field (`text: String`), one constructor, no `pub` field, no `From<String>`. Constructor name is
`AdmittedPredicate::assume_validated(text: String) -> Self` (infallible — no `Result`, since nothing
is checked; naming discussion is in the module doc: deliberately not `new`, because "validated" would
be a false claim until P3 lands). Accessor `sql_text(&self) -> &str` returns the text unmodified. The
module doc and the struct doc both state plainly, in the position the brief asked for, that structural
/ namespace / bind admission is **not** performed here and arrives in P3 (wired into the constructor's
only caller), with P4 moving the call site itself (`kernel/src/skp.rs`) behind that admission.
Re-exported at the crate root: `pub use predicate::AdmittedPredicate;` (`lib.rs`), alongside the new
`pub mod predicate;`.

### 2. `ViewportQuery.filter` and `build_sql` composition (`engine/src/stream.rs`)

`ViewportQuery` gains `pub filter: Option<AdmittedPredicate>` as its last field; `all()` and
`viewport()` set it to `None`; a new builder `with_filter(self, AdmittedPredicate) -> Self` mirrors
`with_limit`.

`build_sql` (~line 1116, shifted by the `ViewportQuery` edit) computes `filter_clause: Option<String>`
once (`q.filter.as_ref().map(|f| format!("({})", f.sql_text()))` — the one added paren pair, text never
rewritten/normalized/case-folded) and a local closure `open_where(&mut sql)` that opens the clause:
`" WHERE "`, plus `"{filter_clause} AND "` when a filter is present. Every one of `build_sql`'s
`WHERE`-opening call sites (the plain bbox-only scan, the row-group-pruned branch and its bbox-only
fallback, and the fixed-grid index-narrowed branch) was changed to call `open_where` instead of
literally writing `" WHERE "`; the bbox-absent, filter-present case (previously no `WHERE` at all) is
a new `else if let Some(f) = &filter_clause` arm that writes `" WHERE {f}"` directly (not through
`open_where`, which always leaves a trailing `AND` for a condition this arm has none of). ORDER BY and
LIMIT composition is untouched — both statements are appended after this block exactly as before.

**Deviation from the brief's literal illustrative string, disclosed:** `NEXT-CUT.md`'s canonical
string is `WHERE ( <predicate verbatim> ) AND <bbox> [AND ranges]` — bbox before ranges. The existing
(pre-P2, experimental-only, not product-path) row-group and fixed-grid index branches already compose
`WHERE (ranges) AND <bbox>` — ranges *before* bbox — and P2 did not reorder that internal pairing; it
only prefixes the predicate before whatever that pairing already produces, per the piece's own
essentials restatement ("user predicate leftmost, bbox and any `FilterPlan` ranges AND-composed
after"), which does not mandate swapping bbox and ranges relative to each other. Net order with a
filter and ranges both present: `WHERE (predicate) AND (ranges) AND <bbox>`. `IndexUse::Off` is the
only planner any product entry point (`Dataset::stream`, `Dataset::stream_for_publish`) selects, so
this only matters for the `#[doc(hidden)]` experimental seams, which the composition test matrix does
not exercise (matrix is `{predicate}×{bbox}×{limit}` only, no `ranges` dimension, matching the piece's
literal item 3).

### 3. Composition-as-string test matrix (`engine/src/stream.rs`, `mod tests::filter_composition`)

`build_sql` is a private method, so the matrix lives as a unit test inside `stream.rs` itself (not an
integration test), gated `#[cfg(feature = "fixture")]` (explicit, rather than relying on the crate's
own `[dev-dependencies]` self-reference to have turned the feature on implicitly) because it needs a
real opened `Dataset` from the fixture writer. Two tests:

- `the_where_composition_matrix_matches_the_declared_rule_exactly` — the full 2×2×2 = 8-cell matrix
  `{predicate present/absent} × {bbox present/absent} × {limit present/absent}`, each cell asserted
  against a literal expected SQL string built from `PREFIX = "SELECT \"id\" AS \"id\", \"geometry\"
  FROM read_parquet(?)"` and `BBOX_COND = "\"bbox\".\"xmin\" <= ? AND \"bbox\".\"xmax\" >= ? AND
  \"bbox\".\"ymin\" <= ? AND \"bbox\".\"ymax\" >= ?"` (the fixture's default covering path). Predicate
  used: `zone = 'residential'`. All 8 assertions pass, confirming: no filter/no bbox/no limit emits the
  bare `SELECT`; a filter alone emits `WHERE (zone = 'residential')`; bbox alone is unchanged from
  before this piece (`WHERE <bbox-cond>`, no parens); filter+bbox together is exactly the brief's
  canonical string, `WHERE (zone = 'residential') AND <bbox-cond>`; `LIMIT` composes identically in
  every row.
- `the_predicate_text_rides_verbatim_never_rewritten_or_case_folded` — odd internal whitespace and
  mixed case (`"  Zone = 'Residential'  "`) reaches the emitted SQL unmodified inside its one paren
  pair.

### 4. Identity/CRS preservation subset test (`engine/tests/filter_composition.rs`, new integration test)

Uses the engine's `--features fixture` writer with `AttributeMode::CategoricalZone` (`zoned_spec`,
4 000 features) — the only attribute column any fixture in this crate writes, four named values
(`ZONE_VALUES`) plus NULL. Predicate: `zone = 'residential'` (`ZONE_VALUES[0]`). Test
`a_filtered_stream_is_an_id_keyed_subset_with_byte_identical_rows_and_envelope`:

- Asserts the fixture actually produced every zone value plus at least one NULL (guards against a
  vacuous subset claim).
- Drains both an unfiltered (`ViewportQuery::all()`) and a filtered (`.with_filter(...)`) stream into
  `BTreeMap<id, geometry_digest>` — `geometry_digest` is a byte-for-byte copy of
  `engine/tests/first_batch_and_pruning.rs`'s existing helper (SHA-256 over decoded GeoArrow
  coordinates, in order; not WKB, which the engine never re-emits), duplicated rather than shared
  because this workspace's integration test binaries do not import from one another.
- Asserts the filtered set is non-empty, strictly smaller than the unfiltered set (predicate excludes
  real rows, not vacuous), every filtered id exists in the unfiltered map, and — the byte-identical-
  payload check — the two digests agree at every shared id.
- Asserts the two streams' envelope schemas, decoded from the wire (`StreamReader::schema()`, not from
  `BatchStream::envelope()`), are `==` (Arrow `Schema` `PartialEq`, fields + metadata HashMap both) —
  the operational form of "the envelope schema metadata is byte-identical filtered vs. unfiltered".

### 5. Kernel pass-through (`kernel/src/skp.rs::build_viewport_query`)

`req.filter: Option<spatial_skp::v0::Filter>` maps to `AdmittedPredicate::assume_validated(f.predicate
.clone())` via `ViewportQuery::with_filter`, `None => query` otherwise. A comment at the call site
states explicitly that this is a direct, deliberately unvalidated pass-through, names what P3 adds
(structural/namespace/bind admission) and what P4 moves (the call site itself, behind that admission,
pre-lease/pre-mint on `spawn_blocking`) — matching the piece's instruction not to build any validation
in this piece.

### 6. The flagged mechanical fix (CUT-STATE §5, P1): `frontends/shell/src/skp/client.ts`

One-line addition to `viewportQuery()`'s request object literal: `filter: null` (with a comment citing
the `bbox_crs` discipline and pointing at P5 for the real filter-sending client API). **No existing
test extended**: checked `frontends/shell/src/skp/__tests__/` and every `*.test.ts` that mocks
`@tauri-apps/api/core`'s `invoke` directly (`admitDataset.test.ts`) — none of them exercises
`viewportQuery`'s request shape; `viewportStreamManager.test.ts` mocks `../skp/client` itself at the
module boundary (asserting only the 4-arg call to the exported function, unaffected by this change),
which is exactly the gap P1 flagged. The piece's instruction to extend an existing test was
conditional ("if one covers the request shape") and none does, so no test was added — disclosed here
per the piece's own request rather than silently expanded in scope.

### Verify — both required commands, tails

**`cargo test -p spatial-engine --features fixture`** (full pass; lib unit tests: 79 passed, including
`predicate::tests::the_text_comes_back_exactly_as_given_never_rewritten` and both
`stream::tests::filter_composition::*` tests; new integration test file `filter_composition.rs`: 1
passed; every other integration test file unchanged and still green):

```
test result: ok. 79 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.20s
...
     Running tests\filter_composition.rs (...)
running 1 test
test a_filtered_stream_is_an_id_keyed_subset_with_byte_identical_rows_and_envelope ... ok
test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.44s
```
(every other suite in the crate: all green, matrix/verbatim tests included in the 79.)

**`cargo test -p spatial-kernel`** (full pass; `skp_admission.rs` 7/7, `end_to_end.rs` 9/9 including
`h1_a_viewport_filter_selects_a_subset_and_it_still_decodes`, `publish.rs` 21/21, everything else
green — no test in this crate constructs `ViewportQueryRequest.filter` yet beyond P1's own fixtures,
so nothing here exercises the new pass-through end-to-end; that is P4's gate):

```
test result: ok. 77 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.02s   (lib)
...
test result: ok. 7 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 4.66s     (skp_admission.rs)
```

**`cd frontends/shell && npm run verify`** (`tsc --noEmit && vite build` then `vitest run`, full pass):

```
✓ built in 3.62s
 Test Files  20 passed (20)
      Tests  137 passed (137)
```

**Also run, not required by this piece's verify step, sanity checks on the seven mechanical
struct-literal fixes** (`engine/tests/slice.rs`, `kernel/tests/{permission_boundary,scale_pass,
scale_pass_a6,verify_bundle}.rs`, `kernel/src/bin/publish-bundle.rs` — each gained `filter: None,`):
`cargo check --workspace --tests --features spatial-engine/fixture` clean; `cargo check` from
`frontends/shell/src-tauri`'s own manifest clean.

### Deviations from the piece as declared

1. **Composition order for the ranges/bbox pairing** in the two experimental-only planner branches
   (row-group-pruned, fixed-grid index-narrowed) — disclosed in full under §2 above. Not reachable
   from any product entry point; not covered by the composition matrix (which has no `ranges`
   dimension, matching the piece's literal item 3).
2. **No new client-side test** for `client.ts`'s `viewportQuery` request shape — disclosed in full
   under §6. The piece's instruction was conditional on one already existing; none does.
3. Everything else matches the piece as declared: `AdmittedPredicate::assume_validated` is the exact
   constructor name given; `build_sql`'s composition is the brief's literal string in the common
   (no-ranges) case, which is the case both the matrix test and the identity/CRS test exercise; the
   kernel pass-through is a direct, commented, unvalidated mapping with no admission logic.

### State left for this piece, before commit

```
git status --porcelain
 M engine/src/lib.rs
 M engine/src/stream.rs
 M engine/tests/slice.rs
 M frontends/shell/src/skp/client.ts
 M kernel/src/bin/publish-bundle.rs
 M kernel/src/skp.rs
 M kernel/tests/permission_boundary.rs
 M kernel/tests/scale_pass.rs
 M kernel/tests/scale_pass_a6.rs
 M kernel/tests/verify_bundle.rs
?? engine/src/predicate.rs
?? engine/tests/filter_composition.rs
```
(`CUT-STATE-import-layout.md`, `E2E-STATE.md`, `NEXT-CUT.md`, `NIGHT-STATE.md`, `CUT-STATE.md` itself:
untracked, unchanged by this piece's commit, per the established convention.) All twelve
modified/new files above are staged and committed by this piece; nothing else.

**Next piece:** `NEXT-CUT.md` phase P3 — admission: allowlist walk over DuckDB's parse tree (P0's
`json_serialize_sql` + `CAST(? AS VARCHAR)` findings), namespace check against `file_schema()`, a
zero-row surrogate bind check, declared ceilings, the exhaustive `skp.filter_*` refusal enum, and the
adversarial corpus from the design note (each row asserting a *specific* code). Depends on P0 (passed).
`AdmittedPredicate::assume_validated` is P3's constructor to call *after* checking, not before; P3 does
not touch `build_sql` or the composition tests P2 leaves green.

---

## Phase P3 — admission: allowlist walk, namespace check, surrogate bind, ceilings, refusal enum, corpus

All new/changed code lives in `engine/src/predicate.rs` (grown in place — the crate has no
submodule-directory precedent anywhere else, so this piece followed that convention rather than
introducing `engine/src/predicate/admission.rs`) plus one new integration test file,
`engine/tests/predicate_admission.rs`. **`kernel/` untouched**, as instructed.

### 1. The allowlist (Stage 1, `structural_admit` + `walk_expr` + `expect_bare_select_wrapper`)

Predicate text is wrapped `SELECT 1 WHERE ( <predicate> )` (P0's proven shape) and parsed via
`json_serialize_sql(CAST(? AS VARCHAR))` over the engine's own DuckDB connection — never a
hand-rolled lexer. The JSON payload's own `"error"` boolean is checked (P0: a malformed inner SQL
string never surfaces as a Rust `Err`); a missing or non-boolean `"error"` key is treated as `true`
(refuse-by-default). Admitted node classes, by DuckDB's own `class`/`type` names (all confirmed
against real `json_serialize_sql` output, evidence below):

- `COLUMN_REF` — exactly one `column_names` entry (an unqualified name; this predicate never names a
  table). Collected for Stage 2.
- `CONSTANT` (`VALUE_CONSTANT`) — a literal. Dollar-quoted strings (`$$...$$`) parse to this same
  node, indistinguishable from `'...'` — see the comment-handling/dollar-quoting decision below.
- `CONJUNCTION` (`CONJUNCTION_AND` / `CONJUNCTION_OR`) — recurses into every `children` entry.
- `COMPARISON` — every `COMPARE_*` type admitted uniformly (`=`, `<`, `>`, `<>`, `<=`, `>=`, ...);
  recurses into `left`/`right`.
- `BETWEEN` (`COMPARE_BETWEEN`) — recurses into `input`/`lower`/`upper`.
- `OPERATOR` — three admitted `type`s only: `OPERATOR_NOT`, `OPERATOR_IS_NULL`,
  `OPERATOR_IS_NOT_NULL` (each exactly one child), and `COMPARE_IN` (DuckDB's own class for a
  **literal** `IN` list — `x IN (SELECT ...)` is a different node entirely, `SUBQUERY`, and is
  refused there, never reaching this arm at all): the needle (first child) walks normally, every
  remaining child **must** be `CONSTANT` or the whole node is refused. Any other `OPERATOR::type` is
  refused by name.
- `FUNCTION` — refused unconditionally **except** two small, named sets, both requiring
  `is_operator: true` (DuckDB represents `x + 1`, `x LIKE 'a%'` and `random()` all as `FUNCTION`
  nodes — there is no separate arithmetic-operator class to allowlist by class alone): arithmetic
  `function_name` in `{+, -, *, /}` (any arity, recurses into every child), and pattern
  `function_name` in `{"~~", "~~*"}` (LIKE / ILIKE) with **exactly two children and the second must
  be `CONSTANT`** — the brief's "literal pattern" qualifier, enforced structurally.
- Refused explicitly, by name: `CAST` (`OPERATOR_CAST`), `SUBQUERY`, `PARAMETER`
  (`VALUE_PARAMETER`), `STAR`.
- Refused by the catch-all arm, naming whatever class was found: anything else. **Every `match` in
  the walker is allowlist-shaped — an unrecognized `class` or `OPERATOR`/`FUNCTION` sub-type is
  always the final, unconditional-refusal arm, never a silent pass.**

**The docs/09 security-boundary sentence** (brief item 5, verbatim intent) is in the module doc and
repeated in `walk_expr`'s own doc: the no-subquery/no-function-call rules are what stop a
"read dataset A" grant from becoming "read any local file" via `read_csv` in a subquery (or any
other function call reached through a filter).

**A structural finding beyond the where_clause itself, found while building the walker, not
anticipated by the brief.** The wrapper closes its own `)` on the same line right after the
caller's text. If that text contains an unbalanced `)`, everything after it lands in the **same**
top-level `SELECT_NODE`, not inside `where_clause`: `1=1) GROUP BY 1 HAVING count(*) > 0 --` parses
to one valid statement whose `where_clause` is an innocuous `1=1`, while `group_expressions`/
`having` silently carry `count(*)`. A walker that only inspected `where_clause` would have admitted
this whole predicate. `expect_bare_select_wrapper` closes the gap: it asserts `node.type ==
"SELECT_NODE"`, `modifiers == []`, `cte_map.map == []`, `select_list` is exactly the wrapper's own
`SELECT 1`, `from_table.type == "EMPTY"`, `group_expressions == []`, `group_sets == []`,
`aggregate_handling == "STANDARD_HANDLING"`, `having == null`, `sample == null`, `qualify == null`,
and the statement's own `named_param_map == []`, refusing by name on the first deviation — *before*
`where_clause` is ever walked. A sibling breakout, `1=1) UNION SELECT 1 --`, is caught by the same
function's very first check: the top-level node becomes `SET_OPERATION_NODE`, not `SELECT_NODE`.
Both are now standing regression rows in the adversarial corpus (§5), not just anecdote.

> **Correction (reviewer gate over P1–P4, filed below as "Reviewer gate fix — B1"): the sentence
> above overclaimed.** `expect_bare_select_wrapper` (renamed `expect_predicate_operands` by the
> fix) closes the **clause-breakout** class only — a predicate that closes admission's wrapper
> paren early and attaches a *new clause* (`GROUP BY`/`HAVING`/`UNION`) to the same top-level
> statement. It did **not** close, and was never designed to close, a predicate that closes the
> same paren early and **reassociates within `where_clause` itself** (`zone = 'residential') OR
> (1=1`, admitted, then bypassed the real composed bbox condition because `AND` binds tighter than
> `OR`) or that uses a trailing comment to eat everything real composition would have appended
> after the predicate (`1=1) --`, admitted, then dropped the caller's own `LIMIT`). Both are
> genuine escapes the where-clause-only shape of the old check could not see, because they never
> touch any of the fields that check inspects — the reassociation and the comment both happen
> *inside* `where_clause`. What actually closes the rest is the **AND-sentinel** the fix adds (see
> "Reviewer gate fix — B1" below): the next reader should treat the paren-imbalance class as only
> **partially** handled by this section on its own.

### 2. Declared ceilings (ADR-010 rule 6)

- **`MAX_PREDICATE_BYTES = 4096`** — checked on the raw predicate string, **before** it is ever
  handed to DuckDB's parser. Chosen generously above any predicate a filter panel would plausibly
  build (dozens of `AND`/`OR`-joined conditions fit in low hundreds of bytes) and small enough to
  bound the parser's own input size regardless of what the text contains.
- **`MAX_PREDICATE_DEPTH = 32`** — checked during the walk, incremented once per recursive call.
  Real predicates nest a handful of levels (an `OR` of a few `AND`s of comparisons is depth 3–4); 32
  is generous headroom while still small.
- **Why two independent ceilings, not one.** Measured directly (evidence below): wrapping a
  `COMPARISON` in redundant grouping parentheses — `((((zone = 'r'))))`, any depth — costs the
  parsed tree **zero** extra levels; DuckDB's parser does not represent a grouping paren as its own
  node at all. So a "paren-depth bomb" built purely of redundant parentheses cannot be caught by a
  depth ceiling on the parsed tree — it is caught by the **byte** ceiling instead, because at
  `MAX_PREDICATE_BYTES` bytes there simply is not room for enough parens to matter, however they
  parse. The depth ceiling exists for constructs that *do* genuinely nest — `NOT`-chains around a
  bare reference, or alternating `AND`/`OR` inside explicit parens — and is independent of predicate
  length (measured: 40 levels of `NOT (...)` around a bare column costs only ~240 bytes).

### 3. Namespace admission (Stage 2, `namespace_admit`)

The admitted namespace is `dataset.file_schema()` minus the geometry column minus every column
whose type fails `crate::attributes::admit_attribute_type` (reused directly, not re-implemented).
For each column the walk collected: identity-alias check first (below), then geometry-column check
(`ColumnNotFilterable`), then existence (`UnknownColumn`), then type admission
(`ColumnNotFilterable`, reusing `admit_attribute_type`'s own message as `reason`).

**Identity-alias rule, honesty note as instructed.** Grepped every product call site before writing
this: `kernel/` always opens through `Dataset::open_cancellable` / `open_with_connections`, neither
of which is ever handed a declared identity — `Dataset::open_with_declared_identity` (the only
constructor that can produce `IdSource::Mapped`) is called **only** from this crate's own tests
(`engine/tests/{identity,connection_reuse,publish_stream,spatial_index}.rs`,
`kernel/tests/{indexed_budgets,scale_pass}.rs`'s own test-only Dataset construction). So the check
implemented (`identity_alias_ambiguity`) fires at the seam where the ambiguity **would** surface —
a `Mapped` identity whose source column differs from the wire's `id`, *and* the file separately
carries its own, unrelated column literally named `id` — not because any product path reaches it
today.

### 4. Bind admission (Stage 3, `bind_admit`)

**One deliberate deviation from the brief's illustrative shape, disclosed.** The brief's example
puts the predicate directly in a `WHERE` clause over the surrogate (`SELECT ... WHERE <pred>`) and
asserts it "binds and its type is BOOLEAN". This module instead puts the predicate in the **select
list** — `SELECT (<predicate>) AS "__predicate_result" FROM (SELECT <namespace columns as
CAST(NULL AS type)>) AS "__surrogate" LIMIT 0` — and reads the executed (zero-row) result schema's
own inferred Arrow type for that one column, comparing it to `DataType::Boolean` directly. Reason:
putting the predicate in `WHERE` would only prove DuckDB accepted it *there*, which says nothing
about whether DuckDB silently coerced a non-boolean expression to satisfy `WHERE`'s own requirement
— exactly the "int-to-bool coercion" the brief says must be refused, not merely avoided by
construction. Reading the expression's own declared type directly is what actually asserts it. The
`LIMIT 0` + `query_arrow` + `.get_schema()` pattern is not new to this piece — it is exactly
`dataset.rs::probe_schema`'s own existing pattern for reading a schema with **no file I/O**, reused
here so the surrogate relation (built entirely from `CAST(NULL AS ...)` literals) never touches a
file either. `bind_admit` never runs on text `structural_admit` has not already approved — the
predicate is interpolated as SQL text there, safely, only because the allowlist walk has already
constrained what it can contain.

### 5. Typed refusal enum (`FilterError`)

Eleven variants, a deliberate 1:1 field-for-field match to `NEXT-CUT.md` design essential 5's
`skp.filter_*` wire taxonomy: `DialectUnsupported{declared}` · `Unparsable{detail}` ·
`NotASingleExpression{statements}` · `ConstructNotAdmitted{construct}` · `UnknownColumn{column}` ·
`ColumnNotFilterable{column,reason}` · `IdentityAliasAmbiguous{column,source_column}` ·
`NotBoolean{inferred_type}` · `TooLong{limit,saw}` · `TooDeep{limit,saw}` ·
`RejectedByBinder{detail}`. `Display` follows `EngineError`'s own verbose "refused: ..." style; both
implement `std::error::Error`. **`DialectUnsupported` is never constructed by this crate today** —
`protocol/skp`'s `Filter::new` already refuses any dialect but `duckdb-expr/0` before predicate text
reaches `engine/` (P1) — it exists only so the eleven arms match the SKP taxonomy exactly, for a
future exhaustive match with no wildcard arm. **A connection-pool-exhaustion failure while
acquiring the connection `admit` needs folds into `RejectedByBinder`** (disclosed choice: the eleven
codes have no dedicated resource-exhaustion variant, and admission's whole purpose is to gate what
reaches the binder, so a failure to even get that far is categorized there rather than inventing a
twelfth variant).

### 6. `AdmittedPredicate::admit` — the real constructor

Signature: `AdmittedPredicate::admit(text: impl Into<String>, dataset: &Dataset) -> Result<Self,
FilterError>` — **one deliberate deviation from the brief's literal `admit(text, schema/dataset
context, conn)` three-argument sketch, disclosed.** `crate::pool::Lease::connection` is
`pub(crate)` **by the pool module's own stated invariant** ("the connection itself never leaves
this crate" — `pool.rs`), so a public `admit` accepting a raw `&duckdb::Connection` would either
break that invariant or be structurally uncallable from `kernel/` (P4's real caller — `kernel` does
not, and today cannot, depend on `duckdb` at all; grepped, confirmed) without further engine
changes P4 would then owe. `admit` takes `&Dataset` alone and leases its own connection internally,
on `LeaseClass::Maintenance` — the same class `Dataset::open` itself uses for its own admission
work — so a burst of filter admissions is bounded by the dataset's own declared connection ceiling
rather than able to mint ad-hoc connections per call. The lease is released healthy **only** on
full success; every early `?` return (any refusal, at any stage) drops — and so discards — the
lease, matching `pool.rs`'s own "what cannot be confirmed is discarded" discipline for a connection
that ran arbitrary caller text through DuckDB. For unit-testing the ceilings and the walker alone
without paying for a real fixture `Dataset` on every row, the private stage-1 function
(`structural_admit`) is exercised directly against a bare `Connection::open_in_memory()` in
`predicate.rs`'s own `#[cfg(test)]` module; the full three-stage `admit` path is exercised in the
integration corpus (§7).

`AdmittedPredicate::assume_validated` is kept as a `#[deprecated]` **pub** shim (not `pub(crate)`)
exactly as the piece allows for: `kernel/src/skp.rs:454` still calls it directly (P2's pass-through)
and this piece does not touch `kernel/`. `cargo check -p spatial-kernel --tests` and `cargo check`
from `frontends/shell/src-tauri`'s own manifest both stay clean — one `#[warn(deprecated)]` warning
each, no error. **P4 removes this shim and switches that call site to `AdmittedPredicate::admit`.**

### 7. The comment-handling and dollar-quoting decisions (as asked, decided and documented)

- **Trailing `--` line comment** (`1=1 --`): refused as `Unparsable`, **not** admitted as "the
  expression before the comment". The wrapper appends its own closing `)` on the *same line*
  immediately after the caller's text; `--` comments out everything to end of line, including that
  `)`, so the wrapped statement itself fails to parse (`"syntax error at end of input"`, measured).
  This is a property of the fixed wrapper, not a special case coded for — but it is worth stating
  as a decision because a *different* wrapper (one that appended the closing paren on its own line)
  would not get this for free.
- **Bare block comment** (`/* */`, no other text): refused as `Unparsable` — `/* */` strips to
  nothing, so the wrapper becomes `SELECT 1 WHERE ()`, an empty expression
  (`"syntax error at or near \")\""`, measured).
- **Non-bare block comment** (`/* */ 1=1`): admitted structurally (block comments, unlike `--`,
  terminate within the line and do not reach the wrapper's own closing paren) — not in the
  corpus table below since it is not one of the brief's named rows, but recorded here because it is
  the natural positive control for the block-comment decision above.
- **Dollar-quoting** (`$$...$$`): **admitted**, not refused. DuckDB's parser lowers a dollar-quoted
  string to the exact same `CONSTANT`/`VALUE_CONSTANT` node a `'...'` literal produces — there is no
  distinguishing construct name left by the time this module ever sees the parsed tree, so "refuse
  by construct name" has nothing to name. `zone = $$residential$$` admits exactly like `zone =
  'residential'` (test: `dollar_quoting_and_a_positive_control_both_admit`).

### 8. A surprise from the real parser, beyond what the brief asked for: `NOT` folds a `COMPARISON`

Building the depth-ceiling corpus row surfaced a real parser behavior worth recording precisely.
`NOT (NOT (... NOT (zone = 'residential') ...))` — **any** depth, even 3 — collapses to **zero**
`OPERATOR_NOT` nodes in the parsed tree; DuckDB's parser folds `NOT` applied to a `COMPARISON` into
the comparison's own negated form (`=` ↔ `<>`, etc.) at *parse* time, repeatedly, so the whole chain
disappears regardless of length. The *same* `NOT`-chain wrapping a bare `COLUMN_REF` instead
(`NOT (NOT (... NOT (zone) ...))`) preserves full nesting at every depth tested (5 through 41).
First attempt at the depth-bomb corpus row used a `COMPARISON` body and was silently **admitted**
(caught by the corpus test failing, not by inspection) — fixed by using a bare column reference
instead, which reliably trips `TooDeep`. Both shapes' exact JSON are in
`target/slice-evidence/sql-filter/logs/p3-probe-not-folding.log`; the full construct-shape survey
(BETWEEN/IN/IS NULL/LIKE/ILIKE/arithmetic/CAST/subquery/placeholder/dollar-quote/comments/breakouts)
is in `target/slice-evidence/sql-filter/logs/p3-probe-shapes.log` — both via the same disposal
convention P0 used (`engine/examples/pilot_p3_*.rs`, built, run, deleted before commit; none of
their numbers are a measurement).

### 9. Adversarial corpus (`engine/tests/predicate_admission.rs`)

One shared fixture `Dataset` (`AttributeMode::CategoricalZone`, 200 features — the only attribute
column any fixture in this crate writes is `zone`, `Utf8`; two of the brief's own illustrative
predicates name columns this fixture does not have and are adapted below, disclosed rather than
invented). Every row asserts the **specific** `FilterError` variant and relevant field content —
never a bare `is_err`.

| # | Predicate | Result | Code (field asserted) |
|---|---|---|---|
| 1 | `1=1; DROP TABLE x` | refused | `Unparsable` |
| 2 | `1=1 --` | refused | `Unparsable` (comment eats the wrapper's own `)`) |
| 3 | `/* */` | refused | `Unparsable` (empty expression) |
| 4 | `(SELECT 1)` | refused | `ConstructNotAdmitted{construct contains "subquery"}` |
| 5 | `read_csv('c:/x')` | refused | `ConstructNotAdmitted{construct contains "read_csv"}` |
| 6 | `zone IN (SELECT 1)` | refused | `ConstructNotAdmitted{construct contains "subquery"}` (a `SUBQUERY` node, not `COMPARE_IN`) |
| 7 | `zone = ?` | refused | `ConstructNotAdmitted{construct contains "bind parameter"}` |
| 8 | `CAST(zone AS INT) = 1` | refused | `ConstructNotAdmitted{construct contains "CAST"}` |
| 9 | `random() < 0.5` | refused | `ConstructNotAdmitted{construct contains "random"}` |
| 10 | `<geometry column> IS NOT NULL` | refused | `ColumnNotFilterable{column = geometry column}` |
| 11 | `nonexistent_column_xyz = 1` | refused | `UnknownColumn{column = "nonexistent_column_xyz"}` |
| 12 | `1 + 1` | refused | `NotBoolean` |
| 13 | `zone = '<4096 a's>'` (over-length) | refused | `TooLong` |
| 14 | `NOT (...41 levels... zone ...)` (depth bomb, bare-ref body — §8) | refused | `TooDeep` |
| 15 *(bonus, §1)* | `1=1) GROUP BY 1 HAVING count(*) > 0 --` | refused | `ConstructNotAdmitted{construct contains "GROUP BY"}` |
| 16 *(bonus, §1)* | `1=1) UNION SELECT 1 --` | refused | `ConstructNotAdmitted` |
| 17 | `zone = $$residential$$` | **admitted** | — (§7 decision) |
| 18 | `zone = 'residential'` | **admitted** | positive control |
| 19 | `id BETWEEN 5 AND 10 AND zone IN ('a','b')` | **admitted** | positive control |
| 20 | `zone LIKE 'r%'` *(brief: `name LIKE 'A%'`, adapted — no `name` column)* | **admitted** | positive control |
| 21 | `zone IS NOT NULL` *(brief: `value IS NOT NULL`, adapted — no `value` column)* | **admitted** | positive control |
| 22 | `zone ILIKE 'R%'` | **admitted** | positive control |
| 23 | `NOT (id > 3 OR id < 2)` *(brief: `NOT (x > 3 OR y < 2)`, adapted — no `x`/`y` columns; `id` is real and numeric)* | **admitted** | positive control |

Rows 1–16 in `the_adversarial_corpus_each_row_refused_with_its_specific_code` (plus the geometry
row, #10, appended after the table-driven loop); row 17 in
`dollar_quoting_and_a_positive_control_both_admit`; rows 18–23 in
`the_positive_controls_from_the_design_note_all_admit`.

### Verify — both required commands, tails

**`cargo test -p spatial-engine --features fixture`** (full pass; lib: 88 passed, including 10 new
`predicate::tests::*`; every integration test file green, including the new
`predicate_admission.rs`: 3 passed):

```
running 88 tests
test result: ok. 88 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.40s
...
     Running tests\predicate_admission.rs (...)
running 3 tests
test dollar_quoting_and_a_positive_control_both_admit ... ok
test the_positive_controls_from_the_design_note_all_admit ... ok
test the_adversarial_corpus_each_row_refused_with_its_specific_code ... ok
test result: ok. 3 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.90s
```
(every other integration file in the crate: unchanged, still green — `filter_composition.rs` 1/1,
`publish_stream.rs` 12/12, `slice.rs` 20/20, `spatial_index.rs` 10/10, etc.)

**`cargo check -p spatial-kernel --tests`** (clean; one `#[warn(deprecated)]` at
`kernel/src/skp.rs:454`, no error — the shim §6 describes):

```
warning: use of deprecated associated function `spatial_engine::AdmittedPredicate::assume_validated`...
warning: `spatial-kernel` (lib) generated 1 warning
warning: `spatial-kernel` (lib test) generated 1 warning (1 duplicate)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 2.82s
```

**Also run, not required by this piece's verify step, sanity checks:** `cargo test -p spatial-kernel
--lib` → `77 passed; 0 failed` (unchanged from P2); `cargo check --workspace --tests --features
spatial-engine/fixture` clean (same deprecation warnings, now also at
`engine/tests/filter_composition.rs:128` and `engine/src/stream.rs:2158,2211` — P2's own composition
tests still call `assume_validated` directly, out of this piece's scope to touch, see Deviations);
`cargo check` from `frontends/shell/src-tauri`'s own manifest clean (same warning, no error).

### Deviations from the piece as declared

1. **Module organization**: grew `engine/src/predicate.rs` in place rather than adding a sibling
   `engine/src/predicate/admission.rs` — the crate has no submodule-directory precedent anywhere
   (`wc -l` checked before starting: every module, including the 2221-line `stream.rs`, is one flat
   file), so this piece followed that convention, which the piece itself offered as one of two
   options.
2. **`bind_admit`'s surrogate puts the predicate in the SELECT list, not a `WHERE` clause** — §4,
   disclosed in full there, with the reasoning (it is what actually detects a silent coercion,
   rather than merely avoiding one by construction).
3. **`AdmittedPredicate::admit`'s signature is `(text, dataset)`, not `(text, schema/dataset
   context, conn)`** — §6, disclosed in full there (the pool's own `pub(crate)`-connection
   invariant, and `kernel`'s lack of a `duckdb` dependency, make a public raw-connection parameter
   both invariant-breaking and uncallable by P4's real caller without further engine work).
4. **Two adversarial-corpus rows beyond the brief's literal list** (`1=1) GROUP BY 1 HAVING
   count(*) > 0 --` and `1=1) UNION SELECT 1 --`) — §1, added because building the walker surfaced
   a real bypass risk (a `where_clause`-only check would have admitted the first one) worth a
   standing regression test, not just a one-time observation.
5. **Three positive-control predicates adapted from the brief's literal column names** (`name` →
   `zone`, `value` → `zone`, `x`/`y` → `id`) — §9, disclosed there — this fixture's one attribute
   column is `zone`; the adaptation preserves the construct under test (LIKE, IS NOT NULL, NOT/OR)
   rather than the specific column name, which was never the point being tested.
6. **The depth-bomb corpus row's body is a bare column reference, not a comparison** — §8,
   disclosed there: a `COMPARISON` body defeats `NOT`-chain nesting entirely (DuckDB folds it away
   at parse time), a genuine parser behavior discovered while building this row, not a shortcut.

### State left for this piece, before commit

```
git status --porcelain
 M engine/src/lib.rs
 M engine/src/predicate.rs
?? engine/tests/predicate_admission.rs
```
(`CUT-STATE-import-layout.md`, `E2E-STATE.md`, `NEXT-CUT.md`, `NIGHT-STATE.md`, `CUT-STATE.md`
itself: untracked, unchanged by this piece's commit, per the established convention. `kernel/` and
`frontends/` are untouched, as instructed — confirmed by the `git status` above carrying nothing
under either.) Both modified/new files above are staged and committed by this piece; nothing else.
`target/slice-evidence/sql-filter/logs/p3-probe-shapes.log` and `p3-probe-not-folding.log` are
evidence, not code — `target/` is gitignored, not part of the commit, referenced here by path only.

**Next piece:** `NEXT-CUT.md` phase P4 — kernel wiring: validation pre-lease/pre-mint in
`SkpHost::viewport_query`, exhaustive `FilterError` → `skp.filter_*` refusal mapping (mechanical:
the eleven `FilterError` variants and the eleven wire codes already agree by name, §5), switch
`kernel/src/skp.rs:454` from `AdmittedPredicate::assume_validated` to `AdmittedPredicate::admit` and
remove the deprecated shim, end-to-end + cancellation-property + data-plane-invariance tests.
Reviewer gate after P4.

---

## Phase P4 — kernel wiring: admission pre-lease/pre-mint, refusal mapping, e2e + cancellation +
## data-plane-invariance tests

### 1. Where admission runs (`kernel/src/skp.rs::viewport_query` / `build_viewport_query`)

`build_viewport_query` (the same function P2 built) is now fallible — `Result<ViewportQuery,
FilterError>` — and its `filter` arm calls `AdmittedPredicate::admit(f.predicate.clone(), ds)?`
instead of `assume_validated`. `viewport_query` calls it as `build_viewport_query(&ds, &req)
.map_err(|e| filter_error_of(&e))?`, positioned:

- **After** `self.catalog.get(&dataset_name)` resolves `ds: Arc<Dataset>` — `admit` needs `&Dataset`
  (its own resident `file_schema()`, connection pool), the ADR-016-style structural precondition the
  piece named: no extra IO beyond DuckDB's own parse/bind against a dataset already open.
- **Before** `open_engine_stream(&ds, &query)` — which leases a `Class::Stream` connection — and
  **before** `self.tickets.mint(...)`. Both were already sequenced after `build_viewport_query`'s
  call site before this piece (P2's pass-through sat in exactly the same spot); P4's change is that
  the call inside it now actually validates, so a refusal now returns synchronously and typed instead
  of riding an unvalidated predicate into the engine.

`AdmittedPredicate::admit` internally leases its own `LeaseClass::Maintenance` connection (P3) —
separate from, and released or discarded before, the `Class::Stream` lease `open_engine_stream`
takes on success.

### 2. Refusal mapping — `filter_error_of` (`kernel/src/skp.rs`, next to `error_of`)

New `pub fn filter_error_of(e: &FilterError) -> SkpError`, an exhaustive match (no wildcard arm) over
`FilterError`'s eleven variants, each producing its declared `skp.filter_*` code
(`SkpError::protocol_with_fields`) with exactly the taxonomy's named fields. `EngineError` and
`FilterError` stay two separate mapping functions (mirroring `error.rs`'s own doc: `engine.*` from
`EngineError`, `skp.*` minted here) — no new constructors were added to `protocol/skp/src/v0/
error.rs`; `protocol_with_fields` (already public there) was reused directly, so `protocol/skp` is
untouched by this piece (confirmed by `git status`, §6 below).

**Eleven new unit tests** in `kernel/src/skp.rs`'s own `mod tests`, one per code, each asserting the
code AND every field key/value named in the taxonomy (never a bare `is_err`):
`filter_dialect_unsupported_maps_to_its_code_and_field`,
`filter_unparsable_maps_to_its_code_and_field`,
`filter_not_a_single_expression_maps_to_its_code_and_field`,
`filter_construct_not_admitted_maps_to_its_code_and_field`,
`filter_unknown_column_maps_to_its_code_and_field`,
`filter_column_not_filterable_maps_to_its_code_and_fields`,
`filter_identity_alias_ambiguous_maps_to_its_code_and_fields`,
`filter_not_boolean_maps_to_its_code_and_field`, `filter_too_long_maps_to_its_code_and_fields`,
`filter_too_deep_maps_to_its_code_and_fields`, `filter_rejected_by_binder_maps_to_its_code_and_field`.
The exhaustiveness property itself is the same convention `error_of`'s own sibling test already uses
for `EngineError`: a compile-time fact (no wildcard arm — a twelfth `FilterError` variant fails the
build until mapped) stated in the doc comment above the eleven tests, not re-proven at runtime by a
separate reflection test (this crate has no such pattern anywhere to follow).

### 3. Shim removal (`engine/`, in scope per the piece's own item 1)

`AdmittedPredicate::assume_validated` (the `pub`, `#[deprecated]` shim) is gone from
`engine/src/predicate.rs` entirely — not merely deprecated further. Its three remaining callers
(besides the kernel call site) needed a replacement to keep compiling:

- **`engine/src/predicate.rs`**'s own unit test (`the_text_comes_back_exactly_as_given_never_
  rewritten`) and **`engine/src/stream.rs`**'s two `filter_composition` unit tests (composition
  matrix + verbatim-text tests, P2) all need an `AdmittedPredicate` built from arbitrary text — odd
  casing/whitespace, or a `zone` column the plain (non-`CategoricalZone`) fixture those two tests use
  does not carry — **independent of whether that text would pass real admission**, because they test
  `build_sql`'s pure SQL-text composition, not admission. Replacement: a new `#[cfg(test)]
  pub(crate) fn AdmittedPredicate::unchecked_for_composition_test(text: String) -> Self`, visible
  only inside `engine/`'s own `cfg(test)` builds — it can never again be a way for `kernel/` (or any
  other external crate) to skip admission, closing exactly the gap the old `pub` shim was.
- **`engine/tests/filter_composition.rs`** (P2's identity/CRS preservation integration test, a
  separate crate — `pub(crate)` is not visible to it) switched instead to the **real**
  `AdmittedPredicate::admit(text, &ds)`, since its predicate (`zone = 'residential'`) is exactly a
  positive control real admission passes; its module doc, which previously said admission "is a
  later piece in this cut (P3, wired in P4)", is updated to say what it now actually does.

`cargo check -p spatial-kernel --tests` is clean with **zero** `#[warn(deprecated)]` warnings (P3
left one; gone now — nothing anywhere calls the removed shim).

### 4. End-to-end tests, over a real socket (`kernel/tests/skp_admission.rs`)

Two new tests, added after `viewport_query_refuses_synchronously_on_a_crs_mismatch_before_minting_a_
handle` (the existing no-socket refusal-shape sibling P3/P1 already established):

- `a_filtered_viewport_query_with_a_valid_predicate_delivers_a_correctly_subset_stream_over_the_wire`
  — a real WebSocket round trip (ticket mint → `TAG_START` → `TAG_CREDIT` → drain), asserting the
  delivered row count equals **exactly** `facts.zone_counts[0]` (the fixture writer's own recorded
  count for `zone = 'residential'`), not merely "some nonzero subset" — a vacuous or wildly-wrong
  filter could satisfy a looser bound. New fixture helper `fixture_zoned` (mirrors `fixture`, adds
  `AttributeMode::CategoricalZone`) and `batch_row_count` (decodes one `TAG_BATCH`'s Arrow IPC payload
  for its row count — `arrow` is already a kernel dev-dependency).
- `a_filtered_viewport_query_with_an_invalid_predicate_refuses_synchronously_and_mints_no_ticket` —
  no socket (mirrors the CRS-mismatch sibling): `nonexistent_column_xyz = 1` refuses with
  `skp.filter_unknown_column` and `fields["column"] == "nonexistent_column_xyz"`, and
  `tickets.cancel_all_for_dataset(handle.as_str())` (the one public window into registry state
  reachable from outside `kernel::skp`) returns `0` — proving no ticket exists to have been minted,
  per the piece's instruction to assert registry state where reachable.

### 5. Cancellation property (`kernel/tests/skp_filter_cancellation.rs`, new file)

**A new file, not added to `skp_admission.rs`.** `engine::trace` is a single process-wide slot
(`skp_admission.rs`'s own module doc already states this for its one trace-using test); Rust runs
every `#[test]` in one integration-test binary concurrently by default, so a second trace-using test
in that same file would race the existing `cancel_reaches_the_producer_directly_and_is_observed_on_
its_own_clock` — confirmed empirically (first attempt, in `skp_admission.rs`, failed on
`trace::is_enabled()` racing). Moved to its own file/process instead, with `dataset_handle`, `fixture`,
`connect`, `Client`, `RECV_DEADLINE`, `duckdb_filter` and `OrderingRaceObserved` duplicated rather
than shared (this workspace's own established convention — no integration test binary imports
another's code).

`cancel_reaches_the_producer_during_a_late_matching_filtered_scan`: a 2,000,000-feature fixture
(plain, no attributes — `id` alone is enough), predicate `id > <features - 100>` — true only for the
last 100 ids, "matches late" per the fixture writer's own ascending physical id order. Synchronizes
on `TAG_OPEN` (sent by `adapter_ws::drive` the instant the ticket is *redeemed*, strictly before the
query is ever polled) rather than a fixed sleep or a `TAG_BATCH` wait — a `TAG_BATCH` wait is exactly
what design essential 7's shortfall rules out for a late-matching predicate, and a fixed sleep raced
ticket redemption in an earlier attempt (`host.cancel()` landing on `Pending → CancelledBeforeRedeem`,
which never touches the engine's `CancelToken` at all — a real, different registry state, just not
what this test is about). Retries up to 5 times for the same documented `engine/src/cancel.rs`
`cancel_requested`/`cancel_observed` instrumentation-ordering race `skp_admission.rs`'s sibling test
already retries around (same underlying code path, now with a `WHERE` clause attached). REACHED, not
timed: both assertions are `.expect()` that a trace instant exists at all.

**A real engine gap this test found and this piece fixed, disclosed in full** (also in the test's own
doc comment): `engine/src/stream.rs::produce` only stamped `PRODUCER_CANCELLED` at two sites — before
the chunk loop's `arrow.next()` call, and inside the row loop — both **between** DuckDB pulls. For a
selective, late-matching predicate, DuckDB's own `stream_arrow` (bind+execute in one call) or the
first `arrow.next()` can do the *entire* non-matching prefix's scanning inside that one call, with no
chunk boundary for the producer to check `cancel.is_cancelled()` between until a match is found —
DuckDB's own interrupt is what actually stops it, surfacing as that call's own `Err` (from
`stream_arrow`) or a caught panic (from `arrow.next()`, per the existing `catch_unwind` comment there
already describing "the fetch was interrupted by our own cancel"). Neither path stamped
`PRODUCER_CANCELLED` before this piece — confirmed by direct instrumentation while building this test
(`execute_returned` never reached; `requested` stamped, `observed` never was). Two new marks added,
each conditional on `cancel.is_cancelled()` at the point the error is already known to be a
cancellation, mirroring the two existing sites' own pattern exactly. **This is an engine change, made
because item 4 (the cancellation-property test) is literally unsatisfiable for the brief's own
"predicate true only for high ids" construction without it** — not a general tracing improvement
undertaken beyond what this piece's assigned deliverable required.

### 6. Data-plane invariance

`a_raw_stream_params_start_is_refused_in_ticket_only_mode` (existing, `skp_admission.rs`) is
untouched and still green (checked in the full-suite run, §7). `git diff ba2572d..HEAD --
protocol/data-plane/` is **empty** — confirmed both before and after this piece's edits (`git status
--porcelain -- protocol/data-plane/` also empty); nothing in `protocol/data-plane/` was touched.
`protocol/skp/` was also not touched (§2).

### 7. Verify — required commands, tails

**`cargo test -p spatial-kernel`** (full pass; every suite green, including the two new
`skp_admission.rs` filter tests, the moved-out `skp_filter_cancellation.rs` (1/1, ~34s — dominated by
writing the 2,000,000-feature fixture, not by the property under test), and the eleven new
`skp::tests::filter_*` unit tests folded into the lib's 88):

```
test result: ok. 88 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.02s   (lib)
...
test result: ok. 9 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.76s     (skp_admission.rs)
...
test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 37.35s    (skp_filter_cancellation.rs)
```
(every other suite in the crate — `publish.rs` 21/21, `publish_cancellation.rs` 6/6, `permission_
boundary.rs` 14/14, `scale_pass.rs`/`scale_pass_a6.rs` measurement harnesses ignored as before, etc. —
unchanged and green; full tail in `target/slice-evidence/sql-filter/logs/p4-kernel-test.log`.)

**`cargo test -p spatial-engine --features fixture`** (full pass; 88 lib tests unchanged in count —
the shim removal only renamed a test-only constructor, added no new test; the two touched composition
tests and the `filter_composition.rs` integration test all still pass, tail in
`target/slice-evidence/sql-filter/logs/p4-engine-test.log`):

```
test result: ok. 88 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.42s
```

**`cd frontends/shell && npm run verify`** (`tsc --noEmit && vite build && vitest run`, full pass, no
source change in this piece touched `frontends/`):

```
✓ built in 3.44s
 Test Files  20 passed (20)
      Tests  137 passed (137)
```

**Also run, not required by this piece's verify step, sanity checks:** `cargo check -p spatial-kernel
--tests` clean, zero deprecation warnings (§3); `cargo check` from `frontends/shell/src-tauri`'s own
manifest clean (the Tauri command layer passes the request struct through unchanged, confirmed — no
source edit under `frontends/` in this piece).

### Deviations from the piece as declared

1. **The cancellation-property test lives in its own file** (`kernel/tests/skp_filter_cancellation.rs`),
   not added to `skp_admission.rs` — §5, a same-process `engine::trace` race with that file's existing
   trace-using test, confirmed empirically before moving it, not assumed.
2. **Two `engine/src/stream.rs` `PRODUCER_CANCELLED` marks added** — §5, a real gap this piece's own
   test-writing found, fixed because the brief's literal cancellation-property construction
   ("predicate true only for high ids") is unsatisfiable without it, not a general improvement chosen
   beyond the piece's scope.
3. **`AdmittedPredicate::assume_validated`'s three remaining engine-internal callers were updated**
   (not just the kernel call site literally named in the piece) — §3, a mechanical consequence of the
   piece's own instruction to remove the shim entirely; disclosed in full there.
4. Everything else matches the piece as declared: admission runs after `catalog.get`, before
   `open_engine_stream`'s lease and before `tickets.mint`; `filter_error_of` is exhaustive with no
   wildcard arm; one test per code; the e2e valid/invalid tests, and the data-plane-invariance check,
   are exactly as asked.

### State left for this piece, before commit

```
git status --porcelain
 M engine/src/predicate.rs
 M engine/src/stream.rs
 M engine/tests/filter_composition.rs
 M kernel/src/skp.rs
 M kernel/tests/skp_admission.rs
?? kernel/tests/skp_filter_cancellation.rs
```
(`CUT-STATE-import-layout.md`, `E2E-STATE.md`, `NEXT-CUT.md`, `NIGHT-STATE.md`, `CUT-STATE.md` itself:
untracked, unchanged by this piece's commit, per the established convention. `protocol/skp/` and
`protocol/data-plane/` both carry nothing under `git status` above — confirmed untouched.) All six
modified/new files above are staged and committed by this piece; nothing else.

**Next piece:** `NEXT-CUT.md` phase P5 — thin typed client wrapper under
`frontends/shell/src/skp/` (client only, no logic) + a dev-only E2E hook driving the same client
function the future panel will call + one spec: filtered-vs-unfiltered pixel difference on a
purpose-built fixture; refused predicate surfaces typed code/message. Reviewer gate after P5.
`frontends/shell/src/skp/client.ts`'s `viewportQuery()` still sends `filter: null` unconditionally
(P1 flagged, P2 disclosed) — P5's real filter-sending client API is what replaces that. Reviewer gate
required after P4 before P5 begins, per the piece's own instruction.

---

## Reviewer gate fix — B1 (composition escape, BLOCKING) + four should-fixes

Branch `cut/sql-filter`, starting `HEAD 271168b` (P4 already landed). All fix code is in
`engine/src/predicate.rs`; regression rows in `engine/tests/predicate_admission.rs`; this section is
the record correction. `kernel/` untouched.

### B1 — the escape, and the fix

**What the reviewer demonstrated.** Admission's wrapper (`SELECT 1 WHERE (<text>)`) and real
composition (`stream.rs::build_sql`, `(<text>) AND <bbox>`) both add exactly one paren pair around
the predicate — but not the *same shape*: nothing in admission's wrapper mirrored the `AND <bbox>`
that always follows once a predicate reaches composition. A predicate whose own text closes that
one paren early parses cleanly in admission (nothing downstream of `where_clause` to catch a
reassociation happening *inside* it — see the corrected §1 note above) and then reassociates once
the real `AND <bbox>` lands after it in composition. Demonstrated live: `zone = 'residential') OR
(1=1` admitted, composed to `WHERE (zone='residential') OR (1=1) AND <bbox>` — `AND` binds tighter
than `OR`, so the bbox condition is bypassed (a 1-row viewport returned 77 rows). `1=1) --` admitted,
and the trailing comment ate the real composed `AND <bbox> ... LIMIT n` suffix entirely, dropping
the caller's own `LIMIT` (400 rows instead of 3). Not a filesystem escape — the allowlist itself
held, nothing outside the admitted construct set was ever reachable — but a viewport/ceiling escape,
silent, exactly the class the allowlist exists to kill.

**The fix (`wrap`, `expect_predicate_operands` — renamed from `expect_bare_select_wrapper`).** The
wrapper now mirrors composition's *shape*, not just its paren count: `SELECT 1 WHERE (<predicate>)
AND 1=1` — a sentinel right-neighbour, structurally identical in position to the real `AND <bbox>`.
`where_clause` must now be `CONJUNCTION`/`CONJUNCTION_AND` whose **last** child is exactly the
sentinel comparison (`COMPARISON`/`COMPARE_EQUAL`, both sides an `INTEGER` constant `1`); every
child *except* the last is walked as the caller's own predicate operands. **DuckDB flattens n-ary
`AND`**, so `(a AND b) AND 1=1` becomes one 3-ary `AND [a, b, sentinel]` — the check is "last child
is the sentinel", never "exactly two children" (a 2-child assumption would refuse every ordinary
multi-clause `AND` predicate the moment the sentinel joined it). With this shape enforced, the OR
escape presents as a top-level `CONJUNCTION_OR` (refused: wrong top-level class) and the comment
escape loses the sentinel entirely (`where_clause` becomes a bare `COMPARISON`, refused the same
way). **The invariant actually enforced is now "the emitted WHERE really is `(<predicate>) AND
<bbox>`", not merely "the format string looks like it"** — the rationale is in `wrap`'s and
`expect_predicate_operands`'s own doc comments, per the piece's instruction to preserve it there.

**Empirical sentinel-last confirmation (required before trusting the check; not assumed).** A probe
(`engine/examples/pilot_p3_sentinel.rs`, built/run/deleted, same disposal convention as every prior
probe this cut — evidence retained at
`target/slice-evidence/sql-filter/logs/p3-probe-sentinel.log`) confirmed the sentinel lands **last**
in the top-level `AND`'s `children` array, in left-to-right source order, across every predicate
shape this corpus exercises: a bare comparison, a caller's own 2- and 3-clause `AND` chain
(flattened together with the sentinel into one n-ary node, sentinel still last), a top-level `OR`,
a top-level `NOT`, `BETWEEN`, `IN`, and even a predicate whose *own* text ends in `1=1` (three
children: the real clause, the caller's own coincidental `1=1`, and the sentinel — sentinel still
last, position-based matching working exactly as intended). No case observed DuckDB reordering `AND`
operands. Both escape predicates were probed with the sentinel appended and confirmed refused by the
new shape (`... ) OR (1=1` → top-level `CONJUNCTION_OR`; `1=1) --` → bare `COMPARISON`, sentinel
lost) before any test was written against the real `structural_admit`/`admit` path. First attempt
used the check as designed and it worked on the first try against every probed shape — the "two
failed attempts = stop" condition was never approached.

**One depth-accounting side effect, disclosed, not a security gap.** A predicate whose own top
level is a bare `AND` chain (no extra explicit parens) now has each of its own top-level operands
walked starting at depth 1 individually, rather than as children of one `CONJUNCTION` node counted
at depth 1 with its own children at depth 2 — because DuckDB's flattening merges the caller's own
top-level `AND` together with the sentinel's `AND` into one node this module unwraps and discards
(the sentinel) before walking. This makes depth-counting one level more generous specifically for a
bare top-level `AND` predicate; `MAX_PREDICATE_DEPTH`'s ceiling (32) has ample headroom to absorb it,
and every nested construct beneath the top level (behind an `OR`, a `NOT`, or explicit parens around
a sub-`AND`) is completely unaffected, so this is not a new way past the depth ceiling.

### Escape-corpus rows added (`engine/tests/predicate_admission.rs`, in
`the_adversarial_corpus_each_row_refused_with_its_specific_code`)

| Predicate | Result | Code (field asserted) |
|---|---|---|
| `zone = 'residential') OR (1=1` | refused | `ConstructNotAdmitted{construct contains "AND-sentinel"}` |
| `1=1) --` | refused | `ConstructNotAdmitted{construct contains "AND-sentinel"}` |
| `1=1) ;--` | refused | `ConstructNotAdmitted{construct contains "AND-sentinel"}` (single statement; the `;` sits inside the still-open wrapper paren the same way it does in the existing `1=1; DROP TABLE x` row — no second statement is ever produced) |
| `1=1) OR (1=1` *(reviewer's own variant)* | refused | `ConstructNotAdmitted{construct contains "AND-sentinel"}` |

Also mirrored as fast, pool-free unit tests directly against `structural_admit` in `predicate.rs`
itself (`a_predicate_that_closes_the_wrapper_paren_early_and_reassociates_as_or_is_refused`,
`a_trailing_comment_that_would_eat_compositions_and_bbox_also_eats_the_sentinel_and_is_refused`),
plus a positive control proving the sentinel design does not regress an ordinary multi-clause `AND`
predicate (`a_predicate_that_is_itself_a_top_level_and_chain_still_admits_with_every_column_
collected`, asserts `a`, `b`, `c` are all still collected and the literal `"1"` is not). The
false-refusal set (every prior positive control, P3's own corpus, P4's e2e tests) was re-run in full
and did not regress — tails below.

### The four should-fixes (all `engine/src/predicate.rs`, same region)

1. **Byte ceiling checked before the pool lease is acquired.** `AdmittedPredicate::admit` now checks
   `text.len() > MAX_PREDICATE_BYTES` as its very first statement, before
   `dataset.connections().acquire(...)` — an over-length predicate no longer costs a lease at all.
   `structural_admit` keeps its own copy of the same check (it is also exercised directly, with no
   pool involved, by this module's unit tests) — one ceiling, enforced twice, not two ceilings.
2. **Stage-1/2 refusals release the lease healthy; stage-3 refusals still discard.** `admit` now
   matches on `structural_admit`'s and `namespace_admit`'s results explicitly: either refusal calls
   `lease.release_healthy()` before returning, because stage 1 only ever runs
   `SELECT json_serialize_sql(CAST(? AS VARCHAR))` with the caller's text as **bound data**, never
   executed, and stage 2 touches `conn` not at all — as safe as the pool's own trivial `SELECT 1`
   verification. `bind_admit`'s own failure path is left as a bare `?`, keeping the original discard
   (stage 3 actually `prepare()`s and executes a statement built from the predicate text). A new
   integration test, `a_stage_one_or_two_refusal_releases_its_connection_healthy_but_a_stage_
   three_refusal_still_discards`, proves this against the pool's own instrumentation
   (`physical_connections_created`, `idle_connections`) rather than by inspection alone: a stage-1
   and a stage-2 refusal both leave `physical_connections_created` unchanged and the connection back
   in the idle pool; a stage-3 refusal empties the idle pool, and the *next* admitted predicate is
   shown forcing a fresh connection to be created.
3. **`schema.field(0)` → `schema.fields().first()`.** `bind_admit` no longer indexes into the
   surrogate query's result schema — it refuses `RejectedByBinder` if the result carries no columns
   at all, on a caller-driven path where a panic is not an acceptable failure mode regardless of
   whether this shape is reachable today.
4. **Unknown-key hardening on the wrapped statement's shape.** `refuse_unknown_keys` (a new helper)
   refuses `expect_predicate_operands`'s `SELECT_NODE` and `structural_admit`'s per-statement object
   if either carries any key **outside** a declared known set (twelve `SELECT_NODE` keys, two
   statement keys — every key `json_serialize_sql` produces today, confirmed against real output
   across this cut's own probes). Hardening against a *future* DuckDB version adding a clause this
   module has never seen and so has no explicit check for — not a present hole; every key this
   version of DuckDB emits was already checked by name. A direct unit test constructs a synthetic
   node with a thirteenth key this module could never provoke from real DuckDB output today, to
   prove the *mechanism* fires on an unseen shape, not only on shapes already reachable.

### Verify — required commands, tails

**`cargo test -p spatial-engine --features fixture`** (full pass; lib: 92 passed, four new
`predicate::tests::*` beyond P3's ten, all four escape/should-fix regressions included;
`predicate_admission.rs`: 4 passed, including the new escape-corpus row and the connection-release
integration test; every other suite unchanged and green):

```
running 92 tests
test result: ok. 92 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.44s
...
     Running tests\predicate_admission.rs (...)
running 4 tests
test dollar_quoting_and_a_positive_control_both_admit ... ok
test the_positive_controls_from_the_design_note_all_admit ... ok
test a_stage_one_or_two_refusal_releases_its_connection_healthy_but_a_stage_three_refusal_still_discards ... ok
test the_adversarial_corpus_each_row_refused_with_its_specific_code ... ok
test result: ok. 4 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.27s
```

**`cargo test -p spatial-kernel`** (full pass, log
`target/slice-evidence/sql-filter/logs/p3fix-kernel-test-full.log` — every binary green, including
P4's own `skp_admission.rs` 9/9 — `a_filtered_viewport_query_with_a_valid_predicate_delivers_a_
correctly_subset_stream_over_the_wire` and `a_filtered_viewport_query_with_an_invalid_predicate_
refuses_synchronously_and_mints_no_ticket` both still pass unchanged — and `skp_filter_
cancellation.rs` 1/1):

```
test result: ok. 88 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.01s   (lib)
...
test result: ok. 9 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 3.22s     (skp_admission.rs)
...
test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 37.31s    (skp_filter_cancellation.rs)
```

**`cd frontends/shell && npm run verify`** (full pass, no source under `frontends/` touched by this
fix):

```
 Test Files  20 passed (20)
      Tests  137 passed (137)
```

### Surprises from the real parser, beyond the reviewer's own brief

None beyond what the brief itself already predicted and asked to be verified (the flattening and
sentinel-ordering behavior) — both held exactly as described on the first empirical check, which is
itself worth recording: this cut's two prior surprises (P3 §1's GROUP BY/HAVING breakout, P3 §8's
`NOT`-folds-`COMPARISON`) were both found the hard way, by a check failing unexpectedly; this fix's
sentinel-ordering claim was instead *predicted* correctly by the reviewer's own design note ahead of
the probe, and the probe simply confirmed it.

### State left for this piece, before commit

```
git status --porcelain
 M engine/src/predicate.rs
 M engine/tests/predicate_admission.rs
```
(`CUT-STATE.md` itself, untracked per convention, carries this section's own record.
`target/slice-evidence/sql-filter/logs/p3-probe-sentinel.log` and `p3fix-kernel-test-full.log` are
evidence, not code — `target/` is gitignored.) Both files staged and committed together; nothing
else, `kernel/` and `frontends/` confirmed untouched by the `git status` above.

**Commit:** recorded once made — see the worker report for the hash (this file's own convention:
CUT-STATE is updated as part of the same commit it describes, so the hash is only knowable by the
piece's own report, not embeddable here beforehand).

## B1 escape — rule-7 status (custodian, 2026-08-13)

The composition-escape class (predicate text leaking rightward out of its `(<pred>)` container) has
now defeated TWO admission designs: the original bare wrapper (paren re-association) and the
sentinel wrapper (comment-forgery: `1=1) AND 1=1 --` forges the sentinel and comments out the real
one — same LIMIT-drop harm, 400 rows vs 3, confirmed live). Each failure was diagnosed, not just
observed; the second re-review isolated the full root class: a `--` / `/* */` / `;` in the predicate
deletes an appended same-line suffix in admission and composition identically, and the sentinel is
textually forgeable.

RULE 7: this is the LAST fix attempt before the custodian queues B1 for the human. Justified as
convergence, not grinding — the diagnosis is complete and the fix is a categorically different,
provably class-complete check (differential two-sentinel probe). If a third re-review finds any
survivor, the custodian STOPS and queues B1 rather than attempting a fourth design.

---

## B1 — final fix: the differential two-sentinel probe (`engine/src/predicate.rs`)

Branch `cut/sql-filter`, starting `HEAD 7652947`. All fix code in `engine/src/predicate.rs`;
regression rows in `engine/tests/predicate_admission.rs`. `kernel/` and `frontends/` untouched.

### What survived the single-sentinel fix

The single-sentinel wrapper (`SELECT 1 WHERE (<predicate>) AND 1=1`) closed the OR/paren
re-association subclass and the bare-comment subclass (`1=1) --`), but a re-review demonstrated,
live against the 400-feature zoned fixture, that `1=1) AND 1=1 --` and `1=1) AND 1=1 ;--` were still
**admitted** and dropped the caller's `LIMIT` (400 rows instead of 3). Mechanism: the predicate
**forges** the sentinel by writing its own trailing `1=1`, then a same-line comment eats the
wrapper's real, appended `) AND 1=1` — in admission and in composition identically, since both
append the same suffix on the same line. `is_sentinel_comparison` had no way to tell the caller's
forged `1=1` from this module's real one, so "last child is *a* `1=1` comparison" passed on the
forgery.

### The fix

Parse the predicate **twice**, differentially, with two distinct sentinels appended by `wrap_with`
(`fn wrap_with(predicate, sentinel) -> String`, replacing the old single-sentinel `wrap`):
`SENTINEL_A = "1=1"` and `SENTINEL_B = "2=2"`. `differential_operands` (replacing the old
single-parse `expect_predicate_operands`, now split into `parse_and_children` + the still-shared
`expect_wrapper_shape`) requires: both parses independently pass every wrapper-shape check and
resolve to a top-level `CONJUNCTION_AND`; probe A's **last** child is exactly `1=1`; probe B's
**last** child is exactly `2=2`; and every child **except the last** is JSON-value-identical, in the
same order, between the two parses (`Vec<Value>` `PartialEq`, not a hand-rolled comparison — DuckDB
emits deterministic, sorted-key JSON, and the two wrapped texts differ only in their final three
characters, so the preceding tree's `query_location` offsets are numerically identical between
probes too, confirmed empirically rather than assumed). The check is "last child is the sentinel
value this probe expects" — never "exactly two children" — because DuckDB flattens n-ary `AND`, so
`(a AND b) AND <sentinel>` is one 3-ary `AND [a, b, sentinel]`.

**Why this is sound against the whole class**, not an enumerated list of shapes: `wrap_with`'s two
outputs are byte-identical except for the sentinel's own three trailing characters. A rightward
escape (comment, semicolon, or unbalanced paren) truncates or reassociates at some point, and that
point is *identical* in both probes, because everything before it — the caller's entire predicate
text and this module's own `) AND ` — is the same string read twice. No single predicate text can
end in `1=1` for probe A and `2=2` for probe B at the same textual position, so a forged sentinel
that survives probe A's own check (because the forgery happens to *be* `1=1`) cannot also survive
probe B's (the forgery is still `1=1`, not `2=2`, since the escape mechanism treats both probes
identically). Full argument is in `wrap_with`'s and `differential_operands`'s own doc comments in
`predicate.rs`, per the piece's instruction to preserve it there.

### Empirical refuse/admit table (probe `engine/examples/pilot_p3_differential.rs`, built, run,
deleted before commit; evidence retained at
`target/slice-evidence/sql-filter/logs/p3-probe-differential.log`)

| Predicate | Expected | Observed | Exact reason / `FilterError` |
|---|---|---|---|
| `1=1) AND 1=1 --` | refuse | **refused** | probe B's last child is `1=1` (the forgery), not `2=2` → `ConstructNotAdmitted` ("AND-sentinel") |
| `1=1) AND 1=1 ;--` | refuse | **refused** | same as above |
| `1=1) AND 1=1 /*` | refuse | **refused** | unterminated `/*` comment — both probes fail to parse at all (`error:true`, "unterminated /* comment") → `Unparsable` |
| `1=1) OR (1=1` | refuse | **refused** | top-level `CONJUNCTION_OR` in both probes → `ConstructNotAdmitted` ("AND-sentinel") — unchanged from the single-sentinel fix |
| `1=1) --` | refuse | **refused** | `where_clause` is a bare `COMPARISON` (sentinel entirely eaten) → `ConstructNotAdmitted` ("AND-sentinel") — unchanged |
| `zone='x') AND 1=1 --` | refuse | **refused** | same forged-sentinel mechanism as row 1, over a real column | 
| `1=1) AND 1=1 /* x */` *(conditional row — "if the parser tolerates it")* | refuse | **refused** | the terminated block comment leaves a dangling, unmatched `)` after it — both probes fail to parse ("syntax error at or near `)`") → `Unparsable` |
| `zone='residential'` | admit | **admitted** | 1 operand |
| `id BETWEEN 5 AND 10` | admit | **admitted** | 1 operand |
| `a=1 AND b=2 AND c=3` | admit | **admitted** | 3 operands (flattened) |
| `NOT (x>3 OR y<2)` | admit | **admitted** | 1 operand |
| `id > 3 AND 1=1` *(the converse case — proves the check is not too strict)* | admit | **admitted** | probe A: `[id>3, caller's 1=1, sentinel 1=1]`; probe B: `[id>3, caller's 1=1, sentinel 2=2]` — both end in the correct sentinel for their own probe, preceding operands agree |

First attempt at the differential check produced exactly this table — no second try was needed, and
the two-failed-attempts stop condition was never approached.

### Regression rows added

`engine/tests/predicate_admission.rs`: five new refusal rows (the forged-sentinel class, both
comment shapes, the unterminated- and terminated-block-comment variants, and a real-column variant)
and one new positive control (`id > 3 AND 1=1`) in `the_positive_controls_from_the_design_note_all_
admit`. `engine/src/predicate.rs`'s own unit tests gained
`a_forged_trailing_sentinel_eaten_by_a_comment_is_refused_by_the_differential_probe` and
`a_predicate_that_legitimately_ends_in_its_own_one_equals_one_still_admits`. Every prior corpus row
(P3's original list, the first B1 fix's four rows, all positive controls) re-run and unchanged.

### Verify — required commands, tails

**`cargo test -p spatial-engine --features fixture`** (full pass; lib: 94 passed — two new tests
beyond the first B1 fix's 92; `predicate_admission.rs`: 4 passed, corpus now carries the five new
escape rows plus the benign positive control):

```
test result: ok. 94 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.58s   (lib)
...
running 4 tests
test dollar_quoting_and_a_positive_control_both_admit ... ok
test the_positive_controls_from_the_design_note_all_admit ... ok
test a_stage_one_or_two_refusal_releases_its_connection_healthy_but_a_stage_three_refusal_still_discards ... ok
test the_adversarial_corpus_each_row_refused_with_its_specific_code ... ok
test result: ok. 4 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.27s
```

**`cargo test -p spatial-kernel`** (full pass, log
`target/slice-evidence/sql-filter/logs/p3fix2-kernel-test-full.log`; every binary green, including
P4's `skp_admission.rs` 9/9 and `skp_filter_cancellation.rs` 1/1, unchanged):

```
test result: ok. 88 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.02s   (lib)
...
test result: ok. 9 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 3.26s     (skp_admission.rs)
...
test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 38.27s    (skp_filter_cancellation.rs)
```

**`cd frontends/shell && npm run verify`** (full pass, no source under `frontends/` touched):

```
 Test Files  20 passed (20)
      Tests  137 passed (137)
```

### State left for this piece, before commit

```
git status --porcelain
 M engine/src/predicate.rs
 M engine/tests/predicate_admission.rs
```
(`CUT-STATE.md` itself untracked, per convention, carries this section's own record; `kernel/` and
`frontends/` confirmed untouched by the `git status` above.) Both files staged and committed
together; nothing else. `target/slice-evidence/sql-filter/logs/p3-probe-differential.log` and
`p3fix2-{engine,kernel}-test-full.log` are evidence, not code — `target/` is gitignored.

**Commit:** recorded once made — see the worker report for the hash.

## B1 — CLOSED (third adversarial re-review, 2026-08-13)

The differential two-sentinel probe (b2260cc) PASSED an independent third adversarial re-review:
16 escape attempts all refused (both prior known escapes among them), 10 admitting AND-breakout/
attack predicates composed and streamed end-to-end with ZERO bbox bypasses and ZERO limit drops,
no false refusals of legitimate predicates. Soundness is structural (the two wrapped probes differ
only in one trailing sentinel digit; a rightward escape truncates both identically and cannot end
in 1=1 for A and 2=2 for B), backed by the top-level-CONJUNCTION_AND requirement and the allowlist
walk as defense-in-depth. Rule-7 last-attempt budget was not exhausted — the fix held on its first
review. P5 is unblocked.

## CI — GREEN FIX (5caa207, 2026-08-13)

Product-CI-rust (windows-latest) had been red since P3: json_serialize_sql triggered a DuckDB
extension AUTO-INSTALL that fails on a fresh runner (Access is denied). Fixed by statically linking
via the duckdb `json` feature (json = ["bundled"]; no new crate, Cargo.lock unchanged). Proven
locally by resolving json_serialize_sql with autoload/autoinstall DISABLED. Awaiting CI's own green
confirmation on 5caa207.

## Static-link = security property (custodian, 2026-08-13; human-directed record)

The duckdb `json` feature is recorded as a SECURITY PROPERTY, not a CI repair: admission runs on
untrusted caller-authored SQL on the control path and must acquire its parser (json_serialize_sql)
at BUILD time, never via runtime autoload — which would make first use a filesystem write and, for
a non-bundled extension, a network fetch. Static linking guarantees admission performs no runtime
extension acquisition of any kind. The CI Access-denied error was the symptom that surfaced the
latent runtime fetch; the property is the reason for the fix. Reframed in engine/Cargo.toml's
comment (commit follows). **P6 MUST carry this into ADR-021**: a Consequences bullet stating the
parser is statically linked / admission does no runtime fetch, and a one-line docs/09 note that the
predicate-admission parser is build-time-resident. CI on 5caa207 confirmed GREEN.

## Phase P5 — the typed client wrapper + dev-only E2E filter hook + one spec

Branch `cut/sql-filter`, starting `HEAD 8c51210` (B1 CLOSED, CI green, static-link security note all
landed). Client + E2E scope only, per the piece: **the shell UI filter panel is out of scope** and
was not touched. `engine/`, `kernel/`, `protocol/` untouched (confirmed by `git status` below).

### 1. Client wrapper (`frontends/shell/src/skp/client.ts`)

`viewportQuery` gained a fifth, optional parameter: `filter: Filter | null = null`, sent verbatim as
the wire request's `filter` key (never omitted, matching the `bbox_crs` discipline P1 established).
Every existing call site that passes no filter is unaffected (default `null`). Signature:

```ts
export function viewportQuery(
  dataset: string,
  bbox: Bbox | null,
  bboxCrs: string | null,
  limit: DecU64 | null,
  filter: Filter | null = null
): Promise<ViewportQueryResponse>
```

**No test-only path was added.** `ViewportStreamManager.requestViewport` (`streaming/
viewportStreamManager.ts`) — the seam every real query already goes through (supersede, ticket mint,
transport attach) — gained the same fourth parameter (`filter: Filter | null = null`, after the
existing optional `nowMs`) and threads it straight into `viewportQuery` with no logic of its own.
This is the ONE function a future filter panel and the dev-only E2E hook both call: the hook (below)
calls `manager.requestViewport(...)`, exactly what a panel's "Apply filter" button would call too.

**New unit test** (`frontends/shell/src/skp/client.test.ts`, new file — deliverable 1's "assert the
TS sends the right JSON"): two cases, `invoke` mocked at the module boundary (the `admitDataset.test.
ts` pattern) — no filter sends `filter: null` explicitly; a filter sends `{predicate, dialect}`
verbatim, untouched. **New test in `viewportStreamManager.test.ts`**: `requestViewport`'s filter
parameter rides through to `viewportQuery` unchanged. The one pre-existing assertion that checked
`viewportQuery`'s exact call args (`toHaveBeenCalledWith("ds_x", null, null, null)`) was updated to
the new 5-arg call shape (`..., null` appended) — a mechanical, disclosed consequence of always
passing the (defaulted) filter argument through, not a behavior change.

### 2. Dev-only E2E hook (`frontends/shell/src/e2e-test-surface.ts` + `App.tsx`)

New exported type `FilterQueryOutcome` (same shape as `OpenPathOutcome`, named separately since the
two verdicts come from different SKP commands) and a new optional field on `E2eTestSurface`:
`queryWithFilter?: (predicate: string) => Promise<FilterQueryOutcome>`.

**Registered in `App.tsx`, not in a new component** — it needs `managerRef.current` (the live
`ViewportStreamManager` for the currently-admitted dataset), which only `App.tsx` holds. Registration
lives inside the same `useEffect([admitted])` that constructs the manager (right after `managerRef.
current = manager`), gated `import.meta.env.DEV`, unregistered in that effect's own cleanup —
mirroring `capturePixels` only existing once `WorkingCanvas` mounts (both are dataset-scoped, not
app-lifetime). The hook body:

```ts
registerE2eHook("queryWithFilter", async (predicate: string) => {
  try {
    await manager.requestViewport(null, null, undefined, { predicate, dialect: FILTER_DIALECT_DUCKDB_EXPR_0 });
    return { kind: "admitted" };
  } catch (e) {
    if (e instanceof SkpCallError) return { kind: "refused", code: e.skpError.code, message: e.skpError.message };
    throw e;
  }
});
```

`bbox: null` — the same unrestricted shape the initial unfiltered load already issues at mount, so
the filter alone (not a viewport restriction) is what changes row count; the camera is not moved
between an unfiltered and a filtered capture, so "over a fixed bbox" (deliverable 4) holds by
construction (same screen viewport), not by re-deriving a world-space bbox inside the hook. This
drives the exact same production code every pan/zoom gesture already uses — supersede-then-mint,
generation-race handling, transport attach, batches reaching `WorkingCanvas.pushBatch` — not a
parallel render path built for the test.

**Dist-absence confirmed** (deliverable 2's own instruction, same method the existing hooks use):
`npm run build` then `grep -c` for `queryWithFilter`, `__SPATIAL_E2E__`, `registerE2eHook`, and
(control) `capturePixels` across `dist/assets/*.js` — **all zero**, both JS chunks. Dead-code
elimination confirmed by the build succeeding *and* the grep, not asserted from the guard alone.

### 3. Fixture (`kernel/tests/manual_walkthrough_fixtures.rs`, new `#[ignore]` test)

`generate_the_filter_fixture` writes `target/fixtures/manual-walkthrough/filter-zoned.parquet` via
`spatial_engine::fixture::write_geoparquet` (the same generator every other walkthrough fixture
uses) with `AttributeMode::CategoricalZone` (the P2/P3 zoned fixture's own attribute mode, engine
side), `features: 2_000`, `avg_vertices: 12`, `hole_every: 0` (defaults otherwise: declared LV95 CRS,
native unique `id`, covering bbox). `zone_for(seed, id)` is a pure hash of the feature id, and
`parcel()` places one feature per grid cell (`id % cols`, `id / cols`) — so the ~1/5 of rows matching
`zone = 'residential'` are scattered across the whole grid, not clustered in one screen region, which
is what makes "filtered renders visibly fewer pixels *everywhere*, not just in one corner" a fair
inference from a single overall-fraction comparison. Measured on generation: `zone_counts=[402, 392,
389, 421]` (residential/industrial/agricultural/civic), `zone_nulls=396`, out of 2 000 — every value
present, `residential` = 402/2000 = 20.1%, hard-asserted in the test (every `ZONE_VALUES` entry > 0,
`zone_nulls > 0`, `0 < zone_counts[0] < features`) so a future generator edit that drifted this back
to a vacuous partition would fail the generator's own test, not just the E2E spec, silently.

### 4. The spec (`frontends/shell/e2e/filter.mjs`, new sibling script, not folded into `regression.mjs`)

**Sibling, disclosed reason**: `e2e/README.md`'s own note records `regression.mjs` "Currently RED on
`A5'`-`A9'`" (a pre-existing, unrelated shell defect, `DECISIONS-PENDING.md` entry 0) — folding P5's
steps into that file would risk a FILTER'/REFUSED' FAIL being read alongside unrelated noise, or
(worse) an unrelated FAIL being misattributed to the filter work. `filter.mjs` duplicates the small
set of helpers it needs (`withTimeout`, `waitForMountReady`) from `regression.mjs` rather than
importing them — this workspace's own established convention for standalone test files (`CUT-STATE.
md`'s own Rust integration tests duplicate rather than cross-import, for the identical reason). Same
`attachOrLaunch`/`attachConsole`/`waitForSettle` harness (`lib.mjs`), same watchdog/deadline pattern
(`SPATIAL_E2E_DEADLINE_MS`, default 300 000 ms here — three steps, not regression.mjs's dozen), same
render-trace ledger dump on exit, same "leave the app running" policy. New `npm run e2e:filter`
script; `e2e/README.md` gained a short section pointing at it (mirroring its existing "Regression
suite" section).

Three steps: `OPEN` (admits the fixture via `openPath`, the existing hook — confirms `queryWithFilter`
is now reachable, dataset-scoped); `FILTER'` (deliverable 4's core assertion — see below);
`REFUSED'` (an unknown-column predicate, `bogus_column_xyz = 1`, asserted against the *specific*
`skp.filter_unknown_column` code and the exact verbatim message from `engine/src/predicate.rs`'s
`Display` impl, traced through `kernel/src/skp.rs::filter_error_of`).

**`FILTER'`'s threshold**: filtered fraction must be `< 60%` of the unfiltered fraction (a large
margin above the ~20% the fixture's own measured partition predicts — see §3 — so this only trips
for a real defect, not rendering noise) **and** `> 0.2%` (proves the filtered stream still rendered,
not blank), mirroring `regression.mjs`'s own `OVERCEIL'` step's "a threshold with margin" discipline.

### 5. Evidence class

**E2E-verified**, same as `regression.mjs` — driven through real Tauri IPC, a real kernel round trip
(admission running for real, not mocked), and a real WebGL render loop, via an in-page hook that
bypasses the (nonexistent, out-of-scope) filter panel UI. Distinct from, and weaker than, an
operator-verified claim — no operator clicked anything.

### 6. Run — kill/relaunch discipline, and the one non-defect deviation

Before running: confirmed no `spatial-ide-shell.exe`, no stray `vite`/`tauri` node process, no
`spatialide`-tagged `msedgewebview2.exe` (checked via `Get-CimInstance Win32_Process` command lines),
and both `:9223` and `:5180` down (`netstat`). First `node e2e/filter.mjs` invocation: the harness's
own 300 000 ms watchdog fired (exit 2, "presumed hung") *before* `attachOrLaunch` ever resolved —
diagnosed, not assumed: `cargo.exe`/`rustc.exe` were still running (checked via `tasklist`) after the
watchdog killed the Node script, and the spawned `tauri dev` child (deliberately `detached`+`unref`'d
by `lib.mjs`, exactly so a harness-side kill cannot orphan-kill it) kept building in the background.
This was `frontends/shell/src-tauri`'s own cold first compile in this session/environment (excluded
from the root workspace, its own `target/`, `CUT-STATE.md` P1 §5) — not a filter defect, and no
FILTER'/REFUSED' step had even begun executing when the watchdog fired. Polled (`netstat`/`tasklist`)
until `:9223` came up, then re-ran the identical script with no code change; it attached to the
now-running instance and all three steps PASSed on that run. Not counted as one of rule 7's "two
failed harness attempts" against the FILTER'/REFUSED' gate — the first run never reached those steps
at all, and the fix was "wait for a cold build," not a script or product change.

### 7. Result

```
[OPEN]     PASS ( 94ms): admitted; window.__SPATIAL_E2E__.queryWithFilter now registered (dataset-scoped)
[FILTER']  PASS (6661ms): admitted; unfiltered 20.0% non-bg, filtered 3.7% non-bg (< 60% of unfiltered); filtered stream rendered, not blank (settled=true)
[REFUSED'] PASS (  13ms): refused skp.filter_unknown_column; message verbatim; call resolved (no crash/hang)
```

Filtered/unfiltered ratio observed: 3.7/20.0 = 18.5%, matching the fixture's own measured 20.1%
`residential` share (§3) closely — the filter is doing real, proportionate work, not an accidental
pass. Full render-trace ledger: `frontends/shell/e2e/out/filter-render-trace-1786640364346.json`
(gitignored, referenced by path only).

### Verify — required commands, tails

**`cd frontends/shell && npm run verify`** (`tsc --noEmit && vite build && vitest run`, full pass —
21 test files now, up from 20; 140 tests, up from 137: +2 `client.test.ts`, +1 `viewportStreamManager.
test.ts`):

```
✓ built in 3.46s
 Test Files  21 passed (21)
      Tests  140 passed (140)
```

**`grep -c` across `dist/assets/*.js`** for `queryWithFilter` / `__SPATIAL_E2E__` / `registerE2eHook`
/ `capturePixels`: all four **zero** in both chunks (§2).

**`cargo check -p spatial-kernel --tests`**: clean (fixture-generator addition only). **`cargo check
--workspace --tests --features spatial-engine/fixture`**: clean, no new warnings.

**`node e2e/filter.mjs`** (second, attach-only run): all three steps PASS (§7).

### Deviations from the piece as declared

1. **The spec is a sibling script (`filter.mjs`), not an extension of `regression.mjs`** — §4,
   disclosed: `regression.mjs`'s own README note names a pre-existing, unrelated RED range this
   piece must not be entangled with; the piece itself offered "extend regression.mjs or a sibling
   filter spec" as an explicit either/or.
2. **One pre-existing test assertion updated** (`viewportStreamManager.test.ts`'s exact-call-args
   check, 4 args → 5) — §1, a mechanical, disclosed consequence of always passing the (defaulted)
   filter parameter through, matching P1/P2's own precedent for this kind of one-line fix.
3. **The first harness run hit the default 300 000 ms watchdog before any step began**, diagnosed as
   a cold first Tauri-backend compile, not a defect — §6, not counted against rule 7's two-attempt
   limit since no FILTER'/REFUSED' step had started.
4. Everything else matches the piece as declared: one client function (`viewportQuery`, extended,
   not duplicated), the hook drives the same production seam a panel would use, the fixture gives a
   predicate that keeps some but not all rows, `FILTER'` asserts a measurably-lower-with-margin
   fraction over a fixed viewport plus a non-blank floor, `REFUSED'` asserts the specific typed code
   and verbatim message with no crash/hang, dist-absence confirmed by grep, `npm run verify` green.

### State left for this piece, before commit

```
git status --porcelain
 M frontends/shell/e2e/README.md
 M frontends/shell/package.json
 M frontends/shell/src/App.tsx
 M frontends/shell/src/e2e-test-surface.ts
 M frontends/shell/src/skp/client.ts
 M frontends/shell/src/streaming/viewportStreamManager.test.ts
 M frontends/shell/src/streaming/viewportStreamManager.ts
 M kernel/tests/manual_walkthrough_fixtures.rs
?? frontends/shell/e2e/filter.mjs
?? frontends/shell/src/skp/client.test.ts
```
(`CUT-STATE-import-layout.md`, `E2E-STATE.md`, `NEXT-CUT.md`, `NIGHT-STATE.md`, `CUT-STATE.md` itself:
untracked, unchanged by this piece's commit, per the established convention. `engine/`, `kernel/src/`,
`protocol/` all carry nothing under `git status` above — confirmed untouched; only the one kernel
*test* file, a fixture generator, was added to.) `target/fixtures/manual-walkthrough/filter-zoned.
parquet` and `frontends/shell/e2e/out/*` are generated/evidence artifacts, both gitignored, not part
of the commit. All ten modified/new files above are staged and committed by this piece; nothing else.

**Commit:** recorded once made — see the worker report for the hash.

**Next piece:** `NEXT-CUT.md` phase P6 — docs: append a v0.1 section to `SKP-V0.md` (update §4 items
1/3/8/13); file ADR-021 Proposed from the architect's skeleton (custodian holds it) — carry forward
the static-link security property (§ above, "P6 MUST carry this into ADR-021": a Consequences bullet
stating the parser is statically linked / admission does no runtime fetch, and a one-line docs/09
note); architect review of the ADR text before filing; `DECISIONS-PENDING.md` entry for the human
(ADR-021 acceptance). Reviewer gate was already required after P5 per the piece's own instruction —
not run by this piece (writing the code and its own evidence was the full P5 scope; the gate is a
separate step for whichever agent runs it next).

---

## Phase P6 — docs + ADR-021 filing + one P5 should-fix (FINAL)

Branch `cut/sql-filter`. Docs-only plus one dev-only-surface should-fix, per the piece's own scope.
`engine/`, `kernel/src/`, `protocol/skp/src/` untouched — every claim below was verified against
`protocol/skp/src/v0/commands.rs`, `engine/src/predicate.rs`, `engine/src/stream.rs::build_sql`, and
`kernel/src/skp.rs` (read in full or by targeted grep before writing any doc line), never against
`NEXT-CUT.md`'s brief text alone, per the piece's own instruction. Architect review of the ADR text
and the `DECISIONS-PENDING.md` acceptance entry are **not** part of this piece — the piece's own
scope stops at filing the ADR Proposed; the custodian runs the architect gate and pushes.

### 1. The P5 should-fix (`FilterQueryOutcome`, dev-only E2E surface)

**The gap.** `App.tsx`'s `queryWithFilter` hook returned `{kind:"admitted"}` on any non-throwing
resolution of `manager.requestViewport(...)`, but `ViewportStreamManager.requestViewport`
(`viewportStreamManager.ts`) resolves `void` the same way on a throttled call, a call superseded by a
newer one before its own ticket minted, and a call issued after `stop()` — none of which means a
ticket was minted for *this* call. `e2e-test-surface.ts`'s own doc comment for `queryWithFilter`
claimed the resolved value meant "the filtered stream's ticket is minted and its transport attach has
begun," which the code did not actually guarantee.

**The fix, the minimal-honest option the piece named.** `FilterQueryOutcome`'s admitted variant is
renamed `{kind:"no-refusal"}` (`e2e-test-surface.ts`) — its own doc comment states plainly what the
guarantee actually is ("no typed `skp.filter_*` refusal was raised," not "a ticket was minted") and
names the three no-op cases `requestViewport` shares with a real mint. `App.tsx`'s hook body returns
`{kind:"no-refusal"}` in place of the old `{kind:"admitted"}`, with a short comment pointing at the
doc comment above. `frontends/shell/e2e/filter.mjs`'s `FILTER'` step depended on the literal
`"admitted"` string (`outcome.kind !== "admitted"`, twice) — both updated to `"no-refusal"`, with a
comment noting that the step's own subsequent pixel-fraction comparison, not this outcome, is what
actually proves the filtered query minted and rendered. `stepOpen`'s own `"admitted"` check is
`OpenPathOutcome`'s (a different, unchanged type — `open_dataset`'s real admission verdict) and was
left untouched, correctly, per `e2e-test-surface.ts`'s own doc comment distinguishing the two types.
No test in `frontends/shell/src/**/*.test.ts` referenced `FilterQueryOutcome` or the literal
`"admitted"` string for this hook (grepped before editing) — nothing else needed updating.

**Not a mint-confirmation fix** (the piece's other named option) — disclosed choice: confirming a
real mint would need `ViewportStreamManager` to expose per-call mint state `activeStreamHandle`
alone cannot reliably provide (it reflects whichever stream is active *now*, not whether *this*
call's own request minted it), which is more than a "cheap" confirmation and risks over-engineering a
dev-only surface the piece explicitly asked not to over-engineer.

### 2. `SKP-V0.md` — appended `## 7. v0.1 — a row filter on viewport_query`

**§§1–6 left as prose-unrewritten**, except the four §4 items the piece named (verified against
`NEXT-CUT.md`'s own P6 phase-table note, "update §4 items 1/3/8/13," and this piece's own item-2
instruction): each of items 1, 3, 8, 13 gained one short v0.1-referencing sentence appended in place,
not a rewrite of the item's own original text. Item 5 (cancellation/progress) also gained a short
v0.1 pointer to the named shortfall, since design essential 7 amends that item's own claim
("progress: data-plane batches only") rather than any of the other three named items — disclosed as
a fifth touched item, beyond the piece's literal "1/3/8/13" list, because the shortfall is explicitly
about principle 7's *progress* clause, which is what item 5 states, and leaving it unremarked would
have `§4` silently understate the shortfall §7.7 states in full two sections later.

**New `## 7` subsections** (7.1–7.8): Version (`skp/0.1`, `==`); the wire shape (`filter:
Option<{predicate, dialect}>`, `null` not omitted, `describe` untouched); the SQL contract
(expression not statement, the composition rule as a tested string, the namespace rule); admitted
constructs and the refused-by-name list; the eleven-code refusal table; the three-stage admission
(structural via DuckDB's own parser / namespace / bind); the named shortfall (verbatim from design
essential 7, cross-referenced to ADR-021's Consequences); data-plane invariance (empty diff, `TAG_START`
ticket-only). Every field name, code, and construct name in the new section was checked directly
against the four files named in this piece's own instruction, not copied from `NEXT-CUT.md`'s brief
prose — three corrections found this way, disclosed: (a) the brief's "second stage against resident
`file_schema()`" is accurate but the *actual* namespace rule in code additionally excludes any column
`admit_attribute_type` refuses, stated in the new §7.3, not just "resident schema minus geometry"; (b)
the brief's design essential 4 names the admission mechanism as a single structural walk, but the
code (`engine/src/predicate.rs`, read in full) implements the **differential two-sentinel probe**, not
a single-wrapper walk — the brief predates that fix (filed after three adversarial reviews, per
`CUT-STATE.md`'s own B1 sections above), so the new §7 documents the probe as it is today, not the
brief's original single-wrapper design; (c) the brief's illustrative composition string is silent on
the row-group/index-narrowed experimental branches' own ranges-before-bbox internal ordering
(`stream.rs::build_sql`, P2's own disclosed deviation) — the new §7.3 states the rule at the same
level of generality the brief itself uses (`[AND <ranges>]`, bracketed/optional) and does not attempt
to document the experimental seam's own internal pairing, which no product entry point reaches.

### 3. `docs/adr/ADR-021-row-filter-on-viewport-query.md` — filed, Status: Proposed

**Next-free-number check, as instructed**: grepped `docs/adr/` (`ls`, sorted) and `docs/README.md`'s
own ADR index line before filing — ADR-014 is Reserved (unfiled), ADR-020 is the highest filed
number, ADR-021 was free. No `docs/01` edit, no accepted-ADR edit (confirmed by `git status` below:
neither `docs/01_Principles.md` nor any existing `docs/adr/*.md` file appears there).

**Sections**: Status (Proposed, binds nothing, not architect-blockable, the ADR-019/ADR-020
precedent, the two named external-claim prohibitions) · Drafted by / Related · Context (three bounding
facts: caller-authored SQL as untrusted control-plane input, docs/11/ADR-016 unsatisfied for a
handle, zero perf claim) · Decision (ten numbered points: parameter shape not a command/handle with
the docs/11/ADR-016 reason; `skp/0.1` `==`; boolean-expression-not-statement; the composition rule;
the namespace rule; the three-stage validation naming DuckDB's own parser explicitly — "a second SQL
grammar is not admitted, at any stage"; the two declared ceilings and why two, not one; the
eleven-code exhaustive taxonomy; the differential two-sentinel probe — the escape it closes and the
three-adversarial-review provenance, cited by count from `CUT-STATE.md`'s own B1 sections, not
invented; zero data-plane change) · Consequences (the static-link security property, verbatim to the
human-directed record's own wording and `engine/Cargo.toml`'s own comment; the docs/09 allowlist
boundary sentence; ADR-006 class 1; the named batches-may-be-empty shortfall; identity/CRS/geometry
unchanged; new control-plane attack surface, bounded; cancellation unchanged as a property) · What
this ADR does not decide (nine items: derived views/ResourceRef, materialization, full SELECT,
spatial predicates, a general function allowlist, a `sql` command, MCP exposure, predicate
persistence, any perf claim) · Open (acceptance itself; macOS/Linux hardware validation, inherited
from docs/07, not reopened).

**The security-property Consequences bullet** was checked word-for-word against both source-of-truth
texts named in the piece's own instruction — the human-directed record above ("Static-link = security
property") and `engine/Cargo.toml`'s own comment (read in full before writing) — rather than
paraphrased from memory; the ADR states the same claim both texts make: build-time linkage, no
runtime extension fetch of any kind, for a parser that runs on untrusted caller SQL on the control
path.

**One deviation, disclosed**: `docs/README.md`'s ADR index line (the single paragraph naming every
Accepted/Proposed/Reserved ADR) was also updated with a short ADR-021 entry, mirroring the ADR-019/
ADR-020 entries already there — not explicitly named in this piece's own instruction, but every prior
ADR filing in this repo's history updated that same index line as a mechanical consequence of filing,
and leaving it stale would silently understate what `docs/adr/` now contains for the next reader who
trusts the index over `ls`.

### 4. `docs/09_Security_and_Privacy.md` — one new section

`## Predicate admission (control-plane filter parsing)`, placed immediately after the existing
"Local listening sockets" section (the piece's own suggested placement) and before "Telemetry and
training": four sentences, matching the doc's own "Evolves" voice and its existing sections' length —
states the parser is caller-authored-SQL-facing, statically linked, build-time-resident, and that
admission performs no runtime extension fetch, naming both the autoload alternative it closes off and
`engine/Cargo.toml`'s `json` feature as the mechanism. No ADR filed for this doc alone — the piece's
own instruction states none is needed ("Evolves" doc), and ADR-021 is cited by name for the fuller
record.

### 5. `NEXT-CUT.md` deleted

Per the brief's own header ("deleted by this cut's final docs commit") and this piece's own repeated
"Next piece" pointers across every phase above — this is that final docs commit (piece 6 of 6). The
file was untracked (`?? NEXT-CUT.md` in every prior phase's `git status --porcelain`), so its removal
is a plain filesystem delete, not a tracked `git rm` — it will not appear in this commit's diff at
all, and does not appear in the `git status --porcelain` below either, for the same reason.
`CUT-STATE-import-layout.md`, `E2E-STATE.md`, `NIGHT-STATE.md` predate this cut/session and are
untouched, per the established convention every prior phase in this file states.

### Verify — required commands, tails

**`cargo test -p spatial-skp`** (full pass, unchanged from P1 — this piece touched no protocol/skp
source, only prose docs elsewhere; run anyway per the piece's own instruction, "confirm nothing
broke"):

```
running 22 tests
test result: ok. 22 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
...
running 8 tests
test result: ok. 8 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
```

**`cd frontends/shell && npm run verify`** (`tsc --noEmit && vite build && vitest run`, full pass —
same 21 files / 140 tests as P5, no count change: the should-fix renamed a type/return value and two
string literals, added no new test file):

```
✓ built in 3.35s
 Test Files  21 passed (21)
      Tests  140 passed (140)
```

**`cargo check -p spatial-kernel --tests`** (clean, no warnings — this piece touched no Rust source at
all, `kernel/`/`engine/` both confirmed untouched by the `git status` below):

```
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.29s
```

### Deviations from the piece as declared

1. **Item 5 of `SKP-V0.md` §4** (cancellation/progress) gained a short v0.1 note beyond the piece's
   literal "1/3/8/13" list — §2 above, disclosed there: design essential 7's shortfall amends exactly
   that item's own progress claim, and the new §7.7 states the same fact in full two sections later,
   so leaving item 5 silent would have understated it at the point a reader first meets the claim.
2. **`docs/README.md`'s ADR index line updated** — §3 above, disclosed there: not named in the
   piece's own instruction, but a mechanical consequence of filing every prior ADR in this repo's
   history, matching that established convention.
3. Everything else matches the piece as declared: the should-fix is the minimal-honest rename option,
   not the mint-confirmation option; `SKP-V0.md` §§1–6 are otherwise unrewritten; ADR-021 is Proposed,
   built from `NEXT-CUT.md` essentials 1–9 and the four named source files, with the security-property
   Consequences bullet carried forward verbatim in substance; `docs/09` gained one new section, no ADR
   filed for it alone; `DECISIONS-PENDING.md` untouched (grepped/confirmed by the `git status` below
   carrying nothing under it); no accepted ADR and no `docs/01` file touched.

### State left for this piece, before commit

```
git status --porcelain
 M docs/09_Security_and_Privacy.md
 M docs/README.md
 M frontends/shell/e2e/filter.mjs
 M frontends/shell/src/App.tsx
 M frontends/shell/src/e2e-test-surface.ts
 M protocol/skp/SKP-V0.md
?? docs/adr/ADR-021-row-filter-on-viewport-query.md
```

(`CUT-STATE-import-layout.md`, `E2E-STATE.md`, `NIGHT-STATE.md`: untracked, predate this cut, untouched.
`CUT-STATE.md` itself: untracked, carries this section's own record — **stays untracked and
uncommitted**, the same convention every prior phase in this file states (`?? CUT-STATE.md` in every
`git status --porcelain` above), including this final one; only the piece's own explicit "Commit ALL
of P6 (should-fix + SKP-V0.md + ADR-021 + docs/09)" list is staged. `NEXT-CUT.md`: deleted from disk,
was untracked, so its removal does not appear above — see §5. `DECISIONS-PENDING.md`: not present
above — untouched, per the piece's own explicit instruction; the custodian writes the acceptance
entry.) All seven files above (six modified, one new) are staged and committed by this piece;
`engine/`, `kernel/src/`, `protocol/skp/src/`, `protocol/data-plane/` all carry nothing under the
`git status` above — confirmed untouched.

**Commit:** recorded once made — see the worker report for the hash. **This is the cut's final
piece** — the custodian audits, runs the architect gate over the ADR text, then pushes and writes the
`DECISIONS-PENDING.md` acceptance entry; no further worker piece is scheduled under `NEXT-CUT.md`
(now deleted).

---

## A7 fix piece (2026-08-14 operator walkthrough finding) — **COMPLETED, coordinator-authorized
## second-half fix, committed (§8 below has the commit hash and the completion's own detail)**

Branch `cut/sql-filter`, HEAD `3f50456` (the two docs commits `b9ab6b5`/`3f50456` above this cut's
final piece, plus `MANUAL-WALKTHROUGH.md`'s result log filled in by the human's 2026-08-14 run). Piece
scope: fix the operator-found A7 defect ("Zoom to layer" inert when the layer is panned fully out of
view) + one cosmetic (Dismiss-button spacing). **Per the piece's own stop condition — "If A7' fails
with your fix in place, STOP and report (do not iterate past one diagnosis attempt — rule 7
discipline)" — this piece stopped after the strengthened E2E still failed A7', with a root-cause
diagnosis beyond what the piece's own given fix shape addresses. Nothing is committed.**

### 1. Fix 1 as specified — implemented exactly as given

`frontends/shell/src/canvas/extent.ts`: new exported pure function `chooseFitTarget(resident, anchor)
=> resident ?? anchor`.

`frontends/shell/src/canvas/WorkingCanvas.tsx`: new `fitAnchorRef` (`AuthoritativeBbox | null`),
grown in `pushBatch` alongside `residentExtentRef` via the same `unionBbox(fitAnchorRef.current,
batchExtent)` call, **never touched in `clearStream`**. `fitToBounds()` now calls
`chooseFitTarget(residentExtentRef.current, fitAnchorRef.current)`; returns `false` only when both are
`null`. Commented with the operator finding and the dataset-keyed-remount reasoning for why no reset
code exists (`App.tsx`'s `key={admitted.dataset}` unmounts the whole `WorkingCanvas` instance, and the
anchor, on every dataset change).

**Unit tests** (`extent.test.ts`, `describe("chooseFitTarget (2026-08-14 walkthrough A7 fix)")`, 3
new cases): prefers current residency over the anchor when both are non-null; falls back to the
anchor when residency is `null`; returns `null` only when both are `null`. `fitToBounds` itself is not
reachable in this package's jsdom test environment (needs a live `Deck`/WebGL context), per the
piece's own anticipated seam — `chooseFitTarget` is what got exercised directly instead, matching the
piece's own fallback instruction.

### 2. Fix 2 as specified — `stepA7` strengthened, and it worked exactly as intended

`frontends/shell/e2e/regression.mjs`: `stepA7` no longer does a fixed 4×300px drag. A new
`panUntilOffData` helper drags in one consistent direction (stride `max(600, rect.width * 1.5)`px per
drag — deliberately larger than the old fixed stride, whose own failure to leave the extent is what
this responds to), re-capturing the whole-canvas pixel fraction after each drag+settle, until it drops
to ≤0.5% non-background (`OFF_DATA_THRESHOLD`) or `OFF_DATA_MAX_DRAGS` (10) is exhausted (throws
loudly, naming the last observed fraction, if still non-empty after 10). Only then does it click "Zoom
to layer" and assert `>2%` non-bg after settle, exactly reproducing the operator's sequence. `A7'`'s
`runStep` timeout raised from 60 000ms to 150 000ms to fit up to 10 drag+settle+capture rounds.

**This strengthened step is exactly what caught the gap below** — the whole point of Fix 2 — so it is
kept as specified even though the run it produced is a FAIL, not a PASS.

### 3. Fix 3 as specified — cosmetic Dismiss-button spacing

`frontends/shell/src/styles.css`: new rule `.canvas-refusal button { margin-left: 0.5rem; }`,
commented with the operator's own "no space between 'tiling' and the button" observation
(`MANUAL-WALKTHROUGH.md`'s Part D result-log deviation). Left-margin on the button, not a flex `gap`
on the container, since the message text and the button are adjacent inline content, not both
flex/grid children.

### 4. `npm run verify` — GREEN

`typecheck` clean, `build` (`tsc --noEmit && vite build`) clean (`✓ built in 3.82s`), `test`
(`vitest run`): **21 test files, 143 tests, all passed** (was 140 before this piece — the 3 new
`chooseFitTarget` cases).

### 5. E2E run (fresh: ports 9223/5180 confirmed down beforehand, no shell/vite/tauri/webview2
remnants running) — **A7' FAILED**

```
Step       Status  Note
---------  ------  ----------------------------------------
A1'        PASS    title/header "Spatial IDE" present; "Open GeoParquet…" button present
A3'        PASS    admitted; DescribeSummary contains the five expected substrings; no refusal panel appears
A4'        PASS    overall 21.4% non-bg; 6/9 grid cells > 5%; "Zoom to layer" present (settled=true)
A5'/A6'    PASS    pan settled=true, zoom settled=true; no refusal/banner either time; pixels 25.7% non-bg after
A7'        FAIL    A7': pixels non-background fraction 0.00% <= 2% after "Zoom to layer" (settled=true;
                    was provably off-data first: 0.00% non-bg after 2 drag(s) of 1920px)
A8'        PASS    16 alternating pan/zoom gestures, no settle waits between; settled after=true; no refusal/banner; no too_many_pending_streams
A9'        PASS    hovered a verified non-background pixel ... -> "id 70691 @ (2600034.643, 1208940.000)"; hover-readout gone over empty
B2'/B3'    PASS    refused engine.crs_undeclared; message verbatim; cut-2 note present; no dismiss button; no describe-summary
C2'/C3'    PASS    refused engine.identity_unusable; message verbatim; cut-2 note present; no dismiss button; no describe-summary
OVERCEIL'  PASS    admitted (render-side refusal, not admission-side); .canvas-refusal and .residency-status both present; 78191 of 100000 rendered (20.0% non-bg); Dismiss removed banner, status remained
REOPEN'    PASS    reopened 100k fixture -> admitted; .residency-status cleared immediately; canvas 13.4% non-bg after settle
NET'       INFO    no >=400 response observed this run
```

Full ledger: `frontends/shell/e2e/out/regression-render-trace-1786726760619.json`. **`panUntilOffData`
itself worked exactly as designed** — 2 drags of 1920px (`rect.width * 1.5`, `rect.width` was 1280)
each provably reached 0.00% non-background, well inside the 10-drag ceiling — confirming the harness
did what Fix 2 asked: reproduce a genuine full pan-away, not the old fixed-stride near-miss. The camera
then failed to bring any data back after the click.

### 6. Root-cause diagnosis of the A7' failure — one attempt, verified by reading source, no further
### code change made (rule 7 discipline)

**The piece's given diagnosis is correct as far as it goes but incomplete: giving `fitToBounds` a
target to recenter on is necessary but not sufficient.** `fitToExtent` (`WorkingCanvas.tsx`) recenters
the camera via `frame.forceRecenter(...)` and `deckRef.current?.setProps({ initialViewState: {...} })`
— a **programmatic** view-state change. It never calls `onViewportChangedRef.current(...)`, which is
the only thing that reaches `App.tsx`'s `onViewportChanged` handler and, through it,
`ViewportStreamManager.requestViewport` — the one code path that actually issues a fresh
`viewport_query` and fetches new batches for wherever the camera now points
(`App.tsx:384` `onViewportChanged={(bbox) => { ... reportViewportOutcome(manager.requestViewport(bbox,
bboxCrs)); }}`, driven only from `WorkingCanvas.tsx`'s own `onViewStateChange: ({ viewState }) => {
... onViewportChangedRef.current(computeAuthoritativeViewportBbox(...)); }` — a callback deck.gl fires
only for *interactive* view-state changes, confirmed by reading the installed
`@deck.gl/core@9.3.7`'s own `dist/lib/deck.js`: `setProps` (lines ~315-376), when given a new
`initialViewState`, writes `this.viewState` directly and pushes it straight into `viewManager.setProps`
— it never calls `this._onViewStateChange` (line 1044), which is wired up (line 954,
`onViewStateChange: this._onViewStateChange.bind(this)`) as the `ViewManager`/`Controller`'s own
interaction callback, not something a programmatic `setProps` call ever reaches.

**Consequence:** when residency is non-empty (the operator's "re-centers when the layer is visible"
case, and every case this repo's original A7'/A4' exercised), `fitToExtent` recentering the camera is
enough on its own — `render()` immediately redraws whatever is *already* resident at the new camera
position, no new query needed. But once supersede-on-pan (2026-08-13 D2 fix) has cleared residency to
*empty* — exactly the scenario Fix 1's `fitAnchorRef` fallback exists for — recentering the camera onto
the anchor bbox moves the camera to a spot with **no resident batches to draw**, and nothing ever
issues the fresh `viewport_query` that spot would need to become non-blank. The button now visibly
"does something" (the camera provably moves, confirmed via `traceViewState` in the render-trace ledger)
but the canvas stays exactly as blank as before the click — which is exactly what the E2E run's
0.00% → 0.00% observation shows.

**What Fix 1's shape does not do, and what a corrected fix likely needs**: the anchor-fallback branch
of `fitToBounds` (only that branch — the resident-based branch must stay query-free, since re-issuing a
query there would be a needless network round trip for data already on screen) needs to also drive a
fresh `onViewportChangedRef.current(...)` call with the bbox the camera just landed on, so
`ViewportStreamManager.requestViewport` actually fetches data for it. This is a materially different
shape than "add a second ref and a fallback" — it means `fitToBounds`'s no-longer-pure "recenter" side
effect must, in exactly the emptied-residency case, also re-enter the same query-issuing path pan/zoom
gestures use, which was out of this piece's literal scope (`WorkingCanvas` alone; `onViewportChanged`
is a prop it already has, so the wiring may be small, but it is a behavioral decision — e.g. whether to
reuse `computeAuthoritativeViewportBbox` at the new camera position/zoom exactly as
`onViewStateChange` does, and whether the anchor's own *fit* zoom is the right bbox to query, not
necessarily the same shape as an incidental pan/zoom bbox — that this piece is not authorized to decide
unilaterally per the stop condition).

### 7. State left, not committed

```
git status --porcelain
 M frontends/shell/e2e/regression.mjs
 M frontends/shell/src/canvas/WorkingCanvas.tsx
 M frontends/shell/src/canvas/extent.test.ts
 M frontends/shell/src/canvas/extent.ts
 M frontends/shell/src/styles.css
?? CUT-STATE-import-layout.md
?? CUT-STATE.md
?? E2E-STATE.md
?? NIGHT-STATE.md
```

All five modified files above are the piece's own work (Fix 1 in `extent.ts`/`extent.test.ts`/
`WorkingCanvas.tsx`, Fix 2 in `regression.mjs`, Fix 3 in `styles.css`) — left uncommitted per the
piece's own stop condition. `MANUAL-WALKTHROUGH.md`'s result log (already filled in before this piece
started) and `DECISIONS-PENDING.md` are untouched by this piece. The app the E2E run launched is still
running on CDP port 9223 (this script's own stated policy — never stopped, success or failure) for
whoever picks this up next to inspect interactively without a fresh launch.

**Superseded by §8 below** — the coordinator confirmed the §6 diagnosis and authorized the exact
completion; this "Next piece" pointer is no longer live.

### 8. Completion — the anchor-fallback re-query wiring (coordinator-authorized, 2026-08-14)

Scope as given by the coordinator: stay entirely inside the existing query pipeline, no new surface.
Implemented exactly as specified, both call sites' `notifyViewport` argument as directed.

**`WorkingCanvas.fitToExtent`** gains a second parameter, `notifyViewport: boolean`. After the
existing `setProps({ initialViewState })` + `render()`, when `notifyViewport` is `true`, it computes
the fitted view's own authoritative viewport bbox and emits it through `onViewportChangedRef.current`
— the exact same `onViewportChanged` prop `App.tsx` already wires to
`ViewportStreamManager.requestViewport`, unchanged downstream (supersede + fresh ticketed stream, all
pre-existing code, none of it touched).

**`frontends/shell/src/canvas/extent.ts`**: new exported pure function `bboxForFit(fit, frameOriginX,
frameOriginY, widthPx, heightPx)`, which calls `viewportBbox.ts`'s existing
`computeAuthoritativeViewportBbox` with `targetX/targetY` taken from `fit.target` (always `[0,0]` by
`fitViewStateForBbox`'s own contract) and `originX/originY` taken from the caller's own
already-recentered frame — reusing the exact same computation `onViewStateChange` uses for every
interactive pan/zoom, never a second implementation of the same formula.

**Call sites:**
- `fitToBounds()` → `fitToExtent(bbox, true)`. Commented: a user explicitly asked to go here, so the
  app must fetch what is actually there — the missing half of the A7 fix, most needed exactly when
  `fitAnchorRef` fired (residency emptied, nothing already on screen for a bare `render()` to redraw).
- The one-shot auto-fit-on-open (inside `pushBatch`) → `fitToExtent(residentExtentRef.current, false)`.
  Commented with the coordinator's own reasoning: this data is already streaming in from the initial
  unfiltered, unbounded `viewport_query` issued at open; emitting a viewport-changed bbox here would
  feed straight into `requestViewport`, which supersedes-on-pan (D2) the very stream currently
  delivering this batch — cancelling and re-issuing a narrower query mid-flight, re-fetching everything
  already in transit. A real cost under D2-era supersede semantics, not a hypothetical one.

**Unit-test seam chosen**: `fitToExtent` itself is still not reachable in this package's jsdom test
environment (needs a live `Deck`/WebGL canvas) — so, per the coordinator's own fallback instruction,
`bboxForFit` is the extracted pure "fit → bbox to emit" computation, tested directly in
`extent.test.ts` (`describe("bboxForFit (2026-08-14 walkthrough A7 fix, second half)")`, 3 new cases):
reconstructs the authoritative viewport bbox from a fit's zoom and a given post-recenter origin
(exact numeric case); is centered on the `frameOriginX`/`frameOriginY` parameters actually passed, not
silently re-derived from the fit's own `centerX`/`centerY` field (guards against a caller-order bug);
covers the original extent a real `fitViewStateForBbox` fit was computed for, once fed that fit's own
center as the post-recenter origin (margin only ever grows the box, never shrinks it below the
original). The "choose" half (the `if (notifyViewport)` gate itself) is a single trivial branch with no
independent logic to test beyond what a component/integration test would need — left untested directly,
matching the coordinator's own framing ("the choose-and-compute logic" as one seam, satisfied by the
compute half since the choose half has no computation in it).

**`npm run verify` — GREEN**: typecheck clean, build clean (`✓ built in 3.39s`), test: **21 test
files, 146 tests, all passed** (143 → 146, the 3 new `bboxForFit` cases).

**E2E run — fresh, ALL 12 STEPS PASS, including the strengthened `A7'`.** Remnants killed first
(`spatial-ide-shell.exe` PID 16756 and its full process tree — the `cargo`/`tauri dev`/`vite`/
`msedgewebview2.exe` descendants left running from the prior FAILing run — via `taskkill /T /F` on
each root PID); ports 9223 and 5180 confirmed down (`Test-NetConnection` → both `False`) before
launch:

```
Step       Status  Note
---------  ------  ----------------------------------------
A1'        PASS    title/header "Spatial IDE" present; "Open GeoParquet…" button present
A3'        PASS    admitted; DescribeSummary contains the five expected substrings; no refusal panel appears
A4'        PASS    overall 21.4% non-bg; 6/9 grid cells > 5%; "Zoom to layer" present (settled=true)
A5'/A6'    PASS    pan settled=true, zoom settled=true; no refusal/banner either time; pixels 25.7% non-bg after
A7'        PASS    panned off-data (2 drag(s) of 1920px, 0.00% non-bg <= 0.5% threshold), clicked "Zoom to layer", pixels 13.4% non-bg after (settled=true)
A8'        PASS    16 alternating pan/zoom gestures, no settle waits between; settled after=true; no refusal/banner; no too_many_pending_streams
A9'        PASS    hovered a verified non-background pixel (buffer 606,104, flipY=true, css 606.5,695.5) after 1 attempt(s) -> "id 49812 @ (2601749.359, 1206300.000)"; moved to emptiest cell (#0, 0.0%) -> hover-readout gone
B2'/B3'    PASS    refused engine.crs_undeclared; message verbatim; cut-2 note present; no dismiss button on the panel; no describe-summary
C2'/C3'    PASS    refused engine.identity_unusable; message verbatim; cut-2 note present; no dismiss button on the panel; no describe-summary
OVERCEIL'  PASS    admitted (render-side refusal, not admission-side); .canvas-refusal and .residency-status both present after settle; 78191 of 100000 features rendered (20.0% pixels non-bg); Dismiss removed the banner but .residency-status remained: "78191 of 100000 features rendered — declared ceiling reached (MAX_RESIDENT_VERTICES)"
REOPEN'    PASS    reopened 100k fixture -> admitted; .residency-status cleared immediately (dataset change, not Dismiss); canvas 13.4% non-bg after settle
NET'       INFO    no >=400 response observed this run (index.html declares no <link rel>, nothing to probe)
```

Full ledger: `frontends/shell/e2e/out/regression-render-trace-1786727379404.json`. `A7'` needed no
settle-widening — the existing 3000ms quiet / 45000ms bound after the click was enough for the
debounced (`VIEWPORT_QUERY_MIN_INTERVAL_MS = 120ms`) `requestViewport` call and its delivery to land.

**Commit**: single commit, everything from both halves of this piece (Fix 1/2/3 plus this completion),
standard identity flags (`-c user.name=chris -c user.email=chrys92d@gmail.com -s`). See the worker
report for the hash. Not pushed.

### 9. Same-day determinism follow-up (coordinator-authorized, operator live re-check)

**The operator's follow-up finding.** After §8's completion landed, the human re-checked "Zoom to
layer" live: it now worked from the void (§8 fixed that), but its resulting zoom was "kinda random"
across repeated clicks. Mechanism, confirmed and matching the coordinator's own framing:
`chooseFitTarget` preferred CURRENT residency (`resident ?? anchor`), and post-clearing, residency
depends on scroll history and refill timing -- worse, `fitToBounds`'s own `notifyViewport: true`
query (§8) supersedes-and-wipes residency, so a *second* click landing during the first click's own
refill window could see empty residency (→ anchor fallback → a different fit than the first click,
which had seen partial or full residency). Fit target varying per click is the observed randomness.

**Fix, authorized: invert the preference to anchor-first, collapsed to anchor-only.**
`chooseFitTarget` (`extent.ts`) is safe to fit ONLY the anchor unconditionally -- the anchor is
provably a superset of whatever residency ever was (both grow from the same `unionBbox(...,
batchExtent)` call in `pushBatch`, and the anchor is never shrunk), so once anything has ever loaded,
the anchor IS the layer's known extent. The residency parameter was dropped from the function's
signature entirely, not kept as a `resident ?? anchor` shape with residency now-always-shadowed --
nothing else in the module ever called it with a residency argument, and a parameter that can never
change the return value is worse than no parameter (the "collapse to just the anchor" option the
coordinator offered, chosen as the cleaner shape over keeping a two-argument `anchor ?? resident`).
`WorkingCanvas.fitToBounds()`'s call site updated to `chooseFitTarget(fitAnchorRef.current)` --
`residentExtentRef` is no longer read by this method at all (it stays in active use elsewhere: the
auto-fit-on-open branch and `recomputeResidentExtent`, both untouched by this follow-up).

**Doc comments updated** (both files, all four locations the coordinator named): `chooseFitTarget`'s
own doc comment (`extent.ts`) now carries the full two-finding account (the original A7 defect, then
this same-day determinism follow-up) and the superset-safety argument; `WorkingCanvas.tsx`'s
`WorkingCanvasHandle.fitToBounds()` interface doc, the `fitAnchorRef` ref's own doc comment, and the
`fitToBounds()` implementation's inline comment were all updated to state plainly that the method
fits the layer's best-known extent, deliberately never current residency, and why (scroll-history/
refill-timing dependence reading as "random" to an operator expecting the same place every click).

**`MANUAL-WALKTHROUGH.md`'s A7 row** updated: "The camera jumps back to fit the layer's known
extent — the same fit A4 produced, deterministically, regardless of what is currently loaded" (was:
"...the full extent of whatever is still resident, the same fit A4 produced").

**Unit tests** (`extent.test.ts`, `describe("chooseFitTarget (2026-08-14 walkthrough A7 fix +
same-day determinism follow-up)")`, 3 cases, replacing the prior 3): fits the anchor when non-null;
returns `null` only when nothing has ever been admitted; **the determinism property** -- builds an
anchor from two batches via the same `unionBbox` calls production code uses, takes a fit, simulates a
residency clear (`residentExtent = null`, mirroring `clearStream`'s own effect), takes the fit again,
and asserts the two fits are identical (`{xmin:0,ymin:0,xmax:30,ymax:30}` both times) -- the anchor
itself is never touched by the simulated clear, which is exactly the property this whole follow-up is
about.

**`npm run verify` — GREEN**: typecheck clean, build clean (`✓ built in 3.34s`), test: **21 test
files, 146 tests, all passed** (unchanged count from §8 -- 3 `chooseFitTarget` tests replaced 1:1,
same total).

**E2E run — fresh, ALL 12 STEPS PASS, including `A7'`/`A4'`.** Remnants killed first
(`spatial-ide-shell.exe` and its full `cargo`/`tauri dev`/`vite`/`msedgewebview2.exe` process tree,
via `taskkill /T /F` on each root PID); ports 9223/5180 confirmed down (`Test-NetConnection` → both
`False`) before launch:

```
A4'        PASS    overall 21.4% non-bg; 6/9 grid cells > 5%; "Zoom to layer" present (settled=true)
A7'        PASS    panned off-data (2 drag(s) of 1920px, 0.00% non-bg <= 0.5% threshold), clicked "Zoom to layer", pixels 13.4% non-bg after (settled=true)
```
(full 12-step table identical in shape to §8's; every step PASS, ledger:
`frontends/shell/e2e/out/regression-render-trace-1786728195596.json`). `A7'`/`A4'` numbers are
pixel-fraction assertions only, unaffected in principle by which target `chooseFitTarget` picks (both
the old and new preference land on the same bbox once nothing has been panned away and cleared yet) --
run anyway per the coordinator's own instruction, to prove it, not merely assert it in principle.

**Commit**: single commit, standard identity flags (`-c user.name=chris -c user.email=chrys92d@gmail.com
-s`), citing the operator's live re-check finding. See the worker report for the hash. Not pushed.

### 10. State left, committed (final)

```
git status --porcelain
?? CUT-STATE-import-layout.md
?? CUT-STATE.md
?? E2E-STATE.md
?? NIGHT-STATE.md
```

All six touched files across both the completion (§8) and this determinism follow-up (§9) --
`extent.ts`, `extent.test.ts`, `WorkingCanvas.tsx`, `regression.mjs`, `styles.css`,
`MANUAL-WALKTHROUGH.md` -- are committed by this piece (two commits total: §8's completion commit,
then this follow-up's own commit). `CUT-STATE-import-layout.md`,
`E2E-STATE.md`, `NIGHT-STATE.md` predate this piece and stay untracked/untouched.  `CUT-STATE.md`
(this file) stays untracked per this repo's established convention, carrying this section's own
record. The app the final E2E run launched is still running on CDP port 9223 (the script's own stated
policy — never stopped, success or failure).

---

# CUT-STATE — filter-panel cut, phases P1 / P2

Fresh section for `NEXT-CUT.md`'s filter-panel cut (branch `cut/filter-panel`, stacked on
`cut/sql-filter`, merge order #9 → #10 → this). P0 (SKP-V0 §4.5 re-deferral + DECISIONS-PENDING
entry) landed in commit `1ce5b691`, before this record starts. This section covers P1 (manager
reporting seam) and P2 (App filter state) only -- P3 (FilterPanel component), P4 (liveness/cancel),
P5 (slow fixture + E2E suite), P6 (reviewer), P7 (walkthrough + PR) are later pieces, not addressed
here. Everything below follows the architect's binding design section in `NEXT-CUT.md` (deleted by
this cut's own final docs commit; not reproduced in full here -- see the piece's own git history for
the brief's exact text if `NEXT-CUT.md` is already gone by the time this is read).

## Phase P1 — manager reporting seam: `RequestOutcome` + `onStreamOpened`

**Reporting only, no behavior change** (the piece's own binding constraint): every existing
throttle/generation/supersede code path in `ViewportStreamManager.requestViewport`
(`frontends/shell/src/streaming/viewportStreamManager.ts`) is untouched logic-wise; only what each
existing early return communicates changed.

### 1. `RequestOutcome` + `requestViewport`'s new return type

```ts
export type RequestOutcome =
  | { kind: "issued"; streamHandle: string }
  | { kind: "throttled" }
  | { kind: "superseded" }
  | { kind: "stopped" };
```

`requestViewport(...)`: `Promise<void>` → `Promise<RequestOutcome>`. Mapping, exactly as the piece
specified:

| Existing early return | New outcome |
|---|---|
| `stopped`-guard (top of the method) | `{kind:"stopped"}` |
| `VIEWPORT_QUERY_MIN_INTERVAL_MS` throttle-guard | `{kind:"throttled"}` |
| Generation-loss check after `supersedeCurrent()` | `{kind:"superseded"}` |
| Generation-loss check after `viewportQuery()` resolves | `{kind:"superseded"}` |
| Generation-loss check after `dataPlaneAttach()` resolves | `{kind:"superseded"}` |
| `startStream(...)` actually runs (falls through to the end) | `{kind:"issued", streamHandle: stream}` (new `return` added; there was none before) |

All three generation-loss checks map to `"superseded"` uniformly, including the case a concurrent
`stop()` (not just a newer call) caused the loss -- this is the exact ambiguity the method's own
pre-existing comment already named ("superseded (or stopped, which also bumps the generation)"); the
piece's own mapping instruction treats every generation-loss path as `"superseded"`, so this is not a
new distinction this piece invented.

### 2. `onStreamOpened`

New optional `ViewportStreamManagerOptions.onStreamOpened?: (streamHandle: string) => void`, wired
from `sink.onOpen` (previously a no-op `() => {}`) -- TAG_OPEN, the only batch-independent liveness
signal, no protocol change. Guarded identically to `onBatch`'s own existing guard (`if
(this.currentStreamHandle !== streamHandleAtStart) return;`): a TAG_OPEN arriving late for a stream
this manager has already superseded (the old WebSocket keeps delivering frames until the producer
acts on the SKP cancel -- neither `supersedeCurrent` nor `cancelStream` ever closes the socket
directly) must not report liveness for a query nobody is waiting on anymore. Made explicit per the
piece's own instruction to check whether `onBatch`'s guard pattern applies here -- it does, and a new
test (`onStreamOpened ... does NOT fire for a superseded stream's late TAG_OPEN`) proves it the same
way the suite's pre-existing "a batch arriving late from a superseded stream is dropped" test does
for `onBatch`.

### 3. Tests (`viewportStreamManager.test.ts`, extended in its own style)

Two new `describe` blocks, 7 new `it`s total (21 pre-existing + 7 = 28, all green):

- `requestViewport's returned RequestOutcome (P1: reporting seam, no behavior change)` -- one test
  per outcome kind: a successful mint → `{kind:"issued", streamHandle}`; a throttled call →
  `{kind:"throttled"}` (plus `viewportQueryMock` still called exactly once, proving the underlying
  no-op is unchanged); a call after `stop()` → `{kind:"stopped"}`; the suite's own pre-existing
  re-entrancy scenario (a call whose `viewportQuery` resolves after a newer call already won) →
  `{kind:"superseded"}` for the losing call, `cancelMock` still called with its abandoned ticket.
- `onStreamOpened (P1 item 2: wired from sink.onOpen)` -- fires with the handle for the active
  stream's own TAG_OPEN; does NOT fire for a superseded stream's late TAG_OPEN; the newly active
  stream's own TAG_OPEN still fires normally after a supersede (three tests, the middle one being
  the explicit guard-check the piece asked for).

### 4. `e2e-test-surface.ts` + `App.tsx` + `e2e/filter.mjs`: closing the "no-refusal" honesty gap

`FilterQueryOutcome` (`e2e-test-surface.ts`) changed from `{kind:"no-refusal"} |
{kind:"refused",...}` to `RequestOutcome | {kind:"refused",...}` -- `queryWithFilter` (`App.tsx`'s
hook registration) now returns `requestViewport`'s own `RequestOutcome` directly (no more
"no-refusal" collapse of issued/throttled/superseded/stopped into one claim-nothing value), falling
back to `{kind:"refused", code, message}` only for a thrown `SkpCallError`. Both files' doc comments
rewritten to describe the honest contract instead of naming the gap.

`e2e/filter.mjs`'s `FILTER'` step: assertion changed from `outcome.kind !== "no-refusal"` to
`outcome.kind !== "issued"` (the one literal-string reference the piece asked to check for and fix).

## Phase P2 — App filter state: `activeFilter`/`activeFilterRef`, Apply helper, dataset-reset extension

All in `frontends/shell/src/App.tsx` (+ `App.test.ts`), per the architect's Design section verbatim.
**No JSX changed** -- P2's own scope is state/refs/pure helpers only; P3 builds the actual panel and
wires it in.

### 1. `activeFilter` state + `activeFilterRef`, three ref-reading issue sites

`const [activeFilter, setActiveFilter] = useState<Filter | null>(null);` +
`const activeFilterRef = useRef<Filter | null>(null);`, kept in sync by one function,
`commitActiveFilter` (`useCallback([])`-stable), which writes BOTH. `activeFilter` (the render value)
has no reader yet in this piece -- P3 is where the panel actually consumes it -- so a `void
activeFilter;` line with an explanatory comment satisfies `noUnusedLocals` (confirmed by direct
experiment: `tsc --noUnusedLocals` does NOT flag an unused element of `useState`'s array-destructuring
pattern at module scope, but DOES flag it inside a function body -- `App`'s own `useState` calls are
all inside the `App()` function, so this was a real, verified compile error, not a theoretical one).

**Reading `NEXT-CUT.md`'s "all three issue sites read the REF at issue time" literally** required
resolving one ambiguity the design section itself does not spell out: Apply's own primary call sends
the NEWLY TYPED filter value, not the ref (that is the whole point of "Apply = supersede
immediately" -- the ref still holds the OLD filter at that moment). The three ref-reading sites this
piece implements are therefore: (1) the initial unfiltered load (reads `activeFilterRef.current`,
always `null` in practice since a fresh admission already cleared it, but read uniformly rather than
hardcoded for consistency with the other two sites); (2) the debounced pan/zoom closure body,
reading INSIDE the body at fire time (`makeDebouncedViewportQuery`, below); (3) `applyFilter`'s own
refusal-recovery re-issue, which reads `activeFilterRef.current` as "the last successfully-issued
filter" to recover to. This reading is disclosed as an interpretation, not restated as if the brief
spelled it out this precisely -- see Deviations.

### 2. `requestViewportWithSingleRetry` (exported pure helper)

```ts
export async function requestViewportWithSingleRetry(
  attempt: () => Promise<RequestOutcome>,
  wait: (ms: number) => Promise<void> = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
): Promise<RequestOutcome>
```

First attempt not `"throttled"` → returned unchanged, `wait` never called. First attempt
`"throttled"` → waits `VIEWPORT_QUERY_MIN_INTERVAL_MS`, retries exactly once, returns that second
attempt's outcome whatever it is (including a second `"throttled"` -- ONE retry, never a loop). A
thrown refusal propagates directly, never swallowed or retried.

### 3. `applyFilter` (exported pure helper, "the helper App exposes for P3's panel")

```ts
export type ApplyFilterOutcome =
  | { kind: "applied"; streamHandle: string }
  | { kind: "not-applied" }
  | { kind: "refused"; refusal: FormattedRefusal };

export async function applyFilter(newFilter: Filter | null, deps: ApplyFilterDeps): Promise<ApplyFilterOutcome>
```

Sequence: cancel the pending debounce FIRST (design (a), before anything else) → read
`getLastViewportBbox()` → `requestViewportWithSingleRetry(() => deps.requestViewport(bbox,
newFilter))`. On `{kind:"issued"}`: `commitActiveFilter(newFilter)`, return `{kind:"applied",
streamHandle}`. On any other resolved outcome (throttled-after-retry, superseded, stopped): return
`{kind:"not-applied"}`, `activeFilter` untouched. On a thrown `SkpCallError` (a refusal): the
typo-blanks-canvas fix -- re-issue `deps.getActiveFilter()` (the previous filter, unchanged by the
failed attempt) over the same bbox through the SAME retry helper, then return `{kind:"refused",
refusal: formatRefusal(e.skpError)}`; `activeFilter` is never touched by the failed attempt, so it
already equals "the last successfully-issued filter" -- no separate tracking variable needed. An
unexpected (non-`SkpCallError`) failure propagates unswallowed (ADR-010 rule 7).

**Not wired into any live call site in this piece** -- `applyFilter` is exported, fully unit-tested,
and ready for P3's Apply button (and, per the design section's "the e2e hook can share it" remark,
possibly a future `queryWithFilter` refactor), but nothing in P1 or P2 calls it yet. Disclosed
explicitly: P1's own `queryWithFilter` hook change (see above) deliberately stayed a thin, direct
`RequestOutcome` pass-through rather than routing through `applyFilter` -- see Deviations for the
reasoning.

### 4. `makeDebouncedViewportQuery` (exported pure helper) + `lastViewportBboxRef`

```ts
export function makeDebouncedViewportQuery(
  requestViewport: (bbox: Bbox, bboxCrs: string | null, filter: Filter | null) => Promise<RequestOutcome>,
  activeFilterRef: { current: Filter | null },
  reportOutcome: (promise: Promise<RequestOutcome>) => void
): (bbox: Bbox, bboxCrs: string | null) => void
```

Wired into the `[admitted]` effect's `debounce(...)` call in place of the old inline arrow -- reads
`activeFilterRef.current` INSIDE the returned closure body, i.e. at fire time, never captured as an
argument at `debounced.call()` time. `lastViewportBboxRef` (`useRef<Bbox | null>(null)`) is written
on EVERY `onViewportChanged` firing (not just a debounced/settled one, since `WorkingCanvas`'s own
`onViewStateChange` already fires per pointer-move frame during a drag -- confirmed by reading
`WorkingCanvas.tsx` directly rather than assuming from its doc comment's "after every settled
view-state change" wording, which is about the *authoritative bbox computation*, not about
`onViewportChanged`'s own call frequency) -- `null` until the first fire, satisfying "null until
first settled view" as an initial-value property rather than a special filter on which fires count.

### 5. `admitAndResetStaleUiState` extended (+ tests)

Two new required setter fields, `setActiveFilter: (value: Filter | null) => void` and
`setLastViewportBbox: (value: Bbox | null) => void`, both called with `null` alongside the four
pre-existing resets, before `setAdmitted`. `App.tsx`'s own call site passes `commitActiveFilter` (not
the raw `useState` setter) for `setActiveFilter`, so a dataset change writes both the ref and the
render state in one call, and an inline ref-writer for `setLastViewportBbox`. All three pre-existing
`admitAndResetStaleUiState` tests in `App.test.ts` extended with the two new setters + their own
assertions (called once, called with `null`); no test's existing assertions changed.

### 6. Unit tests (`App.test.ts`, 13 pre-existing → 24, all green)

New `describe` blocks: `requestViewportWithSingleRetry` (4 tests: no-retry pass-through, one retry on
throttled, a second throttled returned as-is with no third attempt, a thrown refusal propagates
unswallowed); `applyFilter` (6 tests: cancel-debounce-first ordering, issue-over-lastViewportBbox +
commit-on-issued, throttled-after-retry → not-applied + no commit, refusal → refused + previous-filter
recovery re-issue asserted by exact call arguments, an unexpected failure propagates); the ordering
test the piece named explicitly, under `makeDebouncedViewportQuery` (2 tests, real `debounce()`
module, fake timers): **apply-between-schedule-and-fire** -- `debounced.call(bbox, null)` scheduled
while `activeFilterRef.current` is `null`, then `activeFilterRef.current` is set to a new filter
*before* the debounce's settle window elapses, then `vi.advanceTimersByTimeAsync(...)` fires it --
asserts `requestViewport` was called with the NEW filter, not the one active at schedule time; a
sibling test proves the unfiltered case is unaffected (still issues with `filter: null`).

### Verify

```
$ cd frontends/shell && npm run verify
✓ built in 3.34s–3.62s (varies by run)
 Test Files  21 passed (21)
      Tests  164 passed (164)
```

(146 baseline + 7 P1 `viewportStreamManager.test.ts` tests + 11 P2 `App.test.ts` tests = 164.)

### Fresh E2E confirmation (both existing suites, one run each, after killing remnants)

Killed the full process tree left running by the prior operator session (`taskkill /T /F` on the
root `npx tauri dev` PID, which cascaded through `tauri.js`, `npm run dev`, `vite`, `cargo`,
`spatial-ide-shell.exe`, and every child `msedgewebview2.exe`); confirmed no `spatial-ide-shell.exe`/
`cargo.exe` processes remained and every still-running `msedgewebview2.exe` belonged to unrelated
apps (WhatsApp, Google Drive), not this shell. Ports 9223/5180 confirmed down via
`Test-NetConnection` (`TcpTestSucceeded: False`, both) before launch.

```
node e2e/regression.mjs   -- 12/12 PASS (A1'..A9', B2'/B3', C2'/C3', OVERCEIL', REOPEN', NET' info-only)
node e2e/filter.mjs       -- 3/3 PASS  (OPEN, FILTER' [now asserting {kind:"issued"}], REFUSED')
```

Full step tables: `frontends/shell/e2e/out/regression-render-trace-1786731960283.json`,
`frontends/shell/e2e/out/filter-render-trace-1786731973673.json`. `filter.mjs` attached to the
already-running app `regression.mjs` had just launched (both scripts' own stated policy: never stop
the app, success or failure) -- left running on CDP port 9223 afterward.

## Deviations from the piece as declared

1. **The "three issue sites" reading `activeFilterRef.current`** are interpreted as (initial load,
   debounced pan/zoom, refusal-recovery re-issue) rather than literally "Apply" as a fourth
   ref-reader -- Apply's own primary call sends the newly-typed filter value, which by construction
   cannot come from a ref that (by design item 3) is not written until that same call succeeds. This
   reading is self-consistent and exercised by tests at every one of the three sites, but is
   disclosed as an interpretation of an ambiguity the design section's prose does not resolve
   explicitly, not as a restatement of settled text.
2. **`applyFilter` is not wired into any live call site yet** -- exported and fully tested per the
   piece's own item 5 ("Unit tests for all of the above at the established pure-function seams"), but
   P2's scope fence (from `NEXT-CUT.md`'s own phase table) is state/helpers only; P3 owns the actual
   Apply button and its JSX wiring. Named explicitly rather than silently left for P3 to discover.
3. **P1's `queryWithFilter` hook was NOT routed through P2's `applyFilter`**, despite the design
   section's "the e2e hook can share it per the same-seam doctrine" remark. P1's own item 4 is
   self-contained and explicit ("make the hook return the real outcome kind plus streamHandle when
   issued") and was implemented as a direct `RequestOutcome` pass-through, independent of P2's
   activeFilter/retry/commit machinery, which did not exist yet when P1 was implemented within this
   same piece. Read "can share it" as naming a future option (plausibly for P3), not a mandate to
   retrofit P1's hook in this piece -- disclosed here as a judgment call, not hidden.
4. **`RequestOutcome`'s generation-loss ambiguity (stopped-vs-superseded) is preserved, not
   resolved** -- P1 item 1's own literal mapping instruction says "generation-lost paths →
   'superseded'", which this piece followed exactly rather than trying to disambiguate a concurrent
   `stop()` from a concurrent newer call (the manager's own pre-existing code already cannot tell
   these apart at that point either -- see `requestViewport`'s own comment on the first
   generation-loss check).
5. Everything else matches the piece as declared: P1 is reporting-only with zero behavior change to
   any existing throttle/generation/supersede test (all 21 pre-existing `viewportStreamManager.test.ts`
   tests pass unmodified but for the return-type change itself); the single-retry helper retries
   exactly once, never loops; `activeFilter` is assigned ONLY on an issued outcome; the dataset-change
   reset covers filter + ref + `lastViewportBbox` via the extended `admitAndResetStaleUiState`.

## State left for this piece, before commit

```
git status --porcelain (after both commits)
?? CUT-STATE-import-layout.md
?? CUT-STATE.md
?? E2E-STATE.md
?? NEXT-CUT.md
?? NIGHT-STATE.md
```

P1 committed separately from P2 (two commits, both `git -c user.name=chris -c
user.email=chrys92d@gmail.com commit -s`, neither pushed) -- see the worker report for both hashes.
P1's commit: `frontends/shell/src/streaming/viewportStreamManager.ts`,
`frontends/shell/src/streaming/viewportStreamManager.test.ts`,
`frontends/shell/src/e2e-test-surface.ts`, `frontends/shell/e2e/filter.mjs`, and the minimal
`App.tsx` ripple the manager's own return-type change forces (the `RequestOutcome` import,
`reportViewportOutcome`'s parameter type, and the `queryWithFilter` hook body) -- reconstructed as an
isolated, independently-typechecked-and-tested slice (`git checkout HEAD -- App.tsx`, hand-applied
just the P1 edits, verified green standalone, committed, then the full P1+P2 `App.tsx`/`App.test.ts`
content restored byte-identical from a backup and diffed to confirm before P2's own commit). P2's
commit: the remainder of `App.tsx` + all of `App.test.ts`. `CUT-STATE-import-layout.md`,
`E2E-STATE.md`, `NEXT-CUT.md`, `NIGHT-STATE.md` predate this piece and stay untracked/untouched.
`CUT-STATE.md` (this file) stays untracked per this repo's established convention.

## Phase P3 -- FilterPanel component: input/Apply/Clear, shared refusal block, deviation-3 retrofit

New `src/filter/FilterPanel.tsx`: one text input (`input.filter-predicate`, Enter-to-apply),
`button.filter-apply` (disabled while a call is in flight), `button.filter-clear`. Both route through
one local `submit(text)` -- `predicateTextToFilter(text)` (new `src/filter/predicateInput.ts`, the
ONE admitted client-side mapping, binding note 1: empty input -> `filter: null`, no trim/case-fold/
ceiling, whitespace-only rides verbatim) then `onApply(filter)`, `App.tsx`'s own `handleApplyFilter`
-- a thin `useCallback` binding `applyFilter` (P2's export) over `issueQueryRef.current` (a new ref,
set inside the `[admitted]` effect to a thin wrapper over `manager.requestViewport`, read from
component-body level so `handleApplyFilter` does not itself need to live inside that effect),
`viewportDebounceRef.current?.cancel`, `lastViewportBboxRef`, `activeFilterRef`, and
`commitActiveFilter` -- exactly the bound closure the prior piece's "next piece" note described.

**Deviation-3 retrofit (CUT-STATE.md P1/P2 deviation 3, "the e2e queryWithFilter hook must be routed
through applyFilter ... hook and panel drive the identical seam"), done in this piece as instructed:**
the dev-only `queryWithFilter` E2E hook (`App.tsx`, registered inside the `[admitted]` effect) no
longer calls `manager.requestViewport` directly -- it calls `applyFilter` with a deps object
structurally identical to `handleApplyFilter`'s own, both ultimately reaching
`manager.requestViewport` through the same seam. `e2e-test-surface.ts`'s `FilterQueryOutcome` type
changed from `RequestOutcome | {kind:"refused", code, message}` to `App.tsx`'s own
`ApplyFilterOutcome` (`import type { ApplyFilterOutcome } from "./App"` -- a type-only circular
import between `App.tsx` and `e2e-test-surface.ts`/`FilterPanel.tsx`, confirmed safe by direct
experiment: both `tsc --noEmit` and `vite build` succeed, because nothing at either module's TOP
LEVEL reads the circularly-imported binding, only function bodies that run long after both modules
finish evaluating -- see the piece's own verify runs). `e2e/filter.mjs` updated for the new outcome
shape: `FILTER'` now asserts `outcome.kind === "applied"` (not `"issued"`); `REFUSED'` now reads
`outcome.refusal.code`/`outcome.refusal.message` (a nested `FormattedRefusal`, not a flat
`{code,message}` pair).

**Shared refusal block:** `AdmissionPanel.tsx`'s inline refusal JSX extracted into new
`src/admission/RefusalBlock.tsx`, preserving `.admission-refusal` / `.admission-refusal-code` /
`.admission-refusal-message` / `.admission-refusal-fields` / `.admission-cut2-note` byte-exactly (the
classes `e2e/regression.mjs`'s `stepRefusal` helper, B2'/C3', asserts directly -- confirmed still
green on the fresh E2E run below). No `<button>` rendered (that helper also asserts `hasButton ===
false`). `FilterPanel`'s own refusal renders inline in a `.filter-refusal` wrapper around the same
`RefusalBlock` component -- "code + verbatim message + fields dl" via the shared block, not a second
copy.

**The droppable column-list extra (P3 item 3) was built, then dropped -- a real regression, measured,
not guessed.** Built first (a static `<ul>` from `describe.schema`, geometry column marked). A fresh
`e2e/regression.mjs` run against the built version FAILED `A9'` (`.hover-readout` never appeared over
any of 4 read-back-verified non-background pixels) -- reproduced identically on a second run (same
buffer/css coordinates both times, ruling out ordinary timing flake). Diagnosed by querying the live
DOM over the already-running CDP session (`getBoundingClientRect()` on `.working-canvas` /
`.filter-panel` / `.admission-panel`): in the suite's 1280x800 window, `.admission-panel` (450px, the
100k fixture's `DescribeSummary`) + `.filter-panel` (152px, including the column list) left only
`762 - 450 = 312px` of `.app-main`'s height for `.canvas-container`, but the column list pushed
`.filter-panel` past the point where `.canvas-container`'s own `flex:1` could satisfy that without
hitting its `min-height: 200px` floor -- forcing the canvas to `top: 640.2px, height: 200px, bottom:
840.2px`, **40px below the 800px viewport**. A `bufferPointToCss` conversion from a correct, live
bounding rect still produces a physically off-screen target when the rect itself extends past the
visible window. Dropped the column list (`FilterColumnList` component + its `.filter-columns*` CSS)
-- the piece's own scope fence named this extra "droppable" -- and re-measured: `.filter-panel` drops
to 90px, `.canvas-container` reaches `top: 578.2px, height: 221.8px, bottom: 800px` (exactly filling
the viewport, floor not hit). `A9'` re-run PASSED immediately after. `describe` prop removed from
`FilterPanelProps` (no remaining consumer). Recorded in `FilterPanel.tsx`'s own module doc comment
too, not just here.

### Tests

New `src/filter/predicateInput.test.ts` (4 tests): empty -> `null`; whitespace-only rides verbatim
(not trimmed to empty); ordinary predicate; odd internal whitespace/casing never normalized. No
`AdmissionPanel` component-render test exists in this package (confirmed by inspection before
starting -- only `formatRefusal.test.ts` and `admitDataset.test.ts` touch that directory, neither
renders the component), so the refusal-block refactor's correctness is evidenced by the fresh
`regression.mjs` B2'/C3' run below, not a new unit test asserting DOM output this package has no
harness for.

### Verify

```
$ cd frontends/shell && npm run verify
✓ built in 3.39s
 Test Files  22 passed (22)
      Tests  168 passed (168)
```
(164 baseline + 4 new `predicateInput.test.ts` tests; `App.test.ts` unchanged at 24 -- P3 adds no new
exported pure function to `App.tsx` beyond `handleApplyFilter`, which is component-body wiring, not
extracted for direct unit testing, matching this file's own established convention of only unit-testing
the extracted pure helpers.)

### Fresh E2E confirmation (after killing remnants, ports down first)

Killed the full process tree rooted at the `npx tauri dev --config ... tauri.e2e.conf.json` PID
(`taskkill /T /F`); confirmed ports 9223/5180 both down (`Test-NetConnection` `TcpTestSucceeded: False`)
before each launch. Two full regression.mjs runs are recorded above in the narrative (the first, against
the column-list-included build, is the one that caught `A9'` failing twice identically; the second,
after dropping the column list, is the confirmation run):

```
node e2e/regression.mjs   -- 12/12 PASS (A1'..A9', B2'/B3', C2'/C3', OVERCEIL', REOPEN', NET' info-only)
node e2e/filter.mjs       -- 3/3 PASS  (OPEN, FILTER' [now asserting {kind:"applied"}], REFUSED' [outcome.refusal.*])
```

Ledgers: `frontends/shell/e2e/out/regression-render-trace-1786734456400.json`,
`frontends/shell/e2e/out/filter-render-trace-1786734469185.json`. `filter.mjs` attached to the
already-running app `regression.mjs` had just launched; left running on CDP port 9223 afterward (never
stopped, per both scripts' own policy).

### Deviations from the piece as declared

1. **The droppable column-list extra (item 3) was built, then dropped** -- see the narrative above;
   the piece's own text names this extra "droppable", and dropping it in response to a measured E2E
   regression is that explicit escape hatch, not a silent scope cut. Fully disclosed with the
   before/after measurements, not just "removed for space".
2. **P3 and P4 were implemented together in one working session, then split into two independently
   verified commits after the fact** (mirroring `CUT-STATE.md`'s own P1/P2 precedent, "the worker
   report for both hashes" pattern): `App.tsx`/`App.test.ts`/`styles.css`/`FilterPanel.tsx` were reset
   to the pre-P3 baseline (`git checkout HEAD --`), the P3-only edits re-applied by hand (a simplified
   `issueQueryRef`/`handleApplyFilter` with no scan-liveness dispatch, `FilterPanel` without
   `scanState`/`onCancel`, no `.scan-liveness`/`.scan-incomplete` CSS), verified green standalone
   (`npm run verify`, fresh E2E) and committed as P3; the full combined files were then restored from
   a backup taken before the split and verified/committed as P4. `WorkingCanvas.tsx`'s `pushBatch`
   return-type change is entirely P4's (the row count it returns has no P3 consumer), so it was
   reverted to `HEAD` for the P3 commit and restored for P4's.
3. Everything else matches the piece as declared: class names preserved byte-exactly for the refusal
   block; the one admitted empty-input mapping has no trim/validate/ceiling; the panel sits in
   `.app-main`'s flow below the admission panel, keyed on `admitted.dataset`.

### State left after P3's commit, before P4's own edits

```
git status --porcelain (immediately after the P3 commit, before P4's files were restored)
?? CUT-STATE-import-layout.md
?? CUT-STATE.md
?? E2E-STATE.md
?? NEXT-CUT.md
?? NIGHT-STATE.md
```

P3 commit: `d72f330` -- `e2e/filter.mjs`, `src/App.tsx` (the P3-only slice), `src/admission/
AdmissionPanel.tsx`, `src/admission/RefusalBlock.tsx` (new), `src/e2e-test-surface.ts`,
`src/filter/FilterPanel.tsx` (new, P3-only), `src/filter/predicateInput.ts` (new),
`src/filter/predicateInput.test.ts` (new), `src/styles.css`. Nothing else.

---

## Phase P4 -- liveness + cancel: state machine, indicator, Cancel, `.scan-incomplete`, rider-1 clear

Per the brief verbatim (NEXT-CUT.md's own words for this phase).

### 1. `nextScanState` -- pure exported scan-state machine, beside `nextResidencyStatus` (`App.tsx`)

`idle -> issuing -> open-no-rows -> delivering(rows) -> {complete | cancelled(rows) | failed}`. Every
non-`idle` state carries the `streamHandle` it belongs to. Inputs, named verbatim by the piece:
`issued(handle)`, `streamOpened(handle)`, `batch(rows cumulative)`, `completed`, `failed`,
`cancelledByUser` -- plus this file's own `reset` (dataset-change clear, not one of the six named
inputs). A fresh `issued` event ALWAYS supersedes whatever was tracked before (mirrors
`ViewportStreamManager.requestViewport`'s own supersede-on-issue semantics -- exactly one scan
tracked at a time, matching item 6's "EVERY in-flight viewport stream" scope). Every other event is a
no-op against a state it does not apply to (a late `streamOpened` for a stale handle; a `batch` while
nothing is `open-no-rows`/`delivering`; `completed`/`failed`/`cancelledByUser` while `idle` or already
terminal) -- the concrete form of binding note 6: once `cancelledByUser` has moved this machine to
`cancelled`, nothing (a late `streamOpened`, a late `batch`, an eventual suppressed `completed`) can
move it off that state except a fresh `issued`. `isScanInFlight` is a proper TypeScript type
predicate (`state is InFlightScanState`), not a bare `boolean`, so call sites (the Cancel handler,
`FilterPanel`'s own gating) can read `.streamHandle` right after the guard without a second cast.

### 2. Wiring (`App.tsx`, the `[admitted]` effect)

One choke point, `issueViewportQuery(bbox, bboxCrs, filter)`, wraps `manager.requestViewport` and is
the ONLY thing every issue site calls now: the initial unfiltered load, the debounced pan/zoom body,
`handleApplyFilter` (via `issueQueryRef.current`, P3's own ref), and the dev-only `queryWithFilter`
E2E hook (also via `issueQueryRef` equivalents) -- Apply's own refusal-recovery re-issue (`applyFilter`
P2's internal second attempt) goes through the identical path since it also calls `deps.requestViewport`.
On an `"issued"` outcome, `issueViewportQuery` dispatches BOTH `applyScanEvent({kind:"issued",
streamHandle})` (this phase) and `setResidencyStatus(nextResidencyStatus({kind:"query-issued"}))`
(item 5, below) -- one place, not four.

`onStreamOpened` (P1's own manager option, unused until now) wired directly on the
`ViewportStreamManagerOptions` object to `applyScanEvent({kind:"streamOpened", streamHandle})`.
`makeManagerCallbacks` (the rider-3 factory) gained one new optional handler, `onBatchRows?:
(streamHandle, rowsInBatch) => void`, called from its own `onBatch` with `canvas?.pushBatch(...) ?? 0`
-- `WorkingCanvasHandle.pushBatch`'s return type changed from `void` to `number` (the count of rows
this call actually admitted; `0` on a declared-ceiling refusal, since `addBatch` added nothing).
`App.tsx`'s own `onBatchRows` implementation keeps an effect-local `scanRowsAccumulator` (`{
streamHandle, rows }`, reset whenever a batch's `streamHandle` does not match what it is currently
tracking, or whenever `issueViewportQuery` observes a fresh `issued`) and dispatches
`{kind:"batch", rows: cumulative}`. `onFailureTerminal`/`onDeliveryCompleted` (already-existing
handlers) each gained one more line, `applyScanEvent({kind:"failed"})` /
`applyScanEvent({kind:"completed"})`, alongside their pre-existing residency-status logic.

Cancel (the JSX handler bound to `FilterPanel`'s `onCancel` prop): reads `scanState` from render
scope, guards with `isScanInFlight`, then **synchronously**, in the same handler, dispatches
`{kind:"cancelledByUser"}` to `scanState` AND calls `managerRef.current?.cancelStream(handle)` --
binding note 6's "transitions AT THE CANCEL CALL SITE," never awaiting the cancel call or any terminal
first (which, for a self-cancelled stream, `ViewportStreamManager`'s own `selfCancelledHandles` means
will never arrive).

### 3. `FilterPanel.tsx` UI

New `scanState: ScanState` / `onCancel: () => void` props (App-owned, not panel-owned -- item 6).
`button.filter-cancel` renders whenever `isScanInFlight(scanState)`, ZERO delay, no duration word or
figure in its copy ("Cancel" only -- binding note 4; ADR-018 retires "acknowledged" from prose, this
button says neither). `.scan-liveness` (`role="status"`, an indeterminate CSS spinner + one of the two
literal strings NEXT-CUT.md's design section names -- `scanLivenessText`, `App.tsx`) is gated by a
one-shot `setTimeout(SCAN_LIVENESS_DELAY_MS)` reset whenever a NEWLY in-flight `streamHandle` appears
(not merely `isScanInFlight` flipping true/false across `issuing`/`open-no-rows`/`delivering`
sub-transitions for the SAME handle, which must not restart the anti-flicker clock). `
SCAN_LIVENESS_DELAY_MS = 200` (`App.tsx`), documented explicitly as declared, not measured (ADR-010
rule 6 style, same framing `VIEWPORT_QUERY_MIN_INTERVAL_MS` already uses). The pure threshold decision
itself, `scanLivenessTextShouldShow(state, msSinceIssued)`, is exported and unit-tested directly; the
component's own one-shot timer is its direct realization at exactly the threshold instant, disclosed
as such in a code comment rather than claimed as a literal call-through.

### 4. `.scan-incomplete` (canvas status stack, `App.tsx`)

`role="status"`, NOT dismissible (rider-1 pattern, no close control) -- `Filtered view incomplete —
scan cancelled at ${scanState.rows} rows`, derived directly from `scanState.kind === "cancelled"`
(no separate boolean to drift out of sync with the machine that actually governs it). Cleared only by
the next issued query (`issueViewportQuery`'s own unconditional `"issued"` supersede, from ANY issue
site) or a dataset change. `.canvas-status-stack`'s own render gate extended to include
`scanState.kind === "cancelled"` (previously gated on `canvasRefusal || viewportRefusal ||
residencyStatus` alone) so the stack still renders when this is the ONLY thing present.

### 5. Rider-1 `"query-issued"` clear (DECISIONS-PENDING.md entry 1)

`nextResidencyStatus` gains a `{kind:"query-issued"}` event, returning `null` alongside
`"delivery-complete"`/`"dataset-changed"` -- implemented per the architect's recommendation, which
DECISIONS-PENDING.md entry 1 already recorded as "P4 of the filter-panel cut proceeds on the
recommendation unless you say otherwise; flagged in the PR" (that flag is P7's job, not restated as
newly added here). Wired at the single `issueViewportQuery` choke point (item 2 above), so it fires
for every issued query uniformly, not just filter-triggered ones -- matching "as long as it actually
holds" (the human's own rider-1 wording) for the general "a newer query superseded the canvas" case,
not only the filter-specific one the entry's own context sentence used as its motivating example.

### 6. `admitAndResetStaleUiState` extended (+ 1 test updated x3, doc comment)

New required setter `setScanState: (value: ScanState) => void`, called with `{kind: "idle"}`
alongside the five pre-existing resets. `App.tsx`'s own call site passes the raw `setScanState`
`useState` setter. All three pre-existing `admitAndResetStaleUiState` tests in `App.test.ts` extended
with the new setter + its own assertion; no existing assertion changed.

### 7. Tests (`App.test.ts`, 24 pre-existing -> 52, all green)

`nextScanState` (19 tests): every named transition (`issued`, `streamOpened` matching/stale/idle,
`batch` from `open-no-rows`/`delivering`/idle-no-op, `completed`/`failed` from every reachable state
and as a no-op from `idle`, `reset`), **cancel-without-terminal explicitly for all three in-flight
sub-states** (`issuing`/`open-no-rows`/`delivering`, the last carrying its row count forward into
`cancelled`), **the load-bearing "once cancelled, a late completed/failed/batch/streamOpened changes
nothing" property**, and "a fresh issued always supersedes, even from a terminal state."
`isScanInFlight`/`scanLivenessText`/`scanLivenessTextShouldShow` (5 tests): the two literal strings
verbatim; `null` for `idle`/`issuing`/every terminal state; the gating threshold below/at/above
`SCAN_LIVENESS_DELAY_MS`; never-shown when not in flight regardless of elapsed time.
`makeManagerCallbacks`'s new `onBatchRows` (3 tests): called with `pushBatch`'s own return value;
optional (every pre-existing call site still compiles); a `null` canvas reports `0` rather than
throwing. `nextResidencyStatus`'s `"query-issued"` clear (1 test). `admitAndResetStaleUiState`'s three
pre-existing tests, each gaining the `setScanState` setter + assertion (not counted as new tests, same
`it` blocks).

### Verify

```
$ cd frontends/shell && npm run verify
✓ built in 3.62s
 Test Files  22 passed (22)
      Tests  196 passed (196)
```
(168 P3 baseline + 28 new `App.test.ts` tests = 196.)

### Fresh E2E confirmation (after killing remnants, ports down first, on the full P3+P4 slice)

Killed the process tree rooted at the `npx tauri dev --config ... tauri.e2e.conf.json` PID
(`taskkill /T /F`); confirmed 9223/5180 both down before launch.

```
node e2e/regression.mjs   -- 12/12 PASS (A1'..A9', B2'/B3', C2'/C3', OVERCEIL', REOPEN', NET' info-only)
node e2e/filter.mjs       -- 3/3 PASS  (OPEN, FILTER', REFUSED')
```

Ledgers: `frontends/shell/e2e/out/regression-render-trace-1786734987024.json`,
`frontends/shell/e2e/out/filter-render-trace-1786734999883.json`. `filter.mjs` attached to the
already-running app; left running on CDP port 9223 afterward.

### Deviations from the piece as declared

1. **`onBatchRows` and the `pushBatch` return-type change are new surface not literally named by the
   piece's own item list**, but are the mechanical consequence of item 1's own `batch(rows cumulative)`
   input: no existing code anywhere computed a per-batch row count outside `WorkingCanvas.tsx`, and
   duplicating `decodeBatch` a second time in `App.tsx` to get one would have been the actual scope
   violation (a second decode of the same bytes). Disclosed as the minimal mechanical path to the
   input the piece names.
2. **The reconstruction-into-two-commits method** (P3 built and verified standalone, then the full
   P3+P4 combination restored from a pre-split backup and verified again) is the same pattern
   `CUT-STATE.md`'s own P1/P2 record used; noted here for continuity, not as a new deviation.
3. Everything else matches the piece as declared: the state machine's exact shape and named inputs;
   Cancel's zero delay; the liveness text's two literal strings with no percentage/ETA/N-of-M; the
   `.scan-incomplete` copy verbatim; the rider-1 clear implemented per the architect's recommendation
   already on record in DECISIONS-PENDING.md.

### State left for this piece, before P4's commit

```
git status --porcelain (immediately before the P4 commit)
 M frontends/shell/src/App.test.ts
 M frontends/shell/src/App.tsx
 M frontends/shell/src/canvas/WorkingCanvas.tsx
 M frontends/shell/src/filter/FilterPanel.tsx
 M frontends/shell/src/styles.css
?? CUT-STATE-import-layout.md
?? CUT-STATE.md
?? E2E-STATE.md
?? NEXT-CUT.md
?? NIGHT-STATE.md
```

P4 commit: `90dae31` -- exactly the five modified files above (all diffed against the P3 commit
`d72f330`, not against P2). `CUT-STATE-import-layout.md`, `E2E-STATE.md`, `NEXT-CUT.md`,
`NIGHT-STATE.md` predate this piece and stay untracked/untouched. `CUT-STATE.md` (this file) stays
untracked per this repo's established convention.

**Next piece:** `NEXT-CUT.md` phase P5 -- the slow fixture (`generate_the_slow_filter_fixture`,
`kernel/tests/manual_walkthrough_fixtures.rs`, ids ascending physically so a late predicate matches
only the tail) + the new `e2e/filter-panel.mjs` suite driving the PANEL DOM directly (`PANEL'`,
`PANELREFUSE'`, `CLEAR'`, `SLOW'`/`CANCEL'`), one verified-fresh green run. Not addressed by this
piece. Note for P5: this piece's `FilterPanel` has no `.filter-columns*` DOM (dropped, see P3's own
section above) -- any P5 assertion drafted against the piece's original column-list wording should be
skipped or adjusted, not silently assumed present.

---

## Phase P5 -- the slow fixture + the panel E2E suite + one verified-fresh green run

Only `kernel/tests/manual_walkthrough_fixtures.rs` touched outside `frontends/shell` (the piece's own
literal constraint); a throwaway probe, `engine/examples/pilot_p5_slow_scan_timing.rs`, was created,
timed, and deleted before this piece's commit -- the same disposal convention P0's
`pilot_json_serialize_sql.rs`/P3's `pilot_p3_*.rs` already established (see `git status --porcelain`
below: nothing under `engine/` survives).

### 1. `generate_the_slow_filter_fixture` -- sizing, measured, not guessed

`FEATURES = 4_000_000`, `avg_vertices: 12`, `hole_every: 0`, **`row_group_rows: FEATURES`** (one
single Parquet row group spanning every id). The `row_group_rows` choice is the load-bearing one,
disclosed in the generator's own doc comment in full: this fixture's `id` column is ascending with
physical row order (the writer's own default, confirmed against `skp_filter_cancellation.rs`'s own
`cancel_reaches_the_producer_during_a_late_matching_filtered_scan`, which relies on the identical
property) -- at the writer's *default* ~1,048,576-row grouping, DuckDB's own row-group statistics
pruning would collapse a late-matching `id > <threshold>` scan to opening just the ONE row group
whose `[min, max]` straddles the threshold, **regardless of the file's total feature count** --
measured directly (below) rather than assumed. Forcing a single row group removes that escape: the
file's one row group has `min_id = 0, max_id = FEATURES - 1`, so the threshold cannot prune it, and
DuckDB must genuinely scan through it.

**Empirical basis** (`engine/examples/pilot_p5_slow_scan_timing.rs`, deleted before commit; log kept
at `target/slice-evidence/filter-panel/logs/p5-probe-scan-timing.log`): timed `Dataset::stream(&query)`
to first batch, bare-engine (no SKP ticket, no WebSocket, no JS decode -- a conservative LOWER bound
on what the running shell adds on top, never a reduction). At 1,500,000 features (single row group):
**345.6 ms** -- too tight a margin over the shell's `SCAN_LIVENESS_DELAY_MS = 200` anti-flicker gate
to commit to, disclosed rather than risked. At `FEATURES = 4,000,000` (this fixture): **962.5 ms** --
chosen for the comfortable margin this leaves. Write time for `4,000,000` features measured **65.84 s**
(`target/slice-evidence/filter-panel/logs/p5-generate-slow-fixture.log`, the real generator run, not
the probe) -- a one-time, explicit `--ignored` generation, in the same "minutes for the big ones"
tolerance `fixture.rs`'s own module doc already states for the docs/07 5 GB fixture. This is a
disclosed step beyond `NEXT-CUT.md`'s own "something like 1-2M rows" sizing guidance (see Deviations)
-- the row-group-forcing construction is what actually defeats DuckDB's pruning; a plain 1-2M-row file
at the writer's default row-group size would let pruning collapse the scan to a near-instant
tail-only read regardless of total size, the exact failure mode this fixture exists to avoid.

Hard-asserted (mirroring `generate_the_over_ceiling_refusing_fixture`'s own style): `facts.vertices >
2_000_000` -- the fixture's declared precondition, that its unfiltered first look overflows the
shell's `MAX_RESIDENT_VERTICES` ceiling. Measured at generation time: **4,000,000 features,
47,997,784 vertices, 766,186,557 bytes** (log above) -- ~24x the ceiling, comfortable headroom.

### 2. `e2e/filter-panel.mjs` (new)

Sibling to `regression.mjs`/`filter.mjs`, same `lib.mjs` helpers, same watchdog/deadline discipline
(`SPATIAL_E2E_DEADLINE_MS`, default 600s here -- wider than `filter.mjs`'s 300s for the larger
fixture's own admission/settle time), same **E2E-verified** evidence class in its header. Verified the
actual DOM hooks against `FilterPanel.tsx`/`App.tsx` directly before writing assertions (per the
piece's own instruction) -- confirmed `.filter-panel`, `input.filter-predicate`, `button.filter-apply`,
`button.filter-clear`, `button.filter-cancel`, `.filter-refusal`, `.scan-liveness`, `.scan-incomplete`
all exist exactly as named, plus `.filter-active` (used by `PANEL'`/`CLEAR'` to assert the applied
predicate is shown/cleared) which the piece's brief did not name but is real DOM `FilterPanel.tsx`
renders.

- **`PANEL'`**: `page.fill("input.filter-predicate", ...)` + `page.click("button.filter-apply")`,
  reusing `filter.mjs`'s own 60%-of-unfiltered pixel-fraction margin against `filter-zoned.parquet`.
- **`PANELREFUSE'`**: types `bogus_column_xyz = 1`, asserts `.filter-refusal`'s nested
  `.admission-refusal-code`/`.admission-refusal-message` (the shared `RefusalBlock`, P3's class names)
  show `skp.filter_unknown_column` and the verbatim message; asserts the canvas fraction after the
  refusal is within 2 percentage points of `PANEL'`'s own filtered fraction (the typo-blanks-canvas
  recovery re-issue), not exact equality (WebGL readback is not guaranteed bit-identical run to run).
- **`CLEAR'`**: `button.filter-clear`, asserts the fraction recovers to >= 90% of the original
  unfiltered fraction and that `.filter-refusal`/`.filter-active` are both gone.
- **`SLOW'`/`CANCEL'`** (the acceptance condition, asserted literally -- full detail in item 3 below).

**One disclosed deviation from driving the DOM throughout:** `SLOW'`/`CANCEL'` applies its predicate
via `window.__SPATIAL_E2E__.queryWithFilter` rather than `page.fill`/`page.click`, because obtaining
the issued stream handle (needed to assert "zero batch lines for THAT handle") has no DOM surface --
a button click returns nothing to the harness, and there is no `[render-trace]` line anywhere that
carries a stream handle before its first batch/residency event (`diagnostics/renderTrace.ts`'s only
handle-carrying calls, `traceStreamBatch`/`traceResidency`, both fire from inside
`WorkingCanvas.pushBatch` -- i.e. only once output already exists, which is exactly the state this
step must prove has NOT happened yet). `NEXT-CUT.md`'s own evidence plan names the hook as a sanctioned
handle source ("the handle comes from the applied outcome via the queryWithFilter hook OR parse the
trace") -- disclosed in the script's own top comment and in `e2e/README.md`, not silently varied.
`queryWithFilter` reaches the identical `applyFilter` seam the real Apply button calls (P3's own
deviation-3 retrofit), so the resulting `scanState`/DOM is exactly what a real Apply click would
produce; every assertion in the step is still against the real rendered DOM (`button.filter-cancel`,
`.scan-liveness`, `.scan-incomplete`), only the mechanism that fired the query differs.

`npm run e2e:filter-panel` added to `frontends/shell/package.json`.

### 3. `SLOW'`/`CANCEL'` in detail

Opens the slow fixture; asserts the OVERCEIL' pattern openly FIRST (`.canvas-refusal` +
`.residency-status` matching `/^(\d+) of 4000000 features rendered — declared ceiling reached
\(MAX_RESIDENT_VERTICES\)$/`, the fixture's own declared precondition) before ever touching the
filter. Then calls `queryWithFilter("id > 3999900")` (`FEATURES - 100`, the P4 cancellation-test
trick), captures the returned `streamHandle`, and polls (bounded, not timed) until BOTH
`button.filter-cancel` is present+enabled AND `.scan-liveness` shows the literal
`"Filtering — scanning, no matching rows yet"` text. **Then, over that exact same window**, asserts
ZERO `[render-trace] batch` lines exist for that handle in the console capture -- the acceptance
condition, asserted literally, not inferred. Clicks Cancel; asserts `.scan-incomplete` shows
`"Filtered view incomplete — scan cancelled at 0 rows"` (0, not just "some" -- consistent with the
zero-batch-lines finding); waits a bounded 3s settle window and re-asserts zero batch lines for that
handle across the ENTIRE session, not just the pre-cancel window. No timing assertion anywhere in the
step (ADR-018) -- every wait is a bounded robustness poll (`waitForCondition`, timeout-bounded,
duplicated from `regression.mjs`), never a claim about how fast anything happened; the one 3-second
`sleep` is disclosed in a comment as a settle window, not a performance measurement.

**Result on the one run performed (below): PASS on the first attempt, no raciness observed** -- the
piece's own item 3 "two failed attempts = stop and report" clause was never reached.

### 4. `e2e/README.md`

New "Filter panel spec (filter-panel cut, P5)" section: `npm run e2e:filter-panel`, what each step
asserts, the `queryWithFilter`-for-`SLOW'`/`CANCEL'` disclosure, regeneration command for the new
fixture, same evidence-class/watchdog language as the other two sections.

### Verify -- one fresh run of all three suites in sequence, remnants killed first

Killed the full process tree left running by the prior operator/piece session (`taskkill //T //F`,
Git Bash slash-escaping required -- plain `/T /F` is mis-parsed as a path by MSYS): cascaded through
`node.exe` (`tauri.js dev`), `cargo.exe` (both the outer and the `--config`-invoked inner process),
and `spatial-ide-shell.exe`. Confirmed via `Test-NetConnection`: `9223` and `5180` both
`TcpTestSucceeded: False` before launching. `cargo check`/`npm run verify` both green before the E2E
run (196 shell tests, unchanged from P4 -- this piece touches no shell source, only the E2E suite,
README, and `package.json`).

```
node e2e/regression.mjs      -- 12/12 PASS (A1'..A9', B2'/B3', C2'/C3', OVERCEIL', REOPEN', NET' info-only)
node e2e/filter.mjs          -- 3/3 PASS  (OPEN, FILTER', REFUSED')
node e2e/filter-panel.mjs    -- 5/5 PASS  (OPEN, PANEL', PANELREFUSE', CLEAR', SLOW'/CANCEL')
```

`filter-panel.mjs`'s own summary table:

```
Step           Status  Note
-------------  ------  ----------------------------------------
OPEN           PASS    admitted; .filter-panel now mounted (keyed on the dataset handle)
PANEL'         PASS    typed + Apply via the real DOM; unfiltered 21.1% non-bg, filtered 4.6% non-bg (< 60% of unfiltered)
PANELREFUSE'   PASS    refused skp.filter_unknown_column; message verbatim; previous filtered view still rendered (4.51% non-bg, within 2 pts of PANEL''s own fraction)
CLEAR'         PASS    unfiltered fraction restored (21.1% non-bg, >= 90% of original); .filter-refusal and .filter-active both cleared
SLOW'/CANCEL'  PASS    OVERCEIL' pattern observed openly (163440 of 4000000); applied "id > 3999900" (handle sh_09b936e48236fbf11f88c793772ed326); Cancel enabled + liveness "Filtering — scanning, no matching rows yet" shown WHILE zero batch lines existed for that handle; Cancel clicked; .scan-incomplete "Filtered view incomplete — scan cancelled at 0 rows"; zero batch lines for that handle ever, including a 3s settle window after Cancel
```

**Independent zero-batch confirmation** (not just the script's own pass/fail, a second pass over the
written ledger): `node -e` over
`frontends/shell/e2e/out/filter-panel-render-trace-1786736861363.json`, filtering
`allConsoleEntries` (the WHOLE session, not just the pre-cancel window) for
`"[render-trace] batch"` lines containing `sh_09b936e48236fbf11f88c793772ed326` -- **0 matches**.

Ledgers: `frontends/shell/e2e/out/regression-render-trace-1786736802169.json`,
`frontends/shell/e2e/out/filter-render-trace-1786736816244.json`,
`frontends/shell/e2e/out/filter-panel-render-trace-1786736861363.json`. Full stdout logs (all three
runs plus the fixture-generation and probe logs) at `target/slice-evidence/filter-panel/logs/`. Every
run attached to the same already-running app (launched fresh by `regression.mjs`, per its own "never
stop the app" policy) -- left running on CDP port 9223 afterward.

`npm run verify` re-confirmed green after the E2E run (same 196/196; the E2E run touches no shell
source, so this is a sanity re-check, not expected to differ).

### Deviations from the piece as declared

1. **Fixture size (`4,000,000` features) is beyond `NEXT-CUT.md`'s own "something like 1-2M rows"
   sizing guidance** -- fully disclosed and reasoned in item 1 above and in the generator's own doc
   comment: a measured 1,500,000-feature/single-row-group construction left only a 345.6 ms margin
   over the 200 ms liveness gate, judged too tight to commit to; `4,000,000` measured 962.5 ms, a
   comfortable margin, at a still-bounded 65.84 s one-time write cost.
2. **`SLOW'`/`CANCEL'` applies its predicate via `queryWithFilter`, not `page.fill`/`page.click`** --
   disclosed in full in item 2 above, in the script's own top comment, and in `e2e/README.md`; the
   piece's own text explicitly sanctions this handle source, and no `[render-trace]` line exists to
   "parse" for a handle before this step needs it (checked, not assumed).
3. **`.filter-active` is asserted by `PANEL'`/`CLEAR'`** even though the piece's literal DOM-hooks list
   (`NEXT-CUT.md`'s evidence plan) does not name it -- real DOM `FilterPanel.tsx` renders unconditionally
   when a filter is applied, and asserting it is a stronger, free check that the applied predicate is
   shown/cleared correctly, not a scope expansion of what is being tested.
4. **No raciness encountered** -- item 3's "two failed attempts at stabilizing = stop and report"
   clause was not reached; the chosen fixture size worked on the first live run.
5. Everything else matches the piece as declared: the fixture generator lives ONLY in
   `kernel/tests/manual_walkthrough_fixtures.rs` (the piece's one permitted non-shell file); the probe
   was created and deleted per the disposal convention; all three suites ran in sequence after a
   confirmed-clean process/port state; `PANEL'`/`PANELREFUSE'`/`CLEAR'` drive the real panel DOM
   exactly as specified; the OVERCEIL' pattern is asserted openly, first, before the filter; no timing
   assertion appears anywhere.

### State left for this piece, before commit

```
git status --porcelain (before this piece's commit)
 M frontends/shell/e2e/README.md
 M frontends/shell/package.json
 M kernel/tests/manual_walkthrough_fixtures.rs
?? CUT-STATE-import-layout.md
?? CUT-STATE.md
?? E2E-STATE.md
?? NEXT-CUT.md
?? NIGHT-STATE.md
?? frontends/shell/e2e/filter-panel.mjs
```

`CUT-STATE-import-layout.md`, `E2E-STATE.md`, `NEXT-CUT.md`, `NIGHT-STATE.md` predate this piece and
stay untracked/untouched. `CUT-STATE.md` (this file) stays untracked per this repo's established
convention. `engine/examples/pilot_p5_slow_scan_timing.rs` was created and deleted within this piece
-- confirmed absent from the status above. The four files listed are staged and committed by this
piece; nothing else.

**Next piece (superseded by the record below):** `NEXT-CUT.md` phase P6 -- reviewer over the cut's
code, since carried out; see the P6 section immediately following.

---

## Phase P6 -- reviewer gate: two BLOCKING + a fix list

Reviewer ran over the cut at HEAD `a4e78d9` (end of P5). Two mandatory (B1, B2), four should-fix, two
nits, one named-debt item to record (not fix). All addressed in this piece except the named debt,
which is recorded below per the reviewer's own instruction not to build a DOM-component test harness
for it.

### B1 (blocking) -- a declared-ceiling refusal never dispatched a scan event

`WorkingCanvas`'s `onCanvasRefusal` (fired for BOTH `ResidentVertexCeilingExceeded` and
`PickCeilingExceeded`, `WorkingCanvas.tsx`'s own `pushBatch`) called `setCanvasRefusal` +
`cancelStream` but never touched `scanState`. `cancelStream`'s own terminal is suppressed
(`ViewportStreamManager`'s `selfCancelledHandles`) -- binding note 6's "a cancelled stream's terminal
never reaches App" -- so the scan machine stayed wherever it was (`issuing`/`open-no-rows`/
`delivering`) FOREVER after every over-ceiling stream: a live "still scanning" indicator + an enabled
Cancel for a scan the app itself had already killed. The slow fixture's own unfiltered first look
(`generate_the_slow_filter_fixture`, `kernel/tests/manual_walkthrough_fixtures.rs`) IS exactly such a
stream (confirmed live below: `163440 of 4000000` features admitted before the ceiling refusal fired),
so Part E's operator would have been judging a lying indicator.

**Event shape chosen: `{kind:"failed"}`, no new dedicated input.** The reviewer's own note allowed
either; `{kind:"failed"}` was chosen because `.residency-status` (rider 1) already names the ceiling
by count right next to this exact moment, so the scan-liveness indicator needs no extra copy of its
own -- simply leaving the in-flight family (`isScanInFlight`/`scanLivenessText` both already return
accordingly for `"failed"`, so Cancel and the liveness text both disappear with zero new UI logic) is
the whole fix `nextScanState`'s existing `"failed"` transition already provides. Documented in the new
function's own doc comment, not just here, per the reviewer's "choose and document."

Extracted as a new exported pure function, `handleCanvasCeilingRefusal(streamHandle, message, {
setCanvasRefusal, applyScanEvent, cancelStream })` (`App.tsx`, beside `makeManagerCallbacks`) -- the
same "extract the handler for DOM-free testability" seam this file already establishes -- called from
the `onCanvasRefusal` JSX prop instead of the three-line inline body it replaces.

**Unit tests** (`App.test.ts`, new `describe("handleCanvasCeilingRefusal ...")`): (1) dispatches
`{kind:"failed"}` alongside `setCanvasRefusal`/`cancelStream`, each called with the right arguments;
(2) end-to-end through the REAL `nextScanState` (not a mock), starting from `delivering` -- asserts
`isScanInFlight(finalState) === false` (the indicator and Cancel disappear) and the exact resulting
`{kind:"failed", streamHandle}`.

### B2 (blocking) -- the refusal-recovery await was unguarded

`applyFilter`'s catch block formatted the refusal AFTER awaiting the recovery re-issue; if the
recovery itself threw (not necessarily another filter refusal -- `too_many_pending_streams`, a
transport failure, the dataset having since closed), that exception propagated BEFORE `formatRefusal`
ever ran. The panel would show NO refusal for the predicate the user actually typed, and the failure
would surface only as an unrelated global banner (ADR-010 rule 7's handlers) for a query the user
never made.

**Fix:** `formatRefusal(e.skpError)` now runs FIRST, before the recovery attempt. The recovery is
wrapped in its own `try`/`catch`; a recovery failure is `logSessionEvent("filter-recovery-failed",
...)` and NOT re-thrown -- the function still returns `{kind:"refused", refusal}` with the user's own,
original refusal regardless of whether the recovery succeeded. Documented in `applyFilter`'s own
inline comment: the recovery is a best-effort canvas restore, never part of this function's contract
with its caller.

**Unit test** (`App.test.ts`, `describe("applyFilter ...")`, new `it`): the Apply attempt is refused,
AND the recovery re-issue itself rejects (a plain `Error`, not necessarily `SkpCallError` -- the
general case B2 covers) -- asserts the outcome is still `{kind:"refused", refusal}` with the exact
original refusal, un-swallowed and un-blanked, and that both `requestViewport` calls actually
happened (the recovery was attempted, just failed).

### Should-fix 1 -- `cancelledByUser` render-scope staleness

`onCancel`'s JSX handler read `scanState` from render scope (a snapshot from the closure's own
render) for BOTH the dispatch and the handle handed to `cancelStream` -- a freshly-issued stream
could, in principle, be marked cancelled while the wrong (old) handle was what actually got cancelled.
Fixed two ways, both applied: (a) `ScanEvent`'s `cancelledByUser` now carries a `streamHandle` and
`nextScanState` no-ops on a mismatch, mirroring `streamOpened`'s own existing guard exactly; (b) a new
`scanStateRef` (mirrors the file's own `activeFilter`/`activeFilterRef` split) is written
SYNCHRONOUSLY by a new `commitScanState` helper every time `scanState` changes -- `applyScanEvent` now
computes `nextScanState(scanStateRef.current, event)` (the ref, always fresh) rather than relying on
React's `setScanState(prev => ...)` updater form; the `onCancel` handler reads `scanStateRef.current`
for both the dispatch and the `cancelStream` call, never the render-scope `scanState` closure.
`handleAdmitted`'s dataset-change reset now passes `commitScanState` (not the raw `setScanState`
setter) to `admitAndResetStaleUiState`, so the ref and the render state can never drift apart.

**Tests:** existing `cancelledByUser` transition tests updated to carry a matching `streamHandle`; new
test for the mismatch no-op (`cancelledByUser` for a stale handle while a DIFFERENT handle is
currently tracked leaves the state unchanged).

### Should-fix 2 -- fixture doc figures reconciled to the logs

`kernel/tests/manual_walkthrough_fixtures.rs`'s own doc comment on `generate_the_slow_filter_fixture`
cited two figures that had drifted from the logs that actually measured them: "67.0 s" (write time) ->
corrected to **65.84 s**, matching `target/slice-evidence/filter-panel/logs/p5-generate-slow-fixture.log`'s
own `finished in 65.84s`; "937.7 ms" (scan-timing margin) -> corrected to **962.5 ms**, matching
`target/slice-evidence/filter-panel/logs/p5-probe-scan-timing.log`'s own `first batch arrived: 962.5
ms after ds.stream() call` for the `id > 3999900` / 4,000,000-feature probe (a figure the SAME doc
comment already cited correctly two sentences earlier -- only the later, restated mention had drifted).
Comments only, no code/behavior change; `cargo check -p spatial-kernel --tests` stayed clean.

### Should-fix 3 -- log the minted handle at issue time

New `traceStreamIssued(dataset, streamHandle)` (`diagnostics/renderTrace.ts`, a sibling to
`traceViewportQuery`), logging `[render-trace] stream-issued { dataset, streamHandle }`. Called from
`ViewportStreamManager.requestViewport` (`streaming/viewportStreamManager.ts`) at the actual moment of
mint -- right before it returns `{kind:"issued", streamHandle}` -- since `traceViewportQuery` itself
fires before the mint and never carries a handle. `e2e/filter-panel.mjs`'s `SLOW'/CANCEL'` step now
polls (bounded, not timed) for this line to exist, carrying the issued handle, BEFORE asserting zero
`[render-trace] batch` lines for it -- retiring that check's prior "true by construction" weakness
(trusting only the handle `queryWithFilter`'s own return value carried, with nothing in the trace
itself confirming a stream was ever actually issued). Confirmed live in the fresh run below: `(handle
sh_e0a59a39af4c15d55666cc3dffde3c1c, [render-trace] stream-issued line confirmed)`.

### Should-fix 4 -- panel-growth layout risk

The same regression class P3's own dropped column-list responded to (`.canvas-container` squeezed
toward its `min-height` floor by growth above it) is runtime-reachable at `.filter-refusal` (a fields
`dl` can carry several rows) rendering in a short window. `styles.css`: `.filter-refusal` gains
`max-height: 12rem; overflow-y: auto` -- capped, not left to grow unbounded, with every field still
reachable via scroll rather than silently clipped. Noted in the same CSS comment: Part E's own E3
(refusal readability) must check this in a short/cramped window; editing `MANUAL-WALKTHROUGH.md`
itself is P7's job, not this piece's -- not done here.

### Nits

1. `e2e/regression.mjs`'s `.admission-refusal` assertions (A3', `stepRefusal`) scoped to
   `.admission-panel .admission-refusal` -- `FilterPanel`'s own `.filter-refusal` now wraps the SAME
   shared `RefusalBlock` component (`.admission-refusal` class names preserved byte-exactly, P3), so a
   bare `.admission-refusal` selector could match either render site depending on DOM order. Both call
   sites fixed (the A3' negative-presence check and `stepRefusal`'s own panel-content read).
2. `App.tsx`'s dev-only `queryWithFilter` E2E hook now routes its predicate through
   `predicateTextToFilter` (the same pure mapping `FilterPanel`'s own input uses) instead of building a
   `Filter` object by hand -- an empty string now maps to `filter: null` exactly like a real Clear/empty
   Apply would, closing the one remaining place this hook diverged from the real panel's own behavior.
   `FILTER_DIALECT_DUCKDB_EXPR_0`'s own import in `App.tsx` became unused as a result and was removed
   (the constant is still used, inside `predicateTextToFilter` itself).

### Named debt (recorded, not fixed -- reviewer's own instruction: no new dependencies)

**`FilterPanel` has no DOM-component test harness.** This package carries no
`@testing-library/react`-equivalent (confirmed by inspection before this cut started, and reconfirmed
here); every `.test.ts` file in this package tests non-React logic at extracted pure seams
(`nextScanState`, `applyFilter`, `handleCanvasCeilingRefusal`, `predicateTextToFilter`, etc.), never a
rendered component tree. Coverage for `FilterPanel`'s own component-level behavior -- the `busy`
disable-gating on Apply, the one-shot `SCAN_LIVENESS_DELAY_MS` timer's actual wiring (as opposed to
the pure `scanLivenessTextShouldShow` threshold function it realizes, which IS unit-tested), and
Clear-while-a-previous-submit-is-still-busy -- is **E2E-only** (`e2e/filter-panel.mjs`'s
`PANEL'`/`PANELREFUSE'`/`CLEAR'`/`SLOW'`/`CANCEL'` steps), not covered by any fast, DOM-free unit test.
Adding a real component-test harness (e.g. `@testing-library/react` + `jsdom`'s existing presence in
this package's `devDependencies` for `WorkingCanvas.test.ts`'s non-rendering uses) is a real, bounded
piece of future work -- flagged here for the PR body, not built in this pass, per the reviewer's own
"do NOT fix -- no new dependencies" instruction.

### Verify

```
$ cd frontends/shell && npm run verify
✓ built in 3.52s
 Test Files  22 passed (22)
      Tests  200 passed (200)
```
(196 P3+P4 baseline + 4 new P6 tests: B1's 2, B2's 1, the `cancelledByUser` mismatch no-op's 1.)

`cargo check -p spatial-kernel --tests` also run (sanity check on the comment-only Rust edit): clean.

### Fresh E2E confirmation, all three suites (after killing remnants, ports down first)

Killed the full process tree rooted at the `npx tauri dev --config ... tauri.e2e.conf.json` PID
(`taskkill /T /F`); confirmed 9223/5180 both down (`Test-NetConnection` `TcpTestSucceeded: False`,
both) before launch. All three suites run in sequence against the same launched instance, per each
script's own attach-or-launch/never-stop convention.

```
node e2e/regression.mjs    -- 12/12 PASS (A1'..A9', B2'/B3', C2'/C3', OVERCEIL', REOPEN', NET' info-only)
node e2e/filter.mjs        -- 3/3  PASS (OPEN, FILTER', REFUSED')
node e2e/filter-panel.mjs  -- 5/5  PASS (OPEN, PANEL', PANELREFUSE', CLEAR', SLOW'/CANCEL')
```

`SLOW'/CANCEL'` (the step B1 directly protects and should-fix 3 directly strengthens) in full:
`OVERCEIL' pattern observed openly (163440 of 4000000); applied "id > 3999900" (handle
sh_e0a59a39af4c15d55666cc3dffde3c1c, [render-trace] stream-issued line confirmed); Cancel enabled +
liveness "Filtering — scanning, no matching rows yet" shown WHILE zero batch lines existed for that
handle; Cancel clicked; .scan-incomplete "Filtered view incomplete — scan cancelled at 0 rows"; zero
batch lines for that handle ever, including a 3s settle window after Cancel`.

Ledgers: `frontends/shell/e2e/out/regression-render-trace-1786738440645.json`,
`frontends/shell/e2e/out/filter-render-trace-1786738454065.json`,
`frontends/shell/e2e/out/filter-panel-render-trace-1786738495024.json`. Each script attached to the
already-running instance the previous one launched/left running; final instance left running on CDP
port 9223 afterward (never stopped, per every script's own policy).

### Deviations from the piece as declared

None in scope. The B1 fix's event-shape choice (`{kind:"failed"}` over a new dedicated input) was an
explicitly offered choice ("choose and document"), documented in `handleCanvasCeilingRefusal`'s own
doc comment and here. Everything else matches the reviewer's fix list item for item: B1/B2 both
mandatory-fixed with the exact unit tests requested; all four should-fix items addressed; both nits
addressed; the named-debt item recorded, not built (per the reviewer's own "do NOT fix").

### State left for this piece, before commit

```
git status --porcelain (before this piece's commit)
 M frontends/shell/e2e/filter-panel.mjs
 M frontends/shell/e2e/regression.mjs
 M frontends/shell/src/App.test.ts
 M frontends/shell/src/App.tsx
 M frontends/shell/src/diagnostics/renderTrace.ts
 M frontends/shell/src/streaming/viewportStreamManager.ts
 M frontends/shell/src/styles.css
 M kernel/tests/manual_walkthrough_fixtures.rs
?? CUT-STATE-import-layout.md
?? CUT-STATE.md
?? E2E-STATE.md
?? NEXT-CUT.md
?? NIGHT-STATE.md
```

`CUT-STATE-import-layout.md`, `E2E-STATE.md`, `NEXT-CUT.md`, `NIGHT-STATE.md` predate this piece and
stay untracked/untouched. `CUT-STATE.md` (this file) stays untracked per this repo's established
convention. The eight modified files above are staged and committed by this piece in ONE commit
(the coordinator's own instruction), citing B1/B2 in the message; nothing else.

**Next piece:** `NEXT-CUT.md` phase P7 -- walkthrough Part E + operator run + result log + PR.
Operator-required. Not addressed by this piece. Note for P7: Part E's E3 (refusal readability) should
exercise a short/cramped window given should-fix 4's `.filter-refusal` height cap; the named debt (no
`FilterPanel` DOM-component test harness) belongs in the PR body per the reviewer's own instruction.

---

## Phase P7a -- the walkthrough Part E document ONLY (operator run + PR are the custodian's)

`frontends/shell/MANUAL-WALKTHROUGH.md` edited, doc-only, per HEAD `d64fd3a`. Every copy string
verified verbatim against source immediately before writing (`FilterPanel.tsx`'s
`scanLivenessText`/`.scan-incomplete` template/`.filter-active` line in `App.tsx`,
`predicate.rs`'s `Display` for `FilterError::UnknownColumn`, `e2e/filter-panel.mjs`'s own
`SLOW_FIXTURE_PREDICATE`/regex/`UNKNOWN_COLUMN_MESSAGE` constants) -- not copied from `NEXT-CUT.md`'s
prose or CUT-STATE's own restatements without a source check.

**Fixture filename correction (per the piece's own "CHECK the actual fixture filename" instruction):**
the slow fixture's real file is `slow-filter-scan.parquet` (`generate_the_slow_filter_fixture`,
`kernel/tests/manual_walkthrough_fixtures.rs:278`), not `slow-filter.parquet` as the piece's own
illustrative text guessed. Used the correct name throughout; flagged here rather than silently
"fixed" without a trace, since a future reader diffing against the piece's own brief text would
otherwise wonder why the names don't match.

**Sections added:**
1. `## Part E -- the filter panel (filter-panel cut)`, inserted between Part D and `## Result log`,
   untouched. Two-row fixtures table (`filter-zoned.parquet` E1-E4/E8; `slow-filter-scan.parquet`
   E5-E7, both with their real regeneration commands from `e2e/README.md`) + the E1-E8 step table in
   Parts A-D's exact `| # | Step | Expected outcome |` format. E5's expected-outcome cell states the
   OVERCEIL' pattern openly, first (the fixture's declared precondition, not a defect), citing the
   automated suite's own repeated observed figure `163440 of 4000000 features rendered -- declared
   ceiling reached (MAX_RESIDENT_VERTICES)` while making clear the operator's own `<N>` may differ.
   E6 (Cancel) carries no duration/figure language (ADR-018) and the same degraded-channel caveat
   style the 2026-08-14 Part A entry used. E3 explicitly calls out the `.filter-refusal` height cap
   (should-fix 4, P6) and asks the operator to judge readability in that capped window specifically.
2. `## What e2e/filter-panel.mjs covers`, inserted before `## Prerequisites` (a new section, not a
   row silently added to the existing `regression.mjs`-titled coverage table, since that table's own
   header names a different script -- adding filter-panel.mjs rows there would have been a
   misattribution). Table maps `PANEL'`->E2, `PANELREFUSE'`->E3, `CLEAR'`->E4, and one combined
   `SLOW'`/`CANCEL'`->E5,E6,E7 row -- **deviation from the piece's literal "five automated step IDs
   (PANEL', PANELREFUSE', CLEAR', SLOW', CANCEL')" wording, disclosed:** `e2e/filter-panel.mjs`'s own
   source (`runStep("SLOW'/CANCEL'", ...)`, confirmed by reading the script directly) runs SLOW' and
   CANCEL' as one combined step over one issued handle, not two independent steps; inventing two
   separate non-existent step IDs to match the brief's literal count would have been the actual
   inaccuracy, given the piece's own instruction that a paraphrase (here, a fabricated split) is a
   defect. The three requested does-not-cover look-and-feel gaps (liveness reads-as-working, Cancel
   feels responsive, refusal readability in the capped window) are all present, honestly split across
   the `PANELREFUSE'` and `SLOW'`/`CANCEL'` rows.
3. `### Part E run (separate pass -- filter panel)` appended after the existing 2026-08-14 result-log
   entries (Parts A-D untouched, byte-for-byte) -- Date run/Run by/Build/commit fields plus a
   `Part E (E1-E8):` line, all left blank for the operator, with a one-line note that Part E did not
   exist during the 2026-08-14 A-D run.

**Not done (out of this piece's scope, named so the next piece does not assume otherwise):** the
operator's actual Part E run, the result-log fill-in, and the PR are P7's remaining, custodian-owned
work -- not attempted here.

### Verify

Doc-only piece; nothing to build. Re-read this piece's own Part E table one final time against
`FilterPanel.tsx`/`App.tsx`/`predicate.rs`/`e2e/filter-panel.mjs` immediately before commit --
confirmed every quoted string verbatim (see the source citations above); no drift found.

### State left for this piece, before commit

```
git status --porcelain (before this piece's commit)
 M frontends/shell/MANUAL-WALKTHROUGH.md
?? CUT-STATE-import-layout.md
?? CUT-STATE.md
?? E2E-STATE.md
?? NEXT-CUT.md
?? NIGHT-STATE.md
```

Only `frontends/shell/MANUAL-WALKTHROUGH.md` is staged and committed by this piece.
`CUT-STATE-import-layout.md`, `E2E-STATE.md`, `NEXT-CUT.md`, `NIGHT-STATE.md` predate this piece and
stay untracked/untouched. `CUT-STATE.md` (this file) stays untracked, edited in place, per this
repo's established convention.

**Next piece (superseded by the record below):** the operator's actual Part E run + result-log
fill-in + the PR -- since carried out partially (the E5 finding, below); see the P7b section
immediately following for what changed and what's still the custodian's.

---

## Phase P7b -- operator Part E E5 finding: "Apply behaves exactly like opening a dataset"

The human ran Part E over RustDesk. E1-E4 and E6-E8 were perfect. **E5's own liveness/cancel
affordance was ALSO perfect** (working, not hung; a real, effective Cancel) -- but a genuine product
defect surfaced once the operator let a filtered scan actually run: on the slow fixture, the matching
features live at the grid's far top, and the filtered query had been carrying the CURRENT viewport
bbox forward (unchanged since the unfiltered first look), so the matches either never arrived or
arrived far off-screen -- unfindable. **Zoom to layer was also inert**: it fits the dataset-lifetime
anchor, which by then already equalled the just-fitted (matchless) view -- reproducing exactly what
was already on screen, not a rescue. The human approved a design revision on the spot: **"Apply
behaves exactly like opening a dataset."**

### 1. Apply/Clear issue an unrestricted first look (`App.tsx`)

`applyFilter`'s PRIMARY attempt now issues `bbox: null`, never `deps.getLastViewportBbox()` -- "a
filter asks WHERE the matches are," not "within whatever the camera already happened to be pointed
at." Clear needed no separate code path: it is `applyFilter(null, deps)`, the identical function, so
this one change covers both by construction. Pan/zoom-driven queries are UNCHANGED --
`makeDebouncedViewportQuery`'s own body still carries the current viewport bbox + whatever filter is
active, untouched by this revision. **The refusal-recovery re-issue keeps its EXISTING semantics,
deliberately unchanged**: it still reads `deps.getLastViewportBbox()`, restoring the last real view
(what was actually showing before the refused Apply), not a fresh unrestricted look -- recovery's job
is "put back what was there," not "look for new matches."

### 2. The fit anchor + auto-fit reset per filter generation (`WorkingCanvas.tsx`, `App.tsx`)

New `WorkingCanvasHandle.resetFitForNewGeneration()`: clears BOTH `fitAnchorRef` and `hasAutoFitRef`.
Called from a new `ApplyFilterDeps.resetFitForNewGeneration` dependency, invoked by `applyFilter`
itself alongside `commitActiveFilter` -- i.e. ONLY on a real issued/applied outcome, never a refusal
or throttled-away attempt. Wired identically at both real call sites (`handleApplyFilter` for the
panel's own Apply/Clear, and the dev-only `queryWithFilter` E2E hook, same-seam doctrine) via
`canvasRef.current?.resetFitForNewGeneration()`.

**Consequence, for free, exactly as designed:** resetting `hasAutoFitRef` to `false` means the
EXISTING first-batch one-shot auto-fit in `WorkingCanvas.pushBatch` (`if (!hasAutoFitRef.current &&
residentExtentRef.current) { ...; fitToExtent(residentExtentRef.current, false); }`,
`notifyViewport: false` -- no new query storm) fires again for the filtered delivery's own first
batch, symmetric with a fresh dataset-open. `fitToBounds` ("Zoom to layer") is then deterministic
again within the NEW generation (`chooseFitTarget(fitAnchorRef.current)`), fitting the filtered
results specifically while that filter is active -- "the layer" the button fits is `(dataset, filter
generation)`, not `(dataset)` alone. No new fit logic was written; the entire fix is two ref resets
at the right moment.

### 3. E2E -- `FIND'` encodes the finding (`e2e/filter-panel.mjs`)

New step, added after `SLOW'/CANCEL'`: a FRESH open of the slow fixture (deliberately NOT chained off
`SLOW'/CANCEL'`'s own leftover state -- that step ends with a CANCELLED, zero-row scan and a camera
that never moved for its filter generation; `FIND'` needs the scan to run to genuine COMPLETION, a
materially different scenario). Applies the identical `id > 3999900` predicate through the real panel
DOM (input fill + Apply click -- no stream handle needed, `SLOW'/CANCEL'` already owns that
assertion), waits for the scan to finish on its own, and asserts the canvas is NOT blank.

**A real bug found and fixed while calibrating this step, disclosed in full: the FIRST version of
`FIND'`'s own wait condition was wrong, not the product.** A bare `!cancelPresent && livenessGone`
poll can pass on its VERY FIRST read -- before `page.click`'s own async `applyFilter` chain has
progressed far enough to dispatch a fresh `issued` event -- because the UNFILTERED first look's own
ceiling refusal had already left `scanState` as `{kind:"failed"}` moments earlier (P6 review B1's own
fix), and "failed" ALSO satisfies "not in-flight." The first live run failed with "canvas effectively
blank (0.000% non-bg)" -- diagnosed via a throwaway instrumented script (`e2e/_diag_find.mjs`, built,
run, deleted, this piece's own disposal convention) that printed the DOM/console state on every poll
tick: the very first poll already read the STALE post-ceiling-refusal state, `capturePixels` ran
before the new stream had even minted a ticket. Fixed with a TWO-PHASE wait: phase 1 requires
observing `button.filter-cancel` actually APPEAR (the new scan genuinely started) before phase 2
waits for it to disappear again (the new scan genuinely finished). Re-run confirmed the fix: `99`
matching rows (`id > 3999900` on the 0-indexed `id` column admits `3999901..3999999`), camera
correctly re-fit (`[render-trace] view-state` line present, right after the first filtered batch),
`1.41%` non-background pixels (`4036/285440`). `FLOOR = 0.005` (0.5%) chosen with ~2.8x headroom below
that observed value.

**`SLOW'/CANCEL'` confirmed empirically unaffected**, per the piece's own instruction: still `PASS`
in the fresh triple-suite run below, same assertions, same shape -- the bbox: null change does not
touch its own zero-batch-before-cancel logic (that step cancels PRE-batch, before any bbox-dependent
row would ever have arrived either way).

**Why `PANEL'`/`PANELREFUSE'`/`CLEAR'`/`FILTER'`/`REFUSED'` (pre-existing steps) also kept passing,
recorded rather than assumed:** `filter-zoned.parquet`'s own `zone = 'residential'` predicate matches
rows SCATTERED across the whole grid (not clustered), by the fixture's own construction
(`CUT-STATE.md`'s prior sql-filter-cut record) -- so re-fitting the camera to the filtered subset's
own extent lands on approximately the SAME overall bounding box as the unfiltered view, and the
existing pixel-fraction margins (60% ceiling, 90% Clear-recovery floor, 2-point refusal-recovery
tolerance) still held on a fresh run without adjustment. The exact observed fractions did shift
slightly (filtered: `4.6%` -> `1.6%` in this piece's own fresh run vs. the P6 gate's prior run) --
consistent with a tighter camera fit, not a defect; every margin still cleared with room.

### 4. `MANUAL-WALKTHROUGH.md` -- E5's expected text

E5's own "Expected outcome" cell gained a third, clearly-marked point: once a filtered scan is left to
run to completion (not cancelled, unlike this script's own E6), the camera automatically lands on the
matching features -- the same one-shot fit a fresh dataset-open performs -- and Zoom to layer, clicked
while that filter stays active, re-fits to the filtered results specifically. Marked explicitly as
"not part of this script's own click-path" (E6 immediately cancels the scan), citing `FIND'` as the
automated encoding of the same scenario end to end. The `e2e/filter-panel.mjs` coverage table gained a
`FIND'` row and the "Status as of..." line was updated with this piece's own fresh ledger/counts.
**The blank Part E result-log placeholder was NOT touched**, per the piece's own instruction --
that stays the custodian's to fill in.

### Tests / Verify

No new unit-test FILE; `App.test.ts`'s existing `applyFilter` describe block was rewritten in place
for the new bbox/reset-fit behavior (the piece's own instruction: "Update the applyFilter unit
tests"):

- `baseDeps()` gained `resetFitForNewGeneration: vi.fn()`, returned for assertion.
- "issues over getLastViewportBbox()..." renamed and rewritten: asserts `requestViewport` called with
  `(null, newFilter)` even when `getLastViewportBbox` is deliberately non-null (proving the primary
  attempt ignores it entirely), and that `resetFitForNewGeneration` is called exactly once on success.
- "throttled-after-retry..." gained an assertion that `resetFitForNewGeneration` is NOT called.
- "a refusal never becomes state..." updated: the PRIMARY (refused) attempt is now asserted with
  `(null, typoFilter)`; the RECOVERY attempt is still asserted with `(bbox, previousFilter)` --
  `getLastViewportBbox()`'s own value, unchanged, proving the recovery's semantics were left alone;
  gained an assertion that `resetFitForNewGeneration` is NOT called on a refusal.
- `fakeCanvasHandle()` (two call sites) and one inline `WorkingCanvasHandle` literal gained
  `resetFitForNewGeneration: vi.fn()` to keep satisfying the extended interface.

```
$ cd frontends/shell && npm run verify
✓ built in 4.08s
 Test Files  22 passed (22)
      Tests  200 passed (200)
```
(No net test-count change -- existing tests rewritten/extended in place, no new `it` blocks added;
200 matches the P6 gate's own count exactly, by design, since this piece's product changes were
covered by extending existing assertions rather than adding parallel new ones.)

### Fresh E2E confirmation, all three suites (after killing remnants, ports down first)

Killed the process tree rooted at the `npx tauri dev --config ... tauri.e2e.conf.json` PID
(`taskkill /T /F`); confirmed 9223/5180 both down before launch.

```
node e2e/regression.mjs    -- 12/12 PASS (A1'..A9', B2'/B3', C2'/C3', OVERCEIL', REOPEN', NET' info-only)
node e2e/filter.mjs        -- 3/3  PASS (OPEN, FILTER' [1.6% non-bg filtered], REFUSED')
node e2e/filter-panel.mjs  -- 6/6  PASS (OPEN, PANEL', PANELREFUSE', CLEAR', SLOW'/CANCEL', FIND')
```

`FIND'` in full: `fresh open; applied "id > 3999900" via the real DOM; scan completed on its own
(liveness/Cancel both gone, no .scan-incomplete); camera landed on the matches (1.41% non-bg, > 0.5%
floor, settled=true)`.

Ledgers: `frontends/shell/e2e/out/regression-render-trace-1786808013492.json`,
`frontends/shell/e2e/out/filter-render-trace-1786808026809.json`,
`frontends/shell/e2e/out/filter-panel-render-trace-1786808100036.json`. Each script attached to the
already-running instance the previous one launched/left running; final instance left running on CDP
port 9223 afterward (never stopped, per every script's own policy).

### Deviations from the piece as declared

1. **A real defect in the FIRST version of `FIND'`'s own wait condition, found and fixed within this
   piece** -- disclosed in full in §3 above (the stale-`{kind:"failed"}` race). Not a deviation from
   what was asked (the piece asked for exactly this calibration step: "calibrate against a real run
   and state the observed fraction"), but recorded here per this repo's own disclosure convention
   for anything a first attempt got wrong before landing.
2. **`e2e/filter-panel.mjs`'s coverage table and "Status as of..." line updated beyond E5's literal
   cell** -- the piece's item 4 named only "E5 expected text" and the result-log placeholder
   (untouched, as instructed); updating the coverage table's `FIND'` row and status line is the
   mechanical consequence of adding a real new automated step this doc already exists to
   cross-reference -- leaving it stale (still claiming "5/5") would itself be a documentation defect.
3. Everything else matches the piece as declared: Apply/Clear both issue `bbox: null` via the single
   shared `applyFilter` code path; the recovery re-issue's semantics are byte-for-byte unchanged;
   `resetFitForNewGeneration` fires only on a real issued outcome; `SLOW'/CANCEL'` confirmed
   empirically unaffected; the result-log placeholder untouched.

### State left for this piece, before commit

```
git status --porcelain (before this piece's commit)
 M frontends/shell/MANUAL-WALKTHROUGH.md
 M frontends/shell/e2e/filter-panel.mjs
 M frontends/shell/src/App.test.ts
 M frontends/shell/src/App.tsx
 M frontends/shell/src/canvas/WorkingCanvas.tsx
?? CUT-STATE-import-layout.md
?? CUT-STATE.md
?? E2E-STATE.md
?? NEXT-CUT.md
?? NIGHT-STATE.md
```

`e2e/_diag_find.mjs` (the throwaway instrumented diagnostic) was created and deleted within this
piece -- confirmed absent from the status above. `CUT-STATE-import-layout.md`, `E2E-STATE.md`,
`NEXT-CUT.md`, `NIGHT-STATE.md` predate this piece and stay untracked/untouched. `CUT-STATE.md` (this
file) stays untracked, edited in place. The five modified files above are staged and committed by
this piece in ONE commit; nothing else.

**Next piece:** the operator's actual Part E run (already done, this is what produced the E5 finding
this piece responds to) + the result-log fill-in + the PR -- both still the custodian's, per this
piece's own scope line.

---

# style-panel cut — P1 (style model) + P2 (buildLayers draw params) + P3 (WorkingCanvas seam)

Branch `cut/style-panel`, stacked on `cut/filter-panel`. Piece scope: `NEXT-CUT.md` P1-P3 only --
no panel UI (P4), no outline PathLayer (P5), no `e2e/style.mjs`/Rust fixture test (P6), no reviewer/
walkthrough/PR (P7). Three commits, one per phase, `git -c user.name=chris -c
user.email=chrys92d@gmail.com commit -s`:

- `f3e2448` P1 — style v0 becomes the shell's second consumer
- `899b027` P2 — buildLayers takes resolved draw parameters
- `de7695c` P3 — WorkingCanvas style prop + re-render seam

## P1 — the consumption mechanism (binding note 2)

Chose **(a) extraction to a renderer-owned shared module**, not a direct path import, even though a
direct import was verified to work mechanically (see below) — ADR-022 point 2 is explicit that
document semantics stay in `renderer/` "in exactly two implementations," and a `renderer/style-ts/`
home is what makes that literally true once a second TS consumer exists, rather than "the bundle
viewer's file, imported by a second package via a long relative path."

`renderer/bundle-viewer/src/style.ts` moved verbatim to `renderer/style-ts/src/style.ts`, with
exactly one change: it threw `BundleFailure` (bundle-viewer's own load-failure vocabulary — 19
states, most bundle/manifest/partition-specific and meaningless to a live style edit); the shared
module now throws its own narrow `StyleParseError` (`renderer/style-ts/src/style-error.ts`, two
states only: `style-unparseable`, `style-unsupported-version`), and `bundle-viewer/src/main.ts`
translates one instance of it back into a `BundleFailure` at its own load boundary (the one call
site, `Style.parse(...)`), naming the same `state`/`asset`/`detail` unchanged. `failure.ts` itself
(and the other 17 `BundleFailure` states) stayed in `bundle-viewer` untouched — this was a
mechanical, behavior-preserving move confirmed by bundle-viewer's own unchanged 52-test suite
(typecheck + `npm test` + `npm run build`, all still green, including the two style-agreement tests
that touch error messages by regex).

`renderer/bundle-viewer/scripts/style-agreement.test.mjs`'s only change: `importModule('src/style.ts')`
→ `importModule('../style-ts/src/style.ts')` (same cwd-relative convention it already used for the
vector path). `render.ts`/`main.ts` import from `../../style-ts/src/style.js` instead of `./style.js`.

**Verified directly, not assumed, since two different bundlers/dev-servers had to resolve a
cross-package relative `.ts` import with no npm workspace anywhere in this repo:**
- `tsc --noEmit` (shell, `include: ["src"]`) — clean; TS pulls in a transitively-imported file
  regardless of `include`.
- `npx vite --port 5199` (plain dev server, no extra config) — `GET /src/style/document.ts` → 200,
  rewritten to `/@fs/C:/dev/spatial-ide/renderer/style-ts/src/style.ts`; that `/@fs/` URL → 200 too.
  Vite's default `server.fs.allow` is `searchForWorkspaceRoot(root)`, which walks up from
  `frontends/shell` to this repo's own `.git` (found before any `package.json` with `workspaces`),
  auto-permitting the whole tree — no `fs.allow` config was added or needed.
- `vite build` (production) — succeeds; a build reads the filesystem directly, no `fs.allow` layer
  applies to it regardless.
- `vitest run` — the actual `document.test.ts` (below) exercises this same import path for real.

`frontends/shell/src/style/document.ts` — the shell's ONLY style-shaped code. `StyleState`
(`{fillColor, fillOpacity, outlineColor, outlineWidth}`, per the piece's given shape) →
`toStyleDocument`: a fixed TypeScript type (`StyleDocumentV0`) with no `match` variant to populate
(literal-only is a type-level fact, not a runtime check), colours lowercased + `#rrggbb`-validated
(fallback `#000000` on a match failure a real control can't produce — never a throw), opacity/width
clamped to `renderer/src/style.rs`'s exact bounds (restated as constants; Rust source isn't
importable). `resolveDrawParameters` is the parse direction: `toStyleDocument` → `Style.parse`
(the imported resolver) → `.resolve(null)` (literal-only, so every branch is identical). Nothing here
canonicalizes or hashes (binding note 3).

`DEFAULT_STYLE_STATE` = `{fillColor: "#4285f4", fillOpacity: 180/255, outlineColor: "#000000",
outlineWidth: 0}` — read off `buildLayers.ts`'s own pre-P2 fixed `getFillColor: [66, 133, 244, 180]`
(66=0x42, 133=0x85, 244=0xf4), `180/255` kept as the exact fraction so the RGBA round-trip
reconstructs `180` byte for byte, not merely close.

**P1 item 3, the agreement-vector join.** `document.test.ts` reads
`../../renderer/tests/data/style-agreement.json` (cwd-relative, matching the bundle-viewer test's own
convention) — read-only, not modified. The vector's own style is categorical (`match` on `zone`),
unreachable from a literal-only producer, so the join is over the vector's `probes` array instead:
each probe already carries a RESOLVED, shape-agnostic draw-parameter set (`fill_color`,
`fill_opacity`, `outline_color`, `outline_width`) that is identical in shape to a literal `StyleState`
whether a `match` or a `literal` produced it. The test treats each probe's resolved values as a
hypothetical literal `StyleState`, round-trips it through `resolveDrawParameters`, and asserts the
result equals the probe's own values unchanged — proving the shell's producer and the SAME imported
resolver the vector already pins agree with the vector's own numbers, without this module ever
needing to express a `match`. Non-empty-probes assertion included (load-bearing, matching the
bundle-viewer test's own established comment on why).

## P2 — buildLayers draw parameters

`buildLayers(batches, frame, draw: ResolvedDrawParams)` — `ResolvedDrawParams.fillColor` is deck.gl's
own 0-255 RGBA `getFillColor` convention (`@deck.gl/layers`' `DEFAULT_COLOR` shape), produced by the
new `toResolvedDrawParams(draw: DrawParameters)` (hex + `0..1` opacity → RGBA; "rendering plumbing,"
ADR-022 point 4). `draw.fillColor` is passed straight through per batch, never cloned/re-derived.

**Prop-diff finding (binding note 7: "verify against the installed `@deck.gl/core@9.3.7` prop-diff
source, don't assume" — full account is in `buildLayers.ts`'s own doc comment, condensed here):**
`getFillColor`'s prop type is `accessor` (`solid-polygon-layer.js`); for a constant (non-function)
value its `equal()` (`@deck.gl/core/dist/lifecycle/prop-types.js`) is `deepEqual(v1, v2, 1)` — a
**value** comparison, not reference. A freshly allocated array with the same four numbers already
reads as unchanged at `compareProps`. Reference stability is therefore NOT what keeps this one prop
from being flagged "changed" — but it IS what lets every render between two style changes skip even
`Attribute.setConstantValue`'s O(1) `_hasConstantBufferValue` re-check, because `data` (the polygon
coordinates) is already a brand-new array reference on **every** call to `buildLayers` regardless of
style (pre-existing, unrelated to this piece — nothing caches `polygons` by batch identity), and
`diffDataProps` compares `data` by reference alone, so `dataChanged` is already true on every
`render()` either way, bypassing the fine-grained update-trigger path regardless of what this
function does with colour. Both properties are real and both were checked; this function takes the
strictly cheaper one (stable reference) because `WorkingCanvas.tsx` can provide it for free (P3), not
because value-equality alone would have been insufficient.

`buildLayers.test.ts`: every existing call site threaded a `FIXED_DRAW = {fillColor: [66,133,244,180]}`
fixture (no assertion changes) + 5 new tests: `getFillColor` wiring, same-array-reference passthrough
(`toBe`, not `toEqual`), and 3 for `toResolvedDrawParams` (byte-for-byte default reconstruction,
opacity 0/1 → alpha 0/255, uppercase-hex defensive path).

## P3 — WorkingCanvas style prop + re-render seam

`WorkingCanvasProps.style: StyleState`; `drawParamsRef` initialized synchronously from the initial
prop (same eager-`useRef(new ...())` discipline `frameRef`/`residentRef` already use), refreshed only
by `useEffect([style])` via the new exported `applyStyleChange(style, {setDrawParams, render})` — a
pure function (same DOM-free testability reason `summarizePixels`/`App.tsx`'s helpers already are:
no WebGL in jsdom, no RTL-equivalent harness in this repo). Its signature has no viewport/manager
parameter at all, which is the structural half of binding note 7. `render()` now reads
`drawParamsRef.current` instead of a fixed literal.

`App.tsx`: `const [style, setStyle] = useState<StyleState>(DEFAULT_STYLE_STATE); void setStyle;` —
`setStyle` has no caller yet (P4). The `void` line follows this file's OWN established precedent for
the identical situation (`activeFilter`, filter-panel cut P2, this doc's own earlier section): a
function-body `useState` destructure element that TypeScript's `noUnusedLocals` DOES flag (re-verified
by direct experiment here too, not just cited) — module-scope destructuring is exempt, function-body
is not.

### Tests / Verify

```
$ cd frontends/shell && npm run verify
tsc --noEmit -- clean
vite build -- ✓ built in 3.90s
Test Files  23 passed (23)
     Tests  217 passed (217)
```
217 = 200 baseline + 9 (`document.test.ts`, new) + 5 (`buildLayers.test.ts`) + 3 (`WorkingCanvas.test.ts`).
`renderer/bundle-viewer`: `npm run verify` — typecheck clean, 52/52 tests, build succeeds (432.5kb,
NOTICE.txt regenerated correctly — the cross-package import is first-party code, not a new
third-party dependency, so the notice's package list is unaffected).

### Fresh E2E confirmation

First `e2e/regression.mjs` run showed a false `A9'` (hover) FAIL — traced to a self-inflicted testing
mistake, not a code regression: a cosmetic doc-comment edit to `WorkingCanvas.tsx` landed WHILE that
run was actively driving the same live `tauri dev` instance, triggering Vite HMR mid-run and
desyncing the `capturePixels` E2E hook's registration between `A8'` and `A9'`. Killed the process tree
(`taskkill /T /F` on the `tauri.e2e.conf.json` root PID) and reran clean with zero concurrent edits:

```
node e2e/regression.mjs    -- 12/12 PASS (A1'..A9' incl. hover, B2'/B3', C2'/C3', OVERCEIL', REOPEN', NET' info-only)
node e2e/filter-panel.mjs  -- 6/6  PASS (OPEN, PANEL', PANELREFUSE', CLEAR', SLOW'/CANCEL', FIND') -- unaffected
```

`A9'` in full: "hovered a verified non-background pixel ... -> \"id 49782 @ (2600552.826,
1206300.000)\"; moved to emptiest cell (#0, 0.0%) -> hover-readout gone". Both runs' own
non-background-pixel fractions (A4' 21.3%, filter-panel PANEL' 21.1%) match figures already on record
from before this piece — empirical confirmation that `DEFAULT_STYLE_STATE` renders identically to the
removed fixed constant, not just an arithmetic claim.
Ledgers: `frontends/shell/e2e/out/regression-render-trace-1786811267757.json`,
`frontends/shell/e2e/out/filter-panel-render-trace-1786811364998.json`. Instance left running on CDP
port 9223 afterward (never stopped, per every script's own policy).

### Deviations from the piece as declared

None material. The one thing worth naming: the piece's binding note 7 wording ("give the colour
arrays stable identity ... so deck's prop diff skips attribute regeneration") reads as if reference
stability were necessary for that outcome; reading the installed source (as the note itself required)
found the `accessor` prop type's `equal()` already does value comparison, so it is not strictly
necessary for THAT specific check — this piece still provides stable identity (it costs nothing and
skips a further, smaller O(1) check on every non-style render), and states the fuller, more accurate
finding rather than the narrower one the note's wording alone would have supported.

### State left for this piece, after three commits

```
$ git status --porcelain
?? CUT-STATE-import-layout.md
?? CUT-STATE.md
?? E2E-STATE.md
?? NEXT-CUT.md
?? NIGHT-STATE.md
```
All three commits (`f3e2448`, `899b027`, `de7695c`) are on `cut/style-panel`, not pushed.
`CUT-STATE.md` (this file) stays untracked, edited in place. `NEXT-CUT.md` untouched (its own status
line reserves deletion for the cut's final docs commit — P7, not this piece).

**Next piece:** P4 (the panel itself: collapsed-by-default disclosure, 4 controls, read-only document
text, layout re-measured against the ~112px ceiling, hover suite re-run after layout changes).

---

# style-panel cut — P4 (the panel) + P5 (outline via a non-pickable PathLayer)

Piece scope: `NEXT-CUT.md` P4 + P5 only — no `e2e/style.mjs`/Rust fixture test (P6), no reviewer/
walkthrough/PR (P7). Two commits, `git -c user.name=chris -c user.email=chrys92d@gmail.com commit -s`:

- `9e44b9e` P4 — the style panel
- `eedb865` P5 — outline via a non-pickable PathLayer

## P4 — the panel

`frontends/shell/src/style/StylePanel.tsx` (new). Collapsed-by-default disclosure (`.style-panel` /
`.style-disclosure`, "▸ Style" / "▾ Style"), keyed on `admitted.dataset` (same reason `FilterPanel`
is: a dataset change discards this panel's own local `expanded` flag, back to collapsed). Expanded:
`input.style-fill-color` (type=color), `input.style-fill-opacity` (type=range, 0..1 step 0.01),
`input.style-outline-color` (type=color), `input.style-outline-width` (type=range, 0..64 step 1),
`button.style-reset` ("Reset to default" — a fresh edit setting `DEFAULT_STYLE_STATE`, no
undo-flavoured language anywhere), `pre.style-document` (read-only, `JSON.stringify(toStyleDocument
(style), null, 2)`, selectable/copyable — the hero round-trip is "copy this text, paste it at
`publish-bundle --style`," never a button in this tree). Wired to `App.tsx`'s existing `style`/
`setStyle` (P3's own seam, unused until now): `<StylePanel key={admitted.dataset} style={style}
onChange={setStyle} />`, rendered in `.app-main`'s flex column below `FilterPanel`. `App.tsx`'s own
stale top-of-component doc comment ("No style panel... neither exists anywhere in this tree") was
also corrected — it directly contradicted what this piece just built.

**Colour-input boundary normalization.** WHATWG's `<input type="color">` value-sanitization
algorithm already guarantees a lowercase `#rrggbb` on every set
(https://html.spec.whatwg.org/multipage/input.html#color-state-(type=color)) — verified by reading
the spec text, not assumed. Each `onChange` handler lowercases the value again anyway, at the control
boundary, the same defensive discipline `document.ts`'s own `normalizeColor` already uses (never
trust a boundary even when the spec already guarantees it); `toStyleDocument` normalizes a second
time regardless when the document is actually built, so this is belt-and-suspenders, not the only
guard against a malformed literal (binding note 5).

### Layout — real numbers, not the stale ~112px figure

**First measurement attempt was contaminated and is disclosed, not hidden.** An initial interactive
probe reused ONE long-lived dev instance across several `openPath` calls from different script
invocations; a diagnostic dump caught the live DOM carrying **two** simultaneous `.filter-panel`
elements at that moment — a harness/HMR-churn artifact from repeated ad hoc admissions on one
instance (the same class of symptom `E2E-STATE.md`'s own D3 "churn starvation" note already named),
not a real product defect. All numbers below are from a **clean, single-shot measurement**: every
remnant process killed first (`taskkill /T /F` on the app's root PID; ports 9223/5180 confirmed down
via `netstat`), a fresh `tauri dev` launch, the 100k-happy-path fixture admitted via `openPath`
exactly once, then `getBoundingClientRect()` read directly over CDP (`page.evaluate`) — collapsed,
then after one click on `.style-disclosure`.

- `.admission-panel` 450px, `.filter-panel` 90.2px — **real headroom above `.canvas-container`'s
  200px floor, at 1280x800, is only ~21.8px** once both existing panels are showing their own
  present, shipped content. This is much tighter than the ~112px `FilterPanel.tsx`'s own header
  comment quotes (that figure was measured against a different `.filter-panel` shape, its own
  now-dropped column-list extra — not a live fact of the current tree).
- A first CSS attempt reused `.filter-panel`'s own `padding: 1rem` and default line-height for the
  collapsed disclosure row: **56px collapsed** — 34px over the real budget, reproducing
  `FilterPanel.tsx`'s own dropped-extra defect exactly (`.canvas-container` forced to its 200px
  floor, its own bottom edge landing 34px below the 800px viewport, physically unreachable by a
  hover event — the same class of bug `FilterPanel.tsx`'s own header comment already named).
- Fixed: `.style-panel { padding: 0.15rem 1rem; }`, `.style-disclosure { font-size: 0.75rem;
  line-height: 1; padding: 0; margin: 0; }`, no separate spacing budget spent on anything but the
  collapsed row itself. **Measured collapsed height: 17.8px** — fits with ~4px to spare.
  `.canvas-container` measured **204.0px collapsed**, its own bottom edge landing exactly at the
  800px viewport boundary. `styles.css`'s own `.style-panel` comment carries the full numbers.
- **Expanded:** `.style-panel` measures 285.8px (`.style-controls`'s own `max-height: 16rem` caps
  the controls+document block at 256px of that). `.canvas-container` is then forced to its 200px
  floor with its own bottom landing at 1064px — well below the 800px viewport; `.app-main`'s own
  `overflow: auto` makes it reachable by scrolling, not by an unscrolled hover. **Accepted**:
  expanding is a deliberate user action, and neither `regression.mjs` nor `filter-panel.mjs` (this
  piece's own required verify step) ever clicks `.style-disclosure`, so this does not touch the
  "hover suite must stay green" gate. A future piece adding an expanded-state E2E assertion would
  need to scroll first.

### Deviation from the phase table's "outline pair disabled until P5" hint

`NEXT-CUT.md`'s own phase table names, for P4: "4 controls (outline pair disabled until P5 or with
the P5-fallback)". This piece built P4 and P5 together and, after weighing it, chose **not** to add a
literal `disabled` attribute + reason text to the outline controls for the brief historical window
between the two commits — the `9e44b9e` (P4) commit ships the outline controls already enabled but
functionally inert (writing `outlineColor`/`outlineWidth` into `StyleState`, visible in
`.style-document`, but `buildLayers.ts` at that commit still ignores them entirely, since P5's
changes land in the very next commit, `eedb865`, in this same piece). This piece's own literal
instructions list four controls with no mention of a disabled intermediate state, and P5 was never
dropped, so no user ever sees an inert-but-enabled control in a real running build (both commits land
together). The **fallback** case the phase table actually cares about — disabled + a visible reason,
if P5 is dropped — did not apply; see P5's own section below for why it was not dropped.

**Verified in isolation, not merely asserted:** `git stash push --keep-index` (temporarily removing
the P5-only diff from the working tree) was used to prove the P4-only commit is self-contained --
`npm run typecheck`/`test`/`build` all green at exactly 217 tests (the P3 baseline) against that
isolated state, before `git stash pop` restored the P5 diff and the second commit was made.

## P5 — outline via a non-pickable PathLayer: BUILT, not dropped

`canvas/buildLayers.ts`: `buildLayers` now returns `(SolidPolygonLayer<Position[][]> |
PathLayer<Position[]>)[]`. Per batch, alongside the existing `SolidPolygonLayer`, a `PathLayer` with
id `` `${layerId(batch)}-outline` ``, `pickable: false`, built only when `draw.outlineWidth > 0`.
Data reuses the fill layer's own already frame-offset `polygons` array, flattened one level
(`polygons.flatMap((rings) => rings)`) — every ring of every feature, exterior and holes alike,
becomes its own path; a ring's own vertex list already repeats its first vertex as its last
(GeoArrow/WKB convention), so `PathLayer` draws it closed with no `_pathType`/`closeLoop` prop
needed. `widthUnits: "pixels"` (`renderer/src/style.rs`'s own `MAX_OUTLINE_WIDTH` doc comment:
"Outline width ceiling, in CSS pixels" — verified against the crate, not assumed).

**Structurally incapable of producing a pick, not merely unlikely to.** `pickable: false` removes
this layer from deck.gl's own pick-index space entirely — there is no code path from a GPU pick
ordinal back to this layer at all, which is the actual structural guarantee (this is the SAME hazard
`SolidPolygonLayer`'s own pre-existing doc comment records for `PolygonLayer`'s internal outline
sub-layer — a composite layer's sub-layer reports `info.layer.id` with a composite-suffixed id
`batchForLayerId`'s exact-match lookup would silently fail to resolve — and this construction avoids
it structurally, by never being a sub-layer of anything). The fact that its id also never collides
with `batchForLayerId`'s own exact-match lookup is redundant insurance on top of that, not what does
the work; both are asserted in `buildLayers.test.ts`.

`ResolvedDrawParams` gains `outlineColor: [number,number,number,number]` (alpha always 255 — style
v0/ADR-017 §5a has no separate outline-opacity field, only `fill_opacity`) and `outlineWidth: number`
(CSS pixels, passed straight through). `toResolvedDrawParams` computes both from the resolved
`DrawParameters` the same way it already computes `fillColor`.

**Declared cost, never a VRAM figure (ADR-010 rule 6 style):** layer count doubles per outlined
batch (one fill layer, one outline layer); every ring vertex crosses to the GPU a second time (once
triangulated for the fill interior, once again as line geometry for the outline path) — pure
per-batch construction cost, nothing shared. `checkPickCeiling` and `MAX_RESIDENT_VERTICES` are both
unaffected: the pick ceiling never sees the outline layer at all (`pickable: false`), and resident-
vertex admission (`ResidentSet.addBatch`) already happened, in `WorkingCanvas.pushBatch`, strictly
before `buildLayers` ever runs on whatever ended up resident.

**Unit tests** (`buildLayers.test.ts`, 6 new, file total 11 → 17): outline layer present (2× layer
count, ids `sh_a:0`, `sh_a:0-outline`, `sh_b:3`, `sh_b:3-outline`) when `outlineWidth > 0`; absent
entirely (never an invisible zero-width layer) at `outlineWidth === 0`; the outline layer is a
`PathLayer`, `pickable: false`, carries the exact outline colour/width/`widthUnits`; the fill layer
stays `pickable: true`, unaffected by the outline layer's presence; the outline id never resolves via
`batchForLayerId`'s exact-match lookup (fills only — the pick seam `WorkingCanvas.tsx`'s `onHover`
reads is untouched, since `pickable: false` already keeps the outline out of `info.layer` entirely).
`toResolvedDrawParams` gains one new test for the outline-colour conversion. Three pre-existing
`toResolvedDrawParams`/`applyStyleChange` (`WorkingCanvas.test.ts`) assertions were updated (not
newly added) to the widened return shape — disclosed rather than silently left passing on a narrower
implicit contract.

### Tests / Verify (combined P4+P5 state)

```
$ cd frontends/shell && npm run verify
tsc --noEmit -- clean
vite build -- built in ~5.7s (982-996 kB main chunk, pre-existing size warning, unrelated to this piece)
Test Files  23 passed (23)
     Tests  223 passed (223)
```
223 = 217 (P3 baseline, this doc's own P1–P3 section) + 6 new `buildLayers.test.ts` outline tests.
`StylePanel.tsx` has no direct unit test — no RTL-equivalent harness exists in this repo (checked:
`find src -iname "*.test.ts*"` — no `AdmissionPanel.test.tsx`/`FilterPanel.test.tsx` either, the
established sibling convention this piece follows), so plain-JSX wiring is verified via E2E instead,
matching `FilterPanel.tsx`'s own precedent exactly.

### E2E — both required scripts, fresh, green; one disclosed harness finding

**Both port-killed, freshly-launched, standalone runs (this piece's actual code, `eedb865`'s tree)
are fully green:**

```
node e2e/regression.mjs     -- 12/12 PASS (A1'..A9' incl. hover, B2'/B3', C2'/C3', OVERCEIL', REOPEN',
                                NET' info-only). A9': "hovered a verified non-background pixel ...
                                -> \"id 29481 @ (2600036.075, 1203740.000)\"; moved to emptiest cell
                                (#0, 0.0%) -> hover-readout gone".
node e2e/filter-panel.mjs   -- 6/6  PASS (OPEN, PANEL', PANELREFUSE', CLEAR', SLOW'/CANCEL', FIND').
                                PANEL': "unfiltered 21.8% non-bg, filtered 1.6% non-bg".
```
Ledgers: `frontends/shell/e2e/out/regression-render-trace-1786813446223.json`,
`frontends/shell/e2e/out/filter-panel-render-trace-1786813827991.json`. Instance left running on CDP
port 9223 afterward, per every script's own policy.

**A real, disclosed finding: chaining both scripts on ONE live instance back-to-back is fragile,
independent of this piece's code.** The first end-to-end attempt ran `regression.mjs` then, on the
SAME still-running instance it left up, immediately `filter-panel.mjs` — `regression.mjs` itself
passed 12/12, but `filter-panel.mjs`'s `PANEL'` step then failed: "filtered fraction 22.83% is not
measurably lower than unfiltered 22.83%" (identical to two decimal places — the Apply click produced
no visible render change at all). Isolated by process of elimination, each leg run standalone
(fresh-launched, port-killed instance, no chaining):

| Build | Suite (standalone) | Result |
|---|---|---|
| This piece's code (`eedb865`) | `filter-panel.mjs` alone | 6/6 PASS, `PANEL'` 21.8% → 1.6% |
| Unmodified P3 baseline (`de7695c`, via `git stash -u`) | `filter-panel.mjs` alone | 6/6 PASS, `PANEL'` 21.1% → 1.6% |
| This piece's code (`eedb865`) | `regression.mjs` alone (first attempt, before the chained run) | 12/12 PASS, A9' hover confirmed |

Both the modified and unmodified code pass `filter-panel.mjs` cleanly when it is not chained
immediately behind a full `regression.mjs` run on the same instance — the earlier `PANEL'` failure is
a **pre-existing E2E harness session-chaining fragility** (plausibly the same class of symptom
`E2E-STATE.md`'s own D3 "churn starvation" note already recorded: heavy accumulated churn — 12 steps
of admissions/pans/zooms/re-opens — on one long-lived dev instance), **not a regression this piece's
P4/P5 diff introduced.** Not investigated further (out of this piece's scope: an E2E harness
robustness question, not a style-panel defect) — flagged here for whoever next touches
`regression.mjs`/`filter-panel.mjs`'s own chaining assumptions. The two required-green runs recorded
above are each a genuinely fresh, standalone, port-killed launch, satisfying this piece's own verify
step honestly rather than papering over the chained-run failure.

### Deviations from the piece as declared

1. **Outline controls shipped enabled (not disabled) in the P4 commit** — see P4's own section above,
   disclosed there with the reasoning (both phases land in this one piece; no fallback was needed).
2. **The first layout measurement attempt was contaminated** by reusing one long-lived dev instance
   across multiple ad hoc admissions (a duplicate `.filter-panel` DOM artifact was directly observed)
   — discarded; every number actually used in `styles.css`'s comment and reported here is from a
   single clean, freshly-launched, single-admission measurement, disclosed above rather than silently
   swapped in.
3. **The E2E chained-session `PANEL'` failure** — investigated to a specific, disclosed conclusion
   (a harness fragility, not a regression) rather than either silently re-running until green or
   reporting a false FAIL against this piece's own actual code; see the E2E section above in full.
4. Everything else matches the piece as declared: P5 was built, not dropped (it neither threatened
   the verify budget nor the pick suite — `buildLayers.test.ts`'s own pick-adjacent assertions are
   green); both commits are separate, signed, on `cut/style-panel`, not pushed.

### State left for this piece, after two commits

```
$ git status --porcelain
?? CUT-STATE-import-layout.md
?? CUT-STATE.md
?? E2E-STATE.md
?? NEXT-CUT.md
?? NIGHT-STATE.md
```
Both commits (`9e44b9e`, `eedb865`) are on `cut/style-panel`, not pushed. `CUT-STATE.md` (this file)
stays untracked, edited in place. `NEXT-CUT.md` untouched (P7's own final docs commit retires it).

**Next piece:** P6 (`e2e/style.mjs` — set fill colour with opacity 1.0, assert the exact new dominant
pixel bin; an opacity step assert-CHANGE-not-literals since the buffer blends over transparent black
— plus the Rust cross-implementation fixture test: a checked-in doc the shell emits, read by a Rust
test asserting `spatial_renderer::style::parse` + compile accept it, neither side generating it), then
P7 (reviewer, MANUAL-WALKTHROUGH Part F, operator run, PR).

---

# style-panel cut — P6 (`e2e/style.mjs` + the Rust cross-implementation fixture test)

Piece scope: `NEXT-CUT.md` P6 only — no reviewer/walkthrough/PR (P7).

## 1. The colour-input event mechanism — verified empirically, not assumed

NEXT-CUT.md P6's own instruction: "input type=color may need a synthetic event via page.evaluate —
find what works and record it." A disposable probe script (run against the real app over CDP, deleted
before this commit, never part of the deliverable) drove `input.style-fill-color` (type=color) and
`input.style-fill-opacity` (type=range) two ways and read `pre.style-document`'s own live text after
each attempt — not by assumption:

1. Plain `page.fill(selector, value)`.
2. A native-setter-bypass + synthetic `input`/`change` event dispatch (the classic React
   "controlled input" workaround — `Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,
   "value").set.call(el, value)` then two dispatched events, bypassing React's own instance-level
   value-tracker property that a plain `el.value = x` assignment would otherwise go through and
   silently defeat, per React's `packages/react-dom/src/client/inputValueTracking.js`).

**Both worked.** Reading the installed `playwright-core@1.62.1`'s own `fill()` implementation
(`coreBundle.js`, `kInputTypesToSetValue` — `"color"` and `"range"` are both members) shows it already
does exactly `input.focus(); input.value = value; element.dispatchEvent(new Event("input", {bubbles:
true, composed:true})); element.dispatchEvent(new Event("change", {bubbles:true}))` — theoretically
the exact pattern that trips the React-tracker footgun (a direct `.value =` assignment goes through
React's own instance-shadowing setter, silently updating its tracker to match before the event ever
fires, so `updateValueIfChanged` sees no difference and never calls the synthetic `onChange`). Empirically,
on this app's React 18.3.1 + this Chromium build, it did NOT reproduce that footgun: `pre.style-
document`'s text updated correctly after every `page.fill()` call in the probe. **`style.mjs` therefore
uses plain `page.fill()` throughout** (matching `filter-panel.mjs`'s own `input.filter-predicate`
precedent) — the native-setter-bypass path is recorded here as a confirmed-working FALLBACK for a
future browser/React combination where the footgun does reproduce, not carried into the committed
suite since it was not needed.

## 2. `e2e/style.mjs` (new, sibling to `regression.mjs`/`filter-panel.mjs`)

Drives the real rendered `.style-panel` DOM NEXT-CUT.md P6 names: `input.style-fill-color`,
`input.style-fill-opacity`, `input.style-outline-color`, `input.style-outline-width`, `button.style-
reset`, `pre.style-document`. `waitForMountReady`/`withTimeout`/`waitForCondition`/`sleep` duplicated
from `filter-panel.mjs` (this repo's own established sibling-file convention, named in that file's own
header).

**Every `capturePixels` call in this suite happens with the panel COLLAPSED, not merely "collapsed or
scrolled."** This piece's own P4 layout note (this file, above) records that EXPANDING forces
`.canvas-container` to a materially different, smaller floor than collapsed — an expanded-state capture
and a collapsed-state capture see different visible extents of the SAME dataset, not just a different
scroll position, so they are not comparable frames at all. Every step here expands only long enough to
reach an `<input>` (`setExpanded(page, true)`), then collapses again (`collapseAndSettle`, which also
bounded-polls `.canvas-container`'s own `clientWidth`/`clientHeight` for two stable 150ms-apart reads —
a readiness gate for the CSS reflow a disclosure toggle triggers, never a timing claim, ADR-018) before
ever calling `capturePixels`.

**Steps** (fixture: `filter-zoned.parquet`, the same one `filter-panel.mjs` already uses — style v0 has
no filter/attribute dependency of its own, so reusing it avoided a third fixture generator for the same
shape of need):

- `OPEN` — admits the fixture; asserts `.style-disclosure`'s `aria-expanded` is `"false"` (collapsed by
  default, binding note 6) on a freshly admitted dataset.
- `STYLE'` — settles the dataset's own first (unfiltered) stream (`waitForSettle`, same discipline
  `filter-panel.mjs`'s own `stepPanel` uses — capturing a "baseline" before the first stream settles
  raced an empty canvas in the first run, disclosed in the deviations below), captures the baseline
  dominant non-background `topColors` bin, then sets `fill_color=#cc2200`/`fill_opacity=1` through the
  real inputs and asserts the dominant bin is an EXACT match for `204,34,0,255` — opacity 1.0 means no
  blending (`srcAlpha=1` fully replaces whatever is under it, background or not), the one case this
  suite claims bit-for-bit.
- `OPACITY'` — lowers `fill_opacity` to `0.4` and asserts ONLY that the dominant bin CHANGED from
  `STYLE''s` own (never a literal — NEXT-CUT.md P6's own wording: "the buffer blends over transparent
  black").
- `OUTLINE'` — sets `outline_color=#00ccff`/`outline_width=8` (both chosen distinct from every family
  already present, asserted before the fact) and asserts that exact colour family (`"0,204,255,255"` —
  outline alpha is always 255, `ResolvedDrawParams`'s own doc comment) appears in `topColors`; then
  sets `outline_width` back to `0` and asserts it disappears.
- `DOC'` — parses `pre.style-document`'s own `textContent` (never re-derived) and asserts every field
  matches the CURRENT controls (`fill_color`/`fill_opacity` from `STYLE'`/`OPACITY'`, `outline_color`
  still set but `outline_width` back to 0 from `OUTLINE'`) — `fill_color.literal === "#cc2200"` is
  checked among the rest, per NEXT-CUT.md's own instruction.
- `RESET'` — clicks `button.style-reset`; asserts the document returns to `DEFAULT_STYLE_STATE` EXACTLY
  (a known fixed document, unlike an opacity blend) and the dominant non-background bin returns to
  `STYLE''s` own baseline COLOUR FAMILY (a 3-per-channel tolerance, not bit-for-bit — this suite only
  claims exactness for the alpha=1 no-blend case `STYLE'` itself asserts).

`npm run e2e:style` added to `frontends/shell/package.json`.

## 3. The Rust cross-implementation fixture (the anti-"renders-live-refuses-at-publish" evidence)

**`renderer/tests/data/shell-emitted-styles.json`, checked in, generated once, not generated at test
time by either side** — exactly NEXT-CUT.md P6's own instruction. A throwaway vitest test
(`frontends/shell/src/style/_generate-shell-emitted-styles.test.ts`, run once via `npx vitest run
src/style/_generate-shell-emitted-styles.test.ts`, its output hand-verified then this file DELETED
before this commit — the same disposal convention `pilot_p3_*.rs`/`pilot_json_serialize_sql.rs` already
established for this repo's Rust half, named explicitly in this file's own header comment) imported the
shell's real `document.ts::toStyleDocument`/`DEFAULT_STYLE_STATE` and wrote two real documents:

- `default_document` — `toStyleDocument(DEFAULT_STYLE_STATE)` verbatim.
- `changed_document` — `toStyleDocument({fillColor:"#cc2200", fillOpacity:0.4, outlineColor:"#00ccff",
  outlineWidth:8})` — deliberately the EXACT literal combination `e2e/style.mjs`'s own `OUTLINE'` step
  actually drove through the real panel DOM and rendered, tying this Rust-side acceptance check to the
  same bytes the E2E-verified suite already exercised rather than a second, disconnected set of
  numbers.

`renderer/tests/style_shell_agreement.rs` (new, following `style_agreement.rs`'s own conventions:
license header, `include_str!` over the fixture, no fixture generation inside the test itself) reads
that fixture and, for each of the two documents:

1. `spatial_renderer::style::parse` — the same grammar `publish-bundle --style` compiles against —
   accepts it, verbatim bytes.
2. `spatial_renderer::compile` succeeds against a **minimal stub schema**: an empty column list and an
   empty published-column list. Read, not assumed (`compiled.rs::compile`'s own source): `schema`/
   `published` are only ever consulted when `document.match_column()` is `Some`; a literal-only
   document's `match_column()` is always `None` (style v0's own live-editing ceiling, ADR-023:
   `viewport_query` carries no attributes, so a shell-produced document can never declare a `match`) —
   so an empty schema is not a weakened case here, it is the same input a shell-emitted document would
   produce for ANY dataset schema, precisely because it never depends on one.
3. Not vacuous: `compiled.resolve(None)` (the same key `document.ts::resolveDrawParameters` itself
   calls) reproduces the fixture's own literal `fill_color`/`fill_opacity`/`outline_color`/
   `outline_width` values exactly, proving `compile`/`resolve` actually read this document's fields
   rather than merely accepting well-formed JSON.

No new dependency (`serde_json`/`arrow` were already normal, non-dev dependencies of
`renderer/Cargo.toml`, used identically by `style_agreement.rs`).

### Verify — Rust, tail

```
$ cd C:\dev\spatial-ide && cargo test -p spatial-renderer --test style_shell_agreement
running 1 test
test shell_emitted_documents_are_accepted_by_the_publish_side_grammar ... ok
test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
```
Full `cargo test -p spatial-renderer` (30 unit tests + `style_agreement.rs` (1) + `style_shell_agreement.rs`
(1), 32 total): all green, no regression.

### Verify — shell, tail

```
$ cd frontends/shell && npm run verify
tsc --noEmit -- clean
vite build -- built in 3.74s
Test Files  23 passed (23)
     Tests  223 passed (223)
```
223 unchanged from the P4/P5 baseline (this piece adds no shell source file besides the new sibling
E2E script and the disposed throwaway generator — no unit-test surface changed).

### Fresh E2E confirmation — all three suites, each on its own freshly-launched, port-killed instance

The disclosed P4/P5 session-chaining fragility (this file, above: chaining two suites back-to-back on
ONE live instance can desync harness state) means each of the three suites below was run standalone —
every remnant process tree killed (`taskkill /T /F` on the `tauri.e2e.conf.json` root PID, plus
`msedgewebview2.exe` by image name) and `netstat` confirmed no `LISTENING` socket on 9223/5180
(`TIME_WAIT` entries from the just-killed session are expected and harmless) before each launch:

```
node e2e/regression.mjs    -- 12/12 PASS (A1'..A9' incl. hover, B2'/B3', C2'/C3', OVERCEIL', REOPEN', NET' info-only)
node e2e/filter-panel.mjs  -- 6/6  PASS (OPEN, PANEL', PANELREFUSE', CLEAR', SLOW'/CANCEL', FIND')
node e2e/style.mjs         -- 6/6  PASS (OPEN, STYLE', OPACITY', OUTLINE', DOC', RESET')
```

`STYLE''s` own exact-match evidence line, verbatim: `"baseline dominant 47,94,172,180; set
fill_color=#cc2200/fill_opacity=1 via the real DOM (input.style-fill-color + input.style-fill-opacity);
dominant non-bg bin EXACTLY \"204,34,0,255\" (count 51556/294400)"`. `OPACITY'`: `"dominant non-bg bin
CHANGED 204,34,0,255 -> 82,14,0,102"`. `OUTLINE'`: `"outline_color=#00ccff/outline_width=8 via the real
DOM -> \"0,204,255,255\" appeared in topColors; outline_width=0 -> it disappeared"`. `RESET'`:
`"dominant non-bg bin 47,94,172,180 back in the baseline family (47,94,172,180)"` — the reset case
happened to land byte-exact too (deterministic blend-over-zero-alpha arithmetic at this specific
opacity), but the assertion itself only requires the declared 3-per-channel tolerance, per this
section's own §2 note.

Ledgers: `frontends/shell/e2e/out/regression-render-trace-1786815376721.json`,
`frontends/shell/e2e/out/filter-panel-render-trace-1786815485920.json`,
`frontends/shell/e2e/out/style-render-trace-1786815520311.json`. Instance left running on CDP port 9223
afterward (never stopped, per every script's own policy), attached to (not relaunched by) the final
`style.mjs` run.

**NIT (reviewer gate, style-panel cut P7 fixes) -- clarifying the sentence above, which read as
contradicting "each on its own freshly-launched, port-killed instance" a few lines up.** It does not:
`style.mjs`'s OWN `attachOrLaunch()` call LAUNCHED fresh, same as the other two runs -- the previous
suite's instance had already been killed (per the port-kill discipline stated at the top of this
section) before `style.mjs` ever started, so there was nothing for it to attach to. "Attached to (not
relaunched by)" describes the state AS OF WRITING THIS NOTE, after `style.mjs` finished: the instance
still up on port 9223 at that moment is the one `style.mjs` itself had just launched, and a later
reader/session finding that port already listening should attach to it rather than launch a second
one -- it is not a claim about what `style.mjs` did internally when IT started.

## 4. `e2e/README.md`

New "Style spec (style-panel cut, P6)" section added, matching the existing per-suite section format
(`npm run e2e:style`, what each step asserts, the colour-input mechanism finding, the collapsed-only
capture discipline, evidence class, watchdog discipline).

## Deviations from the piece as declared

1. **The first `style.mjs` run FAILED at `STYLE'`** — a genuine self-caught defect in this suite's own
   first draft, not the product: `stepStyle` captured "baseline" immediately after `openPath` resolved,
   racing the dataset's own first (unfiltered) IPC stream still arriving — `capturePixels` read an
   all-background frame (`topColors: [{"rgba":"0,0,0,0","count":45000}]`). Fixed by adding the same
   `waitForSettle(() => consoleHandle.renderTrace(), ...)` call `filter-panel.mjs`'s own `stepPanel`
   already uses before its own first capture — disclosed here rather than silently only reporting the
   passing second run.
2. Everything else matches the piece as declared: both required deliverables built (the E2E suite, the
   Rust fixture test), all three suites verified fresh per-instance, `npm run verify` and
   `cargo test -p spatial-renderer` both green, `e2e/README.md` updated, `CUT-STATE.md` (this section)
   appended.

## State left for this piece, before commit

```
$ git status --porcelain
 M frontends/shell/e2e/README.md
 M frontends/shell/package.json
?? CUT-STATE-import-layout.md
?? CUT-STATE.md
?? E2E-STATE.md
?? NEXT-CUT.md
?? NIGHT-STATE.md
?? frontends/shell/e2e/style.mjs
?? renderer/tests/data/shell-emitted-styles.json
?? renderer/tests/style_shell_agreement.rs
```
`CUT-STATE.md` (this file) stays untracked, edited in place; `NEXT-CUT.md` untouched (P7's own final
docs commit retires it).

**Next piece:** P7 (reviewer over the cut; MANUAL-WALKTHROUGH Part F walkthrough; operator run; PR) —
the custodian's own scope, not this piece's.

---

# style-panel cut — reviewer gate fixes (P7 fixes: B1 blocking + S1-S5 + NITS)

Branch `cut/style-panel`, starting HEAD `3d88596`. Piece scope: the reviewer's own citation list --
B1 (blocking), S1-S5, two NITS. Not in scope: MANUAL-WALKTHROUGH Part F, operator run, PR (still
P7's own remaining custodian scope). Two commits, `git -c user.name=chris -c
user.email=chrys92d@gmail.com commit -s`:

- `712271e` B1 -- CI: watch `renderer/style-ts/**` in every workflow it touches
- `f0c3b7a` S1-S5 + NITS -- the code/test/doc fixes

## B1 (BLOCKING) — `renderer/style-ts/**` was invisible to every CI path filter

ADR-022's extraction (style-panel P1) moved the shared TS style semantics into
`renderer/style-ts/src/style.ts`, imported by BOTH `renderer/bundle-viewer/src/main.ts` and
`frontends/shell/src/style/document.ts` by relative path, outside every existing workflow's watched
paths. Fixed in all three workflow files, each matching that file's own existing filter style
exactly (comment-then-list, per its own established convention):

- `.github/workflows/product-ci-viewer.yml`: `"renderer/style-ts/**"` added to both `push.paths` and
  `pull_request.paths`, plus a new paragraph in the file's own "What it watches that is not obvious"
  section.
- `.github/workflows/product-ci-shell.yml`: same addition to both path lists, plus a new "## The
  style-ts path, watched here too" section matching the file's own existing per-topic section
  convention (`## The shared-fixture path...`, `## The upstream crate paths...`).
- `.github/workflows/product-ci-rust.yml`: `- "!renderer/style-ts/**"` added alongside the EXISTING
  `- "!renderer/bundle-viewer/**"` exclusion, in both `push` and `pull_request` blocks, with a
  matching explanatory comment -- `renderer/style-ts/**` is pure TypeScript, read by two OTHER
  workflows' own suites, never by a Rust target, the identical reasoning the bundle-viewer exclusion
  already states.

YAML validated (`python3 -c "import yaml; yaml.safe_load(...)"` over all three files -- PyYAML
available in this environment, used rather than assumed-correct).

## S4 — StylePanel moved below `.canvas-container`; layout re-measured; `e2e/style.mjs` simplified

Moved in `App.tsx`'s JSX (the `{admitted && <StylePanel .../>}` block relocated from immediately
before `.canvas-container` to immediately after it, still inside `.app-main`'s flex column, still in
normal document flow, still keyed per-dataset). Full rationale and the real numbers are recorded in
`styles.css`'s own `.style-panel` comment (rewritten, not just amended) and `App.tsx`'s own JSX
comment at both the old and new positions -- condensed here:

- **Real headroom above `.canvas-container`'s 200px floor, remeasured, fresh, killed-and-relaunched
  instance:** `.admission-panel` 450px, `.filter-panel` 90.2px, `.canvas-container` top **578.2px in
  EVERY case** (collapsed OR expanded) -- unchanged by `.style-panel`'s own state, because flexbox
  distributes space by the sum of ALL siblings' sizes regardless of visual ORDER, and the canvas now
  comes first in visual order either way.
- **Collapsed:** `.canvas-container` 204.0px tall, bottom 782.2px -- inside the 800px viewport.
- **Expanded:** `.canvas-container` forced to its 200px floor, bottom 778.2px -- STILL inside the
  800px viewport (the whole point of the move: with the OLD above-canvas ordering, expanding pushed
  the canvas's bottom to 1064px, entirely below the fold, per this file's own P4 section).
- **One real difference remains, measured and handled, not ignored:** expanding makes total page
  content height (826px) exceed 800px, so `.app-main`'s own vertical scrollbar appears and narrows
  `.canvas-container`'s `clientWidth` by ~15px (1280px collapsed -> 1265px expanded).

`e2e/style.mjs` simplified accordingly: the original collapse-before-every-capture dance
(`collapseAndSettle`, deleted) is gone -- the suite now expands the panel EXACTLY ONCE, before its
very first capture (`stepStyle`'s own baseline), and stays expanded for the rest of the run, so every
capture (baseline included) is over the SAME (expanded) canvas width, never mixing a collapsed-width
baseline against an expanded-width later capture. `waitForCanvasLayoutStable` is called once now
(right after the single expand), not before every capture. `e2e/README.md`'s own "Style spec" section
updated to match. Both files' own top comments carry the full account.

## S5 — rAF-coalesced style render, and two real bugs found fixing it correctly

`frontends/shell/src/canvas/coalesceOncePerFrame.ts` (new): `{schedule, cancel, flush}`, mirroring
`streaming/debounce.ts`'s own `{call, cancel}` interface shape, `requestFrame`/`cancelFrame`
injectable (default `requestAnimationFrame`/`cancelAnimationFrame`) for a fully-controlled fake in
tests, per the piece's own suggestion. `WorkingCanvas.tsx`'s `[style]` effect now calls
`coalescedRenderRef.current.schedule()` instead of `render` directly -- `setDrawParams` still runs
synchronously, ungated, on every style change (binding note 7 untouched: no new query/ticket/debounce
call site, this only changes WHEN the already-existing `render()` call happens). Unmount cleanup
cancels any pending frame (`useEffect(() => () => coalescedRenderRef.current.cancel(), [])`).
7 new unit tests in `coalesceOncePerFrame.test.ts` (a `fakeFrame()` helper -- a small, fully
controlled fake `requestAnimationFrame`/`cancelAnimationFrame`, not jsdom's own).

### Two real bugs, found investigating this fix, not merely worked around

**1. A genuine duplicate React key.** `FilterPanel` and `StylePanel` are direct siblings in
`.app-main`'s children and were BOTH keyed on the bare `key={admitted.dataset}` string -- a real
`"Warning: Encountered two children with the same key"` console error, observed live (not
hypothesized) while investigating an E2E flake this collision turned out NOT to be the cause of, but
is a real, independently worth-fixing bug regardless (pre-existing since P4, not introduced by S4/S5).
Fixed: `key={`filter-${admitted.dataset}`}` / `key={`style-${admitted.dataset}`}` -- both still change
together on every dataset change (the remount semantic is unaffected), simply no longer identical
strings. Confirmed fixed: the warning is gone from a fresh run's own console ledger (checked directly,
not assumed).

**2. The actual root cause of the flake: `deck.redraw()` does not sync GPU attribute buffers with
current layer props.** Verified directly against the installed `@deck.gl/core@9.3.9` source
(`lib/deck.js`, `lib/layer-manager.js`), not assumed: `LayerManager.updateLayers()` -- which
recomputes a layer's GPU buffers (e.g. `getFillColor`) from its current props via each layer's own
`updateState` -- is called ONLY from `Deck._onRenderFrame()`, deck's own internal
`requestAnimationFrame`-driven loop. `Deck.redraw()` -> `_drawLayers()` draws whatever is CURRENTLY
in the GPU buffers and never calls `updateLayers()` itself. Before this piece coalesced style
renders, `render()`'s own `setProps({layers})` call (synchronous, inside `useEffect([style])`) was
always separated from `capturePixels`'s own forced `redraw()` by real wall-clock time (a CDP round
trip, a poll interval) comfortably longer than one animation frame -- long enough that deck's own
natural loop had ALREADY run `updateLayers()` by the time the forced redraw fired, so the gap was
never visible in three cuts' worth of E2E suites. `flush()` (S5's own fix for the "still pending"
half of this) collapses that gap deliberately for the RENDER itself, which ALSO collapsed the
accidental timing margin that used to hide this second, deeper gap -- a forced `redraw()`
immediately after `flush()` could draw brand-new layer PROPS through STALE GPU BUFFERS, reading back
the PREVIOUS colour. Diagnosed with temporary instrumentation (`console.debug` in `render()` and in
`capturePixels`'s own `onAfterRender`, comparing `drawParamsRef.current` against
`deck.props.layers[0].props.getFillColor` at the moment of the actual draw -- both already showed
the CORRECT new colour, yet `gl.readPixels` still read back the OLD one, which is what pointed at a
GPU-buffer-sync gap rather than a props/state bug; the diagnostic lines were removed before commit).

**Fix:** `capturePixels`'s hook now calls `layerManager.updateLayers()` explicitly, right before its
own `deck.redraw()` call, immediately after `flush()`. `layerManager` is `protected` in the installed
type declarations (an internal API) but a real, safely-idempotent method at runtime
(`updateLayers()`'s own source: a no-op unless `needsUpdate()` finds a real reason) -- reached via a
narrow, documented, typed cast, only in this dev-only E2E instrument, never in product code. This is
a genuine correctness improvement to the SHARED `capturePixels` instrument itself (used by
`regression.mjs`/`filter-panel.mjs` too, not only `style.mjs`) -- every prior E2E capture had simply
never been fast enough, relative to a natural animation frame, to expose this gap; `flush()` was the
first caller to remove that accidental margin.

**Belt-and-suspenders, not redundant:** `e2e/style.mjs` ALSO gained `waitForFreshLayerUpdate`
(polls for a NEW `[render-trace] layers` console line -- logged on every `render()` call,
`traceLayerUpdate` -- after each input change, before capturing) -- this guards a DIFFERENT gap
(`pre.style-document`'s text updates synchronously with React's commit of the `style` STATE;
`WorkingCanvas`'s own passive `useEffect([style])`, which is what actually updates
`drawParamsRef.current`, is scheduled to run AFTER that commit, on a separate schedule). Both fixes
are kept: `layerManager.updateLayers()` is the real, product-level correctness fix; the E2E wait is
additional defense-in-depth against a race this piece did not fully rule out (given passive effects
are asynchronous relative to commit by React's own design, not merely by observation).

## S1 — `buildLayers.ts` comment corrected (deck.gl 9.3.9, and the `setConstantValue` claim was wrong)

`@deck.gl/core@9.3.7` -> `9.3.9` (checked directly: `package-lock.json` and the installed
`node_modules/@deck.gl/core/package.json`, both say `9.3.9` -- named as read, not carried over from
an earlier citation), at both sites in this file (the prop-diff paragraph and the polygon-normalizer
comment).

The `setConstantValue`/`_hasConstantBufferValue` half of the prop-diff paragraph was wrong, per the
piece's own citation, verified directly against the installed source (`lib/attribute/attribute.js`,
`lib/attribute/attribute-manager.js`, `lib/attribute/data-column.js`) rather than trusted blind:
`_hasConstantBufferValue` is reached ONLY from `setConstantBufferValue`, which `setConstantValue`
calls ONLY when `device.type === 'webgpu'` -- and even there it is NOT O(1), it walks
`numInstances * size` elements of the fully-expanded emulated buffer. This canvas is WebGL2
(`WorkingCanvas.tsx`'s own `canvas.getContext("webgl2")`), which never reaches either function:
`setConstantValue` on that path calls `DataColumn.setData({constant: true, value})` directly, whose
OWN internal check (`_areValuesEqual` -- a different function, element-wise over `this.size`, e.g. 4
iterations for RGBA, genuinely independent of feature/vertex count) is what actually skips a
redundant upload. `_areValuesEqual` is ALSO a value comparison (not a reference one), exactly like
`compareProps`'s own `deepEqual` above it in the same paragraph -- so the comment's corrected
conclusion is stronger than the original, not just fixed: reference stability is not load-bearing at
ANY layer this render path actually reaches (every check between here and the GPU compares VALUES),
not merely "the smaller one" as the old text implied.

## S2 — the vacuous "issues no viewport query" test replaced with a compile-time assertion

The deleted test built a `manager`-shaped mock (`requestViewport`/`cancelStream`) and asserted
neither was called -- but never passed `manager` to `applyStyleChange` at all, so the assertion could
not fail regardless of what the function did. Replaced with the piece's own preferred option: a
compile-time assertion. `ApplyStyleChangeDeps` (previously an inline object type) is now a named,
exported interface in `WorkingCanvas.tsx`; `WorkingCanvas.test.ts` gained a module-scope
`AssertExactKeys<T, U>` type (mutual-assignability via the `[T] extends [U] ? ... : never`
tuple-wrapping trick) and a `const _applyStyleChangeDepsHasExactlySetDrawParamsAndRender:
AssertExactKeys<keyof ApplyStyleChangeDeps, "setDrawParams" | "render"> = true;` -- if the interface
ever gained a `manager`/`viewport`/`requestViewport` member, this assignment fails to typecheck.

**Verified the assertion actually catches a widening, not merely asserted to** (this piece's own
standing discipline): temporarily added a `manager?: unknown` member to `ApplyStyleChangeDeps`,
confirmed `npm run typecheck` failed with `error TS2322: Type 'true' is not assignable to type
'false'` at exactly the assertion line, then reverted and confirmed clean again.

## S3 — the Rust fixture's "verbatim bytes" claim is now actually true

`renderer/tests/data/shell-emitted-styles.json` regenerated (same disposable-generator convention:
a throwaway vitest test importing the shell's real `document.ts::toStyleDocument`/
`DEFAULT_STYLE_STATE`, run once, output hand-verified, deleted before commit) to hold
`default_document`/`changed_document` as JSON STRINGS containing the exact COMPACT
`JSON.stringify(doc)` text -- the bytes `document.ts::resolveDrawParameters` itself feeds to
`Style.parse` on the real live-render path (never pretty-printed; `StylePanel.tsx`'s own visible
`<pre>` text is a different, display-only call site). `style_shell_agreement.rs` now reads
`v[key].as_str()` directly and hands that string UNCHANGED to `parse`/`compile` -- no
`serde_json::to_string` round trip in between. The previous nested-object fixture forced a
re-serialization through `serde_json::Value`'s own `Map` (sorted unless the `preserve_order` feature
is enabled), whose key order was never provably the shell's own insertion order -- so the old
comment's "verbatim bytes" claim was not actually being tested; this shape closes that gap
structurally (there is no serialization step left for a difference to hide in), the piece's own
preferred, stronger fix over merely correcting the comment's wording.

## NITS

1. **CUT-STATE P6's ambiguous fresh-vs-attached sentence** (this file, P6 section, "Fresh E2E
   confirmation" -- the ledger note read as contradicting "each on its own freshly-launched" a few
   lines above it): one clarifying paragraph added in place, disambiguating that `style.mjs` DID
   launch fresh (nothing was left running for it to attach to, per the port-kill discipline stated
   just above it) -- "attached to (not relaunched by)" describes the state AS OF WRITING the note
   (a later reader finding the port already up should attach, not relaunch), not a claim about what
   `style.mjs` itself did internally when it started.
2. **The opacity step 0.01 vs. `DEFAULT_STYLE_STATE.fillOpacity` (180/255 = 0.70588235...) thumb-snap
   cosmetic:** left the code as-is (`step={0.01}` is `NEXT-CUT.md`'s own literal instruction, the
   snap is imperceptible in the rendered fill) and added a one-line JSX comment in `StylePanel.tsx`
   naming it, so a future reader sees the FIRST-DRAG visual jump is understood, not an oversight.

## Verify -- all three required commands, tails

```
$ cd frontends/shell && npm run verify
tsc --noEmit -- clean
vite build -- built in 3.69s
Test Files  24 passed (24)
     Tests  232 passed (232)
```
232 = 223 (P6 baseline) + 10 new `coalesceOncePerFrame.test.ts` tests (6 `schedule`/`cancel` + 4
`flush`) - 1 (`WorkingCanvas.test.ts`'s deleted vacuous test, S2). Confirmed both directly:
`npx vitest run src/canvas/coalesceOncePerFrame.test.ts` -> 10 passed;
`WorkingCanvas.test.ts` -> 5 passed (was 6).

```
$ cd renderer/bundle-viewer && npm run verify
tsc --noEmit -- clean
build -- dist/app.js 432.5kb, done
node --test -- tests 52, pass 52, fail 0
```
Unaffected by this piece (no `renderer/bundle-viewer` or `renderer/style-ts` source touched) -- run
anyway per the piece's own required verify list, confirming B1's CI-filter fix watches the right
thing without having actually changed the code it watches.

```
$ cargo test -p spatial-renderer
lib: 30 passed
style_agreement.rs: 1 passed
style_shell_agreement.rs: 1 passed  (shell_emitted_documents_are_accepted_by_the_publish_side_grammar)
```
32 total, unchanged count from P6 -- S3 changed HOW the fixture proves its claim, not how many tests
exist.

## E2E -- three suite tables, each a genuinely fresh, port-killed, standalone instance

**Every run below: `taskkill /T /F` on the app's root PID, `netstat` confirmed no `LISTENING` socket
on 9223/5180 (TIME_WAIT entries from the just-killed session are expected and harmless), THEN a
fresh launch -- no chaining, per the P4/P5 session-chaining fragility this file's own earlier section
already disclosed.** Two of the three suites needed a real fix cycle before reaching this state (S5's
own section above has the full account); the tables below are the FINAL, passing runs, against the
truly final code (post duplicate-key fix, post `layerManager.updateLayers()` fix) -- superseded
intermediate FAILs are not reproduced here, only in S5's own narrative above, by design (disclosed
findings, not buried retries).

```
node e2e/regression.mjs    -- 12/12 PASS (A1'..A9' incl. hover, B2'/B3', C2'/C3', OVERCEIL', REOPEN', NET' info-only)
node e2e/filter-panel.mjs  -- 6/6  PASS (OPEN, PANEL', PANELREFUSE', CLEAR', SLOW'/CANCEL', FIND')
node e2e/style.mjs         -- 6/6  PASS (OPEN, STYLE', OPACITY', OUTLINE', DOC', RESET')
```

`A9'` (hover, S4's own layout change bearing most directly on it): `"hovered a verified
non-background pixel (buffer 639,77, flipY=true, css 639.5,704.7) after 1 attempt(s) -> \"id 49771 @
(2600112.152, 1206300.000)\"; moved to emptiest cell (#0, 0.0%) -> hover-readout gone"`. `PANEL'`
(the exact step that flaked under the OLD P4/P5-era session-chaining, re-verified clean standalone
here): `"unfiltered 21.8% non-bg, filtered 1.6% non-bg"`. `STYLE'` (post-fix, the step that
deterministically failed three times before the root-cause fix): `"baseline dominant 47,94,172,180;
... dominant non-bg bin EXACTLY \"204,34,0,255\""`.

Ledgers: `frontends/shell/e2e/out/regression-render-trace-1786819418353.json`,
`frontends/shell/e2e/out/filter-panel-render-trace-1786819516472.json`,
`frontends/shell/e2e/out/style-render-trace-1786819236324.json`. Instance left running on CDP port
9223 afterward (never stopped, per every script's own policy).

## Deviations from the piece as declared

1. **S4/S5 required real debugging beyond the piece's own literal description**, disclosed in full
   under S5's own section above rather than silently only reporting the final green state: the first
   `style.mjs` run after S5 failed deterministically (not a flake -- reproduced 3 times identically
   before the root-cause fix), traced to a genuine deck.gl GPU-buffer-sync gap the coalescing change
   exposed (verified against the installed source, not assumed), plus one independently real bug (a
   duplicate React key) found along the way and fixed regardless of its relevance to the main flake.
2. **The compile-time assertion technique (S2)** is new to this codebase (no prior `AssertExactKeys`-
   style pattern existed) -- verified to actually catch a widening via a temporary mutation, per this
   piece's own standing "verified, not assumed" discipline, disclosed as a deliberate extra step
   beyond what the piece's own instruction required.
3. Two OTHER stale `@deck.gl/core@9.3.7` citations exist in this tree (`WorkingCanvas.tsx`'s own
   `initialViewState` doc comment and `onAfterRender`-null-check comment, plus one in `limits.ts`) --
   left untouched, out of scope: the piece's own S1 citation named `buildLayers.ts` specifically, and
   fixing those two would mean re-verifying THEIR OWN cited behavior against 9.3.9 too (a different,
   unrelated claim each), not a one-line version-number swap.
4. Everything else matches the piece as declared: B1's three workflow files, S1's two corrections,
   S2's replacement test, S3's raw-string fixture, S4's move + remeasurement + `style.mjs`
   simplification, S5's coalescing + its own real-bug fixes, both NITS.

## State left for this piece, before commit

```
$ git status --porcelain
 M .github/workflows/product-ci-rust.yml
 M .github/workflows/product-ci-shell.yml
 M .github/workflows/product-ci-viewer.yml
 M frontends/shell/e2e/README.md
 M frontends/shell/e2e/style.mjs
 M frontends/shell/src/App.tsx
 M frontends/shell/src/canvas/WorkingCanvas.test.ts
 M frontends/shell/src/canvas/WorkingCanvas.tsx
 M frontends/shell/src/canvas/buildLayers.ts
 M frontends/shell/src/style/StylePanel.tsx
 M frontends/shell/src/styles.css
 M renderer/tests/data/shell-emitted-styles.json
 M renderer/tests/style_shell_agreement.rs
?? CUT-STATE-import-layout.md
?? CUT-STATE.md
?? E2E-STATE.md
?? NEXT-CUT.md
?? NIGHT-STATE.md
?? frontends/shell/src/canvas/coalesceOncePerFrame.test.ts
?? frontends/shell/src/canvas/coalesceOncePerFrame.ts
```
`CUT-STATE.md` (this file) stays untracked, edited in place; `NEXT-CUT.md` untouched.

**Next piece:** MANUAL-WALKTHROUGH Part F, operator run, PR -- the custodian's own remaining scope,
not this piece's.

---

# style-panel cut -- P7-doc (MANUAL-WALKTHROUGH Part F only)

Branch `cut/style-panel`, starting HEAD `f0c3b7a`. Piece scope: `frontends/shell/MANUAL-WALKTHROUGH.md`
Part F ONLY -- not the operator run, not the PR (both remain the custodian's own scope). One commit,
`git -c user.name=chris -c user.email=chrys92d@gmail.com commit -s`.

## What every expected string was checked against

Every literal quoted in Part F was verified against source before writing, not paraphrased:

- **Disclosure text/aria state** (`▸ Style` / `▾ Style`, `aria-expanded`), **control labels** ("Fill
  colour", "Fill opacity", "Outline colour", "Outline width"), **"Reset to default"** -- all read
  directly off `frontends/shell/src/style/StylePanel.tsx` (current tree, `f0c3b7a`).
- **The document's exact shape and DEFAULT_STYLE_STATE's own numbers** -- read off
  `frontends/shell/src/style/document.ts`, then independently reproduced by actually running
  `toStyleDocument`'s own logic (normalizeColor/clamp) in `node` against `DEFAULT_STYLE_STATE`'s
  literal fields, rather than hand-computing `180/255`. Confirmed output:
  `{"style_version":1,"layer":{"geometry":"polygon","fill_color":{"literal":"#4285f4"},"fill_opacity":
  {"literal":0.7058823529411765},"outline_color":{"literal":"#000000"},"outline_width":{"literal":0}}}`
  (compact -- the bytes `resolveDrawParameters` actually feeds `Style.parse`; the panel's own `<pre>`
  pretty-prints the same document with `JSON.stringify(..., null, 2)`, both cited in Part F where each
  form is actually relevant: F5 talks about what the operator *reads*, F7 quotes the value round-tripped
  through a hand-saved file, which is whatever text the operator actually copies -- either serialization
  parses identically, so Part F does not force one over the other).
- **Panel placement** -- `frontends/shell/src/App.tsx` read in full (both the 1-908 and 909-1085
  ranges): `<StylePanel key={`style-${admitted.dataset}`} .../>` sits at line 1081, textually AFTER
  the `.canvas-container` `<div>` closes (line 1057) and AFTER `<FilterPanel>` (lines 896-928) --
  confirmed BELOW the canvas, matching S4's own doc comment at that JSX site (this file's own S4
  section, above) rather than assumed from the section title alone.
- **`publish-bundle`'s exact flag set** -- `kernel/src/bin/publish-bundle.rs` read in full (the module
  doc comment's own usage synopsis, then the actual `match a.as_str()` arg parser and the five
  `ok_or(...)` required-field checks below it) and cross-checked against `kernel/tests/publish_cli.rs`'s
  own real invocations (`VIEWER_LICENSE_ARGS`, `viewer_dir()`'s stub layout) for the shape a real
  passing command takes.
- **The bundle viewer's serve path** -- `renderer/bundle-viewer/scripts/serve-bundle.mjs` (usage
  comment: `node scripts/serve-bundle.mjs <bundle-dir> [port]`, and its own printed
  `serving ${root} at http://127.0.0.1:${port}/viewer/index.html` line, read verbatim) and
  `renderer/bundle-viewer/package.json` (no README.md exists in that directory -- checked by `ls`
  before relying on one).

## F7 verified end to end before being written down (not assumed)

Built `publish-bundle` (`cargo build -p spatial-kernel --bin publish-bundle`), wrote a style file at
`target/walkthrough-f7/my-style.json` holding `toStyleDocument(DEFAULT_STYLE_STATE)`'s own compact
JSON (computed in `node`, not hand-typed), then ran the publish command against real paths in two
passes:

1. **First pass**, `target/walkthrough-f7/bundle` as `--out` (a scratch destination, to prove the
   flag set works at all before committing to the exact doc-quoted paths) -- succeeded first try
   (`bundle rows 2000, partitions 1, style hash sha256:5bf6d77b...`).
2. **Second pass, the EXACT command Part F now prints** (`--data
   ...\target\fixtures\manual-walkthrough\filter-zoned.parquet`, `--style
   ...\target\my-style.json`, `--viewer ...\renderer\bundle-viewer\dist`, `--out
   ...\target\filter-zoned-styled`, `--approve filter-zoned-styled`, the same viewer-license/
   corresponding-source flags `kernel/tests/publish_cli.rs` uses) -- the first attempt against this
   exact form refused (`--out`'s parent, `target\published\`, did not exist -- `resolve_destination`
   refuses rather than creating a parent tree silently), which is WHY Part F's own `--out` is
   `target\filter-zoned-styled` directly (a child of `target/`, which always exists) rather than a
   nested `target\published\...` -- an operator pasting the walkthrough's command must not need an
   extra `mkdir` first. Re-run with that corrected path succeeded (`bundle rows 2000, partitions 1,
   style hash sha256:5bf6d77b...`, identical hash to pass 1 -- same style bytes, same fixture).
   `SPATIAL_IDE_AUDIT_LOG` was set to an isolated scratch path for BOTH verification passes (never
   the operator's own `%LOCALAPPDATA%` audit log) -- Part F's own printed command omits this env var
   deliberately, since a real operator publishing for real has no reason to redirect their own audit
   trail.

**Confirmed directly: `publish-bundle` itself writes `<out>/viewer/{index.html,app.js,NOTICE.txt}`**
(copied from `--viewer`'s own dir) -- an initial `cp -r` of the source viewer dir into the bundle's
own `viewer/` (defensive, before checking) produced a redundant nested `viewer/dist/` that was then
removed once this was confirmed; Part F names no such copy step because none is needed.

**Serve + load verified headlessly, twice** (once per pass above), each with `serve-bundle.mjs` on a
free port and a `curl` against `/viewer/index.html` (`200`) and `/manifest.json` (`200`, real bundle
JSON), then `renderer/bundle-viewer/scripts/run-acceptance.mjs` -- the project's own existing headless
Chromium driver -- pointed at the served URL. Both runs: `"verdict": "rendered-and-hover-resolved"`,
status `"1/1 partitions verified · 2000 features drawn, 0 outside the view"`, hover resolved 34/256
probe points, the one console error accounted for (`favicon.ico`, the driver's own named exception).
Artifacts: `target/walkthrough-f7/acceptance.json` (pass 1), `target/walkthrough-f7/acceptance2.json`
(pass 2, the exact-command bundle).

**What was NOT claimed:** the visual style match between the shell's canvas and the viewer's rendered
page -- `run-acceptance.mjs` reports DOM facts (status line, hover resolution, console errors), never
a pixel comparison against anything the shell rendered, and this piece's instructions are explicit
that F7's visual-match judgment stays the operator's alone. Nothing here substitutes for that.

**Cleanup:** the doc-quoted-path artifacts (`target/my-style.json`, `target/filter-zoned-styled/`)
were deleted after verification -- leaving them in place risked a later real operator run finding a
stale pre-existing bundle/style file at the exact path the walkthrough tells them to create fresh.
Both server processes (port 8732 for the exact-command bundle, port 8731 for the earlier scratch
bundle) were killed after their respective `curl`/acceptance checks. **One self-caught sequencing
slip, disclosed rather than silently dropped:** after cleanup, a third serve attempt was made on
port 8731 (the literal port number Part F's own command prints) against the already-deleted
`target/filter-zoned-styled/` -- a 404, from testing a stale path against my own prior cleanup, not
a defect in anything. Not re-verified with a fresh regenerate: the exact same command, bundle, and
serve mechanism were already fully verified (build + serve + headless `run-acceptance.mjs`) on port
8732 before cleanup; the port number itself is an arbitrary argument to a generic static file server
(`serve-bundle.mjs`'s own usage: `<bundle-dir> [port]`), not a fact that needed its own separate
proof.
**Kept, named clearly under `target/`:** `target/walkthrough-f7/` (the first-pass `bundle/`,
`my-style.json`, `acceptance.json`/`acceptance2.json`, `serve.log`/`serve2.log`,
`verify-audit.jsonl`/`verify-audit-2.jsonl`) -- this directory is the recorded verification evidence
for this piece, distinct from anything a real walkthrough run produces at the doc-quoted paths.
`target/` is gitignored in full (`.gitignore` line 2) -- none of this was ever a commit risk.

## Coverage table (`e2e/style.mjs` step IDs -> Part F steps)

Verified against `frontends/shell/e2e/style.mjs` itself (not paraphrased from CUT-STATE's own P6/
reviewer-gate prose, which was read too, for status/ledger citations only): `OPEN` -> F1, `STYLE'` ->
F2, `OPACITY'` -> F3 (indirectly -- it sets one discrete value, F3 is about a continuous drag),
`OUTLINE'` -> F4, `DOC'` -> F5, `RESET'` -> F6. F7 and F8 have no automated counterpart at all --
named as such in the walkthrough's own table (F7: "the entire round-trip... this is Part F's own
reason to exist as an operator-verified step"; F8 makes no independent claim of its own to cover).

## Deviations from the piece as declared

None material. One thing worth naming: F7's `--out` path was changed from a plausible nested
`target\published\...` (what a first draft would naturally write) to `target\filter-zoned-styled`
directly under `target/`, BECAUSE actually running the command surfaced that `resolve_destination`
refuses when `--out`'s parent directory does not already exist -- exactly the kind of thing this
piece's own instruction ("VERIFY EVERY EXPECTED STRING... a paraphrase is a defect" / "VERIFY the F7
commands actually work before writing them down") exists to catch before an operator hits it live.

## State left for this piece, before commit

```
$ git status --porcelain
 M frontends/shell/MANUAL-WALKTHROUGH.md
?? CUT-STATE-import-layout.md
?? CUT-STATE.md
?? E2E-STATE.md
?? NEXT-CUT.md
?? NIGHT-STATE.md
```
`CUT-STATE.md` (this file) stays untracked, edited in place; `NEXT-CUT.md` untouched (the custodian's
own P7 operator-run/PR piece retires it, not this one).

**Next piece:** the operator run of the full walkthrough (Parts A-F) and the PR -- the custodian's own
remaining scope, not this piece's.

# CUT-STATE -- publish-cut, phases P0 / P1

Branch `cut/publish-ui`, stacked per `NEXT-CUT.md`'s merge order. Read `NEXT-CUT.md` and
`kernel/PERMISSION-BOUNDARY.md` in full before touching P2+ -- both are binding on this cut.

## P0 -- the honesty fix (kernel-only, its own commit)

`kernel/src/publish/error.rs`: new `PublishError::RowFilterNotRecordable` variant (no fields; message
names ADR-017 §8's two-shape `filter` grammar and that Corrigendum 3 spent the v1 schema exception).
`kernel/src/publish/mod.rs::preflight`: refuses with it as the **first** check, before license
admission or anything else -- `if req.query.filter.is_some() { return
Err(PublishError::RowFilterNotRecordable); }`. `kernel/src/permission/boundary.rs`: the two exhaustive
matches over `PublishError` (`error_kind`, `publish_outcome`) both extended; refusal classifies as
`Outcome::Refused` / `error_kind: "RowFilterNotRecordable"`, same bucket as `SourceNotPinned`.

**Where staging creation lives, verified rather than assumed**: `publish_unguarded` calls
`preflight(req)?` THEN `publish_prepared`, and `Staging::create` is inside `publish_prepared`
(mod.rs ~line 449), never reached if `preflight` returns `Err`. Same is true one level up through
`permission::boundary::execute`, whose own step 1 is `publish::preflight(req)?` before the audit log
is even opened -- so a filter-active publish through the gated path refuses before the intent record,
before any grant check, before any side effect.

### Tests added (`kernel/tests/publish.rs`)

Two new tests, using a REAL `AdmittedPredicate::admit("zone = 'residential'", &ds)` against the
`CategoricalZone` fixture (not a stub -- `unchecked_for_composition_test` is `pub(crate)` inside
`engine` and unreachable from `kernel`):
- `a_row_predicate_is_refused_before_any_staging_directory_exists` -- through `publish_unguarded`;
  asserts `PublishError::RowFilterNotRecordable`, message contains "ADR-017" and "bundle_version",
  destination absent, **no `.staging-*` directory anywhere under the workspace**.
- `the_refusal_is_in_preflight_itself_not_only_reachable_through_publish_unguarded` -- calls
  `spatial_kernel::publish::preflight` directly (dataset need not even be pinned for this one to
  prove the point, though the fixture used is pinned).

### Verify (P0)

```
cargo test -p spatial-kernel --test publish
test result: ok. 23 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 4.42s
```

### Commit

`c0ee2a9` -- "fix: preflight refuses a row-predicate publish at bundle_version 1 (ADR-017 §8)".

## P1 -- the host seam (F-5/F-6/F-9/F-2)

### 1. `ApprovalRoute::ShellDialog` (`kernel/src/permission/audit/record.rs`)

Third variant, `as_str() -> "shell-dialog"`. Value-domain widening within `spatial-audit/1` (schema
tag unchanged); dated no-external-readers justification + QUEUED-for-the-human note in the doc
comment, per `NEXT-CUT.md`'s Design/Audit paragraph. New pinning test
`shell_dialog_serializes_as_shell_dialog_and_the_key_set_is_unchanged` asserts BOTH the wire spelling
and that the outcome record's key set (the same 16 keys the existing
`both_shapes_declare_a_fixed_key_set_in_a_fixed_order` test pins) is unchanged by the third variant.

### 2. `ShellApproval` (`frontends/shell/src-tauri/src/publish.rs`)

Holds the already-typed phrase; `respond()` never blocks (`Ok(Approval::new(self.0.clone()))`
unconditionally -- F-6, the wait happened in the DOM before this Rust code ever runs); `route()`
returns `ApprovalRoute::ShellDialog`.

### 3. The pending-attempt store (`PendingAttempts`, same file)

- **Id**: `mint_attempt_id()` -- 16 bytes from `getrandom::fill`, `hex::encode` -> 32 hex chars.
  Same crates/reasoning as `protocol/data-plane/src/session.rs::mint_token`, half the length (this id
  is a host-only lookup key, never a bearer credential on the wire).
- **TTL**: `PENDING_ATTEMPT_TTL = Duration::from_secs(120)`, declared with an ADR-010 rule 6 comment.
  The grant minted alongside an attempt uses the SAME value as its own lifetime (not the 20-minute
  `MAX_GRANT_LIFETIME` ceiling), so grant and pending-attempt expire together.
- **Single-use**: `take()` removes-and-returns atomically under the store's own `Mutex`; a second
  `take` on the same id always sees `None` -- there is no peek/read-without-consume path.
- **Storage**: `Mutex<HashMap<String, PendingAttempt>>`, `PendingAttempt` holding an owned
  `Arc<Dataset>` + everything else `PublishRequest` needs, reconstructed inside `execute` from owned
  fields (never borrows across the prepare/execute boundary).
- Lives in Tauri managed state as `Arc<PendingAttempts>`; a SEPARATE `Arc<Mutex<GrantSet>>` is also
  managed state (NEXT-CUT.md's Design section says grants live in `Mutex<GrantSet>` in managed state
  -- implemented literally, not embedded per-attempt). Both die with the process; nothing persisted.

### 4. `binding_publish_prepare` / `binding_publish_execute` (`commands.rs`, `lib.rs`)

`prepare()`/`execute()` are pure Rust functions in `publish.rs` (testable without a webview); the
Tauri commands are thin wrappers supplying `AppHandle` (native picker) and `State`. Native picker:
`app.dialog().file().set_file_name(&default_name).save_file(...)` -- a SAVE dialog (types a new
bundle name in an existing folder), not a folder picker, matching "publish to a not-yet-existing
directory" (`DestinationExists` refuses an existing one). Cancelling the picker ->
`PrepareOutcome::PickerCancelled`, not a refusal, not an error, nothing minted or stashed.

`execute()` opens `AuditLog::open_for` freshly on every call (F-9, proven by test: two attempts,
different `SPATIAL_IDE_AUDIT_LOG` values, each attempt's own log holds exactly its own intent+outcome
pair and nothing of the other's). `publish_unguarded` is never referenced; both commands registered in
`lib.rs`'s `generate_handler!`.

### 5. Scope: exactly the two §8 shapes, `filter_active` disclosed as a 4th parameter (DEVIATION)

`PublishScope` (serde, `#[serde(tag="kind", rename_all="kebab-case")]`): `WholeFile` |
`ViewportBbox { bbox: JsBbox }` -- the bbox is a QUERY parameter (composed into `ViewportQuery`
inside `to_query()`, `filter: None` always), never a `SourceScope`/`DestinationScope` member; commented
at both the type and the query-composition site.

**Deviation, disclosed**: `binding_publish_prepare` takes a 4th parameter, `filter_active: bool`, not
in `NEXT-CUT.md`'s 3-parameter shorthand `(dataset_handle, style_doc, scope)`. Composing the
filter-scope sentence needs to know whether the shell's own active SQL filter (tracked in JS,
`App.tsx`'s `activeFilter`) would have applied -- P1 has no other way to see that fact, and the two
`scope` shapes cannot carry it without inventing a third shape ADR-017 §8 does not have. P1 wires the
mechanism (`FILTER_SCOPE_SENTENCE`, verbatim from `NEXT-CUT.md`'s conditional block item 3, shown
exactly when `filter_active` is true); P3 ("Publish affordance and scope") is what threads the real
UI state into this parameter. Verified by test
(`the_filter_scope_sentence_is_present_only_when_filter_active_is_true`).

### 6. Sole-caller scan extended to the shell crate (`frontends/shell/src-tauri/tests/sole_caller_scan.rs`)

Mirrors `kernel/tests/permission_boundary.rs`'s own scan (same two stated limits: line-oriented text
scan, says nothing about callers outside this crate's own source). Two tests: no line names
`publish_unguarded(`; and (new, not in the kernel suite) a presence check that `src/publish.rs` still
contains `boundary::execute(`, so the absence-scan cannot go vacuously green if a future refactor
deleted the real call. **Logic manually verified** (`grep -c "publish_unguarded(" src/*.rs` -> all
zero) and the file **type-checks clean** (`cargo check --test sole_caller_scan`); see the Verify
section below for why it was not RUN under `cargo test`.

### 7. A real bug found and fixed while writing the tests: attributes must be derived from the style

`prepare`/`execute` originally hardcoded `attributes: Vec::new()` (attribute-projection UI is a
`NEXT-CUT.md` non-goal). That is a different thing from "never publish any attribute": with zero
attributes, ANY style using a `match` (not merely some) refuses at `preflight` with
`StyleError::MatchColumnNotPublished` -- a universal, silent breakage of the feature, not a missing
convenience. Fixed with `style_attributes()` (`publish.rs`): parses the style document
(`spatial_renderer::style::parse`, schema-independent) and takes its `match_column()` if any --
**derivation, not selection**, so it does not reopen the non-goal. `spatial-renderer` added as a
direct dependency (`frontends/shell/src-tauri/Cargo.toml`) for `style::parse` +
`StyleDocument::match_column`. Caught by `a_second_execute_on_the_same_attempt_id_...` and
`a_successful_publish_is_audited_with_...` both refusing with `MatchColumnNotPublished` before the fix
(the shared `STYLE` test fixture uses a match on `zone`, same as `kernel/tests/publish.rs`'s own).

### Unit tests (`frontends/shell/src-tauri/src/publish.rs`, `#[cfg(test)] mod tests`)

All host-side, no webview, real (small, synthetic-viewer) fixtures via `spatial_engine::fixture`
(dev-dependency feature, `kernel/Cargo.toml`'s own precedent for enabling `fixture` outside the
engine crate):

| Test | Property |
|---|---|
| `a_second_execute_on_the_same_attempt_id_is_unknown_not_a_stale_approval` | single-use: 2nd `execute` with the SAME correct phrase -> `UnknownAttempt`, not a stale success/refusal |
| `a_pending_attempt_past_its_ttl_is_treated_as_unknown` | TTL: an attempt inserted with `created_at` backdated past `PENDING_ATTEMPT_TTL` is never returned by `take` |
| `a_successful_publish_is_audited_with_the_shell_dialog_route_and_a_fresh_log_per_attempt` | per-attempt `AuditLog::open_for` (F-9) + `approval_route: "shell-dialog"` on the real written outcome record, for TWO attempts pointed at two different log paths |
| `a_row_predicate_refuses_through_prepare_with_the_p0_message_and_stashes_nothing` | P0's refusal reached through `prepare`'s real code path (via `prepare_with_query`, injecting a real `AdmittedPredicate`); no pending attempt stashed |
| `the_filter_scope_sentence_is_present_only_when_filter_active_is_true` | the NEXT-CUT.md-verbatim sentence appears iff `filter_active` |
| `dataset_name_for_sanitizes_a_filename_stem` | a filename with spaces/parens sanitizes to `dataset_logical_uri`-admissible characters |

## Verify -- required commands, tails

```
cargo test -p spatial-kernel                      # all suites, tail
...
test result: ok. 89 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.03s   (lib)
test result: ok. 14 passed; 0 failed; 0 ignored; ...   (permission_boundary.rs)
test result: ok. 23 passed; 0 failed; 0 ignored; ...   (publish.rs)
test result: ok. 9 passed; 0 failed; 0 ignored; ...    (publish_cli.rs)
...every other suite: 0 failed, 0 measured...
```
Every non-`#[ignore]`d test in the workspace's kernel crate passes; zero failures.

```
cd frontends/shell/src-tauri && cargo check       # tail
    Checking spatial-ide-shell v0.1.0 (...)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 4.21s
```

```
cd frontends/shell && npm run verify              # tail
 Test Files  24 passed (24)
      Tests  232 passed (232)
```
Nothing TS changed in P0/P1; this confirms the invoke surface's growth (two new commands registered)
breaks nothing existing.

```
cd frontends/shell/src-tauri && cargo test --lib   # the shell crate's own new unit tests
running 6 tests
test publish::tests::a_pending_attempt_past_its_ttl_is_treated_as_unknown ... ok
test publish::tests::the_filter_scope_sentence_is_present_only_when_filter_active_is_true ... ok
test publish::tests::dataset_name_for_sanitizes_a_filename_stem ... ok
test publish::tests::a_row_predicate_refuses_through_prepare_with_the_p0_message_and_stashes_nothing ... ok
test publish::tests::a_second_execute_on_the_same_attempt_id_is_unknown_not_a_stale_approval ... ok
test publish::tests::a_successful_publish_is_audited_with_the_shell_dialog_route_and_a_fresh_log_per_attempt ... ok
test result: ok. 6 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.91s
```

```
cd frontends/shell/src-tauri && cargo check --tests   # typechecks tests/sole_caller_scan.rs too
    Checking spatial-ide-shell v0.1.0 (...)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 3.90s
```

### `sole_caller_scan.rs` was NOT run under `cargo test` -- environment constraint, disclosed

A live `cargo run`/`tauri dev` session (not started by this piece; already running when this piece
began, confirmed by its command line and by `npm run tauri dev`/`vite`/`serve-bundle.mjs` sibling
processes) holds `frontends/shell/src-tauri/target/debug/spatial-ide-shell.exe` open for the whole
life of this piece -- Windows will not let `cargo test`'s link step overwrite a running executable's
image file (`Access is denied`, os error 5), and the session auto-restarts on every source edit (a
file watcher), so waiting it out during active editing never resolves it. **The process was not
touched** -- killing another session's live app to unblock a test run is exactly the kind of
disruptive, unauthorized action the custodian rules caution against, and there is no way from inside
this piece to know whether it is a human's manual-walkthrough session.

Two isolated-`CARGO_TARGET_DIR` workarounds were tried and both failed for environment reasons, not
code reasons: a deep path under the OS temp directory hit `duckdb-sys`'s C++ build running into
Windows' `MAX_PATH` on nested include paths; a short path (`C:\cts`) exhausted the ~10 GB free on `C:`
partway through relinking `duckdb` (a full independent `duckdb`+`tauri`+`arrow` build is multiple GB).
Both attempts' output was cleaned up afterward (`rm -rf`) and are not left on disk.

**What stands in for running it**: `cargo check --tests` type-checks the file cleanly (would be a
compile error if the scan's own code were wrong); its assertion was independently confirmed by
`grep -c "publish_unguarded(" frontends/shell/src-tauri/src/*.rs` -> zero in every file; and its
presence-check counterpart assertion (`src/publish.rs` must contain `"boundary::execute("`) was
confirmed by direct reading of the committed file. **Owed**: an actual green run of
`cargo test --test sole_caller_scan`, first opportunity the shared target dir is not held by a live
process -- flag this to whoever runs P2+ or the reviewer gate.

## Deviations from the piece as declared

1. **`filter_active: bool` as a 4th parameter on `binding_publish_prepare`** -- see item 5 above.
   Disclosed, not silent; the two `scope` JSON shapes are exactly the ones `NEXT-CUT.md` specifies.
2. **Attribute derivation from the style (`style_attributes`)** -- not asked for by the piece text,
   added because the alternative (`attributes: Vec::new()` always) makes every non-literal style
   refuse to publish, which is a functional break the piece's own "the host seam" framing implies
   should work. Automatic, no selection surface -- does not reopen the "no attribute-projection UI"
   non-goal. New direct dependency: `spatial-renderer` in `frontends/shell/src-tauri/Cargo.toml`.
3. **`sole_caller_scan.rs` not run under `cargo test`** -- environment constraint, see above; every
   other required verify command ran and is green.
4. **Grant lifetime = `PENDING_ATTEMPT_TTL` (120 s), not `MAX_GRANT_LIFETIME` (20 min)** -- a design
   choice within "declare a lifetime", not a deviation from anything stated, but recorded here since
   it is a number nobody but this piece chose: the grant and the pending attempt it is minted beside
   expire together.
5. **Corresponding-source kind is `WrittenOffer`, not `Url`** (`bundled_viewer()`) -- this repository
   is not yet public (ADR-009 item 1's gate; `CLAUDE.md`'s "before any public code"), so a URL route
   would assert a durable public location that does not exist. Revisit when/if the repository goes
   public.
6. **`bundled_viewer()` resolves `renderer/bundle-viewer/dist` relative to `CARGO_MANIFEST_DIR`** --
   dev-tree-only; not wired into `tauri.conf.json`'s `bundle.resources`. Fine for `cargo tauri dev`
   and the manual walkthrough (P4/P5); a packaging gap for later, named rather than hidden.

## State left for this piece, before commit

```
$ git status --porcelain
 M frontends/shell/src-tauri/Cargo.lock
 M frontends/shell/src-tauri/Cargo.toml
 M frontends/shell/src-tauri/src/commands.rs
 M frontends/shell/src-tauri/src/lib.rs
 M kernel/src/permission/audit/record.rs
?? CUT-STATE-import-layout.md
?? CUT-STATE.md
?? E2E-STATE.md
?? NEXT-CUT.md
?? NIGHT-STATE.md
?? frontends/shell/src-tauri/src/publish.rs
?? frontends/shell/src-tauri/tests/
```
P0 already committed separately (`c0ee2a9`). This piece commits everything above as P1's own commit.
`CUT-STATE.md` stays untracked, edited in place. `NEXT-CUT.md` untouched.

**Next piece:** P2 -- the approval surface (DOM prompt from host data, empty confirmation, typed
refusals via `RefusalBlock`/`formatRefusal`, progress + cancel events). Whoever picks it up should
also get `sole_caller_scan.rs` a real green `cargo test` run once the shared target dir is free.

## P2 -- the approval surface + P3 -- the affordance + scope

Read `NEXT-CUT.md` and this file's own P0/P1 section in full first (both binding). `sole_caller_scan.rs`
got its owed green `cargo test` run at the top of this piece (no live process was holding the target
dir): `test result: ok. 2 passed; 0 failed`.

### P2 -- host side: progress + cancel (P1 left both at `None`/a throwaway token)

`publish.rs::execute` is now a thin wrapper over a new `execute_with_progress(grants, store,
attempt_id, typed_phrase, cancel: &CancelToken, progress: Option<&dyn PublishProgress>)`, kept
byte-identical in behaviour to P1's own `execute` (a throwaway token, no observer) so every P1 test
keeps calling it unchanged. `EventProgress<F>` is a `PublishProgress` that emits
`PUBLISH_PROGRESS_EVENT` (`"publish://progress"`) through a caller-supplied closure -- generic over
the closure rather than `tauri::AppHandle` directly, so it stays testable without a live webview
(mirrors P1's own "testable without a webview" discipline). Phases only (`PublishPhase::as_str()`
verbatim); `partition_written` and every other trait method stay at their no-op defaults.

`RunningPublishes` (new, sibling to `PendingAttempts`): `Mutex<HashMap<String, CancelToken>>`, keyed
by `attempt_id`, live only for the duration of one `binding_publish_execute` call --
`commands.rs::binding_publish_execute` mints a fresh `CancelToken`, inserts a clone into the registry
BEFORE `spawn_blocking` starts, and removes the entry UNCONDITIONALLY after the blocking task
completes (success, refusal, or a panicked join) so nothing lingers across attempts. New command
`binding_publish_cancel(attempt_id) -> bool`: `true` iff a running publish was found and cancelled,
`false` is not an error (already finished, or an id this registry never held). Both registered in
`lib.rs`; `Arc<RunningPublishes>` managed alongside the existing `Arc<PendingAttempts>`/
`Arc<Mutex<GrantSet>>`, dies with the process the same way.

New Rust unit tests (`publish.rs`): `execute_with_progress_emits_every_phase_reached_stamped_with_the_right_attempt_id`
(a real successful publish through a small fixture, asserting `writing-manifest` was reached and
every emitted event carries THIS attempt's own id) and
`running_publishes_cancel_is_a_lookup_not_an_error_on_a_miss` (insert/cancel/remove/miss semantics,
and that `cancel()` flips the SAME token object the registry holds a clone of).

### P2 -- the dialog (`src/publish/PublishDialog.tsx`)

**Every `PublishPromptData` field rendered, in this order** (verified against the file directly, not
recalled): header line `"{operation} — class {class} — {reversibility}"`; a `<dl>` with `Source`
(`source_name`), `Source content hash` (`source_content_hash`), `Style hash` (`style_hash`),
`Destination` (`destination_display`, the FULL string, never truncated), `Grantor` (`grantor` + a
cosmetic, non-ticking `" — grant remaining: {grant_remaining_s}s"` suffix -- the host's own number,
displayed once, never re-derived client-side; **no live countdown was built** -- the piece named it
optional and this piece took the simpler, honest static display), `Row scope` (`row_scope`); then,
when present, `filter_scope` in its own `role="alert"` block, visually distinct
(`.publish-dialog-filter-scope`, the same dark-red family `.canvas-refusal` uses). Below: the
confirmation instruction ("Type the destination's final path component to confirm." --
`confirmation_phrase` itself is never rendered as a copyable hint, only described), the phrase
input, Cancel/Publish buttons. While executing: a phase-text line (host progress, or "Publishing…"
before the first event) and a Cancel-publish button.

**Never-defaulted checklist, each with its enforcement:**

| Rule | Enforcement |
|---|---|
| Confirmation field starts empty | `useReducer`'s own initial state is `{kind:"confirming", phrase:""}` -- no code path anywhere assigns `prompt.confirmation_phrase` to it (grepped: `confirmation_phrase` is read exactly once, inside the instruction sentence's own word count is NOT even used -- the phrase itself never crosses into `phrase` state) |
| No JS comparison | `submitPublishAttempt(attemptId, typedPhrase, deps)`'s own signature has no `confirmationPhrase` parameter -- structurally nothing to compare against; `PublishDialog.test.ts`'s own test sends a phrase that does NOT match a hypothetical `confirmation_phrase` and asserts `execute` is still called with it verbatim, unblocked |
| Enable/disable on non-empty only | `disabled={state.phrase === ""}` on the Publish button -- no other condition; `handleSubmit`'s own guard is the identical `state.phrase === ""` check, never an equality against `confirmation_phrase` |
| Enter-on-empty inert | `handleKeyDown` calls the SAME `handleSubmit`, which returns before dispatching or calling `execute` when `state.phrase === ""` -- verified directly by the reducer test (`submit` on an empty phrase is a no-op) |
| No don't-ask-again | No checkbox, no `localStorage` read/write anywhere in `src/publish/` (grepped) |
| No remembered/standing approval | Every attempt is a fresh `attempt_id` from a fresh `binding_publish_prepare` call; `PublishDialog` only renders while `PublishPanelState.kind === "dialog"`, a state no code path re-enters without a NEW `prepare` round trip -- the component unmounts (JSX conditional, no `key` even needed) between attempts by construction |
| No default/last-used destination | `destination_display` is the **native OS save picker's own answer**, asked fresh on every `binding_publish_prepare` call (`commands.rs`) -- nothing client-side caches or pre-fills it |
| No pre-selected license values | `PublishRequest.license` is hardcoded `None` in both `prepare`/`execute` (P1) -- never exposed to this UI at all |
| ONE prompt, no retry loop | `nextPublishDialogState` has no transition back to `"confirming"` from `"executing"`/`"closed"`; a host refusal dispatches `settled` -> `"closed"` -> `PublishDialog` renders `null`; `PublishPanel`'s own `nextStateFromDialogSettled` never re-opens a dialog on a refusal, only on a fresh `"prompt"` outcome from a NEW `prepare` call |

Progress/cancel: `subscribePublishProgress` (`client.ts`) filters `publish://progress` events to this
`attemptId`; the executing-state phase text is host-sourced only (no duration word, no percentage).
Cancel-publish calls `publishCancel(attemptId)` (`binding_publish_cancel`) and marks the request made
(button label "Cancelling", disabled) -- the in-flight `execute()` call is still what actually settles
the dialog, via whatever `ExecuteOutcome` the cancelled `boundary::execute` returns.

### P3 -- the affordance (`src/publish/PublishPanel.tsx`)

Collapsed-by-default disclosure "▸ Publish" below `StylePanel` in `.app-main`'s flex column (App.tsx),
keyed `publish-${admitted.dataset}`. Expanded: a `Whole dataset`/`Current view` radio pair (default
`"current"` -- NEXT-CUT.md explicitly permits a default here since scope is not the approval; the
prompt restates whichever is chosen), the filter-scope sentence when `filterActive`, and one
`Publish…` button. `App.tsx` gained `hasSettledView` (a `useState` paired with the pre-existing
`lastViewportBboxRef`, flipped true on the FIRST `onViewportChanged` call per dataset, reset to false
alongside the ref in `admitAndResetStaleUiState`'s own `setLastViewportBbox` closure) -- render-time
signal only; the actual bbox at Publish-click time is always read fresh via a getter, never a
snapshotted value. `resolvePublishScope` decodes the SKP-wire (`HexF64`) bbox back to plain `f64`
(binding-local, not SKP) and returns `null` for `"current"` with no settled view -- defended a second
time even though the real Publish button is already disabled for that case.

Outcomes: `PickerCancelled` -> silent return to idle (`nextStateFromPrepareOutcome`); a refusal (from
either `prepare` or the dialog closing) -> `RefusalBlock` via `formatPublishRefusal` (a small adapter:
publish refusals are plain `{message}` text, no `code`/`fields` the way an `SkpError` carries them, so
`code` is the fixed label `"publish-refused"`, never confusable with a real `skp.*`/`engine.*` code);
success/succeeded-unaudited -> a quiet summary (destination, rows, partitions -- **`build_millis` is
on the wire type but deliberately never rendered anywhere**, the evidence guard rail: "no perf figure
anywhere ... the UI publish path is UNMEASURED and stays that way this cut"). `unknown-attempt` renders
as a refusal explaining nothing was authorized or denied.

`publishPrepare`/`publishExecute` E2E hooks (`e2e-test-surface.ts`) drive the SAME `runPrepare`/
`execute` functions the real UI calls -- `publishPrepare` registered in `PublishPanel`'s own effect,
`publishExecute` registered in `PublishDialog`'s own effect (only while a dialog is actually mounted,
mirroring `queryWithFilter`/`capturePixels`'s "only once there is something to drive" precedent). P4
is expected to be the first real driver.

### Layout, measured fresh (100k-happy-path fixture, 1280x800, killed every remnant first)

| State | `.canvas-container` top | height | width | Notes |
|---|---|---|---|---|
| Both `.style-panel`/`.publish-panel` collapsed | 578.2px | 200px (floor) | **1265px** | Total page content 813.75px > 800px viewport, purely from this panel's own third collapsed row -- `.app-main`'s scrollbar now appears even fully collapsed (previously only on expand). Canvas floor/functionality unaffected; disclosed in `styles.css`'s own `.publish-panel` comment, same accepted trade-off class `.style-panel`'s S4 history already established. Remaining budget before 800px was ~4px -- not shrinkable into. |
| `.publish-panel` expanded, `.style-panel` collapsed | 567.2px | 200px | 1265px | `.publish-panel` itself 146.97px expanded (no filter, "Current view" disabled+reason shown) |
| `.style-panel` expanded, `.publish-panel` collapsed | 552.2px | 200px | 1265px | Unchanged from the style-panel cut's own baseline |
| Both expanded | 296.2px (scrolled) | 200px | 1265px | Canvas HEIGHT still the floor in every combination measured |
| Both expanded, filter active | -- | 200px | 1265px | `.publish-panel` 206.97px (+60px over no-filter: the filter-scope-sentence block, the only thing that changed) |

Live-checked beyond the measurement script: after a real pan gesture, "Current view" becomes enabled
(no `disabled` attribute, no reason paragraph) and the Publish button enables; the filter-scope
sentence appears in the real DOM the moment `queryWithFilter` actually applies (confirmed against
`filter-zoned.parquet`, not the 100k fixture, which has no `zone` column -- an earlier attempt against
the wrong fixture returned `skp.filter_unknown_column`, a test-script mistake, not a code defect).

### E2E: one fresh `regression.mjs` + `style.mjs` run

First `regression.mjs` run: 11/12 PASS, `A8'` (16 alternating pan/zoom gestures, no settle waits, a
pre-existing stress/timing step unrelated to DOM layout) FAILed at 45011ms against its 45000ms budget.
Killed the process tree (`taskkill /T /F`), confirmed ports 9223/5180 down, ran fresh again:

```
Step       Status  Note
A1'        PASS
A3'        PASS
A4'        PASS
A5'/A6'    PASS
A7'        PASS
A8'        PASS    16 alternating pan/zoom gestures ... settled after=true; no refusal/banner; no too_many_pending_streams
A9'        PASS    hovered a verified non-background pixel ... hover-readout gone
B2'/B3'    PASS
C2'/C3'    PASS
OVERCEIL'  PASS
REOPEN'    PASS
NET'       INFO
```

12/12 clean on the second run (`A8'` had passed on two prior recorded runs elsewhere in this file's
own history, from an earlier cut, before any of this piece's changes existed) -- treated as
environment-timing flake, not a regression this piece caused (A8' does not touch DOM layout, and the
layout-sensitive `A9'` hover step passed on BOTH of this piece's own runs). Used as the canonical
evidence.

```
Step      Status  Note
OPEN      PASS    admitted; .style-panel mounted collapsed by default
STYLE'    PASS    dominant non-bg bin EXACTLY "204,34,0,255"
OPACITY'  PASS    dominant non-bg bin CHANGED
OUTLINE'  PASS    outline colour family appeared then disappeared
DOC'      PASS    pre.style-document matches the current controls exactly
RESET'    PASS    document + pixels back to DEFAULT_STYLE_STATE/baseline
```

Both suites left the app running afterward (same convention every prior E2E script in this tree
follows).

### Verify

```
cd frontends/shell/src-tauri && cargo check                          # clean, 1 disclosed dead_code allow on `execute`
cargo test --lib                                                     # 8 passed (6 P1 + 2 new)
cargo test --test sole_caller_scan                                   # 2 passed -- the owed P1 run, now green
cd frontends/shell && npm run typecheck && npm run build && npm run test
 Test Files  28 passed (28)
      Tests  266 passed (266)                                        # 232 baseline + 34 new
```
Production build clean (`npm run build`), confirming the dev-only E2E hooks compile out.

### Commits

`211e712` -- "feat: publish approval surface -- DOM prompt, progress events, cancel seam" (P2).
`8e7c2d3` -- "feat: publish affordance -- scope choice, filter-scope sentence, outcome panel" (P3).

### Deviations from the piece as declared

1. **`binding_publish_cancel` + `RunningPublishes`, not named as such in `NEXT-CUT.md`'s phase
   table** -- required by P2 item 3's own text ("wires to the CancelToken seam if present; if absent
   host-side, add the minimal token" -- P1 left none). Disclosed, minimal (a `Mutex<HashMap>`, no
   persistence, dies with the process like every other publish-seam state).
2. **`e2e-test-surface.ts`'s two hooks ship in different commits** (`publishExecute` with P2,
   `publishPrepare` with P3) despite `NEXT-CUT.md`'s own text bundling both under P3 item 1 --
   `PublishDialog.tsx` (P2's own file) calls `registerE2eHook("publishExecute", ...)`, which needs
   that key on `E2eTestSurface` to compile; splitting the interface addition along that real
   dependency, rather than shipping a compile-broken P2 commit, was judged the more honest choice.
3. **No live-ticking grant countdown** -- `NEXT-CUT.md` named it optional; this piece renders
   `grant_remaining_s` once, statically, never re-derived or ticked client-side.
4. **`build_millis` never rendered** -- present on the wire type, excluded from every renderer
   (`PublishDialog`/`PublishPanel`) on the evidence guard rail's own words ("no perf figure
   anywhere").
5. **Layout**: adding this panel's own collapsed row pushes total page content ~14px past the 800px
   viewport even with EVERY panel collapsed, narrowing `.canvas-container` by ~15px width (not
   height) -- measured, disclosed in `styles.css`'s own comment and above, not silently absorbed.
   Canvas height (the 200px floor) and both E2E suites' own pixel-fraction thresholds are unaffected.
6. **`A8'` regression step failed once, then passed clean on an immediate fresh re-run** -- treated as
   a pre-existing environment-timing flake (unrelated to DOM layout, which `A9'` covers and which
   passed both times), not chased further; the clean second run is this piece's own canonical
   evidence.

### State left for this piece, after both commits

```
$ git status --porcelain
?? CUT-STATE-import-layout.md
?? CUT-STATE.md
?? E2E-STATE.md
?? NEXT-CUT.md
?? NIGHT-STATE.md
```
Working tree clean of any tracked-file changes; both commits (`211e712`, `8e7c2d3`) already contain
everything. `CUT-STATE.md` stays untracked, edited in place. `NEXT-CUT.md` untouched. The app launched
by the second `regression.mjs` run is left running on CDP port 9223 (same convention every prior E2E
script in this tree follows) -- not this piece's to stop.

**Next piece:** P4 -- evidence (unit + TS unit + E2E for the approved/refused/filter-active paths) +
ADR-024 filed, then P5's reviewer gate. The full publish E2E (approved path with a real bundle,
refused path, filter-active path) is P4's, not built here.

## P4 -- evidence: `e2e/publish.mjs`, the dev-only destination test seam, ADR-024, two real bugs
## found and fixed along the way

Read `NEXT-CUT.md` and this file's own P0-P3 sections in full first (all binding). P1/P2's own
unit/TS-unit evidence (`the_second_execute...`, `a_pending_attempt_past_its_ttl...`,
`shell_dialog_serializes_as_shell_dialog...`, `both_shapes_declare_a_fixed_key_set...`, the shell
`sole_caller_scan.rs` pair, P0's refusal test, `PublishDialog.test.ts`'s structural
no-JS-comparison proof, `PublishPanel.test.ts`'s outcome-branch coverage) was already discharged in
P1-P3 -- this piece's own scope, per its own text, is E2E + ADR-024 + running everything, not
rebuilding evidence P1-P3 already built.

### 1. The dev-only destination test seam (`binding_publish_prepare_e2e_destination`)

`binding_publish_prepare`'s native `save_file` dialog has no CDP-reachable automation path
(WebView2's own dialog chrome), and unlike admission -- where `binding_pick_file` and `open_dataset`
were already two separate commands `openPath` could split apart in pure JS -- publish's picker is
fused *inside* `binding_publish_prepare` itself. A new command,
`binding_publish_prepare_e2e_destination` (`commands.rs`), supplies `destination` directly and
otherwise calls the **identical** `publish::prepare` the real command calls -- same `preflight`,
same grant minted **host-side** from the supplied path (never from a JS-asserted grant; F-5 holds
through this seam exactly as it does for the real one).

**Compiled out of a release build, not merely runtime-gated**: `#[cfg(debug_assertions)]` on both
the command's own definition and its entry in `lib.rs`'s `generate_handler!` list. Verified against
`tauri-macros-2.6.3/src/command/handler.rs` directly (not assumed): `CommandDef::parse` calls
`Attribute::parse_outer` before the path, and the codegen applies `#(#attrs)* #command_name_macro
=> ...` per match arm -- a `cfg` attribute here genuinely removes the arm, the same guarantee
`npm run build` gives the JS-side `openPath` hook. Confirmed empirically too: `cargo check` (dev)
compiles the command; `cargo check --release` (11m47s cold, 15.6s warm after later edits) compiles
clean with debug_assertions false, i.e. the arm absent.

**Known, disclosed limitation** (the same one ADR-020 already named for this exact idiom in this
crate, `lib.rs`'s `webview_origin` selector): `tauri build --debug` retains `debug_assertions`, so a
packaged debug build would still carry this seam. Not exercised or closed by this piece.

JS side: `client.ts::publishPrepareWithDestination` (thin `invoke` wrapper);
`e2e-test-surface.ts`'s `E2eTestSurface.publishPrepareWithDestination` (dev-only, typed);
`PublishPanel.tsx::runPrepareWithDestination` (identical to `runPrepare` except it forwards
`destination` instead of asking the native picker) registered as an E2E hook alongside
`publishPrepare`, dataset-scoped.

**Documented limitation, stated plainly in the ADR and in `e2e/publish.mjs`'s own top comment: an
E2E run through this seam does not exercise the native picker itself -- only the operator's manual
walkthrough (P5) does.**

### 2. Bug 1 found writing the suite: nothing on the shell's own path ever pinned the dataset

The FIRST real run of `publish.mjs` (before any hook fix) refused every single `prepare` call with
`PublishError::SourceNotPinned` -- **not a test-seam artifact**: `publish::preflight` requires
`ds.content_pin().is_some()`, and grepping `frontends/shell/src-tauri/src/*.rs` outside
`#[cfg(test)]` found **zero** call sites of `Dataset::pin_content` anywhere on the shell's own
path. `kernel/src/bin/publish-bundle.rs`'s own `main()` pins explicitly, itself, before building
its `PublishRequest` -- the established pattern (pinning is a CALLER responsibility by design,
`preflight`'s own `SourceNotPinned` refusal exists because of it) -- and P1-P3's shared
`fixture()` test helper pins the dataset itself before ever calling `prepare`/`execute`, which is
exactly why no unit test had ever caught this: **every real publish attempt through the shell's
actual UI would have refused, for every dataset, always**, until this fix.

**Fix**: `publish::ensure_pinned(dataset, cancel)` (`publish.rs`) -- pins **once, idempotently**
(a no-op if `content_pin()` is already `Some`, since hashing is real, uncached IO/CPU work).
Called from both `binding_publish_prepare` and `binding_publish_prepare_e2e_destination`
(`commands.rs`), on `spawn_blocking` (never the async runtime's own worker thread -- the same
discipline `open_dataset`/`viewport_query` already use in this file), immediately before
`publish::prepare`. **Disclosed, not fixed here**: the pin phase has no cancel affordance or
progress report of its own during `binding_publish_prepare`'s "Preparing…" state -- fine for this
cut's own evidence fixtures (pins in well under a second), a real gap for a `docs/07`
hero-slice-scale (5 GB) publish through the shell UI, named in `ensure_pinned`'s own doc comment
rather than silently absorbed; building the cancellable/progress-reported version is design work
beyond this piece's evidence-and-ADR scope.

Two new Rust unit tests (`publish.rs`): `ensure_pinned_pins_an_unpinned_dataset_and_is_idempotent_on_an_already_pinned_one`
(a genuinely unpinned dataset -- deliberately NOT the shared `fixture()` helper, which is what hid
the bug -- pins on first call, second call leaves the hash unchanged) and
`prepare_on_an_unpinned_dataset_refuses_source_not_pinned_which_is_exactly_why_the_commands_must_pin_first`
(the regression itself, through `prepare`'s own real code path).

### 3. Bug 2 found writing the suite: `publishExecute`'s E2E hook was unreachable headlessly

After the pin fix, `APPROVED'`/`REFUSED'`/`FILTERED'` all failed identically:
`waitForHook: window.__SPATIAL_E2E__.publishExecute did not appear within 20000ms`. Root cause:
`PublishDialog` (which registered that hook, P2's own design) only renders inside
`PublishPanel.tsx`'s `{expanded && (...)}` block -- and `e2e/publish.mjs` drives every publish hook
headlessly, never clicking the "▸ Publish" disclosure toggle, so `expanded` stays `false` and
`PublishDialog` never mounts, so its effect never runs. This is a real, previously-unexercised gap
(P2/P3's own text: "P4 is expected to be the first real driver of this hook") -- not a defect in
`PublishDialog` for the real, expanded-first UI flow, but a structural coupling (a modal dialog's
presence gated on an unrelated disclosure's own collapse state) that made the hook unreachable any
other way.

**Fix, per the coordinator's own directed correction** ("the fix must follow the same-seam
doctrine: the hook drives the SAME applyPublish/execute function the dialog's submit drives,
registered dataset-scoped like prepare"): `publishExecute`'s E2E hook is now registered in
`PublishPanel.tsx`, in the SAME effect as `publishPrepare`/`publishPrepareWithDestination`
(dataset-scoped, unconditional on `expanded` or on `PublishDialog` mounting), removed entirely from
`PublishDialog.tsx` (avoiding a dual-registration/unregister conflict where either component's own
unmount would `delete` the other's still-active hook). `PublishPanel` tracks the current attempt in
a ref (`attemptIdRef`, synced from `state` via its own small effect) rather than closing over a
stale value, and the hook (`runExecute`) calls the exact same `client.ts::publishExecute` function
`<PublishDialog execute={publishExecute} .../>` passes as a prop, then the exact same
`handleDialogSettled` a real dialog's `onSettled` would call -- same function, same resulting state
transition, one caller more.

### 4. Bug 3 found writing the suite: the audit log's own `attempt` field is not the shell's `attempt_id`

After the hook fix, `APPROVED'`/`REFUSED'` still failed: `expected exactly 2 audit records for
attempt <shell attempt_id>, found 0`. The bundle had published and the refusal had refused
correctly (both assertions before the audit check passed) -- only the audit **read-back**
correlation was wrong. Root cause, found by reading the raw `.jsonl` file directly: `spatial-audit/1`'s
`attempt` field is minted **inside** `permission::boundary::execute` itself
(`kernel/src/publish/mod.rs::random_suffix`, a fresh 16-hex-char value every call) -- a different
identifier from the shell's own `PendingAttempts`-keyed `attempt_id` (32 hex,
`publish.rs::mint_attempt_id`), which is never written to the log and which the kernel's own
boundary has no reason to know about. Nothing on either side of the seam ever claimed the two were
the same value; the E2E script's own assumption was simply wrong.

**Fix**: `e2e/publish.mjs::readAuditRecordsForDestination` correlates by **destination** instead --
each scenario's `freshDestination()` call already produces a uniquely-timestamped, uniquely-random
parent directory, which the audit's own (normalized) `destination` field names verbatim. Finds the
intent record naming that destination, then the outcome record sharing *that record's own*
`attempt` value.

### 5. `e2e/publish.mjs` (new, sibling to `regression.mjs`/`filter.mjs`/`filter-panel.mjs`/`style.mjs`)

Drives `openPath` (admission) then `publishPrepareWithDestination`/`publishExecute`/`queryWithFilter`
-- hooks, not DOM, mirroring `filter.mjs`'s own style rather than `filter-panel.mjs`'s DOM-driven
one, since publish's own real affordance is gated behind the same `expanded` disclosure the hooks
already bypass by design. Steps, over ONE opened `filter-zoned.parquet` dataset (2 000 features,
`AttributeMode::CategoricalZone`), in this order (order matters: `FILTERED'` leaves `activeFilter`
set for the rest of the session, so it runs last):

- **`OPEN`** -- admits the fixture, waits for `publishPrepareWithDestination` to register.
- **`APPROVED'`** -- prepares a fresh `target/e2e-publish-out/approved-<ts>-<rand>/bundle`
  destination (whole-file scope); asserts `source_content_hash`/`style_hash` present,
  `confirmation_phrase` equals the destination's own basename, `destination_display` names it,
  `row_scope` reads whole-file, `filter_scope` is `null`; executes with the correct phrase; asserts
  `{status:"success"}`; runs `kernel/examples/verify-bundle.rs` (ADR-017 §14's conforming reader,
  built once up front via `buildVerifyBundleExample`, then invoked per scenario) against the real
  bundle and asserts `verified:true`; reads back the two audit lines for that destination and
  asserts `approval_route:"shell-dialog"`, a normalized destination (no backslash, no
  `C:\Users`/`C:/Users`), and no `CREDENTIAL_NEEDLES`-family substring anywhere in either record.
- **`REFUSED'`** -- prepares a second fresh destination; executes with a wrong phrase; asserts
  `{status:"refused"}`; asserts the destination directory does not exist and no `*.staging-*` entry
  exists under its own (private, freshly-created) parent; reads back the audit pair and asserts
  `outcome:"refused"`, `error_kind:"ApprovalRefused"`.
- **`EXPIRED'`** -- **SKIPPED, with a stated reason** (`NEXT-CUT.md` P4 explicitly permits this):
  `PENDING_ATTEMPT_TTL` (120 s, `publish.rs`) has no env/test-shortenable knob, and sleeping 120 real
  seconds for one E2E assertion is not cheap by this suite's own budget (every other step completes
  in well under a minute). The property is unit-tested instead, with no sleep
  (`publish.rs::tests::a_pending_attempt_past_its_ttl_is_treated_as_unknown`, backdated
  `created_at`), and that test runs as part of this piece's own required `cargo test --lib`.
- **`FILTERED'`** -- applies `zone = 'residential'` via `queryWithFilter` (the same seam a real
  `FilterPanel` Apply click drives); prepares whole-file scope; asserts `prompt.filter_scope` is
  the conditional-block sentence verbatim; executes; asserts the manifest's own
  `operation.filter === {"kind":"whole-file"}` AND `data.rows === 2000` (the FULL fixture, not the
  `zone='residential'` subset) -- both by the manifest's own claim and by `verify-bundle`'s
  independently-decoded row count from the real Arrow partitions, so the filter's non-leak is
  proven two ways, not merely asserted from the manifest that could itself be wrong.

**Fresh-instance requirement, built into the script, not left to operator discipline alone**:
`main()` refuses to proceed (`process.exitCode = 1`, no steps run) if `attachOrLaunch` attached to
an already-running instance rather than launching fresh -- audit-log determinism depends on the
app having inherited THIS process's own environment (`SPATIAL_IDE_AUDIT_LOG`, if the invoker set
one). `resolveAuditLogPath()` reads the override if set, else computes the real per-user default
(`%LOCALAPPDATA%\spatial-ide\audit\publish.jsonl` on Windows) -- correct either way, since the app
picks the identical default when the env var is absent.

`npm run e2e:publish` added (`package.json`). `e2e/README.md` gained a "Publish spec" section
mirroring every prior suite's own.

### Verify -- required commands, tails

```
cargo test -p spatial-kernel                                    # tail: all suites ok, 0 failed
```
(no kernel/ source changed this piece -- P0-P3's own tests, rerun for confirmation, all green;
skipped ignored/release-only measurement harnesses unchanged from prior runs)

```
cd frontends/shell/src-tauri && cargo test --lib
running 10 tests
test publish::tests::running_publishes_cancel_is_a_lookup_not_an_error_on_a_miss ... ok
test publish::tests::a_pending_attempt_past_its_ttl_is_treated_as_unknown ... ok
test publish::tests::prepare_on_an_unpinned_dataset_refuses_source_not_pinned_which_is_exactly_why_the_commands_must_pin_first ... ok
test publish::tests::ensure_pinned_pins_an_unpinned_dataset_and_is_idempotent_on_an_already_pinned_one ... ok
test publish::tests::the_filter_scope_sentence_is_present_only_when_filter_active_is_true ... ok
test publish::tests::dataset_name_for_sanitizes_a_filename_stem ... ok
test publish::tests::a_row_predicate_refuses_through_prepare_with_the_p0_message_and_stashes_nothing ... ok
test publish::tests::a_successful_publish_is_audited_with_the_shell_dialog_route_and_a_fresh_log_per_attempt ... ok
test publish::tests::execute_with_progress_emits_every_phase_reached_stamped_with_the_right_attempt_id ... ok
test publish::tests::a_second_execute_on_the_same_attempt_id_is_unknown_not_a_stale_approval ... ok
test result: ok. 10 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.69s
```
(8 pre-existing P1/P2 tests + 2 new this piece; a live remnant app held the target dir at the start
of this piece exactly as P1's own disclosed environment constraint predicted -- killed as an
expected "kill remnants" step, not a live human's session, per this piece's own explicit
instruction, and confirmed by its command line: a leftover `npx tauri dev --config
e2e/out/tauri.e2e.conf.json` process tree from an earlier E2E run)

```
cd frontends/shell/src-tauri && cargo test --test sole_caller_scan
running 2 tests
test the_shell_crates_own_publish_seam_calls_the_permission_boundary ... ok
test no_line_in_the_shell_crate_names_publish_unguarded ... ok
test result: ok. 2 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
```
(the owed-green-run history closes again here: genuinely green, no environment constraint this
time)

```
cd frontends/shell/src-tauri && cargo check --release
    Finished `release` profile [optimized] target(s) in 11m 47s   # cold
    Finished `release` profile [optimized] target(s) in 15.63s    # warm, after the pin-fix edit
```
(confirms the E2E test seam's `#[cfg(debug_assertions)]` gating compiles clean with the flag false,
i.e. the command is genuinely absent from this profile)

```
cd frontends/shell && npm run verify
Test Files  28 passed (28)
     Tests  266 passed (266)
```
(unchanged count from P3's own 266 -- this piece added no new TS unit tests, per its own declared
scope; `PublishPanel.test.ts`/`PublishDialog.test.ts`'s existing 14+11 already covered the pure
functions this piece's JS edits touch, and neither references the E2E hook wiring directly, so
none needed updating for the hook-registration fix)

### E2E -- three fresh, port-killed runs total for `publish.mjs` before a clean one (disclosed,
### not hidden -- two real defects found and fixed between them), plus one fresh `regression.mjs`
### confirmation

**`regression.mjs`**, fresh (remnants killed, ports confirmed down first): first run 11/12 (`A8'`
timed out at 45012ms against 45000ms, the same pre-existing timing-only flake P3's own CUT-STATE
section already recorded and treated as environment noise, not a regression -- unrelated to
anything this piece touched); killed, reran fresh: **12/12 clean**, used as canonical. Not rerun a
third time after this piece's later JS edits (`PublishPanel.tsx`/`PublishDialog.tsx`/
`e2e-test-surface.ts`) -- none of those touch admission, canvas, filter, or style, which is
everything `regression.mjs` exercises; reasoned rather than assumed.

**`publish.mjs`**, three fresh runs, each after killing remnants and confirming ports down:

1. **First run** (after the E2E seam + suite were written, before any bug fix): `OPEN` PASS;
   `APPROVED'`/`REFUSED'`/`FILTERED'` all FAIL identically on `SourceNotPinned` (Bug 1, §2 above).
2. **Second run** (after the pin fix): `OPEN` PASS; `APPROVED'`/`REFUSED'`/`FILTERED'` all FAIL
   identically on `waitForHook: ... publishExecute did not appear within 20000ms` (Bug 2, §3
   above) -- found and reported by the coordinator reading the artifacts while this piece was
   paused; fixed per the coordinator's own directed correction.
3. **Third run** (after the hook-registration fix): `OPEN` PASS; `APPROVED'`/`REFUSED'` FAIL on
   `expected exactly 2 audit records for attempt <id>, found 0` (Bug 3, §4 above) -- `FILTERED'`
   already PASSED this run (it makes no audit assertion). Fixed (destination-keyed correlation).
4. **Fourth run** (after the audit-correlation fix): **all four assertions PASS.** Verbatim:

```
[OPEN] PASS (104ms): admitted; window.__SPATIAL_E2E__.publishPrepareWithDestination now registered (dataset-scoped)
[APPROVED'] PASS (667ms): prepared+executed with attempt b0ab8b0640123d4dfefe3d9ac5637d8c; bundle verified (2000 rows, 1 partitions); 2 audit lines (intent+outcome success, approval_route shell-dialog, destination "C:/dev/spatial-ide/target/e2e-publish-out/approved-1786898151622-228975/bundle", no credential needle)
[REFUSED'] PASS (28ms): prepared with attempt 72ea5136dbb56596a222e761662d63aa, refused on the wrong phrase; no bundle directory, no .staging-* debris under C:\dev\spatial-ide\target\e2e-publish-out\refused-1786898152290-347067; audit pair intent+outcome refused, error_kind ApprovalRefused
[EXPIRED'] SKIP: no TTL-shortening env/test knob exists for PENDING_ATTEMPT_TTL (120s, publish.rs); ... (stated reason, §5 above)
[FILTERED'] PASS (595ms): filter-scope sentence present verbatim; manifest.operation.filter={"kind":"whole-file"}; bundle rows=2000 == full dataset (2000) both by the manifest's own claim and the reader's independent decode -- the filter did not leak
```

Exit code 0 (real exit code, captured without `tee` this run specifically to avoid a pipeline
exit-code mask that made the SECOND run's own failure look like a success when first read).
Raw audit log for this run (`e2e/out/publish-audit-e2e-4.jsonl`), the `APPROVED'` pair verbatim:

```json
{"schema":"spatial-audit/1","attempt":"968621a46d0f69e7","phase":"intent","at":"2026-08-16T16:35:51Z","operation":"publish-static-bundle","class":3,"reversibility":"irreversible","principal_kind":"os-user","principal_name":"Christopher","source_name":"filter-zoned","source_content_hash":"sha256:92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46","destination":"C:/dev/spatial-ide/target/e2e-publish-out/approved-1786898151622-228975/bundle","style_hash":"sha256:5bf6d77b677eb30c68650a87f76934b250b1ffd9d87005b6410f3f8e47c45aa7","residual_classes":["local-filesystem-path"]}
{"schema":"spatial-audit/1","attempt":"968621a46d0f69e7","phase":"outcome","at":"2026-08-16T16:35:51Z","outcome":"success","error_kind":null,"grantor_kind":"os-user","grantor_name":"Christopher","grant_lifetime_s":120,"grant_remaining_s":119,"approval_route":"shell-dialog","operation_digest":"sha256:d6bc077cae9519613ad4b86b5976dc08901890696fa6a8de8c466f53d1c91eee","manifest_hash":"sha256:b91bc347303669254bd753f34e40c3a3844ed6f9ea5fd0dde71ad3259ff0000b","rows":2000,"partitions":1,"residual_classes":[]}
```

`residual_classes: ["local-filesystem-path"]` on the intent record is correct and expected, not a
finding this piece treats as a failure: the destination is a real local path under
`target/e2e-publish-out/`, not under any known user-profile root, so `normalize_destination` cannot
tokenize it further and the log states its own residual leakage rather than hiding it -- exactly
`kernel/PERMISSION-BOUNDARY.md`'s own declared behavior for this class (only `credential` is fatal).
Used as this piece's canonical evidence.

### Deviations from the piece as declared

1. **Two real bugs found and fixed while building the evidence, both disclosed above (§2, §3-4)**
   -- `ensure_pinned` (a shell-path gap: nothing ever pinned a dataset before publish, so every real
   publish attempt through the shell's actual UI would have refused, always) and the
   `publishExecute` E2E hook's registration site (moved from `PublishDialog` to `PublishPanel`,
   dataset-scoped, per the coordinator's own directed correction after reading the first failed
   run). Neither was asked for by the piece text; both were necessary for the piece's own
   deliverable (a genuinely green `publish.mjs`) to be honest evidence rather than a suite that
   could never pass. Mirrors P1's own precedent (`style_attributes`, CUT-STATE's P1 section,
   deviation 2) for "a real bug found while writing the tests, fixed rather than merely noted."
2. **A third defect, in the E2E script's OWN code, not the product** (§4): `readAuditRecordsForAttempt`'s
   original design assumed the shell's `attempt_id` and the audit log's `attempt` field were the
   same identifier; they are not, by design, on both sides of the seam. Fixed by correlating on
   destination instead (`readAuditRecordsForDestination`). Named here because it is a mistake in
   THIS piece's own deliverable, not a product defect, and the distinction matters for whoever reads
   this section later.
3. **`EXPIRED'` is SKIPPED, not run**, per `NEXT-CUT.md` P4's own explicit permission ("cheap if the
   TTL seam permits shortening via env/test knob -- if not, skip with a stated reason"). No knob
   exists; adding one would touch P1's already-reviewed single-use/TTL design, out of this piece's
   scope. The property is unit-tested without a sleep (§5 above).
4. **The dev-only test seam is a new Tauri command** (`binding_publish_prepare_e2e_destination`),
   not a JS-only bypass like `openPath` -- necessary because publish's native picker is fused inside
   one command rather than being a separate one JS could simply skip, unlike admission's own shape.
   Documented at length in the command's own doc comment, `client.ts`, `e2e-test-surface.ts`,
   `e2e/README.md`, and ADR-024's own Decision section -- the same fact stated in five places
   deliberately, since it is the one property a reviewer of this cut must not miss.
5. **`kernel/PERMISSION-BOUNDARY.md` is NOT rewritten**, per the piece's own instruction -- a single
   pointer block was added at its top naming ADR-024 as the new home of record; every finding,
   ruling and section below that pointer is untouched.
6. **`docs/README.md`/`docs/02_Architecture.md` already carried a pre-existing gap this piece did
   NOT fix**: ADR-022 and ADR-023 (both filed by the style-panel cut) were never added to either
   index -- confirmed by grep, zero matches for either ADR number in `docs/README.md` or
   `docs/02_Architecture.md` before this piece's own edit. Only ADR-024's own entry was added to
   both, matching the piece's own instruction ("Proposed entries, matching ADR-022/023's style" --
   read as matching the ADR *files'* own header style, since the index style could not be matched
   from entries that do not exist). Flagged rather than silently fixed, since backfilling two other
   cuts' own index entries is a scope decision this piece does not own.
7. **`e2e/publish.mjs` does not use `waitForSettle`/pixel-fraction assertions** the way
   `filter.mjs`/`style.mjs` do -- publish's own correctness has nothing to do with rendered pixels,
   and the evidence guard rail names no perf claim anywhere; every assertion is functional
   (outcome shapes, file contents, audit records).

### State left for this piece, before commit

```
$ git status --porcelain
 M docs/02_Architecture.md
 M docs/README.md
 M frontends/shell/e2e/README.md
 M frontends/shell/package.json
 M frontends/shell/src-tauri/src/commands.rs
 M frontends/shell/src-tauri/src/lib.rs
 M frontends/shell/src-tauri/src/publish.rs
 M frontends/shell/src/e2e-test-surface.ts
 M frontends/shell/src/publish/PublishDialog.tsx
 M frontends/shell/src/publish/PublishPanel.tsx
 M frontends/shell/src/publish/client.ts
 M kernel/PERMISSION-BOUNDARY.md
?? CUT-STATE-import-layout.md
?? CUT-STATE.md
?? E2E-STATE.md
?? NEXT-CUT.md
?? NIGHT-STATE.md
?? docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md
?? frontends/shell/e2e/publish.mjs
```

Two commits, per the piece's own instruction: (1) e2e suite + test seam -- everything under
`frontends/shell/` above, new and modified; (2) ADR + index updates -- `docs/adr/ADR-024-...md`
(new), `docs/README.md`, `docs/02_Architecture.md`, `kernel/PERMISSION-BOUNDARY.md`.
`CUT-STATE.md`/`CUT-STATE-import-layout.md`/`E2E-STATE.md`/`NIGHT-STATE.md` stay untracked, edited
in place where relevant. `NEXT-CUT.md` untouched (deleted by the cut's own final docs commit, not
this piece's). The app launched by the fourth (clean) `publish.mjs` run is left running on CDP port
9223, same convention every prior E2E script in this tree follows -- not this piece's to stop.

**Next piece:** P5 -- reviewer over the cut, then MANUAL-WALKTHROUGH Part G + the operator run over
RustDesk (real picker, real dialog, real bundle in the viewer, audit file inspected by eye), then
the human's condition decision. Flag to the reviewer: the two real bugs this piece found and fixed
(§2-4 above) were both invisible to every unit test that existed before this piece, because both
depended on the REAL, ungated, host-side code path this piece's E2E suite is the first thing ever
to exercise end to end -- worth an explicit look at `ensure_pinned`'s call sites and at
`PublishPanel.tsx`'s hook-registration comment during review.

## P5-fixes -- reviewer gate over the publish cut: B1, B2, S1, S2, S5 fixed; the nit taken; S3/S4 named debt

Branch `cut/publish-ui`, starting HEAD `24e90d5`. Read the reviewer's own citations precisely
before touching anything -- every one checked out exactly as cited.

### B1 -- ADR-024 honesty: `confirmation_phrase` dropped from the wire, both false sentences corrected

**The finding was real**: `publish.rs`'s `PublishPromptData` DID serialize `confirmation_phrase`
(`types.ts` mirrored it), and `PublishDialog.tsx` rendered 11 of its (then) 12 fields, never the
phrase -- so ADR-024's own claims "the phrase never crosses into JS at all" and "renders every
`PublishPromptData` field" were both false as written.

**Fix (a), structural**: `confirmation_phrase` is now dropped from `PublishPromptData` entirely
(`publish.rs`, `types.ts`) -- nothing ever rendered it, and the dialog's own instruction ("Type the
destination's final path component to confirm.") already tells the operator what to type without
it. `frontends/shell/src-tauri/src/publish.rs`'s own test helper (`prepared()`) and
`e2e/publish.mjs` (`stepApproved`/`stepFiltered`) both now derive the phrase they type from
`destination_display`'s own basename instead of reading a field that no longer exists.

**Fix (b), the corrected ADR sentences (verbatim, `docs/adr/ADR-024-...md`'s Decision section)**:

> **Approval: DOM, one comparison, in Rust.** `PublishDialog.tsx` renders `PublishPromptData`'s own
> informational fields verbatim, in a fixed order: `operation`/`class`/`reversibility` (the header
> line), `source_name`, `source_content_hash`, `style_hash`, `destination_display` (the full
> string, never truncated), `grantor` (with the host's own `grant_remaining_s`, shown once, never
> re-derived), `row_scope`, and — when present — `filter_scope`, in its own alert block. **No
> `confirmation_phrase` field exists on `PublishPromptData` at all, and this is corrected wording,
> not a restatement**: an earlier version of this seam carried one, serialized to JS but never
> rendered by anything, which made an earlier draft of this very sentence — "the phrase never
> crosses into JS" — literally false as written (`publish.rs`'s struct definition and `types.ts`'s
> mirror both declared it; only the dialog's own render list omitted it). Dropping the field
> (reviewer gate, publish cut B1) is what makes the claim true rather than aspirational: the host
> now has nothing to hand the page even if it wanted to. The dialog's own instruction tells the
> operator to type "the destination's final path component"; the typed value carries back to the
> host completely unexamined by this component — **the phrase never enters `submitPublishAttempt`
> at all, structurally**: that function's own signature has no parameter for an expected value to
> compare against, proven rather than merely observed by `PublishDialog.test.ts`. **A script —
> including `e2e/publish.mjs` itself — can still derive the expected phrase from
> `destination_display`'s own basename**, the same value a careful operator would read off the
> rendered `Destination` field; consistent with the limitation stated below, this is
> defence-in-depth against operator error, never a secret the host is withholding from anything
> capable of deriving it on its own.

Also fixed: every `PublishDialog.tsx`/`PublishDialog.test.ts` comment that referenced
`prompt.confirmation_phrase` as a real-but-avoided value (now: no such value exists anywhere to
compare against); `e2e/README.md`'s own "asserts every field... confirmation_phrase equal to..."
sentence (now describes the derivation, names the dropped field explicitly).

### B2 -- audit atomicity: the gate is now `static`, not per-`AuditLog`-instance

**The finding was real**: `AuditLog`'s own `gate: Mutex<()>` was per-instance, and this cut's own
per-attempt `AuditLog::open_for` (F-9) makes two live instances an ordinary case (two publish
attempts approved close together, each on its own `spawn_blocking` task) -- two instances, two
separate mutexes, no coordination between them, both able to interleave writes to the SAME file or
race a rotation at the size ceiling.

**Construction chosen**: `kernel/src/permission/audit/log.rs` gained
`static AUDIT_LOG_GATE: Mutex<()> = Mutex::new(());` (a genuine `const fn` static -- no
`OnceLock` needed) at module scope; `AuditLog` no longer carries its own `gate` field at all.
`append`'s own critical section locks `AUDIT_LOG_GATE` instead of `self.gate`; `open_for`'s
rotation check AND its own open-probe now run **inside** the same held gate (previously rotation
ran before any gate existed), so a rotation cannot race a concurrent write, and two `open_for`
calls near the ceiling cannot both rotate. Module doc comment corrected to state the construction
and why the old per-instance version was a real gap, not merely simplified.

New test: `log::tests::concurrent_audit_log_instances_never_interleave_a_line` -- twelve threads,
twelve concurrently-live `AuditLog` instances (`AuditLog::open_for` called fresh per thread,
mirroring the shell's own per-attempt pattern), one shared log file, each writing its own
intent+outcome pair; asserts exactly `2 × 12` lines and that every one parses as valid JSON (an
interleaved write corrupts a line rather than silently changing one's meaning, so a parse failure
is what a real race would have produced).

`kernel/PERMISSION-BOUNDARY.md` is **not rewritten** (its own "Append" row states the old,
per-instance-true bound and stays as the historical record) -- ADR-024's own F-9 paragraph gained a
new block stating the corrected bound and that it supersedes that row, per the coordinator's own
instruction.

### S1 -- the 64-grant ceiling: kernel gains two small, targeted methods; the shell calls both

**Checked first, per the instruction**: `GrantSet` (`kernel/src/permission/grant.rs`) exposed
`add`/`find`/`len`/`is_empty` and nothing else -- no `remove`, no `retain`. Confirmed by reading the
file directly, not assumed.

**Why pruning by expiry alone is not enough, found while designing the fix (not merely asserted)**:
`PublishGrant::new` reads `Instant::now()` internally with no injection seam, and the shell's own
`prepare_with_query` hardcodes a REAL 120-second grant lifetime (`PENDING_ATTEMPT_TTL`) -- so a fast
unit test of many sequential `prepare()` calls, none of them executed, can never observe natural
expiry within a reasonable test runtime. The reviewer's own wording named BOTH halves
("expired/**consumed**") for exactly this reason: an executed (or abandoned-and-refused) attempt's
grant is dead the instant its single use is spent, whether or not it would also expire naturally.

**Shape chosen -- two kernel methods, both new, both minimal, neither touching `add`/`find`'s own
signatures or any existing caller**:
- `GrantSet::prune_expired(&mut self, now: Instant)` -- removes every grant past its own declared
  lifetime; predicate is `!g.expired(now)`, the exact one `find` already applies, so pruning can
  never disagree with what a lookup would have refused anyway. Called by
  `publish.rs::prepare_with_query`, once, right before `held.add(grant)` -- mirrors
  `PendingAttempts::insert`'s own prune-on-insert precedent in the same file.
- `GrantSet::remove_matching(&mut self, facts: &OperationFacts) -> bool` -- removes every grant
  matching an attempt's own facts (operation + `scope_mismatch(facts).is_none()`), **ignoring
  expiry**: consumed is consumed either way. Called by `publish.rs::execute_with_progress` at
  **every** return path (an `AuditLog::open_for` refusal, or after `boundary::execute` itself
  returns, success or refused alike) -- the facts (`dataset_name`, `content_hash` read off the
  already-pinned dataset, the resolved destination) are captured once, right after
  `resolve_destination`, before anything below can early-return.

Both are additive kernel surface, sanctioned by the reviewer's own words ("if a kernel-side
retain() is clearly right instead, add it with its own unit test and a comment") -- `add`/`find`
and every existing caller (`publish-bundle`, `grant.rs`'s own pre-existing tests) are byte-for-byte
unchanged. The shell-side rebuild-from-`PendingAttempts` alternative was considered and set aside:
it would need `PublishGrant`'s own `granted_at` preserved exactly (re-minting loses the original
clock reading) and a new `PendingAttempts` iteration API, for no better outcome than the two
targeted methods above.

Four new kernel tests (`grant.rs`): `prune_expired_removes_only_grants_whose_lifetime_has_elapsed`;
`prune_expired_keeps_a_long_lived_set_under_the_ceiling_across_many_more_grants_than_it_holds` (70
short-lived adds, real sleeps, real time-based pruning); `remove_matching_evicts_exactly_the_consumed_grant_ignoring_expiry`;
`a_grant_removed_the_instant_its_attempt_is_consumed_never_grows_the_set_across_many_more_than_the_ceiling`
(`MAX_GRANTS * 10` add-then-consume cycles, zero sleeps, the set empty again after every one). One
new shell test, the reviewer's own required shape:
`publish::tests::seventy_sequential_prepare_execute_cycles_never_hit_the_grant_ceiling` -- 70 REAL
`prepare()`-then-`execute()` cycles against ONE shared `Mutex<GrantSet>`/`PendingAttempts` pair
(mirroring the shell's own managed-state lifetime), every one asserted `Success`; `MAX_GRANTS` is
64, so a 65th-or-later success is only possible because consumed grants stopped accumulating.

### S2 -- terminal-state wedges: both un-caught paths fixed, both extracted as testable top-level functions

`PublishPanel.tsx`'s `runPrepare`/`runPrepareWithDestination` `await`ed their own `invoke()` call
with no surrounding try/catch; `PublishDialog.tsx`'s `handleSubmit` called `.then(...)` with no
`.catch`. Either an IPC-level rejection (not this seam's own typed `{status:"refused"}` shape --
`invoke()`'s own failure mode when a Tauri command's `Result::Err` is a bare string) would unwind
past `setState`/`dispatch` entirely, wedging the panel in `"preparing"` or the dialog in
`"executing"` forever, with no refusal shown and no way to recover.

**Fixed by extracting a pure, top-level, exported catch-and-convert function in each file** --
mirroring `nextStateFromPrepareOutcome`/`submitPublishAttempt`'s own "extracted so it is testable
without a DOM" precedent already established in both files, rather than inlining a try/catch or a
`.catch()` directly in the component:
- `PublishPanel.tsx::settlePrepareOutcome(promise)` -- awaits, catches, returns a refused
  `PrepareOutcome` on rejection (`e instanceof Error ? e.message : String(e)`). `runPrepare`/
  `runPrepareWithDestination` now `await settlePrepareOutcome(...)` then `setState` unconditionally.
- `PublishDialog.tsx::settleExecuteOutcome(promise)` -- the same shape for `ExecuteOutcome`.
  `handleSubmit` now wraps `submitPublishAttempt(...)` in it before its own `.then`.

Both render through the exact SAME `RefusalBlock`/`onSettled` surfaces every typed refusal already
uses -- an IPC failure is now recoverable identically to a typed one, never a special case.

Six new unit tests (three per function, `PublishPanel.test.ts`/`PublishDialog.test.ts`): a resolved
promise passes through unchanged; a `Promise.reject(new Error(...))` resolves to
`{status:"refused", message: <the Error's own message>}` instead of rejecting; a
`Promise.reject("bare string")` (deliberately not an `Error` instance) resolves too, proving the
`String(e)` fallback.

### S5 -- `ensure_pinned`'s principle-7 gap, added to ADR-024's Consequences

New bullet, ADR-024's Consequences section, matching `publish.rs::ensure_pinned`'s own doc comment
in substance: the pin phase runs on `spawn_blocking` (so it does not block the whole app) but has
**no cancel affordance and no progress report of its own** during `binding_publish_prepare`'s
"Preparing…" state -- invisible on this cut's own small evidence fixtures, a real gap at
`docs/07` hero-slice scale (5 GB), where the same whole-file hash that is instant on 2 000-100 000
features becomes a multi-second-to-multi-minute uncancellable wait. Not built or closed here --
named, per the same discipline every other gap in this ADR already follows.

### The nit taken: the CLI's "This cannot be undone" sentence, now in the dialog too

`kernel/src/permission/approval.rs::ApprovalPrompt::render`'s own irreversibility sentence --
"This cannot be undone. Nothing here can remove a published bundle." -- verbatim, added as a
standing (not conditional) `<p role="alert" className="publish-dialog-irreversible-warning">` in
`PublishDialog.tsx`, between the field list/filter-scope block and the confirmation section, plus
a small `styles.css` rule (`#b34700`, bold, distinct from but lighter-weight than the filter-scope
block's own dark-red, since this one is always present rather than conditional).

### NAMED DEBT (not fixed, recorded here for the PR body)

- **S3 -- the grant mutex is held across the whole `boundary::execute` call**
  (`publish.rs::execute_with_progress`'s own `held`/`grantset` borrow spans the entire operation,
  including the real bundle write). A concurrent `prepare` attempt during a long publish blocks on
  that same `Mutex<GrantSet>` for the whole duration -- a long, uncancellable wait for whichever
  side loses the race. Not fixed: closing it would need either a finer-grained lock scope (copying
  the matched grant out before releasing, which changes what `boundary::execute`'s own kernel
  signature expects) or a redesign of how the boundary borrows the set, both bigger than a
  reviewer-gate fix.
- **S4 -- no component-render test pins `PublishDialog`'s own rendered field set.** This is
  RECORDED as the reason B1 went unnoticed as long as it did: nothing asserts, from a rendered DOM,
  that every `PublishPromptData` field the host sends actually appears somewhere in the dialog's
  own markup -- `PublishDialog.test.ts`'s existing coverage is all reducer/pure-function level, not
  a render. A future DOM-rendering test (`@testing-library/react` or equivalent -- not currently a
  dependency of this project) that enumerates `PublishPromptData`'s own keys and asserts each
  appears in the rendered dialog would close this gap structurally, so the NEXT stray unrendered
  field is caught by CI rather than by a reviewer's own reading.

### Verify -- required commands, tails

```
cargo test -p spatial-kernel
lib: test result: ok. 94 passed; 0 failed; 0 ignored           (89 P1-P4 + 5 new: 1 log.rs + 4 grant.rs)
...every integration suite: ok, 0 failed (skp_filter_cancellation 38.20s, trace_spans 24.06s,
   publish_cancellation 10.25s -- all pre-existing durations, nothing new here is release-only)
```

```
cd frontends/shell/src-tauri && cargo test --lib
running 11 tests
test publish::tests::seventy_sequential_prepare_execute_cycles_never_hit_the_grant_ceiling ... ok
...(10 pre-existing, all ok)
test result: ok. 11 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 3.62s
```

```
cd frontends/shell/src-tauri && cargo test --test sole_caller_scan
test result: ok. 2 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
```
(a live remnant app from this same piece's own earlier E2E run held the target dir at first --
killed as routine cleanup of this piece's own process, not a live human's session, before rerunning
clean)

```
cd frontends/shell && npm run verify
Test Files  28 passed (28)
     Tests  272 passed (272)                        # 266 P4 baseline + 6 new (S2's 3+3)
```

### `e2e/publish.mjs` -- one fresh, port-killed, audit-log-isolated run after all fixes

| Step | Status | Note |
|---|---|---|
| OPEN | PASS | admitted; `publishPrepareWithDestination` registered (dataset-scoped) |
| APPROVED' | PASS | attempt `5b84a03b48d66e49f92a8e2cd64fd079`; bundle verified (2000 rows, 1 partition); 2 audit lines (intent+outcome success, approval_route shell-dialog, destination normalized, no credential needle) -- phrase derived from `destination_display`'s own basename throughout, `confirmation_phrase` no longer on the wire |
| REFUSED' | PASS | attempt `84131e881ee3267ccc4cd59312769b0b`; no bundle dir, no `.staging-*` debris; audit pair refused/`ApprovalRefused` |
| EXPIRED' | SKIP | stated reason unchanged from P4 (no TTL-shortening test knob; covered by a Rust unit test with no sleep) |
| FILTERED' | PASS | filter-scope sentence verbatim; manifest `operation.filter={"kind":"whole-file"}`; rows=2000 == full dataset both by the manifest's own claim and the reader's independent decode |

Exit code 0 (checked directly, not through a `tee` pipeline this time -- P4's own second run showed
a pipeline can mask a real failing exit code under `tee`'s own success). Audit log
(`e2e/out/publish-audit-p5.jsonl`) holds exactly the 6 expected lines (3 attempts × 2 phases), every
`destination` field forward-slash-normalized, none containing `C:\Users`/`C:/Users` or any
`CREDENTIAL_NEEDLES` substring.

### Deviations from the piece as declared

1. **S1's fix touches TWO kernel methods (`prune_expired` AND `remove_matching`), not the single
   `prune-on-insert` shape the piece's own phrasing suggested first.** Found necessary while
   designing the required "70 sequential prepares succeed" test: `PublishGrant`'s internal
   `Instant::now()` read and the shell's hardcoded 120s grant lifetime make pure expiry-based
   pruning unable to keep a FAST test (or a real rapid-fire session) under the ceiling; consumption
   tracking is what actually closes S1 in practice, expiry pruning closes the remaining case
   (attempts prepared and then abandoned, never executed, until their own TTL passes). Both are
   disclosed, both are additive-only kernel surface, both have their own tests.
2. **B2's fix required a second block inside `open_for`'s own gate** (the open probe, not only
   `rotate_if_needed`) beyond the literal "rotation check inside the held gate" instruction, so a
   concurrent write cannot race the open-probe step either -- read as implied by the same
   reasoning, not a separate decision.
3. **The nit ("This cannot be undone…") required a small `styles.css` addition** beyond "one line
   in the dialog" -- the bare paragraph without any styling was legible but visually
   indistinguishable from the informational `<dl>` above it; a minimal, distinct style (bold,
   `#b34700`) was judged necessary for the sentence to actually read as a caution, not decoration
   creep.
4. **`e2e/publish.mjs`'s exit code is checked without `tee` this run** (redirected to a file with
   `>`, exit code read from `$?` directly) -- P4's own second run showed `| tee` masks the real exit
   code (the shell pipeline reports `tee`'s own success, not `node`'s), which is why THIS piece's
   own "EXPIRED' SKIP... EXIT_CODE=0" evidence line is trustworthy in a way the earlier P4 runs'
   piped ones were not; not a functional code change, a verification-discipline fix for this
   piece's own final evidence.

### State left for this piece, before commit

```
$ git status --porcelain
 M docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md
 M frontends/shell/e2e/README.md
 M frontends/shell/e2e/publish.mjs
 M frontends/shell/src-tauri/src/publish.rs
 M frontends/shell/src/publish/PublishDialog.test.ts
 M frontends/shell/src/publish/PublishDialog.tsx
 M frontends/shell/src/publish/PublishPanel.test.ts
 M frontends/shell/src/publish/PublishPanel.tsx
 M frontends/shell/src/publish/types.ts
 M frontends/shell/src/styles.css
 M kernel/src/permission/audit/log.rs
 M kernel/src/permission/grant.rs
?? CUT-STATE.md (and the other untracked state files, unchanged in kind)
```

Two commits, matching this piece's own instruction: (1) code + tests -- everything under
`frontends/shell/` and `kernel/src/` above; (2) the ADR + e2e/README.md doc corrections. `CUT-STATE.md`
stays untracked, edited in place. The app launched by the final `publish.mjs` run is left running
on CDP port 9223, same convention every prior E2E script in this tree follows.

**Next piece:** the reviewer's remaining sign-off (S3/S4 named as debt above, not blocking), then
MANUAL-WALKTHROUGH Part G + the operator run over RustDesk, then the human's condition decision.

## Part G-doc — `MANUAL-WALKTHROUGH.md` Part G ONLY (docs, no code)

Branch `cut/publish-ui`, starting and ending HEAD `21bb90b` (no code touched by this piece). The
operator run itself and the PR are the custodian's, per this piece's own scope — not done here.

### What every expected string was checked against (not recalled)

- Disclosure summary, scope radio labels + default `"current"`, the `Publish…` button, the
  filter-scope-sentence paragraph: `frontends/shell/src/publish/PublishPanel.tsx` (read directly;
  JSX order transcribed as-is).
- The dialog's rendered field list, in order, the "This cannot be undone..." sentence, the
  confirmation instruction, the empty phrase input, refusal rendering:
  `frontends/shell/src/publish/PublishDialog.tsx`.
- `row_scope`/`FILTER_SCOPE_SENTENCE` verbatim text, the `PublishPromptData`/`ExecuteOutcome` wire
  shapes (confirming `confirmation_phrase` is genuinely absent post-B1), the phase name list
  (`PublishPhase::as_str`, via the `spatial_kernel::publish` re-export this crate uses):
  `frontends/shell/src-tauri/src/publish.rs`.
- The mismatch refusal's exact text ("Expected exactly `{expected}}`...") and that it crosses to JS
  unmodified via `BoundaryError::Permission(e) => write!(f, "{e}")` (`boundary.rs`) then
  `ExecuteOutcome::Refused { message: e.to_string() }` (`publish.rs`): `kernel/src/permission/error.rs`,
  `kernel/src/permission/approval.rs`, `kernel/src/permission/boundary.rs`.
- The audit log's default path, the intent record's write site (inside `boundary::execute`, never
  `prepare`): `kernel/src/permission/audit/log.rs`, `kernel/src/permission/boundary.rs`.
- `formatPublishRefusal`/`RefusalBlock` for the refusal's rendered code/message.
- `e2e/publish.mjs` for the exact step semantics (`OPEN`/`APPROVED'`/`REFUSED'`/`EXPIRED'`/
  `FILTERED'`) and its own documented native-picker limitation.
- ADR-017 (`docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md`) Status block and its
  2026-08-07 clarification section, quoted verbatim in G10.

### G8's audit claim — verified empirically, not merely read

The piece's own instruction: verify if quick, or write only what the code provably does. Both were
done. Code reading: `AuditLog::open_for`/`IntentRecord`/`append_intent` all live inside
`boundary::execute` (`kernel/src/permission/boundary.rs`'s own "2/3. the audit log, then the intent
record" section) — never in `publish.rs::prepare`/`prepare_with_query`, which references no
`AuditLog` type at all. `PublishDialog.tsx`'s `handleAbandon` (the dialog's own Cancel button)
dispatches `{kind:"cancel"}` and calls `onSettled({kind:"abandoned"})` directly — it never calls
`execute`. So neither a picker-cancel (returns before `store.insert`, let alone `execute`) nor a
dialog-cancel (a stashed, never-executed attempt) can reach the one place an intent record is
written.

Empirical check: a throwaway, uncommitted Node script (`chromium.connectOverCDP`, reusing
`e2e/lib.mjs::attachOrLaunch`/`attachConsole`, kept only in this session's scratchpad, never added
to the repo) attached to the app instance already running from the prior piece's own last
`publish.mjs` run (CDP port 9223, confirmed listening first), admitted `filter-zoned.parquet`,
called `publishPrepareWithDestination` with a fresh, uniquely-tagged destination, and deliberately
never called `publishExecute`. Read back the real `%LOCALAPPDATA%\spatial-ide\audit\publish.jsonl`
(130 lines from every prior session's own runs) and grepped for the fresh destination's own tag:

```
destinationTag: g8-abandon-check-1786901579733-734842
prepareOutcome.status: prompt
attempt_id minted: 9fd55b753eff775477268d81bc4646d8
audit log path: C:\Users\Christopher\AppData\Local\spatial-ide\audit\publish.jsonl
audit log has 130 total lines; 0 mention this destination tag
RESULT: PASS -- prepare (no execute) wrote ZERO audit records for this destination
```

This directly proves the "dialog Cancel" half of G8's claim (an attempt reaches a real, host-minted
grant and a stashed pending attempt, then is abandoned) leaves no audit trace; the "picker-cancel"
half is the strictly earlier, strictly weaker case (returns before even that much exists) and is
therefore covered by the same code-reading argument a fortiori.

### The edit

`frontends/shell/MANUAL-WALKTHROUGH.md`: inserted `## Part G — publish (publish cut)` (intro quoting
`NEXT-CUT.md`'s own framing; fixture-reuse note; a G1–G9 table matching every other Part's own
style; a distinct `### G10 — the decision` block quoting ADR-017's Status block and its 2026-08-07
clarification verbatim, posing the human's own question, and stating that no other file in the tree
may claim the condition discharged) and `## What e2e/publish.mjs covers` (a coverage table:
`OPEN`/`APPROVED'`/`REFUSED'`/`FILTERED'`/`EXPIRED'` mapped to G-steps, with an honest
"Does not cover" column — the native picker, G3/G6/G7's own JUDGE calls, G9, and G10 entirely)
— both placed between Part F's existing coverage table and `## Result log`, matching every prior
Part's own placement convention. Added a blank `### Part G run (separate pass — publish)`
result-log subsection after Part F's own, with G10 called out by name as "not a pass/fail step."

### Verify

No code changed; nothing to build. The one throwaway verification script (§ above) was run once,
by hand, and its output pasted verbatim above — not added as a repository file, not part of any
suite.

### Deviations from the piece as declared

None. The piece's own scope (Part G doc only) was followed literally — no operator run, no PR, no
`kernel/PERMISSION-BOUNDARY.md`/ADR-024 edits, no code.

### State left for this piece, before commit

```
$ git status --porcelain
 M frontends/shell/MANUAL-WALKTHROUGH.md
?? CUT-STATE-import-layout.md
?? CUT-STATE.md
?? E2E-STATE.md
?? NEXT-CUT.md
?? NIGHT-STATE.md
```
This piece commits `frontends/shell/MANUAL-WALKTHROUGH.md` alone. `CUT-STATE.md` stays untracked,
edited in place. `NEXT-CUT.md` untouched (still owed its own deletion at the cut's final docs
commit, not this piece's — that commit belongs to whoever runs the operator walkthrough and writes
G10's own result). The app left running by the prior P5-fixes piece's own last `publish.mjs` run is
untouched (still up on CDP port 9223) — this piece only attached to it briefly for the G8 check
above, never stopped it.

**Next piece:** the operator's own run of Part G over RustDesk (the custodian's, per this piece's
scope), recording the G1–G9 results and, above all, G10's own ruling in the human's own words — then
the PR.

## Binding conditions — ADR-017's Exposure review, 2026-08-17 (G3 + G6)

Branch `cut/publish-ui`, starting HEAD `d1e6d9a` (the human's ruling commit). Implements the two
binding conditions the ruling attached, per that section's own words and the piece's own scope —
nothing else. Both conditions are now built and tested; **the ADR-017 condition's own discharge
declaration was NOT written by this piece** (out of scope as given — the piece names ADR-024 and
CUT-STATE.md as the docs to update, not ADR-017 itself; see Deviations below).

### Condition 1 (G3) — the approval dialog's plain-outcome sentence

Host-composed, one new `PublishPromptData` field, `outcome_summary: String`
(`frontends/shell/src-tauri/src/publish.rs::compose_outcome_summary`, called from
`prepare_with_query`), from facts already in hand at `prepare` time — the resolved destination's
own basename and parent (the same `resolved_destination` every other field already reads from, so
there is only one path-resolution site, not two that could disagree). **Never a row or partition
count**: `publish::preflight` is pure with respect to the filesystem's contents (reads no data), so
neither figure exists yet at this point — the sentence says "the selected rows" and "one or more
data partitions" rather than inventing a number, checked structurally both in a Rust unit test and
in `e2e/publish.mjs` (no `<N> rows`/`<N> partition(s)` pattern permitted). `PublishDialog.tsx`
renders it first, in its own shaded block (`styles.css`), before the provenance `<dl>` — every
existing field kept, none removed, none reordered relative to each other.

Example, taken verbatim from a live `prepare` call against the real running app (throwaway
CDP script, prepare-only, never executed — zero audit trace, confirmed by grep):

```
This will create a folder named "my-parcels" at \\?\C:\dev\spatial-ide\target\e2e-publish-out\outcome-summary-demo-1786959579693, containing the selected rows as one or more data partitions, the interactive viewer page, and a manifest.
```

(The `\\?\` prefix is Windows' own extended-length-path form, the same one `destination_display`
already carries via `resolve_destination`'s `canonicalize()` — not new to this piece.)

Tests: a Rust unit test (`publish.rs::tests::the_outcome_summary_names_the_real_destination_and_never_invents_a_row_or_partition_count`)
proving the basename/parent/nouns are present and no row/partition COUNT appears; a TS test
(`PublishDialog.test.ts`, new `describe` block) using `react-dom/server`'s `renderToStaticMarkup`
(no new dependency, no jsdom DOM harness — this package deliberately carries none, `App.test.ts`'s
own top comment) to prove the sentence renders, renders BEFORE the `Source` field, and every
existing field is still present; `e2e/publish.mjs`'s `APPROVED'` step pattern-matches the live
rendered value against its stable skeleton (basename present, folder/data partition/viewer/manifest
nouns present, no counted row/partition figure) — never exact numbers, per the piece's own
instruction.

### Condition 2 (G6) — the audit reader

`kernel/src/permission/audit/reader.rs` (new module), `render_audit_log(text: &str) -> Vec<String>`
— pure, read-only, takes a `spatial-audit/1` JSONL's own text and returns one plain sentence per
intent/outcome pair (or per orphan intent, orphan outcome, or corrupt line). Wired to
`publish-bundle --audit-show [path]` (`kernel/src/bin/publish-bundle.rs`, intercepted in `main`
before `run()`'s own argument loop): with no path argument it calls the now-`pub`
`audit::resolve_log_path()` (previously private to `log.rs`) — **the same resolution
`AuditLog::open_for` itself uses**, so a reader and a writer can never resolve two different files
for what is meant to be one log; `SPATIAL_IDE_AUDIT_LOG` is honored as it already was.
`serde_json` moved from `[dev-dependencies]` to `[dependencies]` in `kernel/Cargo.toml` — the first
non-test use of it in this crate.

Corruption is visible, not silent (the same doctrine `log.rs`'s own module docs state for the write
side): an unparseable line, a record with an unrecognized `schema` tag, or one missing a field the
reader needs prints its own `CORRUPT` line rather than vanishing. The append-only, multi-generation
property (`audit/mod.rs`'s own doc comment) is exercised for real, not hypothetically: a real,
still-live line on this project's own dev machine uses the pre-rename `approval` field
(`record.rs`'s own git history renamed it to `approval_route`), and the reader reads it as the same
domain, not as corrupt.

Unit tests: `reader.rs`'s own suite (8 tests) — a success pair, a refused pair, an orphan intent, an
unparseable line (all four the piece's own required fixture shapes), an unrecognized-schema line, a
pre-rename `approval`-field line, blank-line tolerance, and a "nothing merged, nothing lost" count
check; `publish-bundle.rs`'s own `audit_show_tests` (4 tests) — the CLI-plumbing half
(`audit_show_lines`, factored out with no `println!` of its own so it is testable without capturing
stdout): an explicit path argument, a missing log (reported, not errored), an empty log (reported
distinctly from missing), and the `SPATIAL_IDE_AUDIT_LOG` fallback.

Acceptance demo — `cargo run -p spatial-kernel --bin publish-bundle -- --audit-show`, run read-only
against the REAL `%LOCALAPPDATA%\spatial-ide\audit\publish.jsonl` (132+ lines, spanning both
`approval`/`approval_route` schema generations and every earlier piece's own evidence), last 4
lines after this piece's own fresh `publish.mjs` run:

```
2026-08-17 09:34 — publish to C:/dev/spatial-ide/target/e2e-publish-out/refused-1786959264656-696491/bundle — REFUSED: the confirmation did not match the destination (wrong phrase, or none given)
2026-08-17 09:34 — publish to C:/dev/spatial-ide/target/e2e-publish-out/filtered-1786959264706-83608/bundle — APPROVED via shell dialog and SUCCEEDED (2000 rows, 1 partition)
2026-08-17 09:38 — publish to C:/dev/spatial-ide/target/e2e-publish-out/approved-1786959505693-732206/bundle — APPROVED via shell dialog and SUCCEEDED (2000 rows, 1 partition)
2026-08-17 09:38 — publish to C:/dev/spatial-ide/target/e2e-publish-out/refused-1786959506523-634675/bundle — REFUSED: the confirmation did not match the destination (wrong phrase, or none given)
```

The walkthrough's G6 step (`MANUAL-WALKTHROUGH.md`) gains a "Reading the audit log" paragraph
(the command, the env/path-override note, and one example line per outcome shape) so the operator
instruction is self-sufficient next time, per the piece's own instruction.

### Verify

- `cargo test -p spatial-kernel`: **all green** — lib 102 passed, `publish-bundle` bin 4 passed
  (the new `audit_show_tests`), every integration test binary 0 failed (several pre-existing
  `ignored` release-only measurement harnesses, unchanged); tail captured in this session's own
  scratchpad, not committed.
- `cd frontends/shell && npm run verify` (typecheck + build + vitest): **exit 0**, 275/275 tests
  passed across 28 files (`PublishDialog.test.ts` 17, `PublishPanel.test.ts` 17, both including this
  piece's own new cases).
- `npm run e2e:publish` (fresh run, remnant `spatial-ide-shell.exe` process and CDP/dev-server ports
  confirmed down first): `OPEN` PASS, `APPROVED'` PASS, `REFUSED'` PASS, `FILTERED'` PASS,
  `EXPIRED'` SKIP (stated reason unchanged from every prior run — no TTL-shortening knob). The app
  is left running on CDP port 9223 for further interactive use, the same convention every earlier
  E2E script in this tree follows.

### Deviations from the piece as declared

1. **A first draft of the "never invent a number" check was wrong, caught by the E2E run against a
   REAL destination path, not by inspection.** Both the Rust unit test and the `e2e/publish.mjs`
   assertion originally asserted "no digit anywhere" in `outcome_summary` — true only by accident of
   a digit-free fixture path. A real destination
   (`.../e2e-publish-out/approved-1786959264574-767167`) legitimately carries a timestamp, so
   `APPROVED'` failed on the first live run. Both checks were corrected to the precise claim the
   binding condition actually makes — no `<N> rows`/`<N> partition(s)` FIGURE, not "no digit" —
   and a second fresh run went green. Recorded here because it is exactly the kind of thing this
   piece's own "precision over speed" instruction exists to catch before it reaches review.
2. **The dev machine's disk was completely full (0 bytes free) partway through this piece**,
   blocking the shell crate's own linker (`LNK1106`, "cannot seek"). Freed ~12 GB by deleting
   `target/debug/incremental` under both the root workspace and `frontends/shell/src-tauri` (pure
   compiler speed cache, regenerated on the next build, nothing evidentiary) — not a piece-scoped
   change, but an infrastructure action taken to unblock the piece's own required verification
   commands. `target/slice-evidence` (32 GB) and the rest of `target/debug`/`target/release` were
   left untouched. Flagged for the custodian: this machine's `C:` drive is at capacity as a standing
   condition, not only during this session.
3. **`react-dom/server`'s `renderToStaticMarkup`, used in `PublishDialog.test.ts`**, is a new
   testing technique for this package (no prior `.test.ts` here renders a component —
   `App.test.ts`'s own top comment states this package deliberately carries no
   `@testing-library/react`-equivalent DOM harness). No new dependency was added (`react-dom` is
   already a runtime dependency; `/server` is a subpath of it), and the technique is narrower than a
   full DOM harness (one static render, string containment/ordering only, no events) — judged
   in-scope because the piece explicitly asks PublishDialog's own tests to "assert the sentence's
   presence," and no existing pattern in this package does that for any rendered field. Flagged as a
   precedent-setting choice, not a unilateral one, for whoever reviews this piece.
4. **ADR-017 itself was not edited.** The piece names ADR-024's field list and CUT-STATE.md as the
   docs to update; it does not name ADR-017. The Exposure review section's own words — "when both
   land (through the ordinary gates), the condition is discharged" — read as though discharge could
   follow automatically once both conditions are built and tested, but this piece treats that
   declaration as belonging to the ordinary gates themselves (reviewer sign-off), not to be written
   unilaterally here. Named so the next piece/reviewer knows the discharge sentence is still unwritten.

### State left for this piece, before commit

```
$ git status --porcelain
 M docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md
 M frontends/shell/MANUAL-WALKTHROUGH.md
 M frontends/shell/e2e/README.md
 M frontends/shell/e2e/publish.mjs
 M frontends/shell/src-tauri/Cargo.lock
 M frontends/shell/src-tauri/src/publish.rs
 M frontends/shell/src/publish/PublishDialog.test.ts
 M frontends/shell/src/publish/PublishDialog.tsx
 M frontends/shell/src/publish/PublishPanel.test.ts
 M frontends/shell/src/publish/types.ts
 M frontends/shell/src/styles.css
 M kernel/Cargo.toml
 M kernel/src/bin/publish-bundle.rs
 M kernel/src/permission/audit/log.rs
 M kernel/src/permission/audit/mod.rs
?? kernel/src/permission/audit/reader.rs
?? CUT-STATE.md (and the other untracked state files, unchanged in kind)
```

Two commits, matching this piece's own instruction: (1) code + tests — everything under
`frontends/shell/` and `kernel/` above; (2) the docs corrections — ADR-024, the walkthrough,
`e2e/README.md`. `CUT-STATE.md` stays untracked, edited in place, never committed. The app launched
by the final `publish.mjs` run is left running on CDP port 9223, same convention every prior E2E
script in this tree follows. Neither commit pushed.

**Next piece:** the reviewer's own pass over this piece's two conditions (the ordinary gate the
Exposure review's own discharge sentence is waiting on — see Deviation 4), then, if it passes,
whoever writes ADR-017's own discharge line.

