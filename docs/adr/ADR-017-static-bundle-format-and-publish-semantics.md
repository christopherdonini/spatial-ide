# ADR-017 — Static Bundle Format and Publish Semantics

**Status:** Proposed — **binds nothing until accepted.** Not architect-blockable. The publish
operation implements this format today because a bundle that is written must have *some* shape, and
writing one down is the only option that lets a third party read it.
**Related:** ADR-008 (static publishing first — Accepted; this is the format that clause names);
ADR-005 (ResourceRef, reproducibility grades — Accepted); ADR-006 (operation classes — Accepted);
ADR-010 rules 1, 2, 5, 6, 7 (Accepted, architect-blockable); ADR-015 (CRS admission — Accepted);
`docs/09`, `docs/11`, `docs/14`.
**Deliberately not cited as authority anywhere below:** ADR-011, ADR-012, ADR-013, ADR-014,
ADR-016. All are Proposed or reserved and bind nothing. ADR-016 is *named* once, as the record of
the identity policy the engine implements, in the same way `engine/` already names it — never as
settled design for persisting identity, which is one of its own OPEN questions and which this format
walks into.
**Implemented by:** `kernel/src/bundle/`, `kernel/src/publish/`, `renderer/src/canonical.rs`,
`renderer/bundle-viewer/`.

## Context

ADR-008 decided that publishing means "a **static interactive bundle**: style + metadata + PMTiles
or partitioned assets, hostable anywhere". It did not say what is in one. A format that only the
program that wrote it can read is not a format, and `docs/14` makes every file format in this project
**open, permanently** — so the bundle gets a written contract rather than a shape that emerges from
an implementation.

This is also **the project's first persisted artifact.** `kernel/README.md` named the trigger in
advance: "The moment this caches a result to disk, names datasets by URI, or emits a bundle,
`docs/11`'s ResourceRef model and ADR-005's grades are owed." That moment is here, and this ADR is
where the three obligations are discharged rather than deferred.

## Decision

### 1. Layout

```text
<bundle>/
  manifest.json              the contract. Canonical JSON. Byte-identical across two publishes
  style.json                 the canonical style document, hash-listed in the manifest
  data/part-00000.arrows     one self-contained Arrow IPC stream per partition
  data/part-00001.arrows     …
  viewer/…                   the viewer's own assets, hash-listed
  build-info.json            wall-clock build facts. NOT hash-listed, NOT verified
```

Partition names are **zero-padded to five digits, contiguous from `00000`, and derived only from the
ordinal** — never from content, a timestamp, or a path. A content-derived name would make the
manifest a function of bytes it is already hashing; a path-derived one would put a filesystem path in
an artifact §8 forbids one in. The width follows from the declared maximum partition count, so
raising that maximum is a **format change** and not a tuning knob.

### 2. Canonical JSON — a declared subset, and the one number grammar

Both `manifest.json` and `style.json` are written in the same canonical form. Two grammars would be
two things to specify, two to re-implement, and two that can drift while looking identical.

- **Encoding** UTF-8, no BOM, no trailing newline. **Whitespace** none outside strings.
- **Object keys** in the **schema-declared fixed order** below. Not a sort: the key sets are closed
  and finite, and "sorted by code unit" would be inherited wording describing nothing. **A writer
  refuses to emit a duplicate key.** A reader built on a general JSON parser will not see one — the
  usual parsers keep the last occurrence — so this binds the writing side and a reader must not rely
  on it.
- **Strings** `"` → `\"`, `\` → `\\`, U+0008 U+0009 U+000A U+000C U+000D → `\b` `\t` `\n` `\f` `\r`,
  every other code point below U+0020 → `\u00xx` with lowercase hex. Nothing else is escaped — not
  `/`, not non-ASCII, which travel as literal UTF-8.
- **Null** `null`. **Booleans** `true` / `false`. **Arrays** `[`, elements separated by `,`, `]`,
  with no whitespace and no trailing comma; an empty array is `[]`. **Objects** likewise with `{`,
  `"key":value` pairs separated by `,`, `}`; an empty object is `{}`.
- **Integers** minimal decimal, leading `-` when negative, never `+`, never a leading zero, never an
  exponent.
- **Doubles** non-finite is **refused**. `-0.0` normalizes to `0.0`. The value is written as the
  **shortest fixed-point decimal with at least one fractional digit that parses back to the identical
  IEEE-754 double** — no exponent, ever. To keep that a promise rather than a coincidence, the
  admissible domain is `0` or `1e-6 ≤ |v| < 1e15`, and a value outside it is **refused** rather than
  written in a form the grammar cannot express.

**This is a declared canonical subset. It is deliberately not RFC 8785 / JCS**, JCS is not
implemented, and nothing in this project may describe it as JCS-conformant.

> **What this document does and does not let an independent implementer reproduce, stated plainly.**
> The canonicalization above, the member tables in §5, the constants in §8 and the ceilings in §16
> are enough to write a **conforming reader** and to **recompute every hash and digest** a bundle
> carries. They are **not** enough to produce a byte-identical `manifest.json` from a different
> implementation, because four members are free English prose whose exact wording this document does
> not fix: `source_verification`, `identity.caveat`, and `reproducibility.basis` /
> `why_not_higher`. §12's determinism guarantee is scoped to one publisher binary for exactly that
> reason. Fixing those strings verbatim here, or moving them to enumerated codes, is a live option
> and is **not** decided in v1.

> **Consequence a writer must handle, stated rather than discovered.** A dataset whose bounds fall in
> `(0, 1e-6)` — sub-micrometre magnitudes — is unpublishable under this grammar, and the current
> implementation discovers that only when the manifest is written, **after** every partition has
> been. Validating bounds before the stream is the obvious fix and is not made here; the behaviour
> today is a typed refusal and a removed staging directory, which is correct but late.

### 3. Versioning, and the unknown-key rule

`bundle_version` and `style_version` are integers. **A conforming reader refuses a version it does
not implement** rather than reading it best-effort, and **refuses an unknown key** in any object this
document defines. Additive evolution proceeds by incrementing the version — which is exactly why §9's
reservations exist in v1 rather than being added later.

> **Status of the unknown-key rule in the reference implementation.** The style reader enforces it on
> both sides (Rust and TypeScript). The manifest reader **enforces it in the reference viewer as of
> this document**, over the objects §5 defines. It is stated as a requirement on *conforming readers*
> rather than as a description of one implementation, because §9's reservation argument depends on
> it: if readers tolerated unknown keys, adding `derived_caches` later would not be a breaking change
> and reserving the slot now would buy nothing but documentation of intent.

### 4. Partition format

| | |
|---|---|
| **Framing** | one complete self-contained **Arrow IPC stream** per partition: schema, one record batch, EOS. Not the file format, no footer |
| **Compression** | **none** |
| **Dictionaries** | **none**; no dictionary batch is written |
| **Schema** | `id` UInt64 non-null · geometry `geoarrow.polygon` as `List<List<FixedSizeList<Float64>[2]>>` non-null · then the declared attribute projection, in declared order, **every one nullable** |
| **Row order** | ascending by the dataset's identity |
| **Boundary rule** | `cut-before-append`, specified in full below |

**Admissible attribute types**, a closed list — everything else is refused rather than converted:
`utf8`, `large_utf8`, `utf8_view`, `boolean`, `int8`, `int16`, `int32`, `int64`, `uint8`, `uint16`,
`uint32`, `uint64`, `float64`. **`float32` and any dictionary-encoded type are refused**: widening
f32 is exact but is still a conversion nobody asked for, and a dictionary *index* is an ordinal.

#### The boundary rule, in full

A partition boundary is a function of the row sequence and three declared constants. There are **two
cut points, not one**, and the quantity compared is an **estimate of in-memory size, not encoded IPC
bytes** — a writer that measured encoded bytes would cut in different places and produce a different,
equally valid-looking bundle with different hashes.

Let `T` = `partition_target_bytes`, `R` = `partition_max_rows` (§16). For a batch accumulating `rows`
rows and `vertices` vertices:

```text
estimate(rows, vertices) = vertices*16 + rows*8 + (rows + vertices)*4 + attribute_bytes
```

where `attribute_bytes` is summed per row over the declared projection: **1 byte for the validity
bit, plus 0 for a null**, or for a non-null value — 1 (bool, 8-bit int), 2 (16-bit int), 4 (32-bit
int), 8 (64-bit int, float64), or the UTF-8 byte length plus 4 (utf8), plus 8 (large_utf8), plus 16
(utf8_view).

For each row, with `incoming = estimate(1, wkb_len/16)` — an integer-divided **over-estimate** of the
row's vertex count taken from the WKB length without parsing it:

1. **Pre-append cut.** If the batch is non-empty and `estimate_so_far + incoming > T`, cut first.
2. Append the row.
3. **Post-append cut.** If `estimate_so_far >= T` or `rows >= R`, cut.

Cutting *before* appending is what keeps an ordinary payload away from the hard batch ceiling: a
single large feature landing on an almost-full batch would otherwise push the total past it and kill
the stream on a limit the payload as a whole never approached.

**A null attribute slot's contents are never read** when computing `attribute_bytes`. Arrow leaves
them unspecified, so reading one would make a partition boundary — and therefore every partition hash
— a function of undefined bytes.

**One partition is exactly one engine batch.** Re-batching in a publisher — concatenating IPC
streams, or assembling a record batch there — would produce partition bytes that never passed
through the engine's single batch constructor, and the ADR-010 rule 1 envelope would then be on each
partition by care rather than by construction.

**Every partition carries the ADR-010 rule 1 envelope** in its schema metadata: `frame`, `crs`,
`crs_source`, `axis_order`, `axis_normalization`, `geometry_encoding`, `coordinate_layout`, the
identity facts, and `attribute_columns`. The repetition per partition is the point — a reader that
starts anywhere is still told what space the coordinates are in.

`attribute_columns` is recorded on the authority of **`docs/11` and `docs/01` principle 8**, *not*
ADR-010 rule 1. Rule 1's tag-on-envelope clause is about coordinate space; citing it for a
projection would enlarge an Accepted, architect-blockable rule by analogy.

**Why compression and dictionaries are absent** is not conservatism: compressed output is a function
of a third-party compressor's version and level, so byte-identical rebuild would become a claim about
someone else's library; and a dictionary index is an ordinal, which is the identity hazard this
project refuses elsewhere. The size consequence is a recorded fact, not a defended trade.

### 5. Manifest schema

Top-level members, in canonical order. Every one is required.

| Member | Contents |
|---|---|
| `bundle_version` | integer, currently `1` |
| `bundle` | ResourceRef for the bundle itself (§6) |
| `source` | ResourceRef for the source dataset (§6) |
| `source_verification` | what was checked about the source, and when (§7) |
| `style` | `{resource: ResourceRef, style_version, match_column}` |
| `software` | engine/kernel/renderer crate versions, the Arrow **version requirement**, the DuckDB library version, `bundle_writer_version`, and a note that these are recorded versions and not a build identity |
| `operation` | the semantic operation as data, plus a digest over it (§8) |
| `crs` | `source`, `source_definition` (the file's own PROJJSON, verbatim, as a string), `display`, `transform`, `crs_source`, `axis_order`, `axis_normalization` |
| `identity` | `id_source`, `id_uniqueness`, `id_verified_rows`, `id_js_exact`, and a `caveat` naming what is *not* established |
| `schema` | every published column: `name`, `arrow_type`, `nullable` |
| `bounds` | `xmin`/`ymin`/`xmax`/`ymax`, the CRS they are in, and `basis` |
| `data` | `rows`, the format declaration of §4, and `partitions`: `path`, `bytes`, `content_hash`, `rows` |
| `viewer` | one entry per viewer asset: `path`, `bytes`, `content_hash` |
| `license` | §10 |
| `reproducibility` | `grade`, `basis`, `why_not_higher` (§11) |
| `derived_caches` | reserved, empty in v1 (§9) |
| `query_surface` | reserved, `available: false` in v1 (§9) |
| `sidecar` | the sidecar's path, and that it is neither hashed nor verified (§12) |

#### Nested objects, in emitted key order

A member list that stops at the top level is not a contract, so every object below is spelled out.
`{state, basis}` is the `Unknown` shape from §6.

| Object | Members, in order |
|---|---|
| ResourceRef | `logical_uri` · `content_hash` (string or `{state, basis}`) · `source_revision` (string or `{state, basis}`) · `locators` (array of `{kind, at}`) · `cache_status` · `portability_policy` |
| `style` | `resource` (ResourceRef) · `style_version` (int) · `match_column` (string or `null`) |
| `software` | `engine_crate_version` · `kernel_crate_version` · `renderer_crate_version` · `arrow_crate_version_requirement` · `duckdb_library_version` · `bundle_writer_version` (int) · `note` |
| `crs` | `source` · `source_definition` (the file's PROJJSON verbatim **as a JSON string**, or `null`) · `display` · `transform` · `crs_source` · `axis_order` · `axis_normalization` |
| `identity` | `id_source` · `id_uniqueness` · `id_verified_rows` (int or `null`) · `id_js_exact` (bool or `null`) · `caveat` |
| `schema[]` | `name` · `arrow_type` · `nullable` (bool) |
| `bounds` | `xmin` · `ymin` · `xmax` · `ymax` (doubles) · `crs` · `basis`. The whole member is `null` when no rows were published |
| `data` | `rows` (int) · `format` · `partitions` (array) |
| `data.format` | `framing` · `compression` · `dictionaries` · `geometry_encoding` · `coordinate_layout` · `partition_target_bytes` (int) · `partition_max_rows` (int) · `partition_boundary_rule` · `max_partitions` (int) |
| `data.partitions[]` | `path` · `bytes` (int) · `content_hash` · `rows` (int) |
| `viewer[]` | `path` · `bytes` (int) · `content_hash`. **`rows` is omitted, not null** — it does not apply |
| `license` | `state`, then by state: `not-declared` → `basis`; `declared-by-source` → `license` · `attribution` (string or `null`) · `redistribution`; `declared-by-operator` → those three plus `by` · `at` |
| `reproducibility` | `grade` · `basis` (array of strings) · `why_not_higher` |
| `query_surface` | `available` (bool) · `reserved_for` |
| `sidecar` | `path` · `hashed` (bool) · `verified` (bool) · `note` |

**Two derivations a reader performs, stated so they are not reverse-engineered:** the **declared
attribute projection** is `schema` with its first two entries (`id`, geometry) dropped, in order; and
**`style.json`'s path** is `style.resource.locators[0].at`, not its `logical_uri`.

**`transform` is `none — rendered in source CRS` in v1, and that is a recorded fact rather than a
placeholder.** No reprojection happens anywhere in this cut.

**The manifest must never carry a render origin.** A render origin is renderer-local state
(ADR-010 rule 1); persisting one would be persisting an untagged renderer-local coordinate, which is
the failure that rule is about. `bounds` are authoritative coordinates in the source CRS, and the
viewer computes its own origin.

**`bounds` are computed over the rows the bundle actually contains** — `basis:
"computed-over-published-rows"` — never lifted from the source's own covering bbox. Under a filter
the source's bbox describes rows the bundle does not have, and a viewer fitted to it opens on a
mostly-empty map that reads as a rendering fault.

### 5a. The style document

`style.json` is hash-listed and a conforming reader must **resolve draw parameters from it to render
at all**, so its schema is normative here rather than living only in an implementation. It uses the
same canonical form as the manifest (§2).

```text
{"style_version":1,
 "layer":{"geometry":"polygon",
   "fill_color":<colour value>, "fill_opacity":<number value>,
   "outline_color":<colour value>, "outline_width":<number value>}}
```

Members in that order; **unknown keys are refused** at every level (§3).

- `style_version` integer, `1` in v1. `layer.geometry` is the string `"polygon"` — v1 styles polygons
  only.
- A **colour** is `#rrggbb`, six lowercase hex digits in canonical form. A **number** is a double
  under §2's grammar: `fill_opacity` in `[0, 1]`, `outline_width` in `[0, 64]`.
- Each of the four properties is **exactly one of**:
  - `{"literal": <value>}`
  - `{"match": {"column": <string>, "cases": [{"when": <string>, "then": <value>}, …],
     "on_null": <value>, "on_unmatched": <value>}}`
- **At most one `match` in the whole document.** A second is refused rather than resolved by
  position. A style with none is legal, and carries no legend.
- `cases` has at least one entry and at most **64**; duplicate `when` values are refused, so
  declaration order is presentation and never precedence. **`when` is a string only** — v1 matches
  text columns, because equality on a float is a wrong-but-plausible trap and a dictionary index is
  an ordinal.
- **`on_null` and `on_unmatched` are required.** Omitting either is an error, not a default: the two
  questions a categorical style always faces are exactly the ones a default answers invisibly.

**Resolution**, which is the part two implementations must agree on:

| Match key | Result |
|---|---|
| a value with a declared case | that case's `then` |
| a value with no declared case | `on_unmatched` |
| **NULL** — a value the source carries, not an absence the reader invented | `on_null` |
| any key, for a property declared `literal` | that literal |

**The legend is a function of the style, not of the data**: one row per declared case in declaration
order, then `on_null`, then `on_unmatched` — whether or not the bundle contains a feature of that
category. Deriving it from the data would make it filter-dependent, so two bundles of one layer at
different viewports would legend differently.

**A reader verifies `style.json`'s hash against the stored bytes and never by re-canonicalizing.**
Re-canonicalizing would test the reader's own serializer rather than the bytes it was given.

### 6. `docs/11` conformance — three ResourceRefs, all six members, named

ADR-005 rewords principle 1 to "everything is an addressable, typed resource" and `docs/11` lists
styles among the typed artifacts. So **three** blocks are owed, not one: the **bundle**, the
**source**, and the **style**. Each carries all six ResourceRef members by name — logical URI,
content hash, source revision, locators, cache status, portability policy.

**Within a ResourceRef, an unknown member is a named state carrying its basis, never a bare null.**
The object is `{"state": <string>, "basis": <string>}`. `null` is ambiguous between "does not apply"
and "known to be none"; a state distinguishes them and says why. This follows `IdUniqueness` and
`axis_normalization = none-performed`.

**This rule is scoped to ResourceRef members and does not generalise across the manifest.** Elsewhere
a bare `null` is used and means "absent", in members whose absence is unambiguous and needs no basis:
`style.match_column`, `crs.source_definition`, `identity.id_verified_rows`, `identity.id_js_exact`,
`bounds`, `license.attribution`, `operation.limit` and `operation.filter.bbox_crs`. Saying so is
cheaper than a reader discovering the exception.

Two members are honestly unknown in v1 and say so:

- **`source_revision` is `none-pinned` for all three.** This engine pins no file revision. The
  source content hash is the only thing tying a bundle's identity space to a byte sequence, and the
  `identity.caveat` says so in the manifest itself.
- **The bundle's own `content_hash` is `not-applicable`** — a manifest cannot contain its own hash.
  A bundle's identity is the ordered per-asset hash list under `data` and `viewer`, plus the style's.

**Logical URIs are `spatial://dataset/<name>` from a *validated* catalog name.** A name carrying a
path separator, a drive letter or `..` is **refused**, not escaped: escaping lets a filesystem path
through in encoded form, which is the same leak wearing percent signs.

### 7. What is checked about the source, and when

The source is **pinned** by an explicit whole-file SHA-256 before publishing; publish re-hashes at
its start and refuses a mismatch. Publishing an unpinned source is refused, because a bundle claiming
a grade on a basis nobody established is a grade claimed and not honored (`docs/01` principle 3).

Pinning is deliberately **not** part of opening a dataset. The argument is about **work**, not about
a cost that was measured: hashing a whole file is a **whole-file read**, opening a dataset is not, and
folding one into the other would make every open — including every viewport query's, which never
publishes anything — do a whole-file read to serve a check only publishing needs. `docs/08`'s
cold-open budget for this class is recorded as unmeasured, and nothing here measures it either. The
caller that needs the check pays for it, at a call site that can be grepped.

**The manifest records only the content hash, and says when it was taken.** A length-and-modification
-time heuristic is re-checked at finalize as a **fail-closed operational guard**; it is not a content
hash, is not recorded beside one, and must not be read as a second hash. A full re-hash at finalize is
deliberately not performed.

### 8. The operation, as data, and a digest over it

Source hash + style hash + software versions cannot reproduce a **filtered** result, so the operation
is part of the reproducibility basis rather than an unrecorded input. The manifest carries the
operation object **verbatim** and a digest beside it: a digest whose input set a reader must guess
cannot be verified.

**Digest input set, in canonical order**, with the values a v1 writer emits:

| # | Member | Value |
|---|---|---|
| 1 | `digest_version` | integer, **`1`** |
| 2 | `operation` | **`"publish-static-bundle"`** |
| 3 | `source_logical_uri` | `spatial://dataset/<name>` |
| 4 | `source_content_hash` | `sha256:<hex>` |
| 5 | `id_source` | e.g. `file:id` or `mapped:<column>` |
| 6 | `id_uniqueness` | e.g. `verified-at-open-full-file` |
| 7 | `id_verified_rows` | integer or `null` |
| 8 | `crs_identifier` | e.g. `EPSG:2056` |
| 9 | `crs_source` | `file` or `caller_asserted` |
| 10 | `axis_order` | e.g. `easting,northing` |
| 11 | `axis_normalization` | **`"none-performed"`** in v1 |
| 12 | `crs_definition_hash` | `sha256:<hex>` of the definition bytes, or `{state, basis}` |
| 13 | `filter` | see below |
| 14 | `limit` | integer or `null` |
| 15 | `projection` | array of `{name, arrow_type, nullable}` in declared order |
| 16 | `ordering` | **`"identity-ascending"`** |
| 17 | `format` | the same object as `data.format`, same members, same order |
| 18 | `style_hash` | `sha256:<hex>` |

`filter` is one of exactly two shapes:

```text
{"kind":"whole-file"}
{"kind":"covering-bbox-intersects","xmin":…,"ymin":…,"xmax":…,"ymax":…,"bbox_crs":<string|null>}
```

**The digest is taken over the canonical serialization of that object with the `digest` member
absent** — stated because a reader would otherwise walk into the self-reference. In the manifest the
same object appears verbatim with `digest` appended as its last member.

Four things about it are decisions rather than details:

- **The filter is named for what it is:** `whole-file`, or `covering-bbox-intersects` with its
  extent and the CRS the extent was expressed in. It is **not** arbitrary SQL and **not** geometric
  intersection, and calling it "the SQL filter" in a published contract would let a reader believe
  the bundle contains features whose *geometry* meets the viewport.
- **`crs_definition_hash` is in the set** because every definition-only dataset shares one
  placeholder identifier, so without it two genuinely different CRS digest identically.
- **The digest is never taken over generated SQL.** The engine's SQL interpolates the source path
  into `read_parquet('<path>')`, so a SQL digest would walk a filesystem path into the manifest —
  a direct §12 redaction failure — and would change whenever the query builder's spelling changed
  without the operation changing.
- **Software versions are outside the digest** and recorded beside it. They affect the bytes; they do
  not affect the *request*. Including them would change the digest on every dependency bump for an
  identical operation. The digest answers "what was asked for"; `software` answers "what executed it".

### 9. Reservations, present in v1 on purpose

Because a reader refuses unknown keys, a format that gained these later would be a breaking change.
Declaring them empty now makes adding either a **fill** rather than a format revision.

- **`derived_caches: []`.** PMTiles is an optional derived display cache and is **not built in this
  cut**. The canonical source of truth is and remains the partitioned query data.
- **`query_surface: {available: false, reserved_for: …}`.** In-browser query (DuckDB-WASM) is
  deferred to v1 by the human's decision. The schema and partition layout above are already
  canonical and are what such a surface would bind to; nothing else about it lands here.

### 10. License and attribution

A **claim carrying its claimant**, in the shape `crs_source` and `id_source` already use, so a
consumer can tell a file fact from an operator's declaration without asking the publisher.

- `not-declared` when neither the source nor the operator declares anything — the honest and common
  case. **No attribution is invented to fill the field.** `docs/14` says published bundles *surface*
  license metadata "when known"; it does not say refuse when absent.
- `declared-by-source` — read verbatim from one named source metadata key. **No license text is
  parsed and no SPDX is interpreted.**
- `declared-by-operator` — with who and when.
- **Source declares *and* operator declares → typed refusal**, on ADR-015 §4's precedent exactly: an
  assertion is admissible only over a source that declares nothing.
- **A declared `redistribution: forbidden` → typed refusal.** A static bundle *is* a redistributed
  copy, and performing a class-3 side effect against a declared no-redistribution term is what
  ADR-006 and `docs/09` gate. An unrecognised redistribution term is `unknown`, never assumed
  permitted.

### 11. Reproducibility grade

**Snapshot**, with its basis stated in the manifest and the reason a higher grade is not claimed
written beside it.

ADR-005's **Exact** requires "immutable, content-hashed inputs **and** pinned software versions". The
inputs are content-hashed but their immutability is not established — nothing here pins a source
revision — and recorded crate versions are not a pinned build identity. ADR-005 also composes a
derived output's grade as the weakest among its inputs, so the manifest states the composition rather
than asserting the conclusion.

### 12. Determinism, precisely scoped

> Given identical **source bytes, style bytes, declared projection, publish parameters and viewer
> asset bytes**, two publishes by the **same publisher binary on the same machine** produce a
> **byte-identical `manifest.json`** and **byte-identical partitions**.

**Not claimed:** across Arrow, DuckDB or toolchain versions; across machines; or for the sidecar.
`software` records what ran so a reader can tell whether two bundles are comparable at all.

**Wall-clock values live in `build-info.json`, a separate file** that is not hash-listed, not
verified, and excluded from the determinism assertion. Its absence must not break a reader.

> **This is a reading of the brief, recorded so it can be corrected at acceptance.** The brief asked
> both for a "separate non-hashed sidecar field" *and* for a byte-identical manifest. A field inside
> `manifest.json` makes the second false. A separate file makes both true. If a field was intended,
> the determinism guarantee has to weaken to "byte-identical modulo the sidecar field", and that
> weakening should be a decision rather than a discovery.

The sidecar's field set is **closed**: build start/end instants, duration, content-hash duration,
total bytes, partition count, row count. It is the highest redaction-risk file in the bundle because
"built by", "built from" and a hostname all want to live there.

### 13. Redaction

**No local filesystem path, username, machine identifier or credential appears anywhere in a
bundle**, including the partitions and the sidecar. Asserted by a scan over every byte of every
emitted file, not by intention.

**Two limits on that guarantee, stated because a grep is a necessary condition and never a
sufficient one.** A match is reported only inside a printable-ASCII run of at least 12 bytes — added
because the drive-letter rule fired on `p:/` and `x:\` from inside a partition's coordinate buffer,
at about the rate arithmetic predicts for a 3-byte pattern over tens of megabytes. So a path
deliberately surrounded by non-printable bytes is not reported, and a short path in a short run is
not either.

### 14. What a conforming reader must verify, and do

Stated as a contract so that third-party readers behave the same way, and so "verified" means
something specific.

**Must verify — each asset before any of its own content is drawn**, not the whole bundle before
anything: a reader is expected to verify and draw partition by partition, which is what makes a
partial bundle report "N of M verified and drawn" rather than nothing at all. The set is: the
manifest parses and its version is implemented; every
asset path is bundle-relative with no `..`, no drive letter, no leading `/`; the style's content hash
and version; and per partition — byte count, **content hash**, decode, row count, the rule 1
envelope's frame, CRS (against the manifest's), axis order and geometry encoding, the declared
`attribute_columns`, and the presence of every declared attribute column.

**Must not claim to verify:** the identity facts (carried, displayed, never re-checked), Arrow types
beyond column names, or its own executing code. A viewer shipped inside a bundle **cannot verify
itself** — the manifest's viewer-asset hashes are for an *external* verifier, and the chain of trust
does not close inside the browser.

**On failure: a named state, a visible signal, and no silently partial map.** Loading stops; what was
already verified and drawn stays; a non-dismissable banner names the state and the asset and says the
map is incomplete. Erasing what was verified would destroy legitimate information while telling the
reader less — ADR-010 rule 5 asks for a visible signal, not erasure. The named states are:
`manifest-unreachable`, `manifest-unparseable`, `manifest-unsupported-version`,
`manifest-schema-invalid`, `style-unparseable`, `style-unsupported-version`, `asset-missing`,
`asset-hash-mismatch`, `partition-byte-count-mismatch`, `partition-decode-failed`,
`partition-row-count-mismatch`, `attribute-schema-mismatch`, `envelope-frame-mismatch`,
`envelope-crs-mismatch`, `envelope-axis-order-mismatch`, `envelope-encoding-mismatch`,
`envelope-attributes-mismatch`, `ceiling-exceeded`, `unhandled-error`.

### 15. Publish semantics

- **Cancellable, progress-reporting, streaming** (`docs/01` principle 7). Cancellation is observed
  through the query engine's own interrupt, per row in the producer, and before and after each
  partition write — so **the uninterruptible window is one partition's encode and write**, bounded by
  the declared partition ceiling. *(That the window is so bounded is a design property; its duration
  is not measured, and no latency figure is claimed.)*
- **Staging directory, then a single rename.** A bundle under the destination name is complete and
  valid or absent, never partial. A cancelled or failed publish removes the staging directory and
  **reports the removal outcome** rather than swallowing it.
- **Re-publish over an existing destination is a typed refusal, not a replace.** Publishing is a
  class-3 external side effect (ADR-006), and `docs/09` gates irreversible actions. A directory swap
  never exposes a *partial* bundle, but its failure mode destroys a previously published artifact as
  a side effect of re-running a command — which is what the gate exists to prevent. A `--replace`
  capability is deliberately **not** in v1; adding one needs an approval gate and a declared
  reversibility class, not a convenience flag.
  - The existence pre-check is TOCTOU and is **not relied on alone** — on POSIX, renaming a directory
    onto an existing *empty* directory succeeds, so the rename's own failure is the second line. The
    residual race between two concurrent publishes to one destination is declared, not closed.
- **Typed refusals** for: destination not writable, insufficient space, source changed under the
  publish, an inadmissible projection, and a style that does not match the dataset or the projection.
  **Insufficient space is detected at write time, never predicted** — the bundle's size is not known
  before the stream is read, and a prediction that can be wrong is worse than a detection that cannot.
- **Reversibility class: `irreversible`**, declared on the operation's own API and recorded here.

> **The approval gate `docs/09` requires does not exist.** "Export and publish are distinct
> capabilities, never implied by write. Class-3 side effects always require approval." This slice has
> no permission model, exactly as `kernel/README.md` already records for capability grants generally.
> The operation declares its class and this ADR records the gap; shipping an ungated class-3
> operation while saying nothing would be the silent version of the same problem. **Owed.**

### 16. Declared ceilings (ADR-010 rule 6), and the behaviour at each

A ceiling with no number is not declared, so the values are here rather than only in the code.

| Side | Ceiling | Value | At the ceiling |
|---|---|---|---|
| Publish | `partition_target_bytes` | **1 MiB** (1 048 576) | a partition is cut (§4) |
| Publish | `partition_max_rows` | **8 192** | a partition is cut (§4) |
| Publish | `max_partitions` | **100 000** | typed refusal naming the ceiling. **This is what fixes the five-digit partition name width in §1**, so changing it is a format change |
| Publish | max published attribute columns | **32** | typed refusal |
| Publish | max viewer assets | **64** | typed refusal |
| Publish | max viewer asset bytes | **16 MiB** | typed refusal |
| Reader | max features | **2 000 000** | `ceiling-exceeded`; the bundle is refused rather than loaded until the tab dies |
| Reader | max partitions | **100 000** | `ceiling-exceeded` |
| Reader | max resident bytes | **512 MiB** | `ceiling-exceeded` |
| Reader | max attribute columns | **32** | `ceiling-exceeded` |

`partition_target_bytes` must stay below the writer's hard per-batch ceiling, or the partition policy
would be asking for batches the producer refuses to build; in the reference implementation that
relationship is a compile-time assertion.

**Picking in the reference viewer is exact point-in-polygon containment on authoritative f64, with
no pixel tolerance.** Two consequences are declared rather than discovered: there is **no pick radius
and no style dependence**, so ADR-010 rule 6's **2.27 px** discrimination figure **does not apply
here** and must not be carried across — it measures a styled deck.gl point symbol at 1:500 on one
GPU, a different mechanism; and rule 6's 24-bit pick ceiling does not apply either, because nothing
here encodes an index into a colour. The honest cost of zero tolerance: **a feature whose on-screen
footprint is smaller than a pixel is effectively unhoverable**, and nothing snaps to the nearest
feature.

Overlap resolves by **draw order** — partitions in manifest order, features in array order, last
drawn winning, which given §4's ordering means the **highest id wins** — and the pick search runs
backwards through the identical order. Fill and hit test both apply **even-odd per feature**, so an
interior ring reads as a hole in both regardless of winding, which the engine does not guarantee.

## Consequences

- **ADR-008's two stated Consequences are both unmet by this cut**, and naming both is what makes
  this honest rather than partial. "The web publishing canvas (ADR-003) renders these bundles" — the
  reference viewer is a **projected 2D canvas**, not MapLibre and not deck.gl; that is the subject of
  the separate, unapplied ADR-003 amendment proposal. "DuckDB-WASM keeps them queryable in the
  browser" — deferred to v1 by the human's decision, with only the surface reserved.
- **`kernel/README.md`'s "no persistence" clause is discharged, not deleted.** It named this exact
  trigger; §6 and §11 are the discharge.
- **The manifest is JSON metadata; the partitions are binary.** This respects ADR-004's "no JSON on
  data hot paths" — the prohibition is on the *data* path, and a reader that mistook a JSON manifest
  for a data-plane violation would be reading the rule one level too high.
- **A bundle persists feature identity while the question of identity stability across reopen is
  unsettled.** The manifest records what is and is not established about it and claims no more.
- **`docs/14` is satisfied for the format itself** — this document is the open specification — and
  **ADR-009 is not triggered** by publishing a bundle to a directory. But viewer code embedded in a
  distributed bundle *is* distributed code, and its licensing is ADR-009's question, unsettled here.

## What this ADR does not decide

- **PMTiles or any derived display cache**, beyond reserving the slot.
- **In-browser query**, beyond reserving the surface.
- **Reprojection**, at publish time or anywhere else.
- **Upload, hosting, access control, or a managed sharing service** — ADR-008 places all of these
  outside this phase.
- **Incremental republish, bundle deletion, or revocation.** Nothing here can update a bundle in
  place, and nothing here can withdraw one that has been distributed.
- **The approval gate for a class-3 publish** (§15). Owed.
- **Whether a bundle should be signed**, and by what. Content hashes establish integrity against
  accidental corruption; they establish nothing against a party who can rewrite the manifest too.
- **Anything about macOS or Linux**, and **any performance number**. This cut measures nothing.
