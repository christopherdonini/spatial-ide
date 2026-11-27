*Filed by the custodian: the tester's diagnosis of colour-by-refill's E-RK1 VOIDs, node:colour-by-refill-keeps-the-view@e2e-diagnosis-1 (PR 365, draft), at the branch head 2095a7ac471d2441fd8e054a448d334c7bcde455; one uncounted run, d1, which ended VOID like the two before it. Dispatched at 2026-11-24T00:10:43Z; its run: Bash 23, Read 3, SubagentHandback 1, by unique call ids, 1 calls errored; model claude-sonnet-5-5, from 2026-11-24T00:10:46Z to 2026-11-24T00:21:37Z by its transcript; 0 calls named the main checkout; handed back at 2026-11-24T00:17:47Z. The report below from its hand-back, 10357 bytes, sha256 a70d9ceda01360b0a571a8dc3d0255006c661cad51e95a195fe0cf456675784d, byte for byte but for 1 of the profile's path or the account's name, 2 clock times other than UTC, written as <m>, <u> and <t> by the custodian, with one final newline added. Its cause is the basis of the suite's fix commit and of ADV-2026-11-24-01 (`state/directives/2026-11-24-advisor-ruling-adv-2026-11-24-01-colour-by-refills-e2e-before-the-change-the-fix-commits-suite-over-p0-the-three-void-runs-recorded-a-log-folder-finding.md`); that the folder comes from the system's lookup rather than the variable is its inference, which it labels. Evidence, not a gate.*

---

**Done.** Model: I observe myself as Sonnet 5.5 (claude-sonnet-5-5), with no override and no context handoff. Token usage: none at hand.

**Cause, one line.** The suite reads its session log from the scratch `LOCALAPPDATA`, but the app writes its session log to the real profile folder. The app is up, the open is admitted and the `planned` line is written about 5 s after the app starts. The suite never sees the line, so it waits 120 s and ends VOID.

**Step 1: setup, all passed.**
- `git status --porcelain` printed nothing.
- After the checkout, HEAD is `2095a7ac471d2441fd8e054a448d334c7bcde455`.
- The fixture is 328242802 bytes with sha256 `2ce715fd...830af84`, as the brief gives.
- The netstat check for 5180/9223 LISTENING printed nothing (grep rc 1).
- C: has 44356 MB free; D: has 192912 MB free. `<O>` was created.
- Not in the brief: `netsh interface ipv4 show excludedportrange protocol=tcp` lists 5180-5180 with a `*`, which marks an administered exclusion.

**Step 2: what the launch is.**
- **Command:** `attachOrLaunch` in `lib.mjs` (lines 151-227) runs `npx tauri dev --config e2e/out/tauri.e2e.conf.json`.
  - It sets `cwd` to the shell folder, `shell: true` on win32, `env: process.env`, `detached: true`, `windowsHide: true` and `stdio: ["ignore", fd, fd]`.
  - The fd is `e2e/out/app.log`, opened with `a`. It then calls `child.unref()`.
- **Overlay:** `tauri.e2e.conf.json` only adds `--remote-debugging-port=9223` to the window's browser args.
- **Waits:** it waits up to 300 s for CDP on 9223 and 60 s for the app page.
- **Features and the dev server:** no cargo features are passed. `tauri.conf.json` sets `beforeDevCommand` to `npm run dev` (vite, port 5180, `strictPort`) and `devUrl` to `http://localhost:5180`.
- **Comparison:** `colour.mjs` makes the same call (`attachOrLaunch()`, line 399) and sets `process.env.LOCALAPPDATA` to a scratch folder before importing `lib.mjs`, as `colour-refill.mjs` does.
- **Pre-build:** `cargo build --manifest-path frontends/shell/src-tauri/Cargo.toml --locked --no-default-features` builds the debug profile with no features. The crate has no default features; its only feature is `measure-build`.
  - I did not look inside tauri-cli. By inference, `tauri dev` runs `cargo run` on the same crate and profile.
  - It adds the `TAURI_CONFIG` overlay, so the pre-build is probably not reused as-is. In the fresh-target run it recompiled for about 90 s. It also starts vite through `beforeDevCommand`.
- **Suite code:** `colour-refill.mjs` lines 28-32 set `LOCALAPPDATA=SCRATCH` and `LOG_DIR=SCRATCH/dev.spatialide.shell/logs`. `sessionLogLines()` (lines 79-83) reads only that folder. Line 118 waits for the planned line.
- **App code:** `lib.rs:326-329` takes `log_dir` from `app.path().app_log_dir()`. `state.rs:47` names the file `session-<unix-seconds>.log`.

**Step 3: build.** `npm run build` exited 0 under a shared hold. The log ends `built in 9.20s`.

**Step 4: run `d1`, uncounted.**
- The hold was granted. The run's exit code is **2** (VOID).
- The sampler was my own script, `<S>/cbr-sample.sh`. It took 12 samples at about 21 s apart, from 00:13:01Z to 00:16:56Z, and appended them to `<O>/d1-samples.txt`.
- Samples, condensed to the changes:
  - **00:13:01 to 00:14:27Z (5 samples):** `spatial-ide-shell.exe` count 0, `cargo.exe` 2, `node.exe` 8. No port listened. The store held only `npm-cache`.
  - **00:14:48Z:** `spatial-ide-shell.exe` 1 (the app starts). 127.0.0.1:9223 LISTENING (pid 14296), with two connections from node pid 37944 that settle to one. 5180 is never listed. The store still held only `npm-cache`.
  - **00:15:10 to 00:16:34Z:** unchanged: app 1, cargo 2, node 8, 9223 listening.
  - **00:16:56Z:** `spatial-ide-shell.exe` 0, `cargo.exe` 0, `node.exe` 3, and only a TIME_WAIT line on 9223. This is when the suite killed the app after the VOID.
- The sampler's `ls` of `<store>/dev.spatialide.shell/logs` never printed, because that folder never existed in the scratch store.

**The run's log whole** (`<O>/d1-refill.log`):
```
colour-refill: fixture C:/dev/wt/cbr/target/fixtures/manual-walkthrough/colour-refill-300k.parquet sha256 2ce715fd...830af84; LOCALAPPDATA=D:\wt-data\cbr\spatial-colour-refill-7c8EAc
(node:37944) [DEP0190] DeprecationWarning: Passing args to a child process with shell option true ...
(Use `node --trace-deprecation ...` to show where the warning was created)
the scratch store, with the session log, is kept: D:\wt-data\cbr\spatial-colour-refill-7c8EAc

VOID  waited 120000ms for the open's first look to plan; the last reading was 0 -- not a PASS (checks recorded before it: 0)
```

**Step 5: after the run.**
- I copied `e2e/out` to `<O>/d1-out/` and the scratch store to `<O>/d1-store/`. The store held only `npm-cache`.
- `e2e/out/app.log` is 0 bytes, so there is no tail to record.
- The app's own session log is in the real profile folder: `<u>/AppData/Local/dev.spatialide.shell/logs/session-1795479287.log`. That stamp is 00:14:47Z, and the file has 130 lines. I did not copy it into `<O>`. These are its first lines, from line 1:
```
1795479287515 info data-plane expected origin (config mirror): http://localhost:5180
1795479288383 info origin-self-check ok pinned=http://localhost:5180
1795479288394 policy recovery policy: none -- fail visibly and terminate the canvas with a surfaced error
1795479291518 producer-pool-poll active=0 live=1 idle=1
1795479292471 candidate-untiled-terminal initial-untiled-look sh_80c08837...: Completed
1795479292472 candidate-grid-frame-established dataset=ds_9bd9bef... level=medium ...
```
- Every line containing `first-look` or `planned`, and the only one in the file (line 7):
```
1795479292474 candidate-first-look-view-planned {xmin:2599736.3419350097,ymin:1198567.6607502818,xmax:2602462.3310699314,ymax:1201473.2060557671}
```
- The remaining lines are `producer-pool-poll` and `candidate-tile-terminal` lines. The last line is at 1795479411483, about 124 s after the start, when the suite killed the app.
- The real profile folder also holds `session-1795477990.log` (<t>) and `session-1795478788.log` (<t>). Each has exactly one planned line. These match the two earlier VOID runs.

**Step 6: my reading.**
- **Did the app run?** Yes. `spatial-ide-shell.exe` ran from about 00:14:48Z, and 9223 listened from then until the suite killed the app. The suite attached, found the page and `openPath` returned `admitted`. Without that it could not have reached line 118 of `colour-refill.mjs`.
- **Was cargo building during the waits?** The cargo count was 2 from 00:13:01Z, before the app started, and it stayed at 2 until the run ended. The count cannot say whose cargo it was. It is an inference that `tauri dev` was rebuilding the shell crate for about 1.5 minutes, from about 00:13Z to 00:14:48Z, and that this was inside the CDP wait. The wait was well under the 300 s limit. During the 120 s planned wait cargo was running but no longer blocking anything.
- **Which ports listened?** 9223 from 00:14:48Z. 5180 never listened: no sample shows it, and `netsh` lists 5180 as an administered exclusion. The app still pins `http://localhost:5180` (session log lines 1-2) and its origin self-check says `ok`. The frontend therefore loaded and the page ran against `devUrl`, even though nothing listens on 5180. I could not see from my samples how it got its page. That mechanism is not diagnosed here. It matters little, because the open worked.
- **Did the app write its own store?** Not in the scratch store, which held only `npm-cache` (npm's own logs). The app wrote its session log to the real profile folder `%LOCALAPPDATA%\dev.spatialide.shell\logs` instead.
- **Likeliest cause (inference), with its support.**
  - The app takes its log directory from Tauri's `app_log_dir()` (`lib.rs:326-329`).
  - It is an inference that this resolves through the OS known-folder API rather than the `LOCALAPPDATA` environment variable. That fits the app writing to the real profile folder although the child's env carried the scratch value, and the scratch `dev.spatialide.shell` folder never existing.
  - The suite reads only `SCRATCH/dev.spatialide.shell/logs` (`colour-refill.mjs:32` and `79-83`).
  - The log in the real folder holds the planned line about 5 s after the app's start, and the VOID came 120 s later. All three runs produced the same single-planned-line log in the real folder (stamps 1795477990, 1795478788 and 1795479287).
  - **Not suite-specific (inference):** `colour.mjs` uses the same scratch-`LOCALAPPDATA` pattern for its store. I did not test whether it reads `dev.spatialide.shell` logs. The same mismatch would hit any suite that reads a session log from the scratch folder.
- **app.log is 0 bytes** even though the app and tauri certainly ran, and the app's `eprintln!("[spatial-ide-shell] session log: ...")` should have gone to stderr. I did not diagnose why. It may be the raw-fd and detached `shell:true` spawn, or NTFS size staleness. It is a separate oddity, not the cause of the VOID.
- **Things I did not check:** whether any other suite reads a session log from a scratch folder, and whether `app_log_dir()` honours the env var on this build. A direct test of the second would be a one-line probe: run the app with a `LOCALAPPDATA` that differs from the profile and see where the log lands. That is what `d1` did.

**What was and wasn't changed.**
- No tracked file was edited. `git status --porcelain` in `C:/dev/wt/cbr` is clean and HEAD is still `2095a7ac`.
- One thing was written outside the diagnosis folders: the harness's own generated, gitignored `e2e/out/tauri.e2e.conf.json` and `e2e/out/app.log`.
- I stopped no process myself. The suite's own kill ended the app.
- The sampling script `<S>/cbr-sample.sh` was my own and may still be on its last loop. It only reads.
- The hold calls took the shared hold and released it (MACHINE_RELEASED, `<m>` values not copied).
- The scratch store and `<O>` outputs are kept: `<S>/cbr-diag/` holds `build-head.log`, `d1-refill.log`, `d1-samples.txt`, `d1-out/` and `d1-store/`.
- Nothing was run on the main checkout.

**Files:** `<S>/cbr-diag/d1-refill.log`, `<S>/cbr-diag/d1-samples.txt`, `<S>/cbr-diag/build-head.log`, `<S>/cbr-sample.sh`. The session log is in the real profile folder named above.

Model: Sonnet 5.5 (claude-sonnet-5-5).
