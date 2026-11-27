# The advisor's ruling ADV-2026-11-27-28, under the human's delegation of 2026-11-13, not the human's words: shell-scale-display's words: S-1 to S-4 without the mark, KNOWN-LIMITATIONS item 80 and Part AI; the e2e README's entry stays; a form amendment, then one words commit

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-27-28.md in the advisory folder, 11056 bytes, sha256 6bb0db13d2fed4b4540cca403d0659b4fb602596b28e717e270ce976b25dd202, UTF-8, last modified at 2026-11-27T12:46:56Z by the file system. It was named by a session message received before 2026-11-27T12:47:31Z (date -u, taken after it was copied). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-27-28, to the custodian, 2026-11-27 (12:47Z). `shell-scale-display`: the words of S-1 to S-4, of KNOWN-LIMITATIONS item 80 and of the walkthrough's Part AI, from the text at 9f8b67cd. It is the ruling ADV-2026-11-23-19 item 6, ADV-2026-11-23-24 items 3 and 5 and ADV-2026-11-27-25 item 5 owe. Places (ii) and (iii) of Amendment 11 item 5 are settled here.

Read by me at 9f8b67cd: `scaleBar.ts` whole; `ScaleItem` and the slot in the piece's diff; the piece's diff of KNOWN-LIMITATIONS, the walkthrough and the e2e README; in `App.tsx` the place that empties the view-box store at each open and the three places that write it; in `WorkingCanvas.tsx` the four places that report a view; the unit classes in `engine/src/geoparquet.rs`; `engine/src/fixture.rs` line 93 and `e2e/pan-anchor.mjs` lines 47 to 50; the walkthrough's rows for the three fixtures (lines 146, 240, 1478); the title of limitation 11. On main: the form's §2, §3, §8 and §9, Amendment 2 items 8 and 9, Amendment 4 items 3 and 13. Not read: the tests, `layout.mjs`, `styles.css`, the auto-fit's trigger and `applyView`'s body (for those two I rest on the form gate's clause check in Amendment 2 item 9), and the generator of `filter-zoned.parquet`.

1. **The four strings. The mark comes off them.** In `scaleBar.ts` the `MARK` constant and its four uses go.

````text
S-1: {L} m (CRS)
S-2: The bar spans {L} m on the map at the current zoom, as the dataset's CRS counts metres. It is not a distance on the ground.
S-3: No scale bar: this dataset's coordinates are not known to be in metres.
S-4: No scale bar at this zoom.
````

   - S-1, S-3 and S-4 are the form's drafts. S-1's form was ruled in ADV-2026-11-23-19 item 2.
   - S-2 is mine. The draft read "1 metres" at a length of 1.
   - Each clause, against the code: the bar's width is the length times the CSS pixels one unit spans; a bar is shown only for the unit `metre`; S-3 is shown for every other unit, which are degree, another name and a unit not established; S-4 is shown exactly when the length would lie outside 0.001 to 50,000,000.
   - The doc comment above the strings, wrapped as that file's lines are:

````text
Old: All four are drafts under the P6 placeholder mark: none is the human's wording and none is the advisor's yet.
New: All four are the advisor's wording under the human's delegation of 2026-11-13 (ADV-2026-11-27-28), not the human's; the human sees them in row AI4 of the walkthrough's Part AI.
````

   - A test or an e2e step that holds one of the old texts takes the new one. No assertion changes its meaning.

2. **KNOWN-LIMITATIONS item 80.** The title and the paragraph, without the mark:

````text
80. **The scale bar shows a length in the dataset's own metres, not a distance on the ground, and only for a dataset in metres.**
    When the dataset's CRS names the metre on both axes, the status bar shows a bar and the length it spans on the map at the current zoom: 1, 2 or 5 times a power of ten metres, as the CRS counts them. A metre of a projected CRS is not a metre on the ground: the two differ by an amount that depends on the projection and the place, and the app does not compute it (item 11). The bar appears once the map has drawn the first of the dataset's features, a reopened project has restored its saved view, or you have moved the map. For a dataset in degrees, in another unit, or whose unit is not established, no bar is shown, and from that same moment the status bar says so. Where the length would be below 0.001 or above 50,000,000 metres, no bar is shown, and the status bar says that there is none at this zoom. The bar's length has been checked on a display at 100% scaling only.
````

   - Its comment, two spans. The rest of the comment stays.

````text
Old: A draft under the P6 placeholder mark (governance/forms/frontends/SHELL-SCALE-DISPLAY-PREREGISTRATION.md §2 item 8, with the two sentences Amendment 2 item 9 replaces; ADV-2026-11-23-19 item 6, ADV-2026-11-27-21 item 8): the architect's drafted words, neither the human's nor the advisor's yet; the advisor words them from the filed text.
New: The advisor's wording under the human's delegation of 2026-11-13 (state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md, items 2 and 3), not the human's words, ruled in ADV-2026-11-27-28 from the form's draft (governance/forms/frontends/SHELL-SCALE-DISPLAY-PREREGISTRATION.md §2 item 8, with the two sentences Amendment 2 item 9 replaces).

Old: The last sentence stands only if E-SCALE records devicePixelRatio 1 (form §2 item 8); no run of E-SCALE has been made at this commit.
New: The last sentence stands on E-SCALE's record of a devicePixelRatio of 1 (form §2 item 8).
````

   - The last sentence of the paragraph stays under the form's condition. If the tester's record is not 1, it comes to me before the run part's verdict.
   - The word "ground" stands in a limitation, not in a string the app shows. §8 item 4, as Amendment 2 item 8 has it, does not block on it.

3. **Part AI.** The heading stays. Below it, in place of the lead-in, the Before line, the table and the result log:

````text
This Part is the Operator gate of `governance/forms/frontends/SHELL-SCALE-DISPLAY-PREREGISTRATION.md` §9, run only on a build with that piece merged, with a blank result log. **No duration appears in any row or expected outcome** (`docs/08_Testing.md`; ADR-018). The rows and the four strings they show are the advisor's wording under the human's delegation of 2026-11-13 (ADV-2026-11-27-28), not the human's; row AI4 is the human's sight of the strings. This Part is run on Windows.

**Before AI1 to AI5:** a dev build started with `npm run tauri dev` (the Prerequisites), with no dataset open; the fixtures `filter-zoned.parquet` and `100k-happy-path.parquet`, each with its row in a fixtures table above; and compat-corpus file #8, whose path and sha256 are in the fixtures table of Part P (crs-unit-fact-and-bounds).

| # | Step | Expected outcome |
|---|---|---|
| AI0 | Read the form's §10, the last amendment first. | Record the number of the last amendment you read. |
| AI1 | Open `filter-zoned.parquet`. When its features have appeared, zoom in and out with the wheel, several notches each way, and rest the pointer on the bar in the status bar. | The status bar shows a bar and a label of the form `200 m (CRS)`. As you zoom, the length steps through 1, 2 and 5 times a power of ten, and the bar stays between about 60 and 150 pixels long. Resting the pointer on it shows its title. **Felt:** is it clear that this is a length in the CRS's metres and not a distance on the ground? |
| AI2 | Open compat-corpus file #8 (`C:\dev\spatial-ide\target\fixtures\compat-corpus\gdal\ogr2ogr-epsg4326-default.parquet`). | When its features have appeared, the status bar reads "No scale bar: this dataset's coordinates are not known to be in metres." and shows no bar. |
| AI3 | Open `100k-happy-path.parquet` and set the app's window to 1366 × 768. | The scale is whole and readable in the status bar, beside the other items the status bar shows then. Record which items those were. |
| AI4 | The P6 sight of the four strings. The label and the title are in AI1, and the line for a dataset not in metres is in AI2. The fourth takes the bar's place far outside ordinary zooms, and reads: "No scale bar at this zoom." | For each string, the log records the wording you want in its place, or "keep". None of them is the human's wording. |
| AI5 | At your own display scaling (record the percentage Windows shows for Scale), open `100k-happy-path.parquet` and zoom with the wheel until the label reads `200 m (CRS)`. If one more notch inwards still reads `200 m (CRS)`, stay on that notch, where the bar is longer. Mark the bar's two ends on the edge of a sheet of paper held to the screen, lay the marks across the map along a row of parcels, and count the parcels between them. The parcels are 40 m apart (`frontends/shell/e2e/pan-anchor.mjs:47-50`; `engine/src/fixture.rs:93`), so the marks are five parcels apart, within half a parcel. | Record the percentage and the count. Red: fewer than four and a half or more than five and a half. A red result stops here and goes to the advisor (the form's I7). |

## Result log

Fill in after running the rows above (the shell-scale-display Part AI).

- **Date run:**
- **Run by:**
- **Build/commit:**
- **Last amendment read (its number):**
- **AI1 (the lengths the steps showed; whether the title showed; felt):**
- **AI2 (what the status bar read, and whether a bar showed):**
- **AI3 (whether the scale was whole and readable; the other items showing):**
- **AI4 (for each string: the wording you want in its place, or "keep"):**
- **AI5 (the display scaling percentage; the count of parcels between the marks):**
````

   - **Place (ii).** The lead-in and the Before line are these. The worker's Before line put `filter-zoned.parquet` with Part A; its row is the one that names E1 to E4. AI2's path stays: it is the path the walkthrough's own tables give.
   - **Place (iii).** Row AI5 carries no cite into the walkthrough itself. The Before line names the fixture.
   - **The instruction ADV-2026-11-23-24 item 3 added** is AI5's second sentence. By the form's own figures (Amendment 4 item 3: a band one zoom unit wide, a notch of about 0.93), a wheel notch moves the zoom by nearly the whole band in which the label reads 200 m, so the operator cannot choose the bar's length freely. Of two notches inside the band, the inner one has the longer bar.
   - **AI3 narrows the form's sketch,** which had "with every status item showing". By the e2e README's own account of E-FLOOR, the product has no path that fills the status bar, so an operator cannot bring every item up. The row records which items showed. Recorded in the form as class 5 on this ruling. E-SCALE's assertion that the item lies inside the status bar is unchanged.
   - **AI1 rests on `filter-zoned.parquet` being a dataset in metres.** The reviewer's read part confirms it from the fixture's generator. If it is not, AI1 opens `100k-happy-path.parquet` in its place, and you tell me.

4. **The e2e README's entry for E-SCALE** stays as the worker wrote it. It describes the step, and the reviewer's read part reads each clause of it against `layout.mjs`. I rule no word of it.

5. **The commits.** A form amendment first, carrying this ruling by reference and item 3's class 5. Then one words commit that holds items 1 to 3 and nothing else. It comes after the correction commit of ADV-2026-11-27-25 and before the gates' read parts, with the suites that start no app green at its head.

6. **At the merge check** I compare S-1 to S-4, item 80 with its two comment spans and Part AI with this file, byte for byte.

7. Nothing here is reserved. For the human, in the digest: the four strings, limitation 80 and Part AI are the advisor's words, and row AI4 is where they see the strings.
