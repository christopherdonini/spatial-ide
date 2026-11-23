*Filed by the custodian: the architect's draft of the sitting's new step for PR 358's case (KNOWN-LIMITATIONS.md item 68), node:operator-sitting-queue@sitting-step-mint-window-architect-1, asked for by ADV-2026-11-23-01 item 2 (`state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-01-the-humans-four-lines-in-force-the-sitting-step-the-2026-11-16-directive-to-the-tag-the-spend-limit.md`) and dispatched at 2026-11-23T03:46:45Z; read at main 4fa8070fbb44bbc6d9e349375d0d13b66e66dd14 in the detached read worktree C:/dev/wt/read-1122, with nothing run and no launch; its run: Grep 29, Read 26, Glob 2, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-23T03:46:51Z to 2026-11-23T03:58:13Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 13059 bytes, sha256 397f0b40de9673866955d9bc9fdd5f441fb37e3d6d2101696de4ca2466482697, byte for byte, nothing masked, with one final newline added. It is a draft and not yet words of the sitting script: by that item it goes to the advisor for its words first. None of it is the human's wording or the advisor's. Its verdict is REACHABLE ONLY SOMETIMES, and its step changes the order of the human's line 2 (filed as `state/directives/2026-11-23-the-humans-four-lines-typed-in-the-advisors-session-adv-22-40-stands-pr-358-at-the-sitting-the-2026-11-16-directive-to-the-tag-pr-356-after-the-tag.md`): the filter's own load, then a Clear, then one wheel notch out. What of that goes to the human is the advisor's to decide, before the sitting.*

---

**REACHABLE ONLY SOMETIMES.** A try meets the fault only by chance, and a hand cannot aim at it. The order the human wrote (open the file, filter at once) reaches item 68 only in a narrower case, so I changed the order. You need to bring that change to the human.

Read at `C:/dev/wt/read-1122` @ 4fa8070fbb44bbc6d9e349375d0d13b66e66dd14 (detached). I used Read, Grep and Glob only. I ran nothing, launched nothing and computed no hashes. Every path:line below is a reading aid at 4fa8070f unless it names another commit. None of the step's text is the human's wording, and none is the advisor's. Text in quotation marks or backticks is copied byte for byte from the file named beside it. Everything else is my own words.

**Why only by chance.** On main an earlier look stays "current" from the reissue until the new look's ticket and attach return.
- The handle is assigned only after `viewportQuery` and `dataPlaneAttach` (`frontends/shell/src/residency/candidateArmSession.ts:1304-1322`). `reissueUnrestricted` does not clear it (`:1718-1786`).
- The fault needs the earlier look's Completed terminal to land inside that wait. PR 358's form itself says the window needs timing inside one request round trip (`governance/forms/frontends/UNTILED-REISSUE-MINT-WINDOW-PREREGISTRATION.md:43`, `:239`).
- How long the window lasts is not examined (KNOWN-LIMITATIONS item 68's comment, `KNOWN-LIMITATIONS.md:531`).

**Why the human's order is narrower.**
- Right after an open there is no grid frame yet. The reissue sets `latestUnionedExtent = null` (`candidateArmSession.ts:1758`). So the open's terminal plans only if the open's own batches also arrive inside the window, because the frame is set from that extent (`:1429-1430`, `:1234-1235`), and the plan needs `manager.gridFrame !== null` (`:1508`).
- Item 68's comment states this case: an Apply made while the open's own first load is running does not raise the fault when no batch of the open's look arrives inside the moment (`KNOWN-LIMITATIONS.md:531`).
- The open's first look reads at most 10,000 rows (`frontends/shell/src/canvas/tileGridConstants.ts:185`). I have not measured whether a filter can even be typed before that load ends.
- So in the step, the "previous load" is the filter's own slow load, and the "change" is a Clear. This is the order PR 358's tests use (`§4` common setup, form at `C:/dev/wt/mint` @ 7a3fd37b22bd43ab48fba8aa465fc7bf1b1cb2fd, lines 132-135).
- When the open's end arrives after the filter's ticket instead, a separate effect on the grid frame follows (form Amendment 1 item 2.1 (i); OPEN-9 at `:608`: only the cells' size and position change). The step does not try to show it.

**1. The largest file.** `slow-filter-scan.parquet`:
- 4,000,000 rows: `const FEATURES: usize = 4_000_000` (`kernel/tests/manual_walkthrough_fixtures.rs:714`, used at `:719`).
- 766,186,557 bytes, by your `ls -l` listing of 2026-11-23T03:46:13Z, which is the only source for sizes.
- The next largest are 100,000 rows (`:49`, `:119`) at 39,013,967 and 29,933,646 bytes.
- It is a sitting fixture by block (iii)'s Have ready line (`state/drafts/sitting-script-2026-11-24.md:219`). Section 1's command makes it (`:8`).
- No fixtures list is on record yet. ADV-2026-11-21-27 item 2's list is owed by 2026-11-23 18:00Z.
- `100k-scratch-partN.parquet` has no generator line.
- Outside that folder and your listing:
  - Part H's 5 GB fixture is bigger by size. It is R1's alone, and Part L's note says a 5 GB fill cannot complete (`sitting-script-2026-11-24.md:778-781`).
  - `polygons-100k.parquet` (`:218`).

**2. The actions.**
- Open the file.
- Apply the filter `id > 3999900`. This is the generator's late-matching shape, `id > <FEATURES - 100>` (`manual_walkthrough_fixtures.rs:659`). It matches 99 rows, and because the file is one row group (`:726`) the whole file has to be scanned.
- While that load still runs, press Clear. Clear is never disabled; Apply is disabled while busy (`frontends/shell/src/filter/FilterPanel.tsx:111`, `:114`).
- How wide the view must be: no view made by hand shows the case. The case shows in the view the app fits itself to after the Clear. Any pan, zoom or resize before the reading asks for the view's tiles and ends the case: `onViewportChanged` → `handleViewportChange` → plan (`candidateArmSession.ts:1703-1708`, `:1537-1564`). Item 68 says the same ("it asks for them at your next pan or zoom", `KNOWN-LIMITATIONS.md:530`).
- So the wide view the human asked for comes last, as one wheel notch out. In the fault case that notch fills the empty area, which confirms it.
- Why it must not go far out: by my reading of the generator, the file is a grid 2,000 parcels wide (`engine/src/fixture.rs:1405-1406`). Near the whole file, the render budget and the covering bound leave areas empty under their own sentences, which are not item 68.

**3. Telling whether the Clear went in before the filter's load ended.**
- On screen: a load's data arrives before its end. If the map is still empty at the Clear (the filter's 99 parcels not yet drawn), the Clear went in before that load ended. Parcels in view do not prove that it had ended.
- In the session log, decisively, by reading and not run. The log is `%LOCALAPPDATA%\dev.spatialide.shell\logs\session-*.log`:
  - the folder: `app_log_dir` (`frontends/shell/src-tauri/src/lib.rs:326-330`), the identifier (`tauri.conf.json:5`), and a recorded path (`frontends/shell/MANUAL-WALKTHROUGH.md:1438`);
  - the line form: `<unix-ms> <level> <message>` (`state.rs:58`).
- What the lines mean, using `candidate-untiled-terminal` (`candidateArmSession.ts:1401`), the `superseded -- a later generation is already current, no accounting` suffix (`:1404`), and `candidate-first-look-view-planned` (`:1509`):
  - The suffix on either load's line: the Clear went in before the filter's load ended, but that load ended after the Clear's ticket. The step shows nothing.
  - No suffix, and a planned line after the last terminal line: the filter's load had ended before the Clear. It shows nothing.
  - No suffix and no planned line: the fault. The earlier end planned under the new filter (`:1497-1511`), which set `hasPlanned`, so the Clear's own end took S1's branch and planned nothing (`:1472-1474`).
- The step says outright that it shows nothing in the first two cases.

**4. What is seen.**
- Met: the Clear's view holds only the first look's parcels. Those are at most 10,000 rows, which by the generator are the bottom five rows of the grid. The map above that band stays empty, and the status line can read `Showing all ${status.residentFeatureCount} features in view` (`frontends/shell/src/residency/residencyStatus.ts:487`).
- Not met: parcels appear above the band as well.
- The band's thickness on screen depends on the fit to the first batch, whose size I did not read.

**5.** The step proves nothing either way about how often a user meets the fault. It also cannot prove the fault absent: a miss is the expected result of a try.

**Needs:** nothing beyond section 1, plus Notepad and File Explorer. Nothing is compiled.

**Time (my estimate, not measured):** about 15 minutes. That is the open (its full-file id check of 4,000,000 rows, unmeasured) and about five tries of 2 minutes each.

**Placement:** the advisor's choice. A block of its own of about 15 minutes in section 2's table would fit.

```markdown
## Step 68 — a filter change made while the previous data load is finishing (KNOWN-LIMITATIONS item 68; PR 358's fix is not in this build)

This build is main's, without PR 358, so the step tries item 68's fault as main has it. The fault needs the filter's data load to end after you press Clear but before the app has set up the Clear's own load, which takes one request to the engine and back. No hand can aim at a moment that short: a try meets it only by chance, and most tries show nothing. A try that shows nothing says nothing about whether the fault is there, and no result of this step says how often a user meets it. **From 68b to 68e, do not touch the map, the panels or the window size:** a pan, a zoom or a resize asks for the view again and ends the case. Press Clear once per try.

**Have ready.** `slow-filter-scan.parquet` (4,000,000 parcels, the largest file in `target\fixtures\manual-walkthrough\`), made by section 1's fixture command. The app started as section 1 says. File Explorer and Notepad, for the session log in `%LOCALAPPDATA%\dev.spatialide.shell\logs\`.

| # | Step | Expected outcome |
|---|---|---|
| 68a | Click **Open GeoParquet…** and open `slow-filter-scan.parquet`. Wait until the map stops changing. | The map shows parcels. The open can take a while: the app checks every id in the file first. |
| 68b | In the Filter section, type `id > 3999900` and press **Apply**. Watch the map. Do not press Cancel. | The map empties. While it stays empty, this filter's first data load has not ended. After a moment the map moves to one short row of parcels at the top right of the data (99 parcels). On the first try, let them appear and note roughly how long they took. Then press Clear and go on to 68c; that try is practice and shows nothing. |
| 68c | On each later try: after 68b's Apply, press **Clear** just before the moment you expect the 99 parcels to appear. Then wait, hands off, until the map holds still. | Note whether the map was still empty when you pressed Clear. The map then moves to the bottom edge of the data, where the file's first parcels are. |
| 68d | Look at the map and the status line, still with no pan or zoom. | **If the fault was met:** parcels lie only in a thin band along the bottom edge of the data (the file's first 10,000 parcels, five rows of the grid; at this zoom the band can be as thin as a line). The map above the band stays empty, although the file has parcels there. The status line can read `Showing all`, a number, and `features in view`. **If it was not met:** parcels appear above the band too, at least near the middle of the view. |
| 68e | In File Explorer, open the newest `session-….log` in that folder with Notepad. Press Ctrl+End. Use Find, direction Up, for `candidate-untiled-terminal`, twice: those two lines are the ends of 68b's and 68c's loads. Then search down from the lower of the two for `candidate-first-look-view-planned`. | **(1)** Either line contains `superseded`: the Clear went in before the filter's load ended, but that load ended after the Clear's own was set up. Not met; the try shows nothing. **(2)** Neither contains it, and a `candidate-first-look-view-planned` line comes after the lower one: the filter's load had ended before you pressed Clear. Not met; the try shows nothing. **(3)** Neither contains it, and no `candidate-first-look-view-planned` line comes after the lower one: the fault was met. |
| 68f | The wide view: scroll out by one wheel notch at the map's centre, and wait. | This zoom asks for the view's tiles, so the case ends here either way. If the fault was met, the empty area above the band now fills; if not, it was filled already. Do not scroll far out: near the whole file, the render budget leaves areas empty in its own words, which are not item 68's. |

68b to 68f is one try. Make as many tries as the step's minutes allow; after 68f, the next try starts again at 68b.

**Questions.**
1. For each try: 68e's outcome (1, 2 or 3); whether the map was empty when you pressed Clear; and whether 68d showed the band alone with the map empty above it.
2. Overall: met in a try / not met in N tries. Not met does not show the fault absent, and neither answer says how often a user meets it.
```

**Files read**
- `C:/dev/wt/read-1122/KNOWN-LIMITATIONS.md` (items 66 to 73)
- `C:/dev/wt/mint/governance/forms/frontends/UNTILED-REISSUE-MINT-WINDOW-PREREGISTRATION.md` @ 7a3fd37b (§0 to §12, Amendment 1, the start of Amendment 2); main's copy checked at `:43`, `:239`, `:446`, `:608`
- `C:/dev/wt/read-1122/frontends/shell/src/residency/candidateArmSession.ts`
- `C:/dev/wt/read-1122/frontends/shell/src/residency/residencyStatus.ts`
- `C:/dev/wt/read-1122/frontends/shell/src/App.tsx`
- `C:/dev/wt/read-1122/frontends/shell/src/canvas/WorkingCanvas.tsx`
- `C:/dev/wt/read-1122/frontends/shell/src/canvas/tileGridConstants.ts`
- `C:/dev/wt/read-1122/frontends/shell/src/filter/FilterPanel.tsx`
- `C:/dev/wt/read-1122/frontends/shell/src/diagnostics/log.ts`
- `C:/dev/wt/read-1122/frontends/shell/src-tauri/src/state.rs`
- `C:/dev/wt/read-1122/frontends/shell/src-tauri/src/commands.rs`
- `C:/dev/wt/read-1122/frontends/shell/src-tauri/src/lib.rs`
- `C:/dev/wt/read-1122/frontends/shell/src-tauri/tauri.conf.json`
- `C:/dev/wt/read-1122/engine/src/predicate.rs`
- `C:/dev/wt/read-1122/engine/src/fixture.rs`
- `C:/dev/wt/read-1122/kernel/tests/manual_walkthrough_fixtures.rs`
- `C:/dev/wt/read-1122/state/drafts/sitting-script-2026-11-24.md` (§1, §2, §3 blocks (i), (iii), (iv), (vi), tasks 4 and 5, §5 Parts A, L and V)
- `C:/dev/wt/read-1122/frontends/shell/MANUAL-WALKTHROUGH.md` (one line, by search)

Model: claude-opus-5-5
