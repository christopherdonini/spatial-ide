*Custodian's filing note (2026-09-26): the architect gate's attempt-2 report for PLAN node `governance-test-claims-superseded-followups` at 761915c, filed as returned (extracted by script from the agent's hand-back; byte-identical). Everything below the rule is the agent's text. Its reduced record (the record cap's point (3)) is appended to the form as Amendment 4, byte-exact.*

---

**Verdict: PASS with notes.** The code and tests pass. Amendment 3's record still fails, and this is the piece's second record-correction round. So I have applied the record cap's point (3) (`state/directives/2026-09-18-record-cap.md`): the reduced text at the end of this report is my verdict's record. The PASS holds on the custodian appending it byte-exact. Read at `.claude/worktrees/test-claims-followups` @ 761915c. I had no Bash, so hashes, diffs, CRLF, suites and mutation runs are the reviewer's.

**1. B1–B6**
- **B1 — fixed.** The comment above `a_withdrawn_test_row_also_marked_superseded_does_not_exempt_as_superseded` in `verify-test-claims.test.mjs` now gives §2.1(a) (not in row position) as the reason.
- **B2 — fixed.**
  - Test 5 (`a_refused_withdrawn_test_line_names_its_unresolvable_ruling`) and test 19: both use §4's "riders are not read" mutation, written as the conditional `const riders = reason === undefined ? …`. The code line matches `computeWithdrawnRows`.
  - Test 8 (`a_pin_whose_rev_is_a_hex_named_branch_does_not_exempt`): the mutation `ok = resolved.startsWith(rev);` → `ok = true;` matches `revResolvesToCommit`.
- **B3 — fixed as named.** `markedSpans` no longer has `singleLineOnly`, and no longer returns `refLine`.
  - Residual, same class, not blocking (N1): `computeWithdrawnRows` still pushes `refLine: lineNo` into `validSpans` (mjs:625), and nothing reads it.
- **B4 — fixed.** `computeWithdrawnRows` sets `mainUnchecked` from `pin.mainUnchecked` (the `else if` branch), and `runVerifyTestClaims` ORs it into `withdrawnMainUnchecked`. `main()` prints the note whether or not `withdrawn` is empty.
- **B5 — fixed.** Every reference-shaped span in the test comments is contiguous on one line (round 15, item 1, clause (d)), including the two changed tests.
- **B6 — partly carried.**
  - Carried: Amendment 3's superseded index supersedes Amendment 2 item 1's bullets and withdraws Amendment 2 item 2's restatement.
  - Not carried: Amendment 2's first line still does not say it was written after results were seen. Item 5 of the reduced text covers this.

**2. Advisories**
- **A2 — applied.** The README's WITHDRAWN and Row-position paragraphs and `AUTONOMY.md` §6a item 3 (line 163) match §2.1, §2.2 and §2.8(e)/(f) and the code. Neither adds an obligation beyond round 22, item 3 and round 23, item 4.
  - Whether the change is one line in place (§8 item 4) is the reviewer's diff to check.
  - N5: the AUTONOMY sentence on row position cites round 21, item 2 and round 22, item 3, but not round 23, item 4, which is where row position comes from.
- **A4 (the pointers) — not fully applied.** N2: two code comments still point wrongly.
- **A6 (PLAN's punctuation) — cannot be resolved against my attempt-1 text.** That report was never filed; the gate log keeps only "advisories A1-A7". As read, the `PLAN.yaml` summary is one consistent double-quoted string in ASCII `--`, with no stray quotes. CRLF is the reviewer's check (§8 item 10).

**3. Tests**
- **`a_valid_row_with_condition_e_skipped_sets_withdrawn_main_unchecked`:** a fully valid row, no remote, and a claim that already exists, so the per-claim loop never asks. It asserts `withdrawnMainUnchecked === true`. Its mutation (drop the `else if (pin.mainUnchecked) mainUnchecked = true;` branch) matches the code. It proves §2.2(e)'s row-level skip about the shipped path, and `main()` is its product caller.
- **Test 17's narrowed mutation:** it drops only the `refused: rev not on main` return and keeps `const anc = …` and `mainUnchecked: !anc.checked`. That is still §4's "skip the row-level (e) check" (byte-matched): any reading of "skip" makes test 17 pass a row it should refuse. Narrowing only keeps it separate from the new test. Accepted.
  - N3: its comment says "the new item-1 test's own SKIPPED-branch proof", which points at nothing. It should name the new test.

**4. Amendment 3's record** (template §10, the record cap)
- **First line:** says it was written post-result. ✓
- **Superseded index:** present. ✓
- **Cites:** no line cite, no "discharged"/"done" clause. Its one quote ("skip the row-level (e) check") matches §4 byte for byte. ✓
- **Item 1 (your question) — the class-5 label is wrong.** Class 5 is a narrowing on a ruling or gate, with the ruling cited. The B3/B4/A4 code only makes the code do what §2 already registered. It needs no class of its own: the amendment is class 1 (round 15, item 1, clause (g)'s reading), so no new class goes to the human.
- **Item 4 (your question) — the class-2 label is wrong.** Class 2 needs a §3/§5 prediction the run missed. §5 P3 still holds, and §5's falsification covers new tests only; this test predates the piece. What changed is a claim in a test comment, which is class 3 by the template's round-14 test-text exception. Item 4's prose also restates that comment (record cap (1)).
- **Item 2:** class 4 covers comment-only fixes too (B1, B5), which are class 3.
- **Item 3:** "every recorded mutation in this piece's comments" does not match the file. Ten comments carrying this piece's §2.9 qualifiers still name 2c69c0b, a9a1f9d, 9bf9fc1 or 62e1769 with "no re-run" (e.g. the comments above `a_pin_whose_rev_is_not_an_ancestor_of_origin_main_does_not_exempt` and `a_ruling_citation_with_a_leading_not_does_not_resolve`).
- **Item 5:** docs rewording is not class 3, which only changes where something points.
- **Item 6:** a class-2 figure with no reason given.

**5. Red lines:** none. No ADR, no docs/01, no wire, no security change. The AUTONOMY edit is authorized by §1 under round 23, item 4.

**Notes** (none blocking; carry to `test-claims-landedness-bound`, the next piece in this file):
- **N1** — mjs:625 (`computeWithdrawnRows`, `refLine: lineNo`): the caller rule, the same class as B3. Fix: delete the line.
- **N2** — two comments in `verify-test-claims.mjs`:
  - The `computeWithdrawnRows` doc (mjs:583-584) cites "§5's invalidator" for why a grammar-refused row does not suppress the claim finding. The governing text is §2.1(c). Fix: cite §2.1(c).
  - The `runVerifyTestClaims` doc (mjs:745-747) says, under §2.1(b), that "a reference to another path or a range, is not a withdrawal attempt". That is wrong: such a row in row position is an attempt, and it is refused. Fix: cite §2.1(c) and delete that clause.
- **N3** — comment above `a_withdrawn_test_row_whose_rev_is_not_on_main_fails_by_name`: replace "the new item-1 test's" with the test's name.
- **N4** — comment above `a_pin_with_no_rev_does_not_exempt`: its last sentence points to a hand-back, not the record. Point to Amendment 4 item 3.
  - Optional class 4: a mutation that removes both the `COMMIT_ID_RE` guard and the `revResolvesToCommit` call in `findMarkedSpan` would make this test fail again.
- **N5** — `AUTONOMY.md` §6a item 3: add "round 23 item 4" to the row-position cite, on the same line.
- **N6** — `main()`'s note "accepted row above" prints even when no row is listed above it. Drop "above", or say the row is not listed.

**The reduced record** (byte-exact; append as the next amendment in §10):

```
### Amendment 4 — 2026-09-26 (UTC), written after gate attempt 2's results were seen (`state/gate-log.json`, node governance-test-claims-superseded-followups, attempt 2): Amendment 3 reduced to references (`state/directives/2026-09-18-record-cap.md`, point (3))

1. Amendment 3 is class 1, as its first line says; its item labels other than item 6's class 2 are withdrawn. Its test-comment changes are class 3 by the template's test-text exception and its mutation changes class 4, each observed failure in the RECORDED MUTATION comment above the named test in `scripts/plan/verify-test-claims.test.mjs` @ 8fb4999, each superseded span its commit's parent's bytes. Its code and docs changes apply §2 and carry no class.
2. Amendment 3 item 3 covers the RECORDED MUTATION comments that name 7400dac @ 8fb4999; a comment naming an earlier commit keeps §2.9's no-re-run qualifier.
3. Amendment 3 item 4 is superseded by the comment above `a_pin_with_no_rev_does_not_exempt` @ 8fb4999 (class 3, item 1).
4. Amendment 3 item 6's growth over Amendment 2 item 2's figure is the fix round f6ccfd2..8fb4999 (class 2's reason).
5. Amendment 2 was written after the results Amendment 1 item 2 records; its first line omits that.

Superseded index: Amendment 3 items 1–5's class labels, by item 1; Amendment 3 item 3's scope, by item 2; Amendment 3 item 4, by item 3; Amendment 2's first line, as to when it was written, by item 5.
```

**Gate-log note:**
@ 761915c (fix round f6ccfd2..8fb4999): B1 B2 B4 B5 fixed; B3 fixed as named, residual unread validSpans.refLine (N1); B6 carried except Amendment 2's first line; new row-level (e)-skip test and test 17's narrowed mutation accepted; Amendment 3 fails the record (class 5/2/3 mislabels, item 3 overbroad, item 4 restates its comment), second round, so reduced by the architect to Amendment 4 (byte-exact text in the report), which the custodian appends; notes N1-N6 carried to test-claims-landedness-bound; A6 unresolvable, attempt-1 text not filed; no red line.

Files: `C:\dev\spatial-ide\.claude\worktrees\test-claims-followups\scripts\plan\verify-test-claims.mjs`, `...\scripts\plan\verify-test-claims.test.mjs`, `...\scripts\plan\TEST-CLAIMS-FOLLOWUPS-PREREGISTRATION.md`, `...\scripts\plan\README.md`, `...\AUTONOMY.md`, `...\PLAN.yaml`, `C:\dev\spatial-ide\state\gate-log.json`.
