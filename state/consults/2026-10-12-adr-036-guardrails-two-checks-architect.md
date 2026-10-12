*Custodian's filing note (2026-10-12): the architect's answer to ADR-036's two checks, the first row of the guardrails brief's section 3 (state/consults/GUARDRAILS-EPOCHS-HEIGHTS-DGGS-2026-10-12.md), asked by the human before they take up ADR-036's acceptance (state/directives/2026-10-12-item-42-current-view-amendment-7-guardian-readme-guardrails-brief.md, item 5). Read at main 4ea0f551; the run 2026-10-12T07:10:07Z to 2026-10-12T07:12:47Z by its transcript. It arrived as a message and is extracted here by script from the SubagentHandback call in its transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 88258015dd425ed9c60a1546749affbb6766965e0f6cb928358bb2d5ee98e02a. Write audit PASS: zero write calls (Read 9, Glob 1, Grep 8). It is an answer, not a gate, and it drafts no ADR text; its line cites are into main at 4ea0f551.*

---

# ADR-036 against the guardrails brief's two checks — architect
Read: main @ 4ea0f551290317b918ef59491de348660876a984 (from `.git/HEAD` → `refs/heads/main`. The session-start status showed only untracked files that are not part of this review, so the tracked files I read are this commit's.)

This is an answer to the two checks, not a gate. ADR-036 is Proposed and binds nothing. I have drafted no ADR text.

## Check 1: does `dependencies.crs` identify the CRS by its definition? (R1)

**What the ADR says.** The step record's `dependencies` row at `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:113` holds `"crs":{"identifier","source"}`. The identifier is the only thing in that object that says which CRS it is. The dataset entry carries a definition only for a caller's assertion: line 88 gives `crs_assertion` (`identifier`, `definition_json`) or `null`. For a CRS the file declares, the entry has no CRS member. Its `observed.footer_sha256` covers the footer, which holds the `geo` metadata, but line 84 says "It is a change detector, not an identity." So it does not meet R1, and it may be the state `not-read-over-ceiling`.

**Meets R1: no.** There is a concrete failure in the code. Every CRS that has a definition but no authority code gets the same identifier, `(definition-only)` (`engine/src/crs.rs:28`). The doc comment at `engine/src/crs.rs:24-27` says that marker can never decide identity. Two different such CRSs would therefore produce identical `dependencies.crs` records. The object form only partly meets R1's "structured value that can gain a member": line 33 says "a reader refuses an unknown key, a missing key and a duplicate key, naming the key's path.", so a member can be added only by a version increment.

**Smallest change.** Give `dependencies.crs` a definition member holding the sha256 of the definition the engine admitted, and name the bytes that are hashed. Where no definition exists (the format-default admission, or an assertion without a definition), use a named state in line 34's form. Keep the identifier as a label only.
- **If it lands before acceptance,** it is part of version 1 and needs no version step.
- **If it lands after acceptance,** it is a change of shape. Line 41 says "A reader refuses a version it does not implement, and a change of shape increments the version." That makes it version 2, which the shipped version-1 reader refuses. Every version-1 step would stay identified by name only and could never be raised to R1. That is a break, not a planned step.

## Check 2: is the coordinate epoch reserved by name, the way a selection scope is? (R2)

**What the ADR says.** The word "epoch" does not appear anywhere in the ADR. The selection-scope reservation the brief compares against is at line 115: "A selection scope is reserved (§11)." However, §11 (lines 166-177) does not mention a selection scope. The nearest item is line 176, on persisted feature ids. So the model reservation itself points to a section that does not contain it (a Documentation finding; see below).

**Meets R2: no.**

**Smallest change.** Reserve the coordinate epoch by name, as a dataset fact that may later be one value, a named column or not stated (R3), and add it later as a shape change.
- That is a planned version step under line 41. A later reader knows version 1 has no epoch and shows it as not read. The shipped version-1 reader still refuses the later files.
- A stronger form, if wanted: add the member in version 1 with one honest word meaning not read. Add a rule like line 42's for later words ("A reader that meets an action from a later vocabulary shows the step as recorded by a later version, and never drops it (docs/01, principle 8).").
- Version 1 cannot honestly write R2's `not-stated` or `not-applicable`. The reader skips a file's `epoch` key, and it cannot tell a static CRS from a dynamic one. R2 says "no code and no format writes an epoch it did not read and was not given" (`state/consults/GUARDRAILS-EPOCHS-HEIGHTS-DGGS-2026-10-12.md:19`).

## R9's other surfaces in the ADR

- **Saved map view: not in the ADR.** Line 168 leaves the project file's `workspace` member, including the map view, to piece 1c's amendment, which is accepted together with the ADR. R9 is checked there (the brief's row 2, line 42).
- **Mask: not present.**
- **Selection or scope box: no coordinates today.** `scope` is `{"kind":"layer"}` (line 115), and line 129 says "A selection alone is not a step." R9 applies when a selection or box scope is added.
- **A step's parameters: partly.**
  - `intent` holds `{"action":<registered name>,"params":{…}}`, and a quantity carries a `unit` (line 112).
  - The registry declares "the closed shape of its parameters with units" (line 131). Units are named, but no rule says a parameter holding coordinates (a box, a point) names its space, or that it is in `dependencies.crs`.
  - The smallest fix: the registry's parameter shape names the space of any coordinate-bearing parameter. Under check 1's change, that space would be identified by definition.
  - Before acceptance this is version 1. Because line 131 registers no action, the fix could also land with piece 1b's first actions, which increment `actions` as line 42 already plans.
- **Bundle extent: not in this ADR** (ADR-017's).

## Other rules of section 2

- **R2, the form of a named state: met.** Line 34's `{"state": <word>, "basis": <text>}` with no default is the form R2 needs. The ADR writes no epoch, so it writes none it did not read.
- **R8: partly.** `source` in `dependencies.crs` (line 113) has no vocabulary in the ADR. If it takes the engine's words (`file`, `caller_asserted`, `format-rule`, `engine/src/crs.rs:110-116`), a format-default admission is visible only as `format-rule`. The provenance class `crs:format-default` (`engine/src/geoparquet.rs:95`) is not named.
- **R6: met for steps.** `data.identity` is the content hash or the observation (line 114), always through the reference.
- **R5: not decided here.** The snapshot's sealed copy (line 64) and its store are left to 3a (line 174). R5 is checked at stage 3 (the brief's row 3).
- **R10: consistent.** Identities are CSPRNG values (line 53), and no feature id is persisted (line 176).
- **R4: not touched.** `geometry_types` is recorded, and nothing is widened to carry Z.
- **No rule of section 2 is contradicted** beyond R1 (check 1).

**Documentation finding (must be fixed before acceptance, not a block).** Line 115's "(§11)" points to a section that does not reserve a selection scope.

## Code facts (read on main at the commit above)

- **The CRS type: confirmed, with one correction.**
  - `DatasetCrs` (`engine/src/crs.rs:172-183`) holds the identifier, `definition_json`, the source (file, caller's assertion, format rule), the assertion's author and time, the definition provenance and the axis order. It has no epoch member.
  - Correction: the unit and the provenance class are not in the CRS type. They sit beside it on `AdmissionRecord` (`engine/src/geoparquet.rs:301-320`).
  - Correction: "the definition as the file states it" is true of its content but not of its bytes. The definition is the parsed `crs` object serialised again (`engine/src/geoparquet.rs:440`, `Some(crs.to_string())`). A definition hash (check 1) must name that input.
  - Admission compares no name strings (`engine/src/crs.rs:271-274`). The envelope carries the identifier and the source as strings (`engine/src/envelope.rs:122,124`), the same pair line 113 copies.
- **What the GeoParquet reader reads: confirmed, with precision.**
  - `GeoMeta::parse` reads `version` (377), `primary_column` (383), the primary column under `columns` (389-390), `encoding` (398), `geometry_types` (406), `crs` (435), `covering.bbox` (454-455; only the `bbox` part of `covering`) and the column's `bbox` (458), all in `engine/src/geoparquet.rs`.
  - Only the primary column is read. Nothing in `engine/src` reads `epoch` or `edges`; the only `epoch` matches are Unix-epoch time code.
- **The third axis: confirmed.** `axis_order_from_projjson` refuses fewer than two axes (`engine/src/geoparquet.rs:686`) and reads only axes 0 and 1 (692-726). A third axis is neither looked at nor recorded; it survives only inside the stored definition text.
- **No transformation library: confirmed.** No proj, proj4rs, proj-sys or geodesy dependency in the root, engine or kernel `Cargo.toml`.
- **Not checked:** the Z/M refusal at open, which none of these answers relies on.

## Files read
- C:/dev/spatial-ide/state/directives/2026-10-12-item-42-current-view-amendment-7-guardian-readme-guardrails-brief.md
- C:/dev/spatial-ide/state/consults/GUARDRAILS-EPOCHS-HEIGHTS-DGGS-2026-10-12.md
- C:/dev/spatial-ide/docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md
- C:/dev/spatial-ide/engine/src/crs.rs
- C:/dev/spatial-ide/engine/src/geoparquet.rs (lines 1-727)
- C:/dev/spatial-ide/engine/src/envelope.rs (lines 100-139)
- C:/dev/spatial-ide/engine/Cargo.toml, C:/dev/spatial-ide/kernel/Cargo.toml (searched only)
- C:/dev/spatial-ide/.git/HEAD, C:/dev/spatial-ide/.git/refs/heads/main
