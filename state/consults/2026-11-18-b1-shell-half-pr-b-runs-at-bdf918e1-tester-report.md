Series: b1-shell-half PR B at bdf918e1dcf7669a52e583131d645ef748c8855d, tester, port-5400 harness (the custodian's filing note, 2026-11-18: the tester, PLAN node b1-shell-half, PR B's runs at bdf918e1 by the advisor's ruling ADV-2026-11-18-04 item 5; dispatched at 2026-11-18T11:23:14.084Z by the custodian's transcript, its prompt naming the brief in the custodian's scratch folder (8985 bytes, sha256 ef60f284820c86200b67220fc10e6da897ade073ebdd43f483e883ffa629cf6b); the run 2026-11-18T11:23:19.102Z to 2026-11-18T11:57:52.839Z by its transcript, Bash 35, Read 4, SubagentHandback 1; its first hand-back below, byte for byte, with the user-profile folder written as <u> in 7 places, with this note added in its first line and one final newline)

Result: At H2, `npm run verify` and four of the five suites passed (colour, style, console, project). The recording suite failed once, at its RECORD step (rc=1), and was not re-run. The fixtures are unchanged and no stop rule fired.

Model: I am Sonnet 5.5, exact ID claude-sonnet-5-5, as the harness reports it. There was no model override and no context handoff. I have no token figures to give.

Four failure classes, as they apply to this harness:
1. Interface: the suites drive the real debug exe (`spatial-ide-shell-m4b.exe`, a Tauri window) over CDP on port 9223, with vite on 5400. I used no mock or stub in place of the product.
2. Result claims: every claim below points to a file in `<S>`, named `s327h-*`.
3. Operator-facing lines: the logs' first lines name the worktree HEAD (H2) and a start time. Each describes this run at this commit.
4. Assertions reached: each suite's log shows its own step PASS/FAIL lines, so the steps ran to their assertions. The one exception is recording. Its OPEN, APPLY, STYLE and RESET steps passed and RECORD failed at its assertion (details below).

**Start state and checks**
- HEAD was bdf918e1dcf7669a52e583131d645ef748c8855d on branch `cut/b1-shell-half-pr-b`, with porcelain empty (0 lines). The fetch rc was 0.
- Disk free: C: 49G, D: 367G. Both are over the floors.
- The harness check with `sha256sum -c` printed OK for all 10 files: `m4b-e2e-app-down.ps1`, `m4b-e2e-app-up-wait.ps1`, `m4b-e2e-app-up.ps1` and the rest. I read `m4b-e2e-run-suite.sh` whole.
- The debug exe is 91555840 bytes with sha256 01073a95deabb32efdc6ac03c3625fd2a5beb22a36ee6c07a5bb92068fb41b9b, as given.
- The product-code diff (6f7e744c to H2: `src-tauri`, `kernel/src`, `engine/src`, `protocol`, the Cargo files, `renderer/src`) printed nothing.
- The package/lock diff (6f95993e to H2) printed nothing, so I ran no `npm ci`.

**Item 5 (c)'s two outputs**
The `--stat` (also in `<S>/s327h-c-stat.txt`):
```
 frontends/shell/src/App.tsx              |  2 +-
 frontends/shell/src/style/StylePanel.tsx | 13 ++++---------
 frontends/shell/src/table/tableSource.ts |  2 +-
 3 files changed, 6 insertions(+), 11 deletions(-)
```
The App.tsx and tableSource.ts diff, whole (also in `<S>/s327h-c-diff.txt`):
```
diff --git a/frontends/shell/src/App.tsx b/frontends/shell/src/App.tsx
index 76b4e0f3..45c80e95 100644
--- a/frontends/shell/src/App.tsx
+++ b/frontends/shell/src/App.tsx
@@ -2051,7 +2051,7 @@ export default function App() {
     for (const transition of transitions) stepQueue.enqueue(dataset, transition);
   }
 
-  // Milestone 4 PR B (OPEN-20 (a), the form's Amendment 16): when Colour by changes to a column other than the one the previous render coloured by (after One colour, that is none), while the status bar says attributes were not held, the first look is issued again under the active filter; `withinAttributeCeiling` then keeps that column. No step is recorded: the filter did not change.
+  // Milestone 4 PR B (OPEN-20 (a), the form's Amendment 16): when Colour by changes to a column other than the one the previous render coloured by (when no match is set, as after One colour or an open, that is none), while the status bar says attributes were not held, the first look is issued again under the active filter; `withinAttributeCeiling` then keeps that column. No step is recorded: the filter did not change.
   const previousColourColumn = useRef<string | null>(null);
   const colourColumn = view?.style.fillMatch?.column ?? null;
   useEffect(() => {
diff --git a/frontends/shell/src/table/tableSource.ts b/frontends/shell/src/table/tableSource.ts
index 4044b082..b7b91ec1 100644
--- a/frontends/shell/src/table/tableSource.ts
+++ b/frontends/shell/src/table/tableSource.ts
@@ -41,7 +41,7 @@ export interface TableSnapshot {
   readonly phase: TablePhase;
   /** The filter this result was issued with: `null` for none, and before any issue. */
   readonly filter: Filter | null;
-  /** The request this result belongs to: a number each `start` changes, 0 before any (a wait compares it with the one its own `start` gave). */
+  /** The request this result belongs to: a number each `start` made before `end` or `dispose` changes, 0 before any (a wait compares it with the one its own `start` gave). */
   readonly request: number;
   readonly count: number;
   readonly ids: ReadonlySet<bigint>;
```
I judge nothing here; the custodian reads both against item 5 (c).

**Verify (hold)**
- `npm run verify` in `frontends/shell` ran once, whole, and exited rc=0. The log is `<S>/s327h-verify.log`.
- Vitest: 118 test files passed (118), 1505 tests passed (1505). Duration 86.26s.
- The last 10 lines of the log:
```
✔ T6 a refusal carrying the could-not-re-read detail, prefix read from the real descriptor.rs, reads FAIL, R (0.3015ms)
✔ T7 a {mtime} refusal beside a refusal of another code reads FAIL, C3 (0.3323ms)
ℹ tests 7
ℹ suites 0
ℹ pass 7
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 19.2861
```

**Suites**
Each ran as `h2-<name>` through its own hold, with no `--measure`. Times are UTC and come from each log's own start and end lines.

| tag | start | end | rc | PASS | FAIL |
|---|---|---|---|---|---|
| h2-colour (`SHIMDIR=shim-wait`) | 11:28:54Z | 11:29:27Z | 0 | 5 | 0 |
| h2-style | 11:30:42Z | 11:30:56Z | 0 | 6 | 0 |
| h2-console | 11:31:25Z | 11:37:50Z | 0 | 11 | 0 |
| h2-project | 11:38:26Z | 11:38:54Z | 0 | 12 | 0 |
| h2-recording | 11:39:35Z | 11:40:21Z | 1 | 4 | 1 |

The PASS and FAIL counts are my greps for "PASS (" and "FAIL (" in each `<S>/s327h-h2-<name>.log`. For colour they match the PB-E1 to PB-E5 step lines.

**First and last two lines of each log**, byte-copied and cut to 170 characters. The `<S>/s327h-h2-<name>.log` files hold them whole.
- colour:
  - First: `worktree C:/dev/wt/m4b head bdf918e1dcf7669a52e583131d645ef748c8855d start 2026-11-18T11:28:54Z`
  - Second: `colour: fixture sha256 92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46; the store for this run is <u>\AppData\Local\Temp\spatial-colour-`
  - Last two: `Full console ledger: C:\dev\wt\m4b\frontends\shell\e2e\out\colour-console-ledger-1795001367227.json` and `rc=0 end 2026-11-18T11:29:27Z`
- style:
  - First: `worktree C:/dev/wt/m4b head bdf918e1dcf7669a52e583131d645ef748c8855d start 2026-11-18T11:30:42Z`
  - Second: `(node:43844) [DEP0190] DeprecationWarning: Passing args to a child process with shell option true can lead to security vulnerabilities, as the arguments are not escaped, `
  - Last two: `This run launched the app; it stays RUNNING on CDP port 9223 for further interactive use.` and `rc=0 end 2026-11-18T11:30:56Z`
- console:
  - First: `worktree C:/dev/wt/m4b head bdf918e1dcf7669a52e583131d645ef748c8855d start 2026-11-18T11:31:25Z`
  - Second: `(node:55316) [DEP0190] DeprecationWarning: Passing args to a child process with shell option true can lead to security vulnerabilities, as the arguments are not escaped, `
  - Last two: `This run launched the app; it stays RUNNING on CDP port 9223 for further interactive use.` and `rc=0 end 2026-11-18T11:37:50Z`
- project:
  - First: `worktree C:/dev/wt/m4b head bdf918e1dcf7669a52e583131d645ef748c8855d start 2026-11-18T11:38:26Z`
  - Second: `project: fixture sha256 92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46; the store for this run is <u>\AppData\Local\Temp\spatial-project-g4lVJi; the folders are C:\U`
  - Last two: `Full console ledger: C:\dev\wt\m4b\frontends\shell\e2e\out\project-console-ledger-1795001933646.json` and `rc=0 end 2026-11-18T11:38:54Z`
- recording:
  - First: `worktree C:/dev/wt/m4b head bdf918e1dcf7669a52e583131d645ef748c8855d start 2026-11-18T11:39:35Z`
  - Second: `recording: the store for this run is <u>\AppData\Local\Temp\spatial-recording-dRKvrE\spatial-ide\sessions (LOCALAPPDATA=<u>\AppData\Local\Temp\`
  - Last two: `recording: the scratch store is kept for inspection at <u>\AppData\Local\Temp\spatial-recording-dRKvrE` and `rc=1 end 2026-11-18T11:40:21Z`

For each suite I copied the log, the app's stderr and the session log the stderr names into `<S>` as `s327h-h2-<name>.log`, `.app.err.log` and `.session.log`.

**The failing steps' lines** (recording, byte-copied):
```
[RECORD] FAIL (30624ms): no readable history.jsonl under <u>\AppData\Local\Temp\spatial-recording-dRKvrE\spatial-ide\sessions (folders: ["unsaved-ddefdf0fc13b974de2a5c00c169d216d"]); a live lock would read as this
RECORD  FAIL    no readable history.jsonl under <u>\AppData\Local\Temp\spatial-recording-dRKvrE\spatial-ide\sessions (folders: ["unsaved-ddefdf0fc13b974de2a5c00c169d216d"]); a live lock would read as this
```
- I did not re-run it and I make no timing call. The brief's I4 would record it as timing-dependent only if it were.
- Observation only: after the run, the kept scratch store has a `history.jsonl` of 5043 bytes, dated 11:39:50Z. That is during the run, inside the 30.6 s the RECORD step was waiting.

**Holds**
- Every hold and release printed one line each: `MACHINE_HOLD shared project=<m>` and `MACHINE_RELEASED project=<m>`.
- There were no MACHINE_WAITING or MACHINE_ERROR lines, no exit 96 to 99, and no WAIT_TIMEOUT, so no hold was requested twice.
- The hold lines carry no times, so I give none. The suites' own start and end times are in the table above.
- The six holds were verify, colour, style, console, project and recording. Their files are `<S>/s327h-verify-hold.txt`, `<S>/s327h-h2-<name>.hold.txt` and the matching `.rel.txt` files.

**Repository checks** (from `C:/dev/wt/m4b`, no hold)
- `node scripts/plan/verify.mjs --offline` rc=0. Last line: `verify:plan PASS — C:\dev\wt\m4b\governance\PLAN.yaml agrees with the repository.`
- `node scripts/plan/verify-cites.mjs` rc=0. Last line: `verify:cites PASS — every rooted (in-tree) path:line reference across 3192 file(s) resolves. (196 loose reference(s) advised above.)`
- `node scripts/plan/verify-quotes.mjs` rc=0. Last line: `verify:quotes PASS — 156 checked, 125 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 936 ruling cites resolved, 0 ruling-cite errors.`
- Output is in `<S>/s327h-repo-verify.txt`, `<S>/s327h-repo-verify-cites.txt` and `<S>/s327h-repo-verify-quotes.txt`.

**Fixtures**
`target\fixtures\manual-walkthrough` holds 34 files. `<S>/s327h-fix-before.txt` and `<S>/s327h-fix-after.txt` list each with size and sha256. `cmp` of the two printed nothing (rc=0), so nothing changed.

**End state**
- HEAD is bdf918e1dcf7669a52e583131d645ef748c8855d and the porcelain is empty (0 lines).
- The harness sha256 check at the end showed 0 files not OK.
- The `netstat` filter for ports 9223 and 5400 printed nothing, so both are free. Each suite's own app-down step also printed `port 9223 free` and `port 5400 free`.
- `tasklist` shows no `spatial-ide-shell` process. The `node.exe` entries listed are not ones I started. The only node processes I started were the `verify-quotes.mjs` ones, and those had exited by the time of the final listing.
- No background shell of mine is still running.

**Anything done that the brief does not name**
- I wrote `<S>/s327h-after.sh`, a small copy-and-count helper. It copies a suite's log, stderr and session log and prints PASS and FAIL counts. I ran it more than once per suite because some outputs were lost in the background calls.
- I made read-only looks at the recording suite's kept scratch store (`stat` of `history.jsonl`).
- Several waits moved to background after 180 s. These were wait loops only, with no second copy of any suite or hold.
- Run-suite had no extra writes. It copied reports into `<S>/m4b-e2e-h/out`, as its script does.
- I did not use `git stash`, checkout, commit or push. Nothing was written in the main checkout.

Files, all under `<S>`: `s327h-verify.log`, `s327h-h2-{colour,style,console,project,recording}.{log,app.err.log,session.log,hold.txt,rel.txt,rc}`, `s327h-c-stat.txt`, `s327h-c-diff.txt`, `s327h-fix-before.txt`, `s327h-fix-after.txt`, `s327h-repo-*.txt`.
