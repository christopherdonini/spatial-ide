# identity-scan-refuses-a-null-by-name: the attempt-2 settle, lead-data as the form's author (not a gate)

*Filed by the custodian: node:identity-scan-refuses-a-null-by-name@form-attempt-2-settle-lead-data. It is not a gate and gives no verdict. Both attempt-2 form gates passed with notes and Documentation findings only (rows 908 and 909). On three sentences their pairs overlap, so lead-data, as the form's author, settled them (AUTONOMY §31) and gave the final set of pairs. It was dispatched just before 2026-11-26T17:48:34Z (date -u after the call) with its brief byte for byte (brief-r6-settle-lead-2.md in the scratch folder, sha256 80891334). Its run, from its completion notice only (ADV-2026-11-26-02: no transcript opened): 21 tool uses, 213639 ms, 84469 tokens; model opus, by its definition's model line. It handed back once, before 2026-11-26T17:52:45Z (date -u after saving), and no message was sent to it. The custodian wrote the report below through the Write tool from the hand-back message, with the harness's two-space indent removed. The custodian then checked and applied the pairs by script (r6-apply-settle.mjs): all 19 pairs, in order; each old text occurs once in attempt 2 and once in the text as the earlier pairs leave it; the new texts of pairs 1 to 3, 6, 8 to 10, 12 and 18 occur in the reviewer's report and that of pair 19 in the architect's, as the settle says; the pairs as parsed, sha256 cf7866699247f96060d4ea072ac8ec4dee9d57bb6f6deb2609787cdc75c1ecea. The final text is 31123 bytes, sha256 e8cd57ff523b75fdcc2dac9cf350f7d4b6cfbaa5c6670d27e9f7f0b9f1616791; the form's commit files it. Filed below the rule byte for byte, nothing masked.*

---

Result: all three overlapping pairs are settled. The final list has 19 pairs in document order. Every old text occurs exactly once in r6-form-attempt-2.txt and still occurs once after the earlier pairs are applied. §7's estimate goes from ~578 to ~594 lines over the same 7 files, under the ceiling of 650 over 7, which stands.
Blocking questions: none.
Report path: state/consults/2026-11-26-identity-scan-refuses-a-null-by-name-form-attempt-2-settle-lead-data.md. I wrote no file, so the sha256 is the custodian's to compute when filing.

# Author's settle, form gates attempt 2: identity-scan-refuses-a-null-by-name (lead-data)

Node: identity-scan-refuses-a-null-by-name@form-attempt-2-settle-lead-data. Settled under AUTONOMY §31 by the form's author.

Inputs, all in the scratch folder:
- r6-form-attempt-2.txt (the brief's 30203 bytes, sha256 9d2c4653…076b; not recomputed, since I have no shell);
- adv-26-05.md;
- r6-form-gate-architect-2-report.md (A-D1 to A-D4);
- r6-form-gate-reviewer-2-report.md (R-D1 to R-D10).

Code read in D:/wt/read-1124f @ 20ed759b71064079792541f2a76cf804a6c84bc1:
- `engine/src/dataset.rs:2015-2149`
- `engine/src/error.rs:145-169`
- `engine/src/rowgroup.rs:514-529`, and its null hits
- `engine/src/fixture.rs:545-659` and `:1140-1159`
- `engine/README.md:533-562`
- `kernel/README.md:357-369`
- the text-id form `:520-569`, and its hits for `identity_verification_scans`, N-3 and N-S
- ADV-2026-11-23-25's filed directive

**Old-text check.** Every old text in both reports occurs exactly once in r6-form-attempt-2.txt, A-D4's and R-D7's included. I checked each one with Grep -o and none is missing or duplicated.

## The three overlapping pairs

**A-D1 and R-D7: where `count(c)` goes. Settled into one pair (item 7 below).**
- Both gates ask for the same fix: put the new aggregate after `max` so that the fixed `get(2)` and `get(3)` reads do not move.
- I checked the reads at 20ed759b:
  - `get(2)` is at `:2136` and `:2140`;
  - `get(3)` is at `:2136` and `:2143`;
  - the map_err for the max read ends at `:2144`;
  - `:2145` is the conversion, not a read.
- The pair uses the architect's longer old text, which anchors on "gains", and the reviewer's range `:2136-2144`. The new text names both "index 4" and "after `max`".

**A-D2 and R-D1: §9 item 2's "fixture". Settled as A-D2, byte for byte (item 19).**
- A-D2 covers everything R-D1 does.
- It also qualifies "field" as a wire field. That matters because §2.6's new `IdentityMode::NullBearing { width, column, values }` has fields, and a bare "field" could be read as forbidding them.
- Its parenthetical removes the clash with §2.6 explicitly.
- R-D1 is not applied.

**A-D4 and R-D9: §1's claim for declared widths. Settled as R-D9, byte for byte (item 12), with the estimate pairs 5 and 13 to 17.**
- I chose to test the claim in full rather than narrow its words. The extra test costs about 5 lines, and the margin covers it.
- A-D4 is not applied. Once F-3d covers all eight widths, its new words ("T3 opens each width natively and `UInt32` declared") would be untrue.
- The reviewer says either route closes the finding. The architect's own reading, that the declared path reaches the same type check and scan, holds for every width the new fixture enum carries.

## Other pairs: what I changed and why

**Taken byte for byte:** R-D2, R-D3 (both pairs), R-D4, R-D5, R-D6 (both pairs), R-D8 and A-D3.

What I verified:
- R-D3: ADV-2026-11-23-25 item 2 names neither piece, and ADV-2026-11-26-05 item 11 says "never on the recovery offer's head".
- R-D4: the not-addressable refusal at `dataset.rs:2019-2025` is an `IdentityUnusable` that `error.rs:153-154` omits.
- R-D5: the refusal is at `rowgroup.rs:518-526`; `:863` is the test.
- R-D6: `narrow_refusal` is at `fixture.rs:643-656` and is called at `:1151-1153`, an `if let` on `NarrowInteger` only, so the new mode needs its own arm there.
- A-D3: the README's "Last verified at" line is at `:537`.

**Not byte for byte: R-D10, settled (item 4).**
- The reviewer's new line says the doc "gains N-3's test".
- That is text-id's §2 item 1 at `:75` as first written. Text-id's Amendment 3 item 2 (E2, `:537`) replaces the two lines on `identity_verification_scans`, and its item 4 table (`:566`) gives "the counter's doc naming N-S".
- This form reads text-id's form "with its Amendments 2 to 6" (§0), so the line names both, by pointer.

## §7 figures after the pairs

| path | from | to | why |
|---|---|---|---|
| `engine/src/error.rs` | ~4 | ~8 | R-D4 adds two failures (null and not-addressable) to the doc's four-item sentence at `:153-156`. Rewrapping it is about 4 deletions plus 4 insertions by numstat. |
| `engine/src/fixture.rs` | ~115 | ~120 | R-D6 adds the pre-row refusal arm at the call site `:1151-1153`. |
| `engine/tests/identity_null_refusal.rs` | ~270 | ~275 | R-D9 makes F-3d loop over eight widths. |
| `engine/README.md` | ~4 | ~6 | A-D3 adds a third in-place line edit (`:537`, `:539`, `:557`), each one insertion plus one deletion. |
| **total** | ~578 | ~594 | |

- The file count is unchanged at 7.
- The ceiling of 650 lines over 7 files stands.
- The error.rs and fixture.rs rows follow from byte-for-byte gate pairs, not settled ones. I re-estimated them because applying those pairs makes the old figures low. If the custodian wants only the settled pair's consequence (D9), drop pairs 13 and 14 and use a total of ~587 in pairs 5 and 17.

**New pins.** The new pins these pairs add also owe span hashes at the first commit, as the form's Drafted-by line says:
- `engine/src/dataset.rs:2019-2025` and `:2136-2144`
- `engine/src/rowgroup.rs:518-526`
- `engine/src/fixture.rs:643-656` and `:1151-1153`
- `engine/README.md:537`
- the text-id form `:537` and `:566`

## Final pairs, in the order to apply them

Each OLD occurs once in r6-form-attempt-2.txt. No NEW contains a later OLD. A "\n" in a NEW marks a line break; nothing else is added.

**1. Authority line (form line 10). R-D3, second pair, byte for byte.**
OLD:
```
  - ADV-2026-11-23-25 item 2: of this piece and the recovery offer, whichever can start first builds first.
```
NEW:
```
  - ADV-2026-11-23-25 item 2, as ADV-2026-11-24-23 item 5 applies it: of this piece and the recovery offer, whichever can start first builds first.
```

**2. §0 (line 29). R-D2, byte for byte.**
OLD: `gives n distinct-eligible rows but only n−1 distinct values`
NEW: `gives a row count of n but only n−1 distinct values`

**3. §0 (line 41). R-D5, byte for byte.**
OLD: ``(`engine/src/rowgroup.rs:863` @ 20ed759b)``
NEW: ``(`engine/src/rowgroup.rs:518-526` @ 20ed759b; its test at `:863`)``

**4. §0 (line 53). Settled from R-D10 (N-S per text-id's Amendment 3).**
OLD: `- Text-id's form names no change to the scan's SQL`
NEW, two lines:
```
- The doc of `identity_verification_scans` (`engine/src/dataset.rs:78-86` @ 20ed759b) gains text-id's scan-count test: N-3 in its §2 item 1 (`:75` @ 20ed759b), N-S after its Amendment 3 (`:537`, `:566` @ 20ed759b). §2.1 edits the same doc.
- Text-id's form names no change to the scan's SQL
```

**5. §1 (line 64). Settled (the estimate).**
OLD: `The estimate is about 578 (§7).`
NEW: `The estimate is about 594 (§7).`

**6. §1 (line 72). R-D8, byte for byte.**
OLD: `The existing cancel test stays green unchanged (§5).`
NEW: `The existing cancel test stays green unchanged (§4).`

**7. §2.1 (line 79). Settled from A-D1 and R-D7.**
OLD: ``gains `count("<c>")`, the count of non-null values, in the same `SELECT`.``
NEW: ``gains `count("<c>")`, the count of non-null values, in the same `SELECT`, as its last column (index 4, after `max`), so the `min`/`max` reads at `:2136-2144` keep indices 2 and 3.``

**8. §2.2 (line 98). R-D4, byte for byte.**
OLD: `It gains a null in the column as a fifth.`
NEW: ``It gains a null in the column, and names the not-addressable refusal it omits today (`engine/src/dataset.rs:2019-2025` @ 20ed759b), so the list is six.``

**9. §2.6 (line 162). R-D6, first pair, byte for byte.**
OLD: ``as `NarrowInteger`'s writer refuses (`:558-563`).``
NEW: ``as `NarrowInteger`'s writer refuses (its doc at `:558-563`; `narrow_refusal` at `:643-656`, called at `:1151-1153`).``

**10. §2.6 (line 163). R-D6, second pair, byte for byte.**
OLD: ``- **Arms:** one each in `schema()` (`:754-770`), in the value match``
NEW: ``- **Arms:** one each in `schema()` (`:754-770`), in the pre-row refusal (`:1151-1153`), in the value match``

**11. §2.7 (line 169). A-D3, byte for byte.**
OLD: `- Lead-data writes them at the merge.`
NEW, two lines:
```
- The **Last verified at** line (`:537`) gains the commit those two pointers are checked at, in its existing form.
- Lead-data writes them at the merge.
```

**12. §3 (line 180). R-D9, byte for byte (settled from A-D4 and R-D9).**
OLD: ``| F-3d | `NullBearing{UInt32, ParcelKey, OneNull}`, declared `parcel_key` |``
NEW: ``| F-3d | `NullBearing{w, ParcelKey, OneNull}`, declared `parcel_key`, w each of the eight widths |``

**13. §7 (line 264). Settled (estimate, from R-D4).**
OLD: ``| `engine/src/error.rs` | `IdentityUnusable`'s doc | ~4 |``
NEW: ``| `engine/src/error.rs` | `IdentityUnusable`'s doc | ~8 |``

**14. §7 (line 265). Settled (estimate, from R-D6).**
OLD: ``| `engine/src/fixture.rs` | §2.6 | ~115 |``
NEW: ``| `engine/src/fixture.rs` | §2.6 | ~120 |``

**15. §7 (line 266). Settled (estimate, from R-D9).**
OLD: ``| `engine/tests/identity_null_refusal.rs` (new) | T1 to T6 | ~270 |``
NEW: ``| `engine/tests/identity_null_refusal.rs` (new) | T1 to T6 | ~275 |``

**16. §7 (line 269). Settled (estimate, from A-D3).**
OLD: ``| `engine/README.md` | two pointers | ~4 |``
NEW: ``| `engine/README.md` | two pointers and the Last verified at line | ~6 |``

**17. §7 (line 270). Settled (the total).**
OLD: `| **total** | | **~578** |`
NEW: `| **total** | | **~594** |`

**18. §8 (line 278). R-D3, first pair, byte for byte.**
OLD: `This piece is never built on the recovery offer's head, and does not wait for it (ADV-2026-11-23-25 item 2).`
NEW: `This piece is never built on the recovery offer's head (ADV-2026-11-26-05 item 11), and does not wait for it (ADV-2026-11-24-23 item 5, applying ADV-2026-11-23-25 item 2).`

**19. §9 (line 296). A-D2, byte for byte (settled from A-D2 and R-D1).**
OLD: ``2. A new `EngineError` variant, wire code, field, literal or fixture.``
NEW: ``2. A new `EngineError` variant, or a new wire code, wire field, literal or wire fixture (§2.6's test-support mode is not a wire fixture).``

## Not applied
- A-D4: superseded by R-D9. Its new words would be untrue once F-3d covers all eight widths.
- R-D1: covered by A-D2.
- R-D7 as a separate pair: merged into item 7.

Nothing else in the form changes. None of these sentences is the human's wording, and W-1 and W-2 are untouched; both gates found every clause true.
