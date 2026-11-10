*Custodian's filing note (2026-10-25): the architect's read-only draft of the five-line form for `verify-cites-out-of-range-line-count`, the governance lane's piece, read at main 5315a6a5; its second hand-back, under the custodian's settlement OPEN-1 (C), filed here. Its first hand-back (the bound fixed as well; sha256 f24ad4942bc40d02ad2ff9edf950b2db0c9ab66c9a2e67cd7863eb2ee6df9e8d) is superseded: before committing that form the custodian ran both checkers over main's tree at 5315a6a5, and the bound fix would have gated 5 cites (with 8 advisories) inside filed reports under state/consults/ that cannot be edited, so the piece was narrowed to the count each reason prints. The run 16:36:13Z to 16:45:23Z by its transcript, both hand-backs (Read 16, Grep 16, Glob 2; no write tool). Extracted by script from its second SubagentHandback call; nothing else is changed. Its sha256, from line 5 to the end, is 83ca7d7ce8508d92f635b34adfbce75bf7902ebf56e6dccc0095513d727f4a20.*

---

Drafted: verify-cites-out-of-range-line-count, five-line form under OPEN-1 (C), architect
Read at main @ 5315a6a5 (the coordinator's id; I have no shell, so I could not expand it to the full id). This redraft supersedes my first draft as a whole.

I have no shell, so this report carries no sha256 anywhere. Every cite is `path:line @ 5315a6a5`, read in the main checkout, for the custodian to pin by script. All the prose is my own words. The only byte-copied text is the reuse index, copied from the brief. The custodian's enumeration figures (2389 files, 81, 5, 8, 13) are its run as the coordinator reported it. I did not run it. I do not reproduce the 13 head-only findings as cites: written as cites here, they would become this report's own findings once the bound changes.

---

## The five lines (draft)

```
Authority: PLAN node `verify-cites-out-of-range-line-count` (PLAN.yaml:5977-5993 @ 5315a6a5), graded S3 and placed in the governance lane by the human's directive state/directives/2026-10-23-weekend-open-items-ruled-verify-cites-pin-covering-case-port-2-session-log-test-feature-v0-2-findings-graded.md, item 7; proposed by state/consults/2026-10-23-verify-cites-pin-resolution-and-line-zero-architect-draft.md, OPEN-4; unblocked by #256; settled under this form's drafting consult, OPEN-1 (C) and OPEN-2 (A), by the custodian's enumeration at 5315a6a5; the reuse index found no prior art on either search (line count trailing newline; out of range line reference), a miss noted here.
Scope: 2 files: scripts/plan/verify-cites.mjs, scripts/plan/verify-cites.test.mjs; declared line budget 100 (insertions plus deletions, tests and comments counted, AUTONOMY.md:357 @ 5315a6a5); this form exempt; no existing test is changed or removed.
Change: every out-of-range reason that prints a line count, in the tree's exact and suffix tiers and at a pin, prints the file's true count (a final newline ends the last line and starts no new one, and an empty file has 0 lines), one lower than today for a file that ends in a newline or is empty; the range check keeps today's bound, so no cite changes outcome or tier, and a cite to the line just past the end of such a file still passes; the header and the count's comment are rewritten to say so, in place of the bound sentence's untrue reading.
Tests+mutation: an_exact_out_of_range_reason_counts_the_lines_of_a_newline_ended_file (new; fails at the base); M1: the exact tier's figure is taken from the check's bound again, the reason prints one more, and the test fails by name (with the empty-file test). a_suffix_out_of_range_reason_counts_the_lines_of_a_newline_ended_file (new; fails at the base); M2: the suffix tier's figure is taken from the bound again, and the test fails by name (alone). a_pinned_out_of_range_reason_counts_the_lines_of_a_newline_ended_file (new; fails at the base); M3: checkPinned's figure is taken from the bound again, and the test fails by name (alone). an_out_of_range_reason_for_an_empty_file_counts_0_lines (new; fails at the base); M4: the helper's empty-file term is dropped, the reason prints 1, and the test fails by name (alone). Each mutation is observed by applying it, running the named test, recording its failure by name with the commit in a `RECORDED MUTATION` comment, and reverting it.
Out-of-scope: ADR: no status line or amendment; security: nothing ADR-020, ADR-009 or ADR-021 governs (no exposure surface, no dependency, Node's standard library only); wire: no SKP, data-plane or MCP surface, nothing under protocol/; guarantee: none touched, since no property under test changes and no cite changes outcome or tier: the check's bound is kept, every existing test in verify-cites.test.mjs and rotate-decisions-pending.test.mjs keeps its text and passes, and the header's bound sentences are corrected to state the bound the code already applies; the bound itself (node verify-cites-past-end-bound), a reversed range (node verify-cites-reversed-range) and verify-quotes' count in its cite listing (node verify-quotes-cite-listing-line-count) are not fixed here.
```

The reuse index, byte-copied from the brief (the read-only clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c):

```text
$ node tools/reuse.mjs line count trailing newline
No prior art recorded for "line count trailing newline". Research it before planning an implementation.
$ node tools/reuse.mjs out of range line reference
No prior art recorded for "out of range line reference". Research it before planning an implementation.
```

## Notes

### 1. The change

**Today.**
- `lineCount` (scripts/plan/verify-cites.mjs:232-242 @ 5315a6a5) caches `text.split('\n').length`, the piece count.
- That one figure is both the check's bound (line 257) and the count printed in the exact and suffix reasons (lines 261-262 and 267-268).
- `checkPinned` does the same at a pin (lines 292-296).
- For a file that ends in a newline, or an empty file, the piece count is one above the line count. So the bound passes a cite to the line just past the end, and the reason prints a figure one too high.

**Under (C) (my design).**
- `lineCount` caches two figures for each file:
  - `pieces`, today's split length;
  - `lines`, the same minus one when the text is empty or ends in a newline.
  The helper is unexported, because its only callers are product code (the caller rule).
- `inRange` (line 257) compares against `pieces`, unchanged in effect.
- Lines 261 and 267 take `Math.max` over `lines`.
- `checkPinned` keeps `maxL > pieces` as its test and prints `lines`.
- The line-0 reasons print no count and are untouched. `Math.max(cite.startL, cite.endL)` (lines 254 and 282) is untouched.
- **Every printed count is true.** A cite fails only when it is above `pieces`, which is never less than `lines`, so a reason never prints a count at or above the cited line.
- **What is left for `verify-cites-reversed-range`:** a range whose end is below its start is still checked by its larger end, in both places. Its count, where printed, is already true after this piece.
- **What is left for the new `verify-cites-past-end-bound`:** the bound itself (see the proposed nodes below).

**Replacement words.** These are not the human's wording (they are doc comments), so the worker applies them with no re-gate and the PR body lists them. Each clause is checked against the code at the head as designed above.
- **W1**, inserted immediately before `PINNED FALLBACK:` (scripts/plan/verify-cites.mjs:15 @ 5315a6a5): *Here and below, a line is within a file (and does not exceed it) when it is no higher than the number of pieces the file's text splits into at newlines. For a file that ends in a newline, and for an empty file, that is one more than its line count, so a cite to the line just past such a file's end passes, in the tree and at a pin (node verify-cites-past-end-bound). Every reason that prints a line count prints the file's true count: a final newline ends the last line and starts no new one, and an empty file has 0 lines.*
  - "no higher than the number of pieces": `maxL <= pieces` (line 257) and `maxL > pieces` failing at the pin. Holds.
  - "one more than its line count": a 3-line text ending in a newline splits into 4 pieces; an empty text splits into 1 piece and has 0 lines. Holds.
  - "passes, in the tree and at a pin": both comparisons use `pieces`. Holds.
  - "Every reason that prints a line count prints the file's true count": the three count-bearing reasons read `lines`, and the line-0 reasons print none. Holds.
  - This sentence makes the bound sentence (lines 11-12), the pin's "within it" (line 18) and the rooted tier's "exceeds that file's length" (lines 43-44) true as worded, so none of those needs its own edit.
- **W2**, added to the disclosure list (scripts/plan/verify-cites.mjs:59-67 @ 5315a6a5), after the same-basename clause: *a cite to the line just past the end of a file that ends in a newline, or to line 1 of an empty file (the bound above);*
  - Holds by W1's first two checks.
- **W3**, replacing the comment at scripts/plan/verify-cites.mjs:237-238 @ 5315a6a5: *The check's bound is the split's piece count, one above the line count for a file that ends in a newline or is empty: it can only fail to flag a cite just past the end, never flag a real one (node verify-cites-past-end-bound). The reasons print `lines`, the true count.*
  - "never flag a real one": a cite at or below `lines` is at or below `pieces`. Holds.
  - "the reasons print `lines`": the three sites. Holds.
- **Not edited:** the file-top RECORDED MUTATION comment in the test file (scripts/plan/verify-cites.test.mjs:6-10 @ 5315a6a5) stays true. Under its `<` mutation, the four new tests keep their outcome (each cite is above `pieces` either way), so "the other tests still pass" holds.

**Predicted run, at the PR head over main's tree.** The worker runs main's checker against the head's checker over main's tree and files the result in its hand-back. It predicts:
- the same scanned count;
- base and head gated both 0;
- the same finding keys and tiers;
- differences only in the reason's count, each one lower at the head.

At 5315a6a5, the custodian's run with the bound fix found 81 count-only differences, and its findings shared with the base are exactly the base's set (0 base-only, 0 STOP). So (C) predicts exactly those 81 differences at 5315a6a5 and no others. At a later base, the figure is whatever that tree gives, with the same classes. Any head-only or base-only key, tier change or other reason difference is an invalidator, and the run STOPs.

### 2. The size (my estimate, against §21c, AUTONOMY.md:347-357 @ 5315a6a5)

| Part | Estimated lines |
|---|---|
| verify-cites.mjs: the two-figure cache and W3, the bound and the two tree-reason sites, checkPinned's split into `pieces` and `lines`, W1 and W2 | about 32 |
| T1 to T4, each with its mutation comment | about 44 |
| **Total** | **about 76, across 2 files** |

It fits the declared 100, and §21c's 150 lines and 8 files.

### 3. Tests and mutations (all in scripts/plan/verify-cites.test.mjs)

No new test asserts the bound. Each cites a line above `pieces`, so it fails at the base and at the head, and only the printed count differs.

- **T1, `an_exact_out_of_range_reason_counts_the_lines_of_a_newline_ended_file`.**
  - Fixture: `tmpTree` holds a 3-line text ending in a newline at the rooted pool path. `checkCitation` is called at line 9 of it.
  - It asserts `oob-exact`, with a reason that ends `(3 lines)` and begins with line 9 exceeding the quoted path.
  - At the base, the reason ends `(4 lines)`.
  - M1: line 261's figure is taken from `pieces`. T1 fails, and T4 too (same tier).
- **T2, `a_suffix_out_of_range_reason_counts_the_lines_of_a_newline_ended_file`.**
  - The same fixture, cited by its bare basename at line 9.
  - It asserts `oob-suffix`, with a reason ending `(3 lines)`.
  - M2: line 267's figure is taken from `pieces`. T2 fails, alone.
- **T3, `a_pinned_out_of_range_reason_counts_the_lines_of_a_newline_ended_file`.**
  - `pinnedRun`: the rooted pool path cited at line 9, pinned at `rev` (5 lines at the pin, ending in a newline), key `gated`.
  - It asserts one entry, whose reason names the pinned commit and ends `(5 lines)`. At the base it ends `(6 lines)`.
  - The existing pinned past-end test asserts no figure, so T3 adds one without changing that test.
  - M3: checkPinned's figure is taken from `pieces`. T3 fails, alone.
- **T4, `an_out_of_range_reason_for_an_empty_file_counts_0_lines`.**
  - Fixture: `tmpTree` holds an empty file at a rooted path. `checkCitation` is called at line 2. Line 1 is not asserted, since that would be the bound.
  - It asserts `oob-exact`, with a reason ending `(0 lines)`. At the base it ends `(1 lines)`.
  - M4: the helper's empty-file term is dropped. T4 fails, alone.

**Regression, unchanged.** I traced every existing fixture by hand:
- Every reason assertion that names a count is open-ended. The test at scripts/plan/verify-cites.test.mjs:334 @ 5315a6a5 matches up to the opening bracket only.
- The ledger tests assert the word exceeds without a figure.
- The full suite stays green, unchanged.

### 4. The gate

The reviewer alone (§21b, AUTONOMY.md:334-345 @ 5315a6a5), by the custodian's OPEN-2 (A). Reason:
- no cite changes outcome or tier;
- no property under test changes;
- about 76 lines.

The evidence that closes the risk is note 1's predicted run, filed by the worker, together with T1 to T4 and the unchanged suite.

### 5. Out-of-scope readings

- **ADR, security, wire:** none, as the line says. There is no product file.
- **Guarantee:** §21a's fourth bullet (AUTONOMY.md:325-327 @ 5315a6a5) is read "touched as changed", as in the hash-grammar settlement.
  - The bound and every test outcome are unchanged.
  - W1 to W3 correct the header's statement of the bound to what the code has always applied. That narrows an untrue claim and changes no property. Leaving the claim untrue would be a Correctness finding under the proportional-gates rule.
  - The reviewer checks this line first.
  - The difference from the pin-resolution precedent (scripts/plan/VERIFY-CITES-PIN-RESOLUTION-AND-LINE-ZERO-PREREGISTRATION.md:11-16 @ 5315a6a5): there, a test fixture changed and a header limit was replaced by wider behaviour. Here, neither happens.
- **Round 25, item 2 (e)** (docs/PREREGISTRATION-TEMPLATE.md:176 @ 5315a6a5): the line asserts that none of the four is touched, so the five-line form is open.
- **What governance CI runs over these files.** `.github/workflows/governance-ci.yml` lines 85 and 102 at 5315a6a5 match `scripts/plan/**`, so it runs:
  - `node --test` over plan, hooks and evidence (lines 145-146);
  - verify:cites (150-151), verify:quotes (153-154), verify:test-claims (156-157) and verify:plan (159-162);
  - the buildHealth smoke (164-167);
  - the queue and site drift checks (169-173);
  - the separate cfg-boundary job (175-189).
- **The form itself:**
  - verify-cites scans it whole, so fixture cites must stay in words;
  - verify-quotes scans it, so it must carry no quote-trigger words and no line cite into DECISIONS-PENDING.md;
  - verify-test-claims reads T1 to T4 as planned once the node's `gate:` names the form in the same commit.
- **Node ids:** W1 to W3 and the Out-of-scope line name verify-cites-past-end-bound and verify-quotes-cite-listing-line-count, so the custodian adds both proposed nodes before the code.

### 6. Rule (00), path by path (unchanged)

This piece's paths: scripts/plan/verify-cites.mjs and scripts/plan/verify-cites.test.mjs, plus the form on main.

| Branch | Overlap |
|---|---|
| `cut/bundle-redaction-scan` | nothing under scripts/; disjoint |
| `cut/walkthrough-row-f7-cli-refusal` | disjoint |
| `cut/known-limitations-items-51-52-render-numbers` | disjoint |
| `cut/covering-case-collision-binds-other-column` | disjoint |
| `cut/port-2-macos-l1-and-app-dirs` | scripts/plan/cfg-boundary.mjs and its test only; disjoint files, and a separate CI job |
| `cut/b2-piece-1c-save-and-reopen` | disjoint |

- Nothing touches protocol/.
- Path lists are the brief's; I cannot read branches.
- Under (C) no cite changes outcome, so no branch's CI changes from this piece.

## Proposed nodes (for the human's grading and placement)

**Id: `verify-cites-past-end-bound`** (governance lane; depends_on: verify-cites-out-of-range-line-count). Summary:

PROPOSED 2026-10-25 from verify-cites-out-of-range-line-count's drafting consult, OPEN-1: verify-cites checks a cited line against the pieces of a split on newlines, so a cite to the line just past the end of a file that ends in a newline, or to line 1 of an empty file, passes in the tree and at a pin. The custodian's enumeration at main 5315a6a5, with the bound corrected, found 13 cites that would change, 5 of them gated and 8 advisory, all in filed reports under state/consults/ and state/consults/gates/, which are byte-identical records and cannot be edited; so the fix needs a design for such cites inside immutable records before the bound changes. verify-cites-out-of-range-line-count corrected the count each reason prints and disclosed the bound in the header; it did not change the bound. For the human's grading and placement.

**Id: `verify-quotes-cite-listing-line-count`** (governance lane; depends_on: none). Summary:

PROPOSED 2026-10-25 from verify-cites-out-of-range-line-count's drafting consult: the cite listing in verify-quotes (listCiteContents) splits a file on newlines and counts the pieces, so for a file that ends in a newline its out-of-range note states a line count one too high, and the line just past the end is listed as a blank line instead of out of range. The hash check in verify-quotes reads lines by a different slice and is not affected. Outside verify-cites-out-of-range-line-count, which changes verify-cites only. For the human's grading and placement.

(Both summaries carry no double quotes, no backslashes, and no duration, rate or percentage figure. The function is at scripts/plan/verify-quotes.mjs:1049 @ 5315a6a5, and the split at line 1078.)

## OPEN items

None new. One observation, not opened: the reasons print `(1 lines)` for a one-line file, today and after this piece. That is a grammar defect, outside this node's title, and I leave it to the custodian whether to record it.

## What I could not settle

- No shell, so:
  - no sha256;
  - no full commit id;
  - the enumeration figures are the custodian's, as the coordinator reported them;
  - no `git ls-files` check that the Authority directive is tracked.
- Branch trees are unread.
- Where the redraft is filed: the brief's REPORT PATH was `state/consults/2026-10-25-verify-cites-out-of-range-line-count-five-line-form-architect-draft.md`. The proposed nodes' summaries name the drafting consult without its path, so they stay true wherever the custodian files it.
