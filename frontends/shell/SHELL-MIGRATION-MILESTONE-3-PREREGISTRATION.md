# Shell migration, milestone 3 — command bar and filter clauses: Ctrl+K, slash commands, typed /filter with field completion, clause cards with on and off
# (PLAN node shell-migration-milestone-3)

File: frontends/shell/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md
Authority: the RULED 2026-10-07 block for the migration plan's second version (state/directives/2026-10-07-migration-plan-v2-ruled.md:16 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:e3caf819eecb46e50213c7bbe342d72bec7726e59c19d5f27180427e1232ee1a); the plan, state/directives/SHELL-MIGRATION-PLAN-2026-10-07.md, §2, §3, §4 and §7 (state/directives/SHELL-MIGRATION-PLAN-2026-10-07.md:221-231 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:8a34eee5003c0d0845a5d33c0d7b82a226662502e20d460b075c29540b28cefb) and §13; question round 66, item 2 (open and export join the registry in this milestone); the human's direction of 2026-10-11, items 1a and 1b (state/directives/2026-10-11-direction-after-status-review.md:8-10 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:752e59f00c0e10ef60039ecfd31e80ab9e92fcf09ee63d7b46fe7c4f9b7b3165): slot 1's next piece after milestone 2, with this form and its question round drafted while milestone 2 is in code.
Drafted by: the architect agent, alone (no engine, kernel or protocol path; the product-first direction, section 1); read at main ceff6d82bdd3223fefed46e209913db6d1552d40.
Committed before any code. Append-only once committed. An amendment made after any outcome has been seen says so in its first line.
Form: full (AUTONOMY.md §21a: size per §21c, new user-visible behaviour, a new exposure surface, and properties currently under test; §25(e)).

## §0. Disclosure

0.1 Inputs.
- The plan, whole, and its ruling.
- The human's direction of 2026-10-11, items 1 and 2.
- Question round 66 (state/questions/round-66.md:12-13 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:1f49a1323ce4cd4978203a4fefc665df62a7f413d49ee641f078c8f567834518) and its ruling, cited by round and item.
- state/directives/O-07-WALKTHROUGH-2026-10-05.md, steps 2 and 3 (state/directives/O-07-WALKTHROUGH-2026-10-05.md:29-37 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:bb0b1f4a97061a99874e2b0db6df169b76e1fcc2558462d5fefa9872bf33c533) and its notes row for step 3.
- The design notebook, state/drafts/design/SPATIAL-IDE-DESIGN-NOTEBOOK.md, §3.4, §5, §6 and §12. It is not Authority.
- The layer-model reference, state/drafts/design/LAYER-MODEL-DECISIONS-2026-09-28.md. It is not Authority.
- state/directives/PORTABILITY-2026-09-30.md §2 and §5.
- ADR-001 and its 2026-08-09 amendment; ADR-006; ADR-010 rules 1 and 6; ADR-021 (its Decision, whole); ADR-024; ADR-036, which is Proposed and binds nothing.
- SKP-V0 §7.2 to §7.5.
- engine/src/predicate.rs, read only as the consuming side of the filter seam.
- Milestone 1's form with Amendments 1 to 13.
- Milestone 2's form with Amendments 1 to 3, read last amendment first, and its drafting record.
- The OPEN-11 ruling (state/directives/2026-10-11-open-11-a-piece-f-opens-ported-notices-required.md:6-11 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:66676a251d351edb2dd6170c9abb9b742cbbee88f7ea050b32b432846144aff7).
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
- **One predicate, sent as typed.** FilterPanel's input goes through `predicateTextToFilter`. That function turns empty into null and sends everything else verbatim, with no trim and no ceiling, and the kernel is the only admission authority (frontends/shell/src/filter/predicateInput.ts:7-21 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:9ada1b19f310017bd63528f2e27e3a18c1fbc6aac5752fca1c48deb3e7177c64). The panel's Apply and Enter both call its `submit` (frontends/shell/src/filter/FilterPanel.tsx:52-75 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:c368a1a233b12f9d4477c7184c2fb48322e7af21ec785e640359093055b890d2). It shows the applied predicate (frontends/shell/src/filter/FilterPanel.tsx:123 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:4ca189b570cf0d286e23a6c22360c338378ced873dc82230cd9f3ca35f391bac) and its own refusal (frontends/shell/src/filter/FilterPanel.tsx:132-136 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:2c5d6720d14438427aa1234a960a45e8f42ba564163611cced2340e5e45d2ea4).
- **The filter seam in App.**
  - `applyFilter` (frontends/shell/src/App.tsx:300-342 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:7cdffbcce25b7468ae352072b1454fc68ef047db3d9efd2400158d4d0089973b). It cancels the pending debounce and issues `requestViewport(null, newFilter)`. It commits and re-fits only on an issued outcome. On a refusal it formats the refusal first, then re-issues the last applied filter over the last view. Any other outcome is not applied.
  - Its deps (frontends/shell/src/App.tsx:243-272 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:c7a54d34be5d50d5a152b108dc463c05062769b4df91400d4cedd2bfd55f5dfe) and outcome (frontends/shell/src/App.tsx:236-241 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:f62c0f8367da7de59c7fb9b3afd3fb2dcbde8a4970b383367a2689deb54d3168).
  - App binds it in `handleApplyFilter` under a generation guard (frontends/shell/src/App.tsx:929-965 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:d89199beacbc42d3481c8b4f0c5fe505e45a5ffd3196d1844d96e5d3c09b0eea).
  - The commit writes the ref and the state (frontends/shell/src/App.tsx:901-904 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:8f07148cd6c10e39d0308b90923a92fdfd2349577266b7e331a74097f5d49a3d; frontends/shell/src/App.tsx:816-817 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:e31b73713cf72e6828950b94c2f475d832e4972e89f59feacf6df5f109f35385).
  - Milestone 2 phase A routes this commit through `filter.apply` (its §2.1(b)).
- **Two dev hooks also call `applyFilter`:** frontends/shell/src/App.tsx:1407 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:e8cf144fc06f05d56fa8395b41eeb0792e680b2519818898b80ffa92899223b1 and frontends/shell/src/App.tsx:1568 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:c52ef30d7780c7f49f09ccda653a102fe17ba67015318aaa75640cc639f0cb85.
- **The Filter slot** keys FilterPanel per dataset (frontends/shell/src/App.tsx:1674-1688 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:f92daa169dcdc97740cdd337c089da0da2350dd8f3ea33c5c0fcbdba84977aec). The export gets only `activeFilter !== null` (frontends/shell/src/App.tsx:1975-1983 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:a8f5e3a079d3022d7418d7e36b45616d7724ecd2bf6df7971b019fa4e1c5d7d1).
- **Keys.**
  - One `keydown` listener on `window` (frontends/shell/src/layout/StudioLayout.tsx:152-164 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:63ba5a969a9cfb6721423af67e426e36030fc99fa0fb8e477ddb527f7a5511bc) calls `runAction` (frontends/shell/src/layout/StudioLayout.tsx:146-150 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:80fbe985163b06b5cbf772f081d537c264c4cc25b11228f9db596814a2f54809).
  - The registry holds four entries and the one platform read (frontends/shell/src/layout/actionRegistry.ts:14-35 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:9b8c11b2ba6297b5b433f826ff3166e88635dbde4a0747e4148f9f09f1a44abb; matcher frontends/shell/src/layout/actionRegistry.ts:73-84 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:93c3a34180377b4260810cc0a132fdb11de42d0187b520c3b7a16e983f304a05). The chords act even while a text field has the focus (milestone 1, §2.3(c)).
  - Milestone 2 adds bare N and S, ignored in text fields (its Amendment 1, A4).
  - The canvas's Deck has `controller: true` (frontends/shell/src/canvas/WorkingCanvas.tsx:1940 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:8d2e6d749505719bf8174a9a1a37715edb85af8c06e100012c0ab58fc4f983aa).
- **The top bar** holds only the title and the toggles (frontends/shell/src/layout/StudioLayout.tsx:207-228 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:712bb7ac5db21d5c1cde88f52caf3cdf7584051063dc447ab2227ac33516a792). The plan puts search there from this milestone (state/directives/SHELL-MIGRATION-PLAN-2026-10-07.md:78 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:ca07deccba2a597164cc163084a1f292306f4b13fa1dc976a535766071579d71).
- **Open.** The Open button calls `handlePick`, guarded only by the button's `disabled` (§1 F4 of the drafting record; the AdmissionPanel pins in §0.5).
- **Export.** PublishPanel owns its `expanded` state (frontends/shell/src/publish/PublishPanel.tsx:328 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:21189cbd2e2b67dd867b9107577692f69f55a00e242988f5935f5cda5e5a533f) and its disclosure (frontends/shell/src/publish/PublishPanel.tsx:502-514 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:f27a42cb4420e2f72f54e7b8ea7452b9791403e1c17c7d8b016c41da8a3c0f65).

0.5 Consuming-side interfaces, read before any seam is drafted.
- **The kernel's admission.**
  - The kernel receives one `Filter {predicate, dialect}`, with `dialect` fixed (frontends/shell/src/skp/types.ts:17-20 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:0ddd58f318eb570e0fee28deb61911ebd5b995a1fe364db66b98bc325319a44d; frontends/shell/src/skp/types.ts:244-251 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:e1133c8ba42826fc8d019e262582e0224f532e2336ebe49bc4523c4ee58d5945).
  - It composes the predicate as `WHERE (<predicate>) AND <bbox>` (protocol/skp/SKP-V0.md:403-421 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:0033a237f6827c35b6c5d06cbfd33d444989ef7d5ed0bf9e637d22f66f7c7cb2).
  - It admits by `AdmittedPredicate::admit` (engine/src/predicate.rs:113 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:ce0c71917b0e199571309d3b989658e12bbf5c533ff7789ab3308ff65485cf94).
  - It refuses a predicate over 4,096 bytes by name before parsing (engine/src/predicate.rs:59 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:905bc287c8263cf56a27703446f1acb936490c75972ecf2e51bbf4093328aea3; engine/src/predicate.rs:120-126 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:0d1babe0c044b86a40c5437882c0dca42e4503e88d23192e8550b937ad84bd4d), and one deeper than 32 levels (engine/src/predicate.rs:70 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:bba7755d315e486142dce0ce9eae94ae29e583a9594bb9e4f58c72898b18dc93).
  - Its admitted constructs are protocol/skp/SKP-V0.md:442-458 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:86c7813f5e3103e5e18370e82301b7794c6d4d1e9fafe770761aed27427214bf, and its refusal codes protocol/skp/SKP-V0.md:465-483 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:b9cafd3297d782fcfc37a04d40e7f5feb785feb4078ff683eb90188ccd6310c0.
  - Its namespace is the schema without the geometry column and without columns not admitted for filtering, judged by the kernel (protocol/skp/SKP-V0.md:423-425 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:7cb203d913ea47bd89eb0b943c11b26e62a81403265e8582b86c33abd5c02823).
- **The schema the shell holds.** `describe.schema[]` is `{name, arrow_type, nullable, projectable}`, with no filterable flag (frontends/shell/src/skp/types.ts:158-167 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:55cda2d3d2a230c032fea846c6afa83fda61757f20f83f9ff11c546744015653). `describe.geometry.column` names the geometry column (frontends/shell/src/skp/types.ts:116-129 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:1be3c90172781dfc71e938837d84223d175f8ffe5402d3dbfc12eed77bcd6e01; frontends/shell/src/skp/types.ts:186-191 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:826b58fbd287ee088963cfa4f7c9bfddb6197ccdb6ca3e1dff41e03bd3aeed31).
- **The open path.** AdmissionPanel's Props (frontends/shell/src/admission/AdmissionPanel.tsx:258-260 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:b9484c475e12b276fe1498b1bd50e15587e44d21e855462dbc9f3ebe66db8baf), `handlePick` (frontends/shell/src/admission/AdmissionPanel.tsx:290-296 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:03e18920860c94be49a0b6d145827aedc02ead71394f884ce594a64ac825d416) and the button (frontends/shell/src/admission/AdmissionPanel.tsx:348-350 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:37e5c4be9884a5966d94874fb2841bcfee0133bdca0ae8328bc7127577a7af05). Milestone 2's B3 may add `confirmOpen` to this path; it is read at the base.
- **The export panel.** Props frontends/shell/src/publish/PublishPanel.tsx:284-305 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:997c59ce56ad68466f8c255bab0b06876737e2b493ffed4a1cadbbd8767dedfa; the button frontends/shell/src/publish/PublishPanel.tsx:604-611 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:40ce288199da75877461e383f672943fe604400f7a76e76c9e1214fe8dec598a. Milestone 2 adds `stageScope`, `checkStagedScope` and `onExportRunning`; they are read at the base.
- **The registry and the frame.** StudioLayout's props (frontends/shell/src/layout/StudioLayout.tsx:107-117 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:1ac2231a88254131218f77839e38f362d1b6657b11b4b15fc5d38c8262b636b7), the label functions (frontends/shell/src/layout/actionRegistry.ts:86-95 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:f81523f33f7641bd3973902a8e0ca052e16cc014db9927359364ac69f8a2e8ab), and the slots (frontends/shell/src/layout/contributions.ts:66-72 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:a077987dda7001deb0e34b93de6f8969dd3f7c654fa73773f3e23dfbb4051044). Milestone 2's additions are read at the base: `topBar.tools`, the tool ids, `matchToolKey`, and the scope declarations.
- **Milestone 2's workspace, read at the base and drafted here against its ruled form:**
  - `ViewState`, `filter.apply` and the union of `applyViewTransition` (its §2.4);
  - `resource.admitted`'s reset of the filter (its §2.1(a));
  - `resolveScope` and `checkScope` (its §2.5);
  - the selection's survival of `filter.apply` (its §2.3, UB5).
- **The render harness.** frontends/shell/src/App.layout.test.tsx:11-14 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:4c41aeb31e33a7ae03d43911b47992bcf27cffe93badb7b106d90a5980e061c9. It mocks the SKP client (frontends/shell/src/App.layout.test.tsx:64-103 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:fa25900a4c39dbd0d518f50aba31a6d04e9bb4d7a5d9333545770df444bafb48) and the stream manager, whose `requestViewport` never settles (frontends/shell/src/App.layout.test.tsx:109-119 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:2ae70974bae4236f2ab694e37a3a037931302aa0f6d2213294bf29cd52d1b793). This piece's copy makes that boundary settle per test (§4).
- **The Tab walk.** frontends/shell/e2e/layout.mjs:190-221 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:0e201e32458087b4d29fcac8dbbc967287cb458dd497dedac5bef0040148e80a.

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
  - WorkingCanvasHandle gains one read-only method, `cssPixelsPerUnit(): number | null`. It returns `2^zoom` from the camera the canvas already holds, or `null` before a camera (the CSS-pixel reading at frontends/shell/src/canvas/viewportBbox.ts:16-23 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:9039376f9697a5defe84cf8cc350e74827dad527bc289bffd84424750da14828).
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
- **The wording-block rule** applies by reference to the human's direction of 2026-10-11, item 2 (state/directives/2026-10-11-direction-after-status-review.md:14-25 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:d26d781228f0ac58aa937aa3793ff96560f334f3401dcb70ee663f48480882ec).
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

The worker's and tester's briefs carry, as written, the paragraph at state/directives/2026-10-06-machine-script-adopted.md:12-22 @ ceff6d82bdd3223fefed46e209913db6d1552d40 sha256:7350977156bed7c94b0da4e8db806ba34c25c6678e65c46447a62d791ba9e8e1. This form names no other rule for builds.

### Amendment 1 — the human's rulings on OPEN-1 to OPEN-11 (class 5; class 9 for items 3 and 9)

*Written by the custodian on the human's typed rulings, before any code. References only. The rulings are item 5 of `state/directives/2026-10-11-merges-210-211-pilot-recorder-2f-milestone-3-rulings.md` (the rulings), cited by OPEN number.*

1. **OPEN-1:** package (A), all eight points. UC2, RC10 and E-BARFOCUS stand.
2. **OPEN-2:** package (A). §2.5 and §2.6 stand as drafted for (A). (C) stays a possible later node, on the felt verdict of item 3's row.
3. **OPEN-2's felt row (class 9):** §2.10's new Part gains one felt row after Y4: turn a card off and on, and say whether the map re-fitting each time helps or disorients. The row carries Y4's question on the re-fit. Y4 keeps its question whether it is clear what is on. MANUAL-WALKTHROUGH.md stays outside §7's count.
4. **OPEN-3:** (A), with the rulings' words on what the recognizer decides, referenced. §2.5's recognizer, UC4, UC5, RC7, E-ADV and Y6 stand.
5. **OPEN-4:** (a). fieldCompletion.ts, UC6 and E-FIELD stand as drafted for (a).
6. **OPEN-5:** (A). RC8, RC9 and E-REVEAL stand.
7. **OPEN-6:** (a). §2.8's OPEN-6 (b) part and §7's NM row are not built. They become the proposed node `shell-native-menus-macos`, after `shell-real-app-run-macos-linux`.
8. **OPEN-7:** (c). §2.8's OPEN-7 (a) part, §7's SC row, the SCALE_BAR_MIN_PX and SCALE_BAR_MAX_PX constants, and Y12 are not built. They become the proposed node `shell-scale-display`, which carries (a)'s shape as drafted. The human places it later.
9. **OPEN-8:** (b), with the bare `/` opener on the rulings' terms, referenced (class 9: the form named the option but did not build it out).
   - **Where:** in PR A, beside Ctrl+K: the keydown listener and actionRegistry.ts's match. U5's edit (finding F7) covers both keys.
   - **RC-SLASH** is a render test in App.command.test.tsx. It has three cases:
     - `/` with no field focused focuses the bar and leaves `/` in it;
     - the same key sent with shiftKey true does the same;
     - `/` with a text field focused changes nothing outside that field.
     Its one recorded mutation requires shiftKey to be false, so the second case fails.
   - **The e2e step:** command-bar.mjs gains one step with real keys. `/` pressed from the map focuses the bar with `/` in it, and `/` typed in the Filter section's input stays in the input. H2 covers whether `/` reaches the page.
   - **§7:** its lines count in A-P, A-T and A-E's margin. An overrun is class 8.
10. **OPEN-9:**
    - The strings are sighted at row Y11.
    - (ii), and item 39's third sentence, are approved as drafted.
    - (i) is the human's own words, under the author's one check (`state/directives/2026-10-11-direction-after-status-review.md`, item 2b). The check FAILED on its first clause, `state/consults/2026-10-11-shell-migration-milestone-3-open-9-i-check.md`: the list leaves out forms the recognizer treats as simple, and those combine with other cards. The author's drafted words fail the same clause.
    - Which words land is back with the human. The KNOWN-LIMITATIONS lines land in PR B, so no code waits.
11. **OPEN-10:** (a), the order is kept. **OPEN-11:** (b), two PRs.
12. **§7:** the total stays 5,577. The NM and SC rows were conditional and outside the total, and they leave with items 7 and 8.
13. **Generation:** the node's generation goes up by one.
14. **Superseded index:**
    - §11's table → items 1 to 11;
    - §2.8 → items 7 and 8;
    - Y4's question on the re-fit → item 3;
    - Y12, the SC and NM rows and the SCALE_BAR constants → items 7, 8 and 12.

Nothing above is edited. The re-sweep amendment (§0.3) follows before any code, after milestone 2 has merged.

### Amendment 2 — OPEN-9 (i) withdrawn by the human (class 5)

*Written by the custodian on the human's typed ruling, before any code. References only: `state/directives/2026-10-11-harness-approval-open-9-i-withdrawn-a10-late-cancel-adr-029.md`, item 2.*

1. **The human withdraws their words for (i)** and takes neither the author's words nor their own. No sentence for (i) lands now.
2. **With PR B,** the architect drafts (i) under item 2e of `state/directives/2026-10-11-direction-after-status-review.md`, from the recognizer as built.
   - The sentence defines the limit by the mark the app shows on the card, not by a list of forms.
   - It carries its clause check.
   - The human approves or replaces it then.
3. **Generation:** the node's generation goes up by one.
4. **Superseded index:** Amendment 1 item 10's bullet on (i), and its "which words land is back with the human" → items 1 and 2.

Nothing above is edited.

### Amendment 3 — the re-sweep at code start absorbed before any code: the moved and changed pins (class 3); scope addition: card changes recorded in the session history, on `state/directives/2026-10-14-215-c1-216-merge-current-view-open-3-b2-1b-open-1-to-10.md`, item 4 (class 9); the bar's place, one dispatch, `ViewState.clauses`, the bare `/`, the harness, `/open` during the ask, H3 and the order (class 1, written after the re-sweep's results were seen); C9 is I4

*Drafted by the architect at main b88b1d2f, before any code of this piece and after the re-sweep's results were seen. The re-sweep is `state/consults/2026-10-16-shell-migration-milestone-3-re-sweep.md`, read at b88b1d2fba04e43489d4ef480060f45df2026173 (B below) and cited by section. Its sha256 from line 5 to the end is 4ec40659e5e644d574dccee0a77b0302da69ba013435341261c7959d92272ee5, as its filing note gives. Every `@ ceff6d82…` pin is historical (§0.3): the tree at B is authoritative for the work, and the pin for what this form read. References only; nothing below is a quotation. Read the last amendment first.*

1. **The 21 moved pins and the two bare cites (class 3).** Each Moved row of the re-sweep's §1 table is carried at its Lines-at-B span, at B, with the hash that table gives, which is the form's own. §2.5's bare cite of App.tsx's re-fit comment and UC8's bare cite of the test at :49-51 read as the two rows under that table. §0.5's engine pins moved because `AdmittedPredicate` gained a member and an accessor (re-sweep §3). `admit` and both ceilings are the same text, so this is not I4. No claim changes, and the table is not restated here.

2. **The changed pins C2 to C8, C10 and C11.** Each is re-pinned at the span the re-sweep's §2 gives for it, except where a row below says otherwise.
   - **C2 (class 3).** `activeFilterRef` is at the re-sweep's span. `activeFilter` is at frontends/shell/src/App.tsx:843 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:a400e483fc84063be6c8ad223c0dd0e90331ee1d79c15f954296a4b8f9830c54 and is read from the view's `filter`. The re-sweep's line 836 holds `stepNoticeText`'s call, so its pin is not carried.
   - **C3 (class 3).** §0.4's Export sentence reads: of the filter, the Export panel gets only `activeFilter !== null`, as `filterActive`. Its other props at B are App's view box and scope callbacks (re-sweep §2 C3). App's side is §0.4's read, not a §0.5 interface. Seam 6 holds as the re-sweep reads it.
   - **C4 (class 3).** This is still the one window listener. Its dispatch consequence is item 6.
   - **C5 (class 3).** `bareKey`, `scopeWords` and the four ids are milestone 2's additions, which §0.5 names. `matchChord` is the same text.
   - **C6 (class 3 for the pin; class 1 for the two choices).**
     - **Where the bar sits.** StudioLayout mounts the bar directly after the `.app-header` span, as its sibling, and before the tools block. The bar therefore keeps its place when a dataset is admitted and the tools appear. No test reads this order (re-sweep §2 C6). regression.mjs's read of that span's text is unaffected (frontends/shell/e2e/regression.mjs:378 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:746b8a236d267c7ec4bcc5db1379ce1f75f25e28b514b267e68696d55ef47133).
     - **How the list is drawn.** The list uses `position: fixed`. Its top is at the top bar's bottom edge, `--top-bar-h`, which StudioLayout already sets on `.app` (frontends/shell/src/layout/StudioLayout.tsx:201 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:5da5477ac415bb9fa00e40b6ed2280256e46cf3c52b82f38bd319a177cee7c6c). Its left is at the input's left edge, read when the list opens and on a window resize while it is open.
     - **Why it is not clipped.** `.top-bar`'s `overflow: hidden` (re-sweep §2 C6) is not edited. No rule in styles.css at b88b1d2f gives an ancestor of the bar a transform, filter or containment, so the fixed list is not clipped by the bar. The list covers the regions below only while it is open, and §8 item 11 forbids only a permanent element over the map.
     - **The test.** E-SEARCH also asserts that, with the list open, `document.elementFromPoint` at the first option's centre returns that option, and that the option's top is at or below the top bar's bottom. Mutation E-SEARCH-b: draw `.command-list` in normal flow; it fails on `elementFromPoint`.
   - **C7 (class 3).** The eleven-code table is identical. One cross-reference is reworded, so §0.5's interface, the codes, does not differ.
   - **C8 (class 3).** `confirmOpen` was built, as §0.5 anticipated. Its consequence is item 11.
   - **C10 and C11 (class 3).** Both are milestone 2's additions, which §0.5 anticipated. `selectTab(inspector, layer)` stays valid.

3. **C9, PublishPanel's props: I4.**
   - §0.3 classes an interface that differs from §0.5 as I4, with no qualifier for how much of it the plan consumes.
   - §0.5 pins the panel's Props and names only milestone 2's three additions. At B the Props also replace `hasSettledView` and `getLastViewportBbox` with `getViewBox` and `subscribeViewBox`, from PR #219, which is not milestone 2 (re-sweep §2 C9).
   - §5 says that I4, like every invalidator, means STOP and report. The re-sweep's C9 is the report. No code of this piece starts before the human answers OPEN-12 (§11 addition below).

4. **B1, card changes recorded (class 9, scope addition).**
   - **The rule.** The human's ruling of 2026-10-14, item 4, at the path in the heading: OPEN-10's docs/07 note, now docs/07_Roadmap.md:40 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:33c66299384f5a1ca0cc944632c055f9e5c8da78bdc96ffdfe8cd6be71696a3b, and §2.10 L's item, now KNOWN-LIMITATIONS item 43 (KNOWN-LIMITATIONS.md:390 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:c22c976f428e62d266bf47043a06e577a3dc7e77d07c4136a1aa34a97c1353eb). Both state that each filter change a user commits is recorded. Plan §7, which this form already pins, makes a clause toggle an ordinary step. A card change that recorded nothing would make both statements untrue.
   - **Inside the human's rulings.** The step is piece 1b's registered `filter.apply` with a whole `Filter | null` (frontends/shell/src/skp/types.ts:301-303 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:3eb82dd659ab2f9ff01515783f308b6d6717d76032bf4afa778a4f24dd04ebd2). No action, wire or kernel change is needed, so this item is decided here and not opened.
   - **(a) §2 shape.**
     - One helper in App writes `activeFilterRef`, dispatches the given transition on the view, and enqueues `{action: "filter.apply", params: {filter}}` for `admittedDatasetRef`'s dataset. This is what `commitActiveFilter` does at B (frontends/shell/src/App.tsx:987-996 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:05f80495437e9063153300b3e1aec92d8f7fbc7c6e69014812e72238cbea530d).
     - `commitActiveFilter` becomes the helper with `filter.apply`. §2.5's card commit is the helper with `filter.clauses.set`. No other site enqueues a filter step.
     - The helper runs only as `applyFilterWith`'s `commit`, inside the same generation guard. Only an issued outcome is recorded; a refused, not-applied or shell-refused change records nothing.
     - What is recorded is the combined filter as a value: `combineClauses` of the enabled cards, or `null` when none is on. It is never a clause, a clause id, an on/off state or a delta.
     - `stepRecorder.ts`, `skp/` and the wire are not edited.
   - **(b) §1 Principle 4's second bullet, and §2.5's Rows bullet,** read as follows.
     - A card change that reaches the kernel shows as the class-A rows an Apply shows: `viewport_query`, then `record_step` when issued.
     - The rows `filter.clauseAdd`, `filter.clauseToggle` and `filter.clauseRemove` are not added. Piece 1b set the precedent by removing the style rows once a step was recorded (frontends/shell/src/console/surfaceRegistry.ts:167-177 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:bd7ea00160f62038df64c495f71ba947b40592bb63e64b3a05a1bef009a90986).
     - One class-C row, `filter.clauseNotSent`, is added. App's handler records it for a change the shell refuses under OPEN-3 (A), which sends nothing. Its statement is a P6 placeholder, and its owner is docs/03's action console, as for `style.resetToDefault`'s row.
   - **(c) §1's claims.**
     - **May not claim, fourth bullet, reads:** that anything here is undoable or saved, or that a clause is recorded. Each issued card change is recorded in the kernel's session history as one `filter.apply` step holding the combined filter, as an issued Apply is. The history holds no clause, clause id, on/off state or card list. Clause changes are workspace mutations (ADR-006) with no undo, and B2's compaction is B2's.
     - **May claim gains:** an issued card change records one `filter.apply` step with the combined filter (RC3, RC5, E-AND).
     - **§2.5's sentence on the step's clause id reads:** the transition's `step` carries the clause id for the reducer, and the session history carries none.
     - **§4's acceptance line for a toggle reads:** UC7 (the typed transition) and RC5 (the one recorded step). The shell keeps no log.
     - **§8 item 14** reads as a shell-side log only. The kernel's session history is piece 1b's.
   - **(d) §4.** Each mutation below is observed under §4's rule.
     - **RC3** also asserts that the mock's `recordStep` receives exactly one `filter.apply`, after the outcome, whose filter equals what the manager received. Mutation RC3-b: the card commit skips the enqueue; it fails on the step count.
     - **RC5** also asserts that the off step holds the remaining combination, the on step holds the restored one, and a refused toggle records none. Mutation RC5-b: enqueue the toggled clause's own text; it fails on the off step.
     - **RC7** also asserts one `filter.clauseNotSent` row and no `recordStep`. Mutation RC7-b: drop the row; it fails on the row count.
     - **RC14** does not assert the step. It stays item 39's clause check.
     - **E-AND** also asserts that, after card B is added, the console holds one more `record_step` row that reached ok, whose request carries `.filter-active`'s text. This is the seam's end-to-end proof from the real shape. Mutation E-AND-b: the card commit skips the enqueue; it fails on the row.
   - **(e) §5.**
     - **Declared unchanged, added:** what an Apply records (App.recording.test.tsx's A1 and A3 pass unedited); `stepRecorder.ts`, `MAX_PENDING_STEP_RECORDS`, `noticeText` and `StepIntent`.
     - **New invalidator I14:** recording a card change needs an edit to `stepRecorder.ts`, `skp/` or the wire, or a step that carries a clause.
   - **(f) §8, added.**
     - 25. A card change that records anything other than one `filter.apply` step holding the combined filter, records before its outcome or on a refusal, or enqueues from a second site.
     - 26. A clause row whose statement says no API equivalent for a change that was sent.
   - **(g) §9.** The P6 sight list gains `filter.clauseNotSent`'s statement, at AB11. `e2e:recording` is in every suite list (item 12).
   - **(h) §7.** The work lands in B-P's App.tsx ≤ 200 and surfaceRegistry.ts ≤ 40, B-T's App.command.test.tsx ≤ 600, and B-E's command-bar.mjs ≤ 420. §7 is not edited, and an overrun is class 8.

5. **B2, the record-failure notice for a card change (class 9, part of item 4).**
   - **Behaviour.** A card change's step goes through the same queue. If it is not recorded, the attention strip shows the owner's existing filter notice (frontends/shell/src/workspace/stepRecorder.ts:80-86 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:870569ab7e35d84d0d54fe11759bcca04f8c5f93a361ca68c22f11b1d8eca74f; the slot, frontends/shell/src/App.tsx:2175-2176 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:3d231a759b044ce2e32a08d6d155f6906a594024742036f4867d3441d57178c4), the same sentence an Apply's shows.
   - **No new string.** Those sentences stay piece 1b's P6 placeholders for the sitting (its Amendment 9, item 2).
   - **Wording.** §2.5's Rows bullet and §1's operator-text bullet each gain this fact. The notice states the shell's consequence, that the filter was applied and the history did not take it, and carries the kernel's message as the kernel gave it.
   - **New RC16 (B, render, App.command.test.tsx).** With `recordStep` refused, a card change is still applied (the cards and the applied filter change), and the strip shows the filter notice with the mock's message. Mutation: the card commit calls `recordStep` directly instead of enqueuing; it fails on the notice.

6. **B3, one dispatch (class 1).** At B, `runAction` reaches only the region toggles and Zoom to layer (frontends/shell/src/layout/StudioLayout.tsx:157-161 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:80fbe985163b06b5cbf772f081d537c264c4cc25b11228f9db596814a2f54809). The other four entries run through App's handlers (re-sweep §4 B3).
   - **Shape.**
     - StudioLayoutProps gains optional `onZoomToSelection` and `onClearSelection`. App passes its `handleZoomToSelection` and `handleClearSelection`, the functions the Feature tab's buttons call, as it passes `onZoomToLayer` and `onSelectTool`.
     - `runAction` gains one arm per entry. Navigate and Select call `onSelectTool` with the entry's tool, and the two selection entries call the new props.
     - This piece's `dataset.open` and `layer.revealExport` reach App the same way, by optional props.
     - Every new prop is optional, so StudioLayout.test.tsx, which §2.9 does not list, compiles unedited. An absent prop leaves its entry unavailable.
     - The listener's bare-key branch is not edited, since it already calls `onSelectTool`.
   - **Availability.**
     - Zoom to selection and Clear selection are available only while a dataset is on the map and App's selection has at least one member. That is the condition on which the Feature tab enables both buttons (frontends/shell/src/feature/FeatureTab.tsx:103 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:cf60d1dbd2722f95afdb9c9f524b16d9b41268d424ade8e033c1fd27c3263d82; frontends/shell/src/feature/FeatureTab.tsx:133-140 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:b694b5eca33aecb1d49bc04332412e0aaea8a98556490cffff4e1d3a42059316). App passes it as one optional boolean prop.
     - Navigate and Select are available only while a dataset is on the map.
   - **Wording.**
     - §2.2's second availability bullet reads: Zoom to selection and Clear selection follow the Feature tab's empty-selection rule, and Navigate and Select need a dataset.
     - §2.3's Running sentence reads: an applied action calls StudioLayout's one `runAction(id)`, which calls the function the entry's chord, bare key or button calls.
     - §5's second falsification reads: the bar cannot run an entry through StudioLayout's one `runAction`, reaching the function its chord, bare key or button calls, without a second dispatch path.
     - §8 item 8 reads: a bar-run entry that does not go through StudioLayout's one `runAction`, or that reaches a function other than the one its chord, bare key or button calls.
   - **New RC17 (A, render, App.command.test.tsx).**
     - Navigate and Select run from the bar switch the tool and record one `tool.set` row each.
     - With nothing selected, both selection entries are listed `aria-disabled`, and Enter runs neither.
     - With one feature selected by the stand-in click, Zoom to selection calls `fitToBbox` once and records one `selection.zoomTo` row, and Clear selection empties the selection and records one `selection.clear` row.
     - Mutation RC17-a: the Clear selection arm clears through a copy that records no row; it fails on the row.
     - Mutation RC17-b: leave the selection out of availability; it fails on the empty case.
   - **§7.** Within A-P's StudioLayout.tsx ≤ 90 and App.tsx ≤ 80, and A-T's App.command.test.tsx ≤ 500.

7. **B4, `ViewState.clauses` (class 1).**
   - **The member.** §2.5's member is optional, `clauses?`, read through a reader beside milestone 2's readers that returns none when the member is absent. This follows milestone 2's route (frontends/shell/src/workspace/workspaceState.ts:60-66 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:386b219718c2667b1942d3f9da166a7bab6a43211d54a4ed52c5a9f63490a7b5; frontends/shell/src/workspace/viewTransitions.ts:63-69 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:2e56789b59ede25bb73e9d1d4ddb7bed64abd175fdf887af47e308686de00bdf).
   - **The pinned tests.** A minted view stays the four-member object. frontends/shell/src/workspace/workspaceState.test.ts:46 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:4204194667f729eefe4b17d41715669fba7666f31cc6d82203de82425804bbfd and frontends/shell/src/workspace/workspaceState.test.ts:155-163 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:c86b2532c0d26c854507d8c694e7028dbddd3289339010e58c9e0b73e5b1ccb4 therefore pass unedited. After a rebind, the reader returns none.
   - **The invariant** reads with the reader in place of the member.
   - **Further members.** Any further member PR B needs, such as the counter behind `clause-<n>` that a pure `filter.apply` must read, is optional on the same terms.
   - **UC7's union edit** is the UA4 test at frontends/shell/src/workspace/viewTransitions.test.ts:53 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:7b7d53092e74c993634559e816d76facce54884f03547e09995f84d5b5c201cf. Its `satisfies` table, its key list (:66) and its title gain `filter.clauses.set` and cite this form. UA4's recorded mutation is observed again at that commit and recorded beside the first.
   - **§7.** Within B-W's and B-T's ceilings.

8. **B5, the bare `/` (class 1; the shape of Amendment 1, item 9).**
   - **The matcher.** A third pure matcher in actionRegistry.ts, `matchCommandOpener(event, focus): boolean`, sits beside `matchChord` and `matchToolKey`.
     - It matches on `event.key` being `/` and never on `event.code`, because the key's position differs by layout.
     - It ignores Ctrl, Meta and Alt, `repeat`, `isComposing`, and an editable focus. It allows Shift.
   - **On a hit,** the listener prevents the default, and the bar takes the focus with the draft `/`.
   - **Unchanged.** `command.focus` keeps `bareKey: null`, so UB10 (frontends/shell/src/layout/actionRegistry.test.ts:249-257 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:b45e46d6e8f67f8861c1e66d460ddd4586b53fb99267e41d050c5865aff2279d) and `matchToolKey`'s cast are not edited.
   - **New UC10 (A, unit, actionRegistry.test.ts).**
     - `/` matches bare, with Shift, and with a `code` other than `Slash`.
     - Ctrl, Meta, Alt, `repeat`, composing and an editable focus do not match.
     - `Slash` with another key does not match.
     - Mutation: match on `event.code`; it fails on the Shift+Digit7 row.
   - RC-SLASH's three cases and its mutation stand. The lines count as Amendment 1, item 9 says.

9. **B6, the render harness (class 1; one correction, class 3).**
   - **Which harness.** The copy takes App.selection.test.tsx's harness at B, not App.layout.test.tsx's, because RC8's ask case, RC9, RC11, RC12, RC14 and RC17 need its parts:
     - a manager stand-in that records bbox and filter and settles issued, or with the refusal a test sets;
     - a canvas stand-in that keeps its props and counts `fitToBbox` and resets;
     - `publish/client` mocked to client.ts's signatures.
   - **What it gains.** Its SKP-client mock gains `recordStep`, logged and refusable, as App.recording.test.tsx's mock has it (frontends/shell/src/App.recording.test.tsx:69-75 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:c9d17b921982eed7a332be10d1b0617c5045a4a655cdaf511daef21ed69262ad). It also counts `fitToBounds`, as App.layout.test.tsx's stand-in does, for RC2.
   - **Correction (class 3).** §4's stand-in signature `(bbox, bboxCrs, filter)` was already wrong at ceff6d82. The manager's signature is `(bbox, bboxCrs, nowMs, filter)`: frontends/shell/src/streaming/viewportStreamManager.ts:163-168 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:cb533810c4f5834e6eff80cb41b9266610d80aac812b58f365d4295b614c6fba (unchanged since ceff6d82, re-sweep §3).

10. **B7, names (class 3, a name).**
    - **The Part.** The new Part is AB. The last Part at B is AA (frontends/shell/MANUAL-WALKTHROUGH.md:1897 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:238a27a791a87412e125b40fd675f65a7bf16914ac65b0da1cef884a3673909c).
    - **The rows.** Rows Y0 to Y12 read AB0 to AB12 wherever this form and Amendments 1 and 2 name them. The felt row Amendment 1, item 3 adds after Y4 is AB4a. AB12 stays not built (Amendment 1, item 8).
    - **KNOWN-LIMITATIONS numbers.**
      - They are read at the base of PR B's KNOWN-LIMITATIONS commit. They are the next free numbers after every number the file holds there and every number reserved by a committed form that has not been withdrawn.
      - Item 44's form reserves 44, so while that form stands, the two items take 45 and 46, whether or not item 44 has landed. A third item, for OPEN-9 (i) (Amendment 2, item 2), takes the next number.
      - The numbers and their base are recorded as a class 3 row in PR B's record.
    - **Item 39.** Item 39's third sentence is a sub-line span of KNOWN-LIMITATIONS.md:379 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:ade05ff3699847fc81592b239f647a4be3bb3b9338b4614efb3ef7196e647ade (the line's hash). It is unchanged since ceff6d82 (re-sweep §5). Its replacement stays under Amendment 1, item 10.

11. **`/open` during the picker or the ask (class 1).**
    - **The rule.** `requestPick()` keeps the button's own condition (§2.7), so `/open` does what a click of Open does at that moment.
    - **What that means at B.** A second `confirmOpen` drops the first ask as Keep (frontends/shell/src/App.tsx:1148-1160 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:2542da92eddef0b49db9120645bb15256c949619e96ce0f78ef02b5ce3800201). A second `/open` during the ask therefore drops the first open and starts a new pick, as a second click does. The busy line covers only `isOpenInFlight`.
    - **Why no second rule.** A rule the button does not have would make the bar a second path (§8 item 8).
    - **RC8's new case.** With the ask showing, `/open` calls the picker once more, and the first open does not proceed. Mutation RC8-b: `requestPick` returns busy while the ask is open; it fails on the picker count.

12. **H3 and the suites (class 1).**
    - **What "every existing e2e suite" covers.** It is the run set of piece 1b's custodian runs (`state/consults/2026-10-16-b2-piece-1b-recording-e2e-custodian-run-4.md`, its first block, cited as evidence):
      - every `e2e:` script in package.json at the base except `e2e:debug`. This covers `selection`, `export-view` and `recording`, which were added, and `console` and `regression`, which piece 1b edited.
      - `e2e:residency-harness`, by its exit code only; no figure it prints is recorded or claimed.
      - `pan-anchor.mjs`, `source-watch-idle.mjs` and `source-changed.mjs`, which have no script. `source-changed.mjs` runs on both routes, the default and post.
    - **S5d.** S5d on the post route is the PLAN item `source-changed-post-route-s5d-race`, which fails at main's base (the human's ruling, `state/directives/2026-10-16-222-adr-022-route-a-restore-and-reappend-reset-line-p6-s5d-own-item.md`). A failure of S5d alone is recorded beside the base's runs and is neither I12 at the base nor I3 at a head. A failure of any other step is.

13. **The e2e suites at the base.** The custodian's runs at the base B, the exe built there, each suite a fresh app: every run passed (`state/consults/2026-10-16-shell-migration-milestone-3-e2e-custodian-base-run.md`). Class 1.

14. **Rule 00 and order (class 1).**
    - At B no node is in progress and no PR is open (re-sweep §9).
    - PR A shares no path with `known-limitations-crs-epoch-edges-third-axis`.
    - PR B and that node edit different numbered items of KNOWN-LIMITATIONS.md, which count as disjoint (`state/directives/2026-10-09-rulings-additions-reaim-identity-route-documents.md`, item 5). Neither waits for the other.
    - Whichever merges later merges main in before its last gate run and re-reads its numbers (item 10), as that node's form, §E, also says. Its OPEN-1 and OPEN-2 hold only that node.

15. **Generation:** the node's generation goes up by one.

**§11 addition.**

| Item | Subject | Recommended | Red line |
|---|---|---|---|
| OPEN-12 | I4 on PublishPanel's Props (item 3) | the human's | no |

**§7.** Nothing is added. Each item's lines land in the groups it names. An overrun is class 8, and §7 is not edited.

**Superseded index.**

| Form passage | Superseded by |
|---|---|
| §0.3, which spans are current | items 1, 2 |
| §0.4, the commit, the state, the Export sentence, the top bar | items 2, 4 |
| §0.5, the export panel | item 3 |
| §0.5 and §4, the render harness and the stand-in's signature | item 9 |
| §0.6 H3; §3's suite prediction | item 12 |
| §1, May claim, May not claim, Principle 4, operator text | items 4, 5 |
| §2.2, availability | item 6 |
| §2.3, where the bar sits, the list, Running | items 2 (C6), 6 |
| §2.5, `ViewState`, the invariant, the step's clause id, the path to the kernel, Rows | items 4, 5, 7 |
| §2.7, `requestPick` | item 11 |
| §2.10, the Part, its rows, the numbers, item 39 | item 10 |
| §4, RC3, RC5, RC7, RC8, E-AND, E-SEARCH, UC7; new RC16, RC17, UC10 | items 4, 11, 2, 7, 5, 6, 8 |
| §5, declared unchanged, I14, falsification 2 | items 4, 6 |
| §8 item 8, item 14's reading; new items 25 and 26 | items 6, 4 |
| §9, suites and P6 sight | items 4, 12 |
| §11 | OPEN-12 |
| Amendment 1, item 9's place for `/` | item 8 |
| Amendment 1 and 2, every Y row | item 10 |

Read the last amendment first.

Nothing above is edited.

### Amendment 4 — the human's ruling on OPEN-12: PublishPanel's Props re-pinned at B (class 3), and I4 lifted; the order behind the unknown-attempt node's first step (class 5)

*Written by the custodian on the human's ruling (`state/directives/2026-10-17-merges-223-224-w-approved-open-12-flake-s3-unknown-attempt-slot-1-s5d-route-a.md`, items 2 and 4). References only.*

1. **OPEN-12 (a).** PublishPanel's Props at B are the interface: `frontends/shell/src/publish/PublishPanel.tsx:316-340 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:c96a903892194e291d04344dbfa921c51f457193cd1ad71897bbe98fe4847d04`, the span the re-sweep's §2 C9 gives, unchanged at main 46e56dc9aba8c63eff8c08fe8ddb14a4af0cee8d.
   - The two members that differ from §0.5, `getViewBox` and `subscribeViewBox` in place of `hasSettledView` and `getLastViewportBbox`, are PR #219's. Its merge commit e57e6436ab3e7452f3f1a7b61837cba6b93a6211 is an ancestor of B, and this piece consumes neither member.
   - They are re-pinned as class 3. Nothing else of I4 applies, so Amendment 3 item 3's STOP is lifted, and §0.5's export panel reads at this pin.
2. **The order.** The node `publish-approval-unknown-attempt-under-load` holds slot 1 now. Its first step records the prepare-to-execute elapsed time in every export step, and a TTL expiry reads INCONCLUSIVE, not a failure. This piece's code starts when that step has merged, since the two share e2e paths. The node's PLAN dependency carries this.
3. **The base.** §0.3 places the re-sweep at this piece's code base, the merge base with origin/main when PR A's branch is cut, which now follows that merge. Amendment 3 stands for B. What changed from B to that base is re-swept by §0.3's steps before any code, and its rows are appended then.
4. **Generation:** the node's generation goes up by one.

**§11.** OPEN-12 is answered. No OPEN item remains.

Read the last amendment first.

Nothing above is edited.

### Amendment 5 — the re-sweep from B to the code base 564aadae: two moved pins (class 3); the base's suites and rule 00 (class 1)

*Written by the custodian before any code, after the re-sweep's results were seen. References only. The record: `state/consults/2026-10-19-shell-migration-milestone-3-re-sweep-2-custodian.md`, sha256 08632629bf97a57fec7acd99742d49725408b168a7ef2eb36362a519734aa9b8.*

1. **The code base** is 564aadae556a39c2f3a0f567730ec58e4cfe0439, where PR A's branch `cut/shell-migration-milestone-3-pr-a` is cut (§0.3, Amendment 4 item 3). Amendment 3 stands for B.
2. **Pins (class 3).** Of the files the form's pins name, only `KNOWN-LIMITATIONS.md` changed from B to the base: item 44 landed above both lines Amendment 3 pins there, and each line is unchanged. Amendment 3 item 4's pin of line 390 reads at `KNOWN-LIMITATIONS.md:394 @ 564aadae556a39c2f3a0f567730ec58e4cfe0439 sha256:c22c976f428e62d266bf47043a06e577a3dc7e77d07c4136a1aa34a97c1353eb`; Amendment 3 item 10's pin of line 379 reads at `KNOWN-LIMITATIONS.md:383 @ 564aadae556a39c2f3a0f567730ec58e4cfe0439 sha256:ade05ff3699847fc81592b239f647a4be3bb3b9338b4614efb3ef7196e647ade`. Every other pin stands.
3. **The §0.5 interfaces** are unchanged: no code path changed from B to the base (the record's §2).
4. **The Part** is AB, and the two KNOWN-LIMITATIONS items take 45 and 46 by Amendment 3 item 10's rule, read again at PR B's KNOWN-LIMITATIONS commit (the record's §3).
5. **The suites at the base (class 1)** (the record's §4 and §5). Every suite passed in the shared series but two:
   - selection: E-EXPORT's execute returned `unknown-attempt` (U 92 ms, T 120,000 ms). Run alone twice in an exclusive hold, selection passed 18 of 18 both times, so by the machine rule the shared run's failure is not recorded as the suite's, and I12 does not fire. The attempt is recorded against `publish-approval-unknown-attempt-under-load` (its Amendment 7).
   - source-changed, post route: S5d alone, recorded beside the runs (Amendment 3 item 12).
6. **Rule 00 at the base (class 1).** In progress: `source-changed-post-reopen-routes-watcher-visible` (the source-changed driver, its README entry, walkthrough Part N) and `governance-decisions-pending-open-and-archive` (scripts under `scripts/plan/` and `scripts/hooks/`, and `AUTONOMY.md`). Awaiting merge: PR #230 (KNOWN-LIMITATIONS item 23). PR A shares no path with any of them, its README entry, its Part and its items counting as separate paths. No piece touches `protocol/`.
7. **Next:** PR A's code from the base, by one worker-high.
8. **Generation:** the node's generation goes up by one.

Nothing above is edited.

### Amendment 6 — PR A's gate 1 (both FAIL) and correction round 1: the custodian's rows (class 3) and the round's e2e (class 2 for E-SEARCH-b); written after gate 1 and round 1's runs

*References only. Gate 1: `state/consults/gates/2026-10-19-shell-migration-milestone-3-pr-a-gate1-architect.md` (549, A) and `state/consults/gates/2026-10-19-shell-migration-milestone-3-pr-a-gate1-reviewer.md` (550, R). Round 1: `state/consults/2026-10-19-shell-migration-milestone-3-pr-a-round-1-worker-report.md` (head 621cd1f3a0b5f12b8c837a45ebeffa472909fcb2). Its e2e: `state/consults/2026-10-19-shell-migration-milestone-3-pr-a-round-1-e2e-custodian-runs.md`, sha256 2773fdc5f110d308eb1f1c7218435cc37d97759b57a0ceaa56782921c34f5228.*

1. **§2.2's third availability bullet (A's D5, class 3)** reads: `dataset.open` is available whenever App passes its handler; while an open is in flight it is listed as available, and running it starts nothing and shows the busy line, because `requestPick()` answers busy on the Open button's own condition (Amendment 3 item 11; RC8).
2. **§2.4's result shapes (R's D3, class 3)** are the round 0 report's Differences item 1, as built.
3. **Tab (A's C1)** now follows OPEN-1's ruled point: it completes an active option, or the only candidate whether the list is open or not, and a second Tab leaves. UC2's recorded mutation (Tab sets `open: true`) now fails on the assertion that Tab closes the list, not on Tab leaving in at most two; two more UC2 mutations are recorded (round 1 report).
4. **E-SEARCH-b (class 2):** written down in round 1 and run by the custodian at the head: it fails E-SEARCH on the top-bar assertion before the predicted `elementFromPoint` line. Recorded in the round's e2e record.
5. **Next:** the PR body (A's D6), then gate 2, both gates, scoped to round 1.
6. **Generation:** the node's generation goes up by one.

Nothing above is edited.

### Amendment 7 — PR A's gate 2 (both FAIL) and correction round 2: the custodian's rows (class 3), Amendment 6's references, the bar's focus rule as built, and the round's e2e (E-SEARCH-c observed as predicted); written after gate 2 and round 2's runs

*References only. Gate 2: `state/consults/gates/2026-10-19-shell-migration-milestone-3-pr-a-gate2-architect.md` (551, A2) and `state/consults/gates/2026-10-19-shell-migration-milestone-3-pr-a-gate2-reviewer.md` (552, R2). Round 2: `state/consults/2026-10-19-shell-migration-milestone-3-pr-a-round-2-worker-report.md` (head 2fa7c8d09df2e8f21370c1bf68b23213a25615a0). Its e2e: `state/consults/2026-10-19-shell-migration-milestone-3-pr-a-round-2-e2e-custodian-runs.md` @ 4e4131125e70555ce6852f073e5e516912bfd9c3, sha256 de22c15ff17b99a81b652500649a1ca49ea83554f18a8f3fc9db026c86bb91db.*

1. **§4's E-BARFOCUS row (gate 1 A's C1; A2's D4 and R2's D4, class 3)** reads: With no list open and no single candidate, Tab leaves the bar; Escape returns focus to the element held before. The step runs from an empty bar.
2. **Amendment 6's references (A2's D5):** item 2's round 0 report is `state/consults/2026-10-19-shell-migration-milestone-3-pr-a-worker-report.md`, its Differences item 1; item 4's head is 621cd1f3a0b5f12b8c837a45ebeffa472909fcb2; the record its preamble hashes is @ afea0ff2fb785e06f208e28f0fb625d8cd359e5d.
3. **§2.3's Running rule as built (A2's C1 and C2, R2's C1):** the bar runs an entry inside `flushSync`, so the action commits before the focus goes back by Escape's rule; round 1's clear in `apply` is removed. RC10 cases c (the region's splitter) and d (a region closed and opened again) are added, their mutations observed (round 2 report).
4. **E-SEARCH-c (A2's E1):** written down in round 2 and run by the custodian at the head: it fails E-SEARCH on the `elementFromPoint` assertion, as predicted, so that assertion now has an observed failing mutation. Recorded in the round's e2e record.
5. **Carried to PR B (A2's note):** after a completion, ArrowDown reopens the list, where §2.3 keeps it closed until the next typed character. PR A cannot reach it, since every PR A completion is an exact word that takes nothing; PR B's `/filter` can, and PR B settles it.
6. **Next:** the PR body (R2's D5), then gate 3, both gates, scoped to round 2. The header's MUTATIONS sentence and the README's session-state sentence (A2's and R2's D1 and D3) take gate 3's words, fixed before the merge.
7. **Generation:** the node's generation goes up by one.

Nothing above is edited.
