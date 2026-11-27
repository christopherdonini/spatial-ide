*Filed by the custodian: the Console piece's e2e tester (the Sonnet tester, node:console-stream-lane-limitation-67@e2e-tester-1, dispatched at 2026-11-22T20:31:34Z), its two hand-backs at PR 359's head 12251bc8850127b72a9fb2b5fce63c33ef2d7075, each below as it came, with the masks its part names and one final newline added. The architect's build gate part 2 (state/consults/gates/2026-11-22-console-stream-lane-build-gate-architect-part-2.md, gate-log row 853) finds the tester's mechanism for runs 2 and 4 (M-G1 and M-CB1) wrong, and its note that FIND' in run 2 may follow from the same collapsed Console wrong too: no click landed (its section 2). By its D1 no record carries that mechanism; the run lines and logs below stand as the record of what ran. The gate's E4 finds that part 2 does not show where PC-E1's oracle came from. In part 2 the tester hashed the shared fixture in the main checkout, a read with no write, on the custodian's message and against the brief's rule never to read the main checkout: the custodian's slip. The record is the transcript.*

## Part 1, its first hand-back: runs 0 to 11, stopped at run 12

*14728 bytes, sha256 f6c55404240e1b4594b3e6cef7c3b274dbed983d6aa0a957b80a312c388fc27a, masked: 1 scratch-folder path shortened to <u>\…\scratchpad; its run: Read 8, Bash 98, Edit 8, SubagentHandback 1, by unique call ids, 2 calls errored; model claude-sonnet-5-5, from 2026-11-22T20:31:36Z to 2026-11-22T21:48:07Z by its transcript; 0 calls named the main checkout.*

---

**Stopped** at run 12 (table, no mutation, FAIL). Runs 0 to 11 were done. Two findings (class 2) come from the mutation runs: M-CB3 passed, and M-G1 and M-CB1 failed outside their sets. Nothing was committed. Every mutation was reverted. `git status --porcelain` is empty and nothing listens on 5180 or 9223.

Model: I observe myself as Sonnet 5.5 (claude-sonnet-5-5). No override. No context handoff.

All files below are in `<S>/c67e/`. `<S>` = `<u>\…\scratchpad`. Per run there is a `<n>-<name>.log`, and `<n>-<name>-out/` is a copy of `e2e/out`. `times.txt` has the UTC times. The Summary blocks are long. I give them byte for byte only where short, and otherwise give the status per step with the file named.

**Four failure classes for this harness:**
- **Interface.** The harness is the product's own `npm run e2e:<suite>` launch, so it uses the interface the product exposes. It ran on the app's real CDP port 9223 and dev port 5180.
- **Result claims.** Each result claim below points to a log file in `<S>/c67e/` that exists.
- **Operator-facing lines.** Every operator-facing line in a log describes what was measured at head 12251bc8. The one exception is a README/results line I did not read. I recorded no usage figures.
- **Reaching the assertion.** Suites 1, 3, 9, 10 and 11 ran past setup to their assertions and printed per-step PASS lines. Run 12 stopped at PC-E1's setup (below), so only PC-E2 to PC-E4 reached their assertions.
- Mutation runs 2 and 4 failed at a `page.click` inside the inserted line, before the intended assertion. Their sets were not exercised (details below).

**Setup**
1. HEAD printed `12251bc8850127b72a9fb2b5fce63c33ef2d7075`. `git status --porcelain` printed nothing.
2. The netstat check for 5180 and 9223 printed nothing (rc=1).
3. `df -m /c /d`: C: has 42923 MB free (floor 40960), D: has 323425 MB free.
4. `<S>/c67e` was created.

**Builds**

| | exit | UTC | last log line | output |
|---|---|---|---|---|
| (a) `npm run build` | 0 | 20:31:53Z to 20:32:35Z | `✓ built in 5.82s` | no `dist/NOTICE.txt`; the file is at `src/generated/NOTICE.txt` |
| (b) cargo build | 0 | about 20:32:35Z to 20:48:51Z | `Finished dev profile [unoptimized + debuginfo] target(s) in 16m 07s` | `D:/wt-targets/console67/debug/spatial-ide-shell.exe` (91880960 bytes) |

- Build (b)'s start in `times.txt` is stamped at the same moment as (a)'s. Its real start was when (a) ended.
- `git status --porcelain` was empty after both builds.

**Runs.** All UTC, 2026-11-22. Run 2 started waiting for its hold at 21:05:38Z, and the hold was granted about 21:19Z.

| n | suite / mutation | exit | UTC |
|---|---|---|---|
| 0 | regression, warm-up, not counted | 0 | 20:48:56Z to 20:57:15Z |
| 1 | console, none | 0 | 20:57:47Z to 21:05:00Z |
| 2 | console, M-G1 | 1 | 21:05:38Z to 21:24:06Z |
| 3 | command-bar, none | 0 | 21:24:25Z to 21:26:46Z |
| 4 | command-bar, M-CB1 | 1 | 21:27:11Z to 21:29:50Z |
| 5 | command-bar, M-CB3 | 0 | 21:30:19Z to 21:32:37Z |
| 6 | command-bar, M-A4-1 | 1 | 21:33:15Z to 21:37:04Z |
| 7 | command-bar, M-A4-3 | 1 | 21:37:29Z to 21:39:41Z |
| 8 | command-bar, M-X2 | 1 | 21:40:10Z to 21:42:23Z |
| 9 | recording, none | 0 | 21:42:41Z to 21:43:13Z |
| 10 | project, none | 0 | 21:43:21Z to 21:44:18Z |
| 11 | reopen, none | 0 | 21:44:21Z to 21:45:42Z |
| 12 | table, none | 1 | 21:45:45Z to 21:47:08Z |

- **Run 0.** It passed on the first attempt, so there was no `0b`. Its Summary is in `0-warmup.log`.
- **Run 1 (console).** Every step passed except MEASURE', which was skipped as opt-in. The steps were HEADER', ECHO', TWOCMD', HEXLIM', REFUSAL', CLASSB', CLASSC', GROUP', COPYTRUNC', UNCLASS', LABEL' and REGRESS'. Two lines are load-bearing:
  - `GROUP'      PASS ... capacity: R=9 <= 128; the drops since the baseline, 0 of the stream kind and 0 of the other; ...`
  - `LABEL'      PASS    the label parses with D = S + O and S > 0: "▾ Console — 162 actions (547 dropped: 547 of data requests, cancels and log lines; 0 of other entries)"`
  - The full block is in `1-console.log`.

**Mutation runs**

- **Run 2, M-G1: FAIL, outside the set. Finding, class 2.**
  - First FAIL line: `[GROUP'] FAIL (33060ms): page.click: Timeout 30000ms exceeded.`
  - The set was `GROUP': capacity:`. The inserted line's own click timed out. The call log says `locator resolved to <button type="button" aria-expanded="true" class="console-disclosure">▾ Console — 150 actions (370 dropped: 370 of data…</button>`, then `element is not visible`. The capacity check was never reached.
  - REGRESS' failed and `[FIND']` failed with a `page.fill` timeout, both after the GROUP' failure. The FIND' failure may follow from the same collapsed Console.
  - LABEL' passed: `"▾ Console — 159 actions (595 dropped: 595 of data requests, cancels and log lines; 0 of other entries)"`.

- **Run 3, command-bar, none: PASS.** Every step passed, including all of the following:
  - `OPEN, E-CTRLK, E-SEARCH, E-HELP, E-BARFOCUS, E-REVEAL, E-SLASH, E-FIELD, E-AND, E-REFUSE, E-TOOLONG, E-ADV, E-PANEL, E-SEL, FIXTURES`.
  - Every E-AND line in the log (lines 16 and 35 are the same text):
    ```
    [E-AND] PASS (22146ms): A 4.4% non-bg (unfiltered 16.5%); A and B on: 0.00%, Applied the exact AND text, card B's commit added exactly one record_step row, at ok (Console after card A's wait: "▾ Console — 153 actions (545 dropped: 545 of data requests, cancels and log lines; 0 of other entries)"; after card B's map settled: "▾ Console — 155 actions (768 dropped: 768 of data requests, cancels and log lines; 0 of other entries)"; dS=223, a=2, L=130, held stream entries before card B's record_step=0); B off: 4.4%, Applied A's text
    E-AND         PASS    A 4.4% non-bg (unfiltered 16.5%); A and B on: 0.00%, Applied the exact AND text, card B's commit added exactly one record_step row, at ok (Console after card A's wait: "▾ Console — 153 actions (545 dropped: 545 of data requests, cancels and log lines; 0 of other entries)"; after card B's map settled: "▾ Console — 155 actions (768 dropped: 768 of data requests, cancels and log lines; 0 of other entries)"; dS=223, a=2, L=130, held stream entries before card B's record_step=0); B off: 4.4%, Applied A's text
    ```
  - That is no F2′. Amendment 1 says an M-CB3 run is not evidence if the held-stream count before card B's `record_step` is above 0. Here it is 0, so the amendment's condition for running M-CB3 holds.

- **Run 4, M-CB1: FAIL, outside the set. Finding, class 2.**
  - Both E-AND lines:
    ```
    [E-AND] FAIL (41968ms): page.click: Timeout 30000ms exceeded.
    E-AND         FAIL    page.click: Timeout 30000ms exceeded.
    ```
  - The set was F2′. The cause is the same as run 2: the inserted line's click found `.console-disclosure` "not visible", with the label `▾ Console — 153 actions (545 dropped: 545 of data…`. The 200 toggling clicks collapse the Console, and the button then stops being clickable. F2′ was not reached.

- **Run 5, M-CB3: PASS. Finding, class 2 (a pass of a run made).** `grep -c FAIL` on the log printed 0, and the exit code was 0. The set was F4 with n = 0. Both E-AND lines:
  ```
  [E-AND] PASS (21568ms): A 4.4% non-bg (unfiltered 16.5%); A and B on: 0.00%, Applied the exact AND text, card B's commit added exactly one record_step row, at ok (Console after card A's wait: "▾ Console — 153 actions (545 dropped: 545 of data requests, cancels and log lines; 0 of other entries)"; after card B's map settled: "▾ Console — 155 actions (768 dropped: 768 of data requests, cancels and log lines; 0 of other entries)"; dS=223, a=2, L=130, held stream entries before card B's record_step=0); B off: 4.4%, Applied A's text
  E-AND         PASS    A 4.4% non-bg (unfiltered 16.5%); A and B on: 0.00%, Applied the exact AND text, card B's commit added exactly one record_step row, at ok (Console after card A's wait: "▾ Console — 153 actions (545 dropped: 545 of data requests, cancels and log lines; 0 of other entries)"; after card B's map settled: "▾ Console — 155 actions (768 dropped: 768 of data requests, cancels and log lines; 0 of other entries)"; dS=223, a=2, L=130, held stream entries before card B's record_step=0); B off: 4.4%, Applied A's text
  ```
  - The numbers are identical to unmutated run 3. In the ordinary state the other-kind drop count is 0 at both readings, so reading `droppedOther` as 0 changes nothing. This matches §4's "known pass case" worry (ADV-2026-11-22-26 item 2).

- **Run 6, M-A4-1: FAIL, in the set.** First FAIL line, and the E-AND line, both byte for byte:
  ```
  [E-AND] FAIL (41359ms): E-AND: the newest record_step rows did not end with card A's step at ok before card B ([])
  E-AND         FAIL    E-AND: the newest record_step rows did not end with card A's step at ok before card B ([])
  ```
  This is card A's wait line, as the set requires.

- **Run 7, M-A4-3: FAIL, in the set.** F4 with n = 2, both rows `filter:` plus the combined text:
  ```
  [E-AND] FAIL (16548ms): E-AND: card B's commit added 2 record_step rows, expected exactly one, at ok, carrying the combined text: [["filter:(\"zone\" = 'residential') AND (\"zone\" <> 'residential')","ok"],["filter:(\"zone\" = 'residential') AND (\"zone\" <> 'residential')","ok"]]
  E-AND         FAIL    E-AND: card B's commit added 2 record_step rows, expected exactly one, at ok, carrying the combined text: [["filter:(\"zone\" = 'residential') AND (\"zone\" <> 'residential')","ok"],["filter:(\"zone\" = 'residential') AND (\"zone\" <> 'residential')","ok"]]
  ```

- **Run 8, M-X2: FAIL, in the set.** F4 with n = 2, card A's text then the combined text. The inserted line was checked byte for byte against `c67-mx2-line.txt` with `cmp` (rc 0):
  ```
  [E-AND] FAIL (16992ms): E-AND: card B's commit added 2 record_step rows, expected exactly one, at ok, carrying the combined text: [["filter:\"zone\" = 'residential'","ok"],["filter:(\"zone\" = 'residential') AND (\"zone\" <> 'residential')","ok"]]
  E-AND         FAIL    E-AND: card B's commit added 2 record_step rows, expected exactly one, at ok, carrying the combined text: [["filter:\"zone\" = 'residential'","ok"],["filter:(\"zone\" = 'residential') AND (\"zone\" <> 'residential')","ok"]]
  ```

- **Run 9, recording: PASS.** Every step passed. The Summary is OPEN, APPLY, STYLE, RESET and RECORD, all PASS, ending `Full console ledger: ...recording-console-ledger-1795383786283.json`. This suite launched its own app, and nothing was left to stop.
- **Run 10, project: PASS.** Every step passed: OPEN, CLAUSES, STYLE, POSE, SAVE, READBACK-FILTER, READBACK-STYLE, READBACK-VIEW, SECOND-SAVE, INSIDE-OPEN, INSIDE-SAVE, NOTICE-S18. There was no listener after it.
- **Run 11, reopen: PASS.** Steps R1 to R9 and E-CHANGED all passed. Example label from R5:
  `▾ Console — 146 actions (438 dropped: 438 of data requests, cancels and log lines; 0 of other entries)`.
  No listener was left after it.

- **Run 12, table, no mutation: FAIL. This is a stop.**
  - Tail of the log (last 60 lines, trimmed; the full log is `12-table.log`):
    ```
    [PC-E1] FAIL (1ms): PC-E1: SPATIAL_E2E_FILTER_ZONE_COUNTS is not set. Give the generator's printed zone_counts (generate_the_filter_fixture), e.g. [517, 498, 480, 505]; the oracle count is not guessed
    [PC-E2] PASS (25497ms): ...
    [PC-E3] PASS (5197ms): ...
    [PC-E4] PASS (19464ms): ...
    [table] fixtures hash-identical before and after: filter-zoned.parquet 92ed800ccbcc, 100k-happy-path.parquet fd0c74ab2d5d, slow-filter-scan.parquet 3fd819cb35aa
    [table] 3 PASS, 1 FAIL: PC-E1=FAIL PC-E2=PASS PC-E3=PASS PC-E4=PASS
    ```
  - The cause is a harness precondition missing from the brief, not a product failure. `e2e/table.mjs:245-248` needs the env var `SPATIAL_E2E_FILTER_ZONE_COUNTS` set to four positive integers, the printed `zone_counts` of `generate_the_filter_fixture`. It never skips PC-E1.
  - I did not re-run (no "run twice to make it green"). The custodian needs to supply that value, or rule it out of scope for this series.

**App stops after each run.** Method: list `Win32_Process` matches, exclude my own bash and powershell calls, take roots whose parent is not listed, and check each 5180/9223 listener's ancestry is under a root. Then `taskkill /T /F` on the roots. PID 54920 was never touched.
- Roots killed, by run:
  - run 0: `cmd.exe 50924`, `node.exe 70016`, `spatial-ide-shell.exe 55520`
  - run 1: `cmd.exe 73596`, `node.exe 50204`, `spatial-ide-shell.exe 520`
  - run 2: `cmd.exe 19048`, `node.exe 81868`, `spatial-ide-shell.exe 10612`
  - run 3: `cmd.exe 44768`, `node.exe 74764`, `spatial-ide-shell.exe 37956`
  - run 4: `cmd.exe 53492`, `node.exe 50020`, `spatial-ide-shell.exe 18244`
  - run 5: `cmd.exe 26452`, `node.exe 74128`, `spatial-ide-shell.exe 42156`
  - run 6: `cmd.exe 79668`, `node.exe 56996`, `spatial-ide-shell.exe 1676`
  - run 7: `cmd.exe 72808`, `node.exe 16120`, `spatial-ide-shell.exe 52492`
  - run 8: `cmd.exe 5620`, `node.exe 20896`, `spatial-ide-shell.exe 64324`
  - run 12: `cmd.exe 26448`, `node.exe 5184`, `spatial-ide-shell.exe 27064`
- Runs 9, 10 and 11 left nothing running.
- After every stop, netstat for 5180 and 9223 printed nothing (rc=1).
- The first listing for run 0 also matched my own bash and powershell calls (13308, 48520, 37936). Those are not the run's processes, and I left them alone.

**Hold lines**, masked:
- Every hold printed `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=<m> also=<m>`.
- Every release printed `MACHINE_RELEASED project=<m> shell=<m> affinity=FF (cores 0-7)`.
- Run 2 and run 6 each printed `MACHINE_WAITING shared: turn of <m> held by pid <m> since <t>`. Run 2 waited about 14 minutes.
- No exit code 96 to 99. No Guardian or harness refusal.

**Timing-sensitive.** Run 2's 33 s GROUP' timeout is deterministic (the element is "not visible"), not a timing effect. No attach-line failure occurred. Nothing else is marked timing-sensitive.

**Other notes.**
- The M-CB3 pass and the M-G1 and M-CB1 click failures all point at the form's mutation text, not the product. The form, ADV-2026-11-22-26 item 2 and the mutation text should be re-read. In M-G1 and M-CB1, the 200 clicks of `.console-disclosure` toggle it open and closed, and the button becomes not visible. The form assumed the clicks only evict entries.
- Run 2's FIND' failure and REGRESS' failure follow the collapsed Console and are not independent findings.
- The e2e `console.mjs`'s "REGRESS'" step itself ran `e2e:regression` and `e2e:admission` against run 1's app and both passed (342748 ms and 43319 ms).

Model: Sonnet 5.5 (claude-sonnet-5-5).

## Part 2, its second hand-back: run 12b, after the custodian's message

*2177 bytes, sha256 97c3a8b9c2b6c28bb2628dd30a942381f31771d7f26c586b32534c6cb80f706e, nothing masked; its run: Bash 7, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-sonnet-5-5, from 2026-11-22T22:03:24Z to 2026-11-22T22:05:23Z by its transcript; 2 calls named the main checkout.*

---

**Run 12b: PASS (exit 0).** This supersedes my earlier Stopped report only for run 12. The rest of that report stands.

- **Hash check:** `sha256sum` of the file `e2e/table.mjs` reads, `C:/dev/spatial-ide/target/fixtures/manual-walkthrough/filter-zoned.parquet`, printed `92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46`. That equals the expected value. I only hashed the file, in the main checkout, and did not write there.
- **Pre-checks:** HEAD printed `12251bc8850127b72a9fb2b5fce63c33ef2d7075`. `git status --porcelain` printed nothing. Nothing listened on 5180 or 9223.
- **Run:** I ran it with `SPATIAL_E2E_FILTER_ZONE_COUNTS='[402, 392, 389, 421]'`. Exit code 0. UTC 2026-11-22T22:03:34Z to 22:04:56Z.
- **`[table]` lines, byte for byte** (from `<S>/c67e/12b-table.log`; the suite has no `== Summary ==` block):
  ```
  [table] fixtures hash-identical before and after: filter-zoned.parquet 92ed800ccbcc, 100k-happy-path.parquet fd0c74ab2d5d, slow-filter-scan.parquet 3fd819cb35aa
  [table] 4 PASS, 0 FAIL: PC-E1=PASS PC-E2=PASS PC-E3=PASS PC-E4=PASS
  ```
- **Copies and times:** `e2e/out` is copied to `<S>/c67e/12b-table-out/`. The times are appended to `<S>/c67e/times.txt`.
- **App stop:** I killed the roots `cmd.exe 73568`, `node.exe 67736` and `spatial-ide-shell.exe 75136`. Both the 5180 listener (pid 67736) and the 9223 listener (pid 18556) were under those roots. Netstat afterwards printed nothing (rc=1). `git status --porcelain` is empty.
- **Hold lines, masked:** `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=<m> also=<m>`, then `MACHINE_RELEASED project=<m> shell=<m> affinity=FF (cores 0-7)`. There was no waiting line and no exit code 96 to 99.
- **Failure classes:**
  - The harness is the product's own `npm run e2e:table`.
  - The claim points to `<S>/c67e/12b-table.log`.
  - The log lines describe head 12251bc8.
  - All four PC steps reached their assertions.
- **Series total:** runs 1, 3, 9, 10, 11 and 12b pass. Runs 6, 7 and 8 fail in their sets. The M-CB3 pass and the M-G1 and M-CB1 failures outside their sets stand as reported.

Model: Sonnet 5.5 (claude-sonnet-5-5). No override and no context handoff.
