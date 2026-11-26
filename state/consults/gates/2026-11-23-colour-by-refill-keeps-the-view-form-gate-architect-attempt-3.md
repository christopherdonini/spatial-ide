Reviewed: main at cfe25dc197af1a2fc8d652a91ba9f383f4dc3c23, in the detached read worktree C:/dev/wt/read-1123y (the custodian's filing note, 2026-11-23: the architect's form gate on the full form through Amendment 5, attempt 3, node:colour-by-refill-keeps-the-view@form-gate-architect-3, dispatched at 2026-11-23T17:46:23Z; its run: Read 29, Grep 21, Glob 1, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-23T17:46:35Z to 2026-11-23T17:55:39Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 14731 bytes, sha256 a739cc389f3587ba77d7ef603a759eda10b13382ce44cb94bfdd6c6b6d5c9048, byte for byte, nothing masked, with one final newline added. PASS WITH NOTES: no Correctness or Evidence finding; E-A, E-B, E-C and D-a to D-d answered; E-RK1 true against the code, red before the fix and green after it, with no known pass case; four Documentation findings, N-1 to N-4, to be fixed before the merge, with replacement words given.)

---

Verdict: PASS WITH NOTES
Reviewed: C:/dev/wt/read-1123y @ cfe25dc197af1a2fc8d652a91ba9f383f4dc3c23

I read the form `governance/forms/frontends/COLOUR-BY-REFILL-KEEPS-THE-VIEW-PREREGISTRATION.md`, Amendment 4 (lines 721-911) and Amendment 5 (lines 913-925). I read every cite at cfe25dc1. The code cites Amendment 4 makes at a846072d all hold there.

Under AUTONOMY §22: no Correctness finding and no Evidence finding. There are four Documentation findings, N-1 to N-4, and each must be fixed before the merge. None of them asks for a further attempt (ADV-2026-11-21-20). None of the words is the human's or the advisor's: Amendment 4 is the architect's draft and Amendment 5 is the custodian's. Under §31 the worker applies them with no re-gate, and the PR body lists them. The form is append-only, so each pair goes into a later amendment as an Old/New against the text named.

## The attempt-2 findings, by id

- **E-A: answered.**
  - `frontends/shell/package.json:14` (the build starts with `tsc --noEmit`), `:15` (`pretest`) and `:16` (`test`) hold.
  - `frontends/shell/tsconfig.json:19` includes all of `src`, and `frontends/shell/vitest.config.ts:7-13` sets no type check.
  - At the build head the new tests do not typecheck: the handle's reset takes no argument (`frontends/shell/src/canvas/WorkingCanvas.tsx:193`), and the session's reissue is called with two (`frontends/shell/src/App.tsx:1801`).
  - The drafter's correction for E-RK1 is right. The e2e scripts are `node e2e/<suite>.mjs` (`package.json:44-46`). Suites with no script already exist (`frontends/shell/e2e/pan-anchor.mjs`, `e2e/source-changed.mjs`), so I6 is not touched.
- **E-B: answered.** Under M-S1 the session drops the option, so the App stand-in records a reset with no `keepCamera` and RK-A1 fails. With both files run, the set can be observed. The other sets are each within one file, apart from E-RK1, which the register's last sentence still governs (form:514).
- **E-C: answered.** The untrue claim is withdrawn, and with OPEN-3 ruled (a) nothing replaces it. The 980 ceiling over the estimate holds: §7's paths sum to about 838 (form:218-228), plus 60, plus 25.
- **D-a to D-d: adopted byte for byte with the attempt-2 report's New texts, and each claim holds:**
  - `frontends/shell/src/testUtils/attributeBatchIpc.ts:18` and `:44`;
  - `WorkingCanvas.tsx:2120-2126`, reached only when the last-queried box is null (`frontends/shell/src/canvas/viewportBbox.ts:76`);
  - `frontends/shell/src/App.colour.test.tsx:46`, `:104` and `:268`;
  - `engine/src/fixture.rs:1405-1406` and `:1414-1417`;
  - `frontends/shell/src/canvas/limits.ts:73`.
  - One sentence of the D-c words, which were my own words in attempt 2, is not true: see N-2.

## The ruling items (ADV-2026-11-23-18)

- Items 1 to 5, 7 and 8 are recorded as ruled, and no ruled thing is changed.
  - Item 7: the bullet is at `state/drafts/sitting-script-2026-11-24.md:229`, directly after the AC11 bullet at `:228`.
  - Item 8: the merge check replaces only the third cell. That matches OPEN-4's expected outcome and leaves the human's steps as main has them.
- The new §8 bullet blocks a merge before the advisor rules. Item 5 is silent on the merge, and the bullet is consistent with the advisor ruling "from the filed text then". It is for the advisor, not blocking.
- Item 6 is recorded with a gloss the ruling cannot carry: see N-3.
- **Which ruled items depend on text the advisor had not read.** The ruling names its read at caea224a: the form's sections 1, 2 and 7 to 12, and no amendment.
  - **Item 6** depends on it. The advisor read §10 before Amendment 2's D1 changed its fallback base and its Ordered bullet.
  - **Item 3** depends on it in part. The advisor read neither §3 nor §4, nor Amendment 2's D6, which says the fixture file is not small, nor Amendment 4's D-c zoom procedure. The ruling's own conditions, the bytes stated first and the disk floor (I5), bound it.
  - **Item 5** depends on it in its count only. It counts three drafts, while Amendment 2 adds a fourth item (item 61's third sentence, unreworded). The substance of the ruling is deferred to the filed text.
  - **Items 1, 2, 4, 7 and 8** do not depend on it. For item 2, D3's card change arms the same flag, so option (a)'s mechanism covers it unchanged.
  - None of these blocks. D1, D6 and D-c belong in the one message to the advisor: see N-4.

## E-RK1, the drafter's addition (Amendment 4 item 5)

It is true against the code, and it closes a real pass case: the open's own planned line (`frontends/shell/src/residency/candidateArmSession.ts:1497-1512`).

- **Red before the fix.**
  - The reset clears the waiting fit (`WorkingCanvas.tsx:1662`), and the refill's first batch refits (`:1817-1819`).
  - That write is unreported (`:1454-1459`), so the pending flag set at `candidateArmSession.ts:1707` stays false.
  - The flag is also cleared by the reissue itself (`:1731`, through `:1532-1535`), and the plan flag is cleared at `:1749`. So the refill's terminal plans and writes the refit box (`:1509`).
- **Green after the fix.** The camera is kept, so the same terminal writes the box of the shown view (`WorkingCanvas.tsx:1652-1658`).
- **Mutation.** M-A1, with the set RK-A1 and E-RK1 (form:526). No pass case is known.
  - Under M-A1 the refit frames the refill's first batch. That is the open's fit, or another single first batch, and neither is a zoomed-out view held past the not-held status.
  - A camera change after the Colour by gives no line at all (`candidateArmSession.ts:1505`). That fails the run, so it cannot pass.
- **The `view-state` sources hold:** `WorkingCanvas.tsx:1441` and `:2161`, and `frontends/shell/src/diagnostics/renderTrace.ts:52-54`.
- **Note for the code's gates, not blocking.** If the Colour by's Apply changes the canvas's client size, the two boxes differ. That would be a false red, not a pass case. The phrase "at the canvas's client size" should be read at the moment of each box, and the worker records both sizes.
- The precondition that no input reaches the canvas is met by the suite's own conduct; the suite cannot assert it. Breaking it can only make the run red.
- The paragraph's opening sentence over-states when the line is written: see N-1.

## Old texts, placement, scope

- Each of the twelve Old texts occurs once in the form above Amendment 4, at form lines 186, 246, 407 (inside Amendment 2's New), 421, 423, 514, 530, 559, 659, 664 and 687.
  - The planned-box prefix also occurs at :187 and :555, but the full Old is only at :559.
- Each addition is placed: the §8 bullet after §8's last bullet. The item-8 merge check and the changed-test block live in Amendment 4 itself. The superseded index is complete.
- Scope: no path is added, so there is no class 9. The class stays full under §21a and §21c (about 925 lines estimated, well past §21c's 150). The ceiling stays 980, and an overrun is class 8.

## The drafter's unsettled points (`state/consults/2026-11-23-colour-by-refill-keeps-the-view-amendment-4-architect-draft.md:201-206`)

- **What the advisor read:** for the advisor. It is answered above and is not blocking.
- **The §8 merge clause:** for the advisor, not blocking.
- **How E-RK1 launches the app:** settled here.
  - `frontends/shell/e2e/lib.mjs:193` spawns `npx tauri dev` with an overlay that carries only the window (`lib.mjs:97-113`).
  - `frontends/shell/src-tauri/tauri.conf.json:7` runs `npm run dev`, which is `vite` (`package.json:9`). There is no `predev`, so nothing typechecks.
  - The worker's confirmation at the build head stays for the code's gates.
- **RK-A1's typed stand-in:** for the code's gates. Vitest does not typecheck it. At the final candidate the build does: a stand-in with an optional parameter typechecks, and one with a required parameter does not.
- **PR 358's head and the re-link head:** for the code's gates (stop I1).

## The drafts and the operator row (for the advisor; not ruled)

- Amendment 4 adds no new draft words. Item 51 (D3), item 61's span (D4) and AC12's third cell (D5) are true against the code.
  - The waiting-fit flag is written only at `WorkingCanvas.tsx:1583`, `:1649`, `:1662` and `:1818`, and initialised at `:1017`.
  - `KNOWN-LIMITATIONS.md:466` and `:507` carry the spans named.
- **A point on AC12 for the advisor.** In its second cell the operator does not move the view before the Colour by (`frontends/shell/MANUAL-WALKTHROUGH.md:1998`). So before the fix the refit may land on the same view as the open's fit, since both frame a first batch. In that case "the view does not move" reads the same before and after the fix.
  - The same applies to the sitting-script bullet's sentence that the view still moves to fit (`state/drafts/sitting-script-2026-11-24.md:229`).
  - The row ordering of the first batch was not read, so this is a reading, not a run.

## Findings

### N-1 (Documentation; Amendment 4 item 5, the first paragraph): "Every first look's terminal" is too broad

The line is written only by a current, Completed, uncancelled terminal with no plan and no pending change, and with a frame and a box (`candidateArmSession.ts:1497-1508`). The same paragraph names term (viii) as stopping it.

```text
Every first look's terminal writes `candidate-first-look-view-planned` (`frontends/shell/src/residency/candidateArmSession.ts:1509`), the open's first look included.
```
```text
A first look's Completed terminal writes `candidate-first-look-view-planned` (`frontends/shell/src/residency/candidateArmSession.ts:1509`) when every term at `:1498-1505` holds and a frame and a shown box exist (`:1508`); the open's first look writes one.
```

Clause check:
- Completed: `:1502`.
- Every term: `:1498-1505`.
- A frame and a box: `:1508`.
- The open's first look writes one: a fresh open has no plan and no pending change, and its frame is built by its terminal at the latest (`:1429-1431`).

### N-2 (Documentation; Amendment 4 item 6, D-c's New): the fit frames the first batch, not the first look's 10,000 rows

The auto-fit runs once, on the first batch (`WorkingCanvas.tsx:1817-1819`; `KNOWN-LIMITATIONS.md:507` says the same). The first look's limit is 10,000 rows (`frontends/shell/src/canvas/tileGridConstants.ts:185`). By the engine's first-batch target (`engine/src/stream.rs:68`), a batch is likely far smaller than 10,000 rows. The test's conduct is unchanged.

```text
The fit frames only the first look's 10,000 rows, which, if they are the file's first rows, lie in the first rows of `parcel()`'s square grid (`engine/src/fixture.rs:1405-1406`), so at about 250,000 features the fit view alone may hold too few rows; I5 governs.
```
```text
The fit frames only the open's first batch, since the auto-fit runs once, on the first batch (`WorkingCanvas.tsx:1817-1819`); that batch holds at most the first look's 10,000 rows, which, if they are the file's first rows, lie in the first rows of `parcel()`'s square grid (`engine/src/fixture.rs:1405-1406`), so at about 250,000 features the fit view alone may hold too few rows; I5 governs.
```

Clause check:
- Once, on the first batch: `WorkingCanvas.tsx:1817-1818`.
- At most 10,000: `tileGridConstants.ts:185`.
- The grid: `engine/src/fixture.rs:1405-1406`.

### N-3 (Documentation; Amendment 4 item 1, the item-6 bullet): the record attributes D1 to a ruling read before D1

```text
- **Item 6.** The piece is built where §10 (as Amendment 2's D1 changes it) says, with ADV-2026-11-23-17 item 11 for `App.tsx` and `WorkingCanvas.tsx`.
```
```text
- **Item 6.** The piece is built where §10 says, with ADV-2026-11-23-17 item 11 for `App.tsx` and `WorkingCanvas.tsx`. The advisor read §10 at caea224a, before Amendment 2's D1 changed its fallback base and its Ordered bullet; D1 follows ADV-2026-11-23-15 item 4, and it goes to the advisor in the one message of Amendment 5 item 4.
```

Clause check: the ruling's read line names caea224a (`state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-18-…md:9`). D1 is in Amendment 2 (form:532-549), and Amendment 2 was filed at a846072d, per the custodian's git check.

### N-4 (Documentation; Amendment 5 item 4): it sends the drafts now, against ruling item 5 and Amendment 4's own New for Amendment 2 item 5 (form:751)

```text
4. Its drafts and the points it could not settle go to the advisor in one message (ADV-2026-11-23-15 item 8); none is ruled here. Any finding of its own goes to the architect's attempt 3.
```
```text
4. The points it could not settle go to the advisor in one message (ADV-2026-11-23-15 item 8), with Amendment 2's D1 and D6 and Amendment 4's D-c, which ADV-2026-11-23-18 was read before; its drafts go after the build gates' clause check and land in the build's words commit (ADV-2026-11-23-18 item 5). None is ruled here. Any finding of its own goes to the architect's attempt 3.
```

Clause check:
- After the clause check, landing in the words commit: ruling item 5 (`…adv-2026-11-23-18-…md:19`).
- Read before: `:9` against form:530-660 (Amendment 2) and form:869 (D-c).

## Files read (at cfe25dc1, under C:/dev/wt/read-1123y)

- governance/forms/frontends/COLOUR-BY-REFILL-KEEPS-THE-VIEW-PREREGISTRATION.md (whole)
- state/consults/gates/2026-11-23-colour-by-refill-keeps-the-view-form-gate-architect-attempt-2.md (whole)
- state/consults/gates/2026-11-23-colour-by-refill-keeps-the-view-form-gate-architect.md (searched)
- state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-18-colour-by-refill-open-items-as-recommended-one-ac12-bullet-in-the-sitting-script.md (whole)
- state/consults/2026-11-23-colour-by-refill-keeps-the-view-amendment-4-architect-draft.md:199-215
- state/drafts/sitting-script-2026-11-24.md (searched)
- governance/AUTONOMY.md:306-361
- frontends/shell/package.json, tsconfig.json, vitest.config.ts (whole)
- frontends/shell/e2e/lib.mjs (searched; :97-114); the e2e/*.mjs list
- frontends/shell/src-tauri/tauri.conf.json (searched)
- frontends/shell/src/residency/candidateArmSession.ts:1420-1579, :1690-1819 (and searched)
- frontends/shell/src/canvas/WorkingCanvas.tsx:1415-1474, :1640-1669, :1800-1829, :2095-2174 (and searched)
- frontends/shell/src/canvas/viewportBbox.ts:70-80
- frontends/shell/src/canvas/limits.ts:68-87
- frontends/shell/src/canvas/tileGridConstants.ts (searched)
- frontends/shell/src/diagnostics/renderTrace.ts:1-70
- frontends/shell/src/testUtils/attributeBatchIpc.ts:14-57
- frontends/shell/src/App.colour.test.tsx:44-108, :262-271
- frontends/shell/src/App.tsx:1795-1836, :2134-2149 (and searched)
- engine/src/fixture.rs:1400-1419
- engine/src/stream.rs:55-74, :385-411 (and searched)
- KNOWN-LIMITATIONS.md:465-467, :506-507
- frontends/shell/MANUAL-WALKTHROUGH.md:1998

Model: claude-opus-5-5 (Opus 5.5).
