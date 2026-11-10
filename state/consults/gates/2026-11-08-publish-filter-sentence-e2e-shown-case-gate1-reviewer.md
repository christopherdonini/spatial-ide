Reviewed: PR #299 at 4d6108485b8d4082bda1bd4f101bfea4b098239c (base 72842b52), gate 1, reviewer
Verdict: PASS WITH NOTES
cut/publish-filter-sentence-e2e-shown-case @ 4d6108485b8d4082bda1bd4f101bfea4b098239c

The packet's sha256 matched e14dbafc…48b21cd and its size was 8274 bytes (rc=0).

## Findings by class

**Correctness: none.** The seam is the real one. `prepareCurrent` reads `prepared.prompt.filter_scope`. That is `PublishPromptData.filter_scope: string | null` in types.ts:35-39, inside `PrepareOutcome`'s `prompt` variant (types.ts:58-59). The producer is publish.rs:132-137 → :292, `Option<String>` with no `skip_serializing_if`, reached through PublishPanel.tsx:474's `publishPrepareWithDestination(…, filterActive, …)` with the hook re-registered on `filterActive` (:585). The end-to-end proof is the real app on WebView2: my g1r-r1, g1r-m-ev2 and g1r-m-ev4 below.

**Evidence: none.** I re-ran the suite and both mutations at the head myself (Part 1 item 9; OPEN-4 (A)). Each failed where the form predicted, at the head as well as at C1.

**Documentation: 1, must-fix before the merge** (not the human's wording; under §31 the worker applies the words with no re-gate, and the PR body lists them).

- **D1. The RECORDED MUTATIONS lead sentence (export-view.mjs:15 at the head, unchanged from base :14) is now untrue for two of its five entries.**
  - Requirement: Part 1 item 1, where the header's sentences are checked clause by clause.
  - Evidence: the sentence says "Each observed at e3a14042 by the custodian's e2e (the record state/consults/2026-10-14-…-custodian-run-2.md), the failing step and the opening words of its message as the record gives them." Neither new entry (E-CV EV2 at :24-25, E-CV EV4 at :26-27) was observed at e3a14042 or by that record. Their own Observed lines name 5b1911103884b575e05c0cb20cb48d0f8b65b075, and each carries the whole message, not its opening words.
  - Closure: replace line 15 with exactly this one line:
    `// RECORDED MUTATIONS, each applied alone, the suite run, the failing step recorded by name with the commit, then reverted. The first three were observed at e3a14042 by the custodian's e2e (the record state/consults/2026-10-14-export-current-view-after-unreported-fit-e2e-custodian-run-2.md), the failing step and the opening words of its message as the record gives them; E-CV EV2 and E-CV EV4 at the commit their Observed line names, with the line the run printed in full.`
  - Clause check of my words:
    - (a) "each applied alone … then reverted": this is unchanged from base. For the two new entries it holds: there is one one-line App.tsx diff per run (the worker's report, and my diffs below), and the porcelain was empty after each revert.
    - (b) "The first three were observed at e3a14042 …": this is the base's own claim, narrowed to the entries at :16-23 (E-CV, E-CV-RESIZE, E-CV-OPEN). I did not re-resolve it; it is unchanged by this piece.
    - (c) "E-CV EV2 and E-CV EV4 at the commit their Observed line names": :25 and :27 name 5b191110…, and the first lines of `<H>/out/e2esc-e2e-m-ev2.log` and `-m-ev4.log` name the same 40-hex. Shown by script (check 3).
    - (d) "with the line the run printed in full": each Observed text is byte-equal to its log's `[E-CV]` line, shown by script.
  - Size: one line replaced, which takes the diff to 29+6=35 against the declared 60.

**Notes (preferences, not acceptance conditions):**
- N1. With publish.rs absent, the suite exits 1 before attachOrLaunch but prints a raw ENOENT, not the "harness failure" words. The doc comment at :54 says "a literal it cannot read is a harness failure". The behaviour holds (exit 1, app untouched); only the label differs. No ordinary use reaches it, because publish.rs is in the tree.
- N2. E-CV-RESIZE's result under each mutation (PASS) is recorded in the run logs and the worker's report, not in the header. The form's "recorded, not predicted" is met by the logs.
- N3. `readFilterScopeSentence` has no unit test, unlike the exportElapsed precedent, which has exportElapsed.test.mjs. The form did not ask for one.

## Checks 1 to 9

**1. Out-of-scope first.**
- `git diff --name-only 72842b52...4d610848` (rc=0) lists only `frontends/shell/e2e/export-view.mjs`. numstat is `28 5`.
- `git diff 72842b52...4d610848 -- e2e/README.md App.tsx publish.rs` printed 0 bytes (rc=0). protocol/ and docs/ diffs are empty. Product paths changed on main since the base: 0.
- Clause by clause, all true:
  - ADR: no docs/ file changed.
  - security: no import beyond `node:` and `./lib.mjs`, and package.json is unchanged. Every prepare is cancelled through `.publish-dialog-cancel`, and no execute is called.
  - wire: nothing under protocol/.
  - guarantee: only assertions are added. `filterActive` and `filter_scope_sentence` are unchanged.
  - no app string is added or changed.
- §21a's four categories (AUTONOMY.md:317-327) are untouched. The single gate applies.

**2. The diff against Change and notes 1 and 2.** Script `<S>/e2esc-g1r-check2.mjs`, rc=0, fails=0.
- It extracts `readFilterScopeSentence` byte for byte from the suite, runs it on the head's publish.rs, and compares the result with:
  - the pin test's own regex and collapse, evaluated from PublishPanel.test.ts:225 and :237 (both texts equal the suite's);
  - types.ts's `FILTER_SCOPE_SENTENCE`, the pin test's `toBe` operand;
  - the expected value M-EV4's log printed.
  All are equal. The capture held a `\`+LF continuation, so the collapse did real work.
- Failure path: scratch copies of the suite run with a stub lib.mjs whose `attachOrLaunch` exits 42.
  - The positive control (real publish.rs) reached the stub (status 42).
  - With the literal renamed, and with it retyped to `String`: status 1, and only `export-view: harness failure: the FILTER_SCOPE_SENTENCE literal of src-tauri/src/publish.rs cannot be read` was printed. The stub was not reached.
  - With publish.rs missing: status 1, stub not reached (N1).
- `stepCv(page, consoleHandle, filterScopeSentence)` is at :121, called at :199. `prepareCurrent` returns `filterScope: prepared.prompt.filter_scope` (:94).
- EV2's assertion (:130) follows EV2's box assertion (:129), and EV4's (:134) follows EV4's (:133). Each message names its step, the value received (JSON) and the value expected.
- All five deleted lines and their replacements:
  1. old header :9 → new :9-11, the same text plus "; A's `filter_scope` is null (no filter yet)";
  2. old header :10 → new :10-11, "gives F, and F differs from A." becomes "gives F, F differs from A, and F's `filter_scope` equals publish.rs's FILTER_SCOPE_SENTENCE (read at the run's start)";
  3. `return { xmin, ymin, xmax, ymax };` → the same plus `filterScope`;
  4. `async function stepCv(page, consoleHandle) {` → plus the third parameter;
  5. `await runStep("E-CV", 300_000, () => stepCv(page, consoleHandle));` → passes the sentence, with the 300_000 bound unchanged.
- Everything else is pure addition. No other step, assertion, wait, bound or string changed.

**3. The header.**
- The E-CV lines (:8-11) are true clause by clause against the code (above).
- The two RECORDED MUTATION entries: their Expected lines match my runs. Their Observed lines are byte-equal to the `[E-CV]` lines of `e2esc-e2e-m-ev2.log` and `-m-ev4.log`, and each names the 40-hex the log's first line names (5b191110…). Shown by script; the OK lines are in `<S>/e2esc-g1r-check2.out`.
- Commit 2 (5b191110..4d610848) adds only those four comment lines, so the head's code is C1's.
- The lead line is D1.

**4. The suite and the mutations.**
- Harness file sizes and sha256 equal the values in the worker's brief:
  - app-down.ps1: 892, db8ac461…
  - app-up-wait.ps1: 214, 6b8d59db…
  - app-up.ps1: 1855, d6f38fa6…
  - build-exe.sh: 646, d9e11574…
  - busy.ps1: 983, 13486694…
  - run-suite.sh: 1637, 6c5542b3…
  - tauri.conf.json: 293, 0dc02596…
  - shim/npx.cmd: 232, 7b971e6c…
  - shim-wait/npx.cmd: 310, 4136623a…
- The exe is 90906112 bytes, sha256 b22b9cb80a40d141b65092940586e44697bdb793bc00e7bd46d41614d4f93c79, mtime 12:05:44 +0100, equal to the packet. It was not rebuilt.
- App.tsx `filterActive={activeFilter !== null}` occurs once (grep -c 1, at :2450).
- **g1r-r1** (unmutated):
  ```
  worktree C:/dev/wt/e2esc head 4d6108485b8d4082bda1bd4f101bfea4b098239c start 2026-11-08T11:50:25Z
  [E-CV-OPEN] PASS (2868ms): Current view is available after the first pixels, with no pan or zoom
  [E-CV] PASS (9122ms): A [2599220.1312058372, 1198329.1104816883, 2600340.0181676373, 1199522.7624529488], F [2599779.6096260287, 1199346.3530761313, 2602019.99390408, 1201734.30757609]; EV5 (recorded, not asserted): Z [2599779.6096260287, 1199705.8142497868, 2602019.99390408, 1202093.768749745] differs from F
  [E-CV-RESIZE] PASS (5368ms): F' [2599780.0746867373, 1198925.9364673186, 2602019.8486103383, 1201313.2404098392], R [2600095.2524544294, 1199127.1137658455, 2601704.670842646, 1201112.0631113122] at 1088x680
  [export-view] 4 PASS, 0 FAIL: E-CV-OPEN=PASS E-CV=PASS E-CV-RESIZE=PASS FIXTURES=PASS
  rc=0 end 2026-11-08T11:50:49Z
  ```
  App-down: `killed tree 40520` / `killed tree 59608` / `port 9223 free` / `port 5400 free`. Call exit 0.
- **g1r-m-ev2.** The diff was `@@ -2447,7 +2447,7 @@` `-            filterActive={activeFilter !== null}` `+            filterActive={true}` (numstat 1 1).
  ```
  worktree C:/dev/wt/e2esc head 4d6108485b8d4082bda1bd4f101bfea4b098239c start 2026-11-08T11:52:11Z
  [E-CV-OPEN] PASS (2555ms): Current view is available after the first pixels, with no pan or zoom
  [E-CV] FAIL (2899ms): E-CV EV2: before any filter, Current view's prompt carried filter_scope "[P6 placeholder] this bundle format cannot record a row predicate (ADR-017 §8, bundle_version 1); publishing publishes the viewport extent, not your filter", expected null
  [E-CV-RESIZE] PASS (5402ms): F' [2599780.0746867373, 1198925.9364673186, 2602019.8486103383, 1201313.2404098392], R [2600095.2524544294, 1199127.1137658455, 2601704.670842646, 1201112.0631113122] at 1088x680
  [export-view] 3 PASS, 1 FAIL: E-CV-OPEN=PASS E-CV=FAIL E-CV-RESIZE=PASS FIXTURES=PASS
  rc=1 end 2026-11-08T11:52:28Z
  ```
  App-down: `killed tree 45480` / `killed tree 60400` / `port 9223 free` / `port 5400 free`. This is as predicted.
  The revert `git checkout -- frontends/shell/src/App.tsx` returned rc=0, and the porcelain was 0 bytes.
- **g1r-m-ev4.** The same line became `+            filterActive={false}` (numstat 1 1; the original occurred once again before the edit).
  ```
  worktree C:/dev/wt/e2esc head 4d6108485b8d4082bda1bd4f101bfea4b098239c start 2026-11-08T11:53:11Z
  [E-CV-OPEN] PASS (2816ms): Current view is available after the first pixels, with no pan or zoom
  [E-CV] FAIL (5263ms): E-CV EV4: after the Apply, Current view's prompt carried filter_scope null, expected "[P6 placeholder] this bundle format cannot record a row predicate (ADR-017 §8, bundle_version 1); publishing publishes the viewport extent, not your filter"
  [E-CV-RESIZE] PASS (5348ms): F' [2599780.0746867373, 1198925.9364673186, 2602019.8486103383, 1201313.2404098392], R [2600095.2524544294, 1199127.1137658455, 2601704.670842646, 1201112.0631113122] at 1088x680
  [export-view] 3 PASS, 1 FAIL: E-CV-OPEN=PASS E-CV=FAIL E-CV-RESIZE=PASS FIXTURES=PASS
  rc=1 end 2026-11-08T11:53:31Z
  ```
  App-down: `killed tree 58776` / `killed tree 76472` / `port 9223 free` / `port 5400 free`. This is as predicted: the EV4 box assertion passed first.
  The revert returned rc=0, the porcelain was 0 bytes, and the original line again occurs once.

**5. `npm run verify`** (shared hold): rc=0. `Test Files  109 passed (109)`, `Tests  1446 passed (1446)`, `== 76 passed, 0 failed ==`, `== 30 passed, 0 failed ==`. Vitest waited on a cargo package-cache lock held outside this run before it went on.

**6. Governance checks:**
- `node --test` over the three folders (hold): rc=0, 598 tests, 598 pass, 0 fail.
- verify-cites: rc=0, PASS (2762 files).
- verify-quotes (hold): rc=0, PASS (151 checked, 0 errors).
- verify-test-claims: rc=0, PASS (764 claims).
- `verify.mjs --offline`: rc=0, PASS.

**7. Bytes:** the 28 added lines hold 0 CR and 0 TAB. The head file is 16490 bytes, holds 0 CR, and its last byte is 10.

**8. CI:** `gh pr checks 299` rc=0, every check pass. `gh run view` reports headSha 4d6108485b8d4082bda1bd4f101bfea4b098239c and success for all six runs:
- 42475812121 Product CI — shell (pull_request)
- 42475812128 Exposure scan (pull_request)
- 42475812127 Ported notices (pull_request)
- 42475812136 DCO sign-off (pull_request)
- 42475615549 Product CI — shell (push)
- 42475615533 Ported notices (push)

**9. Porcelain afterwards:** `git status --porcelain --untracked-files=no` printed 0 bytes. HEAD is 4d6108485b8d4082bda1bd4f101bfea4b098239c.

## Harness disclosure

The runs used the port-5400 harness under the human's approval of 2026-10-11, item 1: the debug exe with the TAURI_CONFIG overlay (CDP 9223, localhost:5180 mapped to 127.0.0.1:5400), Vite on 5400 with `--strictPort`, and the npx shim on PATH for those runs only. Port 5180 and `validate` were not used. No tracked file was changed for the harness.

Every place the runs and checks wrote:
- `<H>/out/e2esc-e2e-g1r-{r1,m-ev2,m-ev4}.*` (log, busy, down, app.err/out, vite.err, rep.tauri.e2e.conf.json);
- `<H>`'s own top-level `e2esc-e2e-app.err.log`, `app.out.log`, `vite.out.log`, `vite.err.log`, `shim.out` and the transient `app-pids.txt`, which app-down removed (as the harness writes them);
- the worktree's gitignored `frontends/shell/e2e/out/` and `target/e2e-export-view-out/` (the suite's prepare destinations, never executed);
- verify's gitignored build outputs (`frontends/shell/dist`, `src/generated/`, `renderer/bundle-viewer/dist`);
- the app's per-user folders (session logs);
- App.tsx's one line for the two mutated runs, reverted;
- scratch only for my own files: `<S>/e2esc-g1r-*`, including the dirs `<S>/e2esc-g1r-fail-{positive-control-real-publish-rs,literal-renamed,literal-retyped-String,publish-rs-missing}/`.

The suite reads FIXTURE from the main checkout, read-only.

**Departure:** this session has no Write tool. I wrote my script by a quoted heredoc in Bash. The Bash tool collapsed `\\` to `\`, so I rewrote the affected lines to build backslashes from `String.fromCharCode(92)` and to evaluate the pin test's own regex text. A self-test line in the script confirms its single backslashes survived.

## For the human (marked as such)

- OPEN-3 (B) stays yours. Note that e2e/README.md:768 says "Each step's recorded mutation is in the file's header, with the commit and the run that observed it". The two new entries name the commit but no run record, so if (B) is ruled, that clause wants a look too. Your OPEN-1, OPEN-2 and OPEN-4 settlements are reviewable on return; nothing here argues for reversing them.

## The packet's gaps

- The harness files' sizes and sha256: the packet says they matched the worker's brief but gives no values. I took them from `<S>/brief-e2esc.md` lines 10-18.
- Otherwise none.

## Hold lines (this project's only, `also=` elided)

All shared, each on cores 0-7, affinity FF, and each released (`MACHINE_RELEASED project=SpatialIDE shell=bash.exe:<id> affinity=FF (cores 0-7)`):
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:18396 also=[elided]` (g1r-r1)
- `… shell=bash.exe:65876 …` (g1r-m-ev2)
- `… shell=bash.exe:50580 …` (g1r-m-ev4)
- `… shell=bash.exe:33304 …` (npm run verify)
- `… shell=bash.exe:60588 …` (node --test)
- `… shell=bash.exe:35552 …` (verify-quotes)

## Background shells left

None. All six background calls completed and were notified. No `spatial-ide-shell-e2esc.exe` process is running (tasklist), and `app-pids.txt` is absent. Nothing needed killing.
