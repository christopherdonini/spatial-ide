# PR #196 gate 1 — architect, attempt 2
Reviewed: cut/e2e-hover-establishing-read-stale @ ac89e033a75a9ac241debfd9d249e2e84b26f414

## Verdict: PASS

- **Correctness:** pass. It carries forward from gate 1 under `AUTONOMY.md` §22's carry-forward rule. ac89e033 changes comments only (see "The earlier documentation items" below).
- **Evidence:** pass. E1 is resolved.
- **Documentation:** one must-fix item before the merge (D-a). It needs no re-gate.

This is correction round 1 of 2. I have no shell, so I recomputed no sha256. The README's hashes and any pin in the closing amendment are for the reviewer or the custodian to recompute.

## Evidence: E1 is resolved

**The rule.** The human's line is `state/directives/2026-10-06-machine-script-adopted.md:20` (paraphrased): a timing-sensitive failure seen in a shared run is re-run alone by the custodian. Gate 1 offered route (b), one M1 run alone on the same terms. That has been met twice.

**The edit matches the report's description of M1.**
- **The report:** `state/consults/2026-10-09-e2e-hover-establishing-read-stale-worker-report-1.md:66` describes M1 as replacing the helper's `hoverIdAfterBarrier` call with the base's move-then-poll.
- **The script:** `state/drafts/e2e-hover-establishing-read-stale-m1-alone/m1-apply.mjs.txt:5-18` replaces exactly that one line.
  - It refuses if the line is not unique (`:15`) and if the line is not inside `establishAboveThresholdHoverK6` (`:17`).
  - The lines it puts in (`:7-12`) match the base's code lines `frontends/shell/e2e/regression.mjs:1115` and `:1119-1123` on main. Gate 1 established that main's `frontends/shell` is identical to the base.
  - It leaves out only the base's three comment lines (`:1116-1118`), which changes nothing.
- **The diff each window printed:** `window-1-hold-output.txt:18-35` and `window-2-hold-output.txt:8-25`. Each is one hunk inside `establishAboveThresholdHoverK6`, at blob 1117412a..c7735968, and the two are identical.
- **The logs agree that the mutation took, and only in K6:**
  - Both run logs keep A9′'s barrier line (`m1-alone-801-run1.log.txt:11`, `m1-alone-801-run2.log.txt:11`).
  - Neither has a `[hover-barrier] K6/…` line, so K6 no longer went through the barrier.
  - A9′ gives 24517 found clear, which matches the 801 runs the reviewer recorded and is not the 800 result. So the window height was 801.

**The runs were alone.**
- **Window 2:**
  - `window-2-hold-output.txt:1-4`: an exclusive hold, `others=none`, 60 samples averaging 4.0%, with the cool-down met.
  - `:5`: the head is ac89e033 and the worktree clean.
  - `:26-27`: M1 ran from 12:30:35Z to 12:34:40Z, rc 1.
  - `:32`: the file was restored and porcelain is empty.
  - `:33`: the hold was released.
  - Nothing else of this session was running. This run discharges E1 on its own.
- **Window 1** (`window-1-hold-output.txt:1-4`): the same hold conditions, with a 4.9% average.
  - M1 ran from 12:19:02Z to 12:23:16Z (`:36-37`).
  - noticeDeterminism ended before it began (`:7`), and the console suite started after it ended (`:43`), so neither overlapped it.
  - The custodian's `node --test` (about 45 s) overlapped M1's first minute. That run is disclosed, and at about 45 s it is below the directive's heavy threshold (`:13`). Run 1 corroborates; run 2 does not depend on it.

**The result.**
- Both logs fail K6 at K6/re-pick, expecting 50244 and last seeing 47080: `m1-alone-801-run1.log.txt:13`, `m1-alone-801-run2.log.txt:13`.
- The only other failure in each is C2′/C3′ (`:22`).
- The PR row's byte-copied failure text is a prefix of line 13 in both logs, and the row states this correctly.

## Documentation: must fix before the merge (no re-gate)

**D-a.** Two statements in the PR body's E1 row go beyond what the hold output shows.
1. **"each run in its own exclusive hold."** Window 1's single hold also ran noticeDeterminism before M1 and the console suite after it (`window-1-hold-output.txt:6-7`, `:43-44`). The ledger is accurate on this (`state/CUT-STATE.md` entry 2026-10-09T12:35Z, "Window 1 (one exclusive hold…)"). The row is not.
   - **Fix:** say that run 1 shared its hold with those two runs, one after another, and that neither overlapped M1.
2. **"hold granted 12:18:54Z" and "hold granted … at 12:30:32Z".** The `MACHINE_HOLD` lines carry no time (`window-1-hold-output.txt:4`, `window-2-hold-output.txt:4`). Each stamp is the first script line after the grant.
   - **Fix:** write "granted by".

## The earlier documentation items (none needs a note)

- **My D1:** a pointer comment at the helper, `frontends/shell/e2e/regression.mjs:1116` @ ac89e033. Correct.
- **The reviewer's D1:** "can leave" at `regression.mjs:1113-1114` @ ac89e033. Correct.
- **The reviewer's D2:** `frontends/shell/e2e/lib.mjs:637-638` @ ac89e033 no longer claims that the leave pick has run. It now states that the candidate move replaces deck's pending leave request, which is the argument the reviewer asked for. Correct.
- **My D2 and the reviewer's D3** are edits to the PR body, which I cannot read. The custodian confirms both before the merge.
- **§7** at 99 of 140 is consistent with one added comment line on top of gate 1's 98. There is no class 8.

## The closing amendment: what is owed

Recording that the human's line governed over §5's "decide whether" is right, and it is enough on that point. Two references are also owed, as references and hashes only, under the record cap:
1. The directive line, as `state/directives/2026-10-06-machine-script-adopted.md:20 @ <commit on main> sha256:<hex>`, on one line (round 15, items (d) and (e)).
2. M1's admissible observation: the folder's `README.md`, by path, its sha256, and the commit on main that adds it. The README already lists each log's hash.
   - Without this, the comment at `regression.mjs:1274-1275` (observed at f9e1f8dc, in a shared run) stays M1's only recorded observation.
   - Any "E1 resolved" or "done" clause names `m1-alone-801-run2.log.txt:13` and `window-2-hold-output.txt:1-5` as its proof (round 7).

Nothing else is owed. There is no class 8 or class 9, and the form's §5 is not edited in place.

Files:
- `C:/dev/spatial-ide/state/drafts/e2e-hover-establishing-read-stale-m1-alone/` (README.md, m1-apply.mjs.txt, solo.sh.txt, m1-only.sh.txt, window-1-hold-output.txt, window-2-hold-output.txt, m1-alone-801-run1.log.txt, m1-alone-801-run2.log.txt)
- `C:/dev/spatial-ide/state/directives/2026-10-06-machine-script-adopted.md`
- `C:/dev/spatial-ide/state/consults/gates/2026-10-09-e2e-hover-establishing-read-stale-gate1-architect.md`
- `C:/dev/spatial-ide/state/consults/gates/2026-10-09-e2e-hover-establishing-read-stale-gate1-reviewer.md`
- `C:/dev/wt/k6/frontends/shell/e2e/regression.mjs`
- `C:/dev/wt/k6/frontends/shell/e2e/lib.mjs`
- `C:/dev/spatial-ide/state/CUT-STATE.md`
