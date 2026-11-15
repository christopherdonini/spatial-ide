*Custodian's filing note (2026-11-06): lead-data's impact read for 8e, `skp-filter-dialect-unsupported-ruling` (the human's strike of 2026-11-05, evening, items 2 and 3, `state/directives/2026-11-05-8c-full-form-nine-s2-placed-u12-slot-2-u1-reproducer-adr-notes-words-e2e-readme-words-8b-d3.md`), read ahead because the piece crosses engine, kernel and protocol (`governance/AI_DEVELOPMENT.md`, the lead-data paragraph), at main b5b5f97a. Its brief by file (sha256 9112e131cd9116ea297d2e9e3470dafc554d88a49392b0b3f5886826bb578b7b), carrying the reuse index's output byte for byte. It wrote no file. The run 09:42:25Z to 09:48:16Z by its transcript (claude-opus-5-5; unique calls Read 39, Grep 45, Glob 1 and the hand-back, 86, equal to the notification's). Extracted by script from its one SubagentHandback call, one final newline added. Its sha256, from line 5 to the end, is 5797a7f3fa8b7b2d3d91c78f3ae84a18a61e47f0be6eea409001e8a401265c01. Its three questions go to the architect's form draft as OPEN items; the first (ADR-021) is accepted ADR text, a red line, the human's. A reading, not Authority.*

---

Impact read: skp-filter-dialect-unsupported-ruling (lead-data, 2026-11-06)

All pointers below are to the working tree, which the session's git status shows at main b5b5f97ad58282d141494674fe469e43072ec026. I have no shell, so I could not confirm HEAD, give a sha256 or list a branch. Everything here comes from Read and Grep calls in this run. I ran no test and no mutation. Text in double quotes is byte-copied, and everything else is in my own words. This is an impact read only: there is no form text in it, and I changed nothing.

Read first: the owner's indexes, engine/README.md:533-567 and kernel/README.md:356-398 @ b5b5f97ad58282d141494674fe469e43072ec026. The ruling: state/directives/2026-11-05-8c-full-form-nine-s2-placed-u12-slot-2-u1-reproducer-adr-notes-words-e2e-readme-words-8b-d3.md:12 (item 2, the strike) and :23 (item 3, the SKP-V0 note) @ b5b5f97ad58282d141494674fe469e43072ec026. Part 1 of state/directives/2026-11-05-main-architect-gate-rounds-part-1-rulings-review-packet-design-part-3-additions.md:22-64 @ b5b5f97ad58282d141494674fe469e43072ec026. The node: governance/PLAN.yaml:6736-6752 @ b5b5f97ad58282d141494674fe469e43072ec026.

## 1. Every site the strike touches

**engine/**
- The variant and its doc: engine/src/predicate.rs:256-263 @ b5b5f97ad58282d141494674fe469e43072ec026. The doc already says "**Not constructible by [`AdmittedPredicate::admit`] today.**" (:258).
- The Display arm: engine/src/predicate.rs:338-340 @ b5b5f97ad58282d141494674fe469e43072ec026. Its text appears nowhere else in the repository; I grepped for it.
- Doc comments that count variants or codes, which go untrue once the variant is removed:
  - engine/src/predicate.rs:109-114 (eleven of twelve, a thirteenth) @ b5b5f97ad58282d141494674fe469e43072ec026;
  - :249-253 (FilterError's doc: twelve codes, a thirteenth variant) @ b5b5f97ad58282d141494674fe469e43072ec026;
  - :394-405 (PredicateAdmitError's doc: twelve variants, a twelfth arm, "staying at twelve") @ b5b5f97ad58282d141494674fe469e43072ec026;
  - :408 (twelve) @ b5b5f97ad58282d141494674fe469e43072ec026.
  - :712 also says "twelve, exactly", but it counts json_serialize_sql keys. It is unrelated and not touched.
- The exhaustive test mapping in engine/tests/admission_property_campaign.rs:626 @ b5b5f97ad58282d141494674fe469e43072ec026 (code_of, :622-639). Its doc at :622-623 states no count.
- The exhaustive test mapping in engine/tests/filter_type_admission.rs:777 @ b5b5f97ad58282d141494674fe469e43072ec026 (campaign_code_of, :772-790). Its doc states no count.

**kernel/**
- The mapping arm: kernel/src/skp.rs:2290-2294 @ b5b5f97ad58282d141494674fe469e43072ec026, inside filter_error_of (:2281-2287 doc, "a thirteenth `FilterError` variant" at :2283).
- The test filter_dialect_unsupported_maps_to_its_code_and_field: kernel/src/skp.rs:2804-2814 @ b5b5f97ad58282d141494674fe469e43072ec026. It is the variant's only constructor.
- Comments that count codes:
  - kernel/src/skp.rs:1452-1457 (twelve, twice) @ b5b5f97ad58282d141494674fe469e43072ec026;
  - :1779-1780 ("ADR-021 item 8's twelve-code") @ b5b5f97ad58282d141494674fe469e43072ec026;
  - :2796-2802 (twelve variants, one test each) @ b5b5f97ad58282d141494674fe469e43072ec026;
  - :2970-2972 (twelve-code route) @ b5b5f97ad58282d141494674fe469e43072ec026.
- No product path constructs the variant. Both admissions pass only the predicate text: kernel/src/skp.rs:1911-1913 and kernel/src/session_history.rs:359-360 @ b5b5f97ad58282d141494674fe469e43072ec026.
- kernel/README.md:199-204 @ b5b5f97ad58282d141494674fe469e43072ec026 names `skp.filter_*` with no count, so it is not touched.

**Outside engine/ and kernel/, by pointer**
- protocol/skp/SKP-V0.md @ b5b5f97ad58282d141494674fe469e43072ec026:
  - The §7.5 row: :498.
  - The §7.5 heading, :490, "### 7.5 Refusal taxonomy — eleven `skp.filter_*` codes".
  - The 0.8 dated note, :519-522, which ends "The heading above stays as it is."
  - The §7.2 wrong-dialect sentence, :421-424, which already agrees with the strike.
  - §3's decode-time rejection path, :198-202, where the host returns no SkpError.
  - §4 item 8, :277-281: "v0.1 (§7) adds eleven `skp.filter_*` codes".
  - The §8 history entry for skp/0.8, :983-986 ("the twelfth `skp.filter_*` code"). It is append-only history.
  - §10's reuse list, :1277, which points to §7.5 with no count.
  - Precedent for a strike: §5 :352-353 and the 2026-10-11 §8 note :1113-1121, which struck three never-produced codes and listed them as reserved.
- protocol/skp/src/v0/commands.rs @ b5b5f97ad58282d141494674fe469e43072ec026:
  - :374-378 names the code: "this one). Named `skp.filter_dialect_unsupported` in the refusal taxonomy (design note item 5),". It also says "(a later phase)".
  - :381-386 is the stale "later phase" allowlist sentence.
  - :393-425 holds Filter::new and Deserialize. Neither is touched.
- ADRs:
  - docs/adr/ADR-021-row-filter-on-viewport-query.md @ b5b5f97ad58282d141494674fe469e43072ec026:
    - decision 8, :93-99. It reads "Eleven `skp.filter_*` refusal codes, exhaustive, no wildcard arm" and lists `filter_dialect_unsupported` first.
    - Note 2026-09-24 item 2, :234, and Note 2026-09-29 item 1, :241: "eleven codes stand".
    - Note 2026-09-30, its title at :244 and item 6 at :267: "Decision 8's exhaustive mapping applies to the twelve."
    - Note 2026-10-03 item 3, :275: "Decision 8's twelve codes stand."
    - Decision 3, :64-66, is about the dialect but names no code.
  - docs/adr/ADR-033-connection-lease-classes-for-admission-work.md:19 and :25 @ b5b5f97ad58282d141494674fe469e43072ec026 say "eleven".
  - The constitution: docs/02_Architecture.md:84 @ b5b5f97ad58282d141494674fe469e43072ec026 says "eleven typed `skp.filter_*` refusals".
- Filed forms. These are records, so they are pointers only:
  - governance/forms/engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:36 @ b5b5f97ad58282d141494674fe469e43072ec026 names the DialectUnsupported doc in its Scope list. Its claimed test at :215 is the type_not_admitted mapping test, not the dialect test.
  - governance/forms/engine/B1-PROJECTION-PREREGISTRATION.md:952 @ b5b5f97ad58282d141494674fe469e43072ec026 says "eleven filter codes".
  - governance/forms/frontends/POLISH-87-88-89-PREREGISTRATION.md:21, :107, :121 @ b5b5f97ad58282d141494674fe469e43072ec026 say "eleven".
  - No filed form claims filter_dialect_unsupported_maps_to_its_code_and_field by name. A repo-wide grep finds it only in kernel/src/skp.rs and in old CI logs under state/consults/.
- KNOWN-LIMITATIONS.md: no item names the code, the dialect or a count of filter codes. I grepped for each and got no matches.
- Owner's indexes: neither names the variant, the code or the test. The rows that point at the type are engine/README.md:542 (Filter admission, `spatial_engine::FilterError`) and kernel/README.md:369 (Wire error codes, SKP-V0 §7.5, `filter_error_of`) @ b5b5f97ad58282d141494674fe469e43072ec026. Both pointers remain valid after the strike.

## 2. What removing the variant breaks

- **Not `#[non_exhaustive]`.** The derive is at engine/src/predicate.rs:254 @ b5b5f97ad58282d141494674fe469e43072ec026, and engine/src has no `non_exhaustive` anywhere. The enum is public through engine/src/lib.rs:159-160 @ b5b5f97ad58282d141494674fe469e43072ec026.
- **Which code matches the enum.** A `*.rs` grep for FilterError finds it in engine and kernel only, and in none of frontends/, renderer/ or protocol/. There are exactly four exhaustive matches, the sites listed in section 1:
  1. engine's Display, predicate.rs:337;
  2. kernel's filter_error_of, skp.rs:2289;
  3. the engine test's code_of, admission_property_campaign.rs:625;
  4. the engine test's campaign_code_of, filter_type_admission.rs:776.
  I used NotASingleExpression as the marker, and it appears in no other match. Each of the four loses one arm, and nothing else fails to compile.
- **Counts that go untrue.** Everything that says "twelve" variants or codes becomes untrue:
  - the engine/src/predicate.rs and kernel/src/skp.rs comments listed in section 1;
  - ADR-021 Note 2026-09-30 item 6 (:267) and Note 2026-10-03 item 3 (:275);
  - ADR-021 decision 8's list (:93-96), which still names the struck code.
- **Counts that become numerically true again.** Everything that says "eleven" ends up with the right number, though the set it once counted held the struck code and lacked type_not_admitted:
  - ADR-021 :93, :234, :241;
  - SKP-V0.md :490 and :278-280;
  - ADR-033 :19, :25;
  - docs/02_Architecture.md:84.
  These are pointers only.
- **Red-line texts, with no words proposed.** These are the ADR-021 sites above (decision 8 and the three Notes) and ADR-033 :19 and :25. All are accepted ADR text, which changes only through a dated note in the human's words. The ruling of 2026-11-05 item 3 gives words for ADR-026, ADR-022, ADR-013 and SKP-V0, and none for ADR-021. docs/02:84 is constitution text, also pointer only.

## 3. The wire

- **What a client sends or receives.** Nothing changes. The host never produced the code. A wrong dialect is rejected while the request is decoded: protocol/skp/src/v0/commands.rs:399 and :423, and the Tauri command takes `request: ViewportQueryRequest` at frontends/shell/src-tauri/src/commands.rs:90 @ b5b5f97ad58282d141494674fe469e43072ec026. On that binding the client gets a non-SkpError, the path SKP-V0.md:198-202 describes for HexF64. record_step's intent uses the same `Filter` type (commands.rs:541-543 @ b5b5f97ad58282d141494674fe469e43072ec026), so it rejects at decode too.
- **No client code list holds the code:**
  - frontends/shell/src/skp/types.ts:17-20 @ b5b5f97ad58282d141494674fe469e43072ec026 names the dialect, not the code;
  - tileViewportStreamManager.ts names other filter codes only, in comments;
  - renderer/ has no "dialect" at all.
- **Fixtures, goldens and versions: I confirm the human's note by search.**
  - No fixture, golden, schema or client file holds `filter_dialect_unsupported` in any case. The repo-wide case-insensitive grep hits only engine/, kernel/, ADR-021, SKP-V0.md:498, commands.rs:376, the governance queue and plan, one filed form and state/.
  - The conformance fixtures' `expected_refusal_code` values are only `skp.version_unsupported`, `skp.malformed_hex_f64` and `skp.bbox_not_finite` (protocol/skp/tests/conformance/fixtures/refusals-any-layer.json @ b5b5f97ad58282d141494674fe469e43072ec026).
  - The literal stays: SKP_VERSION is "skp/0.12" at protocol/skp/src/v0/mod.rs:115 and frontends/shell/src/skp/types.ts:15 @ b5b5f97ad58282d141494674fe469e43072ec026.
  - The Display text is in no golden.

## 4. Tests

**Existing tests that show a wrong dialect rejected at deserialization:**
- protocol/skp/src/v0/commands.rs:731-736 @ b5b5f97ad58282d141494674fe469e43072ec026, `filter_refuses_any_other_dialect_at_construction_and_at_deserialization`. It tests `Filter` alone and asserts only `is_err()`, not the error's shape or message.
- protocol/skp/tests/conformance/main.rs:72 @ b5b5f97ad58282d141494674fe469e43072ec026, `spec_derived_fixtures_against_wire_types`. It runs fixtures `rej-viewport-dialect-other`, `rej-viewport-dialect-case`, `rej-viewport-dialect-empty` and `rej-viewport-filter-missing-dialect` (refusals-at-deserialize.json:146-216 @ b5b5f97ad58282d141494674fe469e43072ec026) as `reject_at_deserialize` against the whole `ViewportQueryRequest` (main.rs:40-44, :58).

**The gaps, my reading:**
- No test asserts the rejection's real shape: a serde error carrying Filter::new's message, and no SkpError code.
- No test covers a wrong dialect inside a record_step intent. refusals-at-deserialize.json has no record_step dialect fixture.
- No test runs the Tauri command boundary with a wrong dialect. src-tauri has no "dialect" hit.

**Tests the strike removes or changes:**
- It removes kernel/src/skp.rs:2804-2814, filter_dialect_unsupported_maps_to_its_code_and_field.
- It changes the two helper mappings at admission_property_campaign.rs:626 and filter_type_admission.rs:777, one arm each. Neither is a named test.
- It changes no test's assertions.

**One mutation each, at the real boundary, that a remaining or new test would catch:**
1. Filter::new's check removed or inverted (commands.rs:399). Caught by name by the commands.rs:731 test, and by `spec_derived_fixtures_against_wire_types` through rej-viewport-dialect-other.
2. Deserialize builds `Filter` from `Raw` without calling Filter::new (commands.rs:423). Caught by the deserialization half of the commands.rs:731 test and by the conformance run.
3. The comparison made case-insensitive. Caught by rej-viewport-dialect-case.
4. An empty dialect admitted. Caught by rej-viewport-dialect-empty.
5. Filter::new's message changed or emptied. Caught by nothing today. A new test asserting the real error text at the `ViewportQueryRequest` boundary would catch it. That is Part 1 item 7's "a dependency's error is tested in its real shape" (directive :62); this is my reading, and the architect's call.

The deleted kernel test needs no replacement mutation: a re-added variant without its mapping fails to compile in all four matches.

## 5. Files and overlap

| Path | What changes | Overlap |
|---|---|---|
| engine/src/predicate.rs | the variant, its doc, the Display arm, the count docs | **overlaps 8d (PR #286)** |
| engine/tests/filter_type_admission.rs | one arm | **overlaps 8d (PR #286)** |
| engine/tests/admission_property_campaign.rs | one arm | none |
| kernel/src/skp.rs | the arm, the test, the count comments | none |
| protocol/skp/SKP-V0.md | the human's note; the §7.5 row if the ruling reads that way | no in-flight branch |
| protocol/skp/src/v0/commands.rs (:374-378, possibly :381-386) | only if Scope takes it | no in-flight branch |
| engine/README.md (owner's index) | see below | none |
| kernel/README.md (owner's index) | see below | **overlaps U1 (cut/publish-session-tier-identity)** |
| docs/adr/ADR-021-row-filter-on-viewport-query.md | only with a human-worded note | none in flight |

On protocol/: per the triage, b2-piece-1c-save-and-reopen's form plans edits to SKP-V0.md and commands.rs at step 1's P2 (state/consults/2026-11-05-drift-sweep-areas-c-d-triage-architect.md:20 @ b5b5f97ad58282d141494674fe469e43072ec026). They are not in 1c's current diff list. They would collide later, and they count against the one-piece-touching-protocol/ rule. That is the custodian's to weigh.

No other in-flight branch (U12, the KL pair, port-2, 1c) shares a path.

**Owner's-index lines after the merge:**
- engine/README.md:537, the Last verified clause.
- engine/README.md:557 or :559 for the form path: :557 if the form is filed under engine, :559 if it is filed elsewhere.
- kernel/README.md:360, the Last verified clause.
- kernel/README.md:387 or :389 for the form path.
- No interface row changes. :542 and :369 stay valid.

## 6. Line estimate (§21c, tests and prose counted)

These are my estimates, insertions plus deletions:

| Part | Lines |
|---|---|
| predicate.rs: 9 + 3 deleted, about 22 for the count docs | ~34 |
| skp.rs: 5 + 12 deleted, about 12 for the comments | ~29 |
| the two test helpers | 2 |
| SKP-V0.md: the note at about 5-7, plus the row if struck at 1 | ~6-8 |
| the two owner's indexes | ~8 |
| **Core** | **about 80, across 7 files** |
| commands.rs :374-378 | +6-10, 8 files |
| commands.rs :381-386 as well | +6-8 more |
| one new test at the deserialization boundary | +15-30, and possibly a 9th file (a fixture or a test file) |
| an ADR-021 note, if the human gives words | +1 file and its lines |

The range is roughly 80-125 lines across 7-9 files. The size bound is not what decides the route. The piece touches `protocol/skp/**`, which is §21a's wire category (governance/AUTONOMY.md:323-324 @ b5b5f97ad58282d141494674fe469e43072ec026), so full gating applies whatever the size (:329-332). That is my reading, and the architect's and custodian's call.

## 7. Risks and red lines to name before drafting

- **ADR-021's count.** After the strike, decision 8's list and the twelve in Notes 2026-09-30 and 2026-10-03 are untrue. Any change is a dated note in the human's words. The ruling gives none for ADR-021. Question for the custodian.
- **The note's words are the human's, byte for byte** (directive :23). They contain "§" and "§7's". Three things are open:
  - where the note sits: §7.5 as a dated note, or a §8 "Note … (no literal change)" entry like the 2026-10-11 precedent;
  - whether its bytes may be wrapped or formatted like SKP-V0's other blockquoted notes;
  - whether "struck from §7's refusals" means deleting row :498, marking it, or listing the code as reserved, as the §5 precedent at :352-353 did.
  The note does not say "reserved". I propose no words for any of these. They are questions.
- **The §7.5 heading** (:490). After the strike, the live set (ten rows plus the 0.8 note's row) is eleven again, and the 0.8 note pins the heading as is. Whether it is touched goes with the question above.
- **The stale commands.rs comments.** :374-378 names the struck code, so the strike itself makes it name a code that no longer exists. :381-386's "later phase" is the drift sweep's separate finding. Per the node's summary (PLAN.yaml:6751), both stay with skp-spec-and-protocol-comments-drift-sweep-c unless this Scope takes them. Taking :374-378 adds no new path beyond protocol/skp/**, which SKP-V0.md already brings in, but it adds a file. That is the custodian's and architect's call.
- **Sentences written after the code** (Part 1 item 1). The reworded count docs in predicate.rs and skp.rs are code comments, not the human's wording. The worker writes them from the built code and the gate checks them clause by clause. The deleted Display string is a user-facing message that was never shown. Removing it writes no new words.
- **What would make this more than a removal:**
  - adding a decode-time refusal code. That question belongs to first-external-plugin-skp-client, not here;
  - changing Filter::new's message;
  - adding a fixture or bumping the literal, which would contradict the human's "skp/0.12 stands; no fixture changes";
  - any ADR-021 or ADR-033 text without the human's words.
  The kernel's count comments citing "ADR-021 item 8's twelve-code" (:1779) would cite an ADR that disagrees with the code until the ADR question is settled.
- **Sequencing.** No code before #286 merges, because 8d holds predicate.rs and filter_type_admission.rs. kernel/README.md waits on U1, or its index edit is sequenced after U1.

## Reuse index

Both lookups missed, exit 1, "No prior art recorded" for each. The nearest precedent is in this repository: the 2026-10-11 strike of three never-produced codes (SKP-V0.md:352-353, :1118 @ b5b5f97ad58282d141494674fe469e43072ec026).

## What I could not settle

- Whether HEAD is b5b5f97a. I read the working tree, and I have no shell, so I give no sha256 and list no branch.
- What 8d (#286) changes inside predicate.rs and filter_type_admission.rs. I cannot read branches, so my line cites will shift after it merges.
- Whether 1c's form really schedules SKP-V0.md and commands.rs edits. I took that from the triage pointer and did not read 1c's form.
- Whether the Tauri binding's decode error for a wrong dialect matches the HexF64 description at SKP-V0.md:198-202. I inferred it from commands.rs:90 and did not run it.
- I did not read .claude/agents/architect.md or the template, since this is an impact read and contains no form.
- I leave no background shell: I had none and ran none.

Blocking questions for the custodian:
1. ADR-021: a dated note in the human's words for decision 8 and the twelve-code Notes, or ADR-021 left as written?
2. The SKP-V0 note: where it goes (§7.5 or §8), whether its bytes may be wrapped or formatted, and whether row :498 is deleted, marked or listed as reserved?
3. Does commands.rs :374-378, and possibly :381-386, come into this piece's Scope, or stay with skp-spec-and-protocol-comments-drift-sweep-c?

Report path: C:/dev/spatial-ide/state/consults/2026-11-06-skp-filter-dialect-unsupported-ruling-impact-read-lead-data.md. No sha256: no shell, and the custodian files the file.
