# engine: an existing single file whose path holds `[`, `]`, `{` or `}` opens as that one file, by the route step 0 selects for each character class, or is refused without a claim that it is partitioned. Full preregistration.

*Committed before any change. Append-only once committed; an amendment written after any outcome has been seen says so in its first line. PLAN node single-file-bracket-name-refused-as-partitioned, filler entry 8f. The form, its notes, its rule (00) table, the reuse index, the OPEN items and what could not be settled are the architect's draft (`state/consults/2026-11-06-single-file-bracket-name-refused-as-partitioned-form-architect-draft.md`, read only at main 43f9b1d5; extracted sha256 64a1c490b7cd6af4c0b6323915ca9087c9ca5aa461da362a43f9c22bc1c77078), carried byte for byte with these changes, all the custodian's: each cite the draft writes `path:line @ 43f9b1d5…` expanded by script to `path:line @ <commit> sha256:<the lines with their LFs>` (57 pins; 1 by a file name that resolves to one tracked path at that commit; 0 kept as written; cites without a commit kept as written); this lead line added under the draft's title; the draft's opening lines and its closing line dropped; the custodian's settlement added, and the Amendments heading at the end. Form path: `governance/forms/engine/SINGLE-FILE-BRACKET-NAME-REFUSED-AS-PARTITIONED-PREREGISTRATION.md`. The custodian keeps the PLAN node on main.*

## Header

- **Title:** a single existing file whose path holds a bracket or a brace is no longer refused as partitioned across more than one file.
  - Step 0 observes, at the real boundary, what the pinned DuckDB does with such a path, one character class at a time.
  - Each class then either opens through a literal route, raw or escaped, or keeps a refusal whose message makes no partitioned claim.
  - The directory half, and the `*` and `?` half, are unchanged.
- **Authority:**
  - PLAN node `single-file-bracket-name-refused-as-partitioned` (governance/PLAN.yaml:6787-6803 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:05d29350a4dc80f9275c22fcbc20a4966ed513453da3f936330ec7d8cf2ab283), filler queue entry 8f, S2 (state/FILLER-QUEUE.md:30 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:285a00a689086b94f8f74332d6ac58b7aaab1e6b63b4c117fa1fa220b98f24cf).
  - Placed by the human's ruling of 2026-11-05 (evening), item 2 (state/directives/2026-11-05-8c-full-form-nine-s2-placed-u12-slot-2-u1-reproducer-adr-notes-words-e2e-readme-words-8b-d3.md:12 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:0716aaeb23d7190aa121ee6d6ebd123da1e5ca063bf3a65d6e8a440cd8c9ed10; a sub-line span, the line's hash). Paraphrase: U17 as its own node, after 8e. The refusal's advice cannot be followed in the app, and the message is an engine fact under P6.
  - lead-data's impact read (state/consults/2026-11-06-single-file-bracket-name-refused-as-partitioned-impact-read-lead-data.md): a reading, not Authority.
  - The human's rulings on gate rounds of 2026-11-05, Part 1, items 1 to 9, by reference (state/directives/2026-11-05-main-architect-gate-rounds-part-1-rulings-review-packet-design-part-3-additions.md:28-64 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:b7b9954b95c6a23808cc8a2fbacb8b6157335e23da53ccda20f4a35ba8e05e8a).
  - The filler rule, AUTONOMY.md §36 (governance/AUTONOMY.md:692 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:1135b89c01d0e676bce0bc42a4d6710af445fa0ae95ed12ef6ca0fef7a4d4e84).
  - OPEN items that are not red lines are taken under the direction of 2026-10-31, item 4 (state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md:14 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:30b606119103bd1340cb6c72f7508d5780556097b85311fefb96f666ea5c6b38), which holds until 2026-11-09 (state/directives/2026-11-03-away-until-11-09-276-open-1-seven-clauses-open-4-c-placed-sitting-wording-leaves-slot-cloud-credit.md:6 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:5c2e1399389aad0106932f484fda92f351ad5394ac421a6988115716a0452e83).
  - The reuse index found no prior art on either search (`single file partitioned refusal glob bracket`; `file name glob metacharacter escape`). The misses are noted here. The output is reproduced below.
- **Drafted by:** the architect, on the custodian's brief, read only at main 43f9b1d5.
- **Order:**
  1. This form is committed first.
  2. Step 0 (§9) runs, with nothing committed.
  3. A class 1 amendment records step 0 and the shape §3's table selects, which binds that shape's §7 ceiling.
  4. Only then is any code written, and none before PR #290 merges.
- Append-only once committed. An amendment written after any outcome has been seen says so in its first line.

## §0 Disclosure

1. **The behaviour at main.**
   - The gate is the first statement of `open_inner`, ahead of the file check and of any identity work (engine/src/dataset.rs:319-327 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:a2f4bac2379da21f4080168616428bb0058620d1f5b4c7458c20b4d90d7e0c6a). A path that is not a file is then refused as `engine.source` (:328-333).
   - `partitioned_source_detail` refuses in two cases (engine/src/dataset.rs:1838-1889 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:3f21c110597cfeda79c5c089fbc2466b93a3d5f06dddca2157554869f48b93d2):
     - a directory, which is a stat (:1850-1852);
     - otherwise, the prefix-stripped path text containing any of `* ? [ ] { }`, by text alone (:1858-1887).
   - Its comment records refusing an existing literal file as the accepted trade-off (:1862-1880).
   - Display: engine/src/error.rs:386-391 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:26ebfe880888e518236a7338f573806b639a7a585a25aa1612b4217c48fdf6d4. The variant is at :182-189.
   - Wire: the message is the Display, unchanged, and the variant maps to `identity_ordinal_partitioned_unsupported` with `detail` (kernel/src/skp.rs:2113-2114, :2164-2167, :2271-2273 @ 43f9b1d56cba370a2e932171521278299ecc4bec).
   - The shell renders the code, the message, the fields and `refusalGuidance` (frontends/shell/src/admission/RefusalBlock.tsx:24-42 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:ca3120c905ee07ada4a9c08b11493318a0c43728bb738d5a42213fdbabbef1ff). For this code the guidance is frontends/shell/src/admission/formatRefusal.ts:112-117 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:ee34d62a0511e2cc86f782b3645e0ef60f3e6cc48af73580c3e172dbfe6f33ad.
   - No form opens for this code (frontends/shell/src/admission/AdmissionPanel.tsx:28-33 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:5420d562e2298f61372088b2d7ad273af0004b7d8304b2f0daf79ad86ef0015f).
   - Paths come only from `pick_file` (frontends/shell/src-tauri/src/commands.rs:233-246 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:a11d55e99149c98e66c40c21c790f85e0d842deaccf8a6e95ef4bfe62cad726f).
2. **What is not known: DuckDB's behaviour.**
   - The pinned crate is `duckdb` 1.10505.0, bundled (engine/Cargo.toml:48 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:dcaabe03d2217f978d9ac63f637d4b0ae3037ee2dd772d3ff4a20a018a2af81a; `Cargo.lock:541-542` and `:1185-1186` at 43f9b1d56cba370a2e932171521278299ecc4bec).
   - That build vendors DuckDB v1.5.5, per an earlier form's reading of the tarball (governance/forms/engine/STREAM-FETCH-OVERFLOW-FIXED-DETAIL-PREREGISTRATION.md:31 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:64fa2abda55a9c13e780a25213f32d4ba5a1777d248948d76320c260faa1fce0): a record of that form, cited for what it recorded.
   - The engine's comment says DuckDB expands `[...]` and `{a,b}` (engine/src/dataset.rs:1862-1865 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:88cb6702ad61010ada659f5748693fc47ab47964c481d2b10f7f85561f4eff92). No test or run on record observes it. The one test of these characters opens paths at which no file exists (engine/tests/session_identity.rs:688-702 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:7c3207340c54957547a5b02369e4b4e0775ba054507ff314a8b96c8494dbc650).
3. **Hypothesis H-LIT** (labelled; discriminator: step 0, cases K1 and K6). The pinned DuckDB may return a path that exists literally without expanding it.
   - The only evidence: a canonicalized Windows path, which carries `?` in its `\\?\` prefix, reaches DuckDB raw and opens (engine/tests/session_identity.rs:297-306 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:29c3651b9021136d2b2b2c4a96634551623486339f7c91dad52803f1d846c3ab).
   - Why that is so is not established here.
4. **The DuckDB file-reading sites at main** (each receives the raw path string). The worker re-derives them at the base by grep (§9).
   - Bound: engine/src/dataset.rs:1082, :1115, :1128, :1434, :1711, :1741 @ 43f9b1d56cba370a2e932171521278299ecc4bec; engine/src/stream.rs:1445 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:c67caaf87b32a4b6b8fdece0393f89a206171e57a24951223f8a9582f4a3e3f7; engine/src/rowgroup.rs:390-391 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:d5098e0e7488a1b0732f9a8f6cfd756ab1d4214cbca73e042d9129e01cf0a41b.
   - Interpolated: engine/src/dataset.rs:1804-1806 and :1994-1999 @ 43f9b1d56cba370a2e932171521278299ecc4bec; engine/src/index.rs:325-326 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:4b9761c549ffeef740e60c2f4b09516dc849653ff8dbf4f4a318a1e8bf8a959e.
   - Fixture-only, behind the `fixture` feature (engine/src/lib.rs:109-119 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:71f97a8ca79cabcd501332946770e5dc6964fc1d681697ffb530a56c9b33d293): `engine/src/layout.rs`.
5. **The recorded trade-off this piece reverses** (OPEN-1):
   - governance/forms/engine/ADMISSION-PREREGISTRATION.md:662-672 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:06aac42370800232062d252ae369b491b98aac0a1b901848de45fbf836c42f23 (Amendment 2, item 8);
   - the same file's correction of it, :816-821 (Amendment 3, item 10).
   - Both are immutable. This form records the reversal and edits neither.
6. **No fixture-drive confound.** Nothing is measured against the 5 GB fixture.

## §1 What this preregistration may and may not claim

- **May claim, once §4's tests are green on the Windows and Linux L1 entries.** On the build of record (duckdb 1.10505.0 / DuckDB 1.5.5; Windows compiled with clang-cl per `.cargo/config.toml`; Linux as CI builds it):
  - For each character class the class 1 amendment records as RAW or ESCAPED (§3), an existing single file whose path holds that class's characters is admitted. Every row the engine streams from it is that file's, which is asserted against decoy files beside it.
  - For each class recorded as REFUSED, such a file is refused under the existing code. Its message and detail make no claim that the source spans more than one file.
- **May not claim:**
  - Any DuckDB or crate version other than the pinned one, or macOS, until port-2's macOS entry has run §4's tests.
  - A file whose path holds `*` or `?`. These are unchanged: refused by text whatever is on disk, and creatable only off Windows.
  - Under RAW for a class that step 0 records as R1 (§3): what is read if the literal file is removed between the engine's pre-check and DuckDB's call. That residual is bounded by the existing read-around checks (docs/adr/ADR-016-stable-feature-identity-admission.md:217-223 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:250bcd31c211e82661a5b29e6313f2f3ea2d37c1612159f4d476650596fae3b8), needs timing inside one request, and is named in the source comment.
  - Any run time or `docs/08` figure, including the cost of DuckDB listing a directory for an ESCAPED path.
  - That the directory refusal's advice can be followed. It is unchanged and unreachable from `pick_file`.
- **ADR readings, none amended:**
  - ADR-016 Amendment 1 §5 (docs/adr/ADR-016-stable-feature-identity-admission.md:230-232 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:8e2bc012195b51aaebeb836c0691c2388eb143ab8f444f2fbe0b04d16180e63b) admits a single file and refuses a partitioned source by name. Every shape keeps it true.
  - The human's settled boundary 7 and A5 say the same (state/drafts/post-tag/DRAFT-2-BRIEF-A-admission-and-session-lifecycle.md:61-63, :81 @ 43f9b1d56cba370a2e932171521278299ecc4bec).
  - ADR-006: open's class is untouched. ADR-010 rule 6: the constants are declared in §7.
- **Wire:**
  - No literal, field, command or fixture changes, and skp/0.12 stands (protocol/skp/src/v0/mod.rs:115 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:060d4f4517eb8e7d80ae0842026dcbf9a6bd75c9a03df1e01a708cdc3708c8ab).
  - Under RAW or ESCAPED, SKP-V0 §1's refusal sentence (protocol/skp/SKP-V0.md:31-34 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:7e6773ea853096efcc161a3d93fe88028d2fae42988f6dfe81b76ad47c277864) becomes untrue and is rewritten in the human's words at the click (§2.6). That is a §21a wire touch.
  - Under REFUSED with OPEN-2 (A), nothing under `protocol/` changes.
- **Strings:**
  - Under RAW or ESCAPED, no user-visible string is added or changed.
  - Under REFUSED, the new Display, its detail and the shell guidance are `[P6 placeholder]`s (§2.5).
- **Portability (R3, docs/PREREGISTRATION-TEMPLATE.md:177 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:6f5f5efc2cfb92e6b7c14bd23f0087adbb53769df674affdb4c1a2e2819a33b0):**
  - Owning boundary: engine open admission.
  - Windows: observed (step 0) and tested (§4).
  - Linux: tested by §4 on L1, with no step 0 run there.
  - macOS: not claimed.
  - The reduction off Windows (`*` and `?` file names, still refused) goes into KNOWN-LIMITATIONS item 20, in the human's words.

## §2 The change, stated before it is applied

**2.1 The gate** (engine/src/dataset.rs, `partitioned_source_detail`, every shape). In this order:

1. A directory is refused, unchanged.
2. A path text with `*` or `?`, after the prefix strip, is refused, unchanged, whatever is on disk.
3. A path text with `[`, `]`, `{` or `}` that is not an existing file is refused, unchanged: the same variant and detail.
4. A path text with those characters that *is* an existing file takes the route of the characters' class, as §3 selects:
   - RAW or ESCAPED: `None`, so it is admitted.
   - REFUSED: §2.5's variant.
5. Otherwise `None`.

The single added stat is `is_file` at step 4. This is the reversal of the recorded trade-off (OPEN-1).

**2.2 RAW** (no site changes). No DuckDB site is touched; DuckDB receives the raw path, as at main.

**2.3 ESCAPED.**
- One private helper (crate-visible at most, no `pub` item) maps the ESCAPED classes' characters, in one pass over the original text, to the form step 0 recorded as E-OK.
- It is applied at every DuckDB site in §0.4 outside `layout.rs`, and nowhere else. On the interpolated sites it runs before the quote doubling.
- `Dataset::path()` (engine/src/dataset.rs:953-955 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:a64a34649d0cf0c27bdb22bb6673b4dab7707d388334a63478c18916308453a5) and every non-DuckDB consumer keep the raw path: descriptor, pin, watcher, LOD, index content hash, describe and the dataset reference.

**2.4 Comments, written after the code** (Part 1, item 1). No words are drafted here.
- The doc and comments of `partitioned_source_detail` (:1838-1880) and the gate comment (:319-324) must cover:
  - the five steps;
  - what step 0 observed, citing the class 1 amendment;
  - each class's route;
  - under RAW for an R1 class, the residual of §1;
  - that `*` and `?` are decided by text;
  - no claim about DuckDB that step 0 did not observe.
- The doc of `every_glob_metacharacter_read_parquet_expands_is_refused_by_name` (engine/tests/session_identity.rs:678-686 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:29645a523e585ff713a6998222a6183a1e45b586a6ec14e5d8f2da311b7cfbc3) must stop stating the refused-literal trade-off.
  - The test's name is kept unless step 0 records a class it names as one DuckDB does not expand (R0). In that case the worker renames it, after showing at the base that no record `verify-test-claims` reads names it (invalidator I-7).
  - `a_glob_source_is_refused_by_name_and_a_plain_missing_path_is_not` is named by a closed form (governance/forms/protocol/SKP-V0-LIVE-SECTIONS-AREA-C-PREREGISTRATION.md:127 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:5f71d8ed9637148069cef11780e8452f2c47d72b0684c632bb0b4b423cdba1dc). Its name and assertions are kept.

**2.5 REFUSED** (only for classes §3 records as REFUSED; OPEN-2 (A)):
- engine/src/error.rs: a second variant for an existing file whose path holds a class's characters. It carries a `detail` naming the path and the character, with its own Display:
  - engine facts only (round 7), with no remedy and no partitioned claim;
  - beginning `[P6 placeholder]`.
- kernel/src/skp.rs: `error_of` maps it to the existing `identity_ordinal_partitioned_unsupported`, with `detail`. No new wire code.
- engine/tests/admission_p4_corpus.rs: one arm in `code_of` (:400-402 @ 43f9b1d56cba370a2e932171521278299ecc4bec).
- The directory text stays byte for byte, so the protocol fixture (protocol/skp/tests/data/v0-error-identity_ordinal_partitioned_unsupported.json:1-7 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:6fd25a9a1da6e845445d87ff204834a4ec565995bcc8814614e17ab110ae05ec) is unchanged.
- frontends/shell/src/admission/formatRefusal.ts:112-117: the guidance is rewritten after the code as a `[P6 placeholder]`. It must be true for a directory and for a single file alike, make no partitioned claim, and name a remedy the app's user can take: renaming outside the app.
- Its test (frontends/shell/src/admission/formatRefusal.test.ts:173-182 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:d07377ad96c6537910daa3be70f16b32c41ea9a5aacecec8e6acefa42120fa1f) is changed to match. Its comment's claim that declaring a column works goes.

**2.6 Records the piece changes:**
- KNOWN-LIMITATIONS.md item 20 (:269-278 @ 43f9b1d56cba370a2e932171521278299ecc4bec), every shape.
- SKP-V0 §1's sentence (protocol/skp/SKP-V0.md:31-34 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:7e6773ea853096efcc161a3d93fe88028d2fae42988f6dfe81b76ad47c277864), under RAW or ESCAPED.
- Both are the human's wording, approved at the click (§6 of the notes below).
- engine/README.md (OPEN-8 (A)):
  - the Open and admission row's pinned-by list gains E1 (:539);
  - the Last verified line gains its clause (:537);
  - the preregistration list gains this form (:557), all @ 43f9b1d56cba370a2e932171521278299ecc4bec.

## §3 Step 0: fixtures, observations and the selection table, fixed before step 0

**Fixtures.**
- Written by the real producer, `spatial_engine::fixture::write_geoparquet` (engine/src/fixture.rs:860-862 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:cbbadef5118d18073afa37e2aed321fbf04ba56056e939a638b96041889659f8), with the `keyless()` shape of engine/tests/session_identity.rs:55-62 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:0674915876ce481b278c6e4373e304476ae1ff7dfdaad9aad10a4b664b530d20.
- The literal L has 500 features. Decoys have 300 and 200 features, with different seeds.
- One fresh directory per case, holding only these files. Each file's sha256 is recorded before and after.

| Case | Literal L | Decoys | Class |
|---|---|---|---|
| K0 | `zones.parquet` | none | control |
| K1 | `zones[1].parquet` | `zones1.parquet` | B |
| K2 | `zones[12].parquet` | `zones1.parquet`, `zones2.parquet` | B |
| K3 | `zones{a,b}.parquet` | `zonesa.parquet`, `zonesb.parquet` | C |
| K4 | `zones].parquet`; `zones[.parquet`; `zones}.parquet`; `zones{1}.parquet` (+ decoy `zones1.parquet`) | as listed | B, B, C, C |
| K5 | `dir[1]/zones.parquet` | `dir1/zones.parquet` | B, in a parent directory |
| K6 | K1's L in its `std::fs::canonicalize` form | as K1 | B, canonical |
| K7 | K1, K2, K3 and K5 with L removed | as each | literal-absent controls |

Class B is `[` and `]`. Class C is `{` and `}`.

**Forms per path**, each a string built from the engine's path text:
- F-raw;
- F-escB: `[` becomes `[[]` and `]` becomes `[]]`;
- F-escC: `{` becomes `[{]` and `}` becomes `[}]`;
- F-escBC: both mappings.
Each form is built in one pass over the original text.

**Observations per (case, form)**, on `spatial_engine::fixture::configured_connection()` (engine/src/fixture.rs:58-64 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:5dded6ddc33f7e1c9dcec94aa8c985499e303e02baafa25b39ff8736c44fa5d1), which is the engine's own `pool::configure_connection`:
- O1: `glob(?)`: the files it lists, or DuckDB's error text verbatim.
- O2: `read_parquet(?, filename=true)`: row count and the distinct file names, or the error verbatim. If the option itself is refused, that is recorded and the count alone is taken.
- O3 to O5: `parquet_kv_metadata(?)`, `parquet_schema(?)` and `parquet_metadata(?)`: their file-name column where one exists, else the row count, or the error verbatim.
- O6: the interpolated form `read_parquet('<form, ' doubled>')` for F-raw and every escape form: count and file names.
- O7, at main, at the engine boundary: `Dataset::open_cancellable(L, None, None, &CancelToken::new(), PoolConfig::default())` for every existing-L case. The partitioned refusal is predicted.
- O8: the vendored DuckDB source's functions that decide whether a path is a glob and how it is matched, byte-copied with package root and line. This is a reading, recorded beside the runs and never in place of them.

**Per class, the outcome.** Each is the worst over that class's cases, in the order R2 worse than R1 worse than R0.
- **R0:** F-raw with L present reads exactly L on O1 to O6, and with L absent (K7) reads no file.
- **R1:** F-raw with L present reads exactly L everywhere, but with L absent reads one or more decoys.
- **R2:** anything else with L present: a decoy, both, nothing, or an error.
- **E-OK (an escape form, per class):** with L present it reads exactly L on O1 to O6, for every case of the class including K5 and K6; with L absent it reads no file.

**The selection table** (the step 0 result picks the shape by these words):

| Class outcome | Route |
|---|---|
| R0 | RAW |
| R1 | RAW, the residual named (OPEN-6 (A)) |
| R2, with an E-OK form | ESCAPED, with the first E-OK form in the order escB, escC, escBC |
| R2, with no E-OK form | REFUSED |

The piece's shape is the union of the two classes' routes:
- RAW: both classes RAW.
- ESCAPED: at least one class ESCAPED, and none REFUSED.
- REFUSED: both classes REFUSED.
- MIXED: one class REFUSED, the other RAW or ESCAPED.

## §4 Tests, and the mutation per new test

**E1** `an_existing_single_file_whose_name_holds_a_bracket_or_a_brace_opens_and_streams_only_its_own_rows`. RAW, ESCAPED and MIXED; new file `engine/tests/single_file_bracket_name.rs` (OPEN-5 (A)).
- **Rows:** the K1, K2, K3, K4 and K5 shapes of the classes routed RAW or ESCAPED, each beside its decoys. Each row is written keyless (the session tier) and once with `IdentityMode::NativeUnique` (engine/src/fixture.rs:530-532 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:c4d095528da026a72864f532abc45e4ef6753699737506e2d3ae3564e3ccf3c8).
- **Path:** `Dataset::open_cancellable`, then `Dataset::stream(&ViewportQuery::all())` drained, as engine/tests/session_identity.rs:671 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:7e46af435fac8de845358a1a3ef8289cf2c66ff749c73bfa75ede2ca78c42747 uses it.
- **Asserts:**
  1. Admitted.
  2. The rows streamed equal L's feature count, and differ from every decoy's count and from any sum.
  3. The ids are distinct and as many as the rows: a multi-file read repeats ordinals.
  4. Every file's sha256 is unchanged.
- No `#[ignore]`, `cfg`, sleep or retry.
- **M1:** the gate restored to scan every metacharacter by text before the stat, as at the base. Predicted to fail by name at assertion 1.

**K1** `open_dataset_admits_an_existing_bracket_named_file_and_describe_reports_only_its_rows`. RAW, ESCAPED and MIXED; new file `kernel/tests/single_file_bracket_name_open.rs`.
- Through `SkpHost::open_dataset`, then `describe`, on the harness of kernel/tests/describe_crs_unit.rs:41-63 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:1aa8a011451604de6d9c0db17487500580fafcfac1b80ca093e0a73a1de3b19e, with K1's shape and decoy.
- Asserts that the open is Ok, and that `row_count` and `extent` (protocol/skp/src/v0/commands.rs:275-276 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:90cef166dfaa671f91335692247ee842c295225b66d0702f14c1451620b0252d) equal the writer's facts for L and differ from the decoy's.
- **M1** as for E1. Predicted to fail by name at the open.

**T2** `the_reader_path_matches_only_the_literal_file_and_nothing_once_it_is_gone`. ESCAPED only; `engine/src/dataset.rs` mod tests.
- The helper's output for each ESCAPED character, read through `glob` and `read_parquet` on a configured connection.
- With L present: only L. With L absent: no file.
- DuckDB's no-match error is observed from DuckDB, never written as a string (Part 1, item 7).
- **M2:** the helper returns its input. Predicted to fail by name at the L-absent row.
- **M3:** one character dropped from the escaped set. Predicted to fail by name at that character's row.
- E1 also fails under M2 wherever the class is R2.

**E-D** `an_existing_single_file_whose_name_holds_a_refused_character_is_refused_without_a_partitioned_claim`. REFUSED and MIXED; in E1's file.
- An existing L of each REFUSED class is refused with §2.5's variant.
- The detail is asserted by structure: it names the path and the character.
- The message does not contain `more than one file`. It is not asserted verbatim, since it is a placeholder.
- **M4:** the gate constructs the old variant for an existing file. Predicted to fail by name.

**K-D** `open_dataset_sends_the_pattern_refusal_under_the_partitioned_code_with_its_detail`. REFUSED and MIXED; in K1's file.
- Through `SkpHost::open_dataset`: the code is `engine.identity_ordinal_partitioned_unsupported`, `detail` is present, and the message equals the engine Display.
- **M5:** `error_of` maps the new variant to `engine.source`. Predicted to fail by name.

**The shell guidance test** (REFUSED and MIXED; changed): formatRefusal.test.ts's case for the code asserts by structure that there is no partitioned claim and that a rename remedy is named. **M6:** restore the old guidance. Predicted to fail by name.

**Each mutation is observed** by applying it alone, running the named test, recording the failing assertion and the full commit id in a `RECORDED MUTATION:` doc line, and reverting. No `verify-mutation` run is called an observation (docs/PREREGISTRATION-TEMPLATE.md:172 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:316062ef43090b93187b8410a97bdd9d3424fa747dd09f4cafe84906622e88c2).

**A standing guard:** for an R1 or R0 class, E1's decoys make a later DuckDB bump that expands a present literal (R2) fail E1 by name.

**Existing tests that stay green, assertions unloosened:**
- `a_directory_source_is_refused_by_name_rather_than_as_an_unreadable_file`;
- `a_glob_source_is_refused_by_name_and_a_plain_missing_path_is_not`;
- `every_glob_metacharacter_read_parquet_expands_is_refused_by_name` (§2.4 on its name);
- `the_vendored_duckdb_exposes_file_row_number_on_read_parquet`;
- kernel/tests/typed_terminal_codes.rs:380-398 and kernel/tests/no_generation_in_persisted_artifacts.rs:349 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:4c11860afbdf0a2373aebdbcb3b60072b4a0d4b83f814d3f4bd4f063e3abdccb.

## §5 Predictions, declared unchanged, invalidators, falsification

**Predictions:**
- O7 refuses every existing-L case at main.
- At the head, the tests of the selected shape are green on both L1 entries, and M1 to M6 fail as §4 says.
- No class outcome is predicted. Step 0 is the observation, and the table decides.

**Declared unchanged:**
- The directory half: detection, the detail (engine/src/dataset.rs:1851 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:62727cdef5b0f6ee01e9749a8a5b75fcccc7e031aa86215ec27d761ae63c6164), and its Display text byte for byte.
- The not-a-file refusal for all six characters, and its detail (:1883-1886).
- `*` and `?` by text.
- The wire code, `error_of`'s existing arm, skp/0.12, and every file under protocol/skp/tests/.
- Every ADR. The ADMISSION form and the area C form. frontends/shell/MANUAL-WALKTHROUGH.md (row N9 at :954 @ 43f9b1d56cba370a2e932171521278299ecc4bec, and the Part N records).
- frontends/ under RAW and ESCAPED.
- engine/src/lib.rs (port-2's path), `layout.rs`, Cargo.toml, Cargo.lock and kernel/README.md.
- No `pub` item except, under REFUSED, the one variant, whose product callers are the gate and `error_of`.

**Invalidators.** Each stops the piece and goes to the architect unless marked:
- I-1: a step 0 observation fits no row of §3 (function families disagree, K6 differs from K1, or the two processes differ).
- I-2: O7 admits any existing-L case at main.
- I-3: at the base, a DuckDB file-reading call in engine/src outside §0.4 (outside `layout.rs`).
- I-4: the selected shape needs a file outside its §7 list.
- I-5: SKP-V0's versioning rule (protocol/skp/SKP-V0.md:302-303 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:cfd868052f8626a1cefad41a65b1878172fbfbc1c978a438c1163025b5306c20) read at the base as requiring a version change for the shape. Goes to the human.
- I-6: OPEN-2 (B) is wanted. Goes to the human.
- I-7: a test to be renamed is named by a record `verify-test-claims` reads. The name is kept.
- I-8: E1 on any CI entry reads a decoy row.
- I-9: under REFUSED, an exhaustive match over `EngineError` outside §2.5's files.
- I-10: step 0 over §7's ceiling.
- I-11: a literal route in DuckDB's source (O8) that §3 does not list. It is recorded, not used. Using it needs an amendment that declares its §2, §4, §5, §8 and §9 items, and a step 0 re-run for it, before code.

**Falsification:** at the head, an admitted file of a RAW or ESCAPED class yields any row from another file; or a REFUSED class's message claims more than one file; or the directory's text or the fixture changes.

## §6 Instruments

Every quantity is an assertion: typed outcome, row count, distinct ids, file names, fixture hashes. Step 0's wall time is an observation for §7's ceiling only.

## §7 Declared values and ceilings

- **Fixtures:** L has 500 features. Decoys have 300 and 200. `avg_vertices` is 12, as `keyless()`.
- **Step 0:** two processes; a ceiling of 600 s per process on the machine, in the test profile (OPEN-7). Not a measurement.
- **Size, per shape.** Counting command: `git diff --numstat origin/main...HEAD -- <the shape's paths>` at a named commit. Excluded: this form, PLAN.yaml and FILLER-QUEUE.md. An overrun is class 8 and this line is not edited. Estimates are mine and unmeasured, with rustfmt's growth allowed for.

| Shape | Files | Ceiling | Estimate |
|---|---|---|---|
| RAW | engine/src/dataset.rs, engine/tests/session_identity.rs, engine/tests/single_file_bracket_name.rs, kernel/tests/single_file_bracket_name_open.rs, protocol/skp/SKP-V0.md, KNOWN-LIMITATIONS.md, engine/README.md (7) | 360 lines | ~290 |
| ESCAPED | RAW's 7, plus engine/src/stream.rs, engine/src/index.rs, engine/src/rowgroup.rs (10) | 480 | ~390 |
| REFUSED | engine/src/error.rs, engine/src/dataset.rs, kernel/src/skp.rs, engine/tests/admission_p4_corpus.rs, engine/tests/session_identity.rs, the E1 file, the K1 file, formatRefusal.ts, formatRefusal.test.ts, KNOWN-LIMITATIONS.md, engine/README.md (11) | 380 | ~300 |
| MIXED | the union of the routes taken (at most 15) | 640 | ~560 |

- **Budget:** the node's 120 minutes is the custodian's to revise. Builds under holds are excluded.

## §8 Block-on-sight

1. Any code before the class 1 amendment, before #290 merges, or before the human's answers to OPEN-4 and (under RAW or ESCAPED) OPEN-3.
2. A route for a class other than the one §3's table selects.
3. Under ESCAPED, a DuckDB site in §0.4 that bypasses the helper, or the helper applied to a non-DuckDB consumer.
4. The directory's text, the fixture, the wire code, the literal, or `*` and `?` changed.
5. A new wire code, a dependency, or an edit to Cargo.toml, Cargo.lock or engine/src/lib.rs.
6. A comment, doc or test-text clause not checked against the built code, or a claim about DuckDB that step 0 did not observe.
7. KNOWN-LIMITATIONS item 20 or SKP-V0's sentence merged without the human's approval at the click.
8. Any test `#[ignore]`d, `cfg`-gated or loosened, or an existing assertion weakened.
9. A mutation not observed as §4 says, or a `verify-mutation` run called an observation.
10. A new user-visible string not marked `[P6 placeholder]`.
11. Step 0 or any probe on a shared cargo target, or anything from it committed.
12. A path outside the selected shape's list, or in §(00)'s in-flight lists unless that list's condition is met.
13. Any CI entry red.

## §9 Gates and sequence

1. **This form is committed** on main by the custodian, with its settlement.
2. **Step 0, by a tester-high, nothing committed.**
   - Machine rules apply, shared hold only (§36).
   - A new detached checkout at main under C:/dev/wt/, on its own new target, with main's clang-cl build. The tester records `.cargo/config.toml`'s sha256 and `clang-cl --version`.
   - An untracked probe test runs §3 in two processes.
   - Stops: I-1, I-2, I-10, I-11.
   - The report goes under `state/consults/`, in the shape of state/consults/2026-10-28-stream-fetch-overflow-fixed-detail-step0-tester-high-report.md.
   - Step 0 may run before #290 merges. Under §36's one filler at a time, that is the custodian's call.
3. **A class 1 amendment** (references and hashes) records the class outcomes, the shape and its §7 row.
4. **Code, by a worker**, in its own checkout and on its own new target.
   - Base checks first (the §9.8 greps).
   - Code, then comments.
   - M1 to M6 as the shape needs them.
   - The full suite in a shared hold before any gate (Part 1, item 4).
5. **The draft PR, then both gates from dispatch**, from one packet (Part 1, item 5):
   - the architect: §1's readings, the route against §3's table, §8 item by item;
   - the reviewer: the full diff; the seams (the engine gate to `error_of` under REFUSED; `SkpHost::open_dataset` to the engine) against their real interfaces; every comment clause by clause.
6. **The words:** KNOWN-LIMITATIONS item 20 and SKP-V0's sentence are drafted by the worker from the built code, checked clause by clause by both gates, and come to the human with the code (Part 1, item 1).
7. **Operator:** no new walkthrough row. The custodian notes, for the next sitting, that a bracket-named file now opens, or is refused by the new placeholder.
8. **Verification:**
   - The worker, at the base, each grep self-tested positive:
     - `git grep -nE "read_parquet\(|parquet_metadata\(|parquet_kv_metadata\(|parquet_schema\(|parquet_file_metadata\(|glob\(" -- engine/src` against §0.4;
     - `git grep -n IdentityOrdinalPartitionedUnsupported`;
     - `node scripts/plan/verify-test-claims.mjs`, for I-7.
   - The worker, at the head:
     - `cargo fmt --all --check`;
     - `cargo test --workspace --locked`, in full;
     - under REFUSED, `npm run verify` in frontends/shell (the check product-ci-shell.yml runs, .github/workflows/product-ci-shell.yml:212 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:2739fcce95d74e4de1587af9b30a2b43c07306617f8cbf7f8a7f5b064f3f1b73);
     - each mutation;
     - §7's command;
     - `git diff --name-only origin/main...HEAD`;
     - `verify-cites.mjs`, `verify-quotes.mjs` and `verify-test-claims.mjs`;
     - `node --test` over the scripts suite, before pushing.
   - The gates re-run the full suite at the reviewed head and re-observe each mutation.
   - CI: both L1 entries of product-ci-rust (.github/workflows/product-ci-rust.yml:234 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:a9a5f7dfd80682cf7c1f55f66873911fb936d9a5379c813aa09d8e36cd73e74a), rust-fmt, product-ci-shell under REFUSED, and governance CI.

# Rule (00), path by path

Rule (00): governance/AUTONOMY.md:609 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:db1a80acb95c7872de091ec4a4eb9647e09c17b0a5475050b4d934e0a39e2bd0. Separate KNOWN-LIMITATIONS items count as separate paths (state/directives/2026-10-18-229-not-i6-item-23-words-approved-no-release-line-rule-00-e2e-readme-entries-227-merged.md:14 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:551c2c8c99555a9cf256d5cc1279d1c659a809b72cf150094b8574206ec63c92).

| In flight (the brief's lists, at main 43f9b1d5) | Overlap |
|---|---|
| U1, `cut/publish-session-tier-identity` (#289) | KNOWN-LIMITATIONS.md only. The custodian checks whether its hunks touch item 20 (:269-278). kernel/README.md is not this piece's (OPEN-8). |
| 8e, `cut/skp-filter-dialect-unsupported-ruling` (#290) | protocol/skp/SKP-V0.md (RAW, ESCAPED) and kernel/src/skp.rs (REFUSED). No code before it merges. |
| `cut/kl-pair-human-answers-c1-c3-and-draft-marks` (#291) | KNOWN-LIMITATIONS.md: item 20 is checked by hunk. |
| `cut/e2e-readme-security-posture-measure-build` (#292) | None. |
| area A, `cut/shell-comments-drift-sweep-area-a` | None. It edits DescribeSummary.tsx; REFUSED edits formatRefusal.ts and its test, separate files. |
| `cut/port-2-macos-l1-and-app-dirs` | KNOWN-LIMITATIONS.md, checked by hunk. engine/src/lib.rs is not touched (§8 item 5). |
| 1c, `cut/b2-piece-1c-save-and-reopen` (step 1) | No shared path. 1c's form reserves `protocol/` for steps 1 to 3 (governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:581 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:f5c200ecfddd35bbc900c196b0b388c27dc2ff3a37ab5bcd54fb96268734f2e6), with one exception for 8e by the human (:1142). RAW and ESCAPED touch SKP-V0.md: OPEN-3. |

# The reuse index (byte for byte from the brief; no prior art, a miss)

```text
$ node tools/reuse.mjs single file partitioned refusal glob bracket   (exit 1)
No prior art recorded for "single file partitioned refusal glob bracket". Research it before planning an implementation.
$ node tools/reuse.mjs file name glob metacharacter escape   (exit 1)
No prior art recorded for "file name glob metacharacter escape". Research it before planning an implementation.
```

## §10 Amendments (opens empty; append-only)

---

## Notes (mine)

1. **The route.** Every shape crosses §21c (governance/AUTONOMY.md:349-357 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:c99b2fcabe5d66acf6c904d268db4cb8f1d2451a4429bcba596b0381a2749159): by lines, and by its fourth bound, new user-visible behaviour, under RAW and ESCAPED. RAW and ESCAPED also touch §21a's wire category (:323-324), through SKP-V0's spec sentence.
   - So this is the full form with both gates. §36's five-line condition is not met, and keeping the piece in the filler slot is OPEN-4.
   - The open shape is bound by §7's table: the class 1 amendment names the shape, and that row binds.
2. **The custodian's question 1 cites "Amendment 2, items 8 and 10".** Amendment 2's item 10 is the generation map's bound (governance/forms/engine/ADMISSION-PREREGISTRATION.md:683-688 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:9ee96856d14babfe5bfb1f9e6e2b3a225401d6831abf9f801ce262cc9dc4f279). The not-stat-based correction is Amendment 3's item 10 (:816-821). The impact read's question carries the same slip. I read the question as Amendment 2 item 8, with Amendment 3 item 10.
3. **Whose decision it records.**
   - Amendment 2's lead says it was written after the P3 gate outcomes and after the fixes were run (:595-599). It cites no ruling of the human, and item 8 records a gate-fix round's trade-off.
   - Amendment 3 item 10 is a worker's correction inside the split the human ruled; the split ruling is about seams, not this rule.
   - The human's text here is boundary 7 and A5, and ADR-016 Amendment 1 §5 (accepted on the human's word, :238): single file only, partitioned refused by name. None names metacharacters.
   - Amendment 1 item 3 had excluded `[` (:262-268).
4. **Why R1 is routed RAW, not ESCAPED, by default.** Under R1, an escape changes only what happens in the window where the literal is removed after the pre-check. That window is already covered by ADR-016 A1 §3's read-around checks and KNOWN-LIMITATIONS item 19. Escaping then adds sites, and a mutation E1 cannot observe, for a timing-only gain (OPEN-6).
5. **The directory half: I agree it is left as it is.** It is unreachable from `pick_file`, ADR-016 governs it, and the fixture carries its text.
   - After RAW or ESCAPED on Windows, the code is reached in the app only by timing: a picked file removed before the open. That case is named, not blocking.
   - Under REFUSED it is reached in ordinary use, which is why the guidance changes there.
6. **Out of scope, reported:**
   - formatRefusal.test.ts:173-175's comment says declaring a column works, which is untrue at main. It is fixed in scope under REFUSED, and otherwise left for the docs lane.
   - SKP-V0.md:730-731 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:133c0bb0805975ab9374d7333250fde3794b281029eff505fa58c2842f9354eb ties the code to the session-ordinal path, though the gate precedes identity. That is the drift sweep C node's.
   - ADMISSION §2d's R-I4 is scoped to the R-I3 path (:68), while the code gates every identity class. It is a record, immutable, so I note it only.
7. **Perf risk (docs/08):** under ESCAPED, DuckDB lists the containing directory on every call for such a path. This is unmeasured and claimed nowhere.

## OPEN items

**OPEN-1: reversing ADMISSION Amendment 2 item 8 (with Amendment 3 item 10) for an existing file. Not a red line**, by the custodian's test: the amendment records a gate-fix round, not the human (note 3).
- **(A) Recommended.** Reverse it for existing files of a class whose route is RAW or ESCAPED, keeping the text-only rule for paths that are not files, and for `*` and `?`. This brings the build to boundary 7 and ADR-016 A1 §5.
- **(B)** Keep item 8: REFUSED for every class, with no literal route and step 0 limited to the comment's truth.
- A note for the custodian: the red-line list includes any change to user-visible behaviour not already ruled (governance/AI_DEVELOPMENT.md:451-454 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:573c907fab55b870ebdc353b7f19459438e3b74c8667217b4c07f8f5a332d821). I read admitting a single file as already ruled by boundary 7. OPEN-4 goes to the human anyway, so I recommend asking this in the same question.

**OPEN-2: the code under REFUSED.**
- **(A) Recommended.** The existing code, with a second engine variant and its own Display. The directory text and the fixture stay byte for byte, and `protocol/` is untouched. Not a red line.
- **(B)** A new wire code. That changes SKP-V0 §5's list, adds a fixture and an `error_of` arm, touches the shell, and likely brings a version string (:302-303) colliding with 1c's P2 bump. I read it as the human's, on OPEN-3's precedent.
- **(C)** Reword the shared Display. The directory text and a protocol fixture change, and it counts against rule (00)'s wire-fixture clause. Not recommended.

**OPEN-3: `protocol/` against 1c's reservation (RAW and ESCAPED only). A red line, the human's**, on 8e's precedent (governance/forms/protocol/SKP-FILTER-DIALECT-UNSUPPORTED-RULING-PREREGISTRATION.md:285-291 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:9f948a4cbfbccb43b039655fc443dd2104d31908898fad493816352f9e8f0ad2).
- **(A) Recommended.** A second exception: 8f's SKP-V0 sentence lands before 1c's P2, which waits for it as it waits for 8e.
- **(B)** 8f waits until 1c's steps 1 to 3 merge.
- **(C)** The code lands with SKP-V0's sentence left untrue until drift sweep C. Not recommended: it is a false wire-spec sentence on main.
- The item is moot if step 0 selects REFUSED alone under OPEN-2 (A).

**OPEN-4: the route. A red line, the human's.** §36's five-line condition is set aside, as in the human's rulings for 8c (state/directives/2026-11-05-8c-full-form-nine-s2-placed-u12-slot-2-u1-reproducer-adr-notes-words-e2e-readme-words-8b-d3.md:8 @ 43f9b1d56cba370a2e932171521278299ecc4bec sha256:69a7e63a2bdaaef7b2b72b860b70b3dd33ab14bce8227a481b36be829c0129f2) and entry 9.
- **(A) Recommended.** The full form, both gates, kept in the filler slot.
- **(B)** It leaves the filler queue for a slot 1 or slot 2 placement, the human's.
- While this waits, the direction of 2026-10-31, item 4, sends the piece out of its slot. Its PLAN dependant `narrow-integer-id-unstreamable` waits with it.

**OPEN-5: where E1 and K1 live.**
- **(A) Recommended.** The new files named in §7.
- **(B)** engine/tests/session_identity.rs and an existing kernel file.
- Not a red line.

**OPEN-6: an R1 class.**
- **(A) Recommended.** RAW, with the residual named in the source comment (note 4).
- **(B)** ESCAPED when an E-OK form exists.
- Not a red line.

**OPEN-7 (the custodian's): step 0's cases, its two processes and its 600 s ceiling.** These are planning choices, not measurements. Not a red line.

**OPEN-8: the owner's indexes.**
- **(A) Recommended.** engine/README.md only. kernel/README.md is #289's path, and its rows still point truly.
- **(B)** The form joins kernel/README.md's list of halves too.
- Not a red line.

## What I could not settle

- What the pinned DuckDB does with these names, whether a literal route exists, and so which shape runs. Step 0 decides.
- Whether HEAD is 43f9b1d5. I have no shell and read the working tree.
- Whether #289, #291 or port-2 edit item 20's lines. I cannot read branches.
- Where `describe.row_count` and `extent` come from. The worker confirms at the base that each reaches DuckDB; if not, K1 also drains a viewport stream.
- Whether any record `verify-test-claims` reads names `every_glob_metacharacter_read_parquet_expands_is_refused_by_name` (I-7).
- The line estimates in §7, which are unmeasured.
- The custodian's reading of §36's one-filler-at-a-time for a step 0 run while #290 awaits its click.

## The custodian's settlement (class 1, before any change)

- **OPEN-1 (A), OPEN-3 (A) and OPEN-4 (A): the human's**, by the message of 2026-11-07 (11:22Z), line 8 (`state/directives/2026-11-07-8f-open-1-3-4-a-292-words-c14-c11-cr-2-k2-cr-3-d1-b-class-5-area-a-open-2-a.md`). A single existing file is admitted by its path under boundary 7. The second `protocol/` exception lands before 1c's P2, as 8e's does. The full form, both gates, in the filler slot.
- **OPEN-2 (A), OPEN-5 (A), OPEN-6 (A) and OPEN-8 (A)**, each the draft's recommendation, taken on 2026-11-07 (the direction of 2026-10-31, item 4, `state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md`, held until 2026-11-09 by `state/directives/2026-11-03-away-until-11-09-276-open-1-seven-clauses-open-4-c-placed-sitting-wording-leaves-slot-cloud-credit.md`, line 6); the human reviews each on return and may reverse it, a reversal recorded, never edited in.
- **OPEN-7, the custodian's:** step 0's cases, its two processes and its 600 s ceiling stand as drafted; planning choices, not measurements.
- **Sequencing:** PR #290 (8e) merged on 2026-11-07, so section 9's "none before PR #290 merges" is met. Step 0 is the filler slot's next piece, a tester-high, nothing committed.
- **The read commit and main:** `git diff --name-only 43f9b1d5 4cbcab1e` over the 38 files the pins name lists 4: `governance/PLAN.yaml`, `protocol/skp/SKP-V0.md`, `protocol/skp/src/v0/commands.rs`, `state/FILLER-QUEUE.md`. The pins keep the read commit's lines. Step 0 and the worker re-read every pinned cite in those files at their own base by content; a clause whose code has moved is re-checked, not carried.
- **Rule (00)** at main 4cbcab1e, `git diff --name-only origin/main...<branch>` against the paths section 7 names (the E1 and K1 files are new): #292 (`cut/e2e-readme-security-posture-measure-build`): none; #293 (`cut/walkthrough-row-m10-declared-not-verified-write-time-guard`): none; area A (`cut/shell-comments-drift-sweep-area-a`): none; port-2 (`cut/port-2-macos-l1-and-app-dirs`): `KNOWN-LIMITATIONS.md`; 1c (`cut/b2-piece-1c-save-and-reopen`): none. KNOWN-LIMITATIONS item 20 is checked by hunk at dispatch; rule (00) is checked again there.

## Amendments (opens empty; append-only)

### Amendment 1 (2026-11-07), class 1: step 0 recorded, with what its O8 reading invalidates. Written after step 0's outcomes were seen. References and hashes only.

- **The run:** step 0 at aca36808f58e1a504c4a129e29f611ed36cb0302, where this form's sha256 is 6a1a8325ede15c5ca255bb21b5aa6bb55bc0d3ace0bc5cb7499cc184bde8e42c, on main's clang-cl build (state/consults/2026-11-07-single-file-bracket-name-refused-as-partitioned-step0-tester-high-report.md:21-25 @ eb7b60c724e27774d9790460c790378a9e661fa8 sha256:8dd9c2bd9748dca154cc630f7ca786c0f843c0b93f0844bc97f74b33d97cd159).
- **The report:** `state/consults/2026-11-07-single-file-bracket-name-refused-as-partitioned-step0-tester-high-report.md` @ eb7b60c724e27774d9790460c790378a9e661fa8 sha256:83791da38f479a7feb00841754ab17d2b3bdac843d415cd3a1517be03cbd9868 (the file). The hand-back it carries from its line 5 was extracted by script; its sha256 is fca707c0663049a1d9d228e1eac6daee273fb132b5e08db9ff21880d71ff9cb9.
- **Untracked evidence**, a run's output cited for what it reported, not Authority, in the local evidence folder under `2026-11-07/8f-step0/`: `step0_bracket_probe.rs` a1774292d8f25f97509188ce73cdd4fd4460b12d1c609e29e68545ce23ed6c84, `p1.out` 1e20ca8653607c280d8c287ca7816579aa3ead485eac90b71739fde4b07b1811, `p2.out` a1e5b5a9bde695947bb6af87ad672384ee9caf00392f006f7a53463785537b0a, `p1.err` 661bd1c7e78722455c4fa31b1fa582dc2c9c9a069d21e0e3d3a585b43d2cd7db, `p2.err` 99e6fdb75a9561acfdcf9b7f9376adb6dfa55c7c7ade07d081e8908ed75afd63, `build.out` 6f845b4a188a3dfa8ae430c8abf6a490d3de59e44f6faebc0dc71a1ff899c94c, and `p1.norm` and `p2.norm`, both 9d97d016ebc6a9e938d81b64dd36e4f9c8866a8007f8f45c25e5573cfa310aba (all sha256, equal to state/consults/2026-11-07-single-file-bracket-name-refused-as-partitioned-step0-tester-high-report.md:28 @ eb7b60c724e27774d9790460c790378a9e661fa8 sha256:f178b966694d15cf3b561fdeceff35f51cfe8c22fa503a9a59117a5dc8bf84c9 and state/consults/2026-11-07-single-file-bracket-name-refused-as-partitioned-step0-tester-high-report.md:46-47 @ eb7b60c724e27774d9790460c790378a9e661fa8 sha256:d1e429dd26f98ef222d2da61e475f057cc31f38c8cde8911a8e771f518eee045). Six further files of the tester's lie beside them and are not relied on.
- **The outcomes, by §3's words:**
  - Class B (`[` `]`): R2. F-escB is E-OK and the first in the order escB, escC, escBC, so the route is ESCAPED with F-escB (state/consults/2026-11-07-single-file-bracket-name-refused-as-partitioned-step0-tester-high-report.md:118-124 @ eb7b60c724e27774d9790460c790378a9e661fa8 sha256:435f3e5d5b267c28a2a005255b698d880e6e385974dd86a890b9dc55f8ca04d3; the tables, state/consults/2026-11-07-single-file-bracket-name-refused-as-partitioned-step0-tester-high-report.md:60-77 @ eb7b60c724e27774d9790460c790378a9e661fa8 sha256:6ea256e2d45b4aaa64dd7cbb5178f78d64b3ccd97067b503cb4816ddae0b34e8).
  - Class C (`{` `}`): R0, so the route is RAW (state/consults/2026-11-07-single-file-bracket-name-refused-as-partitioned-step0-tester-high-report.md:112-117 @ eb7b60c724e27774d9790460c790378a9e661fa8 sha256:0846cfaf8b9a35a15cee6df6bc389962aa3ed3a136c5cfecf5a9d17409521347).
  - The shape, by §3's union: ESCAPED. §7's ESCAPED row binds, its ten files and its ceiling.
- **H-LIT** (§0 item 3) is falsified as stated: under F-raw, K1 and K6 read a decoy and never L (state/consults/2026-11-07-single-file-bracket-name-refused-as-partitioned-step0-tester-high-report.md:63 @ eb7b60c724e27774d9790460c790378a9e661fa8 sha256:db134d75e94ac18dbd7278c78be5bd6cd529fdcccce2ee8913345e7f04fa7d55; state/consults/2026-11-07-single-file-bracket-name-refused-as-partitioned-step0-tester-high-report.md:68 @ eb7b60c724e27774d9790460c790378a9e661fa8 sha256:2642789d58cd80c456e92566bcbe2be805e868e2dac6ed550f8f2aaee31529d4).
- **The invalidators** (§5):
  - I-1, I-2 and I-10 did not fire (state/consults/2026-11-07-single-file-bracket-name-refused-as-partitioned-step0-tester-high-report.md:11 @ eb7b60c724e27774d9790460c790378a9e661fa8 sha256:e126ac1cf8aedcb9cc1dd185d6b56308105fee71a5653565f156f86f0514e2f3).
  - I-11's condition is met by DuckDB's literal fallback when a glob matches nothing (state/consults/2026-11-07-single-file-bracket-name-refused-as-partitioned-step0-tester-high-report.md:103-108 @ eb7b60c724e27774d9790460c790378a9e661fa8 sha256:91995276378aa9235b102f54daca63b79fcf9a399dd9c10cfb774ac8a56910f0). It is recorded and not used: the ESCAPED route does not rely on it, so there is no step 0 re-run. The architect's reading: `state/consults/2026-11-07-single-file-bracket-name-refused-as-partitioned-step0-i11-architect-reading.md` @ a0fbd515e679f0cf33029a6d27af26a66ccdebbc sha256:2175c90f163352e0cb1ab1a72590382915a4f1c8a5641362080c403df70198c0 (the file; its hand-back, extracted by script, 914fc2cc39dd71308f23552f68900de5a6439e00451f60d10a299f4326176e6d).
  - I-3 is the worker's base grep (§9 item 8).
- **§2.4's rename branch is met:** class C is R0, and the test it names has a `{a,b}` row (engine/tests/session_identity.rs:693 @ eb7b60c724e27774d9790460c790378a9e661fa8 sha256:ed9a968c3423de6852cc3a4358f0da72572b5fb78fd5535392731b8389bc45ba). The worker renames it unless I-7 fires at the base.
- **What the O8 reading invalidates, declared before code** (the reading's Q3; source readings, not observations):
  - (a) §4's T2: M2 fails only on a row whose L is a well-formed bracket pair, with a decoy the pair matches present. T2's L-absent row is such a row, K7-K1's shape: `zones[1].parquet` absent, `zones1.parquet` present.
  - (b) §4's M3 drops `[` from the escaped set, and is observed on a pair row with L present (K1's shape). Dropping `]` is an equivalent mutant on this DuckDB (like.cpp:61-66), recorded so and not run.
  - (c) Under ESCAPED, §1 does not claim what is read if L is removed between the engine's pre-check and DuckDB's call. It is named in the source comment beside the R1 residual (§2.4).
  - (d) On Linux, §1 does not claim a path with a bracket in the first component of an absolute path (local_file_system.cpp:1731-1736). E1's temporary-directory paths cannot observe it.
  - (e) On Windows, §1 does not claim a path whose letter case differs from the directory listing's in a component that holds a bracket (like.cpp's match is byte-exact; local_file_system.cpp:1783-1801). Not observed.
  - (f) No comment, doc or test text states the fallback as DuckDB fact (§2.4; §8 item 6).
  - KNOWN-LIMITATIONS item 20 and SKP-V0 §1's sentence (§2.6; §9 item 6) stay the human's words at the click. They carry (d) and (e), and claim no more.
- **What the report's fixture reading invalidates** (state/consults/2026-11-07-single-file-bracket-name-refused-as-partitioned-step0-tester-high-report.md:35 @ eb7b60c724e27774d9790460c790378a9e661fa8 sha256:377cc0f76c79e708df8c18a0f05a79501ed8784435e5d1fe0dba68512c96b25b), declared before code: on K2's and K3's shapes, §7's two decoys sum to L's count (state/consults/2026-11-07-single-file-bracket-name-refused-as-partitioned-step0-tester-high-report.md:51-52 @ eb7b60c724e27774d9790460c790378a9e661fa8 sha256:f18d3bb2ec0ab3e53c05051f856b072376c53189d15eb16511be9891f8937806), so §4's E1 assertion 2, "and from any sum", cannot hold there. On those two rows assertion 3 discriminates L from the pair: the fixture writes ids from 0 in every file (engine/src/fixture.rs:1055 @ eb7b60c724e27774d9790460c790378a9e661fa8 sha256:de800317710c5b41ee9afee14ed772f0c351be0d5cc7a4313072d5f2f7da2697), so a read of both decoys repeats them. §7 is not edited.
- **The DuckDB pins (O8):** `libduckdb-sys` 1.10505.0, DuckDB v1.5.5 (state/consults/2026-11-07-single-file-bracket-name-refused-as-partitioned-step0-tester-high-report.md:25 @ eb7b60c724e27774d9790460c790378a9e661fa8 sha256:7922566fd2165d637d88918f7398ded8c56b8169bcfd8a968b311b8ed6dfbb3c), its sources as the build unpacks them: `src/common/local_file_system.cpp` c106e49974d50da511d05d4894823debd523eed82863ff4717b55d5a73ce31e4, `src/common/file_system.cpp` 2e57711f2234bf6db68ea38b7049a82ff8395ff5e1fa4dcd0770bdb2f3120c0c, `src/function/scalar/string/like.cpp` 4365de7a4077989b43af82e8d40daf9589d7d09d698c0ad15732bb37950edc46 (sha256; copies in the local evidence folder under `2026-11-07/8f-step0/duckdb-v1.5.5/`). Lines as the report (state/consults/2026-11-07-single-file-bracket-name-refused-as-partitioned-step0-tester-high-report.md:92-109 @ eb7b60c724e27774d9790460c790378a9e661fa8 sha256:60f9b6a12f024536c8e5e6058195cd7f8197880cb04a6cb0446b3359f2b9a248) and the reading cite them. The fallback is local_file_system.cpp:1761-1766, sha256 c94715f27aca7e656cc82363ccb55eeb927a818127cbfb9164b1d700c0479c03 over those lines; the report's :1763-1766 and the reading brief's :1763-1765 lie inside it.
- **Disclosure (1)** (state/consults/2026-11-07-single-file-bracket-name-refused-as-partitioned-step0-tester-high-report.md:8 @ eb7b60c724e27774d9790460c790378a9e661fa8 sha256:7718fc9cb6ad998287c8473515764447d84121eb2742a28c5065c0183d0ddf1a; the filing note, state/consults/2026-11-07-single-file-bracket-name-refused-as-partitioned-step0-tester-high-report.md:1 @ eb7b60c724e27774d9790460c790378a9e661fa8 sha256:abbdb3b38c181954c1054c70c6660fcf1921603007a6efaa3754e46d10d66164): the custodian's call, on the reading's Q5, is that the observations stand. They rest on the tester's own target, the fixture hashes and the two byte-identical processes (state/consults/2026-11-07-single-file-bracket-name-refused-as-partitioned-step0-tester-high-report.md:21 @ eb7b60c724e27774d9790460c790378a9e661fa8 sha256:c5b941a51f21c1ae1700121b335052903467724528c17b13baad88272dc6d6f3; state/consults/2026-11-07-single-file-bracket-name-refused-as-partitioned-step0-tester-high-report.md:53 @ eb7b60c724e27774d9790460c790378a9e661fa8 sha256:6ae8b380e6a04f6cd7da0bcc149e0bb95f13946f13957d6e778f1ae81d90c884; state/consults/2026-11-07-single-file-bracket-name-refused-as-partitioned-step0-tester-high-report.md:46 @ eb7b60c724e27774d9790460c790378a9e661fa8 sha256:960797e45f5169c896b6e07fd70712a3f362857a5e1044510195a4f1d539b295). Reported to the human.
- **Next under §9:** item 4, code by a worker in its own checkout, on its own new target.

### Amendment 2 (2026-11-07), class 8: the size at the built head, §7 not edited. Written after the build was seen. References and hashes only.

- **Declared** (§7's ESCAPED row): 480 over the ten files, estimated at about 390. **At 0307fdfb2106eb2030bcef2f04235e8c5989dbf1**, by §7's counting command (the merge base with origin/main is d37112d8ae70fd03606ea47327b679b5e2d38a7d): 677 changed lines, 618 added and 59 deleted, over the ten: `KNOWN-LIMITATIONS.md` 14/9, `engine/README.md` 3/3, `engine/src/dataset.rs` 219/32, `engine/src/index.rs` 1/1, `engine/src/rowgroup.rs` 1/1, `engine/src/stream.rs` 5/5, `engine/tests/session_identity.rs` 7/6, `engine/tests/single_file_bracket_name.rs` 228/0, `kernel/tests/single_file_bracket_name_open.rs` 135/0, `protocol/skp/SKP-V0.md` 5/2.
- **Where the lines are:** 502 of the 618 added lines are the three tests, E1's and K1's new files and T2's hunk in `engine/src/dataset.rs`'s test module (139). Nothing was trimmed to fit.
- **The report:** `state/consults/2026-11-07-single-file-bracket-name-refused-as-partitioned-build-worker-report.md` (its hand-back's sha256 3debb3bcd8a0f9a082d9f6ad2d4b1ed6b431129b5d714aa46179206f5dd8219c).
