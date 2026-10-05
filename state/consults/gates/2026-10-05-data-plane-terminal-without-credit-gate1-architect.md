*Custodian's filing note (2026-10-05): PR #176's gate 1, the architect, for PLAN node `data-plane-terminal-without-credit`, under the tag node:data-plane-terminal-without-credit@g1. Reviewed: cut/data-plane-terminal-without-credit @ 3f7b19492cf9df9fa076d84207031c337ac0464a (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is fb37ec7010843a0b33e57498ab7d9293b1c9ae041877e73483762294b08d97a5. Write audit PASS: zero write calls (Read 33, Glob 2, Grep 22, SubagentHandback 1). The architect read the code from the read-only export `C:/dev/wt/dptwc-head-3f7b1949` while the reviewer ran mutations in the worktree. Profile paths redacted at filing: none.*

---

Reviewed: cut/data-plane-terminal-without-credit @ 3f7b19492cf9df9fa076d84207031c337ac0464a

**Verdict: FAIL, on Documentation only.** Correctness is PASS and Evidence is PASS. Gate 1, architect, PR #176, node `data-plane-terminal-without-credit`, full gating. Two S1, both Documentation; one S2; nine notes. Under AUTONOMY.md §22, this is one bounded correction round (record round 1 of 2). After it, a scoped read covers only the fix commit and Amendment 4. Correctness and Evidence carry forward, subject to §22's semantic applicability check.

**How I read it.** I have no Bash, so I computed no hash, ran no suite and applied no mutation. Code was read from the export `C:/dev/wt/dptwc-head-3f7b1949`. Main's commits come from `.git/logs/refs/heads/main`. The branch's commits come from worker report 1 and the brief. Lines on the branch are named in words at 3f7b1949. The must-print-nothing set, the §5 line ranges and §7's numstat rest on the worker's figures, which the reviewer recomputes. Nothing below is a quotation unless it is marked byte-copied.

## S1 (blocking, Documentation)

**S1-1. The instrument's invariant is stated for every stream but holds only on the discard paths. §8 item 15 applies (a claim beyond §1), and so does Amendment 2, row D.**
- Row D scopes the identity to the 2d paths, and I-7 scopes it the same way.
- The shipped text drops that scope, in two places:
  - the `batches_discarded()` doc, lines 253-254 of `protocol/data-plane/src/transport.rs` at 3f7b1949, byte-copied sub-line spans: `Sent batches plus this equal` / `` `batches_generated` once a stream has ended.``
  - `protocol/data-plane/README.md`, line 174 at 3f7b1949, byte-copied: `generation, so once a stream has ended, batches sent plus batches discarded equal batches generated.`
- On every halt path the identity is false. These paths are a data-plane CANCEL, a peer close, a malformed frame, a receive error, and the deferral in the owner arm. On each one, `drive` drops the batch it holds, and the channel drops the queued ones, with no `note_discarded` call. T4's own run is a counterexample: about 5 generated, 0 sent, 0 discarded.
- The same over-generality is in two more places:
  - the `note_discarded` doc (lines 227-229), which reads as if every batch dropped because the stream ended is counted;
  - README lines 172-173 (counts each batch dropped; `resident_bytes` falls with it).
- **Fix, one branch commit, doc text only.** Scope each sentence to the discard drain, meaning an owner's cancel or a pump failure. Optionally, state that halt paths drop queued batches uncounted. No test changes, because every equality assertion (T1, T1b, T3b, T5) is on a 2d path.

**S1-2. Amendment 3's evidence hash cannot be recomputed and carries no rev. Round 15 (e) fails this by name.**
- Amendment 3 cites worker report 1 with its as-written sha256 38e65036…, which has no `@ <rev>`.
- The report's filing note says that hash covers line 5 to the end of the scratchpad bytes, before the two de-rootings. So no committed revision reproduces it, and AUTONOMY.md §22 allows hashes only where a gate recomputes them.
- **Fix: append Amendment 4 to the form on main now**, in the round 12 (d) shape:
  - the defect;
  - the corrected reference, `state/consults/2026-10-05-data-plane-terminal-without-credit-worker-report-1.md @ 8f4874c184ac4b4d13546b47843c643e1fcdb5ec sha256:<whole file at that commit>`. The citing commit does not create 8f4874c1;
  - the proof: the reviewer recomputes it with `git show`.
- It ends with a superseded index naming Amendment 3's hash parenthesis. Amendment 3 itself is not edited.
- The #175 form's Amendment 2 has the same rev-less pattern. I did not flag it at that gate. The difference here is that this hash covers bytes no commit holds.

## S2 (should fix; does not block by itself)

**S2-1. Deviation 5: a match arm in `discard_queued` that can never run.**
- The arm is `None if discarded == 0 => return Terminal::Completed`, line 385 of `adapter_ws.rs` at 3f7b1949.
- The counter starts at 1 (line 372) and only increments, so the arm cannot run. It is a code path with no caller under the human's caller rule.
- §2d's "Completed when nothing was discarded" is served elsewhere, by the main loop's closed-channel arm (line 205). That arm is never reached after a discard, because every discard returns a terminal straight out of `discard_queued`. So §2d and §8 item 10 hold, and no claim changes.
- **Fix, in the S1-1 commit:**
  - delete the arm and the `discarded` counter;
  - correct the doc at lines 362-364, which implies `Completed` can be returned from here.
- M5's description still applies: it replaces the remaining `None` arm with `Completed`. Its observation at 8f5e622e stands, because the deleted arm was unreachable. The reviewer's scoped read confirms this as the semantic applicability check.

## N (notes)

- **N-1.** §2d says the notices are raced in every wait. The receive wait (lines 200-207) does not race them.
  - The outcome is the same. A receive needs no credit, and the next credit wait reads both notices' current values through `raised`'s `wait_for`, which evaluates the current value before waiting, even after the sender has dropped.
  - §8 item 8 holds. This is the structural reason behind deviation 5. No amendment is needed.
- **N-2.** T4's discrimination needs at least 2 runtime workers. `flavor = "multi_thread"` without `worker_threads` takes the core count. Setting `worker_threads = 2` in a follow-up would make that explicit. The record of M4 at 8f5e622e stands.
- **N-3.** T3a and T3b assert that the detail contains the source's words, while round 54, OPEN-1 says unchanged. `pump.rs` passes the source's error through as it is, so equality holds by code. The tests match the form as written. A stronger assertion is optional.
- **N-4.** The module doc at lines 33-34 of `adapter_ws.rs` says a terminal frame never waits for credit, and points to the README. The README carries OPEN-2's bound (lines 179-182), so §8 item 15 is met.
- **N-5.** M0's batch counts could not be observed (deviation 6), so P-1 is observed as to the deadline only. There is no contrary outcome, so this is not class 2. The closing record should say so, by reference.
- **N-6.** Deviations 3, 4, 7, 8, 9 and 10 change no claim, need no amendment, and do not bear on §8.
  - Deviation 4, running the notice from its own thread and joining it, still runs notify before the delay, as §3 says.
  - Deviation 9's `CancelNotice` is Amendment 2 row B's single mutex over two values.
  - For deviation 10, CI's own clippy (13 checks green) is the floor.
- **N-7.** `note_discarded` is `pub`, like `note_generated` and `note_written`. Its product caller is `discard_queued`. `pub(crate)` would be tighter. No action is needed.
- **N-8.** On a source that ignores its own cancel, the drain discards without bound. The `SourceCancel` contract, where the notice runs after the implementor's cancel has taken effect, excludes this. Recorded, no action.
- **N-9.** The placeholder string needs a P6 sight-list home. §9 has no Operator gate. The closing record should name where the string waits for the human.

## Checklist (form §9, Architect, with Amendment 2's additions)

**§21a, form choice after the outcome.** The full form is still right: the piece touches the data plane, a stated guarantee (C1 to C3) and an ADR-004 interface. Product is 254 lines, above §21c's 150.

**ADR-004.**
- `on_cancel` is a provided method whose default drops notify unrun (lines 142-144 of `transport.rs`).
- None of its names or doc words is on the scan's forbidden list. `no_transport_leakage` passes 4 of 4.

**ADR-010.**
- Rule 6: no constant is added. The plateau of 5 sits inside the declared MAX_INFLIGHT_BATCHES + 1 (round 54, OPEN-1). The README's recovery policy is unchanged.
- Rule 7 and round 5, item 4, ruled as Amendment 2 asks: the exemption holds for `batches_discarded()`.
  - It is a read-only accessor over a counter the shipped writer maintains, through `note_discarded` from `discard_queued`.
  - It has no product reader.
  - Its doc says its only caller is the test suite, names all four tests by full name (each calls it), and says why the property must be proven of the shipped build.
  - Its last sentence is S1-1's overclaim; the exemption itself stands.

**ADR-018.** The notice is `owner_cancelled`, not called cancel_observed. `observe_cancel` and `observed_at` are unchanged. The owner path never calls `observe_cancel` (lines 241-252). Pass.

**The shape ruling, point by point** (the directive, lines 7-15).
- Credit gates batch frames only: yes (T2, T3a; M2).
- No terminal held for credit, whether after a producer failure (from the pump's receipt, under OPEN-2's bound; T3a, T3b), after an SKP cancel (T1, T1b; session end by code-path identity), or at completion (T2): yes.
- Every batch before the terminal at completion: FIFO, and T2 asserts it.
- An SKP cancel keeps TERM_PRODUCER_FAILED: T1 asserts it. The skp cancel test passes 20 of 20 and is unchanged (reviewer's diff).
- No wire change: `wire.rs` is in the must-print-nothing set, and the new string is a detail, not a code.
- Ceilings do not grow.
- Queued batches and the engine question went to the human as round 54.
- ADR-012 stays Proposed and untouched.

**Round and item cites, each resolved against its RULED block:**
- the 2026-10-05 direction, line 1;
- round 43, item 2;
- round 25, item 1 (a);
- round 51, item 2;
- round 54, OPEN-1 and OPEN-2;
- round 25, item 2 (c) and (d);
- round 5, item 4;
- round 7, item 1, addition 2;
- entry 132 (dropping a closure that holds a watch sender re-enters nothing).

All resolve. There is no line cite into `DECISIONS-PENDING.md`.

**Seams.**
- `transport.rs` `on_cancel(&self, Box<dyn FnOnce() + Send>)` ↔ the `EngineCancel` impl in `kernel/src/lib.rs` (lines 725-752), with the same signature. The kernel builds it at line 286, and redemption hands over that same cancel. Proven end to end by T1 and T1b from the real shape (SkpHost, a ticket, `ticket_only`, `serve`), and by T6 as a unit test.
- `pump::spawn` returns the receiver and the failure watch, `server.rs` passes both to `drive`, and `drive` takes them as parameters. Proven by T3b, with M3.
- No interface is imagined. Every new item has a product caller or is exempt, apart from S2-1's arm.

**§8 item by item.**
1. Pass. Amendment 1 is at ac0bb0e7 and Amendment 2 at 23aa18fc. #175 merged at a83e95f5. The branch was cut at e4b49efa, and code came after.
2. Pass.
3. Pass, on the worker's figures; the reviewer recomputes.
4. Pass: the payload is sent only after `permit.forget()`, and only the five codes are used.
5. Pass.
6. Pass.
7. Pass: notify runs after the guard drops, in both `cancel` and `on_cancel`, and it only calls `send_replace`.
8. Pass (N-1).
9. Pass: lines 242-250. M4 is observed at 8f5e622e.
10. Pass.
11. Pass: the only timing values are liveness deadlines and fixture delays.
12. Pass: T1 to T6, each with an applied mutation recorded by commit, and no verify-mutation run called an observation.
13. Pass: 15 of 15 failed at ced0450b, before the remedy at 237af6fe.
14. Pass on the worker's figures:
   - Product: 254 (limit 310).
   - Tests: 478 (limit 490).
   - Docs: 26 + 5 (limit 45).
   - Files: 9 or 10 (limit 11).
   - §7 is unedited.
   - Rows A, B and D are class 9 at 23aa18fc, before the tests commit.
15. Fail: S1-1.
16. Pass, on the must-print-nothing set.
17. Pass for the PR. Amendment 3 names branch commits in words. S1-2 is round 15 (e), counted separately.
18. Pass for the kernel index. Part 4's data-plane half points at nothing (below).
19. Pass.
20. Pass: the mark and the slot are under one mutex, and the token's flag is not read.
21. Pass: line 387.
22. Pass: lines 371 and 381. The halt-path drops are not 2d discards, which is S1-1's scope.

**Amendment 3.** The class-2 record stands. Its first line states that it was written post-outcome. The diagnosis fits tokio's non-stealable LIFO slot: a wake issued inside the worker that then blocks for 2 s waits behind that block. The fix changes no product line. T4 now discriminates: it passes 10 of 10 unmutated, and under M4 it fails with code 2 in place of 1, both at 8f5e622e. M1 and M6 stand at 237af6fe. The record's one defect is S1-2.

**Deviation 5 against §2d and §8 item 10:** S2-1 and N-1. No claim changes and no amendment is needed.

## lead-data pilot (piece 1)

- **Impact read.** I found no pointer wrong.
  - One was missing: the existing `SourceCancel` implementors a trait change must keep compiling (`candidate_a.rs`, `stream_registry_bound.rs`, `origin_header_encoding.rs`, and three kernel test modules in `skp.rs`). The architect found them at drafting (form §2a), and they caused no correction round.
  - The process-global trace slot (form §0.10) was also found at drafting. It is a test-design fact, not an interface, so I did not count it.
  - The form used the read's 1a, 1b and 1c pointers and its question 1 (the §2 path table) and question 5 (§0.7).
- **Index update.** Kernel/README.md is complete and correct at 3f7b1949:
  - Last verified at d60a0bed;
  - the new cancel-seam line under Interfaces owned. It names the data plane's trait implemented by the kernel's `EngineCancel`, which is acceptable as the kernel's side of the seam;
  - the form added to the kernel halves list, which doubles as Part 4's preregistrations bullet;
  - the pointers it left unchanged are rightly unchanged. Engine's index is rightly unchanged.
  - Optional: T1b could also pin the Close ordering line.
- **Part 4's wording.** It names an owner's-index update in `protocol/data-plane/README.md`, a section that does not exist. That is a drafting defect, mine, not lead-data's. The closing record needs one class-3 row: Part 4's data-plane index pointer is withdrawn, because the owner's index is the kernel's (pilot §1, item 2). D-4 and §8 item 18 are then discharged by kernel/README.md's index at the merge commit.

## Closing-record list (D-5), after the merge; references and hashes only

Use full ids from `git rev-parse`. Every pin goes on one line, at the PR #176 merge commit, which is on main. Merge with a merge commit, never a squash, so that ced0450b, 237af6fe, 8f5e622e, d60a0bed, 3f7b1949 and the fix commit stay reachable.

1. First line: written after the outcomes (class 1).
2. D-1: Amendment 1, by amendment.
3. D-2: M0 is worker report 1's M0 section, at Amendment 4's pin; do not restate it. P-1 is observed as to the deadline only (deviation 6, by reference).
4. D-3, the tests, each span pinned:
   - T1 and T1b in `kernel/tests/skp_cancel_terminal_without_credit.rs`;
   - T2, T3a, T3b, T4 and T5 in `protocol/data-plane/tests/candidate_a.rs`;
   - T6 in `kernel/src/lib.rs`.
5. D-3, the mutations, by reference to the report's mutation section:
   - M1 and M6 @ 237af6fe…;
   - M2 to M5, M7 and M8 @ 8f5e622e…;
   - M4's class 2, by Amendment 3.
   - The repeat runs are @ 8f5e622e, by reference.
6. Rows A to D:
   - the `batches_discarded()` doc span, after the S1-1 fix;
   - the placeholder literal span (P-11);
   - where the string waits for P6 (N-9).
7. D-4: the span of kernel/README.md's Owner's index, plus the Part 4 class-3 row above.
8. Part 4: the span of `protocol/data-plane/README.md`'s new section and of its START_TIMEOUT line.
9. §7: figures by §7's own commands at the final head, against 310 / 490 / 45 / 11, with the must-print-nothing output. Class 8 only if a figure is over.
10. Commits beyond the Order line not yet recorded: 3f7b1949 and the S1-1 fix, by full id.
11. S1-2: Amendment 4, by amendment.
12. Superseded index.
13. PR #176's merge commit id. Both gate reports and their scoped reads, by path under `state/consults/gates/`.
14. Done commit: PLAN done, with evidence `{pr}` only in that commit.

**Files:**
- `C:\dev\spatial-ide\protocol\data-plane\TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md`
- `C:\dev\wt\dptwc-head-3f7b1949\protocol\data-plane\src\adapter_ws.rs`
- `C:\dev\wt\dptwc-head-3f7b1949\protocol\data-plane\src\transport.rs`
- `C:\dev\wt\dptwc-head-3f7b1949\protocol\data-plane\src\pump.rs`
- `C:\dev\wt\dptwc-head-3f7b1949\protocol\data-plane\src\server.rs`
- `C:\dev\wt\dptwc-head-3f7b1949\protocol\data-plane\README.md`
- `C:\dev\wt\dptwc-head-3f7b1949\protocol\data-plane\tests\candidate_a.rs`
- `C:\dev\wt\dptwc-head-3f7b1949\kernel\src\lib.rs`
- `C:\dev\wt\dptwc-head-3f7b1949\kernel\tests\skp_cancel_terminal_without_credit.rs`
- `C:\dev\wt\dptwc-head-3f7b1949\kernel\README.md`
- `C:\dev\spatial-ide\state\consults\2026-10-05-data-plane-terminal-without-credit-worker-report-1.md`
- `C:\dev\spatial-ide\state\consults\2026-10-05-data-plane-terminal-without-credit-index-update.md`
- `C:\dev\spatial-ide\state\consults\2026-10-05-data-plane-terminal-without-credit-impact-read.md`
- `C:\dev\spatial-ide\state\directives\2026-10-05-human-direction-data-plane-mods-v1-pilot-v2.md`
- `C:\dev\spatial-ide\state\directives\2026-10-05-round-54-open-1-open-2-ruling.md`
