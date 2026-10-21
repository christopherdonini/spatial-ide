*Custodian's filing note (2026-10-21): the architect's draft of milestone 4's form (`b1-shell-half`; the human's placements message, item 3: drafted meanwhile), read only at main 2cd77a29; 2cd77a29..37eac4e4 changes the ledger only. The run 2026-10-21T05:37:58Z to 05:54:14Z by its transcript (Glob 9, Grep 32, Read 48; no Write, Edit or Bash); its one SubagentHandback call, at 05:54:13Z. It read rows of the private reuse clone's round-1 file by name, which the brief's reuse output points to; nothing from that clone is copied here beyond the row names it cites. Not committed as a form: its OPEN items are the human's, and its pins carry no hashes yet. Extracted by script from the SubagentHandback call, with nothing changed except one final newline. Its sha256, from line 5 to the end, is 8639fa860e786b3f5496ecbc97cfba93add492f497aa319357f89a280777fea2.*

---

Drafted: b1-shell-half (milestone 4), its form, at main 2cd77a29

Read: main @ 2cd77a29 (the checkout's HEAD by its git status, short form only; I have no shell to give the full id). Verdict: none, because this is a draft and not a gate.

**About the cites.** Every `path:line` below is read at 2cd77a29. None of them carries a sha256, because I have no shell. The custodian fills the hashes by script. PLAN.yaml is cited by node id only. The ledger is cited by round and item, or by entry number, never by line. The prior-art rows were read in the private clone's `REUSE-ROUND-1.md`. I could not check which commit that checkout is at; the brief names 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c. I cite those rows by row name.

---

# Shell migration, milestone 4: B1's shell half. Attributes of the inspected feature, colour by category with its legend, and the table with its three scopes (PLAN node `b1-shell-half`)

- **Path:** `frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md`.
- **Authority:**
  - PLAN node `b1-shell-half`, its whole summary.
  - The placement: `state/directives/2026-10-21-placements-redaction-scan-1c-milestone-4-lanes-238-clicked-d-answers-adr-024-heading-kept.md:13` (item 3).
  - The migration plan: §8 (`state/directives/SHELL-MIGRATION-PLAN-2026-10-07.md:233-241`), §2 (`:20-36`), §3 (`:42-54`) and §4 (`:58-65`). Its ruling: `state/directives/2026-10-07-migration-plan-v2-ruled.md:16` and `:27`.
  - B1's engine half: `engine/B1-PROJECTION-PREREGISTRATION.md`, §2.9's caller rule (`:214-217`), Amendment 1 (`:391-395`; O7 names this node) and §9's operator line (`:384`). This piece is the named consumer under round 8's producer exemption, pre-committed by round 17, item 4 and round 22, item 2.
  - ADR-023's Decision text: Proposed. The human accepted the text as drafted (RULED 2026-09-14, question set D, item D2). Entry 79's items (1) to (3) apply (RULED 2026-09-11, entry 79).
  - ADR-017 §5a; ADR-022 and its Amendment 1.
  - The O-07 walkthrough's §6 (`state/directives/O-07-WALKTHROUGH-2026-10-05.md:240-247`) and its step 7 (`:53-55`).
- **Drafted by** the architect, read only, at main 2cd77a29.
- **Committed before any code.** Append-only once committed. An amendment made after any outcome has been seen says so in its first line.
- **Form and gating:** full form, full gating from dispatch (`AUTONOMY.md:315-332`; §25(e), `AUTONOMY.md:482`). The reasons:
  - The shell starts sending a non-null SKP field (`columns`).
  - It adds new user-visible behaviour.
  - It touches properties under test: ADR-010 rule 2 and the residency ceilings.
  - It exceeds §21c's size threshold.
  - If OPEN-4 (A′) or (B) is ruled, it carries an ADR text and wire dependency.

## §0. Disclosure

**0.1 Inputs.** No pilot, spike or corpus has run, and nothing is measured. The 5 GB fixture is not used.

What I read:
- the plan whole, and its ruling;
- B1's form with Amendments 1 to 12, read last amendment first;
- ADR-023, ADR-017 §5a, ADR-022, and ADR-036 §6 (the `style.set` row, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:151` and `:153`);
- SKP-V0 `viewport_query` (`protocol/skp/SKP-V0.md:106-118`), §9 (`:1149-1235`) and §10 (`:1237-1284`);
- milestone 3's form with Amendments 1 to 3;
- piece 1c's draft (`state/consults/2026-10-21-b2-piece-1c-save-and-reopen-architect-draft.md`);
- `AUTONOMY.md` §21 and §25 (e); `docs/PREREGISTRATION-TEMPLATE.md`, its Round 25 additions included (`:165-176`).

**0.2 The reuse index** (the standing step). These are the custodian's four runs, as briefed:

```text
$ node tools/reuse.mjs attribute table
capability: table-data-source → duckdb-ui [CONCEPTUAL], Perspective [CONCEPTUAL], Mosaic [CONCEPTUAL], quak [CONCEPTUAL], QGIS [CONCEPTUAL], tad [CONCEPTUAL], rill [REJECT], kepler.gl [REJECT]   (worth-owning, P0)
$ node tools/reuse.mjs legend
No prior art recorded for "legend". Research it before planning an implementation.
$ node tools/reuse.mjs categorical
No prior art recorded for "categorical". Research it before planning an implementation.
$ node tools/reuse.mjs feature inspector
No prior art recorded for "feature inspector". Research it before planning an implementation.
```

What this form takes:
- **`table-data-source`.** Concepts only:
  - a bounded read until a declared limit (the duckdb-ui row);
  - a ranged or ordered read as a future ruled command (the Perspective and Mosaic rows; OPEN-7 (C)).
  No code is taken.
- **Three misses** (legend, categorical, feature inspector). They are noted and block nothing. The legend has no prior art to look for: it is ADR-017 §5a's and is read from `renderer/style-ts`'s `Style.legend`.
- **Rows the four runs did not print.** The index also holds rows tagged with this node: `aria-grid-accessibility` (a specification, ADOPT), `arrow-cell-access` (already a dependency, ADOPT), `selection-scope-table` (CONCEPTUAL), `stale-range-cancellation` (PORT) and `virtualized-grid` (one PORT, others CONCEPTUAL or REJECT). The custodian should run `reuse.mjs` for "grid", "virtualized", "scope" and "range" and append the printed lines by script.
- **What this form takes from those rows:**
  - the grid's ARIA roles and keyboard model (a specification);
  - Arrow cell access through the existing `apache-arrow`;
  - supersede-and-cancel of a stale range as a concept.
- **What it takes nothing from:** no port and no dependency (plan §2 rule 4). A windowing library would be I2.

**0.3 The consuming-side interfaces, read before any seam is drafted (the seam rule).**

The wire:
- `viewport_query` is `{skp, dataset, bbox, bbox_crs, limit, filter, columns}` (`protocol/skp/SKP-V0.md:1151-1157`).
- The kernel admits a projection pre-lease and pre-mint, in eight codes (`:1173-1211`). `columns: []` is refused (`:1179-1180`). The ceiling is 32 (`:1181`).
- `describe.schema[].projectable` is the kernel's fact (`:83`).
- The shell's only request builder hard-codes `columns: null` (`frontends/shell/src/skp/client.ts:108-126`).

The three product callers of `viewportQuery`:
- `frontends/shell/src/streaming/tileViewportStreamManager.ts:941`;
- `frontends/shell/src/streaming/viewportStreamManager.ts:192`;
- `frontends/shell/src/residency/candidateArmSession.ts:1274` (the untiled first look, with `limit`).
- The candidate arm is the product default (`frontends/shell/src/App.tsx:1529-1614`). The baseline arm is built at `:1674`.

Streams and connections:
- At most 3 tile streams are in flight (`frontends/shell/src/canvas/tileGridConstants.ts:37-40`).
- The engine holds 4 stream connections per dataset (`engine/src/pool.rs:99`; `engine/README.md:291`). A fifth pending ticket fails at the lease (`kernel/src/skp.rs:83-94`).
- The cancel path can leave a lease unreturned while a re-request is admitted (`engine/README.md:325-336`).
- The tile manager retries `engine.connections_exhausted` once. Its comment says the admission class cannot be reached by this shell's composition (`frontends/shell/src/streaming/tileViewportStreamManager.ts:307-316`).

Decode and pick:
- `ResidentBatch` holds `ids`, `parts` and `partToRow` from one pass (`frontends/shell/src/canvas/decodeBatch.ts:96-114`). The decode never reads attribute columns (`:123-238`).
- `resolvePick` maps a GPU part ordinal to its row through `partToRow` (`frontends/shell/src/canvas/pick.ts:134-143`).
- `resolveClickPick` has the candidate batch and computes bounds from its row (`frontends/shell/src/canvas/clickPick.ts:20-48`).

The workspace:
- `InspectedFeature` is `{pick, bounds}` (`frontends/shell/src/workspace/workspaceState.ts:49-59`). `ViewState` is at `:68-86`.
- Selection members map an id to a bbox (`frontends/shell/src/workspace/selection.ts:27-28`). The ceiling is 10,000 (`frontends/shell/src/workspace/selectionConstants.ts:15`).
- `StyleSetTransition` has four literal properties (`frontends/shell/src/workspace/viewTransitions.ts:31-38`). `styleTransitions` is at `:157-175`.

The style:
- `StyleState` has four literal members (`frontends/shell/src/style/document.ts:56-61`).
- `StyleDocumentV0` has no `match` (`:109-118`). The module doc says the shell requests no projection (`:18-22`), and that sentence becomes false in PR B.
- The resolver gives `resolve`, `groupFor`, `groups` and `legend` (`renderer/style-ts/src/style.ts:79-179`).
- The match-key type rule lives only in Rust (`renderer/src/compiled.rs:225-239`).
- The canvas draws one colour per layer (`frontends/shell/src/canvas/buildLayers.ts:447`, `:470`).

Recording:
- `record_step`'s `style.set` admits four literal properties only (`protocol/skp/SKP-V0.md:1247-1256`; ADR-036 §6 row 2, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:151`). A `style.set` step names no dependencies (`:153`).

Export:
- The shell sends the style document to publish (`frontends/shell/src/publish/client.ts:31-44`).
- The host derives the match column into the publish projection (`frontends/shell/src-tauri/src/publish.rs:1225-1246`). So export with a category style needs no host edit.

Layout:
- `ACTIVITY_TABS` is Console and Notices (`frontends/shell/src/layout/contributions.ts:40-43`).
- The eleven sighted headings are at `:11-13`.
- The Feature tab is at `frontends/shell/src/feature/FeatureTab.tsx:13-26`.

**0.4 Pins.** Every pin is historical. Milestone 3 PR B and the redaction piece may move pins in `App.tsx`, the managers, `workspace/` and `KNOWN-LIMITATIONS.md`.

At each PR's base, a read-only re-sweep runs before any code:
- it recomputes every pin and reads every §0.3 interface as the tree has it;
- it runs every e2e suite at the base;
- it names the next walkthrough letter (`AC`, if `AB` is still the last; `frontends/shell/MANUAL-WALKTHROUGH.md:1927`) and the next KNOWN-LIMITATIONS numbers.

A moved cite is class 3. A changed interface is I4.

**0.5 Hypotheses**, each with its discriminator:

| ID | Hypothesis | Discriminator |
|---|---|---|
| H1 | `apache-arrow` reads the engine's batch with the projected fields after geometry, in declared order, and its `attribute_columns` metadata readable. It reads `Int64`/`UInt64` as `bigint` and `Float32` as its exact `number`. | PA-E1 |
| H2 | Projecting every projectable column (≤ 32) leaves every existing e2e suite green, with no projection refusal and no ceiling refusal. | The suite runs at PR A's head. If it fails: I3 or I6. |
| H3 | A per-datum colour accessor whose `updateTriggers` key on a style revision is not re-evaluated on pan, zoom or render. | PB-U5 |
| H4 | With the table holding one stream, the tile manager's single retry absorbs a `connections_exhausted` refusal in ordinary use. | PC-U6. The residual is declared (KL-5). |
| H5 | A `viewport_query` with `bbox: null`, a filter, a `limit` and `columns` ends `Completed` with at most `limit` rows. | PC-E1 |
| H6 | The copied attribute data references no part of the IPC message's buffer. | PA-U3 |
| H7 | For the fixture's value range, the shell's `Float32` and `Float64` display equals the oracle's shortest round-trip text. | PA-E1 |

**0.6 Not decided here:** any SKP command, any ADR text, and anything under `kernel/src`, `engine/src` or `protocol/`. Under OPEN-4 (A′) the recording widening is another node's.

## §1. May and may not claim

**May claim, each only as §4 tests it:**
- the Feature tab shows every projected column of the inspected feature, read from the same decode pass as its id;
- colour by category over a projected text column, resolved by the imported resolver, with its legend;
- the table with the three scopes;
- the declared ceilings, each with its behaviour.

**May not claim:**
- any performance figure, `docs/08` row or duration (DRAFT-3 B-7; ADR-023 §9);
- that B1 is done, or any sentence describing the workflow as complete (DRAFT-3 B-1). B1 closes at its own node, with ADR-023's acceptance;
- that anything is undoable. The category style is a workspace mutation (ADR-006 class 2) and is recorded only as OPEN-4 rules;
- that the table shows every feature passing the filter beyond what its count line states;
- that a selected feature passes the filter where §2.4 has not established it;
- macOS or Linux above L1.

**Other commitments:**
- No change to `protocol/`, `kernel/src`, `engine/src`, `src-tauri`, the bundle viewer or MCP. OPEN-5 (c) touches `renderer/style-ts` and the agreement vector only.
- **ADRs cited, none amended:** 004, 006, 010 (rules 1, 2, 5 and 6), 016 §7, 017 §5a, 021, 022, 023 and 036 (Proposed).
- **Operator text:** engine and kernel messages are shown as RefusalBlock shows them today. The shell's lines state only the shell's consequences.
- **Strings:** every new string is a P6 placeholder. B1's eight projection refusal messages are sighted in this piece's Part (B1 §1, `engine/B1-PROJECTION-PREREGISTRATION.md:80`; §9, `:384`).

## §2. The change

Three PRs: A (attributes), B (colour by category and its legend), C (the table). Their order is OPEN-11. A part marked [OPEN-n] binds only as Amendment 1 rules it.

### 2.1 Unchanged

Nothing in this list is edited:
- `applyFilter`, FilterPanel, `predicateInput.ts`, the filter cards and `combineClauses`;
- the export's scope rule: the export uses the filter and never the selection;
- PublishDialog and `src-tauri/src/publish.rs`, which is read only;
- the map's key, and the remount on a new handle;
- the layout reducer;
- the hover readout, under OPEN-3 (a);
- `MAX_IN_FLIGHT_TILE_STREAMS`, `MAX_RESIDENT_VERTICES` and every existing ceiling;
- the frame-tag check in `decodeBatch`.

### 2.2 PR A: attributes of the inspected feature

**(a) The projection set**, new `src/attributes/projection.ts` [OPEN-1].
- `projectionFor(describe)` lists the schema rows with `projectable: true`, in schema order, up to `ATTRIBUTE_PROJECTION_MAX` (32, the kernel's ceiling, mirrored).
- It returns `null` when there are none, never `[]` (SKP-V0 §9.4 step 1).
- It is fixed per open, so no re-issue follows from it.
- It reads only `projectable`. The shell holds no type policy of its own (entry 79, item (3)).

**(b) The wire.**
- `viewportQuery` gains a required `columns: string[] | null` parameter, sent always and never omitted.
- Its product callers:
  - the tile manager, the baseline manager and the first look, each passing the open's projection set from a constructor option;
  - in PR C, the table source.
- This closes the round 8 exemption for B1's non-null path. The PR body names it.

**(c) Decode**, in the same pass as `ids`, `parts` and `partToRow` (ADR-010 rule 2; ADR-023 §6).
- `decodeBatch` takes the expected projection.
- It refuses a batch whose `attribute_columns` metadata is not exactly that list, in order. The error is typed, and its text is a shell fact (P6).
- `ResidentBatch` gains `attributes: {names, data, bytes} | null`. `data` is the projected columns copied out of the IPC message: one named copy (ADR-004), so the message buffer is not retained (H6).
- Values are read per row on demand by `src/attributes/values.ts`'s `readRow(batch, row)`. It returns typed values:
  - text;
  - integer as `bigint` (every integer width; 64-bit never narrowed, ADR-023 §2, ADR-023 §11 item 4);
  - `float32`, `float64` and boolean;
  - null.
- The display rules:
  - an integer shows its exact decimal;
  - a `float64` shows the shortest round-trip text;
  - a `float32` shows the shortest decimal that round-trips through `Math.fround`;
  - a NULL shows an explicit marker, never an empty cell (ADR-023 §6).

**(d) The resident attribute ceiling** (ADR-010 rule 6) [OPEN-12].
- `RESIDENT_ATTRIBUTE_MAX_BYTES` lives in `canvas/limits.ts`. It is counted over the copied attribute bytes of every resident batch, in both arms.
- Under (a), a batch that would pass it keeps its geometry and is marked `attributes: not-held`. Under PR B, its match column is still kept.
- The Feature tab names that state for its features, and a status item shows it (P6).

**(e) Inspect.**
- `resolveClickPick` reads the picked row's values from the candidate batch at `partToRow[gpuOrdinal]`, in the same handler as the bounds.
- `inspect.set`'s params and `InspectedFeature` gain `row: AttributeRow | "not-held" | null`. The captured values stay for the generation, as the bounds do (ADR-010 rule 5: the data cannot change inside a generation).
- `endViewGeneration` clears them, as it does today.

**(f) The Feature tab.** A new section, "Attributes" (P6), shows every projected column in declared order (entry 79, item (2)).
- Each column's name, with its value or the null marker.
- A line names the columns that are not projected (`projectable` false) by name, and the number left out over the ceiling (P6).
- The not-held state is named.
- [OPEN-3] The hover readout over the map is unchanged.

### 2.3 PR B: colour by category, and its legend

**(a) The model.**
- `StyleState` gains `fillMatch: {column, cases: {when, then}[], onNull, onUnmatched} | null`. The default is `null`.
- The document's `fill_color` is `fillMatch` when it is set, and otherwise the literal `fillColor`. One `match` in the document at most, on `fill_color` only (ADR-017 §5a; ADR-023 §7).
- The other three properties stay literal.

**(b) The document.**
- `toStyleDocument` emits §5a's `match` from `fillMatch`.
- It is closed at construction: at least 1 and at most 64 cases, distinct `when` values, `on_null` and `on_unmatched` always present, colours normalized.
- `StyleDocumentV0` widens to admit `match` on `fill_color` only.
- The module doc's Literal-only bullet (`frontends/shell/src/style/document.ts:18-22`) is rewritten to the new fact in the same commit.

**(c) Resolution**, through the imported resolver only (ADR-022 point 2; ADR-023 §11 item 5).
- New `canvas/matchGroups.ts`. For each batch it computes once per style revision a per-row group array from `Style.groupFor(value)`, and colours from `Style.groups`.
- `buildLayers` gives polygons, points and lines a per-datum `getFillColor`, or the line colour, reading `partToRow`. Its `updateTriggers` key on the style revision (H3).
- With `fillMatch` null, the layer props are exactly today's.

**(d) Building the cases** [OPEN-6], new `style/categoryCases.ts`.
- The chosen column's distinct non-null text values across the batches the map holds, in code-point order.
- At most `CATEGORY_MAX_CASES`, coloured by `CATEGORY_PALETTE` in order.
- `onNull` is `CATEGORY_NULL_COLOR`; `onUnmatched` is `CATEGORY_OTHER_COLOR`.
- The owner's line states how many values were found and how many more are drawn as Other (P6).
- The legend is then the style's, not the data's (ADR-017 §5a).

**(e) Which columns can be chosen** [OPEN-5]. Projected columns that §5a's match-key rule admits (text only), never decided by a rule written in the shell.

**(f) The Style tab.**
- A Colour-by chooser and its apply, and One colour, which returns to the literal fill.
- The legend renders `Style.legend` in its order: the cases, then No value, then Other. Each swatch is the resolver's `fillColor`.
- Per-case colour editing is out [OPEN-6].

**(g) Transitions.**
- `style.set {property: "fillColor", value: {match: …}}` joins the union. A literal value clears `fillMatch`. The transition stays pure (plan §6.5).
- `styleTransitions` emits it.

**(h) Recording** [OPEN-4].
- Under (A′) or (B), the step recorder sends it as `record_step`, once the widened `style.set` is on main.
- Under (C), the recorder sends nothing for it. The owner's line says it is not recorded in the session history. A class-C row states it has no API equivalent (P6).

**(i) Export.**
- No change to the path. publish.rs derives the match column (`frontends/shell/src-tauri/src/publish.rs:1225-1246`).
- This seam is proven from the real shape by PB-E2: export, open the bundle, compare colours (DRAFT-3's B1 gate, the F7 pattern).

**(j) Command bar** [OPEN-10]. Reveal entries only.

### 2.4 PR C: the table, in Activity

**(a) The frame.**
- `ACTIVITY_TABS` gains `{id: "table", label: "[P6] Table"}`, with slot `activity.table`.
- The three scope options use plan §3's labels byte for byte (`state/directives/SHELL-MIGRATION-PLAN-2026-10-07.md:49-52`). The default is the first.
- The column header uses the human's word for rows (`:49`).
- The columns are `id` plus the open's projection set.

**(b) The first scope: the source** [OPEN-7 (A)]. New `table/tableSource.ts`.
- One stream at a time: `viewportQuery(dataset, null, null, TABLE_MAX_ROWS, view.filter, projection)`, then `dataPlaneAttach` and `startStream`, with its own sink.
- It decodes id and attributes only; the frame is checked and geometry ignored.
- It issues only while the Table tab is shown and the Activity region is open. It never issues on pan, because `bbox` is null.
- It supersedes and cancels on a scope or filter change.
- It cancels when the tab is hidden, Activity collapses, a dataset is opened or replaced, or the generation ends.
- Liveness is a line with Cancel (docs/01 principle 7).
- The terminals:
  - Completed: the count line;
  - a refusal: the shell's lead line plus the kernel's code and message;
  - `engine.source_changed`: the table's owner line, then the rows are cleared.
- The count line:
  - fewer than the limit: all N;
  - exactly the limit: the first N the engine returned, in no declared order, with more possibly passing the filter (P6).
- No sorting, no row actions, no paging (OPEN-7).

**(c) The other two scopes: rows captured at selection** [OPEN-8 (a)].
- `selection.apply`'s params and each member gain the clicked row, captured as in §2.2 (e) and cut at `CAPTURED_ROW_MAX_BYTES` with a visible marker, and `filter`: the filter its batch's stream was issued under.
- `ResidentBatch` gains `filter`, set by the issuing manager through `onBatch`.
- The third scope lists every member.
- The second scope lists a member that passes the view's filter when one of these holds:
  - it was captured under that filter (by value);
  - its id is in a resident batch streamed under it;
  - its id is in the first scope's result for it.
- A member fails when that result is complete (fewer than the limit) and lacks it.
- Every other member is counted as not established (P6).
- While the second scope is shown, the bounded first-scope stream runs to establish membership.

**(d) The grid**, new `table/TableGrid.tsx`.
- APG grid roles: `role="grid"`, `aria-rowcount`, `aria-rowindex`, `columnheader`.
- One tab stop. Arrows, Home, End, PageUp and PageDown move the active cell.
- Windowed rows at `TABLE_ROW_HEIGHT_PX`. No dependency.

**(e) The stream budget** [OPEN-9 (A)].
- The table issues nothing while an export consumer is held (milestone 2's consumers), and shows a P6 line.
- An export's execute cancels a running table stream first.
- The tile manager's comment (`frontends/shell/src/streaming/tileViewportStreamManager.ts:307-316`) is restated in the same PR. It must state that the table's query is one more concurrent admission and stream. Its claim that the composition cannot be reached no longer holds for 3 tiles plus the table plus an export.
- The residual is KL-5.

### 2.5 Rows

- The table's `viewport_query` is a class-A row through `skp/client.ts`'s recorder.
- Class-C rows, at the action before its outcome, each with a P6 statement of its API equivalence: `table.scopeSet`, `table.cancel`, `style.colourBy`, `style.oneColour`, plus OPEN-10's entries.

### 2.6 Boundaries

**May edit:**
- under `frontends/shell/src`: `skp/client.ts`, which gains the parameter only;
- the three managers, for `columns` and, in PR C, `filter` through `onBatch`;
- `canvas/{decodeBatch,clickPick,buildLayers,limits,WorkingCanvas}.ts(x)`, plus the new `canvas/matchGroups.ts`;
- new `attributes/`, new `table/`;
- `style/{document,StylePanel}`, plus the new `style/{Legend,categoryCases,styleConstants}`;
- `workspace/{workspaceState,viewTransitions,selection,stepRecorder}.ts`;
- `feature/{FeatureTab,FeaturePanel}.tsx`;
- `layout/{contributions,StudioLayout,actionRegistry}`;
- `console/surfaceRegistry.ts`;
- `App.tsx`;
- `styles.css`;
- `package.json`, script lines only;
- new tests and new e2e suites;
- under OPEN-5 (c): `renderer/style-ts/src/style.ts`, `renderer/tests/data/style-agreement.json` and its Rust reader;
- under OPEN-13 (a): one new generator in `kernel/tests/manual_walkthrough_fixtures.rs`, test code only.

**Not edited:**
- `protocol/**`, `kernel/src/**`, `engine/**`, `src-tauri/**`;
- `skp/types.ts`, which already carries `columns` and `projectable`;
- `residency/` beyond the first look's argument;
- FilterPanel, `filterClauses.ts` and PublishPanel;
- §2.1's list.

A need outside this list is I1.

### 2.7 Suites and records

- **New suites:** `e2e/attributes.mjs` (PR A), `e2e/colour.mjs` (PR B) and `e2e/table.mjs` (PR C). Each gets one script line and an `e2e/README.md` entry.
- **MANUAL-WALKTHROUGH.md:** one new Part at the next letter, with a blank log. Existing rows are updated only where a location word changes. None is expected.
- **KNOWN-LIMITATIONS** (P6 drafts, at the next free numbers):
  - KL-1: the table's first scope shows at most `TABLE_MAX_ROWS` features, in no declared order, with no sort.
  - KL-2: the second scope counts members whose filter result is not established.
  - KL-3: the categories come from the features the map held at the time, up to `CATEGORY_MAX_CASES`, and the rest are drawn as Other.
  - KL-4: attributes not held past `RESIDENT_ATTRIBUTE_MAX_BYTES`.
  - KL-5: three tile streams, the table and an export can meet a typed `engine.connections_exhausted`, and this is never a wrong result.
  - KL-6: under OPEN-4 (C), category colouring is not recorded.
  - KL-7: under OPEN-3 (a), the hover readout shows no attributes.

### 2.8 Portability (R3)

- **Owning boundary:** none new. No path, no key chord beyond OPEN-10's registry entries, and no adapter.
- **Platforms:** Windows supported. macOS and Linux L1, by unit tests. L2 goes to `shell-real-app-run-macos-linux`.
- **Expected reduction:** none.

### 2.9 Overlap (rule (00), `AUTONOMY.md:609`)

**The redaction scan** (its drafted paths):
- **Shared:** `KNOWN-LIMITATIONS.md`, where this piece adds separate items (separate items count as separate paths).
- **Read only, not edited:** `frontends/shell/src-tauri/src/publish.rs`.
- **Used, not edited:** `engine/src/fixture.rs`, through OPEN-13's kernel test generator.
- **Otherwise disjoint**, with no `protocol/`. The placement puts milestone 4 after the redaction piece in any case.

**Piece 1c** (its draft's paths):
- Step 0 (ADR-only) is disjoint.
- Steps 1 to 3 share `App.tsx`, `skp/client.ts` (PR A), `console/surfaceRegistry.ts`, `package.json` and `e2e/README.md` entries.
- Steps 1 to 3 change the seams this piece changes: `StyleState` and `ViewState`. Its §2.14 expects milestone 4 first (`state/consults/2026-10-21-b2-piece-1c-save-and-reopen-architect-draft.md:424-429`).
- So no step 1 to 3 runs beside any PR of this piece.
- Under OPEN-4 (A′), the recording piece touches `protocol/` and must not overlap 1c's steps either.

**The docs lane's first piece** (`MANUAL-WALKTHROUGH.md` Parts G and N): disjoint. This piece adds a new Part and edits neither G nor N.

**Governance D (#237):** disjoint. The only shared file is PLAN.yaml, through the custodian's status rows. This form's commit waits for D's merge, or is held in scratch under the freeze.

## §3. Fixtures, with outcomes declared in advance

Each fixture is hash-verified before and after each run.

| Fixture | Used by | Predicted |
|---|---|---|
| `filter-zoned.parquet` (2,000 polygons, nullable `zone`) | PA-E3, PB-E1 to E3, PC-E1 and E2 | `zone` is projected. Four categories plus No value. The first scope under one zone is complete (below the limit). |
| `attributes-multitype.parquet` (new, OPEN-13 (a)): `AttributeMode::MultiType` (`zone, area, f32, i64, flag, d32, text`), 500 polygons, with an oracle sidecar written by the same generator from an independent DuckDB read of five ids | PA-E1 | Six columns are projected. `d32` is named as not projected. `i64` shows exactly, `f32` matches the oracle (H7), and NULLs show the marker. |
| `100k-happy-path.parquet` | PC-E3, and suite regression | The first scope reaches the limit, and the line says more may pass. |
| `slow-filter-scan.parquet` | PC-E4 | The liveness line shows, then Cancel ends it. |

## §4. Tests, and one mutation each

A mutation is observed by applying it, running the named test, recording its failure by name with the commit, and reverting it (round 25, item 2 (c)). No `verify-mutation` run is an observation. The render tests copy App.layout.test.tsx's harness and mock only the transport boundary. Mocking `decodeBatch`, `projectionFor`, the resolver or `tableSource` is I5.

| ID | PR | Asserts | Mutation, and its expected failure |
|---|---|---|---|
| PA-U1 | A | `projectionFor`: projectable rows only, in schema order, capped at 32, `null` when there are none, never `[]` | return `[]` when there are none; fails |
| PA-U2 | A | `viewportQuery` sends `columns` as given and `null` as null, never omitted. Its key set equals the committed `protocol/skp/tests/data/v0-viewport_query-request-with-columns.json`. | omit the key when null; fails |
| PA-U3 | A | decode: attributes after geometry in declared order; a metadata mismatch refused by name; values co-indexed with `ids`; data not on the message buffer (H6) | read attributes in reverse order; fails |
| PA-U4 | A | display: 2^63−1 and 2^64−1 exact; null gives the marker; `float32` and `float64` rules; boolean | `Number(bigint)`; fails on 2^53+1 |
| PA-U5 | A | the click's row comes through `partToRow`; every part of a multipolygon gives one row | index by GPU ordinal; fails |
| PA-U6 | A | the attribute ceiling: geometry kept, the batch not-held, bytes released on clear | omit the new batch from the sum; fails |
| PA-U7 | A | all three managers pass `columns` on every call, the first look included | the first look passes `null`; fails |
| PA-R1 | A | the Feature tab: every column, in order; the null marker; the not-projected line; the not-held state | skip null values; fails |
| PA-R2 | A | the pinned feature keeps its values after its batch is superseded | read from the live batch at render; fails |
| PA-E1 | A | MultiType: a click at a `capturePixels` pixel, with its id from `hoverIdAfterBarrier`, shows the oracle's values for that id | `projectionFor` drops the last column; fails |
| PA-E3 | A | filter-zoned under `"zone" = 'residential'`: a clicked feature shows `zone` as residential | show row 0's values; fails |
| PB-U1 | B | `toStyleDocument` with `fillMatch` emits §5a's match, and `Style.parse` accepts it; null gives byte-identical literal output | drop `on_null`; fails |
| PB-U2 | B | the cases: distinct non-null values, code-point order, the cap, palette order, the counts left out | locale sort; fails on `a`/`B` |
| PB-U3 | B | the per-datum colour equals `Style.resolve(value).fillColor` for polygons, points and lines; NULL gives No value; an unlisted value gives Other | an unlisted value takes case 0; fails |
| PB-U4 | B | the shell's path agrees with the agreement vector's match rows | lowercase the key; fails |
| PB-U5 | B | no accessor re-evaluation across ten pans (H3) | trigger on the render count; fails |
| PB-U6 | B | the transition: a match sets `fillMatch`, a literal clears it, and it is pure | a literal keeps it; fails |
| PB-U7 | B | [OPEN-5 (c)] the style-ts match-key rule equals Rust's over the vector's typed rows | admit `Dictionary`; fails |
| PB-R1 | B | the legend equals `Style.legend`'s order and swatches; the chooser lists only admitted columns | legend from the values present; fails |
| PB-R2 | B | recording per OPEN-4: (A′) one `record_step` with the match; (C) none, and the owner line shown | send it under (C); fails |
| PB-E1 | B | colour by zone: each feature's pixel equals its zone's swatch; NULL features the No value swatch | drop the `on_null` mapping; fails |
| PB-E2 | B | export, then the bundle: `style.json` carries the match on `fill_color`; `zone` is published; the viewer draws the same colour at the same feature | send the literal document to `publishPrepare`; fails |
| PB-E3 | B | One colour restores the literal fill | leave `fillMatch` set; fails |
| PC-U1 | C | the source: one stream; `bbox` null; `TABLE_MAX_ROWS`; the view's filter and the projection; supersede cancels; the count lines | `limit` null; fails |
| PC-U2 | C | the scopes: the third lists every member; the second follows §2.4 (c)'s three ways in and one way out; the rest are not established | count a different filter as passing; fails |
| PC-U3 | C | members carry the row and the filter; the cut at `CAPTURED_ROW_MAX_BYTES` with its marker; generation end drops them | no cut; fails |
| PC-U4 | C | nothing is issued while an export consumer is held; execute cancels the table stream first | ignore the consumer; fails |
| PC-U5 | C | the grid: roles, row count, row index, one tab stop, arrows; 10,000 rows render at most visible rows plus overscan | render every row; fails on the DOM count |
| PC-U6 | C | a stubbed `connections_exhausted` on a tile while the table streams is retried once (H4) | no retry; fails |
| PC-R1 | C | tab hidden: no stream; shown: one; a filter change supersedes; collapsing Activity cancels | issue on mount; fails |
| PC-R2 | C | session end clears the rows and shows the owner line | keep the rows; fails |
| PC-E1 | C | the first scope on filter-zoned under one zone: all N equals the oracle count; each row's `zone` matches | send `filter: null`; fails |
| PC-E2 | C | O-07 step 6: select three, filter so one hides; the second scope shows 2; the third shows 3 | second scope equals the third; fails |
| PC-E3 | C | the 100k fixture: the limit reached, and the more-may-pass line | a complete line at the limit; fails |
| PC-E4 | C | slow-filter-scan: the liveness line, then Cancel; no stream left in flight | Cancel not wired to `skpCancel`; fails |

**Each acceptance item of plan §8, and what proves it:**
- the attributes: PA-U3, PA-U5, PA-R1, PA-E1 and PA-E3;
- colour by category and its legend: PB-U1 to PB-U4, PB-R1, PB-E1 and PB-E2;
- the table with the three scopes: PC-U1, PC-U2, PC-E1 and PC-E2;
- the stream connections: PC-U4, PC-U6 and KL-5;
- no new SKP command: §8 item 3.

## §5. Predictions, declared unchanged, invalidators, falsification

**Predicted:** H1 to H7, and §3. A wrong prediction is class 2.

**Declared unchanged:**
- §2.1's list;
- every existing e2e suite's outcome (H2);
- the frame tag and identity checks;
- the export scope sentence;
- every existing string except §2.7's and §2.4's;
- the lockfiles.

**Invalidators.** Each one means STOP and report.
- **I1:** an edit outside §2.6, or under `kernel/src`, `engine/` or `protocol/`.
- **I2:** a dependency, port or lockfile change.
- **I3:** an existing e2e fails for a reason other than a declared selector change.
- **I4:** a §0.3 interface differs at the base.
- **I5:** a test passes only by mocking `decodeBatch`, `projectionFor`, the resolver or `tableSource`.
- **I6:** any `skp.projection_*` refusal in a suite, which means the shell's set disagrees with `projectable`.
- **I7:** code of an OPEN item before its ruling.
- **I8:** the attribute ceiling cannot be enforced without changing the vertex ceiling's behaviour.
- **I9:** ADR-036 is accepted with a `style.set` shape that forbids OPEN-4's ruled route.
- **I10:** a 1c step merges first and changes `StyleState`, `ViewState` or App's seams beyond what a class-3 row can carry.

**Falsification.** The form is wrong if either holds:
- a projected value cannot be read co-indexed with its id from the decode pass that produced its row;
- the table's first scope cannot be served by one bounded `viewport_query` without a new SKP command.

## §6. Instruments

- **Assertions:** every U, R and E row.
- **Measurements:** none.
- **The human's:** the felt rows.

## §7. Declared values and ceilings

Each constant is declared at its own site, with what it bounds (ADR-010 rule 6).

| Constant | Value | Bounds |
|---|---|---|
| `ATTRIBUTE_PROJECTION_MAX` | 32 | columns projected per open. It mirrors `MAX_PROJECTED_ATTRIBUTES`; a drift is refused by name by the kernel (I6). |
| `RESIDENT_ATTRIBUTE_MAX_BYTES` | 268,435,456 | copied attribute bytes over the resident batches |
| `CAPTURED_ROW_MAX_BYTES` | 16,384 | one captured row (×10,000 members gives at most 160 MiB) |
| `CATEGORY_MAX_CASES` | 12 (the palette's length; ≤ §5a's 64) | cases built per apply |
| `CATEGORY_PALETTE` / `CATEGORY_NULL_COLOR` / `CATEGORY_OTHER_COLOR` | 12 colours / one grey / one grey (P6 sight) | case colours |
| `TABLE_MAX_ROWS` | 1,000 | `limit` of the first scope's stream |
| `TABLE_MAX_IN_FLIGHT` | 1 | table streams per open |
| `TABLE_ROW_HEIGHT_PX`, `TABLE_OVERSCAN_ROWS` | 24, 10 | the windowed grid |
| Defaults | no `fillMatch`; the table tab not shown; the first scope | the first state |

**Budget.** Insertions plus deletions, tests included, by `git diff --numstat <base>...HEAD -- frontends/shell renderer/style-ts renderer/tests kernel/tests/manual_walkthrough_fixtures.rs ':(exclude)frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md' ':(exclude)frontends/shell/MANUAL-WALKTHROUGH.md' ':(exclude)frontends/shell/e2e/README.md'`.
- `<base>` is the merge base when each PR's branch is cut, or after a named merge of main.

| Group | Files (ceiling each) | Lines, at most |
|---|---|---|
| A-P | client.ts 20, tileViewportStreamManager.ts 30, viewportStreamManager.ts 20, candidateArmSession.ts 30, decodeBatch.ts 150, projection.ts 60, values.ts 180, clickPick.ts 40, WorkingCanvas.tsx 80, limits.ts 25, workspaceState.ts 20, viewTransitions.ts 25, FeatureTab.tsx 150, FeaturePanel.tsx 10, App.tsx 150, surfaceRegistry.ts 20, styles.css 60, package.json 2 | 1,072 |
| A-T | projection 120, values 250, decodeBatch 280, clickPick 80, client 50, tile manager 80, baseline manager 40, candidate session 60, ceiling 150, FeatureTab 220, workspace 80, App.attributes.test.tsx 450 | 1,860 |
| A-E | attributes.mjs 420, fixture generator 90, margin 60 | 570 |
| B-P | document.ts 160, StylePanel.tsx 200, Legend.tsx 120, categoryCases.ts 120, styleConstants.ts 40, buildLayers.ts 160, matchGroups.ts 110, WorkingCanvas.tsx 70, viewTransitions.ts 50, workspaceState.ts 10, stepRecorder.ts 40, App.tsx 120, actionRegistry.ts 25, surfaceRegistry.ts 25, styles.css 70, style-ts 40, vector 40, Rust reader 40 | 1,450 |
| B-T | document 200, categoryCases 180, matchGroups 220, buildLayers 200, viewTransitions 120, stepRecorder 80, StylePanel/Legend 250, style-ts 80, App.colour.test.tsx 350 | 1,680 |
| B-E | colour.mjs 450, margin 60 | 510 |
| C-P | TableTab.tsx 280, tableSource.ts 300, tableScope.ts 140, TableGrid.tsx 260, tableConstants.ts 40, selection.ts 70, viewTransitions.ts 30, clickPick.ts 20, decodeBatch.ts 40, managers 40, tile comment 15, contributions.ts 10, StudioLayout.tsx 30, actionRegistry.ts 15, App.tsx 180, surfaceRegistry.ts 30, styles.css 100 | 1,600 |
| C-T | tableSource 320, tableScope 220, selection 120, TableGrid 250, TableTab 200, decodeBatch 60, managers 80, App.table.test.tsx 450 | 1,700 |
| C-E | table.mjs 480, margin 60 | 540 |
| **Total** | **about 95 file-touches over three PRs** | **10,982** |

**Outside the count:** MANUAL-WALKTHROUGH.md 160; e2e/README.md 60; KNOWN-LIMITATIONS.md 50.

An overrun is class 8, and this section is never edited.

## §8. Block-on-sight

1. A file outside §2.6's may-edit list. Any edit under `protocol/`, `kernel/src`, `engine/` or `src-tauri/`.
2. A dependency, port or lockfile change.
3. A new SKP command, field or literal (the node's summary).
4. A projected value read by an index not produced by the same decode pass as `ids`, `parts` and `partToRow` (ADR-023 §11 item 7; ADR-010 rule 2).
5. A 64-bit integer narrowed to `Number` anywhere (ADR-023 §11 item 4).
6. Match parse, resolve, legend or match-key semantics written in the shell (ADR-022 point 2; ADR-023 §11 item 5).
7. A second `match`, a match on a property other than `fill_color`, or a legend derived from data.
8. `columns: []` sent, or a column sent whose `projectable` is false.
9. A NULL shown as an empty cell or an empty string.
10. A table stream issued on pan, while the tab is hidden, or while an export consumer is held. More than one table stream.
11. A count line or scope that claims more than §2.4 establishes.
12. A style recorded other than as OPEN-4 rules. Undo, or the word undoable.
13. A `pub` item, prop, callback or option without a product caller (the instrument exemption only as defined).
14. A message stating another module's consequence, or rewording the kernel's refusal.
15. A new string neither marked P6 nor sighted.
16. A performance number, or a sentence describing B1 or the workflow as complete (DRAFT-3 B-1, B-7).
17. A seam test written to an imagined interface: the projection seam must use the committed request fixture and the real data plane (PA-E1); the resolver seam the agreement vector (PB-U4); the export seam the real bundle (PB-E2).
18. The round 25 items by name:
    - an overrun not recorded as class 8, or §7 edited;
    - a scope addition not recorded as class 9, or its code before the amendment;
    - a `verify-mutation` run called an observation;
    - a test-text span on the branch pinned by hash at a branch commit, or named without its commit id.
19. A quote of the human's words marked verbatim that is not byte-identical. A line cite into the ledger. A bare self-line.
20. Code of an OPEN item before Amendment 1 records its ruling.

## §9. Gates

- **Gating, per PR:** architect and reviewer, full gating. Verdicts follow the product-first direction, section 2. The wording-block rule applies by reference to `state/directives/2026-10-11-direction-after-status-review.md`, item 2.
- **The architect checks:**
  - §8 item by item;
  - ADR-023 §11 items 2 to 9 as they apply to the shell;
  - ADR-010 rules 1, 2, 5 and 6;
  - ADR-006 classes (projection and table class 1, the style class 2, export class 3 unchanged);
  - the seam rule for: shell → `viewport_query` (the committed fixture); data plane → decode (PA-E1); resolver (PB-U4); export → bundle (PB-E2);
  - the closing of round 8's exemption;
  - discharge claims and verbatim quotes.
- **The reviewer:** the full diff `origin/main...HEAD`; every mutation applied again; §7 by its command; an empty lock diff.
- **Suites, green first:**
  - `npm run verify`;
  - every e2e suite at the base plus the new ones;
  - under OPEN-5 (c), `cargo test -p spatial-renderer`;
  - the governance `node --test` suites;
  - verify-cites, verify-quotes and verify-test-claims, each named with its commit.
- **Heavy runs:** THE MACHINE paragraph, `state/directives/2026-10-06-machine-script-adopted.md:12-22`, as written in every heavy-run brief.
- **Operator:** one new Part (next letter), with a blank log, queued to the sitting.
  - 0: read §10, last amendment first.
  - 1: MultiType, click a feature. Felt: readable; where did you look?
  - 2: the null marker and the not-projected line.
  - 3 (O-07 step 7): colour filter-zoned by zone. Felt: where did you look for the legend; does it feel like the layer's style?
  - 4: One colour.
  - 5: export with the category style; the bundle shows the same colours and legend.
  - 6 (O-07 step 6): select five, filter so some hide, open the Table, switch scopes. Felt: is the scope clear before you open the selector?
  - 7: the 100k fixture: the line at the limit.
  - 8: Cancel a slow table load.
  - 9 [OPEN-3]: did you expect attributes on hover?
  - 10: P6 sight of every new string and of B1's eight projection refusal messages, from their committed error fixtures.
  - 11 [OPEN-2 (b)]: on a real parcel file with many columns, did the first view feel slower?

## §10. Amendments

Opens empty, append-only.
- Amendment 1 records the human's rulings on OPEN-1 to OPEN-15, before any code.
- The re-sweep amendment (§0.4) follows before each PR's code.

## §11. Open items

See below.

---

# OPEN items for the human (options; my recommendation)

| Item | Subject | Recommended | Red line |
|---|---|---|---|
| OPEN-1 | The projection set | (a) | yes |
| OPEN-2 | Measuring first pixels | (b) | no |
| OPEN-3 | Attributes on hover | (a) | yes |
| OPEN-4 | Recording the category style | (A′), time-sensitive | yes (ADR text, wire) |
| OPEN-5 | Where the match-key type rule lives | (c) | yes if (b) |
| OPEN-6 | Building the cases | (a), no per-case edit | yes |
| OPEN-7 | The first scope's source | (A) | yes |
| OPEN-8 | The second scope | (a) | yes |
| OPEN-9 | The stream budget with exports | (A) | yes |
| OPEN-10 | Command bar entries | (a) | no |
| OPEN-11 | PR order | A, C, B under OPEN-4 (A′); A, B, C under (C) | no |
| OPEN-12 | At the attribute ceiling | (a) | yes |
| OPEN-13 | The MultiType fixture | (a) | no |
| OPEN-14 | P6 wording | sighted at row 10 | no |
| OPEN-15 | ADR-023's text against this piece | dated notes at ADR-023's acceptance (B1's close node) | yes |

- **OPEN-1. Which columns ride the viewport stream.**
  - (a) Every projectable column up to 32, in schema order, fixed per open. Simplest, and it satisfies entry 79, item (2).
  - (b) The first 8 plus the match column, with a chooser later.
  - (c) None until the Feature tab opens or a match is chosen. This re-issues the view, which is a visible reload.

  **Recommend (a)**, with §2.2 (d)'s ceiling.
- **OPEN-2. First pixels.** Every viewport batch gains attribute bytes (B1 §7 names that `docs/08` row as the shell half's, `engine/B1-PROJECTION-PREREGISTRATION.md:336-341`).
  - (a) The tester records first pixels with `columns: null` against (a)'s projection on a named dataset before merge, with no claim made from the record.
  - (b) No measurement in this milestone. The risk is declared, felt row 11 is added, and a later node owes the measurement before any claim.

  **Recommend (b).**
- **OPEN-3. Hover.** ADR-023 §6 (`docs/adr/ADR-023-attribute-projection-on-viewport-query.md:97-99`) and entry 79, item (2) put attributes in the readout. Plan §8 puts them in the Feature tab. Plan rule 11 forbids a new permanent element over the map.
  - (a) The Feature tab only, with the hover readout unchanged. Entry 79 (2) is read as the inspection surface.
  - (b) Both.

  **Recommend (a).** It is your ruling's wording, so it is yours to confirm.
- **OPEN-4. Recording colour by category.** ADR-036 §6 row 2 and `record_step` admit four literal `style.set` properties and no dependencies. A match is refused. This interacts with piece 1c: 1c's OPEN-9 (A) withholds the saved-here mark when the style differs from the steps, and its recovery restores only the four literal keys.
  - (A′) ADR-036's pre-acceptance block (1c's OPEN-1 (i)) also admits a `match` value on `fillColor`, with the step's dependencies naming the match column and its type. A small data-lane piece widens `record_step` before PR B merges, or as the first commit of 1c's step 1. Milestone 4 stays shell-only.
  - (B) Milestone 4 carries the protocol and kernel widening itself. That collides with 1c's `protocol/` steps under rule (00).
  - (C) Not recorded. A class-C row, KL-6, and 1c's mark withheld after any category style.

  **Recommend (A′).** It is time-sensitive: it must be ruled before you type ADR-036's acceptance, or it becomes a version-2 amendment.
- **OPEN-5. Which columns may be a match key.** §5a is text only. The rule exists in Rust only (`renderer/src/compiled.rs:225-239`), and entry 79, item (3) keeps type logic out of panels.
  - (a) The shell reads the emitted field type. That is a re-implementation in the shell.
  - (b) A kernel `describe` fact. That is a wire change.
  - (c) `renderer/style-ts` exports the rule, pinned to Rust by new agreement-vector rows (ADR-022 point 2).

  **Recommend (c).**
- **OPEN-6. Building the cases.**
  - (a) Taken from the features the map holds, in code-point order, up to 12 (the palette), with the rest drawn as Other.
  - (b) By frequency.
  - (c) Typed by the user.
  - Separately: per-case colour edits in or out.

  **Recommend (a), and per-case edits out** (a later node).
- **OPEN-7. The first scope.**
  - (A) One bounded `viewport_query` (`bbox` null, the filter, limit 1,000, the projection), unordered, no sort.
  - (B) The resident features only, labelled as in the view. That does not meet your definition of the first scope.
  - (C) A new ranged or ordered SKP command, by your ruling, in a later node.

  **Recommend (A).**
- **OPEN-8. The second scope.**
  - (a) Membership is established from captured rows, resident batches and the first scope's result, with the rest counted as not established.
  - (b) An `id IN (…)` predicate. It is refused for the session-ordinal tier and bounded by the predicate's 4,096 bytes.
  - (c) A new SKP command.

  **Recommend (a).**
- **OPEN-9. Connections.** Today at most 3 tiles and 1 export are open, which is 4 of 4. The table makes a fifth reachable.
  - (A) The table yields to an export, and execute cancels the table's stream. The cancel-path lease race (`engine/README.md:325-336`) is declared as KL-5, a typed refusal.
  - (B) Export execute is blocked while the table streams.
  - (C) Declared only.

  **Recommend (A).**
- **OPEN-10. Command bar.**
  - (a) `/colour` and `/table` reveal entries, which take nothing.
  - (b) `/colour <column>` with completion.
  - (c) None.

  **Recommend (a).**
- **OPEN-11. PR order.** Under OPEN-4 (A′), A, then C, then B, so that the table does not wait on the recording piece. Under (C), A, then B, then C.
- **OPEN-12. At the attribute ceiling.**
  - (a) Display degrades: the batch is not-held, and its geometry and match column are kept.
  - (b) The batch is refused like the vertex ceiling.

  **Recommend (a).** Inspection degrades; the map never does.
- **OPEN-13. A MultiType e2e fixture with an oracle sidecar**, written by a new generator in `kernel/tests/manual_walkthrough_fixtures.rs` (test code only).
  - (a) Yes.
  - (b) filter-zoned only, with no proof for `bigint`, `Float32` or boolean.

  **Recommend (a).**
- **OPEN-14. P6 wording.** Every placeholder is sighted at row 10.
- **OPEN-15. ADR-023's text against this piece.**
  - §6 places attributes in the hover readout.
  - §7 and §11 item 6 say style stays ephemeral in B1. ADR-022 Amendment 1 has since granted style recording in the session history.

  **Recommend** dated notes at ADR-023's acceptance (B1's closing node), in your words. This piece edits no ADR.

# What I could not settle

- **The full commit id of 2cd77a29, and every hash.** The custodian fills them by script.
- **OPEN-4's timing against ADR-036's acceptance.** This is the one item that cannot wait for this piece's slot.
- **arrow-js behaviour.** H1, H6 and H7 rest on reading arrow-js; the copy mechanism for the attribute buffers is the worker's, under PA-U3.
- **Whether `MAX_ADMISSION_CONNECTIONS` (4) is reached** with 3 tile admissions, the table's and an export's prepare all at once. §2.4 (e) restates the comment and declares it; I did not trace publish's admission lease.
- **1c's actual paths at its step bases, and milestone 3 PR B's effect on pins.** These wait for the re-sweep.
- **The reuse rows I read in the clone** are at a checkout whose commit I could not verify.
- **The budgets are bottom-up estimates.** Milestone 3 and 1b overran theirs.
