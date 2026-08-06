# 14 — Governance and Licensing

Constitution-level because three things depend on it: a plugin ecosystem needs legal certainty, contributors need to know what they're giving, and ADR-008 explicitly leaves room for a future commercial sharing service — which makes the open-core boundary a product decision, not an afterthought.

> RESOLVED — **ADR-009, accepted 2026-08-07:** `AGPL-3.0-or-later` core + DCO 1.1; Apache-2.0 for SDKs/bindings; CC-BY-4.0 for the SKP spec and docs; commercial products as separate services, never a relicensed core; the ADR's pre-public checklist gates the repository going public. The decision space below is retained as the record of what was considered:
>
> - **Permissive (MIT / Apache-2.0)** — maximizes adoption and commercial reuse; permits proprietary forks, including by competitors. Apache-2.0 adds a patent grant.
> - **Weak copyleft (MPL-2.0 / LGPL)** — file/library-level protection; friendly to proprietary plugins and embedding.
> - **Strong copyleft (GPL / AGPL)** — protects against closed forks and cloud capture; QGIS is GPL. Chills some commercial adoption and complicates the plugin story.
> - **Source-available (BSL / FSL)** — protects a future managed service; not open source by OSI definition, with the ecosystem-trust cost that implies.

## Constraints that hold regardless of the license chosen

- **The SKP protocol specification and all file formats are open, permanently.** Ecosystem trust depends on the protocol never becoming a moat.
- **The plugin API permits proprietary plugins.** Whatever the core license, plugin authors (including commercial ones) must be able to build on the stable API (12).
- **The open-core boundary is declared, not discovered.** Forever-open: kernel, data engine, renderer, editing plugin, static publishing (ADR-008). Candidate-commercial: managed sharing service, enterprise editing (3.x), org-level administration.
- **CLA vs DCO is decided up front**, before the first external contribution — retrofitting a CLA is a community wound.
- **Trademark policy is separate from the code license.** The name "Spatial IDE" (or its successor) is governed independently so forks can exist without identity confusion.

## Governance

Lightweight and explicit for now: a single maintainer (BDFL) with the ADR process as the decision record. Constitution changes require an ADR (01); accepted ADRs are amended, never rewritten. A CONTRIBUTING.md (with AI_DEVELOPMENT.md) defines contribution mechanics when the repo opens. Formal governance (steering, foundation) is a post-1.0 question — premature structure is as costly as none.

## Data licensing

The test corpus (08) carries obligations: Overture and OSM attribution must be preserved in benchmarks, demos, and published bundles. Import records license/attribution metadata when known (05); published bundles surface it (ADR-008).
