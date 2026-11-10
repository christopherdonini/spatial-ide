*Custodian's filing note (2026-10-26): the architect's read-only draft of the five-line form for `fixture-s-regeneration-entry-point`, the filler queue's entry 6d (S3), next in the filler slot, read at main 7939326c. Its first finding: the piece does not fit §21c's size (about 200 to 245 changed lines over 2 files, against 150), so under §36 it is a filler only by the human's one-line note under §21c. Its OPEN-1 (the bound: a note setting 260 lines, the architect's recommendation; or the full form) and OPEN-6 (whether entry 6b may take S from this entry point, writing to D:, instead of the matrix generator) are the human's and are put to the human; nothing is committed from this draft until the human answers. The custodian's choices on the rest, if the piece goes ahead: OPEN-2 (A), Windows only, refusing off Windows by name; OPEN-3 (A), a floor of twice S's size; OPEN-4 (A), a .partial file renamed only on a matching hash; OPEN-5 (A), no literal spec-pin test. Its note 7's contact with #241's engine/src/fixture.rs is read at dispatch. Its stale-record finding (kernel/FIXTURES.md's G5 spec block lists fewer fields than spec_5gb sets) goes to the human with this filing. The run 02:45:25Z to 02:57:03Z by its transcript (Glob 3, Grep 13, Read 28; no write tool). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 6b8ab0732e38aceb67481b34dd4bb1304dbdf02e232198a4bbc5310a19f7a472.*

---

Drafted: fixture-s-regeneration-entry-point, five-line form, architect

Read at main @ 7939326c, in the main checkout's working tree. At the start of the session, git status showed HEAD 7939326c with no tracked changes. Every cite is `@ 7939326c`. I have no shell, so this report carries no sha256; the custodian expands the pins. The text is my own words, except strings in backticks, which are byte-copied from what Read returned.

**Size, first: it does not fit §21c.** My estimate is about 200 to 245 changed lines over 2 files. That breaks down as about 175 to 220 in the new test file and about 24 in kernel/FIXTURES.md, which counts: the five-line precedent kernel/FIXTURES-REGENERATE-ORDER-PREREGISTRATION.md:7 @ 7939326c counted FIXTURES.md lines. §21c's bound is 150 (AUTONOMY.md:350-351 @ 7939326c, :357). The G5 precedent declared at most 150 and landed 264 (kernel/FIXTURE-REGENERATION-ENTRY-POINT-PREREGISTRATION.md:9 @ 7939326c), and this tool adds a volume check, a hash check and a junction test on top. §36 admits a filler only if it "fits a five-line form under §21c's size" (AUTONOMY.md:692 @ 7939326c). So the form below declares 260 lines on the assumption of OPEN-1 (A), which is the human's call. Without that note, it is not a filler as placed.

```
Authority: PLAN node `fixture-s-regeneration-entry-point` (PLAN.yaml:4472-4488 @ 7939326c), generation 1; placed by the human's direction of 2026-10-26, item 2 (state/directives/2026-10-26-o1-s1-257-258-259-merged-6b-r3b-held-on-the-human-6c-runs-fixture-s-entry-point-6d.md:12 @ 7939326c), filler queue entry 6d, S3 (state/FILLER-QUEUE.md:16 @ 7939326c); the filler rule, AUTONOMY.md §36 (AUTONOMY.md:692 @ 7939326c): a five-line form under §21c, the reviewer and the architect from dispatch, round 25, item 2 (e) set aside; this piece's line bound set by the human's one-line note under §21c (AUTONOMY.md:354-355 @ 7939326c; OPEN-1 (A)); proposed as R3c of state/consults/2026-10-25-first-batch-factorial-ignored-trace-tests-fixture-s-route-architect.md; the reuse index found no prior art on either search (fixture regeneration; parquet fixture hash), a miss noted here.
Scope: 2 files: kernel/tests/regenerate_fixture_s.rs (new) and kernel/FIXTURES.md (one new section for S after G5's, no other line of the file changed); declared line budget 260 (insertions plus deletions, comments counted, AUTONOMY.md:357 @ 7939326c), under the human's note (OPEN-1 (A)); this form exempt; kernel/tests/first_batch_factorial.rs, engine/tests/import_layout_fixtures.rs (its C: check included), kernel/tests/support/mod.rs, kernel/tests/regenerate_fixture.rs and engine/src/fixture.rs are read, not changed; no other file changes.
Change: a new ignored test, `regenerate_parcels_145mb_fixture`, writes the fixture S alone through `write_geoparquet_cancellable` with a fresh token, from a field-for-field restatement of first_batch_factorial.rs's `spec_s()`, to the absolute path `SPATIAL_REGEN_OUT` names, refusing an existing output, a relative path, and a drive with less than twice S's 151,629,665 bytes free, where the drive is read from the output folder's canonical path (junctions followed, so not C: for a folder linked to D:), writing to `<name>.partial` and renaming it to the output only when its full sha256 equals S's, else renaming it to `<name>.mismatch` and panicking with both hashes; kernel/FIXTURES.md records S on G5's model.
Tests+mutation: seven new tests in kernel/tests/regenerate_fixture_s.rs, each with one mutation predicted to fail it by name: `refuses_to_overwrite_an_existing_output_path`, M-1 delete the existing-output guard; `refuses_a_relative_output_path`, M-2 delete `out_path`'s absolute guard; `the_drive_is_read_from_the_resolved_path` (Windows), M-3 `drive_of` returns `Some('C')`; `the_volume_read_follows_a_junction` (Windows), M-4 `resolved` returns the folder as given; `refuses_below_the_floor_on_the_outputs_volume` (Windows), M-5 delete the floor assert; `a_hash_mismatch_leaves_no_output_and_names_both_hashes` (Windows), M-6 delete the hash comparison; the ignored `regenerate_parcels_145mb_fixture`, M-7 `spec_s()`'s seed to `0x5EED_2056_0000_0008`, predicted to fail at `sha256 mismatch`; M-1 to M-6 observed in a debug build, the unmutated full run and M-7 in a release build writing to the piece's own folder on D: (note 5), each recorded by name with the 40-hex commit it was observed at in a `RECORDED MUTATION:` doc line, then reverted; a verify-mutation run is not an observation; a mutation that passes, or fails anywhere else, is a stop; an unmutated full run whose sha256 is not S's is a stop, both hashes to the human, no second attempt.
Out-of-scope: ADR: no status line or amendment; security: nothing ADR-020, ADR-009 or ADR-021 governs (a test-only tool that writes only where its operator names, no exposure surface, no dependency); wire: no SKP, data-plane or MCP surface, nothing under protocol/; guarantee: none changed, since no existing test, assertion, message, fixture path, constant or recorded figure changes, the matrix generator's C: check stays as that cut's recorded preflight, and the new tests assert properties of a new test-only tool, not a stated guarantee; the five-line form stands under §36, which sets round 25, item 2 (e) aside.
```

## Notes (my reading)

### 1. Where the entry point lives and how it is run
- It is a new integration-test binary, kernel/tests/regenerate_fixture_s.rs, with one `#[ignore]`d test, run like G5's: release build, `--ignored --exact`, the output named by `SPATIAL_REGEN_OUT`. Compare kernel/tests/regenerate_fixture.rs:30-31, :78-91 @ 7939326c and kernel/FIXTURES.md:23 @ 7939326c.
- Why not a second ignored test in regenerate_fixture.rs:
  - kernel/FIXTURES.md:40-42 @ 7939326c says `--exact` names the one ignored generation test in that binary, which would become untrue.
  - G5's refusal text says `deliberately manual, because it is 5 GB.` (kernel/tests/regenerate_fixture.rs:60-61 @ 7939326c), which is untrue for S. FIXTURES.md:73-74 quotes it.
  - Either fix would change G5's surface, against "Nothing else changes".
- It requires an absolute path; G5 resolves a relative one under the workspace root (regenerate_fixture.rs:38-48). That saves a copied resolver and its test. A relative path refuses by name. This is my choice and costs about 7 lines.
- The kernel dev-dependency already enables `fixture` (kernel/Cargo.toml:38 @ 7939326c), so no feature flag is needed and no dependency is added.

### 2. How it builds S without touching spec_s or its callers
- `spec_s()` and its constants are private items of the first_batch_factorial integration-test crate (kernel/tests/first_batch_factorial.rs:46-53, :112-123 @ 7939326c). No other test binary can import them.
- Moving them into support/mod.rs, as G5's piece did with spec_5gb, would edit first_batch_factorial.rs, which is entry 6b's branch path. Rule (00) forbids that.
- So the new file restates them field for field, as engine/tests/import_layout_fixtures.rs:50-63, :98-109 @ 7939326c already does. That makes three copies. The full sha256 binds them all: any change to the copy, to `FixtureSpec`'s defaults (engine/src/fixture.rs:551-575 @ 7939326c) or to the writer that moves S's bytes shows up as a mismatch.
- The writer is `write_geoparquet_cancellable(path, spec, &CancelToken::new(), None)`, the same call G5 makes (regenerate_fixture.rs:64-65). `write_geoparquet`, which wrote S originally (first_batch_factorial.rs:792), is a wrapper over exactly that call (engine/src/fixture.rs:860-862 @ 7939326c). So the bytes route is identical.
- `support::file_facts` (kernel/tests/support/mod.rs:417-425 @ 7939326c, sha256 via engine/src/index.rs:602-634 @ 7939326c) computes the hash. `mod support;` is used read-only and support/mod.rs is not edited.

### 3. The disk check
- **The drive.** The check calls `resolved(dir)`, which is `std::fs::canonicalize` of the output's folder, after `create_dir_all`. That folder may be a junction: the main checkout's `target/` is one, pointing to D: (kernel/FIXTURES.md:100 @ 7939326c; state/consults/2026-10-25-first-batch-factorial-ignored-trace-tests-worker-stop-report.md:19 @ 7939326c). `drive_of` then reads the `Prefix::VerbatimDisk` / `Prefix::Disk` letter, and the check queries `(Get-PSDrive <letter>).Free`, the query shape support/mod.rs:385-391 uses for C:.
- The C:-only helpers (support/mod.rs:385-407, 20 GiB; import_layout_fixtures.rs:130-151, 40 GiB) are not used or changed.
- An unreadable drive (UNC, or off Windows, where std's `Path` has no prefix) refuses with its own message, not as `0 B` free.
- **The floor.** Twice S's recorded size, 2 × 151,629,665 B (kernel/RESULTS.md:2988 @ 7939326c). That is the one file it writes plus the same again as margin; nothing else is written, and the hash only reads (OPEN-3).

### 4. The hash, and what a mismatch does
- The expected value is the full hash at engine/tests/import_layout_fixtures.rs:79-80 @ 7939326c, restated as a constant. RESULTS.md holds only the 16-hex prefix (:2988).
- The write goes to `<name>.partial`. On a match it is renamed to the output; on a mismatch it is renamed to `<name>.mismatch` and the run panics, naming both hashes and that path. That is a stop, never a retry.
- The reason: readers of S's path do not compare its hash. first_batch_factorial.rs asserts only that the file exists, and query_window_attribution.rs:445, :452 @ 7939326c records the hash without comparing it. So the canonical path should only ever hold a verified S, after a mismatch or a Ctrl-C (OPEN-4).

### 5. The piece's observation, its folder and its cost
- **Place.**
  - A worktree from main under C:/dev/wt/, with its own cargo target on D:/wt-targets/. C: is the drive that is short, and D: had 175 GB free by the stop report's `df` (stop report :24).
  - The outputs go in the piece's own folder, for example `D:/wt-targets/<piece>-out/full/` for the unmutated run and `.../m7/` for M-7. They need separate folders, because M-7 on an existing output would fail at `already exists`, which counts as failing elsewhere.
  - Nothing is placed in the main checkout. Placing S at first-batch/ is 6b's step under R3b (the direction's item 1, :10).
- **Runs**, each heavy step in a shared hold (state/directives/2026-10-06-machine-script-adopted.md:13-15 @ 7939326c):
  1. The debug build plus the seven cheap tests, and M-1 to M-6, each a rebuild of this test crate only.
  2. The release build, then `SPATIAL_REGEN_OUT=<own folder>/full/parcels-145mb.parquet cargo test --release --locked -p spatial-kernel --test regenerate_fixture_s -- --ignored --exact regenerate_parcels_145mb_fixture --nocapture`. It must pass. Record its printed bytes, sha256, resolved folder and free bytes.
  3. M-7 into `m7/`, then revert, and confirm the file matches the code commit.
- **Order.** The code commit, then the observation, then the record commit: the RECORDED MUTATION lines and the FIXTURES.md section's determinism sentence.
- **Cost.** Two first builds on a fresh target (duckdb bundled), about 15 to 30 minutes each by my unmeasured estimate. The writes and hashes take seconds. Nothing is timed, so a timing miss cannot occur and no exclusive hold is ever needed. §36's shared-only rule holds. The node's 60 minutes (PLAN.yaml:4483) is likely short; that is not measured.
- **Start.** One filler at a time: the code starts after #260 merges. The form can be committed ahead.

### 6. Out-of-scope readings
- **ADR, security, wire.** None is touched.
- **Guarantee.** Nothing currently under test changes. The tool, like G5's, passes a token that is never cancelled (regenerate_fixture.rs:64-65); that is the existing instrument precedent, and the form claims no cancellation property.
- **P6.** No string in the app.
- **KNOWN-LIMITATIONS.** No item is owed: the Windows-only limit is a dev tool's and not user-visible (OPEN-2).
- **kernel/README.md.** Not touched; #241 holds it.
- **Portability.** The template's platform section (docs/PREREGISTRATION-TEMPLATE.md:177 @ 7939326c) binds the full form. My reading: a test-only tool is not a product feature. Its platform behaviour is still stated: Windows, macOS and Linux CI run the two cross-platform tests, and Windows CI runs all six cheap ones (.github/workflows/product-ci-rust.yml:194-197, :234 @ 7939326c).

### 7. Rule (00), path by path
The piece's paths are kernel/tests/regenerate_fixture_s.rs, kernel/FIXTURES.md, and the form on main; I propose kernel/FIXTURE-S-REGENERATION-ENTRY-POINT-PREREGISTRATION.md (no file of that name exists).

| In flight | Overlap |
|---|---|
| 1c step 1 | none (contact: kernel/src/lib.rs is linked into the test binary, not edited) |
| port-2 | none (contact: engine/src/lib.rs, lod.rs) |
| 6b | none (first_batch_factorial.rs is read, not edited) |
| #260 | none |
| #252 | none |
| #249, #244 | none |
| #241 | none by path. **Contact:** it edits engine/src/fixture.rs, the writer. If its change moves the Polygon generator's bytes, S's regeneration mismatches. I cannot read the branch; the custodian should read #241's fixture.rs diff before dispatch and record the observation's base. |

Nothing is under protocol/. The path lists are the brief's.

### 8. The words (not the human's wording; the worker applies them as written, wrapped at 100 columns)

**W1, the module doc:**
> **The fixture S's regeneration entry point, on `regenerate_fixture.rs`'s model for G5.** It writes `parcels-145mb.parquet` alone, with no watchdog and no measurement, from `first_batch_factorial.rs`'s `spec_s()`, restated here field for field because that file's spec is private to it. Before the write it reads the free space of the drive the output's folder resolves to, junctions followed, and refuses below twice S's size. It writes to `<name>.partial` and renames it to the output only when the file's full sha256 is S's; otherwise it renames it to `<name>.mismatch` and stops. The hash is the restatement's pin: any change to the copy, to `FixtureSpec`'s defaults or to the writer that moves S's bytes shows as a mismatch. Off Windows the drive is not read and the entry point refuses. `kernel/FIXTURES.md` records S.

Clause checks:
- "no watchdog and no measurement": the Change line adds neither. Holds.
- "private": first_batch_factorial.rs:112 is a non-`pub` fn in its own test crate. Holds.
- "twice S's size", ".partial … .mismatch": what the Change line makes true; the gate checks it.
- "any change … that moves S's bytes": spec_s uses `..Default::default()` (first_batch_factorial.rs:121), and the hash covers every byte. Holds as worded.
- "Off Windows … refuses": std `Path` has no `Prefix` component off Windows. Holds; this is a reading.

**W2, the kernel/FIXTURES.md section** (after G5's section, before the corpus pointer at :119):
> ## `parcels-145mb.parquet` — the first-batch cut's 145 MB source fixture, S
>
> | Field | Value |
> |---|---|
> | **Path** | `target/slice-evidence/first-batch/parcels-145mb.parquet`, where `kernel/tests/first_batch_factorial.rs` and `kernel/tests/query_window_attribution.rs` read it |
> | **Size** | 151,629,665 bytes |
> | **SHA-256** | `fe61e704fcc01d40b0e453d81a4987fc23862dcc38d62bd1f9635d124433ac7a` |
> | **Generator** | `spec_s()` in `kernel/tests/first_batch_factorial.rs`, restated field for field in `kernel/tests/regenerate_fixture_s.rs` |
> | **Regenerate** | `SPATIAL_REGEN_OUT=<an absolute path>/parcels-145mb.parquet cargo test --release -p spatial-kernel --test regenerate_fixture_s -- --ignored --exact regenerate_parcels_145mb_fixture --nocapture` (Windows only) |
> | **Writer** | `spatial_engine::fixture::write_geoparquet_cancellable` (arrow-rs); `first_batch_factorial.rs` writes through `write_geoparquet`, a wrapper over it |
>
> **Exact generation spec** (`spec_s()`): `features` 100_000, `avg_vertices` 100, `hole_every` 7, `seed` 0x5EED_2056_0000_0007, `chunk` 8_192, `row_group_rows` 8_192, `license` `LicenseMode::DeclaredBySource`; every other field is `FixtureSpec::default()`'s, so the SHA-256 above, not this list, is the spec's pin.
>
> **Guardrails.** The Regenerate command refuses an existing file, a relative path, and a drive with less than twice S's size free, read on the drive the output's folder resolves to with junctions followed (this machine's `target/` is a junction to D:, as G5's table records). It writes to `<name>.partial` and renames it to the Path only when the full SHA-256 matches; on a mismatch it renames it to `<name>.mismatch` and stops.
>
> **Determinism.** <after the observation: one regeneration by this command, at <40-hex commit>, matched the Size and SHA-256 above on this machine (this piece's form, Amendment <n>)> Cross-machine and cross-toolchain determinism is not established, as for G5 above.
>
> The other writer of S is `engine/tests/import_layout_fixtures.rs`'s matrix generator, which writes it under its own folder when this Path is absent or does not match; its C: disk check is that cut's recorded preflight and is unchanged.

Clause checks:
- Path's readers: first_batch_factorial.rs:221; query_window_attribution.rs:50-55. Holds.
- Size: RESULTS.md:2988. SHA-256: import_layout_fixtures.rs:79-80. Hold.
- Spec fields: first_batch_factorial.rs:46-53, :112-123. Holds.
- Wrapper: fixture.rs:860-862. Holds.
- Junction: FIXTURES.md:100; stop report :19. Holds as machine state on those dates.
- Matrix generator: import_layout_fixtures.rs:266-300 (own folder :281, :292), C: check :130-151. Holds.

## OPEN items
- **OPEN-1 (the human's): the size.**
  - (A) **Recommended.** A one-line note under §21c setting this piece's bound at 260 lines over 2 files, keeping the five-line form and both gates from dispatch.
  - (B) The full form and full gating. Under §36's wording it is then not a filler unless the human places it there.
  - (C) Narrowing to fit 150. I find no honest version: dropping the junction test, the relative-path test and the spec line still leaves about 170.
- **OPEN-2 (the custodian's).** (A) **Recommended:** Windows only, refusing off Windows by name. (B) `df -Pk` off Windows: about 10 more lines, and the floor and mismatch tests then run on Linux and macOS CI as well. I recommend (A) because the readers of S live on this Windows machine.
- **OPEN-3 (the custodian's): the floor.** (A) **Recommended:** 2 × S_BYTES. (B) S_BYTES + 1 GiB. (C) S_BYTES.
- **OPEN-4 (the custodian's): the mismatch.** (A) **Recommended:** `.partial`, then rename on a match, else `.mismatch`. (B) Write in place and move aside only on a mismatch, about 2 lines fewer, but a Ctrl-C leaves a partial file at the Path. (C) Write in place and panic only, like G5, which leaves a wrong file where the readers look.
- **OPEN-5 (the custodian's): a literal spec-pin test** like `spec_5gb_matches_the_scale_pass` (regenerate_fixture.rs:163-197). (A) **Recommended:** none; the hash is the pin. G5 needed one because its spec is shared with a measured pass. (B) Add it: about 30 more lines, so the budget becomes 290.
- **OPEN-6 (the human's; it does not block 6d, and per §36 it should be asked now).** Once 6d lands, may entry 6b take S from this entry point instead of the matrix generator? It writes to D: through a folder of the piece's choosing, under a floor of about 289 MiB, so freeing 15 GB on C: would not be needed. R3b as ruled names the matrix generator, so nothing changes unless the human says so.

## What I could not settle
- Whether a regeneration reproduces fe61e704…: the arrow/parquet stack may have moved since S was written. Only the observation decides it, and a mismatch is a stop.
- #241's change to engine/src/fixture.rs: I cannot read the branch.
- The line counts are estimates, not counted code.
- The build times are not measured.
- Noticed, outside this scope ("nothing else changes"): G5's spec block at kernel/FIXTURES.md:48-65 @ 7939326c lists 16 fields, while `spec_5gb()` sets 18 (kernel/tests/support/mod.rs:530-531 @ 7939326c: `geometry`, `declared_types`). It is a stale record and a candidate node for the custodian.
- No sha256 anywhere in this report: I have no shell.

Paths read: C:\dev\spatial-ide\state\directives\2026-10-26-o1-s1-257-258-259-merged-6b-r3b-held-on-the-human-6c-runs-fixture-s-entry-point-6d.md, C:\dev\spatial-ide\PLAN.yaml, C:\dev\spatial-ide\kernel\tests\regenerate_fixture.rs, C:\dev\spatial-ide\kernel\FIXTURES.md, C:\dev\spatial-ide\kernel\FIXTURE-REGENERATION-ENTRY-POINT-PREREGISTRATION.md, C:\dev\spatial-ide\kernel\FIXTURES-REGENERATE-ORDER-PREREGISTRATION.md, C:\dev\spatial-ide\kernel\tests\first_batch_factorial.rs, C:\dev\spatial-ide\kernel\tests\support\mod.rs, C:\dev\spatial-ide\kernel\tests\query_window_attribution.rs, C:\dev\spatial-ide\engine\tests\import_layout_fixtures.rs, C:\dev\spatial-ide\engine\src\fixture.rs, C:\dev\spatial-ide\engine\src\index.rs, C:\dev\spatial-ide\kernel\Cargo.toml, C:\dev\spatial-ide\kernel\RESULTS.md, C:\dev\spatial-ide\kernel\FIRST-BATCH-FACTORIAL-IGNORED-TRACE-TESTS-PREREGISTRATION.md, C:\dev\spatial-ide\state\consults\2026-10-25-first-batch-factorial-ignored-trace-tests-worker-stop-report.md, C:\dev\spatial-ide\state\consults\2026-10-25-first-batch-factorial-ignored-trace-tests-fixture-s-route-architect.md, C:\dev\spatial-ide\AUTONOMY.md, C:\dev\spatial-ide\state\FILLER-QUEUE.md, C:\dev\spatial-ide\docs\PREREGISTRATION-TEMPLATE.md, C:\dev\spatial-ide\state\directives\2026-10-06-machine-script-adopted.md, C:\dev\spatial-ide\.github\workflows\product-ci-rust.yml.
