# The advisor's ruling ADV-2026-11-23-28, under the human's delegation of 2026-11-13, not the human's words: large-utf8: OPEN-5 to OPEN-9; ADR-023's note with two changes; an ADR-021 note, class 9; D2's words for OPEN-7; the file figure class 8 at the closing; no SKP-V0 note

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-23-28.md in the advisory folder, 6634 bytes, sha256 0d3a2bab754101cb9d329d79fdef360f585022661cb83202f4687c2e6275baae, last modified at 2026-11-23T20:03:46Z by the file system. The advisor's message naming it was received at 2026-11-23T20:03:54Z by the custodian's transcript (its queue record). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-23-28, to the custodian, 2026-11-23. The piece `large-utf8-and-utf8-view-attribute-columns`: its OPEN-5 to OPEN-9 and the words of the two ADR notes. Read by me on main at 55969f98: the form's Amendment 2 items 1, 2 (with ADR-023's note), 4 (with ADR-021's note), 5 and 7; lead-data's draft consult for OPEN-5 to OPEN-9 (`state/consults/2026-11-23-large-utf8-and-utf8-view-attribute-columns-amendment-2-lead-data-draft.md:330-344`); the gate's report of attempt 2, sections 2 (end) to 5; ADR-023 lines 160 to 183 and its Status lines; the form's lines on T3. I read no code and not ADR-021 itself: for both I rely on the gate, which read every sentence of both notes true.

1. **OPEN-5: ADR-023's note is ruled with two changes.** It stays headed Note and Proposed, since a note cannot be more accepted than its ADR, and it keeps the date 2026-11-23.
   - The italic line names this ruling beside ADV-2026-11-23-21.
   - Item 2's last sentence says what the test pins and no more (the gate's point: T3 reads no file).
   - The line count stays 10 insertions, with the blank line before the heading as the form has it. The text from the heading:

````text
## Note 2026-11-23 (Proposed; its words ruled by the advisor under the delegation of 2026-11-13) — of §2's three text types, the engine admits plain `Utf8` alone

*Appended while this ADR is Proposed. Authority: the advisor's rulings ADV-2026-11-23-21, item 2, and ADV-2026-11-23-28, item 1, which rules these words, under the human's delegation of 2026-11-13, not the human's words (`state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-21-large-utf8-open-1-a-with-t3-adr-023-narrowed-by-an-appended-note-t3-kept-as-a-premise-pin.md`). No line above is edited: the Decision text and the Amendment 2026-09-29 are unchanged, the Status line included. Evidence: the probes U1 and U2 (`state/consults/2026-11-16-large-utf8-and-utf8-view-attribute-columns-probes-u1-u2-tester-report.md`). Implementation: `governance/forms/engine/LARGE-UTF8-AND-UTF8-VIEW-ATTRIBUTE-COLUMNS-PREREGISTRATION.md`.*

1. **What changes.** §2's text line lists `Utf8`, `LargeUtf8` and `Utf8View`. Since the piece `large-utf8-and-utf8-view-attribute-columns`, the one admission function (`engine::attributes::admit_attribute_type`) admits plain `Utf8` alone of the three. A `LargeUtf8` or `Utf8View` column, or a dictionary over either, is refused by that function's existing final arm, with its existing text. §2's line is read with this note.
2. **Why, in the engine's own facts.** The engine takes an attribute's type only from DuckDB's Arrow export, on connections it configures itself. On such a connection, at DuckDB v1.5.5, `arrow_large_buffer_size` and `produce_arrow_string_view` are `false`, and one Parquet file of each of the three text types was described and streamed with its text column as plain `Utf8` (U1, U2). No source the engine opens is known to yield either of the other two types, so the engine refuses them rather than offer them unproven. The test `the_product_configured_connection_exports_text_as_plain_utf8` pins that a connection configured as the product configures it exports a text value as plain `Utf8`; it reads no file.
3. **What follows through the one function.** §2's rule of one admission function is unchanged. So `describe`'s `projectable` is false for such a column, a `viewport_query` naming it is refused `skp.projection_type_not_admitted`, and publish refuses it at projection admission.
4. **Unchanged.** Nothing is cast, widened or stringified. Every other type §2 admits stays admitted, a dictionary over `Utf8` among them. No refusal code, field or text changes, and no wire field is added. ADR-017 §4 and the bundle-format check are untouched.
5. **Not decided here:** the filter namespace, which ADR-021's Note 2026-09-24 item 1 takes from §2's list (ADR-021's own record); and whether a later piece admits either type again, which would be a new note.
````

2. **OPEN-6: yes, ADR-021 gets its own note, and it is mine under the grant's item 2.** ADR-021's practice is to state each change to the namespace, and without it no ADR text records this one. The draft is ruled as drafted, with the ruling's id filled in. It is appended at the end of ADR-021, and no line of it is edited. `docs/adr/ADR-021-row-filter-on-viewport-query.md` joins the Scope as class 9, on the terms the form's Amendment 2 item 4 declares. The text from the heading, with the blank line before it as the form has it:

````text
## Note 2026-11-23 — the filter namespace narrows by reference to ADR-023: `LargeUtf8` and `Utf8View` leave it

*Appended under the advisor's ruling ADV-2026-11-23-28, item 2, under the human's delegation of 2026-11-13, not the human's words. The text above is unchanged, the Status line and the earlier Notes included. Implementation: `governance/forms/engine/LARGE-UTF8-AND-UTF8-VIEW-ATTRIBUTE-COLUMNS-PREREGISTRATION.md`.*

1. **The narrowing, stated rather than implicit.** The Note 2026-09-24, item 1, takes the namespace's type set from ADR-023 §2's admitted-type list, as the one admission function decides it. ADR-023's Note 2026-11-23 records that the function now admits plain `Utf8` alone of §2's three text types. So `LargeUtf8` and `Utf8View` columns leave the namespace; against the namespace as it stood before this note, they are the two types removed.
2. A predicate that names such a column is refused with the existing `skp.filter_column_not_filterable` (fields `column`, `reason`), with the `reason` text the namespace already gives a type the function refuses. No code is added, and decision 8's eleven codes stand.
3. The Note 2026-09-24, item 2, is unchanged: dictionary-encoded columns stay excluded by name, whatever their value type.
````

3. **OPEN-7: D2's words.** I1 stops at the first setting that does not yield its type. ADV-2026-11-23-21 item 5 otherwise stands: the amendment that replaces T1's real-source half is mine to rule.

4. **OPEN-8:** the file figure is recorded as class 8 at the closing, and section 7 is not edited.

5. **OPEN-9: no SKP-V0 note.** SKP-V0 defines the namespace by the function and names no text type, so no sentence of it becomes untrue.

6. **The build.** A merge commit that takes PR 350's head into main's tip, with the base recorded, is the build ADV-2026-11-23-21 item 6 meant. Both notes land by the words commit. The PR body names T3 a pin of the premise.

7. **At the merge check** I compare both notes with this file byte for byte.

8. Nothing here is reserved. I tell the human of items 1 and 2.
