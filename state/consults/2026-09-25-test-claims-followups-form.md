*Custodian's filing note (2026-09-25): the architect agent's consult for PLAN node `governance-test-claims-superseded-followups` (round 22, item 3), filed as returned (extracted by script from the agent's hand-back; byte-identical). Everything below the rule is the agent's text. The form (section 2) is not yet committed: its OPEN markers O1–O9 go to the human's next round first, with the ADR-035 note consult's S1–S4.*

---

**Verdict:** pass with notes. The node fits the constitution and the roadmap. No ADR is needed and none is touched. Three things follow from the rulings rather than from the deferred list: (i) round 22, item 3's condition runs into the append-only rule for two landed records (stop item O1); (ii) three existing tests pin the behaviour the ruling changes, so they must change (§4); (iii) the form is itself a scanned claim file, so it must never carry the marker token outside a backtick span (§8 item 7). I had no shell, so nothing below was run.

## 1. Which form

The full form (§21a). The piece changes a pass/fail property that tests currently check: three existing tests assert that a refused line gives exactly one finding, and AUTONOMY.md §6a item 3's sentence states that behaviour. My estimate of the diff (§7) is also far past §21c's 150 lines. The #116 architect's process note (gate-log index 175) says a §21a category takes the full form at dispatch.

## 2. The form — proposed path `scripts/plan/TEST-CLAIMS-FOLLOWUPS-PREREGISTRATION.md`

Nothing in it is reproduced, so it needs no byte-copy marks. The only fills are the four `{…}` placeholders in §2.6, filled by script before the commit. If either pinned line has moved at the fill commit, stop.

```markdown
# verify:test-claims follow-ups — preregistration

- Title: the should-fixes and nits deferred at PR #117's landing, and the refused-line finding, for `scripts/plan/verify-test-claims.mjs`.
- Authority: PLAN node `governance-test-claims-superseded-followups`; round 22, item 3 (the ruling and its condition); round 20, item 1 (riders (a) and (b)); round 21, item 2; the deferred items as `state/gate-log.json` indices 86, 87, 171 and 172 name them, and indices 185 and 186 for the refused-line residual; the record cap, `state/directives/2026-09-18-record-cap.md`.
- Drafted by: the architect agent on the custodian's brief (consult, 2026-09-25), read at `main` 7ed3465.
- Committed before any code, per docs/PREREGISTRATION-TEMPLATE.md's header rule. Full form and full gating (`AUTONOMY.md` §21a).
- Append-only once committed; a post-outcome amendment says so in its first line.
- OPEN markers O1–O9 (the consult's stop list): no code touches a marked point until an appended amendment records its resolution.

## §0. Disclosure

Informed only by the architect's consult. The two lines in §2.6 were found by a text search of the main checkout for the marker token; each hit was read by eye against the tool's claim-file set and its backtick-span rule. No shell was available, so the set is unproven until §9's enumeration runs. No pilot, corpus or measurement.

## §1. What this preregistration may and may not claim

No performance number, no docs/08 row, no wire change, no ADR, no user-visible string. It amends `AUTONOMY.md` §6a item 3 on its existing line only, and `scripts/plan/README.md`'s verify-test-claims section. It touches two landed records only as O1 resolves.

## §2. The change — stated before it is applied

1. Refused-line finding (round 22, item 3). In every scanned file, every line carrying the marker token outside any backtick span (`WITHDRAWN_TEST_TOKEN_RE`, unchanged) that yields no accepted row is a binding finding. Kind `withdrawn-row`, reported at the line's own file:line, whatever the state of any claim and whatever its node's status. It is never planned. It never suppresses, and is never suppressed by, a claim finding. Its reason is the grammar's own, computed in the same pass that accepts rows, with no second copy of the grammar (§7). Riders on such a line: [O2].
2. Wide-span residual (index 86; index 171 S4): condition (d) reads the claim's own historical line — line L at the pinned rev, L being the claim's line — not the whole pinned span. Both markers; single-line pins unchanged.
3. Rev resolution (index 87; index 171 S4): a `<rev>` that passes `COMMIT_ID_RE` exempts only when `git rev-parse --verify --quiet <rev>^{commit}` resolves to a commit whose id begins with `<rev>`. A hex-named branch or tag is refused. Memoized by (root, rev). Its standing under §2.1: [O3].
4. `isAncestorOfMain` memoized by (root, rev) (index 87; index 171 S4).
5. Condition (b)'s word: [O6] (index 87).
6. Lines already on main (round 22, item 3's condition), corrected or reduced in this PR by the method [O1]. Each pin is historical: it is authoritative for the bytes before this piece's edit, and the tree is authoritative after it.
   - `scripts/plan/TEST-CLAIMS-WITHDRAWN-PREREGISTRATION.md:97` @ {MAIN_40HEX} sha256:{SHA256_97} — Amendment 2's Discharged clause; the token in prose, no pinned reference.
   - `scripts/plan/VERIFY-MUTATION-MULTILINE-ATTRS-PREREGISTRATION.md:138` @ {MAIN_40HEX} sha256:{SHA256_138} — Amendment 7's heading; the token in prose, no pinned reference.
7. Wording, no behaviour change:
   (a) Index 86 and index 171 S4: the module header's SUPERSEDED disclosure and the README's boundary lead-in name their source as adopted from the architect gate report (attempt 1, 2026-09-18), no longer as byte-copied. Both passages lose their quotation form; their words are unchanged.
   (b) Index 86: the README's condition-(c) forgery clause is restated — a pin proves the line's age and identity, not the name's disappearance.
   (c) Index 87: round 12's reference form is cited as round 12, item 1, unquoted, in the module header and the README.
   (d) Index 171 S2/S3 and index 172: stale comments.
       - The module header's condition-(e) SKIPPED clause and the comment above `originMainCache`: a fixture now carries a remote.
       - The comment above `GAP`/`HASH_REF_RE`: its not-tracked premise, superseded by 6191a7c.
       - The comment above `SUPERSEDED_DOC`: 46cde2c is an ancestor of main.
       - `entry 133` → `state/gate-log.json` index 87, above `GAP`/`HASH_REF_RE`, `SUPERSEDED_DOC` and `supersededFixtureWithRemote`.
       - These are the readings the scanner form's last Amendment gives.
   (e) `AUTONOMY.md` §6a item 3, on its existing line: the superseded sentence names condition (e)'s SKIPPED branch, and the refused-line sentence is restated per §2.1. No line is added, removed or moved.
   (f) The README's WITHDRAWN paragraph is restated per §2.1 and [O3].
8. Test-file nits (index 87):
   - RECORDED MUTATION comments whose reference text wraps across comment lines are rejoined on one line (round 15, item 1, clause (d)).
   - Where the comments call the content hash variable, they describe it as constant.
   - Every temp directory the file creates is removed after its test.
   - Existing mutation-comment counts: [O5].
9. Not in this piece: the gate-log node id [O4]; other files' temp directories [O9].

## §3. Fixtures / corpus — pre-declared outcomes

No corpus. Unit fixtures only: temp git repos, as in the file's existing tests. The tree runs are §5.

## §4. Tests, and the mutation per new test

Ten new tests, appended to `scripts/plan/verify-test-claims.test.mjs`. Each has a RECORDED MUTATION comment: applied for real, reverted, the observed failure recorded with the commit it was observed at. In tests 2–5 the pinned claim exists, so the refused finding is the only finding.

1. `a_withdrawn_test_line_with_no_pinned_reference_fails_by_name` — mutation: the no-reference refusal records no reason.
2. `a_withdrawn_test_line_pinning_a_line_range_fails_by_name` — mutation: the range refusal records no reason.
3. `a_withdrawn_test_line_pinning_another_files_path_fails_by_name` — mutation: the other-path refusal records no reason.
4. `a_withdrawn_test_line_with_no_commit_id_rev_fails_by_name` — mutation: the rev refusal records no reason.
5. `a_refused_withdrawn_test_line_names_its_unresolvable_ruling` — a range row with ruling `round 99, item 1` [O2]. Mutation: riders are not read on refused lines.
6. `a_refused_withdrawn_test_line_in_a_planned_gate_file_still_fails_by_name` — mutation: the refused-line finding is routed through the planned/binding split.
7. `a_range_pin_whose_claim_line_never_carried_the_name_does_not_exempt` — mutation: restore the whole-span name check.
8. `a_pin_whose_rev_is_a_hex_named_branch_does_not_exempt` — mutation: drop the resolved-id prefix check.
9. `a_pin_marked_not_superseded_does_not_exempt` [O6] — mutation: drop the negation guard.
10. `a_pin_marked_superseded_only_in_capitals_does_not_exempt` [O6] — mutation: restore the case-insensitive match.

Changed tests, titles byte-unchanged: `a_withdrawn_test_row_also_marked_superseded_does_not_exempt_as_superseded`, `a_withdrawn_test_row_pinning_a_line_range_does_not_exempt`, `a_withdrawn_name_claimed_in_another_file_stays_a_finding`. Each now asserts two findings — the claim finding and the refused-line finding, the latter's message per §7. Their recorded mutations are re-run and re-captured.

No test covers §2.4 (the reviewer reads it) or the temp-directory removal (§9's delta check).

## §5. Registered predictions · declared unchanged · invalidators · falsification

- P1. With §2.1 applied and §2.6 not yet applied, the tool over the merge base's scanned files: exit 1, with exactly two findings — §2.6's two lines — each with the no-reference reason (plus [O2]'s rider text).
- P2. At the PR head: exit 0; 0 findings; 15 withdrawn; 3 superseded — the same three file:line:name triples as on main.
- P3. The file's 35 existing tests plus the 10 new ones all pass; the scripts suite is green.
- Declared unchanged: the accepted-row check and its messages; SUPERSEDED's exemption for every pin on main; the claim recognizer; the printed line format; no export added.
- Invalidators: a merge from main adds a marker line in a scanned file → it joins §2.6 under O1's resolution. If that line sits in an accepted ADR, or in any file this PR may not edit → STOP, to the human. P2's triples differ → STOP; that is a result.
- Falsification: any new test that its recorded mutation cannot make fail.

## §6. Instruments

All assertions; no measurement. The temp-directory check counts `verify-test-claims-*` directories under the OS temp directory before and after one run of the file.

## §7. Declared values and ceilings

- Refusal reasons, exact text: `refused: another file's path`, `refused: no commit-id rev`, `refused: a line range`, and `refused: no pinned reference` when no reference starts on the line.
  - The first three are evaluated on the first reference that starts on the line, in that order.
  - A line with any accepted reference is not refused.
- Rider text per [O2]: `; ` followed by the existing rider-failure text.
- Budget: <= 520 insertions plus deletions over `scripts/plan/verify-test-claims.mjs`, `scripts/plan/verify-test-claims.test.mjs` and `scripts/plan/README.md` (`git diff --numstat <merge-base>...HEAD`), plus §2.6's two lines.
  - Excluded (§21c's exempt set): this form, and §6a item 3's line in `AUTONOMY.md`.
  - At most 7 non-generated files. An overrun is recorded per [O7].

## §8. Block-on-sight

1. A second copy of the row grammar (a refusal reason computed outside the pass that accepts rows).
2. An export added to `verify-test-claims.mjs`.
3. A refused-line finding that is planned, or that suppresses or is suppressed by a claim finding.
4. In `AUTONOMY.md`: any change off §6a item 3's line, or any line added, removed or moved.
5. Any byte of a landed record changed outside §2.6's two lines as O1 resolves.
6. An existing test title changed.
7. A line of this form carrying the marker token outside a backtick span.
8. A count or failure text in a test comment stated without the commit it was observed at.
9. `PLAN.yaml` with CRLF line endings.

## §9. Gates

- **Architect and reviewer**, full gating (§21a).
- **Enumeration** (round 22, item 3's condition), run mechanically by the reviewer:
  - (i) the tool at §2.1's tip, over the merge base;
  - (ii) an independent script: `git ls-files` filtered by the tool's claim-file rule; every line with the token outside `BACKTICK_SPAN_RE` spans; minus lines carrying an accepted row.
  - Both must equal §2.6. Re-run on the merge result immediately before the merge.
- **Suites**: `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`.
- **Self-checks**, each result naming its commit: verify-test-claims, verify-cites, verify-quotes, verify-mutation (`--base origin/main --head HEAD`), `verify.mjs --offline`, `queue.mjs --check`, `site.mjs --check`.
- **Temp-directory delta**: 0.
- **Operator**: none.

## §10. Amendments — opens empty, append-only
```

**How I found the §2.6 lines:**
- I searched the main checkout (7ed3465) for the case-sensitive token `withdrawn-test` and kept the hits in scanned files.
- Only two scanned files carry it:
  - `scripts/plan/TEST-CLAIMS-WITHDRAWN-PREREGISTRATION.md`: lines 3, 19, 49, 54, 80, 97.
  - `scripts/plan/VERIFY-MUTATION-MULTILINE-ATTRS-PREREGISTRATION.md`: lines 138, 142–146. Lines 142–146 are accepted rows.
- No ADR carries the token.
- By eye, the token is outside backtick spans only on TEST-CLAIMS-WITHDRAWN:97 and VERIFY-MUTATION:138.
- I paired line 19's backticks by eye, so that line most needs the mechanical check.
- §9's two-way enumeration is the proof. I have none.

## 3. Stop list (none resolved in the form)

- **O1 — how the two main lines are corrected, given the append-only rule.**
  - Recommend (a): read round 22, item 3's condition as the authority for exactly two in-place edits. Each wraps the token in one backtick span: two bytes, no word changed, no line moved. The pre-edit bytes are pinned in §2.6, append-only is proved against the merge base with these two lines named, and no row is appended to either landed record.
  - Alternative (b): narrow the marker to the row key (the token followed by `:`). That leaves both lines alone but reopens the silent class for a row written without the colon.
  - Your call whether (a) needs the human's confirmation. My reading is that the condition already authorises it.
- **O2 — which riders are read on a refused line.** The ruling names rider (a) only; the residual as recorded (indices 185 and 186, the PLAN summary) names both ruling and carrier.
  - Recommend both riders in one call (the existing function does both), one finding per line, grammar reason first.
- **O3 — pin-condition failures on accepted rows.** A failure of (c), (d), (e) or §2.3's rev resolution exempts nothing, and is not named when the pinned claim exists.
  - Recommend leaving this as is: it is outside "the grammar's reason". The README discloses it, and §2.3 lives in the resolution step, not the grammar.
  - Naming these would widen the ruling, which is the human's question.
- **O4 — the gate-log node id differs from the PLAN id** (a nit).
  - Recommend no edit here. Gate reports are immutable (AUTONOMY.md §22), and renaming the PLAN id breaks ledger and PR references.
  - The join belongs to `governance-record-round-count`, the first consumer that counts per node. Drop it from this node's summary.
- **O5 — stale counts in existing mutation comments** ("N of 35", "the other 34/18/19 tests pass").
  - Recommend qualifying each with the commit it was observed at (class 3, the test-text exception), with no re-run. Only the three changed tests' comments are re-captured.
- **O6 — condition (b)'s word.**
  - Recommend accepting `superseded` or `Superseded` as a whole word, and refusing all-caps or a preceding `not`/`never`.
  - P2's unchanged superseded triples prove main is unaffected. The main rows I read (OWNER-INVALIDATION, lines 1204–1214) are lowercase; the gate confirms the rest.
- **O7 — the overrun class.** The full form has no class for a §7 overrun (the weekly-window finding).
  - Recommend class 2, following index 185's reading. No new class (record cap).
- **O8 — PLAN node fields.**
  - `gate` → this form, in the same commit.
  - `budget_minutes: 60` does not fit the ≤520-line budget. Recommend re-estimating; the two prior pieces overran 2–3×.
  - `entries: [111]` is index 177's nit. Recommend resolving it against the ledger.
- **O9 — temp-directory cleanup scope.**
  - Recommend this test file only. `verify-mutation.test.mjs`'s leftover directories stay a weekly-window finding.

No ADR skeleton is needed.

Files:
- C:\dev\spatial-ide\scripts\plan\verify-test-claims.mjs
- C:\dev\spatial-ide\scripts\plan\verify-test-claims.test.mjs
- C:\dev\spatial-ide\scripts\plan\README.md
- C:\dev\spatial-ide\AUTONOMY.md
- C:\dev\spatial-ide\scripts\plan\TEST-CLAIMS-WITHDRAWN-PREREGISTRATION.md
- C:\dev\spatial-ide\scripts\plan\VERIFY-MUTATION-MULTILINE-ATTRS-PREREGISTRATION.md
- C:\dev\spatial-ide\scripts\plan\TEST-CLAIMS-SUPERSEDED-PREREGISTRATION.md
- C:\dev\spatial-ide\PLAN.yaml
- C:\dev\spatial-ide\state\gate-log.json
