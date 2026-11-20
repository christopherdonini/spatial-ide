Reviewed: branch cut/b2-piece-1c-p4b at 0c74eeab7e0c100a5a193e5109e272025ca43bb6 (the custodian's filing note, 2026-11-20: the architect's gate of P4b, before its PR; Read 22, Grep 14, Glob 2, SubagentHandback 1, one errored (a Read of the 1c form refused as over the size limit), model claude-opus-5-5, from 2026-11-20T18:48:50Z to 2026-11-20T18:56:52Z by its transcript; the report below byte for byte from its hand-back of 12514 bytes, sha256 04dec20f4c7f214e4be8dd7abddaafdc975501e5aea5baedab1e9dd3ce7de6e3, nothing masked by the custodian, with this note in its first line, with one final newline), gate, architect, attempt 1
Gate: b2-piece-1c-save-and-reopen P4b, architect, at 0c74eeab7e0c100a5a193e5109e272025ca43bb6 (cut/b2-piece-1c-p4b; base 4d34eaae5b25ac40d76eae1a4af323de1455911c)

Verdict: PASS WITH NOTES

Under §22: **Correctness** closed. **Evidence** closed. **Documentation:** four must-fix findings (D1 to D4), to be fixed before the merge. Three of them go to the advisor. None blocks.

I read the four files in C:/dev/wt/1c-p4b at H, and the `src-tauri` and `kernel` files in the main checkout. I have no Bash, so I ran no git diff, no numstat and no hash. Where I depend on a numstat, it is the worker's (p4b3-1: 266 in and 0 out, over four files), and the reviewer recomputes it.

**1. The launch** (ADV-2026-11-20-18 items 1 and 2; `attachSecondApp`, `frontends/shell/e2e/lib.mjs:314-362 @ 0c74eeab`)
- **(a) Holds.**
  - Before the spawn, lines 328-329 refuse by name when 127.0.0.1 does not answer, and when [::1] already answers.
  - The check is that something answers on 127.0.0.1, not that A does. It is A, because second-open.mjs:147 refuses any A it did not launch itself.
- **(b) Holds, and it is what (b) asks.**
  - The browser id at the end of `webSocketDebuggerUrl` is a member of what `/json/version` returns. Each browser instance makes its own id, so one browser answering on both endpoints gives one id there. The `Browser` member is the runtime's product string, and it is the same for any two WebView2 browsers on one runtime (step 0 and step 1 both saw Edg/157.0.4341.60). So comparing the id is the comparison that tells two browsers from one.
  - B answering on [::1] is waited for at line 341. A member that is missing reads as the same "undefined" for both, so the check refuses rather than passes.
- **(c) Holds.**
  - Every launcher refusal throws a "launcher failure" error from second-open.mjs:149. That is before the E-SECOND block, so it surfaces as `second-open: FAIL attachSecondApp: launcher failure …` with rc 1, never a row, a skip or a pass.
  - See N1 for the paths after the checks.
- **(d)** See question 5.
- **Item 2 holds.** B is started once, at line 149, while A is up, and it stays up through both rows. In E-CRASH-UNLOCK it is up before A's kill (lines 175-177). Killing A's tree does not reach B: the suite's node process spawned B detached, so B is not in A's tree. Step 1 (c) and the series show B surviving the kill.

**2. E-SECOND** (item 6; item 8 (c))
- **The poll matches the form.**
  - `TRIES` is 40 and `TRY_MS` is 250 (lines 40-41).
  - Every refused try, the first try included, must show `skp.project_open_elsewhere`, S9's other-window constant read from `reopenNotices.ts`, and the run ended (`tryOpen`, lines 83-91).
  - The first `admitted` returns (line 99).
  - The tries and milliseconds are printed with "evidence, not a measurement" (lines 165 and 178). That is consistent with docs/08.
- P4b adds no product code, so the product still does not poll (item 6, first point).
- **The failure line at the bound** (`releaseLineIn`, lines 107-117) against ADV-2026-11-20-21 item 1:
  - (b): it gives the path and the byte count. At zero it says the log is empty and that it cannot tell from it whether the line was written. When it has bytes, it says "in" or "not in those bytes", so "not in" is said only of bytes it read. A log that cannot be read is named as such.
  - (c): `readFileSync(APP_LOG).subarray(fromByte)` cuts the bytes, then `toString("utf8")` decodes them.
  - `fromByte` is the size before the launch, which is correct because `attachOrLaunch` opens the log for append (`lib.mjs:192`).
  - The match string is a substring of the line at `frontends/shell/src-tauri/src/commands.rs:145`, as it is at the base.
  - See N2 for one case in the zero-byte wording.

**3. E-CRASH-UNLOCK and item 10's two P4b seams**
- **The kill reaches the crash release.**
  - `a.stop()` is `stopSession`: a CDP disconnect, then `taskkill /T /F` on the tree of `npx tauri dev`. `/F` calls TerminateProcess, so A runs no Drop and no exit path.
  - The lock is the `File::try_lock` lock in `ProjectLock`. By its doc, the operating system frees it when the process ends, a crash included. So B's `admitted` after the kill can come only from the OS release, and that is Amendment 36 item 8's crash case reached from the real shape.
  - B was refused on the first try after the kill and admitted on try 2, at about 400 ms in every run. That fits the OS freeing the lock a moment after the process ends. It is evidence, not a claim.
- **E-SECOND reaches `Projects::release_ended` in the shipped `close_dataset`.**
  - The thread spawn at `commands.rs:144` is not behind a `cfg`, so the debug exe runs the same release code as the shipped build.
  - A's switch goes through `open_dataset` and then `close_dataset`. `open_dataset` does not call `release_ended`.
  - The mutation that makes the spawn fail turned the row red at the bound, so the pass depends on that thread.
  - B's refusal on its first try is itself proof that the two processes share one machine store.
- **The control is real.**
  - Replacing `a.stop()` with `a.browser.close()` keeps A's process and its open, and changes nothing else. Under it B was refused through the bound (mutation log 2). So the pass needs A's process to end.
  - Nothing graceful can stand in for the kill, because `/F` runs no Drop and, under the control, the disconnect alone freed nothing.
  - The kernel's T6 (`kernel/tests/project_lock_crash.rs`) covers the OS release inside the kernel. This row is its end-to-end proof from the real shape. See D4 for what the control should be called.

**4. Scope and seams**
- **Exports.** The one export added is `attachSecondApp`. `cdpVersion` is private. It is the launcher that Amendment 54 item 8 (a) names, a test-harness item and not a product export, so R2 (d) raises nothing.
- **No existing function changed.** In the main checkout, `attachOrLaunchExe` ends at line 303 and `stopSession` starts at line 305. At H the new block fills lines 304 to 362, with `stopSession` at 364. That is one insertion, consistent with the worker's 59 in and 0 out. The reviewer confirms it by git.
- **Paths.** The `package.json` line is the one script line, after `e2e:reopen` (1 in, 0 out). There is no product code and no path under `protocol/`, `kernel/`, `engine/` or `src-tauri/`, by the reports' counts. The reviewer recomputes this.
- **Seams.** Both are written against the real interface. The launcher depends on what the exe actually carries: the overlay port compiled in (`lib.mjs:93`) and the fallback to the IPv6 loopback, which step 0 and step 1 observed. The suite reads S9's constant from its source and drives the hooks P4a shipped.
- **The series.** Item 9's P4b series ran at H. Stop 10's three runs in a row were at 441e2346. 0c74eeab touches only the code path taken at the bound, so they stand. The closing should say they ran at 441e2346 and the series at H.

**5. The words**
- **The README entry against ADV-2026-11-20-18 item 1 (d)** (`frontends/shell/e2e/README.md:906 @ 0c74eeab`). Every clause holds:
  - A is started first.
  - B takes the IPv6 loopback when A holds 127.0.0.1.
  - It needs the IPv6 loopback on.
  - It was observed on this machine and is not called documented.
  - The refusals it lists match lines 328-349.
  - "Cannot be given a debug port of its own" is supported for B as the README defines it, the exe A's launch built, because the port is compiled in.
- **The `attachSecondApp` doc** (`lib.mjs:314-321`). Each clause matches the code except one, D3.
- **What else rests on the empty-log premise.** Besides Amendment 54 item 6 and ADV-2026-11-20-19 item 6, three places do:
  - `frontends/shell/e2e/second-open.mjs:9-11 @ 0c74eeab`, the header, which 0c74eeab did not update. D1, to the advisor.
  - `README.md:904 @ 0c74eeab`, the clause "says whether the release thread's failure line is in `e2e/out/app.log`, or that no log could be read". D1, to the advisor.
  - Amendment 66 item 5, its last sentence, in the form. D2.
- The existing `lib.mjs:184-185` and its "see e2e/out/app.log" messages are covered by ADV-2026-11-20-21 item 1 (f).

**6. The cleanup line**
- **No folder is reused.** `WV2_B` comes from `mkdtempSync` (line 28), so every run gets a new random name. A later run never reuses it, and the leftovers only take disk space under the test data folder.
- **No held B browser is shown.** If a B browser survived on [::1], the next run's condition (a) would refuse by name. The worker's three runs in a row each passed (a) after a run that had printed EPERM, so no B browser kept the port between runs.
- **What I could not resolve.** Node's documented linear back-off for `maxRetries: 10, retryDelay: 500` adds up to 27.5 s. The whole second-open run in the series took 23 s (18:35:36 to 18:35:59). So the retries did not wait out the lock as they are set to, and whether a process still held the folder afterwards was not checked: the tester left the folder in place and could not attribute the `msedgewebview2.exe` processes it saw. One step would settle it: after a run, try to remove the leftover folder, and look for a WebView2 command line naming `spatial-second-wv2b`.
- So it stays a warning (ADV-2026-11-20-21 item 2), and it ties to D1's third clause.

**Findings**

*Blocking:* none.

*Must-fix before the merge (Documentation):*
- **D1, to the advisor, unreworded.** Two untrue clauses, neither the human's wording:
  - `second-open.mjs:9-11 @ 0c74eeab` and `README.md:904 @ 0c74eeab` say that at the bound the step says whether the line is in A's log, or that no log could be read. At H there is a third outcome, "cannot tell, the log is empty", and in every observed run it was the only one.
  - `second-open.mjs:15 @ 0c74eeab` ends "and removes what it made." In every observed run the suite left `WV2_B` (EPERM).
- **D2, record.** Amendment 66 item 5's last sentence carries ADV-2026-11-20-19 item 6's premise. The closing amendment's class 2 row (ADV-2026-11-20-21 item 1 (e)) should name it beside Amendment 54 item 6, by section, amendment and item.
- **D3, wording, not the human's.** The worker applies it with no re-gate, and the PR body lists it. In `lib.mjs:316 @ 0c74eeab`, replace "with a WebView2 data folder of its own (`dataFolder`) and A's environment otherwise," with: "with a WebView2 data folder of its own (`dataFolder`), without `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS`, and A's environment otherwise,". Checked against the code:
  - the data folder is line 333;
  - the deleted variable is line 334;
  - the rest is `process.env`, which is what `attachOrLaunch` passes to A (line 196).
- **D4, record.** In the closing, name E-CRASH-UNLOCK's control as what the code did: `a.browser.close()`, a CDP disconnect, with A's process and its open kept. The `stopSession` comment at `lib.mjs:365-367` says that call disconnects and does not close the browser. Amendment 54 item 8 (c)'s word, a graceful stop, is not what the code did.

*Notes:*
- **N1.** If `connectOverCDP` or `findAppPage` throws inside `attachSecondApp` after the checks (lines 351-352), B's process is not killed, and `b` stays null, so the suite's `finally` cannot stop it. The run still fails, rc 1, and the next run's (a) would refuse by name. So there is no false pass, but there is a process left running, and those two failures are not labelled "launcher failure".
- **N2, to the advisor.** ADV-2026-11-20-21 item 1 (b)'s own words, "the log is empty", are what line 111 prints whenever this run's part of the log is 0 bytes. When earlier runs left bytes in the file, the file is not empty. "This run's part of the log is empty" would be exact. It is the ruling's wording, so the change is the advisor's to make.
- **N3.** Each try's period is 250 ms plus the try's own round trip, and the poll sleeps once more after the 40th refusal. That is why the mutation runs gave 10,683 ms and 11,033 ms. The 10 s is a harness bound, and nothing rests on it (item 6).
- **N4.** After the first try, a refused try reads the refusal block from the DOM, and a block left from the previous try would read the same. The hook's returned code is each try's own evidence.
- **N5.** The header line "RECORDED MUTATIONS: entries are added by the commit that observes them." (`second-open.mjs:17 @ 0c74eeab`) has no entries, although both mutations were run at 441e2346. Their record is the worker's report and the closing. Either the closing names them or the line goes.

Model: Opus 5.5 (claude-opus-5-5), as the harness reports it.
