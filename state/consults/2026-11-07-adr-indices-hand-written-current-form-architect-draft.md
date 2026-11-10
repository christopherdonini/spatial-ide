*Custodian's filing note (2026-11-07): the architect's form draft for the docs lane's `adr-indices-hand-written-current`, read only at main 1bc349ae. Its brief was given by file (7521 bytes, sha256 f252fbfdb5abc5b1ee250601d7ee493c944337c06d347db886dc32da413b1821), with the in-flight paths under docs/ by git and the reuse index's output byte for byte. Dispatched at 2026-11-07T21:11:57Z by its transcript; the run went to 21:22:56Z (claude-opus-5-5; unique calls: Read 42, Grep 35, Glob 2 and the hand-back, 80 in all, equal to the notification's). The report below was extracted by script from the hand-back in that transcript (26923 bytes, sha256 aa6ebc9306d7360d12dd4b3ed2a451c5639a00ce1b265af4068227c6c8928b1b) and is unchanged. Its spans were copied from its Read output, not by script, as it says itself. A draft, not Authority: the form is committed separately, with the custodian's settlement.*

---

Draft: adr-indices-hand-written-current, five-line form, architect

Read at: main @ 1bc349ae2b77ec955138e2b40e32be5b7b0c8352. This is a draft, so it carries no verdict. I have no shell, so I give no sha256 anywhere in this report, and I leave no background shell. I could not confirm that HEAD equals that commit. The session's git status names it as the latest commit, and it shows `docs/README.md`, `docs/02_Architecture.md` and `docs/adr/` unmodified. `governance/PLAN.yaml` carries your staged, uncommitted edits, so I read the three nodes as they stand in the working tree. Every cite in this report as `path:line @ 1bc349ae2b77ec955138e2b40e32be5b7b0c8352` is a read of the tree at that commit.

---

## 1. The form, whole

```markdown
# The hand-written ADR indices brought current: docs/README.md's Conventions paragraph and docs/02's ADR list — five-line preregistration (`AUTONOMY.md` §21d)

*Committed before any change. Drafted by the architect agent on the custodian's brief, read at main 1bc349ae2b77ec955138e2b40e32be5b7b0c8352. Placed by the human's message of 2026-11-05 (evening), item 2 (`state/directives/2026-11-05-8c-full-form-nine-s2-placed-u12-slot-2-u1-reproducer-adr-notes-words-e2e-readme-words-8b-d3.md`): the docs lane, 5 of 7. The human's gate-round rulings, Part 1, items 1 to 9 (`state/directives/2026-11-05-main-architect-gate-rounds-part-1-rulings-review-packet-design-part-3-additions.md`), apply by reference. Under item 1, the worker writes each corrected sentence from the ADRs as they stand at its own head, and the gate checks it clause by clause against the ADR lines the Findings name. This form sits in `governance/forms/root/` because `governance/README.md`'s placement rule names no `docs` folder, and the docs-only forms (`DOCS-08-PUBLIC-DATA-SENTENCE-PREREGISTRATION.md`) sit here. A single combined reviewer gate (§21b) applies, because none of §21a's categories is touched. Each `path:line @ <commit>` below is a read at that commit and carries no hash. Nothing below is a quotation.*

```
Authority: PLAN node adr-indices-hand-written-current; the human's placement, state/directives/2026-11-05-8c-full-form-nine-s2-placed-u12-slot-2-u1-reproducer-adr-notes-words-e2e-readme-words-8b-d3.md, item 2; the triage state/consults/2026-11-05-docs-audit-tasks-a-b-triage-architect.md, Task A and its Proposal 1, on the audits state/consults/2026-11-03-cloud-adr-docs-audit-report.md and state/drafts/2026-11-03-platform-adr-notes-docs-paths-audit.md (a draft, not Authority); the precedent adr-032-staleness-docs (governance/forms/scripts/ADR-032-STALENESS-DOCS-PREREGISTRATION.md); the reuse index (tools/reuse.mjs in the read-only private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c, run 2026-11-07): two misses, "adr index current" and "documentation index status", each exit 1, no prior art
Scope: docs/README.md (line 27, the Conventions paragraph, only) and docs/02_Architecture.md (its ADR list, from the "## ADRs" heading to the end of the file, only); 2 files; <= 30 changed lines (insertions plus deletions, §21c's rule), this form excluded; PLAN.yaml, CUSTODIAN-QUEUE.* and site/ change in the custodian's done commit, not in this diff
Change: each clause the Findings section below names (F1 to F13) is rewritten in place to state what its ADR's own Status line and appended sections record at the worker's head; ADR-016 leaves the README paragraph's Proposed run; and an entry is added for each ADR F8 names, in docs/02 after its last entry (ADR-029's); every other byte of both files is unchanged
Tests+mutation: none, docs only; these checks exit 0 at the worker's head and again at the gate's: `npm run verify:adr-index` in frontends/shell; `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`; scripts/plan verify-cites.mjs, verify-quotes.mjs, verify-test-claims.mjs, verify.mjs, queue.mjs --check, site.mjs --check and forms-layout.mjs; `git diff --name-only origin/main...HEAD` lists exactly the two Scope files; `git diff -U0 origin/main...HEAD -- docs/README.md` holds one hunk, at line 27 only
Out-of-scope: ADR none (no file under docs/adr/ is edited, and no Status line, note or amendment is written; an index sentence states only what its ADR records); security none (README:27's ADR-009, ADR-020, ADR-021 and ADR-030 clauses, and docs/02's ADR-009, ADR-020 and ADR-021 bullets, stay byte-identical; ADR-030's new docs/02 entry carries only its number, title, status and date); wire none (ADR-035's new entries carry the same four facts only); guarantee none (so does ADR-018's new docs/02 entry; no contract changes) -- §21a's four categories are untouched, so the single reviewer gate applies; docs/02:80 beyond F4 is docs-02-adr-017-entry-current's; docs/02's two moved-path mentions are moved-path-mentions-outside-accepted-adrs's; docs/02:84's parenthesis is the human's words and is not touched; the generated table is not touched
```

## Findings (the drafting agent's words: what each corrected sentence must cover)

Named by the node:
- **F1 (A-S3, the index halves; ADR-026).**
  - Index lines: the ADR-026 clause of `docs/README.md:27 @ 1bc349ae2b77ec955138e2b40e32be5b7b0c8352`, and the "Still open" sentence of `docs/02_Architecture.md:91 @ 1bc349ae2b77ec955138e2b40e32be5b7b0c8352`.
  - Must cover: the `pasted` wording was settled on 2026-09-03.
  - Decided by: `docs/adr/ADR-026-crs-definition-supply-for-caller-assertion.md:110 @ 1bc349ae2b77ec955138e2b40e32be5b7b0c8352`, with :114 and :119.
  - ADR-026's Status line (:3-8) is unchanged, and the sentence must not say it was corrected; the human's Note (:150-154) dates it.
  - The sentence's dated "Stale-clause correction" in docs/02:91 stays byte-identical.
- **F2 (A-S5, the index halves; ADR-023).**
  - Index lines: the ADR-023 clause of `docs/README.md:27 @ 1bc349ae2b77ec955138e2b40e32be5b7b0c8352`, and `docs/02_Architecture.md:86 @ 1bc349ae2b77ec955138e2b40e32be5b7b0c8352`.
  - Must cover:
    - ADR-023 stays Proposed and binds nothing;
    - its decision text is drafted, and the file's Record line says the human accepted it as drafted, with two §2 amendments, on 2026-09-14;
    - the Status stays unchanged until B1's close;
    - an Amendment of 2026-09-29 is Proposed.
  - Decided by: `docs/adr/ADR-023-attribute-projection-on-viewport-query.md:3 @ 1bc349ae2b77ec955138e2b40e32be5b7b0c8352`, with :14, :26 and :163.
  - The sentence must not call ADR-023 accepted or binding.
- **F3 (A-S8, the README half).**
  - Index line: the ADR-017 corrigenda count in `docs/README.md:27 @ 1bc349ae2b77ec955138e2b40e32be5b7b0c8352`.
  - Must cover:
    - five corrigenda: 1 to 3, 4 (2026-08-07), and the corrigendum of 2026-09-07;
    - the Note of 2026-10-28.
  - Decided by: `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:672 @ 1bc349ae2b77ec955138e2b40e32be5b7b0c8352`, with :723, :750, :1044, :1144 and :1161.
  - The pointer duty comes from :667.
- **F4 (A-S8, the docs/02 half; see OPEN-2).**
  - Index line: the corrigenda count in `docs/02_Architecture.md:80 @ 1bc349ae2b77ec955138e2b40e32be5b7b0c8352`.
  - Must cover the count and the Note of 2026-10-28, and nothing else on :80.
  - Decided by the same ADR-017 lines as F3.
- **F5 (ADR-016 in the Proposed run).**
  - Index line: `docs/README.md:27 @ 1bc349ae2b77ec955138e2b40e32be5b7b0c8352`, where ADR-016's clause sits after "Proposed:".
  - Must cover: ADR-016 is accepted (2026-09-02) and architect-blockable, so its clause moves out of the Proposed run.
  - Decided by: `docs/adr/ADR-016-stable-feature-identity-admission.md:3 @ 1bc349ae2b77ec955138e2b40e32be5b7b0c8352`.
- **F6 (ADR-029).**
  - Index lines: the ADR-029 clause of `docs/README.md:27 @ 1bc349ae2b77ec955138e2b40e32be5b7b0c8352`, and `docs/02_Architecture.md:94 @ 1bc349ae2b77ec955138e2b40e32be5b7b0c8352`.
  - Must cover: ADR-029 stays Proposed and binds nothing; its decision was drafted on 2026-09-14 for the human's sight.
  - Decided by: `docs/adr/ADR-029-scan-progress-carrier-quantity.md:3 @ 1bc349ae2b77ec955138e2b40e32be5b7b0c8352`, with :64.
- **F7 (ADR-013).**
  - Index line: `docs/02_Architecture.md:77 @ 1bc349ae2b77ec955138e2b40e32be5b7b0c8352`.
  - Must cover:
    - ADR-013 was accepted on 2026-08-09 and is architect-blockable from acceptance;
    - the "must be accepted before digitizing" sentence no longer describes a pending acceptance (the deadline at :5 is on resolving the question);
    - Amendment 1 (2026-09-23, Accepted) and the Note of 2026-11-05 exist.
  - Decided by: `docs/adr/ADR-013-typed-coordinate-spaces-and-provenance.md:3 @ 1bc349ae2b77ec955138e2b40e32be5b7b0c8352`, with :5, :265 and :330.
- **F8 (the absent ADRs).**
  - Missing from README:27: ADR-033 to ADR-036.
  - Missing from docs/02: ADR-018, ADR-030 and ADR-032 to ADR-036.
  - Each new entry carries the ADR's number, its title (from its H1), its status and date from its own Status line, and "architect-blockable" only where that line says so.
  - Status lines: `docs/adr/ADR-018-what-cancellation-acknowledged-means.md:3 @ 1bc349ae2b77ec955138e2b40e32be5b7b0c8352`; `docs/adr/ADR-030-conveyed-artifact-notice-set.md:3 @ 1bc349ae2b77ec955138e2b40e32be5b7b0c8352`; `docs/adr/ADR-032-geoparquet-source-declaring-a-non-x-first-axis-order.md:5 @ 1bc349ae2b77ec955138e2b40e32be5b7b0c8352`; `docs/adr/ADR-033-connection-lease-classes-for-admission-work.md:3 @ 1bc349ae2b77ec955138e2b40e32be5b7b0c8352`; `docs/adr/ADR-034-geometry-type-admission-and-geoarrow-encoding-selection.md:3 @ 1bc349ae2b77ec955138e2b40e32be5b7b0c8352`; `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:3 @ 1bc349ae2b77ec955138e2b40e32be5b7b0c8352`; `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:3 @ 1bc349ae2b77ec955138e2b40e32be5b7b0c8352`.

Under "brought current" (see OPEN-1):
- **F9 (ADR-017's condition, the README half).**
  - Index line: the acceptance-condition clause of `docs/README.md:27 @ 1bc349ae2b77ec955138e2b40e32be5b7b0c8352`.
  - Must cover: the condition was discharged for the shell's UI surface on 2026-08-17; `publish-bundle` stays developer/test tooling as a CLI; SKP, MCP, plugin, notebook and AI exposure each still need their own review.
  - Decided by: ADR-017:1110 and :1134-1141 @ 1bc349ae2b77ec955138e2b40e32be5b7b0c8352.
- **F10 (ADR-022).**
  - Index lines: the ADR-022 clause of `docs/README.md:27 @ 1bc349ae2b77ec955138e2b40e32be5b7b0c8352`, and the ephemeral-state clause of `docs/02_Architecture.md:85 @ 1bc349ae2b77ec955138e2b40e32be5b7b0c8352`.
  - Must cover: Amendment 1 (2026-10-14, the human) grants style persistence for the session history, and for that store only.
  - Decided by: `docs/adr/ADR-022-style-v0-as-the-single-style-model.md:73-78 @ 1bc349ae2b77ec955138e2b40e32be5b7b0c8352`.
  - See OPEN-5 for the clause that must survive 1c's merge.
- **F11 (ADR-028, finding 3).**
  - Index lines: the binding-debt clause of `docs/README.md:27 @ 1bc349ae2b77ec955138e2b40e32be5b7b0c8352`, and the finding-3 clause of `docs/02_Architecture.md:93 @ 1bc349ae2b77ec955138e2b40e32be5b7b0c8352`.
  - Must cover:
    - finding 3 is no longer an open item: it was declared by Amendment 1 (2026-09-03, Accepted) and withdrawn by Amendment 3 on its own reopen condition;
    - Amendment 2 discharges the 1b principle-7/8 debt;
    - whatever the worker reads at its head about the pan-west and zoom-to-layer debts.
  - Decided by: `docs/adr/ADR-028-viewport-bounded-residency-over-budget-contract.md:329 @ 1bc349ae2b77ec955138e2b40e32be5b7b0c8352`, with :375, :431 and :520.
- **F12 (ADR-015).**
  - Index line: the "refusal when a file declares no CRS" clause of `docs/02_Architecture.md:78 @ 1bc349ae2b77ec955138e2b40e32be5b7b0c8352`.
  - Must cover: Amendment 1 (2026-09-23, Accepted) admits an absent GeoParquet `crs` key under the format's own rule; an explicit null is still refused.
  - Decided by: `docs/adr/ADR-015-source-crs-requirement-and-caller-assertion.md:155 @ 1bc349ae2b77ec955138e2b40e32be5b7b0c8352`, with :173-178.
- **F13 (ADR-016's open items).**
  - Index line: the "composite/non-integer keys (items 2/3)" clause of `docs/02_Architecture.md:79 @ 1bc349ae2b77ec955138e2b40e32be5b7b0c8352`.
  - Must cover: item 2 is stability across reopen and item 3 is composite and non-integer keys; both are open.
  - Decided by: ADR-016:3-8, :171 and :178 @ 1bc349ae2b77ec955138e2b40e32be5b7b0c8352.

## Held unchanged

1. Every file under `docs/adr/`, `docs/01_Principles.md`, and `docs/README.md` outside line 27, including the generated table between the `adr-index` markers.
2. Within README:27, every clause no finding names stays byte for byte. That includes:
   - its dated corrections (the ADR-009, ADR-020, ADR-025 and ADR-030 ones);
   - its `docs/02:81` cite;
   - its ADR-020 sentence.
3. In docs/02, every line no finding names stays byte for byte. In particular:
   - :80 beyond F4;
   - :81 and its dated correction;
   - :83 and :88, which hold the moved-path mentions;
   - :84, whose parenthesis is the human's words.
4. Line positions:
   - In docs/02, no line is inserted, deleted, split or joined above line 84, and none between lines 90 and 91.
   - In README, nothing is inserted above line 27, and the paragraph stays one line.
   - The reason: README:27 cites docs/02:81; accepted ADR-020 cites `docs/02_Architecture.md:83` and `docs/README.md:27` (ADR-020:602-603 @ 1bc349ae2b77ec955138e2b40e32be5b7b0c8352); and docs/02:91 points to the line above it. verify-cites catches none of these drifts.
5. No ADR words are put in quotation marks unless they are byte-copied.

## Amendments

Opens empty, append-only.
```

---

## 2. Notes

**Step 1, each finding's place.** The spans below are copied from my Read output, not by script, so re-check them by script before relying on them. Every named finding holds at main, and none had already been fixed.

- **F1:**
  - README:27 reads: "the `pasted`-vs-`not-in-catalog` provenance-string wording stays open, queued separately)."
  - docs/02:91 reads: "**Still open, not settled by this acceptance:** the ADR's own "Architect note for acceptance" section flags the `pasted`-vs-`not-in-catalog` provenance-string wording as the human's own call, queued separately."
- **F2:**
  - README:27 reads: "**ADR-023** (attribute projection on `viewport_query` — Proposed with its decision **deliberately open**, filed as the named home for the categorical/live-attributes deferral; no implementation licensed)."
  - docs/02:86 reads: "- **ADR-023 (proposed — decision deliberately open)** —"
- **F3:** README:27 reads: "**three corrigenda appended**"
- **F4:** docs/02:80 reads: "**Three corrigenda are appended** and must be read with it"
- **F5:** README:27 reads: "**Proposed: ADR-011**" and, later in the same run: "**ADR-016** (stable feature identity admission and source-key mapping — **accepted 2026-09-02, architect-blockable**;"
- **F6:**
  - README:27 reads: "**ADR-029** (the scan-progress carrier quantity — Proposed, decision deliberately undrafted;"
  - docs/02:94 reads: "- **ADR-029 (proposed — decision deliberately undrafted)** —"
- **F7:** docs/02:77, the whole line: "- **ADR-013 (proposed)** — Typed coordinate spaces and provenance: the vehicle ADR-010's OPEN block names. **Must be accepted before the editing plugin's digitizing path is built**, per that block's own deadline."
- **F8:** Grep shows ADR-033 to ADR-036 in docs/README.md only at :70-73, the generated rows. In docs/02, Grep for ADR-014, ADR-018 and ADR-03x matches only ADR-014 at :81.
- **F9:** README:27 reads: "and no later than Prototype exit — `publish-bundle` is developer/test tooling until then;"
- **F10:**
  - README:27 reads: "ephemeral-only, no undo, persistence triggers class-2 + docs/11 in the same commit;"
  - docs/02:85 reads: "a session-scoped style is ephemeral view state (no undo; persisting one triggers ADR-006 class-2 + docs/11 obligations in the same commit — not granted)."
- **F11:**
  - README:27 reads: "and a second undeclared viewport-eviction exception found by architect consult, a named open item due at the debt slice's own 1b;"
  - docs/02:93 reads: "plus finding 3 (a second, undeclared viewport-eviction exception found by architect consult, a named open item whose resolution is due at the debt slice's own 1b)."
- **F12:** docs/02:78 reads: "refusal when a file declares no CRS"
- **F13:** docs/02:79 reads: "composite/non-integer keys (items 2/3) remain open."

Two of the platform-only items are not this node's:
- README:48, ADR-009's generated cell: the human's ruling of 2026-11-05, item 3, closed it on adr-notes-stale-statements-and-indices.
- ADR-022's Amendment 2: it is on 1c's branch, not a defect, and belongs to that node.

**Step 2, whose words.**
- No sentence in Scope is red-line text. Scope holds no ADR Status line, note or amendment, because nothing under docs/adr/ is touched.
- Describing an ADR's status in these two indices is the worker's to write, not a red line, for these reasons:
  - The red line in `governance/AI_DEVELOPMENT.md:451 @ 1bc349ae2b77ec955138e2b40e32be5b7b0c8352` is "ADR statuses and amendments": the status itself, which this piece does not change.
  - ADR-017:667 calls the indices "the mutable indices".
  - AUTONOMY §22 makes accepted ADRs immutable and current-state summaries editable in place.
  - The human's 2026-11-05 ruling, item 3, treats the generated row as a copy of a Status line by design.
  - The precedent adr-032-staleness-docs rewrote README:27's ADR-032 clause under a single reviewer gate, and that gate passed (its Amendment 1).
- PLAN's "none of it the human's words" is your grading, not a ruling.
- The limit on that: a sentence may state only what its ADR file records. A sentence that would need a status the ADR does not carry is outside Scope and stops the work.
- Text in the two files that is the human's, or may be:
  - docs/02:84's parenthesis is the human's words (`state/directives/2026-11-06-8e-words-replaced-u1-h1-h2-class-8-m10-kl-c1-c3-draft-marks-u12-mark-n1-n3-slot-2-order-clippy-placed-288-clicked.md:11 @ 1bc349ae2b77ec955138e2b40e32be5b7b0c8352`). It is held unchanged.
  - I could not trace who wrote the indices' dated corrections. Grep finds their text only in the two docs. They are held byte-identical.
  - `frontends/shell/scripts/adrIndex.mjs:16-17 @ 1bc349ae2b77ec955138e2b40e32be5b7b0c8352` calls README:27 "human-written". I read that as "not generated", not as "the human's words".
- Under the wording-block rules, the gate's replacement words for these sentences are applied with no re-gate, and Part 1 item 2's WORDS-ONLY pass is available. Neither applies to :84.

**Step 3, the route.**
- 2 files.
- README:27 is one line of about 9,700 characters, so rewriting it counts as 2 changed lines (one deleted, one inserted).
- docs/02:
  - Named findings only: 5 replaced lines (:77, :80, :86, :91, :94) and 7 inserted, which is 17 lines.
  - With OPEN-1 (A) and OPEN-2 (B): 9 replaced lines (also :78, :79, :85, :93) and 7 inserted, which is 25 lines.
- Total, the smallest true reading: 19 lines on the named findings, 27 with F9 to F13. I declared ≤ 30.
- That is under §21c's 150 lines and 8 files, with no new dependency, exposure surface or user-visible behaviour.
- With OPEN-4 (A), no §21a category is touched, so §25(e) allows the five-line form.
- The line count understates the review load. The gate reads one 9.7k-character line clause by clause.

**Step 4, the change, file by file.**
- `docs/README.md`, line 27 only: F1, F2, F3, F5, F6, F9, F10 and F11, plus F8's ADR-033 to ADR-036.
- `docs/02_Architecture.md`: F1, F2, F4, F6, F7, F10, F11, F12 and F13 replaced line for line, and F8's seven entries appended after :94.
- I propose no words. The worker writes them from the ADRs at its head.

**Step 5, verification.**
- The worker runs the checks in the form's Tests line.
- How the worker shows the generated table did not change:
  - `npm run verify:adr-index` is a byte comparison of the committed block against the block rendered from every ADR (adrIndex.mjs:286-295 @ 1bc349ae2b77ec955138e2b40e32be5b7b0c8352). It imports only Node built-ins, so it needs no install. With the ADRs untouched, it passing means the block is unchanged.
  - `git diff -U0` shows a single `@@ -27 +27 @@` hunk.
- The gate re-runs all of this at the reviewed head. It reads each changed clause against the ADR line its finding names (Part 1 item 1). It checks the Out-of-scope line first (§21d). It confirms :81, :83, :84 and :91's "line above" by reading, because verify-cites does not check them:
  - it excludes `docs/02:NN` as the cite-by-number convention (verify-cites.mjs:77-78 @ 1bc349ae2b77ec955138e2b40e32be5b7b0c8352);
  - it does not catch a cite whose line moved but stayed in range (its header).
- Part 1 item 3 (a correction is checked as new work) applies to any correction as the full suite at the new head. Its mutation step is moot, because the piece adds no test.

**Step 6, what must not change:** the form's "Held unchanged" list. New to the brief, from my reading: the line-position constraint. Accepted, immutable ADR-020:602-603 cites `docs/02_Architecture.md:83` and `docs/README.md:27`. Inserting ADR-018's entry in number order, between :80 and :82, would move ADR-020's bullet off :83. So new entries go after :94.

**The docs/02 lines each node claims:**

| docs/02 line | This node | docs-02-adr-017-entry-current | moved-path-mentions-outside-accepted-adrs |
|---|---|---|---|
| :77, :78, :79, :85, :86, :91, :93, :94 | yes (:78, :79, :85, :93 under OPEN-1) | no | no |
| :80 | the count and the 2026-10-28 note (F4) | the whole entry, every appended section | no |
| :83 (ADR-020) | no | no | its `DECISIONS-PENDING.md` mention |
| :88 (ADR-024) | no | no | its `DECISIONS-PENDING.md` mention |
| after :94 | 7 inserted entries | no | no |

The only overlap is :80. Rule (00) holds the three nodes to one at a time on the file either way. docs/02:84 is the human's ruled text and belongs to no node.

---

## 3. OPEN items

**OPEN-1. F9 to F13, found by my reading and in no audit.**
- (A) In Scope, as the brief states the Scope: "brought current against each ADR's own Status line and appended sections". None of the five is any other node's.
- (B) Named findings only, with F9 to F13 sent to a new proposed node. This drops findings from the Scope as stated, so it is a red line and the human's.
- Recommendation: (A). I read it as not a red line. If you read the PLAN summary's list as the whole Scope, (A) becomes an addition and goes to the human.

**OPEN-2. docs/02:80.**
- (A) This node leaves :80 entirely to docs-02-adr-017-entry-current. That drops A-S8's docs/02 half from this node's title, so it is the human's.
- (B) This node changes only the count and the 2026-10-28 note (F4). The rest of :80 follows in docs-02-adr-017-entry-current, in the order the human ruled on 2026-11-06 (after adr-029-stale-line-cites). This follows both nodes' titles literally and changes neither node's scope.
- (C) docs-02-adr-017-entry-current folds into this node. That changes the scope and the ruled order of a ruled node, so it is the human's.
- Recommendation: (B), not a red line.

**OPEN-3. docs/02:83 and :88, the moved-path mentions.**
- (A) They follow, in their own node, which is still proposed and unplaced.
- (B) They ride in this piece. That adds a finding from another node, so it is the human's.
- Recommendation: (A).

**OPEN-4. How much the new entries say.**
- (A) Number, title, status, date and blockability only, in both files.
- (B) Summaries in the style of the neighbouring entries.
- Under (B), ADR-018 (a cancellation guarantee), ADR-030 (licensing) and ADR-035 (a wire event) would bring §21a categories and red-line-adjacent text into the piece.
- Recommendation: (A). It keeps the five-line route true. Not a red line.

**OPEN-5. ADR-022 against 1c, which adds ADR-022's Amendment 2 on its branch.**
- (A) The sentence states what Amendment 1 grants and adds no "not granted elsewhere" clause, so it stays true when 1c merges.
- (B) Hold ADR-022's clauses until 1c merges. That drops F10, so it is the human's.
- (C) Write "a project file is not granted". That is true at main, and could turn false at 1c's merge.
- Recommendation: (A). The same rule applies to ADR-036's new entry: status only.

**OPEN-6. How the corrections are written.**
- (A) In place, with no marker: the adr-032-staleness-docs precedent, and AUTONOMY §22's rule that a summary is edited in place with git history as the record.
- (B) In place, with a dated parenthesis: the shape the human used for docs/02:84.
- (C) The old text retained, with a dated correction appended: the shape of docs/02:81 and :91.
- Existing dated corrections stay byte-identical under all three.
- Recommendation: (A), not a red line.

---

## 4. What I could not settle

- No sha256 for any span or file, and no confirmation of HEAD.
- PLAN.yaml at 1bc349ae as committed, because the working tree carries your staged edits.
- Whether any of the indices' dated corrections is the human's typed words. Grep finds no source outside the two docs.
- What ADR-028's pan-west and zoom-to-layer debts read as now. I read only Amendment 2's heading. The worker reads them at its head.
- What 1c's branch does to ADR-022's and ADR-036's Status lines, and what 8g's note does to ADR-016. I cannot read branches. The worker describes them at its head.
- Whether F13's mislabel counts as untrue or only as loose. I listed it. The gate decides it against ADR-016:171 and :178.

Files read:
- `C:/dev/spatial-ide/governance/PLAN.yaml` (the five nodes)
- `C:/dev/spatial-ide/state/consults/2026-11-05-docs-audit-tasks-a-b-triage-architect.md`
- the two 2026-11-05 directives and the two 2026-11-06 directives named above
- `C:/dev/spatial-ide/docs/README.md`
- `C:/dev/spatial-ide/docs/02_Architecture.md` (:55-95)
- `C:/dev/spatial-ide/docs/PREREGISTRATION-TEMPLATE.md`
- `C:/dev/spatial-ide/governance/AUTONOMY.md` (§21 to §22, §25, §36, the (00) item)
- `C:/dev/spatial-ide/governance/AI_DEVELOPMENT.md` (:440-464)
- `C:/dev/spatial-ide/governance/README.md` (:17-26)
- `C:/dev/spatial-ide/governance/MOVED.tsv` (Grep)
- `C:/dev/spatial-ide/governance/forms/scripts/ADR-032-STALENESS-DOCS-PREREGISTRATION.md`
- `C:/dev/spatial-ide/frontends/shell/scripts/adrIndex.mjs` (header, Grep)
- `C:/dev/spatial-ide/frontends/shell/package.json` (Grep)
- `C:/dev/spatial-ide/scripts/plan/verify-cites.mjs` (:1-80)
- `C:/dev/spatial-ide/scripts/plan/forms-layout.mjs` and `docsOnly.mjs` (Grep)
- `C:/dev/spatial-ide/.github/workflows/governance-ci.yml` (Grep)
- ADR-013, 015, 016, 017, 020, 022, 023, 024, 026, 028 and 030 (the spans cited), and every ADR's Status line and appended-section headings (Grep)

I did not read the two audits whole. I relied on the triage's line-tagged readings of them.
