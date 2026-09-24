# verify:test-claims WITHDRAWN — preregistration

- Title: the `withdrawn-test` marker for `scripts/plan/verify-test-claims.mjs`.
- Authority: PLAN node `governance-test-claims-withdrawn-marker`; DECISIONS-PENDING.md round 20, item 1 (entry 134); design: `state/consults/2026-09-24-withdrawn-marker.md`, tracked on main at 90de3e9.
- Drafted by: the custodian's dispatched worker, from the consult and the brief, read at `main`/branch base 90de3e9 (`git merge-base HEAD origin/main`).
- Committed before any code, per docs/PREREGISTRATION-TEMPLATE.md's header rule.
- Append-only once committed; a post-outcome amendment says so in its first line.

## §0. Disclosure

Informed entirely by the architect's consult (`state/consults/2026-09-24-withdrawn-marker.md`) and the human's round-20 item-1 ruling. No pilot, spike or corpus beyond the repo's own tracked files. No fixture-drive confound (no measurement).

## §1. What this preregistration may and may not claim

No performance number, no docs/08 row, no duration or cancellation-vocabulary drift, no wire change. No ADR is amended. This piece amends `AUTONOMY.md` §6a item 3 by one sentence and `scripts/plan/README.md`'s boundary section by one paragraph, both by reference/consult, not by new wording of the human's own strings.

## §2. The rule / the change — stated before it is applied

A new token, `withdrawn-test`, is recognized on a hash-pinned reference line inside a preregistration or ADR (a document `verify-test-claims.mjs` already scans). A claim (a test name in the current tree with no matching test) whose line is covered by such a reference is advisory ("withdrawn"), not a binding finding, only when: (a) the pin's five SUPERSEDED conditions all hold, checked against the `withdrawn-test` marker instead of `superseded`, with the pin restricted to exactly one line (a range refuses); (b) the same line also carries `ruling: round N, item M` (or `entry K`) and `carrier: round N, item M` (or `entry K`), each resolved once against the current tree's `DECISIONS-PENDING.md` — a `round N, item M` citation resolves when a `**RULED ... — question round N` header line exists and a `- *Item M —` line sits inside that block before the next `**`/`## ` boundary; an `entry K` citation resolves when a line starting `K. **[RULED` exists. Missing or unresolvable ruling or carrier leaves the claim binding (a finding), never withdrawn. Precedence: a line carrying `withdrawn-test` is never also read as a `superseded` line, so a row failing its riders cannot fall back to exempting via SUPERSEDED. **§2's reason for the longer token** (per the consult's Row grammar section): a bare `withdrawn` would collide with existing round-15(g) withdrawal rows in `engine/LOD-RELEASE-GUARD-PREREGISTRATION.md` and `engine/ADMISSION-PREREGISTRATION.md`, turning main red; `withdrawn-test` is unused anywhere in the tree today and is matched with no word/hyphen character adjacent, case-sensitive.

## §3. Fixtures / corpus — pre-declared outcomes

No corpus fixture; unit fixtures only (see §4). `node scripts/plan/verify-test-claims.mjs` at HEAD with PLAN node `governance-verify-mutation-multiline-attrs` set to `done` and its withdrawn rows in: predicted 15 withdrawn, 0 findings, superseded count unchanged from main.

## §4. Tests, and the mutation per new test

Nine new tests in `scripts/plan/verify-test-claims.test.mjs`, appended at the end, each with a RECORDED MUTATION comment applied for real and reverted (see the eight named in the consult §5 plus one for the custodian's entry-citation branch, note 1):

1. `a_withdrawn_test_row_with_a_resolving_ruling_and_carrier_is_advisory_not_a_failure`
2. `a_withdrawn_test_row_whose_ruling_does_not_resolve_fails_by_name`
3. `a_withdrawn_test_row_without_a_carrier_fails_by_name`
4. `a_withdrawn_test_row_whose_carrier_does_not_resolve_fails_by_name`
5. `a_withdrawn_test_row_also_marked_superseded_does_not_exempt_as_superseded`
6. `a_withdrawn_test_row_pinning_a_line_range_does_not_exempt`
7. `a_withdrawn_name_claimed_in_another_file_stays_a_finding`
8. `the_bare_word_withdrawn_on_a_pinned_line_is_not_a_withdrawn_test_row`
9. `a_withdrawn_test_row_citing_an_entry_id_instead_of_round_item_resolves` (custodian note 1)

## §5. Registered predictions · declared unchanged · invalidators · falsification

Predicted: 15 withdrawn, 0 findings, superseded count unchanged from main, once PR #108's five rows land and its node is set to done in this same PR. Declared unchanged: the SUPERSEDED mechanism's own behaviour and test count. Invalidator: the tool export surface changes (none is added — no exports). Falsification: any of the nine tests above cannot be made to fail by its recorded mutation.

## §6. Instruments

All nine tests are assertions (structural: exempt/finding classification), not measurements. The 15/0 prediction in §3 is an assertion against `runVerifyTestClaims`'s own counted arrays, not a docs/08 number.

## §7. Declared values and ceilings

Budget: <= 280 insertions plus deletions over `scripts/plan/verify-test-claims.mjs`, `scripts/plan/verify-test-claims.test.mjs` and `scripts/plan/README.md` combined (§21c's counting rule), the smaller of the choices the consult left open (the consult's own stated budget). Marker token: `withdrawn-test` (§2). Row shape: one pinned line per row, ruling and carrier each `round N, item M` or `entry K`.

## §8. Block-on-sight

1. Any export added from `verify-test-claims.mjs`.
2. A `superseded` line silently also matched as `withdrawn-test` (precedence violated).
3. A withdrawn row exempting without both riders resolving.
4. `PLAN.yaml` regenerated with CRLF line endings.

## §9. Gates

- **Architect/Reviewer** (full gating, per the human's round-20 item-1 ruling): the consult's design followed exactly; no fifth governance mechanism; SUPERSEDED's pin code reused by parameter, not copied.
- **Suites**: `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` green.
- **Self-checks**: `verify:test-claims`, `verify:cites`, `verify:quotes`, `verify:mutation`, `verify.mjs --offline`, `queue.mjs --check`, `site.mjs --check`.
- **Operator**: none (no user-visible surface).

## §10. Amendments — opens empty, append-only

**Amendment 1 — budget deviation (class 6), Scope not edited.** Declared budget (§7): <= 280
insertions plus deletions over `verify-test-claims.mjs`, `verify-test-claims.test.mjs` and
`README.md`. Final figure (`git diff --numstat origin/main...HEAD` on those three files, this
commit): 418 (mjs 166+28, test 216+0, README 8+0). Reason: nine tests each need their own git-tree
fixture (a temp repo per test, matching this file's existing SUPERSEDED-test style) plus the
riders'-mechanics code (two resolver functions, two regexes, the generalized `markedSpans`); the
§7 figure did not anticipate the per-test fixture cost. The §7 line is not edited to match.
