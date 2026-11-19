*Filed by the custodian: the tester's hand-back (claude-sonnet-5-5), 7349 bytes, sha256 5307694291860465890b7529f3e5ab45610bf42cc8ae77742c1ada01c1920c10, below the rule, byte for byte except this project's name, twice in hold lines, written <m> (ADV-2026-11-18-07), and one final newline added. Calls Read 4, Bash 15, SubagentHandback 1, none errored, from 2026-11-19T08:50:21Z to 08:59:10Z by its transcript. The run is the one ADV-2026-11-19-13 item 1 asked for; a tester in place of the worker is the class 1 departure that item names. The run's log and the app's session log stay in the custodian's scratch folder.*

---

Run: selection-export-unknown-attempt, the suite at the merge base f5584f28 on the app built at 9a4c5833, tester, port-5400 harness
Result: At the merge base, 3 export steps (E-EXPORT, E-ASK, E-ASK-TWO) failed with unknown-attempt in this run, which is what finding 1 asks for. The run was 15 PASS, 3 FAIL, 1 SKIP, rc=1. All other steps passed.

Brief sha256 shown: 85f8f50ddd0fa1abb0af863b4873d0a1f53416660a29eb0b89d037ad68409aa8, matching the brief's own figure.

**Start state**
- HEAD was 9a4c58332661b6fd69fb477b1184f0147f38df2b and the porcelain was empty.
- `git diff --name-only f5584f28 HEAD` printed exactly `frontends/shell/e2e/README.md` and `frontends/shell/e2e/selection.mjs`.
- `df -h`: C: 46G free, D: 362G free.
- The harness check printed ten OK lines: run-suite, load, app-up, app-up-wait, app-down, busy, shim/npx.cmd, shim-wait/npx.cmd, tauri.conf.json, build-exe.
- The exe is 91553792 bytes with sha256 f62fb9feae7279a678b72dd8e7ed88b6820cc982b600627ef83d05cc074608d7, as required.
- The three harness scripts were read whole and no harness file was changed.
- The first busy check printed FREE.

**Step 2**
- Porcelain: ` M frontends/shell/e2e/selection.mjs`, and nothing else.
- `hash-object` printed 67b23f66e176b5500608da9cadc9163676b9cb75, and `rev-parse f5584f28:frontends/shell/e2e/selection.mjs` printed the same value.
- `diff --stat`: `frontends/shell/e2e/selection.mjs | 15 +--------------` and `1 file changed, 1 insertion(+), 14 deletions(-)`.

**The run**
- Tag `selb-base`.
- Start 2026-11-19T08:51:56Z, end 2026-11-19T08:58:05Z, rc=1.
- 15 PASS, 3 FAIL, 1 SKIP (EXPORT-TODAY).
- `--measure` was not passed.
- The load line was `load selb-base 08:51:46Z 33,37,35`.
- The app-down output was `killed tree 2976`, `killed tree 34684`, `port 9223 free`, `port 5400 free`.
- The app's stderr named a session log. I copied it to `<S>/selb-base.session.log` (78469 bytes).

Byte-copied lines from `<H>/out/sel-e2e-selb-base.log` (cut at 120 characters except where noted):
- Line 1: `worktree C:/dev/wt/sel head 9a4c58332661b6fd69fb477b1184f0147f38df2b start 2026-11-19T08:51:56Z`
- The failing steps, whole lines:
  - `[E-EXPORT] FAIL (11917ms): execute returned {"status":"unknown-attempt"}; the TTL did not end the attempt (L 0ms, U 79ms, T 600000ms); prepare-to-execute 0ms`
  - `[E-ASK] FAIL (16184ms): execute returned {"status":"unknown-attempt"}; the TTL did not end the attempt (L 0ms, U 12788ms, T 600000ms); prepare-to-execute 0ms`
  - `[E-ASK-TWO] FAIL (18287ms): execute returned {"status":"unknown-attempt"}; the TTL did not end the attempt (L 0ms, U 14961ms, T 600000ms); prepare-to-execute 0ms`
- Tally line 81: `[selection] 15 PASS, 3 FAIL: E-SCENE=PASS E-CLICK=PASS E-CLICK-FAST=PASS E-SELECT=PASS E-NODRAG=PASS E-ZOOMSEL=PASS E-SEL-PAN=PASS E-SEL-FILTER=PASS E-REFUSED=PASS E-GEN=PASS E-KINDS=PASS E-EXPORT=FAIL E-SCOPE=PASS E-ASK=FAIL E-ASK-STATEMENT=PASS E-ASK-TWO=FAIL E-STATUS-HEIGHT=PASS E-DBLCLICK=PASS`
- Last two lines: line 82, the EXPORT-TODAY SKIP line (same text as in the series at H), then `rc=1 end 2026-11-19T08:58:05Z`.
- The log has 83 lines. Nothing else in it names unknown-attempt (grep count 3, the three lines above).

Step results, base run against the series at H (`<H>/out/sel-e2e-sel-head.log`). The milliseconds are the base run's first, then H's.
- E-SCENE PASS 16804 / PASS 16710
- E-CLICK PASS 529 / PASS 512
- E-CLICK-FAST PASS 884 / PASS 896
- E-SELECT PASS 691 / PASS 691
- E-NODRAG PASS 1353 / PASS 1350
- E-ZOOMSEL PASS 2032 / PASS 2061
- E-SEL-PAN PASS 1120 / PASS 1126
- E-SEL-FILTER PASS 22328 / PASS 22091
- E-REFUSED PASS 9692 / PASS 9391
- E-GEN PASS 14877 / PASS 14724
- E-KINDS PASS 61472 / PASS 60377
- E-EXPORT FAIL 11917 / PASS 14742. This differs.
- E-SCOPE PASS 2966 / PASS 2639
- E-ASK FAIL 16184 / PASS 112906. This differs.
- E-ASK-STATEMENT PASS 116176 / PASS 109355. The prepare-to-execute figure is 0ms here and 5ms at H.
- E-ASK-TWO FAIL 18287 / PASS 245553. This differs.
- E-STATUS-HEIGHT PASS 43884 / PASS 41129
- E-DBLCLICK PASS 17295 / PASS 16575
- EXPORT-TODAY SKIP in both.
- Only the three export steps differ.

**Failures**
- The three failures are the lines above. I put the lines around E-EXPORT here:
  - `[hover-barrier] E-EXPORT (notch 1): … confirmed id 836` (line 64)
  - the E-EXPORT FAIL (line 65)
  - E-SCOPE PASS (line 66)
- Each failure has the same cause: unknown-attempt from the execute. The base run shows `prepare-to-execute 0ms` on each, against 3 to 5 ms at H.
- This answers finding 1. The failure is shown at the merge base with this exe and this machine's load line.
- This is my reading, not a measurement: all three failed in one run, which suggests the window is wide on this run. This was a shared hold with `also=` present, which the load line (33 to 37%) reflects. Whether it depends on timing in this shared run is for the custodian to decide. I did not re-run, as the brief requires.

**The hold**
- Asked at 2026-11-19T08:51:43Z (the stamp in `<S>/selb-h1.asked`).
- Granted at the command's start: the load line is stamped 08:51:46Z, so the grant was immediate.
- Hold output: `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:53596 also=<m> (commands started from now on inherit it; release when done)`.
- Ended with `MACHINE_RELEASED project=<m> shell=bash.exe:53596 affinity=FF (cores 0-7)`, before 08:58:23Z.
- It stood beside another hold of this project (the `also=` value).
- No exit 97, no MACHINE_WAITING and no MACHINE_ERROR lines.
- The hold call's exit code was 1, which is the suite's rc passed through.

**Revert and end state**
- Revert: `git checkout -- frontends/shell/e2e/selection.mjs` gave rc=0, the porcelain was empty, and HEAD was 9a4c58332661b6fd69fb477b1184f0147f38df2b.
- Fixtures: 32 files listed (sizes and sha256) in `<S>/selb-fix-before.txt` and `<S>/selb-fix-after.txt`, and `cmp` gave rc=0 (identical). None were regenerated, none were missing, and the 5 GB fixture was not used.
- End: HEAD = H, the porcelain is empty, C: has 46G free and D: has 362G free.
- The last busy check printed FREE.
- Background shells: the hold shell (b8axb90hu) and my wait loops (bkth17rk3, and a second foreground loop that returned) have all exited. No process I started is still running, and I killed none by PID.

**Four failure classes for this harness**
- Interface: the harness drives the real debug exe, built at H, through its dev-hook (publishExecute) over CDP, which is the same surface the series at H used.
- Result claims: every result claim points to the run's log in `<H>/out` (`sel-e2e-selb-base.log`) or to a scratch file named above.
- Operator-facing lines: the lines above describe this run at this commit (the exe built at H, the suite at B).
- Assertions: every failing step reached its assertion (the `execute returned` text is the assertion's own message).
- Usage figures: none at hand.

**Departures**
- A tester ran this in place of the form's worker, a class 1 departure that the custodian records.
- Model, as the harness reports it: Sonnet 5.5 (claude-sonnet-5-5). No override and no context handoff.

Files:
- `<S>/sel-e2e-h/out/sel-e2e-selb-base.log`
- `<S>/selb-base.session.log`
- `<S>/selb-fix-before.txt`
- `<S>/selb-fix-after.txt`
- `<S>/selb-base.audit.jsonl`
- `<S>/selb-headsteps.txt`
- `<S>/selb-basesteps.txt`
