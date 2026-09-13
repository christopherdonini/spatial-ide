# Evidence-file deletions — 2026-08-17, human-directed cleanup

Deleted (all regenerable from committed generators; hashes recorded in the named records):
- target/slice-evidence/import-layout/ (~7.0 GB): the 9+2 file 145MB matrix + parcels-5gb-duckdb-shuffled.
  Record: kernel/RESULTS.md ninth section; .cut-archive/CUT-STATE-import-layout.md (full hash table).
- target/slice-evidence/first-batch/ (~9.9 GB): parcels-5gb-duckdb-{hilbert16,raster} + 3 matrix files.
  Record: kernel/RESULTS.md seventh section + FIRST-BATCH-AND-PRUNING-PREREGISTRATION.md.
- target/e2e-publish-out/ (10 MB): publish-E2E debris.
- target/release/ (12.1 GB): build cache only.
Kept: target/fixtures/ (live walkthrough/E2E fixtures), target/debug/, the operator's two published
bundles (target/filter-zoned-styled, target/filter-zoned-publish), all e2e/out ledgers (cited in
result logs). The next at-scale cut budgets 5GB-fixture regeneration time explicitly.
