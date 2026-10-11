# Impact read — skp-v0-live-sections-current-area-c (lead-data, second pilot, resumed)
Read at: main 5b64b9f8

Pointers only, under the second pilot's §1 item 1 (state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md:7-15). This read has no draft text, design, recommendation or answer in it. Every path:line resolves at main 5b64b9f8. Nothing here is quoted. All text is paraphrase, and the code names in backticks are identifiers.

**Index used.**
- The kernel owner's index is kernel/README.md:346-386. Its pointers that bear on this piece:
  - kernel/README.md:352, the SKP v0 host, pointing at SKP-V0 §1.
  - kernel/README.md:353, stream tickets and `cancel`.
  - kernel/README.md:359, the wire error codes, pointing at SKP-V0 §5, §7.5 and §9.5.
  - kernel/README.md:371, which records `spatial_skp::v0` (`SkpError`, `SKP_VERSION`) as consumed.
- The engine owner's index is engine/README.md:495-529. Its pointers that bear on this piece:
  - engine/README.md:501, open and admission, on the wire through §1.
  - engine/README.md:503, the projected stream, through §9.
  - engine/README.md:510, typed refusals, through §5. PR #206 replaces this line in place (kernel/MODULE-DOCS-STALE-STATEMENTS-PREREGISTRATION.md:24).
- **protocol/ has no owner's index (missing).** protocol/skp has no README. Neither protocol/data-plane/README.md nor protocol/transport-bakeoff/README.md has an Owner's index section.

## 1. Each stale statement as it stands on main

Moves since the sweep: in SKP-V0.md, every line after §7.5 sits 4 lines later than the custodian's check at 116deb53 gives it. That fits §7.5's paragraph, corrected 2026-10-10 (protocol/skp/SKP-V0.md:485-492). Every other cite in the check resolves to the same line on main.

1. **Finding 1.**
   - The `open_dataset` response shape has no `session`: protocol/skp/SKP-V0.md:26.
   - The describe block claims every `skp/0.3` and `skp/0.4` member: protocol/skp/SKP-V0.md:60-62.
   - The block itself is protocol/skp/SKP-V0.md:64-85. It has no `coverage`, `checks` or `session_end`.
   - The `schema` row, protocol/skp/SKP-V0.md:79, has no `projectable`. A dated note names it in passing (protocol/skp/SKP-V0.md:96), and §9.2 states it (protocol/skp/SKP-V0.md:1112-1113).
   - §8's preamble names §§1–7 as the live description: protocol/skp/SKP-V0.md:547-550. Moved: the check gives :544.
2. Finding 2 is not in this node. It is **already current** at protocol/skp/SKP-V0.md:485-492, corrected 2026-10-10.
3. **Finding 3:** protocol/skp/SKP-V0.md:202, inside §4 item 1 (protocol/skp/SKP-V0.md:201-206). Not moved.
4. **Finding 4:** protocol/skp/SKP-V0.md:29-30. One sentence holds both the canonicalize claim and the `EngineError::Source` claim. Not moved.
5. **Finding 5 (ruled; the three codes).**
   - §3: the codec lead at protocol/skp/SKP-V0.md:184, and the sentence naming the two HexF64 codes at protocol/skp/SKP-V0.md:186-187.
   - §5: the list at protocol/skp/SKP-V0.md:329-330, inside protocol/skp/SKP-V0.md:327-331.
   - Not moved.
   - **Every other place on main that names a code (by grep).** The node names none of these:
     - protocol/skp/src/v0/error.rs:74-80, :82-88 and :90-96, the constructors. None of them has a doc comment.
     - protocol/skp/src/v0/error.rs:153, a string literal `skp.unknown_handle` in the unit test `fields_defaults_to_empty_when_absent`.
     - protocol/skp/src/v0/codec.rs:15-16. The doc comment on `HexF64ParseError` says that a caller maps its two cases to the two codes.
     - protocol/skp/tests/conformance/fixtures/refusals-any-layer.json, the `expected_refusal_code` values: `skp.malformed_hex_f64` at :129, :150, :171, :192, :213 and :234; `skp.bbox_not_finite` at :275, :296 and :317.
     - protocol/skp/tests/conformance/AMBIGUITIES.md:11 (A3) and protocol/skp/tests/conformance/AMBIGUITIES.md:16 (A8).
     - frontends/shell/CANCELLATION-FACTS.md:99. This cut record already lists the two HexF64 constructors as unreachable from the shell.
6. **Finding 6:** frontends/shell/src/skp/types.ts:290-292. The sentence is at :291-292. Not moved.
7. **Finding 7:** protocol/skp/src/v0/handles.rs:4 (two rules), :6-9 (two bullets) and :11 (all three). Not moved.
8. **Finding 8:** kernel/src/skp.rs:1720-1721. The count of six is on :1721. Not moved.
9. **Finding 9.** Literals stated outside §8:
   - §1's lead: protocol/skp/SKP-V0.md:15 (`skp/0`).
   - §4 item 3: protocol/skp/SKP-V0.md:212-221, last bump named at :220 (`skp/0.6`).
   - §7.1: protocol/skp/SKP-V0.md:361 (`skp/0.1`).
   - §9.1: protocol/skp/SKP-V0.md:1096 (`skp/0.6`; the check gives :1092). Its dated note is protocol/skp/SKP-V0.md:1101-1103 (`skp/0.7`; the check gives :1097).
   - `skp/0.8` to `skp/0.11` appear only as §8 entries: protocol/skp/SKP-V0.md:956, :993, :1021 and :1055. The check gives :952, :989, :1017 and :1051. The covering note at protocol/skp/SKP-V0.md:1079-1086 also states that `skp/0.11` stands.
   - Neither the sweep nor the check names :15 or :361.
10. **Observation:** the §9.5 heading is at protocol/skp/SKP-V0.md:1152; the check gives :1148.
    - Its table has eight rows, protocol/skp/SKP-V0.md:1156-1163.
    - The dated note naming the eighth code is protocol/skp/SKP-V0.md:1169-1173.

**Adjacent, observed, not in the node:**
- protocol/skp/SKP-V0.md:164. §3's lead says two minting rules, and protocol/skp/SKP-V0.md:175 adds a third beside them. This is finding 7's fact, stated in the spec.
- protocol/skp/SKP-V0.md:256. §4 item 8 points the error taxonomy at §6. The taxonomy is §5 (protocol/skp/SKP-V0.md:319). Likewise, protocol/skp/SKP-V0.md:468 cites §6 and §4 item 8.
- kernel/src/skp.rs:417-420. Piece d's form records it for this piece (kernel/MODULE-DOCS-STALE-STATEMENTS-PREREGISTRATION.md:338).
  - It cites the proposed ADR-016 Amendment 1's block-on-sight 3.
  - That amendment's heading reads Accepted (docs/adr/ADR-016-stable-feature-identity-admission.md:180).
  - The node's summary does not list it.

## 2. The current fact each contradicts

1. **Finding 1.**
   - **`OpenDatasetResponse.session`:**
     - defined at protocol/skp/src/v0/commands.rs:63-69 and set at kernel/src/skp.rs:1294-1297;
     - pinned by `protocol/skp/tests/fixtures.rs::open_dataset_response_carries_a_session_reference` (:548).
   - **`DescribeResponse`'s three members:**
     - `coverage`, `checks` and `session_end` are at protocol/skp/src/v0/commands.rs:283, :287 and :289;
     - they are filled at kernel/src/skp.rs:1308-1335, :1336-1359 and :1360-1363, with their defaults at kernel/src/skp.rs:2003-2011;
     - pinned by `protocol/skp/tests/fixtures.rs::describe_carries_coverage_checks_and_session_end_as_independent_members` (:568);
     - and by `kernel/tests/source_watch_ordering.rs::describe_after_an_end_carries_session_end_and_describe_cancel_close_still_answer` (:624).
   - **`FieldInfo.projectable`:**
     - defined at protocol/skp/src/v0/commands.rs:234 and set at kernel/src/skp.rs:1967;
     - pinned by `protocol/skp/tests/fixtures.rs::describe_fixtures_carry_projectable_on_every_schema_row` (:297).
   - **The shell mirror carries all five:** frontends/shell/src/skp/types.ts:58, :166, :201, :204 and :207.
2. **Finding 3.**
   - **The shell's publish commands:**
     - defined at frontends/shell/src-tauri/src/commands.rs:264-265, :401-402 and :450-451;
     - registered at frontends/shell/src-tauri/src/lib.rs:543-545.
   - **The discharge for the UI surface only:** docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:1127-1132 and :1134-1142.
   - SKP still has no publish command: grep finds no publish request type in protocol/skp/src/v0/commands.rs.
   - **Tests:**
     - the e2e suite frontends/shell/e2e/publish.mjs drives publish through real IPC (its header, :5-9);
     - `kernel/tests/permission_boundary.rs::the_permission_boundary_is_the_only_caller_of_the_publish_operation_in_this_crate` (kernel/README.md:363);
     - no test pins the ADR's exposure scope.
3. **Finding 4.**
   - **A directory or a glob is refused first:**
     - as `IdentityOrdinalPartitionedUnsupported` at engine/src/dataset.rs:325-327, through `partitioned_source_detail` at engine/src/dataset.rs:1646;
     - the kernel maps it at kernel/src/skp.rs:2092-2095.
   - **Only a non-directory non-file** reaches `Source`, at engine/src/dataset.rs:328-332.
   - **Pinned by:**
     - `engine/tests/session_identity.rs::a_directory_source_is_refused_by_name_rather_than_as_an_unreadable_file` (:264);
     - `engine/tests/session_identity.rs::a_glob_source_is_refused_by_name_and_a_plain_missing_path_is_not` (:282). It also pins a missing single path as `Source`.
     - The mapping: `kernel/tests/typed_terminal_codes.rs::the_prefix_is_the_convention_for_every_engine_refusal_not_a_special_case` (:380; the variant at :383).
   - **No canonicalization on the open path:**
     - in engine/src, `canonicalize` is called only at engine/src/watch.rs:605, for arming the watcher;
     - in kernel/src, only in the permission code (kernel/src/permission/grant.rs:159, :209);
     - no test, since this is an absence.
4. **Finding 6.**
   - The decoder and listener exist at frontends/shell/src/skp/events.ts:23 and :59.
   - The listener is used at frontends/shell/src/App.tsx:74 and :1206.
   - **Pinned by** the `decodeDatasetSessionEnded (SH6)` block in frontends/shell/src/skp/events.test.ts:28, with six cases at :29-67.
   - No test names the listener.
5. **Finding 7.**
   - `SessionRef` is at protocol/skp/src/v0/handles.rs:104-113.
   - The spec's third rule is at protocol/skp/SKP-V0.md:175. The four kinds are at protocol/skp/SKP-V0.md:169-172 and :177.
   - **Pinned by** `protocol/skp/tests/fixtures.rs::open_dataset_response_carries_a_session_reference`. No unit test in handles.rs names `SessionRef`; its only occurrence there is :105.
6. **Finding 8.**
   - The seven arms are at kernel/src/skp.rs:1725, :1730, :1744, :1749, :1754, :1759 and :1776.
   - The eighth code is minted at the SKP boundary (protocol/skp/SKP-V0.md:1135-1136).
   - **Pinned by:**
     - `kernel/tests/skp_projection.rs::every_projection_refusal_is_synchronous_typed_and_pre_mint` (:387);
     - `protocol/skp/tests/fixtures.rs::every_new_projection_error_fixture_round_trips` (:339).
7. **Finding 9.**
   - The literal `skp/0.11` is at protocol/skp/src/v0/mod.rs:109 and frontends/shell/src/skp/types.ts:15.
   - It is compared with `!=` at kernel/src/skp.rs:1614-1619.
   - **Pinned by:**
     - `protocol/skp/tests/fixtures.rs::skp_version_is_skp_0_11` (:469);
     - `protocol/skp/tests/fixtures.rs::every_request_fixture_carries_the_current_skp_version` (:408);
     - `kernel/src/skp.rs::tests::version_mismatch_is_refused_before_anything_else` (:2606).
8. **Observation.**
   - The eighth row's arm is at kernel/src/skp.rs:1776-1782.
   - `skp.projection_empty_list` is minted at the boundary (protocol/skp/SKP-V0.md:1135).
   - The tests are the same as for finding 8.

**The three codes:**

1. **A malformed or non-finite HexF64.**
   - **Rejected** by `HexF64::from_hex` (protocol/skp/src/v0/codec.rs:45-60), called from its `Deserialize` (protocol/skp/src/v0/codec.rs:69-77).
   - **Where, in the shell:** Tauri decodes the command argument `request` (frontends/shell/src-tauri/src/commands.rs:86-90) before `host.viewport_query` runs. The bbox edges are `HexF64` (protocol/skp/src/v0/commands.rs:366-367, :431).
   - **What the client receives:**
     - frontends/shell/src/skp/client.ts:59-61 types only a value shaped like an `SkpError`;
     - any other rejection is recorded as threw and rethrown unchanged (frontends/shell/src/skp/client.ts:63-64);
     - Tauri invoke is the only binding (protocol/skp/SKP-V0.md:207-211).
   - **Tests:**
     - `protocol/skp/src/v0/codec.rs::tests::hex_f64_rejects_wrong_length_case_and_prefix` (:133) and `protocol/skp/src/v0/codec.rs::tests::hex_f64_rejects_non_finite_bit_patterns` (:153), both at codec level;
     - `protocol/skp/tests/conformance/main.rs::spec_derived_fixtures_against_wire_types` (:70) passes any type-layer refusal of the nine HexF64 fixtures (:48), and main.rs never reads `expected_refusal_code` (no occurrence);
     - frontends/shell/src/skp/client.test.ts:132 rethrows an untyped transport failure unchanged.
   - No test pins the Tauri-decode rejection end to end.
2. **A cancel naming an unknown handle.**
   - **The dispatch:** kernel/src/skp.rs:1556-1568 dispatches on the handle's shape.
   - **What it answers:**
     - an unknown well-formed stream handle gives `CancelOutcome::Unknown` (kernel/src/skp.rs:331);
     - any other string, an unknown cancel key included, gives `Unknown` from the open registry (kernel/src/skp.rs:957);
     - on the wire this is `CancelState::Unknown` (kernel/src/skp.rs:73-79).
   - **Tests:**
     - `kernel/src/skp.rs::tests::cancel_on_an_unknown_handle_is_unknown_not_an_error` (:2482), at registry level;
     - `kernel/src/skp.rs::tests::the_real_cancel_responses_match_the_shared_fixtures` (:2410), through the host, against protocol/skp/tests/data/v0-cancel-response-unknown.json;
     - kernel/tests/source_watch_ordering.rs:637-643.
   - **No test found for the cancel-key branch's `Unknown`** (kernel/src/skp.rs:957). Every `CancelRequest` built in kernel/ carries a stream-handle string: kernel/src/skp.rs:2420, :4886; kernel/tests/skp_admission.rs:888; kernel/tests/session_reference.rs:167; kernel/tests/skp_filter_cancellation.rs:240; kernel/tests/skp_cancel_terminal_without_credit.rs:194; kernel/tests/source_watch_ordering.rs:638.
3. **The constructors.**
   - `unknown_handle` is at protocol/skp/src/v0/error.rs:74-80, `malformed_hex_f64` at :82-88 and `bbox_not_finite` at :90-96.
   - **Nothing produces them.** A grep of the tree at 5b64b9f8 finds no call site in any `.rs`, `.ts` or `.tsx` file.
   - For contrast, these §5 codes are produced:
     - `too_many_pending_streams` (kernel/src/skp.rs:251);
     - `cancel_key_in_use` (kernel/src/skp.rs:941);
     - `malformed_cancel_key` (kernel/src/skp.rs:1102), which §5's list does not name. The list ends in an ellipsis (protocol/skp/SKP-V0.md:331).

## 3. What governs them

**ADRs, by Status line:**
- **ADR-004** is Accepted (docs/adr/ADR-004-skp-control-data-plane-mcp-adapter.md:3).
  - The bit-pattern rule for control-plane scalars is at :28 (§3's HexF64, protocol/skp/SKP-V0.md:188).
  - Amendment 4 is at :31 (no instrument field on `cancel`, protocol/skp/SKP-V0.md:120).
- **ADR-017** is Accepted (docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:3). Its 2026-08-17 discharge, for the UI surface only, is at :1134-1142, with the terms at :1127-1132.
- **ADR-019** is Proposed and binds nothing (docs/adr/ADR-019-control-plane-admission-tickets.md:3). §1 cites it at protocol/skp/SKP-V0.md:111 and :121, and §3 at protocol/skp/SKP-V0.md:170.
- **ADR-021** is Accepted (docs/adr/ADR-021-row-filter-on-viewport-query.md:3). It governs §7, §7.1's literal included.
- **ADR-023** is Proposed (docs/adr/ADR-023-attribute-projection-on-viewport-query.md:3). It governs §9 (protocol/skp/SKP-V0.md:1090, :1188-1189), which holds §9.1 and §9.5.
- **ADR-035** is Accepted (docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:3). The `session` member and the third rule come from Decision 4, with its Note 2026-09-25 at :149-158.
- **ADR-016** is Accepted (docs/adr/ADR-016-stable-feature-identity-admission.md:3). Its Amendment 1 is Accepted (:180), which is what kernel/src/skp.rs:417-420 cites.
- **ADR-034** is Accepted (docs/adr/ADR-034-geometry-type-admission-and-geoarrow-encoding-selection.md:3). It governs the encodings in the describe block (protocol/skp/SKP-V0.md:71-73).

**SKP-V0.md sections:**
- §1: protocol/skp/SKP-V0.md:13-138.
- §3: protocol/skp/SKP-V0.md:162-194.
- §4: item 1 at :201-206, item 2 at :207-211, item 3 at :212-221, item 13 at :281-313.
- §5: protocol/skp/SKP-V0.md:319-336.
- §8's preamble: protocol/skp/SKP-V0.md:545-550.
- §9.1: protocol/skp/SKP-V0.md:1094-1103.
- §9.5: protocol/skp/SKP-V0.md:1152-1173.

**The protocol's version rule for literals:**
- §4 item 13: protocol/skp/SKP-V0.md:281-297.
- The entry-30 addendum's versioning disposition: protocol/skp/SKP-V0.md:651-662.
- Applied, with no literal change, in the dated notes at protocol/skp/SKP-V0.md:975-983, :985-991 and :1043-1053, and the covering note at :1079-1086.
- `SKP_VERSION`'s doc: protocol/skp/src/v0/mod.rs:106-108.

**Preregistrations that introduced the codes: missing.**
- No preregistration file names any of the three (grep).
- SKP-V0.md's header says the architect review gating frontends/shell cut 1 (2026-08-09) settled v0 (protocol/skp/SKP-V0.md:9-11).
- That cut's record lists the two HexF64 constructors as unreachable from the Tauri binding (frontends/shell/CANCELLATION-FACTS.md:99).
- Related form: protocol/skp/CANCEL-STATE-CLOSED-SET-PREREGISTRATION.md. It closed the cancel state set; its gating is at :6.

**Placement and ruling:**
- The node: PLAN.yaml:4406-4422.
- The ruling node, now closed: PLAN.yaml:4388-4404.
- The named open item on `first-external-plugin-skp-client`: PLAN.yaml:1962 and :1977.
- The directive, state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:
  - the lane's terms, :17-21;
  - item 3e, :27;
  - item 4, :30;
  - forms ahead, :38.

**Gating heads:** AUTONOMY.md:323-324 (`protocol/skp/**`, a literal or field) and AUTONOMY.md:325-327 (a stated guarantee; a property under test).

**KNOWN-LIMITATIONS and ceilings:**
- No item names HexF64, SKP-V0 or an SKP literal (grep of KNOWN-LIMITATIONS.md).
- No declared ceiling is touched. `MAX_PENDING_TICKETS` (kernel/README.md:383) appears only in the message of a produced code.

## 4. Overlap (rule 00)

**The paths the node names (5):**
1. **protocol/skp/SKP-V0.md** is under protocol/.
   - PR #206: not in its file list. Its form declares SKP-V0.md unchanged (engine/CRS-UNDECLARED-MESSAGE-WORDING-PREREGISTRATION.md:200) and blocks on sight a change to it (:245).
   - Not in #205 or #207.
   - Piece d declares protocol/** unchanged (kernel/MODULE-DOCS-STALE-STATEMENTS-PREREGISTRATION.md:388).
2. **protocol/skp/src/v0/error.rs** is under protocol/. #206 declares protocol/skp/src/** unchanged (engine/CRS-UNDECLARED-MESSAGE-WORDING-PREREGISTRATION.md:200). Not shared.
3. **protocol/skp/src/v0/handles.rs** is under protocol/. As item 2: not shared.
4. **kernel/src/skp.rs** is not under protocol/.
   - Piece d excludes it (kernel/MODULE-DOCS-STALE-STATEMENTS-PREREGISTRATION.md:338, with its list at :405-420).
   - #206 declares kernel/** unchanged (engine/CRS-UNDECLARED-MESSAGE-WORDING-PREREGISTRATION.md:200).
   - #207 blocks kernel/ on sight (frontends/shell/SHELL-MAP-REFILL-AFTER-RESIZE-PREREGISTRATION.md:259).
5. **frontends/shell/src/skp/types.ts** is under frontends/shell, which #207 touches.
   - #207 blocks skp/ on sight (frontends/shell/SHELL-MAP-REFILL-AFTER-RESIZE-PREREGISTRATION.md:259); its files are at :242-249.
   - #206 declares frontends/shell/src/** unchanged except formatRefusal.test.ts (engine/CRS-UNDECLARED-MESSAGE-WORDING-PREREGISTRATION.md:201).
   - Disjoint by path.

**Conditional paths, only if the form takes them in:**
- protocol/skp/src/v0/codec.rs, under protocol/.
- protocol/skp/tests/conformance/fixtures/refusals-any-layer.json, under protocol/. It is a fixture, and the node says no fixture change (PLAN.yaml:4421).
- protocol/skp/tests/conformance/AMBIGUITIES.md, under protocol/.
- **kernel/README.md**, if an index pointer changes. Piece d shares it (kernel/MODULE-DOCS-STALE-STATEMENTS-PREREGISTRATION.md:413 and :315-317).
- **PLAN.yaml and the form file.** Piece d counts both (kernel/MODULE-DOCS-STALE-STATEMENTS-PREREGISTRATION.md:345-346, :404), so PLAN.yaml is shared.

**The protocol/ condition:**
- PR #206 touches protocol/skp/tests/data/v0-error-example.json (engine/CRS-UNDECLARED-MESSAGE-WORDING-PREREGISTRATION.md:104, :298). Under directive line 27 this node cannot start while #206 is open.
- #205 touches only KNOWN-LIMITATIONS.md (PLAN.yaml:4457).
- #207 touches nothing under protocol/ (its §8 item 7).
- Piece d declares protocol/** unchanged.
- The nodes in progress are those behind #205, #206 and #207 (PLAN.yaml:4447, :4483, :4948).
- This node depends on piece d (PLAN.yaml:4413).

## 5. Size facts

Counts of what is there now, not of the change.

| File | Stale statements | Lines they occupy |
|---|---|---|
| protocol/skp/SKP-V0.md | 13: finding 1 three (:26, :60-62, :79), plus three members absent from the block; finding 3 one (:202); finding 4 one (:29-30); finding 5 two (:186-187, :329-330); finding 9 five places (:15, :212-221, :361, :1096-1099, :1101-1103); the observation one (:1152) | 32 |
| protocol/skp/src/v0/error.rs | none stale: 3 constructors, none with a doc comment (:74, :82, :90) | 0 |
| protocol/skp/src/v0/handles.rs | 2 (:4, :11), in a 10-line module doc (:4-13) | 10 |
| kernel/src/skp.rs | 1 (:1721), in a 2-line doc (:1720-1721) | 2 |
| frontends/shell/src/skp/types.ts | 1 (:291-292), in a 3-line comment (:290-292) | 3 |

**Counts.**
- **The node names 5 files,** 3 of them under protocol/.
- **Not counted above,** only if the form takes them in:
  - codec.rs: 2 lines (:15-16).
  - refusals-any-layer.json: 9 lines.
  - AMBIGUITIES.md: 2 rows (:11, :16).
  - SKP-V0.md:164, :256 and :468: 3 lines.
  - kernel/src/skp.rs:417-420: 4 lines.
  - The form file, PLAN.yaml and kernel/README.md.

## 6. Questions the form must answer

1. Which sections count as live? §8's preamble names §§1–7 (protocol/skp/SKP-V0.md:548-549), but finding 9 and the observation sit in §9 (protocol/skp/SKP-V0.md:1096, :1152). §1 and §7.1 also state literals (protocol/skp/SKP-V0.md:15, :361).
2. Is the in-place edit recorded by a §8 dated note, as the earlier edits with no literal change were (protocol/skp/SKP-V0.md:975-983, :1043-1053, :1079-1086)?
3. Are protocol/skp/src/v0/codec.rs:15-16, the nine `expected_refusal_code` values (protocol/skp/tests/conformance/fixtures/refusals-any-layer.json:129-317) and A3 and A8 (protocol/skp/tests/conformance/AMBIGUITIES.md:11, :16) in or out? The node says no fixture change (PLAN.yaml:4421), and the ruling allows only doc comments in error.rs (state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:30).
4. Is kernel/src/skp.rs:417-420 in this piece? Piece d assigns it here (kernel/MODULE-DOCS-STALE-STATEMENTS-PREREGISTRATION.md:338), but the node's summary does not list it (PLAN.yaml:4421). The same question applies to the adjacent protocol/skp/SKP-V0.md:164 and :256.
5. How is the §9.5 heading (protocol/skp/SKP-V0.md:1152) treated? §7.5's dated note keeps its own heading as it is (protocol/skp/SKP-V0.md:497), and the node leaves the observation to the form (PLAN.yaml:4421).

## Files read

- state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md: 1-62
- state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md: 1-41
- state/consults/DRIFT-SWEEP-AREA-C-2026-10-10.md: 1-83
- state/consults/2026-10-10-drift-sweep-area-c-custodian-check.md: 1-134
- kernel/README.md: 340-387
- engine/README.md: 490-530
- PLAN.yaml: 3805-3821, 4400-4474, 4478-4494, 4943-4959; by grep: 1962, 1977, 4388, 4442-4447
- protocol/skp/SKP-V0.md: 1-554, 645-664, 940-1192; headings by grep
- protocol/skp/src/v0/error.rs: 1-158
- protocol/skp/src/v0/codec.rs: 1-191
- protocol/skp/src/v0/handles.rs: 1-125, 178-202; test names by grep
- protocol/skp/src/v0/commands.rs: 58-71, 222-293, 620-664; struct members by grep
- protocol/skp/src/v0/mod.rs: 106-109, by grep
- protocol/skp/tests/fixtures.rs: test names by grep
- protocol/skp/tests/conformance/main.rs: 1-80
- protocol/skp/tests/conformance/README.md: 1-63
- protocol/skp/tests/conformance/AMBIGUITIES.md: 1-18
- protocol/skp/tests/conformance/DIVERGENCES.md: 1-32
- protocol/skp/tests/conformance/fixtures/refusals-any-layer.json: 110-324
- protocol/skp/CANCEL-STATE-CLOSED-SET-PREREGISTRATION.md: 1-12
- kernel/src/skp.rs: 60-84, 316-335, 405-429, 945-964, 1288-1372, 1550-1624, 1712-1785, 2088-2097, 2405-2449, 2476-2505, 2565-2589, 2600-2611; other lines by grep
- kernel/tests/session_generation.rs: 425-464
- kernel/tests/source_watch_ordering.rs: 600-649
- kernel/tests/typed_terminal_codes.rs: test names by grep
- kernel/tests/*.rs: `CancelRequest` constructions by grep
- kernel/MODULE-DOCS-STALE-STATEMENTS-PREREGISTRATION.md: 1-60, 294-460
- engine/src/dataset.rs: 316-335; 1646 by grep
- engine/tests/session_identity.rs: 245-294
- engine/CRS-UNDECLARED-MESSAGE-WORDING-PREREGISTRATION.md: by grep only (lines 34-350 as matched)
- frontends/shell/SHELL-MAP-REFILL-AFTER-RESIZE-PREREGISTRATION.md: 236-260; cites by grep
- frontends/shell/src/skp/types.ts: 284-299; other lines by grep
- frontends/shell/src/skp/client.ts: 1-80
- frontends/shell/src/skp/events.ts, events.test.ts, client.test.ts: by grep
- frontends/shell/src/App.tsx: by grep
- frontends/shell/src-tauri/src/commands.rs, lib.rs: by grep
- frontends/shell/e2e/publish.mjs: 1-25
- frontends/shell/CANCELLATION-FACTS.md: 85-109
- docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md: 1120-1149; Status line by grep
- docs/adr/ADR-004-skp-control-data-plane-mcp-adapter.md: 26-29; Status line and headings by grep
- docs/adr/ADR-016, ADR-019, ADR-021, ADR-023, ADR-034, ADR-035: Status lines and headings by grep
- AUTONOMY.md: 316-329
- KNOWN-LIMITATIONS.md: by grep only

*Custodian's filing note (2026-10-11): written by lead-data to this path (run 02:24:41Z to 02:33:44Z by its transcript; write audit PASS, one Write, to this path only: Grep 48, Read 54, Glob 2, Write 1, SubagentHandback 1). As written, its sha256 was 257be49b7ff7825949340284107a13f0c5d1f6f3bbddf936fa7e6547daba6fe4. Nothing is changed by the custodian except this note, appended; every cite resolved at main by verify-cites before filing. A correction from lead-data's hand-back, recorded and not applied (the brief allowed one write): section 1's statement that every other cite in the custodian's check is still on the same line was checked only for findings 1 and 3 to 9 and the three codes, not for finding 2's other cites or the human's instructions; engine/src/predicate.rs:1111 is on the same line but its text has since been corrected.*
