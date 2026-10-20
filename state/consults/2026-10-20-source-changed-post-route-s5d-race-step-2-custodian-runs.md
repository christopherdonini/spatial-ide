# source-changed-post-route-s5d-race, step 2: the custodian's runs of the post route on the watcher-blind route, alone and under this project's own load

*The custodian's record (2026-10-20), under `frontends/shell/SOURCE-CHANGED-POST-ROUTE-S5D-RACE-PREREGISTRATION.md` (§1 with Amendments 2 and 4). Built by script from each run's artifacts: the suite log, the report JSON, the session log the report names, and the app's stderr capture, each copied whole into the custodian's scratch folder right after its run under a name from its arm and number. Every quoted line is byte-copied whole, carriage returns removed. The gaps are ordering evidence only: no p50 or p95, no docs/08 budget, no claim about speed, and the arms are not compared (§1.4; Amendment 4 item 2).*

## Setup

- **B** is ed8731a7bdf19a48d37049cbe14e3d00d9db0372, the main commit step 2 started from (Amendment 4 item 1). The e2e checkout `C:/dev/wt/mm2b-e2e` was detached at B, clean before the pre-flight and after the last run.
- **Item 1's path list,** `git diff --name-only be6aa6203a196f553ec08f697d678dfa08a78bd4 <B> -- Cargo.toml Cargo.lock engine protocol renderer kernel frontends/shell/src-tauri`, exit 0, prints 2 paths:

```text
engine/CONNECTION-REUSE-RECYCLED-INTERRUPT-FLAKE-FULL-PREREGISTRATION.md
engine/CONNECTION-REUSE-RECYCLED-INTERRUPT-FLAKE-PREREGISTRATION.md
```

  So by item 1 the exe was rebuilt at B in a shared hold, by `cargo build` in `frontends/shell/src-tauri` with the port-5400 overlay, as step 1 built it. The rebuilt exe is `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-ed8731a7.exe`, sha256 f3fdf25a795ce05d8bd135759d8b62add7520a3e48b86ad3cc4f103ea0a8c31f, the same bytes as step 1's exe. The build's lines:

```text
build rc=0     Finished `dev` profile [unoptimized + debuginfo] target(s) in 24.59s
exe D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-ed8731a7.exe sha256 f3fdf25a795ce05d8bd135759d8b62add7520a3e48b86ad3cc4f103ea0a8c31f
checkout /c/dev/wt/mm2b-e2e at ed8731a7bdf19a48d37049cbe14e3d00d9db0372
```

- **The frontend's own list,** `git diff --name-only be6aa6203a196f553ec08f697d678dfa08a78bd4 <B> -- frontends/shell/src`, exit 0, prints 13 paths, so the frontend is neither step 1's nor round 2's, and nothing is pooled (item 1):

```text
frontends/shell/src/App.command.test.tsx
frontends/shell/src/App.tsx
frontends/shell/src/admission/AdmissionPanel.tsx
frontends/shell/src/command/CommandBar.tsx
frontends/shell/src/command/commandBoundary.test.ts
frontends/shell/src/command/commandConstants.ts
frontends/shell/src/command/commandDraft.test.ts
frontends/shell/src/command/commandDraft.ts
frontends/shell/src/layout/StudioLayout.tsx
frontends/shell/src/layout/actionRegistry.test.ts
frontends/shell/src/layout/actionRegistry.ts
frontends/shell/src/publish/PublishPanel.tsx
frontends/shell/src/styles.css
```

- **Harness:** port 5180 is still excluded, so the runs use the port-5400 harness on its approval's terms (§1.1), as step 1's record disclosed it. Every run sets `SPATIAL_E2E_SOURCE_CHANGED_ROUTE=post` and launches a fresh app. The stderr capture is the harness's own destination, written fresh at each launch (step 1's deviation 2).
- **Machine:** 16 logical cores. This project's lines of the machine script's output, byte-copied: the build's shared hold, the first request for the series' exclusive hold (refused, deviation 1), and the series' exclusive hold:

```text
MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:47656 also=bash.exe:41048 (commands started from now on inherit it; release when done)
MACHINE_RELEASED project=SpatialIDE shell=bash.exe:47656 affinity=FF (cores 0-7)
```

```text
MACHINE_ERROR NOT_BOOKED an exclusive run over 30 minutes needs a booking of its project that covers now
MACHINE_NOT_HELD project=SpatialIDE shell=bash.exe:20932: no live hold of this shell, nothing done
```

```text
MACHINE_QUEUED exclusive project=SpatialIDE: waiting to be first, for no other heavy run, 120 s since the last one, and 60 one-second samples averaging under 10% with at most 5 over 25%
MACHINE_HOLD exclusive project=SpatialIDE cores=all affinity=FFFF shell=bash.exe:30772 also=bash.exe:25724 (commands started from now on inherit it; release when done)
MACHINE_RELEASED project=SpatialIDE shell=bash.exe:30772 affinity=FF (cores 0-7)
```

- **Affinity** (Amendment 2): the app's in the pre-flight and the spinner's, once for the series, each the hold's grant:

```text
pre app-pid=37116 app-affinity=65535
spinner pid=14748 affinity=65535
```

- **The pre-flight** (§1.3, Amendment 4 item 5): its capture gained lines, and the repoint helper started and exited:

```text
pre-flight stderr capture: 3 line(s)
pre-flight helper: source-changed: repoint helper PID 1784 exited (code 0) after its stdin closed (end of main)
```

- **Deviations** (class 2, recorded):
  1. The series' first exclusive hold request asked for 35 minutes. The machine script refused it with exit 98 before anything ran (its first line above: an exclusive run over 30 minutes needs a booking). The request was made again for 30 minutes, the estimate §1.2 gives, and granted; nothing else changed.
  2. The app's PID is read while it runs only in the pre-flight (the affinity probe). For the counted runs it is the second `killed tree` line of the runner output, the app's, as step 1's deviation 1 read it.

## Summary

| Run | Arm | S5d | Class | P (counts) | W | R | t_repoint read |
|---|---|---|---|---|---|---|---|
| pre-flight (not counted) | A | FAIL | C2 | yes (0) | no | no | yes |
| A1 | A | FAIL | C2 | yes (0) | no | no | yes |
| B1 | B | FAIL | C2 | yes (0) | no | no | yes |
| A2 | A | FAIL | C2 | yes (0) | no | no | yes |
| B2 | B | FAIL | C2 | yes (0, 0) | no | no | yes |
| A3 | A | FAIL | C2 | yes (0, 0) | no | no | yes |
| B3 | B | FAIL | C2 | yes (0) | no | no | yes |
| A4 | A | FAIL | C2 | yes (0, 0) | no | no | yes |
| B4 | B | FAIL | C2 | yes (0) | no | no | yes |
| A5 | A | FAIL | C2 | yes (0, 0) | no | no | yes |
| B5 | B | PASS | - | yes (23) | no | no | yes |
| A6 | A | FAIL | C2 | yes (0, 0) | no | no | yes |
| B6 | B | FAIL | C2 | yes (0, 0) | no | no | yes |
| A7 | A | FAIL | C2 | yes (0) | no | no | yes |
| B7 | B | PASS | - | yes (23) | no | no | yes |
| A8 | A | FAIL | C2 | yes (0, 0) | no | no | yes |
| B8 | B | FAIL | C2 | yes (0, 0) | no | no | yes |

- **Counted:** 16 runs, A1 to B8 (§1.3). The pre-flight is not counted and enters no outcome. S5d failed in 14 of 16, so no extension runs.
- **Classes of the failures (item 3):** C1 none; C2 A1, B1, A2, B2, A3, B3, A4, B4, A5, A6, B6, A7, A8, B8; C3 none.
- **W** in 0 counted run(s); **R** in 0.
- **The outcome (item 4, the first match in its order):** **O2**, on C2 runs A1, B1, A2, B2, A3, B3, A4, B4, A5, A6, B6, A7, A8, B8. Amendment 4 item 4 predicted O2.

## The summary file's closing lines

```text
checkout at end ed8731a7bdf19a48d37049cbe14e3d00d9db0372
fails-S5d 14 of 16; end 2026-10-20T11:23:50Z
```

## Each run's row (Amendment 4 item 2)

### Pre-flight (not counted)

- **Arm** A; **hold** the series; **build** the exe at ed8731a7bdf19a48d37049cbe14e3d00d9db0372 (item 1; byte-identical to step 1's, built at be6aa620), the checkout at ed8731a7bdf19a48d37049cbe14e3d00d9db0372; **report** `source-changed-1792494686773.json`; **launched** true; **app** PID 37116, affinity 65535, exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-ed8731a7.exe`; **run** 2026-10-20T11:10:52.775Z to 2026-10-20T11:11:35.043Z; **suite exit** 1; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-retarget-junction INFO; S4-issue-one-query-and-retarget-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed FAIL; fixture-integrity PASS.
- **The first new `stream-issued` entry in S4:** received 2026-10-20T11:11:23.846Z (1792494683846 ms); S4's count of such entries 4; its text:

```text
[render-trace] stream-issued {dataset: ds_5f3a7baf189c071080b9a922029f966a, streamHandle: sh_224595f6ed0acecb01e440f887c161c1}
```

- **The repoint request:** not stamped. **The answer:** not stamped (item 2); S4's verdict and note:

```text
PASS a stream-issued line followed the "pan-beyond-viewport" gesture (17 -> 21 in the render trace); the junction was repointed to b on that signal; both copies still hash to the fixture
```

- **t_repoint,** the junction's lstat ctime read after the run's report: 2026-10-20T11:11:23.859Z (1792494683859.2573 ms).
- **Session log after S5d's baseline** (line 32), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792494683885 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792494683897 tile-stream-mint-refused 8:13: engine.source_changed {"detail":"{mtime}"}
```

- **The status block's message:**

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture's P, W and R lines,** in order:

```text
session ended for dataset `ds_5f3a7baf189c071080b9a922029f966a`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **The helper's exit line:**

```text
source-changed: repoint helper PID 1784 exited (code 0) after its stdin closed (end of main)
```

- **Gaps (ms), ordering evidence only (§1.4, item 2):** session-ended less t_repoint 26; refusal 1 less session-ended 12; t_repoint less the stream-issued receipt 13.
- **Classes (item 3):** P yes, count 0; W no; R no; S5d FAIL, C2.

### A1

- **Arm** A; **hold** the series; **build** the exe at ed8731a7bdf19a48d37049cbe14e3d00d9db0372 (item 1; byte-identical to step 1's, built at be6aa620), the checkout at ed8731a7bdf19a48d37049cbe14e3d00d9db0372; **report** `source-changed-1792494723892.json`; **launched** true; **app** PID 36116 (from the runner's stop line), exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-ed8731a7.exe`; **run** 2026-10-20T11:11:38.212Z to 2026-10-20T11:12:12.649Z; **suite exit** 1; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-retarget-junction INFO; S4-issue-one-query-and-retarget-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed FAIL; fixture-integrity PASS.
- **The first new `stream-issued` entry in S4:** received 2026-10-20T11:12:00.843Z (1792494720843 ms); S4's count of such entries 5; its text:

```text
[render-trace] stream-issued {dataset: ds_e9dae8cfd596bdc67242f8f18717731f, streamHandle: sh_82bf58822b7a0027cc62a31d5f3f8ab0}
```

- **The repoint request:** not stamped. **The answer:** not stamped (item 2); S4's verdict and note:

```text
PASS a stream-issued line followed the "pan-beyond-viewport" gesture (17 -> 22 in the render trace); the junction was repointed to b on that signal; both copies still hash to the fixture
```

- **t_repoint,** the junction's lstat ctime read after the run's report: 2026-10-20T11:12:00.860Z (1792494720860.8108 ms).
- **Session log after S5d's baseline** (line 31), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792494720892 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792494720902 tile-stream-mint-refused 8:14: engine.source_changed {"detail":"{mtime}"}
```

- **The status block's message:**

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture's P, W and R lines,** in order:

```text
session ended for dataset `ds_e9dae8cfd596bdc67242f8f18717731f`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **The helper's exit line:**

```text
source-changed: repoint helper PID 38232 exited (code 0) after its stdin closed (end of main)
```

- **Gaps (ms), ordering evidence only (§1.4, item 2):** session-ended less t_repoint 31; refusal 1 less session-ended 10; t_repoint less the stream-issued receipt 18.
- **Classes (item 3):** P yes, count 0; W no; R no; S5d FAIL, C2.

### B1

- **Arm** B; **hold** the series; **build** the exe at ed8731a7bdf19a48d37049cbe14e3d00d9db0372 (item 1; byte-identical to step 1's, built at be6aa620), the checkout at ed8731a7bdf19a48d37049cbe14e3d00d9db0372; **report** `source-changed-1792494764288.json`; **launched** true; **app** PID 35984 (from the runner's stop line), exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-ed8731a7.exe`; **run** 2026-10-20T11:12:13.796Z to 2026-10-20T11:12:54.554Z; **suite exit** 1; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-retarget-junction INFO; S4-issue-one-query-and-retarget-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed FAIL; fixture-integrity PASS.
- **The first new `stream-issued` entry in S4:** received 2026-10-20T11:12:41.109Z (1792494761109 ms); S4's count of such entries 5; its text:

```text
[render-trace] stream-issued {dataset: ds_d6ac6b65f97d7d0d9a14159cc6514fe4, streamHandle: sh_129b60ee2f01f9a83d7befb07f7361de}
```

- **The repoint request:** not stamped. **The answer:** not stamped (item 2); S4's verdict and note:

```text
PASS a stream-issued line followed the "pan-beyond-viewport" gesture (17 -> 22 in the render trace); the junction was repointed to b on that signal; both copies still hash to the fixture
```

- **t_repoint,** the junction's lstat ctime read after the run's report: 2026-10-20T11:12:41.136Z (1792494761136.3672 ms).
- **Session log after S5d's baseline** (line 32), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792494761179 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792494761199 tile-stream-mint-refused 8:14: engine.source_changed {"detail":"{mtime}"}
```

- **The status block's message:**

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture's P, W and R lines,** in order:

```text
session ended for dataset `ds_d6ac6b65f97d7d0d9a14159cc6514fe4`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **The helper's exit line:**

```text
source-changed: repoint helper PID 29128 exited (code 0) after its stdin closed (end of main)
```

- **Gaps (ms), ordering evidence only (§1.4, item 2):** session-ended less t_repoint 43; refusal 1 less session-ended 20; t_repoint less the stream-issued receipt 27.
- **Classes (item 3):** P yes, count 0; W no; R no; S5d FAIL, C2.

### A2

- **Arm** A; **hold** the series; **build** the exe at ed8731a7bdf19a48d37049cbe14e3d00d9db0372 (item 1; byte-identical to step 1's, built at be6aa620), the checkout at ed8731a7bdf19a48d37049cbe14e3d00d9db0372; **report** `source-changed-1792494801565.json`; **launched** true; **app** PID 30060 (from the runner's stop line), exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-ed8731a7.exe`; **run** 2026-10-20T11:12:55.591Z to 2026-10-20T11:13:29.254Z; **suite exit** 1; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-retarget-junction INFO; S4-issue-one-query-and-retarget-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed FAIL; fixture-integrity PASS.
- **The first new `stream-issued` entry in S4:** received 2026-10-20T11:13:18.641Z (1792494798641 ms); S4's count of such entries 5; its text:

```text
[render-trace] stream-issued {dataset: ds_1c49c597d04ab47680061363a9c65de9, streamHandle: sh_1d415a511a5d0707bc74d46e7dfc516f}
```

- **The repoint request:** not stamped. **The answer:** not stamped (item 2); S4's verdict and note:

```text
PASS a stream-issued line followed the "pan-beyond-viewport" gesture (17 -> 22 in the render trace); the junction was repointed to b on that signal; both copies still hash to the fixture
```

- **t_repoint,** the junction's lstat ctime read after the run's report: 2026-10-20T11:13:18.664Z (1792494798664.816 ms).
- **Session log after S5d's baseline** (line 32), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792494798694 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792494798706 tile-stream-mint-refused 8:14: engine.source_changed {"detail":"{mtime}"}
```

- **The status block's message:**

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture's P, W and R lines,** in order:

```text
session ended for dataset `ds_1c49c597d04ab47680061363a9c65de9`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **The helper's exit line:**

```text
source-changed: repoint helper PID 22200 exited (code 0) after its stdin closed (end of main)
```

- **Gaps (ms), ordering evidence only (§1.4, item 2):** session-ended less t_repoint 29; refusal 1 less session-ended 12; t_repoint less the stream-issued receipt 24.
- **Classes (item 3):** P yes, count 0; W no; R no; S5d FAIL, C2.

### B2

- **Arm** B; **hold** the series; **build** the exe at ed8731a7bdf19a48d37049cbe14e3d00d9db0372 (item 1; byte-identical to step 1's, built at be6aa620), the checkout at ed8731a7bdf19a48d37049cbe14e3d00d9db0372; **report** `source-changed-1792494842221.json`; **launched** true; **app** PID 28596 (from the runner's stop line), exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-ed8731a7.exe`; **run** 2026-10-20T11:13:30.282Z to 2026-10-20T11:14:13.096Z; **suite exit** 1; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-retarget-junction INFO; S4-issue-one-query-and-retarget-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed FAIL; fixture-integrity PASS.
- **The first new `stream-issued` entry in S4:** received 2026-10-20T11:13:58.917Z (1792494838917 ms); S4's count of such entries 5; its text:

```text
[render-trace] stream-issued {dataset: ds_8e67893a41084990db97e7468a9ecec9, streamHandle: sh_504ad7cac38ea911d0b8ae5678ec7052}
```

- **The repoint request:** not stamped. **The answer:** not stamped (item 2); S4's verdict and note:

```text
PASS a stream-issued line followed the "pan-beyond-viewport" gesture (17 -> 22 in the render trace); the junction was repointed to b on that signal; both copies still hash to the fixture
```

- **t_repoint,** the junction's lstat ctime read after the run's report: 2026-10-20T11:13:58.946Z (1792494838946.0134 ms).
- **Session log after S5d's baseline** (line 33), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792494838988 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792494839008 tile-stream-mint-refused 8:14: engine.source_changed {"detail":"{mtime}"}
```

- **The status block's message:**

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture's P, W and R lines,** in order:

```text
session ended for dataset `ds_8e67893a41084990db97e7468a9ecec9`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
session ended for dataset `ds_8e67893a41084990db97e7468a9ecec9`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **The helper's exit line:**

```text
source-changed: repoint helper PID 22168 exited (code 0) after its stdin closed (end of main)
```

- **Gaps (ms), ordering evidence only (§1.4, item 2):** session-ended less t_repoint 42; refusal 1 less session-ended 20; t_repoint less the stream-issued receipt 29.
- **Classes (item 3):** P yes, counts 0, 0; W no; R no; S5d FAIL, C2.

### A3

- **Arm** A; **hold** the series; **build** the exe at ed8731a7bdf19a48d37049cbe14e3d00d9db0372 (item 1; byte-identical to step 1's, built at be6aa620), the checkout at ed8731a7bdf19a48d37049cbe14e3d00d9db0372; **report** `source-changed-1792494881504.json`; **launched** true; **app** PID 35696 (from the runner's stop line), exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-ed8731a7.exe`; **run** 2026-10-20T11:14:14.126Z to 2026-10-20T11:14:51.010Z; **suite exit** 1; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-retarget-junction INFO; S4-issue-one-query-and-retarget-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed FAIL; fixture-integrity PASS.
- **The first new `stream-issued` entry in S4:** received 2026-10-20T11:14:38.182Z (1792494878182 ms); S4's count of such entries 5; its text:

```text
[render-trace] stream-issued {dataset: ds_8124f0bab1ce89de947a9a6445908ab3, streamHandle: sh_1edec8873cfba4e4c2f44de39ecce66e}
```

- **The repoint request:** not stamped. **The answer:** not stamped (item 2); S4's verdict and note:

```text
PASS a stream-issued line followed the "pan-beyond-viewport" gesture (17 -> 22 in the render trace); the junction was repointed to b on that signal; both copies still hash to the fixture
```

- **t_repoint,** the junction's lstat ctime read after the run's report: 2026-10-20T11:14:38.216Z (1792494878216.3784 ms).
- **Session log after S5d's baseline** (line 32), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792494878258 warn tile-session-ended-source-changed: engine.source_changed: refused: the source file changed while it was open ({this dataset's session ended when its source was observed to have changed}). This check does not establish snapshot consistency, cannot detect every in-place modification, and may detect a change during a query only after that query has finished reading
1792494878311 tile-stream-mint-refused 8:14: engine.source_changed {"detail":"{mtime}"}
```

- **The status block's message:**

```text
refused: the source file changed while it was open ({this dataset's session ended when its source was observed to have changed}). This check does not establish snapshot consistency, cannot detect every in-place modification, and may detect a change during a query only after that query has finished reading
```

- **The stderr capture's P, W and R lines,** in order:

```text
session ended for dataset `ds_8124f0bab1ce89de947a9a6445908ab3`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
session ended for dataset `ds_8124f0bab1ce89de947a9a6445908ab3`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **The helper's exit line:**

```text
source-changed: repoint helper PID 38916 exited (code 0) after its stdin closed (end of main)
```

- **Gaps (ms), ordering evidence only (§1.4, item 2):** session-ended less t_repoint 42; refusal 1 less session-ended 53; t_repoint less the stream-issued receipt 34.
- **Classes (item 3):** P yes, counts 0, 0; W no; R no; S5d FAIL, C2.

### B3

- **Arm** B; **hold** the series; **build** the exe at ed8731a7bdf19a48d37049cbe14e3d00d9db0372 (item 1; byte-identical to step 1's, built at be6aa620), the checkout at ed8731a7bdf19a48d37049cbe14e3d00d9db0372; **report** `source-changed-1792494923264.json`; **launched** true; **app** PID 47576 (from the runner's stop line), exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-ed8731a7.exe`; **run** 2026-10-20T11:14:52.093Z to 2026-10-20T11:15:33.827Z; **suite exit** 1; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-retarget-junction INFO; S4-issue-one-query-and-retarget-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed FAIL; fixture-integrity PASS.
- **The first new `stream-issued` entry in S4:** received 2026-10-20T11:15:20.057Z (1792494920057 ms); S4's count of such entries 5; its text:

```text
[render-trace] stream-issued {dataset: ds_2a5bd063fbb83d8e65b5c5c65ba75f57, streamHandle: sh_cb1fa368bef9e7244c6228f8fe1d46dd}
```

- **The repoint request:** not stamped. **The answer:** not stamped (item 2); S4's verdict and note:

```text
PASS a stream-issued line followed the "pan-beyond-viewport" gesture (17 -> 22 in the render trace); the junction was repointed to b on that signal; both copies still hash to the fixture
```

- **t_repoint,** the junction's lstat ctime read after the run's report: 2026-10-20T11:15:20.082Z (1792494920082.7966 ms).
- **Session log after S5d's baseline** (line 32), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792494920134 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792494920155 tile-stream-mint-refused 8:14: engine.source_changed {"detail":"{mtime}"}
```

- **The status block's message:**

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture's P, W and R lines,** in order:

```text
session ended for dataset `ds_2a5bd063fbb83d8e65b5c5c65ba75f57`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **The helper's exit line:**

```text
source-changed: repoint helper PID 28232 exited (code 0) after its stdin closed (end of main)
```

- **Gaps (ms), ordering evidence only (§1.4, item 2):** session-ended less t_repoint 51; refusal 1 less session-ended 21; t_repoint less the stream-issued receipt 26.
- **Classes (item 3):** P yes, count 0; W no; R no; S5d FAIL, C2.

### A4

- **Arm** A; **hold** the series; **build** the exe at ed8731a7bdf19a48d37049cbe14e3d00d9db0372 (item 1; byte-identical to step 1's, built at be6aa620), the checkout at ed8731a7bdf19a48d37049cbe14e3d00d9db0372; **report** `source-changed-1792494961127.json`; **launched** true; **app** PID 48280 (from the runner's stop line), exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-ed8731a7.exe`; **run** 2026-10-20T11:15:34.790Z to 2026-10-20T11:16:08.848Z; **suite exit** 1; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-retarget-junction INFO; S4-issue-one-query-and-retarget-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed FAIL; fixture-integrity PASS.
- **The first new `stream-issued` entry in S4:** received 2026-10-20T11:15:58.158Z (1792494958158 ms); S4's count of such entries 5; its text:

```text
[render-trace] stream-issued {dataset: ds_bbb0ba02c9a9b524049067dccf9c2db1, streamHandle: sh_be98619acec127820cf4cc9a43030be0}
```

- **The repoint request:** not stamped. **The answer:** not stamped (item 2); S4's verdict and note:

```text
PASS a stream-issued line followed the "pan-beyond-viewport" gesture (17 -> 22 in the render trace); the junction was repointed to b on that signal; both copies still hash to the fixture
```

- **t_repoint,** the junction's lstat ctime read after the run's report: 2026-10-20T11:15:58.178Z (1792494958178.095 ms).
- **Session log after S5d's baseline** (line 31), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792494958212 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792494958225 tile-stream-mint-refused 8:14: engine.source_changed {"detail":"{mtime}"}
```

- **The status block's message:**

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture's P, W and R lines,** in order:

```text
session ended for dataset `ds_bbb0ba02c9a9b524049067dccf9c2db1`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
session ended for dataset `ds_bbb0ba02c9a9b524049067dccf9c2db1`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **The helper's exit line:**

```text
source-changed: repoint helper PID 45376 exited (code 0) after its stdin closed (end of main)
```

- **Gaps (ms), ordering evidence only (§1.4, item 2):** session-ended less t_repoint 34; refusal 1 less session-ended 13; t_repoint less the stream-issued receipt 20.
- **Classes (item 3):** P yes, counts 0, 0; W no; R no; S5d FAIL, C2.

### B4

- **Arm** B; **hold** the series; **build** the exe at ed8731a7bdf19a48d37049cbe14e3d00d9db0372 (item 1; byte-identical to step 1's, built at be6aa620), the checkout at ed8731a7bdf19a48d37049cbe14e3d00d9db0372; **report** `source-changed-1792495003100.json`; **launched** true; **app** PID 31648 (from the runner's stop line), exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-ed8731a7.exe`; **run** 2026-10-20T11:16:09.920Z to 2026-10-20T11:16:54.927Z; **suite exit** 1; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-retarget-junction INFO; S4-issue-one-query-and-retarget-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed FAIL; fixture-integrity PASS.
- **The first new `stream-issued` entry in S4:** received 2026-10-20T11:16:39.753Z (1792494999753 ms); S4's count of such entries 5; its text:

```text
[render-trace] stream-issued {dataset: ds_772fbf38efeff3d67be67a7492db4777, streamHandle: sh_b1cb8e01a81f25447714d26fefcfb639}
```

- **The repoint request:** not stamped. **The answer:** not stamped (item 2); S4's verdict and note:

```text
PASS a stream-issued line followed the "pan-beyond-viewport" gesture (17 -> 22 in the render trace); the junction was repointed to b on that signal; both copies still hash to the fixture
```

- **t_repoint,** the junction's lstat ctime read after the run's report: 2026-10-20T11:16:39.785Z (1792494999785.3816 ms).
- **Session log after S5d's baseline** (line 33), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792494999823 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792494999843 tile-stream-mint-refused 8:14: engine.source_changed {"detail":"{mtime}"}
```

- **The status block's message:**

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture's P, W and R lines,** in order:

```text
session ended for dataset `ds_772fbf38efeff3d67be67a7492db4777`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **The helper's exit line:**

```text
source-changed: repoint helper PID 32824 exited (code 0) after its stdin closed (end of main)
```

- **Gaps (ms), ordering evidence only (§1.4, item 2):** session-ended less t_repoint 38; refusal 1 less session-ended 20; t_repoint less the stream-issued receipt 32.
- **Classes (item 3):** P yes, count 0; W no; R no; S5d FAIL, C2.

### A5

- **Arm** A; **hold** the series; **build** the exe at ed8731a7bdf19a48d37049cbe14e3d00d9db0372 (item 1; byte-identical to step 1's, built at be6aa620), the checkout at ed8731a7bdf19a48d37049cbe14e3d00d9db0372; **report** `source-changed-1792495045610.json`; **launched** true; **app** PID 43116 (from the runner's stop line), exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-ed8731a7.exe`; **run** 2026-10-20T11:16:56.083Z to 2026-10-20T11:17:34.405Z; **suite exit** 1; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-retarget-junction INFO; S4-issue-one-query-and-retarget-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed FAIL; fixture-integrity PASS.
- **The first new `stream-issued` entry in S4:** received 2026-10-20T11:17:22.600Z (1792495042600 ms); S4's count of such entries 5; its text:

```text
[render-trace] stream-issued {dataset: ds_d6bc5bcee7ef58a547e75bfdb34fd072, streamHandle: sh_42d14b8036513d777f5e7639029c1ffd}
```

- **The repoint request:** not stamped. **The answer:** not stamped (item 2); S4's verdict and note:

```text
PASS a stream-issued line followed the "pan-beyond-viewport" gesture (17 -> 22 in the render trace); the junction was repointed to b on that signal; both copies still hash to the fixture
```

- **t_repoint,** the junction's lstat ctime read after the run's report: 2026-10-20T11:17:22.626Z (1792495042626.656 ms).
- **Session log after S5d's baseline** (line 32), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792495042661 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792495042672 tile-stream-mint-refused 8:14: engine.source_changed {"detail":"{mtime}"}
```

- **The status block's message:**

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture's P, W and R lines,** in order:

```text
session ended for dataset `ds_d6bc5bcee7ef58a547e75bfdb34fd072`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
session ended for dataset `ds_d6bc5bcee7ef58a547e75bfdb34fd072`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **The helper's exit line:**

```text
source-changed: repoint helper PID 25816 exited (code 0) after its stdin closed (end of main)
```

- **Gaps (ms), ordering evidence only (§1.4, item 2):** session-ended less t_repoint 34; refusal 1 less session-ended 11; t_repoint less the stream-issued receipt 27.
- **Classes (item 3):** P yes, counts 0, 0; W no; R no; S5d FAIL, C2.

### B5

- **Arm** B; **hold** the series; **build** the exe at ed8731a7bdf19a48d37049cbe14e3d00d9db0372 (item 1; byte-identical to step 1's, built at be6aa620), the checkout at ed8731a7bdf19a48d37049cbe14e3d00d9db0372; **report** `source-changed-1792495090947.json`; **launched** true; **app** PID 3652 (from the runner's stop line), exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-ed8731a7.exe`; **run** 2026-10-20T11:17:35.419Z to 2026-10-20T11:18:25.260Z; **suite exit** 0; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-retarget-junction INFO; S4-issue-one-query-and-retarget-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed PASS; fixture-integrity PASS.
- **The first new `stream-issued` entry in S4:** received 2026-10-20T11:18:07.321Z (1792495087321 ms); S4's count of such entries 6; its text:

```text
[render-trace] stream-issued {dataset: ds_cdd567e9dd9bab73b49d1000c3676732, streamHandle: sh_9b0c5237f9c8451034fde1106ea83c44}
```

- **The repoint request:** not stamped. **The answer:** not stamped (item 2); S4's verdict and note:

```text
PASS a stream-issued line followed the "pan-beyond-viewport" gesture (17 -> 23 in the render trace); the junction was repointed to b on that signal; both copies still hash to the fixture
```

- **t_repoint,** the junction's lstat ctime read after the run's report: 2026-10-20T11:18:07.354Z (1792495087354.9033 ms).
- **Session log after S5d's baseline** (line 33), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792495087404 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The status block's message:**

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture's P, W and R lines,** in order:

```text
session ended for dataset `ds_cdd567e9dd9bab73b49d1000c3676732`: the source changed during use ({mtime}); 23 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **The helper's exit line:**

```text
source-changed: repoint helper PID 24344 exited (code 0) after its stdin closed (end of main)
```

- **Gaps (ms), ordering evidence only (§1.4, item 2):** session-ended less t_repoint 49; t_repoint less the stream-issued receipt 34.
- **Classes (item 3):** P yes, count 23; W no; R no; S5d PASS.

### A6

- **Arm** A; **hold** the series; **build** the exe at ed8731a7bdf19a48d37049cbe14e3d00d9db0372 (item 1; byte-identical to step 1's, built at be6aa620), the checkout at ed8731a7bdf19a48d37049cbe14e3d00d9db0372; **report** `source-changed-1792495139885.json`; **launched** true; **app** PID 7860 (from the runner's stop line), exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-ed8731a7.exe`; **run** 2026-10-20T11:18:26.871Z to 2026-10-20T11:19:12.324Z; **suite exit** 1; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-retarget-junction INFO; S4-issue-one-query-and-retarget-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed FAIL; fixture-integrity PASS.
- **The first new `stream-issued` entry in S4:** received 2026-10-20T11:18:56.506Z (1792495136506 ms); S4's count of such entries 5; its text:

```text
[render-trace] stream-issued {dataset: ds_afac70685212fb35fbb4730f430c594d, streamHandle: sh_69ec42e856e5121a16e79b3f5f5ae6e7}
```

- **The repoint request:** not stamped. **The answer:** not stamped (item 2); S4's verdict and note:

```text
PASS a stream-issued line followed the "pan-beyond-viewport" gesture (17 -> 22 in the render trace); the junction was repointed to b on that signal; both copies still hash to the fixture
```

- **t_repoint,** the junction's lstat ctime read after the run's report: 2026-10-20T11:18:56.533Z (1792495136533.5378 ms).
- **Session log after S5d's baseline** (line 33), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792495136567 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792495136594 tile-stream-mint-refused 8:14: engine.source_changed {"detail":"{mtime}"}
```

- **The status block's message:**

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture's P, W and R lines,** in order:

```text
session ended for dataset `ds_afac70685212fb35fbb4730f430c594d`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
session ended for dataset `ds_afac70685212fb35fbb4730f430c594d`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **The helper's exit line:**

```text
source-changed: repoint helper PID 45012 exited (code 0) after its stdin closed (end of main)
```

- **Gaps (ms), ordering evidence only (§1.4, item 2):** session-ended less t_repoint 33; refusal 1 less session-ended 27; t_repoint less the stream-issued receipt 28.
- **Classes (item 3):** P yes, counts 0, 0; W no; R no; S5d FAIL, C2.

### B6

- **Arm** B; **hold** the series; **build** the exe at ed8731a7bdf19a48d37049cbe14e3d00d9db0372 (item 1; byte-identical to step 1's, built at be6aa620), the checkout at ed8731a7bdf19a48d37049cbe14e3d00d9db0372; **report** `source-changed-1792495209761.json`; **launched** true; **app** PID 2908 (from the runner's stop line), exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-ed8731a7.exe`; **run** 2026-10-20T11:19:13.847Z to 2026-10-20T11:20:22.812Z; **suite exit** 1; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-retarget-junction INFO; S4-issue-one-query-and-retarget-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed FAIL; fixture-integrity PASS.
- **The first new `stream-issued` entry in S4:** received 2026-10-20T11:20:05.902Z (1792495205902 ms); S4's count of such entries 5; its text:

```text
[render-trace] stream-issued {dataset: ds_8a1ef5c04d43263180697a7bd9e52c0c, streamHandle: sh_ff994f88fd5875f7332a0e7171d3ba07}
```

- **The repoint request:** not stamped. **The answer:** not stamped (item 2); S4's verdict and note:

```text
PASS a stream-issued line followed the "pan-beyond-viewport" gesture (17 -> 22 in the render trace); the junction was repointed to b on that signal; both copies still hash to the fixture
```

- **t_repoint,** the junction's lstat ctime read after the run's report: 2026-10-20T11:20:05.936Z (1792495205936.5796 ms).
- **Session log after S5d's baseline** (line 35), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792495205998 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792495206025 tile-stream-mint-refused 8:14: engine.source_changed {"detail":"{mtime}"}
```

- **The status block's message:**

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture's P, W and R lines,** in order:

```text
session ended for dataset `ds_8a1ef5c04d43263180697a7bd9e52c0c`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
session ended for dataset `ds_8a1ef5c04d43263180697a7bd9e52c0c`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **The helper's exit line:**

```text
source-changed: repoint helper PID 41992 exited (code 0) after its stdin closed (end of main)
```

- **Gaps (ms), ordering evidence only (§1.4, item 2):** session-ended less t_repoint 61; refusal 1 less session-ended 27; t_repoint less the stream-issued receipt 35.
- **Classes (item 3):** P yes, counts 0, 0; W no; R no; S5d FAIL, C2.

### A7

- **Arm** A; **hold** the series; **build** the exe at ed8731a7bdf19a48d37049cbe14e3d00d9db0372 (item 1; byte-identical to step 1's, built at be6aa620), the checkout at ed8731a7bdf19a48d37049cbe14e3d00d9db0372; **report** `source-changed-1792495255933.json`; **launched** true; **app** PID 35064 (from the runner's stop line), exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-ed8731a7.exe`; **run** 2026-10-20T11:20:24.187Z to 2026-10-20T11:21:06.711Z; **suite exit** 1; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-retarget-junction INFO; S4-issue-one-query-and-retarget-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed FAIL; fixture-integrity PASS.
- **The first new `stream-issued` entry in S4:** received 2026-10-20T11:20:52.680Z (1792495252680 ms); S4's count of such entries 5; its text:

```text
[render-trace] stream-issued {dataset: ds_b03c7924bd34c5e9b1b3705d86c068bb, streamHandle: sh_ff1f6979c2fc2f8f9127e25fb5081589}
```

- **The repoint request:** not stamped. **The answer:** not stamped (item 2); S4's verdict and note:

```text
PASS a stream-issued line followed the "pan-beyond-viewport" gesture (17 -> 22 in the render trace); the junction was repointed to b on that signal; both copies still hash to the fixture
```

- **t_repoint,** the junction's lstat ctime read after the run's report: 2026-10-20T11:20:52.711Z (1792495252711.7246 ms).
- **Session log after S5d's baseline** (line 33), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792495252750 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792495252769 tile-stream-mint-refused 8:14: engine.source_changed {"detail":"{mtime}"}
```

- **The status block's message:**

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture's P, W and R lines,** in order:

```text
session ended for dataset `ds_b03c7924bd34c5e9b1b3705d86c068bb`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **The helper's exit line:**

```text
source-changed: repoint helper PID 1168 exited (code 0) after its stdin closed (end of main)
```

- **Gaps (ms), ordering evidence only (§1.4, item 2):** session-ended less t_repoint 38; refusal 1 less session-ended 19; t_repoint less the stream-issued receipt 32.
- **Classes (item 3):** P yes, count 0; W no; R no; S5d FAIL, C2.

### B7

- **Arm** B; **hold** the series; **build** the exe at ed8731a7bdf19a48d37049cbe14e3d00d9db0372 (item 1; byte-identical to step 1's, built at be6aa620), the checkout at ed8731a7bdf19a48d37049cbe14e3d00d9db0372; **report** `source-changed-1792495304299.json`; **launched** true; **app** PID 24220 (from the runner's stop line), exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-ed8731a7.exe`; **run** 2026-10-20T11:21:07.945Z to 2026-10-20T11:21:58.434Z; **suite exit** 0; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-retarget-junction INFO; S4-issue-one-query-and-retarget-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed PASS; fixture-integrity PASS.
- **The first new `stream-issued` entry in S4:** received 2026-10-20T11:21:40.838Z (1792495300838 ms); S4's count of such entries 6; its text:

```text
[render-trace] stream-issued {dataset: ds_e8e71fb3ccab0073902d4b892eafc7d4, streamHandle: sh_7bfb09617e244c4163d90b00f19e5e60}
```

- **The repoint request:** not stamped. **The answer:** not stamped (item 2); S4's verdict and note:

```text
PASS a stream-issued line followed the "pan-beyond-viewport" gesture (17 -> 23 in the render trace); the junction was repointed to b on that signal; both copies still hash to the fixture
```

- **t_repoint,** the junction's lstat ctime read after the run's report: 2026-10-20T11:21:40.875Z (1792495300875.22 ms).
- **Session log after S5d's baseline** (line 33), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792495300938 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The status block's message:**

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture's P, W and R lines,** in order:

```text
session ended for dataset `ds_e8e71fb3ccab0073902d4b892eafc7d4`: the source changed during use ({mtime}); 23 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **The helper's exit line:**

```text
source-changed: repoint helper PID 27792 exited (code 0) after its stdin closed (end of main)
```

- **Gaps (ms), ordering evidence only (§1.4, item 2):** session-ended less t_repoint 63; t_repoint less the stream-issued receipt 37.
- **Classes (item 3):** P yes, count 23; W no; R no; S5d PASS.

### A8

- **Arm** A; **hold** the series; **build** the exe at ed8731a7bdf19a48d37049cbe14e3d00d9db0372 (item 1; byte-identical to step 1's, built at be6aa620), the checkout at ed8731a7bdf19a48d37049cbe14e3d00d9db0372; **report** `source-changed-1792495351921.json`; **launched** true; **app** PID 17368 (from the runner's stop line), exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-ed8731a7.exe`; **run** 2026-10-20T11:21:59.910Z to 2026-10-20T11:22:43.750Z; **suite exit** 1; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-retarget-junction INFO; S4-issue-one-query-and-retarget-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed FAIL; fixture-integrity PASS.
- **The first new `stream-issued` entry in S4:** received 2026-10-20T11:22:28.767Z (1792495348767 ms); S4's count of such entries 5; its text:

```text
[render-trace] stream-issued {dataset: ds_2aef56349d4c9ca1b41e680c03e5a41d, streamHandle: sh_435fed3721681af4b563b4af35967d26}
```

- **The repoint request:** not stamped. **The answer:** not stamped (item 2); S4's verdict and note:

```text
PASS a stream-issued line followed the "pan-beyond-viewport" gesture (17 -> 22 in the render trace); the junction was repointed to b on that signal; both copies still hash to the fixture
```

- **t_repoint,** the junction's lstat ctime read after the run's report: 2026-10-20T11:22:28.788Z (1792495348788.954 ms).
- **Session log after S5d's baseline** (line 32), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792495348826 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792495348843 tile-stream-mint-refused 8:14: engine.source_changed {"detail":"{mtime}"}
```

- **The status block's message:**

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture's P, W and R lines,** in order:

```text
session ended for dataset `ds_2aef56349d4c9ca1b41e680c03e5a41d`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
session ended for dataset `ds_2aef56349d4c9ca1b41e680c03e5a41d`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **The helper's exit line:**

```text
source-changed: repoint helper PID 35940 exited (code 0) after its stdin closed (end of main)
```

- **Gaps (ms), ordering evidence only (§1.4, item 2):** session-ended less t_repoint 37; refusal 1 less session-ended 17; t_repoint less the stream-issued receipt 22.
- **Classes (item 3):** P yes, counts 0, 0; W no; R no; S5d FAIL, C2.

### B8

- **Arm** B; **hold** the series; **build** the exe at ed8731a7bdf19a48d37049cbe14e3d00d9db0372 (item 1; byte-identical to step 1's, built at be6aa620), the checkout at ed8731a7bdf19a48d37049cbe14e3d00d9db0372; **report** `source-changed-1792495414104.json`; **launched** true; **app** PID 40656 (from the runner's stop line), exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-ed8731a7.exe`; **run** 2026-10-20T11:22:45.618Z to 2026-10-20T11:23:48.818Z; **suite exit** 1; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-retarget-junction INFO; S4-issue-one-query-and-retarget-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed FAIL; fixture-integrity PASS.
- **The first new `stream-issued` entry in S4:** received 2026-10-20T11:23:30.234Z (1792495410234 ms); S4's count of such entries 5; its text:

```text
[render-trace] stream-issued {dataset: ds_828ba3e28ead3b9d0c2ea18521e7f7df, streamHandle: sh_05396581e4ec00ec3dd374a20eb5a8d2}
```

- **The repoint request:** not stamped. **The answer:** not stamped (item 2); S4's verdict and note:

```text
PASS a stream-issued line followed the "pan-beyond-viewport" gesture (17 -> 22 in the render trace); the junction was repointed to b on that signal; both copies still hash to the fixture
```

- **t_repoint,** the junction's lstat ctime read after the run's report: 2026-10-20T11:23:30.270Z (1792495410270.2922 ms).
- **Session log after S5d's baseline** (line 36), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792495410343 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792495410373 tile-stream-mint-refused 8:14: engine.source_changed {"detail":"{mtime}"}
```

- **The status block's message:**

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture's P, W and R lines,** in order:

```text
session ended for dataset `ds_828ba3e28ead3b9d0c2ea18521e7f7df`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
session ended for dataset `ds_828ba3e28ead3b9d0c2ea18521e7f7df`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **The helper's exit line:**

```text
source-changed: repoint helper PID 40440 exited (code 0) after its stdin closed (end of main)
```

- **Gaps (ms), ordering evidence only (§1.4, item 2):** session-ended less t_repoint 73; refusal 1 less session-ended 30; t_repoint less the stream-issued receipt 36.
- **Classes (item 3):** P yes, counts 0, 0; W no; R no; S5d FAIL, C2.

