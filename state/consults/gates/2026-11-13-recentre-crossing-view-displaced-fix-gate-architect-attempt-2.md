Reviewed: PR #311 at eb63a3f80c9d321ae37e6d0f2cbfd4d0df7dd2f8 (the custodian's filing note, 2026-11-13: the gate, the architect, attempt 2, its re-gate after its attempt 1 FAIL on E-1, dispatched beside the reviewer under Part 1, items 5 and 6 of the rulings on gate rounds, PLAN node recentre-crossing-view-displaced-fix, slot 2; its READING (2026-11-13) lines are taken under the human's standing rule of 2026-11-12 and the form's Amendment 4 item 2, for the human's review at the click; its pins marked for the custodian or a reviewer to compute; below, the hand-back byte-identical, one final newline added)
Reviewed: PR #311 at eb63a3f80c9d321ae37e6d0f2cbfd4d0df7dd2f8 (base 9398efc6), gate, architect, attempt 2
Verdict: PASS WITH NOTES
Branch and commit: cut/recentre-crossing-view-displaced-fix @ eb63a3f80c9d321ae37e6d0f2cbfd4d0df7dd2f8. The cites below are read at that commit. H2 means that commit, H1 means b7ba9f77cf737d1e1ea4d23545c36ea87b26a41a, B means 9398efc6e3db7474cc9b1346ea9e1a5f1d5c7832, and M means main at 2cde106937f22f126c67e79e538be19f09b83e1c.

I have no shell, so I ran no git, `gh pr checks 311` or test, and I leave no background shell. Main lines carry `sha256:<H>` for the custodian to fill. Branch lines are named by commit and are not pinned, under §4's last bullet and §11 item 10. Cites into `frontends/shell/node_modules/@deck.gl/core` (9.3.9) point at untracked files: they are evidence, not Authority.

Worktree note: partway through this gate, `C:/dev/wt/rcg/frontends/shell/src/canvas/WorkingCanvas.tsx` changed to B's text. A Grep found B's wording at its lines 2100 and 2323, and one Read reported a 1-line file. The likely cause is the reviewer's run at the base. Everything I read in rcg before that matched the diff's added lines. After that, I read `WorkingCanvas.tsx` from the worker's worktree `C:/dev/wt/rcf`, which is at H2 and which I only read.

Why not WORKS-ONLY: nothing blocks. The two Documentation findings below do not block, but each must be fixed before the merge.

## Findings

### Correctness
None.

### Evidence
None. E-1 is closed (check 1).

### Documentation (must fix before the merge; neither is the human's wording; the worker applies the words with no re-gate, and the PR body lists them)

**D-4. The README entry's exit-code sentence: my own attempt-1 words for D-3, as applied** (`frontends/shell/e2e/README.md:848 @ eb63a3f80c9d321ae37e6d0f2cbfd4d0df7dd2f8`, the second sentence-line of the hunk at diff line 13).
- The defect: "1 when one or more fails" is untrue for a run in which a step fails and a VOID comes later. `main()` checks `voided` first and exits 2 (`recentre-crossing.mjs:340 @ eb63a3f80c9d321ae37e6d0f2cbfd4d0df7dd2f8`), before it reads any failure (`:341-343`). An error that is not a VOID is rethrown (`:335`) and exits 2 (`:347`) whatever failed before it. An operator can reach this: for example, case 1 fails and then case 2's drag-out VOIDs at `:300` or `:307`.
- Replacement words (the whole sentence): Exit 0 when all six asserted steps pass, 1 when one or more fails and the run ends neither VOID nor on a fatal error, 2 when the run is VOID — among others when the fit line never arrives, case 1 has no origin change in a leg, case 2's drag-out cannot land inside its window, or an app is already listening on the CDP port — or ends on a fatal error, even after a step has failed; a VOID run is never a PASS.
- Clause check (all in `recentre-crossing.mjs @ eb63a3f80c9d321ae37e6d0f2cbfd4d0df7dd2f8`):
  - "six asserted steps": the `record` calls at `:280`, `:283`, `:287`, `:316`, `:318` and `:325`. (c) is a `console.log` at `:285`.
  - "1 when one or more fails and … neither VOID nor fatal": `:343` is reached only after `:340` and outside the catch at `:347`.
  - The VOID causes: `:94`, `:278`, `:300`/`:307` and `:66`. "Among others" covers `:107` and `:114`.
  - "fatal error, even after a step has failed": `:335`, then `:347`.
  - "never a PASS": `:340`.
- Size: one line replaced inside an added line, so the README sum stays 12 of 45.

**D-5. The settled-tick sentence: the reviewer's D4, as applied** (`frontends/shell/src/canvas/WorkingCanvas.tsx:2101-2104 @ eb63a3f80c9d321ae37e6d0f2cbfd4d0df7dd2f8`).
- The defect: "would leave the origin where it is until the next tick the guard below lets through" leaves out the fit. `fitToExtent` (`:1404`) moves the origin by `forceRecenter` (`:1416`). It is reached by the layer-fit handle (`:1609`), by `fitToBbox` (`:1614`) and by the one-shot fits (`:1568`, `:1782`). So in the sentence's own case, a "zoom to layer" click moves the origin before any guarded tick does.
- Replacement words (the whole sentence): A deck upgrade that stops emitting that tick -- or a gesture ended by `pointercancel` with no `panend`, neither read nor run -- would leave the origin where it is until the next tick the guard below lets through or the next fit (`fitToExtent`, which re-centres by `forceRecenter`; in a dev build also the E2E view-state seam), and the frame's offset may exceed the re-centring bound until then; that is not measured, and there is no in-code fallback.
- Clause check (`WorkingCanvas.tsx @ eb63a3f80c9d321ae37e6d0f2cbfd4d0df7dd2f8`):
  - "the next tick the guard lets through": the only `maybeRecenter` call is the guard at `:2153`. The other hit, `:2144`, is a comment.
  - "the next fit … `forceRecenter`": `:1416`, reached as above.
  - "in a dev build also the E2E view-state seam": `forceRecenter` at `:2365`, behind `if (!import.meta.env.DEV) return;` at `:2347`. This is a dev-only case, named here as the wording rule asks.
  - "may exceed the bound until then": ticks outside the guard move the target with no re-centre (`:2153`).
  - "not measured" and "no in-code fallback": carried words. No record measures the case, and the handler has no timer.
- Size: at most one comment line more, so `WorkingCanvas.tsx` goes from 67 to at most 68 of its ceiling of 70 (§7, `governance/forms/frontends/RECENTRE-CROSSING-VIEW-DISPLACED-FIX-PREREGISTRATION.md:381 @ 2cde106937f22f126c67e79e538be19f09b83e1c sha256:<H>`).

### Notes (not acceptance conditions; Part 1 item 6)
- **N-1.** The header's line 23 in `recentre-crossing.mjs @ eb63a3f80c9d321ae37e6d0f2cbfd4d0df7dd2f8` has the same precedence gap as D-4. It is H1 text, outside this correction, and I passed it at attempt 1. The worker may fix it with D-4.
- **N-2.** `FakeDeck.viewState` is still `any` (test file `:57 @ eb63a3f80c9d321ae37e6d0f2cbfd4d0df7dd2f8`). deck declares it as `ViewStateObject<ViewsT> | null` (`dist/lib/deck.d.ts:217`). E-1's closure did not name it.
- **N-3.** In the mutation worker's report (`<S>/rcfm-report.txt`, line 23), "No refusal." sits on the hold line, so I read it as being about the holds. The refused Edit that the packet names is not in the report. The custodian's filing note can say so.

## Checks

**1. E-1's closure, bullet by bullet, against C1 (0153449420ccda2ce0ec17f1d635921a1fb6a6e0; the test file is the same at H2).**
- **Bullet 1, met.**
  - `import type { DeckProps, InteractionState, ViewStateChangeParameters } from "@deck.gl/core";` is at `WorkingCanvas.recentre.test.tsx:21 @ eb63a3f80c9d321ae37e6d0f2cbfd4d0df7dd2f8`.
  - `props`, the constructor and `setProps` are typed `Partial<DeckProps>` (`:56`, `:58`, `:64`).
  - deck's side: `dist/index.d.ts:67` re-exports `DeckProps` from `lib/deck.js`, and `DeckProps<ViewsT extends ViewOrViews = null>` is declared at `dist/lib/deck.d.ts:56`, with `views?: ViewsT` at `:110`, `initialViewState?` at `:124` and `onViewStateChange?` at `:153`.
  - So the fake's reads of `initialViewState`, `onViewStateChange` and `views` now fail the type check if deck renames those props.
- **Bullet 2, met in substance.**
  - The fake's `tick` takes `interactionState: InteractionState` (`:77`) and builds `params: ViewStateChangeParameters` with `viewId` (`:78`).
  - deck: `dist/index.d.ts:85` re-exports `ViewStateChangeParameters` and `InteractionState`, declared at `dist/controllers/controller.d.ts:57-70` and `:72-80`. `viewId: string` is at `:73`, so the worker's statement that nothing had to be added for it is true.
  - `FakeDeckLike.tick` (`:105`) and the helper `tick` (`:164`) use `InteractionState`.
- **The cast through `unknown` (`:82-84`).**
  - It keeps the typing of the `views` key. It opens one narrow gap: the `.id` read is not checked against deck's `View` (`dist/views/view.d.ts:47`, `id: string`).
  - The cast exists because the default instantiation types `views` as `null` (deck.d.ts:56, :110). The worker's first `tsc` run failed with TS2352 on exactly this, which shows the typing is live.
  - The gap does not reach the test's verdict. The fake reads `id` from the real `OrthographicView` that the product passes (`WorkingCanvas.tsx:2052 @ eb63a3f80c9d321ae37e6d0f2cbfd4d0df7dd2f8`). If deck renamed that field, `viewId()` would return undefined, `camera()` would fall back to the root state, and `dragPastTheBound`'s expectation at `:171` would fail.
  - A closer typing, offered as a note and not a condition: `Partial<DeckProps<OrthographicView>>`, matching the product's `Deck<OrthographicView>` (`WorkingCanvas.tsx:872 @ eb63a3f80c9d321ae37e6d0f2cbfd4d0df7dd2f8`), with `this.props.views!.id`.
- **Bullet 3, met. I rely on the records; the reviewer observes the runs.**
  - Correction worker (`state/consults/2026-11-13-recentre-crossing-view-displaced-fix-correction-1-worker-report.md:17-22 @ 2cde106937f22f126c67e79e538be19f09b83e1c sha256:<H>` and `:29-31 @ 2cde106937f22f126c67e79e538be19f09b83e1c sha256:<H>`):
    - `tsc --noEmit` rc 0 after C2, which is H2;
    - U1 and U2 pass at C1;
    - with B's `WorkingCanvas.tsx` in place, rc 1, 2 of 2 fail, with the failure lines P-U-base predicts;
    - `npm run verify` rc 0 at H2, 1458 tests.
  - C2 touches no test file, so the C1 runs stand at H2.
  - No type check at the base is recorded. The closure asks for the type check at the new head only.
  - Mutation worker (`<S>/rcfm-report.txt`, sha256 per the packet): at H2, head 2/2 pass; M-U1 2/2 fail (U1 at crossing 1, by name); M-U2 1 fails (U2 at (a), by name); head 2/2 pass again; each revert checked.
  - I read its four logs (`rcfm-head1.log:5-6`, `rcfm-mu1.log:11-12, 24-25, 38-39`, `rcfm-mu2.log:10-11, 41-42`, `rcfm-head2.log:5-6`), and they match the report.
  - The logs do not carry the commit. The commit comes from the report's header.
  - The mutations were applied by hand, not by `verify-mutation`, as §4 requires (`…PREREGISTRATION.md:325 @ 2cde106937f22f126c67e79e538be19f09b83e1c sha256:<H>`).

**2. What the correction added, each changed line in `rcf-g2-diff.txt`.**
- **D-1** (README, diff line 10): it sits as my attempt-1 words, compared span by span. The clauses are true against the code:
  - case 1 (a), (b) and (d): `recentre-crossing.mjs:280-287`;
  - the double-click carries the target past the bound by construction: the window (0, half] at `:295-307` and the shift at `:311-312`; T is capped at 131072 at both zooms (`:42`, `:115`);
  - no origin until its settle: (i) at `:316`;
  - the zoom completes: (ii) at `:318`;
  - the wheel notch moves the origin, not the view: (iii) at `:324-325`, which fails when there is no origin change.
- **D-2** (`recentre-crossing.mjs:8`): sits as given. It is true: `:64-66` VOIDs when `launched` is false.
- **D-3** (README, diff line 13): sits as my words. One clause is untrue: D-4 above, my own defect.
- **Reviewer's D2** (`WorkingCanvas.tsx:2337-2340 @ eb63a3f80c9d321ae37e6d0f2cbfd4d0df7dd2f8`): applied as given, and every clause is true:
  - `fitToExtent` uses `forceRecenter` (`:1416`) and `setProps({ initialViewState })` (`:1424`);
  - the seam uses the same pair (`:2365`, `:2370`) outside the handler (`:2091-2173`);
  - the top doc comment gives both why and where (`:95-109`);
  - the continuation at `:2341` holds, since `onViewportChangedRef.current` is called only at `:1092`.
- **Reviewer's D4** (`:2101-2104`): applied as given. "Harmless" and "by one gesture" are gone, and "not measured" is stated. One clause is incomplete: D-5 above.
- **The test-file lines:** check 1. They change no assertion or input: the diff touches types, one call site and the private helper only.

**3. §11, item by item, against the correction diff** (`…PREREGISTRATION.md:436-447 @ 2cde106937f22f126c67e79e538be19f09b83e1c sha256:<H>`)
1. No edit to `pan-anchor.mjs`, its tolerance or `offsetFrame.ts`: met.
2. No dependency or lockfile change: `import type` only, from a package the shell already depends on; the worker's `git diff --quiet` on the lockfile is rc 0. Met.
3. No trace line changed: met.
4. No `viewState` prop and no in-callback `setProps`: the product diff is comments only. Met.
5. No new product export, option or code path: `viewId()` is private to the test's fake. Met.
6. No read of `info.coordinate`: met.
7. E1 is unchanged except its header comment: met.
8. No tolerance or prediction changed: met.
9. No app string changed: met.
10. Met:
    - both reports call the mutations hand-applied observations, not `verify-mutation` runs;
    - the test-text failure lines are named at H2 (mutation report) or at C1 with B's product file (correction report);
    - no hash is pinned at a branch commit.
11. Not applicable: no fix commit in the correction. Met.
12. OPEN-1 was settled before the correction: met.

**4. Readings** (Amendment 4 item 2, `…PREREGISTRATION.md:781 @ 2cde106937f22f126c67e79e538be19f09b83e1c sha256:<H>`). None of them changes what a check is for.

READING (2026-11-13) on READING QUESTION 1: keep the half-extent term, as Amendment 4 item 1 orders, and give the 4.0-plus-outline figure beside it.
- Reason: a polygon's bounds extent already contains each polygon's half-extent, so the term counts it twice and loosens the check by about 1.3 buffer px.
- But the term is the human's typed instruction (`…PREREGISTRATION.md:778 @ 2cde106937f22f126c67e79e538be19f09b83e1c sha256:<H>`), and a reading may not drop it.
- On this run both readings give the same verdict: 0.627 and 0.286 are under 4.0.
- For the human: H-3 below.

READING (2026-11-13) on READING QUESTION 2: D4's sentence at H1 was an Evidence finding, not Documentation.
- Reason: "harmless" and "by one gesture" claim a limit that no record supports. A limit claim is one of the three things the proportional-gates rule says are never documentation-only, and the wording rule keeps an untrue limit claim out of its scope.
- §3 also forbids any claim about `pointercancel` (`…PREREGISTRATION.md:307 @ 2cde106937f22f126c67e79e538be19f09b83e1c sha256:<H>`, and `:310` on the deferral).
- No record shows that `pointercancel` with no `panend` cannot be reached in the shipped app, so the wording rule's exemption for cases ordinary use cannot reach does not apply.
- Consequence now: none. The applied words withdraw the claim at H2, and attempt 1 had already failed on E-1, so no extra round follows.
- Correction to my attempt 1, check 3: I read the carried "harmless … one gesture" clause as true. The reviewer is right that a deck which stops emitting the settled tick never re-centres in a pan-only session, so that check 3 sentence is withdrawn.

READING (2026-11-13) on the reviewer's check 10: it used the inputs that my readings (a) to (d) of 2026-11-12 name, and its verdict stands.
- (a) The extent comes from the bbox column's statistics, which give the same union.
- (b) 16.8 m × 2^z = 1.299 px, with bw/cw = 1 at 668×712.
- (c) The outline width is 0.
- (d) Same-side edges: left with left, bottom with bottom.
- My arithmetic from its end line (z = -3.692532927362801, 2^z ≈ 0.077346, W ≈ (2603460.1142, 1200019.9024)) gives left 66.63, bottom 357.29, right 1046.87 and top -619.86, matching the reviewer's figures. Both K edges are within 5.30, and also within 4.0. The fixture reaches the top and right edges, so the start image is the partial one: no stop.
- This is arithmetic, not a measurement.

**5. Main made untrue by the correction.** Nothing.
- The correction worker's report on main matches the diff:
  - `Partial<DeckProps>`;
  - `viewId` at controller.d.ts:73;
  - README +2/-2;
  - `.mjs` +1/-1;
  - `WorkingCanvas.tsx` +7/-6, so the B...H2 sum is 67.
- §4's description of the fake stays true.
- KNOWN-LIMITATIONS item 17 is unchanged in standing: H-1 of attempt 1 still stands for the human.
- The filed gate reports are history. My attempt-1 check 3 sentence is corrected under READING QUESTION 2 above.
- PR #311's CI: not read, because I have no shell.

## For the human
- **H-1 and H-2** of attempt 1 stand unchanged: KNOWN-LIMITATIONS item 17, and A7a's return leg at its own zoom.
- **H-3.** For later gates on polygon fixtures whose extent is taken from the geometry's bounds: whether the half-extent term of Amendment 4 item 1 should apply at all. It does not change this gate.
- **H-4.** Whether gate-log row 733, the reviewer's attempt-1 PASS WITH NOTES, is reclassified under the READING QUESTION 2 reading above. It changes no outcome.

## The packet's gaps
- It does not say that the reviewer's runs share `C:/dev/wt/rcg`. Its `WorkingCanvas.tsx` changed to B's text during this gate, and I read H2 from `C:/dev/wt/rcf` instead.
- PR #311's CI state at H2: I have no shell, so I could not read it.
- Whether a type check was run with B's product file. The closure does not ask for it, and no record has it.
- The mutation logs do not carry their commit; it comes from the report's header only.
