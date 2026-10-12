*Custodian's filing note (2026-10-09): the architect's draft of `shell-map-refill-after-resize`'s preregistration, on the custodian's brief at main d88ceddaeb88707941e0868a900eb2f7999da06b, drafted alone. The brief first gave that commit's full id wrongly (typed by the custodian, not taken from git); a message corrected it during the run, and the draft's opening paragraph says so. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is b9b50ef1214d01589b8504e11567e7fef32263b260e6b5ac91d45c3b530231ba. Write audit PASS: zero write calls (Read 47, Grep 54, Glob 4, SubagentHandback 1). Run window from the transcript: 2026-10-09T05:35:11Z to 05:51:33Z. The form as committed, `frontends/shell/SHELL-MAP-REFILL-AFTER-RESIZE-PREREGISTRATION.md`, is part 2's block with its 35 pins computed at d88cedda, each pinned span's first and last line checked by the custodian; nothing else in it is changed (sha256 201348ccb997d6f9c768693ca95b5e5c3f516e083704622ef693ab32ab97c034).*

---

Reviewed: main @ d88ceddaeb88707941e0868a900eb2f7999da06b

I read `.git/refs/heads/main` and the main checkout as it stands. The full id in the brief (d88cedda6f2a…) does not resolve: no such loose object exists. Your correction gave the full id, and every pin below uses it.

## 1. Which form, and why

**The full form, with full gating from dispatch.** Three reasons:
- **§21c:** the piece adds user-visible behaviour (the map refills), and the estimate is about 600 lines over 7 files, tests included.
- **§21a:** it adds a new trigger to a documented contract: the debounce's promise that continuous motion issues no query (`streaming/debounce.ts`, lines 21-25), and the supersede and cancel path that ADR-018 governs.
- **§25(e):** an Out-of-scope line could not truthfully say the piece touches none of the four categories.

**Scope.** No `engine/`, `kernel/`, `protocol/`, `skp/`, `streaming/`, `residency/` or `src-tauri` path. No wire change and no new dependency.

**Paths.** The piece's paths do not overlap `e2e-hover-establishing-read-stale`, which edits `regression.mjs` only. One possible overlap: the proposed node `shell-stale-frame-comments` (direction item 8) covers the deck 9.3.7 comments in `WorkingCanvas.tsx`. If it is placed, it must not run beside this piece.

**What is the human's:**
- OPEN-1 and OPEN-2 below. Neither is a red line.
- P6 sight of the retired wording for KNOWN-LIMITATIONS 39.
- The felt verdict in the new walkthrough Part V.

**What I found while reading, which shaped the design:**
- **The bars resize the map.** The attention strip and the status bar are auto-height grid rows. A banner, or a status text that wraps, changes the map's height. If every size change asked for data, the scan-liveness text appearing and disappearing could make queries repeat with no input.
- **So the map asks only when it grows** past the area it last asked for.
- **That alone would break one flow.** Close the Inspector, reopen it, then Export with Current view: the export would cover more than the map shows. The design therefore adds a second, query-free report for a shrink (OPEN-1).

## 2. The draft

````markdown
# The map refills after a resize — a layout change that uncovers map area asks for it, with no pan or zoom
# (PLAN node shell-map-refill-after-resize)

File: frontends/shell/SHELL-MAP-REFILL-AFTER-RESIZE-PREREGISTRATION.md
Authority: PLAN node `shell-map-refill-after-resize`; the human's direction of 2026-10-09, item 2b (state/directives/2026-10-09-slot-orders-pilot-and-reuse-standing-step.md:15 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:HASH-TBD); the ruling it rests on, question round 67, item 3 (OPEN-7), with the human's clarification (state/directives/2026-10-07-round-66-and-67-rulings.md:24-29 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:HASH-TBD). Its RULED blocks are in DECISIONS-PENDING.md, referenced and not restated.
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
- WorkingCanvas reports the view through one prop. Its declared interface: frontends/shell/src/canvas/WorkingCanvas.tsx:529-531 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:HASH-TBD. The prop is mirrored into a ref: frontends/shell/src/canvas/WorkingCanvas.tsx:1003-1004 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:HASH-TBD.
- There are three report sites, all of them camera writes:
  - the interactive handler: frontends/shell/src/canvas/WorkingCanvas.tsx:1977-1987 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:HASH-TBD;
  - the fit: frontends/shell/src/canvas/WorkingCanvas.tsx:1323-1328 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:HASH-TBD;
  - the DEV-only camera seam: frontends/shell/src/canvas/WorkingCanvas.tsx:2184-2186 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:HASH-TBD.
- Nothing reports on a size change. That is H1 of milestone 1, which held (its Amendment 4, item 7).
- The auto-fit on open does not report:
  - baseline: frontends/shell/src/canvas/WorkingCanvas.tsx:1451-1460 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:HASH-TBD;
  - candidate: frontends/shell/src/canvas/WorkingCanvas.tsx:1653-1655 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:HASH-TBD.
- Zoom to layer does report: frontends/shell/src/canvas/WorkingCanvas.tsx:1494-1501 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:HASH-TBD.
- The bbox is one pure function of target, origin, zoom and CSS size: frontends/shell/src/canvas/viewportBbox.ts:37-49 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:HASH-TBD.
- The file's pixel basis is the canvas's CSS client size: frontends/shell/src/canvas/WorkingCanvas.tsx:1143-1151 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:HASH-TBD.
- WorkingCanvas never reads deck's internal view state.

0.4 Consuming-side interfaces, read before any seam is drafted.
- App's handler writes the current-view box, then calls the debounced entry point: frontends/shell/src/App.tsx:1829-1843 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:HASH-TBD.
- The baseline debounce: frontends/shell/src/App.tsx:1608-1619 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:HASH-TBD. The candidate pass-through: frontends/shell/src/App.tsx:145-153 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:HASH-TBD. The candidate's own debounce: frontends/shell/src/residency/candidateArmSession.ts:1445 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:HASH-TBD and frontends/shell/src/residency/candidateArmSession.ts:1616-1622 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:HASH-TBD.
- The trailing debounce: frontends/shell/src/streaming/debounce.ts:35-54 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:HASH-TBD. Its window: frontends/shell/src/streaming/viewportStreamManager.ts:25 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:HASH-TBD.
- The candidate plan returns early when stopped, ended or frameless; it prunes tiles that left the view and issues only cells that are neither tracked nor resident: frontends/shell/src/streaming/tileViewportStreamManager.ts:494-513 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:HASH-TBD.
- The Export panel's Current view reads App's box at click time:
  - frontends/shell/src/App.tsx:1976 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:HASH-TBD;
  - frontends/shell/src/publish/PublishPanel.tsx:345 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:HASH-TBD;
  - frontends/shell/src/publish/PublishPanel.tsx:362 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:HASH-TBD.
- deck's resize callback. The installed version is pinned by the tracked lockfile: frontends/shell/package-lock.json:452-453 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:HASH-TBD. The untracked sources show:
  - `DeckProps.onResize` is documented as called when the canvas resizes (`node_modules/@deck.gl/core/dist/lib/deck.d.ts`, lines 147-151);
  - deck calls it after setting the new size on its view manager (`node_modules/@deck.gl/core/dist/lib/deck.js`, lines 740-766);
  - deck owns luma's resize observer (same file, lines 698-707).
- The map's rows: the attention strip and the status bar are auto-height rows around the map (frontends/shell/src/styles.css:34 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:HASH-TBD). A banner or a wrapping status text therefore changes the map's height.

0.5 Hypotheses. Each is labelled and carries its discriminator.
- **H1.** On every change of the canvas's CSS size, deck 9.3.9 calls `onResize` after its viewports carry the new size. That covers a region toggled, a splitter dragged and the window resized. The view stays centred on the same target, so the box computed from the camera the canvas last wrote, at the new size, is the box deck draws.
  - Discriminator: e2e RESIZEQ.
  - If it fails: invalidator I1.
- **H2.** Asking only on growth beyond the last asked box ends every feedback sequence. A query's own status text can resize the map through the bars. A shrink asks nothing, and a growth back to a size no larger than the last asked asks nothing, so no query can recur without input.
  - Discriminator: RESIZEQ and FILL each settle after their toggles.
  - If it fails: invalidator I6.
- **H3.** At filter-zoned's fit view on the default medium grid, closing the Inspector covers at least one grid cell that no plan has requested. The facts it rests on:
  - the grid is twice the anchor span (frontends/shell/src/canvas/tileGrid.ts:104-107 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:HASH-TBD);
  - it is 16 cells per axis at medium (frontends/shell/src/canvas/tileGridConstants.ts:26-35 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:HASH-TBD);
  - the Inspector is 340 px plus a 6 px splitter (frontends/shell/src/layout/layoutConstants.ts:29 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:HASH-TBD and frontends/shell/src/layout/layoutConstants.ts:40 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:HASH-TBD).
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
- **Layout is not workspace** (plan §2 rule 10). A size change marks nothing and records no history step. A query it causes is recorded in the console as a class-A `viewport_query`, as a pan's is (frontends/shell/src/console/surfaceRegistry.ts:82 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:HASH-TBD; frontends/shell/src/skp/client.ts:53 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:HASH-TBD).

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
| RF7 | unit (source text, as frontends/shell/src/canvas/noCoordinateLeak.test.ts:57 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:HASH-TBD reads files), src/canvas/WorkingCanvas.test.ts | WorkingCanvas.tsx calls `onViewportChangedRef.current(` exactly once, and the Deck constructor passes `onResize` | restore a direct call at the fit site; the count reaches 2 |
| RF8 | render, src/App.layout.test.tsx (the real App, WorkingCanvas stubbed as the file already does, the stub keeping its props) | After the stub's `onViewportChanged(b1)` and then `onViewportWithinLastQuery(b2)`, the Export panel's Current-view prepare carries b2. Observed at the mocked `publish/client` `publishPrepare` and driven through the rendered Export control | empty App's within handler; the prepare carries b1 |
| RF9 | render, same | `onViewportWithinLastQuery` causes no `requestViewport` on the mocked manager across two debounce windows; `onViewportChanged` causes exactly one | App's within handler also calls the debounced entry point |
| RESIZEQ | e2e, e2e/layout.mjs, now asserted | On filter-zoned: a real `.zoom-to-layer` click; settle (trace quiet 3 s, in-flight and queued counts 0); then the precondition, computed from `residencyGridFrame`, the last view-state line (parsed as frontends/shell/e2e/regression.mjs:1989-1996 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:HASH-TBD does) and the DOM sizes: predicted new cells ≥ 1, else STOP (I3). Ctrl+I gives ≥ 1 new `viewport_query` line within 3 s; the trace settles (H2); Ctrl+I again gives 0 | remove `onResize` from the Deck props; the close count is 0 |
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
- The untiled first look and its 10,000-row limit (frontends/shell/src/canvas/tileGridConstants.ts:185 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:HASH-TBD).
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

The worker's and tester's briefs carry, as written, the paragraph at state/directives/2026-10-06-machine-script-adopted.md:12-22 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:HASH-TBD. This form names no other rule for builds.
````

## 3. Open items

**OPEN-1: the Export panel's Current view after the map shrinks.**
- **The problem.** Today Current view uses the last box the canvas reported. With growth-only queries, closing and reopening the Inspector before an export would export the wider box, not what the map shows.
- **(A), recommended:** the canvas reports a shrink through a new prop, `onViewportWithinLastQuery`. It updates App's box and issues no query. Cost: one prop, one JSX line, RF8 and RF9.
- **(B):** no second channel. Add a KNOWN-LIMITATIONS sentence saying that after the map shrinks, Current view covers the last asked area, which can be larger than the map shows.
- **(C):** query on every size change. Not recommended: the status bar and the attention strip resize the map, so queries could repeat with no input (H2).
- Not a red line. Dispatch waits on it: §2.3, RF8 and RF9 depend on it.

**OPEN-2: a growth before the open's first pan, zoom or Zoom to layer.**
- **(A), recommended:** ask for nothing. The first look stands, which is the auto-fit's own reason for not notifying. Nothing beyond the first look's extent is loaded in that state, so the strip is no emptier than the map's visible margin.
- **(B):** also ask after the open's auto-fit. That needs a check that the candidate arm's untiled first look is neither cut short nor superseded by early tile planning, so it would be its own later piece.
- Not a red line. Dispatch waits on it only through item 39's third sentence and block-on-sight item 4.

**Before the custodian commits the form:**
- **The node's summary** names only the round 66 and 67 rulings file. The form also cites the 2026-10-09 direction's line 15. Both are directives, pinned by path, line and hash, not ledger lines.
- **Overlap.** If `shell-stale-frame-comments` is placed, it overlaps this piece on `WorkingCanvas.tsx` (the deck 9.3.7 comments). The two must not run side by side.

## 4. Files read

- C:\dev\spatial-ide\.git\HEAD, C:\dev\spatial-ide\.git\refs\heads\main
- C:\dev\spatial-ide\PLAN.yaml (lines 4540-4659)
- C:\dev\spatial-ide\state\directives\2026-10-09-slot-orders-pilot-and-reuse-standing-step.md
- C:\dev\spatial-ide\state\directives\2026-10-07-round-66-and-67-rulings.md
- C:\dev\spatial-ide\frontends\shell\SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md
- C:\dev\spatial-ide\state\consults\2026-10-08-shell-migration-milestone-1-worker-report-2.md (section 7)
- C:\dev\spatial-ide\KNOWN-LIMITATIONS.md (items 17-19, 32-39)
- C:\dev\spatial-ide\state\directives\SHELL-MIGRATION-PLAN-2026-10-07.md (§2-§5)
- C:\dev\spatial-ide\state\directives\2026-10-05-product-first-direction.md
- C:\dev\spatial-ide\state\directives\PORTABILITY-2026-09-30.md
- C:\dev\spatial-ide\state\directives\2026-10-06-machine-script-adopted.md
- C:\dev\spatial-ide\AUTONOMY.md (§21-§26)
- C:\dev\spatial-ide\docs\PREREGISTRATION-TEMPLATE.md
- C:\dev\spatial-ide\docs\01_Principles.md (headings); C:\dev\spatial-ide\docs\adr\ADR-010-render-frames-origins-boundaries.md (rule headings)
- C:\dev\spatial-ide\frontends\shell\src\canvas\WorkingCanvas.tsx; C:\dev\spatial-ide\frontends\shell\src\canvas\viewportBbox.ts; C:\dev\spatial-ide\frontends\shell\src\canvas\extent.ts; C:\dev\spatial-ide\frontends\shell\src\canvas\tileGrid.ts; C:\dev\spatial-ide\frontends\shell\src\canvas\tileGridConstants.ts; C:\dev\spatial-ide\frontends\shell\src\canvas\WorkingCanvas.test.ts (describe list); C:\dev\spatial-ide\frontends\shell\src\canvas\noCoordinateLeak.test.ts (line 57)
- C:\dev\spatial-ide\frontends\shell\src\App.tsx; C:\dev\spatial-ide\frontends\shell\src\App.layout.test.tsx; C:\dev\spatial-ide\frontends\shell\src\App.lateResult.test.tsx (mocks); C:\dev\spatial-ide\frontends\shell\src\App.test.ts (describe names)
- C:\dev\spatial-ide\frontends\shell\src\streaming\debounce.ts; C:\dev\spatial-ide\frontends\shell\src\streaming\debounce.test.ts (names); C:\dev\spatial-ide\frontends\shell\src\streaming\tileViewportStreamManager.ts; C:\dev\spatial-ide\frontends\shell\src\streaming\viewportStreamManager.ts (line 25)
- C:\dev\spatial-ide\frontends\shell\src\residency\candidateArmSession.ts; C:\dev\spatial-ide\frontends\shell\src\residency\residencyArm.ts
- C:\dev\spatial-ide\frontends\shell\src\layout\layoutConstants.ts; C:\dev\spatial-ide\frontends\shell\src\styles.css (grid lines)
- C:\dev\spatial-ide\frontends\shell\src\publish\PublishPanel.tsx; C:\dev\spatial-ide\frontends\shell\src\console\surfaceRegistry.ts; C:\dev\spatial-ide\frontends\shell\src\skp\client.ts; C:\dev\spatial-ide\frontends\shell\src\diagnostics\renderTrace.ts
- C:\dev\spatial-ide\frontends\shell\e2e\layout.mjs; C:\dev\spatial-ide\frontends\shell\e2e\lib.mjs; C:\dev\spatial-ide\frontends\shell\e2e\regression.mjs (lines 1986-1999); C:\dev\spatial-ide\frontends\shell\e2e\README.md (layout section); the e2e dismiss and view-state grep across C:\dev\spatial-ide\frontends\shell\e2e
- C:\dev\spatial-ide\frontends\shell\MANUAL-WALKTHROUGH.md (Part U and the Part headings)
- C:\dev\spatial-ide\frontends\shell\E2E-HOVER-ESTABLISHING-READ-PREREGISTRATION.md (scope lines); C:\dev\spatial-ide\frontends\shell\SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md (resize mentions)
- C:\dev\spatial-ide\frontends\shell\package.json; C:\dev\spatial-ide\frontends\shell\package-lock.json (lines 452-454)
- Untracked: C:\dev\spatial-ide\frontends\shell\node_modules\@deck.gl\core\dist\lib\deck.js (lines 56-64, 660-784); C:\dev\spatial-ide\frontends\shell\node_modules\@deck.gl\core\dist\lib\deck.d.ts (lines 146-152); C:\dev\spatial-ide\frontends\shell\node_modules\@deck.gl\core\package.json (version)
