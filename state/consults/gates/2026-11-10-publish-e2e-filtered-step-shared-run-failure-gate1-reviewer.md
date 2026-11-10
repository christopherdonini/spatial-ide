Reviewed: PR #306 at 6bb26b0ce94b45b15435638dea9ffea3a9346ab8 (base 391f5934), gate 1, reviewer
Verdict: PASS WITH NOTES (WORDS-ONLY)
Branch and commit: cut/publish-e2e-filtered-step-shared-run-failure @ 6bb26b0ce94b45b15435638dea9ffea3a9346ab8

The code is correct and its evidence holds. I re-ran all four runs at the stated revisions and each one matched its prediction. The only blocking findings are three sentences in publish.mjs's header section "FILTERED''s wait, a precondition" (lines 40-43 at the head). They are the worker's words, not the human's. Amendment 1 rules only where the wait is described ("in publish.mjs's own header"), not the words used. So the worker applies the replacement below with no re-gate, and the PR body lists it.

## Findings

### Correctness
None in the code. `stepFiltered` (publish.mjs:471-487) does what the form's Change line says:
- one `page.evaluate` captures the hook, awaits `queryWithFilter`, and only on `applied` polls until the hook differs, sleeping 1000 ms per turn under a 20 000 ms deadline;
- the `applied` check comes first and is unchanged;
- the new throw names FILTERED', the wait and 20000ms;
- the prepare stays its own `pairEvaluate`.

It reads the real seam. `registerE2eHook` stores each new arrow (e2e-test-surface.ts:360-368). The PublishPanel effect re-registers `publishPrepareWithDestination` with deps `[datasetHandle, style, filterActive, scope]` (PublishPanel.tsx:570-585). `filterActive={activeFilter !== null}` occurs once in App.tsx (:2450).

**W2 (blocking, words supplied).** The header says "The wait polls once a second, for at most 20000ms". That is an untrue limit claim, so it is classed Correctness under the proportional-gates paragraph.
- Requirement: Part 1 item 1 (sentences checked clause by clause against the code), and the proportional-gates rule that an untrue claim of a limit is a Correctness finding.
- Evidence: the loop (:476-479) checks `Date.now() < deadline` before each turn. A wait that times out therefore never ends before 20000ms; it ends when the one-second sleep that crosses the deadline finishes. FILTERED' took 20099ms at the head in my M-FLAG run and 20101ms at C1 in the worker's (both totals include the Apply).
- Closure: the replacement block below.

**Named, not blocking (record it in the section's source comment).** The last check falls just under 20000ms. A replacement that lands between that check and the deadline is not seen, and the step then fails with "did not end within 20000ms". This needs timing inside one poll interval of a dev-only harness, and the replacement words cover it ("if no check sees").

### Evidence
None. P0, R1, P1 and M-FLAG were each observed by this gate in a shared hold (check 4), and each matched its prediction.

### Sentences (item 1), blocking, with replacement words (WORDS-ONLY)

**W1.** "PublishPanel re-registers that hook in an effect that re-runs only after the commit of the render in which `filterActive` became true" is untrue as written. The effect also re-runs on `datasetHandle`, `style` and `scope` (PublishPanel.tsx:585).

**W3.** "no assertion of FILTERED' concerns timing" is untrue as written. The diff adds `if (!replaced) throw …20000ms` (:485-487), a check with a time bound, and M-FLAG fails the step on exactly that check.

Closure for W1, W2 and W3: replace header lines 40-43 (from "// After the Apply, …" to "…no assertion of FILTERED' concerns timing.") with these exact lines. Leave the `RECORDED MUTATION` entry and its Observed line byte-unchanged. The section still fits inside the declared 40 lines.

```
// After the Apply, FILTERED' waits until `window.__SPATIAL_E2E__.publishPrepareWithDestination` is not the function it held before the Apply.
// PublishPanel re-registers that hook in an effect keyed on `datasetHandle`, `style`, `filterActive` and `scope`; of these an Apply changes
// `filterActive` alone, so after the Apply the hook is replaced once the render in which `filterActive` became true has committed. That same
// render assigned the `workspaceRef` that `stageScope` reads, so a prepare sent after the replacement holds the post-Apply closure and stages
// the post-Apply scope. The wait checks the hook when the Apply resolves and again after each one-second sleep, while less than 20000ms have
// passed since then; if no check sees the hook replaced, the step fails naming FILTERED', the wait and the 20000ms, so a failing wait lasts at
// least 20000ms and ends with the one-second sleep that crosses that mark. The wait is a precondition on when the prepare is sent, not a property
// under test: FILTERED''s assertions on the prompt, the manifest and the bundle are unchanged, and the wait's own failure says only that the hook
// was not seen replaced within its bound.
```

Clause check against the code at 6bb26b0c:
- **"an effect keyed on `datasetHandle`, `style`, `filterActive` and `scope`":** PublishPanel.tsx:585.
- **"of these an Apply changes `filterActive` alone":**
  - the `filter.apply` transition returns `{ ...view, filter, clauses, clauseCounter }` and keeps `view.style` by reference (src/workspace/viewTransitions.ts:109-114);
  - `style` is `view.style` (App.tsx:849);
  - `datasetHandle` is `admitted.dataset` (App.tsx:2448);
  - `scope` is the panel's own `useState`, set only by `onScopeChange` (PublishPanel.tsx:381, :608);
  - run evidence: with `filterActive` pinned to false (M-FLAG), the hook was not replaced for 20 s.
- **"replaced once the render … has committed":** it is a `useEffect` (passive, after commit), and `registerE2eHook` stores a new arrow (e2e-test-surface.ts:364-367).
- **"That same render assigned the `workspaceRef` that `stageScope` reads":**
  - `workspaceRef.current = workspace` runs in App's render (App.tsx:885-886), the same render that computes `filterActive` (:2450);
  - the `stageScope` prop is `stageExportScope` (:2453), which reads `workspaceRef.current` (:1966).
- **"holds the post-Apply closure and stages the post-Apply scope":** `runPrepareWithDestination` reads the `filterActive` from its render (PublishPanel.tsx:474), and `stageScope()` is called at prepare time (:469).
- **"checks … when the Apply resolves and again after each one-second sleep, while less than 20000ms have passed since then":** publish.mjs:474-479. The deadline is set after the `await` resolves.
- **"if no check sees the hook replaced, the step fails naming FILTERED', the wait and the 20000ms":** :485-486.
- **"lasts at least 20000ms and ends with the one-second sleep that crosses that mark":** :476 and :478. Observed: 20099ms and 20101ms.
- **"assertions on the prompt, the manifest and the bundle are unchanged":** the diff deletes only the doc line and the four-line evaluate (check 2). Lines :494-527 are untouched.
- **"the wait's own failure says only that the hook was not seen replaced within its bound":** the throw's text at :486.

### Documentation (must-fix before the merge)
None beyond the words above.

### Notes (preferences, not conditions)
- The new header lines and doc line 465 run to about 150 columns. The rest of the file wraps near 100.

## Checks

1. **Out-of-scope, first.**
   - `git diff --name-only 391f5934...6bb26b0c` rc=0 lists only `frontends/shell/e2e/publish.mjs`.
   - `git diff --stat 391f5934...HEAD -- frontends/shell/e2e/README.md` is empty, so OPEN-2 (A) holds. No product file changed.
   - §21a: ADR none, security none, wire none, guarantee none. Only harness code changed; FILTERED''s assertions are unchanged and the wait adds a precondition. The single gate applies.
2. **Diff against the Change line.** It matches as described under Correctness. Deleted lines and their replacements:
   - (1) ` * button calls) -> prepare (whole-file scope) -> assert the prompt's `filter_scope` is `null``: the same line with "-> wait until the prepare hook is replaced ->" inserted (:465).
   - (2)-(5) `  const filterOutcome = await page.evaluate(`, `    (predicate) => window.__SPATIAL_E2E__.queryWithFilter(predicate),`, `    "zone = 'residential'"`, `  );`: the fused evaluate (:472-481) plus the new `!replaced` throw (:485-487).
   - No other step, assertion, wait, bound or string changed. `runStep("FILTERED'", 180_000, …)` is untouched at :655.
   - `node --check e2e/publish.mjs` rc=0.
3. **Header and doc comment.**
   - Clause check above: W1, W2 and W3 are untrue; the other clauses are true.
   - `RECORDED MUTATION`, checked by script `<S>/pef-g1r-c3.mjs` (rc=0). The Observed text is byte-equal to the m-flag log's `[FILTERED']` line (126 = 126 bytes, no CR). It names d532cf7d240314e178182263bf935c86fa08acf9, which equals the commit on that log's first line.
4. **Runs by this gate,** on the port-5400 harness, each inside a shared hold in background mode.
   - **Preconditions:**
     - nine harness files equal the packet's sizes and sha256;
     - exe 90920448 B, sha256 b08bc2a9a9a7127981792b5197a8c1e3fce1ba48d5d4746617201a4fc6dcea85;
     - viewer dist (3 files), `viewer-asset-hashes.json` and the shell's `src/generated/NOTICE.txt` present and git-ignored, sizes and hash prefixes equal to the packet's;
     - fixture 409872 B, sha256 92ed800c…2e46;
     - p0 patch sha256 0a3b8899…3888 and p1 patch sha256 5d268d9e…b459, both equal to the packet's;
     - no rebuild, nothing installed.
   - **p0** (detached at 391f5934; `git apply --check` rc=0; applied; diff shown, `M frontends/shell/e2e/publish.mjs`). Exit 1, as predicted.
     - `worktree C:/dev/wt/pef head 391f5934bc960d39be07140ecf3c6d9f0abeab8c start 2026-11-10T01:28:28Z`
     - `[OPEN] PASS (415ms): …`, `[APPROVED'] PASS (2106ms): …`, `[REFUSED'] PASS (32ms): …`, `[EXPIRED'] SKIP: …`
     - `[FILTERED'] FAIL (87ms): FILTERED': execute returned {"status":"refused","message":"[P6 placeholder] The export was not run, because the filter changed after it was prepared. Nothing was written. Prepare it again."}, expected {status:"success"}; prepare-to-execute 12ms`
     - last two lines: `This run launched the app; it stays RUNNING on CDP port 9223 for further interactive use.` then `rc=1 end 2026-11-10T01:28:51Z`
     - app-down: `killed tree 33976`, `killed tree 82728`, `port 9223 free`, `port 5400 free`
     - reverted with `git checkout -- …`, porcelain empty; session log copied (1304 B).
   - **r1** (branch checked out; HEAD 6bb26b0c; porcelain empty). Exit 0, as predicted.
     - `… head 6bb26b0ce94b45b15435638dea9ffea3a9346ab8 start 2026-11-10T01:30:05Z`
     - OPEN PASS (479ms), APPROVED' PASS (2969ms), REFUSED' PASS (44ms), EXPIRED' SKIP
     - `[FILTERED'] PASS (3984ms): filter_scope null under whole-file with the filter on; manifest.operation.filter={"kind":"whole-file"}; bundle rows=2000 == full dataset (2000) both by the manifest's own claim and the reader's independent decode -- the filter did not leak; prepare-to-execute 4ms`
     - last line `rc=0 end 2026-11-10T01:30:22Z`
     - app-down: trees 77672 and 55920 killed, both ports free; session log copied (1584 B).
   - **p1** (`git apply --check -v`: "Hunk #1 succeeded at 469 (offset 5 lines)"; applied; diff shown). Exit 0, as predicted.
     - `… head 6bb26b0c… start 2026-11-10T01:32:08Z`
     - OPEN PASS (473ms), APPROVED' PASS (2723ms), REFUSED' PASS (42ms), EXPIRED' SKIP
     - `[FILTERED'] PASS (3534ms): filter_scope null under whole-file … prepare-to-execute 4ms`
     - `rc=0 end 2026-11-10T01:32:24Z`
     - trees 58800 and 80820 killed, both ports free; session log copied (1528 B); reverted, porcelain empty.
   - **m-flag** (`filterActive={activeFilter !== null}` occurred once and was set to `filterActive={false}`; diff shown, numstat 1 1 App.tsx). Exit 1, as predicted.
     - `… head 6bb26b0c… start 2026-11-10T01:33:20Z`
     - OPEN PASS (529ms), APPROVED' PASS (2794ms), REFUSED' PASS (40ms), EXPIRED' SKIP
     - `[FILTERED'] FAIL (20099ms): FILTERED': the wait for the prepare hook to be replaced after the Apply did not end within 20000ms`
     - `rc=1 end 2026-11-10T01:33:53Z`
     - trees 24448 and 54156 killed, both ports free; session log copied (2480 B); reverted, porcelain empty, the original line back (count 1).
   - No run departed from its prediction. No busy exit, no refused hold, no bind failure.
5. **`npm run verify`** in the shell (shared hold): verify_rc=0. Test Files 109 passed (109), Tests 1446 passed (1446). The last suite reported `ℹ pass 7`, `ℹ fail 0`.
6. **Governance checks** from the worktree root:
   - `node --test` scripts suite (hold): rc=0, tests 598, pass 598, fail 0;
   - `verify-cites`: rc=0, PASS (179 advisory loose references);
   - `verify-quotes` (hold): rc=0, `155 checked, 124 verified, 30 baselined, 1 advisory … 0 ruling-cite errors`;
   - `verify-test-claims`: rc=0, PASS (783 claims);
   - `verify.mjs --offline`: rc=0, PASS.
7. **Size and bytes.**
   - `--numstat`: `26 5 frontends/shell/e2e/publish.mjs`, 31 against the declared 40.
   - Script `<S>/pef-g1r-c7.mjs`: added lines 2263 B, CR 0, TAB 0 (its self-test reads CR 1, TAB 1). The head file has no CR and ends with LF.
8. **The worker's report against its logs** (script `<S>/pef-g1r-c8.mjs`, rc=0): all 30 quoted or claimed items are present in `<H>/out/pef-e2e-{p0,p1,m-flag,r1}.log`.
   - First lines: p0 at 391f5934, p1 and m-flag at d532cf7d, r1 at 6bb26b0c.
   - Each `rc=` line and each step result is as stated.
   - Every down.txt shows both ports free.
   - Every app.err.log has 2 lines, the second `[spatial-ide-shell] data-plane expected origin (config mirror): http://localhost:5180`.
   - Audit-log sizes 2061/3153/2061/3153 B match its scratch copies.
   - No untrue sentence found. The 3427745 B notice size can no longer be checked, because later verify runs regenerated the file (packet §4).
9. **CI.** `gh pr checks 306` rc=0: all 8 checks pass. `gh run view` gives headSha 6bb26b0ce94b45b15435638dea9ffea3a9346ab8 and conclusion success for runs 42731807615 (Ported notices), 42731807388 (DCO sign-off), 42731807911 (Product CI — shell), 42731807304 (Exposure scan), 42728255263 (Product CI — shell, push) and 42728255504 (Ported notices, push). The PR is a draft and OPEN, with head 6bb26b0c.
10. **Porcelain afterwards:** empty. HEAD is 6bb26b0ce94b45b15435638dea9ffea3a9346ab8 on `cut/publish-e2e-filtered-step-shared-run-failure`.

## Harness disclosure
The runs used the port-5400 harness under the human's approval of 2026-10-11, item 1:
- the debug exe with the TAURI_CONFIG overlay (CDP 9223, localhost:5180 mapped to 127.0.0.1:5400);
- Vite on 5400 with `--strictPort`;
- the npx shim on PATH for those runs only;
- port 5180 and `validate` not used; no harness file changed.

Places written:
- `<S>/pef-g1r-*`: scripts, outputs, four audit logs and four session logs;
- `<H>/out/pef-e2e-g1r-{p0,r1,p1,m-flag}.*`, written by the harness;
- the harness's own root-level run files in `<H>` (app/vite logs, shim output, the pids file it creates and removes);
- in the worktree, git-ignored only: `target/e2e-publish-out/`, `frontends/shell/e2e/out/`, the verify-bundle example build, and the products `npm run verify` rebuilds (viewer dist, `viewer-asset-hashes.json`, `src/generated/NOTICE.txt`);
- the app's per-user log folder;
- tracked changes, each reverted: the detached checkout, the two patches, and App.tsx's one line.

## For the human
Nothing needs your ruling. The three sentences are not your wording. All runs stayed on 5400; no word on 5180 had been given (OPEN-5).

## The packet's gaps
- It gave neither the effect's dependency list nor the `filter.apply` transition, both needed for item 1's clause check of the header. I read PublishPanel.tsx:585, viewTransitions.ts:109-114 and App.tsx:849.
- It did not say that `<H>`'s root holds harness-written run files besides the nine scripts.
- It did not give the session-log line's shape on app.err.log (`[spatial-ide-shell] session log: <path>`).

## Hold lines (this project's only, `also=` elided)
- p0: `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:11764 also=… (commands started from now on inherit it; release when done)` / `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:11764 affinity=FF (cores 0-7)`
- r1: the same shape, shell=bash.exe:71108, released.
- p1: shell=bash.exe:78644, released.
- m-flag: shell=bash.exe:9968, released.
- npm run verify: shell=bash.exe:45096, released.
- node --test: shell=bash.exe:76748, released.
- verify-quotes: shell=bash.exe:40752, released.
- No refusals.

## Background shells left
None. All seven background calls (bjqoehf5l, blnqqa96r, b1py9nneu, bx2t3bpq9, brmcam23u, b4w64fy58, b2faetqv0) exited. Afterwards `tasklist` shows no spatial-ide-shell-pef.exe, and nothing listens on 9223 or 5400. I killed nothing by PID; the harness's app-down killed only the trees its app-up started.

Notes on my scripts: `<S>/pef-g1r-sess.sh`'s bracket `[\\/]` was written as `[\/]` after the tool's backslash handling. It still matched, and the shown prefix line and copied byte counts confirm that. My first CR/TAB attempt with `od | grep` was unreliable for the same reason; I replaced it with the node script reported under check 7.

Files: `C:/dev/wt/pef/frontends/shell/e2e/publish.mjs` (header lines 40-43, `stepFiltered` 471-487), `C:/dev/wt/pef/frontends/shell/src/publish/PublishPanel.tsx` (570-585), `C:/dev/wt/pef/frontends/shell/src/workspace/viewTransitions.ts` (109-114).
