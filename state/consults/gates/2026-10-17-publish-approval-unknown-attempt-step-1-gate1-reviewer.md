Reviewed: PR #227 at 39dc2c8e1bf7c72f4bc273487713ebedfb9ce1a2 (base 28163cb6)
Verdict: PASS WITH NOTES. Reviewed as cut/unknown-attempt-step-1 @ 39dc2c8e1bf7c72f4bc273487713ebedfb9ce1a2. One gap: I did not make check 4 (M1) again myself, because the harness's permission classifier refused the edit (see Evidence).

All path:line cites below are at 39dc2c8e.

## Correctness (nothing blocks)

1. **Out-of-scope line, read first.** It names no §21a category as touched.
   - `git diff --quiet 28163cb6 39dc2c8e -- frontends/shell/src frontends/shell/src-tauri protocol engine kernel` exits 0, so none of those paths changed. publish.rs is not in the diff, so `PENDING_ATTEMPT_TTL` is unchanged.
   - §1.7 holds at every changed call site:
     - The only new throw is in `pairRead` (frontends/shell/e2e/exportElapsed.mjs:40-45), and only for an `unknown-attempt` outcome.
     - Every checked execute already failed that outcome by its own assertion: publish.mjs:359, :425, :497 and selection.mjs:584, :604, :727.
     - The ended-path read at selection.mjs:628 still ends in the class-2 throw for any other outcome.
   - The late reads at selection.mjs:651, :662, :673 and :722 are left as they were (§1.6).
2. **§1.1 to §1.6 against the code: they hold.**
   - **Stamps.**
     - p0 and p1 are taken around the prepare's evaluate (exportElapsed.mjs:49-52).
     - e0 is taken before the execute's evaluate or the in-page send (:50).
     - e1 is taken in `pairRead` when the outcome is in hand (:42).
   - **The eleven pairs.**
     - publish.mjs: APPROVED' :283/:355, REFUSED' :410/:421, FILTERED' :475/:493.
     - selection.mjs, through `prepareExport` :561 and `executeExport` :565: E-EXPORT ×2 (:581/:583, in the loop), E-SCOPE :598/:603, E-ASK-TWO's second :724/:726.
     - selection.mjs, the send at :621: E-ASK ×2, E-ASK-STATEMENT, E-ASK-TWO's first.
   - **Verdict.** It matches §1.4 (exportElapsed.mjs:25-30). This is consistent with the host: publish.rs:212 and :221 expire an attempt only when its elapsed time is over the TTL.
   - **INCONCLUSIVE status.** It prints as `[id] INCONCLUSIVE (ms):` (publish.mjs:603-605, selection.mjs:830-832).
   - **Exit codes.** A suite exits 1 if any step FAILs, else 3 if any step is INCONCLUSIVE, else 0 (publish.mjs:651, selection.mjs:833).
   - **Summaries.** Each is byte-identical when no step is INCONCLUSIVE: the status width stays 6 at publish.mjs:644, and the selection line's suffix is conditional at selection.mjs:872.
   - **TTL read.** It throws a named harness failure (exportElapsed.mjs:19) inside the suites' harness catch (publish.mjs:652-654, selection.mjs:880-883).
3. **Seams.**
   - The producer shapes are real: `{ status: "unknown-attempt" }` is the one shape at frontends/shell/src/publish/types.ts:87, and the TTL line is publish.rs:68, which the regex at exportElapsed.mjs:18 matches.
   - The end-to-end runs are the custodian's R1 to R3.
   - Caller grep: every export of exportElapsed.mjs has a caller in a suite.
4. **Non-blocking notes.**
   - **N1, stale pair writes after a timeout.** `pairs` is module-global (exportElapsed.mjs:13; reset at :32). A step that times out keeps running in the background, because `withTimeout` and `Promise.race` do not cancel its body. Its later `pairEvaluate` then writes into the next step's list (:50), which can misattribute that step's figure or verdict. This can only happen after a step has already FAILed (the suite exits 1), so no pass changes.
   - **N2, rounding.** exportElapsed.mjs:42 rounds U before comparing it, so a true U between T and T + 0.5 ms reads FAIL. This is unreachable in practice: U exceeds the host's interval by at least two IPC legs.

## Evidence (nothing blocks; one check not performed)

1. **Test.** `npm run test:export-elapsed` at the head, in the worktree C:/dev/wt/rev227 (added detached, since removed): rc 0, 5 pass, 0 fail (T1, T2 ×2, T3, T4).
   - T2's pins recomputed: state/consults/2026-10-14-shell-status-bar-one-height-e2e-h3-order.md:10 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:4e66b074e8fa92858b176103368c95cbcd7eacceda8bc43f54bfadf0ccb560ff and state/consults/2026-10-14-shell-status-bar-one-height-e2e-custodian-run-2.md:15 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:c4d9fcfc3a0ea10a09b991b17b805f6a5104e4e98ae59103551ad994edc84c2a. Both match.
   - The decoded test strings (exportElapsed.test.mjs:9 and :11) equal those lines byte for byte (compare script rc 0).
2. **M1 not made again by me.** The harness's permission classifier ("Security Test Removal") refused the edit to exportElapsed.mjs. It then also refused a porcelain read and a read of verify-mutation.mjs in that worktree. I did not try another route.
   - The worktree was clean: the refused edit never ran, and `git worktree remove` without `--force` exited 0. Git refuses that command for a worktree with modified or untracked files.
   - The M1 evidence is therefore the worker's recorded observation at dcaed6edf21fe96776ee5dab1b938cf675972df2 (exportElapsed.test.mjs:5).
   - My code reading, which is not an observation, agrees with that record:
     - exportElapsed.mjs is unchanged from dcaed6ed to the head (numstat: only the test's one comment line was added).
     - Under `if (true)`, line 28 returns INCONCLUSIVE for every `unknown-attempt`. T2 (which asserts FAIL) and T3's U = T assertion would then fail; T1 and T4 never reach that line.
   - If an observed M1 is required before merge, the custodian has to run it (or allow it by a permission rule).
3. **§7 size.** `git diff --numstat 28163cb6...39dc2c8e`, the form excluded: 126 + 28 = 154 changed lines over 7 files. `origin/main...39dc2c8e` gives the same (the merge base is 28163cb6). Amendment 2's 154 holds.
4. **Amendment 2, item 5.** It resolves: from 80890488 to 39dc2c8e, no file under frontends/shell/src, src-tauri, kernel, protocol or renderer changes, and no e2e `.mjs` file or package.json. Under engine/, only a `.md` file changes. From be6aa620 to 80890488, none of the exe's source paths change, so the exe built at be6aa620 matches the checkout R1 to R3 ran on.
5. **The e2e record against the PR's claims.**
   - R1: rc 0, each of the three steps carries one figure.
   - R2: rc 0, with figures E-EXPORT ×2, E-SCOPE ×1, E-ASK ×2, E-ASK-STATEMENT ×1, E-ASK-TWO ×2.
   - R3: rc 3, `[APPROVED'] INCONCLUSIVE` with L 121016 ms and U 121103 ms (both over 120 000), REFUSED' and FILTERED' pass.
   - The record names the exe's commit (be6aa620), the checkout's commit (80890488) and the TTL line (§1.3).
   - Nit: each run's header end time is 7 to 9 s after its inner `rc=` end line (for example 18:39:34Z against 18:39:27Z), and the record does not explain the gap.
6. **`verify-mutation.mjs` at the head: rc 1.** All 4 new tests are reported MISS.
   - The tool cannot match T2's declared name, which is a template literal with `${name}`, against the expanded name in the RECORDED MUTATION comment. T1, T3 and T4 are not named at all.
   - The form preregisters M1 alone, and the tool's own header (scripts/plan/verify-mutation.mjs:24-28 on main) calls its output a checklist that does not understand one mutation per file. This is not a gate failure of this piece, and no record may call that run an observation.

## Documentation (each must be fixed before the merge; none of it is the human's wording, per form §1.8, so the worker applies these words with no re-gate and the PR body lists them)

**D1, frontends/shell/e2e/README.md:222 (the publish entry).**
- Change "each of `APPROVED'`, `REFUSED'` and `FILTERED'` ends its line" to "each of `APPROVED'`, `REFUSED'` and `FILTERED'` that sent its execute ends its line".
- Change "it reads INCONCLUSIVE (exit code 3) if" to "it reads INCONCLUSIVE (exit code 3, unless a step failed) if".
- Clause check:
  - "that sent its execute": the tail lists only pairs with e0 set (exportElapsed.mjs:35), and e0 is set just before the execute's evaluate (:50). A step that fails at its prepare prints no figure, and ordinary use can reach that.
  - "ends its line": publish.mjs:598 and :602.
  - "unless a step failed": publish.mjs:651.

**D2, README.md:771 (the selection entry).**
- Change "Each export step (`E-EXPORT`, `E-SCOPE`, `E-ASK`, `E-ASK-STATEMENT`, `E-ASK-TWO`) ends its line with `prepare-to-execute` and, for each prepare and execute pair in the step, the whole milliseconds" to "Each export step (`E-EXPORT`, `E-SCOPE`, `E-ASK`, `E-ASK-STATEMENT`, `E-ASK-TWO`) that sent an execute ends its line with `prepare-to-execute` and, for each prepare and execute pair in the step whose execute was sent, the whole milliseconds".
- Change "An execute that returns `unknown-attempt` never passes:" to "An execute whose `unknown-attempt` outcome is checked never passes:".
- Change "an `unknown-attempt` read only after the ask was seen standing is not checked." to "an `unknown-attempt` read only after the ask was seen standing is not checked and is judged by the step's own assertions alone; `E-ASK`'s cancel half asserts no status of that outcome, so there it can pass (it needs the execute's answer to arrive after the ask was read standing; the form's §1.6 names this gap)."
- Clause check:
  - exportElapsed.mjs:35; the send at selection.mjs:621 and `executeExport` at :565 set e0.
  - The check runs only at :628, and only when `done` is true. The late reads at :651, :662, :673 and :722 have no `pairRead`.
  - :664-665 assert only that the statement shows exactly when the outcome is `success` or `succeeded-unaudited`.
- The pass case needs timing inside one request round trip, so under §31 it does not block; it is named here.

**D3, selection.mjs:20.** Change "(there are none here; the millisecond numbers are bounds on waiting)" to "(the millisecond numbers are bounds on waiting, and each export step's prepare-to-execute figure is a reading for triage, not a measurement)". Check: elapsedTail prints L (exportElapsed.mjs:34-37), and the header at :4-6 calls it a reading.

**D4, selection.mjs:55.** Change "when the export had ended before the ask was read: the step then fails with that word in its message." to "when the export had ended before the ask was read with an outcome other than `unknown-attempt`: the step then fails with that word in its message; an `unknown-attempt` there reads by exportElapsed.mjs's verdict." Check: :628.

**D5, selection.mjs:615.** Change "Throws INCONCLUSIVE (class 2, never a pass) when the export has ended by the time the ask is read." to "When the export has ended by the time the ask is read, it checks the outcome with `pairRead` (an `unknown-attempt` throws that verdict's FAIL or INCONCLUSIVE) and otherwise throws INCONCLUSIVE (class 2, never a pass)." Check: :628; exportElapsed.mjs:40-45.

**D6, exportElapsed.mjs:14.** Change "and the suite exits 3" to "and the suite exits 3 when no step FAILed". Check: publish.mjs:651, selection.mjs:833.

**D7, the PR body.** Five statements are stale against the form's Amendments 1 and 2:
- "148 changed lines over 6 files, within §7's 150" should read "154 changed lines over 7 files at 39dc2c8e, over the declared 150 (the form's Amendment 2, class 6)".
- "A draft: the README lines … single reviewer gate runs at the final head" should read "§1.8's README lines are at 39dc2c8e, written after PR #225 (main merged at 71b71372)".
- "Its OPEN-1 and OPEN-2 are with the human" should read "OPEN-1 (A) and OPEN-2 (A), as ruled (the form's Amendment 1)".
- "Gate: a single combined reviewer gate (§21b)" should read "Gates: the reviewer and the architect (the form's Amendment 2)".
- "The custodian's e2e at the head" should read "at 80890488, with the exe built at be6aa620 (the form's Amendment 2, item 5)".
- The body should also list D1 to D6 as applied, record verify-mutation's rc 1 and its cause (Evidence 6), and record that M1 was observed by the worker, not re-observed by the gate.

## Commands (exit codes)
- `git fetch origin`: 0. `git rev-parse origin/main 39dc2c8e… 28163cb6`: 0. `git merge-base`: 28163cb6.
- `git diff 28163cb6...39dc2c8e` (to a file): 0. `--name-only`: 0, 7 files.
- `git diff --quiet 28163cb6 39dc2c8e -- frontends/shell/src frontends/shell/src-tauri protocol engine kernel`: 0.
- `git diff --stat be6aa620 80890488 --` the exe's source paths: 0, empty. `git diff --stat 80890488 39dc2c8e --` the source paths and the e2e scripts: 0, only engine/CONNECTION-REUSE-RECYCLED-INTERRUPT-FLAKE-PREREGISTRATION.md. `git merge-base --is-ancestor be6aa620 28163cb6`: 0.
- `gh pr view 227`: 0 (a draft, head 39dc2c8e, MERGEABLE).
- `git diff --numstat 28163cb6...39dc2c8e`, the form excluded: 0 (154 over 7). `git diff --numstat origin/main...39dc2c8e`: 0 (154 over 7).
- `git worktree add --detach C:/dev/wt/rev227 39dc2c8e`: 0.
- `npm ci` in frontends/shell, inside a shared hold: 0. The hold was granted and released (MACHINE_HOLD shared project=SpatialIDE, then MACHINE_RELEASED), with no 96 to 99 code.
- `npm run test:export-elapsed`, inside a shared hold: 0 (5 pass, 0 fail). Hold granted and released.
- T2 pin recomputation (`git show e54e4af2:<path> | sed -n` into a file, then `sha256sum`): both match. Byte-compare script: 0.
- M1 edit: refused by the permission classifier, not run. The follow-up porcelain read and the worktree read of verify-mutation.mjs were also refused.
- At 39dc2c8e: `verify-cites.mjs` 0 (PASS), `verify-quotes.mjs` 0 (PASS), `verify-test-claims.mjs` 0 (PASS), `verify-mutation.mjs` 1 (FAIL, 4 of 4 MISS).
- `gh pr checks 227`: 0, 8 of 8 pass.
- `git diff --numstat dcaed6ed 39dc2c8e --` the helper and the test: 0 (only the test's 1 added line).
- `git worktree remove C:/dev/wt/rev227` without `--force`: 0. The directory is gone.
- I made no commit, push or PR action. The main checkout shows staged changes (CUSTODIAN-QUEUE.json, PLAN.yaml and others) that I did not make.
