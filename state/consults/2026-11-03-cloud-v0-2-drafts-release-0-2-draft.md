*Custodian's filing note (2026-11-03): a cloud session's draft, filed as a consult under the human's direction of 2026-11-03 (`state/directives/2026-11-03-away-until-11-09-276-open-1-seven-clauses-open-4-c-placed-sitting-wording-leaves-slot-cloud-credit.md`, line 30, the credit's part 2); it is a draft and not Authority. Provenance: branch `cloud/v0-2-drafts` at 7036ca77bb94afe39e53b71bda5382aa652d77b8 (committed 2026-11-03T16:49:40Z), one commit on 84a90e26087b49eace4dd6fa19a8a9d3215b09df, a commit on main; the branch adds only files under `state/consults/cloud/v0-2-drafts/`, each with its sha256 at that commit: `COVERAGE.md` 3ab67d209fd5d56edc8c15e3f74a580ddc90d72a82d0bd07174fb99c2b0f755c; `RELEASE-0.2-DRAFT.md` 189624ec19185a4fce14c2890400c5381facd602701fd299f938007389b4e123. Below is `RELEASE-0.2-DRAFT.md` at that commit, unchanged, read by git (sha256 of what follows the rule: 189624ec19185a4fce14c2890400c5381facd602701fd299f938007389b4e123). The other files are named here by hash only, `COVERAGE.md` filed beside this one at `state/consults/2026-11-03-cloud-v0-2-drafts-coverage.md`. The branch is not merged and none of its files is committed at its own path. Read by the custodian at main 84e1ecaf, with no product code, ADR or KNOWN-LIMITATIONS byte changed from 84a90e26 to it; the nodes proposed from it are in governance/PLAN.yaml, each proposed, placed by the human.*

---

# RELEASE-0.2 — draft release notes for v0.2.0 (proposals for the human; decides nothing)

*Drafted 2026-11-03 by cloud session 8, read-only against `main` at `84a90e26` (84a90e26087b49eace4dd6fa19a8a9d3215b09df). Nothing here binds. Release notes are a red-line text and keep the human's typed words (state/directives/2026-10-11-merges-210-211-pilot-recorder-2f-milestone-3-rulings.md:16 @ 84a90e26). The release node says the same: "The release notes and the tag message are the human's typed words" (governance/PLAN.yaml:6362 @ 84a90e26, node `release-v0-2-0`). Every sentence offered for the notes below is a proposal for those words. Two passages are already the human's own, and each is marked **the human's words, verbatim**.*

*How the cites read. Every citation is `path:line @ 84a90e26` unless another commit is named. "Closing record" means the amendment in the piece's preregistration form that records its merge. Where a form has no such amendment, the pin falls on the form's **last** amendment, the line says "(no closing record; last amendment)", and the PLAN node's line stands beside it as the merge record. The companion file `COVERAGE.md` (same folder) lists all 225 merged pieces, maps them to walkthrough rows and KNOWN-LIMITATIONS items, and names the rows that have had no operator-verified run since their last change.*

---

## 0. What this draft is drafted from, and what it leaves out

- **The register.** RELEASE-0.1 set the shape of release text: "Release notes = the KNOWN-LIMITATIONS text plus the hero-slice sentence and the install pointer; nothing else. No numbers." (governance/RELEASE-0.1.md:148-149 @ 84a90e26). The v0.1.0 tag message and GitHub release body give the voice: the claim in one sentence, limits by name with their home decision, licence and provenance last (state/drafts/tag-message-v0.1.0.md:4-49 @ 84a90e26; state/drafts/github-release-body-v0.1.0.md:4-53 @ 84a90e26).
- **The pieces.** Since the tag (v0.1.0 = `b391e43`, governance/RELEASE-0.1.md:1282 @ 84a90e26), 225 pull requests have merged on `main`'s first-parent line (`git log --merges --first-parent v0.1.0..84a90e26`). Two of them shipped inside v0.1.0 through `release/0.1.0` and are not new in v0.2:
  - #47, entry 47's hover re-pick, landed on the release branch before the tag (governance/RELEASE-0.1.md:1212 @ 84a90e26).
  - #50 is the merge-back of the release branch (governance/RELEASE-0.1.md:1287 @ 84a90e26).
- **The scope ruling.** The human's ruling on entry 137 (state/directives/2026-10-23-weekend-open-items-ruled-verify-cites-pin-covering-case-port-2-session-log-test-feature-v0-2-findings-graded.md:13 @ 84a90e26) settles the release's shape:
  - v0.1.1 is folded into v0.2;
  - piece 1c and milestone 4 ship whole;
  - the two graded fixes ship;
  - ADR-023's acceptance and the ADR-017 note come before the tag;
  - the asset is a walked candidate's CI build, re-run on the tag (OPEN-1 (a));
  - the tag is `v0.2.0` on a `release/0.2.0` branch, marked pre-release;
  - the release Part runs on a fresh account.
  The architect's scope proposal it rules on is state/consults/2026-10-23-v0-2-scope-proposal-architect.md:15-134 @ 84a90e26.
- **What is left out.** Only what is merged at `84a90e26` is drafted as a claim in §1. Pieces in v0.2's ruled scope that have not merged are listed as bracketed slots in §3, with no words. They are milestone 4's PR B, piece 1c, the session-log redaction, the ADR-017 note, B1's close, N1 to N7 and the sitting.

---

## 1. The notes, as proposed

### Title, installer and pointer

- **Title (proposal):** Spatial IDE v0.2.0 — the Prototype hero slice, second packaged Windows build. **[The human's words.]**
- **Installer:** [file name, size in bytes, SHA-256, build commit and NotSigned line. These come from `RELEASE-0.2.md` once the candidate is built, which happens after the sitting. Under OPEN-1 (a) the attached file is the tag's CI build, after the artifact rows are re-run on it.]
- **Read first:** `KNOWN-LIMITATIONS.md` at `v0.2.0`.

### What v0.2.0 is

Proposal, after the v0.1.0 tag message's first paragraph (state/drafts/tag-message-v0.1.0.md:4-7 @ 84a90e26):

> Still the Prototype hero slice (`docs/07_Roadmap.md`): open a GeoParquet, filter it in SQL, style it, publish it as a static interactive bundle — on Windows x64, from one unsigned per-user installer, marked pre-release. It does not claim the Prototype's exit. No performance statement is made anywhere in this release (`docs/08_Testing.md`: no numbers, no claim).

- The "does not claim exit" clause is the architect's (state/consults/2026-10-23-v0-2-scope-proposal-architect.md:17 @ 84a90e26).
- The README's statement of what works today "names the release, claims only the rows the sitting verified, and names main as ahead" (governance/RELEASE-DAY-CHECKLIST.md:15 @ 84a90e26). The human also ruled that v0.2's release notes carry that statement next (state/directives/2026-10-29-governance-f-mapping-table-approved-open-1-to-open-10-ruled.md:17 @ 84a90e26).
- So every "changed" line below is a candidate only. Each one names the walkthrough rows that would let it be claimed. Not one of those rows has an operator-verified run since its last change (`COVERAGE.md` §1).

### What changed for the operator since v0.1.0

Each line is in three parts: the proposed words, the piece and its closing record, and the rows and KNOWN-LIMITATIONS items involved.

**The application frame**

1. **Proposal:** "The window is laid out in regions — the map, panels you open and close, an attention strip and a status bar."
   - Piece: #195, node `shell-migration-milestone-1` (governance/PLAN.yaml:3159 @ 84a90e26).
   - Closing record: governance/forms/frontends/SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md:734 @ 84a90e26.
   - Rows: Part U, U1 to U10 (frontends/shell/MANUAL-WALKTHROUGH.md:1722 @ 84a90e26), never run.
   - KL: item 18 retired (KNOWN-LIMITATIONS.md:225 @ 84a90e26).
2. **Proposal:** "When the map grows — a region closed, a splitter dragged, the window enlarged — the area it uncovers fills without a pan or zoom."
   - Piece: #207, node `shell-map-refill-after-resize` (governance/PLAN.yaml:5433 @ 84a90e26).
   - Form, no closing record, last amendment: governance/forms/frontends/SHELL-MAP-REFILL-AFTER-RESIZE-PREREGISTRATION.md:553 @ 84a90e26.
   - Rows: Part V, V1 to V6 (frontends/shell/MANUAL-WALKTHROUGH.md:1770 @ 84a90e26), never run.
   - KL: item 39 retired (KNOWN-LIMITATIONS.md:391 @ 84a90e26).
3. **Proposal:** "The status bar keeps one height, so a notice coming or going no longer changes the map's size. A notice that does not fit is cut, and its full text stays reachable."
   - Piece: #218, node `shell-status-bar-one-height` (governance/PLAN.yaml:5469 @ 84a90e26).
   - Closing record: governance/forms/frontends/SHELL-STATUS-BAR-ONE-HEIGHT-PREREGISTRATION.md:950 @ 84a90e26.
   - Rows: Part Z, Z0 to Z4 (frontends/shell/MANUAL-WALKTHROUGH.md:1883 @ 84a90e26), never run.
4. **Proposal:** "A Select tool beside Navigate. A selection survives a filter and a pan, the count of selected features that are not drawn is shown, and Export states its scope."
   - Pieces: #212 (phase A) and #217 (phase B), node `shell-migration-milestone-2` (governance/PLAN.yaml:5330 @ 84a90e26).
   - Closing record: governance/forms/frontends/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md:1409 @ 84a90e26.
   - Rows: Part W, W0 to W11 (frontends/shell/MANUAL-WALKTHROUGH.md:1815 @ 84a90e26), never run.
   - KL: items 40 and 41 (KNOWN-LIMITATIONS.md:394 @ 84a90e26, :398 @ 84a90e26), both DRAFT wording.
5. **Proposal:** "A command bar (Ctrl+K) with slash commands, including `/filter` with field-name completion after `@`. A filter shows as cards you switch on and off."
   - Pieces: #233 (PR A) and #234 (PR B), node `shell-migration-milestone-3` (governance/PLAN.yaml:5348 @ 84a90e26).
   - Closing records: governance/forms/frontends/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md:872 @ 84a90e26 and :986 @ 84a90e26.
   - Rows: Part AB, AB0 to AB11 (frontends/shell/MANUAL-WALKTHROUGH.md:1929 @ 84a90e26), never run.
   - KL: items 45 and 46 (KNOWN-LIMITATIONS.md:405 @ 84a90e26, :409 @ 84a90e26).
6. **Proposal:** "Click a feature to read its attributes in the Feature tab, a NULL marked as such and the columns the app leaves out named. The Table in the Activity region lists features under three scopes, with a count line and Cancel."
   - Pieces: #246 (PR A) and #253 (PR C) of milestone 4, under node `b1-shell-half` (governance/PLAN.yaml:2370 @ 84a90e26), which stays in progress until PR B.
   - Closing records: governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:1133 @ 84a90e26 (PR A) and :1525 @ 84a90e26 (PR C).
   - Engine half: #134 and #143, closing record governance/forms/engine/B1-PROJECTION-PREREGISTRATION.md:1010 @ 84a90e26.
   - Rows: Part AC, AC0 to AC2 and AC6 to AC11 (frontends/shell/MANUAL-WALKTHROUGH.md:1972 @ 84a90e26), never run.
   - KL: items 51, 52, 54, 55 and 56 (KNOWN-LIMITATIONS.md:423 @ 84a90e26, :427 @ 84a90e26, :436 @ 84a90e26, :440 @ 84a90e26, :444 @ 84a90e26), all DRAFT wording.
   - What the line may not claim: B1 is never called complete before its close (state/consults/2026-10-23-v0-2-scope-proposal-architect.md:50 @ 84a90e26), and hovering still shows no attributes (item 52).
7. **Proposal:** "Between a camera change and the re-pick that follows it, the hover readout keeps the standing id with a muted 'confirming…' marker. The readout refuses below a declared 9 px feature size, and the pointer is a crosshair while hovering."
   - Pieces: #55, #64 and #79; nodes `polish-87-88-89`, `hover-confirming-marker` and `marker-wording-final` (governance/PLAN.yaml:344 @ 84a90e26, :1351 @ 84a90e26, :597 @ 84a90e26).
   - Polish form, its last amendment: governance/forms/frontends/POLISH-87-88-89-PREREGISTRATION.md:133 @ 84a90e26.
   - Marker form, no closing record, last amendment: governance/forms/frontends/HOVER-CONFIRMING-MARKER-PREREGISTRATION.md:119 @ 84a90e26.
   - Rows M17 and M18 passed on 2026-09-14/15, on a dev build from `main` at `74465c0` (frontends/shell/MANUAL-WALKTHROUGH.md:1417 @ 84a90e26, :1422-1425 @ 84a90e26). Their code area has changed since.

**What opens, and what is refused at open**

8. **Proposal:** "MultiPolygon, Point, LineString and MultiLineString open beside Polygon, and are drawn, hovered and clicked. Points are fixed-radius symbols and lines fixed-width strokes, both styled with the polygon style's fill and outline. Files of these types cannot be published yet."
   - Pieces: #182, #185 and #188; nodes `geometry-types-beyond-polygons`, `geometry-points-cut` and `geometry-lines-cut` (governance/PLAN.yaml:1387 @ 84a90e26, :2296 @ 84a90e26, :2315 @ 84a90e26).
   - Closing records: governance/forms/engine/MULTIPOLYGON-MP1-PREREGISTRATION.md:679 @ 84a90e26; governance/forms/engine/GEOMETRY-POINTS-PREREGISTRATION.md:675 @ 84a90e26; governance/forms/engine/GEOMETRY-LINES-PREREGISTRATION.md:725 @ 84a90e26.
   - Rows: Part S, S1 to S4 (frontends/shell/MANUAL-WALKTHROUGH.md:1570 @ 84a90e26); Part P (points), P1 to P7 (:1616 @ 84a90e26); Part T, T1 to T6 (:1674 @ 84a90e26). All never run.
   - KL: items 31 to 38 (KNOWN-LIMITATIONS.md:355-389 @ 84a90e26), all DRAFT wording. Item 32 is the publish refusal.
9. **Proposal:** "For a file that declares GeoParquet 1.0.0 or 1.1.0, a missing `crs` key opens as OGC:CRS84, the format's own rule. A CRS that declares latitude first, EPSG:4326 included, opens in the coordinate order the format lays down. The summary records which rule applied."
   - The words are KNOWN-LIMITATIONS item 2's on-main paragraph, compressed (KNOWN-LIMITATIONS.md:60 @ 84a90e26). An explicit `null` CRS is still refused.
   - Pieces: Brief A, #44, #46, #83, #94 and #95.
   - Closing record, the closing state-of-the-record list: governance/forms/engine/ADMISSION-PREREGISTRATION.md:1561 @ 84a90e26.
   - The KL paragraph's own form is #205's.
   - Rows N1 and N2 passed on 2026-09-20 and 2026-09-23 (frontends/shell/MANUAL-WALKTHROUGH.md:1436 @ 84a90e26, :1447 @ 84a90e26). The admission code area has changed since.
10. **Proposal:** "A single file with no `id` column and no declared mapping opens, and its features are identified for that session only, by their position in the file. The summary says so. That identity is never saved or published."
    - The words are item 3's on-main paragraph, compressed (KNOWN-LIMITATIONS.md:70 @ 84a90e26).
    - Pieces: #83 (P3a) together with #86 (P3b). The P3b node's own title says: "No release includes P3a without P3b" (governance/PLAN.yaml:998 @ 84a90e26).
    - Closing records: governance/forms/engine/ADMISSION-PREREGISTRATION.md:1561 @ 84a90e26; governance/forms/frontends/OWNER-INVALIDATION-PREREGISTRATION.md:1097 @ 84a90e26.
    - Rows: N3 passed on 2026-09-20. C2 and C3 were re-worded by #204 after their 2026-08-14 run.
11. **Proposal:** "The file's summary shows where its CRS and its axis order came from, states the session identity tier, and has a Display convention line."
    - Pieces: #93 and #102; nodes `briefa-p6-describe-fields` and `adr-013-display-statement` (governance/PLAN.yaml:1073 @ 84a90e26, :1538 @ 84a90e26).
    - Short forms, no closing record, last amendment: governance/forms/frontends/DESCRIBE-FIELDS-PREREGISTRATION.md:17 @ 84a90e26; governance/forms/frontends/ADR-013-DISPLAY-STATEMENT-PREREGISTRATION.md:16 @ 84a90e26.
    - The label is in frontends/shell/src/admission/DescribeSummary.tsx:74 @ 84a90e26.
    - Rows: N1 re-sighted on 2026-09-23 (frontends/shell/MANUAL-WALKTHROUGH.md:1447 @ 84a90e26).
12. **Proposal:** "A dataset in degrees is drawn on its own declared tile grid. It cannot be published."
    - Piece: #112, node `crs-unit-fact-and-bounds` (governance/PLAN.yaml:1595 @ 84a90e26).
    - Form, no closing record, last amendment: governance/forms/frontends/CRS-UNIT-FACT-AND-BOUNDS-PREREGISTRATION.md:527 @ 84a90e26.
    - Rows: Part P (degrees), P1 (frontends/shell/MANUAL-WALKTHROUGH.md:1457 @ 84a90e26), never run.
    - KL: items 17 and 21 (KNOWN-LIMITATIONS.md:207 @ 84a90e26, :259 @ 84a90e26). Item 17 is DRAFT wording.
13. **Proposal:** "When a file's own declaration contradicts the format's default, the refusal now opens the CRS assertion form that its message asks you to use."
    - Piece: #214, node `shell-crs-form-for-format-default-contradicted` (governance/PLAN.yaml:5151 @ 84a90e26).
    - Form, no closing record, last amendment: governance/forms/frontends/SHELL-CRS-FORM-FOR-FORMAT-DEFAULT-CONTRADICTED-PREREGISTRATION.md:360 @ 84a90e26.
    - Rows: Part X, X1 to X3 (frontends/shell/MANUAL-WALKTHROUGH.md:1798 @ 84a90e26), never run.
14. **Proposal:** "`engine.crs_undeclared` now says when the OGC:CRS84 default is applied, and otherwise asks you to assert a CRS."
    - The message itself is in engine/src/error.rs:285-288 @ 84a90e26.
    - Piece: #206, node `crs-undeclared-message-wording` (governance/PLAN.yaml:4914 @ 84a90e26). The node calls these words the human's.
    - Form, no closing record, last amendment: governance/forms/engine/CRS-UNDECLARED-MESSAGE-WORDING-PREREGISTRATION.md:345 @ 84a90e26.
    - Rows: B2, I1 and N4 quote the message. B2 was re-worded after its last run.
15. **Proposal:** "New refusals at open, each by name: a source that is not a single file (a partitioned dataset, or a path with a glob metacharacter); a `covering.bbox` or `geo.primary_column` name that matches more than one column, or names a column the app reads under another name; a column name that does not round-trip between DuckDB's Arrow export and its binder. A filter that depends on an implicit type coercion is now refused before it runs. A covering that names a missing column opens, and is refused at the first query with that column named."
    - Partitioned source: KL item 20 (KNOWN-LIMITATIONS.md:248 @ 84a90e26).
    - Covering name collision: #252 (governance/PLAN.yaml:4488 @ 84a90e26). Its full form records no closing amendment; its last amendment is governance/forms/engine/COVERING-CASE-COLLISION-BINDS-OTHER-COLUMN-FULL-PREREGISTRATION.md:723 @ 84a90e26. KL item 53 (KNOWN-LIMITATIONS.md:431 @ 84a90e26), DRAFT wording.
    - Column name round trip: #143, governance/PLAN.yaml:3335 @ 84a90e26, closing record governance/forms/engine/B1-PROJECTION-PREREGISTRATION.md:1010 @ 84a90e26.
    - Implicit coercions: #145, governance/PLAN.yaml:3317 @ 84a90e26, closing record governance/forms/engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:436 @ 84a90e26.
    - Missing covering column: #197, governance/PLAN.yaml:3459 @ 84a90e26, its close governance/forms/engine/COVERING-NAMES-MISSING-COLUMN-PREREGISTRATION.md:342 @ 84a90e26. KL item 9's sentence (KNOWN-LIMITATIONS.md:114 @ 84a90e26) is the human's words.

**While a file is open**

16. **Proposal:** "If the file changes on disk while it is open, the session ends: what was on the map is cleared, hovering says why, and reopening starts fresh. A detector checks the file at each query. On Windows, an advisory watch can also end the session while the app is idle."
    - Pieces: #86, node `briefa-p3b-owner-side-invalidation` (governance/PLAN.yaml:998 @ 84a90e26), with closing record governance/forms/frontends/OWNER-INVALIDATION-PREREGISTRATION.md:1097 @ 84a90e26.
    - #127, node `engine-source-change-watcher` (governance/PLAN.yaml:2222 @ 84a90e26). Closing record governance/forms/engine/SOURCE-WATCHER-PREREGISTRATION.md:582 @ 84a90e26, and its post-merge pin governance/forms/engine/SOURCE-WATCHER-PREREGISTRATION.md:602 @ 84a90e26.
    - #141, with last amendment governance/forms/engine/WATCHER-FIRST-READ-PREREGISTRATION.md:16 @ 84a90e26.
    - #173, closing record governance/forms/kernel/WATCH-GRANDPARENT-SPAWN-SIGNAL-PREREGISTRATION.md:164 @ 84a90e26.
    - #100 and #101, the reopen reset, last landing line governance/forms/frontends/N8-REOPEN-RESET-PREREGISTRATION.md:41 @ 84a90e26.
    - Rows: N6 to N8 passed on 2026-09-20 and 2026-09-23. N6 and N8 were re-worded by #231 after that. Part Q, Q1 and Q2 (frontends/shell/MANUAL-WALKTHROUGH.md:1498 @ 84a90e26), never run.
    - KL: items 19 and 22 to 28 (KNOWN-LIMITATIONS.md:232-328 @ 84a90e26).
17. **Proposal:** "Each filter you apply and each style change you commit is kept on this machine while the app runs. A normal close removes it. A crash leaves it behind, and nothing offers it back yet."
    - Piece: #222, node `b2-piece-1b-recording` (governance/PLAN.yaml:5537 @ 84a90e26).
    - Closing record: governance/forms/kernel/B2-1B-RECORDING-PREREGISTRATION.md:958 @ 84a90e26.
    - Foundation: #190, closing record governance/forms/kernel/B2-1A-STEP-RECORD-AND-DATASET-REFERENCE-PREREGISTRATION.md:800 @ 84a90e26.
    - Rows: Part AA, AA0 to AA4 (frontends/shell/MANUAL-WALKTHROUGH.md:1904 @ 84a90e26), never run.
    - KL: item 43 (KNOWN-LIMITATIONS.md:402 @ 84a90e26). Its "nothing offers them back" stops being true when 1c step 3 lands (§3).

**Publishing**

18. **Proposal:** "Current view publishes the area the map shows when Export interactive map… is clicked, including after the map fits itself to the data or changes size. It can be chosen once the map has drawn the file's data."
    - The words are item 42's on-main note, compressed (KNOWN-LIMITATIONS.md:196 @ 84a90e26).
    - Piece: #219, node `export-current-view-after-unreported-fit` (governance/PLAN.yaml:4863 @ 84a90e26).
    - Closing record: governance/forms/frontends/EXPORT-CURRENT-VIEW-AFTER-UNREPORTED-FIT-PREREGISTRATION.md:598 @ 84a90e26.
    - Rows: Part Y, Y0 to Y4 (frontends/shell/MANUAL-WALKTHROUGH.md:1858 @ 84a90e26), never run. G1 and N5 were re-worded by #239.
19. **Proposal:** "The approval dialog says that the approval expires after 10 minutes and that the publish then has to be started over."
    - The sentence is in frontends/shell/src/publish/PublishDialog.tsx:17 @ 84a90e26 and is still marked a P6 placeholder (frontends/shell/src/publish/PublishDialog.tsx:10 @ 84a90e26).
    - Piece: #236, node `publish-approval-ttl-ten-minutes` (governance/PLAN.yaml:5980 @ 84a90e26).
    - Closing record: governance/forms/frontends/PUBLISH-APPROVAL-TTL-TEN-MINUTES-PREREGISTRATION.md:223 @ 84a90e26.
    - Rows: G3, re-worded by #236, last run 2026-08-17.
20. **Proposal:** "Closing the window during a publish no longer leaves a staging folder behind, and a second publish no longer takes over a running publish's Cancel."
    - Pieces: #163 and #165, node `publish-attempt-lifecycle-src-tauri` (governance/PLAN.yaml:2995 @ 84a90e26).
    - Closing record: governance/forms/frontends/PUBLISH-ATTEMPT-LIFECYCLE-SRC-TAURI-PREREGISTRATION.md:373 @ 84a90e26.
    - Rows: Part R, R1 (frontends/shell/MANUAL-WALKTHROUGH.md:1537 @ 84a90e26), never run. R1 has its own queue node (governance/PLAN.yaml:4015 @ 84a90e26).
    - KL: item 30's residual (KNOWN-LIMITATIONS.md:336 @ 84a90e26), DRAFT wording.
21. **Proposal:** "Every file of a bundle is scanned before the bundle is put in place. A publish whose bundle would contain a local path, your login name, this computer's name or a credential word is refused by name (`publish.redaction_finding`). The check is a pattern search, not a proof."
    - The words are item 47's headline (KNOWN-LIMITATIONS.md:413 @ 84a90e26).
    - Piece: #241, node `bundle-redaction-scan-not-in-product-publish` (governance/PLAN.yaml:5725 @ 84a90e26).
    - Form, no closing record, last amendment: governance/forms/kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:922 @ 84a90e26.
    - This is security-posture text, so its release-note words are the human's.
    - The ADR-017 note in the human's words is filed in the directive (state/directives/2026-10-28-rulings-by-lane-o1-filler-order-8a-governance-slots-docs-adr-017-note.md:29-37 @ 84a90e26) and is not yet appended (§3).
    - Rows: no walkthrough row exercises the scan.
22. **Proposal:** "A refused publish keeps its own refusal code through to the dialog."
    - Pieces: #148 and #149, node `publish-refusal-codes-and-attempt-lifecycle` (governance/PLAN.yaml:2977 @ 84a90e26).
    - Closing records: governance/forms/kernel/RAW-PATH-CREATE-REFUSAL-CODE-PREREGISTRATION.md:91 @ 84a90e26; governance/forms/frontends/PUBLISH-REFUSAL-CODE-SRC-TAURI-PREREGISTRATION.md:161 @ 84a90e26.

### What was fixed

F1. **The human's words, verbatim** (state/directives/2026-10-28-rulings-by-lane-o1-filler-order-8a-governance-slots-docs-adr-017-note.md:15 @ 84a90e26):

> "Windows: a row filter multiplying two whole-number values that both lay between about 3.04 billion and 4.29 billion could return the wrong rows with no error, because the bundled database's Windows build skipped its overflow check for such products. That database is now compiled with clang-cl on Windows, so such an overflow ends in an error, as it does on macOS and Linux."

- Piece: #266, node `admitted-integer-overflow-silent-wraparound` (governance/PLAN.yaml:3513 @ 84a90e26).
- Closing record: governance/forms/engine/ADMITTED-INTEGER-OVERFLOW-SILENT-WRAPAROUND-PREREGISTRATION.md:532 @ 84a90e26.
- The release node carries the line "verbatim when v0.2's notes are written" (governance/PLAN.yaml:6362 @ 84a90e26).
- The clang-cl installer is first exercised at v0.2's artifact walk (state/directives/2026-10-28-rulings-by-lane-o1-filler-order-8a-governance-slots-docs-adr-017-note.md:14 @ 84a90e26).

F2. **Item 29's line.** It is bound to "the next release's notes" by round 25, item 4, with no GitHub advisory (governance/PLAN.yaml:1845 @ 84a90e26). Proposal: carry KNOWN-LIMITATIONS item 29 as it stands (KNOWN-LIMITATIONS.md:180-188 @ 84a90e26). That item:
- states the general truth first: a bundle carries its author's viewer code, so open bundles only from sources you trust;
- then the specific limit: bundles published before PR #128, every v0.1.0 bundle included, keep a viewer that can stall on crafted partition offsets.

The piece is #128, closing record governance/forms/renderer/PARTITION-OFFSET-BOUNDS-PREREGISTRATION.md:258 @ 84a90e26.

F3. **Proposal:** "Bundles published by this build carry the viewer whose wheel-zoom anchors at the pointer. Bundles published by v0.1.0 keep the old viewer."
- KL item 16 (KNOWN-LIMITATIONS.md:170-177 @ 84a90e26).
- Piece: #53, node `viewer-86-zoom-anchor` (governance/PLAN.yaml:379 @ 84a90e26).
- Form, no closing record, last amendment: governance/forms/renderer/ZOOM-ANCHOR-PREREGISTRATION.md:118 @ 84a90e26.
- Operator run: G11 passed on 2026-09-15 (frontends/shell/MANUAL-WALKTHROUGH.md:1421 @ 84a90e26).

F4. **Proposal:** "Far past Zoom to layer, tiles already drawn no longer vanish while still on screen."
- This was v0.1.0's declared exception, its item 13b (KNOWN-LIMITATIONS.md:131 @ b391e436).
- Piece: #45, node `land-45`, which retired 13b (governance/PLAN.yaml:306 @ 84a90e26).
- Form, no closing record, last amendment: governance/forms/frontends/ENTRY-66B-PREREGISTRATION.md:199 @ 84a90e26.
- Operator run: K7 passed on 2026-09-14 on the dev build (frontends/shell/MANUAL-WALKTHROUGH.md:1418 @ 84a90e26).

F5. **Proposal:** "Under a row filter at wide zooms, a per-tile query that the app's own admission check refuses is now logged and queued again, instead of being dropped."
- The fix is §2's (i) and (iii) of the polish form (governance/forms/frontends/POLISH-87-88-89-PREREGISTRATION.md:20 @ 84a90e26, :22 @ 84a90e26).
- The engine half is #59's lease class, accepted with ADR-033 (governance/forms/frontends/POLISH-87-88-89-PREREGISTRATION.md:133 @ 84a90e26).
- Pieces: #55 and #59 (governance/PLAN.yaml:344 @ 84a90e26, :362 @ 84a90e26).
- Operator run: M16 was discharged on 2026-09-14 (frontends/shell/MANUAL-WALKTHROUGH.md:1420 @ 84a90e26).
- See finding 1 in §5: KNOWN-LIMITATIONS still carries v0.1.0's paragraph on this behaviour, with no on-main note.

F6. **Proposal:** "A long pan at a far-out zoom no longer runs the map away from the pointer: the map's re-centering now waits until the drag ends."
- Piece: #78, which has no PLAN node. Its merge commit `08ca30dd` is titled "fix(canvas): defer the mid-drag origin recenter (recenter-runaway; found investigating entry 95)".
- The form has no amendment. Its measured results are at governance/forms/frontends/PAN-ANCHOR-PREREGISTRATION.md:190 @ 84a90e26.
- The sitting still owes entry 95's pan re-feel (governance/PLAN.yaml:5861 @ 84a90e26), so this line waits on that verdict.

F7. **Proposal:** "A filter whose evaluation fails — an integer overflow, for instance — now ends with a fixed message from the engine that carries no file values and no SQL."
- Pieces: #255 and #268 (governance/PLAN.yaml:3477 @ 84a90e26, :3530 @ 84a90e26).
- Closing records: governance/forms/engine/STREAM-EVALUATION-FAILURE-FIXED-DETAIL-PREREGISTRATION.md:177 @ 84a90e26; governance/forms/engine/STREAM-FETCH-OVERFLOW-FIXED-DETAIL-PREREGISTRATION.md:337 @ 84a90e26.

F8. **Fixed in the data path, not visible in ordinary use.** Proposal: name these in one sentence ("fixes to cancellation, stream and session lifecycles in the engine and kernel"), with this list in the release record rather than in the notes.

| Piece | What it fixed, in its node's words | Node | Closing record |
|---|---|---|---|
| #81 | DuckDB extension autoload and autoinstall OFF at every connection open. **Security-posture text: if named in the notes, the human's words.** | governance/PLAN.yaml:796 @ 84a90e26 | governance/forms/engine/EXTENSION-AUTOLOAD-PREREGISTRATION.md:244 @ 84a90e26 (no closing record; last amendment) |
| #116 | a pending ticket's source dropped under the registry's lock: "a hang" | governance/PLAN.yaml:1558 @ 84a90e26 | none in its form (governance/forms/kernel/TICKET-DROP-UNDER-LOCK-PREREGISTRATION.md:129 @ 84a90e26, its last amendment) |
| #136 | close races: a stray invalidated entry; a generation minted for a closed name | governance/PLAN.yaml:2334 @ 84a90e26 | governance/forms/kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md:418 @ 84a90e26 |
| #146 | a cancel landing just before `stream_arrow` is not lost | governance/PLAN.yaml:3032 @ 84a90e26 | governance/forms/engine/CANCEL-BEFORE-EXECUTE-PREREGISTRATION.md:142 @ 84a90e26 |
| #147 | an `engine.source_changed` refusal no longer reads as cancelled-before-redeemed | governance/PLAN.yaml:2873 @ 84a90e26 | governance/forms/kernel/TICKET-LIVENESS-REDEEM-PREREGISTRATION.md:117 @ 84a90e26 |
| #152 | the audit reader refuses a non-char-boundary slice instead of panicking | governance/PLAN.yaml:3085 @ 84a90e26 | governance/forms/kernel/AUDIT-READER-CHAR-BOUNDARY-PREREGISTRATION.md:215 @ 84a90e26 |
| #176 | no terminal frame waits for credit (a stall) | governance/PLAN.yaml:4261 @ 84a90e26 | governance/forms/protocol/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md:545 @ 84a90e26 |
| #201 | the flush's cancel exit marks the producer cancelled | governance/PLAN.yaml:4933 @ 84a90e26 | governance/forms/engine/STREAM-FLUSH-CANCEL-EXIT-PREREGISTRATION.md:314 @ 84a90e26 (no closing record; last amendment) |
| #258, #269 | a close during an open's admission no longer leaves an open that answers Ok for a dataset the catalog no longer has | governance/PLAN.yaml:3389 @ 84a90e26, :3406 @ 84a90e26 | governance/forms/kernel/KERNEL-CLOSE-DURING-OPEN-ADMISSION-PREREGISTRATION.md:137 @ 84a90e26; governance/forms/kernel/OPEN-DATASET-REFUSES-A-NAME-CLOSED-DURING-ADMISSION-PREREGISTRATION.md:193 @ 84a90e26 |
| #273 | a cancel before execution stops the work, not only the outcome, at the six other attach sites | governance/PLAN.yaml:2714 @ 84a90e26 | governance/forms/engine/ENGINE-CANCEL-BEFORE-EXECUTE-SIBLINGS-PREREGISTRATION.md:151 @ 84a90e26 (no closing record; last amendment) |
| #277 | the producer's cancel returns that the flush piece left unmarked | governance/PLAN.yaml:4951 @ 84a90e26 | governance/forms/engine/STREAM-CANCEL-RETURNS-LEFT-UNMARKED-PREREGISTRATION.md:180 @ 84a90e26 |

The rest of the 225 pieces are tests, governance, documentation or other internal changes. `COVERAGE.md` §3 lists each one.

### What is declared in KNOWN-LIMITATIONS.md

Proposal for the notes: one line per item, in the v0.1.0 tag message's style (state/drafts/tag-message-v0.1.0.md:9-34 @ 84a90e26), written from `KNOWN-LIMITATIONS.md` **after** it is rewritten for the v0.2 artifact. The rewrite comes after the release Part, with KNOWN-LIMITATIONS last (governance/RELEASE-DAY-CHECKLIST.md:14 @ 84a90e26). Until then, this is what the file holds at `84a90e26`, in three groups.

**(a) v0.1.0's items, as they stand on main.**

| Item | Line | State on main | Pieces since the tag that edited it |
|---|---|---|---|
| 1 Windows only | KNOWN-LIMITATIONS.md:14 @ 84a90e26 | stands. Gains the per-platform levels paragraph (Linux L1; macOS none) at KNOWN-LIMITATIONS.md:20-30 @ 84a90e26 | #162 |
| 2 two pinned CRSs, three refusals | KNOWN-LIMITATIONS.md:34 @ 84a90e26 | two refusals lifted on main, in the on-main paragraph at KNOWN-LIMITATIONS.md:60 @ 84a90e26. Its quoted `engine.crs_undeclared` text is v0.1.0's, and #206 changed the message (finding 2) | #205, #214 |
| 3 identity must exist | KNOWN-LIMITATIONS.md:62 @ 84a90e26 | session tier on main, in the on-main paragraph at KNOWN-LIMITATIONS.md:70 @ 84a90e26 | #204 |
| 4 styling by literal only | KNOWN-LIMITATIONS.md:72 @ 84a90e26 | stands until milestone 4 PR B. "No project file" stands until 1c | — |
| 5, 6 publish ceilings | KNOWN-LIMITATIONS.md:79 @ 84a90e26, KNOWN-LIMITATIONS.md:90 @ 84a90e26 | stand | — |
| 7 declared partial view | KNOWN-LIMITATIONS.md:96 @ 84a90e26 | stands (no LOD tier selection) | — |
| 8 a filter is never published | KNOWN-LIMITATIONS.md:105 @ 84a90e26 | stands, corrected 2026-10-10 | #200 |
| 9 polygons only, WKB, covering | KNOWN-LIMITATIONS.md:109 @ 84a90e26 | polygons-only superseded on main by item 31. The covering sentences were added at KNOWN-LIMITATIONS.md:114 @ 84a90e26 and KNOWN-LIMITATIONS.md:117 @ 84a90e26 | #182, #197, #252 |
| 10 one file, nothing remembered | KNOWN-LIMITATIONS.md:120 @ 84a90e26 | stands until 1c | — |
| 11, 12 | KNOWN-LIMITATIONS.md:126 @ 84a90e26, KNOWN-LIMITATIONS.md:133 @ 84a90e26 | stand | — |
| 13 drag release leaves re-pick inert | KNOWN-LIMITATIONS.md:141 @ 84a90e26 | stands. Its neighbour 13b was retired by #45 (F4) | #45 |
| 14 unsigned | KNOWN-LIMITATIONS.md:148 @ 84a90e26 | stands. The architect's exclusion table: "v0.2 ships unsigned (item 14)" (state/consults/2026-10-23-v0-2-scope-proposal-architect.md:57 @ 84a90e26) | — |
| 15 no VC++ runtime | KNOWN-LIMITATIONS.md:156 @ 84a90e26 | stands. Its "open decision" wording is stale against 69a (architect finding, state/consults/2026-10-23-v0-2-scope-proposal-architect.md:203 @ 84a90e26) | — |
| unnumbered filter paragraph | KNOWN-LIMITATIONS.md:164 @ 84a90e26 | no on-main note, though F5 changed the behaviour it describes (finding 1) | — |
| 16, 29 bundles published before a viewer fix | KNOWN-LIMITATIONS.md:170 @ 84a90e26, KNOWN-LIMITATIONS.md:180 @ 84a90e26 | scope lines that stand for old bundles. Item 29's line is bound to the notes (F2) | #128, #215 |
| 42 Current view | KNOWN-LIMITATIONS.md:193 @ 84a90e26 | fixed on main, in the on-main note at KNOWN-LIMITATIONS.md:196 @ 84a90e26 | #215, #219 |
| 44 epoch, `edges`, third axis | KNOWN-LIMITATIONS.md:199 @ 84a90e26 | stands | #223 |

**(b) New on main ("On main since v0.1.0 — not in any release yet", KNOWN-LIMITATIONS.md:202 @ 84a90e26).** These move into v0.2's list at the rewrite. "DRAFT" means the item's source comment marks its words "DRAFT wording for the human's sight". KNOWN-LIMITATIONS items are not red-line texts under the typed-words rule (state/directives/2026-10-11-merges-210-211-pilot-recorder-2f-milestone-3-rulings.md:16 @ 84a90e26), but the markers say each still awaits the human's sight.

| Item | Headline (abridged from the file) | Line | Wording |
|---|---|---|---|
| 17 | degrees: own anchor span and drift cap; `MAX_ZOOM` and fit constants stay metric | KNOWN-LIMITATIONS.md:207 @ 84a90e26 | DRAFT |
| 19 | the change detector is heuristic, not a snapshot | KNOWN-LIMITATIONS.md:232 @ 84a90e26 | — |
| 20 | a partitioned source is refused; a single file only | KNOWN-LIMITATIONS.md:248 @ 84a90e26 | — |
| 21 | a dataset in degrees cannot be published | KNOWN-LIMITATIONS.md:259 @ 84a90e26 | — |
| 22 | a sanity check convicts, never confirms | KNOWN-LIMITATIONS.md:269 @ 84a90e26 | — |
| 23 | where the watch does not end the session, a pan inside residency shows nothing of a change | KNOWN-LIMITATIONS.md:280 @ 84a90e26 | human's |
| 24 | the advisory watch runs on Windows only | KNOWN-LIMITATIONS.md:296 @ 84a90e26 | — |
| 25 | an in-place write's signal is not guaranteed before the writer's handle closes | KNOWN-LIMITATIONS.md:303 @ 84a90e26 | — |
| 26 | one ancestor watched; a retargeted symlink is not seen while idle | KNOWN-LIMITATIONS.md:312 @ 84a90e26 | — |
| 27 | a rename changing only a non-1:1-uppercase character is not recognised | KNOWN-LIMITATIONS.md:320 @ 84a90e26 | — |
| 28 | a `dataset_session_ended` event can be lost | KNOWN-LIMITATIONS.md:328 @ 84a90e26 | — |
| 30 | an undrained exit can leave a hidden staging directory | KNOWN-LIMITATIONS.md:336 @ 84a90e26 | DRAFT |
| 31–38 | geometry types: what is read, published, LOD-built, drawn and picked | KNOWN-LIMITATIONS.md:355-389 @ 84a90e26 | DRAFT |
| 40, 41 | selection ends at reopen or source change; the hidden count carries no reason | KNOWN-LIMITATIONS.md:394 @ 84a90e26, KNOWN-LIMITATIONS.md:398 @ 84a90e26 | DRAFT |
| 43 | a crash leaves filter and style changes; nothing offers them back yet | KNOWN-LIMITATIONS.md:402 @ 84a90e26 | approved as drafted (KNOWN-LIMITATIONS.md:403 @ 84a90e26) |
| 45, 46 | filter cards; `@` completion lists at most 200 names | KNOWN-LIMITATIONS.md:405 @ 84a90e26, KNOWN-LIMITATIONS.md:409 @ 84a90e26 | both approved as drafted (KNOWN-LIMITATIONS.md:407 @ 84a90e26, :411 @ 84a90e26) |
| 47 | the redaction scan refuses by pattern, not proof | KNOWN-LIMITATIONS.md:413 @ 84a90e26 | — |
| 51, 52 | attributes not held past 268,435,456 bytes; hover shows no attributes | KNOWN-LIMITATIONS.md:423 @ 84a90e26, KNOWN-LIMITATIONS.md:427 @ 84a90e26 | DRAFT |
| 53 | covering or primary-column name collisions refused at open | KNOWN-LIMITATIONS.md:431 @ 84a90e26 | DRAFT |
| 54–56 | the Table's Filtered cap of 1,000; Selected count; refusals for want of a connection | KNOWN-LIMITATIONS.md:436-444 @ 84a90e26 | DRAFT |

Numbers 48 to 50 are reserved for piece 1c (state/consults/2026-10-23-v0-2-scope-proposal-architect.md:46 @ 84a90e26). They do not exist on main.

**(c) Retired on main:** item 18 (KNOWN-LIMITATIONS.md:225 @ 84a90e26), item 39 (KNOWN-LIMITATIONS.md:391 @ 84a90e26) and v0.1.0's 13b (F4).

### Not in v0.2.0

Proposal: the v0.1.0 body's "Not in" paragraph (state/drafts/github-release-body-v0.1.0.md:26-28 @ 84a90e26), refreshed from the architect's exclusion table (state/consults/2026-10-23-v0-2-scope-proposal-architect.md:52-68 @ 84a90e26):

> macOS and Linux artifacts (open gates; Linux has CI level L1 only); code signing; a bundled Visual C++ runtime; level-of-detail tiles at overview zoom; a filter carried in a bundle; snapshots, lineage and replay; true scan progress (ADR-029); attributes on hover; publishing data in degrees or in any geometry type but Polygon; editing, notebooks, MCP, plugins, AI.

Two things in that list depend on 1c and PR B landing: "styling by literal only" and "nothing is remembered" leave the list when they do (§3).

### Notices, licence, provenance

[Kept in the v0.1.0 shape (state/drafts/tag-message-v0.1.0.md:38-49 @ 84a90e26): the three notice files, ADR-030, the licence layers, the Corresponding Source route, then the build commit, the docs-only `git diff --stat` and the release Part's record. The licence and notice text are red lines (state/directives/2026-10-11-merges-210-211-pilot-recorder-2f-milestone-3-rulings.md:16 @ 84a90e26), so these stay the human's. One fact to carry: the bundled DuckDB is now built with clang-cl on Windows, and its build of record is the human's sentence in state/directives/2026-10-28-rulings-by-lane-o1-filler-order-8a-governance-slots-docs-adr-017-note.md:12 @ 84a90e26. The compiler-rt listings go to the ADR-030 record as ruled: none is one sentence there, any is a stop (state/directives/2026-10-28-rulings-by-lane-o1-filler-order-8a-governance-slots-docs-adr-017-note.md:13 @ 84a90e26).]

---

## 2. What the notes must carry, by ruling, and where this draft stands on each

| Must carry | Source | In this draft |
|---|---|---|
| installer, SHA-256 and KNOWN-LIMITATIONS link above the fold | state/consults/2026-10-23-v0-2-scope-proposal-architect.md:89 @ 84a90e26 | slot (§1, title block) |
| what v0.2 is | :90 @ 84a90e26 | proposed (§1) |
| the limits digest | :91 @ 84a90e26 | proposed, with the source table (§1) |
| licences and the AGPL §6 route | :92 @ 84a90e26 | slot |
| the build commit and the docs-only diff stat | :93 @ 84a90e26 | slot |
| item 29's line | governance/PLAN.yaml:1845 @ 84a90e26 | F2 |
| the O1 line in the human's words | state/directives/2026-10-28-rulings-by-lane-o1-filler-order-8a-governance-slots-docs-adr-017-note.md:15 @ 84a90e26 | F1, verbatim |
| the README's works-today statement: the release, only the rows the sitting verified, main named as ahead | governance/RELEASE-DAY-CHECKLIST.md:15 @ 84a90e26 | slot. Every "changed" line names its rows, and none has a verified run yet |
| nothing presenting ADR-011, ADR-012, ADR-023 (unless accepted), ADR-024 or ADR-029 as settled | state/consults/2026-10-23-v0-2-scope-proposal-architect.md:95 @ 84a90e26 | held. The draft names ADR-029 only as open, and ADR-033 and ADR-030 as accepted |
| no performance statement | governance/RELEASE-0.1.md:148-149 @ 84a90e26 | held. The only figures are declared constants and limits quoted from the tree, plus the human's own figures in F1 |
| pre-release, `v0.2.0` | state/directives/2026-10-23-weekend-open-items-ruled-verify-cites-pin-covering-case-port-2-session-log-test-feature-v0-2-findings-graded.md:13 @ 84a90e26 | title block |

---

## 3. Slots for v0.2's ruled scope that is not on main at 84a90e26 (no words)

| Slot | Node | State at 84a90e26 | What it changes in the notes |
|---|---|---|---|
| Milestone 4 PR B: colour by category over a projected text column, with its legend | `b1-shell-half` (governance/PLAN.yaml:2370 @ 84a90e26); `record-step-style-match-widening` (governance/PLAN.yaml:6031 @ 84a90e26) | PR B after 1c step 1; the widening proposed | item 4 changes; a "changed" line for colour by category |
| Piece 1c, steps 1 to 3: Save project (linked), Open project, the recovery offer | `b2-piece-1c-save-and-reopen` (governance/PLAN.yaml:5639 @ 84a90e26) | in progress (O0 waits on the human) | items 4, 10 and 43 need on-main notes (state/consults/2026-10-23-v0-2-scope-proposal-architect.md:202 @ 84a90e26); KL 48 to 50 |
| Session-log token redaction | `session-log-token-redaction-rests-on-page-code` (governance/PLAN.yaml:5776 @ 84a90e26) | blocked on 1c step 1 | security-posture text: the human's words |
| The ADR-017 note | `adr-017-note-product-redaction-gate` (governance/PLAN.yaml:6048 @ 84a90e26) | in progress | line 21's ADR status |
| B1's close and ADR-023's acceptance | `entry-79-b1-consult-items` (governance/PLAN.yaml:1223 @ 84a90e26) | blocked | whether ADR-023 may be named as settled |
| N1 to N7, the shipped-string wording | `sitting-wording-n1-to-n7` (governance/PLAN.yaml:6099 @ 84a90e26) | blocked on the sitting | any string quoted in the notes |
| The sitting, and the release Part (Part M's successor) | `operator-sitting-queue` (governance/PLAN.yaml:5861 @ 84a90e26); `m13-bracketed-values` (governance/PLAN.yaml:1241 @ 84a90e26) | blocked on the human's date | which "changed" lines may be claimed |
| PORT-2, macOS L1 | `port-2-macos-l1-and-app-dirs` (governance/PLAN.yaml:3602 @ 84a90e26) | in progress | item 1's levels paragraph only |

---

## 4. Proposed order of the notes

1. Title.
2. Installer and hash.
3. Read first.
4. What v0.2.0 is.
5. What works today (the README statement, from the sitting).
6. What changed (lines 1 to 22, keeping only those the sitting verified).
7. What was fixed (F1 to F7; F8 as one sentence).
8. Declared limits (the digest).
9. Not in v0.2.0.
10. Notices and licence.
11. Provenance.

This is v0.1.0's GitHub body order (state/drafts/github-release-body-v0.1.0.md:4-53 @ 84a90e26), with "what changed" and "what was fixed" added for a release that has a predecessor.

---

## 5. Findings while drafting (for the human; nothing here is decided)

1. **KNOWN-LIMITATIONS' unnumbered filter paragraph has no on-main note.**
   - The paragraph (KNOWN-LIMITATIONS.md:164-167 @ 84a90e26) says refused per-tile queries "never run". Its source comment says the fix is "queued post-tag".
   - #55 and #59 built that fix (F5), and the sitting discharged M16 on 2026-09-14.
   - The v0.1.0 truth stands for the v0.1.0 artifact. The v0.2 rewrite needs either the paragraph's retirement or a re-read of what main does at that zoom. I did not re-read the code to settle which.
2. **KNOWN-LIMITATIONS item 2 quotes v0.1.0's `engine.crs_undeclared` message** (KNOWN-LIMITATIONS.md:45-47 @ 84a90e26). Main's message is different (engine/src/error.rs:285-288 @ 84a90e26, from #206). The v0.2 rewrite quotes the new one.
3. **Item 9's "Polygons only"** (KNOWN-LIMITATIONS.md:109 @ 84a90e26) is superseded on main by item 31, and item 9 does not point to item 31. The rewrite merges them.
4. **Most on-main items still carry DRAFT-wording markers.** They are 17, 30 to 38, 40, 41 and 51 to 56, plus item 9's appended sentence (§1 (b)). The human's sight of each comes before the rewrite, whether or not the 2026-10-11 rule makes it a red line.
5. **Seventeen operator-facing or data-path forms record no closing-record amendment.** They are the forms of #45, #53, #64, #78, #81, #93, #102, #112, #116, #141, #201, #206, #207, #214, #241, #252 and #273. Their pins above fall on the last amendment or the results section. Whether a closing record is owed for each is the custodian's call under the record cap.
6. **#78 has no PLAN node.** The sitting's entry 95 re-feel is the only open record of its effect on an operator (F6).
7. **No walkthrough row has an operator-verified run since its last change.** That includes the rows behind every "changed" line, so §1 claims nothing yet. `COVERAGE.md` gives the row-by-row list for the sitting, including six Parts and two rows that are not on the sitting queue.
