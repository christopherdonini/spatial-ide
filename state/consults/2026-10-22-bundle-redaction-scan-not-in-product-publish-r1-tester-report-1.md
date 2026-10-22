*Custodian's filing note (2026-10-22): R1 of the redaction scan (PR #241) by a tester, at 6a10ee24: STOP before the suite ran. The dev server's port lies inside the machine's excluded TCP range, so the app could not launch; no viewer refusal was seen and no prediction was tested. Freeing the port is the human's. The run 2026-10-22T00:40:25Z to 00:52:06Z by its transcript (Grep 2, Read 3, Bash 11); its claims were read against that transcript's calls before filing. Extracted by script from its SubagentHandback call, with its one scratch-folder path written as a placeholder and one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is fd6cac63cff71e81f968d1ff2670f767e4bb1e8a6df959ac884d95b350ccb83c.*

---

R1: bundle-redaction-scan-not-in-product-publish at 6a10ee24e79ab17a3905c3de810844c41160f3ee, tester
Result: STOP, the dev server cannot bind its port. Steps 4 to 7 were not run, so the prediction is neither confirmed nor refuted. No `viewer/` refusal was seen. I changed nothing and retried nothing.

**Step 1.** `git status --porcelain` was empty (rc 0, 0 bytes) and `git rev-parse HEAD` gave 6a10ee24e79ab17a3905c3de810844c41160f3ee. After the build and the run, `git status --porcelain` was still empty.

**Step 2, viewer build.**
- `renderer/bundle-viewer/node_modules` already existed, so I ran no `npm ci` there.
- `viewer-asset-hashes.json` already existed from 02:08. It is untracked and not shown by porcelain. The build rewrote it at 02:40.
- `npm run build` exited 0.
- The scan's last four lines, byte-copied:
  - `scan-dist: 3 files scanned, 2 findings, all reviewed; record written`
  - `scan-dist: reviewed row NOTICE.txt credential 19092: matched`
  - `scan-dist: reviewed row NOTICE.txt local-filesystem-path 111337: matched`
  - `scan-dist: reviewed row app.js local-filesystem-path 7291: not found`
- The record's entries equal `sha256sum` of the files in `dist/`:

| File | sha256 (record and `dist/` file, equal) |
|---|---|
| `NOTICE.txt` | 826e55d1f585edef8431791033a6beacd6379dc0615ad749a97a7467ab4805fb |
| `app.js` | 778198dd07180c597db8a444721b192c679b4ef37a0f5d4652f41c52ee899af8 |
| `index.html` | 622604f482af8c4551ca406c42fee9298b429d8e2213460effee38ff4d3aa58c |

**Step 3, fixture.** `filter-zoned.parquet` exists in the main checkout's `target/`. Its sha256 is 92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46. I did not regenerate it.

**Step 4, the suite.**
- Preparation: `frontends/shell` had no `node_modules`, so I ran `npm ci` there (rc 0). I then ran `cargo build` in `frontends/shell/src-tauri` inside a shared hold, with `CARGO_TARGET_DIR=D:/wt-targets/rds` and `CARGO_BUILD_JOBS=8` (rc 0).
- `npm run e2e:publish` ran in a shared hold, with `SPATIAL_IDE_AUDIT_LOG` set to a new file in the scratch folder. It exited 1 and printed no APPROVED' or REFUSED' lines.
- It built `verify-bundle`, then printed: `publish: could not attach to or launch the app: attachOrLaunch: http://127.0.0.1:9223/json/version never came up within 300000ms -- see e2e/out/app.log`.
- `e2e/out/app.log` is 0 bytes.
- I then ran a bare diagnostic listen on 127.0.0.1:5180, the `devUrl` port in `tauri.conf.json`, and it failed: `EACCES listen EACCES: permission denied 127.0.0.1:5180`.
- `netsh interface ipv4 show excludedportrange protocol=tcp` lists 5120-5219, which covers 5180. This is the machine's known dynamic exclusion; vite's config comment and the `dev-port-5180-excluded` note in your memory both name it.
- I tried no other port and no workaround. The human or custodian has to free the port (a winnat restart or a reboot), then R1 can be re-run.

**Steps 5 and 6.** Not run. No bundle was staged under `target/e2e-publish-out/`, and no audit pair exists to read.

**Step 7.**
- The app never launched, so there was no app stderr, suite report or session log to copy. `e2e/out/app.log` was 0 bytes.
- The suite's own `killTree` ran on timeout. A command-line search for my worktree path and `wt-targets` found only my own query shell. I started no process that is still running.
- Other `node` and `msedgewebview2` processes were visible. They were not started by me, and I left them alone.

**Hold.** Both lines are for my project only.
- Cargo build hold: `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF ...`, then `MACHINE_RELEASED project=SpatialIDE ... affinity=FF (cores 0-7)`.
- E2E hold: the same grant and release lines.

**Failure classes for this harness.**
- Interface: the suite drives the product's real IPC through the dev-only seam. It never ran, so nothing was measured through it.
- Result claims: every claim here points to a scratch file or a transcript call. There is no results table for this run.
- Operator-facing lines: none were written.
- Assertions: no measurement test reached its assertion, because the app never launched.

**Scratch files** are in `<the session scratch folder>`:
- `rds-r1-status.txt`
- `rds-r1-build.txt`
- `rds-r1-shell-npmci.txt`
- `rds-r1-cargo-build.txt`
- `rds-r1-e2e.txt`

`rds-r1-audit.jsonl` was never created.

**Model:** Sonnet 5.5 (claude-sonnet-5-5), as the harness reports it. No override and no context handoff.
