Reviewed: branch cut/colour-by-refill-keeps-the-view at c60660bd196d73086c603aac7605d493784167b8, PR 365 (draft), in the branch worktree C:/dev/wt/cbr, read only; the records at main 4630fa09bec7d7c66a15393de0bd13d64537a9a1 in D:/wt/read-1124b; the series report and its logs in the scratch folder (the custodian's filing note, 2026-11-24: the reviewer's narrow read of the suite fix with the E-RK1 series 2, attempt 2, node:colour-by-refill-keeps-the-view@fix-narrow-reviewer-1, under ADV-2026-11-24-01 item 4, dispatched at 2026-11-24T02:21:04Z; its run: Bash 22, Read 1, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-24T02:21:05Z to 2026-11-24T02:25:30Z by its transcript; 0 calls named the main checkout; handed back at 2026-11-24T02:25:30Z. Filed below the rule from its hand-back, 12385 bytes, sha256 9ec894694e5eec475c046dd45ad38c71b045523c5868c53ce8ee328a7d5fac3d, byte for byte, nothing masked; 1 path of a file not on main, cited with a line, written as the file name alone by the custodian: `frontends/shell/e2e/colour-refill.mjs` to `colour-refill.mjs`, with one final newline added.)

---

Verdict: PASS WITH NOTES
Reviewed: C:/dev/wt/cbr @ c60660bd196d73086c603aac7605d493784167b8 (`cut/colour-by-refill-keeps-the-view @ c60660bd196d73086c603aac7605d493784167b8`)
REPORT PATH: state/consults/gates/2026-11-24-colour-by-refill-keeps-the-view-fix-narrow-read-reviewer.md

Nothing blocks. There are no Correctness or Evidence findings. There are two Documentation findings, D-F1 and D-F2, both must-fix before the merge, plus one suggestion.

## Check 1: the fix commit's scope
- I ran `git diff --stat 480445f9 c60660bd` and `git diff 480445f9 c60660bd`, and read the whole diff and the whole file at c60660bd.
- The diff stat names `frontends/shell/e2e/colour-refill.mjs` alone, with 23 lines added and 9 removed. The commit's parent is 480445f9.
- Amendment 8's numbers recomputed true:
  - blob `1a5178c83b447e06a3f4f00920c51e990761673e`, 15866 bytes, sha256 `0e94e0478db0428c4ac20e297f4efdab78440756c4d2a39a2b38623a449ff35d`;
  - `git diff --numstat e4e6493d...c60660bd` gives 941 lines over 12 paths.

## Check 2: what the fix changes
Every changed line is about finding the log:
- **Header comment, line 8:** names the log folder.
- **`statSync` import:** gives the listing's `{name, mtimeMs}` shape for the helper.
- **`PROFILE_LOCALAPPDATA` is kept before the scratch overwrite, and `LOG_DIR` is built from it** (lines 31-33).
- **`LAUNCH_MS`:** declared at line 34 and set at line 210, just before `attachOrLaunch`.
- **The import of `newestSessionLogSinceLaunch` from `residencyTrace.mjs`.** At c60660bd this helper is the one at 8329a53c; the file has no change from 480445f9.
- **The new `sessionLogPath()`, and `sessionLogLines()` rewritten through it** (lines 81-92).
- **A new exit 2 before launch when `LOCALAPPDATA` is unset** (lines 205-208).
- **Two console texts:** line 209 adds the log folder, and line 226 removes "with the session log" (which was false) and prints the selected path.

What I confirmed:
- No hunk touches `run()`.
- Asserts (a) to (c), their thresholds, the pixel-span tolerance (`1 / 2 ** zoom`), `FIRST_LOOK_ROWS`, every `Void` condition, every wait and timeout, and every port are byte-identical to 480445f9. This answers ADV-2026-11-24-01 item 4: no assert, wait or port changed.
- At 480445f9 the folder read could never exist, so every run ended VOID. The fix makes a run able to reach the asserts at all. It weakens no check.
- The new exit 2 replaces a run that was certain to VOID. It cannot pass.
- `newestSessionLogSinceLaunch` (`residencyTrace.mjs:207-226`) picks the highest embedded epoch that is at least `floor(LAUNCH_MS/1000) - 5` (`SESSION_LOG_LAUNCH_TOLERANCE_SECONDS`). `sessionLogPath` makes that choice again at every read.

Can the new rule read another run's log, or a stale one?
- **Stale:** only a log stamped within 5 s before `LAUNCH_MS`, and only until this launch writes its own log, which then wins on epoch.
- **Another instance's:** yes. The folder is the profile's own `dev.spatialide.shell/logs`, shared by every instance of the app (`tauri.conf.json:5`, `lib.rs:326-330`). An instance that starts during the run, or up to 5 s before it, writes a newer-stamped log, and the suite switches to it at its next read.
- **The likely result is a VOID or a red at (a).** A false green would need a foreign planned line within 102 m of the panned pre-view box, which ordinary use does not reach.
- **This series is clean of it** (check 4). The comment overstates the rule; see D-F1.

## Check 3: the series against the ruling's items 1 to 3
- **Report file.** `<S>/report-cbr-e2e-2.md` is 6723 bytes with sha256 `54ff47ea…005f`, both matching the brief (checked by `wc -c` and `sha256sum`).
- **Item 1, the run before the change.**
  - The report gives `diff --stat` over P0 as `colour-refill.mjs | 36`, with 25 lines added and 11 removed, and status shows only that file.
  - I recomputed `git diff --stat 8329a53c c60660bd -- frontends/shell/e2e/colour-refill.mjs` and got 25 and 11. This is the fix's 23/9 plus 480445f9's 2/2 wording lines, which I read with `git diff 8329a53c 480445f9 -- <file>`.
  - P0's tree has the helper: `residencyTrace.mjs:207` exists at 8329a53c.
  - The report's restore lines show status empty, then the branch checked out at c60660bd.
- **Item 2.**
  - Counted run 1 at P0 exited 1, red at (a) only. Its planned box is the open's fit box and the edge difference is 44112 against a span of 102.42. That is the row's own reason (E-RK1 register row, and I4 as Amendment 2 words it). It is not a VOID, not another red, and not a green.
  - Counted run 2 at the head exited 0 with 3/3: edge difference 0, resident 300000.
  - Run 3, with M-A1, was red at (a) only, as the register's M-A1 set (RK-A1, E-RK1) predicts.
  - **M-A1's edit.** `App.tsx.orig` equals `c60660bd:frontends/shell/src/App.tsx` (`cmp`), and the worktree's `App.tsx` equals it. Line 2147 at c60660bd is the `attempt` line that carries `{ keepCamera: true }`, the edit site the report names.
- **Warm-ups.** Runs 0 and 2w are marked not counted.
- **Item 3, the three VOID runs.** The report names 0 and 0b at P0 8329a53c and d1 at 2095a7ac, each with its end line. The tester took the commits from the brief, but they agree with the two filed consults. The end lines in `<S>/cbr-e2e/0-refill.log`, `0b-refill.log` and `<S>/cbr-diag/d1-refill.log` match the report byte for byte. The cause is named in the diagnosis consult and in the fix commit's message; Amendment 8 item 4 references both.

## Check 4: the logs
- **Assert and end lines.** For runs 1, 2 and 3, a script took every `PASS`/`FAIL` line from `<n>-refill.log` and ran `grep -xF` for it in the report: all nine were found. The `====` lines match. The report gives the `FAILED:` line as `FAILED: (a) ...`, an elision that removes nothing of meaning.
- **Each copied session log is its own launch's.**

| Run | Session log | Name's epoch | Run start | Last line |
|---|---|---|---|---|
| 1 | `session-1795485522.log` | 01:58:42Z | 01:58:29Z | 02:00:05Z |
| 2 | `session-1795486030.log` | 02:07:10Z | 02:06:57Z | 02:09:46Z |
| 3 | `session-1795486230.log` | 02:10:30Z | 02:10:17Z | 02:12:04Z |

  - Each first line's millisecond stamp equals its name's epoch.
  - Each copy is byte-identical to the file of the same name in `<u>/AppData/Local/dev.spatialide.shell/logs/` (`cmp`).
  - That folder holds no other log between 01:54:41Z and 02:12:07Z. The newest before the series is d1's `session-1795479287.log`, from 00:14:47Z.
  - Each copy's second `candidate-first-look-view-planned` line equals the planned box its own suite log prints.

## Check 5: nothing else ran
`git -C C:/dev/wt/cbr status --porcelain` printed nothing, and HEAD is still c60660bd. The records worktree `D:/wt/read-1124b` is at 4630fa09 and clean. The ruling file's sha256 is `236427cd…966d` at both 4a5dfdb7 and 4630fa09, as Amendment 8 item 1 states.

## Findings

**D-F1, Documentation (must-fix before the merge; this is not the human's wording, so the worker applies the words without a re-gate and the PR body lists them).** The two doc comments say the selected log is the one "THIS launch created". The code (`residencyTrace.mjs:207-226`, lines 82-86) picks the newest log in a folder shared by every instance of the app, whose name's stamp is at least 5 s before launch, and it picks again at every read. This is not a shipped-app sentence. The gap needs another instance of the app to start during the run, or up to 5 s before it, so it is named here and in the new words.

`colour-refill.mjs:81`, Old:
```text
/** The path of the newest session log THIS launch created, in the app's own log folder under the profile's Local AppData (the scratch folder holds the store only); null when none. */
```
New:
```text
/** The path of the session log in the app's own log folder under the profile's Local AppData (the scratch folder holds the store only) with the newest name stamp no earlier than 5 s before this launch (`newestSessionLogSinceLaunch`, residencyTrace.mjs), chosen again at each call; null when none. The folder is shared by every instance of the app, so an instance started during the run, or up to 5 s before it, can be read in place of this launch's. */
```
Each clause checked against the code:
- **"newest name stamp":** the helper's highest `session-(\d+)` epoch (`residencyTrace.mjs:216-223`).
- **"no earlier than 5 s before this launch":** `sessionLogThresholdSeconds` = `floor(ms/1000) - 5`, and `LAUNCH_MS` is set before `attachOrLaunch` (line 210).
- **"chosen again at each call":** lines 82-86 list the folder at each call.
- **"shared by every instance":** identifier `dev.spatialide.shell` (`tauri.conf.json:5`) and `app_log_dir()` (`lib.rs:326-330`).
- **"under the profile's Local AppData":** line 33 builds it from the env value kept before the overwrite.

`colour-refill.mjs:88`, Old:
```text
/** The lines of the session log THIS launch created (see `sessionLogPath`); `[]` when none. */
```
New:
```text
/** The lines of the session log `sessionLogPath` chooses at this call; `[]` when none. */
```
Clause checked: lines 90-91 call `sessionLogPath()` once and read that path.

**D-F2, Documentation (must-fix in the filing; these are the tester's words, filed by the custodian).** The series report has two text defects, and a third point applies when it is filed:
- **The run-2w end time in the table is truncated.** `times.txt` gives 2026-11-24T02:06:48Z.
- **One sentence can be read as a claim about the session log.** The copied session logs do not name the scratch store: `grep` for each store's folder name finds 0 lines. The suite log does name it.
- **When filing,** the hold lines' `project=` value is redacted to `<m>`, as the custodian's other filings do.

If the bytes must stay as the tester wrote them, the custodian can carry the corrections as a filing note instead.

Old:
```text
| `2w` (warm-up, not counted) | head `c60660bd` | 0 | 02:02:16 to 06:48 | equals pre-view box | 300000 |
```
New:
```text
| `2w` (warm-up, not counted) | head `c60660bd` | 0 | 02:02:16 to 02:06:48 | equals pre-view box | 300000 |
```
Old:
```text
Run `0`'s log has the same 14071 and fails at (a) as run `1`; the log also names its own scratch store. The P0 warm-up reached its first look, so the stop for a VOID warm-up did not apply.
```
New:
```text
Run `0`'s suite log has the same 14071 and fails at (a) as run `1`; that suite log also names its own scratch store. The P0 warm-up reached its first look, so the stop for a VOID warm-up did not apply.
```

**Suggestion (does not block).** The M-A1 record has the `diff --stat` and the line number (2147) but not the mutated line's text. Next time, recording the one changed line byte for byte would let a reader check the mutation without inferring it from the site.

## Files read
- `C:/dev/wt/cbr`: `frontends/shell/e2e/colour-refill.mjs` (whole, at c60660bd; diffs against 480445f9 and 8329a53c); `frontends/shell/e2e/residencyTrace.mjs:115-226`; `frontends/shell/e2e/README.md` (the colour-refill entry and its diff from e4e6493d); `frontends/shell/src-tauri/src/state.rs:30-60`; `frontends/shell/src-tauri/src/lib.rs` (the `app_log_dir` lines); `frontends/shell/src-tauri/tauri.conf.json` (identifier); `frontends/shell/src/App.tsx:2138-2150`; the fix commit's message.
- `D:/wt/read-1124b` @ 4630fa09: `governance/forms/frontends/COLOUR-BY-REFILL-KEEPS-THE-VIEW-PREREGISTRATION.md` (§4, §11, Amendment 2's §4 and I4 replacements, D2, register rows RK-A1 and E-RK1, Amendment 4 items 5 and D-c, Amendments 7 and 8); `state/directives/2026-11-24-advisor-ruling-adv-2026-11-24-01-colour-by-refills-e2e-before-the-change-the-fix-commits-suite-over-p0-the-three-void-runs-recorded-a-log-folder-finding.md`; `state/consults/2026-11-24-colour-by-refill-keeps-the-view-e2e-tester-reports-two-p0-warm-ups-void.md`; `state/consults/2026-11-24-colour-by-refill-keeps-the-view-e2e-diagnosis-tester-report.md`.
- `<S>/report-cbr-e2e-2.md`; `<S>/cbr-e2e-2/` (`times.txt`, `*.start`, `{0,1,2w,2,3}-refill.log`, `{0,1,2w,2,3}-refill-out/*`, `App.tsx.orig`); the end lines of `<S>/cbr-e2e/0-refill.log`, `<S>/cbr-e2e/0b-refill.log` and `<S>/cbr-diag/d1-refill.log`; the listing of `<u>/AppData/Local/dev.spatialide.shell/logs/`, read only.

I edited, committed and pushed nothing, and ran no build, test or app.

Model: Opus 5.5 (claude-opus-5-5).
