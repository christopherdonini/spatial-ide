*Custodian's filing note (2026-10-26): the architect's read-only draft of the form for `verify-cites-past-end-bound`, the governance lane's next piece (S3), with `verify-quotes-cite-listing-line-count` (S4) folded in as its second line by the human's direction, read at main dcd85569. Its first finding: as folded, the piece does not fit a five-line form, because the second line's fix changes an existing test's asserted figure, a property under test (round 25, item 2 (e)), and the two lines come to about 156 changed lines, over §21c's 150. Its OPEN-1, the form, is the human's and is put to the human; nothing is committed from this draft until the human answers. The custodian's choices on the rest, if the piece goes ahead: OPEN-2 (A), a list entry no longer needed is not reported; OPEN-3 (A), one shared count helper (under Draft A only); OPEN-4 (A), the worker runs the head checker over each in-flight branch tip, for information. The run 01:04:21Z to 01:14:26Z by its transcript (Read 14, Grep 12, Glob 1; no write tool). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 69cce9561ce7c6d3e72327144cb4b148ae644b4263114fb0bf88a8d55fd728d3.*

---

Drafted: verify-cites-past-end-bound, five-line form, architect
Read at main @ dcd85569, in the main checkout. That is the brief's short id. I have no shell, so this report carries no sha256 and no full commit id. All prose here is my own words. The only byte-copied text is the reuse index, copied from the brief. I name the 13 cites only by count, never as cites: written as cites, they would become this report's own findings once the bound changes.

## First: as folded, the piece does not fit a five-line form

- **The §21a guarantee category (the blocking reason).**
  - The second line (S4) cannot be fixed without changing what an existing test asserts. `a_cite_listing_reports_out_of_range_for_a_line_past_the_files_end` (scripts/plan/verify-quotes.test.mjs:182-190 @ dcd85569) asserts the wrong figure at line 189: a 3-line file that ends in a newline is reported as having 4 lines. Its RECORDED MUTATION comment (lines 177-181) records the same figure.
  - Changing an asserted figure changes "a property currently under test" (AUTONOMY.md:325-327 @ dcd85569). That is the precedent's reading: scripts/hooks/QUESTIONS-MIRROR-ITEM-COUNT-PREREGISTRATION.md:5-8 @ dcd85569 took the full form for a change to the count words in an asserted text.
  - Under round 25, item 2 (e) (docs/PREREGISTRATION-TEMPLATE.md:176 @ dcd85569), a piece whose Out-of-scope line names a touched category takes the full form from dispatch, and no five-line form is committed for it.
- **Size (§21c, AUTONOMY.md:347-357 @ dcd85569).** My estimate for both lines is about 156 changed lines across 6 files, which is over the 150-line bound.
- **The first line (S3) alone fits.** No existing test's assertion changes. I traced every fixture in scripts/plan/verify-cites.test.mjs and scripts/plan/rotate-decisions-pending.test.mjs:263-295 @ dcd85569: none cites the line just past a file's end and expects it to pass. The inclusive upper bound that is under test (verify-cites.test.mjs:128-134) is kept. My estimate is about 134 lines across 4 files.

So OPEN-1 below is the human's: the human placed the piece on a five-line form, and round 25 (e) forbids that form for it. Draft A below is the content as briefed, written honestly. Draft B is the version that can be committed if the human splits S4 back out.

## Draft A: the five lines as briefed (both lines). This routes to the full form; it is not to be committed as a five-line form.

```
Authority: PLAN node `verify-cites-past-end-bound` (PLAN.yaml:6045-6061 @ dcd85569) with `verify-quotes-cite-listing-line-count` (PLAN.yaml:6062-6078 @ dcd85569) folded in as its second line, both by the human's directive state/directives/2026-10-26-resent-2026-10-25-o1-s1-clang-cl-route-a-hugeint-cast-b-five-nodes-placed.md, item 2, whose design this piece builds; the cites the list holds are the enumeration of the settlement in scripts/plan/VERIFY-CITES-OUT-OF-RANGE-LINE-COUNT-PREREGISTRATION.md (OPEN-1), re-run by the worker at the branch's base; the reuse index found no prior art on either search (cite line bound; legacy allow list), a miss noted here.
Scope: 6 files: scripts/plan/verify-cites.mjs, scripts/plan/verify-cites.test.mjs, scripts/plan/verify-cites-legacy-bound.json (new), scripts/plan/verify-quotes.mjs, scripts/plan/verify-quotes.test.mjs, .github/workflows/governance-ci.yml (header comments only); declared line budget 180 (insertions plus deletions, tests, comments and the list counted, AUTONOMY.md:357 @ dcd85569); this form exempt; one existing test changed (a_cite_listing_reports_out_of_range_for_a_line_past_the_files_end: its expected count and its RECORDED MUTATION comment); no test removed.
Change: verify-cites bounds a cited line by the file's true line count, in the tree and at a pin, so a cite to the line just past the end of a file that ends in a newline, or to line 1 of an empty file, fails as any other out-of-range cite does, except a cite that scripts/plan/verify-cites-legacy-bound.json lists by its citing file and its token as written, which is checked under the old bound (the split's piece count) in the tree and at its pin; the scan fails by name when that list, at a commit on HEAD's first-parent history that changes it, holds an entry its first parent's list does not (the oldest such commit excepted, an absent list holding none), and fails in a shallow clone; the list holds exactly the cites the corrected bound newly fails at the branch's base, all inside filed records, which are not edited; and verify-quotes' cite listing bounds and states the same true count, so the line just past such a file's end is listed out of range, not as a blank line.
Tests+mutation: a_cite_to_the_line_just_past_the_end_of_a_newline_ended_file_fails (new; fails at the base); M1: checkCitation's bound read from `pieces` again, and the test fails by name (alone). a_cite_to_line_1_of_an_empty_file_fails (new; fails at the base); M2: the empty-file term in countOf dropped, and the test fails by name (with an_out_of_range_reason_for_an_empty_file_counts_0_lines). a_pinned_cite_to_the_line_just_past_the_end_at_its_commit_fails (new; fails at the base); M3: checkPinned's bound read from `pieces` again, and the test fails by name (alone). a_cite_on_the_legacy_bound_list_passes_under_the_old_bound_only_from_its_listed_file (new); M4: the list lookup keyed by the cite alone, without its citing file, and the test fails by name (alone). a_pinned_cite_on_the_legacy_bound_list_passes_under_the_old_bound_at_its_pin (new); M5: checkPinned's old-bound term removed, and the test fails by name (alone). the_legacy_bound_list_may_shrink_but_a_gained_entry_fails_by_name_even_at_the_same_count (new); M6: the subset check replaced by a count comparison, and the test fails by name (alone). the_legacy_bound_list_check_fails_by_name_in_a_shallow_clone (new); M7: the shallow-clone check removed, and the test fails by name (alone). a_cite_listing_reports_the_line_just_past_a_newline_ended_files_end_as_out_of_range (new; fails at the base); M8: the listing's range comparison taken from the split's piece count again, and the test fails by name (alone). a_cite_listing_reports_out_of_range_for_a_line_past_the_files_end (changed: expects 3 lines); M9: the listing's printed count taken from the split's piece count, and the test fails by name (with the M8 test). Each mutation is observed by applying it, running the named test, recording its failure by name with the commit in a `RECORDED MUTATION` comment, and reverting it.
Out-of-scope: ADR: no status line or amendment; security: nothing ADR-020, ADR-009 or ADR-021 governs (Node's standard library and git only, no dependency; the workflow's steps, triggers and permissions unchanged); wire: no SKP, data-plane or MCP surface, nothing under protocol/; guarantee: TOUCHED by the second line, whose fix changes the asserted figure of an existing test (scripts/plan/verify-quotes.test.mjs:189 @ dcd85569), a property currently under test; not touched by the first line, where no existing test's assertion changes and the inclusive upper bound under test is kept.
```

## Draft B: the version that can be committed (S3 alone; S4 split back out, the human's choice)

The Authority line is the same, without the fold clause and without the second PLAN node. The other lines replace Draft A's:

```
Scope: 4 files: scripts/plan/verify-cites.mjs, scripts/plan/verify-cites.test.mjs, scripts/plan/verify-cites-legacy-bound.json (new), .github/workflows/governance-ci.yml (header comments only); declared line budget 150 (insertions plus deletions, tests, comments and the list counted, AUTONOMY.md:357 @ dcd85569); this form exempt; no existing test is changed or removed.
Change: <Draft A's Change line, up to and including "which are not edited">.
Tests+mutation: <Draft A's first seven tests, M1 to M7, and the observation sentence>.
Out-of-scope: ADR: no status line or amendment; security: nothing ADR-020, ADR-009 or ADR-021 governs (Node's standard library and git only, no dependency; the workflow's steps, triggers and permissions unchanged); wire: no SKP, data-plane or MCP surface, nothing under protocol/; guarantee: none touched, since no existing test's assertion changes, the inclusive upper bound under test is kept, and the header's disclosed limit is narrowed to the listed cites, with no property under test changed; verify-quotes' count in its cite listing (node verify-quotes-cite-listing-line-count) is not fixed here.
```

The reuse index, byte-copied from the brief (the read-only clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c):

```text
$ node tools/reuse.mjs cite line bound
No prior art recorded for "cite line bound". Research it before planning an implementation.
$ node tools/reuse.mjs legacy allow list
No prior art recorded for "legacy allow list". Research it before planning an implementation.
```

## Notes

### 1. The list and how verify-cites reads it

- **Shape.**
  - The file holds one object, `{ "$doc": <string>, "entries": [ { "path": <citing file>, "cite": <token as written> } ] }`. This is the same top-level shape as the verify-quotes baseline.
  - `$doc` names the node and the human's directive by path and item.
  - Entries are sorted by path, then by cite.
  - The file is JSON, so verify-cites' default scan (md files and code comments; verify-cites.mjs:322-331 @ dcd85569) never reads it as a citing file, and verify-quotes' claim set does not include it.
- **The key** is the human's: the citing file and the cite token as written (`cite.raw` without its pin). An entry therefore covers every occurrence of that token in that file. That is harmless, because records do not change.
- **Reading it.**
  - runVerifyCites reads the file from the scanned root (an absent file is an empty list).
  - For each cite it sets `cite.oldBound`, the same way it already sets `cite.relPath` (verify-cites.mjs:357 @ dcd85569). This needs no signature change, and the product caller sets the property on every cite.
  - The tree check: `inRange` (verify-cites.mjs:264) becomes `maxL <= n.lines || (cite.oldBound === true && maxL <= n.pieces)`.
  - The pin check: the test at checkPinned (line 302) becomes `maxL > lc.lines && !(cite.oldBound === true && maxL <= lc.pieces)`.
  - Reasons keep printing `.lines` (lines 269, 275 and 303).
  - The old bound is a separate disjunct, so the file-top RECORDED MUTATION (verify-cites.test.mjs:6-10, `<=` to `<` on the first comparison) still fails only `an_exact_reference_to_the_last_line_of_a_file_is_in_range`. The worker applies that mutation once at the head and reports the result in its hand-back. If any other test fails under it, STOP.
- **Malformed list.** There is no validation code. A list that cannot be parsed, or whose `entries` cannot be iterated, throws, and the existing catch at verify-cites.mjs:433-440 exits 1. An entry whose fields are not strings simply never matches. This is disclosed, and no claim is made about it.

### 2. The gained-entry check, and where it lives

- **The design (my recommendation, H1).** The check lives in verify-cites, so governance-ci's existing verify:cites step (governance-ci.yml:150-151 @ dcd85569) fails, and a local run fails the same way.
  1. If `git rev-parse --is-shallow-repository` prints true, the run fails by name.
  2. Otherwise it walks `git log --first-parent --reverse --format=%H -- scripts/plan/verify-cites-legacy-bound.json`.
  3. Each commit after the oldest must hold only entries that its first parent's list holds. An absent list holds none, so a deletion is a shrink and a later re-add is a gain.
  4. Each failure names the commit and the entry.
  5. Failures go into a new `listErrors` array that runVerifyCites returns. main() prints them under their own FAIL line and sets exit 1. They are not pushed into `gated`, whose FAIL line says unresolved reference, which a gained entry is not. rotate-decisions-pending.test reads only `gated` and `advisory`, so it is unaffected.
- **Why first-parent history works in every CI event.**
  - On a PR, GitHub's merge ref has the base as its first parent.
  - On main, a PR's merge commit has the previous main as its first parent.
  - On a direct push of several commits, each commit is visited.
  - The plan job already uses fetch-depth: 0 (governance-ci.yml:137-139).
- **The seed** is the oldest commit that touches the list: the worker's list commit on the branch, and the PR's merge commit on main.
- **A consequence the worker must know.** The list is committed once, whole, after the enumeration is settled. If a correction on the branch adds an entry, the branch's push run goes red, even though the PR run and main stay green.
- **The alternative (H2), not recommended:** a separate workflow step comparing the list against the PR's base sha or the push's `before` sha.
  - It needs event-sha handling: an all-zero `before` on a branch's first push, and no sha at all under workflow_dispatch.
  - It sees only the event's endpoints.
  - It cannot be run locally.

### 3. Enumerating the list (the worker's step, before the list commit)

1. At the branch base B, give B's full id.
2. Over a clean tree at B, run B's checker (from `git show B:scripts/plan/verify-cites.mjs` into scratch) and the head's checker with no list.
3. Diff the findings on the key (relPath, citeLine, target).
4. **Expected from the records:** 13 head-only findings, 5 gated and 8 advisory, all in filed reports under state/consults/ and state/consults/gates/ (PLAN.yaml:6060 @ dcd85569; the settlement at scripts/plan/VERIFY-CITES-OUT-OF-RANGE-LINE-COUNT-PREREGISTRATION.md:156 @ dcd85569). That count was taken at 5315a6a5, so records filed since then may add to it. There should be 0 base-only findings, every shared finding should have an identical reason, and each head-only reason should name exactly the line one above the file's true count.
5. Each head-only finding becomes one entry. The list is committed in one commit.
6. Re-run with the list. The head's gated and advisory sets must equal B's byte for byte (key and reason), with listErrors at 0.
7. **STOP and report before the list commit if:**
   - the count is not 13;
   - any head-only finding is outside a filed record (that cite is fixed in place, outside this Scope, so the custodian settles it);
   - there is any base-only finding, any changed shared reason, or any head-only finding that is not a just-past-end line.
8. **Neither the hand-back nor the PR body writes the 13 as path:line tokens.** Filed under state/consults/, they would be gated past-end cites in a new record. Refer to the list file at its commit instead.

### 4. The second line (S4), for Draft A or its own node

- **The change.** At verify-quotes.mjs:1078-1081 @ dcd85569, read the text once, bound `c.startL` by its true count, and print that count. A line just past the end is then listed out of range instead of as `(blank line)`.
- **The docstring** (lines 1041-1048) becomes true as worded and is not edited.
- **The hash check's own count** (line 333) is already correct and is not touched.
- **The count helper:** OPEN-3.
- **The changed test:** its expected text becomes `out of range (file has 3 lines)`. Its RECORDED MUTATION comment's figure is rewritten, and its mutation is re-observed at the head with the commit.
- **CI effect:** none. governance-ci runs verify-quotes without `--show-cites`.

### 5. Replacement words (mine; none is the human's wording, none is red-line; applied by the worker with no re-gate, and the PR body lists them). Each clause is checked against the code at dcd85569 or the design above.

- **R1**, replacing verify-cites.mjs:15-20 @ dcd85569 from `Here and below` to the end of line 20: *Here and below, a file's line count is its true count (a final newline ends the last line and starts no new one, and an empty file has 0 lines); a line is within a file (and does not exceed it) when it is no higher than that count, in the tree and at a pin, and every reason that prints a line count prints it. LEGACY BOUND (node verify-cites-past-end-bound): a cite that scripts/plan/verify-cites-legacy-bound.json lists by its citing file and its token as written is also within a file when its line is no higher than the number of pieces the file's text splits into at newlines, one more than the line count for a file that ends in a newline or is empty, in the tree and at its pin. The list holds cites inside filed records, which are not edited. The scan fails when the list, at a commit on HEAD's first-parent history that changes it, holds an entry its first parent's list does not (an absent list holds none), the oldest such commit excepted, and it fails in a shallow clone, where that history cannot be read.*
  - The true count: countOf at verify-cites.mjs:240-243. Holds.
  - The true bound in both places: the design in note 1. Holds.
  - The reasons print `.lines` at lines 269, 275 and 303. Holds.
  - The old bound for listed cites: the disjunct in note 1. Holds.
  - The key: relPath plus `cite.raw`. Holds.
  - Records only: the STOP rule in note 3. Holds.
  - The failure conditions: note 2, steps 1 to 3. Holds.
  - R1 carries no path:line token.
- **R2**, replacing the clause at verify-cites.mjs:67-68 @ dcd85569: *a listed cite (the legacy bound above) to the line just past the end of a file that ends in a newline, or to line 1 of an empty file; a list entry no longer needed is not reported; a change to the list is checked against its history only once committed; and that history is read along first parents, so a commit reached only through a merge's second parent is checked as part of the merge, not alone;*
  - "No longer needed is not reported": OPEN-2 (A).
  - "Only once committed": the walk is over commits.
  - "First parents": the `--first-parent` flag. Holds.
- **R3**, replacing verify-cites.mjs:239 @ dcd85569: *`lines`, the true count, is the check's bound and the count every reason prints; `pieces`, the split's piece count, is the bound only for a cite on the legacy-bound list (see the header).*
  - Holds by note 1.
- **R4**, in governance-ci.yml:22-23 @ dcd85569, replacing `every rooted (in-tree) path:line reference resolves against the tree (verify:cites)` with: *every rooted (in-tree) path:line reference resolves against the tree (one listed in scripts/plan/verify-cites-legacy-bound.json under its old bound), and that list has gained no entry along its first-parent history (verify:cites)*
  - Holds by note 2.
- **R5**, appended after governance-ci.yml:136 @ dcd85569 as one comment line: *verify-cites reads the legacy-bound list's first-parent history too, and fails by name in a shallow clone.*
  - Holds by note 2, step 1.

### 6. Size (my estimate)

| Part | Lines |
|---|---|
| verify-cites.mjs: R1 to R3, the list read, `oldBound`, two bound sites, the history walk and the shallow check, main's listErrors | about 55 |
| verify-cites.test.mjs: T1 to T7 with their mutation comments | about 60 |
| the list (13 entries and its frame) | about 16 |
| governance-ci.yml: R4, R5 | about 3 |
| **S3 subtotal (Draft B)** | **about 134, 4 files** |
| verify-quotes.mjs, and its test (the changed test, its comment, T8) | about 22 |
| **Draft A total** | **about 156, 6 files** |

### 7. The gate

- Draft A: full gating, architect and reviewer (§21a, AUTONOMY.md:315-332 @ dcd85569). The node's 60 minutes is likely short; my estimate is about 120.
- Draft B: the reviewer alone (§21b, AUTONOMY.md:334-345 @ dcd85569). The reviewer checks the Out-of-scope line first.
  - Against the pin-resolution precedent (scripts/plan/VERIFY-CITES-PIN-RESOLUTION-AND-LINE-ZERO-PREREGISTRATION.md:11-16 @ dcd85569): there, a fixture changed, and a header limit was replaced by wider behaviour. Here, no fixture changes, and the limit is narrowed.
  - I read the guarantee clause as touched only when something actually changes, as the hash-grammar settlement did (scripts/plan/HASH-GRAMMAR-SHARED-PREREGISTRATION.md:149 @ dcd85569).
- A margin of about 16 lines is thin. An overrun mid-piece follows §21b's mid-piece clause (AUTONOMY.md:345 @ dcd85569) as class 6.

### 8. Rule (00), path by path

This piece's paths are the six in Draft A's Scope (four in Draft B), plus the form on main.

| Branch | Overlap |
|---|---|
| `b2-piece-1c-save-and-reopen` | disjoint |
| `port-2-macos-l1-and-app-dirs` | scripts/plan/cfg-boundary.mjs and its test, and product-ci-rust.yml: disjoint files; its CI runs in a separate job and another workflow |
| `first-batch-factorial-ignored-trace-tests` | disjoint |
| #252, #249, #244 | disjoint |
| #241 | product-ci-viewer.yml, not governance-ci.yml: disjoint |

- Nothing touches protocol/.
- **A behavioural cross-effect that path checks do not show.** Once this merges, a branch whose tree holds an unlisted just-past-end rooted cite outside the archived prefixes goes red on its next governance-ci run. That would be the branch's own real defect, fixed on that branch.
- I cannot read the branch trees: OPEN-4.

## OPEN items

- **OPEN-1 (the human's): the form.** I recommend (A).
  - (A) Draft A on the full form, both gates: one piece, as the human folded it.
  - (B) Draft B on the five-line form, reviewer alone, with S4 unfolded to its own full-form node. That reverses the human's fold.
  - (C) Five lines for both, by a human ruling that a test asserting the defective figure is not a property under test. That would be a new clause, and the record cap limits such proposals. Not recommended.
- **OPEN-2 (the custodian's): list entries that are no longer needed.** I recommend (A).
  - (A) Not reported, and disclosed (R2). Records do not change, so an entry goes stale only when its target file grows.
  - (B) Advisory output. About 6 more lines, and it must be suppressed under `--files`.
- **OPEN-3 (the custodian's, Draft A only): S4's count helper.** I recommend (A), the human's same-root reading.
  - (A) Export countOf from verify-cites and import it at verify-quotes.mjs:137 @ dcd85569: one definition, with product callers on both sides.
  - (B) An inline formula matching verify-quotes.mjs:333 @ dcd85569: no change to the seam.
- **OPEN-4 (the custodian's): the in-flight branch trees.** I recommend (A).
  - (A) The worker runs the head checker, with the list, over each in-flight branch tip and reports its findings. Information only.
  - (B) The custodian does it before this piece merges.

## What I could not settle

- I have no shell, so this report has no sha256, no full commit id, and no run.
- The 13's identities and their count at the branch's base are the worker's enumeration, against the recorded figure taken at 5315a6a5.
- I did not read the branch trees.
- I did not check the shallow-clone test fixture: a local clone ignores `--depth` unless it is given a file:// URL. That is the worker's to confirm.
