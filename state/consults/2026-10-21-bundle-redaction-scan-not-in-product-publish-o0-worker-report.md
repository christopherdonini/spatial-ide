*Custodian's filing note (2026-10-21): O0 of the redaction scan's form, by a worker-high in `C:/dev/wt/rds` at B ed2024c2401500c26d7a2bf2944f995dd43f04e8. The run 2026-10-21T13:15:29Z to 13:54:11Z by its transcript (Read 13, Bash 19, Grep 3, Write 1, Edit 1). Its one Write and one Edit were the scratch test `kernel/tests/o0_scratch.rs`, deleted after the run, and the worktree was clean at B afterwards. Its report agrees with its run log on the eight findings and the three outside `operator-declared`. Extracted by script from its SubagentHandback call, with nothing changed except one final newline. Its sha256, from line 5 to the end, is d8cd9c4898ab6857b62bc1d9e4f3c3ff68b89774a9d248f0c1ac59d89e9d46cc.*

---

O0: bundle-redaction-scan-not-in-product-publish at B ed2024c2401500c26d7a2bf2944f995dd43f04e8, worker-high
Result: STOP, findings outside operator-declared

The scan found 3 findings that are not `operator-declared`. They are 1 `credential` and 2 `local-filesystem-path`, all in viewer assets. P-3 is falsified at B. I changed nothing and weakened nothing. I ran with no other declared strings and no other settings. The human rules (§4, O0's paragraph).

**Steps** (worktree C:/dev/wt/rds, branch cut/bundle-redaction-scan, output files in my scratch folder)
1. `git status --porcelain` printed nothing, rc=0. `git rev-parse HEAD` printed ed2024c2401500c26d7a2bf2944f995dd43f04e8, which equals B (rc=0).
2. In renderer/bundle-viewer, `npm ci` gave rc=0 and `npm run build` gave rc=0. The build printed "dist/index.html + dist/app.js + dist/NOTICE.txt + dist-metafile.json". Neither dist/ nor node_modules existed beforehand.
3. I wrote kernel/tests/o0_scratch.rs. It builds the 2,000-feature `CategoricalZone`/`DeclaredLv95`/`NativeUnique` fixture with copies of publish.rs's `fixture`, `pinned`, `request`, `STYLE` and `FIXED_FINISH`. It publishes through `publish_unguarded` with `ViewerAssets::from_dir(renderer/bundle-viewer/dist)`. It then runs the unchanged `redaction::scan_directory` with `from_environment()` and `declared` set to exactly the two strings. The test also asserts the license copies against the shell source lines. The bundle was written to D:/wt-targets/rds/o0-scratch-workspace.
4. Run command, inside a shared hold, with `CARGO_TARGET_DIR=D:/wt-targets/rds CARGO_BUILD_JOBS=8 RUST_TEST_THREADS=8`:
   `cargo test -p spatial-kernel --test o0_scratch -- --nocapture`
   - Attempt 1 used `timeout 570` inside the call and ended rc=124 while compiling libduckdb-sys. I killed nothing myself.
   - Attempt 2 used `timeout 3000` inside the call, because a kill during the libduckdb-sys build script discards that build. The harness moved the call to the background after its 590s timeout. It finished with rc=0: build 17m 25s, then "1 passed; 0 failed", test time 7.53s. The test printed every finding and did not assert on the O0 result, so the STOP verdict is mine, read from the printed findings.
5. I deleted kernel/tests/o0_scratch.rs (rm rc=0, and ls confirms it is gone). `git status --porcelain` printed nothing (rc=0). HEAD is still B. `git status --porcelain --ignored` lists only:
   - `!! renderer/bundle-viewer/dist-metafile.json`
   - `!! renderer/bundle-viewer/dist/`
   - `!! renderer/bundle-viewer/node_modules/`

   The cargo build outputs are under D:/wt-targets/rds, outside the worktree.

**dist/ inventory** (3 files; dist-metafile.json is in renderer/bundle-viewer/, not in dist/)
- NOTICE.txt, 163998 B, sha256 826e55d1f585edef8431791033a6beacd6379dc0615ad749a97a7467ab4805fb
- app.js, 447637 B, sha256 4f4e86c977cb8877fc9c8dbceb6e29b92cc338916c24e7564154c3cb75d0176d
- index.html, 6463 B, sha256 622604f482af8c4551ca406c42fee9298b429d8e2213460effee38ff4d3aa58c

**Bundle emitted** (8 files; sizes equal the dist sizes for the viewer files)
- build-info.json 380 B
- data/part-00000.arrows 880264 B
- data/part-00001.arrows 8776 B
- manifest.json 9367 B
- style.json 326 B
- viewer/NOTICE.txt 163998 B
- viewer/app.js 447637 B
- viewer/index.html 6463 B

**License fields.** The sources are frontends/shell/src-tauri/src/publish.rs line 1578 (copyright) and line 1591 (corresponding-source `at`) at B. The test read both lines with `include_str!` and printed them:
- `        copyright: "Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors".into(),`
- `            at: "https://github.com/christopherdonini/spatial-ide".into(),`

The test printed "copy equals line 1578: true" and "copy equals line 1591: true". It also asserted the other fields against their lines: `program` (1577), `license` (1579), `notice_path` (1580), `corresponding_source: CorrespondingSource {` (1589) and `kind: CorrespondingSourceKind::Url,` (1590).

**Findings** (8 in total, sorted by file and offset; the excerpt hash is sha256 over the excerpt bytes)

| File | Class | Offset | Excerpt length | Excerpt sha256 | Declared string holding it |
|---|---|---|---|---|---|
| manifest.json | operator-declared | 7334 | 59 | 5dfd79be671389f80725570a6b1db8f050e0d245d5fbed98daf870992e128857 | copyright, bytes 7315..7385 |
| manifest.json | operator-declared | 7513 | 59 | 1a6855e76e32213d7ab23e7724fbdcf043cef8869eab697ba649d8a55ff649bb | corresponding-source `at`, bytes 7494..7542 |
| viewer/NOTICE.txt | operator-declared | 1451 | 59 | 887ffa4f0f559b8ecf120e51ec14c6326874e3e5f9a30ae87d81604e46832912 | copyright, bytes 1432..1502 |
| viewer/NOTICE.txt | **credential** | 19092 | 56 | b61e8e47bcbcfa79cd158fc980513e6c748841be72120fd97540729219009b87 | not declared |
| viewer/NOTICE.txt | operator-declared | 38138 | 59 | 2ce3ad5d8c496c859e25ebe282fd406a60c262827540ff60350e9a4dc4694763 | corresponding-source `at`, bytes 38119..38167 |
| viewer/NOTICE.txt | **local-filesystem-path** | 111337 | 54 | 3c357683ccb49c8549f7fd82c60d972b6426e73b73def16f7fdd2bb4c5857f20 | not declared |
| viewer/app.js | **local-filesystem-path** | 7291 | 51 | 2fb2d1cc21d7ec9f47d1755651fe3785c1554ba0869fe3d711e552e1620ee00b | not declared |
| viewer/index.html | operator-declared | 92 | 59 | ee38e21cca594974e632f31b10ac441a66ba59fe3cedf982d2164bf81b2e7346 | copyright, bytes 73..143 |

- Outside `operator-declared`: 3 findings, the bold rows. Each lies in a viewer file copied from `dist/`.
- Five `operator-declared` findings: each is the username (match length 11) wholly inside a declared occurrence. The excerpt lengths and offsets are as in the table. No hostname finding occurred.
- I did not look at the bytes behind the three findings. I only report where they are.

**Positive control** (kept apart from O0's result). I wrote one planted file holding a Windows drive path, with the same bytes as the existing test, and scanned again. The scan reported 10 findings in total.
- `planted.txt`, class `local-filesystem-path`, offset 7, excerpt length 28, sha256 0f2893c0b90a0f6f15bce5130aef6eb4751587ee880b78a509a37b0aa60c7505.
- `planted.txt`, class `credential`, offset 14, excerpt length 28, same sha256 (the planted file's name contains a credential needle).
- The findings in the other files were equal to O0's eight: "CONTROL other files' findings equal O0's: true".

**Identifier counts** from `from_environment()`: usernames=1, hostnames=1, declared=2. No names were printed.

**Tool versions**
- node v24.18.1
- npm 11.16.0
- cargo 1.97.1 (c980f4866 2026-06-30)
- rustc 1.97.1 (8bab26f4f 2026-07-14)

**Hold lines** (my project only, from the task output files)
- Attempt 1: `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:28632 also=bash.exe:48132 (commands started from now on inherit it; release when done)`, then `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:28632 affinity=FF (cores 0-7)`.
- Attempt 2: `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:12512 also=bash.exe:15752 (commands started from now on inherit it; release when done)`, then `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:12512 affinity=FF (cores 0-7)`.
- Both holds were granted and released. No exit code from 96 to 99 occurred.

**Processes.** A CIM query for cargo, o0_scratch, the rds target path and machine.ps1 found no process I started still running. It listed only the shells that ran the query. The scratch files are in the scratchpad folder: o0-run2.log (the result), o0-run.log (attempt 1), npm-ci.log, npm-build.log and dist-files.txt.
