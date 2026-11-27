*Filed by the custodian: the tester's probe report, node:text-id-opens-for-the-session-by-row-position@probe-tester, run in a detached worktree at main f0718827995eaff5673b0cb4e1a52bdbb2a5ce44 with files it generated outside the repository, nothing committed, dispatched at 2026-11-23T21:30:02Z. Its run: Bash 24, Read 1, SubagentHandback 1, by unique call ids, 1 calls errored; model claude-sonnet-5-5, from 2026-11-23T21:30:03Z to 2026-11-23T21:47:39Z by its transcript; 1 calls named the main checkout (reads of the agent definitions there, which change nothing). The report below from its hand-back, 9740 bytes, sha256 753982de7a670565eb5f974e546ce9b2ffa8e6bb594248f016e9388488f6802c, byte for byte, 5 values of the machine script's lines masked by the custodian, as <m>, with one final newline added. It is the first half of the confirmation ADV-2026-11-23-33 item 1 names; the architect's reading of it beside the code is the second.*

---

REPORT: text-id probe on main f0718827995eaff5673b0cb4e1a52bdbb2a5ce44

Model: I observe myself as Sonnet 5.5 (claude-sonnet-5-5). No model override, no context handoff. No usage figures at hand.

Confirmed on main: a text `id` is refused with no route to open it. A file with no `id` opens on the session tier. One deviation from the brief: file B's integer column is `parcel_key`, not `fid`.

**Worktree and disk**
- Worktree: `C:/dev/wt/textid-probe`, detached at `f0718827995eaff5673b0cb4e1a52bdbb2a5ce44` (confirmed with rev-parse).
- `git status --short` shows only `?? kernel/tests/textid_probe.rs`. The worktree is left in place. Nothing was committed or changed elsewhere.
- `df -m /c` free MB: 42296 at 21:30:10Z (before the worktree), 42208 at 21:30:50Z (before the build), 42212 at 21:42:41Z, 42170 at 21:47:01Z (after). All stayed above the 40960 floor.
- Time: the run ended at about 21:47Z, well before 04:30Z.

**Step 1: where each case is decided** (all at `f0718827`)
- `engine/src/dataset.rs:565` calls `admit_identity(conn, &path_str, &file_schema, declared_identity, cancel)?`. The function itself starts at `engine/src/dataset.rs:1961`.
- No declaration means the file's own `id` is used: `engine/src/dataset.rs:1981` is `None => (IdSource::File, ID_COLUMN.to_string(), false),`.
- The column is looked up at `engine/src/dataset.rs:1984`: `let Some(field) = schema.fields().iter().find(|f| f.name() == &column) else {`.
- The session tier is reached only when that lookup finds no column:
  - `engine/src/dataset.rs:1998` refuses a declared column that is absent (`if matches!(source, IdSource::Mapped { .. })`).
  - `engine/src/dataset.rs:2008` returns `Ok(DatasetIdentity::new_session_ordinal(` for the native no-`id` case.
- If an `id` column is present, the type check is at `engine/src/dataset.rs:2028`: `identity::admit_column_type(&column, field.data_type(), schema)?;`.
- `engine/src/identity.rs:324` is `admit_column_type`. Integer types are admitted at `identity.rs:333` (`D::UInt64 | D::UInt32 | D::UInt16 | D::UInt8 | D::Int64 | D::Int32 | D::Int16 | D::Int8 => {`). Everything else, Utf8 included, hits `other => Err(EngineError::IdentityUnusable {` at `identity.rs:336`.
- The candidate list comes from `candidate_identity_columns` at `engine/src/identity.rs:299`. It keeps only 64-bit integers (`identity.rs:304`: `.filter(|f| matches!(f.data_type(), D::Int64 | D::UInt64))`).
- The refusal message text, including "Synthesizing a row ordinal instead is the hazard ADR-010 rule 2 exists to prevent", is at `engine/src/error.rs:359-363`.
- The wire declaration is turned into the engine's declaration at `kernel/src/skp.rs:1150` (`let identity = req.identity.map(host_minted_identity_declaration);`). The function is at `kernel/src/skp.rs:1754`.
- ADR-016 lists non-integer keys as out of scope at `docs/adr/ADR-016-stable-feature-identity-admission.md:137-138`: "Non-integer keys — UUIDs, strings, and anything requiring a hash to reach 64 bits, where the hash introduces a collision probability that a stable identity is not allowed to have." The three-tier Amendment 1 starts at line 180.
- The fixture writers are in `engine/src/fixture.rs`. The `IdentityMode` enum is at lines 530-572 and the `schema()` function at 754-783.
- The kernel test shape I followed is `kernel/tests/skp_admission_remediation.rs`: `open_req` at lines 62-75, and test (6) at lines 274-336 for the Utf8 `id`.

**Step 2: the three files** (written under `D:/wt-data/textid-probe/files/`, 5 features each, `avg_vertices` 6, `hole_every` 0)
- The schema is read from `engine/src/fixture.rs:754-783` plus the fixture's `bbox` field. I did not read it back from the written files: `parquet` is not a dev-dependency of the kernel test crate.
- A (`A-text-id.parquet`, `IdentityMode::StringIds`): `id` Utf8, then `bbox` (struct), then the geometry column. There is no integer column.
- B (`B-text-id-beside-parcel-key.parquet`, `IdentityMode::StringIdsBesideParcelKey`): `id` Utf8, then `parcel_key` UInt64 (unique), then `bbox`, then geometry.
- C (`C-no-id.parquet`, `IdentityMode::ForeignKeyColumn`): `parcel_key` UInt64, then `bbox`, then geometry. There is no `id` column.
- The throwaway test is `C:/dev/wt/textid-probe/kernel/tests/textid_probe.rs`, 72 lines, not committed. It builds a `SkpHost` the way `skp_admission_remediation.rs` does, calls `open_dataset` with no identity declared (and with one declared, for B), and calls `describe` on success. It prints the whole reply or refusal. The code is in the worktree and reads back as shown by `cat`.
- I added one case beyond the brief, A with `id` declared as its identity, to test "no route at all" directly.

**Step 3: how I ran it and what came back**
- Command: `cargo test -p spatial-kernel --test textid_probe -- --nocapture`, inside the shared hold, with CARGO_TARGET_DIR=D:/wt-targets/textid-probe, TMP and TEMP=D:/wt-data/textid-probe, CARGO_BUILD_JOBS=8 and RUST_TEST_THREADS=8.
- Exit code 0. The test finished in 0.19 s after a fresh build of 14m 45s. The log is `D:/wt-data/textid-probe/run.log`.

Each open's result:

**A, no declaration: refused.**
- code `engine.identity_unusable`
- message: "refused: `id` cannot serve as stable feature identity — type is Utf8; identity must be an integer that widens into u64 without transformation. A hash, a dictionary index or a row ordinal is not a mapping — it is a synthesized identity, which ADR-016 refuses. Synthesizing a row ordinal instead is the hazard ADR-010 rule 2 exists to prevent"
- fields: `candidate_columns` is "" (empty), `column` is "id", and `detail` is "type is Utf8; identity must be an integer that widens into u64 without transformation. A hash, a dictionary index or a row ordinal is not a mapping — it is a synthesized identity, which ADR-016 refuses".

**B, no declaration: refused.**
- Same code, message and detail as A.
- `candidate_columns` is "parcel_key".

**B, with `parcel_key` declared as its identity: opens.**
- Response is a dataset handle and a session reference.
- describe identity: `source: "mapped:parcel_key"`, `uniqueness: "verified-at-open-full-file"`, `verified_rows` 5, `max_value` 4, `js_exact` true, `class: "mapped"`, `session_statement: None`.

**A, with `id` declared as its identity: refused.** Same code, message and detail as A, with `candidate_columns` "".

**C, no declaration: opens.**
- Response is a dataset handle and a session reference.
- describe identity: `source: "session-ordinal:file_row_number"`, `uniqueness: "by-construction-within-generation"`, `verified_rows: None`, `max_value: None`, `js_exact: None`, `class: "session-ordinal"`.
- `session_statement`: "this dataset has no admissible identity column, so features are identified for this session only, by their position in the file. The identity does not survive this open, a reopen, or a change to the source, and it is never saved or published. Declare an identity column to get an identity that does."

**Step 4: what decides it**
- **A:** no route on main opens it. Both a plain open and a declared `id` end at `engine/src/identity.rs:336`, which refuses with `engine.identity_unusable`. There is no integer column to declare, so the candidate list is empty.
- **B:** a plain open is refused at the same line. Declaring a unique 64-bit column opens it as `mapped:parcel_key`. This means the shell's declare-an-identity route is the only one. Its `candidate_columns` list offers only Int64 and UInt64 columns (`identity.rs:304`).
- **C:** it opens on the session tier. `engine/src/dataset.rs:2008` is reached because the `id` lookup at line 1984 finds nothing. No read or uniqueness scan is issued. Rows are identified for the session by their position in the file (`file_row_number`, `IdSource::SessionOrdinal`).

**Hold and release lines** (verbatim apart from the masking THE MACHINE asks for; the lines carried no `others=` or other-project values)
- MACHINE_WAITING shared: turn of <m> held by pid <m> since <m> (printed twice)
- MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=<m> also=<m> (commands started from now on inherit it; release when done)
- MACHINE_RELEASED project=<m> shell=<m> affinity=FF (cores 0-7)

**Deviations and notes**
- **B's integer column is `parcel_key`, not `fid`.** The fixture writer's only text-id-beside-integer mode names it `parcel_key`. I did not write a parquet file by hand, to stay within "generated by the fixture writers the tests already use". I declared `parcel_key` as the identity, which is the same route the shell's form sends.
- **No wire-level capture of the shell form.** I declared the column through `spatial_skp::v0::IdentityDeclaration { column }` into `SkpHost::open_dataset`, the same call `kernel/tests/skp_admission_remediation.rs` uses, not through the shell UI.
- **No shell, installed-session or app run.** The probe is a kernel-level test, so it shows what `SkpHost::open_dataset` does on main and nothing about the UI.
- **Failure classes for this harness.**
  - It uses the interface the product exposes: `SkpHost::open_dataset` and `describe`.
  - Every result claim above points to the output in `D:/wt-data/textid-probe/run.log` and to the `path:line` cites.
  - It writes no results-file lines.
  - The test reaches its outcome: it prints each reply or refusal and passes, but it asserts nothing. It reports, so a change in behaviour would not fail it.
- **Not stopped on anything.** The Guardian and harness refused nothing. The hold was granted after waiting behind another run of this project.
- **Cleanup left for you:** the worktree `C:/dev/wt/textid-probe`, `D:/wt-targets/textid-probe` and `D:/wt-data/textid-probe`.
