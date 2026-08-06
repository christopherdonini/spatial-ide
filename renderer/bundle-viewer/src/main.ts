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
import { parseManifest, type FetchableAsset, type Manifest } from './manifest.js';
import { decodePartition, type Partition } from './partition.js';
import {
  drawAll,
  fitView,
  MAX_ATTRIBUTE_COLUMNS,
  MAX_FEATURES,
  MAX_PARTITIONS,
  MAX_RESIDENT_BYTES,
  pick,
  unproject,
  type View,
} from './render.js';
import { sha256Prefixed } from './sha256.js';
import { Style } from './style.js';

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

  const licenceState = String(m.license.state ?? 'unknown');
  const licenceName = typeof m.license.license === 'string' ? m.license.license : null;
  const attribution = typeof m.license.attribution === 'string' ? m.license.attribution : null;
  // **An absent license name is rendered as an absence, not as a name.** This line used to print
  // `(unnamed)`, which is the manifest's old `"(unnamed)"` placeholder relocated to the pixel layer:
  // a bundle whose manifest correctly says "no license was named" would still show a parenthesized
  // token in the position a license name occupies, and a reader could take it for one. The manifest
  // carries `null` here (ADR-017 Corrigendum 1); the viewer says so in words.
  const licenceLabel = licenceName ?? 'not named by the source';
  text(
    'license',
    licenceState === 'not-declared'
      ? 'license and attribution: unknown / not-declared'
      : `license: ${licenceLabel}${attribution ? ` · ${attribution}` : ''} (${licenceState})`,
  );
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
    lastX = e.offsetX;
    lastY = e.offsetY;
  });
  window.addEventListener('mouseup', () => {
    dragging = false;
  });
  canvas.addEventListener('mousemove', (e) => {
    if (!state.view) return;
    if (dragging) {
      // Pan in world units, in f64: the view's centre *is* the render origin, so panning moves the
      // origin and every drawn value stays small.
      state.view.centerX -= (e.offsetX - lastX) / state.view.scale;
      state.view.centerY += (e.offsetY - lastY) / state.view.scale;
      lastX = e.offsetX;
      lastY = e.offsetY;
      redraw();
      return;
    }
    hover(e.offsetX, e.offsetY);
  });
  canvas.addEventListener(
    'wheel',
    (e) => {
      if (!state.view) return;
      e.preventDefault();
      const factor = Math.exp(-e.deltaY * 0.001);
      // Zoom about the cursor: unproject before, re-project after, and move the centre to keep the
      // world point under the pointer. The unprojected value is used for this and discarded.
      const [wx, wy] = unproject(e.offsetX, e.offsetY, state.view);
      state.view.scale *= factor;
      const [nx, ny] = unproject(e.offsetX, e.offsetY, state.view);
      state.view.centerX += wx - nx;
      state.view.centerY += wy - ny;
      redraw();
    },
    { passive: false },
  );
}

function hover(px: number, py: number): void {
  if (!state.view || !state.style) return;
  const el = document.getElementById('hover');
  if (!el) return;
  // Cursor unprojection, permitted by ADR-010 rule 2 for hover feedback. Its result selects a
  // candidate and is then discarded — it is never shown and never stored.
  const [wx, wy] = unproject(px, py, state.view);
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
  const style = Style.parse(new TextDecoder().decode(styleBytes), manifest.style.path);
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
  state.view = fitView(bounds, canvas.width, canvas.height);
  installInteraction();

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
