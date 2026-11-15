Reviewed: PR #263 at d033b201f1903564841b6233f21d5cfde5ecc763, gate 1, architect
Verdict: PASS WITH NOTES
Branch: cut/fixture-s-regeneration-entry-point @ d033b201f1903564841b6233f21d5cfde5ecc763 (head files read in C:/dev/wt/fsre). Form read on main at 3eb0edc7c80f2335ee980a57a89862bcf9a71bfb.

I have no shell. I computed no sha256: not the brief's (56f0714a…), not any pin's, and not the span hashes below. I could not run git diff or numstat, and I could not read PR #263's CI status. For the file list and the 231-line figure I rely on the brief, the worker's report (line 33) and the custodian's filing note (line 1).

## Correctness: none
## Evidence: none blocking
## Documentation: three findings, to fix before the merge with no re-gate (AUTONOMY §31; none of these sentences is the human's wording)

**D1. `kernel/FIXTURES.md:132` @ d033b201 (W2, Guardrails).** The sentence reads "renames it to the Path only when the full SHA-256 matches". The code renames the `.partial` file to whatever output path the operator names (`regenerate_fixture_s.rs:100`, `std::fs::rename(&partial, out)`, where `out` comes from `SPATIAL_REGEN_OUT` at :128-129). The table's Path is the canonical `target/slice-evidence/first-batch/…`, and the Regenerate row writes to `<an absolute path>`. W1 already says "the output". This carries note 8's W2 as drafted, so the defect is in the draft. Not the human's wording; the worker applies it.
Replacement for the whole sentence:
`It writes to `<name>.partial` and renames it to the output path only when the full SHA-256 matches; on a mismatch it renames it to `<name>.mismatch` and stops.`
Clause check:
- "writes to `<name>.partial`": :89 and :91.
- "renames it to the output path": :100 and :128-129.
- "only when the full SHA-256 matches": :92-93 compare `support::file_facts`'s full content hash with `S_SHA256` (:26).
- "on a mismatch … `.mismatch` and stops": :94-98.
All hold.

**D2. Form, note 6 (Portability), on main.** The note says "Windows, macOS and Linux CI run the two cross-platform tests". The product CI matrix runs `windows-latest` and `ubuntu-24.04` only (`.github/workflows/product-ci-rust.yml:193-197`, read at the head). A grep of `.github/workflows` for macOS finds only `adr-003-spike-ci-macos.yml`, the spike's own workflow, filtered to the spike's paths. So the macOS clause is untrue. Two things keep it Documentation and out of Correctness: W1 and W2 repeat none of it, and the off-Windows refusal is still exercised on Linux. The form is append-only, so the custodian appends a correction. It is the architect's draft wording, not the human's.
Correction (two sentences):
`Correction to note 6 (Portability): product CI runs the workspace suite on windows-latest and ubuntu-24.04 only (`.github/workflows/product-ci-rust.yml:194-197 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:d06209e30a3082d5514bd9d4b3873a329f21324eab4e0c444d370e1c2c377e27`), so the two cross-platform tests run on Windows and Linux CI, not macOS. Windows CI runs all six cheap tests, as the note says.`
Clause check:
- Matrix: :194-197 at the head, two entries.
- "six": four `#[cfg(windows)]` tests (:155, :167, :186, :196) plus the two unconditional ones (:135, :146).
- The suite step runs `cargo test --workspace --locked` (:234) with no `--ignored`.
- The hash is note 6's own pin, copied and not computed by me. The custodian recomputes it at 7939326c.

**D3. Form, Amendment 1, second bullet.** It reads "Each is recorded in its RECORDED MUTATION doc line, naming d505a6054f6d80e4c778623db15b32ee192896a8." Those doc lines are test text on an unmerged branch. They exist only at the record commit d033b201, which the amendment never names. Under round 25, item 2, a test-text span on an unmerged branch is named with its commit id. This is the custodian's wording, not the human's.
Correction (one sentence):
`Correction to Amendment 1: the RECORDED MUTATION doc lines it names are in `kernel/tests/regenerate_fixture_s.rs` at d033b201f1903564841b6233f21d5cfde5ecc763, the record commit on the unmerged branch `cut/fixture-s-regeneration-entry-point`.`
Clause check: there are seven `RECORDED MUTATION:` lines at the head (:118, :132, :143, :152, :164, :183, :193), and the worker's report (line 31) says the record commit d033b201 added them. Holds.

## Notes (do not block)
- **N1, clippy.** The worker found "0 mentions of `regenerate_fixture_s`" in clippy's output (report line 41). That does not show the new file is lint-clean. With `-D warnings`, the kernel lib (and, without `--no-deps`, renderer) fails first, and cargo then never lints the integration-test targets that depend on it. So the new file has not been linted. Reading it, I see nothing likely to trip clippy, and the form claims nothing about lint.
- **N2, wiring.** No cheap test proves that `regenerate` hands the resolved folder (:82) to `require_floor`, or that the entry point passes the 2× floor (:129). Deleting either would survive M-1 to M-6's tests. The release run fills the gap. It printed `[regenerate] \\?\D:\wt-targets\fsre-out\full: …` (report line 25), and the `\\?\` prefix comes only from `canonicalize`, so the shipped path is resolved. Line :129 shows the floor. The form preregistered exactly these seven mutations, and all were observed.
- **N3, scratch folders.** The cheap tests leave `fsre-<test>-<pid>` folders, including a tiny `.mismatch` file, under the OS temp dir and never remove them. Out-of-scope's "writes only where its operator names" is about the entry point, which holds. This is hygiene, not a security surface.

## Check 1: the five lines against the head
- **Authority:** filler entry 6d, the filler rule (directive line 8: five-line form, reviewer and architect from dispatch, §25 (e) set aside, S3) and the human's 260-line note (settlement OPEN-1). Consistent. The pins are not recomputed (no shell).
- **Scope:** two files. FIXTURES.md has one new section at :119-137 at the head, inserted where main's :119 corpus pointer stood, which is now :138. The G5 text at :96-117 reads the same as main's :112-117 at the spots I checked. 231 ≤ 260 and 2 ≤ 8 (from the report and filing note). Every read-only file is still the same where I read it: `first_batch_factorial.rs:46-53,112-123`, `import_layout_fixtures.rs:130-151,266-300`, `support/mod.rs:417-425`, `engine/src/fixture.rs:860-862,891-896`.
- **Change:** each clause holds at the head.
  - Ignored test `regenerate_parcels_145mb_fixture`: :125-130.
  - `write_geoparquet_cancellable` with a fresh token: :91.
  - The restatement of `spec_s()`: :28-39. It matches `first_batch_factorial.rs:46-53,112-123` field for field, `..Default::default()` included.
  - Absolute path: :41-45.
  - Existing-output refusal: :79.
  - Floor `2 * S_BYTES`: :129. Drive read from the canonicalized folder: :80-87, :47-59. Free space read by `Get-PSDrive`: :62-76.
  - `.partial`, then the rename or `.mismatch` plus panic naming both hashes: :88-100.
  - The FIXTURES section follows G5's model.
- **Tests+mutation:** all seven named tests are present at :127, :137, :148, :157, :169, :189, :198, and the four marked Windows are `#[cfg(windows)]`. Each carries a `RECORDED MUTATION:` line naming the 40-hex d505a605…. The build modes (debug for M-1 to M-6, release for the full run and M-7) match the report. Nothing calls a verify-mutation run an observation.
- **Out-of-scope:** see check 4.

## Check 2: the words
- **W1** at :4-13 matches note 8's W1 word for word (rewrapped).
- **W2** at FIXTURES.md:119-136 matches note 8's W2 row for row and paragraph for paragraph, apart from the filled determinism place. The record commit filled it as "One regeneration by this command, at d505a6054f6d80e4c778623db15b32ee192896a8, … (this piece's form, Amendment 1)". That is true: d505a605 is the code commit, and Amendment 1 now exists on main.
- **W1 clauses:**
  - "private": `first_batch_factorial.rs:112` is a non-pub fn.
  - "refuses below twice S's size": :129 and :71-74.
  - "Off Windows … refuses": a Unix canonical path starts with RootDir, so `drive_of` returns None and :63 panics. The folder is created first (:81), but no fixture is written.
  - "any change … shows as a mismatch": the full content hash.
  All hold.
- **W2 clauses:**
  - The Path's readers: `first_batch_factorial.rs:221` and `query_window_attribution.rs:54`.
  - The matrix generator writes under its own folder when the file is absent or its hash does not match (`import_layout_fixtures.rs:267-300`), and its C: check is unchanged (:130-151).
  - These hold. The Guardrails sentence is D1.
- **Seams:** two, both read at the real interface. `write_geoparquet_cancellable(path, &FixtureSpec, &CancelToken, Option<&dyn FixtureProgress>)` is at `engine/src/fixture.rs:891-896`, and it writes only the file it is given (:932-935, with the error path removing that file at :906-907). `support::file_facts` is at `kernel/tests/support/mod.rs:417`. The end-to-end proof is the release run reproducing S byte for byte. No new `pub` item lands.

## Check 3: Amendment 1
- The heading says class 1 and has its "Written after the piece's results were seen." line, as the form's header requires.
- 151,629,665 B and sha256 fe61e704… match the report (lines 24-27). d505a605 is the code commit (report line 9). M-7 failing at `sha256 mismatch` and leaving only `.mismatch` matches report line 29. 231 lines matches report line 33.
- No "done" or "discharged" clause and no verbatim quote. The custodian's re-hash from disk comes from the filing note; I could not check it.
- The one record gap is D3.

## Check 4: Out-of-scope
- **ADR:** nothing touched.
- **Security:** a test-only tool. Its writes go only to the output's folder (`create_dir_all`, then `.partial`, `.mismatch` or the output), it adds no dependency (`fixture` is already enabled, note 1) and has no exposure surface.
- **Wire:** nothing under protocol/, and no SKP or MCP.
- **Guarantee:** the matrix generator's C: check is unchanged at the head (:130-151). Where I read them, no existing test, constant, fixture path or recorded figure changed. Only the new FIXTURES section was added. G5's `--exact` sentence still holds, because S has a binary of its own.
- **Constitution:**
  - docs/01 principle 7: a never-cancelled token, on G5's instrument precedent, with no cancellation claim.
  - ADR-006: not applicable (no product operation).
  - docs/08: no perf claim is recorded. The 16.53 s appears only in the report.
  - docs/07 and PLAN: placed as a filler entry.
  - P6: no string in the app.

## Check 5: the worker's disclosures
None of them bears on the evidence or the words.
- **`$(( ))` on a hold line:** a process deviation in the head-checks call only. The rc composite does not touch any mutation or run evidence.
- **Two failed edits, each redone from a clean checkout:** every revert was checked against the code commit's file sha256 02bbd3ae… (report line 16).
- **M-3 shape** (`if p.as_os_str().len() > 0 { return Some('C'); }`): it returns `Some('C')` for every input the test passes, since all are non-empty, so it is the predicted mutation. The recorded failure (left `Some('C')`, right `Some('D')`) fits :158.
- **M-5** deletes the whole four-line `assert!` at :71-74, which is "delete the floor assert".
- **Outputs under `D:/wt-targets/fsre-out`:** housekeeping for the custodian, after the re-hash the filing note records.
- **clippy:** see N1. It is not this piece's failure, but it is also not evidence that the new file is clean.

Files read: C:/dev/spatial-ide/kernel/FIXTURE-S-REGENERATION-ENTRY-POINT-PREREGISTRATION.md, C:/dev/spatial-ide/state/consults/2026-10-27-fixture-s-regeneration-entry-point-build-worker-report.md, C:/dev/spatial-ide/state/directives/2026-10-24-filler-slot-standing-rule-appended-to-autonomy.md, C:/dev/wt/fsre/kernel/tests/regenerate_fixture_s.rs, C:/dev/wt/fsre/kernel/FIXTURES.md, C:/dev/wt/fsre/.github/workflows/product-ci-rust.yml.
