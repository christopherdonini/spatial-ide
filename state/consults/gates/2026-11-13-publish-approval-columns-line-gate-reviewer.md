Reviewed: PR #314 at b6924acea0ee757f679551442d09d1353b595d3b (base d5598e2a) (the custodian's filing note, 2026-11-13: the gate, the reviewer, attempt 1, dispatched beside the architect, both gates from dispatch, PLAN node publish-approval-columns-line, slot 2; its brief by file (16626 bytes, sha256 cf320de5b6d07e4edcc7b56a31512f4189eab065b86b789e8697eaa7aa3d3241); the run 16:47:09Z to 19:01:56Z by its transcript, 211 calls (Bash 191, Read 18, Grep 1, SubagentHandback 1), 2 errored (two searches for files that did not exist, grep exit 2, at 17:41:41Z and 18:10:15Z), model claude-opus-5-5; its 18 suite runs and its recentre-crossing run each have a call in the transcript at the times it gives; below, the hand-back byte for byte (with one final newline added, 26529 bytes, sha256 e63abe316c8ec97dc39493d266c828709d79b3a53d896cf268fa6a3271b8d0e9). Nothing is changed. Its packet question 1 and its disclosure of one stray hold call go to the advisor.)

Reviewed: PR #314 at b6924acea0ee757f679551442d09d1353b595d3b (base d5598e2a), gate, reviewer
Verdict: PASS WITH NOTES
Branch: cut/publish-approval-columns-line @ b6924acea0ee757f679551442d09d1353b595d3b (ls-remote and `gh pr view 314` both give this head; the PR is a draft and OPEN, read at 18:52:43Z)

The piece is correct and fully evidenced. All 19 e2e suites and the measure-build run pass at H, and nothing blocks. One Documentation finding must be fixed before the merge. Packet question 1 goes to the advisor.

## Findings by class

### Correctness
None.
- The struct-literal line at publish.rs:695 builds `published_columns` from the same `attributes` vector. That vector is bound at :590 by `style_attributes`, is cloned into the request at :595, passes preflight at :608, is stashed at :709 and is sent at execute at :793. The producer shape is the shape the dialog receives.
- The composer's two strings equal W-N and W-A, byte for byte. Each is a span inside directive line 20 at c3b4899c (sha256 2e05b761…, recomputed; c3b4899c is an ancestor of B).
- The dialog renders the field verbatim in a `<dd>` after Row scope.
- The only new pub item is the field the form requires.
- No `unwrap` on a product path; the unwraps are in tests.
- No JSON on a data path: the manifest reads in U1 and E1 are test-side metadata reads.

### Evidence
None. Every gate run is green (table below).
- U1, U2 and U3 pass by name.
- D3 passes by name.
- E1 passes inside APPROVED' at H. I read that bundle's manifest myself: its `schema` has two entries, `id` then `geometry`.

### Documentation (must fix before the merge; the worker's words, so it is applied with no re-gate)
**D-1. `frontends/shell/MANUAL-WALKTHROUGH.md`, the `APPROVED'` row of the suite-coverage table, "Covers" cell.**
- The added clause "and the manifest's `schema` has exactly two entries, the first named `id`" sits inside the parenthetical that begins "every field `PublishPromptData` carries (".
- The manifest's `schema` is not a field of `PublishPromptData`. The suite checks it after execute, from the manifest the kernel wrote (publish.mjs:379–383).

Replace this span:

`` `filter_scope` is `null`, `published_columns` is `Columns published: id and the geometry only.`, and the manifest's `schema` has exactly two entries, the first named `id`); executing with the phrase derived from `destination_display`'s own basename succeeds; ``

with:

`` `filter_scope` is `null`, `published_columns` is `Columns published: id and the geometry only.`); executing with the phrase derived from `destination_display`'s own basename succeeds; the manifest the kernel wrote has a `schema` of exactly two entries, the first named `id`; ``

Each clause checked against the code at H:
- (a) `published_columns` is asserted on the prompt, before execute. publish.mjs:367 compares it to `"Columns published: id and the geometry only."` and throws otherwise.
- (b) Execute with the derived phrase must return success (publish.mjs:372–378).
- (c) The schema check comes after execute. publish.mjs:380 reads `manifest.json` under `executeOutcome.bundle_path`, which is the bundle the kernel wrote. :381 requires an array of length 2 whose `[0].name` is `"id"`.
- (d) verify-bundle runs next (publish.mjs:385). The replacement keeps the code's order: prompt, execute, manifest, verify-bundle.

What an operator can observe: the APPROVED' line in the publish suite's log. I saw it PASS at H.

Read and not a finding:
- The composer's doc says "reached only by the unit tests" (plural), while U3 alone has many names. "The unit tests" reads as the suite and the substance is true.
- publish.mjs and the README say "the shell's style names no attribute column" / "on main". This is true at H: `frontends/shell/src/style/document.ts` has no `match` variant. PR B re-reads it.

## Checks 1–17

**1. Start state**
- HEAD is H and the porcelain is empty.
- `df` at 16:48:03Z: C: 15G, D: 189G.
- Fixtures: 34 files, listed in `<S>/pcg-gr-fix-before.txt`. `filter-zoned.parquet` is 409872 bytes, sha256 92ed800c…6e112e46, as given.
- Harness: `sha256sum -c` gave 9/9 OK, rc 0. I read the harness files whole.

**2. Scope**
- `git diff --name-only B...H` lists exactly the 11 paths in §7.
- Nothing under kernel/, engine/, protocol/ or renderer/. No package.json, lockfile or Cargo file. KNOWN-LIMITATIONS is unchanged.
- merge-base is B.
- The §1 and §8 items hold:
  - no sleep, retry or timeout in the tests;
  - D3's PROMPT is typed `PublishPromptData`;
  - E1 reads the serialized snake_case member;
  - U1 reads the manifest the kernel wrote.

**3. §7 counts** (`git diff --numstat` against the merge-base)

| File | Lines | Ceiling |
|---|---|---|
| publish.rs | 128 | 140 |
| types.ts | 4 | 10 |
| PublishDialog.tsx | 2 | 10 |
| PublishDialog.test.ts | 9 | 25 |
| PublishPanel.test.ts | 1 | 3 |
| App.selection.test.tsx | 2 | 3 |
| App.command.test.tsx | 2 | 3 |
| publish.mjs | 12 | 40 |
| README | 8 | 8 |
| MANUAL-WALKTHROUGH | 4 | 8 |
| ADR-024 | 4 | 8 |

- Total: 176 of 258 lines, 11 of 11 files, no overrun, so nothing for class 8.
- The README sits at its ceiling, not over it (packet question 4).
- The 169 added lines contain no CR and no tab, and every file ends with LF.

**4. The code and its words**
- W-A and W-N match directive line 20, as recomputed above.
- Form line 284 equals draft line 307, from "Note" to the end.
- ADR-024 at H is the base plus exactly the heading and the block, with the date filled in, so it is append-only. The S5 commit date is 2026-11-13 (15:18:30Z).
- The note block's clauses are all true at H:
  - it renders `published_columns`;
  - the line is composed in the host;
  - it names id, the geometry and each attribute column the attempt publishes;
  - in the declared order;
  - beside row_scope in the field list;
  - the status line still reads Proposed.
- Packet question 3: the G3 walkthrough words, the types doc, the dialog comment and the README passage are true, clause by clause, against the built code.
- The one untrue sentence is D-1.

**5. RECORDED MUTATION lines**
- Five lines: M-U1, M-U2, M-U3 and M-D3 at 08ac45cc; M-E1 at 1d45189b. Both commits are in B..H and are ancestors of H.
- Every test the lines name exists at H.
- Every failure text they quote is found in its worker log:
  - the U1 panic is at 08ac45cc publish.rs:1942, the first assert_eq;
  - U2 at :1989;
  - D3 at PublishDialog.test.ts:223;
  - the me1 log's head is 1d45189b, and its APPROVED' FAIL line matches the recorded line.
- `verify-mutation --base d5598e2a… --head b6924ace…` exits 0: "verify:mutation PASS — all 4 new test(s) have a recorded mutation naming them". That run is a floor, not an observation. The brief forbids tracked edits, so I observed no mutation myself (see the packet's gaps).

**6. Installs**
- `npm ci` in renderer/bundle-viewer: rc 0.
- `npm ci` in frontends/shell: rc 0.
- The porcelain stayed empty.

**7. Builds**
- bundle-viewer `npm run build`: rc 0. Its last lines, byte-copied:
  ```
  scan-dist: 3 files scanned, 2 findings, all reviewed; record written
  scan-dist: reviewed row NOTICE.txt credential 19092: matched
  scan-dist: reviewed row NOTICE.txt local-filesystem-path 111337: matched
  scan-dist: reviewed row app.js local-filesystem-path 7291: not found
  ```
- `generate:notice`: rc 0, "src/generated/NOTICE.txt (3427745 bytes)".

**8. `npm run verify`**: rc 0.
- vitest: "Test Files 112 passed (112)", "Tests 1459 passed (1459)".
- residency-trace: 76 passed, 0 failed.
- citation-integrity: 30 passed, 0 failed.
- export-elapsed: pass 5, fail 0.
- s5d-verdict: pass 7, fail 0.
- D3 by name, in a separate verbose vitest run of PublishDialog.test.ts: rc 0, "✓ … D3 renders the host-composed published_columns line verbatim, after Row scope and before the irreversible warning", 20 passed.

**9. cargo test**: rc 0.
- lib: 76 passed.
- main: 0.
- sole_caller_scan: 2 passed.
- doc-tests: 0.
- U1, U2 and U3 each "... ok".

**10. Dev builds**
- The exe build: rc 0, "Finished `dev` profile … in 2m 31s", then "copied exe".
  - D:/wt-targets/pcg/exes/spatial-ide-shell-pcg.exe: 91545088 bytes, mtime 2026-11-13 18:18:54 +0100, sha256 41480effc543ddb3b0918d85c894f47b170c87aa3409475623eca3555bcc6b33.
- The verify-bundle example: rc 0, "Finished `dev` profile … in 11m 38s".

**11. Suites**
- The package list has 19 `e2e:` entries: the 17 given, plus debug (not run) and recentre-crossing (check 12). It matches the brief.
- Every suite ended rc 0, so there were no re-runs.
- pan-anchor passes 16/16 at H.
- Every run's down output is of the form "killed tree X | killed tree Y | port 9223 free | port 5400 free".
- A session log was copied for all 18 runs to `<S>/pcg-gr-gr-<name>.session.log`.

Byte-copied lines follow. Usernames are replaced by `<user>`, and lines over about 230 characters are cut. The full lines are in `<S>/pcg-gr-post-<name>.txt` and `<HR>/out/pcg-e2e-gr-<name>.log`.

- **regression**
  - First line: `worktree C:/dev/wt/pcg head b6924acea0ee757f679551442d09d1353b595d3b start 2026-11-13T17:31:18Z`
  - 17 steps PASS: [A1'] [A3'] [A4'] [A5'/A6'] [A7'] [A8'] [A9'] [K6] [K7] [CURSOR'] [FIND'] [MP'] [PT'] [LN'] [B2'/B3'] [ABSENTCRS'] [C2'/C3']. ABSENTCRS' contains `caller-asserted by os-user <user> ...`.
  - Last two: `This run launched the app; it stays RUNNING on CDP port 9223 for further interactive use.` / `rc=0 end 2026-11-13T17:36:06Z`
  - Down: `killed tree 21308 | killed tree 31508 | port 9223 free | port 5400 free`
- **refusal-contract-baseline**
  - Steps: `[OVERCEIL'] PASS (9681ms)`, `[REOPEN'] PASS (18644ms)`, `[SLOW'/CANCEL'] PASS (12904ms)`
  - Last line: `rc=0 end 2026-11-13T17:37:31Z`
  - Down: `killed tree 55336 | killed tree 3896 | …free | …free`
- **admission**
  - 11 PASS: ASSERT' (contains `os-user <user>`), PASTED', AXISTRAP', NODEF', MAP', DUPKEY', BOTHNEEDED', CONFLICT', CANCELOPEN', NOPERSIST', OVERBOUND'.
  - Last line: `rc=0 end 2026-11-13T17:38:31Z`
- **filter**
  - `[OPEN] PASS (59ms)`, `[FILTER'] PASS (6857ms): … unfiltered 16.5% non-bg, filtered 4.4% non-bg …`, `[REFUSED'] PASS (21ms)`
  - Last line: `rc=0 end 2026-11-13T17:39:05Z`
- **filter-panel**
  - OPEN, PANEL', PANELREFUSE', CLEAR' and FIND' PASS.
  - Last line: `rc=0 end 2026-11-13T17:42:21Z`
- **style**
  - OPEN, STYLE', OPACITY', OUTLINE', DOC' and RESET' PASS.
  - Last line: `rc=0 end 2026-11-13T17:42:50Z`
- **publish**
  - `[OPEN] PASS (363ms)`.
  - APPROVED', whole: `[APPROVED'] PASS (2528ms): prepared+executed with attempt a9ff7bb89f03a72ca991a6c1c8781340; bundle verified (2000 rows, 1 partitions); 2 audit lines (intent+outcome success, approval_route shell-dialog, destination "C:/dev/wt/pcg/target/e2e-publish-out/approved-1794591797180-414196/bundle", no credential needle); prepare-to-execute 5ms`
  - `[REFUSED'] PASS (32ms)`, `[EXPIRED'] SKIP: no TTL-shortening env/test knob exists …`, `[FILTERED'] PASS (2921ms)`
  - Last line: `rc=0 end 2026-11-13T17:43:22Z`
  - P-head-2 holds:
    - APPROVED' passes, and that pass requires `published_columns` === W-N (publish.mjs:367–368).
    - The schema has 2 entries, the first `id` (:381). I also read it independently: `[{"name":"id",…},{"name":"geometry",…}]`.
- **console**
  - 12 PASS, including `[REGRESS'] PASS (332165ms): npm run e2e:regression exited 0 (307969ms); npm run e2e:admission exited 0 (24196ms); …`
  - Last line: `rc=0 end 2026-11-13T17:49:37Z`
- **layout**
  - 11 PASS, plus summary row `FIXTURES PASS`.
  - Last two: `This run launched the app; it stays RUNNING on CDP port 9223.` / `rc=0 end 2026-11-13T17:51:00Z`
- **selection**
  - 18 PASS, 0 FAIL: E-SCENE, E-CLICK, E-CLICK-FAST, E-SELECT, E-NODRAG, E-ZOOMSEL, E-SEL-PAN, E-SEL-FILTER, E-REFUSED, E-GEN, E-KINDS, E-EXPORT, E-SCOPE, E-ASK, E-ASK-STATEMENT, E-ASK-TWO, E-STATUS-HEIGHT, E-DBLCLICK.
  - `[EXPORT-TODAY] SKIP: phase A's recorded observation (the form's Amendment 4 item 2); …`
  - Last line: `rc=0 end 2026-11-13T18:00:30Z`
  - Down: `killed tree 47148 | killed tree 52920 | port 9223 free | port 5400 free`
- **export-view**
  - `[E-CV-OPEN] PASS (2742ms)`, `[E-CV] PASS (9135ms)`, `[E-CV-RESIZE] PASS (5401ms)`
  - `[export-view] 4 PASS, 0 FAIL: E-CV-OPEN=PASS E-CV=PASS E-CV-RESIZE=PASS FIXTURES=PASS`
  - Last line: `rc=0 end 2026-11-13T18:02:31Z`
- **recording** (SHIMDIR=shim-wait)
  - OPEN, APPLY, STYLE, RESET and RECORD PASS. RECORD: `… the recorded opacities 0.37 and 0.7058823529411765 equal the applied values bit for bit (H6)`
  - Last line: `rc=0 end 2026-11-13T18:03:11Z`
- **command-bar**
  - 14 PASS: OPEN, E-CTRLK, E-SEARCH, E-HELP, E-BARFOCUS, E-REVEAL, E-SLASH, E-FIELD, E-AND, E-REFUSE, E-TOOLONG, E-ADV, E-PANEL, E-SEL.
  - Summary row `FIXTURES PASS filter-zoned.parquet sha256 92ed800c… -> 92ed800c…`
  - Last two: `This run launched the app; it stays RUNNING on CDP port 9223.` / `rc=0 end 2026-11-13T18:05:03Z`
- **attributes**
  - `[PA-E1] PASS (12491ms)`, `[PA-E3] PASS (125257ms)`, `[attributes] 2 PASS, 0 FAIL`
  - Last line: `rc=0 end 2026-11-13T18:07:48Z`
- **table** (`SPATIAL_E2E_FILTER_ZONE_COUNTS='[402, 392, 389, 421]'`)
  - PC-E1, PC-E2, PC-E3 and PC-E4 PASS, `[table] 4 PASS, 0 FAIL`.
  - Last line: `rc=0 end 2026-11-13T18:09:08Z`
- **project**
  - 12 PASS: OPEN, CLAUSES, STYLE, POSE, SAVE, READBACK-FILTER, READBACK-STYLE, READBACK-VIEW, SECOND-SAVE, INSIDE-OPEN, INSIDE-SAVE, NOTICE-S18.
  - Last line: `rc=0 end 2026-11-13T18:09:55Z`
- **residency-harness** (exit code and lines only; no figure is recorded or claimed)
  - First line: `worktree C:/dev/wt/pcg head b6924ace… start 2026-11-13T18:10:16Z`
  - Last two: `This run launched the app; it stays RUNNING on CDP port 9223 for further interactive use.` / `rc=0 end 2026-11-13T18:10:34Z`
- **pan-anchor**
  - 16 PASS lines (small and large: pixel-spaces-coincide; normal-A ±300; paint-vs-event ±85 / ±250; there-and-back-net; recenter-crossing-A ±1200), `==== 16/16 PASS ====`
  - Last line: `rc=0 end 2026-11-13T18:14:13Z`

**12. recentre-crossing on the measure build**
- Before: `pcg-gr-rc.port-before.txt` holds one `:9223` line, a TIME_WAIT, so there was no listener. The process list has 435 lines, 0 of them spatial-ide.
- Build: rc 0, "Finished `release` profile [optimized] target(s) in 20m 42s".
  - D:/wt-targets/pcg-measure/release/spatial-ide-shell.exe: 72486912 bytes, mtime 2026-11-13 19:35:46 +0100, sha256 bfb1101c7866db683adf302a2c890d77444225f7584e7a86a8ff6042da431692.
- Run: rc 0. The log (`<S>/pcg-gr-rc.log`, 2100 bytes), whole:
```

> spatial-ide-shell@0.1.0 e2e:recentre-crossing
> node e2e/recentre-crossing.mjs --measure-build D:/wt-targets/pcg-measure/release/spatial-ide-shell.exe


--- case 1: z_fit -3.692532927362801, canvas 668x712 (buffer 668x712), L 300, T 131072, d 3749.395, n1 37, 76 drags ---
  image case1-start: C:\dev\wt\pcg\frontends\shell\e2e\out\recentre-crossing-e1-1794594962636-case1-start.png 34623 bytes sha256 102996b14908f10ff21f6afb7bbb1ec30dfacfdd7997510285c082331159f3f2
  image case1-end: C:\dev\wt\pcg\frontends\shell\e2e\out\recentre-crossing-e1-1794594962636-case1-end.png 105323 bytes sha256 002590099302ba683dabb8de6446a1b75b7439eed25b30e25b33cc68b4784e52
  REPORT  case 1 view-state lines, as (b) reads them: start target (0, 0) origin (2603460.114163697, 1200019.902370003) zoom -3.692532927362801; end target (-4.547473508864641e-13, 0) origin (2603460.114163697, 1200019.902370003) zoom -3.692532927362801
  origin changes: 2; in leg 1 1, in leg 2 1; at drags 35, 74
PASS  case 1 (a): W is continuous across each origin change  ::  2 origin change(s), worst jump 0.00 buffer px (tol 4)
PASS  case 1 (b): |W_end - W_start| <= d per axis  ::  |E| (0.000, 0.000) vs d 3749.395
REPORT  case 1 (c): the start and end images do not differ  ::  differ: N 35248 -> 123387, C shift 124.59 buffer px
PASS  case 1 (d): the drawn data's inner edges do not move  ::  do not differ: start box [left 66, right 667, top 258, bottom 357], end box [left 66, right 667, top 0, bottom 357]; K {left, bottom}; moves left 0.00, bottom 0.00 buffer px (tol 4)

--- case 2: z_fit -3.692532927362801, T 131072, double-click shift 300 px, window below T: (0, 1939.342] ---
  target 968.002 below the bound
PASS  case 2 (i): no origin change from the double-click to its settle  ::  20 line(s), 0 origin change(s), settled true
PASS  case 2 (ii): the zoom after the double-click is the zoom before plus 1  ::  zoom -3.692532927362801 -> -2.692532927362801 (+1)
PASS  case 2 (iii): W is continuous across the origin change at the wheel tick  ::  1 origin change(s), worst jump 0.00 buffer px (tol 4)

==== 6/6 PASS ====
```
- Images copied to `<S>`:
  - `pcg-gr-recentre-crossing-e1-1794594962636-case1-start.png`: 34623 bytes, sha256 102996b1…59f3f2.
  - `pcg-gr-recentre-crossing-e1-1794594962636-case1-end.png`: 105323 bytes, sha256 00259009…4784e52.
  - Both equal the log's figures.
- After: the port file holds one TIME_WAIT line, so there was no listener. The process list has 438 lines, 0 of them spatial-ide.
- The log names no session log: the script launches the exe itself.

**13. Fixtures after**: `<S>/pcg-gr-fix-after.txt`, 34 lines. `cmp` against the before list exits 0, so the lists are identical.

**14. Governance checks at H**
- `node --test` over the plan, hooks and evidence scripts: rc 0, tests 598, pass 598, fail 0.
- `verify-cites`: rc 0, "verify:cites PASS — every rooted (in-tree) path:line reference across 2961 file(s) resolves. (193 loose reference(s) advised above.)"
- `verify-quotes`: rc 0, "verify:quotes PASS — 156 checked, 125 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 927 ruling cites resolved, 0 ruling-cite errors."
- `verify-test-claims`: rc 0, "verify:test-claims PASS — all 796 claimed test(s) across 260 file(s) exist or are planned, superseded or withdrawn (25 planned, 14 superseded, 17 withdrawn, advisory)."
- `verify.mjs --offline`: rc 0, "verify:plan PASS — C:\dev\wt\pcg\governance\PLAN.yaml agrees with the repository."
- Packet question 5: `node scripts/plan/verify-quotes.mjs --show-cites frontends/shell/src-tauri/src/publish.rs` exits 1.
  - Its output is identical to the worker's `pac-s6-showcites.log` (diff rc 0): "FAIL — quote not found: frontends/shell/src-tauri/src/publish.rs:935 "phases only, no percentages beyond what PublishProgress carries…"".
  - H:935 and B:909 are the same line (equal sha256). The line is unchanged from B and is not this piece's.
  - The unscoped run, which CI uses, passes.

**15. The worker's report against its outputs**
- These numbers match the worker's logs (checked by script):
  - S1 lib 73;
  - S2 and S6 lib 76;
  - verify 1458, then 1459;
  - node --test 598/598;
  - verify-quotes 156 checked;
  - the §7 counts;
  - R1's 3+1 lines;
  - S2 publish.rs +125;
  - the 363 bytes appended to ADR-024;
  - the pins, which I re-derived.
- Not verifiable: the report's df figures (16G/201G) appear in no output file.
- The seven errored calls named in the filing note can be checked only against the worker's transcript, which I do not have (packet gaps). The report omits them, and the filing note records them.
- No sentence of the report is untrue on the evidence I hold.

**16. CI**
- `gh pr checks 314`, read at 2026-11-13T18:02:11Z: 14 checks, all pass:
  - cargo fmt ×2;
  - cfg boundary ×2;
  - DCO;
  - exposure scan;
  - ported-notices ×2;
  - tauri build ×2;
  - test·verify:plan ×2;
  - typecheck·build·vitest·cargo test ×2.
- `gh run view` on each of the 10 run ids gives headSha b6924acea0ee… and conclusion success for every one:
  - push runs at 15:34:47Z: 43454018950, 43454018997, 43454018923, 43454019087;
  - pull_request runs at 16:07:10Z: 43459452407, 43459452397, 43459452302, 43459452416, 43459452415, 43459452847.
- No "Product CI — Rust workspace" run: its push paths are kernel/, engine/ and renderer/, and the diff touches none of them. That absence is correct.

**17. End state**
- Every process I started has exited.
- A CIM scan for command lines naming this worktree, the measure target or the harness finds 0, excluding the scan itself.
- `pcg-e2e-busy.ps1` prints FREE, rc 0.
- No LISTENING line on 9223 or 5400.
- HEAD is b6924acea0ee757f679551442d09d1353b595d3b, and `status --porcelain --untracked-files=no` is empty (0 bytes), at 18:58:09Z.

## Suite runs

| Tag | Script | Env | rc | Start | End | Last line |
|---|---|---|---|---|---|---|
| gr-regression | e2e/regression.mjs | — | 0 | 17:31:18Z | 17:36:06Z | rc=0 end 2026-11-13T17:36:06Z |
| gr-refusal-contract-baseline | e2e/refusal-contract-baseline.mjs | — | 0 | 17:36:43Z | 17:37:31Z | rc=0 end 2026-11-13T17:37:31Z |
| gr-admission | e2e/admission-remediation.mjs | — | 0 | 17:38:02Z | 17:38:31Z | rc=0 end 2026-11-13T17:38:31Z |
| gr-filter | e2e/filter.mjs | — | 0 | 17:38:51Z | 17:39:05Z | rc=0 end 2026-11-13T17:39:05Z |
| gr-filter-panel | e2e/filter-panel.mjs | — | 0 | 17:41:54Z | 17:42:21Z | rc=0 end 2026-11-13T17:42:21Z |
| gr-style | e2e/style.mjs | — | 0 | 17:42:40Z | 17:42:50Z | rc=0 end 2026-11-13T17:42:50Z |
| gr-publish | e2e/publish.mjs | — | 0 | 17:43:10Z | 17:43:22Z | rc=0 end 2026-11-13T17:43:22Z |
| gr-console | e2e/console.mjs | — | 0 | 17:43:47Z | 17:49:37Z | rc=0 end 2026-11-13T17:49:37Z |
| gr-layout | e2e/layout.mjs | — | 0 | 17:50:05Z | 17:51:00Z | rc=0 end 2026-11-13T17:51:00Z |
| gr-selection | e2e/selection.mjs | — | 0 | 17:51:22Z | 18:00:30Z | rc=0 end 2026-11-13T18:00:30Z |
| gr-export-view | e2e/export-view.mjs | — | 0 | 18:02:07Z | 18:02:31Z | rc=0 end 2026-11-13T18:02:31Z |
| gr-recording | e2e/recording.mjs | SHIMDIR=shim-wait | 0 | 18:03:02Z | 18:03:11Z | rc=0 end 2026-11-13T18:03:11Z |
| gr-command-bar | e2e/command-bar.mjs | — | 0 | 18:03:31Z | 18:05:03Z | rc=0 end 2026-11-13T18:05:03Z |
| gr-attributes | e2e/attributes.mjs | — | 0 | 18:05:24Z | 18:07:48Z | rc=0 end 2026-11-13T18:07:48Z |
| gr-table | e2e/table.mjs | SPATIAL_E2E_FILTER_ZONE_COUNTS='[402, 392, 389, 421]' | 0 | 18:08:11Z | 18:09:08Z | rc=0 end 2026-11-13T18:09:08Z |
| gr-project | e2e/project.mjs | — | 0 | 18:09:29Z | 18:09:55Z | rc=0 end 2026-11-13T18:09:55Z |
| gr-residency-harness | e2e/residency-harness.mjs | — | 0 | 18:10:16Z | 18:10:34Z | rc=0 end 2026-11-13T18:10:34Z |
| gr-pan-anchor | e2e/pan-anchor.mjs | — | 0 | 18:10:56Z | 18:14:13Z | rc=0 end 2026-11-13T18:14:13Z |
| recentre-crossing | npm run e2e:recentre-crossing -- --measure-build … | measure build | 0 | the log prints none; the image stamp is 1794594962636 ms (about 18:36:02Z) | no stamp; finished before the 18:40Z read | ==== 6/6 PASS ==== |

Every suite used `SPATIAL_IDE_AUDIT_LOG=<S>/pcg-gr-<tag>.audit.jsonl`, with tag = gr-<name>, and a 1500 s timeout. There were no failures and no `-2` re-runs.

## For the advisor

**Packet question 1, on the human's words (no replacement words).**
- ADR-024 at H appends `## Appended note, 2026-11-13`, a blank line, then the block of Amendment 1 item 4 with `<date>` filled in.
- Amendment 1 item 4 says nothing else is appended by this piece.
- The block itself is byte-equal to the form's line 284, with the date filled.
- My reading:
  - the heading follows the heading pattern of §2.3 and of the 2026-11-06 note;
  - the absent italic provenance line is consistent with "nothing else";
  - whether a heading counts as "else" under item 4 and §8 item 10 is the advisor's ruling.
- Span: `docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md`, the last 363 bytes at H.

**Packet question 2.**
- R1 (090e18a5) and R2 (8524ce76) are commits the brief did not name.
- Each RECORDED MUTATION line names the commit it was observed at (08ac45cc, 1d45189b), and both are ancestors of H.
- DCO passes on the range.
- No finding from me; the advisor reads whether unnamed commits matter.

## The packet's gaps
- The worker's transcript, needed to check the seven errored calls named in the filing note, was not given.
- The source of the worker report's df figures (16G/201G) is in no output the packet lists.
- The brief forbids tracked edits, so this gate could not observe any mutation itself. Item 9 keeps mutation observations as the gates' own, so the gate rests on the worker's S3/me1 logs plus the `verify-mutation` floor.

## My hold lines (SpatialIDE only; each is `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:<n> also=<elided>`)
Each of these has one matching `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:<n> affinity=FF (cores 0-7)`:

| Shell | -What ("publish approval gate: …") |
|---|---|
| 28112 | npm ci in renderer/bundle-viewer |
| 66624 | npm ci in frontends/shell |
| 76808 | npm run build in renderer/bundle-viewer |
| 71580 | npm run generate:notice in frontends/shell |
| 60100 | npm run verify in frontends/shell |
| 48896 | cargo test for the shell crate |
| 51624 | dev exe build for the e2e suites |
| 66296 | cargo build of the verify-bundle example |
| 54408 | e2e regression suite |
| 45072 | e2e refusal-contract-baseline suite |
| 62728 | e2e admission suite |
| 61484 | e2e filter suite |
| 71720 | e2e filter-panel suite |
| 70644 | e2e style suite |
| 46180 | e2e publish suite |
| 15156 | e2e console suite |
| 81832 | e2e layout suite |
| 78152 | e2e selection suite |
| 31000 | e2e export-view suite |
| 65700 | e2e recording suite |
| 67892 | e2e command-bar suite |
| 79184 | e2e attributes suite |
| 75908 | e2e table suite |
| 28360 | e2e project suite |
| 57928 | e2e residency-harness suite |
| 66104 | e2e pan-anchor suite |
| 78260 | measure build |
| 42892 | recentre-crossing run |
| 49344 | scripts node test |
| 80572 | verify-quotes |

**Disclosure: one stray hold.**
- One hold call, shell bash.exe:53732, -What "publish approval gate: e2e admission suite", was run with no command after it and no release.
- That shell exited.
- A release from a later shell printed `MACHINE_NOT_HELD project=SpatialIDE shell=bash.exe:496: no live hold of this shell, nothing done`.
- The admission suite then ran in its own proper hold (62728).
- Later shared holds were granted normally. I cannot show from my outputs whether the machine script reaped 53732's hold record at once.

## Background shells left
None.
- All my background tasks have exited.
- The last one, bcdgca2yb, was a read-only listing loop that the harness moved to the background after 180 s. It exited 0 at 18:57:52Z.

## Model
Opus 5.5 (claude-opus-5-5).
