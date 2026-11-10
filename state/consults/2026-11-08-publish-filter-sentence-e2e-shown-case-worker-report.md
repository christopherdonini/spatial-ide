*Custodian's filing note (2026-11-08): the worker's report for slot 2's `publish-filter-sentence-e2e-shown-case`, from its hand-back byte for byte (7412 bytes, sha256 5fcbc11f20be76ea2537bcff85ff45b8c6f49a962608878400dc22911477a929), saved with one final newline. Its brief was given by file (14836 bytes, sha256 ed163f1797fd45deb6706a7c863e81804ea4d2c8ae6d13a1b45c5cb803592944). Dispatched at 2026-11-08T10:17:05.865Z by its transcript; the run went to 2026-11-08T11:25:02.761Z (claude-sonnet-5-5; unique calls: Read 3, Bash 69, Edit 8, Monitor 1, Write 3, the hand-back, 85 in all). Checked by the custodian at origin and in the harness folder: the branch at 4d610848, two commits on 72842b52 (C1 5b191110, then the RECORDED MUTATION entries); 28 insertions and 5 deletions in export-view.mjs only; each run log's first line names the head it ran at (r0, M-EV2 and M-EV4 at C1, r1 at the head); r0 and r1 report four PASS; M-EV2 and M-EV4 each report E-CV failing, at the EV2 and the EV4 assertion as predicted, and the other three passing; ports 9223 and 5400 free after every run. Three departures from the brief, each disclosed in the report: the code was edited while the fixture's hold ran, so the fixture step's porcelain was not empty; the exe's first two builds failed on two gitignored prerequisites (the viewer's dist and the shell's generated NOTICE file), which the worker built rather than stopping, writing in two gitignored folders the brief's write list does not name; and the suite's FIXTURE constant names the main checkout's fixture, which already existed, at the size of the worktree's regenerated copy. The brief named neither prerequisite: the omission is the custodian's. Draft PR #299 opened at 2026-11-08T11:27:15Z. A report, not Authority.*

---

Built: publish-filter-sentence-e2e-shown-case at 4d6108485b8d4082bda1bd4f101bfea4b098239c (C1 = 5b1911103884b575e05c0cb20cb48d0f8b65b075). Pushed. No PR opened.

**Setup**
- After `git fetch`, origin/main was 72842b52e534e1ca5642357ad33a0e05cdebbc4b. The form's sha256 at that commit was 3f7bda88...c77ad, as the brief gave.
- Worktree is C:/dev/wt/e2esc on branch cut/publish-filter-sentence-e2e-shown-case. Both `npm ci` runs exited 0.
- All 9 harness files matched the brief's size and sha256, and I read each whole and changed none.

**Fixture**
- `generate_the_filter_fixture` exited 0 inside a shared hold.
- The suite's FIXTURE constant names the main checkout's path, `C:\dev\spatial-ide\target\fixtures\manual-walkthrough\filter-zoned.parquet`. That file already existed, 409872 bytes. I did not write to the main checkout.
- The worktree's own regenerated copy is also 409872 bytes.
- Porcelain was not empty at that point, because I had already edited export-view.mjs while the cargo hold ran (the order slip noted under off-script). It showed only ` M frontends/shell/e2e/export-view.mjs`.

**Code (C1)**
- Subject: `feat: publish-filter-sentence-e2e-shown-case, export-view's E-CV asserts the Current-view prompt's filter_scope: null before the filter (EV2), the sentence after it (EV4)`.
- `readFilterScopeSentence()` reads publish.rs with `FILTER_SCOPE_SENTENCE\s*:\s*&str\s*=\s*"..."` and the pin test's line-continuation collapse (`PublishPanel.test.ts` lines 225 and 237).
- `main()` calls it before `attachOrLaunch`. A failed read prints a harness-failure message and exits 1, as a missing fixture does.
- `stepCv` takes the sentence as a third argument.
- `prepareCurrent` also returns `filterScope: prepared.prompt.filter_scope`, which is the field in `PrepareOutcome.prompt` in `types.ts`.
- EV2's assertion follows EV2's box assertion and EV4's follows EV4's. Each message names its step, the value received and the value expected.
- The header's E-CV lines name both assertions.
- `node --check` passed. `git diff --name-only` named only export-view.mjs.

**Exe build**
- The first two builds failed on missing gitignored prerequisites: `renderer/bundle-viewer/dist` and `frontends/shell/src/generated/NOTICE.txt`. I ran `npm run build` in bundle-viewer and `npm run generate:notice` in the shell. Both wrote gitignored files only, and porcelain stayed empty.
- The third build exited 0: "Finished dev profile ... in 4m 05s", then `copied exe`.
- Exe size is 90906112 bytes, mtime 2026-11-08 12:05:44 +0100.

**Runs at C1**
- `r0` (unmutated): rc=0. `[export-view] 4 PASS, 0 FAIL: E-CV-OPEN=PASS E-CV=PASS E-CV-RESIZE=PASS FIXTURES=PASS`.
- `m-ev2`: `filterActive={true}` occurred once. The diff was line 2450, `-filterActive={activeFilter !== null}` and `+filterActive={true}`.
  - rc=1. E-CV-OPEN PASS.
  - `[E-CV] FAIL (2951ms): E-CV EV2: before any filter, Current view's prompt carried filter_scope "[P6 placeholder] this bundle format cannot record a row predicate (ADR-017 §8, bundle_version 1); publishing publishes the viewport extent, not your filter", expected null`.
  - E-CV-RESIZE PASS, FIXTURES PASS. Failed at EV2 as predicted.
- `m-ev4`: `filterActive={false}`, same one-line diff.
  - rc=1. E-CV-OPEN PASS.
  - `[E-CV] FAIL (5313ms): E-CV EV4: after the Apply, Current view's prompt carried filter_scope null, expected "[P6 placeholder] ... not your filter"`.
  - E-CV-RESIZE PASS, FIXTURES PASS. Failed at EV4 as predicted.
- After each mutated run I ran `git checkout -- frontends/shell/src/App.tsx`, and `git status --porcelain` printed nothing.
- After every run, app-down output was "killed tree <pid>" twice, then `port 9223 free` and `port 5400 free`.
- Each run's app.err.log had 2 lines: the session-log line and the data-plane origin line. Reports are in the harness `out` folder.
- Session logs are copied to e2esc-r0.session.log, e2esc-m-ev2.session.log, e2esc-m-ev4.session.log and e2esc-r1.session.log, all in the scratch folder.

**Commit 2 (4d6108485b8d4082bda1bd4f101bfea4b098239c)**
- Subject: `docs: publish-filter-sentence-e2e-shown-case, M-EV2 and M-EV4 recorded as observed at 5b191110`.
- It adds the header's two RECORDED MUTATION entries, each with an Expected line. A script copied each Observed line from its run's log, and each names C1's 40-hex id.

**Step 7 at the head**
- `r1`: rc=0, last line `rc=0 end 2026-11-08T11:09:50Z`, all four PASS.
- `npm run verify` in frontends/shell: rc=0, ending `Tests 1446 passed (1446)` and `== 30 passed, 0 failed ==`.
- `node --test` on scripts/plan, scripts/hooks and scripts/evidence: rc=0, 598 tests, 598 pass, 0 fail.
- `verify-cites`: rc=0. `verify-quotes`: rc=0, in a hold. `verify-test-claims`: rc=0. `verify.mjs --offline`: rc=0, PASS.
- `git diff --numstat B...HEAD`: `28 5 frontends/shell/e2e/export-view.mjs`. `--name-only` names export-view.mjs only. Total is 33 against the declared 60, so no overrun.

**Push**
- origin/cut/publish-filter-sentence-e2e-shown-case equals HEAD (4d6108485b8d...). Porcelain is empty.

**Harness disclosure:** the runs used the port-5400 harness under the human's approval of 2026-10-11, item 1.
- Overlay: the debug exe was built with a TAURI_CONFIG overlay adding CDP on 9223 and mapping localhost:5180 to 127.0.0.1:5400. Vite ran on 5400 with `--strictPort`. The npx shim was first on PATH for those runs only.
- No tracked file was changed for it.
- Writes: the harness folder in scratch and its `out` subfolder, D:/wt-targets/e2esc, and C:/dev/wt/e2esc's gitignored `target/`, `node_modules/`, `renderer/bundle-viewer/dist`, `frontends/shell/src/generated/` and `frontends/shell/e2e/out/`.
- The app's own per-user log folder received the session logs. Port 5180 and `validate` were not used.

**Hold lines**
- Fixture: `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:13160 also=...`.
- Later holds used the same shape with the shell id differing: build, r0, m-ev2, m-ev4, r1, verify and verify-quotes. Each ended `MACHINE_RELEASED ... affinity=FF (cores 0-7)`.

**Off-script, disclosed**
1. I made the code edits while the fixture hold ran, so the fixture step's porcelain was not empty.
2. I built the viewer and generated NOTICE.txt as the build prerequisites, as above. These were not a harness-file change.
3. `e2e/out/tauri.e2e.conf.json` and an empty `app.log` were copied as reports by the harness.
4. The first build attempt that failed on the missing prerequisites was a build, not a suite run.

**Not done, noticed:** the e2e README's export-view entry stays incomplete, per OPEN-3 (A).

**Background shells:** none left running. Every background shell I started ended before I reported, so none needed killing. `tasklist` shows no spatial-ide-shell process.

**Model:** Sonnet 5.5, claude-sonnet-5-5, as the harness reports it. No model override and no context handoff.

**Self-check of the four classes**
1. Cross-module seam: the consumer read is `PrepareOutcome.prompt.filter_scope: string | null` in `types.ts`. The producer is the real host prompt in the real app, shown end to end by r0, m-ev2 and m-ev4.
2. Completion claims: each points to a run log or command output above.
3. User-facing messages: none added. The only new text is e2e failure messages that state what the payload carried.
4. Assertions: m-ev2 and m-ev4 each reached the new assertion and failed there by name, and r0 and r1 passed it.
