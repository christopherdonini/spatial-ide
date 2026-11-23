# Preregistration: text-id-opens-for-the-session-by-row-position (full form)

*Committed by the custodian on 2026-11-23 from the architect's draft (`state/consults/2026-11-23-text-id-opens-for-the-session-by-row-position-architect-form-draft.md`; the hand-back 36191 bytes, sha256 785a85bd353262b7a77ea20db06c5d7943d95fca354282d759b3f3116393c85f): its text from the title to the line before its end mark, byte for byte, with this note put after the title. The note after the end mark stays in the consult. Read the last amendment first.*

**Status.** This form is drafted, and its gates run, on an unapproved draft: the architect's draft of ADR-016 Amendment 3 (`state/consults/2026-11-23-text-id-opens-for-the-session-by-row-position-adr-016-amendment-architect-draft.md`, 22052 bytes, sha256 598373a26126c28a0e27dfb354f880570c09ade77ff05fc24184023386e63a22, the sha256 as the custodian's brief gives it). The human has not approved that draft. The build is not dispatched before the human approves it (ADV-2026-11-23-33 item 5). If the approved text differs from the draft, this form takes an amendment, and the gate reads what changed.

- **Proposed path:** `governance/forms/frontends/TEXT-ID-OPENS-FOR-THE-SESSION-BY-ROW-POSITION-PREREGISTRATION.md`
- **Node:** `text-id-opens-for-the-session-by-row-position` (`governance/PLAN.yaml:5038-5054` @ a2d58940).
- **Authority:**
  - the human's message of 2026-11-23 (`state/directives/2026-11-23-the-humans-message-text-id-files-open-for-the-session-by-row-position-ahead-of-the-recovery-offer-and-a-bbox-consult.md`), items 1 to 3 and 5. Its requirements are at `:10` and are referenced here, not reproduced.
  - ADV-2026-11-23-33 (`state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-33-the-text-id-piece-placed-second-the-adr-016-draft-filed-as-a-draft-the-recovery-offer-build-held-on-bases.md`), items 2, 4, 5, 6 and 9.
  - The class rule: ADV-2026-11-16-06 item 2 (a).
  - ADV-2026-11-23-15 items 4 and 5.
  - ADV-2026-11-23-26 items 1 to 3.
- **Reuse index:** output byte for byte, from tools/reuse.mjs in the read-only reuse clone at 89bbac37, run by the custodian on 2026-11-23:
  `No prior art recorded for "open a file for the session by row position when its text id column cannot serve". Research it before planning an implementation.`
  This is a miss. Nothing is reused, and the mechanism below is drafted from this repository's code alone.
- **Evidence, not Authority:**
  - the tester's probe (`state/consults/2026-11-23-text-id-opens-for-the-session-by-row-position-probe-tester-report.md`, run at f0718827, kernel only, asserting nothing);
  - the architect's ADR draft named above.
- **Drafted by:** the architect, reading only at a2d58940d283be8eb050730216f0e90b6084a0fd. Every `path:line` in this form is at that commit unless it names another.
- **Gates:** architect and reviewer. Two gates, a full form.

## §0 Disclosure: the draft read against the code

The draft's readings hold against the code:
- File A is refused at `engine/src/identity.rs:333-344`, with an empty candidate list (`:304`).
- File B is refused and lists `parcel_key` (`identity.rs:299-315`).
- File C takes the early return to the session tier (`engine/src/dataset.rs:2008-2010`).
- The identity-alias rule is Mapped-only (`engine/src/predicate.rs:1132-1144`). So on a session-tier open of a file that has its own `id`, a predicate naming `id` would be admitted and would filter the file's column (`engine/src/stream.rs:1438-1440`, `:1475-1478`).
- The reserved name is refused (`engine/src/attributes.rs:468`).
- A session-tier open saves `"identity": null` (`kernel/src/dataset_ref.rs:216-233`, `:282-298`, `:383-388`).
- Publish refuses the tier (`kernel/src/publish/mod.rs:513-520`).
- A reopen refusal opens no form (`frontends/shell/src/admission/AdmissionPanel.tsx:276-277`).
- Item 3's stale cites are real (`KNOWN-LIMITATIONS.md:68`).

Where this form adds to the draft or departs from it, each finding first:
- **F1 (operator-visible).** The refusal Display beside which the new button appears (`engine/src/error.rs:359-364`) ends: "Synthesizing a row ordinal instead is the hazard ADR-010 rule 2 exists to prevent". Shown beside a button that opens by row position, that sentence contradicts the offer. This goes to the advisor as OPEN-A2.
- **F2 (a further cost of the narrow reading).** The shell cannot tell a text-type refusal from the other refusals of `id` without parsing the prose detail. The refusal's fields are `column`, `detail` and `candidate_columns` (`kernel/src/skp.rs:2223-2237`). Under the broad reading, the shell's offer condition is exactly the engine's acceptance set:
  - refusal `engine.identity_unusable`;
  - field `column` equal to `id`;
  - no declaration in the attempt.
  For a native `id`, "no such column" is unreachable (`dataset.rs:1998-2010`), and so is "not addressable" (comment at `dataset.rs:2013-2018`). Under the narrow reading the shell either needs a new refusal field (a wire change) or offers a button the engine then refuses.
- **F3.** The choice cannot travel inside the wire `IdentityDeclaration`, because that type is also what a project records (`kernel/src/dataset_ref.rs:36`, `:216-233`). It is therefore a new member on `OpenDatasetRequest`.
- **F4.** S-4 cannot be told apart by `source_column` alone: a mapped identity may be declared from a file column literally named `file_row_number`. So `FilterError::IdentityAliasAmbiguous` (`predicate.rs:285`, Display `:352-357`) gains a field that names the tier.
- **F5.** Decision 1 requires a carried-choice line, and the draft words none. This form adds S-5 as a draft for the advisor.
- **F6.** The engine messages for Decision 2's three by-name refusals are unworded in the draft. This form adds S-6a to S-6c as drafts for the advisor.
- **F7.** Under Amendment 2, declaring from a row-position open must not carry the choice into the new attempt, or the engine refuses the combination. Test S-T6 below covers it.

## §1 Claims and class

- **Claim:** under the draft's Decisions 1 to 6, a file whose own `id` column cannot serve opens on the session tier only when the user chooses it, and the summary says so. Nothing of the choice reaches a project file, a session history or a publish.
- **Class: full.** This is ADV-2026-11-23-33 item 5. Of ADV-2026-11-16-06 item 2 (a), the piece meets:
  - anything on the wire;
  - an ADR;
  - what the user is told about the state of their data (a refusal, and a new choice beside it);
  - a piece that crosses a seam between modules (engine, kernel, protocol and shell);
  - a piece over 260 changed lines.
  It also touches persistence, by proving that nothing new is written.
- **No performance claim is made** (docs/08). The broad reading re-runs the uniqueness scan for an `id` refused for its values. Its cost is stated, not measured.

## §2 The mechanism (drafted for OPEN-H1 broad, OPEN-H2 C2, OPEN-H3 Decision 5)

**Engine**
1. `engine/src/dataset.rs`:
   - A new `pub fn Dataset::open_cancellable_setting_aside_file_id(path, assertion, declared_identity, cancel, connections)`. Its only product caller is item 5 below. It calls `open_inner` with `set_aside_file_id: true`. The existing `open_cancellable` (`:296-310`) passes `false`, and its signature does not change.
   - `admit_identity` (`:1961-2106`) gains `set_aside_file_id: bool`. When it is true, the function:
     - (a) refuses by name if `declared` is `Some`, before any lookup or scan (S-6b);
     - (b) refuses by name if the file has no `id` column (S-6c);
     - (c) otherwise runs the existing native path unchanged: the type check, then for an admitted type the whole-column scan, cancellable;
     - (d) if (c) returns `EngineError::IdentityUnusable`, returns `DatasetIdentity::new_session_ordinal(candidate_identity_columns(schema))`, marked as set aside;
     - (e) if (c) admits the column, refuses by name (S-6a). Nothing opens.
   - Any other error from (c) passes through unchanged: `Cancelled` (`:2071-2073`), and `Query`.
   - The partitioned refusal still comes first (`:327-329`).
   - The doc of `identity_verification_scans` (`:78-86`) names N-3's test among its callers, as the instrument exemption requires.
2. `engine/src/identity.rs`:
   - `DatasetIdentity` (`:186-279`) records the set-aside, private, and gains `pub fn set_aside_column(&self) -> Option<&'static str>`, which returns `Some("id")` only on such an open.
   - Its product callers are the describe at item 6 and `predicate.rs` at item 4.
   - The session statement (`:150-154`) does not change (Decision 3).
3. `engine/src/error.rs`:
   - A new `EngineError::IdentitySetAsideRefused { detail }`, with an engine-fact Display (S-6a to S-6c).
   - Under OPEN-A2's recommendation, the last sentence of the `IdentityUnusable` Display (`:359-364`) is removed.
   - Regions: the new variant beside `:182-189`, and `:359-364`. These are disjoint from the partitioned refusal's `:182-188` and `:386-391` (its form's Scope).
4. `engine/src/predicate.rs`:
   - `identity_alias_ambiguity` (`:1132-1144`) gains an arm: a session-ordinal identity whose `set_aside_column()` is `Some` returns `("id", "file_row_number")`, with a tier flag.
   - `FilterError::IdentityAliasAmbiguous` gains `by_row_position: bool`, set at `:1184-1187`. The Display at `:352-357` takes S-4 when the flag is true.
   - The wire code `skp.filter_identity_alias_ambiguous` is unchanged.

**Kernel**
5. `kernel/src/lib.rs`: a new `Catalog::open_cancellable_setting_aside_file_id`, beside `:219-236`, with the same shape as `open_cancellable`. Its product caller is item 6.
6. `kernel/src/skp.rs`:
   - `open_under` (`:1139`) branches at `:1205-1207` on `req.set_aside_file_id`.
   - `error_of` (`:2138`, no wildcard) gains the arm `engine.identity_set_aside_refused`, field `detail`.
   - The describe `IdentityInfo` build (`:2034-2052`) sets `set_aside_column`.
   - `filter_error_of` (`:2340-2350`) and its test constructor (`:2879-2884`) take the new field.
7. `kernel/src/project/mod.rs` (C2):
   - `open_project` (`:701-707`) gains `set_aside_file_id: bool` and passes it into the request literal at `:819-825`.
   - `open_project_command` (`:894-915`) reads it from the request.
   - What is recorded does not change (`dataset_ref.rs` is untouched).

**Wire (SKP)**
8. `protocol/skp/src/v0/commands.rs`:
   - `OpenDatasetRequest` (`:19-40`) gains `set_aside_file_id: bool`. It is required and has no serde default, so the member is always present.
   - `IdentityInfo` (`:190-222`) gains `set_aside_column: Option<String>`, present and null except on such an open.
   - `OpenProjectRequest` (`:784-794`) gains `set_aside_file_id: bool` (C2).
   - `protocol/skp/src/v0/mod.rs` gains the new literal (`:136`; OPEN-A3).
9. `protocol/skp/SKP-V0.md`:
   - the three members;
   - the error-table row for `engine.identity_set_aside_refused`;
   - one sentence in the `filter_identity_alias_ambiguous` paragraph (`:512-519`) for the session tier;
   - the literal.

**Shell**
10. `src/skp/types.ts` (`:43`, `:131-146`, `:387`) and `src/skp/client.ts`:
    - `openDataset` (`:82-95`) gains `setAsideFileId = false`;
    - `openProject` (`:165-172`) gains it as well (C2).
11. `src/admission/admitDataset.ts`: `AdmitOptions` (`:35-39`) gains `setAsideFileId?: true`, passed through by `admitDataset` (`:48-75`). `src/project/openProject.ts`'s `admitProject` (`:62-78`) passes it (C2).
12. A new `src/admission/RowPositionChoice.tsx` holds S-1 and S-2. Its one caller is `AdmissionPanel.tsx`, which renders it:
    - in the refused identity block beside `IdentityDeclarationForm` (`:572-576`), when all of these hold:
      - the refusal is `engine.identity_unusable`;
      - `fieldValue(refusal, "column") === "id"` (`formatRefusal.ts:44-45`);
      - `options.identity` is unset;
      - `options.setAsideFileId` is unset;
    - (C2) on a reopen refusal with the same condition. That case alone renders the choice while `formFamily` stays null (`:276-277`); no declaration form is shown.
    - Choosing re-runs `runAdmitPath` (`:216-292`) with `{...options, identity: undefined, setAsideFileId: true}`. A reopen keeps its `answer` and `relink`.
    - The CRS block's carried line (`:552-557`) gains S-5 when the options carry the choice.
    - `openLivenessText` (`:167-173`) is unchanged ("Opening…" stays true for the choice).
    - The identity route's `declarationOptions` (its Amendment 2) drops `setAsideFileId`. If that function is not in a Scope file at the base, it is a class-9 addition, declared before code.
13. `src/admission/describeSummaryText.ts` (`:37-39`, `:56-58`) and `DescribeSummary.tsx` (`:65-70`): S-3 is shown beside the session statement when `set_aside_column` is not null.

**Strings.** Every one is a draft, shown with where it goes and whose it is. S-1 to S-4 are the draft's words, copied from the draft's section 8, unchanged; the code shows no clause of them untrue.
- **S-1 (advisor; button, `RowPositionChoice.tsx`):** "Open for this session by row position"
- **S-2 (advisor; beside S-1):** "This file's own id column cannot serve as its identity. You can open it as a file with no id column opens: features are identified by their position in the file, for this session only. Nothing of this choice is saved or published, and opening the file again asks again. If the column was refused for its values, it is checked across the whole file again first."
- **S-3 (advisor; summary, `describeSummaryText.ts`):** "You chose to open this file by row position: its own id column is not its identity."
- **S-4 (advisor; engine Display, `predicate.rs:352-357`):** "refused: `id` is ambiguous — this dataset is identified by row position for this session, and the file also carries its own column named `id`; a predicate cannot say which one it means"
- **S-5 (advisor; new, the carried line in the CRS block):** "Carried into this attempt: open for this session by row position."
- **S-6a/b/c (advisor; new, engine Displays, `error.rs`):**
  - a: "refused: the file's own `id` column serves as its identity, so it cannot be set aside"
  - b: "refused: setting aside the file's `id` column cannot be combined with a declared identity column"
  - c: "refused: the file has no column named `id` to set aside"
  Each states an engine fact. S-6a and S-6b are reachable only if the file changes between attempts, or through a client other than the shell.
- **K-1 and K-2 (the human's sentences, `KNOWN-LIMITATIONS.md:70`; they go to the human):** the draft's section 8 words, unchanged. The human answers under the wording-blocks rule.
- **D-1 cites fix inside Scope.** `KNOWN-LIMITATIONS.md:68` is corrected to `engine/src/identity.rs:324-346` and `engine/src/error.rs:359-364`, as those lines stand at the base.

## §3 Fixtures

Every file is generated; none is copied from the lab folder (item 5 of the human's message).
- **File A:** `IdentityMode::StringIds` (`engine/src/fixture.rs:530-569`, `:754-783`): a text `id` and no integer column. For e2e, a new generator `generate_the_text_id_no_integer_refusing_fixture` writes `text-id-no-integer-refused.parquet` (in `kernel/tests/manual_walkthrough_fixtures.rs`, beside `:503-516`).
- **File B:** `IdentityMode::StringIdsBesideParcelKey`; for e2e, the existing `string-id-refused.parquet` (`:503-516`).
- **A repeating integer `id`:** `IdentityMode::DuplicateIds`; for e2e, the existing `dupkey-refused.parquet` (`:531-544`).
- **A negative `id`:** `IdentityMode::NegativeIds`.
- **No `id`:** `IdentityMode::ForeignKeyColumn`; for e2e, `no-id-column.parquet` (`:483-496`).
- **An `id` that serves:** the default spec.

## §4 Tests

**How red is read.** Red is read at a skeleton commit. There, the new entry points and members exist, and they forward to today's behaviour:
- the set-aside open behaves as a plain open;
- `set_aside_column` is always null;
- the shell renders no choice.

So each test fails for its named reason, never for a compile error. Green is read at the head. Each test has one mutation in the named set **M-TEXTID**, run by `verify-mutation`. A `verify-mutation` run is reported as a run of the mutation set, never as an observation of a mutation.

**Engine:** `engine/tests/text_id_set_aside_session_tier.rs` (new)

| id | test | red at skeleton because | mutation (M-TEXTID) |
|---|---|---|---|
| N-1 | `file_a_text_id_with_no_integer_column_opens_on_the_session_tier_when_set_aside`. A plain open is refused (control); a set-aside open is session-ordinal, `set_aside_column()==Some("id")`, statement unchanged. | refused `IdentityUnusable` | M-1: arm (d) returns the refusal |
| N-2 | `file_b_set_aside_opens_by_row_position_and_lists_parcel_key`. The source is `file_row_number`, never `mapped:parcel_key`; the candidates are `["parcel_key"]`. | refused | M-2: (d) maps the first candidate |
| N-3 | `a_repeating_integer_id_is_scanned_again_then_set_aside`. Session tier; `identity_verification_scans()` delta exactly 1. | refused not-unique | M-3: (d) skips the scan and admits on the type alone (delta 0) |
| N-4 | `a_negative_integer_id_is_set_aside_after_its_scan` | refused negative | M-4: (d) admits only a refusal whose detail names "type" |
| N-5 | `the_set_aside_is_refused_by_name_for_a_file_with_no_id_column`. `IdentitySetAsideRefused`, scans delta 0. | opens on the session tier | M-5: (b) removed |
| N-6 | `the_set_aside_is_refused_by_name_when_the_id_serves`. Nothing opens. | opens `file:id` | M-6: (e) admits native |
| N-7 | `a_set_aside_with_a_declared_column_is_refused_before_any_scan`. Scans delta 0. | opens `mapped:parcel_key` | M-7: (a) moved after the scan |
| N-8 | `a_predicate_naming_id_on_a_set_aside_open_is_refused_as_ambiguous`. Control: file C refuses `id` as an unknown column. | admitted | M-8: the new arm removed |
| N-9 | `a_cancelled_rescan_ends_cancelled_and_opens_nothing`. A pre-cancelled token on file A beside DuplicateIds. **A guard:** it is green at the skeleton, and its proof is its mutation. Declared as such. | (guard) | M-9: (d) admits on any `Err` |

**Kernel**

| id | file / test | red because | mutation |
|---|---|---|---|
| K-1 | `skp_admission_remediation.rs`: `an_open_setting_aside_a_text_id_describes_the_session_tier_with_set_aside_column_id`. Through `SkpHost::open_dataset`: `set_aside_column == "id"`, `session_statement` present, schema `id` `projectable:false`; a plain session open has `set_aside_column` null. | refused | M-10: describe sets null |
| K-2 | same file: `the_set_aside_refusals_reach_the_wire_by_name`. Code `engine.identity_set_aside_refused`, field `detail`, for N-5 to N-7's inputs. | opens | M-11: `error_of` maps it to `engine.identity_unusable` |
| K-3 | same file: `a_filter_naming_id_on_a_set_aside_open_is_refused_as_ambiguous_through_skp`. `source_column:"file_row_number"`, S-4's text. | admitted | M-12: `by_row_position` false |
| K-4 | `kernel/tests/text_id_set_aside_not_saved_or_published.rs` (new): `a_project_file_after_a_set_aside_open_records_identity_null_and_no_choice`. `Projects::save` as at `no_generation_in_persisted_artifacts.rs:965-1018`; the bytes hold `"identity": null` and none of `set_aside`, `file_row_number`, `session-ordinal`; each scan has a positive control. | open refused | M-13: `DatasetRef::linked` writes `"set_aside_file_id": true` |
| K-5 | same file: `a_session_history_after_a_set_aside_open_records_no_choice` | open refused | M-14: the history's admission object gains the member |
| K-6 | same file: `publish_refuses_a_set_aside_open_as_session_tier`. Pattern as `publish_identity_tier.rs:246-302`; `SESSION_REFUSAL_CODE`. | open refused | M-15: the publish check exempts a set-aside |
| K-7 (C2) | same file: `a_project_saved_after_a_set_aside_open_refuses_on_reopen_and_opens_only_when_asked_again`. `open_project(..., false)` refuses `engine.identity_unusable` with column `id`; `(..., true)` opens with `set_aside_column` `id`. | second call refused | M-16: `project/mod.rs` drops the flag |

**Wire**
- **W-1** (`protocol/skp/tests/fixtures.rs`): round-trips new `v0-open_dataset-request-set-aside.json` and `v0-describe-response-session-ordinal-set-aside.json`, and refuses an `open_dataset` request that lacks `set_aside_file_id`. Red: unknown field (`deny_unknown_fields`). M-17: `#[serde(default)]` on the member.

**Shell**

| id | file / test | red because | mutation |
|---|---|---|---|
| S-T1 | `AdmissionPanel.test.ts`: `an_identity_refusal_naming_id_with_no_declaration_offers_row_position`. Not offered when declared, when the column is not `id`, or on the partitioned refusal. | no offer | M-18: offer ignores `options.identity` |
| S-T2 | same: `choosing_row_position_sends_set_aside_true_and_no_identity` | no button | M-19: also sends `identity:{column:"id"}` |
| S-T3 | `describeSummaryText.test.ts`: `the_summary_says_the_user_chose_row_position` (S-3 only when the member is non-null) | absent | M-20: shown for any session tier |
| S-T4 (C2) | `AdmissionPanel.test.ts`: `a_reopen_refused_for_its_own_id_offers_only_row_position`. No declaration form; same answer and relink. | no offer | M-21: the reopen re-run drops `relink` |
| S-T5 | same: `a_carried_choice_is_shown_in_the_crs_block` (S-5) | absent | M-22: line hidden |
| S-T6 | same: `declaring_from_a_row_position_open_carries_no_set_aside` | sends it | M-23: `declarationOptions` keeps the flag |
| T-1 | `client.test.ts`: `openDataset` sends `set_aside_file_id:false` by default and `true` when asked | member absent | M-24: default `true` |

**End to end:** E-1, `e2e/admission-remediation.mjs`, a new step `TEXTID'`, through the real app.
- (a) File A by Open GeoParquet: the refusal, S-1, and no candidates. Choose it: it opens, the summary shows S-3 and the statement, and features draw. The filter `id = 'key-1'` is refused with `filter_identity_alias_ambiguous`.
- (b) `dupkey-refused.parquet`: S-1 is offered; chosen, it opens.
- (c) `no-id-column.parquet`: it opens with no S-1 and no S-3.
- (d) Save the project for (a). Read `project.spatial` from disk: `"identity": null`, and no `set_aside`. Open the project: refused, only S-1 offered. Choose it: it opens with S-3.

Red at the skeleton: no button. M-25: `RowPositionChoice` is not rendered.

**Proof that nothing is saved or published:** K-4, K-5, K-6, K-7, and E-1 (d).

## §5 Predictions and invalidators

- Every test above is red at the skeleton for its named reason, and green at the head.
- Every mutation in M-TEXTID fails its own test. A mutation that survives is a stop, recorded in the closing with its time.
- If the approved Amendment 3 differs from the draft, an amendment to this form comes before any code (ADV-2026-11-23-33 item 5).
- If any test needs a fixture or file outside §7, the code stops; that is class 9, declared before its code.

## §6 Instruments

- `identity_verification_scans` (`dataset.rs:87`) is existing; its doc gains N-3's name.
- No new instrument accessor and no new `pub` item without a product caller: each new `pub fn`'s product chain runs from `SkpHost::open_under` or the describe build. A test-only caller does not count.

## §7 Ceilings and Scope

- **Size:** at most 1,950 changed lines, insertions plus deletions, over at most 80 files.
- **Estimate:**

| part | lines |
|---|---|
| the literal (as the identity route's, its §7 at `IDENTITY-DECLARATION-ROUTE-FOR-SESSION-TIER-PREREGISTRATION.md:236`) | ~190 |
| the request member in 46 Rust literals, 2 JSON and conformance | ~65 |
| engine product | ~150 |
| kernel product | ~80 |
| protocol code and docs | ~90 |
| shell product | ~140 |
| tests | ~1,090 |
| words and the ADR append | ~70 |
| **total** | **~1,875** |

- **Scope, exactly:**
  - **engine:**
    - `engine/src/dataset.rs`
    - `engine/src/identity.rs`
    - `engine/src/error.rs`
    - `engine/src/predicate.rs`
    - `engine/tests/text_id_set_aside_session_tier.rs` (new)
  - **kernel:**
    - `kernel/src/lib.rs`
    - `kernel/src/skp.rs`
    - `kernel/src/project/mod.rs`
    - `kernel/tests/text_id_set_aside_not_saved_or_published.rs` (new)
    - `kernel/tests/skp_admission_remediation.rs`
    - `kernel/tests/manual_walkthrough_fixtures.rs`
    - and, for the request member, each file that holds `OpenDatasetRequest {` at a2d58940: `kernel/tests/{dataset_ref, describe_crs_unit, no_generation_in_persisted_artifacts, project_lock_crash, project_reopen, project_reopen_skp, project_save, project_save_skp, record_step_crs, record_step_match, session_end_event, session_history, session_history_crash, session_reference, single_file_bracket_name_open, source_watch_ordering, source_watch_windows, typed_terminal_codes, watcher_first_read_windows}.rs`
    - and, only if it holds that literal at the base, `kernel/tests/project_relink_inside_folder_skp.rs` and `kernel/tests/partitioned_refusal_offers_no_declaration.rs`
  - **protocol:**
    - `protocol/skp/src/v0/commands.rs`, `protocol/skp/src/v0/mod.rs`, `protocol/skp/SKP-V0.md`, `protocol/skp/tests/fixtures.rs`
    - the 14 data fixtures of the identity route's §7 (its `:230`)
    - new `v0-open_dataset-request-set-aside.json` and `v0-describe-response-session-ordinal-set-aside.json`
    - `protocol/skp/tests/conformance/` `fixtures/requests-accept.json`, `fixtures/refusals-at-deserialize.json`, `fixtures/refusals-any-layer.json`, `README.md`
    - under the identity route's Amendment 4 D-1 rule, a doc comment that names a version stays
  - **shell:** `frontends/shell/`
    - `src/skp/types.ts`, `src/skp/client.ts`, `src/skp/client.test.ts`, `src/skp/__tests__/fixtures.test.ts`
    - `src/project/saveProject.test.ts`, `src/project/openProject.ts`
    - `src/admission/admitDataset.ts`, `admitDataset.test.ts`, `RefusalBlock.test.tsx`, `AdmissionPanel.tsx`, `AdmissionPanel.test.ts`, `RowPositionChoice.tsx` (new), `describeSummaryText.ts`, `describeSummaryText.test.ts`, `DescribeSummary.tsx`
    - `e2e/admission-remediation.mjs`, `e2e/README.md`
  - **documents:**
    - `KNOWN-LIMITATIONS.md` item 3
    - `frontends/shell/MANUAL-WALKTHROUGH.md` (a new Part)
    - `docs/adr/ADR-016-stable-feature-identity-admission.md`: append only, the approved Amendment 3 text byte for byte
- **Counting:** `git diff --numstat <base>..<head> -- . ':!<this form>' ':!governance/PLAN.yaml' ':!governance/CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**'`, where `<base>` is the recorded base commit (ADV-2026-11-23-15 item 4), read at a named commit.
- An overrun is class 8, and this line is never edited to match.

## §8 Overlap, base and merge order

**Base (proposed; the advisor rules it under ADV-2026-11-23-33 item 6).** The base is the identity route's head, which takes in the partitioned refusal's head (ADV-2026-11-23-32) and the heads its own base line names. Two more heads come in by merge commits:
- PR 364, which shares `engine/src/predicate.rs`;
- PR 361, which shares `kernel/src/project/mod.rs` (C2).

The commit after the last merge is the base, and it is recorded. This piece is never built on the recovery offer's head.

**Protocol place (rule (00)).**
- This piece's `protocol/` changes are:
  - the three members;
  - the error row;
  - the `§7.5` sentence;
  - the literal and its fixtures.
- At a2d58940, the place is held by the identity route: ADV-2026-11-23-26 item 3, order A, `skp/0.15`. PR 363 (`SKP-V0.md`, `commands.rs`) and PR 353 (`protocol/data-plane/`) are held PRs in the same place.
- Building on the identity route's head meets rule (00) (ADV-2026-11-23-15 item 4).
- The recovery offer also wants the place, so ADV-2026-11-23-33 item 6's "share no file and no `protocol/` place" does not hold.
- **Proposed literal:** `skp/0.16`, with the future-version fixture at `skp/0.17`. The recovery offer's `skp/0.16` (ADV-2026-11-23-29) would then move. Pending the advisor's ruling (OPEN-A3).

**Shared paths.** KNOWN-LIMITATIONS items and walkthrough Parts count as separate paths.

| held piece / form | shared with this Scope |
|---|---|
| PR 350 | none (its `engine/tests/` files are not this piece's new file) |
| PR 353 | the `protocol/` place only |
| PR 356, 362 | none |
| PR 358 | `KNOWN-LIMITATIONS.md` (the file; not item 3) |
| PR 359 | `e2e/README.md` |
| PR 360 | `admission/admitDataset.ts` and its test, `project/openProject.ts`, `kernel/tests/project_reopen_skp.rs` |
| PR 361 | `kernel/src/project/mod.rs` |
| PR 363 | `AdmissionPanel.tsx` and its test, `SKP-V0.md`, `commands.rs`, `e2e/README.md`, `KNOWN-LIMITATIONS.md`, `MANUAL-WALKTHROUGH.md` (separate Parts); possibly `project_relink_inside_folder_skp.rs` |
| PR 364 | `engine/src/predicate.rs` (its regions to be named at the base; this piece's are `:285`, `:352-357`, `:1132-1144`, `:1184-1187`) |
| partitioned refusal | `engine/src/error.rs` (disjoint regions, §2 item 3); possibly `partitioned_refusal_offers_no_declaration.rs` |
| colour-by-refill | `kernel/tests/manual_walkthrough_fixtures.rs`, `e2e/README.md` |
| milestone 5 | `MANUAL-WALKTHROUGH.md`, `e2e/README.md`, `KNOWN-LIMITATIONS.md` (the files); PR A may touch `e2e/admission-remediation.mjs` |
| scale display | `e2e/README.md`, `MANUAL-WALKTHROUGH.md` (separate rows) |
| identity route | `commands.rs`, `mod.rs`, `SKP-V0.md`, `fixtures.rs`, the 14 data and 4 conformance files, `kernel/src/skp.rs`, `skp_admission_remediation.rs`, `engine/src/identity.rs`, `types.ts`, `client.test.ts`, `fixtures.test.ts`, `saveProject.test.ts`, `admitDataset.test.ts`, `RefusalBlock.test.tsx`, `AdmissionPanel.tsx`/`.test.ts`, `e2e/admission-remediation.mjs`, `e2e/README.md`, KNOWN-LIMITATIONS item 3, `MANUAL-WALKTHROUGH.md`, ADR-016 |
| recovery offer | `protocol/` place, `SKP-V0.md`, `commands.rs`, `mod.rs`, conformance fixtures, the literal files, `kernel/src/lib.rs`, `skp/client.ts`, `types.ts`, `client.test.ts`, `e2e/README.md`, `MANUAL-WALKTHROUGH.md` |

**Merge.** After the tag, by ADV-2026-11-23-15 item 5: 350, 353, 356, 358, 359, 360, 361, 362, then the new pieces. This piece merges after every head in its base: the identity route and all it takes in, plus PR 361 and PR 364. Its PR stays a draft until its bases are on main.

**If the advisor rules another base:**
- **On main without the identity route:**
  - Amendment 3 lands after the Note 2026-11-09, and its references to Amendment 2 and to the Note 2026-11-23 are dropped by an amendment to this form.
  - The candidate-list assertions in N-2 and K-1 are removed.
  - The literal becomes whichever one the advisor assigns.
  - The ADR's end, KNOWN-LIMITATIONS item 3 and `AdmissionPanel.tsx` conflict with the identity route, and the two merges are ordered by ruling.
- **On a base without PR 361 (C1 or C4):** that head is not taken in.

The Scope is otherwise unchanged.

## §9 Block on sight

- Code before the human's approval of Amendment 3.
- Any path outside §7.
- A choice taken without the user's act, or a default of `true`.
- Any byte of the choice in a project file, a session history or a bundle.
- A declaration form on a reopen.
- `identity` and `set_aside_file_id` sent together by the shell.
- A base that holds the recovery offer's head.
- A test whose red is a compile error.
- Any lab-folder content in the repository.
- Any number from the human's item 1 stated anywhere.

## §10 Gates, seams, guarantees, operator Part

**Seams.** Each is proven end to end from the real shape, by E-1 and K-1/K-7:
- engine to kernel: the new `Dataset` fn, `set_aside_column`, `IdentitySetAsideRefused`;
- kernel to wire: three members, one code;
- wire to shell: `types.ts`, `client.ts`;
- kernel project to engine (C2).

**Guarantees touched:**
- ADR-016 §1 and §3: no silent fallback (N-5 to N-7, S-T1);
- Amendment 1 item 1: the session tier claims no stability (statement unchanged);
- ADR-010 rule 2: the identity stays generation-scoped;
- the publish session refusal (K-6);
- the G-A4 no-generation scans (K-4, K-5);
- cancellation: docs/01, never block the canvas (N-9).

**KNOWN-LIMITATIONS:** item 3 only (K-1, K-2, the `:68` cites).

**Operator Part:** the walkthrough's new Part follows E-1 (a) to (d) on the packaged build, with the session statement, S-3 and the reopen offer each read by eye.

## OPEN questions

**The human's (the amendment's choices; ADV-2026-11-23-33 item 9 reserves them)**

- **OPEN-H1: Decision 2, broad or narrow.** Recommendation: broad, which follows the human's "cannot serve" (`:10`) and F2.
  - Narrow removes N-3, N-4 and E-1 (b), and S-2's last sentence.
  - Narrow adds:
    - (i) a refusal field naming the type class on `engine.identity_unusable` (`commands.rs`, `SKP-V0.md`, `error_of`, `error.rs`, a fixture, and the test `the_refusal_names_a_text_type`), or else (ii) accepts that the button can be refused, through S-6;
    - N-3′ `a_repeating_integer_id_refuses_the_set_aside_by_name_with_no_scan`, with its mutation;
    - a named text set (`DataType::Utf8 | LargeUtf8 | Utf8View`).
- **OPEN-H2: (c) C2, C1 or C4.** Recommendation: C2.
  - **C1** removes:
    - the `OpenProjectRequest` member;
    - `kernel/src/project/mod.rs` and `kernel/tests/project_reopen.rs` and `project_lock_crash.rs`'s call edits (they stay only for the request literal);
    - `openProject.ts`;
    - K-7, S-T4, and E-1 (d)'s second half, which becomes "refused, nothing offered";
    - PR 361 from the base.
    Under C1, S-2's "opening the file again asks again" holds for Open GeoParquet only, and K-2's "or the project" is false.
  - **C4** removes the same items, and adds:
    - a save refusal in `kernel/src/project/mod.rs` with a new code and an SKP-V0 row;
    - `src/project/saveProject.ts`'s shown refusal;
    - K-7′ `a_save_with_a_set_aside_open_is_refused_by_name` and S-T4′, each with a mutation;
    - a new string, S-7 (advisor).
- **OPEN-H3: Decision 5.** Recommendation: refuse as ambiguous.
  - The alternative (today's behaviour, `id` filters the file's column) removes `predicate.rs`, N-8, K-3, S-4, the `§7.5` sentence and PR 364 from the base, and makes K-2's "cannot be filtered on" false.
- **OPEN-H4: K-1 and K-2** (the human's wording), answered yes, with their own words, or accepted as it stands.

**The advisor's (strings, base, literal)**

- **OPEN-A1:** S-1 to S-6c as drafted. Recommendation: as drafted.
- **OPEN-A2:** F1. Recommendation: remove the sentence "Synthesizing a row ordinal instead is the hazard ADR-010 rule 2 exists to prevent" from `error.rs:359-364`. It is an engine message; item 3's quotation (`KNOWN-LIMITATIONS.md:65-66`) ends before it, with "…". If the advisor keeps it, `error.rs:359-364` leaves Scope.
- **OPEN-A3:** the base (§8) and the literal `skp/0.16`. Recommendation: as proposed. The alternative of riding `skp/0.15` saves about 190 lines but binds two merges into one; not recommended.
- **OPEN-A4:** D4's "For a file that opened this way with Open GeoParquet" stays true but no longer covers the new way of opening. Recommendation: the advisor rewords it, or confirms it as it stands.

## §11 Amendments

None yet.

## Amendment 1 — 2026-11-23 — at the first commit: the authority on main, the node's gate, the span hashes, the OPEN items

*Written by the custodian at the form's first commit, before any code and before any gate. References and hashes only. The words "None yet." in §11 are the draft's.*

1. **Authority on main.** The human's message of 2026-11-23 on files refused for a text `id` is filed at `state/directives/2026-11-23-the-humans-message-text-id-files-open-for-the-session-by-row-position-ahead-of-the-recovery-offer-and-a-bbox-consult.md`, and the advisor's ruling ADV-2026-11-23-33 at `state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-33-the-text-id-piece-placed-second-the-adr-016-draft-filed-as-a-draft-the-recovery-offer-build-held-on-bases.md`. The ADR-016 Amendment 3 draft this form is drafted on is filed, as a draft, at `state/consults/2026-11-23-text-id-opens-for-the-session-by-row-position-adr-016-amendment-architect-draft.md` (23103 bytes, sha256 3d1e6181d7f5918a581ec0ae92a529938aece3f53d312eec1a3ea92f184eb668, at 8dad2a6c); the tester's probe at `state/consults/2026-11-23-text-id-opens-for-the-session-by-row-position-probe-tester-report.md`. The form's Status paragraph stands: no code before the human approves the amendment (ADV-2026-11-23-33 item 5).
2. **The node's gate.** In the same commit the PLAN node `text-id-opens-for-the-session-by-row-position` names this form as its gate. Its class is full, with both gates, by ADV-2026-11-23-33 item 5, as its §1 says. The path is the one the draft proposes.
3. **Span hashes.** Every `path:line` cite above is read at a2d58940d283be8eb050730216f0e90b6084a0fd. Each entry below names the file and lines a cite is read as, the sha256 of those lines at that commit (each line with its LF, computed by script), and the sections that cite it. A short name is read as the one tracked file it names; a bare `:n` as the file named before it in the same passage; an entry marked (r) was read by the custodian against the file its sentence or list names.

- `governance/PLAN.yaml:5038-5054` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:1123658afa5c87a24e34c7d9e6e2ef2da43b51a7bd5ebc65c1909c30fc162b63 — the header
- `state/directives/2026-11-23-the-humans-message-text-id-files-open-for-the-session-by-row-position-ahead-of-the-recovery-offer-and-a-bbox-consult.md:10` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:69f9f094805f6ddc7054256d11c73da3bd61017391250c3367a8e9f5c860d949 — the header, OPEN questions; as written `:10` (r)
- `engine/src/identity.rs:333-344` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:4da1bd581a768e875fbba4b76435003c057ca0146ec906c52ee1d43314bc0994 — §0
- `engine/src/identity.rs:304` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:6dd3cea3d2ebe3f8ba6c1a7d2712fba86b2cc0bce9370ee9de81e52f4a0b770e — §0; as written `:304`
- `engine/src/identity.rs:299-315` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:00334befa0cd36cbaab55c0af1041c8b0ecaf1ad888451639a42d3bc33f00a76 — §0; as written `identity.rs:299-315`
- `engine/src/dataset.rs:2008-2010` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:07b48a8af49482611299f990bde132d11400abb386d17389f185c652fc7a31e5 — §0
- `engine/src/predicate.rs:1132-1144` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:c2d4e3f1abd06fe4eaa80ec75fbe93521a938a26cb7aecd31d2ab4c65f32812a — §0, §2, §8; as written `:1132-1144`
- `engine/src/stream.rs:1438-1440` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:eac73efc99df3f0cb16be172116b0f3f445b038a71ed860715766fae3dd41dd5 — §0
- `engine/src/stream.rs:1475-1478` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:c03d77740fa81031c2aff68025326303f8ae43eaaebe10f1bcde2a21ab942b1d — §0; as written `:1475-1478`
- `engine/src/attributes.rs:468` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:31daa486e378640c550d81d21715f7759b86961bd943226761e6c24b3fc8ee8a — §0
- `kernel/src/dataset_ref.rs:216-233` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:8151d92edcb5e4d86c7c0e37c8aac195028af2ee4ec7629adf23cd744879786f — §0; as written `:216-233`
- `kernel/src/dataset_ref.rs:282-298` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:5ae41a89c18f31d02a204cf24be87bb091619166051436d83e7a7eff0a45ebf3 — §0; as written `:282-298`
- `kernel/src/dataset_ref.rs:383-388` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:dc52cd82469654e15a48343c2df45336f96fc425846d6bfa2735042e977b0e50 — §0; as written `:383-388`
- `kernel/src/publish/mod.rs:513-520` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:beb3db4083cd8a45ff9b86b8cb599e0a59ee0ed5c038ae6f42d91be3a4e1c4cf — §0
- `frontends/shell/src/admission/AdmissionPanel.tsx:276-277` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:8ff8bf40ed5c0c8544ce321a65d7048669249e8b3983dd6efdab6a7ff3b70d9d — §0, §2; as written `:276-277` (r)
- `KNOWN-LIMITATIONS.md:68` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:2af2b6c0d1c97370bdb64a20b1ea1a1911628b9522f07e9f81624f615a4f4e00 — §0, §2, §10; as written `:68` (r)
- `engine/src/error.rs:359-364` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:57abd97d919b2173a9adf0f3667163ff2480dc07a1550aa60667f4339aaf32fa — §0, §2, OPEN questions; as written `:359-364`, `error.rs:359-364`
- `kernel/src/skp.rs:2223-2237` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:480cec6bbd415318979d3063b8d0a7d1f14066748568046a91298d714895c2fd — §0
- `engine/src/dataset.rs:1998-2010` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:b5ab650fdc2070a10509eb7f8f4dbfef01f2ab15f70c5d152be76f30427300d2 — §0; as written `dataset.rs:1998-2010`
- `engine/src/dataset.rs:2013-2018` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:33a21fcecfe9e14e4282aed4c37ba9d1e94c0fd87ddef6ce61a8d81df2c092a9 — §0; as written `dataset.rs:2013-2018`
- `kernel/src/dataset_ref.rs:36` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:a55cc39e85e338a2fa6a1a1d2cfed226de35a5d8a5664d2b7dc05576a5666073 — §0
- `engine/src/predicate.rs:285` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:0cf5bd4c36b86daf7e3eedff79a571a0f58ff56af7afee47b5fc407bfb0ca989 — §0, §8; as written `predicate.rs:285`, `:285`
- `engine/src/predicate.rs:352-357` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:bd41792b1a4079ec07d5e0f7d74ca4ba098a68ef684ad329bdaa71599c842f8d — §0, §2, §8; as written `:352-357`, `predicate.rs:352-357`
- `engine/src/dataset.rs:296-310` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:61aa1593e6e4d807c9f8427f4c0338d878b005ccaccc42a9396869de249d62bb — §2; as written `:296-310`
- `engine/src/dataset.rs:1961-2106` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:6a48ab5371fbd9de99992680c638e77a6665bc7929fb0c2d48efe7db30cc9ff6 — §2; as written `:1961-2106`
- `engine/src/dataset.rs:2071-2073` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:bb98dabe01b8c4954873c482bf62b1d161ba611aae9f7a4eb442a763cac23ad7 — §2; as written `:2071-2073`
- `engine/src/dataset.rs:327-329` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:d1a7cf72b1130653d6da62a02413e06cdd3eb53a0711b3f1b1d4f85a02fd6b16 — §2; as written `:327-329`
- `engine/src/dataset.rs:78-86` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:b0a7a1421ff7bee6a62b3bd1bb90f5264e1083da33c0cf2c047070bfae8193fa — §2; as written `:78-86`
- `engine/src/identity.rs:186-279` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:7d32453f7f773f6570ab05edbf4e0afb25d1471172318d3cfe9c355a6ca3f95f — §2; as written `:186-279`
- `engine/src/identity.rs:150-154` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:28a68b00bbb25d41a8db11f43758147c37b773871174c1d6f1f200e059d56e8a — §2; as written `:150-154` (r)
- `engine/src/error.rs:182-189` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:98e033ad48c99cbe5935d4581bea2cf5c8d5e4226246816ccf04e4f6d74803ad — §2; as written `:182-189`
- `engine/src/error.rs:182-188` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:fa5bd32d05c6b08903add29e1b49d25a266a376164d815c8aaff64c17483a25d — §2; as written `:182-188`
- `engine/src/error.rs:386-391` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:26ebfe880888e518236a7338f573806b639a7a585a25aa1612b4217c48fdf6d4 — §2; as written `:386-391`
- `engine/src/predicate.rs:1184-1187` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:e3f01d17d95e1bbeb94645c8b688163cb8101eb9d377a9b10d463c2030057e6c — §2, §8; as written `:1184-1187`
- `kernel/src/lib.rs:219-236` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:e0768faecf854f9370f48a60b0f11a6d2c30f21ef846b3073a2b32ff6dd279da — §2; as written `:219-236`
- `kernel/src/skp.rs:1139` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:ebbc9e535638177140ae48040ac7295bb8caa9b72f17cbd97c32ecad7fdb3389 — §2; as written `:1139`
- `kernel/src/skp.rs:1205-1207` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:fff4b87012c2b5fd2b980119d47b0d3cbe10a021d8033874a0715d0f7c1c2ff3 — §2; as written `:1205-1207`
- `kernel/src/skp.rs:2138` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:7e5c7ea042572d29b45fe707dc3168663420f138a89d801f16db10a4d7b7797d — §2; as written `:2138`
- `kernel/src/skp.rs:2034-2052` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:f12288ab960f4590ec84638333532d0d9982bf54e803fbc3e484bec0f54c9062 — §2; as written `:2034-2052`
- `kernel/src/skp.rs:2340-2350` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:10091b420d532d3c68a40c222f0abf1b8536b4f43f77e6d1e5f234bfe81ee0e7 — §2; as written `:2340-2350`
- `kernel/src/skp.rs:2879-2884` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:6fdfc178c0c89334165be27a3c7f939c7469ae8fb52fe4e595acf5f157eb322f — §2; as written `:2879-2884`
- `kernel/src/project/mod.rs:701-707` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:4ff866cddf8fb2d673fefc238c9516603b18a1f36f0098ab0515f8844bcaf56d — §2; as written `:701-707`
- `kernel/src/project/mod.rs:819-825` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:4c3f591d22d855d28e5e8304bd07b349f6e5ecddb2c168f097726837a9c92643 — §2; as written `:819-825`
- `kernel/src/project/mod.rs:894-915` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:43498198fb372df6326891d7eeccca360312644970fcea9109f3ef6a2a4a3a0b — §2; as written `:894-915`
- `protocol/skp/src/v0/commands.rs:19-40` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:2959e1920629c2a9fe7aa9886a0a100676050aa4f751034469246235d91a3a57 — §2; as written `:19-40`
- `protocol/skp/src/v0/commands.rs:190-222` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:1be65decbd5a7c93d6a65b284236f37b64a6d1146509ac7ffc0da31ee13ab910 — §2; as written `:190-222`
- `protocol/skp/src/v0/commands.rs:784-794` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:4b9627dc4d84d36b07889735c5fff2bd4851e8c78f09facefbf13acbd2bda4cc — §2; as written `:784-794`
- `protocol/skp/src/v0/mod.rs:136` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:882a5865fce789fe6efebc9b9ae98c9c0436eea3cd8c78f6137e8b0e6b4112fc — §2; as written `:136`
- `protocol/skp/SKP-V0.md:512-519` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:51b7de7fb18bdc9bda4c729910ce143d63b2e068d895efebf79d171c4facda47 — §2; as written `:512-519`
- `frontends/shell/src/skp/types.ts:43` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:5a51f47d1b5966aad7bf96cd8a44f7d3d8e55c64f16420d45af1cb2049169f4f — §2; as written `:43`
- `frontends/shell/src/skp/types.ts:131-146` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:f6f9eba9fb470459e1e637b5c39e2cc95b0c10ae13afaa50d970096dd3052ce3 — §2; as written `:131-146`
- `frontends/shell/src/skp/types.ts:387` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:c04b7110ad77298d39ba12474c7b7c3bbc9d849a4d25d0e500ddf23de54e0afc — §2; as written `:387`
- `frontends/shell/src/skp/client.ts:82-95` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:e1fb350ede4f363fa8188e6d4c39dd1e9229756eaa765d88159630bab90f568d — §2; as written `:82-95`
- `frontends/shell/src/skp/client.ts:165-172` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:fdc9f59605d22037a9bbf0a239e64be6d81d383bb3598e68fc8d13b71d704738 — §2; as written `:165-172`
- `frontends/shell/src/admission/admitDataset.ts:35-39` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:51bdb2d291f40d1f2e60eedc190b4f336f60cb62c416b0644fc709f2610f24db — §2; as written `:35-39`
- `frontends/shell/src/admission/admitDataset.ts:48-75` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:dc685c6f6b7aec3eaac516e7f91b6e177ed2533e041fa2d6a2b0be53c10dd03b — §2; as written `:48-75`
- `frontends/shell/src/project/openProject.ts:62-78` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:4bc6cab4aea0a004b8dca31ebca5ffacdee2ec6a0b034962c7867c68eb523b3c — §2; as written `:62-78`
- `frontends/shell/src/admission/AdmissionPanel.tsx:572-576` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:ee2ef3644602d7aba4142a33e83538c911629afe82d923d9d5dc646fb2907038 — §2; as written `:572-576`
- `frontends/shell/src/admission/formatRefusal.ts:44-45` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:676fe97ae38b6f27aef5e50e0668a6a6cb5ced02f4d25ed8d8bbb1de04c24f85 — §2; as written `formatRefusal.ts:44-45`
- `frontends/shell/src/admission/AdmissionPanel.tsx:216-292` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:8dae2de4b24fe44eece874a654331f015ae9f1a37c10dfec625bf08d3f118bd2 — §2; as written `:216-292` (r)
- `frontends/shell/src/admission/AdmissionPanel.tsx:552-557` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:295c4a853967302702d7e4bc009e6075c15fd7aabce43c551d02dff9df274923 — §2; as written `:552-557` (r)
- `frontends/shell/src/admission/AdmissionPanel.tsx:167-173` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:5ec13222898b76fc357ab5200fcf2640bcbff2c6748950dffe97a3f588c5387f — §2; as written `:167-173` (r)
- `frontends/shell/src/admission/describeSummaryText.ts:37-39` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:a7b706d94115feca6380e7e980ccba0c93ed2d4732bb8b52c10310ad37ef43cd — §2; as written `:37-39`
- `frontends/shell/src/admission/describeSummaryText.ts:56-58` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:b8e59b54770820be1a0bc943fab27f5da2377c5c159cc57c4d2a20306031c8a5 — §2; as written `:56-58`
- `frontends/shell/src/admission/DescribeSummary.tsx:65-70` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:c87049458e02a89cebe1810c305ff86d22b078487acaadf7cb23f5187007187f — §2; as written `:65-70`
- `KNOWN-LIMITATIONS.md:70` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:db65b22f2d1b9feab39c447cfaca4fdceff706f4a04f1dd318959f1827afca2a — §2
- `engine/src/identity.rs:324-346` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:094e022adbecebeda8af5f5c0a9563730be17f58ea5b163d2172e97887ca49b0 — §2
- `engine/src/fixture.rs:530-569` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:61c00f73f41fdbccbd383b67ca2e86f069bb1e9be980b15beb30b30e3ff55b76 — §3
- `engine/src/fixture.rs:754-783` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:8f6c11a4fb9e6ea7a1ae1df7d7b22f90378231440adb5dfba4c0143f1c071054 — §3; as written `:754-783`
- `kernel/tests/manual_walkthrough_fixtures.rs:503-516` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:89b26c816a11fabb111c61a051fe476037dd196785981742ceb27de341853552 — §3; as written `:503-516`
- `kernel/tests/manual_walkthrough_fixtures.rs:531-544` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:2952099cdf5e3a5fc9f5485cefa077cc3c7f0df8914ae8f26d23ae96e503394e — §3; as written `:531-544`
- `kernel/tests/manual_walkthrough_fixtures.rs:483-496` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:e20cca0093249a0b2309a98bc73910d79d6ff238e822354fd038d50e69e363e2 — §3; as written `:483-496`
- `kernel/tests/no_generation_in_persisted_artifacts.rs:965-1018` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:0b0e83cc72f37df75c9cb18f78defef0f273f93396503ada097110aad701e87b — §4; as written `no_generation_in_persisted_artifacts.rs:965-1018`
- `kernel/tests/publish_identity_tier.rs:246-302` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:df507a1cfd68cc78f72afecb99fcc1800682203669998eeaef769c05e7cfbbbd — §4; as written `publish_identity_tier.rs:246-302`
- `engine/src/dataset.rs:87` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:275a40ed081864c527d12fa8a50309deae991ce3bccc253c4b6e2976b19f58e7 — §6; as written `dataset.rs:87`
- `governance/forms/frontends/IDENTITY-DECLARATION-ROUTE-FOR-SESSION-TIER-PREREGISTRATION.md:236` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:8d310231f663d9780238552d2c3677a9f14502ecdc6d5a4321f0dd65c0250602 — §7; as written `IDENTITY-DECLARATION-ROUTE-FOR-SESSION-TIER-PREREGISTRATION.md:236`
- `governance/forms/frontends/IDENTITY-DECLARATION-ROUTE-FOR-SESSION-TIER-PREREGISTRATION.md:230` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:d49dc48548410e9207ef695f7d3a191a911ae3b02d67a4766cae27cf11515d44 — §7; as written `:230` (r)
- `KNOWN-LIMITATIONS.md:65-66` @ a2d58940d283be8eb050730216f0e90b6084a0fd sha256:c366a88db2e4df87451aa20dfaafa1b3d20fabf88a8c4d6394fad5296755ddac — OPEN questions

4. **OPEN items.** OPEN-H1 to OPEN-H4 (the amendment's choices, reserved to the human by ADV-2026-11-23-33 item 9) and OPEN-A1 to OPEN-A4, with the note's items 1 to 7, go to the advisor in one message. Their answers come as later amendments; the gates do not wait for them.

Read the last amendment first.

Nothing above is edited.
