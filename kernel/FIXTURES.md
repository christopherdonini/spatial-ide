# Fixture provenance registry

A single, canonical place to find how a large or hard-to-regenerate fixture came to exist, so a
future campaign never has to scavenger-hunt across preregistration documents for a hash or a
regeneration command. Born 2026-09-02, at the human's own direction, after the residency cut's 5
GB fixture was named a single point of failure (`DECISIONS-PENDING.md`'s resolved entry recording
that ruling) — no such registry existed before this file; the information below already lived,
scattered, in `kernel/SCALE-PASS-PREREGISTRATION.md` and `kernel/CANCEL-RESCORE-PREREGISTRATION.md`,
and is consolidated here rather than duplicated blind. Small fixtures generated on the fly by
their own test/harness code (the happy-path, refusal, and ceiling fixtures under
`kernel/tests/manual_walkthrough_fixtures.rs`, the docs/08 Polygons-class fixture, etc.) do not
need an entry here — they regenerate in seconds and carry no single-point-of-failure risk. This
file is for fixtures where losing the file would be expensive or slow to recover from.

## `parcels-5gb.parquet` — the docs/07 hero-slice 5 GB fixture

| Field | Value |
|---|---|
| **Path** | `target/slice-evidence/scale-pass/parcels-5gb.parquet` |
| **Size** | 5,004,376,705 bytes |
| **SHA-256** | `5ae955c5fb7ee4d3f10436df271e19361d84f0845fbaa69dc60516f1b60c1788` |
| **Generator** | `kernel/tests/scale_pass.rs` |
| **Regenerate** | `cargo test --release -p spatial-kernel --test scale_pass -- --ignored --nocapture` |
| **Writer** | `spatial_engine::fixture::write_geoparquet_cancellable` (arrow-rs — never DuckDB `COPY`; `kernel/IMPORT-LAYOUT-PREREGISTRATION.md` names this fixture as a read-only source, never a layout-writer comparison arm) |

**Exact generation spec** (`spec_5gb()`, `kernel/tests/scale_pass.rs`, backed by named constants —
this is the complete parameter set, not a summary):

```
features:            3_300_000
avg_vertices:         100
hole_every:            7
seed:                 0x5EED_2056_0000_0005
chunk:               8_192
row_group_rows:      8_192
crs_mode:            CrsMode::DeclaredLv95
with_covering_bbox:  true
identity:            IdentityMode::NativeUnique
attributes:          AttributeMode::None
license:             LicenseMode::DeclaredBySource
```

**Preregistered before the file or the test existed**: `kernel/SCALE-PASS-PREREGISTRATION.md`
states the number/ceiling provenance rule this spec follows.

**Guardrail — deliberately manual, not automatic.** `scale_pass.rs`'s own `generate()` asserts the
target path does NOT already exist and refuses to overwrite it. Quote: *"This pass generates once
and records the facts from that generation. Remove the file to re-run the phase — deliberately
manual, because it is 5 GB."* Delete the file yourself before re-running the command above; the
test will not do it for you, and will not silently regenerate a fixture a running campaign might
still be reading.

**Determinism — confirmed empirically, twice, not merely claimed from a fixed seed.**
`kernel/CANCEL-RESCORE-PREREGISTRATION.md` records a SECOND independent generation (forced by an
unrelated canary invalidation of the first) producing the **exact same SHA-256** as the original.
Quoted: *"The fixture is byte-identical across attempts 1 and 2... from independent generations.
The generator is deterministic under its seed."* This is a real, already-run confirmation on this
machine, not a hope resting on the seed alone.

**Honest gap, not glossed over:** both confirmed generations ran on this same machine, in the same
or a near-same session. **Cross-machine or cross-toolchain-version determinism is NOT
established** — a regeneration on a different machine, Rust toolchain version, or arrow-rs version
is not guaranteed to reproduce this exact hash, even though the logical dataset it describes would
be the same. If this fixture is ever needed on a different machine, re-verify the hash after
generating there and record any mismatch here rather than silently assuming it still matches.

**No other known copies exist** in this repository's own history or documentation as of
2026-09-02 — every reference treats the path above as the one true copy on this machine. A second
physical-location backup is the human's own action (target location not chosen here) — record it
in this table, as a new row, once one exists:

| Location | Copied | Verified hash matches |
|---|---|---|
| *(none yet)* | — | — |
