*Custodian's filing note (2026-11-10): the build worker's report, from its hand-back (sha256 2e5558bf93aa8045f0c0f45efbd2fb963c9af54d1dd62d4bfccb4e84b36af1bc, 6804 bytes), byte for byte below the rule. Its brief by file (15331 bytes, sha256 e1ad3dc618102a9a06a2246d2f51e336ce6eaee46685304d8473105e6d399052); the run 2026-11-10T17:39:48Z to 2026-11-10T18:12:07Z by its transcript, 40 calls, model claude-sonnet-5-5. Its scratch paths are written as `<S>` and `<H>` by the worker itself.*

---

Stopped: pan-anchor-setcam-waits-for-its-own-reset, P1 departed from its prediction at C1 (exit 2, not 0). Per the stop rules there is no commit 2, no m-trace, no r1, no step 7 and no push; no PR was opened.

**State left**
- Worktree is C:/dev/wt/pa on branch cut/pan-anchor-setcam-waits-for-its-own-reset, HEAD = C1 = 624b2e6893a39fc967eada2cc028875d3c7d767c. B is 1cc69e447493e7f01340435b0d033ab41b853a02.
- `git status --porcelain` is empty. P1's wrapper is reverted.
- C1 is committed locally only (signed off, `Signed-off-by` count 1, no `@` outside the first trailer line).
- No background shell or process of mine is running. All four background calls ended on their own, and the app-down output shows both ports free.

**Setup**
- Step 1: the form's sha256 at B is c360f679d6c495714df53ace0c908326b09984993efa66d1a7ff96d6f317b4ec, and `merge-base --is-ancestor` exited 0.
- Worktree add exited 0. Both `npm ci` runs exited 0.
- bundle-viewer `npm run build` exited 0, last line `scan-dist: reviewed row app.js local-filesystem-path 7291: not found`, porcelain empty. `generate:notice` exited 0 and wrote NOTICE.txt, 3427745 bytes, porcelain empty.
- Every resource path exists: dist/ holds NOTICE.txt (163998 bytes), app.js (333011) and index.html (6463); viewer-asset-hashes.json is 261 bytes.
- All 9 harness files matched the given sizes and sha256 values; I read each whole and changed none.
- Fixture (read only, before and after p0 and before p1): 29933646 bytes, sha256 fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49. I did not take the after-p1 hash.
- Exe build: exit 0, `Finished dev profile ... in 19m 07s`, then `copied exe`. The exe is 90905600 bytes, mtime Nov 10 19:01.

**P0 at B, as predicted**
- Wrapper saved as `<S>/pa-p0.patch`: after `setup()` in `main`, a `page.evaluate` that logs a stale `[render-trace] view-state` line (targetX 1e7, zoom z-0.25, origin = the call's target) and runs the real seam 2000 ms later.
- Log first line: `worktree C:/dev/wt/pa head 1cc69e447493e7f01340435b0d033ab41b853a02 start 2026-11-10T18:01:54Z`.
- Result lines: `PASS  small: pixel-spaces-coincide`, `PASS  large: pixel-spaces-coincide`, and the other 14 FAIL by name.
- Last lines: `==== 2/16 PASS ====`, then `FAILED: small: normal-A dx=300, ... large: recenter-crossing-A dx=-1200`, and `rc=1 end 2026-11-10T18:07:46Z`.
- App-down: `killed tree 60668`, `killed tree 47400`, `port 9223 free`, `port 5400 free`.
- app.err.log is only two lines (session log path, `data-plane expected origin ... http://localhost:5180`), so first 20 and last 20 are the same two lines.
- Reports copied: app.log (0 bytes) and tauri.e2e.conf.json (305 bytes). The audit log file was never created (no `pa-p0.audit.jsonl`). The session log is copied to `<S>/pa-p0.session.log` (193273 bytes).
- Reverted, porcelain empty.

**Code, commit 1 (624b2e68)**
- Subject: `fix: pan-anchor-setcam-waits-for-its-own-reset, setCam returns the view-state line carrying its own reset's zoom, under a bound that names setCam`. One file, 13 insertions and 6 deletions, against the declared 40.
- `setCam` computes `zoom = z + jit * 1e-5` once and passes it to the seam. The clear and the 500 ms sleep are kept.
- It then polls `vs.find((l) => l.zoom === zoom)`, sleeping 1000 ms a turn for 5 turns (OPEN-3 (B)). That meets the brief's "at least 250 ms" and the settlement's 1000 ms by 5, with a bound of 5500 ms.
- It returns the matching line. If none arrives it throws `setCam: no view-state line with zoom <z> within 5500 ms of the call; <n> other lines arrived`.
- The `setCam` comment is rewritten, and a constant `SETCAM_BOUND_MS = 5500` is added. The header is unchanged in C1, because the M-TRACE entry belongs to commit 2.
- `node --check` exited 0, and `git diff --name-only` named only pan-anchor.mjs.

**P1 at C1, the departure**
- Wrapper re-applied from the P0 patch and saved as `<S>/pa-p1.patch`.
- Log first line: `worktree C:/dev/wt/pa head 624b2e6893a39fc967eada2cc028875d3c7d767c start 2026-11-10T18:09:16Z`.
- Result lines: PASS for all 7 small-window checks (pixel-spaces-coincide through `small: recenter-crossing-A dx=1200`, residual -0.00). Then:
  `pan-anchor.mjs fatal: Error: setCam: no view-state line with zoom -6.99993 within 5500 ms of the call; 1 other lines arrived`
  at `setCam (pan-anchor.mjs:110:20)`, called from `runCasesForSize (:278:16)`.
- The last two log lines are `at async main (file:///C:/dev/wt/pa/frontends/shell/e2e/pan-anchor.mjs:301:5)` and `rc=2 end 2026-11-10T18:10:55Z`. Exit 2, no `==== 16/16 PASS ====`.
- The failing call is `small: recenter-crossing-A dx=-1200`, the 7th `setCam` call (zoom -7 + 7e-5).
- Under the wrapper, the stale line (zoom z-0.25) is the "1 other line". The reset's real line, expected at +2000 ms, was not found by exact zoom within 5.5 s after the seam call.
- I do not know why. Candidates are that the line's zoom differs from the passed double, or that the real seam did not log. I did not investigate or retry.
- App-down: `killed tree 71072`, `killed tree 77944`, ports 9223 and 5400 free. app.err.log is the same two-line shape. No audit log file was created. The session log is copied to `<S>/pa-p1.session.log` (88565 bytes). Reverted, porcelain empty.
- `m-trace`, `r1` and step 7 were not run. Nothing was pushed.

**Harness disclosure**
- The port-5400 harness under item 1 of the approval of 2026-10-11 was used: a debug exe built with a TAURI_CONFIG overlay (CDP on 9223, localhost:5180 mapped to 127.0.0.1:5400), Vite on 5400 with `--strictPort`, and the npx shim on PATH for those runs only. No tracked file was changed for it.
- It wrote only to `<H>/out/` and `<H>`'s `pa-e2e-*` logs and pids, `D:/wt-targets/pa`, `<S>/pa-*` files, C:/dev/wt/pa (build products, node_modules, `frontends/shell/e2e/out/`), and the app's own per-user log folder (session logs).

**Hold lines** (`also=` elided): `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:55416`, `:29860`, `:34432`, and one per run. Each was followed by `MACHINE_RELEASED project=SpatialIDE ... affinity=FF (cores 0-7)`.

**Self-check, four classes**
- Cross-module: I read `e2eSetViewState` in e2e-test-surface.ts and the trace shape, and P0 exercised the real seam and listener.
- Completion claims: only P0's pass and the exe build are claimed, each with a log. P1 is reported as a failure.
- User-facing messages: none changed.
- Required tests reaching their assertion: P1 did not reach it.

**Off-scope, not done**
- Nothing fixed. The cause of the missing match in the 7th call is for the custodian to decide on.
- The form's wrapper and the settlement's "poll once a second" were both followed as written.

**Model**: the harness reports me as claude-sonnet-5-5 (Sonnet 5.5). No override and no context handoff.
