> **Design reference, not Authority.** Copied on 2026-09-25 from the human's prototype folder outside the repository (`prototype/SPATIAL-IDE-DESIGN-NOTEBOOK.md`; sha256 e0079be6dcd9d65eafe7603c396697e4991bf22924ccfb236fc015b25c8536ba of the source bytes), on the human's instruction (`state/directives/2026-09-25-cloud-hooks.md` §4 and §5). It is design discussion for the Map studio direction (PLAN node `shell-redesign-map-studio`): it rules nothing, authorises no work, and no piece cites it as Authority. Its local file links point to the human's machine; the prototype it names is the sibling copy `map-studio-v7-codex.html`. Everything below this header is byte-identical to the source.

# Spatial IDE — Living Design Notebook

**Updated:** 25 September 2026  
**Purpose:** a shared discussion record for Christopher, the main architect and the custodian. It joins the prototype, workflow research and backend implications, including why a proposal exists and what would justify building it. **It is not an implementation brief, accepted ADR, permission to change the repository, or handoff.**

This is a current-state notebook: edit summaries in place, preserve meaningful decision changes in the short change log, and link authoritative decisions rather than copying them. Update it when this design work continues; no background synchronization is implied.

## Navigation

1. [Authority and current position](#1-authority-and-current-position)
2. [How we arrived here](#2-how-we-arrived-here)
3. [Product and interaction principles](#3-product-and-interaction-principles)
4. [Research ledger: batches 1–7](#4-research-ledger-batches-17)
5. [Omni-bar proposals: assessment and order](#5-omni-bar-proposals-assessment-and-order)
6. [Smallest coherent omni-bar architecture](#6-smallest-coherent-omni-bar-architecture)
7. [Self-describing kernel and SKP: future direction](#7-self-describing-kernel-and-skp-future-direction)
8. [Backend and product consequences](#8-backend-and-product-consequences)
9. [Sequencing and promotion tests](#9-sequencing-and-promotion-tests)
10. [Decisions still to make](#10-decisions-still-to-make)
11. [Evidence and reference index](#11-evidence-and-reference-index)
12. [Change log](#12-change-log)

## 1. Authority and current position

### What this notebook can and cannot establish

- **Repository facts** below are from the local checkout inspected at `ffde0a7c3ac703ec8dc585dc6d8f5d25a2edcc98`. Remote PR and CI state were not independently checked for this assessment.
- **Prototype behaviour** is a simulation, not evidence that the product implements the same operation, security boundary, persistence, renderer or performance.
- **Research observations** come from supplied NotebookLM extractions and targeted documentation checks. A tutorial demonstrates a mechanism; it does not measure user demand, frequency or efficiency. Missing timestamps remain missing.
- **Recommendations** are proposals for the architect to assess. An attractive mock-up does not amend an ADR or authorize the custodian to implement it.
- **Unknowns** stay named. In particular, no UI may quietly upgrade provisional preview data into exact, reproducible or complete data.

### Inspected product boundary

| Area | What exists / is planned | Consequence for this design |
| --- | --- | --- |
| Public SKP | `skp/0.4`: `open_dataset`, `describe`, `viewport_query`, `cancel`, `close_dataset` | Do not advertise every UI command as a public semantic API. |
| Console surface registry | Classifies public SKP actions, binding-local actions and UI-only actions | Reuse its exposure distinctions. It is **not** a kernel capability registry. |
| Error envelope | `code`, `message`, structured string fields; owning layers already supply some useful details | Build on real typed errors; do not pretend full outcome/remediation discovery already exists. |
| Discovery / conformance | Full SKP capability discovery and its conformance suite are not implemented | A prototype catalogue is not a KernelManifest or conformance claim. |
| Map-studio migration | Proposed; structural shell work awaits a ruled migration plan | Prototype refinement can continue independently. Production shell work needs its own authority. |
| B1 | Engine preregistration draft completed; that is not implementation | Do not count hover attributes/categorical styling as already shipped because the mock-up shows them. |
| B2 / B3 | Save/reopen, verified Prepare and publish-v2 are proposed, sequenced pieces | Designs must respect their distinctions without bringing forward backend scope. |
| Watcher | In-progress work with separately declared coverage/check-quality facts | A watcher adds advisory detection, not snapshot consistency. Recheck its merged state before implementation. |

The current prototype is [map-studio-v7-codex.html](<C:/Users/Christopher/Development/Claude/Spatial IDE/prototype/map-studio-v7-codex.html>). The previous pass reported 40 checks and resolution of all 45 prototype command completions without script errors. Those are prototype checks, not kernel conformance or production acceptance, and were not re-run for this notebook-only pass.

### Existing broader notebook

[Product and Field Workflows v0.2](<C:/Users/Christopher/Desktop/SPATIAL-IDE-PRODUCT-AND-FIELD-WORKFLOWS.md>) remains the detailed catalogue of domain workflows, team/field products, automation and sector opportunities. This notebook carries their architectural implications forward rather than silently replacing that record. When recommendations conflict, identify the revised proposal and seek a ruling; neither notebook overrides accepted project decisions.

## 2. How we arrived here

Christopher's complaint was not that the debug UI lacked one more feature. It lacked a coherent application structure: canvas, tools, messages and collapsible forms read as one long list. The redesign therefore starts with **where work and information belong**, not decorative reskinning.

| Stage | Main learning / direction | Qualification |
| --- | --- | --- |
| Map-studio v1–v2 | Map-first workspace with layers, inspector, status and an on-demand Activity area; compare laptop and ultrawide states | Plain parcel sketches establish structure, not final cartography or visual design. |
| v3 | History belongs at the side; console, problems, jobs and table generally work better below. Layout controls should be searchable | Customization must not become another sprawling settings panel. |
| v4 | Compact history, explicit restore, filter cards and reproducible scale controls; branch-like history exploration | History branching is an experiment, not an accepted engine undo model. |
| v5 | Multi-selection, inspection, filtering and action scope need separate state; fix the artificial two-feature selection limit | The fixture has 170 features. It does not establish large-dataset selection scalability. |
| v6 | Repetition needs captured scope, editable parameters, collision handling and honest cancellation | Mock jobs and outputs are not real processing or persistent artifacts. |
| v7 | Deterministic prefixes, completion, field discovery, scoped feature search and read-only statistics/calculation previews | A local command catalogue is useful without claiming public SKP discovery. |
| This assessment | Typed drafts, slots and proportionate previews should precede model-driven interpretation | All five new search patterns are proposals, not requirements. |

Two corrections matter enough to retain:

1. Moving a mounted canvas in a layout is not inherently the same as losing its WebGL context. **Unmount/remount and renderer finalization** are the practical hazards to test. Keep the canvas stable; do not assume a docking library does so.
2. Early discussion described history restore as appending a new state. Later prototypes explored keeping alternate futures. Neither implies that arbitrary removal of an old action can safely recompute everything after it, nor that undo survives forever without retained data.

## 3. Product and interaction principles

### 3.1 A map-first, adaptable shell

- Default regions: layers, map, inspector; Activity collapsed. History is a compact side section, collapsible where it would crowd a laptop inspector.
- Console, Problems, Jobs and Table share an on-demand working area. A wide table normally benefits from the bottom; ultrawide arrangements deserve an optional side layout rather than wasted width.
- One clear layout button opens layout choices in the same search/picker system. Avoid a second ambiguous “Bottom” control when a named Activity toggle already performs that job.
- Search and its suggestion panel should look connected and have equal width. A layout-specific picker may anchor near the layout button so its own preview remains visible.
- Start with resizable regions and toggles. Drag-to-dock, saved layouts, shortcut editing and detached windows are separate additions, not prerequisites for a coherent shell.
- Preserve a path to multiple monitors, without requiring them. A second webview has its own renderer context and memory; it cannot literally share the first window's JavaScript store. Cross-window state synchronization, event ordering and admission are real future work.

### 3.2 Give facts and messages a home

Keep high-priority state concise: blocking condition, jobs, source facts, feature identity, counts, scale. Details open on demand. Bind displayed facts to the dataset actually on the canvas, not an unsuccessful or unfinished open attempt.

An attention strip belongs outside the canvas. Show the most urgent condition and a count of others; retain unresolved conditions in Problems. A newer message must not erase an older blocker. Never offer “switch to prepared revision” when none exists.

Use precise counts: **loaded**, **matching**, **selected**, **hidden selected**, **total unknown**. A loaded subset is neither the complete dataset nor automatically the action target. Feature identity and source identity are different facts.

### 3.3 Reproducible navigation

Use an editable **map scale denominator** such as `1:10,000` where CRS/unit information supports it. Percentage zoom is not a useful universal GIS reference. Also expose Zoom to layer/selection, coordinates and view bookmarks through search.

For reproducibility, save the actual camera/view definition: CRS, center, resolution and relevant rotation/pitch, with a declared pixel convention. A displayed ratio based on CSS/reference DPI is not a promise of physically calibrated paper scale on every monitor. An extent fit changes with viewport aspect ratio; distinguish “fit these bounds” from “restore this resolution.” Unknown units mean scale is unknown, not guessed.

### 3.4 Search, filters and selection

The v7 experimental vocabulary is `/` commands, `@` fields, `#` feature search, `?` help, plus ordinary search. The new example `@roads` introduces a possible **resource/field collision**. Do not silently redefine the existing prefix. Prototype a scoped chooser or explicit forms such as `@layer:roads` and `@field:roads.surface`; settle the vocabulary before production.

TAB completes a candidate or moves to the next required slot; it does not execute. Enter on an incomplete draft asks for the missing information. Never trap keyboard users in endless completion: define and test how focus leaves the bar.

Applied filters are individual, editable cards/chips with enable/disable/remove controls. Preserve an advanced expression route: an arbitrary SQL predicate cannot always be losslessly divided into simple chips. Define how supported chips combine, preserve parentheses/null semantics, and keep unsupported expressions intact rather than rewriting them approximately.

Keep these concepts distinct:

| Concept | Meaning |
| --- | --- |
| Active layer | Default context for commands that explicitly use it |
| Inspected feature | The feature currently being read; not automatically the whole selection |
| Selection | A persistent set within its declared layer/generation; may include features currently hidden |
| Layer/query filter | Changes the data view according to the declared operation |
| Display visibility | Changes what is drawn; not authorization or removal from the source |
| Action scope | The explicit, resolved target of this execution |

Search-result clicks should inspect/select/navigate according to a visible mode. They must not secretly delete or edit features. An eventual “apply this operation on each click” mode must be explicitly armed, show the operation and target, and disarm on Escape or invalid context.

### 3.5 Three histories, not one misleading Undo

1. **Workspace history:** filter/style/scope/view configuration. Session-only is the current prototype boundary.
2. **Edit undo:** future transactional changes to data, requiring the editing store and stable base revisions.
3. **Activity/audit:** what ran, with outcomes and effects. Removing a display record does not reverse the operation; governed audit records need their own retention policy.

Clicking a history row selects/inspects it. Restore is explicit. Show layer/resource context, compact entries, grouping and search. Grouping is a view over the causal sequence, not a reordering of execution.

A useful future branch UI can grey an abandoned future without destroying it. However, disabling/editing a middle step is **dependency-aware replay**, not a harmless list operation. It requires retained inputs, validity checks and a refusal path. Source boundaries are not undoable by pretending the old session still exists. “Unlimited undo” is a user aspiration; do not promise it without storage, retention and reproducibility rules.

## 4. Research ledger: batches 1–7

These are design hypotheses informed by the research, not a request to build seven feature families at once. Source index is in §11.

### Batch 1 — Search → filter → select → inspect → act

**Learning:** inspection focus, selection membership and the target of bulk operations are different. A layer header in an attributes pane can express a different local target from the globally active layer.

**Consequence:** keep explicit action scope near Run; retain selected features while inspecting others; expose hidden selections. “Selection to filter” must distinguish a frozen identifier set from a live predicate. A frozen set needs an identity contract and cannot simply persist generation-local row numbers.

**Caution:** some tutorial behaviour was not demonstrated, including whether a locator result changes selection. Do not infer it. QGIS expressions are not universally interchangeable with SQL.

### Batch 2 — Repetition, batches and workflow history

**Learning:** “run again with the same inputs,” “repeat on the current selection,” “save a parameter preset,” and “build a reusable workflow” are separate tasks.

**Consequence:** prioritize a staged repeat operation with captured scope, compatible schema/geometry/CRS, output policy and editable parameters. Batch rows can reuse that contract. A DAG editor is not needed to make the search bar useful.

**Caution:** deleting a geoprocessing history record does not undo its effects. ArcGIS history is not correctly described as only a profile-local log. Conditional branches inside a workflow are not workspace-history branches. A friendly output label is not proof of a unique output path.

### Batch 3 — Styling and visibility

**Learning:** data filtering, display filtering, label visibility, category styling and scale-dependent drawing have different meanings.

**Consequence:** distinguish them in the inspector and in “why can't I see this feature?” explanations. Report only known causes. Define missing values versus an Other category deliberately. Show when a classification was computed from a sample.

**Backend implication:** computing categories/statistics for a multi-gigabyte source on every keystroke is not a UI feature. It needs bounded queries, cancellation and declared coverage. Hiding a layer or category never protects its data in a published artifact.

### Batch 4 — Projects, dependency repair and publishing

**Learning:** saving a project/recipe is not packaging its dependencies. A compatible replacement path is not necessarily the same dataset. Read-only project storage is not the same as read-only sources.

**Consequence:** separate locator, identity, inclusion in an artifact and writability. Save/Prepare/Publish must say which of these changes. Repairing a path should revalidate rather than silently assert equivalence.

**Caution:** project containers do not automatically include every referenced asset; packaging options can include more history/input material than is visible on the map. That is both a disk and disclosure concern.

### Batch 5 — Snapping, topology and editing

**Learning:** a snapping reference is not automatically an editable target. An edit may require several neighbouring features to change together.

**Consequence:** future editing needs explicit editable/topological domains, clear on-canvas cues, and a refusal when a required neighbour is locked or unsupported. Visibility or zoom must not silently redefine topology membership.

**Backend implication:** atomic multi-feature updates, conflict policy and topology guarantees belong to the editing/kernel design. A frontend highlight cannot supply them. Undo, Cancel, Discard and restoring saved data need different tests.

### Batch 6 — Tables, joins, calculations and statistics

**Learning:** the table is a working surface, not just a dump of attributes. Joined rows need not correspond one-to-one with features. Field provenance, storage, calculation and writability are independent properties.

**Consequence:** table scope and counts must be explicit; inspect does not replace selection. Preserve keys such as `0012` unless a deliberate normalization rule says otherwise. A join validator does not itself create the join. Removing rows with NULL values can mean deleting features, not cleaning presentation.

**Precision caution:** attribute units, geometry-area methods, project ellipsoid and CRS units are not interchangeable. The prototype's hectares preview converts a known fixture field; it is not proof of a geodesic area engine. Statistics must name coverage and freshness.

### Batch 7 — Recovery and historical states

**Learning:** source applications distinguish history records, snapshots, edit sessions and undo stacks differently. A nonlinear history option is not proof of general dependency-aware recomputation.

**Consequence:** make restore, rerun, branch, hide and delete visibly different operations. Preserve named boundaries; refuse a restore that cannot be admitted against the current source. Retaining commands without their data revisions cannot guarantee exact recovery.

**Caution:** do not generalize one application's save behaviour to every application. The supplied sources did not establish every proposed Lightroom operation; those gaps remain unknown.

## 5. Omni-bar proposals: assessment and order

### Classification key

“Implement now” below means **recommended for the next bounded prototype pass**, not authority to alter the product. “Prototype now” means an experiment whose usability is still being tested. This notebook-only pass changes neither v7 nor the repository.

| Pattern | Classification | Priority | v7 disposition |
| --- | --- | --- | --- |
| 1. Ghost text / automatic pills | **Prototype now**; defer unsolicited semantic pill conversion | After slots/previews | Deterministic suggestion experiment only |
| 2. Slots / adaptive chips | **Prototype now** | First | Small fixture-backed form for existing commands |
| 3. Micro-agent resolver | **Design seam now, implement later** | Last, only if evidence warrants | No model integration or agent service |
| 4. Structured previews | **Implement now** | First, alongside slots | Consolidate existing previews and show scope/effects consistently |
| 5. Bidirectional editing | **Prototype now**, for pills ↔ structured intent | With slots | Preserve original language separately; reject a lossless arbitrary-language round-trip promise |

### 5.1 Ghost text and inline pill transformation

**UX value:** helps people discover vocabulary and confirms recognized entities without requiring them to memorize syntax. The risk is an input that moves beneath the user's fingers or appears more certain than it is.

**Recommendation:** offer deterministic ghost text and an explicit Accept action first. A unique command alias plus an unambiguous resource chooser result can become a token after acceptance. Uncertain spans should remain text with suggested interpretations. Do not convert a partial number, composing text or a half-typed resource name. “High confidence” must have an operational definition; a model score alone is not a safety rule.

**Layer / cost / complexity:** frontend draft editor and deterministic resolver; moderate-to-high interaction cost because caret movement, selection, backspace, undo, pasting and accessibility become harder. No AI dependency is necessary.

**Duplication risk:** low if tokens only refer to existing descriptors/typed values; high if the recognizer invents defaults, unit conversions or command meanings. `/command` locks deterministic interpretation. Unrecognized trailing words remain unresolved rather than being discarded.

**Promotion evidence:** compare plain explicit syntax, ghost suggestions and accepted pills on the same tasks. Record wrong targets, correction actions, abandonment and time to a correct reviewed intent—not just typing speed. Include IME composition, international keyboard layouts, screen readers and paste/undo tests. Reject automatic conversion if it creates surprise despite saving keystrokes.

### 5.2 Semantic slot filling and contextual chips

**UX value:** highest immediate value. A command can become a small, guided form with required input, scope, units and output policy instead of a syntax puzzle.

**Recommendation:** a selected command reveals only its relevant slots. Populate visible defaults from the admitted context, mark what came from context, and make each value editable. Missing information remains missing. A selected set may offer a few relevant actions, but unavailable commands need a reason; they must not appear usable merely because a frontend array lists them.

**Layer / cost / complexity:** moderate frontend work over typed adapters. Dynamic semantic availability ultimately belongs to the owner, not the renderer. No AI dependency. In v7, use fixture-backed commands such as Filter, Scale and Statistics. Buffer/Reproject may illustrate an unavailable future action, not masquerade as implemented GIS operations.

**Duplication risk:** medium. UI labels and slot presentation are legitimate frontend metadata. Geometry compatibility, permission, source validity and CRS policy are not. Import existing types where available; use explicit mock metadata elsewhere and label it.

**Promotion evidence:** a user can complete an unfamiliar command without documentation, can see which layer/selection it targets, and cannot run with unresolved required slots. Changing the active layer midway cannot silently retarget a reviewed draft. Test sparse and busy contexts; contextual suggestions should not make the bar jump or fill the map with chips.

### 5.3 Optional micro-agent / intent resolver

**UX value:** potentially useful for vocabulary gaps and explaining alternatives. “Combine parcels” may mean dissolve, union, merge datasets or group records. The model cannot know the user's unstated intention merely because it can name those operations.

**Recommendation:** deterministic aliases plus a short choice list first. Keep a conceptual extension point for a resolver to propose candidates from an allowed catalogue. Do not build an idle model service, provider abstraction or general agent framework now.

**Layer / cost / complexity:** later assistance adapter outside the kernel and execution path. Operational cost is high relative to a chooser: latency, usage, privacy, cancellation, prompt injection, evaluation and unavailable-network behaviour. AI is required only for this optional assistance, never for baseline use.

**Duplication risk:** high unless output is schema-checked and limited to existing action/resource IDs and supplied parameter domains. A suggestion is neither capability discovery, policy nor permission. The model must not invent remedies, execute code or reinterpret explicit commands.

**Promotion evidence:** retain an opt-in, redacted set of unresolved real tasks, with agreed intended outcomes. Compare deterministic suggestions with model-assisted suggestions on held-out cases, including total review/correction time and wrong-operation rate. Add a model only if it provides meaningful net benefit. Remote resource/field content needs an explicit privacy policy; treat labels and data as untrusted input.

### 5.4 Action previews

**UX value:** turns “what will Enter do?” into visible scope, parameters and consequences. It is especially valuable when the same verb can create a derived layer, change the view or mutate a resource.

**Recommendation:** proportionate friction, not a confirmation modal for everything:

- Immediate, reversible UI actions such as opening a panel need a clear label, not a blocking review.
- Scope-sensitive or substantial actions get a compact summary next to Run.
- Destructive, externally side-effecting or permission-sensitive actions retain the owning operation's required approval. A palette preview cannot replace it.

Show resource, resolved scope, parameter units, result kind, output target, whether the original changes, cancellation semantics and undo/reversibility where known. Do not promise “undoable” because the UI has history. A feature count may be unknown or require an explicit estimate/count operation; never scan a whole file just to keep a preview badge filled.

**Layer / cost / complexity:** low-to-moderate presentation work for existing fixture previews; potentially significant owner-side preflight for real operations. No AI dependency. Duplication risk is medium-to-high if the client computes its own approval policy or estimates it presents as facts.

**Promotion evidence:** users correctly predict what changes; stale previews cannot execute against a changed source/scope; unavailable counts remain honest; two commands with different effects do not look identical. A successful preview is not a reservation or authorization: execution revalidates relevant context and permissions.

### 5.5 Bidirectional intent editing

**UX value:** transparent correction. Editing a distance or target should not require reconstructing a sentence.

**Recommendation:** make pills and a canonical structured command two editable representations of **one draft**. Keep the user's original natural-language wording as provenance, with a generated interpretation beside it. Do not claim arbitrary natural language can round-trip losslessly.

Editing supported canonical syntax can reparse into the draft. Unsupported clauses stay visibly unresolved. Changing a slot updates the draft and its generated description; it must not silently rewrite the original request to pretend the user said something else.

**Layer / cost / complexity:** frontend draft reducer/serializer and presentation; moderate for a small grammar, high for arbitrary prose. No AI is needed for the restricted form.

**Duplication risk:** low when all views share one draft; high when text, pill state and typed arguments each own their own truth. Promotion requires structural round-trip tests for the supported grammar, caret/undo tests, and confirmation that changing a value preserves unrelated intent.

### Explicit rejections

Reject text → model → execute; AI reinterpretation of `/command`; invisible destructive result clicks; hidden scope changes; unsupported operations advertised as available; automatic whole-file preview scans; frontend reimplementation of kernel policy; and the promise that natural language, structured commands and historical outcomes are interchangeable records.

## 6. Smallest coherent omni-bar architecture

### 6.1 One draft, existing execution paths

```text
Text / explicit prefixes / chooser / slot edits
                      ↓
IntentDraft: candidates, typed values, unresolved parts, context
                      ↓
Deterministic resolution + explicit user choices
                      ↓
ResolvedIntent: unambiguous request, NOT permission or success
                      ↓
Existing action adapter + owning validation/preflight where available
                      ↓
Proportionate preview / required approval
                      ↓
Existing semantic or UI handler → existing recording and outcome
```

An eventual model can propose changes to an **unresolved draft**, not bypass the rest of this path.

Start with a small presentation catalogue over existing handlers, a draft state reducer, deterministic resolution/completion, and adapters. Do not introduce a second command bus, generic workflow engine or public protocol merely to render slots.

### 6.2 Minimal conceptual records — not a proposed wire schema

| Record | Minimum useful responsibilities |
| --- | --- |
| UI action entry | Stable local ID, label/aliases, handler binding, exposure class, presentation of known slots, availability adapter |
| Intent draft | Raw input, recognized spans, candidate action, unresolved values, explicit/context-derived value provenance, resolution context |
| Resolved intent | One action ID, typed arguments and explicitly bound resources/scope; ready for owner validation |
| Preview model | Owner-supplied facts plus UI summary; unknown/estimated facts marked; relevant context binding |
| Outcome adapter | Display existing returned results/errors/cancellation honestly; do not synthesize stronger kernel guarantees |

Concepts such as context binding can remain client-local in this phase. This does not add fields to `skp/0.4`, persist session handles, or reopen a protocol version by accident.

### 6.3 Preserve the current exposure fence

The console's A/B/C classes are **exposure/display classes**, not ADR-006's side-effect classes 1/2/3.

- **A — public SKP:** dispatch through the existing typed SKP path and record the actual request as today.
- **B — binding-local:** invoke only the already exposed local handler, through the same approval path. Do not make it public, script-copyable or AI-callable by adding it to search.
- **C — UI-only:** execute the local view action and preserve the honest “no API equivalent” distinction.

Being searchable is not the same as being supported by MCP. “Every command in one palette” does not mean “every command has identical execution authority.”

### 6.4 Resources, context and stale drafts

Use the existing admitted dataset, its `describe` information and the current canvas context as a small resource-resolution adapter. Do not build a new general ResourceRegistry or scan arbitrary files to make suggestions.

- Labels are not identity. Duplicate layer names require disambiguation.
- Fields belong to a resource/schema, not a global list of strings.
- Runtime handles/generations are not durable ResourceRefs. A saved recipe must not accidentally serialize a live session ID.
- `@active-layer` is resolved visibly. A reviewed action either keeps its pinned target or becomes stale when that target/context changes; it must not silently jump to a new layer.
- A selected scope must distinguish IDs from a live predicate. Do not derive the entire action scope from the renderer's currently loaded features.
- Discard late suggestions/counts/previews from older drafts or generations. Cancel unnecessary work without claiming that cancellation reverses already committed effects.
- Parse quantities into typed value/unit pairs. Unit conversion and CRS compatibility use owning semantics. A geographic layer plus “50 m buffer” is not enough to choose an algorithm or projection silently.
- Treat resource names, field values and help text as data, not executable instructions.

### 6.5 Avoid duplicate semantics now

Presentation metadata may be local; policy may not. Existing schemas/types and owner validators remain authoritative. When no owner availability/preflight exists, say **not available** or **prototype assumption** rather than writing a shadow implementation in the bar.

For v7, fixture descriptors can describe fixture behaviour. For production, introduce adapters incrementally and test that menus, search, shortcuts and console entry points reach the same handler. Shared artifacts/generated types can prevent drift; two separately hand-maintained tables with independent tests cannot prove agreement.

## 7. Self-describing kernel and SKP: future direction

The user's three proposed properties are worth preserving as a future architectural requirement candidate: owner-generated discovery, discriminated outcomes and deterministic owner-supplied remedies. They are **not** dependencies for the next prototype iteration.

### 7.1 One authoritative description, several clients

Eventually generate a versioned machine-readable capability index from the owning command/resource registries, with detailed descriptors fetched on demand. UI, CLI, MCP and AI adapters consume the same semantic definitions instead of independently documenting what an operation means.

Useful descriptor dimensions include:

- Stable action ID/version and input/output schemas.
- Accepted resource/geometry kinds, units and CRS requirements.
- Scope semantics, preconditions, possible refusals and result completeness.
- Side effects, permission requirements, output policy and reversibility.
- Preview support and its cost/limits.
- Cancellation behaviour, commit boundaries and retry/idempotency rules.
- Evidence/profile for implemented guarantees, with unsupported or unverified claims explicit.

Types alone cannot generate all this meaning. Owners must declare semantics alongside implementation and exercise them in tests. Generated descriptions should not become a polished copy of stale prose.

Separate three questions: **Does this build implement it? Is it valid for these resources now? Is this caller allowed to do it?** Dynamic availability is context-bound and can go stale; it is not a global immutable manifest property. Discovery itself may need filtering/redaction for sensitive resources.

### 7.2 Outcome vocabulary

Explore distinct outcomes for deliberate refusal, invalid request, execution failure, cancellation and success. Record completeness/quality and committed effects separately so that partial/degraded success is declared rather than hidden inside prose.

Examples: cancellation can occur after some output was produced; success can have complete results but degraded detection; a refused operation may have an actionable remedy without being an execution crash. Define precedence and streaming terminal semantics in the owning protocol design. Do not retrofit these labels onto current errors by guessing from English messages.

Keep stable machine codes, structured fields and human explanations. “Cancelled” must never imply rollback unless the operation contract actually promises it.

### 7.3 Deterministic remedies

A typed refusal can eventually include remedies from its owner: registered action ID, typed or incomplete arguments, applicability conditions and required approval. Examples may include reopening a changed source or choosing a compatible resource, but only when the relevant owner actually supports that path.

The client explains or stages the remedy; the owner revalidates before execution. A remedy is not arbitrary code, an authority token, a bypass of permissions or proof that an unavailable prepared artifact exists. Sensitive actions still require explicit approval. Prevent retry loops and stale remediation against a new generation.

### 7.4 Evidence and AI honesty

Conformance must exercise semantics, not merely validate JSON: refusal codes, incomplete results, cancellation, stale context, effects and remedies across applicable bindings. Tie evidence to an implementation revision and declared profile; distinguish **declared**, **tested** and **not yet verified**. Cross-client agreement is not proof of cross-platform performance.

A thin MCP adapter may expose these descriptors and structured outcomes, but MCP tool annotations are not themselves policy enforcement. Schema validity is necessary, not sufficient. The architecture can reject unsupported execution and make explanations inspectable; it cannot guarantee that an AI never hallucinates prose.

## 8. Backend and product consequences

### 8.1 Save, Prepare, Publish and projects

- **Save reference:** small workspace/recipe definition with locators and identity hints; no automatic whole-file scan. It makes a best-effort reference, not an immutable snapshot.
- **Prepare:** explicit, cancellable acquisition or reuse of an eligible stable artifact; protected acquisition must be coherent. A plain copy or hash of a mutating source does not establish that by itself.
- **Rebind:** explicitly switch preview to the prepared artifact, creating a new generation. Preparation must not silently replace the live preview.
- **Verified operations:** operate on the admitted stable artifact and the exact guarantees declared by their own contract. A byte hash does not by itself establish identical numerical results on every future engine.
- **Publish:** export the selected scope, style and metadata through the existing permission/audit boundary. A static bundle, a protected hosted map and a multi-user writing service are different products.

B2 is a single-dataset recipe, not a full multilayer project system. Eventually separate personal layout/preferences, workspace references, workflow definitions, durable data artifacts and operational-service state. Saved prepared data must not be garbage-collected as disposable renderer cache.

For local capture, the discussed Windows shape reads through the same write-excluding protected handle, validates the copy and atomically installs it. Portability needs an equivalent guarantee, not a casual “copy and hash” fallback. State incremental disk requirements, temporary space and cancellation cleanup at the operation itself. Background work still competes for I/O and CPU even when preview does not wait for it.

### 8.2 Source detection and consistency

Connection reuse is a performance mechanism, not a source snapshot: a reused DuckDB connection can still reopen an external Parquet source per scan. The existing descriptor uses byte size, modification time, footer length and footer hash. Checks at two instants detect some modifications, not all modifications or every mixed read.

An advisory watcher improves early detection but cannot certify coherence. Current planned reporting distinguishes **coverage** (`watching` / `checks-only` with reason) from **check quality** (`full` / `degraded` with components). Coverage loss has its own typed refusal rather than being relabelled source change. These supersede simplified earlier notebook discussions of a single detection state.

No action preview, search result or history restore may outlive its source context unnoticed. The renderer's in-memory features are not an authoritative snapshot of the entire dataset.

### 8.3 Repetition and the future Workflow IR

Offer four progressively stronger tools: repeat with the same inputs; repeat on an explicitly chosen new scope; save a parameter preset; compose a reusable workflow. The future Workflow IR should be the common typed representation for durable workflows, not a second ad hoc macro language invented by the omni-bar.

Do not blindly replay authorship, timestamps, IDs, target selections or output paths. Explain absolute versus relative operations. “Review next feature” should use a stable work queue when a live filter would otherwise skip or revisit records as edits change membership.

### 8.4 Performance and precision

GUI restructuring and a native renderer are not automatic fixes for engine scan-start or first-batch latency. The native-wgpu bake-off remains separately scoped/unscheduled; it is not a prerequisite for this shell.

Preserve f64 authoritative geometry and typed CRS semantics. Renderer coordinates are derived display data. Chunk-relative packing, camera-relative transforms, quantization and high/low approaches need measured precision/memory trade-offs; they are not universally lossless. Camera movement should not require a per-frame round trip to the kernel. Keep geometry, volatile styling and feature identity separable where that reduces updates.

Use “copy-minimizing” until measured copies justify a stronger claim. Bound preparation/conversion workers and memory, preserve backpressure, and verify cancellation reaches the actual producer. Shared-topology edits can invalidate several features/chunks, not just the clicked polygon. None of this is proved by an HTML prototype.

### 8.5 Raster, formats and domain automation

SHP, GeoPackage, KML, TIFF and database sources are adapter/semantics work, not merely new extensions in an Open dialog. Plan explicit handling of CRS, field types, identity, encoding, geometry and mutability. PostGIS access is not automatically collaborative editing or a substitute for application conflict/topology rules.

Orthophoto/vineyard extraction needs a raster read/tiling/display path before an extraction button. Separate colour/texture segmentation, row-line extraction, inferred plant positions from spacing, and actually detected plants. They have different evidence and error bounds. Preview and manual correction are essential; model assistance should beat a deterministic baseline in total review effort before adoption.

Cross-sector candidates worth preserving: repeated delivery QA, schema normalization, join checking, exception review, changed-delivery comparison, recurring export/package preparation, and scoped field updates. Cadastre requires authoritative boundaries rather than treating imagery as legal truth; engineering/geology need vertical datum, time and provenance; utilities need explicit network connectivity rather than proximity alone; planning needs versioned rules. The older product notebook contains the detailed sector catalogue.

### 8.6 Field and team products

The agriculture example remains valuable: a manager prepares a map; crew leaders/tractor operators report a broken post, wire, suspected disease or deficiency; seasonal workers get read-only navigation; contractors receive limited task access.

Start, if prioritized later, with online role-scoped use. Enforce resource, feature, field and operation permissions on the service, not by hiding controls. A report is not automatically an accepted correction to authoritative data. Include provenance, version/conflict rules and idempotent submissions. Protected read-only hosting can be an earlier product than a shared editing service.

Offline maps, sync conflicts and lock-screen integrations are not immediate requirements. Local draft recovery is smaller than full offline synchronization. A home-screen shortcut into a preconfigured reporting form may offer value before platform-specific lock-screen work. None of these proposals overrides the roadmap's post-1.0 field-service boundary.

## 9. Sequencing and promotion tests

### Smallest next prototype increment

1. Keep current explicit prefixes and define the resource/field disambiguation experiment.
2. Add a single shared draft representation behind a few existing fixture commands.
3. Present required slots and the same compact scope/effect summary across those commands.
4. Let pills and supported canonical syntax edit that draft; retain original wording separately.
5. Add deterministic, explicitly accepted ghost suggestions only after the previous path is stable.

No model, full manifest, new backend operation, persistent workflow engine or cross-window implementation belongs in this increment. Avoid increasing the visible proposed surface so much that it becomes impossible to assess the existing shell.

### Prototype tests

- Incomplete Enter advances to a missing slot; TAB never executes.
- Duplicate resource names and field/resource prefix collisions remain unresolved until chosen.
- `/command` is never routed to AI or silently changed to another action.
- Pasted text, IME composition, undo and Backspace do not corrupt tokens or discard clauses.
- A resource/context switch stales or visibly rebinds a draft; a late response cannot overwrite a newer draft.
- Inspecting one feature leaves a ten-feature selection intact. Hidden selected features remain accounted for.
- Repeat differentiates pinned prior inputs from explicitly rebound new inputs.
- Unknown counts remain unknown; typing causes no implicit whole-file scan.
- Invalid quantities and incompatible/unknown CRS cannot become executable through a display conversion.
- Preview distinguishes view changes, new outputs and in-place effects; required approval cannot be skipped.
- Cancel reports its actual effect; removing a history display record does not pretend to undo work.
- Canonical serialization/parsing preserves supported intent structure, including quoted names and filter grouping.
- Keyboard-only and screen-reader navigation can enter, edit, leave and dismiss the editor. Test on laptop and ultrawide, light and dark.

Measure task success, scope mistakes, corrections and total review time against the current v7 baseline. Predeclare criteria for each experiment; no invented performance targets or “users prefer it” conclusion from one successful click-through.

### Production sequence remains separate

The architect must rule the shell migration plan before structural product work. Stable test selectors and incremental state ownership changes should keep behaviour verifiable while moving existing components. Avoid bundling a wholesale state rewrite, new layout framework and semantic search engine into one cut.

B1/B2 screens can then land in the approved shell, with backend work following its own dependency order. Re-confirm publish approval exposure when moving that surface. Capability discovery and richer outcomes deserve their own protocol design and tests later, informed by what the first client actually needs.

## 10. Decisions still to make

| ID | Question | Recommended starting position |
| --- | --- | --- |
| O-01 | What does `@` mean when both fields and resources are searchable? | Preserve existing behaviour until a scoped chooser / explicit qualifier is tested. |
| O-02 | May typing automatically create semantic pills? | Initially only after an explicit acceptance or clearly committed deterministic token; do not use a confidence score alone. |
| O-03 | What happens when the active layer/selection changes during drafting? | Preserve a visible pinned target or mark the draft stale; never silently retarget Run. |
| O-04 | Which operations need a preview? | Compact scope summaries for meaningful operations; no modal for routine UI navigation; retain existing mandatory approvals. |
| O-05 | How does history expose alternate futures? | Prototype branch visibility, but defer persistent/recomputable branching until recipe/data retention semantics exist. |
| O-06 | When does a model enter the bar? | Only after a measured deterministic baseline fails important real tasks and model assistance improves net outcomes. |
| O-07 | What is the first real workflow walkthrough? | Open a parcel delivery, find a zone/size subset, inspect without losing selection, style, then review Save/Prepare/Publish choices. |
| O-08 | What promotes a prototype into a product cut? | Architect-approved migration/operation scope, owner-backed semantics, accessibility and regression checks—not visual approval alone. |

Suggested architect discussion: settle O-01 through O-04 for the next small prototype experiment, keep O-05/O-06 as bounded future seams, and use O-07 to test whether the design really reduces work. The custodian should receive a separately approved, bounded brief, not be asked to implement this entire notebook.

## 11. Evidence and reference index

### Local authority inspected for this assessment

- [Project instructions](C:/dev/spatial-ide/CLAUDE.md), [current plan](C:/dev/spatial-ide/PLAN.yaml).
- [Vision](C:/dev/spatial-ide/docs/00_Vision.md), [principles](C:/dev/spatial-ide/docs/01_Principles.md), [UX](C:/dev/spatial-ide/docs/03_UX.md), [AI/MCP](C:/dev/spatial-ide/docs/04_AI_and_MCP.md).
- [SKP direction](C:/dev/spatial-ide/docs/10_SKP_Protocol.md), [resources](C:/dev/spatial-ide/docs/11_Project_and_Resource_Model.md), [Workflow IR](C:/dev/spatial-ide/docs/13_Workflow_IR_and_Notebooks.md).
- [Current SKP contract](C:/dev/spatial-ide/protocol/skp/SKP-V0.md), [current version/types](C:/dev/spatial-ide/protocol/skp/src/v0/mod.rs), [error envelope](C:/dev/spatial-ide/protocol/skp/src/v0/error.rs), [console surface registry](C:/dev/spatial-ide/frontends/shell/src/console/surfaceRegistry.ts).

### New interaction-pattern references

- [WAI-ARIA combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/): useful baseline for suggestions and keyboard interaction, not proof that a rich token editor is accessible without testing.
- [VS Code user interface](https://code.visualstudio.com/docs/editing/getting-started/userinterface): reference for command discovery and layout conventions, not GIS usability evidence.
- [Microsoft HAX: efficient correction](https://www.microsoft.com/en-us/haxtoolkit/guideline/support-efficient-correction/) and [scope services when in doubt](https://www.microsoft.com/en-us/haxtoolkit/guideline/scope-services-when-in-doubt/): support making interpretation correctable and surfacing ambiguity rather than hiding it.
- [MCP tools, dated 2025-06-18 specification](https://modelcontextprotocol.io/specification/2025-06-18/server/tools): schemas and structured tool results are useful adapter mechanisms. This dated reference is not an assertion about the newest negotiated MCP version.

### Research source register

These are campaign sources, not a claim that every video was watched or every statement reverified in this pass. NotebookLM citation numbers are local to an extraction and should not be treated as permanent source identifiers.

**Batch 1 — searching / selecting / inspecting**

```text
https://www.youtube.com/watch?v=AegdJIY9ITw
https://www.youtube.com/watch?v=x3i9qyFGgcQ
https://www.youtube.com/watch?v=quJV75bzU4U
https://www.youtube.com/watch?v=RnJjeGFBV_k
https://www.youtube.com/watch?v=rJBf_zyxedQ
```

**Batch 2 — repeat / batch / model / history**

```text
https://www.youtube.com/watch?v=_U_7Cxg8rNY
https://www.youtube.com/watch?v=axvuyA52yoU
https://www.youtube.com/watch?v=rRHFX-ypsdc
https://doc.esri.com/en/arcgis-pro/latest/help/analysis/geoprocessing/basics/geoprocessing-history.html
https://courses.spatialthoughts.com/advanced-qgis.html
```

**Batch 3 — styling / visibility**

```text
https://www.youtube.com/watch?v=n4zJPjueKsY
https://www.youtube.com/watch?v=J31MUMKVup0
https://www.youtube.com/watch?v=HQOZ83uotEI
https://docs.qgis.org/3.44/en/docs/user_manual/working_with_vector/vector_properties.html
https://doc.esri.com/en/arcgis-pro/latest/help/mapping/layer-properties/display-filters.html
```

**Batch 4 — projects / dependencies / publishing**

```text
https://www.youtube.com/watch?v=MGdFsyU1gqE
https://www.youtube.com/watch?v=jZZvqXW6nSI
https://www.youtube.com/watch?v=qPUx5rkn9tM
https://doc.qgis.org/3.44/en/docs/user_manual/introduction/project_files.html
https://doc.esri.com/en/arcgis-pro/latest/help/sharing/overview/project-package.html
https://doc.esri.com/en/arcgis-pro/latest/tool-reference/data-management/package-project.html
```

**Batch 5 — snapping / topology / editing**

```text
https://www.youtube.com/watch?v=jCh9ucpLcek
https://www.youtube.com/watch?v=z3vG0XJa02E
https://www.youtube.com/watch?v=L0c37lB58H4
https://doc.qgis.org/3.44/en/docs/user_manual/working_with_vector/editing_geometry_attributes.html
https://doc.esri.com/en/arcgis-pro/latest/help/editing/introduction-to-editing-topology.html
```

**Batch 6 — tables / joins / calculations**

```text
https://www.youtube.com/watch?v=84cq3CmBwck
https://www.youtube.com/watch?v=9fHSO_cca_Y
https://www.youtube.com/watch?v=ca_yF7aGXKM
https://doc.qgis.org/3.44/en/docs/user_manual/working_with_vector/attribute_table.html
https://doc.esri.com/en/arcgis-pro/latest/tool-reference/data-management/validate-join.html
https://documentation.qgis.org/3.44/en/docs/user_manual/expressions/functions_list.html
```

**Batch 7 — history / recovery**

```text
https://helpx.adobe.com/fi/lightroom-classic/desktop/process-and-develop-photos/develop-module-options.html
https://helpx.adobe.com/au/photoshop/desktop/get-started/set-up-toolbars-panels/manage-image-states.html
https://helpx.adobe.com/au/photoshop/desktop/get-started/set-up-toolbars-panels/history-panel-overview.html
https://doc.esri.com/en/arcgis-pro/latest/help/analysis/geoprocessing/basics/geoprocessing-in-an-edit-session.html
```

### Evidence gaps to preserve

Tutorial transcripts may omit the cursor, exact selection state, software version or timestamp. UI-frequency claims, source-specific undo behaviour and performance conclusions require additional evidence. The five new omni-bar patterns arrived as user-supplied proposals; no trend survey established that they are inherently better or required.

## 12. Change log

### 25 September 2026 — Initial consolidated notebook

- Created beside the external prototype, without changing the repository or prototype.
- Consolidated the v1–v7 direction, seven research batches and the broader product notebook's backend implications.
- Distinguished current SKP/console exposure from proposed capabilities; retained current source-detection and Save/Prepare boundaries.
- Assessed all five search patterns, prioritizing slots and previews, explicit correction and shared drafts.
- Recorded future kernel discovery/outcome/remediation seams without making them prerequisites for v7.
- Left implementation authority and product acceptance with Christopher, the architect and their agreed process.
