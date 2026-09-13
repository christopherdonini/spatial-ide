# Preregistration — bundle viewer: one pixel space for pointer and view (entry 86)

*Drafted 2026-09-13 by the architect agent on the custodian's brief; committed by the custodian on `viewer/zoom-anchor` BEFORE any code. Append-only; an amendment written after any result has been seen must say so in its first line.*

**Status:** preregistered, not started. Post-tag. Ruled "86 only if it reproduces" (`DECISIONS-PENDING.md` entry 86); reproduced 2026-09-13 (the finding appended there).
**Scope:** `renderer/bundle-viewer/` only. Touches no control/data plane (docs/10), no kernel/engine/protocol, and needs no new ADR — ADR-017 §14 (`docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:513-541`) and §16 (`:591-607`) say nothing about canvas sizing or pointer spaces, and neither the format nor the ceilings move.

## 1. The defect, as reproduced

Fixed backing store `index.html:74` (`width="1280" height="900"`) stretched by CSS `index.html:26`; the wheel handler `src/main.ts:307-323` feeds `e.offsetX/Y` (CSS px) to `unproject` (`src/render.ts:120-125`), which measures from `view.width/2, view.height/2` set once from the canvas attributes (`src/main.ts:444`). No resize and no DPR handling exists anywhere in the viewer (verified: no `devicePixelRatio`/`ResizeObserver` occurrence outside `node_modules`). Pan (`src/main.ts:298-299`) and hover (`:305`, `:326-333`) share the mismatch. Not cumulative: in-then-out returns exactly.

## 2. The rule (the decision this piece commits to)

**The pointer and the view share ONE pixel space, and the conversion into it happens in exactly one function.**

Chosen: **(b) size the backing store to the canvas's client box × `devicePixelRatio`, on load and on `ResizeObserver`**, with one refinement that subsumes (a):

- The single conversion is `toStore(e) = [e.offsetX * rx, e.offsetY * ry]` with `rx = canvas.width / canvas.clientWidth`, `ry = canvas.height / canvas.clientHeight` — **the ratio is measured from the element, never assumed to equal `dpr`**. Exact whether or not the store was clamped, and exact if a future stylesheet sizes the canvas differently.
- Every input site calls it: wheel (`src/main.ts:315`, `:317`), pan (`:298-299`), hover (`:305`). **No second unprojection path** — `unproject` (`src/render.ts:120-125`) stays the only device→world function and keeps its ADR-010 rule 2 posture (`src/render.ts:112-118`): the result selects a candidate and is discarded, never shown, never stored.
- **Why (b) and not (a) alone:** (a) keeps the 1280×900 store stretched anisotropically into a pane of a different aspect, so a square in CRS units is painted as a non-square — anchoring would be fixed while the picture stays geometrically wrong, and picking would agree with a distorted picture. (b) makes the store's aspect the pane's aspect, so one store pixel is one device pixel. **No quality or sharpness claim is made or implied** — the statement is the pixel-grid correspondence, not a measurement.
- **Declared, not discovered (ADR-010 rule 6, `docs/adr/ADR-010-render-frames-origins-boundaries.md:70`):** a window-sized store is otherwise an undeclared capacity. The piece declares `MAX_BACKING_STORE_DIM` and `MAX_BACKING_STORE_PIXELS` as viewer-local constants in `src/render.ts` beside the existing ceiling block (`src/render.ts:49-73`), with the behaviour at the ceiling declared: the store clamps, the measured ratio absorbs the clamp, anchoring stays exact. **`ceilings.json` is not edited** (`:1-7` — its five values are feature/partition/byte/attribute counts; there is no pixel or resolution ceiling today and this piece adds none there), because `kernel/src/publish/ceilings.rs:36`/`:191` compile those bytes in under a hash.
- **Resize invariant (declared):** on a store resize the world point at the view centre stays at the centre and world-units-per-**CSS**-pixel is unchanged — `scale` (device px per CRS unit, `src/render.ts:82-83`) is multiplied by the ratio change. A resize is not a zoom.
- **Ceilings are independent of pixels:** the bundle's ceilings bound what a bundle carries; nothing in §16's table (`ADR-017:595-606`) is a function of framebuffer size. A bigger store changes no ceiling and no refusal.
- **docs/08:** a DPR change alters the rendered pixel count. That is a *count of pixels drawn*, not a rate, duration or budget row; `src/render.ts:21-27` already declares that drawing cost scales with visible features and that **no frame-time figure is claimed, measured or met** — this piece adds the pixel count to that same declared consequence and **must not claim** faster, smoother, sharper, "60 fps", or any p50/p95 (`docs/01_Principles.md:20`; `docs/08_Testing.md:57-62`).

## 3. Discriminator (pre-committed, from the reproduction driver)

Driver: `zoomdrift.mjs`, moved to `renderer/bundle-viewer/e2e/zoom-anchor.mjs`. Reading = painted centroid before / after one centre-pointer wheel notch.
- **Today (must still read this on the pre-fix build):** large window → NW on zoom-in, SE on zoom-out; small window → reversed; CSS box forced to exactly 1280×900 → none.
- **After the fix:** all three sizes read no displacement beyond the declared tolerance, in and out, and the solved anchor equals the pointer's world point.
- **Tolerance:** declared in the test file before the fix lands, as a *computational* tolerance in store pixels. It is not an accuracy figure and not a quality claim (`docs/08_Testing.md:57-62`).

## 4. Pre-committed tests

Unit (`renderer/bundle-viewer/scripts/render.test.mjs` — today's round-trip runs only at the native 1280×900, `:157-166`):
1. `project`/`unproject` round-trip at a **non-native** box size (store ≠ 1280×900, ratio ≠ 1).
2. Wheel anchor: the world point under the pointer is identical before and after a notch — a **pure function test**, which requires factoring the wheel body out of the listener (`src/main.ts:307-323`) into an exported `zoomAt(view, storeX, storeY, factor)`.
3. Pan: world distance moved = CSS drag distance × ratio ÷ `scale`.
4. Hover: a pick at a non-native size hits the feature under the pointer (reuse the recording context, `scripts/render.test.mjs:34-48`).
5. Resize invariant of §2: centre unchanged, `scale` × ratio.
E2E (`renderer/bundle-viewer/e2e/`): the driver at a large and a small window — a centre-pointer notch leaves the painted centroid within tolerance, and zoom-out returns it. Note `package.json:11` globs `scripts/**/*.test.mjs` only, so the piece adds an explicit `test:e2e` script and wires it into `verify` (`:12`) or names why not.
Mutation: revert the conversion at the wheel site → the **large-window** E2E case fails **by name**; recorded in the piece's own notes.

## 5. What is unchanged

Bundle format, manifest schema, ADR-017 §14's reader contract and §16's ceilings; publish (`kernel/`, `engine/`, `protocol/`, the shell) — untouched. `ceilings.json` byte-identical. `build.mjs`'s determinism posture unchanged (`build.mjs:11-14`); `dist/app.js` bytes change, so the NOTICE/dist hashes M recorded are superseded for *future* builds — no already-shipped hash is restated.
**Already-published bundles are not updated.** Publish copies `dist/` into the bundle at publish time (`frontends/shell/src-tauri/src/publish.rs:1109-1120`; `kernel/src/publish/viewer_assets.rs:4-19`, `:85`); a bundle's viewer is a frozen copy, not a version reference, and §14 (`ADR-017:527-530`) says a bundle's viewer cannot even verify itself. Therefore **KNOWN-LIMITATIONS line 16 does not retire at landing — it is rewritten as scope**: the behaviour stands, unchanged and unfixable in place, for every bundle already published (including all v0.1.0 bundles); it is absent only from bundles published by a build that carries this fix. Deleting the line would falsely claim the shipped artifacts changed.

## 6. Block-on-sight

Any performance or quality number, anywhere (comment, commit message, test name, KNOWN-LIMITATIONS) · any change under `kernel/`, `engine/`, `protocol/`, `frontends/` · any edit to `ceilings.json` or to an accepted ADR · a second device→world path beside `unproject` · a cursor-derived coordinate becoming visible or stored (ADR-010 rule 2; `index.html:79-82`) · silently deleting KNOWN-LIMITATIONS line 16 · a DPR value assumed rather than measured from the element.

## 7. Gates

Reviewer + architect (ADR-017's viewer contract; ADR-010 rule 6's declared constants) · `npm run verify` in `renderer/bundle-viewer` plus the new E2E at both window sizes · the mutation check recorded · one walkthrough row queued for the next sitting bundle (**Part G**), written as "zoom anchored at a window size that is not 1280×900" · the KNOWN-LIMITATIONS rewrite goes to the human bracketed, not applied.

## 8. Amendments

*(none)*
