> **Design reference, not Authority.** Copied on 2026-09-29 from the human's prototype folder outside the repository (`prototype/RESEARCH-BATCHES-11-13.md`; sha256 f962a21cc3be4d0e8a4a2c691c1b447deb8edaf26746791d24f561b5e9e4c57b of the source bytes), on the human's instruction (`state/directives/2026-09-29-design-references-and-layer-ruling.md`, items 1 and 2). It is design discussion for the Map studio direction (PLAN node `shell-redesign-map-studio`): it rules nothing, authorises no work, and no piece cites it as Authority. Two mechanical transformations were applied to the source bytes, in this order, and nothing else changed: (a) each link whose target is a file tracked with it in `state/drafts/design/` was made relative: the text between the link's angle brackets, `%USERPROFILE%/Development/Claude/Spatial IDE/prototype/<file>` in the source with the profile root spelled out, became `./<file>` (0 links in this file); (b) `node scripts/hooks/profile-path-scan.mjs --redact` was run over the result, replacing each remaining profile root with `%USERPROFILE%` (0 in this file). Everything below this header is the source after (a) and (b).

# Spatial IDE — research batches 11–13: layers without hidden semantics

Prepared: 26 September 2026. Updated: 27 September 2026. Status: Batches 11–13 reviewed with corrections, including the complete Batch 12 contract and Batch 13 proposals. Candidate policies await architect/product ruling. Design research only, not implementation authority.

Companion to [the design notebook](./SPATIAL-IDE-DESIGN-NOTEBOOK.md). The v7 structural freeze, O-07 workflow walkthrough and minimum-shell migration remain unchanged. No prototype or repository changes accompany this document.

## Purpose and use

Christopher proposed borrowing adjustment layers, clipping masks, layer comps, blending groups, Smart Objects and versioned layers from creative tools. Research the interaction benefits without importing hidden changes of analytical scope.

The questions are: what changes only the picture, what changes the query/result, what persists, and which owner can attest to the result? Existing GIS features are precedents, not proof of our implementation cost or tutorial-demonstrated demand.

Run **11 first**, then 12 and 13 separately. Keep earlier sources; deselect them for each extraction, or create one notebook per batch. Reused pages are intentional, with different sections in scope. Do not load all three batches into one active evidence set.

Each batch has a plain URL block and two short prompts. Send A first, then B. If an import only captures navigation, a landing page or an unavailable video, mark it unavailable; do not infer its content. Official documentation is the evidence for contracts; demonstrations can be added later for usability.

Version policy: QGIS links deliberately target 3.44, not “latest”. Esri, Adobe, Iceberg and Dolt links may change. Record the version/date actually stated, or “unstated”; do not infer product version from this file's date. The Adobe layer-comps page is an older official reference (page dated 2019), useful for the interaction and limitations, not proof of current UI layout.

## Batch 11 — Visual masks, blending and group scope

**Decision:** how can users combine appearances without accidentally changing their data, query scope or export promise?

### Sources and scope

| Source | Read only / focus |
| --- | --- |
| QGIS 3.44, General Tools | “Interact with groups and layers” and “Control layers rendering through grouping”: compositing boundaries and order. |
| ArcGIS Pro, Clip layers in a map | Drawing versus query/analysis scope; clipping inputs and excluded layers. |
| Adobe Photoshop, Reveal layers with clipping masks | Base layer, membership, reordering and visible scope indicators. |
| Adobe Learn, Edit a single layer with adjustment layers | Restricting an adjustment's target. Use the available written explanation; do not claim to have watched an inaccessible video. |

Copy these URLs:

```text
https://docs.qgis.org/3.44/en/docs/user_manual/introduction/general_tools.html
https://doc.esri.com/en/arcgis-pro/latest/help/mapping/properties/clip-layers-in-a-map.html
https://helpx.adobe.com/photoshop/using/revealing-layers-clipping-masks.html
https://www.adobe.com/learn/photoshop/web/limit-adjustment-layers
```

### Prompt A — evidence

```text
Batch 11: use only the four selected sources. Confirm availability and stated versions/dates. Compare QGIS compositing groups, ArcGIS map clipping and Photoshop clipping/adjustment scope. Table: user action; affected layers; effect of reorder/group membership; changes to drawing, source geometry, table/query and export; stored state; limitations. Cite a section for every supported claim. Mark unstated behaviour UNKNOWN. Distinguish visual clipping from geometric Clip/Intersect, and rendered colours from numerical data processing. Do not infer speed, privacy or rollback from a visual example. No Spatial IDE recommendations yet.
```

### Prompt B — proposals

```text
From Batch 11, propose a Spatial IDE contract for visual masks and compositing groups. Label evidence, inference and proposal separately. Separate draw order, group membership, query scope and explicit analysis dependencies. Who owns mask geometry, picking/table policy and publish inclusion? Give three tests: reorder without changing analysis input; inspect/export a visually hidden feature; remove or invalidate a mask source. Explain what UI must label, which dependencies are real, and what remains unknown. Keep v7 frozen: suggest only cheap architectural boundaries, not a new renderer or implementation plan.
```

### Questions to settle after extraction

- Does “mask” affect only pixels, or also hit-testing? If hit-testing follows visibility, can the table still inspect the underlying records? Name both policies.
- Is a group merely a folder or an isolated compositing unit? Can users see the difference?
- What happens to a stale/missing mask? Proposed conservative behaviour: show a named unavailable state, not silently remove the mask.
- Exporting data, exporting a picture and publishing a bundle are distinct operations. Which actually excludes hidden data?
- Can a named mask reference remain stable when the layer is reordered? If membership changes its visual scope, is that change explicit and reversible?

A visual mask is not an access-control mechanism. A future publishing workflow needs its own data-inclusion and permission checks, regardless of how convincing the preview looks.

## Batch 12 — Live derived layers and reusable submodels

**Decision:** when should an effect remain a visual preview, become a queryable derived layer, or be materialized as an artifact?

### Sources and scope

| Source | Read only / focus |
| --- | --- |
| QGIS 3.44, Symbol Selector | “The Geometry Generator”; distinguish rendered geometry from source features. |
| ArcGIS Pro, Raster function template | Chained functions, inputs, public variables, reuse and outputs. |
| ArcGIS Pro, List of raster functions | Introductory local/global execution distinction; not an inventory of every algorithm. |
| QGIS 3.44, Model Designer | Explicit inputs/outputs, reuse of models, dependencies and editing connections. |
| Adobe Photoshop, Smart Objects overview | Linked versus embedded content, shared instances and stated limitations. |

Copy these URLs:

```text
https://docs.qgis.org/3.44/en/docs/user_manual/style_library/symbol_selector.html
https://doc.esri.com/en/arcgis-pro/latest/help/analysis/raster-functions/raster-function-template.html
https://doc.esri.com/en/arcgis-pro/latest/help/analysis/raster-functions/list-of-raster-functions.html
https://documentation.qgis.org/3.44/en/docs/user_manual/processing/modeler.html
https://helpx.adobe.com/photoshop/desktop/create-manage-layers/smart-objects/smart-objects-overview-and-benefits.html
```

### Prompt A — evidence

```text
Batch 12: use only the five selected sources. Confirm availability and versions/dates. Compare QGIS geometry generators/models, ArcGIS raster-function chains and Photoshop Smart Objects. For each: inputs, saved parameters, output kind, execution trigger, source preservation, linked/embedded dependencies, reuse, materialization and stated limits. Separate display-only geometry from queryable derived data; distinguish local from global processing. Cite sections, label UNKNOWNs, and do not infer instant execution, coherent snapshots or unlimited caching. Ignore unrelated manual sections. No architecture recommendations yet.
```

### Prompt B — proposals

```text
Propose a minimal future Spatial IDE derived-layer contract, not code. Use explicit inputs/parameters, not accidental stack order. Distinguish visual preview, queryable derived result and materialized artifact. Name owners for CRS/units, feature lineage, cache invalidation, cancellation and completeness. Explain how a nested workflow exposes inputs/outputs without creating another execution engine. Give three tests: offscreen geometry whose buffer enters view; changed upstream schema/revision; cancel or edit parameters before an older result returns. Mark proposals versus evidence. Raster and Workflow IR remain future work; no v7 expansion.
```

### Questions to settle after extraction

- For “Buffer roads by 50 m”, is the input a whole resource, a filtered view, selected members, or a saved rule? Is that target pinned?
- Is distance planar or geodesic, in which CRS/units, and with which tolerance and dissolve policy? Rendering an outline is not proof of a correct metric buffer.
- Which outside-viewport inputs contribute to the displayed result? Local effects may need a halo; global algorithms cannot be assumed to use only visible features.
- What does a derived feature identify after splitting, dissolving or aggregating source features? Source identity and derived identity cannot simply be equated.
- What does a cached result depend on: source revision, query, parameters, schema, CRS, implementation version, requested resolution/coverage? A cached viewport preview is not a full analytical result.
- Is a submodel linked to a mutable definition or pinned to a version? Can it be used when its original project is unavailable?
- Are stale results retained visibly, hidden, or replaced? Do not silently serve a prior parameter set as current.

**Preliminary architecture preference:** reuse the future Workflow IR rather than introduce a “layer effects” execution engine. The UI may show a derived output as one expandable layer; execution ownership remains with the engine. This is a proposal, not a new accepted capability.

## Batch 13 — Presentation presets, scenarios and data revision history

**Decision:** what exactly does a saved layer state restore, and which meaning of “time” does a timeline expose?

### Sources and scope

| Source | Read only / focus |
| --- | --- |
| QGIS 3.44, General Tools | “Configuring map themes”: saved contents and references to named styles. |
| Adobe Photoshop, Layer comps | Captured state and warnings when restoration is no longer possible. |
| QGIS 3.44, 2D Map View | Temporal controller only: time ranges over temporal layers/features. |
| Apache Iceberg, Maintenance | Snapshot expiration, retained data and time-travel availability. |
| Dolt, Querying database history | Commit-based snapshots, AS OF, historical view definitions and working-set boundaries. |

Copy these URLs:

```text
https://docs.qgis.org/3.44/en/docs/user_manual/introduction/general_tools.html
https://helpx.adobe.com/ca/photoshop/using/layer-comps.html
https://docs.qgis.org/3.44/en/docs/user_manual/map_views/map_view.html
https://iceberg.apache.org/docs/latest/maintenance/
https://www.dolthub.com/docs/sql-reference/version-control/querying-history/
```

### Prompt A — evidence

```text
Batch 13: use only the five selected sources. Confirm availability and versions/dates. Compare map themes/layer comps, temporal filtering, Iceberg snapshots and Dolt history. Table: what is saved; copied value or mutable reference; unit of revision; time meaning; restore/query behaviour; missing dependencies; retention limits. Check style references, expired snapshots, uncommitted changes and historical view definitions specifically. Cite sections and mark UNKNOWNs. Do not equate observation time with commit time, a display preset with a data snapshot, or versioning with infinite undo. Do not select a database for Spatial IDE.
```

### Prompt B — proposals

```text
For Spatial IDE, distinguish: presentation preset; analytical scenario with parameters/data revisions; observation-time filter; data-revision history; workspace undo. What must each pin, retain and validate? Propose UI labels and owner boundaries, not storage adoption. Give three tests: referenced style changes; a multi-layer scenario loses one retained revision; late-arriving data has an old observation date but a new commit. Explain whether restore is exact, recomputed or unavailable. Keep Save/reference and Prepare/verified distinct. Identify the smallest seam now and what must wait; no v7 implementation.
```

### Questions to settle after extraction

- Should a presentation preset keep following a shared style or freeze its values? Both can be useful; they are different promises.
- A source path is not a retained revision. Where do the recipe, model version, source artifacts and algorithm environment needed for replay live?
- What does “two hours ago” mean: observation time, source commit time, workspace checkpoint time, or ingestion time? Corrections can change historical observations later.
- Is a multi-layer scenario merely a declared set of pinned revisions, or must those inputs satisfy an additional cross-source consistency rule?
- What happens after retention expiry or permission loss? “Unavailable” is more honest than silently substituting the latest data.
- Can a historical query use today's derived-view definition over old rows? Historical data alone need not reproduce the historical analysis.
- What identity and geometry rules support meaningful diffs through feature splits/merges? A fast colour overlay is not necessarily a correct change analysis.

No adoption of Iceberg or Dolt is proposed. They are contrasting evidence sources. Content hashes, revision catalogs, commit graphs and temporal attributes solve different parts of the problem; none alone implements coherent capture, indefinite retention, project undo or fast spatial diffs.

## Preliminary findings already checked, not a substitute for extraction

- QGIS already has compositing groups and map themes. Its map themes reference named styles rather than freezing every property. [General Tools](https://docs.qgis.org/3.44/en/docs/user_manual/introduction/general_tools.html)
- ArcGIS map clipping restricts drawing while leaving underlying data usable in queries/analysis. [Clip layers](https://doc.esri.com/en/arcgis-pro/latest/help/mapping/properties/clip-layers-in-a-map.html)
- QGIS geometry generators create render-time geometry. ArcGIS distinguishes local raster functions from global work over a specified extent/resolution. Neither is a universal speed guarantee. [Geometry generator](https://docs.qgis.org/3.44/en/docs/user_manual/style_library/symbol_selector.html), [raster functions](https://doc.esri.com/en/arcgis-pro/latest/help/analysis/raster-functions/list-of-raster-functions.html)
- Iceberg snapshot expiration removes historical availability. Dolt history uses Dolt commits, not every SQL transaction; its documented historical-view caveat distinguishes old rows from old view definitions. [Iceberg maintenance](https://iceberg.apache.org/docs/latest/maintenance/), [Dolt history](https://www.dolthub.com/docs/sql-reference/version-control/querying-history/)

## Return format and stopping rule

Return each batch separately:

1. Available sources and their stated versions.
2. Up to eight supported findings with source/section citations.
3. Unknowns or contradictions; no filling gaps from remembered behaviour.
4. At most three candidate contracts, with an owner and implementation band.
5. Three Given/When/Then tests.
6. One decision this evidence can resolve, or “insufficient evidence”.

A proposal must not cite a source as if that source mandates Spatial IDE behaviour. If a question requires renderer benchmarking, engine code review or a usability session, say so; documentation extraction cannot replace it.

After each result, update the living notebook with corrections and remaining choices. Continue only where a concrete unresolved question remains. These batches do not block O-07, justify another prototype version or authorize a storage/renderer rewrite.

## Reviewed results — 27 September 2026

The first delivery contained Batch 11 and Batch 12 evidence with a truncated contract. A later attachment on 27 September supplied the full Batch 12 contract plus Batch 13 evidence and proposals. The continuation reviews below supersede the earlier pending status. Repeated Batch 13 answers and copied NotebookLM interface text are one submitted research package, not independent corroboration.

Version provenance: QGIS's 3.44 version is directly visible in the checked pages. Other version/date labels in the submitted report remain attributed to that report unless independently visible; a retrieved “latest” page is not an immutable 3.7 citation. No source extraction was independently repeated in NotebookLM, and no application behaviour was tested here.

### Batch 11 — retain the distinction, narrow the guarantees

Supported core: visual composition and analytical data scope are different concepts. QGIS documents isolated group rendering and blend clipping. Esri explicitly distinguishes map clipping from query/analysis availability. Photoshop documents clipping membership and base-layer transparency. These observations justify research into clear scope, not a particular GPU architecture.

| Report claim | Review and correction |
| --- | --- |
| Compositing settings are stored in “project file or layer styles/map themes”. | Do not treat these as interchangeable serialization containers. QGIS themes reference named styles; the cited section does not establish round-trip persistence of every group/mask setting in every format. Persistence/export compatibility needs a specific check. |
| A removed outline source leaves a cached bounding box or the mask is cleared. | Esri's outline mode uses a retained static clipping definition; this is not evidence for substituting a bounding box, automatically clearing, or reporting a missing live dependency. Other clipping modes update dynamically. The report's Test 3 is not a documented Esri guarantee. |
| Visual masking must be a downstream render pass with “zero dependency” on queries. | Semantic independence does not prove physical execution order. A renderer may use conservative query culling while preserving results. Explicit “select within this boundary” can intentionally use that geometry; a display mask must not silently introduce that scope. |
| Picking/table policy always queries full geometries. | Split visible map hit-testing from explicit table/query scope. “No geometry alteration” does not specify which invisible object should receive a click. Existing predicates, selected scope and access restrictions must still apply. |
| Raw-vector publishing preserves all unclipped data. | This must not become a default. Publication includes its explicitly approved scope, not an automatic full-source fallback. A visual mask alone neither authorizes inclusion nor guarantees exclusion of hidden data. |
| Reorder gives identical unordered geometry arrays, no rerun and unchanged results. | The documents do not establish array ordering, scheduling or cache guarantees. Test unchanged analytical bindings/parameters/revisions instead; independently measure redundant computation if relevant. |
| Clip/Intersect necessarily write new datasets to disk. | Geometry-result semantics and storage are separate. QGIS Clip supports temporary, file and database outputs. This is a supplemental source checked during review, not one of the original four. |

Sources: [QGIS groups, blend modes and themes](https://docs.qgis.org/3.44/en/docs/user_manual/introduction/general_tools.html), [ArcGIS clipping modes](https://doc.esri.com/en/arcgis-pro/latest/help/mapping/properties/clip-layers-in-a-map.html), [Photoshop clipping masks](https://helpx.adobe.com/photoshop/using/revealing-layers-clipping-masks.html), [QGIS Clip outputs — supplemental](https://docs.qgis.org/3.44/en/docs/user_manual/processing_algs/qgis/vectoroverlay.html#clip).

Other wording correction: Photoshop's release behaviour concerns the affected clipping-mask members, not indiscriminately every higher layer in the document. Detailed project-file persistence, every export format and GPU/cache behaviour remain unverified here.

#### Candidate ownership and failure rules — not accepted policy

1. **Presentation owner:** records target view IDs, mask definition/reference, composition order and whether the boundary is captured or live. This is a semantic description, not a mandate for a new render-pass abstraction.
2. **Resource/geometry owner:** validates and resolves referenced geometry, CRS and relevant revision/generation. The canvas is not a new authority for source identity. A captured boundary is independent only if the required geometry/definition is actually retained; a cache entry is not automatically a durable snapshot.
3. **Interaction/query owner:** normally limits map hit-testing to visible, pickable content; offers explicit scoped table/query access independently. This visible-picking preference is our proposal, not something the four sources prove. Hidden selected members need counts/labels rather than silent deletion.
4. **Publish owner:** previews and validates the actual dataset scope and supported visual effects. An unsupported mask in a target viewer should be named, not silently dropped while claiming equivalent publication.
5. **Missing live dependency:** suspend the affected masked rendering with a named condition rather than silently unmask or approximate the shape. A user may explicitly capture/pin a boundary or remove the mask. If a captured boundary was already retained independently, deleting the originating layer does not itself make that captured definition unavailable.

This replaces the report's “fallback or clear” ambiguity. It does not establish a privacy boundary: data authorization and output inclusion still require independent enforcement.

#### Revised Batch 11 tests

- **Reorder:** Given an analysis bound to resource revision R and scope S, reordering a displayed view changes composition but not the analytical input reference, predicate or parameters. Do not assert a particular memory layout or scheduling strategy.
- **Hidden records:** Given an authorized layer with an existing filter and a display mask, a whole-filtered-layer table/query retains its declared scope. A visible-map click follows the declared picking policy. Export Selection exports that selection; whole-layer export requires that explicit scope. No mask automatically enlarges either.
- **Mask lifetime:** Given a captured polygon with a hole and, separately, a live reference to that source, delete/invalidate the source. The captured definition remains usable if retained; the live dependency produces a named unavailable state. Neither silently becomes a rectangle or disappears. Publishing cannot claim the unresolved composition was faithfully reproduced.

### Batch 12 — initial evidence review

Useful distinction: QGIS geometry generators produce geometry for symbol rendering, while processing models compose operations. Raster-function templates record parameterized processing chains. Smart Objects provide linked/embedded references and non-destructive editing precedents. None proves coherent source capture or guarantees queryability, persistence and side effects for every possible operation.

| Report claim | Review and correction |
| --- | --- |
| Every Model Designer workflow preserves its inputs and only creates outputs. | Too broad. The model documentation discusses sequencing SQL and database imports, including dependencies without an output edge. Effect policy must come from each operation, not the fact that it sits in a graph. |
| Queryable derived data is necessarily materialized. | Queryable, computed-on-demand, cached and durably stored are separate properties. Do not make a disk export a prerequisite for a future virtual derived layer, nor assume that any display expression is already a queryable layer. |
| Global raster functions process the full raster extent. | The source says specified extent and resolution. That is not necessarily the entire source raster, and it does not prove a universal blocking or streaming strategy. |
| All local functions use only visible pixels; expensive functions impede performance unless cached. | Avoid both absolutes. Required neighbourhoods and dependencies are function-specific. The source describes caching as an optimization for potentially expensive work, not a necessary or sufficient performance guarantee. |
| Every temporary output is an in-memory layer; every Smart Object is a particular display-cache representation. | Provider/backing and persistence need their own evidence. The Adobe cache discussion specifically describes linked-object limitations; do not generalize its storage details to all objects. |
| Preserved source quality means lossless output under arbitrary transformations. | Preserving editable originals is not a promise of unlimited detail or lossless final rasterization. Do not transfer that creative-tool phrasing into GIS precision guarantees. |
| Geometry-generator complexity is a documented performance bound. | The cited section describes render-time expressions, not a benchmark or latency ceiling. Keep performance risk as an inference requiring measurement. Generated-shape picking remains unknown. |

Sources: [QGIS Geometry Generator](https://docs.qgis.org/3.44/en/docs/user_manual/style_library/symbol_selector.html#the-geometry-generator), [QGIS Model Designer — dependencies](https://docs.qgis.org/3.44/en/docs/user_manual/processing/modeler.html), [ArcGIS raster-function types and caching](https://doc.esri.com/en/arcgis-pro/latest/help/analysis/raster-functions/list-of-raster-functions.html), [raster-function templates](https://doc.esri.com/en/arcgis-pro/latest/help/analysis/raster-functions/raster-function-template.html), [Adobe Smart Objects](https://helpx.adobe.com/photoshop/desktop/create-manage-layers/smart-objects/smart-objects-overview-and-benefits.html).

#### A better candidate model than three “execution states”

These are independent questions, not a new mandatory wire schema:

| Question | Candidate distinctions |
| --- | --- |
| What does the operation mean? | Presentation effect versus queryable analytical result |
| When does it compute? | On demand, explicit job, or reuse of a valid cached result |
| Where does the result live? | Ephemeral evaluation, memory/disk cache, retained artifact |
| What does it cover? | Declared extent/resolution/members; complete, partial or unknown |
| What did it change? | Read-only computation, derived-output creation, or an explicitly approved mutation |
| What is it bound to? | Input identities/revisions, parameters, schema/CRS and relevant implementation version |

A queryable result can be temporary or persistent. A retained artifact can still cover only a declared subset. A display cache is not thereby a Prepare artifact. A named “derived layer” does not automatically acquire deterministic replay or stable output feature identities.

Recommended future UX: editable parameters and named inputs; a clear bounded preview; separate commands to expose a queryable derived view and to materialize/publish an output. This is a direction to evaluate, not a requirement to offer all three for every algorithm.

Three proposed acceptance examples recorded before the contract continuation arrived:

- **Offscreen contribution:** a source feature outside the viewport has a metric buffer that intersects it. The preview includes that contribution or explicitly declares its coverage limitation; tests state CRS/units and tolerance.
- **Changed dependency:** an upstream schema/revision changes while a derived view exists. It becomes invalid/stale by the owning contract; it does not silently bind the same field name or cached result to a new meaning.
- **Late work:** parameters change or cancellation occurs while work runs. An older result cannot become the current view. Any durable artifact already installed remains recorded by its owner, following Batch 9 rather than disappearing from the outcome record.

### Batch 12 — complete contract review

Keep explicit dependencies, editable parameters and reuse of the existing future workflow execution path. Do not accept the proposed schema or owner names as already required architecture.

| Contract clause | Correction / proposed replacement |
| --- | --- |
| Three mutually exclusive execution states; every materialized artifact is immutable. | Keep the independent axes above. A persisted file is not inherently protected from modification; an immutable artifact needs an enforced lifecycle. A derived result can be virtual or backed by stored data. |
| “QGIS Model Exports §23.5.4” proves data materialization. | That section is Editing a model. Model export elsewhere means a script or diagram; it does not establish immutable dataset capture. Data output is controlled by the chosen algorithms and destinations. |
| Geometry generators imply analytical input selection by visual stack order. | Symbol composition order and expression dependencies are different. The generator documentation does not establish that rearranging dataset layers retargets expressions. Keep explicit input references as our design choice, not a correction of a documented QGIS rule. |
| source_layer_ids alone bind analytical inputs. | Layer/view IDs alone omit resource identity, relevant revision/generation and scope. Bind to the resolved input and predicate/selection policy; parameter provenance should distinguish explicit values, defaults and references. A boolean altered flag is only a UI technique. |
| Five new managers/registries follow from the evidence. | The responsibilities are useful; the component architecture is speculative. Map them to existing/future owners when designed. Photoshop links do not prove feature-level lineage, and valid sink schemas do not prove complete spatial coverage. Keep outcome, completeness and committed effects separate. |
| Parameter edits create a new source generation and immediately run another job. | Distinguish source/session generation from operation ID and parameter/draft revision. Cancellation is cooperative; scheduling can debounce/coalesce and respect backpressure. An old result must fail the current binding check even if cancellation is late. |

References: [QGIS model saving/export/editing](https://docs.qgis.org/3.44/en/docs/user_manual/processing/modeler.html), [Geometry Generator](https://docs.qgis.org/3.44/en/docs/user_manual/style_library/symbol_selector.html#the-geometry-generator).

Evidence hygiene: the contract imports ToolValidator, QGIS Tasks and QgsFeatureSink from other batches. Those may be explicit cross-batch references, but they are not evidence extracted from the five selected Batch 12 sources. Their earlier reviewed limitations still apply. No source cited here establishes automatic schema-change detection, a particular spatial index, universal feature lineage or an immediate scheduler.

Minimum future contract to discuss, not a wire-format proposal:

- A stable operation reference and resolved input bindings, including their scope and relevant source identities.
- Typed parameters with units/CRS semantics and a clear point of explicit commit; no automatic reprojection chosen merely to make an operation run.
- Declared output capabilities, coverage/quality, identity/lineage guarantees and effect class. Lineage may be many-to-many or unavailable; the UI must not invent it.
- Results bound to the invocation's inputs and parameter revision. Source changes invalidate by the existing owner contract, not a new frontend source authority.
- Materialization through an explicit output operation. Protected capture/installation, hash binding and retention are additional guarantees, not consequences of writing a file.

The nested-workflow proposal is directionally sound: expose a child's declared inputs/outputs through the planned Workflow IR and existing execution ownership. A single semantic execution path does not mean one worker thread or require a new central DAG service now.

Test corrections:

1. **Offscreen buffer:** use a fixture whose entire source geometry is outside the viewport while its correctly defined buffer intersects it; a centroid outside is insufficient. Assert result coverage and declared identification semantics, not the existence of a derived bounding-box index.
2. **Source/schema change:** once the owning subsystem reports/adopts R2, no R1 result may claim validity for R2. Refuse or require explicit remapping for a missing field. Do not imply the current descriptor/watch strategy detects every external byte edit.
3. **Parameter edit:** bind results to both source generation and operation/parameter revision. Superseded output cannot update the current view; cooperative cancellation does not erase a durable artifact already installed. Immediate restart is not an acceptance requirement.

### Batch 13 — evidence and proposals reviewed

Supported takeaways: presentation presets differ from retained source revisions; temporal filtering is distinct from version-history lookup; retained data alone may not retain the historical analysis definition. The report's five-way distinction is useful, but several proposed contracts conflict with the prior Spatial IDE design.

#### Source corrections and unknowns

- **Versions:** the Adobe page gives a November 2019 update date and mentions Photoshop CC (2014); that does not establish version 21.0. Do not infer a tested release from dates/copyrights or a current documentation navigation version. QGIS 3.44 is directly identified. [Adobe layer comps](https://helpx.adobe.com/ca/photoshop/using/layer-comps.html)
- **Map themes:** mutable style references are documented. Exact behaviour after a missing layer/style and every persistence format are not established by the cited theme paragraph. Following styles is a precedent, not a mandatory choice for our presets. [QGIS map themes](https://docs.qgis.org/3.44/en/docs/user_manual/introduction/general_tools.html)
- **Temporal meaning:** QGIS uses configured layer time values/ranges. These may represent observation, validity or another domain time; the controller does not certify real-world event meaning. The cited section does not establish the claimed uncommitted-edit behaviour. Disabling temporal filtering does not remove unrelated filters or visibility rules. [Temporal controller](https://docs.qgis.org/3.44/en/docs/user_manual/map_views/map_view.html#the-temporal-controller-panel)
- **Retention:** Iceberg expiration removes historical availability and cleans files no longer retained by snapshots. It does not establish a universal fixed history length. Orphan cleanup must allow for in-progress writes; the maintenance guide explicitly warns that too-short retention can corrupt a table. Never translate this into “delete untracked files immediately”. [Iceberg maintenance](https://iceberg.apache.org/docs/latest/maintenance/)
- **Dolt:** the report correctly distinguishes Dolt commits from SQL transactions and historical rows from historical view definitions. Commit metadata should not be promoted into a guaranteed real-world event clock, nor a commit's existence into proof that every dependency remains readable and a whole project can be reproduced. [Dolt history](https://www.dolthub.com/docs/sql-reference/version-control/querying-history/)

#### Preserve the existing product meanings

**Save/reference is not merely saving UI names.** Under the recorded design it stores the workspace recipe, source references/identity hints and semantic settings without requiring a whole-file preparation scan. It does not silently switch source revisions.

**Prepare/verified is not ordinary validation.** It obtains or binds to a coherently acquired, retained immutable artifact under the previously discussed capture/protection contract. Schema checks, parameter validation and authorization are separate prerequisites to operations; they do not substitute for coherent data acquisition. Merely finding a hash or running a license check cannot prepare mutable data.

**Workspace history is not the future feature-edit transaction buffer.** A rule that Save clears workspace history is neither established by these sources nor accepted for this project. Keep workspace checkpoints, feature-edit undo and operation/audit records separate. Session-only history remains the prototype position; persistent/long-retention history is future design, not an automatic unlimited promise.

**Exact restore is not identical to exact recomputation.** Reopening a retained data state, applying saved settings and rerunning a workflow have different guarantees. Repeatable analysis may also depend on operation versions, CRS transforms/grids, numeric policy and other declared inputs. A missing input must be reported; a retained prior output can be viewed as such without claiming the scenario was rerun.

#### Candidate user-facing taxonomy

| Surface | What it means | Important choice / boundary |
| --- | --- | --- |
| View preset | Apply named visibility and style settings to specified views. | Explicitly follow a shared style or preserve a captured/versioned style. Keep panel layout preferences separate from semantic workspace state. |
| Scenario | Compare a declared combination of inputs, parameters and analytical settings. | May reuse a retained output or recompute a compatible workflow. Needs a coherent policy across all input revisions; no automatic substitution of latest. |
| Time filter | Restrict a view using a named time field/meaning and interval. | Show timezone and interval policy where relevant. It does not select the underlying source revision by itself. |
| Data revisions | Choose an available retained source state. | Availability, permission and retention must hold when used, not just at an earlier check. |
| Workspace history | Restore a committed workspace configuration under declared source-boundary rules. | Saving does not inherently erase it; cross-session retention and feature-edit undo need separate decisions. |

These are conceptual distinctions, not five new panels or managers. Detailed commit hashes and DAG names belong in expandable provenance; everyday labels should describe the user's action.

For future retained scenarios, a saved reference must not be mistaken for a garbage-collection pin. The storage owner must define retention protection for pinned scenarios and active operations, or declare that replay can become unavailable. This research does not implement that mechanism.

#### Revised Batch 13 tests

1. **Shared versus captured style:** changing the shared style updates only presets deliberately following it. A preset that captured/versioned its settings retains them or reports its missing dependency; it never quietly becomes following.
2. **Unavailable revision:** a scenario requiring A@R1 and B@R2 cannot silently replace unavailable R1 with latest. Distinguish viewing a retained output from rerunning analysis. Retention protection must cover active use where guaranteed, not merely a preflight instant.
3. **Two time axes:** a measurement dated 1 May first appears in revision C200. Filtering 1 May within C199 cannot return it; filtering within C200 can. Revision chooses the available data, while domain-time filtering selects within it. Neither clock “supersedes” the other.
4. **Save and history:** saving a reference recipe does not silently clear workspace checkpoints, prepare the source, or commit feature edits. Each is a separate action with its own authority and guarantees.

### Disposition

- Batch 11: reviewed with corrections; candidate mask/picking/publishing rules await architect/product ruling.
- Batch 12: full evidence and contract reviewed with corrections; no remaining truncation.
- Batch 13: evidence and proposals reviewed with corrections; copied duplicate answers do not increase evidence strength.
- Next useful step: consolidate the candidate layer/scenario decisions with the architect and continue O-07/migration. Further batches need a specific unresolved question, not automatic expansion.
- Keep v7 frozen. No new renderer, dependency, database, workflow engine or SKP schema is authorized by this review.
