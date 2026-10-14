# PR #218 (shell-status-bar-one-height): H3's diagnostic order run

*The custodian's record, 2026-10-14, for gate 1 architect D-5. The port-5400 harness (the human's approval of 2026-10-11, item 1); the detached checkout C:/dev/wt/mm2b-e2e at 720bb50dd0710697b869346c9726b0c50c9435e3 (comments only since d9e9b817); milestone 2's e2e exe (no host change); one fresh app, in a shared hold. A scratch patch (sha256 43fe2d015dddd865cf259e82fece52353303dd3b053e8dda3ef26e14aefc6234, test-only: e2e/selection.mjs's E-DBLCLICK step moved before E-SEL-FILTER, run 5's order) was applied, the selection suite run once, the patch reverted and the checkout proven clean. Log lines are byte-copied by script; the run recorded the fixtures unchanged.*

## The run (2026-10-14T14:32:52Z to 2026-10-14T14:40:08Z)

```text
[E-DBLCLICK] PASS (36487ms): a double-click zoomed (-0.8155298414577508 -> 1.1844701585422492), inspected nothing in Navigate and selected nothing in Select; a single click inspected id 836
[E-SEL-FILTER] PASS (61976ms): Selected 6; hidden 4 under the filter and 0 after Clear
[E-EXPORT] FAIL (16077ms): E-EXPORT: execute (Selected 1) returned {"status":"unknown-attempt"}
[E-ASK] FAIL (17565ms): E-ASK (keep): INCONCLUSIVE (class 2, never a pass): the export had ended when the ask was read (ask shown: false)
[E-ASK-STATEMENT] FAIL (20888ms): E-ASK-STATEMENT: INCONCLUSIVE (class 2, never a pass): the export had ended when the ask was read (ask shown: false)
[E-ASK-TWO] FAIL (27494ms): E-ASK-TWO: INCONCLUSIVE (class 2, never a pass): the export had ended when the ask was read (ask shown: false)
[E-STATUS-HEIGHT] PASS (63965ms): the canvas stayed 388 x 712 (A, B, C) and the bar 48 px; recorded, not asserted: A's canvas height 712; in B the bar's scrollHeight 47 against its clientHeight 47; the residency item present in B: false; inner size after the resize 880 x 800; inner size after the restore 1280 x 800
[selection] 14 PASS, 4 FAIL: E-SCENE=PASS E-CLICK=PASS E-CLICK-FAST=PASS E-SELECT=PASS E-NODRAG=PASS E-ZOOMSEL=PASS E-SEL-PAN=PASS E-DBLCLICK=PASS E-SEL-FILTER=PASS E-REFUSED=PASS E-GEN=PASS E-KINDS=PASS E-EXPORT=FAIL E-SCOPE=PASS E-ASK=FAIL E-ASK-STATEMENT=FAIL E-ASK-TWO=FAIL E-STATUS-HEIGHT=PASS
```

- **H3** (§0.6): in run 5's order, E-DBLCLICK passes and E-SEL-FILTER passes after it. Recorded, not asserted.
- **The four export steps** did not pass: E-EXPORT's export came back as an unknown attempt, and E-ASK, E-ASK-STATEMENT and E-ASK-TWO name themselves INCONCLUSIVE. Three reviewer gates ran beside this run (by their transcripts, 14:25:13Z to 14:46:49Z, 14:33:08Z to 14:53:44Z and 14:33:08Z to 15:08:49Z). The patch does not touch those steps, and each passed in the first selection run of `state/consults/2026-10-14-shell-status-bar-one-height-e2e-custodian-run-2.md` in the committed order. They are not recorded as failures (THE MACHINE).
- **The hold, class 2.** D-5 named pan-anchor's exclusive hold. That hold was requested for the same run at c7ca9bee after 15:18:37Z and refused at 15:29:02Z with exit code 96, the machine not quiet within its ten minutes. The run above, in a shared hold, stands for H3.
