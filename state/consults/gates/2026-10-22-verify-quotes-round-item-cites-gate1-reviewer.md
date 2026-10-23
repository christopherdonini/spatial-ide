Reviewed: PR #242 at b08a1fec4e3405153b4998882427355fa18db319, gate 1, reviewer
Branch and commit: cut/verify-quotes-round-item-cites @ b08a1fec4e3405153b4998882427355fa18db319
Verdict: FAIL

One Evidence finding blocks (E-1). The code reads as correct. Every check in §5, §7 and §9 holds, and the five mutations I re-made all fail their tests. The documentation findings (D-1 to D-4) are must-fix before the merge and need no re-gate.

## Correctness

None blocking. The diff, read file by file, does what §2.1 to §2.6 say. Edge probes I ran at the head on scratch fixtures:
- `item 99(b)` is checked as item 99.
- `>round…` and `  > round…` lines are skipped.
- An unpaired straight `"` hides a cite up to the next `"`.
- `rounds 12 and 13, items 1 and 2` is not read.
- `items 1 and 2, 15 tests` is read as item 15. This fails loudly.
- `question round 72, item 1` is refused by name.

Each case is either the ruled grammar or a gap covered by D-1 or D-2 below.

Note for the architect, no replacement words: for round 72 the reason text `no RULED block for question round 72 in any file of the ruling set` is not literally true, because a block exists whose header is outside the grammar. This is §2.5's text. The human's I4 (A) accepted the refusal knowingly, and the header and README disclose it. Changing the message would change code output (Q3 asserts it), so it is outside the wording rule.

## Evidence

**E-1 (blocking): withdrawnRiders' round-file reader has no test.** This is the path S1's optional parameter exists to carry.

The binding is at `scripts/plan/verify-test-claims.mjs:551` and `:557` (at b08a1fec), `(r) => trackedRoundFileText(root, r)`. I removed it from both calls at the head, ran `node --test scripts/plan/verify-test-claims.test.mjs scripts/plan/rotate-decisions-pending.test.mjs` (rc=0: tests 81, pass 81, fail 0), then reverted with an empty porcelain. A grep shows these two files are the only test files that touch verify-test-claims.

C1 proves only the bold-item route. Nothing proves that verify-test-claims resolves an itemless block through the tracked `state/questions/round-N.md`. That is the drift between the two tools that OPEN-2 (B) was ruled to prevent. It fails the reviewer checklist's seam rule: one end-to-end test from the real shape.

Remedy (a correction, not words):
- Add one test in `scripts/plan/verify-test-claims.test.mjs`: a withdrawn-test row whose ruling cites an itemless round resolves through the tracked round file. The fixture copies the real rounds 66 and 67 block and `state/questions/round-66.md` at 40b04b46, found by round. The same test, or a twin, fails by name when the round file lacks the item.
- Observe its mutation (the reader dropped from withdrawnRiders) with the commit id.
- U6's "exactly 15" becomes 16. That needs an amendment, which is the architect's call.

## Documentation (must-fix before the merge, no re-gate)

None of these sentences is the human's wording. They are a worker's header comment, README and CI comment. The worker applies the words below and the PR body lists them.

**D-1. Header comment, `scripts/plan/verify-quotes.mjs:113-115` @ b08a1fec.**
Current: "Not read: inside an inline backtick span, inside a straight or curly double-quoted span on the same line, or on a `> ` line; fenced blocks are read."
Replace with: "Not read: inside an inline backtick span; inside a straight or curly double-quoted span on the same line (each straight `"` pairs with the next one on its line, so an unpaired `"`, such as an inch mark, hides any cite up to the next `"`); or on a line whose first non-blank character is `>`; fenced blocks are read."
Clause check:
- Backtick spans: `CITE_SKIP_SPAN_RES[0]` (:832).
- Straight-quote pairing: `/"[^"\n]*"/g` (:832) pairs from the leftmost `"`. The oddQuote probe checked 0 cites.
- Curly quotes: the third pattern at :832.
- `>` lines: `CITE_BLOCKQUOTE_LINE_RE = /^\s*>/` (:830). The `>round` and indented probes each checked 0 cites.
- Fenced blocks: `extractRoundItemCites` has no fence handling.
- On the real scan set (188 files): 4 cites sit on indented `>` lines and are skipped (`engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md` lines 408, 418, 422, 747). No masked cite sits on an odd-quote line today.

**D-2. Header comment, `scripts/plan/verify-quotes.mjs:117-119` @ b08a1fec.**
Current: "DISCLOSED GAPS: a sub-clause cite (`item 2(b)`), an entry cite, a clause cite, a directive item (`…, item 2e`), a bare round, and a cite in a file outside the scan set are not checked; and the check proves EXISTENCE of the item in its block, not that the cite means what its sentence says."
Replace with: "DISCLOSED GAPS: a sub-clause letter (the `(b)` of `item 2(b)`, whose item 2 is checked), an entry cite, a clause cite, a directive item (`…, item 2e`), a bare round, a `rounds N and M, items …` list, and a cite in a file outside the scan set are not checked; and the check proves EXISTENCE of the item -- in its block, or, for a block with no item lines, in the tracked round file -- not that the cite means what its sentence says."
Clause check:
- Sub-clause: `CITE_HEAD_RE` (:834) ends at `(?![0-9A-Za-z])`, and `(` passes. The `item 99(b)` probe gave a finding on item 99.
- `item 2e`: excluded; Q11 asserts 7 checked.
- Plural rounds: `\bround\s+` cannot match `rounds 12`. That probe checked 0 cites.
- Outside the scan set: the scan reads `scanAbs` only.
- Existence: `resolveRoundItem` decides by the block's items, or by `questionFileHasItem` (`scripts/plan/rulingSet.mjs:84-102` @ b08a1fec).

**D-3. README, `scripts/plan/README.md:381` @ b08a1fec.**
Current: "A cite inside a backtick span, a double-quoted span or a `> ` line is not read. Not checked: sub-clauses, entries, clause cites, directive items, files outside the scan set; it proves the item exists, not what the cite means."
Replace with: "A cite inside a backtick span or a double-quoted span (a straight `"` pairs with the next one on its line), or on a line whose first non-blank character is `>`, is not read. Not checked: sub-clause letters, entries, clause cites, directive items, `rounds N and M, items …` lists, files outside the scan set; it proves the item exists, not what the cite means."
Clause check: as for D-1 and D-2.

**D-3 continued. CI comment, `.github/workflows/governance-ci.yml:34-35` @ b08a1fec.**
Current: "Every `round N, item M` cite outside backtick, double-quoted and `> ` text resolves against the ruling set (DECISIONS-PENDING.md and its archive), one file at a time: the item exists, not what the cite means."
Replace with: "Every `round N, item M` cite outside backtick spans, double-quoted spans and lines whose first non-blank character is `>` resolves against the ruling set (DECISIONS-PENDING.md and its archive), one file at a time: the item exists, not what the cite means (verify-quotes.mjs's header lists the forms not read)."
Clause check:
- Spans and lines: as for D-1.
- Ruling set: `rulingFiles` (`verify-quotes.mjs` near :423).
- One file at a time: `resolveRoundItem` loops `texts` and joins nothing. My MQ9 re-observation confirms the test guards this.

**D-4. The closing amendment is not on main.** §9 S4 is not on main at gate time, and Amendment 3 item 2 skips from S3 to the PR. Before the merge it must carry, as references only:
- The §7 range used: 49a7f532...H, 375 lines and 7 files. The form's literal B...H counts main's merged drift, 3,652 lines over 38 files per the S3 report. Naming the range keeps this from reading as an unrecorded class-8 overrun.
- S1's `readRoundFile` deviation from §2.6.

## S1's disclosed optional parameter (item 8): my word

Accept the signature, with E-1 as its condition.
- `resolveCitation` and `resolveInText` are module-private: grep finds no export and no test import.
- The only caller is `withdrawnRiders`, which passes the reader at both calls (:551, :557).
- §2.6 cannot hold literally on both counts ("signature unchanged" and "withdrawnRiders binds the round-file reader"). A third optional parameter is the smallest way to satisfy both.
- Two-argument behaviour is unchanged: with a null round file, an itemless block gives false, as the old code did. U4 holds: B's and H's output are byte-identical, 17,853 bytes each.
- What it carries is untested (E-1), and the closing amendment must record it (D-4).

## What I checked (commands and exit codes)

1. **Diff.** `git diff 49a7f532…...b08a1fec…` rc=0: 7 files, read file by file. Main changed none of the 7 files between B and 49a7f532 (`git diff --stat` empty). S1 (81a287a6) to H differs only by the 21 header-comment lines in `verify-quotes.mjs`, so S1's mutation records apply to the head's code.

2. **Mutations.** S1's report records MQ1 to MQ14 and MC1, each failing alone at 81a287a6, none by verify-mutation. I re-observed five at b08a1fec: apply, run the named test alone with `--test-name-pattern`, revert with `git checkout --`, show the porcelain empty.
   - MQ2 (item check removed): test rc=1, tests 1, fail 1, "a cite naming an item its block lacks fails by name". Porcelain empty.
   - MQ5 (plural header reads only its first round): test rc=1, fail 1, reason "no RULED block for question round 67…". Porcelain empty.
   - MQ9 (texts joined): test rc=1, fail 1, "a header in one ruling file and the item in another does not resolve" (AssertionError `[]`). Porcelain empty.
   - MQ13 (question-file fallback off): test rc=1, fail 1, on MILESTONE-3:5, "round 66, item 2". Porcelain empty.
   - MC1 (the old single-asterisk local resolver restored): test rc=1, fail 1, "unresolvable ruling: round 46, item 1". Porcelain empty.
   - VOID attempts, disclosed:
     - The first MQ9 and MC1 applications had their backslashes collapsed by the shell. The mutated file failed to load, so those were not observations.
     - A second MQ9 call ran with the applier missing. The test ran unmutated and passed (rc=0), so that was not an observation either.
     - The valid runs used a backslash-free applier, and each showed its diff before the test.

3. **U1 to U7.** B's `verify-quotes.mjs` and `verify-test-claims.mjs` were copied untracked into `scripts/plan/` as `vqri-g1r-B-*`, then deleted. Porcelain empty after.
   - U1: B's copy rc=0, H's rc=0. `diff` rc=1, and the only differing line is the PASS line's new `, 836 ruling cites resolved, 0 ruling-cite errors`. Both read 130 checked, 99 verified, 30 baselined, 1 advisory, 0 baseline entry errors, with no unmatched lines.
   - U2: both show 0 hash-reference errors and 2 hash-baselined (`engine/LOD-PREREGISTRATION.md` 541 and 545).
   - U3: `git diff --quiet B H -- scripts/plan/verify-quotes.baseline.json` rc=0, with 30 and 2 entries.
   - U4: B's copy rc=0, H's rc=0, `cmp` rc=0.
   - U5: `verify-cites` rc=0, PASS.
   - U6: suite 542/542. Main added no tests between B and 49a7f532: the static `test(` count is 514 at both, and 529 at H, so +15. Existing tests are unedited: the only deleted line is the import.
   - U7: R11 ✔ in the suite run.

4. **§7 count.** `git diff --numstat 49a7f532…...b08a1fec… -- . <§7 exclusions>` rc=0: 375 lines (341 + 34) against 550, and 7 files against 7.

5. **Hash pins.** All 44 sha256 pins in the form were recomputed at 40b04b46b33a6ce7a86160fac4a616ad1683ff1e: 0 mismatches, rc=0. The form has 44 `sha256:` tokens in total. The pin commit is an ancestor of main (`merge-base --is-ancestor` rc=0). Also recomputed: the three step reports' filing-note hashes (lines 5 to the end), which match 041671b1…, 004f63b9… and d7d36278….

6. **Suites at the head.**
   - `verify.mjs` rc=0 (PASS).
   - `verify-cites.mjs` rc=0 (2,189 files).
   - `verify-quotes.mjs` rc=0 (836 resolved, 0 errors).
   - `verify-test-claims.mjs` rc=0 (613 claims across 188 files).
   - `queue.mjs --check` rc=0.
   - `site.mjs --check` rc=0.
   - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`, inside a shared hold (granted on cores 0-7, then released): tests 542, pass 542, fail 0, cancelled 0, skipped 0. The hold shape ends with `exit $rc`, and the harness reported no non-zero exit.

7. **CI.** `gh pr checks 242` rc=0: 8 of 8 pass. `gh run list` shows every run at head sha b08a1fec4e3405153b4998882427355fa18db319 as success: Governance CI ×2, DCO, Exposure scan, Ported notices ×2. Product CI last ran at 8e04dbe2, success.

8. **§8 spot checks.**
   - Round + item cites in the form and in the S1, S2 and S3 reports, resolved by the head's `runVerifyQuotes` with explicit files: rc=0. The form has 5 cites and 0 unresolved; the reports have 0.
   - Only one RULED header in the ruling set names a question round outside §2.3 (i): `state/cut-archive/DECISIONS-PENDING-2026-10-20.md:125`, round 72, matching Amendment 3. My scan found 68 matching headers (rc=0).
   - `resolveRoundItem` has two product callers.
   - The `paths:` filter is unchanged.
   - No governing doc is touched.

Also disclosed: one `git fetch -q origin` in the main checkout, read only. That checkout's uncommitted changes are not mine. The worktree's porcelain is empty and HEAD is b08a1fec at the end. All scratch files are named `vqri-g1r-*`.
