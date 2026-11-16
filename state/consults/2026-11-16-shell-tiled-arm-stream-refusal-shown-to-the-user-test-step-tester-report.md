# The stream-refusal node's one test step at 20844fd8: cases A and B2 leave part or all of the view missing while the status bar says nothing (S1); B1 and C do not; the tester's report

*Filed by the custodian, 2026-11-16: the hand-back byte for byte but one substitution, the scratch folder's path written <S> in one place; the hand-back 14825 bytes, sha256 f81d120d3fb1f4cc8042f8bab881390b7d7bb7c0889037d4d15172fb24135b97; model claude-opus-5-5, 71 calls; nothing committed by the step. Ruled on by the advisor's ruling ADV-2026-11-16-12 (`state/directives/2026-11-16-advisor-ruling-adv-2026-11-16-12-the-stream-refusal-node-s1-after-its-test-step-the-architect-drafts-its-form-now-cut-small.md`), which is conditional on this report agreeing with the custodian's account.*

---

Stream-refusal test step at 20844fd8: A, B2

Cases A and B2 both leave part of the view (all of it, for B2) missing while the status bar says nothing, so by ADV-2026-11-16-05 item 4 (b) the node is S1. B1 and C are not S1 under the brief's test: in each, the user is shown something. Case C was added at the coordinator's request (ADV-2026-11-16-09 item 6). No product edit, nothing committed.

I ran as Opus 5.5 (claude-opus-5-5, by the harness note), with no model override and no context handoff. No usage figures are at hand.

**Start state**
- `git -C <W> rev-parse HEAD`: 20844fd884789ceb6a1a986ff275a8c6838b6d64. Porcelain empty.
- frontends/shell/package-lock.json: sha256 8e5031937d33070fa7950ebd9a6bfb8e3ed4ddc4fdcff7efdd9f8d63e4104a80.
- renderer/bundle-viewer/package-lock.json: sha256 6ccfc6deeb0aca4856aa5cdd27e52191484cd4f9daf2a90cc219218b9ef0a617.
- node v24.18.1, npm 11.16.0.
- The brief matched: 13663 bytes, sha256 b9dcaf79…5b.
- `<S>/m4b-rec-onehold.mjs` matched: 635 bytes, sha256 18677923dc49fe463c072f071a2d74a70fefdec9119f46eff4600564743c28bf.

**Setup, shared by every case**
- The real `startCandidateArmSession`, `TileViewportStreamManager`, `nextResidencyStatus` and `residencyStatusText`, with the harness's mocks.
- One change from the harness: `../skp/client` is mocked through `importOriginal`, so the real `SkpCallError` class is kept. This is the pattern `tileViewportStreamManager.test.ts` uses. The harness's own factory drops the class, and the manager's `instanceof SkpCallError` would then throw.
- App's status is folded the way App does it: `nextResidencyStatus(event, current)` starting from null.
- The refusal is `new SkpCallError({code:"engine.connections_exhausted", message:"no admission lease was available", fields:{class:"admission",capacity:"4"}})`.
- Each tile request is a deferred promise, so the state can be read between the first refusal and the retry.
- `appScanStateKind` is my own fold of App's `nextScanState` (by reading): issued gives issuing, reset gives idle.
- The values below are copied from the PROBE lines in `<S>/srp/vitest-probe-5.log`.

**Case A: the last tracked tile dropped after its second refusal**

A1. One tile (0:0) in view, the only one tracked; no earlier status (`"stoodBefore":{"text":null,"standing":null}`).
- After the first refusal: `"afterFirstRefusal":{"viewportQueryCalls":2,"trackedTileCount":1}`, so the map asked again once.
- After the second refusal:
  - Status events: `"statusEvents":[]`; `"residencyStatusText":null`. Nothing emitted.
  - Scan events: `"scanEvents":[]`.
  - State: `"trackedTileCount":0,"inFlightCount":0,"queuedCount":0,"overBudget":false,"gridFrameEstablished":true,"appScanStateKind":"issuing"`.
  - Log: `["tile-stream-mint-refused","0:0: engine.connections_exhausted {\"class\":\"admission\",\"capacity\":\"4\"}"]`, twice.
  - `"sessionEndedCalls":[]`.
- The session no longer tracks the tile. The last scan event App got was "issued" and no "reset" followed, so App still counts the scan as issuing.

A2. Three tiles; 0:0 and 0:1 complete first, so the refused 0:2 is the last tracked; no earlier status.
- After the drop: `"statusEvents":[]`, `"residencyStatusText":null`, `"scanEvents":[]`, `"trackedTileCount":0`, `"appScanStateKind":"issuing"`.
- Log: `"0:2: engine.connections_exhausted {\"class\":\"admission\",\"capacity\":\"4\"}"`, twice.

A4. What stood before was "Showing all 3 features in view", from an earlier settled view. Then a pan to a new tile, 0:5, which is refused twice.
- The plan itself emitted `[{"kind":"candidate-fill-progress"}]`, so `"stoodBefore":{"text":null,...}`.
- After the drop: `"statusEvents":[]`, `"residencyStatusText":null`, `"appScanStateKind":"issuing"`.

A3, a variant where something stood before: the over-budget sentence from the first look's batch.
- Standing before, and still standing after: "Showing 3 features — the farthest areas of this view are not drawn, to stay within the render budget. Zoom in to see more detail."
- Nothing was emitted after the failure, yet the state reads `"overBudget":false`. The text is stale and gives the wrong reason.
- State: `"trackedTileCount":0`, `"appScanStateKind":"issuing"`.

A-control. The same three tiles, but 0:2 is dropped while the other two are still in flight.
- At the drop: `"afterDrop":{"trackedTileCount":2,"statusEvents":[]}`.
- The last terminal then emits `{"kind":"candidate-within-budget","residentFeatureCount":3,"settled":"partial"}`, giving "Filling has finished for this view — some areas were not loaded; pan or zoom to load them."
- Scan events `[{"kind":"reset"}]`; idle.
- This confirms by run the first bullet of the gate report's check 3.

App, reading only, not run, for A1, A2 and A4:
- `residencyStatus` is null, so the `"status.residency"` slot (App.tsx:2422) renders nothing.
- The scan state is "issuing", and `scanLivenessText` (App.tsx:553-561) returns null for "issuing", so the scan mirror shows nothing.
- `.scan-incomplete` renders only when the scan is cancelled.
- The refusal block (App.tsx:2397-2399) renders `viewportRefusal`. Only `reportViewportOutcome`'s rejected arm sets it, the open's resolved first look set it to null, and no tile path reaches it. So it shows nothing.
- **The tile is missing and the status bar says nothing: S1.** The filter panel's Cancel stays visible, because `isScanInFlight` is true for "issuing", but that is outside the status bar.
- For A3, the bar shows the stale budget sentence: not silent, but the reason is wrong.

**Case B: the first look failing at open, with no batch**

B1, at the open: the first look's request refused at the call, before a ticket.
- `"reissueUnrestrictedSettled":{"status":"rejected","name":"SkpCallError","isSkpCallError":true,"skpError":{"code":"engine.connections_exhausted","message":"no admission lease was available","fields":{"class":"admission","capacity":"4"}}}`.
- Status events: `[{"kind":"query-issued"}]` (sent at the clear, before the call). `"residencyStatusText":null`.
- `"scanEvents":[]`, `"logSessionEvent":[]`, `"startStreamCalls":0`, `"sessionEndedCalls":[]`.
- State: `"gridFrameEstablished":false`, `"appScanStateKind":"idle"`.
- A later pan: `"afterPan":{"viewportQueryCallsAdded":0,"statusEvents":[],"scanEvents":[],"text":null}`.
- App callbacks called: none. The failure reaches App only as the rejected promise.

B1-apply: the same refusal on an Apply, with "Showing all 3 features in view" standing before it.
- Rejected with `"code":"engine.connections_exhausted"`.
- Status events `[{"kind":"query-issued"}]`; text null; `"gridFrameEstablished":true`; `"clearAllTilesCalls":2`.

B2, at the open: the first look's stream ends in a failure after its ticket, before any batch. Run twice, ProducerFailed and TransportFailed, with the same results.
- `"reissueUnrestrictedSettled":{"status":"fulfilled","value":{"kind":"issued","streamHandle":"sh_1"}}`.
- At the open: `{"statusEvents":[{"kind":"query-issued"}],"scanEvents":[{"kind":"issued","streamHandle":"candidate-session-scan"}]}`.
- After the failure:
  - `"statusEvents":[]`; `"residencyStatusText":null`. Nothing emitted.
  - `"scanEvents":[{"kind":"reset"}]`; idle.
  - Log: `["candidate-untiled-terminal","initial-untiled-look sh_1: ProducerFailed — engine.stream_failed"]` (TransportFailed alike).
  - `"gridFrameEstablished":false`; `"sessionEndedCalls":[]`.
- A later pan: `"afterPan":{"viewportQueryCallsAdded":0,"statusEvents":[],"scanEvents":[],"text":null}`. With no grid frame, no pan ever plans a tile.
- The promise resolved before the failure, and no App callback carries the failure.

B2-apply: the same failure on an Apply's first look, with "Showing all 3 features in view" standing before it.
- Fulfilled `{"kind":"issued","streamHandle":"sh_apply"}`; at the Apply `[{"kind":"query-issued"}]`; `"afterFailureText":null`.
- The frame survives the Apply, so a pan re-plans: `"afterPan":{"viewportQueryCallsAdded":1,"statusEvents":[],"text":null}`.

App, reading only, not run:
- **B2.** The resolved arm (App.tsx:1510-1527) sets `viewportRefusal` to null. The residency status is null, the scan state is idle, so the mirror and `.scan-incomplete` are empty.
  - **The map is empty and stays empty until a reopen or an Apply, and the status bar says nothing: S1.**
  - B2-apply is the same silence over a cleared map until the next pan.
- **B1.** The status bar's own slots are empty, but the rejected arm (App.tsx:1536) sets `viewportRefusal`. The block then shows the code `engine.connections_exhausted` and the message, with a Dismiss button.
  - Not S1 by the brief's surfaces.
  - Two notes for the advisor:
    - The block renders in StudioLayout's attention strip, not in the status bar.
    - After Dismiss nothing remains anywhere, while the map stays empty (no frame).
  - For B1-apply, App goes through `applyFilter`. By reading it returns `{kind:"refused"}` (shown by `RefusalBlock`) and re-issues the last view to recover. I did not run that recovery.

**Case C: a view settled partly over the render budget, with one tile in it refused twice**

C. Three tiles. 0:2 is refused twice and dropped, then 0:0's batch is over budget, then 0:1 completes and the view settles.
- At the drop: `"afterDrop":{"trackedTileCount":2,"statusEvents":[]}`.
- After the over-budget batch: `"afterOverBudget":{"trackedTileCount":1,"overBudget":true,"text":"Showing 3 features — the farthest areas of this view are not drawn, to stay within the render budget. Zoom in to see more detail."}`.
- At the settle: `{"kind":"candidate-over-budget","residentFeatureCount":3,"viewportTotal":null,"settled":"partial"}`.
- Final `residencyStatusText`, exact: "Showing 3 features — the farthest areas of this view are not drawn, to stay within the render budget. Zoom in to see more detail. Filling has finished for this view — the render budget is full; pan or zoom to see other areas."
- Scan events `[{"kind":"reset"}]`; idle. The refusal is logged only (0:2, twice).
- By reading, the status bar shows that text. **It gives only the render budget as the reason and does not name the refusal.** Not S1: the bar is not silent. This confirms the gate report's finding C1 by run.

C-order2. The same view, but 0:0's over-budget batch arrives before 0:2's first refusal.
- `"afterFirstRefusal":{"viewportQueryCalls":3,"trackedTileCount":2,"queuedCount":1}`. The retry is queued but never asked for, because the drain is held while over budget.
- At the end: `"trackedTileCount":1,"queuedCount":1,"appScanStateKind":"issuing"`.
- The text is the base over-budget sentence, which does not name the refusal.

**Runs** (from `<W>/frontends/shell`)
- `npx vitest --version`: vitest/5.0.1 win32-x64 node-v24.18.1.
- The harness, unchanged: `npx vitest run --maxWorkers=2 src/residency/candidateArmSession.test.ts`. rc 0, 1 file, 81 passed (81). Log: `<S>/srp/vitest-harness.log`.
- The probe, with the brief's command:
  1. rc 1, 2 failed | 10 passed (12). Both B2 tests failed on my guessed scan handle "candidate-arm"; the observed value is "candidate-session-scan", and I pinned it.
  2. rc 0, 12 passed, but the output carried no console lines.
  3. rc 0, 12 passed, with `--reporter=verbose --silent=false` added. Flags beyond the brief's command, added so the printed values appear.
  4. rc 0, 12 passed, the brief's command, after a fix to my fake canvas (below).
  5. rc 0, 12 passed, verbose. Its PROBE lines are identical to run 3 except B2-apply (checked by diff).
- Logs: `<S>/srp/vitest-probe-1.log` to `-5.log`; the PROBE lines alone are in `<S>/srp/probe-lines-5.txt`.

**Saved test file**
- `<S>/srp/streamRefusalProbe.test.ts`
- 32148 bytes, sha256 4b9d87fadb14da4b11e47e7c84ea26aff1d353ac5f682d4dc34861186763c38d. `cmp` with the worktree copy showed them equal before removal.

**Holds** (times UTC; the shared hold's lines carry `project=<m>`, `also=<m>`)
- Hold 1:
  - Status read before it, 04:32:02Z to 04:33:08Z: quiet=False, average=35.3%, peaks-over-25=55, no `project=SpatialIDE` line.
  - Re-read (`status-1b`, written 04:35:08Z): exit 0. Its reading line: quiet=False, average=63.4%, peaks-over-25=58. The hold printed "holds of this project after the grant: 1".
  - Command: `npm ci` in renderer/bundle-viewer. rc 0 ("added 31 packages, and audited 32 packages in 10s").
  - Started after 04:33:08Z; npm log last written 04:35:21Z; released 04:35:25Z.
- Hold 2:
  - Status read before it, 04:35:48Z to 04:36:52Z: quiet=False, average=40.1%, peaks-over-25=49, none of this project.
  - Re-read (`status-2b`, 04:38:15Z): exit 0, quiet=False, average=23.7%, peaks-over-25=23, holds after the grant: 1.
  - Command: `npm ci` in frontends/shell. rc 0 ("added 196 packages, and audited 197 packages in 11s").
  - Started after 04:36:52Z; log end 04:38:27Z; released 04:38:29Z.
- Neither hold stood beside another hold of this project. The script has no field named "peaks"; the field is `peaks-over-25`.

**End state**
- The test file was removed from `<W>`. Porcelain empty.
- `git diff --exit-code` on both lockfiles: 0 and 0. Their sha256 equal the start's (8e503193…4a80 and 6ccfc6de…a617). HEAD 20844fd8.
- No process I started is still running: both background holds exited 0. A command-line search for processes naming the worktree found only that search's own shells.

**Failure classes**
- The harness drives the product's own session and manager and only the kernel boundary is mocked. The canvas is a test double, and the App's surfaces are read, not run.
- Every result points to an existing log under `<S>/srp/`.
- No results file was written, and no performance claim is made.
- Every test passed its assertions after printing its values.

**Surprises, one line each**
- The harness's own `../skp/client` mock drops `SkpCallError`; copied as-is, every refusal would throw inside the manager.
- The default vitest reporter here printed no console output for passing tests (AI_AGENT is set in the environment, which is my guess at why).
- My first fake canvas kept tiles marked complete across `clearAllTiles`; that gave a false "Showing all 3 features in view" after the pan in B2-apply (run 3). I fixed the fake and recorded the corrected run.
- In A1, A2 and A4 the drop never sends App a "reset", so the scan state stays "issuing" and the filter panel's Cancel stays up indefinitely.
- In B2 at the open, no grid frame is ever made, so nothing a user can do short of a reopen or an Apply fills the map.
- In an over-budget view a refused tile is never asked for again (C-order2), so "refused twice" happens only if the refusals come before the budget fills.
- The refusal block cited at App.tsx:2397-2399 renders in the attention strip, not in the status bar.
