*Custodian's filing note (2026-10-14): the architect's draft of the further §2.7 blocks (H to K) that the human's OPEN-9 (B) ruling asks for (`state/directives/2026-10-14-215-c1-216-merge-current-view-open-3-b2-1b-open-1-to-10.md`, item 4), for the human's sight before b2 piece 1b's code; read at main 73a638e5; the run 2026-10-14T07:41:40Z to 2026-10-14T07:48:48Z by its transcript (Read 20, Glob 2, Grep 11; zero writes); its one SubagentHandback call, at 07:48:47Z. Extracted by script; 51 rooted path:line cite(s) de-rooted and one final newline added; nothing else changed. The message's sha256 as handed back is 00f23f8605634102f976dc296589c8c421056a3846afc4e748a7c2140ded4376; this file's, from line 5 to the end, is 2f5c60c1a0c6adee632b6880e7d7a0112ac2dae2391c2ff41860d7ce25e03491. None of it is the human's wording.*

---

**Verdict:** none. This is a drafting consult, not a gate. Reviewed: main @ 73a638e54baeda37e35ba8876ec555e37c3de64d (status at session start showed untracked files only, so the tracked files I read are at this commit). Every cite below is `path:line @ 73a638e5`. I have no Bash, so I could not compute span hashes; the reviewer recomputes them. None of the text below is the human's wording; all of it is the architect's draft for the human's sight under OPEN-9 (B) (`line 27-31 of state/directives/2026-10-14-215-c1-216-merge-current-view-open-3-b2-1b-open-1-to-10.md (at 73a638e5) @ 73a638e5`, cited and not reproduced).

**Findings that shape the blocks**
- **Canonical JSON cannot carry a definition.** The human prefers this ADR's canonical JSON for the hashed bytes. It fails for two reasons:
  - **Key order.** The grammar writes keys in the order the writer inserts them, which is a schema-declared order and not a sort (`line 24-27 of renderer/src/canonical.rs (at 73a638e5)`). A PROJJSON definition's keys follow no schema in this repository, and the engine passes the definition through as it received it (`line 124-125 of engine/src/crs.rs (at 73a638e5)`).
  - **Number domain.** The grammar refuses any non-zero double below 1e-6 or at or above 1e15 in magnitude (`line 33-37 of renderer/src/canonical.rs (at 73a638e5)`, `:240-245`). Nothing bounds a definition's numbers: the only checks are a non-blank identifier and the byte size (`line 71-84 of engine/src/crs.rs (at 73a638e5)`). So some admitted dataset could have no canonical spelling, and its steps would be refused.
  - Adding a sort rule would put a second key-order rule into the one number grammar, and it still would not fix the domain.
- **The bytes hashed instead.** The definition text exactly as the engine holds it, which is what `describe` sends as `crs.definition_json` (`line 239-241 of engine/src/crs.rs (at 73a638e5)`; `line 1891 of kernel/src/skp.rs (at 73a638e5)`). The engine already hashes a definition with no normalization (`line 98-103 of engine/src/crs_catalog.rs (at 73a638e5)`, `:176-179`; `line 1640-1642 of kernel/src/skp.rs (at 73a638e5)`).
- **Exactly one admission has no definition: the format default.**
  - A file's declaration always carries one (`line 440 of engine/src/geoparquet.rs (at 73a638e5)`).
  - An assertion always carries one through SKP (`line 1650 of kernel/src/skp.rs (at 73a638e5)`).
  - An assertion without a definition establishes no axis order and is refused (`line 380-390 of engine/src/dataset.rs (at 73a638e5)`; `line 286-291 of engine/src/crs.rs (at 73a638e5)`).
  - The format default carries `None` (`line 556-566 of engine/src/geoparquet.rs (at 73a638e5)`).
- **"The provenance class as describe reports it" is `describe`'s `crs.provenance`.** Its values are `crs:declared`, `crs:asserted` and `crs:format-default` (`line 90-97 of engine/src/geoparquet.rs (at 73a638e5)`, read at `line 1906-1909 of kernel/src/skp.rs (at 73a638e5)`), not `crs.source`'s `file`, `caller_asserted` and `format-rule` (`line 110-116 of engine/src/crs.rs (at 73a638e5)`).
  - My reading follows the consult's use of the phrase (`line 46 of state/consults/2026-10-12-adr-036-guardrails-two-checks-architect.md (at 73a638e5) @ 73a638e5`) and the round 3, item 3 ruling as `line 97-99 of engine/src/crs.rs (at 73a638e5)` records it.
  - The two vocabularies map one to one (`line 441-520 of engine/src/dataset.rs (at 73a638e5)`), so either one makes a format-default admission visible. Only the first names which rule. The human confirms the reading when they review it.

---

### Block H (OPEN-9 (B), bullet 1): `dependencies.crs` gains `definition`

§6, in the step line's table, the `dependencies` row: the substring `"crs":{"identifier","source"}` becomes `"crs":{"identifier","source","definition"}`. After the table, before `**Withheld line:**`, with one blank line on each side:
```
**`dependencies.crs`** names the coordinate space of the dataset the step was recorded on, as the engine admitted it at that open:
- `identifier` is the identifier the engine admitted. It is a label only: an equal identifier never shows that two steps share a space, and every definition with no authority and code carries the same label, `(definition-only)`.
- `definition` is `sha256:` and 64 lowercase hex characters, over the UTF-8 bytes of the definition text the engine admitted, as `describe` reports it in `crs.definition_json`: the string's value, not its JSON spelling, with nothing normalized. For a file's own declaration that text is the engine's serialization of the file's `crs` object, not the file's bytes; for a caller's assertion it is the text the caller sent. Equal hashes show the same definition text. Unequal hashes decide nothing: one definition written two ways hashes two ways, and a later version may serialize the same file's declaration differently.
- Where the engine admitted no definition, as under the format's rule for an absent `crs` key, `definition` is the named state `none-admitted` (§2).
- The text is hashed as held, not rewritten in §2's canonical subset: that subset writes keys in a schema's declared order and refuses numbers outside its domain, and a definition has keys no schema here declares and numbers nothing bounds.
```
Clause check:
- **Names the space as admitted at that open:** the fields are private and set at open (`line 166-183 of engine/src/crs.rs (at 73a638e5)`). No new file read is needed, so H1 still holds.
- **Label only; `(definition-only)`:** `line 22-28 of engine/src/crs.rs (at 73a638e5)`; no name comparison is made (`line 271-274 of engine/src/crs.rs (at 73a638e5)`).
- **The bytes; `describe`'s field:** `line 239-241 of engine/src/crs.rs (at 73a638e5)`; `line 1891 of kernel/src/skp.rs (at 73a638e5)`. The kernel's dependency `spatial_renderer::canonical::sha256_hex` already writes the `sha256:` prefix (`line 152-158 of renderer/src/canonical.rs (at 73a638e5)`), so there is no new dependency and no lock change.
- **A file's declaration is the engine's serialization:** `line 440 of engine/src/geoparquet.rs (at 73a638e5)` (`crs.to_string()`).
- **An assertion is the caller's text:** `line 1650 of kernel/src/skp.rs (at 73a638e5)` → `line 227 of engine/src/crs.rs (at 73a638e5)`.
- **A later version may serialize differently:** serde_json's map order depends on a build feature (`line 47-49 of renderer/src/canonical.rs (at 73a638e5)`).
- **`none-admitted` only for the format default:** see the findings above. The named-state form is ADR-036:34.
- **The canonical sentence:** `line 24-27 of renderer/src/canonical.rs (at 73a638e5)`, `:33-37`; `line 71-84 of engine/src/crs.rs (at 73a638e5)`.
- **Meets R1:** the guardrails brief, `line 17 of state/consults/GUARDRAILS-EPOCHS-HEIGHTS-DGGS-2026-10-12.md (at 73a638e5)`.

Form note, not ADR text: the writer reads `DatasetCrs::definition_json()` (`line 239 of engine/src/crs.rs (at 73a638e5)`). This seam joins §2.6's list.

Tests (kernel integration tests; each runs a real `open_dataset`, then `describe`, then `record_step`):
- **K10** `two_definitions_under_one_identifier_record_one_label_and_two_definition_hashes`.
  - Fixtures: F1 under `CrsMode::DeclaredLv95`, and `CrsMode::DeclaredCrs84DegreesWithLv95Identifier` (`line 160-164 of engine/src/fixture.rs (at 73a638e5)`, `:706`, `:771-773`), each with a coordinate domain the open admits.
  - Asserts: both `identifier` values equal `EPSG:2056`; the two `definition` values differ; each equals `sha256:` plus the hex of the sha256 of that open's `describe` `crs.definition_json` bytes.
  - Mutation: the writer hashes `crs.identifier()`.
- **K11** `a_format_default_admission_records_the_none_admitted_state`.
  - Fixture: `CrsMode::AbsentKey`.
  - Asserts: `definition` is the named state `none-admitted` with a basis that is not blank, and `describe`'s `crs.definition_json` is null.
  - Mutation: the writer hashes an empty text when no definition was admitted.
- **U9** `recover_refuses_a_definition_that_is_neither_a_sha256_nor_none_admitted`.
  - Mutation: the reader accepts any string for `definition`.

### Block I (bullet 2): `dependencies.crs.source`

Appended as the last bullet of Block H's list:
```
- `source` is the provenance class `describe` reports as `crs.provenance`, one of three words: `crs:declared`, the file's own `crs` member; `crs:asserted`, a caller's assertion over a file that declares none; `crs:format-default`, the format's rule for an absent `crs` key. A reader refuses any other word. A step recorded on a format-default admission therefore says so.
```
Clause check:
- **The three words and their meanings:** `line 81-98 of engine/src/geoparquet.rs (at 73a638e5)`; their assignment, `line 441-520 of engine/src/dataset.rs (at 73a638e5)`.
- **As `describe` reports it:** `line 1906-1909 of kernel/src/skp.rs (at 73a638e5)`.
- **A closed vocabulary that a reader refuses outside of:** ADR-036:33, and §5's practice at ADR-036:92.
- **Meets R8:** `line 31 of state/consults/GUARDRAILS-EPOCHS-HEIGHTS-DGGS-2026-10-12.md (at 73a638e5)`.

Form note:
- The writer reads `Dataset::admission()`'s `crs_provenance` (`line 1011-1013 of engine/src/dataset.rs (at 73a638e5)`; `line 302 of engine/src/geoparquet.rs (at 73a638e5)`), the same value `describe` reads.
- `describe`'s `not-established` arm (`line 1902-1907 of kernel/src/skp.rs (at 73a638e5)`) is unreachable. In `record_step` it becomes a stated unreachable arm that refuses and writes nothing, never a fourth word. This is the choice Amendment 1, item 4 (e) gives `RefBuildError`.

Tests:
- **K12** `each_admission_class_records_describes_crs_provenance_as_its_source`.
  - Cases: `DeclaredLv95` gives `crs:declared`; `ExplicitNull` with an SKP assertion gives `crs:asserted`; `AbsentKey` gives `crs:format-default`. Each must equal that open's `describe` `crs.provenance`.
  - Mutation: the writer writes `crs.source().as_str()`.
- **U8** `recover_refuses_a_crs_source_outside_the_three_classes`.
  - Mutation: the reader's word check on `source` is removed.

### Block J (bullet 3): the coordinate epoch reserved in §11; the selection-scope pointer corrected

§11: after the bullet beginning `- **Persisted feature ids.**`, insert:
```
- **Reserved by name, not yet defined:**
  - **a selection scope** (§6, `scope`);
  - **the coordinate epoch:** when a dataset's coordinates were observed, for a CRS whose coordinates change over time. It is a dataset fact that a later version may record as one value, as a named column holding a time per row, or as not stated. Version 1 records it nowhere, and a version-1 file's silence is not a statement that it is not stated. Adding it changes the shape, so it comes with a `version` step (§3), and a version-1 reader refuses the later file.
```
§6, in the step line's table, the `scope` row: `A selection scope is reserved (§11).` becomes `A selection scope is reserved (§11, Reserved by name).`

What is wrong with the pointer now: ADR-036:115 points to §11, but §11 (ADR-036:166-177) names no selection scope. The nearest bullet is persisted feature ids, at ADR-036:176. The consult reported the same (`line 22 of state/consults/2026-10-12-adr-036-guardrails-two-checks-architect.md (at 73a638e5)`, `:53`).

Clause check:
- **The epoch and dynamic CRSs:** the guardrails brief, `:17`, `:19`.
- **One value, a named column, or not stated:** the guardrails brief, `:21`.
- **Records it nowhere:** the word does not occur anywhere in ADR-036:1-185, and the reader reads no `epoch` key (`line 372-470 of engine/src/geoparquet.rs (at 73a638e5)`).
- **Silence is not `not-stated`:** the guardrails brief, `:19`; the consult, `:29`.
- **A change of shape is a version step, and a version-1 reader refuses the later file:** ADR-036:41.

Tests: none. Version 1 writes no epoch, and the closed key sets (ADR-036:33) already refuse one. A test would pin an absence that nothing in 1b produces.

### Block K (bullet 4): the registry paragraph

This block applies to Block B's text once Block B is applied. After the sentence ending `in B2 the target is the project's one layer.`, insert one space and:
```
A parameter that holds coordinates names the space they are in, in `dependencies.crs`'s form (§6), within its own declared shape; an action with a coordinate parameter that names no space is not registered. No action registered here has one: a filter's predicate may reference attribute columns only, never the geometry column.
```
Clause check:
- **In `dependencies.crs`'s form:** this carries the definition (Block H) and leaves room for the epoch (Block J). That is R9 (the guardrails brief, `:33`).
- **No registered action has a coordinate parameter:**
  - Block C's two rows (the form, `line 313-314 of kernel/B2-1B-RECORDING-PREREGISTRATION.md (at 73a638e5) @ 73a638e5`).
  - The geometry column is refused in a predicate (`line 1175-1181 of engine/src/predicate.rs (at 73a638e5)`), and so are function calls (`:23-27`).
  - A struct column, such as a covering bbox, is not admissible (`line 78-116 of engine/src/attributes.rs (at 73a638e5)`).
- **A residual to record, not a block:** a predicate literal compared against a numeric attribute column that a producer filled with coordinates is a coordinate the engine cannot recognize. The rule covers declared shapes only.

Tests: none. This is ADR text, and 1b registers no coordinate parameter.

---

**§7 estimate (insertions plus deletions)**
- **ADR group:**
  - Block 0 rewrite: 2.
  - H: about 9.
  - I: 1.
  - J: about 7.
  - K: 0 to 2.
  - In total about +19 to +21, on roughly 45 already estimated for blocks 0 and A to G plus ADR-022. That is about 65 of 130.
- **Kernel product:** about +40 (hash, source, state, the unreachable arm, the reader's checks), of 950.
- **Kernel tests, the risk:** K10 to K12, U8 and U9 add about 150 to 220 lines to a 700-line group that already carries 17 tests.
- **Recommendation:** the next amendment declares this work as class 9, before its code, with its own stated ceiling, rather than fitting it under §7's groups. §7 is never edited, and an overrun is class 8.

**Conflicts with blocks 0 and A to G**
1. **Block 0** lists only findings 3, 5 and 6 and the 1b items, so it would understate the amendment. Replacement line for the human's sight:
   ```
   **Amended:** in piece 1b's form (`kernel/B2-1B-RECORDING-PREREGISTRATION.md`, §2.7), before acceptance: findings 3, 5 and 6 of the human's rulings of 2026-10-09, the registered actions, the session-history store and its bound, §12, and, under the human's ruling of 2026-10-14 (OPEN-9), `dependencies.crs`'s definition and source, the coordinate epoch's reservation and the registry's rule for coordinate parameters.
   ```
2. **Block B:** Block K inserts into Block B's ruled text. Apply B first. The insertion needs the human's sight, which this round gives.
3. **Block E / U7:** no figure changes. The hash is fixed-width and the state's basis is the writer's own fixed text, but U7's worst-case line must include both new members.
4. **Blocks A, C, D, F and G:** no textual conflict. Block J's §11 insertion does not touch the two lines Block G removes.
5. **The form's own record:** §2.7's Not folded list (the form, `:344-346`) and the guardrails line (`:22`), which says the steps meet neither R1 nor R2, are both overtaken. The next amendment records this; neither line is edited.
6. **The OPEN-3 values edit the same §6 `dependencies` cell as Block H.** No block text spells them yet: Amendment 1, item 1 records the ruling by reference only. Block H's edit is a substring substitution, so it composes with whatever text spells them. That text is still owed (see below).

**Do the human's three OPEN-3 values already cover any of this?** No.
- The absent `geometry_types` state and declared-types-not-encoding are about `geometry_types`.
- The ruling that "or a state" applies to each member on its own lets the whole `crs` member be a state. That never arises for an admitted dataset (`line 293-295 of engine/src/crs.rs (at 73a638e5)`), and it does not reach the `definition` sub-member, which Block H gives its own state.
- The impact answer's fourth unspelled value, `crs.source`'s vocabulary (`line 114 of state/consults/2026-10-12-b2-1b-recording-impact-answer-lead-data.md (at 73a638e5)`), was not among the three. Block I spells it.

Not asked, offered for the same sight so the worker invents nothing: wording for the three OPEN-3 values in that cell.
```
`{"fields":[{"name","type"}…],"crs":{"identifier","source","definition"},"geometry_types":[…]}`; each of the three members may instead be a named state, on its own. `geometry_types` are the types the file declares, as written, never the engine's encoding; where the file has no `geometry_types` key it is the named state `not-declared`, and an empty declaration is kept empty.
```
Its clause check: `line 966-979 of engine/src/dataset.rs (at 73a638e5)` and `line 352-356 of engine/src/geoparquet.rs (at 73a638e5)`. If the human takes this cell, it replaces Block H's substring edit.
