# ADR-023 — Attribute Projection on `viewport_query`

**Status:** Proposed — **decision deliberately undrafted; binds nothing.** Filed 2026-08-15 as
the named home for a deferral, so the gap has an address instead of being rediscovered (the
ADR-011-gate-8 pattern). Not architect-blockable. No implementation exists or is licensed by this
filing.
**Drafted by:** the architect design consult for the `cut/style-panel` branch (2026-08-15).
**Related:** ADR-021 (the filter predicate's namespace — the same schema surface), ADR-017 §5a
(style v0's `match` needs a match-key column in the projection — the same discipline owed live),
ADR-010 rules 1/2 (frame tag; ordinal→id indirection — a widened batch schema must not disturb
either), `engine/src/attributes.rs` (`admit_projection` — exists, publish-path only),
`engine/src/envelope.rs` (the widened `[id, geometry, …attributes]` constructor — exists,
publish-path only), `docs/09` (what an unbounded projection over a local file requires).
**Record:** Decision text accepted as drafted with two §2 amendments by the human on 2026-09-14
(`DECISIONS-PENDING.md`, RULED 2026-09-14 question set D, D2); Status unchanged until B1's close.

## Context

Data-driven styling (`match`), attribute display in the hover panel, and any client-side
categorical legend all need per-feature attribute values on the **live** stream.
`viewport_query` has no projection parameter; the engine's declared attribute projection and the
widened batch envelope already exist but are reachable only from `stream_for_publish`. Style v0
already requires a `match` column to be present in the published projection — the same discipline
is owed live before the working canvas can style by attribute.

## Decision

*Ported verbatim from the architect's B1 consult, Document 1 — "ADR-023 Decision, drafted for the
human's sight" (`state/drafts/post-tag/architect-consult-b1-adr-023-decision.md`), with the
two §2 amendments ruled by the human on 2026-09-14 marked inline and the entry-79 rulings folded.
Status stays Proposed until B1's close.*

### 1. The surface

`viewport_query` gains one optional parameter: `columns: Option<Vec<String>>` — an explicit, ordered, caller-supplied list of source column names. No new command, no derived handle, no `SELECT` support (ADR-021's decision 1 and its "does not decide" list, `docs/adr/ADR-021-row-filter-on-viewport-query.md:51-59`, `172-173`, are followed exactly).

`columns: null` declares "no attribute columns", and is always present on the wire, never omitted — the `bbox_crs`/`filter` discipline (`protocol/skp/src/v0/commands.rs:256-264`). The reading side tolerates an absent key as `None`; that is a known, tested property, not a promise (SKP-V0's 2026-08-18 correction, `protocol/skp/SKP-V0.md:321-333`), and the `==` version literal, not field presence, is what refuses a mismatched client.

**`columns: null` does not mean "the id only" as a choice; it is what the batch already is.** The envelope's schema is `[id, geometry, …attributes]` with `id` always first and non-nullable (`engine/src/envelope.rs:128-131`), and `id` is refused as a projected column outright (`engine/src/attributes.rs:156-165`). Projection adds columns; it never selects or deselects the identity. `columns: []` is refused rather than admitted as a second spelling of `null` (`docs/01` principle 8 — one state, one spelling).

### 2. The admitted-type allowlist

**One admission function, shared with the publish path** — `engine::attributes::admit_attribute_type` (`engine/src/attributes.rs:58-97`). A second admissible set for the live path would be a second policy over the same question; the decision is that there is exactly one.

Admitted, in Arrow terms (DuckDB's Arrow output types for this reader):

- **text** — `Utf8`, `LargeUtf8`, `Utf8View` (`attributes.rs:61-63`)
- **boolean** — `Boolean` (`attributes.rs:64`)
- **integer** — `Int8/16/32/64` and `UInt8/16/32/64` (`attributes.rs:65-72`). DuckDB `TINYINT/SMALLINT/INTEGER/BIGINT` and their `U*` forms.
- **float** — `Float64` **and `Float32`**. DuckDB `DOUBLE` and `REAL`. *(amended by the human's ruling of 2026-09-14, question set D)* — the human's words: **"Float32 is ADMITTED as its own Arrow type, carried unchanged — every f32 is exactly representable in f64, so no conversion exists to object to."** The draft's `Float64`-only admission (`attributes.rs:73` — *code to follow the amendment in B1*) and its refusal arm for `Float32`/`REAL` (`attributes.rs:82-88` — *code to follow the amendment in B1*) are superseded by this amendment: an `f32` column travels as `Float32`, is not widened on the way out, and so carries no conversion the caller did not ask for.
- **dictionary-encoded columns** — *(amended by the human's ruling of 2026-09-14, question set D)* — the human's words: **"dictionary-encoded columns are DECODED to their value type and admitted under that type's rule, the index never exposed — an ENUM of strings is text, not a synthesized identity."** The draft's refusal (`attributes.rs:74-81` — *code to follow the amendment in B1*) is superseded. A dictionary column is admitted if and only if its **value** type is admitted by the rules above, and it is emitted as that value type; the index is decoded away inside the engine and never reaches the envelope, the wire, the style path or the readout. ADR-016 §4's synthesized-identity hazard is therefore not engaged — there is no ordinal to mistake for an identity, because none is exposed.

Refused, by name, each through the typed refusal in §3:

- **geometry** — never, at any width or encoding: the geometry column is refused as an attribute because it already travels as GeoArrow (`attributes.rs:150-155`).
- **identity** — the engine's `id` and the mapped source column both refused (`attributes.rs:156-165`).
- **timestamps and dates** — `Date32`, `Date64`, `Timestamp(_,_)`, `Time*`, `Interval`, `Duration`: refused by the final arm (`attributes.rs:89-96`; `Date32` pinned by the test at `attributes.rs:197-204`). A timestamp has a unit and a zone; carrying it without deciding how a consumer renders it is a silent conversion waiting at the display end. Timestamps and dates stay refused for v0, with **dates named as the declared next admission** — the next type this allowlist takes up, whenever it is widened, is dates (the human's ruling of 2026-09-14, question set D).
- **decimals** — `Decimal128`/`Decimal256`: refused. Their exact value is not representable in the double a viewer would read it as.
- **lists, structs, maps, unions** — refused; the batch schema and the hover readout are flat.
- **binary** — `Binary`, `LargeBinary`, `FixedSizeBinary`: refused; nothing declares an encoding for them.

**Nullability is not taken from the source.** Every projected column is emitted nullable (`attributes.rs:174-176`), so a source NULL travels as a NULL and reaches the style's `on_null` branch and an explicit "no value" in the readout, rather than a substituted default.

**64-bit integers reach the shell as `bigint` and are never narrowed to `Number`.** ADR-016 §7's width contract is about identity, and `describe.identity.js_exact` (`protocol/skp/SKP-V0.md:68`) says nothing about an attribute column; a projected `Int64`/`UInt64` therefore carries no exactness claim and is displayed from its exact decimal form. Narrowing one to a JS `Number` in the readout is a defect of the same shape ADR-010 rule 7's M4 root cause names.

### 3. Typed refusals

Synchronous, on the control plane, **before** any ticket is minted or connection leased — the position ADR-021's admission already occupies (`kernel/src/skp.rs:379-388`). A refused projection never arrives as a data-plane terminal frame.

- **`skp.projection_column_unknown`** — fields: `column`, `known_columns` (comma-joined, the `candidate_columns` form `skp/0.2` already uses, `protocol/skp/SKP-V0.md:505`). Source: `Dataset::resolve_projection`'s no-such-column arm (`engine/src/stream.rs:821-832`).
- **`skp.projection_type_not_admitted`** — fields: `column`, `arrow_type`, `detail` (the existing detail text names what would have had to happen to admit it, `attributes.rs:82-96`).

**Two codes cannot carry six failure modes.** `admit_projection` refuses for six distinct reasons (unknown, type, geometry, identity, duplicate, ceiling), and ADR-021's decision 8 forbids a `String`-flattened catch-all — "a twelfth failure mode is a build error until it is mapped into this list by name" (`docs/adr/ADR-021-row-filter-on-viewport-query.md:95-99`). This decision therefore names four more, exhaustive, no wildcard arm:

- **`skp.projection_column_is_geometry`** — field `column`.
- **`skp.projection_column_is_identity`** — fields `column`, `id_column`.
- **`skp.projection_column_duplicated`** — field `column` (`attributes.rs:166-171`).
- **`skp.projection_too_many_columns`** — fields `limit`, `saw` (`attributes.rs:139-145`).
- (**`skp.projection_empty_list`** if §1's `[]` refusal is taken.)

*Deviation flagged: DRAFT-3's Stage B1 sentence names two codes (`DRAFT-3-BRIEF-B-recipe-replay-publish.md:81-83`). The four above are the architect's drafted completion of that set, not a widening of what B1 does; they need the human's word at B1's close.*

### 4. The cap — what the record forces

ADR-017 §16's "max published attribute columns = 32" and "Reader max attribute columns = 32" are **bundle-format ceilings**: both rows are labelled Publish or Reader (`docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:600`, `:606`). Neither reaches a live `viewport_query`. **The record does not supply a live ceiling**, and ADR-010 rule 6 requires one to be declared rather than discovered (`docs/adr/ADR-010-render-frames-origins-boundaries.md:70-72`).

Decision: **the live projection's ceiling is its own declaration**, set to the same 32 and enforced by the same constant, because B1 reuses `admit_projection` and that constant is where the check lives (`MAX_PUBLISHED_ATTRIBUTES`, `engine/src/attributes.rs:52`, `:139-145`). Two consequences are recorded rather than left implicit: the constant now bounds two surfaces, so its name is wrong for one of them and must be corrected or paired with a second declared constant in the same cut; and if the two ever need to differ, that is a new declaration in this ADR, never a silent divergence.

Unrelated and unchanged: ADR-017 §5a's cap of 64 `match` cases (`ADR-017:270-271`).

### 5. Order, and what the envelope records

The projection is emitted in the caller's declared order, after `id` and geometry (`engine/src/envelope.rs:49-51`, `:128-131`), and the envelope names it in `attribute_columns` (`envelope.rs:120-126`). Declared order, not file order — "all attributes" would make the emitted schema a function of the file's column order (`attributes.rs:18-20`). The declared fields are checked against the arrays actually handed in — count, order and type — so the envelope's claim is verified, not asserted (`envelope.rs:174-208`).

Authority for the `attribute_columns` record is `docs/11` plus `docs/01` principle 8, **not** ADR-010 rule 1, whose tag-on-envelope clause is about coordinate space (`envelope.rs:57-61`). This decision does not enlarge rule 1 by analogy and needs no ADR-010 amendment: `TaggedBatch` still has one constructor taking a `BatchEnvelope` taking a `DatasetCrs` with no public constructor, and the frame tag is unchanged (`envelope.rs:52-56`). ADR-023's own Context asked for that to be verified rather than inherited (`ADR-023:29-30`); it is verified here against the constructor chain, not against the comment.

### 6. The hover surface

The projected row is shown beside the id in the existing readout. The pick refusal is unchanged: `PickBelowResolution` stays a distinct state with no feature identity, and no attribute value is invented for it (`frontends/shell/src/canvas/pick.ts:17-33`). Attribute values are read **co-indexed with `ids` and `rings` from the same decode pass** (`frontends/shell/src/canvas/decodeBatch.ts:23-27`) — never re-fetched or re-joined by ordinal, which is ADR-010 rule 2's actual hazard. A NULL renders as an explicit "no value" marker, never as an empty cell that could be read as an empty string.

### 7. The style surface

B1 exposes style v0's existing categorical `match` over one projected **text** column, with the required `on_null` and `on_unmatched` fallbacks (`ADR-017:264-275`). `when` is a string only, by §5a's own rule — equality on a float is a wrong-but-plausible trap (`ADR-017:271-273`) — so an admitted integer, float or boolean column is projectable and displayable but not a `match` key in v0. At most one `match` in the document (`ADR-017:268-269`). Resolution goes through the single imported resolver, never re-implemented in the shell (ADR-022 point 2, mirrored at `frontends/shell/src/style/document.ts:5-10`). **Style stays ephemeral in B1** — in-memory state, nothing persisted (`document.ts:33-38`). Numeric classification is out of scope (DRAFT-3 boundary 8).

### 8. Invariants unchanged

- **CRS and frame.** Projection adds no coordinate and no reprojection; the frame tag, `crs`, `crs_source`, `axis_order` and `axis_normalization = none-performed` are byte-for-byte what they were (`envelope.rs:70-88`).
- **Identity.** `id` is first, non-nullable, aliased from the identity's source column exactly as before (`engine/src/stream.rs:1131-1133`); a projected column can never be the identity (§2).
- **The filter's composition rule.** Projection changes the `SELECT` list only; `WHERE (<predicate verbatim>) AND <bbox> [AND <ranges>]` is untouched (`stream.rs:1140-1158`; ADR-021 decision 4).
- **Boundary 9 holds by construction.** The projected columns are emitted with their own quoted names and no alias (`stream.rs:1134-1137`); only the identity source column is aliased. `duckdb-expr/0` still admits no geometry reference and no function call (ADR-021 decision 5, `ADR-021:72-74`), so every admissible predicate stays geometry-independent and projection does not widen the dialect. The predicate's admitted namespace and the projection's admitted set share one type gate (`admit_attribute_type`), which is a shared floor, not a new grant.
- **`describe` is untouched.** `schema [{name, arrow_type, nullable}]` (`protocol/skp/SKP-V0.md:69`) already carries what a panel needs to offer candidate columns. A client-side type filter is a convenience only; the kernel's refusal is the authority, and the client must never present its own list as the admission.
- **ADR-006 class 1.** A projection selects columns; it mutates no workspace, performs no external side effect, and is replayable from its own request. Nothing here is undoable because nothing here is a mutation.

### 9. What this decision does **not** do

No save, no persistence of a projection anywhere durable (ADR-021's predicate-persistence prohibition applies by the same reasoning, `ADR-021:181-182`). No numeric classification. No geometry predicate and no `ST_*` reachability. No derived-dataset handle and no `ResourceRef` for a projected result. No MCP exposure — nothing here says a projection parameter is safe to expose to an agent host; that needs its own exposure review. No `docs/08` row and no performance claim of any kind.

### 10. SKP version consequence

A new field on `viewport_query` is a wire change, and schema evolution here happens exactly once, as a version bump, never as a tolerant reader (`protocol/skp/SKP-V0.md:237-243`). Current literal is `skp/0.2` (`protocol/skp/src/v0/mod.rs:29`). **Brief A takes 0.3** (`DRAFT-2-BRIEF-A-admission-and-session-lifecycle.md:67`, `:76`, `:89`) and merges first, so **B1 bumps to `skp/0.4`**, `==` unchanged — no ranges, no capability set, no handshake; a `skp/0.3` client and a `skp/0.4` host fail on the first call. Every fixture on both the Rust and TypeScript sides updates in the same commit as the literal, `deny_unknown_fields` stays on every derived struct in both directions. If Brief A does not merge first, this decision's number is wrong and is corrected before B1's PR, never assumed.

### 11. Block-on-sight conditions for B1's reviewer

1. A projection refusal reaching the client as a data-plane terminal frame instead of synchronously on the control plane.
2. Any wildcard/`String`-flattened refusal arm in the projection error mapping.
3. A projected column admitted by a second type gate rather than `admit_attribute_type`.
4. A 64-bit integer attribute narrowed to a JS `Number` anywhere in the readout or the style path.
5. `match` parse/resolve/legend semantics re-implemented in the shell instead of going through the imported resolver (ADR-022 point 2).
6. Any style persisted in B1.
7. A projected attribute read at hover by an index not produced by the same decode pass as `ids`/`rings`.
8. A version-literal bump without both fixture sides in the same commit.
9. DRAFT-3 B-1: any PR/ledger/docs sentence describing the completed workflow; B-7: any duration or perf number.

### 12. Open questions — routed

**Human** (behaviour, authority, guarantees, scope): the four additional refusal codes in §3 and the `[]` refusal in §1 (a wider named surface than DRAFT-3's Stage B1 sentence); whether the readout shows every projected column or a bounded subset when the projection is large (a user-visible default); whether the panel's candidate list is filtered client-side by `arrow_type` (a user-visible default that can disagree with the kernel if the sets ever drift).

**Architect** (implementation-level unless it becomes a wire change): the constant's name and whether the live ceiling is a second declaration (§4); the producer-resident memory consequence of per-column chunk retention at projection width (Doc 2, queued item 3); whether the existing `filter_composition` prefix tests are re-pinned projection-aware without weakening the verbatim `WHERE` assertion (`stream.rs:2189`).

### Conditions carried into B1 (the human, 2026-09-14)

The four ADR-004 review conflicts, ruled verbatim (`DECISIONS-PENDING.md`, RULED 2026-09-14 question set D, item D2):

1. "the shell style module's in-code assertion that the live stream carries no attributes becomes false with B1 and is corrected in the same piece — never left as a lie"
2. "ADR-023's Context sentence gets a dated corrigendum at acceptance"
3. "per-column chunk retention at projection width is the architect's, with the memory consequence DECLARED as a ceiling (ADR-010 rule 6), never discovered"
4. "the filter_composition prefix tests are re-pinned projection-aware without weakening the verbatim WHERE assertion — architect's, reviewer-checked"

Status stays Proposed until B1's close.

### The human's rulings on the B1 items (2026-09-11, DECISIONS-PENDING entry 79, verbatim) — applied at B1's close; Brief B stays held until Brief A closes

> *"79: (1) the wider named set, projection_empty_list mandatory; (2) hover shows every projected column, the bound is too-many at admission; (3) describe carries per-column projectable, the panel holds no type logic."*

What each changes in Document 1 when B1 opens: **§3** — the refusal set is the six named codes plus `skp.projection_empty_list` (mandatory: `columns: []` is refused, never read as `null`); **§6** — the readout shows every projected column, and the only bound is `skp.projection_too_many_columns` at admission (no display-side subset); **§8 (`describe`)** — each `describe.schema` row carries a kernel-computed `projectable` boolean derived from `admit_attribute_type`, and the panel holds no type logic of its own (no client-side `arrow_type` filter; the kernel's refusal remains the authority). The `describe` addition is a wire field and rides B1's own version bump (§10). Nothing here is code; nothing here changes Document 2.

## Consequences (of the deferral, not of a decision)

Until this is decided: the working canvas styles by literal only; the hover panel shows `id`
only; and the hero slice's "colour by attribute" moment lives in the published bundle rather
than in the shell. Each of those is a named limit, never presented as a product choice.
