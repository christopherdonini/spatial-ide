# PR #206 gate 1 — architect
Reviewed: cut/crs-undeclared-message-wording @ d88636ef7a0c4035e9c9e9fc6fc962ff1218d60c

**Verdict: block.** There is one Evidence finding, E-1, in the PR body. The fix is one sentence with no code change. The code, tests, records and owner's index pass. There are also two Documentation findings, which must be fixed in this PR before the merge.

I have no shell, so every hash and byte-level check below is by reading the file. The reviewer recomputes them by script (§8 item 2).

## Evidence

**E-1: a reachability claim the code does not support.**
- The PR body, line 21, reads: "**T-1's expected value:** the message as the engine now raises it when a file has no `geo` metadata CRS."
- The code at the head says otherwise:
  - The detail T-1 carries, "no `geo` metadata CRS on the primary geometry column", is raised only by `crate::crs::admit`'s `(None, None)` arm (`engine/src/crs.rs`, lines 286-288 at d88636ef).
  - That arm is reached by an explicit null, or by a `crs` value that is neither an object nor null (`engine/src/geoparquet.rs`, lines 444 and 450 at d88636ef), with no assertion.
  - If the `crs` key is absent under 1.0.0 or 1.1.0, the file is admitted, not refused (`geoparquet.rs`, lines 556-571 at d88636ef).
  - If the key is absent under any other version, the refusal carries a different detail, one that names the version (`engine/src/dataset.rs`, line 403 at d88636ef).
- So the sentence states the very condition the human's wording rules out. It sits where the human looks at the string.
- Under the proportional-gates paragraph's exception for unsupported claims, this is never documentation-only.
- **Fix:** name the raise site and its cases instead. Something like: the message as the `(None, None)` arm of `crate::crs::admit` raises it (a `crs` that is explicit null or unusable, no assertion; the form's 0.2, raise sites (a) and (b)).
- The form's §1 already limits T-1's claim to "as raised by the real (a) site" (`engine/CRS-UNDECLARED-MESSAGE-WORDING-PREREGISTRATION.md:83`, read at d88636ef).

## Correctness: no findings

**The wording against 0.2 at B.** These facts read the same at the head as the form pins them at 142af722, at the same line numbers:
- `geoparquet.rs` lines 37, 435-451, 509, 555, 556-571 and 572-582;
- `dataset.rs` lines 398-405 and 411-415;
- `crs.rs` lines 279-288.

The worker's `git diff --quiet 142af722 B` over these files exits 0 (report line 91). With those facts, the wording is true in all three raise cases:
- "only when" the key is absent under exactly "1.0.0" or "1.1.0" matches line 509's exact-string compare;
- the advice to assert matches dataset.rs lines 398 and 411-415, which skip the version detail and admit when an assertion is given.

N-a to N-d are notes for the human's sight, not defects.

**The bytes.**
- The Display arm, `engine/src/error.rs` lines 285-288 at d88636ef, folds by `\` to line 33 of the directive with `{detail}` left open.
- T-1's literal (lines 457-460), both e2e constants (`regression.mjs` and `admission-remediation.mjs`, lines 94-99 / 74-79), `v0-error-example.json` line 3, `formatRefusal.test.ts` lines 28-31 and row B2 (`MANUAL-WALKTHROUGH.md:176`, with the backtick-escape convention kept) each equal the template with their own detail filled.
- The first clause is unchanged everywhere.

**Out-of-scope places.**
- A grep of the head for the old second sentence finds it, outside `state/`, only in `KNOWN-LIMITATIONS.md:47` and `engine/ADMISSION-RESULTS.md:13,33`. Both are marked out in §2.1, as the human's line 34 requires.
- `admitDataset.test.ts` quotes only the first clause.

**ADR-015.** The message agrees with each part:
- §2, as narrowed by Amendment 1 item 3: an absent key is admitted and an explicit null is refused;
- item 4: an unpinned rule is not applied.

The ADR text is not touched.

**2.3's version reading holds.**
- SKP-V0 §4 item 13 ties a new version string to a field change (`protocol/skp/SKP-V0.md:281`, read at d88636ef).
- §5 defines `message` as the Display output, verbatim (`protocol/skp/SKP-V0.md:325`, read at d88636ef).
- No field, literal or shape changes.
- Both loaders read the one shared JSON file (`protocol/skp/tests/fixtures.rs:382`; `fixtures.test.ts:467`, which only checks that the message contains "OGC:CRS84"), so the both-sides fixture rule is met by construction.

**The seam (2.4).**
- Every interface on the path is unedited:
  - `error_of` takes `message = e.to_string()` (`kernel/src/skp.rs:2042`, read at d88636ef);
  - `RefusalBlock` renders `refusal.message` (`frontends/shell/src/admission/RefusalBlock.tsx:29`, read at d88636ef);
  - no guidance string exists for `engine.crs_undeclared`.
- The real-shape proof is the e2e pair: M-2 and M-3 failed by message check at C1 and passed at H (report lines 46-49).
- T-1 calls the product function `crs::admit`, which is `pub(crate)` and reached from `dataset.rs:415`. No new `pub` item.

**The OPEN-1 doc comment** (`engine/src/error.rs` lines 27-30 at d88636ef) meets Amendment 1 item 1:
- the false clause is replaced by the current fact;
- it cites the directive by path and "item 5", with no path:line;
- it says rewording is the human's decision;
- the §12d P6 clause is kept word for word.

**T-1 against §4** (lines 447-463 at d88636ef):
- it uses the proposed name and calls `crate::crs::admit(None, None, None)`;
- it asserts `to_string()` against the full message;
- its doc gives the directive path and item 5 with no path:line, and says rewording must break the test.

M-1 was observed at fb95bec0. The panic line, 453, agrees with the mutation removing two lines, which moves the `assert_eq` up from line 455.

**§8, item by item:**

1. Holds. Amendment 1 is in the form at B, and #202 and #204 are ancestors.
2. Holds, by my reading; the reviewer confirms by script.
3. Holds.
4. Holds.
5. Holds.
6. Holds. The human's wording is not paraphrased anywhere.
7. Holds.
8. Holds. Neither new comment carries a path:line.
9. Holds. The only cfg is `#[cfg(test)]`.
10. Holds. The template (PR body line 18) and T-1's value (line 24) are marked "byte-copied by script and not typed". They match line 33, indentation removed, by my reading.
11. Holds:
   - the §7 overrun is recorded as class 8 in Amendment 2;
   - §7 is unedited;
   - no verify-mutation run is called an observation;
   - no branch commit is pinned by hash.

**Amendment 2's row.** 4 + 3 = 7 against the sub-ceiling of 6. This is correctly class 8, and §7 is untouched. For its total figure, see D-1.

**The worker's differences** (report lines 96-101) are all disclosed. None is a deviation:
- B = 496fdd7f is within Amendment 1 item 3's definition.
- The aborted C1 launch was stopped before any step ran, so it is not a §9 re-run.
- The renamed exe's hash matches its build output.

**The owner's index** (`engine/README.md` lines 499, 510 and 519 at d88636ef) matches §9's bullet and lead-data's update byte for byte, by my reading:
- the T-1 pointer follows the in-crate form;
- the form is inserted in alphabetical order;
- Last verified at is fb95bec0, which d88636ef does not change for any pointer;
- `kernel/README.md` is rightly unchanged.

**PR body against the report.** Every evidence line matches: suite counts 203, 24, 153 and 139; e2e 17/17 and 11/11; M-1 exit 101; the fixture hash unchanged. The exceptions are E-1 and D-1.

## Documentation (must be fixed in this PR before the merge; no re-gate)

**D-1: the code-and-tests total is miscounted.**
- The PR body, line 69, reads: "**Code and tests:** 49 changed lines (38 insertions, 11 deletions) against 65."
- Amendment 2 item 2 (`engine/CRS-UNDECLARED-MESSAGE-WORDING-PREREGISTRATION.md`, on main) gives the same 49.
- §7 counts `MANUAL-WALKTHROUGH.md` (1 inserted, 1 deleted) under Documents, not under code and tests. Code and tests is 47 (37 insertions, 10 deletions) against 65, and Documents is 2 against 2.
- The ceilings hold either way, so this is a record miscount, not an unsupported limit claim.
- **Fix:** correct the PR body. Append a one-sentence correction row to the form, which is in §7's file list, under round 12 (d)'s ceiling.

**D-2: a test-text span on the unmerged branch is named without its commit id** (round 25, item 2).
- The PR body, line 21, says T-1's value "is read from `engine/src/error.rs` at the head".
- **Fix:** write the commit id, d88636ef or fb95bec0. This goes in the same edit as E-1.

## Observed, not this PR's
- PLAN.yaml:4456, which says item 2's quote follows in whichever piece lands second, still waits on the custodian's reconciliation against line 34 (form §2.6).
- #205 (KNOWN-LIMITATIONS only) and this PR are disjoint.

No ADR is needed. No decision is missing.

Files read:
- C:/dev/wt/crs/engine/src/error.rs
- C:/dev/wt/crs/engine/src/crs.rs
- C:/dev/wt/crs/engine/src/geoparquet.rs
- C:/dev/wt/crs/engine/src/dataset.rs
- C:/dev/wt/crs/engine/README.md
- C:/dev/wt/crs/frontends/shell/e2e/regression.mjs
- C:/dev/wt/crs/frontends/shell/e2e/admission-remediation.mjs
- C:/dev/wt/crs/frontends/shell/src/admission/formatRefusal.test.ts
- C:/dev/wt/crs/protocol/skp/tests/data/v0-error-example.json
- C:/dev/wt/crs/frontends/shell/MANUAL-WALKTHROUGH.md
- C:/dev/spatial-ide/engine/CRS-UNDECLARED-MESSAGE-WORDING-PREREGISTRATION.md
- C:/dev/spatial-ide/state/consults/2026-10-10-crs-undeclared-message-wording-worker-report-1.md
- C:/dev/spatial-ide/state/consults/2026-10-11-crs-undeclared-message-wording-owners-index-update.md
