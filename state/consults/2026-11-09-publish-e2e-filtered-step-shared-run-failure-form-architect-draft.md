*Custodian's filing note (2026-11-09): the architect's five-line form draft for slot 2's `publish-e2e-filtered-step-shared-run-failure`, read only at main ac1d1004, from Amendments 11 and 13 of `governance/forms/kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md`. Its brief was given by file (8364 bytes, sha256 8926142ebc9b2beb877e60453befa496ae968302b503ed17d03df865ec870844), with the in-flight paths by git and the reuse index's output byte for byte. Dispatched at 2026-11-09T17:44:13.460Z by its transcript; the run went to 2026-11-09T17:51:49.829Z (claude-opus-5-5; unique calls: Read 32, Grep 28, Glob 2, the hand-back, 63 in all; no errored call). The report below was extracted by script from the hand-back in that transcript (24916 bytes, sha256 f61c8bf2a5d146fdef4a7ab3a7cd51a9ad1675bdeffcc8bb358b18cf71d1b73b) and is unchanged. Every repository path it cites is one its Read calls opened, except four it read through Grep's matched lines (the U12 form, `frontends/shell/package.json`, `frontends/shell/e2e/lib.mjs` and `frontends/shell/src/bootstrap.tsx`) and the form's own path, not yet a file. The custodian checked by script, at ac1d1004: its 7 byte-copied passages, each in the file at the line it names; its reuse block, byte-equal to the brief's; and 17 code lines its finding rests on, each holding what the draft says of it (among them FILTERED''s null check at publish.mjs :476-481, the host's `None` for every scope but the current view with a filter on at publish.rs :134-139, the panel effect's dependency list at PublishPanel.tsx :585 and App.tsx's `filterActive` prop at :2450). One side claim is corrected here and changes no line of the form: lib.mjs :37 holds the suite's `http://localhost:5180` URL prefix; the mapping of that address to 127.0.0.1:5400 is the harness's TAURI_CONFIG overlay, as item 1 of the human's approval of 2026-10-11 describes it (`state/directives/2026-10-11-harness-approval-open-9-i-withdrawn-a10-late-cancel-adr-029.md`), not lib.mjs's (its note 4). Its OPEN-1 (A), OPEN-3 (B), OPEN-4 (A) and OPEN-6 (A) are taken under item 4 of 2026-10-31, held to 2026-11-16; its OPEN-2 and OPEN-5, red lines by its reading, are put to the human. A draft, not Authority: the form is committed in the same commit (`governance/forms/frontends/PUBLISH-E2E-FILTERED-STEP-SHARED-RUN-FAILURE-PREREGISTRATION.md`).*

---

Draft: publish-e2e-filtered-step-shared-run-failure, five-line form, architect

Read at: main @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067. The session's git snapshot gave that commit as HEAD with a clean tracked tree. I have no shell, so I could not confirm HEAD myself and I give no sha256 anywhere in this report. Every pin below is `path:line @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067`, and the custodian expands each by script. All of the text below is mine unless it is marked as byte-copied. Every byte-copied passage was copied from the Read tool's output, not by script.

**Short answer:** the failure recorded at 147ef82c cannot recur at main. Since U12, FILTERED' expects `filter_scope` to be `null` under whole-file, and the host returns `None` under whole-file whatever the filter flag says. The stale-closure mechanism the custodian describes does exist in the code. At main it is harmless to FILTERED'. The code shows a second, earlier window, which would fail at the execute step instead. The smallest change is harness-side: one file, about 25 lines. It is gated on a deterministic probe that runs at the base before any code, and that probe is a STOP if it passes.

---

## The form (five-line, `governance/AUTONOMY.md` §21d)

Path: `governance/forms/frontends/PUBLISH-E2E-FILTERED-STEP-SHARED-RUN-FAILURE-PREREGISTRATION.md`. The template does not name a path (docs/PREREGISTRATION-TEMPLATE.md:146-161 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067). The precedent's form sits at governance/forms/frontends/, so this one goes there too.

```
Authority: PLAN node `publish-e2e-filtered-step-shared-run-failure` (governance/PLAN.yaml:5776-5792 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067), generation 1; the human's placement, slot 2, five-line form (state/directives/2026-11-09-item-4-to-11-16-12c-open-a-d-taken-slot-2-order-pr-b-slot-1-availability-monday-list.md:11 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067); its source, governance/forms/kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md, Amendments 11 and 13, item 1 of each, by section; the human's gate-round rulings, Part 1, items 1 to 9, by reference (state/directives/2026-11-05-main-architect-gate-rounds-part-1-rulings-review-packet-design-part-3-additions.md:28-64 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067); e2e runs under the human's port-5400 harness approval of 2026-10-11, item 1 (state/directives/2026-10-11-harness-approval-open-9-i-withdrawn-a10-late-cancel-adr-029.md:6-10 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067), subject to OPEN-5; non-red-line OPEN items under the direction of 2026-10-31, item 4, held to 2026-11-16 (state/directives/2026-11-09-item-4-to-11-16-12c-open-a-d-taken-slot-2-order-pr-b-slot-1-availability-monday-list.md:9 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067); gating per OPEN-6; the reuse index found no prior art on either search (react effect stale state hook registration; e2e flaky race filter prepare), a miss noted here.
Scope: 1 file: frontends/shell/e2e/publish.mjs; declared line budget 40, insertions plus deletions, comments counted (governance/AUTONOMY.md:357 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067); this form exempt; frontends/shell/src/App.tsx (M-FLAG) and publish.mjs's FILTERED' (the fused probes P0, P1) are edited and reverted for observations and never committed; PublishPanel.tsx, e2e-test-surface.ts, client.ts, App.tsx, workspace/scope.ts, publish.rs, commands.rs, e2e/README.md, MANUAL-WALKTHROUGH.md, KNOWN-LIMITATIONS.md and every other e2e suite are read, not changed (e2e/README.md only under OPEN-2 (B), by the human's ruling); no other file changes.
Change: FILTERED' sends its prepare only after `window.__SPATIAL_E2E__.publishPrepareWithDestination` has been replaced following the Apply — the hook identity captured before `queryWithFilter` and polled, inside the same page call, until it differs (the PublishPanel effect re-run that follows the commit in which `filterActive` became true, frontends/shell/src/publish/PublishPanel.tsx:570-585 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067), with a hard timeout that fails the step by name; every other step, assertion, wait and bound is unchanged.
Tests+mutation: FILTERED' (changed); M-FLAG: App.tsx's `filterActive={activeFilter !== null}` (frontends/shell/src/App.tsx:2450 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067) set to `filterActive={false}`, predicted `[FILTERED'] FAIL` at the new wait's timeout message, with OPEN, APPROVED' and REFUSED' PASS and EXPIRED' SKIP; reproducer, before any code: P0 at the base, FILTERED' with `queryWithFilter` and the prepare fused into one page call (worktree edit, reverted), predicted `[FILTERED'] FAIL` at the execute with the scope-changed refusal naming "the filter" (PublishPanel.tsx:46-58 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067), and P0 passing is a STOP (OPEN-1); P1 at the head, the same fusion with the new wait between, predicted PASS; R1 unmutated at the head, exit 0; M-FLAG's failure recorded by name in a `RECORDED MUTATION` entry of the file's header with the 40-hex commit it was observed at, then reverted and the worktree shown clean; a verify-mutation run is not an observation; mutation observations are the gate's own (Part 1, item 9); a mutation that passes, any other step failing, or R1 failing is a stop; every run on Windows on the port-5400 harness, inside `hold shared -Project SpatialIDE`, the app's stderr, the suite's report and the app's session log copied right after each run; no retry is added; the e2e does not run on CI.
Out-of-scope: ADR: none (ADR-017 §8 and ADR-024 unchanged); security: none (no exposure surface, no dependency; the dev destination seam, `#[cfg(debug_assertions)]`, and the class-3 approval unchanged); wire: none (`PublishPromptData` is binding-local, nothing under protocol/); guarantee: none (FILTERED' asserts the same properties as before: `filter_scope` null under whole-file, `operation.filter` whole-file, 2 000 rows by manifest and by reader; the wait is a precondition on harness timing, and PublishPanel's staged-scope check, frontends/shell/src/publish/PublishPanel.tsx:513-523 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067, is unchanged); no string the app shows is added or changed.
```

---

## Notes (mine)

**1. The failure as recorded (settle 1).**

Byte-copied from governance/forms/kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:907 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067 (Amendment 11, item 1, a sub-line span):
> the suite exited 1 on FILTERED', whose prompt carried no `filter_scope` sentence after a filter was applied. That step passed at 2fc01f59, and the head changes a doc comment only. A timing-sensitive failure in a shared run is not recorded as a failure (the machine rule): the custodian re-runs the suite alone. The custodian's reading, not a finding: the suite's prepare hook may still hold the filter state from before the filter applied, as React re-registers it after the change.

The head (same line): `R1 at 147ef82c7d14b537b5c3fc51673090c9b082a1f5`. The shared run, from Amendment 11's heading (:903): `R1 at 147ef82c stopped on FILTERED' in a shared run`.

Byte-copied from :926 (Amendment 13, item 1, two sub-line spans):
> **R1 at 50c634a85e0486bba0d7bff425defd91fcbab788:** as Amendment 8 item 1 predicts. APPROVED', REFUSED' and FILTERED' pass;

> FILTERED''s one failure at 147ef82c did not recur, so the solo re-run of Amendment 11 item 1 is not owed; the failure is routed to the proposed node `publish-e2e-filtered-step-shared-run-failure`.

The run's own output, byte-copied from state/consults/2026-10-23-bundle-redaction-scan-not-in-product-publish-r1-tester-report-3.md:34-36 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067:
```
   - [FILTERED'] FAIL (111ms): FILTERED': filter_scope mismatch.
   - Expected: this bundle format cannot record a row predicate (ADR-017 §8, bundle_version 1); publishing publishes the viewport extent, not your filter
   - Actual:   null
```
The same report says the suite ran "under a second shared hold" (:29).

**Outside the repository.** The run's full suite log, app stderr, session log and audit log were copied only to the tester's scratch folder (rds-r1c-*, :46-49) and are not in the repository. To test the reading against the run itself I would have needed:
- the suite log around FILTERED', including the console-handle lines;
- the session log's lines for the Apply and the prepare, with their timestamps;
- any record of when the PublishPanel effect re-ran. No instrument records that, so no run output could settle the mechanism. Note 4 is how the probe settles it instead.

**What the code at main shows.**

- **(i) The recorded assertion is gone.** At main, FILTERED' asserts `filter_scope === null` under whole-file (frontends/shell/e2e/publish.mjs:476-481 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067). The host returns `None` for `WholeFile` whatever `filter_active` is (frontends/shell/src-tauri/src/publish.rs:134-139 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067; its test at :2064-2081). U12 changed this: its form names e2e FILTERED' as asserting the sentence under whole-file (governance/forms/frontends/PUBLISH-FILTER-SENTENCE-UNDER-WHOLE-DATASET-PREREGISTRATION.md:24 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067) and lists the FILTERED' header among its edits (:67). The failure line above expects the sentence without the `[P6 placeholder] ` prefix, which is the text from before U12. **So the recorded failure cannot recur at main, by any mechanism.**

- **(ii) The custodian's mechanism exists, in part, as a code fact.**
  - `applyFilter` commits the filter (`deps.commitActiveFilter`) and returns `applied` in the same synchronous run (frontends/shell/src/App.tsx:391-394 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067).
  - The commit only writes a ref and dispatches `view.transition` (App.tsx:1018-1027 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067). `filterActive` is `activeFilter !== null` (App.tsx:2450), and `activeFilter` is `view.filter` (App.tsx:866 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067). Both are render-time state.
  - `runPrepareWithDestination` reads the `filterActive` that its closure captured (PublishPanel.tsx:455-481 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067, :474).
  - The hook is re-registered only by a `useEffect` whose dependencies include `filterActive` (PublishPanel.tsx:570-585). `registerE2eHook` stores each new arrow, so the hook's identity changes at each re-registration (frontends/shell/src/e2e-test-surface.ts:360-368 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067).
  - So between the dispatch and that effect, the registered hook holds the earlier `filterActive`. Under 147ef82c's assertion, a prepare in that window gives exactly the recorded `null`.
  - That the window was hit in that run is **not shown**, either by the code or by any record in the repository. The step passed at 2fc01f59 and at 50c634a8, and Amendment 11 says the head changed only a doc comment. A deterministic cause would therefore have failed every run, so the cause is timing- or state-dependent. That is consistent with this reading, but it does not prove it.

- **(iii) A second mechanism, which matters at main.**
  - `stageScope` reads `workspaceRef.current` (App.tsx:1965-1967 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067). That ref is assigned during App's render (App.tsx:885-886 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067).
  - The execute re-resolves the scope and refuses when `filterAsApplied` differs (PublishPanel.tsx:513-515; frontends/shell/src/workspace/scope.ts:46-57, :74-85 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067).
  - A prepare sent **before App re-renders** after the Apply therefore stages the pre-filter scope. Its execute, which runs after the render, returns the refused outcome `[P6 placeholder] The export was not run, because the filter changed after it was prepared. …` (PublishPanel.tsx:55-58). FILTERED' then fails at publish.mjs:491-493, not at `filter_scope`.
  - A prepare that lands **after App's render but before the panel's effect** (window (ii)) causes no failure at main: under whole-file the flag is ignored, and the staged scope is current.
  - Whether a prepare sent through a CDP round trip can land before React's render depends on how React 18 schedules this update and how WebView2 orders its tasks. That is React and Chromium behaviour that no code in this repository shows (createRoot under StrictMode, frontends/shell/src/bootstrap.tsx:25-29; react ^18.3.1, frontends/shell/package.json:57-58 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067).
  - My reading, unverified: if the Tauri IPC response's continuation dispatches at default priority, the render runs in a later task than that continuation's microtasks. If it dispatches at discrete/sync priority, React renders, commits and flushes passive effects inside the microtask checkpoint, and neither window exists. The P0 probe (note 4) decides which holds.

- **(iv) Considered and excluded.**
  - Both arms' `commitActiveFilter` guards skip the commit only when the admitted dataset has changed (App.tsx:1685-1688, :1846-1849 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067). The suite opens one dataset.
  - `commitFilterChange` skips the dispatch when `viewIdRef` is null (App.tsx:1021-1022). That would fail every run, not one.
  - Neither explains a single failure in three runs.

**2. The change (settle 2): harness-side.**
- In `stepFiltered` (publish.mjs:459-466 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067), one `page.evaluate`:
  1. captures `window.__SPATIAL_E2E__.publishPrepareWithDestination`;
  2. awaits `queryWithFilter(predicate)`;
  3. if the outcome is `applied`, polls until the hook's identity differs from the captured one, with a hard timeout (20 000 ms, as `waitForHook`'s default at publish.mjs:148);
  4. returns the outcome and whether the hook was replaced. On timeout the step throws a message that names FILTERED', the wait and the bound.
- The existing `applied` check (:464-466) is unchanged.
- Why this signal: the effect re-runs only after the commit of the render in which `filterActive` became true. That same render assigned `workspaceRef` (App.tsx:885-886). Replacement therefore means that both what the prepare's closure holds and what `stageScope` reads are post-Apply, which closes windows (ii) and (iii).
- Touches: frontends/shell/e2e/publish.mjs only: `stepFiltered`, its doc comment (:451-458), and the file header's new `RECORDED MUTATION` entry. Nothing the real FilterPanel or PublishPanel does for a user changes.
- Why not product-side: making the seam read `filterActive` from a render-time ref would close (ii) but not (iii). `workspaceRef` is render-time too, so only a change to when `applied` resolves relative to the commit (for example `flushSync` in `commitFilterChange`) would close (iii). That changes the real Apply path, which is outside the dev-only seam, and I do not propose it.
- Sentences: under Part 1, item 1, the worker writes the header and doc-comment sentences from the built code. They must cover: what the wait waits on and why that is the state the prepare reads; the timeout and what its failure names; that the wait is a precondition and not a property; M-FLAG's entry with its commit.

**3. The route (settle 3).**
- Files: 1. Lines: my estimate is about 20 to 30, not a count:
  - the fused evaluate replacing :460-463 (about 12 to 14 added, 4 removed);
  - the doc comment (about 3 to 5);
  - the `RECORDED MUTATION` entry (about 3 to 5).
  - Declared 40.
- §21a (governance/AUTONOMY.md:315-332 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067): none of the four categories is touched.
  - On "any property currently under test" (:325-327): every assertion FILTERED' makes is unchanged. The wait adds a precondition under which the step now also fails when the Apply does not reach the panel. That is coverage of a property export-view's EV4 already asserts, not a change to a property.
  - Round 25, item 2 (e) does not close the five-line form (governance/AUTONOMY.md:482 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067).
- §21c's four bounds (:350-351 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067) all hold: lines well under 150, 1 file of 8, no exposure surface or dependency, no user-visible behaviour.
- §21b: the single reviewer gate is open (:336-337 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067). See OPEN-6.
- §36 (:687-692 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067) does not apply: this is a slot 2 piece, not a filler.
- Budget, 45 minutes:
  - The code change fits.
  - The evidence does not, by my estimate. It needs a debug exe (12m 01s at 147ef82c, tester-report-3:28) and four or five suite runs (P0, R1, P1, M-FLAG), plus the reviewer's re-observation. I flag this; I do not trim Scope to fit.

**4. The evidence (settle 4).** Every run is on the port-5400 harness, under the 2026-10-11 approval, item 1:
- a debug exe with the TAURI_CONFIG overlay: CDP on 9223 (frontends/shell/e2e/lib.mjs:33 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067), localhost:5180 mapped to 127.0.0.1:5400 (lib.mjs:37);
- Vite on 5400 with `--strictPort`, and the npx shim on PATH for those runs only;
- each run in one Bash call inside `hold shared -Project SpatialIDE`, running `npm run e2e:publish` in frontends/shell (package.json:32 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067) through the harness's run-suite script with a hard `timeout`;
- `SPATIAL_IDE_AUDIT_LOG` set to a scratch path;
- port 5180 and `validate` never used.

The app and Vite are relaunched for each run, so Vite serves the App.tsx on disk.
- **P0, the reproducer, at the base, before any code.** FILTERED' edited so that `queryWithFilter` and `publishPrepareWithDestination(d, "whole")` run in one page call, with no round trip between them. Predicted: exit 1, with `[FILTERED'] FAIL` at the execute, `{"status":"refused","message":"[P6 placeholder] The export was not run, because the filter changed after it was prepared. …"}`, and OPEN, APPROVED' and REFUSED' PASS. Deterministic under my reading of note 1 (iii): a microtask continuation always runs before a later task. **If P0 passes, STOP** (OPEN-1). Reverted, porcelain shown empty.
- **R1 at the head, unmutated.** Exit 0: OPEN, APPROVED', REFUSED' and FILTERED' PASS, EXPIRED' SKIP.
- **P1 at the head.** P0's fusion with the new wait between the Apply and the prepare. Predicted exit 0. P0 failing and P1 passing is the evidence that the wait closes the window. Reverted.
- **M-FLAG at the head.** App.tsx:2450 set to `filterActive={false}`. Predicted exit 1, with `[FILTERED'] FAIL` at the wait's timeout message and the other steps as in R1. The hook's dependency list (PublishPanel.tsx:585) also holds `style` and `scope`; neither changes on an Apply. If M-FLAG passes, it is a stop: the signal is not specific. Reverted.
- **Unit tests that reach the change:** none. The change is harness-only. client.test.ts:133-143 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067 reaches `publishPrepareWithDestination`'s recording and is unaffected.
- **Readiness** (Part 1, item 4), at the head before the gate, each with its exit code:
  - `npm run verify` in frontends/shell, in a shared hold: exit 0;
  - the scripts' `node --test`: exit 0;
  - `verify:plan`, `verify:cites` and `verify:quotes`: each exit 0;
  - R1 above.
  - A fresh worktree runs `npm ci` in frontends/shell and in renderer/bundle-viewer.

**5. What must not change (settle 5).**
- In publish.mjs: every other step (OPEN, APPROVED', REFUSED', EXPIRED'), every assertion of FILTERED' after the Apply, `waitForHook`, `pairEvaluate`'s use, every bound (:611-634), `main()`.
- Product: PublishPanel.tsx, App.tsx (M-FLAG is never committed), e2e-test-surface.ts, client.ts, scope.ts, publish.rs, commands.rs.
- Documents: e2e/README.md (OPEN-2), MANUAL-WALKTHROUGH.md and KNOWN-LIMITATIONS.md. Neither of the last two names a FILTERED' timing.
- Rule (00) (governance/AUTONOMY.md:606-610 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067), against the brief's lists:
  - #304 touches commands.rs and publish.rs under src-tauri, which is disjoint from this piece. The node depends on it.
  - port-2, 1c and B1 shell half C touch none of these paths.
  - #303 is kernel/tests only.
  - protocol/: none.
  - App.tsx is outside the brief's filter. It is mutated and never committed, so it claims no path. The custodian rechecks at dispatch.
- Siblings: only console.mjs (:492, the refused path, no prepare after it) and selection.mjs (:558-561, :888-893, a prepare with no Apply before it) use these seams outside publish.mjs and export-view.mjs. Neither prepares right after an Apply. export-view's EV4 waits for residency and settle first.

**Constitution check.** No violations.
- docs/01: evidence-only.
- ADR-006: class 3 untouched; each execute is the existing approval path.
- docs/08: no number; the 20 s is a bound, not a measurement.
- docs/02 and docs/10: binding-local, no MCP, no bulk data.
- docs/07: prototype slice.
- Seam rule: the consumer read is the real `E2eTestSurface.publishPrepareWithDestination` (e2e-test-surface.ts:171-174 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067). No `pub` item, callback or option is added.

---

## OPEN items

**OPEN-1. If P0 passes at the base.** Not a red line.
- (A) STOP before any code. The custodian records a class 1 amendment: the recorded failure cannot recur at main (note 1 (i)), and the window is not reachable even with no round trip. The node closes on that record with no code. This is the piece's smallest true form. It establishes that the routed failure is moot at main.
- (B) Land the wait anyway, as a defence.
- **Recommend (A).** A wait for a window the code does not show does not meet the node's "the smallest change that the code at main shows removes its cause".

**OPEN-2. e2e/README.md's FILTERED' passage (frontends/shell/e2e/README.md:206-212 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067).** **Red line by my reading:** adding a file the node does not name changes the scope of a ruled item. This follows the precedent's OPEN-3.
- (A) Not edited. The passage stays true but incomplete; the wait is described in the file's own doc comment.
- (B) Edited, as a second file of about 2 lines.
- **Recommend (A),** with (B) put to the human as a one-line question.

**OPEN-3. The poll's cadence.** Not a red line.
- §37 (governance/AUTONOMY.md:698-703 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067) binds agents' wait loops. I read it as not reaching a suite's in-page poll, but a gate may read it otherwise.
- (A) 200 ms, as `waitForHook`.
- (B) At least 1 s per turn, with the 20 s hard timeout. This costs at most about 1 s in a 180 s step.
- **Recommend (B):** it costs nothing measurable and leaves no reading to dispute.

**OPEN-4. Observation of the probes.** Not a red line.
- (A) The reviewer re-observes P0 (at the base), P1 and M-FLAG itself, inside a shared hold (Part 1, item 9).
- (B) The worker's runs only, with the reviewer reading the evidence.
- **Recommend (A),** with (B) as its fallback, as in the precedent's OPEN-4.

**OPEN-5. The harness's term.** **Red line by my reading:** it is the term of the human's approval, and ports are the human's.
- The 5400 approval holds "until port 5180 is free again". Port 5180 is on the human's list for today (2026-11-09 directive, :17).
- (A) The runs go on the 5400 harness while the approval holds. If 5180 is freed before they run, the runs wait for the human's word on the port.
- (B) Ask now.
- **Recommend (A).**

**OPEN-6. Gates.** Not a red line.
- (A) A single reviewer gate under §21b.
- (B) The reviewer and the architect.
- **Recommend (A):** no §21a category is touched and all four bounds hold.

---

## The reuse index (as given in the brief, byte for byte; the misses are noted in Authority)

```text
$ node tools/reuse.mjs react effect stale state hook registration   (exit 1)
No prior art recorded for "react effect stale state hook registration". Research it before planning an implementation.
$ node tools/reuse.mjs e2e flaky race filter prepare   (exit 1)
No prior art recorded for "e2e flaky race filter prepare". Research it before planning an implementation.
```

---

## What I could not settle

- **HEAD and hashes.** I could not confirm HEAD is ac1d1004, and I give no sha256 (no shell).
- **Whether either window was hit at 147ef82c.** The run's logs are outside the repository, and no instrument records when the effect re-ran.
- **React and WebView2 scheduling** (note 1 (iii)). This is my reading of libraries outside this repository's code. P0 decides it.
- **Whether a CDP round trip can land in window (iii) in the real suite.** P0 removes the round trip and so does not show this. The claim is limited to "the step no longer prepares before the post-Apply re-registration".
- **The line count** is an estimate. **The 45-minute budget** fits the code, not the runs, by my estimate.
- **OPEN-2 and OPEN-5** wait for the human.
- **Background shells:** I leave none; I had no shell.
