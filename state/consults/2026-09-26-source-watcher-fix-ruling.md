*Custodian's filing note (2026-09-26): the architect agent's consult for PLAN node `engine-source-change-watcher` after gate 1 (both FAIL at ee6fa38): the ruling on the reviewer's B3, the fix list, and Amendment 5's text, filed as returned (extracted by script from the agent's hand-back; byte-identical). Everything between the two rules is the agent's text. The assembled amendment, with its three hashes filled by script, follows the second rule.*

---

**Verdict: the fix round may proceed, and nothing in it needs the human.** No ADR text changes, and round 23's ruled wording is untouched. Item 1 needs one pre-code amendment, Amendment 5 (the block at the end). No fix crosses a §5 invalidator.

I have no Bash, so I computed no hash. Each `<RECOMPUTE-n>` in this report comes with the command that produces it.

## 1. Reviewer B3: §8 item 3 governs
- **Why item 3 wins.** §8 item 3 blocks a coverage loss surfacing as `engine.source_changed` anywhere. §2b's own bullet, "Refusals take their code from the reason, never `SourceChanged` for a coverage loss", says the same.
- **Why step 2 is wrong.** §2b step 2's hardcoded code assumes that a false `resolves_unchanged()` with no recorded signal means a `Change`. The product watch breaks that: it sets `fired` before it calls the sink (`watch.rs`, `watch_thread`), so the pending signal can be a `CoverageLost`.
- **Lower-number-wins does not apply here.** It orders `docs/`, not sections inside one preregistration.
- **The ruling:** step 2's condition stays, and its code follows the signal's kind.
- **Class:** 5, a gate settling the piece. It adds nothing to scope.

**Shape** (combines the reviewer's remedy, my advisory 1 and the reviewer's S1):
- Steps 1 and 2 become one refusal path, taken when a signal is recorded or `resolves_unchanged()` is false. In order:
  1. The latch stays `PreAdmission`.
  2. Release the guard.
  3. Remove the catalog entry (`catalog.remove`).
  4. Drop the watch, which joins its threads.
  5. Re-lock the latch, read the recorded signal, and refuse through `engine_error_of_pre_admission_signal`.
- If no signal is recorded after the drop, refuse as `engine.source_coverage_lost` with one new `[P6 placeholder]` detail. That is the conservative fallback: a `Change` reported as coverage-lost breaks no §8 item.
- **No `Refused` state.** Once the drop has joined the watch threads, nothing is left to call the sink, and any later call would only record into a latch that nothing reads.
- A refused open therefore never reaches the `Admitted` arm. That removes both the orphan `invalidated` mark and the false "session ended" line.
- `ArmedWatch::resolves_unchanged`'s doc states the contract the path relies on: `false` means a signal has been delivered to the sink, or will be before `Drop` returns. This is a doc change only; no `pub` item is added.

**Test obligation: K15, in-crate in `kernel/src/skp.rs`.**
- It must be in-crate because the `invalidated` map is private, and an accessor would be the test-only `pub` item §5 forbids.
- Its `ArmedWatch` reports `false` at admission and delivers `CoverageLost` from its `Drop`, the product watch's order.
- It asserts four things: the code is `engine.source_coverage_lost`; there is no catalog entry; there is no live generation and no `invalidated` mark; there is no event.
- Registered mutation: step 2 refuses with `EngineError::SourceChanged`, which is the code at ee6fa38.
- Second mutation: set the latch to `Admitted` before the drop (ee6fa38's order). K15 then fails on the mark.

## 2. Reviewer B4
**The SKP-V0 correction may be made in place.** Round 15 (f) binds restoring bytes in an append-only record. §4 item 13 of a spec is not one, and this paragraph is the branch's own unmerged text, so (f) is not engaged.

The smallest correction has two steps. It also fixes the reviewer's placement nit.
1. Delete §4 item 13's `**\`skp/0.5\` is a further instance of this rule** …` paragraph (reviewer: `:265` @ ee6fa38) and one of its blank lines.
2. Add the text below, after one blank line, after the paragraph that ends "…exactly as `skp/0.2` and `skp/0.3` did.". Placed there, it follows the conditions it names.

```
    **`skp/0.5` was assembled across several commits, and condition (iii) did not hold for one of
    them**: one commit changed the Rust-side literal and fixtures, and the TypeScript side followed
    in a later commit (`engine/SOURCE-WATCHER-PREREGISTRATION.md` §10, Amendment 5 item 2). It is
    therefore not an instance of this rule. Its whole field set is §8's `skp/0.5` entry, and it
    freezes at merge as `skp/0.2` through `skp/0.4` did.
```

The class-2 row for the preregistration is Amendment 5 item 2, in the block at the end.

In the same file, my B4 fix to §4 item 10 is a separate edit: `SessionRef` is "minted per dataset-session generation (§3's third rule), a value kind that is not a handle; never persisted, …".

## 3. Reviewer B7
- **Move the notify calls into the existing export.** The entry's two `notifySessionEnded` calls move into `dispatchSessionEndedToOwner`, which already exists and whose product caller is `endSessionForReason`. Its new signature is `(reason: EndReason, forDataset, { baseline: Pick<ViewportStreamManager,"notifySessionEnded"> | null; candidate: Pick<TileViewportStreamManager,"notifySessionEnded"> | null; endSessionDirectly })`.
  - It builds the detail itself, through `buildSessionEndedOwnerDetail`.
  - `endSessionForReason` becomes a single call passing `managerRef.current`, `candidateManagerRef.current` and `endSession`.
  - No export is added. The `Pick` types let the compiler hold the seam to the real managers.
- **SH7:** route a matching event through `routeDatasetSessionEndedEvent` → `dispatchSessionEndedToOwner` into a real `ViewportStreamManager` with a resident batch. Wire its `onSessionEnded` to the exported `endSessionForDataset`, with setters that record their calls. Assert:
  - `onSuperseded` fires with the handle;
  - `setSessionEnded` is called once;
  - hover is latched;
  - a later `requestViewport` returns `session-ended`;
  - `endSessionDirectly` is not called.
- **SH8:** the same route into a real `TileViewportStreamManager`, asserting that all tiles are cleared.
- **Registered mutation:** delete that manager's `notifySessionEnded` call in `dispatchSessionEndedToOwner`, keeping the `return`.
- **The undisclosed replacement** is recorded in Amendment 5 item 3, class 2. The existing "notifySessionEnded ends the session exactly as a terminal does" test keeps its own recorded mutation, but it is not SH7.

## 4. Consolidated fix list, in order
1. **Commit Amendment 5 alone**, before any code.
2. **Kernel admission** (reviewer B3, my advisory 1, S1): the shape in item 1, plus K15. Update K6's recorded-mutation comment: "skip steps 1 and 2" becomes "skip the refusal path".
3. **`engine/src/watch.rs`:**
   - **Reviewer B1:** after `issue_read` returns `Ok`, re-check `disarming`. If it is set, cancel that read's own `OVERLAPPED` and loop, so the abort returns.
   - **Reviewer B2:** no `expect`. A failed spawn returns `ChecksOnly` with a `[P6 placeholder]` reason. That falls inside §7's arming-failure category, so no new placeholder class is needed.
   - **Beyond B2, flagged:** a failed `Builder::spawn` drops its closure, and with it a `PendingRead` whose read is still outstanding. That is a use-after-free. Give `PendingRead` a `Drop` that cancels its own `OVERLAPPED` and synchronizes, and use `CancelIoEx(handle, own overlapped)`, never null. With null, the re-issue path's `pending = next` would cancel the new read.
   - **On a grandparent spawn failure:** build and drop a `SourceWatch` holding only P, which disarms, joins and closes it, then close G.
   - **Advisory 3:** make `WATCH_BUFFER_BYTES` `pub(crate)` and drop the `lib.rs` re-export. Nothing outside the crate uses it; the adapter test only names it in a comment.
   - **Nit:** correct the SAFETY comment that says `read_unaligned`.
4. **My B3:** E7's doc records §4's registered mutation ("look the reference up after the guard"), so `verify-mutation` finds it. The E1-shaped mutation becomes a recorded extra.
5. **My B1:** two exact-equality pins in `kernel/tests/typed_terminal_codes.rs`:
   - `terminal_detail_of(&SourceCoverageLost{detail:"overflow"})`;
   - the pre-check `code + ": " + message`, produced through a real `SkpHost` with `injected_watch`: a `CoverageLost` after admission, then `viewport_query`.
   - Name both tests in the `terminalShapes.ts` doc.
6. **Reviewer S5:** add a timeout wrapper to E10.
7. **Advisory 2:** reword the sink's log line as the signal: "the advisory source watcher signalled {reason}". This avoids changing `end_generation`'s signature.
8. **Reviewer B6:** reduce A6's comment to "throughput attempts produced no overflow". Also fix the nits: the stale `a7_` name, and A7's withdrawn "every rename scenario" generalisation.
9. **Advisory 5a:** the src-tauri emitter logs `emit` errors, without the payload.
10. **My B2 / reviewer S2:** `routeDatasetSessionEndedEvent` builds the dropped-event line from `event.reason` only and passes it to `logUnknownSessionDrop: (line: string) => void`. No new export (this supersedes my attempt-1 `unknownSessionDropLine` suggestion).
    - SH11 asserts that the logged line contains neither `EVENT.session` nor `/sr_[0-9a-f]{32}/`, and that it does contain the reason.
    - Delete the source-scan test and its false comment.
11. **Reviewer B7:** item 3 above.
12. **Reviewer B5:** add `[P6 placeholder]` to both `DescribeSummary` labels, and update SH1 and SH2 if they match the label text.
13. **Reviewer S3:** `events.ts:25` states the payload's kind (null, array or type), never `JSON.stringify(payload)`.
14. **Reviewer S4 / advisory 5b:** add a `.catch` on `listenDatasetSessionEnded`, logging a line with no payload.
15. **Nit:** `liveTicketSet.ts`'s stale `skp.rs` cites. They are in a doc block this diff edits, so the fix is in scope.
16. **Nit:** the E2E stops printing elapsed milliseconds (§8 item 11).
17. **Advisory 4:** mark the KNOWN-LIMITATIONS provenance comments for items 24–28 as paraphrase, and restore item 28's dropped qualifier.
18. **`protocol/skp/SKP-V0.md`:** item 2's paragraph change and my B4's item 10 clause.
19. **Suites green,** `verify-mutation` and the E2E run, then gate 2.

**Left out, with reasons:**
- Advisory 6 is a closing-amendment row, not code.
- Advisory 7 goes to `kernel-generation-close-races`' intake.
- Advisory 8 goes to P6.
- PR #123 still waits for this piece to merge, then gets its integration update.

**Flags:**
- No new `pub` item or export anywhere. Two existing TS exports, `routeDatasetSessionEndedEvent` and `dispatchSessionEndedToOwner`, change signature; their product caller is still `App.tsx`.
- K15's fallback adds one placeholder string, declared in Amendment 5 item 1.
- Amendment 4 item 4 declared `App.tsx` unchanged by the fold-in only, so items 10 and 11 do not cross it.
- The engine and kernel rows go further over budget. That is only a class-1 row.

## 5. Closing amendment: rows, references and hashes only
The closing amendment is written after gate 2. `R` below means `state/consults/2026-09-26-source-watcher-gate1-reviewer.md`, and `A` means `…-gate1-architect.md`, both `@ 04b3680`, which is on main.
1. **Class 1, the observation of record for every mutation:**
   - `R:81-116 @ 04b3680 sha256:<RECOMPUTE>`;
   - gate 2's report span `@ <its main commit>`, for K15, SH7, SH8, SH11 and the two pins;
   - the gate-log entries (dfdc8fb, and gate 2's) by entry.
2. **Class 3, correcting Amendment 3 item 5's last sentence.** At most three sentences:
   - the defect: `verify-mutation` @ 7d24ed1 checks that a mutation is recorded and runs none;
   - the corrected reference: row 1;
   - the proof: `R:60 @ 04b3680 sha256:<RECOMPUTE>`.
3. **Class 1, H1, H2, H3 and H5:** `R:75-78 @ 04b3680 sha256:<RECOMPUTE>`. H4 is not restated.
4. **Class 1, the E2E run:** `R:62-69`. Its mutation's prediction miss, where W4 failed rather than F1/F2, is `R:71`, each `@ 04b3680 sha256:<RECOMPUTE>`. Add gate 2's E2E span.
5. **Class 1, the budget:** the final per-module figures, total and file count under §21c, from gate 2. Name the fold-in commits: d90837d (mixed) and e372848. Gate 1's figures are `R:120-133 @ 04b3680 sha256:<RECOMPUTE>`.
6. **Class 2, SH5's equivalent mutant:** `R:102-104`.
7. **Class 2, E7's registered mutation,** observed at `R:84`.
8. **Class 1, SH12's prediction miss:** `A:94-96`.
9. **Class 1, advisory 6:** `A:58`.
10. **Residual, the E5 pin.** By round 15 (e) it cannot enter the branch's record while 4137f4d is not on main. It is appended on main after a merge commit that keeps 4137f4d reachable (no squash), and the custodian's queue carries it.
11. **Round 7:** each fix's discharge names its test. Reviewer B1 and B2 name the gate-2 span that reads them.
12. **Superseded index (round 12 (e)):** Amendment 3 item 5's last sentence → row 2.

This is the piece's first record-correction round. My attempt-1 report's "closing amendment" list item 1 is superseded by this section. That report is evidence, not a record, so it is not amended.

Every `<RECOMPUTE>` is `git show 04b3680:<path> | sed -n '<a>,<b>p' | sha256sum`, with LF bytes.

## Amendment 5, to append before the fix code

```
### Amendment 5 — 2026-09-26, written after gate 1's results were seen (architect and reviewer FAIL at `ee6fa38`), before the fix code

Each row names its template class. Gate 1's reports are `state/consults/2026-09-26-source-watcher-gate1-architect.md` and `state/consults/2026-09-26-source-watcher-gate1-reviewer.md`, both on main at `04b3680`.

1. **The admission refusal's code, class 5, a gate settling the piece** (reviewer gate-1 B3, `state/consults/2026-09-26-source-watcher-gate1-reviewer.md:22-26 @ 04b3680 sha256:<RECOMPUTE-1: git show 04b3680:state/consults/2026-09-26-source-watcher-gate1-reviewer.md | sed -n '22,26p' | sha256sum>`; architect gate-1 advisory 1).
   - §8 item 3 governs §2b step 2. Step 2's condition stands; its code is the recorded signal's kind, by step 1's mapping. Step 2 assumed that a false `resolves_unchanged()` with no recorded signal is a `Change`; the product watch sets its flag before it calls the sink, so the pending signal can be a `CoverageLost`.
   - Shape (§2b, "Open and admission"). Steps 1 and 2 become one refusal path, taken when a signal is recorded or `resolves_unchanged()` is false. The latch stays pre-admission; the guard is released; the catalog entry is removed; the watch is dropped, which joins its threads; then the recorded signal is read under the latch and refused by kind. If none is recorded, the open refuses as `engine.source_coverage_lost` with one new detail, a P6 placeholder that joins §7's placeholder row.
   - A refused open never sets the latch to admitted, so the sink's admitted arm, its log line and `end_generation`, is unreachable for it and leaves no `invalidated` mark. No third latch state is added: after the drop no watch thread remains to call the sink.
   - `ArmedWatch::resolves_unchanged`'s doc states the contract the path relies on: `false` means a signal has been delivered to the sink, or will be before the watch's `Drop` returns. No `pub` item is added.
   - Test K15 `a_coverage_loss_racing_admission_refuses_with_its_own_code_and_leaves_no_mark`, in-crate in `kernel/src/skp.rs` beside E5, E7 and E8, because the mark is private and §5 forbids a test-only `pub` item. Its `ArmedWatch` reports `false` at admission and delivers `CoverageLost` to the sink from its `Drop`, the product watch's order. Asserts: the refusal's code is `engine.source_coverage_lost`; no catalog entry; `GenerationRegistry` holds no live generation and no `invalidated` mark; the receiver holds no event. Mutation: step 2 refuses with `EngineError::SourceChanged`, the code at `ee6fa38`. Second mutation: the latch is set to admitted before the watch is dropped, the order at `ee6fa38`.
   - Cases → tests: (c) and (e) gain K15.
2. **The `skp/0.5` fixtures, class 2** (reviewer gate-1 B4, `state/consults/2026-09-26-source-watcher-gate1-reviewer.md:28-32 @ 04b3680 sha256:<RECOMPUTE-2: same command, sed -n '28,32p'>`). §2c's rule that both sides' fixtures change in the same commit as each addition (`SKP-V0.md` §4 item 13, condition (iii)) failed once: `9fbe6bd` changed the Rust literal, the shared JSON fixtures and `fixtures.rs`, and the TypeScript literal and `fixtures.test.ts` followed only at `b20bebc`. History is not rewritten, by rebase or by squash, because `4137f4d` must stay reachable for Amendment 3 item 2's pin. `SKP-V0.md` §4 item 13's `skp/0.5` paragraph, this branch's own unmerged text and not an append-only record, is corrected in place to say so.
3. **SH7 and SH8, class 2** (reviewer gate-1 B7, `state/consults/2026-09-26-source-watcher-gate1-reviewer.md:38-42 @ 04b3680 sha256:<RECOMPUTE-3: same command, sed -n '38,42p'>`). At `ee6fa38` §4's mutation, the entry skips `notifySessionEnded`, failed no test, and the tests recorded another, `notifySessionEnded` made a no-op, without disclosure. The entry's two `notifySessionEnded` calls move into `dispatchSessionEndedToOwner` (`frontends/shell/src/App.tsx`), which takes the reason, the two managers and `endSession`; `endSessionForReason` only passes it `managerRef.current`, `candidateManagerRef.current` and `endSession`. SH7 and SH8 route a matching event through `routeDatasetSessionEndedEvent` and `dispatchSessionEndedToOwner` into a real `ViewportStreamManager` and a real `TileViewportStreamManager`, with §4's assertions. The registered mutation deletes that manager's `notifySessionEnded` call in `dispatchSessionEndedToOwner`. No export is added.
4. **Reviewer gate-1 B1 and B2, class 5.** Their fixes in `engine/src/watch.rs` register no test: the B1 window lies between a re-issued read and the disarm's cancel on two threads, and the B2 failure is the OS refusing a thread; neither can be forced without a test-only hook, which §5 forbids. The gate proves each by reading.
```

Files:
- C:\dev\wt\source-change-watcher\engine\SOURCE-WATCHER-PREREGISTRATION.md
- C:\dev\wt\source-change-watcher\kernel\src\skp.rs
- C:\dev\wt\source-change-watcher\engine\src\watch.rs
- C:\dev\wt\source-change-watcher\protocol\skp\SKP-V0.md
- C:\dev\wt\source-change-watcher\frontends\shell\src\App.tsx
- C:\dev\wt\source-change-watcher\frontends\shell\src\App.test.ts
- C:\dev\wt\source-change-watcher\frontends\shell\src\skp\events.ts
- C:\dev\wt\source-change-watcher\kernel\tests\typed_terminal_codes.rs
- C:\dev\spatial-ide\state\consults\2026-09-26-source-watcher-gate1-reviewer.md
- C:\dev\spatial-ide\state\consults\2026-09-26-source-watcher-gate1-architect.md

---

## The text appended to the preregistration

Amendment 5's block above, with its three `<RECOMPUTE-n>` placeholders replaced by script: each is `git show 04b3680:state/consults/2026-09-26-source-watcher-gate1-reviewer.md | sed -n '<a>,<b>p' | sha256sum` over LF bytes (22–26, 28–32, 38–42), and each span was read to be the finding it names. 14 lines, sha256 ce1367eeb22fac6614a969d4e69ba8c7ce43b5fa8344834ff18747de1d51b3a5.

````text
### Amendment 5 — 2026-09-26, written after gate 1's results were seen (architect and reviewer FAIL at `ee6fa38`), before the fix code

Each row names its template class. Gate 1's reports are `state/consults/2026-09-26-source-watcher-gate1-architect.md` and `state/consults/2026-09-26-source-watcher-gate1-reviewer.md`, both on main at `04b3680`.

1. **The admission refusal's code, class 5, a gate settling the piece** (reviewer gate-1 B3, `state/consults/2026-09-26-source-watcher-gate1-reviewer.md:22-26 @ 04b3680 sha256:6d3806b0d5c9024d9d7feac9349d787c7b189db7f7790df83b269c758152f7ec`; architect gate-1 advisory 1).
   - §8 item 3 governs §2b step 2. Step 2's condition stands; its code is the recorded signal's kind, by step 1's mapping. Step 2 assumed that a false `resolves_unchanged()` with no recorded signal is a `Change`; the product watch sets its flag before it calls the sink, so the pending signal can be a `CoverageLost`.
   - Shape (§2b, "Open and admission"). Steps 1 and 2 become one refusal path, taken when a signal is recorded or `resolves_unchanged()` is false. The latch stays pre-admission; the guard is released; the catalog entry is removed; the watch is dropped, which joins its threads; then the recorded signal is read under the latch and refused by kind. If none is recorded, the open refuses as `engine.source_coverage_lost` with one new detail, a P6 placeholder that joins §7's placeholder row.
   - A refused open never sets the latch to admitted, so the sink's admitted arm, its log line and `end_generation`, is unreachable for it and leaves no `invalidated` mark. No third latch state is added: after the drop no watch thread remains to call the sink.
   - `ArmedWatch::resolves_unchanged`'s doc states the contract the path relies on: `false` means a signal has been delivered to the sink, or will be before the watch's `Drop` returns. No `pub` item is added.
   - Test K15 `a_coverage_loss_racing_admission_refuses_with_its_own_code_and_leaves_no_mark`, in-crate in `kernel/src/skp.rs` beside E5, E7 and E8, because the mark is private and §5 forbids a test-only `pub` item. Its `ArmedWatch` reports `false` at admission and delivers `CoverageLost` to the sink from its `Drop`, the product watch's order. Asserts: the refusal's code is `engine.source_coverage_lost`; no catalog entry; `GenerationRegistry` holds no live generation and no `invalidated` mark; the receiver holds no event. Mutation: step 2 refuses with `EngineError::SourceChanged`, the code at `ee6fa38`. Second mutation: the latch is set to admitted before the watch is dropped, the order at `ee6fa38`.
   - Cases → tests: (c) and (e) gain K15.
2. **The `skp/0.5` fixtures, class 2** (reviewer gate-1 B4, `state/consults/2026-09-26-source-watcher-gate1-reviewer.md:28-32 @ 04b3680 sha256:8d884afaefb2d112b622b00a7eb22feb5f1317975ffcafa22267f25aa151cce6`). §2c's rule that both sides' fixtures change in the same commit as each addition (`SKP-V0.md` §4 item 13, condition (iii)) failed once: `9fbe6bd` changed the Rust literal, the shared JSON fixtures and `fixtures.rs`, and the TypeScript literal and `fixtures.test.ts` followed only at `b20bebc`. History is not rewritten, by rebase or by squash, because `4137f4d` must stay reachable for Amendment 3 item 2's pin. `SKP-V0.md` §4 item 13's `skp/0.5` paragraph, this branch's own unmerged text and not an append-only record, is corrected in place to say so.
3. **SH7 and SH8, class 2** (reviewer gate-1 B7, `state/consults/2026-09-26-source-watcher-gate1-reviewer.md:38-42 @ 04b3680 sha256:7c5d951cca864ffee0b17dbfaeba9293c780b216219de9cce4105c3e430029ad`). At `ee6fa38` §4's mutation, the entry skips `notifySessionEnded`, failed no test, and the tests recorded another, `notifySessionEnded` made a no-op, without disclosure. The entry's two `notifySessionEnded` calls move into `dispatchSessionEndedToOwner` (`frontends/shell/src/App.tsx`), which takes the reason, the two managers and `endSession`; `endSessionForReason` only passes it `managerRef.current`, `candidateManagerRef.current` and `endSession`. SH7 and SH8 route a matching event through `routeDatasetSessionEndedEvent` and `dispatchSessionEndedToOwner` into a real `ViewportStreamManager` and a real `TileViewportStreamManager`, with §4's assertions. The registered mutation deletes that manager's `notifySessionEnded` call in `dispatchSessionEndedToOwner`. No export is added.
4. **Reviewer gate-1 B1 and B2, class 5.** Their fixes in `engine/src/watch.rs` register no test: the B1 window lies between a re-issued read and the disarm's cancel on two threads, and the B2 failure is the OS refusing a thread; neither can be forced without a test-only hook, which §5 forbids. The gate proves each by reading.
````
