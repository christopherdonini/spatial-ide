Reviewed: branch cut/large-utf8-and-utf8-view-attribute-columns at 50c7c3314fe9d9b5afe7fd78417c5afd0c7992ba, PR 364 (draft), in the branch worktree C:/dev/wt/lutf8, read only, with the diff 69066c72...50c7c331 in the scratch folder; the records at main 4630fa09bec7d7c66a15393de0bd13d64537a9a1 in D:/wt/read-1124b (the custodian's filing note, 2026-11-24: the architect's build gate, attempt 3 of the architect rows for this node, node:large-utf8-and-utf8-view-attribute-columns@build-gate-architect-1, the second gate the form names, dispatched at 2026-11-24T02:35:23Z; its run: Read 21, Grep 6, Glob 1, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-24T02:35:24Z to 2026-11-24T02:39:35Z by its transcript; 0 calls named the main checkout; handed back at 2026-11-24T02:39:35Z. Its first line carries the branch and head after the verdict, which the brief did not ask for; the verdict is PASS WITH NOTES. Filed below the rule from its hand-back, 11322 bytes, sha256 8c847a3bad635bc742955530dc16da4c08d18bccda95fe2d9ca901d59c7a256f, byte for byte, nothing masked, with one final newline added.)

---

Verdict: PASS WITH NOTES — cut/large-utf8-and-utf8-view-attribute-columns @ 50c7c3314fe9d9b5afe7fd78417c5afd0c7992ba
Reviewed: C:/dev/wt/lutf8 @ 50c7c3314fe9d9b5afe7fd78417c5afd0c7992ba
REPORT PATH: state/consults/gates/2026-11-24-large-utf8-and-utf8-view-attribute-columns-build-gate-architect.md

There are no Correctness findings and no Evidence findings. There are no new Documentation findings either. The four records the reviewer's DOC-5 already owes to the closing amendment ((a), (b), (c) and (e); (d) is evidence) are confirmed below and must be fixed before the merge. I read everything by reading alone. I ran nothing and wrote nothing.

## The checks

**1. docs/01 and ADR-017 §4.** What I read: docs/01 lines 5 to 26; ADR-017 lines 122 to 144; at the head, `engine/src/attributes.rs` lines 20 to 140 and 478 to 516, and `engine/src/stream.rs` lines 2335 to 2374.
- **Principle 8 and no silent conversion: holds.** The fix only removes two match arms in `admit_attribute_type` and `is_admitted_scalar`. Nothing is cast or widened. The two types fall to the existing final arm. The rule the module doc states (`## Types are admitted, never converted`) still holds. OPEN-1 (C), the cast, was not taken.
- **Refusal by name: holds.** Each refusal stays typed and names its column:
  - `ProjectionError::TypeNotAdmitted { column, arrow_type, .. }` through `type_check`;
  - `FilterError::ColumnNotFilterable { column, reason }` through `predicate.rs` line 1249;
  - `EngineError::AttributeUnpublishable { column, detail }` at the final arm.
  - No refusal text changes. My paraphrase of the residue: S1's placeholder lists "utf8" while it refuses `LargeUtf8`. ADV-2026-11-23-21 item 3 rules that residue unchanged, so it is not a finding.
- **CRS is a type: not engaged.** No CRS, frame or geometry path is in the diff.
- **Principle 1: holds.** describe still reports the true `arrow_type` and says `projectable: false`.
- **Principle 7: holds.** No stream or cancellation code line changes.
- **ADR-017 §4: holds.** Its closed format list and its estimate rule are untouched. The `LargeStringArray` and `StringViewArray` cost arms stay, at stream.rs lines 2343 to 2346 at the head. Admission is now narrower than the format list. Publish refuses at `resolve_projection` (kernel/src/publish/mod.rs line 530) before `admit_bundle_format` (line 538). So nothing is converted, and §4's sentence that every other type is refused rather than converted still holds.
- **Other checks: clean.** ADR-006: no operation class changes (describe, viewport_query and filter stay reads). docs/08: no performance risk. docs/07: no scope creep.

**2. ADR-021 and ADR-023 §2 (OPEN-2).** What I read: ADR-023 lines 1 to 60; ADR-021 lines 225 to 282; `predicate.rs` lines 1146 to 1301 at the head; `kernel/src/skp.rs`, grep for `ColumnNotFilterable` (line 2335).
- ADR-023 §2's one admission function still exists, and every surface reaches it:
  - describe, through `admit_projection_column` and then `type_check`;
  - viewport_query and publish, through `admit_projection`;
  - the filter, through `filterable_column_type`, then `admit_attribute_type`.
- So the narrowing that ADR-023's Note 2026-11-23 records is exactly the code's. Each of the note's items 1 to 5 is true at the head.
- ADR-021 Note 2026-09-24 item 1 defines the namespace by that function. So the namespace narrows by reference, and no sentence of the earlier note becomes untrue. The ADR-021 note appended at the end of the file matches the code:
  - a predicate naming such a column reaches `filter_surrogate`, then `filterable_column_type`, then `ColumnNotFilterable`. `filter_error_of` maps that to `skp.filter_column_not_filterable` (skp.rs line 2335). The `reason` is the final arm's existing `Display`.
  - a dictionary over either type is still refused by name at line 1239, before the gate. That matches the note's item 3.
  - no code is added.

**3. The two ADR notes.** Read from the diff and compared line by line with the ruling's fences: ADV-2026-11-23-28, item 1 (ADR-023) and item 2 (ADR-021).
- **Byte for byte:** I found no difference in any line, from the heading through the last item. Reading cannot see invisible bytes. The reviewer's script compared both notes byte for byte at b035ccb3 (equal, rc 0). words-2 touched only three engine files (its `git diff --name-only`), so the ADR bytes at 50c7c331 are the bytes that script checked.
- **Appended at the end:** each file has one hunk, `@@ -181,3 +181,13 @@` (ADR-023, 10 insertions) and `@@ -279,3 +279,11 @@` (ADR-021, 8 insertions). Each hunk is a blank line followed by the fence, added after the old last line. Neither hunk carries a `\ No newline at end of file` marker.
- **Nothing above edited:** each file has 0 deletions, and the context lines are unchanged.
- **Authority:** the grant of 2026-11-13, item 2, delegates ADR notes to the advisor. Both italic lines say "not the human's words".

**4. The seam rule.** Neither `kernel/src/skp.rs` nor `frontends/shell/src/attributes/projection.ts` is in the diff, so each interface is the same at the base and at the head.
- skp.rs lines 2064 to 2069 at the head still hold `projectable: spatial_engine::attributes::admit_projection_column(` through `.is_ok(),`.
- projection.ts lines 15 to 17 at the head still hold `projectionFor`, which filters on `field.projectable`.
- By reading, neither span has moved. I cannot recompute the 0bcf5434 hashes. If a record cites these lines as current, the tree is authoritative.
- The end-to-end proof is T1. It calls the real `admit_projection_column(&field, "geometry", "id")` and `admit_projection(...)` signatures, which I read at `attributes.rs` lines 509 and 536, on a field DuckDB itself exports. K-5 keeps the describe agreement.
- No `pub` item, callback or option is added. `fixture::configured_connection` already exists as test support.

**5. Block-on-sight, §8 as amended:**
1. **A file outside the Scope: none.** The Scope is the five files, plus ADR-023 (Amendment 2 item 2), plus ADR-021 (Amendment 2 item 4 on ADV-2026-11-23-28 item 2). The diff has exactly those seven paths.
2. **A refusal text changed: no.** The final-arm text, `type_check`'s detail and every `FilterError` text are absent from the diff.
3. **A cast, widening or layout conversion added: no.** The production changes are two arm removals, one arm narrowing in `duckdb_type_name`, and comments.
4. **`CONFIGURE_SQL` changed: no.** `engine/src/pool.rs` is not in the diff. M3's temporary edit is excluded by D3.
5. **T1's precondition removed or weakened: no.** `assert_eq!(field.data_type(), &expected, ...)` runs before both refusal assertions. The Utf8View case's second `SET` is D2's allowed variant: with `arrow_output_version='1.4'` the type is exported, so I1 does not fire.
6. **A new test without its recorded mutation: no.** T1, T2, T3 and T4 each carry a `RECORDED MUTATION` comment naming cea0ef8c. The build report says each was applied by hand, and that verify-mutation was "a check only", so the round 25 item 2 clause on that tool does not fire.
7. **An ADR line edited, or anything appended but the notes: no.** Only the two ruled notes are appended, with 0 deletions. ADR-021's note is covered by Amendment 2 item 4, the case where the advisor rules OPEN-6 yes.

**6. §7 and the Scope.**
- By the diff's hunks the counts are 159 insertions and 16 deletions, 175 lines against 220, so the line budget holds. Per file: ADR-021 8/0, ADR-023 10/0, README 4/3, attributes.rs 20/5, predicate.rs 22/6, stream.rs 2/2, the new test 93/0.
- 7 files against §7's 5 is an overrun of the full form's §7. It is recorded as class 8 at the closing (ADV-2026-11-23-28 item 4). §7 is unedited: the form is not in the diff.
- ADR-023 and ADR-021 each match their declared 10/0 and 8/0.

**7. The reviewer's notes.** DOC-1 to DOC-4 changed comment lines only:
- T3's doc (DOC-1);
- T1's doc (DOC-2);
- T1's inner comment (DOC-3);
- one `RECORDED MUTATION` line each in attributes.rs and predicate.rs (DOC-4).

Each New text in the reviewer's report equals the head text in the diff. By common lines the change is 11 insertions and 7 deletions, which matches words-2's `--stat`. No code token changed.

## Findings

- **Correctness:** none.
- **Evidence:** none.
- **Documentation (must fix before the merge; record items, no code and no replacement words):** I concur with the reviewer's DOC-5 (a), (b), (c) and (e). They are listed below.

## What the closing amendment must record

1. **The §7 file overrun as class 8.** 7 files against 5; 175 lines against 220 at 50c7c331. §7 stays unedited.
2. **ADV-2026-11-23-28 item 2 as the class 9 scope addition of ADR-021.** Amendment 2 item 4 committed to an amendment "before any change to that file". The note landed at b035ccb3 with no such amendment, and the closing amendment discloses that order. This is a record finding, not code (round 25 item 2's "code landed" clause does not fire).
3. **I1:** the Utf8View half's added `SET arrow_output_version='1.4'`, tried and recorded as D2 asks.
4. **T1's P0:** taken at e106af50. Its `SET` string changed at cea0ef8c, and the reviewer observed T1 red again at the base.
5. **A correction of the form's T3 sentence** (Amendment 2 E2's New text). The string-view setting alone does not change the export (P1, P2).
6. **The worker words applied without a re-gate,** listed in the PR body: DOC-1 to DOC-4 at 50c7c331, under the wording-blocks rule.
7. **The two words commits and this gate:** b035ccb3 (the notes) and 50c7c331 (DOC-1 to DOC-4); this report's path.

## Files read

- `<S>/brief-lutf8-arch-1.md`, `<S>/lutf8-diff-50c7c331.txt`
- `D:/wt/read-1124b/governance/forms/engine/LARGE-UTF8-AND-UTF8-VIEW-ATTRIBUTE-COLUMNS-PREREGISTRATION.md` (whole)
- `D:/wt/read-1124b/state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-21-large-utf8-open-1-a-with-t3-adr-023-narrowed-by-an-appended-note-t3-kept-as-a-premise-pin.md`
- `D:/wt/read-1124b/state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-28-large-utf8-open-5-to-9-the-adr-023-note-with-two-changes-an-adr-021-note-class-9-no-skp-v0-note.md`
- `D:/wt/read-1124b/state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`
- `D:/wt/read-1124b/state/consults/gates/2026-11-23-large-utf8-and-utf8-view-attribute-columns-build-gate-reviewer.md`
- `D:/wt/read-1124b/state/consults/2026-11-23-large-utf8-and-utf8-view-attribute-columns-worker-report.md`, `…-words-worker-report.md`, `…-words-2-worker-report.md`
- `D:/wt/read-1124b/docs/01_Principles.md`; `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md` (lines 112 to 151, headings); `docs/adr/ADR-021-row-filter-on-viewport-query.md` (lines 225 to 282); `docs/adr/ADR-023-attribute-projection-on-viewport-query.md` (lines 1 to 60)
- In `C:/dev/wt/lutf8` at the head:
  - `engine/src/attributes.rs` (lines 20 to 149 and 478 to 519);
  - `engine/src/predicate.rs` (lines 1135 to 1309);
  - `engine/src/stream.rs` (lines 2335 to 2374);
  - `engine/src/fixture.rs` and `engine/src/lib.rs` (grep);
  - `kernel/src/skp.rs` (lines 2055 to 2076, and grep);
  - `kernel/src/publish/mod.rs` (grep);
  - `frontends/shell/src/attributes/projection.ts` (lines 1 to 45).

Model: Opus 5.5 (claude-opus-5-5).
