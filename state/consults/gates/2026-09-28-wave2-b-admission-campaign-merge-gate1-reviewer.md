*Custodian's filing note (2026-09-28): gate 1 (reviewer), the tests-only reviewer pass that the 2026-09-28 S1 batch requires before PR #139 merges (`state/directives/2026-09-28-after-wave-s1-batch.md`, the B-1 paragraph), for PLAN node `wave2-b-admission-campaign-merge`. Reviewed: cloud/wave2-B @ ebd7962916e1dc0cbf09b84ef4a7da201a9eda1e (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b), transcribed from the hand-back message with the harness's two-space indent removed. The text below the rule is the agent's. Profile paths redacted at filing (0).*

---

Reviewed: cloud/wave2-B @ ebd7962916e1dc0cbf09b84ef4a7da201a9eda1e
VERDICT: PASS

Scope: tests only, as set by the `B-1 (implicit coercions pass bind admission)` paragraph of `state/directives/2026-09-28-after-wave-s1-batch.md`. I did not review product code. Line cites below point into `engine/tests/admission_property_campaign.rs` at ebd7962 on the branch.

Three-dot diff `origin/main...HEAD`: exactly one file, `engine/tests/admission_property_campaign.rs`, +1338 lines. Two commits: 576f76b (the worker's) and ebd7962 (the custodian's).

## 1. Deterministic: PASS

- **Seeds are constants.** `FIXTURE_SEED` and the G1–G4 seeds and case counts are consts at :55–72. The generator is a hand-written SplitMix64 at :80–102. Each generator's `Rng` is built from its constant seed at :1032.
- **Draw order is fixed.** The per-case stream parameters are drawn unconditionally at :1053–1063, so which branch a case takes cannot shift the draws for later cases.
- **No clock, randomness, threads, HashMap or env reads.** A grep of the file for `SystemTime`, `Instant::now`, `HashMap`, `thread::spawn`, `env::var` and `rand` finds none. All collections are `BTreeMap`/`BTreeSet` (:34, :113, :1019–1022). The one hit on "rand" is the hostile template `"random() < 0.5"` at :328. That is SQL text, it is refused at admission, and P3 at :702/:698 would flag it if it were ever admitted.
- **serde_json object order does not matter.** Violations are sorted and deduplicated before use (:849–850).
- **Only env dependence is the temp location.** `std::env::temp_dir()` (TMP/TEMP) is read at :126 and :158, which is the standard scratch location.
- **File system use is confined to two temp directories the test creates.**
  - `spatial-engine-wave2-admission-property` (:126–128) holds the fixture, which is rewritten on every process start.
  - `spatial-engine-wave2-admission-canary` (:157–161) is removed, recreated empty, and checked empty after the campaign (:1138–1151). It was empty after my runs.
- **Network.** Hostile templates name `http://127.0.0.1:9/...` (:330, :360) as refusal probes. They are not fetched. Admission refuses them, the oracle only parses them (`json_serialize_sql`), and `configured_connection` applies `autoinstall_known_extensions=false` / `autoload_known_extensions=false` (`engine/src/pool.rs:185-187` on the branch), so httpfs cannot load.
- **Pass/fail cannot depend on DuckDB scan thread order.**
  - An admitted predicate whose stream errors produces no violation (:915–917).
  - When the stream does not error, the count oracle is compared only if it succeeds (:947).
  - Only the printed `stream_errors` tallies could in principle vary. They are not asserted.
- **Direct check: three local runs.** All passed. Their outputs, with the build and `finished in` lines removed, hash identically: sha256 3fc2f447b3ff96e7f9f6132fd3780fee6685614e13753aefd5ea89a6b1e1a232 for all three. The tallies are identical in every run (for example G1 378 admitted / 122 refused; G4 91 admitted, 3 stream errors).

## 2. No new dependency: PASS

- `git diff origin/main...HEAD -- Cargo.toml Cargo.lock engine/Cargo.toml` is empty (0 lines). The PR touches no other file.
- **Imports all resolve to existing sources:**
  - std (:34–36).
  - `arrow` (:38), a workspace dependency of `spatial-engine`.
  - `serde_json` (:39) and `duckdb`, both regular dependencies in `engine/Cargo.toml`.
  - The crate under test, `spatial_engine` (:41–49).
  - `spatial_engine::fixture` is `#[cfg(feature = "fixture")]` (`engine/src/lib.rs:84-85`). It is enabled by the existing self dev-dependency `spatial-engine = { path = ".", features = ["fixture"] }`.
- **serde_json does not touch feature data.** It parses DuckDB's `json_serialize_sql` output of the composed SQL text inside test code only, so ADR-004 is not engaged.

## 3. CI runtime: PASS

The job is `cargo test --workspace (windows-latest)`, debug profile. Figures for binary `admission_property_campaign-528bba43bdd4dcbd.exe`, result 1 passed / 1 ignored:

| Commit | Run (event) | Job | `finished in` |
|---|---|---|---|
| ebd7962 | 36459294374 (pull_request, completed, success) | 109053504410 | 13.35s |
| 576f76b | 36394208750 (pull_request, success) | 108836663578 | 14.86s |
| 576f76b | 36394174693 (push, success) | — | 18.98s |

The push-event Rust run for ebd7962 (36459288492) was still in progress when I finished.

**Local, Windows 10 22H2**, `CARGO_TARGET_DIR=C:/dev/wt/wave2-b/target`, `cargo test -p spatial-engine --test admission_property_campaign -- --nocapture`, three runs:

- finished in 25.55s, 27.44s and 25.39s.
- All rc=0.
- The first build took 8m 48s.

## 4. The required change: PASS

- `git diff 576f76b ebd7962` is one file, 1 insertion and 1 deletion.
- At 576f76b, :1278 was a bare `#[ignore]`. At ebd7962, :1278 reads:
  `#[ignore = "wave-2 finding B-1: asserts the fixed behaviour; PLAN node filter-bind-admission-implicit-coercions removes this ignore in its PR"]`
- It names wave-2 finding B-1 and the fix node. The node exists as `id: filter-bind-admission-implicit-coercions` in main's `PLAN.yaml`.
- Nothing else changed.
- The reason is visible in both the CI log and the local log (`... ignored, wave-2 finding B-1: ...`).

## Blocking findings

None.

## Non-blocking notes

1. **Shared temp paths between runs.** The two temp directory names are fixed rather than unique per process, and neither is removed at the end. Two copies of this binary running at the same time on one machine, for example from two worktrees, would race: :159's `remove_dir_all` of the canary, and the fixture parquet being rewritten at :129 while another process reads it, which could fail with a Windows sharing violation. This is the same convention the other `engine/tests/*.rs` files use, it does not affect the single-process result, and CI runners are isolated.
2. **The campaign does not assert on stream-error leaks.** It records them (:1126–1129) and only prints them (:1170–1176). Every local run printed one leak: `i64 < 0.000000000000000000000000001` carrying file value 5800113866356857844. As the regression net, B-1 is covered only by the ignored reproducer. The fix PR could turn `stream_error_leaks` into an assertion when it removes the ignore, since it will be touching this file anyway.
3. **Out of scope, but seen in the output.** Three admitted arithmetic predicates end in `Out of Range Error: Overflow in multiplication of INT64`, and the error text carries file-derived values such as `5221210998874447054 * 2`. That is the same data-in-terminal-error shape as B-1, but through arithmetic overflow rather than an implicit coercion. Whether B-1's fix covers it is a question for the fix's preregistration, not for this gate.
4. **Nit.** The doc comment at :1268–1269 runs past 100 columns ("...minimised by hand): bind admission (stage 3) admits...").
