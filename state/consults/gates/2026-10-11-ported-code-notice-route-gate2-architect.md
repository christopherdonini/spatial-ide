# PR #208 gate 2 — architect
Reviewed: cut/ported-code-notice-route @ 7b58300b156e52ddb0d0a8ec8fa5162b0cc5ac45

**Verdict: PASS. Correctness: PASS. Evidence: PASS. Documentation: one new must-fix finding, plus gate 1 D-3, which is carried to the closing record. All are to be fixed before the merge, with no re-gate.**

## Gate 1 findings, ruled at the new head

**Architect gate 1**
- **C-1: closed.**
  - `LICENSES/third-party/ported/README.md:46-50` now says where each of the three functions runs. The table at `:52-58` has a "Checked by" column. Rows `:56-58` (the allowlist, the header, `adopted_by`) are assigned to `checkPortedFiles`, "the repository check and the prebuild check".
  - `CONTRIBUTING.md:172` now reads "a packaged build from a git checkout" and states what a build outside a checkout does.
  - Both claims hold in the code (item 3 below).
- **C-2: closed.**
  - `frontends/shell/scripts/generateNotice.mjs:96` binds `portedRoot`.
  - `:115` passes it to `portedPrebuildCheck` as `root`, and `:186` passes `{ portedRoot }` to `notice()`.
  - Both `options.portedRoot` (`renderer/bundle-viewer/notice.mjs:113`) and `portedPrebuildCheck`'s `root` (`renderer/bundle-viewer/portedNotices.mjs:312`) now have a product caller.
  - It is the same directory as `notice()`'s default (`notice.mjs:114`; `repoRoot` is `generateNotice.mjs:95`), so P2 holds. The worker reports the NOTICE sha256 equal to P2 (worker report 2, `:42`).
  - The real-shape run of this seam is every shell build. A wrong root makes `readPortedRegistry` throw (`portedNotices.mjs:82-86`), and `check:dist-notice` then reads the output (`checkDistNotice.mjs:462-464`).
- **C-3: closed.**
  - The comment at `frontends/shell/scripts/checkDistNotice.mjs:457-461` is now true (item 4 below).
  - The `ENTRY_LINE` exposure is carried to the first viewer-port piece's form (Amendment 2, item 4), as gate 1 required.
- **D-1: closed, on the custodian's paraphrase of the body.** I have no shell and could not run `gh pr view 208`. The custodian confirms against the published body before the merge.
- **D-2: closed, on the same paraphrase.**
  - The body now limits the sentence to the ported README and the CONTRIBUTING section.
  - Those two say it: `LICENSES/third-party/ported/README.md:66`, `CONTRIBUTING.md:172`.
  - `LICENSES/README.md` does not say it (searched for "unmarked", "cannot detect" and "not detect": no match).
- **D-3: not closed yet; carried.** Amendment 2, item 5 commits the closing record to name `renderer/bundle-viewer/notice.d.mts`. That record does not exist at this head. It is must-fix in the closing record before the merge.

**Reviewer gate 1**
- **C-1: closed** (`CONTRIBUTING.md:172`; see architect C-1).
- **C-2: closed.**
  - `README.md:55` limits `readPortedRegistry` to the schema, and checks `upstream_repository` and `license_id` there as non-empty strings only (`portedNotices.mjs:101`, `:103`).
  - `:57` and `:58` state the tracked-file test as git-checkout only (`portedNotices.mjs:209`, `:240-241`). See the new D-1 for one remaining imprecision.
- **D-1, D-2 and D-3: closed, on the custodian's paraphrase** (same basis as architect D-1 and D-2).

## Amendment 2: does the round do what it says, and nothing more?

Yes.
- **Item 1:** done (C-2). The viewer's caller is not among the touched files.
- **Item 2:** done.
- **Item 3:** done. The changed span is lines `:457-461`, all comment lines, and the code that follows is the same calls as at c8196576 (`:462-464`, shifted by two lines). The reviewer confirms by diff.
- **Item 4:** carried, with nothing done here, as the item says.
- **Item 6:** the worker's count is 1,284 lines over 19 files, within Amendment 1 (j). The reviewer recomputes it.
- **Item 7:** `PLAN.yaml` is on main and outside this branch. Not checked here.
- **Order:** Amendment 2 was committed on main at cd9a9c8e (reflog time 1791715022) and pushed, before c1b236ad (1791715123). So it came before the code.
- **The quoted span** "Both existing callers are unchanged" matches the form, §2.4 bullet 1, `PORTED-CODE-NOTICE-ROUTE-PREREGISTRATION.md:93`, in the main checkout.

## Correctness

PASS. Every claim in the new docs text holds at the head:

**Where each function runs**
- `readPortedRegistry` runs in:
  - `notice()` (`notice.mjs:111`);
  - `check:dist-notice` (`checkDistNotice.mjs:462`);
  - the repository check (`scripts/check-ported-notices.mjs:28`);
  - the prebuild check (`portedNotices.mjs:313`).
- `checkPortedFiles` runs only in `scripts/check-ported-notices.mjs:36` and `portedNotices.mjs:315`, the latter reached only from `generateNotice.mjs:115`.
- `portedSectionFindings` runs only in `checkDistNotice.mjs:464`.
- These are the only non-test call sites (searched).

**The table rows**
- `:54`: `portedNotices.mjs:122-128`.
- `:55`: `:98-107`, `:110-136`.
- `:56`: `:247`.
- `:57`: `:240-242`. `readHeaderWindow` returns null on ENOENT (`:154`), so outside a checkout a missing registered file is a finding.
- `:58`: `:204-210`.

**Outside a git checkout**
- `listTrackedFiles` returns null on ENOENT of `.git` (`:290-294`). Then direction (i) is skipped (`:227`), and (ii), (iii) and (iv) still run.
- The NOTE line comes from `:68-70` and `:316`, and is printed by `generateNotice.mjs:116`.
- So `CONTRIBUTING.md:172`, which says "checks the registry and the registered files only, and prints one NOTE line", holds. So do `README.md:62` and `:69`.

**The new `checkDistNotice.mjs` comment**
- The application section is pushed after `duckdbAmalgamationSectionLines` (`notice.mjs:286-290`), and so after `NOTICE_END`. `noticeBody` ends at `NOTICE_END` (`checkDistNotice.mjs:346`, `:356`). So it is outside every slice: true.
- The viewer subsection is emitted at `notice.mjs:245`, before the first `extra.npmSets` heading (`:259`), whose text begins with `FRONTEND_HEADING`. So it is inside the viewer slice (`checkDistNotice.mjs:362`), which `:429` counts: true. I traced this in the code; the worker did not (report 2, `:25`).
- The predicate reads `normalized` (`:330`, `:464`).
- The empty and non-empty conditions match `portedNotices.mjs:263-280`.

## Evidence

PASS.
- The worker's runs are recorded with their exit codes (report 2, `:29-38`). That includes the shell's `npm run verify` with the `check:dist-notice` PASS line, which exercises the C-2 seam end to end on the real tree.
- I cannot see CI at 7b58300b. The custodian reads the check runs before the merge.

## Documentation (must-fix before the merge; no re-gate)

- **D-1 (new).** Rows `LICENSES/third-party/ported/README.md:57` and `:58` name "the repository check and the prebuild check", then say that outside a checkout the check reads the file from the disk, or checks the directive's form only. The repository check has no archive mode: outside a checkout it fails by name before it reaches `checkPortedFiles` (`scripts/check-ported-notices.mjs:30-35`). The outside-checkout clause holds for the prebuild check only.
  - Fix: name the prebuild check in those two clauses.
  - This is not Correctness. It understates the repository check and claims no guarantee that is missing.
- **Gate 1 D-3 (carried).** The closing record names `renderer/bundle-viewer/notice.d.mts` as §2.4's declaration file (Amendment 2, item 5).
- **PR body.** The custodian confirms that the published body of PR #208 carries what the paraphrase says. I closed gate 1's body findings on that paraphrase alone.

## Files read

- `C:/dev/spatial-ide/state/consults/gates/2026-10-11-ported-code-notice-route-gate1-architect.md`
- `C:/dev/spatial-ide/state/consults/gates/2026-10-11-ported-code-notice-route-gate1-reviewer.md`
- `C:/dev/spatial-ide/state/consults/2026-10-11-ported-code-notice-route-worker-report-2.md`
- `C:/dev/spatial-ide/renderer/bundle-viewer/PORTED-CODE-NOTICE-ROUTE-PREREGISTRATION.md` (lines 90-95, 300-396)
- `C:/dev/spatial-ide/.git/logs/` (searched for the three commits' times)
- In `C:/dev/wt/pcnr/`:
  - `frontends/shell/scripts/generateNotice.mjs`
  - `frontends/shell/scripts/checkDistNotice.mjs` (lines 160-199, 290-494; searched)
  - `LICENSES/third-party/ported/README.md`
  - `CONTRIBUTING.md` (lines 150-173)
  - `LICENSES/README.md` (searched)
  - `renderer/bundle-viewer/portedNotices.mjs`
  - `renderer/bundle-viewer/notice.mjs` (lines 90-304, 800-871)
  - `scripts/check-ported-notices.mjs`
  - the whole tree, searched for non-test call sites of the five `portedNotices` exports
