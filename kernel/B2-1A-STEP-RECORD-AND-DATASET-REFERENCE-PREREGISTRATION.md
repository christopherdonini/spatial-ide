# B2 piece 1a — the step record, the format ADR (Proposed) and the lasting dataset reference — preregistration (full form)

- **Authority:** PLAN node `b2-piece-1a-step-record-and-dataset-reference`. The human's rulings of the evening of 2026-10-07 (`state/directives/2026-10-07-b2-brief-and-evening-rulings.md`; its RULED block in `DECISIONS-PENDING.md`, headed RULED 2026-10-07 (evening)). The brief `state/directives/B2-BRIEF-2026-10-07.md`, §5, §8, §9, §10. Drafting: question round 43, item 2.
- **Drafted by** the architect agent alone (the lead-data pilot is paused: the 2026-10-05 product-first direction, section 1), from the brief, the evening rulings, the migration plan (outside its §10), the O-07 walkthrough's decisions, ADR-005, ADR-006, ADR-016, ADR-019, docs/02, docs/09, docs/11 and the code below, all read at main aa00e565.
- **Committed before any code.** Append-only once committed. An amendment made after any outcome has been seen says so in its first line, and states what it touches or invalidates.
- **Form and gating:** the full form, with full gating from dispatch (AUTONOMY §21a: an ADR filing and stated guarantees; size over §21c; §25(e)).
- **Path to this file:** `kernel/B2-1A-STEP-RECORD-AND-DATASET-REFERENCE-PREREGISTRATION.md`.

## §0. Disclosure

- **No pilot, spike, consult or corpus informed this form.** Nothing is measured. The 5 GB fixture is not used, so there is no drive confound.
- **Every code claim is pinned** at aa00e565. Every hash was computed by the custodian at aa00e565 when this form was committed. The worker re-derives every cite it touches.
- **The brief is the main architect's text, adopted by the human** as the brief for B2's forms. Where this form departs from a sentence of the brief, it names the sentence by section and raises it as an OPEN item (OPEN-4). It never departs silently.
- **Hypothesis H1:** a lasting reference can be built from an open dataset's existing accessors alone, with no new read. Discriminator: tests K2 and K5.

## §1. What this preregistration may and may not claim

**May claim:**
- the step record's fields and file format, as a design;
- ADR-036, Proposed, which binds nothing until the human accepts it;
- the lasting dataset reference's code: a format and a comparison, with no file I/O.

**May not claim:**
- any step recorded, any file written, or any project saved (pieces 1b and 1c);
- any performance number, docs/08 row or duration;
- any wire change: SKP and MCP are untouched;
- a snapshot-consistency claim of any kind;
- a grade above Reference-only for a linked file;
- any persisted feature id;
- any operator string (1a has no user-visible surface).

**Cited:** ADR-005, ADR-006, ADR-016 and its Amendment 1, ADR-017 §6. ADR-019 is Proposed, cited for context only, and binds nothing. **No ADR is amended here.**

## §2. The change

### 2.1 The step record (design only; 1a writes no step code)

The fields, the line kinds and the action-registry rule are ADR-036's Decision §6 (§2.3 below). The rules that bind 1b's code:
- 1b registers the first actions against the shell's typed transitions as they exist when 1b is formed, never against an imagined shape (the human's seam rule).
- Neither 1b nor 1c changes a field or ADR-036 without the human's word (the brief, §9).

### 2.2 The project folder and encoding

ADR-036 Decision §1 to §3, §8 and §9.

### 2.3 ADR-036, proposed text

The worker copies the text between the two markers below by script into `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md`, byte for byte. Before the copy, each OPEN-n the human has ruled is folded in, recorded as this form's class-5 amendment. An OPEN-n not yet ruled at filing stays in the file as an OPEN block, to be settled at acceptance.

<!-- ADR-036 BEGIN -->
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
  project.spatial.json     the project file: one canonical JSON document
  .spatial/
    lineage.jsonl          the lineage: step records, JSON Lines
```

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
- `project-relative`: `at` is a path relative to the project folder, `/`-separated;
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
| `at` | UTC, RFC 3339, whole seconds |
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
- **How it is written:** whole, at each Save project, by writing a new file in the folder and renaming it over the old one. It therefore always matches the project file written in the same save.
- **Its properties:**
  - `completeness` is `{"state":"complete"}` or `{"state":"incomplete","withheld":<int>,"kinds_not_recorded":[<kind>…]}`;
  - `starts` is `{"state":"at-first-save"}` or `{"state":"later","basis":<text>}`.
- **The recipe-incomplete marker** of the human's evening ruling of 2026-10-07 is carried by these properties. They do not change the grade: ADR-005 grades the inputs. The marker's words are the human's.
- **A damaged file:** a torn or unparsable lineage file is refused by name, never cut back to its last good line.

### 9. The session history

- **Format:** the same, with `purpose` `session-history`, appended as the user works.
- **After a crash:** a final line without its LF is a torn write. Recovery keeps every complete line and names the torn one.
- **Left to piece 1b:** where the history is stored, and how large it may grow.

### 10. An export's copy of its steps

The same format, with `purpose` `export-copy`. Where the copy is stored is piece 2's.

### 11. What this ADR does not decide

- **The project file's `workspace` member** (the filters as applied, the style document, the map view, the analysis settings). Piece 1c proposes it as an amendment to this ADR, accepted together with it.
- **Work left to later pieces:**
  - the actions (1b);
  - the session-history store and its bound (1b);
  - the export copy's storage (2);
  - the snapshot store, its retention and coherent acquisition (3a);
  - the sharing and tracking defaults, and the marker's wording (5).
- **Persisted feature ids.** ADR-016's OPEN on stability across reopen stands, and no step writes a feature id until it is settled.
- **Out of B2 altogether:** projects with several datasets; workflows, notebooks and replay (Alpha); branches (Beta).

## Consequences

- **One vocabulary for resources:** a bundle and a project file read the same six members.
- **No absolute path in a project file.** On another machine, a dataset outside the project folder is found by re-linking it, and the re-linked file is checked against `observed`.
- **Different mtime resolution across filesystems:** a copy between them can report `mtime` changed. This fails closed, never as a silent pass.
- **Open format (docs/14):** the format is fully specified here and readable without linking the kernel.
<!-- ADR-036 END -->

### 2.4 The code: the lasting dataset reference

**E-1 — `engine/src/descriptor.rs`.** Add a recorded observation beside the live descriptor, under one comparison rule.
- **Today:** the descriptor's fields are private (`engine/src/descriptor.rs:58-83 @ aa00e565 sha256:d27920b221cf4b82cc93a009f49f6690bf1adeda8a34402b5b3bc5648d8c17c4`). Its comparison is one function (`engine/src/descriptor.rs:269-288 @ aa00e565 sha256:62ec4c6bfcbeec4949a9878c7a6c8b508d1c901b50dab5cfcaac7d1e0988f9c4`).
- **New:** a `pub struct SourceObservation`, with private fields byte size, modified nanos (`Option<u128>`), footer length and footer hash (`Option<String>`). Items:
  - `SourceDescriptor::observation(&self) -> SourceObservation`;
  - `SourceObservation::recorded(u64, Option<u128>, u64, Option<String>) -> Self`;
  - four read accessors;
  - `SourceObservation::components_differing_from(&self, now: &SourceDescriptor) -> Vec<&'static str>`.
- **One rule:** the existing comparison's body moves into one private function, which both public comparisons call. The existing function's outputs and every existing test stay unchanged.
- **No new read and no I/O.**
- **Not re-exported from `engine/src/lib.rs`:** it is reached as `spatial_engine::descriptor::SourceObservation`.

**K-1 — `kernel/src/dataset_ref.rs`, new,** with `pub mod dataset_ref;` in `kernel/src/lib.rs`. **DatasetUri:**
- the grammar of ADR-036 §4;
- `FromStr` and `as_str`;
- `mint()` only if OPEN-5 is ruled (A).

**DatasetRef** has private fields. Its items:
- `linked(uri, &spatial_engine::Dataset) -> Result<DatasetRef, RefBuildError>`;
- `uri()`, `locators()`, `admission()`;
- `to_json() -> spatial_renderer::canonical::Json`, which writes ADR-036 §5's entry;
- `parse(&serde_json::Value) -> Result<DatasetRef, RefParseError>`;
- `check(&self, &spatial_engine::Dataset) -> RefCheck`.

**How `linked` builds the reference** — only from the open's real accessors, with no new read:
- `Dataset::descriptor()` (`engine/src/dataset.rs:603-606 @ aa00e565 sha256:432ddfc8d5f9bc1684ef379e65634f48cf8e441d7a76f818c3e5cfcf0617cb51`);
- `Dataset::crs()` and its `source()`, `identifier()` and `definition_json()` (`engine/src/crs.rs:229-243 @ aa00e565 sha256:da5f713fac20bf1d4f9314f4ae04dc3cbf6a4b3809e9647e75d845ec86aaf682`);
- `Dataset::identity().source()` (`engine/src/identity.rs:33-41 @ aa00e565 sha256:13c70305bbb7ac49b06a3ef7c965a6c9c7e26d28fcf8ce8b767459acfeea37b2`).

`linked` writes locators `[machine-recorded]` only; `project-relative` is built by 1c. The basis texts are fixed constants.

**Admission** is `{ pub crs_assertion: Option<spatial_skp::v0::CrsAssertion>, pub identity: Option<spatial_skp::v0::IdentityDeclaration> }`. These are the consumer's own types: the two members of `OpenDatasetRequest` (`protocol/skp/src/v0/commands.rs:20-38 @ aa00e565 sha256:a6a747442e0be6b42bbbe3ff80b76753fead3c979479efd144f6047eef42df53`). A reopen therefore passes them unconverted.

**RefBuildError** has one variant, `AssertionWithoutDefinition`. The engine's assertion allows no definition (`engine/src/crs.rs:114-123 @ aa00e565 sha256:a3eaae1dd66c8d84e7dd409e5d028f8a74077563541e2ff7fb72c5a05c6325ab`), but the wire claim requires one. `linked` refuses such an assertion rather than recording an empty claim.

**Locator** is `ProjectRelative(String)` or `MachineRecorded`.

**RefCheck** is `NoChangeDetected`, or `Differs { observed: Vec<&'static str>, admission: Vec<&'static str> }`, where `admission` names `crs` and/or `identity`.
- `check` compares `observed` through E-1's rule, and `admission` against the reopened dataset's admitted CRS and identity source.
- It states facts only. What the shell does with a difference is 1c's, under the round-7 rule that owners state consequences.

**RefParseError** is a closed set: `UnknownMember{path}`, `MissingMember{path}`, `UnknownState{path,value}`, `OverCeiling{path,ceiling}`, `Malformed{path,detail}`.

**dataset_ref.rs does no I/O:** no `std::fs`, no `std::io`, no lease, no hash.

**K-2 — `kernel/tests/no_generation_in_persisted_artifacts.rs`.**
- **Header:** the doc header gains a fifth family, the dataset reference's canonical text, which has no writer in this tree yet.
- **Test G1** is added (§4).
- **Unchanged:** every existing test, and every recorded-mutation note, byte for byte.

**K-3 — the owner's indexes** (§2.8).

### 2.5 ADR-029: confirmed not needed by 1a

1a takes no whole-file read and no hash:
- `SourceDescriptor::of` reads at most the declared footer ceiling plus the tail (`engine/src/descriptor.rs:97-102 @ aa00e565 sha256:2d20c58d93fde9d624dfe7e5811a81ce8dd177cb76fc46e7d3be0fb3dfc8464c`);
- pinning is an explicit act outside open (`engine/src/dataset.rs:658-671 @ aa00e565 sha256:f5bce17cda0e44514bde1d08ac1cdc2459e9316953fcb94d7b8d4a8c7a7cf8a9`);
- `linked` and `check` read only the descriptor already held.

Test K5 proves it over the module's source. The brief's §8 is confirmed, and its §12 narrowing to piece 3a applies.

### 2.6 The caller rule: round 8's exemption, named

**No product caller exists in 1a.** Every new `pub` item of E-1 and K-1 is a producer for the consumers this form designs and names:
- `b2-piece-1b-recording` (the step's `data` member);
- `b2-piece-1c-save-and-reopen` (the project file's entry, the reopen and the changed-file notice).

Each consumer is gated by its own full form, and 1c also by ADR-036's acceptance. **The pre-commitment is the human's evening ruling of 2026-10-07:** stage 1 runs as 1a, 1b and 1c, per the brief's §9, which places this reference in 1a for 1b and 1c. OPEN-6 asks the human to confirm. The PR body and the PLAN node name both consumers.

**The engine to kernel seam** is written against E-1 as built in the same piece. **The kernel to reopen seam** is written against `OpenDatasetRequest` as it is today. **K2 proves both end to end,** through `SkpHost::open_dataset`.

### 2.7 Portability (R1 to R6)

- **R1 — semantics:** the reference's text and its comparison are the same on every OS. No member depends on the OS.
- **R2 — boundaries:** no new OS boundary and no `cfg`. `dataset_ref.rs` does no I/O. Fixtures use `std` only, including `File::set_modified`.
- **R3 — behaviour per platform:**
  - **Windows, macOS, Linux:** supported at L1. Every test runs on every CI platform.
  - **Declared reduction:** a copy between filesystems with different mtime resolution reports `mtime` (fail-closed). It is stated in ADR-036's Consequences. The KNOWN-LIMITATIONS line is deferred to 1c, the first piece that shows it, and is recorded there.
- **R4 — no Windows assumption in shared logic:**
  - no drive letter, backslash or case rule is parsed;
  - G1 scans for the fixture's real path strings, not for a pattern.
- **R5 — claim level:** L1 only.
- **R6 — skipped tests:** none.
- **Frontend:** no frontend file. ADR-036 §5 states that the frontend never builds or parses a locator.

### 2.8 The owner's-index lines the worker updates (pointers only; each index at most 60 lines)

**`engine/README.md`:**
- the "Source descriptor, pre-check and post-check" line gains `spatial_engine::descriptor::SourceObservation` and O2's test name;
- "Proposed ADRs, binding nothing" gains ADR-036;
- "Last verified at" is refreshed.

**`kernel/README.md`:**
- a new interface line: **Lasting dataset reference** → ADR-036 (Proposed), `spatial_kernel::dataset_ref` (`DatasetRef`, `DatasetUri`, `Admission`, `RefCheck`, `RefBuildError`, `RefParseError`), pinned by K2 and K3;
- the persisted-artifact line gains G1;
- "Consumed from other modules" gains the engine's descriptor types;
- "Proposed ADRs" gains ADR-036;
- the module's preregistrations gain this form;
- "Last verified at" is refreshed.

### 2.9 OPEN items (the human's; the custodian's question round carries the options)

| OPEN | Subject | Holds |
|---|---|---|
| OPEN-1 | the step record's fields and file format, and ADR-036's layout: (a) the fields; (b) the `at` member; (c) a project is a folder, with `project.spatial.json` and `.spatial/lineage.jsonl`; (d) canonical JSON Lines | ADR-036's filed text; 1b |
| OPEN-2 | two folders that carry one identity after a copy made by hand | ADR-036 §4; 1b, 1c |
| OPEN-3 | a session that never saved | ADR-036 §4 and §9; 1b, 1c |
| OPEN-4 | the brief's §8, on a linked file's source revision: the observation as `source_revision`, or beside the six members | **1a code (K-1)** |
| OPEN-5 | a direct `getrandom` dependency for the kernel's minting | **1a's `DatasetUri::mint`**; 1b, 1c |
| OPEN-6 | confirm round 8's pre-commitment for this producer | **all 1a code** |
| OPEN-7 | locators in a project file that travels: no absolute path | ADR-036 §5; 1c |
| OPEN-8 | persisted feature ids (a selection scope) against ADR-016's OPEN | ADR-036 §6 and §11; the first piece that records a selection |

## §3. Fixtures — outcomes declared in advance

**Source:** every fixture is generated in-test by `spatial_engine::fixture::write_geoparquet` into the test's own scratch directory. No corpus file and no committed binary are used. A test that rewrites a file sets its mtime explicitly with `File::set_modified`.

| Fixture | Used by | Predicted outcome |
|---|---|---|
| F1: 500 features, declared LV95, native `id` | O1, R1, K1, K3, K5 | builds; round-trips byte-for-byte |
| F1′: F1 rewritten with 1,000 features and an mtime 60 s later | O2, K3 | differs in `size`, `mtime`, `footer-length` and `footer-hash` |
| F1″: F1 with one byte flipped inside the first data page; size and mtime restored | O3 | **no component named.** This is the declared limit, and the outcome is `NoChangeDetected`, never "unchanged" |
| F2: no CRS declared, an int64 key column, no `id` (the modes the engine's admitted-assertion and declared-identity tests use) | K2, G1, R6 | opens through `SkpHost` with an assertion and a declaration; the reference records both claims without `by` or `at`; a reopen with the parsed claims gives `NoChangeDetected` |
| F3: native `id` plus a second unique int64 column | K4 | a reference from the mapped open, checked against a native open, gives `Differs{admission:["identity"]}` |

## §4. Tests, and one mutation per new test

Each mutation is observed by applying it, running the named test, recording its failure by name with the commit it was observed at, and reverting it (round 25, item 2 (c)).

**Engine** (`engine/tests/source_observation.rs`):

| Test | Mutation that fails it |
|---|---|
| O1 `an_observation_carries_the_four_components_the_open_read` | `observation()` records `footer_hash: None` |
| O2 `a_recorded_observation_differs_from_a_rewritten_file_by_the_descriptors_own_rule` | `SourceObservation::components_differing_from` bypasses the shared rule and omits `footer-hash` |
| O3 `a_data_page_edit_under_preserved_size_mtime_and_footer_is_not_detected` | `observation()` records `modified_nanos: None` |
| O4 `an_unestablished_component_compares_by_the_degradation_rule` | the shared rule counts a footer hash present on one side only |

**Kernel unit tests** (in `kernel/src/dataset_ref.rs`):

| Test | Mutation that fails it |
|---|---|
| R1 `a_reference_round_trips_through_its_canonical_text_byte_for_byte` | the parser drops `admission.identity` |
| R2 `an_unknown_member_is_refused_by_its_path` | the parser ignores unknown keys |
| R3 `a_locator_count_or_string_over_its_ceiling_is_refused` | the locator-count check is removed |
| R4 `a_dataset_uri_outside_its_grammar_is_refused` (and `mint()`'s output parses, if OPEN-5 is (A)) | the hex check is removed from `FromStr` |
| R5 `a_project_relative_locator_parses_and_writes_back_unchanged` | the parser refuses `project-relative` |
| R6 `an_asserted_crs_without_a_definition_is_refused_rather_than_recorded_empty` | `None` maps to an empty string |

**Kernel integration** (`kernel/tests/dataset_ref.rs`):

| Test | Mutation that fails it |
|---|---|
| K1 `the_reference_uses_the_bundles_resource_ref_vocabulary`: a real `publish_unguarded` bundle's `source` key sequence and its named-state shape, compared with the reference's `resource` | the writer renames `portability_policy` |
| K2 `a_reference_survives_a_reopen_through_open_dataset_and_reports_no_change_detected`: the seam, end to end; `Admission`'s members are passed unconverted into `OpenDatasetRequest` | the writer omits `crs_assertion` |
| K3 `a_reopen_after_the_file_changed_names_each_changed_component` | `check` returns `NoChangeDetected` unconditionally |
| K4 `a_reopen_under_another_identity_declaration_names_the_admission_difference` | `check` skips the identity comparison |
| K5 `the_dataset_reference_module_reads_no_file_hashes_nothing_and_takes_no_lease`: a source scan for `std::fs`, `std::io`, `File`, `OpenOptions`, `pin_content`, `content_hash`, `ContentPin` and `acquire(`, with a planted positive control | `linked` calls `std::fs::metadata(ds.path())` |

**Persisted-artifact test** (`kernel/tests/no_generation_in_persisted_artifacts.rs`):

| Test | Mutation that fails it |
|---|---|
| G1 `a_dataset_reference_carries_no_generation_session_reference_handle_path_or_assertion_attribution`: a key walk and a byte scan for `generation`; the minted `sr_` value and its shape; the `ds_` handle value; the fixture's absolute path and its parent's; the engine's `asserted_by` and `asserted_at` values; each with a planted positive control | the machine-recorded locator's `at` carries `ds.path()` |

**No existing test is edited.** The single exception is K-2's added header family, which is test text.

## §5. Predictions · declared unchanged · invalidators · falsification

**Predictions** are §3's outcomes column. A wrong prediction is a result, recorded as class 2, and the prediction is never edited.

**Declared unchanged:**
- `SourceDescriptor::components_differing_from`'s outputs, and every test in `engine/src/descriptor.rs`;
- `Dataset::open*`'s reads: no new read and no new scan (`identity_verification_scans`'s tests unmodified);
- the bundle's emitted bytes: `kernel/tests/publish.rs` and `kernel/tests/verify_bundle.rs` unmodified;
- `protocol/` (empty diff), `SKP_VERSION`, and every wire fixture;
- `engine/src/lib.rs`;
- `frontends/`;
- the texts of ADR-005, ADR-006, ADR-016 and ADR-019;
- `engine/README.md`'s statement that this module persists nothing, which stays true: 1a writes nothing.

**Invalidators** (stop and report):
- **I1:** E-1's shared rule cannot be reached without changing an existing descriptor test.
- **I2:** a reference member cannot be derived from a real accessor (that would be an imagined interface).
- **I3:** any existing test needs an edit.
- **I4:** code is dispatched before OPEN-4 and OPEN-6 are ruled, or `mint()` before OPEN-5 is ruled.

**Falsification.** The form is wrong if either holds:
- a linked reference cannot be made without reading the file, in which case the brief's §8 and §2.5 are false;
- the six members cannot carry the reference without a seventh, in which case ADR-036 §5 is false.

## §6. Instruments

**Every quantity is an assertion:** a typed outcome, a key set, or a source scan. There is no measurement and no docs/08 row.

## §7. Declared values and ceilings

**Values** (ADR-010 rule 6), each declared at its own site in `kernel/src/dataset_ref.rs` unless noted:
- `DATASET_URI_PREFIX` = `spatial://dataset/ref/`, with exactly 32 lowercase hex characters after it;
- `MAX_REF_LOCATORS` = 8;
- `MAX_REF_STRING_BYTES` = 4,096 bytes, for every string member except `definition_json`;
- `definition_json` is bounded by the engine's existing `MAX_CRS_DEFINITION_BYTES` (`engine/src/crs.rs`), which is reused and not declared again;
- `modified_ns` is always a decimal string;
- these values are ADR-036's and are not coded in 1a: `PROJECT_FORMAT_VERSION` = 1, `STEPS_FORMAT_VERSION` = 1, the `step_` prefix, and the `spatial://project/` prefix.

**Line budget, by §21c's rule** (insertions plus deletions, tests included):

| Group | Files | Ceiling |
|---|---|---|
| engine product (unit tests inside) | `engine/src/descriptor.rs` | ≤ 180 |
| engine tests | `engine/tests/source_observation.rs` | ≤ 240 |
| kernel product (unit tests inside) | `kernel/src/dataset_ref.rs`, `kernel/src/lib.rs`, and `kernel/Cargo.toml` if OPEN-5 is (A) | ≤ 760 |
| kernel tests | `kernel/tests/dataset_ref.rs`, `kernel/tests/no_generation_in_persisted_artifacts.rs` | ≤ 520 |
| ADR | `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md` | ≤ 280 |
| indexes | `engine/README.md`, `kernel/README.md` | ≤ 30 |
| **Total** | **≤ 10 files** | **≤ 2,010** |

**Excluded from the count:** this form; `PLAN.yaml`; `CUSTODIAN-QUEUE.*`; `site/**`; `docs/README.md` (generated by `adrIndex.mjs`); `Cargo.lock`.

**The counting command,** run at head H, with base B named in the PR body:

`git diff --numstat B H -- . ':!kernel/B2-1A-STEP-RECORD-AND-DATASET-REFERENCE-PREREGISTRATION.md' ':!PLAN.yaml' ':!CUSTODIAN-QUEUE.md' ':!CUSTODIAN-QUEUE.json' ':!site' ':!docs/README.md' ':!Cargo.lock'`

**An overrun is class 8.** This section is never edited.

## §8. Block-on-sight (each checked on its own)

1. File I/O, a path built or parsed, or a lease, in `kernel/src/dataset_ref.rs`. Any call from 1a code to `pin_content`, `ContentPin`, `content_hash`, or a whole-file read.
2. A session handle, session reference, generation, absolute path, OS user name, or `by`/`at` attribution in the reference's text.
3. The word "unchanged" or any snapshot-consistency claim for `NoChangeDetected`; a `check` outcome that states another module's consequence.
4. A seventh ResourceRef member, or a member name or state outside the bundle's vocabulary, which is A7's single model.
5. A recorded observation compared by any rule other than the descriptor's one rule.
6. Any edit under `protocol/`, to a wire fixture, `package-lock.json`, or `Cargo.lock`, unless OPEN-5 is ruled (A) and #188 has merged.
7. A `pub` item beyond §2.4's list; an option, callback or path whose only callers are tests or something other than §2.6's named consumers.
8. Any step-record type, writer or file. The step record is design-only in 1a.
9. Any frontend file; any change to the bundle's emitted bytes.
10. ADR-036 with a Status other than Proposed, or not byte-equal to §2.3 as amended; any edit to ADR-005, ADR-006, ADR-016 or ADR-019.
11. A URI or id derived from a path, a time or a handle; `mint()` landed before OPEN-5 is ruled.
12. The word zero-copy, a performance number, a timing assertion, or a docs/08 row.
13. A new `cfg` or platform ignore.
14. The round-25 items, by name:
    - an overrun not recorded as class 8, or §7 edited to match;
    - a scope addition not recorded as class 9, or any code of it landed before its amendment;
    - a record that calls a `verify-mutation` run an observation;
    - a test-text span on the branch pinned by hash at a branch commit, or named without its commit id;
    - a five-line form for this piece.
15. Quotation marks around text that is not byte-identical to its named source; a line cite into the ledger; a bare self-line.
16. An index edit outside §2.8, or an index over 60 lines.
17. Code dispatched while a waiting PR shares a path with it (the awaiting-merge direction, item 3).

## §9. Gates

**Commit plan,** each commit signed off:
1. ADR-036 (Proposed), copied from §2.3 as amended, with `docs/README.md` regenerated.
2. E-1, with O1 to O4.
3. K-1 and K-2, with R1 to R6, K1 to K5, and G1.
4. The indexes and PLAN.

**Architect** (full gating):
- §8, item by item;
- ADR-005 (a linked file is at most Reference-only);
- ADR-006 (the class mapping and the reversibility member);
- ADR-016 §6 and Amendment 1 (no generation, no feature ids);
- docs/11's six members;
- docs/14;
- the seam rule for E-1 to K-1 and for K-1 to `OpenDatasetRequest`;
- round 8's exemption against §2.6;
- the round-7 discharge and operator-text rules;
- verbatim quotes;
- the round-25 checks.

**Reviewer:**
- the full diff, `origin/main...HEAD`;
- every mutation made again;
- §7's count, by its command;
- every hash recomputed, including ADR-036 against §2.3 as amended;
- the index lines.

**Suites, green before either gate.** Heavy runs follow the machine paragraph, `state/directives/2026-10-06-machine-script-adopted.md:12-22 @ 0053ced0 sha256:7350977156bed7c94b0da4e8db806ba34c25c6678e65c46447a62d791ba9e8e1`, carried in the worker's, tester's and reviewer's briefs. No other rule for running builds applies.
- `cargo test --workspace --locked --features spatial-engine/fixture`;
- `cargo fmt --all --check`;
- `cargo clippy --workspace --all-targets --locked --features spatial-engine/fixture`: no new warning on an added line;
- `npm run verify:adr-index` in `frontends/shell`;
- `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs`;
- `verify.mjs`, `queue --check`, `site --check`, `verify-cites`, `verify-quotes` (a floor) and `verify-test-claims`;
- CI green at the reviewed commit.

**Proportional gates.** The product-first direction's section 2 applies, by reference: `state/directives/2026-10-05-product-first-direction.md:15 @ 0053ced0 sha256:8c0e4e3f404b413db3e506411f401880baf9681ac8dd67362dfba73c20d7b751`.
- A gate fails only on Correctness or Evidence.
- Documentation findings are fixed in the same PR before the merge.

**Operator:** none. 1a has no user-visible behaviour.

**PR body:**
- asks for a merge commit;
- names each OPEN ruling;
- names base B;
- names round 8's consumers, `b2-piece-1b-recording` and `b2-piece-1c-save-and-reopen`.

**Closing record** (references and hashes only):
1. the PR, its merge commit and the reviewed heads;
2. the gate report paths;
3. the worker reports;
4. ADR-036's hash at the merge commit;
5. each mutation's observation commit;
6. each done item's test name;
7. §7's count;
8. PLAN set to done, with `{pr}` in the done commit only.

## §10. Amendments

*(Opens empty; append-only.)*
