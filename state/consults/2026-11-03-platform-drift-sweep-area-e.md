*Custodian's filing note (2026-11-05): a Claude Platform session's report, filed as a consult under the human's direction of 2026-11-05 (`state/directives/2026-11-05-platform-runs-filed-c1-governance-next-fixtures-kernel-node-8b-route-a-f-b-after-8c.md`, line 8, item 1); a reading and not Authority. Provenance: the human's advisory folder for this project, `PLATFORM-RUNS-2026-11-03/DRIFT-SWEEP-AREA-E-2026-11-03.md` (9979 bytes, sha256 4192d1e987b15cbdda9b45b61919f6aa3eb446f97dfe5a5ce6e9a47691b0586d), named in that folder's INDEX.md (sha256 ff6aa985a37ded9869e1dbc62580ee527d6e9a5d6a4b87ba0073c3073f944c73): session sesn_016Ss16K1AXc5ssMKcsof6vB, agent spatial-ide-drift-sweeper (claude-fable-5-1, effort high), US$ 8.92, about 745 s active. The file's own provenance paragraph, the advisor's, comes first under its title; below the rule the file is unchanged, byte for byte. It worked at main 652752afa9bedb0172948869c9ab7f0b8ee08dd3; from it to main at ae55d424, 7 product, docs or KNOWN-LIMITATIONS files changed (docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md, kernel/README.md, kernel/src/bundle/redaction.rs, kernel/src/permission/audit/normalize.rs, kernel/src/publish/viewer_assets.rs, kernel/tests/posix_backslash_in_shared_path_logic.rs, kernel/tests/redaction_hostname_off_windows.rs), so its readings of those files are read again before any node rests on them. The cloud filing of the same question is `state/consults/2026-11-03-cloud-kl-audit-report.md` (KNOWN-LIMITATIONS.md read against main; its branch on 6b67d44b); both stand, and `state/consults/2026-11-05-platform-and-cloud-kl-audit-comparison.md` sets them side by side. They agree that the unnumbered paragraph on filter-admission refusals at wide zooms describes a limit main has fixed and carries no on-main note, and on item 43's cap and absent recovery. They differ on grades. This run lists items 3, 4, 10, 13, 15, 19 and 56 as holding, with 4, 10 and 43 turning untrue only when 1c merges. Of 54 entries, the cloud grades 3, 13, 27 and 56 untrue and 4, 10, 15 and 19 stale. This run lists most items as holding without per-clause detail, so a difference may be a different clause tested. Only this run has the regression.mjs findings: an assertion commented as suspended that fails hard, and a premise that the engine half is unbuilt. It also has stale line cites in a shell test. Only the cloud run has the undeclared behaviours U1 to U17. By the ruling (item 2), triaged as on 2026-10-10, area E's KNOWN-LIMITATIONS items first.*

---

# Drift sweep area E, 2026-11-03 (advisory chat)

Provenance. An independent agent on the Claude Platform (claude-fable-5-1, effort high; agent `spatial-ide-drift-sweeper`, the agent's own system prompt) cloned the public repository in a fresh sandbox and worked at the commit its first lines name (652752afa9bedb0172948869c9ab7f0b8ee08dd3). It changed nothing outside its sandbox, pushed nothing, opened nothing. The advisor started the run through the platform API at the human's request (session sesn_016Ss16K1AXc5ssMKcsof6vB) and fetched the agent's messages verbatim, in order, separated by rules; run figures from the session record: about 745 s active, US$ 8.92. Nothing below this line is edited.

---

I'll start by cloning the repository and checking out the head of main.

-----

HEAD matches the expected commit `652752a`. Let me look at the area E material: KNOWN-LIMITATIONS.md, and the test inventory.

-----

Let me verify the numeric constants and code claims across the on-main items in bulk.

-----

Confirmed. I have what I need for the report.

---

**Repository:** https://github.com/christopherdonini/spatial-ide — **Area E** (KNOWN-LIMITATIONS.md against main; tests describing behaviour main no longer has, or that cannot fail) — **commit swept:** `652752afa9bedb0172948869c9ab7f0b8ee08dd3` (head of main, matches the commit given).

## Findings

**1. KNOWN-LIMITATIONS.md:164-168 — a v0.1.0 limit that main fixed, with no "on main" note.** *(confirmed)*
- Claims: "Under a row filter at wide zooms, some of the view's per-tile queries are refused by the app's own filter-admission check and never run … The app cannot know whether those areas are empty." Its source comment (line 168) says "the fix is queued post-tag with the suspended FIND' assertion as its test".
- Code on main: the fix landed. `engine/src/predicate.rs:146` leases `LeaseClass::Admission` (its own pool class, `MAX_ADMISSION_CONNECTIONS = 4`, `engine/src/pool.rs:132`); `frontends/shell/src/streaming/tileViewportStreamManager.ts:308-320` states that a capacity failure now surfaces as `engine.connections_exhausted`, is retried once (`RETRYABLE_ENGINE_CODE`, line 321), and that `skp.filter_rejected_by_binder` "is therefore never retried here any more" because tiles alone cannot reach the class; every refusal is logged (`logMintRefused`, line 275), never dropped silently. `governance/PLAN.yaml` nodes `polish-87-88-89` (PR #55) and `polish-engine-lease-class` (PR #59, done 2026-09-14, "FIND′ green as the acceptance evidence") record the fix; `docs/adr/ADR-033-connection-lease-classes-for-admission-work.md` exists. The residual that *does* remain is already item 56.
- Why it matters: the rule for this file is that a v0.1.0 line stands unless main changed the behaviour and no "on main" note says so; a reader on main will expect silently unloaded areas under a filter that the build no longer produces, and the comment's "queued post-tag" sends them looking for an open piece that closed six weeks ago. The paragraph is also unnumbered (it sits between items 15 and 16 after a `---`), so nothing can cite it.

**2. frontends/shell/e2e/regression.mjs:1946-1950 — the FIND' header says the entry-84 assertion is SUSPENDED and self-reinstating; the step is a hard, unconditional failure.** *(confirmed)*
- Claims: "**SUSPENDED, and recorded by name rather than failed** … while any [unminted tiles] exist this assertion cannot discriminate entry 84's fix. It reinstates itself, unchanged, on the first run where none exist."
- Code, same file: `regression.mjs:2256-2265` says the opposite in so many words — "entry 84's status assertion below is a HARD, UNCONDITIONAL `failures.push` — … §6 Amendment 1 (b)'s suspension … is gone, not merely bypassed: there is no branch left anywhere in this function that reads `unminted` and chooses not to fail"; the branches at 2267-2290 push to `failures` on the settled-partial sentence with no PREMISE-BROKEN/`records.push` carve-out, and `unminted` is read only in the `observed` summary (2319-2322).
- Why it matters: an operator triaging a FIND' failure who reads the step's header will treat the failure as a recorded, self-suspending observation rather than a real red, and may not escalate it.

**3. frontends/shell/e2e/regression.mjs:2260-2264 — "This step FAILS on this build … expected and honest while the engine half (entry 91 (a), ADR-033) is not built".** *(confirmed stale premise; the sentence is conditional, so the harm is smaller than 2)*
- Code: the engine half is built — `engine/src/predicate.rs:130-146` (`LeaseClass::Admission`, citing ADR-033 and entry 91 (a)); `governance/PLAN.yaml` `polish-engine-lease-class` done 2026-09-14; ADR-033 present under `docs/adr/`.
- Why it matters: it tells a reader a FIND' red is "expected" on this build; on main a FIND' red is a regression.

**4. KNOWN-LIMITATIONS.md:168 (source comment of finding 1) — "resolved on the human's word of 2026-09-13" and "the fix is queued post-tag".** *(confirmed, same root as 1; listed separately because the comment is what a verifier reads first)*
- Code: as in finding 1. The comment names `tileViewportStreamManager.ts mintAndStart's catch` discarding `skp.filter_rejected_by_binder`; on main that catch logs every refusal (`logMintRefused`, `:275-283`) and the binder code now means a genuine binder refusal.

**5. frontends/shell/src/App.lateResult.test.tsx:1349 — an unpinned line cite into `residency/candidateArmSession.ts:1046, :1076-1082` for `onSessionEnded` / `endSession`.** *(suspect — low priority)*
- Code: `candidateArmSession.ts:1046` is now `syncScanLiveness()` in a terminal handler and `:1076-1082` is a doc comment about clearing the untiled first look; the `endSession` path is around `:1056-1064`. The comment's meaning survives; only the numbers have shifted. The repository already tracks this class for `kernel/src/skp.rs` cites (`skp-line-cites-outside-close-races`, blocked) but not for shell-internal cites; I did not survey the rest, and I would not act on this one alone.

Everything else I checked in KNOWN-LIMITATIONS.md holds on main (both sides read): items 1 (port-2 macOS not merged; CI matrix is windows-latest + ubuntu-24.04 with the `--list --ignored` step), 2 (two catalog entries; `FormatDefaultContradicted`; the CRS form opens for it), 3 (identity form appears only on `engine.identity_unusable`), 4, 5, 6, 7 (every status string verbatim), 8, 9 (`judge_covering`: absent path opens, ambiguous/misbound refuses at open), 10, 11, 12, 13, 14, 15, 17 (`MIN_ANCHOR_SPAN`, `RECENTER_MAX_DRIFT`), 19 (`FOOTER_DESCRIPTOR_MAX_BYTES`), 20 (`GLOB_METACHARACTERS`), 21/32 (`preflight_pinless_parts`), 22 (`convicts` only for `FormatDefault`), 23, 24 (`cfg(not(windows))` → `ChecksOnly`), 28 (`SESSION_END_EVENT_QUEUE_BOUND = 64`, `sync_channel`), 30 (`EXIT_DRAIN_CEILING = 30 s`, `.<name>.staging-` prefix, "no outcome (interrupted?)"), 31/33, 35 (`POINT_RADIUS_PX = 4`), 36/38 (`SUB_PIXEL_PICK_REFUSAL_THRESHOLD_PX = 9`, `LINE_PICK_RADIUS_PX = 4`), 37 (`LINE_WIDTH_PX = 2`), 40, 41 (`reason: null`), 42 on-main, 43 (`MAX_SESSION_HISTORY_BYTES = 33_554_432`; `recover` has no product caller; B2 1c not merged), 44, 45, 46 (`FIELD_COMPLETION_MAX_OPTIONS = 200`), 47 (`MIN_PRINTABLE_RUN = 12`), 51 (`RESIDENT_ATTRIBUTE_MAX_BYTES = 268_435_456`), 52, 53 (`covering_case_collision.rs` is on main), 54 (`TABLE_MAX_ROWS = 1_000`, `TABLE_MAX_ATTRIBUTE_BYTES = 67_108_864`), 55, 56 (4/4 connections, 3 in-flight tiles, one retry, `tableSourceRef.current?.cancel()` beside the export's consumer acquisition). Tests: the crs/identity/geometry re-aims (`skp_admission.rs`, `manual_walkthrough_fixtures.rs`, `identity.rs`, `session_identity.rs`, `geometry_admission.rs`) describe current behaviour; I found no Rust or vitest test without a reachable assertion (scripted scan of every `#[test]` body and every `it(`/`test(` body), no `.skip`/`.only`, no tautological `expect(x).toBe(x)`, and no fixture-absent-early-return in the default suites; the `#[ignore]` reasons and the "UNMEASURED" env-gated harnesses are declared as such. e2e expected strings that I could match (refusal messages, summary lines, status sentences, button labels, `CURRENT_VIEW_DISABLED_REASON`, `FILTER_SCOPE_SENTENCE`) match the shell and engine sources on main.

## Already tracked in governance/PLAN.yaml (left out of findings)
- `mp-prime-e2e-covered-fixture` — regression.mjs's MP' step opens `multipolygon-f1.parquet` (no covering) and is expected to meet the no-covering refusal.
- `skp-line-cites-outside-close-races` — stale line cites into `kernel/src/skp.rs` from shell streaming, App.tsx, pool_poll.rs, src-tauri lib.rs, the P4 corpus test and the persisted-artifacts test.
- `b2-piece-1c-save-and-reopen` (in progress) — its summary already records that items 4, 10 and 43 go untrue when 1c's steps merge; not merged at this commit, so they still hold.
- `port-2-macos-l1-and-app-dirs` (in flight, unmerged) — item 1's "macOS: no level yet" and item 43's data-directory sentence are both still true at this commit.
- `e2e-stale-expectations-reaim` (done) and `polish-87-88-89` / `polish-engine-lease-class` (done) — the latter two are the fix behind findings 1-4 but no node tracks the KNOWN-LIMITATIONS paragraph or the regression.mjs header.

## Not got to
- A line-by-line survey of unpinned `path:line` cites inside test comments across `frontends/shell/src/**/*.test.ts(x)` and `engine/tests`, `kernel/tests` (finding 5 is one sample).
- `frontends/shell/e2e/residency-harness.mjs` and `refusal-contract-baseline.mjs` (baseline-arm harnesses) for assertions describing the dev-only baseline arm's old behaviour.
- The "RECORDED MUTATION" doc comments on tests, to check that each named mutation site still exists in the code it names.
- `renderer/bundle-viewer` test headers against the viewer's current `manifest.ts`/`partition.ts` beyond the string checks above.

-----

