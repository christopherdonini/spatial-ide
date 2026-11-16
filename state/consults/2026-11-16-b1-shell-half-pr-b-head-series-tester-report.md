# b1-shell-half PR B (PR 327): the tester's head series at 6f7e744c, with the six colour mutations (the form's Amendment 24); the tester's report

*Custodian's filing note (2026-11-16): the tester's head series for milestone 4 PR B at 6f7e744c, with the six colour mutations (the form's Amendment 24), from its hand-back (26129 bytes, sha256 648bb4552ce6100554071174c7e801312790dd29e03713b28cb2103cdf63a608), below the rule, byte for byte except as listed here. Its brief by file (17479 bytes, sha256 2e698aaf28bf17357af2b636a4f0ab0b8c7ed76feefc642e69200ed27d72f961), dispatched at 2026-11-15T22:24:12Z; the run 2026-11-15T22:24:13Z to 2026-11-16T02:02:37Z by its transcript, 202 calls (Bash 193, Read 2, SubagentHandback 1, Write 6), 1 errored, model claude-sonnet-5-5. Changes: none. Checked by script: 31 run logs of this series under the harness's out folder, each opening at 6f7e744c with one rc line, every rc 0 but colour-2 1, colour 1, m-pb-e1 1, m-pb-e2 1, m-pb-e2c 1, m-pb-e3 1, m-pb-e4 1, m-pb-e5 1, source-changed-post 3. The custodian's reading of the form's Amendment 12 item 11: the colour suite's PB-E4 failure, the same in its re-run inside its own hold, is not I3, because it has a harness cause in the launcher's output. The custodian's brief gave the colour suite no waiting launcher shim, where the recording suite had one; PB-E4 reads the session history after the process tree is stopped, and the app-down after the first run ended a live app tree, so the history was still locked (the EBUSY reading). The error is the custodian's brief. The tester's third, diagnostic run with the waiting shim passed all five steps, and the six mutations ran with it. Source-changed's post route ended rc 3 with S5d INCONCLUSIVE alone, as its README entry names.*

---

Head series: b1-shell-half PR B at 6f7e744cf6a1c1337fdaf62bfdc113c1de531f1a, tester, port-5400 harness

Result: findings. Every briefed run passed except one failure and one inconclusive result:
- `colour` failed PB-E4 under the brief's empty `<env>`, and failed identically on its `-2` re-run.
- That is a harness cause. The default non-waiting `npx` shim lets the app outlive the suite's stop() and keep the history lock. With `SHIMDIR=shim-wait` the same suite passed 5/5 (an extra diagnostic run, see the departures).
- `source-changed-post` ended rc 3 with only S5d INCONCLUSIVE, as the README names it. It was not re-run.
- All six colour mutations failed where their comments say, but I ran them under `SHIMDIR=shim-wait`, not the brief's empty `<env>`.

Model: I observe myself as Sonnet 5.5 (claude-sonnet-5-5). No model override and no context handoff. No usage figures are at hand.

Four failure classes, as they apply to this harness:
1. **Interface:** the real debug exe (sha256 checked) driven over CDP through the product's WebView2. The one exception is the dev seam `publishPrepareWithDestination` in `colour` PB-E2, which the suite names itself.
2. **Claim points to a record:** every run below has its log in `<S>/m4b-e2e-h/out/m4b-e2e-<tag>.log`, with a byte-copy in `<S>/s327t-harvest-<tag>.txt`.
3. **Operator-facing lines:** every line quoted is from this commit's runs. The one stale item is `e2e/out/measure-app.log`, which appends across runs and also holds an older session-log line.
4. **Assertion reached:** `colour` PB-E4 did not reach its assertion on the empty-env runs (EBUSY read). It did on the shim-wait runs. `residency-harness` is exit code only, by the brief.

## Start state
- HEAD is 6f7e744c… and the porcelain is empty (re-checked at the end). The fetch was rc 0.
- Free disk: C: 51G, D: 365G.
- Form at origin/main: 316866 bytes, sha256 47ac0239d20ccc24021ea772975b0b624b118d2919deb2fab6614d04fc393831. It is saved as `<S>/s327t-form.md`.
- Packet: 7834 bytes, sha256 6fa1f609…d3d4db (matches).
- `m4b-rec-onehold.mjs`: 635 bytes, sha256 18677923…c28bf (matches).
- Harness check: all ten files print `OK` (the three `.ps1` files, `m4b-e2e-load.sh`, `m4b-e2e-run-suite.sh`, `m4b-e2e-build-exe.sh`, `m4b-e2e-tauri.conf.json`, both `npx.cmd` shims). I read `run-suite`, `build-exe` and `app-up.ps1` whole.
- Exe: `D:/wt-targets/m4b/exes/spatial-ide-shell-m4b.exe`, 91555840 bytes, mtime Nov 15 18:23, sha256 01073a95deabb32efdc6ac03c3625fd2a5beb22a36ee6c07a5bb92068fb41b9b.
- The 19 `e2e:` entries in `package.json` match the brief, plus `e2e:debug`, which was not run.

## Installs and builds
- `npm ci` in `frontends/shell`: rc 0 (the log ends with npm `allow-scripts` warnings). `npm ci` in `renderer/bundle-viewer`: rc 0. The first attempt at the bundle-viewer install got hold exit 95, so its command did not run (see holds).
- `npm run build` in `renderer/bundle-viewer`: rc 0. The scan's last lines are:
  - `scan-dist: 3 files scanned, 2 findings, all reviewed; record written`
  - `scan-dist: reviewed row NOTICE.txt credential 19092: matched`
  - `scan-dist: reviewed row NOTICE.txt local-filesystem-path 111337: matched`
  - `scan-dist: reviewed row app.js local-filesystem-path 7291: not found`
  - The last line says "not found". The rc was 0 and the porcelain stayed empty.
- `generate:notice`: rc 0, `src/generated/NOTICE.txt (3506979 bytes)`.
- Measure exe: `build:measure` rc 0 (`Finished release profile … in 3m 33s`). `D:/wt-targets/m4b-measure/release/spatial-ide-shell.exe` is 72475648 bytes, mtime 2026-11-16 00:34:33 +0100, sha256 0581d86a07d330f385a70668a98b330e43b9208ad7926b0aa56e2bf60218699c. The porcelain stayed empty.
- `cargo build -p spatial-kernel --example verify-bundle`: rc 0, `Finished dev … in 1m 01s`.

## Fixtures
- The count is 34 files. The `cmp` of `<S>/s327t-fix-before.txt` and `<S>/s327t-fix-after.txt` gave rc 0, so they are identical.
- sha256 of `filter-zoned.parquet`: 92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46
- sha256 of `100k-happy-path.parquet`: fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49
- sha256 of `attributes-multitype.parquet`: afbd4b909a22a416f88002dcbd81edf3117a642141954724eac4cc41c459a1d2
- sha256 of `attributes-multitype.oracle.json`: 29e54fec6fcb583f2c23fe6767390236724d930452660d24b39590c519f03a75
- sha256 of `slow-filter-scan.parquet`: 3fd819cb35aafa309c0c4c8452283ac4ccd5825f00d24894aa12d5ffc86f5ce5

## Runs
Times are UTC from the logs' first line and `rc=` line, 2026-11-15 to 2026-11-16. The M′ column is the same run's rc in the M′ series. Every `skp.projection_` count is 0. Every busy check printed `FREE`. Every run's app-down output showed ports 9223 and 5400 free. Every log's first line begins `worktree C:/dev/wt/m4b head 6f7e744cf6a1c1337fdaf62bfdc113c1de531f1a start …`.

| tag (hs-) | script | env | rc | start | end | load line | last line or verdict | M′ |
|---|---|---|---|---|---|---|---|---|
| regression | regression.mjs | | 0 | 23:41:14 | 23:46:21 | 23:41:04Z 25,30,31 | 17 PASS lines | 0 |
| refusal-contract-baseline | refusal-contract-baseline.mjs | | 0 | 23:49:28 | 23:50:18 | 23:49:20Z 36,12,9 | 3 PASS | 0 |
| admission | admission-remediation.mjs | | 0 | 23:53:00 | 23:53:30 | 23:52:52Z 18,18,14 | 11 PASS | 0 |
| filter | filter.mjs | | 0 | 23:56:12 | 23:56:26 | 23:56:03Z 15,9,25 | 3 PASS | 0 |
| filter-panel | filter-panel.mjs | | 0 | 23:59:12 | 23:59:40 | 23:59:03Z 15,13,27 | 5 PASS | 0 |
| style | style.mjs | | 0 | 00:02:23 | 00:02:34 | 00:02:15Z 14,8,25 | 6 PASS | 0 |
| publish | publish.mjs | | 0 | 00:05:26 | 00:05:41 | 00:05:17Z 5,36,23 | 4 PASS (OPEN, APPROVED', REFUSED', FILTERED') | 0 |
| console | console.mjs | | 0 | 00:08:20 | 00:14:23 | 00:08:11Z 11,47,33 | 11 PASS incl. REGRESS' (342572ms) | 1, then 0 on re-run |
| layout | layout.mjs | | 0 | 00:17:06 | 00:18:02 | 00:16:57Z 5,11,5 | 11 PASS, FIXTURES PASS | 0 |
| selection | selection.mjs | | 0 | 00:20:44 | 00:30:02 | 00:20:35Z 7,0,5 | `[selection] 18 PASS, 0 FAIL`, EXPORT-TODAY SKIP | 0 |
| export-view | export-view.mjs | | 0 | 00:33:07 | 00:33:33 | 00:32:58Z 19,25,12 | `[export-view] 4 PASS, 0 FAIL` | 0 |
| recording | recording.mjs | SHIMDIR=shim-wait | 0 | 00:36:17 | 00:36:27 | 00:36:09Z 18,18,18 | 5 PASS (RECORD last) | 0 |
| command-bar | command-bar.mjs | | 0 | 00:39:08 | 00:40:39 | 00:38:59Z 14,15,17 | 14 PASS, FIXTURES PASS | 0 |
| attributes | attributes.mjs | | 0 | 00:43:20 | 00:45:44 | 00:43:11Z 20,18,19 | `[attributes] 2 PASS, 0 FAIL` | 0 |
| table | table.mjs | SPATIAL_E2E_FILTER_ZONE_COUNTS='[402, 392, 389, 421]' | 0 | 00:48:25 | 00:49:23 | 00:48:16Z 21,23,20 | `[table] 4 PASS, 0 FAIL` | 0 |
| project | project.mjs | | 0 | 00:52:10 | 00:52:41 | 00:51:59Z 79,88,79 | 12 PASS | 0 |
| residency-harness | residency-harness.mjs | | 0 | 00:55:38 | 00:55:58 | 00:55:29Z 32,28,28 | exit code only (no figure recorded) | 2, then 0 on re-run |
| **colour** | colour.mjs | | **1** | 00:58:51 | 00:59:56 | 00:58:42Z 29,47,36 | PB-E1, E5, E2, E3 PASS; PB-E4 FAIL | not run at M′ |
| **colour-2** | colour.mjs | | **1** | 01:03:14 | 01:04:19 | 01:03:05Z 27,29,79 | same: PB-E4 FAIL | n/a |
| pan-anchor | pan-anchor.mjs | | 0 | 01:07:10 | 01:10:50 | 01:07:00Z 20,22,21 | `==== 16/16 PASS ====` | 1 and 1 (15/16) |
| source-watch-idle | source-watch-idle.mjs | | 0 | 01:13:37 | 01:13:56 | 01:13:29Z 10,18,9 | 8 PASS (W1 to F3) | 0 |
| source-changed-pre | source-changed.mjs | env -u SPATIAL_E2E_SOURCE_CHANGED_ROUTE | 0 | 01:16:38 | 01:17:02 | 01:16:29Z 26,19,9 | S1 to S5c PASS | 0 |
| source-changed-post | source-changed.mjs | SPATIAL_E2E_SOURCE_CHANGED_ROUTE=post | 3 | 01:19:45 | 01:20:10 | 01:19:36Z 20,16,25 | S5d INCONCLUSIVE, all else PASS | 0 (rc 3 at M″) |
| source-changed-reopen | source-changed.mjs | SPATIAL_E2E_SOURCE_CHANGED_ROUTE=reopen | 0 | 01:23:06 | 01:24:23 | 01:22:53Z 86,100,99 | S1 to S5c and R1 to R4 PASS | 0 |
| recentre-crossing | measure exe, not via run-suite | | 0 | 01:27:16 | 01:30:34 | busy check FREE | `==== 6/6 PASS ====` | 0 |
| colour-3 (diagnostic) | colour.mjs | SHIMDIR=shim-wait | 0 | 01:33:18 | 01:33:51 | 01:33:09Z 29,12,8 | 5 PASS | n/a |

Load was high on `project` (79 to 88) and `source-changed-reopen` (86 to 100), but both passed.

## Per-run byte-copies
For every run, the full first line, result lines, last two lines, `rc=` line, load line, app-down output and busy output are in `<S>/s327t-harvest-hs-<tag>.txt`. Every run's `app.err.log` copy is in `<S>/m4b-e2e-h/out/`, and each run's session log is copied to `<S>/s327t-hs-<tag>.session.log`. Every app named a session log, and all of them copied (the colour mutations' session logs are 4003, 4524 and 5252 bytes). The only app without a copy is `recentre-crossing`, which is covered in its own section below.

Last two lines, byte-copied (cut where marked):
- **Runs that launch the app and leave it running.** `regression`, `refusal-contract-baseline`, `admission`, `filter`, `filter-panel`, `style`, `publish`, `console` and `command-bar` end with `Full render-trace ledger: C:\dev\wt\m4b\frontends\shell\e2e\out\<name>-render-trace-<id>.json` (`regression` and `console` show it) and `This run launched the app; it stays RUNNING on CDP port 9223 for further interactive use.`. `publish`, `layout` and `command-bar` end with the shorter form `This run launched the app; it stays RUNNING on CDP port 9223.`
- **`layout`:** `FIXTURES      PASS    filter-zoned.parquet sha256 92ed800c… -> 92…` (cut).
- **`selection`:**
  - `[selection] 18 PASS, 0 FAIL: E-SCENE=PASS E-CLICK=PASS …` (cut)
  - `[EXPORT-TODAY] SKIP: phase A's recorded observation (the form's Amendment 4 item 2); after B3 the reopen meets the open-…` (cut)
- **`export-view`:** the `[E-CV-RESIZE] PASS (5421ms): …` line, then `[export-view] 4 PASS, 0 FAIL: E-CV-OPEN=PASS E-CV=PASS E-CV-RESIZE=PASS FIXTURES=PASS`.
- **`recording`:** `RECORD  PASS    unsaved-7ffba8a2579b5cf3d27ab11fe253b4ff: a header and five steps, in order and chained; the filter name…` (cut), then `Full console ledger: C:\dev\wt\m4b\frontends\shell\e2e\out\recording-console-ledger-1794789387029.json`.
- **`attributes`:** `[attributes] fixtures hash-identical before and after: attributes-multitype.parquet afbd4b909a22, attributes-multitype.o…` (cut), then `[attributes] 2 PASS, 0 FAIL: PA-E1=PASS PA-E3=PASS`.
- **`table`:** `[table] fixtures hash-identical before and after: filter-zoned.parquet 92ed800ccbcc, 100k-happy-path.parquet fd0c74ab2d5…` (cut), then `[table] 4 PASS, 0 FAIL: PC-E1=PASS PC-E2=PASS PC-E3=PASS PC-E4=PASS`.
- **`project`:** `NOTICE-S18       PASS    the save notices hold S18's text once; the dataset entry's locators read machine-recorded` (cut), then `Full console ledger: …\project-console-ledger-1794790360682.json`.
- **`residency-harness`** (first line, last two and rc only): first line `worktree C:/dev/wt/m4b head 6f7e744c… start 2026-11-15T23:55:38Z`'s counterpart for this run is `start 2026-11-16T00:55:38Z`. The last two lines are `Evidence file: C:\dev\wt\m4b\frontends\shell\e2e\out\residency-harness-instrument-on-1794790557943.json` and `This run launched the app; it stays RUNNING on CDP port 9223 for further interactive use.`. Then `rc=0 end 2026-11-16T00:55:58Z`.
- **`pan-anchor`:**
  - It prints `PASS  <size>: <check>  ::  …` lines instead of `[ID] PASS`. The 16 lines are 8 per size, for `small` and `large`. For example `PASS  small: recenter-crossing-A dx=-1200  ::  grab-point residual 0.00 buffer px (tol 4)` and `PASS  large: recenter-crossing-A dx=-1200  ::  grab-point residual -0.00 buffer px (tol 4)`.
  - The last line is `==== 16/16 PASS ====`.
  - At M′ both runs failed `recenter-crossing-A dx=-1200` with a residual of 1100.01.
- **`source-watch-idle`:** `Report: …\source-watch-idle-1794791636105.json`, then `This run LAUNCHED the app and has now torn it down (session.stop()); nothing was left running.`
- **`source-changed` routes:** `Report: …\source-changed-<id>.json`, then `This run LAUNCHED the app; it stays running on CDP port 9223.`
- **`source-changed-post`:** the INCONCLUSIVE line begins `[S5d-post-check-route-confirmed] INCONCLUSIVE: S5d: INCONCLUSIVE (never a pass): a tile mint was refused with engine.source_changed and the pre-check's own descriptor detail ({mtime}) -- a sibling tile's pre-check found the change while the generation was live at its live check; which kernel route ended the generation is not read by this step…` (cut). Its README entry is `e2e/README.md` line 236, which says that outcome reads INCONCLUSIVE with exit code 3.
- **`console`:** the nested `[REGRESS'] PASS (342572ms): npm run e2e:regression exited 0 (317738ms); npm run e2e:admission exited 0 (24834ms); both a…` (cut). Its `app.err.log` copy is the last nested launch's.

## Failure: `colour` (the series run) and its re-run

`hs-colour`, rc 1:
- `[PB-E1] PASS (17304ms): coloured by zone through the Style tab (4 cases); legend agricultural | civic | industrial | residential | [P6 placeholder] No value | [P6 placeholder] Other; the dominant colour under each filter equals its swatch: agricultural 166,206,227,255; civic 31,120,180,255; industrial 178,223,138,255; residential 51,160,44,255; NULL 158,158,158,255`
- `[PB-E5] PASS (34ms): the saved project.spatial holds the match on zone with 4 cases, equal to the page's style document`
- `[PB-E2] PASS (4270ms): … (i) the prompt names zone; (ii) the dialog shows the prompt's line; (iii) the manifest publishes zone; (iv) style.json carries the match; (v) the viewer draws the legend's colours`
- `[PB-E3] PASS (2255ms): fill_color is the literal #4285f4; no legend; the layers lines went from 26 to 27 after the click; the dominant colour is 66,133,244,255`
- `[PB-E4] FAIL (32079ms): PB-E4: waited 30000ms for a readable history.jsonl in the one store folder; the last reading was {"readFailed":"EBUSY: resource busy or locked, read"}`
- `rc=1 end 2026-11-16T00:59:56Z`

`hs-colour-2` is the one re-run, alone in its own hold, with the same shape. It gave the same four PASS lines and the same PB-E4 FAIL line (32085ms, identical text), and `rc=1 end 2026-11-16T01:04:19Z`.

Harness cause, from the harness's own files:
- The default `shim/npx.cmd` returns at once after `m4b-e2e-app-up.ps1`. The suite's `session.stop()` therefore cannot end the app tree.
- The first run's app-down output printed `killed tree 20172` and `killed tree 41428`. So the app was still alive at the end and still held the kernel's history lock.
- `shim-wait/npx.cmd` stays alive so that the suite's stop() ends the app. The colour README entry says PB-E4 needs exactly that. The recording suite runs under it for the same reason.
- Whether this is I3 is the custodian's reading.

## Diagnostic run `hs-colour-3` (departure)
- It was run with `SHIMDIR=shim-wait`, unmutated, alone in its own hold, after the re-run. It is a third `colour` run, beyond the brief's single re-run.
- All five steps passed. The PB-E4 line is `[PB-E4] PASS (2429ms): 9 steps; the colour by step records the match on zone (4 cases) with the dependency zone: Utf8; the One colour step after it is the literal #4285f4`. It ended `rc=0 end 2026-11-16T01:33:51Z`.

## Mutations
Each was applied by the same script, `<S>/s327t-mutate.mjs <S>/s327t-spec-<id>.json`. It refuses unless the anchor occurs exactly once. It is a script the Write tool wrote, run as a file; the brief names a `node -e` script. Every run used `SHIMDIR=shim-wait`; the empty-env departure is explained above. `git diff` was shown after each apply. Every revert was `git checkout -- <file>`, and the diff was 0 bytes with the file's sha256 equal to `git show H:<file>`'s and the porcelain empty.

**M-PB-E1** (`src/canvas/matchGroups.ts`). The diff replaced `groups[row] = values === null ? style.unmatchedGroup() : style.groupFor(values[row]);` with `groups[row] = values === null || values[row] == null ? style.unmatchedGroup() : style.groupFor(values[row]);`. The run `hs-m-pb-e1` ended `rc=1 end 2026-11-16T01:38:08Z`.
- `[PB-E1] FAIL (14932ms): PB-E1: under zone IS NULL the dominant colour is 97,97,97,255, expected the No value swatch 158,158,158,255`
- PB-E5, PB-E2, PB-E3 and PB-E4 PASS.
- The failure matches the recorded observation.
- Revert sha256 58f1000c… on both sides.

**M-PB-E5** (`src/project/saveProject.ts`). The diff changed `style: { ...toStyleDocument(input.style) },` to `style: { ...toStyleDocument({ ...input.style, fillMatch: null }) },`. The run `hs-m-pb-e5` ended `rc=1 end 2026-11-16T01:41:30Z`.
- `[PB-E5] FAIL (27ms): PB-E5: the file's fill_color reads {"literal":"#4285f4"}, expected the match`
- The other four PASS.
- Revert sha256 1ad1167b… on both sides.

**M-PB-E2** (`src/publish/PublishPanel.tsx`). The diff changed `const styleDoc = JSON.stringify(toStyleDocument(style));` to `…toStyleDocument({ ...style, fillMatch: null })…` at line 472, the second occurrence, in `runPrepareWithDestination`. The run `hs-m-pb-e2` ended `rc=1 end 2026-11-16T01:44:43Z`.
- `[PB-E2] FAIL (3591ms): PB-E2: (i) FAILED: published_columns is "Columns published: id and the geometry only.", expected "Columns published: id, the geometry, and zone." | (iii) FAILED: manifest schema names after the first two read [], expected ["zone"] | (iv) FAILED: style.json fill_color reads {"literal":"#4285f4"}, expected the match | (v) FAILED: the viewer draws ["#4285f4","#4285f4","#4285f4","#4285f4","#4285f4"], the legend's swatches are ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#9e9e9e"] ; passed: (ii)`
- The other four steps PASS.
- This equals the recorded observation.
- Revert sha256 aec01e38… on both sides.

**M-PB-E3** (`src/style/StylePanel.tsx`). The diff changed `const next = { ...style, fillMatch: null };` to `const next = { ...style };`. The run `hs-m-pb-e3` ended `rc=1 end 2026-11-16T01:48:08Z`.
- `[PB-E3] FAIL (15216ms): PB-E3: waited 15000ms for a style document whose fill_color is a literal; the last reading was {"style_version":1,"layer":{"geometry":"polygon","fill_color":{"match":{"column":"zone","cases":[…]` — full text in `<S>/s327t-harvest-hs-m-pb-e3.txt`.
- `[PB-E4] FAIL (2399ms): PB-E4: the history holds 1 fillColor steps, expected 2 (the colour by, then One colour): [{"action":"style.set",…` (cut).
- PB-E1, PB-E5 and PB-E2 PASS.
- This matches the comment, which says PB-E4 also fails.
- Revert sha256 838de7ce… on both sides.

**M-PB-E4** (`src/App.tsx`). The diff changed `for (const transition of transitions) stepQueue.enqueue(dataset, transition);` to a version whose `fillColor` transitions carry `next.fillColor` as the value. The run `hs-m-pb-e4` ended `rc=1 end 2026-11-16T01:51:34Z`.
- `[PB-E4] FAIL (2472ms): PB-E4: the colour by step's value reads "#4285f4", expected the match`
- The other four PASS.
- This equals the recorded observation.
- Revert sha256 b97ab963… on both sides.

**M-PB-E2c** (`frontends/shell/src-tauri/src/publish.rs`).
- The exe's sha256 was 01073a95…41b9b before the copy. The copy `spatial-ide-shell-m4b.h.exe` has the same sha256.
- The diff changed `published_columns: compose_published_columns(&attributes),` to `compose_published_columns(&[]),`.
- `bash m4b-e2e-build-exe.sh` in a hold gave rc 0 (`Finished dev … in 2m 21s`, `copied exe`).
- The mutated exe's sha256 is 18b39f8d1b183987af53ba26e41341667c5e222f5bc2b7b59b70efbb7f1a0f88.
- The run `hs-m-pb-e2c` ended `rc=1 end 2026-11-16T01:59:56Z`.
- `[PB-E2] FAIL (3466ms): PB-E2: (i) FAILED: published_columns is "Columns published: id and the geometry only.", expected "Columns published: id, the geometry, and zone." ; passed: (ii) (iii) (iv) (v)`
- The other four steps PASS.
- This is the expected (i)-only failure.
- Revert sha256 0c442cc7… on both sides, diff empty.
- The saved exe was copied back. Its sha256 is 01073a95deabb32efdc6ac03c3625fd2a5beb22a36ee6c07a5bb92068fb41b9b (equal), size 91555840. Its mtime is now 2026-11-16 03:00:15 +0100, so the exe differs from the original in mtime only. No rebuild after the revert.

## `recentre-crossing` (measure exe, outside `run-suite`)
- Busy check: FREE (`<S>/s327t-rc.busy.txt`).
- The hold ran `timeout 1800 npm run e2e:recentre-crossing -- --measure-build D:/wt-targets/m4b-measure/release/spatial-ide-shell.exe` with `-Minutes 30`, from `C:/dev/wt/m4b/frontends/shell`. The rc is kept in `<S>/s327t-recentre-crossing.rc` (`rc=0`).
- Stamps: `2026-11-16T01:27:16Z` and `2026-11-16T01:30:34Z`.
- Case headers:
  - `--- case 1: z_fit -3.692532927362801, canvas 668x712 (buffer 668x712), L 300, T 131072, d 3749.395, n1 37, 76 drags ---`
  - `--- case 2: z_fit -3.692532927362801, T 131072, double-click shift 300 px, window below T: (0, 1939.342] ---`
- Results (the long lines are cut):
  - `PASS  case 1 (a): W is continuous across each origin change  ::  2 origin change(s), worst jump 0.00 buffer px (tol 4)`
  - `PASS  case 1 (b): |W_end - W_start| <= d per axis  ::  |E| (0.000, 0.000) vs d 3749.395`
  - `REPORT  case 1 (c): the start and end images do not differ  ::  differ: N 35248 -> 127606, C shift 129.55 buffer px`
  - `PASS  case 1 (d): the drawn data's inner edges do not move  ::  …moves left 0.00, bottom 0.00 buffer px (tol 4)`
  - `PASS  case 2 (i): no origin change from the double-click to its settle  ::  20 line(s), 0 origin change(s), settled true`
  - `PASS  case 2 (ii): the zoom after the double-click is the zoom before plus 1  ::  zoom -3.692532927362801 -> -2.692532927362801 (+1)`
  - `PASS  case 2 (iii): W is continuous across the origin change at the wheel tick  ::  1 origin change(s), worst jump 0.00 buffer px (tol 4)`
  - Tally: `==== 6/6 PASS ====`. The REPORT line for (c) is the harness's own marker, not a failure.
- Copies:
  - `<S>/s327t-recentre-crossing.app.log` is 554 bytes, sha256 ecd6a2805f8dd94f68f9550c1739aa2ccd28116b5a14b4d74f76795aa0727669. It holds two session-log lines. The older is `session-1794559492.log` and the current run's is `session-1794792440.log`.
  - `<S>/s327t-recentre-crossing.session.log` is 136704 bytes, sha256 189c691e6df748543590bd8bac0d79f86cfcb21290abf617a030c18df699beb4.

## Holds
- The time of each hold's grant and the command's own end are in the logs above. Before each grant I read a status in its own call. After the grant, the same call re-read the status and ran `m4b-rec-onehold.mjs`, which printed `holds of this project after the grant: 1` every time except one.
- The first hold on the bundle-viewer `npm ci` printed `holds of this project after the grant: 2` and exited 95, so its command did not run. It released and I waited.
- Hold lines carried `also=<m>`.
- The opening status read showed a `project=SpatialIDE` line, with `reading quiet=False average=31.1% peaks-over-25=50`. I waited with `<S>/s327t-wait.sh`. It loops at 60 s per turn with a 120-minute hard timeout, and then waits 120 s and reads the status again.
- Holds in order, with the pre-hold status read each time at 0 project lines unless noted:
  1. `npm ci` (shell), granted 22:36:01Z, ended 22:36:17Z.
  2. `npm ci` (bundle-viewer), exit 95 at 22:56:42Z. Retry granted 23:03:25Z, ended 23:03:31Z.
  3. Viewer build 23:05:58Z to 23:06:01Z.
  4. Notice 23:08:36Z to 23:08:40Z.
  5. Measure build 23:30:34Z to 23:34:36Z.
  6. `verify-bundle` example 23:37:07Z to 23:38:09Z.
  7. The 31 run holds, one per tag as in the table, each with its own hold line.
  8. `recentre-crossing`, within 01:27:16Z to 01:30:34Z.
  9. The exe build for M-PB-E2c, 01:54:25Z to 01:56:49Z.
- A pre-hold read showed a `project=SpatialIDE` line (the reviewer's) at three points. Each time I waited and retried: before the bundle-viewer `npm ci` (twice), before the `generate:notice` follow-on at 23:10, and before the measure build at 23:14 to 23:28.
- Some status reads showed `reading quiet=False` with averages from 23.3% to 34.6%. I copied only that field.
- Each `date -u` for a hold's start and end is in `<S>/m4b-e2e-h/out/m4b-e2e-<tag>.log`, in `<S>/s327t-*.log` or in the background task outputs.

## End state
- Every process I started was stopped by the suites' own app-down. No process of mine remains and no background shell is running. The `ps` lines I saw belong to other tools.
- The busy check printed `FREE`.
- HEAD is 6f7e744cf6a1c1337fdaf62bfdc113c1de531f1a. The porcelain is empty.

## Departures and extras
- Colour runs under `SHIMDIR=shim-wait` (the mutations and `hs-colour-3`) instead of the brief's empty `<env>`. Without the waiting shim, PB-E4 cannot be observed, so the PB-E4 mutation would have been masked by EBUSY. `hs-colour-3` is a third `colour` run beyond "once". It is labelled a diagnostic.
- I wrote the following into `<S>` (all start with `s327t-`). None of them is a tracked file:
  - helper scripts: `s327t-wait.sh`, `s327t-await.sh`, `s327t-harvest.sh`, `s327t-revert.sh`, `s327t-mutate.mjs`, `s327t-mut-specs.mjs`
  - `s327t-spec-<id>.json`
  - the harvest files and status files
  - the form copy
- I ran each pre-hold status read with, in some calls, a harvest or a revert in the same call. A hold itself was always its own call.
- I read the form selectively (grep for its headings and one targeted look), not whole, and read the README entries for Running it, Recording, Table, Recentre crossing and Colour, not the Publish spec or the Residency harness section. I read `colour.mjs` whole.
- The selection suite wrote its output under `C:\dev\wt\m4b\target\e2e-selection-out` (the worktree's ignored target).
- `console`'s REGRESS' step launches `regression` and `admission` nested inside it, so its `app.err.log` copy is the last nested launch's.
- The 11 run holds that wait for the reviewer's holds mean the measured loads are in a shared setting, not a quiet machine. I did not record any timing as a measurement.

Paths (all under `<S>`): `s327t-fix-before.txt`, `s327t-fix-after.txt`, `s327t-harvest-hs-<tag>.txt`, `s327t-hs-<tag>.session.log`, `s327t-recentre-crossing.{log,stamps,rc,app.log,session.log}`, `s327t-measure-build.log`, `s327t-verify-example.log`, `s327t-npmci-*.log`, `s327t-viewer-build.log`, `s327t-notice.log`, `m4b-e2e-h/out/m4b-e2e-hs-*.log`.