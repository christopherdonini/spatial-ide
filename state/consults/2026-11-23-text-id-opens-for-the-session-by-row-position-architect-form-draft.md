*Filed by the custodian: the architect's draft preregistration for text-id-opens-for-the-session-by-row-position, a file whose own `id` column cannot serve opened for the session by row position at the user's choice (the human's message of 2026-11-23, item 3; ADV-2026-11-23-33 item 5), drafted on the unapproved draft of ADR-016 Amendment 3 (`state/consults/2026-11-23-text-id-opens-for-the-session-by-row-position-adr-016-amendment-architect-draft.md`), node:text-id-opens-for-the-session-by-row-position@form-draft, dispatched at 2026-11-23T22:03:04Z. It read the repository at a2d58940 in a detached read worktree and ran nothing. Its run: Read 72, Grep 44, Glob 7, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-23T22:03:07Z to 2026-11-23T22:17:32Z by its transcript; 0 calls named the main checkout. The report below from its hand-back, 36191 bytes, sha256 785a85bd353262b7a77ea20db06c5d7943d95fca354282d759b3f3116393c85f, byte for byte, nothing masked. The form is committed from it at `governance/forms/frontends/TEXT-ID-OPENS-FOR-THE-SESSION-BY-ROW-POSITION-PREREGISTRATION.md`; the note after its end mark stays here.*

---

# Preregistration: text-id-opens-for-the-session-by-row-position (full form)

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
---END OF FORM---

**Note: what the code did not settle and what goes to the human**

1. **C2's re-run.** The open after the user's answer `copy` happens after the copy is written (`project/mod.rs:756-765`, `:794-796`). By my reading, re-running the reopen with the same answer finds the known place and does not copy again. I have not seen this run. K-7 should cover the `copy` answer once, or the worker reads it at the base.
2. **The TS `IdentityInfo` member.** Many `App.*.test.tsx` files build describe fixtures with `identity: {…}`. The identity route added `candidate_columns` without them in its Scope (its §7 at `:233`), so its pattern presumably compiles without them. The worker confirms this at the base. Any file that has to change is class 9, declared before code.
3. **Request-literal files at the base.** The 23 files are counted at a2d58940. Held branches may add more; §7 names the two I expect.
4. **Session history.** K-5 rests on the history writing the same admission object as the project (the test string at `kernel/src/session_history.rs:1901`). I did not read its writer path.
5. **PR 364's regions in `predicate.rs`.** They are not read here.
6. **N-9's pre-cancel point.** Whether a token cancelled before the call reaches the scan's cancel arm (`dataset.rs:2071-2073`) or an earlier check is not settled. Either way, its mutation proves the arm.
7. **The text set under OPEN-H1 narrow.** Which Arrow text types DuckDB yields was not run.

**Matters for the human:** Amendment 3 itself, OPEN-H1 to H4, and K-1/K-2 (the human's sentences). No dependency, lockfile or workflow changes. The ADR append is red-line text and lands only as the human approves it, byte for byte.
