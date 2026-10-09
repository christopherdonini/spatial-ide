# Impact read — covering-names-missing-column (lead-data, second pilot, resumed)
Read at: main dba12b8c

Pointers only (`state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md` §1 item 1). Nothing below is quoted unless marked; everything else is paraphrase. No draft text, design or recommendation.

## 0. The piece, by pointer

- Node: `PLAN.yaml:3337-3353` (title :3338, summary with the custodian's S1 candidate grading :3352). Placed and graded S1: `state/directives/2026-10-09-slot-orders-pilot-and-reuse-standing-step.md:21-22`; pilot resumed from this piece: same file :31.
- Filed by: `state/directives/2026-09-29-a2-1-and-b-1-sightings.md:20-25` (item (c); k3 out of A2-1, its own node, graded by whether it breaks a stated clause, :25).
- Evidence: `state/drafts/a2-1-p0/covering-output.txt:19-23` (k3: open OK, covering present, bbox stream fails at item 0 with an `execute:` binder error; no-bbox stream OK). Writer: `state/drafts/a2-1-p0/covering-probe.rs.txt:51-58` (the declared covering path; k3 also declares an LV95 PROJJSON CRS, :56-57), case row :94, the calls observed :109-121.
- Sibling rule: `engine/B1-PROJECTION-PREREGISTRATION.md`, Amendment 12 (heading :781), its k3 line :831, the covering row of 12.1(d) :862, 12.1(f) wire :871, 12.3's declared-unchanged R-S3-for-k3 line :956, 12.4 items 26-27 :974-979, closing record :1010. OPEN A12-c is ruled as recommended by the sightings above (Amendment 12's own lead paragraph, :783).
- The clause the grade rests on: `protocol/skp/SKP-V0.md:107-111` (`viewport_query` entry, §1).
- Human sight list: `engine/ADMISSION-PREREGISTRATION.md:232-234` (§12d, R-S3's open choice named there).

## 1. Interfaces the piece touches

| Interface | Authoritative source | Pinned by |
|---|---|---|
| Covering parse (path shape only; no schema check) | `engine/src/geoparquet.rs:621` (`parse_covering`), `CoveringBbox` :339, `FieldPath::to_sql` :329 | `engine/src/geoparquet.rs::tests::covering_paths_render_as_quoted_sql_identifiers` (:1036) |
| Covering detection and storage at open | `engine/src/dataset.rs:567-581` (12.1(d) row: drops only a U+0000 path; an absent column is kept), fields :148-154, `open_inner` :311, schema probe and geometry check :427-428 | `engine/tests/b1_projection_hostile_covering.rs::a_covering_whose_path_contains_u0000_is_unusable_and_a_bbox_query_refuses_before_any_lease` (:140; k1, k2 only) |
| Sanity check beside it (R-S3) | call `engine/src/dataset.rs:516-524`; `sanity_check` :1185; its no-format-rule early return :1198-1209; U+0000 row :1239-1245; R-S3 absent-path branch :1247-1266; `covering_not_addressable_reason` :1362-1386 (doc comment says k3 is decided separately, :1367-1368); `field_path_exists` :1388-1408 | `engine/tests/admission_format_semantics.rs::a_covering_naming_an_absent_column_records_none_and_the_open_still_succeeds` (:446; format-default file only, :450); `engine/tests/b1_projection_hostile_covering.rs::a_nul_covering_under_the_format_default_records_not_checked_with_the_true_reason` (:235) |
| `Dataset::covering()` and what counts as usable | `engine/src/dataset.rs:977-983`; refusal detail `no_covering_bbox_detail` :985-997 (two arms: U+0000 reason, or declares-no-covering) | the two N-13 tests (engine :140; kernel below) |
| Bbox validation before a handle is minted, and its typed refusal | `engine/src/stream.rs:1140` (`stream_inner`), CRS checks :1191-1207, `build_sql` call :1209, bbox branch `covering()` gate :1477-1480; `EngineError::NoCoveringBbox` `engine/src/error.rs:102-106`, Display :338-342 | `kernel/tests/skp_projection.rs::a_hostile_covering_refuses_a_bbox_query_before_the_mint_and_describe_reports_no_covering` (:835); `kernel/tests/skp_admission.rs::viewport_query_refuses_synchronously_on_a_crs_mismatch_before_minting_a_handle` (:405) for the same pre-mint route |
| The stream's SQL build using the covering | `engine/src/stream.rs:1410` (`build_sql`), plain scan emission :1690-1697, row-group arm :1590-1596 and :1607-1614 | none on main pins an absent covering column in `build_sql` (missing pin) |
| How the binder error surfaces after the mint | lease after `build_sql`: `engine/src/stream.rs:1221`; producer thread :1251-1268; `produce` :1756, prepare :1784-1786, execute :1822-1844; `classify` → `EngineError::Query` :2573-2579 (`Query` variant `engine/src/error.rs:116-117`) | no test on main reproduces k3 (grep of `engine/`, `kernel/` for `nobbox` finds none; missing pin) |
| Other readers of the stored covering | index build `engine/src/dataset.rs:734-738`; row-group build :850-853; LOD/layout reads the geo key itself, not `Dataset::covering()`: `engine/src/layout.rs:642-657` | owner's index pins for experimental seams, `engine/README.md:511` |

Fixture support already on main: `engine/src/fixture.rs:484-487` and :775-786 (`covering_names_absent_column`, R-S3's shape); `engine/src/fixture.rs:1665-1671` (`write_hostile_covering`, the P0 writer, which can declare a path differing from the written struct).

## 2. Who consumes them in other modules

- Kernel `viewport_query`: `kernel/src/skp.rs:1372-1379`; mint step :1404-1489 (comment on pre-mint validation :1455-1457; `open_engine_stream` call :1465-1471; ticket minted :1488). `open_engine_stream` `kernel/src/lib.rs:255-266`.
- Wire codes: `kernel/src/skp.rs:2041` (`error_of`), `NoCoveringBbox` arm :2103-2105, `Query` arm :2111; `terminal_detail_of` :2034-2036; mid-stream terminal `EngineSource::next_into` `kernel/src/lib.rs:663-690` (prefix built at :685). Pinned by `kernel/tests/typed_terminal_codes.rs::the_prefix_is_the_convention_for_every_engine_refusal_not_a_special_case` (:380).
- Raw admission path (create-time refusal): `kernel/src/lib.rs:433`; pinned by `kernel/tests/end_to_end.rs::a_create_time_engine_refusal_on_the_raw_path_carries_its_typed_code` (:637).
- `describe.covering_bbox`: `kernel/src/skp.rs:1975`; wire member `protocol/skp/SKP-V0.md:80`; describe fixtures carry it at `protocol/skp/tests/data/v0-describe-response.json:37`, `v0-describe-response-caller-asserted.json:37`, `v0-describe-response-session-ordinal.json:37`. Slice-host banner: `kernel/src/main.rs:119-127`.
- Publish with a bbox reaches the same `stream_inner`: `kernel/src/publish/mod.rs:731` → `engine/src/stream.rs:937-951`.
- SKP conformance fixtures: `protocol/skp/tests/conformance/fixtures/` (four files) carry no covering or `no_covering_bbox` entry; `protocol/skp/tests/data/` has no `v0-error-no_covering_bbox.json` (missing; error-fixture list read by glob).
- Shell, synchronous bbox refusal: `frontends/shell/src/streaming/viewportStreamManager.ts:192`; `frontends/shell/src/App.tsx:1236-1273` (`reportViewportOutcome`, sets the viewport refusal); candidate arm `frontends/shell/src/streaming/tileViewportStreamManager.ts:939-958`. Pinned (mocked `engine.no_covering_bbox`) by `frontends/shell/src/App.lateResult.test.tsx` test at :459 and `frontends/shell/src/App.layout.test.tsx` R8 at :455.
- Shell, a stream that fails at its first item: `frontends/shell/src/App.tsx:564-572` (`onTerminal`) and :1481-1494 (banner `stream ProducerFailed: …`, scan `failed`); `frontends/shell/src/streaming/formatTerminalRefusal.ts:33`. Pinned by `frontends/shell/src/streaming/formatTerminalRefusal.test.ts` "every engine code is parsed, not just the one a client acts on" (:63, includes `engine.query`).
- Shell reads `covering_bbox` only as a type, `frontends/shell/src/skp/types.ts:192` (no product branch on it found outside tests).

## 3. What governs them

- ADRs (Status as on main):
  - ADR-019, `docs/adr/ADR-019-control-plane-admission-tickets.md:3` — Proposed, binds nothing. Decision 1 names covering-bbox presence among pre-mint validation, :46-50; implementation note on the stream lease held by a pending ticket, :52-62.
  - ADR-015, `docs/adr/ADR-015-source-crs-requirement-and-caller-assertion.md:3` — Accepted 2026-08-05; §7 (viewport CRS is a caller assertion) :78, the check that precedes the covering gate in `stream_inner`.
  - ADR-010, `docs/adr/ADR-010-render-frames-origins-boundaries.md:3` — Accepted 2026-08-03; the shell's terminal handler cites its rules for logging failure terminals (`frontends/shell/src/App.tsx:1482-1484`).
  - ADR-021 (`docs/adr/ADR-021-row-filter-on-viewport-query.md:3`, Accepted) and ADR-023 (`docs/adr/ADR-023-attribute-projection-on-viewport-query.md:3`, Proposed) carry A2-1's ADR texts (Amendment 12, 12.1(g), `engine/B1-PROJECTION-PREREGISTRATION.md:875-877`); neither names the covering (my reading).
- Preregistrations:
  - `engine/ADMISSION-PREREGISTRATION.md`: R-S1 :59, R-S3 :61, M-4 mutation row :127, §12d :232-234; P4 record rows for deviation-M-4 in Amendment 15 :1712 and Amendment 18 :1730.
  - `engine/B1-PROJECTION-PREREGISTRATION.md` Amendment 12 (pointers in §0 above).
  - `engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md:201` (M-4 row).
- Results and corpus: `engine/ADMISSION-RESULTS.md:26` (M-4 row, DEVIATION), :46 (the deviation: the R-S3 reason never appears because the no-format-rule return comes first), :57; the file is generated, never hand-edited (:1, :6). Generator expectation `engine/tests/admission_p4_corpus.rs:325-335`. Corpus manifest `engine/compat-corpus/of-record/MANIFEST.json:2869`; derivation `engine/compat-corpus/of-record/mutations/DERIVATIONS.json:47-52`.
- KNOWN-LIMITATIONS: item 9 `KNOWN-LIMITATIONS.md:110-114` (no covering.bbox refused at query); item 22 :256-264 (sanity check, level `none` when no usable covering). Neither states a declared covering that names an absent column (missing).
- docs/08: `docs/08_Testing.md:7` (cold open of 5 GB < 5 s), the budget any open-path change sits under. Declared ceilings near the path: `SANITY_SAMPLE_MAX_ROWS` `engine/src/geoparquet.rs:68`; `MAX_STREAM_CONNECTIONS` `engine/src/pool.rs:99`; `TICKET_TTL` `kernel/src/skp.rs:82`, `MAX_PENDING_TICKETS` :94 (a k3 bbox query today takes a stream lease and a ticket before failing).
- Decision record: R-S3's open choice is DECISIONS-PENDING entry 73, item (c) (cited by entry, not line); a search of `DECISIONS-PENDING.md` for `R-S3` finds only that for-sight list, no ruling.
- Owner's index: neither `Dataset::covering()` nor the sanity check is listed among the engine's interfaces (`engine/README.md:501-502`); index last verified at 14acee0b (:499).

## 4. Questions the form must answer (at most five)

1. Where is the absent-column fact established for a file that declares its own CRS, given R-S3's check sits behind the no-format-rule return (`engine/src/dataset.rs:1198-1209` vs :1247-1266), k3 declares LV95 (`state/drafts/a2-1-p0/covering-probe.rs.txt:56-57`), and M-4 is a recorded DEVIATION for that reason (`engine/ADMISSION-RESULTS.md:46`)?
2. Which of R-S3's two outcomes the form carries, and by what route the human sees it, given §12d lists R-S3's open choice for the human (`engine/ADMISSION-PREREGISTRATION.md:234`, :61), Amendment 12 declared R-S3 unchanged for k3 (`engine/B1-PROJECTION-PREREGISTRATION.md:956`), and no ruling on entry 73 (c) was found?
3. What `NoCoveringBbox` detail and sanity reason name an absent column, given `no_covering_bbox_detail` has only two arms (`engine/src/dataset.rs:992-996`), Amendment 12 item 27 forbids a declares-no-covering detail for a declared covering, but only for names that are not addressable (`engine/B1-PROJECTION-PREREGISTRATION.md:975-978`), and message wording is the human's (`engine/ADMISSION-PREREGISTRATION.md:234`)?
4. Which tests, records and other covering readers the form declares changed or unchanged: `engine/tests/admission_format_semantics.rs:446`, `engine/tests/admission_p4_corpus.rs:325-335` with the generated `engine/ADMISSION-RESULTS.md`, `engine/ADMISSION-PREREGISTRATION.md:127`, KNOWN-LIMITATIONS items 9 and 22, `engine/src/dataset.rs:734` and :850, and `engine/src/layout.rs:642-657`?
5. Whether `describe.covering_bbox` turning false for a k3 file counts as a wire change needing a literal bump and fixtures under the §8 discipline that `skp/0.7` followed (`protocol/skp/SKP-V0.md:80`, :945-950), given no `engine.no_covering_bbox` error fixture exists under `protocol/skp/tests/data/`?

## Files read

- `state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md` 1-62
- `state/directives/2026-10-09-slot-orders-pilot-and-reuse-standing-step.md` 1-44
- `state/directives/2026-09-29-a2-1-and-b-1-sightings.md` 1-86
- `state/drafts/a2-1-p0/covering-output.txt` 1-23
- `state/drafts/a2-1-p0/covering-probe.rs.txt` 1-123
- `engine/README.md` 495-528
- `kernel/README.md` 346-385
- `PLAN.yaml` 3330-3359
- `engine/src/dataset.rs` 130-169, 215-619, 715-744, 835-859, 970-1004, 1160-1419
- `engine/src/stream.rs` 895-984, 1140-1269, 1405-1639, 1690-1855; 2573-2593 (grep context)
- `engine/src/error.rs` 90-117, 336-343
- `engine/src/layout.rs` 636-660
- `engine/src/geoparquet.rs` (grep lines only: 68, 329, 339, 621, 1036)
- `engine/tests/b1_projection_hostile_covering.rs` 1-336
- `engine/tests/admission_format_semantics.rs` 425-484
- `engine/tests/admission_p4_corpus.rs` 300-349
- `engine/B1-PROJECTION-PREREGISTRATION.md` 781-1011
- `engine/ADMISSION-PREREGISTRATION.md` 55-62, 120-135, 228-237; grep lines 172, 1712, 1730, amendment headings
- `engine/ADMISSION-RESULTS.md` 1-60
- `engine/compat-corpus/of-record/MANIFEST.json` 2866-2871
- `engine/compat-corpus/of-record/mutations/DERIVATIONS.json` 44-53
- `engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md` (grep line 201)
- `kernel/src/skp.rs` 1365-1499, 1960-1984, 2025-2124; grep lines 82, 94
- `kernel/src/lib.rs` 255-280 (grep context), 660-704
- `kernel/src/main.rs` 110-134
- `kernel/tests/skp_projection.rs` 820-899
- `kernel/tests/typed_terminal_codes.rs` 370-409
- `kernel/tests/skp_admission.rs`, `kernel/tests/end_to_end.rs` (grep lines 405, 637)
- `protocol/skp/SKP-V0.md` 60-154, 319-337, 925-951; section headings by grep
- `protocol/skp/tests/` (grep and glob only)
- `docs/adr/ADR-019-control-plane-admission-tickets.md` 1-62
- `docs/adr/` Status lines for ADR-005, -010, -015, -016, -018, -021, -023 (grep); ADR-015 grep line 78
- `docs/08_Testing.md` (grep lines 6-7)
- `KNOWN-LIMITATIONS.md` 106-119, 254-267
- `DECISIONS-PENDING.md` 2005-2049 (entry 73; cited by entry only); grep for `R-S3` and `entry 73`
- `frontends/shell/src/App.tsx` 540-599, 1236-1275, 1478-1497
- `frontends/shell/src/streaming/viewportStreamManager.ts` 180-219
- `frontends/shell/src/streaming/tileViewportStreamManager.ts` 936-960
- `frontends/shell/src/streaming/formatTerminalRefusal.test.ts` 60-70; test names by grep
- `frontends/shell/src/App.lateResult.test.tsx`, `frontends/shell/src/App.layout.test.tsx` (test names by grep)
