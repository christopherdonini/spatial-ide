Reviewed: cut/property-testing-trial at 8fd35b28573d33f0b56455264c948a4f72f1e1f9 (the custodian's filing note, 2026-11-22: PR 353's code gate under its full form, the reviewer, attempt 1, section 8's reviewer bullet; Read 10, Bash 52, SubagentHandback 1, by unique call ids, no call errored, model claude-opus-5-5, from 2026-11-22T12:24:32Z to 2026-11-22T12:41:12Z by its transcript; no call named the main checkout; no compaction; the report below byte for byte from its hand-back of 10161 bytes, sha256 e783cc7d01715df2cc27b71b8906fa8868dad46c9fe3e211b0548af24ebb0241, nothing masked, with this note in its first line and one final newline), gate, reviewer
Verdict: PASS WITH NOTES, PR #353 @ 8fd35b28573d33f0b56455264c948a4f72f1e1f9

Branch and commit reviewed: `cut/property-testing-trial @ 8fd35b28573d33f0b56455264c948a4f72f1e1f9`, merge base `90bdeab78ea3dadd238d5dfe428e50b0df3840c6` (the `git merge-base` output). No Correctness or Evidence finding blocks. The one open item is CI: the Windows `cargo test --workspace` check was still pending when I finished.

Every log named below is in `<S>`. The heavy runs were each one shared hold, and their lines read `also=<m>`. Every exit code was 96 or below. I did not edit anything in the worktree. Nothing I started is still running.

**Custodian's reading of the stop, rated against §4:** it is correct. §4's determinism bullet ties the stop to the first break run of each library, and proptest's first break run (P2 (a)) printed its `cc` line. The replay mechanism it describes checks out three ways:
- proptest 1.12.0's own runner (`src/test_runner/runner.rs`, the `persisted_failure_seeds` loop) replays persisted seeds before it generates new cases.
- My verbose runs counted 1028 inputs with the file and 1024 without it.
- Every break run showed `successes: 0`.

## 1. The diff
- `git diff --numstat 90bdeab7...8fd35b28` (rc 0, `pr3-numstat.txt`): exactly the 8 Scope paths. Excluding the lockfiles, the lines are 1+1+176+94+7+138 = 417, under the 500 budget. `Cargo.lock` is 62/2 and `package-lock.json` is 41/0.
- `git log --name-status` (rc 0, `pr3-commits.txt`) shows the commits in §5's order:
  - D, `a8d65266`, has the 4 manifest and lockfile paths only.
  - P1, `0583e901`, P2, `bb0de262`, and P3, `8fd35b28`, each add only their own test paths.
  - No shipped source is touched in any commit, so no break was committed. All four commits are signed off.
- The proptest line is under `[dev-dependencies]` in `protocol/data-plane/Cargo.toml`, byte-equal to the draft's 1 (a). `package.json` gains only `"fast-check": "4.10.2"` in devDependencies.
- I grepped the added test lines for retry, sleep, timeout, skip, `.only`, fork and timeLimit (rc 1, no match). A positive control on `it.skip(` matched (rc 0).
- The seams match the real code:
  - `read_start_steps` is the same three steps as `server.rs` `read_start`.
  - P1 uses the real `OffsetFrame`, `recenterThresholdForBudget` and `buildLayers`, the point path through `pointsForBatch` and `frame.toLocal`, in `WorkingCanvas`'s setThreshold → maybeRecenter → toLocal order.
  - P3 drives the real `FrameDecoder.push`, which `adapterWs.ts` calls once per message.

## 2. The lockfile delta against the draft (by script)
`node <S>/pr3/lockdelta.mjs` (rc 0, `pr3-lockdelta.txt`) parses both lockfiles at the base and at the head:
- **Cargo.lock:** it adds chacha20 0.10.2, core_detect 1.0.0, cpufeatures 0.3.1, proptest 1.12.0, rand_xorshift 0.5.0 and unarray 0.1.4. Nothing is removed and no version changes.
- **Changed dependency lists in Cargo.lock:**
  - getrandom 0.4.3 gains rand_core 0.10.1.
  - rand 0.10.2 gains getrandom 0.4.3.
  - sha1 0.10.7 and sha2 0.10.9 now name `cpufeatures 0.2.17`.
  - spatial-data-plane gains proptest.

  That is exactly the draft's 3 (d).
- **src-tauri Cargo.lock:** identical. `cargo metadata --locked` in the export's src-tauri gave rc 0.
- **package-lock.json:** it adds fast-check 4.10.2 (dev, MIT, depends on pure-rand ^8.0.0) and pure-rand 8.4.2 (dev, MIT), and the root entry's devDependencies gains fast-check. Nothing else changes, which is exactly the draft's 3 (b).
- **Licences:** read from the registry manifests (rc 0, `pr3-licences.txt`). proptest, chacha20, cpufeatures, rand_xorshift and unarray are "MIT OR Apache-2.0", and core_detect is "MIT/Apache-2.0", all as the draft says.

## 3. Each break, re-observed by me (all six, not just one per property)
**The export:**
- `git archive` → tar → `git init` → commit at `<S>/pr3/exp`.
- The first tree differed from the head's. Global ignore rules had dropped the `*.log` files, and the new repo had lost the executable bit on `.githooks/*`.
- A second commit with `add -f` and `--chmod=+x` gives tree `8a4afbadb21d839b8a2847824b7847e9cf653533`, the same as `8fd35b28^{tree}` (`pr3-exptree2.txt`).
- The Rust target is `D:/wt-targets/property-trial-rev`, and the export's npm install was `npm ci --offline`.

**The break script:** `<S>/pr3/brk.mjs` refuses unless its anchor occurs exactly once. A control anchor that occurs 4 times was refused (rc 3).

**The cycle for each break:** apply, red run, `git checkout`, `cmp` against `HEAD` (rc 0), `git status` showing 0 lines, green run. The scripts are `p2run.sh` and `tsrun.sh`.

| Break | Red, by name | What it printed | Restore and green |
|---|---|---|---|
| P2 (a) | `a_cut_or_altered_start_payload_does_not_panic_the_start_reads` FAILED (rc 101) | `range end index 6 out of range for slice of length 2`; minimal input `op = [], params = [], m = CutAnywhere(10404)`; `successes: 0` | persistence file cmp rc 0; 4 passed |
| P2 (b) | `b_a_frame_is_its_prefix_then_the_payload` and `c_a_framed_start_reads_back_as_written` FAILED (rc 101) | minimal inputs `tag = 0, payload = []` and `op = [], params = []`; `successes: 0` | 4 passed |
| P2 (c) | `c_a_framed_start_reads_back_as_written` FAILED (rc 101) | minimal input `op = [], params = [0]`; `successes: 0` | 4 passed |
| P1 | both tests × (vitest rc 1) | `Property failed after 67 tests`, `seed: -1750312365`, `Shrunk 36 time(s)`, frame 1 at 1.9999999962747097 px; the fixed case 3.238826951084835 | 2 passed |
| P3 (a) | × (rc 1) | `seed: 1119765245`, counterexample `payloads [[0],[]], cuts [1]`, `Shrunk 12 time(s)`, `expected [ 'batch' ] to deeply equal [ 'batch', 'batch' ]` | 1 passed |
| P3 (b) | × (rc 1) | `seed: 952463886`, counterexample `payloads [[]], cuts [1]`, `Shrunk 5 time(s)`, `counted reassembly copies: expected +0 to be 1` | 1 passed |

The logs are `pr3-exp-<id>-red.log` and `pr3-exp-<id>-green.log`. The worker's reports also match its own logs (`ptr-p1-break-a*.log`, `ptr-p2-break-{a,b,c}.log`, `ptr-p3-break-{a,b}.log` and the green-after logs). That includes P1's first red run, which was caused by its "origin moves" precondition.

## 4. The regressions committed and run
- **Persistence line replays on an unbroken run:** `PROPTEST_VERBOSE=2 … -- --nocapture --test-threads=1` in the export.
  - With the committed file: rc 0, 1028 inputs = 4 × (256 + 1 replayed seed) (`pr3-exp-p2-verbose-with.log`).
  - With the file moved aside: rc 0, 1024 inputs (`pr3-exp-p2-verbose-without.log`). The file was then restored and cmp gave rc 0.
- **P1's fixed case (Amendment 1 item 2):** it is present. Its O, W, p and z = 6 are the re-gate C1's own. It asserts `holds`, and its comment line gives the measured distance. I re-measured it with a temporary copy of the test in the export, since deleted, so the status is clean (`pr3-exp-measure.log`): `{"frame1":0.5000000000005775,"frame2":7.599592208862305e-7,"jump":0.5}`. That is above 0.5 and below 0.50025, the same as the worker's figure.

## 5. Suites in the worktree
All ran in one shared hold, with `CARGO_TARGET_DIR=D:/wt-targets/property-trial` and offline. The results are in `pr3-suites.txt` and the `pr3-wt-*.log` files.
- `cargo test -p spatial-data-plane --locked`: rc 0. unit 24, candidate_a 17, no_transport_leakage 4, origin_header_encoding 5, stream_registry_bound 3, wire_properties 4, doc-tests 0.
- `cargo fmt --all --check`: rc 0.
- `npm run verify` in `frontends/shell`: rc 0. `Test Files 125 passed (125)`, `Tests 1573 passed (1573)`.
- `verify.mjs --offline`: rc 0, PASS.
- `verify-cites.mjs`: rc 0, PASS, 3572 files.
- `verify-test-claims.mjs`: rc 0, PASS, 895 claimed tests.
- `git status --porcelain` after them: empty (rc 0). HEAD is still `8fd35b28`.

## 6. CI
- At my start, `gh pr checks 353` gave rc 8: every test job pending (`pr3-checks-start.txt`).
- Before this report it gave rc 8 again (`pr3-checks-end.txt`). Every check passes except `cargo test --workspace (windows-latest)`, which is pending in both runs. There are no failures.

## Correctness
None.

## Evidence
None blocking.
- E1, about a worker report, not the PR: report 1 says "The persisted line replays green on unbroken code" beside its verbose count of 1024. That verbose log (13:07:20) was written before break (a) saved the line (13:07:48), so none of the worker's logs supports the claim, and 1024 itself shows no seed was replayed in that run. My item 4 run (1028 against 1024) now proves it. Nothing in the PR rests on the report's sentence.

## Documentation
None that must be fixed in the diff.

## Notes
- N1: the Windows `cargo test --workspace` check must pass before the merge. Re-read `gh pr checks 353`.
- N2: proptest's persistence file is not keyed by test, so the one committed `cc` line replays in all four P2 tests. Only `a_cut_…` reproduces the input its comment records. This is expected proptest 1.12.0 behaviour, and it is why breaks (b) and (c) failed on the replay with nothing new to save.
- N3: P1's fixed case asserts only the declared bound. Its measured 0.5000000000005775 px sits in a comment, not in an assertion, so if the drawn error drifts toward the bound no test will notice. That is what Amendment 1 item 2 asks for, so this is not a finding.
- N4: in the worker's run, P1's generated case caught the break by a small margin (0.5010000020 against 0.501). Mine caught it at 2.0 px. The fixed case catches it on every run at 3.24 px.
- N5: the §5 CI-timings commit and the pre-merge checks of main and the lockfile delta are still to come (Amendment 2 item 4 and the form's Merge line).
- N6: making the export needed `core.longpaths=true` for the repository's long file names.

Files: `C:/dev/wt/property-trial/governance/forms/root/PROPERTY-TESTING-TRIAL-PREREGISTRATION.md`, `C:/dev/wt/property-trial/protocol/data-plane/tests/wire_properties.rs`, `C:/dev/wt/property-trial/protocol/data-plane/proptest-regressions/wire_properties.txt`, `C:/dev/wt/property-trial/frontends/shell/src/canvas/recentreBudget.property.test.ts`, `C:/dev/wt/property-trial/frontends/shell/src/streaming/wire.property.test.ts`. The scripts and the export are under `<S>/pr3/`.
