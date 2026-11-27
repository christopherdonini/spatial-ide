# Colour-by-refill: the E-RK1 tester's three hand-backs, both warm-ups at P0 VOID

*Filed by the custodian: the tester's reports for node:colour-by-refill-keeps-the-view@e2e-tester-1 (PR 365, draft), dispatched at 2026-11-23T23:21:57Z; its run: Bash 38, SubagentHandback 3, by unique call ids, 1 calls errored; model claude-sonnet-5-5, from 2026-11-23T23:21:58Z to 2026-11-24T00:09:12Z by its transcript; 0 calls named the main checkout. Resumed by the custodian's messages at 2026-11-23T23:23:49Z (Resume E-RK1 at P0 step 3) and 2026-11-23T23:56:08Z (One more uncounted warm-up at P0). No E-RK1 result exists: both warm-ups were uncounted, and both ended VOID at the wait for the open's first look to plan. The diagnosis that followed found the cause (`state/consults/2026-11-24-colour-by-refill-keeps-the-view-e2e-diagnosis-tester-report.md`), and ADV-2026-11-24-01 (`state/directives/2026-11-24-advisor-ruling-adv-2026-11-24-01-colour-by-refills-e2e-before-the-change-the-fix-commits-suite-over-p0-the-three-void-runs-recorded-a-log-folder-finding.md`) rules how the series goes on. Evidence, not a gate.*

---

## Hand-back 1 of 3, at 2026-11-23T23:23:07Z: its first stop: the P0 build exited 2 on the tsc errors the P0 tree holds by design, which its brief did not allow for (the custodian's miss)

*3740 bytes, sha256 27bcac8de9ddc66a18702e3067c28742f8df245700af32135439d0bddd9d029e, byte for byte but for 5 values of the hold's lines, 1 of the profile's path or the account's name, 1 clock times other than UTC, written as <m>, <u> and <t> by the custodian, with one final newline added.*

**Stopped** at Phase P0 step 2. The shell's `npm run build` exited 2 at P0, because `tsc --noEmit` found type errors. No suite run has started. The worktree is detached at P0 (`8329a53c...`) and is clean. M-A1 was not applied.

**Setup**
1. `rev-parse HEAD` printed `2095a7ac471d2441fd8e054a448d334c7bcde455` and `status --porcelain` printed nothing. Both checks passed. The branch was `cut/colour-by-refill-keeps-the-view`.
2. The ports check printed nothing (grep rc=1), so 5180 and 9223 were not listening.
3. `df -m` showed C: with 41463 MB free, which is above the 40960 MB floor. D: had 203827 MB free.
4. Fixture `<F>`:
   - Listing: `-rw-r--r-- 1 <u> 197609 328242802 Nov 23 23:51 .../colour-refill-300k.parquet`.
   - Size: 328242802 bytes, as required.
   - sha256: `2ce715fd1a9e797099bcbe252b462069a523f390fd7561a99de813818830af84`, as required.
   - `ls -d D:/wt-data/cbr` printed `D:/wt-data/cbr`, so the folder exists.
5. `<O>` did not exist. I created it with `mkdir -p`, so it was empty.

**P0 checkout**
- `git checkout --detach 8329a53c250cf9beea3634554b4babf9ecc176a7` printed `HEAD is now at 8329a53c test: colour-by refill keeps the view, at the base (P0)`.
- `rev-parse HEAD` printed that commit and `status --porcelain` printed nothing.

**Build** (`TMP=D:/wt-data/cbr TEMP=D:/wt-data/cbr npm run build` in `<SH>`, inside the shared hold)
- UTC start 2026-11-23T23:22:20Z, end 2026-11-23T23:22:46Z. Exit code 2.
- The hold was granted at once: `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=<m> also=<m>`. The release line was `MACHINE_RELEASED project=<m> shell=<m> affinity=FF (cores 0-7)`.
- The log's last line is `src/residency/candidateArmSession.refillKeepsView.test.ts(243,50): error TS2554: Expected 2 arguments, but got 3.`
- The full set of `tsc --noEmit` errors (build script is `tsc --noEmit && vite build && ...`):
  - `src/canvas/WorkingCanvas.wiring.test.tsx(519,60): error TS2554: Expected 0 arguments, but got 1.`
  - `src/residency/candidateArmSession.refillKeepsView.test.ts(190,50): error TS2554: Expected 2 arguments, but got 3.`
  - the same file at (196,32): `error TS2493: Tuple type '[]' of length '0' has no element at index '0'.`
  - the same file at (206,50), (231,50) and (243,50): `error TS2554: Expected 2 arguments, but got 3.`
- Cause: the P0 commit holds the new tests, which call an option that the base product code does not yet have. The type-check therefore cannot pass at P0. This is my reading of the errors; I did not check it against the form.
- `frontends/shell/src/generated/NOTICE.txt` (3506979 bytes) was still written at <t>. It is untracked or ignored, and `status --porcelain` stayed empty. `generate:notice` ran in the viewer-first step, before `tsc` failed.
- The pre-build was not started. Run 0 and run 1 were not made. Phases head and M-A1 were not started.

**Decision needed from the custodian.** The brief says the build "must exit 0", and a failed build is a stop. I did not work around it. If P0's build step may be skipped, since the notice file already exists, or replaced by `npm run generate:notice` alone, tell me and I will resume at P0 step 3. The suite itself runs through `tauri dev`, which may not type-check.

Nothing is timing-sensitive. No file was edited and nothing was committed. The build log is at `<S>/cbr-e2e/build.log` and the times are in `<S>/cbr-e2e/build-times.txt`.

Model: Sonnet 5.5 (claude-sonnet-5-5), observed as running, with no override and no context handoff.

Four failure classes, for any later gate: no measurement was made, so none apply to a result yet. The harness's interface is not in question, since the build failed before the suite ran.

## Hand-back 2 of 3, at 2026-11-23T23:55:49Z: its second stop: warm-up 0 at P0 ended VOID at the wait for the open's first look to plan

*5965 bytes, sha256 816145e375e933b74a2d7f506b5f36a71ee4cbf6487c4e4f1cc635449e59584a, byte for byte but for 11 values of the hold's lines, 1 of the profile's path or the account's name, written as <m>, <u> and <t> by the custodian, with one final newline added.*

**Stopped** at Phase P0, run 0 (warm-up). The suite exited 2 (VOID). The custodian's brief makes VOID a stop at any phase, and the warm-up allowance covers only the attach line, so I ran nothing after it. Runs 1, 2w, 2 and 3 were not made, and the head checkout, build-head and M-A1 were not reached.

The worktree `C:/dev/wt/cbr` is detached at P0 `8329a53c250cf9beea3634554b4babf9ecc176a7`. `status --porcelain` printed nothing. M-A1 was never applied, so `App.tsx` is untouched. Ports 5180 and 9223 were not listening at the last check.

**Setup** (all passed)
- Head check: `rev-parse HEAD` printed `2095a7ac471d2441fd8e054a448d334c7bcde455` and `status --porcelain` printed nothing.
- Ports: 5180 and 9223 were not listening (grep rc=1).
- Disk: C: had 41463 MB free, D: had 203827 MB.
- Fixture `<F>`: `-rw-r--r-- 1 <u> 197609 328242802 Nov 23 23:51 ...colour-refill-300k.parquet`. The sha256 is `2ce715fd1a9e797099bcbe252b462069a523f390fd7561a99de813818830af84`, both as required. `D:/wt-data/cbr` exists.
- `<O>` did not exist, so I created it empty. `<O>` is `<S>/cbr-e2e`.
- P0 checkout: `rev-parse HEAD` printed `8329a53c250cf9beea3634554b4babf9ecc176a7` and `status --porcelain` printed nothing.

**P0 build** (`npm run build` in `<SH>`)
- UTC start 2026-11-23T23:22:20Z, end 2026-11-23T23:22:46Z. Exit 2.
- The six `tsc --noEmit` errors:
  - `src/canvas/WorkingCanvas.wiring.test.tsx(519,60): error TS2554: Expected 0 arguments, but got 1.`
  - `src/residency/candidateArmSession.refillKeepsView.test.ts(190,50): error TS2554: Expected 2 arguments, but got 3.`
  - `src/residency/candidateArmSession.refillKeepsView.test.ts(196,32): error TS2493: Tuple type '[]' of length '0' has no element at index '0'.`
  - `src/residency/candidateArmSession.refillKeepsView.test.ts(206,50): error TS2554: Expected 2 arguments, but got 3.`
  - `src/residency/candidateArmSession.refillKeepsView.test.ts(231,50): error TS2554: Expected 2 arguments, but got 3.`
  - `src/residency/candidateArmSession.refillKeepsView.test.ts(243,50): error TS2554: Expected 2 arguments, but got 3.`
- The log's last line is the (243,50) error.
- `src/generated/NOTICE.txt` (3506979 bytes) was written before `tsc` stopped.
- The custodian's decision: the "must exit 0" at P0's build step was the custodian's error. That step only needed to write the notice file, and the type errors are expected at P0. I resumed at P0 step 3 on that ruling.
- Build hold lines: `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=<m> also=<m>`, then `MACHINE_RELEASED project=<m> shell=<m> affinity=FF (cores 0-7)`.

**P0 pre-build** (`cargo build --manifest-path frontends/shell/src-tauri/Cargo.toml --locked --no-default-features`)
- UTC start 2026-11-23T23:23:58Z, end 2026-11-23T23:47:51Z. Exit 0.
- The log's last line is `    Finished `dev` profile [unoptimized + debuginfo] target(s) in 22m 12s`.
- Hold lines: `MACHINE_WAITING shared: turn of <m> held by pid <m> since <m>` (twice), then `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=<m> also=<m>`.

**Run 0 (warm-up, not counted)**
- Commit P0 `8329a53c...`, M-A1 not applied.
- UTC start 2026-11-23T23:48:05Z, end 2026-11-23T23:55:19Z. Exit 2 (VOID).
- Hold lines: `MACHINE_WAITING shared: turn of <m> held by pid <m> since <m>; earlier request of <m> waiting, pid <m>`, `MACHINE_WAITING shared: turn of <m> held by pid <m> since <m>`, then `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=<m> also=<m>`. The release followed after the run.
- The run was not an attach failure. The app launched, but no first-look plan line ever appeared. The suite recorded no zoom steps, feature count, boxes or client sizes.
- The log, byte for byte, with the scratch path written as `<t>` where the folder name carries it:
  - `colour-refill: fixture C:/dev/wt/cbr/target/fixtures/manual-walkthrough/colour-refill-300k.parquet sha256 2ce715fd1a9e797099bcbe252b462069a523f390fd7561a99de813818830af84; LOCALAPPDATA=D:\wt-data\cbr\spatial-colour-refill-opTFMS`
  - `(node:66472) [DEP0190] DeprecationWarning: Passing args to a child process with shell option true can lead to security vulnerabilities, as the arguments are not escaped, only concatenated.`
  - `(Use `node --trace-deprecation ...` to show where the warning was created)`
  - `the scratch store, with the session log, is kept: D:\wt-data\cbr\spatial-colour-refill-opTFMS`
  - `VOID  waited 120000ms for the open's first look to plan; the last reading was 0 -- not a PASS (checks recorded before it: 0)`
- Copied: `<S>/cbr-e2e/0-refill-out/` holds `app.log` and `tauri.e2e.conf.json`. `app.log` is 0 bytes, so the app wrote nothing to stdout or stderr.
- I also copied the scratch store as `<S>/cbr-e2e/0-refill-store/`. It holds only `npm-cache/_logs`, with three npm debug logs and no session log.
- The original store is still at `D:\wt-data\cbr\spatial-colour-refill-opTFMS`.
- The times are in `<S>/cbr-e2e/times.txt`.

**Timing-sensitive.** The run may be timing-sensitive, but I did not confirm it. A VOID after a 22-minute pre-build is not the attach line, so it is not the warm-up case the brief allows a re-run for. My reading is that the app started but never opened or planned the file within 120 s. The empty `app.log` and the missing session log in the store fit that, but I did not dig further. The custodian could re-run it alone on the machine, or check whether the first-look line is written at P0.

Four failure classes, for any gate: no measurement was reached.
- Harness interface: the run used `colour-refill.mjs` through the app's own `openPath`, as the suite does.
- Result claims: none exist.
- Operator-facing lines: none were written.
- Reaching the assertion: this run did not reach assert (a). It ended in a precondition VOID.

Model: Sonnet 5.5 (claude-sonnet-5-5), observed as running, with no override and no context handoff.

## Hand-back 3 of 3, at 2026-11-24T00:09:12Z: its last stop: warm-up 0b at P0 ended VOID the same way, a second such VOID being a stop

*4776 bytes, sha256 ef09e171afe31f6701fe6c64da155bcf2ac4dcf092508d38cb96873376e15ccd, byte for byte but for 3 values of the hold's lines, written as <m>, <u> and <t> by the custodian, with one final newline added.*

**Stopped** at Phase P0. Warm-up run 0b exited 2 (VOID) again, at the same first-look precondition as run 0. Per your instruction I ran no third warm-up. Runs 1, 2w, 2 and 3 were not made. Build-head (step 1a), the head checkout and M-A1 were not reached. M-A1 was never applied, so there is no `diff --stat` or restore to report.

The worktree `C:/dev/wt/cbr` is detached at P0 `8329a53c250cf9beea3634554b4babf9ecc176a7`. `status --porcelain` printed nothing after 0b. Ports 5180 and 9223 were not listening at the check before 0b (rc=1) or after it.

**Setup and P0 phase.** Everything in my earlier hand-back stands. In short:
- The setup checks passed. The fixture is 328242802 bytes with sha256 `2ce715fd1a9e797099bcbe252b462069a523f390fd7561a99de813818830af84`.
- The P0 checkout checks passed.
- The P0 build exited 2 on the six expected `tsc` errors, by your ruling.
- The P0 pre-build exited 0.

**Checks before 0b**
1. Ports: nothing listening.
2. `ls -la D:/wt-data/cbr`: 563 lines. It is full of scratch folders from many runs, so I saved it whole as `<S>/cbr-e2e/pre0b-wt-data-ls.txt` and did not paste it. Its first lines show `.tauri` and other short-named folders, plus `WorkingCanvas.tsx.orig` (163092 bytes) and `cmt.txt` (328 bytes).
3. `ls -la <SH>/e2e/out` held the previous run's files:
   - `app.log`, 0 bytes
   - `tauri.e2e.conf.json`, 305 bytes. It sets `--remote-debugging-port=9223` and the title "Spatial IDE", 1280x800.

**Run 0b (warm-up, not counted)**
- Commit P0, M-A1 not applied.
- UTC start 2026-11-23T23:56:26Z, end 2026-11-24T00:08:35Z. Exit 2.
- The hold waited behind another holder (pid <m>) from about 23:56Z until about 00:08Z. This is hold queueing, not a suite delay.
- Hold lines: `MACHINE_WAITING shared: turn of <m> held by pid <m> since <m>` (repeated), then `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=<m> also=<m>`.
- The suite's log, in full. It is 5 lines, and the scratch folder name is the only part that differs from run 0:
  - `colour-refill: fixture C:/dev/wt/cbr/target/fixtures/manual-walkthrough/colour-refill-300k.parquet sha256 2ce715fd1a9e797099bcbe252b462069a523f390fd7561a99de813818830af84; LOCALAPPDATA=D:\wt-data\cbr\spatial-colour-refill-et4AT7`
  - `(node:<m>) [DEP0190] DeprecationWarning: Passing args to a child process with shell option true can lead to security vulnerabilities, as the arguments are not escaped, only concatenated.`
  - `(Use `node --trace-deprecation ...` to show where the warning was created)`
  - `the scratch store, with the session log, is kept: D:\wt-data\cbr\spatial-colour-refill-et4AT7`
  - `VOID  waited 120000ms for the open's first look to plan; the last reading was 0 -- not a PASS (checks recorded before it: 0)`
- The only log line containing `first look`, `plan`, `open` or `admit` is the VOID line above. The word `open` appears in no other log line.
- Copied: `<S>/cbr-e2e/0b-refill-out/` holds `app.log` and `tauri.e2e.conf.json`. `app.log` is 0 bytes.
- Copied: `<S>/cbr-e2e/0b-refill-store/` holds only `npm-cache` (three npm debug logs and `_update-notifier-last-checked`). There is no `session-<n>.log` anywhere in the store. The suite reads `session-<n>.log` from the app's `LOG_DIR` under that scratch `LOCALAPPDATA`.
- Run 0 shows the same pattern: a 0-byte `app.log`, a store with only `npm-cache`, and the same VOID line.
- Both warm-ups ran the same way, and neither ever opened a session log. My reading is that the app did not start, or did not write to the scratch store. That is a suspicion, not a result: I did not check for the app process or the CDP attach.
- The run is not a timing result. It ended on a precondition VOID, not an attach line and not a timing-sensitive assert.

**Disclosure.** While copying the store I ran `ls -R` with an empty path, because a `tr` step had failed. That listed the top level of the main checkout `C:/dev/spatial-ide` (names only, plus two stray `phase8-console*.log` entries). I read no file contents and wrote nothing there. This broke the brief's rule against reading in the main checkout, and I am reporting it.

**Files**
- Times: `<S>/cbr-e2e/times.txt`
- Logs: `<S>/cbr-e2e/0-refill.log`, `<S>/cbr-e2e/0b-refill.log`
- Pre-build log: `<S>/cbr-e2e/prebuild-p0.log`
- Build log: `<S>/cbr-e2e/build.log`
- Run copies: `<S>/cbr-e2e/0-refill-out/` and `<S>/cbr-e2e/0b-refill-out/`, with the stores beside them.

Four failure classes, for any gate: no measurement exists, so no result claim is made and none is owed. This is two VOIDs at the harness's own first-look precondition. The harness uses the suite's real launch and `openPath`. I never reached assert (a).

Model: Sonnet 5.5 (claude-sonnet-5-5), observed as running, with no override and no context handoff.

