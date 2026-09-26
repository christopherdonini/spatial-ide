*Custodian's filing note (2026-09-26): the architect gate's attempt-1 report for PLAN node `engine-source-change-watcher` at ee6fa38, filed as returned (extracted by script from the agent's hand-back; byte-identical). Everything below the rule is the agent's text. Its gate-log record is in `state/gate-log.json` (commit dfdc8fb).*

---

**Verdict: FAIL.** Attempt 1, `engine-source-change-watcher`, `cut/source-change-watcher` @ ee6fa38, tree read at `C:\dev\wt\source-change-watcher`.

Four findings block. Each needs a small fix. None needs the human, and none reaches a red line. The design matches ADR-035 D1–D7 and its Note 2026-09-25, and the phase-1 blockers are resolved:
- E8 is rebuilt as record → close → enqueue.
- Both coverage-lost details are marked `[P6 placeholder]`.
- Every A, K, W and E test name now resolves against §4.

I have no Bash, so I computed no hash, count or diff. Everything marked "reviewer confirms" below is diff-level.

## Blocking

**B1. The coverage-lost bytes are not pinned on the producing side** (seam rule; §4 "SH3 and SH4 build from kernel-pinned bytes … (the P3b precedent)"; §8 item 15)
- Where: `frontends/shell/src/testUtils/terminalShapes.ts`, `REAL_SOURCE_COVERAGE_LOST_TERMINAL_DETAIL` and `REAL_SOURCE_COVERAGE_LOST_PRE_CHECK_REFUSAL_DETAIL`.
- The doc says both are "pinned as an exact-equality assertion on the producing side in `kernel/tests/typed_terminal_codes.rs`". That file has no match for `coverage`. The bytes appear only in `engine/src/error.rs` and in shell files. The P3b pin exists only for `REAL_SOURCE_CHANGED_TERMINAL_DETAIL`.
- Fix: add two exact-equality assertions to `typed_terminal_codes.rs`:
  - `terminal_detail_of(&SourceCoverageLost{detail:"overflow"})`;
  - `code + ": " + message` of `error_of` over `viewport_query`'s coverage-lost detail.

**B2. SH11 does not assert Amendment 2 item 3 over any logged line** (round 23 item 3, S3; §8 items 15 and 19)
- Where: `frontends/shell/src/App.test.ts`, "the listener logs no session reference, only the reason".
- It regex-scans `App.tsx`'s source template. Checking that source for `sr_[0-9a-f]{32}` is vacuous, because a minted value never appears in source.
- The comment says the registered mutation fails on that regex. It does not: the mutated template fails only on `not.toContain("event.session")`.
- A line built from `admittedSessionRef.current` would pass all three assertions.
- Fix:
  - export a pure `unknownSessionDropLine(reason)` and call it from the listener;
  - have SH11 assert that its output contains neither `EVENT.session` nor a match for the regex;
  - keep the source check that only `reason` reaches it;
  - correct the comment.

**B3. E7 does not take §4's registered mutation** (phase-2 delta 6, "E7 also takes the registered mutation"; undisclosed)
- Where: `kernel/src/skp.rs`, test `a_pending_drop_inside_close_emits_once_with_its_session_reference`.
- The mutation labelled "registered" is E1's (move the enqueue into `SkpHost::end_generation`). §4's E7 mutation is "look the reference up after the guard", which is delta 6's "`enqueue` re-reads `GenerationRegistry`".
- Fix:
  - relabel the E1-shaped mutation as a recorded extra;
  - add the registered one to E7's doc and to `verify-mutation`. E7 fails under it, because `record` has already removed `live`.

**B4. `SKP-V0.md` §4 item 10 contradicts §3 as ruled** (round 23 item 3, S4; ADR-035 D4)
- It says `SessionRef` "is minted per open" and counts it among the handle kinds.
- §3's third rule and the second §8 note mint a reference for a generation `open_dataset` did not create. ADR-035 D4 adds it to item 10 "as a fourth value kind, one that is not a handle".
- Fix, one clause: "minted per dataset-session generation (§3's third rule), a value kind that is not a handle; never persisted, …".

## Advisory
1. **A refused open can leave an orphan mark.** In `SkpHost::open_dataset`'s refusal steps 1–2, the latch is set to `Admitted` before `drop(watch)`. A second handle's signal in that window:
   - logs "session ended";
   - leaves an `invalidated` mark on a handle that was never returned, and nothing ever forgets it. No event is emitted (ADR-035 D3).

   Fix: leave the latch at `PreAdmission` on refusal (the recorded signal is already `Some`), or add a `Refused` state.
2. **The sink's log line (delta 8) runs before `end_generation` and unconditionally.** After another route or the other handle has already ended the generation, the line states an end this call did not make; for example, "observed coverage-lost" after an observed-change end. Under the round-7 engine-facts rule, word it as the signal ("…signalled {reason}"), or log only when `record` returns `Some`.
3. **`engine/src/lib.rs` re-exports `WATCH_BUFFER_BYTES`, and nothing outside the engine uses it** (§8 item 8). Fix: drop the re-export and make it `pub(crate)`.
4. **The provenance comments on `KNOWN-LIMITATIONS.md` items 24–28 put paraphrases in quotation marks**, with the markdown stripped. Item 28's `…` drops the qualifier "of `GenerationRegistry` or `StreamRegistry`", which the round-11 elision rule forbids. Fix: mark them as paraphrase, or byte-copy by script.
5. **Silent errors (ADR-010 rule 7, outside §9's list).**
   - The src-tauri emitter thread discards `emit` errors. Log them, without the payload.
   - `listenDatasetSessionEnded(...).then` in `App.tsx` has no rejection handler. Add a `.catch`.
6. **Amendment 4 item 1's "never admitted" is literally false at the guard after `dataPlaneAttach`.** The ticket is admitted before the attach, then invalidated and retired. §8 item 23 is still met, because that ticket's query resolved before the end. Record this in the closing amendment.
7. **The mint-race fallback reports the wrong code on a close race.** In `viewport_query`, `unwrap_or(ObservedChange)` yields `engine.source_changed` when a concurrent `close_dataset` has cleared the mark. That belongs to `kernel-generation-close-races`' intake, not this piece.
8. **A log category is misnamed.** In `candidateArmSession.ts`, the pre-existing category `candidate-session-ended-source-changed` now also labels coverage-lost ends. It is not a code; it can be renamed at P6.

## Checklist results
- **§8 items 1–24.**
  - Pass by reading: 1, 3, 5, 6, 10, 14, 16, 17, 18, 19, 20, 21, 23 and 24.
  - 8: advisory 3. 9: pass, advisory 2. 15: B1 and B2. 22: pass (A2-1 folded; A5-1 and A5-2 are triaged as not the watcher's code, `state/cloud/wave1/A5.md`).
  - Reviewer confirms by diff: 2 (descriptor paths byte-unchanged), 4, 7 (both lockfiles byte-identical; the one feature is verified against the windows-sys 0.61.2 manifest, where `Win32` implies `Win32_Foundation`), 11, 12 and 13 (with B4).
- **ADR-016 A1 items 2–3:** pass. `checks` is `full`/`degraded{components}` from `unestablished_components` and is independent of `coverage`. No snapshot claim is made.
- **ADR-035 D1–D7 and its Note:** pass, except B4 against D4's value-kind clause.
  - `invalidate` has one product caller, `SessionInvalidator::record`.
  - The report carries `SessionRef` by value, and the enqueue follows the guard.
  - `close_dataset` runs: disarm and join the watch, cancel, `forget_dataset`, `catalog.remove`.
  - The listener compares, drops with a log line, and enters `endSessionForDataset`.
- **ADR-010:** rule 6 passes (§7's values match `65536`, `64` and `10 s`). Rule 5 passes, since the lost-event staleness is named in KNOWN-LIMITATIONS item 28.
- **ADR-006:** pass. `describe` stays class 1. An end is a transition and is never undoable. The event is registered as no operation.
- **Seams:**
  - engine → kernel: W1–W3 use `PlatformWatch` through `SkpHost`. Pass.
  - kernel → protocol: two-sided fixtures, and both SH6 and `fixtures.rs` read the shared event fixture. Pass.
  - kernel → shell: the E2E is `source-watch-idle.mjs` F0–F3, with the listener-never-registered mutation. Pass apart from B1.
- **Rulings:**
  - Round 22 item 1: `live_or_mint` mints an unheld `SessionRef::mint()`, and the listener drops an unknown session's event with a logged line. Pass.
  - Round 23 item 2: the second §8 note matches the consult text and is labelled paraphrase. Pass.
  - Round 23 item 3: S2 and S4 pass (§3 and "All four are"); S3 is B2.
  - Wave-1 rule 2 / Amendment 4: items 1 and 8 are built as written, with SH12–SH16 present.
- **Phase-2 deltas 1–12:** 1–3, 5, 7–11 are built as written. 4 is B2. 6 is B3 (E8 and the E5 comment are done). 12 is owed to the closing amendment.
- **Part Q:** its rows cover case (f) felt (Q1), every §7 placeholder (Q2), and a "Last amendment read" field in a blank log. Pass.
  - Nit: Q2's parenthetical for `kernel/src/skp.rs` omits the pre-admission detail and the "no watch was armed" reason. The file search still finds both.
- **Deviations:**
  - SH11 built with S3 in place: accepted as delta 4, but B2 applies.
  - Amendment 4's code in d90837d after 2a7f830: this is the required order. The reviewer confirms with `git log` that no fold-in hunk to `viewportStreamManager.ts`, `candidateArmSession.ts` or their tests precedes 2a7f830.
  - SH5: class 2, accepted.
    - The registered mutation is equivalent: `isSessionEndedRefusal` returns before the retry decision, so the retry set is unreachable for this code.
    - SH5 proves "ends the session before any retry decision", and non-retry holds by that ordering.
    - Its recorded mutation duplicates SH4's.
  - SH12: class 1, accepted.
    - Amendment 4 item 4's "restore the code at this branch's base" is falsified for one guard alone.
    - SH12 still fails by name, on `dataPlaneAttach`.
  - K5's CoverageLost injection: delta 11 was optional. Accepted, no record needed.
  - K6, catalog clause only: accepted, as Amendment 3 item 4 reduced it. It also asserts that no event is emitted.
- **Red lines:** none reached, if the reviewer confirms that `git diff origin/main...HEAD -- docs/adr` is empty. Also checked:
  - one `windows-sys` feature and no crate;
  - the event reaches only the shell's own webview, capabilities are unchanged, and there is no MCP surface;
  - `skp/0.5` is ADR-035's.
- **PR #123:**
  - Its fixtures and harness are written at `skp/0.4`, and its green checks ran against bb98f71.
  - Once this piece merges, #123 fails on main: every request literal changes to `skp/0.5`, and every `open_dataset` response fixture needs `session`. It has no describe fixture (`state/cloud/wave1/C.md`).
  - Merge the watcher first. Then the custodian, at integration, merges main into `cloud/wave1-C`, updates those fixtures, re-runs the harness and records the new pass/deferred/diverged counts.
  - #123 must not merge on its current checks.

No decision is missing, so no ADR skeleton. Amendment 4's class gap is already carried to the weekly proposal list.

## The closing amendment must contain (references and hashes only)
1. The commit of the gate's `verify-mutation` run, as the observation of record for Amendment 3 items 2–5 and for SH12–SH16 (Amendment 4 items 7 and 8).
2. The resolutions of H1 (A8 under its mutation), H2 (A1 passing), H3 (A6 under its mutation) and H5 (A13 passing), each with that commit. H4 stays open.
3. The §7 budget row, class 1: per-module figures, the total and the file count under §21c, computed by the reviewer. The fold-in commits are named (Amendment 4 item 5).
4. Class-2 rows: SH5's equivalent mutant; E7's registered mutation after the B3 fix. Class-1 rows: SH12's prediction miss; advisory 6.
5. The pin of the withdrawn E5 comment (Amendment 3 item 2) as `path:line @ <rev> sha256:<hex>`.
   - 4137f4d is a branch commit, so round 15 (e) forbids pinning it before merge.
   - Either append the pin on main after a merge that keeps 4137f4d reachable (not a squash), or name that as a residual.
6. Each discharge cites its test by name (round 7). No prose restates what a reference carries.

**Gate-log line:** `engine-source-change-watcher attempt 1 @ ee6fa38 — architect FAIL: B1 coverage-lost terminal bytes unpinned kernel-side (terminalShapes.ts claims a typed_terminal_codes.rs pin that does not exist); B2 SH11 asserts source text, not the logged line (S3); B3 E7 registered mutation not built (delta 6); B4 SKP-V0 §4 item 10 "minted per open" contradicts §3/S4; 8 advisory; design, rulings, fold-in and red lines hold.`

Files:
- C:\dev\wt\source-change-watcher\frontends\shell\src\testUtils\terminalShapes.ts
- C:\dev\wt\source-change-watcher\kernel\tests\typed_terminal_codes.rs
- C:\dev\wt\source-change-watcher\frontends\shell\src\App.test.ts
- C:\dev\wt\source-change-watcher\frontends\shell\src\App.tsx
- C:\dev\wt\source-change-watcher\kernel\src\skp.rs
- C:\dev\wt\source-change-watcher\protocol\skp\SKP-V0.md
- C:\dev\wt\source-change-watcher\engine\src\lib.rs
- C:\dev\wt\source-change-watcher\KNOWN-LIMITATIONS.md
- C:\dev\wt\source-change-watcher\frontends\shell\src-tauri\src\lib.rs
- C:\dev\wt\source-change-watcher\engine\SOURCE-WATCHER-PREREGISTRATION.md
