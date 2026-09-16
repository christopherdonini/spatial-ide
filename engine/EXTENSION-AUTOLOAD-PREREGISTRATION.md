# Preregistration — DuckDB extension autoload/autoinstall OFF by configuration at every engine connection open

**Authority.** Node `engine-extension-autoload-off` (PLAN.yaml, engine lane). The human's ruling of
2026-09-15 — `DECISIONS-PENDING.md`, block "RULED 2026-09-15 — question round 2", Item 2, verbatim:
**"Option 1: harden by configuration — autoinstall_known_extensions=false and
autoload_known_extensions=false at every connection open, asserted fail-closed on every lease class;
full two-agent gate despite size (security posture); ADR-021 amendment appended recording the
configuration as part of the no-runtime-fetch property."**

**Drafted by** the custodian, 2026-09-15, from: the local cargo-registry copy of
`libduckdb-sys-1.10505.0/build_bundled_cc.rs` (lines 37-43 and 96-97); `engine/src/pool.rs` (lines
166, 170-179, 376-382, 648-663); `engine/src/layout.rs` (lines 260-265); `engine/src/cancel.rs`
(135, 143-201) and `engine/src/predicate.rs` (1132, 1150); `docs/adr/ADR-021-row-filter-on-viewport-query.md`
(lines 123-135, 187-196); `AUTONOMY.md` §14 (208-222) and §21a (310-327); two probes run in the
pinned venv's DuckDB 1.5.5 (§0). All `file:line` cites are reads of `main` at **a6fd06a**.

**Committed before any code.** Append-only once committed; an amendment made after any outcome has
been seen says so in its first line (`engine/ADMISSION-PREREGISTRATION.md:5`'s rule).

**Gate shape: FULL (§21a)** — "security posture — anything … ADR-021 (bundling / no-runtime-fetch)
governs" (`AUTONOMY.md:316-317`), and the ADR amendment is itself a §21a trigger (`AUTONOMY.md:314-315`).
The size is small; the ruling says "full two-agent gate despite size".

## §0. Disclosure

What informed this document:

1. **The fact ruled on.** `libduckdb-sys-1.10505.0/build_bundled_cc.rs:96-97` (local cargo registry,
   quoted mechanically):
   ```rust
       cfg.define("DUCKDB_EXTENSION_AUTOINSTALL_DEFAULT", "1");
       cfg.define("DUCKDB_EXTENSION_AUTOLOAD_DEFAULT", "1");
   ```
   and `:37-43`, the closed set of statically built-in extensions (`core_functions`, `parquet`,
   `json`). `engine/src/pool.rs:166`: `const CONFIGURE_SQL: &str = "SET enable_geoparquet_conversion=false";`
   — the only setting the engine applies at connection open. Nothing in `engine/src` names
   `autoinstall_known_extensions` or `autoload_known_extensions` (grep, 2026-09-15: no match).
2. **Sibling search (`AUTONOMY.md` §14), recorded.** Every `Connection::open*` in the engine crate:
   `engine/src/pool.rs:377` (the pool's `configure_new`) and `engine/src/layout.rs:260` (the layout
   variant rewriter's own direct connection, followed at `:264` by the same `SET enable_geoparquet_conversion=false;`)
   are **product code**; `engine/src/cancel.rs:143,144,169,201` (under `#[cfg(test)]` at `:135`) and
   `engine/src/predicate.rs:1150` (under `#[cfg(test)]` at `:1132`) are **test code**. No open site
   exists in `kernel/src`, `protocol/` or `renderer/` (grep, 2026-09-15). **Two product sites, one
   of which (layout.rs) does not go through the pool.**
3. **Two probes, DuckDB 1.5.5 in the pinned venv (`target/corpus-venv`), 2026-09-15** — the same
   DuckDB version the vendored crate builds (`duckdb 1.10505.0` = DuckDB `v1.5.5`) but a *different
   binary* (the Python wheel), so they inform §3's predictions and do not stand in for the engine's
   own test:
   - Probe A: `current_setting('autoinstall_known_extensions')` → `True`;
     `current_setting('autoload_known_extensions')` → `True`; after `SET … =false` both read `False`;
     `SELECT ST_Point(0,0)` then fails `Catalog Error: Scalar Function with name "st_point" is not in
     the catalog, but it exists in the spatial extension.` — **and it fails the same way with the
     defaults**, i.e. `spatial` is not on DuckDB's autoload list; `ST_*` is therefore *not* a usable
     probe of autoload.
   - Probe B (`extension_directory` pointed at a fresh temp dir each time):
     `SELECT * FROM read_parquet('https://127.0.0.1:9/none.parquet')` —
     **with the defaults:** `IO Error: Could not connect to server error for HTTP HEAD …`, and
     `duckdb_extensions()` reports httpfs `installed=True, loaded=True, install_mode='REPOSITORY'`
     with two files written under the temp directory (`v1.5.5\windows_amd64\httpfs.duckdb_extension`
     and `.info`) — **a runtime repository fetch happened, triggered by one statement.**
     **With both settings off:** `Error: File https://127.0.0.1:9/none.parquet requires the extension
     httpfs to be loaded`, httpfs `installed=False, loaded=False, install_mode='NOT_INSTALLED'`,
     **zero files written.**
4. **Hypothesis, labelled.** The engine's vendored build behaves as Probe B's "defaults" case
   because its compiled defaults are the ones quoted in item 1. Discriminator: T1's reading of the two
   settings on an engine lease before the change (the mutation run of §4) — `true`/`true` confirms;
   `false`/`false` refutes and narrows the piece to "asserted, not changed" (§10 class 2).

No measurement is made against any fixture; the 5 GB fixture is not read; no drive confound applies.

## §1. What this preregistration may and may not claim

- **No performance number, no `docs/08` row.** Nothing here is timed.
- **No wire change** (no SKP control- or data-plane message, literal or field; `protocol/**` untouched).
- **No cancellation vocabulary** (ADR-018) is touched; no undo class (ADR-006).
- **No user-visible string is added.** The only new text a person could see is DuckDB's own error
  for a statement the engine never issues in product paths; it is asserted in tests only.
- **No dependency, feature flag or build-script change**: `engine/Cargo.toml`'s
  `duckdb = { version = "1.10505.0", features = ["bundled", "parquet", "json"] }` is unchanged; the
  vendored crate's compiled defaults are not patched — they are *overridden by configuration* at
  every engine connection, which is what the ruling names.
- **ADR-021 is amended by appending** (§2, item 4), never rewritten; the amendment's landing is the
  human's click. No other ADR is amended; ADR-020 and ADR-009 are cited only as §21a's triggers.
- It may **not** claim that the engine "never loads an extension": `core_functions`, `parquet` and
  `json` are compiled in (`build_bundled_cc.rs:37-43`) and remain; the claim is that **no engine
  connection can fetch or load an extension at runtime**.

## §2. The rule / the change — stated before it is applied

1. **One configuration statement, applied at every engine connection open.** `engine/src/pool.rs:166`'s
   `CONFIGURE_SQL` becomes, in this order:
   ```sql
   SET autoinstall_known_extensions=false; SET autoload_known_extensions=false; SET enable_geoparquet_conversion=false
   ```
   The two extension settings come **first**, before any other statement, so nothing that follows can
   trigger a load. `enable_geoparquet_conversion=false` is retained unchanged (its reason at
   `pool.rs:150-165` stands).
2. **The pool site.** `configure_new` (`pool.rs:376-382`) keeps applying `self.configure_sql` — the
   test seam `with_configure_sql` (`pool.rs:650`) is unchanged; the default is the new statement.
3. **The layout site.** `engine/src/layout.rs:260-265` stops carrying its own copy of the
   configuration: it applies the same statement through a shared engine-private function (proposed
   name `pool::configure_connection(&Connection) -> Result<()>`, the pool's `configure_new` calling
   the same function) so that the two product open sites cannot drift. The worker may name it
   differently; **there must be exactly one place the statement is spelled.**
4. **The ADR-021 amendment, appended** after the ADR's final line (`:196`), as a new section, text
   for the gates' sight (the worker fills the two `<site>` and `<tests>` placeholders with the final
   `file:line` and test names; nothing else changes):
   > ## Amendment 2026-09-15 — the no-runtime-fetch property is held by configuration, not only by content
   >
   > *Appended under the human's ruling of 2026-09-15 (`DECISIONS-PENDING.md`, "RULED 2026-09-15 —
   > question round 2", Item 2). The text above is unchanged.*
   >
   > The Consequences bullet "Security property" records that admission's parser is statically
   > linked and that admission performs no runtime extension fetch. On 2026-09-15 the LOD spike's
   > route-A check (`spikes/lod-feasibility/README.md`, "Route A static bundling") surfaced that the
   > vendored `libduckdb-sys 1.10505.0` compiles DuckDB with `DUCKDB_EXTENSION_AUTOINSTALL_DEFAULT`
   > and `DUCKDB_EXTENSION_AUTOLOAD_DEFAULT` set to `"1"` (`build_bundled_cc.rs:96-97`): the property
   > held by content — `json` built in — while every engine connection still permitted DuckDB to
   > autoload, and autoinstall from its repository, any other known extension on first reference.
   > From this amendment the engine sets `autoinstall_known_extensions=false` and
   > `autoload_known_extensions=false` at every connection open (`<site>`; `<site>`), asserted
   > fail-closed on every lease class (`<tests>`). The property now reads: **the admission parser is
   > statically linked AND runtime extension autoload/autoinstall is disabled by configuration at
   > every engine connection — no engine connection can fetch or load an extension at runtime.**
5. **Nothing else.** No change to lease classes, capacities, the pool's health check, the data plane,
   the kernel, the shell, or any fixture.

## §3. Fixtures / corpus — pre-declared outcomes

No data fixture. The "fixtures" are the three lease classes (`pool.rs:170-179`: `Stream`,
`Maintenance`, `Admission`) and the layout rewriter's connection. Predicted **after** the change:

| Site | `current_setting('autoinstall_known_extensions')` | `current_setting('autoload_known_extensions')` | Probe B on the connection | `duckdb_extensions()` httpfs | files under the temp `extension_directory` |
|---|---|---|---|---|---|
| lease `Stream` | `false` | `false` | `Err`, message contains `requires the extension httpfs to be loaded` | `installed=false, loaded=false` | 0 |
| lease `Maintenance` | `false` | `false` | same | same | 0 |
| lease `Admission` | `false` | `false` | same | same | 0 |
| `layout.rs` connection (via the shared function on a fresh connection) | `false` | `false` | same | same | 0 |

Predicted **before** the change (the pre-fix / mutation run, recorded as evidence, never as the
product's state): both settings read `true`; Probe B on this machine (network available) makes a
repository fetch — httpfs `installed=true`, two files written; on a CI runner the same statement
ends in an install or connect error whose text is **not** the fail-closed message. Either way T2
fails by name. **This pre-fix run is the only network access this piece ever makes, and only in the
mutation run.** Probe B's URL is `https://127.0.0.1:9/none.parquet` — loopback, a closed port, no
DNS; with the settings off it never reaches a socket (the failure is at the file-system-dispatch
step, before any I/O — Probe B's "both off" output).

Existing suites: `cargo test --workspace --locked` (the CI command, `.github/workflows/product-ci-rust.yml:221`)
green with the same pass count plus the new tests; every admission test that exercises
`json_serialize_sql` stays green — **if any of them turns red with autoload off, `json` is not in
fact built in, which contradicts ADR-021's record: STOP and put it to the human (§5, invalidator 1).**

## §4. Tests, and the mutation per new test

All in `engine/src/pool.rs`'s test module unless a seam makes another file the honest place.

- **T1 `every_lease_class_opens_with_extension_autoload_and_autoinstall_off`** — for each of the
  three `LeaseClass` values: acquire a lease, `SELECT current_setting(…)` for both settings, assert
  both `false`. **Mutation:** remove the two `SET … =false` clauses from the configuration
  statement → T1 fails by name (both read `true`; if the engine's build reads `false` already, §0
  item 4's discriminator has refuted the hypothesis — record under §10 class 2).
- **T2 `a_known_extension_reference_fails_closed_on_every_lease_class`** — for each class: acquire
  a lease; `SET extension_directory='<fresh temp dir>'` on it; run Probe B's statement; assert
  `Err` whose text contains `requires the extension httpfs to be loaded`; assert `duckdb_extensions()`
  reports httpfs `installed=false` and `loaded=false`; assert the temp dir has zero files.
  **Mutation:** the same removal → T2 fails by name (the error text differs and/or files appear).
  If DuckDB refuses `SET extension_directory` at runtime, the test sets it through the connection's
  open-time config instead and §10 class 2 records the substitution.
- **T3 `the_shared_configuration_sets_all_three_settings_on_a_fresh_connection`** — the shared
  function of §2 item 3 on a bare `Connection::open_in_memory()`: both extension settings `false`
  **and** `enable_geoparquet_conversion` `false`. **Mutation:** drop `enable_geoparquet_conversion`
  from the statement → T3 fails by name (guards against the retained setting being lost in the edit).
- **Not a test, a gate check (§8 item 1):** the reviewer greps `engine/src` for `Connection::open`
  and confirms each non-test site is followed by the shared configuration (the §0 sibling list).

Each mutation's observed failure is recorded by test name in the PR body (`AUTONOMY.md` §14);
`verify:test-claims` (§6a) confirms mechanically.

## §5. Registered predictions · declared unchanged · invalidators · falsification

**Predictions.** P1: the engine's build reads both settings `true` before the change (§0 item 4).
P2: with both off, Probe B on the engine's build fails with the same message Probe B produced in the
venv. P3: every existing test stays green — nothing in the engine references a non-built-in extension.
**Wrong is a result:** P1 wrong narrows the piece (asserted, not changed); P2 wrong changes T2's
asserted text to the observed one and records it (§10 class 2), never weakens the `installed=false`
+ zero-files assertions.

**Declared unchanged.** The wire and data plane; lease classes, capacities and the pool's
health/return logic; `enable_geoparquet_conversion=false`; `engine/Cargo.toml`; every fixture; the
kernel and shell.

**Invalidators (stop the piece).** (1) P3 fails for a `json_serialize_sql` path → `json` is not
built in → the human, immediately (ADR-021's record would be false). (2) DuckDB rejects either `SET`
on this version → the settings are applied through open-time config instead; if that also fails, the
human. (3) The layout rewriter cannot take the shared function without a behaviour change beyond
configuration → the human.

**Falsification.** This preregistration is wrong if an engine connection configured per §2 can still
install or load an extension at runtime by any statement — T2's zero-files + `installed=false`
assertions are the check; a passing T2 with a fetch observed elsewhere (e.g. in the default
`~/.duckdb` directory) falsifies the temp-directory instrument, not the property, and is recorded.

## §6. Instruments

All **assertions**, no measurements: two setting values read back per connection; the error text of
one statement; two booleans from `duckdb_extensions()`; a file count under a temp directory. No
p50/p95, no dataset, no drive.

## §7. Declared values and ceilings

- The configuration statement, verbatim (§2 item 1), at its single site.
- Probe B's URL `https://127.0.0.1:9/none.parquet` and the asserted substring
  `requires the extension httpfs to be loaded`, at the test site.
- No numeric ceiling is introduced; none is discovered (ADR-010 rule 6).

## §8. Block-on-sight

1. Any `Connection::open*` in `engine/src` non-test code not followed by the shared configuration.
2. Any change to `engine/Cargo.toml`, `Cargo.lock`, features or build scripts.
3. Any new user-visible string, or any wire/data-plane diff (`protocol/**` must be empty in the diff).
4. ADR-021 changed anywhere other than by the appended section of §2 item 4.
5. A new test without its recorded mutation and observed failure name.
6. `enable_geoparquet_conversion=false` dropped or reordered ahead of the two extension settings.
7. Any performance claim, anywhere in the diff.
8. Any network access in the post-fix test run.

## §9. Gates

- **Architect** — ADR-021 (the property and the amendment's wording), ADR-020, ADR-009; block-on-sight
  1-8 one by one; affirmative PASS required.
- **Reviewer** — the full diff; the §0 sibling list re-derived by grep; the three mutations' observed
  failures; affirmative PASS required.
- **Suites** — `cargo test --workspace --locked` green; pre-gate self-checks (`verify:cites`,
  `verify:test-claims`) green first.
- **Operator** — none; no felt row. The PR (with the ADR amendment) is the human's click.

## §10. Amendments — opens empty, append-only

**Amendment 1 — class 5 (a gate narrows the piece's wording). Written 2026-09-16 AFTER the piece's outcomes were seen (T1–T3 green, the pre-fix observations recorded in-source) and after the architect gate's attempt-1 FAIL.** The architect's finding, quoted: *"the property sentence over-claims what the configuration delivers … The two settings govern *implicit* acquisition only. `autoload_known_extensions` / `autoinstall_known_extensions` suppress load/install *on first reference*. An explicit `INSTALL x` / `LOAD x` statement is outside their scope, as is a later `SET autoload_known_extensions=true` … `#[cfg(test)]` connections in the same crate are engine connections and are not configured"*. Applied: §2 item 4's pre-committed final sentence ("no engine connection can fetch or load an extension at runtime") is replaced in the appended ADR-021 section by the property scoped to **implicit acquisition on product connections** (the architect's drafted wording, adopted by the custodian — the worker was bound to placeholders); the same scoping in `engine/src/pool.rs`'s `CONFIGURE_SQL` doc comment; the ADR's site cites moved from a match arm (`pool.rs:423`) to the statement and the function (`:185-187`, `:199-201` — the first edit cited `:182-184`/`:195-197`, computed before its own three added doc lines shifted the file; caught by the reviewer's re-read and corrected before landing); "any other known extension" → "any known extension on DuckDB's autoload list" (Probe A, §0 item 3: `spatial` is not on that list); the per-class fail-closed claim attributed to T1 and T2, T3 named as the retained-setting guard. No code, test or setting changed.

**Amendment 2 — class 2 (a deviation from a §2 literal, with the reason). Written 2026-09-16 after outcomes were seen.** §2 item 2 said the `with_configure_sql` test seam "is unchanged"; §2 item 3 required the pool's `configure_new` to call the shared function. The worker resolved the tension in item 3's favour: `configure_sql` became `Option<&'static str>` (`None` = the product statement through `configure_connection`, `Some` = the seam's own statement), so the pool holds no second copy of the statement. Behaviour-identical; the seam's failing-statement test still passes.

**Amendment 3 — class 3 (cite / line-number fixes; mechanical, no claim changed). Written 2026-09-16 after outcomes were seen.** Stale cites fixed: `pool.rs:182-184` → `:185-187`; `:195-197` → `:199-201` (Amendment 1 computed them before its own three added doc lines shifted the file; the reviewer's re-read caught it). Recorded here because the correction was made IN PLACE in Amendment 1 at 5a6daa9 — §10 is append-only from its first commit (this document's header, and `docs/PREREGISTRATION-TEMPLATE.md` §10), so the in-place edit is itself noted rather than left silent; git holds both versions. In the same follow-up (db265fa) two comment sentences in mutable source were scoped like the ADR's property — `engine/src/pool.rs:147` ("every product-path engine connection") and `engine/src/layout.rs:264-265` ("cannot implicitly load or install an extension on first reference") — with line counts preserved so no cited line moved.
