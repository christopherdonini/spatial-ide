*Filed by the custodian: the CI piece's probe worker (ADV-2026-11-21-13 item 3 (c)), the hand-back of the worker (claude-sonnet-5-5), 7435 bytes, sha256 f69a717c13b75f157c448bcf464266e29c8454e3451356576fdc35c49c09e7cf, below the rule, nothing masked by the custodian. Its calls in the transcript, by unique call ids: Bash 65, Write 3, SubagentHandback 1; errored: 1 (Bash). Read by the custodian: cut/ci-windows-duckdb-probe at 157c2878, the head and the remote branch equal, the porcelain empty, two commits on 5aa0cb67, the three workflows alone; at each probe commit three runs, all completed with success; the six Windows jobs passed, each on the label the report gives, every cache step of theirs skipped; the installer's size and digest equal to the release's asset listing, read at 2026-11-21T12:09:37Z. The branch is never merged.*

---

Probed: both work. Each probe took all three Windows jobs to green, the Rust cache step skipped, libduckdb-sys compiled.
Result: the pinned image label `windows-2022` and LLVM 23.1.6 from the LLVM project's own release both built DuckDB without STL1000 and passed all three Windows jobs. I do not choose between them.

START STATE
- H0 5aa0cb67591431ebdaa41d4a2bd447c16b76f008, branch cut/ci-windows-duckdb-probe, `git status --porcelain` empty, ls-remote returned the same id.
- End: HEAD = remote = 157c2878f6783ac0cd764d1418e061841bf276df, porcelain empty. No background process of mine is running (both wait loops ended on their own). No PR opened, no cache touched, no re-run or cancel.

FACTS (read via curl or gh api on 2026-11-21)
- Image behind windows-latest, read 10:59Z: https://raw.githubusercontent.com/actions/runner-images/main/README.md lists `windows-latest`, `windows-2025` or `windows-2025-vs2026` as Windows Server 2025, VS 2026. The probe-1 log of run 44882775628, read about 11:00Z, shows `Image: windows-2025-vs2026`, `Version: 20261116.315.1`.
- Its readme (Windows2025-VS2026-Readme.md, read 10:59Z): VS Enterprise 2026 18.12.12405.243, LLVM 20.1.8. MSVC toolset folders seen in my probe 2 log: 14.29.30133, 14.44.35207 and 14.52.37025 under `...\Visual Studio\18\Enterprise\VC\Tools\MSVC`. The readme does not state Visual Studio's own Clang version.
- Labels documented in the same README: `windows-2025-vs2026` (also `windows-latest`, `windows-2025`), `windows-2022`, and the arm64 `windows-11-arm` / `windows-11-vs2026-arm`.
- windows-2022 readme (Windows2022-Readme.md, 10:59Z): image 20261116.370.1, VS Enterprise 2022 17.14.37906.3, LLVM 20.1.8. The readme gives no MSVC toolset number or Visual Studio Clang version.
- Why I chose windows-2022 (an expectation, tested by probe 1): it has the older VS 2022 headers, which should accept the image's own Clang 20.1.8.
- LLVM releases (api.github.com/repos/llvm/llvm-project/releases, 11:00Z): newest stable is llvmorg-23.1.6 (2026-11-17); newest 22.x is 22.1.8.
- LLVM 23.1.6 Windows x64 installer: `LLVM-23.1.6-win64.msi`, 639686385 bytes, sha256 81f7eb520ca698eb2d5cd8bc4b8f24f7add9ed66ed40a6f722a6e6f060737c00. That sha256 is the release asset's `digest` field; the release notes themselves give no checksum (cip-body23 grep found none). URL: https://github.com/llvm/llvm-project/releases/download/llvmorg-23.1.6/LLVM-23.1.6-win64.msi
- LLVM 22.1.8 (not probed): `LLVM-22.1.8-win64.exe`, 455545840 bytes, sha256 16e5709785fef73c854646241c4a92c5cd574318d1b33c63330dd7721903e55c (asset digest), with a `.sig` file.
- Chocolatey `llvm` (https://community.chocolatey.org/packages/llvm, read 11:00Z): its page shows 23.1.3 as current and lists 22.1.8; 23.1.6 is not offered.

PROBES (diffs are `git diff` against each parent; push output below)
- Probe 1, commit a8f79cab2242bd19332672dcf322420ae8f565e8. Push: `5aa0cb67..a8f79cab  cut/ci-windows-duckdb-probe -> cut/ci-windows-duckdb-probe`, 11:02Z.
  - Diff (3 files, +25/-3): in shell and tauri-build, `runs-on: windows-latest` becomes `windows-2022`.
  - In rust, the Windows matrix `os` becomes `windows-2022` and the cache step carries `if: ${{ runner.os != 'Windows' }}`. In the other two the cache step carries `if: false`.
  - Each Windows job gets one probe step (pwsh) printing `clang-cl --version` and `Get-ChildItem "...Visual Studio\*\*\VC\Tools\MSVC"`.
- Probe 2, commit 157c2878f6783ac0cd764d1418e061841bf276df. Push: `a8f79cab..157c2878  ...`, 11:30Z.
  - Diff (3 files, +55/-6): `runs-on` back as at H0 (the Windows matrix `os` is `windows-latest` again). A new step, before the probe step, downloads `LLVM-23.1.6-win64.msi` with Invoke-WebRequest, compares the sha256 to the written value and throws on a mismatch, runs `msiexec /i ... /qn /norestart INSTALLDIR=C:\LLVM23`, then adds the bin folder to GITHUB_PATH. The rust copy carries `if: runner.os == 'Windows'`.
  - Departure: the probe step's glob gains `\*` so the toolset subfolders are listed.
  - INSTALLDIR was ignored: clang-cl then reported `InstalledDir: C:\Program Files\LLVM\bin`. My fallback to that folder took effect, so the msi replaced LLVM 20.1.8 in place.
- Each push started the shell and Rust workflows (3 runs each, with Ported notices). tauri-build.yml ran as a job of the shell run.
- Probe 1 runs: shell 44897151725, Rust 44897151927 (both success). Probe 2 runs: shell 44899421600, Rust 44899421591 (both success).

WHAT EACH WINDOWS JOB SHOWED
Every job's rust-cache step shows `skipped` in the job's steps (API, conclusion `skipped`).

| probe | job | job id | result | duration | Clang | libduckdb-sys compile line | stopped? |
|---|---|---|---|---|---|---|---|
| 1 | shell | 136825148407 | success | 11:02:19-11:27:26 (25m07s) | 20.1.8, InstalledDir C:\Program Files\LLVM\bin | "Compiling libduckdb-sys v1.10505.0" 11:07:41 | no, built |
| 1 | rust Windows | 136825149219 | success | 11:02:19-11:28:43 (26m24s) | 20.1.8 | Compiling 11:04:01; "Finished dev profile ... in 12m..." 11:14:53 | no, built |
| 1 | tauri-build | 136825148130 | success | 11:02:19-11:14:57 (12m38s) | 20.1.8 | Compiling 11:05:59 | no, built |
| 2 | shell | 136832000329 | success | 11:30:29-11:58:30 (28m01s) | 23.1.6 | Compiling 11:37:11 | no, built |
| 2 | rust Windows | 136832000307 | success | 11:30:29-12:02:37 (32m08s) | 23.1.6 | Compiling 11:32:57; "Finished dev profile ... in 14m..." 11:45:50 | no, built |
| 2 | tauri-build | 136832000706 | success | 11:30:28-11:48:14 (17m46s) | 23.1.6 | Compiling 11:36:18 | no, built |

- Image: probe 1 ran on `Image: windows-2022`, version 20261116.370.1. Probe 2 ran on `windows-2025-vs2026`, 20261116.315.1.
- LLVM install step in probe 2: 36 to 47 s per job.
- No STL1000 or other error line in any of the six Windows jobs (grep for STL1000 on both logs came back empty).
- Probe 1's MSVC listing stopped at the parent folder (`C:\Program Files\Microsoft Visual Studio\2022\Enterprise\VC\Tools\MSVC`), because my glob stopped one level short. The windows-2022 toolset folders were therefore not printed.
- In probe 2 the folders are 14.29.30133, 14.44.35207 and 14.52.37025 under Visual Studio\18.

TRIGGERS (workflow files at H0)
- product-ci-shell.yml: push and pull_request with path filters, and workflow_dispatch. Its path filter lists `.github/workflows/product-ci-shell.yml` and `tauri-build.yml`.
- product-ci-rust.yml: push, pull_request (path-filtered) and workflow_dispatch.
- tauri-build.yml: `workflow_call` only. It is called by the `tauri-build` job of product-ci-shell.yml, and by a job of release-artifacts.yml (a `v*` tag push, or workflow_dispatch).

TIME WITHOUT THE CACHE
- windows-2022: shell 25m07s, Rust Windows 26m24s, tauri 12m38s.
- windows-latest plus LLVM 23.1.6: shell 28m01s, Rust Windows 32m08s, tauri 17m46s.
- Timeouts at H0 are 60 min (shell, tauri) and 90 min (Rust); none came close.

DEPARTURES
- The probe-step glob differs between the probes, as above.
- My first commit message was first written with printf to `<S>`/cip-msg1.txt (unused); the committed message file, cip-commit1.txt, was made with the Write tool.
- I chose 23.1.6 (the newest stable, as the brief says) rather than 22.1.8, and the .msi rather than an .exe, because 23.1.6 ships only an .msi. The 22.1.8 .exe was not probed.
- Not done: no other workflow, config file or `.claude/` was touched.

Model: Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff.
