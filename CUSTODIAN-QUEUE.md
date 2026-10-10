# CUSTODIAN-QUEUE

Generated from `PLAN.yaml` (sha256 `02bd48538745bd4d13d429d8b09b409bd52a346622a06a2ae3b68995e4632554`) at `2026-10-10T13:02:47.781Z`.

## 1. Next

- (nothing ready)

## 2. Ready

- (none)

## 3. Waiting on the human (total: 10 min)

### ruling

- **decision-adr-029-scan-progress-route** — ADR-029's scan-progress route, given G1 (a minimal crate patch exposing the connection handle; raw ffi end to end on the scan path; upstream first) -- deferred to Brief B's B2 by the human, round 16 item 3 (10 min)

## 4. Blocked on dependencies

- **crs-undeclared-message-wording** — engine.crs_undeclared's message in the human's words: engine/src/error.rs and every test, e2e constant and walkthrough row that quotes it, nothing else (sweep area E, its last line) — blocked by: filter-identity-alias-ambiguous-reached-through-skp, e2e-stale-expectations-reaim
- **entry-79-b1-consult-items** — Entry 79 — three items routed for Brief B stage B1's close — blocked by: b1-shell-half
- **filter-identity-alias-ambiguous-reached-through-skp** — skp.filter_identity_alias_ambiguous is reachable from the product since skp/0.2, and no test reaches it through SKP (sweep area C, finding 2, S2) — blocked by: stream-flush-cancel-exit-marks-producer-cancelled
- **b2-piece-1b-recording** — B2 piece 1b -- recording: the kernel's step commands for filter, scope and style, the session history on the machine, safe against a crash, and the docs/07 note — blocked by: shell-migration-milestone-2, guardian-v1
- **module-docs-stale-statements** — Engine and kernel module docs brought current, one docs-only piece (README bodies and doc comments, no code logic): the kernel README's H2 row and the engine's persists-nothing sentence first, then drift sweep area D's other eight findings and the earlier items — blocked by: known-limitations-item-2-on-main-paragraph
- **skp-v0-live-sections-current-area-c** — SKP-V0.md's live sections and three comments brought current to the wire the code sends (sweep area C, findings 1, 3, 4, 6, 7, 8 and 9; no literal change); and skp.malformed_hex_f64, skp.bbox_not_finite and skp.unknown_handle struck as refusals a client receives (sweep area C, finding 5, ruled) — blocked by: module-docs-stale-statements
- **shell-stale-frame-comments** — Two shell comments still describe the old frame: ConsolePanel.tsx (a bottom drawer below every panel) and residencyStatus.ts (a child of the removed canvas status stack); WorkingCanvas.tsx comments call deck.gl 9.3.7 pinned; residencyStatus.ts still calls ruled status strings drafts, string 6 among them; and canvas/hoverRepickConstants.ts still marks HOVER_REPICK_ON_PAN pending — blocked by: known-limitations-item-8-filter-not-published
- **shell-stale-layout-comments-and-s1-row** — Four stale statements on main from #195, found by the human's independent read: StylePanel.tsx's header, PublishPanel.tsx's pointer to the styles.css budget, MANUAL-WALKTHROUGH.md row S1, layoutBoundary.test.ts's header — blocked by: known-limitations-item-8-filter-not-published
- **shell-map-refill-after-resize** — The map refills after a resize: a layout change that uncovers map area issues a viewport query, so the area fills without a pan or zoom — blocked by: e2e-stale-expectations-reaim, shell-stale-frame-comments, shell-stale-layout-comments-and-s1-row
- **shell-migration-milestone-2** — Shell migration, milestone 2 -- selection and scope: the Select tool, a selection that survives filter and pan, the hidden count, a stated scope — blocked by: shell-map-refill-after-resize, e2e-stale-expectations-reaim
- **stale-test-names-and-comments** — Stale test names and test comments, names and comments only, no assertion changes: a refusal-named test that asserts admission, the React-harness premise, the no-attributes reason, a Proposed ADR-018, two ruled decisions still marked pending (sweep area E, findings 2, 3, 4, 7 and 10) — blocked by: e2e-stale-expectations-reaim, skp-v0-live-sections-current-area-c
- **briefb-b2-save-reopen** — B2 — Save project, Snapshot data, session history, lineage and preferences, in five stages, each with its own form — blocked by: decision-adr-029-scan-progress-route
- **known-limitations-item-2-on-main-paragraph** — KNOWN-LIMITATIONS item 2 gains the human's on-main paragraph (absent crs key and latitude-first CRS admitted under GeoParquet 1.0.0 and 1.1.0), and items 19, 20 and 22's unpinned cites are pinned (sweep area E, findings 1 and 6) — blocked by: shell-stale-frame-comments, shell-stale-layout-comments-and-s1-row
- **entry-77-code-signing** — Entry 77 — code signing for the Windows installer — blocked by: signpath-application-draft
- **m13-bracketed-values** — Part M row M13's two bracketed values — blocked by: release-v0-1-1
- **signpath-application-draft** — Entry 77 — the SignPath OSS application and disclosure text drafted for the human sight, once a release is CI-built — blocked by: release-v0-1-1
- **ported-code-notice-route** — A notice route for ported code, wherever it lands (shell or kernel), needed before any PORT — blocked by: stream-flush-cancel-exit-marks-producer-cancelled, filter-identity-alias-ambiguous-reached-through-skp, crs-undeclared-message-wording
- **site-design-v1** — Landing page redesign — DRAFT-4 (status strip, milestone banner, waiting-on-you cards with unblocks counts, the swimlane board) — blocked by: governance-ci-built-site
- **guardian-v1** — Guardian v1 -- G1's heredoc false alarm fixed, one local log line per refusal, and three new rules: G7 (agent merges and history rewrites), G8 (plugin, marketplace and MCP installs, and writes to the user's Claude folder), G9 (wholesale cleans of the main checkout's target) (Fable's MODS-V1 brief, 2026-10-05) — blocked by: ported-code-notice-route

## 5. In progress

- **stream-flush-cancel-exit-marks-producer-cancelled** — engine/src/stream.rs flush's cancel exit marks producer_cancelled, as the five other cancel exits after the first batch do, with a test that forces that exit: the end instant of the docs/08 cancellation budget (flake hunt run 1, S2) — evidence: branch `cut/stream-flush-cancel-exit-marks-producer-cancelled`
- **e2e-stale-expectations-reaim** — Re-aim the shell e2e steps whose expectations predate ruled product changes: regression C2'/C3', admission MAP' and BOTHNEEDED', console HEXLIM', GROUP' and REFUSAL', source-changed default-route S4 — evidence: branch `cut/e2e-stale-expectations-reaim`
- **known-limitations-item-8-filter-not-published** — KNOWN-LIMITATIONS item 8 corrected: a filter is never part of what is published (the app never sends it, at the v0.1.0 tag as on main); walkthrough row M8; the correction recorded against RELEASE-0.1.md Amendment 15 (sweep area E, finding 8, S1) — evidence: branch `cut/known-limitations-item-8-filter-not-published`

## 6. Proposed / unscheduled

### Proposed

- **governance-hash-grammar-shared** — Share the path:line @ rev sha256:hex reference grammar between verify-test-claims.mjs and verify-quotes.mjs (phase `prototype`) — never queued until placed
- **lod-tier-selection** — LOD tier selection -- which tier a viewport draws (renderer/shell, under its own gate); the named product caller of build_tiers (RULED 2026-09-17, round 8); the prepare report and the two labels' shell surface owed here; the operator walkthrough (phase `prototype`) — never queued until placed
- **crs-zoom-constants-per-unit** — ADR-013 A1 item 6, the remaining class -- MAX_ZOOM and extent.ts's fit and degenerate zoom constants declared per CRS unit (crs-unit's STOP LIST Q2) (phase `prototype`) — never queued until placed
- **interactive-zoom-ceiling** — A declared ceiling for interactive zoom (ADR-010 rule 6) -- crs-unit's STOP LIST Q3 (phase `prototype`) — never queued until placed
- **shell-redesign-map-studio** — Shell redesign -- the Map studio direction (the human's choice of 2026-09-23; a design reference, not Authority; the migration plan is to be ruled) (phase `prototype`) — never queued until placed
- **release-v0-1-1** — v0.1.1 release (patch) — the human schedules it; static-CRT declined (69a stands), evidence-archive and SignPath draft ride it (phase `prototype`) — never queued until placed
- **briefb-b3-publish-v2** — Brief B, stage B3 — bundle v2 and CLI replay through the same publish implementation (phase `prototype`) — never queued until placed
- **briefb-part-o-walkthrough** — Part O — the nine-step recipe walkthrough, after B3 only (phase `prototype`) — never queued until placed
- **governance-ci-built-site** — Governance -- the site built by CI after merge, the design also addressing tracked-queue conflicts between sibling PRs (phase `prototype`) — never queued until placed
- **b1-shell-half** — Shell migration, milestone 4 -- B1 shell half: attributes of the inspected feature, colour by category with its legend, and the table (phase `prototype`) — never queued until placed
- **verify-mutation-test-temp-dirs** — verify-mutation's own tests remove their mkdtemp directories (weekly window (b)) (phase `prototype`) — never queued until placed
- **extent-degenerate-zoom-doc** — extent.ts's doc matches its degenerate-zoom behaviour (weekly window (c)) (phase `prototype`) — never queued until placed
- **verify-quotes-show-cites-narrowed** — verify-quotes --show-cites prints no false FAILs when narrowed (weekly window (e)) (phase `prototype`) — never queued until placed
- **adr-023-s2-widenings-adr-021-consult** — Consult: whether ADR-023's section 2 widenings owe ADR-021 a note (weekly window (f)) (phase `prototype`) — never queued until placed
- **engine-cancel-before-execute-siblings** — The six other cancel.attach sites reuse the execute-window guard, so a cancel before execution stops the work, not only the outcome (dataset.rs identity scan and index.rs first, their work unbounded) (phase `prototype`) — never queued until placed
- **posix-backslash-in-shared-path-logic** — Shared path logic stops treating a backslash as a separator on POSIX: distinct audit destinations stay distinct, and a viewer asset named with a backslash is refused, not renamed (wave-3 A-1, S2) (phase `prototype`) — never queued until placed
- **redaction-hostname-off-windows** — The redaction scan knows the machine's hostname off Windows, so machine-identifier findings reach an audit record's residual_classes there too (wave-3 A-2, S2, sent to Fable for weighing) (phase `prototype`) — never queued until placed
- **windows-case-fold-non-ascii** — The audit case policy on Windows folds non-ASCII letters as NTFS does, so a profile path differing only in non-ASCII case cannot escape the user-home redaction (wave 3's 1c-2 correction, S2, code-path-only) (phase `prototype`) — never queued until placed
- **verify-cites-test-temp-dirs** — verify-cites' pre-existing test removes its temp directory (round 26, item 4 (c)) (phase `prototype`) — never queued until placed
- **dco-hook-merge-skip** — The local DCO hook's merge skip never fires (found by the exposure-profile-paths gate 1) (phase `prototype`) — never queued until placed
- **exposure-scan-followups** — The exposure scan's routed items -- hits in files main added after 16df0d7, type changes the diff filter skips, the punctuation-only segment (phase `prototype`) — never queued until placed
- **shell-session-log-line-framing** — The shell's session log keeps one line per record: level escaped, and carriage returns escaped in both fields (wave-1 A1-2) (phase `prototype`) — never queued until placed
- **tile-issue-epoch-growth** — TileViewportStreamManager's issueEpoch map bounded within a dataset session (wave-1 A5 observation 5) (phase `prototype`) — never queued until placed
- **audit-show-invalid-utf8-whole-refusal** — publish-bundle --audit-show refuses the whole audit log over one invalid UTF-8 byte, instead of reporting that line as CORRUPT (node 6 drafting consult) (phase `prototype`) — never queued until placed
- **skp-line-cites-outside-close-races** — Stale line cites into kernel/src/skp.rs outside kernel-close-races-followups files -- shell streaming, App.tsx, pool_poll.rs, src-tauri lib.rs, the P4 corpus test and the persisted-artifacts test (phase `prototype`) — never queued until placed
- **session-generation-t1-t3-reobservation** — kernel/tests/session_generation.rs T1 to T3 recorded mutations re-observed at a named commit, T1 describing the arm after #147 (phase `prototype`) — never queued until placed
- **adr-035-close-races-note** — ADR-035 -- an appended, dated note recording what kernel-generation-close-races makes historical (Decision 3's no-session-reference case unreachable; invalidate marks only on a live removal; Decision 2's mint-race arm gone) (phase `prototype`) — never queued until placed
- **adr-index-unknown-flag-writes** — frontends/shell/scripts/adrIndex.mjs writes docs/README.md when given an unknown flag; it should refuse any argument other than --check (phase `prototype`) — never queued until placed
- **b1-session-ordinal-refusal-wording** — The projection_column_is_identity refusal says a session-ordinal identity is mapped from file_row_number -- the message states the identity's real class (wave-2 A1-1, S2) (phase `prototype`) — never queued until placed
- **shell-admit-describe-failure-closes-open** — admitDataset closes the dataset when describe fails after a successful open_dataset (wave-2 W2-C observation 2, S2) (phase `prototype`) — never queued until placed
- **kernel-close-during-open-admission** — A close naming a handle between open_dataset's catalog insert and its admission forgets the name, then open mints a generation and returns Ok for a dataset the catalog no longer has (node 4's drafting consult, N1; unreachable in the product) (phase `prototype`) — never queued until placed
- **stream-evaluation-failure-fixed-detail** — An admitted predicate's evaluation failure (same-type integer overflow) ends the stream with a fixed, engine-authored detail carrying no file values and no SQL (B-1's 5c, merged with W2-B observation 2) (phase `prototype`) — never queued until placed
- **port-2-macos-l1-and-app-dirs** — PORT-2 -- macOS L1 for the Cargo workspace: macos-latest in the same matrix, one application-directory boundary replacing the two resolvers, and a case-policy test on a case-insensitive volume (phase `prototype`) — never queued until placed
- **port-3-shell-l1** — PORT-3 -- the Tauri shell crate checked and tested on Linux and macOS in product-ci-shell (L1 for the shell) (phase `prototype`) — never queued until placed
- **port-4-l2-smoke** — PORT-4 -- L2: unsigned tauri build on Linux and macOS as a package check, a Linux application smoke test under a virtual display, and the macOS smoke by hand (MACOS-BRINGUP resumed) (phase `prototype`) — never queued until placed
- **questions-mirror-item-count** — questions-mirror.mjs's countItems counts one item high on a round file with a header rule, so a document send's summary names one item too many (phase `prototype`) — never queued until placed
- **template-round15e-exception-pointer** — docs/PREREGISTRATION-TEMPLATE.md gains one appended sentence pointing at round 34 item 4's narrow exception to round 15 (e), as AUTONOMY.md section 27 records it (phase `prototype`) — never queued until placed
- **flush-crlf-field-rewrite** — flush.mjs splits the ledger on LF and rewrites a field line without its CR, so a CRLF working-tree ledger ends with mixed line endings (phase `prototype`) — never queued until placed
- **skp-closed-domain-response-strings** — Other SKP response fields with a closed value domain are still typed String on the reader (crs.source, identity.class, sanity.level and others) (phase `prototype`) — never queued until placed
- **publish-unix-quota-perm-errors** — EDQUOT and EPERM in publish error classification on unix (wave-3 W3-A observation 1) (phase `prototype`) — never queued until placed
- **publish-bundle-sigterm** — SIGTERM handling in publish-bundle on unix (wave-3 W3-A observation 3) (phase `prototype`) — never queued until placed
- **prepare-cancel-key-per-dataset** — Prepare cancel tokens are keyed by dataset handle, so two concurrent prepares on one dataset would replace and remove each other token (phase `prototype`) — never queued until placed
- **audit-unknown-outcome-at-exit** — An explicit unknown audit outcome when a publish is cut off at the exit-drain ceiling (kernel and audit schema) (phase `prototype`) — never queued until placed
- **shell-macos-last-window-convention** — The shell honours macOS convention that closing the last window does not quit (RunEvent::Reopen and window recreation) (phase `prototype`) — never queued until placed
- **cfg-boundary-read-errors** — cfg-boundary skips any tracked file it cannot read, not only a missing one, so an unreadable file passes unscanned (phase `prototype`) — never queued until placed
- **publish-lifecycle-drain-followups** — Exit drain follow-ups -- an execute that registers after the drain began is not cancelled; Park/Settle can hang if the controlling test thread panics; run_exclusive removal is not RAII (phase `prototype`) — never queued until placed
- **kernel-composed-ceiling-projected-stream** — The kernel's composed per-stream ceilings do not cover a live projected stream's attribute buffers -- recompose and declare that bound (ADR-010 rule 6) (phase `prototype`) — never queued until placed
- **sitting-part-r-row-r1** — Walkthrough Part R, row R1 -- close the window during a publish, relaunch at once, and check the two processes do not conflict (node 8; the exit-drain ruling's condition (c)) (phase `prototype`) — never queued until placed
- **profile-path-scan-stdin-mode** — The profile-path scanner gains a stdin mode, so a mod can run the scanner's own matcher on content not yet on disk (guardian-v0's G5, left out of v0 by round 43, item 3) (phase `prototype`) — never queued until placed
- **type-walk-rule2-residual-reasons** — Type walk: a rule-2 result over a column or an integer literal, refused by rule 7's bit-width bound, keeps the residual reason although its value is a constant NULL (for example f32 > NULL + 100000) (phase `prototype`) — never queued until placed
- **pre-admission-change-detail-braces** — Four kernel P6-placeholder detail strings are wrapped in literal braces, which reach the operator message; the watcher form declares each such string starts with the bracketed placeholder tag (phase `prototype`) — never queued until placed
- **verify-offline-note-test-flake** — scripts/plan/verify.test.mjs's offline-note test failed once on a pull_request run and passed on a re-run; its bare assertion carries no message, so the cause is unknown (phase `prototype`) — never queued until placed
- **slice-budgets-cancel-cells-on-trace-pair** — The docs/08 measurement harness scores its cancellation cells on ADR-018's pair (cancel_requested to the producer's cancel_observed, from the engine trace), with the client-to-adapter interval kept as a reported figure (phase `prototype`) — never queued until placed
- **mp-prime-e2e-covered-fixture** — E2E: MP-1's step MP' opens F-1, which has no covering, so it is predicted to meet the no-covering refusal; a step on F-1c, its covered twin (phase `prototype`) — never queued until placed
- **shell-owners-index** — An owner's index for the shell (frontends/shell), so that shell-owned KNOWN-LIMITATIONS items and pointers are indexed somewhere (phase `prototype`) — never queued until placed
- **corpus-line-files** — A line file (LineString or MultiLineString) in the preregistered compatibility corpus, so that line admission is tried on a real-world file (phase `prototype`) — never queued until placed
- **lines-class-budget-measurement** — Measure docs/08's Lines class (1M features / 10M vertices) for the working canvas, once lines are drawn (phase `prototype`) — never queued until placed
- **covering-case-collision-binds-other-column** — A declared covering whose path differs from two schema names only by case: DuckDB may bind it to the other column, a wrong-rows risk that predates the covering piece (phase `prototype`) — never queued until placed
- **publish-sort-window-cancel-not-exercised-on-ci** — kernel/tests/publish_cancellation.rs: a_cancel_inside_the_sort_is_observed_rather_than_waited_out reddened on the Windows CI runner because QueryRunning never fired (the sort ended inside one poll interval) (phase `prototype`) — never queued until placed
- **first-batch-factorial-ignored-trace-tests** — kernel/tests/first_batch_factorial.rs's two ignored measurement tests each start a trace in one binary with no shared lock (phase `prototype`) — never queued until placed
- **slice-traced-test-cross-stamping** — engine/tests/slice.rs's traced test reads first cancellation stamps while its binary's other tests run unserialised, one of them cancelling (phase `prototype`) — never queued until placed
- **source-changed-post-reopen-routes-watcher-visible** — source-changed.mjs's post and reopen routes, and walkthrough Part N's N6 and N8, still change the source by an mtime touch the advisory watcher can see (phase `prototype`) — never queued until placed
- **stream-cancel-returns-left-unmarked** — The producer's cancel returns the flush piece leaves unmarked: a prepare error through classify, the two-read window in classify's marking arms, and the send to a receiver that is gone (is a disconnect an observation) (phase `prototype`) — never queued until placed
- **identity-declaration-route-for-session-tier** — The app offers no way to declare an identity column for a file that opened on the session tier (no id column): the declaration form appears only when identity is refused (phase `prototype`) — never queued until placed
- **verify-cites-pin-resolution-and-line-zero** — verify-cites: a pinned cite starting at line 0 gets a false reason, and a pin is read only at the path as written (phase `prototype`) — never queued until placed
- **docs-14-corpus-attribution-vs-docs-08** — docs/14 asks corpus attribution in demos and published bundles, which docs/08 line 40 now says are never redistributed (phase `prototype`) — never queued until placed
- **e2e-first-poll-readout-elsewhere** — Two more e2e suites take a hover id from the readout's first poll after a pointer move: source-changed.mjs hoverAt and residency-harness.mjs tryHoverCandidate (phase `prototype`) — never queued until placed
- **dataset-stream-doc-producer-runs-ahead** — engine/src/stream.rs: Dataset::stream's doc says it returns once the statement is prepared and produces the first batch on the first next_into; the producer thread prepares and runs ahead to the queue bound (phase `prototype`) — never queued until placed
- **shell-migration-milestone-3** — Shell migration, milestone 3 -- command bar and filter clauses: Ctrl+K, slash commands, typed /filter with field completion, clause cards with on and off (phase `prototype`) — never queued until placed
- **shell-migration-milestone-5** — Shell migration, milestone 5 -- conditions, Problems and Jobs: one home for failures and running work (phase `prototype`) — never queued until placed
- **shell-real-app-run-macos-linux** — Run the real app once on macOS and once on Linux after migration milestone 1 merges, and record what it finds (phase `prototype`) — never queued until placed
- **b2-piece-1c-save-and-reopen** — B2 piece 1c -- Save project (linked) and reopen: the project's identity, the project file, the changed-file notice, the recovery offer after a crash, and the saved-here mark (phase `prototype`) — never queued until placed
- **verify-quotes-dotted-paths** — verify-quotes: the hash-reference path grammar cannot begin with a dot, so a pinned cite into .github/ can never be checked (phase `prototype`) — never queued until placed

### Unscheduled

- **governance-verify-mutation-header-token** — verify-mutation.mjs -- the RECORDED MUTATION token is accepted anywhere inside the check's fixed window around a test, so a token in a file header or in a neighbouring test's comment greens a test that carries no mutation of its own (phase `prototype`) — ambition, never queued
- **notebooks-record-replay** — Notebooks: record and replay (03) (phase `alpha`) — ambition, never queued
- **mcp-server-permission-model** — MCP server with the permission model (04) (phase `alpha`) — ambition, never queued
- **first-external-plugin-skp-client** — First external plugin as an out-of-process SKP client (02) (phase `alpha`) — ambition, never queued
- **platform-hardware-validation** — macOS/WKWebView and Linux/WebKitGTK hardware validation (phase `prototype`) — ambition, never queued
- **data-doctor-legacy-imports** — Data doctor + legacy imports (05) (phase `alpha`) — ambition, never queued
- **action-console-remainder** — Action console remainder — notebook recording and the AI flywheel (03) (phase `alpha`) — ambition, never queued
- **problems-panel-spatial-linting** — Problems panel / spatial linting (03) (phase `alpha`) — ambition, never queued
- **lineage-time-travel** — Lineage time travel + scenario branches (02, 03) (phase `beta`) — ambition, never queued
- **postgis-remotes** — PostGIS remotes (05) (phase `beta`) — ambition, never queued
- **style-dsl-editor** — Style DSL + editor (03, 06) (phase `beta`) — ambition, never queued
- **publishing-bundles-hardened** — Publishing bundles hardened (managed sharing service stays out — ADR-008) (phase `beta`) — ambition, never queued
- **skp-v1-protocol-freeze** — SKP v1 protocol freeze — the ecosystem commitment (phase `v1`) — ambition, never queued
- **plugin-ecosystem-seed** — Plugin ecosystem seed (docs, templates, example clients) (phase `v1`) — ambition, never queued
- **basic-editing-plugin** — Basic editing plugin (ADR-002 amended, ADR-007) — scheduled last in 1.0 (phase `v1`) — ambition, never queued
- **data-plane-crate-fmt** — spatial-data-plane made rustfmt-clean in one mechanical piece (round 26, item 4 (a)) (phase `prototype`) — ambition, never queued
- **mod-workboard** — Workboard -- a read-only pane mod (deferred by the 2026-10-03 mods-roadmap ruling) (phase `prototype`) — ambition, never queued
- **mod-worktree-resource-protection** — Worktree and resource protection -- a mod (deferred by the 2026-10-03 mods-roadmap ruling) (phase `prototype`) — ambition, never queued
- **recorder-write-latency-measure** — Evidence Recorder: a declared write-latency measure with its own sample, so the brief overhead acceptance can be established before the Recorder evaluation ends (Amendment 2 C2-d keeps E5 a lower bound) (phase `prototype`) — ambition, never queued
- **reuse-round-1-bundle** — Reuse archaeology round 1, the advisor bundle, filed as one docs-and-data piece (not under docs/) (phase `prototype`) — ambition, never queued
