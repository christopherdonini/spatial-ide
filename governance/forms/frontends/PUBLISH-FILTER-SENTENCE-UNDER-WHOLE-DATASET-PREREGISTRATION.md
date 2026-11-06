# shell: the publish filter-scope sentence and the Whole dataset scope — five-line short form (`AUTONOMY.md` §21d)

*Committed before any code. Append-only once committed; an amendment written after any run of this piece's tests or mutations has been seen says so in its first line. PLAN node publish-filter-sentence-under-whole-dataset (U12, S2), placed in slot 2 on a five-line form by the human's ruling of 2026-11-05 (evening), item 2 (`state/directives/2026-11-05-8c-full-form-nine-s2-placed-u12-slot-2-u1-reproducer-adr-notes-words-e2e-readme-words-8b-d3.md`). The five lines, the notes, the OPEN items, the reuse index and what is not settled are the architect's draft (`state/consults/2026-11-05-publish-filter-sentence-under-whole-dataset-five-line-form-architect-draft.md`, read only at main 8b9193a1; extracted sha256 265150ffe1d96b88b7c0b735f26ccec52186cd160b5ade101308f1bc090789ea), carried byte for byte with these changes, all the custodian's: each cite the draft writes `path:line @ 8b9193a1…` is expanded by script to `path:line @ <commit> sha256:<the lines with their LFs>` (14 pins; 2 by a file name that resolves to one tracked path at that commit; 1 by a file name that resolves to more than one, kept as written; bare line numbers and cites written `@ main` kept as written, `main` there meaning 8b9193a1); this title and lead line added; the draft's opening paragraphs and its closing path list dropped; the custodian's settlement added. Form path: `governance/forms/frontends/PUBLISH-FILTER-SENTENCE-UNDER-WHOLE-DATASET-PREREGISTRATION.md`. The custodian keeps the PLAN node on main.*

## The five lines (mine)

```
Authority: PLAN node `publish-filter-sentence-under-whole-dataset` (governance/PLAN.yaml:6651-6667 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:55dc68a4bbd940cc37da63f06330bbc2260cc48acbb6b2092278c979406105c5), generation 1, S2; placed in slot 2 on a five-line form by the human's ruling of 2026-11-05 (evening), item 2 (state/directives/2026-11-05-8c-full-form-nine-s2-placed-u12-slot-2-u1-reproducer-adr-notes-words-e2e-readme-words-8b-d3.md:13 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:e95675531fb3fead86a8072451701f6134787e1c70d90ed93773acbee1fb70b6), the ground that sets aside, for this piece, round 25, item 2 (e) (governance/AUTONOMY.md:482 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:4f388e9f3fe7a1d68117edb03f7c2520ce771901a96feff1752f426befe4c669) and section 21c's fourth bound (governance/AUTONOMY.md:350-351 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:ab244b928ccaaaddf7cee273363bc2481ad0e53cd6aa97d1e57fe8f7eefcd333); the defect as triaged, U12 (state/consults/2026-11-05-area-e-kl-triage-undeclared-behaviours-architect.md:117-126 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:5edd940669378a70b11263bce5c8b421cd9fc94939c1a95b21b0cbac77031290); the human's gate-round rulings, Part 1, items 1 to 9, by reference (state/directives/2026-11-05-main-architect-gate-rounds-part-1-rulings-review-packet-design-part-3-additions.md:28-64 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:b7b9954b95c6a23808cc8a2fbacb8b6157335e23da53ccda20f4a35ba8e05e8a); gating: the reviewer and the architect from dispatch (OPEN-1); the reuse index found no prior art on either search (publish dialog filter scope sentence; export scope whole dataset viewport), a miss noted here.
Scope: 8 files: frontends/shell/src-tauri/src/publish.rs, frontends/shell/src/publish/types.ts, frontends/shell/src/publish/PublishPanel.tsx, frontends/shell/src/publish/PublishPanel.test.ts, frontends/shell/e2e/publish.mjs, frontends/shell/e2e/README.md (the FILTERED' passage of publish.mjs's entry only), KNOWN-LIMITATIONS.md (item 8 and its source comment only), frontends/shell/MANUAL-WALKTHROUGH.md (Part G's G8 row and the FILTERED' row of the e2e/publish.mjs coverage table only); declared line budget 150, insertions plus deletions over all eight files, docs and comments counted (governance/AUTONOMY.md:357 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:367596df34a73d122765d000ba5df601dbe54da9e5a6aefca966747809a44fec); this form exempt; commands.rs, PublishDialog.tsx, PublishDialog.test.ts, client.ts, App.tsx and e2e/export-view.mjs are read, not changed; no other file changes.
Change: the approval payload's `filter_scope` carries `FILTER_SCOPE_SENTENCE` only when a filter is active and the scope is `ViewportBbox`, decided from the `PublishScope` in `prepare_with_progress` beside `row_scope_sentence` and handed to `prepare_with_query` in place of its `filter_active` bool (frontends/shell/src-tauri/src/publish.rs:404-405, :443-456, :518-531, :635 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a), and the panel shows its echo only when `filterActive` holds and the scope choice is `"current"` (frontends/shell/src/publish/PublishPanel.tsx:693 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:cef24920c6ae7d8f6a8d9a1f5a18494a706bf632408c10ad584a70d46ee7fbfe), so under Whole dataset neither the dialog nor the panel shows it; the string becomes a P6 placeholder, `[P6 placeholder] ` prefixed to both copies (publish.rs:73-75, frontends/shell/src/publish/types.ts:126-128 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:3c8a5d3511d21c34405652c33a282b8c61963e8e3ea25ece4aac6e0eb0b71db7) with every following byte unchanged (OPEN-4); FILTERED' asserts `filter_scope` null under whole-file with the filter on and drops its now-unused copy; the sentences that describe the old behaviour (note 4) are rewritten from the built code.
Tests+mutation: in publish.rs's tests, through `prepare` (which delegates to the shipped `prepare_with_progress`): `the_whole_dataset_scope_carries_no_filter_scope_sentence_with_or_without_a_filter` replaces `the_filter_scope_sentence_is_present_only_when_filter_active_is_true` (publish.rs:2001-2046 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a), is written first and observed failing by name on the unfixed code (the node's owed reproducer), M-1 the condition back to the filter flag alone, predicted to fail at the filter-on assertion; `the_current_view_scope_carries_the_filter_scope_sentence_only_with_a_filter_active`, M-2 the condition's scope arm matching `WholeFile` instead of `ViewportBbox`, predicted to fail at the filter-on assertion; in PublishPanel.test.ts's "the rendered publish controls (MF3)" block, over `PublishControls` (frontends/shell/src/publish/PublishPanel.test.ts:409-425 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:7b3b42cbe79d606664cf40a3eb3f4d08f333526749b18c1d6536c3c24c357f83): "Whole dataset with a filter on shows no filter sentence (U12)", M-3 the panel's condition back to `filterActive` alone; "Current view shows the filter sentence with a filter on and not with it off", M-4 the panel's condition without `filterActive`, predicted to fail at the filter-off case; the pin test (PublishPanel.test.ts:222-240 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:6c3bc4375824be5033ff8149c01edfc40c3c732d76701a8e99c9d31b3e809896) unchanged and passing over the two prefixed copies; FILTERED' changed, run once unmutated at the head on Windows inside `hold shared -Project SpatialIDE`, its mutation observed only through M-1 in the unit test, never in the e2e, and the record says so; each of M-1 to M-4 applied, its test run, its failure recorded by name with the 40-hex commit it was observed at in a `RECORDED MUTATION:` line, then reverted; a verify-mutation run is not an observation; a mutation that passes, or fails anywhere else, is a stop; no sleep, retry or timeout in any committed test, and the e2e adds no wait of its own; on CI the Rust tests run in product-ci-shell.yml's `cargo test --manifest-path frontends/shell/src-tauri/Cargo.toml --locked` and the vitest tests in its `npm run verify` (.github/workflows/product-ci-shell.yml:212, :217 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a), windows-latest; the e2e does not run on CI.
Out-of-scope: ADR: no status line or amendment (ADR-017 §8, which the string names, unchanged); security: nothing ADR-020, ADR-009 or ADR-021 governs, no exposure surface, no dependency, the class-3 approval (grant, typed phrase, audit pair) unchanged; wire: no SKP, data-plane or MCP surface, nothing under protocol/; the binding-local `binding_publish_prepare` keeps its arguments (frontends/shell/src-tauri/src/commands.rs:259-265 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:c92545406e277645d1f7ff167a2da06118816a9fc796443a20d2b77ba13316ca) and `PublishPromptData` keeps its fields and types, and only the cases in which `filter_scope` is non-null change; guarantee: TOUCHED under section 21a's fourth category as written (governance/AUTONOMY.md:325-327 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:8a15c806777af23d1ccc4e1ea6d14ce595d679714544814504cea18715b4dfd7), because a property now under test changes: publish.rs:2001-2046 and e2e/publish.mjs:483-487 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:a3c12e543ed16203f1f66c4b6f462ea211cd193236a720ca7e3b06e5e45c436c assert the sentence under Whole dataset with a filter on; P0's guarantee, no filter in the published rows, is unchanged and FILTERED' keeps asserting it; the five-line form stands on the human's item 2, which sets round 25, item 2 (e) aside.
```

---

## Notes (mine)

**1. The route.**
- **§21a.**
  - ADR: not touched.
  - Security: not touched.
  - Wire: not touched. The payload is binding-local, not SKP (publish.rs:91-93 @ main).
  - Guarantee or invariant: **touched** as written (AUTONOMY.md:325-327). "Any property currently under test" covers two places that assert the sentence under Whole dataset with a filter on: the Rust test (publish.rs:2029-2045) and e2e FILTERED' (e2e/publish.mjs:475-487).
  - The doc comment's "never silently dropped" (publish.rs:274-275) is a stated property, and it is narrowed.
  - On round 25, item 2 (e) (AUTONOMY.md:482; template :176) alone, this would close the five-line form, as 8c's drafter closed 8c's.
- **§21c's four bounds** (AUTONOMY.md:350-351):
  - Lines: about 125 to 140 by my estimate (unmeasured, mine). Declared 150.
  - Files: exactly 8.
  - No new exposure surface and no new dependency: both hold.
  - No new user-visible behaviour: **crossed**. The sentence disappears under Whole dataset, and the mark is new visible text.
- **The ground.** The human's item 2 (directive :13) rules a five-line form for this change. It is the ground for the (e) category and for the fourth bound, cited the way 6d's form cited its ruling and §36 (governance/forms/kernel/FIXTURE-S-REGENERATION-ENTRY-POINT-PREREGISTRATION.md:6, :10 @ main; state/FILLER-QUEUE.md:18 @ main).
- **What item 2 does not set aside.** It names no number, so the line and file bounds stand as declared. An overrun is class 6, with the `Scope` line not edited (template :125-131).
- **The `Out-of-scope` line.** It names the touched category honestly instead of asserting none. A line that said "guarantee: none" would be false, and a false line is block-on-sight (AUTONOMY.md:373-375).

**2. Where the condition goes: both, for different reasons.**
- **The payload (publish.rs).** This is what the operator approves. `PublishDialog.tsx:264-268` renders `prompt.filter_scope` and nothing else, so the dialog cannot differ from the payload.
  - Decide it from `PublishScope`, as a private method beside `row_scope_sentence` (publish.rs:125-136). `row_scope` and `filter_scope` then come from one value in one payload.
  - `prepare_with_query` takes the resulting `Option<String>` instead of the bool. Its two direct test callers (publish.rs:1973, :2302) pass `None`.
  - No new `pub` item. The product caller is `prepare_with_progress`, which the shipped command uses (commands.rs).
- **The panel (PublishPanel.tsx:693).** It shows its echo before any host round trip and has no payload to read (types.ts:115-125), so it needs the same condition on its own `scope` state.
  - Panel and payload agree whenever a prompt exists: `"current"` resolves to `viewport-bbox`, or else to null, which refuses before any prompt (PublishPanel.tsx:410-422).
  - Two named cases, neither blocking:
    - The dev-only e2e hook's `scopeOverride` can prepare a scope other than the radio's (PublishPanel.tsx:572-577).
    - Flipping the radio while a dialog is open changes the panel's echo but not that dialog's payload. The dialog still states its own attempt correctly.
- **Seam read.** The consumer is `types.ts:38` (`string | null`) rendered at `PublishDialog.tsx:264`. Neither changes.

**3. The text as a P6 placeholder.**
- **My reading of the ruling.** The house form for a shown placeholder is a visible `[P6 placeholder] ` prefix, explained by the source comment. Examples:
  - `PublishPanel.tsx:44` and `:664`;
  - `engine/src/predicate.rs:1449` (8b's W-1);
  - the sitting draft's D6, which treats unmarked placeholders as a gap (state/consults/2026-10-23-operator-sitting-queue-p6-strings-and-verdicts-architect.md:379 @ main).
- **What stays byte-identical.** Every byte after the prefix, in both copies. The rendered current text is `this bundle format cannot record a row predicate (ADR-017 §8, bundle_version 1); publishing publishes the viewport extent, not your filter`, joined from types.ts:127-128.
- **The pin test** (PublishPanel.test.ts:222-240) needs no change. Its regex captures the literal and the prefix holds no quote, so it keeps both copies equal.
- **No new word is shown beyond the mark.** Under Whole dataset nothing replaces the sentence.
- **A consequence the human will see, not a finding.** With a filter on under Whole dataset, the only thing that tells the operator the filter is not applied is the Row scope sentence, `row scope: the whole file — every row the dataset contains` (publish.rs:128).
- **The comments' claim.** The comments call the text verbatim from `NEXT-CUT.md`'s conditional block (publish.rs:71-72; types.ts:116; e2e/publish.mjs:63-65). That block is not in `state/NEXT-CUT.md` at main (its only "predicate" hit is :133) or in `state/cut-archive/`. I could not read it, so whether the words are the human's is unsettled. With the mark they are a placeholder either way.

**4. Where the sentences about behaviour go.** Under Part 1, item 1 (Part 1 directive :28-32) these are written after the code. The form gives places, not words. Each sentence must cover:
- the condition (a filter active and the scope Current view);
- the mark;
- that P0's guarantee is unchanged.

The places:
- publish.rs: `FILTER_SCOPE_SENTENCE`'s doc (:71-72), `filter_scope`'s field doc (:274-275) and the new method's doc;
- types.ts: :35-37 and :115-125;
- e2e/publish.mjs: :63-68 (the constant and its "third, end-to-end pin" comment are removed, because nothing uses them after the flip) and the FILTERED' header at :458-464;
- e2e/README.md: :216-221;
- MANUAL-WALKTHROUGH.md: G8 (:333, "either scope option", which becomes untrue) and the FILTERED' coverage row (:395, "present, verbatim, when a filter is active", which becomes untrue);
- KNOWN-LIMITATIONS.md: item 8 (OPEN-2).

These stay true and do not change:
- G1 and G3's "that is G8" (:326, :328), provided G8 uses Current view;
- commands.rs:259-265;
- client.ts:79;
- publish.rs:1000.

The result logs (MANUAL-WALKTHROUGH.md:1083, :1115, :1121) and RELEASE-0.1.md:1190 are history and are not edited.

**5. Tests at real boundaries (Part 1, item 7, directive :58-62).**
- The Rust tests go through `prepare`, which delegates to the shipped `prepare_with_progress` (publish.rs:478-508).
- The vitest tests render the panel's real body, `PublishControls`.
- The host-to-dialog boundary keeps FILTERED' as its integration test.
- The two Rust tests may share a test-local helper that calls `prepare`; that is not a product item.
- **Stop:** if `prepare` over the 20-row fixture refuses a `ViewportBbox` scope, the worker stops and reports, with no other route. No test at main prepares a bbox scope (the only bbox scope in the tests is at publish.rs:1671, and it does not prepare).
- I renamed the old test because its name becomes untrue. The only other place that names it is the sitting draft (state/consults/2026-11-03-sitting-wording-n1-to-n7-pieces-architect-draft.md:30 @ main), which is not a done node.

**6. Rule (00), path by path, against the in-flight list.**
- publish.rs, types.ts, PublishPanel.tsx, PublishPanel.test.ts and e2e/publish.mjs: clear. port-2 and b2-1c touch nothing under frontends/, b1-shell-half-pr-c has 0 files, and 8c is engine only.
- e2e/README.md, the FILTERED' passage of publish.mjs's entry: clear. The docs lane's `e2e-readme-security-posture-measure-build` (4 of 7, not in flight) edits the security-posture paragraph, which is a separate entry. Recheck at dispatch.
- KNOWN-LIMITATIONS.md item 8: clear. port-2 edits the platforms paragraph and item 43. The docs lane's KL piece is blocked and excludes U12 (PLAN.yaml:6479 @ main).
- MANUAL-WALKTHROUGH.md, Part G's G8 and the "What `e2e/publish.mjs` covers" table (sections :309-339 and :377-401): clear by the per-Part count.
  - `walkthrough-rows-stale-against-main-sweep-area-b` names Parts A, B, F, H, J, L and N and the regression and filter-panel coverage tables (:55, :103) (PLAN.yaml:6700 @ main).
  - Its form is not drafted yet, so recheck against its `Scope` when it is committed.
- protocol/: none.
- **The owner's index:** no line is needed.
  - kernel/README.md:392 @ main lists `KNOWN-LIMITATIONS 5, 6, 8, …` as kernel-owned limits. Item 8 keeps its number and remains the bundle format's limit.
  - The shell has no owner's index; `shell-owners-index` is blocked (PLAN.yaml:4421-4435 @ main).

**7. Sequencing with the sitting (for the custodian; not mine to settle).** `sitting-wording-n1-to-n7` (blocked, PLAN.yaml:6116-6131 @ main), piece A's N1, targets this same string. Once this piece merges:
- N1's ground goes away: under Whole dataset the viewport clause is no longer shown.
- Its OPEN-3 (item 8 in piece A) is overtaken: this node owns item 8.
- Its OPEN-4's G8 moves here.
- Its OPEN-5, for N1, is answered by item 2 in my reading (OPEN-4 below).

(state/consults/2026-11-03-sitting-wording-n1-to-n7-pieces-architect-draft.md:222-233 @ main.)

**8. Constitution check: no violations.**
- 01 principle 8: the change removes a statement that is untrue in ordinary use.
- ADR-006: prepare stays pure, and class 3 and its approval are unchanged.
- docs/08: no performance claim.
- docs/02 and docs/10: binding-local only; MCP is not touched.
- docs/07: the change is inside the prototype slice.
- The seam rule: the consumer is read, and no option or `pub` item lands without a product caller.
- The owner rule: the sentence is the shell's, stated on the shell's own surface.

---

## OPEN items

**OPEN-1. Gates.**
- (A) The reviewer and the architect from dispatch.
- (B) A single reviewer gate (§21b).
- **Recommend (A).** §21b allows a single gate only when no §21a category is touched (AUTONOMY.md:336-337), and the guarantee category is touched as written. This is not a red line: the human ruled the form, and (A) only adds review.

**OPEN-2. KNOWN-LIMITATIONS item 8 (KNOWN-LIMITATIONS.md:105, its source comment :107).** **Red line:** it is release-facing, and the human's words of 2026-10-10.
- (a) In this PR. The worker writes the item's words from the built code, the gates check them clause by clause, and the human approves or replaces them at the click (Part 1, item 1, third bullet). The words must cover:
  - the filter is never published, under either scope (unchanged);
  - the dialog and the panel show the sentence only under Current view with a filter on;
  - under Whole dataset, the Row scope sentence is what states every row;
  - whether to quote a placeholder string at all, which is the human's call.

  The comment at :107 gains a dated revision note naming this piece. Its existing pins at 8e093734 and b391e436 stay as history and are authoritative as history.
- (b) Leave item 8 to sitting piece A. Item 8 would then state something about the dialog that the code no longer does, from the merge on. That is a Correctness finding under the proportional-gates paragraph, so (b) cannot pass the gate.
- (c) A separate follow-up node. Same defect as (b).
- **Recommend (a).** The words wait for the human. The route follows Part 1, item 1 and needs no further ruling.

**OPEN-3. An end-to-end proof of the case where the sentence is shown.**
- (A) Add two assertions to e2e/export-view.mjs: EV2 (no filter) expects `filter_scope` null, and EV4 (`zone = 'residential'` applied, then Current view prepared) expects the sentence (e2e/export-view.mjs:69-82, :108-110 @ main). That is a 9th file, which crosses §21c's file bound. Item 2 names no number, so this would need the human.
- (B) No e2e for the shown case in this piece. R2 proves the payload through the shipped prepare, the dialog's render of a non-null `filter_scope` is unchanged code, and FILTERED' stays the boundary's integration test (item 7, third bullet).
  - A Current-view prepare inside publish.mjs is not an option: that suite never waits for drawing, so it would need a new poll with a timeout.
- **Recommend (B).** (A) can be proposed later as its own S3 node. This is not a red line.

**OPEN-4. The mark.** **Red line** (a P6 string; it changes what the app shows).
- (A) A visible `[P6 placeholder] ` prefix on both copies, every following byte unchanged, and the source comments naming the human's item 2.
- (B) No visible mark. The string stays unchanged, and its placeholder status is recorded only in the comments and on the form, which is the PublishDialog TTL sentence's precedent (PublishDialog.tsx:10 @ main).
- **Recommend (A).** I read item 2's ruling as already deciding this as (A), so it is the human's ruling applied, not an item taken by recommendation. If the custodian does not share that reading, it waits for the human (back 2026-11-09).

---

## The reuse index (as given in the brief, byte for byte; the miss is noted in Authority)

```text
$ node tools/reuse.mjs publish dialog filter scope sentence   (exit 1)
No prior art recorded for "publish dialog filter scope sentence". Research it before planning an implementation.
$ node tools/reuse.mjs export scope whole dataset viewport   (exit 1)
No prior art recorded for "export scope whole dataset viewport". Research it before planning an implementation.
```

---

## What I could not settle

- **The sentence's named source.** I could not find `NEXT-CUT.md`'s conditional block, item 3, at main, and I cannot read history. So whether the words are the human's typed text is unsettled. The mark makes them a placeholder either way.
- **The viewport prepare.** Whether `prepare` over the 20-row fixture admits a `ViewportBbox` scope; the worker's stop in note 5 covers it.
- **The area-B sweep's final `Scope`.** Its form is not drafted.
- **The line count.** About 125 to 140 is my estimate, not a count.
- **No sha256 and no HEAD check:** I have no shell.

## The custodian's settlement (class 1, before any code)

- **OPEN-1: (A)**, the reviewer and the architect from dispatch, taken on 2026-11-05 (the direction of 2026-10-31, item 4, `state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md`, held until 2026-11-09 by `state/directives/2026-11-03-away-until-11-09-276-open-1-seven-clauses-open-4-c-placed-sitting-wording-leaves-slot-cloud-credit.md`, line 6); the human reviews each on return and may reverse it, a reversal recorded, never edited in.
- **OPEN-2: (a)**, by the human's Part 1, item 1 (`state/directives/2026-11-05-main-architect-gate-rounds-part-1-rulings-review-packet-design-part-3-additions.md`): item 8's words are written by the worker from the built code, checked clause by clause by both gates, and approved or replaced by the human at the click. Nothing about the words is taken under item 4 (a red line): the PR does not merge without the human.
- **OPEN-3: (B)**, taken on 2026-11-05 (the direction of 2026-10-31, item 4, `state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md`, held until 2026-11-09 by `state/directives/2026-11-03-away-until-11-09-276-open-1-seven-clauses-open-4-c-placed-sitting-wording-leaves-slot-cloud-credit.md`, line 6); the human reviews each on return and may reverse it, a reversal recorded, never edited in.
- **OPEN-4: (A)**, the custodian's reading of the human's item 2, not a recommendation taken: the visible `[P6 placeholder] ` prefix is the mark the human's own ruling on 8b's W-1 (item 5 of the same directive) calls a P6 placeholder. A red line: the human sees the mark at the click and may reverse it there.
- **The read commit and main:** `git diff --name-only 8b9193a1 d3391d4b` over the eight Scope files is empty.
- **Rule (00)** was checked at main d3391d4b by `git diff --name-only origin/main...<branch>` over the branches in flight (`cut/port-2-macos-l1-and-app-dirs`, `cut/b2-piece-1c-save-and-reopen`, `cut/b1-shell-half-pr-c`): only `cut/port-2-macos-l1-and-app-dirs` touches a Scope file, `KNOWN-LIMITATIONS.md`, in its platforms paragraph and item 43, not item 8 (KNOWN-LIMITATIONS items count as separate paths); none touches the other seven. Within `frontends/shell/MANUAL-WALKTHROUGH.md`, Part G and the e2e/publish.mjs coverage table are this piece's; walkthrough-rows-stale-against-main-sweep-area-b, in the docs lane, holds other Parts and tables (its form's section 2.3); no PR is open. It is checked again at dispatch.
- **The sitting (the draft's note 7):** the custodian records on `sitting-wording-n1-to-n7`'s node that this piece overtakes its N1 ground, its item 8 and its G8 once merged.

## Amendments (opens empty; append-only)

**Amendment 1 (2026-11-06, the closing record, written after PR #285's merge; what both gate-1 reports asked of it).**

- **Size, class 6:** 200 changed lines against the declared 150 over the eight Scope files (`state/consults/gates/2026-11-06-publish-filter-sentence-under-whole-dataset-gate1-reviewer.md`, Files and size); the Scope line is not edited.
- **The mutation record:** the change was observed only through M-1 in the unit test, never in the e2e (`state/consults/gates/2026-11-06-publish-filter-sentence-under-whole-dataset-gate1-architect.md`, its closing items).
- **The e2e** ran on the port-5400 harness under the human's approval of 2026-10-11, item 1 (`state/consults/2026-11-06-publish-filter-sentence-under-whole-dataset-e2e-worker-report.md`).
- **The removed test (the reviewer's D-3):** governance/forms/frontends/PUBLISH-FILTER-SENTENCE-UNDER-WHOLE-DATASET-PREREGISTRATION.md:11 @ 0f9edda8fc047dfae9a1b56ccd9cb67c43065292 sha256:ebb1bbd99a0ff2511dbab312f37b5caa0d0ca31b7c40c7bdc3a92e60ea3dd3aa is superseded: the test it names as replaced left with this piece, and its replacement is `the_whole_dataset_scope_carries_no_filter_scope_sentence_with_or_without_a_filter`.
- **The merge:** the human merged #285 at 2026-11-06T11:07:51Z (02b5a4a6), before a typed answer to item 8's words and revision note, the mark, N-1 to N-3 and E-note 1; each goes to the human again.
