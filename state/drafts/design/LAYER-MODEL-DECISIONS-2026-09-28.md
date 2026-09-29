> **Design reference, not Authority.** Copied on 2026-09-29 from the human's prototype folder outside the repository (`prototype/LAYER-MODEL-DECISIONS-2026-09-28.md`; sha256 8d8c1cdb1ace57b09b76b0e6dbe74225cb28770ae7b2b92bcbaa3fdc493f2688 of the source bytes), on the human's instruction (`state/directives/2026-09-29-design-references-and-layer-ruling.md`, items 1 and 2). It is design discussion for the Map studio direction (PLAN node `shell-redesign-map-studio`): it rules nothing, authorises no work, and no piece cites it as Authority. The human's 2026-09-28 answers that its §3 quotes are filed as a ruling, in `state/directives/2026-09-28-layer-model-decisions.md` and a dated RULED block in `DECISIONS-PENDING.md` (the directive's item 3). This copy stays a design reference. It is an input to the minimum-shell migration plan (item 4). Two mechanical transformations were applied to the source bytes, in this order, and nothing else changed: (a) each link whose target is a file tracked with it in `state/drafts/design/` was made relative: the text between the link's angle brackets, `%USERPROFILE%/Development/Claude/Spatial IDE/prototype/<file>` in the source with the profile root spelled out, became `./<file>` (0 links in this file); (b) `node scripts/hooks/profile-path-scan.mjs --redact` was run over the result, replacing each remaining profile root with `%USERPROFILE%` (0 in this file). Everything below this header is the source after (a) and (b).

# Layer model decisions — 2026-09-28

*Design reference, not Authority. Written by Fable (main architect) on 2026-09-29. It consolidates Fable's assessment of research batches 11–13 ([RESEARCH-BATCHES-11-13.md](./RESEARCH-BATCHES-11-13.md), with the notebook's §13) and the human's decisions of 2026-09-28, which §3 quotes verbatim. It feeds the minimum-shell migration plan, which Fable writes after the human's O-07 walkthrough. It is not an ADR. It accepts nothing beyond the human's decisions in §3, and authorises no implementation beyond what that plan will preregister. v7 stays structurally frozen.*

## 1. Repository facts that shaped the decisions

Checked on main on 2026-09-28, by file and symbol:

1. **A filter belongs to one query, not to the data.** A predicate and a column projection are part of a single `viewport_query` request, and a filtered result is not an addressable resource (`protocol/skp/SKP-V0.md` §7.3). Several views over one source need no data copy and no protocol change.
2. **Opening the same file twice duplicates everything.** A second `open_dataset` creates a second dataset, connection pool, watcher and generation (SKP-V0 §8, item 9). "Duplicate view" must never be built as a second open.
3. **Views over one dataset share its query budget.** The per-dataset stream pool is `MAX_STREAM_CONNECTIONS` = 4 (`engine/src/pool.rs`); a fifth concurrent stream fails with `engine.connections_exhausted`. Several active views over one source is a scheduling problem, designed when multi-view is built.
4. **Nothing has a lasting identity yet.** Every handle is session-scoped; docs/11's ResourceRef and ADR-016's stability across reopen are unmet (SKP-V0 §3). Queryable derived results, pinned revisions and scenarios wait on this.
5. **Publish and the Workflow IR already exist as contracts.** The publish approval states row scope and any active filter in words, never silently dropped (ADR-024). docs/13 defines the Workflow IR as a typed graph over ResourceRefs with side-effect classes (ADR-006) and reproducibility grades (ADR-005: a derived output is graded by its weakest input).
6. **Today the shell closes the current dataset unconditionally when another is opened** (`frontends/shell/src/App.tsx`, the admitted dataset's effect cleanup calls `closeDataset`). Whether that interrupts a publish in progress was not traced; the migration plan tests it (§4, item 4).

## 2. Assessment of batches 11–13

| Finding | Verdict | Reason |
|---|---|---|
| Resource, view, generation and action scope are separate identities | Keep | Seam 4; facts 1–2. |
| Several views share one source without duplication | Amend | True for data and session; false for query work (fact 3). |
| "Duplicate view" vs "Create independent dataset"; removing a view ≠ deleting its source | Keep | Duplicating is shell-only; an independent dataset is an approved class-3 output with a destination (ADR-006, ADR-024). No view action deletes a source file. |
| Drawing order separate from analysis inputs | Keep; existing rule | docs/01 principle 8; docs/13's explicit inputs. Test bindings, not memory layout or render passes. |
| Captured vs live masks | Keep; live first | A captured boundary is geometry written into the project file: it needs a CRS and a size cap, and travels with the project. Capture is an explicit, later action. |
| Suspending masked drawing when a live source is lost | Amend | Decided in §3, item 2 (fail closed). |
| No silent unmasking, no bounding-box substitution | Keep; existing rule | Principle 8. |
| Separate scopes for picking, tables, export and publish | Keep | Publish part is existing (ADR-024, ADR-017); picking decided in §3, item 3. |
| Six axes for derived work | Keep as a checklist for Workflow IR steps, not a schema | Side effects and input binding exist (ADR-006, docs/13); coverage/completeness and picture-vs-data are new. |
| Queryable virtual derived layer | Defer | Blocked by SKP-V0 §7.3 until lasting resource identity. |
| A saved file is not automatically immutable | Keep; existing rule | docs/11's pinning lifecycle; Prepare's protected capture. |
| Five new "managers" | Reject as components | Responsibilities allocated: CRS/units to the engine; lineage to the Workflow IR and lineage store; invalidation to the resource owner (ADR-035 events, ADR-005 grades); cancellation to the ticket machinery (ADR-019); completeness to each operation's outcome. |
| Parameter revision ≠ source generation | Keep; already done | Client-local draft revisions and the shell's generation checks. |
| Presets follow shared styles vs keep their own | Defer "follow" | No shared style library exists; a preset keeping its own copy is the only meaning today. "Follow" arrives later as opt-in; a missing followed style is a named problem. |
| Scenarios as a new concept | Amend | docs/13 covers them (§3, item 5). |
| Time filter vs choosing a source revision | Keep, simplified | A time filter is a predicate on a declared date field through ADR-021's admission; revision choice is a ResourceRef binding (long-term). |
| Reopen vs view a stored result vs recompute | Keep | Three commands, three labels; grades decide what each may claim. |
| Save, Prepare and history meanings | Keep unchanged; existing | 2026-09-18 handoff Part 3; ADR-006; notebook §3.5. Save never clears history; history stays session-only for B2. |

**Existing rules, cited rather than decided:** principle 8; ADR-005 and docs/11 (no missing revision becomes "latest"; weakest-input grading; pinned resources kept); ADR-006; ADR-024 and ADR-017; docs/13; docs/03 (stale is visibly stale); ADR-035 (session end as the invalidation signal); SKP-V0 §7.3; the recorded Save and Prepare meanings.

## 3. The human's decisions, 2026-09-28

The questions as Fable asked them (titles):

1. Should presets only choose among views, and never change filters?
2. When a live mask's source disappears, fail closed or open?
3. Should map clicks only hit visible, pickable features?
4. Should removing a source's last view close its session?
5. Should a scenario be a Workflow IR notebook with pinned inputs and a displayed grade, rather than a new kind of object?

The human's answer, verbatim:

> I agree with the narrowed migration scope. My preferred answers are:
>
> 1. Yes: presentation presets do not change filters. Filters belong to views; different filtered views may share one source. Applying a preset must not silently retarget an already-staged command. This protects data scope, while exported images can naturally change appearance.
> 2. Fail closed when the required live mask is unavailable. Show a named problem; never silently unmask or substitute a bounding box. Offer Capture only when a complete usable boundary with known provenance is actually available. Also distinguish a refused filter draft from losing the applied mask: a failed edit should not discard a still-valid committed mask.
> 3. Yes: map clicks target visible, pickable content. Tables and search keep their declared scope. Hidden selected features should remain selected, with their hidden count explained.
> 4. Close the session when its last live consumer releases it. Removing the last view normally does that, but a dependent mask, view or running operation may still own it. Removing a view must not silently cancel unrelated work. No separate Sources panel is needed; hiding a view must remain different from removing it.
> 5. Yes: scenarios use the existing Workflow IR direction. No second execution model. Later, we can offer a friendly Scenario interface without requiring users to understand a technical notebook. Claim revision-pinned only when the inputs actually satisfy that guarantee; missing revisions never become latest.
>
> Keep migration limited to view/resource separation, drawing order and target-aware conditions alongside the already-planned seams. Don’t implement Duplicate view or scheduling just to demonstrate the future architecture.
> After O-07, fold these decisions into the minimum-shell migration plan.

## 4. Consequences Fable noted

1. **Capture needs a complete boundary from the engine.** The canvas holds only features streamed for the viewport, so it can never supply "a complete usable boundary with known provenance". Capture needs the engine to return the whole mask geometry for a named generation. Later band.
2. **Mask edits follow the filter's draft/commit split.** A refused filter never replaces the active one; mask edits work the same way.
3. **The hidden-selection count uses facts the shell already holds:** the selected members compared with what is drawn, labelled by reason where known (outside the view, under a mask, view hidden). No hidden whole-file scan.
4. **"Last live consumer" is a set, not a flag.** The resource entry records its consumers: views, dependent masks or views, and running operations such as a publish. The migration plan tests that closing or replacing a dataset while a publish runs either waits or asks, and never cancels silently (fact 6).

## 5. What the minimum-shell migration takes from this

Only these, beside the nine already-planned seams:

| Provision | Owner | Serves later | Test idea |
|---|---|---|---|
| View state separate from the resource: state keyed by view id, with a separate resource key and the resource's consumer set | Shell state (seam 4) | Duplicate view, presets, masks, several layers | Nothing in the shell calls `open_dataset` except the open command; a running publish is a consumer (§4, item 4). |
| Drawing order as its own list of view ids | Shell composition | Masks, groups, reorder | Reordering changes no query, filter or action target. |
| Conditions that name their target (a resource or a view) and generation | Shell conditions model (seam 8) | Mask unavailable, stale derived view, missing revision | A condition raised for one view does not appear on another view of the same source. |

Not in the migration: Duplicate view, multi-view scheduling, masks, presets, derived views, scenarios.

## 6. Bands

- **Minimum shell:** §5's three provisions; one view per source in practice; scope and publish approval unchanged.
- **Later, needing backend work:** several views and Duplicate view (after multi-stream scheduling); presets (after several views); live masks (renderer clipping and a mask-geometry query); Capture (§4, item 1); Create independent dataset (an approved export); derived views on the Workflow IR, queryable ones after lasting resource identity; Save, Prepare and history (B2).
- **Long-term research:** scenarios with pinned revisions and a friendly Scenario interface; choosing revisions; persistent or branching history; feature lineage and diffs; retention of captured boundaries.
