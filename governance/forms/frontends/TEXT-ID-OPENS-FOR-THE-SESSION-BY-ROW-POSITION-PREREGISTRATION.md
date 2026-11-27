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

## Amendment 2 — 2026-11-23 — the custodian's, under ADV-2026-11-23-35 and ADV-2026-11-23-36: the base and the literal; the refusal's last sentence removed, with three paths added to the Scope (class 9); the strings and D5 held by reference; a text named as found

*Written by the custodian before any code. References and hashes only: the advisor's words are not copied here, and the build takes them from the rulings' files. Every check named below was made by script at 14d2fc717c671134e4029f1459046e49e79595f2.*

1. **Authority.** The advisor's rulings ADV-2026-11-23-35 (`state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-35-the-bases-identity-route-then-text-id-then-recovery-offer-each-the-next-unused-literal-recovery-build-held-until-a-green-head.md`) and ADV-2026-11-23-36 (`state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-36-the-text-id-forms-open-a1-to-a4-strings-worded-the-refusals-last-sentence-removed-pr-360-in-the-base-d5-added.md`), under the human's delegation of 2026-11-13. Neither is the human's words. All of ADV-2026-11-23-36 rests on the human approving ADV-2026-11-23-34 with no added word; if the approval adds `narrow` or `C4`, its item 6 holds.
2. **The base and the literal**, in place of §8's proposed literal and OPEN-A3:
   - The base is the one ADV-2026-11-23-36 item 1 gives: the identity route's head, with PR 364, PR 361 and PR 360 taken in by merge commits. PR 360 is taken in unless the identity route's line already holds it.
   - At the base, this Scope is compared with the changed paths of every unmerged head, as rule (00a) counts them (ADV-2026-11-23-15 item 4). Each head that shares a path is taken in, and the recorded base names them all.
   - Milestone 5's PR A and `e2e/admission-remediation.mjs` are settled by that ruling's item 1.
   - The literal is the next unused one after the identity route's (ADV-2026-11-23-35 item 2; ADV-2026-11-23-36 item 1). That is `skp/0.16` while the identity route takes `skp/0.15`.
   - §8's clause that the recovery offer's `skp/0.16` would then move is replaced: the recovery offer takes the next unused literal after this piece's.
3. **OPEN-A2.** The `IdentityUnusable` Display ends as ADV-2026-11-23-36 item 2 gives it.
   - At 14d2fc71, the sentence beginning `Synthesizing a row ordinal instead` is held outside `state/` and `governance/` by six paths.
   - Two of them are in §7's Scope already: `engine/src/error.rs` and `frontends/shell/e2e/admission-remediation.mjs`.
   - Three are added to the Scope, class 9, for that sentence alone:
     - `protocol/skp/tests/data/v0-error-identity_unusable-with-candidates.json`;
     - `frontends/shell/e2e/regression.mjs`;
     - `frontends/shell/MANUAL-WALKTHROUGH.md` row I4 of Part I (admission remediation), besides the new Part that §7 names. In that row only the quoted message changes; no past run record is touched.
   - `engine/ADMISSION-RESULTS.md` is a dated record of results and is not edited.
   - The worker runs the same search at the base before code. A path that holds the sentence there and is not named here is a stop.
   - §7's ceilings are not changed.
4. **OPEN-A1.** The words of ADV-2026-11-23-36 item 3 hold in place of §2's drafted S-1 to S-6c, byte for byte, without the placeholder mark. S-2 and S-5 differ from the drafts, for the reasons in its item 4. The merge check compares each string with that file (its item 8).
5. **OPEN-A4.** In KNOWN-LIMITATIONS item 3:
   - D4 of ADV-2026-11-23-26 item 2 stays byte for byte;
   - D5 of ADV-2026-11-23-36 item 5 is added where that item places it;
   - the item's comment says that D5 is the advisor's.
6. **Named as found and not changed** (ADV-2026-11-23-35 item 7; ADV-2026-11-23-36 item 7): the refusal text at `engine/src/attributes.rs:253-256`, unless a gate asks for it. It is pinned below. The stale cites in item 3's comment (`engine/src/identity.rs:196-217`, `engine/src/error.rs:234-238`) are corrected in the piece.

- `engine/src/attributes.rs:253-256` @ 14d2fc717c671134e4029f1459046e49e79595f2 sha256:b5faaa344b7bc943b6ab2be3b51ec3ae40c8d84ba9f7fc51181205cf7a9f5c13 — each line with its LF, computed by script

7. **No further attempt of the form's gate is asked for these words alone** (ADV-2026-11-23-36 item 8). The form gate, attempt 1, reads this amendment. The build's gates check every string and sentence clause by clause, and a finding on a word of the advisor's goes to the advisor.
8. **Next:** the form gate, attempt 1, on the unapproved draft. No code is written before the human approves ADV-2026-11-23-34 and the gate passes. Nothing of this piece builds, tests or starts the app from 05:00Z on 2026-11-24 until the sitting is over.

Read the last amendment first.

Nothing above is edited.

## Amendment 3 — 2026-11-24 — the custodian's, under ADV-2026-11-24-05: the form gate's words by reference; the file ceiling 84 and the line ceiling 2,100, restated before code; the detail's second sentence and S-8 by reference, with two paths added to the Scope (class 9)

*Written by the custodian before any code. References only: the advisor's and the gate's words are not copied here, and the build takes them from their files. The search named in item 5 was made by script at 4630fa09bec7d7c66a15393de0bd13d64537a9a1.*

1. **Authority.** The advisor's ruling ADV-2026-11-24-05 (`state/directives/2026-11-24-advisor-ruling-adv-2026-11-24-05-text-id-after-the-form-gate-fail-q1-the-file-ceiling-84-before-code-q2-the-advisors-words-q3-nothing-more-to-the-human-q4-yes.md`), under the human's delegation of 2026-11-13. It is not the human's words. It answers the custodian's four questions after the architect's form gate, attempt 1 (FAIL, gate-log row 889, `state/consults/gates/2026-11-23-text-id-opens-for-the-session-by-row-position-form-gate-architect.md`).
2. **The gate's words, by reference** (ADV-2026-11-24-05 item 6). The replacement words of row 889's report hold in place of the form's text they name, byte for byte:
   - E1: §4's row N-9, and the new row N-S in its own new file;
   - E2: rows N-3, N-5 and N-7, and the two lines on `identity_verification_scans` in §2 item 1 and §6;
   - E3: the red reasons of W-1, T-1 and K-7;
   - C1: §7's shell Scope;
   - C2: §2 item 12, `refusedDeclarationOptions`;
   - C3: §2 item 10, the optional `set_aside_column`;
   - C4: §2 item 1 (d), with `id` removed from the candidates, and M-3b in N-3's row (E2's words);
   - D1: the Status paragraph;
   - D2: §2's line on the D-1 cites.

   The build takes them from that file.
3. **The file ceiling: 84** (ADV-2026-11-24-05 item 1), declared before code. The reason, by count:
   - 76 paths in §7, by the gate's count (its Notes, the ceilings);
   - 2 added by Amendment 2, item 3: the wire fixture and `frontends/shell/e2e/regression.mjs` (the walkthrough is in §7 already);
   - 2 added by C1: `frontends/shell/e2e/console.mjs` and `frontends/shell/src/console/renderTruth.test.ts`;
   - 1 added by E1 and E2: `engine/tests/text_id_set_aside_scan_counts.rs` (new);
   - 2 added by item 6 below: `frontends/shell/src/project/reopenNotices.ts` and `frontends/shell/src/project/reopenNotices.test.ts`.

   That is 83 paths. The 84th is the place for a wire fixture that holds the detail, if item 5's search at the base finds one outside the Scope. §7's counting command and its overrun rule are unchanged.
4. **The line estimate again, and the line ceiling: 2,100** (ADV-2026-11-24-05 item 1), declared before code. §7's estimate of ~1,875, with these additions, as the custodian estimates them:

| addition | lines |
|---|---|
| Amendment 2 item 3 and item 5 below: the Display's last sentence and the detail's second sentence, in the paths that pin them (one changed line where both sit in one string) | ~16 |
| C1: the two open_dataset key sets | ~5 |
| E1: N-9 in `dataset.rs`'s own test module, with its recorded mutation | ~25 |
| E1 and E2: N-S in its own file, less the deltas moved out of N-3, N-5 and N-7 | ~60 |
| C2 and item 8: `refusedDeclarationOptions`, its submit line, S-T6b and M-23b | ~28 |
| C4: `id` removed from the candidates, and M-3b | ~9 |
| item 6: S-8, the shell telling the two reopen attempts apart, its test and its mutation | ~34 |
| the counter's doc naming N-S, and a wire fixture if one is found | ~8 |
| **total, with §7's ~1,875** | **~2,060** |

   The estimate passes 1,950, so the line ceiling is restated to 2,100, the bound ADV-2026-11-24-05 item 1 sets for a restatement that needs no further ruling. §7's size line is not edited; this item stands in its place.
5. **The type refusal's detail** (ADV-2026-11-24-05 item 2 (a)). Its second sentence becomes the words of that item, byte for byte; its first sentence stays.
   - At 4630fa09, outside `state/` and `governance/`, the sentence that item names is held by `engine/src/identity.rs` (line 341), `frontends/shell/MANUAL-WALKTHROUGH.md` (line 598, row I4 of Part I), `frontends/shell/e2e/admission-remediation.mjs` (line 82) and `frontends/shell/e2e/regression.mjs` (line 115), and by `engine/ADMISSION-RESULTS.md`, which is not edited. No path under `protocol/` holds it there.
   - All four are in the Scope (§7 and Amendment 2, item 3). In row I4 only the quoted message changes; no past run record is touched.
   - The worker runs the same search at the base before code, and every place that pins the sentence there changes in this piece, a wire fixture included (that item; item 2 of ADV-2026-11-23-36).
6. **The line beside an engine refusal at a reopen** (ADV-2026-11-24-05 item 2 (b)).
   - `ENGINE_REFUSAL_NOTICE` (`frontends/shell/src/project/reopenNotices.ts`, line 100 at 4630fa09) stays for a reopen attempt that carries no choice.
   - S-8, in that item's words, stands beside an engine refusal of a reopen attempt that carried the choice. It is held as S-1 to S-6c are (Amendment 2, item 4).
   - `reopenNotices.ts` and its test join the Scope, class 9, before code (item 3 above).
   - Where the shell tells the two attempts apart, and S-8's test and mutation, are the architect's to word in the form gate, attempt 2, as that item says.
7. **Nothing more goes to the human now** (ADV-2026-11-24-05 item 3).
   - K-2's correction to "the app then offers a second choice" is settled by the advisor under item 6 of ADV-2026-11-23-34 once the human has approved it.
   - Attempt 2 reads every clause of the draft of ADR-016's Amendment 3, as Amendment 1 item 1 names it, against the form as this amendment leaves it. It gives replacement words for each clause that no longer holds, the Consequences sentence on the candidate list among them (C4). Those words go to the advisor.
8. **Q4** (ADV-2026-11-24-05 item 4): `refusedDeclarationOptions` with S-T6b and M-23b (C2), and the optional `set_aside_column` (C3), are inside this amendment, under item 3's count.
9. **D5 and S-5** (ADV-2026-11-24-05 item 5): D5 holds only with C4's fix, which item 2 carries. S-5 stays as worded.
10. **Next:** the form gate, attempt 2, a read, which may run during the sitting. No code is written before the human approves ADV-2026-11-23-34 and the gate passes. Nothing of this piece builds, tests or starts the app from 05:00Z on 2026-11-24 until the sitting is over.

Read the last amendment first.

Nothing above is edited.

## Amendment 4 — 2026-11-24 — the custodian's, after the architect's form gate, attempt 2 (FAIL, gate-log row 895): that gate's replacement words for C5, E4 and D3, and its section 2 item 14 for S-8, carried byte for byte

The words below are the architect's, from row 895's report (`state/consults/gates/2026-11-24-text-id-opens-for-the-session-by-row-position-form-gate-architect-attempt-2.md`). Each item names the place, then the Old text it replaces and the New text, each exactly as the report gives it. Nothing above is edited. Like the form, they bind nothing until ADV-2026-11-23-34 is approved (ADV-2026-11-23-33 item 5).

The file ceiling stays 84 (ADV-2026-11-24-05 item 1). With item 1 below, the 84th path is `engine/tests/identity.rs`, and a wire fixture found at the base is a stop. The report's check 6 words, for the ADR-016 Amendment 3 draft, are not in this form: they go to the advisor (ADV-2026-11-23-34 item 6).

1. **C5, Amendment 3, item 3 (the 84 count).**

   Old:

```text
That is 83 paths. The 84th is the place for a wire fixture that holds the detail, if item 5's search at the base finds one outside the Scope.
```

   New:

```text
That is 83 paths. The 84th is `engine/tests/identity.rs`, class 9, declared before code: its test `a_declared_mapping_to_a_non_integer_column_is_refused_not_hashed` asserts that the type refusal's detail contains `synthesized`, which the new second sentence does not hold, and that assertion changes to the new sentence's `no stable identity`. A wire fixture that holds the detail, if item 5's search at the base finds one outside the Scope, would be an 85th path: that is a stop, and the file ceiling goes to the advisor before code.
```

2. **C5, Amendment 3, item 5 (the four places).**

   Old:

```text
All four are in the Scope (§7 and Amendment 2, item 3).
```

   New:

```text
All four are in the Scope (§7 and Amendment 2, item 3). A fifth place pins a part of the sentence and is not found by that search: `engine/tests/identity.rs`, whose test asserts that the detail contains `synthesized` (item 3).
```

3. **C5, Amendment 3, item 5 (the search at the base).**

   Old:

```text
The worker runs the same search at the base before code, and every place that pins the sentence there changes in this piece, a wire fixture included (that item; item 2 of ADV-2026-11-23-36).
```

   New:

```text
The worker runs the same search at the base before code, and also searches `engine/`, `kernel/`, `protocol/` and `frontends/` for the parts `synthesized`, `ADR-016 refuses` and `is not a mapping`, since a test may pin a part of the sentence and not the whole. Every place that pins the sentence, or a part of it that the new words do not hold, changes in this piece, a wire fixture included (that item; item 2 of ADV-2026-11-23-36). `engine/ADMISSION-RESULTS.md` is not edited.
```

4. **E4, section 4, the shell table: the S-T6 row, followed by the rows S-T6b and S-T8.**

   Old:

```text
| S-T6 | same: `declaring_from_a_row_position_open_carries_no_set_aside` | sends it | M-23: `declarationOptions` keeps the flag |
```

   New:

```text
| S-T6 | same: `declaring_from_a_row_position_open_carries_no_set_aside` | sends it | M-23: `declarationOptions` keeps the flag |
| S-T6b (C2) | same: `a_declaration_after_a_refused_set_aside_carries_no_set_aside`. `refusedDeclarationOptions` over options that carry `setAsideFileId: true` and a `crsAssertion` returns the declared `identity` and the `crsAssertion`, and no `setAsideFileId`. | sends both: at the skeleton `refusedDeclarationOptions` exists and returns `{ ...options, identity }` | M-23b: `refusedDeclarationOptions` keeps the flag |
| S-T8 (S-8) | `src/project/reopenNotices.test.ts`, with `../skp/client` and `../diagnostics/log` mocked the way `openProject.test.ts` mocks them: `a_reopen_refused_after_the_choice_names_the_choice`. With `options.setAsideFileId: true`, `admitProject` refused `engine.identity_set_aside_refused`, and refused `engine.query`, each has S-8's constant as its owner; the same refusals without the choice have `ENGINE_REFUSAL_NOTICE`; with the choice, `engine.cancelled` has no owner and an `skp.*` code keeps its own place. It compares constants, never words. | the owner is `ENGINE_REFUSAL_NOTICE` with the choice: at the skeleton S-8's constant is exported and `admitProject` takes the owner from `reopenRefusalPlace` alone | M-26: `admitProject` takes the owner from `reopenRefusalPlace` alone, whatever `options.setAsideFileId` is |
```

5. **D3, Amendment 3, item 5 (the four places by name).**

   Old:

```text
is held by `engine/src/identity.rs` (line 341), `frontends/shell/MANUAL-WALKTHROUGH.md` (line 598, row I4 of Part I), `frontends/shell/e2e/admission-remediation.mjs` (line 82) and `frontends/shell/e2e/regression.mjs` (line 115)
```

   New:

```text
is held by `engine/src/identity.rs` (`admit_column_type`'s detail), `frontends/shell/MANUAL-WALKTHROUGH.md` (row I4 of Part I), `frontends/shell/e2e/admission-remediation.mjs` (`STRING_ID_MESSAGE`) and `frontends/shell/e2e/regression.mjs` (`STRING_ID_MESSAGE`)
```

6. **D3, Amendment 3, item 6 (the reopen notice).**

   Old:

```text
(`frontends/shell/src/project/reopenNotices.ts`, line 100 at 4630fa09)
```

   New:

```text
(`frontends/shell/src/project/reopenNotices.ts`, R-ENG)
```

7. **Check 4, section 2: item 13, followed by the new item 14 (S-8, ADV-2026-11-24-05 item 2 (b)).**

   Old:

```text
13. `src/admission/describeSummaryText.ts` (`:37-39`, `:56-58`) and `DescribeSummary.tsx` (`:65-70`): S-3 is shown beside the session statement when `set_aside_column` is not null.
```

   New:

```text
13. `src/admission/describeSummaryText.ts` (`:37-39`, `:56-58`) and `DescribeSummary.tsx` (`:65-70`): S-3 is shown beside the session statement when `set_aside_column` is not null.
14. `src/project/openProject.ts` and `src/project/reopenNotices.ts` (S-8, ADV-2026-11-24-05 item 2 (b)). The shell tells the two reopen attempts apart in `admitProject`, the one place that holds both the refusal and the attempt's options: when `reopenRefusalPlace(refusal, heldProject)` returns `ENGINE_REFUSAL_NOTICE` and `options.setAsideFileId` is true, the owner is S-8 instead. `reopenRefusalPlace` keeps its signature, so its other callers and its test do not change. S-8 is a new exported constant beside `ENGINE_REFUSAL_NOTICE`, and its one product caller is `admitProject`; `ENGINE_REFUSAL_NOTICE` stays for a reopen attempt that carries no choice. Three doc comments this makes untrue are corrected in the piece: `ENGINE_REFUSAL_NOTICE`'s, which places it beside every engine refusal at a reopen; `openProject.ts`'s header, which says the owner place is chosen from the code alone; and `reopenNotices.test.ts`'s header, which says each test there checks a builder's slots. S-T8 tests it (M-26).
```

Read the last amendment first.

Nothing above is edited.

## Amendment 5 — 2026-11-24 — the custodian's, after the architect's form gate, attempt 3 (PASS WITH NOTES, gate-log row 897): that gate's replacement words for D4, D5 and D6, carried byte for byte

The words below are the architect's, from row 897's report (`state/consults/gates/2026-11-24-text-id-opens-for-the-session-by-row-position-form-gate-architect-attempt-3.md`). Each item names the place, then the Old text it replaces and the New text, each exactly as the report gives it. Nothing above is edited. Like the form, they bind nothing until ADV-2026-11-23-34 is approved (ADV-2026-11-23-33 item 5).

The file ceiling stays 84 (ADV-2026-11-24-11 item 1). Item 4 below carries ADV-2026-11-24-11 item 5 into the form. The report's paragraph headed ADV-2026-11-24-11 item 4 changes nothing here: it goes to the advisor, who chooses between the gate's words for Decision 1 and that change.

1. **D4, section 2 item 14, as Amendment 4 item 7 gives it: where the shell tells the two reopen attempts apart.**

   Old:

```text
The shell tells the two reopen attempts apart in `admitProject`, the one place that holds both the refusal and the attempt's options:
```

   New:

```text
The shell tells the two reopen attempts apart in `admitProject`, where the owner place is chosen today and which holds both the refusal and the attempt's options:
```

2. **D4, the same item: `reopenRefusalPlace` and its test.**

   Old:

```text
`reopenRefusalPlace` keeps its signature, so its other callers and its test do not change.
```

   New:

```text
`reopenRefusalPlace` keeps its signature, so its test in `openProject.test.ts` does not change; `admitProject` is its one product caller.
```

3. **D4, the same item: the doc comments this makes untrue.**

   Old:

```text
Three doc comments this makes untrue are corrected in the piece: `ENGINE_REFUSAL_NOTICE`'s, which places it beside every engine refusal at a reopen; `openProject.ts`'s header, which says the owner place is chosen from the code alone; and `reopenNotices.test.ts`'s header, which says each test there checks a builder's slots.
```

   New:

```text
Six doc comments this makes untrue are corrected in the piece: `ENGINE_REFUSAL_NOTICE`'s, which places it beside every engine refusal at a reopen; `openProject.ts`'s header, which says the owner place is chosen from the code alone; `reopenRefusalPlace`'s, which calls its result the owner's place beside a reopen refusal; in `AdmissionPanel.tsx`, the `owner` member's, which names `reopenRefusalPlace` as the owner place's source, and `runAdmitPath`'s, which says a reopen's claims are the project file's and not the user's; and `reopenNotices.test.ts`'s header, which says each test there checks a builder's slots.
```

4. **D5, Amendment 3 item 2: E1's row N-S.**

   Old:

```text
   - E1: §4's row N-9, and the new row N-S in its own new file;
```

   New:

```text
   - E1: §4's row N-9, and the new row N-S in its own new file; N-S also asserts, before its scan counts, that N-3's input opens on the session tier, so that its red at the skeleton is the reason its row names;
```

5. **D6, Amendment 4 item 1's New: the stop at the base.**

   Old:

```text
A wire fixture that holds the detail, if item 5's search at the base finds one outside the Scope, would be an 85th path: that is a stop, and the file ceiling goes to the advisor before code.
```

   New:

```text
Any place that item 5's search at the base finds outside the Scope, a wire fixture included, would be an 85th path: that is a stop, and the file ceiling goes to the advisor before code.
```

6. **D6, Amendment 4's preamble: the stop at the base.**

   Old:

```text
With item 1 below, the 84th path is `engine/tests/identity.rs`, and a wire fixture found at the base is a stop.
```

   New:

```text
With item 1 below, the 84th path is `engine/tests/identity.rs`, and any place outside the Scope that item 5's search finds at the base, a wire fixture included, is a stop.
```

Read the last amendment first.

Nothing above is edited.

## Amendment 6 — 2026-11-24 — the architect's, under ADV-2026-11-24-12 item 2: (A), a retry after a question or a not-found reply does not carry the choice

1. **Authority.** The advisor's rulings ADV-2026-11-24-12 (`state/directives/2026-11-24-advisor-ruling-adv-2026-11-24-12-text-id-a-the-retry-does-not-carry-the-choice-one-architect-amendment-before-code-decision-1-as-drafted-ceiling-2150.md`), items 1, 2 and 4, and ADV-2026-11-24-15 (`state/directives/2026-11-24-advisor-ruling-adv-2026-11-24-15-text-id-amendment-6-oq-1-a-declared-guard-meets-item-2-oq-2-the-architects-words-the-estimate-stated.md`), items 1 to 4, under the human's delegation of 2026-11-13. They are not the human's words.

2. **Section 2 item 12: the choice's re-run, and a retry after a question or a not-found reply.**

   Old:

```text
    - Choosing re-runs `runAdmitPath` (`:216-292`) with `{...options, identity: undefined, setAsideFileId: true}`. A reopen keeps its `answer` and `relink`.
```

   New:

```text
    - Choosing re-runs `runAdmitPath` (`:216-292`) with `{...options, identity: undefined, setAsideFileId: true}`. A reopen keeps its `answer` and `relink`. A retry after a question or a not-found reply does not carry the choice: it carries the answer and the re-link, as today, and if the retry is refused for the file's `id` column again, the choice is offered again (ADV-2026-11-24-12 item 1; ADV-2026-11-24-15 item 2).
```

3. **Section 4, the shell table: a new row S-T9, after the row S-T8 that Amendment 4 item 4 adds.**

```text
| S-T9 ((A)) | `AdmissionPanel.test.ts`: `a_retry_after_a_question_or_a_not_found_reply_does_not_carry_the_choice`. `reopenRetryOptions`, an exported pure function, builds a reopen's retry options from the run's options and the retry's answer or re-link. Its product callers are the question block's two answers and `handleRelink`, each through `reopenPath`, which runs `runAdmitPath` with the options it is given. The run's options are `{ reopen: { answer: "copy", relink: <a path> }, setAsideFileId: true }`. Over them, an answer gives exactly `{ reopen: { answer, relink: <that path> } }`, and a re-link gives exactly `{ reopen: { answer: "copy", relink } }`. Neither has `setAsideFileId`. | (guard): green at the skeleton, because at 7a07ca1c `reopenPath` builds a retry's options from the reopen alone, which is (A). Its proof is its mutation. Declared as such. | M-27: `reopenRetryOptions` spreads the run's options, so the retry carries the choice |
```

4. **The line ceiling** (ADV-2026-11-24-12 item 4; ADV-2026-11-24-15 item 3). The line ceiling is restated to 2,150, before code. The architect's estimate is about 2,110 to 2,131 lines. The file ceiling stays 84. Section 7's line is not edited; an overrun at the head is class 8.

Read the last amendment first.

Nothing above is edited.

## Amendment 7 — 2026-11-26 — the custodian's, under ADV-2026-11-26-20: the five corrections of wording carried by reference; the block appended to ADR-016; the merge check; the build's base and place

*Pre-code amendment, written by the custodian. References only. The words it carries are the architect's, from its form gate, and were settled by the advisor under the human's delegation of 2026-11-13. None are the human's. Nothing above is edited.*

1. **Authority.**
   - The human approved ADV-2026-11-23-34 on 2026-11-26, as filed at `state/directives/2026-11-26-the-humans-message-adv-2026-11-23-34-and-adv-2026-11-26-01-approved-two-additions-release-v0-2-into-main-once-the-architect-reads-what-assumes-main-two-text-id-lab-facts.md`.
   - ADV-2026-11-23-34 is filed at `state/consults/2026-11-23-advisor-draft-adv-2026-11-23-34-for-the-humans-approval-adr-016-amendment-3-every-case-and-c2-not-the-humans-words.md`.
   - The advisor's ruling ADV-2026-11-26-20 is filed at `state/directives/2026-11-26-advisor-ruling-adv-2026-11-26-20-text-id-five-corrections-of-wording-the-form-records-them-by-an-amendment-the-build-ahead-of-b.md`.
   - By ADV-2026-11-26-20 item 1, items 2 to 4 of ADV-2026-11-23-34 stand as drafted. By its item 2, Decision 1 stays as drafted (ADV-2026-11-24-12 item 3).
2. **The five corrections, carried by reference** (ADV-2026-11-26-20 items 2 and 5).
   - Their text is ADV-2026-11-26-20 item 2's five four-backtick text blocks, (1) to (5). It is not retyped here.
   - Each holds in place of the text that item 2 names for it:
     - (1) KNOWN-LIMITATIONS item 3, the second sentence of ADV-2026-11-23-34 item 5;
     - (2) Amendment 3 of ADR-016, Decision 3, whole;
     - (3) that amendment's Decision 4, its second sentence, with the first sentence standing;
     - (4) that amendment's Consequences, the bullet on the engine;
     - (5) that amendment's Consequences, the bullet on the candidate list.
   - Two items of Amendment 3 above are settled. Its item 7's K-2 correction is (1). Its item 7's replacement words for the draft's clauses are (2) to (5), the Consequences sentence on the candidate list (C4) among them.
3. **The block appended to ADR-016** (ADV-2026-11-26-20 item 3).
   - It is the draft's block in `state/consults/2026-11-23-text-id-opens-for-the-session-by-row-position-adr-016-amendment-architect-draft.md`, from its heading to the words that item 3 names as its end, with corrections (2) to (5) in place.
   - The draft file was checked by script at this amendment's commit: 23103 bytes, sha256 3d1e6181d7f5918a581ec0ae92a529938aece3f53d312eec1a3ea92f184eb668. These are the figures item 3 names.
   - The heading is item 3's first bullet, byte for byte.
   - The line in italics under the heading, and the acceptance line at the block's end, are the worker's words. They say what item 3's second and third bullets list. The build's gates read them for truth, and so does the advisor at the merge check.
4. **ADR-016's Note 2026-11-26** (ADV-2026-11-26-20 item 4). It widens the candidate list, but Decision 3 and correction (5) name that list by its function, so neither needs another word.
5. **The merge check** (ADV-2026-11-26-20 item 6). The advisor compares the five texts with item 2 byte for byte, the heading with item 3, and the rest of the appended block with the draft file.
6. **The build** (ADV-2026-11-26-20 item 7).
   - ADV-2026-11-23-34 item 7 is met.
   - The piece is built on the identity route's head with PRs 364, 361 and 360 (ADV-2026-11-23-36), so it starts once that head exists.
   - In the order of builds it stands ahead of `reload-ends-the-old-pages-opens` (B).
   - Its e2e runs wait under ADV-2026-11-26-19.
7. **Nothing else changes.** No ceiling is restated: the file ceiling stays 84, and the line ceiling stays 2,150 (Amendment 6 item 4). By ADV-2026-11-26-20 item 8, nothing in that ruling is reserved.

## Amendment 8 — 2026-11-27 — the custodian's: the recorded base, the heads it takes in, and the reads made at it

*Pre-code amendment, written by the custodian. References and hashes only. Every hash and ancestry check below was taken by script (git rev-parse, git merge-base --is-ancestor, gh pr view) when this amendment was filed. The reads in item 4 are the base worker's, made at 2ed0af4e123263b6b3df5615c71cdf2a1309013e and reported in its hand-back; the custodian checked the parts that the last merge could move. Nothing above is edited.*

1. **The recorded base** (§8; Amendment 2 item 2) is 83812fd5ee7e211ea6c241321981132117851f0f on `cut/text-id-opens-for-the-session-by-row-position`, pushed. It is the identity route's built head 767033a25b0d2f231e91966378d874c58f56787f with three merge commits, each made with no conflict:
   - PR 364's head 50c7c3314fe9d9b5afe7fd78417c5afd0c7992ba, merged as 6d22355bcf42656fb7b26e93f23937ffa3f56302 by the base worker;
   - PR 361's head 0922c90a38ad91bf7922cf9a6baf0f8ed1344397, merged as 2ed0af4e123263b6b3df5615c71cdf2a1309013e by the base worker;
   - the identity route's words commit 912b3a2c204ac6613c10e75f09c39fb29663671c (ADV-2026-11-26-28), now that route's head, merged as 83812fd5ee7e211ea6c241321981132117851f0f by the custodian. Its diff from 2ed0af4e123263b6b3df5615c71cdf2a1309013e equals the words commit's diff from 767033a25b0d2f231e91966378d874c58f56787f, index lines aside, and touches four files.
   - The base is therefore the identity route's head as it now stands. The strings this piece's tests meet carry no placeholder mark.
2. **PR 360** is already in the identity route's line: its head 8d1f2f4ee6cef58ef5975ebfc6c2d8790d2fbcfb is an ancestor of 767033a25b0d2f231e91966378d874c58f56787f. It is not merged again (Amendment 2 item 2).
3. **Rule (00a) at the base.**
   - Of the twelve open PRs 350, 353, 356 and 358 to 366, every head is an ancestor of the base except PR 356 (88ce3c6575a81f248bcc0a203355c3a49a86ca30) and PR 362 (3469e439159372f0d435262a2d9265ce2af824b5).
   - PR 356 changes the shell's `src-tauri` commands and publish files. PR 362 changes the command bar and its test. Neither path is in §7's Scope or any amendment's class-9 additions, so neither is taken in.
   - PR 350 is in the base through PR 364's head, not through the identity route's.
   - **A correction to the custodian's own record.** The base worker's first read of the heads compared them with main, not with the base. PR 359 (the e2e console script and the e2e README) and PR 358 (KNOWN-LIMITATIONS item 68) then showed as sharing paths. The custodian took PR 359 in and left PR 358 out under rule (00a). At the base, both heads are already ancestors of 767033a25b0d2f231e91966378d874c58f56787f, as is PR 353. The merge of PR 359 found nothing to merge and made no commit, so that decision changes nothing.
4. **The reads at the base**, which are the worker's and fit the form:
   - **The Scope.** It has 84 paths. 78 are present, and the 6 that are absent are the new files §7 names.
   - **The literal.** `SKP_VERSION` is `skp/0.15`, the identity route's. `skp/0.16` is held only by the future-version fixture's three places, all in the Scope, and no code holds `skp/0.17`. This piece's literal `skp/0.16` and its future-version fixture `skp/0.17` stand (Amendment 2 item 2).
   - **The conformance set.** Under `protocol/skp/tests/conformance/` there are 68 occurrences of `skp/0.15` and 2 of `skp/0.16`.
   - **The sentence.** Amendment 2 item 3's sentence is held by the six paths that item names and by no other path, so there is no stop.
   - **`OpenDatasetRequest`.** Every file holding `OpenDatasetRequest {` is in the Scope. `declarationOptions` is in a Scope file, and `refusedDeclarationOptions` does not exist yet, so no class-9 addition is needed.
   - **The D-1 ranges and §10's seams** have moved by lines only, and their shapes are as the form describes. The words commit changes `AdmissionPanel.tsx` in one hunk of 11 lines for 11, so no seam there moves.
   - **The invalidators.** Nothing in §5 or §9 that can be read before code fires. There is no recovery-offer code, and there is no text-id e2e file.
5. **Suites at 2ed0af4e123263b6b3df5615c71cdf2a1309013e.** Each started nothing and ran in a shared hold:
   - shell: typecheck exit 0, then 1681 tests passed;
   - kernel: 527 passed, 48 ignored;
   - skp: 63 passed, with conformance 1;
   - engine: 508 passed, 20 ignored;
   - fmt clean in both workspaces;
   - clippy at exit 0 with 19 warning lines, for information only.

   The words commit's shell suites passed at 912b3a2c204ac6613c10e75f09c39fb29663671c (typecheck exit 0, 1681 tests). The build's first run of its suites is at the base.
6. **Counting** (§7). `<base>` is 83812fd5ee7e211ea6c241321981132117851f0f. The file ceiling stays 84 and the line ceiling stays 2,150.
7. **The node** goes in progress with its branch as evidence.
8. **Next:** the build, phase 2 (the code), on the recorded base. Its e2e runs wait under ADV-2026-11-26-19.

## Amendment 9 — 2026-11-27 — budget overrun, §7 not edited: class 8, the size at the code's head, before the gates

*Written by the custodian after the code and before its gates are dispatched. References and counts only; every count below was taken by script with §7's own counting command. §7 is not edited, and nothing above is edited.*

1. **The figures.**
   - Declared: §7's 1,950 changed lines over 80 files; the line ceiling restated to 2,100 (Amendment 3 item 4) and then to 2,150 (Amendment 6 item 4); the file ceiling 84 (Amendment 4; Amendment 6 item 4).
   - Final, by §7's command at ebf961d31fe959fc4dc42cef6827f78152aca0db, with `<base>` 83812fd5ee7e211ea6c241321981132117851f0f (Amendment 8 item 6): 2313 insertions and 221 deletions, 2534 changed lines over 84 files.
   - The files meet the ceiling. The lines run 384 over 2,150.
   - This is class 8 (`docs/PREREGISTRATION-TEMPLATE.md`, class 8). It opens no gate route, since the piece is under full gating. No line is cut to meet the ceiling.
2. **The estimate, with the count beside each part.** The counts are insertions plus deletions, by file group. §7's rows for the literal and for the request member have no files of their own: their lines sit in the files of the other rows.

   | Part | Estimated (about) | Counted |
   |---|---|---|
   | engine product (`engine/src/`, 4 files; `dataset.rs`'s own test module included) | 150 | 225 |
   | kernel product (`kernel/src/`, 3 files) | 80 | 74 |
   | protocol code and docs (`protocol/skp/src/`, `SKP-V0.md`, the conformance README; 4 files) | 90 | 85 |
   | shell product (`frontends/shell/src/`, tests apart; 9 files) | 140 | 197 |
   | the literal, and the request member in the Rust literals and the JSON | 190 and 65 | not apart; the protocol data and conformance fixtures, 20 files, count 338; the 21 engine and kernel test files of 8 lines or fewer count 41 |
   | tests: engine and kernel (27 files) | | 1007 |
   | tests: `protocol/skp/tests/fixtures.rs` | | 61 |
   | tests: the shell's unit tests and e2e scripts (12 files) | | 468 |
   | tests, all three rows | 1,090 | 1536 |
   | words and the ADR append (4 files) | 70 | 79 |
   | Amendment 3 item 4's additions | about 185 | in the rows above |
   | total | about 2,060; the architect's 2,110 to 2,131 (Amendment 6 item 4) | 2534 |
3. **Where the lines beyond the estimate sit.**
   - **Tests:** 1536 against about 1,090. The four new engine and kernel test files hold 912: `kernel/tests/text_id_set_aside_not_saved_or_published.rs` 367, `engine/tests/text_id_set_aside_session_tier.rs` 260, `kernel/tests/skp_admission_remediation.rs` 190 and `engine/tests/text_id_set_aside_scan_counts.rs` 95. In the shell, `AdmissionPanel.test.ts` counts 132 and `e2e/admission-remediation.mjs` 122.
   - **Engine product:** 225 against about 150, of which `dataset.rs` counts 138.
   - **Shell product:** 197 against about 140, of which `AdmissionPanel.tsx` counts 86 and the new `RowPositionChoice.tsx` 39.
   - **The worker's own account** (`state/consults/2026-11-27-text-id-opens-for-the-session-by-row-position-build-worker-report-phase-2.md`) gives the same total. Its figure for `engine/tests/text_id_set_aside_scan_counts.rs` is 94; the script counts 95.
4. **The reason,** for the gates to check: the overrun sits mostly in the tests, and then in the engine and shell products. Whether it is the declared design in more lines or a design that grew is the question of item 5.
5. **The question both gates answer in so many words,** as ADV-2026-11-27-06 item 3 put it for B: is every product item of the engine, the kernel, the protocol and the shell, and every test, inside §2 with its amendments as gated? A gate that finds an item §2 does not describe names it, and that item goes to the advisor before anything else.
6. **The worker's departures, for the gates** (the report's own list, by its numbers): 2, the scan-count test's input changed in its own commit after M-7 first came back not red; 6, K-6 covers R1 only, and M-13 and M-14 follow the tests' own doc comments; 7, `engine/ADMISSION-RESULTS.md`, outside the Scope, keeps the old refusal text; 9, the cites in `KNOWN-LIMITATIONS.md` item 3. No skeleton commit was made, so no red at a skeleton was observed. M-25, the e2e step, is not observed: E-1 waits for the port (ADV-2026-11-26-19).
7. **The identity route's head moved after the base.** That head is now 09dfe6b1de7b8b602ef4d67efa41a7d8e36ddcf9, which merges PR A's head d6c2daf69eb500027197945f5a4302f0508e0f69 (that form's Amendment 10). It is not in this branch. What it brings changes 5 files, and this piece changes one of them, `frontends/shell/e2e/README.md`. By ADV-2026-11-27-01 item 7, if the route's head moves at its build gates, this piece takes the new head in before its own gates. It comes in by a merge commit, with the reviewer's narrow read (ADV-2026-11-23-15 item 4).
8. **Next:** the build gates, after the route's head is in (item 7). Whether they go in two parts, and which of the route's heads they wait for, go to the advisor.
