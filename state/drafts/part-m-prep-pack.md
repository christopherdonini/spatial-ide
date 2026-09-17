> **Status: draft — the Part M prep pack of 2026-09-09 for the human's sitting; superseded by the felt verdicts recorded in `DECISIONS-PENDING.md`.**
> Record, not policy — moved from the untracked `RELEASE-DRAFTS-0.1.0/` directory on the human's round-14 ruling (2026-09-17); nothing here binds, and its cites are historical (advisory in `verify-cites`, never gated).

# Part M prep pack — the v0.1.0 candidate on a clean profile

*Prepared by the custodian on 2026-09-09 during the away window, for the human's sitting. Every fact
below was read from a file, a build log or a tool's output on this machine; nothing was run with a
GUI. The rows themselves are `frontends/shell/MANUAL-WALKTHROUGH.md` Part M (M1–M13); this pack is
what to have on the desk beside them. Byte counts only — no timing anywhere.*

## 1. The artifact

| | |
|---|---|
| Installer | `C:\dev\spatial-ide\frontends\shell\src-tauri\target\release\bundle\nsis\Spatial IDE_0.1.0_x64-setup.exe` |
| Built from | `main` @ `998be05` (the #39 merge — every release PR in), 2026-09-09, `npm run tauri build`, build-only (never launched by the custodian) |
| Size | 10,559,184 bytes |
| SHA-256 | `712b30632e2c27078686f13defd1fe5462e723dbd4d9124fc010d6958b6aa45a` (sha256sum and `Get-FileHash` agree) |
| Signature | `NotSigned` (`Get-AuthenticodeSignature`) — Windows will say so; KNOWN-LIMITATIONS entry 14 |
| Executable inside | `spatial-ide-shell.exe`, 44,363,776 bytes; installs per-user (`RequestExecutionLevel user`, `$INSTDIR = $LOCALAPPDATA\Spatial IDE` — `installer.nsi:104`, `:504`) |
| What it packages | the executable, `spatial_ide_shell_lib.dll`, `NOTICE.txt`, the `bundle-viewer\` directory (the published viewer's `dist/`, its own `NOTICE.txt` included), the uninstaller. **No** `publish-bundle.exe` or `slice-host.exe` (both sit beside the exe in `target/release/` but the NSIS script's `File` lines do not include them — M9's "the installer ships no CLI" holds) |
| Uninstaller | also removes `$LOCALAPPDATA\dev.spatialide.shell` (the WebView2 data + session logs) — `installer.nsi:844`; the audit log under `%LOCALAPPDATA%\spatial-ide\` is NOT removed |

**Before M1:** re-hash the file you are about to run and compare to the value above. If they differ, stop — the pack describes a different build.

## 2. M3 pre-filled — the three notice files on this build

| File | Bytes | Lines | sha256 (first 12) |
|---|---|---|---|
| `NOTICE.txt` beside the executable (`target/release/NOTICE.txt` → installed beside `spatial-ide-shell.exe`) | 3,186,905 | 62,081 | `6eb80fd3bb4b` |
| the in-app **Notices** view (`src/generated/NOTICE.txt`, `?raw`) | 3,186,905 | 62,081 | `6eb80fd3bb4b` — byte-identical to the file beside the executable (`cmp` clean) |
| `bundle-viewer\NOTICE.txt` | 163,998 | 3,325 | `826e55d1f585` |

The application notice's sha256 equals the one the entry-62 reviewer reproduced on the piece's head (`6eb80fd3…cee6`), so **every line anchor M3 quotes holds unchanged**: header line 23; IOGP acknowledgement line 721 (wrapped onto 722); the AGPL §6(d) route line 743; VIEWER section 751; PACKAGED FRONTEND 3,338; RUST CRATES 5,000; DUCKDB'S BUNDLED THIRD-PARTY SOURCES 59,854 with **26** entry lines; END sentinel 62,081 = the last line. Forbidden strings (`license texts are NOT carried`, `This gap is tracked`, `*** BOOTSTRAP PASS`): 0 occurrences (grepped on the built file). The viewer notice's pointer sentence ("The application-wide notice set -- covering this viewer, the packaged frontend's own npm dependencies, the Rust crates …, and the third-party works inside DuckDB's own amalgamated C/C++ source tree -- is the separate NOTICE.txt installed beside the executable") is wrapped across lines in the file; read it across the wrap.

**M3's one declared observation** stays the human's: the ▸ Notices disclosure must expand and paint a ~3.2 MB string on the installed artifact.

## 3. What this machine has that a stranger's may not — and what M1/M2 can and cannot observe

A clean **profile** on this machine tests per-user state. It does **not** test machine-wide runtimes; those are shared by every account. Each row below says which.

| Dependency | On this machine | Scope | What Part M observes | What it cannot |
|---|---|---|---|---|
| **Microsoft WebView2 Evergreen runtime** | present, `pv 152.0.4191.66` (`HKLM\SOFTWARE\WOW6432Node\Microsoft\EdgeUpdate\Clients\{F3017226-…}`); no per-user key | machine-wide | M2: the window opens without any WebView2 download — expected here | the installer's `downloadBootstrapper` branch (Tauri's NSIS default; KNOWN-LIMITATIONS 14, the only install-time network access) is **not exercised** on this machine. Record it as not observed. |
| **Visual C++ 2015–2022 redistributable (x64)** — the executable imports `MSVCP140.dll` dynamically (`dumpbin /DEPENDENTS` on the v0.1.0 exe), plus the `api-ms-win-crt-*` UCRT forwarders (UCRT ships with Windows 10) | `msvcp140.dll` / `vcruntime140.dll` / `vcruntime140_1.dll` present in `System32`, 14.50.35719.0 | machine-wide | M2: the app starts — expected here | a machine without the redistributable would fail at process start ("MSVCP140.dll was not found"). The installer does not bundle it. **DECISIONS-PENDING entry 69** (declare / static CRT / bundle) — the human's ruling decides what KNOWN-LIMITATIONS and QUICKSTART say. Record in M1/M2: "VC++ redistributable dependency not exercised". |
| **DuckDB extensions** | `~/.duckdb` exists here (6 files; unrelated to the app) | per-user | M4 on the clean profile: the fixture opens with no `~/.duckdb` present and no network — DuckDB is compiled in with `bundled`, `parquet`, `json` statically (`engine/Cargo.toml:32`); no `autoload`/`autoinstall`/`extension_directory` setting exists anywhere in the tree (grepped) | nothing further — the clean profile is the right test for this one |
| **WebView2 user data + session logs** `%LOCALAPPDATA%\dev.spatialide.shell\` | present here (7,547 files) | per-user | M2/M12: a fresh profile creates it on first launch; the session log `logs\session-*.log` appears there (M12's pinned-origin line pair) | — |
| **Audit log** `%LOCALAPPDATA%\spatial-ide\audit\publish.jsonl` | present here (1 file) | per-user | M8/M9: created by the clean profile's first publish; read as M9 says (route (b): `SPATIAL_IDE_AUDIT_LOG` set to the clean profile's absolute path from your own account) | — |
| **Fixtures** (`target/fixtures/…`, `100k-happy-path.parquet`, `polygons-100k.parquet`, `parcels-5gb.parquet`) | in the dev checkout under your own account | per-user file permissions | the clean profile must be able to READ them: copy the three fixtures to a folder the clean account can read (e.g. `C:\Users\Public\spatial-ide-fixtures\`) before M4 | — |
| **The dev checkout** (for M9's `--audit-show`, M11's `serve-bundle.mjs`, M12 modes 1–2, M13's `tauri build --no-bundle`) | your account | per-user | run those from your own account, as the rows already say | — |

**One-line summary for M1's record:** "Installed as `<clean-account>` on the custodian's machine: WebView2 152.0.4191.66 and the VC++ 14.50 runtime were already present machine-wide, so neither the bootstrapper branch nor the redistributable dependency was exercised (entry 69)."

## 4. The clean-profile procedure (PowerShell, from an elevated prompt in YOUR account)

Creates a throwaway local standard user, then removes it and its profile afterwards. `Read-Host -AsSecureString` prompts you for the password interactively — type it at the sitting; nothing is stored in this file.

```powershell
# 1. create the account (standard user, not admin)
$name = "sidewalk"
$pw = Read-Host -AsSecureString "password for $name"
New-LocalUser -Name $name -Password $pw -PasswordNeverExpires -AccountNeverExpires -Description "Spatial IDE Part M clean profile (throwaway)"   # <= 48 characters (New-LocalUser refuses longer)
Add-LocalGroupMember -Group "Users" -Member $name
Get-LocalUser $name | Format-List Name, Enabled, PasswordRequired

# 2. stage the fixtures somewhere the clean account can read
New-Item -ItemType Directory -Force "C:\Users\Public\spatial-ide-fixtures" | Out-Null
Copy-Item "C:\dev\spatial-ide\target\fixtures\manual-walkthrough\100k-happy-path.parquet" "C:\Users\Public\spatial-ide-fixtures\"     # M4/M8
Copy-Item "C:\dev\spatial-ide\target\fixtures\slice-budgets\polygons-100k.parquet" "C:\Users\Public\spatial-ide-fixtures\"   # M7 (regenerate per Part K if absent)
Copy-Item "C:\dev\spatial-ide\target\slice-evidence\scale-pass\parcels-5gb.parquet" "C:\Users\Public\spatial-ide-fixtures\"                                  # M10 (Part H's fixture, 5,004,376,705 bytes, the walkthrough's own path — a copy takes a while; granting the clean account read access to that folder is the alternative)
# SITTING 1 ONLY (the candidate, 998be05) -- for sitting 3 use s6c's RC2 line instead:
# Copy-Item "C:\dev\spatial-ide\frontends\shell\src-tauri\target\release\bundle\nsis\Spatial IDE_0.1.0_x64-setup.exe" "C:\Users\Public\spatial-ide-fixtures\"
# Get-FileHash -Algorithm SHA256 "C:\Users\Public\spatial-ide-fixtures\Spatial IDE_0.1.0_x64-setup.exe"   # must print 712b3063…aa45a   (sitting 1; RC2's hash is c3f48320... -- see s6c)

# 3. sign in as the clean account (Windows sign-in screen: switch user), run M1–M8, M10, M12 mode 3, M13 there.
#    M9 / M11 / M12 modes 1–2 run from YOUR account, as the rows say. Record verdicts verbatim in Part M's run section.

# 4. afterwards, from YOUR elevated prompt: read the clean account's audit log if you have not (M9 route (b)),
#    then remove the account AND its profile directory
$prof = Get-CimInstance Win32_UserProfile | Where-Object { $_.LocalPath -like "C:\Users\$name" }
if ($prof) { Remove-CimInstance $prof }     # deletes C:\Users\<name> (must be signed out of that account first)
Remove-LocalUser -Name $name
Remove-Item -Recurse -Force "C:\Users\Public\spatial-ide-fixtures"   # after the sitting; keep until the record is written
```

Fixture paths: `target/fixtures/` is the dev checkout's own evidence directory (kept through the disk clean-up; `target/debug` was removed and is regenerable). If `polygons-100k.parquet` is absent, Part K names its regeneration command; if `parcels-5gb.parquet` was never staged locally, M10 needs Part H's own fixture path.

## 4b. The two sittings (the human's split of 2026-09-10)

Part M runs in two sittings. **Sitting 1 = M1–M4** (install + first open); **Sitting 2 = M5–M13** (filter, style, residency, the four publish rows, the origin equivalence, the deliberate refusal). Each sitting's verdicts are recorded in the walkthrough's "### Part M run" section as they happen, dated per sitting.

| | Sitting 1 (M1–M4) | Sitting 2 (M5–M13) |
|---|---|---|
| Accounts | the clean profile (M1–M4 all run there) | the clean profile for M5–M8, M10, M12 mode 3, M13; YOUR account for M9, M11, M12 modes 1–2 |
| Fixtures to stage first | `100k-happy-path.parquet` only (M4) — the §4 block's first `Copy-Item` | `polygons-100k.parquet` (M7), `parcels-5gb.parquet` (M10, 5 GB — copy or grant read access before the sitting), plus `100k-happy-path.parquet` again for M8 |
| Dev checkout needed | no | yes (M9, M11, M12 modes 1–2, M13's overlay build) |
| What it establishes | the installer runs per-user without UAC (M1); the app starts, no console, no crash (M2); the three notice files, byte counts, anchors, the disclosure paints (M3); a 2056 file opens with its summary and the canvas renders (M4) | everything else, incl. the publish rows re-confirmed on the artifact and the two ADR-020 rows |
| Not exercised on this machine (record, do not infer) | the WebView2 bootstrapper branch; the VC++ redistributable dependency (entry 69) | — |
| Remove the clean account? | **no** — keep it between sittings so sitting 2 does not reinstall; M1's install is the same artifact both times | after sitting 2, §4 step 4 |

**The tag and items 4/5/6:** whether sitting 1 alone (install + first open) is enough to finalize README/QUICKSTART and write KNOWN-LIMITATIONS, or the tag waits for sitting 2, is DECISIONS-PENDING entry 74 — the human's.

## 5. Row-by-row reminders (M1–M13 as they stand on `main`)

- **M1** — hash first; note "not exercised: bootstrapper, VC++ redist" (§3). Install per-user; no UAC.
- **M2** — window, title "Spatial IDE", no console, no crash. If the app does **not** start, the first suspect on a truly clean machine is `MSVCP140.dll` — on this machine it cannot be that.
- **M3** — §2's table; the disclosure paints; the three files; the anchors.
- **M4** — EPSG:2056 fixture; the row's "one admitted entry" was corrected to "one of two" (3857 landed with #32).
- **M5–M6** — as written.
- **M7** — the shipped default `medium` grid; either status sentence passes; no red-bordered refusal banner. KNOWN-LIMITATIONS 13b's zoom-far-out behaviour (tiles already drawn may vanish) is an M-sight, not a row: if you go far past "Zoom to layer" you may see it; record what you saw, in your words.
- **M8–M11** — publish rows, entry 53 (a). M9 route (b) from your account with the clean profile's absolute audit path.
- **M12** — mode 3 is the installed build: the session log pair + one admitted `viewport_query`. Modes 1–2 from the dev checkout. *(2026-09-13: mode 2's `npx tauri build --debug --no-bundle` fails with `Access is denied (os error 5)` if the debug executable is still running — close the app before rebuilding, then build again.)*
- **M13** — the deliberate refusal on a release-built executable. **Step (a) first** (the row's own): the config overlay must exist before the build — on 2026-09-13 the custodian wrote it at `frontends/shell/e2e/out/m13-overlay.json` (gitignored; `app.windows[0]` copied from `src-tauri/tauri.conf.json` with `url` set to `https://example.test/`). Then (b) `npx tauri build --no-bundle --config e2e/out/m13-overlay.json` from `frontends/shell`; (c) run `src-tauri/target/release/spatial-ide-shell.exe` directly and read `$LASTEXITCODE` and the newest `%LOCALAPPDATA%/dev.spatialide.shell/logs/session-*.log`. Expected: the "Spatial IDE could not start" dialog, exit code 1, one `error` line naming `WebviewUrl::App`. A hang instead of a dialog is the finding. (2026-09-13: the first attempt ran without step (a) — the file did not exist — so the ordinary build ran and the refusal was never attempted; re-run.)

## 6. What the custodian did NOT do

Did not launch the installer or the app (session locked; build-only). Did not verify the WebView2 bootstrapper path, the VC++ dependency on a machine lacking it, or anything the rows call the operator's. Did not change the build to address entry 69 — that is the human's ruling.

# 6. Sitting 3 — Part M on RC2 (the human's ruling of 2026-09-13; written when RC2 exists)

**RC2** = the installer rebuilt from `release/0.1.0`'s head 13471a9 (998be05 + entry 47 + entries 84/85): `C:/dev/spatial-ide/.claude/worktrees/release-0.1.0/frontends/shell/src-tauri/target/release/bundle/nsis/Spatial IDE_0.1.0_x64-setup.exe`, 10,559,893 B, SHA-256 `c3f483209341409333971b8a1695b60116763f976217d5b50264c7edd16bfb1f`, NotSigned. Its diff from the candidate's build commit, the proof for every "stands" row below:

```
git diff --stat 998be05 13471a9
 frontends/shell/FILTER-84-85-PREREGISTRATION.md    |  58 ++
 frontends/shell/HOVER-REPICK-PREREGISTRATION.md    | 159 ++++
 frontends/shell/MANUAL-WALKTHROUGH.md              |   9 +-
 frontends/shell/RESIDENCY-DEBT-1B.md               |   4 +
 frontends/shell/e2e/checkDistClean.mjs             |   2 +-
 frontends/shell/e2e/regression.mjs                 | 948 ++++++++++++++++++---
 frontends/shell/e2e/residency-harness.mjs          |   4 +-
 frontends/shell/src/App.test.ts                    |   2 +
 frontends/shell/src/canvas/WorkingCanvas.test.ts   | 387 ++++++++-
 frontends/shell/src/canvas/WorkingCanvas.tsx       | 443 +++++++++-
 frontends/shell/src/canvas/hoverRepickConstants.ts |  53 ++
 frontends/shell/src/canvas/pickResolution.test.ts  | 167 +++-
 frontends/shell/src/canvas/pickResolution.ts       | 187 +++-
 frontends/shell/src/canvas/tileResidentSet.test.ts |  84 ++
 frontends/shell/src/diagnostics/renderTrace.ts     |  23 +
 .../src/residency/candidateArmSession.test.ts      | 187 ++++
 .../shell/src/residency/candidateArmSession.ts     |  19 +
 17 files changed, 2559 insertions(+), 177 deletions(-)
```

Every file in that diff is under `frontends/shell/` (the three shell fixes, their tests, their preregistrations and the walkthrough rows). No engine, kernel, protocol or bundle-viewer file changed, so no row whose code path lies there can have changed.

## 6a. Rows that re-run on RC2 (their code path is in the diff)

| Row | Why it re-runs | What to record |
|---|---|---|
| **M1** | the artifact changed: new hash | RC2's filename, size, SHA-256 as `Get-FileHash` prints them; NotSigned |
| **M2** | install of the new artifact | as the row says |
| **M5 + zoom-to-layer** | entry 85 (Zoom to layer under a filter) and entry 84 (the status under a filter) | filter `id < 100`, Zoom to layer, wheel out, Zoom to layer again: the camera returns to the fit; the status line reads the within-budget sentence, not "Filling has finished…"; record both sentences verbatim |
| **the hover row (L7/L8 as updated by entry 47)** | entry 47 | hover an id, zoom out one notch with the mouse still: the id stays; then Part L's L8 gesture; record the readout verbatim |
| **M7** | the residency status path is touched by entry 84's terminal marking | as the row says — either sentence passes; no banner |
| **M12 mode 3** | the packaged executable changed | as the row says |
| **M3, M4** (added by the criterion — your list omitted them) | the first open fits the view through `fitToExtent`, whose camera write entry 85 changed (`WorkingCanvas.tsx`); the first-look batch path is untouched | as the rows say — open `100k-happy-path.parquet`, the initial fit renders; a cheap re-run |
| **the new 84/85 rows** | added to Part M by the fix piece | as their rows say |

## 6b. Rows that stand from 998be05 (their code path is not in the diff)

M6 (style — `frontends/shell/src/style/*` untouched), M8, M9, M10, M11 (publish, audit, the bundle viewer — `kernel/src/publish/*`, `renderer/bundle-viewer/*` untouched), M12 modes 1–2 (the dev checkout's own build, unchanged in what they verify), M13 (the ADR-020 refusal path in `src-tauri`, untouched). Each stands with the diff-stat above cited as the reason.

## 6c. Before the sitting

- Close any running Spatial IDE before installing RC2 (M12 mode 2's lesson).
- The clean account "sidewalk" is kept between sittings; uninstall the candidate there first (M2's own step), then install RC2.
- Fixtures unchanged from sitting 2. The installer changes — copy RC2 (not the candidate) into the shared folder and check its hash:

```powershell
Copy-Item "C:\dev\spatial-ide\.claude\worktrees\release-0.1.0\frontends\shell\src-tauri\target\release\bundle\nsis\Spatial IDE_0.1.0_x64-setup.exe" "C:\Users\Public\spatial-ide-fixtures\" -Force
Get-FileHash -Algorithm SHA256 "C:\Users\Public\spatial-ide-fixtures\Spatial IDE_0.1.0_x64-setup.exe"   # must print c3f483209341409333971b8a1695b60116763f976217d5b50264c7edd16bfb1f
```

(The §2 line that copies the candidate from the main checkout's `target` is sitting 1's; for sitting 3 the source is the release worktree above.)

## 6d. First, prove which executable is installed (added 2026-09-13 after sitting 3's first pass)

Sitting 3's first pass showed both fixes absent at once, which is what the candidate looks like. Before any row, on the clean account:

```powershell
Get-FileHash -Algorithm SHA256 "C:\Users\Public\spatial-ide-fixtures\Spatial IDE_0.1.0_x64-setup.exe"
(Get-Item "$env:LOCALAPPDATA\Spatial IDE\spatial-ide-shell.exe").Length
```

| | Candidate (998be05) | RC2 (13471a9) |
|---|---|---|
| installer SHA-256 begins | `712b3063` | `c3f48320` |
| installed `spatial-ide-shell.exe` bytes | 44,363,776 | 44,365,824 |

If the candidate: copy RC2 with §6c's line (its source is the release worktree, not the main checkout), run that installer on the clean account, then redo M5, the hover row, M7 and M12 mode 3. The §2 copy line above is sitting 1's and now says so.

## 6e. The rows M14 and M15, in full (they live on `release/0.1.0`'s `MANUAL-WALKTHROUGH.md` after M13; main's copy does not have them until the merge-back)

**M14 — "Zoom to layer" under a row filter (entry 85).** Open `100k-happy-path.parquet` (M4's own dataset). In the filter panel apply `id < 100` (Part E's E2). Click **Zoom to layer** — the filtered features fill the view. Wheel out several notches, then click **Zoom to layer** again. **Expected:** the second click returns the camera to the filtered fit exactly as the first did. A second click that leaves the view where it was is the finding (sitting 2's M5 (c), fixed on RC2 by entry 85: the fit's camera write is no longer ignored when it equals the previous one). Record what the second click did, in words.

**M15 — the residency status under a row filter (entries 84 and 87).** With M14's filter still applied and the view fitted, wheel out several notches and wait for the status line to settle. **Record the sentence verbatim.** Entry 84 (fixed on RC2) makes a tile that returns no rows under the filter count as loaded; entry 87 (open at this writing) is a second cause of the same sentence — filtered per-tile queries dropped before any stream is issued — so on RC2 the settled-partial sentence (*"Filling has finished for this view — some areas were not loaded; pan or zoom to load them."*) may still appear here. If it does, that is entry 87's finding, not a regression of entry 84 (whose fix is pinned at the unit level); if the within-budget sentence (*"Showing all `<N>` features in view"*) appears instead, record that. Either outcome is recorded, not judged, by this row.
