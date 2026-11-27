Reviewed: PR 361, the branch cut/opened-of-panic-frees-the-lock at d2b8b6e3b0e98f783a9c0295ccecacd871d30fc2, in C:/dev/wt/dpanic, with the form and its rulings in the detached read worktree C:/dev/wt/read-1122 at 4fa8070fbb44bbc6d9e349375d0d13b66e66dd14 (the custodian's filing note, 2026-11-23: the architect's build gate of node (d), node:opened-of-panic-sites-free-the-lock@build-gate-architect-1, dispatched at 2026-11-23T03:52:37Z after the reviewer's D2 was applied as d2b8b6e3b0e98f783a9c0295ccecacd871d30fc2; its run: Glob 4, Read 28, Grep 13, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-23T03:52:43Z to 2026-11-23T03:58:59Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 13028 bytes, sha256 028b4a29ca768a8e6de137565a2ffc1db8d7f5ef1772887b764c7da9aa809202, byte for byte, nothing masked, with one final newline added. PASS WITH NOTES: no Correctness, Evidence or Documentation finding; its six notes are for the closing amendment, the first the sentence ADV-2026-11-22-41 item 2 asks for, in the gate's words. The piece merges after the tag.)

---

Verdict: PASS WITH NOTES
Reviewed: C:/dev/wt/dpanic @ d2b8b6e3b0e98f783a9c0295ccecacd871d30fc2
REPORT PATH: state/consults/gates/2026-11-23-opened-of-panic-sites-free-the-lock-build-gate-architect.md

Tag: node:opened-of-panic-sites-free-the-lock@build-gate-architect-1. Branch `cut/opened-of-panic-frees-the-lock`, PR 361 (draft), base B 1938c1b50b84587adaaa747a5ffc23cea092d17b. The code cites below are at the head. The form and the rulings are read at 4fa8070fbb44bbc6d9e349375d0d13b66e66dd14 in `C:/dev/wt/read-1122`. I ran nothing.

There is no Correctness finding and no Evidence finding. There is no Documentation finding either: every new or changed doc clause is true at the head (check 9). The notes at the end are what the closing amendment must carry. They are not defects in the diff.

## Checks (§9 as amended)

**1. docs/01, never block (derived rule 1, "Never block the canvas").**
- `open_project_command` has one product caller: the shell binding, on `tokio::task::spawn_blocking` (`frontends/shell/src-tauri/src/commands.rs:214-216`). The only other caller is the test rig (`kernel/tests/project_reopen_skp.rs:168`).
- The guard's `Drop` (`kernel/src/project/mod.rs:943-952`) runs during the unwind, in `reply_of`'s frame, on that blocking thread.
- The close's watch join (`kernel/src/skp.rs:1628-1633`) and the `saved` wait both happen there. Neither touches the canvas path.

**2. The lock's lifetime documents.** Each still says what is true at the head:
- `store.rs:221-223`: freed on drop and at process end. The guard frees it by drop.
- `mod.rs:133-137`, the form's 133-136 shifted by none: "held for as long as this entry is: until [`Projects::release_ended`] finds its open closed". The guard closes, then calls `release_ended`, which finds the open closed.
- `mod.rs:560-561`, the form's 558-560 shifted by +2: `OpenFailure`'s "holds no lock". The guard path is not an `OpenFailure`.
- The module doc (`mod.rs:23-26`) also holds.
- `release_ended`'s doc (`mod.rs:247-260`) now names the guard among its callers (D-6). Its "another close's or a reopen's if that comes first" covers the guard's call, which runs inside the reopen command.
- `store.rs:225-231`, the producer note, lists `release_ended`'s runners without "only", so it is not untrue. `store.rs` is outside Scope (§8 item 3). No finding.

**3. ADR-006 and ADR-018 vocabulary.**
- No new or changed comment uses undo, rollback, transaction, compensation, or any of ADR-018's instants (`cancel_requested`, `cancel_observed`, acknowledged).
- The operation class is unchanged.

**4. The caller rule, and §1's seam reading.**
- `reply_of` is private. Its one product caller is the `Reopen::Opened` arm (`mod.rs:917`); the other callers are K-D1 (`:1639`) and K-D2 (`:1663`), by grep.
- `ReplyGuard` is private and constructed only in `reply_of` (`:929`).
- No `pub` item is added and no `cfg(test)` branch is in product code. The test items (`ChecksOnly`, `Rig`, `rig`, `Rig::reopened`, `Rig::kept`) are all inside `mod tests`.
- §1's seam reading holds:
  - the guard does not catch, so the binding receives the same `JoinError`;
  - the guard runs before tokio's catch, so the lock is free before `skp.open_project_panicked` is replied.
- What is still not tested is the arm's wiring. ADV-2026-11-22-41 item 2 asks for a §1 sentence on it; see the sentence below.

**5. (g)'s K1 (DESCRIBE-FAILS form §4.3).**
- K1 reopens with no panic. At the head, `std::thread::panicking()` is false on that path, so the guard does nothing (`mod.rs:945`).
- The entry is still kept before the reply is built (`mod.rs:870-879`, not changed).
- K1's steps 4 to 6 therefore hold as (g) reads them. (g)'s five paths are untouched.

**6. §8, item by item, at the head.**
1. The diff touches only `kernel/src/project/mod.rs`. Holds.
2. None of (g)'s five paths is touched. Holds.
3. No change to the wire, SKP-V0, `file.rs`, `store.rs`, the binding, a lockfile, a dependency or a workflow. Holds.
4. `open_project`'s body and signature are unchanged: no diff hunk falls in `:703-889`. Holds.
5. No new `pub` item, no `cfg(test)` branch in product code, no test-only hook. Holds.
6. The guard acts only under `panicking()`, holds no lock on entry, and has no `unwrap`, `expect` or `panic!` on its path. The `close_dataset` path recovers from poisoned locks (`skp.rs:1631`, `:1671`), and `release_ended` does too (`mod.rs:262`). Holds.
7. K-D1 and K-D2 have no sleep, no thread, no timeout and no platform ignore; `catch_unwind` runs on the test's own thread. Holds.
8. No declared-unchanged test's assertions are edited. Hunk 5 only appends after `each_save_failure_…`. Holds.
9. Every `RECORDED MUTATION` line carries "OBSERVED at 378c6cfc…" and none calls a `verify-mutation` run an observation. The worker's report calls that run "a heuristic, not an observation". Holds.
10. §7 is not edited. By my count of the diff's hunks the head is 220 insertions and 4 deletions, 224 changed lines, within the 240 ceiling (C3's numstat gave 219 and 4; C4 is +1 net). No overrun. Holds.
11. No ledger cite, no hash pin and no bare self-line in the new comments. Holds.
12. Nothing is merged; the PR is a draft. Holds.

**7. Mutations M1 to M5, read from the code and the logs.**
- **M1**, the `Drop` body emptied. Expected to fail at S1 (ii), because the catalog keeps the handle.
  - `<S>/d-mut-M1.txt`: fails at "S1: (ii) the catalog holds the dataset".
  - The dead-code warning on both fields and the −7 line shift (1048→1041) both match an emptied body.
- **M3**, `release_ended` only. Expected to fail at (ii), since nothing closes.
  - `<S>/d-mut-M3.txt`: fails at (ii).
  - The `dataset` field is unused and the shift is −3, which matches the close's three lines removed.
  - The void first run (`<S>/d-mut-M3-void-unmutated.txt`) is disclosed. It shows C2 green at all three sites.
- **M4**, close only. Expected to pass (ii) and fail at (iii).
  - `<S>/d-mut-M4.txt`: fails at "S1: (iii) `saved` holds its entry". The shift is −1.
- **M2**, the `panicking()` condition dropped. Expected: the reply builds, then the guard closes the dataset.
  - `<S>/d-mut-M2.txt`: K-D2 fails at "the catalog does not hold the dataset", the assertion after the reply's dataset check.
- **M5**, the arm calls `opened_of(*o)`.
  - `<S>/d-m5-build.txt` warns "method `reply_of` is never used" at `mod.rs:926:8`, which is `reply_of` at C2.
  - `<S>/d-m5-base-build.txt` has no warning.
  - `<S>/d-m5-tests.txt` shows every result line ok, 0 failed. The two warnings come from the `(lib)` target only.
- Each named set is the one the code predicts, and each is observed in its log.

**8. The C1 reds.**
- `<S>/d-c1-kd1.txt`: site 3 fires (`:1015:18`), then "S1: (ii) the catalog holds the dataset" (`:1607:13`). That is the stated reason (§4 P0): with no guard, the catalog keeps the handle.
- `<S>/d-c1-kd2.txt`: K-D2 ok, so the run is not I3.
- Limit: I could not read C1's tree, since Read alone cannot show a commit. Its test text is inferred:
  - from C1 to C2, both site 3 and the (ii) assertion move by +33;
  - that is the size of C2's product and doc lines above both, so C2 changed no line between them;
  - the assertion messages in the logs equal the head's.
- The reviewer re-observes P0 (§9). This is not an Evidence gap.

**9. Doc clauses against the code, clause by clause.**
- **`opened_of`'s doc (`mod.rs:1001-1006`).** Joined, it equals D-5 byte for byte.
  - "a line number where it has one": `lineage_refusal_of` (`:1091-1097`).
  - "no rule text and no error text": `Damaged { line, .. }` and `Unreadable { .. }` (`:1095-1096`).
  - The three panic clauses: `:1012`, `:1026`, `:1049` and `:1054`.
  - The `reply_of` clause: the guard.
- **`open_project_command`'s new sentence (`:896-897`).** True by the guard, which runs inside the call.
- **`reply_of`'s doc after C4 (`:921-926`), clause by clause:**
  - "one product caller … arm": grep finds exactly one;
  - "K-D1 and K-D2 … call it directly": `:1639` and `:1663`;
  - "holding no lock": the guard holds only `&Projects` and a handle;
  - "closes the dataset through the host, as `open_project` closes it after a refused write": `:836-839` and `:866`;
  - "then calls `release_ended`, which drops the entry and with it the identity's open lock": the catalog no longer holds the handle, so `retain` drops the entry (`:265-267`), and `ProjectLock::drop` unlocks (`store.rs:255-259`).
  - All true.
- **`ReplyGuard`'s doc (`:937`).** True.
- **`release_ended`'s added clause (`:250-252`).** True.
- **`ChecksOnly`'s doc (`:1496-1497`).** True: `NoWatchArm` is `#[cfg(test)]` and private in `skp.rs:2406-2419`, and it returns the same `ChecksOnly`.
- **`Rig` and `rig` docs (`:1500-1501`, `:1509-1510`).**
  - F1's spec equals `write_f1`'s (`project_reopen_skp.rs:70-81`).
  - `CrsMode::DeclaredLv95` is the default (`engine/src/fixture.rs:688`).
  - `Rig::saved` exists (`project_reopen_skp.rs:135-142`).
  - True.
- **K-D1's doc (`:1598-1603`).**
  - Sites 3, 4 and 1 in S1 to S3: `<S>/d-c2-kd1.txt`.
  - The D-7 reason: `open_project` calls `release_ended` before `try_lock` (`:782-783`).
  - True.
- **K-D2's doc.** True.

**10. Records.**
- The quoted passages in the new comments each match their source byte for byte:
  - "S1: (ii) the catalog holds the dataset", "S1: (iii) `saved` holds its entry" and "the catalog does not hold the dataset": the assertion formats at `:1645-1646` and `:1665` and their logs;
  - "method `reply_of` is never used": `<S>/d-m5-build.txt:2`.
- There is no ledger cite and no line cite in a source comment.
- The named sources (the form's §4 and `Rig::saved`) exist on main.
- The observation commit 378c6cfc reaches main only by a merge commit. §8 item 12 forbids a squash.

## Notes for the closing amendment (not findings)

1. **The sentence ADV-2026-11-22-41 item 2 asks for in §1, in this gate's words:**
```text
No test shows that the product caller calls `reply_of`: K-D1 and K-D2 call it directly. That `open_project_command`'s `Reopen::Opened` arm calls it is shown by reading the arm and by M5, observed at 378c6cfcd42b21691fe40a438d3fc54f0a4cbb4c: with the arm calling `opened_of(*o)`, `cargo build --locked -p spatial-kernel --lib` warns "method `reply_of` is never used", which the unmutated build does not, and every test of `cargo test --locked -p spatial-kernel` passes.
```
2. §7's count goes in at the head d2b8b6e3, not at C3. My count is 220 and 4, 224 lines. The reviewer recounts it.
3. P0's run is recorded with C1's id, cec2d4c277d8a9a4740e79e251c03c9c2a34ca95 (§4). The log itself carries no commit.
4. The void M3 run is disclosed beside M3's observation.
5. Whether a CI job fails on M5's warning belongs to the reviewer (ADV-2026-11-22-41 item 2). My search of `.github/` found no clippy job and no deny-warnings flag. That was a search, not a read.
6. For (g), not this piece: (g)'s form cites `kernel/src/project/mod.rs:265`, which this head moves to `:267`. Its pins are historical at its own drafting commit.

## Files read
- `C:/dev/wt/read-1122/governance/forms/kernel/OPENED-OF-PANIC-SITES-FREE-THE-LOCK-PREREGISTRATION.md` (whole, Amendment 1 first)
- `C:/dev/wt/read-1122/state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-40-node-d-open-1-to-open-4-the-unwind-guard-the-seam-accepted-s-panic-unchanged-for-the-advisors-reason-d-5s-words.md` (whole)
- `C:/dev/wt/read-1122/state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-41-node-d-build-goes-on-with-amendment-1-no-second-gate-attempt-m5-recorded-as-an-observation.md` (whole)
- `C:/dev/wt/read-1122/state/consults/gates/2026-11-22-opened-of-panic-sites-free-the-lock-form-gate-architect.md` (whole)
- `C:/dev/wt/read-1122/governance/forms/frontends/DESCRIBE-FAILS-AFTER-OPENED-CLOSES-THE-HANDLE-PREREGISTRATION.md` (§4, and the K1 and KM1 lines)
- `C:/dev/wt/dpanic/kernel/src/project/mod.rs` (:1-320, :520-1099; the tests through the diff)
- `C:/dev/wt/dpanic/kernel/src/project/store.rs` (:205-264)
- `C:/dev/wt/dpanic/kernel/src/skp.rs` (:1600-1679, :2395-2422)
- `C:/dev/wt/dpanic/frontends/shell/src-tauri/src/commands.rs` (:130-224)
- `C:/dev/wt/dpanic/kernel/tests/project_reopen_skp.rs` (`Rig`, `write_f1`, `Rig::saved`, by grep)
- `C:/dev/wt/dpanic/engine/src/fixture.rs` (:682-703, and `CategoricalZone` by grep)
- `C:/dev/wt/dpanic/docs/adr/ADR-018-what-cancellation-acknowledged-means.md` (headings)
- `C:/dev/wt/dpanic/.github/` (grep only), and every `Cargo.toml` (grep for `panic =`)
- `<S>/d-diff-d2b8b6e3.txt`, `<S>/d-diff-d2b8b6e3-d2.txt`, `<S>/d-numstat.txt`, `<S>/d-build-report.md`, `<S>/d-msg-c1.txt`
- `<S>/d-c1-kd1.txt`, `<S>/d-c1-kd2.txt`, `<S>/d-c2-kd1.txt`, `<S>/d-c2-kd2.txt`
- `<S>/d-mut-M1.txt`, `<S>/d-mut-M2.txt`, `<S>/d-mut-M3.txt`, `<S>/d-mut-M3-void-unmutated.txt`, `<S>/d-mut-M4.txt`
- `<S>/d-m5-build.txt`, `<S>/d-m5-base-build.txt`, `<S>/d-m5-tests.txt` (grep)
- Not read: `<S>/d-rev-gate-1-report.md`, `<S>/d-form-gate-1-report.md` and the main checkout.

Model: claude-opus-5-5 (Opus 5.5).
