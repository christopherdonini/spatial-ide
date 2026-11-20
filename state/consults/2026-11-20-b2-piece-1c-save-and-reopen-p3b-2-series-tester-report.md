*Filed by the custodian: the series tester's hand-back (claude-sonnet-5-5), 33745 bytes, sha256 71f75b049e249870eae18878c5848a711a8b021aa1579141e2c74d8c5c26bb95, below the rule, byte for byte but for three maskings (the file owner's account and group as <u>, two local file times as <t>, one with its zone remark), with one final newline added. Calls Bash 196, Write 9, Read 1, SubagentHandback 1, none errored, by unique call ids, from 2026-11-20T02:29:46Z to 2026-11-20T04:09:39Z by its transcript. PR 340's one series report (ADV-2026-11-16-06), at the final candidate 231b32cc388b293dc6030f5f92c8b044c85c663a (the 1c form's Amendment 51 item 5).*

---

Series: b2-piece-1c-save-and-reopen P3b-2 at 231b32cc388b293dc6030f5f92c8b044c85c663a, tester, port-5400 harness

Result: every step ran once at H with no STOP. The shell checks, the 3 cargo steps, both exes and the two measure-exe runs all ended rc 0. 22 of 23 e2e suites ended rc 0. `source-changed-post` ended rc 3 with S5d INCONCLUSIVE, and its one rerun ended the same way, so it counts as no pass. The one INCONCLUSIVE is deterministic, not timing. `source-changed-post` also ended rc 3 at e1fd8495 (S9).

Conventions
- `<S>` is the scratchpad folder and `<H>` is `<S>/p3b2-e2e-h`.
- My screen views cut long lines. Every quoted line below is a byte-exact prefix of the real line, cut at 140 to 260 characters. The full lines are in `<H>/out/p3b2-e2e-<tag>.log`, and my own per-suite copies are `<S>/p3b2s-sum-<name>.txt`.
- `…` marks a cut. Lines marked "(cut)" are shown to the cut point.
- Hold and release lines carried `also=<m>`. I did not read what that value was.

**Start state**
- HEAD was 231b32cc388b293dc6030f5f92c8b044c85c663a and the porcelain was empty.
- `git ls-remote origin cut/b2-piece-1c-p3b-2` printed `231b32cc388b293dc6030f5f92c8b044c85c663a	refs/heads/cut/b2-piece-1c-p3b-2`.
- Every `e2e/*.mjs` script the brief names was present.
- `df -h`: C: 46G free, D: 371G free.
- `sha256sum -c`: ten `OK` lines (run-suite, load, app-up, app-up-wait, app-down, busy, shim/npx.cmd, shim-wait/npx.cmd, tauri.conf.json, build-exe).
- I read the four named harness scripts whole and changed none.
- Fixtures before: 34 files, with sizes and sha256 in `<S>/p3b2s-fix-before.txt`.

**Frontends (hold 1)**
- `bv npm ci rc=0`, `bv build rc=0`, `shell npm ci rc=0`, `shell build rc=0`.
- `NOTICE.txt`: `-rw-r--r-- 1 <u> <u> 3506979 <t>`.
- The porcelain was empty after the build.

**Shell checks (hold 2)**
- `typecheck rc=0` and `npm test rc=0`.
- Tally lines: ` Test Files  120 passed (120)` and `      Tests  1542 passed (1542)`.

**Kernel focused targets (hold 3): `kernel rc=0`**
- unit tests (lib): ok. 193 passed; 0 failed; 1 ignored
- `no_generation_in_persisted_artifacts`: ok. 9 passed; 0 failed
- `project_lock_crash`: ok. 2 passed; 0 failed
- `project_reopen`: ok. 43 passed; 0 failed
- `project_reopen_skp`: ok. 7 passed; 0 failed
- `project_save`: ok. 23 passed; 0 failed
- `project_save_skp`: ok. 7 passed; 0 failed
- `project_store`: ok. 5 passed; 0 failed
- `session_history`: ok. 13 passed; 0 failed
- `skp_admission`: ok. 10 passed; 0 failed
- `skp_admission_remediation`: ok. 7 passed; 0 failed
- `skp_cancel_terminal_without_credit`: ok. 2 passed; 0 failed
- `skp_filter_cancellation`: ok. 1 passed; 0 failed (52.01s)
- `skp_projection`: ok. 14 passed; 0 failed

**Protocol, `cargo test --locked -p spatial-skp` (hold 4): `skp rc=0`**
- unit tests: ok. 33 passed; 0 failed
- `conformance`: ok. 1 passed; 0 failed
- `fixtures`: ok. 29 passed; 0 failed
- Doc-tests: ok. 0 passed; 0 failed

**src-tauri (hold 5): `src-tauri rc=0`**
- lib: ok. 76 passed; 0 failed
- main: ok. 0 passed; 0 failed
- `sole_caller_scan`: ok. 2 passed; 0 failed
- Doc-tests: ok. 0 passed; 0 failed

**Exes**
- Debug exe (hold 6): hold rc 0 and build rc 0. Last five lines:
```
   Compiling spatial-engine v0.0.0 (C:\dev\wt\1c-p3b-2\engine)
   Compiling spatial-ide-shell v0.1.0 (C:\dev\wt\1c-p3b-2\frontends\shell\src-tauri)
   Compiling spatial-kernel v0.0.0 (C:\dev\wt\1c-p3b-2\kernel)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 2m 38s
copied exe
```
- `spatial-ide-shell-p3b2.exe`: 91867136 bytes, mtime <t>, sha256 9a51e3f342524c9de2795d92aec79f8bfed56c359d2204e875db03b41af93752.
- Measure exe (hold 7): `measure build rc=0`. Last lines of the log:
```
   Compiling spatial-skp v0.0.0 (C:\dev\wt\1c-p3b-2\protocol\skp)
   Compiling spatial-renderer v0.0.0 (C:\dev\wt\1c-p3b-2\renderer)
   Compiling spatial-data-plane v0.0.0 (C:\dev\wt\1c-p3b-2\protocol\data-plane)
   Compiling open v5.4.1
   Compiling spatial-ide-shell v0.1.0 (C:\dev\wt\1c-p3b-2\frontends\shell\src-tauri)
   Compiling duckdb v1.10505.0
   Compiling spatial-engine v0.0.0 (C:\dev\wt\1c-p3b-2\engine)
   Compiling spatial-kernel v0.0.0 (C:\dev\wt\1c-p3b-2\kernel)
    Finished `release` profile [optimized] target(s) in 22m 00s
       Built application at: D:\wt-targets\1c-p3b-2\release\spatial-ide-shell.exe
```
- `release/spatial-ide-shell.exe`: 72724992 bytes, sha256 3ab5bcae733b59b60849e7d2488c5cfc3dd1ae3ec083e97e12bd7f60ea25b5b2.
- The porcelain was empty after both builds.

**E-FL (hold 8): rc 0. Full log, byte-copied**
```
> spatial-ide-shell@0.1.0 e2e:open-fills-fit-view
> node e2e/open-fills-fit-view.mjs --measure-build D:/wt-targets/1c-p3b-2/release/spatial-ide-shell.exe

precondition: first stream-issued sh_c783df3d745e65aaddb6caa9a0b14bdc, its batch rows 10000 (need 10000), fit view-state seen, describe.extent basis not-established-at-open, value null
  fixture sha256 fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49; fit view-state {"targetX":0,"targetY":0,"zoom":-3.692532927362801,"originX":2603460.114163697,"originY":1200019.902370003}
PASS  (b) settle: no viewport_query, stream-issued or batch line for 3 s within 180 s  ::  quiet after 5385 ms of waiting; 150 wire lines in all
PASS  (a) a further stream-issued line arrives after the first look's last batch, with no input  ::  first look sh_c783df3d745e65aaddb6caa9a0b14bdc, last batch at line 28; 42 further stream-issued line(s), 42 viewport_query line(s) after it
PASS  (c) .residency-status reads the complete-in-view sentence  ::  .residency-status is "Showing all 30443 features in view"; pattern /^Showing all \d+ features in view$/
  image: C:\dev\wt\1c-p3b-2\frontends\shell\e2e\out\open-fills-fit-view-efl-1795144053268.png 107990 bytes sha256 cf7fd271ad7847389f4e0dd213d2d537171467ab061d34615974bc570593f519
PASS  (d) every qualifying cell of the 8x8 grid holds a pixel unlike the ring background (tolerance 8)  ::  28 qualifying cell(s) of 64; 0 blank: none; screenshot has a pixel below alpha 255: false
  (e) 0 blank qualifying cell(s) lie wholly above the first look's rows (N > 1201280): none
  REPORT  alpha reading (decides nothing; ring B 255,255,255): qualifying cells with no pixel above alpha 0: none
  REPORT  qualifying cells: (1,0)o+ (2,0)o+ (3,0)o+ (4,0)o+ (5,0)o+ (6,0)o+ (7,0)o+ (1,1)o+ (2,1)o+ (3,1)o+ (4,1)o+ (5,1)o+ (6,1)o+ (7,1)o+ (1,2)i+ (2,2)i+ (3,2)i+ (4,2)i+ (5,2)i+ (6,2)i+ (7,2)i+ (1,3)i+ (2,3)i+ (3,3)i+ (4,3)i+ (5,3)i+ (6,3)i+ (7,3)i+

==== 4/4 PASS ====
```

**recentre-crossing (hold 9): rc 0**
```
PASS  case 1 (a): W is continuous across each origin change  ::  2 origin change(s), worst jump 0.00 buffer px (tol 4)
PASS  case 1 (b): |W_end - W_start| <= d per axis  ::  |E| (0.000, 0.000) vs d 3749.395
PASS  case 1 (d): the drawn data's inner edges do not move  ::  do not differ: start box [left 66, right 667, top 0, bottom 357], end box [left 66, right 667, top 0, bottom 357]; K {left, bottom}; moves left 0.00, bottom 0.00 buffer px (tol 4)
PASS  case 2 (i): no origin change from the double-click to its settle  ::  20 line(s), 0 origin change(s), settled true
PASS  case 2 (ii): the zoom after the double-click is the zoom before plus 1  ::  zoom -3.692532927362801 -> -2.692532927362801 (+1)
PASS  case 2 (iii): W is continuous across the origin change at the wheel tick  ::  1 origin change(s), worst jump 0.00 buffer px (tol 4)
==== 6/6 PASS ====
```
Last line: `==== 6/6 PASS ====`. No figure from either run is recorded or claimed. Only their verdicts and exit codes are.

**Suite runs (all at head 231b32cc)**
Start and end are from each log's `start …Z` and `rc=… end …Z` lines. The PASS and FAIL counts are from the log's `PASS`/`FAIL` step lines, or from the suite's own summary line where it prints one (marked *).

| tag | start | end | rc | PASS / FAIL | load |
|---|---|---|---|---|---|
| s-regression | 03:13:18 | 03:18:18 | 0 | 17 / 0 | 3,3,13 |
| s-refusal-contract-baseline | 03:19:21 | 03:20:09 | 0 | 3 / 0 | 17,5,2 |
| s-admission | 03:20:49 | 03:21:29 | 0 | 11 / 0 | 15,6,4 |
| s-filter | 03:22:07 | 03:22:23 | 0 | 3 / 0 | 40,14,12 |
| s-filter-panel | 03:23:02 | 03:23:43 | 0 | 5 / 0 | 15,3,5 |
| s-style | 03:24:19 | 03:24:32 | 0 | 6 / 0 | 15,3,3 |
| s-publish | 03:25:08 | 03:25:31 | 0 | 4 / 0, 1 SKIP (EXPIRED') | 9,15,3 |
| s-console | 03:26:05 | 03:32:31 | 0 | 11 / 0 | 9,5,6 |
| s-layout | 03:33:16 | 03:34:15 | 0 | 11 / 0 | 26,1,4 |
| s-selection | 03:34:50 | 03:44:35 | 0 | 18 / 0, 1 SKIP (EXPORT-TODAY) | 12,4,10 |
| s-export-view | 03:45:12 | 03:45:39 | 0 | 4 / 0 * | 7,7,1 |
| s-recording | 03:46:18 | 03:46:27 | 0 | 5 / 0 | 3,3,11 |
| s-command-bar | 03:47:04 | 03:49:11 | 0 | 14 / 0 | 8,3,9 |
| s-attributes | 03:49:55 | 03:52:18 | 0 | 2 / 0 * | 10,8,4 |
| s-table | 03:52:52 | 03:54:01 | 0 | 4 / 0 * | 10,6,4 |
| s-project | 03:54:39 | 03:55:12 | 0 | 12 / 0 | 19,4,14 |
| s-residency-harness | 03:55:50 | 03:56:07 | 0 | exit code only | 1,9,4 |
| s-pan-anchor | 03:56:44 | 03:59:46 | 0 | 16 / 0 | 14,13,7 |
| s-source-watch-idle | 04:00:26 | 04:00:45 | 0 | 8 / 0 | 11,6,2 |
| s-source-changed-pre | 04:01:22 | 04:01:50 | 0 | 7 / 0 | 7,26,57 |
| **s-source-changed-post** | 04:02:26 | 04:02:50 | **3** | 6 / 0, S5d INCONCLUSIVE | 13,6,6 |
| s-source-changed-reopen | 04:03:42 | 04:04:34 | 0 | 11 / 0 | 11,11,10 |
| s-colour | 04:05:11 | 04:05:53 | 0 | 5 / 0 | 12,5,10 |
| s-source-changed-post-2 (rerun) | 04:06:33 | 04:06:57 | 3 | 6 / 0, S5d INCONCLUSIVE | 7,0,4 |

Every run's teardown printed `killed tree <pid>` twice, then `port 9223 free` and `port 5400 free`. Every pre-run busy check printed `FREE`. The app-launching suites printed `This run launched the app; it stays RUNNING on CDP port 9223…`, or "LAUNCHED the app; it stays running" and then a clean teardown. The teardown was clean in every case.

Each run's first line was `worktree C:/dev/wt/1c-p3b-2 head 231b32cc388b293dc6030f5f92c8b044c85c663a start <time>`. Step lines follow, with the load line and session log for each run. Session logs are copied to `<S>/p3b2s-s-<name>.session.log`, from the file the app's stderr names.

*s-regression (session-1795144407.log)*
```
[A1'] PASS (3ms): title/header "Spatial IDE" present; "Open GeoParquet…" button present
[A3'] PASS (157ms): admitted; DescribeSummary contains the five expected substrings; no refusal panel appears
[A4'] PASS (6674ms): overall 26.8% non-bg; 6/9 grid cells > 5%; "Zoom to layer" present (settled=true)
[A5'/A6'] PASS (4326ms): pan settled=true, zoom settled=true; no refusal/banner either time; pixels 25.3% non-bg after
[A7'] PASS (17003ms): panned off-data (2 drag(s) of 1002px, 0.00% non-bg <= 0.5% threshold), clicked "Zoom to layer", pixels 42.5% non-bg after (settled=true)
[A8'] PASS (7306ms): 16 alternating pan/zoom gestures, no settle waits between; settled after=true; no refusal/banner; no too_many_pending_streams
[A9'] PASS (11518ms): interior-verified candidate found at zoom notch 4/15 …(cut)
[K6] PASS (55923ms): (i) continuous: hovered "id 21981 @ (2604354.373, 1202780.000)" at zoom-in notch 0, one coalesced camera change ("Zoom to layer") …(cut)
[K7] PASS (133698ms): 15/15 discrete zoom-OUT notches from a "Zoom to layer" fit on the candidate arm (readback asserted); …(cut)
[CURSOR'] PASS (596ms): hover cursor "crosshair", mid-drag cursor "grabbing"
[FIND'] PASS (27082ms): applied "id > 99900" via the real panel DOM, scan completed on its own; …(cut)
[MP'] PASS (3879ms): admitted; DescribeSummary shows the engine's multipolygon encoding and the file's declaration; no refusal or banner after the stream (settled=true)
[PT'] PASS (4949ms): admitted; DescribeSummary shows the engine's point encoding and the file's declaration; no refusal or banner after the stream (settled=true)
[LN'] PASS (4769ms): admitted; DescribeSummary shows the engine's linestring encoding and the file's declaration; no refusal or banner after the stream (settled=true)
[B2'/B3'] PASS (57ms): refused engine.crs_undeclared; message verbatim; .crs-assertion-form present; no dismiss button on the panel; no describe-summary in the Layers region
[ABSENTCRS'] PASS (5102ms): refused engine.format_default_contradicted; message verbatim; …(cut)
[C2'/C3'] PASS (4976ms): (a) admitted; Identity "session-ordinal:file_row_number — by-construction-within-generation"; …(cut)
This run launched the app; it stays RUNNING on CDP port 9223 for further interactive use.
rc=0 end 2026-11-20T03:18:18Z
```

*s-refusal-contract-baseline (session-1795144765.log)*
```
[OVERCEIL'] PASS (9713ms): admitted (render-side refusal, not admission-side); .canvas-refusal and .residency-status both present after settle; 78191 of 100000 features rendered (23.8% pixels non-bg); Dismiss removed the banner but .residency-status remained
[REOPEN'] PASS (18196ms): reopened 100k fixture -> admitted; .residency-status cleared immediately (dataset change, not Dismiss); canvas 48.1% non-bg after settle
[SLOW'/CANCEL'] PASS (13121ms): OVERCEIL' pattern observed openly (163440 of 4000000); applied "id > 3999900" (handle sh_4b820d66e2eaf8d07b46e5f2fac90840, …(cut)
This run launched the app; it stays RUNNING on CDP port 9223 for further interactive use.
rc=0 end 2026-11-20T03:20:09Z
```

*s-admission (session-1795144853.log)*
```
[ASSERT'] PASS (5285ms) · [PASTED'] PASS (5160ms) · [AXISTRAP'] PASS (87ms) · [NODEF'] PASS (42ms) · [MAP'] PASS (10259ms) · [DUPKEY'] PASS (95ms) · [BOTHNEEDED'] PASS (10358ms) · [CONFLICT'] PASS (49ms) · [CANCELOPEN'] PASS (437ms) · [NOPERSIST'] PASS (39ms) · [OVERBOUND'] PASS (1659ms)
```
(one step per line in the log; the PASS text after each is on the log. e.g. `[PASTED'] PASS (5160ms): same definition with one trailing-whitespace byte appended -> admitted with provenance "pasted" (no normalization at the UI seam)`, `[AXISTRAP'] PASS (87ms): axis directions swapped to a real, ESTABLISHED but non-x-first order -> engine.axis_order_unsupported (refused, not reinterpreted); .crs-assertion-form still present`, `[NODEF'] PASS (42ms): a valid definition with no coordinate_system at all -> engine.axis_order_unestablished; .crs-assertion-form still present`)
```
This run launched the app; it stays RUNNING on CDP port 9223 for further interactive use.
rc=0 end 2026-11-20T03:21:29Z
```

*s-filter (session-1795144931.log)*
```
[OPEN] PASS (63ms): admitted; window.__SPATIAL_E2E__.queryWithFilter now registered (dataset-scoped)
[FILTER'] PASS (9912ms): admitted; unfiltered 16.5% non-bg, filtered 4.4% non-bg (< 60% of unfiltered); filtered stream rendered, not blank (settled=true)
[REFUSED'] PASS (21ms): refused skp.filter_unknown_column; message verbatim; call resolved (no crash/hang)
This run launched the app; it stays RUNNING on CDP port 9223 for further interactive use.
rc=0 end 2026-11-20T03:22:23Z
```

*s-filter-panel (session-1795144986.log)*
```
[OPEN] PASS (63ms): admitted; .filter-panel now mounted (keyed on the dataset handle)
[PANEL'] PASS (10192ms): typed + Apply via the real DOM; unfiltered 16.5% non-bg, filtered 4.4% non-bg (< 60% of unfiltered)
[PANELREFUSE'] PASS (5009ms): refused skp.filter_unknown_column; message verbatim; previous filtered view still rendered (4.38% non-bg, within 2 pts of PANEL''s own fraction)
[CLEAR'] PASS (5005ms): unfiltered fraction restored (16.5% non-bg, >= 90% of original); .filter-refusal and .filter-active both cleared
[FIND'] PASS (14167ms): fresh open; applied "id > 3999900" via the real DOM; scan completed on its own (liveness/Cancel both gone, no .scan-incomplete); …(cut)
This run launched the app; it stays RUNNING on CDP port 9223 for further interactive use.
rc=0 end 2026-11-20T03:23:43Z
```

*s-style (session-1795145064.log)*
```
[OPEN] PASS (98ms): admitted; .style-panel mounted collapsed by default
[STYLE'] PASS (5550ms): baseline dominant 47,94,172,180; set fill_color=#cc2200/fill_opacity=1 via the real DOM …(cut)
[OPACITY'] PASS (145ms): set fill_opacity=0.4 via the real DOM; dominant non-bg bin CHANGED 204,34,0,255 -> 82,14,0,102
[OUTLINE'] PASS (238ms): outline_color=#00ccff/outline_width=8 via the real DOM -> "0,204,255,255" appeared in topColors; outline_width=0 -> it disappeared
[DOC'] PASS (3ms): pre.style-document matches the current controls exactly (fill_color literal "#cc2200" among them)
[RESET'] PASS (132ms): button.style-reset clicked; document returned to DEFAULT_STYLE_STATE exactly …(cut)
This run launched the app; it stays RUNNING on CDP port 9223 for further interactive use.
rc=0 end 2026-11-20T03:24:32Z
```

*s-publish (session-1795145122.log)*
```
[OPEN] PASS (383ms): admitted; window.__SPATIAL_E2E__.publishPrepareWithDestination now registered (dataset-scoped)
[APPROVED'] PASS (3106ms): prepared+executed with attempt 5935b734ebdae3a0767f59a62cb18eaf; bundle verified (2000 rows, 1 partitions); 2 audit lines (intent+outcome success, …(cut)
[REFUSED'] PASS (38ms): prepared with attempt 1b7374f4f8bc90474ae4598a77e92ffd, refused on the wrong phrase; no bundle directory, no .staging-* debris under …(cut)
[EXPIRED'] SKIP: no TTL-shortening env/test knob exists for PENDING_ATTEMPT_TTL (600s, publish.rs); sleeping out the TTL for one E2E assertion is not cheap (NEXT-CUT.md P4 permits skipping with a stated reason). …(cut)
[FILTERED'] PASS (3185ms): filter_scope null under whole-file with the filter on; manifest.operation.filter={"kind":"whole-file"}; bundle rows=2000 == full dataset (2000) …(cut)
This run launched the app; it stays RUNNING on CDP port 9223 for further interactive use.
rc=0 end 2026-11-20T03:25:31Z
```

*s-console (session-1795145170.log)*
```
[HEADER'] PASS (19ms) · [ECHO'] PASS (189ms) · [TWOCMD'] PASS (254ms) · [HEXLIM'] PASS (4336ms) · [REFUSAL'] PASS (348ms) · [CLASSB'] PASS (185ms) · [CLASSC'] PASS (701ms) · [GROUP'] PASS (7412ms) · [COPYTRUNC'] PASS (133ms) · [UNCLASS'] PASS (33ms) · [REGRESS'] PASS (365077ms)
```
(one per line in the log; e.g. `[ECHO'] PASS (189ms): open_dataset request parses as JSON with exactly {skp, path, cancel_key, crs_assertion, identity}; crs_assertion/identity explicit null; label version "skp/0.14" === the entry'…`, `[REGRESS'] PASS (365077ms): npm run e2e:regression exited 0 (323208ms); npm run e2e:admission exited 0 (41869ms); both attached to THIS run's own already-launched app (same fresh session)`)
```
This run launched the app; it stays RUNNING on CDP port 9223 for further interactive use.
rc=0 end 2026-11-20T03:32:31Z
```

*s-layout (session-1795145601.log)*
```
[OPEN] PASS (569ms) · [E-KEYS] PASS (1623ms) · [E-FIELD] PASS (557ms) · [E-LANDMARKS] PASS (555ms) · [E-FOCUS] PASS (637ms) · [E-FIT] PASS (1463ms) · [E-FLOOR] PASS (1977ms) · [RESIZEQ] PASS (17139ms) · [E-REOPEN] PASS (162ms) · [FILL] PASS (16935ms) · [BURST] PASS (10008ms; "RECORDED, NOT ASSERTED")
This run launched the app; it stays RUNNING on CDP port 9223.
rc=0 end 2026-11-20T03:34:15Z
```

*s-selection (session-1795145694.log)*
```
[E-SCENE] PASS (15977ms) · [E-CLICK] PASS (511ms) · [E-CLICK-FAST] PASS (872ms) · [E-SELECT] PASS (614ms) · [E-NODRAG] PASS (1340ms) · [E-ZOOMSEL] PASS (2012ms) · [E-SEL-PAN] PASS (1129ms) · [E-SEL-FILTER] PASS (24016ms) · [E-REFUSED] PASS (8338ms) · [E-GEN] PASS (17873ms) · [E-KINDS] PASS (60890ms) · [E-EXPORT] PASS (15044ms) · [E-SCOPE] PASS (4157ms) · [E-ASK] PASS (98677ms) · [E-ASK-STATEMENT] PASS (90465ms) · [E-ASK-TWO] PASS (173611ms) · [E-STATUS-HEIGHT] PASS (45413ms) · [E-DBLCLICK] PASS (17657ms)
[EXPORT-TODAY] SKIP: phase A's recorded observation (the form's Amendment 4 item 2); after B3 the reopen meets the open-during-export ask, which E-ASK…(cut)
rc=0 end 2026-11-20T03:44:35Z
```

*s-export-view (session-1795146317.log)*
```
[E-CV-OPEN] PASS (4186ms) · [E-CV] PASS (9153ms) · [E-CV-RESIZE] PASS (6775ms)
[export-view] 4 PASS, 0 FAIL: E-CV-OPEN=PASS E-CV=PASS E-CV-RESIZE=PASS FIXTURES=PASS
rc=0 end 2026-11-20T03:45:39Z
```

*s-recording (session-1795146382.log, SHIMDIR=shim-wait)*
```
[OPEN] PASS (63ms): admitted
[APPLY] PASS (693ms): applied, and one record_step row reached ok
[STYLE] PASS (639ms): opacity 0.37 and colour #112233 committed; three record_step rows reached ok
[RESET] PASS (305ms): Reset committed; five record_step rows reached ok
[RECORD] PASS (944ms): unsaved-438041a533b65957d00febf6dca01fe3: a header and five steps, in order and chained; the filter names the field zone; th…(cut)
Full console ledger: C:\dev\wt\1c-p3b-2\frontends\shell\e2e\out\recording-console-ledger-1795146387618.json
rc=0 end 2026-11-20T03:46:27Z
```

*s-command-bar (session-1795146428.log)*
```
[OPEN] PASS (524ms) · [E-CTRLK] PASS (4868ms) · [E-SEARCH] PASS (2733ms) · [E-HELP] PASS (1092ms) · [E-BARFOCUS] PASS (2684ms) · [E-REVEAL] PASS (4457ms) · [E-SLASH] PASS (1126ms) · [E-FIELD] PASS (1390ms) · [E-AND] PASS (24400ms) · [E-REFUSE] PASS (18068ms) · [E-TOOLONG] PASS (7510ms) · [E-ADV] PASS (7501ms) · [E-PANEL] PASS (13163ms) · [E-SEL] PASS (31488ms)
This run launched the app; it stays RUNNING on CDP port 9223.
rc=0 end 2026-11-20T03:49:11Z
```

*s-attributes (session-1795146599.log)*
```
[PA-E1] PASS (13205ms) · [PA-E3] PASS (123299ms)
[attributes] 2 PASS, 0 FAIL: PA-E1=PASS PA-E3=PASS
rc=0 end 2026-11-20T03:52:18Z
```

*s-table (session-1795146776.log, SPATIAL_E2E_FILTER_ZONE_COUNTS='[402, 392, 389, 421]')*
```
[PC-E1] PASS (11037ms) · [PC-E2] PASS (22618ms) · [PC-E3] PASS (4961ms) · [PC-E4] PASS (18919ms)
[table] 4 PASS, 0 FAIL: PC-E1=PASS PC-E2=PASS PC-E3=PASS PC-E4=PASS
rc=0 end 2026-11-20T03:54:01Z
```

*s-project, E-SAVE (session-1795146883.log)*
```
[OPEN] PASS (5204ms): admitted; the Save control and the first pixels are there
[CLAUSES] PASS (8126ms): three clauses, the second off; the Filter section reads Applied: ("zone" = 'residential') AND ("zone" IS NOT NULL); their 4 record_step rows reached ok
[STYLE] PASS (3542ms): opacity 0.37 and colour #112233 committed; their record_step rows reached ok
[POSE] PASS (3268ms): camera set to centre (2600900.3333333335, 1200900.2857142857), zoom -0.8571428571428572
[SAVE] PASS (38ms): answered "asked"; the folder holds project.spatial alone (2497 characters); spatial://project/43b8e0abeb18346c3c49512cea379cd4
[READBACK-FILTER] PASS (0ms): the file holds the three clauses in order, the second off, and the filter ("zone" = 'residential') AND ("zone" IS NOT NULL)
[READBACK-STYLE] PASS (1ms): the file's style holds the fill colour #112233 and the applied opacity 0.37
[READBACK-VIEW] PASS (1ms): the file's view holds the pose's patterns: centre 4143d7e22aaaaaab, 4132530449249249, zoom bfeb6db6db6db6dc
[SECOND-SAVE] PASS (43ms): answered "not-asked"; the second folder stays empty; the first folder's project.spatial still reads back
[INSIDE-OPEN] PASS (5993ms): the copy under "parcels.parquet" in the third folder was admitted
[INSIDE-SAVE] PASS (44ms): answered "asked"; the third folder holds project.spatial and the copy; spatial://project/d1b0c1e3c448a2ee6ca659bb706ad6e6
[NOTICE-S18] PASS (10ms): the save notices hold S18's text once; the dataset entry's locators read machine-recorded
Full console ledger: C:\dev\wt\1c-p3b-2\frontends\shell\e2e\out\project-console-ledger-1795146912049.json
rc=0 end 2026-11-20T03:55:12Z
```

*s-residency-harness* (first line, last two, rc only; no figure recorded or claimed)
```
worktree C:/dev/wt/1c-p3b-2 head 231b32cc388b293dc6030f5f92c8b044c85c663a start 2026-11-20T03:55:50Z
This run launched the app; it stays RUNNING on CDP port 9223 for further interactive use.
rc=0 end 2026-11-20T03:56:07Z
```

*s-pan-anchor (session-1795147008.log)*: 16 `PASS` lines (small: pixel-spaces-coincide, normal-A ±300, paint-vs-event ±85, there-and-back-net, recenter-crossing-A ±1200; large: the same eight with paint-vs-event ±250), then
```
==== 16/16 PASS ====
rc=0 end 2026-11-20T03:59:46Z
```

*s-source-watch-idle (session-1795147230.log)*
```
[W1-open] PASS · [W2-settle-and-precondition] PASS · [W3-touch-mtime-while-idle] PASS: modification time moved forward while idle; sha256 unchanged, so no byte was edited · [W4-wait-for-idle-end] PASS · [F0-no-new-viewport-query] PASS · [F1-status] PASS · [F2-residency-cleared] PASS · [F3-picks-refused] PASS
This run LAUNCHED the app and has now torn it down (session.stop()); nothing was left running.
rc=0 end 2026-11-20T04:00:45Z
```

*s-source-changed-pre (session-1795147290.log)*
```
[S1-open] PASS · [S2-settle-and-precondition] PASS · [S3-retarget-junction] PASS · [S4-issue-one-query] PASS: a viewport_query followed the "pan-beyond-viewport" gesture (43 -> 46 in the render trace); … · [S5a-status] PASS · [S5b-residency-cleared] PASS · [S5c-picks-refused] PASS
This run LAUNCHED the app; it stays running on CDP port 9223.
rc=0 end 2026-11-20T04:01:50Z
```

*s-source-changed-post (session-1795147351.log), rc 3*
```
[S1-open] PASS · [S2-settle-and-precondition] PASS · [S4-issue-one-query-and-retarget-on-mint] PASS · [S5a-status] PASS · [S5b-residency-cleared] PASS · [S5c-picks-refused] PASS
[S5d-post-check-route-confirmed] INCONCLUSIVE: S5d: INCONCLUSIVE (never a pass): a tile mint was refused with engine.source_changed and the pre-check's own descriptor detail ({mtime}) -- a sibling tile's pre-check found the change while the generation was live at its live check; which kernel route ended the generation is not read by this step, so the post-check route is neither shown nor excluded. Evidence: {…(cut)
fixture-integrity                        PASS          sha256 unchanged across the run: fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49
rc=3 end 2026-11-20T04:02:50Z
```

*s-source-changed-reopen (session-1795147427.log)*
```
[S1-open] PASS · [S2-…] PASS · [S3-retarget-junction] PASS · [S4-issue-one-query] PASS · [S5a-status] PASS · [S5b-residency-cleared] PASS · [S5c-picks-refused] PASS · [R1-failed-reopen-does-not-clear] PASS · [R2-successful-reopen-clears-and-identifies] PASS · [R3-zoom-to-layer-clickable-and-effective] PASS · [R4-second-source-change-ends-the-new-session] PASS
This run LAUNCHED the app; it stays running on CDP port 9223.
rc=0 end 2026-11-20T04:04:34Z
```

*s-colour (session-1795147516.log, SHIMDIR=shim-wait)*
```
[PB-E1] PASS (27214ms) · [PB-E5] PASS (31ms) · [PB-E2] PASS (3499ms) · [PB-E3] PASS (2236ms) · [PB-E4] PASS (2376ms)
rc=0 end 2026-11-20T04:05:53Z
```
(in this section a "·" joins step lines I abbreviated to name, verdict and milliseconds. Each is a separate `[NAME] PASS (ms): …` line in the log.)

**`project` beside P3b-1's (4b8d6702)**
- All 12 steps are named, ordered and PASS in both runs, with none differing in verdict: OPEN, CLAUSES, STYLE, POSE, SAVE, READBACK-FILTER, READBACK-STYLE, READBACK-VIEW, SECOND-SAVE, INSIDE-OPEN, INSIDE-SAVE, NOTICE-S18.
- Differences are in the milliseconds and the two minted project URIs. The step texts are otherwise identical, including the 2497-character `project.spatial` and the three view patterns `4143d7e22aaaaaab`, `4132530449249249` and `bfeb6db6db6db6dc`.
- Milliseconds, P3b-1 then now: OPEN 5261/5204, CLAUSES 7940/8126, STYLE 3567/3542, POSE 3252/3268, SAVE 37/38, READBACK 0,0,1 / 0,1,1, SECOND-SAVE 44/43, INSIDE-OPEN 6212/5993, INSIDE-SAVE 36/44, NOTICE-S18 13/10.
- The SAVE URI was `spatial://project/aecc489b5da0fd7c7a2772e0bb447735` at P3b-1 and is `…/43b8e0abeb18346c3c49512cea379cd4` now. The INSIDE-SAVE URI was `…/51ad885e3c7d820400df41cd61b119ab` and is `…/d1b0c1e3c448a2ee6ca659bb706ad6e6` now. I did not look into why they differ, and I note it as a difference only.

**Failures**
- Only `source-changed-post` ended non-zero (rc 3). I judged it possibly timing-dependent, because the INCONCLUSIVE text names a race between sibling tiles' pre-checks. So I ran it once more as `s-source-changed-post-2`, in a later hold.
- The rerun ended rc 3 with the same lines: 6 PASS, the same S5d INCONCLUSIVE text, and `fixture-integrity` PASS.
- Class: not timing. It is a deterministic INCONCLUSIVE by the step's own design ("never a pass"), and it matches S9 at e1fd8495 (6 / 0, rc 3). Both runs count as no pass, and the custodian decides.
- No other failure. No run ended 90 or 94. No hold was refused.

**Holds** (all 33 granted at the first request; no 97, 96, 98 or 99)
- "asked" is the stamp in `<S>/p3b2s-h<n>.asked`.
- "granted" is the command's start. For suites it is the log's `start` time minus a few seconds (the load-line time). For holds 1 to 9 it is approximate, from file mtimes. I did not capture it exactly.
- "ended" is the suite log's `end` time, or for holds 1 to 9 the first time my wait loop saw the release.

| n | what | asked | granted (command start) | ended |
|---|---|---|---|---|
| 1 | frontends | 02:31:22 | ~02:31:30 | by 02:32:35 |
| 2 | shell checks | 02:32:47 | ~02:32:55 | by 02:35:07 |
| 3 | kernel targets | 02:35:23 | ~02:35:30 | by 02:38:10 |
| 4 | spatial-skp | 02:38:22 | ~02:38:30 | by 02:38:42 |
| 5 | src-tauri | 02:38:52 | ~02:39:00 | by 02:41:12 |
| 6 | debug exe | 02:41:23 | ~02:41:30 | by 02:44:14 |
| 7 | measure exe | 02:44:27 | ~02:44:35 | by 03:07:10 |
| 8 | E-FL | 03:07:24 | ~03:07:30 | by 03:07:46 |
| 9 | recentre-crossing | 03:07:59 | ~03:08:05 | by 03:12:13 |
| 10 | regression | 03:13:00 | 03:13:08 | 03:18:18 |
| 11 | refusal-contract-baseline | 03:19:02 | 03:19:10 | 03:20:09 |
| 12 | admission | 03:20:29 | 03:20:40 | 03:21:29 |
| 13 | filter | 03:21:49 | 03:21:56 | 03:22:23 |
| 14 | filter-panel | 03:22:44 | 03:22:51 | 03:23:43 |
| 15 | style | 03:24:02 | 03:24:09 | 03:24:32 |
| 16 | publish | 03:24:50 | 03:24:58 | 03:25:31 |
| 17 | console | 03:25:49 | 03:25:56 | 03:32:31 |
| 18 | layout | 03:32:57 | 03:33:05 | 03:34:15 |
| 19 | selection | 03:34:32 | 03:34:41 | 03:44:35 |
| 20 | export-view | 03:44:55 | 03:45:02 | 03:45:39 |
| 21 | recording | 03:46:01 | 03:46:08 | 03:46:27 |
| 22 | command-bar | 03:46:46 | 03:46:54 | 03:49:11 |
| 23 | attributes | 03:49:36 | 03:49:43 | 03:52:18 |
| 24 | table | 03:52:36 | 03:52:43 | 03:54:01 |
| 25 | project | 03:54:22 | 03:54:29 | 03:55:12 |
| 26 | residency-harness | 03:55:33 | 03:55:40 | 03:56:07 |
| 27 | pan-anchor | 03:56:27 | 03:56:34 | 03:59:46 |
| 28 | source-watch-idle | 04:00:08 | 04:00:16 | 04:00:45 |
| 29 | source-changed-pre | 04:01:03 | 04:01:11 | 04:01:50 |
| 30 | source-changed-post | 04:02:10 | 04:02:17 | 04:02:50 |
| 31 | source-changed-reopen | 04:03:26 | 04:03:33 | 04:04:34 |
| 32 | colour | 04:04:54 | 04:05:02 | 04:05:53 |
| 33 | source-changed-post rerun | 04:06:14 | 04:06:22 | 04:06:57 |

- Every `MACHINE_HOLD` line carried `also=<m>`, so each hold stood beside another process of the machine. I cannot tell from those lines whether any of it was this project's own hold. I did not read it. No line carried `others=`.

**Fixtures and lock files**
- After the last run: 34 files again, with sizes and sha256 in `<S>/p3b2s-fix-after.txt`. `cmp` of before and after: rc=0 (identical).
- The 5 GB fixture was not used and nothing was regenerated.
- Lock-file diff: `git diff --quiet HEAD -- Cargo.lock frontends/shell/src-tauri/Cargo.lock frontends/shell/package-lock.json renderer/bundle-viewer/package-lock.json` gave `lock-rc=0`.

**End state**
- HEAD is 231b32cc388b293dc6030f5f92c8b044c85c663a, the porcelain is empty, and the final `p3b2-e2e-busy.ps1` printed `FREE`, rc=0.
- `df -h`: C: 45G free, D: 367G free. `du -sm D:/wt-targets/1c-p3b-2`: 18822 MB.
- Processes: every background shell I started has completed and was notified. The suite teardowns killed the app and vite trees they started. I killed nothing myself, and no process of mine is running.

**Things I did that the brief does not name**
- I wrote driver scripts into `<S>`: `p3b2s-frontends.sh`, `p3b2s-shellchecks.sh`, `p3b2s-kernel.sh`, `p3b2s-skp.sh`, `p3b2s-srctauri.sh`, `p3b2s-measure.sh`, `p3b2s-wait.sh` and `p3b2s-extract.sh`. Holds 1 to 5 and 7 ran the cargo and npm steps through the first six, so each cargo command's `CARGO_TARGET_DIR`, `CARGO_BUILD_JOBS` and `RUST_TEST_THREADS` were set inside them. `p3b2s-wait.sh` and `p3b2s-extract.sh` only read.
- `p3b2s-extract.sh` copies the session log into `<S>`. The other `p3b2s-*` files are logs, `.asked` stamps and fixture lists.
- Each suite also set `SPATIAL_IDE_AUDIT_LOG=<S>/p3b2s-s-<name>.audit.jsonl`. I did not check whether any was written.
- Once, after hold 2, I ran the busy check in the same call as the result reading. A standalone busy check (`FREE`) followed before hold 3.
- I made no commit, no push, no tracked-file change, and no mutation run.

**The four failure classes as they apply to this harness**
- The harness uses the interface the product exposes. The suites drive the real shell exe through its window over CDP on 9223, with vite on 5400 mapped from 5180. The measure runs use the release exe.
- Every result claim points to a file that exists: `<H>/out/p3b2-e2e-<tag>.log`, `<S>/p3b2s-*` logs, and `<S>/p3b2s-sum-<name>.txt`.
- Every operator-facing line describes this commit. Each log header names H.
- Every measurement test reaches its assertion. Each step line is a verdict emitted after its checks, not after setup alone.
- Not measured or compared: I made no figure claim from E-FL, recentre-crossing, `residency-harness` or `pan-anchor`, and I did not compare all steps against S9's detail lines. I compared only the pass/fail counts and the `project` steps.
- Against S9, the counts differ in `console` (now 11/0, was 10/2 at e1fd8495), `selection` (18/0, was 14/4), `command-bar` (14/0, was 13/1) and `project` (12/0, was 2/1). I did not investigate those differences.

**Model:** Sonnet 5.5 (`claude-sonnet-5-5`), as my harness reports it. No override and no context handoff. I have no token figures at hand.
