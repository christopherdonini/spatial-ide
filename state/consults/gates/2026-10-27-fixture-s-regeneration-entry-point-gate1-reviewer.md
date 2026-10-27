Reviewed: PR #263 at d033b201f1903564841b6233f21d5cfde5ecc763 (base e54457e3), gate 1, reviewer
Verdict: PASS WITH NOTES

Branch and commit: cut/fixture-s-regeneration-entry-point @ d033b201f1903564841b6233f21d5cfde5ecc763. The brief's sha256 was 44263dd7c827bd3b5e9f3c9cbfad29fd97d5616cfbe4408c23183837cd75a150, which matches. One discrepancy: `wc -l` counts 36 LF-terminated lines, not 37.

## Correctness
No findings.
- **Seams, read on the consuming side:**
  - `support::file_facts(&Path) -> (u64, String)` is at kernel/tests/support/mod.rs:417.
  - `write_geoparquet_cancellable(path, &FixtureSpec, &CancelToken, Option<&dyn FixtureProgress>)` is at engine/src/fixture.rs:891.
  - Both match the calls at kernel/tests/regenerate_fixture_s.rs:91-92.
  - The end-to-end test from the real shape is the ignored regeneration, which I re-ran (check 3).
- **Restated spec:** it matches first_batch_factorial.rs `spec_s()` and its constants field for field, including `..Default::default()`.
- **Caller rule:** the diff adds no `pub` item.
- **Other rules:** no JSON, CRS or float path is touched. The `unwrap`/`expect` calls are in test-only code, and a panic there is the tool's refusal.

## Evidence
No findings. Every observation the form, Amendment 1, the RECORDED MUTATION lines and the PR body state was reproduced, except M-7, which this brief did not order. M-7's leftover file `D:/wt-targets/fsre-out/m7/parcels-145mb.parquet.mismatch` (151,476,046 B) is present, and it is the only file in that folder.

## Documentation
No must-fix findings.

One observation, not raised as a finding: note 8 says the words are "wrapped at 100 columns". The four prose paragraphs of the new FIXTURES.md section are single lines of 312, 427, 263 and 235 columns (head kernel/FIXTURES.md:130, :132, :134, :136). The rest of the file is mixed: its table rows run to 1042 columns. Re-flowing them would make the section 15 lines instead of 4, so the diff would be 242 lines, still under 260. But that would falsify Amendment 1's "231 lines" figure in an append-only record and need a correction amendment. I judge the cost higher than the defect; the architect, as the author of note 8, may rule otherwise. A word-preserving re-flow exists if wanted (checked by script: the joined words are byte-equal).

## Notes (code, not blocking, no class)
- **The wiring call is not covered by a test.** Head :82, `let dir = resolved(dir);` in `regenerate`, is covered by no test. By reading (not run), deleting it would leave all seven tests passing: the junction test exercises `resolved` alone, and the cheap tests do not go through a junction.
  - The shipped path does use the canonical folder: the regeneration printed `[regenerate] \\?\D:\wt-targets\fsre-g1r-out\full: 153406312448 B free`, with the verbatim prefix.
  - Possible follow-up: a test that runs `regenerate` through a junction.
- **Scratch folders are never removed.** `scratch()` (head :104-109) creates pid-named folders under the user temp dir and nothing removes them. The overwrite and mismatch tests leave tiny `.mismatch` files there. 32 `fsre-*` folders exist now; my runs added about 16 of them (disclosure below).
- **Off Windows, the folder is created before the refusal.** `create_dir_all` (head :81) runs before `drive_of` refuses (:63). W1's "the entry point refuses" is still true.

## Checks
**1. The diff.**
- `git diff --numstat e54457e3...d033b201` (rc 0): `19 0 kernel/FIXTURES.md`, `212 0 kernel/tests/regenerate_fixture_s.rs`. That is 231 lines, under 260, two files, two commits (d505a605, d033b201).
- In FIXTURES.md the only change is the single 19-line insertion before "## The GeoParquet compatibility corpus".
- My script `fsre-g1r-words.mjs` (rc 0) compared the head against main's form lines 92 and 102-119:
  - W1: the module doc joined equals note 8's W1 (true), maximum 100 columns.
  - W2: 18 lines differ in one place only, the filled determinism placeholder: "One regeneration by this command, at d505a6054f6d80e4c778623db15b32ee192896a8, … (this piece's form, Amendment 1)."
- Both filled places are true:
  - The regeneration ran at the code commit. The record commit changes only doc comments in the .rs file (`git diff d505a605 d033b201`).
  - Amendment 1 exists on main at 3eb0edc7 and states that observation.

**2. M-1 to M-6, on an export of d505a605.**
- Setup: `git archive` of d505a605, extracted with `tar --force-local` (rc 0). The file's sha256 was 02bbd3ae38e50a097586165f584d55775ed44e698d05f8f867deaed76bea206e. Debug build, `CARGO_TARGET_DIR=D:/wt-targets/fsre-g1r-target`.
- Baseline: 6 passed, 1 ignored, rc 0 (build 26m01s).
- Each mutation was applied alone by script (`fsre-g1r-mutate.mjs`, exact-one-match replacement), in the shapes the worker's report gives for M-3 and M-5. For each one:
  - the pre-mutation sha256 was 02bbd3ae…;
  - the named test passed unmutated (rc 0);
  - the mutated run returned rc 101;
  - the file was restored, with post sha256 02bbd3ae… ("restored byte-equal").
- Results, each as predicted and as its RECORDED MUTATION line says:
  - **M-1:** "panic did not contain expected string". The panic was the sha256 mismatch; the expected substring was "already exists".
  - **M-2:** "test did not panic as expected".
  - **M-3:** first assertion, `left: Some('C')`, `right: Some('D')`. It panicked at :146, which is the first assertion in the mutated file.
  - **M-4:** "assertion `left == right` failed: the junction resolves to its target".
  - **M-5:** "test did not panic as expected".
  - **M-6:** panicked at :174:20, which is `run.expect_err("S accepted")` after the 7-line deletion, with "S accepted: ()".

**3. The regeneration at the head.**
- Run in C:/dev/wt/fsre with `CARGO_TARGET_DIR=D:/wt-targets/fsre`, the command as briefed: rc 0, "1 passed", 6.62 s.
- It printed `[regenerate] 151629665 B, sha256 fe61e704fcc01d40b0e453d81a4987fc23862dcc38d62bd1f9635d124433ac7a`.
- My own commands on the output:
  - `stat -c %s`: 151629665 (rc 0);
  - `sha256sum`: fe61e704fcc01d40b0e453d81a4987fc23862dcc38d62bd1f9635d124433ac7a (rc 0).
- That equals S's recorded size and hash. The folder held only the output, with no `.partial` file. The folder has been removed.

**4. The head and CI.**
- In the worktree, `cargo test -p spatial-kernel --locked --test regenerate_fixture_s`: rc 0, "6 passed; 0 failed; 1 ignored".
- `cargo fmt --all -- --check`: rc 0.
- Verify scripts, all rc 0:
  - `verify.mjs --offline`: "verify:plan PASS";
  - `verify-cites.mjs`: PASS;
  - `verify-quotes.mjs`: "verify:quotes PASS — 131 checked …";
  - `verify-test-claims.mjs`: "verify:test-claims PASS — all 683 claimed test(s) …".
- `gh pr checks 263`: rc 0, all 18 pass after the PR-event Windows run (40583790890) finished.
- `gh run view` gives head d033b201f1903564841b6233f21d5cfde5ecc763 for all 13 runs: 40582662721, 40583790890, 40582662735, 40583791177, 40582662843, 40583791079, 40583791145, 40583790870, 40582662869, 40583790913, 40583790914, 40582662880, plus 40583790890 again when it completed.
- The CI logs show the new tests ran:
  - Windows (job 122465885298): "6 passed; 0 failed; 1 ignored";
  - ubuntu (job 122465885726): "2 passed; 0 failed; 1 ignored".

**5. The PR body and the disclosures.**
- PR body figures, each confirmed: 2 files, 231 of 260; six cheap tests; M-1 to M-6 failed as predicted; RECORDED MUTATION lines naming d505a605; at the head, the cheap tests, fmt and the four verify scripts pass.
- Not re-run by me: "M-7" (not briefed) and "the custodian read the file again" (the custodian's own statement).
- The clippy sentence ("fails on code outside this piece's files, as on main"): I did not run clippy. It holds by construction, because the branch changes only two test files and the failures the worker names are in other files.
- The worker's disclosures:
  - The M-3 and M-5 shapes match its report, and I used them.
  - The `D:/wt-targets/fsre-out/full/parcels-145mb.parquet` (151,629,665 B) and `m7/…mismatch` files are present.
  - The `$(( ))` on the hold line and the two failed edit calls are self-reported; I cannot see the worker's transcript.

## Hold lines (this project only)
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:48020 also=bash.exe:44972 (commands started from now on inherit it; release when done)`, export baseline build, rc 0
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:48456 also=bash.exe:2092 (commands started from now on inherit it; release when done)`, M-1 to M-6, rc 0
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:11948 also=bash.exe:45792 (commands started from now on inherit it; release when done)`, regeneration, rc 0
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:1708 also=bash.exe:46832 (commands started from now on inherit it; release when done)`, head test, rc 0

Each was followed by a MACHINE_RELEASED line. No exit code 96-99, no exclusive hold.

## My own disclosures
- **Dry run during the build.** I dry-ran the mutation script once against the export file while the background baseline build was running in that export. The file was restored byte-equal (02bbd3ae…) within the same call, and the test crate compiled last in the 26-minute build. Each mutation step also began with its own unmutated pass.
- **Writes outside the list.** The tests under review wrote about 16 pid-named `fsre-*` scratch folders under the user temp dir during my runs, outside the brief's write list. I did not delete them.
- **Failed process check.** One PowerShell process-listing call failed on a bad parameter (rc 1) and was re-run.

## End state
- `git -C C:/dev/wt/fsre status --porcelain` is empty (0 bytes, rc 0); HEAD is d033b201.
- `D:/wt-targets/fsre-g1r-export` and `D:/wt-targets/fsre-g1r-out` are gone (ls: No such file).
- `D:/wt-targets/fsre-g1r-target` (3.6G) remains; the brief does not order its removal.
- The count of cargo/rustc/test processes is 0.

Scratch files are in <the session scratch folder>/, all named `fsre-g1r-*`: `fsre-g1r-mrun.out`, `fsre-g1r-regen.log`, `fsre-g1r-words.out`, and the per-mutation logs `fsre-g1r-M-<n>-pass.log` and `fsre-g1r-M-<n>-fail.log`.
