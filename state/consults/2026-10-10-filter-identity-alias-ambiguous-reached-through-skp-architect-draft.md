*Custodian's filing note (2026-10-10): the architect's draft of `filter-identity-alias-ambiguous-reached-through-skp`'s preregistration, on the custodian's brief at main d9bdc3a0, after lead-data's impact read (forms ahead). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 41d3e3d2c20dca661ce6bdb6e97660d118892ec498dcdfd8ad077c770f884e7a. Write audit PASS: zero write calls (Read 61, Grep 36, Glob 1, SubagentHandback 1). Run window from the transcript: 13:56:14Z to 14:07:13Z. Committed as a form after this filing, with the custodian's pins; its OPEN-1 ruled by the human at 18:58:06Z (`state/directives/2026-10-10-reaim-t2-base-f0fccfaf-filter-identity-no-shell-run-guidance-node.md`).*

---

Reviewed: main @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba

(Repository root C:\dev\spatial-ide. All paths below are relative to it.)

## 1. Form and gating, and what is the human's

- **The form is full, with full gating from dispatch** (`AUTONOMY.md` §21a, the wire category, and §25(e)). The piece edits `protocol/skp/SKP-V0.md`, which falls under `protocol/skp/**`, a path §21a names. So its `Out-of-scope` line could not say it touches none of the four categories, and no five-line form is committed for it.
- **Size:** at most 150 changed lines, tests included, across three counted files. That is under §21c's bound. The full form is required by the category, not by size.
- **No other §21a category is touched:**
  - no ADR is amended;
  - no security posture changes;
  - no guarantee changes;
  - no wire literal, field or fixture changes.
- **Where the form lives:** `kernel/FILTER-IDENTITY-ALIAS-AMBIGUOUS-THROUGH-SKP-PREREGISTRATION.md`. The test is a kernel test and the kernel mints the code. Keeping the form out of `protocol/` keeps this piece's `protocol/` footprint to the one spec file.
- **The human's:**
  - OPEN-1, whether the shell's rendering is proven by a run. The draft goes ahead on option (a) unless the human rules otherwise.
  - The merge click.
  - No red line is touched.

## 2. The draft

````markdown
# skp.filter_identity_alias_ambiguous reached through SKP, and the two texts that call it unreachable corrected
# (PLAN node filter-identity-alias-ambiguous-reached-through-skp)

File: kernel/FILTER-IDENTITY-ALIAS-AMBIGUOUS-THROUGH-SKP-PREREGISTRATION.md
Authority:
- the node: PLAN.yaml:4369-4385 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD
- the placement, slot 2 after the flush piece: state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:36 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD
- forms ahead: state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:38 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD
- the directive has a RULED block in DECISIONS-PENDING.md
- the finding: state/consults/DRIFT-SWEEP-AREA-C-2026-10-10.md:16-21 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD
- the custodian's check of it: state/consults/2026-10-10-drift-sweep-area-c-custodian-check.md:32-45 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD
- the check's answer to the human's area C instruction 1: state/consults/2026-10-10-drift-sweep-area-c-custodian-check.md:118-129 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD
- the sibling-search default: AUTONOMY.md:215 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD
Drafted by: the architect agent. Inputs:
- lead-data's impact read, state/consults/2026-10-10-filter-identity-alias-ambiguous-reached-through-skp-impact-read.md (whole-file sha256 4c5d3919ef66c31a0eb32a90d3390ed72e8051ad637971b283d2fdfcaf658268). It is an input, not Authority.
- the custodian's reuse-index output (0.7).
Code was read at main d9bdc3a0.
Committed before any code. No code starts before stream-flush-cancel-exit-marks-producer-cancelled has merged. Append-only once committed. An amendment made after any outcome has been seen says so in its first line.
Form: full (AUTONOMY.md §21a, the wire: an edit under protocol/skp/**; §25(e)). See 0.8.
Pins: every pin is a historical pin at d9bdc3a0.
- The flush piece edits engine/src/stream.rs, engine/src/trace.rs and engine/README.md. No pinned code line here moves before this piece.
- If skp-v0-live-sections-current-area-c lands first and moves §7.5's lines, the worker re-derives the paragraph by section.
- The pin stays authoritative for what it recorded. The tree is authoritative for the text the piece edits.

## §0. Disclosure

0.1 The route from the product to the refusal (the finding, re-derived at d9bdc3a0):
- open_dataset's identity is host-minted: kernel/src/skp.rs:1119 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD.
- It is minted with uniqueness always verified, because the wire has no skip field: kernel/src/skp.rs:1656-1668 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD.
- It is passed to the catalog: kernel/src/skp.rs:1174-1176 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD.
- The catalog passes it to the engine: kernel/src/lib.rs:202-219 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD.
- The engine makes it IdSource::Mapped: engine/src/dataset.rs:1714-1726 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD.
- The rule: engine/src/predicate.rs:1117-1129 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD. It tests only that a field named id is present, not its type: engine/src/predicate.rs:1120-1125 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD.
- The check runs first for each referenced name: engine/src/predicate.rs:1166-1174 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD.
- It runs before any lease or mint: kernel/src/skp.rs:1839-1842 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD.
- The wire mapping: kernel/src/skp.rs:2248-2258 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD.

0.2 What pins it today.
- The only pin is a kernel unit test that builds the variant and maps it directly: kernel/src/skp.rs:2799-2810 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD.
- A grep of kernel/tests at d9bdc3a0 for skp.filter_ finds three codes: unknown_column, type_not_admitted and column_not_filterable. This code is not among them.
- The X3 case opens the alias shape through the catalog with skip_uniqueness_check set, and sends no filter: kernel/tests/skp_projection.rs:1217-1238 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD. It is not the wire route, and this piece does not use it.

0.3 The two texts that call the code unreachable:
- protocol/skp/SKP-V0.md:485-488 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD
- engine/src/predicate.rs:1111-1116 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD

0.4 The product sequence in the shell, by reading and not by a run.
- engine.identity_unusable opens the identity form: frontends/shell/src/admission/AdmissionPanel.tsx:25-29 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD.
- The form offers the 64-bit candidates and a free-text route: frontends/shell/src/admission/IdentityDeclarationForm.tsx:75-97 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD.
- The candidates are the Int64 and UInt64 columns only: engine/src/identity.rs:297-313 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD.
- The shell's Tauri commands call SkpHost::open_dataset and SkpHost::viewport_query with the wire's typed requests:
  - frontends/shell/src-tauri/src/commands.rs:57-65 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD
  - frontends/shell/src-tauri/src/commands.rs:87-95 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD
- A refused filter is formatted generically (frontends/shell/src/App.tsx:317 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD) and rendered by RefusalBlock (frontends/shell/src/filter/FilterPanel.tsx:132-134 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD; frontends/shell/src/admission/RefusalBlock.tsx:24-43 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD).
- There is no code-specific guidance for this code: frontends/shell/src/admission/formatRefusal.ts:144-145 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD.

0.5 Governing ADRs (both Accepted), cited and not amended:
- ADR-016 §3, the declared mapping: docs/adr/ADR-016-stable-feature-identity-admission.md:64-69 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD
- ADR-021, the Related line tying the alias refusal to §3's Mapped identity: docs/adr/ADR-021-row-filter-on-viewport-query.md:22-24 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD
- ADR-021 decision 5: docs/adr/ADR-021-row-filter-on-viewport-query.md:71-74 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD
- ADR-021 decision 8: docs/adr/ADR-021-row-filter-on-viewport-query.md:93-99 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD
- ADR-004's control plane carries the refusal. Nothing on the data plane changes.

0.6 Hypothesis, labelled. The claim that the code became reachable with the admission-remediation cut rests on two things, not on a run at that commit:
- the cut record: state/cut-archive/CUT-STATE-admission-remediation.md:1 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD;
- the check's commit reading (0 Authority, the check's finding 2).
The discriminator would be a run of T-1 at 16091f9. It is not made, and §1 does not claim it.

0.7 Reuse index (the human's standing step). The custodian's node tools/reuse.mjs at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c recorded no prior art for identity alias, ambiguous column, typed refusal or filter refusal. Noted, not blocking.

0.8 Gating route. The edit to protocol/skp/SKP-V0.md is in §21a's wire category (AUTONOMY.md:323-324 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD). So the full form and both gates apply from dispatch (AUTONOMY.md:482 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD). The size (§7) is under §21c's bound.

0.9 Budget. The node declares 60 minutes. If the full form and two gates exceed that, the custodian records the deviation in PLAN. It is not a §7 figure.

0.10 Fixture drive: no measurement, and the 5 GB fixture is not used.

## §1. May and may not claim

- May claim, by T-1 and its mutations:
  - Through SkpHost, the same two methods the shell's commands call (0.4), a declared identity on open_dataset over a file that carries its own id column yields a Mapped identity.
  - On that dataset, a viewport_query filter naming id is refused synchronously as skp.filter_identity_alias_ambiguous, with exactly the fields column = id and source_column = the declared column. No ticket is minted.
  - M-1 and M-2 as observed.
- May claim, by reading the code: the rule tests the presence of a field named id, whatever its type (0.1).
- May claim, as a record fact (0.6): the code became reachable when the admission-remediation cut threaded open_dataset's identity into the engine.
- May not claim:
  - that the shell's rendering of this refusal was run. It stays by reading (0.4; OPEN-1).
  - anything about an e2e or walkthrough step;
  - any other code's reachability or coverage (§2.5);
  - any performance figure or docs/08 row;
  - any change to the engine's message, which is unchanged: engine/src/predicate.rs:338-343 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD;
  - a reachability date or commit beyond 0.6.
- No ADR is amended. There is no wire literal or field change, no protocol fixture, no §8 change-log entry and no version bump. There is no user-visible string, no new pub item and no dependency.

## §2. The change

2.1 kernel/tests/skp_admission_remediation.rs: one new test, T-1 (§4). No product code changes.

2.2 protocol/skp/SKP-V0.md, §7.5: the paragraph at 0.3 is replaced in place. This follows the human's in-place pattern for a live section that is false against the code (state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:30 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD). §§1–7 are the live description (protocol/skp/SKP-V0.md:543-546 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD).
- The rejected alternative is an appended correction that leaves the false sentence standing, as in §7.2's precedent (protocol/skp/SKP-V0.md:382-394 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD). The live section would then go on stating something false.
- The declared text is this form's own. <T-1> is T-1's final name, and <date> is the commit's date:

```
`skp.filter_identity_alias_ambiguous` is refused when the dataset's identity is mapped from a
column other than `id` (ADR-016 §3; `open_dataset`'s `identity`, §1) and the file also carries its
own column named `id`, whatever that column's type: a predicate naming `id` cannot say whether it
means the wire identity or the file's column. Any client that declares an identity on
`open_dataset` for such a file reaches it; proven through the host by
`kernel/tests/skp_admission_remediation.rs::<T-1>`. *(Corrected <date>: this paragraph called the
code unreachable from any product entry point. That stopped being true when the
admission-remediation cut (`skp/0.2`) threaded `open_dataset`'s `identity` into the engine.)*
```

- Nothing else in SKP-V0.md changes. In particular, the §7.5 heading's count stays: the skp/0.8 dated note keeps it as it is (protocol/skp/SKP-V0.md:490-493 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD), and it is outside this node.

2.3 engine/src/predicate.rs: the honesty note at 0.3 is replaced inside identity_alias_ambiguity's doc comment. No code line changes. The new note has no intra-doc link to a kernel item and no path:line. Declared text:

```
/// **Reachable from the product** (corrected <date>). `open_dataset`'s `identity` reaches
/// `Dataset::open_cancellable` as a declared identity, which `admit_identity` makes
/// `IdSource::Mapped`; on a file that also carries its own `id` column, a predicate naming `id` is
/// refused here. Proven through SKP by `kernel/tests/skp_admission_remediation.rs::<T-1>`. The note
/// this replaces said no product entry point constructed a `Mapped` identity; that stopped being
/// true when the admission-remediation cut threaded `open_dataset`'s `identity` into the engine.
```

2.4 Sibling search (AUTONOMY.md:215).
- The defect class: a text in the product tree that calls an SKP code or an engine refusal unreachable from the product while a product route reaches it.
- How it was searched: by grep at d9bdc3a0 over engine/, kernel/, protocol/ and frontends/shell/src, for the unreachable, never-fires and no-product-entry-point phrasings, with each hit read.

| Site | Class | Scope | Reason |
|---|---|---|---|
| protocol/skp/SKP-V0.md:485-488 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD | in | in (2.2) | the node |
| engine/src/predicate.rs:1111-1116 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD | in | in (2.3) | the node |
| kernel/src/skp.rs:2185-2193 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD (LodRefused, unreachable from the wire) | in | out: it holds | no build_tiers call in kernel/src, protocol or frontends/shell/src-tauri/src (grep at d9bdc3a0) |
| engine/src/attributes.rs:160-162 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD | not in | out | an ordering statement inside a function, not a reachability claim |

2.5 Observed, not in scope (not the same defect class, since no text calls them unreachable):
- eight skp.filter_* codes have no test under kernel/tests (0.2);
- the shell has no guidance string for this code (0.4), and wording is the human's at P6.
The custodian may record either as a proposed node. This piece adds neither.

2.6 The seam and the real shape.
- T-1 calls SkpHost::open_dataset with the wire's own IdentityDeclaration (protocol/skp/src/v0/commands.rs:55-59 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD). It then calls SkpHost::viewport_query with the wire's Filter. These are the calls the shell's commands make (0.4).
- It never uses Catalog::open_cancellable and never sets skip_uniqueness_check: that is the X3 route, which the wire cannot take.
- The diff adds no seam and no code.

2.7 The fixture, and the e2e re-aim (the node's question). T-1 does not need the re-aim's variant: main's generators already build the shape.
- IdentityMode::StringIds writes id as Utf8 (engine/src/fixture.rs:624 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD; values at engine/src/fixture.rs:1092 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD).
- AttributeMode::FilterWitness (engine/src/fixture.rs:196 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD) adds a UInt64 column, u64, valued from FILTER_WITNESS_U64 (engine/src/fixture.rs:238 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD; written at engine/src/fixture.rs:1144 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD).
- At two features, u64 holds 0 and 1: unique, non-negative and a 64-bit candidate. So it passes admit_column_type (engine/src/identity.rs:322-344 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD) and the value checks (engine/src/dataset.rs:1816-1838 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD).
- This is the product shape: an unusable id beside a usable key. The plain open refuses with the code that opens the shell's identity form (0.4).
- engine/src/fixture.rs is not edited. The re-aim declares every existing variant's bytes unchanged (frontends/shell/e2e/E2E-STALE-EXPECTATIONS-REAIM-PREREGISTRATION.md:302 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD).
- This piece's code does not wait for the re-aim. Only OPEN-1 (c) would make it wait.

2.8 The shell. No shell file changes. The rendering stays by reading (0.4). Whether it is proven by a run is OPEN-1, and this form proceeds on (a).

2.9 Portability (state/directives/PORTABILITY-2026-09-30.md:33-65 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD).
- R1: identity and filter admission semantics are platform-independent, and T-1 has no platform dependence. Its fixture path is joined from CARGO_MANIFEST_DIR, as its siblings' is.
- R2 to R4: no OS-dependent feature and no OS cfg. R3 is not triggered.
- R5: no level is claimed.
- R6: nothing is ignored.

## §3. Fixtures

| Fixture | Shape (predicted) | Outcome predicted before the run |
|---|---|---|
| F-1 alias-ambiguous.parquet, written per run under target/fixtures/admission-remediation by write_geoparquet with FixtureSpec { identity: StringIds, attributes: FilterWitness, features: 2, avg_vertices: 6, hole_every: 0, ..Default } | id Utf8 (key-0, key-1); bbox; the FilterWitness columns, u64 among them (0, 1); geometry; declared LV95 | plain open: refused engine.identity_unusable, column id, candidate_columns containing u64 · declared open on u64: admitted, describe identity.source mapped:u64 · filter id = 'key-1': refused skp.filter_identity_alias_ambiguous {column: id, source_column: u64}, zero tickets |

- F-1 is regenerated per run and not hashed, as its siblings in the same file are (kernel/tests/skp_admission_remediation.rs:37-41 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD).

## §4. Tests and mutations

Every mutation is observed by applying it, running the named command, recording the failure by name with the commit it was observed at, and reverting it. A verify-mutation run is never called an observation (round 25, item 2 (c)).

- **T-1, in kernel/tests/skp_admission_remediation.rs.** Proposed name: `a_declared_identity_beside_the_files_own_id_refuses_a_filter_naming_id_as_ambiguous`. It is `#[tokio::test(flavor = "multi_thread")]`, as the filter-refusal sibling is (kernel/tests/skp_admission.rs:563-605 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD).
  - It builds an SkpHost over a fresh Catalog, holding a clone of its StreamRegistry.
  - (i) open_dataset on F-1 with identity null: expect_err. It asserts code engine.identity_unusable, field column = id, and that candidate_columns, split on commas, contains u64.
  - (ii) open_dataset on F-1 with identity { column: u64 }: expect. describe gives identity.source mapped:u64.
  - (iii) viewport_query on that handle, with bbox, bbox_crs, limit and columns null and filter `id = 'key-1'` in duckdb-expr/0: expect_err. It asserts code skp.filter_identity_alias_ambiguous, and that the fields map has exactly the keys column (= id) and source_column (= u64), as §7.5's row (protocol/skp/SKP-V0.md:479 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD).
  - (iv) cancel_all_for_dataset(handle) returns 0.
  - The predicate is one that the namespace, bind and type stages would admit without the alias rule (a Utf8 column against a text literal). So step (iii)'s refusal can only come from the rule.
  - Its doc records M-1 and M-2 by symbol, each with its observed commit id. There is no path:line in it.
  - **M-1 (the rule):** identity_alias_ambiguity's body returns None. Run `cargo test -p spatial-kernel --test skp_admission_remediation a_declared_identity_beside`. Predicted: T-1 fails by name at (iii)'s expect_err, because the predicate is admitted.
  - **M-2 (the wire identity):** in SkpHost::open_dataset, the identity is replaced by None in place of host_minted_identity_declaration's result. Same command. Predicted: T-1 fails by name at (ii)'s expect, because the declared open refuses engine.identity_unusable on id.
- **Changed tests: none.** The kernel unit test (0.2) and the engines' exhaustive code maps are unchanged. No sleep, retry or timeout is added.

## §5. Predictions · unchanged · invalidators · falsification

Predictions:
- P-1: T-1 passes at H with no product code changed: the code fires on main today.
- P-2: M-1 and M-2 each fail T-1 by name at the step §4 names.
- P-3: every suite in §9 passes unchanged, in CI on both platforms.

Declared unchanged:
- every product line, including all of engine/src/predicate.rs except identity_alias_ambiguity's doc comment;
- the engine message (§1);
- kernel/src/**, protocol/skp/src/**, protocol/skp/tests/**, the literal skp/0.11;
- SKP-V0.md outside §7.5's paragraph;
- engine/src/fixture.rs, frontends/**, KNOWN-LIMITATIONS.md;
- every ADR;
- no pub item, dependency, OS cfg, ignore or Cargo change.

Invalidators (stop, return to the architect, record class 2):
- the generator refuses F-1's spec;
- step (i) or (ii) does not give its predicted outcome;
- M-1 or M-2 does not fail T-1.

Falsification: step (iii) does not refuse with this code at H. The finding would then be wrong, and the two texts possibly true. Stop, and the human is told before anything is edited.

## §6. Instruments

- T-1's assertions are structural: a typed outcome, a field set and a ticket count.
- No measurement and no docs/08 row.

## §7. Declared values and ceilings

- At most 150 changed lines by §21c's rule across three files: kernel/tests/skp_admission_remediation.rs, engine/src/predicate.rs and protocol/skp/SKP-V0.md.
  - Count with `git diff --numstat B H -- kernel/tests/skp_admission_remediation.rs engine/src/predicate.rs protocol/skp/SKP-V0.md`, where B = `git merge-base origin/main H`, named in the PR body.
  - At most 110 in the test file.
  - At most 20 in engine/src/predicate.rs, all inside identity_alias_ambiguity's doc comment.
  - At most 20 in SKP-V0.md, all inside §7.5's paragraph.
- Non-generated files: at most 7. They are this form, PLAN.yaml, the three files above, engine/README.md and kernel/README.md. The two READMEs carry the owner's-index update only and are outside the line count.
- No constant is added. F-1's two features is a test value.
- An overrun is class 8, and this section is never edited.

## §8. Block-on-sight

1. Any code before this form is committed with the custodian's hashes, or before stream-flush-cancel-exit-marks-producer-cancelled has merged.
2. Any product code change: engine/src/** beyond 2.3's doc comment, kernel/src/**, protocol/skp/src/**, frontends/**.
3. Any change to the engine's message, the wire literal, a protocol fixture, §8 of SKP-V0.md, or any user-visible string.
4. An edit to engine/src/fixture.rs, or a test that depends on the re-aim's variant.
5. T-1 reaching the engine by any route other than SkpHost::open_dataset with the wire's IdentityDeclaration and SkpHost::viewport_query. This includes Catalog::open_cancellable and skip_uniqueness_check (the imagined-interface rule).
6. SKP-V0.md edited outside §7.5's paragraph, the heading's count included.
7. A corrected text claiming more than §1 allows.
8. A path:line cite in a code comment, or an intra-doc link from engine/ to a kernel item.
9. A new pub item, dependency, OS cfg, ignore, sleep, retry or timeout.
10. The round-25 items, by name:
    - a §7 overrun not recorded as class 8, or §7 edited to match;
    - a scope addition not recorded as class 9, or its code before its amendment;
    - a verify-mutation run called a mutation's observation;
    - a test-text span on an unmerged branch pinned by hash at a branch commit, or named without its commit id.

## §9. Gates

- **Architect and reviewer (§21a; §25(e)).**
  - Verdicts follow state/directives/2026-10-05-product-first-direction.md:15 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD.
  - They block only on Correctness or Evidence. Documentation findings are fixed in this PR before the merge.
- **Architect:**
  - the two corrected texts against 0.1 and §1;
  - ADR-016 §3 and ADR-021 decisions 5 and 8;
  - the seam (2.6);
  - §2.4's sibling rows;
  - §8 item by item.
- **Reviewer:**
  - the full diff;
  - M-1 and M-2, each observed with its commit id;
  - the §7 count;
  - the owner's-index update against the diff.
- **Suites:**
  - `cargo test -p spatial-kernel --test skp_admission_remediation`;
  - `cargo test -p spatial-kernel --lib`;
  - `cargo test -p spatial-engine --test predicate_admission --test filter_type_admission`;
  - `cargo doc -p spatial-engine --no-deps` with no new warning;
  - `cargo fmt --all --check`;
  - the workspace, by CI on both platforms;
  - the node --test scripts suite, verify-plan, verify-cites, verify-quotes and verify-test-claims.
- **Heavy runs** follow the machine paragraph the briefs carry (state/directives/2026-10-06-machine-script-adopted.md:12-22 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD).
  - Counts are set in advance: the suites once each at H; M-1 once; M-2 once.
  - No e2e run and no timed measurement.
- **Merge:** a merge commit, never a squash.
- **Operator:** none (OPEN-1 (c) would add a row).
- **Owner's-index update before the final gate** (state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md:12 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD). lead-data writes it, the worker applies it in this PR, and the final review checks it against the diff.
  - kernel/README.md, Owner's index:
    - Interfaces this module owns, the wire error codes entry (kernel/README.md:359 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD): T-1 joins its pins;
    - Governed by, preregistrations in this module (kernel/README.md:376 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD): this form;
    - Last verified at.
  - engine/README.md, Owner's index:
    - Interfaces this module owns, the filter admission entry (engine/README.md:504 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD): T-1 joins its pins;
    - Governed by, engine halves of pieces filed elsewhere (engine/README.md:521 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD): this form;
    - Last verified at.
  - This sits on top of the flush piece's engine entry.
- **KNOWN-LIMITATIONS:** no item is owed. The refusal is ADR-021 decision 8's designed, typed behaviour, and its message names the cause. No item states otherwise. Item 3 (KNOWN-LIMITATIONS.md:60-66 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD) is in the re-aim's scope and is not touched.
- **Overlap, rule (00).** The paths are those in §7. This piece touches protocol/ (protocol/skp/SKP-V0.md).
  - At dispatch, the custodian checks that no in-progress piece and no PR awaiting merge touches protocol/, engine/src/predicate.rs, kernel/tests/skp_admission_remediation.rs or either README's owner's index.
  - skp-v0-live-sections-current-area-c also edits SKP-V0.md. It starts only while no other piece or open PR touches protocol/ (state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:27 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD), and it excludes finding 2's texts (PLAN.yaml:4420 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD). The two run in sequence, never together, and their paragraphs are disjoint.
  - crs-undeclared-message-wording depends on this piece (PLAN.yaml:4484 @ d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba sha256:HASH-TBD). Its possible protocol/ path, protocol/skp/tests/data/v0-error-example.json, is not touched here.
  - module-docs-stale-statements (docs lane) edits both READMEs' bodies. The same files carry this piece's index update, so the two are sequenced.
  - Slot 1's e2e-stale-expectations-reaim holds engine/src/fixture.rs, kernel/tests/manual_walkthrough_fixtures.rs, the e2e files and KNOWN-LIMITATIONS item 3. This piece edits none of them and reads fixture.rs only.

## §10. Amendments

(opens empty)
````

## 3. OPEN items

**OPEN-1: is the shell's rendering of this refusal proven by a run?** The impact read's question 3 asks this.

- **(a) Recommended: no.** The piece proves the refusal in the kernel, through SkpHost only, and the form says the shell rendering stays by reading.
  - The shell has no branch specific to this code. formatRefusal returns no guidance for it, and RefusalBlock renders whatever code it is given.
  - So a shell test would prove the same generic path that `frontends/shell/e2e/filter-panel.mjs:227` already runs with another code.
  - Cost: none. Ordering: none.
- **(b) Add a vitest unit test** that renders FilterPanel with this code's SkpError, mocked.
  - It adds one path under `frontends/shell/src/` and about 30 lines.
  - It proves the fields are rendered, not that the code is reached.
  - It stays within §7, with the file count rising to 8.
- **(c) Add an e2e step and a walkthrough row.** The step opens a file with a bad id beside parcel_key, declares parcel_key in the identity form, filters on id, and asserts the refusal block.
  - It needs the re-aim's F-B fixture (`frontends/shell/e2e/E2E-STALE-EXPECTATIONS-REAIM-PREREGISTRATION.md:288`).
  - So its code waits for the re-aim to merge. **That is an ordering the human must see.**
  - It touches e2e files that the re-aim and stale-test-names-and-comments hold.
  - It adds one e2e run and an operator row, and probably exceeds 150 lines (class 8 territory). The form would be amended before dispatch.

**Not a red line.** Nothing waits on (a). Under (b) or (c), the addition is declared before any of its code: in the form before it is committed, or after that as class 9 (round 25, item 2 (a), and the human's reading in item 2.3 of the 2026-10-10 docs-lane directive).

## 4. Files read

**Read:**
- the impact read, in full;
- `PLAN.yaml`: 3372-3389, 3805-3821 (header), 4369-4385, 4405-4421, 4423-4494, 4549-4560, plus greps;
- `state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md`, in full;
- `state/consults/DRIFT-SWEEP-AREA-C-2026-10-10.md`: 1-30;
- `state/consults/2026-10-10-drift-sweep-area-c-custodian-check.md`, in full;
- `state/CUT-STATE.md`: 4560-4589;
- `AUTONOMY.md`: 213-226, 306-391, 476-483;
- `docs/PREREGISTRATION-TEMPLATE.md`, in full;
- `engine/STREAM-FLUSH-CANCEL-EXIT-PREREGISTRATION.md`: 1-300 (form precedent);
- `state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md`, in full;
- `state/directives/2026-10-05-product-first-direction.md`, in full;
- `state/directives/2026-10-06-machine-script-adopted.md`, in full;
- `state/directives/PORTABILITY-2026-09-30.md`: 31-66;
- `engine/src/predicate.rs`: 1-30, 255-349, 1095-1184, plus greps;
- `engine/src/dataset.rs`: 225-334, 1690-1863;
- `engine/src/identity.rs`: 30-99, 285-362;
- `engine/src/fixture.rs`: 160-238, 270-309, 520-679, 1060-1229;
- `engine/src/attributes.rs`: 150-169, plus a grep;
- `kernel/src/skp.rs`: 1105-1179, 1398-1427, 1650-1671, 1700-1719, 1830-1845, 1938-1949, 2067-2080, 2175-2199, 2236-2265, 2790-2814;
- `kernel/src/lib.rs`: 198-221;
- `kernel/Cargo.toml`, in full;
- `kernel/tests/skp_admission_remediation.rs`: 1-255;
- `kernel/tests/skp_admission.rs`: 93-96, 544-612;
- `kernel/tests/skp_projection.rs`: 1160-1269;
- `protocol/skp/SKP-V0.md`: 376-560;
- `protocol/skp/src/v0/commands.rs`: 30-61, 378-402;
- the shell, partly by grep: `frontends/shell/src/App.tsx` 298-333, `admission/formatRefusal.ts` 20-148, `admission/RefusalBlock.tsx` in full, `admission/AdmissionPanel.tsx` 1-60, `admission/IdentityDeclarationForm.tsx` 50-99, `filter/FilterPanel.tsx` (grep), `admission/admitDataset.ts` (grep), `src-tauri/src/commands.rs` (grep, 57-99), the e2e `*.mjs` files (grep);
- `frontends/shell/e2e/E2E-STALE-EXPECTATIONS-REAIM-PREREGISTRATION.md`: 283-304;
- `docs/adr/ADR-021-row-filter-on-viewport-query.md`: 20-25, 69-100, 238-242;
- `docs/adr/ADR-016-stable-feature-identity-admission.md`: 60-71;
- `kernel/README.md`: 340-384;
- `engine/README.md`: 490-529;
- `KNOWN-LIMITATIONS.md`: 56-69;
- `state/cut-archive/CUT-STATE-admission-remediation.md`: 1-3;
- greps across `state/directives/` and `DECISIONS-PENDING.md` for area C.

**Impact-read pointers I used:** all of §1a to §1e, §2's consumer list and its X3 case, the re-aim lines in §2, all of §3, §4's overlap rows, and questions 1 to 5. The form answers each question:
- Q1: the wire route only (2.6, §8 item 5).
- Q2: F-1 from main's generators, so no wait on the re-aim (2.7).
- Q3: kernel only, and OPEN-1.
- Q4: in place, with the heading left alone (2.2).
- Q5: no string changes (§1, §8 item 3).

**Pointers found wrong:** none. Every pointer I spot-checked matches at d9bdc3a0: §1a, §1c, §1d, §1e, the §2 test lines, the re-aim lines, `PLAN.yaml:4554`, and the ADR-021 lines.

**Pointers missing:**
1. **Generators on main that build the shape:** `IdentityMode::StringIds` with `AttributeMode::FilterWitness` (`engine/src/fixture.rs:196`, `:238`, `:624`, `:1092`, `:1144`). §2 answered only whether a variant carries both id and parcel_key, which made the re-aim look necessary when it is not.
2. **The shell-to-host seam the test stands for:** `frontends/shell/src-tauri/src/commands.rs:57-65` and `:87-95`.
3. **What constrains the mapped column of any fixture:** the candidate list is Int64 and UInt64 only (`engine/src/identity.rs:297-313`), the shell form has a free-text route (`IdentityDeclarationForm.tsx:75-97`), and the type and value checks apply (`engine/src/identity.rs:322-344`; `engine/src/dataset.rs:1816-1838`).
4. **The skp/0.8 dated note that keeps §7.5's heading as it is** (`protocol/skp/SKP-V0.md:490-493`). It sits inside the impact read's §7.5 range but is not named, although question 4 turns on it.
5. **The human's in-place precedent for a false live section** (`state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:30`).
6. **The human's area C direction itself.** No file under `state/directives/` carries it, and the check does not name one. The check's lines 118-129 are the custodian's answers to the human's three instructions, not the human's words. Both the impact read and the brief point there as if it were the direction. The form therefore cites the node, the placement and the check, and quotes no direction text.
