# Milestone 5 PR A: the walkthrough Part AF, the architect's draft under ADV-2026-11-24-08 item 2

*Filed by the custodian: node:shell-migration-milestone-5@pr-a-part-af-architect-draft-1. It is a draft and gives no verdict; a gate checks its clauses, and then its words go to the advisor (ADV-2026-11-24-08 item 2). It ran during no build. Dispatched at 2026-11-24T04:13:52Z; its run: Read 34, Grep 29, Glob 3, SubagentHandback 1, by unique call ids, 2 calls errored; model claude-opus-5-5, from 2026-11-24T04:13:52Z to 2026-11-24T04:23:56Z by its transcript; 0 calls named the main checkout; handed back at 2026-11-24T04:23:56Z. 23487 bytes, sha256 5a4501f9b92b58544177b15d6fc7ea68e8043dd27c2496eb2dd2b8e893dd2aeb, byte for byte, nothing masked, with one final newline added.*

---

cut/shell-migration-milestone-5-pr-a @ 2e377679415a63a6ac8bbe264efd32707737c315. The records were read at main b5d2d7139509cd86ab7fc239870837875032a9b1 in `D:/wt/read-1124d`.

**Status: draft only, so no verdict.** Nothing here binds until a gate has checked its clauses and the advisor has ruled its words (ADV-2026-11-24-08 item 2). Below, "form" means `governance/forms/frontends/SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md` at b5d2d713. "Head" means 2e377679.

## 1. The letter: AF

- **Letters in use at the head** (`frontends/shell/MANUAL-WALKTHROUGH.md`, `## Part` headings): A to N (lines 156 to 918), P twice (1463 and 1622), Q, R, S, T, U, V, X, W, Y, Z, then AA to AE (1910 to 2050).
- **Letter O is reserved, not free** (head :1465, `briefb-part-o-walkthrough`).
- **Main at b5d2d713:** the same headings, ending at AD (:2021). AE came in with the re-link's head.
- **Main uses no letter the head lacks.**
- **The next unused letter in the head's tree is AF.** No file in either tree uses `Part AF`, apart from the form's Amendment 11 (form :1858), which names it as the re-sweep's reading.
- **If AF is taken at the merge, the Part is re-lettered.** The re-sweep report names three held pieces that claim unlettered Parts: scale display, the identity route and the recovery offer (`state/consults/2026-11-24-shell-migration-milestone-5-pr-a-re-sweep-at-the-base-architect.md:201-203`, `:216`). If one of them merges first, ADV-2026-11-24-08 item 2, third bullet, applies: the Part takes the next unused letter, as a class 3 change.

## 2. The class: owed work, not class 9

The walkthrough file is in the piece's Scope:
- §2.6 names it as a record outside the count (form :291).
- §2.6's shared-with-held-pieces list names it by path, "the re-link, as a separate Part" (:327).
- §7 gives it a records allowance of 120 lines (:453), and its count command excludes it (:439).
- §9's Operator line asks for "one new Part at the letter the re-sweep names, with a blank log", joining the queue "at each PR's merge" (:501).
- Amendment 7 item 7 counts it among the files PR A shares with colour-by-refill (:1778).
- No amendment removes it. Amendment 11 item 3 records Part AF "for PR A" (:1858).

§2.6's per-PR sub-lists (:293-319) do not name it under PR A by itself. But the records sentence covers the whole piece, and §9's "each PR's merge" places a share of the Part in each PR. So the Part is owed work inside Scope, and no class-9 amendment comes first.

## 3. The Part

```text
## Part AF — one place for what needs attention: the strip shows the most urgent, the Problems tab lists the rest, Dismiss ends one, and a new open ends them all (shell-migration-milestone-5, PR A)

This Part is the Operator gate of `governance/forms/frontends/SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md` §9, for PR A, run only on a build with PR A merged, with a blank result log. Its rows are §9's steps 0, 0a, 1, 2, 3 and 3a, and step 6 for PR A's strings. Steps 4 and 5 (Jobs) and PR B's strings join this Part with PR B, as rows AF4 and AF5 before AF6. **No duration appears in any row or expected outcome** (`docs/08_Testing.md`; ADR-018). Every sentence in it is a draft for the human's sight (P6) and none is the human's wording. This Part is run on Windows.

**Before AF0a to AF3:** a dev build started with `npm run tauri dev` (the Prerequisites), with no dataset open; DevTools (WebView2), for AF0a; fixture `over-ceiling-refused.parquet` (Part D; regenerate with `cargo test -p spatial-kernel --test manual_walkthrough_fixtures -- --ignored --nocapture`), copied to a scratch filename under `target\fixtures\manual-walkthrough\`, for example `over-ceiling-scratch-partAF.parquet`; a PowerShell terminal, for the touch in AF2. **Before AF3a:** fixture `100k-happy-path.parquet` (Part A), copied to a scratch filename in the same folder, for example `100k-scratch-partAF.parquet`; an empty folder that you make outside that folder, for the project; the same terminal.

| # | Step | Expected outcome |
|---|---|---|
| AF0 | Read the form's §10, the last amendment first. | Record the number of the last amendment you read. |
| AF0a | Before opening anything, open DevTools and run `await window.__SPATIAL_E2E__.setResidencyArm("baseline")`. | It resolves `{ok:true}` (Part D's D0). AF1 to AF3 show the baseline arm, which no operator reaches in the shipped build. |
| AF1 | Click **Open GeoParquet…** and select the over-ceiling scratch copy. | As the map draws, one refusal appears in the attention strip above the map: a line beginning `accepting this batch would carry`, with a **Dismiss** button. No button reading `more in Problems` shows, and no line beginning `Raised`; record whether either appeared. **Felt:** do you know where the others would go? |
| AF2 | Pan the map once. Press Ctrl+J to open Activity, click its **Problems** tab, then press Ctrl+J to close Activity again. In the terminal run `(Get-Item '<scratch path>').LastWriteTime = (Get-Date).AddMinutes(2)` on the over-ceiling scratch copy; this changes the modification time only and leaves the bytes untouched. Pan once more. Then click the button in the strip that reads `1 more in Problems`. | After the first pan the strip still shows one refusal, and below its first line a line reads `Raised <n> times in all. The latest:`, where `<n>` is 2 or more, followed by the refusal's line again; record `<n>`. The Problems tab lists one row, which reads `Shown above in the attention strip.` After the touch and the second pan, the strip shows a block with the code `engine.source_changed` in place of the refusal, and the button `1 more in Problems`. The button opens Activity on the Problems tab, which lists `Shown above in the attention strip.` first and then the refusal, with its `Raised` line and its **Dismiss** button. When the session ended on the post-check route, the button reads `2 more in Problems` instead, and Problems also lists a row that begins `stream `; record which you saw, and the block's message. **Felt:** is the count noticed, and does the strip feel calmer? **Strings for sight (P6):** S-1, S-3, S-5 and S-10. |
| AF3 | In the Problems tab, click **Dismiss** on the refusal's row. Then click **Open GeoParquet…** and select the same over-ceiling scratch copy. | The refusal's row goes and nothing else does: the block with the code `engine.source_changed` stays in the strip, and the `1 more in Problems` button goes (when a `stream ` row stood, the button reads `1 more in Problems` and that row stays). When the open is admitted, the block and every row are gone, the strip is hidden, and Problems reads `No problems for the dataset on the map.` As the map then draws, the new open raises the refusal of AF1 again: the strip shows it with no `Raised` line and no button, and Problems lists only `Shown above in the attention strip.` Record whether you saw `No problems for the dataset on the map.` before the refusal came back. **Strings for sight (P6):** S-4. |
| AF3a | Close the app and start it again with `npm run tauri dev`, with no DevTools step: the app runs the shipped arm. Click **Open GeoParquet…**, select the 100k scratch copy and let the map draw. Click Save project in the Layers region and, in the folder picker, choose the empty project folder, which does not hold the copy. In the terminal run the same touch on the 100k scratch copy, and pan once. Click the strip's `1 more in Problems` button. Last, click **Open GeoParquet…** and select the 100k scratch copy again. | After the save the strip shows `The project was saved.` and no `more in Problems` button; if a button shows, record its text and the rows Problems lists, and every count below is then one higher. After the touch and the pan, the strip shows a block with the code `engine.source_changed` and the button `1 more in Problems`. The button opens Activity on the Problems tab, which lists `Shown above in the attention strip.` and then the line `The project was saved.`, with no Dismiss button. No row holds a refusal code. When the second open is admitted, the strip is hidden and Problems reads `No problems for the dataset on the map.` |
| AF6 | P6 sight of PR A's strings. Seen in AF1 to AF3a: S-1, the tab's label `Problems`; S-3, the strip's button `{n} more in Problems`; S-4, `No problems for the dataset on the map.`; S-5, `Raised {n} times in all. The latest:`; S-10, `Shown above in the attention strip.` S-12 shows in the Console as the row recorded when the Problems tab opens: in AF3a's launch, click Activity's **Console** tab and find the row that reads `[P6 placeholder] no API equivalent exists -- switching the Activity region between its Console, Notices, Table and Problems tabs is pure view state for this session, never sent to the kernel.` The rest need a raise past the list's limit or a viewport refusal, which a sitting does not provoke, so read them where they are written: S-6 (`notKeptText`) in `frontends/shell/src/conditions/conditionsConstants.ts`, and S-13, the statements of `canvas.dismissCanvasRefusal` and `canvas.dismissViewportRefusal`, in `frontends/shell/src/console/surfaceRegistry.ts`. | For each string, the log records either the wording you want in its place, or "keep". None of them is the human's wording. |

## Result log

Fill in after running the rows above (the shell-migration-milestone-5 Part AF, PR A). PR B adds the lines for AF4 and AF5 before AF6's.

- **Date run:**
- **Run by:**
- **Build/commit:**
- **Last amendment read (its number):**
- **AF0a (what the call resolved):**
- **AF1 (the refusal in the strip; whether a `Raised` line or a `more in Problems` button showed; felt):**
- **AF2 (the `Raised` line and its number; the Problems row before the touch; the block's code and message after it; the button's text; the rows Problems listed; whether a `stream ` row stood; felt):**
- **AF3 (what Dismiss removed and what stayed; whether `No problems for the dataset on the map.` showed before the refusal came back; what the strip showed then):**
- **AF3a (the save's line, and any button after it; the block and the button after the touch; the rows Problems listed; what Problems showed after the second open):**
- **AF6 (for each string: the wording you want in its place, or "keep"):**
```

**Where each string comes from, at the head.** Where the code holds the template `${n}`, the Part writes `{n}` or `<n>`, or gives the value for n=1. Every text around it is byte-identical.

| String | Constant | Where it is shown |
|---|---|---|
| `Problems` (S-1) | `conditionsConstants.ts:16` | the tab entry `contributions.ts:45`, rendered at `regionParts.tsx:64` |
| `${n} more in Problems` (S-3) | `conditionsConstants.ts:18` | `StudioLayout.tsx:394` |
| `No problems for the dataset on the map.` (S-4) | `conditionsConstants.ts:20` | `ProblemsTab.tsx:19` |
| `Raised ${n} times in all. The latest:` (S-5) | `conditionsConstants.ts:22` | `ConditionView.tsx:39` |
| `Problems raised and not kept: ${n}. The list keeps at most 64.` (S-6) | `conditionsConstants.ts:24` | `ProblemsTab.tsx:20` |
| `Shown above in the attention strip.` (S-10) | `conditionsConstants.ts:26` | `ProblemsTab.tsx:24` |
| S-12 | `console/surfaceRegistry.ts:329` | the Console row, `ConsolePanel.tsx:197` |
| S-13 | `surfaceRegistry.ts:241-243` and `:250-251` | read in the file |

Owner texts the Part also quotes:

| Text | Where it comes from |
|---|---|
| `Dismiss` | `ConditionView.tsx:65` |
| `accepting this batch would carry` | `canvas/limits.ts:122` |
| `stream ` | `App.tsx:1945` |
| `The project was saved.` | `project/saveProject.ts:27` |
| `{ok:true}` | `residency/residencyArm.ts:53`, `:105` |
| the arm call | registered at `App.tsx:1451`; Part D's form at `MANUAL-WALKTHROUGH.md:218` |
| the touch command | byte for byte from `MANUAL-WALKTHROUGH.md:1521` (Part Q) |
| the regeneration command | `MANUAL-WALKTHROUGH.md:140` |
| Ctrl+J | `layout/actionRegistry.ts:74` |

## 4. Where it goes

At the end of the file. Insert it after this line, the file's last text line (2071), which occurs once in the file:

`- **AE2 (whether the first open was refused again; the choice; the saved line; whether the last open asked anything; the locator's `at`; felt):**`

Put one blank line before the new heading, as the file does between Parts (2049 is blank before 2050). The Read view does not show whether the file ends in one LF or two, so the worker should check the last bytes.

## 5. Clause check

All paths are under `frontends/shell/src/` at 2e377679 unless named otherwise.

**AF0 and AF0a**
- Arm call resolves `{ok:true}`: `residency/residencyArm.ts:96-105`.
- The call is refused once a dataset is open, hence "before opening anything": `residencyArm.ts:97-101`.
- The baseline arm is not the shipped default: `residencyArm.ts:50`, `:58`.

**AF1**
- The refusal is raised from the canvas's catch: `canvas/WorkingCanvas.tsx:1541-1547`, then `App.tsx:2461-2486`.
- Its text begins `accepting this batch would carry`: `canvas/limits.ts:121-125`.
- It shows in the strip: `App.tsx:2539`, `layout/StudioLayout.tsx:389-391`. The element is at `conditions/ConditionView.tsx:61`.
- It has a Dismiss button: `conditions/conditions.ts:47` (the route ends by dismissal) and `ConditionView.tsx:63-67`.
- No `more in Problems` button: others is n−1 (`conditions.ts:221-224`), and the button needs others above 0 (`StudioLayout.tsx:392`).
- No `Raised` line: a new condition starts at 1 occurrence (`conditions.ts:166`), and the line needs more than 1 (`ConditionView.tsx:37`).
- That a refusal appears at all depends on the fixture's data; it cannot be checked by reading. Part D's D2 (`MANUAL-WALKTHROUGH.md:220`) and C-E1 step 1 cover it.

**AF2**
- That a pan raises the refusal again is H3, a prediction about the data; it cannot be checked by reading.
- If it is raised again, it is the same condition: the kind gives a fixed code (`App.tsx:677`, `:2480`), and the identity match adds 1 to occurrences and replaces the latest display (`conditions.ts:142-152`).
- `Raised <n> times in all. The latest:` followed by the latest display: `ConditionView.tsx:37-41`, `conditionsConstants.ts:22`. `<n>` is the occurrence count, so 2 or more.
- Ctrl+J opens Activity: `actionRegistry.ts:74`. Activity starts closed: `layout/layoutState.ts:51`.
- The Problems tab: `contributions.ts:45`, `StudioLayout.tsx:450-466`.
- One row reading S-10: `conditions/ProblemsTab.tsx:22-25`, `conditionsConstants.ts:26`.
- That the touch and the pan end the session is H2, a prediction about the watcher and the kernel; it cannot be checked by reading. C-E1 step 3 covers it.
- If the session ends, the block is raised at `App.tsx:1518-1525`. It is urgency 1 (`conditions.ts:46`) and sorts first (`conditions.ts:216-218`), so it is the strip's one place (`contributions.ts:49`).
- Its code chip: `ConditionView.tsx:56-58`, then `admission/RefusalBlock.tsx:33`. That the code is `engine.source_changed` depends on the route the end took (`App.tsx:760`, or the kernel's code); it cannot be checked by reading.
- The refusal stands after the session ends: nothing in `raise` ends another condition (`conditions.ts:138-170`).
- It moves to a Problems row with its S-5 line and Dismiss: `ProblemsTab.tsx:27-29`, `ConditionView.tsx:33-45`, `:63-67`.
- `1 more in Problems`: `conditionsConstants.ts:18`, `StudioLayout.tsx:392-395`, and `App.tsx:2263`.
- The button opens Activity on Problems: `StudioLayout.tsx:311-314`.
- `2 more in Problems` and a row beginning `stream `: both the end and the terminal reach App on the post-check route (`streaming/viewportStreamManager.ts:338-367`). App raises the stream-terminal condition with that text (`App.tsx:1930-1946`). Which route a run takes cannot be checked by reading.

**AF3**
- Dismiss ends that row only: `ConditionView.tsx:64`, then `App.tsx:939-942`, then `conditions.ts:176-179`.
- The block stays: the session-ended route has no dismissal (`conditions.ts:46`), and `ConditionView.tsx:56-58` renders no button.
- The button goes, or reads 1 when a `stream ` row stands: `conditions.ts:221-224`, `StudioLayout.tsx:392`.
- When the open is admitted, everything ends: `App.tsx:1223-1226`, then `conditions.ts:184-186`, and `visibleFor` keys on the new open (`App.tsx:936`, `conditions.ts:208-212`).
- The strip is hidden: `StudioLayout.tsx:388`.
- S-4 shows: `ProblemsTab.tsx:19`. Activity stays open on Problems, because no admission path dispatches a layout action (StudioLayout's own reducer).
- The refusal comes back: the arm is module state and persists across a reopen (`residencyArm.ts:58`, `:96-105`; Part D's D4 at `MANUAL-WALKTHROUGH.md:222`). That the new open's first view trips the ceiling again is the same data fact as AF1; it cannot be checked by reading.
- It comes back with no `Raised` line and no button: a new condition starts at 1 (`conditions.ts:166`).

**AF3a**
- The fresh start runs the shipped arm: `residencyArm.ts:50`, `:58`.
- The save notice: `App.tsx:2248-2256` and `project/saveProject.ts:27`. It renders as `.canvas-refusal save-notice` (`ConditionView.tsx:48-52`, `:61`).
- "No button": this holds only if the save gives exactly one notice. That is N-4's prediction (form :1486) and depends on the kernel's reply; it cannot be checked by reading.
- The block and `1 more in Problems`: as in AF2, under H7 rather than H2. H7 is a prediction; it cannot be checked by reading.
- The save notice stands after the session ends: `conditions.ts:51` and `:138-170`. It is listed after the top: `ProblemsTab.tsx:21-30`.
- No Dismiss on the save notice: `conditions.ts:51` and `ConditionView.tsx:63`.
- "No row holds a refusal code" is H7; it cannot be checked by reading. C-E2 asserts it.
- After the second open, the strip is hidden and S-4 shows: `conditions.ts:184-186`, `StudioLayout.tsx:388`, `ProblemsTab.tsx:19`. That the shipped arm raises nothing on this file is a data and arm fact (Part D's note, `MANUAL-WALKTHROUGH.md:200-201`); it cannot be checked by reading.

**AF6**
- The S-12 Console row: selecting the tab records it (`StudioLayout.tsx:313`, then `:202`, then `:106-108`). The Console renders a class-C row's statement (`console/ConsolePanel.tsx:194-199`). The statement's text is `surfaceRegistry.ts:329`.
- The files the operator reads, `conditionsConstants.ts` and `surfaceRegistry.ts`, exist at the paths given.

## 6. What the form does not settle (for the advisor, with the words)

1. **AF3's outcome on the baseline arm.** Form step 3 says "both are gone" (:505), and C-E1 says "reopen, and both are empty" (:750). The arm pin persists, so reopening the over-ceiling copy raises the ceiling refusal again once the map draws. I wrote both states: S-4 first, then the refusal again, with a record of whether S-4 was seen. The same window affects C-E1's step 4 in `e2e/conditions-baseline.mjs:162-165`: it polls for S-4 after `openPath`, and the new open's refusal replaces S-4. If the refusal arrives first, the run VOIDs. This is a timing risk to C-E1's evidence, for the gate to read.
2. **Where the copies go.** I used `target\fixtures\manual-walkthrough\`, as Part Q does. §3 sends copies to "the run's own TMP folder" (:360), which I read as covering the e2e runs. I left out hashing the copies before and after.
3. **The write.** I used Part Q's mtime touch (`MANUAL-WALKTHROUGH.md:1521`). N-3 (:1458) names the touch for C-E1, C-E2 and §3's rows; the operator steps say only "change the file" (:504, :913).
4. **Problems before the touch, and closing Activity.** In AF2 the operator opens Problems before the touch, to see S-10, as C-E1 does. Then they close Activity, so that S-3's click visibly opens it. Form step 2 says only "Open Problems" (:504).
5. **S-5 in AF2.** Form step 2 does not name it; H3 and C-E1 do (:730, :750).
6. **"Reopen the file"** (:505, :913). I read it as **Open GeoParquet…** on the same copy, as both e2e suites do, and not as **Open project…**.
7. **AF3a's notice count.** I wrote exactly one notice, from N-4 (:1486). A second notice is to be recorded, with every later count one higher.
8. **The launch.** I read "a fresh launch on the shipped arm" (:898, :913) as a new `npm run tauri dev` start with no DevTools step, not a packaged build.
9. **Step 6's reach.** S-6 and S-13 are read in the source: no sitting raises 64 conditions, and no ordinary step gives a viewport refusal (E-1 item 3, :781). S-12 is read in the Console in AF3a's launch. The canvas statement of S-13 also shows in the first launch's Console after AF3, but that row is gone after the relaunch.
10. **Rows and title.** The rows are AF0, AF0a, AF1, AF2, AF3, AF3a and AF6, and the form's "(A)" marks are dropped. PR B inserts AF4 and AF5 before AF6. The title ends "(shell-migration-milestone-5, PR A)", and PR B widens it, as Part AC's title names its PRs.
11. **Windows only.** §2.8 (:356) makes macOS and Linux L1, and the watcher arms on Windows alone (Part Q, `MANUAL-WALKTHROUGH.md:1513`).
12. **No arm read-back.** Step 0a gives only the setter (:1438). I did not add a `getResidencyArm()` read-back, although the e2e suite reads it back.

## 7. PR A's strings and PR B's

- **PR A shows S-1, S-3, S-4, S-5, S-6, S-10, S-12 (the Problems form) and S-13.** S-3 and its button: §2.3 (:253). S-1: :254. S-5: :260, with Amendment 8 at :1799. S-4 and S-6, in ProblemsTab, which is PR A's: :262 and :295. S-12: :263. S-10, the Problems top row's note: §2.7 (:350), rendered by PR A's ProblemsTab. S-13: Amendment 2, D-e (:1089), inside §2.3's surfaceRegistry bullet.
- **PR B shows S-2, S-7, S-8, S-9, S-11 and S-12's second form.** S-2 and S-12's second form: :277. S-8 and S-9: :276. S-11: :274. S-7 is JobsTab's empty text (:347), and JobsTab is PR B's (:265, :313).

## Files read

- `<S>/adv-24-08.md`
- In `D:/wt/read-1124d`:
  - `governance/forms/frontends/SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md`: the whole form and Amendments 1 to 11.
  - `state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-30-milestone-5-strings-s-1-to-s-13-and-kl-a-to-kl-e-worded-s-5-counts-occurrences-recorded-before-pr-a.md`.
  - `state/consults/2026-11-24-shell-migration-milestone-5-pr-a-re-sweep-at-the-base-architect.md` (by grep).
  - `state/consults/2026-11-24-shell-migration-milestone-5-pr-a-comparison-of-the-re-sweep-with-the-head-architect.md` (by grep).
  - `frontends/shell/MANUAL-WALKTHROUGH.md` (headings).
- In `D:/wt/m5a`:
  - `frontends/shell/MANUAL-WALKTHROUGH.md`: headings, Part D, Part Q, Parts AD and AE whole.
  - `frontends/shell/src/conditions/`: `conditions.ts` (in part), `conditionsConstants.ts`, `ConditionView.tsx`, `ProblemsTab.tsx`.
  - `frontends/shell/src/layout/`: `StudioLayout.tsx` (85 to 477), `contributions.ts`, `layoutState.ts` (by grep), `actionRegistry.ts` (by grep), `regionParts.tsx` (by grep).
  - `frontends/shell/src/App.tsx`, in part: 660 to 959, 1205 to 1279, 1505 to 1684, 1915 to 1964, 2236 to 2265, 2455 to 2554, 2664 to 2677.
  - `frontends/shell/src/console/`: `surfaceRegistry.ts` (180 to 339), `ConsolePanel.tsx` (140 to 209), `consoleViewModel.ts` (by grep).
  - Elsewhere in `frontends/shell/src/`: `canvas/WorkingCanvas.tsx` (1525 to 1564), `canvas/limits.ts` (95 to 139), `admission/RefusalBlock.tsx`, `residency/residencyArm.ts` (40 to 109), `streaming/viewportStreamManager.ts` (325 to 459), `project/saveProject.ts` (by grep), `e2e-test-surface.ts` (by grep).
  - `frontends/shell/e2e/`: `conditions-baseline.mjs`, `conditions.mjs`.

Model: Opus 5.5 (claude-opus-5-5).
