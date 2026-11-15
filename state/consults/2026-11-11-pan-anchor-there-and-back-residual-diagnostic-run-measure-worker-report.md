*Custodian's filing note (2026-11-11): the worker's report on run measure for slot 2's `pan-anchor-there-and-back-residual-diagnostic`, the measure-build run of the form's Amendment 1, at main 00bcb07d, from its brief, given by file (13719 bytes, sha256 c7ffa98ed04649fae40f7dfecc4de4ebee84171f6223d55059bb3dff708bc2e2). Dispatched at 19:02:36Z by its transcript; the hand-back at 19:32:12Z (claude-sonnet-5-5; unique calls: Read 10, Bash 41, Edit 11, Write 3, the hand-back, 66 in all; 6 errored: five Edits refused on its scratch copy of the suite before that copy was read, then made, and one listing that exited 2). The custodian dispatched no other subagent in that window, by the transcripts' first records. The report below was extracted by script from the hand-back in that transcript (8941 bytes, sha256 4741f7b2a8d39ba7a7c0172468dbdad527b3c5882f2568722a3530892a11b8fc). **One span is changed:** its third line named the scratch folder by its full user-profile path, and the filed text has `<S>` there; nothing else is changed, and one final newline is added. The custodian checked by script: each of the 15 scratch files it gives with a sha256, and the exe's, equal on disk (all kept outside the repository); the worker's writes, all in its scratch folder under the names its brief allows; its two holds, both shared and both released; no git command that commits, pushes or moves a branch; the worktree at 00bcb07d with the porcelain empty. The reading is the worker's, from one run: a reading for the human's grade, not a docs/08 measurement, with no route and no grade, and not Authority. Amendment 1 (f)'s single reviewer was dispatched at 19:37:17Z and recomputes its fields; it goes to the human with the main-thread consult, the dev-build records and the platform stall report.*

---

Observed: pan-anchor-there-and-back-residual-diagnostic, run measure at 00bcb07db100c56e672afe99dbe3fe27f2638010

Scratch folder S = <S>. Every `dg-measure*` file below is there. All sha256 values are of files as they stand.

**Where.** After fetch, the worktree C:/dev/wt/dg HEAD was 00bcb07d (B) and its porcelain was empty. `diff --name-only B c1aea32a -- frontends/` and `B origin/main -- frontends/` both printed nothing, so no path to name and the build stayed at B. `frontends/shell/node_modules`, `renderer/bundle-viewer/node_modules` and `renderer/bundle-viewer/dist` all exist. C: had 19G free and D: 194G. `D:/wt-targets/dg-measure` did not exist beforehand.

**Build.** rc 0. Log line 447: `Finished \`release\` profile [optimized] target(s) in 23m 14s`. The last lines end `Built application at: D:\wt-targets\dg-measure\release\spatial-ide-shell.exe`.
- build log: 15479 B, sha256 33e31c96a2ecbe070971ea6964dd3128d6fb512940b19308802988bb9d44b290
- exe: 72112640 B, sha256 384ed094bdf5b4a1c5908f0a119c56f89dc17b1d378a401ac2932b90cb86d78c, mtime 2026-11-11 20:27:08 +0100 (= 19:27:08Z), after the build's start
- porcelain empty after the build; the hold was released before the patch step

**Patch.**
- `dg-instrument.patch` was 12221 B with sha256 a3e44da8…999f7a, equal to the brief's value; I read it whole and applied it with `git apply`.
- On top of it, in `frontends/shell/e2e/pan-anchor.mjs` only:
  - `setup()` launches through `attachOrLaunchExe` with the exe path from `DG_MEASURE_EXE`, and throws if the variable is unset.
  - `main` runs the fit-line wait: 20 × 250 ms, setCam's own bound.
  - `main` then runs the drags by (b)'s formula, with L = min(300, floor(cw/2) − EDGE_MARGIN_PX) and T = min(131072, 2^(23−z_fit)).
  - The closing clock check is its own `page.evaluate`, raced against a 15 s bound, run before `dgCollect`.
  - The seam wrapper records `seamAbsent: "e2eSetViewState"`.
- `git diff` is `dg-measure.patch`: 14943 B, sha256 284833375b70b2f31fa91ea8ddafb28cf43e0de3087fa21a44b391152ceb5910. `node --check` passed, and `git diff --name-only` named only pan-anchor.mjs. I showed the patch from line 150 on, which holds all my edits; the instrument part is the earlier patch.
- Re-applied for the run, and `git diff | sha256sum` equalled the patch's.
- Choices Amendment 1 left me:
  - The edits were prepared in a scratch copy and copied over the instrument-patched file, so the result equals "apply, then edit".
  - Each drag records its own view-state lines (`drag-vs`) instead of dumping `vs` whole, to keep the file linear.
  - The closing clock got a bound, so a frozen page cannot block the collection.
  - Every drag starts from the canvas centre, including leg 2.
  - A readBox read gives the centre and cw (the only read beyond (b)'s).
  - The unused resize and case code stays defined and is never called.
- No setCam, seam call, `capturePixels` or resize ran. Reverted after the run (see state below).

**Quiet and port.** The process list before the hold had 7 processes, all `node.exe`. None was cargo, rustc, cl, clang-cl, link, msbuild or `spatial-ide-shell`, and none had a command line or path rooted in this repository or its worktrees. `netstat | grep ':9223 '` before the run returned rc 1 and 0 bytes. I did not touch 5180 or 5400, and I started no dev server.
- The after check shows one line: `TCP 127.0.0.1:9223 127.0.0.1:12437 TIME_WAIT 0`. That is a closed connection, not a listener.
- All four process lists are byte-identical, 1173 B each, sha256 e9e32de3f48b4004df8926d5e8fe843ecf87e5019a15aed544eb32124f138b34. The lists hold other users' tools' paths, so I do not byte-copy them here; each is in S as `dg-measure.procs-{before,suite-start,suite-end,after}.txt`. The suite-start list was taken before the app launched and the suite-end list after the session stop.
- No `spatial-ide-shell` process was left, so I killed none.

**Run.**
- Stamps file (98 B, sha256 0151ed3274888297e6df133d1c538698c05a15ddedff610f659563eba447c2d3), byte-copied:
  - `script-start 2026-11-11T19:28:03Z`
  - `suite-start 2026-11-11T19:28:05Z`
  - `suite-end 2026-11-11T19:30:25Z`
- Fixture sha256, before and after (unchanged): `fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49 *C:/dev/spatial-ide/target/fixtures/manual-walkthrough/100k-happy-path.parquet`.
- Suite log (2929 B, sha256 be469c07d2f67c5656d1faf42599af52e541ccfec28d66ff5cef37c2bf3b52de):
  - first line: `plan: zFit -3.692532927362801 L 300 d 3781.7171365684776 T 131072 n1 37 drags 75`
  - 75 drag lines, `drag 1/75 leg 1 dx 300 vs 1..42` through `drag 75/75 leg 3 dx 300 vs 3035..3076`; all 75 are in the transcript's `cat` of the log
  - last two lines: `==== 0/0 PASS ====` and `rc=0`
- Exit code 0. The hold lines (`also=` elided):
  - build: `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:73740 …` then `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:73740 affinity=FF (cores 0-7)`
  - run: the same lines with `shell=bash.exe:69576`
- Files copied after the run:

| File | Size (B) | sha256 |
|---|---|---|
| `dg-measure.app.log` | 277 | 558ec4bb191f0b4cc25bbf73136eac6297666931d40799162c8d49ec536f5044 |
| `dg-measure.session.log` | 138878 | 83b211af3df90cabc69b0b1610244b21ec588ce2a1204b82a3d3ad4e4c93ec37 |
| `dg-measure.node.jsonl` | 1317645 | e0b33d006d7f48cdccaf654d424600d93291d9a3cd494c5ea7f18a6e74eef9e5 |
| `dg-measure.page.json` | 475654 | 8672fffc0656e3a7355df74d23770e599a6b61e0a425fea67507da0037f8626e |
| `dg-measure-run.sh` | 1339 | 45b5b51a1d6d3dd93fb486ef0852208d19a83e3b98241463f562548620c85e47 |

- The app log holds three lines, ending `measure-build: CDP remote-debugging port 9223 opened`; the session log is the app's own, `session-1794425287.log`. No `dg-measure.audit.jsonl` was written.

**Reading.** Script `S/dg-read-measure.mjs`, sha256 3bb71d4252fba505ff2e3976a03e767ac5585c1a7f656e0f10696b9195f294a7. Output `S/dg-measure.read.txt`, 11917 B, sha256 b94e0326dc6659fbc4a131a64fabccb64d205b1ecc8c124d910d96a98618e71d, shown whole in the transcript. It names no route and no grade. The fields:
- All 75 drags recorded, each `{settled:true}`, none unsettled. Counts rose by 41 per drag. Drag times run from 5050 to 138197 ms after the init event.
- **Crossings by (b)'s (i) and (ii): 5, at drags 35, 36, 37, 38 and 39.** (ii) is true for all 5. Drift at drag 35's last line is 132133.8 against T 131072. The origin moves by exactly the previous target at each. A sixth line, the origin at drag 39's end, stays unchanged to drag 40.
- Page collection ok: 2639 ticks, 3075 emissions. 3075 receipts and 3075 pushes, none unmatched. 0 pageerrors, 0 console errors, 0 listener errors.
- **Kept gaps: 0** (array length 0, 0 `[dg-stall]` lines received). So there are 0 gaps at or over 1000 ms, 0 flagged windows, and 0 view-state intervals overlapping a gap (3075 checked).
- Clock checks: after-install and closing, half-width 1.5 ms each, offset in [−2, 1] ms.
- Seam: `seamAbsent` = `e2eSetViewState`, `seamWrapped` false, and the surface is present. Process-list outcome as above.
- Off-script, from the `drag-vs` records. I did not run it as part of the reading script, and I draw no conclusion:
  - At each of the five crossings, the next drag's first line has origin moved by the previous last line's target, while the traced target did not rebase (e.g. target −132133.84 before and after).
  - So `target + origin` (x) moves from 2471326.27 (drag 35 last) to 2339192.43 (drag 36 first).
  - `target + origin` (x) is 2603460.11 at the fit view and 1924431.79 at drag 75's last line.
  - By contrast, the target alone returns near 0 at drag 74 (478.37).
  - I ran no tolerance check and compare with no formula; the human grades.

**Gate-relevant.**
- The 124/timeout, fit-line and leg-1 branches were not hit: the fit line existed, the box was read, and leg 1 crossed.
- Nothing was committed, pushed, retried or fixed. I made no ruling or route.
- Nothing outside S, the worktree's ignored outputs, `D:/wt-targets/dg-measure` and the app's own per-user log folder was written.
- State left: C:/dev/wt/dg at B with `git status --porcelain` empty after the revert, local branch and `D:/wt-targets/dg-measure` as they are.
- No background shell or process of mine is still running; I killed none because none remained. A few foreground wait loops ended on their own.

**Self-check.** The cross-module seam is the real `attachOrLaunchExe` (lib.mjs) and the real `view-state` line shape. Completion claims point to the transcript calls above. No user-facing message was added. The required assertions were reached, not only set up: the collection returned ok and the closing clock was taken. Model as the harness reports it: Sonnet 5.5 (claude-sonnet-5-5). No override and no context handoff. No token figures at hand.
