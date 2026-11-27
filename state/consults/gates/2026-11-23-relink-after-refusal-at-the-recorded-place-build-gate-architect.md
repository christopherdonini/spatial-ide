Reviewed: branch cut/relink-after-refusal at 06a2825a1dd9e55649605487f1065810905dad58, PR 363 (draft), in the detached read worktree C:/dev/wt/read-relink; the records at main b42c0ed72a8a94885bdd1f057c5c7463e5127a0e in C:/dev/wt/read-1123c; the diff 0f02c164...06a2825a (the custodian's filing note, 2026-11-23: the architect's build gate, node:relink-after-refusal-at-the-recorded-place@build-gate-architect-1, dispatched at 2026-11-23T15:46:49Z; its run: Read 24, Grep 16, Glob 3, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-23T15:46:49Z to 2026-11-23T15:54:08Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 15499 bytes, sha256 ad7c7fc0c2b34813a8289490135e2753bf354dd4fdc11a656de95c88b52051a6, byte for byte, nothing masked, with one final newline added. PASS WITH NOTES: no Correctness or Evidence finding; D-1 to D-6 Documentation, words in comments and docs to fix in PR 363 before the merge; D-7 for the closing amendment (each mutation's observing commit; M-K2 as worded fails at K-F1's first at check, so its predicted place was missed; M-K2b added after the result; commit 4 not named in the brief); D-8 the words of client.ts's doc for the docs lane, outside section 7; none is the human's wording; section 7 holds after the fixes, 410 lines.)

---

Verdict: PASS WITH NOTES (cut/relink-after-refusal @ 06a2825a1dd9e55649605487f1065810905dad58)
Reviewed: C:/dev/wt/read-relink @ 06a2825a1dd9e55649605487f1065810905dad58
REPORT PATH: state/consults/gates/2026-11-23-relink-after-refusal-at-the-recorded-place-build-gate-architect.md

I used only Read, Grep and Glob, and ran nothing. I read the code at the head checkout. I read the records at C:/dev/wt/read-1123c @ b42c0ed72a8a94885bdd1f057c5c7463e5127a0e, and the diff at `<S>/relink-diff-06a2825a.txt` (0f02c164...06a2825a). Code cites below are at the head. Record cites are at b42c0ed7.

## Summary
- **Correctness:** no finding.
- **Evidence:** no finding. The claimed runs are the worker's and the tester's, and the reviewer observes them again.
- **Documentation:** D-1 to D-8. Each must be fixed in this PR before the merge.
- None of them is the human's wording. D-5 adds to a code map; it does not reword the advisor's sentence.
- §7 holds after the fixes. Only D-6 adds a line: 409 becomes 410 (≤420), still over 10 files.

## Checks (§9 as amended)

**1. R8's bullet and the `relink` bullet (SKP-V0.md §12.3).**
- R8's bullet answers its note: the consult :129 asks for one definition of "the machine" across §12. The bullet sits after "**The open**", as carried (:134), with OPEN-9's "§12" applied. Byte-equal.
- The bullet's clauses hold:
  - `projects_root` and `record_dir` (store.rs:67-75);
  - `LOCATIONS`, `FOLDERS` and `OPEN_LOCK` (:40-44);
  - `PREVIOUS_LINEAGE_FILE` (mod.rs:505).
- The `relink` bullet is true at the head, clause by clause:
  - "used in place of every locator": mod.rs:807-808, and step 2's `found` only when there is no relink (:772-778);
  - "check is not made": `check_inside` is called only in `data_at` (:1103);
  - "replaces the entry": :767-770 and :849-866;
  - "keeps its locators": :759-764 and :794-796;
  - "judges them again": :350-351;
  - "refused again": :1102-1111.
- "names a `locator`" matches error.rs:308-335.

**2. §2 items 2 to 4 against mod.rs and ADR-036 §5.**
- The data step is still at mod.rs:807-813, because `kernel/src` is untouched.
- ADR-036 §5 (:104) still holds. The locator's target is refused by name at the first call. The second call opens the file the user chose, which is not that target.
- The shell reads only whether a `locator` field is present (openProject.ts:92), and parses no locator (ADR-036 :98).
- The `OpenProjectRequest` doc (commands.rs:781-784) is true. No field or attribute changed.

**3. OPEN-1, OPEN-2 and OPEN-9.**
- OPEN-1 (A): the change is in the shell only.
- OPEN-2 (a): the §8 note (SKP-V0.md:1169-1175) bumps no literal.
- OPEN-9: "Wherever §12 says".
- OPEN-4 (a): the owner place is the one decision site.
- OPEN-5 (a): the offer keys on `REOPEN_LOCATOR_REFUSAL_NOTICE`. That place comes only from `skp.project_target_unresolvable` with a `locator` (openProject.ts:92).
  - `CheckRefused::FolderUnresolvable` is mapped to the `folder` form (mod.rs:1106).
  - A non-canonical `at` is refused by the reader (dataset_ref.rs:559-561).
  - So only `Unresolvable` offers the choice: a missing name, or a name whose metadata cannot be read. Item 69's comment names the second, as Amendment 2 item 5 asked.

**4. docs/01, never block the canvas.**
- The picker and the call are the existing ones.
- While the re-link call runs, the refused state is in flight (AdmissionPanel.tsx:247-251). So Cancel and the liveness line show (:485-531), and the offer hides (:154).

**5. ADR-006 and ADR-018.**
- No new or changed text calls the re-link undoable.
- The class of `open_project` and its `locations.json` write are unchanged.
- Part AE and R10 carry no duration. R10's 400 000 is a harness bound.

**6. Seams and the caller rule.**
- Each interface §9 lists matches the head:
  - mod.rs:701-707 and :894-897;
  - commands.rs:787-795;
  - client.ts:165-172;
  - openProject.ts:62-94;
  - AdmissionPanel.tsx:231 and :408-416.
- The end-to-end tests come from the real shape:
  - K-F1 decodes `OpenProjectRequest` and `SaveProjectRequest` from wire JSON and serializes the reply;
  - R10 runs through the real app (tester: FAIL at P0 3885d02b at the button check, PASS at the head).
- `relinkOffer` has a product caller, the refused block's render (:497, :565-569). The DEV hook (:468) is its second caller. Nothing lands without a product caller.

**7. §8, item by item.**
1. Ten files, all in §7.
2. No `kernel/src/**`, and nothing of node (g)'s paths (openProject.ts untouched).
3. Doc lines only in commands.rs. No type, serde, literal, fixture, `error.rs`, dependency, lockfile or workflow change.
4. surfaceRegistry.ts is untouched.
5. The offer is in the set, never in flight, and has one decision site. The not_found block's own button (:552-559) predates this piece.
6. Every string is ruled: S12 by ADV-2026-11-22-44 item 2, the locator line by item 3, item 73 by item 4, item 69 by item 5. Each is byte-equal to the form's text.
7. There is no sleep or timeout in S-1 or K-F1, and no platform ignore.
8. No declared-unchanged assertion changed (R1 to R9 are untouched; only the folder list grew).
9. The worker's report says verify-mutation "observes nothing". The observing commits are not yet on the record (D-7).
10. 409 lines over 10 files, by the worker's count. No overrun.
11. No ledger line cite, no hash at a branch commit, no bare self-line.
12. The PR is a draft. A merge waits for the tag.
13. (As Amendment 3 item 4 reads it.) The base 0f02c164 holds the heads of PRs 353, 358 and 359, as Amendment 3 item 2 records. I did not recompute that.

**8. Amendment 1 item 3's words against the built code.** The advisor's wording; every clause is true in ordinary use, so nothing goes to the advisor.
- **S12:**
  - "opened on the file you chose": :807-808 and :815-826;
  - "records that file's place when you save it": :351, :365-367, :401-406;
  - both routes hold.
- **Item 69, "a refusal for a missing file":** true for the one refusal that offers the choice (check 3). "with no check of the names on its path": :1103.
- **Item 73, the title and each clause:**
  - "refused": :1102-1111;
  - "the app offers to choose the file": the button at :565-569, the line at reopenNotices.ts:110;
  - "opened without the check of item 69": :807-808;
  - the changed sentence: the file is unchanged before a save, and the locator place gives the offer again;
  - "Saving records the file's new place ...": `judge` from `ds.path()` (:351), and machine-recorded otherwise.
- **Two cases outside ordinary reading** go in the source comment (D-5):
  - a regular file put at the old place is opened, not refused;
  - a refused save records nothing.

**9. The two source-comment cases.** Both are true:
- item 69's, a name whose metadata cannot be read: resolver.rs:137-138 and :172-174, error.rs:308-317, openProject.ts:92;
- item 73's, a link or a wrong kind at the old place: other codes (error.rs:346-383), owner `REOPEN_REFUSAL_NOTICE` (openProject.ts:93), no offer.

**10. The worker's doc clauses.** True, except D-1 to D-4:
- `relinkOffer`'s doc, the render comment, S12's doc, the `OpenProjectRequest` lines, the §12.3 bullet, R10's doc line;
- Part AE: the strings are `RELINK_CHOICE` (reopenNotices.ts:71), `SAVED_NOTICE` (saveProject.ts:27) and the locator line (:110); the fixture command is manual_walkthrough_fixtures.rs:616.

**11. The mutations.** From the code and the tests:
- M-S1 fails at (iii), the first owner `REOPEN_REFUSAL_NOTICE`.
- M-S2 fails at (v).
- M-S3 fails at (iv), which is not in flight.
- M-K1 fails at F-2's `expect`.
- M-E1 fails at R10's button check (the tester's run 3 at 06a2825a).
- M-K2: the form's words ("`judge` is skipped and `reference` is written") read plainly as every save, first save included. Under that reading the first save records no `project-relative` locator, so K-F1 fails at its first `at` check, not at F-4. The form's prediction of where it fails is wrong as worded.
  - M-K2b (`judge` skipped only at a later save) is the variant that fails at F-4. It is a new mutation, chosen after the result, not the form's M-K2.
  - K-F1's comment states both readings truly.
  - The mutation still kills the test, and M-K2b covers F-4, so there is no Evidence finding. The record is D-7.

**12. Records.**
- The only quoted passages in the new comments are terms ("the machine", "this machine") and app strings, each byte-equal to its source.
- No line cite into the ledger.
- Every source-comment cite is by symbol, item number or form section, so each holds on main after PRs 353, 358 and 359. PR 358 changes item 68 only.

## Documentation findings (each must be fixed before the merge, in this PR; none is the human's wording)

**D-1. `protocol/skp/SKP-V0.md` §8 note.** "mean there" points to §12.3, but the bullet defines the terms for all of §12. Clause check: the bullet says "Wherever §12 says" (:1442).
```text
§12.3 gains the bullet that says what "the machine" and "this machine" mean there.
```
```text
§12.3 gains the bullet that says what "the machine" and "this machine" mean wherever §12 says them.
```

**D-2. `frontends/shell/e2e/README.md`, the E-REOPEN entry.** A refusal for a link or a wrong kind is also a refusal at the place the project file records, and it offers nothing. Clause check: openProject.ts:92 and AdmissionPanel.tsx:154.
```text
it offers one after `not_found` and after a reopen's refusal at the place the project file records.
```
```text
it offers one after `not_found` and after a reopen's refusal as `skp.project_target_unresolvable` with a `locator`, while no call is in flight.
```

**D-3. `frontends/shell/src/project/reopenNotices.ts:109`.** The constant's words changed, but the file header (:5-7) still gives ADV-2026-11-20-05 and -09 as the source of every text, and nothing names the new source. Clause check: ADV-2026-11-22-44 item 3 approves the form's §2 item 5 draft, and that draft is :110's text.
```text
/** R-CODE, the data's locator: replaces R-CODE for `skp.project_target_unresolvable` when the refusal carries a `locator` field. It is also
```
```text
/** R-CODE, the data's locator: replaces R-CODE for `skp.project_target_unresolvable` when the refusal carries a `locator` field. Its words are the advisor's under the human's delegation of 2026-11-13, approved in ADV-2026-11-22-44 item 3 as RELINK-AFTER-REFUSAL-AT-THE-RECORDED-PLACE-PREREGISTRATION.md section 2 item 5 drafts them, and not the human's. It is also
```

**D-4. `frontends/shell/src/admission/AdmissionPanel.tsx:407`, the `handleRelink` comment.** The comment covers both routes, but the Cancel sentence is true only after item 73's refusal. From `not_found`, the call starts in `opening` (:250), and a Cancel ends at the cancelled note (:277).
```text
A Cancel of the call returns to the same refusal, with its choice.
```
```text
A Cancel of the call after item 73's refusal returns to that refusal, with its choice (`runAdmitPath`); after S11's, it ends the run at the cancelled note.
```

**D-5. `KNOWN-LIMITATIONS.md` item 73's comment.** The two cases outside the sentences' ordinary reading are not named. This adds them to the code map; the advisor's wording is not changed. Clause check:
- a regular file at the old place passes `check_inside` (resolver.rs:180-187) and is opened;
- `changedFileNotice` is chosen when the check differs and there was no re-link (openProject.ts:135);
- `SaveFailure::LineageNotKept` returns before any write (mod.rs:344).
```text
so relinkOffer gives no offer for it.
```
```text
so relinkOffer gives no offer for it. A regular file put at the old place is not refused: it is opened as the project's data, and changedFileNotice in frontends/shell/src/project/reopenNotices.ts names what differs when the project's check differs. A save that is refused records nothing (SaveFailure::LineageNotKept in kernel/src/project/mod.rs, item 71), so the old place stays recorded.
```

**D-6. `frontends/shell/e2e/reopen.mjs:19`.** The README says "The recorded mutations are in the file's header", but M-E1 is not there. The quoted message is R10's own error string (the diff, reopen.mjs R10).
```text
// RECORDED MUTATIONS: entries are added by the commit that observes them.
```
```text
// RECORDED MUTATIONS: entries are added by the commit that observes them.
// - M-E1 (RELINK-AFTER-REFUSAL-AT-THE-RECORDED-PLACE-PREREGISTRATION.md section 4): the refused block's `admission-reopen-relink` button not rendered in `src/admission/AdmissionPanel.tsx`; R10 fails at its button check ("the refused block shows no .admission-reopen-relink button"), observed by the tester's E-REOPEN run at 06a2825a.
```

**D-7. The record (the form, by an appended post-result amendment: references and hashes only, under the record cap).** It names:
- the observing commit of each mutation: M-S1 to M-S3, M-K1 and M-K2b at 32342fd4, M-E1 at 06a2825a;
- M-K2 as worded, which failed at K-F1's first `at` check, so its predicted place was missed;
- M-K2b, as a mutation added after the result;
- commit 4 (06a2825a) as a commit the brief did not name;
- the reports (worker, tester) as evidence.

No code words here.

**D-8. `frontends/shell/src/skp/client.ts:161-162`.** `openProject`'s doc still says a `relink` is sent "after a `not_found` reply" only. That file is outside §7, so editing it would break §8 item 1 and the 10-file ceiling (§7, class 8). Before the merge, D-7's amendment routes it to the docs lane, as §0's Intake routed `surfaceRegistry.ts`. These are the words for that lane. Clause check: AdmissionPanel.tsx:412 and openProject.ts:64-66.
```text
absolute path of the data file the client chose after a `not_found` reply.
```
```text
absolute path of the data file the client chose after a `not_found` reply or after a refusal as `skp.project_target_unresolvable` with a `locator`.
```

## Files read
- Head (C:/dev/wt/read-relink):
  - kernel/src/project/mod.rs (:280-414, :640-963, :1090-1130);
  - kernel/src/project/resolver.rs (:120-210);
  - kernel/src/project/store.rs (:30-79);
  - kernel/src/dataset_ref.rs (:540-569);
  - protocol/skp/src/v0/error.rs (project_target_*);
  - protocol/skp/src/v0/commands.rs (:774-798);
  - protocol/skp/SKP-V0.md (by grep);
  - frontends/shell/src/admission/AdmissionPanel.tsx (:60-590);
  - frontends/shell/src/project/openProject.ts (:50-110);
  - frontends/shell/src/project/reopenNotices.ts (:1-40, :100-113);
  - frontends/shell/src/skp/client.ts (:160-173);
  - frontends/shell/e2e/reopen.mjs (:1-30, by grep);
  - docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md (:96-109);
  - greps of actionRegistry.ts, saveProject.ts and manual_walkthrough_fixtures.rs.
- Records (C:/dev/wt/read-1123c):
  - governance/forms/frontends/RELINK-AFTER-REFUSAL-AT-THE-RECORDED-PLACE-PREREGISTRATION.md;
  - state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-44-…;
  - state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-15-… (by grep);
  - state/consults/gates/2026-11-22-relink-after-refusal-at-the-recorded-place-form-gate-architect-attempt-2.md;
  - state/consults/2026-11-21-b2-piece-1c-save-and-reopen-p5-words-draft-worker-report.md (:124-137).
- Scratch (`<S>`):
  - relink-diff-06a2825a.txt;
  - report-relink-worker.md;
  - report-relink-e2e-tester.md;
  - brief-relink-arch-1.md.
- Not read: ADV-2026-11-23-01 and ADV-2026-11-23-03, whose items the form's Amendment 2 carries; attempt 1's report, whose findings attempt 2 closed.

Model: Opus 5.5 (claude-opus-5-5).
