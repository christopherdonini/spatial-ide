# PR #210 gate 3 — reviewer
Reviewed: cut/skp-v0-live-sections-current-area-c @ 7918de41a16d6517a1cc69753eff41d9e977ded5

**Verdict: PASS. There are no Correctness, Evidence or Documentation findings. Gate 2's C1 is closed.**

B is 1457fbd0a09464c03082a2aea3df65dd1171bc95. Under proportional gates (`state/directives/2026-10-05-product-first-direction.md:15 @ 7918de41a16d6517a1cc69753eff41d9e977ded5 sha256:8c0e4e3f404b413db3e506411f401880baf9681ac8dd67362dfba73c20d7b751`), only C and E findings fail a gate.

## Correctness

None. Gate 2's C1 is closed.
- **The sentence** is at `protocol/skp/SKP-V0.md:58-61 @ 7918de41a16d6517a1cc69753eff41d9e977ded5 sha256:493ecc7311317917789ed388ca0e5c50cf9c09c2855d2291604f65a963b47224`. It no longer claims that every field maps to an accessor. It reads "Fields read an existing `engine::Dataset` accessor where one exists". It names `extent`, and it names `coverage` and `session_end` as host state.
- **Every top-level member, checked against the code at the head.** The code is `describe_dataset` at `kernel/src/skp.rs:1866-2016 @ 7918de41a16d6517a1cc69753eff41d9e977ded5 sha256:71e62832c915621e0fea61962524e7b415f77eb59faf10bd6bbbbf8cc15a148a`, and `SkpHost::describe` at `kernel/src/skp.rs:1301-1367 @ 7918de41a16d6517a1cc69753eff41d9e977ded5 sha256:7e9e9399e9ca32c950316c031e018685e7659fccc6a0f9b921858eda988106a2`.
  - `source`: from `path()` and `geoparquet_version()`.
  - `crs`: from `crs()`, `admission()` and `is_geographic_degrees_instance()`.
  - `geometry`: from `geometry_column()`, `geometry_encoding()` and `declared_geometry_types()`.
  - `identity`: from `identity()`.
  - `schema`: from `file_schema()`. Its `projectable` sub-member comes from `engine::attributes::admit_projection_column`.
  - `covering_bbox`: from `covering()`.
  - `row_count`: from `identity().verified_rows()`.
  - `license`: from `source_license()`.
  - `sanity`: from `admission()`.
  - `checks`: from `descriptor().unestablished_components()`.
  - `extent`: a constant. The comment at `kernel/src/skp.rs:1980-1985 @ 7918de41a16d6517a1cc69753eff41d9e977ded5 sha256:396c7d680e10d3c0c55229d517899c5c1b2d50b85ee168376e4ddc1f5351134e` says no `Dataset::bounds()` accessor exists. This agrees with §2 C1 at `protocol/skp/SKP-V0.md:152-156 @ 7918de41a16d6517a1cc69753eff41d9e977ded5 sha256:9a4caac7009965b9b9a189ae80d9ac3343ec6d62c9a45e615ee058f049b25515`.
  - `coverage`: from `self.watches`. `describe_dataset`'s value is a placeholder that is always overwritten.
  - `session_end`: from `self.generations.ended_reason`.
  - So `extent`, `coverage` and `session_end` are the only top-level members that no accessor fills, and the sentence names all three. No unnamed member is implied to read an accessor.
- **Sub-members with fixed values.** These are `crs.axis_normalization`, `geometry.coordinate_layout` and `geometry.frame`. "Where one exists" makes no claim about them, and the block shows their literals (lines 70 and 76). Nothing is implied.
- **"None of them runs a new query" holds.** I read the body of every accessor named above in `engine/src/dataset.rs` (lines 610, 635, 708, 948-1047). Each returns a reference or a copy of a resident field or of the envelope.
  - `unestablished_components` (`engine/src/descriptor.rs:239`) checks two `Option`s.
  - `admit_projection_column` → `check_geometry_and_identity`/`type_check` (`engine/src/attributes.rs:451-498`) runs on the `Field` only.
  - `ended_reason` (`kernel/src/skp.rs:755-759 @ 7918de41a16d6517a1cc69753eff41d9e977ded5 sha256:de7da7ef06cb4411f456d486391819e5d0604872f6a67c3230e239dcc58086d2`) takes a lock and does a map lookup.
  - None of them touches the pool, DuckDB or the file. The only query accessor on `Dataset`, `duckdb_version()` (line 646, which takes a maintenance lease), is not called by `describe`, and lines 92-94 say so.
- **Observation, not a finding, and outside this round.** `ended_reason` calls `prune_locked`, which drops expired dead-ticket entries. That is host bookkeeping, not a query. It bears on the unchanged "Pure" sentence (line 58), not on the sentence this round changed.

## Evidence

None. E1 and E8 hold at the head by my own runs (Checks 3 and 4), and CI is green (Check 7).

## Documentation

None.

## Checks

1. **The round's diff.**
   - `git diff --numstat 20d8546e 7918de41` (rc 0): one file, `protocol/skp/SKP-V0.md`, 4 lines added and 4 removed.
   - `git diff 20d8546e 7918de41` (rc 0), both hunks read:
     - `@@ -56,9 +56,9 @@` rewrites the `describe` lead's accessor sentence (lines 59-61);
     - `@@ -1108,7 +1108,7 @@` rewrites the S12 note's §1 clause (line 1111).
   - Nothing else changed. Both edits fall under Amendment 3 item 1 of `protocol/skp/SKP-V0-LIVE-SECTIONS-AREA-C-PREREGISTRATION.md`, which covers the `describe` lead's accessor sentence, and its §8 record.
   - Setup: `git fetch origin` rc 0. HEAD and `origin/cut/skp-v0-live-sections-current-area-c` were both 7918de41a16d6517a1cc69753eff41d9e977ded5. `git status --porcelain` was empty (rc 0).
2. **The sentence.** It holds; the reads are given under Correctness.
   - Commands: `grep -n "fn describe_dataset\|fn describe("` (rc 0), `grep -n "pub fn …"` over the accessors in `engine/src/dataset.rs`, and the helpers in `attributes.rs`, `descriptor.rs`, `identity.rs` and `kernel/src/skp.rs` (rc 0 each). I read each body with `sed`.
   - `grep -c "Every field maps to an existing"` gives 0 (rc 1), so the old sentence has no remnant.
3. **The S12 clause and E8.**
   - The clause is at `protocol/skp/SKP-V0.md:1111 @ 7918de41a16d6517a1cc69753eff41d9e977ded5 sha256:c051aae5b2bbb05c7b2660d6d779881b8e142e3c49b3c5f00ae4b87da6c28616`. It reads "its accessor sentence reads accessors where one exists and names `extent` (no accessor, §2 C1), `coverage` and `session_end` (host state) as the ones that do not". That matches the sentence, and the top-level reading is true (see Correctness).
   - `grep -c "excepts \`coverage\`"` gives 0 (rc 1).
   - **E8.** I cut §8 by script, from `## 8.` up to `## 9.`, with `git show <rev>:protocol/skp/SKP-V0.md | awk` (rc 0 at both revs).
     - At B: 543 lines, 39506 bytes. At the head: 553 lines, 42021 bytes.
     - `head -c 39506` of the head's §8, compared with `cmp` against B's §8: rc 0.
     - Self-test, the same prefix with one byte altered: rc 1.
     - The bytes after the prefix begin with the S12 note's heading.
4. **Gate 2's D2 in the PR body.** `gh pr view 210 --json headRefOid,body` (rc 0); the headRefOid is 7918de41a16d6517a1cc69753eff41d9e977ded5.
   - The body's E1 reads "41 changed `.rs` and `.ts` lines at 20d8546e, all comments". I recomputed it at the head: `git diff -U0 1457fbd0 7918de41 -- '*.rs' '*.ts' '*.tsx'` gives 41 lines. With comment lines filtered out, 0 remain (rc 1). The self-test on a code line hit (rc 0).
   - The body's E7 says the `commands.rs` diff is two comment hunks. The hunks are `@@ -22 +22 @@` and `@@ -199,2 +199,2 @@`, so that is correct.
   - The old wording "excepting" is gone: `grep -c` gives 0 (rc 1). The body's Size line, 115 lines over 8 files, matches Check 6. D2 is closed.
5. **Governance at the head.** The tool commit is c813c6ab74ce4c8e32eb63a6357930a4715880a3 (`git log -1 -- scripts/plan`).
   - `node scripts/plan/verify-cites.mjs` rc 0: PASS, 1751 files, 49 loose advisories, none in this diff.
   - `node scripts/plan/verify-quotes.mjs` rc 0: PASS (121 checked, 90 verified, 30 baselined).
   - `node scripts/plan/verify-test-claims.mjs` rc 0: PASS (543 claims).
   - `node scripts/plan/verify.mjs` rc 0: PASS.
6. **Budget.** `git diff --numstat origin/main...origin/cut/skp-v0-live-sections-current-area-c` (rc 0). The merge-base is B (1457fbd0a09464c03082a2aea3df65dd1171bc95).
   - Total: 115 lines (79 added, 36 removed) in 8 files, against 206 lines and 10 files. No overrun.
   - `SKP-V0.md`: 72 lines (52/20), against 130.
   - The other files are unchanged since gate 2: `types.ts` 5, `kernel/README.md` 2, `kernel/src/skp.rs` 9, `codec.rs` 8, `commands.rs` 6, `error.rs` 3 and `handles.rs` 10.
7. **CI at 7918de41.**
   - `gh pr checks 210` first gave rc 8, with the two windows-latest `cargo test --workspace` jobs pending. Their runs (38160816049, 38160819921) have headSha 7918de41a16d6517a1cc69753eff41d9e977ded5 (`gh run view --json headSha`).
   - I watched with `gh pr checks 210 --watch --interval 60`, bounded by `timeout`; the final watch returned rc 0.
   - A re-run of `gh pr checks 210` gave rc 0: 13 of 13 pass, at 2026-10-11T18:02:38Z (`date -u`). The PR's headRefOid is 7918de41a16d6517a1cc69753eff41d9e977ded5.
   - Low profile: the commit message of 7918de41 (`git log --format='%H%n%B' 20d8546e..7918de41`) carries no outside reference and no @mention. Its trailers are Co-Authored-By and Signed-off-by.

I made no commits or pushes and edited no tracked file. My scratch files are in the session scratchpad only.

Final `git status --porcelain` in `C:/dev/wt/skpe`: empty (rc 0). HEAD is 7918de41a16d6517a1cc69753eff41d9e977ded5.
