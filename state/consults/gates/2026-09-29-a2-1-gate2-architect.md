*Custodian's filing note (2026-09-29): gate 2 (architect) of PR #143 for PLAN node `b1-close-nul-column-names`. Reviewed: cut/b1-close-nul-names-2 @ b4d7aa1 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message with the harness's two-space indent removed, and the text below the rule is the agent's. Its closing file list gives absolute paths, kept as the agent wrote them, all backslashes. Verdict FAIL, with blocking findings B1-B9. They go to correction round 2 together with the gate-2 reviewer's findings. It rules the SKP-V0 §9.1 dated note acceptable (re-check 3). Profile paths redacted at filing: none.*

---

Reviewed: cut/b1-close-nul-names-2 @ b4d7aa1 — **Verdict: FAIL**

Scope: PR #143, PLAN node `b1-close-nul-column-names`. The governing form is `engine/B1-PROJECTION-PREREGISTRATION.md` §10, Amendment 12. I read it in `C:\dev\wt\b1-close-nul-names`. I have no Bash, so I computed no hashes and ran no mutations. The reviewer's re-observation at b4d7aa1 is the observation of record. Code is cited by symbol and file. Nothing below quotes a governing document.

## Blocking findings

**B1. A failure the piece is meant to rule out was seen, then hidden by serializing the tests.**
- Where: `engine/tests/b1_projection_hostile_names.rs` module doc, and the `SERIAL` / `serial_guard` pair copied into `b1_projection_hostile_covering.rs`.
- What the doc says: run concurrently, an unrelated case's admitted SQL failed DuckDB's prepare with "nul byte found in provided data". The doc calls this a fragility below the admission logic, and the fix was to serialize every test in both files.
- Why this blocks:
  - The piece's guarantee is that no admitted statement ever carries U+0000 to DuckDB. This observation contradicts it.
  - It bears directly on §8 items 26 and 27 (`engine.query` from a query path) and on 12.3's invalidators.
  - The worker's report says no stop condition fired, and its §6 does not disclose this at all.
  - The doc's evidence, that "the printed text carried none", proves nothing. A raw NUL is invisible in Display output.
  - The doc names no commit, no test and no output for the positive observation, so the claim cannot be resolved (round 7).
- Required:
  - Reproduce it with the SQL printed in Debug form. Name the test and the commit.
  - If U+0000 reaches a prepare through engine code, stop and return per 12.3.
  - If a test-harness cause is proven, fix that cause.
  - Either way, remove the mutex and the unproven claim.
  - Candidates to rule out: the process-wide `INDEX_CACHE` and `ROW_GROUP_CACHE` in `engine/src/dataset.rs`, and the fixed `%TEMP%` paths shared across processes and worktrees.

**B2. The three control tests are no longer unchanged.**
- Each of `hostile_names_round_trip_to_their_own_columns`, `..._colliding_after_case_folding_...` and `..._an_uppercase_id_under_a_mapped_identity_...` gained `let _guard = serial_guard();`.
- 12.2 says they come along unchanged.
- The module doc's claim that they are unchanged since c37b427 is now false, and so is the same claim in `engine/src/fixture.rs`'s section comment (round 7). That comment also still calls the file's local `write` "richer" and says it serves only the control tests. Every N-test in the file uses it.
- This resolves with B1 if the mutex goes.

**B3. Two test comments claim an observation made on an uncommitted tree** (B8 of gate 1 is not fixed).
- The N-6 and N-15 doc comments say "Observed (gate-1 correction round 1, uncommitted on base 303dca0)". That names no commit whose tree was observed.
- Round 25, item 2 (c) and round 7 require the commit.
- The worker's whole mutation table (report §3) was made on the same uncommitted tree. It is not an observation of record.
- Fix: cite the gate-2 reviewer's observation at b4d7aa1 by its commit id. For N-6, the gate-1 reviewer's observation at 303dca0 also works.

**B4. N-14 still does not assert "before any lease".**
- `a_nul_covering_under_the_format_default_records_not_checked_with_the_true_reason` never compares `leases_issued`, for either p1a or p1b.
- The report says both N-13's and N-14's lease assertions were added at 6a366e2. For N-14 that claim does not resolve (round 7).

**B5. The fixture discipline is still incomplete** (B5 of gate 1).
- In `kernel/tests/skp_projection.rs`, the eighth case of `every_projection_refusal_is_synchronous_typed_and_pre_mint` writes `skp-projection-k2-refusals-hostile.parquet` and never hashes it.

**B6. N-3's "c02" is really c03.**
- `projectable_and_admission_agree_on_a_nul_named_column` writes `zone` before `zone\0x` and labels it c02, "E7's p2 shape".
- In the P0 output (`state/drafts/a2-1-p0/p0-output.txt`), c02 is `zone\0x` before `zone`. The order the test writes is c03.
- 12.2 names c01 and c02. Run the c02 order, or correct the form by amendment.

**B7. N-10's fixture is not E8's p3 file.**
- `b1_nul_native_id_scan_once.rs` writes the real `id` as `Int64`, because `HostileColumn { int: true }` becomes `Int64` in `write_hostile_names`.
- p3 (`state/drafts/a2-1-p0/extra-probe.rs.txt`) writes it as `UInt64`, and 12.2 asserts native identity on the `UInt64` `id`.
- Write `UInt64` and assert the type.

**B8. The instrument exemption's naming condition no longer holds** (round 5, item 4).
- The doc of `dataset::identity_verification_scans` names `admission_instruments.rs`'s test as its caller.
- N-10 and N-11 now call it too, and the doc does not name them. Add both.

**B9. Amendment 12 carries a hash reference at a branch commit** (round 15 (e)). I missed this at gate 1.
- 12.0's Reproducers line pins the reproducer file by sha256 at c37b427, on `cloud/wave2-A2`. That commit will never be on main.
- Fix: one appended correction of at most three sentences (round 12 (d)). It restates the reference in round 25, item 2 (d)'s words form: the commit named, no hash.

## Re-checks

**1. Gate-1 findings.**
- Architect B1 is fixed.
  - `addressability::not_addressable` is the one classifying function. It returns the typed `NotAddressableFact` (bound name, exported name, `nul_offset`), and `not_addressable_for_field` is its `Field` entry point.
  - Projection reaches it at one site, `attributes::check_geometry_and_identity`.
  - The other uses by name all reach it: `projectable` (through `admit_projection_column`), `predicate::filterable_column_type` (which `namespace_admit` and `filter_surrogate` go through), `dataset::check_geometry_column`, both identity arms at `admit_identity`'s single check before any SQL, `identity::candidate_identity_columns`, and the covering (`covering_not_addressable_reason`, called from `open_inner` and `sanity_check`).
  - My grep of `engine/src` for `'\0'`, `\u{0}` and `\x00` finds only `render_visible_escape`, `not_addressable`, and N-5's test assertions. There is no log macro in the engine.
  - The `addressability` module doc is true.
- Architect B2 is fixed: `ColumnUnknown`'s Display, publish's `From` arm, and the `IdentityUnusable`, `AttributeUnpublishable` and `ColumnNotFilterable` Displays all render names through `render_visible_escape`.
- Architect B3 is fixed.
- Architect B4 is fixed except for B4, B6 and B7 above.
- Architect B5 is fixed except for B5 above.
- Architect B6 is fixed: §9.5's heading reads "seven codes", and the branch-name mentions now name 19f37da.
- Architect B7 is fixed: `arrow.for_each(drop)` runs before the DESCRIBE prepare.
- Architect B8 is not fixed (B3 above).
- Reviewer B1–B6 are fixed except where B4 and B5 above apply.

**2. The form, re-read at b4d7aa1.**
- 12.1 (a)–(h) pass.
  - Note on (d): the table names `admit_projection_column` as projection's site. The real shared site is `check_geometry_and_identity`, which is my gate-1 prescription. The closing record should reference the helper.
- 12.3 passes on reading. Round-trip bytes are unchanged, because the render function is a no-op without U+0000 and no name that round-trips carries U+0000 (E1). The six variants' texts change only for inputs that carry U+0000, which item 34 orders.
- The invalidators are unresolved until B1 is settled.
- §7 passes. `EXPORTED_NAME_KEY` is `pub(crate)`, and `type_check` builds its fields fresh.
- §8:
  - Items 25, 28, 29, 32, 33 and 34 pass.
  - Items 26 and 27 pass on reading, pending B1.
  - Items 30 and 31 are for the reviewer to confirm, as at gate 1.
  - Items 1–24 are as at gate 1.
- Round 25, item 2:
  - There is no §7 overrun.
  - The class 9 amendment precedes the code.
  - No record calls a `verify-mutation` run an observation.
  - No class-3 test-text row exists.
  - The piece is not on a five-line form.

**3. Ruling on SKP-V0 §9.1: acceptable as a dated note.**
- The binding constraint in 12.1(g) is "dated notes only, nothing earlier rewritten". The note complies.
- It states only the literal that 12.1(f) declares and that the §8 entry already records. Without it, §9.1's present tense would be false after merge.
- It adds no wire fact, so it is not a class 9 addition.
- The §9.5 table row is 12.1(g)'s "§9.5 (the new row)".
- The closing record lists §9.1 by reference.

**4. Mutation claims in test text:** see B1 and B3. The N-16 and N-3 doc comments state the mutation and what it would do, but claim no observation. That is fine.

**5. Items beyond the form.**
- The two single-test files for N-10 and N-11 are acceptable. They follow `admission_instruments.rs`'s precedent and my gate-1 prescription, with B7 and B8 applying.
- The `N15Case` alias is acceptable.
- The fixture helpers stay acceptable: they are feature-gated test support, with B2's comment correction applying.
- `SERIAL` is not acceptable (B1).

## Notes (not blocking)
- N-16 fails its mutation only because the mutated detail lacks `\u0000`. Add an assertion that the detail does not contain "no such column", which would bind §8 item 27 directly.
- N-15 asserts that a field has some metadata, not `spatial.exported_name` specifically.
- `NotAddressableFact::nul_offset` has no product reader. The form orders it, so this does not block.
- N-13's kernel half covers k1 only. The engine half covers both k1 and k2. This is accepted.
- SKP-V0 §8, the conformance README and AMBIGUITIES A9 name 19f37da. The merge must keep that commit reachable, so the PR body should ask for a non-squash merge.

No decision is missing, so no ADR skeleton is needed.

Files:
- `C:\dev\wt\b1-close-nul-names\engine\src\addressability.rs`
- `C:\dev\wt\b1-close-nul-names\engine\src\attributes.rs`
- `C:\dev\wt\b1-close-nul-names\engine\src\dataset.rs`
- `C:\dev\wt\b1-close-nul-names\engine\src\identity.rs`
- `C:\dev\wt\b1-close-nul-names\engine\src\predicate.rs`
- `C:\dev\wt\b1-close-nul-names\engine\src\fixture.rs`
- `C:\dev\wt\b1-close-nul-names\engine\tests\b1_projection_hostile_names.rs`
- `C:\dev\wt\b1-close-nul-names\engine\tests\b1_projection_hostile_covering.rs`
- `C:\dev\wt\b1-close-nul-names\engine\tests\b1_nul_native_id_scan_once.rs`
- `C:\dev\wt\b1-close-nul-names\engine\tests\b1_nul_declared_identity_no_scan.rs`
- `C:\dev\wt\b1-close-nul-names\kernel\tests\skp_projection.rs`
- `C:\dev\wt\b1-close-nul-names\kernel\tests\publish.rs`
- `C:\dev\wt\b1-close-nul-names\protocol\skp\SKP-V0.md`
- `C:\dev\wt\b1-close-nul-names\engine\B1-PROJECTION-PREREGISTRATION.md`
- `C:\dev\spatial-ide\state\drafts\a2-1-p0\p0-output.txt`
- `C:\dev\spatial-ide\state\drafts\a2-1-p0\extra-probe.rs.txt`
