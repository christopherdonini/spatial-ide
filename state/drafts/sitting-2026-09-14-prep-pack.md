> **Status: draft — the 2026-09-14 sitting prep pack; superseded by the 2026-09-14/15 felt-verdicts block in `DECISIONS-PENDING.md`.**
> Record, not policy — moved from the untracked `RELEASE-DRAFTS-0.1.0/` directory on the human's round-14 ruling (2026-09-17); nothing here binds, and its cites are historical (advisory in `verify-cites`, never gated).

# Sitting prep pack — 2026-09-14, ~22:00: the queued operator rows

*Updated by the custodian 2026-09-14 after PR #64/#66 merged (the marker + 9 px + ADR-029 text are on `main`); Row 6 (a)/(c) and the 88/89 halves are LIVE tonight. Originally prepared by a worker on 2026-09-14, read-only: every fact below was read from a file in the tree on this machine; nothing was built, run or launched (a harness run was in progress). Shape follows `part-m-prep-pack.md` — per row: the row's own text verbatim, the steps, what to look at, what pass and fail look like, where the result is written. The felt verdicts are the human's; this pack decides nothing. No duration, rate or budget figure appears anywhere (ADR-018).*

## 1. Launch — the dev app from `main` at its head

`main` head: **74465c0** (origin/main, 2026-09-14 — since this pack was drafted, PR #64 MERGED: the confirming-marker state and the 9 px threshold are now on `main`, so Row 6 (a) and Row 6 (c) and the 88/89 halves in Row 5 are LIVE tonight, not deferred). From `C:\dev\spatial-ide\frontends\shell`: `npx tauri dev --config e2e/out/tauri.e2e.conf.json`. That exact form is the one `attachOrLaunch` names for an operator-launched app (`frontends/shell/e2e/lib.mjs:142-148`, verbatim):

**Disk, 2026-09-14 (the custodian):** launch with the warm build — `set CARGO_TARGET_DIR=C:/dev/spatial-ide/target` (cmd) or `$env:CARGO_TARGET_DIR='C:/dev/spatial-ide/target'` (PowerShell) before `npx tauri dev …`. The shell's debug build already lives there (built today for FIND′, and `main`'s Rust is unchanged since — PR #64 was frontend-only), so launching against it skips a rebuild (48 GB free now; reusing the warm build is simply faster). The bundle viewer's `dist` was rebuilt today (2026-09-14, after PR #53), so the entry-86 row runs against the anchored-zoom code.
~~~
/**
 * Attaches to an app already listening on `CDP_PORT` (a previous run of this script, or an
 * operator-launched instance started the same way -- e.g. `tauri dev --config
 * e2e/out/tauri.e2e.conf.json`), or spawns one. Spawning is the only path that ever generates the
 * config overlay (`writeConfigOverlay`) -- the security posture this repo commits to (docs/09,
 * e2e/README.md) is that nothing else ever turns the debug port on.
 */
~~~
**The overlay, and whether it is stale.** `writeConfigOverlay` (`e2e/lib.mjs:96`) is called only on the spawn path (`:167`) and regenerates the file fresh every time; the file is gitignored, so it is whatever the last launch left. On disk now: `frontends/shell/e2e/out/tauri.e2e.conf.json`, 305 bytes, written 2026-09-07 23:38. Its window object carries `title "Spatial IDE"`, `width 1280`, `height 800` plus `additionalBrowserArgs … --remote-debugging-port=9223`, and `src-tauri/tauri.conf.json`'s `app.windows[0]` today carries exactly those same three fields — so its content is current even though its date is older. **If it is missing, or you would rather not trust a hand-checked file:** `npm run e2e:debug` (`package.json:25` → `e2e/debug-session.mjs`) goes through `attachOrLaunch`, so it regenerates the overlay, launches the app, admits `100k-happy-path.parquet`, and **leaves the app running** — its own closing line: *"This run launched the app; it stays RUNNING on CDP port 9223 for further interactive use."* Use that app for the rows; `Ctrl+R` inside it is fine.

**What gets captured.** The session log is written by the app either way: `%LOCALAPPDATA%\dev.spatialide.shell\logs\session-*.log` (Part M's M12 path). The app's own stdout/stderr lands in `frontends/shell/e2e/out/app.log` **only when the harness spawned it** (`lib.mjs`'s raw-fd `stdio`); a hand-typed `npx tauri dev` prints to its own console window instead. For the log kept the way the harness keeps it, launch via `npm run e2e:debug`.

**Machine rule:** one app at a time and a quiet machine — no cargo/npm build, no spike, no second app while a row is being judged (`AI_DEVELOPMENT.md:231-236`, §J at `:594`).

**Residency arm** (every row touching the canvas at over-budget zooms): Part K's K2 incantations, and the standing rule at `MANUAL-WALKTHROUGH.md:798` — **after EVERY `Ctrl+R`** run `await window.__SPATIAL_E2E__.getResidencyArm()` and require `"candidate"`, then `await window.__SPATIAL_E2E__.setResidencyTileSizeLevel("fine")`. A step whose arm was not verified this way is recorded as arm-unverified, not as a verdict.

## 2. Fixtures

| Fixture | Path | Rows | Present now | Regenerable |
|---|---|---|---|---|
| `polygons-100k.parquet` | `target/fixtures/slice-budgets/` | K7, L7, L8, the 5/9/15 px row, the pan-feel row | yes (151,812,642 B) | yes — `MANUAL-WALKTHROUGH.md:728-732`: `cargo run --release -p spatial-engine --features fixture --example make-fixture -- --out target/fixtures/slice-budgets/polygons-100k.parquet --features 100000 --vertices 100` (the harness also writes it itself) |
| `100k-happy-path.parquet` | `target/fixtures/manual-walkthrough/` | M14, M15 | yes (29,933,646 B) | yes — `cargo test -p spatial-kernel --test manual_walkthrough_fixtures -- --ignored --nocapture` (`MANUAL-WALKTHROUGH.md:135-136`) |
| `filter-zoned.parquet` | `target/fixtures/manual-walkthrough/` | Part G's own fixture, needed only if you publish a fresh bundle for the entry-86 row | yes (409,872 B) | yes — `cargo test -p spatial-kernel --test manual_walkthrough_fixtures generate_the_filter_fixture -- --ignored --nocapture` (`:235`) |

`kernel/FIXTURES.md:9-13` registers only fixtures expensive to lose (today: `parcels-5gb.parquet`) and states that the walkthrough fixtures and the Polygons-class fixture *"regenerate in seconds and carry no single-point-of-failure risk"* — none of tonight's needs an entry there.

## 3. The rows

### Row 1 — Part K, K7: entry 66 (b), geometric protection at every zoom

Queued by `state/CUT-STATE.md:17`:
~~~
- Entry 66 (b) — PR #45 (both batches gated; the fits latch inverted; drop-at-drain); the ADR-028 closing note on the human's word (Amendment 4's text with Amendment 5 (e)'s clause); the 13b line retires at its landing; its Part K row into the next sitting bundle.
~~~
The row, verbatim (`frontends/shell/MANUAL-WALKTHROUGH.md:742`):
~~~
| K7 | **Entry 66 (b) — geometric protection at every zoom. Queued for the next accumulated sitting bundle (`AI_DEVELOPMENT.md`, rule 11); this row never asks for same-day operator time.** From `polygons-100k.parquet` at a "Zoom to layer" fit, wheel out roughly eight notches, wait for the status to settle, then pan slowly in one direction. | Expected: tiles already drawn stay drawn while they remain on screen; the status still reports the view as partial. A tile that vanishes while still visible is the finding this row exists to catch. **The status reading itself changed at that zoom** (the human's ruling, DECISIONS-PENDING entry 76 (1) — entry 66 (b)'s second batch): a view that read as fitting only because the part of it the app had enumerated happened to be complete now reads as over-budget / settled-partial instead, so at these far-out zooms expect the partial-view sentence where a "showing all" reading may have appeared before. That is the intended new reading, not a regression. **Judge:** while you pan at that zoom, does the picture hold together — the same areas staying drawn as they move across the screen — or do parts of it drop out and come back? And does the status sentence you get there match what you can actually see of the view — honest, or over-cautious? Describe what you see in your own words; the exact wording of the two sentences is K2's job, not this row's. |
~~~
**Steps:** arm candidate/fine, open `polygons-100k.parquet`, **Zoom to layer**, wheel out roughly eight notches, let the status settle, then pan slowly in one direction. **Look at:** the tiles already painted, as they move across the screen; then the status sentence. **Pass:** drawn tiles stay drawn while they remain on screen, and the status reading matches what you can see. **Fail (the finding this row exists to catch):** a tile that vanishes while still visible. The changed status reading at that zoom is intended (entry 76 (1)), not a regression. **Written to:** the walkthrough result log + `DECISIONS-PENDING.md` entry 66 (b).

### Row 2 — Part L, L7 and L8: entry 47's re-pick on camera settle

L7, verbatim (`MANUAL-WALKTHROUGH.md:818`):
~~~
| L7 | **Block C — the hover readout across a camera change, forward direction.** Zoom in until individual polygons are clearly larger than a pixel, hover one until its `id <number>` readout shows, then — **pointer stationary** — zoom OUT (mouse wheel, no pointer movement): first by just ONE step, while the feature is still plainly big enough to tell apart, and then further, past sub-pixel scale. | **[UPDATED 2026-09-10 for entry 47 (the re-pick on camera settle) — this row's re-run is QUEUED FOR THE NEXT ACCUMULATED SITTING BUNDLE (`AI_DEVELOPMENT.md` rule 11); the result log below is the PREVIOUS build's and is not evidence for this text.]** While the wheel is still turning the readout never holds a stale id — below the declared threshold it refuses by name, above it it clears. **When the gesture stops, one fresh pick at the pointer's own pixel decides what you see.** After the one-step zoom-out (the case you reported on 2026-09-07: *"as long as I can tell on which feature I'm hovering, there's no reasono to remove the id"*) the same `id <number>` comes BACK — re-picked at the new camera, never a retained string. Past sub-pixel scale you get the named refusal instead, verbatim: *"Features here are below pick resolution — zoom in to inspect them."* — the refusal always wins over any id. **Judge:** does the readout keeping pace with the zoom read as the app staying honest under your hands — and does the id returning after the small zoom-out read as *right*, or as jumpy? |
~~~
L8, verbatim (`MANUAL-WALKTHROUGH.md:819`):
~~~
| L8 | With the refusal standing from L7 and the pointer still stationary, zoom back IN above the threshold. | **[UPDATED 2026-09-10 for entry 47 — re-run QUEUED FOR THE NEXT ACCUMULATED SITTING BUNDLE (rule 11); the result log below is the PREVIOUS build's.]** Mid-gesture the refusal clears. **When you stop, the re-pick answers on its own, without you moving the mouse:** the ordinary `id <number>` readout returns if a feature really is under that pixel at the new camera, and nothing at all is shown if nothing is — never a guessed id (a pick that resolves nothing clears; a tile not yet resident there resolves nothing). Moving the mouse still behaves exactly as it always did. **Judge:** does the readout coming back by itself read as correct restraint finally paying off — or as the readout flickering unhelpfully (blank, then back)? |
~~~
**Steps:** L7 — zoom in until polygons are clearly bigger than a pixel, hover one until `id <number>` shows, then with the **pointer perfectly still** wheel OUT one notch, then further past sub-pixel scale. L8 — from that standing refusal, still not moving the mouse, wheel back IN above the threshold. **Look at:** the readout at the moment each gesture stops. **Pass:** L7 — the id comes back after the one-notch zoom-out (re-picked, not retained) and past sub-pixel scale the named refusal stands instead; L8 — the ordinary id returns on its own without mouse movement, or nothing shows if nothing is there. **Fail:** an id that survives a camera where you can no longer tell which feature is under the pointer (a *retained* id; entry 47 makes a re-picked one correct there), or a readout that reads as flicker rather than restraint. Both rows' own bracket holds: the result log printed below them is the PREVIOUS build's and is not evidence for this text. **Written to:** the result log + entry 47.

### Row 3 — entries 85 and 84: Zoom to layer under a filter; the settled status under a filter

M14, verbatim (`MANUAL-WALKTHROUGH.md:885`):
~~~
| M14 (added 2026-09-13 by the release/0.1.0 fixes; DECISIONS-PENDING entry 85) | "Zoom to layer" under a row filter | Open `100k-happy-path.parquet` (M4's own dataset). In the filter panel apply `id < 100` (Part E's E2). Click **Zoom to layer** — the filtered features fill the view. Wheel out several notches, then click **Zoom to layer** again. **Expected:** the second click returns the camera to the filtered fit exactly as the first did. A second click that leaves the view where it was is the finding (sitting 2's M5 (c), fixed on RC2 by entry 85: the fit's camera write is no longer ignored when it equals the previous one). Record what the second click did, in words. |
~~~
M15, verbatim (`MANUAL-WALKTHROUGH.md:886`):
~~~
| M15 (added 2026-09-13 by the release/0.1.0 fixes; DECISIONS-PENDING entries 84 and 87) | The residency status under a row filter | With M14's filter still applied and the view fitted, wheel out several notches and wait for the status line to settle. **Record the sentence verbatim.** Entry 84 (fixed on RC2) makes a tile that returns no rows under the filter count as loaded; entry 87 (open at this writing) is a second cause of the same sentence — filtered per-tile queries dropped before any stream is issued — so on RC2 the settled-partial sentence (*"Filling has finished for this view — some areas were not loaded; pan or zoom to load them."*) may still appear here. If it does, that is entry 87's finding, not a regression of entry 84 (whose fix is pinned at the unit level); if the within-budget sentence (*"Showing all `<N>` features in view"*) appears instead, record that. Either outcome is recorded, not judged, by this row. |
~~~
**Substitution to record:** both rows are written for Part M — the *installed* artifact on a clean profile; tonight they run in the dev app from `main`. Same click path, different build: say so in the record, and read their "on RC2" sentences as describing the release candidate, not tonight's build. **Changed since the rows were written:** entry 87's shell half (PR #55) and its engine half (PR #59, `LeaseClass::Admission`) are both on `main`, so M15's "entry 87 is a second cause of the same sentence" caveat may no longer bite; the harness's own FIND′ line on #59's head is quoted verbatim at `frontends/shell/POLISH-87-88-89-PREREGISTRATION.md:113`. **Pass/fail:** M14 has one — the second **Zoom to layer** must return the camera to the filtered fit exactly as the first did; a second click that leaves the view where it was is the finding. M15 has none by design: the sentence is **recorded verbatim, not judged**. **Written to:** the result log + entries 85 (M14) and 84/87 (M15).

### Row 4 — Part G, entry 86: the bundle viewer's zoom anchored at the pointer (PR #53)

Queued by `state/CUT-STATE.md:43`:
~~~
- 2026-09-13 — **Viewer piece (entry 86) built (worker, reported):** `viewer/zoom-anchor` 9e69f59 (E2E first, pre-fix readings: large window 110 px off, small 182 px off, forced 1280×900 exact) → 35763d1, e0558f7 (tolerance and DPR revisions AFTER results — a §3 deviation; Amendment 1 ordered to record it) → 95309d7 (the fix: `toStore` with the measured ratio; store sized to the client box × DPR on load and ResizeObserver; `zoomAt`/`panBy`/`resizeStore` pure; viewer-local `MAX_BACKING_STORE_DIM`/`PIXELS`; `ceilings.json` byte-identical) → 9c1064c (five unit tests; E2E wired as `test:e2e`, not in `verify` — CI has no playwright-core and no bundle; the `run-acceptance.mjs` precedent). Mutation: the wheel-site conversion reverted → all three E2E cases fail by name. `npm run verify` exit 0. Line-16 replacement drafted for the human's sight (appended to entry 86). Reviewer + architect gates to be routed after the amendment; the Part G row queued (sitting).
~~~
**No walkthrough row text exists for this yet** — PR #53 changed no line of `MANUAL-WALKTHROUGH.md` (checked across the file's whole history), and Part G on `main` still ends at G9/G10. The row's binding description is the preregistration's own rule (`renderer/bundle-viewer/ZOOM-ANCHOR-PREREGISTRATION.md:14`): *"The pointer and the view share ONE pixel space, and the conversion into it happens in exactly one function."* **Precondition, and it is a build:** in dev, publish reads the viewer out of the checkout (`frontends/shell/src-tauri/src/publish.rs:1127` → `renderer/bundle-viewer/dist`), and that `dist/` is dated 2026-09-09 — **older than PR #53** — so a bundle published tonight carries the *unfixed* viewer unless `npm run build` is run in `renderer/bundle-viewer` first. **Steps:** rebuild the viewer dist; Part G's G1–G5 on `filter-zoned.parquet` to a destination under `C:/dev/spatial-ide/target\`; then from `renderer/bundle-viewer`, `node scripts/serve-bundle.mjs "<that destination>" 8732` and open the printed URL. **Look at:** put the pointer on a recognisable feature away from the centre and wheel in, then out — at a large window, a small window, and after resizing the window. **Pass:** the point under the pointer stays under the pointer, and the picture is not stretched. **Fail:** the view walks away from the pointer (the reproduced shape: NW on zoom-in, SE on zoom-out at a large window, reversed at a small one). If you would rather not run a build tonight, skip this row and record that — it is the only row needing one. **Written to:** the result log + entry 86.

### Row 5 — the polish rows (entries 87, 88, 89; PRs #55 and #59)

What the polish preregistration names for the operator (`frontends/shell/POLISH-87-88-89-PREREGISTRATION.md:63`):
~~~
**Architect** — ADR-028 Decision item 4 (`:35-36`); ADR-010 rules 2 (`:33`), 5 (`:68`), 6 (`:70`, `:74`); ADR-021 item 8; ADR-004 (no wire change, proven by the code set being unchanged); docs/01 principles 7 and 8; entry 75 (3)'s reopened item for §3; §5 checked one by one. **Reviewer** — the full diff; the K6 contract change (§3.3) and the threshold change (§4.2) each reviewer-gated in their own right; decisions pure and unit-tested. **Suites** — `npm run verify`; the regression suite once through the harness with **FIND′ reinstated** and **K6 re-run**; every mutation recorded. **Operator** — one walkthrough row per entry (87: the settled sentence under a filter; 88: the hover through a zoom gesture; 89: the refusal's onset and the cursor), committed with blank result logs and queued into the next sitting bundle (AI_DEVELOPMENT rule 11). Merge on the human's click.
~~~
Those three rows were never written into `MANUAL-WALKTHROUGH.md` (PR #55's diff touches no line of it). Their state tonight, read from `main`:
- **87 — the settled sentence under a filter:** covered by Row 3's M15; run it once, there.
- **88 — the hover through a zoom gesture:** the ruled labelled "confirming…" state **landed (PR #64)** — run it at Row 6 (c). Entry 47's clear-then-re-pick (Row 2 L7/L8) is the mid-gesture behaviour beneath it.
- **89 — the refusal's onset and the cursor:** the **cursor half landed** (`frontends/shell/src/canvas/WorkingCanvas.tsx:1833-1837`, `getCursor → cursorForPointerState`). **Steps:** hover the canvas with no button down, then hold and drag. **Pass:** crosshair while hovering, grabbing while dragging — exactly two shapes, no `pointer` hand. **Fail:** deck's default grab hand while merely hovering, or a shape implying a click affordance that does not exist. **The threshold half landed (PR #64):** `pickResolution.ts`'s `SUB_PIXEL_PICK_REFUSAL_THRESHOLD_PX` is now `9` — sighted at Row 6 (a). **Written to:** the result log + entry 91 (c)/89.

### Row 6 — new rows from the rulings of 2026-09-14 (question set B)

**(a) The hover threshold — B2, verbatim (`DECISIONS-PENDING.md:27`):**
~~~
- *B2, entry 91 (c) — the hover refusal threshold:* **"9 px sighted as the declared threshold — a declared choice recording the 2.27 px measured figure and its caveats beside it, never presented as a measurement. Rationale in the constant's comment: human pointer targeting, not pixel resolution, decides whether "which feature" is answerable. Revisable only by a walkthrough-recorded felt verdict (a sitting row hovering features of roughly 5, 9 and 15 px), never by a guess. Crosshair cursor while hovering: no objection."**
~~~
**Steps:** on `polygons-100k.parquet`, hover features whose on-screen size is roughly **5 px, 9 px and 15 px** (reach each by zooming; judge size by eye against the pointer, never against a figure) and at each say whether *"which feature is under the pointer"* is a question you can answer. **The verdict is the outcome** — the row exists so the declared line is revisable by a recorded felt verdict rather than by a guess. **Now live (PR #64):** the threshold is **9 px** on tonight's `main`, so this IS the felt verdict the ruling asked for. Hover ~5, ~9 and ~15 px features and say where the answerable/unanswerable line falls for you. If 9 px feels wrong, your recorded verdict revises the declared value (a one-line change, no new gate). **Written to:** the result log + entry 91 (c).

**(b) The pan re-pick feel — B3, verbatim (`DECISIONS-PENDING.md:28`):**
~~~
- *B3, entry 75 (1) and (2) — the hover re-pick defaults:* **"(1) Default stays pan+zoom as built, behind the declared HOVER_REPICK_ON_PAN switch — the release-edge guard is proven by test and mutation, and the criterion applies after a pan exactly as after a zoom. Sighted at the sitting: if any pan artefact is felt, the default flips to zoom-only as a one-line declared change with the felt verdict cited, no new gate. (2) Keep: a resize or DPR change disarms the pending re-pick. A stale frame is never picked; re-mapping the pointer through a changed frame is precision work with no user asking for it."**
~~~
**Steps:** with a standing `id <number>` readout, **pan** (drag) rather than zoom and let it settle; repeat a few times, different directions and speeds. **Look at:** the readout across the drag and at the moment the drag stops. **Pass:** the re-pick after a pan feels the same as after a zoom — no artefact. **Fail:** any pan artefact you can feel; by the ruling that verdict flips the default to zoom-only as a one-line declared change citing your words, no new gate. The switch is `HOVER_REPICK_ON_PAN = true` (`frontends/shell/src/canvas/hoverRepickConstants.ts:53`); the resize/DPR disarm stays either way. **Written to:** the result log + entry 75 (1).

**(c) The "confirming…" marker's wording — B1, verbatim (`DECISIONS-PENDING.md:26`):**
~~~
- *B1, entries 91 (b) + 75 (3) — entry 88's blink and the "unconfirmed" state:* **"Reopen as a labelled state. Between a camera change and its settle re-pick, the standing id stays visible with a plain, muted marker — "id 6430 · confirming…" — never the bare id. The marker is removed only by a re-pick result: if the re-pick confirms, the marker drops; if it finds a different feature, the readout changes to it; if it finds none or below-threshold, the readout becomes the refusal or clears. A stale id is never served without its marker (ADR-010 rule 5), and the marker never outlives a settle. Tests: the labelled state cannot render without the marker; only a re-pick result removes it. Wording sighted live at the sitting; the state itself is ruled now."**
~~~
**Now live on `main` (PR #64).** **Steps:** hover a feature until its `id <number>` shows, then — pointer still — make a camera change (wheel one notch, or pan) and watch the readout in the moment BETWEEN the change and the settle: the standing id stays visible with a muted marker beside it, `id <number> · confirming…` (that wording is the PLACEHOLDER you are sighting), never the bare id. When the settle's re-pick lands: if it confirms, the marker drops to the plain id; a different feature replaces the readout; nothing-or-below-threshold becomes the refusal or clears. **Judge two things:** (1) the STATE — does keeping the id under a muted 'confirming' label read as honest, versus the old blink to blank? (2) the WORDING — is `confirming…` the right word, or say the word you'd use (the ruling reserved the wording to you; your verdict sets `HOVER_CONFIRMING_MARKER_TEXT` via node `marker-wording-final`). **Written to:** the result log + entry 88/91 (b); the wording verdict feeds `marker-wording-final`.

## 4. Where each verdict is written

1. **The walkthrough's own result format** — `frontends/shell/MANUAL-WALKTHROUGH.md`'s `## Result log` (`:893`): a new dated section for this sitting opening with **Date run**, **Run by**, **Build/commit** (`main` @ its head; "dev app, not the installed artifact"), then one bullet per row with the verdict in your own words. Rows with no home section (86, the cursor, 5/9/15 px, the pan feel) go in that same section under the row names used here.
2. **`DECISIONS-PENDING.md`, as a felt verdict** against the entry each row belongs to: K7 → 66 (b); L7/L8 → 47; M14 → 85; M15 → 84 and 87; the viewer row → 86; 5/9/15 px and the cursor → 91 (c)/89; the pan feel → 75 (1). A felt verdict is your words recorded verbatim — nothing in the tree may claim more than what is written there.
3. A deviation in the stop-and-report sense (Part K's and Part L's own closing paragraphs, `:744` and `:822`) stops the row and is recorded as seen, not chased.

## 5. Closing checklist

- [ ] Quiet machine: no build, no spike, no second app.
- [ ] App launched from `main` @ 74465c0 with the e2e overlay (or `npm run e2e:debug`). — with `CARGO_TARGET_DIR=C:/dev/spatial-ide/target` set (see §1).
- [ ] Arm verified `"candidate"` after every `Ctrl+R`; tile size `fine`.
- [ ] Row 1 — K7 (66 (b)). [ ] Row 2 — L7, L8 (47). [ ] Row 3 — M14, M15 (85; 84/87).
- [ ] Row 4 — the viewer zoom anchor (86), only if the viewer dist is rebuilt first.
- [ ] Row 5 — the cursor (89: crosshair / grabbing).
- [ ] Row 6 — (a) 5/9/15 px on the 9 px build (LIVE); (b) the pan feel; (c) the confirming-marker STATE and its WORDING (LIVE, PR #64).
- [ ] Verdicts in the walkthrough's result log, and in `DECISIONS-PENDING.md` as felt verdicts.
- [ ] App closed by PID; nothing left running.
