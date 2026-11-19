*Filed by the custodian: the worker's hand-back (claude-sonnet-5-5), 5042 bytes, sha256 7c5d73bb11441835f82dada9fbc9a5213370f192b54a560697577ec487c581fa, below the rule with one mask applied (this project's name, twice in hold lines, written <m>, ADV-2026-11-18-07) and one final newline added; calls Bash 30, Read 2, Edit 2, Write 1, SubagentHandback 1, one errored, from 2026-11-19T07:56:50Z to 08:06:55Z by its transcript. It stopped: E-AND failed at 8a58d91bcc859319ccf9095520313c8c856bee27, unmutated, because a name it calls was not defined. The stop went to the advisor at 2026-11-19T08:07:48Z, ADV-2026-11-19-12 ruled it, and the same worker was resumed at 2026-11-19T08:18:31Z.*

---

Built: open-first-look-fills-fit-view Amendment 5 fix (C1), worker
Result: STOP. E-AND failed at G, unmutated, with `parseLabel is not defined`. The cause is my own omission, not I7. I ran no mutation, no vitest and no second run.

**Start state (step 1):** HEAD was H and the porcelain was empty. `ls-remote` gave H. `df -h`: C: 46G free, D: 362G free.

**What went wrong:**
- I used `parseLabel` at the mark (`command-bar.mjs:478 at 8a58d91b`) but dropped its definition while compacting under the ceiling.
- `node --check` cannot see an undefined name, so it exited 0.
- G is pushed and broken. I did not amend, and I did not make a second commit, because the brief says one commit and G failing is a STOP.

**Step 2:** I did not paste the quoted lines. I read `stepAnd`, `waitCommitted`, `readRecordStepRows`, `stepKey`, `settleMap` and the header, the label and group rows in `ConsolePanel.tsx`, and `push` in `recorder.ts`. The lines I relied on, all at H:
- Label: `ConsolePanel.tsx:64-68`. Held and dropped are set in one `sync`: `ConsolePanel.tsx:48-52`.
- Group row: `ConsolePanel.tsx:106-131`. A group is closed by default, and its key is its first entry's seq.
- Ring: `recorder.ts:282-288` (`push` shifts the oldest entry and counts a drop).
- Edited steps: `command-bar.mjs:433-434` (card A's wait, unchanged) and `:442-444` (replaced).

**Diff:**
- G is 8a58d91bcc859319ccf9095520313c8c856bee27, pushed to `cut/open-first-look-fills-fit-view` (`e374eb71..8a58d91b`).
- Numstat against F is 63 added and 7 removed, which is exactly 70.
- Numstat against H is 50 and 5.
- What the commit does:
  - It replaces the E-AND-b header line, byte-copied from the draft's section 4.
  - It adds `LABEL`, `consoleLabel`, `readConsole` and `watchConsole`.
  - It splits `stepAnd` into a thin wrapper plus `stepAndWatched`. The wrapper's `finally` stops the readings if the step fails.
  - The watch starts after `expectApplied` for card B, and `checked` is set after the `.filter-active` check.
  - The verdict is read with a 30 s `waitFor`.
  - F1 to F4 and the PASS text follow Amendment 5 item 3 (h).
- The mark read has a two-frame wait, so the label is not stale.
- `node --check` exit code was 0.
- I did not add `parseLabel`. The repair is one line, but it puts the file at 71, over the ceiling. It needs 1 line cut elsewhere, and a decision from you on whether a second commit is allowed.

**README (E-AND entry, `README.md:802`):** each clause is true after the edit, as a statement of what the suite asserts.
- Card A's map under 60% of the unfiltered map.
- `.filter-active` reads the exact AND text.
- The map is empty.
- Exactly one `record_step` row reaches `ok` carrying that text.
- With B off, the map is within 2 points of A's.

I edited no README.

**Run table:**

| Tag | Start | End | rc | PASS | FAIL |
|---|---|---|---|---|---|
| a5-command-bar | 2026-11-19T08:03:45Z | 2026-11-19T08:05:47Z | 1 | 13 steps plus FIXTURES | 1 (E-AND) |

Held: `H1 asked 2026-11-19T08:03:34Z` (from `<S>/flc1-h1.asked`).

Byte-copied lines of the run:
- First line: `worktree C:/dev/wt/fl head 8a58d91bcc859319ccf9095520313c8c856bee27 start 2026-11-19T08:03:45Z`
- E-AND: `[E-AND] FAIL (13457ms): parseLabel is not defined`
- Every other step passed: OPEN, E-CTRLK, E-SEARCH, E-HELP, E-BARFOCUS, E-REVEAL, E-SLASH, E-FIELD, E-REFUSE, E-TOOLONG, E-ADV, E-PANEL, E-SEL, FIXTURES.
- Last two lines: `This run launched the app; it stays RUNNING on CDP port 9223.` and `rc=1 end 2026-11-19T08:05:47Z`
- Load line: `load a5-command-bar 08:03:36Z 22,9,1`
- App-down output: `killed tree 58584`, `killed tree 54600`, `port 9223 free`, `port 5400 free`.
- Hold line: `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:71644 also=<m>`
- Release line: `MACHINE_RELEASED project=<m> shell=bash.exe:71644 affinity=FF (cores 0-7)`
- Session log copied to `<S>/flc1-a5-command-bar.session.log`.
- Exe `D:/wt-targets/fl/exes/spatial-ide-shell-fl.exe`: 91534848 bytes, sha256 5a347ec8...0adcc5, as required.
- `sha256sum -c` printed 10 OK.
- Busy check: FREE before the hold and FREE after.

**Not run:** M-A4-1, M-A4-3, M-X2 and the vitest run under M-X2. So the readings' behaviour during the load, the F2 risk and the "beside the wait" question are untested.

**Final state:**
- HEAD is G and the porcelain is empty.
- `ls-remote` gives G.
- `df -h`: C: 46G free, D: 362G free.
- Last busy check: FREE.
- No background shell of mine is still running. The harness app-down killed the app and vite.
- The tool notice that the file changed on disk was my own edit.

**Off-scope noticed:** the Edit tool wrote the em dash literally where I typed `\u2014`, so `command-bar.mjs` is no longer pure ASCII. This is harmless, since Node reads UTF-8.

**Model:** Sonnet 5.5 (claude-sonnet-5-5), no override. I received the custodian's ADV-2026-11-19-10 item 2 line mid-task; it did not apply to this commit.

**Files:**
- `C:/dev/wt/fl/frontends/shell/e2e/command-bar.mjs`
- Run log: `<S>/fl-e2e-h/out/fl-e2e-a5-command-bar.log`
