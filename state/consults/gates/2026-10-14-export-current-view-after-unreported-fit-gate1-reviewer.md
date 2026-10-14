Reviewed: PR #219 at a23c5624cf5f18a60235e834ed1bf8ad9c6be896 (base f8bc2951)
Verdict: PASS WITH NOTES
Branch: cut/export-current-view-after-unreported-fit @ a23c5624cf5f18a60235e834ed1bf8ad9c6be896

Scope of this review: the diff is `git diff f8bc2951...a23c5624`, 11 files. I read the form at main 50cc228e (Amendment 6 back to Amendment 1, then §0 to §12), both worker reports, both e2e records and gate 1's architect report. Unit mutations were re-observed in C:/dev/wt/cvfix. The worktree was clean before and after every run.

## Correctness: no blocking finding

- **The seam from App to PublishPanel.** App passes `viewBox.get` and `viewBox.subscribe` (frontends/shell/src/App.tsx:2271-2272). Neither uses `this` (frontends/shell/src/feature/FeaturePanel.tsx:29-38).
  - Both prepares read `getViewBox()` at the click (frontends/shell/src/publish/PublishPanel.tsx:397, :445).
  - Availability is a boolean snapshot through `useSyncExternalStore` (PublishPanel.tsx:368).
  - The Export button stays disabled while Current view is chosen and unavailable (PublishPanel.tsx:683). The defensive refusal is reachable only through the dev hooks.
- **ADR-010 rule 1.** The box is emptied at an admission (App.tsx:1062). `showBox` drops a report from a superseded canvas (App.tsx:2029-2031). RCV2 proves this.
- **ADR-003, ADR-010 rule 2 and ADR-017 §8.** The box is the same f64 AuthoritativeBbox as before. The old HexF64 encode and decode was lossless, and the new path copies the four numbers. The wire, `JsBbox`, `bbox_crs: None` and the covering-bbox query are unchanged.
- **The canvas side was read and is unchanged in this diff.** Each of these reaches `showBox` synchronously:
  - a pan or zoom, through `onViewStateChange` and `onViewportChanged` (App.tsx:2097);
  - the auto-fit on both arms (WorkingCanvas.tsx:1540 and :1740), through `onViewShown` (WorkingCanvas.tsx:1407);
  - a notifying fit (Zoom to layer, `fitToBbox`), through `reportViewport` (WorkingCanvas.tsx:1402);
  - a resize, on all three arms (WorkingCanvas.tsx:2037-2047). At size 0 there is no report (frontends/shell/src/canvas/viewportBbox.ts:77), and the `getViewBox` doc comment records that case (PublishPanel.tsx:329-330).
- **The doc comment of `getViewBox` (PublishPanel.tsx:328, gate 1's D-1 words) holds against this code.**

## Evidence: no blocking finding

- **Every unit mutation was re-observed by me at a23c5624** (list below). Each failed by name in the test the form names, and each record in the test comments matches what I saw.
- **The e2e mutations,** as run 2 gives them, were observed at e3a14042. Between e3a14042 and a23c5624 the changes are comments and documents only: PublishPanel.tsx:328, the export-view.mjs header, e2e/README.md and MANUAL-WALKTHROUGH.md. src-tauri is unchanged since eebf7298, the commit the exe was built from.
- **A shared-run timing event, not recorded as a failure (THE MACHINE).** My first `npm run verify` timed out in `src/notices/noticeDeterminism.test.ts` after 30000 ms.
  - The cause: cargo printed "Blocking waiting for file lock on package cache" 57 times. A concurrent `cargo test -p spatial-kernel -- --list`, which I did not start, held that lock.
  - The re-run in a fresh shared hold passed: rc=0, 93 files, 1341 tests.
  - No action is needed beyond noting it.

## The human's texts, byte for byte: all match

- **Amendment 1 item 2, the Row scope sentence.** I joined the format string in publish.rs the way Rust's `\` continuation does. It equals state/directives/2026-10-12-item-42-current-view-amendment-7-guardian-readme-guardrails-brief.md:14 @ 88067f2c, less its three leading spaces; that line's sha256 recomputes to 2fa4cefe…, as the form pins. The PRS literal equals the sentence with the four numbers filled. Checked by script.
- **Amendment 3 item 6, the OPEN-3 note with the human's clause.** KNOWN-LIMITATIONS.md:194 at the head is four spaces followed by the form's note, byte for byte.
  - The note equals Amendment 1 item 3's text with the clause inserted before the first full stop.
  - The clause is the quoted span in state/directives/2026-10-14-status-bar-two-lines-current-view-zero-size-1b-open-9-blocks-provenance.md:14 @ eafcf3f6.
  - Amendment 1 item 3's sentences match the draft at state/consults/2026-10-12-export-current-view-after-unreported-fit-architect-draft.md:404-405.
  - Line 194 is the only line that changed in that file.
- **§2.4's sentence.** `CURRENT_VIEW_DISABLED_REASON` (PublishPanel.tsx:70-71) equals the form's §2.4 text. RCV3 and UPP1 assert it whole. The approval is the directive's item 5 ("yes to the drafted sentence as it stands").

## Gate 1's D-1, D-3 and D-4 at a23c5624: byte-equal

- **D-1:** PublishPanel.tsx:328 equals gate 1's block exactly.
- **D-3:** e2e/README.md:782 contains `once at least one feature is resident after it`, and :784 contains gate 1's replacement sentence. Neither old phrase remains.
- **D-4:** MANUAL-WALKTHROUGH.md:1860 carries both of gate 1's blocks (the Y3 step and its expected outcome), and :1873 carries the label `**Y3 (both sets of numbers):**`.

## Documentation: must be fixed before the merge, with no re-gate (product-first direction, section 2)

None of the wording below is the human's, so §31 item 2d applies: the worker or custodian applies these words and the PR body lists them.

**DOC-1. Class: Documentation. The body of PR #219 is stale and incomplete.**
- **The defects:**
  - It still lists as pending the custodian's e2e, the placeholder comment and both gates.
  - It gives §7 as 467. At the head it is 471.
  - It has no Amendment 6.
  - It names none of §9's e2e suites with their commit.
  - It does not name the commit of verify-cites, verify-quotes and verify-test-claims.
  - It does not list gate 1's D-1, D-3 and D-4 as applied with no re-gate (§31).
  - Its sentence "That box is written by every pan, zoom, fit and change of size, so an Apply, a Clear or a resize no longer leaves Current view publishing an area the map has stopped showing." overstates: a change to size 0 writes nothing.
- **The fix, replacement words for that sentence:** `That box is written by every pan, zoom and fit, and by every change of size while the map has a width and a height, so an Apply, a Clear or a resize no longer leaves Current view publishing an area the map has stopped showing.`
- **Clause check:**
  - A pan or zoom writes it: App.tsx:2097.
  - A fit writes it: WorkingCanvas.tsx:1402 (notifying) and :1407 (unreported).
  - A change of size writes it, except at 0: WorkingCanvas.tsx:2037-2047, viewportBbox.ts:77.
- **The rest of the fix, to add to the body:**
  - Amendment 6.
  - Run 2's suite list, at e3a14042, all rc=0, with export-view's three mutations.
  - D-1, D-3 and D-4 applied at a23c5624 with no re-gate.
  - §7 at a23c5624: 471 against 690.
  - The verify-* scripts and their commit.
  - Remove the pending items that are done.

**DOC-2. Class: Documentation (record). Gate 1's D-2 amendment is not on main.** Amendment 6 is still the form's last amendment. The next amendment, by reference only (record cap), carries:
- gate 1's D-2 (a) to (c);
- D-4's class 2 against §9 X3;
- §7 at a23c5624, by its own command: 471 lines over 8 files.
  - export-view.mjs 192/220; App.tsx 31/40; types.ts 5/8; package.json 1/2; App.selection.test.tsx 111/220; PublishPanel.test.ts 33/60.
  - PublishPanel.tsx 72/60 and publish.rs 26/20 are the class 8 overruns already recorded in Amendment 5.
  - Group P 109/110, T 144/280, E 192/280.
  - No new overrun.
- Outside the count: MANUAL-WALKTHROUGH.md +25 (≤50), e2e/README.md +10 (≤25), KNOWN-LIMITATIONS.md 1 line in and 1 out (≤8).

**DOC-3. Class: Documentation (operator gate). frontends/shell/MANUAL-WALKTHROUGH.md:1858 (Y1).**
- **The defect.** The step does not wait for the map to draw. An operator who opens Export before the first batch with geometry arrives sees Current view disabled, with the reason, and Y1's expected outcome reads as failed.
- **Replacement words for the step cell:** `Open \`filter-zoned.parquet\` and wait until the map has drawn its data. Before any pan or zoom, open the Export section.` The expected outcome is unchanged.
- **Clause check:**
  - The auto-fit writes the box at the first batch with geometry, before that batch is drawn (WorkingCanvas.tsx:1540, :1740, :1407). So once data is drawn the box is not null, and the radio is enabled (PublishPanel.tsx:368, :642).
  - "Before any pan or zoom" keeps the row discriminating, because a pan also writes the box (App.tsx:2097).
  - The Part says its sentences are not the human's wording.

**DOC-4. Class: Documentation. frontends/shell/MANUAL-WALKTHROUGH.md:324 (G1) and :948 (N5).**
- **The defect.** Both rows still describe the old behaviour: Current view disabled until a pan or zoom, with the reason "No settled view yet…". After this merge they are untrue on main.
- **The fix.** §2.6 confines this PR's walkthrough edit to the new Part, so do not edit them here. Before the merge, record a docs-lane follow-up in PLAN.yaml or CUSTODIAN-QUEUE.md naming both rows.

## Mutations I observed at a23c5624

Method for each: applied alone by script, the named file run, the failure read by name, reverted with `git checkout --`, then `git status --porcelain` empty.

- **RCV1.** The mutation: `getViewBox={() => { const b = lastViewportBboxRef.current; return b === null ? null : fromWireBbox(b, null); }}`. FAILED "RCV1: after an issued Apply and the fit it triggers, …" with AssertionError: the box of the fit, not of the last pan: expected { kind: 'viewport-bbox', …(1) } to deeply equal …. RCV3 also failed. Test run: 2 failed, 30 passed.
- **RCV2.** The mutation: `viewBox.set(null);` in `handleAdmitted` removed. FAILED "RCV2: a reopen empties the view box: …" with AssertionError: B's canvas has reported nothing: expected false to be true. RB-DRAWN also failed.
- **RCV3.** The mutation: a `hasSettledView` state set only in `onViewportChanged`, and `getViewBox={() => (hasSettledView ? viewBox.get() : null)}`. FAILED "RCV3: Current view is available once the map has drawn the data, …" with AssertionError: a view was shown: expected true to be false. It was the only failure.
- **RCV4.** The mutation: `handleApplyFilter`'s `getLastViewportBbox` reads `toWireBbox(viewBox.get())`. FAILED "RCV4: a refused Apply's recovery re-issues the box of the last pan or zoom, …" with AssertionError: the recovery asks the last pan or zoom's box: expected { xmin: '4044000000000000', …(3) } to deeply equal { xmin: '0000000000000000', …(3) }. RB18 also failed.
- **RB18 (i),** the unchanged mutation: `onViewShown` routed into `onViewportChanged`'s body, so it writes the ref and the box and calls the debounce. FAILED "RB18: onViewShown writes the box and nothing else: no query, no last-asked box" with AssertionError: no query: expected 1 to be +0. This is the same first failure as before the re-aim. RCV4 also failed.
- **RB18 (ii),** the new observer alone: `onViewShown` writes the ref and the box, with no query. FAILED, same test, with AssertionError: no last-asked box: the recovery asks the whole dataset: expected { xmin: '0000000000000000', …(3) } to be null. RCV4 also failed.
- **UPP1.** The mutation: `currentViewOptionDisabled` returns false. FAILED "disabled while the map has no view box" with AssertionError: expected false to be true. The render case "a disabled Current view shows the reason, and an available one shows none (UPP1)" also failed.
- **PRS.** The mutation: publish.rs:130-131 restored to the base's words. `cargo test … --lib the_viewport_bbox_row_scope` rc=101. FAILED `the_viewport_bbox_row_scope_sentence_is_the_humans_words_with_the_four_numbers` at publish.rs:1636, left: "row scope: the current viewport extent only (xmin 2683000.5, …", right: the human's sentence filled.
- **The e2e mutations,** from run 2 and not re-run by me:
  - E-CV failed at EV4 with F equal to A. E-CV-RESIZE failed too.
  - E-CV-RESIZE failed with R equal to F′ at 1280x800 to 1088x680.
  - E-CV-OPEN failed with the radio disabled after the first pixels.
  - Each matches the export-view.mjs header (lines 14-22).

## Commands and exit codes

- `git status --porcelain` in C:/dev/wt/cvfix, at the start and after every mutation and run: empty.
- `npx vitest run src/App.selection.test.tsx src/publish/PublishPanel.test.ts`, at the head: rc 0, 75 passed.
- `npm run verify` in frontends/shell, shared hold, run 1: rc 1. Timeout in noticeDeterminism behind another process's cargo lock; a timing event, see Evidence.
- `npm run verify`, shared hold, run 2: rc 0. Vitest: 93 files, 1341 tests passed. Check suites: 76 passed and 0 failed; citationIntegrity: 30 passed and 0 failed.
- `cargo test --manifest-path frontends/shell/src-tauri/Cargo.toml` with CARGO_TARGET_DIR=D:/wt-targets/cvfix, CARGO_BUILD_JOBS=8 and RUST_TEST_THREADS=8, in a shared hold: rc 0. The lib ran 67 passed with PRS ok, and sole_caller_scan 2 passed.
- PRS mutation, `cargo test … --lib the_viewport_bbox_row_scope`: rc 101, as expected.
- These ran in the worktree; the scripts' last commit is 04f6332b:
  - `node scripts/plan/verify-cites.mjs`: rc 0, PASS, 38 loose references advised.
  - `node scripts/plan/verify-quotes.mjs`: rc 0, PASS, 121 checked.
  - `node scripts/plan/verify-test-claims.mjs`: rc 0, PASS, 560 claims.
  - `node scripts/plan/verify.mjs`: rc 0.
- `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs`: rc 0, 457 pass and 0 fail.
- `git diff --numstat f8bc2951...a23c5624 -- frontends/shell` with §7's three excludes: 471 over 8 files.
- `gh pr checks 219`: rc 0. All 11 checks pass, and the runs I opened (38581368891, 38581375501, 38581375372) are at headSha a23c5624.

## §8, item by item

1. Pass. All 11 files are in §2.6. The root KNOWN-LIMITATIONS.md is allowed by Amendment 3 item 5.
2. Pass. The only package.json change is the `e2e:export-view` line. No lockfile changed.
3. Pass.
   - The ref's declaration is unchanged (App.tsx:896), and so are its writers (App.tsx:2096, :2107, :1072-1074).
   - Only the `hasSettledView` set left the admission closure.
   - The recovery's reads are unchanged (App.tsx:1018, :1581, :1741).
4. Pass. `showBox` is unchanged, and canvas/ is untouched, so there is no new `onViewShown` call site.
5. Pass. The export reads only `getViewBox()`, and only at the click (PublishPanel.tsx:397, :445).
6. Pass. The reset (App.tsx:1062), the guard (App.tsx:2029-2031) and the key cover it, and RCV2 proves it.
7. Pass. Nothing under the wire, SKP, the kernel, the engine or canvas/ changed. src-tauri changed only in the ViewportBbox arm and PRS.
8. Pass. PublishDialog.tsx is not edited.
9. Pass. The new strings are §2.4's (ruled by Amendment 4) and OPEN-2 (b)'s (Amendment 1 item 2). Their P6 sight is at Y4.
10. Pass. OPEN-1 to OPEN-3 were ruled before code. The §2.4 sentence was approved during the build, as Amendment 1 item 1 allows.
11. Pass. `getViewBox`, `subscribeViewBox`, `currentViewAvailable` and `CURRENT_VIEW_DISABLED_REASON` each have product callers by grep. `hasSettledView` has no product occurrence left.
12. Pass. There is no performance claim. The millisecond figures in export-view.mjs are wait bounds, and they are labelled so.
13. Pass. See the human's texts above.
14. Pass. Every new test and the re-aim have an observed mutation, and no `verify-mutation` run is called an observation.
15. Pass. Item 42 is narrowed, not retired, and item 39 is not edited.

Files: C:/dev/wt/cvfix/frontends/shell/src/publish/PublishPanel.tsx; C:/dev/wt/cvfix/frontends/shell/src/App.tsx; C:/dev/wt/cvfix/frontends/shell/src/App.selection.test.tsx; C:/dev/wt/cvfix/frontends/shell/src/publish/PublishPanel.test.ts; C:/dev/wt/cvfix/frontends/shell/src-tauri/src/publish.rs; C:/dev/wt/cvfix/frontends/shell/e2e/export-view.mjs; C:/dev/wt/cvfix/frontends/shell/MANUAL-WALKTHROUGH.md; C:/dev/wt/cvfix/KNOWN-LIMITATIONS.md; C:/dev/spatial-ide/frontends/shell/EXPORT-CURRENT-VIEW-AFTER-UNREPORTED-FIT-PREREGISTRATION.md.
