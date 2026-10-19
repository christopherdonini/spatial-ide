Reviewed: PR #231 at e1fe3a83158a50eb13e4308ac5844ae67a75bc6f (base bc2a987f; gate 1, reviewer)
Branch: cut/source-changed-watcher-visible @ e1fe3a83158a50eb13e4308ac5844ae67a75bc6f
Verdict: PASS WITH NOTES

There are no Correctness or Evidence findings. Four Documentation findings must be fixed in this PR before the merge. None of the sentences below is the human's wording, so the worker applies the replacement words with no re-gate and the PR body lists them (AUTONOMY §31).

## Correctness
None.

What I read in the code at the head:
- **The reparse buffer is right.** `HELPER_CS` writes the mount-point tag 0xA0000003, the data length, SubstituteName offset 0 and its length, PrintName offset len+2 and its length, and the path buffer at 16. CreateFileW uses GENERIC_WRITE, share 7, OPEN_EXISTING and OPEN_REPARSE_POINT|BACKUP_SEMANTICS. The FSCTL code is 0x000900A4.
- **Every repoint failure fails by name.** Each one carries `repointFailed`, and post S4 rethrows it after the ladder (`source-changed.mjs:1141`), so a non-I4 answer is not swallowed.
- **The helper is ended on every exit path:** `finally`, an attach failure, a start failure, and the watchdog (which now awaits the end).
- **Off Windows,** the helper is never started, and `requireWindows` fails S3, post S4 and R4 by name first.
- **R2 follows the ruling** (directive 2026-10-19, item 2): it asserts equality with S2's readout, both null or the same text and className.
- **Suggestion (not a finding):** if Add-Type fails to compile, the stdin script still prints `ready`, and the first repoint then fails on the 10 s answer bound, with stderr in the message. It still fails by name, only later than it could.

## Evidence
None.

Note, not a finding: W-M6 as run (`wv2-mut.mjs`, driver line 396) tells the child the wrong target, but does not remove the answer check, which Amendment 3 item 4 names. With the answer `ok` the check does nothing, so the outcome matches the amendment's design. Its failing lines have the same shape as W-M1's (the realpath half). The answer check's non-`ok` branch was exercised only in the round 2 worker's scratch error test (answer "2"), not in a route run.

## Documentation (must-fix before the merge)

**D1. Open-path claim.**
- **Where:** `frontends/shell/e2e/README.md:240`, `frontends/shell/e2e/source-changed.mjs:261`, and the PR body's round 2 bullet.
- **What is wrong:** each says "so the opened path exists at every instant" (in the driver and the PR body: "the open path"). That states atomicity as fact. The consult marks it "[reading; no Microsoft document states atomicity]" (consult §1(a) R2).
- **Why it does not block:** the only case that could break it is an open landing inside one FSCTL call, which is timing inside a single call. By §31 that does not block; it is named here so that it is recorded.
- **README replacement:** replace `(`FSCTL_SET_REPARSE_POINT`, so the opened path exists at every instant)` with:
  `(`FSCTL_SET_REPARSE_POINT`; the junction's name is never deleted, and no Windows document states that the rewrite is atomic, though no probe stat or open through it failed and no run's check reported that the source could not be re-read)`
- **Driver line 261 replacement:** replace `(`FSCTL_SET_REPARSE_POINT`, so the open path exists at every instant)` with:
  `(`FSCTL_SET_REPARSE_POINT`; the name is never deleted; that an open through it never fails mid-rewrite is a reading no Windows document states)`
- **PR body replacement:** replace ", so the open path exists at every instant" with "; the junction's name is never deleted (no Windows document states the rewrite is atomic; no probe stat or open failed)".
- **Clause check:**
  - "name never deleted": the only unlink is in `makeJunction`, called from `layoutJunction` alone, before the app is attached (`source-changed.mjs:283-293`, `:755`). Every later repoint goes through `repoint`, which sends one FSCTL via the helper (`:328-340`).
  - "no Windows document states": the consult's R2 marking.
  - "no probe stat or open failed": the worker's four probe runs, and my own run below.
  - "no run's check reported…": I re-derived all 19 round 2 runs and found 0 re-read details.

**D2. Stale constant comment.**
- **Where:** `source-changed.mjs:228`, `// X-4: the scratch copy this run opens and mutates. Under `e2e/out`, which is gitignored.`
- **What is wrong:** no route opens or mutates `SCRATCH_COPY` any more. The form's §2.1 says "No route opens it". The line sits outside R24, so §2.5 did not name it.
- **Replacement:** `// X-4: the reference copy, hashed before and after the run; no route opens it (every route opens a copy through the junction). Under `e2e/out`, which is gitignored.`
- **Clause check:** `SCRATCH_COPY` is used only at `:753-754` (copy and hash), `:1281` (R1's derived, never-existing path) and `:1448` (the hash after). `OPEN_PATH` is `join(JUNCTION, COPY_NAME)` at `:181`.

**D3. PR body claims a route S5d does not read.**
- **What is wrong:** "S5d took the post-check in 2 of 8 runs, recorded for S5d's step 2." S5d's own pass note says it does not read which kernel route ended the generation, and §1 says no post-route step claims it.
- **Replacement:** "S5d passed in 2 of 8 runs and failed in 6 on its second condition (a `tile-stream-mint-refused` line since its baseline); recorded, not judged, for S5d's step 2."
- **Clause check:** the round 2 runs record's table; my re-derivation (post1 and post6 PASS; post2-5, 7 and 8 FAIL on S5d only); S5d's conditions at the head (R36 with the one word changed).

**D4. Amendment hashes carry no rev (round 15(e)).**
- **What is wrong:** the form's Amendments 2, 3 and 4 cite file sha256s with no `@ <rev>`.
- **Proof:** I recomputed each at its commit on main, from `git show`:
  - f64ded05… @ 521fc031;
  - 7f7efe57… (consult from line 5) @ 53b52106;
  - dafd175c… @ bc2a987f.
- **Fix:** one appended reference row naming those three revs, under the record cap.

**A named case (§31, non-blocking; record it in N6's row at `MANUAL-WALKTHROUGH.md:949`):**
- **The row says:** "The message is one of two".
- **What can make a third:** a concurrent mint refused after another mint's pre-check has already ended the generation. `require_live` refuses it with `{this dataset's session ended when its source was observed to have changed}` (`kernel/src/skp.rs:1619-1622`). If that refusal reached the shell before both the first refusal and the session-ended event, the latched message would be a third text.
- **Why it does not block:** it needs reply ordering inside one request round trip. It was not seen in any round 2 run: in every one, the session-ended line came first.

## Checks

1. **The whole diff and §8, item by item.** `git diff bc2a987f...e1fe3a83` (709 lines) touches three files; the driver is byte-identical to bf527c1e (`git diff bf527c1e e1fe3a83 -- driver`: empty).
   - Item 1: no product path is in the diff.
   - Item 2: R35 (the S5d comment block) is byte-identical at the head. R36 is identical except touch→change. The pass note is A.1's words.
   - Item 3: the trigger, the 5 ms poll, the ladder and the bounds are unchanged; the repoint is awaited (Amendment 3 item 3).
   - Item 4: no recursive delete, `mklink` or elevation. The spawned PowerShell is Amendment 3 item 2's reading, which I accept.
   - Item 5: copy hashes are equal in all 19 runs.
   - Item 6: R39 and R40 are byte-identical at the head; no walkthrough hunk falls in 1421-1447; the README's dated records are untouched.
   - Item 7: N6 gives two messages, and N8 refers to them.
   - Item 8: no app string changed.
   - Item 9: no mutation text is left at the head (residue scan: 0 for all six strings).
   - Item 10: the runs were made in an exclusive hold.
   - Item 11: N6's three strings are byte-identical to `error.rs:380-385` (continuations joined, `{detail}`→`{mtime}`), `App.tsx:731` (reason filled) and `formatRefusal.ts:108-111` at 71d16a11. No source under `frontends/shell/src`, `engine/src` or `kernel/src` changed between 71d16a11 and the head.
   - Item 12: no dependency was added.
2. **Pins.** All 94 Appendix R pins recompute at 28163cb6 (0 mismatches); a negative self-test with a bad hash gave rc 1. The amendment file hashes match (see D4). The walkthrough's cites read at 71d16a11 show the lines the rows describe.
3. **The round 2 record against its artifacts.** I checked all 19 runs, not only six. My script re-derived rc, the PASS count, the failed ids (from the suite log and the report JSON), W, P, the re-read count, the helper exit line and H3. For H3 it compared the summary's `ctime-ms` with the `at` of the (streamsIssuedBefore+1)-th `stream-issued` entry in the render trace. It then rebuilt each run's byte-copied block. The result: 0 differences, every table row equal and every block byte-equal. H3 is "no earlier" in all 9 post-route runs; for example, post1's ctime 1792431284215.795 is not earlier than its first new stream-issued at 1792431284181.
4. **The mutations.** My own dry script parsed `wv2-mut.mjs`'s table. Each anchor occurs exactly once in the head's driver, at lines 708, 1017, 1366, 1366, 1376, 396 and 1333; these match the `.mut.diff` hunks. Each replacement keeps its line count, lies inside the driver (test code), and every mutated copy passes `node --check`.
5. **The probe.** The helper module's lines 5-120 are `cmp`-identical to driver lines 302-417. I ran it once in the new folder `scratchpad/g231/probe-gate231`, with 20000 rewrites and a 50000 ms bound:
   - 20000 rewrites, with no answer failures;
   - 800 realpath checks, 0 bad;
   - 9537 stats and 9537 opens, 0 failed, 0 bad byte counts, an empty error map;
   - the reader (PID 26660) exited with code 0 on its own;
   - the child (PID 30192) exited with code 0 after its stdin closed;
   - the probe unlinked its own junction.
6. **§7.** `git diff --numstat bc2a987f...e1fe3a83` gives the driver 258+105=363 (ceiling 220), the README 5+13=18 (24) and the walkthrough 19+14=33 (40). This is identical to `71d16a11...bf527c1e`. Amendment 4 item 3 records the overrun as class 8, and §7's ceiling line is unedited.
7. **Suites,** in the detached worktree `C:/dev/wt/gate231` at e1fe3a83, which I have removed (clean before removal):
   - `node --check` on the driver: rc 0.
   - ASCII scan: 0 bytes over 127. The positive self-test on the walkthrough found 3622 such bytes, rc 1.
   - `node --test` (the three CI globs): 483 pass, 0 fail.
   - `verify.mjs`, `verify-cites.mjs`, `verify-quotes.mjs` and `verify-test-claims.mjs`: all PASS. `verify-cites` gives four advisories into `e2e/README.md:786-803`, from older gate reports under `state/consults/gates/` (which are exempt); they appear because this PR shortens the README from 803 to 795 lines.
   - `gh pr checks 231`: all 10 checks pass.

## Commands and exit codes
- `git fetch origin`: 0
- `git diff --stat` / `git log` / `git diff` (the three-dot range): 0 / 0 / 0. The driver diff bf527c1e..e1fe3a83: 0, empty.
- `pins.mjs` on the form: 0. Negative test: 1, as expected.
- `sha256sum` on the three records, from the working tree and from `git show` at their commits: 0 / 0.
- Source drift check 71d16a11..e1fe3a83: 0, empty. Walkthrough cite extraction: 0.
- `git merge-base`: 0. Numstat at the head: 0. Numstat at bf527c1e: 0.
- `rederive.mjs` over 19 runs: 0.
- `mutdry.mjs`: 1, then 1 (both from my own parsing bug, fixed), then 0.
- `cmp` of the helper region: 0. Probe: 0.
- `bos.mjs`: 1 (my regex lost a backslash through the Bash tool; fixed), then 0.
- `git worktree add`: 0.
- `node --check`: 0. ASCII scan: 0. ASCII self-test: 1, as expected.
- `node --test`: 0.
- `verify.mjs`: 0. `verify-cites.mjs`: 0. `verify-quotes.mjs`: 0. `verify-test-claims.mjs`: 0.
- `gh pr checks 231`: 0. `gh pr view 231`: 0.
- `git worktree remove`: 0.

Nothing was heavy, so no hold was taken; the longest command was `node --test`, about 50 s. I made no commit, push or PR action. Everything I wrote is under `scratchpad/g231/`. The probe's processes exited on their own; I killed nothing.

Files:
- C:/dev/wt/wv/frontends/shell/e2e/source-changed.mjs
- C:/dev/wt/wv/frontends/shell/e2e/README.md
- C:/dev/wt/wv/frontends/shell/MANUAL-WALKTHROUGH.md
- C:/dev/spatial-ide/frontends/shell/SOURCE-CHANGED-POST-REOPEN-ROUTES-WATCHER-VISIBLE-PREREGISTRATION.md
- <the custodian's scratchpad>/g231/ (my scripts and outputs: pins.mjs, rederive.mjs, mutdry.mjs, bos.mjs, probe.out, probe-gate231/)
