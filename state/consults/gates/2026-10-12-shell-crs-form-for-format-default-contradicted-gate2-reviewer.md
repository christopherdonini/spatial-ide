# PR #214 gate 2 — reviewer
Reviewed: cut/shell-crs-form-for-format-default-contradicted @ 488686255f7bb5b7661b9ea5abed466229bc6d8f

**Verdict: PASS. Correctness PASS. Evidence PASS: E-1 is closed. Documentation: two must-fix items before the merge. Neither one blocks, and neither causes a re-gate.**

I checked the worktree with `git -C C:/dev/wt/crsform rev-parse HEAD`, which gives 488686255f7bb5b7661b9ea5abed466229bc6d8f. The range `bc0b0d7a..48868625` has two commits, e4df5e83 and 48868625. They touch two files, with 6 insertions and 5 deletions. Main was at b7cfff8c1f69266060c9b0d3e5fb519895106bf4.

## Correctness: PASS

**e4df5e83 is exactly option A plus D-2, and nothing else.**
- The diff touches only `frontends/shell/e2e/regression.mjs`, in two hunks:
  - In `stepAbsentCrs`, `  await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 3000, timeoutMs: 45_000 });` becomes `  const settle = await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 3000, timeoutMs: 45_000 });`. The return's trailing `; settled` becomes `; settled=${settle.settled}`. The rest of the return string is unchanged.
  - The call-site comment's second line is replaced by my two D-2 lines, byte for byte: `    // outer bound for a wedged page, not a timing claim; the step's own waits (three of 20s, one 45s` and `    // settle) can sum past it, and then this bound is the one that fails the step.`
- No assertion changed, so the gate 1 applicability holds.

**48868625 is exactly the row words plus Part X's path.**
- The diff touches only `frontends/shell/MANUAL-WALKTHROUGH.md`, two lines:
  - The ABSENTCRS' row's asserted cell: `, and the map settles` becomes `; then the step waits for the map to settle and reports the result as \`settled=\`, without asserting it`.
  - The not-asserted cell gains `; that the map settles after the admission (reported, not asserted)` at its end.
  - Part X's intro: `C:devspatial-ide` becomes `C:\dev\spatial-ide`.
- Nothing else changed.

**The row's clause check holds at the head** (`stepAbsentCrs` at 48868625; `waitForSettle` in `e2e/lib.mjs`):
- "waits for the map to settle": the `waitForSettle(...)` call follows the admission check.
- "reports the result as `settled=`": the return ends `settled=${settle.settled}`.
- "without asserting it": no throw follows on `settled: false`. `waitForSettle` returns `{ settled: false, count }` on timeout and does not throw.
- The D-2 comment holds:
  - there are three 20 s waits: two `clickWhenReady` at `20_000` and the admission `waitForCondition` at `20_000`;
  - there is one settle at `timeoutMs: 45_000`;
  - that is up to 105 s, more than `runStep("ABSENTCRS'", 90_000, …)`.

**§7, recomputed with the form's command at 48868625** (merge base 1457fbd0):
- G3 regression.mjs: 89 of 90 (64 insertions, 25 deletions). It was 88.
- G1: 15. G2: 52. G4: 9. Total: 165 of 225.
- MANUAL-WALKTHROUGH.md: 19 of 20, unchanged.
- No overrun, so there is no class 8. Amendment 3's "164 of 225" is stated at bc0b0d7a, so it is not made false.

**`node --check frontends/shell/e2e/regression.mjs`** at the head: exit 0.

## Evidence: PASS (E-1 closed)

**The re-run log** is `crsform-e2e/out/round1-head-regression.log` in the custodian's scratchpad. I read it read-only, and only that file.
- The header line is `worktree C:/dev/wt/crsform head 488686255f7bb5b7661b9ea5abed466229bc6d8f start 2026-10-11T22:41:36Z`.
- The footer line is `rc=0 end 2026-10-11T22:46:02Z`.
- The summary table has 17 PASS and 1 INFO (NET'), and no FAIL.
- ABSENTCRS' is `PASS`, and its note ends `CRS provenance "crs:asserted, axis:declared"; settled=true`.
- The record's appended section matches the log on the commit, the window, the exit code, "All 17 steps PASS, and NET' is INFO" and `settled=true`.

**The fixtures.** The log does not carry the fixture hashes, so I corroborated the record's "unchanged" claim independently:
- `C:/dev/spatial-ide/target/fixtures/manual-walkthrough` holds 17 `.parquet` files.
- The 7 hashes the record lists all recompute identically now, among them `absent-crs-contradicted.parquet` at 95e0fc3c…a260.
- The newest mtime among the 17 is 2026-10-09 17:27, before both run windows.

**The record and the form are append-only.**
- The record grows by 8 insertions from 86c40149 to b7cfff8c, with 0 deletions.
- The form grows by 18 insertions from 0ebe9383 to b7cfff8c, with 0 deletions.

**Amendment 4 item 3's hash recomputes.** `git show 86c401499462aecbaf2270e84ddf2281a58b55ad:state/consults/2026-10-12-shell-crs-form-for-format-default-contradicted-e2e-custodian-run.md | tail -n +5 | sha256sum` gives 590040beb68025e494f2f16ee64113d6e903d5082cb06f0c7f673e3382e1b619, which matches. The rev is an ancestor of origin/main, so round 15 (e) holds.

**Amendment 4 closes gate 1 as written:**
- **E-1**, by item 1:
  - option A at e4df5e83;
  - the re-run at 48868625 with `settled=true`;
  - the record's correction, whose defect paragraph is 2 sentences, within the ceiling.
- **D-1**, by item 2 at 48868625.
- **D-2**, by item 2 at e4df5e83.
- **D-3**, by item 4: `clickWhenReady`'s two 20 s waits, by reference to `stepAbsentCrs` at bc0b0d7a, with §7 not edited. Those lines are unchanged at the head.
- **D-4**, by item 3.
- The "item 2d" it cites resolves to `state/directives/2026-10-11-direction-after-status-review.md` item 2d, which is the not-the-human's-wording path. The PR body lists the applied row words and the path, as 2d requires.

## Documentation: must-fix before the merge (does not block, no re-gate)

**D-1 (gate 2). Amendment 4 is a correction round without a superseded index** (round 12 (e)). Amendment 1 item 9 shows the form's own pattern for one. Amendment 4 corrects Amendment 3 item 2 but has no index, and "Nothing above is edited." means the index must be appended. Suggested words (the custodian's wording, not the human's), as one appended item:
- `**Superseded index (correction round 1):** Amendment 3 item 2's "(sha256 590040be, its line 5 to the end)" → Amendment 4 item 3; Amendment 3 item 2's "ABSENTCRS' has §3's outcome at both", as to §3's settled bullet at bc0b0d7a → Amendment 4 item 1; the e2e record's "The step settled." → that record's correction of 2026-10-12.`
- Clause check:
  - each quoted span is byte-copied from Amendment 3 item 2 or the record's body;
  - item 3 carries the pinned hash reference;
  - item 1 carries the bc0b0d7a "settled" defect and the re-run.

**D-2 (gate 2). The e2e record's filing note now reads as a current pin and is false at the tree.**
- Line 1 says "Its sha256, from line 5 to the end, is 590040be…", with no rev.
- Since the append at b7cfff8c, line 5 to the end hashes to 3445e17056c3cb983f49f9289f3d39ea9b028273dbfe07d33c5e84b30502f029 at the tree. It hashes to 590040be… only at 86c40149.
- This is the round 14 rule: a pin is never silently read as current. The note's missing rev also falls under round 15 (e). Gate 1 did not catch either.
- The record is append-only. Suggested words (the custodian's wording), as one appended bullet:
  - `- **The filing note's hash** (line 1) is a historical pin at 86c401499462aecbaf2270e84ddf2281a58b55ad; the pin is authoritative, not the tree, which this section changes.`
- Clause check: 590040be… at 86c40149, and 3445e170… at b7cfff8c, both recomputed above.

## Runs

**On main at b7cfff8c**, with tool commits scripts/plan c813c6ab and scripts/hooks and scripts/evidence 7ce9dab2:
- `node scripts/plan/verify.mjs`: rc 0.
- `node scripts/plan/verify-cites.mjs`: rc 0, over 1795 files, with 38 advisories.
  - One advisory is in this piece's gate 1 architect report: `MANUAL-WALKTHROUGH.md:1793` is beyond main's 1790 lines.
  - That is a branch-line cite in an exempt gate report. It is advisory and not a finding.
- `node scripts/plan/verify-quotes.mjs`: rc 0, with 121 checked.
- `node scripts/plan/verify-test-claims.mjs`: rc 0, with 545 claimed.
- Main's porcelain shows only the two untracked files that were already there before this gate.

I ran no e2e suite and did not read the harness scripts. I made no edit, commit or push.
