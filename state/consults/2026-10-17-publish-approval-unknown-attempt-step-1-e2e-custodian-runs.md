# publish-approval-unknown-attempt-under-load, step 1: the custodian's e2e runs at the head (R1 to R3)

*The custodian's record (2026-10-17), under `frontends/shell/PUBLISH-APPROVAL-UNKNOWN-ATTEMPT-STEP-1-PREREGISTRATION.md`, §2.2. The port-5400 harness on its approval's terms (port 5180 is still excluded); the e2e checkout `C:/dev/wt/mm2b-e2e` detached at the head 80890488b58032ddcd66fd9288c9bd219de51ca4; the exe built at its base be6aa620, since the step changes nothing under src-tauri, kernel, engine or protocol (checked by the run script); each suite a fresh app; one shared hold. Every line below is byte-copied whole from the run's log by script. The figures are readings for the triage, not docs/08 measurements.*

## Setup

```text
head 80890488b58032ddcd66fd9288c9bd219de51ca4 exe D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-be6aa620.exe sha256 f3fdf25a795ce05d8bd135759d8b62add7520a3e48b86ad3cc4f103ea0a8c31f ttl-line 68:pub const PENDING_ATTEMPT_TTL: Duration = Duration::from_secs(120);
```

This project's lines of the machine script's output, byte-copied:

```text
MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:47576 also=bash.exe:35304 (commands started from now on inherit it; release when done)
MACHINE_RELEASED project=SpatialIDE shell=bash.exe:47576 affinity=FF (cores 0-7)
```

## The runs

### R1: `npm run e2e:publish`'s script, once

```text
R1-publish: rc=0, 2026-10-17T18:39:10Z to 2026-10-17T18:39:34Z; fixtures unchanged
```

Its step lines:

```text
publish: PENDING_ATTEMPT_TTL 120000ms, read from src-tauri/src/publish.rs
[OPEN] PASS (348ms): admitted; window.__SPATIAL_E2E__.publishPrepareWithDestination now registered (dataset-scoped)
[APPROVED'] PASS (837ms): prepared+executed with attempt 1bfee35ecc66a8b1b773e5c54fcb3d6b; bundle verified (2000 rows, 1 partitions); 2 audit lines (intent+outcome success, approval_route shell-dialog, destination "C:/dev/wt/mm2b-e2e/target/e2e-publish-out/approved-1792262365386-130700/bundle", no credential needle); prepare-to-execute 2ms
[REFUSED'] PASS (29ms): prepared with attempt 0457dfdaca8c0b5a5c6a13b5fc03f21b, refused on the wrong phrase; no bundle directory, no .staging-* debris under C:\dev\wt\mm2b-e2e\target\e2e-publish-out\refused-1792262366224-617826; audit pair intent+outcome refused, error_kind ApprovalRefused; prepare-to-execute 2ms
[EXPIRED'] SKIP: no TTL-shortening env/test knob exists for PENDING_ATTEMPT_TTL (120s, publish.rs); sleeping 120s for one E2E assertion is not cheap (NEXT-CUT.md P4 permits skipping with a stated reason). The property is unit-tested instead: publish.rs::tests::a_pending_attempt_past_its_ttl_is_treated_as_unknown (backdated created_at, no sleep) -- part of this piece's own required `cargo test --lib` run.
[FILTERED'] PASS (751ms): filter-scope sentence present verbatim; manifest.operation.filter={"kind":"whole-file"}; bundle rows=2000 == full dataset (2000) both by the manifest's own claim and the reader's independent decode -- the filter did not leak; prepare-to-execute 8ms
rc=0 end 2026-10-17T18:39:27Z
```

### R2: `npm run e2e:selection`'s script, once

```text
R2-selection: rc=0, 2026-10-17T18:39:34Z to 2026-10-17T18:43:42Z; fixtures unchanged
```

Its step lines:

```text
[E-SCENE] PASS (14135ms): camera at zoom-in notch 1; features 836, 333
[E-CLICK] PASS (1139ms): Navigate click inspected id 836, equal to the oracle; selection 0
[E-CLICK-FAST] PASS (1510ms): a click at 333 (pressed at B with no move to B first) inspected 333; the hover readout stood on 836 through the click
[E-SELECT] PASS (586ms): Selected 1; alpha-255 pixels 129 -> 208
[E-NODRAG] PASS (1344ms): out-and-back drag kept Selected 1; 1 pan(s) moved the box (outside 1); Selected 1
[E-ZOOMSEL] PASS (1969ms): outside 1 -> 0; alpha-255 pixels 129 -> 3968 (floor 1002)
[E-SEL-PAN] PASS (1123ms): Selected 1 after the pan away and after the pan back
[E-SEL-FILTER] PASS (20892ms): Selected 6; hidden 4 under the filter and 0 after Clear
[E-REFUSED] PASS (9401ms): refused click at CSS (624, 374): the named state shown, Selected 6 -> 6
[E-GEN] PASS (14079ms): reopen: 6 dropped, a dataset was opened; source change: 1 dropped, the source file changed
[E-KINDS] PASS (53732ms): multipolygon: 3 id(s) over 7 pixels; two pixels of id 0 gave Selected 1; point: 3 clicks, 3 ids; line: 3 clicks, 3 ids
[E-EXPORT] PASS (11427ms): row scope "row scope: the whole file — every row the dataset contains" and 2000 rows with a selection and without; prepare-to-execute 0ms 0ms
[E-SCOPE] PASS (2683ms): execute refused after the filter changed; no bundle directory, no staging debris; prepare-to-execute 256ms
[E-ASK] PASS (14203ms): the ask showed; Keep exporting left the 100k layer and the export ended success; Cancel and go on admitted filter-zoned, the old close_dataset row followed the outcome (refused); prepare-to-execute 0ms 0ms
[E-ASK-STATEMENT] PASS (8662ms): the statement named C:\dev\wt\mm2b-e2e\target\e2e-selection-out\ask-1792262535091\bundle, whose manifest.json exists; filter-zoned was admitted; prepare-to-execute 0ms
[E-ASK-TWO] PASS (14866ms): two statements, C:\dev\wt\mm2b-e2e\target\e2e-selection-out\ask-1792262543906\bundle then C:\dev\wt\mm2b-e2e\target\e2e-selection-out\ask-two-1792262550802\bundle, both manifests on disk; filter-zoned was admitted; prepare-to-execute 0ms 0ms
[E-STATUS-HEIGHT] PASS (41192ms): the canvas stayed 388 x 712 (A, B, C) and the bar 48 px; recorded, not asserted: A's canvas height 712; in B the bar's scrollHeight 47 against its clientHeight 47; the residency item present in B: false; inner size after the resize 880 x 800; inner size after the restore 1280 x 800
[E-DBLCLICK] PASS (16725ms): a double-click zoomed (-0.8155298414577508 -> 1.1844701585422492), inspected nothing in Navigate and selected nothing in Select; a single click inspected id 836
[EXPORT-TODAY] SKIP: phase A's recorded observation (the form's Amendment 4 item 2); after B3 the reopen meets the open-during-export ask, which E-ASK and E-ASK-STATEMENT cover.
rc=0 end 2026-10-17T18:43:33Z
```

### R3: R1's script again, with the scratch wait of 121 000 ms before APPROVED's execute

```text
R3-publish-wait: rc=3, 2026-10-17T18:43:43Z to 2026-10-17T18:46:05Z; fixtures unchanged
```

Its step lines:

```text
publish: PENDING_ATTEMPT_TTL 120000ms, read from src-tauri/src/publish.rs
[OPEN] PASS (448ms): admitted; window.__SPATIAL_E2E__.publishPrepareWithDestination now registered (dataset-scoped)
[APPROVED'] INCONCLUSIVE (121106ms): execute returned {"status":"unknown-attempt"}; more than the TTL may have passed since the prepare was sent, so an expiry is not excluded (L 121016ms, U 121103ms, T 120000ms); prepare-to-execute 121016ms
[REFUSED'] PASS (32ms): prepared with attempt 5cce9a2c803d85434d1b8922d09d85ea, refused on the wrong phrase; no bundle directory, no .staging-* debris under C:\dev\wt\mm2b-e2e\target\e2e-publish-out\refused-1792262757318-606055; audit pair intent+outcome refused, error_kind ApprovalRefused; prepare-to-execute 2ms
[EXPIRED'] SKIP: no TTL-shortening env/test knob exists for PENDING_ATTEMPT_TTL (120s, publish.rs); sleeping 120s for one E2E assertion is not cheap (NEXT-CUT.md P4 permits skipping with a stated reason). The property is unit-tested instead: publish.rs::tests::a_pending_attempt_past_its_ttl_is_treated_as_unknown (backdated created_at, no sleep) -- part of this piece's own required `cargo test --lib` run.
[FILTERED'] PASS (842ms): filter-scope sentence present verbatim; manifest.operation.filter={"kind":"whole-file"}; bundle rows=2000 == full dataset (2000) both by the manifest's own claim and the reader's independent decode -- the filter did not leak; prepare-to-execute 8ms
rc=3 end 2026-10-17T18:45:58Z
```

## The scratch patch (R3)

Applied by an anchored script in the e2e checkout, never committed; its `git diff --stat` before the run and the checkout after the revert:

```text
 frontends/shell/e2e/publish.mjs | 1 +
 1 file changed, 1 insertion(+)
R3 patch reverted; checkout clean at 80890488b58032ddcd66fd9288c9bd219de51ca4
```

## Against §2.2

- **R1:** APPROVED', REFUSED' and FILTERED' pass, each line carrying its figure; the suite exits 0.
- **R2:** every step passes or skips as at the base; E-EXPORT (two), E-SCOPE (one), E-ASK (two), E-ASK-STATEMENT (one) and E-ASK-TWO (two) each carry their figures; the suite exits 0.
- **R3:** `[APPROVED'] INCONCLUSIVE`, with L and U both over 120 000 ms; REFUSED' and FILTERED' pass; the suite exits 3, as predicted.
- **For the cause step, recorded and not graded:** in R2 the prepare-to-execute figure of E-EXPORT's two pairs, E-ASK's two, E-ASK-STATEMENT's and E-ASK-TWO's two reads 0 ms, so those executes were sent as the prepare returned.

