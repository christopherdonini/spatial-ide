# Milestone 2 phase B: the custodian's e2e runs at stages 3 and 4 (run 1)

*Custodian's record (2026-10-12). The runs were made under the human's approval of the port-5400 harness (`state/directives/2026-10-11-harness-approval-open-9-i-withdrawn-a10-late-cancel-adr-029.md`, item 1). Times are from the logs (`date -u`). The logs stay in the session's scratch folder `mm2b-e2e/out/` and are not committed.*

## The harness (disclosed, as the approval requires)

- **Checkout.** A detached worktree `C:/dev/wt/mm2b-e2e`. No tracked file changed: `git status --porcelain` printed nothing after every run.
  - It was prepared with `npm ci` in `renderer/bundle-viewer` and `frontends/shell`, `node scripts/buildViewerFirst.mjs` and `npm run generate:notice`. All of these outputs are ignored files.
- **Exe.** One debug exe was built from 1de68a6120453b000c9eedaa9379113220c6d12b with the TAURI_CONFIG overlay into the piece's own target `D:/wt-targets/mm2b-e2e`. The overlay adds CDP on 9223 and maps `localhost:5180` to `127.0.0.1:5400`.
  - The build took 26 min 28 s, inside a shared hold.
  - Phase B changes nothing under `src-tauri`, the kernel, the engine or protocol (Amendment 7 item 2(a)). `git diff --stat 1de68a61 e4940dbe` over those paths and the package files is empty, so the one exe serves both heads.
- **App.** Vite ran by hand on 127.0.0.1:5400 with `--strictPort`. The npx shim stood in for `tauri dev`, on PATH for these runs only. The app was stopped by PID after each suite.
- **Machine.** The runs used two shared holds, both granted and released, with no exit code from 96 to 99:
  - one for the regression suite;
  - one for the three stage 4 suites, run one after another.

## Runs

| Head | Suite | Start, end (Z) | Exit | Rows |
|---|---|---|---|---|
| 1de68a61 (stage 3) | `e2e/regression.mjs` | 07:17:53, 07:22:59 | 0 | 17 PASS, 1 INFO (NET': no response of 400 or more observed), 0 FAIL |
| e4940dbe (stage 4) | `e2e/layout.mjs` | 07:24:57, 07:25:50 | 0 | 12 PASS (BURST recorded, not asserted), 0 FAIL |
| e4940dbe | `e2e/console.mjs` | 07:25:55, 07:31:57 | 0 | 11 PASS, 0 FAIL |
| e4940dbe | `e2e/style.mjs` | 07:32:06, 07:32:14 | 0 | 6 PASS, 0 FAIL |

- Each suite prints a row once as it runs and once in its summary. The counts above are of distinct rows.
- **Why these suites.**
  - The regression suite is stage 3's recommendation: it exercises the changed shared canvas paths (the cursor, `render()`, `fitToExtent` and the resize handling).
  - Layout is stage 4's required suite, and console and style are its recommended ones.
- **No selection step ran.** Neither head has App passing the new props, so neither head has any. Those steps come with stage 5.

## The fixtures

- **The runner's own before-and-after hashes recorded nothing,** a mistake of mine. Its glob named `e2e/fixtures/`, but the suites read `C:\dev\spatial-ide\target\fixtures\manual-walkthrough\`. The four comparison files are empty, so they prove nothing. The runner is fixed for later runs.
- **The evidence instead:**
  - Layout's own FIXTURES row hashes `filter-zoned.parquet` (92ed800c…) and `100k-happy-path.parquet` (fd0c74ab…) before and after its run, and records them equal.
  - After all four runs, every fixture in that folder has a modification time before 2026-10-12 (the latest is 2026-10-09T17:27Z).
  - Every fixture that the CRS piece's record (`state/consults/2026-10-12-shell-crs-form-for-format-default-contradicted-e2e-custodian-run.md`) hashed still has the same sha256.

## Not claimed

- Nothing about performance.
- No mutation of an e2e step was observed: these suites are unedited base suites.
- The stage 5 and later e2e steps, and their mutations, are for later runs.
