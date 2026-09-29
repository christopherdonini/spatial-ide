# Directive — the layer-model decisions of 2026-09-28 (the human, verbatim)

*Custodian's filing note (2026-09-29): the human's answers of 2026-09-28 to Fable's five questions on the layer model. They are filed as a ruling on the human's instruction (`state/directives/2026-09-29-design-references-and-layer-ruling.md`, item 3). The human's sending of that message confirms the quote is theirs. The words below the rule are byte-copied from §3 of `state/drafts/design/LAYER-MODEL-DECISIONS-2026-09-28.md` (source sha256 8d8c1cdb1ace57b09b76b0e6dbe74225cb28770ae7b2b92bcbaa3fdc493f2688), with only the blockquote marker `> ` removed from each line. They are the human's words only: Fable's question titles, assessment and consequences stay in that design reference. Cited as "the 2026-09-28 layer-model decisions" with their item numbers. They feed the minimum-shell migration plan, which Fable writes after O-07 (PLAN node `shell-redesign-map-studio`).*

---

I agree with the narrowed migration scope. My preferred answers are:

1. Yes: presentation presets do not change filters. Filters belong to views; different filtered views may share one source. Applying a preset must not silently retarget an already-staged command. This protects data scope, while exported images can naturally change appearance.
2. Fail closed when the required live mask is unavailable. Show a named problem; never silently unmask or substitute a bounding box. Offer Capture only when a complete usable boundary with known provenance is actually available. Also distinguish a refused filter draft from losing the applied mask: a failed edit should not discard a still-valid committed mask.
3. Yes: map clicks target visible, pickable content. Tables and search keep their declared scope. Hidden selected features should remain selected, with their hidden count explained.
4. Close the session when its last live consumer releases it. Removing the last view normally does that, but a dependent mask, view or running operation may still own it. Removing a view must not silently cancel unrelated work. No separate Sources panel is needed; hiding a view must remain different from removing it.
5. Yes: scenarios use the existing Workflow IR direction. No second execution model. Later, we can offer a friendly Scenario interface without requiring users to understand a technical notebook. Claim revision-pinned only when the inputs actually satisfy that guarantee; missing revisions never become latest.

Keep migration limited to view/resource separation, drawing order and target-aware conditions alongside the already-planned seams. Don’t implement Duplicate view or scheduling just to demonstrate the future architecture.
After O-07, fold these decisions into the minimum-shell migration plan.
