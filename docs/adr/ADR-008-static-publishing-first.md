# ADR-008 — Static Publishing First; Managed Sharing Later

**Status:** Accepted — 2026-07-31

## Context

"One-click share" hides a substantial second product: authentication, hosting, uploads, access control, tile generation, storage costs, quotas, data residency, revocation, private links, versioning, licensing.

## Decision

From Prototype through 1.0, publishing means a **static interactive bundle**: style + metadata + PMTiles or partitioned assets, hostable anywhere — file share, object storage, any static site. This proves the publishing model with zero SaaS backend.

A managed Spatial IDE sharing service is a separate future ADR and plausibly a separate commercial product. It is an explicit non-goal until post-1.0 (07).

## Consequences

- The hero slice (07) reads "publish a static interactive bundle," not "share a link to our service."
- The web publishing canvas (ADR-003) renders these bundles; DuckDB-WASM keeps them queryable in the browser.

## Clarification (2026-08-06) — which canvas renders a bundle, and what v1 actually does

*Appended, not merged; the Decision and the Consequences above stand as accepted. This reconciles
the second Consequence with **ADR-003's Amendment (2026-08-06)** and **ADR-017** (static bundle
format — Accepted 2026-08-06), both of which post-date it. It changes no decision in this ADR:
publishing still means a static interactive bundle, hostable anywhere, with no SaaS backend.*

The second Consequence — *"The web publishing canvas (ADR-003) renders these bundles; DuckDB-WASM
keeps them queryable in the browser"* — was written when ADR-003 named **two** canvases and the
bundle format did not exist. Both halves of it are now more specific than they were, and neither is
true of the cut that has been built:

- **A third canvas renders them.** ADR-003's 2026-08-06 amendment names the **projected publishing
  canvas**: a bundle is rendered in its **source CRS, with no reprojection**, in a self-contained
  viewer shipped inside the artifact. It is not MapLibre and not deck.gl. The web publishing canvas
  remains ADR-003's answer for **web-ready** sources, and this clarification does not retire it —
  but which canvas publishes a given source is an **explicit declared decision** against a
  supported-CRS contract with a definitional-equivalence check (`docs/05`), never inferred from a
  CRS identifier string.
- **In v1, that decision has one outcome.** **Every published bundle uses the projected publishing
  canvas, always, and the MapLibre branch is unimplemented** — there is no selection code, no
  supported-CRS set, and no equivalence check in the product. Until the engine can perform the
  equivalence check, the set of sources routed to the web publishing canvas is **empty by
  construction**, which is the only honest way to have an unimplemented branch.
- **The consequence, stated rather than apologised for:** such a bundle has **no basemap**. That is
  not a missing feature; it is what "no reprojection" means when basemap tiles are Web Mercator.
- **DuckDB-WASM is deferred, not delivered.** ADR-017 §9 reserves an in-browser `query_surface` and
  emits `available: false`; v1 implements no query surface. The reservation exists so that filling
  it later is a version increment rather than a break, and reserving it is **not** the same as
  having it.

Nothing here touches the managed-sharing non-goal, which remains post-1.0 and a separate future ADR.
ADR-017's Consequences record the same reconciliation from the format's side.
