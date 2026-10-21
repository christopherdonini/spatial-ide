# ADR-036 — B2's file formats: the project folder, the step record and the lasting dataset reference

**Status:** Accepted 2026-10-22
**Drafted by:** the architect, in piece 1a's form (`kernel/B2-1A-STEP-RECORD-AND-DATASET-REFERENCE-PREREGISTRATION.md`, §2.3).
**Amended:** in piece 1b's form (`kernel/B2-1B-RECORDING-PREREGISTRATION.md`, §2.7), before acceptance: findings 3, 5 and 6 of the human's rulings of 2026-10-09, the registered actions, the session-history store and its bound, §12, and, under the human's ruling of 2026-10-14 (OPEN-9), `dependencies.crs`'s definition and provenance, the coordinate epoch's reservation and the registry's rule for coordinate parameters.
**Amended:** in piece `adr-036-pre-acceptance-block`'s form (`kernel/ADR-036-PRE-ACCEPTANCE-BLOCK-PREREGISTRATION.md`, §2), before acceptance, by the human's route (i) (`state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md`) and the human's rulings on the block (`state/directives/2026-10-21-adr-036-block-ruled-open-a-c-b1-words-open-w-sentence-adr-022-amendment-2-steps-file.md`): the project file's name; canonical form (ruling 9); containment and the carrying rule (ruling 1, and piece 1c's OPEN-4 and OPEN-5); the copy-or-same question (ruling 8); the line-oriented layout; ruling 4's lineage members; the observation's integers bounded and the Snapshot column reserved (piece 1c's OPEN-14 and OPEN-15); the timing in the Status line and in §11; and milestone 4's OPEN-4 (A′), a match on `fillColor`. The last two sentences of §5's containment rule, and the clause after the semicolon in §11's `workspace` bullet, are the human's words.
**Related:** ADR-005; ADR-006; ADR-016 and its Amendment 1; ADR-017 §6 (named unknown states); docs/02 (Projects); docs/09; docs/11 (ResourceRef; stable feature IDs); docs/14 (open formats).

## Context

B2 persists the first files that later versions and other people read: a project file, a lineage file, and, on the machine, a session history. Each records what was done to a dataset, so each needs a reference to the data that outlives the session. Every handle today is session-scoped and may not be persisted (`protocol/skp/src/v0/handles.rs`, module header). The bundle format (ADR-017) already writes docs/11's ResourceRef with a named state for every unknown member. This ADR reuses that vocabulary and adds no second model.

## Decision

### 1. The project folder

A project is a folder, one project per folder:

```
<project folder>/
  project.spatial          the project file: one JSON document in §2's line-oriented layout
  .spatial/
    lineage.jsonl          the lineage: step records, JSON Lines
```

**The project file's name** is `project.spatial`, one fixed name (the human's ruling 2 of 2026-10-09). A web search found no common application that claims the `.spatial` extension (`state/consults/2026-10-21-spatial-extension-check-custodian.md`). File association and single instance are not decided here; they are a later piece's.

Nothing else in the folder belongs to the format. The session history, the per-project preferences and the machine's locations for a project's datasets live on the machine, behind the application-directory boundary, and are found by the project's identity (§4). None of them is ever in the folder.

**The project file's members,** in this order and no other: `format` and `version` (§3); `project`, the project's identity (§4); `datasets`, an array holding one dataset entry (§5); `lineage` (§8); and `workspace` (§11).

### 2. Encoding

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
- **Closed key sets:** a reader refuses an unknown key, a missing key and a duplicate key, naming the key's path, except inside §3's one opaque slot.
- **Unknown values:** an unknown or not-applicable value is a named state `{"state": <word>, "basis": <text>}` (ADR-017 §6's form). `null` appears only where this ADR declares it.
- **Large integers:** an integer that can exceed 2^53 − 1 is written as a decimal string, so every reader holds it exactly (ADR-016 §7's width rule).
- **Never written** to a project file or a steps file: an absolute filesystem path, a session handle, a session reference, a dataset-session generation, an OS user name, or a credential (docs/09 on redaction from lineage; ADR-016 Amendment 1 on the generation).
- **Bounded readers:** a reader bounds every member it reads, and refuses rather than truncates. A project file arrives from another person as often as from this machine.

### 3. Versions

- **Format and version:** the project file carries `format` `spatial-project`; a steps file's first line carries `format` `spatial-steps`. Both are at `version` 1. A reader refuses a version it does not implement, and a change of shape increments the version.
- **The action vocabulary (§6) has its own version,** `actions`, in a steps file's header. Each new action increments it. The only opaque slot is the `params` of an action this reader has not registered, in a file whose `actions` is greater than the reader's own. That step is validated outside its `params`, kept byte for byte when the file is written again, never merged (§6), and shown as recorded by a later version; it is never dropped (docs/01, principle 8). An action this reader has not registered, in a file whose `actions` is not greater than its own, is refused. Everything else needs a `version` increment.

### 4. Identities

| Thing | Form | Minted |
|---|---|---|
| Project | `spatial://project/` + 32 lowercase hex | at the first Save project; written in the project file; never derived from the folder's path |
| Dataset reference | `spatial://dataset/ref/` + 32 lowercase hex | when a dataset first enters a project |
| Step | `step_` + 32 lowercase hex | when the step is recorded |

- The dataset form cannot collide with a bundle's `spatial://dataset/<name>`, whose name refuses `/`.
- Each identity is 128 bits from the operating system's CSPRNG. Each authorises nothing, and none is a handle.
- **A project opened from a second folder.** When a project's identity opens from a folder this machine has not opened it from, the user is asked once whether it is a copy or the same project if the first folder still holds a project with this identity, or if the first folder cannot be reached. If the first folder is gone, or holds another project or none, the project has moved, and nothing is asked. A copy gets a new identity, always written to the newly opened folder, and keeps its lineage, and its data links become its own: re-linking the data in one never changes where the other finds its data. The same project is remembered for that folder, and the question is not asked again there. The question's wording is the human's at P6.

### 5. The lasting dataset reference

A dataset entry, in the project file and in a steps file's header, is `{"resource": <ResourceRef>, "observed": <observation>, "admission": <claims>}`.

**`resource`** is docs/11's ResourceRef. It has exactly the six members the bundle writes, in the bundle's order, and no seventh: `logical_uri`, `content_hash`, `source_revision`, `locators`, `cache_status`, `portability_policy`.

| Member | Linked to a live file | Snapshot (stage 3) |
|---|---|---|
| `content_hash` | the state `not-taken` | `sha256:<hex>` of the sealed copy |
| `source_revision` | the state `none-pinned` | the state `none-pinned` |
| `cache_status` | `linked` | `snapshot` |
| `portability_policy` | `linked-live-file` | `snapshot-sealed` |

The Snapshot column is reserved and is not part of version 1: a version-1 reader refuses a `content_hash` that is not the state `not-taken`, a `cache_status` other than `linked` and a `portability_policy` other than `linked-live-file`. A snapshot reference comes with stage 3, and with a `version` step (§3).

`locators` holds one or more `{"kind", "at"}` objects:
- `project-relative`: `at` is a path relative to the project folder, `/`-separated and in canonical form. Canonical form is not empty, does not begin with `/`, has no empty, `.` or `..` segment, and holds no `\`, no `:` and no control character (U+0000 to U+001F and U+007F to U+009F). No segment ends in a dot or a space, and no segment is a reserved device name: the part of the segment before its first `.`, with trailing spaces removed, is none of `CON`, `PRN`, `AUX`, `NUL`, `CONIN$`, `CONOUT$`, `COM0` to `COM9`, `COM¹`, `COM²`, `COM³`, `LPT0` to `LPT9`, `LPT¹`, `LPT²` and `LPT³`, compared without regard to ASCII case. A reader refuses an `at` outside canonical form. Canonical form fixes how a path is written, not which file it names: on a file system that ignores case or normalises Unicode, two texts in canonical form can name one file. Canonical form is checked on the text alone and does not by itself show that a path leads inside the project folder: containment, below, checks that when the data is opened;
- `machine-recorded`: `at` is the reference's own logical URI, which the machine's location store resolves.

Locators are built and resolved in the kernel only. No frontend builds or parses one.

**Which locators a project file carries.** A dataset entry in a project file always carries a `machine-recorded` locator. It also carries a `project-relative` locator, in canonical form, when the data is inside the project folder, is reached from it without a link (containment, below), and its path has a canonical form, each judged when the project is saved. Data inside the folder whose path has no canonical form on this machine carries the `machine-recorded` locator only, and the save is not refused. An entry never carries an absolute path (§2). This rule binds the writer; a reader reads the locators an entry holds.

**Containment.** A `project-relative` locator is checked to lead inside the project folder, by two rules that are different things:
- **canonical form** (above), which a reader checks on the text, before anything is resolved;
- **containment,** which the resolver that opens the data checks before it opens it, on every platform. The resolver goes from the project folder through each segment of the target and refuses every symbolic link and junction it meets below the folder, whether it points inside or outside; it opens the target only if each segment exists, each but the last is a folder, and the last is a regular file. A refused target is not opened, and is refused by name: a link, a name the operating system resolves to a device (such as `NUL` on Windows), a name the operating system rewrites (such as a segment ending in a dot or a space on Windows), or a target that cannot be resolved. A file kept by a cloud-sync service is not a link, and the resolver must open it. The check is made when the data is opened. A link or a rename that another program makes afterwards is not prevented, at the open or at any later read; a change the detector or the advisory watch sees ends the session, as KNOWN-LIMITATIONS items 19 and 23 to 28 describe, and piece 1c's form declares the rest.

Piece 1c builds the writer and the resolver.

**`observed`** is the change-detection observation of the open that the reference was bound to: `byte_size`; `modified_ns` (a decimal string in minimal form, or the state `not-reported`); `footer_length`; `footer_sha256` (64 lowercase hex characters, or the state `not-read-over-ceiling`). Minimal form is digits only, with no sign and no leading zero unless the value is 0. A reader refuses any other spelling of either value, so each value has one spelling. `byte_size` and `footer_length` are integers no greater than 2^53 − 1, so §2's rule for large integers does not reach them: a writer refuses to bind a reference to a larger file, and a reader refuses a larger value.
- It is a change detector, not an identity. It is not a content hash, not a source revision and not a snapshot claim.
- A change it does not see is not a check that passed: a same-size, same-mtime data-page edit is not detected (`engine/src/descriptor.rs`, module header).
- It never raises the grade.

**`admission`** records the claims the open was admitted under, in the wire's own shape and without attribution: `crs_assertion` (`identifier`, `definition_json`) or `null`, and `identity` (`column`) or `null`.
- A reopen re-declares them, and the host mints attribution at that point.
- The claim is recorded rather than inferred again, because two declarations over the same bytes are two identity spaces (ADR-016, Consequences).

**Named states in an entry.** Each named state's word is one this section gives for its member, and a reader refuses any other word. Its basis is free text (§2): a reader accepts any basis that is not blank and is within its bound, and does not interpret it. A writer that writes the entry again writes its own basis for the same word, so an entry from another writer keeps its words and may change its basis texts.

**Grade (ADR-005).** A project linked to a live file is at most Reference-only; with a snapshot it is Snapshot. The observation does not make a linked file Revision-pinned.

### 6. The step record

A steps file is one header line, then step lines, withheld lines and mark lines.

**Header:** `{"format":"spatial-steps","version":1,"purpose":<"lineage"|"session-history"|"export-copy">,"project":<project URI, or the state not-yet-saved>,"actions":<int>,"datasets":[<dataset entry>…],"lineage":<§8's properties, or null>}`. `lineage` is non-null exactly when `purpose` is `lineage`.

**Step line:** `{"step":{…}}`, with these members in this order:

| Member | Holds |
|---|---|
| `id` | the step's id (§4) |
| `parent` | the id of the step it follows, or `null` for its file's first step. B2 keeps no branch, and the member stays. |
| `at` | UTC, RFC 3339, whole seconds; or, in a shared copy, the named state `withheld`, so that a sharing level can drop working times within version 1 |
| `kind` | `data`, `scope`, `style`, `snapshot` or `export` |
| `effect` | ADR-006's class: `{"class":"workspace-mutation"}`; `{"class":"external-side-effect","reversibility":<"reversible"\|"compensatable"\|"irreversible">}`; or `{"class":"pure-transformation"}` |
| `actor` | `{"kind":"user"}`, `{"kind":"ai","id":<text>}` or `{"kind":"plugin","id":<text>}`. A user is never named. |
| `intent` | `{"action":<registered name>,"params":{…}}`. A quantity with a unit is `{"value":<number>,"unit":<text>}`. |
| `dependencies` | `{"fields":[{"name","type"}…],"crs":{"identifier","provenance","definition"},"geometry_types":[…]}`; each of the three members may instead be a named state, on its own. `geometry_types` are the types the file declares, as written, never the engine's encoding; where the file has no `geometry_types` key it is the named state `not-declared`, and an empty declaration is kept empty. |
| `data` | `{"dataset":<reference URI>,"identity":{"content_hash":"sha256:<hex>"} or {"observed":<observation>}}`. Always through the reference: never a handle, never a locator. |
| `scope` | `{"kind":"layer"}`. A selection scope is reserved (§11, Reserved by name). |
| `links` | zero or more of `{"rel":"audit-record","ref":<attempt id>,"held":"machine"}` and `{"rel":"snapshot","ref":"sha256:<hex>"}` |

**`dependencies.crs`** names the coordinate space of the dataset the step was recorded on, as the engine admitted it at that open:
- `identifier` is the identifier the engine admitted. It is a label only: an equal identifier never shows that two steps share a space, and every definition with no authority and code carries the same label, `(definition-only)`.
- `definition` is `sha256:` and 64 lowercase hex characters, over the UTF-8 bytes of the definition text the engine admitted, as `describe` reports it in `crs.definition_json`: the string's value, not its JSON spelling, with nothing normalized. For a file's own declaration that text is the engine's serialization of the file's `crs` object, not the file's bytes; for a caller's assertion it is the text the caller sent. Equal hashes show the same definition text. Unequal hashes decide nothing: one definition written two ways hashes two ways, and a later version may serialize the same file's declaration differently.
- Where the engine admitted no definition, as under the format's rule for an absent `crs` key, `definition` is the named state `none-admitted` (§2).
- The text is hashed as held, not rewritten in §2's canonical subset: that subset writes keys in a schema's declared order and refuses numbers outside its domain, and a definition has keys no schema here declares and numbers nothing bounds.
- `provenance` is the provenance class `describe` reports as `crs.provenance`, one of three words: `crs:declared`, the file's own `crs` member; `crs:asserted`, a caller's assertion over a file that declares none; `crs:format-default`, the format's rule for an absent `crs` key. A reader refuses any other word. A step recorded on a format-default admission therefore says so.

**Withheld line:** `{"withheld":{"id":<id>,"parent":<id or null>}}` stands in for a step the sharer withheld. It keeps the chain and the count, and carries nothing else.

**Mark lines,** in the session history only: `{"mark":{"kind":"saved-here","after":<id>,"at":<time>}}` and `{"mark":{"kind":"restored","to":<id>,"at":<time>}}`.

**Kinds:**
- `data` changes which data a layer draws, or which rows pass (a filter);
- `scope` changes the resolved scope that later actions apply to;
- `style` changes presentation;
- `snapshot` binds the project to a sealed copy, an anchor;
- `export` writes outside the project.

A selection alone is not a step.

**The action registry.** Each action declares its name, the closed shape of its parameters with units, its `kind`, its effect class, its collapse key, and whether it takes the wide collapse. The collapse key is (action, property, target): the action, the property it sets, and what it sets it on; in B2 the target is the project's one layer. A parameter that holds coordinates names the space they are in, in `dependencies.crs`'s form (§6), within its own declared shape; an action with a coordinate parameter that names no space is not registered. No action registered here has one: a filter's predicate may reference attribute columns only, never the geometry column. Compaction (§8) follows these rules, and the session history (§9) keeps every step:
- An action that only sets a property may declare the wide collapse: within one stretch between saves, repeated edits of one key leave the last, even with other steps between them.
- An action that does not declare it merges only with its neighbour, an adjacent step with the same key.
- A run that returns to its starting value disappears.
- Nothing merges or disappears across a saved-here mark, or across an export, which depends on every key.
- An unknown action is never merged.

**Registered actions.** `actions` counts the actions registered; a reader knows every action up to its own value.

| `actions` | Action | `kind` | Effect | `params` | Collapse key | Wide collapse |
|---|---|---|---|---|---|---|
| 1 | `filter.apply` | `data` | workspace mutation | `{"filter":{"predicate":<text>,"dialect":"duckdb-expr/0"}}` or `{"filter":null}`; the predicate is admitted as `viewport_query` admits it | (`filter.apply`, `filter`, the layer) | yes |
| 2 | `style.set` | `style` | workspace mutation | `{"property":<"fillColor"\|"fillOpacity"\|"outlineColor"\|"outlineWidth">,"value":<value>}`; a colour is `#rrggbb` in lowercase, an opacity a number from 0 to 1, a width `{"value":<number>,"unit":"px"}`; for `fillColor` only, the value may instead be ADR-017 §5a's match, `{"match":{"column":<text>,"cases":[{"when":<text>,"then":<colour>}…],"on_null":<colour>,"on_unmatched":<colour>}}`, whose column is a column of the open dataset that §5a's match admits; each value is one ADR-017 §5a admits | (`style.set`, the `property`, the layer) | yes |

A `filter.apply` step's `dependencies` name the predicate's fields with their types. A `style.set` step whose value is a match names the match column with its type; any other `style.set` step names none.

### 7. Names against ADR-006

| The user sees | ADR-006 class | Machinery |
|---|---|---|
| filter, scope and style steps | workspace mutations | the kernel's command and event log |
| export steps | external side effects | the audit log, linked from the step |
| processing steps (none exist yet) | pure transformations | the lineage DAG |

- No code or record calls a steps file a lineage DAG.
- Replay stays reserved for pure transformations.
- A restore is a restore of workspace state. It never runs an export again, and never undoes one.

### 8. The lineage file

- **What it holds:** every contributing step of the project as saved, in parent order.
- **How it is written:** whole, at each Save project, by writing a new file in the folder and renaming it over the old one. The lineage file is replaced first, and the project file after it.
- **What the project file records of it:** the project file's `lineage` member is `{"sha256":<"sha256:" and 64 lowercase hex characters>,"steps":<int>}`, the sha256 over the lineage file's bytes as written and the number of its step and withheld lines; or, where the project keeps no lineage file, the named state `not-kept` (§2). A reader never reads a lineage file whose bytes or count differ from the member as the project's lineage without saying so. Piece 1c's amendment to this ADR states how a reader tells which save each file is from, and what it shows then.
- **Its properties:**
  - `completeness` is `{"state":"complete"}` or `{"state":"incomplete","withheld":<int>,"kinds_not_recorded":[<kind>…]}`;
  - `starts` is `{"state":"at-first-save"}` or `{"state":"later","basis":<text>}`.
- **The recipe-incomplete marker** of the human's evening ruling of 2026-10-07 is carried by these properties. They do not change the grade: ADR-005 grades the inputs. The marker's words are the human's.
- **A damaged file:** a torn or unparsable lineage file is refused by name, never cut back to its last good line.

### 9. The session history

- **Format:** the same, with `purpose` `session-history`, appended as the user works.
- **After a crash:** recovery keeps the longest valid prefix: the lines, from the header on, that end in LF, hold no NUL, parse under §2 and §3, and chain. A step chains when its `parent` is the id of the last step before it or, if a `restored` mark comes after that step, the `to` of the last such mark; the first step's `parent` is `null`. A `saved-here` mark chains when its `after` is the id of the last step before it; a `restored` mark chains when its `to` is the id of a step before it. The first failing line is named, with the rule it fails, and nothing after it is recovered. No line carries a check member of its own.
- **A session that never saved:** its history is kept on the machine under a not-yet-saved record, and recovery is offered when the application next starts. The offer names the dataset and the time, and declining clears the record. If the data has changed or cannot be found, the application says so. A normal session end clears the record, as it clears any session history.
- **Where it is stored:** on the machine, under the application's per-user data directory, never in a project folder: `spatial-ide/sessions/<record>/history.jsonl`. `<record>` is the project identity's 32 hex characters for a saved project, or `unsaved-` and 32 lowercase hex characters from the operating system's CSPRNG for a session that has not saved; a record name authorises nothing. Beside the history, `locations.json` is one canonical JSON document, `{"format":"spatial-locations","version":1,"entries":[{"dataset":<reference URI>,"path":<absolute path>}…]}`: where this machine found each dataset the history names. It is the only file this ADR defines that holds an absolute path, and nothing in it is copied into a project file or a steps file (§2). While its session lives, the application holds the history under an exclusive lock.
- **How large it may grow:** a step line at most 262,144 bytes, the header line at most 1,048,576 bytes, and the whole history at most 33,554,432 bytes. A step that would pass a bound is refused by name and not written. After a write fails, the history takes no later step, and each later step is refused by name.
- **When it is cleared:** a normal end of the application clears every history its run created. A crash, or an end forced from outside, is not a normal end and leaves the history for the recovery offer.

### 10. An export's copy of its steps

The same format, with `purpose` `export-copy`. Where the copy is stored is piece 2's.

### 11. What this ADR does not decide

- **The project file's `workspace` member** (the filters as applied, the style document, the map view, the analysis settings). It is a member of version 1, reserved by name: piece 1c defines its shape in an amendment to this ADR, appended after acceptance and landing no later than 1c's writer; no version-1 project file exists before piece 1c's writer, so 1c's amendment defining workspace completes version 1 and is not a version step.
- **Work left to later pieces:**
  - how a reader tells which save a project file and a lineage file are from, and what it shows then (1c, §8);
  - the export copy's storage (2);
  - the snapshot store, its retention and coherent acquisition (3a);
  - the sharing and tracking defaults, and the marker's wording (5).
- **Persisted feature ids.** ADR-016's OPEN on stability across reopen stands, and no step writes a feature id until it is settled.
- **Reserved by name, not yet defined:**
  - **a selection scope** (§6, `scope`);
  - **the coordinate epoch:** when a dataset's coordinates were observed, for a CRS whose coordinates change over time. It is a dataset fact that a later version may record as one value, as a named column holding a time per row, or as not stated. Version 1 records it nowhere, and a version-1 file's silence is not a statement that it is not stated. Adding it changes the shape, so it comes with a `version` step (§3), and a version-1 reader refuses the later file.
  - **the Snapshot column** of §5's table (stage 3).
- **Out of B2 altogether:** projects with several datasets; workflows, notebooks and replay (Alpha); branches (Beta).

### 12. How a step reaches the record

A step is recorded by the kernel, through one SKP command, `record_step` (`protocol/skp/SKP-V0.md` §10). A client sends one registered action and its parameters for one open dataset, after the change is committed. The kernel checks the action against the registry (a filter is admitted as `viewport_query` admits it), refuses a dataset whose session has ended, mints the step's id, takes its `at`, its `actor` from the client it serves and its `effect` from the registry, appends one line, and asks the operating system to flush it to storage before it replies. No client supplies an id, a time, an actor or an effect class. The kernel holds no workspace state and applies nothing: the client applies the change. The reply carries nothing but its success.

## Consequences

- **One vocabulary for resources:** a bundle and a project file read the same six members.
- **No absolute path in a project file.** On another machine, a dataset outside the project folder is found by re-linking it, and the re-linked file is checked against `observed`: the check names each component that differs, and no difference passes silently.
- **Different mtime resolution across filesystems:** a copy between them can report `mtime` changed. This fails closed, never as a silent pass.
- **Open format (docs/14):** the format is fully specified here and readable without linking the kernel.
