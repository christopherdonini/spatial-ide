*Filed by the custodian: the CI piece's fix worker (ADV-2026-11-21-18 items 2 to 4), the hand-back of the worker (claude-sonnet-5-5), 5514 bytes, sha256 56e3b91811c6d79a9a1e87f13d926fd373f3d09b3a7223b0c0982e1d28422e36, below the rule, nothing masked by the custodian. Its calls in the transcript, by unique call ids: Read 1, Bash 45, Write 3, Monitor 1, SubagentHandback 1; errored: 2 (Monitor, Bash), from 2026-11-21T13:09:13Z to 2026-11-21T14:11:28Z. Read by the custodian: the branch at 0ce16549, the head and the remote branch equal, the porcelain empty; the three commits over e2b2f572; the fix's tree equal to the head's; at 96a7c36c three runs, all success; at 0ce16549 the shell run failed and the Rust workspace run passed.*

---

Built: the CI fix at 0ce16549d65c6ef510bdfc905a541f504d8fd082 (R). Result: STOP. At R the shell job and the tauri build job failed with a Rust cache restored. That is the brief's stop, so I changed and re-ran nothing and deleted no cache. The failure is a link error (LNK2019), not STL1000.

Start state: HEAD was e2b2f572c5ad3ee07a2a99924caf10a2e9caccc0 on cut/ci-windows-duckdb-compiles, porcelain empty, ls-remote empty. The ruling copy's sha256 was 55eb5e6fb6ff57ec24b10211f360d9b3d8b7ce0405c0c2844bab6900ebb5f853, as the brief gave.

Commits and pushes:
- F: 132a0a7e057497f661182571e4321e8fe68fd901, `fix: the Windows jobs run on windows-2022, so DuckDB compiles with the image's own Clang (ADV-2026-11-21-18)`.
- E: 96a7c36cc04169636746db22934ffa73da359a3f, `chore: evidence, the Rust cache off and a step printing clang-cl and the MSVC toolsets in the Windows jobs (undone by the next commit)`.
- R: 0ce16549d65c6ef510bdfc905a541f504d8fd082, `chore: the evidence commit undone exactly, the cache step back and the print step gone`. Made with `git revert --no-commit 96a7c36c`.
- Push 1 (F and E together, rc=0) created the remote branch. Push 2 (R, rc=0) printed `96a7c36c..0ce16549`. Runs started within 90 s of push 1. No pull request was opened.

F's numstat against H0: product-ci-rust.yml 4/2, product-ci-shell.yml 5/3, tauri-build.yml 3/1. That is 12 added and 6 deleted, 18 changed lines.
- Each of the three runner lines has the approval comment above it, and the label is windows-2022.
- The rust Windows entry has a job_name comment above job_name, which is unchanged.
- The shell and tauri-build cache keys are unchanged, each with a "key keeps its old name" comment above it.

Corrected sentences (my locator list was right):
- product-ci-shell.yml:14: the heading "Why windows-latest, unlike the viewer's ubuntu-latest" now reads "Why windows-2022, unlike …".
- product-ci-shell.yml:20: "the Rust half still needs windows-latest" now reads "… windows-2022".
- product-ci-rust.yml:38: "windows-latest is the reference profile in CLAUDE.md" now reads "windows-2022 is …".

Left as past records:
- product-ci-rust.yml:65 (the cancelled-runs table row) and :90 (the first green run).
- product-ci-rust.yml:202, the kept job_name, which still reads (windows-latest).
- The two cache-key strings.

Tree check: `git rev-parse F^{tree} R^{tree}` printed 8c93118408b9ac6fb9c8c750e78cdbd280b7ab83 for both. `git diff --quiet F R` exited 0.

E table (shell run 44907618426, rust run 44907618403; both runs and Ported notices succeeded). All three Windows jobs passed, with image line `Image: windows-2022` (version 20261116.370.1), the cache step `skipped`, and an STL1000 count of 0 (Python script over the saved log, rc=0).

| Job | Job id | Duration | Compile line (Compiling libduckdb-sys v1.10505.0) |
|---|---|---|---|
| shell | 136856453337 | 18m09s | log line 12710 |
| tauri build | 136856453581 | 20m14s | log line 1193 |
| rust Windows | 136856453430 | 29m51s | log line 683 |

- All three printed `clang version 20.1.8`, target x86_64-pc-windows-msvc, InstalledDir C:\Program Files\LLVM\bin.
- All three listed two toolsets under C:\Program Files\Microsoft Visual Studio\2022\Enterprise\VC\Tools\MSVC: 14.29.30133 and 14.44.35207.
- The Ubuntu entry (136856453715) and the macOS entry (136856453638) both passed with their cache steps run. The print step was skipped on them.

R table (shell run 44910484312, rust run 44910484322; Ported notices passed). The image line was windows-2022 in all three.

| Job | Job id | Result | Duration | Cache lines |
|---|---|---|---|---|
| shell | 136865039000 | failure | 273s | `Cache hit for: v0-rust-windows-latest-shell-shell-Windows_NT-x64-ea627442-f459d22b`, `Cache restored successfully`, 1065 MB, `full match: true` |
| tauri build | 136865039102 | failure | 169s | `Cache hit for: v0-rust-windows-latest-shell-tauri-build-build-Windows_NT-x64-ea627442-f459d22b`, `Cache restored successfully`, 644 MB, `full match: true` |
| rust Windows | 136865039290 | success | 1093s | `No cache found.` for key windows-2022-workspace; the step saved a cache afterwards |

- The Ubuntu entry (136865039398) and the macOS entry (136865039133) passed at R.
- Both failures are `error: linking with link.exe failed: exit code: 1120`, with LNK2019 on `__std_find_first_not_of_trivial_pos_1`, `__std_rotate`, `__std_unique_1` and `__std_max_element_8u`. The unresolved symbols are in the restored libduckdb_sys rlib.
- The linker was MSVC\14.44.35207\bin\HostX64\x64\link.exe. The job process exited with code 1.
- The STL1000 count in both failed logs is 0.
- My reading, not checked further: the cache was built on the other image, so its libduckdb_sys objects reference STL symbols the 14.44.35207 toolset's libs do not resolve. The advisor decides what follows.

Departures from the brief:
- The harness moved several foreground waits to the background after 180 s.
- The wait script was my own bounded loop and has finished. I started no other process and killed none.
- The mid-run task notifications carried no instruction.

Model: claude-sonnet-5-5 (Sonnet 5.5) as the harness gives it. No override and no context handoff.

Files: C:/dev/wt/ci-fix/.github/workflows/product-ci-shell.yml, product-ci-rust.yml and tauri-build.yml. The logs and job JSONs are in the scratchpad as cif-logE-*, cif-logR-*, cif-jobsE-* and cif-jobsR-*.

State left: `git status --porcelain` is empty. Local HEAD and origin/cut/ci-windows-duckdb-compiles are both 0ce16549.
