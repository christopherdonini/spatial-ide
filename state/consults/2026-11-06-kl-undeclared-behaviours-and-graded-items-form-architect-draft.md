*Custodian's filing note (2026-11-06): the architect's five-line form draft for the KL pair, `kl-undeclared-behaviours-u1-to-u17` with `kl-items-graded-untrue-or-stale`, the docs lane's next piece, on the human's ruling of 2026-11-05 (evening), item 2 (`state/directives/2026-11-05-8c-full-form-nine-s2-placed-u12-slot-2-u1-reproducer-adr-notes-words-e2e-readme-words-8b-d3.md`). Its brief by file (sha256 84f8328c956e3a193d311544a73bfedae2e56e238d302fa6eae00597dd8d0018), carrying the human's Part 1 rulings of 2026-11-05 by reference and the reuse index's output byte for byte; read at main c0ab41c8. The run 07:11:36Z to 07:25:14Z by its transcript (claude-opus-5-5; unique calls Read 33, Glob 4, Grep 43 and the hand-back, 81, equal to the notification's). Extracted by script from the hand-back in that transcript (30586 bytes, sha256 2d92903c0960e45cb73da57125dc654ac656724d6efb851b5dd463ae0fed09dd); nothing is changed. The form is committed from it at `governance/forms/root/KNOWN-LIMITATIONS-UNDECLARED-BEHAVIOURS-AND-GRADED-ITEMS-PREREGISTRATION.md`, its seven OPEN items settled there. A draft, not Authority.*

---

Draft: kl-undeclared-behaviours-u1-to-u17 with kl-items-graded-untrue-or-stale, five-line form, architect

Read at: main @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce. That commit comes from the brief and the session's git status. I have no shell, so I could not confirm HEAD myself, could not check the brief's sha256 (84f8328c…), and give no sha256 anywhere in this report. Every cite below is a line I read in the checkout, written `@ c0ab41c86d5538ae956840664345d7d0d9e8b1ce`. The custodian adds each span's sha256 at filing (the same practice as the item-42 form's §B). Cites I took from the triage and did not re-read are marked "(triage, d8e52f77)". I left no background shell and ran no wait loop. I wrote no file. All text is my own wording except the reuse block, which is byte-copied from the brief.

---

# KNOWN-LIMITATIONS: undeclared behaviours (U3, U4, U7, U8, U9, U11, U13, U14, U16) and the items graded untrue or stale. Five-line short form (`AUTONOMY.md` §21d)

Path: `governance/forms/root/KNOWN-LIMITATIONS-UNDECLARED-BEHAVIOURS-AND-GRADED-ITEMS-PREREGISTRATION.md`. Drafted by the architect from the custodian's brief, read at main c0ab41c86d5538ae956840664345d7d0d9e8b1ce. The custodian commits it on main before any change. It is append-only once committed, and any amendment made after a result has been seen says so in its first line. No row's words are drafted here (Part 1, item 1). §A names where each row goes and what it must cover.

```
Authority: PLAN nodes kl-undeclared-behaviours-u1-to-u17 and kl-items-graded-untrue-or-stale, one piece, placed by the human (state/directives/2026-11-05-8c-full-form-nine-s2-placed-u12-slot-2-u1-reproducer-adr-notes-words-e2e-readme-words-8b-d3.md, item 2, its docs-lane line); the human's gate-round rulings, Part 1, items 1 to 9, by reference (state/directives/2026-11-05-main-architect-gate-rounds-part-1-rulings-review-packet-design-part-3-additions.md, Part 1); OPEN items with no red line take the drafting agent's recommendation (state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md, item 4); readings, not Authority: state/consults/2026-11-05-area-e-kl-triage-undeclared-behaviours-architect.md and state/consults/2026-11-05-area-e-kl-triage-numbered-items-architect.md (both at d8e52f77). Reuse index: node tools/reuse.mjs in the private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c printed, for known limitations undeclared behaviours (exit 1), `No prior art recorded for "known limitations undeclared behaviours". Research it before planning an implementation.` and, for known limitations items stale untrue (exit 1), `No prior art recorded for "known limitations items stale untrue". Research it before planning an implementation.`; two misses, noted; nothing is implemented.
Scope: KNOWN-LIMITATIONS.md, only at the places §A names: items 4, 10, 13, 15, 19, 27, 31, 54 and 56, item 7's source comment, the unnumbered paragraph after item 15, and new items 57 to 61 after item 56; item 55 only under R-54's condition; no other item is edited and none is renumbered. PLAN.yaml (the two nodes' records). 2 files. Declared line budget <= 130 changed lines by §21c's counting (insertions plus deletions; prose counts), this form excluded.
Change: for each row §A names, KNOWN-LIMITATIONS states what the code at the reviewed head does, in words the worker writes from that code and the human approves or replaces at the click (Part 1, item 1), each row with a source comment that pins its code.
Tests+mutation: none added or changed (documents only: no code, no test, no string the app shows); the single reviewer checks every clause of every row against the code at the reviewed head, and each v0.1.0-section row at the tag b391e43622056324c56d35cc33065305140a8415 as §A.0 rule 2 says; recomputes every pin; and checks that no line outside Scope changes.
Out-of-scope: none of ADR / security / wire / guarantee is touched: no ADR file, nothing under protocol/, no code, no test, no string the app shows; item 47 (the redaction search) is not edited; documents state what unchanged code does, at the tag and on main.
```

### §A.0 Rules for every row

1. **Words after code** (Part 1, item 1). The worker writes each row from the code at its base, and the reviewer checks it clause by clause at the reviewed head. Nothing in this form is a row's words.
2. **The v0.1.0 section** (items 1 to 16 and the paragraph after item 15). For each clause it changes, the worker reads the code at the tag (`git show b391e43622056324c56d35cc33065305140a8415:<path>`) and at the base.
   - True at the tag and untrue on main: an on-main paragraph in item 2's and 3's pattern (KNOWN-LIMITATIONS.md:60 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce, :70). It goes after the item's last source comment, at the item's continuation indent, and leaves the item's text unchanged.
   - Untrue at the tag as well: item 8's correction pattern (KNOWN-LIMITATIONS.md:105-107 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce): the replacement text, a dated *Corrected* line, and a "Revised" note in the comment.
   - The PR body records, for each row, which pattern was used and the tag line it rests on.
3. **The "On main since v0.1.0" section.** Rows there are edited in place.
4. **The human's typed words.** Before changing any old span, the worker runs `git log -L <a>,<b>:KNOWN-LIMITATIONS.md` at the base. It reads the commit that wrote the span and the record that commit names, then classes the span as one of: the human's typed words, approved as drafted, sighted at the release, or DRAFT.
   - A span holding the human's words is never edited without the human. It changes only by rule 2's appended patterns.
   - Where an in-place change cannot be avoided, the PR body marks that span "the human's words, changed", and the human's answer at the click decides.
   - The PR body's table lists, for each row, the span, the commit, and its class.
5. **House style.**
   - A bold lead sentence, the file's continuation indent, and one HTML source comment directly beneath.
   - The comment opens `DRAFT wording for the human's sight, not the human's own wording (<this form> §A <row>)`. On the human's yes it becomes `The human's wording, approved in <this form> Amendment <n>`, with no re-gate.
   - Pins are `path:line[-line] @ <commit> sha256:<hex>`, each with a gloss, each contiguous on one line (round 15 (d)), at a commit on main (round 15 (e)). For on-main text that commit is the base the worker last merged main in at. For v0.1.0 text it is the tag.
   - A `Not covered (§31c)` clause names any case that needs timing inside one request round trip, a dev-only switch or an instrumented build.
   - No speed, duration or rate (the header, KNOWN-LIMITATIONS.md:11-12 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce).
6. **Strings the app shows** are quoted only when byte-copied by script from the code at the base, and the copy is marked. A `[P6 placeholder]` string is named as one and never presented as final.
7. **Other items** are cross-referenced by number only. That includes 3, 5, 6, 8, 20, 23 to 28, 36, 38, 42, 43 and 47, none of which is edited.

### §A. The rows

**Numbered items (kl-items-graded-untrue-or-stale)**

- **R-4: item 4, with U7.** Old span KNOWN-LIMITATIONS.md:72-77 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce. Rule 2 picks the pattern.
  - Must cover:
    - Opening a file, the same one or another, keeps the style and clears the applied filter. The worker checks in code that every filter card clears too, not only the filter.
    - The style and each applied filter are written to the session record item 43 describes, and nothing reads that record back.
    - Nothing the user can save exists yet: no project file, no saved style.
  - Comment: the `document.ts:33-37` pin. Its "no session-recoverable state" is contradicted at the app level. It is pinned at the tag and annotated; `document.ts` itself is not edited.
  - Code:
    - frontends/shell/src/workspace/workspaceState.ts:108-109 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - frontends/shell/src/workspace/workspaceState.ts:156 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - frontends/shell/src/App.workspace.test.tsx:239 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - frontends/shell/src/App.workspace.test.tsx:248 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - kernel/src/session_history.rs:16-18 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - kernel/src/session_history.rs:222 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - kernel/src/session_history.rs:348 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - kernel/src/session_history.rs:773 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - frontends/shell/src/style/document.ts:33-38 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - (triage, d8e52f77) App.tsx:857, :1994; session_history.rs:188, :195-203
- **R-10: item 10.** Old span KNOWN-LIMITATIONS.md:120-124 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce. Rule 2.
  - Must cover:
    - The app still holds one admitted dataset.
    - "Nothing is remembered" is untrue within a run: the style is kept (cross-reference R-4's item).
    - After a crash, the session record's header keeps the CRS assertion and the identity declaration, and the file's path is kept beside it. Nothing reads them back, so the panel sentence the item quotes still holds.
    - There is still no project file.
  - Comment: the `App.tsx:614` pin, pinned at the tag where it was written, plus on-main pins.
  - Code:
    - frontends/shell/src/App.tsx:839-840 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - kernel/src/dataset_ref.rs:259 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - kernel/src/dataset_ref.rs:277 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - kernel/src/session_history.rs:49 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - (triage, d8e52f77) workspaceState.ts:126-159; session_history.rs:220, :240-250
- **R-7pin: item 7's source comment only** (KNOWN-LIMITATIONS.md:103 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce). The item's text does not change.
  - The three pins are written at the tag, where the item is true. On main they now land on other lines:
    - within budget: frontends/shell/src/residency/residencyStatus.ts:463 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce;
    - over budget: :467-468 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce;
    - settled partial: :434-435 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce.
- **R-13: item 13, with U16.** Old span KNOWN-LIMITATIONS.md:141-146 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce. Rule 2: if the window-level release listeners exist at the tag, this is a correction.
  - Must cover:
    - The button-down flag clears on the next pointerup or pointercancel anywhere in the window, so the re-pick recovers at the next release, with no restart.
    - The canvas is remounted on every open.
    - U16: after any release, a camera change restores the readout only once a hover is captured again, stated as the operator meets it (OPEN-7).
    - The "never picks at a pixel the pointer has left" clause is kept if it holds.
  - Comment: the form cite at KNOWN-LIMITATIONS.md:146 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce is kept, plus code pins.
  - Code:
    - frontends/shell/src/canvas/WorkingCanvas.tsx:1940-1958 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - frontends/shell/src/canvas/WorkingCanvas.tsx:1959-1990 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - frontends/shell/src/App.tsx:2186-2187 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
- **R-15: item 15.** The last clause of KNOWN-LIMITATIONS.md:159 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce, and "(open)" in :160.
  - Must cover:
    - The decision has been made: entry 69, ruled 2026-09-14 with entry 90, option (a), the declaration stands (PLAN node `entry-69-runtime-dependency`, done). The ruling came after the tag, so it goes in as a dated on-main note.
    - The "untested" clause stays unless a recorded run says otherwise.
  - The ledger is cited by entry number only.
  - The code half is re-read at the base: (triage, d8e52f77) tauri.conf.json:25-45 and .cargo/config.toml:1-4.
- **R-P: the paragraph after item 15** (KNOWN-LIMITATIONS.md:164-168 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce). An on-main note after its comment, since the fix came after the tag. Its number is OPEN-4.
  - Must cover:
    - On main, the map's own load no longer exhausts the filter-admission connections (the 3 + 1 sizing).
    - A refused tile is logged and asked for again once.
    - An area whose tile is refused after that retry is still reported as not loaded.
    - The remaining exhaustion case is item 56's.
  - Comment:
    - Entry 87 is kept as history.
    - "Discarded" and "queued post-tag" give way to the PLAN nodes `polish-87-88-89` (PR 55) and `polish-engine-lease-class` (PR 59), and to pins.
    - Nothing is stated about FIND''s current state (triage §6, out of scope).
  - Code:
    - engine/src/pool.rs:113-115 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - engine/src/pool.rs:132 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - (triage, d8e52f77) predicate.rs:146-149; tileViewportStreamManager.ts:283, :951, :984-985
- **R-19: item 19.** KNOWN-LIMITATIONS.md:243-245 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce, and its comment at :246. Edited in place.
  - Must cover:
    - The reduced-component degradation is shown, in the dataset summary's structural-checks row and in the status bar, naming the components that are not established, both as `[P6 placeholder]` text.
    - Nothing is shown when all four components are present.
    - The row makes no statement about whether ADR-016 Amendment 1 item 2 is met.
  - Comment: the ADR-016 `:240` cite keeps that line's own sense (owed at acceptance, delivered by the watcher's `checks` fact: docs/adr/ADR-016-stable-feature-identity-admission.md:240 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce). Its gloss "not met by the build" is dated. The bare cites in the comment are pinned.
  - Code:
    - kernel/src/skp.rs:1382 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - frontends/shell/src/admission/DescribeSummary.tsx:92-95 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - frontends/shell/src/admission/describeSummaryText.ts:90 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - frontends/shell/src/layout/statusItems.ts:34 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - (triage, d8e52f77) regionParts.tsx:218
- **R-27: item 27.** KNOWN-LIMITATIONS.md:323-325 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce, and the comment at :326.
  - Must cover:
    - The fold rule, kept.
    - Its real effect: a notification that names the file only in a spelling differing in such a character's case is not matched, so it does not end the session while the app is idle. The change is caught at the next query's pre-check or post-check, which is item 26's backstop.
    - A rename of the file itself is reported under its stored spelling and ends the session like any rename. There is no "same file" outcome.
  - Code:
    - engine/src/watch.rs:437-447 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - `names_match`'s fold, which the worker locates
    - (triage, d8e52f77) engine/tests/source_watch_adapter.rs:413-416
- **R-56: item 56.** KNOWN-LIMITATIONS.md:445-446 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce.
  - Must cover:
    - The stream count. The map can hold up to four stream connections: three tile streams, plus the untiled first look beside them after an Apply or Clear.
    - Every later clause re-checked against that count.
    - Optionally, where the refusal code is shown: the Activity console, not the status line.
  - Code:
    - engine/src/pool.rs:99 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - engine/src/pool.rs:113-115 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - engine/src/pool.rs:132 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - (triage, d8e52f77) candidateArmSession.ts:446-448; skp/client.ts:55-62; App.tsx:2465

**Undeclared behaviours (kl-undeclared-behaviours-u1-to-u17)**

- **R-31: U3, as one sentence added to item 31** (KNOWN-LIMITATIONS.md:356-357 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce; DRAFT wording, edited in place).
  - Must cover:
    - A row whose geometry is null stops the stream at that row with `engine.wkb`, naming a null geometry. It is never drawn and never skipped.
    - The row number in that message counts from the start of the batch the engine was reading, not from the file's first row.
    - The worker checks that the single call site covers every encoding.
  - The fix for the chunk-local number stays S3, recorded on the node.
  - Code:
    - engine/src/stream.rs:1980 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - engine/src/stream.rs:1995 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - engine/src/stream.rs:2694-2696 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - (triage, d8e52f77) kernel/src/skp.rs:2134
- **R-54: U9, in item 54** (KNOWN-LIMITATIONS.md:437-438 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce).
  - Must cover:
    - The Filtered scope asks only while the Table is shown with that scope.
    - Its request is cancelled when the Table is hidden (another Activity tab chosen, or Activity closed), when another scope is chosen, or when an export starts.
    - Showing the Table again asks again from the start and clears what it showed.
  - Item 55 (KNOWN-LIMITATIONS.md:441-442 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce) is changed only if one of its clauses fails the check after this one.
  - Code:
    - frontends/shell/src/table/TableTab.tsx:31-32 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - frontends/shell/src/table/TableTab.tsx:63-67 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - (triage, d8e52f77) tableSource.ts:121, :197-204
- **R-57: U4, new item 57** after item 56.
  - Must cover:
    - On Windows, the session can end with no change to the file. This happens when the watch reports that it lost coverage: its notification buffer overflowed, or its read failed.
    - The app ends the session as it does for a change, under `engine.source_coverage_lost`, and reopening recovers.
    - The row claims no cause in folder activity that the code does not decide, and no rate.
  - Code:
    - engine/src/watch.rs:73 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - engine/src/watch.rs:325-351 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - engine/src/watch.rs:383-392 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - kernel/src/skp.rs:1018-1023 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - kernel/src/skp.rs:1154 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - frontends/shell/src/App.tsx:739-742 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
- **R-58: U8, new item 58.**
  - Must cover:
    - The Feature tab and the Table show at most 32 of a file's attribute columns: the first 32 the kernel marks projectable, in the file's column order.
    - The Feature tab says how many it left out, and only beside an inspected feature. The Table says nothing.
    - This limit is distinct from item 5's bundle ceiling.
  - Code:
    - frontends/shell/src/attributes/projection.ts:6-17 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - frontends/shell/src/attributes/projection.ts:26 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - frontends/shell/src/feature/FeatureTab.tsx:63 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - frontends/shell/src/App.tsx:841-842 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - frontends/shell/src/table/TableTab.tsx:39-40 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
- **R-59: U11, new item 59.**
  - Must cover:
    - A bundle exported from the app carries no attribute column. The export carries only the column a style matches on, and the app's style matches none (item 4).
    - So the published viewer's hover shows the id alone.
    - The redaction search's styled-column case (item 47) is not reached from the app. That is stated here; item 47 is unchanged (OPEN-5).
  - Code:
    - frontends/shell/src-tauri/src/publish.rs:406 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - frontends/shell/src-tauri/src/publish.rs:532 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - frontends/shell/src-tauri/src/publish.rs:1238-1246 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - frontends/shell/src/style/document.ts:18-21 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - renderer/bundle-viewer/src/main.ts:441-448 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
- **R-60: U13, new item 60.**
  - Must cover:
    - For a polygon file, hover and click are refused whenever the average on-screen extent of every polygon the map holds is under 9 pixels, off-screen ones included, whatever polygon is under the pointer.
    - Zooming in clears it.
    - Items 36 and 38 state the same rule for points and for lines.
  - Code:
    - frontends/shell/src/canvas/pickResolution.ts:81 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - frontends/shell/src/canvas/pickResolution.ts:90 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - frontends/shell/src/canvas/pickResolution.ts:170-174 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - frontends/shell/src/canvas/pickResolution.ts:205 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - frontends/shell/src/canvas/clickPick.ts:48 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - frontends/shell/src/canvas/HoverReadoutView.tsx:41 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
- **R-61: U14, new item 61.**
  - Must cover:
    - The automatic fit at open frames the first batch with geometry that arrives, not the file's extent. The worker checks whether the fit re-armed after an Apply or Clear behaves the same way.
    - Zoom to layer frames every batch the map has held since the open.
    - Neither frames a file-wide extent.
  - Code:
    - frontends/shell/src/canvas/WorkingCanvas.tsx:1547-1560 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - frontends/shell/src/canvas/WorkingCanvas.tsx:1594 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
    - frontends/shell/src/canvas/WorkingCanvas.tsx:1759-1768 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce
- **U16** is carried by R-13.

**Out of scope, and why**
- U1 and U10: `publish-session-tier-identity`, which owns items 5 and 6. Its form says item 3 becomes true and does not change (governance/forms/kernel/PUBLISH-SESSION-TIER-IDENTITY-PREREGISTRATION.md:145 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce). So item 3 is not edited here.
- U2: `narrow-integer-id-unstreamable`.
- U12: PR #285, which owns item 8.
- U17: `single-file-bracket-name-refused-as-partitioned`, which covers item 20.
- U5 and U6: OPEN-3.
- U15: OPEN-2.
- Item 43: imprecise only, and port-2's and 1c's.
- The stale test and harness comments: `regression.mjs` and `App.lateResult.test.tsx` (triage §6, Group B). They are not in KNOWN-LIMITATIONS and have no node; the custodian's to place.
- `document.ts`'s "Ephemeral only" doc comment: a code file, for the module-docs sweep.

### §B. Line estimate (§21c counting, prose included; mine)

| Row | Lines |
|---|---|
| R-4 | 3 |
| R-10 | 5 |
| R-7pin | 2 |
| R-13 | up to 12 |
| R-15 | 6 |
| R-P | 5 |
| R-19 | 8 |
| R-27 | 8 |
| R-56 | 4 |
| R-31 | 4 |
| R-54 | up to 8 |
| R-57 to R-61 | about 4 each, 20 in all |

The total is about 85, against the declared 130.

### §C. Whose words, and the gate

- **Whose words.** Every row's words are the human's at the click, under the placing ruling's item 2 and Part 1, item 1. I read them as red-line text (release-facing). That is the same reading as `publish-session-tier-identity`'s OPEN-5 for items 5 and 6.
  - So the human's typed answer decides each row.
  - Part 1, item 2's WORDS-ONLY pass does not apply ("never covers my wording or red-line texts").
- **The route.** One reviewer, the single combined gate (§21b), dispatched with Part 1, item 5's packet.
- **What blocks.** Only Correctness or Evidence: a clause the code at the head, or at the tag for a v0.1.0 row, does not support is Correctness.
- **Wording-only blocks.** Where a block is about wording only, the reviewer supplies replacement words with their clause check (§31 a, c), and both sets go to the human at the click (§31 b).
- **Documentation findings** are fixed before the merge, with no re-gate.
- **Recording the answer.** The human's answer is recorded as an appended amendment (class 5, as in the item-42 form's Amendment 1) before the merge.

### §D. Verification

- **Run by the worker at the head, and re-run by the reviewer:**
  - `node scripts/plan/verify-cites.mjs`
  - `node scripts/plan/verify-quotes.mjs`
  - `node scripts/plan/verify-test-claims.mjs`
  - `node scripts/plan/verify.mjs --offline`
  - `node scripts/plan/docsOnly.mjs origin/main HEAD`
  - the scripts' `node --test` suite, as CI runs it
  - `git diff --numstat origin/main...HEAD -- KNOWN-LIMITATIONS.md` for the budget
  - Under Part 1, item 4, these are the suite for this piece, run and passed at the reviewed head before dispatch.
- **In the PR body:**
  - per row: each clause, its pin at the head, holds yes or no; the tag line for v0.1.0 rows; the `git log -L` class;
  - a render check that items 57 to 61 display under their own numbers (the D-2 lesson from PR #215).
- **Pins** follow §A.0 rule 5, and the reviewer recomputes every hash.
- **Tests and e2e.** No row needs a test or an e2e run, except U16's dependence on deck.gl, which is OPEN-7.

### §E. Rule (00), item by item (AUTONOMY.md:609 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce; KNOWN-LIMITATIONS items count as separate paths: state/directives/2026-10-18-229-not-i6-item-23-words-approved-no-release-line-rule-00-e2e-readme-entries-227-merged.md:14 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce)

| This piece | U12 (#285) | U1 | port-2 | 8d | 1c |
|---|---|---|---|---|---|
| items 4, 10 | none | none | none | none | 1c owes notes on them later and builds on these (its PLAN summary); disjoint now |
| item 7 comment, items 13, 15, P, 19, 27, 31, 54, (55), 56 | none (item 8) | none (items 5, 6) | none (platforms paragraph, item 43) | none | its K-2 cites 19 and 23 to 28 by number; the numbers are kept |
| new items 57 to 61 | none | none | none | none | it holds 48 to 50, disjoint |

- No code path is shared. U11's pins are read on `publish.rs` at main, which U12 and U1's phase 2 will edit. The pins stay historical, and the clause check runs at the head after main is merged in.
- Owner's index: none needed. No index lists `governance/forms/root/`.
- Whichever of these pieces merges later merges main in before its last gate run.

### §F. OPEN items (each with options and a recommendation)

- **OPEN-1: the route.**
  - (A) This five-line form and one reviewer. Recommended: about 85 lines in 2 files, no new behaviour, and the precedent of the item-23, item-42 and owed-rows forms.
  - (B) The full form and both gates.
  - Not a red line.
- **OPEN-2: U15.**
  - (A) Out. Recommended: it is ruled behaviour (entry 35) that the app's status line and walkthrough L4 already state, and a sentence saying that a Cancel does not stop a load is text about ADR-018's cancellation guarantee, which would put the Out-of-scope line in doubt (§25 (e)).
  - (B) New item 62, under the full form.
  - Not a red line.
- **OPEN-3: U5 and U6.**
  - (A) Out. Recommended: U5 is the P6 process, owned by `operator-sitting-queue`. U6's fix is the version field in `release-v0-2-0`, and a row about it would be falsified by that bump.
  - (B) One row each.
  - Not a red line.
- **OPEN-4: the paragraph after item 15.**
  - (A) An on-main note, no number. Recommended: no change to the human's sighted span.
  - (B) A number, with a column-0 line.
  - Not a red line.
- **OPEN-5: item 47's styled-column clause.**
  - (A) Item 47 is unchanged, and R-59 states the app path. Recommended.
  - (B) Edit item 47. **Red line:** it is security-posture text, which also brings §21a and full gating.
- **OPEN-6: items 4 and 10.**
  - (A) In this piece now, with 1c's step building on them. Recommended, as 1c's PLAN summary already reads.
  - (B) Leave them to 1c.
  - Not a red line.
- **OPEN-7: U16's "until the pointer moves".**
  - (A) The worker reads deck.gl's installed source for when `onHover` fires and pins it. If that does not decide it, the clause is reduced to what the shell's code proves. Recommended.
  - (B) An e2e run.
  - Not a red line.

## Amendments

*Opens empty; append-only.*

---

## Notes (mine)

1. **Route.**
   - All four §21c bounds are met: an estimated 85 changed lines, 2 files, no new user-visible behaviour, and no new exposure or dependency.
   - The Out-of-scope line holds only with OPEN-2 (A) and OPEN-5 (A). Either (B) moves the piece to the full form from dispatch (§25 (e)).
   - One PR is enough, so the human's "one piece" is kept.
2. **Tag pins.** The pins for items 7 and 10 (KNOWN-LIMITATIONS.md:103, :124) were probably right at the tag. Since those items describe the v0.1.0 artifact, they are re-pinned at the tag, not "repointed" to main.
3. **The "On main" paragraphs** for items 4 and 10 follow the item-3 pattern that 1c's PLAN summary already expects.

## Could not settle

- Any sha256, and HEAD itself (no shell).
- What items 4, 10 and 13 say at the tag. Rule 2 has the worker read them there.
- Each old span's `git log -L` class.
- The deck.gl clause (OPEN-7).
- Whether the degradation display meets ADR-016 Amendment 1 item 2. That is the human's; the row makes no claim either way.
- Item 43 does not list the CRS assertion and identity the record's header keeps (kernel/src/dataset_ref.rs:259, :277 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce). This is a finding for item 43's owners and is not edited here.
- The cites marked "(triage, d8e52f77)" were not re-read at c0ab41c8. The worker re-derives them.

Files read (all under C:/dev/spatial-ide):
- the brief
- the two directives of 2026-11-05 named above
- both triage consults
- `governance/PLAN.yaml` (6455-6514, and greps)
- `KNOWN-LIMITATIONS.md`, whole
- `docs/PREREGISTRATION-TEMPLATE.md`
- `governance/AUTONOMY.md` (306-391, 476-482, 530-551, and a grep for 609)
- `governance/AI_DEVELOPMENT.md` (451-465)
- the root forms for the owed rows, item 42, item 23 and item 2
- `governance/forms/kernel/PUBLISH-SESSION-TIER-IDENTITY-PREREGISTRATION.md` (120-159, and a grep)
- `governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md` (308-321, 510-549, and greps)
- `state/directives/2026-10-18-229-not-i6-item-23-words-approved-no-release-line-rule-00-e2e-readme-entries-227-merged.md` (12-15)
- `docs/adr/ADR-016-stable-feature-identity-admission.md` (205-241)
- the code spans cited above
- `scripts/plan/docsOnly.mjs` (1-40)
