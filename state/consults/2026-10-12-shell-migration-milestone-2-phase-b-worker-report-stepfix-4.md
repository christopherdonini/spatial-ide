*Custodian's filing note (2026-10-12): the worker-high's report on milestone 2's phase B fourth e2e step fix (E-ZOOMSEL, E-NODRAG and E-CLICK-FAST strengthened; E-ASK (2) noted as unit-proven), branch cut/shell-migration-milestone-2-phase-b at 719568f898c932f869ea98807c4740996df91b93, the run 2026-10-12T10:50:11Z to 2026-10-12T11:02:35Z by its transcript (Read 7, Bash 31, Edit 4); its one SubagentHandback call, at 11:02:34Z. It arrived as a message and is extracted here by script. 0 rooted path:line cite(s) are de-rooted by script and one final newline is added; nothing else is changed. The message's sha256 as handed back is 592da9ee120fc47bfa81fd554dbe2eab70d46053c98fa5a1a3db9e94a0abd484; this file's, from line 5 to the end, is 592da9ee120fc47bfa81fd554dbe2eab70d46053c98fa5a1a3db9e94a0abd484.*

---

All three e2e steps are changed and pushed. I could not run e2e, so none of the mutations has been applied or observed. Every claim below is by reading code.

**Head.** 719568f898c932f869ea98807c4740996df91b93, pushed to cut/shell-migration-milestone-2-phase-b. It is one commit on a6607738, with the subject you named, signed off, and the Co-Authored-By trailer. Only `frontends/shell/e2e/selection.mjs` changed. I ran `git fetch origin` first. The head matched and the porcelain was empty.

**E-ZOOMSEL.**
- The step cannot read the view box. The view-state trace has no union bounds to compare it with, and the Feature tab only gives an outside count. So I used a highlight-pixel floor derived from the drawing buffer.
- The step now polls `capturePixels` for the width, height and alpha-255 count together. It requires `opaque - before >= max(8, ceil(1.5 * min(bufW, bufH)))`. The constant is `FIT_OUTLINE_MIN_PER_SIDE = 1.5`. The outside-equals-0 check is kept.
- It holds for the true fit. `fitViewStateForBbox` leaves a 10% margin per side, so the outline spans 80% of the limiting buffer side. It crosses every column or row of that span at least twice, with at least one alpha-255 pixel per crossing. That gives at least about 1.6 times the shorter side, and 1.5 is under that bound. Your unmutated run read 3866. The map was about 668 px on its shorter side when E-FIT last recorded it, which puts the floor near 1000.
- It fails for a point box. A zero-span box takes `DEGENERATE_FALLBACK_ZOOM = 0` in `src/canvas/extent.ts`, so the view is centred on the corner at 1 px per world unit and the feature is small. Your mutated run read 428, against a floor near 1000. The outside count alone cannot catch this, because the point box still touches the view (your run showed outside 1 to 0).
- This rests on the 668 px canvas figure. If the map were under about 430 px on its shorter side, 428 would clear the floor. I do not know the canvas size of your run.
- A margin of up to 10% per side passes.

**E-NODRAG.**
- The unmutated drag ended about 15 px from the pressed feature. The pan is anchored at the first move that crosses the recogniser's threshold, so the content under the release was not the selected feature. That is my reading of deck, not something I observed. It would explain why the stray tap changed nothing.
- The step now selects Select, reads the pressed mode, and sets Add / remove, which is toggle. The default is already toggle, so I think that clause is belt and braces. In a `finally` it restores the prior mode if that was something else.
- The drag's first move is a single 12 px jump onto the feature's pixel p. It then goes out 60 px and back to p, so the content under the release is the selected feature. Under mutation (1) the stray tap deselects it, `Selected` becomes 0, and the held assertion fails. Unmutated, the net press-to-release distance is 12 px, so Hammer sees no tap and `Selected` stays 1.
- If the pan is not anchored where I assume, the release is no worse off than before, so the mutation may still pass.
- Mutation (2), `dragPan: false`, still fails on the view box. The assertions after the held drag are unchanged: the view-box check and the selection-count check.

**E-CLICK-FAST. Outcome: made deterministic if Chromium synthesizes no pointermove for an input at a new position; not observed.**
- The step reads the scheduler and the pick path, and that is why the race went unreproduced. Deck picks hover in its render frame. An awaited `page.mouse.move` returns only after that frame has run, so the hover readout had caught up by the click.
- The step now stands on A for 400 ms. It then sends `Input.dispatchMouseEvent` mousePressed and mouseReleased at B over a CDP session, with no mouseMoved to B first. The real pointer button events reach deck, and deck's hover never sees B. So `lastHoverReadoutRef` still holds A when the tap resolves.
- Unmutated, the tap picks afresh at B and the Feature tab shows B's id. Under the mutation the tap would return A's readout and the step fails on the id.
- There is a fallback. If the CDP send throws, the step falls back to the old move, down, up path and says "race-dependent" in the note.
- The PASS note records whether the hover readout stood on A through the click. If it had moved off A, the note says the stale read was not reproduced. That case is not an assertion failure, because the id assertion holds either way. In that case the mutation is not discriminated in that run, and the custodian should record it as class 2 (UB8 is the proof).

**E-ASK (2).** Its two header lines are replaced by one: proven by RB12b at unit level in `App.selection.test.tsx`, and not observable in e2e.

**Header.** The E-CLICK-FAST, E-NODRAG (1) and E-ZOOMSEL entries now describe the new mechanisms. The header still says this stage applied no mutation.

**§7 count.** 698 insertions + 8 deletions = 706, by `git diff --numstat c96e5329...HEAD` after the commit. That was 663 before. The allowance is about 750.

**Commands, in `C:/dev/wt/mm2b` unless noted. All exited 0.**
- `node --check e2e/selection.mjs` from `frontends/shell`: exit 0.
- `node scripts/plan/verify-cites.mjs`: exit 0.
- `verify-quotes.mjs`: exit 0.
- `verify-test-claims.mjs`: exit 0.
- `verify.mjs`: exit 0.
- `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs` from the repository root: exit 0, 457 pass, 0 fail.
- `git commit -s` exit 0. The push printed `a6607738..719568f8` and exit 0 for that command could not be read separately, because I piped it through `tail`.

**Final porcelain.** Empty. No background processes were started.

**Off-scope, not touched.** Nothing.
