Reviewed: PR #250 at 14cdbcc0adec72b2d9d6b7f10bdd152d9c43439d, gate 1, architect
cut/publish-sort-window-cancel-not-exercised-on-ci @ 14cdbcc0adec72b2d9d6b7f10bdd152d9c43439d

Verdict: PASS WITH NOTES

I have no shell, so I ran no git, gh, cargo or hash command. I read the head from the worktree `C:/dev/wt/sw` and B from the main checkout. The diff shape, the run ids, the job logs and the numstat are the worker's report, and I checked them against the file contents where I could.

## Findings

**Correctness:** none.

**Evidence:** none.

**Documentation (must be fixed before the merge, no re-gate; the worker's text, not the human's, so the worker applies these words and the PR body lists them):**

**D1. The comment misstates the design note.** At `kernel/tests/publish_cancellation.rs:251-253` (head) the comment says "The design note's claim is reachability only". The note's own row, `kernel/CANCELLATION-AND-TRACING.md:130` (main), reads "Deterministic by construction — reachable only with a batch demanded and none arrived." Without naming that word, the comment contradicts the text it cites. A reader who checks the note finds the "deterministic" reading the old comment used to justify failing the test.

**D2. The comment names no toolchain.** At `kernel/tests/publish_cancellation.rs:254-257` (head) it says "observed behaviour of the toolchain" but names no version. Section A's last bullet requires "the observed capture behaviour at the recorded toolchain version", and round 15 (c) requires a tool claim to name its version. The comment also says "only because", a claim about cause that neither L0 nor C0 observed: they observed that the line appears.

**Replacement for head lines 251-257** (wrap the comment at 100 columns):

```
    // (1) The design note's "Deterministic by construction" (`kernel/CANCELLATION-AND-TRACING.md`
    // §4, the `QueryRunning` row; `kernel/src/publish/mod.rs`'s `WouldBlock` arm) says where the
    // phase fires: if `QueryRunning` fires, it is inside the window. It does not say the phase
    // always fires, so a fast machine can legitimately miss the window.
    // (2) The line below reaches a CI log because libtest's capture intercepts the print macros
    // (`eprintln!`, which hid the old note) and not a write to the stderr handle. That is observed
    // behaviour, not a documented guarantee: observed at rustc 1.97.1 (8bab26f4f 2026-07-14) locally
    // and at rustc 1.99.1 (58cf8f9c3 2026-10-13) on windows-latest and ubuntu-24.04 (run
    // 40079051071). If a later toolchain stops showing the line, this test goes silent again, which
    // is the defect this branch exists to remove.
```

Each clause checked:
- "Deterministic by construction" is byte-copied from `kernel/CANCELLATION-AND-TRACING.md:130`.
- "§4, the `QueryRunning` row": line 120 is the heading of §4, and line 130 is in its table.
- "if `QueryRunning` fires, it is inside the window": `kernel/src/publish/mod.rs:781-785` (worktree, after the revert) emits the phase only on `WouldBlock`, behind `!reported_writing`, so only before the first batch.
- "does not say the phase always fires": the note's dash clause and `mod.rs:198-200` are both conditional ("reachable only when").
- "a fast machine can … miss": there is no `WouldBlock` if the first batch arrives inside one poll interval (`mod.rs:756-770`).
- The versions are from the report: rustc 1.97.1 at L0 and rustc 1.99.1 in both C0 job logs. The run id 40079051071 and the two runners are from the report's C0 section.
- "only" is dropped (D2).
- Budget: the block grows from 7 lines to 10, so 56 changed lines become 59, within the 80-line budget. No assertion, string or other line changes, so M1's recorded failure text stays exact.

## Check 1. The five lines, with Amendment 1, against the head

**Change line, as amended by Amendment 1 item 3: holds.**
- **INCONCLUSIVE shape** (head :259-276): `!saw_running`, then `Ok(done) if done.rows == FEATURES as u64 && done.partitions > 0 && !acknowledged`, then one `writeln!` to `std::io::stderr().lock()` with its result ignored, then `return`.
  - The string's `\` continuations make it one line. L0 printed it as one line.
  - It begins "INCONCLUSIVE" and names the file and the test as literals.
- **No assertion on the token's flag:** the test calls no `cancel.is_cancelled()`.
- **The window branch:** head :285-310 matches B :257-282 line for line. The tail also matches with a +28 offset: B :555-565 and head :583-593 hold the same `no_staging_beside`.
- **Any other shape** reaches the `panic!` at head :277-281. Its message carries the outcome, the acknowledged flag and the phases.

**Tests+mutation line: holds.**
- The test's name is unchanged (head :211). No test was added or removed: the head has the same six `#[test]` functions as B.
- M1 is recorded at head :205-209 as a `RECORDED MUTATION (observed at e58f98e3 …)` doc line. Its failure text matches the report's panic text, apart from where the `///` lines wrap.
- That matches Amendment 1 item 4's prediction (`Err(Cancelled)`, failing at the shape guard). The precedent for naming a branch commit in such a line is `kernel/src/dataset_ref.rs:668` and others.

**Scope line: holds.** One file. Counting by hand: +1 import (:30), +6 doc lines (:204-209), +35 lines for the comment and guard (:249-283), against −14 at B :242-255. That is 42/14, so 56 lines, which matches the report's numstat. B has 565 lines and the head 593, a net +28.

## Check 2. The Out-of-scope line

- **ADR, security, wire:** untouched. The file is a test under `kernel/tests/`. It has no ADR text, nothing under `protocol/`, and nothing that ADR-020, ADR-009 or ADR-021 governs.
- **Product code:** none changed. The worktree's `kernel/src/publish/mod.rs:754` reads `watch.check()?;`, and the observer's QueryRunning arm is present at head :217-222. I relied on the report's `--name-only` for the other files.
- **Ceilings, docs/08:** nothing changed.
- **ADR-018:** read at §1-§6 (lines 39-100). None of its instants, budget or scoring changes. §5's "reachability, not a bound" is the distinction the comment draws.
- **The narrowing:** the cancel is asserted only on a run that reaches the window. The survivor reads INCONCLUSIVE (observed, check 5). That narrowing is the whole change.
  - Disclosed but worth stating: any regression that stops `QueryRunning` firing reads INCONCLUSIVE, not only a restored blocking wait.
  - The form's "a regression that removes the window" covers this in general terms.

## Check 3. Section A's two comment points; the FEATURES doc

- **Point 1** is present (head :251-253) but misstates the note: D1.
- **Point 2** is present (head :254-257) but names no toolchain: D2.
- **Claims beyond the evidence:** apart from "only because" and the missing versions, the comment claims no more than L0 (rustc 1.97.1) and C0 (rustc 1.99.1) observed. It explicitly says the behaviour is not a guarantee.
- **The FEATURES doc** (head :56-59) is true at the head:
  - the sort-window test now states its no-phase outcome by name and passes;
  - `writing_partitions_is_not_announced_before_a_partition_exists` tolerates the phase being absent (`if let Some`, head :341);
  - no test asserts slowness.

## Check 4. Can any other shape reach the INCONCLUSIVE return?

No. The paths I checked:
- **Cancelled publish** (`Err(Cancelled)`, from the observer's cancel or from M1): not `Ok`, so it panics. M1 observed this.
- **Refused publish** (`CeilingExceeded` at mod.rs:800-805, `StagingNotRemoved`, `ViewerLicenseNoticeMissing`, preflight or pin errors): `Err`, so it panics.
- **Partial publish** (`rows != FEATURES`) or **zero partitions:** the guard fails, so it panics.
- **`Ok` with an acknowledgement:** blocked by the `!acknowledged` guard. `CancelWatch` stamps only on a cancellation path (mod.rs:679-684, 767, 786), which returns `Err`.
- **A cancel raised without `QueryRunning` recorded:** cannot happen. The observer records before it cancels (head :218-220) and is the test's only canceller.
- **`BatchStream`'s `Drop`:** it uses `cancel_for_drop` (`engine/src/stream.rs:898-908`, worktree), which stamps nothing. The stream lives to the end of `run_inner`, so it cannot fail a running publish.
- **`QueryRunning` fired:** the original assertions run unchanged.

## Check 5. The evidence against the predictions (all as the report gives it; not re-run)

- **L0:** as predicted. The line was printed, the test read `ok`, and `rustc -V` gave 1.97.1. `Phases seen: []` is expected, because the observer's `phase` body was emptied, as section A's pin of B :210-214 describes.
- **M1:** as amended. rc=101 at the shape guard. :271:18 at e58f98e3 becomes head :277 after the six doc lines, which is consistent.
- **Survivor:** as predicted in section C: INCONCLUSIVE with the full phase list, then `ok`. It needed an adapter, which the report discloses.
- **C0:** run 40079051071 on e520e30d, `completed success`. Both matrix entries passed and each log carries the line.
- **The settlement's C0 terms:**
  - on the piece's own branch: met;
  - waited out: met;
  - reverted by 14cdbcc0: met;
  - the final diff holds neither commit: the head file has the arm, and the report says `git diff 23c58cdc HEAD` is empty.

## Observations (not findings)

- **(a) Worktree not clean during my reads.** `C:/dev/wt/sw/kernel/src/publish/mod.rs:754` read `return Err(PublishError::Cancelled);` on three reads, then `watch.check()?;` on the fourth. That looks like the reviewer's concurrent M1 re-run. The test file did not change across my reads. The custodian should confirm the porcelain is empty after the reviewer's run.
- **(b) The head's CI is unread.** The worker did not wait for the CI run on 14cdbcc0. Its conclusion is the custodian's to read before the merge.
- **(c) A one-line-off cite in the worker's report.** The report (on main, outside this diff) cites `engine/src/stream.rs:897-907`. The `Drop` impl is at 898-908 in both the worktree and main. This is a record matter, not this PR's.
- **(d) "Acknowledgement" wording.** The new panic text says "acknowledgement", which ADR-018 §1 retires from prose. It continues wording the file already uses: the field `acknowledged_at` and line 187. Changing it would void M1's recorded failure text, so I do not raise it here. It is a candidate for the docs lane.

No ADR is needed.
