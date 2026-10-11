*Custodian's filing note (2026-10-11): the architect's draft of `shell-migration-milestone-3`'s preregistration, on the custodian's brief at main ceff6d82 (forms ahead: the 2026-10-11 direction, item 1b), drafted alone. The brief's first full hash was mistyped by the custodian and corrected by message before the draft; the draft reads at the right one. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 4383545a9772c59e802ef03c3de077e2118c23a317f45d3b4912cfe6598a67bb. Write audit PASS: zero write calls (Read 51, Grep 37, Glob 6). Run window from the transcript: 2026-10-11T18:47:17Z to 2026-10-11T19:08:54Z. The form is committed beside it with its 57 pins hashed by the custodian at ceff6d82; its HASH-TBD placeholders here are left as drafted.*

---

Reviewed: main @ ceff6d82bdd3223fefed46e209913db6d1552d40

**Verdict:** the draft is ready to commit, with its pins hashed by the custodian. Eleven OPEN items go to the human; seven are red lines.

**The hash.** I have no Bash, so I read the commit from `.git/refs/heads/main`. It gives ceff6d82bdd3223fefed46e209913db6d1552d40, which matches your correction; the hash in the original brief (ceff6d826e6e…) was wrong. The session's git status shows main checked out with only untracked files, so every tracked file below was read at that commit. I read the node at `PLAN.yaml:4965-4981` @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD. It is proposed, generation 1, depends on `shell-migration-milestone-2`, and its summary carries the 2026-10-11 direction and the 2026-10-07 bounds.

## 1. The form, why, and what is the human's

**Full form, with full gating from dispatch** (`AUTONOMY.md` §21a, §21c, §25(e)). Each of these is enough on its own:
- **Size.** About 5,600 lines over about 26 files, tests included. §21c's limit is 150 lines over 8 files.
- **New user-visible behaviour,** which §21c excludes in its own words.
- **A new exposure surface.** The bar becomes a second way in to opening a dataset and to the Export section.
- **Properties under test are touched:**
  - `applyFilter`'s commit-only-on-issue rule and its recovery after a refusal;
  - ADR-021's liveness and Cancel, which stay in FilterPanel;
  - milestone 1's rule that the map is mounted once per handle;
  - milestone 2's selection and scope contracts, crossed by the card actions.

No five-line form is committed.

**No engine, kernel or protocol path is needed.**
- A combined filter reaches the kernel through the existing `applyFilter`, as one `Filter {predicate, dialect}`.
- So no lead-data impact read comes before code.
- If an option the human picks would need one, that is invalidator I11, which stops the piece.

**What is the human's: eleven OPEN items (section 3).**
- Red lines, ruled in typed words only:
  - OPEN-1: how the bar behaves;
  - OPEN-2: the Filter section's model;
  - OPEN-3: where a clause ends;
  - OPEN-4: field completion;
  - OPEN-5: `/open` and `/export`;
  - OPEN-6: native menus on macOS;
  - OPEN-7: the scale display.
- Not red lines:
  - OPEN-8: the keys;
  - OPEN-9: P6 wording and the 2e sentences;
  - OPEN-10: whether milestones 3 and 4 swap;
  - OPEN-11: one PR or two.

**Findings where the plan and the code meet badly.** I settled none of them myself; each is an OPEN item.
- **F1, clause boundaries (OPEN-3).**
  - Plan §7 combines enabled cards with `AND`. A text clause can close its own bracket, for example `a = 1) OR (1=1`. Next to another card, the text is still valid SQL, so the kernel admits it, and the cards then show a meaning the map does not have.
  - ADR-021's two-sentinel probe protects the kernel's own bbox and `LIMIT` (`docs/adr/ADR-021-row-filter-on-viewport-query.md:100-116` @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD). It does not protect where one card ends and the next begins.
  - ADR-021 rule 6 refuses a hand-written lexer at every admission stage (`docs/adr/ADR-021-row-filter-on-viewport-query.md:75-85` @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD).
- **F2, the camera re-fits on every card change (OPEN-2).** Every issued filter calls `resetFitForNewGeneration` (`frontends/shell/src/App.tsx:336-339` @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD). So a card switched on or off re-fits the camera unless the path changes.
- **F3, `/export` (OPEN-5).** The existing button's handler starts a class-3 flow with the panel's scope choice (`frontends/shell/src/publish/PublishPanel.tsx:413-415` @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD). Called from the bar, the user would not see that choice.
- **F4, `/open`.** `handlePick` has no in-flight guard of its own; the button's `disabled` is the guard (`frontends/shell/src/admission/AdmissionPanel.tsx:290-296` and `:348-350` @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD). The form's handle takes the same condition.
- **F5, native menus (OPEN-6).** They would be a code path that runs only on macOS. It can be checked here at L1 at most, and the menu permission is not read in `core:default` (`frontends/shell/src-tauri/capabilities/default.json:6-10` @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD).
- **F6, the scale display (OPEN-7).** It needs either a fourth exception under `canvas/` or a measurement App does not own. Its honest unit is the CRS's linear unit, not distance on the ground.
- **F7, an existing test that breaks.** U5 asserts that Ctrl+K matches nothing (`frontends/shell/src/layout/actionRegistry.test.ts:49-51` @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD). It is declared as an edit, with its meaning kept.
- **F8, a sentence of the human's (2e).** KNOWN-LIMITATIONS item 39's exception names a filter Apply or Clear. A card change takes the same path, so a replacement sentence is drafted with its clause check (OPEN-9).

**What milestone 1's record and milestone 2's figures teach §7:**
- Milestone 1's G5 was over by 104 lines: about 52 lines of recorded-mutation comments were never budgeted (its Amendment 9, item 7). Here about 4 lines per test are counted inside the test groups.
- Its G6 was over by 347 lines (Amendments 8 and 11). The causes were edits to existing suites that the form never named, a step added after a gate finding, and `layout.mjs` landing at 417 lines against 360. Here every e2e file is named with its own ceiling and reason, plus one disclosed margin per PR. The new suite is budgeted at about 60 lines per step.
- The count base moved when main was merged into the branch (milestone 1, Amendment 9, item 7). Here the base rule is stated.
- Milestone 2's phase 0 re-sweep found two existing tests that its phase B breaks (its Amendment 2, item 5). Here the existing tests this piece breaks are named in advance: U5's id list and its K case, and milestone 2's UA4 union test.
- Milestone 2 split into two PRs (its Amendment 1, A12). That is the model for OPEN-11.

## 2. The draft

````markdown
# Shell migration, milestone 3 — command bar and filter clauses: Ctrl+K, slash commands, typed /filter with field completion, clause cards with on and off
# (PLAN node shell-migration-milestone-3)

File: frontends/shell/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md
Authority: the RULED 2026-10-07 block for the migration plan's second version (state/directives/2026-10-07-migration-plan-v2-ruled.md:16 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD); the plan, state/directives/SHELL-MIGRATION-PLAN-2026-10-07.md, §2, §3, §4 and §7 (state/directives/SHELL-MIGRATION-PLAN-2026-10-07.md:221-231 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD) and §13; question round 66, item 2 (open and export join the registry in this milestone); the human's direction of 2026-10-11, items 1a and 1b (state/directives/2026-10-11-direction-after-status-review.md:8-10 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD): slot 1's next piece after milestone 2, with this form and its question round drafted while milestone 2 is in code.
Drafted by: the architect agent, alone (no engine, kernel or protocol path; the product-first direction, section 1); read at main ceff6d82bdd3223fefed46e209913db6d1552d40.
Committed before any code. Append-only once committed. An amendment made after any outcome has been seen says so in its first line.
Form: full (AUTONOMY.md §21a: size per §21c, new user-visible behaviour, a new exposure surface, and properties currently under test; §25(e)).

## §0. Disclosure

0.1 Inputs.
- The plan, whole, and its ruling.
- The human's direction of 2026-10-11, items 1 and 2.
- Question round 66 (state/questions/round-66.md:12-13 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD) and its ruling, cited by round and item.
- state/directives/O-07-WALKTHROUGH-2026-10-05.md, steps 2 and 3 (state/directives/O-07-WALKTHROUGH-2026-10-05.md:29-37 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD) and its notes row for step 3.
- The design notebook, state/drafts/design/SPATIAL-IDE-DESIGN-NOTEBOOK.md, §3.4, §5, §6 and §12. It is not Authority.
- The layer-model reference, state/drafts/design/LAYER-MODEL-DECISIONS-2026-09-28.md. It is not Authority.
- state/directives/PORTABILITY-2026-09-30.md §2 and §5.
- ADR-001 and its 2026-08-09 amendment; ADR-006; ADR-010 rules 1 and 6; ADR-021 (its Decision, whole); ADR-024; ADR-036, which is Proposed and binds nothing.
- SKP-V0 §7.2 to §7.5.
- engine/src/predicate.rs, read only as the consuming side of the filter seam.
- Milestone 1's form with Amendments 1 to 13.
- Milestone 2's form with Amendments 1 to 3, read last amendment first, and its drafting record.
- The OPEN-11 ruling (state/directives/2026-10-11-open-11-a-piece-f-opens-ported-notices-required.md:6-11 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD).
- The product-first direction, sections 1, 2 and 4.
- The shell's code, styles, e2e suites, MANUAL-WALKTHROUGH.md and KNOWN-LIMITATIONS.md at ceff6d82.

No pilot, no spike, and nothing measured.

0.2 The reuse index (the standing step, the 2026-10-09 direction, item 5).
- **The run.** The custodian ran `node tools/reuse.mjs <words>` in christopherdonini/spatial-ide-reuse at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c, the tool at that commit, for the words command bar, command palette, filter, completion, slash command and clause. The custodian appends the printed lines beneath this item, byte-copied by script and marked. No miss was printed.
- **What this form takes.** Each row is cited by repository, commit, file and row name, and every summary here is a paraphrase:
  - `combobox-accessibility`, WAI-ARIA APG combobox pattern [ADOPT] (christopherdonini/spatial-ide-reuse @ 89bbac37, REUSE-ROUND-1.md, row `combobox-accessibility`). It is a specification, not a package. The bar takes its roles and states (§2.3). Its Tab rule differs, as the notebook's §3.4 records, and is tested (UC2). No dependency.
  - `command-palette` (VS Code, Lumino, cmdk, Zed; all CONCEPTUAL; kbar REJECT). From cmdk's row, the idea of ignoring IME composition. From Lumino's, one registry feeding every surface. No code is taken.
  - `command-registry-native-menus`: `@tauri-apps/api` [ADOPT, already a dependency]. It is used only if OPEN-6 is ruled (b). Nothing is added.
  - `fuzzy-matching`: `@codemirror/autocomplete` [PORT], uFuzzy [WATCH], and others. Not used. Search is a case-insensitive substring match over about twelve entries (§2.3). No matcher is written or ported. A fuzzy matcher would be a dependency or a port, which is the human's typed word, and none is proposed.
  - `filter-cards-round-trip` (Kibana, Metabase, Superset, Grafana Scenes CONCEPTUAL; Grafana and react-querybuilder REJECT). From Metabase's row, a card only on an exact shape match and otherwise a whole expression, the shape OPEN-3 (A) proposes. From Kibana's, cards that are off are left out before combining. No code is taken.
  - `typed-slash-command-completion` (tiptap and `@codemirror/autocomplete`, CONCEPTUAL). The trigger rule of §2.4. No code is taken.
  - `selection-scope-table` is milestone 4's and is not used.
- **No dependency** is proposed (plan §2 rule 4).

0.3 Pins, and the re-sweep at code start.
- **Every `@ ceff6d82…` pin is historical.** Milestone 2 changes App.tsx, the registry, StudioLayout, contributions, PublishPanel, AdmissionPanel (its B3, if built) and adds `src/workspace/` and `src/feature/`. Most pins into those files will move.
- **The re-sweep.** No code is written before milestone 2's phase B PR has merged. At this piece's code base, which is the merge base with origin/main when PR A's branch is cut, a read-only re-sweep runs before any code, as milestone 2's phase 0 did. It does the following:
  - recomputes every pin;
  - reads every §0.5 interface as the tree has it;
  - runs every e2e suite at the base and lists the runs;
  - names the next unused walkthrough letter and the next free KNOWN-LIMITATIONS numbers.
- **What it may find.** A moved cite is class 3. An interface that differs from §0.5 is I4, or I10 if it changes a seam's shape. A suite that fails at the base is I12.
- **Which is authoritative.** For the work, the tree at the base is authoritative. For what this form read, the pin is (round 14).
- **The re-sweep amendment** (§10) is written before any code. PR B's base gets a class 3 row of its own for every pin PR A moved.

0.4 The shell as read.
- **One predicate, sent as typed.** FilterPanel's input goes through `predicateTextToFilter`. That function turns empty into null and sends everything else verbatim, with no trim and no ceiling, and the kernel is the only admission authority (frontends/shell/src/filter/predicateInput.ts:7-21 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD). The panel's Apply and Enter both call its `submit` (frontends/shell/src/filter/FilterPanel.tsx:52-75 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD). It shows the applied predicate (frontends/shell/src/filter/FilterPanel.tsx:123 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD) and its own refusal (frontends/shell/src/filter/FilterPanel.tsx:132-136 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD).
- **The filter seam in App.**
  - `applyFilter` (frontends/shell/src/App.tsx:300-342 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD). It cancels the pending debounce and issues `requestViewport(null, newFilter)`. It commits and re-fits only on an issued outcome. On a refusal it formats the refusal first, then re-issues the last applied filter over the last view. Any other outcome is not applied.
  - Its deps (frontends/shell/src/App.tsx:243-272 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD) and outcome (frontends/shell/src/App.tsx:236-241 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD).
  - App binds it in `handleApplyFilter` under a generation guard (frontends/shell/src/App.tsx:929-965 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD).
  - The commit writes the ref and the state (frontends/shell/src/App.tsx:901-904 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD; frontends/shell/src/App.tsx:816-817 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD).
  - Milestone 2 phase A routes this commit through `filter.apply` (its §2.1(b)).
- **Two dev hooks also call `applyFilter`:** frontends/shell/src/App.tsx:1407 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD and frontends/shell/src/App.tsx:1568 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD.
- **The Filter slot** keys FilterPanel per dataset (frontends/shell/src/App.tsx:1674-1688 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD). The export gets only `activeFilter !== null` (frontends/shell/src/App.tsx:1975-1983 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD).
- **Keys.**
  - One `keydown` listener on `window` (frontends/shell/src/layout/StudioLayout.tsx:152-164 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD) calls `runAction` (frontends/shell/src/layout/StudioLayout.tsx:146-150 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD).
  - The registry holds four entries and the one platform read (frontends/shell/src/layout/actionRegistry.ts:14-35 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD; matcher frontends/shell/src/layout/actionRegistry.ts:73-84 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD). The chords act even while a text field has the focus (milestone 1, §2.3(c)).
  - Milestone 2 adds bare N and S, ignored in text fields (its Amendment 1, A4).
  - The canvas's Deck has `controller: true` (frontends/shell/src/canvas/WorkingCanvas.tsx:1940 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD).
- **The top bar** holds only the title and the toggles (frontends/shell/src/layout/StudioLayout.tsx:207-228 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD). The plan puts search there from this milestone (state/directives/SHELL-MIGRATION-PLAN-2026-10-07.md:78 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD).
- **Open.** The Open button calls `handlePick`, guarded only by the button's `disabled` (§1 F4 of the drafting record; the AdmissionPanel pins in §0.5).
- **Export.** PublishPanel owns its `expanded` state (frontends/shell/src/publish/PublishPanel.tsx:328 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD) and its disclosure (frontends/shell/src/publish/PublishPanel.tsx:502-514 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD).

0.5 Consuming-side interfaces, read before any seam is drafted.
- **The kernel's admission.**
  - The kernel receives one `Filter {predicate, dialect}`, with `dialect` fixed (frontends/shell/src/skp/types.ts:17-20 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD; frontends/shell/src/skp/types.ts:244-251 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD).
  - It composes the predicate as `WHERE (<predicate>) AND <bbox>` (protocol/skp/SKP-V0.md:403-421 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD).
  - It admits by `AdmittedPredicate::admit` (engine/src/predicate.rs:113 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD).
  - It refuses a predicate over 4,096 bytes by name before parsing (engine/src/predicate.rs:59 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD; engine/src/predicate.rs:120-126 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD), and one deeper than 32 levels (engine/src/predicate.rs:70 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD).
  - Its admitted constructs are protocol/skp/SKP-V0.md:442-458 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD, and its refusal codes protocol/skp/SKP-V0.md:465-483 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD.
  - Its namespace is the schema without the geometry column and without columns not admitted for filtering, judged by the kernel (protocol/skp/SKP-V0.md:423-425 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD).
- **The schema the shell holds.** `describe.schema[]` is `{name, arrow_type, nullable, projectable}`, with no filterable flag (frontends/shell/src/skp/types.ts:158-167 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD). `describe.geometry.column` names the geometry column (frontends/shell/src/skp/types.ts:116-129 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD; frontends/shell/src/skp/types.ts:186-191 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD).
- **The open path.** AdmissionPanel's Props (frontends/shell/src/admission/AdmissionPanel.tsx:258-260 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD), `handlePick` (frontends/shell/src/admission/AdmissionPanel.tsx:290-296 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD) and the button (frontends/shell/src/admission/AdmissionPanel.tsx:348-350 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD). Milestone 2's B3 may add `confirmOpen` to this path; it is read at the base.
- **The export panel.** Props frontends/shell/src/publish/PublishPanel.tsx:284-305 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD; the button frontends/shell/src/publish/PublishPanel.tsx:604-611 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD. Milestone 2 adds `stageScope`, `checkStagedScope` and `onExportRunning`; they are read at the base.
- **The registry and the frame.** StudioLayout's props (frontends/shell/src/layout/StudioLayout.tsx:107-117 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD), the label functions (frontends/shell/src/layout/actionRegistry.ts:86-95 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD), and the slots (frontends/shell/src/layout/contributions.ts:66-72 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD). Milestone 2's additions are read at the base: `topBar.tools`, the tool ids, `matchToolKey`, and the scope declarations.
- **Milestone 2's workspace, read at the base and drafted here against its ruled form:**
  - `ViewState`, `filter.apply` and the union of `applyViewTransition` (its §2.4);
  - `resource.admitted`'s reset of the filter (its §2.1(a));
  - `resolveScope` and `checkScope` (its §2.5);
  - the selection's survival of `filter.apply` (its §2.3, UB5).
- **The render harness.** frontends/shell/src/App.layout.test.tsx:11-14 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD. It mocks the SKP client (frontends/shell/src/App.layout.test.tsx:64-103 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD) and the stream manager, whose `requestViewport` never settles (frontends/shell/src/App.layout.test.tsx:109-119 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD). This piece's copy makes that boundary settle per test (§4).
- **The Tab walk.** frontends/shell/e2e/layout.mjs:190-221 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD.

0.6 Hypotheses. Each carries its discriminator.
- **H1.** For two clauses the kernel admits alone, on filter-zoned.parquet, it admits `(t1) AND (t2)`, and the map shows the conjunction. Discriminator: E-AND.
- **H2.** A real Ctrl+K reaches the page in WebView2: no browser accelerator takes it. CDP injection does not cross that layer (milestone 1, H2). Discriminator: row Y1, with real keys. If it fails: I7.
- **H3.** Every existing e2e suite passes unedited at each PR's head, under OPEN-2 (A). The input in the header counts as part of the top bar in layout.mjs's walk, and focus alone opens no list. Discriminator: the suite runs. If it fails: I3.
- **H4.** Keys typed in the bar never reach deck's keyboard controller, because the bar is outside deck's element. Discriminator: row Y7.
- **H5.** Under OPEN-3 (A), a text the recognizer accepts has no bracket or comment token outside a literal or a quoted name. So `(t)` is one operand of the `AND`. Discriminator: UC4's table and E-AND. No admission claim follows from it: the kernel still admits or refuses the whole text.
- **H6** (only under OPEN-6 (b)). `core:default` grants the menu permissions. Discriminator: a read at the base. If false: I13.

0.7 Fixtures.
- Nothing is measured.
- If a suite reads the 5 GB fixture, its drive is recorded as a confound.

## §1. May and may not claim

- **May claim:** §2's behaviour and the properties §4 tests.
- **May not claim:**
  - any performance figure or docs/08 row (the ADR-001 amendment's no-claim);
  - macOS or Linux above L1 (PORTABILITY R5);
  - that the shell admits, validates or checks a predicate. Under OPEN-3 (A) the shell decides only whether a text can be shown as a card next to others, never whether it is admissible;
  - that anything here is undoable, logged or saved. Clause changes are workspace mutations (ADR-006), with no log and no undo in this milestone; B2's compaction is B2's;
  - any statistic about a field;
  - `#` feature search;
  - under OPEN-7 (a), a distance on the ground or a printed scale ratio.
- **No change** to the wire, the kernel, the engine, the protocol, src-tauri (its capabilities included) or the renderer.
- **ADRs cited, none amended:** 001, 006, 010, 021 and 024. ADR-036 is a Proposed design input.
- **Principle 4 (docs/01).**
  - A command run from the bar records the same rows its button or chord records, because it calls the same handler.
  - Each clause action records one class-C row, with a P6 statement that it has no API equivalent. What reaches the kernel is the one combined predicate, recorded as its viewport_query row.
- **Operator-visible text.** The kernel's refusal is shown as RefusalBlock shows it today, with the code and the kernel's message. The shell's own lines state only the shell's consequences, such as the cards being unchanged.
- **Strings.** Every new operator string is the human's at P6 (plan §2 rule 7).

## §2. The change

A part marked [OPEN-n] binds only as Amendment 1 rules it. Under OPEN-11 (b), §2.2 to §2.3 and §2.7 are PR A, and §2.4's filter half, §2.5 and §2.6 are PR B.

### 2.1 What stays exactly as it is

The following are not edited:
- `applyFilter`, `requestViewportWithSingleRetry` and `makeDebouncedViewportQuery`;
- `ApplyFilterDeps` and `ApplyFilterOutcome`;
- `predicateInput.ts`;
- `FilterPanel.tsx` (OPEN-2 (A));
- the `Filter` type;
- everything under `skp/`, `streaming/` and `residency/`;
- the dev hooks' bodies.

A clause reaches the kernel as one `Filter` that `applyFilter` issues exactly as an Apply does.

### 2.2 The registry (seam 1, full), `layout/actionRegistry.ts`

- **The entry shape.** `ActionEntry` gains `command: string | null` (the slash word, P6) and `takes: "nothing" | "condition"`. The matcher's body is unchanged.
- **New entries:**
  - `command.focus`: chord `{letter: "k", code: "KeyK"}`, no word, so it is shown in help and left out of search;
  - `dataset.open` [OPEN-5];
  - `layer.revealExport` [OPEN-5];
  - `filter.addClause`: `takes: "condition"`, PR B.
- **Words for every entry,** milestone 2's included (P6): layers, inspector, activity, zoom-to-layer, navigate, select, zoom-to-selection, clear-selection, open, export, filter.
- **Product callers:**
  - the keydown listener, for Mod+K;
  - the bar, for every other entry.
- **Availability.** StudioLayout supplies `available(id)` from App's props:
  - no dataset: only open and the layout entries are available;
  - Zoom to selection follows milestone 2's empty-selection rule;
  - `dataset.open` is unavailable while an open is in flight.
- **Exactly one platform read,** the existing one (§2.11).

### 2.3 The command bar, `src/command/CommandBar.tsx` (new), in the top bar

- **Where it sits.** StudioLayout mounts it after `.app-header`, never over the map (rule 11).
  - Its input carries the APG combobox roles and states: `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-autocomplete="list"` and `aria-activedescendant`.
  - Its list is `role="listbox"` with `role="option"` children, and `aria-disabled` on unavailable entries.
  - Classes: `.command-bar` and `.command-list`.
- **Ctrl+K (Mod+K)** focuses the input and selects its text. It does nothing more when the input already has the focus. StudioLayout keeps the element that held focus before.
- **The list** [OPEN-1]:
  - it opens on the first typed character or on ArrowDown, never on focus alone;
  - it closes on blur and on Escape;
  - it is shown only while open, below the top bar, up to COMMAND_LIST_MAX_HEIGHT_PX, scrolling inside;
  - nothing of it is rendered while it is closed.
- **What it lists** [OPEN-1]:
  - **`/word`:** entries whose word starts with the typed word, case-insensitive, in registry order;
  - **plain text:** entries whose label or word contains the text, case-insensitive, in registry order. No ranking, and no fuzzy matching;
  - **`?`:** every entry with its word, label and shortcut (`shortcutLabel`); any text after `?` narrows the list the same way;
  - **unavailable entries** are listed, marked, and never run.
- **Keys** [OPEN-1]. They go through one pure reducer, `commandBarKey(state, key)`, in `src/command/commandDraft.ts`. Every key with `isComposing` is ignored.
  - **Tab:** completes when the list is open and an option is active, or when exactly one candidate exists. It completes the draft to that word or field name, closes the list and prevents the default. Otherwise Tab is not intercepted. After a completion the list stays closed until the next typed character, so a second Tab always leaves.
  - **Shift+Tab:** never intercepted.
  - **Enter:** applies the active option, or else a draft that resolves exactly; otherwise it shows the P6 line for that case. Enter never completes.
  - **Escape:** closes the list, or else returns focus to the element held before. If that element is gone or inside a closed region, focus goes to the map region, milestone 1's target.
- **Running.** An applied action calls StudioLayout's `runAction(id)`, the function its chord and its button call. The bar then closes and returns focus as Escape does. Two exceptions:
  - `layer.revealExport` moves focus to the Export button (§2.7);
  - an applied `/filter` clears the draft and keeps the focus, so that a second clause can be typed. A refused one keeps the draft, with its refusal shown below the input.
- **Bare keys.** Milestone 2's N and S stay ignored while the input has the focus (its guard). The milestone 1 chords still act and insert nothing.

### 2.4 Draft to resolved intent (seam 2), `src/command/commandDraft.ts`

- **The form is narrow.** `resolveDraft(text, registry, available)` returns one of:
  - `empty`;
  - `help {query}`;
  - `commands {word, candidates}`;
  - `search {query, candidates}`;
  - `run {id}` (an exact `/word` for a `takes: "nothing"` entry);
  - `filter {text, field}` (`/filter`, then the text after the first run of whitespace following the word, kept byte for byte);
  - `unresolved {reason: "unknown-command" | "filter-empty"}`.
- **What it reads.** Nothing parses the condition. The only thing read inside it is the `@` trigger: an `@` at the condition's start, or after whitespace or `(`, followed by name characters up to the caret.
- **Emptiness.** A whitespace-only condition counts as `filter-empty`. That test is the only use of a trim, and nothing is trimmed when the condition is sent.
- **Field completion** [OPEN-4], `src/command/fieldCompletion.ts`, in PR B.
  - **Candidates:** `describe.schema` names except `describe.geometry.column`, in schema order. They are matched case-insensitively on the text after `@`, at most FIELD_COMPLETION_MAX_OPTIONS at once.
  - **Each option** shows the name, with `arrow_type` verbatim beside it. No count, no value list and no range.
  - **Completing** replaces `@` and the partial name with the name, always double-quoted, with each `"` in the name doubled [OPEN-4 (a)].
  - **No schema policy.** The shell does not narrow the list by type. That is the kernel's policy (SKP-V0 §7.3), and a name the kernel does not admit is refused by name when the condition is applied.
- **Resolved intent.** It is `{action: ActionId}`, or `{action: "filter.addClause", params: {text}}`. Its typed-action shape is ADR-036 §6's Proposed `intent`. No B2 registry lands.
- **What this seam has none of:** a parser, a resolver service, or a new SKP schema.

### 2.5 Filter clauses (PR B), `src/workspace/filterClauses.ts` (new) and milestone 2's workspace

- **The state.** `FilterClause = {id: ClauseId, text: string, enabled: boolean}`. `ClauseId` is `clause-<n>`, minted per view and session and never persisted. `ViewState` gains `clauses: readonly FilterClause[]`.
- **Invariant:** `view.filter` deep-equals `combineClauses(view.clauses)` after every transition.
- **`combineClauses`.** It takes the enabled clauses in list order:
  - none: `null`;
  - one: `{predicate: text, dialect}`, the text byte for byte, so a single card sends exactly what the panel sends today;
  - two or more: each text inside one pair of brackets, joined by ` AND `.

  A clause that is off is left out before combining. Nothing is rewritten, trimmed or case-folded. There is no ceiling in the shell: the kernel's byte and depth ceilings refuse by name.
- **`recognizeSimple(text)`** [OPEN-3 (A)]. An anchored pattern over the whole text, with optional spaces and keywords matched case-insensitively. It accepts:
  - a name: either `[A-Za-z_][A-Za-z0-9_]*`, or a double-quoted name using `""` for an embedded quote;
  - followed by one of:
    - a comparison operator (`=`, `==`, `<>`, `!=`, `<`, `<=`, `>`, `>=`) and a literal;
    - `IS [NOT] NULL`;
    - `[NOT] IN (` a comma-separated literal list `)`;
    - `[NOT] BETWEEN` literal `AND` literal;
    - `[NOT] LIKE` or `[NOT] ILIKE` and a string literal.
  - A literal is `-?[0-9]+(\.[0-9]+)?`, or a single-quoted string using `''` for an embedded quote.

  It returns a yes or a no and never a rewritten text. Text it does not accept is an advanced card. It is a test of how a text is shown, not an admission. ADR-021 rule 6's refusal of a second grammar governs admission, which stays the kernel's (OPEN-3 says why the human decides this).
- **`proposeClauseChange(clauses, step, mintId)`.** It returns either `{kind: "propose", clauses, filter}` or `{kind: "refuse", reason: "advanced-alone", blocking}`. Under OPEN-3 (A), it refuses:
  - adding or turning on an advanced clause while any other card is on;
  - adding or turning on any clause while an advanced card is on.

  Under (B) it never refuses.
- **Transitions** (milestone 2 §2.4's union gains one):
  - `filter.clauses.set {clauses, step}`, where `step` is `{kind: "add", clause}`, `{kind: "setEnabled", clause, enabled}` or `{kind: "remove", clause}`;
  - milestone 2's `filter.apply {filter}` also sets `clauses` to none, or to one new enabled clause holding the filter's predicate;
  - `resource.admitted` resets `clauses` together with the filter.

  The `step` carries the clause id, so B2 can collapse a clause's toggles (plan §10.3).
- **The path to the kernel** (App.tsx).
  - `handleApplyFilter` becomes a wrapper over one internal `applyFilterWith(filter, commit)`. Its deps are today's (§0.4) with `commitActiveFilter` replaced by `commit`, under the same generation guard. `applyFilter` itself is unchanged (§2.1).
  - FilterPanel's `onApply` commits `filter.apply`, as in milestone 2.
  - A bar or card action computes `proposeClauseChange`. On `propose`, it calls `applyFilterWith(proposal.filter, commit)`, where `commit` writes `activeFilterRef.current = proposal.filter` and dispatches `filter.clauses.set {clauses: proposal.clauses, step}`.
  - On `refuse`, nothing is sent and the shell's P6 line is shown.
- **What each outcome does:**
  - `applied`: the transition, so the cards and the filter change together;
  - `refused`: no transition. The kernel's refusal is shown (RefusalBlock) where the change was made, with the shell's lead line;
  - `not-applied`: no transition, and its P6 line.
- **One change at a time** [OPEN-2]. While a bar or card change is pending, the card controls and the bar's `/filter` Enter are `aria-disabled`, with a P6 line. FilterPanel is unchanged and keeps its own busy rule. A panel Apply made meanwhile supersedes as today, and the last commit wins. The view stays consistent because each commit carries its own list.
- **Seams crossed:**
  - **Seam 6:** a clause action uses the view's filter, staged and run in one handler. A card change is a filter change for milestone 2's `checkScope`, so an export staged before it is refused at execute.
  - **Seam 5:** the selection is untouched by clause transitions, as by `filter.apply`.
- **Re-fit** [OPEN-2]. Each applied card change re-fits the camera, as an Apply does. That is the human-approved 2026-08-15 design (App.tsx:279-288's comment), which this piece does not change.
- **Rows.** One class-C row per user action, at the action, before its outcome: `filter.clauseAdd`, `filter.clauseToggle` and `filter.clauseRemove`, recorded in App's handlers, which are already allowlisted.

### 2.6 The Filter section's cards, `src/filter/ClauseCards.tsx` (new), PR B

- **Placement.** Rendered in `section.filter` after FilterPanel, keyed `clauses-${admitted.dataset}`.
- **Each card** shows its text verbatim (it wraps), a switch (`role="switch"`, `aria-checked`), a Remove button, and, under OPEN-3 (A), an advanced marker.
- **One statement** shows whenever any card exists (P6, OPEN-9).
- **Refusals** of card changes are shown at the cards' foot.
- **Panel Apply and Clear** [OPEN-2 (A)]: Apply replaces every card with one card holding its text, and Clear removes every card.

### 2.7 `/open` and `/export` [OPEN-5]

- **`dataset.open`.**
  - AdmissionPanel becomes `forwardRef` with the handle `{requestPick(): "started" | "busy"}`. It runs `handlePick` unless `isOpenInFlight(state)`, the button's own condition.
  - App holds the ref, and `dataset.open` calls it.
  - Milestone 2's `confirmOpen`, if built, lies inside the same path.
  - Nothing else in AdmissionPanel changes.
- **`layer.revealExport`.** Under (A), it never starts an export.
  - StudioLayout first applies `toggle(inspector)` if the Inspector is closed, and `selectTab(inspector, layer)`. Their rows are recorded.
  - Then App calls PublishPanel's new handle `{reveal(): void}`. That sets `expanded`, recording the existing `publish.togglePanelExpanded` row only if the panel was closed, and focuses `.publish-open`, or `.publish-disclosure` while the button is disabled.
  - `publishPrepare` and `publishExecute` are never called from the bar.

### 2.8 Conditional parts

- **Under OPEN-7 (a), the scale display** (PR B, the SC group):
  - WorkingCanvasHandle gains one read-only method, `cssPixelsPerUnit(): number | null`. It returns `2^zoom` from the camera the canvas already holds, or `null` before a camera (the CSS-pixel reading at frontends/shell/src/canvas/viewportBbox.ts:16-23 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD).
  - `STATUS_ITEMS` gains `scale`.
  - `src/layout/scaleBar.ts` (pure) picks a length L in {1, 2, 5} × 10^k CRS units whose CSS length lies between SCALE_BAR_MIN_PX and SCALE_BAR_MAX_PX. App reads it when milestone 2's counts' box updates.
  - It is shown only when `describe.crs.unit` is `metre`, labelled in CRS units, and never as a ratio. Otherwise the item says scale is not shown and why (P6).
  - Nothing else under `canvas/` changes.
- **Under OPEN-6 (b), native menus** (PR A, the NM group):
  - `src/layout/nativeMenu.ts` builds the application menu from `ACTIONS` through `@tauri-apps/api/menu`, only when `currentPlatform()` is `mac`. The platform read stays in actionRegistry.ts.
  - It needs H6. A capability edit would be I13.

### 2.9 Boundaries

- **May edit:**
  - new `src/command/` (`commandDraft.ts`, `CommandBar.tsx`, `fieldCompletion.ts`, `commandConstants.ts` and their tests);
  - new `src/workspace/filterClauses.ts` and its test;
  - in milestone 2's `src/workspace/`, `workspaceState.ts`, `viewTransitions.ts` and their tests, for clauses only;
  - new `src/filter/ClauseCards.tsx`;
  - `src/layout/actionRegistry.ts` and its test (§4 UC8's declared edits) and `StudioLayout.tsx`;
  - `src/App.tsx`, above and below `return (`;
  - `src/admission/AdmissionPanel.tsx` and `src/publish/PublishPanel.tsx`, the handles only;
  - `src/console/surfaceRegistry.ts`, rows only;
  - `styles.css`;
  - `package.json`, one script line;
  - new `src/App.command.test.tsx`;
  - new `e2e/command-bar.mjs` and the e2e files §7 G-E names;
  - conditionally: `src/layout/contributions.ts`, `src/layout/scaleBar.ts` and `src/canvas/WorkingCanvas.tsx` (one method) under OPEN-7 (a); `src/layout/nativeMenu.ts` under OPEN-6 (b).
- **Not edited:**
  - every file outside `frontends/shell` (records excepted);
  - `frontends/shell/src-tauri/**`;
  - `src/skp/`, `src/streaming/` and `src/residency/`;
  - `src/canvas/`, except as above;
  - `src/feature/`;
  - `FilterPanel.tsx` and `predicateInput.ts`;
  - `layoutState.ts`;
  - RefusalBlock, PublishDialog, DescribeSummary, StylePanel, ConsolePanel, NoticesPanel, ErrorBanner and OriginMismatchState;
  - §2.1's list.
- **engine/, kernel/, protocol/: none.** A need for one is I11: STOP, and a lead-data impact read comes before any code.

### 2.10 End-to-end suites, operator rows, KNOWN-LIMITATIONS

- **New suite:** `e2e/command-bar.mjs`, with one `e2e:command-bar` script line. Its steps are in §4. Its oracle ids, if any are needed, come only through `e2e/lib.mjs`'s `hoverIdAfterBarrier`.
- **Existing suites:** none is expected to change (H3). layout.mjs has ≤ 20 lines only if E-FOCUS fails solely because of the bar. Any other edit is I3.
- **e2e/README.md:** the suite's section.
- **MANUAL-WALKTHROUGH.md.**
  - Existing rows are updated in place only where a location word or label changes, with no row's meaning changed and no result-log text edited. None is expected under OPEN-2 (A). Any found are listed in the PR body with their old and new words.
  - **New Part,** the next unused letter at the code base (Y, if W and X are then the last), at 1366 × 768, with a blank log:
    - Y0: read §10, the last amendment first.
    - Y1 (O-07 step 2; H2): with real keys, Ctrl+K, `/open`, Enter, then pick filter-zoned.parquet.
    - Y2: Ctrl+K, `?`, and read the help. Felt: are the prefixes clear?
    - Y3 (O-07 step 3): Ctrl+K, `/filter @zo`, Tab, type ` = 'residential'`, Enter; then `/filter "zone" IS NOT NULL`, Enter. Felt: the moment between Tab and Enter; did you know the two combine with AND; do they read as one filter on the layer; any trouble with the quotes?
    - Y4: switch one card off and on. Felt: is it clear what is on, and did the camera's re-fit surprise you (OPEN-2)?
    - Y5: with one feature selected (milestone 2's Part), switch a card off. The selection count is unchanged.
    - Y6 [OPEN-3 (A)]: with a card on, add `/filter "zone" = 'residential' OR "zone" IS NULL`. The message shows, and nothing changes.
    - Y7 (H4): Tab, Shift+Tab and Escape from the bar; arrow keys in the bar do not move the map.
    - Y8 [OPEN-5 (A)]: `/export`. The Export section opens, and nothing is exported.
    - Y9 [OPEN-2 (A)]: type a predicate in the Filter section's input and Apply. The cards become that one card. Felt: expected?
    - Y10: Ctrl+B, Ctrl+I and Ctrl+J with the focus in the bar. Each toggles its region, and the bar keeps its text.
    - Y11: the P6 sight of every new string and of OPEN-9's drafted sentences.
    - Y12 [OPEN-7 (a)]: the scale item for a metre dataset and for a degree dataset.
- **KNOWN-LIMITATIONS.** OPEN-9's drafts, each at the next free number at the code base:
  - a new item under OPEN-3 (A);
  - a new item under OPEN-4 (a);
  - item 39's third sentence replaced, under the 2026-10-11 direction, item 2e.

### 2.11 Portability (R1 to R6)

- **Owning boundary:** the shell's keyboard adapter, the one platform read in `layout/actionRegistry.ts` (milestone 1, §2.10).
- **Mod+K:**
  - Windows: supported, tested by unit and render tests, the e2e suite over CDP, and row Y1 with real keys (H2);
  - macOS (⌘K) and Linux (Ctrl+K): supported by construction, L1 by unit test only. L2 is deferred to PLAN node `shell-real-app-run-macos-linux`, together with the screen-reader checks (PORTABILITY §5).
- **IME:** composing keys are ignored by the bar.
- **Paths:** `/open` passes no path. The picker's path reaches the existing admission opaquely, and nothing is parsed or built.
- **Native menus:** under OPEN-6 (b), macOS only, L1. Windows and Linux have no application menu (PORTABILITY §5).
- **No OS-conditional code and no new ignore. Expected reduction:** none.

## §3. Fixtures and predicted outcomes

- **No new fixture.** filter-zoned.parquet (2,000 polygons, a nullable `zone` column). Each fixture's sha256 is recorded before and after the run.
- **Predicted outcomes:**
  - every existing suite: PASS unedited at each PR's head (H3);
  - `e2e:command-bar`: PASS on every asserted step;
  - E-AND: an empty map under the contradictory pair (H1).

## §4. Tests, and one mutation each

Every mutation is observed:
- by applying it, running the named test, recording its failure by name with the commit it was observed at, and reverting it;
- a `verify-mutation` run is not an observation (round 25, item 2 (c));
- each recorded-mutation comment counts in §7.

The render tests use App.layout.test.tsx's harness, copied. The copy's manager stand-in records each `requestViewport(bbox, bboxCrs, filter)` and settles per test, as issued or as a rejection with an `SkpCallError` carrying a `skp.filter_*` code. That is the transport boundary the harness already mocks. Mocking `applyFilter`, `filterClauses.ts` or the registry is I6.

| ID | PR | Kind and file | Asserts | Mutation, and its expected failure |
|---|---|---|---|---|
| UC1 | A, B | unit, command/commandDraft.test.ts | `resolveDraft`: an exact `/word` runs; a prefix lists by word; plain text matches label or word case-insensitively, in registry order; `?` gives help; `command.focus` is left out of search; `/filter` keeps its text byte for byte; a whitespace-only condition is `filter-empty` | make plain search case-sensitive; fails on `ZOOM` |
| UC2 | A | unit, same | `commandBarKey`, over every reachable state (drafts × list open or closed × active option): Shift+Tab leaves in one press; Tab leaves in at most two; Tab never applies; Enter never completes; Escape closes the list, then leaves; composing keys do nothing | Tab reopens the list after completing; fails at Tab leaving in at most two |
| UC3 | B | unit, workspace/filterClauses.test.ts | `combineClauses`: none gives null; one gives its text byte for byte (whitespace and case kept); two or more give `(t1) AND (t2)…` in card order; cards that are off are left out; the dialect is the constant | trim each text; fails on the whitespace case |
| UC4 | B | unit, same [OPEN-3 (A)] | `recognizeSimple` over a table: accepted forms, and refused ones (`a = 1) OR (1=1`, `a = 1 --`, `a = 1 /*`, `$$x$$`, `E'x'`, two adjacent literals), with literals holding `)`, `--` and `''` accepted | let the name class admit `)`; fails on the escape row |
| UC5 | B | unit, same [OPEN-3] | `proposeClauseChange`: simple next to simple is proposed; advanced alone is proposed; advanced with any card on, or any card with an advanced card on, is refused; a card that is off blocks nothing | ignore `enabled` when checking; fails on the off-card row |
| UC6 | B | unit, command/fieldCompletion.test.ts [OPEN-4] | Candidates are the schema without the geometry column, in order, matched case-insensitively; insertion is always double-quoted, with `"` doubled; options carry name and `arrow_type` only; at most FIELD_COMPLETION_MAX_OPTIONS | do not double an embedded quote; fails on `a"b` |
| UC7 | B | unit, workspace/viewTransitions.test.ts and workspaceState.test.ts | Clause transitions are pure. `view.filter` equals `combineClauses(view.clauses)` after every transition in 2,000 seeded sequences. `filter.apply` sets one clause or none, and `resource.admitted` resets clauses. Milestone 2's UA4 union now includes `filter.clauses.set` (a declared edit) | make `setEnabled` leave `filter` unchanged; fails on the invariant |
| UC8 | A | unit, layout/actionRegistry.test.ts | Mod+K maps to `command.focus` (Meta on macOS). Ids and chords are unique. The exact-id test lists milestone 2's eight plus this piece's ids, citing round 66, item 2 and this form (a declared edit). The test at :49-51 keeps its meaning with a letter no entry holds (a declared edit) | give `command.focus` the chord J; fails on uniqueness |
| UC9 | A | unit, command/commandBoundary.test.ts | Nothing under `src/command/` imports from `skp/`, `streaming/`, `residency/` or `canvas/` (milestone 1's U4 scan) | add `import "../skp/client"` to commandDraft.ts; fails naming it |
| RC1 | A | render, src/App.command.test.tsx | Ctrl+K through the real `window` listener focuses the bar's input; the map is mounted once | drop the focus call from `command.focus`'s run; fails |
| RC2 | A | render, same | Each layout entry run from the bar flips the region its button flips and records the same row; Zoom to layer calls `fitToBounds` once | have the bar call a copy that does not record; fails on the row |
| RC3 | B | render, same | Two simple clauses: the manager receives `(t1) AND (t2)` with the dialect constant; two cards are on; FilterPanel's Applied line and `activeFilterRef` equal it | join with ` OR `; fails |
| RC4 | B | render, same | A clause refused `skp.filter_unknown_column`: no card is added; the cards and the applied filter are unchanged; the refusal is shown below the bar, which keeps its text | add the card before the outcome; fails |
| RC5 | B | render, same | Off issues the remaining combination; on restores it; a refused toggle leaves the card as it was applied | flip the card before the outcome; fails |
| RC6 | B | render, same [OPEN-2 (A)] | The panel's Apply replaces the cards with one; Clear removes them all | make the panel's Apply append; fails |
| RC7 | B | render, same [OPEN-3 (A)] | An advanced clause with a card on: no `requestViewport` call, and the shell's line is shown | send it anyway; fails on the call count |
| RC8 | A | render, same [OPEN-5] | `/open` calls the picker once, the button's path; while an open is in flight it calls nothing and shows the busy line | wire `/open` to a no-op; fails on the picker count |
| RC9 | A | render, same [OPEN-5 (A)] | `/export` opens the Inspector and its Layer tab, expands Export and focuses `.publish-open`; `publishPrepare` is not called | call the panel's click handler; fails on the prepare count |
| RC10 | A | render, same [OPEN-1] | Escape returns focus to the filter input it came from, or to the map region when that input's region is closed | do not restore focus; fails |
| RC11 | B | render, same | With one feature selected (milestone 2's stand-in click), switching a card off leaves the count at 1 | clear the selection on `filter.clauses.set`; fails |
| RC12 | B | render, same | An export staged before a card toggle is refused at execute, and `publishExecute` is not called | have the card commit skip the workspace filter; fails |
| RC13 | A | render, same | The combobox: `aria-expanded`, `aria-controls` naming the listbox, and `aria-activedescendant` following the arrow keys | stop updating `aria-activedescendant`; fails |
| RC14 | B | render, same | A card change calls `resetFitForNewGeneration` once on an issued outcome and never on a refusal, as an Apply does (the OPEN-9 item 39 clause check) | pass a no-op reset on the card path; fails |
| RC15 | A | render, same | Typing `s` and `n` in the bar types them and switches no tool | make milestone 2's text-field guard skip `.command-bar`; fails |
| E-CTRLK | A | e2e, e2e/command-bar.mjs | Ctrl+K (CDP) focuses the bar; `/lay`, Tab, Enter flips Layers' `hidden`; one `layout.toggleLayers` row; the `.working-canvas` node is unchanged | route the bar to the copy that does not record; fails on the row |
| E-SEARCH | A | e2e, same | Plain `inspector`, ArrowDown, Enter flips the Inspector | make search match words only; fails |
| E-HELP | A | e2e, same | `?` lists every registry word and every chord label | leave out entries with no chord; fails |
| E-BARFOCUS | A | e2e, same | With no list open, Tab leaves the bar; Escape returns focus to the element held before | intercept Tab always; fails |
| E-REVEAL | A | e2e, same [OPEN-5 (A)] | `/export`: the disclosure is `aria-expanded="true"` and focus is on `.publish-open`; no approval prompt appears | call the click handler; fails on the prompt |
| E-FIELD | B | e2e, same | `/filter @zo`, then Tab, inserts `"zone"` and removes the `@` | insert the name unquoted; fails |
| E-AND | B | e2e, same (H1) | Card A `"zone" = 'residential'` matches filter.mjs's fraction. Adding card B `"zone" <> 'residential'` makes `.filter-active` exactly `("zone" = 'residential') AND ("zone" <> 'residential')` and the map empty. B off returns A's fraction within filter-panel.mjs's tolerance, with `.filter-active` exactly A's text | join with ` OR `; fails on the empty-map check |
| E-REFUSE | B | e2e, same | `/filter "nope" = 1` shows `skp.filter_unknown_column` by name in the bar; the cards and `.filter-active` are unchanged; the fraction is unchanged within tolerance | add the card before the outcome; fails |
| E-TOOLONG | B | e2e, same | Card A, about 2,100 bytes, is admitted; card B takes the combination over 4,096 bytes and is refused `skp.filter_too_long` by name; A stays | drop B silently in the shell above 4,096 bytes; fails on the missing code |
| E-ADV | B | e2e, same [OPEN-3 (A)] | An advanced clause with a card on: the shell's line; the cards and `.filter-active` unchanged | send it anyway; fails on `.filter-active` |
| E-PANEL | B | e2e, same [OPEN-2 (A)] | With two cards, the panel's Apply leaves exactly one card holding its text; Clear leaves none | make the panel's Apply append; fails |
| E-SEL | B | e2e, same | Select one feature (S, then a click at a pixel found by `capturePixels`, its id taken through `hoverIdAfterBarrier`); switch a card off; the count is 1 | clear the selection on clause transitions; fails |

**Each acceptance item of plan §7, and what proves it:**
- **Ctrl+K opens search over the registry:** UC8, RC1 and E-CTRLK, with Y1 (real keys, H2).
- **`/` commands, plain search and `?` help:** UC1, RC2, E-CTRLK, E-SEARCH, E-HELP and Y2.
- **`@` completes field names inside `/filter`, with no statistics:** UC6 and E-FIELD.
- **Tab completes, Enter applies, and focus can always leave:** UC2, RC10, E-BARFOCUS and Y7.
- **Cards with enable, disable and remove:** UC7, RC5 and Y4.
- **Enabled cards combine with AND into the one predicate the kernel admits:** UC3, RC3, E-AND and E-TOOLONG.
- **An expression the cards cannot represent stays whole as one advanced card:** UC4, UC5, RC7, E-ADV and Y6.
- **A refused draft never discards the applied filter:** RC4, RC5, E-REFUSE and E-TOOLONG.
- **A toggle is an ordinary step:** UC7 (a typed transition carrying the clause id; no log).
- **Seam 2 stays narrow, with no new SKP schema:** UC1, UC9 and §8 item 3.
- **Portability and accessibility (plan §2 rule 8):** UC8, RC13, E-BARFOCUS and Y1.
- **The human's felt verdict:** Y2, Y3, Y4 and Y9.
- **Scale (OPEN-7 (a)) and menus (OPEN-6 (b))**, if ruled in: their groups' rows, added by Amendment 1.

## §5. Predictions, declared unchanged, invalidators, falsification

**Predicted:** H1 to H5 as stated (H6 only under OPEN-6 (b)), and §3.

**Declared unchanged:**
- §2.1's list and §2.9's not-edited list;
- the map's key, and the remount on a new handle;
- milestone 1's chords and milestone 2's N and S;
- ADR-021's liveness and Cancel in FilterPanel;
- PublishDialog, the approval prompt and `FILTER_SCOPE_SENTENCE`;
- tauri.conf.json, the capabilities, the dependencies and the lockfile;
- the class A and B rows;
- every existing string except §2.10's and OPEN-9's;
- every KNOWN-LIMITATIONS item except OPEN-9's.

**Invalidators.** Each one means STOP and report.
- **I1:** an edit is needed in a declared-unchanged area.
- **I2:** a dependency seems necessary, for example a fuzzy matcher.
- **I3:** an e2e failure not caused by a §7 G-E change. It is recorded as class 2, and the human is asked.
- **I4:** a §0.5 interface differs at the code base.
- **I5:** ADR-036 is accepted with a different `intent` shape before the transition code.
- **I6:** a test can pass only by mocking `applyFilter`, `filterClauses.ts` or the registry.
- **I7:** H2 fails.
- **I8:** a clause cannot reach the kernel through `applyFilter` unchanged.
- **I9:** code of an OPEN item is needed before its ruling.
- **I10:** milestone 2 changes a seam beyond what a class 3 re-sweep can carry.
- **I11:** an engine, kernel, protocol or src-tauri change seems needed.
- **I12:** a suite fails at the code base before any code.
- **I13:** under OPEN-6 (b), a capability edit is needed.

**Falsification.** The form is wrong if, at the code base, either:
- a clause cannot reach the kernel without changing `applyFilter`'s body or anything under `skp/` or `streaming/`; or
- the bar cannot run an entry through the same handler its chord or button uses without a second dispatch path.

## §6. Instruments

- **Assertions:** every U, R and E row.
- **Measurements:** none.
- **The human's:** Y1 (H2), Y7 (H4), and Y2, Y3, Y4 and Y9 (felt).

## §7. Declared values and ceilings

**Constants.** They are declared in `command/commandConstants.ts`, each with what it bounds (ADR-010 rule 6).

| Constant | Value | Bounds |
|---|---|---|
| COMMAND_LIST_MAX_HEIGHT_PX | 320 | the open list, which then scrolls inside |
| FIELD_COMPLETION_MAX_OPTIONS | 200 | field options listed at once; above it, a P6 line asks for more letters |
| Predicate ceiling in the shell | none, declared | the kernel's 4,096 bytes and depth 32 refuse by name (§0.5) |
| Defaults | the bar empty, the list closed, no option active; no cards | the first state |
| SCALE_BAR_MIN_PX / SCALE_BAR_MAX_PX (OPEN-7 (a)) | 60 / 150 | the bar's CSS length |

**Budget.** Insertions plus deletions, tests included, by `git diff --numstat <base>...HEAD -- frontends/shell ':(exclude)frontends/shell/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md' ':(exclude)frontends/shell/MANUAL-WALKTHROUGH.md' ':(exclude)frontends/shell/e2e/README.md'`.
- `<base>` is the merge base with origin/main when each PR's branch is cut.
- If main is merged into the branch, the count is taken from the merge base after that merge, and the record names it.
- Each PR counts its own groups.

**How the figures were built.** They are bottom-up, per file.
- About 4 recorded-mutation comment lines per test are inside the test groups.
- The new suite is budgeted at about 60 lines per step, from layout.mjs's record of 417 lines for 8 steps.
- Every e2e file is named with its reason, plus a disclosed margin.

| Group | Files (ceiling each) | Lines, at most |
|---|---|---|
| A-P, PR A product | commandDraft.ts ≤ 220, CommandBar.tsx ≤ 300, actionRegistry.ts ≤ 60, StudioLayout.tsx ≤ 90, App.tsx ≤ 80, AdmissionPanel.tsx ≤ 20, PublishPanel.tsx ≤ 30, styles.css ≤ 100, package.json ≤ 2 | 902 |
| A-T, PR A tests | commandDraft.test.ts ≤ 450, actionRegistry.test.ts ≤ 50, commandBoundary.test.ts ≤ 70, App.command.test.tsx ≤ 500, App.layout.test.tsx ≤ 10 (only if R4 sees the new control) | 1,080 |
| A-E, PR A e2e | command-bar.mjs ≤ 380, layout.mjs ≤ 20 (only under H3's E-FOCUS case), margin 60 | 460 |
| B-W, PR B workspace | filterClauses.ts ≤ 200, viewTransitions.ts ≤ 60, workspaceState.ts ≤ 50 | 310 |
| B-P, PR B product | fieldCompletion.ts ≤ 80, commandDraft.ts ≤ 80, CommandBar.tsx ≤ 120, ClauseCards.tsx ≤ 220, actionRegistry.ts ≤ 15, StudioLayout.tsx ≤ 40, App.tsx ≤ 200, surfaceRegistry.ts ≤ 40, styles.css ≤ 100 | 895 |
| B-T, PR B tests | filterClauses.test.ts ≤ 400, fieldCompletion.test.ts ≤ 120, commandDraft.test.ts ≤ 120, viewTransitions.test.ts ≤ 150, workspaceState.test.ts ≤ 40, App.command.test.tsx ≤ 600 | 1,430 |
| B-E, PR B e2e | command-bar.mjs ≤ 420, margin 80 | 500 |
| **Total** | **about 26 files** | **5,577** |
| SC (OPEN-7 (a), conditional, PR B) | WorkingCanvas.tsx ≤ 25, scaleBar.ts ≤ 80, contributions.ts ≤ 10, StudioLayout.tsx ≤ 20, App.tsx ≤ 40, styles.css ≤ 20; scaleBar.test.ts ≤ 150, App.command.test.tsx ≤ 80; command-bar.mjs ≤ 60 | 485 |
| NM (OPEN-6 (b), conditional, PR A) | nativeMenu.ts ≤ 120, App.tsx ≤ 10, nativeMenu.test.ts ≤ 150 | 280 |

**Outside the count, declared for the record:**
- MANUAL-WALKTHROUGH.md ≤ 130;
- e2e/README.md ≤ 40;
- KNOWN-LIMITATIONS.md ≤ 30.

An overrun is class 8, and this section is never edited to match it.

## §8. Block-on-sight

1. A file edited outside §2.9's may-edit list, records excepted.
2. A dependency, port or lockfile change.
3. Any edit under engine/, kernel/, protocol/, src-tauri/, `skp/`, `streaming/` or `residency/`, or under `canvas/` beyond OPEN-7 (a)'s one method; any new SKP shape.
4. A change to `applyFilter`, `ApplyFilterDeps`, `ApplyFilterOutcome`, `predicateInput.ts`, FilterPanel.tsx or the `Filter` type.
5. A card's text sent other than byte for byte, or combined other than by §2.5's rule.
6. A shell-side ceiling, trim, case fold or check of predicate text beyond the recognizer OPEN-3 rules; a shell decision shown as the kernel's.
7. A refused or not-applied change that alters the cards or the applied filter.
8. A bar-run entry that does not go through the handler its chord or button uses.
9. The bar calling `publishPrepare` or `publishExecute` [OPEN-5 (A)].
10. A focus trap: a state where Shift+Tab does not leave in one press, or Tab in two.
11. The list rendered while closed; any new permanent element over the map.
12. The map remounted by a bar or card action.
13. A completion showing a statistic, or offering the geometry column.
14. A transition log, an undo, or the word undoable.
15. A message that states another module's consequence, or rewords the kernel's refusal.
16. A new operator string outside §2.10's list and OPEN-9's, or one neither marked nor sighted.
17. A registry entry, callback, prop, handle or export without a product caller (the instrument exemption only as defined).
18. A path parsed or built in TypeScript, or a platform read outside actionRegistry.ts.
19. A performance claim.
20. A quote of the human's words marked verbatim that does not match its source.
21. A new test without its observed mutation.
22. Code of an OPEN item before its ruling is recorded.
23. An e2e edit outside G-E; a walkthrough row whose meaning changes; a result-log edit.
24. A fuzzy matcher.

## §9. Gates

- **Architect and reviewer,** full gating. Verdicts follow the product-first direction, section 2:
  - Correctness or Evidence blocks;
  - a Documentation finding is fixed in the same PR before the merge;
  - each gate checks §8 item by item.
- **The wording-block rule** applies by reference to the human's direction of 2026-10-11, item 2 (state/directives/2026-10-11-direction-after-status-review.md:14-25 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD).
- **Suites,** green first:
  - `npm run verify`;
  - every e2e suite at the code base, listed in the PR body, plus `e2e:command-bar`;
  - the governance scripts' `node --test`;
  - verify-cites, verify-quotes and verify-test-claims, each named with its commit.
- **Operator.** The new Part, committed with a blank log and queued to the sitting. The felt verdict and the P6 sight are the human's.
- **Owner's index.** None for frontends/shell was found at milestone 2's base. If the custodian names one at the code base, the worker updates its lines in the PR.

## §10. Amendments

Opens empty, append-only.
- Amendment 1 records the human's rulings on OPEN-1 to OPEN-11.
- The re-sweep amendment (§0.3) follows before any code.

## §11. Open items for the human

The full options are in the question round.

| Item | Subject | Recommended | Red line |
|---|---|---|---|
| OPEN-1 | The bar's behaviour | the package | yes |
| OPEN-2 | The Filter section's model | (A) | yes |
| OPEN-3 | Where a clause ends | (A) | yes |
| OPEN-4 | Field completion | (a) | yes |
| OPEN-5 | `/open` and `/export` | (A) | yes |
| OPEN-6 | Native menus on macOS | (a), defer | yes |
| OPEN-7 | The scale display | (c), defer | yes |
| OPEN-8 | Keys | (a), Ctrl+K only | no |
| OPEN-9 | P6 wording and the 2e sentences | approve as drafted | no |
| OPEN-10 | Milestones 3 and 4 | (a), no swap | no |
| OPEN-11 | One PR or two | (b), two | no |

Red lines are ruled in typed words only. Each answer is recorded as Amendment 1 before dispatch.

## §12. Heavy runs

The worker's and tester's briefs carry, as written, the paragraph at state/directives/2026-10-06-machine-script-adopted.md:12-22 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD. This form names no other rule for builds.
````

## 3. OPEN items

Each item gives the options, my recommendation, whether it is a red line, and what waits on it.

**OPEN-1: how the bar behaves (a package).** The plan rules only that Tab completes, Enter applies and focus can always leave.
- **Package (A):**
  - the list opens on typing or ArrowDown, never on focus;
  - Tab completes an active option, or the only candidate, and never applies, so a second Tab always leaves;
  - Shift+Tab always leaves;
  - Enter applies the active option or an exact draft;
  - Escape closes the list, then returns focus to where it came from;
  - search is a case-insensitive substring match in registry order;
  - unavailable commands are listed, marked, and never run;
  - after `/filter` applies, the bar keeps the focus for the next clause.
- **Alternative (B):** the first candidate is active by default, so Enter runs it without the arrow keys. This is quicker, but Enter can run something the user did not choose.
- **Recommendation: (A).** It meets the notebook's §3.4 test for leaving the bar, and nothing runs that was not chosen.
- **Red line: yes.** It is user-visible behaviour not yet ruled.
- **What waits:** PR A's bar code, UC2, RC10 and E-BARFOCUS.

**OPEN-2: the Filter section's model (a package).**
- **Package (A):**
  - the panel's Apply replaces every card with one card holding its text, and Clear removes every card;
  - `/filter` adds a card;
  - each card change applies exactly as an Apply does, including the unrestricted first look and the camera re-fit (the 2026-08-15 design; finding F2);
  - a refused change leaves the cards as they were applied;
  - one bar or card change is in flight at a time.

  Every existing e2e suite and walkthrough row keeps its meaning (H3).
- **(B):** the panel's Apply adds a card. Each Part E row that applies a second predicate then changes meaning, and so do filter-panel.mjs's steps. Each changed meaning would need the human's typed word.
- **(C):** card changes keep the camera and ask only for the current view. That needs a variant of `applyFilter`, a function this form declares unchanged.
- **Recommendation: (A).**
- **Red line: yes.**
- **What waits:** PR B's App path, ClauseCards, RC5, RC6 and E-PANEL.

**OPEN-3: where a clause ends (finding F1).**
- **(A):**
  - a narrow, anchored recognizer marks a card as simple (comparison, IS NULL, IN, BETWEEN, LIKE), and anything else is advanced;
  - simple cards combine with each other;
  - an advanced card is used only on its own. Combining it with another card that is on is refused by the shell, with P6 words, and nothing is sent;
  - the recognizer admits nothing, and the kernel still admits or refuses every text.
- **(B):** every card combines, each inside brackets. The exact predicate sent stays visible (FilterPanel's Applied line). A text that closes its own bracket can make the cards misread, and that is recorded as a KNOWN-LIMITATIONS item.
- **(C):** a shell lexer that balances brackets and comments for any text. Not recommended: it is the second SQL grammar that ADR-021 rule 6 refuses for admission, and it would diverge from DuckDB in exactly the cases that matter.
- **(D):** a kernel check of where each card ends. That is a new SKP surface, which the ruling's no-new-SKP-schema bound excludes; it is listed for completeness. If chosen, it is I11, with a lead-data read first.
- **Recommendation: (A).** It is the Metabase row's shape in the reuse index, and the cards can never show a meaning the map does not have. The human may read a shell refusal as touching the bound that the kernel is the only authority on admission; that is why this is the human's.
- **Red line: yes.**
- **What waits:** UC4, UC5, RC7, E-ADV, and the KNOWN-LIMITATIONS item.

**OPEN-4: field completion.**
- **(a):** every `describe.schema` name except the geometry column, with its `arrow_type`, no statistics, and always inserted double-quoted. A name the kernel does not admit is refused by name when applied.
- **(b):** a name is inserted bare when it matches `^[a-z_][a-z0-9_]*$`, and quoted otherwise. A bare name that is a DuckDB keyword is then refused by the kernel. The shell can avoid that only with a keyword list, which would be policy.
- **(c):** the shell narrows the list by type. Rejected: it copies kernel policy (SKP-V0 §7.3; notebook §6.5).
- **Recommendation: (a).** It is correct for every name and keeps no list. The cards will show the quotes.
- **Red line: yes.**
- **What waits:** fieldCompletion.ts, UC6, E-FIELD, and its KNOWN-LIMITATIONS item.

**OPEN-5: `/open` and `/export`** (question round 66, item 2 put them in this milestone).
- **(A):**
  - `/open` runs the Open GeoParquet… handler, with the button's in-flight guard (finding F4). Milestone 2's ask applies inside it if built;
  - `/export` only reveals the Export section: it opens the Inspector on its Layer tab, expands Export and focuses its button. It never starts an export, so the scope choice stays visible and ADR-024's approval path is untouched.
- **(B):** `/export` calls the button's handler with the panel's current scope choice, and the approval prompt still follows (finding F3).
- **Recommendation: (A).**
- **Red line: yes.** It is a new exposure surface next to a class-3 action.
- **What waits:** the AdmissionPanel and PublishPanel handles, RC8, RC9 and E-REVEAL.

**OPEN-6: native menus on macOS** (plan §7, also here; finding F5).
- **(a):** defer to a node of its own, after `shell-real-app-run-macos-linux` gives L2 evidence.
- **(b):** build in PR A at L1, by unit test with the API mocked. It needs H6, and a capability edit would be I13.
- **Recommendation: (a).** The code would run only on a platform this machine cannot run, so it could ship unproven above L1 (R5).
- **Red line: yes.** Deferring changes the scope of a ruled item.
- **What waits:** the NM group only.

**OPEN-7: the scale display** (plan §7, also here; finding F6).
- **(a):** a bar of a round length in the CRS's unit, shown only for a metre dataset, never as a ratio and never as distance on the ground. It needs one read-only method under `canvas/`, a fourth exception there (§2.8).
- **(b):** a 1:N ratio at the CSS reference pixel. The notebook's §3.3 warns that this is no physical scale.
- **(c):** defer to a node of its own.
- **Recommendation: (c),** with (a) drafted in full so that the human can take it now. It is not one of the human's three day-one needs, and it adds a canvas exception and a claim to sight.
- **Red line: yes.** Deferring changes ruled scope; (a) is user-visible and adds a canvas exception.
- **What waits:** the SC group only.

**OPEN-8: keys.**
- **(a):** Ctrl+K (⌘K on macOS) only, as plan §7 rules.
  - Within the app it collides with nothing: the chords are B, I and J, and the bare keys N and S are ignored in fields.
  - U5's Ctrl+K-matches-nothing test is edited, with its meaning kept (finding F7).
  - Whether WebView2 lets a real Ctrl+K through is H2, observed in row Y1.
- **(b):** also a bare `/` opener while no text field has the focus. That is new unruled behaviour, so choosing it needs typed words.
- **Recommendation: (a).**
- **Red line: no** for (a).
- **What waits:** PR A.

**OPEN-9: P6 wording and the 2e sentences.** Every string is drafted, carries `[P6 placeholder]` until sighted, and is checked clause by clause against §2.
- **Bar placeholder** `Search commands (Ctrl+K)`. Search covers commands (UC1); the shortcut focuses the bar (RC1); macOS shows ⌘K through `shortcutLabel`.
- **Help line** `Type / and a command, or words to search. In /filter, type @ for a field name.` Each clause holds by UC1 and UC6.
- **No match** `No command matches.` It shows exactly when there are no candidates.
- **Empty condition** `Type a condition after /filter.` It shows for `filter-empty`, and nothing is sent.
- **Busy** `A filter change is still being applied.` It shows while a bar or card change is pending.
- **Open busy** `An open is already in progress.` It shows while `isOpenInFlight` holds.
- **Unavailable mark** `Not available now.` It shows when `available(id)` is false.
- **Refused lead line** `Not applied. Your filter cards are unchanged.` On a refusal, no transition is dispatched (RC4). It is the shell's own consequence, and the kernel's code and message follow in RefusalBlock.
- **Not applied** `Not applied. Try again.` On `not-applied`, no transition is dispatched.
- **Under OPEN-3 (A), new advanced clause** `Not applied: this condition is not one of the simple forms, so it can only be used on its own. Turn off the other cards first.` Nothing is sent (RC7). The criterion is the recognizer. Turning the others off makes it addable (UC5).
- **Under OPEN-3 (A), card blocked by an advanced card** `Not applied: the card {text} can only be used on its own. Turn it off first.` It holds by UC5.
- **Section statement** `Cards that are on are combined with AND. The filter keeps only features that meet every card that is on.` The joining is UC3. A row passes only if every operand is true, so a NULL comparison drops it; the sentence makes no claim about what the map draws.
- **Card controls** `On`, `Remove`, and under (A) the marker `Expression, used on its own`.
- **Field overflow** `{n} more. Type more letters to narrow the list.` It shows above FIELD_COMPLETION_MAX_OPTIONS.
- **Command words** layers, inspector, activity, zoom-to-layer, navigate, select, zoom-to-selection, clear-selection, open, export, filter. The label of `command.focus` is `Search commands`; `dataset.open` reuses `Open GeoParquet…`; `layer.revealExport` reuses the sighted `Export interactive map…`, whose ellipsis promises more input before anything runs, which holds under OPEN-5 (A).
- **Class-C rows** (three) `no API equivalent exists -- a filter card is view state for this session; what reaches the kernel is the one combined predicate, recorded as its viewport_query row.` The cards are never persisted. The combination goes through `applyFilter`. viewport_query is a class-A row (`frontends/shell/src/console/surfaceRegistry.ts:82` @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD).
- **Item 2e, new KNOWN-LIMITATIONS items** for the human to approve or replace:
  - **(i), under OPEN-3 (A):** `A filter condition that is not a simple comparison, IN, BETWEEN, LIKE or IS NULL is kept whole as one card and can be used only on its own; to combine it with others, write it as separate simple conditions.` The recognizer's set is §2.5. The used-alone rule is UC5. A simple condition split into cards combines (UC3).
  - **(ii), under OPEN-4 (a):** `Completing a field name after @ offers every column of the file except its geometry column, in double quotes. A column the filter cannot use is refused by name when the condition is applied.` The list is UC6. The kernel's namespace refusal is `skp.filter_column_not_filterable` or `skp.filter_unknown_column` (SKP-V0 §7.5).
- **Item 2e, item 39's third sentence** (`KNOWN-LIMITATIONS.md:369` @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:HASH-TBD), the human's own wording. Proposed replacement: `One exception: after a file is opened, after a filter Apply or Clear or a change to a filter card that the app sends, whatever its outcome, and after the map fits itself to the data, a change of size asks for nothing new until the next pan or zoom.`
  - Clause check: a sent card change calls the same `applyFilter`, with the same deps as an Apply apart from the commit (§2.5). So the reset, the recovery and the re-fit are an Apply's (RC14).
  - The phrase `that the app sends` excludes the shell's own OPEN-3 refusal and the busy refusal. Neither calls `applyFilter`, so neither resets anything.
  - The rest of the sentence is the human's accepted text, unchanged.
- **Recommendation:** approve the 2e sentences as drafted; sight the strings at row Y11.
- **Red line: no** (P6; item 2e).
- **What waits:** the KNOWN-LIMITATIONS lines before PR B merges. No code waits.

**OPEN-10: whether milestones 3 and 4 swap** (plan §4 and §13 item 5).
- **(a) Keep the order.** The 2026-10-11 direction, item 1a, already names this milestone next in slot 1. It completes filter in the form the human tried (O-07 step 3). Milestone 4's form must still settle the table's data path.
- **(b) Swap.** Milestone 4's form is drafted first and this one waits.
- **Recommendation: (a).**
- **Red line: no.** The plan reserves the choice, and either answer is a ruling on order.
- **What waits:** this piece's dispatch.

**OPEN-11: one PR or two.**
- **(a)** one PR of about 5,600 lines.
- **(b)** two PRs, as milestone 2's precedent: PR A is the bar (about 2,440 lines) and merges first; PR B is the clauses (about 3,140 lines), cut from main after it, with its own class 3 row.
- **Recommendation: (b).**
- **Red line: no.**
- **What waits:** §7's per-PR counting and the dispatch shape.

## 4. Files read

All at main ceff6d82bdd3223fefed46e209913db6d1552d40 (`C:\dev\spatial-ide\`), plus the read-only reuse clone at `C:\dev\spatial-ide-reuse\`. Nothing was written.

- **Plan and governance:**
  - `.git\HEAD`, `.git\refs\heads\main`
  - `PLAN.yaml` (lines 4880-5039)
  - `AUTONOMY.md` (§4, §21 to §22, §25)
  - `AI_DEVELOPMENT.md` (the Always-the-human list)
  - `docs\PREREGISTRATION-TEMPLATE.md` (from the full form to the end)
  - `KNOWN-LIMITATIONS.md` (lines 1-371, in parts)
- **Directives and questions:**
  - `state\directives\SHELL-MIGRATION-PLAN-2026-10-07.md`
  - `state\directives\2026-10-07-migration-plan-v2-ruled.md`
  - `state\directives\2026-10-11-direction-after-status-review.md`
  - `state\directives\2026-10-11-open-11-a-piece-f-opens-ported-notices-required.md`
  - `state\directives\2026-10-07-round-66-and-67-rulings.md`
  - `state\questions\round-66.md`
  - `state\directives\O-07-WALKTHROUGH-2026-10-05.md` (by search)
  - `state\directives\PORTABILITY-2026-09-30.md` (§2, §5)
  - `state\directives\2026-10-05-product-first-direction.md`
  - `state\directives\2026-10-06-machine-script-adopted.md` (lines 10-23)
- **Design references (not Authority):**
  - `state\drafts\design\SPATIAL-IDE-DESIGN-NOTEBOOK.md` (§3.3 and §3.4, §5, §6, §12)
- **Earlier forms and records:**
  - `frontends\shell\SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md` (whole, Amendment 3 first)
  - `frontends\shell\SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md` (§0 to Amendment 2, Amendments 8 to 13)
  - `state\consults\2026-10-09-shell-migration-milestone-2-architect-draft.md` (its shape)
  - `frontends\shell\SHELL-CRS-FORM-FOR-FORMAT-DEFAULT-CONTRADICTED-PREREGISTRATION.md` (by search)
- **ADRs and protocol:**
  - `docs\adr\ADR-021-row-filter-on-viewport-query.md` (lines 1-130)
  - `protocol\skp\SKP-V0.md` (§7)
- **Engine:**
  - `engine\src\predicate.rs` (lines 50-130, plus a search)
- **Shell code:**
  - `frontends\shell\package.json`
  - `frontends\shell\src-tauri\capabilities\default.json`
  - `frontends\shell\src\filter\FilterPanel.tsx`, `frontends\shell\src\filter\predicateInput.ts`
  - `frontends\shell\src\skp\types.ts` (lines 60-262)
  - `frontends\shell\src\App.tsx` (lines 225-364, 890-969, 1650-1690, 1972-1987, plus searches)
  - `frontends\shell\src\layout\actionRegistry.ts`, `actionRegistry.test.ts`, `StudioLayout.tsx`, `contributions.ts`, `layoutBoundary.test.ts`
  - `frontends\shell\src\admission\AdmissionPanel.tsx` (lines 255-374)
  - `frontends\shell\src\publish\PublishPanel.tsx` (lines 280-619)
  - `frontends\shell\src\canvas\viewportBbox.ts` (lines 1-55)
  - `frontends\shell\src\App.layout.test.tsx` (lines 1-175)
  - `frontends\shell\src\console\surfaceRegistry.ts` and `recorder.ts` (searches)
- **Shell e2e and walkthrough:**
  - `frontends\shell\e2e\layout.mjs` (lines 190-224)
  - `frontends\shell\e2e\filter-panel.mjs` and `console.mjs` (searches)
  - `frontends\shell\MANUAL-WALKTHROUGH.md` (the Part headings, plus a search)
- **Reuse clone:**
  - `C:\dev\spatial-ide-reuse\REUSE-ROUND-1.md`, rows 228-252, at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c
