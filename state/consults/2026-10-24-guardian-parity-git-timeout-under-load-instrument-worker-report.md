*Custodian's filing note (2026-10-24): the instrument of `guardian-parity-git-timeout-under-load` (its form's §2 items 1 to 3, T35 to T38, the three recorded mutations), built by a worker on `cut/guardian-parity-git-timeout-under-load` from main e5e6e03a: 6d76bcdb and 7235aa0c; writes only to `scripts/hooks/guardian-continuity-parity.test.mjs` and its own scratch files; both commits' messages hold no address but the trailer's. The run 09:48:41Z to 10:00:16Z by its transcript (Read 6, Bash 23). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 44b61accbb886ad580ac53d13b25cda0f19af2dc2f8f6de75b9cc29ba922927c.*

---

Built: guardian-parity-git-timeout-under-load's instrument at 6d76bcdb1027b93fb7d68b12ea11f919ad49c674 (branch head after the mutation-comment commit: 7235aa0ce559893cf402d6ad304df6ed24a0f198)

Commits (both pushed in separate calls; origin's branch == HEAD 7235aa0c; porcelain empty):
1. 6d76bcdb "test(hooks): guardian-parity-git-timeout-under-load, the instrument (form section 2, items 1 to 3)"
2. 7235aa0c "test(hooks): guardian-parity-git-timeout-under-load, the three recorded mutations (form section 4)"
Both message files carry "@" only on the Co-Authored-By trailer (grep shown for #2 and #1); the Signed-off-by line came from `git -s`.

Change vs section 2 items 1-3 (only scripts/hooks/guardian-continuity-parity.test.mjs):
- Item 1: the mod runner times and records {side,args,ms,exitCode,timedOut}, still throws on r.error, and takes optional program and prefix (T37 is the caller).
- Item 2: before() swaps childProcess.execFileSync for an observer plus syncBuiltinESMExports(); after() restores it. It records only while `observed` is an array (set only inside stopOutcome). Only T38 sets `substitute`, which swaps the `log` call's program for a sleeping child; the product's options are untouched.
- Item 3: timeoutFinding(id, calls) returns null or the form's message. The T35 subtest asserts it is null and that the Stop side recorded a `log` call. T36 counts only reads with no finding. Each fixture emits a `<id> git ms:` diagnostic line.
- Interfaces read first: stop-queue.mjs:44 (named import), :77-83 tryGit, :228-244 judgeContinuity, :293 decide; continuity.mjs:30-65.
- I1 did not fire: syncBuiltinESMExports() rebinds the import on Node v24.18.1, and the non-vacuity assertion holds. STOP_RUN_OPTS.timeout is unchanged at 2000.
- Finding for the record: a root before() hook ran at registration, before module eval finished. The first draft took the original execFileSync after the hook and recursed (RangeError). The original is now captured right after the imports, before any hook.

Tests: the file passes 17 of 17 (T35's 13 subtests, T36, T37, T38; fail 0). T37 took 2270 ms and T38 took 2340 ms, so I5 is not met. P4 holds on this machine (non-vacuity passes unmutated, fails under mutation 3).

Mutations, each applied alone at 6d76bcdb, run with the file, reverted; porcelain empty after each:
1. The runner's `timedOut` set to `false` failed only T37: "guardian parity: a mod-side git call that outruns the runner's timeout is recorded as a timeout, not read as an outcome".
2. The observer catch's `timedOut` set to `false` failed only T38: "guardian parity: a Stop-hook git call that outruns its timeout is recorded as a timeout, not read as an outcome".
3. Deleting the `syncBuiltinESMExports();` call in before() failed PS1, PS2, PS3, PS4a, PS4b, PS5, PS6, PS7, PS8, PS9, PS10, PS18 and PS19, plus the T35 parent test and T38. P5 holds.
No verify-mutation tool was used. Commit 2 adds a RECORDED MUTATION comment for each, naming 6d76bcdb.

Three unloaded runs (not the series, recorded as no measurement). Per-call ms, ordered mod:0..2 then stop:0..2 for log, show, parent show; all 17 passed in each run:
- Maximum single call: 59 ms (run 2, PS8 mod:1). Most calls were 22 to 40 ms. No timeout in any run.
- Exit 128 appeared only on PS4a (both sides, log), PS7 (parent show on both sides) and PS19 (parent show on both sides); each occurs in all three runs and is expected for those fixtures.
- The 39 lines are in the scratch folder as gpt-u1.txt, gpt-u2.txt and gpt-u3.txt.

Section 7 figure: `git diff --numstat e5e6e03a...HEAD` gives 103 insertions and 10 deletions, 113 changed lines, against the 130 budget. One file.

Checks at head 7235aa0c (exit code, last line):
- `node --test scripts/hooks/guardian-continuity-parity.test.mjs`: 0, "ℹ fail 0" (17 of 17).
- Scripts suite inside a shared hold: 0, "tests 555, pass 555, fail 0". No `not judged` fixture failure, so no second run was needed.
- verify-cites: 0, "PASS — every rooted (in-tree) path:line reference across 2322 file(s) resolves."
- verify-quotes: 0, "PASS — 131 checked, 100 verified, 30 baselined ...".
- verify-test-claims: 0, "PASS — all 656 claimed test(s) across 198 file(s) exist or are planned ...".
- verify: 0, "verify:plan PASS".

Caller grep: the optional program and prefix parameters of modOutcome have T37 as their product caller (`modOutcome(buildFixture('PS7'), [], calls, process.execPath, SLEEP_PREFIX)`). `substitute` is set only by T38. No export was added and there is no dependency change. Invalidators I1 to I5 were not met.

Pre-gate self-check:
- Cross-module code uses the interface the other side exposes: the observer wraps `execFileSync` and the mod runner keeps the resolve/reject contract. T35's non-vacuity and T38 are the end-to-end proofs, and mutation 3 shows they bite.
- Every completion claim points to evidence in the transcript.
- No user-facing message was added beyond the timeoutFinding text, which describes behaviour implemented here.
- T37 and T38 reach their assertions: each fails by name under its mutation.

Hold: `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF` and `MACHINE_RELEASED project=SpatialIDE` (-Minutes 15, -MaxWaitMinutes 8).

Process check: the suite ran in a shared hold, which was released. No process I started is still running. `tasklist` shows 2 node processes. I did not start them, and I killed nothing.

Off-scope noticed, not done: nothing.

Model: Sonnet 5.5 (claude-sonnet-5-5), no override. I received no context handoff and produced none.

Git state: HEAD 7235aa0c equals origin's branch, and `git status --porcelain` is empty.
