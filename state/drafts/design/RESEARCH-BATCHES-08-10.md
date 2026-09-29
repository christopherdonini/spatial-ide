> **Design reference, not Authority.** Copied on 2026-09-29 from the human's prototype folder outside the repository (`prototype/RESEARCH-BATCHES-08-10.md`; sha256 2f7d3a7f55140a467b5ec00e665c7dbdbf0c7cdffe044b1703852f892b9e8583 of the source bytes), on the human's instruction (`state/directives/2026-09-29-design-references-and-layer-ruling.md`, items 1 and 2). It is design discussion for the Map studio direction (PLAN node `shell-redesign-map-studio`): it rules nothing, authorises no work, and no piece cites it as Authority. Two mechanical transformations were applied to the source bytes, in this order, and nothing else changed: (a) each link whose target is a file tracked with it in `state/drafts/design/` was made relative: the text between the link's angle brackets, `%USERPROFILE%/Development/Claude/Spatial IDE/prototype/<file>` in the source with the profile root spelled out, became `./<file>` (1 link in this file); (b) `node scripts/hooks/profile-path-scan.mjs --redact` was run over the result, replacing each remaining profile root with `%USERPROFILE%` (0 in this file). Everything below this header is the source after (a) and (b).

# Spatial IDE — Research batches 08–10

**Prepared:** 26 September 2026  
**Status:** Batch 8–10 extractions received and critically reviewed on 26 September 2026. Source corrections and candidate contracts are recorded below; architect rulings and implementation remain pending.  
**Purpose:** deepen the contracts behind future features while v7's structure remains frozen. No prototype or production implementation is authorized by this document.

Companion to the [living design notebook](<./SPATIAL-IDE-DESIGN-NOTEBOOK.md>). The agreed immediate product-design work remains the realistic parcel walkthrough and a minimum-shell migration plan.

## How to run these batches

1. Run **Batch 8 first**, then review its answer before Batch 9. Batch 10 follows.
2. Do not delete earlier research. Deselect old sources during the new extraction, or create a notebook per batch. If NotebookLM cannot load a source, report the missing source; do not quietly substitute remembered material.
3. Load only the URLs in the selected batch. The full design notebook is background for us, not evidence about how another application behaves.
4. Send Prompt A for extraction. Then send Prompt B for implications. They are deliberately separate and short.
5. Bring the results back for checking. An extraction is not automatically an accepted fact or an implementation specification.

### Evidence rules for every batch

- Cite source title and section; give version/date when stated. Do not invent timestamps for documentation or transcripts without timestamps.
- Separate documented behaviour, observed demonstration, inference and unknown. A missing statement is not proof that a feature is unsupported.
- Do not generalize provider-specific behaviour to an entire application, or a transport rule to a whole GIS operation.
- Prefer counterexamples and boundary cases to a catalogue of features. Sources do not establish how frequently people need a workflow.
- End with a small decision note: question, supported facts, unknowns, proposed invariant, owner, three tests. Leave wire schemas and implementations undecided.

## Batch 8 — Selection identity, lifetime and action scope

### Why this comes first

The architect correctly separated selection from inspection. The next question is what the selected identifiers mean and how long they remain valid. This affects multi-selection, Repeat, saved subsets, export, history and stale targets—well before it requires new panels.

Do not assume selection must survive every generation. A useful first version can explicitly clear/invalidate a generation-bound set. Persistent selection is a stronger feature requiring an identity and revalidation policy.

### Sources and reading bounds

| Source | Focus |
| --- | --- |
| QGIS 3.44 General Tools | §8.4 Interacting with features: selection versus identification, active-layer scope, set operations |
| ArcGIS Pro — Unique identifier fields | Identity requirements and warnings for query layers/database tables |
| ArcGIS Pro — Selection layers | What the saved selection references and its lifetime caveats |
| QGIS 3.44 QgsFeatureSink API | `FastInsert`, `RegeneratePrimaryKey`: output identifiers and provider caveats; not the entire class hierarchy |

Copyable sources:

```text
https://docs.qgis.org/3.44/en/docs/user_manual/introduction/general_tools.html
https://doc.esri.com/en/arcgis-pro/latest/help/mapping/layer-properties/choose-unique-identifier.html
https://doc.esri.com/en/arcgis-pro/latest/help/mapping/layer-properties/selection-layers.html
https://api.qgis.org/api/3.44/classQgsFeatureSink.html
```

### Initial source check — not a completed extraction

Esri explicitly cautions that selection layers refer to FIDs/OIDs that can become invalid when their source changes. That is evidence against assuming a selection is a durable snapshot. [Selection layers](https://doc.esri.com/en/arcgis-pro/latest/help/mapping/layer-properties/selection-layers.html)

The QGIS sink API also documents circumstances where output primary keys may be regenerated. That does not establish that every export changes IDs; it establishes that carrying IDs across outputs requires a provider/operation contract. [QgsFeatureSink](https://api.qgis.org/api/3.44/classQgsFeatureSink.html)

### Prompt A — extract evidence

```text
Analyze only the four Batch 8 sources. First report which loaded and any stated versions. Focus QGIS General Tools on section 8.4 and QgsFeatureSink on FastInsert/RegeneratePrimaryKey.

Extract a compact table: operation; active layer; selection versus inspected feature; identifier or predicate stored; lifetime; behaviour after filtering, source replacement/reopen, export or ID regeneration; explicit limitations. Cite title + section per row. Separate documented behaviour, inference and unknown. Do not infer persistence from the word “saved”, or assume every provider behaves alike.

Answer: when does a selection describe specific records, a live query, or a new dataset? What evidence permits carrying it to a new source revision? Which questions remain unanswered? Maximum 700 words; no product recommendations yet.
```

### Prompt B — derive candidate contracts

```text
Using only the verified Batch 8 findings, propose—not prescribe—a selection contract for Spatial IDE. Separate generation-bound selection, a saved identifier set, a live predicate and an exported snapshot. Consider hidden selected features, duplicate/missing IDs, row reordering, recreated layers and source replacement. Do not assume equal IDs prove equal feature meaning across revisions.

Return: 3–5 candidate invariants; what belongs in UI versus engine/resource identity; unknowns needing a test; and three Given/When/Then tests. Include a minimal option that invalidates selection on reopen, and the additional evidence needed for persistence. No implementation, generic framework or promise of indefinite history. Maximum 500 words.
```

### Decision this should unlock

Name the selection lifetime and invalidation rules. Decide what a minimal typed selection seam must distinguish now, and what persistent selection would need later. Do not design a complete multi-layer query engine from these four sources.

## Batch 9 — Jobs, cancellation, partial output and safe retry

### Why this comes next

Jobs, Problems and the attention strip already belong in the minimum shell. Future Prepare, queries, exports and raster processing will share these surfaces. They must not share an invented promise that Cancel means “nothing happened,” or that a failed-looking request is safe to repeat.

The outcome/conditions model needs to distinguish intent to cancel, observed termination, produced output, committed effects and cleanup. Existing lifecycle contracts stay authoritative; this batch informs questions for the architect, not their replacement.

### Sources and reading bounds

| Source | Focus |
| --- | --- |
| QGIS 3.44 Tasks cookbook | Introduction and cancellation/dependency examples; lifetime of task inputs and results |
| ArcGIS Pro — Use a geoprocessing tool | Progress/messages, output choices, run modes; not tool suggestions or scheduling |
| QGIS 3.44 QgsFeatureSink API | `RollBackOnErrors`, `finalize`, `flushBuffer` and provider-specific limits |
| MCP cancellation, 2025-06-18 | Request cancellation, late responses, races and what is not guaranteed |

The dated MCP page is a comparison reference, not a claim that Spatial IDE already uses that version or should copy its terminal-result semantics. The QGIS API page intentionally overlaps Batch 8, but a different contract is under examination.

Copyable sources:

```text
https://docs.qgis.org/3.44/en/docs/pyqgis_developer_cookbook/tasks.html
https://doc.esri.com/en/arcgis-pro/latest/help/analysis/geoprocessing/basics/run-geoprocessing-tools.html
https://api.qgis.org/api/3.44/classQgsFeatureSink.html
https://modelcontextprotocol.io/specification/2025-06-18/basic/utilities/cancellation
```

### Initial source check — not a completed extraction

The QGIS examples explicitly check cancellation during work, and describe dependency cancellation. That makes cancellation a lifecycle concern, not merely a button callback. [Tasks cookbook](https://docs.qgis.org/3.44/en/docs/pyqgis_developer_cookbook/tasks.html)

The dated MCP specification allows cancellation notifications to be ignored in specified circumstances and acknowledges races with completion. Our inference: a client sending Cancel cannot, on that fact alone, claim that a domain operation rolled back. [MCP cancellation](https://modelcontextprotocol.io/specification/2025-06-18/basic/utilities/cancellation)

### Prompt A — extract evidence

```text
Analyze only the four Batch 9 sources. Confirm loading/versions. Extract: who requests cancellation; who observes completion; work that may continue; outputs/effects already produced; rollback and cleanup guarantees; dependent tasks; late responses; UI status. Cite title + section. Separate task, provider, application and transport behaviour.

Distinguish successful completion with warnings, partial results, failure, cancel requested and confirmed termination where the sources support them. Mark missing retry/idempotency or rollback semantics UNKNOWN. A Cancel button or a false return value alone proves neither rollback nor safe retry. Focus the stated sections, not scheduling or AI suggestions. Maximum 700 words; evidence only.
```

### Prompt B — derive candidate contracts

```text
From the verified Batch 9 findings, propose questions/invariants for Spatial IDE's existing operation lifecycle and future outcome model. Separate progress, terminal outcome, result completeness and committed effects. Do not assume a new job protocol is needed.

Use three cases: cancelled read-only query; cancelled Prepare before/after artifact installation; interrupted export with uncertain completion. State what UI may claim, which subsystem must attest it, and what is needed before retry. Label all Spatial IDE behaviour as proposals, not existing implementation. Give three Given/When/Then tests covering cancel/complete races, stale-generation results and possible duplicate effects. Maximum 500 words.
```

### Decision this should unlock

Define which facts the conditions/jobs UI must receive rather than infer, and which uncertainty it must keep visible. Escalate protocol gaps to the owner. Do not turn a UI migration into a new cancellation scheduler or audit subsystem.

## Batch 10 — Contextual commands, dependent slots and accessible input

### Why this follows 8 and 9

The palette can be simple now while preserving the right distinctions for slots later. We need to know how a parameter change affects other parameters without overwriting an explicit user choice, how unavailable commands remain understandable, and how a keyboard user leaves the editor.

Visible, enabled, syntactically valid, semantically valid and authorized are different states. Registry-driven presentation should not merge them into one frontend Boolean.

### Sources and reading bounds

| Source | Focus |
| --- | --- |
| WAI-ARIA Combobox pattern | Popup choices, focus, inline completion and keyboard behaviour; not proof of token-editor accessibility |
| VS Code Contribution Points | Only `contributes.commands`, `contributes.menus`, `contributes.keybindings` |
| VS Code when-clause contexts | Context-dependent visibility/enablement and keyboard context; UI state is not server permission |
| ArcGIS Pro — Customizing script tool behavior | Defaults, dependent parameters, validation messages and avoiding costly work during validation |

Copyable sources:

```text
https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
https://code.visualstudio.com/api/references/contribution-points
https://code.visualstudio.com/api/references/when-clause-contexts
https://doc.esri.com/en/arcgis-pro/latest/arcpy/geoprocessing_and_python/customizing-script-tool-behavior.html
```

### Initial source check — not a completed extraction

VS Code distinguishes menu visibility conditions from command enablement, with different presentation across surfaces. This is useful precedent for avoiding one overloaded “available” property; it is not a reason to copy VS Code's entire extension framework. [Contribution Points](https://code.visualstudio.com/api/references/contribution-points)

Esri's validation guidance warns against expensive operations in per-change validation and demonstrates keeping user-altered values from being casually reset to defaults. That supports testing adaptive slots against responsiveness and preservation of explicit input. [Customizing script tool behavior](https://doc.esri.com/en/arcgis-pro/latest/arcpy/geoprocessing_and_python/customizing-script-tool-behavior.html)

### Prompt A — extract evidence

```text
Analyze only the four Batch 10 sources. Confirm loaded sources. In VS Code Contribution Points read only commands, menus and keybindings. Extract a cited matrix for visibility, enablement, context, parameter dependencies/defaults, user-altered values, validation cost, focus, Tab/Enter/Escape and inline completion.

Distinguish completing a suggestion from running an operation; hidden from disabled; UI conditions from authority to execute. Do not claim an ARIA combobox specifies a full pill editor or that a plugin contribution model is necessary. Flag conflicts and unaddressed cases such as IME composition and stale async suggestions. Maximum 700 words; evidence only.
```

### Prompt B — derive candidate contracts

```text
Using the Batch 10 evidence, propose the smallest contracts for Spatial IDE's existing-command palette, while deferring pills/models. Preserve @ for active-layer fields in the future band; layers use plain search. Explicit commands remain deterministic.

Return three recommendations, owners and three keyboard/state tests. Cover defaults versus explicit edits; missing/incompatible parameters; stale target context; Tab completion without execution or a focus trap; and showing an unavailable reason without inventing policy. Explain which seam is cheap now and which feature must wait. Do not prescribe a plugin framework or authorize a new prototype version. Maximum 500 words.
```

### Decision this should unlock

Choose the minimum palette/context/parameter contract and accessibility test obligations. It should be enough to support current commands and leave future slots possible without implementing a general form generator.

## What to return to the architect after each batch

Use this compact structure, not another long feature specification:

```text
Question this batch resolves:
Source-backed facts (max 3):
Unknowns / contradictory evidence:
Candidate rule for Spatial IDE:
Owner: UI / kernel / engine / persistence / adapter
Minimum seam now:
Feature deferred:
Three acceptance examples:
Decision needed, or no change to the migration:
```

Do not force a change. “Our current seam already covers this” is a useful result. If a source does not answer a safety-critical question, retain the unknown and propose a bounded test or owner review; do not invent the missing guarantee.

## Research stop rule

A batch is complete when its cited facts and unknowns are sufficient for the named decision. We do not need to exhaust every tutorial about the feature. New research should be driven by unresolved decisions, and it should not postpone the already agreed parcel walkthrough or minimum-shell migration.

## Reviewed results — 26 September 2026

Christopher supplied all three NotebookLM extractions and proposed contracts. This section is the reviewed synthesis, not a verbatim replacement of the submitted reports. Keep the original reports in the conversation/NotebookLM as input evidence; **do not treat their source-shaped citations as proof of proposed Spatial IDE behaviour**.

Review method: re-open primary documentation, check consequential claims, and separate documented facts from design recommendations. QGIS references are pinned to 3.44. The Esri pages use `/latest/`; the extracts label them 3.7, but a durable citation should retain access date/version evidence rather than assume the URL will stay fixed. No application implementation or provider experiment was performed in this review.

### Batch 8 review — selection needs a lifetime, not a universal persistence promise

#### Corrections to the extraction

1. **Select by Expression is not evidence of a live selection.** QGIS evaluates an expression to select matching feature IDs; retaining recent expression text does not subscribe that set to later source changes. The API distinguishes expression evaluation from the resulting ID set. [QgsVectorLayer selection API](https://api.qgis.org/api/3.44/classQgsVectorLayer.html)
2. **Uniqueness is not temporal identity.** A key can be non-null and unique in two revisions yet identify different objects in each. Esri's stated uniqueness-enforcement caveat concerns query layers/database tables, not every ArcGIS identifier. Its auto-incrementing integer restriction on the cited page concerns publishing specified query layers referencing registered stores, not all feature services. [Unique identifier fields](https://doc.esri.com/en/arcgis-pro/latest/help/mapping/layer-properties/choose-unique-identifier.html)
3. **An ID is not necessarily a physical row index.** Keep source-provided keys, provider IDs, row positions and generation-local handles distinct. Do not choose a type's persistence semantics from its name or numeric appearance. This is a proposed Spatial IDE distinction, not a claim that every provider implements all four kinds.
4. **Regenerating keys does not create a coherent immutable snapshot or erase lineage.** QGIS documents conditional sink support and a preference to regenerate keys in relevant cases; `FastInsert` may skip reflecting provider-assigned IDs in passed objects. Neither flag establishes capture consistency, durable immutability or universal severance of references. [QgsFeatureSink](https://api.qgis.org/api/3.44/classQgsFeatureSink.html)
5. **A warning is not enough if the action would be ambiguous.** The cited Esri page describes a limitation; it is not a recommendation for Spatial IDE to continue against a non-unique nominated key. Proposed policy: refuse that ambiguous ID-dependent operation or require an admissible identity mechanism. This does not mean every click should launch a full-file uniqueness scan.
6. **The proposed tests are our tests, not observed source behaviour.** Esri warns that selection-layer IDs may be invalidated by source changes; the page does not establish a particular visible automatic-refusal implementation. [Selection layers](https://doc.esri.com/en/arcgis-pro/latest/help/mapping/layer-properties/selection-layers.html)

The minimum-generation-bound option is sensible **as a product proposal**. It does not need proof that QGIS persists selections in `.qgz` files. That unanswered QGIS question can remain unknown without blocking our choice.

#### Four meanings to keep explicit

| Meaning | What the user is retaining | What happens after a source revision changes |
| --- | --- | --- |
| Current selection | A set of engine-admitted feature identities in one admitted generation | Ends with that generation unless an explicit validated mapping is introduced |
| Saved identifier set | Keys plus resource namespace/revision and an identity contract | Revalidate continuity, missing/duplicate/reused keys and allowed mappings; do not apply by matching numbers alone |
| Saved rule | Predicate plus its schema/CRS/context dependencies | Re-evaluate deliberately; this produces a new result set, not a guarantee of the old members |
| Exported subset | A new dataset with a declared acquisition/reproducibility level | Identity and lineage are explicit; new keys do not alone make the bytes immutable or the acquisition coherent |

**Example:** selecting all W1 parcels over 1,000 m² today captures members. Saving that rule for tomorrow may include newly added parcels and omit changed ones. Both are useful; calling both “saved selection” would obscure the difference.

#### Candidate contract for the architect

- **Owner:** engine/resource identity admits identifiers and source context; the shell owns interaction state and presentation without inventing identity guarantees.
- **Minimum seam now:** keep inspection separate from a generation-bound selection, with explicit layer/view context and action scope. Use the existing generation authority, not a second frontend revision system.
- **Within a generation:** proposed filtering/visibility changes can hide members without silently changing selection. Show hidden-selected counts where known. Empty selection must never silently become all features for a selection-scoped action.
- **At generation end:** mark selection unavailable and prevent dispatch; on explicit reopen, start a new valid empty selection unless an independently designed restore succeeds. Showing a historical count is not permission to reuse its IDs.
- **Deferred feature:** persistent selection with namespace, identity continuity, missing/split/merged-member handling and retention policy. Stable keys can preserve object identity without preserving the object's old geometry or attributes.

**Three proposed acceptance examples:**

1. Given ten selected features, when a filter hides four and the user inspects another feature, then the selected set stays ten with four hidden; inspection does not replace it.
2. Given selected IDs in generation N, when a replacement source creates N+1 containing equal-looking IDs, then an N-scoped action is refused as stale rather than retargeted; no automatic ID transplant occurs.
3. Given an ambiguous nominated persistent key, when an action requires unambiguous member mapping, then it is blocked with the owning identity reason; a warning followed by arbitrary matching is not acceptable.

**Decision left open:** adopt generation-bound selection first, with persistence explicitly deferred? This review recommends yes. None of these tests is represented as already passing in the product.

### Batch 9 review — cancellation, commitment and observation are separate

#### Corrections to the extraction

1. **The rollback caveat was reversed.** The QGIS base API describes some sinks ignoring the flag because they always roll back, while others can accept partial additions when the flag is absent. It does not document the asserted permission to ignore a requested rollback and retain partial additions. This still does not establish cancellation rollback for arbitrary processing tools. [QgsFeatureSink flags](https://api.qgis.org/api/3.44/classQgsFeatureSink.html)
2. **MCP says SHOULD, not MUST, for ignoring a late response.** It separately permits a receiver to ignore cancellation in specified circumstances, including prior completion. Sender-side late-response handling and receiver-side cancellation handling are different decisions. [MCP cancellation, 2025-06-18](https://modelcontextprotocol.io/specification/2025-06-18/basic/utilities/cancellation)
3. **A cancellation flag is not proof of termination.** The QGIS task examples poll it; the result callback receives completion information, and a false result alone does not distinguish every cause. Deleting task objects is not evidence that generated files were removed. [QGIS tasks](https://docs.qgis.org/3.44/en/docs/pyqgis_developer_cookbook/tasks.html)
4. **Adding a layer to a project's main-thread model is not a filesystem commit boundary.** The QGIS example's ownership transfer is a lifecycle issue for that result object. It cannot define when Spatial IDE's prepared artifact becomes installed. That fact must come from the subsystem performing the installation.
5. **A read-only query can already have changed the preview.** “No source edits by this operation” is narrower than “workspace unaffected.” Retry may be non-mutating yet produce different results against a changed source, overlap unfinished work or consume more resources. Do not label it unconditionally immediate or reproducible.
6. **No blanket deletion before retry.** An interrupted export's destination may contain valid completed output, pre-existing data or unrelated user files. Cleanup needs exact ownership, known state and appropriate authority. Confirmation alone does not make an append retry idempotent.
7. **Stale presentation is not nonexistent output.** A result from N must not update the N+1 map. If it legitimately produced a durable artifact, however, retain the job/effect record and manage the artifact through its owner; do not pretend it vanished with its UI callback.

The ArcGIS source supports progress and success/warning/failure presentation, but does not fill the missing output-cleanup or retry contract. Do not use the generic MCP cancellation page as a complete definition of successful GIS output. [ArcGIS geoprocessing tool UI](https://doc.esri.com/en/arcgis-pro/latest/help/analysis/geoprocessing/basics/run-geoprocessing-tools.html)

#### Candidate contract for the architect

Retain the four useful dimensions, but include unknown/unconfirmed observations and do not freeze enum spellings here:

| Dimension | Question / example |
| --- | --- |
| Progress and control | Queued/running phase; cancellation requested versus acknowledged stop |
| Owner-reported outcome | Success, deliberate refusal, invalid request, execution failure or cancellation, according to the actual owner contract |
| Completeness and quality | Complete/partial/unknown; warnings/degradation separate from completeness. A successful empty query can still be complete. |
| Effects and cleanup | None, provisional, committed, partly committed or unknown, with artifact/operation ownership and cleanup state |

“Connection lost / outcome unknown” is a client's knowledge state, not proof that the owner failed. Likewise, cancelling receipt of a stream is not proof that its producer stopped.

| Scenario | Safe proposed presentation | Owner / condition before retry |
| --- | --- | --- |
| Read-only query | Cancelling until termination is attested; then show actual preview disposition and source non-mutation only if supported | Query/stream owner attests stop; shell rejects stale batches; revalidate scope/source for a new query |
| Prepare before installation | Cancelled before installation only after owner confirmation; separately report temporary data/cleanup | Artifact installation owner, not a generic UI callback; retry after reconciling leftover owned temporary state |
| Prepare after installation | Installed successfully before cancellation, with current binding/rebind state stated separately | Retain artifact identity and operation outcome; explicit reuse/selection may avoid needless recapture |
| Export with lost completion | Outcome/effects unconfirmed; no automatic second append or cleanup | Reconcile the owned destination/job record or use a designed idempotency mechanism; destructive recovery needs explicit scope/authority |

**Minimum seam:** consume owner facts through the existing operation/conditions path; preserve operation identity and relevant context. No new scheduler, all-purpose job protocol or UI-inferred rollback guarantee.

**Three proposed acceptance examples:**

1. When cancel races with artifact installation, the install owner records one actual committed/not-committed outcome; the shell does not infer “not installed” merely because cancellation was requested or a transport reply was ignored.
2. When a late N result arrives after N+1 is active, it cannot mutate N+1; any known durable effects remain represented in the owning job/artifact record.
3. When an append export loses its completion reply, retry cannot blindly append again; the system exposes uncertainty until reconciliation/idempotent retry is available. Unrelated or pre-existing files are never automatic cleanup targets.

**Decision left open:** what facts do existing operation APIs already provide, and which are missing? Answer by a scoped owner review before any protocol amendment. These sources motivate the questions but do not supply Spatial IDE's implementation.

### Batch 10 review — keep completion, validation and authority distinct

#### Corrections to the extraction

1. **The two-Tab behaviour is not the ARIA combobox contract.** APG puts the combobox in normal tab order, describes Enter accepting a suggestion, and varies focus handling by popup type. It does not prescribe first-Tab completion retaining input focus followed by second-Tab exit. This can be a Spatial IDE experiment, but cannot cite APG as proof of conformity. [Combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
2. **Do not infer business execution from Enter accepting a value.** The current product desire is Tab-to-complete without execution. Preserve it as an explicitly tested keyboard decision, with an accessible exit and Shift+Tab path. IME composition must not unexpectedly trigger Run. No keyboard change to v7 is made by this review.
3. **Disabled does not always mean visibly grey.** VS Code's documented presentation differs: disabled commands are omitted from its palette but shown in an editor context menu. Spatial IDE should choose its own discoverability policy rather than claim one uniform precedent. [VS Code contributions](https://code.visualstudio.com/api/references/contribution-points)
4. **Client context keys are not execution authorization or a race barrier.** Two vector layers can have different identities/generations while sharing the same type-based context key. Owner validation must check the resolved target at dispatch. No general-purpose `when` expression engine is needed to achieve that.
5. **The validation advice is not a ban on asynchronous validation.** Esri warns against expensive work in per-change ToolValidator hooks and demonstrates preserving altered inputs. It does not establish that Spatial IDE must postpone all async schema validation, nor that every validation runs on a particular thread. [ToolValidator guidance](https://doc.esri.com/en/arcgis-pro/latest/arcpy/geoprocessing_and_python/customizing-script-tool-behavior.html)
6. **Licensing, parameter enablement and authorization are not synonyms.** Do not infer that a licensing check automatically disables each parameter or provides the security policy our engine needs. IME/stale-suggestion risks are our engineering test cases, not behaviour documented by an unrelated citation.

#### Candidate contract for the architect

- **Preserve explicit input:** mark a value's provenance (default/context/user) using the smallest useful representation. When context makes a user value incompatible, keep it visible with an error rather than silently rewriting it. Provide an explicit reset-to-default action where needed.
- **Keep owners small:** shell adapters determine presentation; existing semantic owners validate their operation; actual permission boundaries enforce authority. These are responsibilities, not an instruction to build separate “Command Engine” and “Validation Service” subsystems.
- **Cheap checks first:** local parsing and known metadata can update synchronously. Where a current feature genuinely needs expensive validation, use bounded/cancellable asynchronous work with pending state, draft/context binding and final owner revalidation. Do not launch it merely to keep every suggestion fully populated.
- **Separate readiness from authority:** visible/enabled/complete/validated/authorized do not collapse into one Boolean. A pending or stale result cannot be promoted to valid by changing only its display.
- **Keyboard design remains a testable choice:** Tab never executes; completion must not trap focus; Enter must distinguish accepting/finishing a draft from executing a ready action and must not bypass required review/approval. Do not adopt a two-Tab rule without testing keyboard and assistive-technology behaviour.

**Three proposed acceptance examples:**

1. Given a user-entered field/distance, when the resource changes and that value is incompatible, then the draft keeps the value, marks the mismatch and blocks Run; reset is explicit.
2. Given keyboard or screen-reader use, when completing a suggestion, leaving with Tab/Shift+Tab/Escape or composing text with an IME, then focus remains understandable and no accidental execution occurs. Assess the chosen mapping rather than asserting a custom mapping is mandated by APG.
3. Given validation for draft D on generation N, when D+1 or N+1 becomes current before the reply, then that reply cannot enable execution or replace the new draft's diagnostics; execution checks the resolved owner context again.

**Minimum seam:** presentation adapters over existing handlers, one draft with contextual provenance, and generation/draft-aware application of async results. Pills, models, generic form builders and a context-expression framework remain deferred.

## Consolidated disposition

These batches are **reviewed, with corrections**, not “all proposed contracts accepted.” They add three useful invariants to the architect discussion:

1. Selection references have declared lifetimes; a saved rule is not the same as saved members.
2. Cancellation intent, owner outcome, output completeness, durable effects and client uncertainty are not interchangeable.
3. UI suggestions/defaults are advisory; explicit user values and resolved targets survive until deliberately changed or marked invalid.

The minimum-shell migration is not reopened. The implementation owner should map these invariants onto existing identity/lifecycle/condition paths before proposing new abstractions. The realistic parcel walkthrough remains the next product-design activity; more research should answer a named remaining question, not postpone it.
