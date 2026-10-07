*Custodian's filing note (2026-10-07): the architect's draft of `typed-terminal-codes-post-check-race`'s preregistration, on the custodian's brief at main 3d740f7b (the head the custodian confirmed by `git rev-parse`), drafted alone while the lead-data pilot is paused. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is f26540ea7cf8be9c579aa98f9a3df6928f80751951238a3fb25d84ff27b6f290. Write audit PASS: zero write calls (Grep 35, Read 36, SubagentHandback 1). Run window from the transcript: 2026-10-07T17:49:16.013Z to 2026-10-07T17:59:34.982Z. The form as committed, `kernel/TYPED-TERMINAL-CODES-POST-CHECK-RACE-PREREGISTRATION.md`, is part 2's block with its 43 HASH-TBD pins computed at 3d740f7b. Nothing else changed. The pins in parts 1 and 3 below are left as returned.*

---

Reviewed: main @ 3d740f7b

(I read the working tree on main. The session's git status puts it at 3d740f7b. I have no Bash, so I could not run `git rev-parse`. Please confirm the commit before you file this.)

## 1. Which form, and whether the stop condition is met

**Form: the full form, under full gating (architect and reviewer).**
- **The §21a category.** The changed test is the end-to-end proof of a stated guarantee, the post-check's rule (i): a source change found after the scan makes the typed `engine.source_changed` terminal. It also proves the round-4 seam. `engine/ADMISSION-PREREGISTRATION.md:828-834 @ 3d740f7b sha256:HASH-TBD` names this test as that proof. That is "any property currently under test" (`AUTONOMY.md:325-327 @ 3d740f7b sha256:HASH-TBD`). My 2026-10-04 drafts read a test-only change to such a test the same way.
- **Why not the five-line form.** Its `Out-of-scope` line could not say the piece touches none of the four categories, so §25(e) requires the full form from dispatch (`AUTONOMY.md:482 @ 3d740f7b sha256:HASH-TBD`).
- **Size, by §21c's rule (tests included, the form excluded).**
  - Part A: at most 80 lines, in one file.
  - Part B (conditional): at most 70 more, in one file.
  - Non-generated files: at most 4.
  - That is under the threshold. The category sets the form, not the size.
- **Where it lives.** `kernel/TYPED-TERMINAL-CODES-POST-CHECK-RACE-PREREGISTRATION.md`. The kernel index line for it is OPEN-1.

**Stop condition: not met for the fix.**
- The fix edits only `kernel/tests/typed_terminal_codes.rs`. That file is not under `protocol/`, is not a wire fixture or a lockfile, and is not in the lines cut's §7 table (`engine/GEOMETRY-LINES-PREREGISTRATION.md:500-509 @ 3d740f7b sha256:HASH-TBD`).
- The optional Part B edits `kernel/tests/session_end_event.rs`, which is not in that table either.
- **Two things do touch the condition, and the human should be told of both:**
  - **(a) The index line.** The product-first direction's section 1 has the worker update the owner's-index lines its piece changes, in the same PR (`state/directives/2026-10-05-product-first-direction.md:11 @ 3d740f7b sha256:HASH-TBD`). A new kernel form would add a line to `kernel/README.md`'s list of preregistrations in this module (`kernel/README.md:374 @ 3d740f7b sha256:HASH-TBD`). `kernel/README.md` is in the lines cut's list. The fix itself does not need it. This is OPEN-1.
  - **(b) A sibling with the same race in a lines-cut file.** `drained_stream_with_a_recorded_change` (`kernel/src/skp.rs:3349-3369 @ 3d740f7b sha256:HASH-TBD`) uses a 50-feature fixture (`kernel/src/skp.rs:3312-3328 @ 3d740f7b sha256:HASH-TBD`). It touches the file after `open_engine_stream` and asserts that the post-check found the change. It is out of scope here (finding F-1).

**Why the new order is guaranteed, from the code.**
1. The producer is spawned inside `viewport_query`, not at redeem.
   - The spawn: `kernel/src/skp.rs:1465-1471 @ 3d740f7b sha256:HASH-TBD` and `engine/src/stream.rs:1248-1265 @ 3d740f7b sha256:HASH-TBD`.
   - Redeem only moves the already-built source: `kernel/src/skp.rs:293-309 @ 3d740f7b sha256:HASH-TBD` and `kernel/src/lib.rs:446-449 @ 3d740f7b sha256:HASH-TBD`.
   - So the race window runs from `viewport_query`, through `create`, to the touch.
2. The channel between producer and consumer holds `MAX_QUEUED_BATCHES` = 2 items (`engine/src/stream.rs:82 @ 3d740f7b sha256:HASH-TBD`, `engine/src/stream.rs:1234 @ 3d740f7b sha256:HASH-TBD`).
   - Each batch is a blocking `tx.send` (`engine/src/stream.rs:2541-2552 @ 3d740f7b sha256:HASH-TBD`).
   - The consumer's only receive is `rx.recv()` in `next_into` (`engine/src/stream.rs:779-794 @ 3d740f7b sha256:HASH-TBD`).
   - So the third send cannot complete before the consumer's first receive.
3. The post-check runs only after `produce` has returned, which is after every send (`engine/src/stream.rs:1327-1337 @ 3d740f7b sha256:HASH-TBD`). Its terminal is sent after it (`engine/src/stream.rs:1340-1359 @ 3d740f7b sha256:HASH-TBD`).
4. The test touches the file before its first `next_into`, in program order.
5. Therefore, whenever the stream has at least `MAX_QUEUED_BATCHES + 1` batches, the post-check's descriptor read happens after the touch. The channel hand-off orders the two.
6. **Batch count, by arithmetic over the code.**
   - The viewport path uses the size-only policy (`engine/src/stream.rs:903-920 @ 3d740f7b sha256:HASH-TBD`, `engine/src/stream.rs:395-408 @ 3d740f7b sha256:HASH-TBD`).
   - Batch k is at most its target. The loop cuts before appending (`engine/src/stream.rs:2004-2027 @ 3d740f7b sha256:HASH-TBD`) and cuts at the target (`engine/src/stream.rs:2052-2076 @ 3d740f7b sha256:HASH-TBD`).
   - The targets are 64 KiB, then 256 KiB (`engine/src/stream.rs:449-458 @ 3d740f7b sha256:HASH-TBD`). So batches 0 and 1 hold at most 327,680 estimated bytes.
   - One row is estimated at 20·v + 12 bytes (`engine/src/stream.rs:2270-2273 @ 3d740f7b sha256:HASH-TBD`). The generator writes at least 4 vertices per row (`engine/src/fixture.rs:1251-1254 @ 3d740f7b sha256:HASH-TBD`, `engine/src/fixture.rs:1358-1369 @ 3d740f7b sha256:HASH-TBD`). So a row is at least 92 bytes.
   - 5,000 features give at least 460,000 bytes, so at least 3 batches. This holds in any row order.
   - Today's 200 features are at most 98,400 bytes, so at most 2 batches. That is why the race exists.
   - The test also asserts the count on every run, so a broken premise fails by name instead of racing.

**The existing recorded mutation is re-observed.** It is `Expected failure` only (`kernel/tests/typed_terminal_codes.rs:86-89 @ 3d740f7b sha256:HASH-TBD`). The test's inputs and its loop change, so the record owes an observation.

## 2. The draft

````markdown
# typed_terminal_codes: the real-redeemed-stream test made unable to lose its post-check race
# (PLAN node typed-terminal-codes-post-check-race)

File: kernel/TYPED-TERMINAL-CODES-POST-CHECK-RACE-PREREGISTRATION.md
Authority: the human's placement of 2026-10-07 (state/directives/2026-10-07-typed-terminal-codes-race-placed.md:6 @ 3d740f7b sha256:HASH-TBD; its RULED block in DECISIONS-PENDING.md); item 3 of the 2026-10-07 awaiting-merge direction (state/directives/2026-10-07-awaiting-merge-leaves-the-slot.md:9 @ 3d740f7b sha256:HASH-TBD); question round 25, item 1 (a); drafting: question round 43, item 2; Part B: the sibling-search default (AUTONOMY.md:415 @ 3d740f7b sha256:HASH-TBD, a sub-line span, item 14; the hash is the whole line's).
Drafted by: the architect agent, alone (the lead-data pilot is paused under the product-first direction, section 1); code read at main 3d740f7b.
Committed before any code. Append-only once committed; an amendment made after any outcome has been seen says so in its first line.
Form: full (AUTONOMY.md §21a, a property currently under test; §25(e)).

## §0. Disclosure

0.1 The failure. The test was the_data_plane_terminal_a_real_redeemed_stream_produces_carries_its_typed_code, on ubuntu-24.04 only. It panicked at its terminal expect because the stream ended clean:
  - state/consults/2026-10-05-main-ci-run-37264494821-attempt-1-failed-steps.txt:1262 @ 3d740f7b sha256:HASH-TBD
  - state/consults/2026-10-05-main-ci-run-37264494821-attempt-1-failed-steps.txt:1269-1270 @ 3d740f7b sha256:HASH-TBD
  - Attempt 2 passed on both platforms (the PLAN node's summary).

0.2 The test as it stands.
  - The whole test: kernel/tests/typed_terminal_codes.rs:79-153 @ 3d740f7b sha256:HASH-TBD
  - Its fixture, 200 features: kernel/tests/typed_terminal_codes.rs:49-64 @ 3d740f7b sha256:HASH-TBD
  - The touch, after redeem: kernel/tests/typed_terminal_codes.rs:129-131 @ 3d740f7b sha256:HASH-TBD
  - The drain and the expect: kernel/tests/typed_terminal_codes.rs:133-142 @ 3d740f7b sha256:HASH-TBD
  - Its recorded mutation, expected and never observed: kernel/tests/typed_terminal_codes.rs:86-89 @ 3d740f7b sha256:HASH-TBD
  - The other caller of fixture(): kernel/tests/typed_terminal_codes.rs:278-279 @ 3d740f7b sha256:HASH-TBD

0.3 Cause (read from code, not observed). The producer is spawned with the stream, inside viewport_query, and not at redeem.
  - The spawn: kernel/src/skp.rs:1465-1471 @ 3d740f7b sha256:HASH-TBD and engine/src/stream.rs:1248-1265 @ 3d740f7b sha256:HASH-TBD
  - Redeem moves the built source and nothing more: kernel/src/skp.rs:293-309 @ 3d740f7b sha256:HASH-TBD and kernel/src/lib.rs:446-449 @ 3d740f7b sha256:HASH-TBD
  - With one batch, the producer can send it into the free queue, run its post-check (engine/src/stream.rs:1327-1337 @ 3d740f7b sha256:HASH-TBD) and end clean before the test touches the file.
  - The PLAN summary names redeem as the spawn point. This corrects it.

0.4 Siblings (the sibling-search default).
  - E2: kernel/tests/session_end_event.rs:150-193 @ 3d740f7b sha256:HASH-TBD. It has the same race, with 300 features (kernel/tests/session_end_event.rs:33-46 @ 3d740f7b sha256:HASH-TBD). This is Part B.
  - E3: kernel/tests/session_end_event.rs:206-253 @ 3d740f7b sha256:HASH-TBD. It has the same race, and also one between its cancel and the producer's end. This is Part B.
  - kernel/src/skp.rs:3349-3369 @ 3d740f7b sha256:HASH-TBD has the same race. The file is in the lines cut's §7 list (engine/GEOMETRY-LINES-PREREGISTRATION.md:504 @ 3d740f7b sha256:HASH-TBD), so it is out of scope here and routed as a proposed node.
  - E4's sleep (kernel/tests/session_end_event.rs:301-304 @ 3d740f7b sha256:HASH-TBD) is a different shape, on a path the product declares best-effort. It is out of scope.

0.5 Budget. The node declares 45 minutes, and the full form and its gates exceed that. The custodian records the deviation in PLAN. It is not a §7 figure.

## §1. May and may not claim

- May claim: in every run where the test's batch-count assertion holds, the post-check reads the source after the touch, by §2's ordering argument.
- May not claim:
  - that CI's failure was observed to have this cause; M-2 shows consistency, not cause;
  - any timing, duration or performance number;
  - any change to product behaviour;
  - anything about the skp.rs sibling or E4.
- No ADR is cited as amended, and none is amended. No wire, SKP, MCP or data-plane change.

## §2. The change

Part A: kernel/tests/typed_terminal_codes.rs only.
- A1. A helper fixture_with_features(name, features), with fixture()'s spec and the feature count passed in. fixture() keeps its 200 and its exact output, either by delegating or by being left untouched.
- A2. The end-to-end test uses fixture_with_features("terminal-carries-code", 5_000).
- A3. The drain loop counts Ok batches and clears buf per batch.
- A4. Immediately after the loop, and before the terminal expect, it asserts batches > MAX_QUEUED_BATCHES. The constant is imported from spatial_engine (engine/src/lib.rs:146-152 @ 3d740f7b sha256:HASH-TBD). The message says the ordering argument needs at least that many batches.
- A5. The comment at the touch, and the test's doc, state the ordering argument below by symbol name. The doc gains M-1's line.
- No sleep, no timeout used to synchronise, and no timing assertion (question round 25, item 1 (a)).

Why the order is guaranteed:
- The queue holds MAX_QUEUED_BATCHES items: engine/src/stream.rs:82 @ 3d740f7b sha256:HASH-TBD and engine/src/stream.rs:1234 @ 3d740f7b sha256:HASH-TBD
- Each batch is a blocking send: engine/src/stream.rs:2541-2552 @ 3d740f7b sha256:HASH-TBD
- The consumer's only receive is next_into's recv: engine/src/stream.rs:779-794 @ 3d740f7b sha256:HASH-TBD
- The post-check runs after produce returns, and the terminal follows it: engine/src/stream.rs:1327-1359 @ 3d740f7b sha256:HASH-TBD
- So with at least MAX_QUEUED_BATCHES + 1 batches, the third send completes only after the test's first next_into, and the test touches the file before that call.

Why 5,000 features give at least 3 batches (arithmetic over the code):
- Batch k is at most target_for(k):
  - the cut before append: engine/src/stream.rs:2004-2027 @ 3d740f7b sha256:HASH-TBD
  - the cut at the target: engine/src/stream.rs:2052-2076 @ 3d740f7b sha256:HASH-TBD
  - the size-only policy on this path: engine/src/stream.rs:903-920 @ 3d740f7b sha256:HASH-TBD and engine/src/stream.rs:395-408 @ 3d740f7b sha256:HASH-TBD
  - target_for(0) + target_for(1) = 327,680 bytes: engine/src/stream.rs:449-458 @ 3d740f7b sha256:HASH-TBD
- A row is at least 92 bytes:
  - the estimate is 20·v + 12: engine/src/stream.rs:2270-2273 @ 3d740f7b sha256:HASH-TBD
  - at least 4 vertices per row: engine/src/fixture.rs:1251-1254 @ 3d740f7b sha256:HASH-TBD and engine/src/fixture.rs:1358-1369 @ 3d740f7b sha256:HASH-TBD
- 5,000 × 92 = 460,000 > 327,680, in any row order.
- Today's 200 features are at most 200 × 492 = 98,400 bytes: at most 2 batches.

Part B (conditional on OPEN-2): kernel/tests/session_end_event.rs, E2 and E3 only.
- B1. A helper fixture_with_features(name, features) beside fixture(). fixture() and every other test are unchanged.
- B2. E2 uses 5,000 features, counts its batches, and asserts batches > MAX_QUEUED_BATCHES before its terminal expect.
- B3. E3 uses 20,000 features, enough for at least MAX_QUEUED_BATCHES + 2 batches (20,000 × 92 = 1,840,000 > 1,376,256, the first three targets).
  - The producer is blocked on its third send, which is not its last, until E3's first next_into. That call comes after E3's touch and cancel.
  - After that send, every path to produce's Ok return passes a cancel check:
    - the loop top: engine/src/stream.rs:1881-1885 @ 3d740f7b sha256:HASH-TBD
    - the row: engine/src/stream.rs:1971-1985 @ 3d740f7b sha256:HASH-TBD
    - flush: engine/src/stream.rs:2522-2527 @ 3d740f7b sha256:HASH-TBD
  - So the terminal is Cancelled, and the post-check, which runs after the touch, still records the change.
  - E3 cannot count its delivered batches usefully. A fixture too small to hold its batches ends with source_changed, or with no terminal at all. Either fails E3's existing assertions by name.

Portability (state/directives/PORTABILITY-2026-09-30.md):
- R1: the argument rests on std's bounded channel and is platform-independent.
- R2 to R4: no OS-dependent feature and no cfg.
- R5: no level is claimed.
- R6: nothing is ignored on any platform.

## §3. Fixtures

- Part A: fixture_with_features("terminal-carries-code", 5_000): avg_vertices 12, NativeUnique, the rest default.
- Part B: E2 at 5,000 and E3 at 20,000, with session_end_event's own spec (avg_vertices 10, hole_every 0).
- All are seeded and generated per run under target/fixtures. They are not the 5 GB fixture and not wire fixtures.

## §4. Tests and mutations

Each mutation is applied, the named test is run alone, its failure is recorded by name with the commit id, and the mutation is reverted. A verify-mutation run is never called a mutation's observation (round 25, item 2 (c)).
- M-0, the existing mutation, re-observed. At kernel/src/lib.rs:684 @ 3d740f7b sha256:HASH-TBD, replace skp::terminal_detail_of(&e) with e.to_string(). The end-to-end test fails at its prefix assertion.
- M-1, for A4. 5_000 → 200 at the test's call. It fails at the batch-count assertion, deterministically: at most 2 batches (§2).
- M-2, an observation, not a test of record. Move touch_modification_time(&path) after the drain loop. It fails at the terminal expect, with the message at the CI log's line 1270.
- M-B2, for B2. E2's 5_000 → 300. It fails at E2's batch-count assertion: 300 × 312 = 93,600 bytes, so at most 2 batches.
- M-B3, for B3. Move E3's cancel.cancel() after its drain loop. It fails at E3's assertion that cancellation keeps its own terminal, because the terminal is engine.source_changed.

## §5. Predictions · unchanged · invalidators · falsification

Predictions:
- P-1: `cargo test -p spatial-kernel --test typed_terminal_codes`, 20 runs: 20 of 20 pass.
- P-2: M-0, M-1 and M-2 each fail as §4 states, in each run.
- P-3 (Part B): `--test session_end_event`, 20 runs: 20 of 20 pass. M-B2 and M-B3 fail as §4 states.

Declared unchanged:
- every product line: no diff under engine/, protocol/, frontends/ or kernel/src;
- fixture()'s output for its other callers, in both files;
- every other test, E1, E4 and E4's sleep included;
- touch_modification_time;
- the prefix and prose assertions;
- no new pub item, constant, dependency, cfg or ignore.

Invalidators:
- With 5,000 or 20,000 features, the batch-count assertion fails, or E3 ends with source_changed. §2's arithmetic is then wrong: stop, and record a class-1 amendment.

Falsification:
- Any run with batches > MAX_QUEUED_BATCHES and a clean end, or a missing terminal, falsifies §2's ordering argument.

## §6. Instruments

All assertions are structural: the batch count, the terminal's code, and the event's reason. No figure is measured or printed.

## §7. Declared values and ceilings

- Part A: at most 80 changed lines, all in kernel/tests/typed_terminal_codes.rs.
- Part B: at most 70 changed lines, all in kernel/tests/session_end_event.rs.
- Counted by §21c's rule (insertions plus deletions): git diff --numstat B H -- kernel/tests/typed_terminal_codes.rs kernel/tests/session_end_event.rs, with B = git merge-base origin/main H named in the PR body.
- Non-generated files: at most 4. They are this form, PLAN.yaml, typed_terminal_codes.rs, and session_end_event.rs under Part B.
- Feature counts 5,000 and 20,000: literals at their sites, each bounding a minimum batch count by §2's arithmetic. No new constant.
- An overrun is class 8, and this section is never edited.

## §8. Block-on-sight

1. Any code before this form is committed with the custodian's hashes.
2. Any edit:
   - under protocol/;
   - to a wire fixture, Cargo.lock or package-lock.json;
   - to any file in the lines cut's §7 list (engine/GEOMETRY-LINES-PREREGISTRATION.md:500-509 @ 3d740f7b sha256:HASH-TBD), kernel/README.md included (OPEN-1).
   On such a need, stop, and the human is told.
3. A diff outside §7's files and the generated set.
4. A sleep, a timeout used to synchronise, or a timing assertion in a changed test.
5. A path:line cite in a code comment into engine/src or kernel/src. Those files are the lines cut's, so name the symbol instead.
6. The batch-count assertion placed after the terminal expect.
7. fixture()'s output changed for any other caller; any other test changed.
8. A claim that the flake is "fixed" beyond §1, or that CI's cause was observed.
9. Part B code before OPEN-2 is settled.
10. The round-25 items, by name:
    - a §7 overrun not recorded as class 8, or §7 edited to match;
    - a scope addition not recorded as class 9, or its code before its amendment;
    - a verify-mutation run called a mutation's observation;
    - a test-text span on an unmerged branch pinned by hash at a branch commit, or named without its commit id.

## §9. Gates

- Architect and reviewer (§21a; §25(e)). Verdicts follow AUTONOMY.md §22 as the product-first direction's section 2 replaced it (state/directives/2026-10-05-product-first-direction.md:15 @ 3d740f7b sha256:HASH-TBD): block only on Correctness or Evidence. Documentation findings are fixed in this PR before the merge.
- Architect: §2's ordering argument against the cited sites; §8 item by item; §1.
- Reviewer:
  - the full diff;
  - M-0, M-1, M-2, M-B2 and M-B3, each observed by name with the commit id;
  - P-1 and P-3.
- Suites:
  - `cargo test -p spatial-kernel --test typed_terminal_codes`, and `--test session_end_event` under Part B;
  - the workspace, by CI;
  - node --test scripts suite; verify-plan; verify-cites; verify-quotes; verify-test-claims.
- Heavy runs follow the machine paragraph the briefs carry (state/directives/2026-10-06-machine-script-adopted.md:12-22 @ 3d740f7b sha256:HASH-TBD).
- Operator: none.

## §10. Amendments

(opens empty)
````

## 3. OPEN items

**OPEN-1: the kernel index line for this form.**
- **The conflict.** The product-first direction, section 1, puts owner's-index updates in the piece's own PR. The human's stop condition rules out `kernel/README.md` while the lines cut is in flight. The fix needs neither.
- **Options:**
  1. The custodian adds the line in this piece's closing record, after the lines cut has merged. The form declares the deviation now.
  2. This PR adds it after the lines cut merges and main is merged in. This PR then waits.
  3. The form lives outside `kernel/`. I do not recommend this.
- **Recommendation:** (1). Nothing waits, and a closing record needs no slot (awaiting-merge direction, item 5).
- **Red line:** no. The human asked to be told, so the custodian reports it.
- **What waits:** under (1), only the index line. Under (2), this PR's merge.

**OPEN-2: Part B, siblings E2 and E3.**
- **Options:**
  1. Include them, under the sibling-search default (Appendix A, item 14).
  2. Route them as a separate proposed node.
- **Recommendation:** (1). They are the same race in the same shape, in a file outside the lines cut's list, and the default covers them.
- **Red line:** not on my reading. If the custodian follows the timing-assertions precedent, where a scope change to a ruled item was asked as a hold, it is asked in typed words, and Part A proceeds meanwhile.
- **What waits:** Part B's code only.

**Findings, to be recorded as proposed nodes (the freeze allows this).**
- **F-1.** `kernel/src/skp.rs:3349-3369`'s helper has the same race. It goes after `geometry-lines-cut`.
- **F-2.** The doc of `Dataset::stream` (`engine/src/stream.rs:895-896 @ 3d740f7b sha256:HASH-TBD`) says the call returns once the statement is prepared, and that the first batch is produced on the first `next_into`. The code contradicts both:
  - prepare runs on the producer thread (`engine/src/stream.rs:1781-1783 @ 3d740f7b sha256:HASH-TBD`);
  - the producer runs ahead up to the queue bound.
  - This is a behaviour claim the code does not support. It goes after the lines cut, which holds `stream.rs`.
- **F-3.** The PLAN summary names redeem as the spawn point. PLAN is a current-state summary, so the custodian corrects it in place.

## 4. Files read (at 3d740f7b)

- `C:\dev\spatial-ide\PLAN.yaml` (the node)
- `C:\dev\spatial-ide\state\directives\2026-10-07-typed-terminal-codes-race-placed.md`, `...\2026-10-07-awaiting-merge-leaves-the-slot.md`, `...\2026-10-06-machine-script-adopted.md`, `...\2026-10-05-product-first-direction.md`
- `C:\dev\spatial-ide\DECISIONS-PENDING.md` (the 2026-10-07 RULED block; round 25 by grep; line 1047)
- `C:\dev\spatial-ide\state\questions\round-25.md` (1-18)
- `C:\dev\spatial-ide\state\consults\2026-10-05-main-ci-run-37264494821-attempt-1-failed-steps.txt` (1-236, 1255-1281)
- `C:\dev\spatial-ide\kernel\tests\typed_terminal_codes.rs` (whole)
- `C:\dev\spatial-ide\kernel\tests\session_end_event.rs` (20-319), `session_generation.rs` (330-439), plus grep over `session_reference.rs` and `source_watch_windows.rs`
- `C:\dev\spatial-ide\kernel\src\lib.rs` (240-719), `kernel\src\skp.rs` (200-319, 1372-1521, 3300-3419, 4630-4719)
- `C:\dev\spatial-ide\engine\src\stream.rs` (40-459, 760-959, 1130-1429, 1700-2117, 2234-2273, 2420-2569), `engine\src\lib.rs` (80-152), `engine\src\fixture.rs` (430-599, 1240-1269, 1358-1370)
- `C:\dev\spatial-ide\engine\GEOMETRY-LINES-PREREGISTRATION.md` (§7, 487-546)
- `C:\dev\spatial-ide\engine\ADMISSION-PREREGISTRATION.md` (815-854; grep)
- `C:\dev\spatial-ide\kernel\README.md` (340-379)
- `C:\dev\spatial-ide\AUTONOMY.md` (§21-§22, §25, Appendix A)
- `C:\dev\spatial-ide\docs\PREREGISTRATION-TEMPLATE.md` (whole)
- `C:\dev\spatial-ide\state\consults\2026-10-04-timing-assertions-under-contention-architect-draft.md`, `...\2026-10-04-timing-tests-assert-property-not-budget-architect-draft.md`

I made no write-capable call. The quotation marks in this report enclose code tokens only. Every account of a ruling or a document is my paraphrase, cited by round and item or by path:line.
