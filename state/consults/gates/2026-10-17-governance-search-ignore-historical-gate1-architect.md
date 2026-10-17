Reviewed: PR #226 at 16dd59f1275ed110333f6ceed38bee9b1dee975c (base fbbffe89)
Branch: cut/search-ignore-historical @ 16dd59f1275ed110333f6ceed38bee9b1dee975c
Verdict: PASS WITH NOTES

One Documentation finding, which must be fixed before the merge (D-1). No Correctness or Evidence finding. The pass rests on one condition, E-cond below.

## Checks

**1. §8 at the head, item by item** (the form's §8; the form, Amendments 2 to 4, and both worker reports are read on main)
1. Pass. `.ignore:1-5` holds exactly the five lines of §2 item 1, in order. The LF line endings and the final newline rest on the worker's `cmp` (S4 report, line 9). I have no shell, so the reviewer recomputes the bytes.
2. Pass. `AUTONOMY.md:1-551` at the head reads the same as main's file, which ends at line 551 (main has had no AUTONOMY change since M0, per Amendment 4 item 2). Lines 552-563 are one empty line, then Amendment 4's eleven lines. I compared them by eye and they match. The `cmp -n` result is rc 0 (S4 report, line 10, and the custodian's filing note).
3. Pass. The script digest at S4 equals S1's, 7b2d33db… (S4 report, line 11).
4. Pass. M-1 and M-2 each carry the full rev fbbffe89ecf6…, the S1 script digest (S1-S3 report, line 8), the environment facts (line 26) and two identical runs (lines 24 and 26).
5. Pass, with E-cond. The worker's rows shorten paths with `...` and cite the calls by their O-number. Under §4 the observations of record are the gate-1 reviewer's rerun at the head, so item 5 is met by that report and not by the worker's.
6. Pass. See check 3.
7. Pass. P0 held at S2, S3 and S4 (S1-S3 report, line 28; S4 report, line 14).
8. Pass. D1 gave identical results at S2 and S3: `cmp` rc 0 on each stdout, and 464 of 464 tests passed at both (S1-S3 report, lines 52-58).
9. Pass. G at S4 found 14 matches and no ripgrep invocation. Every match is in the form's expected list (S4 report, lines 15-19).
10. Pass. No record calls either figure a token count or a context size, and none says (2) is what the Grep tool walks.
11. Pass. There is no line cite into `DECISIONS-PENDING.md`, and no recorded path carries a user-profile segment.

§7 also passes: 331 lines over 6 files, within 380 lines and 6 files, and each file is under its own budget. Amendment 4 item 2 and the PR body name test text by its full commit id. The PR body asks for a merge commit, which keeps S3 (7f09c0e3), the commit §32 cites, reachable from main.

**2. T1 as the seam test.** Pass. `scripts/plan/measure-reads.test.mjs:48-68` copies the real `state/CUT-STATE.md` into a temporary git repo. It spawns the real `scripts/hooks/session-resume.mjs` with `CLAUDE_PROJECT_DIR` set to that repo, `GIT_CEILING_DIRECTORIES` set to its parent, `CLAUDE_CODE_REMOTE` deleted and `{}` on stdin. It takes the bytes between `READING_ORDER + "\n\n"` (the imported export) and the last `"\n\nResume facts:"`. It then asserts that `block=` equals that length, that stdout's prefix of that length equals those bytes, and that the next two bytes are `\n\n`.

The script's side was checked against the interface it actually calls. It uses `extractSessionContinuityBlock` (`scripts/hooks/session-resume.mjs:45-57`) unaltered at `scripts/plan/measure-reads.mjs:65`, and `parseSessionContinuity` (`scripts/hooks/precompact-flush.mjs:61-79`) at `scripts/plan/measure-reads.mjs:66`. The hook's `buildOutput` (`scripts/hooks/session-resume.mjs:99-116`) joins its parts with `\n\n`, which is exactly the shape T1 slices. M1 failed at the named assertion (19112 against 19111; S1-S3 report, line 15). The script exports nothing. Its callers are the human-ordered M-1 and M-2 runs and the after-C run, so the caller rule is met.

**3. The §5 clause table against the S1-S3 report (observations at S3).** Each clause of `AUTONOMY.md` §32 is listed with the observation that shows it:
- "…excludes historical material: the paths in .ignore": O1 and O8. `/state/drafts/` was the only path probed, as the directive's test asks; the other four lines rely on the same mechanism. This is not a finding, because the phrase is the human's own and is not untrue.
- "A tree-wide `rg` from Bash also skips hidden folders such as .cut-archive/": O10.
- "the Grep tool does not": O6, backed by O7.
- "give the Grep tool that folder or that file as its path": O3 and O4.
- "run `rg --no-ignore` … with that folder as its path": O9 and O11.
- "Read the file by its name": O12.
- "A Grep call over the whole tree, or over a folder above … does not reach it": O1, O2 and O5. In this sentence "the excluded one" means the `.ignore` paths, as §32's last paragraph defines them, so O6 does not contradict it.
- "The Glob tool still lists the files there by name": O13, as the §5 table allows. O14 alone did not show the probe (it was truncated at 100 of 157) and was not used.
- "observed at 7f09c0e3… Claude Code 2.1.300 and ripgrep 15.2.0": S1-S3 report, line 28.

No clause of §32 lacks an observation, and none of them is contradicted.

**E-cond.** My clause reading uses the worker's rows at S3. If the reviewer's rerun of O1–O4, O6, O8–O13 at 16dd59f1 contradicts any of them, the matching §32 clause fails §8 item 6, and that is an Evidence block.

**4. The section against the directive** (`state/directives/2026-10-14-governance-smaller-reads-ignore-cut-state-rotation-decisions-pending.md`, piece A and the addendum's A). Pass.
- The rule's first sentence is H1. The human ruled it ("the first sentence becomes the architect's H1 and the second and third stay as I wrote them", 2026-10-17 directive, item 3, A, at line 15).
- The second and third sentences match the directive's line 23, read character by character. The reviewer recomputes the line-23 pin.
- W is §2 item 4's text unchanged, approved as assembled (2026-10-17 second directive, item 1).
- §32's framing states the exception ("nothing in it is changed except its first sentence"). It does not present H1 as the human's words.
- Nothing in the section widens either text. The Grep-with-path method, which goes beyond the addendum's "The Grep tool alone is not enough there", was put to the human in OPEN-3 and approved.

**5. §2 item 7, (a) to (f), as B and C will read them at the head.**
- (a), (d), (e) and (f) hold as they stand.
- (b) and (c) need one forward note each, F-1 and F-2. These are for B's and C's forms, not for this PR.

## Correctness
None.

## Evidence
None. E-cond above applies.

## Documentation (must-fix before the merge)

**D-1. The PR body gives the two figures without the names that §2 item 5 requires.** The human's directive says each measurement is "named for exactly what it shows" (the measurements paragraph). The PR body's figures section carries no names. This is not the human's wording, so the custodian applies the fix with no re-gate. Insert after the figures block:

> - **The figures' names** (§2 item 5, OPEN-1 (A)). M-1: "Routine read (UTF-8 bytes): the SESSION-CONTINUITY block as the SessionStart hook prints it, the ledger entries dated at or after 168 hours before the block's `flushed_at`, and DECISIONS-PENDING.md's `## Pending` section, at fbbffe89ecf693eabfe95448007ae0444e305d19." M-2: "Search corpus (bytes): the sum of the committed sizes of the files `rg --files` lists from the root of a clean checkout of fbbffe89ecf693eabfe95448007ae0444e305d19." Neither is a token count.

Clause check:
- "the block as the hook prints it": `measure-reads.mjs:65`, proven by T1.
- "dated at or after 168 hours before `flushed_at`" with no upper bound: `measure-reads.mjs:76-77`, and T2 keeps both the boundary entry and the entry after the flush.
- "`## Pending` section": `measure-reads.mjs:80`, which runs from the heading to the next `^## ` heading, proven by T4.
- "committed sizes of the files listed": `measure-reads.mjs:105-113`, proven by T7.
- "clean checkout, from the root": S1-S3 report, line 26 (porcelain empty, sih-m0 at M0).
- "not a token count": §1, may not claim.

## Forward notes (for B's and C's forms, not this PR)

**F-1 (B).** B's form §2 item 5 changes reading-order item 1 to also name "AUTONOMY.md §<n> part B and PRECEDENTS.md P-035 and P-036". The frozen script's part 1 counts only the block. After B, then, part 1 loses the six standing items' bytes, while item 1 still delivers them from those sections. B's form §2 item 8 names what part 1 gains (the notice and the `Previous ledger:` line) but not what it loses. A's item 7 (c) does not catch this, because no anchor changes.

Fix in B's form before B's code: one line saying that the after-C part 1 leaves out the standing items' sections that item 1 now names, and giving their byte size beside the figure, so the human's before/after pair is not read as a reduction it is not.

**F-2 (C).** Item 5 M-2 step 4 runs `node C:/dev/wt/sih/scripts/plan/measure-reads.mjs`. C's form §2 item 10 runs "A's four steps with `<M0>` replaced". C's form should also name the script path as the one at the merge commit, since that worktree will be gone. The digest check it already carries (`git show <merge>:…`) still binds.

## Files read
- C:/dev/spatial-ide/scripts/plan/SEARCH-IGNORE-HISTORICAL-PREREGISTRATION.md
- C:/dev/spatial-ide/state/directives/2026-10-14-governance-smaller-reads-ignore-cut-state-rotation-decisions-pending.md
- C:/dev/spatial-ide/state/directives/2026-10-15-round-1b-i3-allowed-a-open-1-b-open-1-open-2.md
- C:/dev/spatial-ide/state/directives/2026-10-17-placements-item-44-governance-clause-composition-readme-item-41-unknown-attempt.md
- C:/dev/spatial-ide/state/directives/2026-10-17-merges-223-224-w-approved-open-12-flake-s3-unknown-attempt-slot-1-s5d-route-a.md
- C:/dev/spatial-ide/state/consults/2026-10-16-governance-search-ignore-historical-s1-s3-worker-report.md
- C:/dev/spatial-ide/state/consults/2026-10-17-governance-search-ignore-historical-s4-worker-report.md
- C:/dev/spatial-ide/scripts/plan/CUT-STATE-CAP-AND-ROTATION-PREREGISTRATION.md
- C:/dev/spatial-ide/scripts/plan/DECISIONS-PENDING-OPEN-AND-ARCHIVE-PREREGISTRATION.md
- C:/dev/wt/sih/.ignore
- C:/dev/wt/sih/AUTONOMY.md
- C:/dev/wt/sih/scripts/plan/measure-reads.mjs
- C:/dev/wt/sih/scripts/plan/measure-reads.test.mjs
- C:/dev/wt/sih/scripts/hooks/session-resume.mjs
- C:/dev/wt/sih/scripts/hooks/precompact-flush.mjs
- C:/dev/wt/sih/scripts/hooks/cloud.mjs
- C:/dev/wt/sih/state/drafts/search-ignore-probe.md
- C:/dev/wt/sih/.cut-archive/search-ignore-probe.md

Neither probe token appears joined in this report. I had no shell, so every byte or hash claim above relies on the worker's or the custodian's script output, and the reviewer recomputes them.
