# kernel/tests/regenerate_fixture_s.rs: an ignored entry point that writes the fixture S alone and keeps it only on its full sha256 — five-line short form (`AUTONOMY.md` §21d)

*Committed before any code. Append-only once committed; an amendment written after any run of this piece's mutations, or any regeneration, has been seen says so in its first line. PLAN node fixture-s-regeneration-entry-point, the filler queue's entry 6d (S3). The five lines and the notes are the architect's draft (`state/consults/2026-10-26-fixture-s-regeneration-entry-point-five-line-form-architect-draft.md`, read only at main 7939326c; its sha256 from line 5 is 6b8ab0732e38aceb67481b34dd4bb1304dbdf02e232198a4bbc5310a19f7a472), with two changes, both the custodian's: each cite read at 7939326c is expanded by script to `path:line @ <commit> sha256:<the lines with their LFs>` (a dot path as `path:line` at <commit>, sha256 <hex>): the cites the draft marks, every cite on a line before that line's last marker (the draft writes lists as `a.rs:1-2, :5 @ 7939326c`), and every cite written with a file name, since the draft reads every cite at 7939326c; a cite by a bare or partial file name is written with its one tracked path, and the one bare name that is not unique (RESULTS.md) with the path its sentence names (kernel/RESULTS.md) (49 pins; 20 by a bare or partial name); and the settlement below. Line numbers written with no file name and no marker name lines of the file the sentence names, at 7939326c; they are not pinned. Every pin is historical: for the code, the piece's base tree is authoritative; for what this form read, the pin is. Form path: `kernel/FIXTURE-S-REGENERATION-ENTRY-POINT-PREREGISTRATION.md`. The custodian keeps the PLAN node on main; the branch carries no PLAN file and no generated file. Gating: the reviewer and the architect, from dispatch (§36).*

```
Authority: PLAN node `fixture-s-regeneration-entry-point` (PLAN.yaml:4472-4488 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:0171ee71defdd43c7e49a80e86588bf86689879ed5ebfe56db8452eef9397969), generation 1; placed by the human's direction of 2026-10-26, item 2 (state/directives/2026-10-26-o1-s1-257-258-259-merged-6b-r3b-held-on-the-human-6c-runs-fixture-s-entry-point-6d.md:12 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:68da168b509345f39549f91a2848b814de767ec67fbea6ba918e372a0e90a029), filler queue entry 6d, S3 (state/FILLER-QUEUE.md:16 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:052f66f354ac71698a23fc50644bd1e257df95474c57509cd1faa648c02814ba); the filler rule, AUTONOMY.md §36 (AUTONOMY.md:692 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:1135b89c01d0e676bce0bc42a4d6710af445fa0ae95ed12ef6ca0fef7a4d4e84): a five-line form under §21c, the reviewer and the architect from dispatch, round 25, item 2 (e) set aside; this piece's line bound set by the human's one-line note under §21c (AUTONOMY.md:354-355 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:a9dcfd4fd014eef1ec02dc86a26319a792b5fcafa3cc38dfb4266e752734a361; OPEN-1 (A)); proposed as R3c of state/consults/2026-10-25-first-batch-factorial-ignored-trace-tests-fixture-s-route-architect.md; the reuse index found no prior art on either search (fixture regeneration; parquet fixture hash), a miss noted here.
Scope: 2 files: kernel/tests/regenerate_fixture_s.rs (new) and kernel/FIXTURES.md (one new section for S after G5's, no other line of the file changed); declared line budget 260 (insertions plus deletions, comments counted, AUTONOMY.md:357 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:367596df34a73d122765d000ba5df601dbe54da9e5a6aefca966747809a44fec), under the human's note (OPEN-1 (A)); this form exempt; kernel/tests/first_batch_factorial.rs, engine/tests/import_layout_fixtures.rs (its C: check included), kernel/tests/support/mod.rs, kernel/tests/regenerate_fixture.rs and engine/src/fixture.rs are read, not changed; no other file changes.
Change: a new ignored test, `regenerate_parcels_145mb_fixture`, writes the fixture S alone through `write_geoparquet_cancellable` with a fresh token, from a field-for-field restatement of first_batch_factorial.rs's `spec_s()`, to the absolute path `SPATIAL_REGEN_OUT` names, refusing an existing output, a relative path, and a drive with less than twice S's 151,629,665 bytes free, where the drive is read from the output folder's canonical path (junctions followed, so not C: for a folder linked to D:), writing to `<name>.partial` and renaming it to the output only when its full sha256 equals S's, else renaming it to `<name>.mismatch` and panicking with both hashes; kernel/FIXTURES.md records S on G5's model.
Tests+mutation: seven new tests in kernel/tests/regenerate_fixture_s.rs, each with one mutation predicted to fail it by name: `refuses_to_overwrite_an_existing_output_path`, M-1 delete the existing-output guard; `refuses_a_relative_output_path`, M-2 delete `out_path`'s absolute guard; `the_drive_is_read_from_the_resolved_path` (Windows), M-3 `drive_of` returns `Some('C')`; `the_volume_read_follows_a_junction` (Windows), M-4 `resolved` returns the folder as given; `refuses_below_the_floor_on_the_outputs_volume` (Windows), M-5 delete the floor assert; `a_hash_mismatch_leaves_no_output_and_names_both_hashes` (Windows), M-6 delete the hash comparison; the ignored `regenerate_parcels_145mb_fixture`, M-7 `spec_s()`'s seed to `0x5EED_2056_0000_0008`, predicted to fail at `sha256 mismatch`; M-1 to M-6 observed in a debug build, the unmutated full run and M-7 in a release build writing to the piece's own folder on D: (note 5), each recorded by name with the 40-hex commit it was observed at in a `RECORDED MUTATION:` doc line, then reverted; a verify-mutation run is not an observation; a mutation that passes, or fails anywhere else, is a stop; an unmutated full run whose sha256 is not S's is a stop, both hashes to the human, no second attempt.
Out-of-scope: ADR: no status line or amendment; security: nothing ADR-020, ADR-009 or ADR-021 governs (a test-only tool that writes only where its operator names, no exposure surface, no dependency); wire: no SKP, data-plane or MCP surface, nothing under protocol/; guarantee: none changed, since no existing test, assertion, message, fixture path, constant or recorded figure changes, the matrix generator's C: check stays as that cut's recorded preflight, and the new tests assert properties of a new test-only tool, not a stated guarantee; the five-line form stands under §36, which sets round 25, item 2 (e) aside.
```

**The reuse index**, byte for byte as the custodian ran it for the draft's brief (the read-only clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c):

```text
$ node tools/reuse.mjs fixture regeneration
No prior art recorded for "fixture regeneration". Research it before planning an implementation.
$ node tools/reuse.mjs parquet fixture hash
No prior art recorded for "parquet fixture hash". Research it before planning an implementation.
```

*The notes below are the architect's from its draft, carried byte for byte except for the pins; where they say mine or my, they mean the architect's. They are this form's reading.*

## Notes

### 1. Where the entry point lives and how it is run
- It is a new integration-test binary, kernel/tests/regenerate_fixture_s.rs, with one `#[ignore]`d test, run like G5's: release build, `--ignored --exact`, the output named by `SPATIAL_REGEN_OUT`. Compare kernel/tests/regenerate_fixture.rs:30-31 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:e02808fe37e105e8c5745bd9e60250ba1b42d60bd4b4265f4b43032b048f3f1a, kernel/tests/regenerate_fixture.rs:78-91 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:fbb32f6518909953d76b7c27ef28c1167edab78b74e100423ede91008a944d54 and kernel/FIXTURES.md:23 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:cc341bd930e0655aea4d0a17379ac4ba64705918105cf3ddacd30260f2c43050.
- Why not a second ignored test in regenerate_fixture.rs:
  - kernel/FIXTURES.md:40-42 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:913e78a178aa3f4f50018772bc26734f08114bde9975ed2868215d2c4c199a8f says `--exact` names the one ignored generation test in that binary, which would become untrue.
  - G5's refusal text says `deliberately manual, because it is 5 GB.` (kernel/tests/regenerate_fixture.rs:60-61 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:9b22d0983e801cd4e655e04a0e9fdaca431ca31489bab67e88d6358fdbf01e07), which is untrue for S. kernel/FIXTURES.md:73-74 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:ee5ae3e746ca90fbc04d3864c9a6f8dea2f570c0a9c75b815b7353e95db4966b quotes it.
  - Either fix would change G5's surface, against "Nothing else changes".
- It requires an absolute path; G5 resolves a relative one under the workspace root (kernel/tests/regenerate_fixture.rs:38-48 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:c4f6e853fbaaf6a8a92f0eab84df7447c6cf2bbc620b5e2d4df0f095bdcf9679). That saves a copied resolver and its test. A relative path refuses by name. This is my choice and costs about 7 lines.
- The kernel dev-dependency already enables `fixture` (kernel/Cargo.toml:38 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:d0fa1d237054e708ae644c6edd8050dfccf684b04485037bda3534a7c6c35b9d), so no feature flag is needed and no dependency is added.

### 2. How it builds S without touching spec_s or its callers
- `spec_s()` and its constants are private items of the first_batch_factorial integration-test crate (kernel/tests/first_batch_factorial.rs:46-53 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:94517051d19baf9c4db3ae0e09c57a2944fbcef950b3af82ee637b54e9689890, kernel/tests/first_batch_factorial.rs:112-123 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:0edf8737d562c9bf89d5ebd7af40ae2583a0cc3bd88a26cde88cf47d0a412a4b). No other test binary can import them.
- Moving them into support/mod.rs, as G5's piece did with spec_5gb, would edit first_batch_factorial.rs, which is entry 6b's branch path. Rule (00) forbids that.
- So the new file restates them field for field, as engine/tests/import_layout_fixtures.rs:50-63 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:1f0dfc52ca4d97c1345d1488e4171ae2c326e1bd0fc9a39f8f416c642c194c82, engine/tests/import_layout_fixtures.rs:98-109 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:97ec70af2b8a9d7b4e41f7dae212f39f50299110bf6e51c55fcebd0872450e26 already does. That makes three copies. The full sha256 binds them all: any change to the copy, to `FixtureSpec`'s defaults (engine/src/fixture.rs:551-575 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:e70f8a48dabdb3e3c52d8399cf17a7a4557952811f7eba5c5347feed1adae8e9) or to the writer that moves S's bytes shows up as a mismatch.
- The writer is `write_geoparquet_cancellable(path, spec, &CancelToken::new(), None)`, the same call G5 makes (kernel/tests/regenerate_fixture.rs:64-65 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:c2adb2955f2f76fbd8f6518601eb1fcf678bd66cbfd7e97c774c4b0fe2f514f0). `write_geoparquet`, which wrote S originally (kernel/tests/first_batch_factorial.rs:792 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:68f6fbf057e560606ccaf37991db803da904cdbd62e3c6b78a30d9aa84b73d8e), is a wrapper over exactly that call (engine/src/fixture.rs:860-862 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:cbbadef5118d18073afa37e2aed321fbf04ba56056e939a638b96041889659f8). So the bytes route is identical.
- `support::file_facts` (kernel/tests/support/mod.rs:417-425 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:0ce479779934e30a54d9490919a37b90dbb24739492206af8be827e6a30ff0f5, sha256 via engine/src/index.rs:602-634 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:506e6364dafaa7e97108706af945de9f5864d72cf3461b3619176174f65a4798) computes the hash. `mod support;` is used read-only and support/mod.rs is not edited.

### 3. The disk check
- **The drive.** The check calls `resolved(dir)`, which is `std::fs::canonicalize` of the output's folder, after `create_dir_all`. That folder may be a junction: the main checkout's `target/` is one, pointing to D: (kernel/FIXTURES.md:100 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:458464c343adae7b48af73c21f1901ab8f6748189dacd20cbf00f5e74c268793; state/consults/2026-10-25-first-batch-factorial-ignored-trace-tests-worker-stop-report.md:19 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:3e5beb58ff3bd232b18cfc654a664b2e07b68758047769179e36b054a98ae445). `drive_of` then reads the `Prefix::VerbatimDisk` / `Prefix::Disk` letter, and the check queries `(Get-PSDrive <letter>).Free`, the query shape kernel/tests/support/mod.rs:385-391 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:4e3cd5d11d81539d469181b45ceb7c80e4be17aef2f543b9e094a5a550ac5d6b uses for C:.
- The C:-only helpers (kernel/tests/support/mod.rs:385-407 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:0017778f216dc4a0198b60e739edeea153d4486a996af48a673a5fb5333a7107, 20 GiB; engine/tests/import_layout_fixtures.rs:130-151 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:eec23263a8d8a3bbc549f1edb6488d247f9c8879bb8de330facda537938f4fcc, 40 GiB) are not used or changed.
- An unreadable drive (UNC, or off Windows, where std's `Path` has no prefix) refuses with its own message, not as `0 B` free.
- **The floor.** Twice S's recorded size, 2 × 151,629,665 B (kernel/RESULTS.md:2988 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:05e68bce1c359c8245d64cfb72234b85c1c994795adfed1f9b9005123501aca5). That is the one file it writes plus the same again as margin; nothing else is written, and the hash only reads (OPEN-3).

### 4. The hash, and what a mismatch does
- The expected value is the full hash at engine/tests/import_layout_fixtures.rs:79-80 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:75ab633731da1724c7d7df50fa3a9492e982f4ccf908f8ce21dc68a2d8fa6e2a, restated as a constant. RESULTS.md holds only the 16-hex prefix (:2988).
- The write goes to `<name>.partial`. On a match it is renamed to the output; on a mismatch it is renamed to `<name>.mismatch` and the run panics, naming both hashes and that path. That is a stop, never a retry.
- The reason: readers of S's path do not compare its hash. first_batch_factorial.rs asserts only that the file exists, and kernel/tests/query_window_attribution.rs:445 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:a8cc369daf0e7fc3a745b254ffb71b7b324675417670991927f3c5d2ee86b145, kernel/tests/query_window_attribution.rs:452 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:0a2b5371ebfb97616577315cc764f481ebdd4f77465a0163d00a59400a313337 records the hash without comparing it. So the canonical path should only ever hold a verified S, after a mismatch or a Ctrl-C (OPEN-4).

### 5. The piece's observation, its folder and its cost
- **Place.**
  - A worktree from main under C:/dev/wt/, with its own cargo target on D:/wt-targets/. C: is the drive that is short, and D: had 175 GB free by the stop report's `df` (stop report :24).
  - The outputs go in the piece's own folder, for example `D:/wt-targets/<piece>-out/full/` for the unmutated run and `.../m7/` for M-7. They need separate folders, because M-7 on an existing output would fail at `already exists`, which counts as failing elsewhere.
  - Nothing is placed in the main checkout. Placing S at first-batch/ is 6b's step under R3b (the direction's item 1, :10).
- **Runs**, each heavy step in a shared hold (state/directives/2026-10-06-machine-script-adopted.md:13-15 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:c937f839a438bc92f0079d8148b6202a1d0e09ae87ad438b1eadc14a756ffb4b):
  1. The debug build plus the seven cheap tests, and M-1 to M-6, each a rebuild of this test crate only.
  2. The release build, then `SPATIAL_REGEN_OUT=<own folder>/full/parcels-145mb.parquet cargo test --release --locked -p spatial-kernel --test regenerate_fixture_s -- --ignored --exact regenerate_parcels_145mb_fixture --nocapture`. It must pass. Record its printed bytes, sha256, resolved folder and free bytes.
  3. M-7 into `m7/`, then revert, and confirm the file matches the code commit.
- **Order.** The code commit, then the observation, then the record commit: the RECORDED MUTATION lines and the FIXTURES.md section's determinism sentence.
- **Cost.** Two first builds on a fresh target (duckdb bundled), about 15 to 30 minutes each by my unmeasured estimate. The writes and hashes take seconds. Nothing is timed, so a timing miss cannot occur and no exclusive hold is ever needed. §36's shared-only rule holds. The node's 60 minutes (PLAN.yaml:4483 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:9269a017dd1abf63dbe1f02f7fdc96be80b9d19e3258dccef5a0189a31e4a514) is likely short; that is not measured.
- **Start.** One filler at a time: the code starts after #260 merges. The form can be committed ahead.

### 6. Out-of-scope readings
- **ADR, security, wire.** None is touched.
- **Guarantee.** Nothing currently under test changes. The tool, like G5's, passes a token that is never cancelled (kernel/tests/regenerate_fixture.rs:64-65 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:c2adb2955f2f76fbd8f6518601eb1fcf678bd66cbfd7e97c774c4b0fe2f514f0); that is the existing instrument precedent, and the form claims no cancellation property.
- **P6.** No string in the app.
- **KNOWN-LIMITATIONS.** No item is owed: the Windows-only limit is a dev tool's and not user-visible (OPEN-2).
- **kernel/README.md.** Not touched; #241 holds it.
- **Portability.** The template's platform section (docs/PREREGISTRATION-TEMPLATE.md:177 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:6f5f5efc2cfb92e6b7c14bd23f0087adbb53769df674affdb4c1a2e2819a33b0) binds the full form. My reading: a test-only tool is not a product feature. Its platform behaviour is still stated: Windows, macOS and Linux CI run the two cross-platform tests, and Windows CI runs all six cheap ones (`.github/workflows/product-ci-rust.yml:194-197` at 7939326c84bb1b6592cf2147e0f5ecd5d73739cf, sha256 d06209e30a3082d5514bd9d4b3873a329f21324eab4e0c444d370e1c2c377e27, `.github/workflows/product-ci-rust.yml:234` at 7939326c84bb1b6592cf2147e0f5ecd5d73739cf, sha256 a9a5f7dfd80682cf7c1f55f66873911fb936d9a5379c813aa09d8e36cd73e74a).

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
- "private": kernel/tests/first_batch_factorial.rs:112 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:920769bc39ac2bdf46cbb88bfeddf1d969fecb59819c35f6a2e997f4e35af7dd is a non-`pub` fn in its own test crate. Holds.
- "twice S's size", ".partial … .mismatch": what the Change line makes true; the gate checks it.
- "any change … that moves S's bytes": spec_s uses `..Default::default()` (kernel/tests/first_batch_factorial.rs:121 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:965d9c44b5ad56f8ce0d31d7b0f418ac4c5c2bfd0cca1cf02a519a7c1fff8178), and the hash covers every byte. Holds as worded.
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
- Path's readers: kernel/tests/first_batch_factorial.rs:221 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:6d65f180c902a1eebc565caa09aa20317b7a2dbee55130efd52ed346f0601ee2; kernel/tests/query_window_attribution.rs:50-55 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:8546b3481b31daf47cd7eaeeac94e360aa8791bd046bc174c23fab2394b28677. Holds.
- Size: kernel/RESULTS.md:2988 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:05e68bce1c359c8245d64cfb72234b85c1c994795adfed1f9b9005123501aca5. SHA-256: engine/tests/import_layout_fixtures.rs:79-80 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:75ab633731da1724c7d7df50fa3a9492e982f4ccf908f8ce21dc68a2d8fa6e2a. Hold.
- Spec fields: kernel/tests/first_batch_factorial.rs:46-53 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:94517051d19baf9c4db3ae0e09c57a2944fbcef950b3af82ee637b54e9689890, :112-123. Holds.
- Wrapper: engine/src/fixture.rs:860-862 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:cbbadef5118d18073afa37e2aed321fbf04ba56056e939a638b96041889659f8. Holds.
- Junction: kernel/FIXTURES.md:100 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:458464c343adae7b48af73c21f1901ab8f6748189dacd20cbf00f5e74c268793; stop report :19. Holds as machine state on those dates.
- Matrix generator: engine/tests/import_layout_fixtures.rs:266-300 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:2c7990d23314f9c0c77ba18942fc157cc8d2695f34e916c9da952940c7c8c0ba (own folder :281, :292), C: check :130-151. Holds.

## The custodian's settlement (class 1, before any code)

- **OPEN-1: (A), the human's.** The human's one-line note under §21c sets this piece's bound at 260 lines over the 2 files of its Scope (`state/directives/2026-10-26-clicks-260-261-244-r2-241-o1-answers-pb-draft-b-6d-260-lines-5b-8a-8b-rulings.md`, line 26); the five-line form stands, and both gates run from dispatch.
- **OPEN-2: (A).** Windows only, refusing off Windows by name.
- **OPEN-3: (A).** The floor is twice S's recorded size.
- **OPEN-4: (A).** `<name>.partial`, renamed to the output only on a matching hash, else to `<name>.mismatch`.
- **OPEN-5: (A).** No literal spec-pin test; the full hash is the pin.
- **OPEN-6: no, the human's** (the same line): entry 6b's route R3b stands and names the matrix generator. Nothing here changes 6b.
- **A hash mismatch** in the unmutated full run is a stop: both hashes to the human, no second attempt (the Tests+mutation line).
- **The machine rules.** Every build and run is a heavy command in a shared hold. No step here is timed.
- **Cargo targets of their own.** The worktree's runs take a new target folder used by no other tree; the regeneration's output folder is the piece's own, on D: (note 5).
- **#241 has merged** since the draft's read: `engine/src/fixture.rs` changed between 7939326c and 744d6b3c (1 file changed, 45 insertions(+)); the piece reads that file and changes nothing in it, and the worker reads it at its base.
- **Rule (00)** was checked again at main 744d6b3c by `git diff --name-only origin/main...<branch>` for every open branch and the branches in flight: none touches `kernel/tests/regenerate_fixture_s.rs` or `kernel/FIXTURES.md`. Entry 6b, held on the human, has left the filler slot; this piece is the one filler in flight.

## Amendments (opens empty; append-only)

### Amendment 1 (2026-10-27), class 1: the observation. Written after the piece's results were seen.

- **The regeneration** (the Tests+mutation line's unmutated full run, release build, at d505a6054f6d80e4c778623db15b32ee192896a8, the code commit): it passed and wrote `parcels-145mb.parquet` to the piece's own folder on D:, 151,629,665 B, sha256 fe61e704fcc01d40b0e453d81a4987fc23862dcc38d62bd1f9635d124433ac7a: S's recorded size and hash. The custodian read the file's size and full sha256 again from disk after the run. This is the observation `kernel/FIXTURES.md`'s determinism sentence names.
- **M-1 to M-7** each failed the test the line names, where its prediction says (`state/consults/2026-10-27-fixture-s-regeneration-entry-point-build-worker-report.md`); M-7 failed at `sha256 mismatch` and left only the `.mismatch` file. Each is recorded in its RECORDED MUTATION doc line, naming d505a6054f6d80e4c778623db15b32ee192896a8.
- **Figures:** 231 lines over the 2 files of the Scope, under the human's 260.
- Nothing is invalidated. Determinism across machines and toolchains is not established (the determinism sentence says so).
