*Custodian's filing note (2026-10-11): the architect's draft of map-refill's Amendment 3 (gate 1's C1, remedy (A)), on the custodian's message after its gate 1 report (the same architect, resumed; its run 02:30:47Z to 02:40:23Z by its transcript). It arrived as a message and is extracted here by script from the second SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 512512069aeebc0ccf62dbcc057f84abbc914a2326c56f00f5a8b8c98191bcf4. Write audit PASS: zero write calls across both runs. Appended to the form `frontends/shell/SHELL-MAP-REFILL-AFTER-RESIZE-PREREGISTRATION.md` as Amendment 3 in the same commit, with the custodian's 6 pins at 771fc1a3. Its item 8 names a question for the human: whether item 39 gets words for path (b), or for Apply and Clear.*

---

Class 1 (a post-result amendment, written after gate 1's findings). The human decides whether item 39 gets wording for the two cases where a growth asks nothing after a reported view (item 8). The decision goes further than the custodian's one line: it also clears `lastQueried` at the auto-fit's unreported camera write. That second path has the same root cause as C1, and my gate 1 missed it.

````markdown
### Amendment 3 — gate 1's C1: `lastQueried` is cleared at every camera write that does not report and at a new filter generation (class 1), written after results were seen

*Written by the architect after results were seen. The results are gate 1's finding C1 (`state/consults/gates/2026-10-11-shell-map-refill-after-resize-gate1-architect.md`, finding C1); a gate round's findings are the round's results (round 15, item (g)). This amendment is declared before any code of it. It opens correction round 1 of 2. The branch head is cf24f9b4, which this amendment does not change. Code was read on the branch at cf24f9b4 and at main 771fc1a335787997776422bf0286037bc423f25e. Nothing below is a quotation.*

1. **The result.** C1 found that, after a filter Apply or Clear, a size change compares the camera against the previous generation's box. On that path a shrink can issue a query, so H2, §4's item "a shrink asks nothing" and item 39's second sentence do not hold there. Worker report 1 had flagged it (its "Differences from the form" section, the auto-fit after a filter).

2. **The cause, from the code.**
   - `lastQueriedRef` is written only by `reportViewport` (`frontends/shell/src/canvas/WorkingCanvas.tsx` (`:1018-1024` at cf24f9b4)). The canvas remounts only when the dataset changes.
   - The one camera write that does not report is the auto-fit, `fitToExtent(…, false)` (`frontends/shell/src/canvas/WorkingCanvas.tsx` (`:1337`, `:1472-1481`, `:1674-1676` at cf24f9b4)).
     - It runs on the first batch with geometry of an open or of a filter generation.
     - A pan does not disarm it: `hasAutoFitRef` is set only at the two auto-fit sites.
   - A filter Apply or Clear starts a new generation, which the code documents as an open:
     - frontends/shell/src/App.tsx:279-288 @ 771fc1a335787997776422bf0286037bc423f25e sha256:HASH-TBD;
     - frontends/shell/src/residency/candidateArmSession.ts:222-233 @ 771fc1a335787997776422bf0286037bc423f25e sha256:HASH-TBD.
   - Its callers of `resetFitForNewGeneration`:
     - frontends/shell/src/App.tsx:336-338 @ 771fc1a335787997776422bf0286037bc423f25e sha256:HASH-TBD;
     - frontends/shell/src/residency/candidateArmSession.ts:1657-1658 @ 771fc1a335787997776422bf0286037bc423f25e sha256:HASH-TBD.
   - The auto-fit does not report so that it does not race the stream still delivering: frontends/shell/src/residency/candidateArmSession.ts:65-76 @ 771fc1a335787997776422bf0286037bc423f25e sha256:HASH-TBD.
   - Two paths therefore leave `lastQueried` naming a box the camera no longer shows:
     - (a) a filter Apply or Clear after any reported view (C1's path);
     - (b) a pan made before the first batch arrives, on an open or after an Apply: the pan reports, then the auto-fit moves the camera without reporting. Gate 1 missed this path; its root cause is C1's.
   - On either path, a size change is decided against the stale box, so a shrink can issue a query.

3. **The decision.** The invariant is that `lastQueried` is non-null only while the camera's last write was reported.
   - `resetFitForNewGeneration` sets `lastQueriedRef.current = null`, beside its two existing lines.
   - `fitToExtent` sets `lastQueriedRef.current = null` when `notifyViewport` is false. It does so in the `else` of the existing `if (notifyViewport)` block.
   - The doc comments of `lastQueriedRef` and of the handle's `resetFitForNewGeneration` say so.
   - Nothing else changes, in particular:
     - the auto-fit's `notifyViewport: false` and its firing condition, and Zoom to layer's `true`;
     - `viewportAfterResize` and `reportViewport`;
     - App.tsx;
     - RF1 to RF9.
   - §2.1's `lastQueried` now reads: the box last passed to `onViewportChanged` since the open, the last new filter generation and the last auto-fit, or null.
   - §2.4's OPEN-2 bullet and §8 item 4 now read: no query on a size change while no view has been reported since the open, since the last filter Apply or Clear, or since the last auto-fit.
   - **Why this makes the guarantee hold.**
     - Every camera write either reports (`lastQueried` becomes its box at the current size) or clears `lastQueried`.
     - A `query` sets `lastQueried` to the camera's box at the new size.
     - A `within` leaves `lastQueried` containing the box shown.
     - So while `lastQueried` is non-null it contains the box the map shows, and a size that grows in neither dimension gives `within` (RF2, RF6).

4. **The test: RF10.** It is a unit test reading source text, as RF7 does, in `src/canvas/WorkingCanvas.test.ts`, inside RF7's `describe`. It counts under G2, against that file's ceiling of 40.
   - It asserts three things:
     - (i) the body of `resetFitForNewGeneration() {`, up to its closing `},`, contains `lastQueriedRef.current = null;`;
     - (ii) the body of `function fitToExtent(` contains an `else` branch of `if (notifyViewport)` that holds `lastQueriedRef.current = null;`;
     - (iii) `cameraRef.current = ` occurs exactly 3 times, at the three §2.2 sites. A new camera write site, which might not report, then fails the test.
   - Its mutations and expected failures:
     - (a) delete the line in `resetFitForNewGeneration`: (i) fails;
     - (b) delete the `else` branch in `fitToExtent`: (ii) fails;
     - (c) duplicate the fit's `cameraRef.current = …` line: (iii) fails, with a count of 4.
   - Each mutation is observed by §4's method and recorded with the commit it was observed at. It is not a `verify-mutation` run.
   - **Why source text.** WorkingCanvas cannot mount in jsdom (no WebGL), as with RF7. The decision's null branch is already RF4's.
   - **No e2e step is added.** G3 stands at 191 of 200, and §5 keeps every other suite unchanged. So no e2e step shows path (a) or (b). The claim rests on RF10, RF7, RF4, RF2 and RF6 and on item 3's argument.

5. **§7.** No ceiling changes. The expected figures at the new head:
   - `WorkingCanvas.tsx`: from 47 to at most 60 (ceiling 90). G1: at most 97 (ceiling 150).
   - `WorkingCanvas.test.ts`: from 19 to at most 40 (ceiling 40). RF10, with its recorded-mutation comment, adds at most 21 lines. G2: at most 155 (ceiling 250).
   - Total: at most 443 (ceiling 600).
   - Measure with §7's command at the final head. An overrun is class 8, and §7 is not edited.

6. **The re-runs.** I agree with the custodian's scope, for this reason: a pair compares the base against the head, and every input of the base arm is unchanged.
   - The base arm of every pair stands.
     - The base, 4fd3259a, is unchanged.
     - The exe is unchanged (report 4, Setup held fixed). The changed files are served by each arm's vite and are not exe inputs (report 2, Diff and exe).
     - The fixtures are checked by hash in every run.
     - Console's base arm is the custodian's solo run.
   - The head arm of all 14 suites re-runs at the new head and is compared step by step with the standing base logs. Layout is included (RESIZEQ, FILL′, BURST).
   - Both e2e step mutations are observed again at the new head, because the file they edit changes.
   - `npm run verify` and gate 1's E1 suites run at the new head.
   - If the new head's diff against 4fd3259a touches anything under `src-tauri/` or any Rust input, the exe is rebuilt and both arms re-run.
   - If any head step differs from its base step, that is I2. It is recorded as class 2, and no threshold is edited.

7. **The PR body's claims after the fix.** These are the claims each sentence may make. The wording is the custodian's.
   - **Opening sentence.** A growth asks for the area beyond the last asked box once a view has been reported: a pan, zoom or Zoom to layer since the open, the last filter Apply or Clear, and the last automatic fit. Before that, a size change asks nothing.
   - **"A shrink asks nothing."** It may stand without a condition. Its proof is RF2, RF6 and RF10, with item 3's argument.
   - **The Export panel's Current view.** After an Apply, a Clear or an automatic fit, it carries the last reported view until the next pan, zoom or Zoom to layer: the auto-fit writes no box, and a shrink then gives `none`. This was true before this piece. It is recorded, not fixed.

8. **Item 39's wording is unchanged** (Amendment 1, item 4).
   - Sentence 2 holds without a condition (item 3).
   - Sentence 3 holds: before the first reported view after an open, `lastQueried` is null, and the auto-fit clears it again.
   - Sentence 1 holds after an Apply or Clear on the reading that the last thing asked for was an unrestricted look (frontends/shell/src/App.tsx:279-288 @ 771fc1a335787997776422bf0286037bc423f25e sha256:HASH-TBD), with nothing lying outside it.
   - Sentence 1 does not hold on path (b). After a pan made before the first batch, the auto-fit moves the camera, and a growth then asks nothing until the next pan, zoom or Zoom to layer.
   - It is the human's call whether item 39 gets words for path (b), or for Apply and Clear, because the wording is theirs.

9. **Declared unchanged, and invalidators.**
   - Every item §5 declares unchanged still is. The auto-fit's firing condition and App.tsx are added to the list.
   - The §8 items stand as amended in item 3. No new timer, constant, callback or export.
   - I8 (new): an RF10 mutation that does not fail its assertion. STOP and report.

**Superseded index:**
- §2.1's `lastQueried` → item 3.
- §2.2: `reportViewport` as the only writer of `lastQueried` → item 3.
- §2.4's OPEN-2 bullet, and §8 item 4 → item 3.
- §4: RF10 added, and RF10 added to the acceptance item "a shrink asks nothing" → item 4.
- §6's assertions, now RF1 to RF10 → item 4.
- Amendment 2 item 13, its last bullet, for this change → item 6.

Nothing above is edited.
````
