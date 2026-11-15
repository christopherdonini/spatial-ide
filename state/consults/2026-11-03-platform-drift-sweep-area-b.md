*Custodian's filing note (2026-11-05): a Claude Platform session's report, filed as a consult under the human's direction of 2026-11-05 (`state/directives/2026-11-05-platform-runs-filed-c1-governance-next-fixtures-kernel-node-8b-route-a-f-b-after-8c.md`, line 8, item 1); a reading and not Authority. Provenance: the human's advisory folder for this project, `PLATFORM-RUNS-2026-11-03/DRIFT-SWEEP-AREA-B-2026-11-03.md` (10095 bytes, sha256 fb996206a3f60239b6472ce3224dd7af82597105cb69ae030a33b394e8634953), named in that folder's INDEX.md (sha256 ff6aa985a37ded9869e1dbc62580ee527d6e9a5d6a4b87ba0073c3073f944c73): session sesn_01AXDEix5Sn2uSUHfPuSUx5K, agent spatial-ide-drift-sweeper (claude-fable-5-1, effort high), US$ 12.66, about 785 s active. The file's own provenance paragraph, the advisor's, comes first under its title; below the rule the file is unchanged, byte for byte. It worked at main 652752afa9bedb0172948869c9ab7f0b8ee08dd3; from it to main at ae55d424, 7 product, docs or KNOWN-LIMITATIONS files changed (docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md, kernel/README.md, kernel/src/bundle/redaction.rs, kernel/src/permission/audit/normalize.rs, kernel/src/publish/viewer_assets.rs, kernel/tests/posix_backslash_in_shared_path_logic.rs, kernel/tests/redaction_hostname_off_windows.rs), so its readings of those files are read again before any node rests on them. No cloud filing answers this area's question (the walkthrough and the e2e README against the shell's controls, strings and suites). By the ruling (item 2), it is triaged as on 2026-10-10: its findings are re-derived by script before any node rests on them.*

---

# Drift sweep area B, 2026-11-03 (advisory chat)

Provenance. An independent agent on the Claude Platform (claude-fable-5-1, effort high; agent `spatial-ide-drift-sweeper`, the agent's own system prompt) cloned the public repository in a fresh sandbox and worked at the commit its first lines name (652752afa9bedb0172948869c9ab7f0b8ee08dd3). It changed nothing outside its sandbox, pushed nothing, opened nothing. The advisor started the run through the platform API at the human's request (session sesn_01AXDEix5Sn2uSUHfPuSUx5K) and fetched the agent's messages verbatim, in order, separated by rules; run figures from the session record: about 785 s active, US$ 12.66. Nothing below this line is edited.

---

I'll start by cloning the repository and checking out the head of main.

-----

The head of main matches the commit you expected (652752a). Let me look at the shell's layout and the two documents in scope.

-----

Now the e2e README.

-----

The two documents are long. Now let me survey the shell's source and e2e scripts they refer to.

-----

**Repository:** https://github.com/christopherdonini/spatial-ide — **Area B** (MANUAL-WALKTHROUGH.md and e2e/README.md vs. the shell's controls, strings and e2e suites) — **commit swept:** `652752afa9bedb0172948869c9ab7f0b8ee08dd3` (head of main at checkout, same as the one you named).

## Findings (most likely to make a reader act wrongly first)

**1. Part B row B3 and the `B2'/B3'` coverage row still expect the "cut-2 remediation note".** — `frontends/shell/MANUAL-WALKTHROUGH.md:177` ("Below the message, a note reads that remediation (asserting a CRS) is cut-2 work, not available in this build") and `:92` ("the panel shows … the cut-2 remediation note"). Code: `src/admission/RefusalBlock.tsx:20` says that note "is gone"; `e2e/regression.mjs:2338-2374` and `:2710-2712` now assert `.crs-assertion-form` under `engine.crs_undeclared` instead; `src/admission/noCut2Language.test.ts` forbids the wording in product copy. An operator running Part B would record a deviation on a panel that is behaving as designed (Part I's I1 describes the form correctly). **Confirmed.**

**2. Part J row J3 says a style edit yields a class-C "no API equivalent" console entry.** — `MANUAL-WALKTHROUGH.md:660` ("A new class-C entry appears … naming the specific control … never sent to the kernel. Its owner line names ADR-022"). Code: `src/console/surfaceRegistry.ts:78-86,175-177` (style edits left the class-C table; each committed edit is the class-A `record_step` row), `src/style/StylePanel.tsx:54-56`, `src/App.tsx:1983-1984`, `src/skp/client.ts:141-142`. The `CLASSC'` coverage row at `:684` already states the new behaviour, so the two halves of the same table contradict each other and J3's "if anything deviates" rule would stop the sitting. Same cause makes F2 (`:269`, "nothing round-trips through the kernel") and H5 (`:452`) literally false: a committed edit sends one `record_step` to the kernel (no re-query, which is the part that still holds). **Confirmed.**

**3. Part J row J2 names the `viewport_query` key set without `columns`.** — `MANUAL-WALKTHROUGH.md:659` ("valid JSON with exactly the keys `{skp, dataset, bbox, bbox_crs, filter, limit}`"). Code: `src/skp/types.ts:253-265` (`columns` always present since skp/0.6), `src/skp/client.ts:113-124`; `e2e/console.mjs:452-454` and the `HEXLIM'` row at `:683` already expect seven keys. An operator pasting the entry will see a seventh key the row calls out as "exactly" absent. **Confirmed.**

**4. Part H rows H1/H2 expect the baseline ceiling banner on an ordinary launch.** — `MANUAL-WALKTHROUGH.md:448-449` ("Expect the Part D/OVERCEIL' ceiling shape — a red-bordered banner plus … `<N> of 3300000 features rendered — declared ceiling reached`"). Code: `src/residency/residencyArm.ts:50` (`DEFAULT_RESIDENCY_ARM = "candidate"`), `src/canvas/WorkingCanvas.tsx:1742` ("the candidate arm never refuses a batch"), `src/residency/residencyStatus.ts:446-472` (the candidate strings). Parts D, E (E4.5) and K carry dated corrections; Part H's dated pointer at `:458-463` covers H6 phase (1) only, and the live, not-yet-run Part R (`:1550`, "Open parcels-5gb.parquet (Part H's H1)") and M10 send the operator to H1 as written. **Confirmed** (H1/H2 are partly a run record, but nothing in them says so the way `:458` does for H6).

**5. The `regression.mjs` and `filter-panel.mjs` coverage tables no longer match the scripts' step lists.** — `MANUAL-WALKTHROUGH.md:57-58` ("each automated step ID is the exact one `e2e/regression.mjs`'s own summary table prints") and the table at `:83-97`; `:103-126` for filter-panel. Code: `e2e/regression.mjs:2681-2709` runs `K6`, `K7`, `CURSOR'`, `FIND'`, `MP'`, `PT'`, `LN'`, none in the table; `OVERCEIL'`/`REOPEN'` (`:95-96`) and `SLOW'/CANCEL'` (`:125`) now live in `e2e/refusal-contract-baseline.mjs:627-629` (README `:68-89` says so; only the E5 row at `:245` mentions the move). A reader mapping "what is automated" from these tables gets both false negatives and false positives. **Confirmed.**

**6. e2e/README.md's binding "Security posture" paragraph says no Rust ever references the CDP port and hooks are `DEV`-only.** — `e2e/README.md:16-19` ("Nothing in `tauri.conf.json`, Vite config, or Rust ever references the port; a packaged `tauri build` never sees the overlay … gated on `import.meta.env.DEV` and compiled out of production"). Code: `src-tauri/src/lib.rs:511-527` opens `--remote-debugging-port` (default 9223, `SPATIAL_E2E_CDP_PORT`) under the `measure-build` cargo feature (`src-tauri/Cargo.toml:52`), built by `npm run build:measure` = `npx tauri build … --features measure-build` (`package.json:52`); `src/isInstrumentedBuild.ts:32` keeps the hooks in that build too (`src/e2e-test-surface.ts:343-349`). The README's own residency section describes the measure build, so the posture paragraph understates the attack surface it claims to bound. **Confirmed.**

**7. Part L's "MANDATORY after EVERY Ctrl+R" note says the arm resets to `"baseline"` on reload.** — `MANUAL-WALKTHROUGH.md:801-807` ("the arm silently resets to `"baseline"` on every reload, and baseline on this fixture shows Part D's ceiling refusal … require it to print `"candidate"`"). Code: `src/residency/residencyArm.ts:50,58` — a reload re-initialises to `"candidate"`. Parts D and K carry 2026-09-07 corrections for the flip; Part L does not, so its L2/L4/L5 "re-arm per K2" steps describe a hazard that no longer exists. Harmless to obey, but false. **Confirmed.**

**8. Part J row J1: "exactly two new class-A entries … never more than two".** — `MANUAL-WALKTHROUGH.md:658`. An open issues the unrestricted first-look `viewport_query` (class A; E5's own "Apply behaves like opening a dataset", `:245`), and the Part J run record at `:1181-1184` already observed `open_dataset` + `describe` + `viewport_query` + a class-B row. The row text was never corrected, so a rerun reports a "deviation" the record already explains. **Confirmed by the record and by the first-look design; not re-run.**

**9. Part N row N9 asks the operator to confirm the five limitations are *not yet* in KNOWN-LIMITATIONS.** — `MANUAL-WALKTHROUGH.md:954` ("16 numbered items … confirm none of the five limitations below appear among them yet"; expected "None do"). Code/text: `KNOWN-LIMITATIONS.md:232-296` now carries them as items 19–23 (PR #109). Part N is discharged, so impact is low, but a rerun would fail the row's expected outcome. **Confirmed.** (Node `known-limitations-owed-rows` tracks the rows' landing, not this row's text.)

**10. Part A row A3's summary list (reused by M4 "exactly as Part A's A3 describes") omits rows the panel now shows.** — `MANUAL-WALKTHROUGH.md:158`, `:878`. Code: `src/admission/DescribeSummary.tsx:35-41` renders "[P6 placeholder] Geometry (encoding chosen by the engine)" plus a separate "Geometry types declared by the file" row, and `:58-59` a "CRS provenance" row; Parts N/S/T describe these. Low: A3' asserts substrings only. **Confirmed.**

**11. e2e/README.md Layout spec omits the asserted `E-FLOOR` step.** — `e2e/README.md:747` lists E-KEYS…E-REOPEN, RESIZEQ, FILL, BURST. Code: `e2e/layout.mjs:268-302, 552` runs `E-FLOOR` as an asserted step. Low. **Confirmed.**

**12. e2e/README.md residency section cites `lib.rs` lines that have moved.** — `e2e/README.md:561` (`app_log_dir()`, "lib.rs:96-98"), `:602-603` ("`SessionLog::open`, `lib.rs:100`", "`lib.rs:148-172`"). Code: `src-tauri/src/lib.rs:326-328` now. Unpinned cites, so not historical by the rule; low. **Confirmed.**

## Already tracked in governance/PLAN.yaml (left out of the findings)
- `mp-prime-e2e-covered-fixture` — `MP'` (and Part W's W10, `:1832`) open `multipolygon-f1.parquet`, which has no covering; the dated note at `:1612` already says so.
- `walkthrough-stale-cites-l5-degrees-p1` (done, #274) — L5/P1 cites.
- `walkthrough-current-view-rows-g1-n5` (done, #239) — G1/N5 Current-view wording.
- `e2e-readme-status-bar-steps` (done, #225) — selection entry's E-STATUS-HEIGHT.
- `e2e-stale-expectations-reaim` (done, #204) — C2'/C3', HEXLIM', REFUSAL' re-aims.
- `shell-stale-layout-comments-and-s1-row` (done, #203) — S1 row.
- `sitting-wording-n1-to-n7`, `operator-sitting-queue` — the `[P6 placeholder]` strings the walkthrough rows sight (not reported here as drift).

## Not reached
- The residency-harness section of e2e/README.md (`:466-739`) beyond the line cites above — its flags and evidence fields were not checked one by one against `residency-harness.mjs`/`residencyTrace.mjs`.
- Verbatim re-check of every quoted engine/kernel message in Parts N, P, Q, S, T (spot-checked `crs_undeclared`, `identity_unusable`, `filter_unknown_column`, the publish dialog, residency strings, hover strings — all match).
- `source-changed.mjs`, `source-watch-idle.mjs`, `pan-anchor.mjs` have no README section and no npm script; not assessed.
- Part M's NOTICE.txt line numbers/byte count (`:877`) are a dated, build-specific record and were not regenerated.

-----

