*Custodian's filing note (2026-10-21): the architect's draft of the docs lane's first form, read only at main 54d07268. Not committed as a form: its OPEN-1 is the human's, and its reuse step is the custodian's. The run 2026-10-21T04:43:45Z to 04:52:01Z by its transcript (Read 38, Grep 33); its one SubagentHandback call, at 04:52:00Z. Extracted by script from that call, with nothing changed except one final newline. Its sha256, from line 5 to the end, is 37cfa0cf8707e1b28b98f509179dcf09b617a8279f71cd53c9688b76aa5cbd3a.*

---

Drafted: walkthrough-current-view-rows-g1-n5, its form, at main 54d07268

(Reviewed: main @ 54d07268. This is a read-only draft, not a gate. I read the working tree, which the session snapshot gives as main at 54d07268. I have no shell, so no cite below carries a sha256. The custodian fills every hash by script and expands 54d07268 to its full id with `git rev-parse`. Every `path:line` below reads at 54d07268.)

---

# MANUAL-WALKTHROUGH.md rows G1 and N5: Current view is available once the map has drawn the file's data. Preregistration (full form)

File: `frontends/shell/WALKTHROUGH-CURRENT-VIEW-ROWS-G1-N5-PREREGISTRATION.md`

**Authority.**
- **The node:** PLAN node `walkthrough-current-view-rows-g1-n5`, `PLAN.yaml:5172-5188` at 54d07268. Its title is at :5173 and its summary at :5187.
- **Placement:** the human's item 4, the docs lane, 1 of 6: `state/directives/2026-10-21-placements-redaction-scan-1c-milestone-4-lanes-238-clicked-d-answers-adr-024-heading-kept.md:14` at 54d07268.
- **The lane's terms:** `state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:17-21` at 54d07268. The lane changes documents, comments and test names only (:19). Rule (00) applies against both slots and every PR awaiting merge (:20).
- **The finding:** PR #219's gate-1 reviewer DOC-4, `state/consults/gates/2026-10-14-export-current-view-after-unreported-fit-gate1-reviewer.md:91-93` at 54d07268. This is a record's cite into a filed report, so it is pinned with its hash (§25(b)).
- **The source piece:** `frontends/shell/EXPORT-CURRENT-VIEW-AFTER-UNREPORTED-FIT-PREREGISTRATION.md`, read at 54d07268:
  - §2.6, which kept that piece's walkthrough edit to Part Y (:181-197);
  - Amendment 7 item 5, which places this node (:593);
  - Amendment 4 item 1, where the human approved the disabled-reason sentence as drafted (:545);
  - Amendment 8 item 5 (:606).
- **Verdicts:** proportional (`state/directives/2026-10-05-product-first-direction.md`, section 2). Wording blocks follow the 2026-10-11 direction, item 2, and `AUTONOMY.md` §31.

**Drafted by** the architect, on the custodian's brief, at main 54d07268.

**These words are the architect's, not the human's.** One sentence quoted inside them is the human's: the disabled reason, approved on 2026-10-14. It is quoted unchanged.

**Committed before any code.** Append-only once committed. An amendment made after any outcome has been seen says so in its first line.

**Gating: full form and full gating** (`AUTONOMY.md` §21a, §25(e)).
- By size, this piece is under §21c: 4 lines, 1 non-generated file besides the form and PLAN.yaml.
- But both rows restate a property currently under test, which is §21a category 4:
  - Current view's availability after an open is pinned by UPP1 (`frontends/shell/src/publish/PublishPanel.test.ts:61-67`, `:427-429`), RCV3 (`frontends/shell/src/App.selection.test.tsx:767`) and E-CV-OPEN (`frontends/shell/e2e/export-view.mjs:92-103`).
- A five-line `Out-of-scope` line would therefore have to name category 4. By §25(e), no five-line form is committed. This follows the precedent of `frontends/shell/STALE-TEST-NAMES-AND-COMMENTS-PREREGISTRATION.md` (its Gating paragraph).

**Reuse index (the standing step).** The brief carried no `tools/reuse.mjs` output. The custodian runs it (for example with "walkthrough current view") and appends the printed lines here, byte-copied by script and marked, with the tool's commit. A miss is noted and does not block.

## §0. Disclosure

- **Inputs:**
  - the node;
  - the source form's §2.4, §2.6, and Amendments 3, 4, 7 and 8;
  - DOC-4;
  - the walkthrough's Parts G, N and Y;
  - the shell code named in §2.1, read at 54d07268 (call this C).
- **The base.** The code base B is the merge-base on main when the branch is cut.
  - The worker re-reads every cite at B.
  - A moved line is a class 3 row before code, and B's tree is authoritative for it.
  - A changed fact is an invalidator (§5).
- **Pins are historical.** Every `path:line at 54d07268` below is a read at C. The custodian pins it by script as `path:line @ <full id> sha256:<hex>`, contiguous on one line (round 15 (d), (e)).
- **Found beyond the node, marked (A):**
  - **(A1)** N5 carries seven further stale cites and one changed fact outside its Current-view clause (§2.3, OPEN-1).
  - **(A2)** G1 does not mention two lines the panel now shows: the purpose line at `frontends/shell/src/publish/PublishPanel.tsx:664` and the selection sentence at `:44`, `:695`. Both are P6 placeholders. G1's text is not made untrue by this, since it lists what appears rather than claiming nothing else does. No row is written (§2.4).
  - **(A3)** Governance D's paths also include `scripts/plan/verify-quotes.mjs` and its test, conditionally (`scripts/plan/PLAN-SUMMARIES-ARCHIVE-PREREGISTRATION.md:451-455` at C). The brief did not list them. They are disjoint from this piece.
- Nothing is measured, there is no fixture and no app run, so the drive confound does not apply.

## §1. What this preregistration may and may not claim

- **May claim:** each rewritten span states what the shipped shell does at B, checked clause by clause in §2.1.
- **May not claim:**
  - any change to the code, a test, an assertion, or a string the app shows;
  - that the reason sentence's P6 sight is done (that is Part Y's Y4);
  - that Current view is disabled whenever the map has drawn nothing. Only the other direction is claimed: once the map has drawn the data, the option is enabled. A pan before the first batch also enables it;
  - any edit to Part Y, to `KNOWN-LIMITATIONS.md` or to an ADR;
  - any performance figure.
- **ADRs cited, none amended:** 006 (publishing is class 3; unchanged), 017 §8.

## §2. The change

### 2.0 Rules

- **(a)** New text cites by item name (const, function, component, file). It never cites by a bare `path:line`. Lines drift, and these rows are read months later.
- **(b)** Quotation marks wrap only text byte-copied from its source. Every existing quoted span in G1 and N5 stays byte-identical.
- **(c)** The reason sentence is byte-copied by script from `frontends/shell/src/publish/PublishPanel.tsx:71` at B, between its string quotes. The architect's copy below comes from a read. It is not the proof.
- **(d)** Each row stays one physical line. Only the span named in its row changes.
- **(e)** No backticked snake_case token with a test prefix (`a_`, `the_`, `it_`, …) is written in this form or in the rows, so `verify-test-claims` sees no new test claim.

### 2.1 Rows

**W-G1: Part G, row G1, the Expected outcome cell** (`frontends/shell/MANUAL-WALKTHROUGH.md:324` at C).
- **Stale span:** from "If the canvas has had no pan/zoom gesture yet" to "pan or zoom once and it enables." It says Current view stays disabled until a pan or zoom, with the old reason sentence. That sentence is no longer in the code: `CURRENT_VIEW_DISABLED_REASON` at `PublishPanel.tsx:70-71` is the only reason string.
- **New span (the architect's words, not the human's; the quoted sentence is the human's, byte-copied per 2.0 (c)):**

  > With the file's data drawn on the map, **Current view** is enabled and no reason paragraph appears. After an open it is disabled only until the map draws the file's first data, or until a pan or zoom if one comes first. While it is disabled, a reason paragraph below the two options reads, verbatim, *"Not available yet — the map has not drawn this file's data. Pan or zoom the map, or choose Whole dataset."* (`CURRENT_VIEW_DISABLED_REASON` in `frontends/shell/src/publish/PublishPanel.tsx`, the human's words; Part Y's Y4 is their sight).

- **Clause check (at C):**
  - **"With the file's data drawn on the map, Current view is enabled":**
    - The first batch with geometry runs the automatic fit before it is drawn: baseline at `frontends/shell/src/canvas/WorkingCanvas.tsx:1531-1541`, candidate at `:1738-1742`.
    - The fit's unreported arm calls `onViewShown` (`:1403-1408`), which is App's `showBox` (`frontends/shell/src/App.tsx:2149`, `:2127-2129`, guarded on the live dataset).
    - The store notifies its listeners (`frontends/shell/src/feature/FeaturePanel.tsx:31-34`). The panel's availability is `getViewBox() !== null` (`PublishPanel.tsx:382`), so `currentViewOptionDisabled` returns false (`:65-67`) and the radio is enabled (`:683`).
    - Proven by RCV3 and E-CV-OPEN (Gating).
  - **"no reason paragraph appears":** the paragraph renders only when the option is disabled (`PublishPanel.tsx:688-690`). Proven by the UPP1 render case (`PublishPanel.test.ts:427-429`).
  - **"After an open it is disabled":**
    - `handleAdmitted` empties the box (`App.tsx:1107-1108`). The panel is re-keyed per dataset (`App.tsx:2377`). The store starts empty (`FeaturePanel.tsx:27`).
    - Proven by RCV2 (`App.selection.test.tsx:750`).
  - **"only until the map draws the file's first data, or until a pan or zoom if one comes first":**
    - The box is set only through `showBox`, from three callbacks (`App.tsx:2149`, `:2195`, `:2206`). It is cleared only at the admission (`:1108`).
    - Before the first data, `onViewShown` cannot fire from a resize: the camera is null (`WorkingCanvas.tsx:1056`), and the resize branch needs it (`:2041`). The camera is written only by the fit (`:1391`), a view-state change (`:2081`) and the dev seam (`:2313`).
    - Every operator route that reports before the data is a pan or zoom: interactive input (`:2049-2119` → `:2108-2118` → `reportViewport` `:1062-1065`), and Zoom to selection through `fitToBbox` (`:1585-1587`). Zoom to layer does nothing before data, because its anchor is set only by batches (`:1574-1575`).
    - The within-report needs a prior report (`:2040`, `:1063`).
  - **"a reason paragraph below the two options reads … verbatim":** it is the `<p>` after both radios inside the fieldset (`PublishPanel.tsx:667-690`). The string is `:71`. It is byte-equal to the human-approved draft in the source form's §2.4 (its line 161 at C) and asserted by UPP1 (`PublishPanel.test.ts:428`).
  - **"Part Y's Y4 is their sight":** `frontends/shell/MANUAL-WALKTHROUGH.md:1866`.
  - **Named, not blocking (dev-only):** the dev seam `e2eSetViewState` (`WorkingCanvas.tsx:2313`) also enables the option with no pan.
  - **Unchanged in G1:** everything else in the cell, including "(checked by default)", which still holds (`PublishPanel.tsx:381`).

**W-N5: Part N, row N5, the Step cell's parenthetical** (`frontends/shell/MANUAL-WALKTHROUGH.md:948` at C).
- **Stale span:** the parenthetical after "click the **Whole dataset** radio", from "(Current view starts selected by default but disabled" to "`:569-578` is Whole dataset)".
  - Its "disabled with no settled view yet" is untrue (W-G1's facts).
  - Its three line cites no longer read. The default is at `PublishPanel.tsx:381`, the Current view radio and its reason at `:677-690`, and Whole dataset at `:667-676`.
- **New span (the architect's words, not the human's):**

  > (Current view starts selected by default and, as in G1, is enabled once the map has drawn this file's data; this row chooses Whole dataset instead — `PublishPanel`'s scope starts at Current view, and `PublishControls` renders the two radios, Whole dataset never disabled, both in `frontends/shell/src/publish/PublishPanel.tsx`)

- **Clause check (at C):**
  - **"starts selected by default":** `useState<PublishScopeChoice>("current")` (`PublishPanel.tsx:381`), re-keyed per dataset (`App.tsx:2377`), so a fresh reopen starts there.
  - **"as in G1, is enabled once the map has drawn this file's data":**
    - W-G1's chain.
    - The degrees file is drawn: every admitted view mounts a `WorkingCanvas` with no CRS condition (`App.tsx:2123-2132`).
    - N1's file is admitted, not refused (N1's row).
  - **"Whole dataset never disabled":** its input has no `disabled` attribute (`PublishPanel.tsx:668-674`).
  - **"`PublishControls` renders the two radios":** `PublishPanel.tsx:647-690`.
- **Unchanged in N5 (without OPEN-1):** everything else, every quoted span included.

### 2.2 In place

Both rows are edited in place, and no Part is renumbered. No record under `state/` is edited. Part Y is not touched.

### 2.3 OPEN-1 (applied only on the human's yes; a yes is class 9, a no is class 5): N5's other stale cites (A1)

- **The change on a yes:** each item below is re-aimed in place under 2.0 (a), and no other claim in the row changes. The row stays one line, so §7 is unchanged.
- **The items, as they stand in the row → what reads at C:**
  1. "computes the degrees check (`ds.crs().identifier()` and `CoordinateUnitSource::as_str`, `kernel/src/publish/mod.rs:435-443`)" is **a changed fact, not a moved line.** The check is answered from the recorded unit: `ds.is_geographic_degrees_instance()` (`kernel/src/publish/mod.rs:471-474`; `engine/src/dataset.rs:1040-1043`). The identifier and `as_str` only fill the message (`kernel/src/publish/mod.rs:475-484`).
     - New words: "answers the degrees check from the dataset's recorded coordinate unit (`Dataset::is_geographic_degrees_instance`), and fills the refusal's two placeholders from `ds.crs().identifier()` and `CoordinateUnitSource::as_str` (both in `preflight_pinless_parts`, `kernel/src/publish/mod.rs`)".
  2. `frontends/shell/src-tauri/src/publish.rs:404-409`: the preflight call in `prepare_with_progress` is at `:422-429`. The new words name `prepare_with_progress`'s pin-free preflight, with no line.
  3. `ShellApproval::new`, `:694`: now `publish.rs:790`. The line is dropped and the name kept.
  4. `frontends/shell/src/publish/PublishPanel.tsx:652` (`RefusalBlock`): now `:750`. The new words name `PublishPanel`'s refused state.
  5. `kernel/src/publish/mod.rs:436-442` (the placeholders): now `:476-483`. The new words name `preflight_pinless_parts`. `engine/src/geoparquet.rs:257-258` still reads and is kept.
  6. `kernel/src/publish/error.rs:323-331` (the message): now `:391-398`. The new words name `GeographicCrsNotPublishable`'s `Display` in `kernel/src/publish/error.rs`. The quoted message is byte-identical at C, filled.
  7. `formatRefusal.ts:107-114` (the guidance): now `frontends/shell/src/admission/formatRefusal.ts:118-125`. The new words name the `publish.geographic_crs_not_publishable` case of `formatRefusal.ts`. The quoted guidance is byte-identical at C. "no test asserts it verbatim" still holds: `formatRefusal.test.ts` names the code only, at `:201`.
- **Still reading, kept:** `frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md:535-539`.
- **Recommended: yes.** Without it the row's Current-view clause is current while its refusal-path cites point at wrong lines, and item 1 misstates what decides the refusal. It is words only, inside the lane.

### 2.4 Not changed, recorded

- The purpose line and the selection sentence G1 does not mention (A2).
- Part G's coverage table, row `OPEN` at `MANUAL-WALKTHROUGH.md:390`, is still true: `OPEN` never touches the panel.
- The historical result-log line at `:1118` is a record of a past sitting and is not edited.

### 2.5 Overlap (rule 00), walkthrough Parts counted as separate paths

- **This piece's paths:**
  - P1: `frontends/shell/MANUAL-WALKTHROUGH.md` Part G (row G1);
  - P2: the same file's Part N (row N5);
  - P3: this form;
  - P4: PLAN.yaml, with the files `queue.mjs` and `site.mjs` regenerate (`CUSTODIAN-QUEUE.md`, `CUSTODIAN-QUEUE.json`, `site/`).
  - Nothing is under `protocol/`, `scripts/plan/` or `state/drafts/`.
- **Governance D (PR #237; the D form's paths at `scripts/plan/PLAN-SUMMARIES-ARCHIVE-PREREGISTRATION.md:451-455` at C):**
  - `scripts/plan/rotate-plan-summaries.mjs` and its test, `scripts/plan/verify-quotes.mjs` and its test (conditional), `scripts/plan/README.md` and `AUTONOMY.md` are disjoint from P1 to P4.
  - At S10, PLAN.yaml, `CUSTODIAN-QUEUE.*` and `site/` overlap P4. `state/cut-archive/` and `state/drafts/` are disjoint.
  - **The resolution, under D's OPEN-5 (B)** (D's Amendment 1 item 5; D's Amendment 8 item 3: S9, then S10, under it). From D's S9 to its click, every commit touching PLAN.yaml, `CUSTODIAN-QUEUE.*` or `site/` is held. Therefore:
    - (a) the branch's walkthrough commits may be made at any time;
    - (b) the node's in-progress edit on main lands before D's S9 or after D's click, never between them;
    - (c) this piece's done commit and its merge come after D's click, and the branch merges main first (§23 regeneration). This piece does not merge before D's S9 either: going done would add a done node with a summary over 300 bytes to D's S10 candidates. That node is on no row of D's resolved sheet, and it would change the counts D's gate 2 recorded (D's Amendment 6 item 1).
- **Slot 1** (`bundle-redaction-scan-not-in-product-publish`, form not yet drafted): if its form edits a Part G row, P1 is shared. That is re-checked at dispatch, and the later piece waits.
- **Slot 2** (`b2-piece-1c-save-and-reopen`, form ahead, not in code): no known overlap. Re-checked at dispatch.
- **Rule 00 is re-checked at dispatch** against both slots and every PR awaiting merge.

### 2.6 Portability

No OS-dependent feature. R3 does not apply.

## §3. Fixtures

None.

## §4. Tests

- No test is added, renamed or changed, so no mutation is owed. No record of this piece calls any run, a `verify-mutation` run included, an observation of a mutation.
- **Evidence at H, each by script with its exit code checked:**
  1. `git diff -U0 B...H -- frontends/shell/MANUAL-WALKTHROUGH.md` has exactly two hunks. Each removes and adds one line, one starting `| G1 |` and one starting `| N5 |`.
  2. The reason sentence extracted from row G1 equals the string at `PublishPanel.tsx`'s `CURRENT_VIEW_DISABLED_REASON` at H, byte for byte.
  3. Outside the two named spans (and OPEN-1's items on a yes), each of the two lines is byte-identical between B and H. The script diffs the lines with the spans masked.
  4. The old reason sentence, "No settled view yet", has zero occurrences in `frontends/shell/MANUAL-WALKTHROUGH.md` at H. Each search pattern is self-tested positive at B.

## §5. Predictions, declared unchanged, invalidators, falsification

- **Predicted:**
  - E1: §4's items 1 to 4 hold.
  - E2: `verify-cites`, `verify-quotes`, `verify-test-claims` and `verify.mjs` exit 0 at H and in the done commit, each named with the tool's commit. `queue.mjs --check` and `site.mjs --check` report current. The `node --test` scripts suites exit 0.
  - E3: PR CI green.
- **Declared unchanged:**
  - every file but P1 to P4;
  - every row but G1 and N5;
  - Part Y;
  - every quoted span in both rows;
  - all code, tests and strings the app shows;
  - every record under `state/`.
- **Invalidators (stop and report):**
  - at B, availability is no longer `getViewBox() !== null`, the reason string differs from `:71` at C, the box gains a writer or a clearer, or the fit no longer reaches `onViewShown`;
  - a new span would need a code, test or string change;
  - a cite fact changed at B, as opposed to a moved line.
- **Falsified if** a rewritten clause is shown untrue at B in the shipped app.

## §6. Instruments

Assertions only (§4, E1 to E3). No measurement. No operator step for this piece. The rows themselves are read at the next sitting with Parts G and N.

## §7. Declared values and ceilings

- **Counting:** `git diff --numstat B...H -- frontends/shell/MANUAL-WALKTHROUGH.md`, insertions plus deletions. B and H are named in the PR body.
- **Ceiling:** at most 4 lines (G1 1+1, N5 1+1). OPEN-1 on a yes adds 0 lines, because it edits the same N5 line.
- **Files:** `git diff --name-only B...H` lists at most this form, `frontends/shell/MANUAL-WALKTHROUGH.md`, PLAN.yaml and the generated `CUSTODIAN-QUEUE.*` and `site/` files. That is at most 3 non-generated files.
- **Budget:** 30 minutes. The node carries `budget_minutes: 0` (`PLAN.yaml:5183` at C), and the custodian sets 30 in the commit that marks it in progress.
- **No constant is added.** An overrun is class 8, and this section is never edited.

## §8. Block-on-sight

1. A changed line other than the G1 and N5 lines, or a span changed outside §2.1 (and OPEN-1 on a yes).
2. Any code, test, assertion or app-string change, or anything under `scripts/plan/`.
3. A quotation not byte-copied, or a byte changed in an existing quoted span. A reason sentence unequal to `CURRENT_VIEW_DISABLED_REASON` at H is a verbatim-quote failure of the human's words, so it is Correctness.
4. A new clause claiming more than its cite shows, in particular that Current view is disabled whenever nothing is drawn, or that Y4's sight is done.
5. A new bare `path:line` in a rewritten span, a pin split across lines, or a pin at a branch commit.
6. OPEN-1's items applied before the human's answer.
7. PLAN.yaml, `CUSTODIAN-QUEUE.*` or `site/` committed to main between D's S9 and its click, or this piece merged before D's click (§2.5).
8. A §7 overrun not recorded as class 8, or §7 edited.
9. A scope addition not recorded as class 9 before its code.
10. A record calling a `verify-mutation` run an observation of a mutation.
11. A record under `state/` edited.

## §9. Gates

- **Architect and reviewer, full gating.**
  - The architect checks each clause of §2.1 against the code at B, then §8 item by item.
  - The reviewer checks the diff, §4's items by script, and E1 to E3.
- **Verdicts are proportional** (product-first, section 2). A clause's truth and the verbatim reason are Correctness. E1 to E3 are Evidence. Documentation findings are fixed before the merge, with no re-gate.
- **Wording rule (the 2026-10-11 direction, item 2; §31):** the new spans are not the human's wording. A gate's replacement words are applied with no re-gate and listed in the PR body. The quoted reason is the human's, and it is not reworded here.
- **Briefs:** there is no build and no app run. If the custodian classes the `node --test` suites as heavy, the brief carries THE MACHINE paragraph as written (`state/directives/2026-10-06-machine-script-adopted.md:12-22` at C).
- **Operator:** none for the piece. No KNOWN-LIMITATIONS item is added or edited.
- **The PR body asks for a merge commit.**

## §10. Amendments

Opens empty, append-only, classes 1 to 9. A yes to OPEN-1 is class 9, and a no is class 5.

## §11. Open items for the human

| Item | Subject | Recommended | Red line |
|---|---|---|---|
| OPEN-1 | N5's seven other stale cites and one changed fact (§2.3), re-aimed in place, words only | yes | no |

---

**What I could not settle**

1. **Reuse index.** The brief carried no `tools/reuse.mjs` output, so the custodian runs it and appends the lines (the standing step).
2. **Full form or five-line form.** I chose the full form because §21a category 4 applies, on the stale-test-names precedent. If the custodian reads that a walkthrough row describing a tested property does not touch category 4, a five-line form becomes possible. I judge that reading false.
3. **The budget.** The node's budget is 0 minutes. 30 minutes is my proposal, and the custodian sets it.
4. **D's state at dispatch.** §2.5's order assumes D is at or near S9 under OPEN-5 (B). If the human orders this piece merged before D's S9, D's S10 candidate set and its sheet change. That is D's form's question, and it goes to the human.
5. **Slot 1's form.** If it edits a Part G row, this piece and that one share P1. This is re-checked at dispatch.
6. **G1's omissions (A2).** The purpose line and the selection sentence are both P6 placeholders, and G1 does not mention them. This is a possible later docs-lane node. It is not proposed here.
7. **Zoom to selection before the first data.** I treated it as "a zoom" and did not trace whether a selection can exist on a new open before anything is drawn. If one can, the clause still holds, because Zoom to selection is a zoom.
8. **verify-test-claims.** Its test-shaped rule (`scripts/plan/verify-test-claims.mjs:105-110` at C) needs a first word in {a, an, it, the, test, n, each, when}. No token in this form or in the new spans has one. The worker confirms this with the tool's exit code at the form's commit.
9. **The tree.** I assume it was 54d07268, from the session snapshot. I could not run git to confirm it.
