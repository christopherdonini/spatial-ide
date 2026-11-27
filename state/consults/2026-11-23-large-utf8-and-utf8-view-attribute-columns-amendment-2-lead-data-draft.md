*Filed by the custodian: lead-data's draft of Amendment 2 to `governance/forms/engine/LARGE-UTF8-AND-UTF8-VIEW-ATTRIBUTE-COLUMNS-PREREGISTRATION.md`, after the architect's form gate, attempt 1 (FAIL; `state/consults/gates/2026-11-23-large-utf8-and-utf8-view-attribute-columns-form-gate-architect.md`, gate-log row 873) and the advisor's ruling ADV-2026-11-23-21 (`state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-21-large-utf8-open-1-a-with-t3-adr-023-narrowed-by-an-appended-note-t3-kept-as-a-premise-pin.md`), node:large-utf8-and-utf8-view-attribute-columns@amendment-2-lead-data-draft, dispatched at 2026-11-23T18:07:24Z. Its run: Read 29, Grep 16, Glob 2, SubagentHandback 2, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-23T18:07:24Z to 2026-11-23T18:38:45Z by its transcript; 0 calls named the main checkout. Its first hand-back, 29718 bytes, sha256 d0d3d000099e4adc080491d17dc7f1042d2ad41d1b99ef0bfd76843e8d23abc3, cited a line ADR-023 does not have; on the custodian's correction of 2026-11-23T18:37:10Z (ADR-023 has 183 lines at 5bc4011b) it reissued the report. The report below is the reissue from its hand-back, 29484 bytes, sha256 25942ac13f2196194a2e317b4d8b06728087ffe93f6b8cfd06dfbb091cdbdfb9, byte for byte but for one entry of its list of files read, the engine README from line 380 to line 568, which the hand-back wrote in the path-and-colon form: that file has 567 lines at 5bc4011b, so the custodian writes that entry in words, to keep the cite check true; nothing else is changed, with one final newline added. Its amendment, the text between its two marker lines, is appended to the form byte for byte, and the custodian's Amendment 3 follows it.*

---

Result: Amendment 2 is drafted. It records ADV-2026-11-23-21 item by item, declares ADR-023's file as a class 9 scope addition with a 10-line note drafted for it, and carries the gate's words for C1, C2, E1, E2 and D1 to D6, with C1 and D1 adapted. I find ADR-021 owes a note of its own and draft one as a draft only. §7's five-file figure no longer holds.

Blocking question (OPEN-6): does ADR-021 owe a note of its own? If it does, it joins the Scope and the merge request waits on its words too.
Blocking question (OPEN-5): the words of ADR-023's note, including its heading word, its status parenthesis and its date. The merge request waits on them (ADV-2026-11-23-21 item 2).
Report path: state/consults/2026-11-23-large-utf8-and-utf8-view-attribute-columns-amendment-2-lead-data-draft.md (I wrote no file, as the brief says. The custodian files this hand-back there and computes the sha256 by script.)

---AMENDMENT 2---
## Amendment 2 — 2026-11-23 — post-result amendment after the architect's form gate, attempt 1 (FAIL), and ADV-2026-11-23-21: the ruling recorded by item; scope addition (class 9): ADR-023's note; the gate's words for C1, C2, E1, E2 and D1 to D6; ADR-021; the counts; OPEN-5 to OPEN-9

*Drafted by lead-data on the custodian's brief, before any code, read only at main 5bc4011bf7c592e77fc393d84fe7403f651a48ed. Every `path:line` this amendment adds is read at that commit and listed in item 6. The gate report is `state/consults/gates/2026-11-23-large-utf8-and-utf8-view-attribute-columns-form-gate-architect.md`. The ruling is `state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-21-large-utf8-open-1-a-with-t3-adr-023-narrowed-by-an-appended-note-t3-kept-as-a-premise-pin.md`. The gate's words are carried as the gate gave them, except C1 and D1, which are adapted. Every other new string is lead-data's draft for the advisor.*

1. **ADV-2026-11-23-21, by item.** Items 1 and 3 to 7: no form text changes. Item 2: the text it makes untrue is replaced in items 2 and 3 below. That text is in §1, §2's Scope, the line after the Scope list and the counting command, §5, §8 item 7, §9's Reviewer and Merge lines, and OPEN-2.

2. **Scope addition (class 9; ADV-2026-11-23-21 item 2), declared before any code.**
   - **§2 shape.** `docs/adr/ADR-023-attribute-projection-on-viewport-query.md` joins the Scope. Its one region is the note in the fence below, appended after the file's last line (line 183 at 5bc4011b). No line above it is edited. The fence's first line is the blank line that separates the note from line 183. Expected by §2's command: 10 insertions, 0 deletions. Before writing, the worker checks that the file ends with a newline. If it does not, the worker stops: the append would change line 183's bytes.
   - **§4.** No test and no mutation: the note carries no behaviour. The reviewer's check in §9 reads it.
   - **§5.** Declared unchanged: every line of ADR-023 above the note, its Status line included. Invalidator I5 is added below.
   - **§8 and §9.** Below.
   - **The note (a draft; the advisor rules its words after this gate):**

````text

## Note 2026-11-23 (Proposed; its words ruled by the advisor under the delegation of 2026-11-13) — of §2's three text types, the engine admits plain `Utf8` alone

*Appended while this ADR is Proposed. Authority: the advisor's ruling ADV-2026-11-23-21, item 2, under the human's delegation of 2026-11-13, not the human's words (`state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-21-large-utf8-open-1-a-with-t3-adr-023-narrowed-by-an-appended-note-t3-kept-as-a-premise-pin.md`). No line above is edited: the Decision text and the Amendment 2026-09-29 are unchanged, the Status line included. Evidence: the probes U1 and U2 (`state/consults/2026-11-16-large-utf8-and-utf8-view-attribute-columns-probes-u1-u2-tester-report.md`). Implementation: `governance/forms/engine/LARGE-UTF8-AND-UTF8-VIEW-ATTRIBUTE-COLUMNS-PREREGISTRATION.md`.*

1. **What changes.** §2's text line lists `Utf8`, `LargeUtf8` and `Utf8View`. Since the piece `large-utf8-and-utf8-view-attribute-columns`, the one admission function (`engine::attributes::admit_attribute_type`) admits plain `Utf8` alone of the three. A `LargeUtf8` or `Utf8View` column, or a dictionary over either, is refused by that function's existing final arm, with its existing text. §2's line is read with this note.
2. **Why, in the engine's own facts.** The engine takes an attribute's type only from DuckDB's Arrow export, on connections it configures itself. On such a connection, at DuckDB v1.5.5, `arrow_large_buffer_size` and `produce_arrow_string_view` are `false`, and one Parquet file of each of the three text types was described and streamed with its text column as plain `Utf8` (U1, U2). No source the engine opens is known to yield either of the other two types, so the engine refuses them rather than offer them unproven. The test `the_product_configured_connection_exports_text_as_plain_utf8` pins that export.
3. **What follows through the one function.** §2's rule of one admission function is unchanged. So `describe`'s `projectable` is false for such a column, a `viewport_query` naming it is refused `skp.projection_type_not_admitted`, and publish refuses it at projection admission.
4. **Unchanged.** Nothing is cast, widened or stringified. Every other type §2 admits stays admitted, a dictionary over `Utf8` among them. No refusal code, field or text changes, and no wire field is added. ADR-017 §4 and the bundle-format check are untouched.
5. **Not decided here:** the filter namespace, which ADR-021's Note 2026-09-24 item 1 takes from §2's list (ADR-021's own record); and whether a later piece admits either type again, which would be a new note.
````

   - **The form text this addition makes untrue.** Each Old text below occurs exactly once in the form above this amendment, checked at 5bc4011b.

Old:
```text
**Scope (exact) and budget.** Five files, 220 lines (insertions plus deletions):
```
New:
```text
**Scope (exact) and budget.** Six files, 220 lines (insertions plus deletions); the sixth, `docs/adr/ADR-023-attribute-projection-on-viewport-query.md`, joined by Amendment 2 (class 9), its one region the appended note:
```
Old:
```text
No other held piece or filed form names any of these paths.
```
New:
```text
No other held piece or filed form names any of the five paths above. For ADR-023's file, joined by Amendment 2, the custodian compares it with every held PR's files before any code (ADV-2026-11-23-15 item 4).
```
Old:
```text
git diff --numstat <base>...HEAD -- engine/src/attributes.rs engine/src/predicate.rs engine/src/stream.rs engine/README.md engine/tests/large_utf8_and_utf8_view_admission.rs
```
New:
```text
git diff --numstat <base>...HEAD -- engine/src/attributes.rs engine/src/predicate.rs engine/src/stream.rs engine/README.md engine/tests/large_utf8_and_utf8_view_admission.rs docs/adr/ADR-023-attribute-projection-on-viewport-query.md
```
Old:
```text
  - every file outside Scope, including all of kernel/, protocol/, frontends/, renderer/, docs/ and KNOWN-LIMITATIONS.md;
```
New:
```text
  - every file outside Scope, including all of kernel/, protocol/, frontends/, renderer/ and KNOWN-LIMITATIONS.md, and all of docs/ but the note appended to ADR-023; every line of ADR-023 above that note, its Status line included;
```
Old:
```text
  - **I4.** Any file outside Scope is needed.
```
New:
```text
  - **I4.** Any file outside Scope is needed.
  - **I5.** ADR-023's file changes on main, or in a held branch this piece takes in, before the note lands; or the note's ruled words state something the code under this form does not do.
```
Old:
```text
7. An ADR text edited.
```
New:
```text
7. An ADR line edited, or anything appended to an ADR but ADR-023's note (ADV-2026-11-23-21 item 2).
```
Old:
```text
- **Reviewer:** the full diff, E1 and E2, and the four mutations.
```
New:
```text
- **Reviewer:** the full diff, E1 and E2, and the four mutations; and that ADR-023's diff is the note alone, appended after its last line in the words the advisor rules, with 0 deletions by §2's command.
```

   The §8 item 7 New text follows the ruling's reading, "an ADR line edited, or anything appended to an ADR but that note" (state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-21-large-utf8-open-1-a-with-t3-adr-023-narrowed-by-an-appended-note-t3-kept-as-a-premise-pin.md:16).

3. **The gate's words.** Each Old text below occurs exactly once in the form above this amendment, checked at 5bc4011b. Each New text replaces it. C1 is adapted to ADV-2026-11-23-21 item 2: the narrowing of ADR-023 is the advisor's, and the merge request waits on the note's words. D1 is adapted to ADV-2026-11-23-15 item 4. The rest are the gate's words, byte for byte.

**C1 (adapted).**

Old:
```text
- No ADR text is edited. ADR-023 §2 is OPEN-2.
```
New:
```text
- No line of an ADR is edited. Under (A) the engine's list departs from ADR-023 §2's text list; ADR-023 gains one appended dated note that records it, the advisor's by ADV-2026-11-23-21 item 2 and drafted in Amendment 2. The filter namespace, which ADR-021's Note 2026-09-24 item 1 defines by that list, departs with it; whether ADR-021 owes a note of its own is put to the advisor in Amendment 2. The code does not wait for the notes' words; the merge request does.
```
Old:
```text
Cost: it departs from ADR-023 §2's list (OPEN-2).
```
New:
```text
Cost: it departs from ADR-023 §2's list and from ADR-021's Note 2026-09-24 item 1, which defines the filter namespace by that list (OPEN-2).
```
Old:
```text
  - Recommendation: the custodian asks whether narrowing departs from the human's accepted text. This form edits no ADR. Under (B) or (C) the question does not arise.
```
New:
```text
  - ADR-021 (accepted), its Note 2026-09-24 item 1, defines the filter namespace's type set as ADR-023 §2's admitted-type list less dictionary-encoded columns (docs/adr/ADR-021-row-filter-on-viewport-query.md:233). Under (A) the namespace refuses the two types through `admit_attribute_type` (engine/src/predicate.rs:1249), so it departs from that note too.
  - ADV-2026-11-23-21 item 2 rules OPEN-2 for ADR-023: a dated note appended to it, drafted in Amendment 2. Whether ADR-021 owes a note of its own is put to the advisor in Amendment 2. This form edits no line of an ADR. Under (B) or (C) the question does not arise.
```
Old:
```text
- **Merge:** after the tag, and after PR 350 (its base); by merge commit.
```
New:
```text
- **Merge:** after the tag, after PR 350 (its base), and on a merge request that holds ADR-023's note in the words the advisor rules (ADV-2026-11-23-21 item 2) and, if the advisor rules that ADR-021 owes one, ADR-021's note in its ruled words (Amendment 2); by merge commit.
```

**C2.**

Old:
```text
- **Renderer.** `admit_match_type` (renderer/src/compiled.rs:231-239) and `admitsMatchKeyType` (renderer/style-ts/src/style.ts:46) still accept the two types. Both are unchanged and now wider than admission. That is harmless: they judge projected or described columns, and admission refuses first.
```
New:
```text
- **Renderer.** `admit_match_type` (renderer/src/compiled.rs:231-239) and `admitsMatchKeyType` (renderer/style-ts/src/style.ts:46) still accept the two types. Both are unchanged and now wider than admission. Publish runs admission before its style compile (kernel/src/publish/mod.rs:530, :547-548). A recorded `style_set` match step compiles against the file schema with no admission first (kernel/src/session_history.rs:749-758), so a client other than the shell could record a match on such a column that `viewport_query` then refuses. No file brings either type, and the shell offers only projected columns (frontends/shell/src/App.tsx:855-858). Narrowing the two rules is a renderer piece, not this one.
```

**E1.**

Old:
```text
  - describe's `projectable` follows, by the existing K-5 agreement test;
```
New:
```text
  - describe's `projectable` follows by construction: it is `admit_projection_column(...).is_ok()` (kernel/src/skp.rs:2064-2069), which T1 calls on a DuckDB-exported field; K-5 keeps the agreement for every column a file brings, and no file brings either type;
```
Old:
```text
The seam's real shape is covered without the app: describe's value comes from `admit_projection_column` (K-5), and the shell reads only `projectable` (projection.ts:15-17).
```
New:
```text
The seam's real shape is covered without the app: describe's value is `admit_projection_column(...).is_ok()` (kernel/src/skp.rs:2064-2069), which T1 calls on a DuckDB-exported field, and the shell reads only `projectable` (projection.ts:15-17).
```

**E2.**

Old:
```text
  - **Green at base and after.** It is a premise pin and not a red-before test (OPEN-4). It goes red if a DuckDB bump or a configuration change makes ordinary files reach either type.
```
New:
```text
  - **Green at base and after.** It is a premise pin and not a red-before test (OPEN-4). It goes red if VARCHAR's Arrow export on a connection configured by `configure_connection` stops being `Utf8`: a DuckDB bump that changes either setting's default, or either `SET` added to `CONFIGURE_SQL`. It reads no file, so a reader change that types a file's text column as other than VARCHAR is outside it.
```
Old:
```text
- So no file can bring such a column to describe. The only way to make one is a DuckDB setting the product never sets.
```
New:
```text
- So no file the probes tried brings such a column to describe, and the one way this form knows to make one is a DuckDB setting the product does not set (U1; T3 from now on).
```
Old:
```text
- **OPEN-4. T3, a premise pin green at base.** Recommendation: keep it. It is the only guard against the one way the type could arrive.
```
New:
```text
- **OPEN-4. T3, a premise pin green at base.** Recommendation: keep it. It guards the export settings, the way the probes found the type could reach the product connection.
```

**D1 (adapted to ADV-2026-11-23-15 item 4).**

Old:
```text
  - built on `cut/cancel-stamp-order` (PR 350), because both edit engine/README.md (§2 Scope; my paraphrase of the brief's reading of ADV-2026-11-23-15 item 4, which I have not read);
```
New:
```text
  - started at main's tip, taking in PR 350's head (`cut/cancel-stamp-order`) by a merge commit, because both edit engine/README.md's lines :537 and :557 (§2 Scope; ADV-2026-11-23-15 item 4). That merge commit is the piece's base, and it is recorded; the PR is opened as a draft against main, its body names the base, and it stays a draft until PR 350 is on main;
```
Old:
```text
Sum the first two columns. `<base>` is `cut/cancel-stamp-order`'s head while PR 350 is unmerged, and `origin/main` after.
```
New:
```text
Sum the first two columns. `<base>` is the recorded base of ADV-2026-11-23-15 item 4: the merge commit that takes PR 350's head into main's tip, or the later merge commit that takes in a moved head; once PR 350 is on main, `origin/main`.
```

**D2.**

Old:
```text
  - **I1.** H-SET is false: neither setting yields its type from `query_arrow` on the bundled DuckDB. The worker may also try `SET arrow_output_version='1.4'` for Utf8View, recorded. If no setting works, T1's real-source half is replaced only by an amendment the advisor rules.
```
New:
```text
  - **I1.** H-SET is false for either setting: that setting, alone or, for Utf8View, with `SET arrow_output_version='1.4'` (tried and recorded), does not make `query_arrow` export its type on the bundled DuckDB. The worker stops at the first such failure. That half of T1's real source, and T3's mutation if the failing setting is `arrow_large_buffer_size`, are then replaced only by an amendment the advisor rules.
```

**D3.**

Old:
```text
Each mutation is applied, run, recorded by name with its commit and reverted. Its `RECORDED MUTATION:` comment sits beside the test.
```
New:
```text
Each mutation is applied, run, recorded by name with its commit and reverted. Its `RECORDED MUTATION:` comment sits beside the test. Predicted red set: T1's mutation, T1 and T4 (the filter reaches the same arm through `filterable_column_type`); T2's, T2; T3's, T3, run in its own test binary, since the setting also exports binary columns with large buffers; T4's, T4. A temporary mutation of `engine/src/pool.rs` is not a change under §8 items 1 and 4.
```

**D4.**

Old:
```text
No string is added or changed. Two existing texts become reachable for these two types, only from a source no ordinary file is. Both are marked for the advisor (OPEN-3):
```
New:
```text
No string is added or changed. Three existing texts become reachable for these two types, only from a source no ordinary file is. S1 and S2 are marked for the advisor (OPEN-3):
```
Old:
```text
- **S2**: the final-arm text (engine/src/attributes.rs:111-114). It is kept byte for byte by the ruling the comment at :102-108 names. It would go into the filter's `ColumnNotFilterable` reason (predicate.rs:1249-1254) and publish's `AttributeUnpublishable` detail (attributes.rs:373-376).
```
New:
```text
- **S2**: the final-arm text (engine/src/attributes.rs:111-114). It is kept byte for byte by the ruling the comment at :102-108 names. It would go into the filter's `ColumnNotFilterable` reason, inside `EngineError::AttributeUnpublishable`'s own text (predicate.rs:1249-1254; engine/src/error.rs:403-407), and publish's `AttributeUnpublishable` detail (attributes.rs:373-376).
- **S3**: the Feature tab's line naming the columns the open does not project (frontends/shell/src/feature/FeatureTab.tsx:63, :66). It would name such a column, which is true: describe marks it not projectable.
```

**D5.**

Old:
```text
   - A short doc line above the function says why: the shell reads only plain `Utf8`, and the product connection never exports the other two.
```
New:
```text
   - A short doc line above the function says why, in the engine's own facts: the product connection exports text only as plain `Utf8` (pinned by T3), so the two types are refused rather than offered unproven. It names no other module's reader.
```

**D6.**

Old:
```text
- `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:122-125` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:676fa931c7d1bbb7213e1bdf8ca950da75638729b7664e30fcf6667b50358a55 — OPEN items; as written `:122-125` (r)
```
New:
```text
- `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:122-125` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:676fa931c7d1bbb7213e1bdf8ca950da75638729b7664e30fcf6667b50358a55 — OPEN items; as written `:122-125` (r)
- `state/directives/2026-11-16-advisor-ruling-adv-2026-11-16-06-the-humans-directive-of-2026-11-16-put-in-force-focus-record-classes-runs-pieces-models-the-two-drafts-the-held-dispatches-go.md:25-26` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:<by script> — Header
- `state/directives/2026-11-16-advisor-ruling-adv-2026-11-16-04-two-nodes-from-the-architects-read-the-stream-refusal-node-after-a-read-the-dictionary-node-s3-after-b1-shell-half.md:27` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:<by script> — Header
- `state/consults/2026-11-16-large-utf8-and-utf8-view-attribute-columns-read-architect.md:28-30` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:<by script> — §0
- The Header's `governance/PLAN.yaml:7434-7450` pin is historical: it holds the node as it stood at 0bcf5434; for the node's gate and summary the tree is authoritative.
```

4. **ADR-021 (C1).** No sentence of ADR-021 becomes untrue. Its Note 2026-09-24 item 1 takes the namespace's type set from ADR-023 §2's list, "which is decided by the one admission function" (docs/adr/ADR-021-row-filter-on-viewport-query.md:233). So the set narrows by reference along with ADR-023's note. But ADR-021's own record states each change to that set. Item 1 is headed "The widening, stated rather than implicit" and names the one type it adds (:233). The Note 2026-09-29 paired ADR-023's Amendment 2026-09-29 for the namespace (:237-242). By that practice I find that ADR-021 owes a note of its own. The draft below is a draft only. Whether it is needed is the advisor's (OPEN-6). ADR-021 is accepted: the note is appended at its end, and no line of ADR-021 is edited.

````text

## Note 2026-11-23 — the filter namespace narrows by reference to ADR-023: `LargeUtf8` and `Utf8View` leave it

*Appended under the advisor's ruling <id>, under the human's delegation of 2026-11-13, not the human's words. The text above is unchanged, the Status line and the earlier Notes included. Implementation: `governance/forms/engine/LARGE-UTF8-AND-UTF8-VIEW-ATTRIBUTE-COLUMNS-PREREGISTRATION.md`.*

1. **The narrowing, stated rather than implicit.** The Note 2026-09-24, item 1, takes the namespace's type set from ADR-023 §2's admitted-type list, as the one admission function decides it. ADR-023's Note 2026-11-23 records that the function now admits plain `Utf8` alone of §2's three text types. So `LargeUtf8` and `Utf8View` columns leave the namespace; against the namespace as it stood before this note, they are the two types removed.
2. A predicate that names such a column is refused with the existing `skp.filter_column_not_filterable` (fields `column`, `reason`), with the `reason` text the namespace already gives a type the function refuses. No code is added, and decision 8's eleven codes stand.
3. The Note 2026-09-24, item 2, is unchanged: dictionary-encoded columns stay excluded by name, whatever their value type.
````

   If the advisor rules OPEN-6 yes, `docs/adr/ADR-021-row-filter-on-viewport-query.md` joins the Scope on the terms item 2 declares for ADR-023: one region, the appended note, 8 insertions and 0 deletions. In that case the lines item 2 replaces (the counting command, §5, I5, §8 item 7 and §9's Reviewer line) also cover ADR-021's note, and the amendment that records the ruling says so before any change to that file.

5. **Counts.** The Scope after this amendment is six files: the five of §2 and ADR-023's file. It is seven if OPEN-6 is ruled yes. For lines, the form's estimate for the five files is about 170 (Header, Class). ADR-023's note adds 10 insertions and 0 deletions, and ADR-021's would add 8. That is about 180, or 188 with ADR-021's note, against §7's 220, so the line ceiling holds by estimate. §7's figure of 5 files no longer holds: the Scope is now six files, or seven. §7 is not edited (OPEN-8).

6. **Cites this amendment adds**, read at 5bc4011b. The cites in the New texts that Amendment 1 already pins at 0bcf5434 are not repeated here.

- `docs/adr/ADR-021-row-filter-on-viewport-query.md:233` @ 5bc4011bf7c592e77fc393d84fe7403f651a48ed sha256:<by script> — items 3 and 4
- `docs/adr/ADR-021-row-filter-on-viewport-query.md:237-242` @ 5bc4011bf7c592e77fc393d84fe7403f651a48ed sha256:<by script> — item 4
- `docs/adr/ADR-023-attribute-projection-on-viewport-query.md:183` @ 5bc4011bf7c592e77fc393d84fe7403f651a48ed sha256:<by script> — item 2
- `state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-21-large-utf8-open-1-a-with-t3-adr-023-narrowed-by-an-appended-note-t3-kept-as-a-premise-pin.md:16` @ 5bc4011bf7c592e77fc393d84fe7403f651a48ed sha256:<by script> — item 2
- `kernel/src/session_history.rs:749-758` @ 5bc4011bf7c592e77fc393d84fe7403f651a48ed sha256:<by script> — item 3, C2
- `frontends/shell/src/App.tsx:855-858` @ 5bc4011bf7c592e77fc393d84fe7403f651a48ed sha256:<by script> — item 3, C2
- `engine/src/error.rs:403-407` @ 5bc4011bf7c592e77fc393d84fe7403f651a48ed sha256:<by script> — item 3, D4
- `frontends/shell/src/feature/FeatureTab.tsx:63` @ 5bc4011bf7c592e77fc393d84fe7403f651a48ed sha256:<by script> — item 3, D4
- `frontends/shell/src/feature/FeatureTab.tsx:66` @ 5bc4011bf7c592e77fc393d84fe7403f651a48ed sha256:<by script> — item 3, D4; as written `:66`

7. **OPEN items.** OPEN-5 to OPEN-9 go to the advisor in one message (ADV-2026-11-23-15 item 8):
   - OPEN-5: the words of ADR-023's note;
   - OPEN-6: whether ADR-021 owes a note;
   - OPEN-7: D2 and ADV-2026-11-23-21 item 5;
   - OPEN-8: §7's file figure;
   - OPEN-9: SKP-V0 §7.3.

   The gate does not wait for them.

Read the last amendment first.

Nothing above is edited.
---END OF AMENDMENT---

**What I could not settle**

1. **Held PRs and the new file.** The custodian's fact, by script at 2026-11-23T18:34Z (gh pr diff --name-only): no open PR among 350, 353, 356, 358, 359, 360, 361, 362 and 363 changes ADR-023's or ADR-021's file.
2. **ADR-023's final newline.** The custodian's fact, by script at 2026-11-23T18:34Z: ADR-023 ends with one LF, holds no CR, and its last line is line 183. The append does not change line 183's bytes.
3. **D6's pins at 0bcf5434.** I read the three D6 lines at 5bc4011b only. They hold there and say what the form uses them for. I did not read them at 0bcf5434, the commit the pins name.
4. **Pin format for a single line.** The brief asks for `path:a-b`. I wrote ADV-2026-11-16-04's single line as `:27`, as Amendment 1 writes its single lines, not as `:27-27`.
5. **How the branch is built.** ADV-2026-11-23-21 item 6 ("on PR 350's branch, as the form says") and D1 (start at main's tip and take in PR 350's head by a merge commit, per ADV-2026-11-23-15 item 4) read to me as the same build. I have not confirmed that the advisor reads them so.
6. **Line estimate.** The ~170 lines for the five original files is the form's own estimate. I did not re-estimate it.

**Drafts for the advisor** (none ruled; each a recommendation)

- **OPEN-5, ADR-023's note** (amendment item 2's fence, 10 lines). Three points are open:
  - Its heading word. "Note" follows the ruling. ADR-023's own appended text is headed "Amendment 2026-09-29 (Proposed; for the human's acceptance with B1's close)" (docs/adr/ADR-023-attribute-projection-on-viewport-query.md:163).
  - Its status parenthesis, "(Proposed; its words ruled by the advisor under the delegation of 2026-11-13)". A note cannot be more accepted than its Proposed ADR.
  - Its date, 2026-11-23, the ruling's date. If the words are ruled later, the date may follow that ruling.
  - Recommendation: take it as drafted.
- **OPEN-6, ADR-021.** Does ADR-021 owe a note? No sentence of ADR-021 becomes untrue, but its practice is to state each change to the namespace (:233, :237-242). Recommendation: yes, the draft in amendment item 4. ADR-021 then joins the Scope as class 9 (seven files, +8 lines), and the merge request waits on its words, as C1's adapted Merge line drafts it. ADR-021 is accepted; the grant's item 2 names ADR notes among the things the advisor rules.
- **OPEN-7, D2 and ADV-2026-11-23-21 item 5.** D2 changes I1's trigger from "neither setting" to "either setting", with a stop at the first failure. Item 5 read I1 as the form had it before D2. Recommendation: take D2's words. They stop earlier, and item 5's rule (the advisor rules the replacement amendment) is unchanged.
- **OPEN-8, §7's file figure.** §7 declares 5 files, and the Scope is now six, or seven. Recommendation: the closing records it as class 8 ("budget overrun, §7 not edited") with Amendment 2 as its reason, and §7 is not edited.
- **OPEN-9, SKP-V0 §7.3.** Its namespace rule is defined by `admit_attribute_type`, not by a list (protocol/skp/SKP-V0.md:451-453), and SKP-V0 names no text type, so no sentence there becomes untrue. Its dated notes of 2026-09-26 and 2026-09-29 (:455-468) are precedent for a note. Recommendation: no SKP-V0 note. A note would bring protocol/ into the Scope, and under rule (00) that is an overlap with PR 353.
- **Lead-data's Old/New drafts for the architect's gate:**
  - C1's four New texts, adapted;
  - D1's first New text, adapted;
  - item 2's seven New texts (the Scope line, the no-overlap line, the counting command, §5, I5, §8 item 7, §9 Reviewer).

**Files read** (all at 5bc4011b, in C:/dev/wt/read-1123z)
- engine/README.md, lines 380 to 568 (the owner's index at :533-568); kernel/README.md:357-396 (the owner's index)
- governance/forms/engine/LARGE-UTF8-AND-UTF8-VIEW-ATTRIBUTE-COLUMNS-PREREGISTRATION.md (whole)
- state/consults/gates/2026-11-23-large-utf8-and-utf8-view-attribute-columns-form-gate-architect.md (whole)
- state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-21-…md (whole); …-adv-2026-11-23-15-…md (whole); …-adv-2026-11-18-02-…md (whole); 2026-11-13-the-grant-approved-…md (whole); …-adv-2026-11-16-06-…md:19-28; …-adv-2026-11-16-04-…md:25-28
- state/consults/2026-11-16-large-utf8-and-utf8-view-attribute-columns-read-architect.md:26-31; …-probes-u1-u2-tester-report.md:30-57
- docs/adr/ADR-023-attribute-projection-on-viewport-query.md (whole); docs/adr/ADR-021-row-filter-on-viewport-query.md:1-20 and :220-281
- .claude/agents/architect.md (whole); docs/PREREGISTRATION-TEMPLATE.md:155-174
- protocol/skp/SKP-V0.md:445-469 (and greps)
- engine/src/attributes.rs:76-141; engine/src/predicate.rs:1244-1285; engine/src/pool.rs:180-205, :425-444; engine/src/error.rs:398-409
- kernel/src/skp.rs:2062-2070; kernel/src/publish/mod.rs:528-549; kernel/src/session_history.rs:740-764
- frontends/shell/src/App.tsx:850-861; frontends/shell/src/feature/FeatureTab.tsx:58-69
- Greps: governance/AUTONOMY.md (§21 headings); governance/forms (the ADR-021 and ADR-023 paths); governance/forms/frontends/SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md (the same paths); the repository outside state/ for LargeUtf8 and Utf8View

Model: claude-opus-5-5
