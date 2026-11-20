*Filed by the custodian: the series tester's hand-back (claude-sonnet-5-5), 17608 bytes, sha256 92e97117003718ead7d0af2290ef6293f2ed4bb232fb6520ebe99d88b4225204, below the rule, byte for byte but for one masking (a local file time with its zone as <t>), with one final newline added. Calls Bash 166, Grep 1, Write 3, SubagentHandback 1, none errored, by unique call ids, from 2026-11-20T12:41:47Z to 2026-11-20T14:23:17Z by its transcript. PR 341's one series report (ADV-2026-11-16-06), at the final candidate 51fed8a55340c554eb03aa126e4472de49032533 (the 1c form's Amendment 63 item 7). The custodian's checks: each fenced block is in the log it names, line for line, but its S5d line, a byte-exact prefix of the log's line; the hold table equals the tester's stamp files; the Result line's two counts go to the advisor (Amendment 63 item 9).*

---

Series: b2-piece-1c-save-and-reopen P4a at 51fed8a55340c554eb03aa126e4472de49032533, tester, port-5400 harness

Result: All 24 run-suite and measure-exe runs ended rc 0 except `source-changed-post`. It ended rc 3 with S5d INCONCLUSIVE, the same result P3b-2 recorded at its two runs. Nothing was a STOP. Each of the 11 `reopen` rows, R1 to R9 and E-CHANGED, passed.

Model: Sonnet 5.5 (claude-sonnet-5-5), as the harness reports it. No override and no context handoff.

**The four failure classes, as they apply to my harness**
- **The product's interface.** The suites drive the real debug exe and the real measure exe over CDP. The measure exe is the release-profile build from `build:measure`. Vite is the harness's, on 5400, mapped from 5180.
- **Result claims.** Every claim below points to a log in `<H>/out/p4a-e2e-s-<name>.log`, or to `<S>/p4as-*` files. All are on disk.
- **Operator lines.** Each line below describes what was measured at 51fed8a.
- **Assertions reached.** Every suite ran to its own summary or `rc=` line. `residency-harness` is exit code only. E-FL and `recentre-crossing` print figures that I do not record or claim.

**Start state and harness**
- HEAD is 51fed8a55340c554eb03aa126e4472de49032533. The porcelain was empty. `git ls-remote origin cut/b2-piece-1c-p4a` printed 51fed8a55340c554eb03aa126e4472de49032533.
- The `e2e/*.mjs` scripts I needed are all present.
- C: had 46G free and D: 378G, so the STOP floors held.
- `sha256sum -c` printed ten `OK`: run-suite, load, app-up, app-up-wait, app-down, busy, shim/npx.cmd, shim-wait/npx.cmd, the tauri conf and build-exe.
- Every pre-run busy check printed `FREE`.

**Frontends and checks**
- Both `npm ci` and both builds ran. The hold exited 0.
- `ls -la` shows `frontends/shell/src/generated/NOTICE.txt` at 3506979 bytes. The porcelain was empty.
- `npm run typecheck` rc 0 and `npm test` rc 0. The test tally was `Test Files 123 passed (123)` and `Tests 1570 passed (1570)`.

**Exes**
- The debug exe build exited rc 0.
  - Its last lines were `Finished dev profile [unoptimized + debuginfo] target(s) in 1m 31s` and `copied exe`.
  - `spatial-ide-shell-p4a.exe` is 91844608 bytes, mtime 2026-11-20 <t>, sha256 bd5d4fe67a050b137af890404aebf51f36ec5bb2666959e1557f448480b05b73.
- The measure exe build (`build:measure`, under `timeout 4200`) exited rc 0.
  - It took 21m 21s. Its last lines were `Finished release profile [optimized] target(s) in 21m 21s` and `Built application at: C:\dev\wt\1c-p4a\frontends\shell\src-tauri\target\release\spatial-ide-shell.exe`.
  - **Deviation.** The brief's command sets no `CARGO_TARGET_DIR`, so the exe landed in the worktree's ignored `frontends/shell/src-tauri/target/release/`, not in `D:/wt-targets/1c-p4a/release/`.
  - I copied it with `cp` to `D:/wt-targets/1c-p4a/release/spatial-ide-shell.exe` so the brief's measure-run commands ran as written. The copy and the original are both 72728576 bytes with sha256 0721278f92893150b3175ddbdf60cd145af71e2a9ea69c517511a7c1e3c32900.
  - The porcelain stayed empty.

**E-FL and recentre-crossing (measure exe)**
- E-FL ended rc 0 and recentre-crossing rc 0.
- E-FL's log is byte-copied below, apart from two items. I dropped the npm banner lines. I cut the `REPORT qualifying cells` line, which is a list of cell coordinates.
```
precondition: first stream-issued sh_985bfbd7c8fcc69b3e5ed4826ff744c5, its batch rows 10000 (need 10000), fit view-state seen, describe.extent basis not-established-at-open, value null
  fixture sha256 fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49; fit view-state {"targetX":0,"targetY":0,"zoom":-3.692532927362801,"originX":2603460.114163697,"originY":1200019.902370003}
PASS  (b) settle: no viewport_query, stream-issued or batch line for 3 s within 180 s  ::  quiet after 5141 ms of waiting; 150 wire lines in all
PASS  (a) a further stream-issued line arrives after the first look's last batch, with no input  ::  first look sh_985bfbd7c8fcc69b3e5ed4826ff744c5, last batch at line 28; 42 further stream-issued line(s), 42 viewport_query line(s) after it
PASS  (c) .residency-status reads the complete-in-view sentence  ::  .residency-status is "Showing all 30443 features in view"; pattern /^Showing all \d+ features in view$/
  image: C:\dev\wt\1c-p4a\frontends\shell\e2e\out\open-fills-fit-view-efl-1795180323994.png 107990 bytes sha256 cf7fd271ad7847389f4e0dd213d2d537171467ab061d34615974bc570593f519
PASS  (d) every qualifying cell of the 8x8 grid holds a pixel unlike the ring background (tolerance 8)  ::  28 qualifying cell(s) of 64; 0 blank: none; screenshot has a pixel below alpha 255: false
  (e) 0 blank qualifying cell(s) lie wholly above the first look's rows (N > 1201280): none
  REPORT  alpha reading (decides nothing; ring B 255,255,255): qualifying cells with no pixel above alpha 0: none
==== 4/4 PASS ====
```
- recentre-crossing's result lines (the log's last line is `==== 6/6 PASS ====`):
```
PASS  case 1 (a): W is continuous across each origin change  ::  2 origin change(s), worst jump 0.00 buffer px (tol 4)
PASS  case 1 (b): |W_end - W_start| <= d per axis  ::  |E| (0.000, 0.000) vs d 3749.395
PASS  case 1 (d): the drawn data's inner edges do not move  ::  do not differ: start box [left 66, right 667, top 0, bottom 357], end box [left 66, right 667, top 0, bottom 357]; K {left, bottom}; moves left 0.00, bottom 0.00 buffer px (tol 4)
PASS  case 2 (i): no origin change from the double-click to its settle  ::  20 line(s), 0 origin change(s), settled true
PASS  case 2 (ii): the zoom after the double-click is the zoom before plus 1  ::  zoom -3.692532927362801 -> -2.692532927362801 (+1)
PASS  case 2 (iii): W is continuous across the origin change at the wheel tick  ::  1 origin change(s), worst jump 0.00 buffer px (tol 4)
==== 6/6 PASS ====
```
- No figure from either run is recorded or claimed. Only their verdicts and exit codes are.

**Suite runs**

All started at head 51fed8a. Start and end are the UTC times from each log's `start` and `rc=… end` lines. The counts come from `[step] PASS/FAIL/SKIP` and `PASS` lines in the logs.

| tag | start | end | rc | PASS / FAIL |
|---|---|---|---|---|
| s-regression | 13:16:45 | 13:21:38 | 0 | 17 / 0 |
| s-refusal-contract-baseline | 13:22:33 | 13:23:20 | 0 | 3 / 0 |
| s-admission | 13:23:52 | 13:24:32 | 0 | 11 / 0 |
| s-filter | 13:25:08 | 13:25:24 | 0 | 3 / 0 |
| s-filter-panel | 13:26:04 | 13:26:44 | 0 | 5 / 0 |
| s-style | 13:27:20 | 13:27:33 | 0 | 6 / 0 |
| s-publish | 13:28:07 | 13:38:48 | 0 | 4 / 0, 1 SKIP (EXPIRED') |
| s-console | 13:39:25 | 13:45:47 | 0 | 11 / 0 |
| s-layout | 13:46:33 | 13:47:31 | 0 | 11 / 0 |
| s-selection | 13:48:07 | 13:57:43 | 0 | 18 / 0, 1 SKIP (EXPORT-TODAY) |
| s-export-view | 13:58:19 | 13:58:45 | 0 | 4 / 0 (its summary line) |
| s-recording | 13:59:23 | 13:59:31 | 0 | 5 / 0 |
| s-command-bar | 14:00:07 | 14:02:15 | 0 | 14 / 0 |
| s-attributes | 14:03:01 | 14:05:22 | 0 | 2 / 0 (its summary line) |
| s-table | 14:05:56 | 14:07:04 | 0 | 4 / 0 |
| s-project | 14:07:38 | 14:08:10 | 0 | 12 / 0 |
| s-reopen | 14:09:25 | 14:10:27 | 0 | 10 / 0 |
| s-residency-harness | 14:11:09 | 14:11:27 | 0 | exit code only |
| s-pan-anchor | 14:12:05 | 14:15:06 | 0 | 16 / 0 |
| s-source-watch-idle | 14:15:42 | 14:16:01 | 0 | 8 / 0 |
| s-source-changed-pre | 14:16:37 | 14:17:01 | 0 | 7 / 0 |
| **s-source-changed-post** | 14:17:36 | 14:18:00 | **3** | 6 / 0, S5d INCONCLUSIVE |
| s-source-changed-reopen | 14:18:39 | 14:19:30 | 0 | 11 / 0 |
| s-colour | 14:20:03 | 14:20:46 | 0 | 5 / 0 |

- Every run's first line was `worktree C:/dev/wt/1c-p4a head 51fed8a55340c554eb03aa126e4472de49032533 start <time>`. Every teardown printed `killed tree <pid>` twice, then `port 9223 free` and `port 5400 free`.
- Each run's load line, last two lines and `rc=` line are in `<H>/out/p4a-e2e-s-<name>.log` and `<H>/out/p4a-e2e-loads.txt`. Reproducing them all here would not fit.
- The load samples ran from 5 to 25 percent (e.g. `load s-regression 13:16:35Z 16,4,3`, `load s-source-changed-pre 14:16:28Z 25,1,11`).
- I copied a session log to `<S>/p4as-<tag>.session.log` for every run after `s-regression`, except the build runs. Each app named a session log under `<u>`.
- Step lines are in each log. The `[hover-barrier]` lines in `regression`, `selection` and `console` are in the logs too, and I did not copy them here.

**Result lines (selected, byte-copied)**

`s-regression`, all 17 PASS:
```
[A1'] PASS (3ms)  [A3'] PASS (129ms)  [A4'] PASS (6476ms)  [A5'/A6'] PASS (4306ms)  [A7'] PASS (16080ms)  [A8'] PASS (7144ms)  [A9'] PASS (11626ms)  [K6] PASS (55936ms)  [K7] PASS (130741ms)  [CURSOR'] PASS (312ms)  [FIND'] PASS (25290ms)  [MP'] PASS (3846ms)  [PT'] PASS (4754ms)  [LN'] PASS (4734ms)  [B2'/B3'] PASS (42ms)  [ABSENTCRS'] PASS (5093ms)  [C2'/C3'] PASS (5152ms)
```
(That line shows the step names and milliseconds only. The full text of each step is in the log.)

`s-reopen` (`reopen.mjs`), byte-copied. Each result line gives the Console ring's fill:
```
[R1] PASS (5184ms): F1 (parcels.parquet in folder P) admitted; the Save control and the first pixels are there
[R2] PASS (8736ms): two clauses (the second off), the fill colour #112233 and the camera at (2600900.3333333335, 1200900.2857142857), zoom -0.8571428571428572
[R3] PASS (43ms): saved into P through the hook; spatial://project/ad7095ca2d4cae73625694c402fd486c; locators machine-recorded,project-relative
[R4] PASS (19ms): refused as skp.project_open_elsewhere with S9's own-window place; the run ended; the open and its two clauses are kept
[R5] PASS (6047ms): another file opened; the first handle's close_dataset row is at ok (▾ Console — 256 actions (336 dropped); the close_dataset row has 10 entries after it)
[R6] PASS (4283ms): opened; the open_project request carries answer and relink null, outcome ok (▾ Console — 256 actions (559 dropped); the open_project row has 3 entries after it); filter, clauses, fill colour, opacity and view equal the file's, the view bit for bit
[R7] PASS (26ms): the save answered not-asked (no picker slot used); the file's identity and workspace are unchanged
[R8] PASS (6492ms): P's handle closed (▾ Console — 256 actions (658 dropped); the close_dataset row has 14 entries after it); Q (a hand copy of P) gave S8 with its text; the same choice opened it (▾ Console — 256 actions (886 dropped)); folders.json lists both folders
[R9] PASS (12001ms): P2's handle closed (▾ Console — 256 actions (1156 dropped); the close_dataset row has 14 entries after it); P2's data moved; S11 named moved-away.parquet; the re-link slot's file opened the project
[E-CHANGED] PASS (12153ms): F4's predecessor handle closed (▾ Console — 256 actions (1620 dropped); the close_dataset row has 8 entries after it); F4 (F1 with its mtime 60 s later) opened; the notice names mtime alone: ["[P6 placeholder] The data differs from what the project recorded when it was saved. In the file: mtime. The project was opened on the data as it is now."]
rc=0 end 2026-11-20T14:10:27Z
```

`s-project` (E-SAVE) beside P3b-2's series report. All 12 steps (OPEN, CLAUSES, STYLE, POSE, SAVE, READBACK-FILTER, READBACK-STYLE, READBACK-VIEW, SECOND-SAVE, INSIDE-OPEN, INSIDE-SAVE, NOTICE-S18) PASS in both. I compared them mechanically after stripping the milliseconds and the 32-hex project URIs from both sides.
- Two things differ, and neither is a step result. The P3b-2 report prints INSIDE-OPEN's file name without a character, and the report's own `project` lines stop one line short of NOTICE-S18 in my extraction range. The current log's INSIDE-OPEN name holds a U+007F byte, which `project.mjs` line 343 declares. That is the suite's design, not a difference in the product.
- The two minted project URIs differ, as they did between P3b-1 and P3b-2. SAVE was `…/43b8e0abeb18346c3c49512cea379cd4` and is `…/6c84941180f9d1308d4f8dd99ff80561`. INSIDE-SAVE was `…/d1b0c1e3c448a2ee6ca659bb706ad6e6` and is `…/909ab322e6e2d9a3a3594733b0b0752d`. I did not look into why.
- The project.spatial size (2497 characters) and the three view patterns (4143d7e22aaaaaab, 4132530449249249, bfeb6db6db6db6dc) are identical in both runs.
- Milliseconds, P3b-2 then now: OPEN 5204/5370, CLAUSES 8126/7292, STYLE 3542/3528, POSE 3268/3259, SAVE 38/51, READBACK 0,1,1 / 0,0,0, SECOND-SAVE 43/45, INSIDE-OPEN 5993/5810, INSIDE-SAVE 44/36, NOTICE-S18 10/10.

**Failure: `source-changed-post`, rc 3, recorded as seen and not re-run**
- Steps S1, S2, S4, S5a, S5b and S5c PASS, and S3 is an INFO line. The failing line is:
```
[S5d-post-check-route-confirmed] INCONCLUSIVE: S5d: INCONCLUSIVE (never a pass): a tile mint was refused with engine.source_changed and the pre-check's own descriptor detail ({mtime}) -- a sibling tile's pre-check found the change while the generation was live at its live check; which kernel route ended the generation is not read by this step, so the post-check route is neither shown nor excluded.
```
- The log ends with `rc=3 end 2026-11-20T14:18:00Z`, and the run's lines are in `<H>/out/p4a-e2e-s-source-changed-post.log`.
- This is the same result P3b-2 recorded at both its runs (rc 3, 6 PASS, S5d INCONCLUSIVE), including its rerun.
- I did not classify it as depending on timing in this shared run, so I did not re-run it. That judgment is mine; the custodian decides.
- `s-source-changed-pre` passed 7 of 7. `s-source-changed-reopen` passed 11 of 11.
- There was no other failure, so no `-2` tag exists.

**Holds**

All 30 holds were granted. None exited 96 to 99. Times are UTC. "Granted" is the start of the hold's command; I did not stamp it for h1 and h2. All ended exit 0 except h28, which was the rc 3 above.

| hold | what | asked | granted | ended |
|---|---|---|---|---|
| h1 | frontends | 12:43:14 | (not stamped) | about 12:44:20 |
| h2 | typecheck and `npm test` | 12:45:02 | (not stamped) | (not stamped) |
| h3 | debug exe | 12:47:32 | 12:47:34 | 12:49:08 |
| h4 | measure exe | 12:49:30 | 12:49:32 | 13:11:23 |
| h5 | E-FL | 13:12:00 | 13:12:02 | 13:12:13 |
| h6 | recentre-crossing | 13:12:29 | 13:12:31 | 13:15:47 |
| h7 | regression | 13:16:33 | 13:16:34 | 13:21:48 |
| h8 | refusal-contract-baseline | 13:22:17 | 13:22:19 | 13:23:24 |
| h9 | admission | 13:23:42 | 13:23:43 | 13:24:37 |
| h10 | filter | 13:24:56 | 13:24:58 | 13:25:30 |
| h11 | filter-panel | 13:25:51 | 13:25:53 | 13:26:49 |
| h12 | style | 13:27:08 | 13:27:10 | 13:27:38 |
| h13 | publish | 13:27:55 | 13:27:57 | 13:38:53 |
| h14 | console | 13:39:14 | 13:39:16 | 13:45:54 |
| h15 | layout | 13:46:19 | 13:46:21 | 13:47:36 |
| h16 | selection | 13:47:56 | 13:47:58 | 13:57:48 |
| h17 | export-view | 13:58:07 | 13:58:09 | 13:58:50 |
| h18 | recording | 13:59:11 | 13:59:13 | 13:59:36 |
| h19 | command-bar | 13:59:55 | 13:59:57 | 14:02:21 |
| h20 | attributes | 14:02:47 | 14:02:49 | 14:05:26 |
| h21 | table | 14:05:45 | 14:05:47 | 14:07:09 |
| h22 | project | 14:07:27 | 14:07:29 | 14:08:15 |
| h23 | reopen | 14:09:14 | 14:09:16 | 14:10:32 |
| h24 | residency-harness | 14:10:56 | 14:10:58 | 14:11:32 |
| h25 | pan-anchor | 14:11:53 | 14:11:55 | 14:15:11 |
| h26 | source-watch-idle | 14:15:30 | 14:15:32 | 14:16:06 |
| h27 | source-changed-pre | 14:16:26 | 14:16:28 | 14:17:05 |
| h28 | source-changed-post | 14:17:25 | 14:17:27 | 14:18:04 |
| h29 | source-changed-reopen | 14:18:28 | 14:18:30 | 14:19:35 |
| h30 | colour | 14:19:53 | 14:19:54 | 14:20:51 |

- The hold lines I read, h1 to h7, h22 and h28, carried `also=<m>`. I did not read every hold's line.
- The `also=` value does not say whose process it names, so I cannot say whether any of my holds stood beside another hold of this project.
- The suites' load samples all show some other CPU use. Those figures are in `<H>/out/p4a-e2e-loads.txt`.

**Fixtures, locks and the end state**
- `<S>/p4as-fix-before.txt` and `<S>/p4as-fix-after.txt` each hold 34 files with size and sha256. `cmp` printed nothing and its rc was 0. I regenerated none, and the 5 GB fixture was not used.
- At the end HEAD was 51fed8a55340c554eb03aa126e4472de49032533 and the porcelain was empty.
- `git diff --quiet HEAD -- Cargo.lock frontends/shell/src-tauri/Cargo.lock frontends/shell/package-lock.json renderer/bundle-viewer/package-lock.json` gave rc 0.
- `df -h`: C: 42G free (92% used), D: 376G free (20% used).
- `du -sm D:/wt-targets/1c-p4a` is 9294 MB.
- The last `p4a-e2e-busy.ps1`, in a call of its own, printed `FREE`. No background shell or process I started is still running.

**Anything not named in the brief**
- The `cp` of the measure exe into `D:/wt-targets/1c-p4a/release/`, described above.
- I wrote `<S>/p4as-sum.sh` and `<S>/p4as-wait.sh` as helpers, plus `p4as-h*.{asked,start,end}` stamps and the `p4as-*` log, rc, session-log and diff scratch files. All are under `<S>`.
- I also wrote `<S>/p4as-typecheck.log`, `<S>/p4as-test.log` and `<S>/p4as-measure-build.log`. I redirected the typecheck and test output to files, and took the tallies from them.
- I waited with bounded `sleep` loops that ended on a stamp file. Those loops are done.
- I wrote the stamps with `date -u`.
- Publish and selection wrote under the worktree's ignored `target/` (`e2e-publish-out`, `e2e-selection-out`), and the suites wrote under `D:/wt-data/1c-p4a`.
- The `publish` suite built `kernel/examples/verify-bundle` itself (about 10 minutes of its 10m41s).
- Brief steps 3 and 4 ask to "give each rc". I gave them from `.rc` files I wrote, and from `$?` in the chain.
- I did not use `git stash`, a commit, a push, a checkout or any `claude` command, and I edited no tracked file.
