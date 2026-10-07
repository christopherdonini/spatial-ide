# O-07 — the parcel walkthrough on Map Studio v7 (script and notes, 2026-10-05)

*Fable, 2026-10-05, for Chris. About one hour. It is the walkthrough the design notebook defines (`state/drafts/design/SPATIAL-IDE-DESIGN-NOTEBOOK.md`, §12, "Next human test"). Your notes are the input to the minimum-shell migration plan, which I write within a day of receiving them. The prototype's labels below were read from the file itself.*

## Before you start (5 minutes)

- **Open** `C:\dev\spatial-ide\state\drafts\design\map-studio-v7-codex.html` in a browser. It is a mock: no kernel, no file reads, no writes.
- **Choose the frame** "Laptop 1366 × 768" at the top. Do the whole run at that size.
- **Keep this file open** beside it and type into the notes tables as you go.
- **Say what you expect before each action,** then do it. The gap between the two is what I need.
- **Do not judge the simulated features.** A step works if you knew what would happen and where to look. It fails if you hesitated, assumed the wrong scope, or the wording misled you.
- **One known defect to ignore:** feature-search counts leak into the other search modes.

**The tags on each step** say where the capability stands, so that a problem lands in the right place:

| Tag | Meaning |
|---|---|
| **today** | The product does this now. A problem here is a migration requirement. |
| **B1** | Arrives with B1's shell half (attributes, categorical style, table). |
| **B2** | Arrives with B2 (Save, Prepare, workspace history). |
| **later** | Not planned for the minimum shell. Note the idea, not the polish. |

## The steps

### 1. Orient, without touching anything (3 min) — today
- **Do:** name aloud what each region is for: the top bar and search, Layers on the left, the map, the Inspector on the right, the bottom panel (Console, Problems, Jobs, Table).
- **Watch for:** any region whose job you cannot name, and anything you expected to see and do not.

### 2. Open the Bern delivery (3 min) — today
- **Do:** press Ctrl+K, type `/open`, choose "Open dataset…", then "Open sample".
- **Then:** find the source's facts in the Inspector's Layer tab: its name, its CRS, its feature IDs and its verification state.
- **Watch for:** whether "source session" means anything to you; whether the facts are where you looked first; whether "Reference" as a verification state is clear.

### 3. Filter to W1 parcels above 1,000 m² (8 min) — today
- **Do:** Ctrl+K, type `/filter zone = W1` and accept the completion. Then `/filter area_m2 > 1000`.
- **Then:** find the two clauses in the Inspector, read the "shown" count under Layers, and switch one clause off and on.
- **Watch for:** the moment between Tab (completes) and Enter (applies); whether you knew the two clauses combine with AND; whether the two read as one filter on the layer; any trouble with the quotes around W1.

### 4. Make a selection on purpose (6 min) — later
- **Do:** switch the map tool from Navigate to Select. Pick "Replace" and click five parcels. Try "Add only" for one more.
- **Watch for:** whether the four modes (Add / remove, Replace, Add only, Remove only) are clear without trying them; whether you can say, at this point, how the selection differs from the filter result.

### 5. Inspect three parcels without losing the selection (8 min) — today for one inspected feature; B1 for its attributes
- **Do:** switch back to Navigate. Click one selected parcel, then one unselected parcel. Then press Ctrl+K, type `#`, and open a parcel that your filter hides.
- **Then:** open the Inspector's "Selection / feature" tab. Try Pin.
- **Watch for:** any moment you thought the selection had changed; whether blue (selected) and amber dashed (inspected) are enough to tell the two apart; the wording when the inspected parcel is hidden by the filter.

### 6. Break the scope on purpose (6 min) — later
- **Do:** with the selection still there, add `/filter area_m2 > 3000`, so that some selected parcels disappear from the map.
- **Then:** read the selection summary. Run "Zoom to selection". Open the Table and switch its Rows between "Matching layer filters" and "Selected, including filtered-out".
- **Watch for:** whether the count of hidden selected parcels is explained where you looked; whether the Table's scope is obvious before you open the dropdown. This tests your own decision that hidden selected features stay selected, with their hidden count explained.

### 7. Colour by zone (4 min) — B1
- **Do:** Ctrl+K, type `/zone`, run "Style: Colour by zone". Then press Ctrl+Z once.
- **Watch for:** where you looked for the legend; whether the style felt like a property of the layer; what you expected Ctrl+Z to undo, and what it did undo.

### 8. Read the three promises (10 min) — Publish today; Save and Prepare B2
For each of the three, say in one sentence what you expect it to promise **before** you open it. Then open it and read.
- **Save reference…** (`/save`)
- **Prepare verified copy…** (`/prepare`)
- **Publish subset…** (`/publish`)
- **Watch for:** the gap between your sentence and the dialog's. In particular: Save freezes no data; Prepare needs disk space and can be cancelled; Publish uses the layer's filters, not your selection. Mark any of these you did not expect.

### 9. The source changes under you (5 min) — today for the event; its display is held for the new shell
- **Do:** click "Simulate source change" at the top. Read the banner. Then Ctrl+K, `/reopen`.
- **Watch for:** whether the banner tells you what to do next; what you expected to happen to your filters, selection and history; whether the History panel's branches make sense or get in the way.

### 10. Laptop fit (3 min) — today
- **Do:** with the Inspector and the bottom panel both open, pan and zoom the map. Then try Ctrl+B, Ctrl+I and Ctrl+J.
- **Watch for:** whether the map is still workable at this size; which panel you would close first; whether the shortcuts are the ones you would guess.

## Notes

One row per step. Short answers are enough.

*Filled 2026-10-07 from Chris's answers, given step by step to the ideas advisor. The middle columns are Chris's observations, condensed into English with his meaning kept. The verdicts are the advisor's proposals from those answers, for Chris to confirm or overrule.*

| Step | As expected? (yes / no) | Where I hesitated | Scope I assumed wrongly | Wording to change | Verdict (keep / change / drop / later) |
|---|---|---|---|---|---|
| 1. Orient | yes | nowhere; every region was clear | none | none | **keep.** Idea: tool panels that can be hidden to give the map more room, provided finding a tool doesn't get slower (Ctrl+K covers this) |
| 2. Open | yes; found everything fast | none; it feels a bit work-in-progress | none | "Reference" needs explaining to a first-time user | **keep, change:** a plain-language explanation of "Reference" where it's shown |
| 3. Filter | yes; "it feels so good" | after applying, looked left and played with History before seeing the filter was right there | none | none | **keep, change:** toggling a clause off and on adds a History entry every time (enable, disable, enable…). The real app must not record each toggle. |
| 4. Select | yes; "the selection modes feel incredible" | none | none | none | **keep.** Chris wants it on day one, although the step is tagged "later" (see the advisor's note) |
| 5. Inspect | partly | at first: inspecting needs Navigate; in Select mode a click does both, which "might be wtf" the first time | none, once learned | none | **change:** make the two modes easier to tell apart on first use. Once learned, "it feels like having way more control" |
| 6. Scope | yes; "feels magical"; trying to break the scope just gives more control | none | none | "Matching layer filters" (his worst wording) | **keep, change:** rename "Matching layer filters" |
| 7. Colour | yes; "it's perfect" | looked left first for the style, out of QGIS habit; no big issue | none | none | **keep** |
| 8a. Save | no | which of the three to use | thought Save saves the data | the purpose of each of the three | **change:** each of the three dialogs needs a one-line purpose up front (B2) |
| 8b. Prepare | no | what a "verified copy" is | unclear | "Prepare verified copy" | **change** (B2), as 8a |
| 8c. Publish | no | how Publish differs from the other two | unclear | as 8a | **later:** Chris would push the publishing work back |
| 9. Source change | yes; the banner is good | none | none | colours are "kinda meh" | **keep, change:** the banner's colours |
| 10. Laptop fit | partly | after the first Ctrl+B the map disappeared, the bottom panel too, and only the Inspector remained | none | none | **keep the idea, change:** panel-toggle shortcuts are "really good", but each must toggle only its own panel, and nothing may ever hide the map (a v7 defect) |

## Five closing questions (7 minutes)

1. The three things the new shell must have on its first day: **filter, select and scope** ("the ones I enjoyed the most").
2. What in v7 you would drop or push later: **the publishing work.**
3. The single worst piece of wording you met: **"Matching layer filters".**
4. The one place you were most wrong about what an action applied to: **Save, Prepare and Publish.** Nothing else.
5. For your own parcel work, what is missing from the "today" steps: **table joins; rule-based colours and symbology; possibly temporal data.**

**One more observation (Chris):** the panels have little separation between their sections. Filters, style and source facts sit together in one panel; they're tiny now, but "they kinda feel thrown there like people who don't belong together".

## The advisor's reading for the plan (not Chris's notes)

- **The must-haves conflict with the tags.** Select (step 4) and scope (step 6) are tagged "later", yet Chris names them, with filter, as the three day-one essentials. The notebook says multi-selection needs its own identity and scope design. The plan should say whether that design comes in milestone 1 or immediately after it.
- **Two v7 behaviours are now requirements:**
  - History records committed changes only, so toggling a clause off and on is not a stream of entries. This matches seam 3's "a reducer log is not durable history".
  - Each panel shortcut toggles its own panel, and the map is never hidden. This matches the guardrail "keep the map mounted".
- **Sectioning the Inspector's Layer tab.** Give Source, Filter and Style headed, collapsible sections, or their own tabs, built on seam 7's registered panels and tabs.
- **Wording to decide:** "Matching layer filters"; "Reference"; the three-way purpose of Save, Prepare and Publish.
- **Later, recorded as ideas:** table joins, rule-based symbology, temporal data, and hideable tool panels.

## Chris's decisions after the walkthrough (2026-10-07)

*Settled in discussion with the ideas advisor on 2026-10-07. User-facing names and behaviour only: code and records keep their internal names (save, prepare, publish), and no ADR or wire format changes here. The main architect writes the migration plan from these decisions, and turns B2's part into B2's own preregistration.*

### 1. Six things, kept distinct

| Thing | What it keeps | Kept where | Shared with the project? |
|---|---|---|---|
| **Project** (Save project) | Your setup: which data (a live link or a snapshot), filters, style, map view, selection rules, and analysis settings (units, CRS, styles) | The project file | Yes |
| **Snapshot** | A frozen, sealed copy of the data itself | The app's protected storage | Optional, when sharing |
| **Session history** | Every undoable step of the current session, dead ends included | The project's hidden folder, until the session ends | No |
| **Lineage** | Every step that contributed to the result, data and style, from the raw data to now (§4) | The project's hidden folder, permanently | Yes, at the level you choose when sharing |
| **Preferences** | How *you* like the app: panel layout, open panels, tools shown, personal settings | Your machine | No |
| **Export interactive map** | A finished map for other people to open, without the app | Wherever you export it | It is the thing you share |

### 2. Names (user-facing labels)

- **"Save project"** (was "Save"). The dialog says, in one line: "Saves your setup (filters, style, view), not the data. Your data stays where it is." GIS users already expect a project to link to data, not contain it, as in QGIS and ArcGIS.
- **"Snapshot data"** (was "Prepare verified copy"). Chris offered "checkpoint" or "snapshot". "Snapshot" is chosen because "checkpoint" would collide with history's restore points, and it matches the project's existing reproducibility level of the same name.
- **"Export interactive map"** (was "Publish").
- Each of the three dialogs opens with a one-line purpose.

### 3. Save project has a data choice

- **Keep linked to the live file:** fast, and the default. Reopening shows the file as it is now, and the app says if it changed.
- **Freeze a snapshot:** takes time and disk space, and can be cancelled. Reopening shows exactly the same data every time.
- **"Snapshot data" also exists on its own,** for freezing data before an export or an analysis without saving the project.

### 4. Session history and lineage: one record of steps, several views

*Settled 2026-10-07, after the first version of this section. In Chris's words, the purpose is to "go from the raw data to the last snapshot", and lineage is "a history where you remove all the useless steps". This is docs/13's idea seen from the user's side: one record of steps, with three faces (§4.7).*

**4.1 Two layers**
- **Session history:** every undoable, committed step of the current session (data, scope and style), branches and dead ends included.
  - It is written to the project's hidden folder as you work, so a crash loses nothing. After a crash it is compacted at the next open.
- **Lineage:** every step that contributes to the result, data and presentation alike, from the raw data to now.
  - It is kept permanently in the project's hidden folder (like `.git`), and travels with the project.
- **Never recorded in either:** navigation (zoom, pan), panel layout and preferences.

**4.2 Compaction at Save project**
- **Each Save project appends to the lineage the steps that survive since the last save.**
  - Dead ends, reversals, clause toggles and repeated edits of the same property collapse: five colour tries leave the last one.
  - Distinct steps that each contribute stay: "hillshade, then a colour ramp, then blend them" is three steps.
- **The lineage always matches the project as saved.** Closing without saving adds nothing to it.
- **When the session ends, its history is cleared.** The next session shows the lineage of everything before, plus a fresh session history.
- **Restore:** to any lineage step from earlier sessions, and to any step of the current session.
- **Saving mid-session changes nothing you see.** The session history stays complete, dead ends and undo included, until the session ends; Save project only writes a cleaned copy of the new steps into the lineage. Within a session, history is the lineage plus the dead ends. Once the session ends, only the lineage remains.
- **A "saved here" mark** in the session history shows which steps are already in the lineage and which are new since the last save.
- **Going back after a save:** if you save, then go back to an earlier step and continue from there, the saved steps you left behind are a dead end. They leave the lineage at the next Save project, and stay in the session history until the session ends. *(This answers the migration plan's §10.9, question 6.)*
  - **Open, the advisor's suggestion:** if an export was made from the steps you left behind, the export's audit record keeps its own copy of the steps it was made from. The lineage stays clean, and the export can still say how it was made.
- **The honest limit:** a step that depends on data which has changed since can't be restored exactly, and the app says so. With a snapshot, every step stays restorable.

**4.3 Privacy follows from the design**
- Dead ends never persist, so what is stored in the project is the clean recipe, never the trial and error.
- Copying the project folder by hand carries only the lineage.
- **When sharing, you choose:**
  - no lineage;
  - the full lineage;
  - the lineage with chosen steps withheld. It then says so ("2 steps withheld") and shows a lower reproducibility level.

**4.4 What every step records** (from B2 on: plain text, one line per step, in a versioned format)
- **Intent:** the typed action and its typed parameters, with units ("colour ramp from 200 m to 3000 m", not "this colour").
- **Kind:** data, scope, style, snapshot or export. Later kinds: edit, quality.
- **Dependencies:** the fields, the CRS and the kind of data the step relies on.
- **Data identity:** the snapshot's fingerprint, or the live file's change-detection observation. It goes through a lasting dataset reference, never a session handle.
- **Parent:** so that branches can be recognised.
- **Actor:** you, an AI or a plugin.
- **Effect class,** per ADR-006: a pure transformation, a workspace mutation or an external side effect. Today's filter, scope and style steps are workspace mutations, and an export is an external side effect. Pure transformations arrive with processing steps.
- **Links to related records:** an export's audit record, the snapshot's identity, later an edit's identity. The views then join these records without copying anything.
- **Actor and links are recorded from B2 on,** even though B2 shows neither. Without them, the later views of §4.5 (AI-made steps, Exports, Edits) would need the format reworked.
- **A selection** used by a step is recorded as that step's scope. A selection by itself is not a step.
- **Snapshots are anchor steps.** The first one pins the raw data; later ones can mark milestones.

**4.5 Views over the one record**

| View | Shows | When |
|---|---|---|
| **Data lineage** | Data and scope steps: provenance | B2 |
| **Map recipe** | Every contributing step, style included | B2 |
| **Sources** (the ingredients list) | Which datasets, versions and snapshots went in, with their attribution and licence where known | B2 |
| **Exports and sharing** | What was exported or shared, when, with which scope and approval; it links to the existing publish audit log | B2 links what exists |
| **Parameters** | The knobs that "save as workflow" would expose | With workflows (Alpha) |
| **Notes** | Your narrative between steps: the lesson | With the notebook face (Alpha) |
| **AI-made steps** | Which steps an AI suggested or performed, so a reader can tell them apart from yours | When MCP and AI actions land (Alpha) |
| **Quality** | Which checks or data-doctor fixes ran, and what they found or fixed | With the data doctor (Alpha) |
| **Edits** | Which features changed, and by whom | With editing (1.0) |

**4.6 Settings: what to keep track of** (in the preferences of §5: your defaults, plus an optional per-project override)
- **Record lineage for this project:** on or off. When off, the project shows "lineage not recorded".
- **Which kinds are recorded:** for example, style steps on or off. Data and scope steps are always recorded while lineage is on, because without them the lineage means nothing. A kind that is turned off is named in every view ("style not recorded").
- **Dead ends:**
  - dropped at the end of the session (the default);
  - kept when you pin a branch before the session ends ("keep this branch"), for example to show why the old zoning wasn't used;
  - every branch kept, which makes a larger file.
- **The default sharing level:** none, full, or with steps withheld.
- **Always on, not a setting:** AI-made steps are always labelled.
- **The firm line:** you control how the lineage is kept, shown and shared, but no setting and no edit removes a step that shaped the result while still claiming completeness. A lineage with a missing step no longer reproduces the map, yet would still look as if it did. So every reduction is visible as a marker, and in the reproducibility level (docs/01, principle 8, "No black boxes").
- **Organising is always free:** naming steps, adding notes, grouping them into chapters, and collapsing kinds on screen.

**4.7 Three faces of the same record, and timing**
- **Lineage:** what happened, pinned to this data. It is B2.
- **Workflow** (the macro or script): the same steps, with the input data as a parameter. That is "apply to any data", for example "make a physical map" from any elevation raster.
  - The pinned inputs become parameters, and the user chooses which values become knobs.
  - Each step's dependencies are checked against the new data, and incompatible data is refused clearly, never silently converted.
  - An export step still asks before writing.
  - Alpha in docs/07, with the Workflow IR (docs/13).
- **Notebook** (the Jupyter-like face): the same steps as cells, with your notes between them, each showing the map at that step.
  - A changed early step marks the later ones stale, so there is no hidden state, unlike Jupyter.
  - Alpha in docs/07 ("Notebooks: record and replay").
- **The elevation-raster lesson also needs raster support,** which the product doesn't have yet. It is a real destination, and B2's format keeps the road to it open.
- **B2 builds:**
  - the session history and its crash safety;
  - compaction at Save project;
  - the lineage file with the step record of §4.4;
  - the views Data lineage, Map recipe and Sources, with Exports linked;
  - the sharing levels;
  - the settings of §4.6.
- **Not in B2:** workflows, notebooks, replay on new data, and the views marked Alpha or later. Branch pinning is for B2's form to decide (§8).

### 5. Preferences: your defaults, plus an optional per-project setup

- **Your defaults** apply to every project.
- **"Use a custom setup for this project"** overrides only the settings you change, for that project. That covers two unrelated projects that need completely different setups, as well as someone who wants the same setup everywhere.
- **Personal setup stays on your machine, per project,** and is never put in the shared project file. A colleague opening your project keeps their own setup.
- **Analysis settings belong to the project content,** because they change what the map means: units, CRS and styles.
- **Moving a panel** never marks the project as unsaved and never adds a history entry (seam 9).

### 6. Table and scope wording

- **"Rows" becomes "features".**
- **The table's scope options:**
  - **"Filtered":** the features that pass the layer's filter;
  - **"Selected":** selected features that also pass the filter, which is new;
  - **"Selected, ignoring filter":** every selected feature, including those the filter hides.
- **"Matching layer filters" is retired** (Chris's worst wording). "Ignoring filter" was chosen over "without filter", so it can't be read as "selected features that have no filter".

### 7. Milestones and other requirements for the plan

- **Milestone 2 is selection and scope,** right after milestone 1. They are among Chris's three must-haves (filter, select and scope), and need the selection identity and scope design.
- **Panel toggles:** each shortcut (Ctrl+B, Ctrl+I, Ctrl+J) toggles only its own panel, and nothing ever hides the map (walkthrough step 10).
- **The Inspector:** Source, Filter and Style get headed, collapsible sections, or their own tabs. Style may well suit a tab of its own, since Chris looked left for it, out of QGIS habit.
- **The source-change banner** keeps its content and gets better colours.
- **Inspect versus select** is made easier to tell apart on first use (walkthrough step 5).
- **The publishing work is pushed later.** Today's whole-file publish stays as it is.
- **Later, recorded as ideas:** table joins, rule-based symbology, temporal data, and hideable tool panels that keep tools quick to reach through Ctrl+K.

### 8. What §4 changes in the migration plan's §10 (for the main architect)

*`SHELL-MIGRATION-PLAN-2026-10-07.md` was written before §4 was settled. These are the places it no longer matches. The main architect decides the wording; the points marked "to judge" are questions, not rulings.*

- **§10.1 and §10.2:** the History row becomes two rows, Session history and Lineage, as in §1 above. "Five things" becomes six.
- **§10.4, "Private by default… copying the project folder by hand takes the history with it":** replaced by §4.3. Dead ends never persist, so a hand copy carries only the clean lineage, and sharing offers three levels.
- **§10.4, the entry:** extended to the step record of §4.4. The new fields are kind, parent, actor, dependencies, effect class and links. Style steps are recorded too, not only data and scope steps.
- **§10.4, "noise is grouped out":** made concrete by §4.2's compaction at Save project.
- **§10.5:** gains the tracking settings of §4.6, in the same two layers (your defaults, plus the per-project override).
- **§10.6, new questions for B2's form:**
  - the default of each tracking setting;
  - whether branch pinning ("keep this branch") is in B2 or later;
  - what the session history file does after a crash before compaction, and how large it may grow.
- **§10.7:** unchanged in substance. Workflows, notebooks and replay on new data stay out of B2.
- **To judge, the roadmap:** docs/07 places "Lineage time travel + scenario branches" in **Beta**, and "Notebooks: record and replay" in **Alpha**. Restoring to a lineage step inside one saved project may be the Beta item pulled forward, or something smaller. If it is pulled forward, docs/07's own precedent is the 2026-08-18 Action console split, which names the half that ships and the half that stays. Scenario branches stay Beta either way.
- **To judge, the naming against ADR-006:** in ADR-006, the "lineage DAG" is the machinery for pure transformations, and style or filter edits belong to the command and event log. The user-facing "Lineage" of §4 spans both. The step record's effect class keeps the classes distinct, and code and records keep ADR-006's terms, as the note opening these decisions says. Whether the form needs to state this explicitly is for the main architect.

## What happens next

- You tell me the notes are in this file, or paste them.
- Within a day I write the minimum-shell migration plan. It folds in the layer-model decisions of 2026-09-28, PORTABILITY §5 and the nine seams, and its first milestone is small and mergeable.
- You rule the plan. Its first milestone then takes the product slot.
