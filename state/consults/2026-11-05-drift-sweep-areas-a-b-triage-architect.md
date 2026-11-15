*Custodian's filing note (2026-11-05): the architect's triage reading of the drift sweeps of area A (the shell's product comments, findings 1 to 11) and area B (the walkthrough and the e2e README, findings 1 to 12), under the human's direction of 2026-11-05, item 2 (`state/directives/2026-11-05-platform-runs-filed-c1-governance-next-fixtures-kernel-node-8b-route-a-f-b-after-8c.md`): the drift sweeps and the two docs audits triaged as on 2026-10-10, confirmed findings to nodes by the custodian's grading. Its brief by file (sha256 83c72b7d320f0adb8d9381bd7a0301227b161494125949c3983d46a897d010a1); its inputs the filed sweeps `state/consults/2026-11-03-platform-drift-sweep-area-a.md` and `state/consults/2026-11-03-platform-drift-sweep-area-b.md`, worked at 652752af; read at main 9b0c2a14. The run 18:23:36Z to 18:30:54Z by its transcript (claude-opus-5-5; unique calls Read 66, Grep 59 and the hand-back, equal to the notification's). Extracted by script from the hand-back message in that transcript (25600 bytes, sha256 f6daade18a25a1262706f93f86d422133f56d25be0c1af745787fe7f04f5089d), unchanged. A reading, not Authority: the grading and any node are the custodian's; walkthrough rows, the e2e README's security-posture paragraph, ADR text and strings a user sees are the human's words.*

---

**Verdict:** none. This is a triage reading, not a gate, so there is no Correctness, Evidence or Documentation verdict. Reviewed: main @ 9b0c2a14. I took that commit from the session's git status. I have no shell, so I could not confirm HEAD myself or check the brief's sha256. The working tree had staged changes to governance files, `governance/PLAN.yaml` among them, and I read PLAN.yaml as it stands in the working tree. No product file was in that staged set.

Tag: `triage:drift-sweep@areas-a-b`. Below, "A:" means `state/consults/2026-11-03-platform-drift-sweep-area-a.md` and "B:" means `state/consults/2026-11-03-platform-drift-sweep-area-b.md`, each cited by its filed line. "WT" means `frontends/shell/MANUAL-WALKTHROUGH.md` and "ER" means `frontends/shell/e2e/README.md`. Source paths are under `frontends/shell/` unless they start with another top-level folder. Every verdict comes from reading the code; I ran nothing. I write no replacement words: the walkthrough rows are the human's, and ER's security-posture paragraph is red-line text.

## Area A (shell product comments)

**A1.** The sweep (A:55): claims the whole module "is dead code once `import.meta.env.DEV` is `false`" and that `check:dist-clean`'s identifier list "covers this module's own entry point, `startCandidateArmSession`".
- **What decides it:**
  - `src/residency/candidateArmSession.ts:42-45` still says so.
  - The default is the candidate arm. `src/residency/residencyArm.ts:50`: `export const DEFAULT_RESIDENCY_ARM: ResidencyArm = "candidate";`
  - The session is built in every build. `src/App.tsx:1611-1612`: `if (shouldConstructCandidateSession()) {` / `const session = startCandidateArmSession({`
  - The identifier was taken off the dist check. `e2e/checkDistClean.mjs:98`: "plain production build therefore calls `startCandidateArmSession` BY DEFAULT now".
- **Verdict:** CONFIRMED.
- **Kind:** a comment that misleads. It describes the shipped default data path as dev-only, dead code.
- **Open node:** none. Milestone 4's PR B (`b1-shell-half`) does not edit `residency/` beyond the first look's argument.

**A2.** The sweep (A:59): says `"baseline"` is "the default, and the ONLY value the full vitest/E2E regression suites ever observe", and that the harness does not drive the switch.
- **What decides it:**
  - `src/e2e-test-surface.ts:305-306`, `:308-309` and `:312-313` still say so.
  - The default is the candidate arm (`residencyArm.ts:50`, `:58`).
  - The harness drives the switch. `e2e/residency-harness.mjs:401`: `if (argv[i] === "--arm" && argv[i + 1]) {`, and `:2696` calls `setResidencyArm`.
- **Verdict:** CONFIRMED.
- **Kind:** a comment that misleads (the driver-facing contract).
- **Open node:** none. PR B lists `e2e-test-surface.ts` as not edited.

**A3.** The sweep (A:63): "an absent key is a deserialize failure, not a tolerated omission. `columns` is required for the same reason."
- **What decides it:**
  - The claim now sits at `src/skp/client.ts:103-105`.
  - Both fields are plain options: `protocol/skp/src/v0/commands.rs:441` `pub filter: Option<Filter>,` and `:448` `pub columns: Option<Vec<String>>,`.
  - The crate's own test documents the tolerance. `protocol/skp/tests/fixtures.rs:91` reads "an omitted Option<T> key deserializes as None, not a failure". `key_present` (`commands.rs:542`) exists for exactly this reason.
  - `protocol/skp/SKP-V0.md:408-409` says the same.
- **Verdict:** CONFIRMED. This rests on serde's documented handling of an `Option` field and on the crate's test, which covers `OpenDatasetRequest`. No test covers `ViewportQueryRequest`.
- **Outside read, kin on the kernel side:** `commands.rs:438` still says "deny_unknown_fields plus this struct's own derive requires the key". That is the same false claim, in protocol/.
- **Kind:** a comment that misleads about what the kernel refuses.
- **Open node:** none for client.ts. `skp-v0-live-sections-current-area-c` is done.

**A4.** The sweep (A:67): `getResidentCounts()` is "Reached only from the DEV-only `residencyEndStep` E2E hook … never from product code."
- **What decides it:**
  - The claim stands at `src/canvas/WorkingCanvas.tsx:175-176` and `App.tsx:1261`.
  - Product callers on the default arm: `candidateArmSession.ts:715` `const { totalResidentFeatures } = canvas.getResidentCounts();`, plus `:867` and `:915`.
  - `App.tsx:1281` also calls it, for the `residentCounts` hook.
- **Verdict:** CONFIRMED.
- **Kind:** a comment that misleads. It labels a product accessor as an instrument.
- **Open nodes on the file:** `WorkingCanvas.tsx` is in `b1-shell-half` PR B's list, and in `stale-lines-outside-the-four-files` (proposed; WorkingCanvas.tsx:593).

**A5.** The sweep (A:71): "**Its only caller is the E2E driver `frontends/shell/e2e/source-changed.mjs`**".
- **What decides it:** `e2e/source-watch-idle.mjs:214` and `e2e/export-view.mjs:67` also call `residentCounts()`. Under `src`, the only call besides the instrument accessor is its registration at `App.tsx:1281`.
- **Verdict:** CONFIRMED, but the list of callers is the only stale part. The exemption still holds in substance: every caller is a test driver.
- **Kind:** a stale reference. The doc is the round 5, item 4 accessor declaration, so the named-caller list matters.
- **Open node:** none.

**A6.** The sweep (A:75): `onChange` is "`App.tsx`'s own `setStyle`, a plain `useState` setter"; the state is "Held in React state by `App.tsx`".
- **What decides it:**
  - `src/style/StylePanel.tsx:24-25` still names `setStyle`. App has no such setter. `App.tsx:1976-1980` (`handleStyleChange`) dispatches `view.transition` into the reducer.
  - `document.ts:53-54` holds in substance, because the workspace is App's `useReducer` (`App.tsx:837`).
  - Kin in the same file: `document.ts:35`, "`StyleState` is plain in-memory React state, exactly like the camera". The KL triage already flagged `:36`.
- **Verdict:** PARTLY. CONFIRMED for StylePanel.tsx. NOT CONFIRMED in substance for document.ts:53-54.
- **Kind:** a comment that misleads (a setter that does not exist).
- **Open node:** both files are in `b1-shell-half` PR B's product list (form §2.6, PR B).

**A7.** The sweep (A:79): "No consumer of a per-dataset column list exists elsewhere in this tree".
- **What decides it:** the sentence stands at `src/filter/FilterPanel.tsx:41-42`. `src/command/CommandBar.tsx:95` lists schema fields through `fieldOptions` (`command/fieldCompletion.ts:46-49`).
- **Verdict:** CONFIRMED.
- **Kind:** a comment that misleads (minor).
- **Open node:** none. PR B lists FilterPanel as not edited.

**A8.** The sweep (A:83): three comments still describe the old frame.
- **What decides it:**
  - `App.tsx:237-238` reads "the canvas status stack's `.scan-incomplete`". That element now sits in the status-bar slot (`App.tsx:2370`, `"status.scanIncomplete"`).
  - `App.tsx:684` reads "in the canvas status stack". The session-ended status is the attention-strip slot (`App.tsx:2289`).
  - `src/admission/DescribeSummary.tsx:80-81` reads "Neither is added to `.canvas-status-stack` … both render only within this existing component". Both facts also render in the status bar: `App.tsx:2379` `<WatcherStatusItem …`, and `layout/statusItems.ts:31-34`.
  - `styles.css:22` names `.canvas-status-stack` as history.
- **Verdict:** CONFIRMED. The FilterPanel half of `:237` holds.
- **Kind:** a comment that misleads. The DescribeSummary sentence is a stated guarantee that is untrue.
- **Open node:** `App.tsx` is in PR B. `DescribeSummary.tsx` is in none.

**A9.** The sweep (A:87): "every call site … is what is DEV-gated"; "App.tsx's own dev-gated read".
- **What decides it:**
  - The claims stand at `residency/residencyTileSizeLevel.ts:15-18`, `candidateArmSession.ts:146` and `App.tsx:1618`.
  - `App.tsx:1624`, `tileGridLevel: getResidencyTileSizeLevel(),`, is not gated.
- **Verdict:** CONFIRMED. The effect is low: the getter returns null (unset), which resolves to the default level.
- **Kind:** a comment that misleads (minor).
- **Open node:** `App.tsx` is in PR B. The others are in none.

**A10.** The sweep (A:91).
- **What decides it:**
  - `src/console/recorder.ts:7-8` reads "the only site permitted to import this module outside this directory and its own tests". Eleven non-console modules import `recordNamed` (grep).
  - The doc at `:353-354` omits two modules that `console/soleCaptureSite.test.ts:59-60` allows (`notices/NoticesPanel.tsx`, `layout/StudioLayout.tsx`).
- **Verdict:** CONFIRMED.
- **Kind:** a comment that misleads (minor).
- **Open node:** none.

**A11.** The sweep (A:95): unpinned line cites that now land on unrelated code.
- **What decides it, for the three the sweep named:**
  - `canvas/pick.ts:55` cites `WorkingCanvas.tsx:1968-1972`. Those lines hold `clearStandingLabelledState();` and `const onPointerRelease = () => {`.
  - `e2e-test-surface.ts:198` cites `:160`. The method is at `:177`.
  - `App.tsx:1502` cites `candidateArmSession.ts:282-284`. Those lines are `relinquishFill`'s doc.
- **My spot-checks of the rest:**
  - `streaming/liveTicketSet.ts:71`, citing `client.ts:58-65`, is still on target.
  - `:77`, citing `tileViewportStreamManager.ts:316`/`:324`, is off: `isRetryableRefusal` is at `:329`.
- **Verdict:** PARTLY. The three named cites are CONFIRMED. The rest are not all off-target.
- **Kind:** stale cites only.
- **Open node:** `skp-line-cites-outside-close-races` (blocked, docs lane) holds App.tsx and the shell streaming files.

## Area B (the walkthrough and ER)

**B1.** The sweep (B:31): B3 and the `B2'/B3'` coverage row still expect the "cut-2 remediation note".
- **What decides it:**
  - WT:177 reads "a note reads that remediation (asserting a CRS) is cut-2 work". WT:92 reads "the cut-2 remediation note".
  - `src/admission/RefusalBlock.tsx:20` says that note "is gone".
  - `e2e/regression.mjs:2711` asserts `".crs-assertion-form"`.
- **Verdict:** CONFIRMED.
- **Kind:** a walkthrough row that would make the operator record a wrong result (Part B).
- **Open node:** none.

**B2.** The sweep (B:33): J3 expects a class-C "no API equivalent" entry; F2 and H5 say "nothing round-trips through the kernel".
- **What decides it:**
  - WT:660 still says so. `src/console/surfaceRegistry.ts:174-175` reads "Style edits left this table in B2 piece 1b: each committed edit is the class-A `record_step` row".
  - The commit path: `App.tsx:1994` `for (const transition of transitions) stepQueue.enqueue(dataset, transition);` and `:857` `send: (dataset, intent) => recordStep(dataset, intent),`.
  - The coverage row CLASSC' (WT:684) agrees with the code. F2 (WT:269) and H5 (WT:452) are false in their "nothing round-trips" clause; "no query" still holds.
- **Verdict:** CONFIRMED.
- **Kind:** a walkthrough row that would make the operator record a wrong result (Parts J, F, H).
- **Open node:** Part F rows are in PR B's records list, but only "where a location word changes" (form §2.6). F2's correction would be a class 9 addition there. J and H are in no node.

**B3.** The sweep (B:35): J2's key set omits `columns`.
- **What decides it:** WT:659 reads "exactly the keys `{skp, dataset, bbox, bbox_crs, filter, limit}`". `client.ts:124` always sends `columns,`. HEXLIM' (WT:683) expects seven keys.
- **Verdict:** CONFIRMED.
- **Kind:** a walkthrough row that would make the operator record a wrong result (Part J).
- **Open node:** none.

**B4.** The sweep (B:37): H1 and H2 expect the baseline ceiling banner.
- **What decides it:**
  - WT:448 reads "Expect the Part D/OVERCEIL' ceiling shape — a red-bordered banner". WT:449 reads "expect the ceiling banner/status to reappear".
  - `residencyArm.ts:50` sets the candidate default. `WorkingCanvas.tsx:1742` reads "the candidate arm never refuses a batch".
  - WT:458's dated pointer covers H6 phase (1) only.
- **Verdict:** PARTLY.
  - CONFIRMED for H1 and H2.
  - NOT CONFIRMED for the sweep's consequence that Part R and M10 "send the operator to H1 as written". R1 (WT:1550) cites "Part H's H1" for the open only, and M10 (WT:884) names "Part H's fixture". Neither expects H1's banner.
  - H1 to H5 are also a run record of 2026-08-20, before the arm flip (WT:1110 and WT:1114).
- **Kind:** a walkthrough row that would make the operator record a wrong result on a rerun (Part H).
- **Open node:** `sitting-part-r-row-r1` (proposed) holds Part R only.

**B5.** The sweep (B:39): the coverage tables do not match the step lists.
- **What decides it:**
  - `regression.mjs` runs `K6`, `K7`, `CURSOR'`, `FIND'`, `MP'`, `PT'` and `LN'` (`:2681` to `:2709`), and none of them is in the table at WT:83-97.
  - `OVERCEIL'`, `REOPEN'` and `SLOW'/CANCEL'` run in `e2e/refusal-contract-baseline.mjs:627-629`, not in the scripts the tables name. `filter-panel.mjs:484-488` runs `OPEN`, `PANEL'`, `PANELREFUSE'`, `CLEAR'` and `FIND'`.
- **Verdict:** CONFIRMED.
- **Kind:** a doc that misleads (what is automated). It is not a sitting row.
- **Open node:** `mp-prime-e2e-covered-fixture` (proposed) changes the `MP'` step. The table is in no node.

**B6.** The sweep (B:41), ER's "Security posture" paragraph, clause by clause:
- "**never** a shipped or checked-in default": PARTLY.
  - The shipped build holds: `tauri.conf.json:9` `"beforeBuildCommand": "npm run build",` and no default feature (`src-tauri/Cargo.toml:52`, `measure-build = []`).
  - A checked-in default does exist for the measure build: `src-tauri/src/lib.rs:518` `std::env::var("SPATIAL_E2E_CDP_PORT").unwrap_or_else(|_| "9223".to_string());`.
- The overlay at `e2e/out/tauri.e2e.conf.json` with `additionalBrowserArgs`: CONFIRMED true (`e2e/lib.mjs:105`, `:110`).
- "the only place the flag touches disk": UNTRUE. `lib.rs:521` has `--remote-debugging-port={cdp_port}` in source, behind `#[cfg(feature = "measure-build")]` (`:511`).
- The `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS` clauses: cannot be decided by reading. They state a live verification against wry.
- "Nothing in `tauri.conf.json`, Vite config, or Rust ever references the port": UNTRUE for Rust (`lib.rs:517-527`).
- "a packaged `tauri build` never sees the overlay": true of that file. But `package.json:48` (`build:measure`) is a `tauri build … --features measure-build` that opens the port through its own overlay.
- "registered in `AdmissionPanel.tsx`/`WorkingCanvas.tsx`": incomplete. `registerE2eHook(` is also called from `App.tsx` (37 times) and `publish/PublishPanel.tsx` (6 times).
- "gated on `import.meta.env.DEV` and compiled out of production": PARTLY.
  - The gate is `isInstrumentedBuild.ts:32`, `return import.meta.env.DEV || import.meta.env.VITE_MEASURE_BUILD === "1";`, through `e2e-test-surface.ts:347`.
  - So the hooks stay in the release-optimized measure build. They are out of the plain `npm run build`.
- "`npm run build` succeeding proves that": UNTRUE as stated.
  - `package.json:14` (build) runs no dist check. The check is `check:dist-clean`, run after the build in CI.
  - That check says its own miss is "ONE-DIRECTIONAL, never a proof the underlying CODE PATH is absent" (`e2e/checkDistClean.mjs:25`).
- **Verdict:** CONFIRMED. The paragraph understates where the port and the hooks exist: a measure build exposes the CDP port and the hooks together. The shipped installer's property holds.
- **Kind:** a security-posture statement that is untrue. This is red-line text, so the human's words.
- **Open node:** none.

**B7.** The sweep (B:43), the reload note, clause by clause:
- "the arm silently resets to `"baseline"` on every reload": UNTRUE. A reload re-initialises to `currentArm = DEFAULT_RESIDENCY_ARM` (`residencyArm.ts:58`), which is `"candidate"` (`:50`). I infer this from the page reload re-running module initialisation; nothing was executed.
- "baseline on this fixture shows Part D's ceiling refusal … where the candidate shows a declared partial view": holds as a conditional (`WorkingCanvas.tsx:1742`). I did not check the quoted strings byte for byte.
- "require it to print `"candidate"`" and the arm-unverified rule: still harmless to obey. They are now over-cautious.
- **The sweep's "describe a hazard that no longer exists" is NOT CONFIRMED.**
  - A reload does reset the tile-size level: `residencyTileSizeLevel.ts:37` `let currentLevel: TileGridLevel | null = null;`, so a fresh session runs at `"medium"` (`canvas/tileGridConstants.ts:35`).
  - Part L runs at `fine`. K2's re-arm (WT:740) sets the level, but the mandated check reads only the arm.
  - So L2, L4 and L5's "re-arm per K2" is still needed, and the verification checks the wrong property.
- **Verdict:** PARTLY.
- **Kind:** a walkthrough row that would make the operator record a wrong result. A verdict at `medium` could be recorded as verified.
- **Open node:** Part L's L5 re-check (entry 48) is on `operator-sitting-queue` (blocked, sitting), so this lands before the next sitting.

**B8.** The sweep (B:45): J1, "exactly **two** new class-A entries … never more than two" (WT:658).
- **What decides it:**
  - The open issues an untiled first look through the client: `candidateArmSession.ts:1279` `const { stream } = await viewportQuery(dataset, bbox, null, …`.
  - Every client call is recorded at `client.ts:55`.
  - The run record WT:1181-1183 saw `open_dataset` + `describe` + a `viewport_query`.
- **Verdict:** CONFIRMED by reading; not re-run.
- **Kind:** a walkthrough row that would make the operator record a wrong result (Part J).
- **Open node:** none.

**B9.** The sweep (B:47).
- **What decides it:** WT:954 reads "confirm none of the five limitations below appear among them yet" and expects "None do". `KNOWN-LIMITATIONS.md:232`, `:248`, `:259`, `:269` and `:280` are items 19 to 23.
- **Verdict:** CONFIRMED.
- **Kind:** a walkthrough row that would make the operator record a wrong result on a rerun. Part N is discharged (`briefa-p6-part-n-acceptances`, done).
- **Open node:** none.

**B10.** The sweep (B:49).
- **What decides it:** WT:158's list (reused by WT:878, M4) omits rows the panel now shows, and its "**Geometry**" label is now different:
  - `DescribeSummary.tsx:36`: `<dt>[P6 placeholder] Geometry (encoding chosen by the engine)</dt>`
  - `:41`: `<dt>[P6 placeholder] Geometry types declared by the file</dt>`
  - `:62`: `<dt>CRS provenance</dt>`
- **Verdict:** CONFIRMED. A3 does not say "exactly", so this is minor.
- **Kind:** a walkthrough row, a minor gap (Parts A and M).
- **Open node:** none.

**B11.** The sweep (B:51).
- **What decides it:** ER:747 lists no `E-FLOOR`. `e2e/layout.mjs:552` runs `await runStep("E-FLOOR", …`.
- **Verdict:** CONFIRMED.
- **Kind:** a doc that misleads (minor).
- **Open node:** none.

**B12.** The sweep (B:53).
- **What decides it:** ER:561 cites `lib.rs:96-98`, and ER:602-603 cite `:100` and `:148-172`. Those lines are now the startup dialog and an origin-check doc comment. `app_log_dir()` and `SessionLog::open` are at `lib.rs:326` and `:328`.
- **Verdict:** CONFIRMED.
- **Kind:** stale cites only.
- **Open node:** none.

## Proposal (the grading is the custodian's)

**Shell comments, by module:**
- **(1) Residency arm and instrument comments:** A1, A2, A4, A5, A9.
  - Paths: `src/residency/candidateArmSession.ts`, `residencyTileSizeLevel.ts`, `src/e2e-test-surface.ts`, `src/canvas/WorkingCanvas.tsx`, `src/App.tsx`.
  - Overlaps: `App.tsx` and `WorkingCanvas.tsx` are in `b1-shell-half` PR B (in progress). `App.tsx` is also in `session-end-lines-name-coverage-lost-as-source-change` (blocked, carried by PR B). `WorkingCanvas.tsx` is also in `stale-lines-outside-the-four-files` (proposed).
- **(2) Old-frame and panel comments:** A7 and A8.
  - Paths: `src/filter/FilterPanel.tsx`, `src/admission/DescribeSummary.tsx`, `src/App.tsx`.
  - Overlap: `App.tsx`, as above.
- **(3) Style comments, A6:** under the same-file rule, `b1-shell-half` PR B, by a class 9 addition to its list before its code, because PR B edits both files.
- **(4) SKP client and console fence comments:** A3 and A10.
  - Paths: `src/skp/client.ts`, `src/console/recorder.ts`.
  - Overlaps: none. A3's kin, `commands.rs:438`, is in protocol/ and goes to the custodian's choice of node.
- **(5) Stale cites, A11:** into `skp-line-cites-outside-close-races` for App.tsx and the streaming files. `canvas/pick.ts`, `canvas/tileGrid.ts`, `e2e-test-surface.ts:198` and `diagnostics/renderTrace.ts` need a home; that node is blocked behind `adr-035-close-races-note`.

**Stale test names and comments:** none of areas A or B's findings is a test name or a test comment. Area A did not reach test files (A:103).

**Walkthrough rows, by Part (`MANUAL-WALKTHROUGH.md`, one path):**
- Part B and the B2'/B3' coverage row: B1.
- Part J: B2's J3, B3, B8.
- Parts F and H: B2's F2 and H5 clauses, and B4. F2 overlaps PR B's Part F records.
- Part L's preamble: B7. It is the most urgent, because L5 is on `operator-sitting-queue`.
- Part N: B9.
- Parts A and M: B10.
- The regression and filter-panel coverage tables: B5. This is a doc, not a sitting row; `mp-prime-e2e-covered-fixture` touches `MP'`.

**`e2e/README.md`:** B6 (security posture, the human's words), B11 and B12. Under the 2026-10-18 directive cited in the milestone 4 form (§2.7), separate entries count as separate paths. PR B adds its own new entry, and none of these.

**Misstates or hides what a user or operator can do, or a security property** (as 2026-10-10's finding 8 did):
- B6: the CDP port and the e2e hooks exist in the measure build. The paragraph says the reverse.
- B7: the mandated check verifies the arm, while the tile-size level is what a reload resets.
- B1, B2, B3, B4, B8, B9: each would make the operator record a wrong result at a sitting or on a rerun.
- A1: the default production data path is described as dev-only, dead code.
- A3: the kernel accepts what the comment says it refuses.

**Minor gaps:** A2, A4, A5, A6, A7, A8, A9, A10, A11, B5, B10, B11, B12.

**Not decidable by reading:**
- Whether B1-type rows (Parts B, J, H, N) will be run again before their words change. That depends on the sitting plan.
- ER's live-verification clauses about wry and the WebView2 environment variable.
- B7's reset behaviour was not executed; it is inferred from module initialisation on a page reload.

## Files read

- The brief: brief-tri-ab.md in the session scratchpad
- C:/dev/spatial-ide/state/consults/2026-11-03-platform-drift-sweep-area-a.md
- C:/dev/spatial-ide/state/consults/2026-11-03-platform-drift-sweep-area-b.md
- C:/dev/spatial-ide/state/consults/2026-11-05-area-e-kl-triage-numbered-items-architect.md
- C:/dev/spatial-ide/governance/PLAN.yaml (1050-1065, 2370-2386, 3177-3192, 4015-4030, 4403-4419, 4845-4861, 5656-5672, 5793-5809, 5878-5893, 5929-5945, 6048-6064; greps)
- C:/dev/spatial-ide/governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md (375-414; grep)
- C:/dev/spatial-ide/frontends/shell/MANUAL-WALKTHROUGH.md (50-184, 240-273, 400-467, 640-689, 736-741, 795-835, 866-885, 954, 1176-1185, 1530-1554; greps)
- C:/dev/spatial-ide/frontends/shell/e2e/README.md (1-95, 738-752; grep)
- C:/dev/spatial-ide/frontends/shell/src/residency/candidateArmSession.ts (1-160, 278-287, 700-719; greps)
- C:/dev/spatial-ide/frontends/shell/src/residency/residencyArm.ts
- C:/dev/spatial-ide/frontends/shell/src/residency/residencyTileSizeLevel.ts (1-63)
- C:/dev/spatial-ide/frontends/shell/src/App.tsx (230-243, 676-689, 1240-1284, 1580-1629, 1970-2001; greps)
- C:/dev/spatial-ide/frontends/shell/src/e2e-test-surface.ts (185-354)
- C:/dev/spatial-ide/frontends/shell/src/isInstrumentedBuild.ts
- C:/dev/spatial-ide/frontends/shell/src/skp/client.ts (48-144)
- C:/dev/spatial-ide/frontends/shell/src/canvas/WorkingCanvas.tsx (165-179, 1964-1975; greps)
- C:/dev/spatial-ide/frontends/shell/src/style/StylePanel.tsx (1-70)
- C:/dev/spatial-ide/frontends/shell/src/style/document.ts (1-70)
- C:/dev/spatial-ide/frontends/shell/src/filter/FilterPanel.tsx (1-60)
- C:/dev/spatial-ide/frontends/shell/src/command/fieldCompletion.ts
- C:/dev/spatial-ide/frontends/shell/src/admission/DescribeSummary.tsx
- C:/dev/spatial-ide/frontends/shell/src/admission/RefusalBlock.tsx
- C:/dev/spatial-ide/frontends/shell/src/admission/formatRefusal.ts (grep)
- C:/dev/spatial-ide/frontends/shell/src/layout/statusItems.ts
- C:/dev/spatial-ide/frontends/shell/src/styles.css (1-30)
- C:/dev/spatial-ide/frontends/shell/src/console/recorder.ts (1-20, 335-359)
- C:/dev/spatial-ide/frontends/shell/src/console/soleCaptureSite.test.ts (35-69)
- C:/dev/spatial-ide/frontends/shell/src/console/surfaceRegistry.ts (70-194)
- C:/dev/spatial-ide/frontends/shell/src/canvas/pick.ts, tileGrid.ts, streaming/liveTicketSet.ts, streaming/tileViewportStreamManager.ts, command/CommandBar.tsx, canvas/tileGridConstants.ts (greps)
- C:/dev/spatial-ide/frontends/shell/e2e/checkDistClean.mjs (1-40; grep)
- C:/dev/spatial-ide/frontends/shell/e2e/residency-harness.mjs, regression.mjs, filter-panel.mjs, refusal-contract-baseline.mjs, layout.mjs, lib.mjs, source-watch-idle.mjs, export-view.mjs, source-changed.mjs (greps)
- C:/dev/spatial-ide/frontends/shell/src-tauri/src/lib.rs (94-101, 146-173, 490-534; greps)
- C:/dev/spatial-ide/frontends/shell/src-tauri/Cargo.toml (20-54)
- C:/dev/spatial-ide/frontends/shell/src-tauri/tauri.conf.json (grep)
- C:/dev/spatial-ide/frontends/shell/package.json (grep)
- C:/dev/spatial-ide/protocol/skp/src/v0/commands.rs (420-554)
- C:/dev/spatial-ide/protocol/skp/tests/fixtures.rs (60-104)
- C:/dev/spatial-ide/protocol/skp/SKP-V0.md (grep)
- C:/dev/spatial-ide/KNOWN-LIMITATIONS.md (grep)
- C:/dev/spatial-ide/.github/workflows (grep)
