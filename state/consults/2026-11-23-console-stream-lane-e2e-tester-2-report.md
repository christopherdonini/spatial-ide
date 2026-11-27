*Filed by the custodian: the Console piece's e2e rows again at PR 359's head 8b8c38815a5fbc1e41e392366784a7c1c51a5783 (the Sonnet tester, node:console-stream-lane-limitation-67@e2e-tester-2, dispatched at 2026-11-23T09:04:20.979Z; its run: Bash 92, Edit 4, Read 7, SubagentHandback 1, Write 3, by unique call ids, 2 calls errored; model claude-sonnet-5-5, from 2026-11-23T09:04:21.110Z to 2026-11-23T10:12:06.991Z by its transcript), its hand-back as it came (11826 bytes, sha256 f3506b2aec957c149bcbf1834cae57f6194ea5aba1ab0be724527ce9445643c3), with these changes: 2 `shell=` values of the hold's lines written `<m>`; and the architect's narrow attempt's Doc-2 and Doc-3 applied, each old text occurring once, each new text copied by script from that report's fences (`state/consults/gates/2026-11-23-console-stream-lane-a3-architect-narrow.md`, gate-log row 858); they are the architect's words, not the tester's. Beside run 12, Doc-1: the reviewer recomputed the sha256 of the filter fixture the generator wrote for that run, `C:/dev/wt/console67/target/fixtures/manual-walkthrough/filter-zoned.parquet`, as 92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46, 409872 bytes, last modified at 2026-11-23T09:20:43Z, inside the generator run (09:09:01Z to 09:20:45Z), equal to the shared copy's full value in run 3's FIXTURES row and to the value below (`state/consults/gates/2026-11-23-console-stream-lane-a3-doc1-reviewer.md`, gate-log row 859). The architect's note for the closing amendment's references (the throw lines by name at the head; section 4's `:478` for M-A4-1 is `:464` at the head) is for the closing amendment, not for this file.*

---

**Done.** All 13 runs and builds (a), (b), (c) completed. Nothing is committed, and `git -C <W> status --porcelain` printed nothing after every run and every revert. HEAD stayed `8b8c38815a5fbc1e41e392366784a7c1c51a5783`. Model: Sonnet 5.5 (claude-sonnet-5-5), with no override and no context handoff. No usage figures are at hand.

In every mutation run, the first failing line was inside its named set, so there is no class-2 finding. Run 3 (the unmutated twin) passed, and run 5 was made. The table row passed at the new head with the oracle sourced.

Two deviations of mine:
- I wrote a copy of the form into `<S>` outside `c67r/`, then deleted it in the next call.
- For run 11 the disk read and the run were two holds in one backgrounded Bash call. The read (41035 MB) came first, so the 40960 MB check still held.

**Where things are.** All paths below are under `<S>/c67r/`. Each run `<n>-<name>` has:
- `.log`
- `-summary.txt`, the `== Summary ==` block byte for byte (I cut lines to 250 to 700 characters only when displaying them, never in the files)
- `-eand.txt`
- `-out/`, the copy of `e2e/out`

Other files:
- `times.txt`
- `df.txt`
- `build.log`
- `prebuild.log`
- `oracle.log`
- `<n>-<name>.diff` and `.stat` for each mutation run

**Setup**
1. HEAD printed `8b8c38815a5fbc1e41e392366784a7c1c51a5783`. The status was empty.
2. Nothing listened on 5180 or 9223 (grep exit 1).
3. Free space: C: 41918 MB, D: 300188 MB.
4. `mkdir -p <S>/c67r` returned 0.
5. All four sha256 values matched the brief: g1 `dd36d19d…298a`, cb1 `34e932aa…5a54`, cb3 `e6f9051d…17d0`, mx2-line `ed685d21…e543`.
6. `git apply --check` returned 0 for all three patches.

**Builds**
| Build | Exit | Start (UTC) | End (UTC) | Last log line |
|---|---|---|---|---|
| (a) npm build | 0 | 2026-11-23T09:04:51Z | 09:05:27Z | `✓ built in 5.68s` |
| (b) cargo build | 0 | 09:05:41Z | 09:08:46Z | `Finished dev profile [unoptimized + debuginfo] target(s) in 3m 00s` |
| (c) generator | 0 | 09:09:01Z | 09:20:45Z | `test result: ok. 1 passed; 0 failed` |

- (b) `.exe` listing: `D:/wt-targets/console67/debug/spatial-ide-shell.exe`.
- (c) printed line, byte for byte:
  `wrote C:\dev\wt\console67\kernel\../target/fixtures/manual-walkthrough\filter-zoned.parquet (2000 features, 24014 vertices, zone_counts=[402, 392, 389, 421], zone_nulls=396)`
- (c) sha256 of my copy and of the shared copy are both `92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46`. They are identical, so run 12 was made.

**Runs** (times in UTC, all 2026-11-23)
| n | Suite and mutation | Exit | Start | End | Result |
|---|---|---|---|---|---|
| 0 | regression, warm-up, not counted | 0 | 09:21:11Z | 09:29:58Z | Summary ends with all rows PASS and `NET' INFO`. It attached normally, so no `0b`. |
| 1 | console, none | 0 | 09:30:53Z | 09:38:20Z | All PASS. `GROUP'` PASS, `LABEL'` PASS (`▾ Console — 162 actions (598 dropped: 598 of data requests, cancels and log lines; 0 of other entries)`), `MEASURE'` SKIP, `REGRESS'` PASS. |
| 2 | console, M-G1 | 1 | 09:38:54Z | 09:46:11Z | See below. |
| 3 | command-bar, none | 0 | 09:46:44Z | 09:49:02Z | All 17 rows PASS, E-AND included. FIXTURES row: sha256 92ed800c… before and after. |
| 4 | command-bar, M-CB1 | 1 | 09:49:28Z | 09:51:38Z | See below. |
| 5 | command-bar, M-CB3 | 1 | 09:52:19Z | 09:55:51Z | See below. |
| 6 | command-bar, M-A4-1 | 1 | 09:56:24Z | 09:59:00Z | See below. |
| 7 | command-bar, M-A4-3 | 1 | 09:59:38Z | 10:01:58Z | See below. |
| 8 | command-bar, M-X2 | 1 | 10:02:35Z | 10:04:51Z | See below. |
| 9 | recording, none | 0 | 10:05:20Z | 10:05:56Z | OPEN, APPLY, STYLE, RESET, RECORD all PASS. |
| 10 | project, none | 0 | 10:06:23Z | 10:07:18Z | All 12 rows PASS (OPEN through NOTICE-S18). |
| 11 | reopen, none | 0 | 10:07:40Z | 10:09:01Z | R1 to R9 and E-CHANGED all PASS. |
| 12 | table, none, with `SPATIAL_E2E_FILTER_ZONE_COUNTS='[402, 392, 389, 421]'` | 0 | 10:09:21Z | 10:10:48Z | See below. |

Run 12's `[table]` lines:
- `[table] fixtures hash-identical before and after: filter-zoned.parquet 92ed800ccbcc, 100k-happy-path.parquet fd0c74ab2d5d, slow-filter-scan.parquet 3fd819cb35aa`
- `[table] 4 PASS, 0 FAIL: PC-E1=PASS PC-E2=PASS PC-E3=PASS PC-E4=PASS`

**Mutation runs.** Each row gives the first FAIL line, then the diff.

- **Run 2, M-G1.** `GROUP'      FAIL    GROUP': capacity: 240 entries were recorded since the baseline (label total 755 - 515), more than each ring's 128, and the drops since then, 0 of the stream kind and 129 of the other, are not both within the 17 each ring held at least`
  - In the set {`GROUP': capacity:`}.
  - Diff: `<S>/c67r/2-console-mg1.diff`, 633 bytes, sha256 `dd36d19d7071a3bfa6f2699f59761d33f9f81cb09c393e7f5b4992d39772298a`, which equals the patch's hash.
  - Stat: `frontends/shell/e2e/console.mjs | 1 +`
- **Run 4, M-CB1.** `E-AND         FAIL    E-AND: cannot tell how many record_step rows card B's commit added: 201 entries of the other kind were dropped between the label read after card A's wait and the reading after card B's map settled, more than the 128 the other ring held then (label then: "▾ Console — 256 actions (570 dropped: 545 of data requests, cancels and log lines; 25 of other entries)"; now: "▾ Console — 256 actions (994 dropped: 768 of data requests, cancels and log lines; 226 of other entries)")`
  - This is F2′ (the `command-bar.mjs:498` message), in the set.
  - Diff: 1041 bytes, sha256 `34e932aa171fda62c601ffd80f116702fffb75a99a947bd857925099e46c5a54`.
  - Stat: `command-bar.mjs | 1 +`
- **Run 5, M-CB3.** `E-AND         FAIL    E-AND: card B's commit added 0 record_step rows, expected exactly one, at ok, carrying the combined text: []`
  - This is F4 with n = 0, in the set.
  - Diff: 1202 bytes, sha256 `e6f9051d7172b963224272d28de5a52649ff241419fcaf67b99ebc82c1d217d0`.
  - Stat: `ConsolePanel.tsx | 2 +-` and `collapsedCountSync.ts | 2 +-` (2 insertions, 2 deletions).
  - The applied diff changes `droppedOther` to `0` in both files.
- **Run 6, M-A4-1.** `E-AND         FAIL    E-AND: the newest record_step rows did not end with card A's step at ok before card B ([])`
  - In the set (card A's wait line).
  - Diff: 546 bytes, sha256 `649412efcf03787ab034af29b312b35cdc96f8b6e7499b9b21242589f9277eaa`.
  - Stat: `src/App.tsx | 1 -`
  - The anchor line occurred exactly once before the edit.
- **Run 7, M-A4-3.** `E-AND         FAIL    E-AND: card B's commit added 2 record_step rows, expected exactly one, at ok, carrying the combined text: [["filter:(\"zone\" = 'residential') AND (\"zone\" <> 'residential')","ok"],["filter:(\"zone\" = 'residential') AND (\"zone\" <> 'residential')","ok"]]`
  - This is F4 with n = 2, both rows the combined condition, in the set.
  - Diff: 610 bytes, sha256 `fc4d57edddaae9a17ed6da50645349119a6ae5a8aa7dadaebe2cd348ce8d0018`.
  - Stat: `src/App.tsx | 1 +`
- **Run 8, M-X2.** `E-AND         FAIL    E-AND: card B's commit added 2 record_step rows, expected exactly one, at ok, carrying the combined text: [["filter:\"zone\" = 'residential'","ok"],["filter:(\"zone\" = 'residential') AND (\"zone\" <> 'residential')","ok"]]`
  - This is F4 with n = 2: card A's text, then the combined text. In the set.
  - Diff: 892 bytes, sha256 `e355b81c82ee1449197aa650460e50d22263e3e42dc781994fdc75a979e8fabf`.
  - Stat: `src/App.tsx | 1 +`
  - I checked the inserted line against `c67-mx2-line.txt` with `cmp`, which returned 0.

**E-AND lines.** Each run has two matching lines, one `[E-AND]` line and one summary row. They are the same text, in `<n>-<name>-eand.txt`.
- **Run 3:** `[E-AND] PASS (23634ms): A 4.4% non-bg (unfiltered 16.5%); A and B on: 0.00%, Applied the exact AND text, card B's commit added exactly one record_step row, at ok (Console after card A's wait: "▾ Console — 256 actions (569 dropped: 545 of data requests, cancels and log lines; 24 of other entries)"; after card B's map settled: "▾ Console — 256 actions (794 dropped: 768 of data requests, cancels and log lines; 26 of other entries)"; dS=223, a=2, L=130, held stream entries before card B's record_step=0); B off: 4.4%, Applied A's text`
- **Runs 4 to 8:** the FAIL lines quoted above, which are the same text as the `[E-AND] FAIL (…ms)` lines. The `[E-AND]` lines carry elapsed times 16361, 57327, 42167, 16896 and 16132 ms for runs 4 to 8.

**Run 3 readings**
- **R0 label:** `▾ Console — 256 actions (569 dropped: 545 of data requests, cancels and log lines; 24 of other entries)`.
  - N₀ = 256, S₀ = 545, O₀ = 24.
  - M is 128, so N₀ = 2M and S₀ > 0. S11 is not triggered.
  - Read from the E-AND line's "Console after card A's wait".
- **M-CB3's twin:**
  - ΔS = 223, read from `dS=223` in that E-AND line. Check: 768 − 545 = 223.
  - Held stream entries before card B's `record_step` = 0, from `held stream entries before card B's record_step=0` in the same line.
  - 223 ≥ 128 and the count is 0, so run 5 was made, as the brief orders.
  - The same line gives a=2 and L=130.

**Disk reads** (C: and D: free, MB; from `df.txt`)
| Point | C: | D: |
|---|---|---|
| Setup | 41918 | 300188 |
| After build (a) | 41914 | 300188 |
| After build (b) | 41905 | 300193 |
| After generator | 41862 | 297830 |
| After run 0 | 41785 | 297829 |
| After run 1 | 41610 | 297829 |
| After run 2 | 41616 | 297829 |
| After run 3 | 41473 | 297829 |
| After run 4 | 41453 | 297829 |
| After run 5 | 41404 | 297829 |
| After run 6 | 41323 | 297829 |
| After run 7 | 41178 | 297829 |
| After run 8 | 41178 | 297829 |
| After run 9 | 41111 | 297829 |
| After run 10 | 41035 | 297829 |
| After run 11 | 40987 | 297829 |
| After run 12 | 41071 | 297829 |

C: never went under 40960 MB. The lowest reading was 40987 MB after run 11, only 27 MB above the floor, so C: is close to the limit.

**App stops.** For every run, the roots killed with `MSYS_NO_PATHCONV=1 taskkill /T /F /PID` were a `cmd.exe` (npm), a `node.exe` (vite and esbuild tree) and a `spatial-ide-shell.exe` (the app). I checked that the owner of the 9223 listener (`msedgewebview2.exe`) was a child of the listed `spatial-ide-shell.exe` root each time. The unlisted listener owner was never a stop condition. After each kill, netstat showed nothing on 5180 or 9223 (grep exit 1).
- **Runs 0 to 8 and 12:** `cmd` roots 55920, 42272, 55144, 50912, 71188, 80288, 75816 and 82564. The `node` and `spatial-ide-shell` roots were then already gone as descendants (taskkill returned 128). Only the first `cmd` kill reported 0 in some runs, and run 0 killed all three roots explicitly.
- **Runs 9, 10 and 11:** the suites closed their own app. The listing showed only my own `powershell.exe` or `bash.exe`, and no listener. I killed nothing.
- **PID 54920:** never touched.

**Hold and release lines, masked.** The hold line was always `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=<m> also=<m> (commands started from now on inherit it; release when done)`, and the release line was `MACHINE_RELEASED project=<m> shell=<m> affinity=FF (cores 0-7)`. No `others=`, `MACHINE_WAITING` or `MACHINE_ERROR` line appeared. No hold needed to wait, and no exit code 96 to 99 came.

**Timing-sensitive.** Nothing. No run failed at the attach line, and no warm-up `0b` was needed.

**The four failure classes, as they apply here**
- **Interface:** the harness is the product's own `npm run e2e:*` suites on the real shell, as the README entries launch them, and the table row is launched with the oracle variable sourced.
- **Claims point to tables:** every claim above points to a log or summary file under `<S>/c67r/` that exists.
- **Operator-facing lines describe this commit:** all readings are from HEAD `8b8c3881`.
- **Reaches the assertion:** every mutation run failed at a line of its named set: GROUP''s capacity check (run 2), E-AND's F2′ (run 4) or F4 (runs 5, 7 and 8), and card A's wait line (run 6). Run 3 reached E-AND's PASS.
