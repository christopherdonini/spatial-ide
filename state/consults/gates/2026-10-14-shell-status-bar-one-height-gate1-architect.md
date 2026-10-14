Reviewed: PR #218 at 6f72d0a7674509b2cee7d7525d234e92018ce053 (base f8bc2951), cut/shell-status-bar-one-height @ 6f72d0a7674509b2cee7d7525d234e92018ce053
Verdict: PASS WITH NOTES

**What the verdict rests on.** I read the code at the head in C:/dev/wt/sb1h. The worktree's reflog shows that 6f72d0a7 changes only a comment over d9e9b817 (its commit message says so).
- At d9e9b817, run 2 records E-STATUS-HEIGHT passing twice: 388 x 712 in A, B and C, with the bar at 48. It also records the mutation failing at S3 (736 before the notice, 718.640625 while it stands).
- Run 1 at e1f92a97 records every other suite green except pan-anchor. Only e2e/selection.mjs changed after e1f92a97.

**The verdict does not rest on pan-anchor.** Run 1 records it failing at the head in 2 of 3 runs, plus the diagnostic runs, with grab-point residuals of 800 and 1100 px. I accept the custodian's reading for now, on two grounds:
- the stale `setCam` line;
- three green control runs at f8bc2951 with the same 788 x 812 canvas.

That reading is not proof. **Condition for merging:** pan-anchor's runs alone, in an exclusive hold at the head, must pass. If it fails there, I7 fires: the piece stops, and this verdict is void. That outcome is not a documentation fix.

## Correctness
None found. By construction:
- the status row is `var(--status-h)` (frontends/shell/src/styles.css:34), and so is the bar's height (:162);
- both come from one constant (frontends/shell/src/layout/StudioLayout.tsx:203, frontends/shell/src/layout/layoutConstants.ts:36);
- no other row track or variable is set from slot content (StudioLayout.tsx:194-204);
- the map track is `minmax(0, 1fr)`.

So the map's size does not depend on what the bar holds. The wrap (styles.css:165) and the scroll (:163) are kept, and the fit's chrome is unchanged at 216 (frontends/shell/src/layout/layoutState.ts:138).

## Evidence
None blocking.
- SB1 and SB2 (frontends/shell/src/layout/StudioLayout.test.tsx:207-233) use the real StudioLayout with nothing mocked. Their mutations were observed at 5bea403c.
- E-STATUS-HEIGHT (frontends/shell/e2e/selection.mjs:741-816) follows S0 to S3, G1 and G2 as Amendment 1 sets them, at Amendment 3's window.
- The CDP calls have the shape pan-anchor actually uses (frontends/shell/e2e/pan-anchor.mjs:180-191). Run 2 proves them end to end: the inner size was 880 x 800 after the resize and 1280 x 800 after the restore.
- The mutation record at selection.mjs:59-60 matches run 2's failure line byte for byte and names its commit.

## Documentation (fix before the merge; no re-gate; section 31: none of this is the human's wording, so the worker applies it and the PR body lists it)

**D-1. frontends/shell/src/layout/StudioLayout.tsx:46-47.** The comment cites the form's §2.4. That section as drafted describes the toggle that fell away; the binding text is Amendment 1's restatement. Replacement words for lines 46-47:
```
 * The status bar's grid row and its height are one value, `STATUS_BAR_HEIGHT_PX`
 * (SHELL-STATUS-BAR-ONE-HEIGHT-PREREGISTRATION.md Amendment 1, §2.4 (d)), so a status item coming or going never changes the map's size.
```
Clause check:
- grid row: styles.css:34.
- height: styles.css:162.
- one value: StudioLayout.tsx:203 and layoutConstants.ts:36.
- the cite: Amendment 1, item 2, §2.4 (d) states exactly this.
- never changes the map's size: no row variable reads slot content (StudioLayout.tsx:194-204). The strip's `auto` row holds no status item (:261-265). Proved by SB2 and by E-STATUS-HEIGHT's S3 (selection.mjs:783, run 2). An operator can observe this in ordinary use, and no edge case needs naming.
- Numstat: these lines are already insertions, so the count is unchanged.

**D-2. frontends/shell/e2e/selection.mjs:741.** The step's doc cites only Amendment 1, but the step now runs at Amendment 3's window, and `stepStatusHeight` (:788) has no doc. Replacement words for line 741:
```
/** E-STATUS-HEIGHT (SHELL-STATUS-BAR-ONE-HEIGHT-PREREGISTRATION.md Amendment 1; its window, Amendment 3): the status bar keeps one height, so the ended-selection notice coming (a second line) and going never changes the canvas's size. `stepStatusHeight` below runs this body at a window of 880 x 800 set over CDP and restores the window after. */
```
Clause check:
- one height: asserted at :784.
- a second line: G1, :771.
- the canvas's size unchanged: :783.
- 880 x 800 over CDP: :796, with the poll at :797-798.
- runs this body: :800.
- restores: :806-809.
- Numstat: the line is already an insertion, so the count is unchanged.

**D-3. frontends/shell/SHELL-STATUS-BAR-ONE-HEIGHT-PREREGISTRATION.md:1.** The form's title still describes OPEN-1 (a): a notice that does not fit is cut. No superseded index lists it. Fix: the closing amendment's superseded index gains one entry, the title → Amendment 1, item 1 (OPEN-1 (d)). The reference is by section and item, not by line.

**D-4. Record: E-STATUS-HEIGHT's mutation.** Amendment 3, item 5, s5 predicted B at about 715.45 under the mutation. Run 2 observed 718.640625 at 880 wide, because line 1 then holds the 15 px watcher, not the 18.19 px residency item. The value was recorded, not asserted. The closing amendment records the difference by one reference to run 2's mutation section.

**D-5. Record: H3 and the scripts' commits.**
- H3's diagnostic order run (§3, §6 as Amendment 1 restates them) appears in neither run record. Run it in pan-anchor's exclusive hold, or record it as not run (class 2).
- The PR body names verify-cites, verify-quotes and verify-test-claims, each with the commit it ran at. The reports give e1f92a97 and d9e9b817 (§9; round 15 (c)).

## Notes (no action needed for the merge)
- N-1, at selection.mjs:791. `newCDPSession` and the first `inner()` sit outside the `try`. A failure there reads FAIL, not INCONCLUSIVE. That is never a false pass.
- N-2, at :806. If the app window were maximized when the step starts, restoring the bounds read would combine a state with a size, and CDP refuses that. The step would then fail by name and E-DBLCLICK would run at 880. The harness starts the app at 1280 x 800, normal, so this is not reachable in an ordinary run.
- N-3, §7 budget. The worker counted 136 at e1f92a97. The correction report gives selection.mjs as 82 at d9e9b817, and 6f72d0a7 changes one comment line, about 84 of 90. layoutState.ts is at its ceiling of 10. I have no shell, so the reviewer recomputes the numstat at 6f72d0a7.

## Constitution and ADRs
- docs/01: no new action, string or console row (principle 4; P6).
- ADR-001: unchanged.
- ADR-006: no state and no action, so no undo class applies.
- ADR-010 rule 6: `STATUS_BAR_HEIGHT_PX`'s doc names the quantity it bounds (layoutConstants.ts:35).
- No path touches protocol/, the engine, the kernel or the wire. No docs/08 claim.
- Seams: no new export without a product caller. The renamed constant's callers are StudioLayout.tsx:27 and :203 and layoutState.ts:13 and :138. No reader of `STATUS_BAR_MAX_HEIGHT_PX` or `--status-max-h` remains in code.

## The ruling's terms (2026-10-14, item 1; the 24 px consequence accepted, item 3)
Each holds:
- one height of two lines: `var(--status-h)` = 48 (layoutConstants.ts:36; styles.css:34 and :162);
- wraps and scrolls as today (styles.css:163 and :165);
- no button, string or console row;
- G1 is the second-line probe (selection.mjs:771), and S3 asserts 48 (:784);
- U-FIT and E-FOCUS unchanged (layoutState.test.ts and layout.mjs are not in the diff; layout was green in run 1);
- README and KNOWN-LIMITATIONS untouched (OPEN-2 (b), OPEN-3 (b)).

## §8, item by item (items 4, 5, 9 and 15 to 18 as Amendment 1 restates them)
1. Every file is inside Amendment 1's §2.10 list. Pass.
2. No dependency or lockfile change. Pass.
3. Only the status row changed, and it is `var(--status-h)` (styles.css:34). Pass.
4. No item's text changed, truncated, cut by CSS or removed; the wrap and scroll are kept. Pass.
5. No region's size depends on the bar's content. Pass.
6. No second copy of any item; the footer is unchanged (StudioLayout.tsx:338-342). Pass.
7. No change to the wire, SKP, the kernel, the engine, canvas, workspace, feature, publish or App.tsx. Pass.
8. The attention strip is unchanged (styles.css:146-157; StudioLayout.tsx:261-265). Pass.
9. No new or changed operator string. Pass.
10. The rulings came before the code. Pass.
11. No prop, state, export or callback without a product caller. Pass.
12. No performance claim, and nothing for macOS or Linux above L1. Pass.
13. No quote of the human marked verbatim in the diff. Pass.
14. SB1 and SB2 were observed at 5bea403c, and E-STATUS-HEIGHT at d9e9b817. No `verify-mutation` run is called an observation. Pass.
15. E-DBLCLICK is last (selection.mjs:866-867). No existing test or assertion changed: the only existing lines touched are the header's step list (:8) and one import (StudioLayout.test.tsx:18). Pass.
16. KNOWN-LIMITATIONS.md not edited. Pass.
17. No button, toggle, console row, focus stop or string for the bar. Pass.
18. e2e/README.md not edited. Pass.

Part Z (frontends/shell/MANUAL-WALKTHROUGH.md:1851-1870) matches Amendment 1's Z0 to Z4. It is appended at the file's tail with a blank result log.
