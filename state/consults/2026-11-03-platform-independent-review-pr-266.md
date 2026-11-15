*Custodian's filing note (2026-11-05): a Claude Platform session's report, filed as a consult under the human's direction of 2026-11-05 (`state/directives/2026-11-05-platform-runs-filed-c1-governance-next-fixtures-kernel-node-8b-route-a-f-b-after-8c.md`, line 8, item 1); a reading and not Authority. Provenance: the human's advisory folder for this project, `PLATFORM-RUNS-2026-11-03/INDEPENDENT-REVIEW-PR-266-2026-11-03.md` (7466 bytes, sha256 d17a3c1f29f03ed72fe0a52301ba56fffff2cdaf15109e3ecf0b7b5baf713c46), named in that folder's INDEX.md (sha256 ff6aa985a37ded9869e1dbc62580ee527d6e9a5d6a4b87ba0073c3073f944c73): session sesn_01XWmRC16UbrYwyJ9BzZdDww, agent spatial-ide-indipendent-reviewer-agent (claude-fable-5-1, effort high), US$ 5.92, about 785 s active. The file's own provenance paragraph, the advisor's, comes first under its title; below the rule the file is unchanged, byte for byte. It reviewed commit 4943d8b4a0272e02ea9d49371bb4ae1a069fbad6 (the merged PR's tip, its own first lines say), main being at 652752afa9bedb0172948869c9ab7f0b8ee08dd3 when the runs started (INDEX.md); from it to main at ae55d424, 28 product, docs or KNOWN-LIMITATIONS files changed (by git diff --name-only), so its readings of those files are read again before any node rests on them. No cloud filing answers the same question. By the human's ruling of 2026-11-05 (item 2), nothing blocks, and this is recorded.*

---

# Independent review of merged #266 (O1 clang-cl), 2026-11-03

Provenance. An independent agent on the Claude Platform (claude-fable-5-1, effort high; agent `spatial-ide-indipendent-reviewer-agent`, the agent's own system prompt) cloned the public repository in a fresh sandbox and worked at the commit its first lines name (4943d8b4a0272e02ea9d49371bb4ae1a069fbad6). It changed nothing outside its sandbox, pushed nothing, opened nothing. The advisor started the run through the platform API at the human's request (session sesn_01XWmRC16UbrYwyJ9BzZdDww) and fetched the agent's messages verbatim, in order, separated by rules; run figures from the session record: about 785 s active, US$ 5.92. Nothing below this line is edited.

---

I'll start by cloning the repository and fetching the pull request.

-----

The branch's real content is 7 files. Now the form from origin/main, the MOVED map, and the review checklist.

-----

Now the cited rulings under state/directives/ (reading from origin/main; checking whether they moved).

-----

Now the review checklist, AUTONOMY.md (relevant sections), and CLAUDE.md on the branch.

-----

Now the diff itself, from the fork point (the real content of the branch).

-----

Checking the human's words byte for byte against their sources (CLAUDE.md line vs OPEN-6; engine/Cargo.toml sentence vs A.4).

-----

Both human-worded lines match. Now the test file in full.

-----

Let me fetch the `libduckdb-sys` 1.10505.0 crate source to check the build-script and header claims the form and the comments rest on.

-----

**Repository:** christopherdonini/spatial-ide — **PR #266** — **commit reviewed:** 4943d8b4a0272e02ea9d49371bb4ae1a069fbad6 — **merge base:** 87e481e5 (first parent of merge fa720a7f); the branch's own content is the 7-file diff from fork point af9c25bc (everything else in the 87e481e5 diff is main's later records, not the branch's).

Form read from origin/main (`governance/forms/engine/ADMITTED-INTEGER-OVERFLOW-SILENT-WRAPAROUND-PREREGISTRATION.md`, Amendment 10 first, then 1–9), with the eight `state/directives/` rulings it cites, `governance/AUTONOMY.md` §21/§22/§31, and `.claude/agents/reviewer.md`. Nothing under `state/consults/gates/` was read.

## Correctness

None found.

## Evidence

None found.

## Documentation

None must-fix. Both human-worded lines were byte-compared against their sources and match: the engine/Cargo.toml build-of-record sentence equals A.4 of `2026-10-28-rulings-by-lane-…`, including the semicolon after `variant_stats.hpp`; the CLAUDE.md Environment line equals OPEN-6 in `2026-10-26-clicks-260-261-…`. The marker line equals Amendment 7's text. The CONTRIBUTING sentence equals §2a's words. `.cargo/config.toml` sha256 is 6889110645ec…, Amendment 2's bytes.

## Notes (nothing blocks)

1. **`engine/tests/admitted_integer_overflow.rs:401-403`** — T-A iterates only `fixed` = Gt/Lt. §3 predicts P3/Q3 (`(v*v) IS NOT NULL`) on the no-statistics overflow files (A-ar-n, S-ar-n, T-c-ar-n, T-o) also end in the fixed detail, but no test asserts it: in T-C (`:454`) any run that errors is skipped. A build that raised DuckDB's raw text for those cells would pass all five tests. This is inside §4 as written (T-A names P1/P2/Q1/Q2 only), so it is a gap in coverage, not a deviation. Confirmed by reading.
2. **`.github/workflows/product-ci-rust.yml` / `product-ci-shell.yml` path filters** — neither includes `.cargo/**`. A later edit of `.cargo/config.toml` alone (e.g. the `[env]` entries removed) triggers no Rust or shell CI; the Windows guarantee would regress silently until an unrelated `engine/**` change ran T-A. Already recorded as OPEN-8 and barred from this piece by rule (00); noting it as the one unguarded edge of the build of record. Confirmed by reading.
3. **`.cargo/config.toml:4`** — `CXXFLAGS_x86_64-pc-windows-msvc` also reaches `vswhom-sys` in the shell build (the only other `cc` C++ compile on that target, per both lockfiles); the define is inert there. Confirmed by reading the lockfiles.
4. `spikes/adr-029-g1-scan-progress` builds libduckdb-sys in its own dev profile without the override and will hit the `bit_utils.hpp` `__clang__` asserts on a Windows debug build; disclosed in Amendment 7, no CI runs it.

## What I checked

- **Build mechanism, read against the real other side.** libduckdb-sys 1.10505.0 (`build_bundled_cc.rs:110-133`, fetched at tag v1.10505.0): `cpp(true)`, `/EHsc` keyed on `CARGO_CFG_TARGET_ENV` (so it stays under clang-cl), `NDEBUG` only when cargo's `DEBUG` is false, `DUCKDB_BUILD_LIBRARY` on Windows. cc 1.4.0 (`src/lib.rs:4204-4218`): `CXX_x86_64-pc-windows-msvc` is the first name read; `src/tool.rs:279`: a stem containing `clang-cl` is `Msvc { clang_cl: true }`; `CXXFLAGS_<target>` appended via `envflags`; a missing tool is `ToolNotFound` ("failed to find tool"), which supports the CONTRIBUTING sentence. Vendored DuckDB 1.5.5: `winapi.hpp` and `duckdb.h:18,35` honour `DUCKDB_STATIC_BUILD` as Amendment 2 reads them; `multiply.cpp:193-258` is the `__GNUC__>=5 || __clang__` guard with the `#else` branch that skips the check when both high words are zero; `bit_utils.hpp:44-46,61-63` are the `__clang__` asserts the shell comment describes.
- **Shell profile.** `frontends/shell/src-tauri/Cargo.toml:9` `[workspace]` makes it a root, so `[profile.dev.package.libduckdb-sys]` applies; the table equals the root's (`Cargo.toml:66-69`); test/dev inherit it, release already has `debug=false`. Set nowhere else (Amendment 7's §8 item).
- **Test against the engine API.** `AdmittedPredicate::admit(String,&Dataset)`, `ViewportQuery::all/viewport/with_limit/with_filter` (`stream.rs:258-285`), `stream_with_cancel` (`:919`), `next_into` (`:795`, error delivered once then `None`), `Dataset::open/file_schema/crs().identifier()`, `fixture::{configured_connection, write_geoparquet, FixtureSpec{features,row_group_rows,statistics}, StatisticsMode::WriterDefault}`, fixture `id` = row index (`fixture.rs:1055`), `ID_COLUMN == "id"`. `FIXED_DETAIL` equals `"query: " + OUT_OF_RANGE_DETAIL` (`error.rs:350`, `stream.rs:2603`) and the campaign's const (`admission_property_campaign.rs:1018`). Fixture values match §3 (S, E, T-c, T-o, T-e, T-m); each file is checked for layout, statistics, readback and `open` as §2b requires; both shapes run; no `#[ignore]`, no `cfg`, no `pub` item. Mutation-comment figures are arithmetically consistent with the fixtures (A-ar-n 1023/2047, E-ar-n NOT → 1 id [0], S-ar-n 2 ids, T-o 1 id, B-ar-s L1 0/2048, 28 of 30 cells).
- **Changed existing tests:** none; `engine/src/**`, both lockfiles, every workflow, ADR-021, KNOWN-LIMITATIONS and the campaign exclusions are untouched. §8 items 1–13 and Amendment 7's addition: none fires. `.cargo` config exists only at the root (no ancestor/child config). README owner's index is 34 lines (cap 60).
- **Would run, cannot here:** `cargo test -p spatial-engine --locked --test admitted_integer_overflow` on Windows with clang-cl on PATH and on Linux (T-A green on Windows is itself the proof that clang-cl objects were used, since M1 shows cl.exe fails it); the same with both `[env]` entries removed on a dedicated target (expect T-A, T-C, T-E, and per Amendment 5 T-B, to fail); `cargo test --manifest-path frontends/shell/src-tauri/Cargo.toml --locked` on Windows with `CC_ENABLE_DEBUG_OUTPUT=1`, reading every `running:` line for `clang-cl`, `-DDUCKDB_STATIC_BUILD` and `-DNDEBUG`.

-----

