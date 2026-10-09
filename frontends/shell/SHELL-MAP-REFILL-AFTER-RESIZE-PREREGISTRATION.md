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
