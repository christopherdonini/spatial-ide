Series: open-first-look-fills-fit-view S9 base check at 9a4c58332661b6fd69fb477b1184f0147f38df2b (frontend without the piece), S9 debug exe, tester, resumed (the custodian's filing note, 2026-11-19: the same Sonnet tester, model claude-sonnet-5-5, resumed, its run 2026-11-19T03:01:11Z to 03:07:05Z by its transcript, Bash 11, none errored; 4905 bytes, sha256 bc3468cc172024cdb0f95675361d8926eac4cb89fc3695e5ec69c76ecd62b1ad; below byte for byte but for the project value of the hold lines as <m> (6), a local file time as dated <t> (1), with this note and one final newline)

Model: Sonnet 5.5 (claude-sonnet-5-5), no override, no handoff.

RESULT: at the base (no piece), both suites PASS with 0 FAIL. command-bar's E-AND and project's STYLE both pass. The load on the second run was high (93,94,77). The brief says a shared-run timing failure is not a failure, but nothing failed, so this is only a context note.

**Void first run (one line).** Tag `base-command-bar`, 02:57:04Z to 02:58:41Z, rc=1, PASS 0 / FAIL 0. The app never mounted: `src/generated/NOTICE.txt` was missing, so "mount-readiness gate ... not present within 90000ms". I stopped and did not run project. Session log: `<S>/flb-base-command-bar.session.log`.

**Start state.** HEAD 9a4c58332661b6fd69fb477b1184f0147f38df2b, porcelain empty. Exe 91534848 bytes, sha256 5a347ec8...cadcc2 (matches the brief). The harness sha check showed nine OK. `df -h`: C: 47G available, D: 355G available. The setup hold (npm ci, bundle-viewer build, npm ci) had rc=0.

**Build hold (h3).**
- Asked 2026-11-19T03:01:17Z.
- Lines:
  - `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:3588 also=<m> (commands started from now on inherit it; release when done)`
  - `MACHINE_RELEASED project=<m> shell=bash.exe:3588 affinity=FF (cores 0-7)`
- `npm run build` in `frontends/shell`: rc=0, "built in 9.34s".
- Afterward `ls -la`: `src/generated/NOTICE.txt` is 3506979 bytes, dated <t>.
- The porcelain was empty.
- The hold line does not carry a granted time. I did not record one.

**Run 1: tag `base2-command-bar`, `e2e/command-bar.mjs`.**
- Busy check immediately before: FREE.
- Asked 03:02:52Z. Hold lines: `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:66644 also=<m> (...)` and `MACHINE_RELEASED project=<m> shell=bash.exe:66644 affinity=FF (cores 0-7)`. There was no WAITING line, so the hold was granted at once. The load line was stamped 03:02:54Z, so the grant was between 03:02:52Z and 03:02:54Z.
- Suite start 03:03:04Z, end 03:04:38Z, rc=0.
- Load line: `load base2-command-bar 03:02:54Z 43,19,44`.
- FAIL 0. By line count, 14 progress lines `[X] PASS` and 29 lines containing "PASS" (progress lines plus the summary table).
- E-AND, byte-copied from the summary table and cut at 160 characters, shown with ellipsis:
  `E-AND         PASS    A 4.4% non-bg (unfiltered 16.5%); A and B on: 0.00%, Applied the exact AND text, one more record_step row reached ok; B off: 4.4%, Applied A's text`
- App-down lines:
  - `killed tree 81860`
  - `killed tree 75456`
  - `port 9223 free`
  - `port 5400 free`
- Session log copy: `<S>/flb-base2-command-bar.session.log`.

**Run 2: tag `base2-project`, `e2e/project.mjs`.**
- Busy check before: FREE.
- Asked 03:05:36Z. Hold lines: `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:21308 also=<m> (...)` and `MACHINE_RELEASED project=<m> shell=bash.exe:21308 affinity=FF (cores 0-7)`. There was no WAITING line. The load line was stamped 03:05:41Z, so the grant was between 03:05:36Z and 03:05:41Z.
- Suite start 03:05:55Z, end 03:06:33Z, rc=0.
- Load line: `load base2-project 03:05:41Z 93,94,77`.
- PASS 12 (progress lines), FAIL 0.
- STYLE, byte-copied:
  `[STYLE] PASS (3400ms): opacity 0.37 and colour #112233 committed; their record_step rows reached ok`
  Also `[READBACK-STYLE] PASS (0ms): the file's style holds the fill colour #112233 and the applied opacity 0.37`
- App-down lines:
  - `killed tree 49764`
  - `killed tree 41888`
  - `port 9223 free`
  - `port 5400 free`
- Session log copy: `<S>/flb-base2-project.session.log`.
- Run outputs for both runs are in `<S>/flb-e2e-h/out/flb-e2e-base2-*`. `<S>` is the scratchpad directory, the harness's `flb-e2e-h/out` is inside it, and the audit logs are `<S>/flb-base2-*.audit.jsonl`.

**End state.** The final busy check printed FREE. HEAD is 9a4c58332661b6fd69fb477b1184f0147f38df2b and the porcelain is empty. No background process of mine is still running. The suites' own "stays RUNNING" text was wrong, as before: app-down killed the trees.

**Done beyond the brief.** Only the shell-wait loop on `.rc` files and the `<H>/out` mkdir already reported.

**Failure classes.**
- Interface: the real S9 exe with a vite stand-in for `tauri dev`.
- Result claims: all point to the files named above.
- Operator lines: these describe the run at this commit.
- Assertions: E-AND and STYLE each reached their assertion and passed.

**Reading for the gate.** At the base, with no first-look diff, E-AND and STYLE pass once each, under load of 43,19,44 and 93,94,77. At the first look's head they failed twice each, at low load. This is one pass each, not a series, so it points to the piece or to its frontend diff, but it does not prove it.
