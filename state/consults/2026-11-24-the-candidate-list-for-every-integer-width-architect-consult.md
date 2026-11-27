# The candidate list for every integer width admission takes: the engine function, what pins the list, the words of ADR-016, and where it lands (architect consult)

*Filed by the custodian: consult:the-candidate-list-for-every-integer-width. A consult, not a gate, with no piece behind it; placed by the advisor's ADV-2026-11-24-23, item 3 (state/directives/2026-11-24-advisor-ruling-adv-2026-11-24-23-the-humans-message-of-09-52z-placed-every-case-settled-not-an-approval-identity-route-first-r6-its-own-piece.md). Dispatched at 2026-11-24T10:39:40Z to the architect on opus, its brief byte for byte (brief-candidate-widths-consult-1.md in the scratch folder, 10125 bytes, sha256 4e8629f49d33dbebd0f8813d2a39759694539e1f292910481f520da07ca0b823) with that ruling in it byte for byte; read only in the detached checkout D:/wt/read-1124f at main 20ed759b71064079792541f2a76cf804a6c84bc1; its run: Read 41, Grep 36, Glob 3, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-24T10:39:40Z to 2026-11-24T10:49:48Z by its transcript; 0 calls named the main checkout; handed back once, at 2026-11-24T10:49:48Z; no message was sent to it. Its recommendations are for a ruling; nothing is placed by this filing. Filed below the rule, 15698 bytes, sha256 d36bcacba5d5722c5090e6188b5551cfb0af85a671825eca846dbc7d814a23b6, byte for byte, nothing masked, with one final newline added.*

---

detached read checkout `D:/wt/read-1124f` @ 20ed759b71064079792541f2a76cf804a6c84bc1. This is a consult, so it gives no gate verdict. Every cite is at that commit. Nothing was run.

**Recommendation:** put the change in the identity route, before its code. One condition: the ADR-016 text in item 4 is ruled before that code starts. If it is not ruled when the sitting ends, the identity route starts as it stands, and the change becomes its own piece straight after text-id. I found no principle, boundary or undo-class problem. The list is a few column names on the control plane, worked out from the schema with no read: docs/02 and docs/10 hold, ADR-006 is untouched, and there is no docs/08 risk.

## 1. Today

- **What admission takes:** all eight integer widths, `UInt64 | UInt32 | UInt16 | UInt8 | Int64 | Int32 | Int16 | Int8` (`engine/src/identity.rs:333`), for both a native `id` and a declared column. The type check is called at `engine/src/dataset.rs:2028`.
  - Values are checked at open: the negative check is `dataset.rs:2076-2086` and the repeat check `:2088-2097`.
  - Every width streams: the narrow-width branches are `engine/src/stream.rs:2690-2738`.
  - A test proves a declared Int32 `parcel_key` opens and streams (`engine/tests/narrow_integer_id_stream.rs:161-189`).
- **What the list offers:** only `D::Int64 | D::UInt64` (`identity.rs:304`). The function's own doc says it is narrower than what admission accepts (`:281-283`).
- **Where they diverge:** at `identity.rs:304` against `:333`. Every refusal and the session tier call the same function: `dataset.rs:2002`, `:2008-2010`, `:2023`, `:2084`, `:2096`, and `identity.rs:343`. So the gap is the same on both carriers.
- **The ADR:** the settled block says "64-bit integer columns in schema order" (ADR-016 `:165-166`). The Note 2026-11-09 widened only §2 and ends "Nothing else changes." (`:246`).
- **This was deliberate.** The narrow-id form recommended a note under which "the candidate list stays 64-bit" (`governance/forms/engine/NARROW-INTEGER-ID-UNSTREAMABLE-PREREGISTRATION.md:388`, and also `:87`). The human's note came after that recommendation.

## 2. The change

- **Engine function:** `candidate_identity_columns` (`identity.rs:299-315`). The filter at `:304` should test the same set `admit_column_type` admits at `:333`.
  - Recommended: one shared private predicate that both sites call. The gap exists because there are two lists, and one predicate stops them drifting apart again.
  - The address filter (`:311`) and the comma filter (`:313`) stay.
- **Order:** schema order across all widths, because the filter keeps the order of `schema.fields()` (`:301-314`).
  - Widths are not grouped. Putting 64-bit columns first would be a ranking, which is forbidden (ADR-016 `:165-169`; ADV-2026-11-23-26 item 1, Decision 3, `state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-26-…md:23`).
- **Does anything outside the engine read the widths?** No code does.
  - The kernel joins the names (`kernel/src/skp.rs:2235`).
  - The shell splits them (`frontends/shell/src/admission/candidateColumns.ts:14-17`) and shows them as given (`IdentityDeclarationForm.tsx:61-71`).
  - The identity route's new member copies `identity.candidate_columns()` (its form, §2 item 2, `:96`).
  - Only text states the width. Two of those texts are shown in the app:
    - the legend `IdentityDeclarationForm.tsx:60`;
    - the hint `:77-80`.
  - Docs and comments: `identity.rs:201-204` and `:281-283`; `engine/src/error.rs:158-159`; `kernel/src/skp.rs:2234`; `protocol/skp/tests/fixtures.rs:900-901`; `IdentityDeclarationForm.tsx:15-16` and `:56-59`; `candidateColumns.ts:11`; `MANUAL-WALKTHROUGH.md:598` (row I4 quotes the legend).
  - `protocol/skp/SKP-V0.md:591-592` is skp/0.2's history and stays as written.

## 3. What pins the list

| Path | Pins | Needs |
|---|---|---|
| `engine/src/identity.rs:394-409` (`candidate_columns_are_the_64_bit_integer_columns_in_schema_order_unranked`) | the only test that pins the exclusion: expects `["big_signed","big_unsigned"]`; message at `:407` | expect `big_signed, small_signed, big_unsigned`; rename; add a case with all eight widths, with a recorded mutation (filter back to 64-bit only) |
| `identity.rs:411-434` | comma omission | none |
| `engine/tests/identity.rs:129-132`, `:165-171`; `engine/tests/session_identity.rs:202-205` | `contains`, UInt64 fixtures (`engine/src/fixture.rs:756`, `:769`) | none; the message at `identity.rs:131` should read "integer" |
| `engine/tests/b1_projection_hostile_names.rs:743-750`; `engine/tests/b1_nul_declared_identity_no_scan.rs:50-52` | the U+0000 omission (UInt64/Utf8 fixtures, `fixture.rs:1728-1742`, `b1_projection_hostile_names.rs:53-62`) | none; N-9's mutation still bites |
| `kernel/tests/skp_admission_remediation.rs:300-304` | `any(c == "u64")` on `FilterWitness` (eight widths, `fixture.rs:797-809`) | passes unchanged, and the list grows to eight names |
| `protocol/skp/tests/data/v0-error-identity_unusable-with-candidates.json:7`; `protocol/skp/tests/fixtures.rs:905-919`; `conformance/fixtures/responses-accept.json:101` | names only | doc `fixtures.rs:900-901` only |
| `frontends/shell/src/admission/candidateColumns.test.ts:17` | test name | rename |
| e2e `admission-remediation.mjs:460-465`, `regression.mjs:2401-2411`; the identity route's E-1, K-1, T-1 | exact or included `parcel_key` on UInt64-only fixtures | none: no walkthrough fixture has a narrow column (`kernel/tests/manual_walkthrough_fixtures.rs`, by Grep) |
| `v0-describe-response-session-ordinal.json:34` | Int64 `parcel_id` | none |

**Owed: one real-shape test of the seam.** It is a kernel test through `SkpHost` on `IdentityMode::NarrowInteger { Int32, ParcelKey }` (`fixture.rs:761-768`). It asserts that the session-tier `describe.identity.candidate_columns` is `["parcel_key"]`, and that a declared open of that column comes back `mapped:parcel_key`. Mutation: the filter goes back to 64-bit only.

## 4. The words of ADR-016

- **The settled block's fourth bullet** (`:165-169`) is accepted text in the tree. It cannot be edited, so it is superseded by an appended text.
- **Amendment 2's Decision 4** was accepted by ADV-2026-11-23-26 item 1 (`…-26-…md:24`) but is not yet in the tree. The advisor compares it byte for byte at the merge check (item 5, `:51`).
  - **It needs no change on either route.** It says only that "this amendment" does not change the candidates, which stays true when a later text does.
  - Changing it would mean a new ruling that replaces item 1's text before the append. I recommend against that.
- **What would change:** one appended Note, after the Note 2026-11-23 in the identity route's PR, or after Amendment 3 in a later piece. The skeleton is in "ADR skeleton" below.
- **In the identity route's form,** Amendment 2 item 2's line "Which columns are candidates: 64-bit integer columns…" (`IDENTITY-…-PREREGISTRATION.md:517`) is superseded by the form amendment.

## 5. The size

The change is about 100 lines over 11 files:

| Module | Files | Lines |
|---|---|---|
| Engine | `identity.rs`, `error.rs` doc | ~35 (code ~8, docs ~6, tests ~20) |
| Kernel | `skp.rs` comment, the new test in `skp_admission_remediation.rs` | ~35 |
| Protocol | SKP-V0.md: a sentence in the new version's section 8 entry; `fixtures.rs` doc | ~5 |
| Shell | `IdentityDeclarationForm.tsx` (two shown strings and docs), `candidateColumns.ts`, `candidateColumns.test.ts` | ~10 |
| Documents | ADR-016 Note; MANUAL-WALKTHROUGH row I4 | ~10 |

As its own piece, add a literal bump if one is needed (point 7, R2). That is about 190 lines over 22 or more files, as the identity route's form estimates for its own bump (`:236`, `:323`).

## 6. Where it lands

**(i) In the identity route, before its code.**
- 8 of the 11 files are already in its Scope (§7 `:228-234`, and Amendment 2). The three new ones are `error.rs`, `candidateColumns.ts` and `candidateColumns.test.ts`, all class 9. MANUAL-WALKTHROUGH row I4 is outside §7's "(a new Part)", so it is class 9 as well.
- It rides `skp/0.15`, so it needs no second literal. The new member is born with the wider rule.
- The list reaches session-tier users for the first time through this piece, so it should be right the first time.
- **Cost:** it reverses a "Declared unchanged" item, "the engine's candidate rule (`identity.rs:299-315`)" (`:80`), and block-on-sight item 2 as amended (`:609`, engine code limited to docs). It adds two shown strings against §2 item 6's "The form's legend, hint and button are unchanged" (`:135`) and §9 item 5 as amended (`:490`).
  - These are claims, not words. So the amendment needs one narrow form-gate read beyond attempt 2's PASS WITH NOTES (Amendment 4 item 1, `:901`).
  - The class-8 overrun predicted in Amendment 2 item 7 (`:743-753`) grows from about 715 lines and 40 files to about 815 and 43. It is recorded before code, and §7 is not edited.
- **ADV-2026-11-23-35's order** is unaffected. Text-id builds on this head, and its own edits are in other regions: `identity.rs:336-344`, the detail; `error.rs:182-189` and `:359-364` (text-id form `:80-83`, and Amendment 3 item 5). Text-id's C4 removes `id` on the set-aside open, and Amendment 3's draft line "the list the refusal carried, from the same function" (`state/consults/2026-11-23-text-id-…-adr-016-amendment-architect-draft.md:64`) stays true.
- **The risk** is to ruling item 2's start: no code may come before its amendment. Everything here is reading, which the directive of 2026-11-23 item 5 allows during the sitting (`:25`).

**(ii) Its own piece, straight after text-id.**
- Under item 5 (`:24`) it builds on text-id's head and merges after it, because it shares `identity.rs`, `error.rs`, `IdentityDeclarationForm.tsx` and MANUAL-WALKTHROUGH.
- It leaves the identity route and Decision 4 untouched.
- **But:**
  - Under SKP-V0.md §4 item 13, a change to a version after its merge needs a new literal (`:305`, `:318`). The skp/0.2 entry records the field as "`Int64` and `UInt64` only" (`:591-592`). So this route likely takes a fourth literal after `skp/0.16`, and it competes with the recovery offer for the `protocol/` place (text-id Amendment 2 item 2, `:502-503`).
  - It is a full form, because it touches the wire's meaning, an ADR, shown strings and a seam.
  - Until it lands, a session-tier file whose only key is 32-bit is offered an empty list.

**The tag** (item 5, `:23`) makes no difference: both routes merge after it.

**Recommendation: (i)**, with the fallback stated at the top. The literal saving is about twice the change itself.

## 7. For a ruling

- **R1. Where it lands:** (i), with the fallback above.
- **R2. Is a wider set of values in an existing field a change that needs a new literal (SKP-V0.md §4 item 13 (iv))?** Recommended: yes, so that a documented meaning never changes silently under a frozen version. Under (i) the answer costs nothing: `skp/0.15`'s section 8 entry records it.
- **R3. Who words the ADR Note.** The delegation of 2026-11-13 item 2 names ADR amendments as the advisor's. But this reverses a point the human's Note 2026-11-09 left in place with "Nothing else changes.", after the architect recommended keeping the list 64-bit (narrow form `:388`). Recommended: the advisor brings it to the human as a draft with an id, during the sitting.
- **R4. The two shown strings (P6), legend and hint.** These words are mine, not the human's (the source comment `:56-59` gives the legend to a reviewer note). Drafts for the advisor follow.
  - Legend: "Integer columns, schema order, unranked".
    - "Integer columns" is the shared predicate (`identity.rs:333`).
    - "schema order" is `:301-314`.
    - "unranked": nothing sorts the list.
  - Hint: "A column not listed above can still be typed by name; it is checked when the file is opened."
    - Names left off the list stay declarable (`identity.rs:290-298`, test `:411-434`). The free text takes any name (`IdentityDeclarationForm.tsx:30-32`).
    - "checked when the file is opened": the open refuses a column that is missing (`dataset.rs:1998-2003`), one nothing can address (`:2019-2025`) or the wrong type (`:2028`), and scans the values (`:2045-2098`).
  - MANUAL-WALKTHROUGH row I4's quote follows the legend.
- **Notes, out of scope:**
  - R6, the null refusal, applies to narrow columns as it does to 64-bit ones.
  - `engine/src/lod.rs:1368-1380`, `engine/src/index.rs:471-475` and `engine/src/layout.rs:470-471` read only 64-bit (index: UInt64 only) identity values. No SKP command reaches them (`kernel/src/skp.rs:2285`), and a narrow id typed by name reaches them today anyway.
  - The six files of the human's message, item 2: that message is not in the tree at 20ed759b, so I could not read them.

## ADR skeleton (a draft for the advisor, not the human's words)

- **Context.** The settled block's fourth bullet names 64-bit columns only. The Note 2026-11-09 widened §2 alone. Admission takes eight widths (§4; `identity.rs:333`), so a file whose unique key is narrower is offered nothing.
- **Decision.**
  - The candidate list holds every column whose type §4 admits, an integer of 8, 16, 32 or 64 bits, signed or unsigned.
  - It stays in schema order, unranked, with nothing preselected.
  - The columns the engine already leaves out stay out.
  - The refusal and `describe.identity` (Amendment 2) carry the same list.
  - Nothing else changes.
- **Consequences.**
  - A narrow column taken from the list is checked exactly as one typed by name (`dataset.rs:2028-2098`) and streams (`stream.rs:2690-2738`).
  - The list may grow on existing files.
  - The change is recorded in the section 8 entry of the version that carries it.

## Files read

Under `D:/wt/read-1124f`:
- `engine/src/identity.rs`, whole
- `engine/src/dataset.rs:730-819`, `:1960-2109`
- `engine/src/stream.rs:2655-2743`
- `engine/src/lod.rs:1355-1384`, `:1805-1855`
- `engine/src/index.rs:295-334`, `:455-484`
- `engine/src/fixture.rs:730-839`, `:1728-1753`
- `engine/src/addressability.rs:15-29`
- `engine/src/error.rs` and `engine/src/attributes.rs`, by Grep
- `engine/tests/identity.rs:85-194`
- `engine/tests/session_identity.rs:160-219`
- `engine/tests/b1_projection_hostile_names.rs:700-759`
- `engine/tests/b1_nul_declared_identity_no_scan.rs`, whole
- `engine/tests/narrow_integer_id_stream.rs:95-207`
- `engine/tests/multipolygon_corpus.rs:15-54`
- `kernel/src/skp.rs:2215-2244`
- `kernel/tests/skp_admission_remediation.rs:260-329`
- `protocol/skp/tests/fixtures.rs:895-919`
- `protocol/skp/tests/data/v0-describe-response-session-ordinal.json`
- `protocol/skp/SKP-V0.md:280-319`, `:585-634`
- `frontends/shell/src/admission/IdentityDeclarationForm.tsx`, `frontends/shell/src/admission/candidateColumns.ts`
- `frontends/shell/e2e/admission-remediation.mjs:440-477`, `frontends/shell/e2e/regression.mjs:2360-2419`
- `frontends/shell/MANUAL-WALKTHROUGH.md`, by Grep
- `docs/adr/ADR-016-stable-feature-identity-admission.md`, whole
- `governance/forms/frontends/IDENTITY-DECLARATION-ROUTE-FOR-SESSION-TIER-PREREGISTRATION.md:1-357`, `:440-1027`
- `governance/forms/frontends/TEXT-ID-OPENS-FOR-THE-SESSION-BY-ROW-POSITION-PREREGISTRATION.md:20-159`, `:495-584`
- `governance/forms/engine/NARROW-INTEGER-ID-UNSTREAMABLE-PREREGISTRATION.md:78-99`, `:375-399`
- `governance/PLAN.yaml:5015-5054`, `:6630-6650`
- `state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-26-…md`, `-27-…md`, and `2026-11-23-the-humans-message-never-idle-…md:8-29`
- `state/consults/2026-11-23-advisor-draft-adv-2026-11-23-34-…md`, and `2026-11-23-text-id-…-adr-016-amendment-architect-draft.md`, by Grep

Model: Opus 5.5 (claude-opus-5-5).
