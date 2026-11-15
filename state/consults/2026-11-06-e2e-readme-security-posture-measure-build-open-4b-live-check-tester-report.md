*Custodian's filing note (2026-11-06): the tester's report for the e2e README piece's OPEN-4 (B) (`governance/forms/frontends/E2E-README-SECURITY-POSTURE-MEASURE-BUILD-PREREGISTRATION.md`, the custodian's settlement): whether WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS, set in the environment, reaches the WebView2 of a plain release build of main (aa370b310e408af06f6563951a3feb02307e6992). Dispatched at 2026-11-06T10:57:16Z by its transcript from a brief of 9543 bytes (sha256 5cbff07ac0d24f1c3390d3e440a5e14a490594b3228b64be825ec46459733330). The run to its hand-back, 2026-11-06T10:57:16Z to 11:18:42Z by its transcript (claude-sonnet-5-5; unique calls Bash 21, Read 2, Write 2 and the hand-back, 26, equal to the notification's). Its text is byte-copied by script from the hand-back, one path replaced: the scratch folder's, a profile path, by `<the session scratch folder>`. The custodian's reading, not the tester's: with the variable set and with it absent, no WebView2 command line held the flag and nothing answered on the port, so in this build the variable did not reach WebView2; under the human's ruling of 2026-11-06 (11:10Z, `state/directives/2026-11-06-8e-open-1-words-open-4-a-e2e-readme-c9-c14-c19-heading-open-6-a-filler-order-docs-02-adr-022-kl-178.md`) C1 and C17 do not come back to the human. One pair of runs; no claim beyond it. The worktree and its target were removed after the report.*

---

Ran: e2e-readme-security-posture-measure-build OPEN-4 (B) at aa370b310e408af06f6563951a3feb02307e6992

**Result**
- Run A (variable set to `--remote-debugging-port=9333`): no answer in 60 s. No redacted command line holds `--remote-debugging-port=9333`.
- Run B (control, variable absent): no answer in 60 s. No redacted command line holds `--remote-debugging-port=9333`.
- I draw no conclusion about the README's clauses.

**Worktree at the start**
- `C:/dev/wt/erl`: HEAD was aa370b310e408af06f6563951a3feb02307e6992, porcelain empty, and `git worktree list` showed `C:/dev/wt/erl aa370b31 (detached HEAD)`.
- The form's sha256 was 713911f69dc04757e40de2d39ab3610d2a699ac0cda9b54a142997d7bc2e5818, as the brief states.
- I read the form whole and Part 1 of the directive.

**Preconditions**
- `tasklist /FI "IMAGENAME eq spatial-ide-shell.exe"` showed no matching task. The first attempt through Git Bash mangled the `/FI` flag and failed, so I reran it with `MSYS_NO_PATHCONV=1`.
- `Get-NetTCPConnection -LocalPort 9333 -State Listen` printed nothing.
- `D:/wt-targets/erl` was absent at the start.

**Build**
- Steps ran in one shared hold from the script `erl-build.sh`, with `CARGO_TARGET_DIR=D:/wt-targets/erl`, `CARGO_BUILD_JOBS=8` and `RUST_TEST_THREADS=8`.
- `renderer/bundle-viewer`:
  - `npm ci` exited 0. Its last lines are npm `allow-scripts` warnings about the esbuild postinstall.
  - `npm run build` exited 0. Its last line is `scan-dist: reviewed row app.js local-filesystem-path 7291: not found`. That line is a stated `scan-dist` output. I did not investigate it, and the exit code was 0.
- `frontends/shell`:
  - `npm ci` exited 0, with the same esbuild warnings last.
  - `npm run tauri build -- --no-bundle` exited 0. Last lines: `Finished release profile [optimized] target(s) in 16m 58s` and `Built application at: D:\wt-targets\erl\release\spatial-ide-shell.exe`.
- Exe: `D:/wt-targets/erl/release/spatial-ide-shell.exe`, 71921152 bytes, mtime 2026-11-06 12:15:35 +0100.
- The worktree porcelain was still empty after the build, and HEAD was unchanged.

**Run A**
- Variable present in that call's process; PID 38856.
- Poll: no answer in 60 s, so there is no `Browser` or `Protocol-Version` to report.
- 6 `msedgewebview2.exe` processes had the shell as ancestor.
  - PID 46992 (parent 38856) is the WebView2 browser process. Its flags are `--embedded-browser-webview=1 --webview-exe-name=spatial-ide-shell.exe --webview-exe-version=0.1.0 --user-data-dir --noerrdialogs --embedded-browser-webview-dpi-awareness=2 --autoplay-policy=no-user-gesture-required --disable-features=msWebOOUI,msPdfOOUI,msSmartScreenProtection --lang=en-US --mojo-named-platform-channel-pipe`.
  - Its five children (parent 46992) are crashpad-handler 60168, gpu-process 13568, utility NetworkService 81628, utility StorageService 79608 and renderer 75276.
  - The children carry `--disable-features=msPdfOOUI,msSmartScreenProtection,msWebOOUI` (the same three features in a different order), plus the standard Chromium process flags.
  - No command line held `--remote-debugging-port`.
- After `taskkill /PID 38856 /T /F`: 0 `spatial-ide-shell` processes and 0 listeners on 9333.

**Run B**
- Variable removed from the call's process and shown absent (`present = False`); PID 40016.
- Poll: no answer in 60 s.
- 6 `msedgewebview2.exe` processes had the shell as ancestor (the browser process PID 59300 and five children).
  - Its flags are the same set as run A's: `--disable-features=msWebOOUI,msPdfOOUI,msSmartScreenProtection`, with no `--remote-debugging-port`.
  - The children's flags are the same as in run A.
- After the kill: 0 `spatial-ide-shell` processes and 0 listeners on 9333. Porcelain was still empty and the final tasklist showed no `spatial-ide-shell.exe`.
- In both logs the string `--remote-debugging-port` appears only in my own summary line, "command lines holding --remote-debugging-port=9333: 0", not in any command line.
- The logs are `erl-runA.log` and `erl-runB.log` in my scratch folder. They hold only redacted lines.

**Redaction script**
This is the `Redact` function in `erl-run.ps1`, in my scratch folder.
```
function Redact([string]$s) {
  $s = [regex]::Replace($s, '(?i)\\\\\?\\', '')
  $s = [regex]::Replace($s, '(?i)"[A-Z]:[\\/][^"]*"', '"<path>"')
  $s = [regex]::Replace($s, '(?i)[A-Z]:[\\/]\S*', '<path>')
  foreach ($n in @($env:USERNAME, $env:COMPUTERNAME, (Split-Path $env:USERPROFILE -Leaf))) {
    if ($n) { $s = [regex]::Replace($s, [regex]::Escape($n), '<path>', 'IgnoreCase') }
  }
  $s = [regex]::Replace($s, '\S*[\\/]\S*[\\/]\S*', '<path>')
  return $s
}
```
- One crashpad line shows the stray fragment `Files` after a `<path>`. It is the tail of an unquoted path with spaces, and nothing else leaked.

**Stop rules met:** none. I ran each run once, and both exes started. I wrote nothing outside the worktree's gitignored build folders, `D:/wt-targets/erl` and my scratch folder, apart from npm's and cargo's caches and the app's own per-user folders.

**Harness faithfulness**
- The harness is the real release exe with no overlay, no feature and no `.env`, started by `Start-Process`.
- The variable was set only in the run's own process.
- Each run reached its assertion: a poll answer or a 60 s timeout, plus the process-tree command lines.
- The result is a single pair of runs, so I make no claim beyond them.
- The 60 s no-answer in run A is not itself evidence about why. I did not attach to anything or read any other endpoint.

**Hold lines** (own project only)
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:11216`
- `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:11216 affinity=FF (cores 0-7)`

**Background shells left:** none running. The build hold shell completed and released. My bounded wait-watchers (task ids bkdtj2hka, bmdrpscs1, b6djxyg7c, bchsfmmdt) all completed, and no app process is left.

**Model:** the harness reports Sonnet 5.5 (`claude-sonnet-5-5`). No override and no context handoff.

**Scratch files**, all under `<the session scratch folder>/`: `erl-build.sh`, `erl-run.ps1`, `erl-build-out.log`, `erl-step1a.log`, `erl-step1b.log`, `erl-step2.log`, `erl-step3.log`, `erl-runA.log` and `erl-runB.log`.
