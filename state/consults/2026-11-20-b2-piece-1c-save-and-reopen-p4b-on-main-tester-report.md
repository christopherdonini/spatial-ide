*Filed by the custodian: the tester's hand-back (claude-sonnet-5-5) for E-SECOND on main at PR 342's merge commit, 4608 bytes, sha256 4f8e1b1bd7a5217299e142828f4bd9d883c561c394742311b5039d01ec922f3a, below the rule, with three clock times written as <t> (the NOTICE's date, the log's and the app log copy's mtimes) and nothing else changed. Calls Bash 7, Grep 1, Read 1, SubagentHandback 1, none errored, by unique call ids, from 2026-11-20T20:05:49Z to 2026-11-20T20:09:37Z by its transcript. Its log, read by the custodian: two PASS rows and no FAIL; the log's file time is 2026-11-20T20:08:46Z; the app log copy 0 bytes. The record is its transcript.*

---

Run: b2-piece-1c-save-and-reopen P4b on main at b7926b92e619ed7031ac76d4a9acc2cf9d6df8e6, tester, port 5180, second-open
Result: second-open ran once and ended rc=0. E-SECOND PASS and E-CRASH-UNLOCK PASS on main at M (2 PASS, 0 FAIL).

Start state
- HEAD printed M. The porcelain was empty. `git ls-remote origin refs/heads/main` printed M.
- The `ls` of the two node_modules folders returned ls_rc=0.
- NOTICE.txt exists, 3506979 bytes, dated <t>.
- `df -h`: C: 45G free (91% used), D: 370G free. Both are above the stop floors.
- Port check before the run (`netstat -ano`, grep for 5180 and 9223, grep rc 1): no line at all for either port, so no listener.

Run
- Command: `timeout 1500 npm run e2e:second-open` from `frontends/shell`, under the hold.
- I did not take a start time. The log file's mtime is <t> (the run's end). The app.log copy has mtime <t>.
- rc=0 (the `rc=0` line is from the call's own output). I did not re-run, and ran no mutation.
- Log: `<S>/p4bm-second-open.log`.
- App log: `<S>/p4bm-second-open.app.log`. The copy succeeded with rc 0 and is 0 bytes.
- Session log: the run named none, so there is no session-log copy.

Byte-copied lines. The log has 12 lines, shown here in order with blank lines left out.
- Line 1 is the blank line before the `npm run` banner. The first non-blank line is:
  `> spatial-ide-shell@0.1.0 e2e:second-open`
- Step and row result lines:
  - `[E-SECOND] PASS: B's first try was refused as skp.project_open_elsewhere with S9's other-window place; after A opened another file B's reopen was admitted on try 1 (108ms; evidence, not a measurement)`
  - `[E-CRASH-UNLOCK] A reopened P on try 1 (81ms); killing A's process tree`
  - `[E-CRASH-UNLOCK] PASS: B's reopen of P was admitted on try 2 (461ms; evidence, not a measurement) after A's process tree was killed`
- Last two lines:
  - `[E-CRASH-UNLOCK] PASS: B's reopen of P was admitted on try 2 (461ms; evidence, not a measurement) after A's process tree was killed`
  - `second-open: could not remove D:\wt-data\1c-p4b\spatial-second-wv2b-gIzp4o: EPERM, Permission denied: \\?\D:\wt-data\1c-p4b\spatial-second-wv2b-gIzp4o '\\?\D:\wt-data\1c-p4b\spatial-second-wv2b-gIzp4o'`
- B tries, as evidence and not a measurement:
  - E-SECOND: B was admitted on try 1, 108 ms, after A opened another file.
  - E-CRASH-UNLOCK: A's reopen took try 1, 81 ms. B was then admitted on try 2, 461 ms, after A's process tree was killed.
- The suite's own cleanup could not remove B's WebView2 data folder `spatial-second-wv2b-gIzp4o` (EPERM). This is the leftover the suite's header already names. The folder is still in `D:/wt-data/1c-p4b`. The `<S>`-form paths in the log are the suite's own scratch folders under that data folder.

Failures: none.

Hold
- Asked once with `-What "b2-piece-1c P4b on main: second-open e2e" -Minutes 20 -MaxWaitMinutes 120`.
- Granted on the first call, with no wait. The line read `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:<m> also=<m> (commands started from now on inherit it; release when done)`.
- Ended: `MACHINE_RELEASED project=<m> shell=bash.exe:<m> affinity=FF (cores 0-7)`.
- No 97, 96, 98 or 99 code.

End state
- HEAD is M and the porcelain is empty.
- Lock-file diff (`git diff --quiet HEAD -- <three lockfiles>`): lock_rc=0.
- `df -h`: C: 45G free, D: 370G free.
- Port check after the run (`<S>/p4bm-net-post.txt`): the only lines for 5180 and 9223 are TIME_WAIT, on 127.0.0.1 and `[::1]`. No LISTENING entry on either port.

Processes at the end
- The suite killed A's tree itself and closed B, so I started nothing that is still running.
- A tasklist shows msedgewebview2.exe and node.exe processes. I did not start these and did not touch them.

Four failure classes for this harness
- Interface: the suite uses the product's own launch and the DEV hook `e2eOpenProjectFolder`, whose answer `admitted` is the kernel's `opened`. It is the interface the product exposes.
- Claims point to results: the lines above are byte-copied from `<S>/p4bm-second-open.log`.
- Operator-facing lines: they describe this run at M. The tries and milliseconds are labelled evidence, not measurement.
- Assertions reached: both PASS lines are assertion results printed after the steps ran. This run was not a mutation run.

Not named in the brief: after the run I read `<S>/p4bm-net-pre.txt` only through grep. I also listed D:/wt-data/1c-p4b and ran one tasklist. Nothing was changed.

Model as the harness reports it: Sonnet 5.5 (claude-sonnet-5-5). No model override and no context handoff. No usage figures at hand.
