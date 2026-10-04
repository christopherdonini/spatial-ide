# Type walk: NULL-literal arithmetic -- admit NULL with NULL and, by the human's reading, NULL with an in-bounds decimal literal; carry a literal's bound flag through a rule-2 result -- preregistration (B-1 N1)

## Header

- **Status.** This is the preregistration of PLAN node `type-walk-null-literal-arithmetic` (`PLAN.yaml:3313-3329 @ 1bb94e19 sha256:bcb737f36249954992b49e7027fb37fcdf904b87acca38da03eef1aa97c590ac`). It becomes the node's gate when committed. **It is committed before any code.** It is append-only once committed. An amendment written after any outcome has been seen says so in its first line and names what it touches or invalidates.
- **OPEN marker.** O-2 (§2.4) holds three things only: the unary arm's handling of §2.3's field, the binary arm's marked-partner condition, and row C47. Everything else may be coded once this form is on main. O-1 was ruled by question round 43, item 1.
- **Authority:**
  - question round 31, item 1: the node's placement, position 10 of 16;
  - question round 43, item 1: case (b) admitted narrowly (option iii), under a reading of ADR-021's Note 2026-09-30, item 2 that is the human's. It makes the piece crossing under C2 of the 2026-10-03 lead-data clarification;
  - question round 43, item 2: drafting returns to the architect;
  - the architect's reduction-1 gate on PR #145, item 3, which proposes this node (`state/consults/gates/2026-09-30-b-1-code-reduction1-architect.md:14-22 @ 1bb94e19 sha256:1bbcc4de5f69f0f76c946216aa9de09fbf8628ebc897455cf2f05108e8354741`);
  - the reviewer's gate-attempt-3 N1, cases (a) to (d) (`state/consults/gates/2026-09-30-b-1-code-gate2-reviewer.md:79-83 @ 1bb94e19 sha256:0c25e4d7ce80693c64a06beafd3f049e7352d8167811fe561b7da292ac90bec8`);
  - the 2026-10-03 lead-data clarification, C1 and C2 (`state/directives/2026-10-03-lead-data-pilot-clarification.md`);
  - round 25, item 2: classes 8 and 9, the mutation-observation wording, test-text spans, and the full form at dispatch;
  - the record cap (`state/directives/2026-09-18-record-cap.md`).
- **What it continues.** `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md` (the predecessor), which names this node as its follow-up (`engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:447 @ 1bb94e19 sha256:36dc3ff94fc7d68c3fd504037ca015f39ccc1befad32fc9a61d0df26a1ba6dd7`). The predecessor's rules apply unchanged except where §2 states otherwise:
  - its §2.3 rules 4 and 6, read under §2.3 below;
  - its §2.5(a);
  - its Amendment 1 precedence;
  - its §7 cast set and bounds.
- **Drafted by** the architect agent on the custodian's brief, read-only, against main at 1bb94e19. The architect ran no command. The starting text is lead-data's draft (§0).
- **Reference form.**
  - Code is cited by symbol, with a pin `path:line @ 1bb94e19 sha256:<hex>` where a line is needed.
  - Rulings are cited by round and item.
  - Self-references are by section only.
  - Every restatement of a source is a paraphrase. Nothing here is marked verbatim.
- **Branch.** `cut/type-walk-null-literal-arithmetic`, cut from main after this form lands. The PR merges as a merge commit, never a squash (§2.7).

## §0. Disclosure

- **Evidence, not Authority:**
  - the reviewer's probe of N1 at 53c6e3e (DuckDB v1.5.5), reported in the gate report pinned above;
  - lead-data's draft (`state/consults/2026-10-03-type-walk-null-literal-arithmetic-lead-data-draft.md:5-331 @ 1bb94e19 sha256:e22f787ebecb24d3b2779f1319076992d0715b872d624c7a135cc8905e3bd4f2`);
  - the architect's consult on it (`state/consults/2026-10-03-type-walk-null-literal-arithmetic-architect-consult.md`);
  - the round 43 context (`state/drafts/questions-2026-10-03-rounds-43-44.md`, §1).
- **Measurement.** This form measures nothing, and the 5 GB fixture is not read. Every statement about DuckDB's behaviour is an observation at v1.5.5, or a labelled hypothesis. The crate pin is `engine/Cargo.toml:39 @ 1bb94e19 sha256:dcaabe03d2217f978d9ac63f637d4b0ae3037ee2dd772d3ff4a20a018a2af81a`.
- **Code read at 1bb94e19:**
  - `engine/src/predicate.rs`: `Typed` and its constructors, `literal_typed`, `is_numeric`, `type_of_arithmetic`, `type_of_division`, `admitted_arithmetic_result`, `is_decimal_arithmetic_pair`, `is_admitted_comparison`, `determine_reason`, `check_pair`, `check_comparison`, `check_between`, `check_in`, `TypeRefusalReason`, and B-T1b's case builder and skip;
  - `engine/tests/filter_type_admission.rs`: B-T3's `corpus` and test, B-T1's `generate_cases`, `boundary_literal_cases` and count assertions;
  - `kernel/src/skp.rs`: `filter_error_of` and `filter_type_not_admitted`;
  - `frontends/shell/src/admission/formatRefusal.ts`: `refusalGuidance`.
- **Documents read:**
  - ADR-021's Note 2026-09-30;
  - SKP-V0 §7.5's and §7.6's dated notes;
  - the predecessor, in full;
  - `AUTONOMY.md` §21a to §21d and §25;
  - `docs/PREREGISTRATION-TEMPLATE.md`;
  - `state/directives/PORTABILITY-2026-09-30.md` §2;
  - both modules' owner's indexes.

**Findings at 1bb94e19, from reading:**
- **F1, case (a).** Arithmetic rule 2 admits a NULL-typed operand only beside an operand that `is_numeric` accepts (`engine/src/predicate.rs:1996-2005 @ 1bb94e19 sha256:a88be2bda35ba22f9e12b47ab36a3ddef141bd4fcd90e31c656f42a1c75a88e6`). `is_numeric` rejects NULL (`engine/src/predicate.rs:1539-1545 @ 1bb94e19 sha256:4c5e569bee41a2cc3cb6bd484f33b7e4d1dfd39099e3b685e5a3ae3d31d44b81`). So `NULL + NULL` falls to the residual `conversion_rounds`.
- **F2, the bound flag.** The binary arm builds its result with `Typed::expression`, which sets the flag to true unconditionally (`engine/src/predicate.rs:1505-1512 @ 1bb94e19 sha256:3f1a908d9cca095568c5562f5099f55078b3260d27357c7e4b5933aeb8098f18`, `engine/src/predicate.rs:1947-1960 @ 1bb94e19 sha256:cd42970a24f573e3f67a0342d8b9c65f21dafd4c9b311d2bab45ab1456a1d807`). The unary arm already carries every attribute of its operand except kind (`engine/src/predicate.rs:1932-1939 @ 1bb94e19 sha256:7f385de79bfe7900fe38cbf759b83ea587373b0fb8acf487c8e00781634df3fb`).
- **F3.** Every admitting arithmetic rule other than rule 2 admits only operands within bounds (`engine/src/predicate.rs:1967-2062 @ 1bb94e19 sha256:932874f5773d5dbbc3a585aabde6fd5989a0a4852cda9cfcfc7652f9a698644f`). B-T1's probe set forms arithmetic only as column-op-operand (`engine/tests/filter_type_admission.rs:621-632 @ 1bb94e19 sha256:9800ae6e5b89f8b2e8334559c43ec7d57d98a5c0fac23e630cfab8efc257d465`). So no part-1 case meets either change. §5 P-3 is the discriminator.
- **F4, case (b).** The walk types `NULL - 0.5` as a DECIMAL(2,1) expression. Comparison rules 4 and 6 test for a decimal literal by kind (`engine/src/predicate.rs:2088-2098 @ 1bb94e19 sha256:cb10b5c5d4c226b8915eaeaec94fd257add587e90e921779fd09701ace2d15db`). The pair falls to the residual reason (`engine/src/predicate.rs:2180-2216 @ 1bb94e19 sha256:f3fd855e7dd65913dbdb6bbb983a44460ffeb04f131459fb6257dabbdf4ada95`). That sentence names a value read from the file (`engine/src/predicate.rs:1419-1421 @ 1bb94e19 sha256:34cd0dbda78327babfd989fef2048cb760ec1751e44467114e2d2bb988fc57b1`), and the predicate has none.
- **F5.** B-T1b skips a node that the plan constant-folds away (`engine/src/predicate.rs:3185-3189 @ 1bb94e19 sha256:d1c66351d86ae7262a0efa6e3a413e6cc25681f75178f9cde784e52ebd881680`). So the walk's type for a NULL-with-NULL result is not observable through B-T1b.
- **F6 (corrected from the draft).** Outside `engine/`, the five reason values appear in two kinds of place:
  - SKP-V0 §7.5's dated note (`protocol/skp/SKP-V0.md:488-491 @ 1bb94e19 sha256:2cc19b67758d18e8ad0cff97a6fe30e4d04f8a6a447ac96b87420202f68eaa39`);
  - three fixture lines. Each pins `text_with_non_text` for the `zone = 1` shape, which this piece does not move:
    - B-T6, `kernel/src/skp.rs:2846 @ 1bb94e19 sha256:e37eb79d8afd3c38332ca36a6b4ec43f8569fed8f8b1e75047ea312a1be564d6`;
    - FX-4, `protocol/skp/tests/data/v0-error-filter_type_not_admitted.json:7 @ 1bb94e19 sha256:ee7283d5488417f4eab2a9c390548f2a385360b1d91be3a60b15bcae2522c210`;
    - B-T9, `frontends/shell/src/skp/__tests__/fixtures.test.ts:470 @ 1bb94e19 sha256:49b0c61758573c89a80f30e86327581115b96e7b933a44a458f9b6eede689f80`.

  No file under `kernel/`, `protocol/`, `frontends/` or `renderer/` names a NULL-arithmetic predicate. The search used the architect's Grep tool over the working tree at 1bb94e19, which has no tracked change. Its only hits were two unrelated comment lines about NULL zone values: `kernel/tests/manual_walkthrough_fixtures.rs:305 @ 1bb94e19 sha256:e0bb707ff2d4dd716cde5c1192839bcfe87aa90170a75be4bed761141c2622a4` and `kernel/tests/publish.rs:1175 @ 1bb94e19 sha256:c1b3f884f86a1617dcc9c98d3e0d5d50a9360818af8a1babec2b15c92e2d9ecd`. The campaign generator uses NULL only in `IS [NOT] NULL` forms.
- **F7, a residual outside this piece.** Some comparisons of a rule-2 result over a column or an integer literal are refused by rule 7's bit-width bound. They keep the residual reason, although the result's value is a constant NULL. Example: `f32 > NULL + 100000`, an INTEGER expression against REAL. Round 43, item 1 admits only the decimal-literal shape, so this piece leaves these unchanged. They are routed to the human outside this form.
- **Observation (lead-data's, kept).** §21a's security bullet labels ADR-021 as bundling / no-runtime-fetch (`AUTONOMY.md:321-322 @ 1bb94e19 sha256:61906e9c90498d10e7b265806962434fde6ac701e9b3fdbdd542377ec624e962`). ADR-021 is the row-filter ADR. The form's route (§9) does not depend on how that label is read.

**Changed from lead-data's draft, and why:**
- **D1.** §2.3 is replaced. O-1 is ruled (iii), so case (b) is admitted under the human's reading. The draft's `conversion_can_fail` clause is withdrawn, because its sentence is false for (b) (the consult, O-1). C40 is re-predicted as admitted.
- **D2.** New rows are added to pin the reading's boundary on both sides: C44 (admitted), C45 (refused), C46 (an unchanged control) and C47 (O-2). There are new mutations, M3 to M5, and B-T1's part-3 pins grow to match.
- **D3.** F6's grep claim is corrected (the consult's defect, bearing on Q2).
- **D4.** The reasoning for (d) in §2.2 now rests on item 2's lossless-widening bullet together with item 1's bounds bullet. It states the order between items 1 and 2 as the predecessor's merged reading (the consult's defect, bearing on Q3). It no longer says the junction converts the literal.
- **D5.** The draft's confined reading (its §2.5 and its C2 section) is replaced by §2.6's crossing impact. A dated ADR-021 Note is put to the human. §8 item 3 is rewritten to match.
- **D6.** The owner's-index lines are named here (§2.7). The worker applies them, not lead-data (round 43, item 2).
- **D7.** O-2 is new. F7 is new. The budget rises from 150 to 300 to cover the added rows and pins.
- Kept: §2.1, the flag mechanism in §2.2, rows C39, C41, C42 and C43, M1 and M2, P-3, §2.8, and most of §8 and §9.

## §1. What this preregistration may and may not claim

- **May claim, once §4 is green:** at DuckDB v1.5.5, the shapes in §3 take the outcomes §3 predicts. Every admitted new shape carries only the predecessor's §7 casts, and its stream ends without error (B-T1, the part-3 pins). No other admission outcome changes.
- **May not claim:**
  - any performance figure or docs/08 row;
  - any wire change: no code, field, reason value or literal changes;
  - any wording: no string changes, and the reason sentences and Display stay the human's;
  - any change to `/`;
  - anything about integer overflow, which belongs to node `stream-evaluation-failure-fixed-detail`;
  - outcomes at another DuckDB version, without B-T1 and B-T3 green there;
  - that the reading reaches beyond §2.3's shape, which is F7's class.
- **ADRs cited:**
  - ADR-021's Note 2026-09-30, items 1 and 2, as read by round 43, item 1;
  - ADR-010 rule 6.
- **ADRs amended.** None by this piece. A dated ADR-021 Note recording the reading is proposed to the human outside this form (§2.6). It is not code scope.

## §2. The change, stated before it is applied

**2.1 NULL with NULL in `+`, `-`, `*` (`admitted_arithmetic_result`).**
- A NULL-typed operand beside a NULL-typed operand is admitted. The walk types the result as NULL, kind expression. That is the walk's own rule, and it makes no claim about the plan (F5). It matches what unary `-` on a NULL literal gives today.
- A comparison-shaped junction then admits the result by comparison rule 2, which tests the type and not the kind (`engine/src/predicate.rs:2081-2084 @ 1bb94e19 sha256:abf74649c41d79ee265e3dfacc5f775a224371f7e4a19766379c6612b36c5fde`). This is the path C32's `-NULL > 0` already takes.
- NULL beside a numeric operand is unchanged. NULL beside VARCHAR or BOOLEAN is unchanged and still refused under the predecessor's §2.5(a).

**2.2 The bound flag, and case (d).**
- A binary `+`, `-` or `*` result is within bounds exactly when both of its operands are. The flag is set in `type_of_arithmetic`'s binary arm from the two operands' flags.
- By F3, this binds only rule 2's results. Unary `-` already carries the flag, and `/` is unchanged.
- **The `+` node in (d).** Its pair is a NULL literal and a 39-digit integer literal.
  - The predecessor's merged reading of the order between the Note's items 1 and 2 applies item 2's NULL bullet (`docs/adr/ADR-021-row-filter-on-viewport-query.md:255 @ 1bb94e19 sha256:4a4898e23ea42b6cf4d6f501509e8b39ea9f111448eaabbd6f90d84b185845f9`) before item 1's bounds bullet (`docs/adr/ADR-021-row-filter-on-viewport-query.md:251 @ 1bb94e19 sha256:b534cbc9e6c081a3656794cc6429b55f77695ba2c5f37f68c9697b6fafe50c5a`) to a pair with a NULL operand.
  - In the code, `check_pair` admits by comparison rule 2 before `determine_reason`'s bounds check is reached (`engine/src/predicate.rs:2247-2255 @ 1bb94e19 sha256:d02edc30d7dd0f1af8d6a1cbe6c03066d7f7f6eea3ecdb9353ee19948cd4daaf`). Arithmetic rule 2's `is_numeric` does not read the flag.
  - This node keeps that reading and does not argue it. The `+` node stays admitted, and so does the direct pair `NULL = <out-of-bounds literal>` (C46).
- **The junction in (d).** Its pair is a BIGINT column against a UHUGEINT-typed expression; rule 2 gives the result the literal's type.
  - Neither operand is a NULL literal, so item 2's NULL bullet does not govern this pair.
  - Item 2 admits integer against integer only as a lossless widening (`docs/adr/ADR-021-row-filter-on-viewport-query.md:256 @ 1bb94e19 sha256:a7f7029f9d64d3e7e0dff7fc43295b6f75ec93e0b78b72d1eafb62fa84324c59`). At v1.5.5 the plan casts the constant UHUGEINT to HUGEINT (the reviewer's N1 (d), pinned in the header), which is not lossless.
  - Comparison rule 3 coincides with that bullet only while the bounds hold (`engine/src/predicate.rs:2110-2113 @ 1bb94e19 sha256:90618e45943f486ecc7bd61d39e3a2d02ffe0689ae8c7d62daccbf8888b16eac`). The lost flag is what let it admit.
  - With the flag carried, rule 3 does not admit. The refusal takes the predecessor's precedence item 3, `literal_out_of_bounds` (`engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:343-348 @ 1bb94e19 sha256:6990b2a7c0e93edd59b5a8f44296df833f1e46b9b8458c54930c1e802dbdf2ca`). Item 1's bounds bullet names the literal the predicate carries.
  - The form does not claim that the junction converts the literal. The plan converts the UHUGEINT-typed constant.
- **Case (c)** takes the same path. Its scale-27 literal's result now carries the flag, so the junction refuses `literal_out_of_bounds`. That sentence is true of (c) (`engine/src/predicate.rs:1415-1417 @ 1bb94e19 sha256:467979cda2c4aa95f03b8ded333b01f908a81d9c4cbdb31d05feb31d1e0b5f8c`).

**2.3 Case (b): the human's reading (round 43, item 1).**
- **The reading.** Round 43, item 1 admits `NULL - 0.5 > 0` under ADR-021's Note 2026-09-30, item 2. Under it, a rule-2 result over a decimal literal within the bounds counts as that literal for comparison rules 4 and 6. The reading is the human's, by that item. This form applies it no wider than the consult recommended.
- **The shape.**
  - `Typed` gains one private field, `counts_as_decimal_literal: bool`. It is false at every constructor and in every `literal_typed` arm.
  - It is set only in `type_of_arithmetic`'s binary arm, when `admitted_arithmetic_result` admits by rule 2. The condition: one operand is NULL-typed, and the other is a decimal literal within bounds (kind literal, DECIMAL type, flag true).
  - It is read in exactly three places:
    - the decimal-literal test in `is_admitted_comparison`, used by rule 4 and rule 6(ii);
    - the numeric-literal-within-bounds test, used by rule 6(i);
    - `determine_reason`'s decimal-literal test in its item-4 first clause.
  - In each of the three, the field stands in for kind literal, and the bounds conditions stay as they are.
- **What it does not do.**
  - The result keeps its DECIMAL(w,s) type and its expression kind, so `operand_types` still renders `DECIMAL(w,s) expression`.
  - It is not retyped as NULL. Retyping would let it pass comparison rule 2 against VARCHAR and BOOLEAN (the consult).
  - Rules 1, 2, 3, 5 and 7 are unchanged.
  - Arithmetic is unchanged: `is_decimal_arithmetic_pair` reads the type, so a marked result inside `+`, `-` or `*` keeps its outcome at 1bb94e19.
- **The boundary.**
  - A partner that is a non-literal integer wider than 64 bits still refuses `conversion_can_fail`, under the existing item-4 first clause (`engine/src/predicate.rs:2203-2211 @ 1bb94e19 sha256:75ff3b7013c48758e95ba8708cce19933487444b143b779d1f36aeaa681c947e`), which now reads the field. That is C45's first predicate.
  - Against VARCHAR or BOOLEAN, precedence items 1 and 2 fire unchanged. That is C45's second predicate.
  - A rule-2 result over a decimal literal beyond the bounds is not marked, and refuses as in §2.2. That is C41.
- **Where it applies.** At every comparison-shaped junction the predecessor's §2.3 lists, because one function serves them all (C44's `BETWEEN` predicate).
- **What does not change.** No sentence, wire value, reason or code. The admitted bullets are item 2's third, sixth and seventh (`docs/adr/ADR-021-row-filter-on-viewport-query.md:257 @ 1bb94e19 sha256:6227dffc3d472975ac19287af1fe8bdd3a3f40a8568c2d9846109b7f76b91f1b`, `docs/adr/ADR-021-row-filter-on-viewport-query.md:260-261 @ 1bb94e19 sha256:2ab0fc5ad03b6e889253ae7e535f4e50ee29e8d1567afad2868a03074b7cd7d5`).
- **H-1 (kept from the draft).** A negative decimal literal reaches the walk as a `CONSTANT`, because the parser folds the sign. So `-0.5` is a literal and never a unary node. The discriminator is C43.

**2.4 O-2 (open, for the human).**
- **The question.** Does the field carry through a further step that keeps the value NULL and the type the literal's? There are two such steps:
  - (i) unary `-` over a marked result;
  - (ii) rule 2 with a marked result as the non-NULL operand.
- **Recommendation: yes.** Each step keeps both grounds of the reading. Without it, `-(NULL - 0.5) > 0` and `NULL + (NULL - 0.5) > 0` keep a residual sentence that is false of them.
- **(i) has no code either way at the default.** The unary arm's struct update already carries the field, and a ruling of no adds one clearing line.
- **(ii) is one more disjunct** in §2.3's set condition.
- **If O-2 is ruled no,** a class-5 amendment records the narrowing and C47's prediction, and the B-T1 counts in §3 drop by two. That happens before C47 is run.

**2.5 Unchanged in the engine:**
- comparison rules 1, 2, 3, 5 and 7;
- the `IS [NOT] NULL` arm;
- `/`;
- the reason set, its wire values and its sentences;
- `FilterError` and its variants;
- the bounds constants;
- the parse;
- the stage order.

No `pub` item is added.

**2.6 Kernel, protocol and frontends: crossing under C2, with no code change.**

The piece changes which predicates fall inside the admitted class that other modules consume by reference. By pointer:
- **protocol/**
  - SKP-V0 §7.5's dated note (`protocol/skp/SKP-V0.md:488-491 @ 1bb94e19 sha256:2cc19b67758d18e8ad0cff97a6fe30e4d04f8a6a447ac96b87420202f68eaa39`): the code, the three fields and the five values are unchanged.
  - §7.6's dated note (`protocol/skp/SKP-V0.md:512-516 @ 1bb94e19 sha256:b833b2985ebeb23294b851588b91d3b8cbce3ffb7738ae847a11c808b02622db`) delegates stage 3's class to ADR-021's Note 2026-09-30. The reading moves the shapes in §3 relative to that class.
  - FX-4 is unmoved (F6). There is no literal bump.
- **kernel/**
  - `filter_error_of` maps the variant, and `reason` comes from `wire_value` (`kernel/src/skp.rs:2253-2257 @ 1bb94e19 sha256:d19371850fcc5c73e4bfe59b2278f0d569defd3c2d4266d4d8a4781b5fb62730`, `kernel/src/skp.rs:2279 @ 1bb94e19 sha256:c37a5c18a4b509cba6bcc528adf98f40c5a22e9e22a6cd58d6bb2cd7cb0c85e7`). Unchanged.
  - B-T6 and B-T7 are unmoved.
  - The kernel index's wire-error-codes pointer (`kernel/README.md:358 @ 1bb94e19 sha256:2a7ce247a84945a72d88bbe52dd16716741847ba919a890df1029809a59b5759`) is unchanged.
- **frontends/**
  - The shell's guidance switches on the code alone (`frontends/shell/src/admission/formatRefusal.ts:70-71 @ 1bb94e19 sha256:4b258c570eecb102348db2f02b755ef264807bad7686835a8194b42a31959726`).
  - B-T9 is unmoved.
- **renderer/:** none.

**What a client sees for each shape:**
- (a), (b), and the C44 and C47 shapes are admitted, with an empty stream and no message.
- (c) carries the `literal_out_of_bounds` sentence instead of the residual one.
- (d) is refused `literal_out_of_bounds` instead of admitted with an empty stream.

**Owed text.**
- ADR-021 owes a dated Note recording round 43, item 1's reading. Without it, the text §7.6 consumes does not say that the shapes in C44 are admitted.
- SKP-V0 owes none. §7.6 delegates to the Note 2026-09-30, and the new Note reads that Note's item 2 without changing its class text.
- The Note is the human's. Its proposed text goes to the human with this form, outside it, and is not part of the code scope.
- Code may begin on the ruling. The implementation PR does not merge until the human has answered: an accepted Note lands on main first, byte-identical to the accepted text, by the custodian's own docs commit.

**2.7 The owner's index** (`engine/README.md`, "Owner's index"; C1; applied by the worker in the implementation PR, checked by the reviewer against its diff):
- `engine/README.md:518 @ 1bb94e19 sha256:c43ae7bc4be255d6dfeb2a93021b99fa63a1348b781fb1af4ce7449d94cc0d0a`, the preregistrations in this module: it gains `engine/TYPE-WALK-NULL-LITERAL-ARITHMETIC-PREREGISTRATION.md`, after `engine/TESTS-CONFIGURED-CONNECTIONS-PREREGISTRATION.md` and before `engine/WATCHER-FIRST-READ-PREREGISTRATION.md`.
- `engine/README.md:499 @ 1bb94e19 sha256:dcdcf8b714b3ae1515b0b4cdce29e8472f57bcb3d505214ed30a02a3c42a47c1`, last verified at: moved to the commit at which the worker checked every pointer of the section. That commit stays reachable from main because the PR merges as a merge commit.
- Every other line is unchanged:
  - the interface and pins (`engine/README.md:504 @ 1bb94e19 sha256:76d2805b4835f19ca61aa4137c58c539f61a3e12b3d3167e9e2c2b33af402b20`);
  - ADRs (ADR-021 is already listed);
  - limits and ceilings.
- `kernel/README.md`'s owner's index: none. The piece has no kernel half.

**2.8 Portability.** The type walk is pure logic, with no OS mechanism, no `cfg` and no path. R3's conditional section does not apply (`docs/PREREGISTRATION-TEMPLATE.md:177 @ 1bb94e19 sha256:6f5f5efc2cfb92e6b7c14bd23f0087adbb53769df674affdb4c1a2e2819a33b0`). R1, R4 and R6 bind, as §8 items 10 and 11.

## §3. Fixtures and corpus, with pre-declared outcomes

FX-1 is unchanged. B-T3 checks its hash at the end of the run, as today.

**New B-T3 rows** are appended to `corpus` in this order. TNA means `TypeNotAdmitted`.

| # | Predicate | Predicted |
|---|---|---|
| C39 | `NULL + NULL > 0` | admitted (a) |
| C40 | `NULL - 0.5 > 0` | admitted (b; round 43, item 1) |
| C41 | `i64 < NULL + 0.000000000000000000000000001` | TNA `<`, `literal_out_of_bounds`; operand types not asserted (c) |
| C42 | `i64 = (NULL + 170141183460469231731687303715884105728)` | TNA `=`, `BIGINT; UHUGEINT expression`, `literal_out_of_bounds` (d) |
| C43 | `i64 < -0.5` | admitted (H-1 control) |
| C44 | `i64 > NULL - 0.5`; `(NULL - 0.5) = 0.25`; `f32 > NULL - 0.5`; `1e3 > NULL - 0.5`; `i64 BETWEEN NULL - 0.5 AND 1` | admitted: rule 4 (64-bit integer), rule 4 (decimal pair), rule 6(i), rule 6(ii), rule 4 in `BETWEEN` |
| C45 | `(NULL - 0.5) < (u64 * i64)`; `zone = NULL - 0.5` | TNA `<`, `DECIMAL(2,1) expression; HUGEINT expression`, `conversion_can_fail`; TNA `=`, `VARCHAR; DECIMAL(2,1) expression`, `text_with_non_text` |
| C46 | `NULL = 170141183460469231731687303715884105728` | admitted. Unchanged at 1bb94e19; the control for §2.2's order |
| C47 | `-(NULL - 0.5) > 0`; `NULL + (NULL - 0.5) > 0` | admitted (O-2 as recommended) |

- **H-2 (hypothesis).** The surrogate prepare binds C45's second predicate at v1.5.5. The discriminator is the row itself. A `rejected_by_binder` outcome is a class-2 result, and M5 still pins the property on the first predicate.
- **B-T1 pins.** The admitted new shapes, C39, C40, C44 (five) and C47 (two), are appended to B-T1's part 3, each with its `arith_op` set as for C32's pin. Part 3 goes from 323 to 332 cases, and the total from 9,705 to 9,714. Under O-2 ruled no, it is 330 and 9,712.

## §4. Tests, and the mutation per changed test

Each mutation is observed by applying it, running the named test, recording its failure by name with the commit it was observed at, and reverting it (round 25, item 2 (c)). A `verify-mutation` run is never recorded as an observation. No new test function is added.

- **B-T3 (changed):** `each_corpus_row_is_admitted_or_refused_with_its_code_reason_and_operand_types` (`engine/tests/filter_type_admission.rs`).
  - It gains C39 to C47. Its doc comment and `corpus`'s doc comment name this form for those rows.
  - Its existing mutation stands.
  - New mutations. Each names the first row in corpus order that it breaks:
    - **M1:** §2.1's arm removed. Fails on C39: expected admitted, got refused.
    - **M2:** §2.2's flag forced to true. Fails on C41's reason: expected `literal_out_of_bounds`, got `conversion_rounds`. C42 also breaks.
    - **M3:** `is_admitted_comparison` ignores §2.3's field. Fails on C40: expected admitted, got refused.
    - **M4:** `determine_reason` ignores §2.3's field. Fails on C45's first predicate's reason: expected `conversion_can_fail`, got `conversion_rounds`.
    - **M5:** a marked result typed NULL instead of the literal's type. Fails on C45's first predicate: expected `TypeNotAdmitted`, got `Ok`.
- **B-T1 (changed):** `the_type_walk_agrees_with_the_binder_over_the_p0_matrix`.
  - Part 3 gains the pins in §3, and its part-3 and total count assertions change as §3 states.
  - Its two existing mutations stand.
  - No new mutation is claimed. The pins check (i) and (iii) on admitted cases.
- **B-T1b:** unchanged, at 2,083 cases.

## §5. Predictions · declared unchanged · invalidators · falsification

**Predictions** (a wrong one is a result, class 2):
- **P-1:** §3, as tabled.
- **P-2:** B-T1 (i) and (iii) hold for every new part-3 pin.
- **P-3** (F3's discriminator): B-T1's printed refused tally at the head equals the one at the merge base. Its admitted tally rises by exactly the pin count. B-T1b's printed checked count is equal at both. The worker records both runs.
- **P-4** (H-1): C43 is admitted.

**Declared unchanged:**
- every existing B-T3 row, C1 to C38, with its code, reason, construct and operand types;
- every B-T1 and B-T1b assertion, except part 3's count and the total;
- B-T2, B-T4 to B-T10;
- the five reasons, their wire values and their sentences, and every Display;
- arithmetic outcomes over a marked result;
- `/`, and the `IS [NOT] NULL` arm;
- `kernel/`, `protocol/`, `frontends/`, `renderer/`, SKP-V0 and FX-4;
- ADR-021, except a Note the human accepts (§2.6).

**Invalidators** (stop, and return to the custodian):
- a declared-unchanged item moves;
- P-3 fails;
- B-T1 (i) shows a cast outside the predecessor's §7 set for a new pin;
- a refused §3 row whose reason sentence is false (the predecessor's invalidator as amended, `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:376 @ 1bb94e19 sha256:5449d5966f4399321a2caaece17136c92d25ac0bc3bf11cd4bb5a8a4f2511959`);
- the change needs any of: a sixth reason, a wire change, a new `pub` item, or a diff outside `engine/`.

**Falsification:** at v1.5.5, a shape that §2 admits ends its stream in error, or carries a plan cast outside the predecessor's §7 set.

## §6. Instruments

All are assertions: typed outcomes, plan casts, counts and hashes. There is no measurement.

## §7. Declared values and ceilings

- **Unchanged:**
  - `MAX_INTEGER_LITERAL_DIGITS` = 20 and `MAX_DECIMAL_LITERAL_SCALE` = 18, both private, in `engine/src/predicate.rs`;
  - the five-value reason set;
  - the predecessor's §7 cast set.
- **Budget** (a class-8 overrun is recorded against these lines, and this section is not edited):
  - at most 300 insertions plus deletions, over at most 2 files of non-generated code and tests (`engine/src/predicate.rs`, `engine/tests/filter_type_admission.rs`);
  - counted by `git diff --numstat origin/main...HEAD`, excluding this form, `*.md`, `state/**`, `PLAN.yaml`, `CUSTODIAN-QUEUE.*`, `site/**` and lockfiles.

## §8. Block-on-sight

1. Code before this form is on main, or code of O-2's items before O-2 is ruled.
2. A new `TypeRefusalReason` variant, a changed wire value, or a changed sentence or Display string.
3. Any diff under `kernel/`, `protocol/`, `frontends/` or `renderer/`, or any ADR-021 or SKP-V0 edit, in the implementation PR.
4. An existing B-T3 prediction edited, or a B-T1 or B-T1b assertion weakened (the part-3 count and the total aside).
5. An arithmetic pair admitted outside the predecessor's §2.5(a) as changed by §2.1.
6. The result flag set other than from both operands' flags, or bounds applied to `/`.
7. §2.3's field misused in any of these ways:
   - set outside §2.3's condition, as extended only by an O-2 ruling;
   - read outside its three named places;
   - set on a result over an out-of-bounds literal;
   - a rule-2 result retyped as NULL.
8. A value from the file in any field or Display, or a message stating another module's consequence.
9. A new `pub` item.
10. A new `cfg(windows)`, `cfg(unix)` or `cfg(target_os ...)`, or a Windows assumption in the walk (R1, R2, R4).
11. A new platform ignore (R6).
12. A mutation recorded as observed without its run, or a `verify-mutation` run called an observation of a mutation.
13. A DuckDB behaviour stated without its version.
14. A discharge claim without a resolvable proof.
15. Any performance claim.
16. §2.7's lines absent from the implementation PR, or not matching its diff.
17. The PR merged before the human has answered the ADR-021 Note question, or merged with an accepted Note not on main byte-identical.
18. A §7 overrun not recorded as class 8, or this form's §7 edited to match. A scope addition on a standing rule not recorded as class 9, or code of it landed before its amendment.
19. A test-text span on an unmerged branch pinned by hash at a branch commit, or named without its commit id.

## §9. Gates

Full gating (`AUTONOMY.md:321-332 @ 1bb94e19 sha256:5c75dae11897d37bea0b078e4bac24cc20ec444c194a40d6268656b8c4871552`). The piece changes the outcome under a stated guarantee: ADR-021's admitted class, pinned by B-T3. It adds user-visible behaviour, which closes §21c (`AUTONOMY.md:349-355 @ 1bb94e19 sha256:b837ddf19fe773f4b5ddbb146918756acdc40bfc9fc194da37b75c161f692b35`), and it is crossing under C2. Size: an estimated 170 to 220 lines; §7 declares the ceiling.

- **Architect:**
  - §8 item by item;
  - the Note's items 1 and 2 against §2.1 to §2.3, under round 43, item 1's reading;
  - docs/01 principle 8, as the predecessor's §9 cites it;
  - ADR-010 rule 6;
  - the seams, read on the branch: kernel → engine through `FilterError::TypeNotAdmitted`, with B-T7 green; shell → kernel through `refusalGuidance`, with B-T9 green;
  - the caller rule (no `pub` item);
  - O-2's ruling, and the human's answer on the Note, recorded.
- **Reviewer:**
  - the full diff, three-dot;
  - `git diff --stat origin/main...HEAD -- kernel/ protocol/ frontends/ renderer/` shown empty;
  - M1 to M5, each observed by name at a commit, then reverted;
  - P-3's two runs;
  - §2.7 against the diff;
  - discharge claims resolved.
- **Suites:**
  - every CI job on the PR green, including `cargo test --workspace` in each matrix job, `node --test` over `scripts/`, and the `scripts/plan` verifiers;
  - the pre-gate self-checks (§6a) run first;
  - no portability level beyond KNOWN-LIMITATIONS 1 is claimed (R5).
- **Operator:** none. No string is added or changed.
- **Record:** the gate reports are the observation of record. A closing amendment is references and hashes only (the record cap).

## §10. Amendments — opens empty, append-only

### Amendment 1 — 2026-10-04, written after gate 1's results on PR #170 (head c6809d0c): §2.1 falsified and replaced; touches §1, §2.1, §2.6, §3, §4, §5, §8 and §9

*Class 1, post-result. Written after gate 1's results were seen. The reviewer's S1-1 (`state/consults/gates/2026-10-04-type-walk-null-literal-arithmetic-gate1-reviewer.md:14-36 @ 2bab186a sha256:e8036be44ebda0dff97aaab877c0ad4e7a3ea9bb6c7f20b74d1d9dc1dee45699`) met §5's Falsification clause for §2.1's own shape at a VARCHAR or BOOLEAN junction; the architect's gate-1 N1 (`state/consults/gates/2026-10-04-type-walk-null-literal-arithmetic-gate1-architect.md:95-101 @ 2bab186a sha256:45a13ad0c0780e28db747ee85abcf6fac98180d7353144181cb6446fe4321573`) is withdrawn by it. It invalidates §2.1's typing of the result as NULL and §2.1's claim that the result takes C32's path. No row C1 to C47, mutation M1 to M5, reason, wire value, sentence or Display changes. Where a section is restated, the text is this form's new wording; nothing here is a quotation.*

- **The result.** At DuckDB v1.5.5 (§0's crate pin), §2.1's NULL-typed result passed comparison rule 2 against VARCHAR and BOOLEAN partners; the plan cast the file column to BIGINT, outside the predecessor's §7 set, and one such shape ended its stream in a conversion error naming a file value (the reviewer's evidence, pinned above). The observed casts show that the binder does not treat a NULL-valued `+`, `-` or `*` as the NULL literal that ADR-021's admitted class names (`docs/adr/ADR-021-row-filter-on-viewport-query.md:255 @ 2bab186a sha256:4a4898e23ea42b6cf4d6f501509e8b39ea9f111448eaabbd6f90d84b185845f9`).
- **§2.1, replaced.**
  - A NULL-typed operand beside a NULL-typed operand in `+`, `-`, `*` is admitted. The walk types the result as the binder types it, as P-0 observes (H-3 predicts BIGINT), kind expression, within bounds.
  - The result is then judged by that type under the predecessor's rules, unchanged. It is not a NULL literal, as the Note 2026-10-03, item 2 already holds for the decimal case (`docs/adr/ADR-021-row-filter-on-viewport-query.md:274 @ 2bab186a sha256:38266c5affad4b76a79899edd251680e52edfeed29d45ee40db525c5ed319a76`). Against VARCHAR it refuses `text_with_non_text`, against BOOLEAN `boolean_conversion` (precedence items 1 and 2); against an integer it is admitted by comparison rule 3 (`docs/adr/ADR-021-row-filter-on-viewport-query.md:256 @ 2bab186a sha256:a7f7029f9d64d3e7e0dff7fc43295b6f75ec93e0b78b72d1eafb62fa84324c59`); against a decimal literal within bounds, by rule 4.
  - Inside `+`, `-`, `*` it is an integer expression: beside an integer, admitted by rule 3; beside a decimal literal, refused `conversion_can_fail` (`docs/adr/ADR-021-row-filter-on-viewport-query.md:263 @ 2bab186a sha256:c0eafbcdfb26cf1039898501861dcd3a276125b1de126587439f9a5a084da7d3`), as an integer literal beside a decimal literal already is.
  - §2.1's third bullet stands.
  - §2.3's set condition is unchanged in code. A NULL-typed operand there is a NULL literal or a unary `-` over one; the latter is outside this amendment.
- **H-3 and P-0, before any code of this amendment.** H-3: at v1.5.5 the binder types `NULL + NULL`, `NULL - NULL`, `NULL * NULL` and `-NULL` as BIGINT; consistent with S1-1's observed column casts to BIGINT, not proven by them. P-0: the worker runs a throwaway test, never committed, on B-T1's oracle connection, printing `typeof` of the four expressions, and records the printout with the commit it ran at and the DuckDB version, as evidence. Predicted: BIGINT for all four. A different numeric type: STOP, no code, return to the custodian; the type names here are corrected by a further amendment, never edited. A NULL or non-numeric type: STOP; this remedy is void and the route returns to the architect.
- **§3, new B-T3 rows,** appended after C47 in this order:

| # | Predicate | Predicted |
|---|---|---|
| C48 | `zone = NULL + NULL`; `flag = NULL + NULL`; `zone = NULL - NULL`; `zone IS DISTINCT FROM NULL + NULL`; `zone BETWEEN NULL * NULL AND NULL` | TNA `=`, `VARCHAR; BIGINT expression`, `text_with_non_text`; TNA `=`, `BOOLEAN; BIGINT expression`, `boolean_conversion`; TNA `=`, `VARCHAR; BIGINT expression`, `text_with_non_text`; TNA `IS DISTINCT FROM`, `VARCHAR; BIGINT expression`, `text_with_non_text`; TNA `BETWEEN`, `VARCHAR; BIGINT expression`, `text_with_non_text` |
| C49 | `flag AND NULL + NULL` | TNA `AND`, `BIGINT expression`, `boolean_conversion` |
| C50 | `i64 BETWEEN NULL + NULL AND 1`; `u8 = NULL * NULL` | admitted (rule 3) |

  - C48's first four are S1-1's observed shapes; its fifth reaches `BETWEEN` and `*`. C49 is the boolean junction. C50 is the integer path. Each refusal's sentence is true of its shape: the binder converts the text or BOOLEAN operand to the integer type.
  - H-4: the surrogate prepare binds C48's fifth predicate and C49 at v1.5.5. A `rejected_by_binder` outcome is a class-2 result.
  - The type names in C48 and C49 are P-0's; H-3's BIGINT is the prediction.
  - C39 keeps its prediction; it is now admitted by rule 3.
- **B-T1 pins.** Appended to part 3: C48 (five), C49, C50 (two), and `f32 > NULL * NULL` (refused; no B-T3 row, §5 below). Part 3 goes from 332 to 341 cases, the total from 9,714 to 9,723.
- **§4.** B-T3 gains C48 to C50. New mutation M6: §2.1's arm types its result NULL (the arm as at c6809d0c). Fails on C48's first predicate: expected `TypeNotAdmitted`, got `Ok`. M1 to M5 stand; M1 still fails on C39. B-T1 claims no new mutation. B-T1b is unchanged at 2,083 (F5).
- **§5.**
  - P-1 covers C48 to C50 as tabled.
  - P-3 is restated: at the head, B-T1's refused tally equals the merge base's plus this amendment's seven refused pins; its admitted tally equals the base's plus eleven (§3's nine and C50's two); B-T1b's checked count is equal at both.
  - Declared changes outside §3, not rows: a NULL-op-NULL result against a REAL or DOUBLE column or a double literal refuses at the comparison with the residual reason (rules 5 and 7 by bit width), as F7's example does; beside a decimal literal in `+`, `-`, `*` it refuses `conversion_can_fail` at that operator. Both shapes were refused at the merge base, by the inner operator; only the construct, the operand types and the reason move. They join F7's routing.
  - New invalidators: P-0 differs from H-3 (stop as above); a C48 or C49 shape admitted.
- **§8.** New item 20: §2.1's result typed other than as P-0 observed, or code of this amendment before P-0's record. Item 7's second bullet is read with the O-2 disjunct's read of the partner as a fourth named place (question round 45, item 1); the field's doc comment and the comment at the set condition are corrected in the code to say so (the reviewer's S2-1).
- **§9.** Reviewer: P-0's record; M6 observed by name at a commit, then reverted; P-3's two runs. Architect: §2.1 as replaced against the Note 2026-09-30, item 2 and the Note 2026-10-03, item 2.
- **§2.6, what a client sees.** The C48 and C49 shapes are refused `filter_type_not_admitted` with the tabled reasons; at the merge base they were refused with `conversion_rounds` at the inner operator, and at c6809d0c they were admitted.
- **§7.** Unchanged. Estimated with this amendment: 220 to 240 of 300, over the same 2 files. An overrun is class 8, and §7 is not edited.

### Amendment 2 — 2026-10-04, scope addition (question round 49, item 1): unary `-` over a NULL literal typed as the binder types it (the reviewer's N-1)

*Class 9, scope addition, on the human's ruling of question round 49, item 1, cited and not reproduced. Written after gate 1's results; declared before any of its code. The defect is the reviewer's N-1 (`state/consults/gates/2026-10-04-type-walk-null-literal-arithmetic-gate1-reviewer.md:48 @ 2bab186a sha256:2f1fb814b9207a310b36c3a0d303bc5f99fc20674eba0d75f6d35082489dda3b`), pre-existing on main in the predecessor's §2.5(b) as amended (`engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:384 @ 2bab186a sha256:ead68a0bfc29a36e606ee8f9fe4893520b106be095cf17d64638c66cd522de85`) and its C32 (`engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:389 @ 2bab186a sha256:6ad5eb7ec3a024f88257a04e8cd6036845a74300d8014e215a984331fe286849`).*

- **§2.9 (new).** Unary `-` over a NULL literal is admitted, typed as P-0 observes for `-NULL` (H-3: BIGINT), kind expression, within bounds. Over a numeric operand the unary arm is unchanged and carries every attribute but kind, §2.3's field included (C47). With Amendment 1, no path of the walk produces the NULL type except a NULL literal. So comparison rule 2, arithmetic rule 2, the BOOLEAN-or-NULL junction test, the pattern test, the reason precedence and §2.3's set condition each test a NULL literal, as the Note 2026-09-30, item 2 (`docs/adr/ADR-021-row-filter-on-viewport-query.md:255 @ 2bab186a sha256:4a4898e23ea42b6cf4d6f501509e8b39ea9f111448eaabbd6f90d84b185845f9`) and the Note 2026-10-03, item 1 (`docs/adr/ADR-021-row-filter-on-viewport-query.md:273 @ 2bab186a sha256:9f02c28706a01d3dde1f78f300863128f5bfd10fc948feeb5e6411dc367eef5e`) name it. None of them changes in code.
- **§3, new B-T3 row,** appended after C50:

| # | Predicate | Predicted |
|---|---|---|
| C51 | `zone = -NULL`; `flag = -NULL`; `zone IS DISTINCT FROM -NULL`; `flag AND -NULL` | TNA `=`, `VARCHAR; BIGINT expression`, `text_with_non_text`; TNA `=`, `BOOLEAN; BIGINT expression`, `boolean_conversion`; TNA `IS DISTINCT FROM`, `VARCHAR; BIGINT expression`, `text_with_non_text`; TNA `AND`, `BIGINT expression`, `boolean_conversion` |

  - The first three are N-1's observed shapes; the fourth is the boolean junction, under H-4. C32 keeps its prediction (admitted), now by rule 3; its B-T1 pin stands.
- **B-T1 pins.** Appended to part 3: C51 (four) and `f32 > -NULL` (refused; no B-T3 row). Part 3 goes from 341 to 346 cases, the total from 9,723 to 9,728.
- **§4.** New mutation M7: the unary arm keeps the NULL type over a NULL literal (its behaviour on main at 2bab186a). Fails on C51's first predicate: expected `TypeNotAdmitted`, got `Ok`.
- **§5.**
  - P-3's refused pins become twelve; its admitted pins stay eleven.
  - Declared changes outside §3, admitted at the merge base and refused after, not rows, routed with F7: `-NULL` against a REAL or DOUBLE column or a double literal (residual reason); `-NULL` beside a REAL or DOUBLE column or a double literal in `+`, `-`, `*` (residual reason); `-NULL` beside a decimal literal in `+`, `-`, `*` (`conversion_can_fail`), which also ends c6809d0c's admission of `(-NULL) - 0.5 > 0`. §1's claim that no other admission outcome changes is narrowed to exclude these and C51.
  - New invalidators: a C51 shape admitted; an existing B-T3 row moves.
- **§8.** New item 21: the NULL type produced by anything but a NULL literal.
- **§9.** Reviewer: M7 observed by name at a commit, then reverted. Architect: the NULL-literal reading at each of §2.9's readers.
- **§2.6, crossing under C2.** C51's shapes move from admitted (an empty stream, or for `zone IS DISTINCT FROM -NULL` a stream error naming a file value) to `filter_type_not_admitted` with the tabled reasons; the degenerate shapes in §5 above move from admitted to refused. No code under `kernel/`, `protocol/`, `frontends/` or `renderer/`.
- **§7.** Unchanged. Estimated with Amendment 1: 250 to 275 of 300, over the same 2 files. An overrun is class 8, and §7 is not edited.
