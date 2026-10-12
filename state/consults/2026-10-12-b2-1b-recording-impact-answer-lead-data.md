*Custodian's filing note (2026-10-12): the data lead's answer to the impact question of `kernel/B2-1B-RECORDING-PREREGISTRATION.md` section 0.4, asked by the human on 2026-10-11 (item 2) before the piece's code; base main at 086a7b9a8707849d254e461e68b998f1e46db595; the run 2026-10-12T13:16:27Z to 2026-10-12T13:20:40Z by its transcript (Grep 15, Read 29, Glob 1; zero writes); its one SubagentHandback call, at 13:20:40Z. It arrived as a message and is extracted here by script. 1 scratch-folder path(s) are replaced by a placeholder, 58 rooted path:line cite(s) are de-rooted by script, and one final newline is added; nothing else is changed. The message's sha256 as handed back is 45a0ff0ad80c240f086c8a7c4dd04fc0de074689a70423f1a93b6af67c52fd2b; this file's, from line 5 to the end, is 386a57f51862597d24238374996c0c21ce6f63071cfffd80c59351802ee821ff. Its three questions and its first bullet beyond the question go to the human beside the form's OPEN-1 to OPEN-10; the form's Amendment 1 records the answer, the rulings and any class 9 work before code.*

---

**Result:** H1 holds as worded: no `dependencies` member needs a new file read. But the predicate's fields can't be read today. The engine drops them inside `AdmittedPredicate::admit`, so this piece needs one engine change (a value kept plus a public accessor) and four small kernel changes.

**Blocking questions for the custodian:**
- Q1: Do you accept a new public engine interface, `AdmittedPredicate` keeping its referenced column names behind a `pub` accessor? It is a contract addition, so it is your decision. It would be class 9 in Amendment 1.
- Q2: Which type spelling should `dependencies.fields[].type` use? One option is the Arrow type, as `describe` spells it. The other is DuckDB's surrogate name. The choice decides whether the engine also has to keep the surrogate types.
- Q3: Where does `record_step` linearize against `close_dataset` and a generation end? See "Beyond the question", bullet 2.

**Report path:** `<the custodian scratch folder>\lead-1b-impact.md`. Nothing was written there or anywhere else, as the brief directs, so there is no sha256. This message is the report.

---

# Impact answer: `kernel/B2-1B-RECORDING-PREREGISTRATION.md` §0.4, piece `b2-piece-1b-recording`

Base: main at 086a7b9a8707849d254e461e68b998f1e46db595 (`.git/refs/heads/main`). Every cite below is at this base. Text marked *paraphrase* is not a quotation.

**The common path.** `SkpHost::catalog()` (line 1077 of kernel/src/skp.rs (at 086a7b9a)) leads to `Catalog::get` (line 229-231 of kernel/src/lib.rs (at 086a7b9a)), which returns an `Arc<Dataset>`. The handle is the catalog name and is minted fresh for each open (line 1114 of kernel/src/skp.rs (at 086a7b9a), 1121-1126). So through SKP, a handle never names a second `Dataset`.

**The common ordering.** Every member below is set once at open and held in private `Dataset` fields (line 145-181 of engine/src/dataset.rs (at 086a7b9a)). The record's `Arc` keeps the dataset alive through a racing `catalog.remove` (line 1610 of kernel/src/skp.rs (at 086a7b9a)). So a read never sees a dropped or replaced object. It always sees the facts *of the open*.

Two existing checks refuse a stale handle:
- `Catalog::get` returning `None`, which gives `skp.unknown_dataset`;
- `GenerationRegistry::live_generation` (line 602-615 of kernel/src/skp.rs (at 086a7b9a)), as `viewport_query_mint` maps it (line 1436-1453 of kernel/src/skp.rs (at 086a7b9a)):
  - an end mark gives `engine.source_changed` or `engine.source_coverage_lost`;
  - a close in progress or a forgotten name gives `skp.unknown_dataset`.

Nothing refuses after the live check has passed. See "Beyond the question", bullet 2.

## The predicate's fields
1. **Today's reader.** Stage 1 collects every `COLUMN_REF` name into `StructuralAdmission.columns`:
   - the struct is private (line 484-488 of engine/src/predicate.rs (at 086a7b9a));
   - the push is at line 948 of engine/src/predicate.rs (at 086a7b9a);
   - `admit` drops it, keeping only the text: `Ok(Self { text })` (line 198 of engine/src/predicate.rs (at 086a7b9a));
   - `AdmittedPredicate` holds `text` alone (line 88-91 of engine/src/predicate.rs (at 086a7b9a));
   - its only accessor is `sql_text` (line 220-222 of engine/src/predicate.rs (at 086a7b9a)).

   **Reachable without a new file read: no.** From the catalog you get the predicate text and nothing else. The kernel can't parse it itself: admission's DuckDB connection never leaves the engine crate (doc at line 97-105 of engine/src/predicate.rs (at 086a7b9a)). A second parser in the kernel would be a second, unadmitted grammar.
2. **The change** (engine):
   - keep the names that are dropped today (a new private field set from `structural.columns`);
   - add a new `pub` accessor;
   - `unchecked_for_composition_test` (line 212-215 of engine/src/predicate.rs (at 086a7b9a)) sets the field empty.

   Duplicates come through as-is: `a=1 OR a=2` pushes `a` twice. Whether to dedupe and in what order is the form's choice.
3. **Ordering risk.** None from the engine side. Admission reads only the resident schema and takes an admission-class lease (line 142-155 of engine/src/predicate.rs (at 086a7b9a)). It does not consult generations or the descriptor (line 113-199 of engine/src/predicate.rs (at 086a7b9a)). So admission alone would succeed against a dataset whose generation has just ended. The refusal comes only from the live check, and only if that check runs first.

## Their types
1. **Today's reader.** Two candidates:
   - **Arrow type.** `Dataset::file_schema()` (line 1045-1047 of engine/src/dataset.rs (at 086a7b9a)) is public and reachable: yes, through the catalog. `describe` already puts it on the wire as `f.data_type().to_string()` (line 1965 of kernel/src/skp.rs (at 086a7b9a)).
   - **DuckDB surrogate.** The `namespace` map holds it (line 1147 of engine/src/predicate.rs (at 086a7b9a), 1247-1256, 1265-1286). It is private and dropped inside `admit`. Reachable: no.

   Every name stage 1 collects has already been matched to a `file_schema()` field by exact name, or `admit` refused (line 1183-1198 of engine/src/predicate.rs (at 086a7b9a)). So a kernel lookup by name cannot miss.
2. **The change.**
   - Arrow spelling: nothing beyond the fields' change. The lookup is new kernel code in `session_history.rs`.
   - Surrogate spelling: the engine must also keep the referenced entries of `namespace` (engine).
3. **Ordering risk.** None. The schema is fixed at open. Same checks as above.

## The CRS identifier
1. **Today's reader.** `Dataset::crs()` (line 952 of engine/src/dataset.rs (at 086a7b9a)) leads to `DatasetCrs::identifier()` (line 236 of engine/src/crs.rs (at 086a7b9a)). Reachable without a new file read: **yes**.
2. **The change.** None.
3. **Ordering risk.** None. Set at open; the fields are private (line 172-183 of engine/src/crs.rs (at 086a7b9a)). Same checks as above.

## The CRS source
1. **Today's reader.** `DatasetCrs::source()` (line 242 of engine/src/crs.rs (at 086a7b9a)) gives a `CrsSource`, and `as_str` (line 110-116 of engine/src/crs.rs (at 086a7b9a)) gives `file`, `caller_asserted` or `format-rule`. `describe` uses the same spelling (line 1892 of kernel/src/skp.rs (at 086a7b9a)). Reachable: **yes**.
2. **The change.** None.
3. **Ordering risk.** None. Same as the identifier.

## The geometry types
1. **Today's reader.** Two different facts, both reachable: **yes**.
   - The file's declaration: `Dataset::declared_geometry_types()` (line 979-981 of engine/src/dataset.rs (at 086a7b9a)), from `GeoMeta.geometry_types` (line 352-356 of engine/src/geoparquet.rs (at 086a7b9a)). `None` means the key is absent; an empty list stays empty.
   - The engine's fact: `Dataset::geometry_encoding()` (line 970-972 of engine/src/dataset.rs (at 086a7b9a)).
2. **The change.** None.
3. **Ordering risk.** None. Same checks as above.

## `DatasetRef`
1. **Today's reader.** `DatasetRef::linked(uri, &ds)` (line 209-224 of kernel/src/dataset_ref.rs (at 086a7b9a)). It reads only accessors and does no reads of its own (module header, line 7-9 of kernel/src/dataset_ref.rs (at 086a7b9a)). `to_json` (line 239-293 of kernel/src/dataset_ref.rs (at 086a7b9a)) writes the entry. Reachable: **yes**.
2. **The change** (kernel). No new accessor is needed for the header. One `Result` needs handling: `linked` returns `RefBuildError::AssertionWithoutDefinition` (line 162-164 of kernel/src/dataset_ref.rs (at 086a7b9a), 351). Through `SkpHost::open_dataset` this can't happen, because the host always passes `definition_json: Some(...)` (line 1650 of kernel/src/skp.rs (at 086a7b9a)). So the handler needs either a code or a stated unreachable arm. §2.2's refusal list names neither.
3. **Ordering risk.** None in the object. `linked` copies the observation of the open (line 218 of kernel/src/dataset_ref.rs (at 086a7b9a)). That is ADR-036 §5's definition, so it is correct even if the file changed later.

## `SourceObservation`
1. **Today's reader.** `Dataset::descriptor()` (line 610 of engine/src/dataset.rs (at 086a7b9a)) leads to `SourceDescriptor::observation()` (line 281-288 of engine/src/descriptor.rs (at 086a7b9a)). It does no read and only copies what was read at open (doc, line 275-276 of engine/src/descriptor.rs (at 086a7b9a)). It has four public accessors (line 379-398 of engine/src/descriptor.rs (at 086a7b9a)). Reachable: **yes**.
2. **The change** (kernel).
   - Engine: none.
   - Kernel: ADR-036 §5's spelling of the observation exists only inline in `DatasetRef::to_json` (line 255-269 of kernel/src/dataset_ref.rs (at 086a7b9a)). `DatasetRef` has no `observed()` accessor; its accessors are `uri`, `locators` and `admission` (line 226-236 of kernel/src/dataset_ref.rs (at 086a7b9a)). The step's `data.identity.observed` needs that spelling factored into one crate-private function. Otherwise there would be a second serializer of the same member.
3. **Ordering risk.** The value is this open's, by design. A source rewritten without a recorded end passes the live check. Examples: a ChecksOnly open, or an open with no query since the rewrite. Only `check_source_unchanged` (line 630-632 of engine/src/dataset.rs (at 086a7b9a)) would catch that, and it is a new file read. `viewport_query` also ends the generation on that refusal (line 1466-1472 of kernel/src/skp.rs (at 086a7b9a)). §2.3 does not call it, which is consistent with H1.

## H1
**Holds as worded.** None of the five `dependencies` members needs a new file read. "Holds" does not mean "no engine change": the fields need the engine change above, and the types may need a second one (Q2). If Amendment 1 does not declare that change, it is I1. Block C's last sentence can stand once the change is declared.

## Changes to engine/ and kernel/ the piece would carry (class 9 where the form does not declare them)
1. Engine, `engine/src/predicate.rs`: `AdmittedPredicate` keeps its referenced column names and gains a `pub` accessor. Under Q2's surrogate option it also keeps their surrogate types. **Not declared.** It fits §2.13's conditional engine slot and §7's ≤ 160-line engine group.
2. Engine: one test file pinning the accessor, with its mutation (for example, the field left empty). **Not declared.**
3. Engine: `engine/README.md` owner's index, the "Filter admission" line names the accessor. Pointer only.
4. Kernel, `kernel/src/skp.rs`: `predicate_admit_error_of` is private (line 1712 of kernel/src/skp.rs (at 086a7b9a)). It becomes `pub(crate)`, or the handler lives in `skp.rs`. **Not declared.**
5. Kernel, `kernel/src/skp.rs`: the live check moves into one `pub(crate)` function (line 1436-1453 of kernel/src/skp.rs (at 086a7b9a)). **Declared** (§2.3 step 3).
6. Kernel, `kernel/src/dataset_ref.rs`: the observation's JSON spelling factored out of `to_json` (line 255-269 of kernel/src/dataset_ref.rs (at 086a7b9a)). **The work is not declared**; the path is.
7. Kernel, `kernel/src/dataset_ref.rs`: the handler maps `RefBuildError` (line 162-164 of kernel/src/dataset_ref.rs (at 086a7b9a)), as a code or a stated unreachable arm. **Not declared.**
8. Kernel, `kernel/src/permission/audit/log.rs`: `data_dir` (line 370) goes from private to `pub(crate)`. **Declared** (§2.3).

## Beyond the question (what moves §7 or the wire)
1. **The style seam has no single-value check in Rust.**
   - The only public entry in `renderer/src/style.rs` is `parse`, which takes a whole document (line 303 of renderer/src/style.rs (at 086a7b9a)).
   - `Rgb::parse` (line 93-104 of renderer/src/style.rs (at 086a7b9a)) and `number` (line 523-537 of renderer/src/style.rs (at 086a7b9a)) are private.
   - `Rgb::parse` accepts upper-case hex (`is_ascii_hexdigit`, line 95 of renderer/src/style.rs (at 086a7b9a)). Block C's row requires lower case.
   - Two routes exist: change the renderer, which is outside §2.13's paths and every §7 group, or wrap each value in a whole document. Either way the lower-case rule needs its own check.
2. **There is a window after the live check.** `viewport_query` has a second check, its attribute step (line 1503-1529 of kernel/src/skp.rs (at 086a7b9a)). `record_step` would have none.
   - A `close_dataset` whose `begin_close` (line 1601 of kernel/src/skp.rs (at 086a7b9a)) lands after the live check, or an end that lands there, does not stop the write.
   - The line is still true of the open. But the close ordering's "wholly before or wholly after" note covers `viewport_query` only (comment at line 1594-1596 of kernel/src/skp.rs (at 086a7b9a)).
   - The form must say where `record_step` linearizes (Q3). Any test pinning that adds to the kernel tests group.
3. **ADR-036 §6 leaves three values the writer must spell** (ADR text under OPEN-3, the ADR group's budget):
   - no state word for an absent `geometry_types` (`None`, line 979 of engine/src/dataset.rs (at 086a7b9a));
   - no closed vocabulary for `crs.source`, which today is `file`, `caller_asserted` or `format-rule` (line 110-116 of engine/src/crs.rs (at 086a7b9a));
   - no choice between the file's declared types and the engine's encoding (line 970 of engine/src/dataset.rs (at 086a7b9a)).

   §6's `dependencies` row also reads two ways: either "or a state" stands for the whole member, or for `geometry_types` only (line 113 of docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md (at 086a7b9a)).

Files read beyond the brief's list:
- `kernel/README.md` and `engine/README.md` (the owner's index sections)
- `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md` §2, as well as §6
