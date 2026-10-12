# Impact read — kernel-close-races-followups (lead-data, second pilot, piece 3)
Read at: main e32798ae

*Pointers only, under `state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md` §1 item 1. Nothing below is a draft, a design, a recommendation or an answer. No quotation marks appear except around byte-copied text; everything else is paraphrase. Where a cite in the code is stale, its old target is written in words (for example, line 760), so that the only `path:line` tokens in this file are pointers that resolve at e32798ae.*

## 0. The node and its sources

- The node: `PLAN.yaml:3083-3099`. Title `PLAN.yaml:3084`, `gate: none` at `PLAN.yaml:3092`, budget at `PLAN.yaml:3094`, summary at `PLAN.yaml:3098`. Blocked behind it: `data-plane-crowded-start-detail-spaces` (`PLAN.yaml:2664`).
- The close-races routing: Amendment 1, item 1.4 at `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md:387-397`; the B1-comments bullet is `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md:392`. Amendment 1, item 1.2's site table is at `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md:367-378`. Amendment 2, row 11 is at `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md:454-456`.
- The worker's noticed-but-not-done list: `state/consults/2026-09-27-kernel-generation-close-races-worker-report-1.md:62-64`.
- PR #147's gate-1 architect, item 6 and N5: `state/consults/gates/2026-09-30-ticket-liveness-redeem-gate1-architect.md:41-44`, `:51`. Its N4 (how a branch-only test-text span is named) is `state/consults/gates/2026-09-30-ticket-liveness-redeem-gate1-architect.md:50`.
- PR #148's gate-1 architect, N1: `state/consults/gates/2026-09-30-raw-path-refusal-code-gate1-architect.md:53`.
- The catalog form's intake row: `kernel/CATALOG-OPEN-REPLACE-DROP-NOTE-PREREGISTRATION.md:29`. The same routing appears in the cancel-state form's intake row, `protocol/skp/CANCEL-STATE-CLOSED-SET-PREREGISTRATION.md:38`, which also says that form's §8 note is not this node's entry.
- The rustfmt consult, (c) 2: `state/consults/2026-10-02-workspace-rustfmt-architect-draft.md:266`. `workspace-rustfmt` is done (`PLAN.yaml:3423-3434`, status at `PLAN.yaml:3428`).
- B1 follow-ups: Amendment 1, item 6 at `engine/B1-FOLLOWUPS-PREREGISTRATION.md:280`, and item 7's second bullet at `engine/B1-FOLLOWUPS-PREREGISTRATION.md:283`. The node split is at `engine/B1-FOLLOWUPS-PREREGISTRATION.md:131-134`, and the K-row shape at `engine/B1-FOLLOWUPS-PREREGISTRATION.md:104`. That form's own claim of no `kernel/README.md` change is at `engine/B1-FOLLOWUPS-PREREGISTRATION.md:129`. Its gate-1 architect, N-4: `state/consults/gates/2026-10-05-b1-engine-kernel-half-followups-gate1-architect.md:35-37`, routed at `state/consults/gates/2026-10-05-b1-engine-kernel-half-followups-gate1-architect.md:116`.

**What item 6 leaves.** Item 6 discharges the `kernel/tests/skp_projection.rs` half of close-races item 1.4. At e32798ae, that file's two remaining rooted self-line tokens sit inside comments that name their commit: `kernel/tests/skp_projection.rs:1121-1125` and `kernel/tests/skp_projection.rs:1463-1468`, both observed at `ca3d7ae`. Of the summary's item-1.4 clause (the B1 recorded-mutation comments in both files, `PLAN.yaml:3098`), what is left is the `kernel/tests/wire_bytes_invariant.rs` half only. The B1 form's node split names that half: `engine/B1-FOLLOWUPS-PREREGISTRATION.md:134`, pinned at b438c587. The summary's other clauses are untouched by item 6: the sink comment, the line cites into skp.rs, the `SkpHost::generations` doc, the engine-code prefix sites, and SKP-V0's `close_dataset` paragraph. Item 7 adds the `kernel/README.md` line.

## 1. Sites the piece touches

| # | Site | Authoritative source at e32798ae | Pinned by (test) |
|---|---|---|---|
| S1 | The comment in `open_dataset`'s sink, `Admitted` arm (names a session reference no client holds) | `kernel/src/skp.rs:1139-1143`, inside the sink at `kernel/src/skp.rs:1126-1169`; `SkpHost::open_dataset` at `kernel/src/skp.rs:1098` | `kernel/src/skp.rs::ticket_drop_under_lock_regression::the_close_race_mints_no_generation_so_no_unheld_reference_exists` (`kernel/src/skp.rs:4205`); the arming-and-admission pins at `kernel/README.md:357`, for example `kernel/tests/source_watch_ordering.rs::a_signal_between_arming_and_admission_refuses_the_open` (`kernel/tests/source_watch_ordering.rs:336`). No test pins the comment's wording |
| S2 | `SkpHost::generations`'s doc: a bare line 689 for `SkpHost::new`, and a shell cite of lines 373-377 / 376 | `kernel/src/skp.rs:1086-1096`; the stale tokens are on `kernel/src/skp.rs:1089` and `kernel/src/skp.rs:1091` | `kernel/tests/session_generation.rs::a_ticket_whose_generation_ended_refuses_at_redemption_with_its_typed_code` (`kernel/tests/session_generation.rs:363`; it calls `host.generations()` at `kernel/tests/session_generation.rs:377` and `:408`); index pin `kernel/README.md:355` |
| S3 | `SkpHost::new`, the cite's target | `kernel/src/skp.rs:1054-1071` | index pins at `kernel/README.md:352` |
| S4 | The shell's product caller that S2's doc names | `frontends/shell/src-tauri/src/lib.rs:428-432` (`host.generations()` at `frontends/shell/src-tauri/src/lib.rs:431`); the host is built at `frontends/shell/src-tauri/src/lib.rs:288`. Lines 373-377 of that file are now the main-window URL check (`frontends/shell/src-tauri/src/lib.rs:373-377`) | as S2 |
| S5 | skp.rs's own line cites. Besides S2: two cites of SKP-V0 line 266 for the `engine.` + variant-name rule, which now sits in SKP-V0 §5 at `protocol/skp/SKP-V0.md:325`; line 266 is §4 item 9 (idempotency) | `kernel/src/skp.rs:1704`, `kernel/src/skp.rs:2070` | `kernel/tests/typed_terminal_codes.rs::the_prefix_is_the_convention_for_every_engine_refusal_not_a_special_case` (`kernel/tests/typed_terminal_codes.rs:342`) pins the mapping, not the cite |
| S6 | Other line tokens in skp.rs comments, read for completeness. `kernel/src/skp.rs:540` and `kernel/src/skp.rs:669` cite `engine/ADMISSION-PREREGISTRATION.md` lines 742-744, which PR #147's gate found accurate (`state/consults/gates/2026-09-30-ticket-liveness-redeem-gate1-architect.md:42`). `kernel/src/skp.rs:540` also carries a line cite into the ledger, `DECISIONS-PENDING.md` line 44. `kernel/src/skp.rs:3750` is a recorded panic message (an observation in test text), not a cite | as listed | — |
| S7 | `session_generation.rs`'s cites into skp.rs, all stale at e32798ae: line 760 for `viewport_query` (now `kernel/src/skp.rs:1370`); lines 797-803 for the pre-check refusal (now `kernel/src/skp.rs:1463-1469`); lines 176-187 for `StreamRegistry::redeem` (now `kernel/src/skp.rs:274`); line 517 and lines 506-508 for the age bound and its doc (the sum is at `kernel/src/skp.rs:733` in `prune_locked`, `kernel/src/skp.rs:732`) | `kernel/tests/session_generation.rs:353-354`, `kernel/tests/session_generation.rs:427`, `kernel/tests/session_generation.rs:476-477` | the T1, T2 and T3 tests: `a_ticket_whose_generation_ended_refuses_at_redemption_with_its_typed_code` (`kernel/tests/session_generation.rs:363`), `an_unknown_handle_falls_through_to_the_ticket_registrys_own_refusal` (`kernel/tests/session_generation.rs:441`), `the_dead_ticket_record_is_bounded` (`kernel/tests/session_generation.rs:487`) |
| S8 | `session_generation.rs`'s cites into files other than skp.rs, in the same comment blocks and also stale. Shell `lib.rs` lines 373-377 (`kernel/tests/session_generation.rs:311`, `:406`). Data-plane `server.rs` line 384, where the `factory.create` call is now `protocol/data-plane/src/server.rs:508` (`kernel/tests/session_generation.rs:313`, `:407`). `typed_terminal_codes.rs` lines 40-55 and 60-68, where `fixture` is now `kernel/tests/typed_terminal_codes.rs:49-64` and `touch_modification_time` begins at `kernel/tests/typed_terminal_codes.rs:66` (`kernel/tests/session_generation.rs:317`, `:336`). A ledger line cite, `DECISIONS-PENDING.md` line 46 (`kernel/tests/session_generation.rs:310`) | as listed | as S7 |
| S9 | `wire_bytes_invariant.rs`'s recorded-mutation comment: a bare self-line 350, with no commit named for the observation. The failing assertion's message is now at `kernel/tests/wire_bytes_invariant.rs:427-429` | `kernel/tests/wire_bytes_invariant.rs:364-372` (the self-line on `kernel/tests/wire_bytes_invariant.rs:372`); the close-races line it sits under is `kernel/tests/wire_bytes_invariant.rs:300-301` | `wire_bytes_invariant_holds_for_the_projected_ticket_path_case_too` (`kernel/tests/wire_bytes_invariant.rs:374`) |
| S10 | `kernel/tests/skp_projection.rs`: discharged (section 0) | `engine/B1-FOLLOWUPS-PREREGISTRATION.md:280` | — |
| S11 | `EngineSource::next_into`: engine-code prefix, mid-stream | `kernel/src/lib.rs:662-689` (prefix applied at `kernel/src/lib.rs:684`) | `kernel/tests/typed_terminal_codes.rs::the_prefix_is_the_convention_for_every_engine_refusal_not_a_special_case`; index pin `kernel/README.md:359` |
| S12 | `create_from_raw_params`: engine-code prefix at create time (PR #148) | `kernel/src/lib.rs:394-444` (its own comment at `kernel/src/lib.rs:428-430`, the call at `kernel/src/lib.rs:432`) | `kernel/tests/end_to_end.rs::a_create_time_engine_refusal_on_the_raw_path_carries_its_typed_code` (`kernel/tests/end_to_end.rs:637`); index pin `kernel/README.md:361` |
| S13 | Two further sites that mint the same `"<code>: <display>"` shape through `terminal_detail_of`. Neither is named by PR #148's gate N1. First, `liveness_refusal`'s two dead-ticket arms (`kernel/src/lib.rs:513`, `kernel/src/lib.rs:526`, in `kernel/src/lib.rs:495-534`). Second, `terminal_detail_of`'s own doc, which names `crate::EngineSource::next_into` as the point where the error is stringified (`kernel/src/skp.rs:2008-2024`, the sentence at `kernel/src/skp.rs:2010-2013`). The publish surface's analogue is `kernel/src/publish/error.rs:261-264` | as listed | S7's T1 test pins the liveness arm's prefix (`kernel/tests/session_generation.rs:417-421`) |
| S14 | `formatTerminalRefusal.ts`'s doc, naming `EngineSource::next_into` as the site | `frontends/shell/src/streaming/formatTerminalRefusal.ts:9-11` | `frontends/shell/src/streaming/formatTerminalRefusal.test.ts:16` (`a_terminal_refusal_reaches_the_operator_without_its_machine_prefix`) and the cases at `:33`, `:50`, `:63` |
| S15 | SKP-V0's refusal-surfaces bullet in the `skp/0.3` entry (gate N1 cited it at lines 751-752 then) | `protocol/skp/SKP-V0.md:755-767` (the site sentence at `protocol/skp/SKP-V0.md:756-757`) | no test; the text is append-only history |
| S16 | SKP-V0's change log: its append-only rule, and the current end of §8 | rule `protocol/skp/SKP-V0.md:539-544`; the last two dated notes `protocol/skp/SKP-V0.md:969-977` and `protocol/skp/SKP-V0.md:979-985`; §9 begins at `protocol/skp/SKP-V0.md:987` | — |
| S17 | SKP-V0 §1's `close_dataset` paragraph (each live stream's registry entry holds its own `Arc<Dataset>` clone) | `protocol/skp/SKP-V0.md:128-136` (the claim at `protocol/skp/SKP-V0.md:134-136`) | none found asserts the refcount claim. The catalog form's reading, that no stream holds an `Arc<Dataset>`, is `kernel/CATALOG-OPEN-REPLACE-DROP-NOTE-PREREGISTRATION.md:22`, `:39`, `:105`. Close ordering is pinned at `kernel/README.md:358` (for example `kernel/src/skp.rs:4571`) |
| S18 | `TicketState`: holds the dataset by name (`dataset: String`) and holds no `Arc<Dataset>` | `kernel/src/skp.rs:120-142` (the fields at `kernel/src/skp.rs:126`, `:134`) | `kernel/src/skp.rs::tests::a_ticket_redeems_exactly_once` (`kernel/src/skp.rs:2446`); index pin `kernel/README.md:353` |
| S19 | `kernel/README.md`'s line for kernel halves of pieces filed elsewhere, which does not name `engine/B1-FOLLOWUPS-PREREGISTRATION.md` | `kernel/README.md:376`; the index header and its 60-line cap at `kernel/README.md:346-348`; Last verified at `kernel/README.md:350` (d60a0bed) | — |

**Recorded unchanged.** The SKP-V0 `skp/0.3` entry's own stale line-266 token, at `protocol/skp/SKP-V0.md:689`, sits inside the append-only change log (S16's rule).

## 2. Consumers in other modules

- **Data plane.** `protocol/data-plane/src/server.rs:508` calls `factory.create`. Per `kernel/src/lib.rs:501-505`, its refusal leaves as the terminal frame's `TERM_PRODUCER_FAILED` detail, which carries the prefixed string of S11 to S13 unchanged. `BatchSource::next_into` is declared at `protocol/data-plane/src/transport.rs:115`.
- **Shell, streaming.** `frontends/shell/src/streaming/formatTerminalRefusal.ts:32-40` parses the `engine.` prefix (S14). PR #147's gate (`state/consults/gates/2026-09-30-ticket-liveness-redeem-gate1-architect.md:39`) records that the shell's `isSessionEndedTerminal` matches both `<code>: ` prefixes.
- **Readers of cites into `kernel/src/skp.rs` outside the summary's two files.** Each of these names a line that no longer holds the named item at e32798ae:
  - `frontends/shell/src/streaming/liveTicketSet.ts:71` (lines 1237-1250) and `frontends/shell/src/streaming/liveTicketSet.ts:90` (line 1638; the `format!` is now `kernel/src/skp.rs:2023`);
  - `frontends/shell/src/streaming/tileViewportStreamManager.ts:947` and `frontends/shell/src/streaming/tileViewportStreamManager.test.ts:1423` (lines 797-803);
  - `frontends/shell/src/App.tsx:621` (line 1136, which now lands in S1's sink) and `frontends/shell/src/App.tsx:659` (line 731; `DatasetHandle::mint()` is now `kernel/src/skp.rs:1112`);
  - `frontends/shell/src-tauri/src/pool_poll.rs:12` (lines 317-319; `catalog()` is now `kernel/src/skp.rs:1076-1078`);
  - `engine/tests/admission_p4_corpus.rs:408` (lines 1073-1077);
  - `kernel/tests/no_generation_in_persisted_artifacts.rs:8` (line 259, now a `TicketState::Pending` field).
- **Shell, src-tauri.** Its own comment at `frontends/shell/src-tauri/src/lib.rs:423-427` cites line 271 of the same file for the `SkpHost` construction, which is now `frontends/shell/src-tauri/src/lib.rs:288`.
- **SKP spec and conformance.** The conformance fixtures key `close_dataset` by section, not by line (`protocol/skp/tests/conformance/fixtures/requests-accept.json:200`, `protocol/skp/tests/conformance/fixtures/responses-accept.json:56`). The fixture round-trip test is `protocol/skp/tests/fixtures.rs:375`. No wire shape is named by S17's sentence.
- **Mechanical readers of cites.** `scripts/plan/verify-cites.mjs:16-20` scans comments in `.rs` and `.ts` files. It gates rooted tokens on existence and bounds only, and does not check that a line still says what is cited (`scripts/plan/verify-cites.mjs:36-54`). The bare tokens in S2 and S5 are not rooted, so they are not gated. Rust comment edits also run under the `cargo fmt --check` CI job, `.github/workflows/rust-fmt.yml:59-80`.

## 3. What governs them

- **ADRs, Status lines as on main:**
  - ADR-035 is Accepted 2026-09-24 (`docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:3`). Its Note 2026-09-25 on the unheld reference is `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:149-157`. It governs S1, S2, S7 and S18's generation and ticket rules.
  - ADR-004 is Accepted 2026-07-31 (`docs/adr/ADR-004-skp-control-data-plane-mcp-adapter.md:3`). It governs the data plane and the wire that S11 to S17 describe.
  - ADR-018 is Accepted 2026-08-08 (`docs/adr/ADR-018-what-cancellation-acknowledged-means.md:3`). It is cited by S1's comment block and S7's T3 doc.
  - ADR-019 is Proposed and binds nothing (`docs/adr/ADR-019-control-plane-admission-tickets.md:3`). Tickets and `TicketState` (S18) implement it.
  - The proposed note node `adr-035-close-races-note` (`PLAN.yaml:3101-3117`, `needs_human` at `PLAN.yaml:3109`) covers ADR-035 passages that describe code close-races removed.
- **The SKP-V0 text adjacent to S1 and S17.** These state the unheld-reference minting rule: §3's third minting rule (`protocol/skp/SKP-V0.md:173`), and the second note to the `skp/0.3` entry (`protocol/skp/SKP-V0.md:874-883`, the close-races sentence at `protocol/skp/SKP-V0.md:881`).
- **Preregistrations:**
  - `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md`. Its declared-unchanged list for the two test files is at `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md:389-391`.
  - `engine/B1-FOLLOWUPS-PREREGISTRATION.md`.
  - `kernel/CATALOG-OPEN-REPLACE-DROP-NOTE-PREREGISTRATION.md`.
  - `kernel/TICKET-LIVENESS-REDEEM-PREREGISTRATION.md` and `kernel/RAW-PATH-CREATE-REFUSAL-CODE-PREREGISTRATION.md`, the forms behind PR #147 and PR #148, both listed at `kernel/README.md:374`.
  - `protocol/skp/CANCEL-STATE-CLOSED-SET-PREREGISTRATION.md` (intake, `:38`).
  - `engine/SOURCE-WATCHER-PREREGISTRATION.md`, Amendment 1. It is the rule S1's comment names, and it covers the unheld reference: `engine/SOURCE-WATCHER-PREREGISTRATION.md:475-497`, with the minting sentence at `:480`.
- **Test text and the commit-named span rule.** Test text is the named exception in class 3 (`docs/PREREGISTRATION-TEMPLATE.md:110-114`). A test-text span on an unmerged branch is named by commit until merge (`docs/PREREGISTRATION-TEMPLATE.md:174`). Mutation-observation wording is at `docs/PREREGISTRATION-TEMPLATE.md:172`. The no-bare-self-line rule (a′) is at `docs/PREREGISTRATION-TEMPLATE.md:140`. Out-of-scope at dispatch is at `docs/PREREGISTRATION-TEMPLATE.md:176`. The record cap is cited at `docs/PREREGISTRATION-TEMPLATE.md:142`.
- **SKP-V0's append-only change log:** `protocol/skp/SKP-V0.md:539-544`. §§1–7 are updated in place only where a version note says so (same span).
- **Gating categories and size:**
  - §21a, where `protocol/skp/**` is named under the wire category (`AUTONOMY.md:315-332`; the wire bullet at `AUTONOMY.md:323-324`);
  - §21c's threshold and counting rule (`AUTONOMY.md:347-357`);
  - the node's `gate: none` (`PLAN.yaml:3092`) and 45-minute budget (`PLAN.yaml:3094`).
- **KNOWN-LIMITATIONS:** none names a comment, a cite or the prefix convention. Adjacent to S1's sink (the `end_generation` it calls emits the event) is item 28, `KNOWN-LIMITATIONS.md:308-314`. The kernel index's declared items are at `kernel/README.md:378`.
- **Declared ceilings:** S7's T3 doc names `TICKET_TTL` (`kernel/src/skp.rs:82`) and `TERMINAL_ENTRY_MAX_AGE` (`kernel/src/skp.rs:104`), both listed at `kernel/README.md:380`. The kernel index's own cap is 60 lines (`kernel/README.md:348`).

## 4. Questions the form must answer (at most five)

1. Which stale cites are in scope? The summary names cites into skp.rs only, and in two files only (`PLAN.yaml:3098`; the worker's "some" at `state/consults/2026-09-27-kernel-generation-close-races-worker-report-1.md:64`). Section 1 rows S5, S8 and section 2's consumer list name further stale cites in the same comments and in other modules.
2. Does any rewording of S1's comment (`kernel/src/skp.rs:1139-1143`) state something about the unheld reference? ADR-035's note (`docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:153-157`) and SKP-V0 (`protocol/skp/SKP-V0.md:173`, `:881`) still state that minting rule, and the human-ruled `adr-035-close-races-note` (`PLAN.yaml:3101-3117`) has not run.
3. Which gating route and SKP-V0 placement apply? The S15/S17 edits are under `protocol/skp/**` (`AUTONOMY.md:323-324`) while the node reads `gate: none` (`PLAN.yaml:3092`). It is open whether S17's §1 correction is in place or a dated §8 note (`protocol/skp/SKP-V0.md:539-544`).
4. How many sites does the form name for the engine-code prefix? PR #148's gate N1 (`state/consults/gates/2026-09-30-raw-path-refusal-code-gate1-architect.md:53`) counts two. Row S13 shows `liveness_refusal`'s arms (`kernel/src/lib.rs:513`, `:526`) and `terminal_detail_of`'s doc (`kernel/src/skp.rs:2010-2013`) as well.
5. Is S9's correction (`kernel/tests/wire_bytes_invariant.rs:372`) a cite repoint only, or a re-observation naming a commit? The latter is the shape B1 used for its K rows (`engine/B1-FOLLOWUPS-PREREGISTRATION.md:104`), and it brings in the commit-named span rule (`docs/PREREGISTRATION-TEMPLATE.md:174`).

**Missing pointer.** No test on main asserts S17's refcount sentence, or its negation.

## Files read

- `state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md`: 1-62
- `kernel/README.md`: 330-384
- `engine/README.md`: 480-528
- `PLAN.yaml`: 2655-2674, 3080-3118; grep hits for the node id; 3423-3435
- `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md`: headings (grep), 347-481
- `state/consults/2026-09-27-kernel-generation-close-races-worker-report-1.md`: 1-73
- `state/consults/gates/2026-09-30-ticket-liveness-redeem-gate1-architect.md`: grep hits, 38-53
- `state/consults/gates/2026-09-30-raw-path-refusal-code-gate1-architect.md`: grep hit at 53
- `kernel/CATALOG-OPEN-REPLACE-DROP-NOTE-PREREGISTRATION.md`: grep hits, 20-31
- `state/consults/2026-10-02-workspace-rustfmt-architect-draft.md`: grep hits, 236-274
- `engine/B1-FOLLOWUPS-PREREGISTRATION.md`: headings (grep), 100-147, 267-288
- `state/consults/gates/2026-10-05-b1-engine-kernel-half-followups-gate1-architect.md`: grep hits, 30-45
- `state/consults/2026-10-05-b1-engine-kernel-half-followups-index-update.md`: grep hits only
- `docs/PREREGISTRATION-TEMPLATE.md`: 100-178
- `kernel/src/skp.rs`: 108-157, 255-260, 1040-1229, 1455-1469, 1540-1569, 1698-1709, 2005-2024, 2064-2073, 3735-3759; grep hits for line tokens, `pub fn`, ceilings, `TicketState`, test names
- `kernel/src/lib.rs`: 390-534, 655-694; grep hits
- `kernel/tests/session_generation.rs`: 300-489
- `kernel/tests/typed_terminal_codes.rs`: 36-71; grep hit at 342
- `kernel/tests/wire_bytes_invariant.rs`: 286-385; grep hits
- `kernel/tests/skp_projection.rs`: 1112-1131, 1455-1472; grep hits
- `kernel/tests/end_to_end.rs`, `kernel/tests/source_watch_ordering.rs`, `kernel/tests/session_end_event.rs`: grep hits for test names
- `kernel/tests/no_generation_in_persisted_artifacts.rs`: 6-9
- `frontends/shell/src-tauri/src/lib.rs`: 370-379, 420-434; grep hits
- `frontends/shell/src/streaming/formatTerminalRefusal.ts`: 1-40
- `frontends/shell/src/streaming/formatTerminalRefusal.test.ts`: grep hits
- `frontends/shell/src/App.tsx`: 618-621; grep hit at 659
- `frontends/shell/src/streaming/liveTicketSet.ts`, `frontends/shell/src/streaming/tileViewportStreamManager.ts`, `frontends/shell/src/streaming/tileViewportStreamManager.test.ts`, `frontends/shell/src-tauri/src/pool_poll.rs`: grep hits only
- `frontends/shell/e2e/citationIntegrity.test.mjs`: 1-55; grep hits
- `engine/tests/admission_p4_corpus.rs`: 405-408
- `protocol/skp/SKP-V0.md`: 125-138, 173, 255-274, 317-328, 537-548, 686-691, 745-774, 870-990; heading grep
- `protocol/skp/CANCEL-STATE-CLOSED-SET-PREREGISTRATION.md`: 28-41
- `protocol/data-plane/src/server.rs`: 380-387; grep hit at 508
- `protocol/skp/tests/` (fixtures.rs, conformance): grep hits for `close_dataset`
- `protocol/` tree: grep for `Arc<Dataset>`, `next_into`, `create_from_raw_params`
- `engine/SOURCE-WATCHER-PREREGISTRATION.md`: grep hits 475-497
- `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md`: 3 (grep), headings, 149-159
- `docs/adr/ADR-004-…`, `ADR-018-…`, `ADR-019-…`: Status lines (line 3) only
- `KNOWN-LIMITATIONS.md`: item headings (grep), 308-315
- `AUTONOMY.md`: 315-359
- `scripts/plan/verify-cites.mjs`: 8-57; grep hits
- `.github/workflows/rust-fmt.yml`: grep hits
