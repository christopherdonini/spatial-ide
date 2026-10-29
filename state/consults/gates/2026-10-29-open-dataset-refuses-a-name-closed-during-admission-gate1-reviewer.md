Reviewed: PR #269 at da8c6cdc1eab427c6f5a4c521698748a0528104e (base fa3d09f6), gate 1, reviewer
Verdict: PASS WITH NOTES

Branch: cut/open-dataset-refuses-a-name-closed-during-admission @ da8c6cdc1eab427c6f5a4c521698748a0528104e. Brief sha256 shown first: 28e9dddfa353b3e7bb4d5bcfa40eb6a55ab5c20cacbf96624c63176580673796.

## Findings

### Correctness (blocking)
None.

### Evidence (blocking)
None.

### Documentation (must be fixed before the merge; no re-gate)
**D1. The follow-up node is called "proposed", but it has been placed.** The human's ruling of 2026-10-26 (`state/directives/2026-10-26-clicks-260-261-244-r2-241-o1-answers-pb-draft-b-6d-260-lines-5b-8a-8b-rulings.md` line 28, OPEN-1 (A)) placed it. On main cac8cba0 it is in PLAN.yaml:3405 (status blocked) and in state/FILLER-QUEUE.md:27 (row 10, queued). Neither sentence below is the human's wording: the first is the worker's doc comment, and the second is the architect's source comment (the form's note 5 says "These words are mine, not the human's"). Under §31 the worker applies these words with no re-gate, and the PR body lists them.
- kernel/src/skp.rs:5117-5118 at the head. Now: `/// the name after the check, and the ChecksOnly arm. The proposed node` / `/// `open-dataset-close-serialised-under-the-catalog-lock` takes them.`
  Replace with two lines (92 columns and under):
  `    /// the name after the check, and the ChecksOnly arm. The node placed as filler entry 10,`
  `    /// `open-dataset-close-serialised-under-the-catalog-lock`, takes them.`
  Clause check:
  - "the node … open-dataset-close-serialised-under-the-catalog-lock": the id at PLAN.yaml:3405 on main.
  - "placed as filler entry 10": state/FILLER-QUEUE.md:27, row 10, queued.
  - "takes them": the node's title at PLAN.yaml:3406 names both arms and the forget/removal window, which covers the two windows this sentence names.
- protocol/skp/SKP-V0.md:55 at the head. The last sentence of the comment is now `The remaining window is proposed as its own node.` Replace that sentence only with:
  `Both windows are left to the node open-dataset-close-serialised-under-the-catalog-lock, placed as filler entry 10.`
  Clause check:
  - "Both windows": the two the comment's previous sentence names (a close after the check; the ChecksOnly arm). This also corrects the singular "window" next to two named windows.
  - The node id and its placement: as above.
  After this change the comment is no longer byte-equal to the form's note 5 span. The PR body records that.

## Check 1: the diff against the five lines and the notes
- Commits: 5e38ffae (the fix alone), 68773f09 (the test and the words), da8c6cdc (doc lines only). For 68773f09..da8c6cdc, a filter for non-`///` changed lines matched nothing (rc=1).
- Commit 1's hunks: the lock-order doc at 1000 and the Watching arm at 1240, nothing else.
- Files: `git diff --stat fa3d09f6...HEAD` shows 3 files, 87 insertions and 35 deletions: 122 against 140. The worker's numstat is 9/0, 71/35 and 7/0.
- The Watching arm (kernel/src/skp.rs:1245-1254 at the head):
  - The check comes after `resolves_unchanged` and the signal refusal (1207-1244), and before `SessionRef::mint()`.
  - The order is `drop(guard); drop(watch); return Err(SkpError::unknown_dataset(handle.as_str()))`.
  - Nothing is minted, inserted, emitted or removed.
  - The `_end_open_on_drop` guard still frees the cancel key.
- No hunk touches the ChecksOnly arm, `close_dataset`, `Catalog` (lib.rs is not in the diff) or `GenerationRegistry`. The only test changed is the pinned one, renamed and replaced, and its block comment.
- **Lock-order doc** (skp.rs:1002-1008): true against every taker.
  - Catalog guards are taken only inside `Catalog`'s own methods (lib.rs:204, 233, 238, 249, 253).
  - Every other caller takes `get`/`remove` alone and releases it: skp.rs 1216, 1250, 1286, 1585, 1605; describe and viewport_query_resolve; session_history.rs:154; lib.rs:417; main.rs:105-106; frontends/shell/src-tauri/src/pool_poll.rs:193.
  - The latch is a per-call local. The sink drops it before `end_generation`.
  - Admission never holds the catalog guard and generations together.
- **Byte-equality**, by my script `odr-g1r-bytes.mjs` (rc=0), against main:
  - SKP-V0.md:54 equals the span inside the quotes of the 2026-10-26 resent directive line 25: true.
  - Line 55 equals the backticked span of the form's line 94: true.
  - The §8 note equals the form's line 167: heading at 1132 equal, blank line, paragraph at 1134 equal (two spans separated by " / "). It is the last note before `## 9` at 1136.
  - No CR in any of the three files.
- **Superseded pins** (Amendment 3 of the earlier form):
  - Recomputed from `git show fa3d09f6:` with `sed -n 9p` and `sed -n 133p`: 29de1bae…7172 and b67a5614…739b, both equal to the pins.
  - fa3d09f6 is an ancestor of origin/main (rc=0).
  - "superseded" sits on each pin's line, outside backticks.
  - Each historical line contains the old name (grep -c 1 each).
  - The earlier form's first 150 lines are byte-equal to the base (diff rc=0), so the amendment is append-only.
  - This satisfies conditions (a) to (e) at scripts/plan/verify-test-claims.mjs:59-80, read at the head. The tool lists :133 as superseded. It does not parse :9's bare name as a claim, so that pin is harmless.
- **Form category reading (§21d):** the Out-of-scope line names wire and guarantee as touched. AUTONOMY.md:692 (§36) on main sets §25 (e) aside for filler pieces, so the five-line form stands.

## Check 2: the flip
My first run at commit 1's tree gave an invalid observation, and I discarded it. The tar overlay had restored the archive's older mtime, so cargo reused the stale M3 test binary: it reported the new test's name and M3's assertion. I touched the file (sha256 unchanged at 2a148fff…b986) and re-ran.

The re-run (`cargo test -p spatial-kernel --locked --no-fail-fast`, rc=101) over 46 result lines summed to 389 passed, 1 failed and 42 ignored. The only failure was `a_close_during_open_admission_leaves_a_generation_for_a_name_the_catalog_no_longer_holds`, at kernel\src\skp.rs:5148:27: `the open returns Ok although a close ran inside its admission: SkpError { code: "skp.unknown_dataset", …`. That matches the form's prediction and the RECORDED MUTATION (the fix alone) line. The head passes (check 3).

## Check 3: the head (worktree, D:/wt-targets/odr, shared holds)
- `cargo test -p spatial-kernel --locked`: rc=0. 46 result lines; 390 passed, 0 failed, 42 ignored. `…a_close_during_open_admission_refuses_the_open_and_mints_no_generation ... ok`.
- `cargo test -p spatial-skp --locked`: rc=0. `30 passed`, `1 passed`, `25 passed`, `0 passed`, which is 56 in total with 0 failed.

## Check 4: the mutations, on the export
The export was `git archive 68773f09` into D:/wt-targets/odr-g1r-export, built cold on D:/wt-targets/odr-g1r-target. Each mutation was applied by `odr-g1r-mutate.mjs`, which refuses to run unless the file is at 663a4832…356d. Each was run with `cargo test -p spatial-kernel --locked --lib a_close_during_open_admission_refuses_the_open_and_mints_no_generation`, then restored. The restores printed `restored 663a4832…356d true` each time.
- **M1** (check deleted): rc=101, panicked at skp.rs:5145:30 in the mutated file (5150 unmutated). The message was `the open refuses a name a close removed inside it: OpenDatasetResponse { … }`, which is the `expect_err`. As predicted.
- **M2** (check moved after `mint_for_open`): rc=101, panicked at 5161:9 with `no live generation`, on `live_session`. As predicted.
- **M3** (the `OpenRecord` with the watch inserted before returning): rc=101, panicked at 5173:9 in the mutated file with `the open inserted no record`. As predicted.
- **Commit 1**: `git archive 5e38ffae` overlaid. The other two files are byte-equal to 5e38ffae. Results are in check 2.

## Check 5: the seam and the wire
- frontends/shell/src-tauri/src/commands.rs:58-66 passes `SkpError` through unchanged. admitDataset.ts:57-64 turns any `SkpCallError` from open or describe into `formatRefusal(e.skpError)`, which is code-generic. describe already returns this code to that block.
- So the reading at close-races §1 (GENERATION-CLOSE-RACES-PREREGISTRATION.md:93) applies: no new seam, and no shell end-to-end test is owed.
- `SKP_VERSION` is `"skp/0.12"` (protocol/skp/src/v0/mod.rs:115). The diff touches only the three files: no fixture, no TypeScript, nothing under protocol/ but SKP-V0.md.

## Check 6: the verify scripts, fmt and CI (at the head)
- `verify.mjs --offline`: rc=0, PASS.
- `verify-cites.mjs`: rc=0, PASS (76 loose references advised in other files).
- `verify-quotes.mjs`: rc=0, `131 checked, 100 verified, 30 baselined, … 0 hash-reference errors`.
- `verify-test-claims.mjs`: rc=0, `all 695 claimed test(s) … 12 superseded`.
- `cargo fmt --all -- --check`: rc=0, empty output.
- `gh pr checks 269`: the first read had rc=8, with the PR Windows job pending. I waited on run 40836887355 with a bounded loop until it completed with success. The second read had rc=0: all 18 checks pass.
- Every run's headSha from `gh run view` is da8c6cdc1eab427c6f5a4c521698748a0528104e: push runs 40834635987, 40834636004, 40834635972, 40834635973, 40834636031, and PR runs 40836887355, 40836887238, 40836887346, 40836887259, 40836887255, 40836887317, 40836887384.
- The new test shows `... ok` in Windows job 123316433983 and Linux L1 job 123316434257 (push run), and in Linux 123323648018 and Windows 123323648392 (PR run).

## Hold lines (this project's only; `also=` elided)
Every hold was granted and released (`MACHINE_RELEASED project=SpatialIDE shell=bash.exe:<pid> affinity=FF (cores 0-7)`). Each hold line read `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:<pid> also=<elided> …`, with these pids:
- 45600: head kernel
- 18264: head skp
- 43492: M1, the cold build
- 47096: M2
- 9668: M3
- 34108: commit 1, the discarded stale run
- 1820: commit 1, the re-run

## Background shells, writes and cleanup
- All eight background tasks I started had exited, each with its completion notification: bbd3d506q, b51xf773e, bvhkzohyq, b5ijfd4ls, bhvk5xn2h, by5nyy2z3, bibgk2vf8, bfa0xlzzg. `tasklist` shows no cargo.exe.
- D:/wt-targets/odr-g1r-export is removed (`ls`: No such file or directory).
- D:/wt-targets/odr-g1r-target is left in place. Nothing in the brief asks for its removal.
- The worktree's porcelain is empty, at HEAD da8c6cdc.
- One write outside the listed places: the head kernel run regenerated the tests' own fixtures under the worktree's gitignored C:/dev/wt/odr/target/fixtures/ticket-drop-under-lock. The directory already existed and is not tracked.
- Scratch files are all named odr-g1r-* in the scratchpad (<the session scratch folder>/), among them odr-g1r-c1b.log, odr-g1r-m1.log, odr-g1r-m2.log, odr-g1r-m3.log, odr-g1r-head-kernel.log, odr-g1r-head-skp.log, odr-g1r-bytes.mjs and odr-g1r-mutate.mjs.
