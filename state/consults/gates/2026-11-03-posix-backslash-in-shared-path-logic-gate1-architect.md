Reviewed: PR #279 at 9999ef4dc451211a96733548eac333b343f6d158 (base b900c712), gate 1, architect
Verdict: PASS WITH NOTES
Branch: cut/posix-backslash-in-shared-path-logic @ 9999ef4dc451211a96733548eac333b343f6d158

I have no shell, so I computed no sha256 (the brief's included), ran no git, read no CI log, and leave no background shell. I read the three Scope files at the head in `C:/dev/wt/pbsl`, and B's files as main's (`C:/dev/spatial-ide`), because the custodian checked that no product file changed on main past B. Some checks need git or CI: the ten commits and that each temporary commit carries its mutation alone, the reverts restoring the bytes, the 160-line numstat, and the CI logs. Those are the reviewer's. Where I rely on the worker report for one of them, I say so.

## Findings

**Correctness: none.**

**Evidence: one note, E1. It does not block, and it resolves by the reviewer's read or by replacement words.**

- **What:** M2's record says "in its binary 162 passed, 1 failed" (`kernel/src/permission/audit/normalize.rs:336-337`). The worker report gives that binary result line for M1 (line 59) and for M3 (line 61), but not for M2: its line 60 gives only the assertion's left and right values. The custodian's filing note vouches only for the run ids, job ids and byte-copied lines the report names, and this count is not one of them. So the filed record does not back M2's count.
- **Fix:** the reviewer reads the ubuntu-24.04 log of job 126219815352. If it shows `162 passed; 1 failed`, the line stands.
- If it does not, the worker applies these words with no re-gate, and the PR body lists them (§31). This is a doc comment, not the human's wording. Lines 336-337, from "; in its binary" to the end of the sentence, become:
  > ; cargo stops at the first failing binary, so no test that ran before it failed.
- **Clause check:**
  - (1) "cargo stops at the first failing binary": both jobs run `cargo test --workspace --locked` with no `--no-fail-fast` (`.github/workflows/product-ci-rust.yml:234`).
  - (2) "so no test that ran before it failed": this follows from (1). A failure in an earlier binary would have stopped the run before this one.
- The sentence that follows, "The windows job passed on both.", is backed by the worker report's table (line 53).

**Documentation: none.** Three things in the worker report are not findings:
- Its "Commits (11" heading is disclosed in the custodian's filing note, and the report is filed as handed back.
- Its "about 25" record lines (line 76) is superseded by Amendment 1's 32. My count of the four RECORDED MUTATION blocks at the head, with their separator lines, agrees with Amendment 1: 4 + 14 + 8 + 6 = 32 (`normalize.rs:234-237`, `:324-337`; `posix_backslash_in_shared_path_logic.rs:27-34`, `:65-70`).
- None of the human's wording is touched by any finding.

## Ruling on the boundary (R2, for the closing amendment by reference)

I add one named boundary to R2's table: **path syntax, as std defines it (`std::path::is_separator`)**.

- **Where:**
  - `kernel/src/permission/audit/normalize.rs`: `to_slashes` (`:151-156`), used by step 2 (`:82`) and by `roots_from` (`:137`).
  - `kernel/src/publish/viewer_assets.rs`: `from_dir`'s walk (`:134-139`).
- **Windows: supported, unchanged.** `is_separator` names `\` and `/`, so both sites map exactly what `replace('\\', "/")` mapped, and every output is byte-identical. The proof is M5, which hits `a_user_profile_destination_becomes_a_token`, plus M4 on T3, and the unchanged suite.
- **Linux: supported at L1.** A `\` stays a byte of the name. T1 and T2 run on ubuntu-24.04, and M1 to M3 are observed there.
- **macOS: the same unix code path, supported by construction and not observed.** No macOS job exists, so this claims no level (R5). KL 1 carries the level.
- **Tests per platform:**
  - T3 runs everywhere.
  - T1 (`normalize.rs:338-341`) and T2 (`posix_backslash_in_shared_path_logic.rs:35-38`) are ignored on Windows, each with a reason naming this boundary.
  - `a_user_profile_destination_becomes_a_token` (`normalize.rs:238-241`) and `a_unc_path_keeps_its_share_form` (`:285-288`) are ignored off Windows, each with a reason naming this boundary.
  - That satisfies R6, and CI prints each platform's ignored list (`product-ci-rust.yml:240`).
- **What the boundary does not hold:**
  - `validate_relative_path`'s backslash refusal (`viewer_assets.rs:222-223`) is bundle syntax under ADR-017. It is the same on every platform, so it is not part of this boundary.
  - Step 1's `\\?\` strip (`normalize.rs:72-79`) is Windows syntax that runs everywhere. On POSIX a resolved input cannot reach it (N3), so it is declared and not new coupling.
  - `is_inside` (`log.rs:390-401`) and the redaction walk's label still rewrite `\` on every platform. They are the follow-up node `posix-backslash-is-inside-and-redaction-label` (PLAN.yaml, `depends_on` port-2 and 7a; FILLER-QUEUE entry 1b), and they join this boundary when that node lands.
- **R4:** the piece removes a backslash assumption from shared logic. It adds no OS-conditional code, states every platform's behaviour, and turns nothing green by broad exclusion.
- **Scope of the ruling:** it names a boundary. It adds no file to `scripts/plan/cfg-boundary.mjs`'s allowlist, which stays untouched. A later `#[cfg]` at these sites would need its own architect-reviewed allowlist change under this boundary's name.

## Checks

**1. The constitution and the platform rule**
- **R1:** the shared semantics (audit identity, the bundle-path refusal) now hold on POSIX, Windows is byte-identical, and nothing weakens. T1's first assertion keeps `<user-home>` redaction for a profile root holding `\`.
- **R2 and R4:** see the ruling. The product diff has no cfg form.
- **R3:** N6 states the boundary, the three grades and the tests per platform.
- **R6:** the four ignore reasons cited above. The deferral record is N5 (not deferrals; single-platform by construction).
- **ADR-017:** its rule at its line 522 is unchanged. `validate_relative_path` at the head (`viewer_assets.rs:212-224`) matches B's (`:208-220`). The only hunk in that file is the walk.
- **The audit destination's identity** (B's `normalize.rs:6` and `:178-184`; the form's pins are historical, and main's tree matches them because the file is unchanged past B): collapsing two directories into one path that does not exist is now prevented on POSIX for `\`, as `component_eq`'s doc already prevents it for case.
- **The rest of the constitution:**
  - docs/02 and docs/10: no wire surface.
  - ADR-006: no class change.
  - docs/08: a per-char map in place of `replace`, so no budget risk.
- **The seam rule:** `to_slashes` and `roots_from` are private, and `roots_from`'s product caller is `roots_from_environment` (`:118-120`), reached from `normalize_destination`. T2 and T3 drive the real `ViewerAssets::from_dir`. No `pub` item is added.
- **No knock-on failures:**
  - `classify` (`log.rs:244-281`) refuses only on `credential`, so a POSIX destination keeping `\` cannot newly refuse an audit.
  - `is_inside` takes raw `Path`s, not normalized strings, so it is independent of this change.

**2. The five lines and the size**
- **Scope:** three files, matching the brief's diff.
- **Change:** holds. The normalize sites go through one `to_slashes`, and the walk uses the same predicate inline. On Windows, `std::path::is_separator` (`\` and `/`) gives the same mapping as B's `replace`.
- **Tests+mutation:**
  - M1's and M2's records (`normalize.rs:325-337`) match the predicted values and the worker report's byte-copied lines 59-60.
  - M3's record (`posix_backslash_in_shared_path_logic.rs:28-34`) matches line 61.
  - M4's (`:66-70`) matches line 43, and M5's (`normalize.rs:235-237`) matches line 44.
  - M1 to M3 are each recorded with commit, run, job and revert commit, as the settlement's OPEN-4 (a) words it.
- **Out-of-scope:**
  - ADR: none. Security: none; the change is stricter (a refusal instead of a rename) and leaks nothing new.
  - Wire: none.
  - Guarantee: touched. §36 sets §25 (e) aside, and both gates run from dispatch.
  - No dependency, no `unsafe`, no cfg in product code, no new string.
- **Size:** 160 against 140 declared is recorded as class 6 in Amendment 1. It gives the declared figure, the final figure and the reason, and the Scope line is not edited (template class 6). Crossing 150 closes the single-gate route, which this piece never had, so the route is unchanged.
- **Amendment 1's second item:** keeping the filler slot under the 2026-10-31 direction's closing paragraph holds. It matches 7a's Amendment 3, third item, and §36's size condition is an entry condition met at dispatch. Both hold.

**3. The boundary:** ruled above.

**4. The claim**
- **POSIX:** a `\` stays a byte of the destination and of the roots (T1, M1, M2), so two destinations stay two strings (T1's second and third assertions differ). A viewer asset named with `\` meets the existing refusal (T2, M3).
- **Windows:** byte-identical (M4, M5, T3).
- **Strings:** no new string. The refusal detail reachable on POSIX is the existing one (`viewer_assets.rs:223`).
- **KNOWN-LIMITATIONS:** none owed, since no POSIX product ships (KL 1).
- **The two left sites:** they go to the follow-up node, which I confirmed in PLAN.yaml and FILLER-QUEUE.md.

**5. The records and the docs**
- **The settlement:** it matches the human's ruling of 2026-11-03, item 2 (OPEN-5 (a) with the follow-up node, OPEN-6 (a), the POSIX widening not a red line). OPEN-1 to OPEN-4 are taken under the 2026-10-31 direction, item 4, dated. Amendment 1: holds (check 2).
- **Doc comments, each true against the code:**
  - step 2's doc (`normalize.rs:45-48`), `to_slashes`' doc (`:151`), `roots_from`'s doc (`:122`) and the walk's comment (`viewer_assets.rs:135-136`);
  - T1's doc (`normalize.rs:321-323`), T2's doc (`posix_backslash_in_shared_path_logic.rs:24-26`, no line numbers, naming `from_dir` and `validate_relative_path` per N5), T3's doc (`:62-64`) and the module doc (`:4-9`);
  - the `norm` comment (`normalize.rs:228`).
- **Ignore reasons:** all four name the boundary.
- **Mutation records:**
  - Each `RECORDED MUTATION` line names its mutation and commit. M1 to M3 also name the run, the job and the revert commit.
  - Each claims only what ran ("no test that ran before it failed"), which is valid under `product-ci-rust.yml:234`.
  - None names a CI runner's machine.
  - The one evidence gap is E1.

Files read: `C:/dev/wt/pbsl/kernel/src/permission/audit/normalize.rs`, `C:/dev/wt/pbsl/kernel/src/publish/viewer_assets.rs` (50-239), `C:/dev/wt/pbsl/kernel/tests/posix_backslash_in_shared_path_logic.rs`, `C:/dev/wt/pbsl/kernel/src/permission/audit/log.rs` (236-285, 380-419), `C:/dev/wt/pbsl/.github/workflows/product-ci-rust.yml` (by search), main's `normalize.rs` and `viewer_assets.rs` (120-224), `C:/dev/spatial-ide/governance/forms/kernel/POSIX-BACKSLASH-IN-SHARED-PATH-LOGIC-PREREGISTRATION.md`, `C:/dev/spatial-ide/state/consults/2026-11-03-posix-backslash-in-shared-path-logic-worker-report.md`, `C:/dev/spatial-ide/state/directives/PORTABILITY-2026-09-30.md`, `C:/dev/spatial-ide/state/consults/gates/2026-11-03-redaction-hostname-off-windows-gate1-architect.md`, the two directives the brief names, `docs/PREREGISTRATION-TEMPLATE.md` (120-133), `governance/AUTONOMY.md` (348-358, 687-697), ADR-017 (by search), and PLAN.yaml and FILLER-QUEUE.md (by search), plus 7a's form, Amendment 3 (by search).
