*Custodian's filing note (2026-09-28): gate 2 (architect; the re-gate after correction round 1, scoped to it) of PLAN node `watcher-first-read-on-watch-thread`. Reviewed: cut/watcher-first-read @ c7f1afb009a9be4c3a310365a63fa00f03846820 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b), transcribed from the hand-back message with the harness's two-space indent removed. The text below the rule is the agent's. On its condition C1: the observation record it names, `state/consults/2026-09-28-watcher-first-read-worker-report-2.md`, was committed to main at aeb2f3c while this gate ran. Profile paths redacted at filing (0).*

---

Reviewed: cut/watcher-first-read @ c7f1afb009a9be4c3a310365a63fa00f03846820
VERDICT: PASS

This is the architect's gate 2, re-gated after correction round 1. It is scoped to what gate 1 asked for and what the round changed. I have no shell, so I recomputed nothing. Where a fact needs a run, the reviewer's gate 2 owns it.

## 1. Is B1 resolved?

Yes.

- **The test now reaches the real function.** Test (2) calls the real `spawn_watch_thread(null_mut(), ..)` (`engine/src/watch.rs:527-586`, the test at about `:740-785`). That is the same function `arm` calls at `:643` and `:682`.
  - It matches `Err(reason)`, and on `Ok` it panics by name.
  - It asserts that the reason contains `could not arm the parent directory watch`.
- **Both failure paths are now exercised.** The test reaches the join-and-close `Err` path (`:574-584`). `arm`'s own `Err(reason) => ChecksOnly { reason }` arms (`:654`, `:695`) are single-line pass-throughs of the value the test proves.
- **Both mutations are declared in the test's doc comment:** (a) the thread-side mutation and (b) the arm-side one.
- **The Amendment records it.** The class-4 line (form line 14) records mutation (b), and the vacuity mutation from reviewer S2. Each is "observed failing by name at ad2e692 and reverted". That satisfies round 25, item 2 (c) as it applies here: a named commit, and no `verify-mutation` run called an observation.
- **The Watching assertion stands up.** Test (1)'s new `CoverageState::Watching` positive control uses the real `describe` and `DescribeRequest`, and the protocol's real `SourceCoverage.state` (`protocol/skp/src/v0/commands.rs:287-298`).

The observation record still has to be resolved; see condition C1.

## 2. Do the round's other changes stay inside the C-1 direction and the Out-of-scope line?

Yes, all of them.

- **Removing `unsafe impl Send for PendingRead`.** It is correct and strengthens the piece. The compiler now enforces C-1's property that a `PendingRead` never leaves its issuing thread. Reviewer probe (b) showed the build is clean without the impl.
- **The rewritten struct and `Drop` docs** (`:205-230`) are true of the code: `issue_read`'s only caller is `watch_thread`, and nothing captures a `PendingRead`.
- **`SendableHandle`'s new SAFETY text** (`:267-272`) describes the actual transfer into `spawn_watch_thread`'s closure.
- **`Handle`'s new SAFETY text** (`:451-454`) relies on `SourceWatch::drop` joining before it closes, which is gate 1's reading.
- **The two new SAFETY lines on `CloseHandle`** (`:558-559`, `:576-579`) are sound, and they discharge reviewer N1.
- **The step-comment note** (`:631-636`) is a paraphrase, is not presented as a quote, and does not claim to edit §2a.
- **`drop(ready)`** (`:296`, `:301`) is cosmetic and inside `watch_thread`.
- **Out-of-scope still holds:** no ADR, security or wire change, and no guarantee's text changes. No §21a category is named, so round 25, item 2 (e) is not triggered.

## 3. Does the new `RecvError` reason text breach anything?

No breach, and it is not a wire change.

- **The form's Change line.** It promises the refusal text is unchanged "on an issuing error". The issuing-error format string at `:509` is byte-identical to the one gate 1 verified. The new text at `:515-518` is on a different path: the thread ended without sending anything, so there was no issuing error. The Change line also requires `arm` to keep a synchronous outcome of either Watching or ChecksOnly. A panic is neither, so the fallback serves the Change line instead of adding to it.
- **Watcher preregistration §2a.**
  - §2a's arming-failure rule is that any arming failure returns `ChecksOnly { reason }` stating engine facts. The new text states an engine fact, the watch thread exiting unreported, and carries the `[P6 placeholder]` prefix that the §7 placeholder row covers ("arming-failure … reason prefixes").
  - It states no consequence belonging to another module, so it complies with round 7's operator-visible-text rule.
- **docs/01 principle 8.** Principle 8 (no black boxes) is served: the failure becomes an explicit, inspectable refusal instead of a panic that leaks a handle.
- **Wire.** `SourceCoverage.reason` is a free-text `Option<String>` (`protocol/skp/src/v0/commands.rs:297`). A new placeholder value in it is not a schema change. `CoverageState` and the refusal codes are untouched, so "wire none" stands.
- **Record classes.** This is a correction from a gate finding within the Change line. It is not a standing rule adding work, so it is not class 9, and no class-9 record is owed. The second class-6 line discloses it, which is enough.

## 4. Ruling on reviewer S4: does the Scope parenthetical cover the extracted helpers?

Yes, they are covered, and no record is owed. My ruling rests on the following reading, not on the file.

- **What the parenthetical does.** "arm, watch_thread and their test module only" bounds the behaviour the piece may change. It covers:
  - private items whose only product callers are `arm` or `watch_thread`, extracted from them: `SendableHandle`, `await_first_read`, `spawn_watch_thread`, and the `mpsc` import that `watch_thread`'s signature needs;
  - code whose only reason to change is theirs. `PendingRead`'s `Send` impl and its docs justified a transfer that `arm` used to perform, and `PendingRead` is now `watch_thread`'s private state.
- **The caller rule.** Every one of these items is private and has a product caller, so the caller rule is met.
- **Gate 1's N1 is superseded for this piece.** Gate 1's N1 relied on the "scope is the file" reading. For this piece, this narrower ruling replaces it. An explicit parenthetical narrowing must not be read as void.

## 5. Is the record owed for S5 / N2 the PR body's statement?

Confirmed. The record owed is the PR body's statement:

- §2a's Arming items 4–6 are superseded by this form's Change line.
- The immutable preregistration is not edited (AUTONOMY.md §22, the Immutable class).
- The statement cites by section and item, with no line cites and no quotation marks.

The code note at `:631-636` does not replace this: a comment is not the gate-read record. "Guarantee none" stands, on gate 1's reasoning: the property step 6 secured (Watching implies every read is pending) is kept by the handshake. Gate 1's N5 is also still owed in the same PR body: label the form's quoted "Hits every session in the dev app" as a paraphrase.

## 6. Are the Amendment lines right?

- **Class labels are right.** Form line 14 is class 4: a mutation added after a gate finding, with the failure recorded at a commit. Form line 15 is class 6: a short-form budget deviation. Class 8 does not apply (this is the short form), and class 9 does not apply (see section 3).
- **The figures agree with the full three-dot diff.**
  - 220 + 145 = 365, plus 121 = 486, across 2 files.
  - The `watch.rs` hunk headers sum to 231 old lines and 306 new, so the net is +75, which equals 220 − 145.
  - The test file is +121.
  - The figure is stated at ad2e692. The reviewer should confirm that no code changed between ad2e692 and c7f1afb.
- **The Scope line is unedited.** The form's hunk against main is `@@ -9,3 +9,7 @@`: additions only, with lines 9–11 as context.
- **No passage is presented as verbatim.** Line 15 restates no earlier amendment's claim: it gives a new figure.

## Blocking findings

None.

## Conditions before merge (not blocking this gate)

- **C1. The observation record does not exist yet.** Form line 14 names `state/consults/2026-09-28-watcher-first-read-worker-report-2.md` as its observation record. That file is on neither the branch nor main at c7f1afb (only `-report-1.md` exists).
  - Before merge, file it with the test name `an_invalid_handle_reports_its_issuing_error_through_the_handshake`, the failing arm, and ad2e692.
  - Or, if it is never filed, the reviewer's gate-2 re-observation becomes the observation of record under round 25, item 2 (c). The pointer is then corrected by an appended class-3 row, never by an edit.
  - The file is evidence, not Authority, so round 14's untracked-Authority rule does not bite. But it is a dangling pointer once the form is on main.
- **C2. Merge with a merge commit, never a squash,** so that ad2e692 and 0f68413, which the Amendments name, stay reachable (reviewer S6).
- **C3. The reviewer's gate 2 re-observes** mutations (a) and (b) on test (2), the vacuity mutation and the pre-fix failure on test (1), and the 486 figure. Their report is the proof for the "observed failing by name" clause (round 7).

## Notes

- **N1.** `:635`'s "(§22)" is unqualified and could be read as a section of the watcher preregistration. It means AUTONOMY.md §22. Cosmetic.
- **N2.** Class 4 says "If no second harness run was made, say the mutation was unit-only." No end-to-end harness applies to this piece. The PR body may say so in one clause.

Files:
- C:/dev/wt/watcher-first-read/engine/src/watch.rs
- C:/dev/wt/watcher-first-read/kernel/tests/watcher_first_read_windows.rs
- C:/dev/wt/watcher-first-read/engine/WATCHER-FIRST-READ-PREREGISTRATION.md
- C:/dev/wt/watcher-first-read/engine/SOURCE-WATCHER-PREREGISTRATION.md
- C:/dev/wt/watcher-first-read/protocol/skp/src/v0/commands.rs
- C:/dev/wt/watcher-first-read/docs/PREREGISTRATION-TEMPLATE.md
