# The minimum-shell migration plan — Map Studio on the real shell, in milestones (2026-10-07, second version)

*Fable (main architect), 2026-10-07, at the human's request after his O-07 walkthrough. It is written from his decisions of 2026-10-07 (`O-07-WALKTHROUGH-2026-10-05.md`, section "Chris's decisions after the walkthrough"), his layer-model ruling of 2026-09-28, the nine seams (design notebook §12), PORTABILITY-2026-09-30 §5 and the shell direction of 2026-09-23. Repository facts were read at main 125c66e8 and, for §10, at 04c4849a. This is a plan, not a preregistration. When the human rules it, milestone 1 becomes the node `shell-migration-milestone-1` and gets its own full form from the architect. Milestones 1 and 2 are specified here to the level a form needs. Later milestones are placed and bounded, and specified in their own forms when they come up. Nothing here changes an ADR, the wire format or a constitution document.*

*Second version, the same day: §10 is rewritten for the session-history and lineage model the human settled after the first version (his decisions' §1, §4 and §8). §3, §4, §6.5, §7, §11 and §13 are aligned with it. Nothing else changed. The first version was never filed.*

## 1. Where the shell is today

Read from the code, so that each milestone states what it changes:

- **One column.** `frontends/shell/src/App.tsx` (2,025 lines) renders a header, a top rail (the admission and filter panels), the map with a status stack over it, and a bottom rail (style, publish, console, notices).
- **One dataset, held in `App`.** All state is `useState` and refs for the one admitted dataset. The panels and the map are keyed on the dataset handle, so a new open remounts them on purpose (ADR-010 rule 1).
- **Missing today:** keyboard shortcuts, menus, command search, selection (there is hover only), a table, history and a scale display.
- **Filter:** one predicate typed as text and sent as typed. The kernel alone admits it (`AND`, `OR`, comparisons, `IN` with a literal list, `BETWEEN`, `LIKE`; SKP-V0 §7.4).
- **Attributes:** the wire can already carry attribute columns on `viewport_query` (`columns`, skp/0.6). The shell sends none.
- **Dependencies:** React 18, deck.gl 9, Tauri 2 and Apache Arrow, with plain CSS in one file (889 lines). There is no state library and no layout library.
- **End-to-end suites** find elements by component class (`.describe-summary`, `.working-canvas`, `.hover-readout`, `.zoom-to-layer`). They use five container classes: `.app`, `.app-header`, `.app-main`, `.canvas-container` and `.canvas-status-stack`.
- **Window:** 1280 × 800 by default. The walkthrough ran at 1366 × 768.

## 2. Rules for every milestone

1. **Components move whole.** A milestone changes behaviour only where its form says so (the 2026-09-23 direction, item (c)).
2. **The map is never hidden and never remounted by a layout change.** The remount on a new dataset handle stays as it is.
3. **Every fact display binds to the dataset on the map,** never to an open attempt still in flight (the 2026-09-23 ruling, entry 120, item 2).
4. **No new dependency.** If a form finds one necessary, that is a question for the human before any code.
5. **Milestones 1 to 3 and 5 change no engine, kernel or protocol file.** They are shell-lane pieces.
6. **Names are labels only** (§3). Code, SKP, error codes, ADRs and records keep `save`, `prepare`, `publish` and `rows`.
7. **Every new operator string is a P6 placeholder** for the human's sight.
8. **Portability (PORTABILITY §5):**
   - shortcuts are declared with a platform-neutral modifier (Ctrl on Windows and Linux, Cmd on macOS);
   - the frontend never parses or builds a path;
   - landmarks, ARIA and full keyboard reach are acceptance items;
   - webview differences stay in the shell's adapters.
9. **One view per source in practice.** No Duplicate view, multi-view scheduling, masks, presets, derived views or scenarios (the 2026-09-28 ruling).
10. **Layout is not workspace.** Opening, moving or resizing a panel never marks anything unsaved and never becomes a history step (seam 9; decision 5 of 2026-10-07).
11. **No new permanent element over the map** (the 2026-09-23 direction, item (d)). Messages and status have homes outside it from milestone 1.

## 3. Names

User-facing labels, by the human's decisions of 2026-10-07. The internal names do not change.

| Label the user sees | Internal name, kept | First shown in |
|---|---|---|
| Save project | save (the reference recipe) | B2 |
| Snapshot data | prepare | B2 |
| Export interactive map | publish | milestone 1 |
| Session history | the kernel's command and event log (ADR-006), this session's part | B2 |
| Lineage, with its views Data lineage, Map recipe and Sources | the same log's kept steps, with links to audit records (§10.7) | B2 |
| features (in the table) | rows | milestone 4 |
| Filtered | the layer's filter as applied | milestone 2 |
| Selected | selected features that pass the filter | milestone 2 |
| Selected, ignoring filter | every selected feature | milestone 2 |

Retired labels: "Matching layer filters", "Prepare verified copy", "Publish" and "Rows".

## 4. The milestones

| # | Milestone | What the user gets | Seams | Backend change |
|---|---|---|---|---|
| 1 | The frame | Regions, panel toggles, separated sections, an attention strip and a status bar | 1 (minimal), 7, 9 | none |
| 2 | Selection and scope | The Select tool, a selection that survives filter and pan, the hidden count, a stated scope | 3, 4, 5, 6 | none |
| 3 | Command bar and filter clauses | Ctrl+K, `/` commands, typed `/filter` with field completion, clause cards with on and off | 1 (full), 2 | none |
| 4 | B1's shell half | Attributes of the inspected feature, colour by category, the table | uses skp/0.6 | none expected |
| 5 | Conditions, Problems and Jobs | One home for failures and running work | 8 | none |
| B2 | Save project, Snapshot data, session history, lineage, preferences | Its own preregistration, in stages (§10) | uses 3, 8, 9 | kernel, engine and protocol, as B2's form declares |

- **Order.** The shell lane runs 1, 2, 3, 4, 5. Milestone 2 follows milestone 1 directly, by the human's decision.
- **The 2026-09-28 ruling's three provisions** land in milestone 2 (view state apart from the resource; the drawing order) and in milestone 5 (conditions that name their target).
- **Why 3 before 4.** The human named filter, select and scope as his three day-one needs, and milestone 3 completes filter in the form he tried. He may swap 3 and 4.
- **B2 runs beside them.** Its kernel and engine stages can use the data lane once its preregistration is ruled. Its screens need milestones 2 and 5.

## 5. Milestone 1 — the frame

**Purpose:** put today's shell into the Map Studio regions with no change to what any component does.

### 5.1 Regions

- **Top bar:** the title. Search arrives in milestone 3; no dead control is shown before it.
- **Layers** (left): the admission panel, whole, and one row for the dataset on the map with its Zoom to layer action.
- **Map** (centre).
- **Inspector** (right), with tabs:
  - **Layer:** three headed, collapsible sections: Source, Filter and Export. Export is closed by default, as its panel is today.
  - **Style:** the style panel. A tab of its own answers both of the human's notes: the sections felt thrown together, and he looked elsewhere for style.
- **Activity** (bottom, collapsed by default), with tabs Console and Notices. A tab appears only when a milestone gives it content.
- **Attention strip** (above the map, outside it): today's blocking messages.
- **Status bar:** today's status facts.

### 5.2 Where each existing component goes

| Today | New home | Change |
|---|---|---|
| `AdmissionPanel` (with its CRS and identity forms and refusals) | Layers | none |
| `DescribeSummary` | Inspector, Layer tab, Source section | none |
| `FilterPanel` | Inspector, Layer tab, Filter section | none |
| `StylePanel` | Inspector, Style tab | none |
| `PublishPanel` and `PublishDialog` | Inspector, Layer tab, Export section | label and one-line purpose only (§5.4) |
| `HoverReadoutView` | stays over the map | none; it joins the Feature tab in milestone 2 |
| The Zoom to layer button | the layer's row in Layers | position only |
| Session ended, map refusal, viewport refusal | attention strip | position, and the banner's colours |
| Residency status, scan liveness, scan incomplete | status bar | position only |
| The watcher's state (watching, checks-only, degraded checks) | a status bar item; the summary's two existing rows stay in Source | the status display held since 2026-09-23 gets its home |
| `ConsolePanel` | Activity, Console tab | none |
| `NoticesPanel` | Activity, Notices tab, always reachable | none |

### 5.3 The three seams it introduces

- **Layout state (seam 9).** A pure reducer holds which panels are open and their sizes.
  - It lives for the session only. Saving it is B2's preferences.
  - It has no entry that hides the map, and the map region has a declared minimum size.
  - Regions are resizable. Docking by drag, saved layouts and a second window are not in this plan.
- **Registered contributions (seam 7).** Static typed lists declare the panels, tabs, sections, status items and attention items. There is no loader and no plugin mechanism.
- **Action registry (seam 1, minimal).** Each existing command gets a stable id, a label and an optional shortcut, and reuses its existing handler: open dataset, zoom to layer, export, and the three panel toggles.
  - Shortcuts: Ctrl+B toggles Layers, Ctrl+I the Inspector, Ctrl+J Activity. Each toggles only its own panel.
  - One listener dispatches them. The form states how they behave while a text field has the focus.

### 5.4 Wording, for the human's P6 sight

- The region, tab and section headings.
- The export panel's label, "Export interactive map", and its one-line purpose.
- The banner's colours in the attention strip. Its content does not change.

### 5.5 Boundaries

- **`App.tsx` changes only from its `return (` on.** The state and the handlers above it are untouched, apart from imports.
- **`WorkingCanvas.tsx` and the files under `canvas/`, `streaming/`, `residency/` and `skp/` are not edited.**
- **New code** sits under `frontends/shell/src/layout/`, with `styles.css` reworked for the regions.
- **Size, as an estimate for the form to declare:** at most 1,500 changed lines over about 25 files.

### 5.6 Acceptance

- **The map is never hidden:** a test over the layout reducer shows that no sequence of actions reaches a state without the map, and that each toggle changes only its own panel.
- **The map is never remounted by layout:** a render test counts the map's mounts across every layout action. Only a new dataset handle remounts it.
- **Every end-to-end suite passes.** Selector changes are limited to the five container classes of §1 and listed in the form.
- **The migration inventory is closed.** Every item marked as a migration-inventory item in the code and the records gets its home here, or a named later milestone.
- **Fit:** at 1366 × 768 and at 1280 × 800, with every panel open, the map keeps its declared minimum and the page never gains its own scrollbar.
- **Keyboard:** the three shortcuts work, focus moves through the regions in order, and each region is a landmark.
- **`MANUAL-WALKTHROUGH.md`:** the location words of the existing parts are updated in place, and no row's meaning changes.
- **One new part, the human's felt verdict at 1366 × 768:** the toggles, the map staying in place, and whether Source, Filter and Style now read as separate things.

### 5.7 Placement

- From the human's ruling it is first in slot 1's order (the node's summary, citing the product-first direction, 8.b).
- It shares `e2e/regression.mjs` and `MANUAL-WALKTHROUGH.md` with the lines cut. Under item 3 of the 2026-10-07 slot direction, its form and question round are prepared now and its code starts when the lines cut has merged.
- The governance freeze lifts when it merges.
- **After it merges,** a proposed follow-on node runs the real app once on macOS and once on Linux and records what it finds (PORTABILITY §5). It does not hold milestone 2.

## 6. Milestone 2 — selection and scope

**Purpose:** the human's day-one needs beside filter. He can select on purpose, keep the selection while he filters, pans and inspects, and always see what an action will apply to.

### 6.1 Phase A — state keyed by view, with no visible change

- **Three identities, kept apart (seam 4):** a view id minted by the shell, the resource (the dataset handle and its session), and the generation.
- **The shell's state moves** from "the admitted dataset" to views by id (filter, style, selection, tool), resources by key, and a drawing order that is a list of view ids. In practice there is one view and one resource.
- **A resource records its consumers:** its views and its running operations, such as an export. The session closes when the last consumer releases it (the 2026-09-28 ruling, item 4).
- **Tests the ruling asked for:**
  - nothing calls `open_dataset` except the open command;
  - replacing or closing the dataset while an export runs waits or asks, and never cancels silently. The form first establishes what happens today, which is untraced;
  - reordering the drawing order changes no query, filter or action target.
- **This phase ends with every suite passing and nothing visible changed.** It is its own commit and is read on its own at the gate.

### 6.2 Phase B — tools, inspection and selection

- **Two map tools:** Navigate, the default, and Select.
  - In Navigate, a click inspects: it shows the feature in the Feature tab, where it can be pinned.
  - In Select, a click changes the selection in one of v7's four modes: Add / remove, Replace, Add only, Remove only.
- **Inspect and select must be easy to tell apart on first use** (walkthrough step 5). The form proposes how, and asks the human. The fixed parts:
  - the active tool is always visible, outside the map;
  - selected and inspected features are drawn differently;
  - what a click does in each tool is stated where the tool is chosen.
- **Clicks reach only visible, pickable content** (the 2026-09-28 ruling, item 3). A pick that the 9 px rule refuses selects nothing and says so with its existing named state.
- **It works for polygons, points and lines.** A multi-part feature is one feature.

### 6.3 The selection contract (seam 5)

- A selection is a set of feature ids bound to a view, a resource and a generation.
- **It survives filter changes, pans and zooms.** Features that are no longer drawn stay selected.
- **Counts shown:** selected, and hidden selected with the reason where the shell can establish it.
  - The shell keeps, for each selected feature, the bounds it had when selected. That tells "outside the view" from "not drawn in the view", and it serves Zoom to selection.
  - It never scans the whole file to explain a count, and it never states a reason it cannot establish.
- **A new generation ends the selection,** with a named notice that says how many features were dropped. Carrying a selection across generations needs validated identity and is not in this milestone.
- The form declares a ceiling on the selection's size.

### 6.4 Scope (seam 6)

- **An action that needs a target takes a resolved scope:** the view, the resource, the generation, the filter as applied, and the selection or none.
  - It is resolved when the action is staged and checked again when it runs.
  - If the context changed in between, the action refuses by name. It never retargets silently.
- **Each action declares the scope it uses and states it in words:**
  - Zoom to selection uses "Selected, ignoring filter";
  - Export interactive map uses the layer's filter and never the selection. Its dialog says so (ADR-024; walkthrough step 8c).
- **Layout actions take no scope.**

### 6.5 Typed transitions (seam 3)

- Changes to filter, style, selection and tool go through pure, typed transitions on the view's state.
- No log is kept and no undo is offered in this milestone.
- **Their shape is chosen for B2:** each transition that B2 will record carries a typed action with typed parameters, so that it can become a kernel command without being redesigned (§10.7).
- Keystrokes, hovers, navigation and layout changes are not transitions.

### 6.6 Surfaces

- **The Feature tab** in the Inspector: the inspected feature with a pin, and the selection summary with its counts, Zoom to selection and Clear selection. Attributes arrive in milestone 4.
- **The tool switch** in the top bar, with shortcuts in the registry.
- **Click picking and highlight drawing** for selected and inspected features. These are the milestone's only changes under `canvas/`, and they make no performance claim.

### 6.7 Not in milestone 2

Box or lasso selection; "select everything that matches"; a selection carried across generations; the table; undo of a selection; several views.

### 6.8 Acceptance

- **Tests:**
  - the selection survives a filter change, with the hidden count, and survives a pan;
  - a new generation ends it with the notice;
  - a refused pick selects nothing;
  - a scope that changed between staging and running refuses;
  - export states the filter scope and ignores the selection.
- **The human's sitting:** steps 4, 5 and 6 of the O-07 walkthrough on the real app, with his felt verdict.

## 7. Milestone 3 — command bar and filter clauses (bounded)

- **Ctrl+K opens search over the action registry:** `/` commands, plain search and `?` help. `@` completes field names from the dataset's schema inside `/filter`, and implies no statistics. `#` feature search stays later.
- **Tab completes and Enter applies.** Focus can always leave the bar (notebook §3.4).
- **Filter clauses are cards** in the Filter section, with enable, disable and remove.
  - The enabled cards combine with `AND` into the one predicate sent to the kernel, which stays the only authority on admission.
  - An expression the cards cannot represent stays whole as one advanced card. It is never rewritten approximately.
  - A refused draft never discards the applied filter, as today.
  - Turning a clause off and on is an ordinary step. B2's compaction at Save project collapses such toggles (§10.3; walkthrough step 3).
- **Draft to resolved intent (seam 2)** stays a narrow internal form. There is no universal parser and no new SKP schema.
- **Also here:** a read-only scale display where the unit facts support it, and native menus generated from the registry on macOS.

## 8. Milestone 4 — B1's shell half (bounded)

The node `b1-shell-half` lands on the new shell, as the consumer the engine half has waited for:

- attributes of the inspected feature, in the Feature tab;
- colour by category in the Style tab, with its legend (the one `match`, ADR-017 §5a);
- the table, in Activity, with "features" and the three scope options of §3.

**The question its form must settle:** where the table's features come from. The only data path today is `viewport_query`, and a table is a second consumer of the dataset's four stream connections. The form settles the scheduling and proposes no new SKP command without the human's ruling.

## 9. Milestone 5 — conditions, Problems and Jobs (bounded)

- **Typed conditions (seam 8):** each keeps its reason, owner, target (a resource or a view), generation and lifecycle.
  - The attention strip shows the most urgent one and a count of the others.
  - The Problems tab keeps every unresolved one. A newer message never erases an older blocker.
  - A condition raised for one view does not appear on another view of the same source.
  - The display consumes existing facts. It invents no remedy and merges no two conditions because their text matches.
- **Jobs tab:** running work, such as a scan or an export, with its cancel where one exists today.
- **A naming note:** docs/03 uses "Problems panel" for spatial linting. This tab can later hold lint findings as a kind of their own. docs/03 does not change.

## 10. B2 — Save project, Snapshot data, session history, lineage and preferences

This section is the brief for B2's own preregistration (PLAN node `briefb-b2-save-reopen`). It follows the human's decisions of 2026-10-07, §1, §3, §4 and §5. Its existing dependencies stand, the ADR-029 scan-progress ruling among them.

### 10.1 What the user gets

- **Save project,** with a data choice:
  - **Keep linked to the live file** (the default): no whole-file scan. Reopening shows the file as it is now, and the app says if it changed.
  - **Freeze a snapshot:** takes time and disk space, says so first, and can be cancelled. Reopening shows the same data every time.
- **Snapshot data on its own,** without saving the project.
- **Reopen.**
- **Session history:** every committed step of this session, dead ends included, with restore to any of them.
- **Lineage:** every step that contributes to the result, kept in the project, with restore to its earlier steps.
- **Three views of the lineage:** Data lineage, Map recipe and Sources. Past exports are linked from them.
- **Sharing levels** for the lineage, and **settings** for what is tracked.
- **Preferences in two layers.**
- **A one-line purpose at the top of each of the three dialogs,** and a plain explanation of "Reference" where that state is shown.

### 10.2 Six things, stored apart

| Thing | Holds | Stored | Travels with a shared project |
|---|---|---|---|
| Project | the data link or snapshot reference, filters, style, map view, selection rules, and the analysis settings (units, CRS, styles) | the project file | yes |
| Snapshot | a sealed copy of the data | the app's protected storage | only when the user chooses |
| Session history | every committed step of the current session, dead ends included | see §10.9, question 1 | never |
| Lineage | every contributing step, data and style, from the raw data to now | the project's hidden folder, permanently | at the level the user chooses |
| Preferences | panel layout, personal settings and the tracking settings | the machine | never |
| Exported map | a finished map for others | where the user exports it | it is what is shared |

### 10.3 The model: one record of steps, in two layers

- **A step is a committed change:** to data, scope or style, a snapshot, or an export.
- **Never a step:** zoom, pan, panel layout and preferences. A selection by itself is not a step either; a step that uses one records it as its scope.
- **Session history** keeps every step as the user works, with its branches and dead ends. It is written as he goes, so a crash loses nothing, and it is cleared when the session ends.
- **Lineage** keeps the steps that contribute. Each Save project appends the steps that survive since the last save:
  - dead ends, reversals, clause toggles and repeated edits of one property collapse, so five colour tries leave the last one;
  - distinct steps that each contribute stay.
- **The lineage always matches the project as saved.** Closing without saving adds nothing to it, and saving never wipes it.
- **Snapshots are anchor steps.** The first one pins the raw data.
- **Restore** is explicit: to any step of the current session, and to any lineage step from earlier sessions.
- **The honest limit:** a step that depends on data which has changed since cannot be restored exactly, and the app says so. With a snapshot, every step stays restorable.

### 10.4 What every step records

One line of plain text per step, in a versioned format (docs/02, "Projects": plain-text, diffable files):

- **Intent:** the typed action and its typed parameters, with units.
- **Kind:** data, scope, style, snapshot or export.
- **Dependencies:** the fields, the CRS and the kind of data the step relies on.
- **Data identity:** the snapshot's fingerprint, or the live file's change-detection observation, through a lasting dataset reference and never a session handle.
- **Parent,** so that branches can be recognised.
- **Actor:** the user, an AI or a plugin. It is recorded from B2 on, although B2 shows only the user.
- **Effect class,** by ADR-006. Today's filter, scope and style steps are workspace mutations, and an export is an external side effect.
- **Links** to related records: an export's audit record and a snapshot's identity. The views join these records without copying them.

### 10.5 Views, sharing and settings

- **Views in B2:** Data lineage (data and scope steps), Map recipe (every contributing step), and Sources (which datasets, versions and snapshots went in, with attribution and licence where the file states them). Exports are linked to the record that exists today.
- **Later views** (parameters, notes, AI-made steps, quality, edits) arrive with their features. The step record already carries what they need.
- **Sharing a project,** the user chooses: no lineage, the full lineage, or the lineage with chosen steps withheld. A lineage with steps withheld says so and shows a lower reproducibility level.
- **Tracking settings,** in the two layers of preferences (the user's defaults, plus a per-project override):
  - record lineage for this project, on or off. When off, the project says "lineage not recorded";
  - which kinds are recorded. Data and scope steps are always recorded while lineage is on. A kind that is off is named in every view;
  - the default sharing level.
- **Always on:** an AI-made step is always labelled.
- **The firm line:** no setting and no edit removes a step that shaped the result while the lineage still claims to be complete. Every reduction shows as a marker and in the reproducibility level (docs/01, principle 8).
- **Organising is free:** naming steps, adding notes, grouping and collapsing on screen.

### 10.6 Preferences

- The user's defaults apply to every project.
- "Use a custom setup for this project" overrides only what the user changes. It is stored on the machine, keyed to the project, and is never written into the project file.
- They hold milestone 1's layout state and §10.5's tracking settings.

### 10.7 What the architecture requires of B2

These follow from the constitution and the code. They are requirements on B2's form, not new decisions.

- **The record is the kernel's, not the shell's.** docs/02 says undo is "never implemented in the UI" and that workspace mutations go through a kernel command and event log. An actor other than the user can only be recorded if steps pass through the public interface (docs/01, principles 4 and 5).
  - So the changes B2 records (filter, scope, style) become kernel commands, and the protocol gains them.
  - Milestone 2's typed transitions are their shell-side shape (§6.5).
  - Persisting a style triggers ADR-006's class-2 obligations and docs/11's, which ADR-022 left "not granted". B2's form asks for that grant.
- **Names against ADR-006.** The user-facing "Lineage" is wider than ADR-006's "lineage DAG". The form states the mapping once, and code and records keep ADR-006's terms:

  | The user sees | ADR-006 class | Machinery |
  |---|---|---|
  | filter, scope and style steps | workspace mutations | the kernel's command and event log |
  | export steps | external side effects | the audit log, linked from the step |
  | processing steps (none exist yet) | pure transformations | the lineage DAG |

  - No code or record calls the step file a lineage DAG.
  - "Replay" stays reserved for pure transformations. B2's restore is a restore of workspace state.
- **A lasting dataset reference** (docs/11's ResourceRef) is a prerequisite. Every handle is session-scoped today (SKP-V0 §3).
- **A recorded selection** can be re-established only where feature identity is stable: a declared identity column and unchanged data. Otherwise the step says that its selection could not be restored.
- **A durable format needs an ADR.** The project folder's layout and the step record are read by later versions and by other people. B2's form proposes the ADR, and the human accepts it before the merge.
- **docs/07 gets a dated note,** as its Action console entry did on 2026-08-18 (§10.9, question 2).

### 10.8 Stages

B2 is too large for one piece, and the human asked on 2026-09-22 for separately reviewable pieces. A proposed order, each stage with its own form:

1. **Save project (linked) and reopen,** with the lasting dataset reference, the kernel's step commands, and the session history with its crash safety.
2. **The lineage file:** compaction at Save project and the step record of §10.4.
3. **Snapshot data,** and the "freeze a snapshot" choice in Save project. Rebinding creates a new generation, so milestone 2's rule for a new generation applies to the selection.
4. **The views and restore:** Data lineage, Map recipe and Sources.
5. **Sharing levels, tracking settings and the two-layer preferences.**

### 10.9 Questions for the human

**Now, because they change this plan or his decisions:**

1. **Where the session history is kept.** His decisions' §1 puts it in the project's hidden folder until the session ends. I recommend the machine instead, keyed to the project.
   - In the project folder, a copy made by hand during a session, or after a crash, carries the dead ends. That contradicts his §4.3.
   - A project folder that a sync service mirrors would upload every step as it is made.
   - Two machines opening the same synced project would write to one session file.
   - Crash safety is the same in either place.
2. **The docs/07 note.** B2's restore is smaller than Beta's "Lineage time travel + scenario branches": it restores a project's setup to a recorded step, and it re-derives no data and compares no branches. B2 also ships the recording half of Alpha's "Notebooks: record and replay". I recommend one dated note in B2's pull request that names what ships and what stays, with replay staying Alpha and time travel and scenario branches staying Beta.
3. **Branch pinning ("keep this branch") stays out of B2.** A kept branch is the first piece of scenario branches, which stay Beta. B2 drops dead ends when the session ends.
4. **The stages of §10.8.**

**At B2's form, as open items:**

5. **The reproducibility level of a lineage with steps withheld, or with a kind turned off.** ADR-005's levels grade the inputs, not the recipe. I recommend showing Best-effort with the marker. It is a reading of ADR-005, so it is his to rule.
6. **Saved steps that stop contributing after a restore.** I recommend keeping them while an export or a snapshot refers to them, so that no link dangles, and collapsing them otherwise.
7. **The default of each tracking setting.**
8. **What the session history does after a crash before compaction,** and how large it may grow.
9. **What Save does with the style of a point or line layer** (rounds 62 and 63).
10. **The retention of snapshots** that a saved project refers to.
11. **The coherent-acquisition guarantee** for a snapshot, defined without the operating system (PORTABILITY §4).

### 10.10 What changes against earlier records

- **"History stays session-only for B2"** (`LAYER-MODEL-DECISIONS-2026-09-28.md` §2, last row, and notebook §3.5) is replaced: the session history is still cleared with the session, and the lineage is saved.
- **"Freeze a snapshot" inside Save project** is save, prepare and rebind in one flow for the user. Internally the three stay distinct, and the 2026-09-18 direction holds: save performs no whole-file scan, and prepare is explicit and cancellable.
- **B2 stays a single-dataset project.**

### 10.11 Not in B2

Workflows, notebooks, replay on new data, export from a saved project, CLI replay, kept branches, the later views of §10.5, and projects with several datasets.

## 11. Where each walkthrough finding lands

| Finding (step) | Where |
|---|---|
| Tool panels that can be hidden (1) | milestone 1 toggles; hideable tool panels later |
| "Reference" needs explaining (2) | B2 |
| History must not record each toggle (3) | B2's compaction at Save project |
| Selection on day one (4) | milestone 2 |
| Inspect and select hard to tell apart at first (5) | milestone 2 |
| "Matching layer filters" (6) | retired; the labels of §3 from milestone 2 |
| Colour by zone (7) | milestone 4 |
| The purpose of Save, Prepare and Publish (8) | export in milestone 1; the other two in B2 |
| The banner's colours (9) | milestone 1 |
| A shortcut hid the map (10) | milestone 1, as a tested rule |
| Sections that do not belong together | milestone 1: sections, and Style as a tab |

## 12. Later, recorded and not planned

- The publishing work, pushed back by the human. Today's whole-file export stays as it is.
- Workflows and notebooks over the same step record (Alpha), and time travel and scenario branches (Beta).
- Table joins, rule-based symbology and temporal data.
- `#` feature search, box selection and "select everything that matches".
- An editable scale, saved layouts, docking by drag and a second window.
- Duplicate view, masks, presets and scenarios (the 2026-09-28 ruling's later bands).
- **A note to carry:** the lines cut's pick tolerance is one setting for the whole map. When several layers show together it must become a setting per layer.

## 13. What the human's ruling settles

1. This plan is the migration's order. Milestone 1 is placed with §5's scope, and milestone 2 is selection and scope.
2. §2's rules bind every milestone.
3. The Inspector's arrangement: a Layer tab with Source, Filter and Export sections, a Style tab, and a Feature tab from milestone 2.
4. The export label and its one-line purpose land in milestone 1. The other names arrive with their features.
5. The order after milestone 2 is 3, 4, 5, unless he swaps 3 and 4.
6. §10 is the brief for B2's preregistration, with his answers to §10.9's questions 1 to 4. The session-history and lineage model replaces the earlier "session-only" lines.
7. The holds of 2026-09-23, item (b), lift by milestone: the watcher's status display at 1, B1's shell half at 4, and B2's screens at B2. Items (c) and (d) stay as §2's rules 1 and 11.
8. A proposed node for the real-app run on macOS and Linux after milestone 1 merges.

**Owed by the human as the work arrives:** a felt-verdict sitting for milestone 1 and for milestone 2, the ADR-029 scan-progress ruling before B2's backend stages, and his acceptance of B2's ADR.
