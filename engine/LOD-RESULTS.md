# LOD tier builder (route B) — measured results

*Filled by the `tester` agent for `engine/LOD-PREREGISTRATION.md` §3 (O1–O8), §5 (P1–P6, I2/I3/I6) and
§6 (instruments). **This file is where every measured figure for this piece enters the tree** — §6's
rule verbatim: "The numbers are the tester's … no measured figure enters this document, ADR-031, or
any commit message except through that gate."*

**The sample counts in this header were declared and committed BEFORE any run** (this file's first
commit, with every results cell empty). Nothing below raises or lowers a declared N after the fact; a
row that got fewer samples than declared says so, with the reason.

**No performance claim is made here** (§1). Wall time is measured and reported, never asserted. No
`docs/08` row is proposed, added or amended. No route-A comparison appears, of any kind (§1, §0
item 6). Nothing here is called "zero-copy" (ADR-004).

---

## Scope carried by every number

| | |
|---|---|
| **Date** | 2026-09-17 local (Europe/Zurich, UTC+2); UTC timestamps below are the machine's own |
| **Commit measured** | `1d46678` — `engine/lod-tier-builder` after both gates PASSED at attempt 2 and after `origin/main` was merged in. Plus this file and the harness commit named below; **no file under `engine/src/` differs from `1d46678`** |
| **Harness commit** | *(filled below, after the header commit)* |
| **Machine** | Intel Core i9-9980HK @ 2.40 GHz · **8 cores / 16 threads** · 63.73 GiB RAM (68,433,563,648 B) · Windows 10 Pro 22H2 build 19045. The same 8C/16T reference machine `LOD-PREREGISTRATION.md` §7 declares `LOD_BUILD_WORKERS = 8` against |
| **Drive** (the §0 fixture-drive confound, stated before any number) | **`C:`** — Disk 0, **KIOXIA KXG60ZNV512G NVMe 512 GB, MediaType SSD**, BusType reported `RAID` (NVMe behind Intel RST), partition 510,319,919,104 B. **Both fixtures and every tier written below live on `C:`.** No figure here is differenced against a figure taken on any other drive |
| **Build profile** | `release`, via `cargo test --release -p spatial-engine`, with `CARGO_TARGET_DIR` set to this worktree's own `target/` (never the shared `C:/dev/spatial-ide/target`). `debug_assertions` off — which is also why `engine/src/lod.rs:1097-1100`'s `debug_assert!` is not what enforces any size here (§10 Amendment 8 (i)6) |
| **Idle since** | *(filled below: the machine state recorded beside each measured table)* |
| **Excluded** | macOS and Linux (tier building is Windows-only in this cut — §10 Amendment 8 (a)); any route-A comparison; any `docs/08` row other than the existing cancellation budget `docs/08:8`; any claim about a distribution where N = 1 |

### Fixtures — hash-verified before and after (§3, binding)

| Fixture | Path | Declared bytes (§3) | Bytes seen | SHA-256 before | SHA-256 after |
|---|---|---|---|---|---|
| `parcels-5gb` | `C:\dev\spatial-ide\target\slice-evidence\scale-pass\parcels-5gb.parquet` | 5,004,376,705 | 5,004,376,705 | `5AE955C5FB7EE4D3F10436DF271E19361D84F0845FBAA69DC60516F1B60C1788` | *(after the runs)* |
| `polygons-100k` | `C:\dev\spatial-ide\target\fixtures\slice-budgets\polygons-100k.parquet` | 151,812,642 | 151,812,642 | `9ECD79242AC7D99E09F1989C8C124FD53DCD697689546EC6013949F806CA6043` | *(after the runs)* |

### Free space on `C:` (§3's disk discipline; the test's own floor `MIN_FREE_BYTES` = 42,949,672,960 B = 40 GiB)

| Point | Free bytes | Note |
|---|---|---|
| Session start, 2026-09-16T23:38Z | 47,632,175,104 (44.36 GiB) | above the 40 GiB floor, by 4.36 GiB — tight, as the brief records |
| *(per-run readings below, in each table)* | | |

### Declared sample counts — fixed by this file's first commit, before any run

| # | Row | Fixture | Arm | **Declared N** | Reporting rule |
|---|---|---|---|---|---|
| 1 | The 5 GB ladder under disk discipline (O1–O5, O8, §6's residual, and one arm-P wall time) | `parcels-5gb` | P (`LOD_BUILD_WORKERS` = 8) | **1** | "one sample, not a p50/p95" |
| 2 | O7 — `cancel_requested → cancel_observed` | `parcels-5gb` | P (8) | **5** | p50 / p95 / max; p95 carries the verdict against `LOD_CANCEL_OBSERVED_CEILING_MS` = 100 ms |
| 3 | O6 — build wall time, arm S vs arm P | `polygons-100k` | S (1) **and** P (8) | **5 per arm** | p50 / p95 / max per arm; per-tier where the instrument gives it |
| 4 | O6 — build wall time at 5 GB | `parcels-5gb` | P (8) = row 1's run; S (1) if the night allows | **1 per arm** | "one sample, not a p50/p95"; arm S recorded as not-run if time does not allow it |

p50/p95 are reported **only** where N ≥ 5 (rows 2 and 3). Rows 1 and 4 are single samples and are
labelled as such everywhere they appear. Max is always reported (ADR-018); "achieved typically" is
never written.

---

## Row 1 — the 5 GB ladder under disk discipline (O1–O5, O8, §6's residual)

*(empty until measured)*

## Row 2 — O7, `cancel_requested → cancel_observed` at 5 GB

*(empty until measured)*

## Row 3 — O6, build wall time on `polygons-100k`, arm S vs arm P

*(empty until measured)*

## Row 4 — O6, build wall time on `parcels-5gb`

*(empty until measured)*

## Verdicts

*(empty until measured)*

## Not run, and why

*(empty until measured)*
