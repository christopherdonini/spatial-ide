# CUSTODIAN-QUEUE

Generated from `PLAN.yaml` (sha256 `8f559935538d21a5ca8e02427d5450f8f358b633d37703b3b4c7c0f64dff7886`) at `2026-11-07T14:11:32.750Z`.

## 1. Next

- **clippy-deny-warnings-workspace** — The workspace clippy diagnostics fixed, so cargo clippy over every target with -D warnings exits 0 (the cloud Linux run lists 48 distinct) (lane `engine`)

## 2. Ready

- **clippy-deny-warnings-workspace** — The workspace clippy diagnostics fixed, so cargo clippy over every target with -D warnings exits 0 (the cloud Linux run lists 48 distinct) (lane `engine`, order null, budget 120 min)
- **lod-tier-tests-own-tier-folder** — Each engine test run takes its own tier folder, the machine-wide tier folder kept for the product only: two suites sharing one machine cleared each other's tiers, failing lod_tier_builder in #284's gate 1 (the human's ruling of 2026-11-06, item 2) (lane `engine`, order null, budget 60 min)
- **single-file-bracket-name-refused-as-partitioned** — A single file whose name holds a bracket or a brace is refused as partitioned across more than one file, and the refusal's advice cannot be followed in the app (the cloud audit, U17) (lane `engine`, order null, budget 120 min)
- **pre-admission-change-detail-braces** — Four kernel P6-placeholder detail strings are wrapped in literal braces, which reach the operator message; the watcher form declares each such string starts with the bracketed placeholder tag (lane `kernel-protocol`, order null, budget 30 min)
- **windows-case-fold-non-ascii** — The audit case policy on Windows folds non-ASCII letters as NTFS does, so a profile path differing only in non-ASCII case cannot escape the user-home redaction (wave 3's 1c-2 correction, S2, code-path-only) (lane `kernel-protocol`, order null, budget 60 min)
- **publish-filter-sentence-mark-comment-and-adr-024-note** — The mark's source comment in the human's words in publish.rs and types.ts, and ADR-024's dated note in the human's words (U12's N-3 and N-2) (lane `shell`, order null, budget 20 min)
- **publish-bundle-sigterm** — SIGTERM handling in publish-bundle on unix (wave-3 W3-A observation 3) (lane `platform`, order null, budget 90 min)
- **publish-unix-quota-perm-errors** — EDQUOT and EPERM in publish error classification on unix (wave-3 W3-A observation 1) (lane `platform`, order null, budget 90 min)

## 3. Waiting on the human (total: 25 min)

### ruling

- **adr-035-close-races-note** — ADR-035 -- an appended, dated note recording what kernel-generation-close-races makes historical (Decision 3's no-session-reference case unreachable; invalidate marks only on a live removal; Decision 2's mint-race arm gone) (5 min)

### sitting

- **operator-sitting-queue** — The operator sitting queue -- the walkthrough Parts, P6 sights and felt verdicts owed to the human's sitting, in one list (no slot) (0 min)
- **sitting-wording-n1-to-n7** — The sitting script's seven wording findings, N1 to N7: each string's clause untrue at main replaced in the architect's words, prepared as pieces for the human's yes at the sitting (10 min)
- **governance-e-readings** — Piece E readings before E1's form: context loaded in a custodian session; this project's own transcript tally; the installed Claude Code facts; the bytes one worker and one reviewer dispatch receive (10 min)

## 4. Blocked on dependencies

- **narrow-integer-id-unstreamable** — An 8, 16 or 32-bit integer id column is admitted at open but no stream carries it (the cloud audit, U2) — blocked by: single-file-bracket-name-refused-as-partitioned
- **adr-029-stale-line-cites** — ADR-029 (Proposed, unbuilt): its line cites into the code and the admission form land on other text, so an implementer of the scan-progress route would follow them to the wrong places (the docs audits, Task C rows 56 to 73 and Task B) — blocked by: module-docs-drift-sweep-area-d
- **docs-02-adr-017-entry-current** — docs/02's ADR-017 entry brought current with every appended section (the ADR-017 note's OPEN-4 (c), S4, the docs lane last) — blocked by: sitting-wording-n1-to-n7, adr-029-stale-line-cites
- **fixture-determinism-off-windows-record** — kernel/FIXTURES.md on determinism (byte-identical on one machine, different across platforms, with the Linux sizes and hashes), and the G5 entry point gains the hash check the S entry point has — blocked by: posix-backslash-is-inside-and-redaction-label
- **lod-tier-identity-binds-file-name** — The LOD tier builder takes the identity name DuckDB bound and looks it up among the file's own footer names, so a renamed identity column reaches a different column there — blocked by: port-2-macos-l1-and-app-dirs
- **module-docs-drift-sweep-area-d** — Kernel and engine module docs: the never-refuses and unreachable claims the Table, record_step and publish have overtaken, the withdrawn cancellation bound, and smaller statements (drift sweep area D, findings 1 to 6) — blocked by: b2-piece-1c-save-and-reopen, adr-indices-hand-written-current
- **skp-line-cites-outside-close-races** — Stale line cites into kernel/src/skp.rs outside kernel-close-races-followups files -- shell streaming, App.tsx, pool_poll.rs, src-tauri lib.rs, the P4 corpus test and the persisted-artifacts test — blocked by: adr-035-close-races-note
- **entry-79-b1-consult-items** — Entry 79 — three items routed for Brief B stage B1's close — blocked by: b1-shell-half
- **publish-filter-sentence-e2e-shown-case** — The case where the filter sentence is shown, proved end to end: EV2 expects filter_scope null and EV4 the sentence, in frontends/shell/e2e/export-view.mjs (U12's OPEN-3 (A), the architect's N-1) — blocked by: shell-comments-drift-sweep-area-a
- **session-end-lines-name-coverage-lost-as-source-change** — The hover readout and the Feature tab word every session end as a source change, coverage-lost included, although the engine says coverage-lost is never a source change (milestone 4 PR C gate 1, the architect's C1 note) — blocked by: b1-shell-half
- **session-log-token-redaction-rests-on-page-code** — The session token never reaching the session log rests on page code: binding_log_session_event appends page-supplied text verbatim, the page holds the token, and the data plane's Session::redact has only a test caller — blocked by: b2-piece-1c-save-and-reopen
- **stale-harness-comments-find-prime-and-late-result** — Stale harness and test comments: the FIND step header and its status comment in regression.mjs, and a cite into candidateArmSession.ts in App.lateResult.test.tsx — blocked by: publish-filter-sentence-e2e-shown-case
- **briefb-b2-save-reopen** — B2 — Save project, Snapshot data, session history, lineage and preferences, in five stages, each with its own form — blocked by: decision-adr-029-scan-progress-route
- **entry-77-code-signing** — Entry 77 — code signing for the Windows installer — blocked by: signpath-application-draft
- **m13-bracketed-values** — Part M row M13's two bracketed values — blocked by: release-v0-2-0
- **signpath-application-draft** — Entry 77 — the SignPath OSS application and disclosure text drafted for the human sight, once a release is CI-built — blocked by: release-v0-2-0
- **adr-indices-hand-written-current** — The hand-written ADR indices brought current: docs/README.md conventions paragraph and the docs/02 ADR list, where ADR-013 is called proposed though accepted and architect-blockable (the docs audits, A-S3, A-S5 and A-S8 index halves and the platform-only items) — blocked by: e2e-readme-security-posture-measure-build
- **adr-notes-stale-statements-and-indices** — ADR notes, Status lines and indices stating what has since changed (the cloud ADR audit, A-S1 to A-S8) — blocked by: b2-piece-1c-save-and-reopen
- **governance-e1-rules-as-records** — Piece E1: rules as records, a rule catalogue under rules/, a selector scripts/plan/rules.mjs, a generated block in each agent definition and a governance-ci check — blocked by: governance-e-readings
- **shell-owners-index** — An owner's index for the shell (frontends/shell), so that shell-owned KNOWN-LIMITATIONS items and pointers are indexed somewhere — blocked by: skp-line-cites-outside-close-races
- **site-design-v1** — Landing page redesign — DRAFT-4 (status strip, milestone banner, waiting-on-you cards with unblocks counts, the swimlane board) — blocked by: governance-ci-built-site
- **macos-normalization-roots-uncanonicalized** — On macOS the audit log normalization roots are read uncanonicalized while recorded destinations are canonicalized, so a symlinked temporary-directory root never matches — blocked by: port-2-macos-l1-and-app-dirs
- **posix-backslash-is-inside-and-redaction-label** — The audit log's is_inside and the redaction scan's file label stop treating a backslash as a separator on POSIX, the two sites entry 7b leaves (wave-3 A-1, S3) — blocked by: port-2-macos-l1-and-app-dirs

## 5. In progress

- **b2-piece-1c-save-and-reopen** — B2 piece 1c -- Save project (linked) and reopen: the project's identity, the project file, the changed-file notice, the recovery offer after a crash, and the saved-here mark — evidence: branch `cut/b2-piece-1c-save-and-reopen`
- **b1-shell-half** — Shell migration, milestone 4 -- B1 shell half: attributes of the inspected feature, colour by category with its legend, and the table — evidence: branch `cut/b1-shell-half-pr-c`
- **walkthrough-row-m10-declared-not-verified-write-time-guard** — MANUAL-WALKTHROUGH.md M10: its sentence that only the bundled viewer's load-time check catches a DeclaredNotVerified dataset over ceiling, untrue once publish-session-tier-identity's write-time guard merges (U1's gate 1 reviewer, N-1) — evidence: branch `cut/walkthrough-row-m10-declared-not-verified-write-time-guard`
- **e2e-readme-security-posture-measure-build** — frontends/shell/e2e/README.md: the security-posture paragraph is untrue for the measure build (the debug port in Rust, the e2e hooks kept in), with the missing E-FLOOR entry and stale lib.rs cites (drift sweep area B, findings 6, 11 and 12) — evidence: branch `cut/e2e-readme-security-posture-measure-build`
- **shell-comments-drift-sweep-area-a** — Shell product comments stale against main: the candidate arm called dev-only, the e2e surface calling baseline the default, accessors labelled instrument-only, the old status-stack frame and smaller statements (drift sweep area A, less the lines in b1-shell-half PR B files) — evidence: branch `cut/shell-comments-drift-sweep-area-a`
- **port-2-macos-l1-and-app-dirs** — PORT-2 -- macOS L1 for the Cargo workspace: macos-latest in the same matrix, one application-directory boundary replacing the two resolvers, and a case-policy test on a case-insensitive volume — evidence: branch `cut/port-2-macos-l1-and-app-dirs`

## 6. Proposed / unscheduled

### Proposed

- **lod-tier-selection** — LOD tier selection -- which tier a viewport draws (renderer/shell, under its own gate); the named product caller of build_tiers (RULED 2026-09-17, round 8); the prepare report and the two labels' shell surface owed here; the operator walkthrough (phase `prototype`) — never queued until placed
- **crs-zoom-constants-per-unit** — ADR-013 A1 item 6, the remaining class -- MAX_ZOOM and extent.ts's fit and degenerate zoom constants declared per CRS unit (crs-unit's STOP LIST Q2) (phase `prototype`) — never queued until placed
- **interactive-zoom-ceiling** — A declared ceiling for interactive zoom (ADR-010 rule 6) -- crs-unit's STOP LIST Q3 (phase `prototype`) — never queued until placed
- **shell-redesign-map-studio** — Shell redesign -- the Map studio direction (the human's choice of 2026-09-23; a design reference, not Authority; the migration plan is to be ruled) (phase `prototype`) — never queued until placed
- **briefb-b3-publish-v2** — Brief B, stage B3 — bundle v2 and CLI replay through the same publish implementation (phase `prototype`) — never queued until placed
- **briefb-part-o-walkthrough** — Part O — the nine-step recipe walkthrough, after B3 only (phase `prototype`) — never queued until placed
- **governance-ci-built-site** — Governance -- the site built by CI after merge, the design also addressing tracked-queue conflicts between sibling PRs (phase `prototype`) — never queued until placed
- **table-max-attribute-bytes-measurement** — TABLE_MAX_ATTRIBUTE_BYTES, the table's first-scope ceiling of 64 MiB, is declared and unmeasured: measure it before any performance claim (phase `prototype`) — never queued until placed
- **verify-mutation-test-temp-dirs** — verify-mutation's own tests remove their mkdtemp directories (weekly window (b)) (phase `prototype`) — never queued until placed
- **extent-degenerate-zoom-doc** — extent.ts's doc matches its degenerate-zoom behaviour (weekly window (c)) (phase `prototype`) — never queued until placed
- **verify-quotes-show-cites-narrowed** — verify-quotes --show-cites prints no false FAILs when narrowed (weekly window (e)) (phase `prototype`) — never queued until placed
- **adr-023-s2-widenings-adr-021-consult** — Consult: whether ADR-023's section 2 widenings owe ADR-021 a note (weekly window (f)) (phase `prototype`) — never queued until placed
- **verify-cites-test-temp-dirs** — verify-cites' pre-existing test removes its temp directory (round 26, item 4 (c)) (phase `prototype`) — never queued until placed
- **dco-hook-merge-skip** — The local DCO hook's merge skip never fires (found by the exposure-profile-paths gate 1) (phase `prototype`) — never queued until placed
- **exposure-scan-followups** — The exposure scan's routed items -- hits in files main added after 16df0d7, type changes the diff filter skips, the punctuation-only segment (phase `prototype`) — never queued until placed
- **shell-session-log-line-framing** — The shell's session log keeps one line per record: level escaped, and carriage returns escaped in both fields (wave-1 A1-2) (phase `prototype`) — never queued until placed
- **tile-issue-epoch-growth** — TileViewportStreamManager's issueEpoch map bounded within a dataset session (wave-1 A5 observation 5) (phase `prototype`) — never queued until placed
- **audit-show-invalid-utf8-whole-refusal** — publish-bundle --audit-show refuses the whole audit log over one invalid UTF-8 byte, instead of reporting that line as CORRUPT (node 6 drafting consult) (phase `prototype`) — never queued until placed
- **invalidate-generation-clause-observed-by-a-test** — A test that observes GenerationRegistry::invalidate's generation clause: a live name minted again with no pruning call between, then invalidate, so that dropping the clause fails it (W-B of the other-recorded-mutations piece) (phase `prototype`) — never queued until placed
- **adr-index-unknown-flag-writes** — frontends/shell/scripts/adrIndex.mjs writes docs/README.md when given an unknown flag; it should refuse any argument other than --check (phase `prototype`) — never queued until placed
- **b1-session-ordinal-refusal-wording** — The projection_column_is_identity refusal says a session-ordinal identity is mapped from file_row_number -- the message states the identity's real class (wave-2 A1-1, S2) (phase `prototype`) — never queued until placed
- **shell-admit-describe-failure-closes-open** — admitDataset closes the dataset when describe fails after a successful open_dataset (wave-2 W2-C observation 2, S2) (phase `prototype`) — never queued until placed
- **engine-query-terminal-detail-sql-audit** — Every other engine.query terminal detail repeats a slice of the composed SQL (W2-B observation 2): audit the stream-terminal paths, then decide whether to withhold DuckDB text more widely (phase `prototype`) — never queued until placed
- **port-3-shell-l1** — PORT-3 -- the Tauri shell crate checked and tested on Linux and macOS in product-ci-shell (L1 for the shell) (phase `prototype`) — never queued until placed
- **port-4-l2-smoke** — PORT-4 -- L2: unsigned tauri build on Linux and macOS as a package check, a Linux application smoke test under a virtual display, and the macOS smoke by hand (MACOS-BRINGUP resumed) (phase `prototype`) — never queued until placed
- **template-round15e-exception-pointer** — docs/PREREGISTRATION-TEMPLATE.md gains one appended sentence pointing at round 34 item 4's narrow exception to round 15 (e), as AUTONOMY.md section 27 records it (phase `prototype`) — never queued until placed
- **skp-closed-domain-response-strings** — Other SKP response fields with a closed value domain are still typed String on the reader (crs.source, identity.class, sanity.level and others) (phase `prototype`) — never queued until placed
- **prepare-cancel-key-per-dataset** — Prepare cancel tokens are keyed by dataset handle, so two concurrent prepares on one dataset would replace and remove each other token (phase `prototype`) — never queued until placed
- **audit-unknown-outcome-at-exit** — An explicit unknown audit outcome when a publish is cut off at the exit-drain ceiling (kernel and audit schema) (phase `prototype`) — never queued until placed
- **shell-macos-last-window-convention** — The shell honours macOS convention that closing the last window does not quit (RunEvent::Reopen and window recreation) (phase `prototype`) — never queued until placed
- **cfg-boundary-read-errors** — cfg-boundary skips any tracked file it cannot read, not only a missing one, so an unreadable file passes unscanned (phase `prototype`) — never queued until placed
- **publish-lifecycle-drain-followups** — Exit drain follow-ups -- an execute that registers after the drain began is not cancelled; Park/Settle can hang if the controlling test thread panics; run_exclusive removal is not RAII (phase `prototype`) — never queued until placed
- **kernel-composed-ceiling-projected-stream** — The kernel's composed per-stream ceilings do not cover a live projected stream's attribute buffers -- recompose and declare that bound (ADR-010 rule 6) (phase `prototype`) — never queued until placed
- **sitting-part-r-row-r1** — Walkthrough Part R, row R1 -- close the window during a publish, relaunch at once, and check the two processes do not conflict (node 8; the exit-drain ruling's condition (c)) (phase `prototype`) — never queued until placed
- **profile-path-scan-stdin-mode** — The profile-path scanner gains a stdin mode, so a mod can run the scanner's own matcher on content not yet on disk (guardian-v0's G5, left out of v0 by round 43, item 3) (phase `prototype`) — never queued until placed
- **verify-offline-note-test-flake** — scripts/plan/verify.test.mjs's offline-note test failed once on a pull_request run and passed on a re-run; its bare assertion carries no message, so the cause is unknown (phase `prototype`) — never queued until placed
- **slice-budgets-cancel-cells-on-trace-pair** — The docs/08 measurement harness scores its cancellation cells on ADR-018's pair (cancel_requested to the producer's cancel_observed, from the engine trace), with the client-to-adapter interval kept as a reported figure (phase `prototype`) — never queued until placed
- **mp-prime-e2e-covered-fixture** — E2E: MP-1's step MP' opens F-1, which has no covering, so it is predicted to meet the no-covering refusal; a step on F-1c, its covered twin (phase `prototype`) — never queued until placed
- **corpus-natural-earth-line-files** — Natural Earth vector lines, public domain, generated into the compatibility corpus by a project generator, carrying a real-world MultiLineString (8a's OPEN-1 (B)) (phase `prototype`) — never queued until placed
- **lines-class-budget-measurement** — Measure docs/08's Lines class (1M features / 10M vertices) for the working canvas, once lines are drawn (phase `prototype`) — never queued until placed
- **engine-open-neighbour-reads-unbound-to-cancel** — At a dataset open, read_kv_metadata and probe_schema's two statements are not bound to the open's cancel token (phase `prototype`) — never queued until placed
- **stale-lines-outside-the-four-files** — Same-class stale lines outside the docs-lane piece's four files: residencyStatus.test.ts's titles and comments calling ruled strings drafts, residencyArm.test.ts's App-cannot-be-rendered comment, WorkingCanvas.test.ts's no-mount line, and engine/src/identity.rs's two stale line cites into session_identity.rs (phase `prototype`) — never queued until placed
- **app-key-remount-unit-test** — A unit test that pins App's per-dataset key remount of WorkingCanvas: App.layout.test.tsx's stand-in records mounts per dataset prop value, so R1 passes with or without the key (phase `prototype`) — never queued until placed
- **filter-identity-alias-ambiguous-guidance-line-and-note** — A guidance line in the app for skp.filter_identity_alias_ambiguous, in the human's wording at P6, and a KNOWN-LIMITATIONS note: a declared identity beside the file's own id column refuses the first filter on id, and the message does not say what to do (phase `prototype`) — never queued until placed
- **identity-declaration-route-for-session-tier** — The app offers no way to declare an identity column for a file that opened on the session tier (no id column): the declaration form appears only when identity is refused (phase `prototype`) — never queued until placed
- **docs-14-corpus-attribution-vs-docs-08** — docs/14 asks corpus attribution in demos and published bundles, which docs/08 line 40 now says are never redistributed (phase `prototype`) — never queued until placed
- **e2e-first-poll-readout-elsewhere** — Two more e2e suites take a hover id from the readout's first poll after a pointer move: source-changed.mjs hoverAt and residency-harness.mjs tryHoverCandidate (phase `prototype`) — never queued until placed
- **dataset-stream-doc-producer-runs-ahead** — engine/src/stream.rs: Dataset::stream's doc says it returns once the statement is prepared and produces the first batch on the first next_into; the producer thread prepares and runs ahead to the queue bound (phase `prototype`) — never queued until placed
- **shell-native-menus-macos** — Native application menus on macOS, built from the action registry (milestone 3's OPEN-6, deferred) (phase `prototype`) — never queued until placed
- **shell-scale-display** — The scale display in the status bar: a bar of a round length in the CRS's unit, shown only for a metre dataset (milestone 3's OPEN-7, deferred) (phase `prototype`) — never queued until placed
- **shell-migration-milestone-5** — Shell migration, milestone 5 -- conditions, Problems and Jobs: one home for failures and running work (phase `prototype`) — never queued until placed
- **shell-real-app-run-macos-linux** — Run the real app once on macOS and once on Linux after migration milestone 1 merges, and record what it finds (phase `prototype`) — never queued until placed
- **pan-anchor-setcam-waits-for-its-own-reset** — e2e/pan-anchor.mjs: setCam waits for the view-state line its own reset produces, never a late line from the previous gesture (test only) (phase `prototype`) — never queued until placed
- **verify-quotes-dotted-paths** — verify-quotes: the hash-reference path grammar cannot begin with a dot, so a pinned cite into .github/ can never be checked (phase `prototype`) — never queued until placed
- **publish-e2e-filtered-step-shared-run-failure** — The publish e2e suite's FILTERED' step failed once in a shared run: the prompt carried no filter_scope sentence after a filter was applied (at 147ef82c), not reproduced at the next head (phase `prototype`) — never queued until placed
- **shell-resource-dir-dev-comments** — Shell comments on resource_dir under tauri dev read as untrue on Windows: bundled_viewer, resolve_viewer_dir (twice), commands.rs and two resolver tests say a dev run supplies no resource directory (phase `prototype`) — never queued until placed
- **publish-dev-hook-attempt-from-effect** — The export panel's publishExecute dev hook reads the current attempt from a passive effect, so an execute sent as soon as the prepare answers can return unknown-attempt with no host call (the e2e export steps under load) (phase `prototype`) — never queued until placed
- **lod-tiers-geographic-crs** — LOD tiers for a geographic CRS -- its own preregistered gate, owed by the LOD form's amendment (phase `prototype`) — never queued until placed
- **residency-instrument-followups** — Residency instrument follow-ups -- entry 25's heap-footprint fold-in, the deferred 5 GB clean-instrument attribution trial, and the clean-instrument run of the attribution pass (phase `prototype`) — never queued until placed
- **notices-payload-dist-asset** — The raw notice payload, about 3 MB, moves to a fetched dist asset (entry 62) (phase `prototype`) — never queued until placed
- **pre-1-0-trademark-search** — The trademark register search with counsel before 1.0 (the human's own) (phase `prototype`) — never queued until placed
- **record-step-style-match-widening** — record_step admits a style.set match value on fillColor, with the step's dependencies naming the match column and its type (milestone 4's OPEN-4 (A′)): a small data-lane piece, or the first commit of piece 1c's step 1 (phase `prototype`) — never queued until placed
- **governance-e3-module-claude-md** — Piece E3: a small generated CLAUDE.md per product module from the rules whose paths match, if reading 3 confirms on-demand loading (phase `prototype`) — never queued until placed
- **governance-e4-rulebook-into-records** — Piece E4: the rest of AUTONOMY, AI_DEVELOPMENT and PRECEDENTS move into rule records, each rule when it is next touched or cited (phase `prototype`) — never queued until placed
- **governance-rule-inactivity-list** — A weekly inactivity list of rules whose moment shows no occurrence in four weeks, or unknown, built from existing records only (phase `prototype`) — never queued until placed
- **engine-column-name-case-siblings** — Column names that differ only by letter case beyond the covering: the geometry column matched by byte equality while DuckDB binds identifiers case-insensitively, and the identity, projected and filter columns (phase `prototype`) — never queued until placed
- **release-v0-2-0** — v0.2.0 release (pre-release): the hero slice with milestone 4, piece 1c and the redaction scan, v0.1.1 folded in; the human schedules it (phase `prototype`) — never queued until placed
- **questions-mirror-red-line-dotted-lead** — The round-mirror hook's header misses a red-line item whose marker follows a lead holding a full stop (phase `prototype`) — never queued until placed
- **moved-path-mentions-outside-accepted-adrs** — Mentions of the governance paths piece F moved, outside the accepted ADRs: docs/README.md, docs/02, docs/04, docs/14, README.md and the workflow comments (the cloud ADR audit, Task B) (phase `prototype`) — never queued until placed
- **redaction-chance-match-in-partitions** — The redaction scan and chance matches in binary content: a drive path in a printable run of exactly the minimum length, in 256 MiB of parquet (the cloud Linux measurement) (phase `prototype`) — never queued until placed
- **autonomy-stale-status-sentences** — AUTONOMY.md sentences no longer true: the mutation rule called automated, the self-checks called not yet on main, reports to files (the cloud E1 draft, F1, F2 and F6) (phase `prototype`) — never queued until placed
- **module-readme-moved-form-paths** — The preregistration form paths in kernel/README.md and engine/README.md named where piece F moved them (governance/forms/) (phase `prototype`) — never queued until placed
- **skp-spec-and-protocol-comments-drift-sweep-c** — SKP-V0.md live sections and the protocol and shell doc comments brought current to main (drift sweep area C, findings 2 to 11, and area A, finding 3), after 1c (phase `prototype`) — never queued until placed
- **comment-line-cites-kin-docs-audit-c** — Product and e2e comments whose line cites point at moved text: origin.rs on AI_DEVELOPMENT.md, engine/src/error.rs and the admission-remediation e2e script on crs.rs (the docs audits, Task C kin) (phase `prototype`) — never queued until placed

### Unscheduled

- **governance-verify-mutation-header-token** — verify-mutation.mjs -- the RECORDED MUTATION token is accepted anywhere inside the check's fixed window around a test, so a token in a file header or in a neighbouring test's comment greens a test that carries no mutation of its own (phase `prototype`) — ambition, never queued
- **decision-adr-029-scan-progress-route** — ADR-029's scan-progress route, given G1 (a minimal crate patch exposing the connection handle; raw ffi end to end on the scan path; upstream first) -- deferred to Brief B's B2 by the human, round 16 item 3 (phase `prototype`) — ambition, never queued
- **release-v0-1-1** — v0.1.1 release (patch) — the human schedules it; static-CRT declined (69a stands), evidence-archive and SignPath draft ride it (phase `prototype`) — ambition, never queued
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
