Reviewed: PR #238 at 866b35791cd037159eb0619e80eb1bec8b4851ff (base b5c1c841), gate 1, reviewer. cut/connection-reuse-recycled-interrupt-flake @ 866b35791cd037159eb0619e80eb1bec8b4851ff
Verdict: PASS WITH NOTES

I found no Correctness or Evidence problems. There are two Documentation findings, and both must be fixed before the merge with no re-gate. Neither is the human's wording: W1 to W6 are the architect's (§2.6). I reviewed the committed form at b5c1c841. The main checkout has uncommitted edits to that form (an appended Amendment 2) and to PLAN.yaml. I did not review those.

## Correctness
None.

## Evidence
None. Every outcome in §4 and Amendment 1 reproduced, each against its named commit (see "What I checked", item 2).

## Documentation (must fix before the merge, no re-gate)

**D1. `matches_nothing`'s doc keeps a line that §2.4 replaces, and W4 lists the flush conditions incompletely.** Where: engine/tests/connection_reuse.rs:85-90 @ 866b35791cd037159eb0619e80eb1bec8b4851ff.
- **The retained line.** §2.4 says the span engine/tests/connection_reuse.rs:85-90 @ 28163cb6 (hash recomputed, OK) "becomes W4". The head keeps that span's first line, `/// This is what makes the "cancel before the first batch" assertion structural rather than a race.`, and adds a `///` line before W4. That line names the viewport as what makes the assertion structural. W4 then says it is structural "twice over", with the cancel before the open as the first reason.
- **The incomplete list.** W4 says a batch "is only flushed when the pending payload reaches the size target or when the scan ends with something pending". `produce` also flushes on `cut_reason`'s row ceiling and first-batch budget (engine/src/stream.rs:2071-2080 @ 866b3579) and on the first-batch time budget (engine/src/stream.rs:2112-2116 @ 866b3579). The conclusion still holds, because every flush needs a row.
- **Fix.** Replace head lines 85-90 with these four lines. Each line is at most 99 columns. The §7 count is unchanged: the hunk stays 10 changed lines, the file 51 and the total 81.
```
/// Zero batches is then structural twice over. The test that uses it cancels before it opens the
/// stream, so the producer stops before it prepares; and even a scan that ran could flush nothing,
/// because `produce` flushes only a pending batch that holds at least one row, and a query that
/// matches nothing has none.
```
- **Clause check** (at 866b3579):
  - "cancels before it opens the stream": `cancel.cancel();` is at engine/tests/connection_reuse.rs:190, before `stream_with_cancel` at :192. `matches_nothing`'s only caller is :192 (grep).
  - "the producer stops before it prepares": the check before prepare is engine/src/stream.rs:1794, ahead of `conn.prepare`.
  - "flushes only a pending batch that holds at least one row": there are four flush sites outside `mod tests`. Three are guarded by `!pending.ids.is_empty()` (engine/src/stream.rs:2028, :2112, :2134). The fourth (:2080) is inside the per-row loop (:1989).
  - "a query that matches nothing has none": the bbox lies outside the extent (engine/tests/connection_reuse.rs:91-104).
- Lines 1-2 are W4's own words, unchanged (byte-compared). Line 83, the first paragraph, is untouched, as §5 declares.

**D2. The PR body does not list W1 to W6.** Both §2.6 and the 2026-10-11 direction, item 2, require that list. Where: the PR #238 body. Fix: add this under "What changes":
```
- **Words applied** (the architect's, none the human's; the full form §2.6, applied with no re-gate under the 2026-10-11 direction, item 2): W1 `lease_for_stream`'s doc (`engine/src/dataset.rs`); W2 `ConnectionFacts::interrupt_bound_at_lease`'s doc (`engine/src/stream.rs`); W3 the test's header comment, W4 `matches_nothing`'s doc (with the reviewer's gate-1 correction), W5 the structural comment and W6 the None arm's message (`engine/tests/connection_reuse.rs`).
```
Clause check: each W is at the file named. I compared them by script at 866b3579 with whitespace normalised: W1 to W5 found. W6 matches the joined string literal exactly.

**Outside the diff, not a PR fix.** The filed lead-data update, section 2, says 43 test pointers under engine/ and 4 under kernel/. My count at 866b3579 is 47: 44 under engine/ and 3 under kernel/, all resolving. That agrees with the correction in ead5b66a's message.

## Block-on-sight (§8)
1. Code before the form, or before depends_on: not triggered. The form was committed in a8c9fab3, an ancestor of B; the first code commit 03345bfa comes after. `source-changed-post-route-s5d-race` is `status: done` at b5c1c841.
2. Edit to the five-line form: not triggered. It is not in the diff, and `git diff --quiet` from B to main exits 0 for it.
3. Product change beyond §2.1: not triggered. stream.rs gains only the member, its doc and its one write (hunks at :639 and :1239). dataset.rs has comment lines only (a scan for non-`///` lines exits 1).
4. Member written elsewhere, or not read from the token: not triggered. The one write is `interrupt_bound_at_lease: cancel.is_bound(),` at engine/src/stream.rs:1239 @ 866b3579; grep finds no other write. M1's known survivor (a hard-coded `true`) is excluded at that line.
5. Live `is_bound()` as the binding assertion, sleep/retry/timeout, or the scratch line: not triggered. The assertion reads `f.interrupt_bound_at_lease` (:201). The only `until(` in the added lines is the comment that records the scratch line.
6. Other test changed, renamed, or its unchanged assertions or messages edited: not triggered.
7. cfg/fixture gating, W2's declarations, SKP or kernel record: not triggered. The member is ungated, and W2 is present with all three declarations. kernel/src/lib.rs:662-670 @ 866b3579 copies three named members into `StreamConnectionRecord` and not the new one.
8. Coverage claimed for a cancel that overlaps the bind beyond W1: not triggered.
9. A claim beyond §1: not triggered. The test's record says "Which producer check stops this stream is not asserted here."
10. A path:line cite in a code comment: not triggered (a regex scan of the added .rs lines exits 1).
11. Round 25:
    - §7 overrun or §7 edited: no. The count is 81 of 100, each file within its ceiling, and the form is append-only since a8c9fab3 (zero removed lines).
    - Scope addition: none (the four §7 files only).
    - A verify-mutation run called an observation: none.
    - A test-text span on an unmerged branch pinned by a branch-commit hash, or named without its commit: none. Amendment 1 carries no hashes, and the test's record names 03345bfa and b2df233d.

## What I checked
I ran every command in the foreground with its output redirected to a file and its exit code printed. Heavy commands ran inside shared holds of the brief's shape, with CARGO_BUILD_JOBS=8 and RUST_TEST_THREADS=8. Every hold was granted and released; no exit code 96 to 99 appeared.

1. **Diff, §2, W1 to W6, §5, §8.**
   - `git diff origin/main...HEAD`, exit 0: four files, 60 insertions and 21 deletions.
   - Merge base b2df233db725d947c02c001b7d3f0f2db3d9bde6.
   - `git diff 03345bfa 32c3e807`: 15 added lines, all `//` comments (the non-comment grep exits 1). From 32c3e807 to the head, engine/README.md changes only.
   - W1 to W6 compared by script (above).
   - Caller grep for `ConnectionFacts|interrupt_bound_at_lease|connection_facts()` over .rs/.ts/.tsx, exit 0: the only reader of the member is engine/tests/connection_reuse.rs:201. There is no struct literal outside the constructor, and nothing under frontends/ reads it. The member rests on the round 5, item 4 exemption, with W2's three declarations.
   - Seam: the test runs from the public `Dataset::stream_with_cancel` to `BatchStream::connection_facts`. The kernel compiles and passes `query_window_attribution`.
   - Nothing reads the flag before the lease. `stream_inner` uses `cancel` only at :1234 and :1239, and engine/src/pool.rs:355-435 holds no `cancel` (grep exits 1).
   - CI on the PR head, by `gh pr checks 238` (exit 0): every check passes, ubuntu-24.04 and windows-latest workspace runs included.

2. **Observations.** Each was applied by a node script that asserts exactly one match; the diff was shown, the one test run alone by name with `-- --exact`, the change reverted with `git checkout --`, and the porcelain shown empty.
   - The worktrees were C:/dev/wt/crf-rv-h (03345bfa, later 866b3579) and C:/dev/wt/crf-rv-b (b2df233d). Both used CARGO_TARGET_DIR D:/wt-targets/crf-rv-h, one run after the other, never concurrently. Each run compiled spatial-engine from its own worktree (the Compiling line names it).
   - Baseline, 03345bfa, unmutated: passed, exit 0.
   - M1, 03345bfa: exit 101. FAILED at engine\tests\connection_reuse.rs:185:5 (03345bfa line numbering), with the binding assertion's message. As predicted.
   - M2, 03345bfa: exit 101. FAILED at :202:17 with W6's message. As predicted.
   - M3, 03345bfa (the five-line `if cancel.is_cancelled()` block before prepare deleted): passed, exit 0. The predicted survivor.
   - R1, b2df233d, with the scratch line after `let f = stream.connection_facts();`: exit 101. FAILED at :180:5 with the live-token assertion's message. As predicted.
   - R2, 03345bfa, with the same scratch line: passed, exit 0.
   - R3, 866b35791cd037159eb0619e80eb1bec8b4851ff, unforced: 20 runs, each exit 0, and 20 logs read "1 passed; 0 failed". The loop exited 0. This is a count, not a rate.
   - Amendment 1 records R3 at 03345bfa. The head differs from 03345bfa by comment lines and README only, so both are consistent.

3. **§9 suites at 866b3579.** The script exited 0.
   - `cargo test -p spatial-engine --test connection_reuse`: exit 0, 12 passed.
   - `cargo test -p spatial-engine --lib`: exit 0, 203 passed.
   - `cargo test -p spatial-kernel --test query_window_attribution`: exit 0, 2 passed and 1 ignored.
   - `cargo fmt --all --check`: exit 0, empty output.

4. **§7 count.** `git diff --numstat B HEAD -- <the four files>`, B = b2df233d, exit 0:

   | File | Added | Deleted | Changed | Ceiling |
   |---|---|---|---|---|
   | engine/README.md | 2 | 2 | 4 | 6 |
   | engine/src/dataset.rs | 9 | 3 | 12 | 14 (comment lines only) |
   | engine/src/stream.rs | 14 | 0 | 14 | 20 (outside `mod tests`, which opens at :2655) |
   | engine/tests/connection_reuse.rs | 35 | 16 | 51 | 60 |
   | Total | | | 81 | 100 |

   These match the PR body. There are five non-generated files.

5. **Owner's index.**
   - The update file's four `text` blocks, `cmp`'d against engine/README.md, all exit 0: line 530 and line 550 at B against the "Old" blocks, and line 530 and line 550 at the head against the "New" blocks.
   - The file has no CR bytes, and the README diff has 2 hunks.
   - The 22 listed preregistrations are in sorted order. Against `engine/*PREREGISTRATION*.md`, the only file not listed is the five-line form, as the update says.
   - All 45 backticked paths in lines 526-560 exist. All 47 test pointers resolve (44 under engine/, 3 under kernel/).
   - The section runs 35 lines (526-560), within its 60-line cap.
   - The update file's sha256 at b5c1c841 is fccdb15bb146aa6923b9a6f8eb91013b938bed596bd6c3aa2ebfa1f10ba9fc4b, matching ead5b66a.

6. **Governance at 866b3579.**
   - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`, in a hold: exit 0, 509 tests, 509 passed, 0 failed.
   - `verify.mjs --offline`: exit 0, PASS.
   - `verify-cites.mjs`: exit 0, PASS (2116 files).
   - `verify-quotes.mjs`: exit 0, PASS (129 checked).
   - `verify-test-claims.mjs`: exit 0, PASS (574 claimed tests).
   - Porcelain afterwards: empty.

7. **Hashes.** I recomputed every pin with `git show <rev>:<path> | sed -n 'a,bp' | sha256sum` on LF bytes.
   - The full form carries 62 pins at 28163cb6f30fd60681903ed1227cdf17c06abc0f: 62 OK, 0 bad (script exit 0).
   - For the history, the five-line form carries 30 pins at e54e4af2: 30 OK.
   - 28163cb6 and e54e4af2 are both ancestors of main.
   - Amendment 1 carries no hashes. The form is append-only from a8c9fab3 to b5c1c841 (one hunk, zero removed lines).

**Disclosures.**
- Three calls went past their foreground timeout and the harness moved them to the background: the first cold build (20 min 33 s), the suites call, and the verify-quotes/test-claims call. Each hold and its release ran inside the same call, and each finished with exit 0.
- Before the first build, I copied dependency artifacts from the worker's target into my own targets. Cargo rebuilt every dependency anyway, so no artifact of the worker's served any run. Both copies are deleted.
- Removed afterwards: both worktrees (`git worktree remove`, exit 0 each) and D:/wt-targets/crf-rv-h. C:/dev/wt/crf is untouched; its porcelain is empty at 866b35791cd037159eb0619e80eb1bec8b4851ff.
