*Custodian's filing note (2026-10-22): the architect's draft, read only at main 55618ab5, of the words of piece 1c's appended ADR-036 amendment (its form's section 2.10: W, D, M, H, S and C) and of ADR-022 Amendment 2's text. The run 2026-10-22T14:08:31Z to 14:22:19Z by its transcript (Glob 1, Read 39, Grep 35; no Write, Edit or Bash). None of these words is the human's until the human approves them; under the form's I4 and section 8 item 7, step 1's product code waits for that approval, and the words with OPEN-V1 to OPEN-V3, OPEN-F1, OPEN-M1, OPEN-M2 and OPEN-C1 go to the human on Monday 2026-10-26. ADR-022 Amendment 2's body was rebuilt by script from the human's three lines under reading (a) and is equal to the draft's, byte for byte. Its cites are unpinned here; the custodian pins them when the words are committed. Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is c9cff1bad49ae134758855584a70220bf541e6b5bdd93aad29faceb04e651789.*

---

Drafted: b2-piece-1c-save-and-reopen, the appended ADR-036 amendment's words, at main 55618ab5

**These words are not yet the human's.** They become the human's only when the human approves them. Until then they are the architect's draft for the human to approve, under the form's I4 and §8 item 7. I had no shell, so this report gives no sha256 anywhere. The custodian pins every cite by script. Every cite below was read in the main checkout at 55618ab5. I read none of the working-tree edits (CUT-STATE, PLAN, queue, site).

The reuse index, as briefed, applies only as concepts:
- atomic-file-replace (Rust std, ADOPT) is the form's own atomic save. It adds no ADR words.
- format-forward-compatibility (KiCad keeps the original) is item 2's previous lineage, kept on the machine.
- append-log torn-tail recovery is §9 as it already stands.
- "machine store" and "canonical json number" returned no prior art. Item 1's number spelling therefore uses the repository's own `HexF64` codec, so nothing is copied from outside.

---

## 1. The appended ADR-036 amendment, whole

To be appended after `## Consequences`, at the end of `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md`. The heading is my proposal; its form and date are the custodian's or the human's to set. Mapping to the form's letters: 1 = W, 2 = D, 3 = M, 4 = H, 5 = S, 6 = C.

```markdown
## Amendment 1 — piece 1c: the `workspace` member, which save a lineage file is from, the machine store, a steps file's locators, the session record after the first save, and the reader's ceilings (b2-piece-1c-save-and-reopen, <date of the human's approval>)

Appended after acceptance, from piece 1c's form (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md`, §2.10), landing no later than its writer (§11). The words are the architect's, approved by the human.

1. **The project file's `workspace` member** (§11; piece 1c's OPEN-10, OPEN-11 and OPEN-12). It is `{"filter":…,"clauses":[…],"style":…,"view":…}`, with these four members in this order:
   - `filter`: the filter applied when the project was saved, in `filter.apply`'s form (§6), `{"predicate":<text>,"dialect":"duckdb-expr/0"}`, or `null` where none was applied.
   - `clauses`: the filter clauses in their order, each `{"text":<text>,"enabled":<true|false>}`. A text is kept byte for byte as typed. A clause carries no id.
   - `style`: an ADR-017 §5a style document, whatever the dataset's geometry, with its members in the order of §5a's canonical form (ADR-022 Amendment 2). A reader refuses a document the renderer refuses.
   - `view`: the map view, `{"crs":…,"centre":[<x>,<y>],"zoom":<z>}`. `crs` names the space of the dataset the view was saved over, in `dependencies.crs`'s form (§6). `centre` is the point at the middle of the canvas, x then y, in that space's coordinates. `zoom` is the base-2 logarithm of the number of logical (CSS) pixels that one unit of those coordinates spans on the canvas.
   - **How `view`'s numbers are written.** Each of the three is a string of 16 lowercase hex digits, the big-endian IEEE-754 bit pattern of the value: the form SKP gives a bit-critical scalar (`HexF64`, `protocol/skp/SKP-V0.md` §3; ADR-004's amendments of 2026-08-03). A reader refuses any other spelling, and a pattern that is not a finite value. §2's number grammar cannot write a value with 0 < |v| < 1e-6 or |v| ≥ 1e15; written this way, every finite value, these included, is kept exactly as held: nothing is rounded, and no save is refused for it.
   - **The analysis settings** are reserved by name. Version 1's `workspace` has no member for them; adding one changes the shape and comes with a `version` step (§3).
   - **A selection made by clicking is not saved:** `workspace` has no member for it (round 69, item 4; §11 reserves a selection scope by name).
   - As §11 states, this amendment completes version 1 and is not a version step.

2. **Which save a project file and a lineage file are from** (§8; the human's ruling 4 of 2026-10-09 and its note for piece 1c's form; round 69, item 1). Where the project file's `lineage` member records a lineage, a reader compares the folder's lineage file with the member, in this order:
   1. If the lineage file's header line and its first `steps` step and withheld lines, each with its LF, have the member's `sha256`, those lines are the project's lineage. If lines follow them, the reader reads none of those lines as the project's, and says that the lineage file holds lines after the save the project file records.
   2. Otherwise, if the previous lineage file kept for the project on this machine (item 3) has the member's `sha256` and `steps`, it is the project's lineage, and the reader says that the folder's lineage file is not the one the project file records.
   3. Otherwise, the reader reads no lineage file as the project's lineage, and names the project file and the lineage file as from different saves, or names the lineage file as missing.

   Where the member is the state `not-kept` and the folder holds a lineage file, the reader does not read it, and names it as from a different save. A writer that replaces a lineage file first keeps a copy of the file it replaces, as `previous-lineage.jsonl` in the project's machine folder (item 3), until the project file that records the new one is written, so that §1's rule that nothing else in the folder belongs to the format still holds.

3. **The machine store for a saved project** (§1, §4, §9). Under the per-user data directory that holds §9's sessions, a saved project has a folder `spatial-ide/projects/<record>/`, where `<record>` is the project identity's 32 hex characters. It holds:
   - `locations.json`, in §9's `spatial-locations` format: where this machine found each dataset the project names;
   - `folders.json`: the project folders this machine has opened the identity from, by absolute path, and the answer to §4's question for each;
   - `open.lock`, held under an exclusive lock while the project is open, so that a second open of the same identity, in this process or another, is refused by name. The lock must be one that the operating system releases when the process holding it ends, so that a crash never leaves the project locked;
   - `previous-lineage.jsonl`, only while item 2's writer keeps it.

   None of these is ever in a project folder, nothing in them is copied into a project file or a steps file (§2), and the end of a session clears none of them. Two files this ADR defines hold an absolute path: `locations.json`, wherever it is kept, and `folders.json`. This widens §9's sentence that `locations.json` is the only one.

4. **The locators a steps file's header carries** (§5, §6). In a lineage file's header, each dataset entry carries the locators that the project file's entry for the same dataset carries, under §5's rule for a project file. In a session history's header, each dataset entry carries the `machine-recorded` locator only. Like §5's rule, this binds the writer.

5. **A session history's record after the first save** (§9; piece 1c's OPEN-18). At a project's first save, the session's history moves to the project's record: `<record>` becomes the project identity's 32 hex characters, and the header's `project` is the project's URI, which §6's header already admits. The kept lines are carried over under that header, and the `unsaved-` record is then removed. Where an `unsaved-` record's first step is also in a project's record, as after a crash between the two, recovery offers the project's record only.

6. **The reader's ceilings, by number** (§2, bounded readers). A reader refuses, by name and without truncating:
   - a project file over 1,048,576 bytes;
   - a dataset entry with more than 8 locators;
   - a string over 4,096 bytes, in a project file or in a dataset entry, except a CRS assertion's `definition_json`, which is bounded at 65,536 bytes, the engine's own bound on a CRS definition;
   - a `project-relative` `at` of more than 64 segments;
   - a `folders.json` that holds more than 256 folders.

   An array in a project file has no ceiling of its own: the file's size bounds it. §9's bounds on a session history stand.
```

### Clause checks (form = `kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md`; ADR-036 = `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md`; all `@ 55618ab5`)

**1 (W)**, against the form's §2.10 W at `kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:383-391 @ 55618ab5` and its writer order at `kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:210-213 @ 55618ab5`:
- **`filter`.**
  - Its form is `filter.apply`'s params (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:174 @ 55618ab5`).
  - The shell's `Filter` is `{predicate, dialect}` (`frontends/shell/src/skp/types.ts:248-251 @ 55618ab5`), and `ViewState.filter` is `Filter | null` (`frontends/shell/src/workspace/workspaceState.ts:71 @ 55618ab5`).
  - `null` is declared here, as §2 requires (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:57 @ 55618ab5`).
- **`clauses`.** `{id, text, enabled}`, where the id is "never persisted" and the text is byte for byte (`frontends/shell/src/workspace/filterClauses.ts:18-26 @ 55618ab5`). The order is the list order (`frontends/shell/src/workspace/workspaceState.ts:81-83 @ 55618ab5`).
- **`style`.**
  - The §5a document, whatever the geometry (the form's OPEN-12 (A), `kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:836-838 @ 55618ab5`).
  - The renderer is the one Rust reader (`docs/adr/ADR-022-style-v0-as-the-single-style-model.md:40-43 @ 55618ab5`).
  - The canonical member order is the renderer's (`renderer/src/style.rs:423-434 @ 55618ab5`).
  - Nothing is canonicalized outside `canonical.rs` (`docs/adr/ADR-022-style-v0-as-the-single-style-model.md:44-45 @ 55618ab5`; the form's §2.3a).
- **`view`.**
  - **`crs`'s form:** `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:138 @ 55618ab5` and `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:143-148 @ 55618ab5`.
  - **R9:** `state/consults/GUARDRAILS-EPOCHS-HEIGHTS-DGGS-2026-10-12.md:33 @ 55618ab5`. The epoch stays reserved (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:226 @ 55618ab5`).
  - **`centre`:** the canvas holds a frame origin in the authoritative CRS plus a local target (`frontends/shell/src/canvas/extent.ts:94-104 @ 55618ab5`).
  - **`zoom`:** it is exactly what the canvas holds. "one world unit is 2^zoom CSS pixels" (`frontends/shell/src/canvas/WorkingCanvas.tsx:576-581 @ 55618ab5`), and the canvas is in the dataset's source CRS (`frontends/shell/src/canvas/WorkingCanvas.tsx:81 @ 55618ab5`).
- **The sub-1e-6 sentence.**
  - The domain is `0` or `1e-6 <= |v| < 1e15` (`renderer/src/canonical.rs:33-38 @ 55618ab5`), refused at `renderer/src/canonical.rs:240-245 @ 55618ab5`.
  - `HexF64` is pub, exact and refuses a non-finite value (`protocol/skp/src/v0/codec.rs:38-63 @ 55618ab5`; `protocol/skp/SKP-V0.md:195-197 @ 55618ab5`; `docs/adr/ADR-004-skp-control-data-plane-mcp-adapter.md:28 @ 55618ab5`).
  - The kernel already depends on that crate (`kernel/Cargo.toml:21 @ 55618ab5`): no new dependency (I6), and no new function in `canonical.rs` (§2.3a).
  - The hex string is a string, so the canonical string writer writes it, and the strict reader's re-render compares it byte for byte (the form's §2.3).
  - "No save is refused for it" holds for every finite value. A non-finite camera value is still refused, by name.
- **Analysis settings, reserved by name.** The pattern of §11 and §3 (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:64 @ 55618ab5`; `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:224-227 @ 55618ab5`).
- **The click selection.** Round 69, item 4, as listed in §3 below. The selection scope is reserved at `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:225 @ 55618ab5`.
- **"Completes version 1".** `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:217 @ 55618ab5`.

**2 (D)**, against the form's §2.10 D (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:392-395 @ 55618ab5`) and the reopen step 6 (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:294 @ 55618ab5`):
- The member is the sha256 over the bytes as written, plus the count of step and withheld lines (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:195 @ 55618ab5`).
- The lineage is replaced first (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:194 @ 55618ab5`).
- Marks occur only in session histories (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:152 @ 55618ab5`), so a lineage is a header plus step and withheld lines.
- The ruling note is `state/directives/2026-10-09-adr-036-ten-findings-rulings.md:35 @ 55618ab5`; ruling 4 is at `state/directives/2026-10-09-adr-036-ten-findings-rulings.md:14 @ 55618ab5`.
- §1's "nothing else" is `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:28 @ 55618ab5`.
- Each reader sentence states a fact only. The consequence is the shell's (S16).

**3 (M)**, against `kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:396 @ 55618ab5`, `kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:233-237 @ 55618ab5` and the lock in step 3 (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:284-287 @ 55618ab5`):
- The "only file" sentence is `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:207 @ 55618ab5`.
- The crash note is `state/directives/2026-10-09-adr-036-ten-findings-rulings.md:34 @ 55618ab5`.
- The lock follows std's `try_lock`, as in 1b (`kernel/src/session_history.rs:260 @ 55618ab5`).
- "Must be one that the OS releases" is a design requirement. K-O5 and H7 prove it, and the text claims no measured fact.

**4 (H)**, against `kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:397 @ 55618ab5`:
- 1a/1b write `[machine-recorded]` only (`kernel/src/dataset_ref.rs:206-217 @ 55618ab5`).
- "binds the writer" mirrors `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:100 @ 55618ab5`.

**5 (S)**, against `kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:398 @ 55618ab5` and the form's §2.3 at `kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:242-245 @ 55618ab5`:
- The header admits the URI (`kernel/src/session_history.rs:565-579 @ 55618ab5`; `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:125 @ 55618ab5`).
- Today it is written as `not-yet-saved` (`kernel/src/session_history.rs:306 @ 55618ab5`).

**6 (C)**, against `kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:399 @ 55618ab5` and §7 (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:703-709 @ 55618ab5`):
- The limits of 8 locators, 4,096 bytes, and `definition_json` excepted are at `kernel/src/dataset_ref.rs:42-45 @ 55618ab5`.
- 65,536 is at `engine/src/crs.rs:40 @ 55618ab5`.
- The 4,096 string ceiling also equals the engine's predicate ceiling (`engine/src/predicate.rs:59 @ 55618ab5`).
- `MAX_SAVE_RENAME_ATTEMPTS` is left out on purpose: it bounds the writer, not a format.

The form says none of the six items is a version step (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:401 @ 55618ab5`). None of my words adds a top-level member or changes a steps-file shape, so that holds.

---

## 2. ADR-022 Amendment 2's text, under reading (a)

This goes at the end of `docs/adr/ADR-022-style-v0-as-the-single-style-model.md`, after Amendment 1 (`docs/adr/ADR-022-style-v0-as-the-single-style-model.md:73-78 @ 55618ab5`).

**Heading (not the human's; it is my proposal, in the form of Amendment 1's heading at `docs/adr/ADR-022-style-v0-as-the-single-style-model.md:73 @ 55618ab5`):**

`## Amendment 2 — style persistence granted for the project file (2026-10-22, the human)`

**Body: one paragraph, the human's words assembled.** Each span was byte-copied from my Read, not by script. The custodian rebuilds it by script from the four lines below and checks it is equal:

> Amendment 2 (b2-piece-1c-save-and-reopen): from piece 1c, the §5a style document is persisted in the project file, in the workspace member ADR-036 defines. The save is ADR-006 class 2 and atomic. docs/11's obligations are met by the project URI, ADR-036 for the schema, and save and reopen for the lifecycle. Provenance does not yet travel with the project file. The lineage member stays a named state until a later piece writes it; the saved-here mark says only that the saved style is the one the session's recorded steps reach, and those steps are kept in the session history on this machine while it lasts. Consequence (a) stands, and the lineage is not granted by this amendment.

**Which span is the human's:**
- **The human's**, from `Amendment 2 (b2-piece-1c-save-and-reopen):` through `docs/11's obligations are ` (trailing space included). This is the span after "my words for ADR-022 Amendment 2: " at `state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:15 @ 55618ab5`.
- **The human's**, `met by the project URI, ADR-036 for the schema, and save and reopen for the lifecycle`. This is the quoted span that "stays", at `state/directives/2026-10-21-redaction-amendment-3-open-1-to-7-ruled-adr-022-amendment-2-reading-a.md:10 @ 55618ab5`.
- **The human's**, from `Provenance does not yet travel` through `while it lasts.`. This is the span after "my words in place of the earlier one: " at `state/directives/2026-10-21-adr-036-order-1-b1-range-a0-two-sentences-redaction-viewer-hash-skip-adr-022-provenance-o0-file-verify-quotes-ruled.md:12 @ 55618ab5`.
- **The human's**, `Consequence (a) stands, and the lineage is not granted by this amendment.`. This is the end of line 15 of the first source.
- **Not the human's in these positions:** the joining bytes. These are the `. ` after "lifecycle" (line 15's own sentence end, kept) and the one space before "Consequence".
- **Superseded, and not carried:** the second message's change, "the project's steps file for provenance; the lineage member stays a named state" (`state/directives/2026-10-21-adr-036-block-ruled-open-a-c-b1-words-open-w-sentence-adr-022-amendment-2-steps-file.md:14 @ 55618ab5`). The fourth message replaced it with "my words in place of the earlier one", and reading (a) places those words where the provenance clause was.

**Clause check against the form and the code:**
- "in the workspace member ADR-036 defines" is item 1's `style`.
- "class 2 and atomic" matches `kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:171 @ 55618ab5` and `kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:219-226 @ 55618ab5`.
- "stays a named state" matches OPEN-8 (A) (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:246-249 @ 55618ab5`).
- "the saved-here mark says only…" matches the mark being withheld on a difference (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:238-241 @ 55618ab5`).
- "kept in the session history on this machine while it lasts" matches §9's store and clearing (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:207-209 @ 55618ab5`).
- Every clause holds.

---

## 3. Round and item cites in my words

| Cite | Where | Resolves against |
|---|---|---|
| round 69, item 4 | item 1 (W) | the RULED block "question round 69" in the tracked archive `state/cut-archive/DECISIONS-PENDING-2026-10-20.md`. Item 4 is OPEN-8 (A), with the typed addition on the click selection (`state/questions/round-69.md`; `state/directives/2026-10-08-round-69-rulings.md`) |
| round 69, item 1 | item 2 (D) | the same RULED block. Item 1 (A) carries the typed addition that §8's "always matches" is too strong, and that 1c's amendment states how a reader tells the saves apart |

Neither cite names question round 72. ADR-022 Amendment 2 carries no round or item cite. The other references in my words are not round or item cites: "the human's ruling 4 of 2026-10-09", which follows ADR-036 §1's own "ruling 2 of 2026-10-09" form, and "piece 1c's OPEN-n", which follows the A0 line's form.

---

## 4. OPEN items for the human

- **OPEN-V1. How the view's numbers are spelled.**
  - (a) All three as `HexF64` strings. This is the drafted text.
  - (b) A canonical number where `v = 0` or `1e-6 <= |v| < 1e15`, and a `HexF64` string only outside that range. The reader would also refuse a hex string for an in-range value.
  - (c) Write a value with 0 < |v| < 1e-6 as `0.0`. That is a conversion.
  - (d) A new exponent spelling in `canonical.rs`. That goes beyond §2.3a's one function, and would be class 9.
  - **Recommend (a).**
    - It is exact for every finite value, with one spelling and no branch.
    - The `save_project` request carries `workspace` in W's shape (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:182 @ 55618ab5`). Under (a) the view crosses IPC bit-exact, as ADR-004's 2026-08-03 rule requires for scalars that need binary identity.
    - The cost: in a diff, the three view lines show that the view changed, but not readable numbers.
    - (b) keeps the numbers readable, at the cost of two spellings and a wire shape that differs from the file's.
- **OPEN-V2. The scale's form.**
  - (a) `zoom`, log2 of CSS pixels per unit. This is the value the canvas holds, so nothing is converted. It is the drafted text.
  - (b) `units_per_px`, 2^−zoom. This is readable, but it is a computed value.
  - **Recommend (a).**
- **OPEN-V3. A view saved in a different space.**
  - (a) Add to item 1: "A reopen applies `view` only when its `crs` equals, member for member, the space the dataset is admitted in at the reopen; otherwise the view is not applied, and the reader says so."
  - (b) Add nothing.
  - **Recommend (a).** It follows docs/01's derived rule "CRS is a type" and R9's purpose.
- **OPEN-F1. `filter` against `clauses`.**
  - (a) Add to item 1: "`filter` is what the enabled clauses combine to: `null` when none is enabled; the one enabled clause's text, byte for byte; otherwise each enabled clause's text inside one pair of brackets, joined by ` AND `, in list order. A reader refuses a `workspace` whose `filter` differs." This matches `frontends/shell/src/workspace/filterClauses.ts:32-40 @ 55618ab5`.
  - (b) No rule, so the two members can disagree in a hand-edited file.
  - **Recommend (a).** It adds a reader refusal and a test that are not in §4, so the form records them by amendment before code.
- **OPEN-M1. `folders.json`'s format.**
  - (a) Add to item 3: "`folders.json` is one canonical JSON document, `{"format":"spatial-folders","version":1,"first":<absolute path>,"same":[<absolute path>…]}`: the folder §4 calls the first folder, and each folder for which the answer was the same project."
  - (b) Name the file only.
  - **Recommend (a)**, on §9's precedent for `locations.json`.
- **OPEN-M2. The 257th folder for one identity.**
  - (a) The open is refused by name, and nothing is forgotten.
  - (b) The answer is given but not remembered, so the question is asked again there. That breaks §4's "not asked again".
  - (c) The oldest folder is forgotten. That is pruning, against K-4.
  - **Recommend (a).** It is the "refuses rather than truncates" rule, and only a "same" answer adds an entry.
- **OPEN-C1. Lineage file bounds.** 1c's reader reads hand-built lineage files (L1 to L4), and neither §7 nor ADR-036 bounds them.
  - (a) Add to item 6: "§9's line bounds apply to every steps file, and a lineage file is at most 33,554,432 bytes."
  - (b) Leave the bound to the piece that writes lineage.
  - **Recommend (a).**

---

## 5. What I could not settle

- **No sha256.** I have no shell. The custodian pins every cite and rebuilds §2's text by script.
- **My additions inside §2.10's items, beyond its paraphrase.** The human may strike them.
  - Item 2 (D), "or names the lineage file as missing" (a member that records a lineage with no file).
  - Item 3 (M), `previous-lineage.jsonl`. Item D needs a name for it, so that the reader in L1 to L4 can find it; 1c writes none.
  - Item 5 (S), the de-duplication sentence, from `kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:245 @ 55618ab5`.
  - Not added: that a project's record is offered at that project's open rather than at start (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:332 @ 55618ab5`). §9 states the offer for unsaved sessions only.
- **The analysis settings have no member at all.** The block draft's OPEN-W (b) had a named-state `analysis` member. It was not ruled, so I followed §11's reservation pattern.
- **Reachable refusals, recorded rather than worded around.**
  - A style value with 0 < v < 1e-6: the renderer admits it (`renderer/src/style.rs:368-388 @ 55618ab5`) and the canonical writer refuses it, as at publish today. The panel cannot produce one, because its steps are 0.01 and 1 (`frontends/shell/src/style/StylePanel.tsx:186 @ 55618ab5`, `frontends/shell/src/style/StylePanel.tsx:209 @ 55618ab5`).
  - A clause text over 4,096 bytes: the save is refused by name (S4). The shell sets no limit on clause texts (`frontends/shell/src/workspace/filterClauses.ts:11 @ 55618ab5`).
- **Documentation finding for the custodian (must be fixed before step 1's PR):**
  - The form's quoted ADR-022 Amendment 2 (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:409 @ 55618ab5`) predates the fourth and fifth messages, so it is stale.
  - The form's Amendment 1 is not yet on main (§10 is empty). That amendment must record the order, the acceptance commit and this text under reading (a), as the fifth message's RULED block applies it.
  - §9's gate line, "byte for byte against the human's two lines" (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:745 @ 55618ab5`), now resolves against the three source lines in §2 above.
- **The headings and their dates are proposals.** The human's own text opens "Amendment 2 (b2-piece-1c-save-and-reopen):", so the body repeats the number after the heading. The alternative, using that lead-in as the heading, would split the human's bytes. The date 2026-10-22 is the messages' own heading date; the receipts are 2026-10-21 UTC.
