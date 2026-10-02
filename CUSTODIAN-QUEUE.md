# CUSTODIAN-QUEUE

Generated from `PLAN.yaml` (sha256 `495a1f7b2ff187cb8cb204f2fb88cf767dd175790b3c52aa4423a0fe6cb08855`) at `2026-10-02T18:38:22.398Z`.

## 1. Next

- **port-1-linux-l1** — PORT-1 -- Linux L1 for the Cargo workspace: ubuntu-latest in product-ci-rust, the cfg boundary check, the stale runner comment, per-platform levels in KNOWN-LIMITATIONS 1, and R3 in the preregistration template (lane `platform`)

## 2. Ready

- **port-1-linux-l1** — PORT-1 -- Linux L1 for the Cargo workspace: ubuntu-latest in product-ci-rust, the cfg boundary check, the stale runner comment, per-platform levels in KNOWN-LIMITATIONS 1, and R3 in the preregistration template (lane `platform`, order 2, budget 180 min)

## 3. Waiting on the human (total: 20 min)

### ruling

- **geometry-types-beyond-polygons** — Geometry types beyond polygons -- MultiPolygon first, by an architect assessment; reading, rendering, picking, attributes, styling and publishing agree; its own preregistration (20 min)

## 4. Blocked on dependencies

- **type-walk-null-literal-arithmetic** — Type walk: NULL-literal arithmetic -- admit NULL with NULL, carry a literal's bound flag through a NULL-typed result, and give constant-NULL expressions true refusal reasons (B-1 N1) — blocked by: kernel-ticket-drop-followups
- **timing-assertions-under-contention** — Two latency assertions fail under concurrent build load and pass alone — blocked by: timing-tests-assert-property-not-budget
- **b1-engine-kernel-half-followups** — B1 engine-kernel half's routed items -- the proof of publish's retention flag through flush, and the doc and record nits of gate 3 — blocked by: timing-assertions-under-contention
- **entry-79-b1-consult-items** — Entry 79 — three items routed for Brief B stage B1's close — blocked by: b1-shell-half
- **decision-adr-029-scan-progress-route** — ADR-029's scan-progress route, given G1 (a minimal crate patch exposing the connection handle; raw ffi end to end on the scan path; upstream first) -- deferred to Brief B's B2 by the human, round 16 item 3 — blocked by: geometry-types-beyond-polygons
- **kernel-ticket-drop-followups** — StreamRegistry tickets -- the no-drop-under-guard invariant made unwind-safe and checkable (PR #116's deferred items) — blocked by: publish-attempt-lifecycle-src-tauri
- **watch-grandparent-spawn-signal** — A grandparent spawn failure leaves a signal the watcher's ChecksOnly arm ignores (watcher gate-2 reviewer S1) — blocked by: type-walk-null-literal-arithmetic
- **timing-tests-assert-property-not-budget** — The two CI timing flakes assert the property and its ordering, not an undeclared budget (weekly window (a)) — blocked by: watch-grandparent-spawn-signal
- **kernel-close-races-followups** — kernel-generation-close-races' routed items -- the open_dataset sink comment still naming a reference no client holds, stale line cites into skp.rs, and B1's recorded-mutation comment cites shifted by the close-races Amendment 1 lines — blocked by: b1-engine-kernel-half-followups
- **data-plane-crowded-start-detail-spaces** — The data plane's crowded-start detail string loses its runs of spaces (round 26, item 4 (b)) — blocked by: kernel-close-races-followups
- **publish-attempt-lifecycle-src-tauri** — Publish attempt lifecycle in src-tauri -- a second execute no longer replaces a running publish's cancel token, the grants mutex is not held across a whole publish, and closing the window mid-publish leaves no staging directory (wave-1 A1 observations 1-2, A5-2) — blocked by: skp-cancel-state-closed-set
- **entry-77-code-signing** — Entry 77 — code signing for the Windows installer — blocked by: signpath-application-draft
- **m13-bracketed-values** — Part M row M13's two bracketed values — blocked by: release-v0-1-1
- **signpath-application-draft** — Entry 77 — the SignPath OSS application and disclosure text drafted for the human sight, once a release is CI-built — blocked by: release-v0-1-1
- **site-design-v1** — Landing page redesign — DRAFT-4 (status strip, milestone banner, waiting-on-you cards with unblocks counts, the swimlane board) — blocked by: governance-ci-built-site

## 5. In progress

- **skp-cancel-state-closed-set** — The cancel response's state held to SKP-V0's closed set on both sides, or the spec says a reader may accept others (wave-1 C-1) — evidence: branch `cut/skp-cancel-state-closed-set`
- **stop-hook-stale-continuity** — The Stop hook refuses to end a turn while the SESSION-CONTINUITY block is stale (weekly window E) — evidence: branch `cut/stop-hook-stale-continuity`
- **questions-mirror-t11-copy-glob** — questions-mirror.test.mjs T11 copies every top-level .mjs of scripts/hooks/ and scripts/plan/ into its test project instead of a fixed six-file list (test-only, before stop-hook-stale-continuity merges) — evidence: branch `cut/questions-mirror-t11-copy-glob`

## 6. Proposed / unscheduled

### Proposed

- **governance-hash-grammar-shared** — Share the path:line @ rev sha256:hex reference grammar between verify-test-claims.mjs and verify-quotes.mjs (phase `prototype`) — never queued until placed
- **lod-tier-selection** — LOD tier selection -- which tier a viewport draws (renderer/shell, under its own gate); the named product caller of build_tiers (RULED 2026-09-17, round 8); the prepare report and the two labels' shell surface owed here; the operator walkthrough (phase `prototype`) — never queued until placed
- **crs-zoom-constants-per-unit** — ADR-013 A1 item 6, the remaining class -- MAX_ZOOM and extent.ts's fit and degenerate zoom constants declared per CRS unit (crs-unit's STOP LIST Q2) (phase `prototype`) — never queued until placed
- **interactive-zoom-ceiling** — A declared ceiling for interactive zoom (ADR-010 rule 6) -- crs-unit's STOP LIST Q3 (phase `prototype`) — never queued until placed
- **shell-redesign-map-studio** — Shell redesign -- the Map studio direction (the human's choice of 2026-09-23; a design reference, not Authority; the migration plan is to be ruled) (phase `prototype`) — never queued until placed
- **release-v0-1-1** — v0.1.1 release (patch) — the human schedules it; static-CRT declined (69a stands), evidence-archive and SignPath draft ride it (phase `prototype`) — never queued until placed
- **adr-032-decision** — ADR-032 — the GeoParquet non-x-first axis order decision (phase `prototype`) — never queued until placed
- **briefb-b2-save-reopen** — Brief B, stage B2 — recipe save / reopen / verification / rebind / cancellation (phase `prototype`) — never queued until placed
- **briefb-b3-publish-v2** — Brief B, stage B3 — bundle v2 and CLI replay through the same publish implementation (phase `prototype`) — never queued until placed
- **briefb-part-o-walkthrough** — Part O — the nine-step recipe walkthrough, after B3 only (phase `prototype`) — never queued until placed
- **governance-ci-built-site** — Governance -- the site built by CI after merge, the design also addressing tracked-queue conflicts between sibling PRs (phase `prototype`) — never queued until placed
- **geometry-points-cut** — Geometry -- points, its own bounded vertical cut (phase `prototype`) — never queued until placed
- **geometry-lines-cut** — Geometry -- lines, its own bounded vertical cut (phase `prototype`) — never queued until placed
- **b1-shell-half** — Brief B, stage B1 -- the shell half (the hover readout and match per ADR-023, the panel consuming projectable) (phase `prototype`) — never queued until placed
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
- **adr-035-close-races-note** — ADR-035 -- an appended, dated note recording what kernel-generation-close-races makes historical (Decision 3's no-session-reference case unreachable; invalidate marks only on a live removal; Decision 2's mint-race arm gone) (phase `prototype`) — never queued until placed
- **adr-index-unknown-flag-writes** — frontends/shell/scripts/adrIndex.mjs writes docs/README.md when given an unknown flag; it should refuse any argument other than --check (phase `prototype`) — never queued until placed
- **b1-session-ordinal-refusal-wording** — The projection_column_is_identity refusal says a session-ordinal identity is mapped from file_row_number -- the message states the identity's real class (wave-2 A1-1, S2) (phase `prototype`) — never queued until placed
- **shell-admit-describe-failure-closes-open** — admitDataset closes the dataset when describe fails after a successful open_dataset (wave-2 W2-C observation 2, S2) (phase `prototype`) — never queued until placed
- **kernel-close-during-open-admission** — A close naming a handle between open_dataset's catalog insert and its admission forgets the name, then open mints a generation and returns Ok for a dataset the catalog no longer has (node 4's drafting consult, N1; unreachable in the product) (phase `prototype`) — never queued until placed
- **covering-names-missing-column** — A covering that names a column the file lacks is kept at open, and every bbox query then fails after the mint (A2-1 P0 k3) (phase `prototype`) — never queued until placed
- **stream-evaluation-failure-fixed-detail** — An admitted predicate's evaluation failure (same-type integer overflow) ends the stream with a fixed, engine-authored detail carrying no file values and no SQL (B-1's 5c, merged with W2-B observation 2) (phase `prototype`) — never queued until placed
- **port-2-macos-l1-and-app-dirs** — PORT-2 -- macOS L1 for the Cargo workspace: macos-latest in the same matrix, one application-directory boundary replacing the two resolvers, and a case-policy test on a case-insensitive volume (phase `prototype`) — never queued until placed
- **port-3-shell-l1** — PORT-3 -- the Tauri shell crate checked and tested on Linux and macOS in product-ci-shell (L1 for the shell) (phase `prototype`) — never queued until placed
- **port-4-l2-smoke** — PORT-4 -- L2: unsigned tauri build on Linux and macOS as a package check, a Linux application smoke test under a virtual display, and the macOS smoke by hand (MACOS-BRINGUP resumed) (phase `prototype`) — never queued until placed
- **questions-mirror-item-count** — questions-mirror.mjs's countItems counts one item high on a round file with a header rule, so a document send's summary names one item too many (phase `prototype`) — never queued until placed
- **template-round15e-exception-pointer** — docs/PREREGISTRATION-TEMPLATE.md gains one appended sentence pointing at round 34 item 4's narrow exception to round 15 (e), as AUTONOMY.md section 27 records it (phase `prototype`) — never queued until placed
- **flush-crlf-field-rewrite** — flush.mjs splits the ledger on LF and rewrites a field line without its CR, so a CRLF working-tree ledger ends with mixed line endings (phase `prototype`) — never queued until placed
- **skp-closed-domain-response-strings** — Other SKP response fields with a closed value domain are still typed String on the reader (crs.source, identity.class, sanity.level and others) (phase `prototype`) — never queued until placed

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
