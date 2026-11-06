# KNOWN-LIMITATIONS: undeclared behaviours (U3, U4, U7, U8, U9, U11, U13, U14, U16) and the items graded untrue or stale. Five-line short form (`AUTONOMY.md` §21d)

*Committed before any change. Append-only once committed; an amendment written after any outcome has been seen says so in its first line. PLAN nodes kl-undeclared-behaviours-u1-to-u17 and kl-items-graded-untrue-or-stale, one piece, the docs lane's next by the human's ruling of 2026-11-05 (evening), item 2 (`state/directives/2026-11-05-8c-full-form-nine-s2-placed-u12-slot-2-u1-reproducer-adr-notes-words-e2e-readme-words-8b-d3.md`). The five lines, section A and its rows, the estimate, sections C to F, the notes and what could not be settled are the architect's draft (`state/consults/2026-11-06-kl-undeclared-behaviours-and-graded-items-form-architect-draft.md`, read only at main c0ab41c8; extracted sha256 2d92903c0960e45cb73da57125dc654ac656724d6efb851b5dd463ae0fed09dd), carried byte for byte with these changes, all the custodian's: R-7pin's two bare cites written with the file's path (2); each cite the draft writes `path:line @ c0ab41c8…` expanded by script to `path:line @ <commit> sha256:<the lines with their LFs>` (79 pins; 1 by a file name that resolves to one tracked path at that commit; 0 by a file name that resolves to more than one, kept as written; bare line numbers and the cites marked (triage, d8e52f77) kept as written); this title line moved above this lead line; the draft's opening paragraphs, its empty Amendments heading (moved to the end) and its closing list of files read dropped; the custodian's settlement added. Every row's words are written by the worker from the code and are the human's at the click (section C). The custodian keeps the PLAN nodes on main.*

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
   - True at the tag and untrue on main: an on-main paragraph in item 2's and 3's pattern (KNOWN-LIMITATIONS.md:60 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:e39d37ac04fcdd50564771f14507ee1cf074f1f0cf164204cfd2bd2aca565713, :70). It goes after the item's last source comment, at the item's continuation indent, and leaves the item's text unchanged.
   - Untrue at the tag as well: item 8's correction pattern (KNOWN-LIMITATIONS.md:105-107 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:d453a985c565e6330dbdfc289c50936b5f6a96c3b68339aacc1565cb2b5e9613): the replacement text, a dated *Corrected* line, and a "Revised" note in the comment.
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
   - No speed, duration or rate (the header, KNOWN-LIMITATIONS.md:11-12 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:068b0ab712039fed92fdf3a8aee51df67a3876d6969cd7878f7a73942b40b7a0).
6. **Strings the app shows** are quoted only when byte-copied by script from the code at the base, and the copy is marked. A `[P6 placeholder]` string is named as one and never presented as final.
7. **Other items** are cross-referenced by number only. That includes 3, 5, 6, 8, 20, 23 to 28, 36, 38, 42, 43 and 47, none of which is edited.

### §A. The rows

**Numbered items (kl-items-graded-untrue-or-stale)**

- **R-4: item 4, with U7.** Old span KNOWN-LIMITATIONS.md:72-77 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:948295e004c1860b1d6001cfbf748f92417b54af2e6d4644dbb9185312780ee1. Rule 2 picks the pattern.
  - Must cover:
    - Opening a file, the same one or another, keeps the style and clears the applied filter. The worker checks in code that every filter card clears too, not only the filter.
    - The style and each applied filter are written to the session record item 43 describes, and nothing reads that record back.
    - Nothing the user can save exists yet: no project file, no saved style.
  - Comment: the `document.ts:33-37` pin. Its "no session-recoverable state" is contradicted at the app level. It is pinned at the tag and annotated; `document.ts` itself is not edited.
  - Code:
    - frontends/shell/src/workspace/workspaceState.ts:108-109 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:622cd771024e35ec05f8900a2a00dc38927b98dfb94ac2daf1a6f742a8478ab7
    - frontends/shell/src/workspace/workspaceState.ts:156 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:6131ec1c120dc46f5652689c3b84902f879917874f898ac75569cf178dd6d10f
    - frontends/shell/src/App.workspace.test.tsx:239 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:e49f6f88a70a7f59b957b4944aa7f1797793cd2230260214467b84da3b73365f
    - frontends/shell/src/App.workspace.test.tsx:248 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:65b2a8f270ef6a7947d47e46e013095152c78fa4d266f3b3f683f51f4507189f
    - kernel/src/session_history.rs:16-18 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:a438deb5ab9a92c5a5117b3f3b83fe4c201ef8732a151a2ae90a408c3d4f6978
    - kernel/src/session_history.rs:222 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:e42fd19c8241142cfcea7d51c76fcf806e807af687d31c93d802d05b1a1740f7
    - kernel/src/session_history.rs:348 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:070aed58d1bbc93d861297d632f7c2adaf7a974d83e01717e4d81f5579072235
    - kernel/src/session_history.rs:773 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:4062ab69556a7164e0d8417c8c2c4259579928e4aa0b06756f0826f15c3b6fba
    - frontends/shell/src/style/document.ts:33-38 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:af7466a3d45ac09e677f61208e92538945461e513ddc349f472383755f44be95
    - (triage, d8e52f77) App.tsx:857, :1994; session_history.rs:188, :195-203
- **R-10: item 10.** Old span KNOWN-LIMITATIONS.md:120-124 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:a2ba411bae00c12e8d1732ff0f438882e035611fe7b22f9854e08087a7a50915. Rule 2.
  - Must cover:
    - The app still holds one admitted dataset.
    - "Nothing is remembered" is untrue within a run: the style is kept (cross-reference R-4's item).
    - After a crash, the session record's header keeps the CRS assertion and the identity declaration, and the file's path is kept beside it. Nothing reads them back, so the panel sentence the item quotes still holds.
    - There is still no project file.
  - Comment: the `App.tsx:614` pin, pinned at the tag where it was written, plus on-main pins.
  - Code:
    - frontends/shell/src/App.tsx:839-840 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:1e01c4033dfc940a4a2bd08ecb9b06245c1605c5946e60f96b2926cadb7e4f82
    - kernel/src/dataset_ref.rs:259 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:f7e92147b564c834ac3453c4339fbfefb25f60d9c28725c4661452d73ae390de
    - kernel/src/dataset_ref.rs:277 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:72689792fa600fc331ce254c188386b8648cea6bffea103c0f0604cd2087215d
    - kernel/src/session_history.rs:49 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:20d1b2ff8f7b07662d93d0420eb6697bb87d0e791bf062f4e1d1e2419f3f10a7
    - (triage, d8e52f77) workspaceState.ts:126-159; session_history.rs:220, :240-250
- **R-7pin: item 7's source comment only** (KNOWN-LIMITATIONS.md:103 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:4bb88415fec09efa85248967360af08089855bd5c059417fca34662c232cf187). The item's text does not change.
  - The three pins are written at the tag, where the item is true. On main they now land on other lines:
    - within budget: frontends/shell/src/residency/residencyStatus.ts:463 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:e908528796a6e983496e9068021e087396eb33b9b7fa8c99eff5e02fd1da55d6;
    - over budget: frontends/shell/src/residency/residencyStatus.ts:467-468 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:8d7fa169e7ac227448da7367322e0758aa0711755ba19fc337771b3a52003f09;
    - settled partial: frontends/shell/src/residency/residencyStatus.ts:434-435 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:4f65e3ed03efdfab3bb48952bf24aa44e7aa4fc452b001bb2578c75faaca1001.
- **R-13: item 13, with U16.** Old span KNOWN-LIMITATIONS.md:141-146 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:081531ca63526e79ccc425b63a8e12f7ebdaf65e61f51008a915f865996a0e2d. Rule 2: if the window-level release listeners exist at the tag, this is a correction.
  - Must cover:
    - The button-down flag clears on the next pointerup or pointercancel anywhere in the window, so the re-pick recovers at the next release, with no restart.
    - The canvas is remounted on every open.
    - U16: after any release, a camera change restores the readout only once a hover is captured again, stated as the operator meets it (OPEN-7).
    - The "never picks at a pixel the pointer has left" clause is kept if it holds.
  - Comment: the form cite at KNOWN-LIMITATIONS.md:146 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:b4e57f43185d19aabe980a6e8ef9d46656ae853c14a23f54530ad23c599e93bc is kept, plus code pins.
  - Code:
    - frontends/shell/src/canvas/WorkingCanvas.tsx:1940-1958 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:dc798bacbc0873a3c86d5f51ad460a3520182c89c876f5145803af0d07f6cb44
    - frontends/shell/src/canvas/WorkingCanvas.tsx:1959-1990 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:ff2f8bc76e301357c1d8d276219f4c6eaf22ec25ea86e1b2ba57393a8236c2a5
    - frontends/shell/src/App.tsx:2186-2187 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:58f8b3ad2a6efe7fed7293e8224af09171d39903094a2dcb2ee1612fedf8a495
- **R-15: item 15.** The last clause of KNOWN-LIMITATIONS.md:159 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:85c925529319ed33066bd120a1f08f6c4ffc21552944f91a8582d4465280dfbd, and "(open)" in :160.
  - Must cover:
    - The decision has been made: entry 69, ruled 2026-09-14 with entry 90, option (a), the declaration stands (PLAN node `entry-69-runtime-dependency`, done). The ruling came after the tag, so it goes in as a dated on-main note.
    - The "untested" clause stays unless a recorded run says otherwise.
  - The ledger is cited by entry number only.
  - The code half is re-read at the base: (triage, d8e52f77) tauri.conf.json:25-45 and .cargo/config.toml:1-4.
- **R-P: the paragraph after item 15** (KNOWN-LIMITATIONS.md:164-168 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:1b1708b35b204926c68e7968a13d4e1ffdd9a9894575ca4f9e08b76f93f35950). An on-main note after its comment, since the fix came after the tag. Its number is OPEN-4.
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
    - engine/src/pool.rs:113-115 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:f915f1d7de845924fc7c79e61dface053acacba5314aa5a1c3994defdbf50276
    - engine/src/pool.rs:132 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:c52c432c132cb973fdbb7c15c2a9db03a87d9b2ebb2c5d4d0bb464238e560293
    - (triage, d8e52f77) predicate.rs:146-149; tileViewportStreamManager.ts:283, :951, :984-985
- **R-19: item 19.** KNOWN-LIMITATIONS.md:243-245 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:e290a56f79629223a1d75a0541b06ac24bc6307adf4cd255d6af5948adb8db08, and its comment at :246. Edited in place.
  - Must cover:
    - The reduced-component degradation is shown, in the dataset summary's structural-checks row and in the status bar, naming the components that are not established, both as `[P6 placeholder]` text.
    - Nothing is shown when all four components are present.
    - The row makes no statement about whether ADR-016 Amendment 1 item 2 is met.
  - Comment: the ADR-016 `:240` cite keeps that line's own sense (owed at acceptance, delivered by the watcher's `checks` fact: docs/adr/ADR-016-stable-feature-identity-admission.md:240 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:944e3a1bbb6a55b26abbfbf942e233f0c47b76622ca9be9c9c77b5cc57eb0dcc). Its gloss "not met by the build" is dated. The bare cites in the comment are pinned.
  - Code:
    - kernel/src/skp.rs:1382 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:9e90cfeec72e55e3dd8bf1c1fb629d469de8053f658a249dbdc13b98c68e65da
    - frontends/shell/src/admission/DescribeSummary.tsx:92-95 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:b38b7d3d6ad1138d6a34a90254a96f299f6f733cfa7277d0d6d27f49b3eed68e
    - frontends/shell/src/admission/describeSummaryText.ts:90 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:970c938d3592112bc9bfb234c6f8ad9c95981e2b419f4dbf1eb176a8ca30fee1
    - frontends/shell/src/layout/statusItems.ts:34 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:6384e940ad8bcaa73ab2c9bed6bb1feb382214e4402e122972d6e254603fdc4b
    - (triage, d8e52f77) regionParts.tsx:218
- **R-27: item 27.** KNOWN-LIMITATIONS.md:323-325 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:aa6100dff4d0217e909f86b4096a2c854876d283515d5476437a6efcc14b9edd, and the comment at :326.
  - Must cover:
    - The fold rule, kept.
    - Its real effect: a notification that names the file only in a spelling differing in such a character's case is not matched, so it does not end the session while the app is idle. The change is caught at the next query's pre-check or post-check, which is item 26's backstop.
    - A rename of the file itself is reported under its stored spelling and ends the session like any rename. There is no "same file" outcome.
  - Code:
    - engine/src/watch.rs:437-447 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:b985ea131dec4a65d782992b4a1e7a30e79c612fe256fac7f833fa0a745f1031
    - `names_match`'s fold, which the worker locates
    - (triage, d8e52f77) engine/tests/source_watch_adapter.rs:413-416
- **R-56: item 56.** KNOWN-LIMITATIONS.md:445-446 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:01ff47eff3d1da9502a8955f7ebc3cec989601323d9179484366b9445a669e1a.
  - Must cover:
    - The stream count. The map can hold up to four stream connections: three tile streams, plus the untiled first look beside them after an Apply or Clear.
    - Every later clause re-checked against that count.
    - Optionally, where the refusal code is shown: the Activity console, not the status line.
  - Code:
    - engine/src/pool.rs:99 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:346881842ec719008fb6be55f2b42b08dbdff7f8c81d329560639fe53b5dd9cd
    - engine/src/pool.rs:113-115 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:f915f1d7de845924fc7c79e61dface053acacba5314aa5a1c3994defdbf50276
    - engine/src/pool.rs:132 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:c52c432c132cb973fdbb7c15c2a9db03a87d9b2ebb2c5d4d0bb464238e560293
    - (triage, d8e52f77) candidateArmSession.ts:446-448; skp/client.ts:55-62; App.tsx:2465

**Undeclared behaviours (kl-undeclared-behaviours-u1-to-u17)**

- **R-31: U3, as one sentence added to item 31** (KNOWN-LIMITATIONS.md:356-357 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:572f2d93bcb7755553121bd5288e5aa4e6889198b5403e4d31ab93f7a57a2402; DRAFT wording, edited in place).
  - Must cover:
    - A row whose geometry is null stops the stream at that row with `engine.wkb`, naming a null geometry. It is never drawn and never skipped.
    - The row number in that message counts from the start of the batch the engine was reading, not from the file's first row.
    - The worker checks that the single call site covers every encoding.
  - The fix for the chunk-local number stays S3, recorded on the node.
  - Code:
    - engine/src/stream.rs:1980 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:aa24d65c1bf74b6e1d4b28ed46f98ed20535bd8a3113d67a4d04815c4cd29353
    - engine/src/stream.rs:1995 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:a63336c0b89e099249973bf88d1d8040396f5f8a183ecf0f0e45a1ef242e3a6f
    - engine/src/stream.rs:2694-2696 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:846cd77ebd0ba40cf7c675b78b917c61b9ed8d677546f2f99fa152a8546accac
    - (triage, d8e52f77) kernel/src/skp.rs:2134
- **R-54: U9, in item 54** (KNOWN-LIMITATIONS.md:437-438 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:51a4e54fb081f93d15d77c97bff0eaa47ad5a1aff8ae10f68dc3c043e3ead322).
  - Must cover:
    - The Filtered scope asks only while the Table is shown with that scope.
    - Its request is cancelled when the Table is hidden (another Activity tab chosen, or Activity closed), when another scope is chosen, or when an export starts.
    - Showing the Table again asks again from the start and clears what it showed.
  - Item 55 (KNOWN-LIMITATIONS.md:441-442 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:a98a18632c95fc12705f7d851d5f2f15d95ade96c9609a2c126b4411c53865ea) is changed only if one of its clauses fails the check after this one.
  - Code:
    - frontends/shell/src/table/TableTab.tsx:31-32 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:9173c05445a63d63b5434077f8c468cedcd4fa4583d3c809ec2a0d7687e50729
    - frontends/shell/src/table/TableTab.tsx:63-67 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:810ea19862f6071977fa6c0a78dccf1bc0b4e7d88196a96caba93fe660b96df8
    - (triage, d8e52f77) tableSource.ts:121, :197-204
- **R-57: U4, new item 57** after item 56.
  - Must cover:
    - On Windows, the session can end with no change to the file. This happens when the watch reports that it lost coverage: its notification buffer overflowed, or its read failed.
    - The app ends the session as it does for a change, under `engine.source_coverage_lost`, and reopening recovers.
    - The row claims no cause in folder activity that the code does not decide, and no rate.
  - Code:
    - engine/src/watch.rs:73 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:6b918ba33eca709baac9cc223d901aa24159dfb08bf43d227495cd4ca8e2e9b9
    - engine/src/watch.rs:325-351 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:b74b703eb7a4e1e840fbfe12366f2446aa68fd1cecb4d491df139fd062a9a7c3
    - engine/src/watch.rs:383-392 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:16ff6523c73add35b1d47fc324436e30ecab81c3dbedafb680d61c929e84716a
    - kernel/src/skp.rs:1018-1023 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:19ce02380e83c3384bb252117beb75aaa49ec252c4f479acae0a83bb062f4c60
    - kernel/src/skp.rs:1154 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:113c22fe4ca2d5c8cf5bc9da3f44d72b1ed890437025a6830a89c579bf22f301
    - frontends/shell/src/App.tsx:739-742 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:9d31ee575b2fcf26364a90bacce043989897940837d167bb8dbec7ed171e1185
- **R-58: U8, new item 58.**
  - Must cover:
    - The Feature tab and the Table show at most 32 of a file's attribute columns: the first 32 the kernel marks projectable, in the file's column order.
    - The Feature tab says how many it left out, and only beside an inspected feature. The Table says nothing.
    - This limit is distinct from item 5's bundle ceiling.
  - Code:
    - frontends/shell/src/attributes/projection.ts:6-17 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:cf1b93d64ecae2fffabf9b2d8b036f5ecf5ac1d77f3e8bb70bd202bb0ce627b1
    - frontends/shell/src/attributes/projection.ts:26 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:c28d08b2c1d57d787b6a8c055012580d2e7c7f4d3958d2f9e4a37ad26c502eeb
    - frontends/shell/src/feature/FeatureTab.tsx:63 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:89905118a904ae56b8d36a0938150019633c1502fe2cebebc08cf788121a99b2
    - frontends/shell/src/App.tsx:841-842 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:ce1c79740f1673c8d1aa80ebbae2cdbb03f228320d78cbe53297cdb3c6d2d285
    - frontends/shell/src/table/TableTab.tsx:39-40 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:fdd4c99412728e37c1cb4fc6045cdc101f9573a9e86e3fdfb591f1b421c2e161
- **R-59: U11, new item 59.**
  - Must cover:
    - A bundle exported from the app carries no attribute column. The export carries only the column a style matches on, and the app's style matches none (item 4).
    - So the published viewer's hover shows the id alone.
    - The redaction search's styled-column case (item 47) is not reached from the app. That is stated here; item 47 is unchanged (OPEN-5).
  - Code:
    - frontends/shell/src-tauri/src/publish.rs:406 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:46fa20428c4696b3a3f2de385c88868534a17dfd33de339b54dea4e417cd6e6e
    - frontends/shell/src-tauri/src/publish.rs:532 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:46fa20428c4696b3a3f2de385c88868534a17dfd33de339b54dea4e417cd6e6e
    - frontends/shell/src-tauri/src/publish.rs:1238-1246 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:344ffb2c470af3efcb1b1b3f1bbf31992c7278d33ae7706e14cd2ea073530c4d
    - frontends/shell/src/style/document.ts:18-21 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:8f44be03c9c715dde6a93f4475145790fe91051f42010ddb3bf529471c00944a
    - renderer/bundle-viewer/src/main.ts:441-448 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:c0d5309fb851651f9e67b5c605afbf22b5aa88c8d85883d10fbf4b2d39d402e5
- **R-60: U13, new item 60.**
  - Must cover:
    - For a polygon file, hover and click are refused whenever the average on-screen extent of every polygon the map holds is under 9 pixels, off-screen ones included, whatever polygon is under the pointer.
    - Zooming in clears it.
    - Items 36 and 38 state the same rule for points and for lines.
  - Code:
    - frontends/shell/src/canvas/pickResolution.ts:81 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:8540ff19e686430812871511722f8fcb91ab8ada3d977062c4efbc7535a81108
    - frontends/shell/src/canvas/pickResolution.ts:90 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:0215063baae292857bd14a779e0420c1770699722124a50e7548326d38e06cab
    - frontends/shell/src/canvas/pickResolution.ts:170-174 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:cd96ba3b684bfda8714ac3b5f21e0c84553af0213f9420146653410828e67103
    - frontends/shell/src/canvas/pickResolution.ts:205 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:38dd35d3bd4c3664c7afa7f917652514c0ff125be4c08630ac8534b40a800fb6
    - frontends/shell/src/canvas/clickPick.ts:48 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:75fa3b65fe6bcd2014d95af58c75edb8b4787fe4b673587ff0e3c4027f4183fe
    - frontends/shell/src/canvas/HoverReadoutView.tsx:41 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:a0c2248c0a6e24d1d2bb34fbf3a93d4febaef847912f4339126f069a96940ae5
- **R-61: U14, new item 61.**
  - Must cover:
    - The automatic fit at open frames the first batch with geometry that arrives, not the file's extent. The worker checks whether the fit re-armed after an Apply or Clear behaves the same way.
    - Zoom to layer frames every batch the map has held since the open.
    - Neither frames a file-wide extent.
  - Code:
    - frontends/shell/src/canvas/WorkingCanvas.tsx:1547-1560 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:ea66723529129a7003d1ec3f26ac974660a463ed316213d65a92ec8f218bebc2
    - frontends/shell/src/canvas/WorkingCanvas.tsx:1594 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:3ec11c19019b954e96047a4067dfb980542959a507d24f1acb9b0b27eedb1377
    - frontends/shell/src/canvas/WorkingCanvas.tsx:1759-1768 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:514a02f7ea987a67b5124c9bbf4cbe3046043961c3f29cc22be0aedf3be86e1a
- **U16** is carried by R-13.

**Out of scope, and why**
- U1 and U10: `publish-session-tier-identity`, which owns items 5 and 6. Its form says item 3 becomes true and does not change (governance/forms/kernel/PUBLISH-SESSION-TIER-IDENTITY-PREREGISTRATION.md:145 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:d670b0257a5d8c0abbbbc8c577c025238d904dffc755e62a4c9bd7280df631a9). So item 3 is not edited here.
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

### §E. Rule (00), item by item (AUTONOMY.md:609 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:db1a80acb95c7872de091ec4a4eb9647e09c17b0a5475050b4d934e0a39e2bd0; KNOWN-LIMITATIONS items count as separate paths: state/directives/2026-10-18-229-not-i6-item-23-words-approved-no-release-line-rule-00-e2e-readme-entries-227-merged.md:14 @ c0ab41c86d5538ae956840664345d7d0d9e8b1ce sha256:551c2c8c99555a9cf256d5cc1279d1c659a809b72cf150094b8574206ec63c92)

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

## The custodian's settlement (class 1, before any change)

- **OPEN-1: (A)**, this five-line form and the single reviewer gate (§21b), dispatched with one packet under Part 1, item 5 (`state/directives/2026-11-05-main-architect-gate-rounds-part-1-rulings-review-packet-design-part-3-additions.md`); taken on 2026-11-06 (the direction of 2026-10-31, item 4, `state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md`, held until 2026-11-09 by `state/directives/2026-11-03-away-until-11-09-276-open-1-seven-clauses-open-4-c-placed-sitting-wording-leaves-slot-cloud-credit.md`, line 6); the human reviews each on return and may reverse it, a reversal recorded, never edited in.
- **OPEN-2: (A)** (U15 out), **OPEN-3: (A)** (U5 and U6 out), **OPEN-4: (A)** (the paragraph after item 15 an on-main note, no number), **OPEN-6: (A)** (items 4 and 10 in this piece) and **OPEN-7: (A)** (the worker reads deck.gl's installed source, read only, at the version the shell's lock file names at the worker's base, from the main checkout's installed copy, and pins what it relies on); each taken on 2026-11-06 (the direction of 2026-10-31, item 4, `state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md`, held until 2026-11-09 by `state/directives/2026-11-03-away-until-11-09-276-open-1-seven-clauses-open-4-c-placed-sitting-wording-leaves-slot-cloud-credit.md`, line 6); the human reviews each on return and may reverse it, a reversal recorded, never edited in.
- **OPEN-5: (A)**, taken on 2026-11-06 (the direction of 2026-10-31, item 4, `state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md`, held until 2026-11-09 by `state/directives/2026-11-03-away-until-11-09-276-open-1-seven-clauses-open-4-c-placed-sitting-wording-leaves-slot-cloud-credit.md`, line 6); the human reviews each on return and may reverse it, a reversal recorded, never edited in: item 47 is not edited, and R-59 states only the app's path. Option (B) edits security-posture text, a red line: it is the human's alone, and choosing it moves this piece to the full form (note 1).
- **Whose words (section C):** each row's words go to the human at the click, and the human's typed answer decides each one, recorded as an appended amendment before the merge. Part 1, item 2's WORDS-ONLY route does not apply to them.
- **Scope's PLAN.yaml** is the custodian's, committed on main (the human's ruling of 2026-10-21); the branch changes `KNOWN-LIMITATIONS.md` only.
- **What the two nodes cover beyond this piece:** item 3, in kl-items-graded-untrue-or-stale's title, is publish-session-tier-identity's (the out-of-scope list); U1 and U10 are that node's, U2 narrow-integer-id-unstreamable's, U12 PR #285's and U17 single-file-bracket-name-refused-as-partitioned's; U5, U6 and U15 stay out under OPEN-2 and OPEN-3 (A). The done commit records each against its owner.
- **The read commit and main:** `git diff --name-only c0ab41c8 f76066f6` over the 28 files the pins name is empty.
- **Rule (00)** was checked at main f76066f6 by `git diff -U0 origin/main...<branch> -- KNOWN-LIMITATIONS.md` over the branches in flight (`cut/port-2-macos-l1-and-app-dirs`, `cut/b2-piece-1c-save-and-reopen`, `cut/publish-filter-sentence-under-whole-dataset`, `cut/arithmetic-text-literal-beside-null-reason`, `cut/publish-session-tier-identity`): port-2 changes lines 30, 32 and 400 (its platforms paragraph and item 43's), U12 lines 105 and 107 (item 8), U1 lines 79 to 95 (items 5 and 6), 1c and 8d none. None is a place section A names. The nearest are R-4's span (72 to 77) beside U1's line 79 and R-7pin's line 103 beside U12's line 105, each with an unchanged line between. Section E's last rule holds: whichever merges later merges main in before its last gate run. It is checked again at dispatch.
- **Two findings, not in Scope:** item 16's source comment cites `publish.rs` lines that no longer hold the viewer's frozen copy at main (the custodian's ledger at c61e7106); and the draft's item 43 finding (could not settle, its sixth point). Both go to the human; neither is edited here.

## Amendments (opens empty; append-only)

**Amendment 1 (2026-11-06, class 5: the human's ruling of 2026-11-06 (11:10Z), `state/directives/2026-11-06-8e-open-1-words-open-4-a-e2e-readme-c9-c14-c19-heading-open-6-a-filler-order-docs-02-adr-022-kl-178.md`; written after #287's merge).**

- **The merge before the answers.** The human merged #287 at 2026-11-06T11:08:25Z (0f9edda8), before a typed answer to C-1 to C-3 or to the rows' words. Section C's record before the merge was not written. The rows stand on main as the head wrote them, each source comment still opening as DRAFT wording for the human's sight (section A.0, rule 5), and C-1 to C-3 carry the head's text. The human's answers, once typed, are recorded by amendment, and the comments change in the follow-up below, with no re-gate (rule 5).
- **KL:178 joins `kl-items-graded-untrue-or-stale`**, by the human's words. Item 16's source comment (KNOWN-LIMITATIONS.md line 196 at 2869813b) cites `frontends/shell/src-tauri/src/publish.rs:1109-1120` unpinned; at main those lines hold other code, and at the tag they hold `bundled_viewer`, the frozen copy. Item 16 is v0.1.0 text, so under section A.0 rule 5 its pin is at the tag: the cite becomes `frontends/shell/src-tauri/src/publish.rs:1109-1120 @ b391e43622056324c56d35cc33065305140a8415 sha256:5f9e8cace12bfa41539c9023b4e32e5749ac97b778c1558e24eb23f802a6e5f6`. No clause of item 16 changes.
- **The follow-up:** a PR on `cut/kl-items-graded-item-16-cite`, `KNOWN-LIMITATIONS.md` only: that one replacement and, if the human has typed them, the comments' changes. A source-comment fix like the Documentation findings, so no re-gate (section C); the human's at the click.

**Amendment 2 (2026-11-06, class 5: the human's ruling of 2026-11-06 (15:59Z), `state/directives/2026-11-06-8e-words-replaced-u1-h1-h2-class-8-m10-kl-c1-c3-draft-marks-u12-mark-n1-n3-slot-2-order-clippy-placed-288-clicked.md`, line 16; written after #288's merge).**

- **C-1, C-2 and C-3: yes, in the reviewer's words** (`state/consults/gates/2026-11-06-kl-undeclared-behaviours-and-graded-items-gate1-reviewer.md`, each finding's "Replacement words"), for items 10, 31 and 54.
- **Every other row stands as the head wrote it, its DRAFT mark removed** (section A.0, rule 5). On main at de72184b, 16 source comments in `KNOWN-LIMITATIONS.md` open with this form's DRAFT opening, those of the rows R-4, R-7pin, R-10, R-13, R-15, R-P, R-19, R-27, R-31, R-54, R-56, R-57, R-58, R-59, R-60 and R-61; C-1 to C-3's rows are among them. In each, `DRAFT wording for the human's sight, not the human's own wording (`, this form's path and the space after it become `The human's wording, approved in `, this form's path and ` Amendment 2 (`. Every later byte stays, so each row's own reference follows, as in `Amendment 2 (§A R-4)`. The other 19 DRAFT openings in the file belong to other forms and stay.
- **#288 merged first.** The human merged #288 at 2026-11-06T16:02:04Z by gh, after the message (its user record at 15:59:38Z), so these words cannot ride in it with item 16's cite. They go in a second follow-up: a PR on `cut/kl-pair-human-answers-c1-c3-and-draft-marks`, `KNOWN-LIMITATIONS.md` only. The three replacements and the 16 openings are applied by script from span files byte-copied from the reviewer's report and main. No re-gate (section C; section A.0, rule 5); the human's at the click. PLAN node `kl-pair-human-answers-c1-c3-and-draft-marks`.
- **Rule (00).** PR #289 (U1, awaiting merge) changes items 5 and 6 of `KNOWN-LIMITATIONS.md`; none of the rows above is in either. Checked again at dispatch by the branch's diff.
