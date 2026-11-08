Reviewed: PR #302 at 10b695f92925b11ac5a4b911c9bdd9e9039c5c40 (base 75390735), gate 1, architect

Verdict: PASS WITH NOTES

(`cut/clippy-deny-warnings-workspace-12b @ 10b695f92925b11ac5a4b911c9bdd9e9039c5c40`.) All the prose below is mine, the architect's. Text in backticks is byte-copied from my Read results. I have no shell, so I cannot show the packet's sha256 (12ef5bc1…). I leave no background shell. I ran no cargo, no git and no hash. For base-side reads I used the main checkout's working tree: the packet says no product path changed on main since 75390735.

## Findings by class

**Correctness:** none.

**Evidence:** none at this gate. My Evidence reading rests on the worker's raw outputs and the hashes the report and packet give. The re-runs at the head (the full suite, clippy JSON and -D, digest B/H, M9, the six guard runs) are the reviewer's under Part 1 item 9. I cannot take them.

**Documentation (must fix before the merge; it does not fail the gate):**
- **D1. N5's "stay true" is not true of one of the three pins it names.**
  - Requirement: a record sentence states what the tree holds (the proportional-gates paragraph; Part 1 item 1's clause check applied to a record claim).
  - Evidence: N5 says the in-code cites into these files "point above every insertion and stay true". `engine/src/lod.rs:171 @ 10b695f9…` reads `/// (`engine/tests/import_layout_5gb_fixtures.rs:68`), restated rather than re-derived.` It sits under a doc about "the shipped granularity". Line :68 is `const CELL_M: f64 = 40.0;` at the head (engine/tests/import_layout_5gb_fixtures.rs:68 @ 10b695f9…) and at the base. The granularity is `const SHIPPED_GRANULARITY: usize = 8_192;` at :69.
  - The other two pins (engine/tests/lod_tier_measurements.rs:46 and engine/tests/lod_tier_builder.rs:1367 @ 10b695f9…) name :132, the doc line of `MIN_FREE_BYTES`. That holds.
  - The off-by-one was there before this PR. 12b does not cause it, and engine/src is outside the Scope, so nothing in code changes.
  - Closure, the smallest text under the record cap: one line in the PR body (or one appended amendment row, the custodian's choice). My words, not the human's: "N5's pins: lod_tier_measurements.rs:46 and lod_tier_builder.rs:1367 name import_layout_5gb_fixtures.rs:132, `MIN_FREE_BYTES`'s doc line, at the base and the head; engine/src/lod.rs:171 names :68, which holds `CELL_M` at both, while the granularity it describes is `SHIPPED_GRANULARITY` at :69; 12b moves none of the three, and lod.rs is outside its Scope."
  - Clause check of my words: "name …:132, MIN_FREE_BYTES's doc line" matches :132, the `///` line above `const MIN_FREE_BYTES` at :133. "lod.rs:171 names :68" matches the cite text. ":68 holds CELL_M at both" matches the head :68 and the base :68. "SHIPPED_GRANULARITY at :69" matches both. "12b moves none" holds: the fixtures file's first insertion is at :337, below all three targets. "outside its Scope" holds: Scope lists seven engine/tests files.

**Notes (preferences, no acceptance condition):**
- N-a. A fn-level allow is wider than the one statement it is for. The base run showed exactly one `assertions_on_constants` row in each of the six fns (report, base list), so at this head the allow hides nothing else. A later constant assertion added to these bodies would go unseen. The draft's section 3 chose form (i) knowing this.
- N-b. Row 11's trigger came from a pre-commit JSON run, not from "the head JSON run" in the Change line's wording. The committed head carries the fallback, and the head run lists 0 rows, so the claim's end state holds.

## Checks

**1. Out-of-scope categories: all four hold.**
- **ADR: none holds.**
  - No docs/ or ADR path is in the seven files (packet numstat).
  - ADR-021 does not name the campaign. A grep for "campaign"/"admission_property" in docs/adr/ADR-021-row-filter-on-viewport-query.md found none. The form calls the campaign "evidence for" that ADR's boundary, not ADR text.
  - Digests B and H are given equal: 380ed685…57af8, 2500 lines, 629323 B each (report "Digest H"; packet §4).
- **Security: none holds.** Test files only; no product file.
- **Wire: none holds.** No protocol path; rule (00) lists 0 protocol/ paths for this branch.
- **Guarantee: none holds.**
  - Each guard is byte-identical to the form's copied blocks, for example engine/tests/import_layout_5gb_digest.rs:396-399 @ 10b695f9…, and the same at the other five sites (below).
  - No assertion loosened and no test renamed: every fn name is unchanged at each site.
  - No `KNOWN_SHA256` or figure line is among the 14 hunks.
- **The five-line route:** 7 files and 23 lines, within §21c's 8 files and 150 lines. §36's setting aside of §25 (e) applies: governance/AUTONOMY.md:692 reads `§25 (e) set aside for it`.
- Round 25: no §7 overrun (23 of 60), so no class 8. No class 9 scope addition. No record calls a verify-mutation run an observation. No branch-commit test-text pin.

**2. Slicing: the reading holds.**
- The draft's 12b row (state/consults/2026-11-07-clippy-deny-warnings-workspace-form-architect-draft.md, section 1, the 12b row) gives rows 7-11 and 18-25 in the same seven files.
- The base run gave 13 raw and 13 distinct rows, all in the seven files and 0 outside, at N1's lines. The head gives 0 and 0 (worker report, "Base" and "Head runs").
- The -D run's stdout (`<S>/c12b-deny.txt`) shows only `Checking spatial-engine` and `Finished`, with no warning.
- So OPEN-D's red line is not reached. My count comes from the report's lists; I did not open the JSON.

**3. The allows.**
- Each is a bare item-level attribute with no comment, and the code under it is unchanged:
  - engine/tests/admission_p4_corpus.rs:363 @ 10b695f9…, `#[allow(clippy::large_enum_variant)]` above `enum Observed {`;
  - import_layout_5gb_digest.rs:394;
  - import_layout_5gb_fixtures.rs:337;
  - import_layout_digest.rs:460;
  - import_layout_fixtures.rs:246;
  - lod_tier_measurements.rs:252 and :486 (each @ 10b695f9…, `#[allow(clippy::assertions_on_constants)]`, directly above the `fn` line and after any `#[ignore]`).
- These six are form (i) of the draft's section 3: a fn-level allow, the guard byte-identical.
- `large_enum_variant` on `Observed` is a design, not a hidden defect:
  - It is test-local.
  - `open_and_observe` returns it by value, once per corpus row, and every consumer takes `&Observed` (admission_p4_corpus.rs:418, :483, :499, :569 @ 10b695f9…).
  - The lint is only about size and moves, and boxing would change the code for no benefit to the test.

**4. Row 9: fix with an observation.**
- At the head, the arguments are, in order: `r.pick(NUM_COLS)`, `r.pick(&["+", "-", "*", "/"])`, `num_lit(r)`, `r.pick(&["*", "+"])`, `r.below(5) + 1`, `r.pick(&["<", ">", "="])`, `num_lit(r)`, under `"({} {} {}) {} {} {} {}"` (engine/tests/admission_property_campaign.rs:270-279 @ 10b695f9…).
- This is the same order as the base's five arguments followed by the inner `format!("{} {}", r.pick(&["<", ">", "="]), num_lit(r))`.
- The scratch fn (`<S>/c12b-scratch-fn.rs`) replays :1069-1097 @ 10b695f9… exactly: the same four generators, seeds and case counts, and the same per-case draws in the same order, with `"<c>"` in place of the canary.
- So B = H shows that the seeded draws for G1-G4 are unchanged, rows 8, 10 and 11 included (G3 reaches `splice`).
- M9 (`{6} {5}` with the two arguments swapped) keeps the text order and reverses the draws. It differed on 2127 of 2500 lines. The first pair differs in operator and value (report, "M9").
- So the observation can see a draw swap that keeps the text order.

**5. Row 11: holds.**
- At the head the fallback reads `.rfind(|&b| b <= end)` (admission_property_campaign.rs:560 @ 10b695f9…). It replaces the base's `.filter(|&b| b <= end)` / `.last()` (base :559-560).
- On `Copied<slice::Iter>`, `rfind` returns the last element that passes. The closure is pure and reads only `end`, so the element is the same as `filter(..).last()`'s.
- No draw is in the chain; `r.below(8)` is unchanged at :556.
- The site is the same by name: the `let end = boundaries` statement in `splice`'s `_` arm. It is at :557 at the head against :556 at the base. Row 9 adds a net +1 line above it (its 3 insertions and 2 deletions).

**6. Owner's index: holds.**
- engine/README.md is not among the seven files.
- Its index (engine/README.md:539-567 @ 10b695f9…) names none of the seven files; a grep for the seven names found none. So no pointer's target moves.
- The pending preregistration-list line (:557) stays lead-data's.
- I could not read the PR body (see the gaps).

**7. N7 and N5.**
- The LOD-RELEASE-GUARD Change line is named and not edited: the form is not in the diff.
- N5's list in the seven files holds:
  - seeds and counts at admission_property_campaign.rs:67-79 @ 10b695f9…;
  - `Rng`/`pick` at :100-108;
  - every name, guard and message at the sites in check 3;
  - `ensure` writes `log.as_str()`, the same `&str` of the same `String` (import_layout_5gb_fixtures.rs:318, :326 @ 10b695f9…).
- The 23 numstat lines and 14 hunks are fully accounted for by the sites I read: row 7 +1; rows 8 and 10 1/1 each; row 9 3/2; row 11 1/2; rows 19-20 2/2; six allows +1 each.
- The three N5 pins are all above every insertion. The truth of one of them is D1.
- Records that cite lines below insertions in these files (for example governance/forms/engine/ADMITTED-INTEGER-OVERFLOW-SILENT-WRAPAROUND-PREREGISTRATION.md, kernel/RESULTS.md) are historical pins, as N5 records. After 12b the tree is authoritative.

**8. Comments.**
- No changed line is a comment or doc line. All 14 hunks are code or attributes, and the packet counts 0.
- No allow carries a comment, as N7 item 1 requires. The comment above row 7 (`// ---- What actually happened …`, :361) and the one at lod_tier_measurements.rs:246-247 were already there and sit where they did.
- No replacement words are needed.
- The guard quotes match: each `panicked at` line in the report matches its `<S>/c12b-guard-*.txt` file byte for byte, thread id included. The lines are :396, :339, :462, :248, :254 and :488, each the allow's +1 shift from the base.

## For the human

- None of my own. D1 is not the human's wording.
- OPEN-A to OPEN-D and OPEN-1 (A) were taken under the 2026-10-31 direction, item 4. They stand for the human's review on return, as the packet records.

## Packet gaps

- The PR body's text, needed for check 6 (known finding 2). The packet asserts it, and I have no gh.
- The exit codes of the guard runs and the -D run: the raw files carry no rc line, so rc 101 and rc 0 rest on the report.
- A per-row list of the base and head JSON counts from the counting script. The packet gives the files by hash only, and the brief left the JSON unread.
- The base text of the changed sites. I used the main checkout's working tree on the packet's word that product paths are unchanged since the base.
