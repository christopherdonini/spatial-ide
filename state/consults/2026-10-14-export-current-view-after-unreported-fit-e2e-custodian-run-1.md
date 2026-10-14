# PR #219 (export-current-view-after-unreported-fit) at eebf7298: the custodian's first e2e run, stopped under load

*The custodian's record, 2026-10-14. The port-5400 harness, under the human's approval of 2026-10-11 (item 1); the detached checkout C:/dev/wt/mm2b-e2e at eebf72980a1f12ea3b0f3cee013adb251a10cd0a; the exe built from that head's src-tauri with the e2e overlay, into the piece's own target on D: (publish.rs changed, OPEN-2 (b)); each suite a fresh app, in one shared hold. Log lines are byte-copied by script. The custodian stopped the run at 12:30:28Z, during the console suite (the task stop, by the transcript): a docs-lane build ran beside it, the regression suite timed out four checks, and the e2e suite needed a correction before its mutations could mean anything. The custodian then shut the app down with the harness's app-down, so console's closed-page failures are that shutdown's. The run's script outlived the stop and launched the publish suite on a fresh app at 12:31:02Z; it ran to its end before the custodian stopped the script, and the checkout was found clean. Every run that launched an app recorded the fixtures unchanged.*

## The suites, in order

```text
export-view: rc=1, 2026-10-14T12:08:37Z to 2026-10-14T12:08:50Z
selection: rc=0, 2026-10-14T12:09:10Z to 2026-10-14T12:12:51Z
regression: rc=1, 2026-10-14T12:13:16Z to 2026-10-14T12:24:13Z
layout: rc=0, 2026-10-14T12:25:20Z to 2026-10-14T12:27:55Z
style: rc=0, 2026-10-14T12:28:40Z to 2026-10-14T12:29:23Z
console: rc=1, 2026-10-14T12:29:54Z to 2026-10-14T12:30:39Z
publish: rc=1, 2026-10-14T12:31:02Z to 2026-10-14T12:31:45Z
```

## e2e:export-view (new)

```text
[E-CV-OPEN] FAIL (189ms): page.evaluate: TypeError: window.__SPATIAL_E2E__.capturePixels is not a function
[E-CV] FAIL (50ms): ev1-fit: prepare returned {"status":"refused","message":"no settled view yet -- pan or zoom the canvas once first"}
[E-CV-RESIZE] PASS (5687ms): F' [2599780.0746867373, 1198886.0514289497, 2602019.8486103383, 1201353.8262908815], R [2600095.2524544294, 1199087.228727477, 2601704.670842646, 1201152.6489923545] at 1088x680
[export-view] 2 PASS, 2 FAIL: E-CV-OPEN=FAIL E-CV=FAIL E-CV-RESIZE=PASS FIXTURES=PASS
```

- **E-CV-OPEN:** the suite's `stepOpen` polls `capturePixels` straight after `openPath`, but the hook is installed only when the canvas mounts, and the poll does not catch the TypeError. A defect of the suite, not of the product.
- **E-CV:** it ran with the map not yet drawn (the step before failed at once), so its prepare met the box still null and the defensive refusal answered: the expected behaviour for a null box (§2.2(d)).
- **E-CV-RESIZE** passed: R differs from F′ after a change of size, at a window of 1088 by 680.

## regression (beside the docs-lane build)

```text
[K6] FAIL (18131ms): K6/continuous: one coalesced camera change ("Zoom to layer" from a real above-threshold hover) did not show the named refusal text verbatim within 10000ms (hovered "id 28625 @ (2603831.589, 1203620.000)" at zoom-in notch 0; last seen: {"st
[K7] FAIL (240022ms): K7: timed out after 240000ms
[CURSOR'] FAIL (20009ms): CURSOR': timed out after 20000ms
[FIND'] FAIL (193109ms): FIND': the filtered scan never left the in-flight family (liveness/Cancel both gone) within its bound (last observed: {"livenessGone":true,"cancelGone":false,"incompleteText":null})
```

These are timeouts and bounds missed under load. They are not recorded as failures (THE MACHINE); the suite runs again, alone, at the corrected head.

## publish, run after the stop

Its one failure is a logic result, not a timeout: FILTERED' read the prompt's filter_scope as null after an applied filter and a whole-file prepare, where the sentence is expected. publish passed at e1f92a97 and at d59f1a6a. It is open: read at the corrected head, alone, before any gate.

## Not yet run

The rest of the suite list, source-changed's post route, and the three e2e mutations: at the head after correction round 1 (the form's Amendment 6).
