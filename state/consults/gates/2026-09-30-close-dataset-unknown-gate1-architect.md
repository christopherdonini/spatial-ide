*Custodian's filing note (2026-09-30): the architect's gate 1 on PR #150, for PLAN node `kernel-close-dataset-unknown-keeps-openrecord` at g1, full gating. Reviewed: cut/close-dataset-unknown @ e1c37b0b4ffede2378982e233e6d65ec28361006 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message (enqueued 2026-09-30T22:00:52Z) with the harness's two-space indent removed, and the text below the rule is the agent's. Its branch-only `path:line` cites are read at e1c37b0. Verdict BLOCK, with the code change itself judged correct. B1 (the form's "by any outcome" is false for a close refused at `check_version`) is taken as correction round 1: the form's Amendment 1 (class 5, a narrowing on this gate) and a one-line comment rewording. B2 (the §9 suites named with tool commits) is met by evidence: the gate-1 reviewer's check 5 (verify-cites, verify-quotes, verify-test-claims and verify.mjs at main 9cf31c8 and at e1c37b0, verify-mutation with its tool commit, all rc=0) and the custodian's `cargo fmt --check -p spatial-kernel` runs (rc=1 with 1046 `Diff in` hunks at both 1e68aba and e1c37b0), recorded in the form's Amendment 2. Profile paths redacted at filing: none.*

---

Reviewed: cut/close-dataset-unknown @ e1c37b0b4ffede2378982e233e6d65ec28361006 (the branch ref was read from `.git/refs/heads/cut/close-dataset-unknown`; I have no Bash, so the diff was read by comparing the worktree against main 9cf31c8, whose `kernel/src/skp.rs` is the same as base 1e68aba's)

**Verdict: block.** Two blockers: B1 needs a record amendment and a one-line comment fix, and B2 needs evidence only. The code change itself is correct.

**1. The diff against §2 items 1–3: PASS.** Base `kernel/src/skp.rs` lines 1444–1446 (main) now sit below the removal at head lines 1450–1454. The only other change is the comment at head 1444–1449. The success path at head 1455–1473 is unchanged: `begin_close`, cancel_all, forget, remove, and it still linearizes at `begin_close` (close-races §2c, §2d). The form swaps §2c steps 1 and 2 and does not edit the close-races form. The refusal is still `SkpError::unknown_dataset(name)` under the same condition. ADR-035 Decision 3 holds: no `invalidate` caller is added. The watch's existing sink simply ends sooner. ADR-018 is not touched, and ADR-006 classes are unchanged. The watcher form's watch-lifetime line (`:159`) says "`close_dataset` first removes the `OpenRecord`". The fix brings the code into line with it, and with `:395` "released at close".

**2. §1's claims and the seam reading: FAIL, B1.** `check_version(&req.skp)?` (head 1442) still returns before the removal. So a close refused as `skp.version_unsupported` leaves the OpenRecord and its watch in place. That makes §1's "by any outcome" false and meets §5's falsification. The product comment at head 1447–1448 repeats the overclaim ("on every outcome, the refusal included"). Moving the removal above the version check would be wrong: a request in an unsupported version must not act. The fix is to narrow the claim instead. The seam reading holds: the shell's `commands.rs:118` passes the result through unchanged, `ArmedWatch` is used as `engine/src/watch.rs:37-39` defines it, there is no new seam, and no end-to-end test is owed. This form is my draft, and the overclaim is my defect.

**3. §8, item by item.**
- 1 PASS.
- 2 PASS, on the custodian's `122 4 kernel/src/skp.rs`, which the reviewer recounts.
- 3 PASS: the guard is a statement temporary released before `drop` (head 1450–1451), and both come before `begin_close`.
- 4 PASS: the early return comes before any generations or tickets call.
- 5 PASS: only lines moved and comments changed. The new structs and helpers are private to the test module.
- 6 PASS: the module's pre-existing `HANG_TIMEOUT` is not used by T1 or T2.
- 7 PASS.
- 8 PASS: all 4 deletions are the product lines, so no existing test line was removed.
- 9 PASS on the commit list.
- 10 PASS: the docs say "Applied at `f4fb9ed`, run and reverted". No `verify-mutation` run is called an observation.
- 11 PASS: 126 changed lines against a ceiling of 150, 1 file.
- 12 PASS: the product comment refers to the form by section, and the test docs carry commit ids, not hash pins.
- 13 pending: the merge style.
- 14 PASS: `close-unknown-keeps-record` and `close-drops-its-watch` each appear once, and the fixture directory `ticket-drop-under-lock` is used only by this module.

**4. T1 and T2: PASS.** T1 asserts, in order: a record is present, the flag is false, `remove` returns `Some`, the code is `skp.unknown_dataset` and its `handle` is the name, the record is gone, the flag is true, and the second close gives the same code. T2 asserts `Ok`, 0 cancelled, record gone, flag true. Neither uses timing, a thread or a hook. `FlagWatch`'s `resolves_unchanged` returns true, which is honest under the `ArmedWatch` contract because it never signals. P0 is recorded at `4f045da`, and M1 and M2 at `f4fb9ed`, in the tests' docs (added in 7f80c8b), as §4 asks.

**5. §2 item 4, R1–R6: PASS.** No `cfg` is added and no boundary file is touched. The tests use `FlagArm`, so they run on every platform. R3 is correctly not engaged: only the moment at which shared code drops a trait object changes.

**6. 7f80c8b and e1c37b0: PASS, no record line owed.** 7f80c8b makes the first recording that §4 orders, inside Scope and counted in §7. It is not a correction. e1c37b0 only reflows the comment this piece added and changes no claim. The reference in that comment stays on one line (round 15 (d)).

**Blocking**
- **B1.** Append a §10 amendment whose first line says it is post-result, as class 5 (a narrowing on a gate). It should narrow §1's "by any outcome", §2 item 2's "release on every outcome" and §5's falsification to "every outcome after the SKP version check". Reword the comment at head 1447–1448 to match. That one comment line is inside §2 item 2's Scope and is counted under §7.
- **B2.** §9 requires these suites green before either gate: `verify-cites`, `verify-test-claims`, `verify-mutation`, `verify:plan` and `cargo fmt --check`. None of them appears in the worker report, which substitutes a count of rustfmt hunks for `cargo fmt --check`. `verify-quotes` is reported without the tool's commit, which §6 item 3 and round 15 (c) require. Name each run with the tool's commit and its exit code, or cite the CI run on PR #150, before the reviewer gate. This is evidence only.

**Non-blocking**
- **N1.** Under M2, T1 also failed (the report's M2 line). T2's doc records only T2. Say so in the B1 amendment or in the reviewer's re-observation.
- **N2.** The report's H1 grep line numbers (1451, 1470) are base or main numbers, not head's (1450, 1472). The reviewer should re-run §6 item 2 at e1c37b0.
- **N3.** The out-of-scope intake row, a close during open admission, behaves the same under the new order. The pending node `kernel-close-during-open-admission` still owns it.

Paths:
- `C:\dev\wt\close-dataset-unknown\kernel\src\skp.rs` (lines 1438–1474 and 3821–3934)
- `C:\dev\wt\close-dataset-unknown\kernel\CLOSE-DATASET-UNKNOWN-KEEPS-OPENRECORD-PREREGISTRATION.md`
- `C:\dev\spatial-ide\state\consults\2026-09-30-close-dataset-unknown-worker-report-1.md`
