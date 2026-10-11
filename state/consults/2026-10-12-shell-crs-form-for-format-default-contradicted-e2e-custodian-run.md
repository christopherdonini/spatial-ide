*Custodian's filing note (2026-10-12): written by the custodian from the run logs in its scratchpad (not tracked), under the human's approval of 2026-10-11, item 1. Its sha256, from line 5 to the end, is 590040beb68025e494f2f16ee64113d6e903d5082cb06f0c7f673e3382e1b619.*

---

# The CRS-form piece's e2e evidence, run by the custodian under the human's harness approval

## Why the custodian ran it

- **The block.** Windows' dynamic TCP exclusion of 5120 to 5219 covers the dev server's 5180. Vite fails with `listen EACCES ::1:5180`, so `tauri dev` never starts. The worker reported this (`state/consults/2026-10-11-shell-crs-form-for-format-default-contradicted-worker-report-1.md`).
- **The approval.** The human approved the port-5400 harness for this project's e2e runs until 5180 is free again: `state/directives/2026-10-11-harness-approval-open-9-i-withdrawn-a10-late-cancel-adr-029.md`, item 1. The same item says: if a worker is refused again, the custodian runs the evidence and tells the human what was refused.
- **What was refused.** The resumed worker made one Bash call to read phase A's harness scripts (`cat` over the files of the `mm2a/` scratch folder). The permission classifier refused it with the reason `[Auto-Mode Bypass]`. The refusal said it applies to the outcome, not to that one command. The worker stopped and did not retry. The same read had been refused before the approval, together with an earlier refusal of a local change to the dev-server port. Nothing was built, copied or started by the worker.

## The method (the harness, disclosed)

All of it ran in the custodian's scratchpad, in a folder `crsform-e2e/` adapted from phase A's `mm2a/` scripts, and in the piece's own target folder `D:/wt-targets/crsform`. No tracked file was changed, and nothing was committed.
- **The exe.** One debug exe was built from `C:/dev/wt/crsform` at bc0b0d7a, with `CARGO_TARGET_DIR=D:/wt-targets/crsform`, in a shared hold. The build took 21 min 29 s, ending 2026-10-11T21:59Z.
  - `TAURI_CONFIG` set the window to the shipped title, width and height. The shipped window sets no `additionalBrowserArgs`. The overlay, copied byte for byte from phase A's, adds `additionalBrowserArgs`: `--disable-features=msWebOOUI,msPdfOOUI,msSmartScreenProtection --autoplay-policy=no-user-gesture-required --remote-debugging-port=9223 --host-resolver-rules="MAP localhost:5180 127.0.0.1:5400"`. This record does not claim which of those arguments a build without the overlay uses by default.
  - The piece changes no Rust that goes into the exe; `kernel/tests` is a test file. So the one exe served the base and the head.
- **The app.** For each run, the app was started fresh:
  - vite by hand, `--host 127.0.0.1 --port 5400 --strictPort`, from the worktree under test;
  - then the exe, with `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS` carrying the CDP and host-resolver arguments.

  An npx shim earlier on PATH stood in for `tauri dev`. After each run, only the processes the harness had started were stopped.
- **The base.** It was a temporary detached worktree at 1457fbd0, `D:/wt/crsform-base`, removed after the runs. It was prepared with:
  - `npm ci` in `frontends/shell` and `renderer/bundle-viewer`;
  - `node scripts/buildViewerFirst.mjs`;
  - `npm run generate:notice`.

  `tauri dev`'s own dev command is plain vite (`beforeDevCommand: npm run dev`), so these generated inputs come from an earlier build in any checkout. The head worktree had them from the worker's `npm run verify`.
- **The first base run failed to mount.** It started 2026-10-11T21:59:35Z and exited 1. Vite could not resolve `src/generated/NOTICE.txt`, which a fresh checkout lacks. After that preparation, the base was run again. The failed run's log is kept beside the others as `try1`.
- **The machine rule.** Each run was in its own shared hold, with no exit codes 96 to 99. Before each launch, a read-only check found the app's ports (9223, 5400, 5180, 1420) free and no vite, `tauri dev` or shell exe running. The last check, after the runs, printed FREE.
- **The fixtures.** The sha256 of all 17 `.parquet` files in `C:/dev/spatial-ide/target/fixtures/manual-walkthrough` was taken before the first run and after the last. Both lists are identical. Among them:
  - `absent-crs-contradicted.parquet` (F-2): 95e0fc3c888e4922590cb90ec4029279a34714ce3dd1c01be8cbee80b8afa260;
  - `no-crs-refused.parquet`: 5139b97bd43449d69feb23475ce7c12acc5054a0e7474b2d3349e75ca723d6e9;
  - `no-crs-no-id-refused.parquet`: 6e41b31267a4241cae388e2c49467fa4b1930be679aed7e55fb0753e9227f5c8;
  - `no-id-column.parquet`: b0c2f1ea879ca75ba1d740cfab93cc91a41e917e955085dbd4d6e4405e82f424;
  - `dupkey-refused.parquet`: cc0a841a3996ff8f378d378af445fbc2651e26812bf66cb1cd31c5a891933dc1;
  - `100k-happy-path.parquet`: fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49;
  - `filter-zoned.parquet`: 92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46.

## The runs (UTC, 2026-10-11)

| Run | Worktree, commit | Window | Exit |
|---|---|---|---|
| regression.mjs, base | crsform-base, 1457fbd0 | 22:02:17 to 22:06:40 | 0 |
| admission-remediation.mjs, base | crsform-base, 1457fbd0 | 22:07:10 to 22:07:37 | 0 |
| regression.mjs, head | crsform, bc0b0d7a | 22:07:59 to 22:12:30 | 0 |
| admission-remediation.mjs, head | crsform, bc0b0d7a | 22:13:05 to 22:13:32 | 0 |
| regression.mjs, the ABSENTCRS' mutation | crsform, bc0b0d7a with §2.1's branch deleted | 22:13:58 to 22:18:22 | 1 |

### regression.mjs, step by step

| Step | Base | Head | Mutation |
|---|---|---|---|
| A1' | PASS | PASS | PASS |
| A3' | PASS | PASS | PASS |
| A4' | PASS | PASS | PASS |
| A5'/A6' | PASS | PASS | PASS |
| A7' | PASS | PASS | PASS |
| A8' | PASS | PASS | PASS |
| A9' | PASS | PASS | PASS |
| K6 | PASS | PASS | PASS |
| K7 | PASS | PASS | PASS |
| CURSOR' | PASS | PASS | PASS |
| FIND' | PASS | PASS | PASS |
| MP' | PASS | PASS | PASS |
| PT' | PASS | PASS | PASS |
| LN' | PASS | PASS | PASS |
| B2'/B3' | PASS | PASS | PASS |
| ABSENTCRS' | PASS, with INFO `.crs-assertion-form present=false` | PASS | **FAIL** |
| C2'/C3' | PASS | PASS | PASS |
| NET' | INFO | INFO | INFO |

- **ABSENTCRS' at the base.** It refused `engine.format_default_contradicted` with the message verbatim, and showed no dismiss button and no describe summary. Its INFO reads `.crs-assertion-form present=false, .identity-declaration-form present=false (not asserted either way)`.
- **ABSENTCRS' at the head.** It refused the same code with the message verbatim, and showed no button inside the refusal block and no describe summary. The CRS form was present and the identity form absent. The EPSG:2056 catalog entry was picked and submitted by DOM clicks on the real form. The file was then admitted, with a `CRS` row beginning `EPSG:2056 — caller-asserted by ` and `CRS provenance` equal to `crs:asserted, axis:declared`. The step settled.
- **The mutation.** §2.1's branch, `if (code === "engine.format_default_contradicted") return "crs";` in `formFamilyForCode`, was deleted. The run then failed at ABSENTCRS' with `ABSENTCRS': .crs-assertion-form not present after the refusal`, and every other step kept its outcome.
  - The mutation was reverted with `git checkout` on that one file.
  - `git status --porcelain` in `C:/dev/wt/crsform` was empty afterwards, at bc0b0d7a.

### admission-remediation.mjs, step by step

| Step | Base | Head |
|---|---|---|
| ASSERT' | PASS | PASS |
| PASTED' | PASS | PASS |
| AXISTRAP' | PASS | PASS |
| NODEF' | PASS | PASS |
| MAP' | PASS | PASS |
| DUPKEY' | PASS | PASS |
| BOTHNEEDED' | PASS | PASS |
| CONFLICT' | PASS | PASS |
| CANCELOPEN' | PASS | PASS |
| NOPERSIST' | PASS | PASS |
| OVERBOUND' | PASS | PASS |

## Against the form

- **H2 holds.** At the head, the EPSG:2056 assertion over F-2 admits, through the real form (ABSENTCRS' at the head). I2 does not fire.
- **§3's predictions hold**, both at the head and at the base: the base step passes with its INFO, and the re-aimed step fails against the base behaviour (the mutation).
- **I3 does not fire.** Every other step has the same outcome at the base and at the head.
- **I5 does not fire for ABSENTCRS'.** Its mutation fails its step.

## Correction of record (2026-10-12), and the re-run at the round 1 head

- **The defect.** At bc0b0d7a, ABSENTCRS' did not read `waitForSettle`'s result and reported "settled" unconditionally. So this record's "The step settled." was not established by those runs (the reviewer's gate 1, E-1).
- **The re-run, at 48868625.** That commit carries the fix at e4df5e83, so the step reports `settled=`. regression.mjs ran there in a shared hold, by the same method, from 2026-10-11T22:41:36Z to 22:46:02Z.
  - It exits 0. All 17 steps PASS, and NET' is INFO.
  - ABSENTCRS' reports `settled=true`.
  - The fixtures' sha256 are unchanged before and after.
