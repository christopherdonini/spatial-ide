# Milestone 5 PR A: the re-sweep at the base compared with what PR A built, the architect reading

*Filed by the custodian: node:shell-migration-milestone-5@pr-a-comparison-architect-1, the comparison ADV-2026-11-24-04 item 3 orders after the re-sweep filed post-result. It is a reading and gives no verdict. While it ran, the custodian had dispatched the ADV-2026-11-24-07 observations worker into the same worktree, and that worker was writing comment lines in two test files; the report discloses it and read those two files from the diff at 7c816dd4. That overlap was the custodian's dispatch. Dispatched at 2026-11-24T02:50:52Z; its run: Read 59, Grep 28, Glob 1, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-24T02:50:53Z to 2026-11-24T03:03:01Z by its transcript; 0 calls named the main checkout; handed back at 2026-11-24T03:03:01Z. 17273 bytes, sha256 df694d1f415e2bd4dc54d6c2d302085083b85a5a079ed3dbac18e398709d949f, byte for byte, nothing masked, with one final newline added.*

---

Comparison: the re-sweep at 6bc40126 with PR A's head 7c816dd4
Read: D:/wt/m5a @ 7c816dd4e61b426f9fcdc4e48b0c3c0c87189795
REPORT PATH: state/consults/2026-11-24-shell-migration-milestone-5-pr-a-comparison-of-the-re-sweep-with-the-head-architect.md

This is a reading, not a gate, so there is no verdict. The re-sweep is `<S>/report-m5a-resweep-1.md`. The diff is `<S>/m5a-diff-7c816dd4.txt`.

**Disclosure on what I read (my reading).** `D:/wt/m5a` is not exactly 7c816dd4. Two files carry comment lines that are not in the diff:
- `frontends/shell/src/App.lateResult.test.tsx`, line 477 in the tree, which begins `// READ 2026-11-24 at 7c816dd4 (ADV-2026-11-24-07 item 5)`;
- `frontends/shell/src/conditions/conditions.test.ts`, line 170 in the tree, which begins `// OBSERVED 2026-11-24 at 7c816dd4:`.

ADV-2026-11-24-07 is not on main at 4630fa09. I ran nothing, so I cannot tell whether the tree is dirty or its HEAD has moved. For those two files I used the diff as the content at 7c816dd4.

The other files I read match the diff's hunk positions: App.tsx, StudioLayout.tsx, contributions.ts, surfaceRegistry.ts and the e2e files. A grep for `ADV-2026-11-24-0[5-9]` across the tree found only those two files. The custodian should check the tree before the closing amendment pins any line in them.

## 1. The interfaces

| Re-sweep part 1 interface | Does PR A's head change it? | Named by the form? |
|---|---|---|
| `ATTENTION_ITEMS` (contributions.ts, lines 46–47 at 6bc40126) | Yes. It is now `[{ id: "top" }]` (diff hunk `@@ -41,10 +42,11`; `contributions.ts`, line 49 at 7c816dd4) | §2.3 |
| The strip is hidden when empty (StudioLayout.tsx 306, 379–383) | Yes. The rule is now `hidden={!attentionHasItems && attentionOthers === 0}` (StudioLayout.tsx, line 388 at 7c816dd4), and the S-3 button is at lines 392–396 | §2.3 (`attentionOthers`) |
| App fills the slots (App.tsx 2471–2534) | Yes. One `attention.top` slot (App.tsx, line 2539 at 7c816dd4) and `activity.problems` (line 2673). The markup has moved to ConditionView.tsx | §2.3 |
| Sub-bullets: RefusalBlock with no Dismiss; `canvasRefusal` has Dismiss; notices have none | Kept. ConditionView.tsx, lines 56–59 (session ended through RefusalBlock) and lines 63–67 (Dismiss only where `routeEnds(route, "dismissed")`) at 7c816dd4 | §2.3 |
| Sub-bullet: the viewport refusal is suppressed by `!sessionEnded` (App.tsx 2520 at 6bc40126) | Yes. Suppression is now by code at raise time: `if (!isSessionEndedRefusal(e) && target !== null) {` (App.tsx, line 1656 at 7c816dd4). An older viewport refusal now stands beside session ended | Named by Amendment 2 (C-A1's New row, form line 770, and its red-before at line 974). **See F-1** |
| The re-sweep's added fact: notices carry `canvas-refusal` | Kept: `NOTICE_CLASS` (ConditionView.tsx, lines 48–52 at 7c816dd4) | (an unchanged fact) |
| The state declarations (872, 887, 889, 921–923, 944–945, 958) | Replaced by `useReducer(conditionsReducer, …)` (App.tsx, line 879 at 7c816dd4). `sessionEnded` stays (line 980) | §2.2 App |
| The set sites: 667, 879, 1615/1625/1614, 1894, 2195, 1240 | Each now raises or clears. App.tsx at 7c816dd4: lines 2479, 890, 1645, 1659, 1940, 2251 and 1267 | §2.2 table |
| Session ended at 1496–1499 (the `endSession` adapter) | Raises (App.tsx, line 1525 at 7c816dd4). `resource.generationEnded` is kept at line 1527 | §2.2 |
| Session ended at 1196–1199 (the reset adapter) | Unchanged, and **no raise** there (App.tsx, lines 1219–1222 at 7c816dd4) | §2.2 says both sites raise. **See F-2** |
| `admitAndResetStaleUiState` (251–262) | Signature unchanged (App.tsx, lines 225–267 at 7c816dd4). The refusal setters are passed as no-ops (lines 1208–1209), and `opened` is dispatched in `setAdmitted` (line 1225) | §2.2, H5 |
| A second canvas refusal overwrites the first (667, 1894) | Yes, by design. Identity is now a typed key (conditions.ts, lines 138–157 at 7c816dd4), and the ceiling kind maps to a code at App.tsx line 677 | §2.2, OPEN-2 (a) |
| WorkingCanvas `onCanvasRefusal` (564–568) and its catch (1541–1555) | Yes. The prop gains `kind: CeilingKind` (WorkingCanvas.tsx, line 569 at 7c816dd4). The catch uses `ceilingKindOf` (lines 1544–1547) | OPEN-2 (a); Amendment 2 (limits.ts) |
| Every open mints a handle (724–731, 2339–2341); admitDataset.ts | Unchanged (App.tsx, lines 731–738 and 2402–2404 at 7c816dd4; admitDataset.ts is not in the diff) | (unchanged) |
| workspaceState.ts; statusItems.ts; status items (contributions.ts 50–56) | Unchanged: the first two are not in the diff, and the status items are now contributions.ts lines 52–58 | (unchanged) |
| Activity tabs (contributions.ts 40–44); layoutState.ts 34 and 51 | `ACTIVITY_TABS` gains `problems` (contributions.ts, line 45). layoutState.ts is not edited; its derived type widens | §2.3 S-1 |
| Tab panels and the reveal pattern; the table load (StudioLayout.tsx 41–42, 443–453, 256–259, 171–172, 148) | Unchanged apart from line shifts: 457–467, 260–263 and 175–176 at 7c816dd4. `revealProblems` (lines 310–314) follows the pattern | §2.3 |
| Scan state, liveness, FilterPanel, the inline Cancel handler | Unchanged. App.tsx is +4 through line 669 and +63 after the save hunk (e.g. `relinquishFill` at line 2385). FilterPanel.tsx is not in the diff | (unchanged; PR B's) |
| Export: `ExportRunReport`, the runs, the ask, PublishPanel, PublishDialog, commands.rs | Unchanged. App.tsx lines 1279–1312, `confirmOpen` at 1315, `answerOpenAsk` at 1330–1347 at 7c816dd4. The other files are not in the diff | (unchanged) |
| Console registry (325–331, and the dismiss rows at 237–253) | Statements edited at surfaceRegistry.ts, lines 242, 251 and 329 at 7c816dd4 | S-12 (§2.3); S-13 (Amendment 2, form lines 1089 and 1095) |
| §0.2's e2e list; the App.streamFailure.test.tsx harness | Unchanged (not in the diff) | — |

No 0.2 code interface is changed without the form naming it.

## 2. The selectors

PR A's head edits **no** existing e2e suite. All eleven are in §2.6's e2e list. "Named" below means named by line in §0.2 or in Amendment 2's D-f (form lines 87–96 and 1113). Amendments 9 and 10 name unit-test files only.

What decides the outcomes, by reading the head:
- **(R) never arises for notices.** Save and record notices go through `replaceBatch`, which ends the batch and then raises one display per ordinal (conditions.ts, lines 187–203 at 7c816dd4). Reopen notices are raised once per ordinal under a new generation. So S-5 can only appear on the canvas-ceiling, stream-terminal and viewport-refusal routes.
- **(T) renders only S-10** (ProblemsTab.tsx, lines 23–24 at 7c816dd4), with no inner classes.
- **(K) keeps vertex and pick apart.** They are two codes (App.tsx, line 677 at 7c816dd4). The pick ceiling is 16,777,215 (limits.ts, line 30) against 2,000,000 resident vertices (line 73), so in practice only the vertex ceiling is hit.
- **DOM order:** Layers (StudioLayout.tsx, line 381), then the strip (line 388), then Activity (line 449).

Each read below is unchanged by PR A. "Holds" means it holds at the head by my reading.
- **project.mjs 274 and 383–386: holds.** Each save notice is in the DOM once with no S-5. The re-sweep read that (R) breaks line 385; that does not apply at the head. Named (274 by D-f; 383–386 by §0.2).
- **reopen.mjs 297 and 391–394: holds.** Named (as 295 and 366; both moved).
- **residency-harness.mjs 718–724: holds unless a session ends** while a dismissible refusal stands. Then the first `.canvas-refusal button` is a hidden Problems row, and Playwright's click waits on it. Notices never outrank refusals. Named (719).
- **residency-harness.mjs 827–833 (diagnostic) and 2754 (DOM-click sweep, hidden rows included): holds.** Named (829 and 2754).
- **source-changed.mjs 732–745 and its uses: holds.** Session ended is urgency 1, so it is always the strip's top. The Problems top row has no class. `dismissButtons` is 0, and `stackText` appears only in error messages. Named (732–744); the uses are not named by line.
- **source-watch-idle.mjs 247–260 and its uses: holds.** Named (249–250).
- **refusal-contract-baseline.mjs:**
  - 186–193 and 268–274 hold while one condition stands. 268–274 would throw only if a second condition stands after the Dismiss. A stream terminal goes through `onFailureTerminal`, which I read as failures only. Named (188–191 and 261–273).
  - 229–235 holds (presence only). **Not named by line**, but it does not break.
  - 260–266 holds. Named.
  - 376–385 holds. Named (377–382).
  - 623 holds. Named.
- **regression.mjs 258–265 and its twelve uses: holds** wherever the base held, with one edge: an older viewport refusal now stands beside session ended (row 5 of the part 1 table). Named (260–263). 2671 holds. Named.
- **selection.mjs 161 and 764: holds.** The strip is empty in S0, S1 and S2, because a plain open raises nothing. Named.
- **layout.mjs 206 and 222: holds** (strip empty, so no S-3). **Not named by line.** 288–323 holds: styles.css does not touch `.attention-strip` (diff hunk `@@ -589,6 +589,32`), so the re-sweep's "§2.3's styles.css change applies here" does not apply. Named (288–320).
- **console.mjs 1230 and admission-remediation.mjs 856: holds.** Named (as 1041, moved; and 856).
- **admission-remediation.mjs 377, 603, 761 and 766 (the re-sweep's open question): holds.** (T) adds no `.admission-refusal-*` element, and Layers comes first. Not named.

No read that PR A changed, or that breaks on an ordinary path, is missing from the form.

## 3. The reads beyond the brief

| File | Changed by PR A? | In the Scope? | Do its strip reads hold at the head? |
|---|---|---|---|
| `App.lateResult.test.tsx` | Yes | Yes (Amendment 9 item 2) | Base 843 (B's ceiling read as the first `.canvas-refusal`) breaks under (K), as the re-sweep says. It is replaced at lines 853–861 at 7c816dd4 (by the diff). Base 836 (ProducerFailed) still holds. The re-sweep did **not** name base 1045 and 1107, which break the same way; they are replaced at lines 1066–1072 and 1137–1143 at 7c816dd4. Nor did it name base 812 and 842, two `onCanvasRefusal` calls that fail `tsc` under the part 1 WorkingCanvas change; they are fixed at lines 823 and 853 |
| `App.command.test.tsx` 645 | No | No | Holds: one record notice, in the strip, no Dismiss |
| `App.recording.test.tsx` 234 | No | No | Holds: same as above |
| `App.reopen.test.tsx` 363, 398 and 447 | No | No | Holds: the strip comes before the rows in raise order, so the list order is the same |
| `App.save.test.tsx` 199 and 213 | No | No | Holds |

## 4. The three files of ADV-2026-11-23-37, found late (ADV-2026-11-24-04 item 3)

- **`App.table.test.tsx`, line 206 at 6bc40126:** it reads Activity's tab list, which §2.3 S-1 widens. A base sweep of reads of `ACTIVITY_TABS` would have listed it. Part 2 does not, because its rules cover strip reads and it did not grep this file.
- **`App.test.ts`, lines 1271 and 1275 at 6bc40126:** these are source-text pins on two viewport-outcome set sites that part 1 lists. A sweep of each 0.2 interface's consumers would have listed them. Part 2 does not list them, although the re-sweep did grep this file.
- **`App.lateResult.test.tsx`:** part 2 lists it, beyond the brief, with base 836 and 843 only. Lines 1045 and 1107 and the two `tsc` breaks at 812 and 842 are missing (see part 3).

## 5. The records

- **`KNOWN-LIMITATIONS.md` at 7c816dd4:** items 77, 78 and 79 at lines 560, 564 and 568, which are KL-A, KL-D and KL-E. Item 76 is not used. This agrees with the re-sweep's reading and with Amendment 9 item 6. I compared no words; that is the advisor's job at the merge check.
- **The row-filter paragraph (lines 185–189):** the head adds nothing there. That agrees with the re-sweep's part 4 reading.
- **`frontends/shell/MANUAL-WALKTHROUGH.md`:** not in the diff, so the head has no Part. The re-sweep names AF, and §9 (form line 501) asks for one new Part. **See F-3.**

## 6. The e2e runs at the base

The head changes none of the re-sweep's 27 suites. It adds `conditions.mjs` and `conditions-baseline.mjs`, with two package.json script lines and an entry in `e2e/README.md` (a record).

## Findings, for the advisor

**F-1.**
- *What changed:* the viewport refusal no longer hides while session ended stands. It is suppressed only by code (App.tsx, line 1656 at 7c816dd4).
- *What the form names:* Amendment 2 names this change, through C-A1's New row (line 770) and its red-before (line 974). But §2.2, form line 221, still reads `This is the suppression App applies today, at `:2518`.`
- *My reading:* the code follows Amendment 2. Line 221's sentence is untrue of the base. This is a wording finding, and the closing amendment should mark line 221 as superseded by Amendment 2's C-A1.

**F-2.**
- *What changed:* the reset adapter (App.tsx, lines 1219–1222 at 7c816dd4) does not raise.
- *What the form names:* form line 243 reads `Its two set sites also raise.`, and the routes table (line 212) cites `:1194-1196`.
- *My reading:* that site only ever writes `null` (App.tsx, line 258 at 7c816dd4), so the head is right and the form's words go too far. This is a wording finding. The closing amendment should pin it as superseded.

**F-3.**
- *What changed:* nothing. There is no walkthrough Part at 7c816dd4.
- *What the form names:* §9's Operator line (line 501), and the re-sweep's AF.
- *My reading:* the steps marked (A) and step 6 need the Part before PR A merges. The re-sweep's part 3 question 2 (scale display, identity route and recovery offer, which all claim letters) is still open. The advisor decides the letter, and whether the Part comes with PR A.

**F-4.**
- *What changed:* nothing in that block. `App.test.ts`, lines 335–376 at 7c816dd4, are unchanged from the base. They still model the Dismiss as `setCanvasRefusal(null)` and call themselves the actual wiring. Line 347:
  ```
  // this is an assertion about the actual wiring, not a restatement of `nextResidencyStatus`'s type.
  ```
  At the head, the Dismiss is `dismissCondition` (App.tsx, lines 939–942 at 7c816dd4).
- *What the form names:* Amendment 9 item 2 says "No other line of the file changes."
- *My reading:* the property still holds by reading, because nothing reaches `setResidencyStatus`. The e2e test refusal-contract-baseline 275–279 proves it after the run. But the test's claim to model the wiring is untrue at the head, which may make it Evidence rather than wording. Comments with the same staleness: `refusal-contract-baseline.mjs` line 205, and `residency-harness.mjs` lines 691 and 707. All are outside what Amendment 9 lets PR A edit. The advisor chooses between a correction to the text, inside the Scope by named exception, and leaving it as recorded.

**Notes (not findings).**
- **N-1.** Because the re-sweep's declared list covers reads in all eleven §2.6 suites, I3 can only be hit in the other sixteen. Reading the head, only these can break: residency-harness 719 (needs a session end), refusal-contract-baseline 268–274 (needs a second condition), and the regression check under F-1's edge. The advisor may want H1's list narrowed to those before the runs at the head.
- **N-2.** The re-sweep's (R) entries for project.mjs and reopen.mjs do not apply at the head (part 2).

## What the closing amendment must record (as references)

- the re-sweep amendment and this comparison, by path;
- the three files found late, as named in part 4;
- F-1 to F-4, each with the advisor's ruling by ADV number and item;
- the superseded lines: form line 221 (F-1), line 243 and the routes-table cite (F-2), and H5 (Amendment 9 item 3);
- KL items 77 to 79, and the Part letter or the ruling that defers it;
- that no existing e2e suite was edited, so the declared list is the I3 boundary for the runs at the head;
- the base e2e runs, after the sitting and before any run at the head;
- the state of the `D:/wt/m5a` tree against 7c816dd4 (see the disclosure above).

## Files read

- `<S>/brief-m5a-compare-1.md`, `<S>/report-m5a-resweep-1.md`, `<S>/m5a-names-7c816dd4.txt`, and `<S>/m5a-diff-7c816dd4.txt` (in part).
- At `D:/wt/read-1124b` (4630fa09):
  - the form: body, Amendments 2 and 4 (Scope), and Amendments 8 to 10;
  - the ADV-2026-11-24-04 and ADV-2026-11-23-37 directives, and the ADV-2026-11-23-30 directive (in part);
  - the reviewer's gate report (in part);
  - a glob of `2026-11-24-advisor-ruling-adv-2026-11-24-0*`.
- At `D:/wt/m5a`:
  - `frontends/shell/src/`: App.tsx (in part), `layout/StudioLayout.tsx` (in part), `layout/contributions.ts`, `canvas/limits.ts` (grep), App.test.ts 330–379, App.layout.test.tsx 360–399, App.command.test.tsx 610–659, App.recording.test.tsx 205–244, App.save.test.tsx 185–215, App.reopen.test.tsx (grep), App.lateResult.test.tsx (in part), App.conditions.test.tsx 336–371;
  - `frontends/shell/e2e/`: residency-harness, project, reopen, source-changed, source-watch-idle, refusal-contract-baseline, selection, layout and command-bar (all in part), plus greps;
  - `.git`, the pointer file only.
- Nothing in `C:/dev/spatial-ide`. I wrote no file and ran nothing.

Model: Opus 5.5 (claude-opus-5-5).
