Built: shell-tiled-arm-stream-refusal-shown-to-the-user S1, the correction for C-1, worker-high (the custodian's filing note, 2026-11-18: the same worker-high's third task, the fix commit, by Amendment 3; model claude-opus-5-5, 8367 bytes, sha256 bdf727751ac90b58d9d69c28b2aef3e24301bba465a74a3b613919196124c5c9; the segment 2026-11-18T13:25:35.358Z to 13:32:38.497Z by its transcript, Bash 12, Write 2, SubagentHandback 1, none errored; below byte for byte, with this note and one final newline)

The fix and the words are committed and pushed. Every check at the head passes: the suites, typecheck, `npm run verify` and all four mutations. No other existing test fails, so Amendment 3 item 6's stop did not trigger.

**Commits** (branch `cut/shell-tiled-arm-stream-refusal-s1`)
- b53d14ff3dfdba10bfdc982d5847cf8ac2f4be52: test: S1 C-1, three tests for a tile ending while an Apply's first look runs (refused, failed, success)
- 6abaa9fb74de1eee303e3de84f6eafab67df56c6: fix: S1 C-1, the untiled first look's terminal recomputes the status after a plan, whatever its kind
- Pushed head: 6abaa9fb, by ls-remote. Each push ran in its own call.
- Before the commit, `git diff` was byte-identical to s1c-step2b.diff (10101 bytes, cmp=0, sha256 b821ff06…3f3c).
- I read Amendment 3 whole, from cd8c43a9.

**P-base** (at b53d14ff, the refusal file, rc=1, "Tests 3 failed | 12 passed (15)")
- SR-A-apply-refused: predicted FAIL, observed FAIL at :483.
- SR-A-apply-failed: predicted FAIL, observed FAIL at :499.
- SR-A-apply-success: predicted FAIL, observed FAIL at :514.
- Each failed with "expected undefined to deeply equal { …(3) }".
- All 12 existing tests passed.

**P-head** (at 6abaa9fb)
- Six files: the refusal file, TVSM.test, candidateArmSession.test, residencyStatus.test, App.lateResult and App.streamFailure. rc=0, "Test Files 6 passed (6)", "Tests 231 passed (231)".
- The three new tests and M1 each pass.
- `npm run typecheck`: rc=0.
- `npm run verify`, whole, once, in a hold: rc=0, "Test Files 114 passed (114)", "Tests 1481 passed (1481)". Its last 15 lines, byte-copied:
```
✔ T1 B5's session-ended line alone reads PASS (5.4243ms)
✔ T2 A1's two lines read INCONCLUSIVE, C2, the message naming {mtime} (1.7071ms)
✔ T3 A3's two lines read INCONCLUSIVE, C2 (the session-ended line's already-ended text is not classified) (0.6491ms)
✔ T4 B5's line removed reads FAIL, no class (0.3171ms)
✔ T5 a refusal carrying A3's already-ended text, details read from the real skp.rs, reads FAIL, C1 (1.1705ms)
✔ T6 a refusal carrying the could-not-re-read detail, prefix read from the real descriptor.rs, reads FAIL, R (0.5393ms)
✔ T7 a {mtime} refusal beside a refusal of another code reads FAIL, C3 (0.6489ms)
ℹ tests 7
ℹ suites 0
ℹ pass 7
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 27.2937
```

**The fix's diff** (byte-copied, candidateArmSession.ts)
```
-        // The stream-refusal piece S1 (§2.2 (b)): this generation's own first look failed. Before any
-        // plan, nothing else would ever settle the bar, so it says what is left; after one, the
-        // existing settled path does.
-        if (wasCurrent && !wasSelfCancelled && terminal.kind !== "Completed" && !relinquishedReEmitted) {
+        // The stream-refusal piece S1 (§2.2 (b); Amendment 2 item 2, C-1): this generation's own first
+        // look ended. After a plan, whatever its kind, the existing settled path recomputes the status:
+        // a tile that ended while this look ran found the view not settled, so this is the settling
+        // moment. Before any plan, only a failure speaks: nothing else would ever settle the bar, so it
+        // says what is left.
+        if (wasCurrent && !wasSelfCancelled && !relinquishedReEmitted && (hasPlanned || terminal.kind !== "Completed")) {
```
- Branches 2 and 3 are reached only with no plan, so only on a non-`Completed` terminal.
- M1's 14 lines are committed as the hunk in my observation report shows.

**The words** (`<S>/s1c-words.mjs`, rc=0, 7 edits, re-applied as observed)
- The script reads both reports by `git show e45cf5e8:<path>`. Each edit checks that its old text occurs exactly once, and that the new text is the report's bytes, once in the result.
- D-1 doc: "…which settles its status and its scan." → "…which re-syncs its scan and, when no tile is still tracked, recomputes its status."
- D-1 test comment: "so the session can settle its status and its scan." → "so the session can re-sync its scan and recompute its status."
- D-3: "the held drain would never issue the retry" → "while over budget the drain is held, so a requeued retry would wait for the next camera change".
- D-4 doc: the old fragment occurs once in lines 112-113's content. The new content equals the report's bytes, laid out at its sentence break.
- D-4 test comment: "…failed before any row" → "…failed before any plan, with no frame or with no row of its own".
- D-5: the report's line (sha256 6b6d74a1…5c01) is the last line of both constants' comments.
- W1/W2 (`<S>/s1c-w12.mjs` at 6abaa9fb, rc=0, W12-OK): both constants and the test's copies are byte-equal to §9's fences. W1 is 66 bytes (56e23452…5de) and W2 is 60 bytes (98b65a73…f71).

**Mutations** (`<S>/s1c-mutate.mjs`, one anchor, exactly once)
- Each run covered the refusal file and candidateArmSession.test.ts.
- After every mutation, `git checkout --` gave `git diff --quiet` rc=0, and the file's sha256 equalled HEAD's: d9d17d65…6b75.

| Id | Change to the fix's condition | Result | Failing tests and their assertion lines |
|---|---|---|---|
| M-C1a | `(hasPlanned \|\| …)` → `((hasPlanned && currentSettledState() !== "settled-partial") \|\| …)` | 2 failed / 96 | SR-A-apply-refused, at refusal:483 `expect(p.statusEvents.slice(mark.s).at(-1)).toEqual(WITHIN_PARTIAL);` M1, at cas:2249 `expect(onResidencyStatusChange).toHaveBeenCalledTimes(2);` ("expected … 2 times, but got 1 times"); M1 also settles partial |
| M-C1b | the same with `"settled-partial-failure"` | 1 failed / 96 | SR-A-apply-failed, at refusal:499 `expect(p.statusEvents.slice(mark.s).at(-1)).toEqual({ kind: "candidate-within-budget", residentFeatureCount: 3, settled: "partial-failure" });` |
| M-C1c | the same with `"settled-complete"` | 1 failed / 96 | SR-A-apply-success, at refusal:514 `…toEqual({ kind: "candidate-within-budget", residentFeatureCount: 3, settled: "complete" });` |
| M-M1 (Amendment 3 item 4) | fix removed, back to F's `wasCurrent && !wasSelfCancelled && terminal.kind !== "Completed" && !relinquishedReEmitted` | 4 failed / 96 | the three new tests at :483, :499 and :514, and M1 at cas:2249 |

**Counts** (numstat 2a8907b8...HEAD, against §7 as Amendment 1 item 2 and Amendment 3 item 2 keep it)

| File | Added / removed | Counted | Ceiling |
|---|---|---|---|
| tileViewportStreamManager.ts | 10 / 0 | 10 | 25 |
| candidateArmSession.ts | 39 / 1 | 40 | 60 |
| residencyStatus.ts | 28 / 2 | 30 | 35 |
| refusal test | 519 / 0 | 519 | 540 |
| tileViewportStreamManager.test.ts | 78 / 0 | 78 | 110 |
| residencyStatus.test.ts | 18 / 0 | 18 | 50 |
| App.streamFailure.test.tsx | 251 / 0 | 251 | 310 |
| candidateArmSession.test.ts | 10 / 4 | 14 | no ceiling of its own |

- Product: 80 of 120. Unit: 880 of 1,010. Total: 960 of 1,130.
- No overrun, so no class 8 row.

**Holds** (shared, -Project SpatialIDE; no exit code 96 to 99, no MACHINE_WAITING or MACHINE_ERROR lines)
- At the stop, whole vitest: `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:77572 also=<m>`, then `MACHINE_RELEASED project=<m> …`.
- `npm run verify`: `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:77396 also=<m>`, then `MACHINE_RELEASED project=<m> …`.

**Departures and what I did not do**
- I reworded the fix branch's own comment, because the old one became untrue.
- At the stop, I ran the whole suite once more than the brief asked, to list every existing test that fails.
- One fix Edit was refused by the tool (the file had not been re-read). Nothing was written, and I redid it before the byte-identity check.
- I opened no PR, ran no e2e, and did no records step.

**State left:** HEAD 6abaa9fb, equal to the remote, porcelain 0 bytes. No background shell or process of mine is running; both hold runs completed and every vitest run was in the foreground.

**Self-check:**
- Cross-module: the change is shell session code only, with no new seam.
- Claims: each rests on a run log in `<S>/s1c-*`.
- Messages: no string the app shows changed (W12-OK).
- Tests: each test reaches its intended assertion, as the mutations show.

Model: Opus 5.5 (claude-opus-5-5). No override; the only context handoff is the coordinator's two mid-task messages.
