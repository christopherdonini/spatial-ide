# ADR-036's pre-acceptance block: the 2026-10-09 rulings, milestone 4's OPEN-4 (A′) and piece 1c's ruled items applied to ADR-036 before its acceptance (full form)

- **Path:** `kernel/ADR-036-PRE-ACCEPTANCE-BLOCK-PREREGISTRATION.md`.
- **Authority:**
  - PLAN node `adr-036-pre-acceptance-block`, its whole summary (cited by node id).
  - Route (i), and the block's contents named: `state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:10` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:4b060a097e2669c574a255533c6db432f4f3bb4e477b51d38bb8f192cbff8f1d.
  - Piece 1c's rulings that the block carries: the same file's `state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:16` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:67b0c2963e8b393cd62e79d48d17aaeafc9e9a296d2f366bb27fa1793449fead, `state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:17` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:db5b3cb0e1dd5d827d89a054ced7dc99f50035d53fff4c2f8babff7e7a7aa5f9 and `state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:18` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:d1d7fc703d7e2d9944ef8dd56bcdd84103fe41c4029c2ab58c704d06b5828641.
  - Milestone 4's OPEN-4 (A′): the same file's `state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:20` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:0492f90a35a4b8ec4a2d45ee5df5be2253f7891e5410f66b606d49b04dd04fdb.
  - The block's rulings (OPEN-A (c), B1's last sentence, OPEN-L, R, D, S and O, OPEN-W (a) with one sentence): `state/directives/2026-10-21-adr-036-block-ruled-open-a-c-b1-words-open-w-sentence-adr-022-amendment-2-steps-file.md:8-12` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:44d0abb49227a4d619e66940a37c2fe2ed272f2acd3cd2d5f74c19101b7ac0bd.
  - The 2026-10-09 rulings: `state/directives/2026-10-09-adr-036-ten-findings-rulings.md:8-49` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:cd8df2f984ef66826967b183bd9fb9b576ac3be75917d15c4114baeec8b1c978. Where `:38-49` restates a sentence, the restatement governs (that file's filing note).
  - The docs lane's terms: `state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:18-20` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:79bf7e4ce7c83dd00e862d47811ec424241cc26e36a14939c3939696a9bae1da.
- **Inputs:**
  - the architect's draft, `state/consults/2026-10-21-adr-036-pre-acceptance-block-architect-draft.md`;
  - the acceptance consult, `state/consults/2026-10-21-adr-036-acceptance-architect-consult.md`;
  - the `.spatial` check, `state/consults/2026-10-21-spatial-extension-check-custodian.md`.
- **Drafted by** the architect, read only, at main 2879e17f.
- **Committed before any code.** Append-only once committed. An amendment made after any outcome has been seen says so in its first line.
- **Form and gating: the full form, with full gating from dispatch.**
  - The piece changes ADR text, which is a §21a category and a red line (`AUTONOMY.md:315-332` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:211fe30919ba9ee55447ac9f66874374382d972ab58269c8f074a79fd4693cb3).
  - Its `Out-of-scope` line could not assert that it touches none of the four categories. So §25(e) closes the five-line form (`AUTONOMY.md:482` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:4f388e9f3fe7a1d68117edb03f7c2520ce771901a96feff1752f426befe4c669).
  - It is under §21c's size (`AUTONOMY.md:349-357` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:c99b2fcabe5d66acf6c904d268db4cb8f1d2451a4429bcba596b0381a2749159), but the size does not decide the form here.
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
- The reader on main does not yet meet A3's "refuses any other spelling, order or layout". 1b's history reader reads through `serde_json` (`state/consults/2026-10-21-b2-piece-1c-save-and-reopen-architect-draft.md:86` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:f42bc6d45f1adbea9a102509df0d96c7b41911deab96f9711fc94a1ed61f3328).
- It does not yet meet A4's widened canonical form: `kernel/src/dataset_ref.rs:544-552` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:4575412217a455c40407714963f45f4b4f64a881a863217be9632ce463224aec refuses only `\`, `:`, and empty, `.` and `..` segments.
- It does not yet meet B4's writer refusal. `kernel/src/dataset_ref.rs:358-373` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:fdcfd9ba12671b117f6f75a5727c7870e3a1bacdc1b9d1e17f7499ee007c8386 writes the integers unchecked, while `kernel/src/dataset_ref.rs:468-474` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:16476d6357813510990f949f9c7f534a3bad18139380ce1e0df67e592ca9c3d0 refuses a larger value on read.
- It refuses A7's match: `kernel/src/session_history.rs:545-564` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:751ea8151e170eac74e2b9a0685d3a1f4bb7b8a0094905a58fa4e4514b5f2b02 and `protocol/skp/SKP-V0.md:1247-1256` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:9e1b673f3d0c96e5d8df517edbf1d5c84141adae4f212d34e79d55b9b6a32b81.
- Each of these is code owed elsewhere (§2.6). The block states the format. It claims nothing of the code on main.
- B5 matches the reader on main (`kernel/src/dataset_ref.rs:484-498` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:272b221d4fbf37befb511d3aac5a4846cc8ee3112144b4cf8b3d8109e4d389a4).
- **No existing file becomes invalid:**
  - no project file or lineage file exists;
  - 1a and 1b write `machine-recorded` locators only;
  - a 1b session history (`actions` 2, literal style values) stays valid under A7, which only widens what is accepted.

**0.5 A finding against the human's words, for the human.** B1's last sentence cites KNOWN-LIMITATIONS items 19 to 28 (`KNOWN-LIMITATIONS.md:230-332` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:6a31139ac0df20a0abb8f4262e31394f6d7ea4e96478197d48a708a82170417b).
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

As it stands, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:3` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:68a85a403930fef1ce670273820c125d3c4fa13714737107ffad3728a4c800ed:
```
**Status:** Proposed. **It binds nothing until the human accepts it.** Acceptance is due before piece 1c (`b2-piece-1c-save-and-reopen`) merges, the first piece that writes a file that a later version or another person reads. It is not architect-blockable until accepted.
```
New:
```
**Status:** Proposed. **It binds nothing until the human accepts it.** Acceptance is due once the pre-acceptance block (piece `adr-036-pre-acceptance-block`) has merged, and before piece 1c (`b2-piece-1c-save-and-reopen`), the first piece that writes a file that a later version or another person reads, starts its code. It is not architect-blockable until accepted.
```

**A2. The name, and the project file's members** (ruling 2; route (i)).

As it stands, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:20` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:a26e27922dbb2cb0e593465ab2ce6b416b035ec41c37b7eda532d2e7134c8aa7 (inside the tree's fence):
```
  <project file>           the project file: one canonical JSON document
```
New: two spaces, `project.spatial`, then ten spaces.
```
  project.spatial          the project file: one JSON document in §2's line-oriented layout
```
As it stands, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:25` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:5dba431575f0a223f45243d22298a54224d30ce84652864a71cd1a5fb0f3fdf7:
```
> **OPEN, until the human accepts this ADR: the project file's name and extension.** The draft named it `project.spatial.json`. A file ending in `.json` cannot open the application by double-click, so the name and the extension are settled at acceptance.
```
New:
```
**The project file's name** is `project.spatial`, one fixed name (the human's ruling 2 of 2026-10-09). A web search found no common application that claims the `.spatial` extension (`state/consults/2026-10-21-spatial-extension-check-custodian.md`). File association and single instance are not decided here; they are a later piece's.
```
Inserted after the line that begins `Nothing else in the folder belongs to the format.` (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:27` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:90fecbaeb05b4dfee1d5ce682a6a26b012202380d93de26665e6acd5c43d31d1), with one blank line before it:
```
**The project file's members,** in this order and no other: `format` and `version` (§3); `project`, the project's identity (§4); `datasets`, an array holding one dataset entry (§5); `lineage` (§8); and `workspace` (§11).
```

**A3. The line-oriented layout** (OPEN-L (a); 2026-10-09, the line-oriented form).

As it stands, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:31-33` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:2e73211f26cccdd93ceace8c2869867b09a22e2422d386a6f8309f94df2ac64e:
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
- the subset escapes every control character, so every line break in the file is a layout break (`renderer/src/canonical.rs:22-38` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:bacedf05839a2d4c22f8c3e6a00b70e7d58fb22a35dd9de73246b488ca613215);
- the quoted rule is byte-exact with `docs/01_Principles.md:24` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:b11defe6b0b033c683a0a9737a9e7105b4c68e7d1bc391238da6048458bc5055;
- Projects is `docs/02_Architecture.md:48` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:eb42cedfe9324a5081cd27af8d7d5c7ab964b442ba9568bc44f0c9037a0d746c.

**A4. Line 71: the correction and ruling 9's reader** (OPEN-R (a)).

As it stands, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:71` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:6476843dfffd7b1ac2f86d5c2d64751fd095cd35aad6377a04bf1d344e0e1a91:
```
- `project-relative`: `at` is a path relative to the project folder, `/`-separated and in canonical form. Canonical form is not empty, does not begin with `/`, has no empty, `.` or `..` segment, and holds no `\` and no `:`, so that each path inside the folder has one spelling on every operating system. A reader refuses an `at` outside canonical form. Canonical form is checked on the text alone and does not by itself keep a path inside the project folder: containment, below, does;
```
New:
```
- `project-relative`: `at` is a path relative to the project folder, `/`-separated and in canonical form. Canonical form is not empty, does not begin with `/`, has no empty, `.` or `..` segment, and holds no `\`, no `:` and no control character (U+0000 to U+001F and U+007F to U+009F). No segment ends in a dot or a space, and no segment is a reserved device name: the part of the segment before its first `.`, with trailing spaces removed, is none of `CON`, `PRN`, `AUX`, `NUL`, `CONIN$`, `CONOUT$`, `COM0` to `COM9`, `COM¹`, `COM²`, `COM³`, `LPT0` to `LPT9`, `LPT¹`, `LPT²` and `LPT³`, compared without regard to ASCII case. A reader refuses an `at` outside canonical form. Canonical form fixes how a path is written, not which file it names: on a file system that ignores case or normalises Unicode, two texts in canonical form can name one file. Canonical form is checked on the text alone and does not by itself keep a path inside the project folder: containment, below, does;
```

**A5. Ruling 4's lineage members** (OPEN-D (a)).

As it stands, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:170` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:926de254e57109433734a0ae2adde2c11086fb8bfd6ea608b957a342bd419a17:
```
- **How it is written:** whole, at each Save project, by writing a new file in the folder and renaming it over the old one. Piece 1c's amendment to this ADR states how a reader detects a project file and a lineage file from different saves, and what it shows then.
```
New:
```
- **How it is written:** whole, at each Save project, by writing a new file in the folder and renaming it over the old one. The lineage file is replaced first, and the project file after it.
- **What the project file records of it:** the project file's `lineage` member is `{"sha256":<"sha256:" and 64 lowercase hex characters>,"steps":<int>}`, the sha256 over the lineage file's bytes as written and the number of its step and withheld lines; or, where the project keeps no lineage file, the named state `not-kept` (§2). A reader never reads a lineage file whose bytes or count differ from the member as the project's lineage without saying so. Piece 1c's amendment to this ADR states how a reader tells which save each file is from, and what it shows then.
```
As it stands, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:194` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:7595f4e388db86a898df2b105798b9d065e760e07a50c276fda1921b65c23530:
```
  - how a reader detects a project file and a lineage file from different saves, and what it shows then (1c, §8);
```
New:
```
  - how a reader tells which save a project file and a lineage file are from, and what it shows then (1c, §8);
```

**A6. Line 192** (OPEN-W (a)). The human's sentence is placed in it (§2.3).

As it stands, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:192` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:ed1b3e0dc501033c5733f503aba37cc2bb4ef51f30b1ba40d805dd54d803b748:
```
- **The project file's `workspace` member** (the filters as applied, the style document, the map view, the analysis settings). Piece 1c proposes it as an amendment to this ADR, accepted together with it.
```
New:
```
- **The project file's `workspace` member** (the filters as applied, the style document, the map view, the analysis settings). It is a member of version 1, reserved by name: piece 1c defines its shape in an amendment to this ADR, appended after acceptance and landing no later than 1c's writer; no version-1 project file exists before piece 1c's writer, so 1c's amendment defining workspace completes version 1 and is not a version step.
```

**A7. Milestone 4's OPEN-4 (A′).**

As it stands, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:151` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:2f190ac5bdeac1f1aa67455a4f8509cddaf54c4b23c3721b83c6a888c0926471:
```
| 2 | `style.set` | `style` | workspace mutation | `{"property":<"fillColor"\|"fillOpacity"\|"outlineColor"\|"outlineWidth">,"value":<value>}`; a colour is `#rrggbb` in lowercase, an opacity a number from 0 to 1, a width `{"value":<number>,"unit":"px"}`; each value is one ADR-017 §5a admits | (`style.set`, the `property`, the layer) | yes |
```
New:
```
| 2 | `style.set` | `style` | workspace mutation | `{"property":<"fillColor"\|"fillOpacity"\|"outlineColor"\|"outlineWidth">,"value":<value>}`; a colour is `#rrggbb` in lowercase, an opacity a number from 0 to 1, a width `{"value":<number>,"unit":"px"}`; for `fillColor` only, the value may instead be ADR-017 §5a's match, `{"match":{"column":<text>,"cases":[{"when":<text>,"then":<colour>}…],"on_null":<colour>,"on_unmatched":<colour>}}`, whose column is a column of the open dataset that §5a's match admits; each value is one ADR-017 §5a admits | (`style.set`, the `property`, the layer) | yes |
```
As it stands, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:153` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:d5f4db532ace783019efe64b03e3915eced3cd2854bdd836f906e9da209009d6:
```
A `filter.apply` step's `dependencies` name the predicate's fields with their types; a `style.set` step's name none.
```
New:
```
A `filter.apply` step's `dependencies` name the predicate's fields with their types. A `style.set` step whose value is a match names the match column with its type; any other `style.set` step names none.
```
Checked against:
- §5a's shape and order: `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:264-275` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:65fc8e8ca45f1ba6d28e281c36fdabcda2df6d234fd709b2a0232beea2b33682;
- text keys only: `renderer/src/compiled.rs:225-239` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:eefa7767c167f085310750365080dea5c86e9c1c1c49ed0e8cc2fe9419f688ba;
- the `fields` form: `kernel/src/session_history.rs:416-425` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:3ec13483be7f9e849e137ecde136aabc81cd3a6df14ca93aadd7ba02511a1977;
- `actions` and the collapse key are unchanged.

### 2.2 Part B (OPEN-A (c))

**B1. Ruling 1, with piece 1c's OPEN-4 (A) and OPEN-5 (B).**

As it stands, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:76` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:13eac719f8f4832e113caabfe3eddbc2909ff5ee6330b1b34ac8a1db79eb3544:
```
**Which locators a project file carries.** A dataset entry in a project file always carries a `machine-recorded` locator. It also carries a `project-relative` locator, in canonical form, when the data is inside the project folder by the containment rule below, judged when the project is saved. It never carries an absolute path (§2). This rule binds the writer; a reader reads the locators an entry holds.
```
New:
```
**Which locators a project file carries.** A dataset entry in a project file always carries a `machine-recorded` locator. It also carries a `project-relative` locator, in canonical form, when the data is inside the project folder, is reached from it without a link (containment, below), and its path has a canonical form, each judged when the project is saved. Data inside the folder whose path has no canonical form on this machine carries the `machine-recorded` locator only, and the save is not refused. An entry never carries an absolute path (§2). This rule binds the writer; a reader reads the locators an entry holds.
```
As it stands, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:80` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:430572e81a3205dc5dd5d51a788ed7a58e903196936b6cc5c09b3165ba1f6785:
```
- **containment,** which the resolver that opens the data checks on the resolved target, before it opens it. The resolver resolves the project folder and the target, following every symbolic link, junction and other reparse point, and opens the target only if its resolved path lies inside the resolved project folder. A target that resolves outside the folder is refused by name and never opened, however it gets there: through a link, through a name the operating system resolves to a device (such as `NUL` on Windows), or through a name the operating system rewrites (such as a segment ending in a dot or a space on Windows). A target that cannot be resolved is refused the same way.
```
New. The last sentence, from "The check is made when the data is opened.", is the human's (§2.3):
```
- **containment,** which the resolver that opens the data checks before it opens it, on every platform. The resolver goes from the project folder through each segment of the target and refuses every symbolic link and junction it meets below the folder, whether it points inside or outside; it opens the target only if each segment exists, each but the last is a folder, and the last is a regular file. A refused target is not opened, and is refused by name: a link, a name the operating system resolves to a device (such as `NUL` on Windows), a name the operating system rewrites (such as a segment ending in a dot or a space on Windows), or a target that cannot be resolved. A file kept by a cloud-sync service is not a link, and the resolver must open it. The check is made when the data is opened. A link or a rename that another program makes afterwards is not prevented, at the open or at any later read; a change the detector or the advisory watch sees ends the session, as KNOWN-LIMITATIONS items 19 to 28 describe, and piece 1c's form declares the rest.
```
Line 78 and line 82 change with it (§2.4).

**B2. Ruling 8** (its restatement governs).

As it stands, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:55` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:a15ad79ffd80ec28fdd3d6ed50725edac376d08fd2000e9e2bb1d381ada7e6db:
```
- **A project opened from a second folder.** When a project's identity opens from a second folder while the first folder still exists, the user is asked once whether it is a copy or the same project. A copy gets a new identity and keeps its lineage, and its data links become its own: re-linking the data in one never changes where the other finds its data. The same project is remembered for that folder, and the question is not asked again there. If the first folder no longer exists, the project has moved, and nothing is asked. The question's wording is the human's at P6.
```
New:
```
- **A project opened from a second folder.** When a project's identity opens from a folder this machine has not opened it from, the user is asked once whether it is a copy or the same project if the first folder still holds a project with this identity, or if the first folder cannot be reached. If the first folder is gone, or holds another project or none, the project has moved, and nothing is asked. A copy gets a new identity, always written to the newly opened folder, and keeps its lineage, and its data links become its own: re-linking the data in one never changes where the other finds its data. The same project is remembered for that folder, and the question is not asked again there. The question's wording is the human's at P6.
```

**B4. Piece 1c's OPEN-14 (A).**

As it stands, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:84` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:a79b551f28cd7ddbc7a9fad4c6bbf780dc51b5a89842b845163ea7eb62fc9d1a:
```
**`observed`** is the change-detection observation of the open that the reference was bound to: `byte_size`; `modified_ns` (a decimal string in minimal form, or the state `not-reported`); `footer_length`; `footer_sha256` (64 lowercase hex characters, or the state `not-read-over-ceiling`). Minimal form is digits only, with no sign and no leading zero unless the value is 0. A reader refuses any other spelling of either value, so each value has one spelling.
```
New:
```
**`observed`** is the change-detection observation of the open that the reference was bound to: `byte_size`; `modified_ns` (a decimal string in minimal form, or the state `not-reported`); `footer_length`; `footer_sha256` (64 lowercase hex characters, or the state `not-read-over-ceiling`). Minimal form is digits only, with no sign and no leading zero unless the value is 0. A reader refuses any other spelling of either value, so each value has one spelling. `byte_size` and `footer_length` are integers no greater than 2^53 − 1, so §2's rule for large integers does not reach them: a writer refuses to bind a reference to a larger file, and a reader refuses a larger value.
```

**B5. Piece 1c's OPEN-15 (A).**

Inserted after the line `| `portability_policy` | `linked-live-file` | `snapshot-sealed` |` (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:68` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:4252999a6a767cfe71877947d50a8dbe00a3ee2b65c42d9f9a0fd4779225c4bb), with one blank line before it:
```
The Snapshot column is reserved and is not part of version 1: a version-1 reader refuses a `content_hash` that is not the state `not-taken`, a `cache_status` other than `linked` and a `portability_policy` other than `linked-live-file`. A snapshot reference comes with stage 3, and with a `version` step (§3).
```
Inserted after the line that begins `  - **the coordinate epoch:**` (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:201` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:829659e4b27f6e175709d7b7e9dc4b27eba85aeca475fde518c85dda88e01020):
```
  - **the Snapshot column** of §5's table (stage 3).
```

### 2.3 The human's words in the block

Both passages are byte-copied from the architect's Read of the block's rulings at 2879e17f, without the lead-in of their lines. Neither is changed.

**(1) B1's last sentence.** It is the passage after the colon that follows the quoted old sentence, at `state/directives/2026-10-21-adr-036-block-ruled-open-a-c-b1-words-open-w-sentence-adr-022-amendment-2-steps-file.md:10` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:0edc2a5c9cdee23fae05f161ba8b90766784d4d1473c10364aa9528ddb74865e. It replaces the architect's last sentence of the new line 80.
```
The check is made when the data is opened. A link or a rename that another program makes afterwards is not prevented, at the open or at any later read; a change the detector or the advisory watch sees ends the session, as KNOWN-LIMITATIONS items 19 to 28 describe, and piece 1c's form declares the rest.
```

**(2) OPEN-W (a)'s sentence.** It is the words after "in A6 or the block: " at the same file's `state/directives/2026-10-21-adr-036-block-ruled-open-a-c-b1-words-open-w-sentence-adr-022-amendment-2-steps-file.md:12` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:0e20db0163eb6c286410197042bb013785574195e57401380dcbb7e2ef22080d.
```
no version-1 project file exists before piece 1c's writer, so 1c's amendment defining workspace completes version 1 and is not a version step.
```
It is placed in A6's new text, after a semicolon, for three reasons:
- Its subject is the `workspace` member, and A6 is the passage that reserves that member. The sentence states the version status of the reservation it sits beside.
- It begins with a lowercase word. As a line of its own, it would need a lead-in that is not the human's, or it would open a line in lowercase.
- Inside the bullet, it answers the version rule at `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:42` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:c1308d8b709dadcf4c9c01993cdffc4b5c2dbd633f92043bafaa8d206b1b6791 where a reader of §11 meets the reservation.

To make room for it, the architect's own clause from the draft ("and no project file is written before that amendment has merged") becomes "appended after acceptance and landing no later than 1c's writer". The human's sentence then carries the fact that no version-1 file exists before that writer.

### 2.4 Consistency with B1's last sentence: two changes to the architect's own words, for the gate

The human's sentence declares that a link or rename made after the check is not prevented, at the open or at any later read. Two passages of the block then claim more than that.

**C1. Line 78.** As it stands, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:78` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:d08628e3496131eea481047a73cfd81b8abf210f699fd00f7d0f0bbd1fd8ae59:
```
**Containment.** A `project-relative` locator never points outside the project folder. Two rules hold this, and they are different things:
```
New (the architect's words). "Never points outside" is no longer held once a later link is declared not prevented. The new text claims only the check.
```
**Containment.** A `project-relative` locator is checked to lead inside the project folder, by two rules that are different things:
```

**C2. Line 82.** As it stands, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:82` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:f29ffdcddd50027bb2d3f19f55f72fd93a8d865d0e058e264ee238f21192fcbe:
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

Inferred from the row at `docs/README.md:73` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:07a78182b8f923390f31f891495cfd4f053c0d490c7f36807ba27218658d0b12, not from a run:
```
| [ADR-036](adr/ADR-036-project-folder-step-record-and-dataset-reference.md) | B2's file formats: the project folder, the step record and the lasting dataset reference | Proposed. **It binds nothing until the human accepts it.** Acceptance is due once the pre-acceptance block (piece `adr-036-pre-acceptance-block`) has merged, and before piece 1c (`b2-piece-1c-save-and-reopen`), the first piece that writes a file that a later version or another person reads, starts its code. It is not architect-blockable until accepted. |
```
The acceptance then replaces the Status line with the human's typed words, and the row is regenerated again.

### 2.6 What this piece does not carry (by reference)

- **Piece 1c's code and its appended ADR-036 amendment** (items W, D, M, H and S): `state/consults/2026-10-21-b2-piece-1c-save-and-reopen-architect-revised-form.md:414-440` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:a9848b051d6e960594b14458eef911999645a849e2f3f616ec9a32220bf1013f.
- **ADR-022 Amendment 2**, with the human's change at `state/directives/2026-10-21-adr-036-block-ruled-open-a-c-b1-words-open-w-sentence-adr-022-amendment-2-steps-file.md:14` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:e4acf988768cac287ac0b4607a7c9591965e6c4d209ab5d42ff0268c45516ba1. The block quotes no part of Amendment 2, so the change is piece 1c's.
  - It lands in 1c step 1's PR (`state/consults/2026-10-21-b2-piece-1c-save-and-reopen-architect-revised-form.md:444-450` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:2c9bfc31dc99b6bef150177572406b16e908cd23660fc2906057ae921c837ac9).
  - 1c's quoted copy at `state/consults/2026-10-21-b2-piece-1c-save-and-reopen-architect-revised-form.md:444` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:c6926f9674fa199ecd59428ab9e6339f31ab604253c15d97daa6409cd9ab65e1 predates the change and must take it.
- **The recording widening:** PLAN node `record-step-style-match-widening`. It comes after this piece merges.
- **Live text calling ADR-036 Proposed:** the draft's list (`state/consults/2026-10-21-adr-036-pre-acceptance-block-architect-draft.md:272-280` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:fc2e171e679eb505cdde56cb02d6e7cb0fb8c5f6d97a798f8c273c536f7f7780), taken up by 1c step 1 and a docs-lane piece.

### 2.7 Overlap (rule (00), `AUTONOMY.md:609` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:db1a80acb95c7872de091ec4a4eb9647e09c17b0a5475050b4d934e0a39e2bd0)

This piece's paths:
- `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md`, by hand;
- `docs/README.md`, the generated ADR-036 row;
- this form;
- PLAN.yaml, the custodian's rows, with the generated `CUSTODIAN-QUEUE.*` and `site/`.

Nothing is under `protocol/`, `scripts/` or `.github/`, and no lockfile changes.

- **PR #239 (`walkthrough-current-view-rows-g1-n5`, docs lane, ready for the click).**
  - Its paths are `frontends/shell/MANUAL-WALKTHROUGH.md` Parts G and N, its form, and PLAN.yaml with the generated files (`frontends/shell/WALKTHROUGH-CURRENT-VIEW-ROWS-G1-N5-PREREGISTRATION.md:153-158` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:e007af93d7e8ba283a0581acadc65406bba173d2efc314778c3859d8de04fd05).
  - The only shared path is PLAN.yaml, through the custodian's rows.
  - The docs lane runs one piece at a time (`state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:18` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:0f9a0997c4f6065317872b3bee8d7fb69ddae9c598fa2a263904be2017138607). This node depends on #239's node, so the ADR edit starts after #239 merges.
  - This form's own commit touches no path of #239.
- **The redaction scan** (`bundle-redaction-scan-not-in-product-publish`, in progress, stopped at O0).
  - Its paths are at `kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:359-368` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:d66525520870af195f4a7fcc44e2f074a6258ad69e1517cc4082e845e0a22f79: `kernel/src/bundle/redaction.rs`, `kernel/src/publish/`, `kernel/src/permission/` and `audit/reader.rs`, two kernel tests, `engine/src/fixture.rs`, `publish.rs`'s `mod tests`, one KNOWN-LIMITATIONS item, `kernel/README.md`, `engine/README.md` and its form.
  - Disjoint: nothing under `docs/`.
  - Its new KNOWN-LIMITATIONS item takes the next free number, so items 19 to 28, which B1 names, keep their numbers.
- **Piece 1c** (`state/consults/2026-10-21-b2-piece-1c-save-and-reopen-architect-revised-form.md:563-622` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:6afe381a12c5c78f9d7a39e83fd27bffc4d64224546a6e91cb4ecc6341b72bc2).
  - It shares ADR-036 with step 1, in sequence by dependency: this block, then the acceptance, then step 1.
  - 1c regenerates nothing in `docs/README.md`.
  - This block does not touch ADR-022.
- **The governance lane** (`verify-quotes-round-item-cites`, drafted, `state/consults/2026-10-21-verify-quotes-round-item-cites-architect-draft.md:308-316` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:6199952f10930db7b54e58bcb462496f1171d465a183bc416cef54c3ec220fb7).
  - Its paths are `scripts/plan/rulingSet.mjs`, `scripts/plan/verify-quotes.mjs` and `scripts/plan/verify-test-claims.mjs` with their tests, `scripts/plan/README.md` and `.github/workflows/governance-ci.yml`. They are disjoint.
  - Once it lands, round + item cites under `docs/adr/` must resolve. The block's new ADR text carries none: its cites are "ruling N", "piece 1c's OPEN-N" and "milestone 4's OPEN-4 (A′)", none in the `round N, item M` form.
  - This form's only round + item cite is round 25, item 2.
- **Governance D:** done. Its node is `done` in PLAN.yaml at 2879e17f.
- **Milestone 4 (`b1-shell-half`):** its paths (`state/consults/2026-10-21-b1-shell-half-milestone-4-architect-draft.md:328-350` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:b5a56c9ed7b74462728422def3c62242dc984f2c100dc21f75389430fc1993b9) are disjoint.
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
- **An overrun is class 8** (`docs/PREREGISTRATION-TEMPLATE.md:169` @ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:8c7ea33dc2f3661d0f6f93e9e0fe89c4d1f2f523ff73b759105cfce86d511716), and this section is never edited.

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

### Amendment 1 — committed: the human's rulings applied by the architect; the checks; the pins; a question for the human; S1 after PR #239 (class 1)

*Written by the custodian before any edit of ADR-036. References only: `state/directives/2026-10-21-adr-036-block-ruled-open-a-c-b1-words-open-w-sentence-adr-022-amendment-2-steps-file.md`, lines 8 to 12; the architect's report, `state/consults/2026-10-21-adr-036-pre-acceptance-block-architect-form.md`; its draft, `state/consults/2026-10-21-adr-036-pre-acceptance-block-architect-draft.md`.*

1. **The rulings:** OPEN-A (c); OPEN-L, OPEN-R, OPEN-D, OPEN-S and OPEN-O (a); OPEN-W (a). OPEN-O (a)'s condition is not met, since the walkthrough rows had started, so this piece follows PR #239. The human's two passages (§2.3) were checked by script against the directive's lines 10 and 12 at 2879e17f1f4ece340473efa53b69f16bd0b91745. Each is byte-identical, and each stands in B1's and A6's new text where §2.3 places it.
2. **The passages as they stand:** all 14 were checked by script against ADR-036 at that commit, and each matches byte for byte. So do the insertion anchors: A0's line, A2's line 27, and B5's lines 68 and 201.
3. **The pins:** each of the 51 `<path>:<lines> @ 2879e17f` cites outside a fenced block was pinned by script, with the full commit id and the sha256 of its lines. Eight bare cites were expanded to their files, each read from the sentence it sits in:
   - the route directive's lines 16, 17, 18 and 20;
   - `kernel/src/dataset_ref.rs` lines 468 to 474;
   - ADR-036's lines 27, 68 and 201;
   - the block's rulings' line 12;
   - piece 1c's revised form's line 444.

   Text inside fenced blocks is text to be written, and is left as it is. §0.6's sentence about the pins, and its `docs/README.md` line, which is re-read at B, are left as written.
4. **The reserved-name list** (§0.3) was checked by the custodian, through a web-fetch agent's reading of the page it names. The ruled list is a superset of the page's.
5. **A question for the human** (§0.5): B1's sentence cites KNOWN-LIMITATIONS items 19 to 28, and items 20 to 22 describe other limits. The words stand as the human wrote them. If the human changes them, the change is recorded in a later amendment before S1.
6. **The architect's own words for the gate:** C1 (line 78) and C2 (line 82), §2.4.
7. **Budget and next:** 60 minutes (§7), set in PLAN.yaml with this commit. S1 comes after PR #239 merges, at its own base B, by a worker; then both gates.

Nothing above is edited.

### Amendment 2 — gate 1: the architect FAIL on C-1, the reviewer PASS WITH NOTES; correction round 1, C3 added (class 9), and two record corrections; written after both gate reports were seen

*Written by the custodian. References only: `state/consults/gates/2026-10-21-adr-036-pre-acceptance-block-gate1-architect.md` (gate-log 576) and `state/consults/gates/2026-10-21-adr-036-pre-acceptance-block-gate1-reviewer.md` (gate-log 577).*

1. **Gate 1** at 70edd381ac6a1bf62d57de49b39dfa1ad95bac05. The architect FAILs on C-1, a Correctness finding: A4's last clause still says containment keeps a path inside the project folder, which the human's B1 sentence no longer supports. The reviewer PASSes WITH NOTES. It has no Correctness or Evidence finding; V1 rebuilt by its own script byte for byte; the 61 pins recomputed, none failing; every check and CI green.
2. **C3 (class 9), in the architect's words for the gate, joins §2.4.** In A4's new line, the span
   ```
   Canonical form is checked on the text alone and does not by itself keep a path inside the project folder: containment, below, does;
   ```
   becomes
   ```
   Canonical form is checked on the text alone and does not by itself show that a path leads inside the project folder: containment, below, checks that when the data is opened;
   ```
   The rest of the line is unchanged. These are red-line ADR words, the architect's and not the human's, and the human sees them at the click. §7's count becomes 64, under 90.
3. **Corrections to this form's record, in the gates' words** (neither is the human's):
   - (a) the architect's D-1: §2.1 A3's first Checked-against item overstates the subset: it escapes every code point below U+0020 (`renderer/src/canonical.rs:28-30` @ 46158863299b14f49e581de9e6662b3fe3b0afba sha256:60248654b02ba325163dc0b1d4c9cbc49d2981de5cd7ae11faec484a5d2d0f72), not U+007F to U+009F. The conclusion stands, since U+000A is among those it escapes.
   - (b) the reviewer's D2: Amendment 1 item 3's count is corrected: the form carries 61 pins of the form `@ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:<hex>`, 11 in the header and 50 in §0 to §9, each recomputed at gate 1 of PR #240 with none failing.
4. **For the human, with no replacement words:**
   - the architect's H-1: the cited range "items 19 to 28" takes in items 20 to 22, which describe other limits. It is not blocking, and it is the human's own words;
   - the architect's H-2 and the reviewer's D1: A0 says "The last sentence of §5's containment rule" for a passage of two sentences; and A0's added cite and attribution sentence, and A6's rewritten clause of the architect's own, came after the draft the human ruled on.
5. **Next:** the worker applies C3 by script on the branch and reruns V1 with it. Then a scoped re-gate: the architect on C3, and the reviewer on V1 and the diff.

Nothing above is edited.

### Amendment 3 — correction round 1 built; the scoped re-gate, both PASS WITH NOTES; the count corrected (class 1); written after both reports were seen

*Written by the custodian. References only: `state/consults/2026-10-21-adr-036-pre-acceptance-block-round-1-worker-report.md`; `state/consults/gates/2026-10-21-adr-036-pre-acceptance-block-gate2-architect.md` (gate-log 578); `state/consults/gates/2026-10-21-adr-036-pre-acceptance-block-gate2-reviewer.md` (gate-log 579).*

1. **Round 1** is d0c257d9f2ef18e6b7b60228fae7eedcdfd082c0, one commit on 70edd381ac6a1bf62d57de49b39dfa1ad95bac05. It changes one line of ADR-036, C3, as Amendment 2 item 2 gives it.
2. **The scoped re-gate:** both PASS WITH NOTES. The architect closes C-1 and finds no other containment or canonical-form guarantee in the new text. The reviewer finds the diff equal to Amendment 2's spans, V1 with C3 byte-equal by its own script, every check passing, and CI green at the head.
3. **The count, in the reviewer's words** (not the human's): Amendment 2 item 2's predicted count is corrected: `git diff --numstat ad921f552f25a138bf845368e2e9e1f726d73812...d0c257d9f2ef18e6b7b60228fae7eedcdfd082c0 -- docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md` gives 44 + 18 = 62, not 64, because C3 rewrites the line A4 already replaces and so adds no line against B. 62 is under the ceiling of 90.
4. **The PR body** names H as this round's head, as §7 requires.
5. **For the human, still open:** the order of this merge and the Status edit; items 19 to 28; and A0's attribution (Amendment 2 item 4). These go with the click.

Nothing above is edited.

### Amendment 4 — the human's answers: order (1), and round 2 with their two changes (class 5)

*Written by the custodian on the human's message. References only: `state/directives/2026-10-21-adr-036-order-1-b1-range-a0-two-sentences-redaction-viewer-hash-skip-adr-022-provenance-o0-file-verify-quotes-ruled.md`, items 1 to 3.*

1. **Order (1):** this PR merges first. Then the acceptance commit sets the Status line to `Accepted 2026-10-22` as the human typed it, and regenerates `docs/README.md`'s row.
2. **Round 2, the human's words, applied by script on the branch.** Each span occurs once at d0c257d9f2ef18e6b7b60228fae7eedcdfd082c0, and nothing else changes:
   - in B1's containment bullet, `KNOWN-LIMITATIONS items 19 to 28` becomes `KNOWN-LIMITATIONS items 19 and 23 to 28`;
   - in A0's provenance line, `The last sentence of §5's containment rule` becomes `The last two sentences of §5's containment rule`.
3. **Next:** V1 is rerun with both changes, the reviewer checks them once more, and then the PR is ready for the human's click.

Nothing above is edited.

### Amendment 5 — closing record: PR #240 merged; ADR-036 accepted; the node done (class 1)

*Written by the custodian after the merge. References and hashes only.*

1. **Merged** by the human: merge commit e8f110bb2dfd0233b7593ff31be95af02504c757, `%cI` 2026-10-21T21:44:48+02:00 (two parents: main c63a06968d9ed65b56670fa0a76ba4a2e0582a38 and the branch head b12a5402710e7bb4e85d0f7ef61806787c166bb8, Amendment 4's round 2).
2. **The change:** `git diff --numstat` from main to the merge gives 44 insertions and 18 deletions in `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md`, 62 lines against §7's ceiling of 90, and 1 and 1 in `docs/README.md`.
3. **Gates:** gate-log 576 to 580 (Amendments 2 to 4).
4. **The acceptance commit,** in Amendment 4 item 1's order: 7cf76f9f92dee75086d7da1e196a6eda6a6b84b2, on the merge. It changes one line of ADR-036, the Status line, to `Accepted 2026-10-22`, and one line of `docs/README.md`, its row, from `frontends/shell/scripts/adrIndex.mjs`.
5. **PLAN:** the node is done with `{pr: 240}`, in the commit that adds this amendment. The worktree is removed after it.

Nothing above is edited.
