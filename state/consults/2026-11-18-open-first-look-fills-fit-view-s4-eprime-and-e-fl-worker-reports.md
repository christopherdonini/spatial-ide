# The first look's step S4 at E': the Sonnet worker's two hand-backs (the custodian's filing note, 2026-11-18: model claude-sonnet-5-5, its resumed run 2026-11-18T21:17:03Z to 21:23:49Z by its transcript, Bash 13, Read 1, Write 2, none errored; the first hand-back at 21:19:38Z, 3383 bytes, sha256 3221c0c6bd6a28b72632ac286aa5a57bd3bdc8d96dc4396d544c2a7b8a13d61f, a run not made; the second, after the custodian's word to run once with the busy check in a call of its own, at 21:23:48Z, 5207 bytes, sha256 473323c15925b354bdb42c2e7f47ff99d5b32e0d65df6dfa86af6ff9c27941ce, with the scratch folder written as <S> in 1 place; each below byte for byte under its own heading, with one final newline)

## The first hand-back, 21:19:38Z

Built: open-first-look-fills-fit-view S4, E' committed and pushed; the E-FL re-run did NOT happen (my own wrapper tripped the busy check, exit 90). I stopped and did not re-run.

Result
- E' = 9cea65d9d6519c088bdf0c853234ecd665e9b60b, pushed to origin/cut/open-first-look-fills-fit-view (ff3c1465..9cea65d9). Only frontends/shell/e2e/open-fills-fit-view.mjs changed. `git diff --numstat ff3c1465 9cea65d9` = 20 added, 16 deleted (36, ceiling 40). The file is 255 lines against 251 at E (ceiling 380). package.json is not edited. `node --check` printed CHECK-OK. Porcelain is empty and the worktree stays at E'.
- What changed in the script: the precondition no longer needs describe.extent. It now takes the fixture file's sha256 against fd0c74ab...ddfb49 (VOID on mismatch) and prints it. (d)'s rectangle is the PARCEL constant {2,600,000, 1,200,000, 2,612,680, 1,212,600}, with a comment naming engine/src/fixture.rs:67-68,93,1404-1412 and layout.mjs:419. A cell is blank when no pixel differs from the ring background by more than 8 on any channel, and that rule decides (d) and (e). The alpha reading is printed and decides nothing. The REPORT lines keep item 8's data: each qualifying cell now prints o or i (above the first look's rows or not) plus + or - (holds a marked pixel or not).
- Commit message trailers: `git commit -s` appended its own Signed-off-by line after my two Co-Authored-By and Claude-Session lines, so the message does not end with those two lines exactly. I did not rewrite the pushed commit.

Pre-run checks (both passed)
- The exe sha256 is d8309b1ecc1906d597a07e9a04d1d17ed57da3a07dc88472a6189bbc541148d9.
- `git diff --name-only 349cec82e5ecbfab40db3ae9b6811d471d9ea2de 9cea65d9` printed frontends/shell/e2e/open-fills-fit-view.mjs and frontends/shell/package.json.

The run (not made)
- I wrapped the command as `timeout 1800 bash -c '...'` with `fl-e2e-busy.ps1` run first, a step the brief did not name. The busy script matches any process whose command line contains "spatial-ide-shell". My own timeout wrapper's command line contains the exe path, so it printed `BUSY process 23532 timeout.exe ...` and `BUSY`, then exited 90 (the harness's busy code). It was a false positive: no app, vite or port was holding anything.
- `npm run e2e:open-fills-fit-view` never started. <scratch>/fl1-efl-eprime.log does not exist, so there is no image line, alpha reading, REPORT lines or down.txt.
- Hold and release lines: MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:26572 also=<m> (commands started from now on inherit it; release when done) / MACHINE_RELEASED project=<m> shell=bash.exe:26572 affinity=FF (cores 0-7). Load line: load efl-eprime 21:18:59Z 48,23,22. efl-rc=90 at about 21:19Z.
- Item 8's reading: none, since nothing ran.

Next step (the custodian's call)
Authorise one run, and I will run `npm run e2e:open-fills-fit-view -- --measure-build D:/wt-targets/fl/release/spatial-ide-shell.exe` from frontends/shell inside the shared hold, with no wrapper that puts the exe path in a command line the busy check scans. Say whether I should still run the busy check beforehand as a separate call. I judge this is not a second run, since the first never started, but I stopped on that reading rather than decide it.

Model: Sonnet 5.5 (claude-sonnet-5-5), no override. One context handoff received (the compaction summary).

## The second hand-back, 21:23:48Z

Built: open-first-look-fills-fit-view S4, E-FL run once at E' (item 8). It matches P-E-base: precondition met; (a), (c) and (d) failed; (e) held; exit 1. No second run was made.

Step 1: `fl-e2e-busy.ps1` in a call of its own at 2026-11-18T21:22:04Z printed `FREE` (rc 0).

Pre-run checks (one line):
- The exe is 72475648 bytes, mtime 2026-11-18T19:27:32Z, sha256 d8309b1ecc1906d597a07e9a04d1d17ed57da3a07dc88472a6189bbc541148d9, all unchanged.
- `git diff --name-only 349cec82e5ecbfab40db3ae9b6811d471d9ea2de HEAD` printed only frontends/shell/e2e/open-fills-fit-view.mjs and frontends/shell/package.json.
- The log did not exist before the run.

E': 9cea65d9d6519c088bdf0c853234ecd665e9b60b. Numstat against ff3c1465 is 20 added and 16 deleted, 255 lines. The sign-off trailer is the convention, as you said.

Run: the shared hold (`-What "open-first-look-fills-fit-view S4: E-FL at E'"`), with `timeout 1500` on `npm run e2e:open-fills-fit-view -- --measure-build D:/wt-targets/fl/release/spatial-ide-shell.exe`. The log was written at 21:22:58Z.
- Hold lines: `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:24828 also=<m> (commands started from now on inherit it; release when done)` / `MACHINE_RELEASED project=<m> shell=bash.exe:24828 affinity=FF (cores 0-7)`. Its rc was `efl-rc=1`.
- Load line: none. The load sampler ran only in the aborted attempt (load efl-eprime 21:18:59Z 48,23,22), not in this run.
- down.txt: none. The script stops its own session, and a `fl-e2e-busy.ps1` after the run printed FREE.
- Log: <S>/fl1-efl-eprime.log, 2327 bytes, sha256 0f81f7d81d4a865e5096aba07d9c97d8da37429374368d9416648f190b839c47.

Everything the run printed, byte-copied:
```

> spatial-ide-shell@0.1.0 e2e:open-fills-fit-view
> node e2e/open-fills-fit-view.mjs --measure-build D:/wt-targets/fl/release/spatial-ide-shell.exe

precondition: first stream-issued sh_402947994159c836380bfa65bb8f477c, its batch rows 10000 (need 10000), fit view-state seen, describe.extent basis not-established-at-open, value null
  fixture sha256 fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49; fit view-state {"targetX":0,"targetY":0,"zoom":-3.692532927362801,"originX":2603460.114163697,"originY":1200019.902370003}
PASS  (b) settle: no viewport_query, stream-issued or batch line for 3 s within 180 s  ::  quiet after 2846 ms of waiting; 8 wire lines in all
FAIL  (a) a further stream-issued line arrives after the first look's last batch, with no input  ::  first look sh_402947994159c836380bfa65bb8f477c, last batch at line 28; 0 further stream-issued line(s), 0 viewport_query line(s) after it
FAIL  (c) .residency-status reads the complete-in-view sentence  ::  .residency-status is null; pattern /^Showing all \d+ features in view$/
  image: C:\dev\wt\fl\frontends\shell\e2e\out\open-fills-fit-view-efl-1795036971856.png 34623 bytes sha256 102996b14908f10ff21f6afb7bbb1ec30dfacfdd7997510285c082331159f3f2
FAIL  (d) every qualifying cell of the 8x8 grid holds a pixel unlike the ring background (tolerance 8)  ::  28 qualifying cell(s) of 64; 14 blank: (1,0) (2,0) (3,0) (4,0) (5,0) (6,0) (7,0) (1,1) (2,1) (3,1) (4,1) (5,1) (6,1) (7,1); screenshot has a pixel below alpha 255: false
  (e) 14 blank qualifying cell(s) lie wholly above the first look's rows (N > 1201280): (1,0) (2,0) (3,0) (4,0) (5,0) (6,0) (7,0) (1,1) (2,1) (3,1) (4,1) (5,1) (6,1) (7,1)
  REPORT  alpha reading (decides nothing; ring B 255,255,255): qualifying cells with no pixel above alpha 0: none
  REPORT  qualifying cells: (1,0)o- (2,0)o- (3,0)o- (4,0)o- (5,0)o- (6,0)o- (7,0)o- (1,1)o- (2,1)o- (3,1)o- (4,1)o- (5,1)o- (6,1)o- (7,1)o- (1,2)i+ (2,2)i+ (3,2)i+ (4,2)i+ (5,2)i+ (6,2)i+ (7,2)i+ (1,3)i+ (2,3)i+ (3,3)i+ (4,3)i+ (5,3)i+ (6,3)i+ (7,3)i+

==== 1/4 PASS ====
FAILED: (a) a further stream-issued line arrives after the first look's last batch, with no input; (c) .residency-status reads the complete-in-view sentence; (d) every qualifying cell of the 8x8 grid holds a pixel unlike the ring background (tolerance 8)
```

Prediction read:
- The precondition is met, with the fixture sha256 equal to fd0c74ab....
- (a), (c) and (d) failed.
- (e) held: 14 blank qualifying cells lie wholly above the first look's rows.
- Exit 1. There is no exit 2 and no I3.

Item 8's reading:
- The 14 `o-` cells, (1..7,0) and (1..7,1), are wholly above the first look's rows and hold no marked pixel. They are the (d) failures.
- The 14 `i+` cells, (1..7,2) and (1..7,3), are not wholly above the first look's rows and each holds a marked pixel.
- So no qualifying cell that is not wholly above the first look's rows reads blank. Nothing goes to the advisor on that count.
- The alpha reading: ring B 255,255,255, no cell without alpha above 0, and no pixel below alpha 255. The screenshot is opaque, as Amendment 2 item 4 says.

State: HEAD = 9cea65d9d6519c088bdf0c853234ecd665e9b60b, pushed, porcelain empty. Nothing of S5 was done. The image (ignored output) is at C:\dev\wt\fl\frontends\shell\e2e\out\open-fills-fit-view-efl-1795036971856.png.

Model: Sonnet 5.5 (claude-sonnet-5-5), no override.
