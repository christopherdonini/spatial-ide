Reviewed: PR #297 at f82adfc519a98f0b5160e1fd0625c471a466a1b2 (base 47da4d05), gate 1, architect

Verdict: PASS WITH NOTES

`cut/narrow-integer-id-unstreamable @ f82adfc519a98f0b5160e1fd0625c471a466a1b2`. I have no shell, so I cannot show the sha256 of the brief or of the packet. I leave no background shell. I re-ran no suite and re-observed no mutation (Part 1, item 9, and §9 item 8). Those are the reviewer's, and so is CI (§8 item 14). Everything below is my own words unless it is marked as byte-copied. Every cite is at f82adfc5 unless it says otherwise.

## Findings by class

- **Correctness:** none.
- **Evidence:** none.
- **Documentation (must-fix before the merge):** none.
- **Notes (not acceptance conditions):**
  - **N1.** §1's "each `id` equals its source value" is asserted as set equality plus a count of 100 (engine/tests/narrow_integer_id_stream.rs:153-158, :184-189; kernel/tests/narrow_integer_id_stream.rs:108-115). The pairing of each id with its own row is not asserted. The code does keep that pairing: each arm is an order-preserving `map` over `values()` (engine/src/stream.rs:2707-2736). So the code supports the claim, and §4 (v) preregistered exactly this assertion.
  - **N2.** M-1 was observed against E1 and K1 only, as §4 names (packet, known finding 2). E2's S3 row depends on the same arm, by reading.
  - **N3.** The type error at engine/src/stream.rs:2737-2740 still says the column "expected a 64-bit integer", though `column_u64` now accepts eight widths. That text is declared unchanged (§5; §8 item 2) and falls under P6. Ordinary use cannot reach it: admission refuses every type that has no arm (engine/src/identity.rs:333 against stream.rs:2674-2736). It is reachable only if DuckDB delivers a different Arrow type from the footer's (H-PRIM; P-0 saw plain types). For the human, as possible follow-up wording.
  - **N4.** OPEN-2 (A) says the custodian proposes a LOD node after port-2. I did not find one: I searched governance/PLAN.yaml and state/FILLER-QUEUE.md for lod and narrow terms, and that search is not exhaustive. See check 6.
  - **N5.** The ADR note's italic line cites the directive as "line 8", with no pin. It follows the precedent shape the settlement names (ADR-021's note of 2026-11-06 at docs/adr/ADR-021-row-filter-on-viewport-query.md:277-279). The directive is a filed, verbatim record, so that line is stable. Round 14's named failures (a bare self-line, a line cite into a file the same commit edits, a pin read as current) do not cover it, so this is not a finding.

## Check 1: §1's ADR-016 reading against the human's OPEN-1 answer

**Shape.**
- docs/adr/ADR-016-stable-feature-identity-admission.md:242 is the heading `## Note 2026-11-09`, which is the note's own date.
- :244 is the italic line naming the directive.
- :246 is the note.
- This matches the settlement (governance/forms/engine/NARROW-INTEGER-ID-UNSTREAMABLE-PREREGISTRATION.md:455 at main) and ADR-021's precedent.
- Nothing above the note changed. :1-240 end on the base's "Owed at acceptance" paragraph, identical to main's docs/adr/ADR-016-stable-feature-identity-admission.md:240. The numstat is 6/0 (packet §1), and the custodian's script found base plus the 751-byte append equal (packet §1).
- The only ADR text is the heading, the italic line and the human's span, so §8 item 7 holds as the settlement refines it. The bytes are the reviewer's to check by script. By eye, :246 matches the human's message, state/directives/2026-11-07-8g-open-1-b-adr-016-note-open-6-a-294-not-held-index-sites-narrowed-entry-13-x2-into-item-20.md:8.

**The built change against the note, clause by clause:**
- **"8-, 16- or 32-bit integer column named id":** the six arms, stream.rs:2707-2736. Admission's eight-type match is identity.rs:333.
- **"widen … without change":** UInt8, UInt16 and UInt32 go through `u64::from` (stream.rs:2707-2715). Int8, Int16 and Int32 go through `u64::try_from` per value, with no `as` (:2716-2736). E1 compares each width's ids to the written set at the top of range (engine/tests/narrow_integer_id_stream.rs:125-159). M-3 shows that reading UInt32 through i32 changes the ids (doc at :115-118).
- **"signed to signed and unsigned to unsigned":** byte-copied from ADR-016:246. A signed value is read as signed and is never reinterpreted as unsigned bits (`try_from`). The carried type is UInt64 for every width (E1 (iv), engine/tests/narrow_integer_id_stream.rs:83-88). Read for the value, it holds. Read for the carried type, it does not, because every width is carried unsigned. This is **for the human**, under "Anything for the human" below.
- **"Before … such a file opened and no stream carried it":** P-0 at 47da4d05 shows N1-N6 admitted and every stream failing after 0 rows (P-0's raw output, 8gw-p0-run1.txt:184-201).
- **"from that piece every width streams":** E1 covers N1-N6 and K1 covers Int32. Every stream entry point reaches the one id reader, stream.rs:1947, through `produce`. Publish and the projected stream rest on that reading only, as §1 says.
- **"Nothing else changes":**
  - the candidate list is still Int64 and UInt64 only (identity.rs:304);
  - the admission arm and the scan are unchanged (dataset.rs:2028-2087; dataset.rs is not in the diff);
  - the SQL is unchanged, and stream.rs's 49 added lines are all inside `column_u64`, :2688-2736;
  - the wire is unchanged.
  - Within the note's widths, a declared narrow column (D1) and the skip route (S0 to S3) also change. They now stream, or are refused with the negative detail (E1 at :161-189, E2 at :221-293). This is for the human, as below.

**§1's ADR readings at the head:**
- §2 is ADR-016:62-63.
- §4 and §5 are :70-92. The value-preserving widening is at :83, and the native verification at :87-88 is exercised: E1 asserts `VerifiedAtOpenFullFile` and `verified_rows` 100 (engine/tests/narrow_integer_id_stream.rs:144-149).
- §7 is :106-110. The largest narrow value is UInt32::MAX, below 2^53. `js_exact` is derived from `max_value` (identity.rs:276-278), and E1 asserts `max_value` (:150).
- The candidate list is :165-169, held by identity.rs:304.
- Amendment 1, item 6 is :234-236. Native and mapped identity still go through `admit_identity`'s full scan (dataset.rs:2041-2087).
- All of these hold.

**"May claim" and "May not claim".**
- What E1, E2 and K1 assert matches §1's "may claim" list. N1 applies to the per-row claim.
- E2 asserts that the negative detail contains "negative" (:263). The full text is the existing one, which `negative` builds (stream.rs:2704-2706, identical to :2683).
- None of the tests, comments or README pointers claims publish, the live projected stream, the indexed seam, LOD, the fixed-grid index, a non-primitive narrow column, macOS or the shell.

## Check 2: §8, items 1 to 13

1. **Holds.** The human answered at 2026-11-07T20:25Z (directive :3). Commit 1 is at 22:19:57Z (packet §1). The base form already holds the settlement that records #294's merge (governance/forms/engine/NARROW-INTEGER-ID-UNSTREAMABLE-PREREGISTRATION.md:458 at f82adfc5). P-0 precedes the code by the report's order and its first hold line (state/consults/2026-11-07-narrow-integer-id-unstreamable-worker-report.md:16-25, :124). The raw output carries no timestamp; see the packet's gaps.
2. **Holds.** There is no `as` in stream.rs:2707-2736. The three messages at :2669-2672, :2683 and :2737-2740 equal main's, at engine/src/stream.rs:2669-2691 at main.
3. **Holds.** No SQL, admission, scan or refusal detail is in the diff. identity.rs's +16/-1 is the unit test only (:359-382).
4. **Holds.** The new `pub` items `NarrowWidth`, `NarrowColumn`, `NarrowValues` and the variant are in fixture.rs:549-598. The module is gated at engine/src/lib.rs:109-110 and is enabled only as a dev-dependency (kernel/Cargo.toml:36-38; frontends/shell/src-tauri/Cargo.toml:78-83). lib.rs and the Cargo files are not in the diff.
5. **Holds.** The seven paths are in packet §1. lod.rs and index.rs are untouched.
6. **Holds by reading.** The existing arms stay `_ =>` (fixture.rs:1248, :1316, :767). The refusal and the narrow buffer touch only `NarrowInteger` (:1149-1151, :1245-1247). The fixture-hash tests passing is the reviewer's re-run.
7. **Holds.** See check 1.
8. **Holds for the clauses I read.** See check 5. The rest are the reviewer's.
9. **Holds.** E1, E2 and K1 contain no sleep, retry, timeout, watchdog, `#[ignore]` or `cfg`. The unit test only gained types.
10. **Holds.** Each mutation carries a `RECORDED MUTATION` line with the full commit id: E1 at :110-123, E2 at :217-220, K1 at kernel/tests/narrow_integer_id_stream.rs:28-31 and the unit test at identity.rs:362-364. Each fails where §4 predicted (report :55-62), and each revert was checked by sha256 (report :63-66). No `verify-mutation` run is called an observation.
11. **Holds.** P-0 ran on its own target, D:/wt-targets/8g (8gw-p0-run1.txt:181). Nothing from it was committed: the seven paths only, and porcelain empty (report :25). The hold lines are the shared machine holds, not a shared cargo target (report :123-131).
12. **Holds.** No DuckDB behaviour is stated in any changed comment. The form's version record is §0.6.
13. **Holds.** The rule (00) lists share none of the seven paths (packet §6).

## Check 3: §9 item 9's out-of-scope categories

- **ADR:** touched only by the note, in the human's words (check 1).
- **Wire:** none. Nothing is under protocol/ or kernel/src.
- **Security:** none.
- **Guarantee:** touched. ADR-016's identity contract is brought to the code at stream.rs:2688-2736.
- All four hold at the head.

## Check 4: the rest of the constitution

- **ADR-010 rule 2** (docs/adr/ADR-010-render-frames-origins-boundaries.md:33): the id is the source value, unchanged, so the indirection holds.
- **ADR-004:** the arms fill the same `Vec<u64>`. No comment claims zero-copy or any other copy property (stream.rs:2688-2702).
- **ADR-006:** open and stream are pure reads.
- **ADR-018:** no cancel path is touched. `column_u64` has no cancel logic, and the chunk loop is unchanged.
- No conflict with docs/01 or docs/09, and no perf claim (docs/08).

## Check 5: comments that state an ADR's rule or the identity contract

The rule-stating clauses at stream.rs:2688-2702, each against the code:
- **The widenings and their arms:** :2707-2736.
- **"same detail":** :2704-2706 against :2683.
- **Admission's scan, which the skip route returns before:** dataset.rs:2030-2039 runs before :2045-2087.
- **The wire has no field for skipping:** kernel/src/skp.rs:1728 and ADR-016:163-164. The only kernel uses are in tests, plus the publish and ceilings docs that state the same fact.
- **"Every type admit_column_type admits reaches a u64":** identity.rs:333 against stream.rs:2674-2736.
- **Any other type keeps the type error:** :2737-2740.

E2's doc says admission's scan reads the column's minimum (engine/tests/narrow_integer_id_stream.rs:209-215); that is dataset.rs:2046 and :2076-2087. The fixture doc (fixture.rs:549-561) states no ADR rule. Every clause is true, so I give no replacement words.

## Check 6: the packet's known findings 3 and 4

- **Finding 3:** `at b52522c3` (engine/README.md:537) is true, and it is the right form. The pointed-at test and the form exist at b52522c3 and are unchanged through f82adfc5. Commit 4 cannot name itself (round 14: a pin is at a commit the citing commit does not create).
- **Finding 4:** lod.rs:1371's "Unreachable through `Dataset`" is false for the narrow widths (lod.rs:1367-1379) and is out of scope under OPEN-2 (A). The app cannot reach it today: no product path calls `build_tiers` (round 8 precondition, as the form records at §0.3). Once the note is in force, that arm's message ("internal inconsistency … admitted with it as feature identity") would misreport a valid narrow-id file. So the proposed LOD node (N4) has to land before `build_tiers` gets a product caller (PLAN node `lod-tier-selection`). For the human and the custodian. It does not block this gate.

## Anything for the human

1. **ADR-016:246, "signed to signed and unsigned to unsigned".** This is the human's wording and red-line text, so I give no replacement words. The code widens a signed value as signed, refuses a negative one, and carries every width as UInt64. Read for the value, which is what your message says the sentence meant ("the number, not the storage width", directive :8), the sentence holds. Read for the 64-bit type, it does not. Leave it, or say which reading you meant.
2. **ADR-016:246's inner quote** writes `id` without the backticks that §2's text has (ADR-016:63). The meaning is unchanged; it is yours to keep.
3. **"Nothing else changes"** stands. Within the note's widths, a declared narrow mapping now streams (D1), and on the engine-API-only skip route, a negative narrow value now ends with the negative detail instead of the type error (S1 to S3).
4. **N3** (the type-error text) and **N4 with check 6** (the LOD node, before `lod-tier-selection`).

## The packet's gaps

- The time of the P-0 run against commit 1. The raw output carries no timestamp or commit id, so the base commit comes from the report alone.
- That base 47da4d05 descends from #294's merge, 95e89c10. I inferred it from the settlement being in the base's form.
- Whether OPEN-2 (A)'s proposed LOD node exists, and where.
- Where the precedent note is (ADR-021's note of 2026-11-06), for checking the shape. I found it myself.
