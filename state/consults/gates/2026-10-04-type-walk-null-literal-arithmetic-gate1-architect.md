*Custodian's filing note (2026-10-04): PR #170's gate 1, the architect, for PLAN node `type-walk-null-literal-arithmetic` (node 10), under the tag node:type-walk-null-literal-arithmetic@g2. Reviewed: cut/type-walk-null-literal-arithmetic @ c6809d0c2a56aebca951b9a018e547c499cb611d (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It arrived as a message and is extracted here mechanically from the session transcript's copy of the hand-back, with the harness's two-space indent removed. Its sha256, from this file's line 5 to the end, is 481a1f01bbfc8686b30642940b04a39ece7e7f28f01505702bd3bfe26e7cdfe5. Write audit PASS: zero write calls (Read 15, Grep 25, Glob 3). C3 clean: before 09:23:50Z, after 09:29:17Z; main is at d55458c5 at both, and the worktree is at c6809d0c with an empty porcelain at both. The parallel guardian Amendment 4 draft (also an architect run) made no writes either. Profile paths redacted at filing: none.*

---

Reviewed: cut/type-walk-null-literal-arithmetic @ c6809d0c2a56aebca951b9a018e547c499cb611d

# Gate 1, architect: type-walk-null-literal-arithmetic (PR #170, node 10)

**Verdict: PASS.** I found no S1 and no S2. There are four N findings, none of which blocks.

**How I read it.** I read the worktree `C:/dev/wt/null-literal` file by file. I have no Bash, so I could not confirm HEAD or produce a diff myself. Two things tie what I read to c6809d0c: worker report 2 says the tree is clean at that pushed tip, and I matched the deletions by hand against main. The six deletions in the test file are the six count and doc lines (main's `engine/tests/filter_type_admission.rs` lines 186, 931, 1044, 1045, 1084 and 1103, read at d55458c5). No B-T3 row moved. Unless a line says otherwise, worktree line numbers below are read at c6809d0c. Main files are read at d55458c5. Nothing below is a quotation. Every sentence is my paraphrase.

## Checklist (form §9, Architect)

**§8, item by item**
1. Code before the form, or O-2 code before its ruling: holds. The binary marked-partner disjunct landed in c6809d0c, after round 45, item 1. The unary carry existed at c66b7a06, but §2.4 (i) declared it as the default with no code either way. It is a consequence of the §2.3 field and not O-2 code. The worker's pre-ruling probe of the C47 shapes was a throwaway test, reverted and never committed (report 1, the section on what is left for O-2).
2. A new reason, wire value, sentence or Display: none. `TypeRefusalReason` and `wire_value` are untouched, and no string was added.
3. A diff under kernel/, protocol/, frontends/ or renderer/, or any ADR-021 or SKP-V0 edit: none on my read. Both worker reports say the stat command prints nothing. The reviewer re-shows it as §9 requires.
4. B-T3 predictions edited, or B-T1 weakened: neither. C1 to C38 are unchanged (above). Part 3 is 332 and the total 9,714, at lines 1162-1167 and 1184 of the test file. B-T1b still asserts 2,083 at predicate.rs line 3202.
5. An arithmetic pair admitted beyond §2.5(a) plus §2.1: no. The only new admission is NULL with NULL (predicate.rs lines 2031-2035).
6. The flag set other than from both operands, or bounds on `/`: holds. The binary arm takes the conjunction (line 1977), and `type_of_division` is unchanged.
7. Misuse of the field: holds.
   - Every constructor and every `literal_typed` arm sets it false (lines 1508, 1518, 1736-1789).
   - The set condition requires a NULL-typed partner and either a within-bounds decimal literal or an already-marked result (lines 1968-1975).
   - The three comparison reads are at lines 2124-2129, 2132-2138 and 2243-2247.
   - A result over an out-of-bounds literal is never marked.
   - The result is never retyped as NULL.
   - On the fourth textual read, see N2.
8. A file value or another module's consequence: none.
9. A new `pub` item: none. The field is private.
10. A new cfg or platform assumption: none.
11. A new platform ignore: none.
12. Mutation observations: holds. M1 to M5 were applied, run, named and reverted at c66b7a06, a branch commit named by id with no hash. Both reports state that no `verify-mutation` run was used and that none is called an observation.
13. A DuckDB claim without a version: none in the added comments.
14. A discharge claim without proof: the PR adds no amendment, so there is nothing to resolve.
15. A performance claim: none.
16. §2.7: present and matching. Lines 499 and 518 of `engine/README.md` give last-verified c66b7a0, and the new entry sits between TESTS-CONFIGURED-CONNECTIONS and WATCHER-FIRST-READ.
17. The ADR-021 Note: the human answered (round 45, item 2, typed; round 46, item 3, typed). The Note is on main at `docs/adr/ADR-021-row-filter-on-viewport-query.md:269-275` @ 1445eaf3 sha256:412038b1b662c46e2aba202767632a47c808ee5c835a1a6c8edd4bc6dda579b8, a hash as recorded in round 46, item 3. By eye, the landed lines match the rendering at lines 7-13 of `state/drafts/adr-021-note-2026-10-03-rendered.md`. The reviewer recomputes the hash.
18. The budget: 146 counted lines over 2 files against 300 over 2 (report 2). There is no class-8 overrun. O-2 is a preregistered open item, not a standing-rule addition, so class 9 does not apply.
19. Test-text spans pinned at a branch commit: none in the PR.

**The Note against §2.1 to §2.4, under round 43, item 1**
- Note item 1 lists three bullets: third, sixth and seventh.
  - The third bullet is rule 4's integer against a decimal literal (read 1).
  - The sixth is rule 6(i) (read 2).
  - The seventh is rule 4's decimal pair and rule 6(ii), both through read 1.
  - No other rule reads the field, so the Note is not wider than the code. Every comparison junction goes through `is_admitted_comparison`, so it is not narrower either. C44 pins BETWEEN.
- Note item 1's last sentence is §2.4 as ruled yes (round 45, item 1):
  - the unary carry is the struct update at lines 1948-1951;
  - the NULL-with-marked-result step is the disjunct at line 1971.
  - C47 pins both, in B-T3 and in B-T1 part 3.
- Note item 2: refusal as the decimal literal.
  - A wide integer gives `conversion_can_fail` through read 3 (C45a). That is C29's reason for a bare literal.
  - Text gives `text_with_non_text` (C45b).
  - BOOLEAN takes precedence item 2, unchanged.
  - Arithmetic does not read the field. `is_decimal_arithmetic_pair` is type-based and unchanged.
- Note item 3: no code, field or reason value changes. This holds.
- On the Note's term NULL literal against §2.3's NULL-typed operand, see N1.

**docs/01 principle 8**
- Holds. Each refusal sentence is now true of its shape: C41 and C42 give `literal_out_of_bounds`, and C45a gives `conversion_can_fail`.
- Each new admitted shape is pinned in B-T1 part 3 against the plan's casts, (i) and (iii). P-3 is equal on refusals (5152 at both runs) and rises by 9 on admissions (report 2).
- `operand_types` renders the marked result truthfully, as an expression.

**ADR-010 rule 6**
- Holds. The declared literal ceilings (`MAX_INTEGER_LITERAL_DIGITS`, `MAX_DECIMAL_LITERAL_SCALE`) are unchanged.
- The carried flag makes the ceilings bind through rule-2 results instead of being lost there. This is how (c) and (d) are fixed.

**The seams, read on the branch**
- Kernel to engine:
  - `filter_error_of` matches `FilterError::TypeNotAdmitted` by its three fields and maps the reason through `wire_value` (`kernel/src/skp.rs` lines 2253-2257). Both sides are unchanged.
  - B-T3 drives the real entry, `AdmittedPredicate::admit`.
  - B-T7 sits at `kernel/tests/skp_admission.rs` line 607 and is green on the PR run, by the custodian's account of CI.
- Shell to kernel:
  - `refusalGuidance` switches on the code alone (`frontends/shell/src/admission/formatRefusal.ts` line 70). The code is unchanged.
  - B-T9 sits at `frontends/shell/src/skp/__tests__/fixtures.test.ts` lines 461-464. It is unmoved, and green on the PR run.
- No seam is written to an imagined interface.

**The caller rule**
- Holds. No `pub` item, callback or option was added.
- The field and the disjunct are reached only through the product admission path.

**Rulings recorded**
- O-2 is ruled by round 45, item 1.
- The Note is accepted by round 45, item 2, and its rendering confirmed by round 46, item 3.
- Case (b) is admitted by round 43, item 1.
- Scope also holds:
  - no docs/07 creep: placement is round 31, item 1;
  - ADR-006: pure;
  - docs/08: no figure;
  - F7 is routed as a never-queued proposed node (`PLAN.yaml` line 3905, read at d55458c5).

## Findings

- **N1: the Note says NULL literal; the code tests the NULL type.**
  - The set condition (lines 1973-1975) also marks shapes like `(NULL + NULL) - 0.5`, where the NULL operand is a NULL-typed expression, and no row pins those shapes.
  - This is not wider than the Note. In ADR-021, NULL literal already means the walk's NULL type:
    - comparison rule 2 and arithmetic rule 2 test the type, and C32 admits `-NULL > 0` under item 2's NULL bullet;
    - the Note's own item 2 uses NULL literal as a type-level category that an expression could fall into.
  - The only source of `EngineType::Null` is the NULL literal (line 1732) and its NULL-valued arithmetic. So the value is NULL wherever the code marks a result.
  - No action.
- **N2: the field is read a fourth time, at line 1971, in the set condition's marked-partner disjunct.**
  - §8 item 7's second bullet names three read places. The disjunct is the marked-partner condition that the form's OPEN marker and §2.4 (ii) declared, and round 45, item 1 added it to the set condition.
  - §8 item 7's first bullet allows an extension by an O-2 ruling, which covers it.
  - I read it as inside the bound. My §2.4 should have said that the disjunct reads the partner's field. That is a drafting gap and opens no new clause (the record cap).
- **N3: the field's doc comment (lines 1493-1497) is stale against the ruling.**
  - It cites only round 43, item 1, says the field is set only in the binary arm, and says it is read in exactly three places.
  - At c6809d0c the unary arm also carries the field, and the set condition reads it (N2). The comment at lines 1965-1967 does name round 45, item 1.
  - This is not a constitution matter. It is the reviewer's call whether a one-line doc fix rides along. It does not block my PASS.
- **N4: no mutation is declared for the O-2 disjunct.**
  - The gap is in the form, not the code: §4 names M1 to M5 and nothing for (ii).
  - C47b discriminates it. At c66b7a06, before the disjunct, the worker's throwaway probe saw `NULL + (NULL - 0.5) > 0` refused with `conversion_rounds` (report 1). That is evidence, not an observation of record.
  - Nothing is owed under the form as written.

## Closing-record list
1. **The Note's hash.** The reviewer recomputes the sha256 of lines 269-275 at 1445eaf3 and checks it against 412038b1… and the rendered draft's lines 7-13.
2. **The Windows push-run failure.** The record names the failing test (by the custodian's account, round 25, item 1 (a)'s `cancel_reaches_the_producer_directly_and_is_observed_on_its_own_clock`) and the re-run's result. It sits in the same file as B-T7, so the name must show that it was not B-T7.
3. **The empty stat.** The reviewer shows the stat over kernel/, protocol/, frontends/ and renderer/ empty, three-dot.
4. **Merge commit.** The PR merges as a merge commit, never a squash (header Branch line; §2.7), so that c66b7a0 stays reachable.
5. **The closing amendment,** if one is written, is references and hashes only (the record cap). This report is filed at `state/consults/gates/2026-10-04-type-walk-null-literal-arithmetic-gate1-architect.md`.

Files read: `C:\dev\spatial-ide\engine\TYPE-WALK-NULL-LITERAL-ARITHMETIC-PREREGISTRATION.md`, `C:\dev\wt\null-literal\engine\src\predicate.rs`, `C:\dev\wt\null-literal\engine\tests\filter_type_admission.rs`, `C:\dev\wt\null-literal\engine\README.md`, `C:\dev\spatial-ide\docs\adr\ADR-021-row-filter-on-viewport-query.md`, `C:\dev\spatial-ide\DECISIONS-PENDING.md` (RULED rounds 43, 45 and 46), both worker reports under `C:\dev\spatial-ide\state\consults\`, `C:\dev\spatial-ide\state\directives\2026-10-03-adr-021-note-acceptance.md`, `C:\dev\spatial-ide\state\drafts\adr-021-note-2026-10-03-rendered.md`. Write audit: zero write-capable calls (Read, Grep and Glob only).
