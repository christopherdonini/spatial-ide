# shell e2e: the publish suite's FILTERED' step, its one failure in a shared run at 147ef82c, tested against the code at main — a reproducer at the base first, then a harness-side wait for the prepare hook's post-Apply re-registration, five-line short form (`AUTONOMY.md` §21d)

*Committed before any code. Append-only once committed; an amendment written after any run of this piece's checks has been seen says so in its first line. PLAN node publish-e2e-filtered-step-shared-run-failure, slot 2, placed by the human's message of 2026-11-09 (`state/directives/2026-11-09-item-4-to-11-16-12c-open-a-d-taken-slot-2-order-pr-b-slot-1-availability-monday-list.md`, line 11). The short answer, the five lines, the notes, the OPEN items, the reuse index and what is not settled are the architect's draft (`state/consults/2026-11-09-publish-e2e-filtered-step-shared-run-failure-form-architect-draft.md`, read only at main ac1d1004; extracted sha256 f61c8bf2a5d146fdef4a7ab3a7cd51a9ad1675bdeffcc8bb358b18cf71d1b73b), carried byte for byte from its short answer on, with these changes, all the custodian's: each cite the draft writes `path:line @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067` expanded by script to `path:line @ <commit> sha256:<the lines with their LFs>` (31 pins; 8 by a file name that resolves to one tracked path at that commit; 2 by a file name that resolves to more than one, kept as written; 1 kept as written, the tester report's :34-36, whose reproduction is a fenced block, which `verify-quotes` does not read, its bytes checked by the custodian's script instead (the filing note); bare line numbers kept as written, the 5 that carry the commit among them); this title and lead line added; the draft's opening lines (its draft line and its read note) dropped; the custodian's settlement added. Form path: `governance/forms/frontends/PUBLISH-E2E-FILTERED-STEP-SHARED-RUN-FAILURE-PREREGISTRATION.md`. The custodian keeps the PLAN node on main.*

**Short answer:** the failure recorded at 147ef82c cannot recur at main. Since U12, FILTERED' expects `filter_scope` to be `null` under whole-file, and the host returns `None` under whole-file whatever the filter flag says. The stale-closure mechanism the custodian describes does exist in the code. At main it is harmless to FILTERED'. The code shows a second, earlier window, which would fail at the execute step instead. The smallest change is harness-side: one file, about 25 lines. It is gated on a deterministic probe that runs at the base before any code, and that probe is a STOP if it passes.

---

## The form (five-line, `governance/AUTONOMY.md` §21d)

Path: `governance/forms/frontends/PUBLISH-E2E-FILTERED-STEP-SHARED-RUN-FAILURE-PREREGISTRATION.md`. The template does not name a path (docs/PREREGISTRATION-TEMPLATE.md:146-161 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067 sha256:1fa3a0a1f684962d334dae85179ee13ea533c0e2adb45a2a3e83f3cf4f157031). The precedent's form sits at governance/forms/frontends/, so this one goes there too.

```
Authority: PLAN node `publish-e2e-filtered-step-shared-run-failure` (governance/PLAN.yaml:5776-5792 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067 sha256:1ea9365fbe818f26ea9632336d07cadb8348e80ff6f3616aa8e768cb66e86a91), generation 1; the human's placement, slot 2, five-line form (state/directives/2026-11-09-item-4-to-11-16-12c-open-a-d-taken-slot-2-order-pr-b-slot-1-availability-monday-list.md:11 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067 sha256:a8d065a9ea15b39fbb4257a92e8c53ae96ecac134576c17d07b2b27879a2cb72); its source, governance/forms/kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md, Amendments 11 and 13, item 1 of each, by section; the human's gate-round rulings, Part 1, items 1 to 9, by reference (state/directives/2026-11-05-main-architect-gate-rounds-part-1-rulings-review-packet-design-part-3-additions.md:28-64 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067 sha256:b7b9954b95c6a23808cc8a2fbacb8b6157335e23da53ccda20f4a35ba8e05e8a); e2e runs under the human's port-5400 harness approval of 2026-10-11, item 1 (state/directives/2026-10-11-harness-approval-open-9-i-withdrawn-a10-late-cancel-adr-029.md:6-10 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067 sha256:99a0e4c3f7c9278ef1871b5222638b97b46d6a6dce7f11718f3ea54b2f48fb84), subject to OPEN-5; non-red-line OPEN items under the direction of 2026-10-31, item 4, held to 2026-11-16 (state/directives/2026-11-09-item-4-to-11-16-12c-open-a-d-taken-slot-2-order-pr-b-slot-1-availability-monday-list.md:9 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067 sha256:4331532d442d213e307e19d7866d8d0ede449b81592563a8c378a9e8446912a1); gating per OPEN-6; the reuse index found no prior art on either search (react effect stale state hook registration; e2e flaky race filter prepare), a miss noted here.
Scope: 1 file: frontends/shell/e2e/publish.mjs; declared line budget 40, insertions plus deletions, comments counted (governance/AUTONOMY.md:357 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067 sha256:367596df34a73d122765d000ba5df601dbe54da9e5a6aefca966747809a44fec); this form exempt; frontends/shell/src/App.tsx (M-FLAG) and publish.mjs's FILTERED' (the fused probes P0, P1) are edited and reverted for observations and never committed; PublishPanel.tsx, e2e-test-surface.ts, client.ts, App.tsx, workspace/scope.ts, publish.rs, commands.rs, e2e/README.md, MANUAL-WALKTHROUGH.md, KNOWN-LIMITATIONS.md and every other e2e suite are read, not changed (e2e/README.md only under OPEN-2 (B), by the human's ruling); no other file changes.
Change: FILTERED' sends its prepare only after `window.__SPATIAL_E2E__.publishPrepareWithDestination` has been replaced following the Apply — the hook identity captured before `queryWithFilter` and polled, inside the same page call, until it differs (the PublishPanel effect re-run that follows the commit in which `filterActive` became true, frontends/shell/src/publish/PublishPanel.tsx:570-585 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067 sha256:fd93992c0c12095a537e79e62f46986961cefe49d6bdc0a460ae8ba9806a58c4), with a hard timeout that fails the step by name; every other step, assertion, wait and bound is unchanged.
Tests+mutation: FILTERED' (changed); M-FLAG: App.tsx's `filterActive={activeFilter !== null}` (frontends/shell/src/App.tsx:2450 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067 sha256:a16f19bf69eba1dedb36b3805ee584ef93371b20a23a17b98c17c322851eb1b3) set to `filterActive={false}`, predicted `[FILTERED'] FAIL` at the new wait's timeout message, with OPEN, APPROVED' and REFUSED' PASS and EXPIRED' SKIP; reproducer, before any code: P0 at the base, FILTERED' with `queryWithFilter` and the prepare fused into one page call (worktree edit, reverted), predicted `[FILTERED'] FAIL` at the execute with the scope-changed refusal naming "the filter" (PublishPanel.tsx:46-58 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067 sha256:aad33dddc7bd2b4fba7eb309e0c0a833536de685937ec56c0aaf52cd719a93d0), and P0 passing is a STOP (OPEN-1); P1 at the head, the same fusion with the new wait between, predicted PASS; R1 unmutated at the head, exit 0; M-FLAG's failure recorded by name in a `RECORDED MUTATION` entry of the file's header with the 40-hex commit it was observed at, then reverted and the worktree shown clean; a verify-mutation run is not an observation; mutation observations are the gate's own (Part 1, item 9); a mutation that passes, any other step failing, or R1 failing is a stop; every run on Windows on the port-5400 harness, inside `hold shared -Project SpatialIDE`, the app's stderr, the suite's report and the app's session log copied right after each run; no retry is added; the e2e does not run on CI.
Out-of-scope: ADR: none (ADR-017 §8 and ADR-024 unchanged); security: none (no exposure surface, no dependency; the dev destination seam, `#[cfg(debug_assertions)]`, and the class-3 approval unchanged); wire: none (`PublishPromptData` is binding-local, nothing under protocol/); guarantee: none (FILTERED' asserts the same properties as before: `filter_scope` null under whole-file, `operation.filter` whole-file, 2 000 rows by manifest and by reader; the wait is a precondition on harness timing, and PublishPanel's staged-scope check, frontends/shell/src/publish/PublishPanel.tsx:513-523 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067 sha256:877a8dd1e73c4501d3141b79930a71fca498776e7e28386c06d8266d3fd83292, is unchanged); no string the app shows is added or changed.
```

---

## Notes (mine)

**1. The failure as recorded (settle 1).**

Byte-copied from governance/forms/kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:907 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067 sha256:2aaca50e14f863a68c269f8c595ae3e53897e2b44f34d8e25c3d94b64923fff0 (Amendment 11, item 1, a sub-line span):
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

- **(i) The recorded assertion is gone.** At main, FILTERED' asserts `filter_scope === null` under whole-file (frontends/shell/e2e/publish.mjs:476-481 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067 sha256:1bf20de5bf9b3e163fd92531da67110c83b29153df13f182a1c96f2407b5e900). The host returns `None` for `WholeFile` whatever `filter_active` is (frontends/shell/src-tauri/src/publish.rs:134-139 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067 sha256:5ed8e2c4e2b3aca7f20ad6b3f523658052cd174eaf3716ebea8eba7f7cb1a118; its test at :2064-2081). U12 changed this: its form names e2e FILTERED' as asserting the sentence under whole-file (governance/forms/frontends/PUBLISH-FILTER-SENTENCE-UNDER-WHOLE-DATASET-PREREGISTRATION.md:24 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067 sha256:d0af67edaf7449125542c72f92189172d360d0ae4ed1f9b3a6d85b15114e759b) and lists the FILTERED' header among its edits (:67). The failure line above expects the sentence without the `[P6 placeholder] ` prefix, which is the text from before U12. **So the recorded failure cannot recur at main, by any mechanism.**

- **(ii) The custodian's mechanism exists, in part, as a code fact.**
  - `applyFilter` commits the filter (`deps.commitActiveFilter`) and returns `applied` in the same synchronous run (frontends/shell/src/App.tsx:391-394 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067 sha256:bad32db5eed05cc63902ad10547a37afcf405faa1a4070f4022b44ed2e29bce4).
  - The commit only writes a ref and dispatches `view.transition` (App.tsx:1018-1027 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067 sha256:c4c0da5a938ad0fb612da7e84f8cc7e4de95d2207c1f09c2d752533bc51b4512). `filterActive` is `activeFilter !== null` (App.tsx:2450), and `activeFilter` is `view.filter` (App.tsx:866 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067 sha256:a400e483fc84063be6c8ad223c0dd0e90331ee1d79c15f954296a4b8f9830c54). Both are render-time state.
  - `runPrepareWithDestination` reads the `filterActive` that its closure captured (PublishPanel.tsx:455-481 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067 sha256:e4b535379a915d1e6bbc747770a67e3b118650d640ab004d1973dc0a1feb5e6c, :474).
  - The hook is re-registered only by a `useEffect` whose dependencies include `filterActive` (PublishPanel.tsx:570-585). `registerE2eHook` stores each new arrow, so the hook's identity changes at each re-registration (frontends/shell/src/e2e-test-surface.ts:360-368 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067 sha256:fb08c9186b54bf8d8102e929c67481e1cd05a0b65ad24f952ca705284d4727c4).
  - So between the dispatch and that effect, the registered hook holds the earlier `filterActive`. Under 147ef82c's assertion, a prepare in that window gives exactly the recorded `null`.
  - That the window was hit in that run is **not shown**, either by the code or by any record in the repository. The step passed at 2fc01f59 and at 50c634a8, and Amendment 11 says the head changed only a doc comment. A deterministic cause would therefore have failed every run, so the cause is timing- or state-dependent. That is consistent with this reading, but it does not prove it.

- **(iii) A second mechanism, which matters at main.**
  - `stageScope` reads `workspaceRef.current` (App.tsx:1965-1967 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067 sha256:f40f48b6844d998b288a4676e64f60258cd04a8c803ea66531dfe2eac3006509). That ref is assigned during App's render (App.tsx:885-886 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067 sha256:2ff3129af748ec49d44f7b3f32b9fe7e0e4baf47ea0702bc634ad474b8c5605a).
  - The execute re-resolves the scope and refuses when `filterAsApplied` differs (PublishPanel.tsx:513-515; frontends/shell/src/workspace/scope.ts:46-57, :74-85 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067).
  - A prepare sent **before App re-renders** after the Apply therefore stages the pre-filter scope. Its execute, which runs after the render, returns the refused outcome `[P6 placeholder] The export was not run, because the filter changed after it was prepared. …` (PublishPanel.tsx:55-58). FILTERED' then fails at publish.mjs:491-493, not at `filter_scope`.
  - A prepare that lands **after App's render but before the panel's effect** (window (ii)) causes no failure at main: under whole-file the flag is ignored, and the staged scope is current.
  - Whether a prepare sent through a CDP round trip can land before React's render depends on how React 18 schedules this update and how WebView2 orders its tasks. That is React and Chromium behaviour that no code in this repository shows (createRoot under StrictMode, frontends/shell/src/bootstrap.tsx:25-29; react ^18.3.1, frontends/shell/package.json:57-58 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067 sha256:0083909b6967e856b7402471d35b8efac32d4b93454eff1694590cb4cfad8b10).
  - My reading, unverified: if the Tauri IPC response's continuation dispatches at default priority, the render runs in a later task than that continuation's microtasks. If it dispatches at discrete/sync priority, React renders, commits and flushes passive effects inside the microtask checkpoint, and neither window exists. The P0 probe (note 4) decides which holds.

- **(iv) Considered and excluded.**
  - Both arms' `commitActiveFilter` guards skip the commit only when the admitted dataset has changed (App.tsx:1685-1688, :1846-1849 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067). The suite opens one dataset.
  - `commitFilterChange` skips the dispatch when `viewIdRef` is null (App.tsx:1021-1022). That would fail every run, not one.
  - Neither explains a single failure in three runs.

**2. The change (settle 2): harness-side.**
- In `stepFiltered` (publish.mjs:459-466 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067 sha256:db3a608f1dd7953645d6bbba1a27e50d97ac0e3548c6c2cbe1d88662bc281813), one `page.evaluate`:
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
- §21a (governance/AUTONOMY.md:315-332 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067 sha256:211fe30919ba9ee55447ac9f66874374382d972ab58269c8f074a79fd4693cb3): none of the four categories is touched.
  - On "any property currently under test" (:325-327): every assertion FILTERED' makes is unchanged. The wait adds a precondition under which the step now also fails when the Apply does not reach the panel. That is coverage of a property export-view's EV4 already asserts, not a change to a property.
  - Round 25, item 2 (e) does not close the five-line form (governance/AUTONOMY.md:482 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067 sha256:4f388e9f3fe7a1d68117edb03f7c2520ce771901a96feff1752f426befe4c669).
- §21c's four bounds (:350-351 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067) all hold: lines well under 150, 1 file of 8, no exposure surface or dependency, no user-visible behaviour.
- §21b: the single reviewer gate is open (:336-337 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067). See OPEN-6.
- §36 (:687-692 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067) does not apply: this is a slot 2 piece, not a filler.
- Budget, 45 minutes:
  - The code change fits.
  - The evidence does not, by my estimate. It needs a debug exe (12m 01s at 147ef82c, tester-report-3:28) and four or five suite runs (P0, R1, P1, M-FLAG), plus the reviewer's re-observation. I flag this; I do not trim Scope to fit.

**4. The evidence (settle 4).** Every run is on the port-5400 harness, under the 2026-10-11 approval, item 1:
- a debug exe with the TAURI_CONFIG overlay: CDP on 9223 (frontends/shell/e2e/lib.mjs:33 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067 sha256:b2827fa0fa0243d23feeebfbee0ccd0c6e414182f321aaef9f064476afdcebb4), localhost:5180 mapped to 127.0.0.1:5400 (lib.mjs:37);
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
- Rule (00) (governance/AUTONOMY.md:606-610 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067 sha256:baec02eb42f6476b817f5e75fd234dc6fbc70adea33fd8a53a20635fe2a33676), against the brief's lists:
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
- Seam rule: the consumer read is the real `E2eTestSurface.publishPrepareWithDestination` (e2e-test-surface.ts:171-174 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067 sha256:fdf65931c8cdbc52132b45e14df46f40425123e42dc2242f221dcf7c5ffd1e80). No `pub` item, callback or option is added.

---

## OPEN items

**OPEN-1. If P0 passes at the base.** Not a red line.
- (A) STOP before any code. The custodian records a class 1 amendment: the recorded failure cannot recur at main (note 1 (i)), and the window is not reachable even with no round trip. The node closes on that record with no code. This is the piece's smallest true form. It establishes that the routed failure is moot at main.
- (B) Land the wait anyway, as a defence.
- **Recommend (A).** A wait for a window the code does not show does not meet the node's "the smallest change that the code at main shows removes its cause".

**OPEN-2. e2e/README.md's FILTERED' passage (frontends/shell/e2e/README.md:206-212 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067 sha256:bfee2f8b9387136e529259c7ae4b602cbbaa5119f2107d58ac73f97aa55a46c4).** **Red line by my reading:** adding a file the node does not name changes the scope of a ruled item. This follows the precedent's OPEN-3.
- (A) Not edited. The passage stays true but incomplete; the wait is described in the file's own doc comment.
- (B) Edited, as a second file of about 2 lines.
- **Recommend (A),** with (B) put to the human as a one-line question.

**OPEN-3. The poll's cadence.** Not a red line.
- §37 (governance/AUTONOMY.md:698-703 @ ac1d1004cbfc51ff29ee796e62bc2c39373c8067 sha256:fe65851e766388a5b4959cf4289d180398e9f2a9bb581bd466b26b9b1c63a173) binds agents' wait loops. I read it as not reaching a suite's in-page poll, but a gate may read it otherwise.
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

## The custodian's settlement (class 1, before any code)

- **OPEN-1 (A), OPEN-3 (B), OPEN-4 (A) and OPEN-6 (A)**, each the draft's recommendation and none a red line, taken on 2026-11-09 at this form's commit under the human's direction of 2026-10-31, item 4 (`state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md`), held to 2026-11-16 by the human's message of 2026-11-09 (`state/directives/2026-11-09-item-4-to-11-16-12c-open-a-d-taken-slot-2-order-pr-b-slot-1-availability-monday-list.md`, line 9), for the human's review: if P0 passes at the base, the piece stops before any code, a class 1 amendment records that the routed failure is moot at main, and the node closes on it with no code; the new wait sleeps at least one second per turn inside its hard timeout; the reviewer re-observes P0, P1 and M-FLAG inside a shared hold, the worker's runs read as the fallback; a single reviewer under §21b.
- **OPEN-2**, a red line by the draft's reading (a file the node does not name), is not taken. The ruled Scope stands, which is (A): `frontends/shell/e2e/README.md` is not edited, and its FILTERED' passage stays true without naming the wait. It is put to the human in one line: (B) adds that passage as a second file of about two lines. If the human chooses (B), an amendment carries the human's words: before the worker's dispatch, into its brief; after it, as a second commit on the piece's branch under a fresh brief, before the gate.
- **OPEN-5**, a red line by the draft's reading (the term of the human's port approval), is not taken by the custodian; the approval's own term governs. The runs use the port-5400 harness while port 5180 is not free: item 1 of the approval of 2026-10-11 (`state/directives/2026-10-11-harness-approval-open-9-i-withdrawn-a10-late-cancel-adr-029.md`) holds it until port 5180 is free again. If port 5180 is freed before they run, no e2e run of this piece starts until the human's word on the port. It is put to the human.
- **The draft's finding, read:** at main, FILTERED' expects `filter_scope` to be null under whole-file, and the host returns none there whatever the filter flag says, so the assertion that failed at 147ef82c is gone since U12 (note 1 (i)); the custodian's script checked the lines it rests on (the filing note of `state/consults/2026-11-09-publish-e2e-filtered-step-shared-run-failure-form-architect-draft.md`). The piece therefore tests the window note 1 (iii) names, a prepare staged before App re-renders after the Apply, by P0 at the base before any code. Its claim is limited as the draft's last section says.
- **The budget** is the node's 45 minutes. By the draft's estimate the code fits it and the runs do not (a debug build and four or five suite runs). The budget is not changed; the time taken is reported at the closing record.
- **The copied text and the code lines** are checked by the custodian's script at ac1d1004, and one side claim is corrected, changing no line of this form (the filing note of `state/consults/2026-11-09-publish-e2e-filtered-step-shared-run-failure-form-architect-draft.md`).
- **The route:** slot 2, by the human's placement, once #304 merges (`depends_on`); a five-line form under §21c's size; the single reviewer (OPEN-6 (A)). Every suite run on the port-5400 harness under item 1 of the approval of 2026-10-11, each in one Bash call inside a shared hold, the app's stderr, the suite's report and the app's session log copied right after each run; `npm run verify` and `verify-quotes` inside a shared hold; a fresh worktree runs `npm ci` in frontends/shell and in renderer/bundle-viewer. Port 5180 and `validate` are not used.
- **The read commit and main:** the draft was read at ac1d1004, which is main at this form's commit; the pins keep its lines. B is main at dispatch.
- **Rule (00)** at main ac1d1004, `git diff --name-only origin/main...<branch>` against the Scope file, `frontends/shell/src/App.tsx` (M-FLAG's, never committed), `frontends/shell/e2e/README.md` (OPEN-2's) and protocol/: #304 (`cut/shell-resource-dir-dev-comments`): none; port-2 (`cut/port-2-macos-l1-and-app-dirs`): none; 1c (`cut/b2-piece-1c-save-and-reopen`): none; B1 shell half C (`cut/b1-shell-half-pr-c`): none; #303 (`cut/clippy-deny-warnings-workspace-12c`): none. It is checked again at dispatch.

## Amendments (opens empty; append-only)

### Amendment 1 — 2026-11-09 — OPEN-2 (A) and OPEN-5, ruled by the human (class 5), recorded before any code

- **The ruling:** the human's message of 2026-11-09, its user record at 2026-11-09T21:07:46.337Z (`state/directives/2026-11-09-304-open-b-a-widened-303-clicked-pef-open-2-a-open-5-listen-test-then-5180.md`, lines 11 to 13).
- **OPEN-2: (A).** The human's words, quoted verbatim: "OPEN-2: (A). e2e/README.md is not edited; the wait is described in publish.mjs's own header."
  - Scope stays the one file, `frontends/shell/e2e/publish.mjs`.
  - The wait is described in that file's header: the sentences note 3 asks for (what the wait waits on and why that is the state the prepare reads; the timeout and what its failure names; that the wait is a precondition and not a property) are written there, beside M-FLAG's `RECORDED MUTATION` entry. They count in the declared 40 lines.
- **OPEN-5.** The human's words, quoted verbatim: "OPEN-5: when I tell you 5180 is free, confirm it by a listen test on 5180, not by the excluded-range list: that list will still show 5180 with an asterisk, which is the reservation I add myself so Windows does not take the port again. From a passing listen test on, every piece's e2e runs use 5180, the suites' own default, and the port-5400 harness and its approval of 2026-10-11 end. A run already started on 5400 finishes there. If the listen test fails, 5400 continues and you tell me. Until my word, 5400 as now."
  - Until the human says port 5180 is free, this piece's runs use the port-5400 harness, as note 4 and the settlement state.
  - When the human says it, the custodian runs a listen test on port 5180 before any further e2e run starts. The excluded-range list is not the test.
  - From a passing listen test on, this piece's runs use port 5180, the suites' own default, with no TAURI_CONFIG overlay and no Vite on 5400. Note 4's harness bullets then read so, and the approval of 2026-10-11 ends. A run already started on 5400 finishes there.
  - If the listen test fails, the runs stay on 5400 and the custodian tells the human.
  - The ruling covers every piece's e2e runs, not this piece's alone. The ledger's standing judgments carry it.
- **Unchanged:** every other line of this form, the settlement's other items included.
