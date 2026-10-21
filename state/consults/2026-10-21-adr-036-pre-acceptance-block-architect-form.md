*Custodian's filing note (2026-10-21): the same architect's form for ADR-036's pre-acceptance block, written from its draft (`state/consults/2026-10-21-adr-036-pre-acceptance-block-architect-draft.md`) with the human's rulings (`state/directives/2026-10-21-adr-036-block-ruled-open-a-c-b1-words-open-w-sentence-adr-022-amendment-2-steps-file.md`), read only at main 2879e17f. Resumed from its transcript at 08:36:03Z; Read 12, Grep 5 before its second SubagentHandback call, at 14:31:31Z. It carries one finding against the human's words for the human (its §0.5) and two changes to its own words for the gate (its §2.4). The committed form, `kernel/ADR-036-PRE-ACCEPTANCE-BLOCK-PREREGISTRATION.md`, is its form part with the pins added by script and the custodian's Amendment 1. Extracted by script from that call, with nothing changed except one final newline. Its sha256, from line 5 to the end, is 4220c0c5ffb7c4733781ab5d9bdd075db21c07acee4a0d3539ed4561fae76556.*

---

Form: adr-036-pre-acceptance-block, its full form, at main 2879e17f

Read: main @ 2879e17f1f4ece340473efa53b69f16bd0b91745 (from `.git/refs/heads/main`). I re-read `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md` and `docs/README.md:73` there. Every passage I copied from them in the draft is unchanged.

**Three things to settle before the form is committed:**
- **Your B1 sentence cites too wide a range (red-line text, so a gate may block on it).** It points to KNOWN-LIMITATIONS items 19 to 28. Items 20, 21 and 22 are about other limits: a partitioned source, publishing data in degrees, and the sanity check. Only items 19 and 23 to 28 describe what the sentence says. Your choice: keep your words as they stand, or change the range to "items 19 and 23 to 28". I have not changed your words.
- **Your B1 sentence made two of my passages say too much.** At line 78, "never points outside" no longer holds once a later link is declared possible. At line 82, my "the window between the check and the open" is narrower than your sentence. I changed only my own words, shown in §2.4 of the form.
- **The ADR-022 Amendment 2 change (directive line 14) is not in this block.** The block quotes nothing of Amendment 2, so the change is piece 1c's.

No cite below carries a sha256, because I have no shell; the custodian fills them by script.

---

# ADR-036's pre-acceptance block: the 2026-10-09 rulings, milestone 4's OPEN-4 (A′) and piece 1c's ruled items applied to ADR-036 before its acceptance (full form)

- **Path:** `kernel/ADR-036-PRE-ACCEPTANCE-BLOCK-PREREGISTRATION.md`.
- **Authority:**
  - PLAN node `adr-036-pre-acceptance-block`, its whole summary (cited by node id).
  - Route (i), and the block's contents named: `state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:10 @ 2879e17f`.
  - Piece 1c's rulings that the block carries: the same file's `:16`, `:17` and `:18 @ 2879e17f`.
  - Milestone 4's OPEN-4 (A′): the same file's `:20 @ 2879e17f`.
  - The block's rulings (OPEN-A (c), B1's last sentence, OPEN-L, R, D, S and O, OPEN-W (a) with one sentence): `state/directives/2026-10-21-adr-036-block-ruled-open-a-c-b1-words-open-w-sentence-adr-022-amendment-2-steps-file.md:8-12 @ 2879e17f`.
  - The 2026-10-09 rulings: `state/directives/2026-10-09-adr-036-ten-findings-rulings.md:8-49 @ 2879e17f`. Where `:38-49` restates a sentence, the restatement governs (that file's filing note).
  - The docs lane's terms: `state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:18-20 @ 2879e17f`.
- **Inputs:**
  - the architect's draft, `state/consults/2026-10-21-adr-036-pre-acceptance-block-architect-draft.md`;
  - the acceptance consult, `state/consults/2026-10-21-adr-036-acceptance-architect-consult.md`;
  - the `.spatial` check, `state/consults/2026-10-21-spatial-extension-check-custodian.md`.
- **Drafted by** the architect, read only, at main 2879e17f.
- **Committed before any code.** Append-only once committed. An amendment made after any outcome has been seen says so in its first line.
- **Form and gating: the full form, with full gating from dispatch.**
  - The piece changes ADR text, which is a §21a category and a red line (`AUTONOMY.md:315-332 @ 2879e17f`).
  - Its `Out-of-scope` line could not assert that it touches none of the four categories. So §25(e) closes the five-line form (`AUTONOMY.md:482 @ 2879e17f`).
  - It is under §21c's size (`AUTONOMY.md:349-357 @ 2879e17f`), but the size does not decide the form here.
  - The lane's terms hold: documents only, with no code logic, no test assertion, no string the app shows, and nothing under `scripts/plan`.
  - Verdicts follow section 2 of `state/directives/2026-10-05-product-first-direction.md`.

## §0. Disclosure

**0.1 Inputs.** No pilot, spike, corpus or measurement has run. No fixture is used.

**0.2 The reuse index** (the standing step). This is the custodian's run of `node tools/reuse.mjs` in the private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c, the tool at that commit, byte for byte as briefed:

```text
$ node tools/reuse.mjs project file format line
capability: format-forward-compatibility → nbformat [CONCEPTUAL], KiCad [CONCEPTUAL], OpenLineage [CONCEPTUAL], excalidraw [REJECT]   (worth-owning, P0)
$ node tools/reuse.mjs lineage reader
No prior art recorded for "lineage reader". Research it before planning an implementation.
$ node tools/reuse.mjs category match style
No prior art recorded for "category match style". Research it before planning an implementation.
```

What the block takes from the one hit, as concepts only (paraphrase). The rows are at lines 213 to 216 of the private clone's REUSE-ROUND-1.md, at 89bbac37.
- nbformat's slot for an unrecognised element is already ADR-036 §3's one opaque slot.
- KiCad's keep-the-original informs OPEN-D, whose detail is left to piece 1c.
- excalidraw drops unknown types. That is the counter-example §3 refuses.

Nothing is copied. The two misses are noted, and they do not block.

**0.3 The reserved-name list (OPEN-R (a)), checked.**
- The custodian read Microsoft's "Naming Files, Paths, and Namespaces" (https://learn.microsoft.com/en-us/windows/win32/fileio/naming-a-file, ms.date 2024-08-28). By the custodian's reading (paraphrase), it reserves 28 names: CON, PRN, AUX, NUL, COM1 to COM9, COM¹ to COM³, LPT1 to LPT9, and LPT¹ to LPT³. It advises avoiding those names followed by an extension, and ending a name in a space or a period.
- The ruled list is a superset of the page's. Four names go beyond it, `COM0`, `LPT0`, `CONIN$` and `CONOUT$`, and they are kept by the human's OPEN-R (a).
- The page does not tie case-insensitivity to its list. The ruled comparison without regard to ASCII case is likewise kept by OPEN-R (a).

**0.4 The tree as found** (at 2879e17f):
- The reader on main does not yet meet A3's "refuses any other spelling, order or layout". 1b's history reader reads through `serde_json` (`state/consults/2026-10-21-b2-piece-1c-save-and-reopen-architect-draft.md:86 @ 2879e17f`).
- It does not yet meet A4's widened canonical form: `kernel/src/dataset_ref.rs:544-552 @ 2879e17f` refuses only `\`, `:`, and empty, `.` and `..` segments.
- It does not yet meet B4's writer refusal. `kernel/src/dataset_ref.rs:358-373 @ 2879e17f` writes the integers unchecked, while `:468-474` refuses a larger value on read.
- It refuses A7's match: `kernel/src/session_history.rs:545-564 @ 2879e17f` and `protocol/skp/SKP-V0.md:1247-1256 @ 2879e17f`.
- Each of these is code owed elsewhere (§2.6). The block states the format. It claims nothing of the code on main.
- B5 matches the reader on main (`kernel/src/dataset_ref.rs:484-498 @ 2879e17f`).
- **No existing file becomes invalid:**
  - no project file or lineage file exists;
  - 1a and 1b write `machine-recorded` locators only;
  - a 1b session history (`actions` 2, literal style values) stays valid under A7, which only widens what is accepted.

**0.5 A finding against the human's words, for the human.** B1's last sentence cites KNOWN-LIMITATIONS items 19 to 28 (`KNOWN-LIMITATIONS.md:230-332 @ 2879e17f`).
- Items 19 and 23 to 28 describe what the sentence says: the detector, and the advisory watch with its limits.
- Items 20, 21 and 22 describe other limits: a partitioned source, publishing data in degrees, and the sanity check.
- The words are the human's and stand as written unless the human changes them. The narrower reading would be "items 19 and 23 to 28".

**0.6 Pins are historical.** Every `path:line @ 2879e17f` is a read at that commit. At this piece's base B, the worker re-reads ADR-036 and `docs/README.md:73`.
- If ADR-036 at B differs from ADR-036 at 2879e17f, that is invalidator I1.
- A moved cite elsewhere is class 3.

## §1. What this preregistration may and may not claim

- **May claim:** ADR-036 at H equals ADR-036 at B with §2.1 to §2.4 applied, byte for byte; and `docs/README.md` is regenerated from the Status line by its generator.
- **May not claim:**
  - acceptance;
  - any behaviour of code;
  - that the code on main meets A3, A4, A7 or B4;
  - any wire change;
  - that the reserved-name list is complete for every operating system;
  - any performance figure.
- **ADRs:**
  - Amended before acceptance: ADR-036 only, with the human's approved text.
  - Not touched: ADR-022 and every other ADR.

## §2. The change

### 2.0 Rules for applying it

- **(a) By script, by passage.** The worker applies each change by script to `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md`.
  - Each "as it stands" passage is matched by its bytes, not by its line number. A passage that does not match exactly once stops the piece (I2).
  - An insertion goes after the whole line named as its anchor.
- **(b) Text.** LF line ends, and one final LF kept. No byte outside the changes changes.
- **(c) Where the text comes from.**
  - The "as it stands" passages are byte-copied from the architect's Read at 2879e17f, and the custodian confirms each by script before committing.
  - The "new" passages are the architect's words as the human approved them (the block's rulings, lines 8 to 12), except the two marked as the human's (§2.3) and the two marked as the architect's words for the gate (§2.4).

### 2.1 Part A

**A0. Provenance.** One line, inserted after the line that begins `**Amended:** in piece 1b's form`:
```
**Amended:** in piece `adr-036-pre-acceptance-block`'s form (`kernel/ADR-036-PRE-ACCEPTANCE-BLOCK-PREREGISTRATION.md`, §2), before acceptance, by the human's route (i) (`state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md`) and the human's rulings on the block (`state/directives/2026-10-21-adr-036-block-ruled-open-a-c-b1-words-open-w-sentence-adr-022-amendment-2-steps-file.md`): the project file's name; canonical form (ruling 9); containment and the carrying rule (ruling 1, and piece 1c's OPEN-4 and OPEN-5); the copy-or-same question (ruling 8); the line-oriented layout; ruling 4's lineage members; the observation's integers bounded and the Snapshot column reserved (piece 1c's OPEN-14 and OPEN-15); the timing in the Status line and in §11; and milestone 4's OPEN-4 (A′), a match on `fillColor`. The last sentence of §5's containment rule, and the clause after the semicolon in §11's `workspace` bullet, are the human's words.
```

**A1. The Status line** (OPEN-S (a); red-line text).

As it stands, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:3 @ 2879e17f`:
```
**Status:** Proposed. **It binds nothing until the human accepts it.** Acceptance is due before piece 1c (`b2-piece-1c-save-and-reopen`) merges, the first piece that writes a file that a later version or another person reads. It is not architect-blockable until accepted.
```
New:
```
**Status:** Proposed. **It binds nothing until the human accepts it.** Acceptance is due once the pre-acceptance block (piece `adr-036-pre-acceptance-block`) has merged, and before piece 1c (`b2-piece-1c-save-and-reopen`), the first piece that writes a file that a later version or another person reads, starts its code. It is not architect-blockable until accepted.
```

**A2. The name, and the project file's members** (ruling 2; route (i)).

As it stands, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:20 @ 2879e17f` (inside the tree's fence):
```
  <project file>           the project file: one canonical JSON document
```
New: two spaces, `project.spatial`, then ten spaces.
```
  project.spatial          the project file: one JSON document in §2's line-oriented layout
```
As it stands, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:25 @ 2879e17f`:
```
> **OPEN, until the human accepts this ADR: the project file's name and extension.** The draft named it `project.spatial.json`. A file ending in `.json` cannot open the application by double-click, so the name and the extension are settled at acceptance.
```
New:
```
**The project file's name** is `project.spatial`, one fixed name (the human's ruling 2 of 2026-10-09). A web search found no common application that claims the `.spatial` extension (`state/consults/2026-10-21-spatial-extension-check-custodian.md`). File association and single instance are not decided here; they are a later piece's.
```
Inserted after the line that begins `Nothing else in the folder belongs to the format.` (`:27 @ 2879e17f`), with one blank line before it:
```
**The project file's members,** in this order and no other: `format` and `version` (§3); `project`, the project's identity (§4); `datasets`, an array holding one dataset entry (§5); `lineage` (§8); and `workspace` (§11).
```

**A3. The line-oriented layout** (OPEN-L (a); 2026-10-09, the line-oriented form).

As it stands, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:31-33 @ 2879e17f`:
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
- the subset escapes every control character, so every line break in the file is a layout break (`renderer/src/canonical.rs:22-38 @ 2879e17f`);
- the quoted rule is byte-exact with `docs/01_Principles.md:24 @ 2879e17f`;
- Projects is `docs/02_Architecture.md:48 @ 2879e17f`.

**A4. Line 71: the correction and ruling 9's reader** (OPEN-R (a)).

As it stands, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:71 @ 2879e17f`:
```
- `project-relative`: `at` is a path relative to the project folder, `/`-separated and in canonical form. Canonical form is not empty, does not begin with `/`, has no empty, `.` or `..` segment, and holds no `\` and no `:`, so that each path inside the folder has one spelling on every operating system. A reader refuses an `at` outside canonical form. Canonical form is checked on the text alone and does not by itself keep a path inside the project folder: containment, below, does;
```
New:
```
- `project-relative`: `at` is a path relative to the project folder, `/`-separated and in canonical form. Canonical form is not empty, does not begin with `/`, has no empty, `.` or `..` segment, and holds no `\`, no `:` and no control character (U+0000 to U+001F and U+007F to U+009F). No segment ends in a dot or a space, and no segment is a reserved device name: the part of the segment before its first `.`, with trailing spaces removed, is none of `CON`, `PRN`, `AUX`, `NUL`, `CONIN$`, `CONOUT$`, `COM0` to `COM9`, `COM¹`, `COM²`, `COM³`, `LPT0` to `LPT9`, `LPT¹`, `LPT²` and `LPT³`, compared without regard to ASCII case. A reader refuses an `at` outside canonical form. Canonical form fixes how a path is written, not which file it names: on a file system that ignores case or normalises Unicode, two texts in canonical form can name one file. Canonical form is checked on the text alone and does not by itself keep a path inside the project folder: containment, below, does;
```

**A5. Ruling 4's lineage members** (OPEN-D (a)).

As it stands, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:170 @ 2879e17f`:
```
- **How it is written:** whole, at each Save project, by writing a new file in the folder and renaming it over the old one. Piece 1c's amendment to this ADR states how a reader detects a project file and a lineage file from different saves, and what it shows then.
```
New:
```
- **How it is written:** whole, at each Save project, by writing a new file in the folder and renaming it over the old one. The lineage file is replaced first, and the project file after it.
- **What the project file records of it:** the project file's `lineage` member is `{"sha256":<"sha256:" and 64 lowercase hex characters>,"steps":<int>}`, the sha256 over the lineage file's bytes as written and the number of its step and withheld lines; or, where the project keeps no lineage file, the named state `not-kept` (§2). A reader never reads a lineage file whose bytes or count differ from the member as the project's lineage without saying so. Piece 1c's amendment to this ADR states how a reader tells which save each file is from, and what it shows then.
```
As it stands, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:194 @ 2879e17f`:
```
  - how a reader detects a project file and a lineage file from different saves, and what it shows then (1c, §8);
```
New:
```
  - how a reader tells which save a project file and a lineage file are from, and what it shows then (1c, §8);
```

**A6. Line 192** (OPEN-W (a)). The human's sentence is placed in it (§2.3).

As it stands, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:192 @ 2879e17f`:
```
- **The project file's `workspace` member** (the filters as applied, the style document, the map view, the analysis settings). Piece 1c proposes it as an amendment to this ADR, accepted together with it.
```
New:
```
- **The project file's `workspace` member** (the filters as applied, the style document, the map view, the analysis settings). It is a member of version 1, reserved by name: piece 1c defines its shape in an amendment to this ADR, appended after acceptance and landing no later than 1c's writer; no version-1 project file exists before piece 1c's writer, so 1c's amendment defining workspace completes version 1 and is not a version step.
```

**A7. Milestone 4's OPEN-4 (A′).**

As it stands, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:151 @ 2879e17f`:
```
| 2 | `style.set` | `style` | workspace mutation | `{"property":<"fillColor"\|"fillOpacity"\|"outlineColor"\|"outlineWidth">,"value":<value>}`; a colour is `#rrggbb` in lowercase, an opacity a number from 0 to 1, a width `{"value":<number>,"unit":"px"}`; each value is one ADR-017 §5a admits | (`style.set`, the `property`, the layer) | yes |
```
New:
```
| 2 | `style.set` | `style` | workspace mutation | `{"property":<"fillColor"\|"fillOpacity"\|"outlineColor"\|"outlineWidth">,"value":<value>}`; a colour is `#rrggbb` in lowercase, an opacity a number from 0 to 1, a width `{"value":<number>,"unit":"px"}`; for `fillColor` only, the value may instead be ADR-017 §5a's match, `{"match":{"column":<text>,"cases":[{"when":<text>,"then":<colour>}…],"on_null":<colour>,"on_unmatched":<colour>}}`, whose column is a column of the open dataset that §5a's match admits; each value is one ADR-017 §5a admits | (`style.set`, the `property`, the layer) | yes |
```
As it stands, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:153 @ 2879e17f`:
```
A `filter.apply` step's `dependencies` name the predicate's fields with their types; a `style.set` step's name none.
```
New:
```
A `filter.apply` step's `dependencies` name the predicate's fields with their types. A `style.set` step whose value is a match names the match column with its type; any other `style.set` step names none.
```
Checked against:
- §5a's shape and order: `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:264-275 @ 2879e17f`;
- text keys only: `renderer/src/compiled.rs:225-239 @ 2879e17f`;
- the `fields` form: `kernel/src/session_history.rs:416-425 @ 2879e17f`;
- `actions` and the collapse key are unchanged.

### 2.2 Part B (OPEN-A (c))

**B1. Ruling 1, with piece 1c's OPEN-4 (A) and OPEN-5 (B).**

As it stands, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:76 @ 2879e17f`:
```
**Which locators a project file carries.** A dataset entry in a project file always carries a `machine-recorded` locator. It also carries a `project-relative` locator, in canonical form, when the data is inside the project folder by the containment rule below, judged when the project is saved. It never carries an absolute path (§2). This rule binds the writer; a reader reads the locators an entry holds.
```
New:
```
**Which locators a project file carries.** A dataset entry in a project file always carries a `machine-recorded` locator. It also carries a `project-relative` locator, in canonical form, when the data is inside the project folder, is reached from it without a link (containment, below), and its path has a canonical form, each judged when the project is saved. Data inside the folder whose path has no canonical form on this machine carries the `machine-recorded` locator only, and the save is not refused. An entry never carries an absolute path (§2). This rule binds the writer; a reader reads the locators an entry holds.
```
As it stands, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:80 @ 2879e17f`:
```
- **containment,** which the resolver that opens the data checks on the resolved target, before it opens it. The resolver resolves the project folder and the target, following every symbolic link, junction and other reparse point, and opens the target only if its resolved path lies inside the resolved project folder. A target that resolves outside the folder is refused by name and never opened, however it gets there: through a link, through a name the operating system resolves to a device (such as `NUL` on Windows), or through a name the operating system rewrites (such as a segment ending in a dot or a space on Windows). A target that cannot be resolved is refused the same way.
```
New. The last sentence, from "The check is made when the data is opened.", is the human's (§2.3):
```
- **containment,** which the resolver that opens the data checks before it opens it, on every platform. The resolver goes from the project folder through each segment of the target and refuses every symbolic link and junction it meets below the folder, whether it points inside or outside; it opens the target only if each segment exists, each but the last is a folder, and the last is a regular file. A refused target is not opened, and is refused by name: a link, a name the operating system resolves to a device (such as `NUL` on Windows), a name the operating system rewrites (such as a segment ending in a dot or a space on Windows), or a target that cannot be resolved. A file kept by a cloud-sync service is not a link, and the resolver must open it. The check is made when the data is opened. A link or a rename that another program makes afterwards is not prevented, at the open or at any later read; a change the detector or the advisory watch sees ends the session, as KNOWN-LIMITATIONS items 19 to 28 describe, and piece 1c's form declares the rest.
```
Line 78 and line 82 change with it (§2.4).

**B2. Ruling 8** (its restatement governs).

As it stands, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:55 @ 2879e17f`:
```
- **A project opened from a second folder.** When a project's identity opens from a second folder while the first folder still exists, the user is asked once whether it is a copy or the same project. A copy gets a new identity and keeps its lineage, and its data links become its own: re-linking the data in one never changes where the other finds its data. The same project is remembered for that folder, and the question is not asked again there. If the first folder no longer exists, the project has moved, and nothing is asked. The question's wording is the human's at P6.
```
New:
```
- **A project opened from a second folder.** When a project's identity opens from a folder this machine has not opened it from, the user is asked once whether it is a copy or the same project if the first folder still holds a project with this identity, or if the first folder cannot be reached. If the first folder is gone, or holds another project or none, the project has moved, and nothing is asked. A copy gets a new identity, always written to the newly opened folder, and keeps its lineage, and its data links become its own: re-linking the data in one never changes where the other finds its data. The same project is remembered for that folder, and the question is not asked again there. The question's wording is the human's at P6.
```

**B4. Piece 1c's OPEN-14 (A).**

As it stands, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:84 @ 2879e17f`:
```
**`observed`** is the change-detection observation of the open that the reference was bound to: `byte_size`; `modified_ns` (a decimal string in minimal form, or the state `not-reported`); `footer_length`; `footer_sha256` (64 lowercase hex characters, or the state `not-read-over-ceiling`). Minimal form is digits only, with no sign and no leading zero unless the value is 0. A reader refuses any other spelling of either value, so each value has one spelling.
```
New:
```
**`observed`** is the change-detection observation of the open that the reference was bound to: `byte_size`; `modified_ns` (a decimal string in minimal form, or the state `not-reported`); `footer_length`; `footer_sha256` (64 lowercase hex characters, or the state `not-read-over-ceiling`). Minimal form is digits only, with no sign and no leading zero unless the value is 0. A reader refuses any other spelling of either value, so each value has one spelling. `byte_size` and `footer_length` are integers no greater than 2^53 − 1, so §2's rule for large integers does not reach them: a writer refuses to bind a reference to a larger file, and a reader refuses a larger value.
```

**B5. Piece 1c's OPEN-15 (A).**

Inserted after the line `| `portability_policy` | `linked-live-file` | `snapshot-sealed` |` (`:68 @ 2879e17f`), with one blank line before it:
```
The Snapshot column is reserved and is not part of version 1: a version-1 reader refuses a `content_hash` that is not the state `not-taken`, a `cache_status` other than `linked` and a `portability_policy` other than `linked-live-file`. A snapshot reference comes with stage 3, and with a `version` step (§3).
```
Inserted after the line that begins `  - **the coordinate epoch:**` (`:201 @ 2879e17f`):
```
  - **the Snapshot column** of §5's table (stage 3).
```

### 2.3 The human's words in the block

Both passages are byte-copied from the architect's Read of the block's rulings at 2879e17f, without the lead-in of their lines. Neither is changed.

**(1) B1's last sentence.** It is the passage after the colon that follows the quoted old sentence, at `state/directives/2026-10-21-adr-036-block-ruled-open-a-c-b1-words-open-w-sentence-adr-022-amendment-2-steps-file.md:10 @ 2879e17f`. It replaces the architect's last sentence of the new line 80.
```
The check is made when the data is opened. A link or a rename that another program makes afterwards is not prevented, at the open or at any later read; a change the detector or the advisory watch sees ends the session, as KNOWN-LIMITATIONS items 19 to 28 describe, and piece 1c's form declares the rest.
```

**(2) OPEN-W (a)'s sentence.** It is the words after "in A6 or the block: " at the same file's `:12 @ 2879e17f`.
```
no version-1 project file exists before piece 1c's writer, so 1c's amendment defining workspace completes version 1 and is not a version step.
```
It is placed in A6's new text, after a semicolon, for three reasons:
- Its subject is the `workspace` member, and A6 is the passage that reserves that member. The sentence states the version status of the reservation it sits beside.
- It begins with a lowercase word. As a line of its own, it would need a lead-in that is not the human's, or it would open a line in lowercase.
- Inside the bullet, it answers the version rule at `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:42 @ 2879e17f` where a reader of §11 meets the reservation.

To make room for it, the architect's own clause from the draft ("and no project file is written before that amendment has merged") becomes "appended after acceptance and landing no later than 1c's writer". The human's sentence then carries the fact that no version-1 file exists before that writer.

### 2.4 Consistency with B1's last sentence: two changes to the architect's own words, for the gate

The human's sentence declares that a link or rename made after the check is not prevented, at the open or at any later read. Two passages of the block then claim more than that.

**C1. Line 78.** As it stands, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:78 @ 2879e17f`:
```
**Containment.** A `project-relative` locator never points outside the project folder. Two rules hold this, and they are different things:
```
New (the architect's words). "Never points outside" is no longer held once a later link is declared not prevented. The new text claims only the check.
```
**Containment.** A `project-relative` locator is checked to lead inside the project folder, by two rules that are different things:
```

**C2. Line 82.** As it stands, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:82 @ 2879e17f`:
```
Piece 1c builds the writer and the resolver. Its form states how the target that is checked is the target that is opened.
```
New (the architect's words). The human's sentence already says that piece 1c's form declares the rest. The draft's "the window between the check and the open" was narrower than "at the open or at any later read", so the second sentence is dropped.
```
Piece 1c builds the writer and the resolver.
```

**No other passage of the block conflicts with the human's sentence:**
- B1's "A refused target is not opened" speaks of the check.
- A4 and B1's line 76 speak of text and of the judgment at save.

### 2.5 The index row

`docs/README.md`'s ADR-036 row is regenerated from the new Status line by `frontends/shell/scripts/adrIndex.mjs` (`npm run adr-index` in `frontends/shell`; `npm run verify:adr-index` fails on drift). It is never edited by hand.

Inferred from the row at `docs/README.md:73 @ 2879e17f`, not from a run:
```
| [ADR-036](adr/ADR-036-project-folder-step-record-and-dataset-reference.md) | B2's file formats: the project folder, the step record and the lasting dataset reference | Proposed. **It binds nothing until the human accepts it.** Acceptance is due once the pre-acceptance block (piece `adr-036-pre-acceptance-block`) has merged, and before piece 1c (`b2-piece-1c-save-and-reopen`), the first piece that writes a file that a later version or another person reads, starts its code. It is not architect-blockable until accepted. |
```
The acceptance then replaces the Status line with the human's typed words, and the row is regenerated again.

### 2.6 What this piece does not carry (by reference)

- **Piece 1c's code and its appended ADR-036 amendment** (items W, D, M, H and S): `state/consults/2026-10-21-b2-piece-1c-save-and-reopen-architect-revised-form.md:414-440 @ 2879e17f`.
- **ADR-022 Amendment 2**, with the human's change at `state/directives/2026-10-21-adr-036-block-ruled-open-a-c-b1-words-open-w-sentence-adr-022-amendment-2-steps-file.md:14 @ 2879e17f`. The block quotes no part of Amendment 2, so the change is piece 1c's.
  - It lands in 1c step 1's PR (`state/consults/2026-10-21-b2-piece-1c-save-and-reopen-architect-revised-form.md:444-450 @ 2879e17f`).
  - 1c's quoted copy at `:444` predates the change and must take it.
- **The recording widening:** PLAN node `record-step-style-match-widening`. It comes after this piece merges.
- **Live text calling ADR-036 Proposed:** the draft's list (`state/consults/2026-10-21-adr-036-pre-acceptance-block-architect-draft.md:272-280 @ 2879e17f`), taken up by 1c step 1 and a docs-lane piece.

### 2.7 Overlap (rule (00), `AUTONOMY.md:609 @ 2879e17f`)

This piece's paths:
- `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md`, by hand;
- `docs/README.md`, the generated ADR-036 row;
- this form;
- PLAN.yaml, the custodian's rows, with the generated `CUSTODIAN-QUEUE.*` and `site/`.

Nothing is under `protocol/`, `scripts/` or `.github/`, and no lockfile changes.

- **PR #239 (`walkthrough-current-view-rows-g1-n5`, docs lane, ready for the click).**
  - Its paths are `frontends/shell/MANUAL-WALKTHROUGH.md` Parts G and N, its form, and PLAN.yaml with the generated files (`frontends/shell/WALKTHROUGH-CURRENT-VIEW-ROWS-G1-N5-PREREGISTRATION.md:153-158 @ 2879e17f`).
  - The only shared path is PLAN.yaml, through the custodian's rows.
  - The docs lane runs one piece at a time (`state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:18 @ 2879e17f`). This node depends on #239's node, so the ADR edit starts after #239 merges.
  - This form's own commit touches no path of #239.
- **The redaction scan** (`bundle-redaction-scan-not-in-product-publish`, in progress, stopped at O0).
  - Its paths are at `kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:359-368 @ 2879e17f`: `kernel/src/bundle/redaction.rs`, `kernel/src/publish/`, `kernel/src/permission/` and `audit/reader.rs`, two kernel tests, `engine/src/fixture.rs`, `publish.rs`'s `mod tests`, one KNOWN-LIMITATIONS item, `kernel/README.md`, `engine/README.md` and its form.
  - Disjoint: nothing under `docs/`.
  - Its new KNOWN-LIMITATIONS item takes the next free number, so items 19 to 28, which B1 names, keep their numbers.
- **Piece 1c** (`state/consults/2026-10-21-b2-piece-1c-save-and-reopen-architect-revised-form.md:563-622 @ 2879e17f`).
  - It shares ADR-036 with step 1, in sequence by dependency: this block, then the acceptance, then step 1.
  - 1c regenerates nothing in `docs/README.md`.
  - This block does not touch ADR-022.
- **The governance lane** (`verify-quotes-round-item-cites`, drafted, `state/consults/2026-10-21-verify-quotes-round-item-cites-architect-draft.md:308-316 @ 2879e17f`).
  - Its paths are `scripts/plan/rulingSet.mjs`, `scripts/plan/verify-quotes.mjs` and `scripts/plan/verify-test-claims.mjs` with their tests, `scripts/plan/README.md` and `.github/workflows/governance-ci.yml`. They are disjoint.
  - Once it lands, round + item cites under `docs/adr/` must resolve. The block's new ADR text carries none: its cites are "ruling N", "piece 1c's OPEN-N" and "milestone 4's OPEN-4 (A′)", none in the `round N, item M` form.
  - This form's only round + item cite is round 25, item 2.
- **Governance D:** done. Its node is `done` in PLAN.yaml at 2879e17f.
- **Milestone 4 (`b1-shell-half`):** its paths (`state/consults/2026-10-21-b1-shell-half-milestone-4-architect-draft.md:328-350 @ 2879e17f`) are disjoint.
- **The recording piece** (`record-step-style-match-widening`): `protocol/` and `kernel/src/session_history.rs`. Disjoint, and it follows this piece.
- The custodian re-checks rule (00) at dispatch, against both slots and every PR awaiting merge.

### 2.8 Portability (R3)

No OS-dependent feature is added or changed, so R3 does not apply. The ADR text states rules that bind 1c's resolver per platform. They are 1c's to build and test.

## §3. Fixtures

None.

## §4. Tests and evidence

There is no new test and no assertion changes, so no mutation is owed. No record of this piece calls any run, a `verify-mutation` run included, an observation of a mutation (round 25, item 2 (c)).

Evidence at H, each named with its commit:
- **V1.** A script rebuilds ADR-036 from B's file with §2.1 to §2.4 applied as §2.0 says, and compares it byte for byte with H's file. It exits 0 on equality.
- **V2.** `npm run verify:adr-index` in `frontends/shell` exits 0.
- **V3.** `git diff --name-only B...H` lists only §2.7's paths.
- **V4.** `verify-cites`, `verify-quotes`, `verify-test-claims` and `verify.mjs` exit 0. `queue.mjs --check` and `site.mjs --check` report current.
- **V5.** The `node --test` suites for `scripts/plan`, `scripts/hooks` and `scripts/evidence` exit 0.
- **V6.** PR CI is green.

## §5. Predictions, declared unchanged, invalidators, falsification

- **Predictions:** V1 to V6 hold. §7's count is about 62 lines.
- **Declared unchanged:**
  - every line of ADR-036 outside §2.1 to §2.4;
  - every other ADR, ADR-022 included;
  - `docs/` apart from the regenerated row;
  - every code, test and fixture file;
  - KNOWN-LIMITATIONS.md;
  - every record under `state/`.
- **Invalidators** (stop and report):
  - **I1:** ADR-036 at B differs from ADR-036 at 2879e17f.
  - **I2:** a passage does not match exactly once.
  - **I3:** a change would need code, a test, or an ADR other than ADR-036.
  - **I4:** text in §2 differs from what the human approved.
- **Falsified if:** H's ADR-036 is not B's with these changes applied, byte for byte.

## §6. Instruments

Assertions only (V1 to V6). No measurement.

## §7. Declared values and ceilings

- **Counting:** `git diff --numstat B...H -- docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md`, insertions plus deletions. B and H are named in the PR body.
- **Ceiling:** 90 lines on ADR-036.
- **Files:**
  - ADR-036 by hand;
  - `docs/README.md` (generated, outside the count);
  - this form and PLAN.yaml (outside the count);
  - at most 4 in all, besides the generated queue and site files.
- **Budget:** 60 minutes.
- **No constant is added.**
- **An overrun is class 8** (`docs/PREREGISTRATION-TEMPLATE.md:169 @ 2879e17f`), and this section is never edited.

## §8. Block-on-sight

1. A byte of ADR-036 outside §2.1 to §2.4 changes, or a passage is applied other than as §2 gives it.
2. The human's two passages (§2.3) are not byte-identical to their source.
3. A Status line other than A1's new text before acceptance. Acceptance words typed by anyone but the human.
4. `docs/README.md` edited by hand.
5. A path outside §2.7, or any code, test, fixture, `scripts/` or `protocol/` change.
6. Quotation marks around text that is not byte-identical. A line cite into `DECISIONS-PENDING.md`. A bare self-line. A pin read as current.
7. A round + item cite, outside backticks, that does not resolve.
8. The items of round 25, item 2, by name:
   - an overrun not recorded as class 8, or §7 edited;
   - a scope addition not recorded as class 9, or its code before the amendment;
   - a `verify-mutation` run called an observation;
   - a test-text span on the branch pinned by hash at a branch commit, or named without its commit id;
   - a five-line form.

## §9. Gates

- **Steps:**
  - S0: this form, with the custodian's hashes, committed before any edit. The node's `gate` is set to it.
  - S1: after PR #239 merges, the ADR-036 edit and the regenerated row, at base B.
  - S2: V1 to V6.
  - S3: the closing amendment, references and hashes only.
  - S4: both gates.
- **Architect:**
  - each change against its ruling;
  - no claim of a guarantee that the rulings or the code do not support (A3, A4, B1, B4 and §2.4 above all);
  - A7's seam against `record_step` and `admit_match_type` as read (§0.4);
  - the round + item rule (§2.7);
  - §8 item by item.
- **Reviewer:** the full diff `origin/main...HEAD`; V1 rerun; §7 by its command; every hash recomputed.
- **Merge:** a merge commit, the human's click. Then the human types the acceptance, which the custodian applies with `docs/README.md` regenerated.
- **Operator:** none. There is no app string and no walkthrough row.

## §10. Amendments

*(Opens empty; append-only.)*

---

**What changed from the draft, and why**
1. **OPEN-A (c), and the rest of the block's rulings, applied.** Parts A and B are carried, with B1, B2, B4 and B5. OPEN-L (a), OPEN-R (a), OPEN-D (a) and OPEN-S (a) are taken as drafted.
2. **B1's last sentence** is the human's, byte-copied (§2.3 (1)).
3. **OPEN-W's sentence** is the human's, byte-copied into A6 after a semicolon (§2.3 (2) gives why). My own clause in A6 now reads "appended after acceptance and landing no later than 1c's writer", so it does not restate the human's fact.
4. **Two changes to my own words**, made to stay consistent with the human's sentence and marked for the gate (§2.4):
   - C1 at line 78: "never points outside" became "is checked to lead inside";
   - C2 at line 82: my second sentence was dropped.
5. **A0** names the second directive, and says which two passages are the human's words.
6. **The finding against the human's words (§0.5):** items 20 to 22 sit inside the cited range 19 to 28 but describe other limits. The words are unchanged.
7. **The reserved-name check is in §0.3:** the page and its date, and the four names beyond its list, kept by OPEN-R (a).
8. **Rule (00) rewritten against the tree at 2879e17f:**
   - #239 goes first in the lane, by the node's dependency;
   - the redaction scan is disjoint;
   - 1c runs in sequence;
   - the governance lane is disjoint, and the block's ADR text carries no round + item cite;
   - D is done;
   - the recording node exists and comes after this piece.
9. **ADR-022 Amendment 2's change (directive line 14) is not carried**, because the block quotes nothing of Amendment 2. It falls to 1c, whose quoted copy at `state/consults/2026-10-21-b2-piece-1c-save-and-reopen-architect-revised-form.md:444 @ 2879e17f` predates it.
10. **The ceiling** is 90 lines. The estimate is 62, including C1.

**What I could not settle**
- Whether the human keeps "items 19 to 28" or narrows it (§0.5). Since this is red-line text, a gate may block on the range.
- The regenerated `docs/README.md` row is inferred, not produced by a run.
- C1 and C2 are my words and stand only if the gate accepts them. If the human prefers, line 78 could also be left for 1c's appended amendment, but acceptance would then bind "never points outside".
- Every sha256 is left for the custodian to fill by script.
