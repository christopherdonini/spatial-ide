# ADR-005 — Resource Identity, Typed Resources, Reproducibility Levels

**Status:** Accepted — 2026-07-31
**Amends:** Principle 1 (01)

## Decision

Principle 1 becomes: **"Everything is an addressable, typed resource."** Data resources are datasets; styles, notebooks, workflows, diagnostics, project state, and lineage are typed artifacts. Every resource has a stable URI, schema, lifecycle, and provenance.

References use a **ResourceRef** — logical URI · content hash (if known) · source revision · one or more locators · cache status · portability policy. A content hash alone cannot say where to retrieve data after a file moves; locators can. Bundles copy referenced resources into a local object store.

Reproducibility is **graded, not assumed**:

1. **Exact** — immutable, content-hashed inputs, pinned software versions
2. **Snapshot** — local snapshot captured when the workflow ran
3. **Revision-pinned** — remote source has a stable revision/transaction ID
4. **Reference-only** — URI + query recorded; underlying content may change
5. **Best-effort** — nondeterministic or external; environment recorded

Every notebook and project displays its grade; a derived output's grade is the weakest among its inputs. Details: `11_Project_and_Resource_Model.md`.

## Why the principle changed

"Everything is a dataset" was memorable but technically overloaded — styles, permissions, diagnostics, and project state are not naturally datasets. Permissions, search, MCP resources, project manifests, caching, GC, versioning, and plugin APIs all need a resource model, not a metaphor. Likewise "all data crosses boundaries as Arrow" was too broad: transfer representations are typed per resource (11); Arrow is central, not universal.
