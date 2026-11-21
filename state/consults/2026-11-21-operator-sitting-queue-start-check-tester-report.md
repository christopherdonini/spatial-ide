*Filed by the custodian: the report of the one start of the app before the sitting (the advisor's ruling ADV-2026-11-21-16, item 7, under the human's delegation of 2026-11-13), made in the main checkout at 887408a3e90e143e44c3f1f89ca6f859ac0b2e80, the hand-back of the tester (claude-sonnet-5-5), 5545 bytes, sha256 bcbe55343fe751c97a0a7eaa9a0e3b0dca2df96c81c3166e7c51be0af80ca77d, below the rule, masked by the custodian: the scratch folder's path 2 times as <S>, three clock values with a zone offset as <t>, and the hold lines' project value twice as <m>; nothing else changed. Its result line: RESULT none: the pre-build failed (rc 101) on a missing resource, the bundle viewer record viewer-asset-hashes.json, so no start was made; the stop went to the advisor at once. Its calls in the transcript, by unique call ids: Read 1, Bash 13, Write 1, SubagentHandback 1; errored: 0, from 2026-11-21T15:22:38Z to 2026-11-21T15:38:26Z. The brief named one start, two holds, and the shell crate's cargo target as a junction to a folder on D:, made by the custodian before the dispatch (the folder is ignored by the shell crate's own ignore file).*

---

Checked: operator-sitting-queue, ADV-2026-11-21-16 item 7, tester

RESULT: none. The drive script was written and parse-checked but never run. The app was not started. I stopped at the pre-build (hold 1), which failed with rc=101. Per the brief this goes to the custodian, and item 7 "comes to me at once".

**Model:** I observe myself running as Sonnet 5.5 (claude-sonnet-5-5). There was no model override and no context handoff.

**Four failure classes for this harness**
- The harness uses the product's interface: the start is `npm --prefix frontends/shell run tauri dev`, and the drive script uses UI Automation on the real window.
- Every result claim points to a file in the scratchpad `<S>`. The only measured result is the pre-build failure, in `sit7-prebuild.log`.
- Nothing operator-facing was written about the app itself, because it never ran.
- No assertion was reached. The drive script's assertions (window, open, EPSG text, close, no process left) were not exercised.

**Head, junction, fixture, before state**
- HEAD is 887408a3e90e143e44c3f1f89ca6f859ac0b2e80, which matches the brief.
- The junction check passed. `dir /AL` showed `target [D:\spatial-ide\shell-target]` under `frontends\shell\src-tauri`.
- The fixture `filter-zoned.parquet` is 409872 bytes, as expected.
- Before the pre-build there was no `spatial-ide-shell.exe` process and no listener on port 5180 (`<S>/sit7-before.txt`).
- `<S>/sit7-porcelain-before.txt` holds 7 lines.

**Hold 1, masked**
- `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:76744 also=<m>`. The `also=` value was a bash.exe PID, which I wrote as `<m>`.
- `MACHINE_RELEASED project=<m> shell=bash.exe:76744 affinity=FF (cores 0-7)`.
- There were no `others=`, MACHINE_WAITING or MACHINE_ERROR lines.
- Only hold 1 was taken. Hold 2 was never requested.

**Pre-build**
- Command: `cd /c/dev/spatial-ide/frontends/shell/src-tauri && <hold shared, -Minutes 40 -MaxWaitMinutes 30> && CARGO_BUILD_JOBS=8 cargo build > <S>/sit7-prebuild.log 2>&1 ; rc=$? ; <release> ; echo rc=$rc`.
- rc=101, release line stamped 2026-11-21T15:37:53Z.
- Wall time was about 5 minutes. The log file was created at <t> and last written at <t> (<t>). That is the cargo run, not counting hold wait.
- Cause: the shell crate's build script (tauri's `tauri.conf.json` line 42) bundles `renderer/bundle-viewer/viewer-asset-hashes.json` as a resource. The file does not exist. It is gitignored (`.gitignore:9`) and is not produced by `cargo build`.
- A fresh checkout has no such file, and `cargo build` cannot make it. It has to come from a bundle-viewer step (the `bundle-viewer/build.mjs` or `scan-dist.mjs` scripts are the candidates).
- The brief says to run neither npm ci nor install. I did not try to generate the file, since that is outside my brief.
- Last 5 lines of `sit7-prebuild.log`:
```
  cargo:rerun-if-changed=..\..\..\renderer\bundle-viewer\dist\app.js
  cargo:rerun-if-changed=..\..\..\renderer\bundle-viewer\dist\index.html
  cargo:rerun-if-changed=..\src\generated\NOTICE.txt
  resource path `..\..\..\renderer\bundle-viewer\viewer-asset-hashes.json` doesn't exist
warning: build failed, waiting for other jobs to finish...
```
- The failing step is `error: failed to run custom build command for spatial-ide-shell v0.1.0 (...\frontends\shell\src-tauri)`. The log's last 60 lines are the compile lines, the error, and the build-script stdout shown above. The full log is at `<S>/sit7-prebuild.log`.
- Consequence for the human's sitting: `npm --prefix frontends/shell run tauri dev` would build the same crate, so it would probably hit the same missing-file error. I could not confirm that without starting the app, which I did not do. Either `tauri dev` or its beforeDevCommand generates the file, or the sitting script's start line is missing a step.

**Drive script:** `<S>/sit7-drive.ps1` (9921 bytes). It is written to the brief (parts a to h, UIA, masking, a 28-minute bound, the RESULT last line). The PowerShell parser reports 0 errors; it was never executed. The script is not reproduced here, so say so if you want it pasted. There is no drive log.

**Times:** none, because there was no start, window, Open, dialog, EPSG text, close or cmd.exe exit.

**After state and porcelain**
- `sit7-after.txt` was not written, since the drive script did not run.
- `sit7-porcelain-after.txt` is identical to the before file. The diff is empty, so the failed cargo build left no change visible to git.
- The ignored build outputs went to the D: target through the junction.
- `sit7-app.log` does not exist, so there are no lines to show.

**Not done**
- No drive run, no hold 2, no app start, no `sit7-after.txt`.
- No npm install or ci, no cargo clean, no git command other than rev-parse and status, no edit of any tracked file, no screenshot.
- Extra files I made in `<S>`: `sit7-parse.ps1` (the parse check), plus the porcelain, before and prebuild files above.
- Two extra background waiters (`bo1xiv7yw`, `b5gm77tkw`) only cat the hold's output file and exited. They ran no build and no app.

**Stop:** the pre-build failed with rc=101 (the missing `viewer-asset-hashes.json` resource). This is the point of item 7, which "comes to me at once". It needs the custodian and advisor to decide the start step before any retry.
