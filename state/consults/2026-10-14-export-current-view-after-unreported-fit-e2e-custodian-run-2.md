# PR #219 (export-current-view-after-unreported-fit) at e3a14042: the custodian's e2e run 2, every suite and the three e2e mutations

*The custodian's record, 2026-10-14. The port-5400 harness (the human's approval of 2026-10-11, item 1); the detached checkout C:/dev/wt/mm2b-e2e at e3a140427b3b60b96ab56c1f87aa0be2df127d99 (correction round 1: e2e/export-view.mjs and one comment since eebf7298); the exe built from eebf7298's src-tauri with the e2e overlay (no src-tauri change since); each suite a fresh app, in one shared hold. Log lines are byte-copied by script. Every run recorded the fixtures unchanged. Each mutation was applied alone from a scratch patch, run, reverted, and the checkout proven clean.*

## Every suite: all pass

```text
export-view: rc=0, 2026-10-14T13:30:15Z to 2026-10-14T13:30:38Z
selection: rc=0, 2026-10-14T13:30:57Z to 2026-10-14T13:34:31Z
regression: rc=0, 2026-10-14T13:34:48Z to 2026-10-14T13:40:18Z
layout: rc=0, 2026-10-14T13:40:48Z to 2026-10-14T13:41:43Z
style: rc=0, 2026-10-14T13:42:01Z to 2026-10-14T13:42:11Z
console: rc=0, 2026-10-14T13:42:34Z to 2026-10-14T13:48:53Z
publish: rc=0, 2026-10-14T13:49:15Z to 2026-10-14T13:49:24Z
admission-remediation: rc=0, 2026-10-14T13:49:41Z to 2026-10-14T13:50:09Z
filter: rc=0, 2026-10-14T13:50:23Z to 2026-10-14T13:50:34Z
filter-panel: rc=0, 2026-10-14T13:50:48Z to 2026-10-14T13:51:19Z
refusal-contract-baseline: rc=0, 2026-10-14T13:51:32Z to 2026-10-14T13:52:16Z
residency-harness: rc=0, 2026-10-14T13:52:30Z to 2026-10-14T13:52:45Z
source-changed: rc=0, 2026-10-14T13:52:59Z to 2026-10-14T13:53:22Z
source-watch-idle: rc=0, 2026-10-14T13:53:36Z to 2026-10-14T13:53:55Z
pan-anchor: rc=0, 2026-10-14T13:54:09Z to 2026-10-14T13:57:00Z
```

source-changed's post route: rc=0, ended 2026-10-14T13:57:40Z.

## e2e:export-view

```text
[E-CV-OPEN] PASS (2744ms): Current view is available after the first pixels, with no pan or zoom
[E-CV] PASS (9391ms): A [2599220.1312058372, 1198269.1077134667, 2600340.0181676373, 1199502.9951444326], F [2599779.6096260287, 1199344.371195924, 2602019.99390408, 1201812.818544196]; EV5 (recorded, not asserted): Z [2599779.6096260287, 1199665.56782563, 2602019.99390408, 1202134.015173902] differs from F
[E-CV-RESIZE] PASS (5401ms): F' [2599780.0746867373, 1198886.0514289497, 2602019.8486103383, 1201353.8262908815], R [2600095.2524544294, 1199087.228727477, 2601704.670842646, 1201152.6489923545] at 1088x680
[export-view] 4 PASS, 0 FAIL: E-CV-OPEN=PASS E-CV=PASS E-CV-RESIZE=PASS FIXTURES=PASS
```

## publish's FILTERED' (run 1's open question)

```text
[FILTERED'] PASS (891ms): filter-scope sentence present verbatim; manifest.operation.filter={"kind":"whole-file"}; bundle rows=2000 == full dataset (2000) both by the manifest's own claim and the reader's independent decode -- the filter did not leak
FILTERED'  PASS    filter-scope sentence present verbatim; manifest.operation.filter={"kind":"whole-file"}; bundle rows=2000 == full dataset (2000) both by the manifest's own claim and the reader's independent decode -- the filter did not leak
```

It passes alone: run 1's failure there came on a loaded machine and is not recorded as a failure (THE MACHINE).

## The three e2e mutations, each observed failing

- **E-CV** (App's getter reads `lastViewportBboxRef`, falling back to the view box while the ref is null):

```text
[E-CV-OPEN] PASS (2542ms): Current view is available after the first pixels, with no pan or zoom
[E-CV] FAIL (5299ms): E-CV: after the Apply and its fit, Current view still sends the earlier box: F [2599220.1312058372, 1198269.1077134667, 2600340.0181676373, 1199502.9951444326] equals A [2599220.1312058372, 1198269.1077134667, 2600340.0181676373, 1199502.9951444326]
[E-CV-RESIZE] FAIL (5374ms): E-CV-RESIZE: after the map shrank (1280x800 to 1088x680), Current view still sends the earlier box: R [2599220.1312058372, 1198269.1077134667, 2600340.0181676373, 1199502.9951444326] equals F' [2599220.1312058372, 1198269.1077134667, 2600340.0181676373, 1199502.9951444326]
[export-view] 2 PASS, 2 FAIL: E-CV-OPEN=PASS E-CV=FAIL E-CV-RESIZE=FAIL FIXTURES=PASS
```

- **E-CV-RESIZE** (the `onViewShown` call in the canvas's resize handler removed):

```text
[E-CV-OPEN] PASS (2545ms): Current view is available after the first pixels, with no pan or zoom
[E-CV] PASS (9319ms): A [2599220.1312058372, 1198269.1077134667, 2600340.0181676373, 1199502.9951444326], F [2599779.6096260287, 1199344.371195924, 2602019.99390408, 1201812.818544196]; EV5 (recorded, not asserted): Z [2599779.6096260287, 1199665.56782563, 2602019.99390408, 1202134.015173902] differs from F
[E-CV-RESIZE] FAIL (5375ms): E-CV-RESIZE: after the map shrank (1280x800 to 1088x680), Current view still sends the earlier box: R [2599780.0746867373, 1198886.0514289497, 2602019.8486103383, 1201353.8262908815] equals F' [2599780.0746867373, 1198886.0514289497, 2602019.8486103383, 1201353.8262908815]
[export-view] 3 PASS, 1 FAIL: E-CV-OPEN=PASS E-CV=PASS E-CV-RESIZE=FAIL FIXTURES=PASS
```

- **E-CV-OPEN** (availability only once the ref is written, the old settled-view signal):

```text
[E-CV-OPEN] FAIL (2501ms): E-CV-OPEN: the Current view radio is disabled after the first pixels, before any input
[E-CV] FAIL (4ms): ev1-fit: prepare returned {"status":"refused","message":"no settled view yet -- pan or zoom the canvas once first"}
[E-CV-RESIZE] FAIL (2346ms): ev6-refit: prepare returned {"status":"refused","message":"no settled view yet -- pan or zoom the canvas once first"}
[export-view] 1 PASS, 3 FAIL: E-CV-OPEN=FAIL E-CV=FAIL E-CV-RESIZE=FAIL FIXTURES=PASS
```

Each fails at the step the form names: E-CV at EV4 (F equals A), E-CV-RESIZE with R equal to F′, and E-CV-OPEN with the radio disabled after the first pixels. The worker's risk for E-CV-RESIZE (Amendment 5 item 3) did not occur.
