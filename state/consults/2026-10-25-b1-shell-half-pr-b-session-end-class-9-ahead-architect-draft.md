*Custodian's filing note (2026-10-25): the architect's read-only draft, ahead, of the scope addition (class 9) that milestone 4's PR B will carry for `session-end-lines-name-coverage-lost-as-source-change`, read at main 00e3a5c2. Nothing is committed from it until PR B's re-sweep amendment, after 1c's step 1; its OPEN-1 and OPEN-2 go to the human, and OPEN-3 is the custodian's, (a). The run 08:41:23Z to 08:53:13Z by its transcript (Read 57, Grep 32, Glob 1; no write tool). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is c360a62af65f096ec33d61e84592e75a3b3a515a3f961b7eb54534e9b0fedf4e.*

---

Drafted: b1-shell-half PR B, the session-end lines' class 9 addition (ahead), architect

Read at: main @ 00e3a5c2 (the main checkout; `git status` showed only untracked files). Every cite below is `path:line @ 00e3a5c2`. I have no shell, so this draft carries no sha256: the custodian pins every cite by script at PR B's re-sweep. Every sentence below is my own wording, and none of it is the human's. Code strings shown in backticks are byte-copied from my Reads.

Sources read: the ruling at `state/directives/2026-10-25-255-route-b-o1-lead-data-probe-session-end-lines-s2-context-monday-no-redaction-pr.md`, item 3; the RULED block of 2026-10-25 in `DECISIONS-PENDING.md` (the custodian's call: into PR B by class 9); the PLAN node summary in full; my gate 1 note C1; the form's §2.1, §2.3, §2.6, §5, §7 and §8, and Amendments 5, 8, 10 and 11, last first; the PR B ahead draft; 1c's §2.11, §2.14 and Amendments 2 and 3; SKP-V0's session-ended family; and every session-end path listed below.

---

## 1. Which lines change

How an end reaches the shell. Every route ends in App's `endSession` (`frontends/shell/src/App.tsx:1363-1375 @ 00e3a5c2`). It calls `handleSessionEnded` (`frontends/shell/src/App.tsx:697-709 @ 00e3a5c2`), which sets three things:
- the typed status;
- `{ kind: "session-ended" }` on the hover;
- the workspace action `resource.generationEnded`, which carries no reason.

The reducer then ends every view's generation with a fixed reason: `endViewGeneration(views[id], "source-changed")` (`frontends/shell/src/workspace/workspaceState.ts:162-170 @ 00e3a5c2`). A rebind ends it with `"reopened"` (`frontends/shell/src/workspace/workspaceState.ts:151 @ 00e3a5c2`).

The routes into `endSession` admit only the two codes:
- the terminal check `isSessionEndedTerminal` and the pre-check check `isSessionEndedRefusal` (`frontends/shell/src/streaming/liveTicketSet.ts:58-63 @ 00e3a5c2`, `frontends/shell/src/streaming/liveTicketSet.ts:80-85 @ 00e3a5c2`);
- the event route's built detail (`frontends/shell/src/App.tsx:739-742 @ 00e3a5c2`).

The kernel's facts are in `protocol/skp/SKP-V0.md:877-890 @ 00e3a5c2`: coverage-lost is the watch losing its watch, never `engine.source_changed`.

| # | Line, at main | Covered by the ruling? | Reading |
|---|---|---|---|
| L1 | Hover readout, session-ended state: `HOVER_SESSION_ENDED_TEXT` (`frontends/shell/src/canvas/HoverReadoutView.tsx:39-40 @ 00e3a5c2`), rendered at `frontends/shell/src/canvas/HoverReadoutView.tsx:73-77 @ 00e3a5c2` | Yes (OPEN-1 (a)) | It says the source file changed for every end. That is untrue for coverage-lost. It can be reached for two reasons only: a reopen resets the hover, the last click and the latch (`frontends/shell/src/App.tsx:1128-1146 @ 00e3a5c2`). |
| L2 | Feature tab, last-click line, session-ended state (`frontends/shell/src/feature/FeatureTab.tsx:103-104 @ 00e3a5c2`), which shows the same constant | Yes, with L1 | Same defect, same two reasons. |
| L3 | The selection-ended notice: `noticeText` (`frontends/shell/src/feature/FeatureTab.tsx:108-116 @ 00e3a5c2`), shown in the Feature tab (`frontends/shell/src/feature/FeatureTab.tsx:172-176 @ 00e3a5c2`) and as the status bar item (`frontends/shell/src/App.tsx:2428-2431 @ 00e3a5c2`) | Yes. It is the only line that carries all three of the ruling's reasons | Coverage-lost reads "because the source file changed", because the reducer hard-codes `"source-changed"`. |
| L4 | Attention strip: RefusalBlock over `sessionEnded` (`frontends/shell/src/App.tsx:2289-2291 @ 00e3a5c2`; `frontends/shell/src/admission/RefusalBlock.tsx:24-41 @ 00e3a5c2`) | Not changed | It already names the reason: the kernel's code, the kernel's message, and a separate owner sentence for each code (`frontends/shell/src/admission/formatRefusal.ts:72-111 @ 00e3a5c2`). |
| L5 | The Table's ended line (`frontends/shell/src/table/tableSource.ts:72-73 @ 00e3a5c2`) | Not changed (OPEN-1 (c) is the alternative) | Since Amendment 10 item 1 it states only the table's consequence, and that is true for both kernel reasons. Amendment 10 item 1 declined a line per code. L1, L3 and L4 name the reason beside it. |
| L6 | Session-log labels `tile-session-ended-source-changed` (`frontends/shell/src/streaming/tileViewportStreamManager.ts:748 @ 00e3a5c2`) and `candidate-session-ended-source-changed` (`frontends/shell/src/residency/candidateArmSession.ts:1094-1096 @ 00e3a5c2`) | Not changed | These are machine labels in the session log, not lines the app shows. The detail logged beside each carries the true code. The S5d verdict keys on the first label (`frontends/shell/e2e/s5dVerdict.mjs:38 @ 00e3a5c2`), so renaming it would break that suite. |
| L7 | Watcher status item | Not changed | It is hidden while an end stands (`frontends/shell/src/layout/statusItems.ts:27-28 @ 00e3a5c2`) and states no end. |

## 2. The sentences, with clause checks

All are `[P6 placeholder]`, sighted at the sitting (Part AC, the P6 sight row). Every word is mine.

**L1 and L2, coverage-lost (new):**
`[P6 placeholder] The source watch lost coverage of the file while it was open, so what was on the canvas was cleared and features here can no longer be identified — reopen the dataset to continue.`
- "The source watch": the status item's own term (`frontends/shell/src/layout/statusItems.ts:31-32 @ 00e3a5c2`).
- "lost coverage of the file": the code `engine.source_coverage_lost` and the event reason `coverage-lost` (`protocol/skp/SKP-V0.md:882-889 @ 00e3a5c2`). The engine produces it on a notification-buffer overflow or a failed read (`engine/src/watch.rs:325-351 @ 00e3a5c2`).
- "while it was open": an end for a dataset that is no longer current is dropped (`frontends/shell/src/App.tsx:719-731 @ 00e3a5c2`).
- "what was on the canvas was cleared":
  - baseline arm: the session-ended branch, driven for coverage-lost through the real manager (`frontends/shell/src/streaming/viewportStreamManager.test.ts:908-923 @ 00e3a5c2`);
  - candidate arm: `endCandidateSession` calls `clearAllTiles` (`frontends/shell/src/residency/candidateArmSession.ts:1085-1098 @ 00e3a5c2`), reached for both codes (`frontends/shell/src/residency/candidateArmSession.ts:1351-1352 @ 00e3a5c2`).
  - Not covered: an end delivered before any manager exists (`frontends/shell/src/App.tsx:778 @ 00e3a5c2`). Nothing is on the canvas then, so the clause is vacuous. This needs timing inside the open's effect, and it goes into the source comment.
- "can no longer be identified": the latch (`frontends/shell/src/canvas/pick.ts:104-106 @ 00e3a5c2`) and the click latch (`frontends/shell/src/feature/clickEffect.ts:46 @ 00e3a5c2`).
- "reopen … to continue": a reopen resets the latch (`frontends/shell/src/App.tsx:1122-1148 @ 00e3a5c2`).

**L1 and L2, source changed:** `HOVER_SESSION_ENDED_TEXT`, unchanged (OPEN-2). It is true for this reason. Its comment says the wording is the human's at P6 (`frontends/shell/src/canvas/HoverReadoutView.tsx:37-38 @ 00e3a5c2`), so it is not my wording. RB4 asserts its opening words (`frontends/shell/src/App.selection.test.tsx:453 @ 00e3a5c2`).

**L3, one sentence per reason.** `{dropped}` is the existing count clause (`frontends/shell/src/feature/FeatureTab.tsx:114 @ 00e3a5c2`).
- Source changed: `[P6 placeholder] The selection ended: {dropped}, because the source file changed.` This is unchanged.
- The watch lost coverage (new): `[P6 placeholder] The selection ended: {dropped}, because the source watch lost coverage of the file.`
- The dataset was reopened: `[P6 placeholder] The selection ended: {dropped}, because a dataset was opened.` This is unchanged. My reading: the rebind fires for any open, the same file or another (`frontends/shell/src/workspace/workspaceState.ts:144-151 @ 00e3a5c2`; every open mints a fresh handle, `frontends/shell/src/App.tsx:714-718 @ 00e3a5c2`). So "reopened" would be untrue when another file is opened.
- Clauses common to all three: "The selection ended" and "dropped" come from `selection.end` (`frontends/shell/src/workspace/viewTransitions.ts:135-141 @ 00e3a5c2`, `frontends/shell/src/workspace/viewTransitions.ts:181-187 @ 00e3a5c2`). The notice exists only when dropped > 0.
- Keeping two sentences unchanged keeps `e2e:selection`'s substrings (`frontends/shell/e2e/selection.mjs:470 @ 00e3a5c2`, `frontends/shell/e2e/selection.mjs:487 @ 00e3a5c2`), so `selection.mjs` stays off PR B's list.

## 3. The change: the reason travels with the state

1. **Where the reason is known.** It is known in `handleSessionEnded`, from the formatted code.
   - New in `App.tsx`: `sessionEndReasonOf(code: string): SessionEndReason`. It returns `"source-changed"` only for exactly `engine.source_changed`, and `"coverage-lost"` otherwise (OPEN-3).
   - Product callers: `handleSessionEnded`, and `handleAdmitted`'s reset (`frontends/shell/src/App.tsx:1143-1146 @ 00e3a5c2`).
   - `handleSessionEnded` computes it once. It calls `deps.setSessionEnded(refusal, reason)` (a new second parameter, read by `endSession`) and `deps.setHover({ kind: "session-ended", reason })`. The same deps type change applies to `endSessionForDataset` (`frontends/shell/src/App.tsx:719-731 @ 00e3a5c2`). Callers that take one argument still compile.
2. **The latch carries it.**
   - `sessionEndedRef` changes from `useRef(false)` (`frontends/shell/src/App.tsx:914 @ 00e3a5c2`) to `useRef<SessionEndReason | null>(null)`.
   - `isAlreadyEnded` becomes `sessionEndedRef.current !== null`.
   - The texts at `frontends/shell/src/App.tsx:1487 @ 00e3a5c2`, `:1936` and `:2215` are unchanged. So App.test.ts's source regexes still match (`frontends/shell/src/App.test.ts:1242 @ 00e3a5c2`, `frontends/shell/src/App.test.ts:1250-1252 @ 00e3a5c2`).
3. **`canvas/pick.ts`.**
   - New: `export type SessionEndReason = "source-changed" | "coverage-lost"`.
   - `PickSessionEnded` gains `reason: SessionEndReason` (`frontends/shell/src/canvas/pick.ts:63-65 @ 00e3a5c2`).
   - `latchedHoverReadout(readout, endedBy: SessionEndReason | null)` returns `{ kind: "session-ended", reason: endedBy }` when `endedBy` is not null. Product caller: `frontends/shell/src/App.tsx:2215 @ 00e3a5c2`.
   - The type still has no `id`, so the `@ts-expect-error` pair stays valid.
4. **`canvas/HoverReadoutView.tsx`.**
   - New export: `sessionEndedText(reason)`. Callers: the session-ended branch, and FeatureTab's `lastClickLine`.
   - `HOVER_SESSION_ENDED_TEXT` and the new coverage constant become module-level, not exported. Their only product importer, FeatureTab, moves to `sessionEndedText`, so an export would have no product caller (§8 item 13).
   - The class `hover-readout-session-ended` stays for both reasons. The e2e suites check only that class (`frontends/shell/e2e/source-changed.mjs:1243 @ 00e3a5c2`; `frontends/shell/e2e/source-watch-idle.mjs:562 @ 00e3a5c2`).
5. **`feature/clickEffect.ts`.** The third parameter becomes `endedBy: SessionEndReason | null` (`frontends/shell/src/feature/clickEffect.ts:45-46 @ 00e3a5c2`). Product caller: `frontends/shell/src/App.tsx:1936 @ 00e3a5c2`. `LastClick`'s session-ended member gains `reason` (`frontends/shell/src/feature/FeatureTab.tsx:45 @ 00e3a5c2`), and `lastClickLine` reads it.
6. **The workspace.**
   - `selection.ts` gains `export type GenerationEndReason = "source-changed" | "coverage-lost"`, and `SelectionEndReason` becomes `GenerationEndReason | "reopened"` (`frontends/shell/src/workspace/selection.ts:86-87 @ 00e3a5c2`).
   - The action `resource.generationEnded` gains a required `reason: GenerationEndReason` (`frontends/shell/src/workspace/workspaceState.ts:111 @ 00e3a5c2`). Its product caller is `endSession`'s dispatch. `endGeneration` passes the reason through.
   - Under UA6 the workspace cannot import `canvas/` (`frontends/shell/src/workspace/workspaceBoundary.test.ts:28-32 @ 00e3a5c2`). So the two literal unions are declared apart, and `tsc` checks that one is assignable to the other at App's dispatch.
   - `noticeText` switches over the three reasons.
7. **Comments in the touched files that are untrue for coverage-lost** are corrected in the same edit:
   - `frontends/shell/src/canvas/pick.ts:50-61 @ 00e3a5c2`;
   - `frontends/shell/src/App.tsx:670-672 @ 00e3a5c2` and `frontends/shell/src/App.tsx:899 @ 00e3a5c2`;
   - `frontends/shell/src/workspace/workspaceState.ts:19-21 @ 00e3a5c2` and `frontends/shell/src/workspace/workspaceState.ts:161 @ 00e3a5c2`;
   - `frontends/shell/src/workspace/selection.ts:86 @ 00e3a5c2`.
8. **ADR-006.** Every change is class 1: UI state and an unrecorded workspace action. Nothing is called undoable.

**§2.1 and §5, a reading the amendment must state.** §2.1 lists "the hover readout (OPEN-3 (a), confirmed)" as unedited, and §5 declares §2.1 unchanged. OPEN-3 (a) concerned attributes on the hover, and that stays (KL-7). The ruling of 2026-10-25, item 3, makes the session-ended sentence name its reason. The amendment records this narrowing with the class 9 addition (OPEN-1). No existing string changes, so §5's string clause holds. Two strings are added, both P6 placeholders for sight (§8 item 15).

## 4. Files and ceilings (class 9; round 25, item 2 (a); counted by §7's command; §7 not edited)

| Group | Files (ceiling each) | At most |
|---|---|---|
| B-P, added (the session-end lines) | `frontends/shell/src/canvas/pick.ts` 20, `frontends/shell/src/canvas/HoverReadoutView.tsx` 20, `frontends/shell/src/feature/FeatureTab.tsx` 15, `frontends/shell/src/feature/clickEffect.ts` 10, `frontends/shell/src/workspace/selection.ts` 6 | 71 |
| B-P, lines added to listed files | `frontends/shell/src/App.tsx` 45 (beside §7's App 120), `frontends/shell/src/workspace/workspaceState.ts` 15 (beside §7's workspaceState 10) | 60 |
| B-T, added | `frontends/shell/src/App.test.ts` 35, `frontends/shell/src/App.selection.test.tsx` 45, `frontends/shell/src/canvas/pick.test.ts` 20, `frontends/shell/src/canvas/HoverReadoutView.test.tsx` 30, `frontends/shell/src/feature/FeatureTab.test.tsx` 30, `frontends/shell/src/feature/clickEffect.test.ts` 6, `frontends/shell/src/workspace/selection.test.ts` 30, `frontends/shell/src/workspace/workspaceState.test.ts` 4, `frontends/shell/src/streaming/viewportStreamManager.test.ts` 4 | 204 |
| **Added** | 14 files (5 product, 9 test) | **335** |

The fills, found by grep at 00e3a5c2; `tsc` at PR B's base is authoritative:
- `frontends/shell/src/App.test.ts:1159 @ 00e3a5c2`, `:1294`;
- `frontends/shell/src/canvas/pick.test.ts:215 @ 00e3a5c2`, `:221`, `:234-236`, `:252`;
- `frontends/shell/src/canvas/HoverReadoutView.test.tsx:147 @ 00e3a5c2`, `:170`, `:188`;
- `frontends/shell/src/feature/FeatureTab.test.tsx:136 @ 00e3a5c2`, `:148`, and its import of the constant;
- `frontends/shell/src/feature/clickEffect.test.ts:26 @ 00e3a5c2`, `:42` (`false` becomes `null`);
- `frontends/shell/src/workspace/selection.test.ts:200 @ 00e3a5c2`, `:207`, `:231`, `:235`, `:308`;
- `frontends/shell/src/workspace/workspaceState.test.ts:107 @ 00e3a5c2`;
- `frontends/shell/src/streaming/viewportStreamManager.test.ts:925 @ 00e3a5c2`, which becomes `{ kind: "session-ended", reason: "coverage-lost" }`.

Each fill states its fixture's true reason. Any further edit `tsc` needs is I1 (the Amendment 3 pattern).

Not added: no e2e file, no KNOWN-LIMITATIONS item, no `e2e/selection.mjs`. Records outside the count: the Part AC P6 sight row gains the two coverage-lost sentences. They are sighted as text, because the engine produces the end only on an overflow or a failed read (`engine/src/watch.rs:325-351 @ 00e3a5c2`), which ordinary operation cannot trigger on demand.

## 5. Tests, each with one mutation (observed per round 25, item 2 (c); no `verify-mutation` run)

- **SE-U1** (`App.test.ts`), title in my words: "handleSessionEnded names coverage-lost from the kernel's real coverage-lost details, and source-changed only from its exact code". Inputs, the kernel-pinned bytes: `REAL_SOURCE_COVERAGE_LOST_TERMINAL_DETAIL`, `REAL_SOURCE_COVERAGE_LOST_PRE_CHECK_REFUSAL_DETAIL` and `REAL_SOURCE_CHANGED_TERMINAL_DETAIL` (`frontends/shell/src/testUtils/terminalShapes.ts:25-61 @ 00e3a5c2`). It asserts the hover's `reason` and `setSessionEnded`'s second argument. Mutation: `sessionEndReasonOf` returns `"source-changed"` for every code; SE-U1 fails.
- **SE-R1** (`App.selection.test.tsx`), the end-to-end test from the real shape: "RB4c: a session ended by the real dataset_session_ended route for coverage-lost names coverage-lost in the hover readout, the notice, the status bar item and the last click".
  - Route: open, select one feature, then call the listener App registered with a `DatasetSessionEnded` (`frontends/shell/src/skp/types.ts:321-324 @ 00e3a5c2`) of reason `"coverage-lost"`. It goes through `routeDatasetSessionEndedEvent`, the owner dispatch and the manager stand-in, which latches as the real one does (`frontends/shell/src/App.selection.test.tsx:4-12 @ 00e3a5c2`).
  - Asserts: `.hover-readout-session-ended` equals `sessionEndedText("coverage-lost")`; the stand-in canvas's `onHover` with a pick still shows it (the latch path); `.feature-notice` contains "lost coverage" and not "the source file changed"; `.selection-ended` equals `.feature-notice`; the strip's code is `engine.source_coverage_lost`; after a click, `.feature-last-click-session-ended` equals the coverage sentence.
  - Mutation: `endSession`'s dispatch passes `reason: "source-changed"`; SE-R1 fails at the notice.
  - Condition: the worker confirms first that the harness renders the hover slot (`frontends/shell/src/App.tsx:2277 @ 00e3a5c2`). If it does not, that is I1.
- **SE-U2** (`HoverReadoutView.test.tsx`): "a session-ended readout names its reason: coverage-lost and source-changed each their own sentence, no id in either". Mutation: `sessionEndedText` ignores its reason; SE-U2 fails.
- **SE-U3** (`FeatureTab.test.tsx`): "the notice and the last-click line name each end reason in their own words". Mutation: `noticeText` maps every reason except `"reopened"` to "the source file changed", which is main's code; SE-U3 fails.
- **SE-U4** (`selection.test.ts`): "a generation ended by coverage-lost ends the selection with the reason coverage-lost". Mutation: `endGeneration` passes `"source-changed"` whatever the action's reason; SE-U4 fails.
- **SE-U5** (`pick.test.ts`, the existing latch test made stronger): the latch carries the reason it is given. Mutation: `latchedHoverReadout` always sets `"source-changed"`; SE-U5 fails.
- **The real manager's route:** the fill at `frontends/shell/src/streaming/viewportStreamManager.test.ts:925 @ 00e3a5c2` now asserts `coverage-lost` through the real `ViewportStreamManager`. SE-U1's mutation also fails it. It is not a new test.
- **Not covered, named:** no e2e drives a coverage-lost end, because the engine cannot be made to produce one on demand.

## 6. Rule (00), path by path

- **1c steps.** Size rows: `kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:454 @ 00e3a5c2`, `:470`, `:486`; overlap in `kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:569-577 @ 00e3a5c2`.
  - `App.tsx`: in the shell product group of all three steps. It is already on PR B's list. The work is serial: PR B follows step 1's merge (OPEN-18 (b), as the PLAN node `b1-shell-half` records). Steps 2 and 3 do not dispatch while PR B is in progress or awaiting merge (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:1130 @ 00e3a5c2`).
  - `workspace/workspaceState.ts`: 1c reads it and edits it only under I1. Step 2 applies the workspace through the reducer, so its re-sweep reads the widened action.
  - `workspace/selection.ts`, `canvas/pick.ts`, `canvas/HoverReadoutView.tsx`, `feature/FeatureTab.tsx`, `feature/clickEffect.ts`: in no 1c group.
  - The nine test files: 1c's shell-test groups name no file. Step 1's branch diff is read at PR B's base, after it merges.
- **Other in-progress nodes**, read from their PLAN summaries only:
  - #241 (kernel, `src-tauri` publish, the viewer, KNOWN-LIMITATIONS): disjoint.
  - port-2 (kernel/engine, CI, KNOWN-LIMITATIONS item 1): disjoint.
  - covering-case and #255 (engine): disjoint.
  - #244, the F7 row (Part F): disjoint.
  - KNOWN-LIMITATIONS items 51 and 52: this addition adds no item.
  - No path under `protocol/`.
  - The custodian re-runs `git diff --name-only origin/main...<branch>` for each branch at the re-sweep.

---

## OPEN items

**OPEN-1 (the human's): what "the main-side session-ended line" covers.**
- (a) L1 and L2 (the hover and the Feature tab's last click) and L3 (the notice), with §2.1's hover entry read as narrowed to OPEN-3 (a). The node's title names the hover first.
- (b) L3 only. The hover would keep a sentence that is untrue for coverage-lost, the C1 class.
- (c) (a), plus a line per reason for the Table. That adds `table/TableTab.tsx` and its test, and about 25 lines to `tableSource.ts`. It reverses Amendment 10 item 1's choice.
- **Recommend (a).**

**OPEN-2 (the human's wording): the source-changed sentences.**
- (a) Keep both: `HOVER_SESSION_ENDED_TEXT`, which is the human's at P6, and the existing notice placeholder. Both are true for that reason.
- (b) Replace both with new placeholders. `e2e/selection.mjs` and RB4 would then join the list.
- **Recommend (a).**

**OPEN-3 (the custodian's; a code choice within the ruling): what `sessionEndReasonOf` returns for a code that cannot reach it.**
- (a) `"source-changed"` only on exactly `engine.source_changed`; every other code gives `"coverage-lost"`. The stronger claim needs its exact code.
- (b) Mirror `frontends/shell/src/App.tsx:740 @ 00e3a5c2`: exactly coverage-lost, else source-changed. This defaults to a claim that the file changed.
- (c) A third, neutral reason and sentence. It adds an extra string for a case that cannot be reached.
- **Recommend (a).** The reviewer re-runs the producer search at the head: the two checks plus `buildSessionEndedOwnerDetail`. A new producer of a third code is I1.

## What I could not settle

1. Without a shell: no `tsc`, no line counts, no hashes, and no branch diffs. The fill list is from grep, and `tsc` at PR B's base decides.
2. PR B's base moves after 1c step 1. Step 1's P5 edits `App.tsx`, and its S6, the selection notice at save, may sit near `noticeText`. The re-sweep re-reads both.
3. Whether App.selection's harness renders the hover slot. App.lateResult's harness does (`frontends/shell/src/App.lateResult.test.tsx:576 @ 00e3a5c2`). Not run.
4. Whether `HOVER_SESSION_ENDED_TEXT` has been sighted as final. Its comment says only that it is the human's at P6.
5. A finding outside this addition, for a later docs piece: comments in files PR B does not touch still describe every end as a source change: `frontends/shell/src/streaming/viewportStreamManager.ts:44 @ 00e3a5c2`, `:84`; `frontends/shell/src/streaming/tileViewportStreamManager.ts:93 @ 00e3a5c2`, `:214`; `frontends/shell/src/residency/candidateArmSession.ts:161 @ 00e3a5c2`, `:315`.

Report path for the custodian's filing: C:/dev/spatial-ide/state/consults/2026-10-25-b1-shell-half-pr-b-session-end-class-9-ahead-architect-draft.md
