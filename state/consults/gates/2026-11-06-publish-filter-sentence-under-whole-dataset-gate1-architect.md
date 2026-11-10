Reviewed: PR #285 at 3f5b0ff24f64efe42c8ff2e38b0cec03e1882831 (base 0c84b816), gate 1, architect
Verdict: PASS WITH NOTES
cut/publish-filter-sentence-under-whole-dataset @ 3f5b0ff24f64efe42c8ff2e38b0cec03e1882831

Line cites are to the head as read in the worktree C:/dev/wt/pfs, unless marked "main", which means the checkout at 2cef11de. The base files are main's, because the packet shows no drift. I have no shell, so I give no sha256, I ran no git, gh, cargo or vitest, and I observed no mutation (Part 1, item 9). I leave no background shell.

## Findings by class

**Correctness: none.** No sentence the diff writes makes a guarantee, limit or measurement claim that the code does not support. Check 3 has the clause checks.

**Evidence: none blocking.** One finding goes to the human under N-1 below, because it bears on OPEN-3 (B), which was taken by recommendation.

**Documentation: must be fixed before the merge (proportional gates). None of these is the human's wording, on the first worker report's "Whose words" (`git log -L`). I could not run that myself. Applying them needs no re-gate.**

- **D-1. MANUAL-WALKTHROUGH.md G8, the Step cell** (MANUAL-WALKTHROUGH.md:337).
  - The Expected cell now claims what the dialog shows "With **Whole dataset** chosen and the same filter on". The Step cell never has the operator prepare under Whole dataset. It reads, byte-copied: `Apply a filter if not already active (Part E's panel — e.g. `zone = 'residential'`), then choose **Current view** and click **Export interactive map…** again.` An operator who follows the row cannot observe the Whole-dataset half of the dialog claim.
  - Proposed words for the Step cell: Apply a filter if not already active (Part E's panel — e.g. `zone = 'residential'`), then choose **Current view** and click **Export interactive map…** again; read the Export section, confirm a destination in the native picker, read the approval dialog, and click its **Cancel**. Then choose **Whole dataset**, keep the same filter on, and do the same once more.
  - Clause check:
    - (a) Under Current view the button is enabled once data is drawn. It is disabled only on `busy || (scope === "current" && currentDisabled) || state.kind === "dialog"` (PublishPanel.tsx:701). After G7 the data is drawn.
    - (b) The Export section shows the sentence under `filterActive && scope === "current"` (PublishPanel.tsx:693).
    - (c) A confirmed picker leads to prepare, which returns a prompt. The dialog renders `prompt.filter_scope` in a `role="alert"` block after the Row scope `<dl>` (PublishDialog.tsx:262-268). The host sets it at publish.rs:134.
    - (d) Cancel abandons without execute, as the Expected cell's own parenthetical already says.
    - (e) Under Whole dataset the button is enabled (only the current arm is gated). The payload gives `None` (publish.rs:135). The echo is hidden (PublishPanel.tsx:693). The Row scope sentence is the whole-file one (publish.rs:142).
- **D-2. The condition, half-stated, against the form's note 4 ("the condition (a filter active and the scope Current view)").**
  - e2e/README.md:218 reads, byte-copied: `(the sentence is carried only under the current view; no step of this suite`. Proposed: (the sentence is carried only under the current view with a filter active; no step of this suite.
  - The FILTERED' coverage row's Covers cell (MANUAL-WALKTHROUGH.md:399) reads, byte-copied: `(the case where the sentence is shown is not prepared by this suite)`. Proposed: (the case where the sentence is shown, the current view with a filter active, is not prepared by this suite).
  - Clause check: carried only on `Self::ViewportBbox { .. } if filter_active` (publish.rs:134). "Not prepared by this suite": all three prepares in e2e/publish.mjs pass `"whole"` (:277, :404, :470).
  - My reading of note 4: each place must cover those of the three points (the condition, the mark, P0) that its own sentence concerns. The e2e places assert `null`, so the mark is not their subject. On that reading, this is the only coverage gap.
- **D-3. KNOWN-LIMITATIONS.md:107, the source comment's revision note.** It says "the two pins at 8e093734 and b391e436 above". The comment carries seven pins: five at 8e093734 (publish.rs:117-119, stream.rs:263, publish.rs:72-74, publish.rs:634, PublishDialog.tsx:254-257) and two at b391e436 (publish.rs:108-110, stream.rs:216).
  - Proposed words, to go to the human with item 8 at the click because the custodian groups this comment with item 8's red line: Revised 2026-11-06 (PLAN node publish-filter-sentence-under-whole-dataset): the filter sentence in the Export section and in the dialog is shown only under the current view with a filter active, and carries the P6 placeholder mark, under the human's ruling of 2026-11-05 (evening), item 2; the seven pins above, five at 8e093734 and two at b391e436, stay as history and are authoritative as history, not as the current tree.
  - Clause check: the condition is at publish.rs:134 and PublishPanel.tsx:693. The mark is at publish.rs:77 and types.ts:128. The pin count is read off KNOWN-LIMITATIONS.md:107 at the head. The pins are unchanged against main's :107, so they are history, named authoritative as history and not read as current.

**To the human (no words from me):**

- **N-1. OPEN-3 (B)'s ground is incomplete.**
  - Before this piece, FILTERED' proved end to end that an applied filter reaches the host as `filter_active = true`: only a true flag produced the sentence it asserted.
  - It now asserts `null` under whole-file. That holds whether the flag arrives true or false.
  - No test at the head proves the true case on the App-to-host path:
    - App.tsx:2450 passes `activeFilter !== null`.
    - RB8 (App.selection.test.tsx:894) pins only the `false` case.
    - client.test.ts:46 proves only that the client passes the flag through.
    - The new Rust and vitest cases take the flag as an input.
  - A regression to `filterActive={false}` would now pass every test, and the dialog would never show the sentence. By reading, every link is correct today, so the sentences in item 8, G8 and types.ts are true. What is lost is their test proof.
  - Closure, each a 9th file and so the human's:
    - an App-level vitest: apply a filter, prepare under Current view, and assert that the 4th prepare argument is `true`;
    - or OPEN-3 (A).
  - Or the human accepts the gap as it stands, recorded on the form.
- **N-2. ADR-024 (Proposed, not architect-blockable, so not blocking).** Two passages describe the pre-U12 behaviour:
  - :91-94: the sentence is returned "when the shell's own active SQL filter would have applied ... never silently dropped".
  - :223-227: FILTERED' "exercises exactly this: the sentence is present".
  - The second is false from the merge on. Its own 2026-10-20 note is the precedent for a dated appended note when a piece changes its Decision. ADR text is the human's red line and is outside the eight-file Scope. A dated note in the human's words, in this PR or a follow-up node, is the human's call. The form's note 1 ("ADR: not touched") did not consider ADR-024.
- **N-3. The mark's source comment.**
  - What the comments say: both copies say "a P6 placeholder (the human's ruling of 2026-11-05, evening, item 2): the visible `[P6 placeholder] ` prefix is the mark" (publish.rs:71-72, types.ts:117-118).
  - What item 2 says: "its text a P6 placeholder".
  - The gap: that the prefix is the mark is OPEN-4 (A), the custodian's reading. The colon lets a reader take the prefix as the ruling's own words. The human sees this at the click.

**Notes (not acceptance conditions):**

- The closing amendment owes three things:
  - class 6 for 200 lines against the declared 150;
  - the Tests line's "its mutation observed only through M-1 in the unit test, never in the e2e, and the record says so". Neither hand-back says it.
  - the e2e on the port-5400 harness.
- No test asserts that PublishDialog renders a non-null `filter_scope` (PublishDialog.test.ts:50 uses `null` only). This was so before this piece too. The dialog clause rests on PublishDialog.tsx:264-268, which is unchanged, and on G8's sight.

## Check 1: the change against Change, Out-of-scope and notes 1 to 3

The head does what those lines say, and no more:

- **The route.**
  - The private `fn filter_scope_sentence(&self, filter_active: bool) -> Option<String>` sits beside `row_scope_sentence` (publish.rs:128-137).
  - It is called in `prepare_with_progress` at :421, beside `row_scope` at :420, and handed on at :467.
  - `prepare_with_query` takes `filter_scope: Option<String>` (:542) and passes it into the payload (:651). Main had `filter_active.then(...)` at main :635.
  - The two direct test callers pass `None` (:1997, :2355).
  - No new `pub` item.
- **The condition, in both places.**
  - Host: `Self::ViewportBbox { .. } if filter_active => Some(...)`, `_ => None` (:134-135).
  - Panel: `filterActive && scope === "current"` (PublishPanel.tsx:693).
  - They agree whenever a prompt exists. The two cases in note 2 are dev-only or inside an open dialog, so they are named, not blocking.
- **FILTERED'.** It asserts `prompt.filter_scope !== null` → throw (e2e/publish.mjs:477-481). The old constant and its "third, end-to-end pin" comment are removed (main :63-68).
- **Untouched:**
  - ADR-017 §8, and nothing under docs/adr;
  - anything ADR-020, ADR-009 or ADR-021 governs;
  - every wire surface, and protocol/;
  - `binding_publish_prepare`'s arguments (commands.rs:294 keeps `filter_active: bool`; commands.rs is not in the diff);
  - `PublishPromptData`'s fields and types (publish.rs:286-291 changes a doc only; types.ts:39 is still `string | null`);
  - the class-3 approval path (no boundary or execute code in the diff).
- **P0 is unchanged.**
  - `to_query` is untouched: `filter: None` in the viewport arm (:121-123) and `ViewportQuery::all()` for the whole file (:108).
  - `preflight` is unchanged (:566).
  - FILTERED' still asserts the manifest's `whole-file` and 2000 rows by manifest and by independent decode (:495-519).
- **Constitution.** No violation of docs/01, ADR-006, docs/02/10, docs/08 or docs/07.

## Check 2: the mark

Both copies carry exactly `[P6 placeholder] ` before the old text:

- publish.rs:77-78 against main :74-75.
- types.ts:128-129 against main :127-128.

Every following byte is unchanged as far as Read shows. That includes the Rust `\` continuation and the next line's indentation. The pin test passing at the head is the byte-level proof (e2e report, "Checks at 3f5b0ff2", `npm run verify` 1446 passed; that is the worker's run, not mine).

Both comments name the human's item 2, as OPEN-4 (A) requires. N-3 is the only remark.

## Check 3: the sentences, clause by clause

- **publish.rs.**
  - The const doc (:71-75): the condition matches :134; "every byte after it is unchanged" is checked in check 2; "the pin test ... keeps the two equal" matches PublishPanel.test.ts:222-240. True.
  - The method doc (:128-131): "`None` for every other case" matches :135. "`to_query` sends no filter under either scope" matches :108 and :123. True.
  - The field doc (:288-290): the condition and the `None` cases are true, and `row_scope` states every row (:142). "The filter is in no published row under either scope" is true by `to_query` and P0.
- **types.ts.**
  - :35-38 is true; `null` and not omitted is unchanged.
  - :116-126: "shown BEFORE any host round-trip only when a filter is active and the scope choice is "current"" matches PublishPanel.tsx:693. "Under the same condition" holds up to the dev-only `scopeOverride` case named in note 2. "Under Whole dataset neither shows it" is true.
- **The FILTERED' header** (e2e/publish.mjs:451-458): true. It covers the condition and P0, and this suite never prepares the current view (all three prepares pass "whole").
- **The e2e README passage** (:216-222): every clause is true. D-2 completes the condition.
- **G8** (:337). The Expected clauses are true:
  - the panel sentence sits between the fieldset and the button (:693, :695, :697-703);
  - the dialog alert block sits below Row scope (PublishDialog.tsx:262-268);
  - the dialog sentence begins with the prefix;
  - the Whole-dataset Row scope text matches publish.rs:142.
  - The Step cell is D-1. G1 and G3's "that is G8" stays true, because G8 uses Current view.
- **The FILTERED' coverage row** (:399): true. D-2 completes the condition.
- **KNOWN-LIMITATIONS item 8** (:105), against OPEN-2 (a)'s four points:
  - (1) "never part of what is published ... unfiltered": true by `to_query` and P0.
  - (2) "With Current view chosen, the Export section and the approval dialog both show a sentence, marked [P6 placeholder]": true, in the item's own context "With a filter applied" (:693, :134). Where Current view is chosen but disabled, the panel shows the sentence and no dialog can open. That is consistent with the sentence.
  - (3) "With Whole dataset chosen, neither shows it, and the dialog's row-scope line says the whole file, every row the dataset contains": true (:135, :693, :142).
  - (4) No quote of the placeholder string: the human's call, as OPEN-2 (a) leaves it.
  - I have no finding on the body. It waits for the human's approval at the click (red line).
- **The human's "Corrected 2026-10-10" line** (:106) is identical to main's :106. The comment's pins at 8e093734 and b391e436 are kept byte-identical against main's :107, and the new note names them authoritative as history. D-3 is the only defect.

## Check 4: tests at real boundaries

- **The two Rust tests** go through `prepare`, which delegates to the shipped `prepare_with_progress`, over the real 20-row fixture. Their helper `filter_scope_of` is test-local (publish.rs:2017-2045). One test covers Whole dataset: `None` off and on (:2050-2064). The other covers Current view: `None` off and `Some(FILTER_SCOPE_SENTENCE)` on (:2069-2091).
- **The two vitest cases** render the real `PublishControls` with its real props type (PublishPanel.test.ts:434-448).
- **The old test** `the_filter_scope_sentence_is_present_only_when_filter_active_is_true` (main :2001-2046) is gone and replaced.
- **The pin test** at :222-240 is unchanged (the test file's diff is 17 insertions and 0 deletions, all at :432-448).
- **The changed property** (the sentence under Whole dataset with a filter on) is asserted again in both places that asserted it before: publish.rs:2059-2063, and FILTERED' at e2e/publish.mjs:477-481. The second ran once, unmutated, at 3f5b0ff2 and passed (e2e report).
- **M-1 to M-4**, by reading only, not observed: each one flips exactly its named assertion. The recorded observations are at ec847095.
- **OPEN-3 (B)** leaves one claim without test proof: that an applied filter reaches the host as `true` (N-1).

## Check 5: scope

- The packet's numstat names the eight Scope files. My reading of both trees is consistent with only the named spans changing:
  - KNOWN-LIMITATIONS.md: :105 and :107 only;
  - MANUAL-WALKTHROUGH.md: G8 :337 and the coverage row :399 only;
  - e2e/README.md: :217-219 within the FILTERED' passage;
  - publish.rs: the +45 net is fully accounted for by the const, the method, the field doc, the parameter, the two test arguments and the tests, with every line offset after :2091 equal to +45;
  - types.ts: 14/13 matches its two docs and the literal;
  - PublishPanel.tsx: 1/1.
- I could not run `git diff --name-only`. That check rests on the packet's script and the e2e report.

## The packet's gaps

- No CI status. I cannot run gh, so the green CI rests only on the e2e report.
- The diff was a locator only. I rebuilt it by reading both trees.
- Consumers were "G". The packet did not name ADR-024:91-94 and :223-227, Proposed and stating the old behaviour (N-2), and I needed it.
- Whose words (H): only the hand-back gives it. I could not verify it with `git log -L`.
- Whether any test asserts the App-to-host `filter_active = true` path, or the dialog's render of a non-null `filter_scope`. I needed both for N-1 and for the notes.
