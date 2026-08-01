# 12 — Plugin Runtime

## Model

Plugins are **out-of-process SKP clients** (02). There is no in-process extension API. Sandbox: WASM is the leading candidate; process isolation is the floor. This is the structural answer to QGIS plugin rot — unmaintained plugins can crash themselves, not the kernel.

## Capabilities

Plugins receive scoped, expiring capability grants (09) — the identical machinery used for AI agents (01, "one extension surface"). Capabilities are declared in the plugin manifest, approved by the user, and auditable.

## Lifecycle

Install → declare capabilities → grant → run sandboxed → upgrade against SKP version negotiation (10). Plugins pin to SKP major versions; the conformance suite is the compatibility contract — no breakage on minor releases.

## Reference consumer

The first-party editing plugin (ADR-002) is the proving ground: if editing — selection, snapping, transactions against the local mutable store (ADR-007) — can ship as a plugin, the API is real.

## Distribution

Signed packages; a registry later. Unsigned local plugins run only under an explicit developer-mode grant.
