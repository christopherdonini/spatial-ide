Reviewed: PR #337 at c351ddb8055c89fde6b6bb8e319c6347a581077d (the custodian's filing note, 2026-11-19: the architect, one of PR 337's two gates under the full form (Amendment 36 item 13), attempt 2, limited to E1 and the O1 fix by reading (ADV-2026-11-19-15 item 1); Read 14, Grep 6, SubagentHandback 1, one errored, model claude-opus-5-5, from 2026-11-19T11:05:12Z to 11:08:55Z by its transcript; the report below byte for byte from its hand-back of 11554 bytes, sha256 f7e3c0b50512151e55cc277e0562a394c28549e01a06a07f83c09853b93e69fc, nothing masked, with this note in its first line and one final newline), gate, architect
Reviewed: PR #337 at c351ddb8055c89fde6b6bb8e319c6347a581077d, gate, architect, attempt 2
Verdict: PASS WITH NOTES
cut/b2-piece-1c-p3a-2 @ c351ddb8055c89fde6b6bb8e319c6347a581077d (I read the worktree the brief names as checked out at H. I have only Read, Grep and Glob, so I ran no git, cargo or hash.)

This attempt covers only E1 and the O1 fix (ADV-2026-11-19-15 item 1). Attempt 1 and the reviewer's gate stand for everything else.

## Findings by class

**Correctness.** None.
- The O1 fix moves five lines. Nothing written to disk comes before them at H. `locations_to_bytes` is pure (`kernel/src/project/store.rs:458-471 at H`).
- docs/01 holds: a cancel still ends the call.
- ADR-006 holds: a refusal now writes less, not more.
- No new `pub` item is added. K-O25 calls the real `Projects::open_project`, so the seam rule holds.

**Evidence.** None. E1 is closed (answer 1 below).

**Documentation.** Each item must be fixed before the merge, in the closing amendment. No re-gate is needed. None of this is the human's wording.
- **N1. Two reply orderings follow from Amendment 41 item 3 (a), and item 3 (b) does not declare them.** They are the reviewer's A1 and the worker-high's OFF-SCOPE note. The closing names them, so that item 3 (a)'s "nothing else changes order" is read as covering code lines, not reply order. Draft A. Which class it goes under is the advisor's call.
- **N2. K-O25 has no catalog assertion.** Amendment 36 item 7 (b)'s general bullet asks every case that opens nothing to assert that the catalog holds no entry for it. The closing discloses the gap. Draft B. Whether that bullet binds a row declared later is the advisor's call.
- **N3. The E1 sentence in the closing says no more than Amendment 40 item 5 allows.** K-O19's two assertions after the step (`kernel/tests/project_reopen.rs:1682-1686 at H`) have still not been seen failing under any mutation. Draft C.

## Answers

### 1. E1: closed

- **Is the reviewer's 7(b) mutation my option (a)?** Yes.
  - Its diff adds one line, `state.open(open).bound = Some(project.clone());`, just before the `return Err` in the item 5 (g) arm (`kernel/src/session_history.rs:374-377 at H`).
  - That is the line and the place that option (a) named in my attempt 1 report.
  - The worker's run under Amendment 40 applied the same line in the same place (its report, the mutation diff line).
- **Does K-O19's failure meet my prediction?** Yes.
  - Both runs panic at `kernel/tests/project_reopen.rs:610:40`. That is `Run::opacity_step`'s `expect("recorded")`, called from `:1680`.
  - The error is `create`'s `create_dir` refusing the folder that exists, os error 183 (`kernel/src/session_history.rs:480-482 at H`).
  - The mark assertion at `:1679` comes before `:1680`, so it held.
  - K-O18 failed at `:1655` with `Withheld(NoStepRecorded)`. That fits a failure at its second save. Neither run's output shows which pass of the loop failed, and Amendment 41 item 1 already records this.
- **Is this evidence for option (i)'s outcome, and not only for K-O18's claim?** Yes, for one part of it.
  - The mutation leaves K-O18's claim true: the save is still withheld as unwritable, and `:1679` passed.
  - It breaks only option (i)'s mechanism: the open is no longer left unbound in the 5 (g) arm.
  - K-O19 caught that at its step. So K-O19's step does depend on the open staying unbound, which sends its first step to a record of its own and not to the leftover project folder.
  - Not covered: the two assertions after the step (the leftover's bytes at `:1682`, and the count of the open's own records at `:1683-1686`). They are never reached under this mutation. `create_dir` refuses before it writes anything, so under this mutation the leftover could not change in any case.
- **Is anything still owed?** Only N3: the closing claims no more than Amendment 40 item 5's sentence. No further run is owed.

### 2. The O1 fix (ADV-2026-11-19-15 item 3; Amendment 41 items 3 to 5)

- **(a) The check now runs before the lock, with step 2, where nothing is written.** True.
  - `let uri` and `let relinked` are at `kernel/src/project/mod.rs:681-685 at H`. That is after step 2's match (`:669-680`) and before `ProjectLock::try_lock` (`:687`).
  - Everything before it only reads or builds values in memory:
    - `read_bounded` and `machine_document` read files;
    - `with_same`, `moved_to`, `mint_identity`, `to_bytes` and `write_project` build values;
    - `begin_open` registers the cancel key in memory.
- **Are its bytes kept for step 6?** Yes. `relinked` is consumed at `:752` and written at `:762`.
- **Does anything else change order?**
  - No other code line moves. The reviewer's byte comparison and the worker's 5 added and 5 removed lines agree with my reading.
  - The check now comes before every fallible step it crossed. In order, these are:
    1. `try_lock`, Held (`:688`). Declared in item 3 (b).
    2. `try_lock`, an I/O error, which becomes `MachineStore` for `open.lock` (`:689-692`). Declared, as a machine-store failure of step 3.
    3. The `folders.json` write (`:697-698`). Declared.
    4. A copy's `replace`, which gives `ProjectFileUnwritable` (`:701`). **Not declared.**
    5. `read_lineage` (`:706-710`). It returns a value, not an error, so no reply order changes.
    6. `live()` after the lineage read, which gives `Cancelled` (`:711`). **Not declared.**
  - So the two orderings named by the reviewer's A1 and the worker-high are the only undeclared ones.
  - Both follow necessarily. Any place before the lock, which item 3 (a) requires, comes before `:701` and `:711`.
  - Both write strictly less. At b5c35156 each of those replies came after the lock and step 3's writes. At H the call returns at `:683` with nothing written. The reply also changes: a refused re-link now wins over a replace failure or over a cancel that lands between `:669` and `:711`.
  - Ordinary use cannot reach either case: a cancel would need timing inside one call, and a replace failure would have to coincide with a refused re-link. `open_project` has no product caller yet. This is N1.
- **(b) The declared consequence is true at H.** The refusal at `:683` comes before `:687-693` (the lock: held, or an I/O error) and before `:696-699` (the `folders.json` write).
- **(c) K-O25 tests both cases as item 3 (c) words them.**
  - The first reopen: the identity's whole machine folder is removed, so there is no `folders.json` (`kernel/tests/project_reopen.rs:1843-1844 at H`).
    - The refusal is named: `MachineRecordRefused` with `file == LOCATIONS` (`:1815-1818`, `:1848`).
    - No folder exists for the identity afterwards (`:1849-1851`).
  - The copy: `Answer::Copy`, reached through the question, because `known.first` holds this identity.
    - The refusal is named (`:1835`).
    - The copy's `project.spatial` is byte for byte as before (`:1836`).
    - The store's top-level listing is unchanged (`:1839`). That is stronger than "no folder for a new identity".
  - "`open.lock` is free" is implied, because no lock folder exists in either case.
  - The reviewer's A4 is outside item 3 (c)'s words, and it is not an evidence gap for the fix's claim.
    - Both refusals return at `kernel/src/project/mod.rs:683 at H`, before the engine open at `:732`. So the catalog cannot gain an entry, at H or under item 4's mutation.
    - A catalog assertion therefore could not tell the declared mutation apart. It would only add the assertion that Amendment 36 item 7 (b)'s general bullet asks for (N2).
- **(d) The reviewer's 7(c) run meets item 3 (d)'s prediction.**
  - The mutation puts the block back after the lineage `live()?`, which is b5c35156's place, after step 3's writes. The reviewer's diff against b5c35156 shows only the doc lines differ.
  - The test panicked at `:1853:5`, the final "nothing written" assertion. It named all three writes: two for the copy and one for the first reopen.
  - Both refusal assertions (`:1835`, `:1848`) therefore held under the mutation, so both cases reach their checks.
- **(f) Doc steps 2 and 5 are true at H.**
  - Step 2 (`kernel/src/project/mod.rs:596-597 at H`) names the check, the refusal by name, and the bytes kept for step 6. That matches `:681-685` and `:752`.
  - Step 5 (`:603`) says the re-link, checked at step 2, is used first. That matches `:713-714`.
  - Step 6's "a write refused" is still true for a copy, at `:755`.
- **(g) No existing test was edited.**
  - The reviewer's check 2 shows 68374441 as one appended hunk with no lines removed, and c351ddb8 touches `mod.rs` only.
  - By my read, K-O23 ends at `kernel/tests/project_reopen.rs:1796 at H` and K-O25 starts at `:1798`.
  - The reviewer's hold 4 shows every existing target passing, so stop (g) did not trigger.

## Drafts

These are closing text only. None of it is the human's wording. Each draft must be applied before the merge. The line cites name commit c351ddb8055c89fde6b6bb8e319c6347a581077d, because the words commit will shift lines in `mod.rs`. They are not hash-pinned (round 25). No comment line in the code needs new words from this attempt.

**Draft A (N1), closing text.**
New:
```
- Item 3 (a)'s move also puts a re-link the writer refuses before two replies item 3 (b) does not name: a copy's `ProjectFileUnwritable` from `replace` (`kernel/src/project/mod.rs:701` at c351ddb8055c89fde6b6bb8e319c6347a581077d) and `Cancelled` at the `live()` after the lineage read (`:711` at the same commit). Both follow from the check at `:683` coming before the lock at `:687`; in both the call now returns with nothing written. Architect attempt 2, answer 2; reviewer's gate, A1.
```
Clause check:
- "a copy's `ProjectFileUnwritable` from `replace`": `:701`.
- "`Cancelled` at the `live()` after the lineage read": `:704-711`.
- "the check at `:683` … before the lock at `:687`": as read.
- "nothing written": `:683` comes before every write (answer 2 (a)).

**Draft B (N2), closing text.**
New:
```
- K-O25 (`kernel/tests/project_reopen.rs:1810` at c351ddb8055c89fde6b6bb8e319c6347a581077d) asserts no catalog entry, against Amendment 36 item 7 (b)'s general bullet; both its refusals return at `kernel/src/project/mod.rs:683`, before the engine open at `:732`, at the same commit. Architect attempt 2, answer 2 (c); reviewer's gate, A4.
```
Clause check:
- No catalog assertion: K-O25's body (`:1810-1854`) never calls `names()`.
- `:683` comes before `:732`: as read.

**Draft C (N3), closing text.**
New:
```
- E1 (architect attempt 1) closed by Amendment 41 item 2: K-O19 failed at its step under Amendment 40 item 3's mutation, in the worker's run (`state/consults/2026-11-19-b2-piece-1c-save-and-reopen-p3a-2-k-o19-own-mutation-worker-report.md`) and the reviewer's 7(b); Amendment 40 item 5 is the whole claim. K-O19's assertions after its step are not covered by an observed mutation.
```
Clause check:
- "failed at its step": `:610:40` called from `:1680`, in both runs.
- "after its step … not covered": `:1682-1686` are never reached under the mutation.

## To the advisor

- **The class for Draft A,** since it adds to item 3 (b)'s declared consequences. It needs no change to the code.
- **Whether Amendment 36 item 7 (b)'s catalog bullet binds K-O25.**
  - If it does, adding the assertion changes test code, and K-O25 is re-run under item 4's mutation.
  - My recommendation is Draft B's disclosure instead. The property holds by reading, and the assertion could not fail under the declared mutation.
- Nothing here is red-line text.

Model: Opus 5.5 (claude-opus-5-5), as the harness reports it.
