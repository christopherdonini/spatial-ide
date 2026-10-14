# PR #218 (shell-status-bar-one-height) at d9e9b817: the custodian's e2e run 2, the selection suite twice and E-STATUS-HEIGHT's mutation

*The custodian's record, 2026-10-14. The port-5400 harness (the human's approval of 2026-10-11, item 1); the detached checkout C:/dev/wt/mm2b-e2e at d9e9b817a039f0b3f0d8dc4477e7edd206f1ceb0 (correction round 1, Amendment 3: only e2e/selection.mjs changed since e1f92a97, so run 1's other suites stand); milestone 2's e2e exe (no host change); each run a fresh app, in one shared hold. Log lines are byte-copied by script; every run recorded the fixtures unchanged. The mutation (Amendment 1's: the status row back to auto, the bar back to a minimum and maximum height) was applied from a scratch patch, run, reverted, and the checkout proven clean.*

## Selection, run 1 (2026-10-14T13:04:03Z to 2026-10-14T13:08:38Z)

```text
[E-STATUS-HEIGHT] PASS (43732ms): the canvas stayed 388 x 712 (A, B, C) and the bar 48 px; recorded, not asserted: A's canvas height 712; in B the bar's scrollHeight 47 against its clientHeight 47; the residency item present in B: false; inner size after the resize 880 x 800; inner size after the restore 1280 x 800
[selection] 18 PASS, 0 FAIL: E-SCENE=PASS E-CLICK=PASS E-CLICK-FAST=PASS E-SELECT=PASS E-NODRAG=PASS E-ZOOMSEL=PASS E-SEL-PAN=PASS E-SEL-FILTER=PASS E-REFUSED=PASS E-GEN=PASS E-KINDS=PASS E-EXPORT=PASS E-SCOPE=PASS E-ASK=PASS E-ASK-STATEMENT=PASS E-ASK-TWO=PASS E-STATUS-HEIGHT=PASS E-DBLCLICK=PASS
```

## Selection, run 2 (2026-10-14T13:08:58Z to 2026-10-14T13:13:40Z)

```text
[E-ASK-TWO] FAIL (12200ms): E-ASK-TWO: the second export's outcome is {"status":"unknown-attempt"}; a finished bundle was needed
[E-STATUS-HEIGHT] PASS (43345ms): the canvas stayed 388 x 712 (A, B, C) and the bar 48 px; recorded, not asserted: A's canvas height 712; in B the bar's scrollHeight 47 against its clientHeight 47; the residency item present in B: false; inner size after the resize 880 x 800; inner size after the restore 1280 x 800
[selection] 17 PASS, 1 FAIL: E-SCENE=PASS E-CLICK=PASS E-CLICK-FAST=PASS E-SELECT=PASS E-NODRAG=PASS E-ZOOMSEL=PASS E-SEL-PAN=PASS E-SEL-FILTER=PASS E-REFUSED=PASS E-GEN=PASS E-KINDS=PASS E-EXPORT=PASS E-SCOPE=PASS E-ASK=PASS E-ASK-STATEMENT=PASS E-ASK-TWO=FAIL E-STATUS-HEIGHT=PASS E-DBLCLICK=PASS
```

- E-STATUS-HEIGHT passes again. E-ASK-TWO's second export came back as an unknown attempt: the custodian's commit gate (the governance scripts' test suite) ran from 13:04:31Z to 13:10:54Z by the transcript, beside this run, as did a docs-lane worker's runs. The same step passed in run 1 and in the earlier runs at e1f92a97, and E-EXPORT showed the same outcome under load in run 1 at e1f92a97. Not recorded as a failure (THE MACHINE); the step touches nothing this piece changes.

## The mutation, observed (2026-10-14T13:13:58Z to 2026-10-14T13:19:41Z)

```text
[E-SEL-FILTER] FAIL (29550ms): E-SEL-FILTER: 6 Add only clicks on distinct features gave Selected 5
[E-STATUS-HEIGHT] FAIL (72172ms): E-STATUS-HEIGHT: the canvas is 388 x 736 before the notice, 388 x 718.640625 while it stands and 388 x 736 after it clears
[selection] 16 PASS, 2 FAIL: E-SCENE=PASS E-CLICK=PASS E-CLICK-FAST=PASS E-SELECT=PASS E-NODRAG=PASS E-ZOOMSEL=PASS E-SEL-PAN=PASS E-SEL-FILTER=FAIL E-REFUSED=PASS E-GEN=PASS E-KINDS=PASS E-EXPORT=PASS E-SCOPE=PASS E-ASK=PASS E-ASK-STATEMENT=PASS E-ASK-TWO=PASS E-STATUS-HEIGHT=FAIL E-DBLCLICK=PASS
```

E-STATUS-HEIGHT fails at S3 as Amendment 1 predicts: the canvas is shorter while the notice stands (718.640625 against 736). E-SEL-FILTER's failure under the mutated layout is not this piece's claim.

## pan-anchor, alone

Three runs at d9e9b817 in an exclusive hold (the first attempt gave up with exit 96 while another project's runs kept the machine busy; this one was granted), each a fresh app, the fixtures unchanged:

```text
pan-anchor alone run 1 rc=0 ==== 16/16 PASS ==== 
pan-anchor alone run 2 rc=0 ==== 16/16 PASS ==== 
pan-anchor alone run 3 rc=0 ==== 16/16 PASS ==== 
```

Run windows: 2026-10-14T14:10:11Z to 2026-10-14T14:12:59Z; 2026-10-14T14:13:15Z to 2026-10-14T14:15:54Z; 2026-10-14T14:16:10Z to 2026-10-14T14:18:50Z. All pass, so the failures in shared runs at e1f92a97 were the harness race in setCam (run 1's record), not the shorter map; I7 does not fire. The condition of gate 1 (the architect) is met.
