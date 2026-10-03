*Custodian's filing note (2026-10-03): the gate-2 architect for PR #168 (node 9) returned this report as its final message; the architect agent type has no Write tool. The custodian saved the hand-back text, with the harness's indentation removed, and committed it as saved, below the rule. The hash of record, from this file's line 5 (the report's first line) to the end, is ecb8ce0da9c75c9744bb4483b2df20de1d6bc5b9ace56d0859396c90b3161296, computed by the custodian; the agent returned "sha256: not computed". Write audit PASS by `scripts/hooks/subagent-write-audit.mjs`: zero write calls and no shell call (Read 14, Grep 10, Glob 3). C3: the one worktree difference after its run (kernel/src/skp.rs modified) was the parallel gate-2 reviewer's mutation in progress, reverted by the reviewer (the worktree was clean at the reviewer's end); the architect made no write. Its PASS condition, CI's push and pull_request runs at the final head, is met: Product CI Rust workspace runs 37133969866 (push) and 37133972215 (pull_request) at afaa990b, both success.*

---

VERDICT: PASS
Reviewed cut/kernel-ticket-drop-followups @ afaa990b. PR #168, gate 2, architect.

The head is from `.git/refs/heads/cut/kernel-ticket-drop-followups` and from origin's ref, both afaa990b1b081bed498cbc1caa06a1f812c4f426. The P1 branch's ref `origin/cut/kernel-ticket-drop-followups-p1-base` is 7ba142dae1670583a994cbf1497b5289e2efa209. The scope is correction round 1: §10 Amendment 1 (appended at 8195789b), and F = ca005fe0 plus afaa990b in `kernel/src/skp.rs`. Every cite below is read at afaa990b unless another commit is named.

**S1 (blocking): none.**

The PASS holds only if one input I cannot read is green: CI's push and pull_request runs at the final head. Amendment 1 item 4 makes them part of P2, and worker report 3 leaves them unread. If either run is red on T3, P2 is missed again, I4 fires, and this PASS is void. Gate 1's flake showed up only in CI's push run, so this condition matters.

**Judgments**

1. **Classes: right, and nothing goes to the human.**
   - **Class 1.** The amendment was written after gate 1's results and before code: 8195789b comes before F. It says so in its first body line. It records the result (I4 fired, P2 missed) and what that invalidates: §4's T3 Precondition bullet, §7's `MAX_REKEY_ATTEMPTS` bullet and assumption, and the P1, P2 and P3 observations made before it. A re-declared test setup after a gate finding was read as class 1 before: `kernel/RAW-PATH-CREATE-REFUSAL-CODE-PREREGISTRATION.md` §10, Amendment 1, with Amendment 2's "Readings the gate made".
   - **Class 2** fits the missed P2. §5's predictions are not edited.
   - **No other class fits better.** No ruling narrows anything (class 5). No standing rule adds work (class 9). No mutation is corrected; they are re-observed (class 4). The count is 310 of 320, so there is no overrun (class 8).
   - §10's routing clause, "if none fits, that is a finding to route to the human" (`docs/PREREGISTRATION-TEMPLATE.md:98`, a sub-line span byte-copied, hash not computed), does not engage.
   - **Continuing after I4 fired is not a red line.** The piece stopped and was reported (the gate-1 FAIL), and the change came as an amendment before any code. T3 is not weakened (Judgment 2), so I1's "No test is weakened to fit" is not offended either.

2. **The swap: sound and deterministic, and T3 is not weakened.**
   - **Deterministic.** `put_p_first` (`kernel/src/skp.rs:3501-3518`) checks that the map holds exactly P and Q. If P's key is not first in `keys()`, it swaps the two values through `values_mut()` and swaps the names `self.p` and `self.q`. With two values the swap is symmetric, so it does not depend on whether `keys()` and `values_mut()` agree in order. No insert, no remove, no rehash. The assert runs after `drop(map)`, so a failed check poisons nothing.
   - **Keys carry no state.** `TicketState` (`:120-142`) holds no key. `attribute_ticket` (`:621-634`) writes only `GenerationRegistry`'s own map. Q is never attributed. P is attributed after the swap under its final key, so `ticket_liveness(&s.p)` and `map.get(&s.p)` read P's real state.
   - **T3 is intact.** It still calls the real `cancel_all_for_dataset("ds_d")` (`:3613-3615`). It keeps the timeout check, the unwind check (`expect_err` plus a payload naming the test), P's `EndedBySourceChange` (`:3551-3555`) and P's `CancelledBeforeRedeem` (`:3616-3623`). Product code (`:115-405`) is untouched by F and afaa990b.
   - **Item 3's assumption is sound.** Between the helper's guard and the call's `values_mut()` loop (`:375`), nothing touches `tickets`. The call's `sweep_locked` (`:195-213`) removes P only after `TICKET_TTL` and Q only after `TERMINAL_ENTRY_MAX_AGE`. The one remaining dependence is I4's second clause: `values_mut` must follow `keys()` order. The `CancelledBeforeRedeem` check tests that on every run, and it fails by name.
   - **Caller rule holds.** The helper is a private method in `#[cfg(test)] mod ticket_drop_under_lock_regression`. There is no `pub` item, no `cfg(test)` branch in product code, and no seam. The seam is unchanged from gate 1: the stubs implement the real `spatial_data_plane::transport` traits.

3. **Item 4's observations: sufficient as recorded, plus the CI condition above.**
   - P1: 5 of 5 at 7ba142da, all three tests timing out, none on the helper's message. M1 to M3: 15 of 15 at ca005fe0, each failing only its own test by timeout. T3 alone: 100 of 100 at ca005fe0, a fresh process and so a fresh hash seed each run. `skp::`: 5 of 5. Suites: once at afaa990b. Each is recorded with its commit and rc in worker report 3.
   - The P1 composition is named as a method plus a commit on its own pushed branch. Its diff statement (237 insertions and 4 deletions, all inside the regression module) is the proof that the product code is 4c50677c's. The reviewer re-verifies it.
   - The doc comments name `ca005fe0f3a2` (`:3563`, `:3582`, `:3603`), and no record calls a `verify-mutation` run an observation.
   - Not reaching the 306-line estimate is not a deviation, since it was not a registered prediction (N1).

4. **§1 and §8: nothing moved.**
   - §1's claims, §3's table, §5's predictions, the declared-unchanged list and §6's rows all read the same.
   - §6's precondition row is still the state of P's entry, read under the lock at `:3616`.
   - §8 by item:
     - 4: no seam;
     - 5: no new file; `kernel/README.md` is still 3/3 per worker report 3;
     - 6: T3 keeps `CancelledBeforeRedeem`;
     - 10: mutations recorded with their commit;
     - 1 to 3 and 9: product code untouched;
     - 8: clippy is the reviewer's to re-run (N2).
   - The owner's index needs no update. Its T1 and T3 pointers and the form's path are unchanged. Neither `put_p_before_q` nor `MAX_REKEY_ATTEMPTS` was indexed. "Last verified at 4d487d51" stays true.

5. **C4: draft-caused is right, and the Stop list does not engage.**
   - The re-key-P-only precondition and the uniform-hash assumption appear first in lead-data's draft 1 (`state/consults/2026-10-03-kernel-ticket-drop-followups-lead-data-draft.md:191`, `:255`). Draft 2 carries them, the form commits them as drafted, and worker report 1 implemented them as drafted. The architect's drafting consult never mentions them.
   - My gate-1 report also missed it: §8 item 6 was passed "as written". That is a gate miss. It is not a C4 class, and it does not move the attribution.
   - The Stop line, "the lead's draft adds a correction round on two of the four pieces" (`state/directives/LEAD-DATA-PILOT-2026-10-03.md:92`, a sub-line span byte-copied, hash not computed), counts pieces. This is the first piece, so the count is 1 of 4. A further draft-caused round on node 9 would not raise it.
   - The trial log records node 9 as lead-drafted, with correction round 1 draft-caused. Amendment 1 is lead-drafted too, so its gate-2 outcome is measured lead output.

6. **Nothing else blocks.**
   - The Round 25 gate failures do not apply:
     - there is no §7 overrun (310 of 320);
     - there is no scope addition;
     - no record calls `verify-mutation` an observation;
     - no test-text span is pinned at a branch commit;
     - this is a full form.
   - The amendment has no verbatim passage and no "discharged" or "done" clause.
   - The amendment is a substantive post-result correction, not a record correction, so round 12 (d)/(e) and the record-cap count do not apply. The RAW-PATH precedent carried no superseded index. The record-round count is 0.
   - Append-only against the base 4c50677c: by reading, lines 190, 232 and 255 sit where the gate-1 reviewer's 4c50677c pins put them. Byte identity of §0 to §9, and of Amendment 1 against the draft's fenced block (filing note: "appended verbatim"), is the reviewer's to recompute.

**What the closing record must reference (references only, under the record cap)**
- **The merge:** a merge commit, not a squash, with these commits reachable from main: 2813aead, 1c8cea2207e2, 4d487d51, 86774b06, 8195789b, ca005fe0, afaa990b. The test comments name ca005fe0f3a2, and the index names 4d487d51.
- **P1's composed commit:** 7ba142da on `cut/kernel-ticket-drop-followups-p1-base`, named by branch and commit. The record states that it is not reachable from main and that the branch is kept. It is not hash-pinned (round 15 (e)).
- **The gates:** the gate-1 architect and reviewer reports, and the gate-2 architect and reviewer reports, by path.
- **Observations of record:**
  - worker report 3 for P1 at 7ba142da, M1 to M3 at ca005fe0, P2 at ca005fe0 and the suites at afaa990b. Worker report 3 must be filed and tracked first; it is untracked in the main checkout now;
  - the CI push and pull_request run ids at the final head;
  - O1 at 1c8cea2207e2 (worker report 1) and at 86774b06 (gate-1 reviewer, checklist item 3);
  - worker report 1's P1 at 2813aead and M1 to M3 at 1c8cea2207e2, labelled as superseded by Amendment 1, item 1. Item 5's list does not label them.
- **Readings:** Amendment 1 is class 1 and class 2 (this report, Judgment 1), and draft-caused under C4 (Judgment 5).
- **Size:** the counting command's figure at the final head. Worker report 3 gives 310 of 320 at afaa990b. No class 8.
- **Routed:** gate-1 architect S2-1 goes to `module-docs-stale-statements`.

**S2**
- **S2-1.** File worker report 3 on main with a filing note before the closing record cites it.
- **S2-2.** The custodian reads and records both CI runs at the final head before the closing record (the S1 condition).

**N**
- **N1.** The count came to 310, not the estimated "about 306". It was an expectation, not a registered prediction, and it is within §7.
- **N2.** Clippy baselines are counted two ways: worker report 3 says "20 individual warnings", and the gate-1 reviewer says "37 `warning` lines". The reviewer should state the count at the base and at the head under one counting rule.
- **N3.** Amendment 1 item 2's "the map's layout and order do not move" holds for the helper's own guard. Across the call, the claim rests on item 3's assumption, which is how the amendment states it.

Files read: `C:/dev/wt/ticket-drop-fu/kernel/TICKET-DROP-FOLLOWUPS-PREREGISTRATION.md`, `C:/dev/wt/ticket-drop-fu/kernel/src/skp.rs`, `C:/dev/spatial-ide/state/consults/gates/2026-10-03-kernel-ticket-drop-followups-gate1-reviewer.md`, `C:/dev/spatial-ide/state/consults/gates/2026-10-03-kernel-ticket-drop-followups-gate1-architect.md`, `C:/dev/spatial-ide/state/consults/2026-10-03-kernel-ticket-drop-followups-lead-data-amendment-1.md`, `C:/dev/spatial-ide/state/consults/2026-10-03-kernel-ticket-drop-followups-worker-report-3.md`, `C:/dev/spatial-ide/docs/PREREGISTRATION-TEMPLATE.md`, `C:/dev/spatial-ide/state/directives/2026-10-03-lead-data-pilot-clarification.md`, `C:/dev/spatial-ide/state/directives/LEAD-DATA-PILOT-2026-10-03.md`, `C:/dev/spatial-ide/kernel/RAW-PATH-CREATE-REFUSAL-CODE-PREREGISTRATION.md`.

sha256: not computed
