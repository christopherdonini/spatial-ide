# ADR-010 — Render Frames, Origins, and Boundary Rules

**Status:** Proposed — drafted at ADR-003 spike close from measured findings; awaiting review
**Sources:** spike M2/M3/M4 diagnostic notes (`spikes/adr-003-crs-rendering/README.md`)

## Context

The spike surfaced a family of silent-failure modes around renderer-internal coordinate frames: untagged local-frame values structurally indistinguishable from CRS coordinates (a 3.1×10⁶ m frame error wearing a coordinate's clothes), precision destroyed by f32 narrowing before offset subtraction, a 24-bit picking ceiling that wraps silently, and a global origin-rebase costing ~20M float writes. None are deck.gl-specific; all bind any renderer this project builds on.

## Proposed rules

1. **Local/render frames never cross an API boundary untagged.** Every coordinate leaving the renderer either carries its CRS tag or does not leave. deck.gl's bare `info.coordinate` is treated as renderer-internal. (docs/01: CRS is a type; M3 finding.)
2. **Coordinates are looked up, not reconstructed.** Picking resolves GPU index → stable feature id → host-side f64 lookup. Unprojecting a cursor cannot reach centimetres at map scales (1 cm = 0.076 px at 1:500) and is never the source of a returned coordinate. (M3.)
3. **Per-tile/block static buffers, each with a local origin.** Kills absolute-f32 precision loss and global rebase cost in one design: re-centering becomes a per-tile view-matrix update, never a dataset rewrite. Offset subtraction always happens in f64 before f32 narrowing. (M2, M4.)
4. **Editing never touches static buffers mid-interaction.** Small dynamic overlay during drag, partial GPU range updates, async consolidation after commit, no global rebase. (M4.)
5. **Capacity ceilings are declared, not discovered.** deck.gl's pick index is 24-bit — 16,777,215 features per layer with silent wraparound past it. Layer designs state their sharding strategy before approaching any such ceiling. (M3.)
6. **Runtime resilience is architecture, not hygiene.** Global error/unhandledrejection handlers, heartbeat, and watchdog are mandatory in any long-lived rendering session — an application error must never present as a hardware hang. (M4 forensics.)

## Consequences

These rules bind renderer and engine module design (02, 06) and are architect-blockable in review. Rule 3 becomes the starting shape of the production scene graph; rule 1 constrains the SKP surface (04, 10).
