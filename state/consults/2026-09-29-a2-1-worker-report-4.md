# A2-1 — the gate-2 correction round 2 worker's report (2026-09-29)

*Custodian's filing note: the worker-high's hand-back for correction round 2 on `cut/b1-close-nul-names-2`, covering both gate-2 reports (`state/consults/gates/2026-09-29-a2-1-gate2-architect.md` and `-reviewer.md`); pushed a2e8810..f4d81c5. It is copied from the hand-back message with the harness's two-space indent removed. There is one disclosed rewrite: each branch-only `path:line` token (6 of them) is de-rooted to the path, the word lines, the numbers and (branch), since verify-cites would otherwise read them against main's tree. Before gating, the custodian re-checked the report's central claims at f4d81c5: the three control-test bodies hash identically at c37b427 and f4d81c5; N-14 reads leases before and after for p1a and p1b; K-2's hostile fixture is hashed before and after; N-10's real id is UInt64 and asserted; there is no manifest or data-plane diff; and every commit is signed off. The report's grep for the mutex is right for the two files it names; the only other matches in `engine/tests/` are in an existing file this PR does not touch.*

---

Gate-2 correction round 2 for PR #143 (`b1-close-nul-column-names`) is complete. Worktree `C:\dev\wt\b1-close-nul-names`, branch `cut/b1-close-nul-names-2`, pushed range `a2e8810..f4d81c5`. `git status --porcelain` is empty at the end.

## 1. Commits (pushed a2e8810..f4d81c5, in order)

- `a3be169` fix(engine): remove the unproven test serial mutex; N-14 asserts before-any-lease; correct observation citations
- `cffce51` docs(engine): fixture.rs section comment no longer calls the hostile-names local write richer or control-only
- `02cfbd5` docs(engine): identity_verification_scans names N-10 and N-11 as callers beside admission_instruments.rs
- `4c3c512` fix(engine): N-10 writes E8's p3 shape with the real id as UInt64 and asserts its type
- `e8cf4bc` fix(kernel): K-2's hostile fixture is hash-verified and its eighth case no longer mislabeled N-4; N-3's c02 uses the P0 order
- `f4d81c5` style: rustfmt hunks on this branch's own added lines in attributes.rs and skp.rs

All six `git commit -s`, all name "(B1-PROJECTION-PREREGISTRATION.md, Amendment 12; gate-2 correction round 2)".

## 2. Disposition table

| ID | Disposition | Evidence |
|---|---|---|
| A-B1 (SERIAL hides a failure) | fixed at `a3be169` | `grep -n "SERIAL\|serial_guard" engine/tests/b1_projection_hostile_names.rs engine/tests/b1_projection_hostile_covering.rs` — no output. Non-reproduction confirmed by my own W1 runs (§3 below). |
| A-B2 (controls changed / fixture.rs comment false) | fixed at `a3be169` (controls restored byte-identical) and `cffce51` (comment corrected) | control-test hashes below; `engine/src/fixture.rs lines 997 (branch)` now reads "unchanged since c37b427 ... used by every test in that file, control and hostile alike" |
| A-B3 (N-6/N-15 observation on uncommitted tree) | fixed at `a3be169` | `engine/tests/b1_projection_hostile_names.rs lines 611-612 (branch)` cites the gate-1 reviewer at 303dca0 for N-6; N-15's equivalent cites the gate-2 reviewer at b4d7aa1 |
| A-B4 (N-14 no "before any lease") | fixed at `a3be169` | `grep -n leases_before engine/tests/b1_projection_hostile_covering.rs` — 4 pairs (p1a, p1b) |
| A-B5 (K-2 hostile fixture unhashed) | fixed at `e8cf4bc` | `grep -n hostile_fixture_sha_before kernel/tests/skp_projection.rs` — before/after pair added for the eighth case |
| A-B6 (N-3's "c02" is really c03) | fixed at `e8cf4bc` | `kernel/tests/skp_projection.rs lines 1134-1135 (branch)`: `zone\0x` (Int64) written ahead of `zone` (Utf8), the P0 output's own order |
| A-B7 (N-10 not E8's p3 file) | fixed at `4c3c512` | `engine/tests/b1_nul_native_id_scan_once.rs lines 46,116-117 (branch)`: real `id` is `DataType::UInt64`, asserted via `ds.file_schema()` |
| A-B8 (instrument doc doesn't name N-10/N-11) | fixed at `02cfbd5` | `engine/src/dataset.rs lines 84,86 (branch)` names both; caller grep (§ below) confirms exactly 3 callers total |
| A-B9 (branch-commit hash in Amendment 12) | already fixed by the custodian at `a2e8810` before this round — not in my scope | — |
| R-B1 (N-14 leases) | fixed at `a3be169` | same as A-B4 |
| R-B2 (K-2 unhashed) | fixed at `e8cf4bc` | same as A-B5 |
| R-B3 (N-3 not c02) | fixed at `e8cf4bc` | same as A-B6 |
| R-B4 (N-10 not p3) | fixed at `4c3c512` | same as A-B7 |
| R-B5 (SERIAL breaks controls + unproven claim) | fixed at `a3be169` | same as A-B1/A-B2 |
| R-B6 (N-6/N-15 name no commit) | fixed at `a3be169` | same as A-B3 |

**Left as instructed (gate suggestions, untouched):** N-3 exact equality; N-13 k2 at kernel level; a publish `ColumnUnknown` detail test; `covering_not_addressable_reason`'s prose; a reader for `nul_offset`; the extra N-16 assertion; N-15's metadata key.

**Caller grep for A-B8:** `grep -rn "identity_verification_scans()" engine/tests/` shows exactly three call sites: `admission_instruments.rs` (unchanged), `b1_nul_native_id_scan_once.rs` (N-10), `b1_nul_declared_identity_no_scan.rs` (N-11) — matching the doc.

## 3. W1 reproduction attempt

Made `serial_guard()` a no-op locally (fresh leaked `Mutex` per call, uncommitted) and added a temporary `eprintln!` of the SQL in Debug form on every `prepare` failure in `predicate.rs::bind_admit`, `stream.rs::produce`, and `dataset.rs::run_identity_scan` (also uncommitted, reverted before any commit — confirmed by `git diff` showing no residual change to those three files).

Runs (all `timeout 30`, all green):
- `b1_projection_hostile_names`, default threads: 30/30 pass, 0 `W1-REPRO` prints.
- `b1_projection_hostile_names`, `--test-threads=12`: 30/30 pass, 0 prints.
- `b1_projection_hostile_covering`, default threads: 30/30 pass, 0 prints.
- `b1_projection_hostile_covering`, `--test-threads=12`: 30/30 pass, 0 prints.

120/120 runs green, no reproduction — consistent with the gate-2 reviewer's own 80 unserialized runs. Per the brief, this means the mutex, its rationale and `SERIAL` are removed with no stop condition and no harness fix required.

**Control-test body hashes** (function-body only, `fn` line through closing `}`, `sha256sum`):
| Test | c37b427 | HEAD (`f4d81c5`) |
|---|---|---|
| `hostile_names_round_trip_to_their_own_columns` | `376a60fd722cedc42c4545138716ac262b903e33f16bbffd7f7d6ba5f5dad018` | same |
| `hostile_names_colliding_after_case_folding_bind_one_column_each` | `442b400ab2ab9156148d611a55d6af0a4dd3dc73308a6b2b249394269e496049` | same |
| `hostile_names_an_uppercase_id_under_a_mapped_identity_is_admitted_beside_id` | `cf9ca25e9d8b6640dd78c55e7b0c815bc3eb347d385da5e0566d7b87070cb53f` | same |

All three byte-identical at both commits.

## 4. Power-check mutation table (12.2's own mutation, applied alone, `--exact`, reverted, porcelain confirmed empty after every revert)

| Test | Mutation | Failing assertion observed |
|---|---|---|
| N-1 | `probe_schema` returns the export's names | `left: ["id","geometry","nu"] right: ["id","geometry","nu\0l"]` |
| N-7 | same mutation | `left: [...,"zone"] right: [...,"zone\0x"]` |
| N-12 | same mutation | `must never reach a raw query error: identity scan prepare: Binder Error: Referenced column "key" not found...` |
| N-1a | `render_visible_escape` returns the name unchanged | `ColumnNameNotAddressable detail: "the resident name \`nu\0l\`..."` (raw NUL present) |
| N-2 | `not_addressable` always returns `None` | `expected ColumnNameNotAddressable, got Ok(AdmittedProjection { fields: [Field { name: "zone\0x", data_type: Int64... }` |
| N-6 | `namespace_admit` inserts every field unconditionally | `Num is filterable: Filter(RejectedByBinder { detail: "nul byte found in provided data at position: 155" })` |
| N-8 | name check removed from `check_geometry_column` | `expected GeoMetadata, got Ok` |
| N-9 | `candidate_identity_columns`'s U+0000 filter dropped | `the NUL-named column must never be offered as a candidate: ["id\0x"]` |
| N-15 | DESCRIBE swapped for `SELECT name FROM parquet_schema(?) OFFSET 1` | `c07: ... left: [""] right: ["C2"]` |
| N-13 (engine) | `covering()` returns the declared covering regardless of usability | `a covering whose path is not addressable is not usable` |
| N-14 | `sanity_check`'s path check skipped | `left: Metadata right: NotChecked` |
| N-10 | `admit_identity` matches by exported name | `open must succeed, native on the real \`id\`: IdentityUnusable { column: "id", ... }` |
| N-3 | name rule moved into `admit_projection`'s pass 1 only, dropped from `check_geometry_and_identity` | `column \`nu l\` marked projectable, but viewport_query refused it: ... skp.projection_column_name_not_addressable ...` |
| K-2 | `projection_error_of` maps `ColumnNameNotAddressable` to `projection_column_unknown` (also N-4's mutation) | `nul-named column: wrong code left: "skp.projection_column_unknown" right: "skp.projection_column_name_not_addressable"` |

Every mutation was applied via `Edit`, tested with `--exact`, then reverted via `Edit` back to the exact original text; `git diff` on the touched src file showed empty (or only the round's legitimate change) after every revert.

## 5. rustfmt count and check results

**rustfmt** (`rustfmt --check --edition 2021`, hunks whose span intersects lines `git diff origin/main...HEAD` adds, measured the reviewer's way): **before 55** (`kernel/tests/skp_projection.rs` 16, `b1_projection_hostile_covering.rs` 10, `b1_projection_hostile_names.rs` 8, `fixture.rs` 8, `dataset.rs` 7, `attributes.rs` 5, `kernel/src/skp.rs` 1 — unchanged from the gate-2 reviewer's b4d7aa1 measurement, since `git diff b4d7aa1..a2e8810` touches only the Amendment-12 doc by one line) → **after 0** for all seven files, reconfirmed at the final committed HEAD. `kernel/tests/watch_support/mod.rs` untouched throughout (`git status --porcelain` never shows it; `git diff origin/main...HEAD -- kernel/tests/watch_support/mod.rs` is empty — it isn't even part of this PR's diff). The three control tests' lines were never in rustfmt's applied hunks (control-test hashes above prove it).

**Note on method:** two crate-root files (`engine/src/lib.rs`, 24 `mod` decls; `protocol/skp/src/v0/mod.rs`, 5 `mod` decls) make `rustfmt --emit stdout` dump the *entire* module tree concatenated; my selective-patch tooling mishandled that twice and inserted another module's content — caught before committing by inspecting `git diff` and reverted both times (`git checkout -- engine/src/lib.rs protocol/skp/src/v0/mod.rs`), confirmed via `cargo fmt -p spatial-engine -- --check` / `-p spatial-skp` that neither file's own added lines (`lib.rs`: the 3-line `addressability` mod doc; `v0/mod.rs`: the `skp/0.7` doc block) intersect any real hunk — both already correctly formatted, no fix needed, no corruption survives in the final commits.

**Suites at final HEAD (`f4d81c5`):**
- `cargo test -p spatial-engine --features fixture`: rc=0, 372 passed, 0 failed.
- `cargo test -p spatial-kernel`: rc=0, 303 passed, 0 failed.
- `cargo test -p spatial-skp`: rc=0, 48 passed, 0 failed.
- `node scripts/plan/verify.mjs`: PASS.
- `node scripts/plan/verify-cites.mjs`: PASS (32 pre-existing advisories, unchanged).
- `node scripts/plan/verify-quotes.mjs`: PASS (112 checked, 81 verified, 30 baselined — matches the gate's own baseline).
- `node scripts/plan/verify-test-claims.mjs`: PASS (388 claims).
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`: rc=0, 353/353.
- `cargo clippy -p spatial-engine -p spatial-kernel -p spatial-skp --features spatial-engine/fixture --all-targets`: rc=0; located warnings ~41 (vs the gate's 40, likely toolchain-count noise), none inside any file this round touches except `kernel/src/skp.rs lines 244 (branch)`, which I checked against this round's added-line set and it does not overlap — pre-existing.
- `git diff --stat origin/main...HEAD -- protocol/data-plane/ engine/Cargo.toml Cargo.lock`: empty.

## 6. Left / stopped on

Nothing stopped on; no Amendment 12 invalidator fired. Everything named in W1-W9 was completed. `git status --porcelain` at the end: empty. `tasklist` shows no cargo/rustc/clippy/test process left running (two unrelated `node.exe` processes belong to an OpenAI Codex runtime, not anything I started).

Files touched (absolute paths): `C:\dev\wt\b1-close-nul-names\engine\src\{dataset,fixture,attributes}.rs`, `C:\dev\wt\b1-close-nul-names\kernel\src\skp.rs`, `C:\dev\wt\b1-close-nul-names\engine\tests\{b1_projection_hostile_names,b1_projection_hostile_covering,b1_nul_native_id_scan_once}.rs`, `C:\dev\wt\b1-close-nul-names\kernel\tests\skp_projection.rs`.
