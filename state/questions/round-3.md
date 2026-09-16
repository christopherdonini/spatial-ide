Question round 3 — 2026-09-15 (custodian → human). Three items: the ADR-031 route-B preregistration draft (C3 step 2), its dependency decision, and P3's format-default CRS spelling (the P1 reviewer's Finding 1).

1. ADR-031 LOD preregistration — the architect's draft with the five open questions pre-committed (engine/LOD-PREREGISTRATION.md on main, 336 lines; every cite verified mechanically by the custodian). The pre-committed choices, one line each:
  - Simplifier = geo::SimplifyVwPreserve (0 invalid in every spike run; RDP's failure is structural in geo — it cannot drop a collapsed hole — so choosing RDP means writing GEOS's ring post-processing ourselves on the correctness path with no in-tree oracle). Falsifier: any invalid polygon → the piece stops and returns to you.
  - Q1 tier count = a fixed ladder of 3 derived tiers over tier 0 = the source (declared constant, not discovered).
  - Q2 tolerance = a typed length declared in metres, converted explicitly via the CRS's ADR-026 linear unit, factor recorded on the tier; geographic CRS refused (engine.lod_crs_not_linear); never screen pixels (pixels belong at selection time through the visible view transform).
  - Q3 tiers on disk = one GeoParquet per tier in a content-hash-keyed sidecar directory + plain-text tiers.json; row order untouched; layout.rs stays out of the product path (its import gate failed).
  - Q4 invalidation = found by path, admitted by content-hash key (the existing IndexCache rule); a stale tier is NEVER served; lazy cancellable rebuild on next request; label lod.tier_stale declared and reserved now.
  - Q5 ADR-028 = tier vertices CHARGED against the unchanged MAX_RESIDENT_VERTICES; "over budget" not redefined; lod.tier_resident{tier} declared, shell surface owed under its own gate.
  - Cancellation = per-feature cooperative check (the spike's row-group design measured 9.952 s detection latency, ~100× outside docs/08's < 100 ms); ceiling 100 ms declared with its residual (no interruption point inside one geo call) measured and reported.
  - Arrow = the product does not take Arrow 59; the tier writer uses the in-tree parquet 58 against arrow 58; if geo/wkb/geo-traits force a second Arrow major, the piece stops.
Options:
  1. Accept the draft as pre-committed (Recommended): ADR-031 is drafted from it; the crate set is item 2 below; the piece starts only after item 2 is ruled.
  2. Hold: you read engine/LOD-PREREGISTRATION.md yourself before ruling; nothing proceeds.
  3. Accept with changes: name the choice(s) you want changed (type them); the change is recorded as a class-5 amendment quoting your words.

---

2. The dependency decision the C3 ruling reserved to you ("the product dependency decision rides the preregistration's ruling"). Two parts, both in the draft's §8: (a) the crate set — geo 0.33.1, wkb 0.9.2 (its writer now needed, never exercised by the spike), geo-traits 0.3.0 — all stated MIT-OR-Apache-2.0 at the top level by the spike; the transitive closures are NOT yet verified (a gate step before any cargo add; any incompatibility stops the piece); (b) parquet 58 becomes non-optional in engine/Cargo.toml (today optional behind the fixture feature) — no new crate, but it changes the conveyed artifact's notice set (ADR-030), and it is not patch-level under your C4 ruling.
Options:
  1. Approve both, subject to the gate steps (Recommended): the three crates may be added and parquet promoted once transitive licences are recorded compatible and no second Arrow major appears; the notice set regenerated and the lockfile diff read in the same PR.
  2. Approve the crate set only; parquet's promotion comes back to you with the writer's design.
  3. Hold: no dependency added until you have read the draft.

---

3. P3 — the format-default CRS class's describe/publish spelling (the P1 reviewer's Finding 1, deferred to your sight). Today a dataset admitted under crs:format-default reports describe.crs.source = "file", which is false for that class. The worker's proposal, NOT applied: crs.source = "format-rule" as a third value beside "file" and "caller_asserted", with the new crs.provenance field carrying "crs:format-default" beside it. Applying it changes a published-artifact value and existing assertions, which is why it waited for you.
Options:
  1. "format-rule" as the third crs.source value (Recommended): applied in P3's fix round, existing assertions re-pinned, the publish record carries it too.
  2. Keep crs.source = "file" and let crs.provenance alone carry the format-default fact (no third value; the describe wording says the CRS came from the format rule).
  3. Another spelling — type it.
