# publish-approval-ttl-ten-minutes: the custodian's E1 at the head — two runs of the publish suite

*The custodian's record (2026-10-20), under `frontends/shell/PUBLISH-APPROVAL-TTL-TEN-MINUTES-PREREGISTRATION.md` (§3, E1), at the head 5e922915419fff578d862ae1a47aefa39c955ba2 of `cut/publish-approval-ttl-ten-minutes`. Built by script from each run's suite log and the machine script's output, each copied whole into the custodian's scratch folder right after its run. Every quoted line is byte-copied whole, carriage returns removed, with a user-profile path written as `C:\Users\<user>\`. This project's machine lines only.*

## Setup

- **The exe** was built at the head from the e2e checkout `C:/dev/wt/mm2b-e2e`, detached at the head and clean before and after, with the port-5400 overlay, inside one shared hold that also held run 1. Its sha256 is 525ac72d43661caf0a0f2f35f58581e3824ebbcc12c6facc69a09542c259ef3c. The lines of that call:

```text
MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:49380 also=bash.exe:39880 (commands started from now on inherit it; release when done)
head 5e922915419fff578d862ae1a47aefa39c955ba2 start 2026-10-20T20:08:33Z
build rc=0     Finished `dev` profile [unoptimized + debuginfo] target(s) in 8m 11s
exe D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-ttl-5e922915.exe sha256 525ac72d43661caf0a0f2f35f58581e3824ebbcc12c6facc69a09542c259ef3c
suite rc=1 end 2026-10-20T20:17:27Z
MACHINE_RELEASED project=SpatialIDE shell=bash.exe:49380 affinity=FF (cores 0-7)
```

- **Run 2** used the same exe and checkout, a fresh app, in its own shared hold, after run 1's FILTERED' read FAIL.

## Run 1

```text
checkout C:/dev/wt/mm2b-e2e head 5e922915419fff578d862ae1a47aefa39c955ba2 start 2026-10-20T20:17:03Z
publish: PENDING_ATTEMPT_TTL 600000ms, read from src-tauri/src/publish.rs
OPEN       PASS    admitted; window.__SPATIAL_E2E__.publishPrepareWithDestination now registered (dataset-scoped)
APPROVED'  PASS    prepared+executed with attempt 951e2f676d352ffc774f99a646b1673a; bundle verified (2000 rows, 1 partitions); 2 audit lines (intent+outcome success, approval_route shell-dialog, destination "C:/dev/wt/mm2b-e2e/target/e2e-publish-out/approved-1792527436881-969199/bundle", no credential needle); prepare-to-execute 4ms
REFUSED'   PASS    prepared with attempt ad2c47e6fcdb944604acb096c84455ab, refused on the wrong phrase; no bundle directory, no .staging-* debris under C:\dev\wt\mm2b-e2e\target\e2e-publish-out\refused-1792527438787-313640; audit pair intent+outcome refused, error_kind ApprovalRefused; prepare-to-execute 4ms
EXPIRED'   SKIP    no TTL-shortening env/test knob exists for PENDING_ATTEMPT_TTL (600s, publish.rs); sleeping out the TTL for one E2E assertion is not cheap (NEXT-CUT.md P4 permits skipping with a stated reason). The property is unit-tested instead: publish.rs::tests::a_pending_attempt_past_its_ttl_is_treated_as_unknown (backdated created_at, no sleep) -- part of this piece's own required `cargo test --lib` run.
FILTERED'  FAIL    FILTERED': filter_scope mismatch.
Expected: this bundle format cannot record a row predicate (ADR-017 §8, bundle_version 1); publishing publishes the viewport extent, not your filter
Actual:   null
rc=1 end 2026-10-20T20:17:18Z
```

## Run 2

```text
checkout C:/dev/wt/mm2b-e2e head 5e922915419fff578d862ae1a47aefa39c955ba2 start 2026-10-20T20:18:56Z
publish: PENDING_ATTEMPT_TTL 600000ms, read from src-tauri/src/publish.rs
OPEN       PASS    admitted; window.__SPATIAL_E2E__.publishPrepareWithDestination now registered (dataset-scoped)
APPROVED'  PASS    prepared+executed with attempt c478be5d5700493a02f9eb80f1c9dc25; bundle verified (2000 rows, 1 partitions); 2 audit lines (intent+outcome success, approval_route shell-dialog, destination "C:/dev/wt/mm2b-e2e/target/e2e-publish-out/approved-1792527542080-336360/bundle", no credential needle); prepare-to-execute 3ms
REFUSED'   PASS    prepared with attempt 687983715d9bf59dbcfb78e78889311e, refused on the wrong phrase; no bundle directory, no .staging-* debris under C:\dev\wt\mm2b-e2e\target\e2e-publish-out\refused-1792527542883-350043; audit pair intent+outcome refused, error_kind ApprovalRefused; prepare-to-execute 2ms
EXPIRED'   SKIP    no TTL-shortening env/test knob exists for PENDING_ATTEMPT_TTL (600s, publish.rs); sleeping out the TTL for one E2E assertion is not cheap (NEXT-CUT.md P4 permits skipping with a stated reason). The property is unit-tested instead: publish.rs::tests::a_pending_attempt_past_its_ttl_is_treated_as_unknown (backdated created_at, no sleep) -- part of this piece's own required `cargo test --lib` run.
FILTERED'  PASS    filter-scope sentence present verbatim; manifest.operation.filter={"kind":"whole-file"}; bundle rows=2000 == full dataset (2000) both by the manifest's own claim and the reader's independent decode -- the filter did not leak; prepare-to-execute 10ms
rc=0 end 2026-10-20T20:19:03Z
```

## Against §3

- **The header line** reads `PENDING_ATTEMPT_TTL 600000ms` in both runs. **EXPIRED'** skips in both, and its note names 600s.
- **OPEN, APPROVED' and REFUSED'** pass in both runs.
- **FILTERED'** read FAIL in run 1: the prompt's `filter_scope` was null where the step expects the filter-scope sentence (the Expected and Actual lines above). In run 2 it passed: the sentence present verbatim, the bundle the whole dataset. Run 1 ran in a shared hold right after the exe's build; the machine rule names a timing-sensitive failure seen in a shared run as one not recorded as a failure, and run 2 in its own shared hold did not show it. The piece changes neither the filter path nor `filter_scope` (its Out-of-scope line), so the custodian reads run 1's FAIL as not the piece's, for the gates to weigh.

