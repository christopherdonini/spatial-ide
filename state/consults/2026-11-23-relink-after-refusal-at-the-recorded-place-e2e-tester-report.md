*Filed by the custodian: the tester's report of the E-REOPEN series with R10 and M-E1, node:relink-after-refusal-at-the-recorded-place@e2e-tester-1, on branch cut/relink-after-refusal (P0 at 3885d02bc4dbb4e02a15ca208b5a0f41085766eb, head at 06a2825a1dd9e55649605487f1065810905dad58), dispatched at 2026-11-23T14:57:34Z. Its run: Bash 40, Read 2, Edit 2, Grep 1, SubagentHandback 1, by unique call ids, 1 calls errored; model claude-sonnet-5-5, from 2026-11-23T14:57:35Z to 2026-11-23T15:36:25Z by its transcript; 0 calls named the main checkout. The report below from its hand-back, 9055 bytes, sha256 67175633de667526c2e7295fd112962b616e907bf9f08e7ef847b177a073027f, byte for byte, with one final newline added. Its claims are the build gates' to read; it is evidence for them, not a gate.*

---

**Done.** All four counted runs behaved as the form predicts. Nothing was a stop, and nothing was timing-sensitive.

**Setup**
- `rev-parse HEAD` printed 06a2825a1dd9e55649605487f1065810905dad58. `status --porcelain` printed nothing.
- No process was listening on 5180 or 9223. The grep gave rc=1 with no output, and I re-checked before each run.
- `df -m`: C: has 45480 MB free (floor 40960) and D: has 243304 MB free.
- `<O>` is `<S>/relink-e2e`. It was empty when I created it.

**Phase P0**
- Checkout of `3885d02bc4dbb4e02a15ca208b5a0f41085766eb`: `rev-parse` printed it, and `status --porcelain` printed nothing.
- Shell `npm run build`: exit 0. It ran 2026-11-23T14:58:03Z to 14:59:50Z. Last log line: `✓ built in 15.16s`.
- Pre-build at P0: exit 0. It ran 14:59:55Z to 15:21:03Z. Last log line: `Finished \`dev\` profile [unoptimized + debuginfo] target(s) in 21m 01s`.
- Run 0 (warm-up, not counted) went through the attach step without trouble, so no `0b`.
  - Exit 1. It ran 15:21:13Z to 15:25:38Z.
  - R1 to R9 PASS. `[R10] FAIL (11551ms): R10: the refused block shows no .admission-reopen-relink button`.
- Run 1 (counted) ran at P0 3885d02b with no M-E1. Exit 1. It ran 15:25:42Z to 15:27:03Z.
  - R1 to R9 PASS. The R1 to R9 lines I read in full are in the table below.
  - `[R10] FAIL (11566ms): R10: the refused block shows no .admission-reopen-relink button`.
  - The summary table (`== Summary ==`) ends with `R10        FAIL    R10: the refused block shows no .admission-reopen-relink button`.
  - Last line: `Full console ledger: <u>\...\e2e\out\reopen-console-ledger-1795447615151.json`.

**Phase head**
- Checkout of `cut/relink-after-refusal`: `rev-parse` printed 06a2825a1dd9e55649605487f1065810905dad58, and `status --porcelain` printed nothing.
- Pre-build at head: exit 0. It ran 15:27:11Z to 15:28:57Z. Last log line: `Finished \`dev\` profile [unoptimized + debuginfo] target(s) in 1m 40s`.
- Run 2w (warm-up, not counted): exit 0. It ran 15:29:05Z to 15:32:27Z. R1 to R10 and E-CHANGED all PASS. `[R10] PASS (12234ms)`.
- Run 2 (counted) ran at head 06a2825a with no M-E1. Exit 0. It ran 15:32:27Z to 15:34:04Z. Its log lines, byte for byte, are in the table below.
  - The suite's final lines were the summary table, with `E-CHANGED  PASS` as its last row. The last line was `Full console ledger: <u>\...\reopen-console-ledger-1795448032303.json`.

**Phase M-E1**
- `grep -c -F '{offer !== null && (' AdmissionPanel.tsx` printed `1`.
- `AdmissionPanel.tsx` line 565 was changed by Edit from `{offer !== null && (` to `{false && offer !== null && (`.
- `git diff --stat` before the run:
  ```
   frontends/shell/src/admission/AdmissionPanel.tsx | 2 +-
   1 file changed, 1 insertion(+), 1 deletion(-)
  ```
- Run 3 (counted) ran at head 06a2825a with M-E1 applied. Exit 1. It ran 15:34:23Z to 15:35:50Z.
  - R1 to R9 PASS, with times 5218, 8979, 35, 26, 6115, 4549, 29, 6265 and 12618 ms.
  - `[R10] FAIL (12668ms): R10: the refused block shows no .admission-reopen-relink button`.
- Restore: `cmp` of the `.orig` copy and the file printed nothing (cmp rc=0). `git status --porcelain` after the restore printed nothing, and HEAD is still 06a2825a.

**Lines for runs 1 and 2** (byte for byte; the `[R10]` lines are in the table below). Here are the `[R1]` to `[R9]` lines for runs 1 and 2, which are not in the table:

| Step | Run 1 (P0) | Run 2 (head) |
|---|---|---|
| `[R1]` | `PASS (5174ms): F1 (parcels.parquet in folder P) admitted; the Save control and the first pixels are there` | `PASS (5463ms): ...` same text |
| `[R2]` | `PASS (8966ms): two clauses (the second off), the fill colour #112233 and the camera at (2600900.3333333335, 1200900.2857142857), zoom -0.8571428571428572` | `PASS (8956ms): ...` same text |
| `[R3]` | `PASS (33ms): saved into P through the hook; spatial://project/01ba75fa2ca7fb98d063135754b24ef0; locators machine-recorded,project-relative` | `PASS (36ms): ...; spatial://project/81e21752c109029c348ef1eb0d9bbe2d; locators machine-recorded,project-relative` |
| `[R4]` | `PASS (22ms): refused as skp.project_open_elsewhere with S9's own-window place; the run ended; the open and its two clauses are kept` | `PASS (25ms): ...` same text |
| `[R5]` | `PASS (5407ms): another file opened; the first handle's close_dataset row is at ok (▾ Console — 148 actions (436 dropped: 436 of data requests, cancels and log lines; 0 of other entries); the close_dataset row has 14 entries after it)` | `PASS (5696ms): ... 146 actions (432 dropped: 432 ...); the close_dataset row has 8 entries after it)` |
| `[R6]` | `PASS (4275ms): opened; the open_project request carries answer and relink null, outcome ok (▾ Console — 153 actions (648 dropped: 648 of data requests, cancels and log lines; 0 of other entries); the open_project row has 3 entries after it); filter, clauses, fill colour, opacity and view equal the file's, the view bit for bit` | `PASS (4311ms): ... 153 actions (650 dropped: 650 ...); ... 3 entries after it); ...` same tail |
| `[R7]` | `PASS (18ms): the save answered not-asked (no picker slot used); the file's identity and workspace are unchanged` | `PASS (26ms): ...` same text |
| `[R8]` | `PASS (5764ms): P's handle closed (▾ Console — 162 actions (734 dropped: 734 of data requests, cancels and log lines; 0 of other entries); the close_dataset row has 12 entries after it); Q (a hand copy of P) gave S8 with its text; the same choice opened it (▾ Console — 174 actions (958 dropped: 958 of data requests, cancels and log lines; 0 of other entries)); folders.json lists both folders` | `PASS (6203ms): ... 164 actions (732 dropped: 732 ...); ... 8 entries after it); Q ... (▾ Console — 171 actions (956 dropped: 956 ...)); folders.json lists both folders` |
| `[R9]` | `PASS (11121ms): P2's handle closed (▾ Console — 184 actions (1211 dropped: 1211 of data requests, cancels and log lines; 0 of other entries); the close_dataset row has 14 entries after it); P2's data moved; S11 named moved-away.parquet; the re-link slot's file opened the project` | `PASS (11625ms): ... 184 actions (1204 dropped: 1204 ...); ... 10 entries after it); P2's data moved; S11 named moved-away.parquet; the re-link slot's file opened the project` |
| `[R10]` | `[R10] FAIL (11566ms): R10: the refused block shows no .admission-reopen-relink button` | `[R10] PASS (11949ms): P3's handle closed (▾ Console — 201 actions (1655 dropped: 1655 of data requests, cancels and log lines; 0 of other entries); the close_dataset row has 10 entries after it); P3's data (locators machine-recorded,project-relative) renamed in its folder; refused as skp.project_target_unresolvable with the re-link choice shown; the re-link slot's file opened the project` |
| `[E-CHANGED]` | not reached | `[E-CHANGED] PASS (12182ms): F4's predecessor handle closed (▾ Console — 220 actions (2108 dropped: 2108 of data requests, cancels and log lines; 0 of other entries); the close_dataset row has 12 entries after it); F4 (F1 with its mtime 60 s later) opened; the notice names mtime alone: ["The data differs from what the project recorded when it was saved. In the file: mtime. The project was opened on the data as it is now."]` |

Where a Run 2 cell says "same text", the text matches Run 1's apart from the ms and the numbers shown in that cell.

**Folders.** Each folder holds `app.log`, the ledger JSON and `tauri.e2e.conf.json`. The ledger is the only report file the logs name. The `e2e/out` folder was not emptied between runs, so each copy also holds earlier runs' ledgers.
- Run 0: `<S>/relink-e2e/0-reopen-out/`
- Run 1: `<S>/relink-e2e/1-reopen-out/`
- Run 2w: `<S>/relink-e2e/2w-reopen-out/`
- Run 2: `<S>/relink-e2e/2-reopen-out/`
- Run 3: `<S>/relink-e2e/3-reopen-out/`
- Logs, times and `AdmissionPanel.tsx.orig`: `<S>/relink-e2e/` (`<n>-reopen.log`, `build.log`, `prebuild-*.log`, `times.txt`, `build-times.txt`, `prebuild-*-times.txt`).

**Hold and release lines** (masked as the machine paragraph says). Every call printed `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:<pid> also=<m> (commands started from now on inherit it; release when done)` and `MACHINE_RELEASED project=<m> shell=bash.exe:<pid> affinity=FF (cores 0-7)`.
- That covers the build, both pre-builds and runs 0, 1, 2w, 2 and 3.
- No `others=`, MACHINE_WAITING or MACHINE_ERROR line appeared.
- No exit code 96 to 99.
- No Guardian or harness refusal.

**Harness and gate notes**
- Harness: the runs went through `npm run e2e:reopen`, the shell's own suite, on the real app over CDP. They used no private hook of mine.
- Results table: no results file exists for this piece, and I wrote none. These numbers are in this report only.
- Operator-facing lines: the step lines above are the suite's own output at this commit.
- Assertions: run 1 and run 3 reached R10's button check, and run 2 reached every assertion, E-CHANGED included.
- No token usage figures to report.

**Model:** I observe myself as Sonnet 5.5 (claude-sonnet-5-5). No model override, no context handoff.
