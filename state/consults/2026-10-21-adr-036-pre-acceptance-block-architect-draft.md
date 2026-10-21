*Custodian's filing note (2026-10-21): the architect's draft of ADR-036's pre-acceptance block (route (i), the human's message headed 2026-10-22), read only at main ab9a4b4f, for the human's sight. Its words are the architect's. Its OPEN items (A, L, R, W, D, S and O) are the human's. Not committed as a form; no hash in it is filled yet. The run 2026-10-21T08:22:04Z to 08:36:03Z by its transcript (Glob 4, Read 33, Grep 25); its one SubagentHandback call, at 08:36:02Z. Extracted by script from that call, with nothing changed except one final newline. Its sha256, from line 5 to the end, is 520389bdf814c50e77715d51dc0d9cbcd110a846ec5bd2b454bcd6d458682d61.*

---

Drafted: ADR-036's pre-acceptance block, for the human's sight, at main ab9a4b4f

Read: main @ ab9a4b4f957aaf61dedd5e08446bf98fdca55d7f (from `.git/refs/heads/main`). Verdict: none. This is a draft, not a gate.

**About the cites.** Every `path:line` below was read at main ab9a4b4f. I have no shell, so none of them carries a sha256; the custodian fills the hashes by script. The ledger is not cited by line. Every "as it stands" passage is byte-copied from my Read of the file at ab9a4b4f, with the Read tool's line-number prefix removed; the custodian confirms each by script. Every "new" passage is in my words, not the human's, and is offered for the human's sight. Each change is located by the bytes of its passage, never by its line number, so one insertion does not move the others.

**The ruling this carries:** `state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:10` (ADR-036, route (i)). It also uses the same message's `:15` (ADR-022 Amendment 2), `:16` (1c's OPEN-4), `:17` (1c's OPEN-5), `:18` (1c's OPEN-14 and OPEN-15 among the (A) rulings) and `:20` (milestone 4's OPEN-4 (A′)), plus the 2026-10-09 rulings (`state/directives/2026-10-09-adr-036-ten-findings-rulings.md:8-49`).

---

## 1. The block

The file is `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md`. **Part A** holds what the human's paragraph names. **Part B** holds ruled items the paragraph does not name; whether they go into the block is OPEN-A.

**Existing files.** None of the changes makes an existing file invalid:
- no project file or lineage file exists yet;
- 1a and 1b write `machine-recorded` locators only;
- a 1b session history (`actions` 2, literal style values) is still valid under A7, which only widens.

### Part A: what the human's paragraph names

**A0. Provenance.** Insert one line after the line that begins `**Amended:** in piece 1b's form`. The text below is OPEN-A (c)'s version; under (a), drop the items for rulings 1 and 8 and for OPEN-14 and OPEN-15.
```
**Amended:** in piece `adr-036-pre-acceptance-block`'s form (`kernel/ADR-036-PRE-ACCEPTANCE-BLOCK-PREREGISTRATION.md`, §2), before acceptance, by the human's route (i) (`state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md`): the project file's name; canonical form (ruling 9); containment and the carrying rule (ruling 1, and piece 1c's OPEN-4 and OPEN-5); the copy-or-same question (ruling 8); the line-oriented layout; ruling 4's lineage members; the observation's integers bounded and the Snapshot column reserved (piece 1c's OPEN-14 and OPEN-15); the timing in the Status line and in §11; and milestone 4's OPEN-4 (A′), a match on `fillColor`.
```

**A1. Status line** (the Documentation item at line 3; red-line text, OPEN-S).

As it stands, `:3`:
```
**Status:** Proposed. **It binds nothing until the human accepts it.** Acceptance is due before piece 1c (`b2-piece-1c-save-and-reopen`) merges, the first piece that writes a file that a later version or another person reads. It is not architect-blockable until accepted.
```
New:
```
**Status:** Proposed. **It binds nothing until the human accepts it.** Acceptance is due once the pre-acceptance block (piece `adr-036-pre-acceptance-block`) has merged, and before piece 1c (`b2-piece-1c-save-and-reopen`), the first piece that writes a file that a later version or another person reads, starts its code. It is not architect-blockable until accepted.
```
Checked against: directive `:10` ("When the block has merged I type the acceptance") and the placements directive `state/directives/2026-10-21-placements-redaction-scan-1c-milestone-4-lanes-238-clicked-d-answers-adr-024-heading-kept.md:12` (accepted before 1c's code).

**A2. The name** (directive `:10`; ruling 2, 2026-10-09 `:10`).

As it stands, `:20` (inside the tree's fence):
```
  <project file>           the project file: one canonical JSON document
```
New: two spaces, `project.spatial`, then ten spaces, so the text column matches `:22`.
```
  project.spatial          the project file: one JSON document in §2's line-oriented layout
```
As it stands, `:25`:
```
> **OPEN, until the human accepts this ADR: the project file's name and extension.** The draft named it `project.spatial.json`. A file ending in `.json` cannot open the application by double-click, so the name and the extension are settled at acceptance.
```
New:
```
**The project file's name** is `project.spatial`, one fixed name (the human's ruling 2 of 2026-10-09). A web search found no common application that claims the `.spatial` extension (`state/consults/2026-10-21-spatial-extension-check-custodian.md`). File association and single instance are not decided here; they are a later piece's.
```
The check's own limit is "common" only (that file's `:14`), and the sentence claims no more.

Insert after `:27` (the paragraph beginning `Nothing else in the folder belongs to the format.`), with one blank line before it:
```
**The project file's members,** in this order and no other: `format` and `version` (§3); `project`, the project's identity (§4); `datasets`, an array holding one dataset entry (§5); `lineage` (§8); and `workspace` (§11).
```
This is needed so that ruling 4's member has a closed home. The order matches 1c's draft §2.3 (`state/consults/2026-10-21-b2-piece-1c-save-and-reopen-architect-draft.md:184`).

**A3. The line-oriented form** (2026-10-09 `:29`; ruling 2 `:10`). The exact bytes are OPEN-L. The text below is my recommendation.

As it stands, `:31-33`:
```
- **Encoding:** UTF-8 without BOM, with LF line ends, in the canonical JSON subset of `spatial_renderer::canonical`, the one number grammar this repository writes.
  - The project file is one document followed by one LF.
  - A steps file is one document per line, each followed by LF.
```
New:
````
- **Encoding:** UTF-8 without BOM, with LF line ends, in the canonical JSON subset of `spatial_renderer::canonical`, the one number grammar this repository writes: every key, string and number is spelled as that subset spells it, and each object's members are in the order this ADR declares.
  - The project file is one document in the line-oriented layout below, followed by one LF.
  - A steps file is one document per line, with no whitespace outside strings, each followed by LF.
  - A reader refuses any other spelling, order or layout, naming the line.
- **The line-oriented layout** of the project file, so that a diff between two saves shows each member that changed (docs/01, derived rule "Plain text everywhere."; docs/02, Projects):
  - each member of an object and each element of an array is on a line of its own;
  - each line is indented by two spaces for each object or array that encloses it;
  - a member is its key, `:`, one space and its value;
  - an object or array that is not empty opens with `{` or `[` at the end of the line where it begins, and closes with `}` or `]` on a line of its own, indented as that line is;
  - an empty object is `{}` and an empty array is `[]`;
  - a member or element followed by another in the same object or array ends in `,`, after its last character;
  - no line holds trailing whitespace, and there is no blank line.
  The document `{"a":1,"b":[],"c":{"d":"x"}}` is laid out as:
  ```
  {
    "a": 1,
    "b": [],
    "c": {
      "d": "x"
    }
  }
  ```
````
Checked against:
- `renderer/src/canonical.rs:22-38`. The subset escapes every control character, so no string holds a raw LF or tab, and every line break in the file is a layout break.
- The quoted rule is byte-exact with `docs/01_Principles.md:24`; Projects is `docs/02_Architecture.md:48`.
- The 1b reader on main reads through `serde_json` and does not refuse non-canonical spellings (`state/consults/2026-10-21-b2-piece-1c-save-and-reopen-architect-draft.md:86`). The "refuses" clause binds a rule that 1c's strict reader meets under its OPEN-19 (A), not code on main.

**A4. Line 71: the correction and ruling 9's reader** (ruling 9, 2026-10-09 `:24`; the acceptance consult's Correctness finding). The list of reserved names is OPEN-R.

As it stands, `:71`:
```
- `project-relative`: `at` is a path relative to the project folder, `/`-separated and in canonical form. Canonical form is not empty, does not begin with `/`, has no empty, `.` or `..` segment, and holds no `\` and no `:`, so that each path inside the folder has one spelling on every operating system. A reader refuses an `at` outside canonical form. Canonical form is checked on the text alone and does not by itself keep a path inside the project folder: containment, below, does;
```
New:
```
- `project-relative`: `at` is a path relative to the project folder, `/`-separated and in canonical form. Canonical form is not empty, does not begin with `/`, has no empty, `.` or `..` segment, and holds no `\`, no `:` and no control character (U+0000 to U+001F and U+007F to U+009F). No segment ends in a dot or a space, and no segment is a reserved device name: the part of the segment before its first `.`, with trailing spaces removed, is none of `CON`, `PRN`, `AUX`, `NUL`, `CONIN$`, `CONOUT$`, `COM0` to `COM9`, `COM¹`, `COM²`, `COM³`, `LPT0` to `LPT9`, `LPT¹`, `LPT²` and `LPT³`, compared without regard to ASCII case. A reader refuses an `at` outside canonical form. Canonical form fixes how a path is written, not which file it names: on a file system that ignores case or normalises Unicode, two texts in canonical form can name one file. Canonical form is checked on the text alone and does not by itself keep a path inside the project folder: containment, below, does;
```
Checked against: the reader on main refuses only `\`, `:` and empty, `.` or `..` segments (`kernel/src/dataset_ref.rs:544-552`). The widening is code that 1c owes. The untrue "one spelling" clause is removed, not restated.

**A5. Ruling 4's lineage members** (2026-10-09 `:14`). How a reader tells the two saves apart stays with 1c (OPEN-D).

As it stands, `:170`:
```
- **How it is written:** whole, at each Save project, by writing a new file in the folder and renaming it over the old one. Piece 1c's amendment to this ADR states how a reader detects a project file and a lineage file from different saves, and what it shows then.
```
New:
```
- **How it is written:** whole, at each Save project, by writing a new file in the folder and renaming it over the old one. The lineage file is replaced first, and the project file after it.
- **What the project file records of it:** the project file's `lineage` member is `{"sha256":<"sha256:" and 64 lowercase hex characters>,"steps":<int>}`, the sha256 over the lineage file's bytes as written and the number of its step and withheld lines; or, where the project keeps no lineage file, the named state `not-kept` (§2). A reader never reads a lineage file whose bytes or count differ from the member as the project's lineage without saying so. Piece 1c's amendment to this ADR states how a reader tells which save each file is from, and what it shows then.
```
As it stands, `:194`:
```
  - how a reader detects a project file and a lineage file from different saves, and what it shows then (1c, §8);
```
New:
```
  - how a reader tells which save a project file and a lineage file are from, and what it shows then (1c, §8);
```
Checked against: OPEN-8 (A), directive `:18`. 1c writes `not-kept` and reads the full shape (1c draft `:205-208`).

**A6. Line 192: the Documentation item.** Whether the `workspace` member is reserved here or defined here is OPEN-W. This is option (a).

As it stands, `:192`:
```
- **The project file's `workspace` member** (the filters as applied, the style document, the map view, the analysis settings). Piece 1c proposes it as an amendment to this ADR, accepted together with it.
```
New:
```
- **The project file's `workspace` member** (the filters as applied, the style document, the map view, the analysis settings). It is a member of version 1, reserved by name: piece 1c defines its shape in an amendment to this ADR appended after acceptance, and no project file is written before that amendment has merged.
```
Why: the sentence states in the accepted text that defining the member completes version 1. Without it, the version rule at `:42` would turn 1c's definition into a version step, on the 2026-10-12 reading the acceptance consult names.

**A7. Milestone 4's OPEN-4 (A′)** (directive `:10`, `:20`).

As it stands, `:151`:
```
| 2 | `style.set` | `style` | workspace mutation | `{"property":<"fillColor"\|"fillOpacity"\|"outlineColor"\|"outlineWidth">,"value":<value>}`; a colour is `#rrggbb` in lowercase, an opacity a number from 0 to 1, a width `{"value":<number>,"unit":"px"}`; each value is one ADR-017 §5a admits | (`style.set`, the `property`, the layer) | yes |
```
New:
```
| 2 | `style.set` | `style` | workspace mutation | `{"property":<"fillColor"\|"fillOpacity"\|"outlineColor"\|"outlineWidth">,"value":<value>}`; a colour is `#rrggbb` in lowercase, an opacity a number from 0 to 1, a width `{"value":<number>,"unit":"px"}`; for `fillColor` only, the value may instead be ADR-017 §5a's match, `{"match":{"column":<text>,"cases":[{"when":<text>,"then":<colour>}…],"on_null":<colour>,"on_unmatched":<colour>}}`, whose column is a column of the open dataset that §5a's match admits; each value is one ADR-017 §5a admits | (`style.set`, the `property`, the layer) | yes |
```
As it stands, `:153`:
```
A `filter.apply` step's `dependencies` name the predicate's fields with their types; a `style.set` step's name none.
```
New:
```
A `filter.apply` step's `dependencies` name the predicate's fields with their types. A `style.set` step whose value is a match names the match column with its type; any other `style.set` step names none.
```
Checked against:
- §5a's match shape and member order: `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:264-275`.
- Text keys only: `renderer/src/compiled.rs:225-239`.
- The `fields` form `{"name","type"}`, with the type as the kernel writes it: `kernel/src/session_history.rs:416-425`.
- The collapse key and `actions` are unchanged. A widened value is not a new action.
- Today the kernel refuses a match: the `fillColor` value is COLOUR only (`kernel/src/session_history.rs:545-564`), and the wire is literal only (`protocol/skp/SKP-V0.md:1247-1256`). The recording widening owes that code (§2 below).

### Part B: ruled items the paragraph does not name (OPEN-A)

**B1. Ruling 1, with 1c's OPEN-4 (A) and OPEN-5 (B)** (2026-10-09 `:8`; directive `:16-17`). With OPEN-5 (B) ruled, `:80`'s "never opened, however it gets there" and `:82` claim a guarantee that the ruled design does not give. If acceptance binds them, they are a Correctness finding.

As it stands, `:76`:
```
**Which locators a project file carries.** A dataset entry in a project file always carries a `machine-recorded` locator. It also carries a `project-relative` locator, in canonical form, when the data is inside the project folder by the containment rule below, judged when the project is saved. It never carries an absolute path (§2). This rule binds the writer; a reader reads the locators an entry holds.
```
New:
```
**Which locators a project file carries.** A dataset entry in a project file always carries a `machine-recorded` locator. It also carries a `project-relative` locator, in canonical form, when the data is inside the project folder, is reached from it without a link (containment, below), and its path has a canonical form, each judged when the project is saved. Data inside the folder whose path has no canonical form on this machine carries the `machine-recorded` locator only, and the save is not refused. An entry never carries an absolute path (§2). This rule binds the writer; a reader reads the locators an entry holds.
```
As it stands, `:80`:
```
- **containment,** which the resolver that opens the data checks on the resolved target, before it opens it. The resolver resolves the project folder and the target, following every symbolic link, junction and other reparse point, and opens the target only if its resolved path lies inside the resolved project folder. A target that resolves outside the folder is refused by name and never opened, however it gets there: through a link, through a name the operating system resolves to a device (such as `NUL` on Windows), or through a name the operating system rewrites (such as a segment ending in a dot or a space on Windows). A target that cannot be resolved is refused the same way.
```
New:
```
- **containment,** which the resolver that opens the data checks before it opens it, on every platform. The resolver goes from the project folder through each segment of the target and refuses every symbolic link and junction it meets below the folder, whether it points inside or outside; it opens the target only if each segment exists, each but the last is a folder, and the last is a regular file. A refused target is not opened, and is refused by name: a link, a name the operating system resolves to a device (such as `NUL` on Windows), a name the operating system rewrites (such as a segment ending in a dot or a space on Windows), or a target that cannot be resolved. A file kept by a cloud-sync service is not a link, and the resolver must open it. The check is made when the data is opened: a link or a rename that another program makes between the check and the open is not prevented, and piece 1c's form declares it.
```
As it stands, `:82`:
```
Piece 1c builds the writer and the resolver. Its form states how the target that is checked is the target that is opened.
```
New:
```
Piece 1c builds the writer and the resolver. Its form states the window between the check and the open, which this rule does not close.
```
"Must open" is the human's requirement (ruling 1). That a cloud placeholder is not a link is unverified until 1c's O0 probe (its H1).

**B2. Ruling 8** (2026-10-09 `:22`; its restatement `:38-40` governs; a red line).

As it stands, `:55`:
```
- **A project opened from a second folder.** When a project's identity opens from a second folder while the first folder still exists, the user is asked once whether it is a copy or the same project. A copy gets a new identity and keeps its lineage, and its data links become its own: re-linking the data in one never changes where the other finds its data. The same project is remembered for that folder, and the question is not asked again there. If the first folder no longer exists, the project has moved, and nothing is asked. The question's wording is the human's at P6.
```
New:
```
- **A project opened from a second folder.** When a project's identity opens from a folder this machine has not opened it from, the user is asked once whether it is a copy or the same project if the first folder still holds a project with this identity, or if the first folder cannot be reached. If the first folder is gone, or holds another project or none, the project has moved, and nothing is asked. A copy gets a new identity, always written to the newly opened folder, and keeps its lineage, and its data links become its own: re-linking the data in one never changes where the other finds its data. The same project is remembered for that folder, and the question is not asked again there. The question's wording is the human's at P6.
```

**B4. OPEN-14 (A).** As it stands, `:84`:
```
**`observed`** is the change-detection observation of the open that the reference was bound to: `byte_size`; `modified_ns` (a decimal string in minimal form, or the state `not-reported`); `footer_length`; `footer_sha256` (64 lowercase hex characters, or the state `not-read-over-ceiling`). Minimal form is digits only, with no sign and no leading zero unless the value is 0. A reader refuses any other spelling of either value, so each value has one spelling.
```
New: the same line, with this appended after one space:
```
`byte_size` and `footer_length` are integers no greater than 2^53 − 1, so §2's rule for large integers does not reach them: a writer refuses to bind a reference to a larger file, and a reader refuses a larger value.
```
Checked against: the reader already refuses a larger value (`kernel/src/dataset_ref.rs:468-474`). The writer writes the value with no check (`:358-373`), so the refusal is code 1c owes.

**B5. OPEN-15 (A).** Insert after `:68` (the `portability_policy` row), with one blank line before it:
```
The Snapshot column is reserved and is not part of version 1: a version-1 reader refuses a `content_hash` that is not the state `not-taken`, a `cache_status` other than `linked` and a `portability_policy` other than `linked-live-file`. A snapshot reference comes with stage 3, and with a `version` step (§3).
```
Insert after `:201` (the coordinate-epoch bullet):
```
  - **the Snapshot column** of §5's table (stage 3).
```
Checked against: `kernel/src/dataset_ref.rs:484-498`.

## 2. What stays out of the block

- **Piece 1c's code:**
  - the strict reader: ruling 7, the 2026-10-09 note on duplicate keys and key order (`:36`), refusal of any other layout, and OPEN-19 (A) for 1b's `read_line`;
  - the line-oriented writer;
  - ruling 9's widening in `in_canonical_form`;
  - the `byte_size` writer refusal (B4);
  - atomic save (ruling 10);
  - the resolver (B1) after O0 (OPEN-6 (A));
  - the second-open lock (OPEN-7 (A));
  - the copy-or-same flow (B2);
  - the `not-kept` member and the refusal to save over a kept lineage (OPEN-8 (A));
  - OPEN-9, OPEN-13, OPEN-16 and OPEN-18;
  - the owner's statement under OPEN-4 (a P6 string).

  **Note for 1c's gate:** 1c's draft says the renderer is not changed (`:185`). ADR-022 decision 3 (`docs/adr/ADR-022-style-v0-as-the-single-style-model.md:44-45`) allows canonicalizing only in `renderer/src/canonical.rs`, and the project file carries the style document in a new layout. 1c's form either puts the layout there or argues why it is not a canonicalization.
- **1c's appended ADR-036 amendment** (after acceptance, for the human's sight):
  - the `workspace` member's shape, under OPEN-W (a);
  - how a reader tells two saves apart (ruling 4's note, 2026-10-09 `:35`);
  - the machine store under `projects/<hex>/`, which also widens `:182`'s "the only file" sentence;
  - the locators a lineage header carries;
  - the session record after the first save.
- **ADR-022 Amendment 2:** the human's words, directive `:15`, appended at the end of `docs/adr/ADR-022-style-v0-as-the-single-style-model.md` after Amendment 1 (`:73-78`).
  - It lands in 1c step 1's PR, before any code that writes a style into a project file (Consequence (b), `:59-62`: in the same commit).
  - It lands together with 1c's `workspace` amendment, because its words reference "the workspace member ADR-036 defines".
  - 1c's draft step 0, an ADR-only PR (`:332`), is superseded: ADR-036's part is this piece.
- **The recording widening (OPEN-4 (A′)), a data-lane node for the custodian to place:**
  - SKP-V0 §10.2 and its version literal, `protocol/skp/src/v0/commands.rs`;
  - `kernel/src/session_history.rs`: REGISTRY, `style_params`, `prepare`, and the match column passed to `dependencies_json`, with the text-type check made against the file's schema;
  - one `protocol/` piece at a time;
  - after this block merges.

  It must also handle a valid 64-case §5a match whose `when` texts push the line past the 262,144-byte step ceiling (`protocol/skp/SKP-V0.md:1266`): it declares the bound and how the shell handles the refusal. A 1b build would refuse a match line in a history written by a later build. No release after v0.1.0 is in the tree (RELEASE-0.1.md only).
- **Milestone 4:** shell only (`fillMatch`, the document, the legend, the recorder's send), the OPEN-7 KNOWN-LIMITATIONS line, and its other rulings.
- **Live text that goes stale at acceptance** ("ADR-036 … Proposed"). It is not acceptance's to change. 1c brings its own files current, and the rest go to a docs-lane piece:
  - `kernel/src/dataset_ref.rs:4`, `kernel/src/lib.rs:18`, `kernel/src/session_history.rs:5`;
  - `kernel/README.md:274`, `:375`;
  - `kernel/tests/no_generation_in_persisted_artifacts.rs:42`;
  - `protocol/skp/src/v0/commands.rs:513`;
  - `protocol/skp/SKP-V0.md:223`, `:1239`;
  - `frontends/shell/src/workspace/viewTransitions.ts:6`, `frontends/shell/src/style/StylePanel.tsx:55`.

  Records, and ADR-022's `:74`, stay as history.

## 3. The acceptance

These are the lines acceptance changes, as they will stand once the block has merged under OPEN-S (a):
- `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md`, the Status line (A1's new text):
```
**Status:** Proposed. **It binds nothing until the human accepts it.** Acceptance is due once the pre-acceptance block (piece `adr-036-pre-acceptance-block`) has merged, and before piece 1c (`b2-piece-1c-save-and-reopen`), the first piece that writes a file that a later version or another person reads, starts its code. It is not architect-blockable until accepted.
```
- `docs/README.md`'s ADR-036 row, which `frontends/shell/scripts/adrIndex.mjs` regenerates from that line (`npm run adr-index`; `verify:adr-index` fails on drift). The text below is inferred from the current row at `:73`, not from a run:
```
| [ADR-036](adr/ADR-036-project-folder-step-record-and-dataset-reference.md) | B2's file formats: the project folder, the step record and the lasting dataset reference | Proposed. **It binds nothing until the human accepts it.** Acceptance is due once the pre-acceptance block (piece `adr-036-pre-acceptance-block`) has merged, and before piece 1c (`b2-piece-1c-save-and-reopen`), the first piece that writes a file that a later version or another person reads, starts its code. It is not architect-blockable until accepted. |
```

`:25` is no longer acceptance's: A2 settles it. Nothing else in ADR-036 says Proposed. I do not draft the acceptance words.

## 4. The docs-lane piece's form

- **Node:** `adr-036-pre-acceptance-block` (proposed id). **Path:** `kernel/ADR-036-PRE-ACCEPTANCE-BLOCK-PREREGISTRATION.md`, beside 1a's and 1b's forms.
- **Form: the full form, with full gating from dispatch.**
  - It changes ADR text, a §21a category and a red line (`AUTONOMY.md:315-332`).
  - Its `Out-of-scope` line could not assert that it touches none of the four, so §25(e) closes the five-line form (`AUTONOMY.md:482`).
  - It is under §21c's size (`AUTONOMY.md:350-357`), but the size does not decide the form here.
  - The lane's terms hold: documents only, no code logic, assertion, app string or `scripts/plan` (`state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:19`).
- **Authority:** directive `:10`; 2026-10-09 rulings 2, 4 and 9 and `:29`; directive `:16-18` and `:20`; the acceptance consult.
- **§0, reuse:** item 5's output, byte for byte. Its one hit is taken as concepts only: format-forward-compatibility. nbformat's unrecognised slot is already §3's opaque slot; KiCad's keep-the-original informs OPEN-D; excalidraw's dropping of unknown types is the counter-example §3 refuses. The two misses are noted and do not block.
- **§1:**
  - May claim: ADR-036 at H equals ADR-036 at B with the approved changes applied.
  - May not claim:
    - acceptance;
    - any behaviour of code;
    - that the reader on main meets A3, A4 or B4 (1c owes them);
    - any wire change.
- **§2 (the changes):**
  - The approved changes are byte-copied into the form after the human's sight, and the worker applies them by script, located by passage.
  - `docs/README.md` is regenerated only if `:3` changes.
- **§3, fixtures:** none.
- **§4 (tests):**
  - No new test and no mutation owed. No record calls a `verify-mutation` run an observation.
  - Verification is a script that rebuilds H's file from B's plus the approved blocks and compares the bytes, with `verify:adr-index`.
- **§5:**
  - Declared unchanged: every other line of ADR-036, every other ADR, `docs/` apart from the regenerated row, and all code.
  - Invalidators:
    - B's ADR-036 differs from ab9a4b4f;
    - a change that needs code;
    - a passage that does not match byte for byte.
- **§7, budget:**
  - Counting command: `git diff --numstat B...H -- docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md`, insertions plus deletions.
  - Ceiling: 90 under OPEN-A (c), 80 under (b), 70 under (a). My estimate is about 47 for Part A and 13 for Part B.
  - Files: ADR-036 (by hand); `docs/README.md` (generated, outside the count); the form and PLAN.yaml (outside the count). At most 4.
  - Budget: 60 minutes.
  - An overrun is class 8, and §7 is never edited (`docs/PREREGISTRATION-TEMPLATE.md:169`).
- **§8, block-on-sight:**
  - a byte outside the approved blocks;
  - a Status line other than the approved one;
  - quotation marks around non-byte-copied text;
  - a ledger line cite;
  - the round-25 items by name.
- **§9, gates:**
  - architect and reviewer, full gating, with verdicts under section 2 of the product-first direction;
  - the architect checks each change against its ruling, finds no guarantee the code or ruling does not support, and checks the A7 seam against `record_step` and `admit_match_type` as read;
  - suites: verify-cites, verify-quotes, verify-test-claims, `verify.mjs`, the `scripts` `node --test` suites, and CI green;
  - merge commit only, the human's click, then the human types the acceptance.
- **Rule (00):**
  - **Governance D (#237, at S10, go):** shares PLAN.yaml, and through it the generated `CUSTODIAN-QUEUE.*` and `site/`. The form's commit and node rows wait for D's merge, or are held in scratch under the freeze. It does not touch `state/cut-archive/` or `state/drafts/`.
  - **walkthrough-current-view-rows-g1-n5** (`frontends/shell/MANUAL-WALKTHROUGH.md`, rows G1 and N5 and N5's other stale cites): the paths are disjoint, but the docs lane runs one piece at a time (directive 2026-10-10 `:18`), so the order is OPEN-O.
  - **The redaction scan's paths** (all ten as briefed): disjoint.
  - **Piece 1c:** its code waits on acceptance, which follows this piece, so the two run in sequence. Its draft step 0 is superseded.
  - **Milestone 4** (`frontends/shell/**`, `renderer/style-ts`, the agreement vector, `kernel/tests/manual_walkthrough_fixtures.rs`): disjoint. This block discharges its I9.
  - **`protocol/`:** not touched.

## 5. The reuse index's output (byte for byte, as briefed)

```text
$ node tools/reuse.mjs project file format line
capability: format-forward-compatibility → nbformat [CONCEPTUAL], KiCad [CONCEPTUAL], OpenLineage [CONCEPTUAL], excalidraw [REJECT]   (worth-owning, P0)
$ node tools/reuse.mjs lineage reader
No prior art recorded for "lineage reader". Research it before planning an implementation.
$ node tools/reuse.mjs category match style
No prior art recorded for "category match style". Research it before planning an implementation.
```
The rows read in the private clone: REUSE-ROUND-1.md, lines 213 to 216, at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c (the clone's `.git/HEAD`). Nothing was copied from them.

---

## OPEN items for the human (options; my recommendation)

- **OPEN-A. The block's reach.**
  - (a) Part A only, as your paragraph lists it.
  - (b) A plus B1 and B2.
  - (c) A plus B1, B2, B4 and B5.

  **Recommend (c).** With OPEN-5 (B) ruled, B1 removes two guarantee claims that acceptance would otherwise bind untrue (`:80`, `:82`). B2 removes text that ruling 8 replaced. B4 and B5 make the text match the reader on main (`kernel/src/dataset_ref.rs:468-474`, `:484-498`). Each is already ruled.
- **OPEN-L. The layout's bytes.**
  - (a) Two-space indent, a colon then one space, as drafted.
  - (b) Two-space indent, a colon and no space.
  - (c) Tab indent.

  **Recommend (a).**
- **OPEN-R. The reserved device names.**
  - (a) As drafted: COM0 and LPT0, the superscript forms, CONIN$ and CONOUT$, compared on the part before the first dot with trailing spaces removed.
  - (b) CON, PRN, AUX, NUL, COM1 to COM9 and LPT1 to LPT9, alone or before a dot.

  **Recommend (a).** Refusing too much costs only the project-relative locator, and under 1c's OPEN-4 (A) the save is kept.
- **OPEN-W. The `workspace` member.**
  - (a) Reserved by name in version 1, and defined by 1c's appended amendment (A6).
  - (b) Defined in this block: `filter` (as applied); `clauses` (`{text, enabled}` in order, 1c's OPEN-10 (B)); `style` (the §5a document, OPEN-12 (A)); `view` (a centre and a scale in the dataset's space, named in `dependencies.crs`'s form, OPEN-11 (A)); `analysis`, a named state.

  **Recommend (a).** The shape is written and gated against the shell state at 1c's base (the seam rule). Under (b) I would draft words for `view`'s unit and for the canonical number domain (`renderer/src/canonical.rs:33-38`: a coordinate below 1e-6 cannot be written), and those are not settled.
- **OPEN-D. Ruling 4's detection.**
  - (a) The members, the order and the never-silent floor, as in A5, with detection left to 1c's amendment.
  - (b) Full detection now: roll back by step count, keep the previous lineage under a name in the folder (which §1 would then list), and otherwise name the files as from different saves.

  **Recommend (a).** Under OPEN-8 (A) no lineage is written in 1c. If a later writer keeps a previous lineage inside the folder, that is a version step, unless it is kept on the machine instead.
- **OPEN-S. The Status line in the block.**
  - (a) As A1.
  - (b) Leave `:3` alone, so that your acceptance replaces it once.

  **Recommend (a)**, because your paragraph lists line 3. (b) saves one regeneration of `docs/README.md`.
- **OPEN-O. The docs lane's order.**
  - (a) This block goes ahead of walkthrough-current-view-rows-g1-n5, if that piece has not started.
  - (b) It goes after it.

  **Recommend (a).** Slot 2's piece 1c waits on acceptance, which waits on this block.

## What I could not settle

- The reserved-name list is from my own reading. I did not check it in this run against the operating system's naming documentation; the worker or the reviewer does, before the form is committed.
- The regenerated `docs/README.md` row is inferred, not produced by a run.
- Whether walkthrough-current-view-rows-g1-n5 has started. PLAN shows it `ready`.
- The node id and the form path are proposals; the custodian places them.
- The heading shape for ADR-022 Amendment 2, made from your words at directive `:15` (which open "Amendment 2 (b2-piece-1c-save-and-reopen):"), is yours or the custodian's to set when it is applied.
- That a cloud placeholder is not a link (B1, 1c's H1) is unverified until O0.
- Whether any build released after v0.1.0 carries 1b's reader. The tree holds RELEASE-0.1.md only.
- The line counts are estimates.
- Every sha256 is left for the custodian to fill by script.
