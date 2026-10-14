# PR #218 (shell-status-bar-one-height) at e1f92a97: the custodian's e2e, runs 1 and 2, the E-STATUS-HEIGHT diagnostic and the pan-anchor diagnosis

*The custodian's record, 2026-10-14. The port-5400 harness, under the human's approval of 2026-10-11 (item 1); the detached checkout C:/dev/wt/mm2b-e2e at the branch head e1f92a974aa9ce77150be0b057160cec755bb910 (main f8bc2951 for the three comparison runs), each suite a fresh app. The exe is milestone 2's e2e build: no file under the shell's src-tauri, kernel, engine, protocol or renderer/src differs between its build commit and this head except kernel/B2-1B-RECORDING-PREREGISTRATION.md, a form. Every run held a shared hold. Log lines below are byte-copied by script from the harness's logs; the diagnostic patches were scratch, test-only, reverted after each run, with the checkout proven clean. Every run that launched an app recorded the fixtures' sha256 unchanged before and after.*

## Run 1 — every suite, beside the Current view worker's build (2026-10-14T10:21:23Z to 2026-10-14T10:49:42Z, the first log's start to the last log's end)

The summary, as the run wrote it:

```text
suite selection rc=1
suite regression rc=0
suite layout rc=0
suite style rc=0
suite console rc=0
suite publish rc=0
suite admission-remediation rc=0
suite filter rc=0
suite filter-panel rc=0
suite refusal-contract-baseline rc=1
suite residency-harness rc=90
suite source-changed rc=90
suite source-watch-idle rc=90
suite pan-anchor rc=90
suite source-changed-post rc=90
MUTATED selection rc=90
reverted; porcelain empty
```

- **The exit 90s:** the harness's busy check found a `rustc` building the shell crate (the Current view worker's `cargo test`, in its own worktree) and launched no app. Those suites did not run in run 1.
- **selection:**

```text
[E-EXPORT] FAIL (14114ms): E-EXPORT: execute (Selected 1) returned {"status":"unknown-attempt"}
[E-ASK] FAIL (19537ms): E-ASK (keep): INCONCLUSIVE (class 2, never a pass): the export had ended when the ask was read (ask shown: false)
[E-STATUS-HEIGHT] FAIL (17245ms): E-STATUS-HEIGHT: INCONCLUSIVE (class 2, never a pass): G1, the notice is not on a second line (its top 767.40625, the first item's bottom 784)
[selection] 15 PASS, 3 FAIL: E-SCENE=PASS E-CLICK=PASS E-CLICK-FAST=PASS E-SELECT=PASS E-NODRAG=PASS E-ZOOMSEL=PASS E-SEL-PAN=PASS E-SEL-FILTER=PASS E-REFUSED=PASS E-GEN=PASS E-KINDS=PASS E-EXPORT=FAIL E-SCOPE=PASS E-ASK=FAIL E-ASK-STATEMENT=PASS E-ASK-TWO=PASS E-STATUS-HEIGHT=FAIL E-DBLCLICK=PASS
```

- **refusal-contract-baseline,** its failing lines:

```text
[OVERCEIL'] FAIL (3558ms): OVERCEIL': .residency-status not present after admitting the over-ceiling fixture (settled=true)
[REOPEN'] FAIL (3467ms): REOPEN' (before Zoom to layer): .canvas-refusal present: stream TransportFailed: connection errorDismiss
[SLOW'/CANCEL'] FAIL (6959ms): SLOW'/CANCEL': .residency-status not present after admitting the slow fixture (settled=true)
OVERCEIL'      FAIL    OVERCEIL': .residency-status not present after admitting the over-ceiling fixture (settled=true)
REOPEN'        FAIL    REOPEN' (before Zoom to layer): .canvas-refusal present: stream TransportFailed: connection errorDismiss
SLOW'/CANCEL'  FAIL    SLOW'/CANCEL': .residency-status not present after admitting the slow fixture (settled=true)
```

## Run 2 — the suites run 1 did not finish, and the two that failed beside the build (2026-10-14T11:06:06Z to 2026-10-14T11:22:29Z, the first log's start to the last log's end)

```text
suite selection rc=1
suite refusal-contract-baseline rc=0
suite residency-harness rc=0
suite source-changed rc=0
suite source-watch-idle rc=0
suite pan-anchor rc=1
suite source-changed-post rc=0
DIAG selection rc=1
reverted; porcelain empty
```

- **selection, unpatched:** E-EXPORT and E-ASK pass; E-STATUS-HEIGHT is INCONCLUSIVE at G1 again.

```text
[E-STATUS-HEIGHT] FAIL (13998ms): E-STATUS-HEIGHT: INCONCLUSIVE (class 2, never a pass): G1, the notice is not on a second line (its top 767.40625, the first item's bottom 784)
[selection] 17 PASS, 1 FAIL: E-SCENE=PASS E-CLICK=PASS E-CLICK-FAST=PASS E-SELECT=PASS E-NODRAG=PASS E-ZOOMSEL=PASS E-SEL-PAN=PASS E-SEL-FILTER=PASS E-REFUSED=PASS E-GEN=PASS E-KINDS=PASS E-EXPORT=PASS E-SCOPE=PASS E-ASK=PASS E-ASK-STATEMENT=PASS E-ASK-TWO=PASS E-STATUS-HEIGHT=FAIL E-DBLCLICK=PASS
```

- **refusal-contract-baseline** passes. Run 1's failures there, and E-EXPORT's and E-ASK's, are read as load beside the build (THE MACHINE: a timing-sensitive failure in a shared run is not recorded as a failure).

### The E-STATUS-HEIGHT diagnostic (DIAG-SB-ITEMS: each footer child's class, text and box in A and B)

```text
[SB-DIAG] A {"width":668,"height":712,"items":[{"cls":"residency-status","text":"Showing all 2000 features in view","top":767.40625,"bottom":785.59375,"left":12,"right":260.25,"width":248.25,"height":18.1875},{"cls":"status-source-watch","text":"[P6 placeholder] source watch: watching","top":769,"bottom":784,"left":272.25,"right":546.71875,"width":274.46875,"height":15}],"bar":{"top":752,"bottom":800,"width":1280},"win":[1280,800],"alignContent":"normal","barHeight":48,"stripHeight":0,"scrollHeight":47,"clientHeight":47,"noticeTop":null,"firstBottom":785.59375}
[SB-DIAG] B {"width":668,"height":712,"items":[{"cls":"status-source-watch","text":"[P6 placeholder] source watch: watching","top":769,"bottom":784,"left":12,"right":286.46875,"width":274.46875,"height":15},{"cls":"selection-ended","text":"[P6 placeholder] The selection ended: 1 selected feature was dropped, because a dataset was opened.","top":767.40625,"bottom":785.59375,"left":298.46875,"right":1011.1875,"width":712.71875,"height":18.1875}],"bar":{"top":752,"bottom":800,"width":1280},"win":[1280,800],"alignContent":"normal","barHeight":48,"stripHeight":0,"scrollHeight":47,"clientHeight":47,"noticeTop":767.40625,"firstBottom":784}
```

- In B the bar holds the watcher and the notice only: the reopen cleared the residency item, and it does not return until a camera change plans tiles (the architect's reading, Amendment 3 item 1). Their widths fit the bar's 1256 px, so the notice never takes a second line at 1280 by 800, and G1 is unmet in every run (I3).
- A's canvas was 668 by 712, as Amendment 1's §1 predicts.

## pan-anchor

- **Run 2:**

```text
--- window small: client 328x552, buffer 328x552, DPR 1 ---
--- window large: client 788x812, buffer 788x812, DPR 1 ---
FAIL  large: recenter-crossing-A dx=-1200  ::  grab-point residual 1100.01 buffer px (tol 4)
==== 15/16 PASS ====
FAILED: large: recenter-crossing-A dx=-1200
```

- **Two more runs at e1f92a97** (a shared hold, beside the docs-lane worker's start):

```text
run 1: ==== 16/16 PASS ====
run 2: FAIL  large: recenter-crossing-A dx=-1200  ::  grab-point residual 1100.01 buffer px (tol 4) | ==== 15/16 PASS ====
```

- **Three runs at main f8bc2951,** before #218, with the large window 1400 by 876 in place of 1400 by 900 (DIAG-PAN-876), so the canvas is 812 tall under the old bar:

```text
run 1: --- window large: client 788x812, buffer 788x812, DPR 1 --- | ==== 16/16 PASS ====
run 2: --- window large: client 788x812, buffer 788x812, DPR 1 --- | ==== 16/16 PASS ====
run 3: --- window large: client 788x812, buffer 788x812, DPR 1 --- | ==== 16/16 PASS ====
```

- **Three runs at e1f92a97 with DIAG-PAN-DRAG** (logging, for each recenter-crossing drag, the element under the pointer, the start and end, the view-state count, s0, s1 and the first lines after the call); the large window's lines:

```text
diag run 1 rc=1 ==== 14/16 PASS ==== FAIL  large: there-and-back-net  ::  net residual 168.00 buffer px (tol 4) FAIL  large: recenter-crossing-A dx=-1200  ::  grab-point residual 800.01 buffer px (tol 4) 
[PAN-DIAG] {"sizeLabel":"large","dx":1200,"pre":{"el":"CANVAS.working-canvas","inner":[1400,900]},"box":{"left":266,"top":40,"cw":788,"ch":812},"start":[660,446],"end":[1860,446],"vsBefore":1,"vsAfter":13,"s0":{"targetX":0,"targetY":0,"zoom":-6.99987,"originX":2606340,"originY":1206320},"s1":{"targetX":-140787.3132056136,"targetY":0,"zoom":-6.99987,"originX":2606340,"originY":1206320},"tail":[{"targetX":0,"targetY":0,"zoom":-6.99987,"originX":2606340,"originY":1206320},{"targetX":-12798.846655055779,"targetY":0,"zoom":-6.99987,"originX":2606340,"originY":1206320},{"targetX":-25597.693310111572,"targetY":0,"zoom":-6.99987,"originX":2606340,"originY":1206320},{"targetX":-38396.53996516735,"targetY":0,"zoom":-6.99987,"originX":2606340,"originY":1206320}]}
[PAN-DIAG] {"sizeLabel":"large","dx":-1200,"pre":{"el":"CANVAS.working-canvas","inner":[1400,900]},"box":{"left":266,"top":40,"cw":788,"ch":812},"start":[660,446],"end":[-540,446],"vsBefore":2,"vsAfter":12,"s0":{"targetX":-140787.3132056136,"targetY":0,"zoom":-6.99987,"originX":2606340,"originY":1206320},"s1":{"targetX":102390.06352414814,"targetY":0,"zoom":-6.99986,"originX":2606340,"originY":1206320},"tail":[{"targetX":0,"targetY":0,"zoom":-6.99986,"originX":2606340,"originY":1206320},{"targetX":12798.757940518513,"targetY":0,"zoom":-6.99986,"originX":2606340,"originY":1206320},{"targetX":25597.515881037034,"targetY":0,"zoom":-6.99986,"originX":2606340,"originY":1206320},{"targetX":38396.273821555544,"targetY":0,"zoom":-6.99986,"originX":2606340,"originY":1206320}]}
diag run 2 rc=1 ==== 14/16 PASS ==== FAIL  small: recenter-crossing-A dx=-1200  ::  grab-point residual 1100.01 buffer px (tol 4) FAIL  large: recenter-crossing-A dx=-1200  ::  grab-point residual 1100.01 buffer px (tol 4) 
[PAN-DIAG] {"sizeLabel":"large","dx":1200,"pre":{"el":"CANVAS.working-canvas","inner":[1400,900]},"box":{"left":266,"top":40,"cw":788,"ch":812},"start":[660,446],"end":[1860,446],"vsBefore":1,"vsAfter":13,"s0":{"targetX":0,"targetY":0,"zoom":-6.99987,"originX":2606340,"originY":1206320},"s1":{"targetX":-140787.3132056136,"targetY":0,"zoom":-6.99987,"originX":2606340,"originY":1206320},"tail":[{"targetX":0,"targetY":0,"zoom":-6.99987,"originX":2606340,"originY":1206320},{"targetX":-12798.846655055779,"targetY":0,"zoom":-6.99987,"originX":2606340,"originY":1206320},{"targetX":-25597.693310111572,"targetY":0,"zoom":-6.99987,"originX":2606340,"originY":1206320},{"targetX":-38396.53996516735,"targetY":0,"zoom":-6.99987,"originX":2606340,"originY":1206320}]}
[PAN-DIAG] {"sizeLabel":"large","dx":-1200,"pre":{"el":"CANVAS.working-canvas","inner":[1400,900]},"box":{"left":266,"top":40,"cw":788,"ch":812},"start":[660,446],"end":[-540,446],"vsBefore":2,"vsAfter":14,"s0":{"targetX":-140787.3132056136,"targetY":0,"zoom":-6.99987,"originX":2606340,"originY":1206320},"s1":{"targetX":140786.33734570362,"targetY":0,"zoom":-6.99986,"originX":2606340,"originY":1206320},"tail":[{"targetX":0,"targetY":0,"zoom":-6.99986,"originX":2606340,"originY":1206320},{"targetX":12798.757940518513,"targetY":0,"zoom":-6.99986,"originX":2606340,"originY":1206320},{"targetX":25597.515881037034,"targetY":0,"zoom":-6.99986,"originX":2606340,"originY":1206320},{"targetX":38396.273821555544,"targetY":0,"zoom":-6.99986,"originX":2606340,"originY":1206320}]}
diag run 3 rc=1 ==== 15/16 PASS ==== FAIL  small: recenter-crossing-A dx=1200  ::  grab-point residual 800.00 buffer px (tol 4) 
[PAN-DIAG] {"sizeLabel":"large","dx":1200,"pre":{"el":"CANVAS.working-canvas","inner":[1400,900]},"box":{"left":266,"top":40,"cw":788,"ch":812},"start":[660,446],"end":[1860,446],"vsBefore":1,"vsAfter":14,"s0":{"targetX":0,"targetY":0,"zoom":-6.99987,"originX":2606340,"originY":1206320},"s1":{"targetX":-140787.3132056136,"targetY":0,"zoom":-6.99987,"originX":2606340,"originY":1206320},"tail":[{"targetX":0,"targetY":0,"zoom":-6.99987,"originX":2606340,"originY":1206320},{"targetX":-12798.846655055779,"targetY":0,"zoom":-6.99987,"originX":2606340,"originY":1206320},{"targetX":-25597.693310111572,"targetY":0,"zoom":-6.99987,"originX":2606340,"originY":1206320},{"targetX":-38396.53996516735,"targetY":0,"zoom":-6.99987,"originX":2606340,"originY":1206320}]}
[PAN-DIAG] {"sizeLabel":"large","dx":-1200,"pre":{"el":"CANVAS.working-canvas","inner":[1400,900]},"box":{"left":266,"top":40,"cw":788,"ch":812},"start":[660,446],"end":[-540,446],"vsBefore":1,"vsAfter":14,"s0":{"targetX":0,"targetY":0,"zoom":-6.99986,"originX":2606340,"originY":1206320},"s1":{"targetX":140786.33734570362,"targetY":0,"zoom":-6.99986,"originX":2606340,"originY":1206320},"tail":[{"targetX":0,"targetY":0,"zoom":-6.99986,"originX":2606340,"originY":1206320},{"targetX":12798.757940518513,"targetY":0,"zoom":-6.99986,"originX":2606340,"originY":1206320},{"targetX":25597.515881037034,"targetY":0,"zoom":-6.99986,"originX":2606340,"originY":1206320},{"targetX":38396.273821555544,"targetY":0,"zoom":-6.99986,"originX":2606340,"originY":1206320}]}
```

- **Reading.** In each failing case, s0 is the previous drag's end state (its zoom carries the previous call's jitter), while the first line logged after `setCam`'s call is the reset (targetX 0, the call's own jitter). The drag itself pans the full distance (s1 at ±140786 in world units, both directions). `setCam` (frontends/shell/e2e/pan-anchor.mjs:93-105 at f8bc2951) clears the log, then returns the last line once any line has arrived, so a late line from the previous gesture is taken as the reset. The failure is the harness's, timing-dependent, and not the shorter map's: the three runs at f8bc2951 with an 812-tall canvas passed. It is re-run alone, in an exclusive hold, before the gates, and the harness fix is proposed as its own node.

## Not yet run

E-STATUS-HEIGHT's mutation: it needs the step's correction (Amendment 3) first.
