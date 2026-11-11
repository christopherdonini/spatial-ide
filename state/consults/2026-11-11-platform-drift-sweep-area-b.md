*Custodian's filing note (2026-11-11): a Claude Platform session's report, filed as a consult under the human's direction of 2026-11-11 (17:40Z) (`state/directives/2026-11-11-seven-platform-runs-read-hourly-filed-as-consults-307-review-into-its-gate-round-stall-report-beside-the-reads.md`, line 7); a reading and not Authority. Provenance: the human's advisory folder for this project, `PLATFORM-RUNS-2026-11-11/DRIFT-SWEEP-AREA-B-2026-11-11.md` (23981 bytes, sha256 f3289c7c7abe29ded12e6f9aa3220fe30bf98c34cd488346911806cd74845ffa; modified 2026-11-11T22:25:26Z; the folder holds no index file at this reading): session sesn_01Ey3h6Hbv7RmABq42NX2mKY, agent spatial-ide-drift-sweeper (claude-fable-5-1, effort high; the agent's own system prompt), US$ 16.57, about 679 s active. The file's own provenance paragraph, the advisor's, comes first under its title; below the rule the file is unchanged, byte for byte. It swept main at 572416aa73b1c0f2aaa479ad3476a4829c14d26a (its own first lines say). From 572416aa to main at 8b5e3d21, 8 commits changed no file outside state/, governance/ and site/ (by git diff --name-only), so its readings of product, docs and KNOWN-LIMITATIONS files hold at this filing; its readings of governance and state records are read again before any node rests on them. Its seven findings (walkthrough rows M5, J4, I3, C2 and M18(a), and two e2e README entries) are for the walkthrough and README nodes; none is placed by this filing.*

---

# Drift sweep area B, 2026-11-11 (advisory chat)

Provenance. An independent agent on the Claude Platform (claude-fable-5-1, effort high; agent `spatial-ide-drift-sweeper`, the agent's own system prompt) cloned the public repository in a fresh sandbox and worked at the commit its first lines name (origin/main was 572416aa when the run started). It changed nothing outside its sandbox, pushed nothing, opened nothing. The advisor started the run through the platform API at the human's request (session sesn_01Ey3h6Hbv7RmABq42NX2mKY) and fetched the agent's messages verbatim, in order, separated by rules; run figures from the session record: about 679 s active, US$ 16.57, last stop reason end_turn. Nothing below this line is edited.

---

I'll start by cloning the repository and orienting myself.

-----

The head of main is still 572416aa. Let me look at the area B material and the prior sweep.

-----

Now the walkthrough itself. It's long, so I'll read it in portions.

-----

Now the e2e README.

-----

The prior sweep's findings look mostly addressed in the text. Now let me look at the shell source and e2e scripts so I can check claims against code.

-----

Let me see what changed in the shell since the last sweep, to focus where drift is likeliest.

-----

Let me verify the operator-facing strings in bulk against the shell source, starting with the residency/hover/filter strings that the live rows quote verbatim.

-----

Now the e2e README's security-posture paragraph against the code it cites.

-----

Now the e2e README's step names versus what each script actually runs.

-----

**Repository:** https://github.com/christopherdonini/spatial-ide — **Area B** (MANUAL-WALKTHROUGH.md rows and e2e/README.md vs. the shell's controls, strings and e2e suites) — **commit swept:** `572416aa73b1c0f2aaa479ad3476a4829c14d26a` (head of main at checkout; same as the one named for this run).

Weighting: the live sitting rows (Parts P-points, T, W, Y, Z, AA, AB, AC6–8, L5, G3) and the still-unrun Part M were checked string-by-string against the shell source; nearly all hold. The findings below are what remains.

## Findings (most likely to make the operator act wrongly first)

**1. M5 tells the operator to filter `100k-happy-path.parquet` with `zone = 'residential'` and expects a filtered view; that fixture has no `zone` column.** — `frontends/shell/MANUAL-WALKTHROUGH.md:879` ("type `zone = 'residential'` … click **Apply** — Part E's E2. The filtered view renders; `.filter-active` shows the applied predicate"). Code: `kernel/tests/manual_walkthrough_fixtures.rs` `generate_the_100k_happy_path_fixture` builds the file with `..Default::default()`; `engine/src/fixture.rs:694` defaults `attributes: AttributeMode::None`, which `:174-175` defines as `[id, bbox?, geometry]`. Apply would refuse `skp.filter_unknown_column` (E3's own message), not render a filtered view. The row's parenthetical hedge ("or any predicate the fixture's schema admits") exists, but the one concrete predicate it gives is wrong, and M8 (`:882`, "with M5's filter applied, the dialog says so") leans on it; Part M's clean-profile result log (`:1389-1392`) is still blank, so the row is live. **Confirmed** by reading the fixture spec (not run). No PLAN.yaml node names M5.

**2. J4 cross-references "J3's class-C row", which J3 no longer describes.** — `MANUAL-WALKTHROUGH.md:667` ("There is no copy button on this entry (structurally absent, same as J3's class-C row)"). J3 at `:666` was rewritten by PR #283 to expect a class-A `record_step` entry *with* a Copy button; `src/console/surfaceRegistry.ts` has no class-C row for a style edit (the `CLASSC'` coverage row at `:690` says the same). An operator told to compare against "J3's class-C row" has nothing to compare with. **Confirmed.**

**3. I3's cite into `engine/src/error.rs` is unpinned and has moved.** — `MANUAL-WALKTHROUGH.md:594` quotes the `engine.axis_order_unsupported` message as "verbatim, `engine/src/error.rs:238-243`". The message is at `engine/src/error.rs:327-332` (text unchanged). Low impact — the quoted text still matches — but a reader checking the cite lands on the wrong variant. **Confirmed.**

**4. C2 places the Session identity row "below" the Identity line; it renders five rows later.** — `MANUAL-WALKTHROUGH.md:188` ("Its **Identity** line reads … Below it, a **Session identity** row reads"). `src/admission/DescribeSummary.tsx:44-45` renders Identity, then Row count, Extent, Schema, License and CRS provenance (`:47-63`), and only then Session identity (`:66-68`). The sentence is still literally true (it is lower on the list) but misdirects where to look; low. **Confirmed.**

**5. e2e/README.md's selection entry omits the suite's first step.** — `frontends/shell/e2e/README.md:754` lists the asserted steps from `E-CLICK` on; `e2e/selection.mjs:844` runs `E-SCENE` first (opens the fixture and builds the scene both later steps depend on), and it can fail by name. A reader mapping a failing `E-SCENE` line to the README finds no row. Low. **Confirmed.**

**6. e2e/README.md's export-view entry no longer states everything `E-CV` asserts.** — `README.md:766` describes `E-CV` as box A vs box F only; since the filter-scope change, `e2e/export-view.mjs` `stepCv` also asserts A's prompt carries `filter_scope === null` (EV2) and F's carries `publish.rs`'s `FILTER_SCOPE_SENTENCE` (EV4), with two recorded mutations in the file header. An omission, not a falsehood; low. **Confirmed.**

**7. M18(a) quotes a two-valued cursor rule that the code has since widened.** — `MANUAL-WALKTHROUGH.md:892` (`"getCursor` returns `"crosshair"` … and `"grabbing"` while dragging — exactly two values"; "FAIL is any third cursor"). `src/canvas/pickResolution.ts:456-459` now returns a third value, `"default"`, for the Select tool (W2 at `:1823` describes it as the arrow). Under Navigate the rule still holds and the row already ran (Row 5 PASS, `:1420`), so this only bites a rerun done with Select active. **Suspect** as an operator hazard; the text/code mismatch itself is confirmed.

Everything else I checked holds on main: residency status strings (K2/K3/L1–L6/M7/M15/M16), the hover refusal and confirming marker (K6/L7/M17), the filter panel strings and `Applied:` rendering (E1–E7/AB3/AB9), the publish panel/dialog field order and both scope sentences (G1/G3/G5/G8/N5/Y2), the console header and binding citation (J1/J4), the action registry words and labels (AB11), the tool switch/mode labels and Feature-tab counts (W1–W4), the Table scopes, limit and lines (AC6–AC8), the `[P6 placeholder]` string locations named in Q2/S4/P7/T6/U10/W11, point radius, line width, casing and 4 px pick tolerance (P1/T1/T2/T4), the e2e README security-posture paragraph against `lib.rs`/`isInstrumentedBuild.ts`/`checkDistClean.mjs`, every other suite's step list against its script, and the numeric bounds the README quotes (256, 80 000, 65 536, 5 s/100 ms, 900 s, 2400 s, 48 px, 4,096-byte filter ceiling).

## Already tracked in governance/PLAN.yaml (left out of the findings)
- `walkthrough-rows-stale-against-main-sweep-area-b` (done, #283) — carried the 2026-11-03 findings 1, 3–5, 7–10.
- `b1-shell-half` (PR B) — Part F's F2 "nothing round-trips through the kernel" clause (2026-11-03 finding 2's F2 half) waits for PR B's Part F records by rule (00); still false on main at `:273`.
- `shell-comments-drift-sweep-area-a` — the companion source-comment items.
- `operator-sitting-queue` — the sitting list and Part L's re-copied preamble; `publish-approval-ttl-ten-minutes` — G3's expiry sentence sight.
- `mp-prime-e2e-covered-fixture`, `e2e-readme-status-bar-steps` (done), `walkthrough-row-m10-declared-not-verified-write-time-guard` (done).

## Not reached
- `e2e/README.md`'s residency-harness section (`:457-731`): flags and evidence fields not checked one by one against `residency-harness.mjs`/`residencyTrace.mjs`.
- The README's CI claim "the release artifact's own job runs no dist check" (`:9`) against the workflow files.
- `KNOWN-LIMITATIONS.md` item 42's "the current viewport extent" Row-scope wording against `publish.rs:146-150`'s "the map's extent when Export interactive map… was clicked" (area E, noted in passing, not verified for an "on main" note).
- Verbatim re-check of every engine/kernel message quoted in Parts N, S, T beyond the ones spot-checked (`crs_undeclared`, `identity_unusable`, `axis_order_unsupported`, the publish refusals all match).
- `source-watch-idle.mjs` and `pan-anchor.mjs` still have no README section and no npm script (unchanged since 2026-11-03; not assessed).
- Part M's NOTICE.txt line/byte figures (`:877`) — build-specific, not regenerated.

**Closing line:** of the 2026-11-03 sweep's 12 findings, I found 11 fixed on main; the twelfth (finding 2) is fixed for J3 and H5 and tracked by node for its F2 half.

-----

The sandbox is intact (clone at `572416aa`, nothing lost). I'll close one cheap check that was in hand — whether KNOWN-LIMITATIONS item 42 carries an "on main" note — and then deliver the report.

-----

Item 42 carries its "On main" paragraph, so it is not drift. Nothing was redone; the report below is the one assembled before the interruption, with that check folded into "not reached" as settled.

---

**Repository:** https://github.com/christopherdonini/spatial-ide — **Area B** (MANUAL-WALKTHROUGH.md rows and e2e/README.md vs. the shell's controls, strings and e2e suites) — **commit swept:** `572416aa73b1c0f2aaa479ad3476a4829c14d26a` (head of main at checkout; the same commit named for this run).

Weighting: the live sitting rows (Parts P-points, T, W, Y, Z, AA, AB, AC6–8, L5, G3) and the still-unrun Part M were checked string-by-string against the shell source; nearly all hold. The findings below are what remains.

## Findings (most likely to make the operator act wrongly first)

**1. M5 tells the operator to filter `100k-happy-path.parquet` with `zone = 'residential'` and expects a filtered view; that fixture has no `zone` column.** — `frontends/shell/MANUAL-WALKTHROUGH.md:879` ("type `zone = 'residential'` … click **Apply** — Part E's E2. The filtered view renders; `.filter-active` shows the applied predicate"). Code: `kernel/tests/manual_walkthrough_fixtures.rs` `generate_the_100k_happy_path_fixture` builds the file with `..Default::default()`; `engine/src/fixture.rs:694` defaults `attributes: AttributeMode::None`, which `:174-175` defines as `[id, bbox?, geometry]`. Apply would refuse `skp.filter_unknown_column` (E3's own message), not render a filtered view. The row's hedge "(or any predicate the fixture's schema admits)" exists, but the one concrete predicate it gives is wrong, and M8 (`:882`, "with M5's filter applied, the dialog says so") leans on it; Part M's clean-profile result log (`:1389-1392`) is blank, so the row is live. **Confirmed** by reading the fixture spec (not run). No PLAN.yaml node names M5.

**2. J4 cross-references "J3's class-C row", which J3 no longer describes.** — `MANUAL-WALKTHROUGH.md:667` ("There is no copy button on this entry (structurally absent, same as J3's class-C row)"). J3 at `:666` was rewritten by PR #283 to expect a class-A `record_step` entry *with* a Copy button; `src/console/surfaceRegistry.ts` has no class-C row for a style edit (the `CLASSC'` coverage row at `:690` says the same). An operator told to compare against "J3's class-C row" has nothing to compare with. **Confirmed.**

**3. I3's cite into `engine/src/error.rs` is unpinned and has moved.** — `MANUAL-WALKTHROUGH.md:594` quotes the `engine.axis_order_unsupported` message as "verbatim, `engine/src/error.rs:238-243`". The message is at `engine/src/error.rs:327-332` (text unchanged). Low — the quoted text still matches — but a reader checking the cite lands on the wrong variant. **Confirmed.**

**4. C2 places the Session identity row "below" the Identity line; it renders five rows later.** — `MANUAL-WALKTHROUGH.md:188` ("Its **Identity** line reads … Below it, a **Session identity** row reads"). `src/admission/DescribeSummary.tsx:44-45` renders Identity, then Row count, Extent, Schema, License and CRS provenance (`:47-63`), and only then Session identity (`:66-68`). Literally still true (it is lower on the list) but misdirects where to look; low. **Confirmed.**

**5. e2e/README.md's selection entry omits the suite's first step.** — `frontends/shell/e2e/README.md:754` lists the asserted steps from `E-CLICK` on; `e2e/selection.mjs:844` runs `E-SCENE` first (opens the fixture and builds the scene the later steps depend on), and it can fail by name. A reader mapping a failing `E-SCENE` line to the README finds no row. Low. **Confirmed.**

**6. e2e/README.md's export-view entry no longer states everything `E-CV` asserts.** — `README.md:766` describes `E-CV` as box A vs box F only; since the filter-scope change, `e2e/export-view.mjs` `stepCv` also asserts A's prompt carries `filter_scope === null` (EV2) and F's carries `publish.rs`'s `FILTER_SCOPE_SENTENCE` (EV4), with two recorded mutations in the file header. An omission, not a falsehood; low. **Confirmed.**

**7. M18(a) quotes a two-valued cursor rule that the code has since widened.** — `MANUAL-WALKTHROUGH.md:892` ("`getCursor` returns `"crosshair"` … and `"grabbing"` while dragging — exactly two values"; "FAIL is any third cursor"). `src/canvas/pickResolution.ts:456-459` now returns a third value, `"default"`, for the Select tool (W2 at `:1823` calls it the arrow). Under Navigate the rule still holds and the row already ran (Row 5 PASS, `:1420`), so this bites only a rerun done with Select active. **Suspect** as an operator hazard; the text/code mismatch itself is confirmed.

Everything else checked holds on main: the residency status strings (K2/K3/L1–L6/M7/M15/M16), the hover refusal and confirming marker (K6/L7/M17), the filter panel strings and `Applied:` rendering (E1–E7/AB3/AB9), the publish panel/dialog field order and both scope sentences (G1/G3/G5/G8/N5/Y2), the console header and binding citation (J1/J4), the action registry words and labels (AB11), the tool-switch/mode labels and Feature-tab counts (W1–W4), the Table scopes, limit and lines (AC6–AC8), the `[P6 placeholder]` string locations named in Q2/S4/P7/T6/U10/W11, point radius, line width, casing and 4 px pick tolerance (P1/T1/T2/T4), the e2e README security-posture paragraph against `lib.rs`/`isInstrumentedBuild.ts`/`checkDistClean.mjs`, every other suite's step list against its script, and the numeric bounds the README quotes (256, 80 000, 65 536, 5 s/100 ms, 900 s, 2400 s, 48 px, 4,096-byte filter ceiling).

## Already tracked in governance/PLAN.yaml (left out of the findings)
- `walkthrough-rows-stale-against-main-sweep-area-b` (done, #283) — carried the 2026-11-03 findings 1, 3–5, 7–10.
- `b1-shell-half` (PR B) — Part F's F2 "nothing round-trips through the kernel" clause (finding 2's F2 half) waits for PR B's Part F records by rule (00); still false on main at `:273`.
- `shell-comments-drift-sweep-area-a` — the companion source-comment items.
- `operator-sitting-queue` — the sitting list and Part L's re-copied preamble; `publish-approval-ttl-ten-minutes` — G3's expiry sentence sight.
- `mp-prime-e2e-covered-fixture`, `e2e-readme-status-bar-steps` (done), `walkthrough-row-m10-declared-not-verified-write-time-guard` (done).

## Not reached
- `e2e/README.md`'s residency-harness section (`:457-731`): flags and evidence fields not checked one by one against `residency-harness.mjs`/`residencyTrace.mjs`.
- The README's CI claim "the release artifact's own job runs no dist check" (`:9`) against the workflow files.
- Verbatim re-check of every engine/kernel message quoted in Parts N, S, T beyond those spot-checked (`crs_undeclared`, `identity_unusable`, `axis_order_unsupported`, the publish refusals — all match).
- `source-watch-idle.mjs` and `pan-anchor.mjs` still have no README section and no npm script (unchanged since 2026-11-03; not assessed).
- Part M's NOTICE.txt line/byte figures (`:877`) — build-specific, not regenerated.
- Settled after the interruption: KNOWN-LIMITATIONS item 42's "current viewport extent" wording carries an "On main, fixed by export-current-view-after-unreported-fit" paragraph (`KNOWN-LIMITATIONS.md:219`), so it is not drift.

**Closing line:** of the 2026-11-03 sweep's 12 findings, I found 11 fixed on main; the twelfth (finding 2) is fixed for J3 and H5 and tracked by node for its F2 half.

-----

The sandbox still holds the clone at `572416aa`; nothing was lost and nothing needed redoing. The sweep was complete when the limit hit, so here is the report as the final message.

---

**Repository:** https://github.com/christopherdonini/spatial-ide — **Area B** (MANUAL-WALKTHROUGH.md rows and e2e/README.md vs. the shell's controls, strings and e2e suites) — **commit swept:** `572416aa73b1c0f2aaa479ad3476a4829c14d26a` (head of main at checkout; the same commit named for this run).

Weighting: the live sitting rows (Parts P-points, T, W, Y, Z, AA, AB, AC6–8, L5, G3) and the still-unrun Part M were checked string-by-string against the shell source; nearly all hold. The findings below are what remains.

## Findings (most likely to make the operator act wrongly first)

**1. M5 tells the operator to filter `100k-happy-path.parquet` with `zone = 'residential'` and expects a filtered view; that fixture has no `zone` column.** — `frontends/shell/MANUAL-WALKTHROUGH.md:879` ("type `zone = 'residential'` … click **Apply** — Part E's E2. The filtered view renders; `.filter-active` shows the applied predicate"). Code: `kernel/tests/manual_walkthrough_fixtures.rs` `generate_the_100k_happy_path_fixture` builds the file with `..Default::default()`; `engine/src/fixture.rs:694` defaults `attributes: AttributeMode::None`, which `:174-175` defines as `[id, bbox?, geometry]`. Apply would refuse `skp.filter_unknown_column` (E3's own message), not render a filtered view. The row's hedge "(or any predicate the fixture's schema admits)" exists, but the one concrete predicate it gives is wrong, and M8 (`:882`, "with M5's filter applied, the dialog says so") leans on it; Part M's clean-profile result log (`:1389-1392`) is blank, so the row is live. **Confirmed** by reading the fixture spec (not run). No PLAN.yaml node names M5.

**2. J4 cross-references "J3's class-C row", which J3 no longer describes.** — `MANUAL-WALKTHROUGH.md:667` ("There is no copy button on this entry (structurally absent, same as J3's class-C row)"). J3 at `:666` was rewritten by PR #283 to expect a class-A `record_step` entry *with* a Copy button; `src/console/surfaceRegistry.ts` has no class-C row for a style edit (the `CLASSC'` coverage row at `:690` says the same). An operator told to compare against "J3's class-C row" has nothing to compare with. **Confirmed.**

**3. I3's cite into `engine/src/error.rs` is unpinned and has moved.** — `MANUAL-WALKTHROUGH.md:594` quotes the `engine.axis_order_unsupported` message as "verbatim, `engine/src/error.rs:238-243`". The message is at `engine/src/error.rs:327-332` (text unchanged). Low — the quoted text still matches — but a reader checking the cite lands on the wrong variant. **Confirmed.**

**4. C2 places the Session identity row "below" the Identity line; it renders five rows later.** — `MANUAL-WALKTHROUGH.md:188` ("Its **Identity** line reads … Below it, a **Session identity** row reads"). `src/admission/DescribeSummary.tsx:44-45` renders Identity, then Row count, Extent, Schema, License and CRS provenance (`:47-63`), and only then Session identity (`:66-68`). Literally still true (it is lower on the list) but misdirects where to look; low. **Confirmed.**

**5. e2e/README.md's selection entry omits the suite's first step.** — `frontends/shell/e2e/README.md:754` lists the asserted steps from `E-CLICK` on; `e2e/selection.mjs:844` runs `E-SCENE` first (opens the fixture and builds the scene the later steps depend on), and it can fail by name. A reader mapping a failing `E-SCENE` line to the README finds no row. Low. **Confirmed.**

**6. e2e/README.md's export-view entry no longer states everything `E-CV` asserts.** — `README.md:766` describes `E-CV` as box A vs box F only; since the filter-scope change, `e2e/export-view.mjs` `stepCv` also asserts A's prompt carries `filter_scope === null` (EV2) and F's carries `publish.rs`'s `FILTER_SCOPE_SENTENCE` (EV4), with two recorded mutations in the file header. An omission, not a falsehood; low. **Confirmed.**

**7. M18(a) quotes a two-valued cursor rule that the code has since widened.** — `MANUAL-WALKTHROUGH.md:892` ("`getCursor` returns `"crosshair"` … and `"grabbing"` while dragging — exactly two values"; "FAIL is any third cursor"). `src/canvas/pickResolution.ts:456-459` now returns a third value, `"default"`, for the Select tool (W2 at `:1823` calls it the arrow). Under Navigate the rule still holds and the row already ran (Row 5 PASS, `:1420`), so this bites only a rerun done with Select active. **Suspect** as an operator hazard; the text/code mismatch itself is confirmed.

Everything else checked holds on main: the residency status strings (K2/K3/L1–L6/M7/M15/M16), the hover refusal and confirming marker (K6/L7/M17), the filter panel strings and `Applied:` rendering (E1–E7/AB3/AB9), the publish panel/dialog field order and both scope sentences (G1/G3/G5/G8/N5/Y2), the console header and binding citation (J1/J4), the action registry words and labels (AB11), the tool-switch/mode labels and Feature-tab counts (W1–W4), the Table scopes, limit and lines (AC6–AC8), the `[P6 placeholder]` string locations named in Q2/S4/P7/T6/U10/W11, point radius, line width, casing and 4 px pick tolerance (P1/T1/T2/T4), the e2e README security-posture paragraph against `lib.rs`/`isInstrumentedBuild.ts`/`checkDistClean.mjs`, every other suite's step list against its script, and the numeric bounds the README quotes (256, 80 000, 65 536, 5 s/100 ms, 900 s, 2400 s, 48 px, 4,096-byte filter ceiling).

## Already tracked in governance/PLAN.yaml (left out of the findings)
- `walkthrough-rows-stale-against-main-sweep-area-b` (done, #283) — carried the 2026-11-03 findings 1, 3–5, 7–10.
- `b1-shell-half` (PR B) — Part F's F2 "nothing round-trips through the kernel" clause (finding 2's F2 half) waits for PR B's Part F records by rule (00); still false on main at `:273`.
- `shell-comments-drift-sweep-area-a` — the companion source-comment items.
- `operator-sitting-queue` — the sitting list and Part L's re-copied preamble; `publish-approval-ttl-ten-minutes` — G3's expiry sentence sight.
- `mp-prime-e2e-covered-fixture`, `e2e-readme-status-bar-steps` (done), `walkthrough-row-m10-declared-not-verified-write-time-guard` (done).

## Not reached
- `e2e/README.md`'s residency-harness section (`:457-731`): flags and evidence fields not checked one by one against `residency-harness.mjs`/`residencyTrace.mjs`.
- The README's CI claim "the release artifact's own job runs no dist check" (`:9`) against the workflow files.
- Verbatim re-check of every engine/kernel message quoted in Parts N, S, T beyond those spot-checked (`crs_undeclared`, `identity_unusable`, `axis_order_unsupported`, the publish refusals — all match).
- `source-watch-idle.mjs` and `pan-anchor.mjs` still have no README section and no npm script (unchanged since 2026-11-03; not assessed).
- Part M's NOTICE.txt line/byte figures (`:877`) — build-specific, not regenerated.
- Settled: KNOWN-LIMITATIONS item 42's "current viewport extent" wording carries an "On main, fixed by export-current-view-after-unreported-fit" paragraph (`KNOWN-LIMITATIONS.md:219`), so it is not drift.

**Closing line:** of the 2026-11-03 sweep's 12 findings, I found 11 fixed on main; the twelfth (finding 2) is fixed for J3 and H5 and tracked by node for its F2 half.

-----

