*Custodian's filing note (2026-10-27): the worker's report on `fixture-s-regeneration-entry-point`, the filler queue's entry 6d, built under its five-line form in C:/dev/wt/fsre. The unmutated release run wrote S again, byte for byte: 151,629,665 B, sha256 fe61e704fcc01d40b0e453d81a4987fc23862dcc38d62bd1f9635d124433ac7a, S's recorded size and hash. The custodian's check: the branch's two commits and numstat (231 lines over the 2 files of the Scope, under the human's 260) by git; the output file's size and full sha256 read again from D:; the transcript shows 12 cargo calls, each inside a shared hold, two commits and two pushes, no exclusive hold, and writes only to the piece's file and scratch. The FIXTURES.md determinism sentence names "this piece's form, Amendment 1", as note 8's words leave the number to fill: the custodian appends that amendment. The clippy failure the report names lies outside the Scope (main's known state, the continuity block's unreported findings); it is not this piece's. The run 19:53:05Z to 21:01:28Z by its transcript (Bash 72, Read 6, Write 7, Edit 2). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 84af4b20cb392bad06a215cb895eea85bdf4678f4eccd920762f463df2f61088.*

---

Built: fixture-s-regeneration-entry-point at d033b201f1903564841b6233f21d5cfde5ecc763 (branch cut/fixture-s-regeneration-entry-point; origin equals HEAD; `git status --porcelain` empty). Two things to read before gating: `clippy -D warnings` exits 101 on code outside my two files (details below), and a clause in the form's note 8 has no amendment to point at yet.

Brief sha256 bf3dd31d... matched by command before I started.

**Code commit d505a6054f6d80e4c778623db15b32ee192896a8.**
- It adds `kernel/tests/regenerate_fixture_s.rs` (190 lines at that commit, sha256 02bbd3ae38e50a097586165f584d55775ed44e698d05f8f867deaed76bea206e) and the S section of `kernel/FIXTURES.md` (19 lines, W2's words).
- I changed no word of W1 or W2.
- Interfaces read at my base: `kernel/tests/support/mod.rs:417` (`file_facts`), `engine/src/fixture.rs:891` (`write_geoparquet_cancellable`), `kernel/tests/first_batch_factorial.rs:112` (`spec_s`).
- Debug run in a shared hold: 6 passed, 0 failed, 1 ignored.
- I trimmed the first draft before committing, because the first rustfmt'd draft was 241 lines and would have overrun the 260 budget.

**Mutations M-1 to M-6.** Each was applied alone, in a debug build, in a shared hold, then reverted. After every revert the file showed the code commit's sha256 (02bbd3ae...) and the porcelain was clean.
- M-1, delete `regenerate`'s existing-output assert. Failed `refuses_to_overwrite_an_existing_output_path` with "panic did not contain expected string". The actual panic was the sha256 mismatch and the expected substring was "already exists".
- M-2, delete `out_path`'s absolute assert. Failed `refuses_a_relative_output_path` with "test did not panic as expected".
- M-3, `drive_of` returns `Some('C')`. Failed `the_drive_is_read_from_the_resolved_path` at its first assertion: left `Some('C')`, right `Some('D')`.
- M-4, `resolved` returns `dir.to_path_buf()`. Failed `the_volume_read_follows_a_junction` at `assert_eq!(via_link, direct, "the junction resolves to its target")`.
- M-5, delete the floor assert. Failed `refuses_below_the_floor_on_the_outputs_volume` with "test did not panic as expected".
- M-6, delete the `if sha != expected` block. Failed `a_hash_mismatch_leaves_no_output_and_names_both_hashes` at `expect_err("S accepted")`, "S accepted: ()".

**Unmutated release run.** Command exactly as the brief gave it; it passed with rc=0 in 16.53 s. It printed:
- `[regenerate] \\?\D:\wt-targets\fsre-out\full: 164401901568 B free`
- `[regenerate] 151629665 B, sha256 fe61e704fcc01d40b0e453d81a4987fc23862dcc38d62bd1f9635d124433ac7a`
- The file on disk is 151,629,665 B, and `sha256sum` of it matches S's hash. The tool says "resolved folder" only; the output file itself is under `D:/wt-targets/fsre-out/full/`.

**M-7.** Seed changed to `0x5EED_2056_0000_0008`, release build, into `m7/`. It failed at the sha256 mismatch, as predicted. The message was "sha256 mismatch: expected fe61e704fcc01d40b0e453d81a4987fc23862dcc38d62bd1f9635d124433ac7a, got bfe55c91e0c7976b4d9b726ef5eadb31266346d4f10ffd8891bcabb706be7d43". The output folder holds only `parcels-145mb.parquet.mismatch`, with no output file. I reverted and the sha was byte-equal to the code commit. No stop rule was met.

**Record commit d033b201f1903564841b6233f21d5cfde5ecc763.** It adds seven three-line `RECORDED MUTATION:` doc lines naming d505a605... and each outcome, and it fills FIXTURES.md's determinism sentence. In that sentence I wrote "(this piece's form, Amendment 1)". The form has no amendment yet; the custodian has to append it, or the sentence is wrong.

**Scope count.** `git diff --numstat e54457e3...HEAD` gives 19 + 212 = 231 lines, under the 260 budget, over two files. No file outside the Scope changed.

**Checks at head (d033b201)**
- `cargo test -p spatial-kernel --locked --test regenerate_fixture_s`: rc 0, "6 passed; 0 failed; 1 ignored".
- `cargo fmt --all -- --check`: rc 0.
- `cargo clippy -p spatial-kernel --locked --tests -- -D warnings`: rc 101, a failure outside my files.
  - Without `--no-deps` it fails in `renderer/src/canonical.rs:240` and `renderer/src/style.rs:10`.
  - With `--no-deps` it fails in `kernel/src/lib.rs`, `kernel/src/skp.rs`, `kernel/src/permission/boundary.rs` and `kernel/src/publish/mod.rs`.
  - The logs have 0 mentions of `regenerate_fixture_s`. I did not check whether they predate my branch (not run on main).
- `node scripts/plan/verify.mjs --offline`: rc 0, "verify:plan PASS".
- `verify-cites.mjs`: rc 0, PASS.
- `verify-quotes.mjs --show-cites` over my two files: rc 0, PASS.
- `verify-test-claims.mjs`: rc 0, PASS.

**Disclosures**
- The head-checks call used `exit $((rc+rc2))`, which contains `$(` and so broke "no `$( )` on the hold line". It was harmless, but it was a deviation.
- Two of my Python edit calls failed; each time I re-ran from a clean `git checkout` of the file.
- The brief has no prescribed line for the M-3 and M-5 mutation shape. M-3 is `if p.as_os_str().len() > 0 { return Some('C'); }` at the top of `drive_of`. M-5 deletes the whole four-line floor `assert!`.
- The `.mismatch` file under `D:/wt-targets/fsre-out/m7/` stays for the custodian to remove, along with `D:/wt-targets/fsre-out/full/`.
- Cheap-test scratch folders sit under the user temp dir as `fsre-*`; I did not remove them.

**Process and hold lines.** Every heavy run was in a shared hold, rc 0 on grant and no 96 to 99. Holds were granted as "MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF". No process I started still runs: the process listing shows no cargo or rustc, only unrelated bash.exe and the listing's own powershell.exe.

**Model.** claude-sonnet-5-5 (Sonnet 5.5) per the harness, no override, no context handoff received or produced.

**Four pre-gate classes.**
1. Cross-module: I read `file_facts`, `write_geoparquet_cancellable` and `spec_s` at their actual lines before writing, and the real E2E path (the full release run reproducing S) passed.
2. Completion claims: each points to a log or hash above.
3. User-facing messages: the panic and assert texts describe behaviour implemented in this file.
4. Tests reach their assertions: the M-1 to M-7 failures were each seen at the predicted assertion or message.
