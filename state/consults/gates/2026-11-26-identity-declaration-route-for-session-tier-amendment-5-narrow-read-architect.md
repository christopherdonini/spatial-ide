# The identity route's Amendment 5 draft, the narrow read by the form's gate (architect): PASS WITH NOTES

*Filed by the custodian: node:identity-declaration-route-for-session-tier@am5-narrow-read-architect, under ADV-2026-11-26-04 item 1.*

- **What it read.** The draft filed as `state/consults/2026-11-26-identity-declaration-route-for-session-tier-amendment-5-candidate-list-every-integer-width-architect-draft.md` (as handed back, 31429 bytes, sha256 3b69568d7931c7aae055ecccd9ae23b3cfd8a0e45e97ead6922938dea7e49333). It read in D:/wt/read-1124f at c28c8cf10a5b616af3ce660d13b1478d90e4ea08, read only.
- **Dispatch and run.** Dispatched just before 2026-11-26T19:04:43Z (date -u after the call), with its brief byte for byte: brief-id-route-am5-narrow-architect.md in the scratch folder, 3285 bytes, sha256 5e258ba4b4e73a7bec22468ebc937b4f81fe0ac36cdd884468768667c8d09baf. Its run comes from its completion notice only (ADV-2026-11-26-02: no transcript opened): 75 tool uses, 664539 ms, 235839 tokens. The model is opus, by its definition's model line. It handed back once, before 2026-11-26T19:22:59Z (date -u after saving), and no message was sent to it.
- **How it was written here.** The custodian wrote the report through the Write tool from the hand-back message, with the harness's two-space indent removed, byte for byte: 16694 bytes, sha256 0c0071e81eb9b0ab1813683d5af84318d6ba619fe858e0a3a2239a60293b75a6. One change was made in filing it. The profile-path hook refuses a user-profile segment, so in the scratch path of its first paragraph the segment after `C:/Users/` is masked as `<u>`. As filed below: 16689 bytes, sha256 e994d8a92cc0ffca77e5d8ab36ed0009ee3facd36c4f6f11d4e111871091f164.
- **What follows from it.**
  - R-1, the Note's Decision 3, went to the advisor with the words at 19:27Z.
  - D-1 to D-7 go to the drafter before the amendment is appended.
  - Its records matter goes in a references-only amendment by the custodian.

---

PASS WITH NOTES. I read the identity route form's Amendment 5 draft at main @ c28c8cf10a5b616af3ce660d13b1478d90e4ea08 (detached read checkout D:/wt/read-1124f). The draft itself is the scratch file `C:/Users/<u>/AppData/Local/Temp/claude/3eed48519155ece4/e5e9413a-53f6-4dd8-b414-c41d85a1b1d4/scratchpad/id-route-am5-architect-report.md`, which is on no branch. Every cite below is read at c28c8cf1. I ran nothing and wrote nothing.

**Verdict, mapped to `governance/AUTONOMY.md` §22:**
- **Correctness, the amendment:** no finding. The design breaks no rule of docs/01, docs/02 or docs/10: the list is column names on the control plane. ADR-006 is untouched and nothing touches docs/08.
- **Correctness, the ruling's own text:** one finding, R-1 below. It is a clause of ADV-2026-11-26-04 item 3's Note, which is ADR text. It goes to the advisor with words, as item 1's second bullet says. It does not hold the code. It does hold the Note's landing and the merge check of the amendment's item 15.
- **Evidence:** no finding.
- **Documentation:** D-1 to D-7. Each is fixed in the draft before it is appended, or before the merge where marked.

## 1. Does the amendment carry out the ruling?

- **Item 1, first bullet:** carried.
  - Class 9 files: the amendment's item 11.
  - Both reversed claims: its item 4, which also covers §9 items 2 and 5.
  - The consult's part 3 tests and their mutations: its item 9 (W-1 changed, W-2 new) and item 8 (the doc lines and the test rename).
  - The kernel seam test: K-2.
  - Class 8: its item 12.
  - One departure, justified: the consult wanted `engine/tests/identity.rs:131`'s message to read "integer". The amendment keeps it and gives the reason. That fixture's `id` is UInt64 (`engine/src/fixture.rs:769`), so the message stays true.
  - One gap: the class 9 and class 8 records omit work that this amendment's own §8 row triggers (D-2).
- **Item 2:** carried, in the amendment's item 7.
- **Item 3:** carried by reference in the amendment's item 6, including the order after the Note 2026-11-23. Decision 4 stays unchanged (the amendment's item 2, second bullet).
- **Item 4:** carried by reference in the amendment's item 5, with row I4 changed in its legend quote only.
- **Item 5:** carried in the amendment's item 3, guarded by §9 item 15.
- **Item 6:** carried in the amendment's item 15.

## 2. Correctness and Evidence

**Each mutation fails its test, and no existing test already catches it.**
- **M-W1** (the filter goes back to `Int64 | UInt64`).
  - W-1 fails at its list assertion.
  - W-2 fails at (i) and (ii).
  - K-2 fails at (a): the Int32 `parcel_key` gives an empty list.
  - After the fix, the only exact pin of the list is W-1 itself (`engine/src/identity.rs:394-409`). Every other candidate assertion is `contains`, `any`, or is over 64-bit or Utf8 fixtures:
    - `engine/tests/identity.rs:129-132` and :165-171;
    - `engine/tests/session_identity.rs:202-205`;
    - `engine/tests/b1_projection_hostile_names.rs:743-750`;
    - `engine/tests/b1_nul_declared_identity_no_scan.rs:50-52`, whose fixture is UInt64 plus Utf8 (`write_hostile_names`, `int: false`);
    - `kernel/tests/skp_admission_remediation.rs:300-304`.
  - The set {W-1, W-2, K-2} is right.
- **M-W2** (the filter keeps its own seven-type list, without UInt8).
  - W-2 fails at (i) for UInt8, and at (ii).
  - K-2 (c) fails, because `u8` is missing from the exact string.
  - W-1 passes (its schema at :397-403 has no UInt8). So does `only_value_preserving_integer_types_are_admitted`, which tests only `admit_column_type`, and so does the comma test (Int64 only). So does :300-304, which checks `any(c == "u64")`.
  - The set {W-2, K-2} is right.
- **M-K2** (the member is rebuilt from the file schema's 64-bit fields).
  - It compiles: `Dataset::file_schema` exists (`engine/src/dataset.rs:1052`) and `describe_dataset` already uses it (`kernel/src/skp.rs:2053-2056`).
  - K-2 (a) fails with an empty list.
  - K-1 passes: its fixtures are `parcel_key` UInt64, `bbox` and `geometry`, from `small_spec()` (`kernel/tests/skp_admission_remediation.rs:44-51`) and `fixture.rs:756`. Native and mapped stay null under the guard.
  - E-1 passes: `no-id-column.parquet` is ForeignKeyColumn with no attributes (`kernel/tests/manual_walkthrough_fixtures.rs:483-493`).
  - The set {K-2} is right.

**K-2 is written from the real interfaces.**
- It runs through `host()` (:53-60), `SkpHost::open_dataset` (`kernel/src/skp.rs:1108`), `SkpHost::describe` (:1361), `open_req` (:62-75) and the wire's `IdentityDeclaration { column }` (as used at :195-197).
- It asserts on `serde_json::to_value(&describe.identity)`. `IdentityInfo` is `Serialize`, has `class` (`protocol/skp/src/v0/commands.rs:190-209`), and `serde_json` is a normal dependency of the kernel (`kernel/Cargo.toml:31`).
- The fixture types exist and are public: `IdentityMode::NarrowInteger { width, column, values }`, `NarrowWidth::Int32`, `NarrowColumn::ParcelKey` and `NarrowValues::TopOfRange` (`engine/src/fixture.rs:564-600`).
  - (a)'s schema is `parcel_key` Int32, `bbox` and `geometry` (:761-781, :813). It has no `id`, so it reaches the session arm (`engine/src/dataset.rs:2008-2010`), and its list after the fix is exactly `["parcel_key"]`.
  - TopOfRange values are non-negative and unique (:595-597), so (b) reaches `verified-at-open-full-file`.
  - (c)'s schema order (:797-812, behind `id` Utf8 and `bbox`) gives exactly `"i8,i16,i32,i64,u8,u16,u32,u64"` after the fix and `"i64,u64"` at base, as row F-6 says.
- At P0, commit 1 compiles (`to_value` needs no new member) and fails at (a); commit 2 fails at (a) with an empty list.

**The class 9 and class 8 records.**
- They are right for what the amendment adds:
  - `error.rs`, `candidateColumns.ts` and `candidateColumns.test.ts` are new files;
  - `identity.rs` widens from "(doc only)";
  - `MANUAL-WALKTHROUGH.md` widens from "(a new Part)" to row I4.
- The arithmetic holds: about 181 lines over 11 files, against 715 over 40, gives about 895 over 43. §7's line is not edited.
- They are incomplete for ADV-2026-11-23-27 (D-2).

**The Old texts: confirmed.** All nine occur exactly once in the form above the amendment:
- :80;
- :97;
- :135;
- :490, as the semicolon form (the comma forms at :266 and :487 differ);
- :517;
- :609 (the line at :606 differs at its start);
- :670;
- :676;
- :682.

None of the New texts occurs in the form. I checked each New text's distinguishing span ("Amendment 5", "11-26-", "M-W1", "All ten tests", "the ten mutations", "candidate omissions"): Grep finds 0.

**Quotes.**
- In the amendment's item 7, the quote "`Int64` and `UInt64` only" matches `protocol/skp/SKP-V0.md:592` byte for byte.
- In the amendment's item 2, the quote of §2 item 1 matches the form at :91.
- The paraphrases are labelled.

## 3. The Note's and the strings' clauses, checked against the code

**R-1 (Correctness, the ruling's text, for the advisor): Decision 3's "and stay declarable by name" is untrue.**
- The engine leaves two kinds of column out of the list (`engine/src/identity.rs:311`, :313).
- A comma name is declarable: test :430-433, and `addressability.rs:86-97` lets it through.
- A not-addressable name is refused when it is declared (`engine/src/dataset.rs:2019-2025`). Typed any other way, it is refused as missing (:1998-2003).
- Its reach is a name holding U+0000 or an Arrow-export name that differs from the bound name (`engine/src/dataset.rs:1108-1112`). That is a hostile file, not ordinary use. But the clause is binding ADR text, so it goes to the advisor regardless of reach.
- ADR-016 Amendment 2's Consequences limit "declarable by name" to the comma case (ADV-2026-11-23-26 item 1). Decision 3 does not.

I agree with the drafter, and with the drafter's words unchanged. They are the advisor's to rule. This is ADR text, so the worker does not apply them on my word. These words are not the human's:

> 3. The columns the engine already leaves out of the list stay out of it. A column left out because its name holds a comma stays declarable by name; a column left out because nothing can address its name is refused if it is declared, as it is now.

Each clause checked:
- "stay out of it": the amendment's item 3 changes only :304, and keeps :311 and :313.
- "comma … stays declarable by name": test :430-433; `dataset.rs:2019`'s check passes a comma name (`addressability.rs:86-91`); then :2028 and the scan at :2045-2050, which quotes the identifier.
- "nothing can address … refused if it is declared": `dataset.rs:2019-2025`; `engine/tests/b1_nul_declared_identity_no_scan.rs:43-57`.
- "as it is now": this piece leaves that arm unchanged (the amendment's item 3).

After the advisor rules, the amendment's item 6 must name the ruling that carries the final bytes. Item 15's byte comparison follows it.

**The other clauses are borne out:**
- **Context.** ":165" names "64-bit integer columns". ":246" ends, verbatim, "Nothing else changes."
  - "(§4)": §4 (`docs/adr/ADR-016-stable-feature-identity-admission.md:70-75`) names no width. The eight widths are the engine's reading of it (`identity.rs:320` calls its type check, verbatim, "the whole of ADR-016 §4's "value-preserving" test"). That is a qualification, not an untruth.
  - "offered nothing": `identity.rs:304` and `IdentityDeclarationForm.tsx:54`.
  - "declared only by typing its name": true of the wire and of the refusal form.
- **Decision 1:** true together with Decision 3.
- **Decision 2:** schema order (`identity.rs:301-314`), no sort anywhere, and nothing preselected (`identityDeclarationState.ts:25-27`).
- **Decision 4:** true of the piece's code. Every refusal arm and the session arm call one function (`dataset.rs:2002`, :2009, :2023, :2084, :2096; `identity.rs:343`), and `describe` reads `identity.candidate_columns()` (§2 item 2). It is not true at c28c8cf1, where there is no member (`kernel/src/skp.rs:2034-2052`). It lands with the code.
- **Decision 5:** the words are at :165. "Nothing else of that bullet changes" reads as this Note's own effect. Amendment 2, earlier in the same PR, already narrows the bullet's first clause on the session tier, and the Note does not contradict that.
- **Consequences.**
  - "checked … exactly as one typed": the engine never consults the list for a declared column (`identity.rs:295-298`; `dataset.rs:1968-2028`).
  - "every width streams": `engine/src/stream.rs:2702-2738`. The test of a declared column covers Int32 only (`engine/tests/narrow_integer_id_stream.rs:161-189`). The Note 2026-11-09 that the clause cites is about `id`, but the code bears the claim out for a declared column.
  - The other two Consequences are true.
- **The legend, `Integer columns, schema order, unranked`:** true. The predicate is all eight Arrow integer types, and the order is as above. It shows only when the list is non-empty (:54).
- **The hint, `A column not listed above can still be typed by name; it is checked when the file is opened.`:** true.
  - The free text takes any non-empty name (`identityDeclarationState.ts:39-41`).
  - The checks at open are `dataset.rs:1984-2003`, :2019-2025, :2028 and :2045-2098.
  - With an empty list there is no list above, and the sentence covers every column.
  - Two cases go in the source comment, neither of them ordinary use:
    - a NUL name cannot be typed (the amendment's item 5 already names it);
    - the free text trims spaces at either end (`identityDeclarationState.ts:40`). A space-padded integer column is still listed and is picked as it is (:36-37). Only an unlisted padded name is sent trimmed, and such a name is refused anyway unless it is an integer column whose name also holds a comma or U+0000 (D-6).
  - No words are needed.

## 4. The drafter's findings outside the amendment's scope

- **Unrecorded ADV-2026-11-23-27 items 2 and 4: true.** Grep finds no "11-23-2[5-9]" or "11-23-3x" anywhere in the form. Item 2's class 9 is now triggered by this amendment's own §8 row: the partitioned node is a base through `error.rs`. Its fixture, `protocol/skp/tests/data/v0-error-identity_ordinal_partitioned_unsupported.json`, is not in §7's Scope. It must be declared before its code, by the round 25 class 9 rule. Record both items **in this amendment** (D-2). It already holds the class 9 list, the class 8 table and the row that triggers item 2, and a second amendment would split one Scope record across two texts.
- **Text-id: true.** `governance/PLAN.yaml:5039` says "64-bit". The text-id form at :27 rests on `identity.rs:304`. Both are text-id's to re-read at its base, which is this piece's head.
- **Corpus #12: true as stated.** `MANUAL-WALKTHROUGH.md:1592` records the outcome rather than asserting it. No step fails.
- **Stale cites at `KNOWN-LIMITATIONS.md:68`: true.** Today they are `identity.rs:317-346` and `error.rs:359-364`. They are in item 3, which this piece edits, so they are a class 3 fix inside Scope (D-7).
- **A third width list in `stream.rs:2709-2738`: true, and only a note.** A related note, out of scope: the message at :2740 reads, verbatim, "expected a 64-bit integer", although eight widths are taken.
- **The `protocol/` place: true.** `SKP_VERSION` is "skp/0.14" at `protocol/skp/src/v0/mod.rs:136` and `frontends/shell/src/skp/types.ts:15`.
- **The old test name: true.** The narrow-id form names W-1's old name (`governance/forms/engine/NARROW-INTEGER-ID-UNSTREAMABLE-PREREGISTRATION.md:228`). Its first word, `candidate`, is not one of the narrative prefixes at `scripts/plan/verify-test-claims.mjs:105-110` @ c28c8cf1, so renaming W-1 does not make that done node's claim binding.

## Documentation findings, must fix (not prose to restate)

- **D-1: two ambiguous references.**
  - The amendment's item 9 reads "Commit 2 lands §2 without item 3. Commit 3 lands item 3". That reads as §2 item 3, the shell types. Replace it with: "Commit 2 lands §2. Commit 3 lands this amendment's item 3 with this amendment's item 8 doc lines."
  - The amendment's item 1 reads "Item 2 records…" through "Item 6 is the merge check". Write "The ruling's item N" each time.
- **D-2: ADV-2026-11-23-27 is missing from the class 9 and class 8 records.**
  - Add to item 11: `protocol/skp/tests/data/v0-error-identity_ordinal_partitioned_unsupported.json`, class 9, while the partitioned node is a base (ADV-2026-11-23-27 item 2). `SKP-V0.md:734-735` is already in Scope.
  - Add to item 12's ADR row the Note 2026-11-23, about 6 lines (ADV-2026-11-23-27 item 4), and add those lines to the totals.
- **D-3: a tool claim without the tool's commit.** The amendment's item 8 says "The old test name is not test-shaped". Name the tool's commit and the test it means: "`candidate_columns_are_the_64_bit_integer_columns_in_schema_order_unranked` is not test-shaped for `scripts/plan/verify-test-claims.mjs` @ c28c8cf1 (its first word is not a prefix at :106)". This is the round 15 (c) rule.
- **D-4: an overstatement.** The amendment's item 4 New text for Amendment 2 item 2 says "every column of an integer width admission takes". Add ", less the engine's two omissions".
- **D-5: a cite in the wrong place.** In the amendment's item 7 draft paragraph, "(ADR-016, Note 2026-11-26)" stands after the fixtures sentence, which the Note does not state. Move it to the end of the first sentence.
- **D-6: one case missing from the source comment.** In the amendment's item 5, the source-comment bullet should also name the trim at `identityDeclarationState.ts:40`, and the hint's sight. No row quotes the hint; row I4 shows it unquoted.
- **D-7 (before the merge): the stale cites.** Fix `KNOWN-LIMITATIONS.md:68` at this piece's final lines, as class 3, and tell text-id.

Also a records matter for the custodian, in a references-only amendment: the form does not yet record the rulings after ADV-2026-11-23-22 that bind it, ADV-2026-11-23-26 items 2 to 4 and ADV-2026-11-23-35 item 2 among them.

No ADR skeleton is needed: the missing decision is ruled (ADV-2026-11-26-04 item 3).

Files I cited, under D:/wt/read-1124f:
- `governance/forms/frontends/IDENTITY-DECLARATION-ROUTE-FOR-SESSION-TIER-PREREGISTRATION.md`
- `engine/src/identity.rs`, `engine/src/dataset.rs`, `engine/src/fixture.rs`, `engine/src/addressability.rs`, `engine/src/error.rs`, `engine/src/stream.rs`
- `kernel/src/skp.rs`, `kernel/tests/skp_admission_remediation.rs`, `kernel/tests/manual_walkthrough_fixtures.rs`
- `frontends/shell/src/admission/IdentityDeclarationForm.tsx`, `frontends/shell/src/admission/identityDeclarationState.ts`
- `protocol/skp/SKP-V0.md`
- `docs/adr/ADR-016-stable-feature-identity-admission.md`
- `scripts/plan/verify-test-claims.mjs`

Model: Opus 5.5 (claude-opus-5-5).
