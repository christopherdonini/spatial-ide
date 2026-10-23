*Custodian's filing note (2026-10-22): the architect's draft of milestone 4 PR A's Amendment 4, read only at main 72868422 with the code at 37b9d756. Its second hand-back, after the custodian's revision message on the tester's attributes run (`state/consults/2026-10-22-b1-shell-half-pr-a-attributes-suite-tester-report.md`): step 16.3's fixture route made followable before the merge, row 7 settled by the run, row 15 kept conditional. The run 18:32:59Z to 19:04:38Z by its transcript (Read 34, Grep 55, Glob 2; no Write, Edit or Bash); its first hand-back at 18:44:45Z, sha256 d5ce2560031d81e35a7db32c4747244abdd3b589cc4280e8ed91887f10ba2c23, is superseded by this one. D1 is class 8; rows 2, 4 and 7 are code changes before the gates (the managers' `columns` and the canvas's new callback required; the status item in the past tense; PA-E1's aim), rows 13 and 14 documentation; D5 is no defect; no OPEN item. The amendment is committed to the form from its heading to its closing line, its 4 line cites pinned by script. Extracted by script from its last SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 0984f3cdd4a8e297bd6e3737b8a262cf00a80f5c8d2eb5d7e01d23ec54fa6c89.*

---

Drafted: b1-shell-half, PR A's Amendment 4, at main 72868422 with the code at 37b9d756

Read: `cut/b1-shell-half-pr-a` @ 37b9d756267d25a30d8445615ff4e76de10b6e61, read only. This is a draft, not a gate verdict. I have no shell, so no span below carries a sha256. The head file `frontends/shell/src/canvas/clickPick.ts` read clean (`readRow(candidate.batch, row)`), and `frontends/shell/src/attributes/projection.ts` read clean (`names.slice(0, ATTRIBUTE_PROJECTION_MAX)`). This revision applies the coordinator's four points from the tester's `e2e:attributes` run at 37b9d756 (`state/consults/2026-10-22-b1-shell-half-pr-a-attributes-suite-tester-report.md`). I did not read that report; I worked from the lines the coordinator byte-copied from it.

**What this means for the gates.**
- **Three code changes before the gates:**
  - Row 2 (Correctness) makes the managers' `columns` option and the canvas's `onAttributesNotHeld` required.
  - Row 4 (Correctness) fixes the status item for features kept without attributes.
  - Row 7 (Evidence) fixes PA-E1's aim. At 37b9d756, PA-E1 failed because it never reached an oracle id.
- **Two Documentation must-fixes:**
  - Row 13: the wording of KNOWN-LIMITATIONS item 51.
  - Row 14: the comment on the `status.residency` slot.
- **PA-E3 passed** at 37b9d756.
- **Evidence still pending:** PA-E1 after row 7, H1, H2 and H7, and the two e2e mutations.
- **No defect in D5:** the engine always writes `attribute_columns`.

---

## Amendment 4: PR A's code read at 37b9d756, written after that code was seen and before its gates. D1 is class 8. The managers' `columns` and the canvas's new callback become required (class 1, a code change). The status item for features without attributes states a past fact (class 1, a code change). D3 to D11 are read (class 1), with one record correction (class 3).

*Written after PR A's code at 37b9d756267d25a30d8445615ff4e76de10b6e61 was seen, and before its gates; revised after the tester's `e2e:attributes` run at that head was seen (`state/consults/2026-10-22-b1-shell-half-pr-a-attributes-suite-tester-report.md`). The architect drafted it read-only at main 72868422, with the code at that head and B at 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f. The worker's report is `state/consults/2026-10-22-b1-shell-half-pr-a-worker-report.md`, cited by its D numbers. Code at the head is not on main, so it is cited by path and symbol, with commit 37b9d756. §7 is not edited, and no file joins §2.6. Nothing below is a quotation.*

1. **D1 (class 8).** By §7's command over `55618ab5...37b9d756`, `frontends/shell/src/style/document.ts` counts 7 lines against its ceiling of 6 (the worker's report, its §7 table and D1). The overrun is the four-line bullet of Amendment 2 item 2 (c). It is recorded here as class 8, and §7 is not edited. A-P stays under its total.

2. **D2, and the canvas's new callback (class 1; a code change before the gates).**
   - **The reading.** §2.2 (b) does not say whether the option is required. Amendment 3 item 5's "no defaults" reading of §8 item 13 covers every option and prop that PR A adds to carry the projection or what follows from it. At the head:
     - An absent `columns` that sends `null` is a code path only tests take. App passes the option at both construction sites: `startCandidateArmSession` and `new ViewportStreamManager` in `frontends/shell/src/App.tsx`.
     - The same holds for an absent `onAttributesNotHeld`.
     - The tile manager's required `columns` is the form to follow.
     - A forgotten option would fail loudly, not silently: the canvas decodes with the open's set and refuses an empty batch through `UnexpectedProjectionError`. So this row rests on §8 item 13, not on §5.
   - **The change:**
     - `frontends/shell/src/streaming/viewportStreamManager.ts`: the option becomes `columns: string[] | null` (required). The `viewportQuery` call passes `this.opts.columns`, and the doc comment says the option is required with no default, as the tile manager's is.
     - `frontends/shell/src/residency/candidateArmSession.ts`: `CandidateArmSessionDeps.columns` becomes required. The tile manager's option and the first look's sixth argument both pass `deps.columns`.
     - `frontends/shell/src/canvas/WorkingCanvas.tsx`: `onAttributesNotHeld` becomes required.
     - `frontends/shell/src/streaming/viewportStreamManager.test.ts` and `frontends/shell/src/residency/candidateArmSession.test.ts`:
       - add `columns: null` at each construction site that passes no `columns`;
       - update the two PA-U7 recorded-mutation comments to `this.opts.columns` and `deps.columns`. The mutations stay the same.
     - `frontends/shell/src/canvas/WorkingCanvas.wiring.test.tsx` needs no fill. Its base props are a cast (Amendment 3 item 6), so its diff stays within the four fill forms.
   - **I1.** At the head, `new ViewportStreamManager(` and `startCandidateArmSession(` occur only in the two test files above, in `App.tsx` and in `candidateArmSession.ts`. `<WorkingCanvas` is rendered only in `App.tsx` and in the wiring test. So `tsc` needs no file outside the list.
   - **§7.**
     - The three product files stay within their ceilings: 20, 30 and 80.
     - The two test files will pass their per-file ceilings of 40 and 60. That is class 8, counted by §7's command at the gate head and recorded in the closing amendment. §7 is not edited, and A-T stays under its total.
     - The PA-U7 mutations are observed again at the new head (§9).

3. **D3 (class 1).** The status item shares the existing `status.residency` slot. That is "a status item" under §2.2 (d). A slot of its own would need `frontends/shell/src/layout/contributions.ts`, which is outside §2.6 (I1). Accepted.

4. **The status item's claim (Correctness, class 1; a code change before the gates).**
   - **The defect.** At the head, App sets the item on the canvas's first not-held report and clears it only when the next dataset opens (`attributesNotHeld` and the `status.residency` entry in `frontends/shell/src/App.tsx`). Its text, `ATTRIBUTES_NOT_HELD_TEXT`, states a present state. That is untrue once the not-held batches have been let go (evicted or superseded) while the item still shows.
   - **Ordinary use reaches it.** 268,435,456 bytes over 2,000,000 resident points is about 134 bytes of copied attribute data per row. This is arithmetic from the two declared constants in `frontends/shell/src/canvas/limits.ts`, not a measurement.
   - **The words.** These are a P6 placeholder, not the human's wording. The worker applies them and the PR body lists them. `ATTRIBUTES_NOT_HELD_TEXT` becomes:
     `[P6 placeholder] Some features' attributes were not held since this dataset was opened: the resident attribute limit was reached.`
   - **Each clause checked at the head:**
     - "were not held": the `onAttributesNotHeld` handler fires only when `withinAttributeCeiling` returns a not-held batch (`withinAttributes` in `WorkingCanvas.tsx`).
     - "since this dataset was opened": the state is keyed to `admitted.dataset`, and a new open mints a new handle. The App test for the status item asserts the clear.
     - "the resident attribute limit was reached": `withinAttributeCeiling`'s condition.
     - The text still contains `not held`, so that test's assertion holds.
   - **Not covered, named for the source comment:** the baseline arm, which only a dev switch selects, reports before the vertex-ceiling check. A batch that this check then refuses can still set the item.
   - **§7:** a few lines of `App.tsx`, within 150.

5. **D4 (class 1).** Accepted. The throw in `TileResidentSet.addBatch` (`frontends/shell/src/canvas/tileResidentSet.ts`) refuses a state that no product path builds (Amendment 3 item 3). Without the guard, a second dedupe would write `rows[dst] = srcIdx` over an already-mapped block: a silent wrong value, which is what §5's falsification and ADR-010 rule 2 exist to prevent. It adds no behaviour that a caller selects, unlike row 2's defaults. It is the same discipline as `decodeBatch`'s null-id refusal. Its test stays.

6. **D5 (class 1; no defect).**
   - Every engine envelope is built by `build` (`engine/src/envelope.rs:110-117` @ 72868422). `build` writes `attribute_columns` without a condition, `[]` when nothing is projected (`engine/src/envelope.rs:242-251` @ 72868422).
   - The golden shows `[]` for the unprojected viewport stream (`engine/tests/data/golden/polygon-wire.golden:8` @ 72868422) and `["zone"]` for a projected one (`engine/tests/data/golden/polygon-wire.golden:34` @ 72868422).
   - A search finds the key in each of the five committed IPC fixtures that the shell tests read (`engine/tests/data/geoarrow/*.arrows`; binary, so no line).
   - No product batch lacks the key. Refusing a batch without it is §2.2 (c)'s "not exactly that list". The two hand-built batches in `frontends/shell/src/canvas/decodeBatch.test.ts` that now write `"[]"` match the engine's shape.

7. **D6, settled by the run (Evidence; a code change before the gates, class 1).**
   - **What happened.** At 37b9d756, PA-E1 failed twice for want of a hit (the tester's report, its PA-E1 lines). `pointsAroundCentre`'s estimate of the cells fell on rows 0 to 3 of the 23-by-22 grid. The oracle's five ids sit on rows 10 and 11.
   - **The fix, in `frontends/shell/e2e/attributes.mjs` only (A-E):**
     - `pointsAroundCentre` and `FIT_MARGIN_FRACTION` are removed.
     - The step finds features by §4's method: PA-E3's `candidatePoints`, `capturePixels` pixels that are each confirmed through `hoverIdAfterBarrier`.
     - From the confirmed hovers, it fits the screen position of a grid cell. Under the generator's placement, an id's column is `id mod 23` and its row is `floor(id / 23)`, so x is linear in the column and y in the row. The fit uses hovers whose ids differ in column and in row.
     - It then aims at the oracle cells' predicted centres, confirms each id through `hoverIdAfterBarrier` before the click, and zooms in a notch at a time (as `distinctFeatures` does) if those points answer nothing or are below the pick resolution.
   - The generator and the oracle are unchanged, and §3 stands.
   - **What the fixed step must show:**
     - at least two of the oracle's ids reached by click, 242 (the NULL `zone`) among them;
     - for each, the Feature tab's id equal to the hovered id;
     - the six projected names in declared order;
     - every value equal to the oracle's, the NULL shown as the marker;
     - `d32` named in the not-projected line;
     - no not-held line;
     - the reached ids and the hover count printed on the PASS line.
   - **Still to come.** H1 and H7 are discriminated by that pass, and PA-E1's mutation is observed on it.
   - **Evidence, not Authority.** In the oracle the generator wrote to PR A's worktree (gitignored), all five ids carry an `i64` whose magnitude is over 2^53. So any oracle id the step reaches exercises §3's prediction about 64-bit values. D-report's list of three understates this.

8. **D7 (class 1).** `frontends/shell/src/App.attributes.test.tsx` uses the stand-ins of `App.workspace.test.tsx`: the SKP client, the baseline manager and the WebGL canvas.
   - Nothing on I5's list is mocked.
   - In PA-R2, everything from decode to the tab is real.
   - The manager's own passing of `columns` is PA-U7, against the transport mock.
   - The shipped arm's App wiring (the candidate session) is proven only end to end, by PA-E1 and PA-E3.
   - For this file, §4's "transport boundary" is read to include those platform stand-ins.

9. **D8 (class 1).** Four tests at 37b9d756 have no §4 row and no recorded mutation. Each discharges nothing:
   - in `frontends/shell/src/App.attributes.test.tsx`: the test titled `PA-A1: hands the open's projection set to the manager and to the canvas`, and the test titled `shows a status item when the canvas keeps a batch without attributes, and not for the next open`;
   - the row-map refusal test in `frontends/shell/src/canvas/tileResidentSet.test.ts` (row 5);
   - `displayValue`'s case with no projection in `frontends/shell/src/attributes/values.test.ts`.

   PA-A1 is this amendment's name for the first test.

10. **D11 (class 1).** Part AC carries §9's rows 0, 1, 2, 9, 10 and 11, numbered as §9 numbers them. Rows AC3 to AC8 are left for PR B (3 to 5) and PR C (6 to 8). AC10 covers PR A's strings, and each later PR names its own strings in its rows.

11. **D9, D10 and the count (class 3).**
    - The report counts 16 mutation runs. The transcript shows 15, as the custodian's filing note states: thirteen tests, with PA-U7's three counted apart. The observations are those 15 runs at 37b9d756.
    - D10 needs nothing.

12. **§8 at the head, item by item (class 1).**

| Item | Reading at 37b9d756 |
|---|---|
| 1, 2 | Met, by the worker's file list and empty lock diff. The reviewer confirms from the diff. |
| 3 | Met: no command, field or literal is added. |
| 4 | Met. `data` is indexed only in `readRow` (`frontends/shell/src/attributes/values.ts`), and `rows` is written in `addBatch`'s `keepIdx` loop. |
| 5 | Met: `readCell` makes every integer a `bigint`. |
| 6, 7, 10, 11 | Not applicable to PR A. |
| 8 | Met. `projectionFor` returns `null`, never `[]`, and reads only `projectable`. |
| 9 | Met: `displayValue` shows the marker for a NULL. |
| 12 | Met: no "undo" in the new product text that was read. |
| 13 | Not met at the head: row 2. |
| 14, 15 | Met. The new strings are P6 placeholders stating the shell's own facts. Row 4 is about truth, not ownership. |
| 16 | Met. |
| 17 | The request fixture is met (PA-U2), and the rebuild seam is met (PA-U8 to PA-U10, from the real decode). The decode of a real engine batch with projected columns is shown by PA-E3's pass at 37b9d756 for a `Utf8` column. PA-E1 failed for want of a hit (row 7), so the multitype columns are Evidence, pending. |
| 18 | D1 is recorded as class 8 (row 1), and §7 is not edited. This amendment adds no scope. The observations are not `verify-mutation` runs. Test text here is named with its commit. |
| 19 | Nothing is quoted. |
| 20 | No OPEN-16 code. The 1c-shared files are edited under OPEN-17 (b) (Amendment 1 item 4). |

   ADR-023 §11 item 3: `isReadableAttributeType` admits nothing. `projectionFor` alone chooses, from `projectable` only. The check refuses to read a column type the shell's reader lacks. Read so; see what could not be settled, item 2.

13. **KNOWN-LIMITATIONS item 51 (Documentation, must-fix before the merge; a draft, not the human's wording).**
    - **Why it must change.** At the head, the item says the status bar reports that some attributes "are not held", and also that "they come back". With row 4, the item says instead:

    ```
    51. **Attributes are not held for features loaded once the map holds 268,435,456 bytes of attribute data.**
        The Feature tab shows the attribute values read for the feature you click. The map holds at most 268,435,456 bytes (256 MiB) of attribute data in all, over every batch of features it keeps. A batch that would take it past that keeps its shapes without its attribute values; this limit drops nothing from the map and refuses nothing. Clicking a feature of such a batch shows that its attributes are not held, and from then until the next dataset is opened the status bar says that some features' attributes were not held. A batch the map loads again after letting it go is read again under the same limit.
    ```

    - **Each clause checked at the head:**
      - "read for the feature you click": `resolveClickPick` calls `readRow` at the click, and the result is carried to `inspected.row`.
      - "at most … over every batch it keeps": `residentAttributeBytes` over the active set's `getBatches()`, in `pushBatch` and `pushTileBatch`.
      - "keeps its shapes … refuses nothing": `withinAttributeCeiling` returns the batch marked `"not-held"`, with no throw.
      - "shows that its attributes are not held": `NOT_HELD_TEXT` in `frontends/shell/src/feature/FeatureTab.tsx`.
      - "until the next dataset is opened … were not held": row 4.
      - "read again under the same limit": every push decodes and calls `withinAttributes`.
    - **Not covered (for the source comment):** the dev-only baseline arm's early report (row 4).

14. **The `status.residency` slot's comment in `frontends/shell/src/App.tsx` (Documentation, must-fix; not the human's wording).** Append this sentence:

    `The attributes-not-held item (milestone 4 PR A, section 2.2 (d)) shares this slot: the canvas's onAttributesNotHeld report sets it, and it stays until the next dataset is opened.`

    Clause check: the report sets it, through the handler passed to `WorkingCanvas`; it stays until the next open, row 4.

15. **PA-E3's mutation (class 1, conditional).**
    - PA-E3 passed at 37b9d756: its unfiltered clicks showed three different zones (the tester's report, its PA-E3 line). The run stopped at PA-E1, so neither e2e mutation was observed.
    - Under `readRow(candidate.batch, 0)`, every row of the filtered half is `residential`. The unfiltered half catches the mutation only if the six features it clicks share batches whose row 0 shows one zone.
    - If the tester's observation at the next head shows the mutation surviving, PA-E3 as written is an Evidence failure. The fix, inside `frontends/shell/e2e/attributes.mjs` and A-E: each unfiltered id's zone is read again under the filter `id = N`, where its batch holds that one row, and the two must match.

16. **Next, in order.**
    1. Rows 2, 4, 7, 13 and 14, by one worker on PR A's branch.
    2. After #243 merges, main is merged into the branch, and Amendment 2 item 5's sentence is applied to `buildLayers.ts`. PR A does not merge before #243 (Amendment 2 item 10).
    3. **The tester, at that head:**
       - **(a) The fixtures, before the merge.** The generator exists only on the branch, and writes under its own worktree. The suite reads `C:\dev\spatial-ide\target\fixtures\manual-walkthrough\`. So the generator is run at the head in PR A's worktree, and its two files are compared by sha256 with the shared folder's copies. Those copies are the ones the 37b9d756 run placed there and recorded in the tester's report.
       - Row 7 leaves the generator unchanged, so a later head must reproduce both recorded hashes, and the shared copies stand. A different hash is a stop, reported before any suite runs (§3). It is not a replacement.
       - After the merge, the generator runs from the main checkout into the shared folder, under the same rule.
       - **(b) The runs.** Every e2e suite, plus `e2e:attributes`. The fixtures are checked by hash before and after. Both e2e mutations are observed: H2, H1, H7, PA-E1 and PA-E3.
    4. The architect's and reviewer's gates at that head. The PR body states that round 8's exemption closes at PR A for B1's non-null path (§2.2 (b)), and lists the words applied from rows 4, 13 and 14.

Read the last amendment first.

Nothing above is edited.

---

**OPEN items:** none. Nothing above is the human's. Item 51 and item 52 stay drafts for the human's sight under item 2e, and the row 4 string is sighted at the sitting (OPEN-14).

**What I could not settle**
1. **The e2e evidence still to come:**
   - PA-E1 after row 7's fix (H1, H7);
   - both e2e mutations, so row 15 stays conditional;
   - every suite at the gate head (H2).
   - Also: whether row 7's grid fit holds on the real fit. A failure there is a test defect inside A-E, not I3.
2. **LargeUtf8 and Utf8View.**
   - `admit_attribute_type` admits both (`engine/src/attributes.rs:78-94` @ 72868422). The shell's `isReadableAttributeType` reads `Utf8` only, so a live batch carrying either type would be refused whole for that dataset once PR A sends a projection.
   - The engine's file schema is DuckDB's export of `SELECT * FROM read_parquet(?) LIMIT 0` (`engine/src/dataset.rs:1110` @ 72868422).
   - **Evidence for this path:** PA-E3's live batches at 37b9d756 carried `zone` through the shell's reader at the pinned DuckDB. That shows a `Utf8` source column on that path. It does not show what DuckDB exports for a source column stored as `large_string` or as a string view, and no test proves that.
   - If any `read_parquet` export at the pinned DuckDB yields either type, that is a Correctness defect. The fix is two arms in `frontends/shell/src/attributes/values.ts`, proven by a committed engine batch.
3. **The class 8 figures.** I have no shell, so the two test files' figures under row 2 come from §7's command at the gate head.
4. **No sha256 anywhere in this report,** for the same reason. The fixture hashes are named by reference to the tester's report, and the custodian pins by script, at main commits only.
