Built: shell-tiled-arm-stream-refusal-shown-to-the-user S1, the correction for C-1, worker-high: the ADV-2026-11-18-10 observation. Nothing is committed or pushed. (the custodian's filing note, 2026-11-18: the same worker-high's second task, an observation of M1 with the fix and M1's change uncommitted, before this form's Amendment 3, by the advisor's ruling ADV-2026-11-18-10 item 3 (d); sent by the custodian's message at 2026-11-18T13:02:37.763Z by the custodian's transcript; the segment 2026-11-18T13:02:45.045Z to 2026-11-18T13:05:23.986Z by its transcript, Bash 8, Edit 3, Read 2, SubagentHandback 1, one errored: an Edit that the tool refused because the file had not been read again since the revert, as the report says; its hand-back below, byte for byte, with the custodian's scratch folder written as <S> in 1 places, with this note added in its first line and one final newline)

**Item 3 (d): M1's last step passes unchanged, by the run.** Its `mockClear`, the next plan and its `toHaveBeenCalledWith({candidate-over-budget, 7, null, settled:"partial"})` are not touched, so nothing needs correcting there. **Item 7: no other existing test fails** in the refusal file or in `candidateArmSession.test.ts`.

**Checks at the start**
- The items file is 1266 bytes with sha256 75d05b2517efd8f3330943623843311095bbefa62da4ebea4e54a2e7faf5dafc, both as given. I read it whole.
- In C:/dev/wt/srf: HEAD b53d14ff3dfdba10bfdc982d5847cf8ac2f4be52, porcelain 0 bytes, and ls-remote gives b53d14ff.

**Restoring step 2**
- `s1c-words.mjs` ran again: rc=0, "WROTE 4 files".
- My first fix Edit was refused by the tool, because the file had not been re-read since the revert; nothing was written.
- My first compare therefore covered the words only (6806 bytes, cmp differs). I read the file and made the same Edit.
- The second `git diff` is 8348 bytes, sha256 b56e78929b95371106a0a10ab57ba11e11f355a4fb470cea21f0e6b917d18761, and cmp against s1c-step2-uncommitted.diff gives 0: byte-identical.

**M1, items 3 (a), (b), (c) and (e)** (hunk byte-copied from `git diff`)
```
@@ -2242,11 +2242,17 @@ describe("Item B: the settled-partial signal (RESIDENCY-DEBT-1B.md, BS5/BS6)", (
       expect(residencyStatusText(event)).not.toContain("Filling has stopped for this view");
 
       // M1: complete the untiled look now -- `sh_2` reaches its own terminal, clearing
-      // `untiledStreamRunning`. This alone does not itself emit (S2's own surfacing obligation is
-      // scoped to the TILE manager's `onTileSuperseded`/`onTerminal`, never this session-owned untiled
-      // stream) -- no NEW call beyond the one already asserted above.
+      // `untiledStreamRunning`. A plan has run, so this terminal now emits by itself (the stream-refusal
+      // piece S1, C-1's fix: the untiled sink's `onTerminal` recomputes the status after a plan, whatever
+      // the terminal's kind) -- one NEW call, carrying the settled status the last step also expects.
       completeUntiledLook();
-      expect(onResidencyStatusChange).toHaveBeenCalledTimes(1);
+      expect(onResidencyStatusChange).toHaveBeenCalledTimes(2);
+      expect(onResidencyStatusChange).toHaveBeenLastCalledWith({
+        kind: "candidate-over-budget",
+        residentFeatureCount: 7,
+        viewportTotal: null,
+        settled: "partial",
+      });
 
       // The next emission (another plan; the SAME candidate is still skipped, still over budget) now
       // settles honestly, classified settled-partial -- never a completeness/total claim over this
```
- (a) Everything up to and including the three assertions on the first event is unchanged.
- (e) The test's name and its long comment are unchanged.

**Runs** (focused, not in a hold, with the fix and words in place)
- Refusal file: rc=0, "Test Files 1 passed (1)", "Tests 15 passed (15)".
- `candidateArmSession.test.ts` whole: rc=0, "Test Files 1 passed (1)", "Tests 81 passed (81)".
- A verbose run of that file shows `✓ … > M1: over-budget + no-headroom skip …`, rc=0, 81 passed.

**Diff file:** <S>/s1c-step2b.diff
- It is 10101 bytes, sha256 b821ff06bd2a996418c7bbb2b344e9f3511a93379909875b981561b7a3091f3c.
- The file did not exist before; the write would have refused if it had.

**M1's counts** (`git diff --numstat` on candidateArmSession.test.ts): 10 added, 4 removed, 14 lines.
- At b53d14ff the unit group stands at 866 of 1,010; with step 2's TVSM.test (1/1) and residencyStatus.test (1/1) lines it comes to about 884. That is my sum; I ran no numstat over the uncommitted tree.

**Not done:** ruling item 4, the corrected step observed failing with the fix removed. It was not in this task; I will do it with the mutations at step 4.

**State left:** uncommitted, as asked. The working tree holds these modified files:
- frontends/shell/src/residency/candidateArmSession.test.ts
- frontends/shell/src/residency/candidateArmSession.ts
- frontends/shell/src/residency/residencyStatus.test.ts
- frontends/shell/src/residency/residencyStatus.ts
- frontends/shell/src/streaming/tileViewportStreamManager.test.ts
- frontends/shell/src/streaming/tileViewportStreamManager.ts

No hold was taken, no Guardian refusal occurred, and no background process of mine is running.

Model: Opus 5.5 (claude-opus-5-5). No override and no context handoff.
