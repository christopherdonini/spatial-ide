# 01 — First Principles

These should almost never change. Amending this document requires an ADR explaining why a principle failed in practice.

## The 8 principles

1. **Everything is an addressable, typed resource.** *(Reworded by ADR-005.)* Data resources are datasets; styles, notebooks, workflows, diagnostics, project state, and lineage are typed artifacts. Every resource has a stable URI, schema, lifecycle, and provenance.
2. **Everything is searchable.** Requires metadata; therefore metadata is auto-drafted, never optional (05).
3. **Everything is reproducible — at a declared level.** Operations are recorded recipes; every output carries a reproducibility grade from Exact to Best-effort (ADR-005, 11). Nothing claims a grade it cannot honor.
4. **Everything is scriptable.** Every GUI action has an API equivalent — and shows it (03, action console).
5. **Everything is AI-accessible.** AI uses the same public API as humans and plugins. Never GUI automation (04).
6. **Platform first, UI second.** Headless kernel + protocol; every UI is a client (02).
7. **Async by default.** All operations are cancellable, streaming, and progress-reporting.
8. **No black boxes.** Every transform — including CRS reprojection — is explicit, logged, and inspectable.

## Derived rules

Consequences of the principles we hold ourselves to as hard constraints:

- **Never block the canvas.** 60 fps pan/zoom at 10M features; budgets enforced in CI (08). This is principle 7 made measurable.
- **CRS is a type.** It flows through every operation; **analytical** reprojection is always an explicit workflow operation, while **display** reprojection happens only through an explicit, visible map-view transform (05). Measurements are units-aware — "area in degrees²" is unrepresentable. This is principle 8 applied to the #1 source of silent GIS errors.
- **Version lineage, not data.** Recipes + content addressing, never binary diffs of large data (02). This is principle 3 kept tractable.
- **One extension surface.** Humans, plugins, and AI share one API and one permission model (04). This is principles 4+5 unified.
- **Plain text everywhere.** Projects, styles, and configs are diffable, gittable text. No `.qgz`-style binary blobs.
- **Auditable beyond revertible.** Pure transformations replay; workspace mutations are transactional; external side effects are approval-gated and declare their reversibility class (ADR-006). Users are never told something is undoable when it isn't.
