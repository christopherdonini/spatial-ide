*Custodian's filing note (2026-11-05): a Claude Platform session's report, filed as a consult under the human's direction of 2026-11-05 (`state/directives/2026-11-05-platform-runs-filed-c1-governance-next-fixtures-kernel-node-8b-route-a-f-b-after-8c.md`, line 8, item 1); a reading and not Authority. Provenance: the human's advisory folder for this project, `PLATFORM-RUNS-2026-11-03/DRIFT-SWEEP-AREA-A-2026-11-03.md` (12282 bytes, sha256 8788dc8ddf8fa238fb4e7c4c177fe53d393a16379370bf0ddde43c10d6ead6bc), named in that folder's INDEX.md (sha256 ff6aa985a37ded9869e1dbc62580ee527d6e9a5d6a4b87ba0073c3073f944c73): session sesn_01ST7yTzN5x22D6fKwfMn9aJ, agent spatial-ide-drift-sweeper (claude-fable-5-1, effort high), US$ 14.61, about 918 s active. The file's own provenance paragraph, the advisor's, comes first under its title; below the rule the file is unchanged, byte for byte. It worked at main 652752afa9bedb0172948869c9ab7f0b8ee08dd3; from it to main at ae55d424, 7 product, docs or KNOWN-LIMITATIONS files changed (docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md, kernel/README.md, kernel/src/bundle/redaction.rs, kernel/src/permission/audit/normalize.rs, kernel/src/publish/viewer_assets.rs, kernel/tests/posix_backslash_in_shared_path_logic.rs, kernel/tests/redaction_hostname_off_windows.rs), so its readings of those files are read again before any node rests on them. No cloud filing answers this area's question (the shell's source comments and doc blocks). By the ruling (item 2), it is triaged as on 2026-10-10: its findings are re-derived by script before any node rests on them.*

---

# Drift sweep area A, 2026-11-03 (advisory chat)

Provenance. An independent agent on the Claude Platform (claude-fable-5-1, effort high; agent `spatial-ide-drift-sweeper`, the agent's own system prompt) cloned the public repository in a fresh sandbox and worked at the commit its first lines name (652752afa9bedb0172948869c9ab7f0b8ee08dd3). It changed nothing outside its sandbox, pushed nothing, opened nothing. The advisor started the run through the platform API at the human's request (session sesn_01ST7yTzN5x22D6fKwfMn9aJ) and fetched the agent's messages verbatim, in order, separated by rules; run figures from the session record: about 918 s active, US$ 14.61. Nothing below this line is edited.

---

I'll start by cloning the repository and checking the commit.

-----

The head matches 652752af. Now let me survey the shell source.

-----

Large surface (~59k lines). Drift usually accumulates where code changed recently, so let me look at the git history of the shell source first.

-----

Let me look at how PLAN.yaml tracks things, especially any shell-comment drift nodes, so I know what's already tracked.

-----

Several nodes already track shell comment drift. Let me read them so I can exclude what's covered.

-----

Let me check the sitting script's N1–N7 and the stale-lines form's list so I know which strings are already found.

-----

Now let me sweep. First, line cites in src comments that aren't pinned with a commit (those are checkable against the current file).

-----

These line-cite comments are a known class with existing nodes; I'll verify a few later but focus first on behavioural claims. Let me read App.tsx's header and major doc blocks.

-----

Confirmed. Now let me check the other "only"-class claims in a batch.

-----

Let me try a mechanical check: backticked identifiers in comments that no longer exist anywhere in the shell source.

-----

**Repository:** https://github.com/christopherdonini/spatial-ide — **Area A** (shell source comments and doc blocks, `frontends/shell/src`, `styles.css` included) — **commit swept: 652752afa9bedb0172948869c9ab7f0b8ee08dd3** (head of main at clone time, equal to the origin/main you named).

## Findings, most consequential first

**1. `frontends/shell/src/residency/candidateArmSession.ts:42-46`** — claims the whole module "is dead code once `import.meta.env.DEV` is `false`" and that `check:dist-clean`'s identifier list "covers this module's own entry point, `startCandidateArmSession`".
Code: `residency/residencyArm.ts:52` sets `DEFAULT_RESIDENCY_ARM = "candidate"`; `App.tsx:1580-1590` constructs the candidate session ungated in every build and says so; `e2e/checkDistClean.mjs:90-100` records `startCandidateArmSession` *removed* from the forbidden list because a plain production build calls it by default (flip of 2026-09-07).
Why it matters: a reader of the module header believes the default production data path is dev-only tree-shaken code, and that the dist scan would catch its leak — the exact opposite of what ships. **Confirmed.**

**2. `frontends/shell/src/e2e-test-surface.ts:305-313`** — the `setResidencyArm` hook doc says `"baseline"` is "the default, and the ONLY value the full vitest/E2E regression suites ever observe", that "the harness itself does not yet drive this (`--arm=candidate` is a LATER piece's own addition)", and `getResidencyArm` returns "`"baseline"` unless a prior `setResidencyArm("candidate")` call … succeeded".
Code: `residencyArm.ts:9-14, 52, 65-70` (default `"candidate"`, corrected there as MUST-FIX 3/4 on 2026-09-07); `e2e/residency-harness.mjs:45-50, 401` parses `--arm` and calls `setResidencyArm`.
Why it matters: this is the typed surface a driver author reads first; it states the arm default backwards. **Confirmed.**

**3. `frontends/shell/src/skp/client.ts:102-104`** — "`ViewportQueryRequest.filter` is `Option<Filter>` with no `#[serde(default)]` on the Rust side, so an absent key is a deserialize failure, not a tolerated omission. `columns` is required for the same reason."
Code: `protocol/skp/src/v0/commands.rs:429-446` declares both as plain `Option<T>`; the crate's own test `protocol/skp/tests/fixtures.rs:68-95` (`omitting_…_is_currently_tolerated_not_refused`) documents that a plain `Option<T>` missing key deserializes to `None`; `commands.rs:541-548` adds `deserialize_with = "key_present"` to `FilterApplyParams` precisely because a bare `Option` does not refuse absence; `protocol/skp/SKP-V0.md:40-44` says the same.
Why it matters: a shell reader trusts the kernel to refuse a request that drops the key, when it silently reads it as no filter / no columns. **Confirmed** by the crate's own test and workaround (nothing run).

**4. `frontends/shell/src/canvas/WorkingCanvas.tsx:173-176`** and **`App.tsx:1259-1261`** — `getResidentCounts()` is "Reached only from the DEV-only `residencyEndStep` E2E hook (`App.tsx`), never from product code."
Code: `residency/candidateArmSession.ts:715` (`emitResidencyStatus`), `:867` (`emitResidencyRelinquished`), `:915` (`hasHeadroom`) call `canvas.getResidentCounts()` on the default arm's product path (since 2026-08-31, b322a132).
Why it matters: the "Showing N / partial" status and the headroom refetch decision depend on this accessor; a reader told it is instrument-only would not treat a change to it as a product change. **Confirmed.**

**5. `frontends/shell/src/e2e-test-surface.ts:201-203`** — `residentCounts` hook: "**Its only caller is the E2E driver `frontends/shell/e2e/source-changed.mjs`**, named here so the caller-grep can verify this exemption instead of trusting the words 'test-only'."
Code: `e2e/source-watch-idle.mjs:213-214` (added 2026-09-26) and `e2e/export-view.mjs:67` (added 2026-10-14) also call `window.__SPATIAL_E2E__.residentCounts()`.
Why it matters: the comment exists to make a grep-verifiable exemption claim, and the grep now contradicts it. **Confirmed.**

**6. `frontends/shell/src/style/StylePanel.tsx:24-26`** (and `style/document.ts:53-54`) — `onChange` is "`App.tsx`'s own `setStyle`, a plain `useState` setter"; the style state is "Held in React state by `App.tsx`".
Code: App has no `setStyle`; `App.tsx:1975-1981` `handleStyleChange` dispatches one `style.set` view transition per changed property into the workspace reducer; `App.tsx:848` reads `view.style` (milestone 2 phase A, deab7dc9, 2026-10-11 — after PR #203 rewrote this header on 2026-10-10).
Why it matters: someone adding a style property follows the comment to a setter that does not exist and misses the reducer, the transition list and the step-recorder hook. **Confirmed.**

**7. `frontends/shell/src/filter/FilterPanel.tsx:41-42`** — "No consumer of a per-dataset column list exists elsewhere in this tree; a future piece reintroducing it should budget its vertical footprint…".
Code: `command/fieldCompletion.ts:7-10, 48-51` lists `describe.schema` names for the command bar's `@` completion (`CommandBar.tsx:96`, milestone 3 PR B, 2026-10-20); `table/TableGrid.tsx` draws the projected columns.
Why it matters: the sentence is an invitation to re-add a column list as if none existed, with reasoning tied to a layout (`.canvas-container` floor) that milestone 1 retired. **Confirmed.**

**8. Old-frame comments PR #203 did not reach: `App.tsx:237-238`** ("rendered in both `FilterPanel` and the canvas status stack's `.scan-incomplete`"), **`App.tsx:684`** (`sessionEnded` "rendered through `RefusalBlock` in the canvas status stack"), **`admission/DescribeSummary.tsx:79-82`** ("Neither is added to `.canvas-status-stack` … both render only within this existing component").
Code: no `.canvas-status-stack` exists (`styles.css:21-23` names it history); scan-incomplete is the status-bar slot `status.scanIncomplete` (`App.tsx:2370-2374`), session-ended is the attention-strip slot `attention.sessionEnded` (`App.tsx:2289-2293`), and the watcher coverage/checks facts also render in the status bar via `WatcherStatusItem` (`App.tsx:2379`; `layout/statusItems.ts:27-35`).
Why it matters: the DescribeSummary sentence is a stated guarantee ("render only within this component") that is no longer true; the other two send a reader looking for a region that was removed. **Confirmed.**

**9. `frontends/shell/src/residency/residencyTileSizeLevel.ts:15-18`, `candidateArmSession.ts:146-148`, `App.tsx:1618`** — "every call site … is what is DEV-gated"; "App.tsx's own dev-gated read of … `getResidencyTileSizeLevel()`".
Code: `App.tsx:1624` reads `getResidencyTileSizeLevel()` at candidate-session construction with no `isInstrumentedBuild()` guard; only the hook registrations (`:1334-1335`) and the `notify…` bookkeeping (`:1555`, `:1713`) are gated.
Why it matters: low consequence today (unset → default level), but the comment claims a gating discipline the module does not have. **Confirmed.**

**10. `frontends/shell/src/console/recorder.ts:5-8` and `:346-348`** — the header says `skp/client.ts` is "the only site permitted to import this module outside this directory and its own tests"; the `recordNamed` doc lists the class-C handler modules as `App.tsx`, `StylePanel.tsx`, `ErrorBanner.tsx`, `PublishPanel.tsx`, `ConsolePanel.tsx`.
Code: eleven modules import `recordNamed` from this file; `console/soleCaptureSite.test.ts:50-60`'s allowlist also carries `notices/NoticesPanel.tsx` and `layout/StudioLayout.tsx`, which the doc omits.
Why it matters: a reader checking the import fence against the header would call `StudioLayout.tsx`'s import a violation. **Confirmed**; minor.

**11. Unpinned line cites that now point at unrelated code (a class, lowest value):** `canvas/pick.ts:55` (`WorkingCanvas.tsx:1968-1972` — now the pointer-release handler, not the null hover emission at `emitHoverReadout`, `:1037`); `e2e-test-surface.ts:198` (`WorkingCanvas.tsx:160` → `:177`); `App.tsx:1502` (`candidateArmSession.ts:282-284` → now `relinquishFill`'s doc, not `reissueUnrestricted`'s rejection); others in `canvas/tileGrid.ts:304,318,394`, `streaming/liveTicketSet.ts:71,77`, `streaming/tileViewportStreamManager.ts:269,479,759`, `streaming/viewportStreamManager.ts:316-317,337`, `diagnostics/renderTrace.ts:149`. **Confirmed** for the three named; the rest only checked to be off-target, not re-aimed.

## Already tracked (left out of the findings)

`shell-stale-frame-comments` (done, #203; its scope did not include the lines in finding 8), `shell-stale-layout-comments-and-s1-row` (done), `stale-lines-outside-the-four-files` (App.test.ts:1079, residencyStatus.ts:153, WorkingCanvas.tsx:593, WorkingCanvas.test.ts:59, residencyStatus.test.ts titles), `session-end-lines-name-coverage-lost-as-source-change` (App.tsx:671, :880-884 and HoverReadoutView's "source file changed" wording — its summary already notes "comments in files PR B does not touch still call every end a source change"), `skp-line-cites-outside-close-races` (App.tsx:679, :717 and streaming cites into `kernel/src/skp.rs`), `extent-degenerate-zoom-doc`, `sitting-wording-n1-to-n7` (ToolSwitch.tsx hints, COMMAND_UNKNOWN_NOTE, FeatureTab.tsx:73, stepRecorder.ts O3), `stale-assertion-messages-and-product-comments` (done), `stale-test-names-and-comments` (done), `skp-v0-live-sections-current-area-c` / `skp-closed-domain-response-strings` (the wire side of finding 3 is area C; the shell comment itself is not named there), `shell-pick-paths-disagree-at-1280x801`, `table-max-attribute-bytes-measurement`.

## Not got to

Test-file comments under `src/` (except where a product comment pointed at one); the bodies of `streaming/tileViewportStreamManager.ts`, `canvas/tileResidentSet.ts`, `tileIngest.ts`, `tileGrid.ts`, `pickResolution.ts`, `instrument/residencyInstrument.ts` and `residency/candidateArmSession.ts` past their headers and the lines cited above; `publish/PublishPanel.tsx` and `admission/AdmissionPanel.tsx` component bodies; `console/render.ts`, `consoleViewModel.ts`; `styles.css` beyond its header disclaimer and the `.scan-incomplete`/`.filter-*` blocks (its `:503` cite to ":274-291" is off-target but the header already marks measured-budget text as history). I did not build or run anything; finding 3 rests on the SKP crate's own test and `key_present` workaround rather than an execution.

-----

