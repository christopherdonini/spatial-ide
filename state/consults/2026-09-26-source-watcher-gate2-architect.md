*Custodian's filing note (2026-09-26): the architect gate's attempt-2 report for PLAN node `engine-source-change-watcher` at 68f5c56, filed as returned (extracted by script from the agent's hand-back; byte-identical). Everything below the rule is the agent's text, as returned, except one rooted cite to lines that exist only on the branch, on this file's line 117. A script rewrote it to the worktree path the architect read, `C:\dev\wt\source-change-watcher\` followed by the same path and lines, because `verify-cites` resolves rooted cites against main's tree. Nothing else changed.*

---

**Verdict: FAIL.** Attempt 2, `engine-source-change-watcher`, `cut/source-change-watcher` @ 68f5c56, tree read at `C:\dev\wt\source-change-watcher`.

One finding blocks. It is a one-phrase comment fix and needs no amendment. The fixes themselves are built as ruled, the K15 deviation is sound, and no red line is reached. I have no Bash: I read the commit list from the worktree's reflog (`.git/worktrees/source-change-watcher/logs/HEAD`: 2daf371, then 17 fix commits d99e71d..1fc6353, then f280f76 and 68f5c56). Everything marked "reviewer confirms" is diff-level.

## Blocking

**F1. A quotation attributed to §2b that §2b does not contain** (round 10, "a quote marked verbatim that does not match its source byte-for-byte is a gate failure by name").
- **Where:** `kernel/tests/source_watch_ordering.rs`, the doc on K6 (`a_signal_between_arming_and_admission_refuses_the_open`).
- **What it says:** `resolves_unchanged()` is deliberate "belt-and-suspenders on the sink's asynchronous callback" (§2b's own words).
- **Why it fails:** §2b has no such text, and neither does any file in `docs/` or `state/consults/`. The phrase is the kernel's own code comment in `SkpHost::open_dataset`'s refusal path.
- **Why it is in scope:** it sits in the doc block that fix item 2 rewrote ("now one refusal path (Amendment 5 item 1)"). Gate 1 missed it too.
- **Smallest fix:** remove the quotation marks and the attribution. For example: "…is a second check beside the latch's own record (`ArmedWatch::resolves_unchanged`'s doc)".

## Should-fix (fold into attempt 3)
- **S1. A frequency claim survived the B6 fix** (§1; §8 item 11; the precedent of A7's withdrawn generalisation).
  - Where: `engine/tests/source_watch_adapter.rs`, the duplicated RECORDED MUTATION doc block attached to `mod raw_win32`.
  - It still says "the one shape H3 predicts most often on this hardware". B6 corrected A6's own doc only.
  - Fix: delete the duplicate block, or reword it as A6's doc reads.
- **S2. Q2's file list misses the two new placeholders** (§9 operator row).
  - Where: `frontends/shell/MANUAL-WALKTHROUGH.md` Part Q, Q2.
  - Fix item 12 put two `[P6 placeholder]` `<dt>` labels in `frontends/shell/src/admission/DescribeSummary.tsx`, and Q2 does not list that file.
  - Fix: add the file to Q2's list.
- **S3. Two tests claim to be SH7** (Amendment 5 item 3; ruling §3, "it is not SH7").
  - Where: `frontends/shell/src/streaming/viewportStreamManager.test.ts`. The doc of "notifySessionEnded ends the session exactly as a terminal does" still reads "§4, SH7".
  - Fix: relabel it as §2d's direct-call test, not SH7.

## Notes
- **N1.** `kernel/tests/typed_terminal_codes.rs`, the pre-check pin's doc: "a signal recorded before admission, which takes a different, already-pinned path". No byte pin of the pre-admission refusal exists; K6 and K15 assert the code only. No shell consumer reads those bytes, so there is no seam gap. Drop "already-pinned".
- **N2.** `liveTicketSet.ts`'s replacement cites (`kernel/src/skp.rs:1237-1250`, `:1289-1313`, `:1638`) hold at 68f5c56. `:1638` is `terminal_detail_of`'s signature line. Being bare lines, they will go stale at the next `skp.rs` edit (`kernel-generation-close-races` is next). Symbol cites would not; optional.
- **N3.** `watch.rs`, `PendingRead::drop`'s doc credits the use-after-free to "reviewer B2's flagged follow-on". It was flagged in the fix ruling §4 item 3. Nit.
- **N4.** KNOWN-LIMITATIONS items 24–28: every span marked "byte-exact" or quoted resolves byte for byte against the preregistration (§1, §2a, §2b, §5, §7, Amendment 3 item 6). Item 28's qualifier is restored. None carries a hash; these are provenance comments, not a record.
- **N5.** `verify-mutation.mjs`'s `RUST_TEST_ATTR` also matches `#[cfg(test)]`, so a `#[cfg(test)] fn` helper counts as a new test. For the custodian's queue as a tool defect, not a clause (record cap).

## 1. The fix list, item by item
All built as ruled, except where marked:
- **Unified refusal path** (`SkpHost::open_dataset`): one condition, the recorded signal or `!resolves_unchanged()`. The latch stays `PreAdmission`. The order is: guard released, `catalog.remove`, `drop(watch)`, re-lock, then refusal by kind. With no signal recorded, the fallback is `SourceCoverageLost` with a `[P6 placeholder]` detail.
  - The only code that sets `Admitted` is the two success arms.
  - Lock order holds: latch, then generations.
  - No deadlock: the guard is released before the join.
- **K15:** in-crate, with a `RacingCoverageLossWatch` that returns `false` and delivers `CoverageLost` from its `Drop`. Its four assertions are as ruled; the mark check is whole-map emptiness on a fresh registry.
- **`resolves_unchanged`'s doc contract:** doc only.
- **`watch.rs`:**
  - B1: re-check `disarming` after `issue_read` and cancel the read's own `OVERLAPPED`. Correct under both orderings of the SeqCst store/load.
  - B2: no `expect`; a failed spawn returns `ChecksOnly` with a placeholder reason.
  - Use-after-free: `PendingRead::drop` cancels its own read, never null, and synchronizes. This also makes `pending = next` safe. Every failure path drops the pending read before `CloseHandle`. A grandparent spawn failure drops a P-only `SourceWatch`.
  - `WATCH_BUFFER_BYTES` is `pub(crate)`, the re-export is gone, and the SAFETY comment is corrected.
- **E7:** its doc records §4's registered mutation, with an observation; the E1-shaped one is relabelled as a recorded extra.
- **The two `typed_terminal_codes` pins:** exact equality, the pre-check one through a real `SkpHost` and an injected post-admission `CoverageLost`. By my reading both match `terminalShapes.ts` byte for byte (reviewer confirms by run), and `terminalShapes.ts` names both tests.
- **E10:** runs through `run_with_timeout`.
- **The sink's log line:** "the advisory source watcher signalled {reason}". This is an engine fact.
- **A6's doc:** figures and comparison dropped. The `a7_` name and A7's generalisation are fixed. See S1.
- **The emitter:** logs `emit` errors, never the payload.
- **SH11:** the line is built inside `routeDatasetSessionEndedEvent` from `event.reason` and sent to `logUnknownSessionDrop`; the test asserts on the real output. The source-scan test is deleted. See §6 row 12.
- **SH7 and SH8:** routed through `routeDatasetSessionEndedEvent` and `dispatchSessionEndedToOwner` into real managers, with the `Pick` types. No new export: App.tsx's exports are the three present at gate 1 plus main's. SH7 carries the ruled assertions; SH8 asserts the in-flight tile is cancelled and `inFlightCount` is 0. See S3.
- **DescribeSummary labels:** both carry `[P6 placeholder]`.
- **events.ts:** states the payload's kind only.
- **The `.catch`:** present, and logs no payload.
- **liveTicketSet cites:** refreshed. See N2.
- **E2E:** prints bounds only. `readyAfterMs` is computed but never printed.
- **KNOWN-LIMITATIONS:** the paraphrase marks and item 28's qualifier are done. See N4.
- **SKP-V0 §4:** item 13 matches the ruling's paragraph, placed after "…exactly as `skp/0.2` and `skp/0.3` did.". Item 10 carries the ruled clause.
- **K6's comment:** now names the refusal path, but see F1.

## 2. §8 items 1–24 for this round, and §5's invalidators
- 1, 3–6, 8–10, 12, 14–21, 23 and 24 pass by reading.
  - Item 3 is cured by the unified path. The mint-race `unwrap_or(ObservedChange)` stays with `kernel-generation-close-races`' intake.
  - Item 9: every new string is marked; see S2.
  - Item 10: the new kernel and engine lines state facts.
  - Item 11 passes except S1.
  - Item 19: no reference appears in any new log line.
- Reviewer confirms by diff: 2, 7, 13 and 22.
- §5's invalidators: no test-only `pub` item. K15 reads private state in-crate; `record` and `enqueue` stay private. No new export. No crate, no feature, no lockfile change (reviewer confirms). No blocking send.

## 3. K15's deviation
- **Class 1, not class 2.** The test, its assertions and both mutations are built as registered; only the failure point differs from my prediction. This matches the SH12 miss and the E2E's W4 miss, both class 1.
- **Why the panic comes first:** the mutated order sets `Admitted` on the refusal path. The sink's `Admitted` arm then runs from `Drop`, and `invalidate` marks the dataset even with no live generation. The product's own `unreachable!` at the re-lock panics before the test's mark assertion runs.
- **What K15 proves about the mark:** its absence is proven on the shipped build by assertion only. Neither observed mutation reaches that assertion: the first fails on the code, the second on the shipped invariant.
- **The ee6fa38 order is still caught,** by the panic, which the shipped build carries. The assertion is not vacuous: the only writer of `invalidated` on this path is `invalidate`, and it marks unconditionally.
- **No further mutation is owed.** The closing amendment must not claim the mark assertion was observed under a mutation.

## 4. f280f76
- I cannot see its diff. The tree holds comment-only mutation mentions that fit its message:
  - on `racing_coverage_loss_arm` (a `#[cfg(test)] fn` the tool misreads as a test, N5), which truthfully says it carries no mutation;
  - `// Mutation: see the … RECORDED MUTATIONs above` lines, including E8's in `skp.rs`.
- Each points to mutations actually recorded, or says truthfully that none exists.
- **Accepted, and no record row is needed,** if the reviewer confirms `git show f280f76` is two comment-only additions.

## 5. Red lines
None reached, if the reviewer confirms that `git diff origin/main...HEAD -- docs/adr` and the capabilities diff are both empty. The event is still emitted only by the src-tauri emitter thread through `app_handle.emit`, to the shell's own webview. There is no MCP surface and no new capability.

## 6. The closing amendment (references and hashes only; this supersedes the fix ruling §5)
`R` is the gate-1 reviewer report and `A` my gate-1 report, both `@ 04b3680`. `G2R` is gate 2's reviewer report and `G2A` this report, each `@ <its main commit>`. Every `<RECOMPUTE>` is `git show <rev>:<path> | sed -n '<a>,<b>p' | sha256sum` over LF bytes.
1. **Class 1, the observation of record for every mutation:**
   - `R:81-116 sha256:<RECOMPUTE>`;
   - the G2R span covering K15 (both mutations), E7's registered mutation, SH7, SH8, SH11, the two pins and E10;
   - the gate-log entries by entry: dfdc8fb's, attempt 2's and attempt 3's.
2. **Class 3,** Amendment 3 item 5's last sentence, at most three sentences:
   - the defect: `verify-mutation` @ 7d24ed1 checks that a mutation is recorded and runs none;
   - the corrected reference: row 1;
   - the proof: `R:60 sha256:<RECOMPUTE>`.
3. **Class 1, H1, H2, H3 and H5:** `R:75-78 sha256:<RECOMPUTE>`. H4 is not restated.
4. **Class 1, the E2E:** `R:62-69`. The W4 miss is `R:71`, each with its hash. Add G2R's rerun span, with its report file's sha256 cited as evidence.
5. **Class 1, the budget:** G2R's final per-module figures, total and file count under §21c. Name the fold-in commits d90837d (mixed) and e372848. Gate 1's figures are `R:120-133 sha256:<RECOMPUTE>`.
6. **Class 2, SH5's equivalent mutant:** `R:102-104`.
7. **Class 2, E7's registered mutation:** observed at `R:84`, and in G2R.
8. **Class 1, SH12's prediction miss:** `A:94-96`.
9. **Class 1, advisory 6:** `A:58`.
10. **Class 1, K15's second mutation:** it fails on the shipped `unreachable!` at the refusal path's re-lock, not on the mark. The mark clause is proven by assertion only.
    - Reference by symbol, never by line: `ticket_drop_under_lock_regression::a_coverage_loss_racing_admission_refuses_with_its_own_code_and_leaves_no_mark`.
    - Plus the G2R span.
11. **Class 5 discharge of Amendment 5 item 4,** B1, B2 and the use-after-free proved by reading: the G2A §1 `watch.rs` bullet.
12. **Class 2, R-b's secondary shell check:** §4's "the listener logs no session reference" was deleted on the fix ruling's item 10. Its property is carried by "drops an event whose session does not match, and logs a line naming the reason only (SH9, SH11)" in `frontends/shell/src/App.test.ts`.
13. **Residual, the E5 pin:** `C:\dev\wt\source-change-watcher\kernel\src\skp.rs:2626-2644 @ 4137f4d sha256:c0483b8ed3ec3e47424345548e458b484d44a2aba310a3470f6b7a9d7ffac31a`. It is appended on main only after a merge that keeps 4137f4d reachable (no squash), and the custodian's queue carries it.
14. **Round 7:** each discharge names its test.
15. **Superseded index:** Amendment 3 item 5's last sentence → row 2.

No decision is missing, so there is no ADR skeleton. PR #123 still waits for this piece to merge.

**Gate-log line:** `engine-source-change-watcher attempt 2 @ 68f5c56 — architect FAIL (record only, F1): K6 doc presents "belt-and-suspenders on the sink's asynchronous callback" as "§2b's own words", §2b has no such text (round 10); fix items 2–18 built as ruled (unified refusal path + K15, watch.rs B1/B2/UAF, E7 registered, two kernel pins, SH7/SH8/SH11 on real shapes, no new pub/export); K15 second-mutation miss is class 1 (fails on shipped unreachable!, mark proven by assertion); should-fix S1 raw_win32 "most often", S2 Q2 omits DescribeSummary.tsx, S3 duplicate SH7 label; no red line.`

Files:
- C:\dev\wt\source-change-watcher\kernel\tests\source_watch_ordering.rs
- C:\dev\wt\source-change-watcher\kernel\src\skp.rs
- C:\dev\wt\source-change-watcher\engine\src\watch.rs
- C:\dev\wt\source-change-watcher\engine\tests\source_watch_adapter.rs
- C:\dev\wt\source-change-watcher\kernel\tests\typed_terminal_codes.rs
- C:\dev\wt\source-change-watcher\frontends\shell\MANUAL-WALKTHROUGH.md
- C:\dev\wt\source-change-watcher\frontends\shell\src\streaming\viewportStreamManager.test.ts
- C:\dev\wt\source-change-watcher\frontends\shell\src\streaming\tileViewportStreamManager.test.ts
- C:\dev\wt\source-change-watcher\frontends\shell\src\App.tsx
- C:\dev\wt\source-change-watcher\frontends\shell\src\App.test.ts
- C:\dev\wt\source-change-watcher\frontends\shell\src\streaming\liveTicketSet.ts
- C:\dev\wt\source-change-watcher\KNOWN-LIMITATIONS.md
- C:\dev\wt\source-change-watcher\protocol\skp\SKP-V0.md
- C:\dev\wt\source-change-watcher\scripts\plan\verify-mutation.mjs
- C:\dev\wt\source-change-watcher\engine\SOURCE-WATCHER-PREREGISTRATION.md
