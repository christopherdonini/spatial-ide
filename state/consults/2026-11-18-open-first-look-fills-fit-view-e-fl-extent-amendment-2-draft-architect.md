Drafted: open-first-look-fills-fit-view Amendment 2 (E-FL's extent), architect. Read at `cut/open-first-look-fills-fit-view @ ff3c1465eea3724c3840485febb2a5da05765623` (E), with the form and rulings on main at 4a267c0d. (the custodian's filing note, 2026-11-18: the architect, model claude-opus-5-5, its run 2026-11-18T19:35:32Z to 19:41:26Z by its transcript, Read 17, Grep 13, Glob 3, none errored; 14091 bytes, sha256 1b91a7743d465fd311edd1bd253c6415c17498bd03e596ae1e21acd829c58b8f; below byte for byte, except four cites into a file that is only on the branch, at its lines 13, 66, 69 and 81, each written unrooted (as line 144, line 147, lines 202-207 and 217-218, and lines 120-133 of that file at E) so that main's cite check passes; with this note and one final newline)

I had no shell, so I could not check the brief's sha256 (`<S>/brief-fl-efl-a2.md`, given as 80cd68af…c9b7e7). I also could not check the log's sha256 (23c1bb4d…71ea). I read the log's text only.

**Gaps in my reads:**
- I did not find ADV-2026-11-18-20 under `state/directives/`. My reading of its item 4 comes only from the custodian's paraphrase.
- The S4 worker's report has not been filed. So I have not seen the build's provenance, the exe hash d8309b1e…, the run's time, or whether Amendment 1 item 3's two base suite runs happened.
- I did not read SKP-V0.md beyond the two `extent` lines.
- I made no run. Every figure below is my own working-out from reading.

## 1. What the VOID run evaluated (ADV-2026-11-18-20 item 4 (a), as paraphrased to me)

- The precondition loop waits only for a `describe.extent` line to be present, not for it to carry a value (line 144 of `frontends/shell/e2e/open-fills-fit-view.mjs` at E). So it ended as soon as the four items were seen.
- Line 146 printed the one precondition line (log line 5). Line 147 threw Void on the null value (log line 7: "checks recorded before it: 0").
- Lines 148 onward never ran: no settle (b), no (a), no status read (c), no screenshot (d) and no (e). The fit's `view-state` values were not printed either. No `open-fills-fit-view-*` PNG exists under `frontends/shell/e2e/out/` at E.
- **What was known:** only that the first stream reached 10,000 rows, that a fit `view-state` line arrived, and that `describe.extent` was null.
- So the rectangle below, and the change to (d)'s pixel test (§3 below), are both chosen before anything is known of the base's (d) or (e). Neither rests on the run.

## 2. Options weighed

Facts the options rest on, all at E:

- **No extent at open, by design.** `describe` always sends `not-established-at-open` with a null value: `kernel/src/skp.rs:2053`, `protocol/skp/src/v0/commands.rs:247`, `protocol/skp/SKP-V0.md:92,162`. The trace line passes that through as it is (`frontends/shell/src/diagnostics/renderTrace.ts:19-21`). The precondition's third item can never be met in v0.
- **Correction to the brief's locator.** The fit is not made from the union of the first look. The one-shot auto-fit fires on the first batch that carries geometry (`frontends/shell/src/canvas/WorkingCanvas.tsx:1784-1791`). It fits that extent with a 10% margin on the tighter axis (`frontends/shell/src/canvas/extent.ts:126-149`). The union taken at the first look's terminal is the grid frame's anchor (`frontends/shell/src/canvas/tileGrid.ts:20-45`, `frontends/shell/src/residency/candidateArmSession.ts:1224-1249`). That union is logged only to the persisted session log (`candidate-grid-frame-established`, observedUnion), never to the console.
- **The fixture's layout.**
  - `engine/src/fixture.rs:67-68,93,1404-1412` and `:1419`: 317 columns of 40 m cells from E 2,600,000 and N 1,200,000, in id order. Each ring has a radius of at most 0.42 of a cell.
  - The first 10,000 rows lie below N 1,201,280 (the script's `FIRST_LOOK_YMAX`, lines 44-45).
  - `frontends/shell/e2e/layout.mjs:412-419` declares `PARCEL_AREA` {2,600,000, 1,200,000, 2,612,680, 1,212,600}, the 315 full rows, as an e2e-local value read from the generator. Line 441 uses it for "wholly inside".
  - The fixture's sha256 is fd0c74ab…ddfb49 (`state/consults/2026-11-18-open-first-look-fills-fit-view-s1-s2-worker-report.md:8`, on main).
- **What the fit view should show (my working-out).**
  - The fit is width-limited, because the first batch spans every column whenever it holds 317 rows or more. The view is then about 15,850 m wide. Its centre lies inside the first batch's rows, so the south half of the canvas is off-data.
  - The data the fit view shows is the band north of the dataset's south edge, up to the view's top edge. For an h/w around 0.75, the top edge is about 5.9 km above the centre.
  - In the 8×8 grid, columns 0 and 7 include the side margins, so they never qualify. Columns 1 to 6 do. Roughly two or three rows of cells lie wholly above N 1,201,280 and inside the data.

**Option 1: the fixture's bounds.**
- (1a) Read from the GeoParquet file: no Parquet reader is allowed (§11 item 12). Parsing the footer by hand is fragile. The generator's own bbox (`engine/src/fixture.rs:958-962`) is a loose outer bound that includes the partial top row. Rejected.
- (1b) The `PARCEL_AREA` constant, with the fixture's sha256 as the new third precondition item. It needs a reading of the fixture only: no product change and no new trace line.
- P-E-base under (1b): the precondition is met (log line 5 for items 1 and 2; report line 8 for the hash). (a) and (c) fail as predicted. (d) fails on the blank band above the first look's rows. (e) holds on those same cells. I2 and I3 can still fire. All of this assumes §3's fix below.
- P-head under (1b): the qualifying cells are the on-data cells of the fit view. At head, (d) tests that the fill reached every 1/64 cell of the fit view that lies wholly on data. That is not every part of the fit view: the boundary cells and anything smaller than a cell are not tested. The settled complete-in-view sentence (c) carries "complete".
- Risk: if the first batch holds fewer than 317 rows, the fit lies inside the first look's rows and (e) fails, which is VOID (I2). That is safe.

**Option 2: the fit's anchor or union.**
- The `view-state` line gives only the centre and the zoom of a margin-padded fit of the first batch. It cannot recover the union, and the console carries no line of the union. Getting one needs a trace line the base lacks, which is a product change and not allowed.
- More decisively: every cell inside the first look's union is drawn at the base. So (d) passes at the base and (e) can never hold. I2 or I3 fires by construction, and at head (d) would test nothing the fill adds. Rejected.

**Option 3: no extent.** The side margins and the off-data south half are blank at head too. So (d) fails at head by construction, and P-head fails. Rejected.

**A further finding that holds under every option: (d)'s pixel test.**
- (d) counts a cell as drawn when it holds any pixel with alpha above 0 (script lines 215-216 and 227-228). It reads a composited `Page.captureScreenshot`.
- The page sets no transparent background (`frontends/shell/src/styles.css:4-14`, with `color-scheme: light dark`). The other suites' "background 0,0,0,0" is the GL buffer read by `capturePixels` (`frontends/shell/e2e/colour.mjs:124`), and E-FL may not call that hook (§11 item 10). The script's own header expects this case (lines 27-28).
- So by reading, alpha is 255 everywhere. (d) would then pass at the base, and I3 would fire whatever rectangle is used.
- The script already computes a background-colour rule on every run, as a report that decides nothing (lines 202-207 and 217-218: the commonest colour on the outer ring, 8 per channel). In the fit view the ring is mostly side margin and off-data south edge, at both the base and the head.

## 3. Recommendation

- Option (1b), with (d)'s and (e)'s "blank" taken from the background-colour rule, and alpha kept as a report only.
- Both are chosen before the base's (d) and (e) are known (§1 above).
- No prediction changes. P-E-base, I2 and I3 keep their words.

## 4. Draft of Amendment 2

> ## Amendment 2 — step S4 stopped on I2: E-FL's precondition named a value `describe` never sends; the rectangle (d) and (e) read, and (d)'s blank test, replaced before the base's (d) and (e) were evaluated
>
> *Written by the custodian, `<date -u>`, by the advisor's ruling ADV-2026-11-18-`<nn>`, from the architect's draft `state/consults/2026-11-18-open-first-look-fills-fit-view-e-fl-extent-amendment-2-draft-architect.md`. Authority: that ruling. The reuse index, byte-copied from the custodian's brief and marked so, missed: `node tools/reuse.mjs end-to-end screenshot check that the fit view is filled within the dataset bounds` (exit 1), run in the read-only clone at 89bbac3. It changes no prediction, no invalidator's words and no product file.*
>
> 1. **The stop.** E-FL ran once at the base, on the measure build of B, at E = ff3c1465eea3724c3840485febb2a5da05765623. It exited 2 (VOID, I2) at line 147 of `frontends/shell/e2e/open-fills-fit-view.mjs` at E: the precondition's third item is unmet in v0 by design (`kernel/src/skp.rs:2053` at E; `protocol/skp/SKP-V0.md:92` at E). Lines 148 onward did not run, so nothing of (a) to (e) was evaluated. The log is `<S>/fl1-efl-base.log` (413 bytes, sha256 23c1bb4ddb38b2d121099dd670d9401fd8c5cc27cefd928e5ffc4c315c1a71ea), filed as `<tracked path, OPEN-A2-7>`; it is evidence, not Authority.
> 2. **§4 E-FL, the precondition's third item, replaced:** the fixture file's sha256 equals fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49 (`state/consults/2026-11-18-open-first-look-fills-fit-view-s1-s2-worker-report.md:8`); else VOID. The `describe.extent` line is printed and decides nothing.
> 3. **§4 E-FL (d), the first sub-item's rectangle, replaced:** the fixture's parcel area in EPSG:2056 metres, {2,600,000, 1,200,000, 2,612,680, 1,212,600}. It is an e2e-local value restated from the generator (`engine/src/fixture.rs:67-68,93,1404-1412` at E), as `frontends/shell/e2e/layout.mjs:419` at E restates it. It is valid only under item 2's hash.
> 4. **§4 E-FL (d), the second sub-item, and (e)'s "blank", replaced:** a qualifying cell is blank when none of its pixels differs from the ring background B (the commonest RGB on the image's outer ring) by more than 8 on any channel. This is the rule at lines 202-207 and 217-218 of `frontends/shell/e2e/open-fills-fit-view.mjs` at E, which now decides. The alpha reading is printed and decides nothing. The tolerance of 8 is declared here, before any (d) was evaluated.
> 5. **§3, the second "may be claimed" item, read as:** on `100k-happy-path.parquet` at the shipped default arm and level, with no input after the open, every cell of an 8×8 grid over the fit view that lies wholly inside the fixture's parcel area holds a pixel unlike the map's background, and the status shows the complete-in-view sentence at the settle (E-FL). The fill of any part of the fit view smaller than one such cell, or on its edge, is not claimed beyond (c).
> 6. **Unchanged:** §4's launch, (a), (b), (c), the exits and M-E-FL; §5's P-E-base, P-head, I2 and I3 in their words. I2 now also reaches a hash mismatch, through item 2.
> 7. **The test commit E'.** On the branch, before any change commit, the script only. Its ceiling: at most 40 lines in `git diff --numstat E E'`, and the file within §7's 380 against the base. `package.json` is not edited. E' is named by its commit id, and no span of it is hash-pinned.
> 8. **The re-run.** E-FL once at the base, at E', in a shared hold, with `--measure-build D:/wt-targets/fl/release/spatial-ide-shell.exe`. The build stands if its sha256 equals d8309b1ecc1906d597a07e9a04d1d17ed57da3a07dc88472a6189bbc541148d9 at the run and `git diff --name-only B E'` names no path outside `frontends/shell/e2e/` and `frontends/shell/package.json`. Otherwise it is rebuilt at E'. P-E-base is read from that run. Amendment 1 item 3 (a)'s two base suite runs go in the same hold if they have not yet been recorded.
> 9. **The record.** This stop's closing line: `S4 stopped on I2 at <run end, from the run's transcript or the log's mtime, date -u>: E-FL VOID at E (exit 2), precondition item 3 unmet by design; resumed under Amendment 2.`
>
> Read the last amendment first.
>
> Nothing above is edited.

(Item 5 rewords §3. That sentence is the architect's drafted form text, not the human's wording, so under §31 it is applied with no re-gate and the PR body lists it. Each clause checked:
- "no input after the open": the script makes no input call (lines 120-133 of `frontends/shell/e2e/open-fills-fit-view.mjs` at E).
- "8×8 grid over the fit view": lines 184-188 and 210-222 at E map each cell from the first `view-state` line.
- "wholly inside the parcel area": line 223 with item 3's rectangle.
- "a pixel unlike the background": lines 217-218 under item 4.
- "complete-in-view sentence at the settle": lines 151-174 at E.)

## 5. OPEN items for the advisor

- **OPEN-A2-1, the rectangle.**
  - (A) `PARCEL_AREA` with the fixture's hash as precondition item 3.
  - (B) Read it from the file.
  - (C) The fit's anchor.
  - (D) No extent.
  - Recommend (A). (B) needs a reader; (C) and (D) defeat P-E-base or P-head by construction.
- **OPEN-A2-2, (d)'s blank test.**
  - (A) The ring-background colour rule, tolerance 8.
  - (B) Keep alpha: I3 is likely at the base, by reading.
  - (C) A devtools background override: unreliable under `color-scheme: light dark`.
  - Recommend (A).
- **OPEN-A2-3, §3's second claim.** Narrowed as item 5 words it, or kept. Recommend narrowed: E-FL shows 1/64-cell coverage of the on-data part of the fit view plus (c), not "fills" without qualification. As unqualified words, it would be a claim the evidence does not support.
- **OPEN-A2-4, §11 item 11.** Is it engaged? Recommend not: no prediction or tolerance was evaluated before the change (§1 above). The advisor rules.
- **OPEN-A2-5, the build.** Does it stand on item 8's two checks? Recommend yes. The custodian supplies the S4 report's build provenance first: whether it was built at B or at E.
- **OPEN-A2-6, Amendment 1 item 3's base runs of FIND' and PC-E4.** Their status is unknown to me. Recommend they go in the re-run's hold if they are not recorded.
- **OPEN-A2-7, the log.** File its bytes under a tracked path, so that the record's evidence is tracked. Recommend yes.

Residual risk, not blocking: (e)'s `FIRST_LOOK_YMAX` assumes the first look returns rows in file order (script lines 19-21 at E). By reading, a drawn first look can only make attribution more conservative: a cell that is blank at the base was not drawn, whatever the order.
