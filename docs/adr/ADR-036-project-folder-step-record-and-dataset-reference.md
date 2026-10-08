# ADR-036 — B2's file formats: the project folder, the step record and the lasting dataset reference

**Status:** Proposed. **It binds nothing until the human accepts it.** Acceptance is due before piece 1c (`b2-piece-1c-save-and-reopen`) merges, the first piece that writes a file that a later version or another person reads. It is not architect-blockable until accepted.
**Drafted by:** the architect, in piece 1a's form (`kernel/B2-1A-STEP-RECORD-AND-DATASET-REFERENCE-PREREGISTRATION.md`, §2.3).
**Related:** ADR-005; ADR-006; ADR-016 and its Amendment 1; ADR-017 §6 (named unknown states); docs/02 (Projects); docs/09; docs/11 (ResourceRef; stable feature IDs); docs/14 (open formats).

## Context

B2 persists the first files that later versions and other people read: a project file, a lineage file, and, on the machine, a session history. Each records what was done to a dataset, so each needs a reference to the data that outlives the session. Every handle today is session-scoped and may not be persisted (`protocol/skp/src/v0/handles.rs`, module header). The bundle format (ADR-017) already writes docs/11's ResourceRef with a named state for every unknown member. This ADR reuses that vocabulary and adds no second model.

## Decision

### 1. The project folder

A project is a folder, one project per folder:

```
<project folder>/
  <project file>           the project file: one canonical JSON document
  .spatial/
    lineage.jsonl          the lineage: step records, JSON Lines
```

> **OPEN, until the human accepts this ADR: the project file's name and extension.** The draft named it `project.spatial.json`. A file ending in `.json` cannot open the application by double-click, so the name and the extension are settled at acceptance.

Nothing else in the folder belongs to the format. The session history, the per-project preferences and the machine's locations for a project's datasets live on the machine, behind the application-directory boundary, and are found by the project's identity (§4). None of them is ever in the folder.

### 2. Encoding

- **Encoding:** UTF-8 without BOM, with LF line ends, in the canonical JSON subset of `spatial_renderer::canonical`, the one number grammar this repository writes.
  - The project file is one document followed by one LF.
  - A steps file is one document per line, each followed by LF.
- **Closed key sets:** a reader refuses an unknown key, a missing key and a duplicate key, naming the key's path.
- **Unknown values:** an unknown or not-applicable value is a named state `{"state": <word>, "basis": <text>}` (ADR-017 §6's form). `null` appears only where this ADR declares it.
- **Large integers:** an integer that can exceed 2^53 − 1 is written as a decimal string, so every reader holds it exactly (ADR-016 §7's width rule).
- **Never written** to a project file or a steps file: an absolute filesystem path, a session handle, a session reference, a dataset-session generation, an OS user name, or a credential (docs/09 on redaction from lineage; ADR-016 Amendment 1 on the generation).
- **Bounded readers:** a reader bounds every member it reads, and refuses rather than truncates. A project file arrives from another person as often as from this machine.

### 3. Versions

- **Format and version:** the project file carries `format` `spatial-project`; a steps file's first line carries `format` `spatial-steps`. Both are at `version` 1. A reader refuses a version it does not implement, and a change of shape increments the version.
- **The action vocabulary (§6) has its own version,** `actions`, in a steps file's header. Each new action increments it. A reader that meets an action from a later vocabulary shows the step as recorded by a later version, and never drops it (docs/01, principle 8).

### 4. Identities

| Thing | Form | Minted |
|---|---|---|
| Project | `spatial://project/` + 32 lowercase hex | at the first Save project; written in the project file; never derived from the folder's path |
| Dataset reference | `spatial://dataset/ref/` + 32 lowercase hex | when a dataset first enters a project |
| Step | `step_` + 32 lowercase hex | when the step is recorded |

- The dataset form cannot collide with a bundle's `spatial://dataset/<name>`, whose name refuses `/`.
- Each identity is 128 bits from the operating system's CSPRNG. Each authorises nothing, and none is a handle.
- **A project opened from a second folder.** When a project's identity opens from a second folder while the first folder still exists, the user is asked once whether it is a copy or the same project. A copy gets a new identity and keeps its lineage, and its data links become its own: re-linking the data in one never changes where the other finds its data. The same project is remembered for that folder, and the question is not asked again there. If the first folder no longer exists, the project has moved, and nothing is asked. The question's wording is the human's at P6.

### 5. The lasting dataset reference

A dataset entry, in the project file and in a steps file's header, is `{"resource": <ResourceRef>, "observed": <observation>, "admission": <claims>}`.

**`resource`** is docs/11's ResourceRef. It has exactly the six members the bundle writes, in the bundle's order, and no seventh: `logical_uri`, `content_hash`, `source_revision`, `locators`, `cache_status`, `portability_policy`.

| Member | Linked to a live file | Snapshot (stage 3) |
|---|---|---|
| `content_hash` | the state `not-taken` | `sha256:<hex>` of the sealed copy |
| `source_revision` | the state `none-pinned` | the state `none-pinned` |
| `cache_status` | `linked` | `snapshot` |
| `portability_policy` | `linked-live-file` | `snapshot-sealed` |

`locators` holds one or more `{"kind", "at"}` objects:
- `project-relative`: `at` is a path relative to the project folder, `/`-separated, written only where the data is inside the project folder. It never points outside the project folder: a reader refuses an `at` that is empty, begins with `/`, has an empty, `.` or `..` segment, or holds a `\` or a `:`;
- `machine-recorded`: `at` is the reference's own logical URI, which the machine's location store resolves.

Locators are built and resolved in the kernel only. No frontend builds or parses one.

**`observed`** is the change-detection observation of the open that the reference was bound to: `byte_size`; `modified_ns` (a decimal string, or the state `not-reported`); `footer_length`; `footer_sha256` (hex, or the state `not-read-over-ceiling`).
- It is a change detector, not an identity. It is not a content hash, not a source revision and not a snapshot claim.
- A change it does not see is not a check that passed: a same-size, same-mtime data-page edit is not detected (`engine/src/descriptor.rs`, module header).
- It never raises the grade.

**`admission`** records the claims the open was admitted under, in the wire's own shape and without attribution: `crs_assertion` (`identifier`, `definition_json`) or `null`, and `identity` (`column`) or `null`.
- A reopen re-declares them, and the host mints attribution at that point.
- The claim is recorded rather than inferred again, because two declarations over the same bytes are two identity spaces (ADR-016, Consequences).

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
| `dependencies` | `{"fields":[{"name","type"}…],"crs":{"identifier","source"},"geometry_types":[…], or a state}` |
| `data` | `{"dataset":<reference URI>,"identity":{"content_hash":"sha256:<hex>"} or {"observed":<observation>}}`. Always through the reference: never a handle, never a locator. |
| `scope` | `{"kind":"layer"}`. A selection scope is reserved (§11). |
| `links` | zero or more of `{"rel":"audit-record","ref":<attempt id>,"held":"machine"}` and `{"rel":"snapshot","ref":"sha256:<hex>"}` |

**Withheld line:** `{"withheld":{"id":<id>,"parent":<id or null>}}` stands in for a step the sharer withheld. It keeps the chain and the count, and carries nothing else.

**Mark lines,** in the session history only: `{"mark":{"kind":"saved-here","after":<id>,"at":<time>}}` and `{"mark":{"kind":"restored","to":<id>,"at":<time>}}`.

**Kinds:**
- `data` changes which data a layer draws, or which rows pass (a filter);
- `scope` changes the resolved scope that later actions apply to;
- `style` changes presentation;
- `snapshot` binds the project to a sealed copy, an anchor;
- `export` writes outside the project.

A selection alone is not a step.

**The action registry.** Each action declares its name, the closed shape of its parameters with units, its `kind`, its effect class, and its collapse key: the property it sets. Compaction uses the collapse key to keep the last of repeated edits and to collapse toggles. **This ADR registers no action.** Piece 1b registers the first ones and increments `actions` with each.

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
- **How it is written:** whole, at each Save project, by writing a new file in the folder and renaming it over the old one. Piece 1c's amendment to this ADR states how a reader detects a project file and a lineage file from different saves, and what it shows then.
- **Its properties:**
  - `completeness` is `{"state":"complete"}` or `{"state":"incomplete","withheld":<int>,"kinds_not_recorded":[<kind>…]}`;
  - `starts` is `{"state":"at-first-save"}` or `{"state":"later","basis":<text>}`.
- **The recipe-incomplete marker** of the human's evening ruling of 2026-10-07 is carried by these properties. They do not change the grade: ADR-005 grades the inputs. The marker's words are the human's.
- **A damaged file:** a torn or unparsable lineage file is refused by name, never cut back to its last good line.

### 9. The session history

- **Format:** the same, with `purpose` `session-history`, appended as the user works.
- **After a crash:** a final line without its LF is a torn write. Recovery keeps every complete line and names the torn one.
- **A session that never saved:** its history is kept on the machine under a not-yet-saved record, and recovery is offered when the application next starts. The offer names the dataset and the time, and declining clears the record. If the data has changed or cannot be found, the application says so. A normal session end clears the record, as it clears any session history.
- **Left to piece 1b:** where the history is stored, and how large it may grow.

### 10. An export's copy of its steps

The same format, with `purpose` `export-copy`. Where the copy is stored is piece 2's.

### 11. What this ADR does not decide

- **The project file's `workspace` member** (the filters as applied, the style document, the map view, the analysis settings). Piece 1c proposes it as an amendment to this ADR, accepted together with it.
- **Work left to later pieces:**
  - the actions (1b);
  - the session-history store and its bound (1b);
  - how a reader detects a project file and a lineage file from different saves, and what it shows then (1c, §8);
  - the export copy's storage (2);
  - the snapshot store, its retention and coherent acquisition (3a);
  - the sharing and tracking defaults, and the marker's wording (5).
- **Persisted feature ids.** ADR-016's OPEN on stability across reopen stands, and no step writes a feature id until it is settled.
- **Out of B2 altogether:** projects with several datasets; workflows, notebooks and replay (Alpha); branches (Beta).

## Consequences

- **One vocabulary for resources:** a bundle and a project file read the same six members.
- **No absolute path in a project file.** On another machine, a dataset outside the project folder is found by re-linking it, and the re-linked file is checked against `observed`: the check names each component that differs, and no difference passes silently.
- **Different mtime resolution across filesystems:** a copy between them can report `mtime` changed. This fails closed, never as a silent pass.
- **Open format (docs/14):** the format is fully specified here and readable without linking the kernel.
