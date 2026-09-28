*Custodian's filing note (2026-09-28): gate 1 (reviewer; the single reviewer gate over the whole PR that the W2-D brief's §3 requires, run after the merge because the human merged #140 before it) of PLAN node `suites-and-toolchain-beyond-windows`. Reviewed: main @ ab8ec3d (PR #140, merged; bb23bb3..ab8ec3d), from the report's own first line. Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b), transcribed from the hand-back message with the harness's two-space indent removed. The text below the rule is the agent's. Profile paths redacted at filing (0).*

---

Reviewed: main @ ab8ec3d (PR #140, merged; bb23bb3..ab8ec3d)
VERDICT: PASS

This was a read-only review. I ran no cargo. The evidence is `git` against the merged diff, plus GitHub CI metadata and logs.

## 1. The form's five lines against the merged diff

- **Where the form lives.** `engine/SUITES-BEYOND-WINDOWS-PREREGISTRATION.md` does not appear in `bb23bb3..ab8ec3d`. It reached main earlier through ec2b1c3, and `git diff 0dd9ffb bb23bb3 -- <form>` is empty, so main's copy is byte-identical to the branch's first commit. On the branch it came before any code: 0dd9ffb → b3bf4f6 → 7128874.
- **Scope.** `git diff --numstat bb23bb3 ab8ec3d` lists 8 files: CLAUDE.md 1/1, CONTRIBUTING.md 2/0, common/mod.rs 7/0, lod_tier_builder.rs 11/0, lod_tier_cancellation.rs 1/0, lod_tier_preflight.rs 1/0, boundary.rs 1/0, no_generation_in_persisted_artifacts.rs 1/0. That is 25 insertions plus 1 deletion, 26 lines by §21c's rule, against ≤ 60 and ≤ 8 files. The split matches the declaration:
  - b3bf4f6 has boundary.rs, CONTRIBUTING.md and CLAUDE.md.
  - 7128874 has the other five files.
- **Change.** The diff does exactly what the Change line says. On non-Windows: 14 tests get an ignore with a reason, one assertion is gated to Windows, and POLYGONS_100K gets a non-Windows arm. Separately, the npm floor is written into CONTRIBUTING.md and CLAUDE.md.
- **Tests+mutation.**
  - No `#[test]` is added.
  - Each of the 14 gets exactly one line, `#[cfg_attr(not(windows), ignore = "needs the Windows-only LOD tier root (%LOCALAPPDATA%)")]`, directly under `#[test]`. No other line of any test changes.
  - The 14 are: 11 in lod_tier_builder.rs, and one each in lod_tier_cancellation.rs, lod_tier_preflight.rs and no_generation_in_persisted_artifacts.rs. They are exactly the 14 names in wave 1's D-1 list (`state/cloud/wave1/D.md`, Finding B-1).
- **Out-of-scope (read first, §21d / round 25 item 2).** It names none of §21a's four categories as touched.
  - Security: the only boundary.rs line is inside `#[cfg(test)] mod tests` (the module opens at line 523 at ab8ec3d), so no non-test line changes.
  - Guarantee: the claim is that the tests that run on Windows are the same before and after. Section 3 shows this from the CI test-name lists.
  - The PR adds no amendment, so the class 8 and class 9 checks do not arise.

## 2. On Windows, nothing that runs changes

- All 14 added attributes are gated on `not(windows)`, so on Windows they expand to nothing.
- In boundary.rs the only change is `#[cfg(windows)]` on the single `assert_eq!(confirmation_phrase(Path::new(r"D:\maps\out")), "out");` statement. The test's name and its `/a/b/parcels-2026` assertion are unchanged.
- In `engine/tests/common/mod.rs`, the Windows value `r"C:\dev\spatial-ide\target\fixtures\slice-budgets\polygons-100k.parquet"` is byte-for-byte the same, now under `#[cfg(windows)]`.
- The `#[cfg(not(windows))]` arm is `concat!(env!("CARGO_MANIFEST_DIR"), "/../target/fixtures/slice-budgets/polygons-100k.parquet")`. That resolves to `<workspace>/target/...`, and `target/` is in `.gitignore:2`.
- `polygons_100k()` runs `create_dir_all(path.parent())` before it writes the temporary file and renames it, so the parent directory is created. The arm is sound.

## 3. Windows CI

- **PR, pull_request event:**
  - Product CI — Rust workspace, run 36457645077 (head 7128874), success.
  - DCO 36457645273, success.
  - Shell 36457645531, success.
  - Governance 36457645005, success.
- **PR head, push event:** Rust workspace 36457615751, success; shell 36457616136, success.
- **ab8ec3d (main, push):** Rust workspace 36464286073, success (28m11s; 779 passed, 0 failed, 41 ignored). Shell 36464290540, success. Pages 36464286048, success.
- **Same tests before and after.** I compared the per-test outcome lists (`test <name> ... ok|ignored`):
  - Main at ec2b1c3 (run 36455379314) against the PR run 36457645077, whose merge ref is ec2b1c3 plus the PR: the lists are **identical**, 774 passed / 0 failed / 40 ignored in both.
  - ab8ec3d against #136's merge run 36463884593: the only difference is two tests from #139 (`b1_an_implicit_coercion_...` ignored, `filter_admission_property_campaign` ok), not from this PR.
  - In the ab8ec3d log, all spot-checked D-1 tests and the boundary test report `... ok`, so they ran and were not ignored.
- **Caveat.** bb23bb3's own Rust run, 36464163535, was cancelled, so there is no complete Windows run at the exact first parent. The comparison above stands in for it.

## 4. The documentation lines

- **CLAUDE.md.** The only change is that `Node LTS` became `Node 24 LTS (npm 11+)`. That is exactly the replacement Fable's sighting, point 2, specifies (`state/directives/2026-09-28-wave2-D-sighting.md`).
- **CONTRIBUTING.md.** It gains one text line (plus a blank line) under "## Before you open a pull request". The line carries all three elements point 2 asks for: npm 11 or later, CI runs Node 24, and npm 10 fails `npm ci`, citing wave 1 D-3. It is a paraphrase and does not present itself as a quotation.
  - "CI runs Node 24" holds: every `node-version` pin in `.github/workflows/*.yml` is `"24"`.
  - The cited `state/cloud/wave1/D.md` is tracked.
- **User-profile paths.** There are none in the diff. The only path-like additions are the environment-variable name `%LOCALAPPDATA%` and the pre-existing `C:\dev\spatial-ide\...` literal.

## 5. DCO

| Commit | Author | Signed-off-by |
|---|---|---|
| 0dd9ffb | Christopher Donini <donini.christopher@gmail.com> | the same |
| b3bf4f6 | Christopher Donini <donini.christopher@gmail.com> | the same |
| 7128874 | chris <chrys92d@gmail.com> | the same |

The DCO check (run 36457645273) passed. ab8ec3d is GitHub's merge commit.

## Blocking
None.

## Should-fix
None.

## Nits
- CONTRIBUTING.md has no "setup section". The line sits under "Before you open a pull request", which is the nearest fit, next to the `npm --prefix` commands.
- `common/mod.rs`: the doc comment on the Windows arm ("by absolute path … rather than resolved against `CARGO_MANIFEST_DIR`") now describes only that arm. Its placement already makes that clear; the non-Windows arm has its own doc.
- Still open and outside Scope, as the worker also noted: other absolute Windows fixture paths remain, used by ignored tests. They are `lod_tier_builder.rs:60`, `lod_tier_cancellation.rs:31`, `lod_tier_measurements.rs:42`, `admission_p4_corpus.rs:68`, and `kernel/tests/slice_budgets.rs`'s writer. Run by hand off Windows, they would still write backslash-named files.

Files: `C:/dev/spatial-ide/engine/SUITES-BEYOND-WINDOWS-PREREGISTRATION.md`, `C:/dev/spatial-ide/engine/tests/common/mod.rs`, `C:/dev/spatial-ide/kernel/src/permission/boundary.rs`, `C:/dev/spatial-ide/CONTRIBUTING.md`, `C:/dev/spatial-ide/CLAUDE.md`, `C:/dev/spatial-ide/state/cloud/wave2/W2-D.md`, `C:/dev/spatial-ide/state/directives/2026-09-28-wave2-D-sighting.md`
