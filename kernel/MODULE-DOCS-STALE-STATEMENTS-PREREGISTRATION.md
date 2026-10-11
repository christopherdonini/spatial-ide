# Engine and kernel module docs brought current — preregistration (full form)

**Authority.** PLAN node `module-docs-stale-statements` (`PLAN.yaml:3805-3821 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:de7f8f5d5b423a90521028ffce8c0e8afd61c29b515921e51f3c5fa570a059f1`). Placed by the human as the docs lane's item 3d (`state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:26 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:6d37105c57155647cc83a311176d3a6a8e878043218693c0652cd0936de6a8f6`), under the lane's terms (`state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:19 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:58d6c8e006c3d7a147debe6478ccb80a44fbad69c48f11d52fab7bfbeadd8f0d`), and drafted ahead of its slot (`state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:38 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:2eba54a30650266443f7bfd35cb1581b050063d7db93623b0ad2b648a7d92c4d`). Budget and finding 4's restatement: the human's ruling, items 1 and 2 (`state/directives/2026-10-10-tier-obligation-open-item-and-adr-029.md:6 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:4a21fa72f7bf50cc993733270887747948a0bbc67be780feaec631621aef3d8a`; `state/directives/2026-10-10-tier-obligation-open-item-and-adr-029.md:7 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:5473cfe307d6e33b7a38fb11fd8c56e3c2cba19ccfebbc5f31290fcf069d904e`). Area E placement: `state/directives/2026-10-10-drift-sweep-area-e-instructions.md:11 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:8658c55c3b741193975a2f80d5d94c00c68929bb9a18c276c66461f9d84d100c`.

**Drafted by** the architect, on the custodian's brief. The inputs are lead-data's impact read (`state/consults/2026-10-11-module-docs-stale-statements-impact-read.md`, whole-file sha256 2940d31b81d6bb6a37fad0efd14d65c0273387ecc40cdc4a78e446bed5bb04f6 as filed) and the architect's own reads, all at main 426ec39fc0b3be7da96555d2d4d489e34a075475 (below, C).

**Committed before any code.** Append-only once committed. An amendment made after any outcome has been seen says so in its first line.

**Gating.** Full form and full gating: `AUTONOMY.md` §21a (category 4, a stated guarantee or invariant, in documentation) and §21c (more than 8 files and more than 150 lines), §25(e) from dispatch. Verdicts are proportional (`state/directives/2026-10-05-product-first-direction.md:15 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:8c0e4e3f404b413db3e506411f401880baf9681ac8dd67362dfba73c20d7b751`).

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
- **(d) Accepted amendments.** These are cited by their accepted item numbers. ADR-013, ADR-015 and ADR-016's Amendments 1 were appended from the Proposed text blocks of drafts deleted at acceptance, as they stood at 433413a (`docs/adr/ADR-013-typed-coordinate-spaces-and-provenance.md:326 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:447895300d4927797636ce29145c5f73225dc40311a473479951beba7c9d44f9`; `docs/adr/ADR-015-source-crs-requirement-and-caller-assertion.md:204 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:2e7beea13cdb75356e6511ab87ffac9bb66348a82aa7b497294d0eb192ee5a12`; `docs/adr/ADR-016-stable-feature-identity-admission.md:238 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:8c5b637b3df21df6032500cb3794b772a1e2ead1e74aa81949556e88c5d0978c`).
- **(e) Quotes.** No new quotation marks unless the text is byte-copied by script. Existing quoted spans stay byte-identical.
- **(f) Block-on-sight cites into the deleted drafts.** For each comment citing a "block-on-sight N" of a proposed amendment, the worker reads the draft at 433413a, after confirming 433413a is on main.
  - If the accepted text carries the rule, the cite moves to that accepted item: for example ADR-013 Amendment 1 item 2, or its Clarification's Decision, for the identifier-string ban.
  - Otherwise the comment names the draft file at 433413a in words, as history. It never presents a block-on-sight item as accepted ADR text.
- **(g) Cancellation vocabulary.** ADR-018's words (`cancel_requested`, `cancel_observed`, acknowledged) are used only in ADR-018's sense.
- **(h) Order of commits.** D3 and D4 first, then the rest.

### 2.1 Rows

**D3 — kernel README, H2 row (FIRST).**
- **Stale:** `kernel/README.md:331 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:469c906b2110da58ec55c1f6a18fd24606730197e3295b731139a9a9997e9f1d`.
- **Facts:**
  - What the first test asserts: `kernel/tests/end_to_end.rs:417-434 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:e9680e0992fed501f53d88d49fdfebfe2624c25abcaf036df41b9c5b4d196811`.
  - The REPORT print: `kernel/tests/end_to_end.rs:421-426 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:ebd9dfda4ebcd3f3cd7153f50024370b18efd816c378579edc37bd451e9852ab`.
  - What the before-first-batch test asserts: `kernel/tests/end_to_end.rs:463-476 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:5edba75a1cadf14b41b9879b3810a4a6e242097698643719f0f522b4e6930da0`.
  - Its REPORT print: `kernel/tests/end_to_end.rs:477-482 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:6290c4a22beaf5488fe7811d9c34c2d9901ccf3da18ba45e492e2e2bc6f6135d`.
  - The stamp sits in the adapter's cancel arm, by the test's own recorded mutation: `kernel/tests/end_to_end.rs:380-383 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:409347d52f25875b707a58895de2b5836d713e0e1171883a66e8628a9014d18d`.
  - The name kept by ruling: `kernel/tests/end_to_end.rs:385 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:9ae8bc39a4df45773580534061c23ec14b374e4256c5a26fa2cda297bfed9639`.
  - Round 52, items 2 and 3.
  - The budget row: `docs/08_Testing.md:8 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:1185356552cbb402306f649f0c38dd4f85c109e86a2a64b34c12009d3e6ea558`.
- **Says:**
  - The two tests assert a cancelled terminal, receipt not before send, at most one batch after the cancel is observed, and a 5 s liveness bound.
  - The before-first-batch case delivers no batch.
  - The client-pre-send to adapter-receipt interval is printed as a report and never asserted. It is not ADR-018's pair, and these tests assert no docs/08:8 budget.
- **Not:** "< 100 ms", "producer's own clock", or any figure.
- **Tests:** `kernel/tests/end_to_end.rs::h2_cancellation_is_observed_by_the_producer_inside_the_budget`, `kernel/tests/end_to_end.rs::h2_a_cancel_before_the_first_batch_still_stops_the_query`.

**D4 — engine persists nothing (FIRST).**
- **Stale:**
  - `engine/README.md:80 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:5f4a5e24226a4176b04c186aeff84e4d5e03d502a6f7393f0cf4125ad6f9d15f`;
  - `engine/src/lib.rs:47-50 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:d9d209ca617943548b9c1d332fb999112a107395bb9ce6fda3f4ab6d4ad859a4`.
- **Facts:**
  - Tier 0 is the source; tiers 1 to 3 are derived and never authoritative: `engine/src/lod.rs:9-14 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:43b5e5733527c33bfb15746a6c122b4ef24f089e8d2ce252a5edaf6df5f3b764`.
  - The tier root: `engine/src/lod.rs:151 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:1aebd7d78db085849cc03d02ccd9df07330ca2f82602791d2c28c4ae7610d08a`.
  - The only entry point: `engine/src/lod.rs:992-1011 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:34217a537075a2f54227856d50a5d05992d3f27a151a6d0465ae7fc1028efb69`.
  - Creating the directory: `engine/src/lod.rs:1152 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:20f3a9b8e47fc38ef454e14fc7743d435fe8deadaf669d293ef397615be3c837`.
  - Writing tiers.json: `engine/src/lod.rs:1235-1237 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:bd72643564937bb1e6b4dea9f901206f3f89340caf745f21adb57c606c33fba5`.
  - Writing one GeoParquet file per tier: `engine/src/lod.rs:1397-1399 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:a12af4af4d439bffcf51590a681f547d1932ae931e9ed93a6f104356b1715f9a`.
  - No SKP command builds a tier: `kernel/src/skp.rs:2185-2189 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:d901fe945660508aabe2ec4289cca09f10f53b1cf629d0d6008db9d0a1206a87`.
  - Where the obligation is tracked: `PLAN.yaml:850 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:6a4dac999b0b03ec5c8faf77fa6d4858e50b5280c82b58806517367e037e10e3`.
  - The restatement the ruling adopts: `state/consults/2026-10-10-drift-sweep-area-d-custodian-check.md:130 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:feec1c324e4db5a9abfab581ca8d83f1f83b818fa8811b325991268fa46d2329`.
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
- **Unchanged, still true:** `engine/README.md:240-242 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:3f87e18ca75c473c91260a02c999b4b354fdf8211a1db6fcb8c3511bd7f97f9a`.
- **Tests:** `engine/tests/lod_tier_builder.rs::engine_opens_its_own_tier`, `engine/tests/lod_tier_builder.rs::a_tier_altered_on_disk_is_not_reused_and_the_disclosure_is_the_on_disk_size`.

**D1 — absent `crs` key and non-x-first source.**
- **Stale:**
  - `engine/README.md:23-29 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:eeda9b75b1c59369d90f78915569c0c6b31655810f01dd884624b1e45c6e800d`;
  - `engine/README.md:436-441 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:bceced573a4d9a7a0340b57217693fa07d14362bad9a7d2575095b88b7efb509`;
  - `engine/README.md:452-463 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:11d5f3efb363c6fa7c5157fe90a83ac22659b557d393ade160471e4c4bdf79ea`;
  - `engine/src/lib.rs:13-14 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:9cf38ccecde84fcf07b4619f6902d293282dcf5eaa8e52c95051ee63b3c66ebb`.
- **The case list is taken from the code at B,** each case pinned. It is not taken from PR #205's paragraph, which is the human's wording in another file and waits on the human's ruling on C-1.
- **Admitted:**
  - An absent key under 1.0.0 or 1.1.0 opens as OGC:CRS84, `crs:format-default`: `engine/src/geoparquet.rs:16-23 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:4ba156f30559459630b529881677299becb50b871030fd735a7160d9fa1c9cde`; `engine/src/geoparquet.rs:37 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:49a814bfa409a470a50ba1a090d439af2d22b1a0d7db7ca06eccf852fd87130c`.
  - A declared non-x-first CRS under a pinned version opens with the WKB data order, `axis:format-override`, and its declared order retained: `engine/src/dataset.rs:416-426 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:eb76ff550b529004918b9f545e916459567380a167c957c1b6024071862c6a1c`.
- **Refused:**
  - **Explicit `null`, and a non-object value read as null,** give `engine.crs_undeclared` unless the caller asserts: `engine/src/geoparquet.rs:444-450 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:0f9a0d8da5f599b06555edcd7c44865e32fd78e650df45266223aa75d2feaed1`; `engine/src/crs.rs:286-288 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:0f89d07c0f8010b6aef7e44c32a24ede99478d063d18074739d0f99b532d1ca5`.
  - **An absent key under an unpinned version:** `engine/src/dataset.rs:398-404 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:0c332e98e697cdc051aeaafa04d1d371ee9a370cd9b0509787d30b8cf9bec644`.
  - **A format default the file's own bbox, covering statistics or sample contradicts** gives `engine.format_default_contradicted`, and a caller assertion still opens it: `engine/src/dataset.rs:1332-1351 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:8f8c292b12a27ffc248194f8d3072b1b632f5854b51c2fbde45fbd7cfc6a279a`.
  - **An assertion over a declaring file:** `engine/src/dataset.rs:406-415 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:774972317f3ffe035e2d6e346884989f40e9f77012d59609aa074a5311d3125b`.
  - **A caller-asserted non-x-first CRS, and a declared non-x-first CRS under an unpinned version,** give `engine.axis_order_unsupported` (the same dataset.rs:416-426 pin).
- **The axis section says:**
  - Nothing is normalized.
  - Refusal remains the resolved behaviour wherever no format rule applies (ADR-015 Amendment 1, items 1 and 2).
  - The §5 OPEN block is unanswered (item 7).
- **ADR status pins:**
  - ADR-015 Accepted: `docs/adr/ADR-015-source-crs-requirement-and-caller-assertion.md:3 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:a451dbb9379baa544aa726a0a3a84839c461187caa851a164889150dfeab5d77`.
  - ADR-015 Amendment 1: `docs/adr/ADR-015-source-crs-requirement-and-caller-assertion.md:155 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:a5061d197d7a9d2a565dd30514b49e115e097e7b80ecb038923159746d858648`.
  - ADR-032: `docs/adr/ADR-032-geoparquet-source-declaring-a-non-x-first-axis-order.md:5 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:f2b3d671f96caccbd98ebcf49b8167a6eedfc20125e3f22eaea605e650ba3ef1`.
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
- **Stale:** `engine/README.md:442-450 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:16f6bb1d89e77994d64ba9eaa0002aa82ad98f77424c59f3e88e7aa520531c4a`.
- **Facts:**
  - The session-tier arm: `engine/src/dataset.rs:1730-1756 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:c463f6c9fc7bc81ed1676ceea9d918c4e4b8799ea94cad7ef8ad1f427e02202a`.
  - A declared missing column still refuses: `engine/src/dataset.rs:1744-1750 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:310e0fecdecd10d80a6b9a3249a1dc8b5b2e99ccc66267d9e2ddd6cd424148f2`.
  - A directory source is refused by name, before anything is read: `engine/src/dataset.rs:319-327 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:a2f4bac2379da21f4080168616428bb0058620d1f5b4c7458c20b4d90d7e0c6a`.
  - The `SessionOrdinal` variant: `engine/src/identity.rs:42-55 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:00566800aa4601b171ddaa41a0e573f94811a3d340ae0f434ac232f36b9c5cd7`.
  - ADR-016 Accepted: `docs/adr/ADR-016-stable-feature-identity-admission.md:3 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:586a0671f5196957abbc53b0f26bfdd5a18d50a5f382801e30154b61c1cf143f`.
  - ADR-016 Amendment 1: `docs/adr/ADR-016-stable-feature-identity-admission.md:180 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:8f94f2d6ca945be6f3d213b793e153c6724eb9a61a7a273271a4767684bac1e8`.
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
- **Stale:** `engine/README.md:366-369 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:e0b3022ec36acdc0a237fa20ba6e40d09b774115fd33562b18e670e38cad4490`.
- **Facts:**
  - The admitted set: `engine/src/attributes.rs:78-101 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:e5a15ae577113abc4ba1da4142a921a5102f0f48a45e06a7c1ca8a1e717a0572`.
  - The set no longer coincides with the bundle restriction: `engine/src/attributes.rs:45-48 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:6c227ae2e82d3abf054cf06f8c9e864e1e2261e5bde113372d13598fc4c701f9`.
  - Publish preflight refuses `Float32` and dictionaries: `kernel/src/publish/mod.rs:414-447 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:bc630d0a00ed356a6e78e9c8c48cbb13a152057056937b6b39940c4243cda0d4`.
- **Says:**
  - The admitted types, enumerated from that match.
  - A dictionary is admitted when its value type is, and is emitted as that value type.
  - Only publish preflight refuses `Float32` and dictionaries, as a restriction of the bundle format.
- **Tests:**
  - `engine/src/attributes.rs::tests::the_live_admissible_set_admits_float32_and_a_dictionary_over_an_admitted_value_type`;
  - `kernel/tests/skp_projection.rs::publish_refuses_float32_and_dictionary_columns_at_preflight_as_a_bundle_format_restriction_with_todays_text`.

**D6 — scope line and summary table.**
- **Stale:**
  - `engine/README.md:3-5 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:1c69b0e50dd819414c731273b001edf623218c2aa9dc91c97ec2580bdc1f8f6c`;
  - `engine/README.md:16 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:ab59db8ddede34a935c4a062715bfb4d4f8b1d70bb0e1903cc9facea7633da9b`.
- **Facts:**
  - Five encodings, fixed at open: `engine/src/lib.rs:17-28 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:7c8c7453466b087f4d1f93609ee5eb7c954745a6f34a640a5204bf9b0ead0edf`.
  - The live projected stream: `engine/src/stream.rs:991-999 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:4c5021e2d95f9ada7f0b786cbd221b7de7a82bfe19f8635e49664acf1f0c4f5a`.
  - ADR-034 Accepted: `docs/adr/ADR-034-geometry-type-admission-and-geoarrow-encoding-selection.md:3 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:c590f50370ed606ecbe75dec729650542014249ad56b94fa7592d92471609989`.
- **Says:**
  - Five GeoArrow encodings, selected at open.
  - A declared projection on both the publish stream and the live projected stream. ADR-023 stays Proposed.
- **Tests:** `engine/tests/geometry_admission.rs::a_declared_set_selects_the_encoding_or_is_refused_at_open`, `engine/tests/live_projection.rs::a_live_projected_stream_emits_id_geometry_then_the_declared_columns`.

**D7 — the spatial index called untouched.**
- **Stale:**
  - `engine/README.md:76 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:231e070f5ba131f6fc312424f922c747170c2a478cd5d3e530254147d7eec2ec`;
  - `engine/src/lib.rs:15-16 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:ac7c13b37625230c8a09d34d1fb6ba100be226eca0de723c7dc5d680e4903b4e`.
- **Facts:**
  - The index module's own scope statement: `engine/src/index.rs:4-5 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:e30d62ae18cb7a855b8ace22c4cab460612bf6504618fd3faac89aa570c607ed`.
  - The README's index section: `engine/README.md:176-179 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:0ab3a84a1c27f19329b4cd791e57f71e47c5f17bf85499465a62b78b2af5739b`.
  - The index is not in the default planner: `engine/README.md:104-108 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:f3eebcbec6853fca66cfaaeb551c751ce91875efeec1703d46b7a5857ea09de9`.
- **Says:** it is built and tested, it is not in the product planner, and the gate is closed for this slice's shape only, pointing to the README section.
- **Tests:** `engine/tests/spatial_index.rs::an_indexed_query_returns_exactly_what_the_scan_returns`, `engine/tests/planner_seam.rs::the_product_planner_never_reaches_the_index_seam`.

**D8 — accepted ADRs and amendments called Proposed.** Each site is rewritten under 2.0 (c), (d) and (f).
- **Sites:**
  - `engine/src/identity.rs:5 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:4854683fc9b9fe7cd1e94a4a0902fd19ca381f37e09bfc21404ae7400f33b06c`
  - `engine/src/identity.rs:43 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:b10272a4a48b9f74069767dcccd7b88f2bde0f02506c4a44bdc4d4bcd139e60c`
  - `engine/src/identity.rs:65-66 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:d5e4c9943743126ebe2244e54507dc85e319addcd6ab9bf88df3f0b6097edd29`
  - `engine/src/identity.rs:119-121 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:067732271c3e4613ff25bc98f39321edeec18625d043b951659d8561c1ac59e0`
  - `engine/src/crs.rs:9-14 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:83778d38394710a884d111c41862e3877035776ee889029f2fafb41d2101ffd6`
  - `engine/src/geoparquet.rs:75-76 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:9a93c1306861242236a6ed1ae1ddc1aca39a6de991193e233cdaf20f80f0110c`
  - `engine/src/geoparquet.rs:152 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:d87c048738d7d0d84497805e69d0d30181cd0a5c57a4332716fe900f9487bc79`
  - `engine/src/geoparquet.rs:236-237 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:82101ef8b4b32dab156f4fabde0277c7a2f594520b457fcd1db5db2780e274d1`
  - `engine/src/geoparquet.rs:587-588 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:729476178af6c0476a78b4a1b4b4f3cbc7bc8c3f668e5256a0910e74002a8925`
  - `engine/src/geoparquet.rs:742 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:11efc347a83e4e5a5ad4ca362fa0d854d942641cf18552e51aa86eb5f5c53373`
  - `engine/src/geoparquet.rs:803 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:d31c69cee6080c2517d8f22bdfb5c3e18756a0b719fea79806e0dcd8920395c5`
  - `engine/src/dataset.rs:1017 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:16bd0110ca63df8737971e00362f012296a16b7667730b54aa198ebacdcd797e`
  - `engine/src/dataset.rs:1731 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:21aae5e2bf9d24ae2483ba043d589ce5901058b0caad354478e1c88d7819f896`
  - `engine/src/envelope.rs:146 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:80fad2b31ddba52a99ee1c7a34991859ce9b696d1abb198392da8fc264361505`
  - `engine/src/envelope.rs:179-180 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:df917997ddd6d47e32fd5e90931e19a5f4b4b0071921f88dbd31cb05b137bcd9`
  - `kernel/src/bundle/mod.rs:4-5 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:326ffd2242af40b44a87cc066ea0ada0eeeb8975e8a4bb9fc501251ee70e4552`
  - The README statuses `engine/README.md:77-79 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:6a7cf19338bded82a1764441f28ebef6f06783cc2e6092dbfa2923b7bdf27d25`; lines :29, :438, :443 and :462 are covered by rows D1 and D2.
- **Status pins:**
  - `docs/adr/ADR-013-typed-coordinate-spaces-and-provenance.md:3 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:dd824c231171f40e720dcbc7e5a3d550d1bbf8255921977a84c33136ba0af2a6`
  - `docs/adr/ADR-013-typed-coordinate-spaces-and-provenance.md:265 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:ee28435bc76cdf9eac83095883e0f74e433377f541c50ef043e9e5afb28ef55b`
  - `docs/adr/ADR-013-typed-coordinate-spaces-and-provenance.md:318 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:b69b06d722067c7b1010c6b794f30b8b0fd05150b86ce09519eeb8201798006f`
  - `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:3 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:8c9822210bc7600ee0299bd86b3e63102002637ce738f62ff27a0eb2303e4db3`
  - and the ADR-015 and ADR-016 pins above.
- **The "No provenance column" text (README :77-79):**
  - ADR-013 is Accepted. Granularity was ruled per-feature at acceptance (`docs/adr/ADR-013-typed-coordinate-spaces-and-provenance.md:248-251 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:4cd815f32c15890331fca4a257c07c37c68deb3c1cdecd2a2cc2e53ae57ad1bc`).
  - Column shape is deferred (`docs/adr/ADR-013-typed-coordinate-spaces-and-provenance.md:257-258 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:ed4bc42705604b83779f5a6ebe257bd82a9cef0a55cea3f0d9cedf6b997def8c`).
  - This module writes no provenance column.
  - The clause saying nothing here creates derived coordinates stays only if the worker shows from `engine/src/lod.rs` that tier vertices are a subset of source vertices. Otherwise it is dropped, and the text says the tiers are derived and non-authoritative. No ADR-013 applicability to tiers is asserted either way.

**D9 — CANCELLATION-AND-TRACING §6.**
- **Stale:** `kernel/CANCELLATION-AND-TRACING.md:161-167 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:59f25349e71041a05b8d719949d1fb4074e178bdea06c2cd526a20822e6dbf44`.
- **Facts:**
  - ADR-017 Corrigendum 4: `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:1044-1048 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:6768eefde13a241cefc7e3e6a0140899f2e6cdcd204522377e3faa74267682af`.
  - ADR-018's Status line: `docs/adr/ADR-018-what-cancellation-acknowledged-means.md:3 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:6d99101abbecf6521406ec3e88895a99a6436df05d0058fa3a8d025dc9bd4d1d`.
  - The document's discipline of appending corrections: `kernel/CANCELLATION-AND-TRACING.md:219-221 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:269335a22b782d0a62988aec317463698122b6235df3264ef55cdea19b72bac0`.
- **The change:** an appended section 9, see 2.2. It covers items 1 and 2 only.

**D10 — publish order of operations.**
- **Stale:** `kernel/src/publish/mod.rs:44-56 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:2a347fe74984c92580952a910b8b31e0a6ea2587b7b45c0773ecf56a8c45c2ac`.
- **Facts:**
  - `preflight_pinless` and its reordering: `kernel/src/publish/mod.rs:573-598 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:adaf82432d48862e8cc1f5d0af3d9618803f9b1de0258f5a99781bf9f714fcb8`.
  - `publish_unguarded` runs `preflight` first: `kernel/src/publish/mod.rs:605-611 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:84a73958206437ac1b073583cc19c102e92fabb366a774d7d489c9a88f3959c3`.
  - Destination check, then staging: `kernel/src/publish/mod.rs:628-634 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:3e1b3855b6fa69b00da1fc9ff0a565a92c82d95085ef7075521593b05d4e2f13`.
  - The run states it itself: `kernel/src/publish/mod.rs:696 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:ac579ad68633d6602618314e08e1023ca74154b752a843a90d3dcb2fbd02d538`.
  - The boundary's order: `kernel/src/permission/boundary.rs:9-19 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:b616a511981b1367ea41d8f1dda6b02472299db08e284a2e98016d056149e4ca`.
- **Says:** the steps in the order the code runs them at B. The worker derives the order from `run_inner` and pins each step in the PR body.
- **Tests:** `kernel/tests/publish.rs::a_row_predicate_is_refused_before_any_staging_directory_exists`, `kernel/tests/publish.rs::the_refusal_is_in_preflight_itself_not_only_reachable_through_publish_unguarded`.

**DX — extra files (exposure, and the name map).**
- **Stale:**
  - `kernel/src/permission/mod.rs:21-24 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:d774be119f8c55ad6efc1f620016b968877b792d998a78f6af14160c81fef6a4`;
  - `kernel/src/permission/boundary.rs:26-29 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:0a608eee822eba37f8e65258cbd8b88536b54c030eff1cd9d54a6c4d841c97c6`;
  - `kernel/src/lib.rs:37-43 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:36ea141b986c928ecf7f50cb56a2fc233b8f65be1feb9772ec37e4ef3682a7f4`;
  - `kernel/src/lib.rs:48-49 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:e9b63251fb450c3020a5a490b35a5383740969457ee6f0bb847a36fede267d51`.
- **Facts:**
  - `frontends/shell/src-tauri/src/commands.rs:265 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:379d668624a54f04dbc476ce53e7c50f070560c363a29966898a2c70ccc4e0a7`;
  - `frontends/shell/src-tauri/src/commands.rs:402 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:72d384067b676aebdefbcfaddce904d69ee9d017b28426a65fa2e3b9c756f30d`;
  - `frontends/shell/src-tauri/src/publish.rs:831 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:1e4c8c8d1a3ffa4f72885fb1eb757a82215ecbfc122730be0c31b864ad0dffde`;
  - the C8 bullet: `kernel/README.md:237-241 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:cf5c6d24fa4bef4b588070acde755149fc387564371f0aa67b37c2d16513902b`;
  - the exposure review completion: `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:1134-1142 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:b3e3a630c64e504061231df63ea6005bb3a4e38e486aa4427bbc0d1899b148e3`;
  - runtime opens into the catalog: `kernel/src/skp.rs:1174-1176 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:93f5dd4102eecfef3b126d4c9562f19b63b2c2629abbdfe3c53d967df2545541`;
  - the README's catalog bullet: `kernel/README.md:16-19 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:68276f04337844b2fa0e1fe5c3ef8ba35cebe119a13721586db5f5ca8b14cb90`.
- **Says:** C8's position and nothing more.
  - The shell's `binding_publish_*` commands reach `boundary::execute`. That is the UI surface the acceptance condition was discharged for.
  - `publish-bundle` remains developer/test tooling.
  - SKP, MCP, plugin, notebook and AI exposure each still need their own review.
  - The rotation ceiling bounds the log (`MAX_AUDIT_LOG_BYTES`, `MAX_AUDIT_LOG_GENERATIONS`).
  - Names are opened at startup or at runtime through `open_dataset`.
- **Not:** any claim about whether any caller is unauthorized; any surface reviewed beyond the UI.
- **Tests:** `kernel/tests/catalog_replace.rs::replacing_a_name_through_open_cancellable_serves_the_new_dataset_and_drops_the_old_one_before_it_returns`; the shell test `a_successful_publish_is_audited_with_the_shell_dialog_route_and_a_fresh_log_per_attempt` in `frontends/shell/src-tauri/src/publish.rs`.

**DE5 — area E finding 5.**
- **Stale:** `engine/src/geoparquet.rs:867-872 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:5b437241a0ffe6e373e29c1c66176d46f59cf6f4c00e12a88052d62ed3fedee6`.
- **The change:** the test is renamed `an_absent_crs_key_is_not_a_declaration`. It pairs with its sibling `an_explicit_null_crs_is_not_a_declaration_either`.
- **The comment says:** the parse records no declaration, and the format's default is applied at admission under a pinned version (the module comment, `engine/src/geoparquet.rs:16-23 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:4ba156f30559459630b529881677299becb50b871030fd735a7160d9fa1c9cde`).
- **The assertion is unchanged.**

**DK — earlier items.**
- **The kernel module doc's scope and only-place statements:**
  - Stale: `kernel/src/lib.rs:6-11 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:b3f21d4d0904d582fd47e7047ecf3da16b14ace88c8c9e48af31d4746dd5be2e`.
  - The rewrite follows `kernel/README.md:3-6 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:62765f10bc52c6498e37e9a4e8e776dfa1c82b19d754c10ee6a335cee4607814` and `kernel/README.md:8-12 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:05adc8d21d0b6d8fdc9645dcf5146112aab786b3bad1be549c8923a2482ac54c`.
- **N1, the exposure position:**
  - The module doc: `kernel/src/lib.rs:37-43` (row DX).
  - kernel/PERMISSION-BOUNDARY.md takes an appended note (see 2.2). The stale body is `kernel/PERMISSION-BOUNDARY.md:15-17 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:766948f6aec655b933048decf671f3866820513a6124637ed15a4b4f1b212099`, and its own not-rewritten header is `kernel/PERMISSION-BOUNDARY.md:3-9 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:f63081a44ab88e98bb03bc073338141b8716b3394bda6811f65358a1628d7adc`.
- **N2, the pointer:** `kernel/README.md:239 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:18b4b788d68aa92ff0354514221b8f178bb03eafdcfa69c644cee601c7cb25b7`. The parenthetical names commands.rs as the definition site and publish.rs as the route. The bullet's other words stay byte-identical.
- **Node 9 §3, an index line:**
  - The test pointer moves from `kernel/README.md:358 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:6672f872c56357cb986330f5f73312f4aa2df1389e24bcafbbafa0099b7a3d78` to `kernel/README.md:353 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:ce520a79ff0ab9d12d02d581eec36c57009ef2c675e4e401417eaf7fd0192d1b`.
  - The test calls only `StreamRegistry::cancel`: `kernel/src/skp.rs:3590-3597 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:fc3e0de63cc9af73f64c77922eb55da16d06ada8bd91dbfde2ab6dcbf7e53254`.
- **Node 9 §4, the TicketState sentence:**
  - The sentence: `kernel/README.md:177-179 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:96475332300218a30378f24c5f46a8e47dccc15ddee4de9608ab7e0c05458150`.
  - It gains the not-covered qualifier of `kernel/src/skp.rs:170-176 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:f49ed48f0355e4466636a6862afea00359f9fb0be8d629125d494c5d18f1ebef`. No test pins the qualifier, so it is not called tested.

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

- **`engine/src/identity.rs:251-254 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:568ebc196f96189f89e427dd1a4f9f27cb6d2e8b6b7bcb4ca3c1974069a90d55`** names a test that `stale-test-names-and-comments` renames later.
  - At B that name is current, and the instrument-accessor exemption (round 5, item 4) needs the doc to name the test that calls it.
  - This piece does not edit these lines. Where the reference goes is OPEN-1.
- **`kernel/tests/end_to_end.rs:386`'s name stays,** by round 52, item 3 (`state/directives/2026-10-04-round-52-open-3-ruling.md:6-8 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:cfd41252685ead46402f79e7078d3bdcc9cfb87c00dc96098be093f9cab7e08d`). `docs/07_Roadmap.md:21 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:7be5cd1b600e2575527d64e8b297dc69fa789dd24046564a22ba7ade9a14d6d3` cites it. No node carries a rename.

### 2.4 Owner's-index update

lead-data writes it before the final gate (pilot §1 item 2), and the worker applies it in this PR.
- **kernel/README.md:**
  - Stream tickets and Close ordering (row DK);
  - Governed by, preregistrations in this module, which gains this form (`kernel/README.md:376 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:6d1db6c631cde79a42462d7bb5b3cbe8b788ce3fcc454e3ba9fce2cfef1af16e`).
- **engine/README.md:** engine halves of pieces filed elsewhere, which gains this form (`engine/README.md:521 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:506e5373475ef54b35ea35dea8176bd0c9e1fe698905fc9b1329cd4f4a662980`).
- **Not touched:**
  - engine/README.md lines 499, 510 and 519, as #206 leaves them;
  - either Last verified at line, unless lead-data re-checks every pointer in that section.

### 2.5 Conditional rows (OPEN-2; applied only on the answer)

- **In the node's files:**
  - `engine/src/lib.rs:6-8 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:8f78c935808ecb3388c5c58b8c39914dd0b56ccca52fa4048d82ba3542b3a219` (the same claim as D6)
  - `engine/src/lib.rs:42-46 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:ed84a296183e94e7124ba321cae0c8bd0ed8e60e11822a619eb706bb531360a9` (as D8's README :77-79)
  - `engine/src/crs.rs:6-7 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:db241e13bb6cd0eb28961d3c218bc08ea71431571200e1efbbeec8ef2418a0b0`
  - `engine/src/crs.rs:41-42 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:c10080e4ed409a79d2fa32cf417263b3c2507a714b844ca23c6656677aa36a46`
  - `engine/src/crs.rs:46-47 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:83cb303319e02584c818ebd28c24f214ae1294cda87a963007392f31d2f8aeba` (A)
  - `engine/src/geoparquet.rs:246-249 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:ef61d72a605afd7499d353184ff88d434d3f03f214d65e5a42b82fc9943af706`
  - `engine/README.md:33-36 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:243c8fb02a8dcde52a9f992801965bf7e9404cebf5ef5b76e3722be191f7dcec` (A): the data's axis order now also comes from the format rule.
  - `kernel/src/lib.rs:36 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:1f45fc51f42f7cd1497ade66984c66469eff7082a5f78afc7f2a32208c396b4b` (A): the audit log writes, per `kernel/src/permission/audit/log.rs:133-149 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:9a66c8993188f514890107491c30443216e6e0dac14681c27c2a56b22326a3c4`.
- **A new file, under option (b) only:**
  - `engine/src/predicate.rs:128-129 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:7c84a67a06120832c8185b47b59e1ce0985fd986c67880f5b4836058b1086558` (A)
  - `engine/src/predicate.rs:287-288 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:4430908c1987a0cb506e585aafc40b0bef4fdda49697f4d0844f54c28b421d81` (A)
  - ADR-033 Accepted: `docs/adr/ADR-033-connection-lease-classes-for-admission-work.md:3 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:334694165d50e8b0f29581bfe1f6fd7c1467ce68057ace41e00d25425c105fb6`.
- **Never in this piece:** `kernel/src/skp.rs:417-420 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:7f5f7302f31e600af4bf88f044323f2a0db96774b56a363c6277960abb42b387`. It is recorded for `skp-v0-live-sections-current-area-c`, which edits skp.rs comments.

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
- Row D4 states no platform behaviour beyond the declared LOD root and its typed refusal (`state/directives/PORTABILITY-2026-09-30.md:15 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:ae42d57658911876b8d657528f9750e296c7dbb96c056360c685b8dc30be0efc`).
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
- **Briefs** carry `state/directives/2026-10-06-machine-script-adopted.md:12-22 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:7350977156bed7c94b0da4e8db806ba34c25c6678e65c46447a62d791ba9e8e1` for E2 to E5, and no other build rule.
- **Operator:** none. No walkthrough row and no sight.
- **KNOWN-LIMITATIONS:** no item is added or edited. Items 2, 3, 9, 31 and 33 bear on the same facts and stay as they are.
- **Budget:** 120 minutes.
- **The PR body asks for a merge commit.**

## §10. Amendments

Opens empty, append-only, classes 1 to 9.
