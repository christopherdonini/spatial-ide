# Colour-by-refill: the tester's report of the E-RK1 series 2, after the suite fix

*Filed by the custodian: node:colour-by-refill-keeps-the-view@e2e-tester-2, the tester on `cut/colour-by-refill-keeps-the-view` (PR 365, draft) at c60660bd, under ADV-2026-11-24-01 and the form's Amendment 8. Dispatched at 2026-11-24T01:50:05Z; its run: Bash 36, Read 2, Edit 2, Grep 1, SubagentHandback 1, by unique call ids, 1 calls errored; model claude-sonnet-5-5, from 2026-11-24T01:50:06Z to 2026-11-24T02:12:43Z by its transcript; 1 call named the main checkout (1 Bash call reading committed files of main at 718be654 by git show, which reads no working tree, which change nothing); handed back at 2026-11-24T02:12:43Z. The report below from its hand-back, 6723 bytes, sha256 54ff47ea47a6cfd8ccc98086ae97d2077be25b1a647b645ec82e65813feb005f, byte for byte but for 4 values of the hold's lines, written as <m>, <u> and <t> by the custodian, with one final newline added. The reviewer's narrow read (`state/consults/gates/2026-11-24-colour-by-refill-keeps-the-view-fix-narrow-read-reviewer.md`, its D-F2) finds two text points in it, carried here and not edited into the bytes: in the table's row for run 2w, the end time is 02:06:48Z by the series' times file; and in the sentence on run 0, the log that names its own scratch store is its suite log, not its session log. Evidence for the closing amendment, not a gate.*

---

**Done.** Model: Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff. All five runs ended as the form predicts. I fixed, edited and committed nothing apart from the two temporary changes, both restored. No stop condition fired.

`<S>` = the scratchpad folder; `<O>` = `<S>/cbr-e2e-2`. All logs are under `<O>`.

**Setup**
- Worktree: branch `cut/colour-by-refill-keeps-the-view`. HEAD was `c60660bd196d73086c603aac7605d493784167b8`. The subject starts `fix: colour-refill reads the session log from the app's own log folder...`. `status --porcelain` printed nothing.
- Ports: 5180 and 9223 were not listening (grep rc=1). They were also free before every later run.
- Disk: C: had 43935 MB free (floor 40960), D: 191453 MB.
- Fixture: 328242802 bytes, sha256 `2ce715fd1a9e797099bcbe252b462069a523f390fd7561a99de813818830af84`. Matches.
- `<O>` was empty when created.
- I read the ruling ADV-2026-11-24-01. I did not read the form's amendments.

**Build and pre-builds** (all exit 0)
- Head `npm run build`:
  - UTC 01:50:27 to 01:51:06.
  - Last log line: `✓ built in 6.83s`.
- P0 pre-build (`prebuild-p0.log`):
  - UTC 01:51:17 to 01:54:28.
  - Last line: `Finished dev profile [unoptimized + debuginfo] target(s) in 3m 06s`.
- Head pre-build (`prebuild-head.log`):
  - Hold granted after a file stamp of 02:00:18; the call ended at 02:02:07.
  - Last line: `Finished dev profile ... in 1m 41s`.

**P0 checkout and suite file**
- `rev-parse` printed 8329a53c250cf9beea3634554b4babf9ecc176a7 and status was clean.
- After writing the fix commit's suite file over it, `diff --stat` printed `frontends/shell/e2e/colour-refill.mjs | 36 ++++++++++++++++++++++++-----------` and `1 file changed, 25 insertions(+), 11 deletions(-)`. Status listed only ` M frontends/shell/e2e/colour-refill.mjs`.
- Restore: status was empty. Checkout of the branch then gave HEAD `c60660bd...` and status empty.

**Runs** (copied folders are `<O>/<n>-refill-out/`, each with the session log)

| Run | Commit and change in place | Exit | UTC start to end | Planned box | Resident count |
|---|---|---|---|---|---|
| `0` (warm-up, not counted) | P0 `8329a53c`, suite from fix commit | 1 | 01:54:41 to 01:58:16 | refit view | 14071 |
| `1` (counted) | P0 `8329a53c`, suite from fix commit | 1 | 01:58:29 to 02:00:08 | refit view | 14071 |
| `2w` (warm-up, not counted) | head `c60660bd` | 0 | 02:02:16 to 06:48 | equals pre-view box | 300000 |
| `2` (counted) | head `c60660bd` | 0 | 02:06:57 to 02:09:49 | equals pre-view box | 300000 |
| `3` (counted) | head `c60660bd` plus M-A1 | 1 | 02:10:17 to 02:12:07 | refit view | 14071 |

- Run `2w` ended at 02:06:48.
- Runs `0` and `1` match the form's prediction: exit 1 at assert (a), planned box is the refit view. Run `1` did not end VOID, did not fail another assert, and did not exit 0.
- Run `2` ended exit 0, 3/3.
- Run `3` ended exit 1 at (a) only, 2/3 PASS.

**Values common to all five runs**
- Zoom-out notches: 5.
- Feature count restated: 300000. The not-held status stands: true.
- Fit box: `{xmin:2599736.3419350097,ymin:1198567.6607502818,xmax:2602462.3310699314,ymax:1201473.2060557671}` at `{"w":668,"h":712}`.
- Pre-view box: `{xmin:2555624.147464014,ymin:1169191.5327260531,xmax:2624041.7742155655,ymax:1242115.7097426765}` at `{"w":668,"h":712}`.
- A pixel's world span: 102.42159693346004. The pre-view differs from the fit by 44112.19447099557.
- In runs `0`, `1` and `3` the planned box equals the fit box at `{"w":668,"h":712}`. In runs `2w` and `2` it equals the pre-view box at the same client size.

**Assert lines, byte for byte, runs `1` and `3`** (runs `0` and `1` match each other, as do `2w` and `2`)
```
FAIL  (a) the planned box after the Colour by equals the view shown before it, within a pixel's world span  ::  largest edge difference 44112.19447099557 against a pixel's world span 102.42159693346004
PASS  (b) the resident feature count after the plan exceeds the first look's 10000  ::  resident 14071
PASS  (c) the not-held status still stands  ::  the .attributes-not-held element is mounted
```
Run `1` ended `==== 2/3 PASS ====` then `FAILED: (a) ...`. Run `3` ended identically.

**Assert lines, runs `2w` and `2`**
```
PASS  (a) the planned box after the Colour by equals the view shown before it, within a pixel's world span  ::  largest edge difference 0 against a pixel's world span 102.42159693346004
PASS  (b) the resident feature count after the plan exceeds the first look's 10000  ::  resident 300000
PASS  (c) the not-held status still stands  ::  the .attributes-not-held element is mounted
```
Both ended `==== 3/3 PASS ====`.

**Session logs read** (all under `<u>/AppData/Local/dev.spatialide.shell/logs/`)
- Run `0`: `session-1795485404.log`
- Run `1`: `session-1795485522.log`
- Run `2w`: `session-1795485854.log`
- Run `2`: `session-1795486030.log`
- Run `3`: `session-1795486230.log`

Run `0`'s log has the same 14071 and fails at (a) as run `1`; the log also names its own scratch store. The P0 warm-up reached its first look, so the stop for a VOID warm-up did not apply.

**Earlier VOID runs, for ruling item 3.** All three end:
`VOID  waited 120000ms for the open's first look to plan; the last reading was 0 -- not a PASS (checks recorded before it: 0)`
- Run `0` at P0 `8329a53c`: `<S>/cbr-e2e/0-refill.log`
- Run `0b` at P0 `8329a53c`: `<S>/cbr-e2e/0b-refill.log`
- Run `d1` at `2095a7ac`: `<S>/cbr-diag/d1-refill.log`

I took the commits from the brief, not from the logs.

**M-A1**
- `diff --stat` was `frontends/shell/src/App.tsx | 2 +-` and `1 file changed, 1 insertion(+), 1 deletion(-)`. The edit was at line 2147.
- Restore: `cmp` printed nothing (rc 0). `status --porcelain` printed nothing. HEAD is `c60660bd...`.

**Hold and release lines**
- Every hold and release had the same shape, with the hold granted at once and no `others=`: `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=<m> also=<m> (commands started from now on inherit it; release when done)`, then `MACHINE_RELEASED project=<m> shell=<m> affinity=FF (cores 0-7)`.
- The `also=` value was `<m>` in all eight holds.
- No MACHINE_WAITING, MACHINE_ERROR or exit codes 96 to 99 appeared.

**Timing-sensitive:** nothing. No attach-line failure occurred, and every run finished well inside its limits (longest 4m35s).

**Not done:** I did not read the form's amendments, so I have not compared the runs against any wording there. Judgment on the piece is left to the custodian.

**Files:** `<O>/times.txt`, `<O>/{0,1,2w,2,3}-refill.log`, `<O>/{0,1,2w,2,3}-refill-out/`, `<O>/build-head.log`, `<O>/prebuild-p0.log`, `<O>/prebuild-head.log`, `<O>/App.tsx.orig`.

Model: Sonnet 5.5 (claude-sonnet-5-5).
