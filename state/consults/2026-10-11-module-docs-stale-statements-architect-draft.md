*Custodian's filing note (2026-10-11): the architect's draft of `module-docs-stale-statements`'s preregistration, on the custodian's brief at main 426ec39f, after lead-data's impact read (forms ahead). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 823d5c70734e232d0ce37c5a406f465ce70cce4dce0df25c0d81f0dc69f7be9b. Write audit PASS: zero write calls (Read 79, Grep 33, Glob 1, SubagentHandback 1). Run window from the transcript: 00:44:50Z to 01:00:18Z. Committed as the form `kernel/MODULE-DOCS-STALE-STATEMENTS-PREREGISTRATION.md` in the same commit, with the custodian's 144 pins; its OPEN-1 and OPEN-2 are the human's.*

---

Reviewed: main @ 426ec39fc0b3be7da96555d2d4d489e34a075475

## 1. Form and gating, and what is the human's

**The form is the full form, with full gating (reviewer and architect, both to PASS). Two rules each require it on their own:**
- **The size bounds (§21c).** The piece touches 15 files before the form and PLAN.yaml, against a bound of 8. The four comment-only files count, by the memory rule. My estimate is about 390 changed lines, with the README rewrites carrying most of them, against 150.
- **A §21a category (§25(e)).** The diff rewrites documented statements of a cancellation guarantee (the kernel README's H2 row, ADR-018 vocabulary) and of the CRS-is-a-type and identity invariants (the admission text for findings 1 and 2). That is category 4, a stated guarantee or invariant, even though no code changes. So the piece's `Out-of-scope` line could not assert "none of the four", and a five-line form may not be committed for it. If one were dispatched, the round-25 fail-by-name list would catch it.

**Categories:**
- **Touched:** category 4 only, in documentation.
- **Not touched:**
  - no ADR file and no Status line;
  - no wire, nothing under protocol/;
  - no security posture in §21a's sense (ADR-020, 009 or 021).
- **Red-line text:** the exposure lines are red-line text even though they only restate the ruled C8 position. That makes them never documentation-only (§8 item 7 of the draft).

**Where the form lives:** `kernel/MODULE-DOCS-STALE-STATEMENTS-PREREGISTRATION.md`. My recommendation; the choice is the custodian's.
- The node's lane is kernel-protocol, and 8 of the 15 files are under kernel/.
- Filing it under kernel/ keeps the engine index update on engine/README.md:521, the list of engine halves of pieces filed elsewhere. Filed under engine/, it would have to edit :519, the line #206 replaces.

**What is the human's:**
- OPEN-1 and OPEN-2 (section 3 below).
- The pending ruling on #205's C-1. It holds this piece's start through `depends_on`, but not its content, because finding 1's list is taken from the code (§2.1, row D1).
- The merge click.
- The §21c threshold stays the custodian's declared value, and the human can adjust it.
- No red-line decision is asked: the exposure lines restate what was already ruled (round 41, item 1 and round 42, item 1).

## 2. The draft

````markdown
# Engine and kernel module docs brought current — preregistration (full form)

**Authority.** PLAN node `module-docs-stale-statements` (`PLAN.yaml:3805-3821 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`). Placed by the human as the docs lane's item 3d (`state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:26 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`), under the lane's terms (`state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:19 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`), and drafted ahead of its slot (`state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:38 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`). Budget and finding 4's restatement: the human's ruling, items 1 and 2 (`state/directives/2026-10-10-tier-obligation-open-item-and-adr-029.md:6 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`; `state/directives/2026-10-10-tier-obligation-open-item-and-adr-029.md:7 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`). Area E placement: `state/directives/2026-10-10-drift-sweep-area-e-instructions.md:11 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.

**Drafted by** the architect, on the custodian's brief. The inputs are lead-data's impact read (`state/consults/2026-10-11-module-docs-stale-statements-impact-read.md`, whole-file sha256 2940d31b81d6bb6a37fad0efd14d65c0273387ecc40cdc4a78e446bed5bb04f6 as filed) and the architect's own reads, all at main 426ec39fc0b3be7da96555d2d4d489e34a075475 (below, C).

**Committed before any code.** Append-only once committed. An amendment made after any outcome has been seen says so in its first line.

**Gating.** Full form and full gating: `AUTONOMY.md` §21a (category 4, a stated guarantee or invariant, in documentation) and §21c (more than 8 files and more than 150 lines), §25(e) from dispatch. Verdicts are proportional (`state/directives/2026-10-05-product-first-direction.md:15 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`).

**Reuse index.** `tools/reuse.mjs` at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c recorded no prior art for this query. The miss is noted, and it does not block.

## §0. Disclosure

- **Inputs:**
  - lead-data's impact read;
  - the custodian's checks of drift sweep area D (at 116deb53) and area E (at 9e7362db);
  - PR #205 gate 1 reviewer, C-1 (`state/consults/gates/2026-10-10-known-limitations-item-2-on-main-paragraph-gate1-reviewer.md`), read for finding 1 only;
  - round 52, items 2 and 3, for the H2 tests.
- **Pins are historical.** Every `path:line @ C sha256:` below is a pin at C.
  - Before code, the worker recomputes each pin at its base B, the merge-base on main after #205 and #206 have merged.
  - Where B's tree no longer matches a pin, the worker names B's tree as authoritative for that row and records the moved line as a class 3 row before code.
  - A changed fact, as opposed to a moved line, is an invalidator (§5).
- **Lines that exist only on #206's branch** are named in words and never pinned: `engine/README.md` lines 499, 510 and 519 at d88636ef. #206 replaces those three lines in place and adds none, so every engine/README.md pin below survives its merge.
- **Found by the architect beyond the impact read:** the rows marked (A) in §2.5. Also the drafting rule on block-on-sight cites in §2.0 (f).
- No measurement, no fixture and no 5 GB read, so the drive confound does not apply.

## §1. What this preregistration may and may not claim

- **May claim:** each rewritten sentence states a fact that its pin shows at B.
- **May not claim:**
  - any behaviour change (no code logic, no assertion and no string the app shows changes);
  - any performance figure or docs/08 row;
  - that docs/08:8's budget is met or asserted by `kernel/tests/end_to_end.rs`;
  - any wire change;
  - an ADR amended or accepted;
  - a Proposed ADR (012, 019, 023, 024, 036) described as binding;
  - an exposure review or discharge for any surface other than the shell's UI;
  - the tier obligation discharged, a ResourceRef or grade for a tier set, or an ADR-006 class for the tier build;
  - stability or a snapshot for the session tier.
- **ADRs cited, none amended:** 005, 006, 013, 015, 016, 017, 018, 032, 033, 034. Each is cited by number and section or amendment item.

## §2. The change

### 2.0 Rules every rewrite follows

- **(a) Cites.** A rewritten sentence states the fact at B. The text cites by item name (fn, const, test), by README section, or by ADR number with section or amendment item. It never cites by a bare `path:line`. This form carries the pins. A line that must be cited in text is pinned contiguous on one line (round 15 (d)).
- **(b) Tests.** A fact that no test pins is not called tested.
- **(c) ADR status.** Status words match the ADR's Status line. Proposed ADRs stay Proposed.
- **(d) Accepted amendments.** These are cited by their accepted item numbers. ADR-013, ADR-015 and ADR-016's Amendments 1 were appended from the Proposed text blocks of drafts deleted at acceptance, as they stood at 433413a (`docs/adr/ADR-013-typed-coordinate-spaces-and-provenance.md:326 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`; `docs/adr/ADR-015-source-crs-requirement-and-caller-assertion.md:204 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`; `docs/adr/ADR-016-stable-feature-identity-admission.md:238 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`).
- **(e) Quotes.** No new quotation marks unless the text is byte-copied by script. Existing quoted spans stay byte-identical.
- **(f) Block-on-sight cites into the deleted drafts.** For each comment citing a "block-on-sight N" of a proposed amendment, the worker reads the draft at 433413a, after confirming 433413a is on main.
  - If the accepted text carries the rule, the cite moves to that accepted item: for example ADR-013 Amendment 1 item 2, or its Clarification's Decision, for the identifier-string ban.
  - Otherwise the comment names the draft file at 433413a in words, as history. It never presents a block-on-sight item as accepted ADR text.
- **(g) Cancellation vocabulary.** ADR-018's words (`cancel_requested`, `cancel_observed`, acknowledged) are used only in ADR-018's sense.
- **(h) Order of commits.** D3 and D4 first, then the rest.

### 2.1 Rows

**D3 — kernel README, H2 row (FIRST).**
- **Stale:** `kernel/README.md:331 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
- **Facts:**
  - What the first test asserts: `kernel/tests/end_to_end.rs:417-434 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
  - The REPORT print: `kernel/tests/end_to_end.rs:421-426 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
  - What the before-first-batch test asserts: `kernel/tests/end_to_end.rs:463-476 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
  - Its REPORT print: `kernel/tests/end_to_end.rs:477-482 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
  - The stamp sits in the adapter's cancel arm, by the test's own recorded mutation: `kernel/tests/end_to_end.rs:380-383 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
  - The name kept by ruling: `kernel/tests/end_to_end.rs:385 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
  - Round 52, items 2 and 3.
  - The budget row: `docs/08_Testing.md:8 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
- **Says:**
  - The two tests assert a cancelled terminal, receipt not before send, at most one batch after the cancel is observed, and a 5 s liveness bound.
  - The before-first-batch case delivers no batch.
  - The client-pre-send to adapter-receipt interval is printed as a report and never asserted. It is not ADR-018's pair, and these tests assert no docs/08:8 budget.
- **Not:** "< 100 ms", "producer's own clock", or any figure.
- **Tests:** `kernel/tests/end_to_end.rs::h2_cancellation_is_observed_by_the_producer_inside_the_budget`, `kernel/tests/end_to_end.rs::h2_a_cancel_before_the_first_batch_still_stops_the_query`.

**D4 — engine persists nothing (FIRST).**
- **Stale:**
  - `engine/README.md:80 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`;
  - `engine/src/lib.rs:47-50 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
- **Facts:**
  - Tier 0 is the source; tiers 1 to 3 are derived and never authoritative: `engine/src/lod.rs:9-14 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
  - The tier root: `engine/src/lod.rs:151 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
  - The only entry point: `engine/src/lod.rs:992-1011 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
  - Creating the directory: `engine/src/lod.rs:1152 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
  - Writing tiers.json: `engine/src/lod.rs:1235-1237 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
  - Writing one GeoParquet file per tier: `engine/src/lod.rs:1397-1399 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
  - No SKP command builds a tier: `kernel/src/skp.rs:2185-2189 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
  - Where the obligation is tracked: `PLAN.yaml:850 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
  - The restatement the ruling adopts: `state/consults/2026-10-10-drift-sweep-area-d-custodian-check.md:130 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
- **Says, as the human's item 2 orders:**
  - The stream path writes nothing.
  - The tier builder writes a derived, non-authoritative tier cache: a directory per source content hash, one GeoParquet file per derived tier, and `tiers.json`.
  - The trigger in the old sentence has come due for that cache.
  - What is owed: whether a tier set carries a docs/11 ResourceRef and an ADR-005 statement, and what the kernel side owes.
  - Where it is tracked: the named open item on `lod-tier-selection`, which the human rules before any product path calls `build_tiers`. No SKP command calls it today.
  - The README's no registry, no lineage, no undo and no reproducibility grade stay.
- **Not:**
  - the obligation discharged;
  - any ResourceRef, grade or ADR-006 class for tiers;
  - eviction or lifecycle;
  - tiers served or selected;
  - the tier root's platform behaviour beyond `LOD_TIER_ROOT` and its typed refusal.
- **Unchanged, still true:** `engine/README.md:240-242 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
- **Tests:** `engine/tests/lod_tier_builder.rs::engine_opens_its_own_tier`, `engine/tests/lod_tier_builder.rs::a_tier_altered_on_disk_is_not_reused_and_the_disclosure_is_the_on_disk_size`.

**D1 — absent `crs` key and non-x-first source.**
- **Stale:**
  - `engine/README.md:23-29 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`;
  - `engine/README.md:436-441 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`;
  - `engine/README.md:452-463 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`;
  - `engine/src/lib.rs:13-14 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
- **The case list is taken from the code at B,** each case pinned. It is not taken from PR #205's paragraph, which is the human's wording in another file and waits on the human's ruling on C-1.
- **Admitted:**
  - An absent key under 1.0.0 or 1.1.0 opens as OGC:CRS84, `crs:format-default`: `engine/src/geoparquet.rs:16-23 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`; `engine/src/geoparquet.rs:37 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
  - A declared non-x-first CRS under a pinned version opens with the WKB data order, `axis:format-override`, and its declared order retained: `engine/src/dataset.rs:416-426 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
- **Refused:**
  - **Explicit `null`, and a non-object value read as null,** give `engine.crs_undeclared` unless the caller asserts: `engine/src/geoparquet.rs:444-450 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`; `engine/src/crs.rs:286-288 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
  - **An absent key under an unpinned version:** `engine/src/dataset.rs:398-404 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
  - **A format default the file's own bbox, covering statistics or sample contradicts** gives `engine.format_default_contradicted`, and a caller assertion still opens it: `engine/src/dataset.rs:1332-1351 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
  - **An assertion over a declaring file:** `engine/src/dataset.rs:406-415 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
  - **A caller-asserted non-x-first CRS, and a declared non-x-first CRS under an unpinned version,** give `engine.axis_order_unsupported` (the same dataset.rs:416-426 pin).
- **The axis section says:**
  - Nothing is normalized.
  - Refusal remains the resolved behaviour wherever no format rule applies (ADR-015 Amendment 1, items 1 and 2).
  - The §5 OPEN block is unanswered (item 7).
- **ADR status pins:**
  - ADR-015 Accepted: `docs/adr/ADR-015-source-crs-requirement-and-caller-assertion.md:3 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
  - ADR-015 Amendment 1: `docs/adr/ADR-015-source-crs-requirement-and-caller-assertion.md:155 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
  - ADR-032: `docs/adr/ADR-032-geoparquet-source-declaring-a-non-x-first-axis-order.md:5 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
- **Tests,** all in `engine/tests/admission_format_semantics.rs`:
  - `f1_an_absent_crs_key_admits_under_the_formats_own_rule_with_that_provenance`;
  - `f2_coordinates_outside_the_domain_convict_the_format_default`;
  - `a_contradicted_file_still_opens_under_a_caller_assertion`;
  - `f3_an_explicit_null_crs_is_unchanged_and_still_needs_an_assertion`;
  - `f4_a_declared_lat_first_crs_admits_under_the_wkb_override_with_its_declared_order_retained`;
  - `an_unpinned_spec_version_takes_no_format_rule_and_the_refusal_names_the_version`;
  - `an_unpinned_version_with_a_lat_first_declaration_still_refuses_by_name`.
  - The non-object-read-as-null case has no test; it is stated as code only.
- **Conditional:** none. If the human's C-1 ruling changes admission code before B, the §5 invalidator applies.

**D2 — no id column.**
- **Stale:** `engine/README.md:442-450 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
- **Facts:**
  - The session-tier arm: `engine/src/dataset.rs:1730-1756 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
  - A declared missing column still refuses: `engine/src/dataset.rs:1744-1750 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
  - A directory source is refused by name, before anything is read: `engine/src/dataset.rs:319-327 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
  - The `SessionOrdinal` variant: `engine/src/identity.rs:42-55 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
  - ADR-016 Accepted: `docs/adr/ADR-016-stable-feature-identity-admission.md:3 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
  - ADR-016 Amendment 1: `docs/adr/ADR-016-stable-feature-identity-admission.md:180 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
- **Says:**
  - Identity is the pair of dataset-session generation and `file_row_number`. It is generation-namespaced, never persisted, and claims no stability (ADR-016 Amendment 1, item 1).
  - A declared mapping is a separate route.
  - The removed claims are gone: that this bounds which files open, that most files cannot open, and that the mapping is an OPEN item.
- **Not:** stable, snapshot, or unique without the what-was-checked basis.
- **Tests,** all in `engine/tests/session_identity.rs`:
  - `a_single_file_keyless_source_admits_on_the_session_tier_and_records_its_basis`;
  - `a_declared_mapping_to_a_missing_column_still_refuses_rather_than_falling_to_the_session_tier`;
  - `a_directory_source_is_refused_by_name_rather_than_as_an_unreadable_file`.

**D5 — the attribute set.**
- **Stale:** `engine/README.md:366-369 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
- **Facts:**
  - The admitted set: `engine/src/attributes.rs:78-101 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
  - The set no longer coincides with the bundle restriction: `engine/src/attributes.rs:45-48 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
  - Publish preflight refuses `Float32` and dictionaries: `kernel/src/publish/mod.rs:414-447 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
- **Says:**
  - The admitted types, enumerated from that match.
  - A dictionary is admitted when its value type is, and is emitted as that value type.
  - Only publish preflight refuses `Float32` and dictionaries, as a restriction of the bundle format.
- **Tests:**
  - `engine/src/attributes.rs::tests::the_live_admissible_set_admits_float32_and_a_dictionary_over_an_admitted_value_type`;
  - `kernel/tests/skp_projection.rs::publish_refuses_float32_and_dictionary_columns_at_preflight_as_a_bundle_format_restriction_with_todays_text`.

**D6 — scope line and summary table.**
- **Stale:**
  - `engine/README.md:3-5 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`;
  - `engine/README.md:16 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
- **Facts:**
  - Five encodings, fixed at open: `engine/src/lib.rs:17-28 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
  - The live projected stream: `engine/src/stream.rs:991-999 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
  - ADR-034 Accepted: `docs/adr/ADR-034-geometry-type-admission-and-geoarrow-encoding-selection.md:3 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
- **Says:**
  - Five GeoArrow encodings, selected at open.
  - A declared projection on both the publish stream and the live projected stream. ADR-023 stays Proposed.
- **Tests:** `engine/tests/geometry_admission.rs::a_declared_set_selects_the_encoding_or_is_refused_at_open`, `engine/tests/live_projection.rs::a_live_projected_stream_emits_id_geometry_then_the_declared_columns`.

**D7 — the spatial index called untouched.**
- **Stale:**
  - `engine/README.md:76 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`;
  - `engine/src/lib.rs:15-16 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
- **Facts:**
  - The index module's own scope statement: `engine/src/index.rs:4-5 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
  - The README's index section: `engine/README.md:176-179 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
  - The index is not in the default planner: `engine/README.md:104-108 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
- **Says:** it is built and tested, it is not in the product planner, and the gate is closed for this slice's shape only, pointing to the README section.
- **Tests:** `engine/tests/spatial_index.rs::an_indexed_query_returns_exactly_what_the_scan_returns`, `engine/tests/planner_seam.rs::the_product_planner_never_reaches_the_index_seam`.

**D8 — accepted ADRs and amendments called Proposed.** Each site is rewritten under 2.0 (c), (d) and (f).
- **Sites:**
  - `engine/src/identity.rs:5 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`
  - `engine/src/identity.rs:43 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`
  - `engine/src/identity.rs:65-66 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`
  - `engine/src/identity.rs:119-121 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`
  - `engine/src/crs.rs:9-14 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`
  - `engine/src/geoparquet.rs:75-76 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`
  - `engine/src/geoparquet.rs:152 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`
  - `engine/src/geoparquet.rs:236-237 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`
  - `engine/src/geoparquet.rs:587-588 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`
  - `engine/src/geoparquet.rs:742 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`
  - `engine/src/geoparquet.rs:803 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`
  - `engine/src/dataset.rs:1017 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`
  - `engine/src/dataset.rs:1731 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`
  - `engine/src/envelope.rs:146 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`
  - `engine/src/envelope.rs:179-180 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`
  - `kernel/src/bundle/mod.rs:4-5 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`
  - The README statuses `engine/README.md:77-79 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`; lines :29, :438, :443 and :462 are covered by rows D1 and D2.
- **Status pins:**
  - `docs/adr/ADR-013-typed-coordinate-spaces-and-provenance.md:3 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`
  - `docs/adr/ADR-013-typed-coordinate-spaces-and-provenance.md:265 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`
  - `docs/adr/ADR-013-typed-coordinate-spaces-and-provenance.md:318 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`
  - `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:3 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`
  - and the ADR-015 and ADR-016 pins above.
- **The "No provenance column" text (README :77-79):**
  - ADR-013 is Accepted. Granularity was ruled per-feature at acceptance (`docs/adr/ADR-013-typed-coordinate-spaces-and-provenance.md:248-251 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`).
  - Column shape is deferred (`docs/adr/ADR-013-typed-coordinate-spaces-and-provenance.md:257-258 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`).
  - This module writes no provenance column.
  - The clause saying nothing here creates derived coordinates stays only if the worker shows from `engine/src/lod.rs` that tier vertices are a subset of source vertices. Otherwise it is dropped, and the text says the tiers are derived and non-authoritative. No ADR-013 applicability to tiers is asserted either way.

**D9 — CANCELLATION-AND-TRACING §6.**
- **Stale:** `kernel/CANCELLATION-AND-TRACING.md:161-167 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
- **Facts:**
  - ADR-017 Corrigendum 4: `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:1044-1048 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
  - ADR-018's Status line: `docs/adr/ADR-018-what-cancellation-acknowledged-means.md:3 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
  - The document's discipline of appending corrections: `kernel/CANCELLATION-AND-TRACING.md:219-221 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
- **The change:** an appended section 9, see 2.2. It covers items 1 and 2 only.

**D10 — publish order of operations.**
- **Stale:** `kernel/src/publish/mod.rs:44-56 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
- **Facts:**
  - `preflight_pinless` and its reordering: `kernel/src/publish/mod.rs:573-598 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
  - `publish_unguarded` runs `preflight` first: `kernel/src/publish/mod.rs:605-611 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
  - Destination check, then staging: `kernel/src/publish/mod.rs:628-634 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
  - The run states it itself: `kernel/src/publish/mod.rs:696 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
  - The boundary's order: `kernel/src/permission/boundary.rs:9-19 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
- **Says:** the steps in the order the code runs them at B. The worker derives the order from `run_inner` and pins each step in the PR body.
- **Tests:** `kernel/tests/publish.rs::a_row_predicate_is_refused_before_any_staging_directory_exists`, `kernel/tests/publish.rs::the_refusal_is_in_preflight_itself_not_only_reachable_through_publish_unguarded`.

**DX — extra files (exposure, and the name map).**
- **Stale:**
  - `kernel/src/permission/mod.rs:21-24 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`;
  - `kernel/src/permission/boundary.rs:26-29 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`;
  - `kernel/src/lib.rs:37-43 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`;
  - `kernel/src/lib.rs:48-49 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
- **Facts:**
  - `frontends/shell/src-tauri/src/commands.rs:265 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`;
  - `frontends/shell/src-tauri/src/commands.rs:402 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`;
  - `frontends/shell/src-tauri/src/publish.rs:831 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`;
  - the C8 bullet: `kernel/README.md:237-241 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`;
  - the exposure review completion: `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:1134-1142 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`;
  - runtime opens into the catalog: `kernel/src/skp.rs:1174-1176 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`;
  - the README's catalog bullet: `kernel/README.md:16-19 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
- **Says:** C8's position and nothing more.
  - The shell's `binding_publish_*` commands reach `boundary::execute`. That is the UI surface the acceptance condition was discharged for.
  - `publish-bundle` remains developer/test tooling.
  - SKP, MCP, plugin, notebook and AI exposure each still need their own review.
  - The rotation ceiling bounds the log (`MAX_AUDIT_LOG_BYTES`, `MAX_AUDIT_LOG_GENERATIONS`).
  - Names are opened at startup or at runtime through `open_dataset`.
- **Not:** any claim about whether any caller is unauthorized; any surface reviewed beyond the UI.
- **Tests:** `kernel/tests/catalog_replace.rs::replacing_a_name_through_open_cancellable_serves_the_new_dataset_and_drops_the_old_one_before_it_returns`; the shell test `a_successful_publish_is_audited_with_the_shell_dialog_route_and_a_fresh_log_per_attempt` in `frontends/shell/src-tauri/src/publish.rs`.

**DE5 — area E finding 5.**
- **Stale:** `engine/src/geoparquet.rs:867-872 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
- **The change:** the test is renamed `an_absent_crs_key_is_not_a_declaration`. It pairs with its sibling `an_explicit_null_crs_is_not_a_declaration_either`.
- **The comment says:** the parse records no declaration, and the format's default is applied at admission under a pinned version (the module comment, `engine/src/geoparquet.rs:16-23 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`).
- **The assertion is unchanged.**

**DK — earlier items.**
- **The kernel module doc's scope and only-place statements:**
  - Stale: `kernel/src/lib.rs:6-11 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
  - The rewrite follows `kernel/README.md:3-6 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD` and `kernel/README.md:8-12 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
- **N1, the exposure position:**
  - The module doc: `kernel/src/lib.rs:37-43` (row DX).
  - kernel/PERMISSION-BOUNDARY.md takes an appended note (see 2.2). The stale body is `kernel/PERMISSION-BOUNDARY.md:15-17 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`, and its own not-rewritten header is `kernel/PERMISSION-BOUNDARY.md:3-9 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
- **N2, the pointer:** `kernel/README.md:239 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`. The parenthetical names commands.rs as the definition site and publish.rs as the route. The bullet's other words stay byte-identical.
- **Node 9 §3, an index line:**
  - The test pointer moves from `kernel/README.md:358 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD` to `kernel/README.md:353 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
  - The test calls only `StreamRegistry::cancel`: `kernel/src/skp.rs:3590-3597 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
- **Node 9 §4, the TicketState sentence:**
  - The sentence: `kernel/README.md:177-179 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
  - It gains the not-covered qualifier of `kernel/src/skp.rs:170-176 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`. No test pins the qualifier, so it is not called tested.

### 2.2 In place, or appended

- **README bodies, doc comments and the owner's indexes** are current-state text (`AUTONOMY.md` §22). They are edited in place.
- **`kernel/CANCELLATION-AND-TRACING.md`** appends a section 9 at the end.
  - It is dated, and it records against §6 items 1 and 2 the facts of row D9.
  - It edits no earlier line, following the document's own discipline.
- **`kernel/PERMISSION-BOUNDARY.md`** appends one dated note at the end.
  - It records C8's position, by the pins of row DX.
  - Nothing above it changes. The file says it is not rewritten, and its body is dated 2026-08-07.
- **For both files,** append-only is proved against B: lines 1 to N of B's file are byte-identical at H.

### 2.3 Test names, and the later node

- **`engine/src/identity.rs:251-254 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`** names a test that `stale-test-names-and-comments` renames later.
  - At B that name is current, and the instrument-accessor exemption (round 5, item 4) needs the doc to name the test that calls it.
  - This piece does not edit these lines. Where the reference goes is OPEN-1.
- **`kernel/tests/end_to_end.rs:386`'s name stays,** by round 52, item 3 (`state/directives/2026-10-04-round-52-open-3-ruling.md:6-8 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`). `docs/07_Roadmap.md:21 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD` cites it. No node carries a rename.

### 2.4 Owner's-index update

lead-data writes it before the final gate (pilot §1 item 2), and the worker applies it in this PR.
- **kernel/README.md:**
  - Stream tickets and Close ordering (row DK);
  - Governed by, preregistrations in this module, which gains this form (`kernel/README.md:376 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`).
- **engine/README.md:** engine halves of pieces filed elsewhere, which gains this form (`engine/README.md:521 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`).
- **Not touched:**
  - engine/README.md lines 499, 510 and 519, as #206 leaves them;
  - either Last verified at line, unless lead-data re-checks every pointer in that section.

### 2.5 Conditional rows (OPEN-2; applied only on the answer)

- **In the node's files:**
  - `engine/src/lib.rs:6-8 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD` (the same claim as D6)
  - `engine/src/lib.rs:42-46 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD` (as D8's README :77-79)
  - `engine/src/crs.rs:6-7 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`
  - `engine/src/crs.rs:41-42 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`
  - `engine/src/crs.rs:46-47 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD` (A)
  - `engine/src/geoparquet.rs:246-249 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`
  - `engine/README.md:33-36 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD` (A): the data's axis order now also comes from the format rule.
  - `kernel/src/lib.rs:36 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD` (A): the audit log writes, per `kernel/src/permission/audit/log.rs:133-149 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
- **A new file, under option (b) only:**
  - `engine/src/predicate.rs:128-129 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD` (A)
  - `engine/src/predicate.rs:287-288 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD` (A)
  - ADR-033 Accepted: `docs/adr/ADR-033-connection-lease-classes-for-admission-work.md:3 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`.
- **Never in this piece:** `kernel/src/skp.rs:417-420 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`. It is recorded for `skp-v0-live-sections-current-area-c`, which edits skp.rs comments.

### 2.6 Overlap (rule 00) and wait

- **Paths:**
  - the 15 files of 2.1;
  - `engine/src/predicate.rs` under OPEN-2 (b);
  - this form;
  - PLAN.yaml.
  - None is under protocol/, and none is KNOWN-LIMITATIONS.md.
- **engine/README.md is shared with PR #206.** No code starts before #205 and #206 have both merged. The branch is cut from main after both.
- **Rule 00 is re-checked at dispatch** against both slots and every PR awaiting merge.

### 2.7 Portability (R1-R6)

- No OS-dependent feature is added or changed, so R3's section does not apply.
- Row D4 states no platform behaviour beyond the declared LOD root and its typed refusal (`state/directives/PORTABILITY-2026-09-30.md:15 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD`).
- No platform level is claimed (R5).

## §3. Fixtures

None.

## §4. Tests, and the mutation per new test

- **No new test, and no assertion changes.**
- **One rename:**
  - from `engine/src/geoparquet.rs::tests::an_absent_crs_key_is_not_silently_ogc_crs84`
  - to `engine/src/geoparquet.rs::tests::an_absent_crs_key_is_not_a_declaration`.
- **No mutation is owed.** No record of this piece calls any run, a `verify-mutation` run included, an observation of a mutation.
- **Run by name at H:**
  - the renamed test;
  - `engine/tests/slice.rs::h6_the_engine_module_names_no_transport`;
  - `kernel/tests/permission_boundary.rs::the_permission_boundary_is_the_only_caller_of_the_publish_operation_in_this_crate`.

## §5. Predictions, declared unchanged, invalidators, falsification

- **Predictions:**
  - **E1.** Every changed line in a `.rs` file is a `//` line, except the renamed `fn` line: one line removed, one added.
  - **E2.** `cargo test -p spatial-engine -- --list` differs between B and H by exactly the one name. `-p spatial-kernel` is identical.
  - **E3.** The §4 tests pass.
  - **E4.** `cargo doc --no-deps -p spatial-engine -p spatial-kernel` warnings at H are a subset of those at B.
  - **E5.** `cargo fmt --all -- --check` exits 0.
  - **E6.** At H, each named with its commit: `verify-cites`, `verify-quotes`, `verify-test-claims` and `verify.mjs` exit 0; `queue.mjs --check` and `site.mjs --check` report current; the `node --test` scripts suites exit 0.
  - **E7.** The 2.2 byte checks hold.
  - **E8.** engine/README.md lines 499, 510 and 519 are identical at B and H.
  - **E9.** PR CI is green.
- **Declared unchanged:**
  - every code token, assertion and literal;
  - every test name but one;
  - all ADR files, protocol/**, frontends/** and KNOWN-LIMITATIONS.md;
  - engine/src/identity.rs lines 251-254.
- **Live cite into an edited file:** the impact read found one, `frontends/shell/src-tauri/src/pool_poll.rs:12`, which already misses. It is out of scope. The worker re-greps at B and lists any other.
- **Invalidators (stop and report):**
  - a pinned fact that changed at B, as opposed to a moved line;
  - a rewrite that would need a code change;
  - a fact with no pin;
  - exposure text that C8 does not carry.
- **Falsified if** any rewritten sentence is shown untrue at B.

## §6. Instruments

Assertions only (E1 to E9). No measurement.

## §7. Declared values and ceilings

- **Counting.** Count with `git diff --numstat B...H -- <path>`, insertions plus deletions; B and H are named in the PR body. The form and PLAN.yaml are outside the line count and inside the file count.
- **Per-file ceilings:**
  - engine/README.md 142 (the index at most 2 of that)
  - engine/src/lib.rs 40
  - engine/src/identity.rs 14
  - engine/src/crs.rs 10
  - engine/src/geoparquet.rs 30
  - engine/src/dataset.rs 6
  - engine/src/envelope.rs 8
  - kernel/README.md 24
  - kernel/src/lib.rs 36
  - kernel/src/bundle/mod.rs 4
  - kernel/CANCELLATION-AND-TRACING.md 16, insertions only
  - kernel/src/publish/mod.rs 30
  - kernel/src/permission/mod.rs 14
  - kernel/src/permission/boundary.rs 8
  - kernel/PERMISSION-BOUNDARY.md 12, insertions only
- **OPEN-2 additions,** applied only on the answer: engine/src/lib.rs +14, engine/src/crs.rs +14, engine/src/geoparquet.rs +6, kernel/src/lib.rs +6, engine/src/predicate.rs 10.
- **Totals:** at most 400 lines and 17 files; with OPEN-2 (b), at most 450 lines and 18 files.
- **No constant is added.**
- **An overrun is class 8,** and this section is never edited.

## §8. Block-on-sight

1. A changed non-comment line in a `.rs` file other than the one renamed `fn` line.
2. Any assertion, literal or string the app shows changes.
3. A path outside §7 changes. That includes engine/README.md lines 499, 510 and 519, and engine/src/identity.rs lines 251-254.
4. A rewritten sentence that claims more than its pin shows. That includes D3 claiming docs/08:8, and D4 claiming a discharge, a grade, a ResourceRef, an ADR-006 class, a lifecycle or a served tier.
5. An accepted ADR called Proposed in a touched line, or a Proposed ADR called accepted or binding.
6. A draft's block-on-sight item presented as accepted ADR text.
7. Exposure text beyond C8. This is red-line text and never documentation-only.
8. Session-tier text that implies stability or a snapshot.
9. An edit above the appended part of CANCELLATION-AND-TRACING.md or PERMISSION-BOUNDARY.md.
10. Any of these: a new bare `path:line` in a current-state doc, a pin split across lines, or a pin at a branch commit.
11. A quotation not byte-copied, or a byte changed inside an existing quoted span.
12. Code before #205 and #206 merge, or a conditional row applied before its answer.
13. A §7 overrun not recorded as class 8, or §7 edited.
14. A scope addition not recorded as class 9 before its code.

## §9. Gates

- **Architect (full gating).** Checks principles and ADR boundaries, ADR-006 classing, ADR-018 vocabulary and the red-line exposure text, then §8 one item at a time.
- **Reviewer.** The full diff, E1 to E9, and every rewritten sentence against its pin.
- **Verdicts follow product-first section 2.**
  - Correctness covers each sentence's truth: an unsupported claim of a guarantee or a limit is Correctness, never Documentation.
  - Evidence covers E1 to E9.
  - Documentation findings are fixed before the merge, with no re-gate.
- **Briefs** carry `state/directives/2026-10-06-machine-script-adopted.md:12-22 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:HASH-TBD` for E2 to E5, and no other build rule.
- **Operator:** none. No walkthrough row and no sight.
- **KNOWN-LIMITATIONS:** no item is added or edited. Items 2, 3, 9, 31 and 33 bear on the same facts and stay as they are.
- **Budget:** 120 minutes.
- **The PR body asks for a merge commit.**

## §10. Amendments

Opens empty, append-only, classes 1 to 9.
````

## 3. OPEN items (2; neither is a red line)

**OPEN-1: where `engine/src/identity.rs:251-254`, the reference to the test that `stale-test-names-and-comments` renames, goes (impact read Q2).**
- **The conflict.** The human placed the reference here (area E, part 1 item 2), to follow the rename. By `depends_on`, though, this piece lands before the rename. At this piece's base the old name is current. Editing it here would point the instrument-accessor doc at a test that does not exist yet.
- **Options:**
  - **(a)** The reference moves to `stale-test-names-and-comments` and lands in the rename's own commit. That is a one-file exception to that node's test-files-only rule (docs-lane directive, item 1).
  - **(b)** It stays here, but is applied only if the rename has merged before code. By the PLAN's order it never has, so the reference goes stale after the rename lands.
  - **(c)** The rename itself comes into this piece. That adds `engine/tests/identity.rs` and `engine/tests/admission_instruments.rs`, which widens this piece and takes work from the other node.
- **Recommendation: (a).** The name and its one product-code reference then change in one commit, so the exemption's named test is never missing.
- **What waits on it:** nothing in this piece's code, because the lines are untouched under every option. The other node's form does wait on it.

**OPEN-2: lines the node does not name (impact read Q5, plus the lines marked (A)).**
- **The gap.** The human's area-E rule decides only area E's test findings, so it does not settle these lines.
- **Options:**
  - **(a)** Take every listed line in the node's files (draft §2.5). `kernel/src/skp.rs:417-420` is recorded for `skp-v0-live-sections-current-area-c`.
  - **(b)** As (a), plus `engine/src/predicate.rs` (2 sites; ADR-033 has been Accepted since 2026-09-14).
  - **(c)** None of them. Propose a node.
- **Recommendation: (b).**
  - It is the node's own title: the module docs are brought current.
  - Without these lines, edited files contradict themselves. For example, lib.rs:6-8 would contradict README :3-5 once D6 lands.
  - The ceilings already cover it, and the rows are declared now, so the answer is a choice among declared options: a narrowing is class 5, never class 9.
- **What waits on it:** only the conditional rows.

**Not OPEN, but decided in the draft:**
- Q1: append to both CANCELLATION-AND-TRACING.md and PERMISSION-BOUNDARY.md.
- Q3: the kernel index changes :353, :358 and :376, and the engine index changes :521. Neither :499 nor :519 changes.
- Q4: finding 1's list is taken from the code at B, independent of the C-1 ruling.
- The `kernel/tests/end_to_end.rs:386` name stays, by the human's ruling (round 52, item 3).

## 4. Files read; the impact read's pointers

**Read (main 426ec39f):**
- the impact read, whole;
- PLAN.yaml 3800-3834, 835-851 and 4405-4484;
- the tier-obligation, area-E-instructions, docs-lane, product-first, portability, machine-script, LEAD-DATA-PILOT-V2 and round-52-OPEN-3 directives, whole;
- the area D check and area E check, whole;
- the #205 gate-1 reviewer report, whole;
- the crs owner's-index update, whole; the crs form, lines 220-240;
- gate-2 architect, lines 40-84;
- state/questions/round-52.md, whole; DECISIONS-PENDING round-52 RULED block (grep);
- AUTONOMY.md 306-393 and 476-529;
- docs/PREREGISTRATION-TEMPLATE.md, whole;
- engine/README.md, whole; kernel/README.md, whole;
- engine/src/lib.rs 1-90; kernel/src/lib.rs 1-60;
- engine/src/crs.rs 1-50 and 280-291;
- engine/src/identity.rs 1-125 and 240-264;
- engine/src/geoparquet.rs 1-95, 148-155, 232-253, 444-451, 584-590, 738-744, 799-805 and 855-879;
- engine/src/dataset.rs 318-327, 395-429, 1012-1021, 1328-1352 and 1700-1759;
- engine/src/envelope.rs 140-184; engine/src/attributes.rs 40-109;
- engine/src/lod.rs 1-60, 145-156 and 990-1014, plus greps;
- engine/src/index.rs 1-10; engine/src/stream.rs 985-1002;
- engine/src/predicate.rs 124-131 and 283-290; engine/src/error.rs 316-323;
- engine/tests/slice.rs 981-1045; engine/tests/admission_format_semantics.rs and engine/tests/session_identity.rs (fn greps);
- kernel/tests/end_to_end.rs 370-489;
- kernel/src/skp.rs 160-184, 414-422, 1168-1179, 2183-2191 and 3590-3615;
- kernel/src/bundle/mod.rs 1-15; kernel/src/publish/mod.rs 36-69, 408-447 and 572-701;
- kernel/src/permission/mod.rs 1-36; kernel/src/permission/boundary.rs 1-36;
- kernel/PERMISSION-BOUNDARY.md 1-40; kernel/CANCELLATION-AND-TRACING.md 150-255;
- kernel/tests/permission_boundary.rs 840-885; audit log.rs (grep);
- frontends/shell/src-tauri/src/commands.rs and publish.rs (greps);
- ADR-013 1-30, 90-114, 236-329; ADR-015 150-205; ADR-016 175-241; ADR-017 1040-1049 and 1130-1143; ADR-018 1-5; Status greps for ADR-005, 013, 015, 016, 017, 023, 024, 032, 033 and 034;
- docs/08_Testing.md 1-14;
- greps for the h2 test name and for Proposed in engine/src and kernel.

**Pointers used:** all of §1's stale-line and fact pointers for findings 1 to 10, the extra files, area E 5 and 2, report 1 §6, N1, N2 and node 9 §3; §3's ADR Status lines; §4's overlap facts; §5's counts, as a basis for the ceilings.

**Found wrong:**
- **`kernel/README.md:176-178` (node 9 §4).** The sentence is at :177-179 at C, and the read's claim that it moved from 177-179 does not hold.
- **The read's observation that the `kernel/tests/end_to_end.rs:386` name is "named by no node".** It is governed by round 52, item 3 (the name stays because docs/07:21 cites it). It is also named in `kernel/TIMING-ASSERTIONS-UNDER-CONTENTION-PREREGISTRATION.md:139` and in `protocol/data-plane/STREAM-REGISTRY-BOUND-PREREGISTRATION.md`, so a rename would trip test claims.

**Missing:**
- `engine/src/predicate.rs:128-129` and `:287-288` call ADR-033 PROPOSED; it was Accepted on 2026-09-14.
- `engine/README.md:33-36`: axis order "read from PROJJSON" is incomplete under the format rules.
- `kernel/src/lib.rs:36` says nothing else persists, but the audit log writes to disk (`kernel/src/permission/audit/log.rs:133-149`).
- `engine/src/crs.rs:46-47`: "that draft's block-on-sight 2" loses its antecedent.
- The block-on-sight cites at geoparquet.rs:588, :742 and :803, identity.rs:66 and skp.rs:419-420 point into deleted drafts (the ADR acceptance notes at ADR-013:326, ADR-015:204 and ADR-016:238). A plain status-word swap would cite text the accepted ADRs do not carry.
- **The LOD tiers' derived geometry**, which bears on the "nothing creates derived coordinates" clause at README :79 and lib.rs:44-46.
- **The format-default contradiction refusal for finding 1**, pinned in code at `engine/src/dataset.rs:1332-1351` and tested at `engine/tests/admission_format_semantics.rs:152` and `:176`. The read pointed only at the PLAN summary for it.
- **The sibling test name** `an_explicit_null_crs_is_not_a_declaration_either` (`engine/src/geoparquet.rs:875`), which the rename should pair with.

Every `HASH-TBD` in the draft is for the custodian to compute at the full commit named in the pin.
