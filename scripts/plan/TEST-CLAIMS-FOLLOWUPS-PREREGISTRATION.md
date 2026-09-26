# verify:test-claims follow-ups — preregistration

- Title: the should-fixes and nits deferred at PR #117's landing, and the refused-line finding, for `scripts/plan/verify-test-claims.mjs`.
- Authority: PLAN node `governance-test-claims-superseded-followups`; round 22, item 3 (the ruling and its condition); round 23, item 4 (the resolutions of the consult's O1–O9, each written where it applies); round 20, item 1 (riders (a) and (b)); round 21, item 2; the deferred items as `state/gate-log.json` indices 86, 87, 171 and 172 name them, and indices 185 and 186 for the refused-line residual; the record cap, `state/directives/2026-09-18-record-cap.md`.
- Drafted by: the architect agent: the consult filed at `state/consults/2026-09-25-test-claims-followups-form.md`, revised to round 23, item 4, read at `main` 3bb1bf2.
- Committed before any code, per docs/PREREGISTRATION-TEMPLATE.md's header rule. Full form and full gating (`AUTONOMY.md` §21a).
- Append-only once committed; a post-outcome amendment says so in its first line.

## §0. Disclosure

Informed only by the architect's consult and round 23, item 4. The row-position predicate (§2.1) was checked by eye against `scripts/plan/VERIFY-MUTATION-MULTILINE-ATTRS-PREREGISTRATION.md` Amendment 7's five rows and §2.7's two lines, at `main` 3bb1bf2. No shell was available, so the sets are unproven until §9's enumeration runs. No pilot, corpus or measurement.

## §1. What this preregistration may and may not claim

No performance number, no docs/08 row, no wire change, no ADR, no user-visible string. It amends `AUTONOMY.md` §6a item 3 on its existing line only, and `scripts/plan/README.md`'s verify-test-claims section. It changes no byte of any landed record (round 23, item 4).

## §2. The change — stated before it is applied

1. Row position and the refused-line finding (round 22, item 3; round 23, item 4, its O1 line; O2 as recommended).
   (a) Row position: the line's first two bytes are `- `, the marker token follows immediately, and the token is followed by a byte outside `[A-Za-z0-9_-]` or by the line's end. This is the row grammar's own leading shape (`state/consults/2026-09-24-withdrawn-marker.md` §1), held as one anchored predicate (§7). The colon is not part of it.
   (b) Only a line in row position is a withdrawal attempt, and only such a line can yield an accepted row (`withdrawnTestSpans`). A line carrying the token anywhere else is a mention. It is neither accepted nor refused.
   (c) Every line in row position that yields no accepted row is a binding finding. Kind `withdrawn-row`, reported at the line's own file:line, whatever the state of any claim and whatever its node's status. It is never planned. It never suppresses, and is never suppressed by, a claim finding. Its reason is the grammar's own (§7), computed in the same pass that accepts rows.
   (d) Both riders are read on such a line in one call. One finding per line, grammar reason first, rider failure appended (§7).
   (e) Precedence is unchanged. `supersededSpans` still excludes any line carrying the token outside backtick spans, by containment, not by row position. The exclusion is a refusal, so the wider predicate is the fail-closed one.
2. Pin-condition failures on accepted rows (round 23, item 4, its O3 line; the human's explicit widening).
   - Every accepted row is checked on its own, beside its riders, for:
     - (r) §2.4's rev resolution;
     - (c) the pinned line at `<rev>` recomputes the row's hash;
     - (d) that line, read by `extractClaimedTests`, names at least one test;
     - (e) `<rev>` is an ancestor of `origin/main`. This is SKIPPED on today's terms when `origin/main` does not resolve, and sets `withdrawnMainUnchecked`.
   - The first failure, in that order, is named in §2.1(c)'s shape (§7), with rider failures appended as in §2.1(d).
   - A row that fails here joins `invalidRowLines`, as a rider-failed row does (round 21, item 2).
   - Per-claim exemption is unchanged, including per-name (d). SUPERSEDED rows are not widened.
3. Wide-span residual (index 86; index 171 S4): condition (d) reads the claim's own historical line — line L at the pinned rev, L being the claim's line — not the whole pinned span. This applies to both markers; single-line pins are unchanged.
4. Rev resolution (index 87; index 171 S4): a `<rev>` that passes `COMMIT_ID_RE` exempts only when `git rev-parse --verify --quiet <rev>^{commit}` resolves to a commit whose id begins with `<rev>`. A hex-named branch or tag is refused. Memoized by (root, rev). On a withdrawn row it is §2.2's condition (r).
5. `isAncestorOfMain` memoized by (root, rev) (index 87; index 171 S4).
6. Condition (b)'s word (index 87; round 23, item 4, O6 as recommended): `superseded` or `Superseded` as a whole word, outside backtick spans. The all-caps form is refused, and so is the word when the whole word immediately before it is `not` or `never`, in either capitalization.
7. Lines already on main (round 22, item 3's condition, by the method round 23, item 4's O1 line gives). None is edited. The two scanned lines that carry the token outside a backtick span are mentions under §2.1(a) and yield no finding. Each pin is historical: authoritative for the bytes at `d90f91998fafc06cc6da083fb6c0bd6e72bc4d6f`. The tree is authoritative for the current bytes. This piece changes neither, so they agree at the PR head.
   - `scripts/plan/TEST-CLAIMS-WITHDRAWN-PREREGISTRATION.md:97` @ d90f91998fafc06cc6da083fb6c0bd6e72bc4d6f sha256:a90f04f66506b71082fc2e15d321279aefe33e05fc7c94607dc2a9d3c56bba75 — Amendment 2's Discharged clause.
   - `scripts/plan/VERIFY-MUTATION-MULTILINE-ATTRS-PREREGISTRATION.md:138` @ d90f91998fafc06cc6da083fb6c0bd6e72bc4d6f sha256:192d30b51886631d81c995d003e28780542e2670aca4a2ccb3013dd956f7039d — Amendment 7's heading.
8. Wording, no behaviour change:
   (a) Index 86 and index 171 S4: the module header's SUPERSEDED disclosure and the README's boundary lead-in name their source as adopted from the architect gate report (attempt 1, 2026-09-18), no longer as byte-copied. Both passages lose their quotation form; their words are unchanged.
   (b) Index 86: the README's condition-(c) forgery clause is restated — a pin proves the line's age and identity, not the name's disappearance.
   (c) Index 87: round 12's reference form is cited as round 12, item 1, unquoted, in the module header and the README.
   (d) Index 171 S2/S3 and index 172: stale comments.
       - The module header's condition-(e) SKIPPED clause and the comment above `originMainCache`: a fixture now carries a remote.
       - The comment above `GAP`/`HASH_REF_RE`: its not-tracked premise, superseded by 6191a7c.
       - The comment above `SUPERSEDED_DOC`: 46cde2c is an ancestor of main.
       - `entry 133` → `state/gate-log.json` index 87, above `GAP`/`HASH_REF_RE`, `SUPERSEDED_DOC` and `supersededFixtureWithRemote`.
       - These are the readings the scanner form's last Amendment gives.
   (e) `AUTONOMY.md` §6a item 3, on its existing line: the superseded sentence names condition (e)'s SKIPPED branch, and the withdrawn sentence is restated per §2.1 and §2.2. No line is added, removed or moved.
   (f) The README's WITHDRAWN paragraph is restated per §2.1 and §2.2. It discloses that a row not in row position (indented, or with another bullet) is a mention.
9. Test-file nits (index 87; round 23, item 4, O5 as recommended):
   - RECORDED MUTATION comments whose reference text wraps across comment lines are rejoined on one line (round 15, item 1, clause (d)).
   - Where the comments call the content hash variable, they describe it as constant.
   - Every temp directory the file creates is removed after its test.
   - Existing mutation comments' counts ("N of 35", "the other 34 tests pass" and their kin) are qualified with the commit they were observed at, with no re-run (class 3, the test-text exception).
   - Only §4's two changed tests are re-captured.
   - The comment on `a_withdrawn_test_row_also_marked_superseded_does_not_exempt_as_superseded` now gives the reason as §2.1(a) (its row is not in row position), in place of the range refusal. Its title, assertions and recorded failure are unchanged.
10. Not in this piece (round 23, item 4, O4 and O9 as recommended):
    - The gate-log node id: the join belongs to `governance-record-round-count`, and the nit leaves this node's summary.
    - Other files' temp directories: `verify-mutation.test.mjs`'s leftover directories stay a weekly-window finding.

## §3. Fixtures / corpus — pre-declared outcomes

No corpus. Unit fixtures only: temp git repos, as in the file's existing tests. Test 14 is built from real bytes: the two §2.7 lines, read by `git show` at `d90f91998fafc06cc6da083fb6c0bd6e72bc4d6f` and checked against their pinned hashes inside the test. The tree runs are §5.

## §4. Tests, and the mutation per new test

Nineteen new tests, appended to `scripts/plan/verify-test-claims.test.mjs`. Each has a RECORDED MUTATION comment: applied for real, reverted, the observed failure recorded with the commit it was observed at. In tests 2–5, 12, 17 and 18 the pinned claim exists, so the row-level finding is the only finding.

1. `a_withdrawn_test_line_with_no_pinned_reference_fails_by_name` — mutation: the no-reference refusal records no reason.
2. `a_withdrawn_test_line_pinning_a_line_range_fails_by_name` — mutation: the range refusal records no reason.
3. `a_withdrawn_test_line_pinning_another_files_path_fails_by_name` — mutation: the other-path refusal records no reason.
4. `a_withdrawn_test_line_with_no_commit_id_rev_fails_by_name` — mutation: the rev refusal records no reason.
5. `a_refused_withdrawn_test_line_names_its_unresolvable_ruling` — a range row with ruling `round 99, item 1`. Mutation: riders are not read on refused lines.
6. `a_refused_withdrawn_test_line_in_a_planned_gate_file_still_fails_by_name` — mutation: the refused-line finding is routed through the planned/binding split.
7. `a_range_pin_whose_claim_line_never_carried_the_name_does_not_exempt` — mutation: restore the whole-span name check.
8. `a_pin_whose_rev_is_a_hex_named_branch_does_not_exempt` — mutation: drop the resolved-id prefix check.
9. `a_pin_marked_not_superseded_does_not_exempt` — mutation: drop the negation guard.
10. `a_pin_marked_superseded_only_in_capitals_does_not_exempt` — mutation: restore the case-insensitive match.
11. `a_heading_or_clause_that_mentions_the_marker_is_not_a_withdrawal_attempt` — a heading and a prose line, each carrying the token outside backticks with no reference. 0 findings. Mutation: the row-position predicate is replaced by the pre-piece containment test.
12. `a_marker_in_row_position_without_its_colon_is_still_checked` — the colon dropped, ruling `round 99, item 1`. One finding, the rider text. Mutation: the predicate requires the colon.
13. `a_marker_after_other_text_on_a_bullet_does_not_exempt` — an own-path pin with valid riders, with the token after other words, over a missing claim. 0 withdrawn, one claim finding. Mutation: as test 11.
14. `the_two_landed_mention_lines_are_not_withdrawal_attempts` — §3's real-bytes fixture. 0 findings. Mutation: as test 11.
15. `a_withdrawn_test_row_whose_hash_does_not_recompute_fails_by_name` — the claim is missing. Exactly one finding, kind `withdrawn-row`. Mutation: skip the row-level hash check.
16. `a_withdrawn_test_row_whose_pinned_line_names_no_test_fails_by_name` — mutation: skip the row-level (d) check.
17. `a_withdrawn_test_row_whose_rev_is_not_on_main_fails_by_name` — a fixture with a remote. Mutation: skip the row-level (e) check.
18. `a_withdrawn_test_row_whose_rev_is_not_a_commit_fails_by_name` — a hex-named branch as rev. Mutation: skip the row-level (r) check.
19. `a_withdrawn_test_row_whose_pin_and_ruling_both_fail_names_both` — mutation: riders are not read when the pin fails.

Changed tests, titles byte-unchanged: `a_withdrawn_test_row_pinning_a_line_range_does_not_exempt` and `a_withdrawn_name_claimed_in_another_file_stays_a_finding`. Each now asserts two findings: the claim finding, and the refused-line finding with its §7 message. Their recorded mutations are re-run and re-captured.

No test covers §2.5 (the reviewer reads it) or the temp-directory removal (§9's delta check).

## §5. Registered predictions · declared unchanged · invalidators · falsification

- P1. At the last code commit and at the PR head, the tool exits 0 with 0 findings, 15 withdrawn and 3 superseded. The superseded entries are the same three file:line:name triples as on main.
- P2. Enumeration over the merge base's scanned files:
  - (a) The lines in row position are exactly the five rows of `scripts/plan/VERIFY-MUTATION-MULTILINE-ATTRS-PREREGISTRATION.md` Amendment 7, all accepted.
  - (b) The lines carrying the token outside backtick spans and not in row position are exactly §2.7's two lines.
- P3. The file's 35 existing tests plus the 19 new ones all pass, and the scripts suite is green.
- Declared unchanged:
  - the rider check and its messages when the pin holds;
  - SUPERSEDED's exemption for every pin on main;
  - §2.1(e)'s precedence exclusion;
  - the claim recognizer;
  - the printed line format;
  - no export added;
  - no landed record's byte.
- Invalidators:
  - A merge from main adds a row-position line that is not an accepted row: STOP, to the human. Round 22, item 3's condition forbids reddening main, and round 23, item 4 forbids editing a landed preregistration.
  - P1's triples or P2(a) differ: STOP. That is a result.
  - P2(b) differs: recorded as a result, no stop. A mention is not an attempt.
- Falsification: any new test that its recorded mutation cannot make fail.

## §6. Instruments

All assertions; no measurement. The temp-directory check counts `verify-test-claims-*` directories under the OS temp directory before and after one run of the file.

## §7. Declared values and ceilings

- Row-position predicate, the only copy: `^- withdrawn-test(?![A-Za-z0-9_-])`, applied to one line.
- Grammar refusal reasons, exact text:
  - `refused: no pinned reference`, when no reference starts on the line;
  - otherwise, on the first reference that starts on the line, in this order: `refused: another file's path`, `refused: no commit-id rev`, `refused: a line range`.
- Pin refusal reasons (§2.2, order (r), (c), (d), (e)): `refused: rev is not a commit`, `refused: hash does not recompute`, `refused: pinned line names no test`, `refused: rev not on main`.
- Riders:
  - after a refusal: `; ` followed by the existing rider-failure text;
  - when the pin holds: the rider-failure text alone, unchanged.
- Budget: <= 720 insertions plus deletions over `scripts/plan/verify-test-claims.mjs`, `scripts/plan/verify-test-claims.test.mjs` and `scripts/plan/README.md` (`git diff --numstat <merge-base>...HEAD`).
  - Excluded (§21c's exempt set): this form, and §6a item 3's line in `AUTONOMY.md`.
  - At most 6 non-generated files (this form, the three counted files, `AUTONOMY.md`, `PLAN.yaml`), besides the gate-log records.
  - An overrun is recorded as class 2 (round 23, item 4, O7 as recommended).
- PLAN node fields, set in this form's commit (round 23, item 4, O8 as recommended):
  - `gate` → this form;
  - `budget_minutes` → 240;
  - `entries` resolved against the ledger.

## §8. Block-on-sight

1. A second copy of the row grammar or of §7's predicate (a refusal reason computed outside the pass that accepts rows).
2. An export added to `verify-test-claims.mjs`.
3. A row-level finding that is planned; a refused-line finding that suppresses or is suppressed by a claim finding.
4. In `AUTONOMY.md`: any change off §6a item 3's line, or any line added, removed or moved.
5. Any byte of a landed record changed (round 23, item 4).
6. An exemption list, a baseline file or a hard-coded path for §2.7's lines (round 23, item 4's fallback, not taken).
7. An existing test title changed.
8. A line of this form in row position.
9. A count or failure text in a test comment stated without the commit it was observed at.
10. `PLAN.yaml` with CRLF line endings.

## §9. Gates

- **Architect and reviewer**, full gating (§21a).
- **Enumeration** (P2; round 22, item 3's condition), run mechanically by the reviewer:
  - (i) the tool at the last code commit, over the merge base;
  - (ii) an independent script: `git ls-files` filtered by the tool's claim-file rule; the lines matching §7's predicate, written anew; the lines carrying the token outside `BACKTICK_SPAN_RE` spans and not matching it.
  - Both must equal P2. Re-run on the merge result immediately before the merge.
- **Suites**: `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`.
- **Self-checks**, each result naming its commit: verify-test-claims, verify-cites, verify-quotes, verify-mutation (`--base origin/main --head HEAD`), `verify.mjs --offline`, `queue.mjs --check`, `site.mjs --check`.
- **Temp-directory delta**: 0.
- **Operator**: none.

## §10. Amendments — opens empty, append-only

### Amendment 1 — 2026-09-25 (UTC), written after the results were seen: the closing record (class 2)

1. **Budget overrun, class 2 (§7's own rule; round 23, item 4, O7).** Declared: ≤ 720. Final, by `git diff --numstat origin/main...HEAD -- scripts/plan/verify-test-claims.mjs scripts/plan/verify-test-claims.test.mjs scripts/plan/README.md` at c1e315b: **912**.
   - Per file: mjs 235+65, test 513+39, README 37+23.
   - Reason: nineteen new tests, each with its own git-tree fixture; §2.9's qualifiers on existing comments; §2.8(f)'s restated WITHDRAWN paragraph.
   - Non-generated files: 5 of ≤ 6. The §7 line is not edited to match.
2. **Results at c1e315b** (the custodian's re-run, every command exiting 0):
   - P1: `verify-test-claims` reports 0 findings, 15 withdrawn, 3 superseded.
   - P3: the scripts suite, 310 pass and 0 fail; `verify-mutation --base origin/main --head HEAD` finds 19 of 19 new tests with a recorded mutation.
   - verify-cites, verify-quotes, `verify.mjs --offline`, `queue.mjs --check` and `site.mjs --check` all pass.
   - P2 and the temp-directory delta are the reviewer's mechanical runs under §9, recorded in the gate log.
3. **Deviations disclosed by the worker, for the gates:**
   - §2.9's temp-directory sweep is one whole-file `after()` hook over a single `fs.mkdtempSync` wrapper, not per-test cleanup.
   - The nineteen new tests' recorded-mutation comments carry no commit citation. Only the §2.9 qualifiers on existing comments carry one.
4. **Commits:** e6ac5c8 (this form), c617ddc and a30ff02 (§2.1–§2.9), 10ec8f4 (§2.8 (a)–(d), (f)), c1e315b (§2.8 (e), `AUTONOMY.md` §6a item 3, one line in place).

### Amendment 2 — 2026-09-25 (UTC), before either gate: §8 item 9 applied to the new comments (class 3; the final figure)

1. **The comments.** §8 item 9 names every test comment, not only §2.9's existing ones.
   - fbf90f0 qualifies the nineteen new tests' recorded-mutation comments "observed at c1e315b". Each mutation was re-applied at that code and reverted, and the worker reports each observation byte-identical to the comment it qualifies.
   - ea3b21d corrects the two changed tests' comments, `a_withdrawn_test_row_pinning_a_line_range_does_not_exempt` and `a_withdrawn_name_claimed_in_another_file_stays_a_finding`, to the custodian's re-observation at c1e315b: 51 of 54 and 52 of 54 pass. The companion tests are named as observed.
   - Comments only in both commits.
2. **Final figure:** 919 by Amendment 1's command at ea3b21d (mjs 235+65, test 520+39, README 37+23). Still class 2; the §7 line is not edited.

Superseded index: Amendment 1 item 1's final figure (912), and Amendment 1 item 3's second bullet (the new tests' comments now carry their commit).

### Amendment 3 — 2026-09-26 (UTC), written after gate attempt 1's results were seen (architect and reviewer FAIL at f6ccfd2; `state/gate-log.json`, node governance-test-claims-superseded-followups, attempt 1): the fix round's record

1. **Code, class 5 (a gate settling the piece).** Architect B3, B4 and A4, and reviewer B6 and A5: 7400dac.
2. **Tests, class 4.**
   - Architect B1/reviewer B1, architect B2/reviewer B5, and architect B5/reviewer B4: 4d9644b.
   - The new test `a_valid_row_with_condition_e_skipped_sets_withdrawn_main_unchecked` (architect B4/reviewer B6): 4d9644b.
   - `a_withdrawn_test_row_whose_rev_is_not_on_main_fails_by_name` records §4's "skip the row-level (e) check" as the drop of its refusal line only: 4d9644b.
3. **Comments, class 3** (reviewer B2 and B3): a2e6025 re-observes every recorded mutation in this piece's comments at 7400dac, on Node v24.18.1.
4. **A result, class 2.** At 7400dac, `a_pin_with_no_rev_does_not_exempt`'s recorded mutation fails no test (55 of 55 pass): §2.4's `revResolvesToCommit` refuses the same rev. The test predates this piece; a2e6025 records this in its comment.
5. **Docs, class 3** (architect A2, reviewer A2, A3 and A6): af9d34d (README) and 603940d (`AUTONOMY.md` §6a item 3, one line in place). PLAN, architect A6/reviewer A7: 8fb4999.
6. **Final figures at 8fb4999**, by Amendment 1's command: 1,087 (mjs 261+84, test 616+56, README 46+24), class 2. Non-generated files: 6 of ≤ 6.

Superseded index: Amendment 1 item 1's final figure (912) and its file count (5), by item 6; Amendment 2 item 1's bullets, by item 3; Amendment 2 item 2's figure (919), by item 6; Amendment 2 item 2's second sentence, withdrawn as a restatement of Amendment 1 item 1.
