# S5d (a): the custodian's e2e runs at the piece's head — eight post runs, then the default and reopen routes

*The custodian's record (2026-10-20), under `frontends/shell/SOURCE-CHANGED-S5D-INCONCLUSIVE-PREREGISTRATION.md` (§4, "End to end, the custodian's", and §5), at the head of `cut/source-changed-s5d-inconclusive`. Built by script from each run's artifacts — the suite log, the report JSON, the session log the report names, and the app's stderr capture — each copied whole into the custodian's scratch folder right after its run. Every quoted line is byte-copied whole, carriage returns removed. This project's machine lines only; a line naming another project is left out.*

## Setup

- **The head** is 0e281e0793e159e8f24d47e3f8d6e9cf2c981045. The e2e checkout `C:/dev/wt/mm2b-e2e` was detached at it, clean before the first run and after the last (the summary's closing lines below).
- **The exe:** `git diff --name-only ed8731a7bdf19a48d37049cbe14e3d00d9db0372 0e281e0793e159e8f24d47e3f8d6e9cf2c981045 -- Cargo.toml Cargo.lock engine protocol renderer kernel frontends/shell/src-tauri` exited 0 and printed nothing, so step 2's exe is used: `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-ed8731a7.exe`, sha256 f3fdf25a795ce05d8bd135759d8b62add7520a3e48b86ad3cc4f103ea0a8c31f.
- **The harness** is the one step 2's record discloses (`state/consults/2026-10-20-source-changed-post-route-s5d-race-step-2-custodian-runs.md`, its Setup, Harness): the port-5400 harness, a fresh app at each launch, the stderr capture written fresh at each launch. Every report reads `launched: true`.
- **The hold.** Four requests for the one exclusive hold were not granted before this series (2026-10-20, labels s5di-1 to s5di-4): the first gave up as the machine was not quiet within its window (NOT_QUIET), and the next three gave up waiting (WAIT_TIMEOUT), each while another project's heavy run stayed live. Nothing ran in any of them. By the human's word (`state/directives/2026-10-20-adr-024-note-clause-corrected-s5d-series-booked-after-the-ttl-worker.md`, item 2), the custodian booked a slot under SpatialIDE for the first slot after the TTL worker's last run, and the hold was granted in it. This project's lines of the machine script's output, byte-copied:

```text
booking start 2026-10-20T19:51:00Z minutes 30 at 2026-10-20T19:49:07Z
BOOKED id=0639281226600000000-SpatialIDE-41684.json start=2026-10-20T19:51:00.000Z end=2026-10-20T20:21:00.000Z
book rc=0
MACHINE_QUEUED exclusive project=SpatialIDE: waiting to be first, for no other heavy run, 120 s since the last one, and 60 one-second samples averaging under 10% with at most 5 over 25%
MACHINE_QUIET quiet=True average=3.9% peaks-over-25=0 samples=60 others=none since-last-end=123s
MACHINE_HOLD exclusive project=SpatialIDE cores=all affinity=FFFF shell=bash.exe:3112 also=bash.exe:27184 (commands started from now on inherit it; release when done)
MACHINE_RELEASED project=SpatialIDE shell=bash.exe:3112 affinity=FF (cores 0-7)
series rc=0 end 2026-10-20T20:08:14Z
```

## Summary

| Run | Route | Exit | S5d | Class | P (counts) | W | R |
|---|---|---|---|---|---|---|---|
| post-1 | post | 3 | INCONCLUSIVE | C2 | no | no | no |
| post-2 | post | 3 | INCONCLUSIVE | C2 | yes (0) | no | no |
| post-3 | post | 3 | INCONCLUSIVE | C2 | yes (0, 0) | no | no |
| post-4 | post | 3 | INCONCLUSIVE | C2 | yes (0) | no | no |
| post-5 | post | 3 | INCONCLUSIVE | C2 | yes (0, 0) | no | no |
| post-6 | post | 3 | INCONCLUSIVE | C2 | yes (0) | no | no |
| post-7 | post | 3 | INCONCLUSIVE | C2 | no | no | no |
| post-8 | post | 3 | INCONCLUSIVE | C2 | no | no | no |
| default | pre | 0 | n/a | - | no | no | no |
| reopen | reopen | 0 | n/a | - | no | no | no |

## §5, predictions 3 and 4, read against the runs

- **Prediction 3, in the 8 post runs:**
  - no FAIL: held;
  - at least one INCONCLUSIVE, exiting 3: held, 8 of 8 (post-1, post-2, post-3, post-4, post-5, post-6, post-7, post-8);
  - every INCONCLUSIVE refusal is `{mtime}`: held;
  - every run has a P line: **NOT held** — no P line in post-1, post-7, post-8 (their captures: post-1, 2 lines; post-7, 2 lines; post-8, 2 lines; each names the session log its run's report names); P in post-2, post-3, post-4, post-5, post-6;
  - no W or R line: held.
  - Under §5, a wrong prediction is a result (class 2). In step 2's record every one of its 16 counted runs had a P line.
- **Prediction 4, the default and reopen routes:** held: every step PASS, exit 0.
- **The seam:** 8 of 8 post runs show the INCONCLUSIVE verdict and exit code 3 end to end at the head.

## The summary file's closing lines

```text
checkout clean at end, 0e281e0793e159e8f24d47e3f8d6e9cf2c981045
end 2026-10-20T20:08:13Z
```

## Each run's row (§4)

### post-1

- **Route** post; **report** `source-changed-1792526571862.json`; **launched** true; **run** 2026-10-20T20:02:27Z to 2026-10-20T20:02:59Z; **the suite's exit code** 3.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-retarget-junction INFO; S4-issue-one-query-and-retarget-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed INCONCLUSIVE; fixture-integrity PASS.
- **S5d's suite line:**

```text
S5d-post-check-route-confirmed           INCONCLUSIVE  S5d: INCONCLUSIVE (never a pass): a tile mint was refused with engine.source_changed and the pre-check's own descriptor detail ({mtime}) -- a sibling tile's pre-check found the change while the generation was live at its live check; which kernel route ended the generation is not read by this step, so the post-check route is neither shown nor excluded. Evidence: {"sessionLogBaselineLineCount":31,"newLineCount":9,"mintRefused":["1792526569031 tile-stream-mint-refused 8:13: engine.source_changed {\"detail\":\"{mtime}\"}"],"sessionEnded":["1792526569019 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)"]}
```

- **Session log after S5d's baseline** (line 31), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended` (the S5d form's Amendment 4 item 2):

```text
1792526569019 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792526569031 tile-stream-mint-refused 8:13: engine.source_changed {"detail":"{mtime}"}
```

- **The stderr capture's P, W and R lines,** in order (the capture has 2 lines):

```text
(none)
```

- **Class:** P no; W no; R no; S5d INCONCLUSIVE, C2.

### post-2

- **Route** post; **report** `source-changed-1792526604998.json`; **launched** true; **run** 2026-10-20T20:02:59Z to 2026-10-20T20:03:32Z; **the suite's exit code** 3.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-retarget-junction INFO; S4-issue-one-query-and-retarget-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed INCONCLUSIVE; fixture-integrity PASS.
- **S5d's suite line:**

```text
S5d-post-check-route-confirmed           INCONCLUSIVE  S5d: INCONCLUSIVE (never a pass): a tile mint was refused with engine.source_changed and the pre-check's own descriptor detail ({mtime}) -- a sibling tile's pre-check found the change while the generation was live at its live check; which kernel route ended the generation is not read by this step, so the post-check route is neither shown nor excluded. Evidence: {"sessionLogBaselineLineCount":31,"newLineCount":9,"mintRefused":["1792526602144 tile-stream-mint-refused 8:13: engine.source_changed {\"detail\":\"{mtime}\"}"],"sessionEnded":["1792526602129 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)"]}
```

- **Session log after S5d's baseline** (line 31), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended` (the S5d form's Amendment 4 item 2):

```text
1792526602129 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792526602144 tile-stream-mint-refused 8:13: engine.source_changed {"detail":"{mtime}"}
```

- **The stderr capture's P, W and R lines,** in order (the capture has 3 lines):

```text
session ended for dataset `ds_f7997cc7e8dd4c23cf2b21836949ba32`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **Class:** P yes, count 0; W no; R no; S5d INCONCLUSIVE, C2.

### post-3

- **Route** post; **report** `source-changed-1792526637561.json`; **launched** true; **run** 2026-10-20T20:03:32Z to 2026-10-20T20:04:05Z; **the suite's exit code** 3.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-retarget-junction INFO; S4-issue-one-query-and-retarget-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed INCONCLUSIVE; fixture-integrity PASS.
- **S5d's suite line:**

```text
S5d-post-check-route-confirmed           INCONCLUSIVE  S5d: INCONCLUSIVE (never a pass): a tile mint was refused with engine.source_changed and the pre-check's own descriptor detail ({mtime}) -- a sibling tile's pre-check found the change while the generation was live at its live check; which kernel route ended the generation is not read by this step, so the post-check route is neither shown nor excluded. Evidence: {"sessionLogBaselineLineCount":31,"newLineCount":10,"mintRefused":["1792526634727 tile-stream-mint-refused 8:14: engine.source_changed {\"detail\":\"{mtime}\"}"],"sessionEnded":["1792526634717 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)"]}
```

- **Session log after S5d's baseline** (line 31), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended` (the S5d form's Amendment 4 item 2):

```text
1792526634717 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792526634727 tile-stream-mint-refused 8:14: engine.source_changed {"detail":"{mtime}"}
```

- **The stderr capture's P, W and R lines,** in order (the capture has 4 lines):

```text
session ended for dataset `ds_952ca80b68d96ebb15208ea5202283e0`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
session ended for dataset `ds_952ca80b68d96ebb15208ea5202283e0`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **Class:** P yes, counts 0, 0; W no; R no; S5d INCONCLUSIVE, C2.

### post-4

- **Route** post; **report** `source-changed-1792526669671.json`; **launched** true; **run** 2026-10-20T20:04:05Z to 2026-10-20T20:04:37Z; **the suite's exit code** 3.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-retarget-junction INFO; S4-issue-one-query-and-retarget-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed INCONCLUSIVE; fixture-integrity PASS.
- **S5d's suite line:**

```text
S5d-post-check-route-confirmed           INCONCLUSIVE  S5d: INCONCLUSIVE (never a pass): a tile mint was refused with engine.source_changed and the pre-check's own descriptor detail ({mtime}) -- a sibling tile's pre-check found the change while the generation was live at its live check; which kernel route ended the generation is not read by this step, so the post-check route is neither shown nor excluded. Evidence: {"sessionLogBaselineLineCount":31,"newLineCount":9,"mintRefused":["1792526666830 tile-stream-mint-refused 8:13: engine.source_changed {\"detail\":\"{mtime}\"}"],"sessionEnded":["1792526666818 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)"]}
```

- **Session log after S5d's baseline** (line 31), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended` (the S5d form's Amendment 4 item 2):

```text
1792526666818 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792526666830 tile-stream-mint-refused 8:13: engine.source_changed {"detail":"{mtime}"}
```

- **The stderr capture's P, W and R lines,** in order (the capture has 3 lines):

```text
session ended for dataset `ds_8b1cf771c9540de1513117833a427597`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **Class:** P yes, count 0; W no; R no; S5d INCONCLUSIVE, C2.

### post-5

- **Route** post; **report** `source-changed-1792526701855.json`; **launched** true; **run** 2026-10-20T20:04:37Z to 2026-10-20T20:05:09Z; **the suite's exit code** 3.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-retarget-junction INFO; S4-issue-one-query-and-retarget-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed INCONCLUSIVE; fixture-integrity PASS.
- **S5d's suite line:**

```text
S5d-post-check-route-confirmed           INCONCLUSIVE  S5d: INCONCLUSIVE (never a pass): a tile mint was refused with engine.source_changed and the pre-check's own descriptor detail ({mtime}) -- a sibling tile's pre-check found the change while the generation was live at its live check; which kernel route ended the generation is not read by this step, so the post-check route is neither shown nor excluded. Evidence: {"sessionLogBaselineLineCount":31,"newLineCount":10,"mintRefused":["1792526699002 tile-stream-mint-refused 8:14: engine.source_changed {\"detail\":\"{mtime}\"}"],"sessionEnded":["1792526698992 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)"]}
```

- **Session log after S5d's baseline** (line 31), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended` (the S5d form's Amendment 4 item 2):

```text
1792526698992 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792526699002 tile-stream-mint-refused 8:14: engine.source_changed {"detail":"{mtime}"}
```

- **The stderr capture's P, W and R lines,** in order (the capture has 4 lines):

```text
session ended for dataset `ds_bd982a167dafc8287af03af3641146b7`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
session ended for dataset `ds_bd982a167dafc8287af03af3641146b7`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **Class:** P yes, counts 0, 0; W no; R no; S5d INCONCLUSIVE, C2.

### post-6

- **Route** post; **report** `source-changed-1792526733903.json`; **launched** true; **run** 2026-10-20T20:05:09Z to 2026-10-20T20:05:41Z; **the suite's exit code** 3.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-retarget-junction INFO; S4-issue-one-query-and-retarget-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed INCONCLUSIVE; fixture-integrity PASS.
- **S5d's suite line:**

```text
S5d-post-check-route-confirmed           INCONCLUSIVE  S5d: INCONCLUSIVE (never a pass): a tile mint was refused with engine.source_changed and the pre-check's own descriptor detail ({mtime}) -- a sibling tile's pre-check found the change while the generation was live at its live check; which kernel route ended the generation is not read by this step, so the post-check route is neither shown nor excluded. Evidence: {"sessionLogBaselineLineCount":31,"newLineCount":10,"mintRefused":["1792526731085 tile-stream-mint-refused 8:14: engine.source_changed {\"detail\":\"{mtime}\"}"],"sessionEnded":["1792526731073 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)"]}
```

- **Session log after S5d's baseline** (line 31), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended` (the S5d form's Amendment 4 item 2):

```text
1792526731073 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792526731085 tile-stream-mint-refused 8:14: engine.source_changed {"detail":"{mtime}"}
```

- **The stderr capture's P, W and R lines,** in order (the capture has 3 lines):

```text
session ended for dataset `ds_d9541652d859a32c92a1b1f929c8ede1`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **Class:** P yes, count 0; W no; R no; S5d INCONCLUSIVE, C2.

### post-7

- **Route** post; **report** `source-changed-1792526765460.json`; **launched** true; **run** 2026-10-20T20:05:41Z to 2026-10-20T20:06:12Z; **the suite's exit code** 3.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-retarget-junction INFO; S4-issue-one-query-and-retarget-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed INCONCLUSIVE; fixture-integrity PASS.
- **S5d's suite line:**

```text
S5d-post-check-route-confirmed           INCONCLUSIVE  S5d: INCONCLUSIVE (never a pass): a tile mint was refused with engine.source_changed and the pre-check's own descriptor detail ({mtime}) -- a sibling tile's pre-check found the change while the generation was live at its live check; which kernel route ended the generation is not read by this step, so the post-check route is neither shown nor excluded. Evidence: {"sessionLogBaselineLineCount":31,"newLineCount":9,"mintRefused":["1792526762613 tile-stream-mint-refused 8:13: engine.source_changed {\"detail\":\"{mtime}\"}"],"sessionEnded":["1792526762603 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)"]}
```

- **Session log after S5d's baseline** (line 31), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended` (the S5d form's Amendment 4 item 2):

```text
1792526762603 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792526762613 tile-stream-mint-refused 8:13: engine.source_changed {"detail":"{mtime}"}
```

- **The stderr capture's P, W and R lines,** in order (the capture has 2 lines):

```text
(none)
```

- **Class:** P no; W no; R no; S5d INCONCLUSIVE, C2.

### post-8

- **Route** post; **report** `source-changed-1792526797121.json`; **launched** true; **run** 2026-10-20T20:06:13Z to 2026-10-20T20:06:44Z; **the suite's exit code** 3.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-retarget-junction INFO; S4-issue-one-query-and-retarget-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed INCONCLUSIVE; fixture-integrity PASS.
- **S5d's suite line:**

```text
S5d-post-check-route-confirmed           INCONCLUSIVE  S5d: INCONCLUSIVE (never a pass): a tile mint was refused with engine.source_changed and the pre-check's own descriptor detail ({mtime}) -- a sibling tile's pre-check found the change while the generation was live at its live check; which kernel route ended the generation is not read by this step, so the post-check route is neither shown nor excluded. Evidence: {"sessionLogBaselineLineCount":31,"newLineCount":9,"mintRefused":["1792526794281 tile-stream-mint-refused 8:13: engine.source_changed {\"detail\":\"{mtime}\"}"],"sessionEnded":["1792526794271 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)"]}
```

- **Session log after S5d's baseline** (line 31), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended` (the S5d form's Amendment 4 item 2):

```text
1792526794271 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792526794281 tile-stream-mint-refused 8:13: engine.source_changed {"detail":"{mtime}"}
```

- **The stderr capture's P, W and R lines,** in order (the capture has 2 lines):

```text
(none)
```

- **Class:** P no; W no; R no; S5d INCONCLUSIVE, C2.

### default

- **Route** pre; **report** `source-changed-1792526828585.json`; **launched** true; **run** 2026-10-20T20:06:44Z to 2026-10-20T20:07:16Z; **the suite's exit code** 0.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-retarget-junction PASS; S4-issue-one-query PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; fixture-integrity PASS.

### reopen

- **Route** reopen; **report** `source-changed-1792526886057.json`; **launched** true; **run** 2026-10-20T20:07:16Z to 2026-10-20T20:08:13Z; **the suite's exit code** 0.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-retarget-junction PASS; S4-issue-one-query PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; R1-failed-reopen-does-not-clear PASS; R2-successful-reopen-clears-and-identifies PASS; R3-zoom-to-layer-clickable-and-effective PASS; R4-second-source-change-ends-the-new-session PASS; fixture-integrity PASS.

