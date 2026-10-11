# The map refills after a resize — a layout change that uncovers map area asks for it, with no pan or zoom
# (PLAN node shell-map-refill-after-resize)

File: frontends/shell/SHELL-MAP-REFILL-AFTER-RESIZE-PREREGISTRATION.md
Authority: PLAN node `shell-map-refill-after-resize`; the human's direction of 2026-10-09, item 2b (state/directives/2026-10-09-slot-orders-pilot-and-reuse-standing-step.md:15 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:040b8716b32f7ab092a058a8aba527ea7eb982ca78fa029606d7bf6335514f12); the ruling it rests on, question round 67, item 3 (OPEN-7), with the human's clarification (state/directives/2026-10-07-round-66-and-67-rulings.md:24-29 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:479cf1dcc5e450af01e47b4ecdeec9219d65105380471aa4a79402f03adfe077). Its RULED blocks are in DECISIONS-PENDING.md, referenced and not restated.
Drafted by: the architect agent, alone (the product-first direction, section 1); code read at main d88ceddaeb88707941e0868a900eb2f7999da06b.
Committed before any code. Append-only once committed; an amendment made after any outcome has been seen says so in its first line. Nothing in this form is a quotation.
Form: full (AUTONOMY.md §21a: a documented never-block contract and the cancellation path gain a trigger; §21c: new user-visible behaviour and size; §25(e)).
Code starts after `e2e-hover-establishing-read-stale` has merged; milestone 2's code waits for this piece.

## §0. Disclosure

0.1 Inputs.
- The node; the direction and the ruling above; frontends/shell/SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md (§0.5 H1, §4's RESIZEQ row, Amendments 4 and 13); state/consults/2026-10-08-shell-migration-milestone-1-worker-report-2.md, section 7.
- KNOWN-LIMITATIONS item 39; the migration plan, §2 and §5; ADR-010; ADR-018; docs/01; the product-first direction, sections 1, 2 and 4; state/directives/PORTABILITY-2026-09-30.md §2.
- The shell's code, e2e suites and MANUAL-WALKTHROUGH.md at the commit above.
- deck.gl's installed sources under frontends/shell/node_modules. These are untracked, so they are cited as evidence of the interface and not as Authority. The version is pinned by the tracked lockfile.
- No pilot, no spike, nothing measured.

0.2 Pins. Every `@ d88ceddaeb88707941e0868a900eb2f7999da06b` pin is historical (round 14). The worker re-derives every cite at the code's base commit. For the work, the tree at that base is authoritative; for what this form read, the pin is.

0.3 What drives a viewport query today.
- WorkingCanvas reports the view through one prop. Its declared interface: frontends/shell/src/canvas/WorkingCanvas.tsx:529-531 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:c4103377895ccc2f72c23e4f6b5c30f9efe3f105ff022f364b6d0e7ffb78287d. The prop is mirrored into a ref: frontends/shell/src/canvas/WorkingCanvas.tsx:1003-1004 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:c1ee9532813ea70ba1893ad4290db1fb7e45d38a10424290bb908a5658557dfc.
- There are three report sites, all of them camera writes:
  - the interactive handler: frontends/shell/src/canvas/WorkingCanvas.tsx:1977-1987 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:55bc88e82cbb6831d56606c71a1705532c62fc6899fb61a703640304027d1602;
  - the fit: frontends/shell/src/canvas/WorkingCanvas.tsx:1323-1328 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:6ed8cdad666a0e7e2c7c27d8f5da95cefadb3ab0137412b718ecd95fe75438b1;
  - the DEV-only camera seam: frontends/shell/src/canvas/WorkingCanvas.tsx:2184-2186 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:752b20a154bfa9f265605a5071206f9e913b4b71507411924f92afa7bb0e7f71.
- Nothing reports on a size change. That is H1 of milestone 1, which held (its Amendment 4, item 7).
- The auto-fit on open does not report:
  - baseline: frontends/shell/src/canvas/WorkingCanvas.tsx:1451-1460 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:7ec05e1fe94fae155ac9101a9e3bd83e0f6ca9ac4042c4403872072a8afd00a3;
  - candidate: frontends/shell/src/canvas/WorkingCanvas.tsx:1653-1655 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:59e450f02da31da806c0ac92dbdc0c4d48bd6b43508bcb847770571ff141639f.
- Zoom to layer does report: frontends/shell/src/canvas/WorkingCanvas.tsx:1494-1501 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:2668eda668a14d5682034b2114a2b5b72f51e94c96305f7315815e72b88bf267.
- The bbox is one pure function of target, origin, zoom and CSS size: frontends/shell/src/canvas/viewportBbox.ts:37-49 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:2ed8ec8111f2be7bf2c1f9a53ae6c91dd98f831573fab6116738e0c321933634.
- The file's pixel basis is the canvas's CSS client size: frontends/shell/src/canvas/WorkingCanvas.tsx:1143-1151 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:0ac306c70342a6f113fe3fe5cd6512e75af105f95459cd597626e36ef361796c.
- WorkingCanvas never reads deck's internal view state.

0.4 Consuming-side interfaces, read before any seam is drafted.
- App's handler writes the current-view box, then calls the debounced entry point: frontends/shell/src/App.tsx:1829-1843 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:4233f9d9468b9ad42eff2e8ce8514ff3d415d2aaa83999fc9723c35767c0fae3.
- The baseline debounce: frontends/shell/src/App.tsx:1608-1619 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:05a3b5e44c12c7ceae95cb7e33b3c11bd547abdc67770e61436b9be75259c8ef. The candidate pass-through: frontends/shell/src/App.tsx:145-153 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:6ff10c307653b57b3d07a6a76051ac590a67147ef9d7f478d9963703b3ffb168. The candidate's own debounce: frontends/shell/src/residency/candidateArmSession.ts:1445 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:08ca46cd40e0f963d0a6f835ca9499463dbca2af69781bf560452aeaafe502fa and frontends/shell/src/residency/candidateArmSession.ts:1616-1622 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:9928fb4a1d31cde3f5e83ae6f43f73c9d950e0fdc571ca48ede5e854c3d44983.
- The trailing debounce: frontends/shell/src/streaming/debounce.ts:35-54 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:14a1e09f6be7022de78a3dfe858a4267e9fe1ab65e324e0bcffe974870df8fa3. Its window: frontends/shell/src/streaming/viewportStreamManager.ts:25 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:0c951f7fadc18dad65170ff2adf4b3bf6efb41ac49ab9056eac397495e0b1a84.
- The candidate plan returns early when stopped, ended or frameless; it prunes tiles that left the view and issues only cells that are neither tracked nor resident: frontends/shell/src/streaming/tileViewportStreamManager.ts:494-513 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:0e1863eada028a4ca83334d5d125d3012649013078bdebe4413a91b599ea17fe.
- The Export panel's Current view reads App's box at click time:
  - frontends/shell/src/App.tsx:1976 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:6ffb9b69f56049562b4ea92631c9b0f5c64c9ab3aadcb17673ee84b887136a33;
  - frontends/shell/src/publish/PublishPanel.tsx:345 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:4ec6b8a27bb61e0d3c89af4229342c6b51f2cb7be19c7f3e57fdf3fbdf81a54f;
  - frontends/shell/src/publish/PublishPanel.tsx:362 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:302858208a433a8d666ae4e8a1b36ea84b434ff6701e31b268fc41b08f60fa52.
- deck's resize callback. The installed version is pinned by the tracked lockfile: frontends/shell/package-lock.json:452-453 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:f1ae4317359d42c653a8125c3da5b15ade19becebb5726d63badf41e5ec2401a. The untracked sources show:
  - `DeckProps.onResize` is documented as called when the canvas resizes (`node_modules/@deck.gl/core/dist/lib/deck.d.ts`, lines 147-151);
  - deck calls it after setting the new size on its view manager (`node_modules/@deck.gl/core/dist/lib/deck.js`, lines 740-766);
  - deck owns luma's resize observer (same file, lines 698-707).
- The map's rows: the attention strip and the status bar are auto-height rows around the map (frontends/shell/src/styles.css:34 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:dcb018dbdc37f212e2f6fc2c09bf3bb82d78db0d1d7cd97c2c2503a6204eb1fa). A banner or a wrapping status text therefore changes the map's height.

0.5 Hypotheses. Each is labelled and carries its discriminator.
- **H1.** On every change of the canvas's CSS size, deck 9.3.9 calls `onResize` after its viewports carry the new size. That covers a region toggled, a splitter dragged and the window resized. The view stays centred on the same target, so the box computed from the camera the canvas last wrote, at the new size, is the box deck draws.
  - Discriminator: e2e RESIZEQ.
  - If it fails: invalidator I1.
- **H2.** Asking only on growth beyond the last asked box ends every feedback sequence. A query's own status text can resize the map through the bars. A shrink asks nothing, and a growth back to a size no larger than the last asked asks nothing, so no query can recur without input.
  - Discriminator: RESIZEQ and FILL each settle after their toggles.
  - If it fails: invalidator I6.
- **H3.** At filter-zoned's fit view on the default medium grid, closing the Inspector covers at least one grid cell that no plan has requested. The facts it rests on:
  - the grid is twice the anchor span (frontends/shell/src/canvas/tileGrid.ts:104-107 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:5ea8a1b42bee699e86ab50f849932a2603f38d5a701442fa16c609cc7809afbe);
  - it is 16 cells per axis at medium (frontends/shell/src/canvas/tileGridConstants.ts:26-35 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:e34dd552d4ca1456db61c5a4c0182f4dc95d6f9b990bac589b218b2d00bee7bb);
  - the Inspector is 340 px plus a 6 px splitter (frontends/shell/src/layout/layoutConstants.ts:29 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:d5291a26a7bbaca9368606f302441156e8f1a312cbc556fcc1255807d8f2c45a and frontends/shell/src/layout/layoutConstants.ts:40 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:03065701530066568c0ba2eb3720a90850517b0a23174bab83e1eb144731f08c).
  - Discriminator: RESIZEQ's computed precondition.
  - If it fails: invalidator I3.

0.6 Reuse index. The custodian ran `node tools/reuse.mjs` at the private clone's 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c. resize, viewport query, layout and refill have no prior art recorded. viewport has one hit, level-of-detail selection, which is not this piece. A miss does not block.

## §1. May and may not claim

- **May claim:** the behaviour of §2, and the properties §4 tests.
- **May not claim:**
  - any frame rate, latency, performance figure or docs/08 row;
  - that the uncovered area fills at any particular speed;
  - any macOS or Linux level above L1 (PORTABILITY R5).
- **No change** to the wire, the kernel, the engine, `skp/`, `streaming/`, `residency/` or `src-tauri`. No new constant, no timer, no dependency.
- **ADRs.** ADR-006, ADR-010 (rules 1 and 6) and ADR-018 are cited. None is amended.
- **Layout is not workspace** (plan §2 rule 10). A size change marks nothing and records no history step. A query it causes is recorded in the console as a class-A `viewport_query`, as a pan's is (frontends/shell/src/console/surfaceRegistry.ts:82 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:72ae008a03bed0ea94e2b47e5d220a14399c6adb2908e5f326e7f2f1658e3d19; frontends/shell/src/skp/client.ts:53 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:fdef6e0e537b960e33c16b666d44dabcd40650e4c77c7f29272940c4a2543ed5).

## §2. The change

### 2.1 The decision, a pure function

`viewportAfterResize(camera, lastQueried, widthPx, heightPx)`, in `canvas/viewportBbox.ts`, beside the box function it reuses.

- **Inputs:**
  - `camera`: the target, origin and zoom the canvas last wrote, or null;
  - `lastQueried`: the box last passed to `onViewportChanged`, or null;
  - the canvas's CSS client size now.
- **Results:**
  - `none`, when `camera` or `lastQueried` is null, or the size is not finite and positive;
  - `within(bbox)`, when the new view's box lies inside `lastQueried` (closed containment, so equal edges count as inside);
  - `query(bbox)`, otherwise.
- **The box** is `computeAuthoritativeViewportBbox` of `camera` at the new size: the same function, never reimplemented.

### 2.2 The trigger and the wiring (WorkingCanvas.tsx)

- **A camera ref.** It holds the inputs of the last camera write, without the size. It is written at exactly the three camera-change sites: the interactive handler (with the origin from before the recenter, as its report uses), `fitToExtent` (whether or not it notifies) and the DEV seam.
- **One reporting function.** It sets `lastQueried` and calls `onViewportChangedRef.current`. The three existing report sites call it. It becomes the only call of `onViewportChangedRef.current` in the file.
- **deck's `onResize` prop.** It is passed to the Deck constructor. Its handler reads the canvas's client size, then calls `viewportAfterResize`:
  - on `query`, it calls the reporting function;
  - on `within`, it calls the new prop `onViewportWithinLastQuery(bbox)` (§2.3), which issues nothing;
  - on `none`, it does nothing.
  - deck's own `{width, height}` arguments are only the trigger. The size comes from the file's own basis.
- **What the handler does not do.** It does not touch the hover state, the re-pick scheduler or the frame origin, and it reads nothing of deck's view state or viewports. The existing D4 rule stands: a resize disarms a pending re-pick.
- **Doc comments.** The prop doc at :529-531 is corrected. The prop fires on every view change, not only settled ones, and now also on a growth beyond the last asked box.

### 2.3 App.tsx (from `return (` on only)

- One JSX prop on `<WorkingCanvas>`: `onViewportWithinLastQuery={(bbox) => { lastViewportBboxRef.current = toWireBbox(bbox); }}`.
- It issues no query and does not touch `hasSettledView`.
- Its product caller is the Export panel's Current view, which then reads the box the map actually shows after a shrink. This is OPEN-1 (A).

### 2.4 Coalescing, cancellation, never-block

- **No new timer.** A burst (a splitter drag, a window drag) produces one report per deck resize. Each passes through App's existing trailing debounce, so continuous motion issues nothing and the settled size issues the query. The window is VIEWPORT_QUERY_MIN_INTERVAL_MS, 120 ms, unchanged.
- **Superseded work** is cancelled by the existing managers: baseline supersedes on issue; candidate prunes tracked cells that left the view (ADR-018's vocabulary, unchanged).
- **The handler is constant-time arithmetic,** with no await (docs/01, never block the canvas).
- **Before the open's first reported view** (`lastQueried` null), a size change asks for nothing: the open's first look stands. This is OPEN-2 (A). The auto-fit's reason for not notifying is unchanged.

### 2.5 KNOWN-LIMITATIONS 39: retired (DRAFT wording for the human's P6 sight)

The text below replaces item 39 in place, in the form item 18 uses:

39. **Retired by shell-map-refill-after-resize.** When the map grows, because a region is closed, a splitter is dragged or the window is enlarged, the shell asks for the part of the map that lies outside the area it last asked for, with no pan or zoom. When the map shrinks it asks for nothing, because what it shows is already inside that area. Before the first pan, zoom or Zoom to layer after a file is opened, the map shows the features loaded when the file opened, and a change of size asks for nothing new. The number is kept so that references to it still resolve.
    <!-- Retired by frontends/shell/SHELL-MAP-REFILL-AFTER-RESIZE-PREREGISTRATION.md §2.5 and its Amendment 1 (OPEN-1, OPEN-2); DRAFT wording for the human's sight, not the human's own wording. Authority: question round 67, item 3 (OPEN-7) with the human's clarification in state/directives/2026-10-07-round-66-and-67-rulings.md; the direction of 2026-10-09, item 2b. The decision is viewportAfterResize in frontends/shell/src/canvas/viewportBbox.ts (viewportBbox.test.ts RF1 to RF6); the wiring is proven by e2e/layout.mjs RESIZEQ and FILL. -->

Under OPEN-2 (B), the third sentence is dropped. Under OPEN-1 (B), a sentence on Current view after a shrink is added instead of RF8 and RF9.

### 2.6 Walkthrough: a new Part

The next letter after the last Part at the base is V. It is the human's felt verdict, with a blank result log, and it has no duration in any row. Part U, row U6 included, is unchanged.
- **V1:** launch; open `100k-happy-path.parquet`; zoom in two wheel notches at the map's centre; wait until the map stops changing.
- **V2:** press Ctrl+I. Record whether the strip the map gains fills with features with no pan or zoom, or stays empty until one.
- **V3:** press Ctrl+I again. Then drag the map | Inspector splitter back and forth several times without letting go, and let go. The map stays usable during the drag. Record whether the area it uncovered fills with no pan or zoom.
- **V4:** restore the window down, then maximise it. Record the same.
- **V5, felt:** does the map keep up when panels and the window change size? Record the verdict in your own words.
- **V6:** open the file again. Before any pan or zoom, press Ctrl+B. Record what the uncovered strip shows (§2.4, OPEN-2).

### 2.7 e2e/README.md

The layout paragraph's RESIZEQ sentence is replaced by the asserted RESIZEQ and FILL and the recorded BURST (§4).

### 2.8 Boundaries

- **Files that change:**
  - `src/canvas/viewportBbox.ts`, `src/canvas/WorkingCanvas.tsx` and `src/App.tsx` (JSX only);
  - `src/canvas/viewportBbox.test.ts`, `src/canvas/WorkingCanvas.test.ts` and `src/App.layout.test.tsx`;
  - `e2e/layout.mjs`;
  - outside the count: `e2e/README.md`, `MANUAL-WALKTHROUGH.md` and `KNOWN-LIMITATIONS.md`.
- Nothing else.

### 2.9 Portability (R1 to R6)

- **R1:** the semantics are the same on every platform: ask for an uncovered area, never on a shrink.
- **R2:** no OS mechanism and no OS-conditional code. The size change comes through deck and luma's resize observation, inside WorkingCanvas, which already owns display scaling. No new boundary.
- **R3:**
  - Windows: supported; tested by the unit tests, the render tests and the e2e suite.
  - macOS (WKWebView) and Linux (WebKitGTK): supported by construction, at L1 by the unit and render tests only.
  - L2 is deferred to the node `shell-real-app-run-macos-linux`.
- **R4:** no coupling added.
- **R5:** no claim above L1 off Windows.
- **R6:** no test skipped on any platform.

## §3. Fixtures and predicted outcomes

- **Fixtures.** No new fixture: `filter-zoned.parquet` (RESIZEQ) and `100k-happy-path.parquet` (FILL), each hashed before and after, as the suite already does.
- **RESIZEQ:**
  - after Zoom to layer, closing the Inspector gives at least one new `viewport_query` line within 3 s, where the base gave 0;
  - reopening gives 0.
  - The computed number of newly covered cells is recorded beside the observed count.
- **FILL:** at least one stream is issued after the toggle, with at least one batch of more than 0 rows. At the base, none.
- **Every other e2e suite:** the same step outcomes as at the base.

## §4. Tests, and one mutation each

Every mutation is observed by applying it, running the named test, recording its failure by name with the commit it was observed at, and reverting it. A verify-mutation run is not an observation.

| ID | Kind and file | Asserts | Mutation, and its expected failure |
|---|---|---|---|
| RF1 | unit, src/canvas/viewportBbox.test.ts | Wider at the same height after a query → `query`, with a box deep-equal to `computeAuthoritativeViewportBbox` of the camera at the new size | compute the box at the camera's last-written size |
| RF2 | unit, same | Narrower, or back to a size no larger than at the last query → `within`, with the new box; never `query` | treat any size change as `query` |
| RF3 | unit, same | Taller only (Activity closed) → `query` | compare widths only |
| RF4 | unit, same | No query yet, or no camera → `none` | drop the `lastQueried` guard |
| RF5 | unit, same | Zero, negative or non-finite size → `none` | drop the size guard |
| RF6 | unit, same | Same camera and same size → `within`, with a box bit-identical to `lastQueried` | strict containment (equal edges count as outside) |
| RF7 | unit (source text, as frontends/shell/src/canvas/noCoordinateLeak.test.ts:57 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:fd8de853459741fb754f9961f77c66995956f63cae6201a8a0e8644398a94e5b reads files), src/canvas/WorkingCanvas.test.ts | WorkingCanvas.tsx calls `onViewportChangedRef.current(` exactly once, and the Deck constructor passes `onResize` | restore a direct call at the fit site; the count reaches 2 |
| RF8 | render, src/App.layout.test.tsx (the real App, WorkingCanvas stubbed as the file already does, the stub keeping its props) | After the stub's `onViewportChanged(b1)` and then `onViewportWithinLastQuery(b2)`, the Export panel's Current-view prepare carries b2. Observed at the mocked `publish/client` `publishPrepare` and driven through the rendered Export control | empty App's within handler; the prepare carries b1 |
| RF9 | render, same | `onViewportWithinLastQuery` causes no `requestViewport` on the mocked manager across two debounce windows; `onViewportChanged` causes exactly one | App's within handler also calls the debounced entry point |
| RESIZEQ | e2e, e2e/layout.mjs, now asserted | On filter-zoned: a real `.zoom-to-layer` click; settle (trace quiet 3 s, in-flight and queued counts 0); then the precondition, computed from `residencyGridFrame`, the last view-state line (parsed as frontends/shell/e2e/regression.mjs:1989-1996 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:14cebe83fad05ccd8340844ba33289a643772ea0462fb4137a0cd3e738167447 does) and the DOM sizes: predicted new cells ≥ 1, else STOP (I3). Ctrl+I gives ≥ 1 new `viewport_query` line within 3 s; the trace settles (H2); Ctrl+I again gives 0 | remove `onResize` from the Deck props; the close count is 0 |
| FILL | e2e, same, after E-REOPEN | On the 100k fixture, after the grid frame exists and the trace settles: real wheel notches at the canvas centre, their number computed from measured values and recorded, never tuned to pass. Precondition: the cell's on-screen size is below the growth per side, and the grown view lies inside the anchor box, else STOP (I3). Ctrl+I gives, within 10 s, ≥ 1 `stream-issued` line after the toggle and ≥ 1 `batch` line with rows > 0 for one of those handles; the trace settles; Ctrl+I restores | the resize handler reports `lastQueried` instead of the new box; no stream is issued after the toggle |
| BURST | e2e, same, recorded and not asserted | A continuous pointer drag of the map \| Inspector splitter (≥ 20 moves, then release): the `viewport_query` lines, with times relative to the first move, the last move and the release | none: an observation; timing on a shared machine is not asserted |

**Assertion, e2e or felt, per acceptance item:**
- **The uncovered area is asked for:** RF1, RF3 and RESIZEQ.
- **It fills:** FILL (data arrives), and V2 to V4 (felt).
- **A shrink asks nothing:** RF2, RF6, RESIZEQ's reopen and RF9.
- **Current view after a shrink:** RF8.
- **A burst is coalesced:** App's existing debounce, already under test in frontends/shell/src/streaming/debounce.test.ts (a burst inside the settle window collapses to one call) and in App.test.ts's `makeCandidateViewportDispatcher` suite. The new path enters that debounce at the one reporting site (RF7). Plus BURST (recorded) and V3 (felt).

## §5. Predictions, declared unchanged, invalidators, falsification

**Predicted:** H1 to H3, and §3.

**Declared unchanged:**
- Every file outside frontends/shell apart from KNOWN-LIMITATIONS.md.
- `skp/`, `streaming/`, `residency/`, `layout/`, `console/`, `publish/` and `src-tauri/`.
- App.tsx above `return (`, apart from imports.
- `debounce()` and VIEWPORT_QUERY_MIN_INTERVAL_MS; both managers' supersede and prune.
- The untiled first look and its 10,000-row limit (frontends/shell/src/canvas/tileGridConstants.ts:185 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:61c4f5a8d589f14a8f542eb00fe28e216fb08f39d63081b68417f3e95da2996b).
- The auto-fit's `notifyViewport: false`; Zoom to layer's `true`; the DEV seam's restriction to the identity mode.
- The hover re-pick, its three arming sites and D4's resize disarm.
- Every e2e suite except layout.mjs, and every threshold.
- Walkthrough Parts A to U.
- The console registry (no new row).
- tauri.conf.json, package.json and the lockfile.
- Every KNOWN-LIMITATIONS item except 39.

**Invalidators.** Each one means STOP and report.
- **I1:** H1 fails. A shell-owned ResizeObserver would be a design change, taken by amendment.
- **I2:** an existing e2e step's outcome differs between the base and the head. No threshold is edited; it is recorded as class 2.
- **I3:** a precondition in RESIZEQ or FILL fails by construction.
- **I4:** a consuming interface in §0.4 differs at the code's base.
- **I5:** a dependency seems necessary.
- **I6:** queries recur with no input, or a toggle's trace does not settle.
- **I7:** RF8 or RF9 can pass only by mocking the layout, the Export panel or App itself.

**Falsification.** The form is wrong if, at the base, the box computed from the camera the canvas last wrote and its new size is not the box deck draws after a resize.

## §6. Instruments

- **Assertions:** RF1 to RF9, RESIZEQ and FILL.
- **Observation, not asserted:** BURST, and RESIZEQ's computed count beside its observed count.
- **Measurements:** none.
- **The human's:** V2 to V6.

## §7. Declared values and ceilings

- **No new product constant.** The coalescing window is the existing 120 ms.
- **e2e-local windows,** declared in layout.mjs, not timing claims: RESIZEQ 3 s, as the step has today; FILL 10 s.
- **Budget.** Insertions plus deletions per §21c, tests included, taken at a named commit with `git diff --numstat <base>...HEAD -- frontends/shell ':(exclude)frontends/shell/SHELL-MAP-REFILL-AFTER-RESIZE-PREREGISTRATION.md' ':(exclude)frontends/shell/MANUAL-WALKTHROUGH.md' ':(exclude)frontends/shell/e2e/README.md'`, where `<base>` is the merge base with origin/main at the cut.

| Group | Files | Lines, at most |
|---|---|---|
| G1 product: viewportBbox.ts (≤ 45), WorkingCanvas.tsx (≤ 90), App.tsx JSX (≤ 15) | 3 | 150 |
| G2 unit and render tests: viewportBbox.test.ts (≤ 120), WorkingCanvas.test.ts (≤ 40), App.layout.test.tsx (≤ 90) | 3 | 250 |
| G3 e2e: layout.mjs | 1 | 200 |
| **Total** | **7** | **600** |

Outside the count: MANUAL-WALKTHROUGH.md ≤ 30, e2e/README.md ≤ 12 and KNOWN-LIMITATIONS.md ≤ 8. An overrun is class 8, and this section is never edited to match it.

## §8. Block-on-sight

1. A timer, debounce, throttle or new constant in the resize path.
2. A second call site of `onViewportChangedRef.current`, or a query path from WorkingCanvas that bypasses the one reporting function.
3. A query on a size change whose new box lies inside the last asked box.
4. A query on a size change before the open's first reported view (while OPEN-2 is (A)).
5. A read of deck's view state, viewports or view manager, or of an unprojected coordinate.
6. A size change that arms a re-pick, changes a hover readout or moves the frame origin.
7. A file edited outside §2.8, or any path under engine/, kernel/, protocol/, src-tauri/, skp/, streaming/ or residency/.
8. An App.tsx edit above `return (` other than an import.
9. A dependency or lockfile change.
10. A callback, option or export without a product caller.
11. Any e2e file other than layout.mjs edited, a threshold edited, or `e2eSetViewState` called from layout.mjs.
12. A performance claim or a docs/08 row.
13. A KNOWN-LIMITATIONS or walkthrough sentence claiming more than §4 shows.
14. A new product string.
15. A quote of the human's words marked verbatim that does not match its source.
16. A new test without its observed mutation.

## §9. Gates

- **Architect and reviewer,** full gating, verdicts per the product-first direction, section 2:
  - Correctness or Evidence blocks;
  - a documentation or record finding is fixed in the same PR before the merge;
  - each reviewer checks §8 item by item.
- **Suites,** green first:
  - frontends/shell `npm run verify`;
  - every e2e suite at the base and at the head, step by step, listed in the PR body;
  - the governance scripts' `node --test`;
  - verify-cites, verify-quotes and verify-test-claims, each tool named with its commit.
- **Operator:** Part V, committed with a blank log and queued to the sitting. The felt verdict and the P6 sight of item 39 are the human's.
- **Owner's index:** none for frontends/shell was found. If the custodian names one, the worker updates it in this PR.

## §10. Amendments

Opens empty, append-only.

## §11. Open items for the human

Full options are in the question round.
- **OPEN-1:** the Export panel's Current view after the map shrinks. Recommended: (A).
- **OPEN-2:** a growth before the open's first pan, zoom or Zoom to layer. Recommended: (A).

Neither is a red line. Each answer is recorded as Amendment 1 before dispatch.

## §12. Heavy runs

The worker's and tester's briefs carry, as written, the paragraph at state/directives/2026-10-06-machine-script-adopted.md:12-22 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:7350977156bed7c94b0da4e8db806ba34c25c6678e65c46447a62d791ba9e8e1. This form names no other rule for builds.

### Amendment 1 — the human's rulings on OPEN-1 and OPEN-2, and on item 39's wording (class 5)

*Written by the custodian after the human's typed rulings were received (08:37:12Z by the transcript) and before any code. It records the human's rulings on this form's open items. References only; nothing below is a quotation.*

1. **The ruling:** state/directives/2026-10-09-rulings-on-the-eight-forms.md:22-25 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:52a1f0e2b5fbb92a555700f00ef047b9cbe491a455bc2ca67df097bfd8bc4adf.
2. **OPEN-1 is (A).** §2.3's query-free report (`onViewportWithinLastQuery`) stands, with RF8 and RF9.
3. **OPEN-2 is (A).** §2.4's rule stands: before the open's first reported view, a change of size asks for nothing. §8 item 4 binds, and item 39's third sentence stays.
4. **Item 39's wording in §2.5 is approved as drafted.** At implementation, the item's HTML comment says the wording was approved by the human on 2026-10-09 (this amendment), in place of its draft-for-sight note. No other word of the item changes.
5. **Slot order:** this piece is slot 1's third item, after the K6 fix and the e2e re-aim (state/directives/2026-10-09-rulings-additions-reaim-identity-route-documents.md:6-8 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:79541881379e64b126e1f694fefb41bda639d4c04bbd80543867d577307118d4). Its code starts when both have merged.
6. **Superseded index:** §11 → items 2 and 3; §2.5's draft note → item 4; the code-start line in the header → item 5. Nothing above is edited.

### Amendment 2 — FILL after invalidator I3: the cause, and FILL's setup and precondition replaced before any code of them (class 1), written after results were seen

*Written by the architect after results were seen: worker report 2 (`state/consults/2026-10-11-shell-map-refill-after-resize-worker-report-2.md`) and worker report 3 (`state/consults/2026-10-11-shell-map-refill-after-resize-worker-report-3.md`), each cited by section; their filing notes carry their hashes. The branch head is 64de82e6, which this amendment does not change. Code was read at main 76c3ea346fff486467be4330b67f331b501234e3 and on the branch at 64de82e6. Nothing below is a quotation. Arithmetic marked "mine" is computed from report 3's table.*

1. **The result.** I3 fired at FILL at the head (report 2, Runs and the layout comparison's FILL bullets). The diagnostic (report 3, Diagnostic (A)) recorded 26 states at the head. No state satisfies both precondition terms. The grid level is medium in every row, so a stale level is not the cause.

2. **The cause, from the code.**
   - (a) **The cell term** (`frontends/shell/e2e/layout.mjs` (`:424-429` at 64de82e6)) stands in for a cell newly covered relative to the current view. RESIZEQ computes that count exactly (`frontends/shell/e2e/layout.mjs` (`:374-376` at 64de82e6)).
     - FILL needs a different fact: a cell no plan of the session has asked for (H3's wording).
     - The planner issues only cells neither tracked nor complete (frontends/shell/src/streaming/tileViewportStreamManager.ts:600-611 @ 76c3ea346fff486467be4330b67f331b501234e3 sha256:dd037853feeb324b7768bdfb36111c5a38a55f9c59b297fc3a44283823d5aa5d). Planning reads completeness (frontends/shell/src/residency/candidateArmSession.ts:927 @ 76c3ea346fff486467be4330b67f331b501234e3 sha256:4ccfb434d184d839540202fb1914f1d5c1ac6fbc810ff200aab3701cae9099ca).
     - Tiled planning starts at the first reported view (frontends/shell/src/residency/candidateArmSession.ts:65-76 @ 76c3ea346fff486467be4330b67f331b501234e3 sha256:e7e4aa820d641c06a5f284b14633bb1da287ea409735caa677ecf13a85a2a320). The auto-fit does not report (§0.3). So the first wheel notch after E-REOPEN is the session's first plan.
     - Mine: the measured scale per notch is 2^0.930 ≈ 1.90, more than the grown-to-current width ratio 792/480 ≈ 1.65. From the second notch on, the grown view lies inside the first notch's view, and every cell it covers was already planned.
   - (b) **The anchor term** (`frontends/shell/e2e/layout.mjs` (`:420-421` at 64de82e6)) was meant to place the grown view over features.
     - The box it builds is the square the frame is padded from (frontends/shell/src/canvas/tileGrid.ts:120-132 @ 76c3ea346fff486467be4330b67f331b501234e3 sha256:a3cedeef7dc6b9d6555f213431a70fb71dc12f6b1325470f7681adf0601805b8), not the fixture's footprint.
     - Its y range starts at 1194303.50 (report 3's table). Every parcel centre lies at or north of N_LO + 20 (engine/src/fixture.rs:68 @ 76c3ea346fff486467be4330b67f331b501234e3 sha256:bf993686bed12cb31e20a952797fe215d36a6bd47585e1d48d65e657ee524ae6; engine/src/fixture.rs:1266 @ 76c3ea346fff486467be4330b67f331b501234e3 sha256:3a6c7be94ad91d6f9422f224e759d2b2cf6c329633a1b9dcce3544cdc2b2cbe0).
     - Planning does not need the box either, because the grid has no boundary (frontends/shell/src/canvas/tileGrid.ts:46-51 @ 76c3ea346fff486467be4330b67f331b501234e3 sha256:c110767955cb7b6a314cb86caad2dcafd349ebb3bd3ba62dc5c1da6b31f73ad0).
   - (c) **No common zoom** (mine; medium level, a 480 × 576 map, 156 px growth per side):
     - The cell term needs z < −3.344.
     - The view centre lies 3456.6 m east of the box's xmin, so the inside term needs z ≥ −3.126. The window is empty.
     - Centred in the box, the window would be −4.0 ≤ z < −3.344. That is narrower than one notch (0.930), and the notches from the fit land at −4.169 and −3.239.
   - (d) **Neither term is needed for §4's "It fills" item.** FILL needs three facts: a cell the grown view covers that no plan has asked for; features in that cell; and, for the mutation, every cell of the last plan complete before the toggle.

3. **What it invalidates.**
   - In §4's FILL row: the setup sentence (notches computed by a search) and the precondition sentence.
   - In layout.mjs: the search and `MAX_FILL_NOTCHES` (`frontends/shell/e2e/layout.mjs` (`:43`, `:435-446` at 64de82e6)).
   - Unchanged:
     - FILL's assertion, its 10 s window, its settle, the Inspector restore, and its mutation with its expected failure;
     - §3's FILL outcome;
     - H1 to H3 and I1 to I7. H3 held through RESIZEQ (report 2: 96 new cells predicted).

4. **FILL′ replaces them. Declared before any code of it. layout.mjs only, after E-REOPEN, on the 100k fixture.**
   1. Wait for the grid frame and settle fully, as now. Mark the trace.
   2. Make one real wheel notch at the canvas centre (`ZOOM_NOTCH_DELTA_Y`), then settle fully. Record the zoom.
      - One notch is declared, not searched. It gives the session's first reported view (item 2(a)). A further notch cannot add an unasked cell while the measured scale per notch exceeds the grown-to-current width ratio.
   3. The precondition, computed and recorded. If either part fails: STOP (I3).
      - (i) `.residency-status` matches the complete within-budget pattern that regression.mjs already reads (frontends/shell/e2e/regression.mjs:1993 @ 76c3ea346fff486467be4330b67f331b501234e3 sha256:b8e91aad26daf44cadc893279dedbb432d2fadde555ac4fd86b39ae13d2dbe2e).
        - That sentence is shown only when every cell the last plan covers is complete (frontends/shell/src/residency/candidateArmSession.ts:661-682 @ 76c3ea346fff486467be4330b67f331b501234e3 sha256:5eae94e42437eb854942e72306c744e98d5b1e07faff6520881f3a8864747709; frontends/shell/src/residency/residencyStatus.ts:463 @ 76c3ea346fff486467be4330b67f331b501234e3 sha256:e908528796a6e983496e9068021e087396eb33b9b7fa8c99eff5e02fd1da55d6).
      - (ii) At least one qualifying cell. Compute it as follows:
        - take the cells the grown view covers: `tilesCoveringBbox` at the frame's level, the last view-state line, width `size.width + inspectorGrowthPx`;
        - remove the cells covered by every view-state line after the mark, at the size before the toggle;
        - keep only the cells whose box lies wholly inside the parcel area (item 5).
      - Why every line after the mark: every camera write traces a view-state line (`frontends/shell/src/canvas/WorkingCanvas.tsx` (`:1336`, `:1975` at 64de82e6)), and every plan uses a reported box. The union is therefore a superset of what was asked, whatever the debounce merged.
   4. Ctrl+I, then §4's assertion, unchanged.
   5. Confirm (ii) again, at the canvas size measured after the toggle.
      - If it is below one: I3, STOP. The run's assertion outcome is then void, neither PASS nor FAIL.
      - Record both counts beside the stream and row counts.
   6. The trace settles (H2). Ctrl+I restores the Inspector in a `finally`, as now.

5. **The parcel area.** This is an e2e-local declared value in layout.mjs, not a product constant (§7's first bullet): x 2,600,000 to 2,612,680 and y 1,200,000 to 1,212,600, in LV95 metres.
   - Derived in a comment from the generator:
     - features: 100,000 (kernel/tests/manual_walkthrough_fixtures.rs:43-54 @ 76c3ea346fff486467be4330b67f331b501234e3 sha256:8f95a19454f5fee0d21d879f5cc47f0a666de42175226dcc26e2e0aa3cacd9b0);
     - the default domain (engine/src/fixture.rs:566 @ 76c3ea346fff486467be4330b67f331b501234e3 sha256:e17c732b85519b0ee369555b0542952ca1b25803922f003be891ceeba3318db3);
     - grid origin E_LO and N_LO (engine/src/fixture.rs:67-68 @ 76c3ea346fff486467be4330b67f331b501234e3 sha256:b306115ffa6d299195c19c19bd036afb0456389142c40669592ebfffd8d725f3) and a 40 m cell (engine/src/fixture.rs:93 @ 76c3ea346fff486467be4330b67f331b501234e3 sha256:111e19e1f5635e8cee5159fc900e85b3585b3aed0e349f4d45aa860cc4c05aa4);
     - placement by id over 317 columns (engine/src/fixture.rs:1258-1266 @ 76c3ea346fff486467be4330b67f331b501234e3 sha256:c1e8915bf5e03a4da8c6698933e2cdeac4523405cd892e6010493ba471bc4966), giving 315 full rows (315 × 317 = 99,855).
   - Each ring is drawn around its parcel centre (engine/src/fixture.rs:1273 @ 76c3ea346fff486467be4330b67f331b501234e3 sha256:d1b1a877df9ad16282163b8540c956d205aac2b98320fe68865dae04fc6e9f59). So a grid cell (1584.13 m at medium) lying wholly inside the area holds parcel centres, and the parcels intersect it.
   - The fixture hashes the suite prints tie this value to its file (report 2, Setup).

6. **Predicted (mine; report 2's layout; not adjusted at the run).**
   - After the notch (zoom −3.239), the view covers columns 4 to 7 and rows 5 to 9. The grown view adds columns 3 and 8.
   - The qualifying cells are column 8, rows 8 and 9: two cells. This holds at the DOM growth (312 px) and at the growth RESIZEQ measured (480 → 758 px, report 2).
   - A different count at the run is recorded. Below one is I3.

7. **The mutation is unchanged** (§4's FILL row), and it fails by name by construction.
   - The mutated handler reports `lastQueried`, which is the notch's own box.
   - By 4.3(i), every cell of that box is complete, so the re-plan issues no stream and the assertion fails on 0 streams.
   - It is observed at the fix head, by §4's method.

8. **§7.**
   - The windows are unchanged: RESIZEQ 3 s, FILL 10 s. FILL's step timeout (180,000 ms) is unchanged.
   - `MAX_FILL_NOTCHES` is removed. It bounded a search FILL′ does not have, and it is not an assertion threshold (§8 item 11).
   - New e2e-local value: the parcel area (item 5).
   - G3 stood at 182 lines at 64de82e6 (worker report 1, the budget table: 169 added, 13 removed). The replaced lines (`:43` and `:412-471` at 64de82e6) are 61 of the 169 added.
   - G3's ceiling of 200 holds if FILL′ and the area add at most 79 lines. Measure with §7's command at the fix commit. An overrun is class 8, and §7 is not edited.

9. **RESIZEQ, as run, stands** (report 2). Its 96 predicted cells and 72 lines are different units.
   - Observation: FILL's message gives 156 px growth per side, summed from the DOM (`frontends/shell/e2e/layout.mjs` (`:339-340` at 64de82e6)). RESIZEQ's note shows the map going from 480 to 758 px.
   - If both steps read the same DOM sum, the sum overstates the growth by 34 px.
   - RESIZEQ's prediction is recorded, not asserted, and stays as it is. FILL′ confirms at the measured size (item 4, step 5) for this reason.

10. **BURST, as run** (report 2): 0 lines.
    - Mine: the last asked box was FILL's first-notch view at 480 px. A drag of at most 96 px (24 × 4 px) leaves the covered columns at 4 to 7, so nothing new was asked for. In this arm a `viewport_query` line is traced per tile request (frontends/shell/src/streaming/tileViewportStreamManager.ts:937 @ 76c3ea346fff486467be4330b67f331b501234e3 sha256:fe843af5a363ed214893c57b1f6fb12dbf043f7645b91f4907757b9d2f0c6984).
    - After FILL′, BURST starts inside FILL′'s grown box, so it records 0 lines by construction.
    - BURST stays recorded and not asserted. A 0 reads as no growth beyond the last asked box, never as coalescing.
    - §4's "a burst is coalesced" rests on the debounce tests it names and on V3. Its BURST clause is superseded by this item. BURST is not edited.

11. **Part V.**
    - With V1's two notches (§2.6), the strip V2 uncovers can lie inside the first notch's view, which that notch's plan already filled at the base too.
    - V1 becomes one wheel notch. Nothing else in Part V changes.
    - The walkthrough line count stays 28 of 30, because the Part's lines are new.

12. **e2e/README.md.** The FILL sentence is restated for FILL′, inside the README's 12-line allowance.

13. **The runs at 64de82e6.**
    - If the fix commit changes only layout.mjs, e2e/README.md and MANUAL-WALKTHROUGH.md against 64de82e6, the pairs recorded at 64de82e6 stand for the fix head. None of those files is an exe input (report 2, Diff and exe), and no other e2e suite imports or reads them. The PR body names both commits.
    - Re-run: the layout head run at the fix commit (the base run stands).
    - Observe both e2e mutations at the fix head.
    - Any other path in that diff re-runs every pair.

14. **Reuse index.** The custodian ran the private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c and found no prior art for this. A miss does not block.

**Superseded index:**
- §4's FILL setup and precondition → item 4.
- §4's coalescing line, its BURST clause → item 10.
- §2.6's V1 → item 11.
- §2.7's FILL clause → item 12.
- §7's e2e-local values → item 8.

Nothing above is edited.

### Amendment 3 — gate 1's C1: `lastQueried` is cleared at every camera write that does not report and at a new filter generation (class 1), written after results were seen

*Written by the architect after results were seen. The results are gate 1's finding C1 (`state/consults/gates/2026-10-11-shell-map-refill-after-resize-gate1-architect.md`, finding C1); a gate round's findings are the round's results (round 15, item (g)). This amendment is declared before any code of it. It opens correction round 1 of 2. The branch head is cf24f9b4, which this amendment does not change. Code was read on the branch at cf24f9b4 and at main 771fc1a335787997776422bf0286037bc423f25e. Nothing below is a quotation.*

1. **The result.** C1 found that, after a filter Apply or Clear, a size change compares the camera against the previous generation's box. On that path a shrink can issue a query, so H2, §4's item "a shrink asks nothing" and item 39's second sentence do not hold there. Worker report 1 had flagged it (its "Differences from the form" section, the auto-fit after a filter).

2. **The cause, from the code.**
   - `lastQueriedRef` is written only by `reportViewport` (`frontends/shell/src/canvas/WorkingCanvas.tsx` (`:1018-1024` at cf24f9b4)). The canvas remounts only when the dataset changes.
   - The one camera write that does not report is the auto-fit, `fitToExtent(…, false)` (`frontends/shell/src/canvas/WorkingCanvas.tsx` (`:1337`, `:1472-1481`, `:1674-1676` at cf24f9b4)).
     - It runs on the first batch with geometry of an open or of a filter generation.
     - A pan does not disarm it: `hasAutoFitRef` is set only at the two auto-fit sites.
   - A filter Apply or Clear starts a new generation, which the code documents as an open:
     - frontends/shell/src/App.tsx:279-288 @ 771fc1a335787997776422bf0286037bc423f25e sha256:fba0d1622c18d9b90293811dbed661c7022560d165aec43f21a25590a124b0f6;
     - frontends/shell/src/residency/candidateArmSession.ts:222-233 @ 771fc1a335787997776422bf0286037bc423f25e sha256:1b1f86f15fe9203a7ae77343b937d0507aa1868011c1b5412f38bf354a3345c8.
   - Its callers of `resetFitForNewGeneration`:
     - frontends/shell/src/App.tsx:336-338 @ 771fc1a335787997776422bf0286037bc423f25e sha256:43c422729ca6446f94c05ea36f7a63b7197e9a05b65baefca72dddd056926bb0;
     - frontends/shell/src/residency/candidateArmSession.ts:1657-1658 @ 771fc1a335787997776422bf0286037bc423f25e sha256:fc2ff8e428388c17b7c0efcbf4f7179258ef51bbce1936bee272e27635f83f58.
   - The auto-fit does not report so that it does not race the stream still delivering: frontends/shell/src/residency/candidateArmSession.ts:65-76 @ 771fc1a335787997776422bf0286037bc423f25e sha256:e7e4aa820d641c06a5f284b14633bb1da287ea409735caa677ecf13a85a2a320.
   - Two paths therefore leave `lastQueried` naming a box the camera no longer shows:
     - (a) a filter Apply or Clear after any reported view (C1's path);
     - (b) a pan made before the first batch arrives, on an open or after an Apply: the pan reports, then the auto-fit moves the camera without reporting. Gate 1 missed this path; its root cause is C1's.
   - On either path, a size change is decided against the stale box, so a shrink can issue a query.

3. **The decision.** The invariant is that `lastQueried` is non-null only while the camera's last write was reported.
   - `resetFitForNewGeneration` sets `lastQueriedRef.current = null`, beside its two existing lines.
   - `fitToExtent` sets `lastQueriedRef.current = null` when `notifyViewport` is false. It does so in the `else` of the existing `if (notifyViewport)` block.
   - The doc comments of `lastQueriedRef` and of the handle's `resetFitForNewGeneration` say so.
   - Nothing else changes, in particular:
     - the auto-fit's `notifyViewport: false` and its firing condition, and Zoom to layer's `true`;
     - `viewportAfterResize` and `reportViewport`;
     - App.tsx;
     - RF1 to RF9.
   - §2.1's `lastQueried` now reads: the box last passed to `onViewportChanged` since the open, the last new filter generation and the last auto-fit, or null.
   - §2.4's OPEN-2 bullet and §8 item 4 now read: no query on a size change while no view has been reported since the open, since the last filter Apply or Clear, or since the last auto-fit.
   - **Why this makes the guarantee hold.**
     - Every camera write either reports (`lastQueried` becomes its box at the current size) or clears `lastQueried`.
     - A `query` sets `lastQueried` to the camera's box at the new size.
     - A `within` leaves `lastQueried` containing the box shown.
     - So while `lastQueried` is non-null it contains the box the map shows, and a size that grows in neither dimension gives `within` (RF2, RF6).

4. **The test: RF10.** It is a unit test reading source text, as RF7 does, in `src/canvas/WorkingCanvas.test.ts`, inside RF7's `describe`. It counts under G2, against that file's ceiling of 40.
   - It asserts three things:
     - (i) the body of `resetFitForNewGeneration() {`, up to its closing `},`, contains `lastQueriedRef.current = null;`;
     - (ii) the body of `function fitToExtent(` contains an `else` branch of `if (notifyViewport)` that holds `lastQueriedRef.current = null;`;
     - (iii) `cameraRef.current = ` occurs exactly 3 times, at the three §2.2 sites. A new camera write site, which might not report, then fails the test.
   - Its mutations and expected failures:
     - (a) delete the line in `resetFitForNewGeneration`: (i) fails;
     - (b) delete the `else` branch in `fitToExtent`: (ii) fails;
     - (c) duplicate the fit's `cameraRef.current = …` line: (iii) fails, with a count of 4.
   - Each mutation is observed by §4's method and recorded with the commit it was observed at. It is not a `verify-mutation` run.
   - **Why source text.** WorkingCanvas cannot mount in jsdom (no WebGL), as with RF7. The decision's null branch is already RF4's.
   - **No e2e step is added.** G3 stands at 191 of 200, and §5 keeps every other suite unchanged. So no e2e step shows path (a) or (b). The claim rests on RF10, RF7, RF4, RF2 and RF6 and on item 3's argument.

5. **§7.** No ceiling changes. The expected figures at the new head:
   - `WorkingCanvas.tsx`: from 47 to at most 60 (ceiling 90). G1: at most 97 (ceiling 150).
   - `WorkingCanvas.test.ts`: from 19 to at most 40 (ceiling 40). RF10, with its recorded-mutation comment, adds at most 21 lines. G2: at most 155 (ceiling 250).
   - Total: at most 443 (ceiling 600).
   - Measure with §7's command at the final head. An overrun is class 8, and §7 is not edited.

6. **The re-runs.** I agree with the custodian's scope, for this reason: a pair compares the base against the head, and every input of the base arm is unchanged.
   - The base arm of every pair stands.
     - The base, 4fd3259a, is unchanged.
     - The exe is unchanged (report 4, Setup held fixed). The changed files are served by each arm's vite and are not exe inputs (report 2, Diff and exe).
     - The fixtures are checked by hash in every run.
     - Console's base arm is the custodian's solo run.
   - The head arm of all 14 suites re-runs at the new head and is compared step by step with the standing base logs. Layout is included (RESIZEQ, FILL′, BURST).
   - Both e2e step mutations are observed again at the new head, because the file they edit changes.
   - `npm run verify` and gate 1's E1 suites run at the new head.
   - If the new head's diff against 4fd3259a touches anything under `src-tauri/` or any Rust input, the exe is rebuilt and both arms re-run.
   - If any head step differs from its base step, that is I2. It is recorded as class 2, and no threshold is edited.

7. **The PR body's claims after the fix.** These are the claims each sentence may make. The wording is the custodian's.
   - **Opening sentence.** A growth asks for the area beyond the last asked box once a view has been reported: a pan, zoom or Zoom to layer since the open, the last filter Apply or Clear, and the last automatic fit. Before that, a size change asks nothing.
   - **"A shrink asks nothing."** It may stand without a condition. Its proof is RF2, RF6 and RF10, with item 3's argument.
   - **The Export panel's Current view.** After an Apply, a Clear or an automatic fit, it carries the last reported view until the next pan, zoom or Zoom to layer: the auto-fit writes no box, and a shrink then gives `none`. This was true before this piece. It is recorded, not fixed.

8. **Item 39's wording is unchanged** (Amendment 1, item 4).
   - Sentence 2 holds without a condition (item 3).
   - Sentence 3 holds: before the first reported view after an open, `lastQueried` is null, and the auto-fit clears it again.
   - Sentence 1 holds after an Apply or Clear on the reading that the last thing asked for was an unrestricted look (frontends/shell/src/App.tsx:279-288 @ 771fc1a335787997776422bf0286037bc423f25e sha256:fba0d1622c18d9b90293811dbed661c7022560d165aec43f21a25590a124b0f6), with nothing lying outside it.
   - Sentence 1 does not hold on path (b). After a pan made before the first batch, the auto-fit moves the camera, and a growth then asks nothing until the next pan, zoom or Zoom to layer.
   - It is the human's call whether item 39 gets words for path (b), or for Apply and Clear, because the wording is theirs.

9. **Declared unchanged, and invalidators.**
   - Every item §5 declares unchanged still is. The auto-fit's firing condition and App.tsx are added to the list.
   - The §8 items stand as amended in item 3. No new timer, constant, callback or export.
   - I8 (new): an RF10 mutation that does not fail its assertion. STOP and report.

**Superseded index:**
- §2.1's `lastQueried` → item 3.
- §2.2: `reportViewport` as the only writer of `lastQueried` → item 3.
- §2.4's OPEN-2 bullet, and §8 item 4 → item 3.
- §4: RF10 added, and RF10 added to the acceptance item "a shrink asks nothing" → item 4.
- §6's assertions, now RF1 to RF10 → item 4.
- Amendment 2 item 13, its last bullet, for this change → item 6.

Nothing above is edited.

### Amendment 4 — the human's ruling on item 39's third sentence (class 5)

*Written by the custodian on the human's ruling, after both gate 2 reports passed and before the change. References only.*

1. **The ruling** is the human's item 2 (state/directives/2026-10-11-rulings-205-c1-item-39-pieces-d-e-merge-206.md:10-12 @ e9beffe99d2c055845f3d4c230e0fd18c5ea5acc sha256:53e6a3c96ec3fa42671886aca41e9e83f2c25be7b03df2fdcc479e1de6c5cc43).
   - Item 39's third sentence, from "Before the first pan" to "asks for nothing new.", is replaced by the sentence at the directive's line 11, byte for byte by script, with that line's three leading spaces removed.
   - The other sentences stay as they are.
2. **The item's source comment** keeps its words. One clause is appended after "(this form's Amendment 1, item 4)": "; its third sentence is the human's own wording of 2026-10-11 (this form's Amendment 4)". This keeps the comment true.
3. **The gate.** Before the merge, a scoped gate checks the new sentence against Amendment 3 item 3, in every case Amendment 3 names. If the sentence is wrong in any case, the human is told, and the sentence is not reworded.
4. **§7:** KNOWN-LIMITATIONS.md stays within its 8 lines outside the count. The item's line and its comment line change in place.
5. **Generation:** the node goes to 5.
6. **Superseded index:** Amendment 1 item 4, for item 39's third sentence only → item 1.

Nothing above is edited.

### Amendment 5 — the human's ruling on gate 3's C1 (class 5)

*Written by the custodian after gate 3 (`state/consults/gates/2026-10-11-shell-map-refill-after-resize-gate3-architect.md`, C1 and D1) and the human's ruling, before the change. References only.*

1. **The ruling** is the human's item 3 (`state/directives/2026-10-11-rulings-205-clause-crs-form-node-207-sentence.md`, lines 12 to 14).
   - Item 39's third sentence, from "One exception:" to "Zoom to layer.", is replaced by the two sentences of the directive's line 13, byte for byte by script, with that line's three leading spaces removed.
   - The other sentences stay as they are.
2. **The item's source comment** says the sentences describe the shipped default arm.
   - Amendment 4's clause is replaced by: "; its third and fourth sentences are the human's own wording of 2026-10-11 (this form's Amendments 4 and 5) and describe the shipped default arm, the candidate residency arm".
   - Nothing else in the comment changes.
3. **D1's two doc comments** in `frontends/shell/src/canvas/WorkingCanvas.tsx` (gate 3, D1) are fixed with the sentence. On the candidate arm, `resetFitForNewGeneration` runs at the start of every reissue, whatever its outcome. On the baseline arm, it runs on an issued outcome. The comments claim no more than that. Comment lines only.
4. **The gate:** a scoped architect gate checks the two sentences, the comment and the two doc comments. If a clause is wrong, the human is told, and it is not reworded.
5. **§7:** KNOWN-LIMITATIONS.md stays within its 8 lines. `WorkingCanvas.tsx` changes comment lines only, within G1's ceiling.
6. **Generation:** the node goes to 6.
7. **Superseded index:** Amendment 4 item 1 → item 1; Amendment 4 item 2's clause → item 2.

Nothing above is edited.

**Correction of record, appended 2026-10-11 (the defect of PR #205's gate 3 D-1, found here by the custodian).** Amendment 5 item 1's directive reference was written in the commit that created the directive; it is state/directives/2026-10-11-rulings-205-clause-crs-form-node-207-sentence.md:12-14 @ df6d39a065a3e1e7b8049801cdd00a7d98de0201 sha256:d7c23a993e1cd07ab9db908c0cd246d4d13808faa0f17a82bd5895db7e6c2d96.

### Amendment 6 — the human's ruling on gate 4's C1: (C), the gap accepted (class 5)

*Written by the custodian after gate 4 (`state/consults/gates/2026-10-11-shell-map-refill-after-resize-gate4-architect.md`, C1, D1 and D2) and the human's ruling, before the change. References only.*

1. **The ruling** is the human's item 2 (state/directives/2026-10-11-merge-205-ruling-207-c-crs-form-open-items.md:8-10 @ c48601ab18d6d4bc3763c53e0c820e7f37a9b851 sha256:9bd2a7e70584abd84d2a96c61ff08861e7a942c8e6af5b43ad852c23422f5c07).
2. **The sentences stay as they are.** The human accepts that they do not cover a pan made inside the mint round trip around an Apply or Clear: gate 4's C1, by reference.
3. **The item's source comment** records it in the human's words: the directive's line 9, byte for byte by script, with that line's three leading spaces removed (state/directives/2026-10-11-merge-205-ruling-207-c-crs-form-open-items.md:9 @ c48601ab18d6d4bc3763c53e0c820e7f37a9b851 sha256:76cf51df5e91f0cadb72cc294201b1b86a8cd4f1e03c9d1abefd2d928bfb391b). It is inserted as its own sentence after the clause that Amendment 5 item 2 set, before " Authority:". Nothing else in the comment changes.
4. **D1 and D2** (gate 4) are fixed in the same commit. The doc comments in `frontends/shell/src/canvas/WorkingCanvas.tsx` claim no more than the code does: on the candidate arm, `resetFitForNewGeneration` runs at the start of a reissue begun while the session is live, and at the open's first look; an Apply after the session has ended runs none. On the baseline arm, it runs after an issued outcome. Comment lines only.
5. **The gate:** no further gate round on the sentences. The reviewer checks that the commit changes only the source comment and doc comments, and recomputes the `58967ff4..66cc80de` comment-only diff that gate 4's Evidence note asks for. Then the human is told it is ready.
6. **§7:** KNOWN-LIMITATIONS.md's comment line changes in place, within its 8 lines. `WorkingCanvas.tsx` changes comment lines only, within G1's ceiling.
7. **Generation:** the node goes to 7.
8. **Superseded index:** Amendment 5 item 3's statement of the candidate arm → item 4.

Nothing above is edited.
