# engine: the bundled DuckDB compiled with clang-cl on Windows, so that an admitted BIGINT product that overflows ends in the fixed detail — full preregistration

*Committed before P0 and before any code (OPEN-9, ruled). Append-only once committed; an amendment written after any P0 or test outcome has been seen says so in its first line. PLAN node admitted-integer-overflow-silent-wraparound (O1), graded S1 by the human, slot 1 ahead of order, both gates. Its sections and notes are the architect's full-form draft (`state/consults/2026-10-26-admitted-integer-overflow-silent-wraparound-full-form-architect-draft.md`, read only at main dcd85569; its sha256 from line 5 is e0470363066e31c6d33755db54e1ea0160110ed9637f1a35c134908dba7e264c), carried byte for byte with two changes, both the custodian's: each cite the draft wrote with `@ dcd85569` is expanded by script to `path:line @ <commit> sha256:<the lines with their LFs>` (a path starting with a dot as `path:line` at <commit>, sha256 <hex>), its enclosing backticks dropped, and the root `Cargo.lock`, whose name the tree holds more than once, written in that second shape too (34 pins; 1 by a bare name); and the settlement below, which carries the human's answers of 2026-10-26 by reference. Cites the draft wrote without that marker (third-party package files by package root, and line numbers into the directive written `:n`) stay as written. A package's `src/lib.rs:n`, which the checker would read as this module's own file, is written `src/lib.rs, line n` (5 places); nothing else in those sentences changes. Every pin is historical: for the code, the piece's base tree is authoritative. Form path: `engine/ADMITTED-INTEGER-OVERFLOW-SILENT-WRAPAROUND-PREREGISTRATION.md`. The custodian keeps the PLAN node on main.*

## Header

- **Title:** On Windows, the bundled DuckDB is compiled with clang-cl, so an admitted BIGINT product that overflows ends the stream in error instead of returning wrong rows. A pinned engine test checks the outcome against exact i128 arithmetic on the Windows and Linux L1 entries.
- **Authority:** PLAN node `admitted-integer-overflow-silent-wraparound`, graded S1 and placed in slot 1 ahead of order, full form, both gates (state/directives/2026-10-26-resent-2026-10-25-o1-s1-clang-cl-route-a-hugeint-cast-b-five-nodes-placed.md:8 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:ff567e590528f83b3f699e8780bacb6ff8a951c08ddc0c7d2a7f9a36e5477306). Route (a) is at `:11`, route (b) at `:12`, what is not a route at `:13`, the instruction to draft at `:15`, the words for the build of record at `:17`, and the out-of-scope items at `:19`. The grade is confirmed by state/directives/2026-10-26-o1-s1-257-258-259-merged-6b-r3b-held-on-the-human-6c-runs-fixture-s-entry-point-6d.md:8 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:72ffd28edd9cd9e441890a29fd53bbc60a2ba3186a0da391a57ecdaf338e4296.
- **Drafted by:** the architect, on the custodian's brief, read only at main dcd85569.
- **Order:** this form is committed before any code. The probe P0 (§9) runs after the commit, with nothing committed. Its result is recorded as a class 1 amendment before any code. The ordering is my recommendation (OPEN-9).
- **Append-only once committed.** An amendment written after any outcome has been seen says so in its first line.

## §0 Disclosure

1. **Evidence this form rests on:**
   - lead-data's probe design: `state/consults/2026-10-25-admitted-integer-overflow-silent-wraparound-probe-design-lead-data-draft.md`;
   - the tester-high's run: `state/consults/2026-10-25-admitted-integer-overflow-silent-wraparound-probe-run-tester-high-report.md`. It ran on the shared target `D:/wt-targets/sefd`, as its own line 1 records;
   - lead-data's reading: `state/consults/2026-10-25-admitted-integer-overflow-silent-wraparound-probe-reading-lead-data.md`;
   - the custodian's clang-cl check: `state/consults/2026-10-26-admitted-integer-overflow-silent-wraparound-clang-cl-presence-custodian.md`;
   - the untracked probe file `C:/dev/wt/o1-probe/engine/tests/o1_probe.rs`, 1371 lines. Its sha256 is in the run report at `:11`. It is evidence and is never cited as Authority.
2. **The defect, by those reports:**
   - Bundled DuckDB v1.5.5, at source id d8cdaa33fd (run report `:25`), takes the `#else` branch of the int64 `TryMultiplyOperator` on this MSVC build. That branch skips the overflow check when both magnitudes are below 2^32 (run report `:366-443`).
   - Statistics propagation then folds the filter on the wrapped range to `EMPTY_RESULT` (run report `:196`, `:227-258`; reading §2).
   - 88 of 136 engine runs met the S1 condition (reading §1).
   - The branch selection is inferred, not observed (reading `:46`).
3. **The build mechanism, read from package source:**
   - `libduckdb-sys` 1.10505.0 (`Cargo.lock:1185-1188` at dcd85569054a04f6d0135f686b8f55d4a9eba5d4, sha256 7be50c00e04337133abb0b8168e2c8671588bd778294ce46bb0aabd30648dd79) builds DuckDB with the `cc` crate: `build_bundled_cc.rs:87-138`.
   - `cfg.cpp(true)` is at `:110`. The hard `/EHsc` flag is at `:123-125`; it is keyed on `CARGO_CFG_TARGET_ENV`, not on the compiler, so it stays under clang-cl, which accepts it.
   - `cc` 1.4.0 (`Cargo.lock:367-370` at dcd85569054a04f6d0135f686b8f55d4a9eba5d4, sha256 bbef1cc916fb476ea35facea17292b186ba302915cf1225eea595625c2d545bd) reads `CXX_<target>` first, then `CXX_<target_with_underscores>`, `HOST_CXX` and `CXX` (`src/lib.rs, lines 4204-4218`).
   - When the named compiler is clang-cl on an MSVC target, `cc` copies the environment of the `cl.exe` it finds (`src/lib.rs, lines 3403-3422`).
   - A bare `clang-cl` that is not an existing path is started through `PATH` (`src/lib.rs, lines 3468-3483`).
4. **Why clang-cl takes the checked path:** the int64 multiply's guard is `#if (__GNUC__ >= 5) || defined(__clang__)` (run report `:370`), and clang-cl defines `__clang__`. The same guard opens `__int128` paths: `duckdb/src/common/types/hugeint.cpp:216`, `:316`; `uhugeint.cpp:99`, `:174`; `include/duckdb/common/numeric_utils.hpp:175`, read in a `libduckdb-sys` extraction. So the change reaches more than the int64 multiply (§5, H-I128).
5. **Hypotheses, each labelled with its discriminator:**
   - H-L: literal-only products. Discriminator: P0 cells L1, L2 and L4.
   - H-I128: the link needs no compiler-rt. Discriminator: P0 step P-3's link.
   - H-STD: clang-cl ignores `-std=c++11` with a warning and compiles in its C++14 default. Discriminator: P-3's build output.
   - H-FETCH: where a second-row-group overflow is first raised. Discriminator: P0 cells B3.
   - H-CACHE: whether `Swatinem/rust-cache` keys on `.cargo/config.toml`. Discriminator: the PR's second CI run. This is my recollection and is unverified.
6. **No fixture-drive confound:** no measurement is made against the 5 GB fixture.

## §1 What this preregistration may and may not claim

- **May claim, once §4 is green on both matrix entries:**
  - On the build of record (`libduckdb-sys` 1.10505.0, with Windows compiled by clang-cl through `.cargo/config.toml`), an admitted same-type BIGINT `*` whose exact value leaves int64 ends the stream in error with the fixed detail in each cell §3 names. It does not complete with rows that wrapped arithmetic selects.
  - Each product that fits returns exactly the i128 oracle's id set.
- **May not claim:**
  - `+`, `-` or unary `-` overflow;
  - INTEGER, UBIGINT or HUGEINT products;
  - nested products beyond the cells in §3;
  - the terminal text when an overflow is first raised during a fetch (node `stream-fetch-overflow-fixed-detail`; engine/src/stream.rs:2591-2602 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:fb6df513b3339ad116fb4abbf81749c82b08edafc5be75ed6e07fb5f34be7a5b);
  - L3 (B-T1's, per the directive at `:19`);
  - any build without clang-cl: a cargo invoked from outside the checkout, or a branch cut before this piece;
  - another DuckDB version;
  - macOS behaviour, until port-2's macOS entry has run §4;
  - any docs/08 figure.
- **ADRs cited, none amended under route (a):**
  - ADR-021: decision 4 at docs/adr/ADR-021-row-filter-on-viewport-query.md:67-70 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:1f3173d54976a562d728bccec19aba4d715d8a0820dfff80aec76d9938c3997c; Note 2026-09-30 item 4 at `:265`, which still leaves overflow undecided.
  - ADR-030: Reopen 4 at docs/adr/ADR-030-conveyed-artifact-notice-set.md:82 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:69a3f3d239cdcf15a3dd199f30543ffca4a79ab52a66ce4d116812ed2f24e1da.
  - ADR-006: class 1 is unchanged.
  - ADR-010 rule 7: these streams now end in an error that is surfaced.
- **Principles:** docs/01 principles 3 and 8 (`docs/01_Principles.md:9`, docs/01_Principles.md:14 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:1a1760f2db0ba0fe74371deccc518ae610b6c944684482ca20a8cd6000bbba9d), and PORTABILITY R1 (state/directives/PORTABILITY-2026-09-30.md:33 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:30a3545525a654f3c8f53e844a5d87a0b6d3038374104d4c1fcf0252633b1a22). Before this piece, a result guarantee depended on the OS's compiler; this piece removes that dependence.
- **Wire:** no change to the SKP or MCP shape. On the affected class, `viewport_query`'s existing terminal changes from "completed, wrong rows" to the existing `engine.query` error with the existing fixed detail. No new code, field or string.
- **Security and licensing:**
  - The build toolchain gains clang-cl: on CI, the runner image's LLVM 20.1.8, a version we do not pin (custodian check `:15`); on the machine, the human's install.
  - No crate is added, and `Cargo.lock` does not change.
  - Nothing new is conveyed unless the link pulls in compiler-rt. If it does, that is an invalidator, ADR-030 Reopen 4.
  - The installer's import list (KNOWN-LIMITATIONS.md:154 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:8a6b9a859da40cfeec557ec3b2729c6e9de67bc0f549743c7816423e789378ab, item 15) is predicted unchanged.
- **docs/08:**
  - No figure is stated. Every docs/08 figure on record was taken on the MSVC-built DuckDB. Recorded as a confound for the next measurement pass, not resolved here.
  - engine/README.md:523 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:4e545d920e4f02866bb1de557ae7ce1dc06ecce3150dc0d13c35020e8de708d9 scopes measurements to "MSVC". It is in #241's paths, so it is OPEN-7.
- **User-visible strings:** none added. The fixed detail stays a `[P6 placeholder]`.

## §2 The change, stated before it is applied

**2a. Route (a), the build** (the custodian's choice is OPEN-3; (A) is recommended).

- **A new tracked file, `.cargo/config.toml`:**
  ```toml
  # Bundled DuckDB on Windows: see engine/Cargo.toml, above the `duckdb` dependency.
  [env]
  "CXX_x86_64-pc-windows-msvc" = "clang-cl"
  ```
  - The key is quoted because TOML needs it. It is the hyphenated name, the first one `cc` 1.4.0 reads.
  - There is no `force`, so a developer's own environment value wins.
  - On macOS and Linux targets `cc` ignores the variable.
- **Why this file and not the workflows:**
  - Cargo finds this file for every cargo run whose working directory is inside the checkout. That covers `product-ci-rust.yml`'s build and test steps (`.github/workflows/product-ci-rust.yml:221-240` at dcd85569054a04f6d0135f686b8f55d4a9eba5d4, sha256 4edf7fa5bcf80942fcf46aceda133c7e76928094d840ea27fe710e71aa07e769), `product-ci-shell.yml`'s `cargo test --manifest-path` from the repository root (`.github/workflows/product-ci-shell.yml:217`, `:227`, `.github/workflows/product-ci-shell.yml:230` at dcd85569054a04f6d0135f686b8f55d4a9eba5d4, sha256 1d94041252c0e380d82acb155cc788526dcb3e418b15dc0748f8043ed3da965b), the shipped installer's `npm run tauri build` in `frontends/shell` (`.github/workflows/tauri-build.yml:66-68` at dcd85569054a04f6d0135f686b8f55d4a9eba5d4, sha256 87b3bce8adc0024cfbc6a68777563e416272b76dee0526d4c55c1c170113867d), and the development machine.
  - It edits no workflow, so it does not overlap port-2 (§ Rule (00)).
  - The one case it misses: a cargo run whose working directory is outside the checkout. That is dev-only and is recorded in the file's comment under §31.
- **What it also compiles with clang-cl:**
  - In the workspace, `libduckdb-sys` is the only crate that compiles C++ with `cc` for this target. `ring` compiles C, so the CXX variable does not reach it. `iana-time-zone-haiku` is Haiku-only. Evidence: `Cargo.lock:1074-1075`, `:1189-1190`, `Cargo.lock:1587-1588` at dcd85569054a04f6d0135f686b8f55d4a9eba5d4, sha256 a05fc040ffa477dbbc19b51bf5ef9c50408b9813c54b25e8e8b12e9ad59dafe1.
  - In the shell build, `vswhom-sys` also compiles C++ (frontends/shell/src-tauri/Cargo.lock:5399-5404 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:9a8bedba54d554f5c443425c13fa92a1cf6f6175a1f7e80d2840b4abd3c66933). It is a build-time helper and is not conveyed. Its clang-cl compile is checked by the PR's `product-ci-shell` run.
- **The build of record:**
  - The human's words (state/directives/2026-10-26-resent-2026-10-25-o1-s1-clang-cl-route-a-hugeint-cast-b-five-nodes-placed.md:17 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:a81cef02dad3952e5d11ee7f26648dd578fcdfdc569ada0c14dd4953fd2afc4f) go into `engine/Cargo.toml`, as a new paragraph in the comment block above `duckdb = { version = "1.10505.0", … }` (engine/Cargo.toml:24-39 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:bbb029720acf41ac482f9e60f7c6be4699c8d137b9fdb03fff2bc0af34f0e4a6). That block is where the bundled build is recorded today ("`bundled` builds DuckDB from vendored sources", `:24`).
  - The place is marked as follows. The worker inserts the line in the human's answered form (W-1 and W-2 below) and does not reword it:
  ```toml
  # [THE HUMAN'S WORDS FOR THE BUILD OF RECORD — directive 2026-10-26 (resent), item 1; inserted as answered under AUTONOMY §31, not reworded]
  ```
  - Beneath it, a source comment of mine names the dev-only gap (a cargo run from outside the checkout) and the pinned test's file.
- **CONTRIBUTING.md.** One sentence goes after the toolchain floor (CONTRIBUTING.md:123 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:aa2db1e54497afff788479555c1625a29ba29380c19c1ec17b0b3fe9cae5b244). It is a worker's line, so §31 applies and my words are: "On Windows, `clang-cl` must be on `PATH`: `.cargo/config.toml` compiles the bundled DuckDB with it, and a build without it stops with a missing-tool error from the `cc` crate."
  - Check: the requirement is `cc` `src/lib.rs, lines 3480-3483`, which starts a bare `clang-cl` through `PATH`. The missing-tool failure is a P0 observation; if P0 shows other text, the sentence follows P0.
- **Not changed:** any workflow, `Cargo.lock`, any vendored source, `engine/src/**`, ADR-021, FILTER-BIND §2.5(d) (engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:97 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:638e6abd6aa3af68345756102392b9815336e2e8a2959805c6e2bce59ea7960c), KNOWN-LIMITATIONS (no item, per the directive at `:19`), and the campaigns' exclusions (`engine/tests/admission_property_campaign.rs:1031-1040`, engine/tests/filter_type_admission.rs:1003-1004 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:945fe2f041eda17a6a21de1462146b91b473fa444e46e2c77100e6f7d26379e2).

**2b. The pinned test.** A new file, `engine/tests/admitted_integer_overflow.rs`, grown from `o1_probe.rs`.

- It uses the interfaces the probe and the campaign actually call:
  - `AdmittedPredicate::admit(String, &Dataset)`;
  - `Dataset::stream_with_cancel(&ViewportQuery, CancelToken)` with `next_into`;
  - `ViewportQuery::all()` and `ViewportQuery::viewport(..).with_limit(..).with_filter(..)`;
  - `spatial_engine::fixture::{write_geoparquet, FixtureSpec, StatisticsMode, configured_connection}`.
- The real shape it follows is engine/tests/admission_property_campaign.rs:1320-1352 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:96df4e10f0a28e1fc0f264fbbb79252ec123497dd215fc3f7fd085ca72137047 (`completed_ids`), together with the probe at `:529-590` (run report appendix).
- The terminal text it compares against is a local const equal to engine/tests/admission_property_campaign.rs:1018 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:f456112e7dff453894a8e52cf0e5ea7f69134aeed9a3f7bdcc2e6235c2f2135d, as filter_type_admission.rs already does at `:1003`.
- Fixtures are written at run time under `std::env::temp_dir().join("spatial-engine-admitted-integer-overflow")`, the engine tests' convention (`admission_property_campaign.rs:133`).
- Every file is one row group of at most 2,048 rows, so every overflow falls in the first chunk. The prepare and execute sites, where the fixed detail is proven, therefore receive every error. The fetch site is excluded by construction and belongs to `stream-fetch-overflow-fixed-detail`.
- No `#[ignore]` and no `cfg`, so it runs in `cargo test --workspace --locked` on the Windows entry and the Linux L1 entry (`product-ci-rust.yml:194-197`, `.github/workflows/product-ci-rust.yml:233-234` at dcd85569054a04f6d0135f686b8f55d4a9eba5d4, sha256 b583ae49475deb6fd0c6a7b2d4ee8a35323f6b6f814b70b68e8b908491ceed3c), and on macOS once port-2's entry exists.
- It adds no `pub` item.

**2c. Portability (R3, state/directives/PORTABILITY-2026-09-30.md:49-54 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:60f4aa60c2364c5acc141be1a32c0d23a3b38f2a9df5d03d40c51cef44bf9959).**

- **Owning boundary:** the bundled DuckDB's build configuration (`.cargo/config.toml` plus `engine/Cargo.toml`). R2's table has no row for it, and the architect adds one here: "bundled C++ build configuration". It carries no product `cfg`.
- **Windows:** supported. The checked path holds, proven by §4 on the Windows entry.
- **Linux:** supported. GCC 5 or later takes the builtin path by source, and §4 on the L1 entry shows it.
- **macOS:** supported by source, since Apple clang defines `__clang__`. It is shown only once port-2's entry runs §4, and it is deferred to port-2 until then.
- **User-visible reduction:** none.

**2d. Route (b), the fallback section. Dormant unless §9's condition fires.**

- **When it applies:** only on the human's conditions at `:12`, and on the human's word at that time.
  - The custodian's check (`:16`) found clang-cl on the runner image, so "on neither the machine nor the Windows runner image" cannot fire as things stand.
  - That leaves "clang-cl cannot build it": the P-3 build or link fails, or the link needs compiler-rt (ADR-030 Reopen 4).
  - A failed pass criterion that is not a build failure stops the piece and goes to the human. It does not trigger route (b) automatically (OPEN-4).
- **The change:**
  - In the composition (engine/src/stream.rs:1447-1452 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:7bd5583fbddba7c1c8f99dd72e371cd917661b525c5e49ca9cd772c1ef3f13d4), both operands of every admitted `*` whose binder type is BIGINT are wrapped as `CAST((<operand>) AS HUGEINT)` before the text reaches DuckDB.
  - The composed text is then not the predicate verbatim, which contradicts ADR-021 decision 4 (`docs/adr/ADR-021-row-filter-on-viewport-query.md:67-70`).
- **The Note it needs, left for the human's words:**
  ```
  ## Note <date> — <the human's title>
  [THE HUMAN'S WORDS — an ADR-021 Note on decision 4 (the verbatim composition): directive 2026-10-26 (resent), item 1, route (b), "my words then"; not drafted here]
  ```
- **Seams route (b) must close before code, each one designed then and not here:**
  - Admission's three stages and the two-sentinel probe are proven on the uncast text, but DuckDB would receive the cast text. Either the composed text is re-admitted, or the cast insertion is proven to keep the structure.
  - The binder's types change: a HUGEINT product beside a decimal literal can now fail at the scan. So B-T1 and B-T1b (`engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:199`, `:396`) are re-run over the composed text.
  - A nested product becomes HUGEINT × BIGINT, which falls to DuckDB's MSVC HUGEINT fallback (`hugeint.cpp:229-295`). That fallback has not been read behaviourally.
- **Route (b)'s tests:**
  - §4's T-A to T-E, unchanged, pass on the MSVC build;
  - the composition matrix test (engine/src/stream.rs:3596 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:c39ebcc4d182bbd387b74af0a5aa19c43f4bf7535fb563fa64072c00b237f75d) updated to the cast rule in the Note's words;
  - B-T1 and B-T1b over the composed text;
  - a nested-product cell.
- **Route (b)'s mutation:** the cast removed from one operand. T-A then fails by name at the first W cell.

## §3 Fixtures and cells, with outcomes predicted before P0 and before code

*These are predictions for the clang-cl build. The X column is the i128 oracle and is never edited. A deviation is recorded as class 2.*

**P0 (the probe, nothing committed).** The cells are those the human names at `:11`.

| Cell | Files (per `o1_probe.rs`) | Predicate | Predicted on clang-cl |
|---|---|---|---|
| W | A-ar-s/-ar-n/-dk; B-ar-n; S-ar-n | P1 `v * v > 0`, P2 `v * v < 0` | the fixed detail, no batch, both shapes |
| W, second row group | B3-ar-n | P1, P2 | an error; the site is unpredicted (H-FETCH): the fixed detail, or DuckDB's text at the fetch site |
| F | B-ar-s, B-dk | P1, P2 | the fixed detail; EXPLAIN in cell D shows no `EMPTY_RESULT` |
| F, second row group | B3-ar-s, B3-dk | P1, P2 | as B3-ar-n |
| exact control | all files | P3 `(v * v) IS NOT NULL` | on -ar-n files with an overflow row: the fixed detail; on statistics files: the fixed detail or X (a statistics fold is possible), unpredicted |
| refusal controls | A-ar-s, B-ar-s | C1 `v * v`, C2 `v * 1.5 > 0` | refused, `skp.filter_not_boolean` and `skp.filter_type_not_admitted`, unchanged |
| magnitude, independent | S, R per k (S45) | `SELECT v * v …` | S k=2..5 raise `Out of Range Error`; S k=0,1 exact; R as before |
| L1, L2 | B-ar-s | `4000000000 * 4000000000 > 0` / `< 0` | H-L: admitted, complete, equal to X (2,048 / 0), no error, by L3's precedent (reading `:72-76`). Alternatives: the fixed detail, or refused at bind |
| L3 | B-ar-s | as on main | recorded, not graded (B-T1's) |
| L4, one-sided literal | B-ar-s | `268435456 * 1152921504606846976 > 0` | as H-L |
| T-c, two-column | new, 3 rows, -ar-n and -ar-s: (2,3), (3037000500, 4000000000), (−4000000000, 4294967295) | Q1 `a * b > 0`, Q2 `a * b < 0`, Q3 `(a * b) IS NOT NULL` | Q1 and Q2: the fixed detail; Q3 as P3 |
| T-o, one-sided columns | new, 2 rows each, -ar-n: (2,3) plus (268435456, 1152921504606846976); the mirror (1152921504606846976, 268435456) | Q1, Q2 | the fixed detail. The independent per-k queries raise |
| T-e, exact two-column | new, -ar-n: (2,3), (2147483648, 2147483648), (−4294967296, 2147483648) = i64::MIN, (9223372036854775807, 1), (3037000499, 3037000499) | Q1, Q2, Q3 | X, no error |
| T-m, both raise | new, -ar-n: (2,3), (4294967296, 4294967296), (−1, −9223372036854775808) | Q1 | the fixed detail on both builds; a control that the fixed detail is reachable |

**The pinned test's files** are a subset: A-ar-n, B-ar-s, S-ar-n, T-c-ar-n, T-c-ar-s, T-o-ar-n and its mirror, T-e-ar-n, an exact v-file E-ar-n (v in {0, ±1, 2, ±3037000499}), and B-ar-s for L1, L2 and L4. Each file is checked before use, as `o1_probe.rs` does: layout, statistics present or absent as declared, readback with 0 mismatches, and `Dataset::open` Ok.

## §4 Tests, and the mutation per new test

All tests are in `engine/tests/admitted_integer_overflow.rs`. Each runs both shapes (`all`, and T1's `view`).

| Test | Claim | Mutation, failing it by name |
|---|---|---|
| **T-A** `an_admitted_bigint_product_that_overflows_ends_the_stream_in_the_fixed_detail` | Every W, F, T-c, T-o and T-m cell's P1/P2/Q1/Q2 ends in error whose Display equals the fixed-detail const exactly, with no batch delivered. | **M1:** the `[env]` line removed from `.cargo/config.toml`, in a dedicated MSVC target, a Windows rebuild (OPEN-5). It is predicted to fail at the first W cell (S-ar-n P1: 2 ids, no error). The same run is the first behavioural observation of the one-sided hole on MSVC; whether T-o wraps there is recorded as a result. **M4:** `classify`'s out-of-range arm (engine/src/stream.rs:2618-2619 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:077043c9b315afc302290d4a96b2f67848442d0798220305ba536b8c0ca7ffee) deleted. Fails at the first cell's text equality. |
| **T-B** `an_admitted_bigint_product_that_fits_returns_exactly_the_rows_exact_arithmetic_selects` | E-ar-n and T-e-ar-n: P1/P2/P3/Q1/Q2/Q3 complete with exactly the i128 oracle's id set; the boundary 3037000499² and the i64::MIN product are included. | **M2:** the composition at engine/src/stream.rs:1451-1452 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:8d9c36a50fbd74df55d643818d0bb306c7d2d898e4c8e9369ca72e7215703292 becomes `format!("NOT ({})", …)`. Fails at the first exact cell. |
| **T-C** `no_admitted_bigint_product_completes_with_rows_exact_arithmetic_does_not_select` | Over every file and predicate in the test, including P3/Q3, no run completes with an id set different from X's. This is the S1 condition, asserted absent. | M1 (fails at A-ar-n P1: 1,023 vs 2,047). |
| **T-D** `a_bare_product_and_a_decimal_beside_an_integer_are_still_refused` | C1 and C2 are refused with their codes. | **M3:** the BOOLEAN check (engine/src/predicate.rs:1377-1381 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:b4dc386e899c8ad50b8009991b9fa47cafc9a2dac739d7b3373781a9d920f372) removed. Fails at C1. |
| **T-E** `a_literal_only_bigint_product_returns_the_rows_exact_arithmetic_selects` | L1, L2 and L4 as H-L registers them. If P0 deviates, the name and the assertion follow P0 by a class 2 amendment, and X is untouched. | M1 (predicted to fail at L1: 0 vs 2,048). |

- **What every observation records:** each mutation is applied, the named test is run, its failure is recorded by name with the commit it was observed at, and the mutation is reverted. No `verify-mutation` run is called an observation (template `:172`).
- **Where M1 runs:** Windows only. M2 to M4 also hold on Linux. Running them on Linux is not required.
- **Existing suites that must stay green, unloosened:** `filter_admission_property_campaign`, `a_join_of_clauses_each_admitted_alone_returns_their_intersection_and_its_subsets_admit`, `an_admitted_integer_overflow_ends_the_stream_with_the_fixed_detail` (`admission_property_campaign.rs:1469`), `the_type_walk_agrees_with_the_binder_over_the_p0_matrix`, `the_walk_types_every_arithmetic_node_as_the_binder_does`, and `the_where_composition_matrix_matches_the_declared_rule_exactly`.
  - Evidence they hold under the checked path: Linux L1, built with GCC's builtin path, runs them green (port-2's E0 run recorded Windows and Linux green; PLAN.yaml:3563 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:87cad72693fb337308b4d7915ea9476fb794d9e8570c5c1efc8ef4e558d5bf21).

## §5 Predictions, declared unchanged, invalidators, falsification

- **Predictions:**
  - the §3 table;
  - P0's S1 tally is 0;
  - the engine suite on the P0 target is green;
  - H-STD: the build compiles, with at most a warning that `-std=c++11` was ignored;
  - H-I128: the link succeeds with no compiler-rt library;
  - the probe binary's imports (`dumpbin /DEPENDENTS`) are the MSVC runtime set KNOWN-LIMITATIONS item 15 names;
  - the cold CI builds fit their timeouts: 90 minutes (`product-ci-rust.yml:201`), 60 minutes (`product-ci-shell.yml:171`), 60 minutes (`tauri-build.yml:30`).
- **Declared unchanged:**
  - every admission outcome;
  - every refusal code and string;
  - the fixed detail's text;
  - `Cargo.lock` and both lockfiles;
  - the conveyed notice set;
  - the composition, under route (a);
  - every existing test's assertions.
- **Invalidators (stop, and go to the human):**
  - clang-cl fails to compile or link;
  - the link needs compiler-rt (ADR-030 Reopen 4, a licensing red line);
  - any P0 run meets the S1 condition;
  - a control is admitted;
  - an exact cell differs from X;
  - the engine suite turns red on the clang-cl build;
  - a CI entry times out twice;
  - `vswhom-sys` fails under clang-cl in the shell build.
- **Falsification:** if a clang-cl build still completes an overflowing column product with wrapped rows, H-MSVC's reading of the branch is wrong, and so is this route.

## §6 Instruments

Everything is an assertion: typed outcomes, id sets against the i128 oracle, exact text equality, refusal codes, build success, link success, and the import list. There is no measurement. CI wall times are reported at the gate as observations, not docs/08 figures.

## §7 Declared values and ceilings

- **No product constant is added.**
- **The fixture values** are declared in §3.
- **Size:** at most 450 lines over at most 4 files: `.cargo/config.toml`, `engine/Cargo.toml`, `engine/tests/admitted_integer_overflow.rs` and `CONTRIBUTING.md`. This form and `PLAN.yaml` are excluded.
  - Counting command: `git diff --numstat origin/main...HEAD -- .cargo/config.toml engine/Cargo.toml engine/tests/admitted_integer_overflow.rs CONTRIBUTING.md`, at a named commit.
  - An overrun is class 8.
  - My estimate: about 380 lines (the test about 350).
- **Budget:** 240 minutes of worker time. Builds under bookings are excluded. The node's 60 minutes is the custodian's to revise.

## §8 Block-on-sight

1. Any P0 step committed, or P0 or M1 run on a shared cargo target (sefd or any other).
2. The CXX setting made anywhere other than `.cargo/config.toml`: no workflow `env`, no machine variable presented as the build of record.
3. Any `.github/workflows/*` file in the diff (rule (00), port-2).
4. compiler-rt in the link line or the notice set, or a vendored source patched or forked (directive `:13`).
5. A §4 test that is `#[ignore]`d, `cfg`-gated, or not run on both matrix entries.
6. An assertion weakened below its registered outcome, for example "error or anything".
7. Any campaign exclusion widened or loosened.
8. A KNOWN-LIMITATIONS item added.
9. The human's build-of-record line differing from the answered form.
10. A docs/08 figure stated.
11. ADR-021 edited under route (a); route (b) code without the human's Note and word.
12. A `verify-mutation` run called an observation.
13. Any CI entry red.

## §9 Gates and sequence

1. **The human:**
   - H1, the install on the machine;
   - H2, the booking on the custodian's estimate;
   - W-1 and W-2.
2. **P0, nothing committed:**
   - **P-0, preconditions:**
     - `where clang-cl` resolves, and `clang-cl --version` is recorded;
     - D: has at least 20 GB free (mine: 10–16 GB target, per the design's OPEN-4, plus data).
   - **P-1, the checkout:** a new throwaway checkout, `git worktree add --detach C:/dev/wt/o1-clang <main at dispatch>`, outside `.claude/worktrees/` so that no ancestor `.cargo/` can leak in. Then:
     - porcelain is empty;
     - `o1_probe.rs` is copied from `C:/dev/wt/o1-probe` and its sha256 is checked against the run report `:11`;
     - the probe is extended with L4, T-c, T-o, T-e, T-m and per-k independent queries for T.
   - **P-2, the config:** the untracked `.cargo/config.toml` is written with §2a's exact bytes, the real shape.
   - **P-3, the build:** `CARGO_TARGET_DIR=D:/wt-targets/o1-clang` (new, used by this checkout only), with `CC_ENABLE_DEBUG_OUTPUT=1` on every cargo call. The variable is rerun-tracked (`cc` `src/command_helpers.rs:48`, `:75`), so it must be identical on every call. The run is `cargo test -p spatial-engine --locked --test o1_probe --no-run`, under the machine rules. Record:
     - the exit code;
     - the `running:` line for `multiply.cpp`, naming clang-cl;
     - every warning;
     - link success.
   - **P-4, two runs:** run 1 and run 2 in two processes, as in the O1 run.
   - **P-5, the engine suite (mine):** `cargo test -p spatial-engine --locked` on the same target.
   - **P-6, the imports (mine):** `dumpbin /DEPENDENTS` on the probe binary.
   - **P-7, the report.** It grades nothing. lead-data reads it against the pass criteria at `:11`, with OPEN-1 and OPEN-2 as the human rules them.
3. **Class 1 amendment:** records P0. A deviation from §3 is class 2, and §3 itself is not edited.
4. **Code, by a worker:**
   - It may continue in `C:/dev/wt/o1-clang` on a branch, on the same dedicated target, so that no second clang-cl build is needed.
   - M1 runs in a second dedicated checkout and target (`D:/wt-targets/o1-msvc`), on the human's booking.
5. **The PR, then both gates:**
   - the architect: these ADR readings, and §8 item by item;
   - the reviewer: the full diff and each seam against its consumer.
6. **The suites:** product-ci-rust (Windows and Linux L1), product-ci-shell (including tauri-build), and the governance checks. On a re-run of the PR, read whether the Windows cache held the clang-cl objects (H-CACHE).
7. **Before the merge:**
   - H1 is done. Every local build after the merge needs clang-cl.
   - The custodian tells each in-flight branch to merge main before its next build on a shared target, so that branches cut before and after this piece do not alternately rebuild DuckDB in place.
8. **Operator:** no new walkthrough row. There is no new string, and the fixed detail's P6 sighting is already owed.


*The draft's notes below (the build-of-record check, the OPEN items, what needs the human, rule (00), what it could not settle) are the architect's, carried byte for byte except for the pins. They are this form's reading.*

# The human's build-of-record sentence, checked clause by clause (§31; it is the human's wording)

Source: state/directives/2026-10-26-resent-2026-10-25-o1-s1-clang-cl-route-a-hugeint-cast-b-five-nodes-placed.md:17 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:a81cef02dad3952e5d11ee7f26648dd578fcdfdc569ada0c14dd4953fd2afc4f.

| Clause | Check |
|---|---|
| "The Windows build of the bundled DuckDB is compiled with clang-cl (CXX_x86_64-pc-windows-msvc=clang-cl)" | Holds once §2a lands. It is the exact name `cc` 1.4.0 reads first (`src/lib.rs, line 4214`). |
| "in CI and on the development machine" | CI: all three Windows cargo paths run inside the checkout (§2a). The machine: holds after H1. The one case not covered is a cargo run from outside the checkout. It is dev-only and does not block; it is named in the source comment. |
| "so that DuckDB's int64 multiply takes the compiler's checked path" | Holds by source (run report `:370`), and T-A shows it. |
| "as the macOS and Linux builds do" | **W-2.** Linux: holds, and T-A on the L1 job shows it. macOS: source only, until port-2's macOS entry runs T-A. If port-2 merges first, the clause stands. Otherwise my replacement words are: "as the Linux build does, and as DuckDB's source has the macOS build do". Checked against the code: the guard at run report `:370`, and the L1 job. |
| "An engine test pins it: 4000000000 * 4000000000 ends in the fixed detail, and the exact rows are returned." | **W-1.** Read as the literal product, the clause is predicted false on clang-cl (H-L: admitted, exact rows, no error, by L3's precedent). Read as a column squared, it holds (T-A: A-ar-n id 1024 and S-ar-n k=4 hold 4000000000). "The exact rows" does not say for which predicate, and beside an overflow it can read as contradicting "ends in the fixed detail". My replacement, to settle after P0: "An engine test pins it: in an admitted predicate, a BIGINT column holding 4000000000 squared ends in the fixed detail, and the products that fit in its cells return exactly the rows exact arithmetic selects." Checked against the planned tests: the first half is T-A (S-ar-n, A-ar-n; M1 fails it), and the second half is T-B (the i128 oracle; M2 fails it). If P0 shows L1 ending in the fixed detail, the human's first half may stand literally, and only "and the exact rows are returned" takes my second half. The gate re-checks the words against the code. |

The human answers yes, gives their own words, or accepts the sentence as it stands. The PR records the answer.

---

# OPEN items

- **OPEN-1 (the human's): the fetch-site terminal in "every overflow ends in the fixed detail" (`:11`).** B3's overflow is in its second row group. On clang-cl it may first be raised during a fetch, where the code at main keeps DuckDB's text, operands included (engine/src/stream.rs:2597-2600 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:d48254cb74ba2c81091b49ecf0eb3a8c11fbec2152886ef133de4582887ff8f1).
  - (A) A B3 cell that ends in error with the fetch-site text is recorded and routed to `stream-fetch-overflow-fixed-detail`. It is not a route (a) failure, because no wrong rows are returned.
  - (B) Route (a) waits for that node.
  - (C) As written: any ending other than the fixed detail fails P0.
  - **I recommend (A).** Note that after the merge, overflows reached at the fetch site that used to return wrong rows will show DuckDB's text, values included. The human may want that node moved up.
- **OPEN-2 (the human's): literal-only products (L1, L2, L4) that complete with exact rows.** (A) They count as agreeing with the oracle, and W-1 takes the column wording. (B) They fail the criterion. **I recommend (A).** It is the L3 behaviour already on main, and it returns no wrong rows.
- **OPEN-3 (the custodian's; recommendation (A)): where the setting lives.** (A) `.cargo/config.toml` `[env]`: one place for CI, the installer build and the machine, with no workflow edit and no overlap with port-2. (B) `env:` in product-ci-rust.yml, product-ci-shell.yml and tauri-build.yml, plus a machine variable. (B) overlaps port-2, and a machine variable is outside the repository.
- **OPEN-4 (the human's): a failed pass criterion that is not a build failure.** (A) Stop and report to the human. (B) Route (b) automatically. **I recommend (A).** The condition at `:12` names "cannot build it".
- **OPEN-5 (the human's, a booking): M1.** (A) Book one MSVC DuckDB build on a dedicated target. It observes T-A, T-C and T-E failing, and gives the first behavioural evidence of the one-sided hole. (B) No M1. The build claim then rests on the O1 run's MSVC behaviour for the old cells, and for the new cells it is recorded as unobserved. **I recommend (A).**
- **OPEN-6 (the human's file): CLAUDE.md:28 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:998b4e5e13cfbbe48b33e0daf2e69c7feea90b321fff3663ce84b18e4459ecb9.** The Environment line lists only the MSVC workload. After the merge, a fresh setup also needs clang-cl on PATH. The words are the human's, or §31 if the human treats it as a worker's line.
- **OPEN-7 (the custodian's):** `engine/README.md:523`'s measurement scope ("MSVC") and the owner's-index pointer for the pinned test. Both are in #241's paths. (A) Fold them into this PR if #241 merges first. (B) A follow-up node. **I recommend (A), else (B).**
- **OPEN-8 (the custodian's placement):**
  - `.cargo/**` is in no workflow's path filters, so a later edit of the config alone triggers no Rust CI.
  - If H-CACHE fails, the Windows cache key needs a bump.
  - Both edit `product-ci-rust.yml`. A platform follow-up after port-2 merges.
- **OPEN-9 (the custodian's): the sequence.** The form is committed before P0, so that the predictions come before the result (recommended). Alternatively P0 runs first and the form follows.

# What needs the human

- **H1, the install.** Recommended: LLVM 20.1.8, matching the runner image's version (custodian check `:15`), with its `bin` on PATH. The alternative is the VS component "C++ Clang Compiler for Windows" with its `VC/Tools/Llvm/x64/bin` folder added to PATH: `cc` starts a bare `clang-cl` through PATH, and that component does not add itself to PATH.
- **H2, the booking.**
  - Kind: one cold clang-cl build of the bundled DuckDB on a new target. For reference, MSVC builds were recorded at about 18 minutes (the reviewer), 25–35 minutes (the design's estimate) and 41 minutes cold on CI. These are reference figures, not measurements of clang-cl.
  - Then two short runs and the engine suite.
  - M1 is a second DuckDB build (OPEN-5).
  - The custodian estimates, and the human books.
- **W-1 and W-2.**
- **OPEN-1, -2, -4, -5 and -6.**
- **Red-line text:** none under route (a). Route (b)'s ADR-021 Note is the human's typed words. Any compiler-rt in the link is an ADR-030 matter.

# Rule (00), path by path

This piece's paths:
- `.cargo/config.toml` (new)
- `engine/Cargo.toml`
- `engine/tests/admitted_integer_overflow.rs` (new)
- `CONTRIBUTING.md`
- `engine/ADMITTED-INTEGER-OVERFLOW-SILENT-WRAPAROUND-PREREGISTRATION.md` (new)
- `PLAN.yaml` (the custodian's rows)

**Overlap first: none of these paths is in any in-flight list.** Port-2's `.github/workflows/product-ci-rust.yml` is not touched, by §2a's choice and §8 item 3.

| In flight | Overlap |
|---|---|
| 1c step 1 | none (kernel/, renderer/, docs/adr ADR-022/036, spikes) |
| port-2 | none. It does not edit the workflow, KNOWN-LIMITATIONS, `engine/src/lib.rs`, `app_dirs.rs`, `lod.rs` or the lod tests. Interaction: after both merge, the pinned test runs on macOS too |
| 6b | none |
| #252 | none (`engine/src/dataset.rs` and its tests are not touched) |
| #249 | none |
| #244 | none |
| #241 | none by path. `engine/src/fixture.rs` is used, not edited; #241 adds one function there. `engine/README.md` is deferred (OPEN-7) |
| `protocol/` | not touched |

- **Not a path overlap, but named:** after the merge, every branch's next local build compiles DuckDB with clang-cl, which needs H1 (§9 item 7). Worktrees under `.claude/worktrees/` inherit the main checkout's `.cargo/config.toml` by ancestry, whatever their branch.

# What I could not settle

- Whether cargo 1.97's fingerprint reads `[env]` for `rerun-if-env-changed`. My recollection is yes. P-3, and M1's rebuild, show it.
- Whether `clang-cl` is on PATH on `windows-latest`, not just installed. The PR's first run shows it.
- H-CACHE: whether rust-cache's key covers `.cargo/config.toml`.
- H-I128: whether clang-cl's lowering of the `__int128` paths needs compiler-rt (`hugeint.cpp:216-228`, `numeric_utils.hpp:175`).
- H-STD: how `cc`'s `flag_if_supported("-std=c++11")` probe treats clang-cl.
- H-L and H-FETCH, P3's statistics fold, and L3's mechanism. L3 is B-T1's.
- Cold clang-cl build times against the 90- and 60-minute timeouts.
- The `vswhom-sys` compile under clang-cl.
- macOS behaviour, until port-2.
- The behavioural reality of the one-sided hole on MSVC: still inferred (reading `:83`), unless M1 is booked.
- The reuse index returned no prior art for "integer overflow", "duckdb build compiler" or "checked multiply". The miss is noted. This draft draws on no reuse record.


## The custodian's settlement (class 1, before P0 and before any code): the human's answers of 2026-10-26

The answers are the human's, in `state/directives/2026-10-26-clicks-260-261-244-r2-241-o1-answers-pb-draft-b-6d-260-lines-5b-8a-8b-rulings.md` (its O1 section), and are referenced, not restated; where the human gave words, they are copied from that file by the piece's worker, never retyped.

- **H1 done:** clang-cl reports 20.1.8 in a fresh terminal. P0's first step shows that the build shell sees it on PATH before any build.
- **H2 booked:** a shared hold, from H1's done word: the cold clang-cl build on its own target, the two short runs and the engine suite (§9's P-3 to P-5).
- **W-1:** settled after P0, as §9 and the human's answer give it: the architect's replacement words, unless P0 shows L1 ending in the fixed detail, in which case the human's first half stands and only the second half changes.
- **W-2:** the human's clause stands if port-2 merges first; otherwise the architect's replacement words.
- **OPEN-1 (A), OPEN-2 (A), OPEN-3 (A), OPEN-4 (A).** Filler entry 9, stream-fetch-overflow-fixed-detail, moves to the head of the filler queue the moment this piece merges, its size checked first.
- **OPEN-5 (A), the cheap way first:** the pinned test alone against the existing MSVC build in the probe worktree (`C:/dev/wt/o1-probe`) on its target (`D:/wt-targets/sefd`), with no configuration change in that worktree, so nothing rebuilds; if the architect shows that run does not count as M1, the MSVC build is booked on the custodian's estimate.
- **OPEN-6:** the human's words for CLAUDE.md's Environment line, as the directive gives them; CLAUDE.md joins the Scope for that one line.
- **OPEN-7 (A), else (B). OPEN-8:** a platform node after port-2. **OPEN-9:** this form before P0.
- **Any compiler-rt in the link stops** for the human's word (ADR-030).
- **Rule (00)** was checked at main 2699ae50 by `git diff --name-only origin/main...<branch>` for every open branch and the branches in flight: none touches `.cargo/config.toml`, `engine/Cargo.toml`, `engine/tests/admitted_integer_overflow.rs`, `CONTRIBUTING.md` or `CLAUDE.md`.

## Amendments (opens empty; append-only)

### Amendment 1 (2026-10-27): the human's direction after P0's stop at P-3. Written after P0's build outcome had been seen.

- **What was seen:** P0 stopped at P-3 (`state/consults/2026-10-27-admitted-integer-overflow-silent-wraparound-p0-run-tester-high-report.md`): clang-cl could not build the bundled DuckDB, because DuckDB 1.5.5's own header exports deleted functions, which clang-cl rejects.
- **The direction:** `state/directives/2026-10-27-o1-route-a-continues-duckdb-export-decorations-off-by-the-header-switch.md`, referenced and not restated. Route (a) continues; §5's fallback condition is read by the human as not having fired.
- **§2a:** the `.cargo/config.toml` bytes gain one entry in the same `[env]` table, beside the CXX entry: `CXXFLAGS_x86_64-pc-windows-msvc`, set to the define the tester confirms from the vendored header (the direction, item 1). Its exact bytes, with the header's macro structure byte-copied, are recorded in the next amendment, after the tester's report.
- **§9:** one more cold clang-cl build on the probe's own target under H2's booking, the log checked as before (clang-cl only) and for the define on every DuckDB unit; then P0 as §9 has it. A failure of that build, or of a pass criterion that is not a build failure, stops for the human (OPEN-4 (A)); route (b) is then the route, with its ADR-021 Note in the human's words.
- **The build-of-record sentence** gains the human's clause (the direction, its last paragraph but one), the define written in once confirmed; the gate checks it against the config and the header.
- **Unchanged:** the crate, its build script, its source and the dependency version; route (b)'s pre-code work stays unstarted.

### Amendment 2 (2026-10-27): the define confirmed, and P0's second attempt. Written after P0's results were seen.

- **The report:** `state/consults/2026-10-27-admitted-integer-overflow-silent-wraparound-p0-second-run-tester-high-report.md`. Nothing in this amendment grades it; lead-data reads it against §5 next.
- **The define** (the direction, item 1): `-DDUCKDB_STATIC_BUILD`. By the report, the vendored 1.5.5 header `duckdb/common/winapi.hpp` defines `DUCKDB_API` empty on Windows when `DUCKDB_STATIC_BUILD` is defined, all under `#ifndef DUCKDB_API`; the macro's other uses in the vendored source (two in `duckdb.h`) only choose export or import decorations; the crate's build script defines `DUCKDB_BUILD_LIBRARY` on Windows and neither of the others. The header's lines are byte-copied in the report.
- **§2a's `.cargo/config.toml`** is now these bytes (sha256 6889110645ec075c0cba3bf4aa71c4b43e5b5dfafe7d5a3e8228c05c5010e35f, read from the probe checkout):

```toml
# Bundled DuckDB on Windows: see engine/Cargo.toml, above the `duckdb` dependency.
[env]
"CXX_x86_64-pc-windows-msvc" = "clang-cl"
"CXXFLAGS_x86_64-pc-windows-msvc" = "-DDUCKDB_STATIC_BUILD"
```

- **The build-of-record sentence's clause** (the human's words, from the direction, the define filled in as the direction says): ", with DuckDB's export decorations switched off for this static build (-DDUCKDB_STATIC_BUILD), because clang-cl rejects the exported deleted functions in DuckDB 1.5.5's variant_stats.hpp".
- **The build:** one cold clang-cl build passed; by the report, all 352 DuckDB compile units name clang-cl and carry the define, none names cl.exe, and no compiler-rt name appears in the archive or the probe executable (the linker line itself was not seen).

### Amendment 3 (2026-10-28), class 1: P0 recorded. Written after P0's results, lead-data's reading and the EXPLAIN were seen. References and hashes only.

- **The first P0** stopped at P-3: `state/consults/2026-10-27-admitted-integer-overflow-silent-wraparound-p0-run-tester-high-report.md` (sha256 from line 5, 7c61dbaa576dbd2c735953e6bda6e1b178917e39c62ebaed2e76f69e44f0eddc); Amendment 1.
- **The second P0** is this form's P0 record: its cells, tallies and build facts as `state/consults/2026-10-27-admitted-integer-overflow-silent-wraparound-p0-second-run-tester-high-report.md` gives them (sha256 from line 5, accbcfe1b8007b27d9521136a20365748c2f2c8e83e552684193f0772a437ef2); Amendment 2 records the define and the config.
- **The reading:** `state/consults/2026-10-27-admitted-integer-overflow-silent-wraparound-p0-reading-lead-data.md` (sha256 from line 5, 11e3d1c854ef39182780dad72e65c8e8ddaecb50ae41ad3b75d4614396351089): the pass criteria met, no invalidator.
- **The statistics-file cells** (P3 and T-c-ar-s Q3 completing equal to X): accepted by the human's ruling, `state/directives/2026-10-28-o1-p3-accepted-one-explain-6b-takes-s-from-6d-262-stands-8a-goes-ahead.md`, item 1 (every overflow DuckDB evaluates); the one EXPLAIN it orders, `state/consults/2026-10-28-admitted-integer-overflow-silent-wraparound-p3-explain-tester-high-report.md` (sha256 from line 5, 215bf85b891051c89aedbcc31c0cb03e30d308e465dd36f3bb83e4686b0cd233), shows the IS NOT NULL folded with no multiply evaluated, so OPEN-4 (A) is not reached.
- **W-1:** the architect's replacement words, as the human's answers settle them (`state/directives/2026-10-26-clicks-260-261-244-r2-241-o1-answers-pb-draft-b-6d-260-lines-5b-8a-8b-rulings.md`, W-1), P0's L1 having completed rather than ended in the fixed detail.
- **ADR-030:** the archive check in the second P0 stands as the evidence; the PR's Windows build captures the link line once, for the record (the ruling, item 1).
- **Next under §9:** the architect's call on M1, then the code.
