Reviewed: node (f)'s form governance/forms/frontends/RELINK-AFTER-REFUSAL-AT-THE-RECORDED-PLACE-PREREGISTRATION.md through its Amendment 1, at main 4fa8070fbb44bbc6d9e349375d0d13b66e66dd14, in the detached read worktree C:/dev/wt/read-1122 (the custodian's filing note, 2026-11-23: the architect's form gate attempt 2, node:relink-after-refusal-at-the-recorded-place@form-gate-architect-2, dispatched at 2026-11-22T23:24:09Z; its run: Grep 16, Read 20, Glob 1, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-22T23:24:14Z to 2026-11-22T23:30:58Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 13206 bytes, sha256 f5e718c910c8b0a01edc31e4f3aafd671a7e52660bb49af9805fbd735688e3aa, byte for byte, nothing masked, with one final newline added. PASS WITH NOTES: no Correctness or Evidence finding, and every finding of attempt 1 closed; N-1 to N-4 are Documentation, must-fix before the merge, N-1 a ruling not yet on the form. Under ADV-2026-11-23-01 item 6 and ADV-2026-11-23-03 item 4 they go into the form's Amendment 2 with ADV-2026-11-22-44 items 4 and 5 by script; the checks this attempt could not make go to the architect's gate on the build, after the tag.)

---

Verdict: PASS WITH NOTES
Reviewed: C:/dev/wt/read-1122 @ 4fa8070fbb44bbc6d9e349375d0d13b66e66dd14

I read only, with Read, Grep and Glob, and ran nothing. The form is `governance/forms/frontends/RELINK-AFTER-REFUSAL-AT-THE-RECORDED-PLACE-PREREGISTRATION.md`, read through its Amendment 1. All cites below are at 4fa8070f.

## Summary

- There are no Correctness or Evidence findings. Every finding from attempt 1 is closed.
- The ruled words read true against the code in ordinary use.
- There are four Documentation findings, N-1 to N-4. Each must be fixed before the merge. N-1 is a ruling that has not reached the form.
- Code may start once PR 353 and PR 359 are on main (§8 item 13).

## 1. Copying

**The old texts occur once each.** Each of Amendment 1's old texts occurs exactly once in the form above the amendment, at these lines:
- §2 item 5: :143
- OPEN-3 (a): :330
- the P0 bullet: :175
- the E-1 row: :164
- I4: :230
- the D-1 texts: :85 and :89
- §8 item 12: :276
- "Commit 1 adds four things:": :169
- S-1 (iv): :183
- the §2 item 6 comment: :148
- the three D-7 tails: :18, :20 and :35
- the R10 fixture: :155
- the client cite: :299
- item 73's old sentence: inside :147
- item 69's old sentence: :149
- "Wherever this section says": inside :123

No two of them overlap.

**S12's old text** is the whole of `RELINKED_FILE` (`frontends/shell/src/project/reopenNotices.ts:35`).

**Items 69 and 73 do not hold these texts yet.** `KNOWN-LIMITATIONS.md` items 69 (:533-535) and 73 (:549-551) hold neither old text. That is expected: both are the form's §2 item 6 drafts, which the piece adds. It is not a finding.

**The new texts match their sources byte for byte.**
- The architect's texts in items 1 and 2 (C-1 ×2, E-1 ×3, D-1 ×2, D-2, D-3, D-4, D-6, D-7 ×3, D-8, D-9) are attempt 1's own words (report :26, :34, :50, :58, :66, :78, :86, :96-97, :107, :117, :137, :145, :151, :157, :167, :177).
- The ruled texts in item 3 are ADV-2026-11-22-44's:
  - S12 old and new: ruling :16 and :22;
  - item 73: ruling :32;
  - item 69: ruling :38;
  - OPEN-9: ruling :52.
- Item 73's old sentence is the ruled sentence without D-5's clause. Item 69's old sentence has "after such a refusal" put back. Both are as the amendment says.

## 2. Closure, finding by finding

- **C-1: closed.**
  - Item 1's two texts declare S12's change in `reopenNotices.ts`, which is already one of §7's files. They leave `openProject.ts` untouched.
  - The ruled S12 words drop the untrue sentence. Its two new clauses are true on both routes (§3 below).
  - No test asserts S12's words. `reopenNotices.test.ts:5` says so, and T-6 (:19-34) still holds, since the new last sentence names no component.
  - No e2e suite or walkthrough quotes S12.
- **E-1: closed.**
  - At P0, commit 1 renders nothing in the refused block. `AdmissionPanel.tsx:545-547` renders only `RefusalBlock` there, and the existing button is under `not_found` only (:536-543).
  - So R10's first two checks pass on the unchanged kernel (`mod.rs:1102-1111`, `resolver.rs:172-174`, `error.rs:308-317`), and its third check, the button, fails.
  - The new P0 bullet, the E-1 row and I4 now agree with that, so the red run is valid as declared.
- **D-1: closed.** ADV-2026-11-22-32 item 2 (its :13-14) and item 4 (:20) say what the new text says.
- **D-2: closed.** §8 item 13 is added, and Amendment 1 item 4 carries the start condition.
- **D-3: closed.** Five things are listed (:170-174).
- **D-4: closed**, with N-4.
- **D-5: closed through item 73's ruled sentence.** It carries my D-5 clause word for word.
- **D-6: closed.** "`Projects::open_project`'s data step" is the symbol phrase `resolver.rs:162` uses.
- **D-7: closed.** All three D-7 tails are now marked sub-line.
- **D-8: closed.**
  - `reopen.mjs:44` is the fixture constant.
  - `openAndSave` is at :203-208.
  - It saves through `e2eSaveProjectToFolder`, by `hookSave` at :182-184.
- **D-9: closed.** `client.ts:165-172` is the whole of `openProject`.

**Breakage around the new texts:** none.
- §2 item 5 still ends on "no other new string".
- §8 item 6 now covers S12.
- §1's "may not claim that the re-link lasts before a save" agrees with S12's new words.

## 3. The ruled words: the advisor's wording under the delegation, not the human's

I have not reworded any of them. Each was checked clause by clause.

**S12, ADV-2026-11-22-44 item 2's check, made once on both routes.** Route A is a `not_found` re-link. Route B is a re-link after a refused locator.
- "The project was opened on the file you chose": true on A and B.
  - The `relink` is used before any locator (`mod.rs:807-808`).
  - The engine is given that path (:815-826).
- "it records that file's place when you save it": true on A and B.
  - The save judges the locators from `ds.path()` (:351).
  - It writes the project file (:406) and `locations.json` (:365-367, :401-402).
  - On route A, `locations.json` already holds the chosen file after the open (:849-866). The sentence does not deny that.
- Not ordinary use, so not blocking, but to be named in the source comment:
  - A save that is refused records nothing.
  - The one such case a shown line meets is `SaveFailure::LineageNotKept` (`mod.rs:344`). It is reachable only with a project file from a later version or edited by hand (item 71, `KNOWN-LIMITATIONS.md:542`), and S17 shows beside S12 then.

**`REOPEN_LOCATOR_REFUSAL_NOTICE`, as drafted (form §2 item 5): approved, no text change.** Its clauses hold against the piece's declared code:
- the choice is the new button (§2 item 1 (b));
- the save records the new place, by `judge` (:351).

**Item 73's changed sentence: true.**
- Before a save, `project.spatial` keeps its locators (`mod.rs:759-764`, :794-796).
- `data_at` takes the project-relative locator first and never falls through (:1102-1111).
- So an open while the file is not back at that place is refused as `Unresolvable` again. The owner place is then the locator line again (`openProject.ts:92`), so the offer comes again.
- Not ordinary use: a link or a wrong kind put at the old place gives `through_link` or `wrong_kind`, with no offer. Name it in the comment.

**Item 69's added sentence, ADV-2026-11-22-44 item 5's check, against the one refusal that offers the choice.** That refusal is `skp.project_target_unresolvable` with a `locator` (`openProject.ts:92`). "A refusal for a missing file" is true in ordinary use.
- The locator-only forms cannot be reached through `open_project`:
  - a non-canonical `at` is refused when the file is read (`dataset_ref.rs:559-561`);
  - an unresolvable folder at the check is mapped to the `folder` form (`mod.rs:1106`).
- What is left is `CheckRefused::Unresolvable`.
  - It is a missing name on the path, a file or a folder, which is what the user sees as a missing file.
  - It is also a name whose metadata cannot be read (`resolver.rs:137-138`, :172-174), for example a folder whose permissions deny it. That is not ordinary use. Name it in the comment.
- "with no check of the names on its path": true. `check_inside` is called only in `data_at` (:1103).

**OPEN-9, ADV-2026-11-22-44 item 7's check.**
- "Wherever §12 says" is sound. Every "the machine" or "this machine" in §12 means one user's store (`SKP-V0.md:1424`, :1430, :1431, :1432, :1447, :1449).
- "on the same machine" (:1433) is not untrue beside the new bullet:
  - the bullet defines only "the machine" and "this machine";
  - :1433 reads as the computer, which the bullet itself calls "the same computer".
- So I give no words. It goes to the docs lane, as ruled.

## 4. The rulings reach the form

- Items 1, 2, 3, 6, 7 and 8 are on the form. Item 8 covers code starting after PR 353 and PR 359 are on main, so after the tag.
- Items 9 and 10 rule nothing on the form.
- Missing (N-1):
  - item 4's approval of item 73's title and the rest of its paragraph as drafted;
  - item 5's placement of item 69's sentence at the end of that item's paragraph.

## 5. Evidence

- R10's red run at P0 is valid as now declared (see E-1 above).
- The mutations the amendment touches have no known pass case:
  - M-E1 fails at the button check, before the hook.
  - M-S3 fails at (iv), given that (iv) is not in flight (N-4).
  - M-S1 and M-S2 are unaffected.
- R10 is feasible on the suite as it stands:
  - R3 shows the inside-folder locator (`reopen.mjs:236-243`);
  - R9's pattern closes the handle before the rename (:343-348);
  - the hook returns the refusal code (:447).

## 6. Scope

- The new texts add no file to §7. S12 and N-2's comment are in `reopenNotices.ts`, which is already listed.
- The added lines are a handful, under 420.
- §8 gains item 13.
- §7 holds: 10 files, 420 lines.

## 7. Records

- Every passage the amendment puts in quotation marks matches its source byte for byte:
  - "after such a refusal": ruling :35;
  - "a refusal for a missing file": ruling :41;
  - "on the same machine": ruling :52 and `SKP-V0.md:1433`;
  - "runs for a week from 2026-11-16": the form at :85;
  - "not-asked" and "admitted": `AdmissionPanel.tsx:447`, :454.
- There is no line cite into the ledger and no bare self-line.
- The code cites in the texts are named as reading aids at be11bd98. That is not a pin read as current, and each holds at 4fa8070f.

## Documentation findings (each must be fixed before the merge, by an appended amendment)

**N-1. Amendment 1 item 3: ADV-2026-11-22-44 items 4 and 5 are not wholly on the form.** Item 4 approves item 73's title and the rest of its paragraph as drafted. Item 5 places item 69's sentence at the end of the paragraph. Without the approval on record, §8 item 6 cannot be cleared for the title and paragraph at the build.

```text
**Item 73's changed sentence (§2 item 6), with the gate's D-5 (ADV-2026-11-22-44 item 4).** Old:
```
```text
**Item 73's changed sentence (§2 item 6), with the gate's D-5 (ADV-2026-11-22-44 item 4).** Item 73's title and the rest of its paragraph are approved as §2 item 6 drafts them; this sentence alone changes. Old:
```
```text
The item's comment says that this sentence is added by ADV-2026-11-22-44.
```
```text
The sentence is placed at the end of the item's paragraph (ADV-2026-11-22-44 item 5). The item's comment says that this sentence is added by ADV-2026-11-22-44.
```

**N-2. Amendment 1 item 3, S12: the source comment.** The header of `reopenNotices.ts` (:5-8) gives ADV-2026-11-20-05 item 2 as the source of its texts. Once S12 changes, that is untrue for S12. The non-ordinary case from §3 belongs in the same comment.

```text
The change is in the same constant.
```
```text
The change is in the same constant. The file's header, or S12's own doc comment, names ADV-2026-11-22-44 item 2 as the source of S12's words, and names the case a gate gave as not ordinary use: a save that is refused records nothing (`SaveFailure::LineageNotKept`, item 71).
```

**N-3. Amendment 1, opening paragraph: the cite does not support the claim.** ADV-2026-11-22-35 item 1 is node (g)'s ruling (its :11), not node (f)'s.

```text
(ADV-2026-11-22-35 item 1; ADV-2026-11-22-44 item 1)
```
```text
(ADV-2026-11-22-44 item 1)
```

**N-4. Amendment 1 item 2, D-4: M-S3 is killed only if case (iv) is not in flight.** If (iv) were built in flight, the `inFlight` test alone would return null, and M-S3 would pass.

```text
- (iv) a dataset-open refusal, built with `options.reopen` absent and owner `REOPEN_LOCATOR_REFUSAL_NOTICE`, gives null;
```
```text
- (iv) a dataset-open refusal, built with `options.reopen` absent, `inFlight` false and owner `REOPEN_LOCATOR_REFUSAL_NOTICE`, gives null;
```

None of N-1 to N-4 is the human's wording. N-1 to N-3 are record text, and N-4 is a test case's description. Each old text occurs once in the form file.

**For the source comments** (by the wording-blocks rule, not blocking):
- item 69's: the case of a name whose metadata cannot be read;
- item 73's: a link or a wrong kind put at the old place.

## Files read (under C:/dev/wt/read-1122, at 4fa8070f)

- governance/forms/frontends/RELINK-AFTER-REFUSAL-AT-THE-RECORDED-PLACE-PREREGISTRATION.md
- state/consults/gates/2026-11-22-relink-after-refusal-at-the-recorded-place-form-gate-architect.md
- state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-44-node-f-s12s-new-words-the-pieces-other-words-open-1-to-open-9-its-code-starts-after-the-tag.md
- state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-32-… (grep), state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-35-… (item 1)
- frontends/shell/src/project/reopenNotices.ts, reopenNotices.test.ts, openProject.ts
- frontends/shell/src/admission/AdmissionPanel.tsx (:100-259, :385-559)
- frontends/shell/src/skp/client.ts (:158-173)
- frontends/shell/e2e/reopen.mjs
- kernel/src/project/mod.rs (:300-419, :680-959, :1090-1130), kernel/src/project/resolver.rs (:100-188), kernel/src/dataset_ref.rs (:540-569)
- protocol/skp/src/v0/error.rs (project_target_* constructors), protocol/skp/SKP-V0.md (§12)
- KNOWN-LIMITATIONS.md (items 69 to 73)
- docs/PREREGISTRATION-TEMPLATE.md (classes 3 to 9 and the Round 25 additions), docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md (:77)

Model: Opus 5.5 (claude-opus-5-5).
