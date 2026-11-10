Reviewed: PR #273 at 9e32be4c6c0df025e9dfde81179e7e3e2580b112 (gate 1 read 5317510c), gate 2, architect
Verdict: FAIL
Branch: cut/engine-cancel-before-execute-siblings @ 9e32be4c6c0df025e9dfde81179e7e3e2580b112

I read the files at the head in C:/dev/wt/ecbs and the records on main at 0dad19d0. I have no shell, so I recomputed no sha256 and no numstat, did not run git, and did not read CI run 41208809578, 41257549617 or 41259750415. Where a check depends on one of those, I say so.

The verdict fails on one Evidence item, E1-r, the "before" half of E1. It closes with one git command and one appended record line. No code changes. Everything else in checks 1 to 3 holds.

## Evidence (blocking)

**E1-r. The "before" run's tree argument does not cover all of the kernel tests' inputs.**
- Where: the form, Amendment 3, second bullet (governance/forms/engine/ENGINE-CANCEL-BEFORE-EXECUTE-SIBLINGS-PREREGISTRATION.md:136 on main 0dad19d0).
- What is wrong:
  - The amendment shows that run 41208809578 at 578ec704 tested this piece's base by `git diff --name-only 578ec704 e3fb936a -- kernel engine Cargo.lock Cargo.toml` being empty.
  - But `spatial-kernel` also builds from `../protocol/data-plane`, `../protocol/skp` and `../renderer` (kernel/Cargo.toml:20-24 at the head). The workflow's own path filter lists those directories as Rust inputs (.github/workflows/product-ci-rust.yml:124-150).
  - So the record does not show that the base's tree passed the two kernel test files. Its own words, "for those paths", are literally true; the "green before" they are cited for does not follow from them.
  - 578ec704 is #270's merge commit (governance/PLAN.yaml, the #270 node's summary). The commits between it and e3fb936a look like custodian filings, so the wider diff is likely empty. I cannot run it.
- Fix (the custodian's record, no code):
  - Run `git diff --name-only 578ec704 e3fb936a -- kernel engine renderer protocol/data-plane protocol/skp Cargo.toml Cargo.lock .github/workflows/product-ci-rust.yml`.
  - If it is empty, append one row: "Amendment 5 — 2026-11-01 — class 2, Amendment 3's before (written after this piece's tests and mutations were seen). `git diff --name-only 578ec704 e3fb936a -- kernel engine renderer protocol/data-plane protocol/skp Cargo.toml Cargo.lock .github/workflows/product-ci-rust.yml` is empty (rc 0), which covers every path in product-ci-rust.yml's filter that the kernel's dependencies (kernel/Cargo.toml, `[dependencies]`) read; run 41208809578 is the before for both kernel files."
  - If it is not empty, cite the latest main push run of Product CI Rust at or before e3fb936a instead, with the same diff from that commit.
  - The re-gate reads only that row.

## Documentation (must-fix before the merge, no re-gate)

**D-a. Amendment 1 still cites the counting rule by date, not by round and item (round 12 (a)).**
- Where: the form, Amendment 1, first bullet: "by the human's counting note of 2026-09-16".
- My gate-1 D3 named this defect but gave no replacement words, so Amendment 2 (my words) did not carry the fix. That omission was mine.
- The ruling is round 5, item 2 (governance/AUTONOMY.md:357 on main names the ledger's "question round 5", item 2).
- Amendment 1 is append-only, so the fix is one appended correction (the custodian's words, not the human's):
  > Correction to Amendment 1 — 2026-11-01 — class 3. Amendment 1 cites the counting rule by date; its reference is round 5, item 2 (governance/AUTONOMY.md §21c, the human's one-line note).
- Clause check:
  - "round 5, item 2": AUTONOMY.md:357, "question round 5", item 2, holds the counting rule's text.
  - "§21c": that line sits under the §21c heading (AUTONOMY.md:347).
  - Two sentences, within round 12 (d)'s ceiling.
- It may also go in the same row as E1-r's line.

## Notes (no action)

- **N1.** I asked (gate 1, D2) for the Last verified line to name "the fixing commit". A commit cannot name its own id, so that request could not be met literally. The worker named 2ccac3d1, where the three tests landed. The worker's `git grep -c` found each name once there. The human merges by merge commit (state/directives/2026-10-31-away-until-11-04-…-take-recommendation.md, item 1), so 2ccac3d1 will be reachable from main. Acceptable as is.
- **N2.** I did not cross-check run IDs 41257549617 and 41259750415 myself. The gate-1 reviewer's check 5 records 12 runs, all successful, at headSha 5317510c: Rust workspace on push and on pull_request, with the windows-latest and ubuntu-24.04 jobs named.

## Check 1: is E1 closed?

- **(a) after: holds.**
  - kernel/tests/skp_filter_cancellation.rs and kernel/tests/publish_cancellation.rs have no `#[ignore]` and no `cfg` gate (grep at the head: no match).
  - So CI's `cargo test --workspace --locked` (product-ci-rust.yml:234) runs them on both matrix entries (:194-197).
  - The gate-1 reviewer's report confirms the 5317510c runs passed (N2).
- **(a) before: not closed (E1-r).** My finding asked for main's check at e3fb936a. The substitute run at 578ec704 holds only once the tree argument covers the kernel's dependencies.
- **(b) is accurate against the file.**
  - kernel/tests/indexed_budgets.rs has exactly one test: `measure_the_indexed_slice_against_docs_08` (:671-672), under `#[ignore = "measurement harness: minutes long, release-only, writes an evidence artifact"]` (:670).
  - It contains no other `#[test]` or `tokio::test`.
  - CI builds every test target (:221) and does not pass `--ignored` (:225), so "compiled and not run" is exact. Reducing "green" to "compiled" for that file is the whole of what the runs show.
  - The direction resolves. The directive's item 4 and its last paragraph cover it: with no recommendation (my E1 (b) offered two routes and recommended neither) and no red line, take the cheapest reversible option and record it with the date, for the human to review on return. Amendment 3 does that.
  - Amendment 3 presents none of this as a quote.
- **Do the after-runs at 5317510c stand for 9e32be4c? Yes, on the ground given.**
  - The correction commit touches engine/README.md and a comment in engine/src/dataset.rs. That rests on the worker's numstat and the custodian's git check in the filing note. I could not diff.
  - The dataset.rs change I read at the head is comment-only: :2001-2008, a 5-line span re-wrapped to 6 lines, consistent with +6/-5.
  - No Rust target reads either file. engine/ has no `include_str!` of README.md or dataset.rs, and no test in engine/, kernel/, protocol/ or renderer/ reads them as source (grep).
  - So the kernel test binaries are unchanged apart from line numbers.
  - The worker also ran `cargo test -p spatial-engine` at 9e32be4c: rc 0, 474 passed.

## Check 2: the replacement words as applied

- **The architect's D1, the README sentence (engine/README.md:61-64): applied as written.**
  - At the head it matches my D1 words, line for line.
  - The blockquote is at :52-56. The worker reports its hash unchanged; I did not hash it.
  - The clause check holds at the head:
    - Seven product attach sites: dataset.rs:1688, :2012 and :2185 (`lease_for_stream`, the producer's), index.rs:335, rowgroup.rs:344, and layout.rs:349 and :452.
    - Four `cancellable` callers: dataset.rs:1432, :1708, :1738 and :1814.
    - The `is_executing` callers are only cancel_execute_window.rs:100 and :126, dataset.rs:2202 and the test helper at cancel.rs:315. None reaches rowgroup.rs or layout.rs.
    - dataset.rs line numbers after :2008 shifted by +1 from gate 1, as the re-wrap explains.
- **The reviewer's D1 and the architect's D2, the Cancellation row (README:544): applied as written.**
  - The row is byte-equal by eye to both reports' words, including the two-space indent.
  - The three test functions exist at dataset.rs:2199 and :2213 and index.rs:913.
  - The Last verified line (:537) adds its entry in the line's existing form (N1).
- **The reviewer's D2, the comment (dataset.rs:2001-2008): applied as written.**
  - It reads "both return before the guarded scan below".
  - The session-ordinal arm returns at :1957 and the `skip` arm at :1982, both before the guarded scan at :2013-2018.
  - The only `IDENTITY_VERIFICATION_SCANS.fetch_add` is at :2015, inside the closure.
  - The re-wrapped lines fit 100 columns (:2003, the longest, is 98).
- **Amendment 2 against my D3: matches my words.** It splits them into a heading and a bullet, drops the period after the heading, and adds an attribution bullet. "round 5, item 2" resolves to AUTONOMY.md:345. The date cite in Amendment 1, which D3 also named, is left (D-a).

## Check 3: Amendment 4

- It names commit 9e32be4c and the range `origin/main...9e32be4c`. The three-dot form reads from the merge base, e3fb936a, which is unchanged: one commit after 5317510c, with no merge.
- Per file, 6/2, 50/4, 75/7, 61/1, 14/4 and 3/1 sum to 209 insertions and 19 deletions, 228 lines in all.
- That is consistent with Amendment 1's 202/14 plus the commit's +10/-8:
  - README: the commit replaced one line the branch had inserted and edited two of main's lines (+3/+2 against main).
  - dataset.rs: +4/+3 against main.
- The custodian's filing note reports its own git check agreeing with 228. I could not run the numstat.
- Class 6 is the right class: a short-form overrun (AUTONOMY.md:345), not a full-form §7 class 8.
- The size is consistent with the diff it names.

Relevant paths:
- C:/dev/spatial-ide/governance/forms/engine/ENGINE-CANCEL-BEFORE-EXECUTE-SIBLINGS-PREREGISTRATION.md
- C:/dev/wt/ecbs/kernel/Cargo.toml
- C:/dev/wt/ecbs/.github/workflows/product-ci-rust.yml
- C:/dev/wt/ecbs/kernel/tests/indexed_budgets.rs
- C:/dev/wt/ecbs/engine/README.md
- C:/dev/wt/ecbs/engine/src/dataset.rs
- C:/dev/spatial-ide/governance/AUTONOMY.md
