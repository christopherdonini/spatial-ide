# Impact read — b1-engine-kernel-half-followups (lead-data, second pilot, piece 2)
Read at: main e29c6f86

Pointers only (the pilot's §1, item 1: `state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md:7-11`). No draft text, design, recommendation or answer. Every line cite below is at main e29c6f86 unless it names another commit. The gate reports cite lines at `c9ec02e`; those lines have shifted, and where I found the current site I give it.

The piece: `PLAN.yaml:2851-2867` (summary at `PLAN.yaml:2866`; `gate: none` at `PLAN.yaml:2860`; `budget_minutes: 90` at `PLAN.yaml:2862`). Its sources: reviewer E2 (`state/consults/gates/2026-09-27-b1-engine-kernel-half-gate3-reviewer.md:126-128`), D2 (`:135-138`), D3 (`:139-141`), D4 (`:142`), D5 (`:143`), D6 (`:144-146`); the supplementary mutation S1 that survives (`:87`). The architect's routing (`state/consults/gates/2026-09-27-b1-engine-kernel-half-gate3-architect.md:21`), its E-15 note (`:108`), its fixture-commit note (`:116-119`), its doc nits (`:123-127`) and its RECORDED MUTATION note (`:130-134`).

## 1. Interfaces the piece touches

**1.1 The publish plan and its retention flag** (all in `engine/src/stream.rs`)
- `StreamPlan` is `pub(crate)` (`:576`). Its field `compact_attribute_retention` is at `:591`, with its doc at `:585-590`.
- `StreamPlan::for_publish` is at `:600-612`. It declares the flag `false` at `:610`.
- Its one product caller is `Dataset::stream_for_publish` (`:928-941`), which constructs the plan at `:940`.
- The other plans set the flag inline: `stream_with_cancel` `false` (`:911`); `stream_projected_with_cancel` `true` (`:1012`, the only `true`); the four experimental entry points `false` (`:1041`, `:1070`, `:1099`, `:1124`).
- Pinned by `engine/src/stream.rs::tests::publish_emits_a_nullable_byte_aligned_single_run_with_the_uncompacted_slices_ipc_bytes` (`:2866`). It reads the constructor's flag (`:2900`) and drives `single_run_retention` with it (`:2915`). It does not drive `flush` or `stream_inner`. That is reviewer E2's gap (`state/consults/gates/2026-09-27-b1-engine-kernel-half-gate3-reviewer.md:127`).

**1.2 How the flag reaches flush** (`engine/src/stream.rs`)
- `stream_inner` (`:1129-1142`) destructures the plan, and the producer thread passes the flag to `produce` (`:1256`). `produce` takes it as a parameter (`:1745-1759`).
- `produce` calls `flush` at four sites, each passing the flag: `:2005-2016`, `:2054-2065`, `:2090-2101` and `:2110-2121`.
- `flush` takes it as a parameter (`:2374-2385`). Its single-run arm calls `single_run_retention` (`:2434-2435`). A multi-run batch concatenates whatever the flag says (`:2436-2441`).
- The branch the flag selects: `single_run_retention` (`:2330-2336`), `retain_or_compact_single_run` (`:2338-2352`) and `compact_attribute_slice` (`:2367-2372`).
- Tests that drive the full plan → `stream_inner` → `flush` path today: only the live plan, `a_live_projected_text_stream_emits_every_attribute_column_within_the_declared_retention_bound` (`:3007`, gated on the `fixture` feature at `:3005`). It reads the producer's queued items in-module (`stream.rx`, `:3046`).
- Why serialized output cannot show retention: `:2994-2997`.
- Publish-path tests that go through `stream_for_publish`: `engine/tests/publish_stream.rs::the_publish_stream_emits_the_declared_projection_in_declared_order` (`:169`) and `::a_publish_partition_is_one_batch_and_its_boundaries_are_reproducible` (`:403`). Neither file has a `ptr_eq` or any retention assertion (grep).
- The other unit tests on the decision: E-14, `every_emitted_attribute_column_retains_at_most_the_declared_factor` (`:2636`); E-15, `a_compacted_and_a_sliced_single_run_serialize_to_identical_ipc_bytes` (`:2767`); and `a_compacted_single_run_decodes_equal_to_the_slice_it_replaces_nulls_included` (`:2941`). The test module opens at `:2549`.
- Fixture modes whose attributes carry NULLs: `engine/src/fixture.rs:176` and `engine/src/fixture.rs:182`.

**1.3 The kernel's publish path**
- The kernel never builds or reads a `StreamPlan`, which is crate-private (`engine/src/stream.rs:576`).
- It consumes the plan only through `ds.stream_for_publish(...)` in `run_inner` (`kernel/src/publish/mod.rs:716`; `run_inner` begins at `:670`).
- The projection it passes comes from `ds.resolve_projection` in `preflight_pinless_parts` (`kernel/src/publish/mod.rs:493`), followed by the bundle-format restriction (`admit_bundle_format`, `:424-449`).
- The live plan's kernel caller is `open_engine_stream` (`kernel/src/lib.rs:254-261`).
- Publish byte determinism is pinned by `kernel/tests/publish.rs::publishing_twice_from_identical_inputs_gives_a_byte_identical_manifest` (`:284`). It is also pinned by `kernel/tests/import_layout_publish_determinism.rs::adr017_publish_determinism_across_layouts_at_145mb` (`:337`), which is `#[ignore]` (`:335-336`).

**1.4 The doc sites the summary names** (`engine/src/stream.rs`)
- **`MAX_ATTRIBUTE_RETENTION_FACTOR`.** Its doc is `:82-102` and the const is `:103`. The words "this function's" are at `:99`, in a const's doc (`state/consults/gates/2026-09-27-b1-engine-kernel-half-gate3-architect.md:126`).
- **The `byte-aligned offset` generalization** (D3, second bullet): `:91-97` and `:2360-2366`.
- **`retain_or_compact_single_run`'s doc (D4).** It sits at `:2311-2323`, directly above `single_run_retention`'s own doc (`:2324-2329`). `retain_or_compact_single_run` itself (`:2338`) carries no doc comment.
- **`single_run_retention`'s relative clause** (architect, `:124` of the gate-3 report): `:2327-2329`.
- **The nullable-only wording.**
  - D3 names two sites, both still present at main: `flush`'s route-(a) comment (`:2429-2433`, the word at `:2430`) and E-15's doc (`:2757`).
  - A third site carries the same wording, and neither gate names it: `StreamPlan::compact_attribute_retention`'s doc, `:586-587`.
- **E-15's doc.** It is `:2756-2765`. The row-count failure path the architect calls one that does not occur is described at `:2763-2765` (`state/consults/gates/2026-09-27-b1-engine-kernel-half-gate3-architect.md:108`).
- **`MAX_QUEUED_BATCHES`'s doc.** It restates the retention rule at `:71-79`; the const is `:80`.

**1.5 RECORDED MUTATION comments** (I read `engine/src/stream.rs` and `kernel/tests/skp_projection.rs` only; the tree has 161 such comments across 33 files)
- `engine/src/stream.rs`:
  - Neither commit nor line: `:3001-3004` (D5).
  - No commit, with a bare self-line cite: `:2601-2604`. It cites `:2419`, which at main is a comment line inside `flush`.
  - Commit-named: `:2628-2634`, `:2861-2864` and `:2936-2939`.
- `kernel/tests/skp_projection.rs`:
  - No commit, with a bare self-line cite: `:365-370` (cites `:275`), `:1003-1007` (cites `:384`, which at main is a `fn` line), `:1247-1250` (cites `:479`) and `:1399-1403` (cites `:578`).
  - No commit and no line: `:151-154`, `:155-158`, `:583-587` and `:917-921`.
  - Commit-named: `:1115-1119` and `:1456-1461`.
- The architect's list is at `c9ec02e` (`state/consults/gates/2026-09-27-b1-engine-kernel-half-gate3-architect.md:130-134`). By content, its `skp_projection.rs:551` (which says `:384`) is main's `:1003-1007`. I did not map the other c9ec02e cites to main line by line.

**1.6 The conformance header and the fixture-commit lists** (in `protocol/skp`, outside `engine/` and `kernel/`)
- `protocol/skp/tests/conformance/DIVERGENCES.md:3-6`.
  - At main the header names the `skp/0.8` run at `5d4da4d`, giving 63/15/0.
  - The `skp/0.6` run line (62/15/1) at `:6` names no commit.
  - Neither `37b3644` nor `c9ec02e` appears in the file.
  - The header was rewritten under `protocol/skp/CANCEL-STATE-CLOSED-SET-PREREGISTRATION.md:98-100`, and its run lines were superseded there (`:277`).
- Pinned by `protocol/skp/tests/conformance/main.rs::spec_derived_fixtures_against_wire_types` (`:70`), with `REPORTED_DIVERGENCES` empty (`:15`).
- The A9 nit (architect, `:127` of the gate-3 report): `protocol/skp/tests/conformance/AMBIGUITIES.md:17`.
- The fixture-commit lists that omit `c9ec02e` (D6):
  - `protocol/skp/SKP-V0.md:303-311` (§4 item 13);
  - `protocol/skp/SKP-V0.md:917-921` (§8's `skp/0.6` Mechanics);
  - `protocol/skp/SKP-V0.md:987-990` (§9.1);
  - `protocol/skp/src/v0/mod.rs:66-69` (`SKP_VERSION`'s doc).
- A grep of `engine/`, `kernel/`, `protocol/`, `docs/`, `frontends/` and `renderer/` finds `37b3644` nowhere. It finds `c9ec02e` only at `kernel/TIMING-ASSERTIONS-UNDER-CONTENTION-PREREGISTRATION.md:62`, about an unrelated `slice.rs` line.

## 2. Consumers in other modules

- **kernel.** Publish consumes the plan only through `Dataset::stream_for_publish` (`kernel/src/publish/mod.rs:716`). The live projected path goes through `kernel/src/lib.rs:261`. The kernel tests that exercise them are listed at 1.3, plus `kernel/tests/skp_projection.rs` (projection and publish refusals). The kernel's owner's-index row for publish is `kernel/README.md:361`.
- **protocol/skp.**
  - The conformance suite is a consumer of the wire types only. It calls no plan and no `flush`.
  - Its header and A9 are doc sites (1.6).
  - `SKP-V0.md` and `v0/mod.rs` carry the fixture-commit lists (1.6).
  - The data plane is untouched by anything named here. B1 §8 item 5 blocks any `protocol/data-plane/` diff (`engine/B1-PROJECTION-PREREGISTRATION.md:349`).
- **Within engine** (not another module, listed for the index): the four `flush` call sites (1.2), and `engine/tests/publish_stream.rs` and `engine/tests/live_projection.rs`.
- **No other caller of the plan or of `flush` exists.** `StreamPlan` and `flush(` appear only in `engine/src/stream.rs` (grep of `engine/src`).
- **The owner's-index rows these sit under:** `engine/README.md:505` (publish stream), `engine/README.md:503` (live projected stream) and `engine/README.md:523` (ceilings). Last verified at 8efcde9 (`engine/README.md:499`).
- **The node that depends on this one:** `kernel-close-races-followups` (`PLAN.yaml:3083-3098`). Its summary claims B1's recorded-mutation comment cites in `kernel/tests/skp_projection.rs` and `kernel/tests/wire_bytes_invariant.rs` (`PLAN.yaml:3098`).

## 3. What governs them

**ADRs** (Status lines as they read at main)
- **ADR-004** reads Accepted, 2026-07-31 (`docs/adr/ADR-004-skp-control-data-plane-mcp-adapter.md:3`). Its copy-minimized data-plane rule is at `:17`.
- **ADR-010** reads Accepted, 2026-08-03 (`docs/adr/ADR-010-render-frames-origins-boundaries.md:3`). Rule 6, ceilings declared not discovered, is at `:70`.
- **ADR-017** reads Accepted, 2026-08-06, architect-blockable (`docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:3`). Its §12 on determinism is at `:468`.
- **ADR-023** is quoted from `docs/adr/ADR-023-attribute-projection-on-viewport-query.md:3`: "Proposed — **decision deliberately undrafted; binds nothing.**". Its condition (3), on chunk retention declared as a ceiling, is at `:146`. That Status stays Proposed until B1's close is at `:149`.

**Preregistrations**
- `engine/B1-PROJECTION-PREREGISTRATION.md`:
  - **Header.** No line cites: `:21`.
  - **§2.3 `flush` bullet:** `:159-161`.
  - **§5.** H3 at `:296`; publish bytes declared unchanged at `:308`; invalidators at `:313-318`.
  - **§7 retention:** `:331-333`.
  - **§8.** Item 6 (zero-copy) at `:350`; item 9 at `:353`; item 15 at `:359`.
  - **Amendment 5.** 5.1 at `:527`, 5.2 (route (a)) at `:529-536`, 5.3 at `:538-546`; X6 and X7 rows at `:561-562`.
  - **Amendment 8.** X6, X7 and X10 rows at `:685-691`; the Docs row at `:699`.
  - **Amendment 9.** The `DIVERGENCES.md` clause at `:728`; 9.6 at `:758-761`; Record at `:763`.
  - **Amendment 10:** `:765-775`.
  - **Amendment 11:** `:777-779`.
  - **Amendment 12.** Its statement that the sighting closes B1's form to further additions before B1's close is at `:783`.
- `protocol/skp/CANCEL-STATE-CLOSED-SET-PREREGISTRATION.md:96-101` and `:277` (the `DIVERGENCES.md` rewrite).
- `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md`, its Amendment 1, 1.4, as `PLAN.yaml:3098` cites it. I did not read it.

**Rules on the spec text**
- `protocol/skp/SKP-V0.md:541-544`: §8 is append-only from that line down.

**KNOWN-LIMITATIONS**
- No item names attribute retention, `flush`, compaction or the conformance suite. A grep of `KNOWN-LIMITATIONS.md` for retention, retain, compact, slice and attribute finds only unrelated lines (`:54`, `:70`, `:77`, `:112-113`, `:125`).
- The indexes' declared-limit lists: `engine/README.md:521` and `kernel/README.md:377`.

**Declared ceilings**
- `MAX_ATTRIBUTE_RETENTION_FACTOR`: `engine/src/stream.rs:103`, plus `engine/README.md:418-426`, `engine/B1-PROJECTION-PREREGISTRATION.md:331-333` and `:542-546`.
- `MAX_QUEUED_BATCHES`: `engine/src/stream.rs:80` (doc `:67-79`).
- The piece's own budget: `PLAN.yaml:2862`.

## 4. Questions the form must answer

1. Under which record do this piece's test and doc edits get declared, given that B1's form is closed to further additions before B1's close (`engine/B1-PROJECTION-PREREGISTRATION.md:783`) and its Header bars line cites (`engine/B1-PROJECTION-PREREGISTRATION.md:21`)?
2. Which mutation is the new test declared to kill, and at what point does it observe the kept run? S1 survives today (`state/consults/gates/2026-09-27-b1-engine-kernel-half-gate3-reviewer.md:87`), and serialized output cannot show retention (`engine/src/stream.rs:2994-2997`).
3. Does D2 still name a defect at main? The header now names the `5d4da4d` run, and its `skp/0.6` line names no commit (`protocol/skp/tests/conformance/DIVERGENCES.md:3-6`; `protocol/skp/CANCEL-STATE-CLOSED-SET-PREREGISTRATION.md:277`).
4. Where may D6's `c9ec02e` scoping clause enter, given that §8 is append-only from its line down (`protocol/skp/SKP-V0.md:541-544`)? The lists sit at `protocol/skp/SKP-V0.md:303-311`, `:917-921` and `:987-990`, and at `protocol/skp/src/v0/mod.rs:66-69`, outside `engine/` and `kernel/`.
5. Which sites at main does each nit cover?
   - The gates cite `c9ec02e` lines (`state/consults/gates/2026-09-27-b1-engine-kernel-half-gate3-architect.md:130-134`).
   - A third nullable-only site is unnamed (`engine/src/stream.rs:586-587`).
   - `kernel-close-races-followups` claims B1's recorded-mutation cites in `kernel/tests/skp_projection.rs` (`PLAN.yaml:3098`).

## Files read

- `state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md`: 1-61
- `PLAN.yaml`: 2851-2881, 2866, 3082-3117 (grep context)
- `engine/README.md`: 495-528, 415-426; grep hits 371, 374, 418, 421, 523
- `kernel/README.md`: 346-383
- `state/consults/gates/2026-09-27-b1-engine-kernel-half-gate3-reviewer.md`: 1-207
- `state/consults/gates/2026-09-27-b1-engine-kernel-half-gate3-architect.md`: 1-189
- `engine/src/stream.rs`: 60-109, 530-619, 900-949, 995-1264, 1745-1764, 2000-2129, 2290-2459, 2590-3079; grep for `compact_attribute_retention`, `StreamPlan`, `flush(`, `RECORDED MUTATION`, `mod tests`
- `engine/B1-PROJECTION-PREREGISTRATION.md`: 1-24, 135-169, 291-390, 523-592, 672-801; heading grep; term grep
- `engine/tests/publish_stream.rs`: grep (fn names, `stream_for_publish`, `nullable`, `ptr_eq`)
- `engine/src/fixture.rs`: grep (`AttributeMode`, NULL)
- `kernel/src/publish/mod.rs`: 420-499, 680-769; fn grep
- `kernel/src/lib.rs`: grep 251-261
- `kernel/tests/skp_projection.rs`: `RECORDED MUTATION` grep with 4 lines after; 360-389, 1000-1011, 1240-1251, 1395-1464
- `kernel/tests/publish.rs`: 278-285
- `kernel/tests/import_layout_publish_determinism.rs`: 330-337; fn grep
- `protocol/skp/tests/conformance/DIVERGENCES.md`: 1-25
- `protocol/skp/tests/conformance/AMBIGUITIES.md`: 17
- `protocol/skp/tests/conformance/main.rs`: grep 15, 70
- `protocol/skp/src/v0/mod.rs`: 50-84
- `protocol/skp/SKP-V0.md`: 298-313, 539-546, 905-924, 980-993; heading and append-only grep
- `protocol/skp/CANCEL-STATE-CLOSED-SET-PREREGISTRATION.md`: 96-103; `DIVERGENCES` grep
- `docs/adr/ADR-023-attribute-projection-on-viewport-query.md`: 1-8, 140-151
- `docs/adr/*.md`: Status-line grep (line 3 of each); `ADR-010` rule-6 grep (70); `ADR-017` §12 grep (468); `ADR-004` copy-minimized grep (17)
- `KNOWN-LIMITATIONS.md`: item-heading grep; term grep
- `CUSTODIAN-QUEUE.md`: grep for the node
- Tree-wide grep: `RECORDED MUTATION` counts in `{engine,kernel,protocol}/**/*.rs`; `c9ec02e|37b3644` in `{protocol,engine,kernel,docs,frontends,renderer}/**`; `stream_for_publish|for_publish|compact` in `{kernel,protocol,renderer,frontends}`
