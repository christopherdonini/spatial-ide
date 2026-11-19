Series: open-first-look-fills-fit-view S9 base check at 9a4c58332661b6fd69fb477b1184f0147f38df2b (frontend without the piece), S9 debug exe, tester (the custodian's filing note, 2026-11-19: the Sonnet tester, model claude-sonnet-5-5, its run 2026-11-19T02:54:05Z to 03:00:20Z by its transcript, Read 1, Bash 14, Monitor 1, one call errored; 5648 bytes, sha256 5e855b0121ee9415b735f2e823a199fb2b529217813a4c4c07e84bfe31da1d4a; below byte for byte but for the project value of the hold lines as <m> (6), the scratch folder as <S> (1), a local clock time as at <t> (1), with this note and one final newline)

Model: I observe myself as Sonnet 5.5 (claude-sonnet-5-5). No override and no context handoff.

RESULT: VOID, and I stopped. The base worktree could not mount the app, so neither the E-AND nor the STYLE question is answered. I ran command-bar once and did not run project.

**Cause.** `frontends/shell/src/generated/NOTICE.txt` does not exist in `C:/dev/wt/sel`.
- `src/notices/NoticesPanel.tsx:20` imports it as `../generated/NOTICE.txt?raw`.
- `.gitignore:14` ignores the whole `frontends/shell/src/generated/` folder.
- `ls src/generated` in the worktree: "No such file or directory". The main checkout has the file.
- The brief's setup (`npm ci`, `npm run build`, `npm ci`) does not create it. Something else generates it, and I did not find what.
- Vite logged "Failed to resolve import ../generated/NOTICE.txt?raw" at <t>, in the vite err log copied to `<S>/flb-e2e-h/out/flb-e2e-base-command-bar.vite.err.log`.
- The app then logged "Failed to fetch dynamically imported module: http://localhost:5180/src/bootstrap.tsx". The suite waited 90 s for `.app-header` and `window.__SPATIAL_E2E__.openPath` and gave up.
- I found nothing that indicates the cause is the piece or the S9 exe.

I did not generate the file. It is ignored, but making it is a step the brief does not name. It would also be a new setup step for you to decide on.

**Start state.**
- Worktree `C:/dev/wt/sel` HEAD is 9a4c58332661b6fd69fb477b1184f0147f38df2b with an empty porcelain.
- The exe is 91534848 bytes, sha256 5a347ec80c9fee3a964487bfd11e774adca1c6c9d9e3fad4149c909d0a2adcc5.
- `df -h`: C: 47G available (91% used), D: 355G available.
- `sha256sum -c flb-harness.sha256` gave nine OK, rc=0, when run from inside `<H>`. My first try ran from `<S>` and failed with "No such file"; that was my directory error. I also made `<H>/out` with `mkdir -p`; the brief allows it.

**Setup hold (h1).**
- Asked: file `<S>/flb-h1.asked`. I stamped it but did not print it; the other times below were printed. The hold line's "since" time is 02:54:08.946Z.
- Lines:
  - `MACHINE_WAITING shared: turn of <m> held by pid 69540 since 2026-11-19T02:54:08.946Z`
  - `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:73324 also=<m> (commands started from now on inherit it; release when done)`
  - `MACHINE_RELEASED project=<m> shell=bash.exe:73324 affinity=FF (cores 0-7)`
- Setup rc=0. The porcelain was empty afterward, and HEAD was unchanged.
- The pre-run busy check printed FREE.

**Run: tag `base-command-bar`, script `e2e/command-bar.mjs`.**
- Hold h2 asked at 2026-11-19T02:55:53Z.
- Hold lines:
  - `MACHINE_WAITING shared: turn of <m> held by pid 10468 since 2026-11-19T02:55:43.938Z`
  - `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:47000 also=<m> (commands started from now on inherit it; release when done)`
  - `MACHINE_RELEASED project=<m> shell=bash.exe:47000 affinity=FF (cores 0-7)`
- Granted: I did not record the time. The load line is stamped 02:56:54Z, so the grant was before that.
- Suite start 2026-11-19T02:57:04Z, end 2026-11-19T02:58:41Z. The wrapper's rc is 1, and the log's own line is `rc=1 end 2026-11-19T02:58:41Z`.
- Load line: `load base-command-bar 02:56:54Z 27,33,38`.
- PASS 0, FAIL 0. The suite printed no PASS or FAIL lines.
- The only failure line, byte-copied:
  `command-bar: harness failure: Error: mount-readiness gate: .app-header and window.__SPATIAL_E2E__.openPath not present within 90000ms`
- E-AND's own line: none, because the suite never reached any test. The results JSON has `"results": []`.
- App-down lines:
  - `killed tree 21220`
  - `killed tree 64996`
  - `port 9223 free`
  - `port 5400 free`
- Session log copy: `<S>/flb-base-command-bar.session.log`.
- The suite's own text "it stays RUNNING on CDP port 9223" was wrong. The app-down script killed both process trees, and the later busy check read FREE.
- Run outputs are in `<S>/flb-e2e-h/out/flb-e2e-base-command-bar.*`.

**Run: tag `base-project`.** Not run. The brief has no stop rule for this, but I judged that it would fail identically on the same missing file and tell you nothing. I did not ask for a re-run. The next step is yours.

**End state.**
- The last busy check printed FREE, rc=0, and no `spatial-ide-shell` process is in the task list.
- `C:/dev/wt/sel` HEAD is 9a4c58332661b6fd69fb477b1184f0147f38df2b and the porcelain is empty.
- No background process of mine is still running.

**Done beyond the brief.**
- The `<H>/out` mkdir above.
- A read-only look at `src/generated`, the `.gitignore` check and a `tasklist` check.
- I used a shell wait loop on a `.rc` file in `<S>` to wait for the background hold, because no Monitor tool was available.

**Four failure classes for this harness.**
- Interface: it drives the product's real exe and dev server over CDP, but the exe is the S9 debug build with a vite stand-in for `tauri dev`. That is as the brief set it.
- Result claims: every claim points to a file named above.
- Operator-facing lines: they describe this commit's run, which is void.
- Assertion: no measurement test reached its assertion.

**To make the check answer the question.** The base worktree needs `src/generated/NOTICE.txt` produced by whatever step makes it in the main checkout. That is a decision for you. The head runs had the file, which fits their getting past mount.
