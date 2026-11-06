Reviewed: PR #290 at 2aca68983bd53f1d65cc993810c130ca9c09f5f9 (base 8963de60), gate 1, architect
Verdict: PASS WITH NOTES
Branch: `cut/skp-filter-dialect-unsupported-ruling` @ 2aca68983bd53f1d65cc993810c130ca9c09f5f9. Unless a cite names another revision, every line cite below is at this commit, read in the worktree `C:/dev/wt/sfdu`. I have no shell, so this report gives no sha256 of its own, and I left no background shell running.

## Findings by class

**Correctness: none blocking.** Every comment clause the worker wrote matches the code at the head (check 6). One clause of the human's red-line text does not match the code at the head. It goes to the human below, with no replacement words.

**Evidence: none blocking.**
- I could not run M-1, M-2, the suite or CI. For those I relied on the worker report. The reviewer observes the runs itself.

**Documentation (fix in this PR before the merge):**
- **D-1. The form has no class 6 amendment for the size overrun.**
  - Requirement: `governance/AUTONOMY.md` §21c, the size-overrun clause (round 5, item 2), and the form's own §1 and Amendment 1 both require the overrun to be recorded as a class 6 amendment, with the Scope line not edited.
  - Evidence: the packet gives the numstat as 180 lines against 150. The form at main has only Amendments 1 and 2. The Scope line still reads "6 files" and "declared line budget 150", which is correct because it must not be edited.
  - Closure: append a class 6 amendment to the form that gives the numstat (180 against 150) and names T1, which is 61 lines in commands.rs, and the three note files Amendment 1 added. The overrun carries nothing outside the Scope.
  - No sentence words are needed; this is a record row.

## For the human

**H-1. Under ADR-033's note, ADR-033's counts read ten, but the code at the head has eleven.** This is your typed wording. I give the evidence and no replacement words.
- The note says "this ADR's two counts … include `skp.filter_dialect_unsupported` … each reads one lower".
- That clause is true of the code set ADR-033 counted when it was accepted (2026-09-14). That set had eleven codes, the dialect code among them, because ADR-021's Note 2026-09-30 had not yet added `filter_type_not_admitted`.
- ADR-033 was never raised to twelve. Read one lower, its counts become ten.
- At the head:
  - `FilterError` has eleven variants (engine/src/predicate.rs:259-328);
  - `filter_error_of` has eleven arms (kernel/src/skp.rs:2290-2352);
  - ADR-021's note of the same date reads eleven (ADR-021:281);
  - docs/02 reads eleven (docs/02:84).
- The worst case is ADR-033:19. Under the note, "`Filter(FilterError)` for all eleven admission-content refusals" reads ten, and the code has eleven. The decision text describes the landed code.
- The piece applied your text byte for byte, as Amendment 1 directs, so I do not hold the piece on this. It should reach you before the merge click: either you accept that ADR-033 is read as of its acceptance date, or you give other words.

**H-2. ADR-033 states these counts in three places, not two.** Your note says "two counts". The sites are:
- ADR-033:19, "for all eleven admission-content refusals";
- ADR-033:19 again, "ADR-021 item 8's eleven-code `skp.filter_*` list untouched";
- ADR-033:25, "ADR-021's eleven-code list untouched".

These are two counted quantities, `FilterError`'s refusals and ADR-021's list, stated in three places on two lines. Read that way, "two counts" holds. Each of the three includes the struck code.

**H-3. ADR-021's note holds on one reading, which I name here.** The note says "Decision 8's list … read with that code removed, eleven".
- Decision 8's own list (ADR-021:93-96) names eleven codes, the struck one among them. Taken alone and without it, that list has ten.
- With the twelfth code that the Note of 2026-09-30, item 6, added to Decision 8 (ADR-021:267), the list has eleven. That matches `filter_error_of`.
- So the clause is true if Decision 8's list is read as the Note of 2026-09-30 amended it. I take that reading.

## Checks

**1. §21a's categories** (`governance/AUTONOMY.md` §21a), against the Out-of-scope line read with Amendment 1:
- **ADR: touched, as excepted.** Two dated notes are appended, to ADR-021 and ADR-033. There is no Status-line change and no amendment beyond those notes.
- **Security: not touched.** The ADR-021 note does not touch the bundling or no-runtime-fetch property.
- **Wire: touched, as declared.**
  - SKP-V0 §7.5 loses one row (base :498), and the note is added at head :523.
  - No literal changes: `skp/0.12` is at protocol/skp/src/v0/mod.rs:115 and frontends/shell/src/skp/types.ts:15, and neither file is in the diff.
  - No key, field or command changes, and no fixture changes: the nine-file list has no tests or fixtures.
  - No produced code changes: the struck code was never constructed by product code. At the base, the only construction was the kernel test at skp.rs:2806.
- **Guarantee: touched, as declared.**
  - The struck mapping's test goes with its variant.
  - Each of the four exhaustive matches loses one arm and nothing else (code_of at admission_property_campaign.rs:624-638, campaign_code_of at filter_type_admission.rs:873-887, `filter_error_of`, Display).
  - No other assertion changes. I relied on the worker report's test lists: 1078 at commit 1, 1077 at commit 2, and the only missing name is the struck test.
- **Size:** §21c is exceeded (180 lines, nine files). Both gates already run from dispatch (§36), so the gating route does not change.

**2. The human's words, clause by clause against the head.** I compared each span by eye with its source line; I computed no hashes. Each span is present and unwrapped:
- SKP-V0:523 against the strike directive's line 23;
- ADR-021:281 against the 2026-11-06 directive's line 9;
- ADR-033:47 against that directive's line 10;
- docs/02:84, whose parenthesis matches the directive's line 11.

SKP-V0's note:
- **C1 (struck from §7's refusals): true.** The §7.5 table at :496-507 has ten rows without the code. The only hit for `filter_dialect_unsupported` in SKP-V0's §7 is the note at :523. `FilterError` has no such variant, and `filter_error_of` has no such arm.
- **C2 (no host produced it): true.** At the base, as read at main, whose nine files are unchanged, `DialectUnsupported` appears only at the variant, its Display arm, two test-helper arms, the kernel arm and the kernel test at skp.rs:2806. There is no product constructor.
- **C3 (fails at deserialization as a shape error): true.**
  - `Filter`'s Deserialize (commands.rs:412-425) maps `Filter::new`'s Err through `serde::de::Error::custom`.
  - Only two types carry `Filter`: `ViewportQueryRequest` (:442) and `FilterApplyParams` (:544, through `key_present`, :547-549). T1 covers both.
  - The conformance runner treats `reject_at_deserialize` with Err as a pass (protocol/skp/tests/conformance/main.rs:44).
- **C4 (before any such code is chosen): true.** The shell's bindings take `request: ViewportQueryRequest` and `request: RecordStepRequest` as Tauri command arguments (frontends/shell/src-tauri/src/commands.rs:90 and :140), so decoding happens before the handler runs.
- **C5 (skp/0.12 stands): true.** Both literal sites are as given in check 1.
- **C6 (no fixture changes): true.** No fixture is in the nine-file list.

ADR-021's note:
- "struck" is true, and "no host produced it" is true (C2).
- "a dialect other than the one literal fails at deserialization" is true (C3).
- "Decision 8's list and the Notes' count of twelve read … eleven" is true on H-3's reading. The counts of twelve are at :267 and :275.
- "Decision 8's exhaustive mapping stands over the eleven" is true: `filter_error_of` has eleven arms and no wildcard arm (skp.rs:2290-2352).

ADR-033's note: its count sites are named in H-2. The consequence goes to the human (H-1).

docs/02:84: "eleven typed `skp.filter_*` refusals" is the count after the strike. At the head, the codes are the ten table rows plus `filter_type_not_admitted`, which is eleven. That equals `filter_error_of`'s arms and the eleven `filter_*_maps_to_its_code*` tests (skp.rs:2801-2914). The parenthesis follows "refusals", as Amendment 1 reads it.

Placement:
- **ADR-021:** the base ends at :275. The head adds a blank line, `## Note 2026-11-06` (:277), a blank line, the italic line from Amendment 1 (:279), a blank line and the span (:281).
- **ADR-033:** same pattern, :43-47 after the base's :41.
- **SKP-V0:** the note sits after the `skp/0.8` note and before the `### 7.6` heading, with one blank line before it (:522) and one after it (:524).
- Above each note heading, I read the regions next to the appended text and they match the base. For the bytes above those regions, I relied on the packet's script, which found the base file to be a prefix of the head file. I cannot run that check myself.

**3. ADR-021 and ADR-033 are otherwise as written, and nothing else is touched.**
- The packet's numstat and the worker's `--name-only` both list exactly nine files: no other ADR, no KNOWN-LIMITATIONS.md, no owner's index (engine/README.md or kernel/README.md).
- In ADR-021 and ADR-033, the only additions are the tails described in check 2.

**4. Block-on-sight:**
1. **Met.** #286 merged at 11:08:07Z (Amendment 1). The worktree's reflog (the main checkout's `.git/worktrees/sfdu/logs/HEAD`, epoch times converted by hand) shows the worktree created at 12:10:11Z, then commits at 12:21:34Z (02054337), 13:13:21Z (6444682c), 13:17:52Z (1ff549a3) and 13:18:26Z (2aca6898). The reviewer confirms with git.
2. **Met.** Only the nine paths that Amendment 1 allows are changed. The form, PLAN.yaml and FILLER-QUEUE.md are not on the branch.
3. **Met.** The note is one unwrapped line, with `> ` as the OPEN-2 (a) form sets out, and no emphasis or heading.
4. **Met.** There is no "reserved" line and no words around the note. SKP-V0's numstat is 2 inserted (a blank line and the note) and 1 deleted (the row).
5. **Met.** The only ADR and docs/02 changes are Amendment 1's three exceptions. No literal, fixture or golden changes.
6. **Met.** No comment claims ADR-021 matches the code:
   - the `admit` doc and the comments at skp.rs:1453 and :2955 drop their ADR-021 cites;
   - skp.rs:1781 cites item 8 only for the no-wildcard discipline;
   - the comment above `code_of`, whose doc cites ADR-021 item 8 (admission_property_campaign.rs:622), is out of Scope and makes no claim that the code matches.
7. **Met.** I checked each comment clause against the code; see check 6.
8. **Met on the record.** I relied on the worker report's "**Mutations.**" paragraph:
   - each mutation was observed by name, at 6444682c, and reverted;
   - the report does not mention a `verify-mutation` run;
   - T1's doc names the full commit hash twice (commands.rs:896 and :901).

   I also checked the line numbers. The reported failure lines are :921 for M-1 and :898 for M-2. They reconcile with the head's :930 and :910 once commit 3 adds 10 lines and each mutation changes the line count (M-1 +1, M-2 −2). The reflog shows no checkout after commit 4, which is consistent with both runs happening between commits 2 and 3 (13:13:21Z to 13:17:52Z). The reviewer re-observes both.
9. **Met.** No assertion is loosened: only the struck test and its four arms are removed.
10. **Not verifiable by me.** I relied on the worker report's "**CI on head 2aca6898.**": five push runs, all successful. The PR-event runs are locators only in the packet. The reviewer reads them.

**5. T1 at its boundary (commands.rs:890-945).**
- **Real producer:** the requests are built from the real types with `Filter::new(…, FILTER_DIALECT_DUCKDB_EXPR_0)` and a parsed `DatasetHandle`, then passed through `serde_json::to_value`. Only `dialect` is replaced in the JSON (:928, :942). This is the same Deserialize the Tauri bindings run.
- **Rows:**
  - V0: `expect` (:926);
  - V1: `unwrap_err`, then `contains(expected)` (:929-930);
  - R0: (:940);
  - R1: (:943-944);
  - (iii): two `contains` checks (:910, :912).
- **M-1** (a fixed "unsupported filter dialect" message) leaves `expected`, which also names the dialect and the admitted value, missing from V1's message, so T1 fails at :930. The existing test at :732-737 asserts only `is_err`, and conformance passes on any Err, so both stay green.
- **M-2** (an empty Err) makes `expected` empty, so T1 fails at :910, check (iii)'s first assertion. Both failures are where §3 of the form predicts.

**6. The worker's comments, clause by clause. All are true at the head, so no replacement words are needed.**
- **`admit` doc (predicate.rs:109-115):**
  - "eleven variants" is true.
  - "admit can return each of them" is supported: every variant is constructed inside the module, at TooLong :124, RejectedByBinder :152, Unparsable :488, NotASingleExpression :583, ConstructNotAdmitted :523, IdentityAliasAmbiguous :1184, ColumnNotFilterable :1191, UnknownColumn :1205, NotBoolean :1371, TooDeep :925 and TypeNotAdmitted :1978.
  - The variants arrive wrapped by `.into()`.
  - Lease exhaustion is the sibling `ConnectionsExhausted`.
  - The doc makes no ADR claim.
- **`FilterError` doc (:248-257):**
  - "eleven" is true.
  - "§7.5's … ten table rows plus the `skp/0.8` note's row" is true (SKP-V0:496-507 and :518-521), and the fields match field for field.
  - "records the struck … in its note of 2026-11-05" is true (:523).
  - "`filter_error_of` maps each variant to its code by name" is true.
  - The no-wildcard sentence is carried over unchanged from the base.
- **`PredicateAdmitError` doc (:386-398) and the `Filter` variant doc (:401):** "eleven" is true. "(History: `FilterError` had twelve variants until the dialect variant was removed.)" is true as history: the base had twelve (base :255-333).
- **skp.rs:1453 and :1456:** "the eleven typed `skp.filter_*` codes" and "those eleven" are true.
- **`filter_error_of` doc (skp.rs:2282-2287):**
  - "SKP-V0 §7.5's taxonomy, field for field" is true.
  - "a twelfth `FilterError` variant fails this build" is true: the match has eleven arms and no wildcard.
- **`predicate_admit_error_of` doc (skp.rs:1769-1781):**
  - "mints no code that either side … does not already mint" is true.
  - "the discipline of ADR-021 item 8" is true: item 8 states "exhaustive, no wildcard arm" (ADR-021:93).
- **Test-block header (skp.rs:2792-2798):** "every one of `FilterError`'s eleven variants gets its own test" is true: there are 11 `filter_*_maps_to_its_code*` tests at :2801-2914.
- **skp.rs:2955:** "eleven-code route" is true.
- **`FILTER_DIALECT_DUCKDB_EXPR_0` doc (commands.rs:374-379):**
  - "the only value `Filter::new` accepts" is true (:400).
  - "refused at construction and, through the same constructor, at deserialization, as a serde error" is true (:424).
  - "before any host code runs" is true in SKP-V0's sense of "host", the kernel handler.
  - "No `skp.filter_*` code is produced for a wrong dialect" is true.
  - The "later phase" claim is gone. The first sentence, with `skp/0.1`, is unchanged from the base.
- **T1's doc (:890-902):** each clause is true against :906-944.
- **The removed `state/NEXT-CUT.md` "design essential 5" cites, in three places:** state/NEXT-CUT.md contains no "design essential" or `filter_` text at all, so the old cite was stale. Each replacement cite is SKP-V0 §7.5, which is true (see above). Each sentence stays true after the removal.
- **Off-scope notes, not this piece's:**
  - `Filter`'s doc at commands.rs:382-387 ("`skp/0.1`", "a later phase") is left for the drift sweep.
  - SKP-V0's §8 at :986 ("the twelfth `skp.filter_*` code") is append-only history.

**7. Amendment 2's reading of I-2.** These are the case-insensitive hits at the head:
- engine/src/predicate.rs:253 is inside engine/, so I-2 does not apply to it.
- governance/CUSTODIAN-QUEUE.json:65 is the node's title.
- site/data/plan.json has one hit, found by grepping that file directly; a grep over the whole directory skips it.

There is no hit in any `*.ts` or `*.tsx` file. commands.rs's doc no longer names the code. The two JSON files are exactly the files Amendment 2 excepts, and there is nothing else.

## The packet's gaps
- Commit times for block-on-sight 1 were not in the packet. I read them from the worktree's reflog.
- Where ADR-033's counts sit at the head was not in the packet; the form cites them at f2fbb4ff. There are three occurrences, not two (H-2).
- The packet does not say whether M-1 and M-2 ran on a checkout of 6444682c or on the working tree between commits 2 and 3. I inferred the second from the reflog.
- PR-event CI statuses are locators only, which is by design. I had no `gh`.
- The packet gives no fact about ADR-033's counts predating ADR-021's twelfth code. That fact is what H-1 rests on.
