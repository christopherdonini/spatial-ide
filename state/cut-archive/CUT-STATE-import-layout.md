# CUT-STATE — import-layout cut, phases 0 / 0b / 1

**Untracked** (`NIGHT-STATE.md` pattern). Piece scope: `NEXT-CUT.md` phases 0, 0b, 1 only —
preflight, the disclosed metadata pilot, and committing the preregistration. No harness code, no
fixture generation beyond the pilot's throwaway files, no `docs/` edits, no measurement of
anything scored. Declared duration: 45 minutes wall clock for the whole piece; release build
watchdog 25 minutes (record-and-continue, not a scope breach); pilot watchdog 10 minutes (kill and
record an attempt).

Branch: `cut/import-layout`, stacked on `cut/shell-skeleton`.

---

## Phase 0 — preflight

**Free disk**, checked before anything else: `Get-PSDrive C` reports **54,766,407,680 B free ≈
51.0 GiB** on the drive the repo lives on (`C:\dev\spatial-ide`) — above the declared 40 GiB floor
(branch-time figure was 51 GiB; effectively unchanged). **Not stopping.**

**Tree pin, taken BEFORE any build:**

```
git rev-parse HEAD
c1fb9f8847b71c237b6e3f6c11b68a79acb253a3
taken_at: 2026-08-13T04:48:45Z
```

Working tree at pin time: clean except three untracked root files that predate this piece and
belong to other cuts/briefs (`E2E-STATE.md`, `NEXT-CUT.md`, `NIGHT-STATE.md`) — none touched.

**Release build**, run immediately after the tree pin, output piped to
`target/slice-evidence/import-layout/build-phase0.log`:

```
cargo build --release -p spatial-kernel -p spatial-engine
```

Tail:

```
   Compiling serde v1.0.229
   Compiling spatial-engine v0.0.0 (C:\dev\spatial-ide\engine)
   Compiling serde_urlencoded v0.7.1
   Compiling spatial-skp v0.0.0 (C:\dev\spatial-ide\protocol\skp)
   Compiling axum v0.8.9
   Compiling spatial-data-plane v0.0.0 (C:\dev\spatial-ide\protocol\data-plane)
   Compiling spatial-kernel v0.0.0 (C:\dev\spatial-ide\kernel)
    Finished `release` profile [optimized + debuginfo] target(s) in 32.98s
EXIT_CODE=0
```

**32.98 s** — most of the dependency graph (including DuckDB `bundled`) was already built in this
tree's `target/`. Nowhere near the 25-minute watchdog; no deviation to record.

**Binary pin.** Prior-cut practice (`kernel/scripts/pin-tree.mjs --binaries`, and
`kernel/RESULTS.md`'s "pinned by SHA-256 ... re-verified after every phase: `slice-host.exe`
`<hash>…`, harness `<hash>…`, `dist/app.js` `<hash>…`") pins the **runnable artifacts** a build
actually produced, not intermediate `.rlib`s. `spatial-kernel` is the only one of the two built
crates with `[[bin]]` targets (`spatial-engine` has none — library + examples only, and no example
was built by this command). No import-layout test/benchmark binary exists yet — phase 1 forbids
harness code, so there is nothing of that kind to pin. What this build actually produced, pinned
now so later phases can verify it hasn't moved underneath them:

| artifact | path | sha256 | size | mtime |
|---|---|---|---|---|
| `slice-host.exe` | `target/release/slice-host.exe` | `86aec698da19bc36680bd23ca1363830cc78d7cdeb3c4475accac2801d1aa250` | 33,544,704 B | 2026-08-13 06:49 (local) |
| `publish-bundle.exe` | `target/release/publish-bundle.exe` | `5d757adb4e09a7c95f9988d264430517cf8f9d9f3a5742d1d2a9f93826a51bdc` | 32,739,328 B | 2026-08-13 06:49 (local) |

Pin taken: 2026-08-13T04:50:22Z. **Neither binary is the phase-2+ harness** — this pin only
brackets what phase 0's own build command produced; the harness gets its own pin when it exists.

---

## Phase 0b — the disclosed pilot (metadata queries only, no gate, findings only)

**Question:** are parquet page indexes (`column_index_offset` / `offset_index_offset` in the
column-chunk metadata) present in (a) a DuckDB-`COPY`-written file and (b) an arrow-rs-written
file, as reported by DuckDB's `parquet_metadata()`?

**Files used — existing fixtures, none generated:**

| id | writer | path |
|---|---|---|
| (a) `C` | DuckDB `COPY` (`ClusterOrder::SourceIdentity`, raster order) | `target/slice-evidence/first-batch/parcels-145mb-duckdb-raster.parquet` |
| (b) `S` | arrow-rs `ArrowWriter` | `target/slice-evidence/first-batch/parcels-145mb.parquet` |

Both are the `first-batch` cut's own registered fixtures (its preregistration §2: `S` = "100 000
features ... arrow-rs `ArrowWriter`", `C` = "the same rows, rewritten ... DuckDB `COPY`,
`ClusterOrder::SourceIdentity`"). No throwaway file was needed.

**Mechanism, and the phase-1b lesson applied.** `NIGHT-STATE.md`'s phase-1b finding: a struct
child's `path_in_schema` is reported by this DuckDB as `"bbox, xmin"` — comma-space, not a dot —
and a wrong key **fails silently** (every row NULL, looking like a clean "absent" result). So
before asking about the two page-index fields, the pilot **positively verified** the query
mechanism against a field known present, per file, before drawing any absence conclusion:

1. `DESCRIBE SELECT * FROM parquet_metadata(?)` — the actual column list, listed by name, per file.
2. `SELECT row_group_id, path_in_schema, stats_min_value FROM parquet_metadata(?) LIMIT 3` — a
   known-present field, confirming rows come back and values are non-null for both files (and
   incidentally re-confirming the comma-space spelling: `"bbox, xmin"`, `"bbox, ymin"`).
3. Only if step 1 showed the two page-index columns present: a value query
   (`SELECT ... column_index_offset, offset_index_offset FROM parquet_metadata(?)`) plus an
   aggregate non-null count.

Run via a throwaway example (`engine/examples/pilot_page_index.rs`, **built, run, and deleted** —
not retained, matching how the `first-batch` cut's own phase-1b probe was disposed of per
`NIGHT-STATE.md`: "It was not a measurement of either lever and none of its numbers appear in any
verdict"). Command: `cargo run --release -p spatial-engine --example pilot_page_index`. Full output
captured to `target/slice-evidence/import-layout/pilot-page-index.log` before deletion. Wall time:
compile 15.48 s + run — seconds, not minutes. **Nowhere near the 10-minute pilot watchdog; no kill,
no deviation.**

### Finding

**Neither `column_index_offset` nor `offset_index_offset` exists in this DuckDB's
`parquet_metadata()` output schema at all, under either name, for either writer.** The 31-column
schema this DuckDB (bundled with the `duckdb` crate, version `1.10505.0`) reports is identical for
both files:

```
["file_name", "row_group_id", "row_group_num_rows", "row_group_num_columns", "row_group_bytes",
"column_id", "file_offset", "num_values", "path_in_schema", "type", "stats_min", "stats_max",
"stats_null_count", "stats_distinct_count", "stats_min_value", "stats_max_value", "compression",
"encodings", "index_page_offset", "dictionary_page_offset", "data_page_offset",
"total_compressed_size", "total_uncompressed_size", "key_value_metadata", "bloom_filter_offset",
"bloom_filter_length", "min_is_exact", "max_is_exact", "row_group_compressed_bytes", "geo_bbox",
"geo_types"]
```

Positive verification succeeded for both files (3/3 rows read, non-null `stats_min_value`,
`path_in_schema` spelled `"bbox, xmin"` / `"bbox, ymin"` as expected) — so the "absent" reading
above is a **schema fact, confirmed by `DESCRIBE`**, not a silently-wrong-key failure of the kind
the phase-1b lesson warns about; the mechanism is shown working on the same connection, same
query shape, same files.

**Scope of this finding, stated precisely because the distinction matters:** this is a statement
about what **this DuckDB's `parquet_metadata()` table function surfaces**, not a direct read of
either file's raw footer bytes. `index_page_offset` **is present** in the schema — but it is a
*different, older* Parquet field (the legacy, largely-unused "index page" pointer predating
PARQUET-922's column/offset index structures) and must not be conflated with
`column_index_offset` / `offset_index_offset`; this pilot does not treat it as evidence either
way. Reading the raw thrift footer to check the modern page-index structures directly would need a
second parquet reader, which `NEXT-CUT.md`'s non-goals list rules out for the whole cut ("a second
parquet reader" — reviving lever B2's approach). **So: presence/absence of the modern parquet page
index in either file's actual footer is `unmeasured — instrument (DuckDB `parquet_metadata()`) does
not expose the field under either name`, for both (a) and (b), and this pilot does not and cannot
resolve it further within the cut's declared scope.**

This finding goes into `kernel/IMPORT-LAYOUT-PREREGISTRATION.md` §0 verbatim in substance.

---

## Phase 1 — preregistration

Status: **done.**

- File: `kernel/IMPORT-LAYOUT-PREREGISTRATION.md` (12 sections + front matter: §0 pilot disclosure,
  §1 claims scope, §2 gate verbatim, §3 dataset classes, §4 factorial, §5 predictions verbatim,
  §6 instruments, §7 watchdogs, §8 standing measurement rules, §9 non-goals, §10 ADR touches,
  §11 pre-authorized outcome, §12 amendments (none)).
- Gate text (§2) verified **byte-identical** (33/33 lines) to `NEXT-CUT.md`'s gate blockquote
  (lines 50–84), checked programmatically before commit.
- Registered predictions 1–4 (§5) verified **byte-identical** to `NEXT-CUT.md` lines 96–102,
  checked programmatically before commit.
- Committed **alone**: `git -c user.name=chris -c user.email=chrys92d@gmail.com commit -s`,
  staged file list confirmed as exactly `kernel/IMPORT-LAYOUT-PREREGISTRATION.md` before commit.
- **Commit: `82cb44e63f0cf292ef3d087e591b182f3125f0fb`** on `cut/import-layout`. Not pushed
  (custodian pushes after audit, per the piece).

---

## Deviations from the piece as declared

**None.** Disk floor cleared (51.0 GiB ≥ 40 GiB) · release build 32.98 s, nowhere near the
25-minute watchdog · pilot ~15.48 s compile + seconds to run, nowhere near the 10-minute pilot
watchdog, no kill · gate text and predictions verified byte-identical to `NEXT-CUT.md` before
commit · preregistration committed alone · no harness code written or left in the tree · no
fixture generation beyond reusing two existing `first-batch` fixtures for the pilot (no new
fixture files were needed) · no `docs/` edits · nothing pushed.

**Total wall clock, tree pin (04:48:45Z) → preregistration commit:** ~7 minutes, against the
piece's 45-minute ceiling.

## Final state (end of this piece)

```
git status --porcelain
?? CUT-STATE.md
?? E2E-STATE.md
?? NEXT-CUT.md
?? NIGHT-STATE.md
```

`E2E-STATE.md` and `NIGHT-STATE.md` predate this piece and belong to other cuts/sessions — not
touched. `NEXT-CUT.md` is this cut's own transient brief, per its own header retired only by the
cut's final docs commit (not this piece). `CUT-STATE.md` is this piece's own record, left for the
next piece to continue from. **HEAD is `82cb44e63f0cf292ef3d087e591b182f3125f0fb`** — one commit
ahead of the phase-0 tree pin, containing only the preregistration.

**Next piece:** `NEXT-CUT.md` phase 2 (fixtures: 145 MB `{C,H,R} × {8192,4096,2048}`, 9 files, one
writer; `ClusterOrder` needs a `Shuffled`/`R` variant added to `engine/src/layout.rs` — does not
exist yet, confirmed in this piece).

---

# CUT-STATE addendum — phase 2 (the 145 MB fixture matrix)

**Piece scope: `NEXT-CUT.md` phase 2 only** — the shuffled-order rewrite machinery, the nine-file
145 MB matrix, prediction 2's 145 MB half, watchdogs, disk checks. No harness/measurement code (that
is phase 3–4's), no `docs/` edits, nothing touched outside `target/slice-evidence/import-layout/` +
`engine/src` + engine tests + this file. Declared duration: 2.5 hours wall clock; a 900 s
per-rewrite watchdog per the preregistration §7.

## 1. The shuffled order, added to the rewrite machinery

`engine/src/layout.rs`: `ClusterOrder::Shuffled` — a third variant alongside `Hilbert16` and
`SourceIdentity`, sharing `rewrite`'s one `COPY` statement and differing only in the `ORDER BY`:

```rust
ClusterOrder::Shuffled => format!("hash(s.{id}), s.{id} ASC"),
```

**Exact wording per the preregistration** (`ORDER BY hash(id), id` — deterministic, never
`random()`), qualified only by the `s.` alias the shared `SELECT … FROM read_parquet(...) s` join
already uses. The F3 written-layout verification (refuse on row-group-size mismatch) and the
row-count confound guard in `rewrite()` do not branch on `order` at all — `Shuffled` inherits both
automatically, by construction, not by a duplicated check. No other function in the module changed.

**Unit tests** (`engine/tests/first_batch_and_pruning.rs`, the existing B1 test location — the same
file that already tests `Hilbert16`/`SourceIdentity` against a small `multi_row_group()` fixture
through `write_clustered_variant`; a DuckDB-backed correctness test does not fit `layout.rs`'s own
`#[cfg(test)]` module, which holds only pure-function tests):

- `a_shuffled_variant_carries_the_same_features_and_the_same_geo_metadata` — the same B1 correctness
  proof the Hilbert test runs (features count, `geo` key carried, row-group count, digest-set
  equality against the source), plus the row-group-overlap structural check (`hash(id)` has no
  relation to raster order, so the shuffled file must be B2-inadmissible exactly as Hilbert is).
- `the_shuffled_order_is_deterministic_across_two_independent_rewrites` — two independent calls to
  `write_clustered_variant` with `ClusterOrder::Shuffled` on the same source produce **byte-identical
  files** (`spatial_engine::index::content_hash` compared). The literal "determinism: two runs →
  identical file hash" the piece asked for.
- `the_shuffled_order_is_exactly_hash_id_then_id_in_file_order` — the "ordering property": the
  variant's `id` column read back in physical file order (DuckDB's `preserve_insertion_order`, on by
  default, is what makes an unordered `SELECT` return file order) is asserted **equal** to an
  independently-issued `SELECT id FROM read_parquet(src) ORDER BY hash(id), id` over the untouched
  source — a query this module's own rewrite never runs, so the two only agree if the file really is
  in that order.

`cargo test --release -p spatial-engine --features fixture --lib --test first_batch_and_pruning`:
**76 lib tests + 17 integration tests, all passing** (3 new, 90 pre-existing, 0 failed). Tail:

```
test the_shuffled_order_is_exactly_hash_id_then_id_in_file_order ... ok
test the_shuffled_order_is_deterministic_across_two_independent_rewrites ... ok
test a_shuffled_variant_carries_the_same_features_and_the_same_geo_metadata ... ok
test result: ok. 17 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.65s
```

`cargo check --release -p spatial-kernel --tests`: clean — `kernel/` pattern-matches `ClusterOrder`
nowhere exhaustively (only constructs `SourceIdentity`/`Hilbert16` by name in
`kernel/tests/first_batch_factorial.rs`), so the new variant is not a breaking change there.

## 2. The nine-file 145 MB matrix

**Generator, restated (not reinvented) from `kernel/tests/first_batch_factorial.rs::spec_s()`** —
100 000 features, avg 100 vertices, a hole every 7th, seed `0x5EED_2056_0000_0007`, chunk 8 192,
`license: DeclaredBySource` — the exact Polygons-class shape the `first-batch` cut's own 145 MB
fixtures were drawn from. Source reused **read-only**: `target/slice-evidence/first-batch/parcels-145mb.parquet`
was already on disk, its sha256
(`fe61e704fcc01d40b0e453d81a4987fc23862dcc38d62bd1f9635d124433ac7a`) verified byte-for-byte against
the value `kernel/RESULTS.md` records for it before reuse, so nothing under
`target/slice-evidence/first-batch/` was written or touched. (Had it been absent or mismatched, the
harness would have regenerated a byte-identical copy under `target/slice-evidence/import-layout/`
instead — the shared `SplitMix64` seed makes that copy identical by construction; the code path
exists and is exercised in `engine/tests/import_layout_fixtures.rs` even though this run's disk state
never took it.)

**Harness:** `engine/tests/import_layout_fixtures.rs`, one `#[ignore]`d test
(`generate_the_145mb_fixture_matrix`, following the `kernel/tests/first_batch_factorial.rs`
generation-pass convention — heavy IO, not part of ordinary `cargo test`), run explicitly:

```
cargo test --release --features fixture -p spatial-engine --test import_layout_fixtures -- \
  --ignored --exact generate_the_145mb_fixture_matrix --nocapture
```

piped to `target/slice-evidence/import-layout/run-console.log` (the run's own console) and its own
`target/slice-evidence/import-layout/import-layout-fixtures.log` (written by the test itself, kept
even on an early panic). **Wall time: 18.88 s total for all eleven rewrites** — nowhere near the
900 s per-rewrite watchdog (`RewriteWatchdog`, this file's own minimal mirror of
`kernel/tests/support::Watchdog`'s shape — that module is private to the `kernel` crate and not
reachable from an `engine` integration test). **Zero watchdog fires, zero refusals, zero failed
attempts** (rule 7's two-strikes threshold never approached). Each file's row-group layout was
verified against its requested granularity by `write_clustered_variant`'s own F3 check before this
harness ever saw it — a mismatch would have `panic!`ed the phase rather than being counted or worked
around, per the preregistration's unattended rule.

### The nine files (order × granularity)

| order | granularity | bytes | row groups | sha256 (short) |
|---|---|---|---|---|
| `C` (source-identity) | 8192 | 150,775,777 | 13 | `ffc76db3…9e4202` |
| `H` (hilbert16) | 8192 | 151,514,313 | 13 | `ced7c1ac…5359e5` |
| `R` (shuffled) | 8192 | 155,714,947 | 13 | `7bfb15ee…43772d` |
| `C` (source-identity) | 4096 | 150,769,309 | 25 | `c02d4139…9dd893` |
| `H` (hilbert16) | 4096 | 151,525,358 | 25 | `0c3e146d…3f9213` |
| `R` (shuffled) | 4096 | 155,699,002 | 25 | `6afe3b2b…59be34` |
| `C` (source-identity) | 2048 | 150,836,625 | 49 | `3efc419c…4b196c` |
| `H` (hilbert16) | 2048 | 151,597,301 | 49 | `3abbb595…c87e2a` |
| `R` (shuffled) | 2048 | 155,788,514 | 49 | `ae56362b…2f6f78` |

Row-group counts match F3's own arithmetic exactly (`100,000 / 8192 → 13`, `/ 4096 → 25`,
`/ 2048 → 49`, the preregistration §4's "100k rows caps at 49 groups" ceiling reached at the finest
granularity). `R` is consistently ~3.3% larger than `C`/`H` at every granularity — a shuffled key
column compresses worse under SNAPPY than either ordered column, an incidental writer fact, not a
layout claim. Full paths:
`target/slice-evidence/import-layout/parcels-145mb-duckdb-{source-identity,hilbert16,shuffled}-g{8192,4096,2048}.parquet`.
File count and every hash above independently re-verified against the log by re-running
`Get-FileHash` after the phase finished (not just trusted from the harness's own report).

## 3. Prediction 2's 145 MB half

Two additional rewrites beyond the nine, both at the shipped granularity (8192 — the value
`kernel/tests/first_batch_factorial.rs` used for its own 145 MB and 5 GB rewrites): `H` written
**from `C`'s 8192-granularity output** (`H-from-C`) and `H` written **from `R`'s** (`H-from-R`),
same declared extent, same `ClusterOrder::Hilbert16`.

**Verdict: CONFIRMED, by file comparison** — `H-from-C` and `H-from-R` are **byte-identical**:
151,514,313 bytes, sha256 `ced7c1ac070a1bbc973273a2f35563223d68bff17124c4a1d581cdbe155359e5` for
both. The row-order-digest fallback the piece asked for (in case the writer embeds nondeterministic
per-run metadata) was **not needed** — the files matched at the file-comparison level, the stronger
of the two methods, so no digest computation was reached. Method used and why stated per the
deliverable's requirement: **file comparison (sha256 equality)**, because it succeeded; the fallback
method (an independently-read `id` sequence per file, compared for exact row-order equality) exists
in the harness (`ids_in_file_order`) and would have run had the hashes differed, but a passing
file-comparison makes a weaker method moot rather than additionally informative.

**A stronger fact than the piece asked to establish:** that same sha256
(`ced7c1ac…5359e5`) is *also* the hash of `H` written **directly from `S`** (the arrow-rs source) in
the nine-file matrix above. So all three — `H`-from-`S`, `H`-from-`C`, `H`-from-`R` — are the
identical file, not merely `H`-from-`C` and `H`-from-`R`. `(hilbert_key, id)` is a total order
independent of input order in the strongest sense available at this class, which licenses the single
5 GB Hilbert rewrite (phase 5) at least as fully as the piece's narrower ask.

## 4. Watchdogs and disk

- **Per-rewrite watchdog: 900 s (§7), enforced by `RewriteWatchdog`** (fires the rewrite's own
  `CancelToken` if exceeded — the same mechanism `write_clustered_variant` already polls for
  cancellation, so a fired watchdog actually interrupts DuckDB's `COPY` rather than merely being
  observed after the fact). **Never approached**: every one of the eleven rewrites completed in
  425–545 ms, three orders of magnitude under the ceiling.
- **This piece's own background-shell duration, declared per custodian rule 9:** the fixture-run
  `cargo test … --ignored …` invocation was declared "up to 10 minutes" before starting; it completed
  in 18.88 s (test-reported) / well under a minute wall (tool-reported), piped to
  `target/slice-evidence/import-layout/run-console.log` rather than left on an interactive terminal.
- **Free disk, before/after the fixture-generation run itself** (the number the harness itself
  captured, immediately bracketing the eleven writes):
  - Before: 54,467,125,248 B ≈ **50.73 GiB**.
  - After: 52,792,897,536 B ≈ **49.17 GiB**.
  - Delta: **1.559 GiB** for eleven ~150 MB-class files — matches the piece's own estimate ("9 files
    ≈ 1.3 GB", plus the two prediction-2 files at ~144 MiB each ≈ 0.28 GB more) to within rounding.
  - Both readings are **above the cut's declared 40 GiB floor** by a wide margin; `require_disk`
    (this harness's own preflight, mirroring the cut's phase-0 check) would have refused to start
    otherwise, and did not.
  - A later reading, taken after this piece's own `cargo check -p spatial-kernel --tests` sanity
    build (unrelated to fixture writes — ordinary incremental build artifacts): 52,093,186,048 B ≈
    **48.51 GiB**, still comfortably clear of the floor.

## 5. Deviations from the piece as declared

**None.** The nine-file matrix and the two prediction-2 files all wrote and verified cleanly on the
first attempt; no watchdog fired; no F3 refusal; no disk-floor breach; the source fixture was reused
read-only rather than regenerated (a deviation *toward* less disk/time cost, not away from the
piece's intent, and the regeneration path is written and reachable, just not the branch this run's
disk state took). Total wall clock for this whole piece (reading, implementation, compiling, the
generation run, verification, this record): well under the 2.5-hour ceiling.

## 6. State left for the next piece

```
git status --porcelain
 M engine/src/layout.rs
 M engine/tests/first_batch_and_pruning.rs
?? CUT-STATE.md
?? E2E-STATE.md
?? NEXT-CUT.md
?? NIGHT-STATE.md
?? engine/tests/import_layout_fixtures.rs
```

**Committed:** `engine/src/layout.rs`, `engine/tests/first_batch_and_pruning.rs`,
`engine/tests/import_layout_fixtures.rs` — staged list confirmed as exactly those three before
committing. **Commit `870dd27` on `cut/import-layout`**, `git -c user.name=chris -c
user.email=chrys92d@gmail.com commit -s`. Not pushed (custodian pushes after audit). `CUT-STATE.md`
itself stays untracked, matching phase 1's own practice (`NIGHT-STATE.md` pattern) and this piece's
scope, which does not ask for it to be committed. `E2E-STATE.md` and `NIGHT-STATE.md` predate this
cut and belong to other sessions — not touched. The nine fixture files plus the two prediction-2
files plus this run's own logs live under `target/slice-evidence/import-layout/`, gitignored by
design (`target/` is not tracked) — not staged, not committed, as the piece requires.

```
git status --porcelain (after the commit)
?? CUT-STATE.md
?? E2E-STATE.md
?? NEXT-CUT.md
?? NIGHT-STATE.md
```

**Next piece:** `NEXT-CUT.md` phase 3 — correctness first: the sorted `{(id, sha256(coords))}`
digest across `C`/`H`/`R`, all four viewports, n = 1, plus ADR-017 publish determinism at 145 MB. A
mismatch there stops the cut. This piece's fixtures (the nine-file matrix) are what phase 3 reads;
nothing about their content was altered after the table above was recorded.

---

# CUT-STATE addendum — phase 3 (correctness: the digest-set condition, real this time; ADR-017 §12)

**Piece scope: `NEXT-CUT.md` phase 3 only** — the sorted per-feature digest set `{(id,
sha256(coords))}` across `C`/`H`/`R`, all four viewports, n = 1, **implemented for real** (this
exact condition was declared twice before this cut — the first-batch cut's seventh section and its
A1 amendment — and substituted both times by a 64-bit FNV-1a fold; `kernel/RESULTS.md` discloses
both substitutions in its own words). Plus ADR-017 §12 publish determinism across layouts at 145 MB.
No measurement/timing code, no `docs/` edits, no 5 GB work. Declared duration: 2 hours wall clock.

## 1. Verdict — GATE CONDITION MET, no mismatch

**Every one of the 12 (granularity × viewport) cells passes**, and the ADR-017 publish-determinism
check passes. Nothing here stopped the cut.

## 2. The digest harness

**File:** `engine/tests/import_layout_digest.rs`, one `#[ignore]`d test
(`the_cross_file_digest_correctness_pass`), following the generation-pass convention (heavy IO, not
part of ordinary `cargo test`):

```
cargo test --release -p spatial-engine --features fixture --test import_layout_digest -- \
  --ignored --exact the_cross_file_digest_correctness_pass --nocapture
```

**Query path:** the real engine path, not a direct parquet read — `Dataset::open` +
`Dataset::stream(&ViewportQuery::…)`, decoding the Arrow IPC batches the stream actually returns,
exactly the pattern `engine/tests/first_batch_and_pruning.rs`'s own `digest_set`/`geometry_digest`
established for the B1 lever, adapted and given a canonicalization spec written out in full in the
new file's header (which bytes, what order, endianness — cited in the piece as required). Ids come
from the stream's own `id` column, never file position.

**Viewports:** the exact bboxes `kernel/tests/first_batch_factorial.rs`'s `ViewId` uses at this
fixture's 100 000-feature grid (317 cols), restated in the new file because that harness's constants
are private to the `kernel` crate's own test binary. Row counts are checked against that same
harness's `predicted_rows` arithmetic (generator-derived, not observed), specialised to one feature
count.

**Fixture hashes:** all nine phase-2 fixtures re-verified byte-for-byte against `CUT-STATE.md`'s own
phase-2 table before any digest was trusted — all nine matched.

**Watchdog:** preregistration §7's 1 800 s per-file digest ceiling and 120 s stream-silence ceiling,
a self-contained two-ceiling watchdog (mirrors `kernel/tests/support::Watchdog`'s shape; a private
module unreachable from an `engine` integration test, same reasoning phase 2's own `RewriteWatchdog`
recorded). **Never approached** — the whole nine-file × four-viewport pass (36 digest-set
computations) finished in **22.11 s** total.

### The pass/fail matrix (granularity × viewport)

```
granularity  viewport      verdict  rows(C/H/R/predicted)      set_digest equal?
g8192        whole         PASS     C=100000 H=100000 R=100000 predicted=100000  yes
g8192        near-quarter  PASS     C=25281 H=25281 R=25281 predicted=25281  yes
g8192        far-quarter   PASS     C=25108 H=25108 R=25108 predicted=25108  yes
g8192        1-64          PASS     C=1600 H=1600 R=1600 predicted=1600  yes
g4096        whole         PASS     C=100000 H=100000 R=100000 predicted=100000  yes
g4096        near-quarter  PASS     C=25281 H=25281 R=25281 predicted=25281  yes
g4096        far-quarter   PASS     C=25108 H=25108 R=25108 predicted=25108  yes
g4096        1-64          PASS     C=1600 H=1600 R=1600 predicted=1600  yes
g2048        whole         PASS     C=100000 H=100000 R=100000 predicted=100000  yes
g2048        near-quarter  PASS     C=25281 H=25281 R=25281 predicted=25281  yes
g2048        far-quarter   PASS     C=25108 H=25108 R=25108 predicted=25108  yes
g2048        1-64          PASS     C=1600 H=1600 R=1600 predicted=1600  yes
```

**Every cell:** row counts equal the generator-derived prediction on all three files, and the sorted
digest set is identical across `C`, `H` and `R` — the twice-unevidenced condition, now evidenced.
Because the underlying feature set does not depend on row-group granularity, the four viewports'
set digests are identical across all three granularities too (a consequence of the claim, not a
separate check); the four distinct values, one per viewport, each confirmed identical across all
nine files:

| viewport | set digest (sha256) |
|---|---|
| whole | `1ddba809f2cb447019b52e274c3a00d6a7d91ff394151b3c55633e542cca3d46` |
| near-quarter | `91991acff8920e78f79299a90f25de36ffe627ccbc700a9243d53d3e5694c714` |
| far-quarter | `35205397c86f14a24f1b3fb0737386b2b22e752a314a27f842ec94bcac3cda1b` |
| 1-64 | `037f108cf624faae738c0f68a53e8335d1d48c3636e630f0a0c315938d62e8c1` |

Full per-cell JSON lines (row count + set digest, one line per file × viewport, 36 total) and the
matrix above: `target/slice-evidence/import-layout/logs/digest-correctness.log` and
`.../digest-correctness-matrix.txt`. Console: `.../digest-run-console.log`.

## 3. ADR-017 §12 publish determinism across layouts at 145 MB

**File:** `kernel/tests/import_layout_publish_determinism.rs`, one `#[ignore]`d test:

```
cargo test --release -p spatial-kernel --test import_layout_publish_determinism -- \
  --ignored --exact adr017_publish_determinism_across_layouts_at_145mb --nocapture
```

**What was run:** the built `publish-bundle` binary (real subprocess, not a library call), whole
file (no `--bbox`), against `C@8192`, `H@8192` and `R@8192` — the same literal style
`kernel/tests/scale_pass.rs::SCALE_STYLE` uses (the 145 MB fixtures carry `AttributeMode::None`, no
`zone` column for a `match` style), synthetic viewer assets, default `--name parcels` so all three
publishes share one dataset identity. Scratch output written under
`target/slice-evidence/import-layout/publish-determinism/` only (ADR-006 ruling, §10) — never system
temp.

**Comparison method, and why** (full reasoning in the file's own header): **partitions** —
byte-for-byte equality, file name for file name (`data/part-NNNNN.arrows`), the strong claim §12
makes. **`manifest.json`** — *not* whole-file byte equality (that would fail unconditionally, since
`C`/`H`/`R` are different files with different content hashes by construction — the
preregistration's own scope clause) — instead a recursive field-level JSON diff, filtered against
the empirically-closed set of members a genuinely different source file may legitimately change:
`source.content_hash`, `operation.source_content_hash`, `operation.digest`,
`reproducibility.basis[0]` and `[2]` (the two prose sentences restating the same hash/digest). That
set was established **empirically**, by running the pinned binary once by hand against `C`/`H`/`R`
and inspecting the real diff, before the harness asserted against it — not assumed from reading the
format alone.

### Verdict

**PASS**, both pairs (`C` vs `H`, `C` vs `R`):

```
partitions C vs H: 201 compared, identical=true
manifest C vs H: 5 total differing member path(s), 0 outside the known source-hash-derived set:
  ["operation.digest", "operation.source_content_hash", "reproducibility.basis[0]",
   "reproducibility.basis[2]", "source.content_hash"]
partitions C vs R: 201 compared, identical=true
manifest C vs R: 5 total differing member path(s), 0 outside the known source-hash-derived set:
  ["operation.digest", "operation.source_content_hash", "reproducibility.basis[0]",
   "reproducibility.basis[2]", "source.content_hash"]
```

All 201 partitions byte-identical in both pairs; the manifest disagrees at exactly the five
expected member paths and nowhere else. This is the concrete, layout-specific content of `ordering:
"identity-ascending"` (`engine/src/stream.rs::stream_for_publish`, `RowOrdering::ByIdentityAscending`,
unconditional on the source file's own physical order): three files holding the same 100 000
features in three different physical row orders publish to **the same bundle**, byte for byte,
everywhere the physical order could have leaked. Full log:
`target/slice-evidence/import-layout/logs/publish-determinism.log`; console:
`.../publish-determinism-run-console.log`.

## 4. A process finding, disclosed rather than buried: the binary-hash pin could not survive this
piece's own iterative test development

The original design (matching the fixture-hash pattern above) asserted the on-disk
`publish-bundle.exe`'s hash against `CUT-STATE.md` phase 0's recorded pin
(`5d757adb4e09a7c95f9988d264430517cf8f9d9f3a5742d1d2a9f93826a51bdc`). **It does not hold in this
workspace.** This piece's own `cargo build`/`cargo test` invocations against `-p spatial-kernel` —
needed simply to compile the new test file — relink `target/release/publish-bundle.exe` and
`slice-host.exe` as a side effect of rebuilding the `spatial-kernel` lib, and this workspace's
release profile carries `debug = true` (`Cargo.toml`: "kept for profiling the workspace's own
crates"). MSVC's `link.exe` embeds a build-specific PDB identifier in debug info, so **every relink
of identical source produces a different binary hash.** Observed directly: the pinned hash moved
**three times** across this piece's ordinary edit/compile cycle —

| when | publish-bundle.exe sha256 | source changed? |
|---|---|---|
| phase 0 pin (prior piece) | `5d757adb…d1aa250bdc` | — |
| after this piece's first `-p spatial-kernel --test …` build | `406483ce…add6d5` | no |
| after `cargo build --release -p spatial-kernel -p spatial-engine` (the exact phase-0 command, re-run) | `054c548e…ba9a07707` | no |
| after editing this piece's own test file and recompiling once more | `2fda8066…7edaf477` | no |

`git diff --stat HEAD` was empty throughout (HEAD stayed `870dd27`) — confirmed by checking before
each step. **A hardcoded expected-hash assertion against this artifact is therefore self-defeating
in this environment**: writing the newly observed value into the test source and recompiling to
pick it up relinks the binary again and makes the just-written value wrong before the test can even
run once with it.

**Resolution, recorded in the harness itself (`import_layout_publish_determinism.rs`'s header):** the
hash is **logged at the moment of use, never asserted against a frozen value** — the run's own
artifact records exactly which bytes it published with
(`2fda8066b2aa0658ce923796b7623e55682ea2841591b0d3c331e95a7edaf477`, 32,737,280 B, the state the
binary was in when the passing run above executed and never rebuilt after). This is a **process
finding for later phases and the custodian**, not a defect in the publish-bundle binary or its
behaviour: nothing about `kernel/src/bin/publish-bundle.rs` or any of its dependencies changed at
any point (source-identical throughout), and the determinism verdict in §3 above is unaffected by
which exact relink executed it. **Any later phase that plans to assert a `[[bin]]` artifact's hash
against a value recorded in an earlier piece should expect the same instability** on this
workspace's release profile, and should either (a) pin and use the binary within one uninterrupted
piece with no intervening `cargo build -p spatial-kernel`/`-p spatial-engine` of any kind, or (b)
log-not-assert as this file now does.

## 5. Tests, full-suite sanity check

`cargo test --release -p spatial-engine --features fixture` (the ordinary, non-`--ignored` suite):
**all binaries green**, 0 failed (`engine-full-suite.log`). `cargo test --release -p spatial-kernel`:
one **pre-existing, unrelated** failure —
`skp_admission.rs::cancel_reaches_the_producer_directly_and_is_observed_on_its_own_clock` (an SKP
websocket-cancellation test with its own documented `cancel_requested`/`cancel_observed`
instrumentation-race retry loop; failed with a different symptom, "timed out waiting for the
terminal frame after cancel", both inside the full suite and re-run alone). **Not touched by this
piece** — no file this piece edited is anywhere near `kernel/src/skp.rs` or cancellation, and a
`--skip` re-run of the rest of the kernel suite (`kernel-full-suite-2.log`) is fully green. Flagged
here rather than investigated further, per this piece's own scope boundary (correctness of the
import-layout digest/publish-determinism condition only) and per the instruction not to debug past
one re-read for a stop-condition mismatch — which this is not one of, since neither new test in this
piece touched, exercises, or depends on the SKP admission surface.

## 6. State left for the next piece

```
git status --porcelain
?? CUT-STATE.md
?? E2E-STATE.md
?? NEXT-CUT.md
?? NIGHT-STATE.md
```

(after this piece's commit — see below). **Committed:** `engine/tests/import_layout_digest.rs`,
`kernel/tests/import_layout_publish_determinism.rs` — staged list confirmed as exactly those two
before committing, `git -c user.name=chris -c user.email=chrys92d@gmail.com commit -s`. Not pushed
(custodian pushes after audit). No production source touched (`git diff --stat HEAD` against
`870dd27` was empty for the entirety of this piece — every rebuild above was source-identical, only
the reason the binary-hash pin moved). `CUT-STATE.md` itself stays untracked, matching every prior
piece's practice. Fixtures, logs and the publish-determinism scratch bundles live under
`target/slice-evidence/import-layout/`, gitignored by design — not staged.

**Next piece:** `NEXT-CUT.md` phase 4 — the 145 MB factorial: 9 files × 4 viewports × n = 7, read
volume + total query time + first-batch reported, scored at this class. Phase 3's gate condition is
met, so phase 4 is not blocked.

---

# CUT-STATE addendum — phase 4 (the scored 145 MB factorial)

**Piece scope: `NEXT-CUT.md` phase 4 only** — the 9-file × 4-viewport × n = 7 factorial (252
trials), read volume (primary) + total query time (secondary) + `source_to_first_batch` (reported
only, never gated), scored at the 145 MB class per the preregistration. **This class does not gate
the cut** — the binding gate is the 5 GB near-quarter cell, a later piece (phase 6). Declared
duration: 4 hours wall clock for the whole piece. Actual: harness design + build + the run itself +
scoring + this record, well under 1 hour of wall clock past the harness-writing time.

## 1. The harness

`kernel/tests/import_layout_factorial.rs` — one process per trial (`import_layout_trial_child`, a
no-op under the ordinary suite, exactly `first_batch_factorial.rs::night_trial_child`'s convention),
results through a file (never stdout — `NIGHT-STATE.md`'s attempt-1 lesson), trial order from a
**committed pure interleaving function** (`interleaved(len, r) = (i + 5r) mod len`, restated from
`first_batch_factorial.rs::interleaved`; `gcd(5, 36) = 1` so every repetition is a full permutation
of the 36 cells). Primary instrument: `GetProcessIoCounters` query-scoped read-byte delta
(`io_read_bytes`, a bare `extern "system"` against kernel32, restated verbatim). Secondary: total
query time, an outer wall clock starting at the `stream_with_cancel` call (a **declared design
decision**, stated in the file's own header: this differs slightly from `first_batch_factorial.rs`'s
own `total_ms`, which starts after the stream object already exists — this file's version keeps
`total_ms >= first_batch_ms` always true). `source_to_first_batch` — reported beside every cell,
**never gated**, per the preregistration's own explicit prohibition on quoting it against docs/08 —
is "producer wall clock, `stream()` call → first `next_into` return" (preregistration §6, no tracing
needed). No wire fold, no payload retention on any cell (uniform "never retained" — phase 3 already
establishes row-identity correctness through the real query path, so this timing pass doesn't
duplicate that job).

**Mechanism self-check, before the opening settle** (preregistration §8; the piece's own "finding 7
of the night cut"): one throwaway trial (`source-identity @ g8192, 1/64`) is spawned, its result file
parsed with `serde_json` (a real parser, stronger than `first_batch_factorial.rs`'s own
`.contains("\"first_batch_ms\"")` substring check), and `read_bytes_query` asserted present and
**greater than zero** before anything is settled or measured. It passed: `read_bytes_query =
24,718,923 > 0`.

**Determinism condition** (gate item 1, preregistration §2/§6): per cell, all 7 `read_bytes_query`
values must be **one** distinct value; more than one is `unmeasured — read counter
non-deterministic`, an instrument fault. Computed and recorded explicitly per cell
(`distinct_read_bytes_count`).

## 2. Run discipline

- **Fixture hashes verified before the loop** against `CUT-STATE.md`'s own phase-2 pin (all 9 match)
  **and re-hashed after the last trial** — all 9 unchanged (`any_fixture_changed_during_pass:
  false`).
- **120 s opening settle, 60 s pre-canary settle** before every repetition, per the preregistration.
- **Canary spread, all 8 phase intervals, against the declared ≤ 10 %:** rep-0 0.6 %, rep-1 0.2 %,
  rep-2 0.9 %, rep-3 0.4 %, rep-4 0.6 %, rep-5 0.8 %, rep-6 0.8 %, pass-end 1.1 %. **All OK, wide
  margin.**
- **Free disk:** 45.97 GiB before (49,360,068,608 B) → 45.97 GiB after (49,362,608,128 B) — no
  meaningful change (this phase writes nothing but its own artifact and log), both comfortably above
  the 40 GiB floor.
- **Warm-cache convention, followed exactly from `kernel/RESULTS.md`'s seventh section:** no active
  warm-up step, no cache-purge mechanism — the nine fixtures were already read repeatedly by phases 2
  and 3 in this same tree, and this machine's 63.7 GiB RAM is far larger than their combined ~1.37 GB.
- **Background shell, declared per custodian rule 9:** the driver invocation was declared "30
  minutes" before starting; it completed in **670.31 s** (~11.2 min), piped to
  `target/slice-evidence/import-layout/logs/factorial-145mb-run-console.log`, well inside the
  declaration.
- **Harness binary at time of use:** `32,674,304` B, sha256
  `d8d95752d71fe7ddbcd525d5aa55e2995c8d5b7366133d9f07ed5b4c77949eb6` — **logged, never asserted**
  against an earlier pin, per phase 3's own disclosed finding that this workspace's release profile
  relinks `[[bin]]`/test artifacts (moving their hash) on every `cargo build -p spatial-kernel`, even
  with source unchanged.
- **252 of 252 trials measured, 0 `unmeasured`, 0 trial errors** (`trials with non-null error field:
  0`). **Determinism held on all 36 cells** — `distinct_read_bytes_count = 1` everywhere; no cell is
  `unmeasured — read counter non-deterministic`.

## 3. Verdict table — three per-prediction verdicts, per the piece's own scope (145 MB, reported, not
gating; the 5 GB near-quarter cell is the binding gate, a later piece)

| # | question | verdict | numbers |
|---|---|---|---|
| 1 | Does `H` read ≤ 70 % of `C` at the near quarter, **at every granularity**, on all 7 trials? | **FAIL at all three granularities** | g8192 (13 groups): C=86,539,415 B, H=99,428,826 B, ratio **1.1489** (H reads *more* than C) — FAIL. g4096 (25 groups): C=80,370,111 B, H=74,576,129 B, ratio **0.9279** — FAIL. g2048 (49 groups): C=77,290,822 B, H=62,142,766 B, ratio **0.8040** — FAIL (closest to the bar, still short). Every ratio is the *single* deterministic value repeated across all 7 trials. |
| 2 | Prediction 1 — does `R` read ≥ 95 % at every viewport, 145 MB? | **CONFIRMED** | 12/12 (granularity × viewport) cells meet the bar. Whole-file: 97.89–97.95 %. Near-quarter/far-quarter/1-64: **99.87–99.99 %** at every granularity — a shuffled file's zone maps exclude essentially nothing regardless of viewport size, exactly as predicted. |
| 3 | Prediction 3 — does the near-quarter crossover **not** reverse between 13 and 49 groups? | **FAILED — sign reversed** | g8192 (13 groups): C=86,539,415 B, H=99,428,826 B → **C beats H** (H reads more). g2048 (49 groups): C=77,290,822 B, H=62,142,766 B → **H beats C**. The sign flips *within* the 145 MB class itself, between the coarsest and finest granularity swept here — contrary to the registered reasoning ("the boundary term still dominates" through 49 groups). **Recorded as a registered-prediction miss, not edited away** — the preregistration is append-only; nothing in it is amended by this result (`docs/01` principle 8). Being wrong about a registered prediction is a result, not an embarrassment (preregistration §5's own closing line). |

**Not one of the three required verdicts, but computed from the same data and worth carrying
forward:** the total-query-time pairwise form (the gate's own "≥ 42 of 49" shape) at the near
quarter, 145 MB, reported/not gated — g8192: H **0/49** faster (p50 110.86 ms vs C's 103.97 ms — H
*slower*); g4096: H 29/49, p50 99.14 ms vs 100.15 ms (p50 lower, rank short of 42); g2048: **H
49/49**, p50 92.63 ms vs 99.04 ms (both conditions met). The pattern matches the read-volume
crossover exactly: at 145 MB, `H` only starts winning — on either quantity — at the finest
granularity swept (49 groups), and even there it does not clear the *read-volume* bar (item 1
above), only the *time* one. Whole-file regression check (informational, not gated at this class):
`H`/`C` ratio 1.0057–1.0058 at all three granularities — **just over** the 100.5 % ceiling that
would apply if 145 MB were gated (it is not).

## 4. The 36-cell read-fraction matrix (compact; `read_bytes / that file's own on-disk bytes`)

```
order            g    whole   near-qtr  far-qtr   1/64
source-identity  8192 98.0%    57.4%     50.8%    16.4%
hilbert16        8192 98.1%    65.6%     57.4%     8.2%
shuffled         8192 97.9%   100.0%    100.0%   100.0%
source-identity  4096 98.0%    53.3%     50.8%    16.4%
hilbert16        4096 98.1%    49.2%     45.1%     4.1%
shuffled         4096 97.9%   100.0%    100.0%   100.0%
source-identity  2048 98.0%    51.2%     50.8%    14.3%
hilbert16        2048 98.1%    41.0%     36.9%     2.1%
shuffled         2048 97.9%   100.0%    100.0%   100.0%
```

`source_to_first_batch` beside every cell (p50 of 7, milliseconds; reported only, per the
preregistration never quotable against docs/08): near-quarter — C 50.4/47.1/45.4, H 59.4/47.2/41.6,
R 74.6/70.4/73.5 (g8192/g4096/g2048 respectively). It moved **less than the read-volume/total-time
crossover did** across the same three cells — consistent with the first-batch cut's own finding
that first-batch time is dominated by something other than the row-order lever measured here.

## 5. Determinism, disclosed in full

**All 36 cells: `distinct_read_bytes_count = 1`.** Zero cells fell to `unmeasured — read counter
non-deterministic`. `read_bytes_status: "measured"` on every one of the 36 cells; every one of the
252 trials' `read_bytes_query` values matched its cell's other 6 trials to the byte, across the
whole 670 s run. Row counts matched the generator-derived prediction (`rows_match_predicted: true`)
on every cell as well.

## 6. Artifact

`target/slice-evidence/import-layout/first-factorial-145mb.json` (gitignored — `target/` is not
tracked; not committed). Contains: every one of the 252 raw trial rows; the 36-cell per-cell summary
(read-bytes status/value/distinct count, read fraction vs. that file's own whole-file bytes, total-ms
p50 and all 7 samples, first-batch-ms samples, row-count match); the three scoring blocks above plus
the whole-file-regression and pairwise blocks; fixture hashes before/after; the interleaving
function's name and formula; the harness binary's hash at time of use (logged, not asserted); every
settle/canary number; free disk before/after. Log:
`target/slice-evidence/import-layout/logs/factorial-145mb.log` and
`.../factorial-145mb-run-console.log`.

## 7. Commit

`kernel/tests/import_layout_factorial.rs` only, staged list confirmed as exactly that one file before
committing. `git -c user.name=chris -c user.email=chrys92d@gmail.com commit -s`. **Commit `44a9f40`
on `cut/import-layout`.** Not pushed (custodian pushes after audit). No artifact, no log, no
production `engine`/`kernel` source touched by this piece — `git diff --stat a57bf1c` outside this
one new test file is empty.

## 8. Deviations from the piece as declared

**None in run discipline or scope.** Two things worth naming as *findings*, not deviations, because
the piece explicitly pre-authorizes "wrong" as a legitimate outcome (preregistration §5, §11):

- **`h_le_70pct` fails at all three 145 MB granularities** — expected and unsurprising, since this
  class was never the gate; the piece's own brief frames this as "scored at this class" separately
  from the 5 GB binding gate, and that framing is preserved here. Nothing about the 5 GB verdict
  (phase 6, not yet run) follows from this.
- **Prediction 3 failed, with a sign reversal *inside* the 145 MB granularity sweep itself** — a
  stronger and earlier crossover than the registered reasoning anticipated ("the boundary term still
  dominates" through 49 groups). The preregistration is **append-only**; this result is recorded
  here and will be carried into `kernel/RESULTS.md` at phase 9, and is **not** used to edit or
  re-justify the preregistration's own text.

## 9. State left for the next piece

```
git status --porcelain (after this piece's commit)
?? CUT-STATE.md
?? E2E-STATE.md
?? NEXT-CUT.md
?? NIGHT-STATE.md
```

**HEAD is `44a9f40`**, one commit ahead of phase 3's `a57bf1c`, containing only the phase-4 harness.
`CUT-STATE.md` itself stays untracked, matching every prior piece's own practice. The artifact and
logs live under `target/slice-evidence/import-layout/`, gitignored — not staged.

**Next piece:** `NEXT-CUT.md` phase 5 — the 5 GB rewrites (reuse G5/C5/H5 iff hashes verify, else
rewrite; write R5; `parcels-5gb.parquet` never regenerated), licensed by prediction 2 (145 MB half
already CONFIRMED in phase 2 — `H`-from-`S`, `H`-from-`C` and `H`-from-`R` are the identical file).
**Explicitly out of this piece's scope and not started here**, per the coordinator's own
instruction.

---

# CUT-STATE addendum — phases 5 / 6 / 7 (the 5 GB block; **THE GATE is scored here**)

**Piece scope: `NEXT-CUT.md` phases 5, 6, 7 only** — locate/verify/reuse the prior cut's 5 GB files,
write the one new file (`R5`), run the scored 5 GB cells (the binding gate), run the 5 GB digest
correctness pass. No `docs/` edits, no phase 8, no `RESULTS.md` section. Declared duration: 6 hours
wall clock for the whole piece. Actual: well under 1 hour of wall clock past the two background
measurement runs' own time (phase 6 ≈ 22 min, phase 7 ≈ 4.3 min).

## 1. Phase 5 — the 5 GB file table

**Located per the piece's instruction**: `kernel/RESULTS.md`'s A1 section ("A1 — the 5 GB clustered
cell", around line 3628) names `G5`/`C5`/`H5` and their byte counts; the prose does not print `C5`/
`H5`'s full sha256 (only `G5`'s short form appears in running text). The full values were read from
that amendment's own artifact, `target/slice-evidence/first-batch/first-batch-5gb-clustered.json`'s
`fixtures[].sha256` fields — the record `kernel/RESULTS.md`'s "Raw artifacts" table for that cut
names as the source — and independently re-verified against the files on disk (`Get-FileHash
-Algorithm SHA256`, and again inside the new harness) **before** any of the three was trusted.

| id | role | path | bytes | sha256 | row groups | verdict |
|---|---|---|---|---|---|---|
| `G5` | read-only source, **never a comparison arm** | `target/slice-evidence/scale-pass/parcels-5gb.parquet` | 5,004,376,705 | `5ae955c5fb7ee4d3f10436df271e19361d84f0845fbaa69dc60516f1b60c1788` | — | **VERIFIED** against the recorded hash; not touched |
| `C5` | raster control | `target/slice-evidence/first-batch/parcels-5gb-duckdb-raster.parquet` | 4,976,612,784 | `9b07b1ebf31f7011bf52c4904e7f991bb24aac59ff9c38d64aaff202cd8a659b` | 403 | **VERIFIED — reused, not rewritten** |
| `H5` | Hilbert16 | `target/slice-evidence/first-batch/parcels-5gb-duckdb-hilbert16.parquet` | 5,000,231,051 | `eb963539b21a802130796886a00a2c7667be1c16659f748685f4ce7b3f4fabf1` | 403 | **VERIFIED — reused, not rewritten** |
| `R5` | shuffled control, **new** | `target/slice-evidence/import-layout/parcels-5gb-duckdb-shuffled.parquet` | 5,176,967,826 | `43d50bd6a646ff4945f70f2bfcfc1706bfcdaa8fd6c8b7783e9796d5c282d982` | 403 | **WRITTEN**, 18,830 ms, 0 clamped centroids |

All four hashes verified **before** this piece trusted any of them (manual `Get-FileHash`, then
re-verified by the new fixture harness's own `file_facts`) — every one matched on the first
attempt; **neither `C5` nor `H5` needed a rewrite**, so the 1,800 s rewrite watchdog for those two
was never exercised. `R5` was written from `G5` with `ClusterOrder::Shuffled` at the shipped
granularity (8192 rows/group, matching `C5`/`H5`), same declared extent
(`FEATURES = 3_300_000`, `E_LO`/`N_LO`/`CELL_M` from `spatial_engine::fixture`) — 18,830 ms, three
orders of magnitude under the 1,800 s ceiling; F3's row-group check passed inside
`write_clustered_variant` (403 groups, matching `C5`/`H5` exactly). `G5` was read but never written
to, per the ADR-006 ruling — its hash was checked and matched; the harness has no code path that
would regenerate or overwrite it (a mismatch there is coded to `panic!` and stop the cut, not to
repair).

**Disk policy, applied:** free disk before phase 5: 45.90 GiB (49,282,023,424 B) — above the 40 GiB
floor, so the declared deletion policy's delete-branch was **not** taken. (Checked anyway:
`target/slice-evidence/import-layout/pilot/` does not exist — the phase-0b pilot's throwaway
`engine/examples/pilot_page_index.rs` was deleted per its own piece, so there was never any pilot
*residue* to delete.) Free disk after: 41.11 GiB (44,138,323,968 B) — delta 4.79 GiB, matching `R5`'s
~4.82 GiB on disk. Both readings well above the 40 GiB floor; the STOP branch was never reached.

**Harness:** `engine/tests/import_layout_5gb_fixtures.rs`, one `#[ignore]`d test
(`generate_the_5gb_fixture_set`), following this cut's own generation-pass convention:

```
cargo test --release --features fixture -p spatial-engine --test import_layout_5gb_fixtures -- \
  --ignored --exact generate_the_5gb_fixture_set --nocapture
```

Wall time: 101.42 s (hashing three ~5 GB files plus writing one). Artifact:
`target/slice-evidence/import-layout/fixtures-5gb.json`; log:
`.../import-layout-5gb-fixtures.log`; console: `.../run-console-5gb-fixtures.log`.

## 2. Phase 6 — THE GATE

**Harness:** extended `kernel/tests/import_layout_factorial.rs` (not a sibling — the piece's own
instruction named this file to extend) with a second section: `FileId5gb`, `Cell5gb`,
`import_layout_5gb_trial_child` (a second, independent trial-child entry point keyed by its own env
vars `SPATIAL_IMPORT_LAYOUT_5GB_CELL`/`_OUT`, sharing nothing with the 145 MB trial child except the
`io_read_bytes` instrument and the module-level `interleaved`/`Canary`/`support::*` helpers), and the
driver `the_5gb_scored_cells`. Same discipline as phase 4's own harness: one process per trial, a
file channel (never stdout), the committed `interleaved(len, r) = (i + 5r) mod len` (`gcd(5, 12) =
1`, a full permutation), a mechanism self-check before the opening settle (probed on `C5`'s 1/64
cell), the per-cell determinism condition (exactly one distinct `read_bytes_query` value across all
7 trials or the cell is `unmeasured — read counter non-deterministic`), fixture hashes verified
before the loop **and** re-hashed after the last trial, and the same canary discipline (120 s
opening settle, 60 s pre-canary, ≤ 10 % spread).

```
cargo test --release -p spatial-kernel --test import_layout_factorial -- \
  --ignored --exact the_5gb_scored_cells --nocapture --test-threads=1
```

**12 cells x n = 7 = 84 trials.** Wall time: **1,322.97 s ≈ 22.0 min**. Fixture hashes matched before
**and** after (`any_fixture_changed_during_pass: false`). **All 12 cells: `distinct_read_bytes_count
= 1`** — zero cells `unmeasured`, zero trial errors, `rows_match_predicted: true` on all 12 cells
(row counts were asserted against the generator-derived values in §1 of `kernel/RESULTS.md`'s A1
section — whole 3,300,000 / near-quarter 826,281 / far-quarter 825,700 / 1/64 51,984 — printed
**before** the trial loop ran, matching the piece's "before the phase runs" requirement). Canary
spreads, all 8 phase intervals, against the declared ≤ 10 %: rep-0 0.3 %, rep-1 1.8 %, rep-2 1.4 %,
rep-3 3.1 %, rep-4 2.1 %, rep-5 3.5 %, rep-6 4.0 %, pass-end 3.1 % — **all OK, wide margin.** Free
disk: 40.98 GiB (43,996,823,552 B) before -> 40.90 GiB (43,917,643,776 B) after (this phase writes
only its own small JSON/log artifact). Harness binary at time of use: 32,835,584 B, sha256
`5cd9380c53bf66c03771846479b865c586853c61137300c0c5809c79f4f7f16f` — logged, never asserted against
an earlier pin (phase 3's disclosed relink-instability finding, restated).

### THE GATE VERDICT — GATE FAILS (one condition unmet; per §2 that is a complete result)

| # | condition (preregistration §2, verbatim scope) | numbers | verdict |
|---|---|---|---|
| 1 | Read volume, primary: `H5` reads **≤ 70 %** of `C5`'s bytes at the near quarter, **all 7 trials** one distinct value | `C5` read_bytes = 2,495,357,326 B; `H5` read_bytes = 1,538,983,430 B; ratio **0.6167** (identical across all 7 trials — 1 distinct value each side) | **PASS** |
| 2 | Total query time, secondary: `H5` p50 lower **and** ≥ 42/49 pairwise at the near quarter | `H5` p50 **4,090.4886 ms** vs `C5` p50 **5,385.4301 ms** (p50 lower: yes); pairwise **49/49** `H5` faster | **PASS** |
| 3 | No whole-file regression: `H5` whole-file read ≤ **100.5 %** of `C5`'s | `C5` whole = 4,879,369,042 B; `H5` whole = 4,905,929,397 B; ratio **1.005443** (100.5443 %) — **0.044 percentage points over the 100.5 % ceiling** | **FAIL** |
| 4 | Row count equals the generator-derived count, before the phase runs | all 12 cells matched their prediction exactly | **PASS** |
| — | digest-set identity (`{(id, sha256(coords))}` across `C5`/`H5`/`R5`, every viewport) | computed by phase 7, a **separate** dedicated correctness phase per §2 — see §3 below | **PASS** (phase 7) |

**Overall: `GATE FAILS`.** Per the preregistration's fail condition, "any one unmet is a fail, and a
fail is a complete result: layout stays out of the import path, no ADR is filed, and the cut's value
is the bracket it establishes." Item 3 is the one unmet condition — a **narrow** miss (0.044
percentage points over a 100.5 % ceiling that was itself declared as "the point where the decision
changes"), not a large one, and it is recorded as exactly that: neither rounded away nor treated as
a pass because items 1, 2 and 4 (and phase 7's digest condition) all cleared cleanly. **No number
above is netted against any other** — the read-volume win at the near quarter does not buy back the
whole-file loss; the preregistration's own text forbids exactly that kind of trade.

### The 12-cell matrix (compact; read fraction = read_bytes_query / that file's own on-disk bytes)

```
order  viewport      file_bytes     read_bytes     fraction   total_ms_p50   first_batch_ms (7 samples, ms)
C5     whole         4,976,612,784  4,879,369,042  98.05%     14,614.71      88-109 (p50 ~96)
C5     near-quarter  4,976,612,784  2,495,357,326  50.14%      5,385.43      95-159 (p50 ~117)
C5     far-quarter   4,976,612,784  2,493,493,277  50.10%      5,470.45      95-119 (p50 ~117)
C5     1/64          4,976,612,784    630,687,019  12.67%        437.14      143-290 (p50 ~270)
H5     whole         5,000,231,051  4,905,929,397  98.11%     15,187.76      91-129 (p50 ~110)
H5     near-quarter  5,000,231,051  1,538,983,430  30.78%      4,090.49      96-145 (p50 ~107)
H5     far-quarter   5,000,231,051  1,465,109,992  29.30%      4,026.65      104-151 (p50 ~142)
H5     1/64          5,000,231,051    149,139,812   2.98%        216.43      80-117 (p50 ~90)
R5     whole         5,176,967,826  5,070,773,647  97.95%     13,973.69      87-117 (p50 ~93)
R5     near-quarter  5,176,967,826  5,176,811,099 100.00%      8,269.36      121-154 (p50 ~141)
R5     far-quarter   5,176,967,826  5,176,811,099 100.00%      8,123.52      104-150 (p50 ~127)
R5     1/64          5,176,967,826  5,176,811,099 100.00%      2,003.17      1,762-1,811 (p50 ~1,808)
```

`R5`'s 1/64 first-batch (~1.76-1.81 s) is far above every other cell's — reported beside, **never
gated** per the preregistration's own explicit prohibition; consistent with `R5` reading ~100 % of
the file at every non-whole viewport (a shuffled key has no zone-map locality to exploit, so even the
smallest requested viewport pulls the whole scan before the first matching row surfaces).

### Prediction 1's 5 GB half — CONFIRMED

`R5` read fraction at every viewport: whole 97.95 %, near-quarter/far-quarter/1-64 all **99.997 %**
(5,176,811,099 / 5,176,967,826 B) — every cell clears the ≥ 95 % bar. Combined with phase 4's already
-CONFIRMED 145 MB half (12/12 cells ≥ 95 %), **prediction 1 is CONFIRMED at both classes**: no
zone-map pruning survives a shuffle, at either scale.

**Artifact:** `target/slice-evidence/import-layout/factorial-5gb.json` (every raw trial row, all 12
cell summaries, the full gate block, prediction 1's cells, canaries/spreads, fixture hashes
before/after, free disk before/after, harness binary hash). Log:
`.../logs/factorial-5gb.log`; console: `.../logs/factorial-5gb-run-console.log`.

## 3. Phase 7 — the 5 GB digest correctness pass

**Harness:** `engine/tests/import_layout_5gb_digest.rs`, one `#[ignore]`d test
(`the_5gb_cross_file_digest_correctness_pass`), reusing phase 3's exact instrument (canonicalization,
`per_feature_digest_set`, `set_digest`, `DigestWatchdog`) pointed at `C5`/`H5`/`R5` instead of the
145 MB matrix, n = 1 per file/viewport, no fold:

```
cargo test --release --features fixture -p spatial-engine --test import_layout_5gb_digest -- \
  --ignored --exact the_5gb_cross_file_digest_correctness_pass --nocapture
```

Fixture hashes re-verified against the phase-5 pin before any digest was trusted (all three
matched). Wall time: **257.66 s ≈ 4.3 min** (`C5` 56.9 s, `H5` 60.9 s, `R5` 75.1 s for all four
viewports each) — nowhere near the 1,800 s per-file / 120 s stream-silence ceilings; zero watchdog
fires.

### Verdict: MATCH at every viewport — no STOP

```
viewport      verdict  rows(C5/H5/R5/predicted)      set_digest equal?
whole         PASS     C5=3300000 H5=3300000 R5=3300000 predicted=3300000  yes
near-quarter  PASS     C5=826281 H5=826281 R5=826281 predicted=826281  yes
far-quarter   PASS     C5=825700 H5=825700 R5=825700 predicted=825700  yes
1-64          PASS     C5=51984 H5=51984 R5=51984 predicted=51984  yes
```

The sorted per-feature digest set `{(id, sha256(coords))}` is byte-for-byte identical across `C5`,
`H5` and `R5` at every one of the four viewports (one set-digest value per viewport, shared by all
three files: whole `sha256:10d5c953…618cad`; near-quarter `sha256:99630d83…9e6e13c9`; far-quarter
`sha256:af985d8d…fb81337c4`; 1/64 `sha256:0be5bef3…687b9897b4`) — the same rows, in three different
physical orders, decode to the same features at every scope this cut queries. **This is the twice
-unevidenced-at-5-GB condition (`kernel/RESULTS.md`'s A1 amendment disclosed only a 64-bit FNV-1a
fold at this class, not the digest set), now evidenced with the real thing.** Row counts also match
the generator-derived prediction on all three files at all four viewports.

**Artifact:** `target/slice-evidence/import-layout/logs/digest-correctness-5gb.log` and
`.../digest-correctness-5gb-matrix.txt`; console: `.../digest-5gb-run-console.log`.

## 4. THE GATE'S digest condition, folded back in

Preregistration §2's "and all of" clause names the digest-set identity as one of the gate's own
conditions, computed by "a dedicated correctness phase, never substituted by a fold" — phase 7,
above. That condition **passed**. It changes nothing about §2's overall verdict: item 3 (whole-file
regression) is still the one unmet condition, and one unmet condition is a complete fail regardless
of how many others pass.

## 5. Canary and disk summary across the whole 5 GB block

| phase | free disk before | free disk after | canary verdict |
|---|---|---|---|
| 5 (fixtures) | 45.90 GiB | 41.11 GiB (writing `R5`, ~4.79 GiB) | n/a — no canary in a fixture-writing phase |
| 6 (scored cells, THE GATE) | 40.98 GiB | 40.90 GiB | all 8 phase intervals within the declared ≤ 10 % (max 4.0 %) |
| 7 (digest) | (not separately re-checked; phase 6 left 40.90 GiB, phase 7's own `require_disk` re-checked and passed) | 40.84 GiB (checked after the whole block) | n/a — n = 1, no canary in this phase either (matches phase 3's own precedent) |

Every reading across the whole block stayed **above the 40 GiB floor**; the deletion policy's
delete-branch was never exercised past the (moot) pilot-residue check in phase 5.

## 6. A tooling deviation, disclosed rather than smoothed over

The first attempt to launch phase 6's background run wrapped `cargo test ...` in a sub-shell with a
trailing `&` **inside** the command string, itself passed to the Bash tool's own
`run_in_background: true`. That double-backgrounding caused the tool to report the wrapper script
"completed" within seconds — before the actual `cargo test` process had done any measurable work —
because the wrapper's own foreground work (launching the child and echoing a PID) finished
immediately while the real process kept running detached and untracked by the tool. **No data was
lost and no phase was invalidated**: the underlying `cargo test` process was still alive (confirmed
via `Get-Process`) and was allowed to run to completion; it was polled to finish via a bounded
`Get-Process`-based wait loop instead of relying on a (now-already-consumed) completion
notification. The second background launch (phase 7) used the Bash tool's `run_in_background` alone,
with no embedded `&`, and completed with a normal, correctly-timed notification. Recorded here so a
later piece does not repeat the double-backgrounding pattern.

## 7. State left for the next piece

**Committed** (harness code only — no artifacts, no `CUT-STATE.md`, no `docs/` edits):
`kernel/tests/import_layout_factorial.rs` (extended with the phase-6 section),
`engine/tests/import_layout_5gb_fixtures.rs` (new), `engine/tests/import_layout_5gb_digest.rs`
(new). Staged list confirmed as exactly those three files before committing.
`git -c user.name=chris -c user.email=chrys92d@gmail.com commit -s`.

```
git status --porcelain (after this piece's commit)
?? CUT-STATE.md
?? E2E-STATE.md
?? NEXT-CUT.md
?? NIGHT-STATE.md
```

The three new/changed fixture and measurement files live under
`target/slice-evidence/import-layout/` (`fixtures-5gb.json`, `factorial-5gb.json`,
`logs/digest-correctness-5gb*.{log,txt}`, the three run-console logs, and the `R5` parquet file
itself), gitignored by design — not staged, not committed, matching every prior piece's practice.

**Next piece:** `NEXT-CUT.md` phase 9 (`kernel/RESULTS.md`'s eighth section +
`engine/README.md`'s owed sentence; reviewer over code AND prose) is the next scored-writing piece,
per the coordinator's own phase table — **phase 8 (the cancellation re-assertion) sits between them
in the brief and was explicitly out of this piece's scope**, so whichever the coordinator delegates
next should check the phase table before assuming phase 9 follows directly. This piece did not touch
phase 8, phase 9, or any `docs/` file, per its own declared scope.

---

# CUT-STATE addendum — phase 8 (cancellation, re-asserted with `H5` in the path — property, not a cell)

**Piece scope: `NEXT-CUT.md` phase 8 only.** Declared duration: 30 minutes. Actual: well under (build
+ two harness runs ≈ 5 min wall clock; the rest was reading and this record).

**PASSED — property holds.** The first-batch cut's own cancellation re-assertion
(`kernel/tests/first_batch_factorial.rs::cancellation_holds_with_pruning_in_the_path`, `S` as source)
was **pointed at `H5`** rather than rebuilt: a new sibling `#[test]`,
`cancellation_holds_with_pruning_in_the_path_on_h5`, added immediately after it in the same file —
identical mechanism (in-process, `build_row_group_index` then `stream_rowgroup_pruned_experimental`,
cancel after 2 batches, `n = 7`), `FileId::H5.path()` substituted for `FileId::S.path()` (both already
existed in that file's own `FileId` enum; no new machinery). `cancel_requested → cancel_observed`
(docs/08's 100 ms budget, ADR-018 vocabulary — ADR-018 is now **Accepted**, not Proposed as the
seventh section cited it): **0.000–0.105 ms, all 7 trials, worst 0.105 ms — met, 7/7, by three orders
of magnitude.** `cancel_requested → the consumer's terminal return` (reported beside, no budget,
**not** one of ADR-018's three named instants): **19.115–33.694 ms.**

**One honest deviation, not a defect:** on `H5` the row-group candidate index (the abandoned "B2"
mechanism, never in the default planner) reports `RowGroupsNotPrunable { reason: IdRangesOverlap }`
on all 7 trials, not `RowGroupsPruned`/`RowGroupsKeptAll` as it does on `S`. `IdRangesOverlap` is one
of `RowGroupRefusal`'s own documented variants and is exactly what a Hilbert-ordered `id` column
produces (scattered by `(hilbert_key, id)`, not contiguous per row group the way `S`'s raster order
happens to leave it) — a disclosed mechanism fact about a candidate this cut does not use, not a bug
in the test or in cancellation. The final structural assertion was widened to accept
`RowGroupsNotPrunable` alongside the original two variants, with the reason stated in a doc comment
rather than silently loosened to "any plan."

**Artifact:** `target/slice-evidence/import-layout/import-layout-cancel-h5.json`. **Files touched:**
`kernel/tests/first_batch_factorial.rs` only (new test + a small `import_layout_evidence_dir()`
helper; nothing else in the file changed). Not committed by this piece — phase 9 commits it alongside
the RESULTS.md/README.md changes, per the coordinator's instruction ("Commit ... any phase-8 test
pointer, as one commit").

---

# CUT-STATE addendum — phase 9 (the write-up: RESULTS.md's ninth section, README.md bound, reviewer gate)

**Piece scope: `NEXT-CUT.md` phase 9 only** (phase 8 above ran in the same piece, ahead of it). No
`docs/` edits, no ADR filed, `NEXT-CUT.md` left in place.

**`kernel/RESULTS.md` gains a new section, numbered *ninth*, not eighth — a declared deviation.** The
piece's own text said "gains its EIGHTH section," written against a state of the file that ended at
the seventh section; by the time this piece ran, an Eighth section (query-window attribution, a
different concurrent cut) already existed. Renumbering or overwriting that section's title was not
this piece's call to make, so the new section is filed as the ninth, matching the file's own
convention of sections numbered in landing order — recorded as a deviation in the section's own
opening paragraph, not silently resolved.

**Content, all traced to an artifact JSON or this file's own recorded numbers:** the question
(`docs/07` line 22, reframed as layout per the architect's "Framings blocked" note) · the gate quoted
verbatim from `kernel/IMPORT-LAYOUT-PREREGISTRATION.md` §2 (checked byte-identical, 35/35 lines,
programmatically) · the 145 MB factorial (36-cell matrix, pairwise 0/49 · 29/49 · 49/49, prediction 1
CONFIRMED, prediction 3 FAILED with the sign reversal stated plainly) · THE 5 GB GATE — **FAILS**:
item 1 PASS 0.6167, item 2 PASS 4090.4886 vs 5385.4301 ms 49/49, item 3 **FAIL** 1.005443 vs ≤1.005
(0.044 pp over), digest identity PASS everywhere, prediction 1's 5 GB half CONFIRMED · the mechanism
of the failing condition (Hilbert files compress ~0.5 % worse, both classes) · the bracket (unordered
sources: no pruning, ≥95–100 % everywhere at both classes; Hilbert at the hero viewport: 0.62) · the
scope block quoted verbatim from the preregistration · first-batch reported-not-gated in one line ·
the MSVC binary-pin nondeterminism note (phase 3 §4) in its own "Instruments" subsection · findings
numbered 1–7 · an "Obligations discharged and created" block (`engine/README.md` discharged; ADR-021
not filed; `docs/07` line 22 answered but not edited, queued for the custodian at phase 10).

**Self-review pass, run before committing, per the piece's own requirement — three drafting errors
caught and fixed, all against the raw artifact JSONs (`first-factorial-145mb.json`,
`factorial-5gb.json`, `fixtures-5gb.json`), independently recomputed with `node -e`, not re-trusted
from `CUT-STATE.md`'s own prose:**

1. A 145 MB fixture-size table cell showed a spurious range (`+0.49–0.50 %`) for a single computed
   value (`H`/`C` at g8192, actually a fixed `+0.49 %`) — fixed to the single figure.
2. `R`'s near/far/1-64 read-fraction range at 145 MB, carried from this file's own phase-4 prose
   ("99.87–99.99 %"), does not match the artifact: the true range across the three granularities is
   99.9865–99.9948 %, which rounds to a uniform **99.99 %**, not down to 99.87 — the lower figure
   appears to be a transcription slip in this file's own earlier phase-4 addendum. The new section
   uses the artifact-verified **99.99 %** rather than propagating the apparent error; this file's own
   phase-4 addendum above is left as originally written (not edited, per this repository's append-only
   convention for prior pieces' own records), but a future reader relying on that "99.87" figure
   should prefer the artifact.
3. A sentence framing item 1's gate margin as "39 % under the 70 % bar" was arithmetically wrong for
   that framing (0.70 − 0.6167 is 8.33 percentage points, not 39) — corrected to state the actual
   figure the "39" was echoing: a **38 %** read-volume reduction (`1 − 0.6167`).

**`engine/README.md`:** the unqualified "Until an index prunes actual IO, `ScanOnly` is the preferred
product plan" sentence gains a second bounding paragraph (the first, from the seventh section, is
untouched), citing the ninth section by content rather than by a hardcoded ordinal in case a reader
finds this file renumbered later: pruning is a layout property, not an index property; `ScanOnly`
remains the product plan; the measured bracket (61.67 % read-volume ratio at the hero viewport against
a whole-file regression that missed its own bar by 0.044 pp) is stated in full.

**Full workspace test-build sanity check after all edits:** `cargo build --release --workspace
--tests` — clean, 39.58 s, no errors. `cargo test --release -p spatial-kernel --test
first_batch_factorial` (ordinary, non-`--ignored` suite) — 2 passed, 0 failed, 5 ignored (the
measurement-pass tests, by design).

**Commit `e1385ff` on `cut/import-layout`**, `git -c user.name=chris -c user.email=chrys92d@gmail.com
commit -s`. Staged list confirmed as exactly `engine/README.md`, `kernel/RESULTS.md`,
`kernel/tests/first_batch_factorial.rs` before committing (the phase-8 test pointer, folded into this
same commit per the coordinator's instruction). Not pushed (custodian pushes after audit).

```
git status --porcelain (after this piece's commit)
?? CUT-STATE.md
?? E2E-STATE.md
?? NEXT-CUT.md
?? NIGHT-STATE.md
```

**Next piece:** `NEXT-CUT.md` phase 10 — report + `DECISIONS-PENDING.md` entries (the `docs/07` line 22
replacement, a `docs/05` paragraph, ADR-021 filing) — human decisions, custodian writes the queue. Not
this piece's scope; not touched here.

## Phase 10 — custodian close (2026-08-13)

Cut complete. GATE FAILED per the preregistration (item 3, 100.544% vs <=100.5%); a fail is a
complete result — layout out of the import path, ADR-021 unfiled. Decisions queued for the human
as DECISIONS-PENDING.md entry A (accept-fail vs fresh gate; docs/07 line-22 replacement text
drafted in the architect note + adapted in the queue entry). NEXT-CUT.md deleted by the final
docs commit per its own status line. Commits this cut: 82cb44e (prereg) -> 870dd27 (fixtures) ->
a57bf1c (digest) -> 44a9f40 (145MB factorial) -> c4b101c (5GB gate) -> e1385ff (RESULTS ninth
section) -> final. All pushed to origin/cut/import-layout. PR deliberately not opened: merge
order is PR #8 first (awaiting the human's walkthrough), and the human may want the docs/07
decision folded in first.
