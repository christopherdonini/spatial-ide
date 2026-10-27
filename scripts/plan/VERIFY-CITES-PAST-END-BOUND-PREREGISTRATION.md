# scripts/plan/verify-cites.mjs: a cite to the line just past a file's end fails, except the listed legacy cites — five-line short form (`AUTONOMY.md` §21d)

*Committed before any code. Append-only once committed; an amendment written after any run of this piece's mutations has been seen says so in its first line. PLAN node verify-cites-past-end-bound, the governance lane's piece (S3). The five lines are composed by script from the architect's draft (`state/consults/2026-10-26-verify-cites-past-end-bound-five-line-form-architect-draft.md`, read only at main dcd85569; its sha256 from line 5 is 69cce9561ce7c6d3e72327144cb4b148ae644b4263114fb0bf88a8d55fd728d3) as its Draft B section directs: the Scope and Out-of-scope lines are Draft B's as written; the Authority line is Draft A's without the fold clause and the second PLAN node (its "both by" read as "by"), with the human's ruling named; the Change line is Draft A's up to and including "which are not edited", then a full stop; the Tests+mutation line is Draft A's first seven tests, M1 to M7, then its observation sentence. The notes are the draft's notes 1 to 8, byte for byte except for the pins; note 4 and the Draft A rows of notes 6 and 7 belong to `verify-quotes-cite-listing-line-count`, its own node, and are not built here. Each cite read at dcd85569 is expanded by script to `path:line @ <commit> sha256:<the lines with their LFs>` (a dot path as `path:line` at <commit>, sha256 <hex>): the cites the draft marks, every cite on a line before that line's last marker, and every cite written with a file name, since the draft reads every cite at dcd85569; a bare file name is written with its one tracked path (23 pins; 14 by a bare name). Line numbers written with no file name and no marker name lines of the file the sentence names, at dcd85569; they are not pinned. Every pin is historical. Form path: `scripts/plan/VERIFY-CITES-PAST-END-BOUND-PREREGISTRATION.md`. The custodian keeps the PLAN node on main; the branch carries no PLAN file and no generated file. Gating: the reviewer alone (§21b; the draft's note 7).*

```
Authority: PLAN node `verify-cites-past-end-bound` (PLAN.yaml:6045-6061 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:31c8eaf2e7f81cac42a57e41a423db2387c270e600bf49dd18be922c29fbd3f0), by the human's directive state/directives/2026-10-26-resent-2026-10-25-o1-s1-clang-cl-route-a-hugeint-cast-b-five-nodes-placed.md, item 2, whose design this piece builds; on the five-line form, Draft B, S3 alone, by the human's ruling of 2026-10-26, OPEN-1 (B) (state/directives/2026-10-26-clicks-260-261-244-r2-241-o1-answers-pb-draft-b-6d-260-lines-5b-8a-8b-rulings.md, line 24), the second line split back out to its own node, `verify-quotes-cite-listing-line-count`; the cites the list holds are the enumeration of the settlement in scripts/plan/VERIFY-CITES-OUT-OF-RANGE-LINE-COUNT-PREREGISTRATION.md (OPEN-1), re-run by the worker at the branch's base; the reuse index found no prior art on either search (cite line bound; legacy allow list), a miss noted here.
Scope: 4 files: scripts/plan/verify-cites.mjs, scripts/plan/verify-cites.test.mjs, scripts/plan/verify-cites-legacy-bound.json (new), .github/workflows/governance-ci.yml (header comments only); declared line budget 150 (insertions plus deletions, tests, comments and the list counted, AUTONOMY.md:357 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:367596df34a73d122765d000ba5df601dbe54da9e5a6aefca966747809a44fec); this form exempt; no existing test is changed or removed.
Change: verify-cites bounds a cited line by the file's true line count, in the tree and at a pin, so a cite to the line just past the end of a file that ends in a newline, or to line 1 of an empty file, fails as any other out-of-range cite does, except a cite that scripts/plan/verify-cites-legacy-bound.json lists by its citing file and its token as written, which is checked under the old bound (the split's piece count) in the tree and at its pin; the scan fails by name when that list, at a commit on HEAD's first-parent history that changes it, holds an entry its first parent's list does not (the oldest such commit excepted, an absent list holding none), and fails in a shallow clone; the list holds exactly the cites the corrected bound newly fails at the branch's base, all inside filed records, which are not edited.
Tests+mutation: a_cite_to_the_line_just_past_the_end_of_a_newline_ended_file_fails (new; fails at the base); M1: checkCitation's bound read from `pieces` again, and the test fails by name (alone). a_cite_to_line_1_of_an_empty_file_fails (new; fails at the base); M2: the empty-file term in countOf dropped, and the test fails by name (with an_out_of_range_reason_for_an_empty_file_counts_0_lines). a_pinned_cite_to_the_line_just_past_the_end_at_its_commit_fails (new; fails at the base); M3: checkPinned's bound read from `pieces` again, and the test fails by name (alone). a_cite_on_the_legacy_bound_list_passes_under_the_old_bound_only_from_its_listed_file (new); M4: the list lookup keyed by the cite alone, without its citing file, and the test fails by name (alone). a_pinned_cite_on_the_legacy_bound_list_passes_under_the_old_bound_at_its_pin (new); M5: checkPinned's old-bound term removed, and the test fails by name (alone). the_legacy_bound_list_may_shrink_but_a_gained_entry_fails_by_name_even_at_the_same_count (new); M6: the subset check replaced by a count comparison, and the test fails by name (alone). the_legacy_bound_list_check_fails_by_name_in_a_shallow_clone (new); M7: the shallow-clone check removed, and the test fails by name (alone). Each mutation is observed by applying it, running the named test, recording its failure by name with the commit in a `RECORDED MUTATION` comment, and reverting it.
Out-of-scope: ADR: no status line or amendment; security: nothing ADR-020, ADR-009 or ADR-021 governs (Node's standard library and git only, no dependency; the workflow's steps, triggers and permissions unchanged); wire: no SKP, data-plane or MCP surface, nothing under protocol/; guarantee: none touched, since no existing test's assertion changes, the inclusive upper bound under test is kept, and the header's disclosed limit is narrowed to the listed cites, with no property under test changed; verify-quotes' count in its cite listing (node verify-quotes-cite-listing-line-count) is not fixed here.
```

**The reuse index**, byte for byte as the custodian ran it for the draft's brief (the read-only clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c):

```text
$ node tools/reuse.mjs cite line bound
No prior art recorded for "cite line bound". Research it before planning an implementation.
$ node tools/reuse.mjs legacy allow list
No prior art recorded for "legacy allow list". Research it before planning an implementation.
```

*The notes below are the architect's from its draft, carried byte for byte except for the pins; where they say mine or my, they mean the architect's. They are this form's reading.*

## Notes

### 1. The list and how verify-cites reads it

- **Shape.**
  - The file holds one object, `{ "$doc": <string>, "entries": [ { "path": <citing file>, "cite": <token as written> } ] }`. This is the same top-level shape as the verify-quotes baseline.
  - `$doc` names the node and the human's directive by path and item.
  - Entries are sorted by path, then by cite.
  - The file is JSON, so verify-cites' default scan (md files and code comments; scripts/plan/verify-cites.mjs:322-331 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:ceb841b8480ed0e0d626480555a7fe4d4ed8d18c4163cac6a8a540192819984a) never reads it as a citing file, and verify-quotes' claim set does not include it.
- **The key** is the human's: the citing file and the cite token as written (`cite.raw` without its pin). An entry therefore covers every occurrence of that token in that file. That is harmless, because records do not change.
- **Reading it.**
  - runVerifyCites reads the file from the scanned root (an absent file is an empty list).
  - For each cite it sets `cite.oldBound`, the same way it already sets `cite.relPath` (scripts/plan/verify-cites.mjs:357 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:8824d93969532e176aa2972163d8fa13a73291852b3b079457f55c4cd5b97249). This needs no signature change, and the product caller sets the property on every cite.
  - The tree check: `inRange` (scripts/plan/verify-cites.mjs:264 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:68978c1415fab74efe92bb8748d9a47fdb0b404d076f0859aa81d3a2c840ab4c) becomes `maxL <= n.lines || (cite.oldBound === true && maxL <= n.pieces)`.
  - The pin check: the test at checkPinned (line 302) becomes `maxL > lc.lines && !(cite.oldBound === true && maxL <= lc.pieces)`.
  - Reasons keep printing `.lines` (lines 269, 275 and 303).
  - The old bound is a separate disjunct, so the file-top RECORDED MUTATION (scripts/plan/verify-cites.test.mjs:6-10 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:2db51c96cb89b0602efd2d7f99ae6468a47d5f5dcfe0d4bd9112008b4be6e2a8, `<=` to `<` on the first comparison) still fails only `an_exact_reference_to_the_last_line_of_a_file_is_in_range`. The worker applies that mutation once at the head and reports the result in its hand-back. If any other test fails under it, STOP.
- **Malformed list.** There is no validation code. A list that cannot be parsed, or whose `entries` cannot be iterated, throws, and the existing catch at scripts/plan/verify-cites.mjs:433-440 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:94156fde6c494c366dadaacbe66ba6fb86a7e0435b82549ba4557031ae361d85 exits 1. An entry whose fields are not strings simply never matches. This is disclosed, and no claim is made about it.

### 2. The gained-entry check, and where it lives

- **The design (my recommendation, H1).** The check lives in verify-cites, so governance-ci's existing verify:cites step (`.github/workflows/governance-ci.yml:150-151` at dcd85569054a04f6d0135f686b8f55d4a9eba5d4, sha256 76484b6d6917d949226e9e45f9f5f2983b85bb2842747c8af660399317ab090c) fails, and a local run fails the same way.
  1. If `git rev-parse --is-shallow-repository` prints true, the run fails by name.
  2. Otherwise it walks `git log --first-parent --reverse --format=%H -- scripts/plan/verify-cites-legacy-bound.json`.
  3. Each commit after the oldest must hold only entries that its first parent's list holds. An absent list holds none, so a deletion is a shrink and a later re-add is a gain.
  4. Each failure names the commit and the entry.
  5. Failures go into a new `listErrors` array that runVerifyCites returns. main() prints them under their own FAIL line and sets exit 1. They are not pushed into `gated`, whose FAIL line says unresolved reference, which a gained entry is not. rotate-decisions-pending.test reads only `gated` and `advisory`, so it is unaffected.
- **Why first-parent history works in every CI event.**
  - On a PR, GitHub's merge ref has the base as its first parent.
  - On main, a PR's merge commit has the previous main as its first parent.
  - On a direct push of several commits, each commit is visited.
  - The plan job already uses fetch-depth: 0 (`.github/workflows/governance-ci.yml:137-139` at dcd85569054a04f6d0135f686b8f55d4a9eba5d4, sha256 ba1c06d58816a3e8aaa67253ea5afcd40e857fc722d8460fc93ea994d4db9450).
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
4. **Expected from the records:** 13 head-only findings, 5 gated and 8 advisory, all in filed reports under state/consults/ and state/consults/gates/ (PLAN.yaml:6060 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:6e3b67b5801947a8a326f739737d8fd2f2d6ce31c0dab5a5f108d57b0bab872d; the settlement at scripts/plan/VERIFY-CITES-OUT-OF-RANGE-LINE-COUNT-PREREGISTRATION.md:156 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:3698772be9befd071d2f4542b9959c58d4dfb717c079884fd64309c36e783c0b). That count was taken at 5315a6a5, so records filed since then may add to it. There should be 0 base-only findings, every shared finding should have an identical reason, and each head-only reason should name exactly the line one above the file's true count.
5. Each head-only finding becomes one entry. The list is committed in one commit.
6. Re-run with the list. The head's gated and advisory sets must equal B's byte for byte (key and reason), with listErrors at 0.
7. **STOP and report before the list commit if:**
   - the count is not 13;
   - any head-only finding is outside a filed record (that cite is fixed in place, outside this Scope, so the custodian settles it);
   - there is any base-only finding, any changed shared reason, or any head-only finding that is not a just-past-end line.
8. **Neither the hand-back nor the PR body writes the 13 as path:line tokens.** Filed under state/consults/, they would be gated past-end cites in a new record. Refer to the list file at its commit instead.

### 4. The second line (S4), for Draft A or its own node

- **The change.** At scripts/plan/verify-quotes.mjs:1078-1081 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:d72fadc01cce39dd8e3122b731975a5cdf874eb7605978cffc9d2c95b1786b25, read the text once, bound `c.startL` by its true count, and print that count. A line just past the end is then listed out of range instead of as `(blank line)`.
- **The docstring** (lines 1041-1048) becomes true as worded and is not edited.
- **The hash check's own count** (line 333) is already correct and is not touched.
- **The count helper:** OPEN-3.
- **The changed test:** its expected text becomes `out of range (file has 3 lines)`. Its RECORDED MUTATION comment's figure is rewritten, and its mutation is re-observed at the head with the commit.
- **CI effect:** none. governance-ci runs verify-quotes without `--show-cites`.

### 5. Replacement words (mine; none is the human's wording, none is red-line; applied by the worker with no re-gate, and the PR body lists them). Each clause is checked against the code at dcd85569 or the design above.

- **R1**, replacing scripts/plan/verify-cites.mjs:15-20 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:70c6389e51dae18afba2f580f374bf5dbe3e8abc7738fac48884028e35c98c29 from `Here and below` to the end of line 20: *Here and below, a file's line count is its true count (a final newline ends the last line and starts no new one, and an empty file has 0 lines); a line is within a file (and does not exceed it) when it is no higher than that count, in the tree and at a pin, and every reason that prints a line count prints it. LEGACY BOUND (node verify-cites-past-end-bound): a cite that scripts/plan/verify-cites-legacy-bound.json lists by its citing file and its token as written is also within a file when its line is no higher than the number of pieces the file's text splits into at newlines, one more than the line count for a file that ends in a newline or is empty, in the tree and at its pin. The list holds cites inside filed records, which are not edited. The scan fails when the list, at a commit on HEAD's first-parent history that changes it, holds an entry its first parent's list does not (an absent list holds none), the oldest such commit excepted, and it fails in a shallow clone, where that history cannot be read.*
  - The true count: countOf at scripts/plan/verify-cites.mjs:240-243 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:1fef8d3b5e6f30c02bd074d04a687f0348025d7b769bdb79ef8edb9b9444a2a3. Holds.
  - The true bound in both places: the design in note 1. Holds.
  - The reasons print `.lines` at lines 269, 275 and 303. Holds.
  - The old bound for listed cites: the disjunct in note 1. Holds.
  - The key: relPath plus `cite.raw`. Holds.
  - Records only: the STOP rule in note 3. Holds.
  - The failure conditions: note 2, steps 1 to 3. Holds.
  - R1 carries no path:line token.
- **R2**, replacing the clause at scripts/plan/verify-cites.mjs:67-68 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:06a8b5e44185a9b3b8cec0c7550e22150e48e4d3f58f366f51d487c7eb441d77: *a listed cite (the legacy bound above) to the line just past the end of a file that ends in a newline, or to line 1 of an empty file; a list entry no longer needed is not reported; a change to the list is checked against its history only once committed; and that history is read along first parents, so a commit reached only through a merge's second parent is checked as part of the merge, not alone;*
  - "No longer needed is not reported": OPEN-2 (A).
  - "Only once committed": the walk is over commits.
  - "First parents": the `--first-parent` flag. Holds.
- **R3**, replacing scripts/plan/verify-cites.mjs:239 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:93496622759433ade34beb4eef3316f4c23ceebf174b1f55fe273583dd3e106c: *`lines`, the true count, is the check's bound and the count every reason prints; `pieces`, the split's piece count, is the bound only for a cite on the legacy-bound list (see the header).*
  - Holds by note 1.
- **R4**, in `.github/workflows/governance-ci.yml:22-23` at dcd85569054a04f6d0135f686b8f55d4a9eba5d4, sha256 b1a3aaf88035bcd8a278dc649e4fc32ab799fff32a7eb33741a9f58e79c3d802, replacing `every rooted (in-tree) path:line reference resolves against the tree (verify:cites)` with: *every rooted (in-tree) path:line reference resolves against the tree (one listed in scripts/plan/verify-cites-legacy-bound.json under its old bound), and that list has gained no entry along its first-parent history (verify:cites)*
  - Holds by note 2.
- **R5**, appended after `.github/workflows/governance-ci.yml:136` at dcd85569054a04f6d0135f686b8f55d4a9eba5d4, sha256 ce8b8f89bcfd476a3b3381cba2d873512b8c6a0beb8f73ad2b91801386d8c31f as one comment line: *verify-cites reads the legacy-bound list's first-parent history too, and fails by name in a shallow clone.*
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

- Draft A: full gating, architect and reviewer (§21a, AUTONOMY.md:315-332 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:211fe30919ba9ee55447ac9f66874374382d972ab58269c8f074a79fd4693cb3). The node's 60 minutes is likely short; my estimate is about 120.
- Draft B: the reviewer alone (§21b, AUTONOMY.md:334-345 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:09cdfc393a829fab7d4ceeaac847a7927225bb3580d694d5821abeb6d6730655). The reviewer checks the Out-of-scope line first.
  - Against the pin-resolution precedent (scripts/plan/VERIFY-CITES-PIN-RESOLUTION-AND-LINE-ZERO-PREREGISTRATION.md:11-16 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:0d9d96b5b06afa25151d8beb7baeefacbff4ac9593e4d89e8c601881410d0905): there, a fixture changed, and a header limit was replaced by wider behaviour. Here, no fixture changes, and the limit is narrowed.
  - I read the guarantee clause as touched only when something actually changes, as the hash-grammar settlement did (scripts/plan/HASH-GRAMMAR-SHARED-PREREGISTRATION.md:149 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:b0ae9a1aae52aecf9160271fe682634ca6749c7c70a60d6bb3192f12eb46858c).
- A margin of about 16 lines is thin. An overrun mid-piece follows §21b's mid-piece clause (AUTONOMY.md:345 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:ac3b30f25e10d5a8efd8202a960e95a02e00672d5d5b9faf9226c8216b2456c3) as class 6.

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

## The custodian's settlement (class 1, before any code)

- **OPEN-1: (B), the human's** (`state/directives/2026-10-26-clicks-260-261-244-r2-241-o1-answers-pb-draft-b-6d-260-lines-5b-8a-8b-rulings.md`, line 24): Draft B on the five-line form, S3 alone; `verify-quotes-cite-listing-line-count` goes back to its own node, S4, last in the governance lane, no form until its turn. The fold is reversed.
- **OPEN-2: (A).** A list entry no longer needed is not reported, and R2 discloses it.
- **OPEN-3** applies to Draft A only and is not reached.
- **OPEN-4: (A).** The worker runs the head checker, with the list, over each in-flight branch tip and reports what it finds, for information only.
- **The words R1 to R5** (note 5) are applied as written, and the PR body lists them.
- **Rule (00)** was checked again at main e54457e3 by `git diff --name-only origin/main...<branch>` for every open branch and the branches in flight: none touches the four files of the Scope line. Nothing touches `protocol/`.

## Amendments (opens empty; append-only)

### Amendment 1 (2026-10-27), class 2: a deviation recorded after results. Written after the piece's mutation results were seen.

- **The prediction** (the Tests+mutation line): M1, checkCitation's bound read from `pieces` again, fails `a_cite_to_the_line_just_past_the_end_of_a_newline_ended_file_fails` by name, alone.
- **The result**, observed at 7df4983f7dae524a85a468fabe98f75222e3aa1d (`state/consults/2026-10-27-verify-cites-past-end-bound-worker-stop-report.md`): M1 fails that test and two more, `a_cite_to_line_1_of_an_empty_file_fails` and `a_cite_on_the_legacy_bound_list_passes_under_the_old_bound_only_from_its_listed_file`.
- **The reason:** both other tests assert a cite that the true count fails and the split's piece count passes (line 1 of an empty file, whose split has one piece; a just-past-end cite from a file the list does not name), so a bound read from `pieces` fails them too. "Alone" could not hold for M1 as worded.
- The mutation is detected by its named test. The prediction is not edited; the RECORDED MUTATION comment states the outcome observed. Nothing else changes.
