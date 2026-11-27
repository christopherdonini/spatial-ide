Reviewed: main at be11bd986dbcd8301f46fb124e0b512f45c4b8ec, in the detached read worktree C:/dev/wt/read-1122 (the custodian's filing note, 2026-11-22: the architect's form gate on node (f)'s full form, attempt 1, node:relink-after-refusal-at-the-recorded-place@form-gate-architect-1, dispatched at 2026-11-22T21:37:44.049Z; its run: Read 35, Glob 2, Grep 16, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-22T21:37:52Z to 2026-11-22T21:46:54Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 15663 bytes, sha256 1c18799b100224bcbc87109b082a6d9f3c64e8ec77c16a4720896487486698ca, byte for byte, nothing masked, with one final newline added. FAIL: C-1 (Correctness, a shipped string, S12, untrue on the path the piece adds; its words are the advisor's) and E-1 (Evidence, R10's red run at P0 cannot be valid as declared); nine Documentation findings, D-1 to D-9; OPEN-1 to OPEN-9 read for the advisor, not ruled.)

---

Verdict: FAIL
Reviewed: C:/dev/wt/read-1122 @ be11bd986dbcd8301f46fb124e0b512f45c4b8ec

The form is node (f)'s full form, `governance/forms/frontends/RELINK-AFTER-REFUSAL-AT-THE-RECORDED-PLACE-PREREGISTRATION.md`. I used Read, Grep and Glob only, and ran nothing. Every cite the form relies on holds at be11bd98 as it does at 0a2f0022. The six pinned lines in the custodian's note are the lines the form means: ADV-21-15 item 4 (iv) and item 1, ADV-22-11 item 2's last bullet, ADV-21-06 item 3, Amendment 70 item 3 and R8's text at consult :134. The reviewer recomputes the hashes.

## Blocking findings

**C-1. Correctness. §2 item 5 and OPEN-3 (a): a shipped string becomes untrue on the path this piece adds.**
- After any re-linked open whose `check` differs, `reopenApply` shows S12 (`frontends/shell/src/project/openProject.ts:135`, `relinked: relink !== null` at :71).
- S12's last sentence is at `frontends/shell/src/project/reopenNotices.ts:35`: "On this machine the project now finds its data at the file you chose."
- After a re-link that follows a refused locator, that sentence is false until the project is saved. `data_at` takes the project-relative locator first (`kernel/src/project/mod.rs:1102-1111`), so the next open is refused again. The form's own F-3, the item 73 draft and the new refusal line all say so.
- Ordinary use reaches it. The user chooses a file that was edited, or copied with a new mtime (K-O8 shows the mtime case). The window then shows S12 beside the item-73 behaviour it contradicts.
- The form says the app shows no other new string, and OPEN-3 (a) says the case needs nothing. Neither deals with S12.
- S12 is an app string, so its words are the advisor's (P6), and I do not word it. The form must declare the change. Form words, with the S12 words left to the advisor:

Old:
```text
The app shows no other new string: the button's label is the existing `RELINK_CHOICE`.
```
New:
```text
`RELINKED_FILE` (S12, `reopenNotices.ts:35`) is shown after every re-linked open whose `check` differs (`reopenApply`, `openProject.ts:135`). Its last sentence says that the project now finds its data at the chosen file. After a re-link that follows a refused locator, that is untrue until the project is saved (F-3). Its words change in the same constant, true for both routes, as a draft for the advisor; `openProject.ts` is not touched. The app shows no other new string: the button's label is the existing `RELINK_CHOICE`.
```
Old:
```text
(a) None. The refusal's line carries the save sentence. Recommended, since it keeps clear of `openProject.ts`.
```
New:
```text
(a) None beyond S12's changed words (§2 item 5). The refusal's line carries the save sentence. Recommended, since it keeps clear of `openProject.ts`.
```

**E-1. Evidence. §3 E-1, §4 P0 and §5 I4: R10's red-at-P0 run cannot be valid as declared.**
- R10 checks four things in order: the locators, `hookOpen`'s code, the `.admission-reopen-relink` button in the refused block, then `hookRelink`.
- Commit 1 renders no button in the refused block; commit 2 does. So at P0, R10 fails at the button check, the third check.
- §4 says R10 fails at the re-link, and E-1's base column says "not-asked". I4 then marks the P0 run invalid, because it failed for a reason other than "not-asked".
- So the red-first evidence the form declares cannot be got.
- After a successful hook the refused block is gone, so the button cannot be checked after the hook. The prediction has to move:

Old:
```text
- S-1 (ii) fails, and R10 fails at the re-link. Both are recorded with the commit id.
```
New:
```text
- S-1 (ii) fails, and R10 fails at its button check, since commit 1 renders no button in the refused block. Both are recorded with the commit id.
```
Old:
```text
| E-1 | real app: F-1 then the relink hook | the hook returns "not-asked" | "admitted" |
```
New:
```text
| E-1 | real app: F-1, the refused block, then the relink hook | no `.admission-reopen-relink` in the refused block | the button shows; the hook returns "admitted" |
```
Old:
```text
- I4 (invalid run): R10 at P0 fails for any reason but "not-asked".
```
New:
```text
- I4 (invalid run): R10 at P0 passes its button check, or fails at any other check.
```

## Documentation findings (each must be fixed before the merge)

**D-1. §1, the class.** The form says ADV-2026-11-16-06's week "has ended". ADV-2026-11-22-32 items 2 and 4 rule that whether it has ended is the human's to say. Until the human answers, a form names its class under both rules and takes the fuller. Here both give full, both gates, so the conclusion stands, but the premise is untrue.
Old:
```text
says the ruling "runs for a week from 2026-11-16". That week has ended, so `governance/AUTONOMY.md` §21a and §21c now govern.
```
New:
```text
says the ruling "runs for a week from 2026-11-16". Whether that week has ended is open with the human (ADV-2026-11-22-32 items 2 and 4). Until they answer, the form names its class under item 2 of that ruling and under `governance/AUTONOMY.md` §21a to §21c, and takes the fuller (ADV-2026-11-22-32 item 2). Both give this piece the full class.
```
Old:
```text
That is the class item 2 (a) of the expired ruling gave too
```
New:
```text
That is the class item 2 (a) of that ruling gives too
```

**D-2. §8 and the custodian's overlap note.** The note says the code waits for the merges of PR 353 and PR 359. Neither §8 nor OPEN-6 carries that wait. I could not read the branches, so the overlap itself rests on the custodian.
Old:
```text
12. A merge before the tag without the human's word; a squash or a rebase merge.
```
New:
```text
12. A merge before the tag without the human's word; a squash or a rebase merge.
13. Code committed on a base that does not hold the merges of PR 353 and PR 359 (the custodian's overlap note after the title).
```

**D-3. §4: the count.** Five things are listed under a line that says four.
Old:
```text
Commit 1 adds four things:
```
New:
```text
Commit 1 adds five things:
```

**D-4. §4 S-1 (iv) and M-S3.** M-S3 is killed only if case (iv) carries the locator owner. A real dataset-open refusal has no owner, and the owner test alone returns null for it. Case (iv) should say what it is built with.
Old:
```text
- (iv) a dataset-open refusal gives null;
```
New:
```text
- (iv) a dataset-open refusal, built with `options.reopen` absent and owner `REOPEN_LOCATOR_REFUSAL_NOTICE`, gives null;
```

**D-5. The draft item 73 paragraph (lead-data's draft for the advisor; I do not rule it).** One clause is untrue in ordinary use: an open before the save is refused again only while the file is not back at the recorded place. The §12.3 draft carries that condition and this paragraph drops it. My suggested words, for the advisor:
Old:
```text
so an open before that save is refused again and the choice is offered again.
```
New:
```text
so an open before that save, while the file is not back at that place, is refused again and the choice is offered again.
```

**D-6. §2 item 6: line numbers in a KNOWN-LIMITATIONS comment.** ADV-2026-11-21-06 item 21 has these comments name symbols, with no line numbers.
Old:
```text
Its comment names `relinkOffer`, the button, `handleRelink`, :807-813, `data_at` and `judge`.
```
New:
```text
Its comment names `relinkOffer`, the button, `handleRelink`, `Projects::open_project`'s data step, `data_at` and `judge`.
```

**D-7. Three sub-line quotes are not marked sub-line** (the hash form's rule). In each, add ", sub-line" before the colon:
```text
without-asking.md:17` @ 0a2f0022):
```
```text
without-asking.md:17` @ 0a2f0022, sub-line):
```
```text
four-files.md:13` @ 0a2f0022):
```
```text
four-files.md:13` @ 0a2f0022, sub-line):
```
```text
ADV-2026-11-21-15 item 1 (:11 @ 0a2f0022):
```
```text
ADV-2026-11-21-15 item 1 (:11 @ 0a2f0022, sub-line):
```

**D-8. §3 R10's fixture cite (this also answers lead-data's open question).** :44 is the fixture's constant. The copy and the save happen in `openAndSave`.
Old:
```text
- R10: `filter-zoned.parquet`, copied read-only as `reopen.mjs` copies it (:44).
```
New:
```text
- R10: `filter-zoned.parquet` (`reopen.mjs:44`, read only), copied into a new folder by `openAndSave` (:203-208), which saves it through `e2eSaveProjectToFolder`.
```

**D-9. §9 seam cite.** `openProject`'s signature is at `client.ts:165-170`; :171 is its body.
Old:
```text
(`frontends/shell/src/skp/client.ts:171`)
```
New:
```text
(`frontends/shell/src/skp/client.ts:165-172`)
```

## What I checked

- **The class.** Full, both gates, holds three ways: under ADV-21-15 item 4 (iv) itself, under §21a (:323 the wire, :327 a property under test), and over §21c's bound. The "the week has ended" premise is D-1.
- **The mechanism, OPEN-1 (A).** It holds against the code.
  - Step 5 uses `relink` before any locator (`mod.rs:807-813`).
  - `check_inside` is called only from `data_at` (:1103). Grep finds no other call site.
  - A `relink` passes `locations.json`'s writer at step 2 (:767-770), which refuses a relative path (W-4's relink case), and `locations.json` is written at :849-866.
  - `project.spatial` is rewritten only for a copy, and then only its identity (:759-764, :794-796), so the locators stay.
  - The next save judges again from `ds.path()`, the re-linked path (:351), and writes `locations.json` (:365-367, :401-402).
- **ADR-036 §5 (:104).** (A) keeps the sentence true. The locator's target is still refused by name. The re-linked file is the user's choice, not the locator's target, and it is still checked against `observed` (:237). No ADR note is needed. If the human wants §5 to name the inside-folder re-link, that is an appended amendment, which is a red line and theirs.
- **The spec, §2 items 2 to 4.**
  - Every clause of the new `relink` bullet is true at be11bd98.
  - R8's bullet matches consult :134 byte for byte, and its clauses hold: `projects_root` (store.rs:67-70), `record_dir` (:73-75), the constants (:40-44), and `PREVIOUS_LINEAGE_FILE` (mod.rs:505) read from the identity's folder (:802).
  - OPEN-2 (a), the §8 note with no literal change, is sound. Its precedents are at :1146-1156.
  - The doc change to `OpenProjectRequest` (commands.rs:779-783) changes no field, serde attribute or type. §8 item 3 guards that.
- **The shell, §2 item 1.**
  - `relinkOffer` keyed on the owner place is one decision site. `reopenRefusalPlace` (openProject.ts:92) is the only place that chooses the locator line.
  - The re-link from a refused state keeps `kind: "refused"`, with `inFlight` true (:232-236), so the offer and the button go away while the call runs.
  - A Cancel returns to the same refusal with its offer (:250-258).
  - A dismissed picker ends at "Open cancelled" (:396).
  - The DEV hook takes the refused state's `path` as its folder.
  - Never-block (docs/01) holds: the picker and the call are unchanged, and the host calls `open_project_command` off the main thread (:889-893).
  - The caller rule holds: `relinkOffer`'s product caller is the render. The hook is DEV-only, and the render alone satisfies the rule.
- **The words.** The new `REOPEN_LOCATOR_REFUSAL_NOTICE` draft, the item 73 title, the rest of the item 73 paragraph and item 69's added sentence are true against the code, apart from D-5 and C-1.
- **Tests and mutations.**
  - S-1 (ii) is red at P0 for the right reason.
  - K-F1 green at P0 is sound. It pins unchanged kernel behaviour at the seam, from the wire JSON. M-K1 (fails at F-2) and M-K2 (fails at F-4's `at`) give it teeth, with no known pass case.
  - M-S1, M-S2 and M-E1 have no pass case. M-S3 has none once D-4 is applied.
  - R10 is feasible in `reopen.mjs` as it stands: `openAndSave` copies the fixture and saves through the hook, R3 shows that an inside-folder save carries `project-relative`, and the R9 pattern closes the handle before the rename. A save after the re-link is not needed in R10, since K-F1 covers F-4. R10 must be written on the base after PR 359's merge.
- **The Scope.**
  - §7 lists exactly 10 files against a ceiling of 10, so there is no headroom. C-1 adds no file.
  - §8 items 1 to 12 are sound. Item 13 is D-2.
  - §8 items 9 and 10 and I2 carry Round 25's rules on mutation observations, §7 overruns and class 9.
- **The seams.** The interfaces in §9 match their actual signatures: `open_project` (:701-707), `open_project_command` (:894-897), `OpenProjectRequest` (:786-794), `admitProject` and `reopenRefusalPlace` (openProject.ts:62-94), `runAdmitPath` (:216) and `handleRelink` (:393-401). The client cite is D-9.
- **The constitution.** Control plane only; nothing touches `protocol/data-plane/`; ADR-006's class of `open_project` is unchanged; ADR-018's vocabulary is unchanged.
- **Records.**
  - Every passage the form puts in quotation marks matches its source byte for byte, the ADR's sub-line included.
  - There is no line cite into the ledger and no bare self-line.
  - The pins are named as historical, and the base is named authoritative.
  - I could not check whether be11bd98 itself edits a file the form cites by line, because I have no git. The reviewer should check.

## The OPEN items (for the advisor; I do not rule them)

- **OPEN-1 (A):** sound, with C-1 dealt with.
- **OPEN-2 (a):** sound.
- **OPEN-3 (a):** not sound as drafted (C-1). It is sound with S12's words changed in `reopenNotices.ts`.
- **OPEN-4 (a):** sound.
- **OPEN-5 (a):** sound. The not-canonical and locator-folder forms are not reachable in practice: the reader refuses a non-canonical `at`, and `data_at` maps a folder that does not resolve to the `folder` form.
- **OPEN-6:** sound with D-2. One consequence for the advisor: PR 359 waits for the tag, so under the custodian's note this piece's code cannot start before the tag. ADV-2026-11-22-11 item 2 expects it to be built now.
- **OPEN-7:** the sentence is true.
- **OPEN-8:** no objection.
- **OPEN-9:** "§12" is sound, since R8's own list covers §12.2 to §12.4. A note: :1433 says "on the same machine", meaning the computer. The bullet's words do not literally take in "the same machine", but a reader could; the advisor may want :1433's phrase made to match the bullet.

## Files read (at be11bd98, under C:/dev/wt/read-1122)

- the form: governance/forms/frontends/RELINK-AFTER-REFUSAL-AT-THE-RECORDED-PLACE-PREREGISTRATION.md
- the rulings: state/directives/2026-11-21-advisor-ruling-adv-2026-11-21-15-…, 2026-11-21-…-adv-2026-11-21-06-…, 2026-11-22-…-adv-2026-11-22-11-…, 2026-11-16-…-adv-2026-11-16-06-…, 2026-11-22-…-adv-2026-11-22-32-…
- governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md (Amendment 70)
- the consults: state/consults/2026-11-21-b2-piece-1c-save-and-reopen-p5-words-draft-worker-report.md (:120-139, :315-326); state/consults/2026-11-22-relink-after-refusal-at-the-recorded-place-lead-data-draft.md (its head and its post-end note)
- governance/AUTONOMY.md (§21a to §21c)
- kernel: kernel/src/project/mod.rs, resolver.rs, store.rs; kernel/src/dataset_ref.rs (`check`)
- protocol: protocol/skp/SKP-V0.md (§8's notes, §11.3, §12); protocol/skp/src/v0/commands.rs; protocol/skp/src/v0/error.rs
- the shell: frontends/shell/src/admission/AdmissionPanel.tsx; frontends/shell/src/project/openProject.ts; frontends/shell/src/project/reopenNotices.ts; frontends/shell/src/skp/client.ts; frontends/shell/src/console/surfaceRegistry.ts; frontends/shell/e2e/reopen.mjs
- the tests: kernel/tests/project_reopen_skp.rs; kernel/tests/project_reopen.rs (K-O8)
- KNOWN-LIMITATIONS.md (items 69 to 73)
- docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md (§5, :77, :237)

Model: Opus 5.5 (claude-opus-5-5).
