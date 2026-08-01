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
