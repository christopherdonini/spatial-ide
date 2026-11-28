# Milestone 5, PR B: the reviewer's form gate on Amendments 15 and 16 (node:shell-migration-milestone-5@pr-b-form-gate-reviewer): FAIL

*Filed by the custodian. The reviewer (Opus) read D:/wt/read-1128a at 9fca8614d175538384bd553a0e7b1b1d6a850f8a and D:/wt/m5a at d6c2daf69eb500027197945f5a4302f0508e0f69, read only, built nothing and wrote no file. By the facts script its records run from 2026-11-28T00:57:06Z to 2026-11-28T01:12:06Z, and 74 of its calls ran with the main checkout as their working folder, the shell's start folder. By its completion notice it took 899644 ms and 78 tool uses. Its hand-back is below as received, with the harness indent removed: 14303 bytes, sha256 4304e34d43d4559d77d9faae3ec35802088f4aface0af32d449a43eef9de5556.*

---

FAIL. I read the form on main @ 9fca8614d175538384bd553a0e7b1b1d6a850f8a (D:/wt/read-1128a) and the code on cut/shell-migration-milestone-5-pr-a @ d6c2daf69eb500027197945f5a4302f0508e0f69 (D:/wt/m5a). Both checkouts were clean. origin/main read 9fca8614 and I did not fetch.

The one blocking finding (E-1) is about the words of the architect's Amendment 15, not the human's. No code changes. Under §31 the replacement words below land with no re-gate.

## Checks

**Check 1: statements of fact about the code at d6c2daf6.**
How I checked: `sed -n` on every cited range, plus `grep` for callers (`App.tsx`, `FilterPanel.tsx`, `PublishPanel.tsx`, `surfaceRegistry.ts`, `contributions.ts`, `StudioLayout.tsx`, `TableTab.tsx`, `residencyStatus.ts`, `OpenDuringExportAsk.tsx`, `candidateArmSession.ts`, `tileViewportStreamManager.ts`, `e2e/layout.mjs`, `e2e/filter-panel.mjs`, `e2e/admission-remediation.mjs`, `StudioLayout.test.tsx`, `App.table.test.tsx`, `App.selection.test.tsx`, `MANUAL-WALKTHROUGH.md`).
- Every line cite in Amendment 15 items 3, 4, 6, 7, 10 and 11 lands on what it names, with two exceptions:
  - **Untrue (E-1):** item 7 says FIND' shows that the predicate's scan "runs long (its bound, lines 336-349)". Those lines hold a 180 s timeout (`180_000`, line 348). FIND' waits at most 30 s for Cancel to appear (line 330) and returns no duration (lines 303-406: no `Date.now` in the step, and its return text names none). The only measurement is in the fixture generator's doc comment, `kernel/tests/manual_walkthrough_fixtures.rs` lines 677-694: 962.5 ms to the first batch, engine alone, which it calls a lower bound. Item 7 does not cite it.
  - **Imprecise (D-5):** items 3 and 7 cite `residencyStatus.ts` line 462 as "the statement". Line 462 is the signature `function relinquishedText(...)`. The statement text is on line 463.
- Amendment 16's facts hold. Amendment 15 matches its draft byte for byte: the draft's lines 95-151 and the form's lines 2062-2118 are each 9600 bytes, sha256 2c7849ce…b73a (`sed` + `wc -c` + `sha256sum`). The KL facts are under check 4.

**Check 2: the order change (OPEN-B1 (b)).**
- **It can be a pure change to `ordered`, and both views follow it.** `attentionOf` sorts through `ordered` (`conditions.ts:221-223`). App feeds one list to both: `visibleConditions` goes to `attentionOf` at `App.tsx:937` and to `<ProblemsTab conditions={visibleConditions}>` at `:2675`. ProblemsTab calls `ordered` (`ProblemsTab.tsx:16`). `grep` finds no other product caller of `ordered` or `attentionOf`. The fields needed (`urgency`, `seq`, `reason.route`) are on `Condition`. But Amendment 16 never says the change is made in `ordered` (D-4).
- **Batch order and urgency 1-2 are kept.** `replaceBatch` raises the displays in order with rising `seq` (`conditions.ts:187-203`, `:167-169`). Within a route the order stays `seq` ascending, so the save's first line still leads. Sorting by urgency first leaves urgency 1 and 2 as they are (`:217`).
- **Mutations:**
  - C-U2 is unchanged by the new order: its fixture has a single notice, `n1` (`conditions.test.ts:71`), and urgency 2 is untouched.
  - "Newest first for every urgency" still fails C-U2: refusals a and b swap. The same mutation was observed failing at a17db128 (`conditions.test.ts:68-69`).
  - Whether either mutation fails C-U2b depends on C-U2b's fixture, which is not declared (D-3). For plain `seq` order to fail it, C-U2b needs an older notice route raised before a newer one. For newest-first to fail it, a route needs two or more notices. A single-line newer route would let newest-first pass.
  - Plain `seq` order would also fail the App test, which has no ID and no mutation of its own.
- **The App test is from the real App.** The harness renders `<App />` (`App.conditions.test.tsx:205-215`) and mocks only the client, events, data plane, stream manager, PublishPanel and canvas (`:21-169`). It already has C-A3's reopen (`h.reopen(openedWithNotice())`, `:460-471`, `:299-322`) and C-A6's save (`e2eSaveProjectToFolder`, `:489-512`).
- By `grep`, no existing unit or e2e test reads order across two notice routes. App.reopen, App.save, App.recording and App.command each touch one route, and the e2e reads of `.save-notice` (`project.mjs:274,383`) do not depend on order.

**Check 3: the count.**
- §7: 492 + 890 + 480 = 1,862.
- 10 + 30 + 40 = 80, and 1,862 + 80 = 1,942, which is under 1,950.
- The three files are under `frontends/shell`, so §7's numstat command counts them. KNOWN-LIMITATIONS is outside it.
- Amendment 15 item 8's predictions (B-P about 481, tests and e2e at their ceilings) give about 1,857, consistent with "about 1,850".
- The App row overrun is a separate class 8 matter, as Amendment 16 says: `App.tsx` is not one of the three files.
- Two gaps (D-1, D-2):
  - Neither amendment names `<base>` once PR B takes main in. Kept at d6c2daf6, the count would include merged lines: the a-second-save diff alone is 277 added and 56 removed (`git diff --stat d6c2daf6...origin/cut/a-second-save-is-announced`).
  - The three files have no §7 row. Amendment 12 item 7 and Amendment 15 item 8 read a file with no row as class 8 against 0.

**Check 4: the KNOWN-LIMITATIONS numbers.**
How I checked: `git show <ref>:KNOWN-LIMITATIONS.md | grep -oE '^[0-9]+\. '`, taking the highest, over origin/main, d6c2daf6, all 52 refs from `git branch -r --no-merged origin/main`, and all 330 local heads.
- 75 on main, 79 at d6c2daf6.
- 80 is on origin/cut/shell-scale-display @ 56897cb4 only, among remote and local refs (local cut/shell-scale-display matches).
- Seven other unmerged branches top out at 79. None goes above 80.
- So 81, 82 and 83 are correct as of this read.

**Check 5: shared paths.**
How I checked: `git diff --name-only origin/main...<b>` for all 52 branches, intersected with PR B's §2.6 paths plus Amendment 15's and Amendment 16's additions. Then the paths of each branch's own non-merge commits, `git log --no-merges --name-only <b> --not origin/main d6c2daf6`.
- `App.conditions.test.tsx`: a-second-save-is-announced @ 38e9209d. Named in Amendment 16 item 3, and met by the merge order.
- **Not named in Amendment 15 or 16:**
  - shell-scale-display @ 56897cb4: `layout/contributions.ts` (`STATUS_ITEMS` gains `scale`), `layout/StudioLayout.test.tsx` (`NO_SLOTS` gains `"status.scale"`; this file joined PR B's Scope by Amendment 15 item 5), `styles.css`, `App.tsx`.
  - `App.tsx` also with b2-piece-1c-step-3-recovery-offer, colour-by-refill-keeps-the-view, identity-declaration-route-for-session-tier, identity-scan-refuses-a-null-by-name, text-id-opens-for-the-session-by-row-position, text-id-reopen-with-a-recorded-declaration and a-second-save.
  - Walkthrough Part AF with a-second-save (its AF3a row; PR B adds AF4 and AF5 and edits AF6). The draft named this one; neither amendment does.
- `KNOWN-LIMITATIONS.md` is shared by many branches, but no other branch touches items 77-79 or anything above 80, so no item is shared.
- `e2e/README.md` is shared, but each branch has its own entries.

**Check 6: Amendment 16 items 5 to 8 against the ruling's items 2 to 6.**
- Item 5 carries ruling item 2, item 6 carries item 3, item 7 carries item 4, and item 8 carries items 5 and 6.
- Nothing is added that the ruling does not give.
- Item 8 says it carries items 5 and 6 but leaves out item 6's fourth bullet: the read part confirms from the diff that nothing under `src-tauri/` or `capabilities/` changed and no command was added. Also left out: item 2's last bullet (if item 79's number moves at a merge, the cite follows) and item 1's last sentence (a false item goes to the advisor) (D-6). Ruling item 5 does not require items 5 and 6 to be carried.

**Check 7: S-10 and items 77-79 under the new order.**
- S-10 (`conditionsConstants.ts:26`, marking `ProblemsTab.tsx`'s `index === 0` row): true if the order lives in `ordered`. It cannot be decided before code otherwise (D-4).
- 77 (`KNOWN-LIMITATIONS.md:560-562`): true. The kinds of report do not change.
- 78 (`:564-566`): true. The `opened` case is untouched.
- 79 (`:568-571`): true. The cap and `notKept` are untouched. An ended session is still first (urgency 1). Refusals stay oldest first, so "a newer refusal, a notice or nothing" still holds.

## Correctness
None.

## Evidence (blocking)
**E-1.** Amendment 15 item 7 claims a duration that its cited evidence does not support (check 1). The correction changes the form only. These are the architect's words, not the human's; under §31 they are applied with no re-gate. The form only takes appended text, so the New words go in as an appended correction item.
- Old (once in the form, `grep -cF` = 1): `Why: FIND' shows that the predicate's scan of the 4,000,000-feature fixture runs long (its bound, lines 336-349 at d6c2daf6), while a fill after a pan has no recorded duration.`
- New: `Amendment 15 item 7's "Why" cites a bound as a duration: FIND' (\`frontends/shell/e2e/filter-panel.mjs\`, lines 304-349 at d6c2daf6) waits up to 30 s for Cancel to appear and up to 180 s for the scan to end, and records no duration. The one measurement is the fixture's own (\`kernel/tests/manual_walkthrough_fixtures.rs\`, lines 677-694 at d6c2daf6): 962.5 ms to the first batch in the engine alone, a lower bound on the app's scan. Whether the Jobs Cancel is clicked before that scan ends is not established before J-E1 runs, and a fill after a pan has no recorded duration either.`
- Each clause checked: 30 s is `filter-panel.mjs:330`, 180 s is `:348`, the missing duration is lines 303-406, and 962.5 ms is `manual_walkthrough_fixtures.rs:691`. I did not check "a fill after a pan has no recorded duration"; it is carried over from item 7.

## Documentation (must fix before the merge; each changes the form only; each goes in as an appended item)
- **D-1, the count's base after a merge.** No Old (nothing stands to replace). New: `§7's count for PR B reads \`<base>\` as d6c2daf6 until PR B's first merge commit, and from then as the commit its last merge commit took in (a later head of PR A, or main), so no line that came in by a merge is counted.`
- **D-2, how the three files are counted.**
  - Old (once): `Ceiling: 1,862 plus the about 80 lines this adds (about 10, 30 and 40), so 1,942, and at most 1,950. That is not class 8.`
  - New: `The three files of item 3 have no §7 ceiling of their own: their lines are "the lines this adds" (ADV-2026-11-27-42 item 1) and are not class 8 against 0; the count is read against 1,862 plus those lines, never above 1,950, and 1,942 is the prediction.`
  - If the custodian reads item 1 another way, this goes to the advisor.
- **D-3, C-U2b's fixture and the App test.**
  - Old (once): ``Mutations: plain `seq` order fails C-U2b; newest first for every urgency fails C-U2 and C-U2b.``
  - New: ``C-U2b, before its code: after `opened(R)`, two reopen notices (ordinals 0 and 1) raised one by one, a stream-terminal refusal, then one save-notice batch of two lines; `ordered` gives the refusal, the save's two lines in their order, then the two reopen notices in theirs. The App test is C-A8: `h.reopen(openedWithNotice())`, then a save through `e2eSaveProjectToFolder`; the strip's first element is the save's first line, and Problems lists the `.reopen-notice` after the top row. Plain `seq` order fails {C-U2b, C-A8}; newest first for every urgency fails {C-U2, C-U2b}.``
  - Checked by hand against the reducer: plain `seq` gives r0, r1, s0, s1 and fails. Newest-first gives s1, s0, r1, r0 and fails. The refusal is urgency 2 and leads under all three orders. C-A1 to C-A7 exist at d6c2daf6 and a-second-save uses A-A1, so C-A8 is free.
- **D-4, where the order lives.**
  - Old (once): `Within urgency 3 only, the notices of the route raised most recently come first, and each route keeps its own raise order. It is class 9 on that ruling, declared before code:`
  - New, appended: ``The order is made in `ordered` alone (`conditions.ts`), which `attentionOf` and `ProblemsTab` both call (`App.tsx` line 937, `ProblemsTab.tsx` line 16 at d6c2daf6), so the strip and Problems follow one order and S-10 holds.``
- **D-5, the relinquished statement's line.**
  - Old (each once): ``The relinquished statement J-A1 and J-E1 compare with: `frontends/shell/src/residency/residencyStatus.ts`, line 462 at d6c2daf6.`` and ``Any status other than the statement at `residencyStatus.ts` line 462 at d6c2daf6 FAILS the step.``
  - New: ``Amendment 15 items 3 and 7 cite `residencyStatus.ts` line 462 at d6c2daf6: that line is `relinquishedText`'s signature, and the statement is line 463 at d6c2daf6.``
- **D-6, ruling text left out.** New: `Also carried by reference: ADV-2026-11-27-42 item 1's last sentence, item 2's last bullet and item 6's fourth bullet.`
- **D-7, shared paths not named.** The list is in check 5. How each one is met is the custodian's decision under rule (00), so I propose no words for that part.

## For the advisor (ruled text; no words proposed)
The new item 83 says, of notices, that those raised last come first. Read notice by notice, that is untrue under item 1 as ruled. An open's reopen notices are raised one at a time (`App.tsx:1266-1267`), and item 1 keeps each route in raise order. So after an open that gives several notices, the strip shows the first one raised. Read as route groups, which the ruling's own "after a save, the save's first line" suggests, it is true. The build gates check each clause against the landed code.

## Notes (not findings)
- The 81-83 reservation lives only in this form. A rule (00a) script that reads only branches would give ADV-2026-11-27-35's unassigned item 81 as well.
- After a-second-save merges, the saved line carries the time (its `saveTimeText`). If C-A8 compares with the first `.save-notice` text rather than `SAVED_NOTICE`, it survives the merge with no edit.
- `seq` is taken at the first raise, so a re-raise (occurrences + 1) does not move its route up. No urgency 3 route re-raises in the App today: save and record go through `replaceBatch`, and each reopen notice has its own ordinal.
- No PR B code or branch exists: no `src/jobs/` at d6c2daf6, and no `milestone-5-pr-b` ref.

No file was written. Nothing was run in or under C:/dev/spatial-ide, and no transcript was read. No hook refused a call.
