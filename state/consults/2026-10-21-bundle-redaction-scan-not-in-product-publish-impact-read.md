*Custodian's filing note (2026-10-21): lead-data's impact read for the redaction scan, which the human asked for before its form is committed, read at main ab9a4b4f. It wrote no file (no Write, Edit or Bash); the report is filed as handed back, its preamble lines included. The run 2026-10-21T08:22:04Z to 08:34:01Z by its transcript (Grep 77, Read 69, Glob 4); its one SubagentHandback call, at 08:34:00Z. Extracted by script from that call, with nothing changed except one final newline. Its sha256, from line 5 to the end, is 77a18b98496d5851584206f198e4b08ee7929e442f4e689133f3d53c0c22734e.*

---

Result: impact read for bundle-redaction-scan-not-in-product-publish written below, at main ab9a4b4f. It is pointers only and has five questions.
Blocking questions: none.
Report path: C:/dev/spatial-ide/state/consults/2026-10-21-bundle-redaction-scan-not-in-product-publish-impact-read.md
sha256: not computed. I have no shell and wrote no file, so the custodian computes it from the filed bytes (pilot §7; C3).

---

# Impact read — bundle-redaction-scan-not-in-product-publish (lead-data, second pilot)
Read at: main ab9a4b4f

Pointers only. Every path:line below was read at ab9a4b4f. The draft (state/consults/2026-10-21-bundle-redaction-scan-not-in-product-publish-architect-draft.md) pins at 54d07268. I spot-checked its cites into the following files, and each reads the same lines at ab9a4b4f:
- kernel/src/publish/mod.rs (:636, :807-808, :833, :837-852, :902, :905, :927-930, :933, :934, :1438-1460, :1524-1581, :1612-1629, :1645-1668, :1204-1210)
- kernel/src/bundle/redaction.rs (:117-142, :146-166, :179, :220-307, :338-365)
- kernel/src/permission/boundary.rs (:203-250, :280-310, :453, :482-506)
- kernel/src/permission/audit/reader.rs (:226-284)
- kernel/src/publish/error.rs (:247-278, :467)
- kernel/src/publish/viewer_assets.rs (:35)
- frontends/shell/src-tauri/src/publish.rs (:858-862, :1383-1395, :1856, :3163)
- frontends/shell/src/publish/formatPublishRefusal.ts (:44)
- docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md (:500-511, :947-948, :1076-1093, :1123-1125)

One correction to the draft: at :256 of kernel/src/permission/audit/log.rs is the `scan` call. Lines :249-255 build its `MachineIdentifiers`.

## 1. Interfaces

### 1.1 The product publish path, from the staged files to the hand-over
- **Gated entry:** `spatial_kernel::permission::boundary::execute`, kernel/src/permission/boundary.rs:313-455. Its order doc is at :4-19, and it calls `publish::publish_prepared` at :423.
- **Ungated entry:** `publish_unguarded`, kernel/src/publish/mod.rs:607-614. It stays `pub`, and the residual is stated at mod.rs:24-30 and kernel/README.md:251-252.
- **`publish_prepared`** (mod.rs:620-655):
  - the destination pre-check is at :631-635;
  - the staging directory is created at :636;
  - the error arm removes the staging directory, or returns `StagingNotRemoved`, at :640-653.
- **`run` and `run_inner`:** mod.rs:671-685 and :687-949. The order-of-operations doc is at :44-58, and the declared recovery policy (ADR-010 rule 7) at :60-64.
- **`Staging`:**
  - `create`, mod.rs:1438-1460; the hidden sibling name is at :1451;
  - `write`, `write_partition` and `write_inner`, :1485-1581. The hash is taken over the in-memory buffer, :1477-1484 and :1580;
  - `total_bytes` reads metadata only, :1583-1603;
  - `finalize` does the single rename, :1612-1629;
  - `remove`, :1631-1642;
  - `Drop`, :1645-1668.
- **Hand-over:** `staging.total_bytes()` is at mod.rs:933 and `staging.finalize` at :934. `PublishOutcome` is returned at :936-948.
  - The boundary's outcome record is at boundary.rs:426-454. Its `manifest_hash` reads `manifest.json` after the rename, at :428 and :528-532.
  - In `run_inner` and `Staging` as read, no staged file is read back from disk before the rename.
- **Authoritative sources:**
  - ADR-017 §15 (docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:543-572) and Corrigendum 4 (:1044-1108);
  - kernel/README.md:206-269;
  - kernel/PERMISSION-BOUNDARY.md.
- **Tests that pin it:**
  - the index rows kernel/README.md:372-373 and the tests they name;
  - kernel/tests/publish.rs::cancelling_mid_publish_leaves_no_bundle_and_no_staging_directory (:485);
  - in kernel/tests/permission_boundary.rs:
    - ::granted_and_approved_publishes_and_records_a_success_with_the_manifest_hash (:525);
    - ::a_cancel_mid_publish_cleans_up_and_is_audited_as_cancelled (:574);
    - ::the_permission_boundary_is_the_only_caller_of_the_publish_operation_in_this_crate (:840-908). This one scans kernel/src for `publish_unguarded(` and `publish_prepared(` outside publish/mod.rs (:866, :884).

### 1.2 The scanner, and its current callers
- **kernel/src/bundle/redaction.rs:**
  - module doc, :4-47;
  - `Finding`, :49-59, which carries `excerpt`;
  - `OPERATOR_DECLARED`, :68;
  - `ATTRIBUTABLE_CLASSES`, :85;
  - `MachineIdentifiers`, :89-112, and `from_environment`, :117-142;
  - `CREDENTIAL_NEEDLES`, :146-166;
  - `MIN_PRINTABLE_RUN`, :179;
  - `in_printable_run`, :182-196;
  - `declared_ranges`, :204-217;
  - `scan`, :220-307;
  - `finding`, :309-318;
  - `find_all_ascii_ci`, :320-335;
  - `scan_directory`, :338-365.
- **Callers, found by searching every `*.rs` file at ab9a4b4f:**
  - `scan_directory` is called only at kernel/tests/publish.rs:441 and :477.
  - `scan` has one product caller, the audit record check in kernel/src/permission/audit/log.rs:
    - the import is at :76;
    - the identifiers are built at :249-255;
    - the call is at :256;
    - a `credential` finding is fatal at :258-263.
  - `MachineIdentifiers::from_environment` is also called at kernel/src/permission/audit/normalize.rs:145.
  - `MIN_PRINTABLE_RUN` is used at log.rs:466.
  - Comment-only mentions: kernel/src/permission/error.rs:211 and kernel/tests/no_generation_in_persisted_artifacts.rs:203.
- **Authoritative sources:**
  - ADR-017 §13, :500-511;
  - Corrigendum 3's docs/09 subsection, :922-948;
  - docs/09_Security_and_Privacy.md:27.
- **Tests that pin it:**
  - redaction.rs unit tests at :386, :425, :467, :482, :502, :516, :537, :545 and :569;
  - kernel/tests/publish.rs::the_redaction_scan_passes_over_every_byte_of_an_emitted_bundle, :420-482, over a synthetic viewer (:94-116);
  - on the audit side, kernel/tests/permission_boundary.rs::a_credential_in_the_recorded_destination_refuses_before_the_record_is_written (:774).
- **The owner's index** has no row naming `spatial_kernel::bundle::redaction` (kernel/README.md:361-378). The only "redaction" in kernel/README.md is the audit-log row at :231.

### 1.3 The refusal codes on that path
- **`PublishError`** (kernel/src/publish/error.rs):
  - the enum starts at :16;
  - `code()` is at :247-278 and has no wildcard arm (doc :245-246);
  - `refusal_detail()` is at :284-286;
  - `Display` starts at :293;
  - `classify_io` is at :467.
- **The boundary:**
  - `error_kind`, boundary.rs:203-250, records a variant name and never a message (:200-202);
  - `outcome_of`, :257-270;
  - `publish_outcome`, :280-310; `StagingNotRemoved` recurses at :283;
  - `finish`, :482-506.
- **The audit reader:** `plain_reason` is at kernel/src/permission/audit/reader.rs:226-284, with its fallback arm at :282. Today `GeometryEncodingNotPublishable`, `ReaderCeilingExceeded` and `Cancelled` have no arm, so they reach :282.
- **The shell:**
  - mapping, frontends/shell/src-tauri/src/publish.rs:858-866;
  - parser, frontends/shell/src/publish/formatPublishRefusal.ts:37-49, with the prefix regex at :44;
  - guidance dispatch, frontends/shell/src/admission/formatRefusal.ts:118.
- **The CLI** prints the refusal's `Display`: kernel/src/bin/publish-bundle.rs:142-173.
- **SKP-V0** records the `"<code>: <display>"` prefix convention for publish refusals that reach the shell, and says it is not a wire change: protocol/skp/SKP-V0.md:783-795.
- **Tests that pin it:**
  - kernel/tests/typed_terminal_codes.rs::a_publish_refusal_detail_begins_with_its_typed_code (:411-453) and ::a_geometry_encoding_refusal_detail_begins_with_its_typed_code (:455-467 onward);
  - frontends/shell/src-tauri/src/publish.rs::an_execute_time_publish_refusal_carries_its_typed_code_and_a_permission_refusal_does_not (:2840);
  - frontends/shell/src/publish/formatPublishRefusal.test.ts:30-102;
  - frontends/shell/src/publish/PublishPanel.test.ts:170-181.

## 2. The cost of re-reading every emitted file

### 2.1 Where each emitted file's bytes come from, and how large they get
- **`data/part-NNNNN.arrows`:**
  - Source: the engine's `stream_for_publish` (kernel/src/publish/mod.rs:733) into `payload` (:755-758), written at :807-808.
  - One partition is one `TaggedBatch` (engine/README.md:439-442).
  - Ceilings in engine/src/stream.rs:
    - `PUBLISH_PARTITION_TARGET_BYTES` 1 MiB, :131;
    - `PUBLISH_PARTITION_ROWS` 8,192, :171;
    - `MAX_BATCH_BYTES` 4 MiB, :49;
    - the assertion that the target is below `MAX_BATCH_BYTES`, :209;
    - `MAX_PUBLISH_PARTITIONS` 100,000, :174, refused at mod.rs:800-806.
  - Recorded at 100k features: 51 partitions, 44,141,400 B, ranging 120,840 to 880,712 B (kernel/RESULTS.md:1389-1390).
  - Recorded at 5 GB: 6,636 partitions, 5,737,397,728 B (kernel/RESULTS.md:1731-1732).
- **`style.json`:**
  - Source: `style.canonical_json()` at mod.rs:833.
  - Recorded: 327 B (kernel/RESULTS.md:1393).
- **`viewer/<asset>`:**
  - Source: `req.viewer` at mod.rs:839-852.
  - Bounds: `MAX_VIEWER_ASSETS` 64 and `MAX_VIEWER_ASSET_BYTES` 16 MiB (kernel/src/publish/viewer_assets.rs:33 and :35; ADR-017:601-602).
  - In the shell the assets come from `renderer/bundle-viewer/dist` (frontends/shell/src-tauri/src/publish.rs:1383-1395, :1400-1402).
  - That directory is built by renderer/bundle-viewer/build.mjs:26-42. `NOTICE.txt` is generated by renderer/bundle-viewer/notice.mjs:109 onward, and the AGPL text is included from :164.
  - In the CLI the assets come from `--viewer` (kernel/src/bin/publish-bundle.rs:520).
  - Recorded: `viewer/app.js` 437,588 B (kernel/RESULTS.md:1327).
- **`manifest.json`:**
  - Source: mod.rs:901-902. The viewer-license strings are carried unchanged, mod.rs:1204-1210.
  - Recorded: 16,020 B at 100k (kernel/RESULTS.md:1391).
- **`build-info.json`:**
  - Source: mod.rs:917-930. Its field set is closed (ADR-017:496-498).
  - Recorded: 394 and 395 B (kernel/RESULTS.md:1328).
- **The whole bundle at 100k:** 44,590,715 B, and 44,601,149 B after the correction pass (kernel/RESULTS.md:1388, :1329).

### 2.2 The declared datasets
- **The 5 GB hero source** holds 3,300,000 rows (kernel/RESULTS.md:1724).
  - A whole-file publish of it is refused at preflight above `MAX_FEATURES` 2,000,000. Sources: KNOWN-LIMITATIONS.md:79-88; kernel/src/publish/ceilings.rs:133-157; the figures in renderer/bundle-viewer/ceilings.json, compiled in at ceilings.rs:36; ADR-025's Status line, docs/adr/ADR-025-publish-above-the-readers-ceilings.md:3.
  - The 5,737,397,728 B publish of record is from the fifth section (kernel/RESULTS.md:1610, dated 2026-08-07). That section records the viewer refusing the bundle, not the publish (:2119-2134).
- **`MAX_RESIDENT_BYTES` is checked at no stage** (ceilings.rs:107-116; KNOWN-LIMITATIONS.md:90-94). `predicted_features` is `None` on the `DeclaredNotVerified` identity route (ceilings.rs:114-119).
- **docs/08's Polygons class** is 100k features with 10M vertices (docs/08_Testing.md:31). The fourth section's 100k fixture is not that class (kernel/RESULTS.md:1475-1476).

### 2.3 How the scanner reads a file today
- **`scan_directory`:**
  - walks depth-first with sorted entries (redaction.rs:343-353);
  - reads each file whole with `std::fs::read` (:359);
  - keeps every file's findings and sorts them all at the end (:342, :360, :363).
- **`scan`** takes one byte slice (:220) and makes these passes over it:
  - one pass per entry of `CREDENTIAL_NEEDLES`, 19 entries (:146-166), through `find_all_ascii_ci` (:244-256, :320-335);
  - one pass for the drive-letter rule (:260-277);
  - one pass per username and per hostname (:279-304);
  - one pass per declared string, in `declared_ranges` (:204-217).
- Each match walks outward to measure its printable run (:182-196).
- Each `Finding` copies an excerpt of up to 24 bytes on either side of the match (:309-318).
- The module has no chunked entry point, no cancellation parameter and no progress callback (signatures :220 and :338-341).
- It declares no ceiling on the number of findings in a file (module read whole, :1-365).

### 2.4 What reports progress and answers a cancel on that path
- **Phases:** `PublishPhase` is at kernel/src/publish/mod.rs:186-210, and `as_str` at :212-225.
  - `Finalizing` is reported at :905, followed by one `watch.check()` at :906.
  - Between :906 and `finalize` at :934 there is no further check. That stretch holds the heuristic re-check (:911), `total_bytes` (:916, :933) and the sidecar write (:927-930).
- **`CancelWatch`:** mod.rs:960-1004.
  - `check` is at :975-981;
  - `observe` stamps `cancellation_observed` once, :997-1003;
  - `run` stamps it on `Cancelled`, :679-683.
- **Writes outside partitions** have no in-write check (`write_inner`'s `None` arm, :1546-1548; the doc at :1489-1494).
  - A check runs before each viewer asset, at :840.
- **`PublishProgress`:** the trait is at mod.rs:232-254. Five implementations exist, one of them a frozen measurement harness (:229-231).
- **Trace span names:** mod.rs:160-177. None is a finalize span.
- **The cancellation taxonomy:**
  - kernel/CANCELLATION-AND-TRACING.md:83-117;
  - ADR-017 Corrigendum 4's table, :1076-1093;
  - ADR-018 §1 to §6, docs/adr/ADR-018-what-cancellation-acknowledged-means.md:41-107.
- **The exit drain:**
  - `EXIT_DRAIN_CEILING` is 30 s (frontends/shell/src-tauri/src/publish.rs:1057), awaited at frontends/shell/src-tauri/src/lib.rs:588.
  - KNOWN-LIMITATIONS item 30 (KNOWN-LIMITATIONS.md:334-351) says a cancel that arrives after the last cancel check lets the publish finish.

### 2.5 Recorded publish figures
- **docs/08** has no row for publish duration or memory (budgets, docs/08_Testing.md:5-9). Its cancellation row is :8.
- **kernel/RESULTS.md, fourth section:**
  - build wall times, individual observations, :1396;
  - content-hash times, :1397;
  - the product scanner, run by hand: 56 files, 0 findings (:1314-1315, :1359);
  - the scan stated as a necessary condition only, :1454.
- **kernel/RESULTS.md, fifth section:**
  - the 5 GB publishes, A and B, :1728;
  - the cancellation cells, :1985-1989;
  - the inter-partition cadence, :1972-1974;
  - the verdict, MISSED, :1729 and :1991-1994;
  - the strict reader's full re-read of the 5 GB bundle, 29,384.239 ms by its own clock, :1732;
  - the wall times may not be differenced, :1745-1754.
- **The source pin's cost** on the 100k fixture: engine/README.md:454-460 and kernel/README.md:265-269.
- **Harness ceilings on a whole publish:**
  - kernel/tests/scale_pass_a6.rs:81-92 (`CEIL_CADENCE_PUBLISH`, and `SILENCE_PUBLISH` with the declared per-phase silences at :88-92);
  - the watchdog's silence between progress reports, kernel/tests/support/mod.rs:238-256.

## 3. Consumers in other modules
- **The shell's publish binding** (frontends/shell/src-tauri/src/publish.rs):
  - `execute_with_progress`, :718-867. The outcome mapping is at :839-866, and `Success` carries `build_millis` at :848;
  - `EventProgress` emits `PublishPhase::as_str` verbatim, :874-926;
  - `bundled_viewer`, :1383-1395, and `bundled_viewer_license`, :1575-1594. These are the product's two would-be declared strings;
  - `PENDING_ATTEMPT_TTL`, :69;
  - tests: :1856, the phase-event test at :2105-2148 (it asserts that `writing-manifest` crossed, :2147), :2840, the `staging_entries` helper at :3163, and the synthetic test viewer at :1679-1705;
  - the `binding_publish_*` commands are named at kernel/README.md:242-246.
- **The dialog and panel:**
  - frontends/shell/src/publish/PublishDialog.tsx:148-165 subscribes to phases, and :314-316 shows the raw phase string with no duration;
  - frontends/shell/src/publish/PublishPanel.tsx:263 and :304 pass refusals through `formatPublishRefusal`;
  - frontends/shell/src/publish/types.ts:78-83 says `build_millis` is unused by every renderer, and :98-110 describes the progress event;
  - frontends/shell/src/publish/client.ts:159 names the event;
  - frontends/shell/src/publish/client.test.ts:184 sends a `finalizing` event.
- **The e2e suites:**
  - frontends/shell/e2e/publish.mjs:
    - APPROVED' expects success, runs verify-bundle and checks the audit records for needles, :373-392;
    - REFUSED', :402-454;
    - FILTERED', :458-532;
    - step timeouts, :617-640, and the suite deadline, :535;
    - its own needle subset over audit records, :70-85;
    - its fixture, :54-61, whose zone values are at engine/src/fixture.rs:342.
  - frontends/shell/e2e/exportElapsed.mjs:17-29 compares the prepare-to-execute time with the TTL read from publish.rs.
  - frontends/shell/e2e/selection.mjs:
    - E-EXPORT, :567-592;
    - E-SCOPE, :594-611;
    - E-ASK, :613-629, which needs the export still running when the ask is read.
  - frontends/shell/e2e/README.md:179-222 holds the publish suite's entry.
- **The CLI** (kernel/src/bin/publish-bundle.rs):
  - `Console` prints each phase, :122-140;
  - the refusal's `Display` is printed at :166-171;
  - the facts printed include build ms and content-hash ms, :658-668;
  - the viewer-license flags are at :11-18 and :358-373.
  - Callers: kernel/tests/publish_cli.rs:117, and the harnesses kernel/tests/scale_pass.rs:1163 and kernel/tests/import_layout_publish_determinism.rs:186.
- **The verifier:** `verify-bundle` (index row kernel/README.md:376), which e2e/publish.mjs runs in APPROVED' and FILTERED'.
- **The bundle viewer** is the source of the `viewer/` bytes (renderer/bundle-viewer/build.mjs:26-42; notice.mjs).
  - A search of renderer/bundle-viewer/src for build_millis, build-info, refus and phase found no read of publish phases, refusal codes or build timings. Its only mention of `build-info.json` is at manifest.ts:480.
  - It refuses a bundle at its ceilings, for example at renderer/bundle-viewer/src/main.ts:556.
- **The manual walkthrough** (frontends/shell/MANUAL-WALKTHROUGH.md):
  - G5, :328, reads a phase line that lists finalizing;
  - G6, :329, reads the audit log;
  - H6, :451, and H8, :453, are the 5 GB phases and cancel;
  - R1, :1548, is an exit during a publish.
- **protocol/:** no consumer found. SKP-V0.md:783-795 is the convention record.

## 4. What governs it
- **ADRs, with their Status lines as they read on main:**
  - ADR-017 is Accepted 2026-08-06 and architect-blockable (docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:3). Its relevant sections:
    - §13, :500-511;
    - §15, :543-572;
    - §16, :591-610;
    - Corrigendum 3, :750-956;
    - Corrigendum 4, :1044-1108;
    - the exposure review and its completion, :1110-1142.
  - ADR-018 is Accepted 2026-08-08 (docs/adr/ADR-018-what-cancellation-acknowledged-means.md:3). §4, the classification of a path's sections, is at :78-88.
  - ADR-006 is Accepted 2026-07-31 (docs/adr/ADR-006-lineage-undo-side-effects.md:3).
  - ADR-010 is Accepted 2026-08-03 (docs/adr/ADR-010-render-frames-origins-boundaries.md:3). Rule 6 is at :70-72 and rule 7 at :76-87.
  - ADR-009 is Accepted 2026-08-07 (docs/adr/ADR-009-license-and-open-core-boundary.md:3). Its item 7 forces the copyright notice, per ADR-017:931-937.
  - ADR-025 is Accepted 2026-09-07 (docs/adr/ADR-025-publish-above-the-readers-ceilings.md:3).
  - ADR-024 is Proposed and binds nothing (docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md:3). ADR-017:1114 names it the shell surface's record.
  - ADR-036 is Proposed (docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:3). It is not on this path.
- **Preregistrations and design notes that built the path and its refusals:**
  - kernel/CANCEL-RESCORE-PREREGISTRATION.md;
  - kernel/SCALE-PASS-PREREGISTRATION.md;
  - kernel/AUDIT-READER-CHAR-BOUNDARY-PREREGISTRATION.md;
  - the engine halves listed in the index at kernel/README.md:389: engine/MULTIPOLYGON-MP1-PREREGISTRATION.md, engine/GEOMETRY-POINTS-PREREGISTRATION.md and engine/GEOMETRY-LINES-PREREGISTRATION.md;
  - the shell forms, each titled at its line 1: frontends/shell/PUBLISH-REFUSAL-CODE-SRC-TAURI-PREREGISTRATION.md, frontends/shell/PUBLISH-ATTEMPT-LIFECYCLE-SRC-TAURI-PREREGISTRATION.md, frontends/shell/PUBLISH-APPROVAL-TTL-TEN-MINUTES-PREREGISTRATION.md and frontends/shell/PUBLISH-APPROVAL-UNKNOWN-ATTEMPT-STEP-1-PREREGISTRATION.md;
  - design notes: kernel/PERMISSION-BOUNDARY.md (F-3 at :373-378; the human's rulings at :476-491) and kernel/CANCELLATION-AND-TRACING.md §3, :83-117.
  - The scanner is listed as an instrument of the fourth section at kernel/RESULTS.md:1544.
- **KNOWN-LIMITATIONS items on publishing:**
  - 5, :79-88;
  - 6, :90-94;
  - 8, :105;
  - 12, :131-137;
  - 16, :168-176;
  - 29, :178-188;
  - 21, :257-265;
  - 30, :334-351;
  - 32, :357-359.
  - No item is about the bundle scan. The three occurrences of "redact" (:390, :405, :409) are in comments that name a directive file. The last item number is 46, at :407.
- **Non-negotiables:**
  - docs/01_Principles.md:13, principle 7;
  - docs/08_Testing.md:8, cancellation, with its meaning set by ADR-018;
  - docs/09_Security_and_Privacy.md:27.
- **Declared ceilings on publish time or memory:**
  - None on publish wall time (docs/08_Testing.md:5-9; ADR-017 §16 at :591-610 has no time ceiling).
  - On memory: the engine queue bound (kernel/RESULTS.md:1915-1919). The publish sort sits outside every declared bound (engine/README.md:432-434).
  - Ceilings on the scanned bytes: `MAX_VIEWER_ASSET_BYTES` and the partition ceilings in §2.1.
  - Harness-only ceilings: kernel/tests/scale_pass_a6.rs:81-92.
- **The index's own lists:**
  - kernel/README.md:386, accepted ADRs;
  - :391, proposed ADRs;
  - :392, declared limits;
  - :395 and :397, ceilings;
  - engine/README.md:556, ceilings.

## 5. Overlap (rule 00)
- **The draft's paths** are its §7 table (draft :231-245), the form file (draft :13), and PLAN.yaml, which stays with the custodian (draft :307).
  - Under `protocol/` the draft edits nothing (draft :71, :264).
  - It cites, read only, protocol/skp/SKP-V0.md:783-795 and protocol/data-plane/src/session.rs:125-131.
- **Governance D:** its path list is at scripts/plan/PLAN-SUMMARIES-ARCHIVE-PREREGISTRATION.md:451-455, which also lists `scripts/plan/verify-quotes.mjs` and its test, conditional.
  - None of the draft's files is on that list.
  - The only shared path is PLAN.yaml, through the custodian's status rows, at S10.
- **The walkthrough rows piece:** its paths are MANUAL-WALKTHROUGH.md Part G (row G1), Part N (row N5), its form, and PLAN.yaml with the generated queue and site files (state/consults/2026-10-21-walkthrough-current-view-rows-g1-n5-architect-draft.md:154-158).
  - The redaction draft edits no walkthrough row (draft :299). Row G5 (MANUAL-WALKTHROUGH.md:328) lists the phases, finalizing included.
  - OPEN-2 is ruled (A) (state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:12).
  - The walkthrough draft's slot-1 check is at its :167.
- **ADR-036's pre-acceptance block:** its path is docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md. The redaction draft edits no ADR (draft :71, :212), and its OPEN-4 is ruled (A) (directive :12).
- **Piece 1c** (state/consults/2026-10-21-b2-piece-1c-save-and-reopen-architect-draft.md):
  - kernel/README.md is shared: it is in 1c's records group (:347) and in this draft's owner's-index row (draft :243);
  - KNOWN-LIMITATIONS.md is shared, as separate items (1c :347; draft :242);
  - engine/src/fixture.rs is edited here (draft :240) and used, not edited, by 1c (1c :422);
  - kernel/src/permission/ is edited here (boundary.rs and audit/reader.rs, draft :236-237) and read by 1c (1c :421);
  - 1c names `src-tauri/src/commands.rs` (1c :97-98, :266), not publish.rs;
  - 1c's own overlap section (:419-423) records this piece going first;
  - 1c's `protocol/` paths are `protocol/skp/src/v0/{commands,mod,error}.rs` and protocol/skp/SKP-V0.md, plus its protocol fixtures and tests groups (1c :338, :354, :370).
- **Milestone 4** (state/consults/2026-10-21-b1-shell-half-milestone-4-architect-draft.md):
  - KNOWN-LIMITATIONS.md is shared, as separate items (m4 :376);
  - frontends/shell/src-tauri/src/publish.rs is read only by m4 (m4 :377), and this draft edits its `mod tests` (draft :241);
  - engine/src/fixture.rs is used, not edited, by m4 (m4 :378);
  - m4 declares `protocol/**`, `kernel/src/**`, `engine/**` and `src-tauri/**` not edited (m4 :346);
  - under its OPEN-4 (A′) a recording piece touches `protocol/` (m4 :386). m4 cites protocol/skp/SKP-V0.md (:41, :75, :110) and protocol/skp/tests/data/v0-viewport_query-request-with-columns.json (:410).

## 6. Questions the form must answer (at most five)
1. Which ceiling bounds one partition file's bytes for the read-and-scan term: the 1 MiB target, or `MAX_BATCH_BYTES`? Raised by engine/src/stream.rs:49, :131 and :209, read beside kernel/src/publish/mod.rs:1509 and kernel/RESULTS.md:1390. Bears on it: draft §2.6 (draft :128).
2. How is the new read-and-scan section classified under ADR-018 §4, and where does it sit against Corrigendum 4's table and CANCELLATION-AND-TRACING.md §3's table? Raised by docs/adr/ADR-018-what-cancellation-acknowledged-means.md:78-88, ADR-017:1076-1093 and kernel/CANCELLATION-AND-TRACING.md:83-97. Bears on it: draft §2.6 and OPEN-4 (draft :128, :381-384).
3. Which bundle size is the cost stated against, given that a whole-file 5 GB publish refuses at preflight on `MAX_FEATURES` and `MAX_RESIDENT_BYTES` is checked at no stage? Raised by KNOWN-LIMITATIONS.md:79-94, kernel/src/publish/ceilings.rs:107-119 and kernel/RESULTS.md:2124-2130. Bears on it: draft "What I could not settle", item 3 (draft :392).
4. Do `build_millis`, the sidecar's fields and the CLI's printed build ms include a scan placed after them? `build_millis` is sampled at kernel/src/publish/mod.rs:913, before the sidecar write at :927-930. Raised by that site, kernel/src/bin/publish-bundle.rs:667 and frontends/shell/src/publish/types.ts:78-83. Bears on it: none found.
5. What declared ceiling bounds the findings held for one file, each carrying an excerpt, under ADR-010 rule 6? Raised by kernel/src/bundle/redaction.rs:49-59 and :309-318, and docs/adr/ADR-010-render-frames-origins-boundaries.md:70-72. Bears on it: draft §2.3's last paragraph and §7 (draft :109, :247).

## Files read
- engine/README.md: 379-561, plus a heading search
- kernel/README.md: 200-399, plus a heading search and a search for "redaction"
- state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md: 1-62
- state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md: 1-23
- state/consults/2026-10-21-bundle-redaction-scan-not-in-product-publish-architect-draft.md: 1-400
- state/consults/2026-10-21-b2-piece-1c-save-and-reopen-architect-draft.md: 330-381, 414-443, plus searches
- state/consults/2026-10-21-b1-shell-half-milestone-4-architect-draft.md: 84-115, 335-349, 373-390, plus searches
- state/consults/2026-10-21-walkthrough-current-view-rows-g1-n5-architect-draft.md: 140-174, plus a search
- scripts/plan/PLAN-SUMMARIES-ARCHIVE-PREREGISTRATION.md: 440-462, plus a search
- PLAN.yaml: 5394-5410
- kernel/src/bundle/redaction.rs: 1-370, plus a search for test functions
- kernel/src/publish/mod.rs: 1-260, 600-1019, 1198-1213, 1420-1679, plus searches
- kernel/src/publish/error.rs: 1-60, 240-299, plus a search
- kernel/src/publish/ceilings.rs: 1-170
- kernel/src/publish/viewer_assets.rs: search only (:33, :35, :85)
- kernel/src/permission/boundary.rs: 1-40, 200-509, 528-532
- kernel/src/permission/audit/log.rs: 230-269, plus a search
- kernel/src/permission/audit/reader.rs: 218-287
- kernel/src/bin/publish-bundle.rs: 120-199, 640-689, plus a search
- kernel/tests/publish.rs: 80-124, 415-486
- kernel/tests/permission_boundary.rs: 838-915, plus a search for functions
- kernel/tests/typed_terminal_codes.rs: 405-474, plus a search for functions
- kernel/tests/no_generation_in_persisted_artifacts.rs: 195-209
- kernel/tests/support/mod.rs: 225-284
- kernel/tests/scale_pass_a6.rs: 60-259
- kernel/tests/publish_cancellation.rs, kernel/tests/cancel_rescore.rs, kernel/tests/scale_pass.rs, kernel/tests/first_batch_factorial.rs, kernel/tests/trace_spans.rs, kernel/tests/publish_cli.rs, kernel/tests/import_layout_publish_determinism.rs: search only
- kernel/RESULTS.md: 1300-1399, 1718-1762, 1862-2021, 2087-2136, plus a heading search
- kernel/PERMISSION-BOUNDARY.md: 370-384, 476-493, plus a heading search
- kernel/CANCELLATION-AND-TRACING.md: 83-122, plus a heading search
- kernel/CANCEL-RESCORE-PREREGISTRATION.md, kernel/SCALE-PASS-PREREGISTRATION.md, kernel/AUDIT-READER-CHAR-BOUNDARY-PREREGISTRATION.md: line 1 only
- engine/src/stream.rs: 120-175, plus a search
- engine/src/fixture.rs: search only
- frontends/shell/src-tauri/src/publish.rs: 696-935, 1355-1404, 1575-1600, 1672-1761, 2104-2153, plus searches
- frontends/shell/src-tauri/src/lib.rs: search only (:588)
- frontends/shell/src/publish/formatPublishRefusal.ts: 1-50
- frontends/shell/src/publish/types.ts: 63-110
- frontends/shell/src/publish/PublishDialog.tsx, PublishPanel.tsx, client.ts, client.test.ts, PublishPanel.test.ts, formatPublishRefusal.test.ts; frontends/shell/src/admission/formatRefusal.ts: search only
- frontends/shell/e2e/publish.mjs: 1-160, 300-409, 455-654, plus searches
- frontends/shell/e2e/selection.mjs: 566-635, plus a search
- frontends/shell/e2e/exportElapsed.mjs, frontends/shell/e2e/README.md: search only
- frontends/shell/MANUAL-WALKTHROUGH.md: search only (row ids and phase mentions)
- frontends/shell/PUBLISH-*.md (five files): line 1 only
- docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md: 490-630, 922-961, 1044-1143, plus a heading search
- docs/adr/ADR-018-what-cancellation-acknowledged-means.md: 39-108, plus a heading search
- docs/adr/ADR-010-render-frames-origins-boundaries.md: 68-87, plus a search
- docs/adr/ADR-006, ADR-009, ADR-010, ADR-017, ADR-018, ADR-023, ADR-024, ADR-025, ADR-036: line 3 (Status), by search
- docs/01_Principles.md: search (:13)
- docs/08_Testing.md: 1-39
- docs/07_Roadmap.md, docs/09_Security_and_Privacy.md: search only
- KNOWN-LIMITATIONS.md: 79-98, 131-199, 255-410, plus heading and term searches
- protocol/skp/SKP-V0.md: 780-797
- protocol/data-plane/src/session.rs: 120-133
- renderer/bundle-viewer/build.mjs: 1-50
- renderer/bundle-viewer/notice.mjs: search only
- renderer/bundle-viewer/src/manifest.ts: 434-453, plus a search over renderer/bundle-viewer/src
- Repository-wide searches: callers of `redaction::`, `scan_directory` and `MachineIdentifiers` in `*.rs`; "redaction" under frontends/, renderer/, protocol/ and scripts/; `PublishPhase` across kernel/ and the shell's src-tauri; `Watchdog::start` in kernel/tests; `bundle-viewer/dist` and `--viewer-copyright` users.
