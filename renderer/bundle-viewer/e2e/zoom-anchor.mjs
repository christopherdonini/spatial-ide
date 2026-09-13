#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * E2E: the pointer and the view share one pixel space (DECISIONS-PENDING entry 86;
 * `ZOOM-ANCHOR-PREREGISTRATION.md` §3-§4).
 *
 * Moved here from the reproduction driver that found the defect — `zoomdrift.mjs`, run headless with
 * `playwright-core` against `scripts/serve-bundle.mjs` on 2026-09-13 (DECISIONS-PENDING entry 86's
 * reproduction note) — and made a proper, self-building, tolerance-declared test.
 *
 * ## What it reads, at each of the three window configurations named in §3
 *
 * A window LARGER than the viewer's historical 1280×900 backing store; a window SMALLER than it; and
 * the canvas's CSS box forced to exactly 1280×900 (the one configuration where the pre-fix bug cannot
 * show, because the ratio between the CSS box and the fixed backing store was exactly 1). For each:
 * move the pointer to the canvas's CSS-box centre, read the painted centroid — the mean position, in
 * **backing-store pixels**, of every canvas pixel with alpha > 8 — fire one centre-pointer wheel notch
 * (zoom in), read the centroid again, then fire the reversing notch and read a third time.
 *
 * From the before/after-zoom-in pair, the wheel's own affine law — `p' = anchor + factor*(p-anchor)`
 * — is solved backwards for `anchor`: the one backing-store pixel the zoom actually held fixed. The
 * pointer sits at the CSS box's own centre in every configuration (`page.mouse.move` to the box's
 * `getBoundingClientRect` centre), and the CSS box's centre maps to the backing store's own centre —
 * `canvas.width/2, canvas.height/2` — regardless of the box's size or the store/box ratio, purely
 * because it is the centre. So if the pointer and the view share one pixel space, `anchor` must equal
 * that centre in every configuration; if they do not, `anchor` reads back as the pointer's raw CSS
 * offset misread as a backing-store coordinate (confirmed against the pre-fix build below).
 *
 * ## Declared tolerances — computational, not accuracy or quality claims (docs/08_Testing.md:57-62)
 *
 * `SOLVED_ANCHOR_TOLERANCE_PX = 20` backing-store pixels — bounds the arithmetic of this
 * discriminator, nothing about rendering precision, sharpness or any pixel's colour.
 *
 * Solving for `anchor` divides by `(1 - factor)`, and separately, a wheel notch moves the
 * visible-bounds rectangle enough that features near its edge can cross it between the before/after
 * reads (`drawAll`'s own culling, `render.ts:184-191`) — changing which features feed the painted
 * centroid for a reason that has nothing to do with the anchor. Both effects were swept by `deltaY`
 * (`10`-`120`) against **this exact external bundle's geometry** before this value was chosen; a
 * `deltaY` of `40` was picked as a reasonable middle point, and the residual this technique reads
 * against a *correct* build was measured directly — **against a temporarily-patched fix, so as not to
 * measure the bug this file exists to catch** — at `deltaY = 40`, `DEVICE_SCALE_FACTOR = 1.5`, across
 * all three §3 configurations: 0.22, 11.67 and 14.56 store px. Repeated: identical to the pixel every
 * time (this is a deterministic property of this dataset's geometry meeting a fixed viewport and zoom
 * step, not run-to-run noise). It is present **even in the CSS-box-forced configuration**, where the
 * buggy and the fixed code compute the identical conversion — confirming it is a property of the
 * discriminator and this bundle's geometry, not of anchor correctness. `20` leaves headroom above the
 * worst of those three (14.56) while staying well below every pre-fix drift this file measures at the
 * same `deltaY`/`DEVICE_SCALE_FACTOR` (110.43 and 182.11 store px, pasted in this piece's own commit
 * history) — the discriminator stays effective with that margin.
 *
 * `RETURN_TOLERANCE_PX = 1.5` — the reproduction found the round trip exact ("Not cumulative: in-then-
 * out returns exactly", `ZOOM-ANCHOR-PREREGISTRATION.md` §1), so the reversing notch's centroid is
 * compared to the initial one with a tight tolerance that only absorbs floating-point/antialiasing
 * noise between two otherwise-identical paints, not a drift.
 *
 * ## The bundle: a declared external input
 *
 * `renderer/bundle-viewer`'s own build/test pipeline produces no published-bundle fixture — checked:
 * `scripts/` builds and unit-tests source modules only (`bundle-for-test.mjs`, `render.test.mjs`,
 * etc.), and `build.mjs` builds the *viewer*, never a bundle. `EXTERNAL_BUNDLE_DATA_DIR` below is the
 * bundle the reproduction driver already used: the human's published `100k-happy-path` bundle, which
 * lives **outside this repository** at a fixed machine path. This test serves that bundle's *data*
 * (`manifest.json`, `style.json`, `data/`) alongside **this checkout's own freshly built viewer**
 * (`dist/index.html`, `dist/app.js`, rebuilt by this script every run) — never the external bundle's
 * own frozen `viewer/` copy, which would still be the pre-fix build forever (§5 of the
 * preregistration: a published bundle's viewer is a frozen copy of whatever built it). If
 * `EXTERNAL_BUNDLE_DATA_DIR` is not present on the machine running this test, the test fails naming
 * the missing path — a missing external input is not a pass and is not silently skipped.
 *
 * ## Browser
 *
 * `playwright-core`'s Chromium, imported from `frontends/shell/node_modules` by relative path rather
 * than added as a dependency of this package — the same browser the reproduction driver used, with no
 * new dependency introduced to reach it. This launches no Spatial IDE app and no harness.
 */

import { execFileSync, spawn } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';

const HERE = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = join(HERE, '..');

/** The declared external input (see the module doc comment's "The bundle" section). */
const EXTERNAL_BUNDLE_DATA_DIR = 'C:\\Users\\Public\\spatial-ide-fixtures\\100k-happy-path';

const SOLVED_ANCHOR_TOLERANCE_PX = 20;
const RETURN_TOLERANCE_PX = 1.5;

/**
 * The wheel notch this file fires; `main.ts`'s own `factor = Math.exp(-e.deltaY * 0.001)`. Smaller
 * than the reproduction driver's `120` — see `SOLVED_ANCHOR_TOLERANCE_PX`'s own doc comment above for
 * the sweep this value was chosen from.
 */
const WHEEL_DELTA_Y = 40;
const ZOOM_IN_FACTOR = Math.exp(WHEEL_DELTA_Y * 0.001); // deltaY = -WHEEL_DELTA_Y on the wheel call

/**
 * A non-1 device pixel ratio. **Deliberately not 1** — with a store that tracks the CSS box exactly
 * (this fix's own effect) and `deviceScaleFactor: 1`, the measured ratio `toStore` computes is always
 * exactly `1` regardless of window size, which makes `toStore`'s multiplication a no-op and leaves the
 * mutation check (§4) unable to see a reverted wheel-site conversion: `1 * anything = anything`. `1.5`
 * (a common Windows display-scaling value, and not a "nice" integer either, which exercises "measured,
 * never assumed equal to `devicePixelRatio`" a little harder than `2` would) makes the ratio a real,
 * nontrivial quantity in every configuration, so a reverted conversion is a real, detectable error
 * again. The reproduction driver used `1` for a different reason — isolating the store/CSS-box defect
 * from any DPR question at all (DECISIONS-PENDING entry 86: "Not deck.gl, not DPR") — which was the
 * right call for *reproducing* the pre-fix bug, but leaves nothing for the *fixed* build's mutation
 * check to fail against.
 */
const DEVICE_SCALE_FACTOR = 1.5;

let chromium;
let browser;
let server;
let serverUrl;
let tmpServeDir;

before(async () => {
  if (!existsSync(EXTERNAL_BUNDLE_DATA_DIR)) {
    throw new Error(
      `the declared external bundle is not present at ${EXTERNAL_BUNDLE_DATA_DIR} — this is a ` +
        'declared external input of this E2E (see the module doc comment), not something this test ' +
        'can produce itself',
    );
  }

  // Rebuild the viewer from THIS checkout's current sources, every run — so the E2E always exercises
  // the code as it stands (pre-fix or post-fix), never a stale `dist/`.
  execFileSync(process.execPath, ['build.mjs'], { cwd: PACKAGE_ROOT, stdio: 'inherit' });

  tmpServeDir = mkdtempSync(join(tmpdir(), 'bundle-viewer-zoom-anchor-'));
  mkdirSync(join(tmpServeDir, 'viewer'), { recursive: true });
  cpSync(join(PACKAGE_ROOT, 'dist', 'index.html'), join(tmpServeDir, 'viewer', 'index.html'));
  cpSync(join(PACKAGE_ROOT, 'dist', 'app.js'), join(tmpServeDir, 'viewer', 'app.js'));
  cpSync(join(EXTERNAL_BUNDLE_DATA_DIR, 'manifest.json'), join(tmpServeDir, 'manifest.json'));
  cpSync(join(EXTERNAL_BUNDLE_DATA_DIR, 'style.json'), join(tmpServeDir, 'style.json'));
  cpSync(join(EXTERNAL_BUNDLE_DATA_DIR, 'data'), join(tmpServeDir, 'data'), { recursive: true });

  serverUrl = await startServer(tmpServeDir);

  const playwrightCorePath = join(
    PACKAGE_ROOT,
    '..',
    '..',
    'frontends',
    'shell',
    'node_modules',
    'playwright-core',
    'index.mjs',
  );
  if (!existsSync(playwrightCorePath)) {
    throw new Error(`playwright-core not found at ${playwrightCorePath} (frontends/shell's own devDependency)`);
  }
  ({ chromium } = await import(`file:///${playwrightCorePath.replace(/\\/g, '/')}`));
  browser = await chromium.launch({ headless: true });
});

after(async () => {
  if (browser) await browser.close();
  if (server) {
    server.kill();
  }
  if (tmpServeDir) rmSync(tmpServeDir, { recursive: true, force: true });
});

/** Spawn `scripts/serve-bundle.mjs` on an OS-chosen port and resolve once it reports which. */
function startServer(dir) {
  return new Promise((resolve, reject) => {
    server = spawn(process.execPath, ['scripts/serve-bundle.mjs', dir, '0'], {
      cwd: PACKAGE_ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let out = '';
    const onData = (chunk) => {
      out += chunk.toString();
      const m = out.match(/http:\/\/127\.0\.0\.1:(\d+)\/viewer\/index\.html/);
      if (m) {
        server.stdout.off('data', onData);
        resolve(`http://127.0.0.1:${m[1]}/viewer/index.html`);
      }
    };
    server.stdout.on('data', onData);
    server.stderr.on('data', (chunk) => process.stderr.write(chunk));
    server.on('error', reject);
    server.on('exit', (code) => {
      if (code !== null && code !== 0) reject(new Error(`serve-bundle.mjs exited ${code}`));
    });
  });
}

/** Runs in-page: the painted centroid, in backing-store pixels. */
function probe() {
  const c = document.getElementById('map');
  const context = c.getContext('2d');
  const d = context.getImageData(0, 0, c.width, c.height).data;
  let sx = 0;
  let sy = 0;
  let n = 0;
  for (let y = 0; y < c.height; y++) {
    for (let x = 0; x < c.width; x++) {
      if (d[(y * c.width + x) * 4 + 3] > 8) {
        sx += x;
        sy += y;
        n++;
      }
    }
  }
  return {
    storeWidth: c.width,
    storeHeight: c.height,
    centroid: n ? [sx / n, sy / n] : null,
    painted: n,
  };
}

/**
 * Drive one window configuration and return the readings §3/§4 need. Each call opens and closes its
 * own page, so the three configurations cannot leak state into each other.
 */
async function readZoomAnchor(name, viewport, forceCssBox) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: DEVICE_SCALE_FACTOR });
  try {
    await page.goto(serverUrl, { waitUntil: 'load' });
    await page.waitForFunction(
      () => /partitions verified/.test(document.getElementById('status')?.textContent ?? ''),
      null,
      { timeout: 20000 },
    );
    if (forceCssBox) {
      await page.evaluate(([w, h]) => {
        const c = document.getElementById('map');
        c.style.width = `${w}px`;
        c.style.height = `${h}px`;
      }, forceCssBox);
      // Let the ResizeObserver installed by the fixed build react before the pointer is placed.
      await page.waitForTimeout(150);
    }

    const rect = await page.evaluate(() => {
      const r = document.getElementById('map').getBoundingClientRect();
      return { x: r.x, y: r.y, w: r.width, h: r.height };
    });
    await page.mouse.move(rect.x + rect.w / 2, rect.y + rect.h / 2);

    const beforeZoom = await page.evaluate(probe);
    assert.ok(beforeZoom.centroid, `${name}: nothing painted before zooming`);

    await page.mouse.wheel(0, -WHEEL_DELTA_Y); // zoom in
    await page.waitForTimeout(150);
    const afterIn = await page.evaluate(probe);
    assert.ok(afterIn.centroid, `${name}: nothing painted after zoom-in`);

    await page.mouse.wheel(0, WHEEL_DELTA_Y); // zoom back out
    await page.waitForTimeout(150);
    const afterOut = await page.evaluate(probe);
    assert.ok(afterOut.centroid, `${name}: nothing painted after zoom-out`);

    const solvedX = (afterIn.centroid[0] - ZOOM_IN_FACTOR * beforeZoom.centroid[0]) / (1 - ZOOM_IN_FACTOR);
    const solvedY = (afterIn.centroid[1] - ZOOM_IN_FACTOR * beforeZoom.centroid[1]) / (1 - ZOOM_IN_FACTOR);
    const expected = [beforeZoom.storeWidth / 2, beforeZoom.storeHeight / 2];

    return { rect, beforeZoom, afterIn, afterOut, solved: [solvedX, solvedY], expected };
  } finally {
    await page.close();
  }
}

const CONFIGS = [
  {
    name: 'zoom anchor: window LARGER than the backing store',
    viewport: { width: 1900, height: 1100 },
    forceCssBox: null,
  },
  {
    name: 'zoom anchor: window SMALLER than the backing store',
    viewport: { width: 1100, height: 800 },
    forceCssBox: null,
  },
  {
    name: 'zoom anchor: canvas CSS box forced to exactly 1280x900',
    viewport: { width: 1900, height: 1100 },
    forceCssBox: [1280, 900],
  },
];

for (const cfg of CONFIGS) {
  test(cfg.name, async () => {
    const r = await readZoomAnchor(cfg.name, cfg.viewport, cfg.forceCssBox);

    const dx = r.solved[0] - r.expected[0];
    const dy = r.solved[1] - r.expected[1];
    const anchorDist = Math.hypot(dx, dy);
    assert.ok(
      anchorDist <= SOLVED_ANCHOR_TOLERANCE_PX,
      `${cfg.name}: solved anchor ${JSON.stringify(r.solved)} is ${anchorDist.toFixed(2)} store px from ` +
        `the expected backing-store centre ${JSON.stringify(r.expected)} (css rect ${JSON.stringify(r.rect)}, ` +
        `tolerance ${SOLVED_ANCHOR_TOLERANCE_PX}px)`,
    );

    const rdx = r.afterOut.centroid[0] - r.beforeZoom.centroid[0];
    const rdy = r.afterOut.centroid[1] - r.beforeZoom.centroid[1];
    const returnDist = Math.hypot(rdx, rdy);
    assert.ok(
      returnDist <= RETURN_TOLERANCE_PX,
      `${cfg.name}: zoom-out did not return — centroid moved ${returnDist.toFixed(2)} store px ` +
        `(tolerance ${RETURN_TOLERANCE_PX}px)`,
    );
  });
}
