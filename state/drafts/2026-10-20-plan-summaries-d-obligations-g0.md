# G0 obligation sheet (scratch, not committed)

Run: rotate-plan-summaries.mjs --dry-run at 2d60ac164e7a65e29e5e55a27eaa202062d31b83 (the branch head S5), origin/main at 81c34c8b28ac030f15ac4ecacdb72ff48aa66483 (M0), PLAN.yaml blob e97957ccd1fbbeb1bc73663b3b769d8d6dc2d1ca.
Candidates: 153. Moved bytes: 405897 (the dry run).
Mechanical pre-classification (NOT the custodian's resolution; every row is the custodian's to resolve, the reviewer checks each home mechanically):
- no obligation marker in the current-state segment (proposed: no obligation): 87
- markers in the current-state segment and at least one mechanical home (a named PLAN node not done, an open DECISIONS-PENDING entry, a present KNOWN-LIMITATIONS item): 28
- markers in the current-state segment and no mechanical home (UNRESOLVED; stays unless the custodian proves not owed / no obligation): 38

## Unresolved rows (the default stays list)

- test-claims-landedness-bound
- governance-test-claims-superseded-scanner
- governance-test-claims-superseded-followups
- adr-023-decision-text
- engine-extension-autoload-off
- governance-verify-mutation-multiline-attrs
- governance-test-claims-withdrawn-marker
- engine-tests-configured-connections
- briefa-p6-part-n-acceptances
- kernel-ticket-drop-under-registry-lock
- kernel-ticket-drop-followups
- crs-unit-fact-and-bounds
- b1-engine-prereg-draft
- shell-dependency-audit-piece
- decision-n8-residual-late-writes
- adr-031-lod-preregistration
- data-plane-stream-registry-bound
- bundle-viewer-partition-offset-bounds
- corpus-reproducibility-record
- catalog-open-drop-reproduction
- governance-weekly-proposals-2026-09-26
- catalog-open-replace-drop-latency-note
- watcher-e5-pin-on-main
- publish-refusal-codes-and-attempt-lifecycle
- skp-cancel-state-closed-set
- suites-and-toolchain-beyond-windows
- watcher-first-read-on-watch-thread
- port-1-linux-l1
- test-claims-same-pr-superseded-pin
- round-mirror-pretooluse-hook
- lead-data-pilot-setup
- subagent-write-audit-script
- guardian-v0
- evidence-recorder-v0
- compaction-record-and-resume-line
- guardian-n1-before-auto-compaction
- source-changed-post-reopen-routes-watcher-visible
- governance-cut-state-cap-and-rotation

## All rows

### self-check-false-readings
- bytes 1004; current-state markers: none; markers in the rest: none
- PLAN nodes named: none; DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### test-claims-landedness-bound
- bytes 1904; current-state markers: held, carried; markers in the rest: none
- PLAN nodes named: governance-test-claims-superseded-followups (done); DECISIONS-PENDING entries: 125 (not open); KNOWN-LIMITATIONS items: none
- proposal: UNRESOLVED: markers in the current-state segment and no mechanical home; custodian: not owed (proof) / no obligation / stays
- current-state segment (first 500 chars): STOPPED 2026-09-24 before code: every candidate makes P3b's three held planned claims binding, against the human's round-16 item-4 hold (DECISIONS-PENDING.md entry 125). Night program 2026-09-24 (state/directives/2026-09-24-night-program.md), item 5: placed and approved by the human; a light-lane fix to a tool that can silently skip tests, not new policy. Recorded before merge as the architect required: nothing forces a non-done node forward, so a piece could merge, its node stay in-progress, it

### governance-test-claims-superseded-scanner
- bytes 733; current-state markers: next; markers in the rest: none
- PLAN nodes named: test-claims-landedness-bound (done), briefa-p3b-owner-side-invalidation (done), governance-verify-mutation-multiline-attrs (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: UNRESOLVED: markers in the current-state segment and no mechanical home; custodian: not owed (proof) / no obligation / stays
- current-state segment (first 500 chars): RULED 2026-09-24, question round 19, item 2: the round-16 hold is lifted; placed next in the governance lane, one round under a fresh count and the record cap. This round (attempt-2 corrections; state/gate-log.json this node's attempt-2 records): reviewer attempt-2's four blockers and architect attempt-2's two residual items closed, per this node's gate file's own append-only Amendments. test-claims-landedness-bound follows it (RULED 2026-09-24, question round 17, item 8); when it lands, briefa-

### governance-test-claims-superseded-followups
- bytes 1983; current-state markers: deferred; markers in the rest: none
- PLAN nodes named: none; DECISIONS-PENDING entries: 133 (not open); KNOWN-LIMITATIONS items: none
- proposal: UNRESOLVED: markers in the current-state segment and no mechanical home; custodian: not owed (proof) / no obligation / stays
- current-state segment (first 500 chars): Deferred at PR #117's landing under the architect's scope ruling (state/gate-log.json indices 86, 87, 171 and 172 name every item): code -- the wide-span residual (the claim's own historical line must carry the name), memoize isAncestorOfMain, COMMIT_ID_RE rejecting a hex-named ref; wording -- adopted-from for byte-copied-from (the module header and the README boundary lead-in), the README forgery clause (a pin proves age and identity, not disappearance), the quote-by-reference quotation, the st

### adr-023-decision-text
- bytes 308; current-state markers: until, next, carried; markers in the rest: none
- PLAN nodes named: none; DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: UNRESOLVED: markers in the current-state segment and no mechanical home; custodian: not owed (proof) / no obligation / stays
- current-state segment (first 500 chars): RULED 2026-09-14 (question set D, D2): Float32 admitted as its own Arrow type; dictionary-encoded columns decoded to their value type; dates the declared next admission; four ADR-004 conflicts carried as B1 conditions; Status Proposed until B1 close; the PR is the human click (ADR files are never docs-only)

### briefa-p3-p6
- bytes 888; current-state markers: none; markers in the rest: none
- PLAN nodes named: none; DECISIONS-PENDING entries: 110 (open), 96 (not open); KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### b1-engine-kernel-half
- bytes 2040; current-state markers: waits, until, later; markers in the rest: none
- PLAN nodes named: b1-engine-prereg-draft (done), shell-redesign-map-studio (proposed), engine-source-change-watcher (done); DECISIONS-PENDING entries: 110 (open), 79 (not open), 123 (not open); KNOWN-LIMITATIONS items: none
- proposal: home: plan shell-redesign-map-studio (proposed) | home: decisions-pending entry 110
- current-state segment (first 500 chars): DONE 2026-09-27 at PR #134 (merged d6ec85a; gate 3 PASS both at c9ec02e; the architect's reduction Amendment 10). Its code waits on the human's sight of b1-engine-prereg-draft (Night program 2026-09-24 (state/directives/2026-09-24-night-program.md), item 7). Shell direction item (b), RULED 2026-09-23 (late): this engine/kernel half proceeds as sequenced; B1's shell half (hover attributes, categorical style UI) waits for the new shell structure (shell-redesign-map-studio). FIRST after Brief A clo

### adr-021-023-b1-notes
- bytes 317; current-state markers: none; markers in the rest: none
- PLAN nodes named: none; DECISIONS-PENDING entries: 123 (not open); KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### entry-90-static-crt-v0-1-1
- bytes 357; current-state markers: none; markers in the rest: none
- PLAN nodes named: none; DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### engine-extension-autoload-off
- bytes 496; current-state markers: open; markers in the rest: none
- PLAN nodes named: none; DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: UNRESOLVED: markers in the current-state segment and no mechanical home; custodian: not owed (proof) / no obligation / stays
- current-state segment (first 500 chars): RULED 2026-09-15 (question round 2, item 2): autoinstall_known_extensions=false and autoload_known_extensions=false at every engine connection open (the pool's CONFIGURE_SQL site and layout.rs's direct open, one shared statement), asserted fail-closed on every lease class; full two-agent gate despite size (the no-runtime-fetch property ADR-021 records); that ADR's amendment appended in the same PR for the human's click. Preregistered before code (engine/EXTENSION-AUTOLOAD-PREREGISTRATION.md)

### lod-tier-builder-route-b
- bytes 886; current-state markers: waits, until; markers in the rest: none
- PLAN nodes named: lod-tier-selection (proposed), lod-tier-cache-lifecycle (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: home: plan lod-tier-selection (proposed)
- current-state segment (first 500 chars): DONE 2026-09-18 at PR #84 (the click, full gating; status reconciled 2026-09-20 -- the node had stayed in-progress after its merge). Merged implementation only: no product path calls build_tiers until lod-tier-selection lands, which waits on the lifecycle ruling (lod-tier-cache-lifecycle); no perf claim was made. RULED 2026-09-16 (question round 3, items 1-2): the preregistration accepted with two class-5 amendments (sidecar tiers in the app-local cache, never beside the source without the user'

### lod-tier-cache-lifecycle
- bytes 1367; current-state markers: owed, until, deferred; markers in the rest: none
- PLAN nodes named: lod-tier-selection (proposed); DECISIONS-PENDING entries: 99 (not open); KNOWN-LIMITATIONS items: none
- proposal: home: plan lod-tier-selection (proposed)
- current-state segment (first 500 chars): RULED 2026-09-20: the lifecycle direction (a ceiling relative to free disk at its own site; delete-on-supersede, LRU only as fallback; the prepare machinery as runner with the operation lifecycle as scheduler, background priority, the prepare token as cancellation owner; tier count/size/state in describe and the status stack) -- its ADR-031 text rides lod-tier-selection's preregistration. Earlier: RULED 2026-09-20 (the sitting-day message, verbatim in DECISIONS-PENDING.md): a total cache ceiling

### governance-verify-quotes
- bytes 747; current-state markers: none; markers in the rest: none
- PLAN nodes named: none; DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### governance-verify-mutation-multiline-attrs
- bytes 1804; current-state markers: pending, until; markers in the rest: none
- PLAN nodes named: governance-test-claims-withdrawn-marker (done); DECISIONS-PENDING entries: 127 (not open), 131 (not open), 133 (not open), 134 (not open); KNOWN-LIMITATIONS items: none
- proposal: UNRESOLVED: markers in the current-state segment and no mechanical home; custodian: not owed (proof) / no obligation / stays
- current-state segment (first 500 chars): STOPPED 2026-09-24 under Rule 7 after two Correctness FAILs (DECISIONS-PENDING.md entry 127; PR #108): continue narrowed / drop is the human's. Night program 2026-09-24 (state/directives/2026-09-24-night-program.md), item 5: placed and approved by the human; a light-lane fix to a tool that can silently skip tests, not new policy. Reported by the reviewer's scoped re-read of engine/lod-tier-builder @ 43a3039 (gate-log record 52): scripts/plan/verify-mutation.mjs lines ~96-97 set pending = false o

### governance-test-claims-withdrawn-marker
- bytes 1067; current-state markers: still; markers in the rest: none
- PLAN nodes named: governance-verify-mutation-multiline-attrs (done); DECISIONS-PENDING entries: 134 (not open); KNOWN-LIMITATIONS items: none
- proposal: UNRESOLVED: markers in the current-state segment and no mechanical home; custodian: not owed (proof) / no obligation / stays
- current-state segment (first 500 chars): RULED 2026-09-24, question round 20, item 1 (entry 134): one round, fully gated, after PR #117 lands. The same hash-pinned row at a main commit as superseded, with no replacement required, under the human's two riders as its own requirements (the RULED block states them verbatim): (a) the ruling a withdrawn row names must resolve to a RULED block that names the removal, else verify fails the citation by name; (b) a withdrawn test that a gate, acceptance or preregistered claim still relies on mus

### governance-record-round-count
- bytes 813; current-state markers: none; markers in the rest: none
- PLAN nodes named: none; DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### governance-verify-gate-file-exists
- bytes 649; current-state markers: none; markers in the rest: none
- PLAN nodes named: governance-record-round-count (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### engine-tests-configured-connections
- bytes 739; current-state markers: open; markers in the rest: none
- PLAN nodes named: none; DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: UNRESOLVED: markers in the current-state segment and no mechanical home; custodian: not owed (proof) / no obligation / stays
- current-state segment (first 500 chars): Night program 2026-09-24 (state/directives/2026-09-24-night-program.md), item 5: placed and approved by the human; a light-lane fix to a tool that can silently skip tests, not new policy. Proposed from the autoload reviewer's finding 3 (2026-09-16): first_batch_and_pruning.rs (6 sites), import_layout_5gb_fixtures.rs, import_layout_fixtures.rs (2), publish_stream.rs open raw DuckDB connections with the compiled autoload/autoinstall defaults ON; a future integration test naming a non-built-in exte

### briefa-p3b-owner-side-invalidation
- bytes 1968; current-state markers: waits, held, until, next, queued; markers in the rest: none
- PLAN nodes named: briefa-p3b-test-names (done), briefa-p3-p6 (done); DECISIONS-PENDING entries: 110 (open), 96 (not open); KNOWN-LIMITATIONS items: none
- proposal: home: decisions-pending entry 110
- current-state segment (first 500 chars): HELD in-progress by the human (round 16, item 4, 2026-09-18): after briefa-p3b-test-names (PR #90) lands, three historical mentions of an old test name in this record stay reported by verify-test-claims as planned (advisory under the not-done rule) until the superseded-name scanner (governance/test-claims-superseded @ 3100766, STOPPED under Rule 7) is scheduled at the weekly window, 2026-09-25 at the earliest. Earlier: LANDED 2026-09-18 at PR #86 (entry 110); done is held by verify:test-claims: 

### briefa-p4-corpus-run
- bytes 1054; current-state markers: next; markers in the rest: none
- PLAN nodes named: none; DECISIONS-PENDING entries: 113 (not open), 110 (open); KNOWN-LIMITATIONS items: none
- proposal: home: decisions-pending entry 110
- current-state segment (first 500 chars): DONE 2026-09-19 at PR #95 (the click; attempt 3 reviewer PASS, record 101; the architect's reduction Amendment 20; row 8's verdict label to the next regeneration). Reviewer attempt 1 FAIL 2026-09-18 (gate-log 89; entry 113): the corpus result reproduced end to end, four blockers of record form and gate mechanism only; one correction round (the record re-appended whole under the unmerged-append revert, the runner's #[test] placement, the should-fixes batched), then both gates at attempt 2 -- the 

### briefa-p5-gate-tests
- bytes 476; current-state markers: none; markers in the rest: none
- PLAN nodes named: none; DECISIONS-PENDING entries: 110 (open); KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### briefa-p6-part-n-acceptances
- bytes 593; current-state markers: owed, waits, next; markers in the rest: none
- PLAN nodes named: none; DECISIONS-PENDING entries: 120 (not open); KNOWN-LIMITATIONS items: none
- proposal: UNRESOLVED: markers in the current-state segment and no mechanical home; custodian: not owed (proof) / no obligation / stays
- current-state segment (first 500 chars): DONE 2026-09-23: Part N operator-verified (G-A7) -- run 1 (2026-09-20: N1-N7 PASS, N9 as given), the N8 retest (7301dc6) and the N1 re-sight with the N8 rerun on the merged build (8704535), each recorded verbatim in Part N's run section; the admission preregistration's Amendment 21 references them. The five acceptances follow as one appending PR for the click (the accept nodes). The KNOWN-LIMITATIONS rows (N9's five) are owed to the next release revising that file; items 17-18 were added on 2026

### briefa-p6-describe-fields
- bytes 546; current-state markers: none; markers in the rest: none
- PLAN nodes named: briefa-p6-part-n-acceptances (done); DECISIONS-PENDING entries: 112 (not open), 113 (not open); KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### accept-adr-015-a1
- bytes 369; current-state markers: queued; markers in the rest: none
- PLAN nodes named: none; DECISIONS-PENDING entries: 119 (not open), 110 (open); KNOWN-LIMITATIONS items: none
- proposal: home: decisions-pending entry 110
- current-state segment (first 500 chars): DONE 2026-09-24 at PR #103 (the click, b0032c8), one PR for all five acceptances. RULED 2026-09-23 (late), entry 119 item (1): accepted as it stands; appended in the one PR with the other four. A red line: accepted ADR text changes only by the human's click; queued for P6 on the human's word of 2026-09-18 (entry 110); the proposed text is in docs/adr/ marked Proposed

### accept-adr-016-a1
- bytes 760; current-state markers: owed, queued; markers in the rest: none
- PLAN nodes named: none; DECISIONS-PENDING entries: 119 (not open), 110 (open); KNOWN-LIMITATIONS items: none
- proposal: home: decisions-pending entry 110
- current-state segment (first 500 chars): The watcher sight of 2026-09-24 corrects the owed display's carrier: the watcher's checks fact on describe (full | degraded{components}), independent of its coverage fact; PR #103's acceptance note is aligned. DONE 2026-09-24 at PR #103 (the click, b0032c8), one PR for all five acceptances. RULED 2026-09-23 (late), entry 119 item (3): accepted with a dated acceptance note naming item 2's degradation display as owed, delivered by the watcher piece's detection-state field on describe; in the one P

### accept-adr-013-instance
- bytes 481; current-state markers: owed, queued, later; markers in the rest: none
- PLAN nodes named: crs-unit-fact-and-bounds (done), adr-013-display-statement (done); DECISIONS-PENDING entries: 120 (not open), 119 (not open), 110 (open); KNOWN-LIMITATIONS items: none
- proposal: home: decisions-pending entry 110
- current-state segment (first 500 chars): DONE 2026-09-24 at PR #103 (the click, b0032c8), one PR for all five acceptances. RULED 2026-09-23 (later), entry 120 (1): with a dated acceptance note naming item 6 (unit-aware bounds) as owed, scheduled as crs-unit-fact-and-bounds. RULED 2026-09-23 (late), entry 119 item (5): accepted once item 5 is true of the build -- after adr-013-display-statement and N1's re-sight; in the one PR with the other four. A red line; queued for P6 on the human's word of 2026-09-18 (entry 110)

### accept-adr-028-qualification
- bytes 317; current-state markers: queued; markers in the rest: none
- PLAN nodes named: none; DECISIONS-PENDING entries: 119 (not open), 110 (open); KNOWN-LIMITATIONS items: none
- proposal: home: decisions-pending entry 110
- current-state segment (first 500 chars): DONE 2026-09-24 at PR #103 (the click, b0032c8), one PR for all five acceptances. RULED 2026-09-23 (late), entry 119 item (4): after the short N8 rerun on the merged build, in the same sitting as N1's re-sight; in the one PR with the other four. A red line; queued for P6 on the human's word of 2026-09-18 (entry 110)

### accept-adr-032
- bytes 330; current-state markers: queued; markers in the rest: none
- PLAN nodes named: none; DECISIONS-PENDING entries: 119 (not open), 110 (open); KNOWN-LIMITATIONS items: none
- proposal: home: decisions-pending entry 110
- current-state segment (first 500 chars): DONE 2026-09-24 at PR #103 (the click, b0032c8), one PR for all five acceptances. RULED 2026-09-23 (late), entry 119 item (2): accepted as it stands; its Status line changes in the one PR with the other four. A red line; queued for P6 on the human's word of 2026-09-18 (entry 110); its accepting draft was prepared at Brief A's P0

### drill-clean-clone
- bytes 516; current-state markers: held; markers in the rest: none
- PLAN nodes named: none; DECISIONS-PENDING entries: 115 (open); KNOWN-LIMITATIONS items: none
- proposal: home: decisions-pending entry 115
- current-state segment (first 500 chars): DONE 2026-09-19 at PR #96 (docs-only, merged under delegation; kernel/RESULTS.md's dated section; the four findings are entry 115). The drill: a clean-directory clone, fixtures regenerated from kernel/FIXTURES.md, the full suite, a release build; the result recorded. Machine/disk-sequenced AFTER the sitting (2026-09-14): target/debug is held for the sitting launch, then deleted to re-fund the drill (the debug cache is regenerable, the human 2026-09-14). One heavy run at a time (the quiet-machine

### lod-route-b-divergence
- bytes 372; current-state markers: none; markers in the rest: none
- PLAN nodes named: none; DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### geometry-types-beyond-polygons
- bytes 4996; current-state markers: none; markers in the rest: waits, next, open
- PLAN nodes named: geometry-points-cut (done), b1-shell-half (proposed), geometry-types-beyond-polygons (done), geometry-lines-cut (done); DECISIONS-PENDING entries: 126 (not open); KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### adr-029-g1-feasibility
- bytes 1238; current-state markers: deferred, open; markers in the rest: none
- PLAN nodes named: decision-adr-029-scan-progress-route (unscheduled); DECISIONS-PENDING entries: 111 (open); KNOWN-LIMITATIONS items: none
- proposal: home: plan decision-adr-029-scan-progress-route (unscheduled) | home: decisions-pending entry 111
- current-state segment (first 500 chars): DONE 2026-09-19 at PR #92 (the click; the architect's reduced README, round 16 item 2). PR #92 open for the click (2026-09-18): the architect's reduced README applied byte-exact at 2bc9756 (sha256 c1c6f705 over 273 lines). RULED 2026-09-18 (round 16, item 2): read 2 FAIL, STOPPED under Rule 7 (gate-log 80, 86) -- the architect reduces the README to the facts read 2 verified clean and the spike lands with the reduced record by a PR for the click; done on merge. What G1 established (entry 111): a 

### decision-generated-outputs-merge-strategy
- bytes 820; current-state markers: until, deferred; markers in the rest: none
- PLAN nodes named: governance-ci-built-site (proposed); DECISIONS-PENDING entries: 114 (not open); KNOWN-LIMITATIONS items: none
- proposal: home: plan governance-ci-built-site (proposed)
- current-state segment (first 500 chars): RULED 2026-09-22: the current regeneration procedure stays for this cut; the CI-built site is deferred to the bounded governance node governance-ci-built-site, whose design also addresses tracked-queue conflicts. Earlier: The custodian's reading is DECISIONS-PENDING.md entry 114: (A) the standing mechanic alone (regenerate on merge, now AUTONOMY section 2); (B) a .gitattributes merge driver -- insufficient, GitHub's merge ignores custom drivers; (C) site/index.html and site/data/plan.json built 

### decision-shell-dependency-audit-2026-09-19
- bytes 855; current-state markers: none; markers in the rest: none
- PLAN nodes named: shell-dependency-audit-piece (done); DECISIONS-PENDING entries: 116 (not open); KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### governance-audit-npm-trees
- bytes 532; current-state markers: none; markers in the rest: none
- PLAN nodes named: none; DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### briefa-p6-n8-reopen-reset
- bytes 417; current-state markers: none; markers in the rest: none
- PLAN nodes named: briefa-p6-part-n-acceptances (done); DECISIONS-PENDING entries: 119 (not open); KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### adr-013-display-statement
- bytes 467; current-state markers: none; markers in the rest: none
- PLAN nodes named: briefa-p6-part-n-acceptances (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### kernel-ticket-drop-under-registry-lock
- bytes 1028; current-state markers: pending; markers in the rest: none
- PLAN nodes named: engine-source-change-watcher (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: UNRESOLVED: markers in the current-state segment and no mechanical home; custodian: not owed (proof) / no obligation / stays
- current-state segment (first 500 chars): Found by PR #114's architect gate, fresh-count attempt 2 (state/gate-log.json, node engine-source-change-watcher), and confirmed by the custodian's reading of kernel/src/skp.rs: StreamRegistry::cancel, cancel_all_for_dataset and sweep_locked replace or remove a Pending TicketState (whose PendingBuilt owns the EngineSource) under the registry lock; EngineSource's Drop calls end_session_if_source_changed, which calls SessionInvalidator::end_generation, which calls StreamRegistry::cancel on the sam

### kernel-ticket-drop-followups
- bytes 2644; current-state markers: held, deferred, open; markers in the rest: none
- PLAN nodes named: publish-attempt-lifecycle-src-tauri (done), lead-data-pilot-setup (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: UNRESOLVED: markers in the current-state segment and no mechanical home; custodian: not owed (proof) / no obligation / stays
- current-state segment (first 500 chars): Deferred at PR #116's landing (state/gate-log.json indices 173 and 174 and the architect's attempt-3 re-read, index 176): state the invariant over any value owning an EngineSource (mint's refused source too) and declare swept/retired before the guard is taken so an unwind drops them after it; a debug_assert that mint's and redeem's insert returns None, with prev kept alive past drop(tickets) so a firing assert cannot drop under the guard; the invariant's enumeration naming redeem's remove (the a

### crs-unit-fact-and-bounds
- bytes 1639; current-state markers: next, later, carried, still; markers in the rest: none
- PLAN nodes named: b1-engine-kernel-half (done); DECISIONS-PENDING entries: 120 (not open), 128 (not open); KNOWN-LIMITATIONS items: none
- proposal: UNRESOLVED: markers in the current-state segment and no mechanical home; custodian: not owed (proof) / no obligation / stays
- current-state segment (first 500 chars): Night program 2026-09-24 (state/directives/2026-09-24-night-program.md), item 4: P0's arithmetic bound first, then the preregistration, the implementation and both gates on a branch, taking the next SKP literal. If P0 shows a visible defect, record it and continue. If any choice goes beyond the ruled scope, stop this piece and move on. Merge order: after PR #103; before B1. PLACED 2026-09-23 by the human (RULED 2026-09-23 (later), entry 120 item (1)(b)-(c); state/directives/2026-09-23-entry-120.

### known-limitations-owed-rows
- bytes 565; current-state markers: none; markers in the rest: none
- PLAN nodes named: none; DECISIONS-PENDING entries: 120 (not open); KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### b1-engine-prereg-draft
- bytes 593; current-state markers: open; markers in the rest: none
- PLAN nodes named: crs-unit-fact-and-bounds (done); DECISIONS-PENDING entries: 120 (not open); KNOWN-LIMITATIONS items: none
- proposal: UNRESOLVED: markers in the current-state segment and no mechanical home; custodian: not owed (proof) / no obligation / stays
- current-state segment (first 500 chars): Night program 2026-09-24 (state/directives/2026-09-24-night-program.md), item 7: the preregistration and the architect consult only, on a branch; no code. B1 follows crs-unit-fact-and-bounds on the wire (entry 120); the watcher's describe fields also take the literal after crs-unit (RULED 2026-09-24, the watcher sight), and RULED 2026-09-24 (night) item (2) fixes the order: the watcher takes the literal after crs-unit-fact-and-bounds and B1 the one after the watcher's, which the draft states rat

### multipolygon-assessment-consult
- bytes 303; current-state markers: none; markers in the rest: none
- PLAN nodes named: geometry-types-beyond-polygons (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### shell-dependency-audit-piece
- bytes 640; current-state markers: later; markers in the rest: none
- PLAN nodes named: crs-unit-fact-and-bounds (done); DECISIONS-PENDING entries: 120 (not open); KNOWN-LIMITATIONS items: none
- proposal: UNRESOLVED: markers in the current-state segment and no mechanical home; custodian: not owed (proof) / no obligation / stays
- current-state segment (first 500 chars): Night program 2026-09-24 (state/directives/2026-09-24-night-program.md), item 2: the full gate on its branch, as ruled. Merge order, not work order: after PR #103 (the acceptances); the click when gated and green. The earlier custodian reading that put crs-unit-fact-and-bounds ahead of it is superseded by the program's order. RULED 2026-09-23 (later), entry 120 (1)(b): the unit-fact piece is first after the acceptance PR (the custodian's reading; the human may re-place it). After the sitting and

### drill-fix-fixture-watchdog
- bytes 341; current-state markers: none; markers in the rest: none
- PLAN nodes named: fixture-regeneration-entry-point (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### fixture-regeneration-entry-point
- bytes 401; current-state markers: none; markers in the rest: none
- PLAN nodes named: none; DECISIONS-PENDING entries: 121 (not open); KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### decision-n8-residual-late-writes
- bytes 593; current-state markers: follow-up; markers in the rest: none
- PLAN nodes named: none; DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: UNRESOLVED: markers in the current-state segment and no mechanical home; custodian: not owed (proof) / no obligation / stays
- current-state segment (first 500 chars): RULED 2026-09-23: fix the old filter Apply contamination and the three named baseline callbacks before the final N8 retest, a bounded correction under the existing gates. Earlier: Found by the N8 late-result gates (records 111-112), pre-existing and outside PR #100's declared Change; the window is the interval between the new admission and the old stream's cleanup. The custodian's reading: a bounded follow-up piece with the same handle guard on the Apply path and the three baseline callbacks, af

### adr-031-lod-preregistration
- bytes 359; current-state markers: open; markers in the rest: none
- PLAN nodes named: none; DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: UNRESOLVED: markers in the current-state segment and no mechanical home; custodian: not owed (proof) / no obligation / stays
- current-state segment (first 500 chars): RULED 2026-09-14 (question set C, C3): route B divergence explained first; route A admissible only if the spatial extension bundles statically with no runtime fetch (ADR-021); then the architect drafts the preregistration with the five open questions pre-committed for the human sight (a sight node when the draft exists); no dependency approved by the ruling

### briefa-p3b-test-names
- bytes 315; current-state markers: none; markers in the rest: none
- PLAN nodes named: none; DECISIONS-PENDING entries: 110 (open); KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### engine-source-change-watcher
- bytes 4747; current-state markers: owed, waits, held, until, later, open; markers in the rest: none
- PLAN nodes named: crs-unit-fact-and-bounds (done), shell-redesign-map-studio (proposed); DECISIONS-PENDING entries: 122 (not open), 119 (not open), 129 (not open), 132 (not open); KNOWN-LIMITATIONS items: none
- proposal: home: plan shell-redesign-map-studio (proposed)
- current-state segment (first 500 chars): STOPPED 2026-09-24 at two stop-list items beyond the brief and the seven additions (DECISIONS-PENDING.md entry 122: S1 the idle push path does not exist; S2 a watched-directory rename needs a grandparent watch); the preregistration is filed uncommitted-as-gate at state/consults/2026-09-24-source-change-watcher.md. SIGHTED 2026-09-24 by the human (RULED 2026-09-24, the watcher sight; state/directives/2026-09-24-watcher-sight.md): the brief is accepted as the record of the settled direction, with 

### decision-prepare-managed-selection-default
- bytes 397; current-state markers: carried; markers in the rest: none
- PLAN nodes named: briefb-b2-save-reopen (blocked); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: home: plan briefb-b2-save-reopen (blocked)
- current-state segment (first 500 chars): RULED 2026-09-22: explicit operator intent selects prepared data; an eligible immutable revision is reused without recopying; a mutable preview is never silently rebound -- carried by briefb-b2-save-reopen's preregistration. Earlier: Owner: briefb-b2-save-reopen -- decided at B2's preregistration sight (state/drafts/post-tag/DRAFT-3-BRIEF-B-recipe-replay-publish.md's Save vs Prepare amendment).

### geometry-points-cut
- bytes 3117; current-state markers: owed, queued, still; markers in the rest: next, open
- PLAN nodes named: mp-prime-e2e-covered-fixture (proposed), geometry-points-cut (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: home: plan mp-prime-e2e-covered-fixture (proposed)
- current-state segment (first 500 chars): DONE 2026-10-07: #185 merged at 04:12:28Z as 37b42002; closing record Amendment 5 (generation 6); MP prime on F-1 routed to the proposed node mp-prime-e2e-covered-fixture; Part P and PT prime unrun, queued with MP-1 Part S; the noticeDeterminism re-run alone under an exclusive hold still owed.

### geometry-lines-cut
- bytes 1829; current-state markers: queued; markers in the rest: next
- PLAN nodes named: geometry-lines-cut (done), shell-owners-index (proposed), corpus-line-files (proposed); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: home: plan shell-owners-index (proposed) | home: plan corpus-line-files (proposed)
- current-state segment (first 500 chars): DONE 2026-10-07: #188 merged at 22:19:35Z as e888787e; closing record Amendment 4 (generation 5; class 8 for engine product 1,220 against 950 and engine tests 960 against 900); Part T and LN prime queued for the sitting.

### kernel-generation-close-races
- bytes 1279; current-state markers: none; markers in the rest: none
- PLAN nodes named: none; DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### governance-stop-hook-lease
- bytes 754; current-state markers: none; markers in the rest: none
- PLAN nodes named: governance-stop-hook-lease (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### data-plane-origin-non-ascii
- bytes 390; current-state markers: none; markers in the rest: none
- PLAN nodes named: none; DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### data-plane-stream-registry-bound
- bytes 551; current-state markers: open; markers in the rest: none
- PLAN nodes named: data-plane-origin-non-ascii (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: UNRESOLVED: markers in the current-state segment and no mechanical home; custodian: not owed (proof) / no obligation / stays
- current-state segment (first 500 chars): DONE 2026-09-27 at PR #130 (merged 0c0b680; gate attempt 2, PASS both at a4aa7f3). RULED 2026-09-26, question round 24, item 1: an S1 cut; follows data-plane-origin-non-ascii; fixed with a time bound plus a declared count ceiling, mirroring the kernel's registry; an entry is not dropped at its terminal, since that would break answering a late cancel. Evidence: state/cloud/wave1/A5.md, Finding A5-1, reproduced on Windows. 2026-09-26: preregistration 8dbaec5; attempt 2 (record round) PASS, both ga

### bundle-viewer-partition-offset-bounds
- bytes 491; current-state markers: open; markers in the rest: none
- PLAN nodes named: none; DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: UNRESOLVED: markers in the current-state segment and no mechanical home; custodian: not owed (proof) / no obligation / stays
- current-state segment (first 500 chars): RULED 2026-09-26, question round 24, item 1: an S1 cut; independent of the other two; carries a KNOWN-LIMITATIONS line for bundles already published. A3 3(a)'s S2, the wrong failure state, rides along. Evidence: state/cloud/wave1/A3.md, its triage update, reproduced on Windows. 2026-09-26: attempt 2 (record round) PASS, both gates at 64ceb79; PR #128 open for the human's click and wording sight (round 25 item 4), to merge after #127, which gives its KNOWN-LIMITATIONS item the number 29.

### corpus-reproducibility-record
- bytes 921; current-state markers: held, open; markers in the rest: none
- PLAN nodes named: none; DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: UNRESOLVED: markers in the current-state segment and no mechanical home; custodian: not owed (proof) / no obligation / stays
- current-state segment (first 500 chars): DONE 2026-09-27 at PR #132 (merged 0d80c70; the scoped read, reviewer PASS at 43e6d04; C8 re-run at each pushed head). RULED 2026-09-26, question round 24, item 3: PR #124 is held. This piece tracks the corpus's generator scripts, exact commands and full hashes from the local corpus of record, with no data, whatever the licence outcome. Licences are researched at primary sources; the table goes to the human before any merge; a file without an identifiable open licence stays local-only, listed by

### catalog-open-drop-reproduction
- bytes 662; current-state markers: open; markers in the rest: none
- PLAN nodes named: catalog-open-replace-drop-latency-note (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: UNRESOLVED: markers in the current-state segment and no mechanical home; custodian: not owed (proof) / no obligation / stays
- current-state segment (first 500 chars): RULED 2026-09-26, question round 25, item 1, (d) promoted: reproduction first, before the other five. Catalog::open drops a replaced dataset while holding the catalog write lock. The reproduction determines whether any Drop reached from it can block or reacquire the catalog lock (the #116 pattern). If it can: S1, a cut with #116's fix shape (drop after the guard is released). If it cannot: S2, a latency note, filed like the rest. Evidence so far: state/questions/round-25.md item 1 (d); state/clo

### timing-tests-assert-property-not-budget
- bytes 1291; current-state markers: none; markers in the rest: none
- PLAN nodes named: catalog-open-drop-reproduction (done), watch-grandparent-spawn-signal (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### governance-weekly-proposals-2026-09-26
- bytes 610; current-state markers: next, still, open; markers in the rest: none
- PLAN nodes named: none; DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: UNRESOLVED: markers in the current-state segment and no mechanical home; custodian: not owed (proof) / no obligation / stays
- current-state segment (first 500 chars): DONE 2026-09-27 at PR #129 (merged 16df0d7; gate attempt 3, reviewer PASS). RULED 2026-09-26, question round 25, item 2: all five proposals of state/questions/round-25.md item 2, (a) to (e), adopted as one governance docs piece, gated as usual. (b)'s gate reports each name the commit they reviewed, so their advisory cites still resolve against something fixed. This batch is this week's allowance under the record cap (state/directives/2026-09-18-record-cap.md); the next falls due 2026-10-02. 2026

### catalog-open-replace-drop-latency-note
- bytes 2130; current-state markers: waits, waiting, open; markers in the rest: none
- PLAN nodes named: kernel-close-dataset-unknown-keeps-openrecord (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: UNRESOLVED: markers in the current-state segment and no mechanical home; custodian: not owed (proof) / no obligation / stays
- current-state segment (first 500 chars): RULED 2026-09-26, question round 25, item 1 (d): S2 on the reproduction's outcome (state/consults/2026-09-26-catalog-open-drop-reproduction.md). No Drop reached from the replaced dataset acquires, or waits on a thread waiting for, the catalog lock. The replaced dataset's DuckDB teardown does run under the write guard: the replaced value is a temporary dropped before the guard (the report's probe (a)). No product path replaces a dataset today: SKP opens under a fresh handle and slice-host opens o

### watcher-e5-pin-on-main
- bytes 514; current-state markers: until, next; markers in the rest: none
- PLAN nodes named: none; DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: UNRESOLVED: markers in the current-state segment and no mechanical home; custodian: not owed (proof) / no obligation / stays
- current-state segment (first 500 chars): Residual of engine/SOURCE-WATCHER-PREREGISTRATION.md's Amendment 6, row 13 (on the watcher branch until it merges). Once the watcher merges by a merge commit that keeps 4137f4d reachable (no squash), the E5 pin is appended on main as that preregistration's next amendment: lines 2626-2644 of kernel/src/skp.rs at 4137f4d, sha256 c0483b8ed3ec3e47424345548e458b484d44a2aba310a3470f6b7a9d7ffac31a (round 15 (e): hash pins only at main commits). The architect's gate-3 condition: the queue carries it bef

### data-plane-crowded-start-detail-spaces
- bytes 2221; current-state markers: none; markers in the rest: open
- PLAN nodes named: wire-bytes-invariant-trace-flag-race (done), data-plane-crowded-start-detail-spaces (done), kernel-close-races-followups (done), data-plane-stream-registry-bound (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### exposure-profile-paths
- bytes 484; current-state markers: none; markers in the rest: none
- PLAN nodes named: none; DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### exposure-post-merge-pins
- bytes 363; current-state markers: none; markers in the rest: none
- PLAN nodes named: none; DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### kernel-ticket-liveness-redeem-wording
- bytes 1216; current-state markers: none; markers in the rest: none
- PLAN nodes named: kernel-generation-close-races (done), engine-cancel-before-stream-window (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### watch-grandparent-spawn-signal
- bytes 444; current-state markers: none; markers in the rest: none
- PLAN nodes named: kernel-generation-close-races (done), type-walk-null-literal-arithmetic (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### b1-engine-kernel-half-followups
- bytes 2240; current-state markers: none; markers in the rest: none
- PLAN nodes named: b1-engine-kernel-half-followups (done), kernel-close-races-followups (done), timing-assertions-under-contention (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### timing-assertions-under-contention
- bytes 1561; current-state markers: none; markers in the rest: none
- PLAN nodes named: timing-tests-assert-property-not-budget (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### publish-refusal-codes-and-attempt-lifecycle
- bytes 3608; current-state markers: held, until, still; markers in the rest: none
- PLAN nodes named: publish-attempt-lifecycle-src-tauri (done), kernel-ticket-liveness-redeem-wording (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: UNRESOLVED: markers in the current-state segment and no mechanical home; custodian: not owed (proof) / no obligation / stays
- current-state segment (first 500 chars): Wave-1 S2 record (state/cloud/wave1-prompts.md, the S2 rule: real but bounded, recorded as a PLAN note); still present at main when triaged. A4-1 to A4-4: a refusal's code is lost on the publish execute path, collapsed to publish.engine, absent at the pin phase, and unprefixed on the raw-params admission path (state/cloud/wave1/A4.md). A1 observation 1: RunningPublishes keyed by a caller-supplied attempt id, so a second execute replaces the running publish's cancel token. A1 observation 2 (also 

### publish-attempt-lifecycle-src-tauri
- bytes 1780; current-state markers: held, queued, open; markers in the rest: none
- PLAN nodes named: publish-refusal-codes-and-attempt-lifecycle (done), skp-cancel-state-closed-set (done), sitting-part-r-row-r1 (proposed); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: home: plan sitting-part-r-row-r1 (proposed)
- current-state segment (first 500 chars): Split out of publish-refusal-codes-and-attempt-lifecycle by the human's answer to question round 31, item 2 (RULED 2026-09-30): the shell hold covers the frontend screens the migration replaces, not bug fixes in frontends/shell/src-tauri, and portability R1-R6 apply to this piece (state/directives/PORTABILITY-2026-09-30.md, section 2). Wave-1 S2 record (state/cloud/wave1-prompts.md, the S2 rule). A1 observation 1: RunningPublishes is keyed by a caller-supplied attempt id, so a second execute rep

### engine-cancel-before-stream-window
- bytes 1331; current-state markers: still; markers in the rest: none
- PLAN nodes named: engine-cancel-before-execute-siblings (proposed); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: home: plan engine-cancel-before-execute-siblings (proposed)
- current-state segment (first 500 chars): Wave-1 S2 record (state/cloud/wave1-prompts.md, the S2 rule: real but bounded, recorded as a PLAN note); still present at main when triaged. engine/src/stream.rs checks is_cancelled just before stream_arrow, and engine/src/cancel.rs records that an interrupt on an idle connection is not latched; a cancel in that window is lost for one query, bounded by the query (state/cloud/wave1/A5.md). Placed by question round 31, item 1 (RULED 2026-09-30): position 1 of 16 in the human's order, order 11 in i

### audit-reader-char-boundary
- bytes 1418; current-state markers: still; markers in the rest: none
- PLAN nodes named: catalog-open-replace-drop-latency-note (done), audit-show-invalid-utf8-whole-refusal (proposed); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: home: plan audit-show-invalid-utf8-whole-refusal (proposed)
- current-state segment (first 500 chars): Wave-1 S2 record (state/cloud/wave1-prompts.md, the S2 rule: real but bounded, recorded as a PLAN note); still present at main when triaged. kernel/src/permission/audit/reader.rs's plain_date panics publish-bundle --audit-show on a hand-edited audit log: a trusted, local input (state/cloud/wave1/A3.md). Placed by question round 31, item 1 (RULED 2026-09-30): position 6 of 16 in the human's order, order 5 in its lane. It depends on catalog-open-replace-drop-latency-note, position 5, so that the o

### skp-cancel-state-closed-set
- bytes 1129; current-state markers: waits, still, open; markers in the rest: none
- PLAN nodes named: audit-reader-char-boundary (done), workspace-rustfmt (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: UNRESOLVED: markers in the current-state segment and no mechanical home; custodian: not owed (proof) / no obligation / stays
- current-state segment (first 500 chars): Wave-1 S2 record (state/cloud/wave1-prompts.md, the S2 rule: real but bounded, recorded as a PLAN note); still present at main when triaged. CancelResponse.state is a free string in protocol/skp and in the shell's types while SKP-V0's §1 lists three values; which side is wrong is undetermined (state/cloud/wave1/C.md). It travels with PR #123's integration after the watcher (round 24, item 4), beside C's ambiguity list. Placed by question round 31, item 1 (RULED 2026-09-30): position 7 of 16 in t

### suites-and-toolchain-beyond-windows
- bytes 1135; current-state markers: next, still; markers in the rest: none
- PLAN nodes named: kernel-generation-close-races (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: UNRESOLVED: markers in the current-state segment and no mechanical home; custodian: not owed (proof) / no obligation / stays
- current-state segment (first 500 chars): Wave-1 S2 record (state/cloud/wave1-prompts.md, the S2 rule: real but bounded, recorded as a PLAN note); still present at main when triaged. On Linux: 14 default tests need LOCALAPPDATA (D-1); a Windows path literal in boundary.rs's confirmation-phrase test (D-2); a Windows absolute fixture path writes a 151 MB file named with the literal path into engine/ (D-4); npm ci refuses under npm 10 and succeeds under npm 11 (D-3; the minimum npm version is undocumented, CI pins Node 24) (state/cloud/wav

### kernel-close-races-followups
- bytes 4410; current-state markers: none; markers in the rest: owed, next, carried, still, open
- PLAN nodes named: kernel-close-races-followups (done), b1-engine-kernel-half-followups (done), skp-cancel-state-closed-set (done), workspace-rustfmt (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### shell-migration-milestone-1
- bytes 6973; current-state markers: none; markers in the rest: waits, waiting, until, next, still, open
- PLAN nodes named: shell-pick-paths-disagree-at-1280x801 (done), verify-cites-pinned-citations (done), shell-migration-milestone-1 (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### watcher-first-read-on-watch-thread
- bytes 680; current-state markers: waits, next, open; markers in the rest: none
- PLAN nodes named: geometry-types-beyond-polygons (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: UNRESOLVED: markers in the current-state segment and no mechanical home; custodian: not owed (proof) / no obligation / stays
- current-state segment (first 500 chars): Ruled S1 in the 2026-09-28 S1 batch (state/directives/2026-09-28-after-wave-s1-batch.md): the human's ruling line places C-1 next, immediately after close-races' current step; Fable's C-1 paragraph gives the direction (every ReadDirectoryChangesW issued by the watch thread that owns the handle, arm keeping its synchronous outcome through a one-shot handshake; no completion port, no keep-alive change), the two regression tests and the short form. Finding and the custodian's Windows reproduction: 

### wave2-b-admission-campaign-merge
- bytes 573; current-state markers: none; markers in the rest: none
- PLAN nodes named: filter-bind-admission-implicit-coercions (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### filter-bind-admission-implicit-coercions
- bytes 4879; current-state markers: next, follow-up, open; markers in the rest: none
- PLAN nodes named: wave2-b-admission-campaign-merge (done), stream-evaluation-failure-fixed-detail (proposed), type-walk-null-literal-arithmetic (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: home: plan stream-evaluation-failure-fixed-detail (proposed)
- current-state segment (first 500 chars): Ruled S1 in the 2026-09-28 S1 batch (state/directives/2026-09-28-after-wave-s1-batch.md): the human's ruling line puts B-1's P0 after C-1; Fable's B-1 paragraph: its own cut and preregistration; P0 a measured table (each admitted comparison form by each admitted column type: does the binder insert a cast, can it fail or narrow); the preregistration proposes the admitted set and the detection mechanism (the engine's own type rules over the allowlisted tree preferred to plan-text parsing) and come

### b1-close-nul-column-names
- bytes 2477; current-state markers: until, next, open; markers in the rest: none
- PLAN nodes named: b1-shell-half (proposed), entry-79-b1-consult-items (blocked); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: home: plan b1-shell-half (proposed) | home: plan entry-79-b1-consult-items (blocked)
- current-state segment (first 500 chars): Ruled S1 in the 2026-09-28 S1 batch (state/directives/2026-09-28-after-wave-s1-batch.md): the human's ruling line fixes A2-1 as part of B1's close; Fable's A2-1 paragraph: the ordinary pre-close route while ADR-023 is Proposed, not a separate cut; the schema probe detects names that do not round-trip, and every use by name refuses them (W2-A2's observation 3 now in scope); the refusal names the real reason, and a new code would be an ADR-023 amendment with its own fixture, its text to Fable and 

### kernel-close-dataset-unknown-keeps-openrecord
- bytes 1564; current-state markers: none; markers in the rest: none
- PLAN nodes named: kernel-close-races-followups (done), publish-refusal-codes-and-attempt-lifecycle (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### covering-names-missing-column
- bytes 5892; current-state markers: none; markers in the rest: waits, next, still, open
- PLAN nodes named: covering-names-missing-column (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: 9 (present)
- proposal: no obligation: no obligation marker in the current-state segment

### type-walk-null-literal-arithmetic
- bytes 1566; current-state markers: none; markers in the rest: none
- PLAN nodes named: kernel-ticket-drop-followups (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### port-1-linux-l1
- bytes 2408; current-state markers: waits, until, later, open; markers in the rest: none
- PLAN nodes named: workspace-rustfmt (done), skp-cancel-state-closed-set (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: UNRESOLVED: markers in the current-state segment and no mechanical home; custodian: not owed (proof) / no obligation / stays
- current-state segment (first 500 chars): Filed on state/directives/2026-09-30-portability-and-handoff.md (the human's direction line and Fable's item 1) and state/directives/PORTABILITY-2026-09-30.md, section 6 (scope and acceptance). Placement guidance, the human's line: port-1 after B-1 (B-1 is done). Stays proposed until the human answers PORTABILITY section 7, because port-1 needs the runner-minutes decision (item 1); to be asked in question round 33 on 2026-10-02 (renumbered by the 2026-09-30 placement-round directive, then by the

### exposure-scan-ci-backstop
- bytes 2308; current-state markers: until; markers in the rest: none
- PLAN nodes named: workspace-rustfmt (done), exposure-scan-followups (proposed); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: home: plan exposure-scan-followups (proposed)
- current-state segment (first 500 chars): Round 33 (RULED 2026-10-02, DECISIONS-PENDING.md, question round 33), item 1 (RED LINE, public exposure, part B): adopted as the first of two pieces, before workspace-rustfmt. The shape is state/drafts/weekly-window-2026-10-02.md, section B: a range mode scanning added lines (type changes included), added and renamed path names and every commit message in the range; a workflow on every pull_request and every push to main; a matched segment never printed. Full gating under section 21a. Its form s

### workspace-rustfmt
- bytes 3568; current-state markers: owes, waiting, until, open; markers in the rest: none
- PLAN nodes named: exposure-scan-ci-backstop (done), data-plane-crate-fmt (unscheduled), skp-cancel-state-closed-set (done), port-1-linux-l1 (done), test-claims-same-pr-superseded-pin (done), publish-panel-rs-regex-layout (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: home: plan data-plane-crate-fmt (unscheduled)
- current-state segment (first 500 chars): Round 33 (RULED 2026-10-02, DECISIONS-PENDING.md, question round 33), item 1: adopted as the second of two pieces, after exposure-scan-ci-backstop; it supersedes data-plane-crate-fmt. The shape is state/drafts/weekly-window-2026-10-02.md, section A: exactly cargo fmt --all plus the src-tauri manifest run on the piece's base, the check in the same PR so main is never red between them, and a .git-blame-ignore-revs naming the pass's commit. It runs only while no Rust branch is open: skp-cancel-stat

### test-claims-same-pr-superseded-pin
- bytes 1635; current-state markers: held, until, next, still; markers in the rest: none
- PLAN nodes named: none; DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: UNRESOLVED: markers in the current-state segment and no mechanical home; custodian: not owed (proof) / no obligation / stays
- current-state segment (first 500 chars): Round 33 (RULED 2026-10-02, DECISIONS-PENDING.md, question round 33), item 2: adopted as described in state/drafts/weekly-window-2026-10-02.md, section C, met at A2-1's Amendment 12 on 2026-09-29. Preregistration before any code, the reviewer, and the architect if section 21a applies; unit fixtures cover the squash hazard. HELD 2026-10-02 before its form: the drafting consult (state/consults/2026-10-02-test-claims-same-pr-pin-architect-draft.md) finds two decisions that are the human's. R-1: whe

### round-mirror-pretooluse-hook
- bytes 1197; current-state markers: next; markers in the rest: none
- PLAN nodes named: none; DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: UNRESOLVED: markers in the current-state segment and no mechanical home; custodian: not owed (proof) / no obligation / stays
- current-state segment (first 500 chars): Round 33 (RULED 2026-10-02, DECISIONS-PENDING.md, question round 33), item 3: adopted with one call per round, as described in state/drafts/weekly-window-2026-10-02.md, section D: each AskUserQuestion call becomes its own round file under state/questions/ and its own Telegram message; the hook exits 0 on every path and stays silent inside a subagent, without the lease and in a cloud session. Telegram stays read-and-copy and AskUserQuestion the answer channel. Preregistration before any code, the

### stop-hook-stale-continuity
- bytes 695; current-state markers: none; markers in the rest: none
- PLAN nodes named: none; DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### publish-panel-rs-regex-layout
- bytes 1260; current-state markers: none; markers in the rest: none
- PLAN nodes named: workspace-rustfmt (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### questions-mirror-t11-copy-glob
- bytes 1084; current-state markers: none; markers in the rest: none
- PLAN nodes named: stop-hook-stale-continuity (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### lead-data-pilot-setup
- bytes 687; current-state markers: next; markers in the rest: none
- PLAN nodes named: kernel-ticket-drop-followups (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: UNRESOLVED: markers in the current-state segment and no mechanical home; custodian: not owed (proof) / no obligation / stays
- current-state segment (first 500 chars): Placed by the human's direction of 2026-10-03 (RULED 2026-10-03, the data-path lead pilot; state/directives/2026-10-03-lead-data-pilot-direction.md, with the pilot document state/directives/LEAD-DATA-PILOT-2026-10-03.md): the next free slot under the two-pieces limit, ahead of node 9 (kernel-ticket-drop-followups depends on it). Scope: the pilot document, section 5. Short-form preregistration before any code; gates reviewer and architect (the architect checks gate independence); after each lead-

### module-docs-stale-statements
- bytes 10835; current-state markers: carried; markers in the rest: owed, waits, until, next, later, carried, still, open
- PLAN nodes named: module-docs-stale-statements (done), known-limitations-item-2-on-main-paragraph (done), stale-test-names-and-comments (done), lod-tier-selection (proposed); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: 39 (present)
- proposal: home: plan lod-tier-selection (proposed) | home: known-limitations item 39
- current-state segment (first 500 chars): DONE 2026-10-11: PR #209 merged by the human at 15:42:42Z (merge commit 0bc12abd, head dd96e424); gate log 488 to 491; correction round 1 (Amendment 2); lead-data's owner's-index update applied; O-1 (the second stream sentence) carried as a candidate for piece f, asked of the human; worktree C:/dev/wt/mdocs removed after the merge.

### subagent-write-audit-script
- bytes 2396; current-state markers: carried; markers in the rest: none
- PLAN nodes named: lead-data-pilot-setup (done), subagent-write-audit-post-merge-pin (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: UNRESOLVED: markers in the current-state segment and no mechanical home; custodian: not owed (proof) / no obligation / stays
- current-state segment (first 500 chars): Ruled by question round 41, item 3 (RULED 2026-10-03; state/directives/2026-10-03-write-audit-ruling.md): the transcript audit is the primary, scripted check for lead-data and architect runs. The custodian runs it from its session scratchpad; this node lands it under scripts/hooks/ with tests, so a new session has it. Behaviour as run on 2026-10-03: an agent id resolves to the canonical transcript under the project's session subagents directory (a hand-back's tasks output file can be empty); Wri

### subagent-write-audit-post-merge-pin
- bytes 724; current-state markers: none; markers in the rest: none
- PLAN nodes named: none; DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### guardian-v0
- bytes 767; current-state markers: waits; markers in the rest: none
- PLAN nodes named: none; DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: UNRESOLVED: markers in the current-state segment and no mechanical home; custodian: not owed (proof) / no obligation / stays
- current-state segment (first 500 chars): Placed by the 2026-10-03 Guardian v0 direction (state/directives/2026-10-03-guardian-v0-direction.md; RULED 2026-10-03): governance, beside node 10 under the two-pieces limit. The brief is state/directives/MODS-GUARDIAN-V0-2026-10-03.md. P0 first: its section 3 questions answered against the installed build, recorded in the preregistration's section 0, before any code; rules the build cannot support are dropped from v0 as the brief says. Architect-drafted preregistration (the piece is not engine

### evidence-recorder-v0
- bytes 1100; current-state markers: next; markers in the rest: none
- PLAN nodes named: guardian-v0 (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: UNRESOLVED: markers in the current-state segment and no mechanical home; custodian: not owed (proof) / no obligation / stays
- current-state segment (first 500 chars): Placed by the 2026-10-03 mods-roadmap ruling (state/directives/2026-10-03-evidence-recorder-ruling.md, item 1 and step 2; RULED 2026-10-03): governance lane, after guardian-v0, which it depends on. The brief is state/directives/MODS-EVIDENCE-RECORDER-V0-2026-10-03.md. It observes only: it never refuses, rewrites or answers a tool call, adds nothing the model reads, and returns every result exactly as next(e) produced it. P0 first (the brief's section 3: the Bash result fields, turn.complete usag

### claude-md-stale-facts
- bytes 542; current-state markers: none; markers in the rest: none
- PLAN nodes named: none; DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### data-plane-terminal-without-credit
- bytes 4481; current-state markers: none; markers in the rest: waits, waiting, held, until, queued, outstanding, still, open
- PLAN nodes named: timing-assertions-under-contention (done), kernel-close-races-followups (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### evidence-recorder-v0-1
- bytes 3136; current-state markers: none; markers in the rest: waits, pending, next, queued
- PLAN nodes named: timing-assertions-under-contention (done), recorder-write-latency-measure (unscheduled); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### guardian-v1
- bytes 8760; current-state markers: none; markers in the rest: owed, waits, until, next, open
- PLAN nodes named: shell-crs-form-for-format-default-contradicted (done), ported-code-notice-route (done), guardian-v1 (done), evidence-recorder-v0-1 (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### compaction-record-and-resume-line
- bytes 1909; current-state markers: next, open; markers in the rest: waits, next
- PLAN nodes named: compaction-record-and-resume-line (done), guardian-v1 (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: UNRESOLVED: markers in the current-state segment and no mechanical home; custodian: not owed (proof) / no obligation / stays
- current-state segment (first 500 chars): DONE 2026-10-06: #181 merged at 04:39:52Z as af8790a6; closing record Amendment 3 (generation 4; Amendment 2 lapsed bump made with it); round 61 items 2 and 3 recorded there; E1 open, at the next automatic compaction.

### guardian-n1-before-auto-compaction
- bytes 2377; current-state markers: open; markers in the rest: waits, next, open
- PLAN nodes named: guardian-n1-before-auto-compaction (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: UNRESOLVED: markers in the current-state segment and no mechanical home; custodian: not owed (proof) / no obligation / stays
- current-state segment (first 500 chars): DONE 2026-10-06: #183 merged at 10:11:29Z as 0f86b680 (the click before the typed approval of 10:18:41Z; approved after the fact at 10:30:25Z); closing record Amendment 4 (generation 4); E12 recorded as Amendment 3 after the restart (2.1.291, scope local); E13 and E14 open.

### typed-terminal-codes-post-check-race
- bytes 3261; current-state markers: none; markers in the rest: until, next, queued, deferred, open
- PLAN nodes named: none; DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### skp-drained-stream-helper-post-check-race
- bytes 4418; current-state markers: none; markers in the rest: owed, waits, waiting, next
- PLAN nodes named: skp-drained-stream-helper-post-check-race (done), covering-names-missing-column (done), typed-terminal-codes-post-check-race (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### source-changed-post-reopen-routes-watcher-visible
- bytes 4809; current-state markers: next, queued; markers in the rest: held, next, still, open
- PLAN nodes named: source-changed-post-route-s5d-race (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: UNRESOLVED: markers in the current-state segment and no mechanical home; custodian: not owed (proof) / no obligation / stays
- current-state segment (first 500 chars): DONE 2026-10-20: PR 231 merged at 6b829c08 (the form's Amendment 6, the closing record); N6, N8 and Q1 queued for the next sitting; S5d's step 2 next, its amendment stating the seam notes.

### shell-stale-layout-comments-and-s1-row
- bytes 5650; current-state markers: none; markers in the rest: waits, next, queued, open
- PLAN nodes named: geometry-types-beyond-polygons (done), shell-stale-frame-comments (done), shell-map-refill-after-resize (done); DECISIONS-PENDING entries: 120 (not open); KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### filter-identity-alias-ambiguous-reached-through-skp
- bytes 4237; current-state markers: none; markers in the rest: waits, next
- PLAN nodes named: filter-identity-alias-ambiguous-reached-through-skp (done), filter-identity-alias-ambiguous-guidance-line-and-note (proposed), stream-flush-cancel-exit-marks-producer-cancelled (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: 3 (present)
- proposal: no obligation: no obligation marker in the current-state segment

### skp-unproduced-codes-ruling
- bytes 1319; current-state markers: open; markers in the rest: waits
- PLAN nodes named: skp-v0-live-sections-current-area-c (done), first-external-plugin-skp-client (unscheduled); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: home: plan first-external-plugin-skp-client (unscheduled)
- current-state segment (first 500 chars): RULED 2026-10-10 by the human (state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md, item 4): strike, no code; folded into skp-v0-live-sections-current-area-c; whether a typed refusal is produced is a named open item on first-external-plugin-skp-client. This node closes.

### skp-v0-live-sections-current-area-c
- bytes 7876; current-state markers: none; markers in the rest: owed, waits, next, later, still, open
- PLAN nodes named: skp-v0-live-sections-current-area-c (done), skp-unproduced-codes-ruling (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### known-limitations-item-8-filter-not-published
- bytes 4545; current-state markers: none; markers in the rest: waits, next
- PLAN nodes named: known-limitations-item-8-filter-not-published (done), ported-code-notice-route (done), wire-bytes-invariant-trace-flag-race (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: 3 (present), 8 (present)
- proposal: no obligation: no obligation marker in the current-state segment

### known-limitations-item-2-on-main-paragraph
- bytes 5091; current-state markers: none; markers in the rest: waits, next, carried
- PLAN nodes named: shell-crs-form-for-format-default-contradicted (done), known-limitations-item-2-on-main-paragraph (done), crs-undeclared-message-wording (done), known-limitations-item-8-filter-not-published (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### stale-test-names-and-comments
- bytes 8402; current-state markers: none; markers in the rest: owed, waits, pending, until, next, still, open
- PLAN nodes named: known-limitations-current-view-stale-box (done), shell-crs-form-for-format-default-contradicted (done), skp-v0-live-sections-current-area-c (done), shell-stale-frame-comments (done), module-docs-stale-statements (done); DECISIONS-PENDING entries: 45 (not open), 75 (not open); KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### known-limitations-item-40-source-comment
- bytes 1085; current-state markers: none; markers in the rest: next
- PLAN nodes named: none; DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### export-current-view-after-unreported-fit
- bytes 8654; current-state markers: none; markers in the rest: waits, waiting, until, next, follow-up, open
- PLAN nodes named: walkthrough-current-view-rows-g1-n5 (proposed), shell-status-bar-one-height (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### known-limitations-current-view-stale-box
- bytes 3292; current-state markers: none; markers in the rest: next
- PLAN nodes named: stale-test-names-and-comments (done), export-current-view-after-unreported-fit (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### known-limitations-crs-epoch-edges-third-axis
- bytes 2710; current-state markers: none; markers in the rest: next, carried
- PLAN nodes named: stale-test-names-and-comments (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### crs-undeclared-message-wording
- bytes 5936; current-state markers: none; markers in the rest: waits, next, open
- PLAN nodes named: crs-undeclared-message-wording (done), filter-identity-alias-ambiguous-reached-through-skp (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: 2 (present)
- proposal: no obligation: no obligation marker in the current-state segment

### stream-flush-cancel-exit-marks-producer-cancelled
- bytes 4875; current-state markers: none; markers in the rest: waits, next, open
- PLAN nodes named: stream-flush-cancel-exit-marks-producer-cancelled (done), stream-cancel-returns-left-unmarked (proposed), wire-bytes-invariant-trace-flag-race (done), known-limitations-item-8-filter-not-published (done), ported-code-notice-route (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### e2e-stale-expectations-reaim
- bytes 10925; current-state markers: none; markers in the rest: owes, waits, next
- PLAN nodes named: e2e-stale-expectations-reaim (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: 3 (present)
- proposal: no obligation: no obligation marker in the current-state segment

### e2e-failures-present-at-the-base
- bytes 2171; current-state markers: owed, still; markers in the rest: until, queued
- PLAN nodes named: e2e-stale-expectations-reaim (done), shell-migration-milestone-1 (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: 3 (present)
- proposal: home: known-limitations item 3
- current-state segment (first 500 chars): DONE 2026-10-09, the triage, reported only (state/consults/2026-10-09-e2e-failures-present-at-the-base-triage-report.md): every named step still fails at main 316a4476; none is a stale fixture (fresh generator copies are byte-identical) and none a product defect. All are stale expectations: regression C2'/C3' and admission MAP' and BOTHNEEDED' predate the session identity tier (R-I3, ADR-016 Amendment 1); console HEXLIM' predates skp/0.6's columns key; console GROUP' and REFUSAL' predate the can

### verify-cites-pinned-citations
- bytes 1354; current-state markers: none; markers in the rest: open
- PLAN nodes named: verify-cites-pin-resolution-and-line-zero (proposed), verify-cites-pinned-citations (done), shell-migration-milestone-1 (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### adr-032-staleness-docs
- bytes 734; current-state markers: none; markers in the rest: waits, queued, still, open
- PLAN nodes named: adr-032-staleness-docs (done), adr-032-decision (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### docs-08-public-data-sentence
- bytes 990; current-state markers: none; markers in the rest: queued, open
- PLAN nodes named: docs-08-public-data-sentence (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### duckdb-parquet-geometry-probe
- bytes 1647; current-state markers: none; markers in the rest: none
- PLAN nodes named: duckdb-parquet-geometry-probe (done), covering-names-missing-column (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### ported-code-notice-route
- bytes 7426; current-state markers: none; markers in the rest: waits, next
- PLAN nodes named: ported-code-notice-route (done), crs-undeclared-message-wording (done), wire-bytes-invariant-trace-flag-race (done), stream-flush-cancel-exit-marks-producer-cancelled (done), filter-identity-alias-ambiguous-reached-through-skp (done), known-limitations-item-8-filter-not-published (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: 2 (present), 39 (present)
- proposal: no obligation: no obligation marker in the current-state segment

### shell-crs-form-for-format-default-contradicted
- bytes 6039; current-state markers: none; markers in the rest: waits, until, next, not yet, still, open
- PLAN nodes named: shell-crs-form-for-format-default-contradicted (done), ported-code-notice-route (done), guardian-v1 (done), release-v0-1-1 (proposed); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: 2 (present)
- proposal: no obligation: no obligation marker in the current-state segment

### query-reuse-index-before-planning
- bytes 553; current-state markers: none; markers in the rest: held, until
- PLAN nodes named: none; DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### shell-stale-frame-comments
- bytes 6154; current-state markers: none; markers in the rest: pending, next, queued, still
- PLAN nodes named: geometry-types-beyond-polygons (done), shell-stale-layout-comments-and-s1-row (done), shell-map-refill-after-resize (done), stale-test-names-and-comments (done); DECISIONS-PENDING entries: 75 (not open), 45 (not open); KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### e2e-hover-establishing-read-stale
- bytes 5453; current-state markers: none; markers in the rest: waits, waiting, next, still
- PLAN nodes named: e2e-hover-establishing-read-stale (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### shell-pick-paths-disagree-at-1280x801
- bytes 2268; current-state markers: none; markers in the rest: none
- PLAN nodes named: e2e-hover-establishing-read-stale (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### wire-bytes-invariant-trace-flag-race
- bytes 3946; current-state markers: none; markers in the rest: waits, until, next, queued
- PLAN nodes named: stream-flush-cancel-exit-marks-producer-cancelled (done), wire-bytes-invariant-trace-flag-race (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### shell-migration-milestone-2
- bytes 25255; current-state markers: queued; markers in the rest: waits, next, still, open
- PLAN nodes named: guardian-v1 (done), e2e-hover-establishing-read-stale (done), shell-map-refill-after-resize (done), e2e-failures-present-at-the-base (done), shell-pick-paths-disagree-at-1280x801 (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: 36 (present), 38 (present), 40 (present), 41 (present), 2 (present)
- proposal: home: known-limitations item 36 | home: known-limitations item 38 | home: known-limitations item 40 | home: known-limitations item 41 | home: known-limitations item 2
- current-state segment (first 500 chars): DONE 2026-10-14: PR #217 (phase B) merged by the human at 2026-10-14T07:06:46Z (merge commit 71fd2c4f, head 3d9e42e1); gate 4 both PASS (513, 514); AMENDMENT 18 the closing record (generation 19); the item 2e drafts merged as they stood; Part W and the P6 sight queued for the sitting. Phase A was #212.

### shell-migration-milestone-3
- bytes 11823; current-state markers: none; markers in the rest: waits, held, next, still, open
- PLAN nodes named: operator-sitting-queue (blocked), publish-approval-unknown-attempt-under-load (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: 45 (present), 46 (present)
- proposal: no obligation: no obligation marker in the current-state segment

### shell-map-refill-after-resize
- bytes 13229; current-state markers: none; markers in the rest: waits, pending, until, next, outstanding, open
- PLAN nodes named: shell-map-refill-after-resize (done), e2e-hover-establishing-read-stale (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: 2 (present), 19 (present), 20 (present), 22 (present)
- proposal: no obligation: no obligation marker in the current-state segment

### b2-piece-1a-step-record-and-dataset-reference
- bytes 4288; current-state markers: none; markers in the rest: waits, until, still, open
- PLAN nodes named: b2-piece-1a-step-record-and-dataset-reference (done), data-plane-crowded-start-detail-spaces (done), b2-piece-1b-recording (done), b2-piece-1c-save-and-reopen (proposed); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### shell-status-bar-one-height
- bytes 6168; current-state markers: none; markers in the rest: pending, held, next, follow-up, still
- PLAN nodes named: b2-piece-1b-recording (done), e2e-readme-status-bar-steps (done), export-current-view-after-unreported-fit (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: 40 (present)
- proposal: no obligation: no obligation marker in the current-state segment

### e2e-readme-status-bar-steps
- bytes 2366; current-state markers: none; markers in the rest: waits, next, follow-up, queued
- PLAN nodes named: none; DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### b2-piece-1b-recording
- bytes 13836; current-state markers: none; markers in the rest: owed, waits, waiting, until, next, still, open
- PLAN nodes named: b2-piece-1c-save-and-reopen (proposed), guardian-v1 (done), shell-status-bar-one-height (done), export-current-view-after-unreported-fit (done), shell-migration-milestone-2 (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### engine-clause-composition-properties
- bytes 4451; current-state markers: none; markers in the rest: owed, waits, until, next, queued
- PLAN nodes named: b2-piece-1b-recording (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### boundary-inventory
- bytes 1516; current-state markers: none; markers in the rest: owed, queued
- PLAN nodes named: bundle-redaction-scan-not-in-product-publish (proposed), session-log-token-redaction-rests-on-page-code (proposed), b2-piece-1c-save-and-reopen (proposed); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### governance-search-ignore-historical
- bytes 4224; current-state markers: none; markers in the rest: waits, held, next, still, open
- PLAN nodes named: boundary-inventory (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### governance-cut-state-cap-and-rotation
- bytes 6630; current-state markers: next; markers in the rest: waits, held, next, still, open
- PLAN nodes named: none; DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: UNRESOLVED: markers in the current-state segment and no mechanical home; custodian: not owed (proof) / no obligation / stays
- current-state segment (first 500 chars): DONE 2026-10-19: PR #229 merged 2026-10-19T12:56:02Z; R, F and E1 to E9 in the form's Amendment 8; the scoped reviewer pass PASS (546, state/consults/gates/2026-10-19-governance-cut-state-cap-and-rotation-closing-scoped-reviewer.md); the Pages deploy job at F read at 2026-10-19T16:28Z: completed, success. Governance C next in its lane, its form taking F-2.

### governance-decisions-pending-open-and-archive
- bytes 5262; current-state markers: none; markers in the rest: waits, held, next, carried, open
- PLAN nodes named: none; DECISIONS-PENDING entries: 104 (not open); KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### mods-readme-local-scope
- bytes 1683; current-state markers: none; markers in the rest: until
- PLAN nodes named: mods-readme-local-scope (done), kernel-close-races-followups (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### source-changed-post-route-s5d-race
- bytes 9573; current-state markers: none; markers in the rest: held, next, not yet, open
- PLAN nodes named: source-changed-post-reopen-routes-watcher-visible (done), engine-clause-composition-properties (done), boundary-inventory (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### known-limitations-item-41-source-comment
- bytes 1554; current-state markers: none; markers in the rest: next
- PLAN nodes named: e2e-readme-status-bar-steps (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### publish-approval-unknown-attempt-under-load
- bytes 7935; current-state markers: none; markers in the rest: waits, until, next, queued, later, not yet, open
- PLAN nodes named: publish-approval-ttl-ten-minutes (done), publish-dev-hook-attempt-from-effect (proposed), shell-migration-milestone-3 (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### known-limitations-item-23-watcher-idle-end
- bytes 2008; current-state markers: none; markers in the rest: waiting, next
- PLAN nodes named: none; DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment

### publish-approval-ttl-ten-minutes
- bytes 4397; current-state markers: none; markers in the rest: until, next
- PLAN nodes named: operator-sitting-queue (blocked), publish-approval-ttl-ten-minutes (done), publish-approval-unknown-attempt-under-load (done); DECISIONS-PENDING entries: none; KNOWN-LIMITATIONS items: none
- proposal: no obligation: no obligation marker in the current-state segment
