# Guardrails: coordinate epochs, heights, time-dependent transformations and DGGS

Fable, advisory brief, 2026-10-12. For the human's approval; it binds nothing until he rules. Code facts were read at main f587edd8.

## Purpose

Spatial IDE does not transform coordinates yet, does not read heights and has no grid index. This brief does not ask for any of that to be built. It says what today's pieces must not do, so that later work on dynamic reference frames (where a coordinate means something only together with an epoch), on vertical references and on discrete global grids can be added without a format break and without a silent change of meaning.

## 1. Where the code stands

The engine admits a dataset with its CRS as a typed fact: the identifier, the definition as the file states it, where it came from (the file, a format rule or a caller's assertion), the axis order and the unit. It never guesses a CRS. It performs no CRS-to-CRS transformation, and the workspace depends on no transformation library. Geometry is two-dimensional: a Z or M geometry is refused at open, by name. `docs/05` already requires every future reprojection to record its exact pipeline, its grids by content hash and the library's database version, and to fail visibly when a pinned grid is absent. ADR-013 already makes declared accuracy an attribute of its own, beside the reproducibility grade.

Three gaps exist today. First, the GeoParquet reader reads `version`, `primary_column`, `encoding`, `geometry_types`, `crs`, `covering` and `bbox`; it does not read a column's `epoch` or `edges` key, so a declared coordinate epoch is dropped without a record. Second, a CRS whose definition has three axes is admitted on its first two, and the third is ignored without a record. Third, nothing in the CRS type, the wire or the project formats has a place for an epoch.

## 2. The rules

**R1. A coordinate space is a definition plus an epoch state, never a name.** Two datasets with the same identifier may differ in definition, and in a dynamic reference frame one definition at two epochs is two spaces. Today this means: equality, cache keys and records identify a CRS by its definition or the definition's hash, never by the identifier alone; and a new interface that names a coordinate space takes a structured value that can gain a member, never a bare string. The wire's existing `bbox_crs` string stays; no new field copies its shape.

**R2. The coordinate epoch has named states and no default.** It is `not-applicable` (the CRS is static), `stated` (a decimal year, with where it came from), or `not-stated`. Not-stated is never replaced by today's date, the file's date, the frame's reference epoch or any other guess. An operation that needs an epoch and meets not-stated refuses by name. Today this means: no code and no format writes an epoch it did not read and was not given.

**R3. A dataset epoch and a time per observation are different facts.** A dataset may carry one epoch for all its coordinates, or each row may carry its own observation time in a column. The model keeps both possible: the epoch is one value for the dataset, or a named column, or not-stated. Today this means: nothing assumes one dataset has one epoch; and a piece that carries a date or time column keeps its type and time zone, or refuses it by name.

**R4. Heights are never invented and never dropped.** A two-dimensional geometry is never given Z = 0, and a three-dimensional one is never flattened, by an operation that does not say so in its name and its record. When Z is admitted, it comes with the state of its vertical reference: an ellipsoidal height in the dataset's own three-dimensional CRS, a height in a named vertical CRS, or not-stated. A transformation whose accuracy depends on height receives one, or is a declared two-dimensional operation with its accuracy bound, or refuses. Today this means: Z and M stay refused at open until that model exists, and no buffer or format is widened to carry a Z that has no reference.

**R5. What the engine does not interpret, it records as not interpreted.** A property a file declares about its coordinates (an `epoch`, an `edges` value, a third axis) is kept and shown as read but not used, or the file is refused. It is never dropped silently. Today this means: the gaps of section 1 are stated in KNOWN-LIMITATIONS now; and a piece that writes a copy of a dataset (a snapshot, a bundle of a later format) carries those properties across unchanged.

**R6. A transformation is a recorded operation with a complete key.** Its record, and the key of anything cached or derived from it, holds: the source and target spaces (definition and epoch state each), the exact operation chain, every grid and model file by content hash, the model's name and version (a plate-motion or deformation model included), the library's database version, the per-row time column where one is used, and every parameter. Two results that differ in any of these never share a cache entry. Today this means: `docs/05`'s pipeline pinning gains epochs and model versions before the transformation service is designed; and a derived resource built now (LOD tiers, a snapshot) is keyed on its input's full identity, so that a later key can add the space without meeting old entries.

**R7. No fallback is chosen by a library.** A substitute operation of lower accuracy, a time-dependent step skipped because an epoch is missing, a grid replaced or left out, a height assumed: each is a named refusal unless the user chose it, and then it is recorded with its accuracy. Today this means nothing to build. It is the existing no-silent-conversion rule, stated for the cases a transformation library decides by default.

**R8. Accuracy and validity travel with the result.** A transformed result carries the declared accuracy of its operation and the limits within which that operation is valid: its area of use and, for a time-dependent model, its span of time. A result outside those limits is refused or marked, never shown as ordinary. A dataset admitted under the format's default CRS (OGC:CRS84) keeps that provenance in any accuracy statement: the default names the WGS 84 datum ensemble, whose stated accuracy is two metres, and no epoch, and it is never upgraded to a specific realization. Today this means: the `crs:format-default` provenance is kept wherever a CRS is copied, and no text claims more accuracy than the inputs declare.

**R9. Stored coordinates name their space.** Anything persisted that holds coordinates outside the dataset itself (a saved map view, a mask, a selection or scope box, a step's parameters, a bundle's extent) names the space those coordinates are in, by definition, with room for the epoch state. Today this means: the project file's `workspace` member and the step record are checked for this before ADR-036 is accepted.

**R10. A grid cell is derived, never authoritative.** A discrete global grid is an optional index or an analytical resource derived from a dataset. Its identity holds the grid system and its version, the resolution, the aggregation rule, and the identity of its input including the input's space. A change of epoch therefore gives a different resource, because an observation can change cell. A cell never replaces a cadastral boundary or an authoritative coordinate, and a cell id is never a feature's identity, nor a join key on its own. Today this means nothing to build. The same holds for tile keys and LOD tiers: they are drawing resources, never a feature's location.

## 3. Where current and near pieces meet the rules

| Piece or surface | Rules | The check |
|---|---|---|
| ADR-036, before acceptance (the step record and the dataset entry) | R1, R2, R9 | `dependencies.crs` holds an identifier and a source only: does it identify the CRS by definition? Is the coordinate epoch reserved by name, as a selection scope is, so that adding it is a planned version step? |
| B2 piece 1c, the project file's `workspace` member | R9 | A saved map view, filter box or scope names its space. |
| B2 stage 3, the snapshot | R5, R6 | A snapshot keeps the source's `geo` metadata it does not interpret, and its key is the input's full identity. |
| Bundle format 2 (B3) | R5, R8, R9 | The manifest carries the epoch state and the CRS provenance. Format 1 cannot, which the KNOWN-LIMITATIONS item says. |
| Any new SKP field that names a space | R1 | A structured value, not a bare string. |
| A product caller of `build_tiers` (already blocks on sight) | R6, R10 | The tiers' identity names their input in full. |
| Geometry admission | R4 | Z and M stay refused until the vertical model exists. |
| The transformation service's first piece (not placed) | R1 to R8 | A Proposed ADR drafted from this brief is accepted first. |

## 4. Now

1. One KNOWN-LIMITATIONS item, in the docs lane: a file's declared coordinate epoch, its `edges` value and a third CRS axis are not used, shown or carried into a bundle. The architect drafts it with its clause check, and the human approves or replaces it.
2. ADR-036: the architect answers the two checks of section 3's first row before the human accepts it.
3. Forms: a piece that touches a surface of section 3 says in one line which rules it meets. No rule adds scope to a piece already in code.

## 5. Not now

Reading the epoch into the CRS type, `describe` and the wire; a vertical model; a transformation service; any grid index. Each is its own piece, placed by the human. The Proposed ADR is drafted when the first of them is placed.
