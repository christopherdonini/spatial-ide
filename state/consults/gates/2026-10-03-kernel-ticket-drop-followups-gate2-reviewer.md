*Custodian's filing note (2026-10-03): the gate-2 reviewer for PR #168 (node 9) wrote this report to this path itself, through its shell as its brief permitted, under the 2026-10-03 trial directive (part 1). It is committed as written, below the rule. The hash of record of the report as written, from this file's line 5 (the report's first line) to the end, is 7a011984e8ec804c791d5bf11b3ac864c9892dd089c97646babc29d8b0bef7c5, computed by the custodian. It equals the reviewer's returned sha256.*

---

VERDICT: PASS
Reviewed cut/kernel-ticket-drop-followups @ afaa990b1b081bed498cbc1caa06a1f812c4f426. PR #168, gate 2, reviewer.

Scope: correction round 1, `git diff 86774b06 afaa990b` (8195789b, ca005fe0, afaa990b): `kernel/TICKET-DROP-FOLLOWUPS-PREREGISTRATION.md` +44, `kernel/src/skp.rs` +18/-24. `git fetch` at the start: origin's branch head afaa990b1b081bed498cbc1caa06a1f812c4f426, equal to the brief's; `cut/kernel-ticket-drop-followups-p1-base` at 7ba142dae1670583a994cbf1497b5289e2efa209. Re-read with `git ls-remote` at the end: unchanged. Every tool claim below is at the tools' commit afaa990b (`scripts/` is unchanged from the merge-base 4c50677c: `git diff --quiet origin/main...HEAD -- scripts` rc 0).

## S1 — blocking

None.

## Checklist

1. **S1-1 is resolved.**
   - Helper `UnwindSetup::put_p_first` in `kernel/src/skp.rs` at afaa990b (branch commit, named; not pinned by hash). Under the lock it computes `two` (`map.len() == 2` and both of P's and Q's keys present); only when `two` holds and the first key of `map.keys()` is not P's does it `std::mem::swap` the two values from `map.values_mut()` and `std::mem::swap(&mut self.p, &mut self.q)`. No `remove`, no `insert`, no `TicketState` dropped. It drops the guard, then `assert!(two, "{test}: the map does not hold exactly P's and Q's entries")`, so a wrong map fails by name. With exactly two entries and P not first, the first value is Q's, so after both swaps `self.p` names the first key and that key holds P's `Pending` state. `TicketState` carries no copy of its key, and neither key is attributed before the helper runs (`attribute_p` follows; Q is never attributed), so nothing else is keyed by the swapped names. Read against the registry: PASS.
   - T3 alone, the test binary `spatial_kernel-ae7e60b79ca7d0aa.exe` built at afaa990b run directly with `<T3 path> --exact`, one process per run: **120 runs, 120 passed, 0 failed.**
   - Probe (mine, not a recorded mutation, reverted): with the swap disabled (`if false && two && ...`), T3 alone failed 22 of 40 runs (the failures panicked at `kernel\src\skp.rs:3551:13`, the `ticket_liveness` assertion), 18 passed. So the swap branch is taken on roughly half the draws, and it is what makes T3 pass. Reverted with `git checkout -- kernel/src/skp.rs`, porcelain empty, binary rebuilt at the head.
   - `cargo test -p spatial-kernel --lib skp::`, 3 runs: rc 0 each, `50 passed; 0 failed` each.
2. **Amendment 1 against the code.**
   - Pure append: 86774b06's form is a byte-prefix of afaa990b's (`cmp` over 86774b06's byte length: identical). §0 to §9 unchanged. The appended 44 lines are byte-identical to lines 16 to 59 of `state/consults/2026-10-03-kernel-ticket-drop-followups-lead-data-amendment-1.md` (the fenced block inside the report that starts at its line 5). LF only.
   - Item 2: the swap as stated; attribution after it (`s.put_p_first(T); s.attribute_p();`); T3's call and its four assertions unchanged (the T3 body's only change is the helper's name); T1 and T2 do not use the helper. No product-code change: afaa990b's `kernel/src/skp.rs` above the first test item (line 2283) is byte-identical to 86774b06's. PASS.
   - Item 3: `grep -c MAX_REKEY_ATTEMPTS kernel/src/skp.rs` gives 0; `put_p_before_q` and `1c8cea2207e2` also absent from `kernel/src` and `kernel/README.md`. PASS.
   - Item 6: `git diff --numstat 4c50677c..afaa990b -- kernel/src/skp.rs` gives `284 26`, 310 of 320. Within §7; no class 8 is due, and §7's line is not edited. (Item 6 expected about 306; N1.)
   - Item 1's cites resolve: S1-1, checklist items 3 and 4, and the exit-code table in the gate-1 reviewer report; "C4 of the 2026-10-03 lead-data clarification" resolves to C4 of `state/directives/2026-10-03-lead-data-pilot-clarification.md` (draft-caused class). Item 5's cites into worker report 1 (P1 at 2813aead; M1 to M3 and O1 at 1c8cea2207e2) resolve at its rows for those commits.
3. **P1's composition.**
   - At 7ba142da, `kernel/src/skp.rs` lines 1 to 2258 (everything above the first `#[cfg(test)]` item's doc comment) are byte-identical to 4c50677c's: the product part is the merge-base's. 4c50677c's `kernel/src/skp.rs` is also unchanged from c9f41126's (`git diff --stat c9f41126 4c50677c -- kernel/src/skp.rs` empty), so P1's base is §5 P1's code.
   - From the `#[cfg(test)]` line of `mod ticket_drop_under_lock_regression` to the end, 7ba142da is byte-identical to F (ca005fe0). `mod tests` is identical too. The test region differs from F's in two lines only, both in the outer `///` doc comment of `mod ticket_drop_under_lock_regression`, which is 4c50677c's (S2-1).
   - Re-observed once in a scratch worktree `C:/dev/wt/gate2-tdf-p1` at 7ba142da, target `D:/wt-targets/gate2-tdf-p1` (a copy of the branch's target), `cargo test -p spatial-kernel --lib an_unwind_through`: rc 101, `0 passed; 3 failed`, finished in 5.25 s; T1 `...: StreamRegistry::cancel did not return within 5s`, T2 and T3 `...: StreamRegistry::cancel_all_for_dataset did not return within 5s`; none on the helper's message. P1 holds. Worktree removed and pruned, target deleted.
4. **M1, M2, M3 at the head**, each applied by hand with `sed`, run twice with `cargo test -p spatial-kernel --lib an_unwind_through`, reverted with `git checkout -- kernel/src/skp.rs`, porcelain empty after each.
   - M1 (`cancel`: `let swept = Self::sweep_locked(..)` after the guard): runs 1 and 2 rc 101, T1 FAILED (`an_unwind_through_cancel_drops_its_swept_source_after_releasing_the_guard: StreamRegistry::cancel did not return within 5s`), T2 and T3 ok.
   - M2 (the same in `cancel_all_for_dataset`): runs 1 and 2 rc 101, T2 FAILED (`...: StreamRegistry::cancel_all_for_dataset did not return within 5s`), T1 and T3 ok.
   - M3 (`cancel_all_for_dataset`: `retired` declared after the guard): runs 1 and 2 rc 101, T3 FAILED (`...: StreamRegistry::cancel_all_for_dataset did not return within 5s`), T1 and T2 ok.
   - Each fails exactly its own test by timeout. P3 holds; no run failed on the helper's message.
5. **The record.**
   - Worker report 3 against item 4: P1 5 runs at 7ba142da with rc and messages, the composing method named (the splice) and the commit named; M1 to M3 5 runs each at F, rc and messages; P2's T3-alone 100 runs at F (the binary run directly, stated as deviation 1), 5 `skp::` runs at F, §9's suites once at afaa990b; O1 not re-made, per item 4. Consistent with item 4. My runs agree with each.
   - Item 4's last P2 bullet (CI's push and pull_request runs at the head) is not in worker report 3, which says it was not the worker's to read. I read them: both success at afaa990b (exit codes, below).
   - The three doc comments of T1, T2 and T3 name `ca005fe0f3a2` as the commit each mutation was observed at, and their failure messages match what I observed. No record calls a `verify-mutation` run an observation of a mutation (worker report 3 calls it "a recording check; it is not an observation of any mutation").
   - Owner's index (`kernel/README.md`): symbol pointers only, no line cites into `skp.rs`; every pointer still resolves at afaa990b.
   - Nothing stale or wrong found that the round introduced, beyond N1 and N2.

## Exit codes (each as it came out, at afaa990b in `C:/dev/wt/ticket-drop-fu` unless stated)

| Command | rc | Result |
|---|---|---|
| T3 alone, binary direct, 120 runs | 0 each | 120 passed, 0 failed |
| T3 alone with the swap disabled (probe), 40 runs | 0 or 101 | 18 passed, 22 failed; reverted |
| `cargo test -p spatial-kernel --lib skp::`, 3 runs | 0, 0, 0 | 50 passed, 0 failed each |
| P1 at 7ba142da (scratch worktree), 1 run | 101 | 0 passed, 3 failed, all by timeout |
| M1, M2, M3, 2 runs each | 101 each | exactly the mutation's own test failed by timeout |
| `cargo test -p spatial-kernel` | 0 | 39 targets, 321 passed, 0 failed, 28 ignored |
| `cargo clippy -p spatial-kernel --all-targets` | 0 | 20 individual warnings (baseline 20); in `kernel/src/skp.rs` only the baseline `type_complexity` at line 277 |
| `cargo fmt --all -- --check` | 0 | clean |
| `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`, run 1 | 1 | 415 tests, 414 pass, 1 fail: `stop-queue: caches a successful origin/main HALT probe for 60s (finding 17)` (26604 ms; it ran while the P1 build was compiling; N3) |
| the same, run 2 | 0 | 415 tests, 415 pass, 0 fail |
| `node scripts/plan/verify-cites.mjs` | 0 | PASS (38 loose references advised, none in the diff) |
| `node scripts/plan/verify-quotes.mjs` | 0 | PASS, 113 checked, 82 verified, 30 baselined |
| `node scripts/plan/verify-test-claims.mjs` | 0 | PASS, 486 claimed tests |
| `node scripts/plan/verify-mutation.mjs --base origin/main --head HEAD` | 0 | PASS: a recorded-mutation text names each of the 3 new tests (a text check, not an observation) |
| `timeout 1200 node scripts/plan/verify.mjs --offline` | 0 | PASS |
| `gh pr checks 168` | 0 | all pass. Product CI push run 37133969866 (event push, headSha afaa990b1b081bed498cbc1caa06a1f812c4f426, success): its `cargo test --workspace (windows-latest)` job 111234603906 passed, and its log lists T1, T2 and T3 as ok, with `141 passed; 0 failed` for the kernel lib. The pull_request run 37133972215 at the same sha succeeded, Windows job 111234602194 pass |

## S2 — suggestions

- **S2-1.** P1's composition takes the outer `///` doc comment of `mod ticket_drop_under_lock_regression` from 4c50677c, not from F. Two lines differ from F (paraphrase): 4c50677c's line-cite forms into `engine/src/stream.rs` and `kernel/src/lib.rs`, where F has the symbol forms from §2.5. They are comments only and cannot affect the observation. Worker report 3 states the splice boundary exactly (4c50677c's lines 1 to 3016, then F from the module's `#[cfg(test)]` line), so its record is accurate. If the closing record describes P1's tree, cite that boundary, not "F's test module" as the P1 commit's subject has it.
- **S2-2.** The closing amendment's references (item 5) should also cite the CI runs above for item 4's last P2 bullet. Worker report 3 does not carry them.

## N — nits

- **N1.** Item 6 expected about 306 at the final head; the count is 310 (284 + 26). It is within 320, and a forecast is not a ceiling, so no class is due.
- **N2.** T3's doc comment still frames the `CancelledBeforeRedeem` check as the guard against a failed precondition passing vacuously (paraphrase). After the swap, the precondition's only failure is the two-entry assert. What the check now guards is item 3's labelled order assumption, and I4's second clause. Rewording is optional.
- **N3.** The hooks test `stop-queue: caches a successful origin/main HALT probe for 60s (finding 17)` failed once under concurrent build load, then passed on the rerun. `scripts/` is not touched by this branch, so this is off-scope here. It is noted as a possible timing flake.

## State left

`C:/dev/wt/ticket-drop-fu`: porcelain empty, HEAD afaa990b, every mutation and the probe reverted. `C:/dev/spatial-ide`: HEAD 4267a824, with the untracked `.codex-remote-attachments/` and worker report 3 as found, and this unstaged file as my only addition. Scratch worktree `C:/dev/wt/gate2-tdf-p1` removed and pruned; `D:/wt-targets/gate2-tdf-p1` deleted; my temporary files under the user temp directory deleted. No cargo, rustc or test process left running. No commit, no push, no tracked edit.
