Reviewed: main at 49a6964701fd55cc64a3cca15311d827a922043b, in the detached read worktree C:/dev/wt/read-1123aa (the custodian's filing note, 2026-11-23: the architect's form gate on the full form through Amendment 6, attempt 4, node:shell-migration-milestone-5@form-gate-architect-4, dispatched at 2026-11-23T18:30:29Z; its run: Read 19, Grep 18, Glob 1, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-23T18:30:29Z to 2026-11-23T18:36:18Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 11022 bytes, sha256 bb740e4c0f512505000f796c9fc4f0f01b844e460488566b9c723abf06e214ae, byte for byte, nothing masked, with one final newline added. PASS WITH NOTES: no Correctness or Evidence finding; Amendment 6 carries the attempt-3 words faithfully; E-3, D-6 and D-7 answered, D-5 in part; three Documentation findings, D-8 to D-10, to be fixed before the merge, with replacement words; item 11 sound; KL-E true in part, for the advisor.)

---

Verdict: PASS WITH NOTES
Reviewed: C:/dev/wt/read-1123aa @ 49a6964701fd55cc64a3cca15311d827a922043b

All cites below are read at 49a69647. No Correctness or Evidence finding. There are three Documentation findings, D-8 to D-10. Each must be fixed before the merge, and none asks for a further attempt (ADV-2026-11-21-20). None is the human's wording, so under AUTONOMY §31 the worker applies the words given with no re-gate, and the PR body lists them.

## Amendment 6's fidelity

- Items 2 to 10 carry each Old and New of the attempt-3 report in the report's order: Fix 1 to Fix 3, D-5 (two pairs), D-6 (three pairs), then D-7. I compared each against report:67-137 and found them byte-identical. Amendment 6 adds nothing else beyond its placement, evidence and next-step items (1, 11, 12 and 13).
- Each Old occurs once above Amendment 6, at form:1213, 1245 (twice: Fix 1 and D-6 first), 1265, 1271, 1326 (twice: D-6 second and third) and 1532 (as a prefix of the C-A5 row). No New occurs above form:1582. C-A6 first appears at form:1599.
- Item 3 says where its row goes: after C-A5, as Amendment 4 adds it.
- Fix 3's replacement of the prefix at form:1532 puts the C-A6 row before the C-A5 row. The table still reads correctly.
- Gate-log row 874 is line 890 of `state/gate-log.json`. That matches Amendment 5's convention, where row 870 is line 886.

## Attempt-3 findings, by id

**E-3: answered.**
- **C-A6 drives the real App.** The hook at `App.tsx:1454-1462` runs `handleSaveProject`, the same function the control calls (`:2208`). Its supplied folder is the picker's answer (`:899-904`), so `skp/dialog` is never reached.
- **The two-notice outcome holds:**
  - the view comes from `canvasRef.current?.currentView?.()` (`:2190`);
  - at open, the selection is 0, so `afterwards` is `[]` (`saveProject.ts:102`);
  - `history_mark: "withheld"` gives `[SAVED_NOTICE, MARK_WITHHELD_NOTICE]` (`:115-117`);
  - `project_relative: "carried"` adds nothing (`skp/types.ts:361`).
- **The DOM assertions are sound.** Problems' tab panels are mounted but hidden (`StudioLayout.tsx:443-453`), so "Problems' other row" is in the DOM. The top row carries no owner class (form:258).
- **Red before, for its stated reason.** Under §2.2's per-raise replacement (form:228), the raise of ordinal 1 ends ordinal 0. The top would then be `MARK_WITHHELD_NOTICE` and S-3 would be absent.
- **The mutation and its set.** Under one single-display `replaceBatch` per notice, each batch ends the route's conditions before it mints, so the second ends the first. C-A6 fails on both the top and S-3.
  - C-E2 sees exactly one notice (form:1486), so it passes under the mutation.
  - `e2e/project.mjs:381-386` counts S18 only, so it passes too.
  - `App.save.test.tsx:199` sees one notice, so it passes too.
  - The set {C-A6} is therefore right.
- **No known pass case.**
- The harness changes (a `currentView` on the stand-in, `saveProject` in the transport mock) touch modules the harness already mocks (`App.streamFailure.test.tsx:57-81`, `:114-150`). No new module is mocked.

**D-5: answered in part.** The new words say that a dismissal frees a place. But any end frees one:
- a viewport refusal's owner clear (`App.tsx:1613`; form:215);
- a notice batch's replacement (form:216-217; the A4-1 New text at form:1245).

Ordinary use reaches the viewport clear: a pan that resolves. So the premise of item 2 and the leftover case of item 4 are still too narrow. This is D-8, of D-5's class.

**D-6: answered, and true.**
- `step-record-${report.kind}` is at `App.tsx:878`. `project.save_notice` is the routes table's code (form:217).
- A batch shares one code, and its displays differ by ordinal, so their keys are distinct (form:224).
- The replacement ends conditions by route, target and generation, independent of code (form:1245), so a record notice of another kind still replaces the old one.
- The five-argument order matches the D-6 New texts (form:1662, 1676, 1690). No four-argument form remains in the form once they are in place (the grep for `replaceBatch` finds only form:1245 and form:1326, both replaced).
- No new fault.

**D-7: answered, and true.** ADV-2026-11-23-17 item 8 names S-1 to S-12 and KL-A to KL-D only (directive:25). S-13 is Amendment 2's (form:1095). KL-E is in Amendment 4 (form:1332), and item 10's second bullet asks for it (directive:31).

## New texts that are not answers

- **Fix 1** (form:1599):
  - "C-A6 proves the save site's batch from the real App": true.
  - "The empty batch is proven at store level only (C-U8)": true.
  - Its reason is imprecise. A null-answering picker can also be had by mocking `project/saveProject`'s `pickProjectFolder`, which App imports (`App.tsx:89`, re-exported at `saveProject.ts:24`) and which `App.save.test.tsx:69-75` mocks. That mock is also I5 under form:372, so the conclusion stands. This is D-9.
- **§2.5 seam 1** (form:1390): attempt 3 placed E-3 there, but no fix names C-A6 in it. The evidence itself is fully preregistered in §4, so this is an index omission. It is D-10, Documentation, not Evidence.

## Item 11 (class 8, §7 not edited)

- The piece is full-gated (§21a: a stated guarantee, and over §21c's bound). §7 is not edited, and form:452 says it never is.
- The roughly 30 lines are recorded as class 8 at the count in PR A's closing amendment. That is the route ADV-2026-11-23-17 item 12 accepted (directive:41).
- C-A6 lands in `App.conditions.test.tsx`, which is already in §2.6 (form:304), so there is no class 9.
- Note, not a finding: Amendment 4's predicted figures (form:1557, 630; form:1560, 3,730) now read about 30 low. Amendment 6 item 11 carries the difference, and the count binds at the closing amendment.

## Item 12: KL-E, for the advisor (not ruled, not reworded)

KL-E is at form:1332.
- **Sentence 1:** true. At most 63 conditions of urgency 2 and 3 are kept, plus one held place, and App raises urgency 1 at most once per open (form:1260).
- **Sentence 2:**
  - "Past that, a new refusal or notice is not kept" is untrue, as attempt 3 found: refusals and notices stop at 63 kept.
  - "Problems says how many" is true (S-6).
  - "does not come back when others are dismissed" is true. Others that are cleared or replaced do not bring it back either.
- **Sentence 3:** true (urgency 1 is always kept; `ordered` sorts by urgency first, form:236).
- **Sentence 4:** true for a successful open only. `opened` is not dispatched on a refused one (form:232).
- KL-E does not state D-8's leftover case at the top: a newer refusal, a notice or nothing can show where a refusal that was not kept would have been the top. That gap is for the advisor.

## Findings

**D-8 (Documentation).** Place: Amendment 6 items 5 and 6 (form:1634, form:1648), the reasoning about the top at the cap. What is wrong: only a dismissal is named as freeing a place, but an owner's clear (`App.tsx:1613`) and an owner's replacement (form:1245) free one too.

```text
Until a kept condition is dismissed, a raise that is not kept is newer than every kept condition.
```
```text
Until a kept condition ends (by a dismissal, its owner's clear or its owner's replacement), a raise that is not kept is newer than every kept condition.
```
```text
A dismissal frees a place, so a later raise can be kept while an earlier one was not. If the operator then dismisses every kept refusal older than one that was not kept, the strip shows a newer refusal, a notice or nothing where that refusal would have been the top.
```
```text
A condition that ends frees a place, so a later raise can be kept while an earlier one was not. If every kept refusal older than one that was not kept then ends, by the operator's dismissal or, for a viewport refusal, its owner's clear (`App.tsx:1613`), the strip shows a newer refusal, a notice or nothing where that refusal would have been the top.
```

Clause check:
- The cap counts kept unresolved conditions (form:1260), so any end frees a place.
- Owner clear is declared for viewport-refusal only (form:215), and the clear site is `App.tsx:1613`.
- Replacement is declared for record-notice and save-notice only (form:216-217).
- Canvas-ceiling and stream-terminal end by dismissal or the next open (form:213-214), and the next open resets `notKept`, so it is excluded.

**D-9 (Documentation).** Place: Amendment 6 item 2's New text (form:1599). What is wrong: `skp/dialog` is named as the only mock that reaches a null-answering picker.

```text
the harness reaches no folder picker that answers `null` without mocking `skp/dialog`, which it does not mock (I5).
```
```text
a folder picker that answers `null` needs a mock of `skp/dialog` or of `project/saveProject`'s `pickProjectFolder` (as `App.save.test.tsx:69-75` has), and this piece's App tests mock neither (I5, form §4's "What may be mocked").
```

Clause check:
- App takes `pickProjectFolder` from `./project/saveProject` (`App.tsx:89`), which re-exports `../skp/dialog` (`saveProject.ts:24`).
- A null answer is `[]` (`saveProject.ts:110`).
- The hook's folder is a string, and with none supplied `pickProjectFolder` runs (`App.tsx:899-904`). Its `invoke` (`skp/dialog.ts:30`) rejects outside Tauri, which gives the not-saved notice (`saveProject.ts:108`).
- The streamFailure harness mocks neither module (`App.streamFailure.test.tsx:57-150`).

**D-10 (Documentation).** Place: §2.5 seam 1 as Amendment 4 replaced it (form:1390). What is wrong: the save-notice route's real-App proof, C-A6, is not named.

```text
and in the real app by C-E2. The canvas-ceiling route is proven
```
```text
and in the real app by C-E2. The save-notice route's batch is proven from the real App by C-A6, and its empty batch at store level only (C-U8). The canvas-ceiling route is proven
```

Clause check:
- C-A6 runs on the shipped candidate arm through `handleSaveProject` (`App.tsx:1454-1462`, `:2181-2193`).
- C-U8 is the reducer only (form:1326).

## Files read (at 49a69647, in C:/dev/wt/read-1123aa)

- `governance/forms/frontends/SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md`: :120-459, :1205-1714, and by grep
- `state/consults/gates/2026-11-23-shell-migration-milestone-5-form-gate-architect-attempt-3.md` (whole)
- `state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-17-milestone-5-open-items-as-recommended-the-cap-if-urgency-1-is-always-kept-pieces-that-share-a-file.md` (whole)
- `governance/AUTONOMY.md`: :315-364
- `state/gate-log.json`: :1-17, :884-895
- `frontends/shell/src/App.tsx`: :860-929, :1440-1469, :1600-1627, :2150-2219, and by grep
- `frontends/shell/src/project/saveProject.ts` (whole)
- `frontends/shell/src/skp/dialog.ts` (whole)
- `frontends/shell/src/skp/client.ts` and `skp/types.ts` (by grep)
- `frontends/shell/src/App.streamFailure.test.tsx`: :1-200
- `frontends/shell/src/App.save.test.tsx` (whole)
- `frontends/shell/src/layout/StudioLayout.tsx`: :370-459
- `frontends/shell/e2e/project.mjs`: :262-291, :366-415
- `frontends/shell/src` (grep for the notice classes and constants)

Model: Opus 5.5 (claude-opus-5-5).
