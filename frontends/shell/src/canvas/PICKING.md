# Picking — why `info.coordinate` never appears in this codebase

ADR-010 rule 1: a coordinate that does not carry its space's tag does not leave the module that
produced it. deck.gl's `PickingInfo.coordinate` is unprojected through the current viewport, and
under this canvas's offset-relative rendering (rule 3) the viewport itself lives in the **local
frame** — so `info.coordinate` is a bare `[number, number]` shaped exactly like a coordinate while
actually being metres from a renderer-internal, silently-moving origin. The ADR-003 spike's M3
milestone measured the failure this produces directly: a sampled raw value of
`[4.894791666666664, −3.042708333333324]` against a real easting of ~2.6×10⁶ m — the error *is* the
origin, a fixed offset no averaging or zooming touches.

**The rule, restated as a scan rather than a promise:** the string `.coordinate` must not appear
anywhere under `frontends/shell/src/` except in this file and in
`noCoordinateLeak.test.ts` (which is the scan itself, and necessarily contains the string it is
checking for). `WorkingCanvas.tsx`'s `onHover` handler resolves a pick through `resolvePick`
(`pick.ts`) instead: **GPU ordinal → stable feature id → authoritative f64**, looked up from the
exact same `ids`/`rings` arrays a layer was built from (`buildLayers.ts`), never through
unprojection.

Nothing in this cut needs `info.coordinate` for a legitimate reason (navigation, hover, or
candidate-geometry creation, per ADR-010 rule 2's permitted uses) — cut 1 has no digitizing path and
no cursor-driven navigation beyond what `controller: true` already handles internally. If a future
cut needs one of those, the value must be tagged as a **derived candidate coordinate**, per rule 2's
three limits — never treated as authoritative, never used to overwrite an existing vertex, and never
displayed untagged.
