> **Design reference, not Authority.** Copied on 2026-09-29 from the human's prototype folder outside the repository (`prototype/SPATIAL-IDE-DESIGN-NOTEBOOK.md`; sha256 bb79f4487bb6bfa186fc208e3632905df85fae4ebef29ff0ee48bd610a0bb5cc of the source bytes), on the human's instruction (`state/directives/2026-09-29-design-references-and-layer-ruling.md`, items 1 and 2). It is design discussion for the Map studio direction (PLAN node `shell-redesign-map-studio`): it rules nothing, authorises no work, and no piece cites it as Authority. It replaces in place the copy tracked since 2026-09-25 (source sha256 e0079be6dcd9d65eafe7603c396697e4991bf22924ccfb236fc015b25c8536ba; its profile roots substituted at 209a9c3). The prototype it names is the sibling copy `map-studio-v7-codex.html`, which is unchanged. Two mechanical transformations were applied to the source bytes, in this order, and nothing else changed: (a) each link whose target is a file tracked with it in `state/drafts/design/` was made relative: the text between the link's angle brackets, `%USERPROFILE%/Development/Claude/Spatial IDE/prototype/<file>` in the source with the profile root spelled out, became `./<file>` (4 links in this file); (b) `node scripts/hooks/profile-path-scan.mjs --redact` was run over the result, replacing each remaining profile root with `%USERPROFILE%` (1 in this file). Everything below this header is the source after (a) and (b).

# Spatial IDE — Living Design Notebook

**Updated:** 28 September 2026  
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
12. [Architect review and structural freeze](#12-architect-review-and-structural-freeze)
13. [Research track after v7](#13-research-track-after-v7)
14. [Change log](#14-change-log)

## 1. Authority and current position

### What this notebook can and cannot establish

- **Baseline repository facts** below are from the local checkout inspected at `ffde0a7c3ac703ec8dc585dc6d8f5d25a2edcc98`. A separate, narrow 28 September check at `85cb849244016dd0e3b050d6138fc40af18d4947` is identified in section 13; it does not refresh every earlier statement. Remote PR and CI state were not independently checked for these assessments.
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

The current prototype is [map-studio-v7-codex.html](<./map-studio-v7-codex.html>). The previous pass reported 40 checks and resolution of all 45 prototype command completions without script errors. Those are prototype checks, not kernel conformance or production acceptance, and were not re-run for this notebook-only pass.

### Existing broader notebook

[Product and Field Workflows v0.2](<%USERPROFILE%/Desktop/SPATIAL-IDE-PRODUCT-AND-FIELD-WORKFLOWS.md>) remains the detailed catalogue of domain workflows, team/field products, automation and sector opportunities. This notebook carries their architectural implications forward rather than silently replacing that record. When recommendations conflict, identify the revised proposal and seek a ruling; neither notebook overrides accepted project decisions.

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

Batch 10 review clarification: this is a desired Spatial IDE keyboard interaction, not a claim that WAI-ARIA prescribes Tab-to-complete or a two-Tab exit. Preserve normal focus navigation or explicitly test the alternative; acceptance, draft completion and execution remain distinct.

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

**26 September sequencing update:** the classification below records the earlier assessment of value/readiness. Following the architect discussion, v7's structure is frozen; these proposals do not authorize another feature-expansion pass. Slots, pills and the other later-band interactions remain research candidates. The immediate next prototype activity is the realistic O-07 walkthrough, followed by the minimum-shell migration plan (§12).

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

### Deferred prototype increment — not the immediate next step

The sequence below remains a possible future experiment, not work to run before migration. The 26 September agreement prioritizes O-07 and the minimum shell instead (§12).

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
| O-01 | What does `@` mean when both fields and resources are searchable? | Architect position, 26 September: fields of the active layer; layers remain in plain search. No new prefix required now. |
| O-02 | May typing automatically create semantic pills? | Architect position: explicit acceptance only. This stays a later-band interaction, not minimum-shell work. |
| O-03 | What happens when the active layer/selection changes during drafting? | Architect position: pinned target with a visible stale mark on relevant context change; never silently retarget Run. |
| O-04 | Which operations need a preview? | Compact scope summaries for meaningful operations; no modal for routine UI navigation; retain existing mandatory approvals. |
| O-05 | How does history expose alternate futures? | Architect position: display-only branches in the design reference; no recomputation. Actual branching remains later-band work. |
| O-06 | When does a model enter the bar? | Only after a measured deterministic baseline fails important real tasks and model assistance improves net outcomes. |
| O-07 | What is the first real workflow walkthrough? | Open a parcel delivery, find a zone/size subset, inspect without losing selection, style, then review Save/Prepare/Publish choices. |
| O-08 | What promotes a prototype into a product cut? | Architect-approved migration/operation scope, owner-backed semantics, accessibility and regression checks—not visual approval alone. |

The positions above record the architect conversation supplied by Christopher, not new accepted ADRs. O-04/O-06/O-08 were supported as recommended; O-07 is next. The custodian should receive a separately approved, bounded brief, not be asked to implement this entire notebook.

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

## 12. Architect review and structural freeze

### 26 September — reported review, not an independently repeated browser test

Christopher supplied the main architect's v7 review and their subsequent agreement. The architect reported exercising the prefixes, filter, field actions, feature search, scale and catalogue without script errors. They also reported feature-search counts leaking into other search modes. Treat that as a named prototype defect, **not fixed or independently reproduced by this notebook update**. No v7 file changed in this research pass.

**Agreement:** freeze structural exploration at v7, perform the realistic parcel workflow O-07, then write a minimum-shell migration plan. Future features remain visible as ambitions and architectural attachment points; they are not silently discarded, but neither are all experiments automatically committed requirements.

The reported migration bands are:

| Band | Contents / boundary |
| --- | --- |
| Minimum shell | Existing layers/map/navigation; inspector Layer tab with predicate controls, style and source facts; attention/status areas including scale display; Activity Jobs/Problems/Console; existing commands through `/` and plain search. Composed filter clauses must remain the one admitted predicate, faithfully recorded. |
| With the relevant backend piece | Feature attributes, categorical style and table with B1; `@` schema fields without implying statistics; Save/Prepare/workspace history with B2. Multi-selection needs its own identity/scope design and is not obtained merely by adding a panel. |
| Later | Bounded feature search, summaries, repeat/workflows, branching history, statistics/calculation previews, ghost text/pills/models and capability discovery. Research can continue without implementing these. |

### Nine seams, with limits that keep them small

These are the architect's proposed migration seams, refined here as **discussion constraints**, not an approved implementation specification.

| Seam | Future feature served | Smallest useful boundary / avoid |
| --- | --- | --- |
| Stable action IDs and a UI registry | Menus/search/shortcuts, later slots/previews | Reuse existing handlers and A/B/C exposure. Do not make binding-local actions public or route every pointer move/keystroke through a semantic command log. |
| Draft → resolved intent | New input methods without a new execution path | Keep a narrow internal representation. No universal parser, resolver service or new SKP schema just to open existing commands. |
| Typed state transitions | Workspace checkpoints and later repeat | Pure, composable reducers/state owners are sufficient. A reducer log is **not** durable history, data undo or a Workflow IR. Do not replay async effects by rerunning UI events. |
| State keyed by layer identity | More layers, per-layer table/style/filter | Distinguish a layer/view ID from its dataset resource identity and runtime generation. A single-entry map does not implement multi-layer admission or scheduling. |
| Selection separate from inspection | Multi-selection and explicit scope | Generation-bound selection can be a first contract. Cross-generation persistence requires validated identity mapping or a declared refusal/clear; it is not obligatory merely to support selection. |
| Explicit resolved scope | Stable targets, repeat and batch | Require scope where the action needs it; UI layout actions need no dummy dataset scope. Include relevant context version, and revalidate at execution. |
| Registered panel/tab/status contributions | New surfaces without layout surgery | Static typed contribution lists can suffice. No extension loader, plugin framework or generic UI engine. |
| Typed conditions | One home for failures and actionable states | Preserve reason, owner, resource/generation and lifecycle. Display adapters consume existing facts; they do not invent kernel remedies or merge distinct conditions just because text/severity matches. |
| Layout separate from workspace | Layout presets without recipe dirtiness | Keep panel visibility/sizes and transient focus outside semantic workspace checkpoints. Persist settings separately when authorized. |

Additional guardrails:

- Keep the map mounted through ordinary layout changes. Preserve intentional dataset/session lifecycle transitions; do not turn “mounted once” into a prohibition against required cleanup/reinitialization on rebind.
- Reuse P3b's generation protection rather than building a competing frontend epoch authority. Draft revisions can be client-local without being new kernel generations.
- Future history needs committed semantic changes, grouping, retained source references and an explicit restore contract. Recording every state event would retain noise and still miss external data state.
- The self-describing-kernel topic should become a **problem statement before SKP v1 freeze**, with the architect pointing to ADR-029, ADR-035 and the conformance work. Those relationships are reported here from the conversation; no new review of those ADRs is claimed in this update.

### Next human test and reference tracking

O-07: open the Bern delivery; filter W1 parcels above 1,000 m²; inspect three without losing a deliberately created selection; colour by zone; review what Save, Prepare and Publish promise. Distinguish existing-product steps from fixture-only/later-band steps. Record hesitation, wrong-scope assumptions and wording problems, not a generic approval of every simulated capability.

The architect asked the custodian to track v7 and the notebook under `state/drafts/design/` as non-authoritative references. **This assistant has not copied anything into the repository.** The custodian should perform that separately when authorized, adapting external links so tracked plans cite tracked references and preserving labels that distinguish simulations from product capabilities.

## 13. Research track after v7

Continue research in parallel with the walkthrough/migration planning. It should answer a named contract question, not generate an ever-larger GUI checklist. Close each batch with: cited observations, unknowns, one candidate boundary, its owning layer, and three tests. A result becomes a requirement only after a separate ruling.

Ready-to-use source lists and short, split NotebookLM prompts are in [Research batches 08–10](<./RESEARCH-BATCHES-08-10.md>).

| Batch | Decision it informs | Status |
| --- | --- | --- |
| 8 — Selection identity and lifetime | What survives filtering, source change, reopen and export? What is frozen versus recomputed? | Extraction reviewed with corrections; lifetime proposal awaits ruling |
| 9 — Jobs, cancellation and partial outcomes | What does Cancel guarantee, which outputs remain, and when is retry safe? | Extraction reviewed with corrections; owner-contract mapping remains |
| 10 — Contextual commands and accessible forms | What is visible, enabled, valid and authorized; how do defaults/slots change without overriding intent? | Extraction reviewed with corrections; keyboard/validation tests remain |
| 11 — Visual composition and masks | What affects drawing versus queries, picking, analysis and published data? | Extraction reviewed with corrections; candidate policy awaits ruling |
| 12 — Live derived layers and submodels | When is an effect a preview, a queryable result or a materialized artifact? | Full evidence and contract reviewed with corrections; candidate policy awaits ruling |
| 13 — Layer states and revision history | What is captured, which meaning of time applies, and what must remain available? | Evidence and proposals reviewed with corrections; candidate policy awaits ruling |

Run one batch at a time. Keep old sources archived, but deselect them for a new extraction, or use a separate notebook. Their absence from the active evidence set prevents an answer from quietly borrowing an unrelated rule. Prefer primary documentation for lifecycle/identity guarantees; tutorial videos remain useful for observing interaction and friction, not proving guarantees.

After these batches, use unresolved implementation-relevant questions to choose any next research, rather than automatically expanding to ten more topics. This research is not a prerequisite to finishing the agreed O-07 test or writing the minimum-shell migration plan.

### Reviewed synthesis of batches 8–10

The reports supplied on 26 September contained useful distinctions, but several citations did not support their attached conclusions. The detailed correction ledger, revised owner responsibilities and nine proposed tests are now in [Research batches 08–10 — reviewed results](<./RESEARCH-BATCHES-08-10.md>).

| Batch | Correction that affects our design | Minimum useful seam |
| --- | --- | --- |
| 8 | Selecting by expression is not automatically a continuously evaluated selection. A unique key within each revision does not alone prove identity continuity. Key regeneration does not prove coherent, immutable capture. | Separate inspected focus, generation-bound members and a saved rule. On generation change invalidate the old set; persistence needs a separate validated identity contract. |
| 9 | Cancel requested is not stop confirmed, rollback or cleanup. UI callback delivery is not artifact installation. The extract reversed a QGIS rollback caveat and strengthened MCP SHOULD to MUST. | Consume owner-reported outcome/effects and retain uncertainty. A stale result cannot update the active map, but known durable effects still need a record. |
| 10 | A custom Tab-completion mapping is not prescribed by ARIA. Disabled presentation differs by surface. Avoiding expensive synchronous validation does not require banning asynchronous validation. | Preserve user-input provenance, pinned target and draft/context binding. UI availability never replaces owner validation or permission enforcement. |

Recommended candidate rules for the architect, not accepted requirements:

- **Selection:** filtering and inspecting do not silently replace selected members; selected scope with zero members never silently means the whole layer. Re-running a saved rule can produce new members and must be labelled as such.
- **Identity:** use admitted identities within the current generation. For persistence, establish namespace/continuity and handling of duplicate, missing, reused, split or merged keys; do not add a hidden full-file scan on every selection.
- **Outcomes:** retain progress/control, owner outcome, completeness/quality and effects/cleanup as separate facts. Unknown client knowledge is not proof of owner failure. A complete empty result is not the same as an incomplete result.
- **Prepare/export:** artifact installation and cleanup are attested by the owning subsystem, not inferred from the UI. An uncertain export never authorizes blind append retry or automatic deletion of an unverified destination.
- **Drafts:** preserve explicit values when they become incompatible, show the error and require deliberate correction. Bounded async checks may be necessary for real operations; late checks cannot enable a different draft or generation.

This synthesis strengthens the proposed seams without adding new panels, a command engine, a validation service, a scheduler or a second generation authority. The research pass is closed with known gaps retained; the O-07 walkthrough and minimum-shell migration stay next.

### Layer research: creative interactions without hidden analytical scope

Christopher's next proposals borrow adjustment layers, masks, layer comps, blend groups, Smart Objects and versioned layers from creative tools. Their useful aim is to reduce repeated copying, exporting and panel manipulation. They do not become requirements merely by appearing here.

The premise needs correction: existing GIS is not limited to flat tables and opacity. QGIS documents compositing groups, render masking, map themes and render-time geometry generation; ArcGIS documents visual map clipping and reusable raster-function chains. The opportunity is a clearer, more integrated interaction model, not a claim that these mechanisms are absent from GIS. [QGIS groups/themes](https://docs.qgis.org/3.44/en/docs/user_manual/introduction/general_tools.html), [geometry generators](https://docs.qgis.org/3.44/en/docs/user_manual/style_library/symbol_selector.html), [ArcGIS clipping](https://doc.esri.com/en/arcgis-pro/latest/help/mapping/properties/clip-layers-in-a-map.html), [function templates](https://doc.esri.com/en/arcgis-pro/latest/help/analysis/raster-functions/raster-function-template.html).

The source packs and short two-part prompts are in [Research batches 11–13](<./RESEARCH-BATCHES-11-13.md>). As of the later 27 September review, all three batches have been critically reviewed, including the complete Batch 12 contract and Batch 13 proposals. No resulting policy is accepted merely by this review, and no additional prototype work is authorized.

#### Preliminary assessment of the six proposals

| Idea | Useful adaptation | Boundary and implementation band |
| --- | --- | --- |
| Adjustment layers / live buffers | A named derived view with editable parameters, an explicit input and a preview/materialize distinction. | Research now; engine/workflow work later. Do not silently change a buffer's inputs when unrelated layers move below it. A style outline, render-time geometry and a queryable metric buffer are different results. |
| Clipping masks | A reversible display mask attached to named targets, with visible mask provenance. | Strong future composition feature. Define picking, table and export scope separately. A mask changes the picture, not permissions; hidden data may still be delivered in a bundle. Raster examples also require the raster module. |
| Layer comps / saved states | Named presentation presets; later richer analytical scenarios. | Strong candidate after multi-layer state exists. Specify captured values versus live references. Filters can trigger new queries, so switching cannot be promised instant. Do not conflate presets with workspace undo or verified data snapshots. |
| Blending / passthrough | Explicit compositing scope, group isolation and a small justified set of blend modes. | Rendering feature, not numerical data fusion. Query scope must not inherit a graphics blending rule. Intermediate render surfaces have memory/performance costs to measure. |
| Smart Objects / precompositions | One visible output with inspectable inputs, parameters and a drill-in view of an existing workflow. | Reuse future Workflow IR; no second execution engine. Decide linked versus pinned definitions, cache invalidation, portability, cancellation and error propagation before promising reusable “smart layers”. |
| Time-travel layers | Choose a retained source revision and compare it with another under an explicit identity/analysis contract. | Long-term. Do not adopt Iceberg/Dolt for a timeline widget. Retention, coherent acquisition, multi-source consistency, feature identity and diff costs remain separate problems. |

All verdicts are recommendations for discussion, not new acceptance gates or scope additions to the minimum shell.

#### One layer is not one file: the important model distinction

Keep these concepts separate, extending the existing layer-ID seam rather than constructing six new frameworks:

- **Resource/revision:** the underlying dataset and what is actually known about its identity and consistency. A runtime generation over mutable bytes is not automatically a retained revision.
- **Layer/view instance:** a named view of a resource, with its own predicate, styling and visibility. Several views can share one source without duplicating its bytes; this does not guarantee all query/GPU buffers can be shared.
- **Composition:** draw order, masks, opacity and blend boundaries.
- **Analysis dependency:** explicit input references and transformations; not accidental adjacency in the layer panel.
- **Presentation preset or analytical scenario:** a declared bundle of view settings, or the richer combination of parameters and source/algorithm revisions.
- **History/time:** workspace checkpoints, source revisions and observation-time filters are different axes.

For example, “All parcels”, “W1 over 1,000 m²” and “Selected parcels for review” may become three views over one source. The last must say whether it follows a live selection, freezes generation-bound members or evaluates a saved rule. Naming it a layer does not solve Batch 8's identity problem. Selection, inspection and action scope remain explicit, and a stale shared source must not leave dependent views claiming current results.

Proposed interaction: **Duplicate view** should mean another configuration over the same source; **Create independent dataset** should mean a data-producing operation with a destination and lifecycle. Removing a view must not imply deleting its source.

#### Scope and correctness hazards worth researching

1. **Do not let cosmetic reorder rewrite analysis.** Stable input references should survive draw-order changes. Changing group membership may deliberately alter a visual effect's scope, but must show that scope. A bulk operation on a folder needs an explicit resolved target list, not a borrowed passthrough setting.
2. **A 500 m buffer is not a thick line.** The owner must resolve CRS, units, planar/geodesic semantics, tolerance and dissolve behaviour. A visible result can require inputs outside the viewport whose buffers cross into it. Neighbourhood and global operations have different execution bounds.
3. **Non-destructive does not mean free.** Live derivations still scan, compute, tessellate and upload. Preview coverage/resolution, cancellation and outdated results need explicit states; full analytical exports cannot silently substitute a display approximation.
4. **Masking is not redaction.** ArcGIS explicitly separates map clipping from query/analysis access. For us, exporting an image, exporting data and publishing a static bundle must each declare what they include. Hiding pixels alone must never establish a privacy claim. [ArcGIS clipping](https://doc.esri.com/en/arcgis-pro/latest/help/mapping/properties/clip-layers-in-a-map.html)
5. **Saved appearance is not an immutable scenario.** QGIS themes reference named styles; subsequent edits can change what a theme displays. Our future design should choose deliberately between following a shared style and pinning its value/version. Missing inputs must not be silently replaced with today's data. [QGIS map themes](https://docs.qgis.org/3.44/en/docs/user_manual/introduction/general_tools.html)
6. **A time slider needs a named clock.** Observation time, ingestion time, source commit time and workspace history can disagree. Iceberg's expired snapshots are unavailable for time travel. Dolt distinguishes its version commits from SQL transactions and documents that an AS OF view query can use today's view definition over historical rows. Data revision alone is therefore not a general reproducibility promise. [Iceberg maintenance](https://iceberg.apache.org/docs/latest/maintenance/), [Dolt history](https://www.dolthub.com/docs/sql-reference/version-control/querying-history/)

The project's existing distinction between reference Save and verified Prepare remains relevant. A content hash identifies bytes; it does not by itself guarantee coherent capture, retention, access or a matching historical workflow definition. “Unlimited Ctrl-Z” and instant spatial diffs remain unproven ambitions, not consequences of choosing content-addressed storage.

#### Additional layer-panel ideas to test, not add to v7

- **Independent switches for visibility, pickability and editability.** A visible reference layer need not intercept clicks; a UI edit lock is not filesystem permission or source immutability. Keyboard/screen-reader labels must explain the difference.
- **Temporary isolate/solo with a restore action.** Useful during inspection without destroying a carefully configured visibility preset.
- **Search and organize views by name, source, geometry kind or purpose.** Keep the focused panel row distinct from selected map features. Tags/folders need not change analysis membership.
- **A compact “what is this?” summary:** source or derived view, input references, current/limited/stale result and available provenance. Details on demand; no permanently expanded diagnostic prose.

Prioritize the model distinction and understandable basic layer controls, then presentation presets and masks, then justified live derivations/submodels. Rich temporal/versioned workflows wait for retained data and a use case. Raster remains a separate backend/display workstream under the previously inspected vector-only baseline; this research pass is not a new repository audit.

The only immediate architectural implication is to preserve the already proposed separation of layer identity, resource identity, generation, scope and layout. No mandatory new graph editor, cache service, plugin framework, renderer, database or SKP manifest follows. Later capabilities should expose their actual owner-defined scope, output kind, completeness and remedies through the future self-describing contract rather than teaching each client separate semantics.

#### Initial reviewed implications of Batch 11 and partial Batch 12 — 27 September

The correction ledger, owner proposals and test examples are in the research companion. This initial review used a truncated Batch 12 contract; the later continuation review below records the complete delivery.

The useful refinement is not another layer type for every idea. It is a separation between **what an operation means**, **how it executes**, **where its results live**, and **what scope/completeness it promises**. A queryable derived view need not be written to disk; a retained output is not automatically complete over the whole source. Calling a workflow non-destructive is insufficient unless its operations actually declare and enforce that policy.

Candidate decisions to take to the architect:

- **Captured versus live masks:** a retained captured boundary and a live source reference have different lifetimes. A missing live dependency should suspend the affected masked rendering with a named condition, not silently remove or approximate the mask. Capturing or removing it is an explicit action.
- **Picking versus table scope:** proposed default map picking follows visible/pickable content; table/query operations retain their explicitly declared scope, filters and authority. Display masking does not silently erase selected members or broaden an export.
- **Publishing:** use the approved data scope and disclose target support for visual effects. Do not adopt the extraction's automatic “all unclipped data” policy; do not equate a convincing mask with data redaction.
- **Dependency semantics:** draw-order changes must not retarget analysis. This does not dictate memory-array order, cache scheduling or a particular downstream GPU pass. Efficient physical execution may differ while preserving the same contract.
- **Derived work:** separate effect/result kind, evaluation strategy, backing/retention, scope/completeness and committed effects. Reuse existing lifecycle/generation protections; late work cannot claim a new target, and completed artifact effects remain recorded.

Corrections retained in the detailed ledger include overly broad persistence claims, an invented mask fallback, mandatory disk output, assumed model purity and “global means whole raster”. These are reasons to refine the contract, not abandon the concepts.

This initial review did not accept any implementation policy. The later continuation closes the missing research, without adding another prototype version or changing the minimum-shell migration.

#### Full Batch 12 and Batch 13 synthesis — later 27 September

The follow-up attachment includes the complete derived-layer contract and both the evidence and proposal for Batch 13. Repeated answers and copied NotebookLM controls were treated as transcript noise, not extra evidence. Detailed source corrections and revised tests are in the research companion.

Keep the valuable distinctions, but reject these accidental design changes:

- **Materialized is not automatically immutable.** Writing an output, caching it and protecting a coherently acquired revision are different guarantees. A visual preview, virtual derived view and persisted output need not be mutually exclusive lifecycle states.
- **Responsibilities are not new services.** CRS, lineage, caching, cancellation and completeness need owners; the source material does not require five new managers or prove full feature lineage. A valid schema is not proof of complete spatial coverage.
- **Parameter revision is not source generation.** Bind every asynchronous result to the relevant source/session generation and operation/parameter revision. Debouncing, cancellation and backpressure remain valid; do not require immediate restart or a new source session for every slider change.
- **Prepare keeps its established meaning.** It obtains or binds to a coherently acquired, retained immutable artifact under the recorded protection contract. Schema checks, parameter validation, licensing and mere revision existence are not substitutes.
- **Workspace history remains separate from feature-edit undo.** Saving a recipe must not silently clear checkpoints or commit edits. Session-only prototype history and future persistent retention remain distinct positions; unlimited history is still not promised.
- **Presets can follow or capture style.** QGIS's mutable-style precedent is useful, not mandatory. Make shared versus captured/versioned appearance explicit. Analytical scenarios additionally declare data and operation dependencies.
- **Time needs two independent questions.** Which source revision is available, and which domain-time interval is selected within it? A date field need not mean observation time; the meaning is configured. An old observation added today is absent from an older revision, not because one clock overrides another.
- **Reopening and recomputing are not the same promise.** A retained source revision alone does not preserve every historical algorithm, CRS transform or other dependency. A prior retained output can remain viewable even when rerunning its scenario is unavailable.

My recommended human-facing concepts are View presets, Scenarios, Time filters, Data revisions and Workspace history. They need not become separate panels or subsystems. Keep DAG IDs and hashes in expandable provenance; keep personal panel layout separate from semantic recipe state.

Research-derived next decisions for the architect, not automatic implementation:

1. Define whether each saved preset follows shared styles or captures settings, and how missing references are reported.
2. Specify derived-view scope/result identity and operation binding before adding live effects; use the existing future Workflow IR.
3. Preserve Save/Prepare and history boundaries. Later define which retained dependencies a scenario protects from cleanup and for how long.

The 11–13 research cycle is reviewed, with unknowns retained. Next consolidate these decisions and complete O-07/minimum-shell planning; commission another batch only for a concrete unresolved question. No storage-engine choice, new kernel manifest, prototype changes or repository edits follow from this review.

#### Architect consolidation — 28 September, decisions awaiting Christopher

Christopher supplied the architect's response to batches 11–13. It narrows migration-time work to (a) view identity separate from the resource, with separate drawing order, and (b) target-aware conditions. Other established seams remain; multi-view scheduling, masks, presets, derived resources and scenarios stay outside the minimum shell.

**Scoped verification:** read-only check of the local tree at HEAD `85cb849244016dd0e3b050d6138fc40af18d4947`; no tracked changes were reported at the check. No tests, remote status or whole-project audit performed.

- `protocol/skp/SKP-V0.md` §7.3 makes a filtered result part of a request, not a new addressable resource. §3 identifies session-scoped handles, and the idempotency shortfall says another open creates another Dataset and pool.
- `engine/src/pool.rs` declares **four stream connections**, with separate admission and maintenance classes. This is not a universal four-query/total-connection limit. Its header also documents cancellation/reacquisition overlap, so scheduling cannot assume a cancel immediately frees a stream slot.
- `frontends/shell/src/canvas/tileGridConstants.ts` permits three tile streams; the pool documentation accounts for the additional baseline query. Four stream connections is not a promise of four independently active views.
- SKP's `close_dataset` contract cancels all live streams for the dataset and invalidates pending tickets. Keeping an Arc alive protects memory lifetime, not another consumer's logical session.
- docs/11 and docs/13 already specify ResourceRefs, pinning and the Workflow IR as design direction. These documents do not establish that every lifecycle mechanism is implemented. Deferring addressable derived resources is consistent with the current protocol; lasting identity is a project design gate, not a universal technical requirement for all temporary query results.
- The local queue still lists watcher-first-read-on-watch-thread (C-1) and generation-close-races in progress. The architect's ordering rationale was not treated as proof of completion.

### Recommended answers, not recorded user rulings

| Architect question | Recommendation and qualification |
| --- | --- |
| 1. Presets change presentation, not filters? | Yes for presentation presets. Keep predicates on views; a different filtered view can share the source. Applying a preset must not silently retarget a staged command or change its bound data scope. Image/published appearance can change by design; do not promise that no kind of export changes. |
| 2. Live mask disappears: closed or open? | Fail closed for affected rendering, with a named condition. “Capture boundary” is eligible only when a complete usable boundary with known provenance is available; not an assumed remedy after loss, and never a partial/expired cache silently promoted to current truth. Explicit removal remains possible. A captured boundary and a live dependency keep distinct lifetimes. |
| 3. Click only visible, pickable content? | Yes as default. Respect masks and declared layer pickability. Tables/search can reach otherwise hidden records under their own scope. Preserve selected members and explain hidden counts. Later overlap disambiguation must not silently enable hidden layers. |
| 4. Remove last view, close source? | Yes only when it releases the last live consumer, or after explicit resolution of remaining work. A mask, dependent view or running operation may still rely on it. “Remove view” must not issue a broad close that cancels unrelated consumers. View-owned queries can be cancelled/drained under existing lifecycle rules. No separate Sources panel is required. |
| 5. Scenarios use Workflow IR rather than a new object model? | Yes to one semantic model and execution path. A friendly Scenario/preset-comparison UI can front that IR later; users need not manipulate a technical notebook. Promise revision-pinned only when all required inputs actually meet that grade and remain available. Missing inputs never become latest silently. |

The source-close qualification is the most important change. Today's single-view case can remain simple; future shared views need explicit ownership, not an assumption that the last visible panel owns every dependent operation. Hiding a view must also stay distinct from removing it.

Mask invalidation needs one further distinction: refusal of an uncommitted filter draft does not itself prove the currently applied mask is unavailable. Preserve a still-valid committed mask and show the draft refusal separately; do not turn a parameter error into a fabricated source-session end. Fail-closed rendering applies when the required applied mask actually cannot be provided under its binding.

Preserve the migration's small scope. Establish view/resource separation and condition targets without implementing Duplicate view or a scheduler now. A proposed test that Duplicate view never opens a second dataset belongs with that feature; migration can instead test existing view-to-resource binding and lifecycle. Conditions carry generation/context when relevant, not a fabricated source generation for a layout-only issue.

Next: Christopher answers the five questions, O-07 is completed, and the architect incorporates only the agreed provisions into the migration plan. This notebook records recommendations, not Christopher's acceptance; no repository files or prototype were changed.

## 14. Change log

### 28 September 2026 — Architect consolidation and decision advice

- Recorded the architect's narrow migration scope and five pending product choices.
- Verified the scoped protocol/pool/lifecycle facts; distinguished stream capacity from total queries and memory ownership from session validity.
- Recommended qualified agreement, especially closing only after the last live consumer and conditional availability of mask capture.
- No user decision inferred, and no implementation, prototype or repository changes.

### 27 September 2026 — Full Batch 12 continuation and Batch 13 review

- Received the complete contract and scenario/history research, closing the earlier truncation.
- Corrected unsupported model-export, immutable-file, owner-manager and source-generation assumptions.
- Preserved Save/Prepare and workspace-history meanings; distinguished style following/capture, domain time/revision and state restore/recomputation.
- Marked batches 11–13 reviewed, not accepted. Updated only the two external Markdown files.

### 27 September 2026 — Batch 11 and partial Batch 12 review

- Checked the supplied reports against primary documentation and a labelled supplemental QGIS output reference.
- Replaced automatic mask clearing/full-data publishing with explicit proposed scope and lifetime policies.
- Separated queryability, materialization and retention; rejected assuming all model operations preserve inputs.
- Recorded the truncated Batch 12 contract honestly. Updated only external Markdown; no prototype or repository edits.

### 26 September 2026 — Layer concepts and batches 11–13

- Evaluated creative-tool analogies against existing GIS mechanisms and separated presentation from analysis and revision history.
- Recorded explicit dependency, masking/privacy, CRS/preview, retention and historical-definition pitfalls.
- Prepared three focused source packs with short split prompts; extraction and product rulings remain pending.
- Added future layer-panel research ideas without changing v7, the migration band or any repository file.

### 26 September 2026 — Batch 8–10 critical review

- Checked the supplied extractions against primary sources; recorded corrections separately from future Spatial IDE policy.
- Corrected live-selection, persistence, key-regeneration, rollback, cancellation-strength and ARIA/validation inferences.
- Added revised candidate contracts, owners and acceptance examples to the research companion; linked their implications here.
- Marked the three batches reviewed, not accepted or implemented. No prototype or repository changes.

### 26 September 2026 — Architect agreement and research track

- Recorded the structural freeze and minimum-shell/later-band split, superseding the earlier suggestion to immediately grow v7.
- Recorded prefix, explicit-pill-acceptance and stale-target positions from the supplied architect conversation.
- Added limits to the nine proposed seams, especially reducer versus history, selection lifetime, action exposure and intentional map lifecycle changes.
- Preserved the architect-reported search-mode status leak as unresolved; did not change the prototype.
- Prepared three focused research packs. No claims that NotebookLM has already loaded/extracted them, and no repository changes.

### 25 September 2026 — Initial consolidated notebook

- Created beside the external prototype, without changing the repository or prototype.
- Consolidated the v1–v7 direction, seven research batches and the broader product notebook's backend implications.
- Distinguished current SKP/console exposure from proposed capabilities; retained current source-detection and Save/Prepare boundaries.
- Assessed all five search patterns, prioritizing slots and previews, explicit correction and shared drafts.
- Recorded future kernel discovery/outcome/remediation seams without making them prerequisites for v7.
- Left implementation authority and product acceptance with Christopher, the architect and their agreed process.
