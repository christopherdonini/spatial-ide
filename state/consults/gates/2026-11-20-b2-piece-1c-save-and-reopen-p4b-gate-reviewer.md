Reviewed: branch cut/b2-piece-1c-p4b at 0c74eeab7e0c100a5a193e5109e272025ca43bb6 (the custodian's filing note, 2026-11-20: the reviewer's gate of P4b, before its PR; Read 1, Bash 55, TaskStop 1, SubagentHandback 1, four errored (two Bash chains with exit code 1, a foreground sleep the harness refused, and a TaskStop the harness does not give a subagent), model claude-sonnet-5-5, from 2026-11-20T18:48:49Z to 2026-11-20T19:09:26Z by its transcript; the report below byte for byte from its hand-back of 14045 bytes, sha256 3802e23975f1d840dfb4f6bc655b9f6345341ef6105c644eece9cd4457e385ba, nothing masked by the custodian, with this note in its first line, with one final newline), gate, reviewer, attempt 1
Gate: b2-piece-1c-save-and-reopen P4b, reviewer, at 0c74eeab7e0c100a5a193e5109e272025ca43bb6
Branch and commit reviewed: cut/b2-piece-1c-p4b @ 0c74eeab7e0c100a5a193e5109e272025ca43bb6 (worktree C:/dev/wt/1c-p4b, clean before and after my mutation).
Verdict: FAIL, on one sentence of wording only (Evidence class, finding E-1). There is no code finding. The replacement words are in finding E-1 and land with no re-gate (AUTONOMY §31). With E-1 applied and D-1 to D-3 fixed in the same PR, nothing else blocks.

Read first (main checkout `C:/dev/spatial-ide`, no fetch)
- Form `governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md`, sha256 b041ee40c72ec21ddefcb80daa1ad03c2166529101112e63d26456609247d5bc, 4620 lines. Last amendment is 66.
- Read in full: Amendments 66, 65 and 64, and Amendment 54 items 6, 8, 9 and 15.
- Directives ADV-2026-11-20-18, -19 and -21, each whole, and -20 (item 2 for the build rules). These are the advisor's words under the delegation of 2026-11-13, not the human's.
- Evidence: the two P4b worker reports under `state/consults/`, `<S>/p4b3-1.md` and `<S>/p4bs-final.md`.

1. Scope
- `git diff --name-only B...H` gives exactly Amendment 65 item 2's four paths: `frontends/shell/e2e/README.md`, `frontends/shell/e2e/lib.mjs`, `frontends/shell/e2e/second-open.mjs`, `frontends/shell/package.json`.
- `lib.mjs` diff: 59 insertions and 0 deletions. `grep '^-'` on its diff prints only the `---` header, so no existing function changed.
  - By Amendment 54 item 9 (its P4b line), the series is E-SAVE, E-REOPEN, E-CHANGED, E-SECOND and E-CRASH-UNLOCK, as the tester ran it (project, reopen, second-open). Not every suite runs.
- `package.json`: one `+` line, `"e2e:second-open": "node e2e/second-open.mjs",`, after `e2e:reopen`. No lockfile is in the diff (`grep -i lock` finds none).
- One export is added, `attachSecondApp`. `cdpVersion` is private.
- Main since B: B (4d34eaae) is a merge commit of main into the branch, so it is not an ancestor of main. The merge base of B and main is db6eb550, and main has three commits past it (d17f1e96, 1701ace1, 073c7eb8). They change 11 files, all under `governance/`, `state/` or `site/`. A grep of that list for any other path matches nothing (rc 1). Main's changes since B are records only.

2. Counts (`git diff --numstat B...H`)
- README.md 12/0, lib.mjs 59/0, second-open.mjs 194/0, package.json 1/0. That is 266 in and 0 out, which matches the correction's hand-back.
- The e2e group is 266 against 425, and every other group is 0. Under the ceiling.

3. The launch (`attachSecondApp`, `lib.mjs`), against ADV-2026-11-20-18 item 1 (a) to (d) and item 2
- Refusals before B starts, each by name as "launcher failure":
  - exe not found;
  - (a) A does not answer on `http://127.0.0.1:${CDP_PORT}`;
  - (a) something already answers on `http://[::1]:${CDP_PORT}`.
  - All three throw before `spawn`.
- The two browsers are told apart by `browserOf(v)`, the last path segment of `webSocketDebuggerUrl` (the browser id). A missing url gives "undefined" on both sides, which compares equal and is refused. This is the member the worker's step 1 report names.
- A B that cannot be reached is a failed run by name:
  - "launcher failure (b): app B never answered on [::1]:9223 within 120000ms", after `killTree`;
  - "launcher failure (b): the endpoints are not two browsers (A …, B …)", after `killTree`;
  - a spawn error is "launcher failure: failed to spawn".
  - These throw out of `main`'s try and print `second-open: FAIL …` with exit code 1. They are never a skip and never a pass.
- B starts while A is up in each row:
  - `main` calls `attachOrLaunch`, then `ready(A)`, then `attachSecondApp`, before any row.
  - `a.stop()` is called only inside E-CRASH-UNLOCK, after B exists.
  - `a.launched === false` throws.
- README entry: it says A is started first, the browser takes the IPv6 loopback when 127.0.0.1 holds the port, the loopback must be on, it was observed on this machine, and it is not called documented. This satisfies (d).
- Note N-1: if `connectOverCDP` or `findAppPage` throws after check (b) passes, the already-spawned B is not killed (`b` is still null in `main`). The next run's check (a) would refuse it by name. This is a failure-path leak only, so it is a suggestion.

4. The rows (`second-open.mjs`) against Amendment 54 items 8 (c) and 6
- Poll: `TRIES = 40` and `TRY_MS = 250`.
  - A `sleep(250)` follows each refused try, so the period is 250 ms plus the call's own time.
  - The poll ends at the first `admitted`, or after the 40th refusal.
  - Measured in my mutation run: 40 tries took 10730 ms. The worker's mutation run took 10683 ms and the control took 11033 ms. "10 s" in the form is nominal.
  - A pointless 250 ms sleep follows the 40th refusal. This is a nit.
- Each refused try (`tryOpen`):
  - the hook's answer must be `skp.project_open_elsewhere`;
  - the page's `.admission-refusal-code` must equal it;
  - the `.admission-refusal-owner` text must equal S9's other-window constant, which is read from `reopenNotices.ts` (the constant exists at line 31);
  - the run must have ended, with neither `.admission-open-cancel` nor `.admission-open-liveness` present.
  - Any mismatch throws with the page's state.
  - The first try in E-SECOND is separate and throws if it is `admitted`.
- Evidence printed: tries and elapsed ms on each PASS line, marked "evidence, not a measurement". The tester's run at H printed E-SECOND try 1 (99 ms), A's reopen in E-CRASH-UNLOCK try 1 (86 ms), and E-CRASH-UNLOCK try 2 (413 ms).
- Seam: the hooks are the real ones in `AdmissionPanel.tsx`. `e2eOpenProjectFolder` returns `outcome.refusal.code` or `outcome.kind`, and the suite compares against `"admitted"`. The suite starts from the real hook's shape.
- At the bound at H (ADV-2026-11-20-21 item 1 (b) and (c)): `releaseLineIn(fromByte)` does `readFileSync(APP_LOG).subarray(fromByte)`, so the cut is on bytes and the decode comes after.
  - Zero bytes gives "<path> gave 0 bytes: the log is empty, so the suite cannot tell from it whether the line … was written".
  - Otherwise it gives "<path> gave N bytes: the line … is in / not in those bytes".
  - An unreadable file gives "no log could be read (<path>: …)".
  - The line as printed is in question 5. A wrong line there would be a finding, and it is correct.
- Note N-2: on a zero-byte slice the line says "the log is empty". That is untrue if the file held earlier content and this run added none. The advisor's item 1 (b) words it so. It is harmless here, where `app.log` is 0 bytes.

5. E-SECOND's mutation, remade at H
- Anchored replacement: count of the original text was 1 (checked by grep and again inside the command, which fails unless the count is exactly 1). One text-exact replacement, at `commands.rs` line 144.
- `git diff --stat`: `frontends/shell/src-tauri/src/commands.rs | 2 +-`, 1 file changed, 1 insertion(+), 1 deletion(-).
- Ports before the run: no listener on 5180 or 9223 (`netstat`, TIME_WAIT aside).
- `cargo build --locked` in a hold: Finished in 2m 50s, with one expected warning (log `<S>/gp4br-build-mut.log`).
- Suite in a hold, `timeout 900 npm run e2e:second-open > <S>/gp4br-mut.log`, `rc=1`. FAIL line, byte-copied from `<S>/gp4br-mut.log`:
`second-open: FAIL E-SECOND: B was still refused after 40 tries (10730ms); the last code was skp.project_open_elsewhere; C:\dev\wt\1c-p4b\frontends\shell\e2e\out\app.log gave 0 bytes: the log is empty, so the suite cannot tell from it whether the line "the project lock's release thread did not start" was written`
  - It is red at the bound, by name. It names the log and the 0 bytes, says the log is empty, and does not say "not in A's log".
  - `e2e/out/app.log` was 0 bytes after the run, so A's stderr does not reach it. That is the advisor's node (ADV-2026-11-20-21 item 1 (f)), not P4b's.
- Revert: the reverse replacement (count 1, "reverted once"), then `git diff --quiet` rc 0 and an empty porcelain. A rebuild in a hold finished in 1m 53s (`<S>/gp4br-build-final.log`), so the exe is the committed code.
- Ports after: no listener. No `spatial-ide-shell.exe` is running.
- E-CRASH-UNLOCK's control: reused, not reproduced. It is the worker's `<S>/1cp4b1-mut-2.log`, run at 441e2346. It ends: `second-open: FAIL E-CRASH-UNLOCK: B was still refused after 40 tries (11033ms); the last code was skp.project_open_elsewhere`. The change from 441e2346 to H is `releaseLineIn` alone (5 insertions, 3 deletions in `second-open.mjs`), which is not on E-CRASH-UNLOCK's path, so the control stands at H.

6. Lints and checks
- `node --check` on `e2e/lib.mjs` and `e2e/second-open.mjs` at H: both rc 0.
- No Rust package changed, so no clippy.
- CI at H, read by `gh run list` on the branch: "Product CI — shell" (44790972980) and "Ported notices" (44790972712) are completed, success, at headSha 0c74eeab. Its jobs "typecheck · build · vitest · cargo test" and "tauri build (NSIS, build-only, no signing)" are success. The workflow's `npm run verify` step is line 214 of the shell workflow file. I reused CI for `npm run verify` and did not run it.
- Commits carry a `Signed-off-by` line added by `-s`. This is class 1 under ADV-2026-11-20-21 item 3, and the fault is the brief's. The correction's message states that the run against the code found it, as item 1 (a) asks.

7. Runs
- Reused:
  - the tester's series at H (`<S>/p4bs-final.md`): project 11 PASS, reopen 10 PASS, second-open 2 PASS, all rc 0, ports clean before each, one EPERM cleanup warning on B's WebView2 folder;
  - the worker's three runs and its two mutation runs at 441e2346;
  - CI.
- Reproduced by me: E-SECOND's mutation at H, with its build, its revert and its rebuild.
- I ran no other e2e suite.
- Holds: three granted (two builds and the suite). Each hold line read `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=<m> also=<m>`. Each release line read `MACHINE_RELEASED project=<m> shell=<m> affinity=FF (cores 0-7)`. I saw `MACHINE_WAITING` (turn held by `<m>`) before the first and second grants. There was no `MACHINE_ERROR` and no exit 96 to 99.

Findings

Correctness: none.

Evidence
- E-1 (blocking, wording; the worker's README sentence, not the human's wording): `e2e/README.md`, Second-open section, last paragraph, reads "B's dev-server page depends on A's dev server only for its first load."
  - This is a limit claim. The evidence is that B's reopen and the refusal block's read ran after A's process tree was killed, in E-CRASH-UNLOCK, and nothing else of B is asserted there. Whether B's page needs the dev server for anything later (a lazily imported module, a reload) was not tested.
  - Replacement words: "B's page comes from A's dev server and stays loaded after A's process tree is killed; E-CRASH-UNLOCK runs B's reopen after that kill, and no other step of B is asserted there."
  - Clause check:
    - "comes from A's dev server": `attachSecondApp` starts no dev server, and `findAppPage` takes `localhost:5180`.
    - "stays loaded after A's process tree is killed": the tester's run and the worker's runs have B's try 2 admitted after `a.stop()`.
    - "runs B's reopen after that kill": `second-open.mjs` lines 175 to 177.
    - "no other step of B is asserted there": nothing follows `pollOpen(b.page)`.
  - A source comment is not needed for any timing case: the sentence has none.

Documentation must-fix (the same PR, before merge)
- D-1: README Second-open paragraph and the header comment of `second-open.mjs` (lines 10 to 11) say the step "says whether the release thread's failure line is in … `app.log`, or that no log could be read". After 0c74eeab the line also gives the byte count and the empty-log case, so both are stale.
  - README replacement words: "and at the bound the step fails with the last code, gives the path of `e2e/out/app.log` and how many bytes of it this run could read, says the release thread's failure line is in or not in those bytes, says the log is empty and that it cannot tell when the count is zero, and says no log could be read when the file cannot be read".
  - Header replacement words, for "and says whether the line … is in A's log (`e2e/out/app.log`, from the byte where this run's launch began), or that no log could be read": "and gives the path of A's log (`e2e/out/app.log`) and how many bytes of it this run could read, from the byte where this run's launch began; it says the line `close_dataset` writes when its release thread does not start is in or not in those bytes, says the log is empty and that it cannot tell when the count is zero, and says so when no log could be read".
  - Clause check against `releaseLineIn`: path (`APP_LOG`), count (`bytes.length`), in/not in (`found`), zero (first return), unreadable (catch), `fromByte` (`logFrom` taken before `attachOrLaunch`).
  - Neither is the human's wording; the worker applies them.
- D-2: the header says "every 250 ms for at most 40 tries (10 s)". The code sleeps 250 ms after each try, so 40 tries took about 10.7 s. Words: "every 250 ms after the previous try, for at most 40 tries (about 10.7 s in the mutation run)". Not the human's wording.
- D-3: `e2eOpenProjectFolder` and `e2eSaveProjectToFolder` in `src/e2e-test-surface.ts` say "Only caller: `e2e/reopen.mjs`" and "`e2e/project.mjs`". `second-open.mjs` now calls both, plus `openPath`. P4b may not edit `src/`. Send the comment fix to the docs lane, with these words: "Callers: `e2e/reopen.mjs` and `e2e/second-open.mjs`" and "Callers: `e2e/project.mjs` and `e2e/second-open.mjs`".

Notes
- N-1 and N-2 are in questions 3 and 4.
- The `RECORDED MUTATIONS` header of `second-open.mjs` is empty, which matches `reopen.mjs`'s convention (entries added by the commit that observes them). The closing can add the two mutations observed (441e2346 and this gate at H).
- Stop 10 holds: three runs in a row within the bound (worker, 441e2346), plus the tester's run at H.

Runs reused and reproduced: see question 7.

Model as the harness reports it: Sonnet 5.5 (claude-sonnet-5-5).
