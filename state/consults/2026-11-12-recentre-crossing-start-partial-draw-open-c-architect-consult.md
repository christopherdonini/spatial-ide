*Custodian's filing note (2026-11-12): the architect's read-only consult on OPEN-C, the human's item 1 (c) of 2026-11-12, read at main 6cfea93b and at the fix's branch at 3df3e57c, from its hand-back (16852 bytes, sha256 c50c2fc906981578586565e4a31556f2fb46f34b12e9fa2f981e622d71c93bb1), below the rule. Each `sha256:<H>` is filled by script with the sha256 of the cited whole lines, each with its LF, at 6cfea93be992018afe020306a1122730f4375f86 (46 pins); a final newline is added; nothing else is changed. Its brief by file (7294 bytes, sha256 56c9fe0a7150417bc32a1d9f9fdb1af792a9f7e4b767e49621d0dae669d32553); the run 14:00:40Z to 14:09:57Z by its transcript, 77 calls (Read 40, Grep 35, Glob 1, the hand-back), no write, model claude-opus-5-5. One call errored: a Grep of `docs/KNOWN-LIMITATIONS.md`, a path the custodian's brief gave wrongly (the file is at the root); the consult names it as a packet gap. It is for the human's grade. Its four OPEN items are red lines and wait for the human's words. A reading and not Authority.*

---

Read: recentre-crossing-view-displaced-fix, OPEN-C (item 1 (c)), at main 6cfea93b
Reviewed: main 6cfea93be992018afe020306a1122730f4375f86; branch cut/recentre-crossing-view-displaced-fix at 3df3e57c38b82859eb9f01b294557fb143769ef7 (worktree C:/dev/wt/rcf).

The brief. I have no shell, so I cannot show the brief's sha256. Its first line, as I read it: **Tag: `node:recentre-crossing-view-displaced-fix@open-c-consult`.** You are the architect. This is a read-only consult that the human ordered in their message of 2026-11-12 (13:07Z), item 1 (c). It is about E1 case 1's two images at the head build: the start image holds less of the fixture than the end image at the same view. You read and answer. You write no file, and you propose no change to the fix.

The question is `state/directives/2026-11-12-s1-fix-open-a-c-s6b-now-pr-b-class-9-now-1c-five-308-c1-words-platform-reports-order-no-git-stash.md:12` @ 6cfea93b sha256:3a5d86dd94c865814592a9d360239691e78c8696f5fe49a1c4c082e1ab602319.

Everything below is my reading. Arithmetic is mine and was not measured. Nothing in this report is a quotation.

## 1. What is drawn at the start, and by which query

- **The query.** It is the tile arm's untiled first look. The shipped default arm is the tile arm (`frontends/shell/src/residency/residencyArm.ts:50` @ 6cfea93b sha256:7f6a03cf4a311a343a544451e647abc60699d4db675128f8f872afbff2ec2bac; `frontends/shell/src/App.tsx:1649-1650` @ 6cfea93b sha256:281160b593db2a3c2ab0ab7ee9edb2eb7a2143ccf90eeb3644ea60db20d1a8f1).
  - It is issued once, at open, and not debounced (`frontends/shell/src/App.tsx:1735-1738` @ 6cfea93b sha256:bb8ffe9c8215c21873177f3f34b9d55bf8d068ed7ac3b2eb7b6dc1ba2d113654).
  - It goes through `issueUntiledQuery` (`frontends/shell/src/residency/candidateArmSession.ts:1271-1283` @ 6cfea93b sha256:56151a12d6d9502504618420b33351aa264ee30caeb8800c31bf6a0933d0028e).
  - Its bounds are none (bbox null), with no filter.
  - Its row cap is UNTILED_FIRST_LOOK_ROW_LIMIT, 10,000 (`frontends/shell/src/canvas/tileGridConstants.ts:155-185` @ 6cfea93b sha256:6f40ff0fdd2742e9ad25d95e2ccc1e275322c788de05ca8d1460f8fa84ff3ca9).
- **What decides which rows return.**
  - The kernel maps bbox null to the whole-file query and adds the limit (`kernel/src/skp.rs:1896-1901` @ 6cfea93b sha256:8fdd25692411e754821fb0ee0b8eb587445b00a2c8d0c33674ede203969baf6c).
  - The engine emits no WHERE, no ORDER BY, and `LIMIT 10000` (`engine/src/stream.rs:1718-1725` @ 6cfea93b sha256:15d970a4039ffe0e07a53040cf8825598908bd8305f965ae76f7f51c6f620515). So the rows are the first 10,000 of DuckDB's unordered scan.
  - The fixture is laid out row-major by id, 317 columns of 40 m cells (`engine/src/fixture.rs:1404-1412` @ 6cfea93b sha256:c1e8915bf5e03a4da8c6698933e2cdeac4523405cd892e6010493ba471bc4966; `engine/src/fixture.rs:93` @ 6cfea93b sha256:111e19e1f5635e8cee5159fc900e85b3585b3aed0e349f4d45aa860cc4c05aa4; `kernel/tests/manual_walkthrough_fixtures.rs:44-55` @ 6cfea93b sha256:8f95a19454f5fee0d21d879f5cc47f0a666de42175226dcc26e2e0aa3cacd9b0). The first 10,000 rows are therefore the bottom 31 lattice rows plus 173 parcels of row 31.
  - The run's own session log confirms the strip: lines 8-9 of the worker's copy `rcf-s47.session.log` (sha256 25b5a13443c462bdf31438266f050fbba4ca011cf0f2e60e30231aef62b501e1, as the worker's report gives it; evidence, not Authority). The first look ended Completed, and its observed union is x 2600003.59–2612676.63, y 1200003.28–1201276.77, which is about 1273 m tall, or 32 lattice rows.
- **The zoom.** The camera fits once, to the first batch that carries geometry, not to the strip (`frontends/shell/src/canvas/WorkingCanvas.tsx:1771-1782` @ 6cfea93b sha256:a02abe1b0c803a071841527fd4071ee13effbc0e27302cc67607a78bb4484af4). The fit leaves a 10% margin (`frontends/shell/src/canvas/extent.ts:126-148` @ 6cfea93b sha256:df709dcb5df01e1ff2ff47bac7b4d4c6d4782921c4b3855987e01ea68a9c6594).
  - At z_fit −3.6925, the scale is 0.077346 px/m. 534.4 px of usable width gives an x span of about 6909 m. That is a first batch of about 173 parcels of row 0, which fits the engine's 64 KiB first-batch target (`engine/src/stream.rs:66-71` @ 6cfea93b sha256:bbfb0b6d292447656ac55c359f22f3f60f2c3c63e93d4ae2805898f322adad66). This count is inferred; no log gives it.
- **The start image is that strip at that fit** (sha256 102996b14908f10ff21f6afb7bbb1ec30dfacfdd7997510285c082331159f3f2). Projected, the strip's left edge falls at 66.8, its bottom at 357.3, its top at 258.8 (stepping to 261.9 past x ≈ 601.5, where row 31's 173 parcels end), and its right edge at about 1047, off the canvas. The custodian's box is x 66–667, y 258–357; it matches within 1 px.
- **No tile is requested before drag 1.**
  - The auto-fit does not report a viewport (`frontends/shell/src/canvas/WorkingCanvas.tsx:1424-1434` @ 6cfea93b sha256:4e950f29d68ce12589f5617a916ac2e9337fff10604903513f53a4b24d4ea171).
  - Tile planning waits for the first `onViewportChanged` (`frontends/shell/src/residency/candidateArmSession.ts:68-79` @ 6cfea93b sha256:e7e4aa820d641c06a5f284b14633bb1da287ea409735caa677ecf13a85a2a320).
  - E1's start capture waits for 3 s with no render-trace line. That means the first look has stopped arriving, not that the view is full. See recentre-crossing.mjs lines 208 to 212 and 229 to 234, on cut/recentre-crossing-view-displaced-fix at 3df3e57c.

## 2. What is drawn at the end, and by which query

- **The end image** (sha256 cf7fd271ad7847389f4e0dd213d2d537171467ab061d34615974bc570593f519) holds two things.
  - The first look's rows. They stay resident: that key is evicted last, and it is protected while it meets the plan's box (`frontends/shell/src/residency/candidateArmSession.ts:1563-1564` @ 6cfea93b sha256:35877af65a00d41a5ead2cba23136554415544d8fb71a590076e3e274169b2d1). The fixture's total vertex count is under MAX_RESIDENT_VERTICES (the fixture test's assert), so by reading there is no budget eviction.
  - The tile streams. Each is a `viewport_query` with the tile's box and no limit (`frontends/shell/src/streaming/tileViewportStreamManager.ts:948` @ 6cfea93b sha256:bb9b82059e10d30423015f072134601c49d2c1aba3284a04d89b6fcb41fa89bb). Its rows are every feature whose covering box meets the tile (`engine/src/stream.rs:1703-1711` @ 6cfea93b sha256:ce3694c47e766d6218d244a33b1e35b881d4781d99e8be47f06be8d4e1b2bed0). The grid is medium, 16×16, over baseSpan 25346 m (session log line 9), so a tile is about 1584 m.
- **Which ticks issue a query.**
  - Every `onViewStateChange` tick calls `reportViewport` (main: `frontends/shell/src/canvas/WorkingCanvas.tsx:2148-2158` @ 6cfea93b sha256:56e1173c56a20266ab6ec306e3e028bf077d7c50903820974c3af04c65193ba2; branch: WorkingCanvas.tsx lines 2161 to 2172 on cut/recentre-crossing-view-displaced-fix at 3df3e57c).
  - That reaches the session's 120 ms trailing debounce (`frontends/shell/src/residency/candidateArmSession.ts:1625-1631` @ 6cfea93b sha256:9928fb4a1d31cde3f5e83ae6f43f73c9d950e0fdc571ca48ede5e854c3d44983; `frontends/shell/src/streaming/debounce.ts:35-53` @ 6cfea93b sha256:3c1bc283e1bc6513a20264da6fc750888df8b0a6552183b61d378c2cacc7b6f3; `frontends/shell/src/streaming/viewportStreamManager.ts:25` @ 6cfea93b sha256:0c951f7fadc18dad65170ff2adf4b3bf6efb41ac49ab9056eac397495e0b1a84), and then a plan (`frontends/shell/src/residency/candidateArmSession.ts:1465-1487` @ 6cfea93b sha256:c9a0e195024c3c1b4fa42c56d501b13736e141262826f3e969e7adcb4db29f67).
  - Every drag therefore plans at least once, after its settled tick.
- **The re-centres at drags 35 and 74 issue no query of their own.** The branch's re-centre returns the rebased view state and calls `render()`. Its `reportViewport` is the same call every tick makes, with the pre-centre origin pair, so the world box is the same (WorkingCanvas.tsx lines 2152 to 2172, branch at 3df3e57c).
- **Which plans leave the end's rows drawn.** By my arithmetic, only views within 2d of the start view meet the data: drags 1, 2, 72, 73, 74, 75 and 76. Drags 3 to 71 plan views with no data. The start view itself is planned only at drag 74 and drag 76; the fit never asked for it.
  - Drag 74's or drag 76's plan therefore minted the tiles of the view's eastern part (about x0 + 4024 m to x0 + 7773 m), which earlier views never covered. Drags 72 to 76, and possibly 1 and 2, minted the western tiles.
  - A tile in flight when it leaves view is cleared (`frontends/shell/src/residency/candidateArmSession.ts:956-966` @ 6cfea93b sha256:6f69f3fcedfe10d1d157fce1bf154c04a7b3ecacb1035a4bb0ccbac581d5fc67). A complete one stays.
  - Which stream delivered which drawn tile cannot be read: E1 keeps no record of the stream-issued or tile-ingest lines.

## 3. Does anything on screen tell the user that the start is partial?

Nothing does.
- **Residency status.** It is silent until a plan has run. `settledState` requires `hasPlanned` (`frontends/shell/src/residency/residencyStatus.ts:330-336` @ 6cfea93b sha256:3d84bc8cf37f351430d098d1e8748565cb62683776c6a13afb70d34299d28400). `emitResidencyStatus` sends nothing on `not-settled` (`frontends/shell/src/residency/candidateArmSession.ts:839-845` @ 6cfea93b sha256:57c9a2f7bc7220a4d4595b915d54d2d0c1d9ebb6505c0f53010e0c5c42f2e646). The status slot renders only a non-null status (`frontends/shell/src/App.tsx:2418-2423` @ 6cfea93b sha256:1cb373bcf44931cb824ae02f0dd5f2be90a9656d2659e5630c562da0a9a1ae07).
- **The partial mark.** The first look is marked durably partial when it reaches the limit (`frontends/shell/src/residency/candidateArmSession.ts:1408-1421` @ 6cfea93b sha256:59b1dcf0461603c36f622a5a28a94d286bab2145612bfc7a7e2dbcf897810f13). That mark feeds protection and completeness, never a status.
- **Scan liveness.** Cancel shows while the first look is in flight. The liveness text is null in the `issuing` state (`frontends/shell/src/App.tsx:553-561` @ 6cfea93b sha256:6dd74c8046312594418ed3fb798b671a3f5c7b1eb4d51f1669aee134859bb2fb). After the terminal it resets, so at the start capture there is no text.
- **Elsewhere.** The describe panel's Extent row speaks of fitting, not of partiality (`frontends/shell/src/admission/DescribeSummary.tsx:50-54` @ 6cfea93b sha256:f0ce7f71f53113db691014afe3e3fe8c9ac64f4b36dbaabb542d9e245f17625e). E1 clips its images to the canvas, so the status bar was not recorded at either capture.
- **The docs.**
  - KNOWN-LIMITATIONS (at the repo root) item 61 declares the fit to the first batch (`KNOWN-LIMITATIONS.md:498-499` @ 6cfea93b sha256:ef794ace1741687a9a43a0f022dae5e51b3893588796fb3338829466625dbef1).
  - Item 7 declares partial views only through statuses that exist after a plan (`KNOWN-LIMITATIONS.md:104-110` @ 6cfea93b sha256:1a1d592bdda9613d6bbe01212abe60a2f1833e19cb232bdf2c7a2c857b51583e).
  - Item 39 says a change of size after the fit asks for nothing (`KNOWN-LIMITATIONS.md:425` @ 6cfea93b sha256:aedd49bab470efb5fd5bfb43fbdbab9d98561e5d2adfb418b25bf4ef057b4dc7).
  - Only the walkthrough's operator note names the 10,000-row strip (`frontends/shell/MANUAL-WALKTHROUGH.md:808-811` @ 6cfea93b sha256:f2b00fec3d0a44d0fbd8837cb8e5d333c9660d1ec17c9636e0a4a93068116205). That is not shown in the app.
- **docs/01.** Principle 7 (`docs/01_Principles.md:13` @ 6cfea93b sha256:8c6bcdb7ff11f95750cac89842afa4c90b6dff5a3ed5e3aaaab8994b458bcf44) asks for progress reporting. The first look streams and can be cancelled, but its progress report ends with the view holding a row-limited subset the code knows is partial, and says nothing. This is principle 8's black-box concern in substance (the same file, line 14). ADR-010 rule 5 (`docs/adr/ADR-010-render-frames-origins-boundaries.md:68` @ 6cfea93b sha256:6eccb933b09d2ae2bce543da0634d28492e43fdd300d2289b096be55c78a410f) addresses state behind the committed state, which is near this case but not it.

## 4. The mechanism

Reading names it. The start is the first look, at most 10,000 rows in scan order, at a fit to its first batch. The open asks for no tile until a camera change. The end is the first look plus the tile streams planned from drags 72 to 76 (and 1 and 2). This is the open's designed sequence, not a defect of the fix, and not the re-centre's `render()`.

It resolves Amendment 2 item 2's open "mechanism: unknown" (`governance/forms/frontends/RECENTRE-CROSSING-VIEW-DISPLACED-FIX-PREREGISTRATION.md:552-562` @ 6cfea93b sha256:7b5ecd36874fa21ced3793c6624426e91e0318a314cf5ba9ef98d3d68a0aefb4) as "data admitted after the fit". No observation is proposed.

**What I expect item 1 (b)'s projection to show** (`governance/forms/frontends/RECENTRE-CROSSING-VIEW-DISPLACED-FIX-PREREGISTRATION.md:700-712` @ 6cfea93b sha256:994eb2d7569c349c49ed69a5440d45497b4ad3bac61f88d6a420a0f958b6f84d), at the fit view (|E| 0 in the S6 run, worker report `state/consults/2026-11-12-recentre-crossing-view-displaced-fix-s4-s7-worker-report.md:87-93` @ 6cfea93b sha256:4d6b91cb2047c16bb2919311b043c7577728a82aaaa2cdf7fd9b29ec2918b2d0):
- left edge ≈ 66.8 and bottom ≈ 357.3 buffer px (DPR 1);
- right ≈ 1047 and top ≈ −620, from the generator's grid (`engine/src/fixture.rs:958-963` @ 6cfea93b sha256:636b39de75b5c6d0b5aef17ea4f1e46bb4ec482cdfca04f2af160c9480d22b25).
- So the fixture reaches past the top and right edges, and the start image is the partial one. The K edges {left, bottom} should match within about 1 px.

## OPEN items

- **OPEN-1, red line (node placement and severity).** The view after open is partial and nothing says so, on every open of a file over 10,000 rows.
  - (A) Record only, with OPEN-2's item.
  - (B) A node: when the first look sets up the grid, plan the tiles of the view the fit shows (the fit already computes it, `frontends/shell/src/canvas/WorkingCanvas.tsx:1429-1433` @ 6cfea93b sha256:d870151da0912b897b54572977f11ee82b2bcb7227d8f72ac611569d33e4ce4e). It needs its own form; it changes query volume at open and E1's start state.
  - (C) A node: a status when the first look ends at its limit. That is a new P6 string.
  - Recommendation: (B), severity yours, with OPEN-2's item until it lands. The fix does not wait for it.
- **OPEN-2, red line (KNOWN-LIMITATIONS wording).** A draft item for your sight, not your wording: "After a file opens, until the first pan or zoom, the map shows at most the first 10,000 rows the file returns, and the status line says nothing about it."
  - Clause check:
    - "until the first pan or zoom": `candidateArmSession.ts:68-79` (cited above), with Zoom to layer counting as a zoom (`frontends/shell/src/canvas/WorkingCanvas.tsx:1593-1608` @ 6cfea93b sha256:db124d8ee357eca7b6e7f5a1cf1b9379183a438dee3e598a968be1a266b30274);
    - "at most the first 10,000 rows": `tileGridConstants.ts:185` and `engine/src/stream.rs:1718-1725` (cited above);
    - "says nothing": `residencyStatus.ts:330-336` and `App.tsx:2418-2423` (cited above).
  - Apply and Clear were not read far enough, so the draft does not cover them.
  - Options: these words, your own words, or no item. Recommendation: these words.
- **OPEN-3, red line (the wording of your ruled check, item 1 (b)).** "Drawn point radius" meets a polygon file. Each parcel's ring radius is 0.42 cell (`engine/src/fixture.rs:1419` @ 6cfea93b sha256:d1b1a877df9ad16282163b8540c956d205aac2b98320fe68865dae04fc6e9f59), about 1.3 px at z_fit.
  - (A) The reviewer uses the polygon's drawn half-extent at the zoom plus the layer's outline width, read from code, and says so.
  - (B) Your own definition.
  - (C) A radius of 0.
  - Recommendation: (A).
- **OPEN-4, red line (P6 string).** The describe panel's Extent row (DescribeSummary.tsx:50-54, cited above) reads as if fitting were continuous. On the shipped arm the fit runs once (item 61). Recommendation: put it on the next P6 sight, no change now.

## Gate findings (not ruled)

- **G1 (Correctness class, the claim of a guarantee; on main, not this diff).** KNOWN-LIMITATIONS item 7's first sentence says the view at overview zoom is declared partial, in words. It does not hold in the window before the first plan when the fit is an overview. That happens with a file whose first batch spans its extent, which ordinary use reaches, by reading. On this fixture's fit it is not shown false: the fit frames one partial row, not an overview. Handled by OPEN-2.
- **G2 (Documentation, branch text, out of S6b's ruled list).** The capture comment at recentre-crossing.mjs line 211, on cut/recentre-crossing-view-displaced-fix at 3df3e57c, presents the settle as the data being in. At the start, it is the first look's end. Replacement words, the worker's text and not yours: "Wait until no render-trace line arrives for 3 s (the reproducer's settle). At the start that is after the first look's batches stop; no tile has been asked for yet, so the start image holds the first look's rows only."
  - Clause check: 3 s is quietMs 3000 at line 212. The batch lines are always-on (`frontends/shell/src/canvas/WorkingCanvas.tsx:1746-1752` @ 6cfea93b sha256:8de9037067fae332790c662cbb4bd84734cfd25b9d6f72268bb03e2347d3b4a5). "No tile has been asked for" is §1 above.
  - S6b is ruled, so the comment is not added there (red line). Recommendation: carry it to OPEN-1's node.
- **G3.** Amendment 3 item 4 says the fix's steps do not wait for this consult (`governance/forms/frontends/RECENTRE-CROSSING-VIEW-DISPLACED-FIX-PREREGISTRATION.md:719-723` @ 6cfea93b sha256:68352955e1810eae143d7a084d56b7010fe22a40ed0f9c9258756a7baf6d2ad8). Nothing here bears on rule (d). On both images, K's edges are drawn by the first look's rows, which stay resident. A camera displacement moves them, so (d) keeps its power to see the defect.

## Read

- **Main 6cfea93b:**
  - the directive (line 12; line 11 for context);
  - the fix form: §1, §2.1, Amendments 2 and 3;
  - the reproducer form: notes 4 and 5 (lines 66–135, 283–293);
  - the S4–S7 worker report;
  - frontends/shell/src: canvas/WorkingCanvas.tsx, canvas/extent.ts, canvas/tileGridConstants.ts, residency/candidateArmSession.ts, residency/residencyStatus.ts, residency/residencyArm.ts, App.tsx (parts), streaming/debounce.ts, streaming/viewportStreamManager.ts (line 25), streaming/tileViewportStreamManager.ts (line 948), admission/DescribeSummary.tsx;
  - kernel/src/skp.rs (1880–1909);
  - engine/src/stream.rs (44–255, 1700–1729), engine/src/fixture.rs (parts);
  - kernel/tests/manual_walkthrough_fixtures.rs (28–113);
  - KNOWN-LIMITATIONS.md (items 7, 39, 61);
  - frontends/shell/MANUAL-WALKTHROUGH.md (800–821);
  - docs/01_Principles.md;
  - ADR-010 line 68.
- **The branch at 3df3e57c:** WorkingCanvas.tsx handler (2091–2173); e2e/recentre-crossing.mjs whole.
- **The two images, by sha256.**
- **Departure, disclosed:** also `<S>/rcf-s47.session.log` (grep only, lines 8–9 and 842–843). This is evidence the brief did not list.

## Packet gaps

- KNOWN-LIMITATIONS.md is at the repo root, not under docs/.
- E1 keeps no record of the run's viewport_query, stream-issued and tile-ingest lines, so which plan minted each end tile cannot be read.
- No log gives the first batch's row count (about 173 is inferred from z_fit).
- The end line's values (S6d's REPORT line) do not exist yet; the projection uses the S6 run's fit with |E| 0.
- The fixture's full extent is from the generator's grid, not measured from the file.
- No record shows the status bar at either capture.

## Reuse index

Both searches missed: `viewport query partial draw residency indicator` and `progressive loading tiles fit first batch`, rc 1, no prior art. Nothing above draws on prior art.

Background shells: none; I have no shell.

Model: claude-opus-5-5 (Opus 5.5), as the harness reports it.
