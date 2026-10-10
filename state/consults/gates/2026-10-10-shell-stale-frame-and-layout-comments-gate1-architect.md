# PR #203 gate 1 — architect
Reviewed: cut/shell-stale-frame-and-layout-comments @ dce20da2c21391e6b1aca57b6ffbb58f4465c545

**Verdict: pass with notes.** Correctness: PASS. Evidence: PASS, with one note (EV-n1). Documentation: three findings (DOC-1 to DOC-3). Each must be fixed in this PR before the merge, with no re-gate.

**How I read it.** I had read-only access and no shell.
- The worktree `D:/wt/docb` resolves to `refs/heads/cut/shell-stale-frame-and-layout-comments` = dce20da2. Its origin ref matches.
- The reflog shows the base 78fc2c7e and seven commits.
- For the base side of each file I read main's checkout. Every main commit since 78fc2c7e is a record commit outside these 11 files.
- I did not recompute any hash. The gate-1 reviewer recomputed all nine Authority and Amendment 7 pins. None of the pinned files has changed on the branch since.

## Correctness: PASS

**The lane's terms** (`state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:19`) hold.
- 11 files changed: nine `.ts`/`.tsx`/`.mjs` files with comment-only changes, plus the row S1 sentence and Amendment 7.
- Nothing under `scripts/plan` or `protocol/` changed, and no ADR file changed.
- Code and strings are byte-identical, on two independent identity scripts: the reviewer's at dc289564, and worker report 2's at dce20da2, 0 files differing.
- Comment directives are also unchanged. The identity scripts strip comments, so I checked these separately. `eslint-disable-next-line` appears 5 times in `WorkingCanvas.tsx` and once in `PublishPanel.tsx`, and the JSDoc `@type` appears once in `style.mjs`. Each count is the same at the base and the head, only shifted in line number. No changed file has a `@ts-`, `@vitest` or triple-slash directive. So no changed comment can change the typecheck or the test outcome.
- Rule (00) holds: #202's form (`kernel/FILTER-IDENTITY-ALIAS-AMBIGUOUS-THROUGH-SKP-PREREGISTRATION.md`) names none of these paths.

**The Out-of-scope line holds. The `layoutBoundary.test.ts` header changes the description only, not the property under test.**
- Head lines 18–58 equal base lines 17–57: `FORBIDDEN_DIRS`, `SPECIFIER`, `forbiddenImports`, both `it` names and bodies, and the recorded-mutation comment.
- The narrowed header now states exactly U4's registered property: "No file under src/layout/ imports from …", at `frontends/shell/SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md`, the U4 row of §4.
- It drops "cannot reach the map's code", which is false at the base: `regionParts.tsx:7-8` and `statusItems.ts:4-5` import `../App`. It also drops "adds no history step", which the scan never tested.
- §2.3(a) of that form (no SKP call, no history step) is untouched, and U4 is not claimed to prove it.
- This is the human's item b at line 24. No guarantee is touched; an over-claim is withdrawn.

**Each changed comment checked against the code at the base and against the ruling it cites. All hold.**
- **`residencyStatus.ts`, string 6** (head :400-402 and :425-427): ruled 2026-09-06 in entry 45's RULED block, "(1) String 6 = A". The label now discloses the collapsed line break and claims no byte identity. The comment uses no quotation marks.
- **Strings 1 and 2** (:353-355): the 2026-09-05 block ("1 approved", 'not fetched'→'not loaded') and the 2026-09-06 block ("1/2/4 confirmed as shipped") support them. The D2 fix (:359-360) marks the quoted text as the drafted wording, and the shipped template at :439 ends "not loaded."
- **String 3** (:370-373): the constant at :447 matches the 2026-09-06 trim.
- **String 4** (:383-384) and **string 5** (:389-390): the 2026-09-05 and 2026-09-06 blocks support them.
- **`STALLED_SUFFIX`** (:404-406): supported.
- **Markers left as they are:** the two at :343-344 and :436 already say "ruled" or "shipped". Worker report 1 lists them, and it found no unruled marker, which meets the string-6 directive's item 3.
- **`HOVER_REPICK_ON_PAN`** (`hoverRepickConstants.ts:37-40`): the RULED 2026-09-14 block, question set B, item B3, entry 75 (1), supports it. The default `true` matches "Default stays pan+zoom". The flip rule is paraphrased and not quoted.
- **Console**: the Activity region's Console tab. `contributions.ts` `ACTIVITY_TABS` and `App.tsx:1986` `"activity.console"` support it. The D4 attribution is gone.
- **Style**: the Inspector's Style tab. `INSPECTOR_TABS` and `App.tsx:1957` support it, `.canvas-container` is `height: 100%` (`styles.css:411-415`), and the minimum is `MAP_MIN_*` in `layoutConstants.ts`.
- **Export**: the Inspector's Layer tab. `StudioLayout.tsx:256-273` maps `LAYER_SECTIONS` inside `inspector-panel-layer`, and `contributions.ts:63-64` supports it. The D1 fix is correct.
- **deck.gl**: `package.json:43` is `^9.3.7` and lockfile line 453 is 9.3.9. 9.3.7 is kept only at the sites where it was observed.
- **The e2e HISTORY notes**: `App.tsx:1869` `"attention.canvasRefusal"` supports them, and the suite's one expand matches the code.

**Row S1 and Amendment 7.**
- `MANUAL-WALKTHROUGH.md:1579` at the head carries the second quoted text of directive line 24, byte for byte.
- Part S is the Operator gate of §9 in `engine/MULTIPOLYGON-MP1-PREREGISTRATION.md`. S1 is as Amendment 1 rewrote it, and its result log is blank, so Amendment 7 item 4 is true.
- Class 3 fits: an operator-facing test string, with the superseded span pinned at 78fc2c7e, which is on main.
- Item 3 names the branch commit 4190e428 and no hash, so the round 25, item 2 fail-by-name does not apply. See DOC-1 for the merge.

**Amendments 1 and 2.**
- **Class 6** fits both. Amendment 1: 12 files declared against §21c's 8. The template's class-6 text covers file count, and `REUSE-ROUND-1-BUNDLE-PREREGISTRATION.md` Amendment 1 is the precedent, a size wrong from dispatch. Amendment 2: 144 against 140.
- **The route** is correct. AUTONOMY.md §21c says a diff that crosses any one bound takes full gating, so both gates apply.
- **Amendment 2's figure**: I re-added worker report 2's numstat table. It gives 89 + 55 = 144. Per file, the delta from gate 1's 134 is +3 / +1 / −1 / +2 / +5 = 10. 144 is under §21c's 150.
- **Amendment 1 item 4** is correct. AUTONOMY.md §15 says the generation bumps on any preregistration amendment. Main's PLAN has `geometry-types-beyond-polygons` at generation 7, and the bump to 8 lands in the custodian's done commit on main, outside the PR diff. So it is neither a Scope addition nor class 9.
- **Generations**: main's PLAN has both docs nodes at generation 3, which matches Amendment 2 item 4.

**The PR body against the head.** I read the custodian's scratch copy, which names dce20da2 and Amendment 2; confirm it is the live body. Its claims hold: files, base, head, 144, the D1 history, and the byte-copied blockquote, which matches line 24's second quoted text. The exceptions are DOC-1 and DOC-3.

## Evidence: PASS
- **EV-n1.** The form's Tests+mutation line says typecheck and vitest run once at H.
  - At dce20da2, worker 2's typecheck ran before its last three re-wraps, and vitest last ran green at 4190e428.
  - The comment-directive check and the identity script at the head show that those outcomes cannot differ at dce20da2.
  - The head's own run of record is CI's "typecheck · build · vitest · cargo test" job at dce20da2. The reviewer's re-gate reads it there. If it is red, that is a block.

## Documentation (must be fixed in this PR before the merge; no re-gate)
- **DOC-1. The PR body does not ask for a merge commit.**
  - Amendment 7 item 3 names the branch commit 4190e428. That reference resolves after the merge only if the commit stays reachable from main.
  - The PR body should name row S1 and ask for a merge commit, never a squash, as round 25, item 2 (d) prescribes for a branch-commit test-text reference.
  - Add `merge: merge-commit` to the two nodes in the done commit, as `geometry-types-beyond-polygons` carries.
- **DOC-2. The D4 fix left a long comment line.**
  - `frontends/shell/src/console/ConsolePanel.tsx:23` runs to about 130 columns, the same defect class as D5.
  - `frontends/shell/src/publish/PublishPanel.tsx:312` is an orphaned "(milestone 1):" line.
  - Re-wrap inside the already-changed lines (ConsolePanel 21–23, PublishPanel 311–313) so the §21c figure stays 144. If the figure moves, the done record names the final numstat figure at the merge head.
- **DOC-3. The PR body's checks name no commit.**
  - "`npm run typecheck`: exit 0" gives no commit. Name the commit of each run, and cite CI's job at dce20da2 as the head's run.
  - Close "The custodian re-runs it alone" (`noticeDeterminism.test.ts`) with the solo run's result and commit, or strike the sentence.

No ADR skeleton is needed: no decision is missing.
