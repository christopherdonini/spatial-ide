Reviewed: PR #255 at 8cca70aec09942b7eaa66a79292be4a35c7b2335 (gate 1 at 27924bbe), gate 2, reviewer
Verdict: FAIL

The only blocking finding is one Correctness finding about wording (C2): two sentences. My replacement words are below. Neither sentence is the human's, so under §31 the worker applies the words with no re-gate and the PR body lists them. The code's Correctness and Evidence findings are closed against the narrowed claim.

Branch reviewed: `cut/stream-evaluation-failure-fixed-detail` @ 8cca70aec09942b7eaa66a79292be4a35c7b2335. Main is at 2fbeb2c0cefd80ca28c4ce7747fe80a704cc1093. The merge base is f0804432d50cea3b9bb54903177e5ec260c5c3ae.

## My gate 1 findings

- **C1 (fetch site): carried by a node.** Under Amendment 2, item 1, the claim covers the prepare and execute sites only. The fetch case is node `stream-fetch-overflow-fixed-detail` (PLAN.yaml:3443 at main). At the head, the three doc comments in stream.rs say the fetch site is not covered (engine/src/stream.rs:2597-2600, :2605-2606, :2613-2614). My gate 1 probe reading stands as that node's case; I did not re-run it.
- **E1 (no fetch-shape test): carried by the same node.** For the narrowed claim, the execute site is proven at the head (check 3).
- **Gate 1 Documentation item (the `OUT_OF_RANGE_DETAIL` doc sentence): closed.** It was replaced by route B's word set 1 (check 1).
- **O1: carried by a node,** `admitted-integer-overflow-silent-wraparound` (PLAN.yaml:3426 at main).

## Correctness (blocking; wording only, §31 replacement words)

**C2. Two statements of the claim at the head are not bounded to the prepare and execute sites.** Each is a guarantee the code does not support at the fetch site. Ordinary use reaches that site (any large file whose first overflowing row comes after `stream_arrow` returns; gate 1 C1), so by the proportional rule this is not documentation-only.

**(a) engine/tests/admission_property_campaign.rs:1022-1023 at the head.**
- Current text: "Such a stream ends in error by direction (B-1 point 4), and node `stream-evaluation-failure-fixed-detail` makes its terminal text the fixed detail alone."
- Who wrote it: the worker, at 86612bdd. It is not the human's wording and not part of route B's approved word sets. D1 is the sentence after it and is not touched.
- Replacement (mine), wrapped by hand to 100 columns as `///` lines:

  Such a stream ends in error by direction (B-1 point 4); when DuckDB raises it at the prepare or execute site, node `stream-evaluation-failure-fixed-detail` makes its terminal text the fixed detail alone, and when it is first raised during a fetch its terminal keeps DuckDB's text (node `stream-fetch-overflow-fixed-detail`).

- Clause check against the head:
  - "ends in error by direction (B-1 point 4)": these words are kept unchanged. They state the direction, not a fact. The silent-wraparound case raises nothing and is O1's node.
  - "when DuckDB raises it at the prepare or execute site … the fixed detail alone":
    - stream.rs:1801 and :1856 pass `&e.to_string()`.
    - `classify`'s arm at :2618-2619 returns `OUT_OF_RANGE_DETAIL`.
    - The test constant at admission_property_campaign.rs:1018 is `query: ` followed by that detail.
    - Proven at execute: T1 passes at the head. Under M1, T1's text began `query: execute: Out of Range Error` (check 3).
  - "first raised during a fetch its terminal keeps DuckDB's text":
    - stream.rs:1936 passes the downcast panic payload.
    - The locked duckdb 1.10505.0 (Cargo.lock:541-542) builds that payload as `Err(err) => panic!("Failed to fetch Arrow record batch: {err}"),`. I read this at line 46 of `src/arrow_batch.rs` in the cargo registry source.
    - `is_out_of_range` is `starts_with` (:2609), so the payload never matches, and the else arm renders `{phase}: {message}` (:2621).
    - This is the same claim as route B's approved words at :2597-2600.
  - "(node `stream-fetch-overflow-fixed-detail`)": PLAN.yaml:3443 at main.

**(b) The PR title.**
- Current text: "feat(engine): an admitted predicate's evaluation failure ends the stream with a fixed detail carrying no file values and no SQL (stream-evaluation-failure-fixed-detail)".
- Who wrote it: the custodian. It is not the human's wording. The PR body is bounded; the title is not.
- Replacement (mine): feat(engine): an admitted predicate's integer overflow raised at the prepare or execute site ends the stream with a fixed detail carrying no file values and no SQL (stream-evaluation-failure-fixed-detail)
- Clause check:
  - "integer overflow": the known product source of the label (stream.rs:2593-2594, route B's words). The old "evaluation failure" also covered classes that keep DuckDB's text, for example conversion errors (T2's sample at :2709 stays `{phase}: {message}`).
  - "raised": excludes O1's wraparound.
  - "at the prepare or execute site … no file values and no SQL": the same evidence as (a). It matches the bound already in PLAN.yaml:3391 at main.

## Evidence

No new findings.

## Documentation (must fix before the merge)

**D2. The form's title is unbounded, and Amendment 2's superseded index does not name it.**
- Where: engine/STREAM-EVALUATION-FAILURE-FIXED-DETAIL-PREREGISTRATION.md, the title (line 1 at main 2fbeb2c0). It reads "… ends the stream with a fixed, engine-authored detail carrying no file values and no SQL".
- The form is append-only, so the title cannot be edited. Amendment 2's "Superseded" names only the Change line's claim.
- Fix: the closing amendment's superseded index also names the title, read with Amendment 2, item 1, with the title left unedited. This is a record reference only, so I give no replacement for the title itself.
- I leave it to the architect to confirm under the record cap.

## What I checked

1. **The delta is doc lines only, and each word set matches its source byte for byte.**
   - Command: `git diff -U0 27924bbe..HEAD`, read by the script sefd-g2r-check1.mjs. rc 0.
   - Two files changed (engine/src/stream.rs and engine/tests/admission_property_campaign.rs), 26 changed lines, 0 that are not `///` lines. The pattern was self-tested on a code line and a doc line.
   - With each head doc block joined and `> ` dropped from each source line, every word set matched:
     - route draft line 71 is the whole `OUT_OF_RANGE_DETAIL` doc;
     - line 85 is the whole `is_out_of_range` doc;
     - line 90 is `classify`'s last clause, after its two unchanged clauses;
     - gate1-architect line 58 is the end of the `is_declared_integer_arithmetic_overflow` doc.
   - A negative self-test (one byte appended) mismatched, as it should.
   - The words are true of the code:
     - Prepare and execute pass `&e.to_string()` (:1801, :1856).
     - `Guarded::Err(e)` holds the closure's error unchanged (cancel.rs:199).
     - Fetch passes `&detail` (:1936).
     - The crate's prefix and its version are as checked under C2(a).
     - D1's key is at admission_property_campaign.rs:1032-1036.
   - "no test starts from the prepare site": under M1, B-T1 printed 40 failure texts. All 40 are `query: execute: Out of Range`, with 0 `prepare:` and 0 `duckdb fetch panicked`.
2. **C1 against the narrowed claim.**
   - Bounded: the three stream.rs docs; Amendment 2, item 1; the PR body's "The change" paragraph; PLAN.yaml:3391.
   - Not bounded: the campaign sentence and the PR title (C2).
   - Also read: T1's doc (admission_property_campaign.rs:1451-1454) is about T1's own execute-site run. The filter_type_admission.rs:991-1001 doc is about identification, not the claim.
3. **E1 against the narrowed claim.**
   - At the head, in C:/dev/wt/sefd:
     - `cargo test -p spatial-engine --test admission_property_campaign`: rc 0, 4 passed, T1 among them.
     - `cargo test -p spatial-engine --lib only_duckdbs_out_of_range_class_is_read_as_an_evaluation_failure`: rc 0, 1 passed.
   - M1 in the throwaway C:/dev/wt/sefd-g2r, detached at 8cca70ae, with CARGO_TARGET_DIR=D:/wt-targets/sefd-g2r:
     - Applied by script: the two-line arm deleted, numstat `0 2`.
     - `cargo test -p spatial-engine --test admission_property_campaign an_admitted_integer_overflow_ends_the_stream_with_the_fixed_detail`: rc 101. It panicked at admission_property_campaign.rs:1477:5, `assertion `left == right` failed`, with left `"query: execute: Out of Range Error: Overflow in multiplication of INT64 (-3602189387807864356 * -3602189387807864356)!"`. That is the execute phase, failing by name.
     - Also under M1: `cargo test -p spatial-engine --test filter_type_admission the_type_walk_agrees_with_the_binder_over_the_p0_matrix`: rc 101, `B-T1: 4564 admitted, 5164 refused, 135 failures`. This matches the RECORDED MUTATION line.
   - Cleanup:
     - Reverted with `git checkout`; porcelain 0 bytes.
     - `git worktree remove` rc 0, without `--force`. `git worktree list` has 0 lines naming sefd-g2r.
     - `rm -rf D:/wt-targets/sefd-g2r` rc 0; the folder is gone.
   - **Deviation:** the M1 build and run of T1 ran with `run_in_background`, not in the foreground. A fresh target took `18m 53s` to build, and the tool caps a foreground call at 600 s. It was still one Bash call of the hold shape, its output was redirected to a file, and its rc was printed (101).
4. **Size.** `git diff --numstat f0804432...HEAD` rc 0: stream.rs 74/5, admission_property_campaign.rs 45/6, filter_type_admission.rs 9/5. That is 144 of 150, in the 3 files the Scope names. GitHub shows 128 additions and 16 deletions, which agrees.
5. **fmt, clippy and the campaign test, in C:/dev/wt/sefd with CARGO_TARGET_DIR=D:/wt-targets/sefd.**
   - `cargo fmt --check -p spatial-engine`: rc 0, no output.
   - `cargo clippy -p spatial-engine --tests -- -D warnings`: rc 101.
     - The lib stops on 3 lints, at rowgroup.rs:331, stream.rs:2355 and stream.rs:2471.
     - They predate the PR: blame gives 93a32458, 8a1f3eac and 0116c676, and each is an ancestor of the merge base (`merge-base --is-ancestor` rc 0).
     - So this command form cannot pass on the base either. This is not a finding against the PR.
   - `cargo clippy -p spatial-engine --tests` (without `-D`): rc 0, 39 warnings, the same count as gate 1.
     - The ones in the PR's files are at stream.rs 2355, 2359, 2471 and 3617, campaign 218, 270, 543 and 556, and filter_type_admission 955.
     - Blame puts all of them at commits that are ancestors of f0804432. None is in the diff.
   - `cargo test -p spatial-engine --test admission_property_campaign`: rc 0 (see check 3).
6. **Governance scripts at main 2fbeb2c0cefd80ca28c4ce7747fe80a704cc1093.**
   - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`: rc 0, 555 pass, 0 fail.
   - `verify.mjs --offline`: rc 0, PASS.
   - `verify-cites.mjs`: rc 0, PASS (99 loose references advised).
   - `verify-quotes.mjs`: rc 0, PASS (0 errors).
   - `verify-test-claims.mjs`: rc 0, PASS (657 claimed).
7. **The PR body and CI.**
   - Figures:
     - "144 of the declared 150" matches check 4.
     - "only doc lines change" matches check 1.
     - The M1 figures (T1, B-T1 135, P5 4) agree with gate 1 and with my M1 run (T1, B-T1).
     - "No new … `pub` item": grep of the added lines for `pub` gives rc 1, no match. The pattern was checked positive on stream.rs: 97.
     - The Rule (00) claim holds: `gh pr list` over the open PRs (#252, #249, #244, #241) shows none touching the three files.
     - The "clippy … exit 0" at 27924bbe is the form without `-D` (see check 5).
   - CI: `gh pr checks 255` rc 0, 18 checks, all pass, none pending, so no wait loop was needed.
     - `gh run list` gives 12 runs at head sha 8cca70aec09942b7eaa66a79292be4a35c7b2335, all `completed success`.
     - pull_request: 40177691158, 40177691332, 40177691231, 40177691212, 40177691157, 40177691280, 40177691228.
     - push: 40177688211, 40177688178, 40177688185, 40177688244, 40177688186.

## Holds

- All heavy runs were in this project's shared holds: clippy (twice), the campaign test, T2, T1 under M1, and B-T1 under M1.
- Each was granted as `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF` and closed by `MACHINE_RELEASED project=SpatialIDE`.
- None was refused, there was no exit 96-99, and nothing was timing-sensitive.

## State left

- `C:/dev/wt/sefd`: porcelain 0 bytes, HEAD 8cca70aec09942b7eaa66a79292be4a35c7b2335.
- The throwaway is removed and not in `git worktree list`. D:/wt-targets/sefd-g2r is deleted.
- `tasklist` shows no cargo.exe, rustc.exe, admission_property_campaign or filter_type_admission process running.
- My scratch files are only those named `sefd-g2r-*` in the scratch folder. I made no commit, push or PR action.
