*Custodian's filing note (2026-10-26): the architect's read-only draft of the five-line form for `corpus-line-files`, the filler queue's entry 8a (S3), read at main a1e19585. Its first finding: choosing the real-world line file is choosing a third-party source and its licence reading, red-line text, so its OPEN-1 (the source, the licence reading, the set and the sighting line; the architect recommends one small country partition of Microsoft Road Detections from the Source Cooperative mirror, set local-only, fetched and never redistributed, on #12's precedent, with natural-earth-vector proposed as its own node) is the human's and is put to the human; nothing is committed from this draft until the human answers. The corpus fetches and commits no data byte; the draft follows it. The custodian's choices on the rest, if the piece goes ahead: OPEN-2 (A), a lines/ set beside the manifest, which stays untouched; OPEN-3, the fetch by the custodian on the main checkout under the corpus form's rules, or the human's placing of the file if this machine has no network for it. The run 03:13:15Z to 03:22:34Z by its transcript (Grep 25, Read 32, Glob 2; no write tool); it read the reuse clone's record for the capability and takes only source names from it. Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 623d70a41b005cc62560f49bef6e4c15cca8a01e7181447a7e1c95202c1a2c3c.*

---

Drafted: corpus-line-files, five-line form, architect
Read at: main @ a1e19585 (main checkout). I have no shell, so this report carries no sha256. The custodian pins each cite when filing. The reuse clone was read at christopherdonini/spatial-ide-reuse @ 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c (its `.git/HEAD`, read). Only source names are taken from it.

**Settle first (with the human, before anything is committed).**
1. **Which file, which licence, and fetched.** Choosing the file is choosing a third-party source and its licence reading. Licensing is red-line text and goes to the human (the brief's red-line list; AUTONOMY.md:692 @ a1e19585, red-line text to the human). That is OPEN-1.
2. **Committed or fetched: the corpus fetches. No data byte is committed.** This piece follows that.
   - The corpus of record is untracked, and no data file from it is tracked (engine/compat-corpus/RECORD.md:7 @ a1e19585).
   - The "never tracked" list covers Parquet (engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md:65-69 @ a1e19585).
   - A third-party file is fetched by URL and pinned by sha256. When its licence is not identified and open, or by the human's ruling, it is local-only: fetch-only, never redistributed. #12 is the precedent (engine/compat-corpus/LICENCES.md:29 @ a1e19585; RULED 2026-09-26, the corpus positions, item (3)).
   - docs/08's public-data line requires the same: fetched from source, kept local, hash, licence and attribution recorded (docs/08_Testing.md:40 @ a1e19585).
3. **Size: it fits §21c only with one source.** A second source (a Natural Earth generator) does not fit (Notes §5).

```
Authority: PLAN node `corpus-line-files` (PLAN.yaml:4366-4382 @ a1e19585), generation 2; filler queue entry 8a, graded S3 (state/directives/2026-10-24-weekend-exception-third-product-slot-placements-forms-ahead-250-click.md:16-17 @ a1e19585; state/FILLER-QUEUE.md:23 @ a1e19585), next in the filler slot (state/CUT-STATE.md:361 @ a1e19585); the filler rule, AUTONOMY.md §36 (AUTONOMY.md:692 @ a1e19585): a five-line form under §21c, the reviewer and the architect from dispatch, round 25, item 2 (e) set aside, red-line text to the human; recorded by geometry-lines-cut's form §3, the corpus, and its §1 may-not-claim (engine/GEOMETRY-LINES-PREREGISTRATION.md:389-391 @ a1e19585, engine/GEOMETRY-LINES-PREREGISTRATION.md:60 @ a1e19585); the corpus's model: engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md §2, §2a, §2b and Amendments 1 to 3, and docs/08_Testing.md:40 @ a1e19585; the source, its licence reading and who fetches: the human's ruling on OPEN-1 [round and item, filled at settlement]; evidence, not Authority: the reuse index's capability `real-world-line-test-files` (christopherdonini/spatial-ide-reuse @ 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c, reuse-index.json and REUSE-ROUND-1.md, entry real-world-line-test-files), source names only.
Scope: 4 files: (1) new engine/tests/line_corpus.rs: two #[ignore]d tests, a file-local sha256 helper, and the bbox constants byte-copied by script from the observation file; (2) new engine/compat-corpus/lines/<name>.observe.txt: the stdout of the local corpus's `scripts/observe.py lines/<name>.parquet`, run once from the corpus root in the corpus venv with a relative path, committed as captured (git's LF normalisation the only change), generated, never hand-edited; (3) engine/compat-corpus/RECORD.md: one section appended after its last line, holding the entry's row on the file's nine columns and that row's verify command; (4) engine/compat-corpus/LICENCES.md: one section inserted directly before the sighting line, holding the entry's licence row, its sources (URL, retrieved UTC, sha256, byte-stable or not) and its set, and the sighting line as the human rules; declared line budget 150 (insertions plus deletions, comments and blank lines counted, over the test and both records; the observation file generated and exempt; this form exempt, AUTONOMY.md:357 @ a1e19585); no data file in any branch commit (no path matching the corpus form's DENY_EXT, no blob over its MAX_ADDED_BLOB, engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md:300-301 @ a1e19585); unchanged: engine/compat-corpus/of-record/**, the local MANIFEST.json, engine/ADMISSION-PREREGISTRATION.md, engine/ADMISSION-RESULTS.md, engine/tests/admission_p4_corpus.rs, tools/corpus/**, .gitattributes, kernel/FIXTURES.md, engine/README.md, KNOWN-LIMITATIONS.md, every product file.
Change: one real-world third-party LineString GeoParquet file (OPEN-1) is fetched once and placed, untracked, under the corpus of record's new `lines/` directory; its bytes are pinned by sha256; its provenance, its pyarrow observation and its licence are recorded on the corpus's model; and two ignored tests open it through `Dataset::open` and stream it whole, so that line admission is tried on a real-world file against outcomes registered before any engine run.
Tests+mutation: new, both #[ignore] because they read the on-disk corpus, as engine/tests/point_corpus.rs:87-88 @ a1e19585 does: T1 `a_real_world_line_file_opens_with_the_encoding_crs_provenance_and_identity_its_metadata_gives` and T2 `a_real_world_line_file_streams_whole_one_row_per_feature_each_position_inside_its_bbox_member`, each hash-verifying the file against the observation's sha256 and bytes before the open and again after the last read; M-1: in engine/src/geoarrow.rs `encoding_for_declared_types`, the all-LineString arm returns `GeometryEncoding::MultiLineString`, predicted to fail T1 by name at its encoding assertion and T2 at its geometry column's downcast; M-2: in engine/src/wkb.rs `read_line`, y pushed before x, predicted to fail T2 only, by name at its bbox assertion; M-3: in line_corpus.rs's hash helper, `==` to `!=`, predicted to fail T1 and T2 by name at the pre-open hash assertion; each run as `cargo test -p spatial-engine --test line_corpus -- --ignored`, in a debug build on the branch's code commit, recorded by name with that 40-hex commit in a `RECORDED MUTATION:` doc line, then reverted; a verify-mutation run is not an observation; a mutation that passes, or that fails outside its predicted set, is a stop; an unmutated miss of a registered prediction is a result, recorded as engine/tests/multipolygon_corpus.rs:23-33 @ a1e19585 records C-12's, with the assertion left as registered and its mutations recorded as not observable.
Out-of-scope: ADR: no status line or amendment (ADR-034, ADR-016 and ADR-021 read, not changed); security: a contact, disclosed rather than denied: no third-party data byte enters the repository or its history (the corpus's never-tracked rule; round 26, item 1's reading of `observed` blocks as metadata), so ADR-009's history term (pre-public checklist item 6) holds, and the one licence row and the sighting line are red-line text that go to the human before merge; nothing ADR-020 governs; nothing ADR-021 governs (no product path fetches; the one fetch is a person acquiring test data); wire: no SKP, data-plane or MCP surface, nothing under protocol/; guarantee: none changed, the tests assert existing admission and decode properties on a new input; the five-line form stands under §36, which sets round 25, item 2 (e) aside; no P6 string.
```

The reuse index, byte for byte as the brief gives it (the custodian carries it into the form):

```text
$ node tools/reuse.mjs corpus line file
capability: real-world-line-test-files → Microsoft Road Detections (Source Cooperative mirror) [ADOPT], natural-earth-vector [ADOPT], docs [REJECT]   (open, P0)
$ node tools/reuse.mjs linestring real world
capability: real-world-line-test-files → Microsoft Road Detections (Source Cooperative mirror) [ADOPT], natural-earth-vector [ADOPT], docs [REJECT]   (open, P0)
```

## Notes (my reading)

### 1. What the corpus does, and why the new file goes beside the manifest rather than into it

- **The model.**
  - Data is untracked under `target/fixtures/compat-corpus/` (engine/compat-corpus/RECORD.md:7 @ a1e19585).
  - One local MANIFEST.json holds each entry's path, how it was obtained, sha256, bytes, and the `observed` block written by `observe.py`. Its tracked twin is byte-identical (engine/compat-corpus/RECORD.md:8 @ a1e19585).
  - Each entry has one RECORD row (engine/compat-corpus/RECORD.md:19 @ a1e19585 for the columns) and one LICENCES row.
- **Why `files[]` cannot take a new entry inside a filler:**
  - `of-record/**` is never edited; a re-collection replaces it in a new piece (engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md:76 @ a1e19585; engine/compat-corpus/RECORD.md:10 @ a1e19585).
  - The manifest's hash is pinned by the admission results and by RECORD's C3 (engine/compat-corpus/RECORD.md:9 @ a1e19585, engine/compat-corpus/RECORD.md:93-96 @ a1e19585).
  - The main set is capped at 12, and it already holds 12 (engine/compat-corpus/of-record/README.md:15 @ a1e19585; engine/compat-corpus/of-record/MANIFEST.json:12 @ a1e19585).
  - P4 asserts exactly 17 rows and rewrites ADMISSION-RESULTS.md on every run (engine/tests/admission_p4_corpus.rs:831-834 @ a1e19585, engine/tests/admission_p4_corpus.rs:1304-1305 @ a1e19585).
- **So, OPEN-2 (A):** a `lines/` set beside `main`, `mutations` and `retired`.
  - Its observation is the `observe.py` CLI's own output (engine/compat-corpus/of-record/scripts/observe.py:165-171 @ a1e19585): path line, bytes, sha256, tail facts, observed block.
  - The CLI is run from the local original, which is byte-identical to the copy (C1), never from `of-record/`.
  - `observe.py` writes no file (engine/compat-corpus/RECORD.md:55 @ a1e19585). Run it with PYTHONDONTWRITEBYTECODE=1, as Amendment 2 did.
  - C2 and C3 stay unchanged: they read manifest entries only, and the manifest is untouched.
  - The pinned README's layout table becomes stale for `lines/`. The pin is authoritative as of 2026-09-10 and is never read as current (engine/compat-corpus/RECORD.md:11 @ a1e19585). The new RECORD section says so in one clause.
- **The new row's id** must avoid the `#`, `M-` and `R-` prefixes. RECORD's C4(a) reads every row with those prefixes against the 21-entry manifest (engine/compat-corpus/RECORD.md:98 @ a1e19585), and the new row would read as DISAGREE. It must also avoid the lines form's fixture ids (L-1 to L-11, ML-1, ML-8, BF-L). My suggestion: `LF-1`. The new section's own verify command checks the row's single 64-hex value against the observation file and the file on disk.
- **Where the edits go.** RECORD.md is appended at its end. LICENCES.md takes its section just above the sighting line, which must stay last (engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md:131 @ a1e19585). No line above either insertion moves.

### 2. Candidate sources

The repository's own records list **no** line file:
- every `geometry_types` in the manifest is Point, Polygon or MultiPolygon (engine/GEOMETRY-LINES-PREREGISTRATION.md:39 @ a1e19585, re-read here);
- `tools/corpus/MANIFEST.json` is a proposal listing the same 12 (tools/corpus/README.md:1 @ a1e19585), and no CI job runs `fetch-verify.mjs` (searched `.github/`: no hit).

The reuse record's adopted sources:
- **Microsoft Road Detections (Source Cooperative mirror)** — recommended for this piece.
  - It is a third-party file. Its rights holder's licence statement must be fetched at a pin, twice, with retrieval time and sha256, under LICENCES.md's rules (engine/compat-corpus/LICENCES.md:6-9 @ a1e19585, engine/compat-corpus/LICENCES.md:12-14 @ a1e19585).
  - The primary source is the rights holder's own statement (engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md:133 @ a1e19585). A mirror's catalogue is a processor's statement: it goes under "Other sources consulted", never as the licence pin.
  - Everything below is unverified here and must be checked by the human or at the fetch: the exact URL and partition; that the mirror's object is unversioned (if so, procedure recorded is **no**, as #12's is, engine/compat-corpus/RECORD.md:32 @ a1e19585); whether the licence named is identified and open by the rules.
- **natural-earth-vector.** It is not a GeoParquet file. It needs a project generator, so it is the project-generated class, by regeneration. Three things are not decided here:
  - a generator script, which adds code;
  - a shapefile-reader dependency, which is the human's red line, dependency changes (AI_DEVELOPMENT.md:451-454 @ a1e19585);
  - whether public domain counts as an open licence under LICENCES.md's rule. That rule asks for a licence the OSI or Open Definition list names, and public domain is not a licence.

  This is the only route named to a real-world MultiLineString. It is over §21c together with this piece. My recommendation: propose it as its own node (OPEN-1 (B)).
- **docs [REJECT]:** reference only. An Overture transportation extract would, by my inference from #12's recorded refusal, meet the same identity refusal (engine/tests/multipolygon_corpus.rs:23-30 @ a1e19585). That is not checked for that theme.
- The index also lists capability `geoparquet-conformance-files` against this node. Those are conformance files, not real-world ones, so they are not adopted here.

### 3. The manifest entry, the licence record and the provenance (OPEN-2 (A))

- **Observation file:** see §1. It must carry no absolute path. Run with a relative path from the corpus root. The gates re-run the corpus form's C8 pattern over the added lines (its Amendment 1, item 1.2, as Amendment 3, item 3.2 runs it).
- **RECORD row, on the nine columns:**
  - producer and version: "downloaded, with no local writer; footer:" followed by the observation's `parquet_footer_created_by`;
  - invocation and inputs: the URL fetched, the date, and any change signal the host returns (ETag or last-modified, if any);
  - sha256 and bytes: from the observation;
  - procedure recorded: **no**, with the why naming the unversioned input against the corpus form's §1 definition (engine/compat-corpus/RECORD.md:15 @ a1e19585). The note also says the input's continued availability is not checked.
- **LICENCES row:**
  - licence as the source names it;
  - primary source pinned to a commit where the host allows one, fetched twice, `curl -sL`, sha256 of the first fetch, byte-stable or not;
  - consulted sources in the same form;
  - set: by OPEN-1, my recommendation being `local-only — fetch-only, never redistributed`, on #12's ruling as precedent.
- **No licence text is reproduced** (engine/compat-corpus/LICENCES.md:12 @ a1e19585).
- **The sighting line** is extended only by the human's ruling (red line). The merge waits for it, as block-on-sight 13 did (engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md:323 @ a1e19585).
- **The file name in `lines/`:**
  - It must carry no glob metacharacter. R-I4 refuses `* ? [ ] { }` by name, before any read (engine/src/dataset.rs:1678-1684 @ a1e19585).
  - It should carry no `key=value` path segment, so that a partitioned-path reading cannot arise. Whether DuckDB auto-detects hive partitioning from a single-file path is my inference, not checked.
  - It is fixed at settlement.

### 4. What is tried and recorded (no docs/08 figure; no numbers, no claim)

**Order:**
1. The form is committed.
2. The fetch, twice, with sha256 of both. STOP if they differ.
3. The observation.
4. The custodian's settlement (class 1, before any code and before any engine run) writes the concrete predictions, derived from the observation by the engine's own rules:
   - **Encoding:** from `geometry_types` by ADR-034 (engine/src/geoarrow.rs:192-215 @ a1e19585). All LineString gives `geoarrow.linestring`. If the observation shows a lineal set with MultiLineString, the prediction is `geoarrow.multilinestring`, and M-1 is restated to that arm before code.
   - **CRS:** an absent `crs` key gives `crs_provenance` `crs:format-default`, as #5 and #8.
   - **Identity:** `IdSource::SessionOrdinal` when no `id` column exists. Otherwise the identity rule's outcome (native, mapped or `engine.identity_unusable`) is registered as that rule gives it.
   - **Covering:** `Dataset::covering()` is `Some` when the observation shows a covering whose columns the schema holds (engine/src/dataset.rs:983-988 @ a1e19585).
   - **Stream:** with `ViewportQuery::all()`: no refusal; rows = the observation's `row_count`; one unique id per row; every position inside the file's `bbox` member, comparisons inclusive.
5. Code.

**The settlement stops before code if** the observation shows no `bbox` member, `parquet_open_error` non-null, or a `geometry_types` outside the readable set.

**The bbox is written as Rust literals,** byte-copied by script from the observation file (the point_corpus.rs precedent, engine/tests/point_corpus.rs:30-33 @ a1e19585), and never parsed through serde_json's f64.
- engine/Cargo.toml:40 @ a1e19585 enables no serde_json feature.
- My reading is that serde_json's default float parse is not guaranteed correctly rounded without its `float_roundtrip` feature. A vertex lying exactly on the bbox edge could then read as outside. The worker checks this at the locked version.
- Integers and the sha256 string are read from the JSON.

**Paths.** CORPUS_ROOT is the absolute-path precedent (engine/tests/admission_p4_corpus.rs:64-68 @ a1e19585). The observation file is read under `CARGO_MANIFEST_DIR`, so it resolves in any worktree.

**May not claim:**
- any timing, rate or docs/08 row;
- that the file is byte-reproducible;
- that any MultiLineString real-world file opens (unless OPEN-1 (B) lands);
- that a line file draws, picks or publishes in the shell. The engine tests reach no shell, and publish of a degrees file is refused before K2 (the lines form's L-11);
- anything off Windows: the tests are ignored and read a local file, so CI never runs them.

**Runs.** Every cargo run is a heavy command in a shared hold, with a cargo target of the worktree's own.

### 5. Size against §21c (AUTONOMY.md:349-357 @ a1e19585)

It fits, narrowly, with one source. My estimate:
- line_corpus.rs about 120 lines: header and module doc 15; uses and constants 14; observation and hash helpers 20; T1 30; T2 41;
- the RECORD section about 9;
- the LICENCES section about 13.

That is about 142 against a declared 150, in 4 files, with no new dependency (sha2 and serde_json are already engine dependencies, engine/Cargo.toml:40-43 @ a1e19585), no exposure surface, and no user-visible behaviour.
- If records are read as outside §21c's code-and-tests count, the margin is about 30 lines.
- An overrun is class 6, with the Scope line unedited (AUTONOMY.md:345 @ a1e19585).
- Two sources, or a re-collection into `files[]` (OPEN-2 (B)), do not fit.
- The node's budget is 120 minutes (PLAN.yaml:4377 @ a1e19585). That is plausible only if the fetch and the licence fetches are quick. It is not measured.

### 6. Out-of-scope readings

- **Security.** The corpus form took the full form on security posture, because it decided which third-party-derived material enters a public repository (engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md:9-11 @ a1e19585). This piece adds no data byte; only metadata is tracked, under round 26, item 1's ruled reading. Its one licence row is red-line text for the human.
  - I read that as a contact with ADR-009 (§21a, AUTONOMY.md:321-322 @ a1e19585), so the line discloses it.
  - The five-line form stands only because §36 sets round 25, item 2 (e) aside (AUTONOMY.md:482 @ a1e19585, AUTONOMY.md:692 @ a1e19585).
  - Of the brief's fail-by-name list: the item on a five-line form whose Out-of-scope line names a §21a category is (e)'s enforcement, and I read it as set aside with (e) for a filler. If the custodian or the human reads a licence row as security posture touched beyond what §36 covers, the piece takes the full form. That is the human's call; I recommend it stay on this form.
- **Licensing** is the human's in full: the source, the licence reading, the set and the sighting line.
- **Owner's index.** No owner's-index pointer changes. The corpus tests are ignored and none is listed among the pins (engine/README.md:530-554 @ a1e19585), so engine/README.md, which #241 holds, is not edited. No KNOWN-LIMITATIONS item is owed.
- **Bookkeeping, for the custodian.** The PLAN node's `needs_human: {kind: none}` (PLAN.yaml:4374 @ a1e19585) understates OPEN-1 and the sighting.

### 7. Rule (00), path by path

| This piece's path | In-flight overlap |
|---|---|
| `engine/CORPUS-LINE-FILES-PREREGISTRATION.md` (the form, on main) | none |
| `engine/tests/line_corpus.rs` (new) | none. Contacts only: port-2 edits engine/src/lib.rs, which re-exports `Dataset`, `GeometryEncoding`, `ViewportQuery`; #252 edits engine/src/dataset.rs (`Dataset::open`, `covering`, `identity`). The worker re-reads both at its base. |
| `engine/compat-corpus/lines/<name>.observe.txt` (new) | none |
| `engine/compat-corpus/RECORD.md` | none |
| `engine/compat-corpus/LICENCES.md` | none |
| not touched: engine/README.md (#241), KNOWN-LIMITATIONS.md (port-2, #252, #249, #241), engine/src/fixture.rs (#241; the test uses no fixture), frontends/shell/** | — |

- Slot 2 (1c step 1), port-2, 6b, #260, #252, #249, #244, #241: no path in common.
- Nothing is under protocol/.
- The path lists are the brief's; I cannot read branches.

## OPEN items

**OPEN-1 — the source, its licence reading, and who fetches (the human's; red line).**
- **(A) Recommended.** One small country partition of Microsoft Road Detections from the Source Cooperative mirror, set `local-only — fetch-only, never redistributed` on #12's precedent.
  - The licence cell lists what the rights holder's own statement names. The mirror's catalogue is consulted, not the pin.
  - The human names the partition, or the smallest whose observation passes §4's settlement stops.
  - The fetch is made by the custodian on the main checkout, by the corpus form's §2b rules. If there is no network, the human places the file, and the record says who did.
- **(B)** natural-earth-vector, by a project generator. A separate proposed node: generator, dependency question, and the public-domain reading. It carries the real-world MultiLineString. I recommend proposing it alongside (A).
- **(C)** Both in this piece: over §21c, so the full form. Not recommended for a filler.

**OPEN-2 — the record's shape (the custodian's, unless the human prefers (B)).**
- **(A) Recommended.** A `lines/` set beside the manifest. The observation file is generated, and the rows are appended to RECORD and LICENCES. The manifest, its pins, P4 and ADMISSION-RESULTS are untouched.
- **(B)** A re-collection into `files[]`. It replaces `of-record/`, re-pins the manifest hash, breaks the cap of 12 (a retirement is the human's), and changes P4's 17-row assertion. That is the full form and not a filler.

**OPEN-3 — the network fetch from this machine (the custodian's, the human's if the custodian lacks network).** The worker stops before the fetch if it has no network, as the corpus form's §2b provides (engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md:159 @ a1e19585).

**What I could not settle:**
- the exact URL, partition, size, row count and metadata of any candidate (no fetch; facts from the reuse record are not copied here);
- the rights holder's licence file and its pin;
- whether that licence, as named, is identified and open under LICENCES.md's rule;
- whether DuckDB auto-detects hive partitioning from a single-file path;
- serde_json's float-parse rounding at the locked version;
- whether the observation shows a `bbox` member (its absence is a settlement stop);
- whether network access exists for the fetch.

Files relevant: C:\dev\spatial-ide\PLAN.yaml, C:\dev\spatial-ide\engine\GEOMETRY-LINES-PREREGISTRATION.md, C:\dev\spatial-ide\engine\CORPUS-REPRODUCIBILITY-PREREGISTRATION.md, C:\dev\spatial-ide\engine\compat-corpus\RECORD.md, C:\dev\spatial-ide\engine\compat-corpus\LICENCES.md, C:\dev\spatial-ide\engine\compat-corpus\of-record\scripts\observe.py, C:\dev\spatial-ide\engine\tests\point_corpus.rs, C:\dev\spatial-ide\engine\tests\multipolygon_corpus.rs, C:\dev\spatial-ide\engine\tests\admission_p4_corpus.rs, C:\dev\spatial-ide\AUTONOMY.md.
