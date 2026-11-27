*The build worker's report for the node command-bar-enter-after-an-applied-result (the five-line form `governance/forms/frontends/COMMAND-BAR-ENTER-AFTER-AN-APPLIED-RESULT-PREREGISTRATION.md`), in C:/dev/wt/henter from 36b788ba6940b0427bcc7ab37704a719be9a5ea7, commits de315ebdfbdeb94e98df9d8af98fef35284e4507 and ac75eb64222fb654113e660c6e0a75f66a318b9d, PR 362 (draft), filed by the custodian below the rule from its hand-back in its transcript, 5825 bytes, sha256 5bd7367bccb5e4f5098315782210bd5fd6fbcbd87d9f784d8b1d9988261e898d, byte for byte but for the hold lines' shell values: 10 places are written <m>; with one final newline added. Its run: Read 5, Bash 31, Edit 2, SubagentHandback 1, by unique call ids, 2 calls errored, model claude-sonnet-5-5, from 2026-11-23T12:18:52Z to 2026-11-23T12:32:06Z by its transcript; it read two files in the main checkout (its agent definition and the architect's read the form names) and wrote nothing there; no compaction.*

---

node:command-bar-enter-after-an-applied-result@worker-1: DONE, pushed, no PR opened. Brief sha256 and size matched (8426 bytes).

**Worktree and commits**
- Worktree: <S>-free path C:/dev/wt/henter, branch cut/command-bar-enter-after-applied, based on origin/main 36b788ba6940b0427bcc7ab37704a719be9a5ea7.
- Test commit: de315ebdfbdeb94e98df9d8af98fef35284e4507.
- Fix commit (head): ac75eb64222fb654113e660c6e0a75f66a318b9d.
- `git status --porcelain` is empty after the commits.

**Red run** (CommandBar.tsx unchanged, `npx vitest run src/App.command.test.tsx`; byte for byte from the log, blank lines dropped)
```
     × RC-ENTER-AFTER-APPLIED: an Enter after an applied result and before its render leaves the bar empty and shows no busy line 65ms
AssertionError: empty, no note, one filter apply asked for: expected [ …(3) ] to deeply equal [ '', …(2) ]
- Expected
+ Received
  [
-   "",
-   "(no element matches .command-note)",
+   "/filter \"zone\" = 'residential'",
+   "[P6 placeholder] A filter change is still being applied.",
    1,
  ]
      Tests  1 failed | 24 passed (25)
```
The draft is back and the note is the busy line, the two faults the form names. One apply was asked for.

**Green**
- New test alone: `Tests  1 passed | 24 skipped (25)`.
- Whole file: `Tests  25 passed (25)`, `Test Files  1 passed (1)`.

**M1** (the line `if (latestDraft.current !== pos.draft) return;` removed from onKeyDown, new test alone, exit 1)
```
 × RC-ENTER-AFTER-APPLIED: an Enter after an applied result and before its render leaves the bar empty and shows no busy line 242ms
AssertionError: empty, no note, one filter apply asked for: expected [ …(3) ] to deeply equal [ '', …(2) ]
-   "",
-   "(no element matches .command-note)",
+   "/filter \"zone\" = 'residential'",
+   "[P6 placeholder] A filter change is still being applied.",
    1,
```
Restored from D:/wt-data/henter/m1-keep.tsx. `cmp` against the saved copy printed CMP-SAVED-SAME. `cmp` of the committed head blob against the saved copy printed CMP-HEAD-SAME.

**`npm run verify`** in frontends/shell: exit 0.

**Count** (`git diff --numstat origin/main...HEAD`): 29 0 App.command.test.tsx; 6 0 CommandBar.tsx. Total 35 against the budget of 80, over the form's 2 files only.

**What the change is**
- CommandBar.tsx has a `latestDraft` ref. It is written in `take(text)`, `complete`, the applied branch of `sendCondition` and `onChange`.
- `onKeyDown` returns at once, after the chord check, when `latestDraft.current !== pos.draft`. It sets no position and no note and sends nothing.
- No string changed. One comment line was added, with no cites.
- The `setPos(step.pos)` write in `onKeyDown` does not write the ref: that path returns to `complete` whenever the draft would differ.

**Did otherwise than the brief says, or found**
1. Fresh worktree: vitest first failed to resolve `../generated/NOTICE.txt?raw`, with no tests run. `npm run prebuild` (viewer build, then generate:notice) fixed it, run in a hold. The generated files are ignored, so nothing untracked.
2. Test mechanics. jsdom leaves `window.event` as the last `focusin` event. React 18 then treats the bar's post-promise updates as discrete, and renders them in a microtask, which closes the window. The test therefore does these things:
   - It saves `window.event`'s own descriptor, defines it as undefined for the window, and restores it in `finally`. A browser has no current event in a continuation after an IPC wait.
   - It sets `IS_REACT_ACT_ENVIRONMENT` false for that window and restores it.
   - It releases the held request, drains 50 `await Promise.resolve()` ticks (microtasks only, no timer), and asserts the bar still shows the applied text. That is the window precondition.
   - It dispatches the second Enter directly, then does `inAct(() => {})` and checks the bar's value, the note and the request count. It also checks that the card is on.
   No sleep, retry, timeout or fake timer is used. Before the `window.event` override the precondition assertion failed (the bar was already empty), which is how I found the jsdom quirk.
3. The test has no "RECORDED MUTATION / OBSERVED AT" comment, to stay small. M1 is in this report.
4. The commits carry the Signed-off-by line git adds with `-s`, in the committer's configured identity. I typed none, and the trailer I typed is the only other line.
5. Pre-gate self-check: no cross-module seam is touched. Every completion claim above is backed by a log in D:/wt-data/henter. No user-facing string changed. The new test reaches its assertion, since the red run fails on the final assertion, not on setup.
6. Model observed: Sonnet 5.5 (claude-sonnet-5-5). No model override. No context handoff received or produced.

**Hold and release lines** (each `also=<m>`; no `others=` seen; project and what values masked as `<m>`)
- Install run: `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=<m> also=<m>`, then `MACHINE_RELEASED project=<m> shell=<m> affinity=FF (cores 0-7)`.
- The other shared holds, all granted and released (exit 0 from the script): the failed first vitest run (shell <m>), prebuild and red (<m>), probes (<m> and a second one), red re-run (<m>), green runs (<m>), M1 (<m>), verify (<m>).
- The release line of each is in the same form: `MACHINE_RELEASED project=<m> shell=<m> affinity=FF (cores 0-7)`.
- No exit code 96 to 99 and no WAIT_TIMEOUT.

**Off-scope noticed, not done:** none beyond item 2's jsdom `window.event` quirk, which other tests could trip over if they ever need an update outside an event.

Files: C:/dev/wt/henter/frontends/shell/src/command/CommandBar.tsx, C:/dev/wt/henter/frontends/shell/src/App.command.test.tsx. Logs: D:/wt-data/henter (red.log, green1.log, green2.log, m1.log, verify.log, verify.rc).
