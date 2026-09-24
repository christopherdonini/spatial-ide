# Consult — the withdrawn marker for verify:test-claims (2026-09-24)

Architect pre-work consult for PLAN node `governance-test-claims-withdrawn-marker`, under question round 20, item 1 (entry 134). Read against main at 708e361. Returned as a hand-back; filed here by the custodian. The design is the architect's. The custodian's two notes at the end are the custodian's.

**Verdict:** pass with notes. The consult corrects three premises of the custodian's brief:
- the marker token;
- the ruling #108's rows name;
- the form: full, not five-line.

## 1. Row grammar

- **One row is one line** (round 15 (d)): `- withdrawn-test: `<F>:<L>` @ <40-hex main rev> sha256:<hex>; ruling: round N, item M; carrier: round N, item M`
- **The marker is `withdrawn-test`, not a bare `withdrawn`.**
  - Landed records already carry the word `withdrawn` on lines that pin their own file: `engine/LOD-RELEASE-GUARD-PREREGISTRATION.md` and `engine/ADMISSION-PREREGISTRATION.md`, as round 15 (g) withdrawal rows.
  - Every row is checked under rider (a). A bare-word marker would therefore turn main red.
  - Match it outside backticks, case-sensitive, with no word or hyphen character on either side.
  - Entry 134's option text named a "withdrawn" marker. That was the custodian's wording, not the human's typed words. The preregistration's §2 states the reason for the longer token.
- **Pin conditions.** Reuse SUPERSEDED's conditions (a), (c), (d) and (e) and the `COMMIT_ID_RE` rev guard. Pass the marker to `supersededSpans`/`findSupersededSpan` as a parameter; do not copy them.
- **One pinned line per row.** A range is refused. This avoids the wide-span residual that `governance-test-claims-superseded-followups` defers.
- **One row covers every claim on its pinned line.** Condition (d) is checked per name.
- **Precedence.** `supersededSpans` skips any line that carries `withdrawn-test`. Otherwise a withdrawn row that fails its riders could still exempt its claim as superseded.

## 2. Rider (a), mechanically

- **Resolution is against the current tree's `DECISIONS-PENDING.md`**, read once, and only when a row exists. It is not pinned by hash, because the ledger is never cited by line or pinned (round 12 (a), round 14 (a′)).
- `round N, item M` resolves when both of these hold:
  - a line starting with `**RULED <date>[ (…)] — question round N` exists, with N matched exactly;
  - inside that block, a line `- *Item M —` sits at column 0, before the next `**` block or `## ` heading.
- **"Names the removal" is read by the gate, not checked by the tool.** The README's boundary paragraph discloses this, as SUPERSEDED's replacement half is disclosed.
- **The failure is named** on every row, whether or not the row exempts anything, and the run exits 1.
- **For #108, from the ledger's text:**
  - Round 18 item 4's typed words name one removal only, the self-comparing no-loss test. It is not among the twelve.
  - Round 20 item 1's typed words name #108's twelve property tests as obsolete, and name the union design as the carrier.
  - So #108's rows read `ruling: round 20, item 1; carrier: round 18, item 4`.

## 3. Rider (b), mechanically

- **Every claim site the tool scans already relies on the test** (preregistrations and ADRs), so the carrier is required on every row. This is fail-closed.
  - The tool checks that the carrier is present and that it resolves with the same resolver.
  - The gate reads whether the carrier actually carries the evidence. This is disclosed.
- **Claims elsewhere stay findings without new code.**
  - A claim of the same name in another file stays a binding finding, because pins match the file's own path only.
  - A claim line with no row stays a finding too.
- **Outside the tool's reach:** PLAN.yaml acceptance text, the gate log and commit messages. The gate reads them. This is disclosed.
- **#108's carrier is the ruling, round 18 item 4**, not a section of #108's form.

## 4. AUTONOMY section 6a

One sentence, appended on the same line as section 6a item 3, as SUPERSEDED did. No line moves. The followups node's SKIPPED-branch clause edits the same line, so the two pieces run in sequence.

## 5. Scope and budget

- **Form: the full form of `docs/PREREGISTRATION-TEMPLATE.md`, not the five-line one.**
  - The human ruled the piece fully gated.
  - AUTONOMY section 21a gives full gating the full shape.
  - Section 6a's claimed-but-missing-fails rule is narrowed, which is a property under test.
  - Keep each section to a line or two (record cap).
- **Files:**
  - `scripts/plan/TEST-CLAIMS-WITHDRAWN-PREREGISTRATION.md`: new, and its own commit before any code;
  - `scripts/plan/verify-test-claims.mjs`;
  - `scripts/plan/verify-test-claims.test.mjs`: tests appended at the end;
  - `scripts/plan/README.md`: one paragraph after "The boundary";
  - `AUTONOMY.md`: section 6a item 3's line;
  - `scripts/plan/VERIFY-MUTATION-MULTILINE-ATTRS-PREREGISTRATION.md`: rows appended;
  - `PLAN.yaml`, with the generated queue and site.
- **Budget:** at most 280 insertions plus deletions over the three counted files (the .mjs, the test file and the README).
- **No exports.** The resolver stays module-private.
- **Tests, each with a recorded mutation:**
  1. `a_withdrawn_test_row_with_a_resolving_ruling_and_carrier_is_advisory_not_a_failure`. Mutation: remove the withdrawn branch in `runVerifyTestClaims`.
  2. `a_withdrawn_test_row_whose_ruling_does_not_resolve_fails_by_name`. Mutation: the resolver returns resolved for any round/item.
  3. `a_withdrawn_test_row_without_a_carrier_fails_by_name`. Mutation: skip the carrier-presence check.
  4. `a_withdrawn_test_row_whose_carrier_does_not_resolve_fails_by_name`. Mutation: check presence only.
  5. `a_withdrawn_test_row_also_marked_superseded_does_not_exempt_as_superseded`. Mutation: drop the precedence exclusion.
  6. `a_withdrawn_test_row_pinning_a_line_range_does_not_exempt`. Mutation: drop the single-line check.
  7. `a_withdrawn_name_claimed_in_another_file_stays_a_finding`. Mutation: drop the own-path match.
  8. `the_bare_word_withdrawn_on_a_pinned_line_is_not_a_withdrawn_test_row`. Mutation: relax the token to a bare word.
- **Proving it against the real shape:**
  - Test 1's fixture ledger uses the real RULED header and item line shapes, byte-copied by script from `DECISIONS-PENDING.md` at the base commit and marked.
  - The end-to-end proof is the PR's own governance CI with #108 set to done in the same PR.
  - Registered predictions: 15 withdrawn, 0 findings, and the superseded count unchanged from main.

## 6. #108's rows

- **Where:** appended at the end of #108's form, as one class-1 post-result amendment (round 15 (g)). References only.
- **When:** in the same PR, after the tool commits. #108's node flips to done in that PR.
- **How many:** five rows, one per claim line, each covering every name on its line. The architect counted the claim lines at 708e361 as 17 (3 names), 39 (7), 45 (1), 61 (3) and 63 (1): 15 sites, 12 names. The worker confirms the count by running the tool.
- **Pin:** the branch's merge-base on main, as a full 40-hex SHA (`git merge-base HEAD origin/main`). Never a branch commit and never the HEAD default (round 15 (e)). It must be a commit the citing commit does not create (round 14).

## 7. Risks

- **Not a fifth governance mechanism.** This is a tool change the human ruled (round 20 item 1). It is kept minimal:
  - one token;
  - one private resolver;
  - SUPERSEDED's pin code reused by parameter;
  - no new amendment class and no new gate clause;
  - neither semantic half mechanized.
- **Disclosed, not fixed here:** a removal marked `superseded` still passes the tool. That is a weekly-window finding at most.
- **The ledger's RULED-block format.** The tool now depends on it. A reformat fails by name.
- **Ordering.** `test-claims-landedness-bound` and `governance-test-claims-superseded-followups` follow this piece, never run in parallel with it.

## Custodian's notes

1. **The rider's "or entry id".** The human's rider (a), round 20 item 1, names both citation forms, so the resolver also accepts an entry citation, `entry K`. It resolves when DECISIONS-PENDING.md has a line starting `K. **[RULED`. It comes with one test and a recorded mutation. The consult offered this as the custodian's reading.
2. **The consult's gate-log index note, given elsewhere, is not carried here.** Zero-based JSON array index 173 is PR #116's architect attempt 2, verified by `JSON.parse`.
