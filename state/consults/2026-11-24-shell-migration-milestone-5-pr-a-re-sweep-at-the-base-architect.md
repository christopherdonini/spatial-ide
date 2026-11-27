# Milestone 5 PR A: the section 0.3 re-sweep, made by reading at the base 6bc40126 after PR A's code

*Filed by the custodian: node:shell-migration-milestone-5@pr-a-re-sweep-architect-1, under ADV-2026-11-24-04 item 3. The code existed when it was made: PR A's build was dispatched without it, the custodian's miss (the reviewer's E-1, gate-log row 892). Dispatched at 2026-11-24T02:21:01Z; its run: Read 81, Grep 56, Glob 2, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-24T02:21:05Z to 2026-11-24T02:34:11Z by its transcript; 0 calls named the main checkout; its brief forbade the branch, the build worktree, PR A's reports and the form's amendments after the eighth, and no call of its transcript names one; handed back at 2026-11-24T02:34:11Z. The report below from its hand-back, 21247 bytes, sha256 642e31511dcda8400c47d088787c59454b261f3a2cb1532e13bef247e85b17d7, byte for byte but for 1 of the profile's path or the account's name, written as <m>, <u> and <t> by the custodian, with one final newline added. A reading, not a gate.*

---

Re-sweep: made at 6bc40126 by reading only, the form at f0718827
REPORT PATH: state/consults/2026-11-24-shell-migration-milestone-5-pr-a-re-sweep-at-the-base-architect.md

What I reviewed: the read checkout `D:/wt/read-m5base`, detached at 6bc401267d2ea4532215397b79264869b4c83570, and the form at main f0718827995eaff5673b0cb4e1a52bdbb2a5ce44 (the body plus Amendments 1 to 8). This is not a gate, so it gives no verdict. The form's pins @ 0bcf5434 are historical. Where the tree differs from a pin, the tree at 6bc40126 is authoritative. I did not read the 0bcf5434 blobs, so every "moved" label below compares the form's cited line number with the tree.

## 1. The section 0.2 interfaces, re-read at the base

**The attention strip and the status bar**
- **The strip's three registered items: as stated.** `frontends/shell/src/layout/contributions.ts`, line 46 (the comment) and line 47 (`ATTENTION_ITEMS`) at 6bc40126.
- **StudioLayout hides the strip when it is empty: as stated.** `frontends/shell/src/layout/StudioLayout.tsx`, line 306 and lines 379 to 383 at 6bc40126.
- **App fills the slots: moved by +2,** to `frontends/shell/src/App.tsx`, lines 2471 to 2534 at 6bc40126. The cause is colour-by-refill's three added lines, `App.tsx` lines 1181 to 1183 at 6bc40126. Every App site from that point on is +2.
  - **The four sub-bullets: as stated.** RefusalBlock carries no Dismiss. `canvasRefusal` has a Dismiss. The notices have no Dismiss. The viewport refusal's Dismiss is suppressed by `!sessionEnded`, at `App.tsx`, line 2520 at 6bc40126.
  - **A fact the bullet does not state (my reading):** every notice element also carries the class `canvas-refusal`. They are `canvas-refusal record-notice`, `canvas-refusal save-notice` and `canvas-refusal reopen-notice`, all with `role=alert`. So every `.canvas-refusal` read in Part 2 also matches the notices.
- **The state declarations: as stated.** `App.tsx`, lines 872, 887, 889, 921 to 923, 944, 945 and 958 at 6bc40126.
- **Where the states are set:**
  - **As stated:**
    - `handleCanvasCeilingRefusal`, line 667;
    - the step queue's report, line 879.
  - **Moved:**
    - stream terminal: 1892 becomes 1894 (its guard is at 1890);
    - viewport outcome: 1613 / 1623 / 1612 become 1615 / 1625 / 1614;
    - save notices: 2193 becomes 2195;
    - reopen notices: 1238 becomes 1240;
    - session ended: 1194-1196 becomes 1196-1199, and 1492-1496 becomes 1494-1499.
  - **To check against the pin:** the `endSession` adapter, at `App.tsx` lines 1497 to 1498 at 6bc40126, also dispatches `resource.generationEnded`. I cannot tell from the tree alone whether this is new since 0bcf5434. If it is new, it changes nothing in §0.2's claim.
- **`admitAndResetStaleUiState` clears them all: as stated.** `App.tsx`, lines 251 to 262 at 6bc40126. Its `opened` call site is now line 1184.
- **A second canvas refusal overwrites the first: as stated,** at lines 667 and 1894.
- **WorkingCanvas: moved by +5.**
  - The `onCanvasRefusal` prop is at `frontends/shell/src/canvas/WorkingCanvas.tsx`, lines 564 to 568 at 6bc40126, with its signature at line 568 (the form has 563).
  - The catch is at lines 1541 to 1555 at 6bc40126. Line 1543 tests the two error classes and line 1545 passes only `e.message` (the form has 1538 to 1540).
  - Amendment 2 cites lines 1536 to 1548. That block is now about lines 1541 to 1553.
- **Every open mints a handle: as stated for one cite, moved for the other.**
  - As stated: `App.tsx`, lines 724 to 731 at 6bc40126.
  - Moved: the key comment, 2337-2339, is now lines 2339 to 2341.
  - As stated: `frontends/shell/src/admission/admitDataset.ts`, lines 15 to 18 at 6bc40126.
- **The workspace definitions: as stated.** `frontends/shell/src/workspace/workspaceState.ts`, lines 9 to 13, 16 to 17, 37 to 46 and 92 to 97 at 6bc40126.
- **The status bar items and the Cancel rule: as stated.** `contributions.ts`, lines 50 to 56, and `frontends/shell/src/layout/statusItems.ts`, lines 37 to 45 at 6bc40126.

**Activity**
- **The tabs, the tab type and the default tab: as stated.** `contributions.ts`, lines 40 to 44; `frontends/shell/src/layout/layoutState.ts`, lines 34 and 51 at 6bc40126.
- **The tab panels and the reveal pattern: as stated.** `StudioLayout.tsx`, lines 41 to 42, 443 to 453 and 256 to 259 at 6bc40126.
- **The table load runs only while the Table tab is shown: as stated.** `StudioLayout.tsx`, lines 171 to 172 and 148 at 6bc40126.

**The scan's Cancel**
- **The scan state and the liveness text: as stated.** `ScanState`, `isScanInFlight` and the liveness text are at `App.tsx`, lines 450 to 457, 530 to 532, 554 to 563 and 549 to 553 at 6bc40126.
- **FilterPanel: as stated.** `frontends/shell/src/filter/FilterPanel.tsx`, lines 120 to 121 and line 28 at 6bc40126.
- **The inline handler: moved.**
  - 2261-2330 is now lines 2263 to 2332;
  - the candidate branch, 2306-2321, is now 2308 to 2324;
  - the baseline branch, 2323-2329, is now 2325 to 2331.

**The export's Cancel**
- **`ExportRunReport` and its reports: as stated.** `frontends/shell/src/publish/PublishPanel.tsx`, lines 33 to 41 and 35 to 36, lines 402 to 408, and lines 517 to 521 at 6bc40126.
- **App's runs: moved.**
  - The runs block is at `App.tsx`, lines 1251 to 1284 at 6bc40126, with the ref at line 1255.
  - The ask calls `run.cancel()` at line 1315, inside `answerOpenAsk` at lines 1302 to 1319. `confirmOpen` is at lines 1287 to 1299. The form cites 1299 to 1305.
- **The panel's own Cancel: as stated.** `PublishPanel.tsx`, lines 148 to 149, 720 to 727 and 449 to 453 at 6bc40126.
- **The native save picker: as stated.** `frontends/shell/src-tauri/src/commands.rs`, lines 413 to 418 at 6bc40126.
- **The execute's Cancel in PublishDialog: as stated, with one note.** `frontends/shell/src/publish/PublishDialog.tsx`, lines 228 to 231 and 236 at 6bc40126.
  - Line 236 is `<div className="publish-dialog" role="dialog" aria-modal="true">`.
  - `.publish-dialog` in `frontends/shell/src/styles.css`, lines 920 to 928 at 6bc40126, has no positioning. So "inline, non-overlay" holds for the layout by this reading, even though the element declares `aria-modal="true"`.

**The Console registry: moved by +7.**
- The `layout.selectActivityTab` row, 318-324, is now `frontends/shell/src/console/surfaceRegistry.ts`, lines 325 to 331 at 6bc40126. Its statement, at line 329, still names "Console, Notices and Table".
- The dismiss rows, 230-246, are now lines 237 to 253 (`canvas.dismissCanvasRefusal` at 237 to 245, `canvas.dismissViewportRefusal` at 246 to 253).

**§0.2's own e2e list**

| Form cite | Label | At 6bc40126 |
|---|---|---|
| `project.mjs` 383-386 | as stated | |
| `residency-harness.mjs` 719 | as stated | |
| `source-changed.mjs` 732-744 | as stated | the helper is lines 732 to 745 |
| `source-watch-idle.mjs` 249-250 | as stated | the helper is lines 247 to 260 |
| `refusal-contract-baseline.mjs` 188-191 and 261-273 | as stated | |
| `regression.mjs` 260-263 and 2671 | as stated | |
| `reopen.mjs` 366 | **moved** | line 391 |
| `selection.mjs` 161 and 764 | as stated | |
| `layout.mjs` 288-320 | as stated | its restore runs on to line 323 |
| `console.mjs` 1041 | **moved** | line 1230 |
| `admission-remediation.mjs` 856 | as stated | |

**The test harness: as stated.** `frontends/shell/src/App.streamFailure.test.tsx`, lines 4 to 11 at 6bc40126.

**§0.2's records**
- **"The last walkthrough Part is AD": changed.** Part AD is still at `frontends/shell/MANUAL-WALKTHROUGH.md`, line 2021 at 6bc40126. But the last Part is now **AE**, the re-link's, at line 2050.
  - **Open question:** this is a records fact, not a code interface, so it is not clear whether I4 or class 3 is the right class.
- **"The last KNOWN-LIMITATIONS item is 75": moved.** Item 75 is at `KNOWN-LIMITATIONS.md`, line 556 at 6bc40126, not line 557.

**Changed interfaces (I4) found:** none among the code interfaces.

## 2. The declared selector list

**How §2.3 changes a read (my paraphrase of §2.3, Amendment 2's C-R1 and Amendment 8; not a quotation):**
- **(P) Placement:** each owner element is in the DOM once. The top one is in the strip; each other one is a Problems row, which is in the DOM but hidden while Activity or the tab is hidden.
- **(S) Strip contents:** a single `top` slot, plus the S-3 button when there are others.
- **(T) The Problems top row:** `problem-row-top` repeats the top condition, with no owner class.
- **(R) Re-raise:** S-5 and the `latest` text inside an owner element when `occurrences > 1`.
- **(D) Dismiss:** Dismiss only on the routes that declare it.
- **(K) Keying:** the store's keying and order (urgency, then oldest). For example, the vertex refusal and the pick refusal become two conditions.

**The reads, all at 6bc40126**

`frontends/shell/e2e/project.mjs`:
- **Line 274** (diagnostic `.save-notice` texts): changed by (P) and (R).
- **Lines 383 to 386** (S18's text exactly once among `.save-notice`): changed by (P) and (R).
  - (P) does not break the count.
  - (R) does: S-5 text inside the owner element would break the `n === text` equality at line 385.

`frontends/shell/e2e/reopen.mjs`:
- **Line 297** (diagnostic) and **lines 391 to 394** (texts include "In the file: mtime."): changed by (P) and (R).

`frontends/shell/e2e/residency-harness.mjs`:
- **Lines 718 to 724** (`.canvas-refusal button` `.first()` then a Playwright click): changed by (P), (D) and (K).
  - If the top condition has no Dismiss (a session end, or a notice), the first match is a hidden Problems row. The visibility wait then times out.
- **Lines 827 to 833** (`captureBannerState`, a count plus all texts): changed by (P) and (R). The count now includes hidden rows.
- **Line 2754** (the dismiss sweep): changed by (P). It now dismisses the hidden, non-top conditions too.

`frontends/shell/e2e/source-changed.mjs`:
- **Lines 732 to 745** (`statusStack`): changed by (S) and (R).
  - Its `stackText` gains S-3.
  - Its `.canvas-session-ended` reads stay, but `dismissButtons` must stay 0 under (D).
- **Uses** at lines 1188 to 1206, 1306 to 1308, 1326 to 1328, 1388 to 1389 and 1398 to 1400.

`frontends/shell/e2e/source-watch-idle.mjs`:
- **Lines 247 to 260**, the same helper: changed by (S) and (R).
- **Uses** at lines 472 to 474 and 510 to 527.

`frontends/shell/e2e/refusal-contract-baseline.mjs`:
- **Lines 186 to 193** (`assertNoRefusalOrBanner`, document-wide; used at line 329): changed by (P). The check now also counts hidden Problems rows and notices.
- **Lines 229 to 235** (OVERCEIL's text present): changed by (R).
- **Lines 260 to 266** (click the first `.canvas-refusal button`): changed by (P) and (K).
- **Lines 268 to 274** (no `.canvas-refusal` anywhere after Dismiss): changed by (P) and (K).
  - If the vertex and pick ceilings raise two conditions, or any notice stands, this throws.
- **Lines 376 to 385** (SLOW'/CANCEL' text present): changed by (R).
- **Line 623** (the sweep): changed by (P).

`frontends/shell/e2e/regression.mjs`:
- **Lines 258 to 265** (`assertNoRefusalOrBanner`): changed by (P). It is used at lines 432, 457, 482, 516, 525, 600, 641, 763, 1109, 1155, 1818 and 2340.
- **Line 2671** (the sweep): changed by (P).

`frontends/shell/e2e/selection.mjs`:
- **Line 161** (`.canvas-session-ended` present; used at lines 484 to 485): changed by (P). Presence holds by reading.
- **Line 764** (the strip's height, compared at lines 786 and 794): changed by (S). The S-3 button can change the height if a reopen at S1 raises a notice besides another condition.

`frontends/shell/e2e/layout.mjs`:
- **Line 206** (the focus-walk part map) and **line 222** (the strip is skipped when empty): changed by (S). The S-3 button is focusable when the strip is not empty.
- **Lines 288 to 323** (E-FLOOR: un-hides the strip, appends probe rows, reads the height at line 307, restores at lines 319 to 320): changed by (S). §2.3's styles.css change applies here.

`frontends/shell/e2e/console.mjs`:
- **Line 1230** (the sweep): changed by (P).

`frontends/shell/e2e/admission-remediation.mjs`:
- **Line 856** (the sweep): changed by (P).

**Not on the list, named for an open question:**
- `admission-remediation.mjs` reads two classes document-wide with a first-match lookup: `.admission-refusal-guidance` at lines 377 and 603, and `.admission-refusal-code` at lines 761 and 766, all at 6bc40126. These change only if (T) re-renders RefusalBlock's inner classes. Layers comes first in DOM order, so the first match is probably unchanged. That is my reading only.

**Reads checked and found unchanged:**
- `command-bar.mjs`, lines 122 and 157;
- `layout.mjs`, lines 87 and 168 (the Activity region);
- `table.mjs`, lines 106 and 159 (tab ids);
- `filter-panel.mjs`, line 224;
- `regression.mjs`, lines 2386 to 2387 and 2485 to 2486 (scoped to the admission panel).

No e2e reads `role=alert` or the statement text of `layout.selectActivityTab`.

**§2.6's suites that hold such a read: all eleven.** They are project, residency-harness, source-changed, source-watch-idle, refusal-contract-baseline, regression, reopen, selection, layout, console and admission-remediation. Console and admission-remediation are on the list only through their dismiss sweeps. No suite outside §2.6's list holds a read over the strip or the notices.

**The two unit-test files:**
- **`App.streamFailure.test.tsx` holds no strip read.** It reads only `.residency-status`, `.filter-cancel` and `.scan-liveness`. By §2.6 it is therefore not in PR A.
- **`App.layout.test.tsx` holds strip reads.** They are at `frontends/shell/src/App.layout.test.tsx`, line 372 (`.attention-strip`), line 383 (its tag), line 387 (DOM order) and line 394 (hidden when empty) at 6bc40126. They are changed by (S) only. They probably still pass, but they are on the list.

**Beyond the brief's ask: strip reads in unit-test files outside §2.6's lists.** A file outside those lists is I1, so these matter for the gate's measure:
- `App.lateResult.test.tsx`, about 57 strip reads. Lines 836 and 843 at 6bc40126 read the first `.canvas-refusal` after a stream terminal and then a ceiling refusal on the same dataset. Under (K), the oldest-first order would keep ProducerFailed on top, so line 843's expectation would fail.
- `App.command.test.tsx`, line 645.
- `App.recording.test.tsx`, line 234.
- `App.reopen.test.tsx`, lines 363, 398 and 447.
- `App.save.test.tsx`, lines 199 and 213.

**Open questions on Part 2:**
- Does (T) render the top condition's text and inner classes?
- Are the vertex and pick ceiling refusals one condition or two?

## 3. The Part letter and the KNOWN-LIMITATIONS numbers for PR A

**The base's tree**
- The last Part is AE, at `MANUAL-WALKTHROUGH.md`, line 2050 at 6bc40126. The file also holds two Part P headings, at lines 1463 and 1622, but no letter after AE.
- The last KNOWN-LIMITATIONS item is 75, at line 556 at 6bc40126.

**Claims in flight at f0718827, by its PLAN and forms**
- The re-link: Part AE and items 69 and 73. All are already in the base.
- PR 358: item 68, already in the base.
- Colour-by-refill: items 51 and 61, and the row AC12 in Part AC. No new Part.
- The recovery offer (`b2-piece-1c-step-3-recovery-offer`, blocked): item 76 by number (its form's §2.10), and one new Part with no letter given.
- Scale display (ready): a new item at the next free number, and a new Part at the next unused letter (its form's §2 item 8 and its Operator line). No letter or number is fixed.
- The identity route (ready): item 3, and a new Part whose letter is the custodian's.
- Partitioned refusal: item 20 only, and no Part.
- Command-bar Enter: an unnumbered item, written at another piece.
- Describe-fails: item 72, unchanged.
- Large-utf8, cancel-requested and opened-of-panic: none.

**My reading:**
- **Part: AF.**
- **KNOWN-LIMITATIONS numbers: 77, 78 and 79,** for KL-A, KL-D (Amendment's changed draft) and KL-E. These skip 76, which the recovery offer holds by number.
- KL-B and KL-C are about Jobs and the Export Cancel. That makes them PR B's, by my reading; §9a does not assign the drafts to a PR.

**Open questions on Part 3:**
1. The drafts' split between PR A and PR B.
2. The scale display, the identity route and the recovery offer each hold a claim to a Part without a letter, and scale display holds one to an item without a number. Each would work out AF, or 76 or 77, at a base before PR A merges. Which of them takes which letter is for the custodian or the advisor.

## 4. The row-filter paragraph

`KNOWN-LIMITATIONS.md`, lines 185 to 188 at 6bc40126, hold the unnumbered paragraph. Line 189 holds the correction of 2026-11-16, which reads in part `Cancel can stay up in the filter panel`.

**My reading: it bears only on PR B's Jobs row, not on PR A.**
- A per-tile query refused on the candidate arm is logged and dropped, through `logMintRefused` and then the drop or requeue path. This is in `frontends/shell/src/streaming/tileViewportStreamManager.ts`, lines 956 to 979 at 6bc40126, with `onTileDropped` documented at lines 106 to 112.
- Neither path calls the viewport-refusal setter (`App.tsx`, lines 1615 and 1625 at 6bc40126). So none of §2.2's seven routes raises a condition for it.
- KL-A's first sentence already covers its absence from Problems, as a paraphrase of KL-A.
- Its Cancel clause concerns `isScanInFlight` (`App.tsx`, lines 530 to 532). That is what PR B's Jobs row for the map's loading would mirror (KL-B, as a paraphrase).
- Limit of this reading: I did not trace `onTileDropped`'s consumer in `candidateArmSession.ts` beyond that doc.

## 5. Not done here

I ran no e2e suite. §0.3's "runs every e2e suite at the base" is placed by ADV-2026-11-24-04 item 3: after the operator sitting and before any e2e run at the head.

**The suites they will be, at 6bc40126 (27 app suites):** admission-remediation, attributes, colour, colour-refill, command-bar, console, debug-session, export-view, filter, filter-panel, layout, open-fills-fit-view, pan-anchor, project, publish, recentre-crossing, recording, refusal-contract-baseline, regression, reopen, residency-harness, second-open, selection, source-changed, source-watch-idle, style and table.

- **Not suites:** lib, tsModuleLoader, writeMeasureConfigOverlay, the check* scripts, and exportElapsed, residencyTrace and s5dVerdict with their `*.test.mjs` node tests.
- **Not at the base:** `conditions.mjs` and `conditions-baseline.mjs` (Amendment 4) do not exist at the base. They can only run at the head.
- **Open question:** whether residency-harness counts as a suite, and in which mode, is for `frontends/shell/e2e/README.md`'s entries to settle.

## Files read

**At `D:/wt/read-m5base` (6bc40126)**
- Shell source:
  - `frontends/shell/src/App.tsx`
  - `layout/contributions.ts`, `layout/StudioLayout.tsx`, `layout/statusItems.ts`, `layout/layoutState.ts`
  - `canvas/WorkingCanvas.tsx`
  - `admission/admitDataset.ts`
  - `workspace/workspaceState.ts`
  - `filter/FilterPanel.tsx`
  - `publish/PublishPanel.tsx`, `publish/PublishDialog.tsx`
  - `console/surfaceRegistry.ts`
  - `streaming/tileViewportStreamManager.ts` (parts)
  - `styles.css` (grep)
- Shell unit tests:
  - `App.streamFailure.test.tsx`, `App.layout.test.tsx`
  - `App.lateResult.test.tsx` (lines 772 to 846, and grep)
  - grep only: `App.command`, `App.recording`, `App.reopen`, `App.save`, `App.test.ts`, `StudioLayout.test.tsx`, `candidateArmSession.test.ts`, `viewportStreamManager.test.ts`
- Other base files:
  - `frontends/shell/src-tauri/src/commands.rs`
- e2e suites:
  - read: `project.mjs`, `reopen.mjs`, `residency-harness.mjs`, `source-changed.mjs`, `source-watch-idle.mjs`, `refusal-contract-baseline.mjs`, `regression.mjs`, `console.mjs`, `admission-remediation.mjs`, `layout.mjs`, `selection.mjs`, `filter-panel.mjs`, `table.mjs`
  - grep only: `command-bar.mjs`, `second-open.mjs`, `README.md`, and every other `.mjs` in that folder
- Records:
  - `KNOWN-LIMITATIONS.md`
  - `frontends/shell/MANUAL-WALKTHROUGH.md` (Part headings)

**At `D:/wt/read-m5form` (f0718827)**
- `governance/forms/frontends/SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md`: the body and Amendments 1 to 8; it ends at Amendment 8.
- `governance/PLAN.yaml`.
- Forms read in part:
  - `PARTITIONED-ORDINAL-REFUSAL-OPENS-THE-IDENTITY-FORM`
  - `COLOUR-BY-REFILL-KEEPS-THE-VIEW`
  - `SHELL-SCALE-DISPLAY`
  - `IDENTITY-DECLARATION-ROUTE-FOR-SESSION-TIER`
  - `RELINK-AFTER-REFUSAL-AT-THE-RECORDED-PLACE`
  - `B2-1C-STEP-3-RECOVERY-OFFER`
  - `COMMAND-BAR-ENTER-AFTER-AN-APPLIED-RESULT`
  - `DESCRIBE-FAILS-AFTER-OPENED-CLOSES-THE-HANDLE`
  - `LARGE-UTF8-AND-UTF8-VIEW-ATTRIBUTE-COLUMNS`
  - `CANCEL-REQUESTED-STAMP-ORDER`
  - `OPENED-OF-PANIC-SITES-FREE-THE-LOCK`
- A grep across `governance/forms/` for Part and item claims.

**At `D:/wt/read-1124b`**
- `state/directives/2026-11-24-advisor-ruling-adv-2026-11-24-04-milestone-5-pr-a-the-reviewers-fail-c-1-red-then-green-e-1-a-post-result-re-sweep-at-the-base-s-5-unmarked-attempt-2-narrow.md`, item 3 only.

**The brief:** `<u>/AppData/Local/Temp/claude/3eed48519155ece4/da685a21-245c-4f3e-8f40-060e581f487c/scratchpad/brief-m5a-resweep-1.md`

I read nothing on the must-not-read list. I wrote no file and ran no command.

Model: Opus 5.5 (claude-opus-5-5).
