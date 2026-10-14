*Custodian's filing note (2026-10-14): the worker-high's report for `export-current-view-after-unreported-fit`, built in C:/dev/wt/cvfix from main f8bc2951 to the form as amended (Amendment 3); the head eebf72980a1f12ea3b0f3cee013adb251a10cd0a, pushed and checked by the custodian (porcelain empty; local equals origin; the per-file counts recomputed and equal). The run 2026-10-14T10:06:12Z to 2026-10-14T11:03:49Z by its transcript (Read 8, Bash 115, Edit 7, Write 12); its one SubagentHandback call, at 11:03:49Z. Extracted by script; 0 rooted path:line cite(s) de-rooted and one final newline added; nothing else changed. The message's sha256 as handed back is a925ead8ff3b32077c80efe97fd7186675a22623110f9de60e8face84e21ceaf; this file's, from line 5 to the end, is a925ead8ff3b32077c80efe97fd7186675a22623110f9de60e8face84e21ceaf. The worker built while the human's approval of §2.4's sentence (Amendment 4) was being filed, so its comment still calls the sentence a placeholder. The e2e and its three mutations are the custodian's, recorded separately.*

---

REPORT: export-current-view-after-unreported-fit (built, pushed, no PR, no merge or rebase)

Head and commits (branch cut/export-current-view-after-unreported-fit, base f8bc295162c2520dee37541c5ee2c9203900a016 = main; confirmed after `git fetch origin`, porcelain empty at start):
- 304ba2495dc7d4792ee9e104e146dfbc84b0a4b4 feat: the change, tests, e2e suite, Part Y, README, item 42 note.
- eebf72980a1f12ea3b0f3cee013adb251a10cd0a (HEAD, pushed) test: the observed-mutation records.
- Every mutation was applied on a tree identical to 304ba249's. I amended the feat commit once before any push to add the Claude-Session trailer, so the hash in the mutation records is the amended 304ba249.
- Final `git status --porcelain`: empty. No background process left running.

I am Sonnet 5.5 (claude-sonnet-5-5); no model override and no context handoff.

SECTIONS AS BUILT
- §2.1 App.tsx, with item 4 (a) and (e):
  - PublishPanel gets `getViewBox={viewBox.get}` and `subscribeViewBox={viewBox.subscribe}`.
  - `hasSettledView` is gone from App: the state and its comment, the guarded set in `onViewportChanged`, and the set in the admission closure. The closure keeps only the `lastViewportBboxRef` write.
  - §2.1(b)'s list is untouched. §2.1(c) adds nothing: `viewBox.set(null)` at the admission is already there.
  - Comments corrected: the viewBox comment (the box now also feeds Current view), the `onViewShown` comment, and the within-handler comment.
  - `ViewBoxStore` stays unexported and nothing under src/feature/ is edited.
- §2.2 PublishPanel.tsx and types.ts (comment only), with item 4 (a) and item 6:
  - New props `getViewBox` and `subscribeViewBox`. `useSyncExternalStore(subscribeViewBox, () => getViewBox() !== null)` gives the availability boolean.
  - `resolvePublishScope` takes `AuthoritativeBbox | null` and copies the four numbers; no HexF64 decode.
  - `PublishControls` takes `currentViewAvailable: boolean` in place of `hasSettledView`.
  - The defensive refusal text is unchanged; its source comment records that it is unruled and reachable only through the dev hooks.
- §2.4 disabled reason: exported constant `CURRENT_VIEW_DISABLED_REASON`, with a P6-placeholder comment (the architect's draft, awaiting the human, Y4 at the latest). No other new operator string.
- OPEN-2 (b) src-tauri/src/publish.rs: the `ViewportBbox` arm of `row_scope_sentence` is the human's sentence, plus test PRS. Nothing else in src-tauri.
- §2.5 root KNOWN-LIMITATIONS.md: line 194 (sha256 c24fec98… confirmed before the edit) is replaced by four spaces and the note from Amendment 3 item 6. The note was copied by script from the form's line 515, then compared with `cmp`: byte-equal. Nothing else in the file changed.
- §2.3 and §4:
  - RCV1 to RCV4 are added and RB18 is re-aimed in App.selection.test.tsx.
  - PublishPanel.test.ts: UPP1, the `resolvePublishScope` cases, `wireBbox` became `viewBox`, the imports, and the props case.
  - Harness additions (item 4 (d)): the canvas stand-in counts `resetFitForNewGeneration` calls; the manager stand-in records each request's bbox and filter and can refuse the next one with a real `SkpCallError` (code skp.filter_rejected_by_binder).
  - e2e/export-view.mjs (E-CV-OPEN, E-CV, E-CV-RESIZE, plus a FIXTURES sha256 row) and the `e2e:export-view` line in package.json.
- §9 Part Y: rows Y0 to Y4 and a blank result log, appended at the tail of MANUAL-WALKTHROUGH.md. e2e/README.md has a new "Export view spec" entry in the file's style.

DEVIATIONS
- Class 8, budget overruns (§7 not edited; the mutation-record comment lines are counted):
  - PublishPanel.tsx is 72 against a ceiling of 60.
  - src-tauri/src/publish.rs is 26 against a ceiling of 20, which also exceeds group R (20).
  - Group P is 109 against 110, so it holds.
  - I trimmed comments where I could. The remaining lines are the zero-size doc comment, the constant with its comment, the defensive-fallback comment, and the removed and added prop docs.
- Class 2, UPP1's input: the form says "disabled for null, enabled for a box". `currentViewOptionDisabled` takes the boolean (`getViewBox() !== null`), because §2.2(c) allows "that boolean or the box" and `PublishControls` takes a boolean. The test states it as false/true, plus a render case that the reason shows only while disabled.
- Class 2, a command outside the brief's list: `npm run verify` runs `pretypecheck` (`buildViewerFirst.mjs`), which needs `npm ci` in renderer/bundle-viewer. I ran it inside a shared hold; it exited 0.
- Class 2, E-CV's corner view: the form says "a corner view" without coordinates. The suite first prepares Current view to read the fit box, then sets the camera at that box's lower-left corner, one zoom level in (`zoom = log2(canvas width / fit width) + 1`). The box is read from the prompt's row scope, matched whole against the human's sentence.
- Item 42's replaced line was the whole on-main paragraph, including its bold lead "On main", as Amendment 3 item 5 says.
- Both commit messages carry the Claude-Session trailer from the harness note as well as the Co-Authored-By line, in addition to -s.
- No invalidator I1 to I9 fired. No edits to state/, PLAN.yaml, the form, canvas/, PublishDialog or the lockfile.

BYTE FOR BYTE
- Disabled reason, PublishPanel.tsx, verified equal to the form's §2.4 text by script and equal in the test:
  `export const CURRENT_VIEW_DISABLED_REASON =`
  `  "Not available yet — the map has not drawn this file's data. Pan or zoom the map, or choose Whole dataset.";`
- Row scope format string. In source it is one string with a continuation after "clicked " (the next line is indented, and Rust skips that indent). Joined, it equals line 14 of the directive less three spaces, and the form's block, by script:
  `row scope: the map's extent when Export interactive map… was clicked (xmin {}, ymin {}, xmax {}, ymax {}) — not the whole file`
  The arguments are `bbox.xmin, bbox.ymin, bbox.xmax, bbox.ymax`. PRS asserts it byte for byte with 2683000.5, 1248000.25, 2684000.5, 1249000.25.
- New line 194 of KNOWN-LIMITATIONS.md (four leading spaces, then):
  `    On main, fixed by export-current-view-after-unreported-fit: Current view sends the area the map shows when Export interactive map… is clicked, including after the map fits itself to the data and after a change of size, as long as the map has a width and a height. It can be chosen as soon as the map has drawn the file's data. The v0.1.0 build still behaves as described above.`
- `getViewBox` doc comment, PublishPanelProps (words are mine; Documentation):
  ```
  /** The box the map shows, at CALL TIME (`App.tsx`'s `viewBox.get`), never a snapshotted value. `null` until the map has drawn this file's data, and after each open.
   * **When the map has a width or a height of 0 this is not an area the map shows:** after a resize to 0 it is the box from before (the canvas reports nothing),
   * and after a fit at size 0 it is a box computed for 1 px. Current view sends it as it is, at both reads at the click. */
  ```

EACH TEST, ITS MUTATION AND THE OBSERVED FAILURE (all at 304ba2495dc7d4792ee9e104e146dfbc84b0a4b4, applied alone, reverted, recorded in the test's comment; no `verify-mutation` run)
- RCV1: `getViewBox` reads `lastViewportBboxRef` (decoded). FAILED by name at "the box of the fit, not of the last pan": it received xmin 0, ymin 0, xmax 100, ymax 100, which is b1. RCV3 failed too.
- RCV2: remove `viewBox.set(null)` from `handleAdmitted`. FAILED at "B's canvas has reported nothing: expected false to be true". RB-DRAWN also failed.
- RCV3: availability from a `hasSettledView` state set by `onViewportChanged` only (`getViewBox={() => (hasSettledView ? viewBox.get() : null)}`). FAILED at "a view was shown: expected true to be false", the `disabled` attribute.
- RCV4: `handleApplyFilter`'s `getLastViewportBbox` reads the view box encoded. FAILED at "the recovery asks the last pan or zoom's box": it received b2's encoded box (4044…, 404e…).
- RB18, re-aimed:
  - (i) The unchanged mutation, `onViewShown` routed into the `onViewportChanged` handler. FAILED first at "no query: expected 1 to be +0", as before the re-aim. RCV4 also failed.
  - (ii) The new recovery observer alone: `onViewShown` writes the ref and the box but issues no query. FAILED at "no last-asked box: the recovery asks the whole dataset", expected null and received a bbox.
- UPP1: `currentViewOptionDisabled` returns false always. FAILED at "disabled while the map has no view box" and at the render case.
- PRS: restore the old words. FAILED by name at its `assert_eq!`, with left "row scope: the current viewport extent only (xmin 2683000.5, …".
- The three e2e rows have their mutations written in the header of e2e/export-view.mjs as the form gives them, each marked NOT YET OBSERVED:
  - E-CV: App's getter reads `lastViewportBboxRef`, falling back to `viewBox.get()` while the ref is null, so it still fails at EV4 and not at the first prepare.
  - E-CV-RESIZE: remove the `onViewShownRef.current?.(…)` call in the `onResize` handler of WorkingCanvas.tsx.
  - E-CV-OPEN: availability from the old `hasSettledView` signal.

TITLE EDITS AND THE RB18 RE-AIM, FOR THE PR BODY
- RB18 title: "…: no query, no last-asked box, no settled view" is now "RB18: onViewShown writes the box and nothing else: no query, no last-asked box".
- RB18 body:
  - The Export-disclosure click and the Current view radio's `disabled` reads (before: "no settled view yet"; after: "no last-asked box and no settled view") are removed.
  - The refusal-recovery observer was added at the end: a refused Apply's recovery re-issue must carry bbox null, because `onViewShown` did not write the ref.
  - The "no query" and "the box was written" checks stay. Its mutation comment drops `hasSettledView`.
- PublishPanel.test.ts titles:
  - "currentViewOptionDisabled (NEXT-CUT.md P3 item 3)" is now "… P3 item 3; UPP1)".
  - "disabled while no settled view has arrived" is now "disabled while the map has no view box".
  - "enabled once one has" is now "enabled once it has one".
  - "'current' with no settled view (bbox null) yields null -- …" is now "'current' with no view box (null) yields null -- …".
  - "'current' decodes the SKP-wire (HexF64) bbox back to plain f64 -- binding-local, not SKP" is now "'current' sends the view box's four numbers as they are -- binding-local, not SKP, and nothing to decode".
  - The props case uses `currentViewAvailable: true` where it had `hasSettledView: true`.
  - New case: "a disabled Current view shows the reason, and an available one shows none (UPP1)".

COMMANDS AND EXIT CODES
- `git fetch origin`: ok.
- `npm ci` in frontends/shell, in a shared hold: completed, no error shown (I did not print its rc).
- `npm ci` in renderer/bundle-viewer, in a hold: rc=0.
- `npm run verify` in frontends/shell, in a hold: rc=0. Vitest 93 files and 1341 tests passed, plus the check scripts (76 passed, 0 failed; citationIntegrity 30 passed, 0 failed). It ran on the tree equal to 304ba249 apart from the later comment-only commit.
- `cargo test --manifest-path frontends/shell/src-tauri/Cargo.toml` with CARGO_TARGET_DIR=D:/wt-targets/cvfix, in a hold: rc=0, 67 passed in the lib including PRS.
- PRS mutation run, `cargo test … the_viewport_bbox_row_scope`: rc=101, the observed failure.
- Re-checked on HEAD eebf7298:
  - `node scripts/plan/verify-cites.mjs`: rc=0.
  - `node scripts/plan/verify-quotes.mjs`: rc=0.
  - `node scripts/plan/verify-test-claims.mjs`: rc=0.
  - `node scripts/plan/verify.mjs`: rc=0.
  - `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs`: rc=0, 457 pass and 0 fail.
  - `npx tsc --noEmit`: rc=0.
  - `rustfmt --check` on publish.rs: no diff.
  - `node --check` on export-view.mjs: ok.
- `git push -u origin cut/export-current-view-after-unreported-fit`: ok.

§7 COUNT (the form's `git diff --numstat` command, merge base f8bc2951, MANUAL-WALKTHROUGH.md and e2e/README.md excluded)
| File | Count | Ceiling |
|---|---|---|
| App.tsx | 31 | 40 |
| PublishPanel.tsx | 72 | 60 (over) |
| types.ts | 5 | 8 |
| package.json | 1 | 2 |
| src-tauri/src/publish.rs | 26 | 20 (over) |
| App.selection.test.tsx | 111 | 220 |
| PublishPanel.test.ts | 33 | 60 |
| e2e/export-view.mjs | 188 | 220 |
| Total | 467 | 690 |

- Outside the count: MANUAL-WALKTHROUGH.md +25 (ceiling 50), e2e/README.md +10 (ceiling 25), KNOWN-LIMITATIONS.md 1 line in, 1 line out (ceiling 8).

PRE-GATE SELF-CHECK
- Cross-module: the only seam is the dev hook `publishPrepareWithDestination` and the host's prompt `row_scope`. The suite reads the real prompt and matches the sentence whole. The harness stand-ins follow the real `requestViewport(bbox, bboxCrs, nowMs, filter)` signature and the real `SkpCallError` constructor.
- Every completion claim has evidence: the mutation observations above, plus the byte comparisons by script.
- User-facing messages: the disabled reason, the Row scope sentence and the item 42 note are the form's words. The reason is an unruled placeholder, as the form says.
- Every required test reaches its assertion, not only its setup. Caller grep: `getViewBox`, `subscribeViewBox`, `currentViewAvailable` and `CURRENT_VIEW_DISABLED_REASON` are all used in product code (App passes both props; the panel and `PublishControls` render the rest).

FOR THE CUSTODIAN IN E2E (I could not run e2e; launch fresh, because layout is session state)
- Suites for the PR body: `e2e:regression`, `e2e:refusal-contract-baseline`, `e2e:admission`, `e2e:filter`, `e2e:filter-panel`, `e2e:style`, `e2e:publish`, `e2e:console`, `e2e:layout`, `e2e:selection`, plus the new `e2e:export-view`. The re-sweep found no existing e2e that prepares Current view or matches the old ViewportBbox sentence.
- Observe these e2e mutations, each alone at the new head, and record them in the header of export-view.mjs:
  - E-CV (fails at EV4, F equal to A).
  - E-CV-RESIZE (fails with R equal to F').
  - E-CV-OPEN (radio disabled after the first pixels).
- Risks I could not check, so please read them in the run:
  - After Clear, `lastQueriedRef` may be non-null. A resize would then go through `onViewportWithinLastQuery` and not the `onViewShown` arm the E-CV-RESIZE mutation removes, so the mutation might not discriminate. If so, class 2 for the form.
  - If the native window is already at 1024x640 or smaller, E-CV-RESIZE fails as inconclusive by design.
  - EV5 (Z against F) is recorded, not asserted.
- Part Y rows Y0 to Y4 are the human's sitting; Y4 is the P6 sight of the disabled reason and the Row scope sentence.

Files, all in C:/dev/wt/cvfix: frontends/shell/src/App.tsx; frontends/shell/src/publish/PublishPanel.tsx; frontends/shell/src/publish/types.ts; frontends/shell/src-tauri/src/publish.rs; frontends/shell/src/App.selection.test.tsx; frontends/shell/src/publish/PublishPanel.test.ts; frontends/shell/e2e/export-view.mjs; frontends/shell/e2e/README.md; frontends/shell/package.json; frontends/shell/MANUAL-WALKTHROUGH.md; KNOWN-LIMITATIONS.md.
