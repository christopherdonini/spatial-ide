# LOD release-only guard — five-line preregistration (`AUTONOMY.md` §21d)

*Committed before any code, per the header rule both full and short forms keep.*

```
Authority: state/directives/2026-09-22-part-n-n8-and-sequencing.md:159 (the human, "the missing release-only measurement guard" as one of three deferred clean-clone repairs); DECISIONS-PENDING.md entry 115, item (d); kernel/RESULTS.md's paragraph beginning "**Finding — a fourth test in the same binary lacks its siblings' release-only guard.**"; PLAN.yaml node drill-fix-release-only-guard; AUTONOMY.md §21d.
Scope: engine/tests/lod_tier_measurements.rs only; declared line budget <= 20 non-generated insertions+deletions across 1 file.
Change: each of the four #[ignore]d tests in this file whose ignore string names --release gains, as its first statement, the same assert!(!cfg!(debug_assertions), ...) guard already present at engine/tests/import_layout_digest.rs:428-433, worded for this file's reason (wall-time measurements; a debug build's numbers are not measurements); no other line in the file moves or is reflowed.
Tests+mutation: the proof is a debug run of each guarded test (cargo test -p spatial-engine --test lod_tier_measurements -- --ignored --exact <name>) failing within seconds on the new guard's message; the mutation is the guard removed from wall_time_arm_s_and_arm_p_over_polygons_100k and the same debug run observed getting past the guard (its first "fixture ..." println appears) and then stopped by a timeout, recorded, then the guard restored. The release path is not run tonight -- no measurement is made or claimed.
Out-of-scope: no measured number, no docs/08 row, no preregistered ceiling or constant changed, no change to any non-ignored test, no ADR/wire/security/guarantee text; siblings of the same gap in other files (kernel/tests/verify_bundle.rs, kernel/tests/scale_pass.rs, kernel/tests/query_window_attribution.rs, kernel/tests/publish.rs, kernel/tests/permission_boundary.rs, kernel/tests/import_layout_publish_determinism.rs, kernel/tests/first_batch_factorial.rs, kernel/tests/import_layout_factorial.rs, engine/tests/lod_tier_cancellation.rs, engine/tests/lod_tier_builder.rs) are named here, not fixed.
```

Budget: 10 of 20 non-generated insertions+deletions across 1 file (engine/tests/lod_tier_measurements.rs; git diff --numstat origin/main...HEAD, the form excluded).
