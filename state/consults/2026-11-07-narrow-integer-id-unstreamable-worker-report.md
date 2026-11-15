*Custodian's filing note (2026-11-07): the worker-high's report for narrow-integer-id-unstreamable, from its hand-back (sha256 1ced73b90bb0c1ff996b24e6ccca2abfe57b0d16409195361f1d6a3065c0c94a, 17473 bytes), byte for byte. Its transcript holds 192 unique calls (Bash 130, Edit 33, Read 22, Write 6, the hand-back 1), equal to its notification; model claude-sonnet-5-5; run 21:20:46Z to 23:47:34Z. Checked by the custodian at origin: the branch at f82adfc519a98f0b5160e1fd0625c471a466a1b2; by its form's §7 counting command against the merge base 47da4d0555d0392543cd87c5c8c51952012dcd12, 635 changed lines over the seven files, against 480 (the form's Amendment 1, class 8); ADR-016 at the head is the base's file followed by the append file's 751 bytes (sha256 bb0de1aadf9dc485d07bd7de41c9622041740be9ff8f52d0e21d73bd0bca876f), whose last paragraph is the settlement's 413-byte span of the human's words; CI at the head: the five push runs green, of the pull_request runs that opened with the PR, 5 green and 2 in progress, read at 23:58:06Z; draft PR #297. A report, not Authority.*

---

Built: narrow-integer-id-unstreamable at f82adfc519a98f0b5160e1fd0625c471a466a1b2

**Start state.** Checkout C:/dev/wt/8g HEAD was 47da4d0555d0392543cd87c5c8c51952012dcd12 (= B = main). Porcelain was empty. .cargo/config.toml sha256 was 6889110645ec075c0cba3bf4aa71c4b43e5b5dfafe7d5a3e8228c05c5010e35f. D: free was 219.8 GiB at the start and 201.5 GiB at the end. Target: D:/wt-targets/8g. I showed the append file's sha256 (bb0de1aa...) and the reproducer test's sha256 (963f38fd...) before reading them. The copy of the test made in my checkout also hashed to 963f38fd... before I rewrote it.

**Base checks, at B, each pattern self-tested positive.**
- `git grep -n column_u64`: rc 0. In engine/src it has one caller, stream.rs:1947, plus the definition at :2658. Other hits are comments (layout.rs, rowgroup.rs), engine/tests/live_projection.rs's own helper of the same name, and records.
- `git grep -nE "UInt64Array|Int64Array" -- engine/src`: rc 0. The only readers outside column_u64 are lod.rs, index.rs and layout.rs (OPEN-2 and OPEN-3, out of scope). stream.rs:2364-65 is attribute row sizing, not an id reader. The remaining hits are tests and constructors.
- `git grep -n "IdentityMode" -- "*.rs"`: rc 0, 99 lines. Outside fixture.rs every use is a constructor or an import, so there is no exhaustive match. Inside fixture.rs the matches end in `_ =>`.
- `node scripts/plan/verify-test-claims.mjs`: rc 0, PASS, 756 claimed, 46 planned.
- No invalidator.

**P-0, at B 47da4d0555d0392543cd87c5c8c51952012dcd12, one shared hold, own target, nothing committed.** I extended the reproducer to the section 3 rows. Values were built by the rewrite: top of range is the width's maximum minus the row index, and negative is −i−1. Every written file's footer type and `geo` key were asserted. Run: rc 0, 1 passed.
- N1-N6 (id as Int8, Int16, Int32, UInt8, UInt16, UInt32; top of range):
  - Each was admitted as `DatasetIdentity { source: File, uniqueness: VerifiedAtOpenFullFile, verified_rows: Some(100), max_value: Some(127 / 32767 / 2147483647 / 255 / 65535 / 4294967295) }`.
  - Each stream ended `FIRST ERROR after 0 batch(es), 0 row(s)`, with `Query("`id` is <its own type>; expected a 64-bit integer")` (Int8, Int16, Int32, UInt8, UInt16, UInt32 in turn).
- D1 (parcel_key Int32, top of range, declared): admitted as `Mapped { column: "parcel_key", by: "integration-test", at: "2026-08-05T00:00:00Z" }`, VerifiedAtOpenFullFile, verified_rows 100, max_value 2147483647. The stream failed with `Query("`id` is Int32; expected a 64-bit integer")`.
- C0 (UInt64 control): admitted, max_value 99, `COMPLETED batches=1 rows=100`.
- G1-G3 (id Int8, Int16, Int32; negative): each was REFUSED with `IdentityUnusable { column: "id", detail: "holds a negative value (-100); identity is carried as u64 and a negative source value cannot widen into it without changing the value", candidate_columns: [] }`. H-SCAN is confirmed.
- S1-S3 (the same files declared as `id` with skip): each was admitted as `Mapped`, `DeclaredNotVerified`, verified_rows None, max_value None. Each stream failed after 0 rows with `Query("`id` is Int8 / Int16 / Int32; expected a 64-bit integer")`. This is recorded, not a stop.
- S0 (Int16, top of range, declared with skip): admitted as `DeclaredNotVerified`; the stream failed with `Query("`id` is Int16; expected a 64-bit integer")`.
- No section 4 stop was met (H-PRIM confirmed). I removed the throwaway test and the porcelain was empty. The raw output is in <S>/8gw-p0-run1.txt.

**Commits** (four, each `-s`, staged by path; no `@` outside the first trailer line; Signed-off-by appears once, added by `-s`).
1. 2f4605ad0082b4b66a8a23931801c3826c3d2d10 — "feat: narrow-integer-id-unstreamable, column_u64 widens Int8, Int16, Int32, UInt8, UInt16 and UInt32, and the fixture writes them". Code only, no comments.
2. 8cce80cade922cfbec62d8de6064f76fd1cab488 — "test: narrow-integer-id-unstreamable, E1, E2 and K1 stream and refuse narrow integer identities through the real producer".
3. b52522c3a7d4ce1bf5eccce9e91c63688986a573 — "docs: narrow-integer-id-unstreamable, the comments on the new arms and the fixture mode, and the tests' recorded mutations". I checked by diff that every added line is a comment and none carries a `path:line`.
4. f82adfc519a98f0b5160e1fd0625c471a466a1b2 — "docs: narrow-integer-id-unstreamable, the records: the engine README's three pointers and the human's note on ADR-016".

**Arms and fixture mode.**
- engine/src/stream.rs, `column_u64`, after the Int64 arm:
  - UInt32, UInt16 and UInt8 widen with `u64::from`.
  - Int32, Int16 and Int8 widen with `u64::try_from(*v).map_err(|_| negative(name, v))`, with no `as`.
  - A nested `fn negative` builds the same text as the Int64 arm: "`{name}` holds a negative value: {v}".
  - The null check, the UInt64 and Int64 arms and the type error are untouched.
- engine/src/fixture.rs:
  - New `IdentityMode::NarrowInteger { width: NarrowWidth, column: NarrowColumn, values: NarrowValues }`. The three enums are new and `pub`, inside the fixture module.
  - One arm each in `schema()`, the value match and the column finish.
  - Private helpers `narrow_value`, `narrow_refusal` and `narrow_array`.
  - The refusal comes from `generate` after `total` is known, before the first row. It covers features above the width's maximum plus one, and negative values on an unsigned width. `write_geoparquet_cancellable` then removes the partial file.
  - `narrow_array` also errors on any value that does not fit (`try_from`), so nothing wraps.
- engine/src/identity.rs: the unit test gains `D::Int8` and `D::UInt16`. No product code changed.
- No change to build_sql, admission, the scan, lib.rs, any Cargo file, lod.rs or index.rs. No existing IdentityMode variant or fixture byte was touched.

**Tests byte-copied at head.** All three passed in the commit-2 run and the head run.
- engine/tests/narrow_integer_id_stream.rs: `a_narrow_integer_identity_column_streams_every_row_with_its_source_value_widened_to_u64` (E1) and `a_negative_value_in_a_signed_narrow_identity_is_refused_at_open_and_at_stream_on_the_unverified_route` (E2).
- kernel/tests/narrow_integer_id_stream.rs: `a_narrow_integer_id_file_opened_through_the_kernel_streams_to_the_data_plane_without_a_terminal_error` (K1).
- E1 reads each column's type back from the written file's footer (parquet reader). Each file is written by the fixture mode, and K1 goes through `Catalog::open`, `SkpHost::viewport_query` and `EngineSourceFactory::ticket_only`. There is no `#[ignore]`, `cfg`, sleep, retry, timeout or watchdog.
- Suite at commit 1: `cargo test --workspace --locked --no-fail-fast`, rc 0; 118 result lines at the later runs, 1024 passed at commit 1 (116 result lines), 0 failed, 66 ignored. At commit 2 and at head (f82adfc5): 1027 passed, 0 failed, 66 ignored, rc 0. I ran B's full suite only as far as P-0's throwaway test, so "differs from B" means no failure at any of my heads. No test fails or changes outcome.

**Mutations M-1 to M-5**, each alone on commit 2 (8cce80cade922cfbec62d8de6064f76fd1cab488), inside a shared hold, with the named test run.
- **M-1**, Int32 arm removed.
  - E1: `thread 'a_narrow_integer_identity_column_streams_every_row_with_its_source_value_widened_to_u64' panicked at engine\tests\narrow_integer_id_stream.rs:128:9:` / `n3: the stream ended in Some(Query("`id` is Int32; expected a 64-bit integer"))` / `test result: FAILED. 0 passed; 1 failed; 0 ignored; 0 measured; 1 filtered out`.
  - K1: `panicked at kernel\tests\narrow_integer_id_stream.rs:82:13:` / `the data plane received a terminal error: engine.query: query: `id` is Int32; expected a 64-bit integer` / `test result: FAILED. 0 passed; 1 failed`.
  - E2 was not run under M-1 (the brief names E1 and K1). By reading, S3 depends on the same arm.
- **M-2**, Int16 arm mapped with `*v as u64`. E2: `panicked at engine\tests\narrow_integer_id_stream.rs:220:9:` / `s2: rows before the refusal: 100` / `test result: FAILED. 0 passed; 1 failed`.
- **M-3**, UInt32 arm through `*v as i32 as u64`. E1: `panicked at engine\tests\narrow_integer_id_stream.rs:130:9:` / ``assertion `left == right` failed: n6: ids`` / left `{18446744073709551516, ...}`, right `{4294967196, ...}` (both lines are long; I byte-copied only their starts) / `test result: FAILED. 0 passed; 1 failed`.
- **M-4**, fixture narrow mode writing UInt64 (`data_type` and `narrow_array`). E1: `panicked at engine\tests\narrow_integer_id_stream.rs:116:9:` / ``assertion `left == right` failed: n1: written type`` / `left: UInt64` / `right: Int8` / `test result: FAILED. 0 passed; 1 failed`.
- **M-5**, `D::Int8` removed from `admit_column_type`. `identity::tests::only_value_preserving_integer_types_are_admitted ... FAILED`, `panicked at engine\src\identity.rs:372:13:` / `Int8 should widen exactly` / `test result: FAILED. 0 passed; 1 failed; 0 ignored; 0 measured; 209 filtered out`.
- All five failed as predicted. Each revert was `git checkout -- <file>`, and the file's sha256 was shown equal to commit 2's:
  - stream.rs cbf557b5384ace4daef2624e0bdcf4379823ddac6ea9952b22c6dc663212bb30 (after M-1, M-2 and M-3)
  - fixture.rs a2d1ccd4812f33180f93e1550480f13756f4d01fc5cc4f91e88de4393bfb5360 (after M-4)
  - identity.rs a314cf93474fc650260cd3f830868fa8696014fcee0ec0d858825263c9c3ae94 (after M-5)

**Comments written or changed** (all after the code, from it). Every claim below was read against the code. The fixture refusal claims were also confirmed by a throwaway run (deleted, porcelain empty): Int8 128 and 129 features, UInt8 256 and 257, negative on UInt8, and the partial file gone after each refusal.
- stream.rs, the comment on the six arms:
  - UInt8, UInt16 and UInt32 widen with `u64::from`, which cannot change a value. This rests on the three `u64::from` arms.
  - Int8, Int16 and Int32 go through `u64::try_from` per value, as the Int64 arm does. This rests on the three `try_from` arms.
  - A negative value is refused with the same detail as there (`negative` builds that text). This rests on the nested `fn negative`.
  - None of the arms uses `as`. This rests on the absence of any `as` in the six arms.
  - The per-value check is not redundant, because admission's scan returns before running for a declared mapping with `skip_uniqueness_check`. This rests on `admit_identity`'s `if skip { return ... }` before the scan SQL, the scan's `min()` check, and P-0's G and S rows.
  - The SKP wire has no field for that option, so only the engine API reaches the route. This rests on the doc on `host_minted_identity_declaration` in kernel/src/skp.rs, and on the grep showing no wire or shell use of `skip_uniqueness_check`.
  - Every type `admit_column_type` admits has an arm. This rests on the eight-type match in `admit_column_type` and the eight downcasts in `column_u64`.
  - Any other type keeps the type error. This rests on the unchanged final `Err`.
- fixture.rs docs:
  - The `NarrowInteger` variant doc: width, column and values, the row-index geometry seed shared with NativeUnique (`parcel(&mut rng, spec, id)` with `id = written + i`), and the refusal-never-wrap behaviour.
  - The docs on `NarrowWidth`, `NarrowColumn` and `NarrowValues`.
  - The docs on `data_type`, `max`, `narrow_value`, `narrow_refusal` (the maximum-plus-one count, which also equals the number of distinct values both ways) and `narrow_array`.
- E1's, E2's and K1's docs, each with its `RECORDED MUTATION (observed at 8cce80cade922cfbec62d8de6064f76fd1cab488, on the uncommitted tree)` lines:
  - E1 carries M-1, M-3 and M-4.
  - E2 carries M-2.
  - K1 carries M-1.
  - The unit test carries M-5 (this was my choice, since section 4 says to record every mutation in a doc line).
  - The behaviour sentences in these docs follow the order of the assertions in each test.
- Re-read at head, the comments section 2.6 names:
  - identity.rs `admit_column_type` ("Widening into u64 is exact. A signed type is admitted here and its values are checked when they are read — a negative id is refused there, not assumed absent here") is now true for Int8, Int16 and Int32.
  - stream.rs `build_sql` ("everything downstream — the envelope's non-nullable id field, the null and negative checks ... is identical for a native and a mapped identity") stays true.
  - lod.rs "Unreachable through `Dataset`" stays false and is untouched (OPEN-2, out of scope).

**ADR-016 append.** The append file's sha256 is bb0de1aadf9dc485d07bd7de41c9622041740be9ff8f52d0e21d73bd0bca876f (751 bytes). It was made with the Edit tool: `old_string` was the file's last line plus its final newline, and `new_string` was that text plus the append bytes. There was no Guardian refusal. The ADR's sha256 after the edit is e26415962feb8f409c0ca8d390b777394fb1f79cc265e26663c6ed018ed8fd36, equal to both the expected hash and (B's file + the append file) piped to sha256sum. The diff is 6 lines added, 0 removed. I wrote no ADR words.

**README.** Three lines changed in engine/README.md, found by content. The Last verified line gained a clause ending `at b52522c3`. The Viewport stream row gained E1's pointer. The preregistration list gained this form's path, placed after the MULTIPOLYGON-MP1 entry.

**CI**, on head f82adfc519a98f0b5160e1fd0625c471a466a1b2. All five runs completed with conclusion success:
- Product CI — Rust workspace 42424423195. Jobs: "L1 portable correctness · cargo test --workspace (ubuntu-24.04)" success, and "cargo test --workspace (windows-latest)" success.
- Product CI — shell 42424423287. Jobs: "typecheck · build · vitest · cargo test" success, and tauri build (NSIS, build-only) success.
- Governance CI — plan, queue, site 42424423282. Jobs: "test · verify:plan · queue/site drift" success, and "cfg boundary (PORTABILITY R2)" success.
- Rust fmt 42424423221. Job: "cargo fmt --check (workspace and src-tauri)" success.
- Ported notices 42424423232. Job: ported-notices success.

**Size and names.** `git diff --name-only B...HEAD` lists exactly the seven files: docs/adr/ADR-016-stable-feature-identity-admission.md, engine/README.md, engine/src/fixture.rs, engine/src/identity.rs, engine/src/stream.rs, engine/tests/narrow_integer_id_stream.rs, kernel/tests/narrow_integer_id_stream.rs. `git diff --numstat B...HEAD` gives added/removed: 6/0, 3/3, 146/2, 16/1, 49/0, 293/0, 116/0. The total is 629 added and 6 removed (635 changed lines), against the ceiling of 480. **Budget overrun, §7 not edited (class 8).** I did not trim to fit. The overrun is mostly rustfmt expansion of the two test files (293 and 116 lines against my estimate), plus the comments in commit 3.

**Checks at head** (f82adfc5), each exit code and last line.
- `cargo fmt --all -- --check`: rc 0.
- `cargo test --workspace --locked --no-fail-fast`, in a shared hold: rc 0; 118 result lines, 1027 passed, 0 failed, 66 ignored.
- `node scripts/plan/verify.mjs --offline`: rc 0, "verify:plan PASS — ... PLAN.yaml agrees with the repository."
- `node scripts/plan/verify-cites.mjs`: rc 0, "PASS — every rooted (in-tree) path:line reference across 2745 file(s) resolves."
- `node scripts/plan/verify-quotes.mjs` (took about 8 min): rc 0, "PASS — 138 checked, 107 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors ... 920 ruling cites resolved, 0 ruling-cite errors." I ran this one with README and the ADR staged, immediately before commit 4. Nothing changed between that run and head, and I did not re-run it at the pushed head.
- `node scripts/plan/verify-test-claims.mjs`: rc 0, "PASS — all 756 claimed test(s) across 242 file(s) exist or are planned ... (43 planned ...)". At B the planned count was 46, so the three new tests resolved.
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`: rc 0; tests 598, pass 598, fail 0.

**Stop rules and deviations.**
- No stop rule was met.
- The M-1 run put two cargo commands in one hold call, E1 then K1 (the shared-hold shape names one command). Every other hold held one cargo command.
- The workspace-suite runs used `--no-fail-fast`, an addition to the brief's command. It only shows every failure; there were none.
- The ADR append and the fixture-mode placement follow the brief and the form. The `negative` helper duplicates the Int64 arm's message text by design, so that arm stays byte-unchanged.

**State.** Local HEAD = origin/cut/narrow-integer-id-unstreamable = f82adfc519a98f0b5160e1fd0625c471a466a1b2 (checked with `git rev-parse` and `git ls-remote`), and the porcelain is empty. I took no PR action.

**Hold lines** (my own project's only, `also=` elided; every hold was granted and released, and the shell PID is the call's):
- MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:82864 — the P-0 run.
- shell=bash.exe:40624 — the commit-1 suite.
- shell=bash.exe:62160 — the new tests.
- shell=bash.exe:20072 — the commit-2 suite.
- shell=bash.exe:28112, 9668, 79032, 1808 and 17044 — the M-1 to M-5 runs.
- shell=bash.exe:71056 — the throwaway refusal probe.
- shell=bash.exe:79316 — the head suite.
- Each was followed by MACHINE_RELEASED project=SpatialIDE for the same shell.

**Background shells.** None left running. My bounded wait loops each ended on their own, and the cargo and CI-wait calls all exited. I killed nothing by PID.

**Model.** The harness reports claude-sonnet-5-5 (Sonnet 5.5); no model override and no context handoff.
