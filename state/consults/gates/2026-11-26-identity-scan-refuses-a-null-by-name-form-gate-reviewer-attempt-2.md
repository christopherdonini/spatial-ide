Reviewed: the form text r6-form-attempt-2.txt in the scratch folder, 30203 bytes, sha256 9d2c4653701707c5e79fcbdf08788bc8298f332dfce48eaa4632c38f012c076b, against the code in the read checkout D:/wt/read-1124f at 20ed759b71064079792541f2a76cf804a6c84bc1, read only. That text is lead-data's draft (`state/consults/2026-11-24-identity-scan-refuses-a-null-by-name-form-lead-data-draft.md`, its lines 10 to 345 at 7402b645: 28659 bytes, sha256 70b173b9) with ADV-2026-11-26-05 folded in by script (9 pairs, sha256 f76ec892). This is the custodian's filing note, 2026-11-26: the reviewer's form gate, attempt 2, node:identity-scan-refuses-a-null-by-name@form-gate-reviewer-2, under ADV-2026-11-26-03 item 2. Attempt 1, dispatched at 2026-11-24T11:02:22Z, is recorded as dispatched and not recovered; its result was not taken and not looked for. Attempt 2 was dispatched just before 2026-11-26T17:36:55Z (date -u after the call), with its brief byte for byte (brief-r6-form-gate-reviewer-2.md in the scratch folder, 4309 bytes, sha256 b77829f0). Its run, from its completion notice only (ADV-2026-11-26-02: no transcript opened, so no count by kind, no first or last time and no count of calls naming the main checkout): 55 tool uses, 612497 ms, 148085 tokens; model opus, by its definition's model line. The report lists its commands as read-only and says it opened nothing in the main checkout; with no transcript read, that is its own word. It handed back once, after 2026-11-26T17:43:50Z and before 2026-11-26T17:48:34Z (both from date -u), and no message was sent to it. The custodian wrote the report below through the Write tool from the hand-back message, with the harness's two-space indent removed. Verdict: PASS WITH NOTES; Documentation D1 to D10; gate-log row 909. Two lines of its list of files read carry the scratch folder's path. The custodian writes the profile segment there as `<u>`, as earlier filings do, because the profile-path scan refuses it, and changes nothing else. As handed back: 14197 bytes, sha256 d29c6123fe6526849e0710f241344a7ca75f9434455730ed5c05733a1805c603. As filed: 14187 bytes, sha256 6118b65fa79c22567b5ba5cabb231f5f7dd63f9f5df494e67ab4f048694e947b.

PASS WITH NOTES: form gate, reviewer, attempt 2, `identity-scan-refuses-a-null-by-name` (full form). Reviewed text: r6-form-attempt-2.txt, 30203 bytes, sha256 9d2c4653701707c5e79fcbdf08788bc8298f332dfce48eaa4632c38f012c076b (recomputed). Code read in the detached read checkout D:/wt/read-1124f @ 20ed759b71064079792541f2a76cf804a6c84bc1. There is no branch.

I found nothing that blocks under Correctness or Evidence. There are 10 Documentation findings, each to be fixed before the merge, with exact replacement pairs below.

**What I checked against the inputs**
- ADV-2026-11-26-05 (adv-26-05.md): 2420 bytes, sha256 377c313a…6a6f. Recomputed and matches.
- The draft on main is `git show 7402b645:state/consults/2026-11-24-identity-scan-refuses-a-null-by-name-form-lead-data-draft.md`. The whole file is 34033 bytes, sha256 f57aee76…c8c1. The brief's 28659 bytes and sha256 70b173b9…5e (recomputed) are for its lines 10–345 only, the text between `---FORM---` and `---END OF FORM---`.
- I diffed that slice against the reviewed text. The only differences are the Authority line for ADV-26-05, the renamed heading with its new intro paragraph, and the 13 lines that state the rulings: 15 new lines and 1 removed heading line. Nothing else changed, as the brief says.

## Correctness

None blocking.

**Every path:line I resolved at 20ed759b says what the form says it says.**
- `engine/src/dataset.rs`: `:2045-2050`, `:2063-2074`, `:2076-2087`, `:2088-2098`, `:2091-2095`, `:2100-2105`, `:2108-2149`, `:2122-2127`, `:2128-2147`, `:2041-2044`, `:2056`, `:78-86`, `:87`, `:2027-2028`, `:2030-2039`, `:1984-2011`, `:2264-2295`, `:2271-2275`.
- `engine/src/identity.rs:333-335`.
- `engine/src/error.rs`: `:151-156`, `:155-156`, `:163-167`.
- `engine/src/stream.rs:2670-2675`.
- `engine/src/fixture.rs`: `:574-581`, `:585-590`, `:754-770`, `:1236-1251`, `:1312-1319`.
- `kernel/src/skp.rs:2223-2237`.
- `kernel/tests/skp_admission_remediation.rs`: `:230-255`, `:253`.
- `kernel/src/project/mod.rs:818-832`.
- The two protocol fixtures.
- `formatRefusal.ts`: `:12-16`, `:34-40`.
- `AdmissionPanel.tsx`: `:34`, `:276-277`.
- `openProject.ts:84-87`.
- `reopenNotices.ts:100`.
- `engine/tests/identity.rs`: `:10-12`, `:105-136`, `:250-268`, `:295-325`.
- `engine/tests/admission_instruments.rs:13-23`.
- The e2e pins `:87-96` and `:487-501`.
- `engine/README.md`: `:539`, `:557`.
- ADR-016: `:58-61`, `:81-92`, `:161-164`, `:246`.
- The text-id form: `:65-75`, `:71`, `:75`, `:119-123`.
- The ADR draft: `:50`, `:54`, `:129`.
- The directive ADV-2026-11-16-06 `:25`.

Three pins land on different lines than the form says (D4, D5, D6), and one claim is attributed to the wrong ruling (D3).

**Clause check, W-1 and W-2 (ADV-2026-11-26-05 item 1).** Every clause is true. Nothing goes to the advisor.
- **W-1 "the column is null in {nulls} of {rows} rows": true.**
  - `{rows}` is `count(*)` (`dataset.rs:2046`), read as `count` (`:2122-2124`). It counts every row of `read_parquet`, and a row is a feature.
  - `{nulls}` = `count(*) − count(c)`, which counts exactly the null rows. It cannot underflow, because `count(*) ≥ count(c)`.
- **W-1 "so not every feature carries an identity": true.** A null row has no identity value. This is an engine fact and names no consequence elsewhere.
- **W-2 "the other {present} rows": true.** `present = count(c)`, the non-null rows, which are the rows other than the `{nulls}`.
- **W-2 "carry only {distinct} distinct values": true.** `count(DISTINCT c)` (`:2046`, read at `:2125-2127`) counts non-null values under standard SQL and DuckDB semantics.
  - No repository line shows that semantics; §0 rightly labels it a hypothesis.
  - It is proven at the head by T1 and T2. If `count(DISTINCT)` counted NULL, F-1 would give distinct 100 ≠ present 99, so W-2 would be emitted and T1's equality on W-1 would fail.
- **W-2 "so at least two of those features share an identity": true.** W-2 is chosen only when `distinct ≠ present`, and `distinct ≤ present` always, so `distinct < present`. By pigeonhole, two non-null values are equal.
  - W-2 needs `present ≥ 2`: if `present = 1`, then `distinct = 1` and W-1 is chosen. So "rows" and "those features" are plural in every reachable case.
- **The surrounding Display: true.** The Display at `engine/src/error.rs:359-364` is ``refused: `{}` cannot serve as stable feature identity — {detail}. Synthesizing…``. ADV-2026-11-23-36 item 2 removes its last sentence, and text-id's Amendment 2 item 3 carries that out. The rendered result reads well.
- The words are the advisor's, not the human's.
- Grammar nits I do not ask to change: "1 of 1 rows" and "only 1 distinct values". The second matches today's repeat detail, which the DUPKEY' step pins.

**Order and arms (ruled (A)).**
- The negative check, then the null check, then the repeat check. `min` skips NULLs, so F-6 keeps the negative detail.
- Once `nulls == 0`, `present == rows`, so the repeat check is reached exactly as today.

**Other claims I confirmed true.**
- Only the skip arm (`:2030-2039`) reaches the stream's null refusal, and no wire field reaches the skip. `skip_uniqueness_check` appears in no protocol or kernel source except as doc text (`kernel/src/skp.rs:1752`).
- No wire fixture pins the repeat detail. A search for `distinct values|share an identity` finds only the e2e DUPKEY' step.
- `IdentityMode` has no exhaustive match outside fixture.rs. The three matches in fixture.rs have `_` arms.
- `engine/Cargo.toml` has no `[[test]]` table, and dev-deps enable `fixture`, so the two new test files need no eighth file.
- `kernel/Cargo.toml:38` enables `fixture` for kernel tests, so K1 and K2 can write F-1.

## Evidence

None blocking.
- **§3:** every "today" and "after" prediction follows from the code above.
  - F-1: today 100 and 99, after W-1 with 1 of 100.
  - F-2: today 100 and 98; after, 99 present and 98 distinct.
  - F-7: `min` is NULL, so the negative check is skipped. Today it is the repeat detail with 100 and 0; after, W-1 with 100 of 100.
  - F-5: `DuplicateIds` writes 7 into every row (`fixture.rs:1239`), so distinct is 1.
  - F-6: Int32, row 1 = −1, so `min` is −1.
  - F-4: rows 0..99 fit all eight widths, so 100 verified rows and max 99.
- **§4:** every mutation fails its own test, and no red is a compile error. W-1 and W-2 are literals in the tests, and the fixture mode is present at the red commit.
  - M-1, M-2 and M-3 turn T1, T2 and T3 to the repeat detail or to W-1.
  - M-4 refuses F-4. That holds whether `probe_schema`'s DuckDB Arrow export (`dataset.rs:1115-1122`) keeps nullability or marks every field nullable.
  - M-5 gives F-5 `nulls = 1999`.
  - M-6 gives F-6 W-1.
  - M-7 makes T7's delta 2.
  - M-8 changes K1's code. Under M-8, K2 is refused, because text-id's `:73` passes `Query` through (d).
  - K2 is a valid guard: on text-id's head, F-1's repeat refusal already reaches (d) (`:71`).
- **§7:** 45+4+115+270+55+85+4 = 578 over 7 paths, against a ceiling of 650 over 7.
  - The file count has no slack. One forced extra file would be class 8.
  - fixture.rs at ~115 is tight. The 8-width enum needs `data_type`, `max` (`UInt64`'s maximum is not an `i64`) and `is_signed`, plus a pre-row refusal arm (D6). The 72-line margin covers it.
- **The claim "for each of the eight integer widths, native or declared".** The code supports it: the declared path runs the same scan. T3 proves eight widths natively but only one declared. D9 makes the evidence cover the claim.

## Documentation (must-fix before the merge; exact pairs, each old text once in r6-form-attempt-2.txt)

None of these sentences is the human's wording. They are lead-data's or the custodian's, so they are applied with no re-gate and listed in the PR body.

**D1. §9 item 2 forbids "fixture", which contradicts §2.6 and §3's new fixture mode.** §1 means a wire fixture.
- OLD: `2. A new `EngineError` variant, wire code, field, literal or fixture.`
- NEW: `2. A new `EngineError` variant, wire code, field, literal or wire fixture.`

**D2. §0 gets the count backwards.** The row count is n; the non-null ("distinct-eligible") rows are n−1.
- OLD: `gives n distinct-eligible rows but only n−1 distinct values`
- NEW: `gives a row count of n but only n−1 distinct values`

**D3. §8 attributes "never on the recovery offer's head" to ADV-2026-11-23-25 item 2.** That item's rule is that when two pieces share a file, the one that cannot start first is built on the other's head. It does not forbid the recovery offer's head. The prohibition is ADV-2026-11-26-05 item 11. "Does not wait for it" is ADV-2026-11-24-23 item 5, which applies ADV-2026-11-23-25 item 2.
- OLD: `This piece is never built on the recovery offer's head, and does not wait for it (ADV-2026-11-23-25 item 2).`
- NEW: `This piece is never built on the recovery offer's head (ADV-2026-11-26-05 item 11), and does not wait for it (ADV-2026-11-24-23 item 5, applying ADV-2026-11-23-25 item 2).`
- In the same way, the Authority line puts ADV-2026-11-24-23 item 5's application into ADV-2026-11-23-25 item 2, which names neither piece:
  - OLD: `  - ADV-2026-11-23-25 item 2: of this piece and the recovery offer, whichever can start first builds first.`
  - NEW: `  - ADV-2026-11-23-25 item 2, as ADV-2026-11-24-23 item 5 applies it: of this piece and the recovery offer, whichever can start first builds first.`

**D4. §2.2's "fifth" leaves the edited doc untrue.** The not-addressable refusal (`engine/src/dataset.rs:2019-2025`) is already an `IdentityUnusable`, and `error.rs:153-154` omits it. A rewritten "All five" would be false at the head. The ~4-line estimate holds within the margin.
- OLD: `It gains a null in the column as a fifth.`
- NEW: `It gains a null in the column, and names the not-addressable refusal it omits today (`engine/src/dataset.rs:2019-2025` @ 20ed759b), so the list is six.`

**D5. §0's row-group pin is a test, not the refusal.** The refusal is at `:518-526`; `:863` is `a_null_bearing_identity_column_refuses`.
- OLD: `(`engine/src/rowgroup.rs:863` @ 20ed759b)`
- NEW: `(`engine/src/rowgroup.rs:518-526` @ 20ed759b; its test at `:863`)`

**D6. §2.6 pins the fixture refusal to its doc comment and leaves out one arm.** `:558-563` is the doc; the refusal is `narrow_refusal` (`:643-656`), called at `:1151-1153`. That call site needs a new arm too.
- OLD: `as `NarrowInteger`'s writer refuses (`:558-563`).`
- NEW: `as `NarrowInteger`'s writer refuses (its doc at `:558-563`; `narrow_refusal` at `:643-656`, called at `:1151-1153`).`
- OLD: `- **Arms:** one each in `schema()` (`:754-770`), in the value match`
- NEW: `- **Arms:** one each in `schema()` (`:754-770`), in the pre-row refusal (`:1151-1153`), in the value match`

**D7. §2.1 does not say where the new aggregate goes, but declares the min/max reading unchanged.** Inserting `count(c)` at index 2 would move `row.get(2)` and `row.get(3)` (`:2136-2144`).
- OLD: `the count of non-null values, in the same `SELECT`.`
- NEW: `the count of non-null values, in the same `SELECT`, as its fifth column after `max`, so the min/max reads at indices 2 and 3 (`:2136-2144`) do not move.`

**D8. §1 points to the wrong section for the cancel test.** It is listed in §4 ("Existing tests…"), not §5.
- OLD: `The existing cancel test stays green unchanged (§5).`
- NEW: `The existing cancel test stays green unchanged (§4).`

**D9. §1 claims every width "native or declared", but F-3d tests one declared width.** Extending F-3d is a loop of about 5 lines, inside the margin. If you prefer to narrow the claim instead, that also closes the finding.
- OLD: `| F-3d | `NullBearing{UInt32, ParcelKey, OneNull}`, declared `parcel_key` |`
- NEW: `| F-3d | `NullBearing{w, ParcelKey, OneNull}`, declared `parcel_key`, w each of the eight widths |`

**D10. §0's list of what text-id changes leaves out the doc both pieces edit.** Text-id's §2 item 1 (`:75`) edits the `identity_verification_scans` doc (`dataset.rs:78-86`), which §2.1 also edits. The new text is two lines.
- OLD: `- Text-id's form names no change to the scan's SQL`
- NEW, line 1: `- The doc of `identity_verification_scans` (`engine/src/dataset.rs:78-86` @ 20ed759b) gains N-3's test (its §2 item 1, `:75` @ 20ed759b); §2.1 edits the same doc.`
- NEW, line 2: `- Text-id's form names no change to the scan's SQL`

## OPEN items, ruled, and the Authority line against ADV-2026-11-26-05

Items 1 to 11 are each stated truly. None is marked verbatim, and the intro says the ruling's own words govern.
- **Item 1:** matches, including "comes to me with words" and "with no mark".
- **Items 2 to 6:** each is (A). Item 6's four parts match the form's three bullets, where "walkthrough row and e2e step" counts as two parts.
- **Items 7 and 9:** match their source.
- **Item 8:** omits "Most of it is tests and the fixture mode; that is accepted". The omission is harmless.
- **Item 10:** "read that file" for the ruling's "read them" is fair. Text-id's Amendment 3 item 3 adds `reopenNotices.ts` to its Scope (form `:552`, `:577`).
- **Item 11:** matches.
- **Item 12** ("Nothing here is reserved") is not stated. Nothing turns on it.

Nothing in the form contradicts a ruling. The Status line, §2.4's mark and §9 item 5 agree with item 1. §1 and §7 agree with item 8, and §8 agrees with item 11 once D3's attribution is fixed.

**Files:**
- C:/Users/<u>/AppData/Local/Temp/claude/3eed48519155ece4/e5e9413a-53f6-4dd8-b414-c41d85a1b1d4/scratchpad/r6-form-attempt-2.txt
- C:/Users/<u>/AppData/Local/Temp/claude/3eed48519155ece4/e5e9413a-53f6-4dd8-b414-c41d85a1b1d4/scratchpad/adv-26-05.md
- D:/wt/read-1124f/engine/src/dataset.rs
- D:/wt/read-1124f/engine/src/error.rs
- D:/wt/read-1124f/engine/src/fixture.rs
- D:/wt/read-1124f/engine/src/rowgroup.rs
- D:/wt/read-1124f/governance/forms/frontends/TEXT-ID-OPENS-FOR-THE-SESSION-BY-ROW-POSITION-PREREGISTRATION.md

Runs: only read-only commands, all inside D:/wt/read-1124f or on the two scratch files: Read, `git show`, `git grep`, `git ls-tree`, `git cat-file`, `sed`, `grep`, `sha256sum`, `wc`, `diff`, `file`. I opened nothing in the main checkout, read no transcript file, and wrote no file.
