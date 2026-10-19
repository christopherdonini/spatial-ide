*Custodian's filing note (2026-10-19): the worker-high's round 2 report for `source-changed-post-reopen-routes-watcher-visible` (the form's Amendment 3), in C:/dev/wt/wv from aa30f99f; the head bf527c1e41571053b9bd1072214a58ab80115901, pushed. The run 2026-10-19T16:37:16Z to 16:51:09Z by its transcript (Read 11, Bash 28, Edit 20, Write 7, Grep 1); its one SubagentHandback call, at 16:51:08Z; the probe runs, the ctime test, the suites and the push are each in the transcript; no app launched. Extracted by script; 0 path:line cite(s) de-rooted; one final newline added if absent; nothing else changed.*

---

REPORT: node:source-changed-post-reopen-routes-watcher-visible-at-g4, round 2 (M6 in-place repoint)

DONE. The probe showed no failure (I2 did not recur). One commit is on origin. The driver is over its §7 ceiling (class 8).

**Head and commit**
- Head: bf527c1e41571053b9bd1072214a58ab80115901 (branch cut/source-changed-watcher-visible). Parent is round 1's head aa30f99f0cccc29a3df190e170d76b0eee40c5c6.
- One commit, signed off with `-s`: "test: the source-changed driver repoints the junction in place from one PowerShell child, and R2 compares with S2's readout". The message names the form and Amendment 3 and ends with the two required lines.
- Published as an ordinary update. `git ls-remote` shows bf527c1e on origin, rc=0.
- Exit code of the push: my first push call did not print its exit code. A second `git push` printed "Everything up-to-date" and rc=0.
- The main checkout was only read. Nothing under src/, src-tauri/, protocol/, kernel/ or engine/ changed. No dependency, package.json or lockfile change.

**§7: `git diff --numstat 71d16a1170c6f44ec96b3692b416278df8d00f8c...HEAD`, form not in the diff**

| File | Insertions | Deletions | Total | Ceiling |
|---|---|---|---|---|
| frontends/shell/e2e/source-changed.mjs | 258 | 105 | 363 | 220 |
| frontends/shell/e2e/README.md | 5 | 13 | 18 | 24 |
| frontends/shell/MANUAL-WALKTHROUGH.md | 19 | 14 | 33 | 40 |

- The driver is over by 143, which is class 8 (Amendment 3 item 9). Round 1's head had it at 107+101=208. This round added 174 insertions and 27 deletions across two files.
- The walkthrough was not touched this round.

**The child** (all in source-changed.mjs at bf527c1e)
- **Code:** the C# class is `HELPER_CS` (a String.raw block, lines 321-352). The stdin script is `HELPER_PS`, a three-line array (lines 354-358). The code is `nextHelperLine` 362, `startRepointHelper` 372, `askRepointHelper` 394, `endRepointHelper` 402 and `repoint` 421. The consts above them are at lines 313-319.
- **Spawn:** `powershell.exe -NoProfile -NonInteractive -Command -`, once, after the layout and the copy-hash check and before `attachOrLaunch`.
  - The spawn has a `timeout` of DEADLINE_MS plus 60 s.
  - The C# source and the junction path travel in env vars, so stdin holds only the three script lines.
- **Class:** `JunctionRewrite.Set(link, target)` opens the existing junction directory and sends `FSCTL_SET_REPARSE_POINT` (0x000900A4) with a mount-point `REPARSE_DATA_BUFFER`.
  - The open uses CreateFileW with GENERIC_WRITE, share 7 (full), OPEN_EXISTING, and OPEN_REPARSE_POINT|BACKUP_SEMANTICS (0x02200000).
  - SubstituteName is `\??\<target>` and PrintName is `<target>`.
  - It closes the handle and returns 0 or the Win32 error.
- **Protocol:** the child prints `ready` after Add-Type. The driver waits for it (60 s bound), then sends one target per line and reads one line back (10 s bound): `ok`, or the Win32 error number.
- **Error mapping** (`repoint`):
  - `ok` returns.
  - "5" and "1314" throw the I4 message, now ending "(Win32 <n>) ... (invalidator I4)", flagged `i4`.
  - Anything else throws "<label>: the repoint helper answered <n> for <target>, expected ok (... 4394 is ERROR_REPARSE_TAG_MISMATCH)".
  - No answer, or the child gone, throws "<label>: <what>: no line from the repoint helper within <ms>ms (stderr: ...)".
  - Every one of these carries `repointFailed`.
- **Answer check:** `repoint` checks the answer. `assertRepointed`, unchanged, checks `realpathSync(OPEN_PATH)` against the named target. S3, S4 and R4 call both.
- **Layout:** unlink and create via `makeJunction`, before anything is opened.
- **Ending:** in `finally` ("end of main"), in the attach-failure and start-failure returns, and in the watchdog, which is now async and awaits the end before `process.exit(2)`.
  - The end closes stdin, waits up to 5 s, then calls `process.kill(<its own PID>)`.
  - It prints `source-changed: repoint helper PID <n> exited (code <c>) after its stdin closed|after a kill by its own PID (<why>)`, or "did NOT exit".
- **Comments and README:** the junction comment (lines 259-262), the header fixture note (one added sentence) and the README's source-changed paragraph (A.3 paragraph only) now say how the repoint is made and name Windows PowerShell 5.1 and Add-Type as a runtime requirement.
  - The only "in-process" left is the layout's own `symlinkSync`, which is true.
  - The S4 helper doc comment no longer says "synchronously".
  - The word `mklink` is absent from the driver.
- **R2** (lines 1302-1346): after the reopen and S2's notches, R2 compares its readout with `observation.readoutBefore`: both null, or the same text and the same className. Failure message: "R2: after reproducing S2's N zoom-in notch(es) ... hover ... is <readout>, expected S2's readout from before the change, <expected>". The note prints both.
  - A comment at R2 marks the 2026-09-22 id expectation as superseded by the human's ruling of 2026-10-19, item 2, and cites the directive by path.
  - No dated recorded-mutation comment was edited.

**The probe** (scratch only, never committed)
- Setup: two directories of its own, a and b, each holding one 4096-byte random file (same bytes), and a junction of its own to a.
- The writer imports the helper region byte-copied from the head's driver by a script of mine (`cmp` showed the module identical before and after the commit). Rewrites alternate b, a, b, and every 25th is checked by realpath.
- The reader is a second Node process, started first (it printed "reader started"). It stats, opens and reads the file through the junction in a loop until a stop file appears, and has a 50 s bound.
- Runs, all on the final driver bytes:

| Run | Rewrites | Reader stats = opens | Failed stats / opens / reads | Wrong byte counts | Realpath checks (bad) | Reader exit | Child exit |
|---|---|---|---|---|---|---|---|
| smoke | 20 | 1153 | none | 0 | 0 checks | PID 18872, code 0, on its own | PID 31968, code 0, after stdin closed |
| run 2 | 3000 | 2113 | none | 0 | 120 (0 bad) | PID 44088, code 0, on its own | PID 15752, code 0, after stdin closed |
| run 3 | 20000 | 9409 | none | 0 | 800 (0 bad) | PID 484, code 0, on its own | PID 3920, code 0, after stdin closed |
| head run | 20000 | 9089 | none | 0 | 800 (0 bad) | PID 46128, code 0, on its own | PID 48152, code 0, after stdin closed |

- Every answer was `ok`. The reader's error maps were empty, so there was no ENOENT, no os error 3 and no EBUSY.
- The reader's count is lower than the rewrite count because its loop is slower than the writer's.
- Extra checks, run in my scratch folder:
  - A nonexistent junction gave answer "2" twice. The loop survives an error.
  - A test copy of the module with stdin never closed exercised the PID-kill branch: "exited (code 1) after a kill by its own PID".
  - For Amendment 3 item 5, `ctime` moved on a rewrite (1792428616642 to 1792428618182) and `birthtime` and `mtime` did not.

**W-M6 and W-M7** (test lines only, each text found exactly once at bf527c1e, by script)
- **W-M6** (item 2), driver line 396, inside `askRepointHelper`.
  - Replace: `  h.child.stdin.write(`${target}\n`);` (two leading spaces).
  - With: `  h.child.stdin.write(`${target === TARGET_B ? TARGET_A : TARGET_B}\n`);`
  - Expected: the child gets the other directory and answers `ok`, so the answer check passes. `assertRepointed` then fails the step by name.
  - Post route: `S4-issue-one-query-and-retarget-on-mint` fails with "S4: the opened path resolves to <...>\a\source-changed-scratch.parquet, not inside <...>\b". S5a to S5c and S5d fail after it.
  - Reopen route: `S3-retarget-junction` fails with "S3: the opened path resolves to <...>\a\..., not inside <...>\b", with S4 and the later steps failing after it.
- **W-M7** (item 3), driver line 1333, in R2.
  - Replace: `        const expected = observation.readoutBefore;` (eight leading spaces).
  - With: `        const expected = { className: "hover-readout", text: "id 0" };`
  - Expected: on the reopen route, `R2-successful-reopen-clears-and-identifies` fails with "R2: after reproducing S2's N zoom-in notch(es) around the canvas centre, hover at the formerly-occupied pixel is <the real readout>, expected S2's readout from before the change, {"className":"hover-readout","text":"id 0"}".

**Step ids at head** (the ids are unchanged from round 1's aa30f99f; only the lines moved)
- Before is aa30f99f (the runs record's head), after is bf527c1e, both in frontends/shell/e2e/source-changed.mjs.

| Step | Routes | Before line | After line |
|---|---|---|---|
| S1-open | all | 690 | 831 |
| S2-settle-and-precondition | all | 705 | 846 |
| S3-retarget-junction | pre, reopen (repoints) | 874 | 1015 |
| S3-retarget-junction | post (INFO, deferred) | 882 | 1023 |
| S4-issue-one-query | pre, reopen | 892 | 1033 |
| S4-issue-one-query-and-retarget-on-mint | post | 945 | 1086 |
| S5a-status | all | 1028 | 1169 |
| S5b-residency-cleared | all | 1054 | 1195 |
| S5c-picks-refused | all | 1072 | 1213 |
| R1-failed-reopen-does-not-clear | reopen | 1142 | 1283 |
| R2-successful-reopen-clears-and-identifies | reopen | 1161 | 1302 |
| R3-zoom-to-layer-clickable-and-effective | reopen | 1203 | 1349 |
| R4-second-source-change-ends-the-new-session | reopen | 1216 | 1362 |
| S5d-post-check-route-confirmed | post | 1253 | 1399 |
| harness (on a thrown error) | all | 1291 | 1437 |
| fixture-integrity | all | 1304-1315 | 1451-1462 |

**Commands and exit codes**
- `git fetch origin`: 0.
- Head confirmed aa30f99f; `git status --porcelain --untracked-files=all` printed nothing, rc=0.
- `node --check` on the driver: 0 (before commit).
- ASCII scan of the driver (node, counts bytes over 127): 0 such bytes, rc=0.
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`: rc=0 (464 pass, 0 fail, about 46 s).
- `node scripts/plan/verify.mjs`: rc=0, PASS.
- `node scripts/plan/verify-cites.mjs`: rc=0, PASS.
- `node scripts/plan/verify-quotes.mjs`: rc=0, PASS.
- These suites ran on the working tree before the commit, not re-run after it. The commit changed nothing after them.
- `git commit -s -F <file>`: rc=0.
- Probe commands: smoke, 3000, 20000 and the head run each rc=0. The extractor, the error test, the kill-path test and the ctime test each rc=0.
- Final `git status --porcelain --untracked-files=all` printed nothing, and HEAD is bf527c1e.
- The node tests ran without a hold. They took about 46 s, which I did not treat as heavy, and nothing else I ran was heavy. The app was not launched. No junction was made outside my probe folder; the probe unlinked its own junctions. Every process I started has exited.

**Differences from the form or this brief**
1. The S4 catch blocks now test `e.repointFailed`, and `i4Error` is renamed `repointError`. Without this, a non-I4 failure such as Win32 4394 would be swallowed as "no stream-issued line followed any gesture" instead of failing by name.
2. The helper starts only on win32, so off Windows the requireWindows messages in S3, S4 and R4 still come first. A helper start failure prints a message naming Windows PowerShell 5.1 and Add-Type and exits 1.
3. The helper starts after the layout and hash check but before `attachOrLaunch`, so a missing PowerShell fails before the app launches.
4. The existing `wmic` `execFileSync` in `appProcesses` has no timeout. It is not one of my spawns, so I left it.
5. The unlink and create in `makeJunction` are kept as the brief says. Its doc comment now says it is the layout only.
6. I did not run H3's `ctime` read in the driver. It stays the custodian's, and the ctime test above shows `ctime` moves.
7. The driver is over §7 (class 8). I did not trim it to the ceiling.
8. The walkthrough rows needed no change. Nothing there says the repoint is in-process or spawns nothing; they describe the operator's hand steps.
9. The README entry after the A.3 paragraphs (the three route bullets) is untouched and still says "repoints".

**Four failure classes, checked**
- **Cross-module code:** no cross-module seam. The only new interfaces are Windows kernel32 `CreateFileW`, `DeviceIoControl` and `CloseHandle`, and the PowerShell child's stdin and stdout. The probe drove the real code through that shape.
- **Completion claims:** every claim above points to a command and its output. The probe numbers are from the runs listed; the exits are printed lines.
- **User-facing messages:** the strings in the driver (I4 text, answer text, helper-exited text, R2 failure and note) describe code at this commit. `repoint`'s messages were exercised through the error test (answer "2"), but the I4 branch (answers 5 and 1314) and the 4394 branch were not triggered. They are read, not run.
- **Required tests:** the §4 runs and W-M6/W-M7 are the custodian's. What I ran is the probe, the node tests, the verify scripts, the ASCII scan and `node --check`. The driver itself was not run against the app, per the brief.

Model as the harness reports it: Sonnet 5.5, claude-sonnet-5-5. No model override and no context handoff received or produced.

Scratch files are only in my scratch folder, none committed.
