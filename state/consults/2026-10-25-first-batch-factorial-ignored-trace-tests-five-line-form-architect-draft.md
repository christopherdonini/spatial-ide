*Custodian's filing note (2026-10-25): the architect's read-only draft, ahead, of the five-line form for `first-batch-factorial-ignored-trace-tests`, the filler queue's entry 6b (S3), read at main 82f497b1 while entry 6a (#259) is in its gate. Nothing is committed from it until #259 leaves the slot; then the custodian commits the form on main, its cites pinned by script at 82f497b1. The custodian's choices on its open items: OPEN-1 (A), the file-local lock in the sibling piece's shape; OPEN-2 (A), both tests observed on an export with the fixtures copied in and the disk floor checked first, falling back to (B) if the second fixture is absent or the floor would be crossed. Under the machine rules a timing miss in a shared run is reported to the custodian, who re-runs it alone, and is not recorded as a failure. The run 19:46:47Z to 19:52:56Z by its transcript (Grep 19, Read 22, Glob 4; no write tool). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is fe75c7325a86ab983ee07994bbfd8cbf9b4c4f04f63867eebf1f96beb8436d87.*

---

Drafted: first-batch-factorial-ignored-trace-tests, five-line form, architect

Read at: main @ 82f497b1, read only. I changed no file. I have no shell, so this draft carries no sha256. The custodian expands each `path:line @ 82f497b1` cite into a pin by script, as for entries 5 and 6a. Every word below is mine except the text inside backticks that is byte-copied from code (identifiers, and the expect message `no other trace is running` from kernel/tests/first_batch_factorial.rs:1325 @ 82f497b1).

## The five lines

```
Authority: PLAN node `first-batch-factorial-ignored-trace-tests` (PLAN.yaml:4454-4470 @ 82f497b1), generation 2; filler queue entry 6b, graded S3 (state/directives/2026-10-24-weekend-exception-third-product-slot-placements-forms-ahead-250-click.md:14 @ 82f497b1; state/FILLER-QUEUE.md:14 @ 82f497b1); the filler rule, AUTONOMY.md §36 (AUTONOMY.md:692 @ 82f497b1): a five-line form under §21c, the reviewer and the architect from dispatch, round 25, item 2 (e) set aside; proposed by the human's rulings of 2026-10-09, item 6 (state/directives/2026-10-09-rulings-on-the-eight-forms.md:52 @ 82f497b1), as a sibling site of kernel/WIRE-BYTES-INVARIANT-TRACE-FLAG-RACE-PREREGISTRATION.md §0.7 (its Amendment 1, item 2); the reuse index found no prior art on either search (trace test lock; ignored measurement test), a miss noted here.
Scope: 1 file, kernel/tests/first_batch_factorial.rs: one file-local lock with its accessor and doc, placed above `cancellation_holds_with_pruning_in_the_path`'s doc comment, and one new first statement in that test and in `cancellation_holds_with_pruning_in_the_path_on_h5`; declared line budget 40 (insertions plus deletions, comments counted, AUTONOMY.md:357 @ 82f497b1); this form exempt; no assertion, message, test name, `#[ignore]` reason, fixture path, constant or other test changes, and no other file changes.
Change: the two in-process cancellation cells take turns on the engine's process-global trace flag and slot: each takes a file-local `static TRACE_SERIAL: std::sync::Mutex<()>` through `fn serial()` (a poisoned lock recovered with `into_inner`, the shape at kernel/tests/wire_bytes_invariant.rs:183-187 @ 82f497b1) as its first statement and holds it to the end of its body, so an invocation that runs both can no longer have one test's `trace::start` refused by the other's live trace.
Tests+mutation: no new test; changed by one first statement each: cancellation_holds_with_pruning_in_the_path and cancellation_holds_with_pruning_in_the_path_on_h5; M-1, for each: in `serial()`, after the lock is taken and before it returns, insert `std::mem::forget(spatial_engine::trace::start(spatial_engine::trace::TraceKey::default()));`, predicted to fail each test, run alone, by name at its start's expect (`no other trace is running`); observed as note 2 states (a release build, `--ignored --exact`, the fixtures in place in an export of the code commit), recorded by name with the 40-hex commit it was observed at in a `RECORDED MUTATION:` doc line, and reverted; a verify-mutation run is not an observation; a mutation that passes, or that fails anywhere else, is a stop.
Out-of-scope: ADR: no status line or amendment (ADR-010 rule 6's one-traced-stream limit and ADR-018's scored pair are read, not changed); security: nothing ADR-020, ADR-009 or ADR-021 governs; wire: no SKP, data-plane or MCP surface, nothing under protocol/, no literal, code or message text; guarantee: none changed: the two tests re-assert a property under test (cancellation observed within docs/08's 100 ms with the row-group mechanism in the path), every assertion, message, name and ignore reason keeps its text, and the lock is taken once, before each trial loop and outside both timed intervals, and is uncontended in the one-at-a-time runs kernel/RESULTS.md records, so no property changes and no figure is re-taken; the five-line form stands under §36, which sets round 25, item 2 (e) aside.
```

## Notes (mine)

### 1. The choice: a lock, in the sibling's shape

**The site at 82f497b1.**
- `cancellation_holds_with_pruning_in_the_path` (kernel/tests/first_batch_factorial.rs:1299-1301 @ 82f497b1) and `cancellation_holds_with_pruning_in_the_path_on_h5` (:1433-1435) are both `#[ignore]`d and both call `refuse_debug` first (:1302, :1436; kernel/tests/support/mod.rs:341-348 @ 82f497b1).
- Each runs 7 trials (:1313, :1447). Each trial calls `trace::start(...).expect("no other trace is running")` (:1321-1325, :1455-1459) and drops the guard explicitly at the end of the trial (:1357, :1491).
- Both run in-process on purpose (:1296-1298).

**The facility at 82f497b1.**
- `ENABLED` is one process-global `AtomicBool` (engine/src/trace.rs:88 @ 82f497b1), and `CURRENT` is the single slot (:98).
- `start` returns `None` while the slot is full; otherwise it fills the slot and then sets the flag (:329-339).
- `TraceGuard`'s Drop clears both (:353-358).
- `TraceKey` derives `Default` (:119-120). The sibling form's pin at :767 is historical; the tree is authoritative here.
- `CancelToken::cancel` stamps `CANCELLATION_REQUESTED` through `mark` (engine/src/cancel.rs:120-124 @ 82f497b1).

**Who else in this binary reads the flag.**
- No test calls `is_enabled`. The flag is read inside the engine, by `mark` on the stream and cancel paths, wherever this binary opens or streams a dataset in-process:
  - the driver (:849-850, :890);
  - `the_5gb_clustered_cell` (:1132-1133, :1170);
  - `the_5gb_spot_cells` (:1587-1588, :1606);
  - the two cells.
- Only the two cells start a trace in-process.
- `night_trial_child` starts one only when both env vars are set (:446-449, :507-515). `spawn_trial` sets them only on a child process it runs with `night_trial_child --exact` (:1721-1730). So the factorial trials are one process each, and outside the race.

**The race.**
- The two cells overlap only if one invocation selects both, for example a bare `--ignored`. libtest then runs them as threads of one process.
- Between any two trials of one test, the other can take the slot. The next `start` is then refused and its `expect` panics.
- That is a loud failure, never a silent pass. It is the 0.5 (c) shape of the sibling form.
- It has not been observed failing. §0.7 of the sibling form records it as a code reading.

**Which option the node and the ruling ask for.**
- The ruling, item 6 (state/directives/2026-10-09-rulings-on-the-eight-forms.md:52 @ 82f497b1), defers the choice to placement. The node's summary (PLAN.yaml:4469 @ 82f497b1) allows either a lock or a stated one-at-a-time rule.
- The node's title, and the class §0.7 defines, name the defect as "no shared lock". The sibling piece settled a lock: §2's C1 and C2, landed at kernel/tests/wire_bytes_invariant.rs:183-187 and :191 @ 82f497b1, the same shape as kernel/tests/trace_spans.rs:145-149 @ 82f497b1.
- I recommend that lock, byte-shaped like the sibling's (OPEN-1). A stated rule would be a comment that nothing enforces, beside two other files that enforce a lock.

**Placement.**
- The `static` and `fn serial()` go after `the_5gb_clustered_cell` and above the doc comment of `cancellation_holds_with_pruning_in_the_path` (:1279-1281).
- Neither is `pub`, and no other item is added.
- `let _serial = serial();` is the first statement of each body, before `refuse_debug`. It is a named binding, so it lives to the end of the body.
- A debug-build panic in `refuse_debug` poisons the lock, and `into_inner` recovers it.
- On a panic inside a trial, the live `guard` unwinds before `_serial`, so the slot is empty before the lock is released.

**docs/08 and recorded figures.**
- Figures rest on these tests: kernel/RESULTS.md:3244 @ 82f497b1 (S, 7 of 7 within the budget) and kernel/RESULTS.md:4529 @ 82f497b1 (H5, 7 of 7). Both are scored against docs/08's 100 ms cancellation budget (docs/08_Testing.md:8 @ 82f497b1).
- Both are property re-assertions and not scored cells. No gate verdict rests on them (kernel/RESULTS.md:3235-3236 and :4513-4515 @ 82f497b1).
- Both were taken one at a time: :3560 uses `--exact ... --test-threads=1`, and :4653-4654 uses `--exact`.
- The lock is taken once, before the trial loop. The timed intervals are measured inside the loop: the `requested` Instant (:1342, :1476) and the trace segment (:1353-1356, :1487-1490).
- So the change cannot move a figure taken alone. No figure is re-taken and none is claimed.

**The doc words for `serial()`** (W1). This is not the human's wording; it is a doc comment. The worker applies it as written, wrapped at 100 columns without changing a word:

> /// **The trace flag and slot are process-global, and the two cancellation cells below start their
> /// traces in this process.**
> ///
> /// `spatial_engine::trace` holds one flag and one slot, and `trace::start` refuses a second trace
> /// rather than replacing the first: the declared one-traced-stream limit. The factorial cells start
> /// theirs in a child process each (`night_trial_child`), but `cancellation_holds_with_pruning_in_the_path`
> /// and `cancellation_holds_with_pruning_in_the_path_on_h5` start one per trial in this process and
> /// `expect` it, so an invocation that runs both can have one refused by the other. Each takes this
> /// lock as its first statement and holds it to the end of its body, so the two take turns; the
> /// refusal is kept. Locals drop in reverse order, on a panic too, so a live `TraceGuard` has stopped
> /// its trace before the lock is released. The lock orders these two tests only: the other ignored
> /// passes run unserialised beside them under a bare `--ignored`, and `kernel/RESULTS.md`'s commands
> /// run each of these two alone with `--exact`.
> ///
> /// RECORDED MUTATION: <after the observation: the M-1 insertion; each test's name and the message it failed on; the 40-hex commit it was observed at>

Each clause checked against the code at 82f497b1:
- "one flag and one slot … refuses a second trace": engine/src/trace.rs:88, :98, :329-333. Holds.
- "a child process each (`night_trial_child`)": :446-451 and :1721-1730. Holds.
- "start one per trial in this process and `expect` it": :1313, :1321-1325, :1447, :1455-1459. Holds.
- "can have one refused by the other": follows from the two clauses above. It says "can", not "will".
- "first statement … to the end of its body": this is what the change makes true; the gate checks it.
- "Locals drop in reverse order, on a panic too … stopped its trace": the Rust drop order, plus :353-358. Holds.
- "the other ignored passes run unserialised": the three other `#[ignore]`d tests (:766-768, :1046-1048, :1560-1562) take no lock. Holds.
- "`kernel/RESULTS.md`'s commands run each of these two alone with `--exact`": kernel/RESULTS.md:3560 and :4653-4654. Holds.

The doc carries no path:line cite, the sibling's §8 item 8 applied here.

### 2. The test, the mutation, and the observation

**Can the race be shown deterministically?** No, not as a failure without the lock. The two tests overlap only under libtest's thread scheduling, after a 145 MB or 5 GB open and an index build. The lock's effect is therefore argued, as in the sibling's §2:
- these are the only in-process trace starters (note 1);
- both take `serial()` first, and the Mutex has one holder;
- the guard drops before the lock.

**What M-1 shows.** It is deterministic and needs no concurrency. A test run alone takes the lock, and the forgotten trace fills the slot. The test's own `start` is then refused, and its `expect` panics with `no other trace is running`. That proves the lock is on each body's path and that the refusal is kept. It is not an observation of the race itself, and the form claims no more.

**The observation needs the ignored tests run.**
- CI never runs them: product-ci-rust.yml:225 and :234 @ 82f497b1 run no `--ignored`, and a debug build stops at `refuse_debug`.
- Each test needs a release build and its fixture:
  - S for the first test (:1304-1308);
  - H5 for the second (:1438-1442).
- `evidence_dir()` is `<root>/target/slice-evidence/first-batch`, taken from `CARGO_MANIFEST_DIR` (:91-98). It does not follow `CARGO_TARGET_DIR`.

**The route** (OPEN-2 (A), my recommendation):
1. Use a `git archive` export of the branch's code commit, outside the repository's tree. Do not use the main checkout, because the unmutated runs write `first-batch-cancel.json` and `import-layout-cancel-h5.json`, which would overwrite the run-of-record raw artifacts (kernel/RESULTS.md:3577 and :4543 @ 82f497b1).
2. Copy S, and H5 if present, from the main checkout's `target/slice-evidence/first-batch/` into the export's. Check S's sha256 against `fe61e704fcc01d40…` (kernel/RESULTS.md:2988 @ 82f497b1). Record H5's size and sha256 as found.
3. Before copying H5, check that the 40 GiB disk floor holds after the copy.
4. Inside a shared hold, run each test unmutated:
   `cargo test --release --locked -p spatial-kernel --test first_batch_factorial -- --ignored --exact <name> --nocapture`
   It must pass.
5. Apply M-1, run each test alone, record the failure by name, and revert. Confirm the file matches the code commit.
6. The `RECORDED MUTATION:` line names that 40-hex code commit. It is a branch commit, named in words with no hash. The PR merges by merge commit, so the commit stays reachable from main.

**Stops:**
- a test fails unmutated (including a miss of the 100 ms budget, or an H5 plan outside :1537-1542);
- a fixture is absent or S's hash does not match;
- M-1 passes, or fails anywhere other than at the start's `expect`;
- a file outside the Scope must change.

**May not claim:**
- that the race was observed;
- any rate;
- that a bare `--ignored` run is free of cross-test stamping. The three other passes stream in-process, unserialised, and whether their stamps can reach a cell's live trace (the slice.rs shape, §0.7) is not read here;
- any timing.

### 3. The size (AUTONOMY.md:350-351 and :357 @ 82f497b1)

- My estimate is about 28 changed lines in 1 file:
  - the doc, about 16 lines;
  - the RECORDED MUTATION line, about 4;
  - the static, the fn and the blank lines, about 6;
  - the two statements.
- That is under the declared 40 and under §21c's 150 lines and 8 files.
- There is no dependency, no exposure surface and no user-visible behaviour.
- An overrun is class 6, and the Scope line is not edited (AUTONOMY.md:345 @ 82f497b1).
- The node's budget is 60 minutes (PLAN.yaml:4465 @ 82f497b1). That is plausible for one release build, the copies and four runs, but it is not measured.

### 4. Out-of-scope readings

- **ADR.** None is touched. ADR-010 rule 6 (the limit at engine/src/trace.rs:92) and ADR-018 are cited, not changed.
- **Security.** None is touched.
- **Wire.** None is touched. The test file has no protocol surface.
- **Guarantee.** I read "touched" as "changed", per the settlement in note 4 of kernel/KERNEL-CLOSE-DURING-OPEN-ADMISSION-PREREGISTRATION.md. The two tests pin a property under test (AUTONOMY.md:325-327 @ 82f497b1).
  - Unlike the sibling's untraced-baseline argument (its §0.11), the lock here decides nothing about what a passing run proves. Without the lock, an overlap fails loudly at `expect` and never passes silently.
  - With the lock, a run alone is unchanged.
  - So the property as tested is unchanged.
- **The form.** §36 sets round 25, item 2 (e) aside (AUTONOMY.md:482 and :692 @ 82f497b1), so the five-line form stands either way.
- **Owed records.** No KNOWN-LIMITATIONS item is owed: the piece is test only. No kernel/README.md line is owed either, and #241 holds that file.

### 5. Rule (00), path by path

This piece's paths are kernel/tests/first_batch_factorial.rs and the form on main. I propose the form path kernel/FIRST-BATCH-FACTORIAL-IGNORED-TRACE-TESTS-PREREGISTRATION.md.

| In flight | Overlap |
|---|---|
| slot 2, 1c step 1 | none. The test file uses `spatial_engine` and `support` only; kernel/src/lib.rs is not consumed. |
| port-2 | none. Contact: it edits engine/src/lib.rs and engine/src/lod.rs, a compile-level contact at most, not a path. |
| #259 | none (kernel/tests/session_generation.rs) |
| #258 | none (kernel/src/skp.rs) |
| #257 | none |
| #252 | none. Contact: it edits engine/src/dataset.rs, where `Dataset::open` and the pruned stream live. If it merges first, the observation's base includes it. That is not a path overlap. |
| #249, #244 | none |
| #241 | none. This piece edits neither kernel/README.md nor kernel/tests/support/mod.rs. |

- The paths are disjoint.
- Nothing is under protocol/.
- The path lists are the brief's; I cannot read branches.

## OPEN items

**OPEN-1: the choice.**
- (A) The lock in the sibling's shape (note 1). This is my recommendation.
- (B) A stated one-at-a-time rule only: a doc sentence, with nothing enforcing it.
- (C) The lock taken by all five ignored tests. This goes beyond the node and the ruling, which name the two; I reject it.

**OPEN-2: the observation route.**
- (A) Both tests observed on an export with S and H5 copied in, with the disk floor checked first (note 2). This is my recommendation. Fall back to (B) if H5 is absent or the floor would be crossed.
- (B) Only the first test observed, with S copied in (145 MB). The second test's M-1 is a reading, recorded as not observed and never as observed.
- (C) Neither test run. Both mutations are readings, and the form claims the argument only.

## What I could not settle

- **Whether the fixtures exist.** Glob found no `.parquet` under the main checkout's `target/slice-evidence/first-batch/` or `scale-pass/`. Glob may not list gitignored paths, so absence is not established. engine/tests/lod_tier_builder.rs:62 @ 82f497b1 names G5 at the main checkout's absolute path. The worker's first step settles it.
- **Whether both cells pass unmutated on this machine today.** A failure is a stop.
- **Whether the release build fits 60 minutes.**
- **Whether the other ignored passes' stamps can reach a live cell trace.** Not read. It is listed as may-not-claim.
- **No sha256 anywhere in this draft.** I have no shell.

Paths read: C:\dev\spatial-ide\PLAN.yaml, C:\dev\spatial-ide\kernel\tests\first_batch_factorial.rs, C:\dev\spatial-ide\engine\src\trace.rs, C:\dev\spatial-ide\engine\src\cancel.rs, C:\dev\spatial-ide\kernel\WIRE-BYTES-INVARIANT-TRACE-FLAG-RACE-PREREGISTRATION.md, C:\dev\spatial-ide\kernel\tests\wire_bytes_invariant.rs, C:\dev\spatial-ide\kernel\tests\trace_spans.rs, C:\dev\spatial-ide\kernel\tests\support\mod.rs, C:\dev\spatial-ide\kernel\RESULTS.md, C:\dev\spatial-ide\docs\08_Testing.md, C:\dev\spatial-ide\AUTONOMY.md, C:\dev\spatial-ide\docs\PREREGISTRATION-TEMPLATE.md, C:\dev\spatial-ide\state\FILLER-QUEUE.md, C:\dev\spatial-ide\state\directives\2026-10-09-rulings-on-the-eight-forms.md, C:\dev\spatial-ide\state\directives\2026-10-24-weekend-exception-third-product-slot-placements-forms-ahead-250-click.md, C:\dev\spatial-ide\kernel\KERNEL-CLOSE-DURING-OPEN-ADMISSION-PREREGISTRATION.md, C:\dev\spatial-ide\kernel\SESSION-GENERATION-T1-T3-REOBSERVATION-PREREGISTRATION.md, C:\dev\spatial-ide\engine\tests\import_layout_fixtures.rs, C:\dev\spatial-ide\.github\workflows\product-ci-rust.yml.
