Reviewed: PR #317 at 08bed11cd25066976a116cc6e2dbfb9aa8d647ac (base B′ 695e1303) (the custodian's filing note, 2026-11-14: the gate, the reviewer, attempt 1, Amendment 5 item 6's single reviewer gate of the five-line form, PLAN node pan-anchor-setcam-waits-for-its-own-reset, the filler slot; its brief by file (13951 bytes, sha256 bef294dbbd1ded3dba528fbc3fc22d31776333cc499014ba9ec65d24707414b6); the run 07:06:21Z to 08:05:57Z by its transcript, 76 calls (Bash 71, Read 4, SubagentHandback 1), none errored, no file written, model claude-opus-5-5; each run it claims has a call behind it (gr-p0's hold #22, gr-p1's #35, gr-mtrace's #43, gr-l1's #52, npm run verify in a hold #62, verify-quotes in a hold #69, node --check #61, node --test #67, verify:plan and verify:cites #68, gh pr checks #73), and each run's log on disk gives the counts and exits it reports; below, the hand-back byte for byte (with one final newline, 25776 bytes, sha256 7027fb32c7b5048112ac2f4c2d9951cd3b7071e1ae588ceddf6fdaa916af65c8), whose scratch-folder paths the reviewer itself wrote as <S>. Nothing is changed. Its D1 is applied under AUTONOMY §31 (d) at 3bb1d065 (the form's Amendment 8). The L1 script it ran, gr-l1-run.sh, is the custodian's: its leftover count matches its own command line, as its Check 5 notes.)

Reviewed: PR #317 at 08bed11cd25066976a116cc6e2dbfb9aa8d647ac (base B′ 695e1303), the single reviewer gate — cut/pan-anchor-setcam-waits-for-its-own-reset @ 08bed11cd25066976a116cc6e2dbfb9aa8d647ac
Verdict: PASS WITH NOTES

The verdict is PASS WITH NOTES. There are no Correctness or Evidence findings. There is one Documentation finding, D1, which must be fixed before the merge. It is a worker's sentence, not the human's wording, so it is applied with no re-gate and the PR body lists it.

Model: claude-opus-5-5, as the harness reports it.

## Findings

### Correctness
None.

### Evidence
None. Every prediction held: gr-p0, gr-p1, gr-mtrace and gr-l1, details in check 5. The one exception is the L1 script's own leftover-process count, a note on the instrument and not on the PR (check 5, gr-l1).

### Documentation (must fix before the merge, not blocking)
**D1 — `setCam`'s comment says the wait ends on "the run's hard timeout", but the file's own run instruction has no timeout.** This is wording, not blocking, and not the human's wording (the worker wrote it under Part 1 item 1).
- The span is `frontends/shell/e2e/pan-anchor.mjs` lines 104–106 at 08bed11c, byte-copied: "The wait has no wall-clock bound: it ends when that line is in `vs`, when the seam resolves anything but `true` (thrown above), or when the run's hard timeout kills the process, which leaves no result."
- **The hard timeout is the harness's, not the file's.** The timeout belongs to the harness's run-suite step (`timeout "$TMO" node "$SCRIPT"`, its line 12). The header's own run instruction, line 9, is `node e2e/pan-anchor.mjs` with no timeout. An operator who follows line 9 gets a wait that nothing in the suite ends, only a progress line every 30 turns.
- **The second ending is not an ending of the wait.** A seam that resolves anything but `true` throws at line 100, before the wait begins at line 110.
- **Replacement words** for that span:

  "The wait has no wall-clock bound: it ends when that line is in `vs`, or when the process is ended from outside. A run is to be made under a hard timeout (the harness's run-suite step gives one), and a run that timeout ends leaves no result. A run without one (this header's `node e2e/pan-anchor.mjs`) waits until it is stopped. A seam resolving anything but `true` has already thrown above, before the wait."

- **Each clause checked against the code at 08bed11c:**
  - "ends when that line is in `vs`": the loop condition `!own()` at line 110, with `own` at line 109.
  - "or when the process is ended from outside": lines 110–113 have no other exit, no turn limit and no throw.
  - "A run is to be made under a hard timeout (the harness's run-suite step gives one)": the advisor's ruling ADV-2026-11-13-09, OPEN-B (a) (form Amendment 5 item 8), and the run-suite step's line 12. That step is untracked, so no path is cited.
  - "a run that timeout ends leaves no result": form Amendment 5 items 1 (iii) and 8.
  - "A run without one (this header's `node e2e/pan-anchor.mjs`) waits until it is stopped": header line 9, and the loop.
  - "has already thrown above, before the wait": line 100 comes before line 110.
- **Size:** about +1 line, so 27 of the budget of 40. The edit stays inside Amendment 5 item 2's comment rewrite (old lines 102–106), and the `RECORDED MUTATION` entry is unaffected.

### Observations (no action)
- **Throw (ii) is not exercised by any run.** No run exercises item 1 (ii)'s throw (seam resolves not `true`). The worker disclosed this, the form asks for no test of it, and no record claims it was observed.
- **The progress line's "N s" counts sleep turns.** `${turn} s after the 500 ms minimum` counts `sleep(1000)` turns, so it is a lower bound on time waited. The comment's "Every 30th turn of 1000 ms" states that correctly.

## Check 1 — Start (07:06:50Z)
- Fetch: rc 0.
- Worktree `C:/dev/wt/pa`:
  - HEAD is `08bed11cd25066976a116cc6e2dbfb9aa8d647ac`, on branch `cut/pan-anchor-setcam-waits-for-its-own-reset`.
  - Porcelain is empty.
  - `ls-remote` gives `08bed11cd25066976a116cc6e2dbfb9aa8d647ac	refs/heads/cut/pan-anchor-setcam-waits-for-its-own-reset`.
- Disk: `C:              476G  425G   51G  90% /c` and `D:              466G  123G  344G  27% /d`.
- Form at origin/main (57451bb3ea644e01882cb086fbd436e3d2047cef): 69591 bytes, 497 lines, sha256 34ce3cee6e1187accfdb948a3d21700e5f7022fa4d33007115bf5e220178aa2c. Read whole.
- Part 1 items 1–9 and the worker's report were read whole at origin/main.

## Check 2 — Out of scope first (form line 28, against the diff)
All five parts hold.
- **ADR: holds.** The diff reads only `l.zoom` off trace lines already in `vs` (line 109). It never reads deck's `info.coordinate`.
- **Security: holds.** The diff touches only `pan-anchor.mjs`. WorkingCanvas.tsx and e2e-test-surface.ts are unchanged in the branch and on main since B′ (check 3). `registerE2eHook`'s instrumented-build gate (e2e-test-surface.ts:375–383) is untouched. No dependency is added.
- **Wire: holds.** No path under protocol/.
- **Guarantee: holds.**
  - `const TOLERANCE_BUFFER_PX = 4.0;` (line 45) is unchanged.
  - The diff's hunks are setCam (lines 93–115) and the header comment (lines 163–166) only.
  - `instrumentA`, `record` calls, the cases and `drag` are unchanged.
- **No string the app shows: holds.** The new strings are the suite's own Error (line 100) and its stdout progress line (line 112).

## Check 3 — The diff
- `--numstat 695e1303… HEAD`: `20	6	frontends/shell/e2e/pan-anchor.mjs`. `--name-only` lists that file alone. That is 26 lines, inside the budget of 40 and the estimate of 20 to 28 (item 5).
- Commits since B′:
  - 39d724fc: +12/−9.
  - 08bed11c: +4.
  - The merge 1427596d has parents 624b2e68 and 695e1303.
  - Merging brought no change to the file from commit 1.

**Against item 2, at commit 1's line numbers:**

| Commit 1 line | What it is | Item 2 says | At the head |
|---|---|---|---|
| 93 | `SETCAM_BOUND_MS` | deleted | deleted |
| 98–99 | zoom computed once, the clear | kept | kept |
| 100 | the seam call | kept, value read | kept as `const seam = …` plus the `!== true` throw |
| 101 | 500 ms minimum | kept | kept |
| 102–106 | the comment | rewritten | rewritten |
| 107 | `own` | kept | kept |
| 108 | five-turn loop | replaced by an unbounded loop | replaced: one 1000 ms sleep per turn, progress line every 30th turn |
| 109–110 | `const line = own();` and the throw | deleted | deleted |
| 111 | return | returns the matched line | `return own();` |

Commit 3 adds one `RECORDED MUTATION` entry.

**Item 1 (i) to (iii):** (i) is lines 109–114; (ii) is line 100; (iii) is the harness's timeout, with no code in the file. The progress line (line 112) contains no `PASS`, `FAIL` or `====`.

**The comment against Part 1 item 1 and item 2's five points.** Each clause checked:
- **What the wait matches:** `vs.find((l) => l.zoom === zoom)`.
- **Why that line is the reset's:** WorkingCanvas.tsx:2369 at HEAD, `traceViewState(0, 0, zoom, frame.originX, frame.originY)`, is the seam's one line. `:2357` returns `false` and logs nothing. The controller line at :2124 carries the previous gesture's zoom.
- **The late line:** the listener pushes after `await a[2].jsonValue()` (line 62). The late line stays in `vs` and setCam does not read it.
- **Precondition, not property:** holds.
- **`s1` not covered:** `last(vs)` at lines 242, 256, 275 and 287.
- **No bound, what ends it, the progress line:** see D1.

**Seam rule:**
- Consumer read: e2e-test-surface.ts:320 types the seam `(targetX, targetY, zoom) => Promise<boolean>`. WorkingCanvas.tsx:2353–2378 resolves `false` or `true`. `registerE2eHook` installs the function unchanged.
- End-to-end from the real shape: gr-p1, gr-l1 and the worker's a6-r1.
- No `pub` item, callback or option is added.

**`RECORDED MUTATION` entry (lines 163–166):**
- It is a bullet like the file's other two, under the list heading. It carries its own `OBSERVED AT 39d724fc67958dd199ccb2ac140334e6c298bc66` (40-hex, commit 2).
- Its quoted Observed line is byte-equal to line 25 of `<H>/out/pa-e2e-a6-mtrace.log`: `setCam: still waiting for the view-state line with zoom -0.99999: 570 s after the 500 ms minimum, 1 other lines arrived` (grep -nF rc 0).
- "19 progress lines" matches: grep -c gives 19. "rc=124" matches the log.

**Main since B′:** `git diff --stat 695e1303… origin/main -- frontends/shell/e2e frontends/shell/src/canvas/WorkingCanvas.tsx frontends/shell/src/e2e-test-surface.ts frontends/shell/src-tauri` gives empty output (0 bytes, rc 0). B′ is an ancestor of origin/main, 8 commits behind it. Main changed nothing in those paths.

## Check 4 — The harness and build
All nine harness files match the brief:

| File | Bytes | sha256 |
|---|---|---|
| `pa-e2e-app-down.ps1` | 880 | 63bc23775caf8a9f2466f2d44ea6e69dbbb29f0abd11def2bd088bffa3474bbf |
| `pa-e2e-app-up-wait.ps1` | 208 | b92fcaeca0bf607f9d1c9e66e3ddeede0c3ab302eed10ca7ddc8c59db4a6dbeb |
| `pa-e2e-app-up.ps1` | 1822 | d92e43f6efdd67cb678c77d536e5b2322fba92c93eb1bf9c3cd43b2c1978a336 |
| `pa-e2e-build-exe.sh` | 616 | c84fb6a6517cd1e19861b2bf0aa4250b64d28a2b2bd739f3a02fee30d74d2b72 |
| `pa-e2e-busy.ps1` | 983 | 134866948a8312611a22c5f304d2c695b29680852c06bb90471a630ba499c6c5 |
| `pa-e2e-run-suite.sh` | 1556 | 1f79a7d3288106d3aaf9d64b2d3e1fd572ae29f401c2ca5959fa3396a98ae609 |
| `pa-e2e-tauri.conf.json` | 293 | 0dc02596e3f90f369be28a70119e4000538d61e694d6945de989afd6f0b163e0 |
| `shim/npx.cmd` | 220 | 00d937b8b15cbdffa01bd92d1d55b8490fc3a22bc75cdafcb69e16e6704e2c12 |
| `shim-wait/npx.cmd` | 301 | b3a554f269a89ecf42836ff3cb0bb4bab3226e2865cfb488aac80a83821de16a |

- `pa-e2e-run-suite.sh` was read whole: exit 94 if the tag's log exists, exit 90 on busy, `timeout "$TMO" node "$SCRIPT"`. No harness file was changed. No `gr-` log existed before the runs.
- Exe: `D:/wt-targets/pa/exes/spatial-ide-shell-pa.exe`, 91529728 bytes, mtime 2026-11-14 01:39:39 +0100.
- Every `resources` path exists:
  - `bundle-viewer/dist/`: NOTICE.txt 163998, app.js 333011, index.html 6463.
  - `viewer-asset-hashes.json`: 261.
  - `../src/generated/NOTICE.txt`: 3506979. This is now larger than the worker's 3427745, regenerated by verify. It is gitignored and the porcelain stays empty.
- Nothing was installed or built, except gr-l1's own load build.
- Fixture `target/fixtures/manual-walkthrough/100k-happy-path.parquet`: 29933646 bytes, sha256 fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49, both before the first run (07:09:10Z) and after the last. Not regenerated.

## Check 5 — My runs
For every run:
- Busy check passed, no exit 90 or 94.
- No hold was refused.
- Hold and release lines: `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:<pid> also=<m> …` and `MACHINE_RELEASED project=<m> …`.
- The audit log (`<S>/pa-<tag>.audit.jsonl`) was never written: size none.
- The app's stderr first line names a session log in `<the app's per-user log folder>`. Each was copied right after its run.

Patches: `pa-p0.patch` is 901 bytes, sha256 250581c780d209a2321545a788f954fd43d33a5fd4022d44bf6fbfdb64f51f39. `gr-mtrace.patch` is 851 bytes, sha256 c8162046bc6dd51a9a5313abfdddb14bfe847aea7bc704785cb9a9b659d8c6c4. Both were shown.

**Status before each run** (`reading` line; no `project=SpatialIDE` line in any):

| Run | quiet | average | peaks-over-25 |
|---|---|---|---|
| gr-p0 | False | 33.1% | 46 |
| gr-p1 | False | 43.6% | 60 |
| gr-mtrace | False | 29.9% | 60 |
| gr-l1 | False | 26.1% | 41 |

### gr-p0 at B′ — as predicted (07:10:53Z to 07:16:00Z, rc 1)
- Setup: B′'s file written, the patch applied (rc 0). `git diff HEAD` showed commits 2 and 3 removed and the wrapper added.
- First line: `worktree C:/dev/wt/pa head 08bed11cd25066976a116cc6e2dbfb9aa8d647ac start 2026-11-14T07:10:53Z`. The file is at B′'s bytes. The product equals B′'s, since nothing under src changed in the branch.
- Check lines:
```
PASS  small: pixel-spaces-coincide  ::  client==buffer (328x552 == 328x552), ratio 1.000
FAIL  small: normal-A dx=300  ::  grab-point residual -4999990.44 buffer px (tol 4)
FAIL  small: normal-A dx=-300  ::  grab-point residual -5000361.82 buffer px (tol 4)
FAIL  small: paint-vs-event dx=85  ::  painted 79.0 vs deck 110572.7 -> -110493.69 buffer px (tol 4)
FAIL  small: paint-vs-event dx=-85  ::  painted -83.0 vs deck 110405.5 -> -110488.51 buffer px (tol 4)
FAIL  small: there-and-back-net  ::  net residual -4996240.09 buffer px (tol 4)
FAIL  small: recenter-crossing-A dx=1200  ::  grab-point residual -77028.25 buffer px (tol 4)
FAIL  small: recenter-crossing-A dx=-1200  ::  grab-point residual -78128.79 buffer px (tol 4)
PASS  large: pixel-spaces-coincide  ::  client==buffer (788x812 == 788x812), ratio 1.000
FAIL  large: normal-A dx=300  ::  grab-point residual -4999772.76 buffer px (tol 4)
FAIL  large: normal-A dx=-300  ::  grab-point residual -5000099.42 buffer px (tol 4)
FAIL  large: paint-vs-event dx=250  ::  painted 244.4 vs deck 110737.1 -> -110492.66 buffer px (tol 4)
FAIL  large: paint-vs-event dx=-250  ::  painted -487.9 vs deck 110249.9 -> -110737.75 buffer px (tol 4)
FAIL  large: there-and-back-net  ::  net residual -4989018.61 buffer px (tol 4)
FAIL  large: recenter-crossing-A dx=1200  ::  grab-point residual -77032.04 buffer px (tol 4)
FAIL  large: recenter-crossing-A dx=-1200  ::  grab-point residual -78132.58 buffer px (tol 4)
==== 2/16 PASS ====
```
- No progress lines and no fatal line.
- Last two lines: `FAILED: small: normal-A dx=300, small: normal-A dx=-300, small: paint-vs-event dx=85, small: paint-vs-event dx=-85, small: there-and-back-net, small: recenter-crossing-A dx=1200, small: recenter-crossing-A dx=-1200, large: normal-A dx=300, large: normal-A dx=-300, large: paint-vs-event dx=250, large: paint-vs-event dx=-250, large: there-and-back-net, large: recenter-crossing-A dx=1200, large: recenter-crossing-A dx=-1200` and `rc=1 end 2026-11-14T07:16:00Z`.
- App-down: `killed tree 76656` / `killed tree 27844` / `port 9223 free` / `port 5400 free`.
- Session log: `<S>/gr317-gr-p0.session.log`, 162825 bytes, sha256 d147f03452f5d7499c84991a9f4b27656124ef4777bf872cca1203b62879220c.
- Reverted; porcelain empty.

### gr-p1 at the head — as predicted (07:17:57Z to 07:24:06Z, rc 0)
- Setup: the patch applied (rc 0).
- First line: `worktree C:/dev/wt/pa head 08bed11cd25066976a116cc6e2dbfb9aa8d647ac start 2026-11-14T07:17:57Z`.
- Check lines:
```
PASS  small: pixel-spaces-coincide  ::  client==buffer (328x552 == 328x552), ratio 1.000
PASS  small: normal-A dx=300  ::  grab-point residual 0.50 buffer px (tol 4)
PASS  small: normal-A dx=-300  ::  grab-point residual 0.50 buffer px (tol 4)
PASS  small: paint-vs-event dx=85  ::  painted 83.0 vs deck 83.0 -> 0.00 buffer px (tol 4)
PASS  small: paint-vs-event dx=-85  ::  painted -83.0 vs deck -83.0 -> -0.01 buffer px (tol 4)
PASS  small: there-and-back-net  ::  net residual 0.00 buffer px (tol 4)
PASS  small: recenter-crossing-A dx=1200  ::  grab-point residual -0.00 buffer px (tol 4)
PASS  small: recenter-crossing-A dx=-1200  ::  grab-point residual 0.00 buffer px (tol 4)
PASS  large: pixel-spaces-coincide  ::  client==buffer (788x812 == 788x812), ratio 1.000
PASS  large: normal-A dx=300  ::  grab-point residual 0.50 buffer px (tol 4)
PASS  large: normal-A dx=-300  ::  grab-point residual 0.50 buffer px (tol 4)
PASS  large: paint-vs-event dx=250  ::  painted 243.9 vs deck 244.0 -> -0.08 buffer px (tol 4)
PASS  large: paint-vs-event dx=-250  ::  painted -244.0 vs deck -244.0 -> 0.03 buffer px (tol 4)
PASS  large: there-and-back-net  ::  net residual 1.00 buffer px (tol 4)
PASS  large: recenter-crossing-A dx=1200  ::  grab-point residual -0.00 buffer px (tol 4)
PASS  large: recenter-crossing-A dx=-1200  ::  grab-point residual -0.00 buffer px (tol 4)
```
- Progress lines observed: none. No `pan-anchor.mjs fatal:` line.
- Last two lines: `==== 16/16 PASS ====` and `rc=0 end 2026-11-14T07:24:06Z`.
- App-down: `killed tree 59212` / `killed tree 48148` / `port 9223 free` / `port 5400 free`.
- Session log: `<S>/gr317-gr-p1.session.log`, 234004 bytes, sha256 99c9e1f04cfb4b15b622113990b137f98ef81a77dd8fbc55557a8a8dbccb6774.
- Reverted; porcelain empty.

### gr-mtrace at the head — as predicted (07:26:00Z to 07:36:00Z, rc 124; est 12, timeout 600)
- Setup: before the patch, `grep -c` of the target line gave 1. The patch applied (rc 0). `git diff` showed the one line, `-      traceViewState(0, 0, zoom, frame.originX, frame.originY);` / `+      traceViewState(0, 0, zoom + 1e-6, frame.originX, frame.originY);`.
- First line: `worktree C:/dev/wt/pa head 08bed11cd25066976a116cc6e2dbfb9aa8d647ac start 2026-11-14T07:26:00Z`.
- The one check line: `PASS  small: pixel-spaces-coincide  ::  client==buffer (328x552 == 328x552), ratio 1.000`. No further check line (grep count of check lines: 1).
- 19 progress lines, from `setCam: still waiting for the view-state line with zoom -0.99999: 30 s after the 500 ms minimum, 1 other lines arrived` through `setCam: still waiting for the view-state line with zoom -0.99999: 570 s after the 500 ms minimum, 1 other lines arrived`, every 30 s. No fatal line and no `====` line.
- Last two lines: `setCam: still waiting for the view-state line with zoom -0.99999: 570 s after the 500 ms minimum, 1 other lines arrived` and `rc=124 end 2026-11-14T07:36:00Z`.
- App-down: `killed tree 58340` / `killed tree 75228` / `port 9223 free` / `port 5400 free`.
- Session log: `<S>/gr317-gr-mtrace.session.log`, 33801 bytes, sha256 617cab445ab23b625480b5f3570ed37e9a03c0e810011544b45004f058aecb14.
- Reverted with `apply -R` (rc 0); porcelain empty; line 2369 shown back.

### gr-l1 at the head under load — as predicted (suite 07:38:03Z to 07:45:54Z, script exit 0)
`<S>/gr-l1-run.sh` (2876 bytes, sha256 d8f9699afdb0d1eb0a869bf0890e2d2db9cbf4a41f09b10b37fca643b2438ddd) was read whole first. It differs from `pa7-l1-run.sh` only in names and paths and by dropping the rustc listings and the post-kill cargo listing.

Script output, byte-copied whole (hold and release lines masked):
```
first Compiling line:    Compiling proc-macro2 v1.0.107
build liveness at suite start: windows pid 53480 rows 1
"cargo.exe","53480","Console","1","9,052 K"
"cargo.exe","82016","Console","1","72,148 K"
killed tree 67316
killed tree 60736
port 9223 still listening, owner pid 59604
port 5400 free
copied report tauri.e2e.conf.json
suite rc=0
build liveness at suite end: windows pid 53480 rows 1
"cargo.exe","53480","Console","1","9,016 K"
"cargo.exe","82016","Console","1","70,576 K"
last Compiling lines:
   Compiling spatial-skp v0.0.0 (C:\dev\wt\pa\protocol\skp)
   Compiling spatial-renderer v0.0.0 (C:\dev\wt\pa\renderer)
   Compiling spatial-data-plane v0.0.0 (C:\dev\wt\pa\protocol\data-plane)
SUCCESS: The process with PID 67740 (child process of PID 61512) has been terminated.
SUCCESS: The process with PID 46616 (child process of PID 61512) has been terminated.
SUCCESS: The process with PID 69824 (child process of PID 61512) has been terminated.
SUCCESS: The process with PID 40796 (child process of PID 61512) has been terminated.
SUCCESS: The process with PID 2488 (child process of PID 61512) has been terminated.
SUCCESS: The process with PID 78040 (child process of PID 61512) has been terminated.
SUCCESS: The process with PID 19296 (child process of PID 61512) has been terminated.
SUCCESS: The process with PID 65280 (child process of PID 61512) has been terminated.
SUCCESS: The process with PID 61512 (child process of PID 82016) has been terminated.
SUCCESS: The process with PID 82016 (child process of PID 53480) has been terminated.
SUCCESS: The process with PID 53480 (child process of PID 57636) has been terminated.
taskkill rc=0
after-kill: windows pid 53480 rows 0
after-kill: processes whose command line names the load target:
1
msys pid 12693 gone
load target absent
```

`<S>/gr-l1-stamps.txt`, 317 bytes, whole:
```
script-start 2026-11-14T07:37:47Z
build-start 2026-11-14T07:37:47Z
build msys pid 12693, windows pid 53480
compiling-line-seen 2026-11-14T07:37:57Z
suite-start 2026-11-14T07:37:58Z
suite-end 2026-11-14T07:46:05Z
build-checked-after 2026-11-14T07:46:06Z
killed 2026-11-14T07:46:07Z
target-removed 2026-11-14T07:46:13Z
```

The suite log:
- First line: `worktree C:/dev/wt/pa head 08bed11cd25066976a116cc6e2dbfb9aa8d647ac start 2026-11-14T07:38:03Z`.
- The 16 check lines all PASS and equal gr-p1's, except `PASS  small: paint-vs-event dx=85  ::  painted 83.5 vs deck 83.0 -> 0.49 buffer px (tol 4)`.
- No progress lines and no fatal line.
- Last two lines: `==== 16/16 PASS ====` and `rc=0 end 2026-11-14T07:45:54Z`.
- Session log: `<S>/gr317-gr-l1.session.log`, 258170 bytes, sha256 a78cbc2b2fc16256fb3baf5cd18999015f20f4bb261a7212bf1d5153cd7306ec.

What departed from the prediction text, and how I checked it:
- **The script's leftover count printed `1`.** Its pattern `wt-targets.pa-load-gr` matches the counting powershell's own command line. A self-excluding count with pattern `wt-targets.pa-load-g[r]` gave `0`. pid 53480 has 0 rows, `D:/wt-targets/pa-load-gr` is absent, and `tasklist` shows no cargo.exe. My reading: no process of the build remains and no load target. This is a note on the script, not on the PR.
- **App-down left 9223 listening.** Its `port 9223 still listening, owner pid 59604` was checked afterwards: pid 59604 was gone and only a `TIME_WAIT` socket remained on 9223. The end-of-gate busy check printed FREE.

No timing-sensitive failure occurred in any shared run.

## Check 6 — The worker's runs, against Amendment 7
- **a6-r1:**
  - first line: `worktree C:/dev/wt/pa head 08bed11cd25066976a116cc6e2dbfb9aa8d647ac start 2026-11-14T05:16:01Z`
  - `==== 16/16 PASS ====`
  - last two lines: `==== 16/16 PASS ====` / `rc=0 end 2026-11-14T05:21:33Z`
- **a6-p0:**
  - first line: `worktree C:/dev/wt/pa head 1427596d5c9edae8b9248b13d8b3525b4c43c55c start 2026-11-14T04:48:22Z`
  - `==== 2/16 PASS ====`
  - last two lines: the same `FAILED: …` list of 14 as gr-p0 / `rc=1 end 2026-11-14T04:51:49Z`
- **a6-mtrace:**
  - first line: `worktree C:/dev/wt/pa head 39d724fc67958dd199ccb2ac140334e6c298bc66 start 2026-11-14T04:56:37Z`
  - no `====` line
  - last two lines: `setCam: still waiting for the view-state line with zoom -0.99999: 570 s after the 500 ms minimum, 1 other lines arrived` / `rc=124 end 2026-11-14T05:06:37Z`
- **a6-p1:**
  - first line: `worktree C:/dev/wt/pa head 08bed11cd25066976a116cc6e2dbfb9aa8d647ac start 2026-11-14T05:09:11Z`
  - `==== 16/16 PASS ====`
  - last two lines: `==== 16/16 PASS ====` / `rc=0 end 2026-11-14T05:14:16Z`
  - its two progress lines are at log lines 13 and 24 (zoom -6.99993 and -6.99986, 30 s each)
- **a6-l1:**
  - first line: `worktree C:/dev/wt/pa head 08bed11cd25066976a116cc6e2dbfb9aa8d647ac start 2026-11-14T05:23:33Z`
  - `==== 16/16 PASS ====`
  - last two lines: `==== 16/16 PASS ====` / `rc=0 end 2026-11-14T05:29:47Z`
- No fatal line appears in a6-p1, a6-r1 or a6-l1.

All of these match Amendment 7, items 1, 3 and 4. Amendment 7 item 6's numstat matches check 3.

## Check 7 — Readiness, at 08bed11c in `C:/dev/wt/pa`
- `node --check frontends/shell/e2e/pan-anchor.mjs`: rc 0, no output.
- `npm run verify` in frontends/shell, in a shared hold (est 10): rc 0. `Test Files  112 passed (112)`, `Tests  1459 passed (1459)`, plus node suites of 5/5 and 7/7 pass, 0 fail.
- `node --test` over plan, hooks and evidence: rc 0, `ℹ tests 598`, `ℹ pass 598`, `ℹ fail 0`.
- `node scripts/plan/verify.mjs --offline`: rc 0, `verify:plan PASS — C:\dev\wt\pa\governance\PLAN.yaml agrees with the repository.`
- `node scripts/plan/verify-cites.mjs`: rc 0, `verify:cites PASS — every rooted (in-tree) path:line reference across 2987 file(s) resolves. (193 loose reference(s) advised above.)`
- `node scripts/plan/verify-quotes.mjs`, in a shared hold: rc 0, `verify:quotes PASS — 156 checked, 125 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 927 ruling cites resolved, 0 ruling-cite errors.`
- CI, `gh pr checks 317`, read at 2026-11-14T08:02:46Z: rc 0. All 16 rows pass:
  - L1 cargo test ubuntu
  - cargo fmt
  - cargo test windows-latest
  - cfg boundary
  - signed off
  - no profile path
  - ported-notices ×2
  - tauri build ×2
  - test · verify:plan · queue/site drift
  - typecheck · build · test
  - typecheck · build · vitest · cargo test ×2
  - validate ×2

  The PR head is 08bed11c, a draft, OPEN.

## Check 8 — End (08:02:55Z)
- `pa-e2e-busy.ps1`: rc 0, `FREE`.
- HEAD `08bed11cd25066976a116cc6e2dbfb9aa8d647ac`; porcelain empty.
- Disk: `C:              476G  426G   51G  90% /c` and `D:              466G  123G  344G  27% /d`.
- No cargo.exe is running. Every background shell I started has completed (six runs and holds, and one wait loop the harness moved to the background). I killed nothing, and none was left.

## Departures from the brief
1. Some short commands printed their output directly instead of to a file first (`git apply`, `rev-parse`, `ls`, `stat`, `tasklist`, `netstat`). No exit code I report came from a piped command.
2. One extra read-only network call: `gh pr view 317 --json headRefOid,isDraft,state`, made with the CI read.
3. One foreground wait loop (160 turns of 1 s), during gr-l1, was moved to the background by the harness after 180 s. It completed bounded.
4. I masked my own hold lines' `project=` value as `<m>` as well as the others.

Scratch files are in `<S>`, all under new `gr317-` names: status, diff, verify, test outputs and the session-log copies. The L1 script's own outputs, `gr-l1-stamps.txt` and `gr-l1-build.cargo.log`, are also there.
