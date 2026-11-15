# shell e2e: export-view.mjs's E-CV asserts the Current-view prompt's filter-scope sentence, null before a filter and the sentence after it — five-line short form (`AUTONOMY.md` §21d)

*Committed before any code. Append-only once committed; an amendment written after any run of this piece's tests or mutations has been seen says so in its first line. PLAN node publish-filter-sentence-e2e-shown-case (S3), slot 2's, placed by the human's ruling of 2026-11-06 (15:59Z), N-1 (`state/directives/2026-11-06-8e-words-replaced-u1-h1-h2-class-8-m10-kl-c1-c3-draft-marks-u12-mark-n1-n3-slot-2-order-clippy-placed-288-clicked.md`). The five lines, the notes, the OPEN items, the reuse index and what is not settled are the architect's draft (`state/consults/2026-11-08-publish-filter-sentence-e2e-shown-case-form-architect-draft.md`, read only at main e13fa13b; extracted sha256 eff2fe14a0878e9c96486b98d623aac76ef724f7465acfd6cf71189d464e277f), carried byte for byte with these changes, all the custodian's: each cite the draft writes `path:line @ e13fa13b…` is expanded by script to `path:line @ <commit> sha256:<the lines with their LFs>` (32 pins; 13 by a file name that resolves to one tracked path at that commit; 4 by a file name that resolves to more than one, kept as written; bare line numbers kept as written); the Authority line's `same file:20` written as the directive's path; this title and lead line added; the draft's opening paragraphs and its closing list of files read dropped; the custodian's settlement added. Form path: `governance/forms/frontends/PUBLISH-FILTER-SENTENCE-E2E-SHOWN-CASE-PREREGISTRATION.md`. The custodian keeps the PLAN node on main.*

## The five lines (mine)

```
Authority: PLAN node `publish-filter-sentence-e2e-shown-case` (governance/PLAN.yaml:6872-6888 @ e13fa13bea35ae173907cac8ac53698b01c3f614 sha256:2bd748a98c1bd1933f8a40a0e28ccced8dc46d8f6b798221007bf59df530dca0), generation 1, S3; the human's ruling of 2026-11-06 (15:59Z), N-1: OPEN-3 (A) of U12's form as a follow-up in slot 2, e2e only, the two assertions in e2e/export-view.mjs (state/directives/2026-11-06-8e-words-replaced-u1-h1-h2-class-8-m10-kl-c1-c3-draft-marks-u12-mark-n1-n3-slot-2-order-clippy-placed-288-clicked.md:18 @ e13fa13bea35ae173907cac8ac53698b01c3f614 sha256:d00d152f3693dcdf1e9cddae7c9eae805581977b890d3b2279b732f89ce16150), and slot 2's order (state/directives/2026-11-06-8e-words-replaced-u1-h1-h2-class-8-m10-kl-c1-c3-draft-marks-u12-mark-n1-n3-slot-2-order-clippy-placed-288-clicked.md:20 @ e13fa13bea35ae173907cac8ac53698b01c3f614 sha256:c0e8f604ab159d5142f6c94fbf89e23247d108762d251ce13ee45b7b196f4423); U12's form, its OPEN-3 and Amendment 2's N-1 item, by section (governance/forms/frontends/PUBLISH-FILTER-SENTENCE-UNDER-WHOLE-DATASET-PREREGISTRATION.md); the human's gate-round rulings, Part 1, items 1 to 9, by reference (state/directives/2026-11-05-main-architect-gate-rounds-part-1-rulings-review-packet-design-part-3-additions.md:28-64 @ e13fa13bea35ae173907cac8ac53698b01c3f614 sha256:b7b9954b95c6a23808cc8a2fbacb8b6157335e23da53ccda20f4a35ba8e05e8a); the e2e runs under the human's port-5400 harness approval of 2026-10-11, item 1 (state/directives/2026-10-11-harness-approval-open-9-i-withdrawn-a10-late-cancel-adr-029.md:6-10 @ e13fa13bea35ae173907cac8ac53698b01c3f614 sha256:99a0e4c3f7c9278ef1871b5222638b97b46d6a6dce7f11718f3ea54b2f48fb84); gating per OPEN-1; the reuse index found no prior art on either search (export view e2e filter sentence; filter scope end to end assertion), a miss noted here.
Scope: 1 file: frontends/shell/e2e/export-view.mjs; declared line budget 60, insertions plus deletions, comments counted (governance/AUTONOMY.md:357 @ e13fa13bea35ae173907cac8ac53698b01c3f614 sha256:367596df34a73d122765d000ba5df601dbe54da9e5a6aefca966747809a44fec); this form exempt; frontends/shell/src/App.tsx is mutated and reverted for the observations and never committed; publish.rs, types.ts, PublishPanel.tsx, PublishDialog.tsx, commands.rs, e2e/README.md, MANUAL-WALKTHROUGH.md and every other e2e suite are read, not changed (e2e/README.md only under OPEN-3 (B), by the human's ruling); no other file changes.
Change: E-CV's EV2 asserts that the Current-view prompt prepared before any filter carries `filter_scope` null, and its EV4 asserts that the Current-view prompt prepared after `zone = 'residential'` is applied carries `filter_scope` equal to `FILTER_SCOPE_SENTENCE` as written in frontends/shell/src-tauri/src/publish.rs (OPEN-2), read from `prepareCurrent`'s prompt (frontends/shell/e2e/export-view.mjs:70-82 @ e13fa13bea35ae173907cac8ac53698b01c3f614 sha256:dc692b104a831e108505aeee0ccd4f7a8bbff9e0f1637f9bfc5e6e89774c8287); every other step, assertion, wait and bound is unchanged.
Tests+mutation: the two assertions in E-CV, each placed after that prepare's existing box assertion (export-view.mjs:116, :119 @ e13fa13bea35ae173907cac8ac53698b01c3f614); M-EV2: App.tsx's `filterActive={activeFilter !== null}` (frontends/shell/src/App.tsx:2450 @ e13fa13bea35ae173907cac8ac53698b01c3f614 sha256:a16f19bf69eba1dedb36b3805ee584ef93371b20a23a17b98c17c322851eb1b3) set to `filterActive={true}`, predicted E-CV FAIL at the new EV2 assertion; M-EV4: the same line set to `filterActive={false}`, predicted E-CV FAIL at the new EV4 assertion, after F differs from A; no other assertion of the suite kills either; under each, E-CV-OPEN and FIXTURES PASS, and E-CV-RESIZE's result is recorded, not predicted; the suite run once unmutated at the head (all four PASS), then each mutation applied alone, the suite run, the failure recorded by name in a `RECORDED MUTATION` entry of the file's header with the 40-hex commit it was observed at, then reverted and the worktree shown clean; a verify-mutation run is not an observation; a mutation that passes, or E-CV failing anywhere else, or E-CV-OPEN failing, is a stop; every run on Windows on the port-5400 harness under the approval of 2026-10-11, item 1, inside `hold shared -Project SpatialIDE`, the app's stderr, the suite's report and the app's session log copied right after each run; no sleep, retry, poll or timeout is added; the e2e does not run on CI.
Out-of-scope: ADR: none (ADR-017 §8 unchanged; ADR-024, Proposed, unchanged); security: none (no exposure surface, no dependency, the dev destination seam and the class-3 approval unchanged, every prepare abandoned, nothing executed, no bundle written); wire: none (`PublishPromptData` is binding-local, nothing under protocol/); guarantee: none (no property changes: the piece adds two assertions over `filter_scope` as `PublishScope::filter_scope_sentence` already produces it, frontends/shell/src-tauri/src/publish.rs:128-137 @ e13fa13bea35ae173907cac8ac53698b01c3f614 sha256:60555bc0b88117a3ff3dcc7fd82766a9b6e4f3aa42349059f46bdfe207306148, and as App.tsx:2450 already passes the flag); no string the app shows is added or changed.
```

---

## Notes (mine)

**1. The two assertions (settle 1).**

These lines stand at main. I copied them from the Read tool's output, not by script. The custodian copies them by script or pins them by hash before filing.

export-view.mjs:113-119 @ e13fa13bea35ae173907cac8ac53698b01c3f614 sha256:472bac4ec9f6a5cf90345968fe70acc1ac07061b96376e206abcd3e35c639483:
```js
  expect(await page.evaluate(([x, y, z]) => window.__SPATIAL_E2E__.e2eSetViewState(x, y, z), [fit.xmin, fit.ymin, zoom]), "E-CV: e2eSetViewState moved nothing");
  await waitForSettle(() => consoleHandle.renderTrace(), SETTLE);
  const a = await prepareCurrent(page, "ev2-corner");
  expect(differs(a, fit), `E-CV: the corner view ${fmt(a)} equals the fit ${fmt(fit)}; the seam moved the view by nothing`);
  await applyAndRefit(page, consoleHandle, "zone = 'residential'", "E-CV EV3");
  const f = await prepareCurrent(page, "ev4-fit");
  expect(differs(f, a), `E-CV: after the Apply and its fit, Current view still sends the earlier box: F ${fmt(f)} equals A ${fmt(a)}`);
```
export-view.mjs:81 @ e13fa13bea35ae173907cac8ac53698b01c3f614 sha256:8dd3c8cdb8ec090d4045b5ca65922af34de90abd6ec30fc7ba8d75b420561046:
```js
  return { xmin, ymin, xmax, ymax };
```

What each step does:
- EV2 (:113-116) moves the view to a corner through `e2eSetViewState` and waits for the render to settle. `prepareCurrent` then prepares Current view through `publishPrepareWithDestination(d, "current")` (:74), checks that the status is `prompt` (:75), parses the box from `row_scope` (:76-77), abandons the dialog (:78) and returns the four numbers (:81). The prompt object is dropped there.
- EV3 (:117) applies the predicate through `queryWithFilter` and expects `applied` (:86-87). It then polls until a feature is resident, up to 60 s (:88, :40), and waits for the render to settle (:89, :41).
- EV4 (:118-119) prepares again and asserts that F differs from A.

The proposed text is mine. The worker writes the final lines from the built code.
- `prepareCurrent` (:81) becomes `return { xmin, ymin, xmax, ymax, filterScope: prepared.prompt.filter_scope };`. `differs` and `fmt` read only the four keys (:59-63), so the other callers (`fit`, `z`, `before`, `after`) behave exactly as before.
- EV2, inserted after :116: `expect(a.filterScope === null, ...)`. Its message names EV2, the value received and "expected null".
- EV4, inserted after :119: `expect(f.filterScope === filterScopeSentence, ...)`. Its message names EV4, the value received and the expected value.
- Why after the box assertions: the existing recorded mutation for E-CV (header :15-17) keeps its predicted failure, F equal to A at EV4.

Why the expectations hold:
- EV2 runs after a fresh `openPath`. The admission resets the filter (App.tsx:1131-1138 @ e13fa13bea35ae173907cac8ac53698b01c3f614 sha256:8207ec51e6e839bd735454eabed2fc858a516d38c03994947086d9262037c1d3). `filterActive` is `activeFilter !== null` (App.tsx:2450), and `activeFilter` is `view.filter` (App.tsx:866 @ e13fa13bea35ae173907cac8ac53698b01c3f614 sha256:a400e483fc84063be6c8ad223c0dd0e90331ee1d79c15f954296a4b8f9830c54). The host returns `None` unless the scope is `ViewportBbox` and the flag is true (publish.rs:132-137). `None` crosses as `null`: `PublishPromptData` has no `skip_serializing_if` (publish.rs:264-292 @ e13fa13bea35ae173907cac8ac53698b01c3f614).
- EV4: an issued Apply calls `commitActiveFilter` before it returns `applied` (App.tsx:391-394 @ e13fa13bea35ae173907cac8ac53698b01c3f614 sha256:bad32db5eed05cc63902ad10547a37afcf405faa1a4070f4022b44ed2e29bce4). That dispatches `view.transition` (App.tsx:1018-1031 @ e13fa13bea35ae173907cac8ac53698b01c3f614 sha256:1f706c003b9d1f4662975df1b0c2364334fa5097dcc1093124d8d7c7d6acefae), which sets `view.filter`. The panel re-registers `publishPrepareWithDestination` whenever `filterActive` changes (PublishPanel.tsx:570-585 @ e13fa13bea35ae173907cac8ac53698b01c3f614 sha256:fd93992c0c12095a537e79e62f46986961cefe49d6bdc0a460ae8ba9806a58c4). The hook calls `runPrepareWithDestination` with the current `filterActive` (PublishPanel.tsx:455-481 @ e13fa13bea35ae173907cac8ac53698b01c3f614 sha256:e4b535379a915d1e6bbc747770a67e3b118650d640ab004d1973dc0a1feb5e6c). That reaches `prepare_with_progress` with the same flag (commands.rs:535-593 @ e13fa13bea35ae173907cac8ac53698b01c3f614; publish.rs:419-437 @ e13fa13bea35ae173907cac8ac53698b01c3f614).

**The wait.** The suite does not wait on the hook's re-registration directly. That re-registration is the React commit after one dispatch. EV3's existing waits come after it: the resident poll, which needs a batch to cross the IPC, and then a 2 s quiet settle. So the assertion needs no new wait, and none is added. The 300 s step bound (:176) is unchanged. If EV4 received `null`, that would be the defect N-1 names: no test proves the App-to-host true flag. It would not be a harness race to work around.

**2. What is compared (settle 2).** Options are in OPEN-2.
- My recommendation: the suite reads the expected sentence from `publish.rs` at the start of the run. It uses the pin test's regex and its line-continuation collapse (PublishPanel.test.ts:225, :237 @ e13fa13bea35ae173907cac8ac53698b01c3f614).
- Precedent: `exportElapsed.mjs` reads `PENDING_ATTEMPT_TTL` from the same file and stops as a harness failure when it cannot (frontends/shell/e2e/exportElapsed.mjs:11-22 @ e13fa13bea35ae173907cac8ac53698b01c3f614 sha256:c2ba01af53ca9f6edd9b620aeedf83858dc6396aba5a3ba27bce3aeed7522d8f).
- What prevents drift: the suite holds no copy of the sentence. The payload is compared with the producer's own constant. The existing pin test keeps types.ts's copy equal to that constant (PublishPanel.test.ts:222-240 @ e13fa13bea35ae173907cac8ac53698b01c3f614 sha256:6c3bc4375824be5033ff8149c01edfc40c3c732d76701a8e99c9d31b3e809896).
- Where the read goes: in `main()`, after the fixture check and before `attachOrLaunch`. A failed read prints a harness failure by name and exits 1, the same way a missing fixture does (:148-152). `stepCv` takes the sentence as a third argument (:108, :176).
- The regex anchors on `FILTER_SCOPE_SENTENCE\s*:\s*&str`. The doc comment that `publish-filter-sentence-mark-comment-and-adr-024-note` rewrites, above publish.rs:76, cannot match it.
- **The mark and red lines:** none is touched. The suite reads the P6 string and compares it. It adds, changes and shows no string; the only addition is harness console output. P6, item 4's "P6 strings" and §B's "user-visible behaviour" (governance/AI_DEVELOPMENT.md:451-454 @ e13fa13bea35ae173907cac8ac53698b01c3f614 sha256:573c907fab55b870ebdc353b7f19459438e3b74c8667217b4c07f8f5a332d821) are not reached. The value compared includes the `[P6 placeholder] ` prefix. A separate prefix check would be a third assertion and is not proposed.

**3. The route (settle 3).**
- **Files:** 1.
  - MANUAL-WALKTHROUGH.md: no coverage table names `export-view.mjs`. The only hits for `export-view` in frontends/shell's Markdown files are e2e/README.md:763 and :766. Part Y (MANUAL-WALKTHROUGH.md:1858-1868 @ e13fa13bea35ae173907cac8ac53698b01c3f614 sha256:2bc5efed3202d28b68373209b7ae3ab571ab93ee40cb91f1d78ff34076599216) has no coverage table. The FILTERED' row's parenthetical, which says the shown case "is not prepared by this suite" (MANUAL-WALKTHROUGH.md:399 @ e13fa13bea35ae173907cac8ac53698b01c3f614 sha256:1c29104aa6986e9e9abe6cc3f5d082b9f3a35dfac7f233ec2ea24fc279c81cde), stays true of publish.mjs. G8 (:337) is unchanged. So 0 lines there.
  - e2e/README.md: the publish.mjs passage's "no step of this suite prepares that case" (e2e/README.md:208 @ e13fa13bea35ae173907cac8ac53698b01c3f614 sha256:17628228d1181687a4b14d07f25017a35db9c007484d4437dd08de976aac8d65) stays true. The export-view entry (e2e/README.md:766 @ e13fa13bea35ae173907cac8ac53698b01c3f614 sha256:c899ff71b5356e5ac333d28eb89f048af93d6d22696366cf427c2abd5ee06a13) lists E-CV's assertions without the two new ones. That makes it incomplete, not untrue. See OPEN-3.
- **Lines:** my estimate is about 30 to 40. It is not a count. It covers:
  - the read function and its path constant (about 7);
  - the read in `main()` and the `stepCv` signature and call (about 6);
  - `prepareCurrent`'s return (2);
  - the two assertions (2);
  - the header's E-CV lines rewrapped (:8-10, about 6);
  - two `RECORDED MUTATION` entries with their Expected and Observed lines (about 8 to 12).
  - Declared 60. Under OPEN-3 (B), about 2 more in README:766.
- **§21a:** none of the four categories is touched. On "any property currently under test" (governance/AUTONOMY.md:325-327 @ e13fa13bea35ae173907cac8ac53698b01c3f614 sha256:8a15c806777af23d1ccc4e1ea6d14ce595d679714544814504cea18715b4dfd7): no property changes. The piece adds an end-to-end assertion of a property R2's unit tests already prove (publish.rs:2084-2105 @ e13fa13bea35ae173907cac8ac53698b01c3f614). U12's form read "touched" because a property changed there; nothing changes here. So round 25, item 2 (e) does not close the five-line form (governance/AUTONOMY.md:482 @ e13fa13bea35ae173907cac8ac53698b01c3f614 sha256:4f388e9f3fe7a1d68117edb03f7c2520ce771901a96feff1752f426befe4c669).
- **§21c's four bounds** (governance/AUTONOMY.md:350-351 @ e13fa13bea35ae173907cac8ac53698b01c3f614 sha256:ab244b928ccaaaddf7cee273363bc2481ad0e53cd6aa97d1e57fe8f7eefcd333):
  - lines: well under 150;
  - files: 1 of 8;
  - no exposure surface and no dependency;
  - no user-visible behaviour.
  - All four hold. A five-line form fits, and §21b's single gate is open (governance/AUTONOMY.md:336-337 @ e13fa13bea35ae173907cac8ac53698b01c3f614 sha256:c60dc87cd835f1ae56c3bc930789986d197ed5d2ff34c7ef30d3ec20d2a21a63). See OPEN-1.
- **Why (A) was once a ninth file:** inside U12's eight-file Scope it crossed the file bound (U12's form, OPEN-3). Standing alone, it is one file.

**4. Tests and mutation (settle 4).**
- **Why App.tsx:2450:**
  - It is product code, the App-to-host flag that N-1 names as unproved.
  - It is TypeScript served by Vite on 5400, so it needs no Rust rebuild between runs.
  - Each mutation is killed by exactly one of the new assertions. M-EV2 leaves EV4's expectation true. M-EV4 leaves EV2's true. Neither changes a box.
- **The publish.rs alternative:** dropping `if filter_active` kills EV2 too, but it needs a debug-exe rebuild. It is not proposed.
- **Predicted failures by name**, messages per note 1:
  - M-EV2: `[E-CV] FAIL`, with the EV2 message (received the sentence, expected null).
  - M-EV4: `[E-CV] FAIL`, with the EV4 message (received null, expected the sentence).
  - Under each, E-CV-OPEN and FIXTURES PASS.
- **E-CV-RESIZE is recorded, not predicted.** Under a mutation, E-CV stops early (before EV3 or before EV5), so E-CV-RESIZE starts from a state that a passing run never gives it.
- **Run order:**
  1. R0, unmutated at the head.
  2. M-EV2.
  3. M-EV4.
  - For each run, the app and Vite are relaunched, so the App.tsx they serve is the file on disk. The worker confirms this.
- **Each run is observed:**
  - on Windows, on the port-5400 harness under the 2026-10-11 approval, item 1. Its terms: scratch folders and the piece's own target only, no tracked file changed by the harness, and the report discloses the harness.
  - inside `hold shared -Project SpatialIDE`.
  - with the app's stderr, the suite's report and the app's session log copied right after the run.
  - Port 5180 and `validate` are not used.
- **The header's `RECORDED MUTATION` Observed lines** are written after the runs, in a commit after the one observed. Each names the 40-hex commit it was observed at (Part 1, item 1 for the header's behaviour sentences).
- **Readiness** (Part 1, item 4): at the head before any gate, `npm run e2e:export-view` on the harness, `npm run verify` (for whatever of it reads e2e/), the scripts' `node --test`, and `verify:plan`, `verify:cites` and `verify:quotes`, each named with its commit.

**5. What must not change (settle 5).**
- In export-view.mjs: E-CV-OPEN, E-CV-RESIZE, FIXTURES, EV1, EV3, EV5, every existing `expect`, `ROW_SCOPE`, every bound and wait (:39-44), `applyAndRefit`, `pollUntil` and `runStep`.
- Elsewhere: publish.rs, types.ts, PublishPanel.tsx, PublishDialog.tsx, commands.rs, client.ts, App.tsx (never committed), every other e2e suite, lib.mjs, exportElapsed.mjs and package.json.
- Lines claimed in flight, under rule (00) (governance/AUTONOMY.md:606-609 @ e13fa13bea35ae173907cac8ac53698b01c3f614 sha256:1b5b9b11a33ca113e5181f6b6e4561f907661db40214efb5e441fa224f72153b), against the brief's filtered lists:
  - `cut/port-2-macos-l1-and-app-dirs`, `cut/b2-piece-1c-save-and-reopen` and `cut/b1-shell-half-pr-c` touch none of e2e/, the walkthrough, publish.rs or protocol/.
  - `publish-filter-sentence-mark-comment-and-adr-024-note` edits the doc comments in publish.rs and types.ts and ADR-024. Those paths are disjoint from this piece's file, and its edit cannot change what the reader captures.
  - The next slot-2 node, `stale-harness-comments-find-prime-and-late-result`, edits regression.mjs and App.lateResult.test.tsx (governance/PLAN.yaml:6702-6718 @ e13fa13bea35ae173907cac8ac53698b01c3f614 sha256:6b62b2db363d3a8e495e4cdba68a117ee7328fa9a95bbc64e580e0f166b35bb4), which are disjoint.
  - protocol/: none.
  - App.tsx was outside the brief's filter. Since the mutation is never committed, no path is claimed. The custodian rechecks at dispatch anyway.

**6. Constitution check: no violations.**
- 01: the change only adds evidence for principle 8's shown case.
- ADR-006: each prepare is abandoned, and class 3 is untouched.
- docs/08: no number. The suite's milliseconds bound waiting (:38).
- docs/02 and docs/10: binding-local, no MCP and no bulk data.
- docs/07: within the prototype slice.
- Seam rule: the consumer read is `PrepareOutcome.prompt.filter_scope: string | null` (types.ts:35-39, :58-62 @ e13fa13bea35ae173907cac8ac53698b01c3f614). No new `pub` item, callback or option.
- Owner rule: the suite's messages state what the payload carried.

---

## OPEN items

**OPEN-1. Gates.** Not a red line.
- (A) A single reviewer gate under §21b. No §21a category is touched and all four §21c bounds hold.
- (B) The reviewer and the architect from dispatch.
- **Recommend (A).** It is the route the rule opens, and the piece is one test file. If the custodian reads a category as touched, §21b's mid-piece clause applies.

**OPEN-2. The expected sentence's source.** Not a red line.
- (A) Read from publish.rs at the start of the run (note 2; the exportElapsed.mjs precedent).
- (B) A byte-copied constant in the suite (regression.mjs's verbatim-constant convention). This is a third copy. Drift would be found only when this manual e2e runs, and the human's eventual wording of the placeholder would need a third edit site.
- (C) Read types.ts's copy. This compares the payload with the panel's copy rather than the producer's, one step removed.
- **Recommend (A).**

**OPEN-3. The e2e README's export-view entry (e2e/README.md:766).** **Red line by my reading:** adding a file the ruling does not name is a scope change to a ruled item (directive of 2026-10-31, item 4; AI_DEVELOPMENT §B).
- (A) Not edited. The entry stays true but incomplete: it lists E-CV's assertions without the two new ones. Its "each prompt's sentence is matched whole against the human's wording" means the Row scope sentence and stays true of it. The header comment in export-view.mjs carries the new assertions, and :768 already sends readers to that header.
- (B) Edited, as a second file of about 2 lines. E-CV's parenthetical would gain the two assertions, and the sentence would say that the filter sentence is matched against publish.rs's placeholder, not the human's wording. This needs the human's ruling.
- **Recommend (A) for this piece,** with (B) put to the human in the closing message as a one-line question. The README sentences are a worker's, not the human's wording, so (B), if ruled, is applied with no re-gate.
- A gate that reads the omission as untrue would contradict (A). I do not read it as untrue.

**OPEN-4. Who observes the e2e mutations.** Not a red line by my reading.
- Part 1, item 9 says mutation observations stay the gates' own (state/directives/2026-11-05-main-architect-gate-rounds-part-1-rulings-review-packet-design-part-3-additions.md:64 @ e13fa13bea35ae173907cac8ac53698b01c3f614 sha256:8caa479bfa0f770811680e8e1b75b3af2c9548ec3968a6c88706cdc586390632).
- The harness approval names "you and your workers" (state/directives/2026-10-11-harness-approval-open-9-i-withdrawn-a10-late-cancel-adr-029.md:8 @ e13fa13bea35ae173907cac8ac53698b01c3f614 sha256:1a106394ca692513028288cd83ac7577bfb281f81816cee07c041a958fc8df44).
- (A) The reviewer re-observes M-EV2 and M-EV4 itself on the harness, inside the shared hold. If it is refused, the custodian runs the observation under item 1's last sentence (:10), the reviewer reads that evidence, and the record says so.
- (B) Only the worker's or the custodian's runs are recorded, and the gate reads the evidence (the precedent of export-current-view, header :14).
- **Recommend (A).** It keeps item 9 as written, and (B) is its fallback.

---

## The reuse index (as given in the brief, byte for byte; the misses are noted in Authority)

```text
$ node tools/reuse.mjs export view e2e filter sentence   (exit 1)
No prior art recorded for "export view e2e filter sentence". Research it before planning an implementation.
$ node tools/reuse.mjs filter scope end to end assertion   (exit 1)
No prior art recorded for "filter scope end to end assertion". Research it before planning an implementation.
```

---

## What I could not settle

- **HEAD.** I could not confirm that the working tree I read is e13fa13b, and I have no sha256 for any pin.
- **Vite under the harness.** Whether the port-5400 harness's Vite serves a mutated App.tsx after a relaunch with no extra step. The worker confirms this before M-EV2 (note 4).
- **E-CV-RESIZE under a mutation.** Its result under either mutation is recorded, not predicted (note 4).
- **The line count.** About 30 to 40 is my estimate, not a count.
- **OPEN-3 (B)** waits for the human. OPEN-4's reading of "your workers" is mine.
- **The copied code.** The lines in note 1 were copied from the Read tool's output, not by script.

## The custodian's settlement (class 1, before any code)

- **OPEN-1: (A)**, a single reviewer gate under §21b, taken on 2026-11-08 (the direction of 2026-10-31, item 4, `state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md`, held until 2026-11-09 by `state/directives/2026-11-03-away-until-11-09-276-open-1-seven-clauses-open-4-c-placed-sitting-wording-leaves-slot-cloud-credit.md`, line 6); the human reviews each on return and may reverse it, a reversal recorded, never edited in.
- **OPEN-2: (A)**, taken on 2026-11-08 (the direction of 2026-10-31, item 4, `state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md`, held until 2026-11-09 by `state/directives/2026-11-03-away-until-11-09-276-open-1-seven-clauses-open-4-c-placed-sitting-wording-leaves-slot-cloud-credit.md`, line 6); the human reviews each on return and may reverse it, a reversal recorded, never edited in.
- **OPEN-3: (A)**, the ruled Scope as given, not a recommendation taken: the human's N-1 names export-view.mjs alone. (B) is a red line and the human's. It goes to the human in the closing message, and comes, if at all, by an amendment on the human's words.
- **OPEN-4: (A)**, taken on 2026-11-08 (the direction of 2026-10-31, item 4, `state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md`, held until 2026-11-09 by `state/directives/2026-11-03-away-until-11-09-276-open-1-seven-clauses-open-4-c-placed-sitting-wording-leaves-slot-cloud-credit.md`, line 6); the human reviews each on return and may reverse it, a reversal recorded, never edited in.
- **The worker's worktree** runs `npm ci` in frontends/shell and in renderer/bundle-viewer, each from its committed lockfile: the shell's suites build the viewer first.
- **The read commit and main:** `git diff --name-only e13fa13b 7f9a2229` over the 14 files the pins name lists 1: `governance/PLAN.yaml`, by the custodian's records only. The pins keep the read commit's lines.
- **Rule (00)** at main 7f9a2229, `git diff --name-only origin/main...<branch>` against export-view.mjs, the e2e README, App.tsx (mutated and reverted, never committed) and protocol/: port-2 (`cut/port-2-macos-l1-and-app-dirs`): none; 1c (`cut/b2-piece-1c-save-and-reopen`): none; B1 shell half C (`cut/b1-shell-half-pr-c`): none; the mark comment (`cut/publish-filter-sentence-mark-comment-and-adr-024-note`): none. The mark comment's branch edits the doc comment above `FILTER_SCOPE_SENTENCE` in publish.rs, which the suite's read does not match (note 2). It is checked again at dispatch.

## Amendments (opens empty; append-only)
