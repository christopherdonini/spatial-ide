// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * The bundle viewer: load a static bundle from the directory it is served from, verify it, and draw
 * it on a projected canvas in the source CRS.
 *
 * ## Declared recovery policy (ADR-010 rule 7)
 *
 * **`none` — fail visibly and terminate with a surfaced error.** No retry, no reconnect, no partial
 * map presented as complete. Global `error` and `unhandledrejection` handlers are installed
 * unconditionally, before anything else runs: rule 7's M4 forensics are the reason — every liveness
 * signal stayed healthy while an unhandled `TypeError` had silently killed the session, and only the
 * global handler answered the question. There is no heartbeat and no watchdog, and rule 7 requires
 * none where the declared policy is `none`.
 *
 * **One clause of rule 7 this artifact cannot fully satisfy, named rather than skipped.** Rule 7
 * asks that the output be both *visible* and *persisted to a log that outlives the session*. A
 * static bundle served from a file share has no durable sink, and inventing one would mean a network
 * request — which the zero-external-request guarantee forbids, and which `docs/09` would make a
 * capability grant. So: **visible on the page, and persisted in-page for the session only**. That is
 * a declared limit of the artifact, not an omission.
 *
 * ## Zero external requests
 *
 * Everything this page loads is in the bundle and hash-listed in the manifest: `manifest.json`,
 * `style.json`, and the partitions, all by relative URL. No CDN, no font, no tile, no basemap, no
 * analytics. `scripts/boundaries.test.mjs` scans the built bundle for absolute URLs, and
 * the acceptance run serves the bundle with the network otherwise blocked.
 *
 * ## No basemap, and why that is the recorded consequence of a decision
 *
 * The bundle renders in its source CRS with no reprojection. Basemap tiles are Web Mercator, so
 * showing one would mean either reprojecting the data — which this cut deliberately does not do —
 * or drawing two coordinate systems on one canvas and hoping. The viewer states this on the page.
 *
 * ## What this page cannot verify
 *
 * It verifies every asset the manifest lists. It **cannot verify the code that is already
 * executing**: the manifest's viewer-asset hashes are for an *external* verifier, and the chain of
 * trust does not close inside the browser. Said here rather than implied by silence.
 */

import { BundleFailure, showFailure } from './failure.js';
import {
  licenseSummary,
  viewerLicenseSummary,
  parseManifest,
  type FetchableAsset,
  type Manifest,
} from './manifest.js';
import { decodePartition, type Partition } from './partition.js';
import {
  clampStoreSize,
  drawAll,
  fitView,
  MAX_ATTRIBUTE_COLUMNS,
  MAX_FEATURES,
  MAX_PARTITIONS,
  MAX_RESIDENT_BYTES,
  panBy,
  pick,
  resizeStore,
  unproject,
  zoomAt,
  type View,
} from './render.js';
import { sha256Prefixed } from './sha256.js';
// Style v0's TS implementation lives in the renderer-owned `style-ts` package, not under this
// package's own `src/` -- ADR-022 point 2; see `../../style-ts/src/style.ts`'s own doc comment for
// why this import crosses a package boundary rather than a same-package relative path.
import { Style } from '../../style-ts/src/style.js';
import { StyleParseError } from '../../style-ts/src/style-error.js';

// ---------------------------------------------------------------------------------------------
// Rule 7: unconditional, and first.
// ---------------------------------------------------------------------------------------------

const sessionLog: string[] = [];
(globalThis as unknown as { __bundleViewerLog: string[] }).__bundleViewerLog = sessionLog;

function record(line: string): void {
  sessionLog.push(line);
  const el = document.getElementById('log');
  if (el) el.textContent = sessionLog.slice(-200).join('\n');
}

function fatal(failure: BundleFailure): void {
  record(`FAILURE ${failure.state} ${failure.asset}: ${failure.detail}`);
  const banner = document.getElementById('banner');
  if (banner) showFailure(banner, failure, state.partitions.length, state.expectedPartitions);
}

window.addEventListener('error', (e) => {
  fatal(new BundleFailure('unhandled-error', 'viewer', `${e.message} @ ${e.filename}:${e.lineno}`));
});
window.addEventListener('unhandledrejection', (e) => {
  fatal(new BundleFailure('unhandled-error', 'viewer', `unhandled rejection: ${String(e.reason)}`));
});

// ---------------------------------------------------------------------------------------------

interface State {
  manifest: Manifest | null;
  style: Style | null;
  partitions: Partition[];
  expectedPartitions: number;
  residentBytes: number;
  view: View | null;
}

const state: State = {
  manifest: null,
  style: null,
  partitions: [],
  expectedPartitions: 0,
  residentBytes: 0,
  view: null,
};

const canvas = document.getElementById('map') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

// ---------------------------------------------------------------------------------------------
// One pixel space (ZOOM-ANCHOR-PREREGISTRATION.md, entry 86). The backing store is sized to the
// canvas's own CSS box, and every input site converts through the one function below — never
// `unproject` directly on a raw `e.offsetX/Y`.
// ---------------------------------------------------------------------------------------------

/**
 * The previous measured ratio (store px per CSS px), kept so a later resize can hold
 * world-units-per-CSS-pixel constant (`resizeStore`'s `ratioChange`). Not `devicePixelRatio`: it is
 * whatever `sizeCanvasToClientBox` last actually measured off the element, so a clamped store is
 * accounted for exactly rather than approximately. `1` before the canvas has ever been sized.
 *
 * **One variable, not an X/Y pair (reviewer B2).** `clampStoreSize` (`render.ts`) applies one shared
 * factor to both axes, so the ratio it produces is the same on both — carrying a second `lastRatioY`
 * would only ever agree with this one and go stale unread. `toStore` below still measures `rx`/`ry`
 * separately from the element itself, because *that* measurement must hold even if something outside
 * this module's control ever stretched the canvas anisotropically (e.g. a CSS transform); this
 * variable is this module's own record of the ratio *this function* last established, which — by
 * construction of `clampStoreSize` — is one number.
 */
let lastRatio = 1;

/**
 * The single conversion (§2): every pointer coordinate this viewer acts on passes through here once,
 * and nothing downstream of it sees a CSS pixel again. **The ratio is measured from the element,
 * never assumed to equal `devicePixelRatio`** — exact in the arithmetic `unit tests exercise directly
 * (`zoomAt`/`panBy`/`resizeStore`'s own tests); end-to-end, through a real paint and a real wheel
 * event, the E2E discriminator (`e2e/zoom-anchor.mjs`) reads it to its own declared tolerance, not
 * this file's own claim.
 */
function toStore(e: MouseEvent): [number, number] {
  const rx = canvas.width / canvas.clientWidth;
  const ry = canvas.height / canvas.clientHeight;
  return [e.offsetX * rx, e.offsetY * ry];
}

/**
 * Size the backing store to the canvas's own CSS box × `devicePixelRatio` (§2(b)), through
 * `clampStoreSize` (`render.ts`) — never a second, hand-inlined copy of that arithmetic (reviewer
 * item 1). Called once before the first `fitView`, and again on every `ResizeObserver` callback —
 * **the only place `canvas.width`/`canvas.height` are ever assigned.**
 *
 * `devicePixelRatio` decides the *target* resolution here, same as any other viewer would use it for.
 * That is not the conversion `toStore` performs — `toStore` measures the ratio actually achieved
 * (`canvas.width / canvas.clientWidth`), which is this same target unless `clampStoreSize` clamped
 * it, in which case the measured ratio silently absorbs the difference.
 */
function sizeCanvasToClientBox(): void {
  const cssWidth = canvas.clientWidth;
  const cssHeight = canvas.clientHeight;
  if (cssWidth <= 0 || cssHeight <= 0) return; // not laid out yet; nothing to size against

  const dpr = window.devicePixelRatio || 1;
  const { width: storeWidth, height: storeHeight } = clampStoreSize(cssWidth, cssHeight, dpr);

  // Measured and recorded BEFORE the early return below (reviewer B2). The store's own integer
  // dimensions can stay unchanged across a client-box change that `clampStoreSize`'s rounding
  // absorbs — but the ratio `toStore` would compute right now has already moved, and it is what the
  // NEXT real resize's `ratioChange` must be measured against. Leaving `lastRatio` stale here (as an
  // earlier version of this function did, only updating it below the early return) would multiply a
  // future resize's `scale` by a ratio computed against a client box that no longer exists — a
  // resize silently becoming a zoom.
  const ratioBefore = canvas.width / cssWidth;
  lastRatio = ratioBefore;

  if (canvas.width === storeWidth && canvas.height === storeHeight) return; // the store itself is unchanged

  canvas.width = storeWidth;
  canvas.height = storeHeight;
  lastRatio = canvas.width / canvas.clientWidth;

  // `state.view` is null on the very first call: `fitView` (in `load()`, right after this call)
  // computes `scale` fresh from the bounds and has no prior ratio to hold constant against. Only a
  // later, post-load resize goes through the invariant.
  if (state.view) {
    resizeStore(state.view, canvas.width, canvas.height, lastRatio / ratioBefore);
    redraw();
  }
}

/**
 * The bundle root, resolved from this page's own location.
 *
 * The viewer lives at `<bundle>/viewer/index.html` and every manifest path is relative to
 * `<bundle>/`, so a bare relative fetch would resolve one directory too deep. Deriving the base from
 * `location.href` keeps every request **relative** — nothing here knows a host, a scheme or an
 * absolute path, which is what makes the bundle hostable from a file share, an object store or any
 * static site without being told where it is.
 */
const BUNDLE_BASE = new URL('../', window.location.href);

function bundleUrl(relative: string): string {
  return new URL(relative, BUNDLE_BASE).href;
}

function text(id: string, value: string): void {
  const el = document.getElementById(id);
  // `textContent`, never `innerHTML`: docs/09 names dataset contents, attribute values and metadata
  // as untrusted input, and every one of those reaches this page.
  if (el) el.textContent = value;
}

async function fetchAsset(asset: FetchableAsset): Promise<Uint8Array> {
  let response: Response;
  try {
    // Resolved against the bundle root, which was itself derived from this page's location — so
    // the request is relative however the bundle is hosted.
    response = await fetch(bundleUrl(asset.path), { cache: 'no-store' });
  } catch (e) {
    throw new BundleFailure('asset-missing', asset.path, String(e));
  }
  if (!response.ok) {
    throw new BundleFailure('asset-missing', asset.path, `HTTP ${response.status}`);
  }
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (asset.bytes !== null && bytes.length !== asset.bytes) {
    throw new BundleFailure(
      'partition-byte-count-mismatch',
      asset.path,
      `the manifest lists ${asset.bytes} bytes and ${bytes.length} arrived`,
    );
  }
  const hash = await sha256Prefixed(bytes);
  if (hash !== asset.contentHash) {
    throw new BundleFailure(
      'asset-hash-mismatch',
      asset.path,
      `the manifest lists ${asset.contentHash} and the bytes hash to ${hash}`,
    );
  }
  return bytes;
}

function renderLegend(style: Style): void {
  const el = document.getElementById('legend');
  if (!el) return;
  el.textContent = '';
  if (style.matchColumn === null) {
    const p = document.createElement('div');
    p.className = 'note';
    p.textContent = 'This style declares no categorical match, so it carries no legend.';
    el.appendChild(p);
    return;
  }
  const heading = document.createElement('div');
  heading.className = 'legend-heading';
  heading.textContent = style.matchColumn;
  el.appendChild(heading);

  for (const entry of style.legend) {
    const row = document.createElement('div');
    row.className = 'legend-row';
    const swatch = document.createElement('span');
    swatch.className = 'swatch';
    swatch.style.background = entry.draw.fillColor;
    swatch.style.opacity = String(entry.draw.fillOpacity);
    swatch.style.borderColor = entry.draw.outlineColor;
    row.appendChild(swatch);
    const label = document.createElement('span');
    // Untrusted: a case value comes from the style document, which came from a file.
    label.textContent =
      entry.kind.kind === 'case'
        ? entry.kind.value
        : entry.kind.kind === 'null'
          ? 'no value (declared on_null)'
          : 'other (declared on_unmatched)';
    row.appendChild(label);
    el.appendChild(row);
  }

  const note = document.createElement('div');
  note.className = 'note';
  note.textContent =
    'The legend is a function of the style, not of the data: every declared case is shown whether ' +
    'or not this bundle contains one.';
  el.appendChild(note);
}

function renderProvenance(m: Manifest): void {
  text('crs', `${m.crsSource} → ${m.crsDisplay} · transform: ${m.crsTransform}`);
  text('identity', `${m.idSource} · ${m.idUniqueness}`);
  text('identity-caveat', m.identityCaveat);
  text('grade', `reproducibility: ${m.reproducibilityGrade}`);
  text('bounds-basis', `bounds: ${m.boundsBasis}`);

  // The wording is `licenseSummary`'s, in `manifest.ts`, because it is a pure function of the
  // manifest and is unit-tested there. It used to be an inline expression here that printed
  // `(unnamed)` for an unnamed license — the old manifest placeholder, relocated to the pixels,
  // with no test in reach of it.
  text('license', licenseSummary(m.license));

  // **The code's own terms, displayed rather than merely carried** (§14 as ADR-017 Corrigendum 3
  // amends it, discharging ADR-009 item 7). One line per fact, because collapsing a copyright, a
  // license and a corresponding-source route onto one line is how a notice becomes decoration.
  //
  // `notice_path` and an `http(s)` route are rendered as links, so "durable route" means something
  // a reader can follow rather than a string they must retype. A `written-offer` route carries no
  // `href` and is shown as text — there is nothing to link to, and linkifying it would invent a
  // destination.
  const el = document.getElementById('viewer-license');
  if (el) {
    el.replaceChildren();
    for (const line of viewerLicenseSummary(m.viewerLicense)) {
      const row = document.createElement('div');
      if (line.href === undefined) {
        row.textContent = line.text;
      } else {
        // **`bundleUrl` for a bundle-relative href, the value as-is for an absolute one.**
        // `notice_path` is *bundle*-relative (`viewer/NOTICE.txt`) while this page lives at
        // `viewer/index.html`, so a bare relative href would resolve to `viewer/viewer/NOTICE.txt`
        // and the one link in the notice would 404. `bundleUrl` is the same resolution `fetchAsset`
        // uses for every other asset.
        //
        // The scheme was already checked in `parseManifest`, which refuses a `url` route that is
        // not `http`/`https` — so a `javascript:` route never reaches this line. That check lives
        // there rather than here because a manifest is untrusted input and the refusal belongs
        // where the document is judged, not where it is drawn.
        const a = document.createElement('a');
        // `textContent`, never `innerHTML`: a copyright notice is operator-controlled manifest text
        // and `docs/09` names manifest metadata as untrusted input.
        a.textContent = line.text;
        a.href = /^https?:\/\//.test(line.href) ? line.href : bundleUrl(line.href);
        a.rel = 'noopener noreferrer';
        row.appendChild(a);
      }
      el.appendChild(row);
    }
  }
}

function redraw(): void {
  if (!state.view || !state.style) return;
  const stats = drawAll(ctx, state.partitions, state.style, state.view);
  text(
    'status',
    `${state.partitions.length}/${state.expectedPartitions} partitions verified · ` +
      `${stats.drawn} features drawn, ${stats.culled} outside the view`,
  );
}

function installInteraction(): void {
  let dragging = false;
  let lastX = 0;
  let lastY = 0;

  canvas.addEventListener('mousedown', (e) => {
    dragging = true;
    [lastX, lastY] = toStore(e);
  });
  window.addEventListener('mouseup', () => {
    dragging = false;
  });
  canvas.addEventListener('mousemove', (e) => {
    if (!state.view) return;
    const [sx, sy] = toStore(e);
    if (dragging) {
      // Pan in world units, in f64: the view's centre *is* the render origin, so panning moves the
      // origin and every drawn value stays small.
      panBy(state.view, sx - lastX, sy - lastY);
      lastX = sx;
      lastY = sy;
      redraw();
      return;
    }
    hover(sx, sy);
  });
  canvas.addEventListener(
    'wheel',
    (e) => {
      if (!state.view) return;
      e.preventDefault();
      const factor = Math.exp(-e.deltaY * 0.001);
      // Zoom about the cursor, in the one shared pixel space `toStore` converts into.
      const [sx, sy] = toStore(e);
      zoomAt(state.view, sx, sy, factor);
      redraw();
    },
    { passive: false },
  );
}

/**
 * The client-box resize side of §2's one-pixel-space rule. `sizeCanvasToClientBox` re-measures and
 * re-sizes on every callback; the observer itself does nothing beyond calling it.
 */
function installResizeObserver(): void {
  const ro = new ResizeObserver(() => sizeCanvasToClientBox());
  ro.observe(canvas);
}

/** `storeX`/`storeY`: already `toStore(e)`-converted by every caller — never a raw CSS pixel. */
function hover(storeX: number, storeY: number): void {
  if (!state.view || !state.style) return;
  const el = document.getElementById('hover');
  if (!el) return;
  // Cursor unprojection, permitted by ADR-010 rule 2 for hover feedback. Its result selects a
  // candidate and is then discarded — it is never shown and never stored.
  const [wx, wy] = unproject(storeX, storeY, state.view);
  const hit = pick(state.partitions, wx, wy);

  el.textContent = '';
  if (!hit) {
    const none = document.createElement('div');
    none.className = 'note';
    none.textContent =
      state.partitions.length < state.expectedPartitions
        ? 'no feature here — note that only the loaded partitions are searched'
        : 'no feature here';
    el.appendChild(none);
    return;
  }

  const idRow = document.createElement('div');
  idRow.className = 'hover-id';
  // The **id**, looked up from the partition's id array — never the array index, and never a
  // reconstructed coordinate. No coordinate of any kind is shown here.
  idRow.textContent = `id ${hit.id.toString()}`;
  el.appendChild(idRow);

  for (const a of hit.attributes) {
    const row = document.createElement('div');
    const name = document.createElement('span');
    name.className = 'attr-name';
    name.textContent = `${a.name}: `;
    row.appendChild(name);
    const value = document.createElement('span');
    if (a.value === null) {
      value.className = 'attr-null';
      // A NULL the source carried, shown as a NULL rather than as an empty cell.
      value.textContent = '(no value)';
    } else {
      value.textContent = a.value;
    }
    row.appendChild(value);
    el.appendChild(row);
  }
}

async function load(): Promise<void> {
  // ---- manifest ---------------------------------------------------------------------------
  let manifestText: string;
  try {
    const r = await fetch(bundleUrl('manifest.json'), { cache: 'no-store' });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    manifestText = await r.text();
  } catch (e) {
    throw new BundleFailure('manifest-unreachable', 'manifest.json', String(e));
  }
  const manifest = parseManifest(manifestText);
  state.manifest = manifest;
  state.expectedPartitions = manifest.partitions.length;
  renderProvenance(manifest);

  if (manifest.partitions.length > MAX_PARTITIONS) {
    throw new BundleFailure(
      'ceiling-exceeded',
      'manifest.json',
      `${manifest.partitions.length} partitions, above this viewer's declared ceiling of ${MAX_PARTITIONS}`,
    );
  }
  if (manifest.rows > MAX_FEATURES) {
    throw new BundleFailure(
      'ceiling-exceeded',
      'manifest.json',
      `${manifest.rows} features, above this viewer's declared ceiling of ${MAX_FEATURES}`,
    );
  }
  if (manifest.attributeColumns.length > MAX_ATTRIBUTE_COLUMNS) {
    throw new BundleFailure(
      'ceiling-exceeded',
      'manifest.json',
      `${manifest.attributeColumns.length} attribute columns, above the ceiling of ${MAX_ATTRIBUTE_COLUMNS}`,
    );
  }

  // ---- style ------------------------------------------------------------------------------
  const styleBytes = await fetchAsset({
    path: manifest.style.path,
    bytes: null,
    contentHash: manifest.style.contentHash,
  });
  // `Style.parse` throws the shared package's own `StyleParseError` (deliberately narrower than
  // this viewer's `BundleFailure` -- see `style-ts/src/style-error.ts`'s own doc comment), so this
  // is the one boundary in this file that translates it into this viewer's own failure vocabulary,
  // naming the same `state`/`asset`/`detail` unchanged.
  let style: Style;
  try {
    style = Style.parse(new TextDecoder().decode(styleBytes), manifest.style.path);
  } catch (e) {
    if (e instanceof StyleParseError) {
      throw new BundleFailure(e.state, e.asset, e.detail);
    }
    throw e;
  }
  state.style = style;
  renderLegend(style);

  // ---- view -------------------------------------------------------------------------------
  //
  // **`bounds: null` is stated, never silently substituted.** A bundle whose filter selected nothing
  // legitimately has no bounds; quietly fitting a unit square would open on an empty canvas that
  // looks exactly like a rendering fault, which is the silent-partial-map failure one level up.
  if (manifest.bounds === null) {
    text(
      'status',
      'this bundle declares no bounds, which means it published no rows — there is nothing to draw',
    );
  }
  const bounds = manifest.bounds ?? { xmin: 0, ymin: 0, xmax: 1, ymax: 1 };
  // The backing store is sized to the client box before the first fit, so `fitView` computes `scale`
  // against the dimensions the pointer's own conversion (`toStore`) will measure — never the fixed
  // `1280×900` markup attributes.
  sizeCanvasToClientBox();
  state.view = fitView(bounds, canvas.width, canvas.height);
  installInteraction();
  installResizeObserver();

  // ---- partitions -------------------------------------------------------------------------
  for (let i = 0; i < manifest.partitions.length; i++) {
    const asset = manifest.partitions[i];
    const bytes = await fetchAsset(asset);
    state.residentBytes += bytes.length;
    if (state.residentBytes > MAX_RESIDENT_BYTES) {
      throw new BundleFailure(
        'ceiling-exceeded',
        asset.path,
        `${state.residentBytes} resident bytes, above this viewer's declared ceiling of ` +
          `${MAX_RESIDENT_BYTES}. Refused rather than continuing until the tab is killed`,
      );
    }
    // Verified, then decoded, then drawn. Never drawn first.
    const partition = decodePartition(
      asset,
      i,
      bytes,
      manifest,
      (key) => style.groupFor(key),
      style.matchColumn,
    );
    state.partitions.push(partition);
    redraw();
    // Yield so the first partitions are visible while the rest verify.
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
  }

  record(`loaded ${state.partitions.length} partitions, ${manifest.rows} features`);
}

load().catch((e) => {
  fatal(e instanceof BundleFailure ? e : new BundleFailure('unhandled-error', 'viewer', String(e)));
  // Whatever verified is still on the canvas, and the banner says the map is incomplete.
  redraw();
});
