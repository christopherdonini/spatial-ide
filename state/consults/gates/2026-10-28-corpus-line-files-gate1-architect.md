Reviewed: PR #267 at e834dcf73521fcd7f268c6cb8b4479c3eaf45353, gate 1, architect
Verdict: FAIL

Branch: `cut/corpus-line-files @ e834dcf73521fcd7f268c6cb8b4479c3eaf45353`. I read the branch files in the worktree `C:/dev/wt/lf1` and the main-only files in the main checkout (main at e83155b1). I have no shell, so I could not confirm the worktree's HEAD, run a diff or numstat, or compute any sha256. Where this report states a count or a hash, it is the record's figure checked against other records, not a figure I computed. I could not reach the raw licence documents in the local evidence folder, so the licence cells are checked against Amendments 1 and 3 only. I could see the LF-1 parquet file in the corpus of record but could not hash it.

The code side is closed. T1, T2, M-1 to M-3, the seams and the out-of-scope line all pass (checks 1, 4 and 5). The only blocking findings are in the LF-1 licence section of `engine/compat-corpus/LICENCES.md`. That section is red-line text: under the proportional-gates directive, section 2, a finding in red-line text is never documentation-only. Under AUTONOMY §31 red-line text keeps the human's typed words, so the section goes to the human with no replacement words from me. The block clears when the human's words for that section land (LICENCES.md only, no code) and the sighting line is extended.

## Findings by class

### Correctness / Evidence (red-line text, LICENCES.md lines 98–110; blocking; questions to the human, no replacement words)

- **E-1. Cells state a gap that Amendment 3 has filled.**
  - The primary-source cell (line 102) carries no URL. It says "the fetch URL is not recorded in the form's Amendment 1".
  - S9 (line 109) carries no URL.
  - S8 (line 108) carries no URL, and its retrieved cell reads `not recorded`.
  - Amendment 3 records all three URLs (the raw.githubusercontent LICENSE and README URLs at c1a8d699…, and the data.source.coop `collection.json` URL), plus the README's times, 16:13:41Z and 16:13:43Z.
  - So S8's `not recorded` is untrue of the form at head. The corpus form §2b column "primary source (URL, pinned to a commit or release where the host allows it)" is unmet in red-line text. Amendment 3 itself says the cells "take them at the gate".
  - Question to the human: your words for the primary-source cell, S8 and S9, carrying Amendment 3's URLs and times.
- **E-2. Version.** The human's ruling on OPEN-1 (A) (`state/directives/2026-10-26-…-rulings.md`, line 30) reads "ODbL 1.0 as I read it". The licence cell (line 102) reads "neither states a version number, and none is inferred".
  - The cell is consistent with Amendment 1's facts and with §2b's rule that a licence is "never inferred".
  - The form's settlement (on main, not in this diff, so not edited) restates OPEN-1 (A) and drops the human's version reading.
  - Question: does the cell carry your reading of 1.0, and on which source, or does it stand unversioned?
- **E-3. Open.** The cell defers with "Whether it is open is the human's reading". Under LICENCES.md's Rules, "open" is a lookup in the lists, and O3 (line 52) names ODbL-1.0.
  - The reading left open is whether an unversioned "ODbL" is the ODbL-1.0 that O3 names.
  - The set cell is local-only by your ruling either way.
  - Question: your words for the open reading.
- **E-4. Ruling C's stop.** Ruling C (`state/directives/2026-10-28-rulings-by-lane-…-adr-017-note.md`, item C) makes a difference between the rights holder's statement and the mirror's catalogue line a stop.
  - Amendment 1 read the catalogue's added `ODbL-1.0` version as no difference, went on, and sent both texts to you.
  - Question: do you confirm that reading, or was it a stop?
- **E-5. "With the mirror's catalogue line beside it"** (OPEN-1 (A)). The catalogue line is in S9, a separate table, not in the licence cell. Question: does S9 meet "beside it"?
- **E-6. LF-1 is in no set list by name.**
  - §2b orders lists by file name after the table, and the corpus form's §8 item 6 makes a local-only file not listed by name a block.
  - The existing heading `## Local-only set (4)` reads as the whole local-only set.
  - Question: your words, either an LF-1 list entry or a line scoping those lists to the manifest.
- **E-7. The sighting line** (line 111) is unchanged and still last, which is correct. Your ruling extends it before the merge (the form's note 3).

### Documentation (must-fix before the merge, no re-gate; not the human's wording, so the worker applies these words and the PR body lists them)

- **D-1. `engine/compat-corpus/RECORD.md` line 111, LF-1's why cell.** The footer-only versions clause reads as a second missing item. Under this file's own rows, #11 (line 31), R-2 and R-4 are "yes" on the footer alone ("no local software wrote the bytes; … names the upstream writer"). Replace the why cell with:
  `the input is a version-pinned object URL, which is neither a hash-pinned corpus file nor a commit-pinned URL (this file's Header, "Procedure recorded"), and it is the one item missing. No local software wrote the bytes; the versions of the software that wrote them are held only as the footer's `parquet-cpp-arrow version 21.0.0`, as #11's are. The input's continued availability is not checked`
  Clause check:
  - "version-pinned object URL": Amendment 1 records `x-amz-version-id` and the same bytes returned by that version id.
  - "neither … nor …": RECORD.md:15's definition.
  - "the one item missing":
    - the invocation is held in the row's invocation cell (the curl command and URL);
    - the versions as a footer are accepted for #11 (line 31, "yes");
    - the input is the missing item.
  - "No local software wrote the bytes": the row's producer cell says "downloaded".
  - "held only as the footer's …": Amendment 2's ordered clause, kept.
  - "continued availability not checked": Amendment 2; no check exists in the tree.
- **D-2. `engine/tests/line_corpus.rs` lines 4–6.** "registered before any run" is untrue of the observe.py run, which Amendment 1 made before writing the predictions. Replace with:
  `//! `engine/CORPUS-LINE-FILES-PREREGISTRATION.md`'s T1 and T2: corpus row LF-1, a real-world`
  `//! LineString file, opened and streamed whole against the outcomes its Amendment 1 registered`
  `//! before any engine run.`
  Clause check: Amendment 1's first line reads "Written after the fetch and the observation were seen, before any code and any engine run." Comment-only change; the mutation records stand.

### Notes (non-blocking)
- **N-1. T2 cannot catch a decode that yields no vertices.** If the stream yielded no vertices, `outside.is_empty()` would still pass. M-2 failing at "positions outside the bbox member" shows vertices are read at this code, so the registered prediction is met as worded. A later piece may add a non-empty assertion.
- **N-2. Class 6 asks for the figure "under §21c's counting rule".** Amendment 4 gives 165 on its Scope's basis. The code-and-tests figure, 137, is given only inside its breakdown. That is enough to derive it; there is nothing to fix, since the form is append-only.

## Check 1: ADR readings and the out-of-scope line
- **ADR-034.** Decision 2 fixes the encoding at open from the declared types. `encoding_for_declared_types` (engine/src/geoarrow.rs, at head) gives `GeometryEncoding::LineString` for an all-LineString set at line 213. Read, not changed: the branch touches no ADR file and no file under src/.
- **ADR-016.** Session-ordinal identity (`IdSource::SessionOrdinal`, engine/src/identity.rs:103). T2 asserts unique ids, in line with §5. Read, not changed.
- **ADR-021.** The test opens through `Dataset::open` with no fetch. The one fetch is the custodian's (Amendment 1). The no-runtime-fetch amendment is untouched.
- **ADR-009's history term.**
  - No DENY_EXT path is added, and the largest added blob is 2469 bytes. Both figures are from the worker's report; I could not re-run the scan.
  - The observation file holds footer metadata only (sizes, hash, schema names and types, bbox, row count). Under round 26, item 1's reading of `observed` blocks as metadata, that is metadata, not data.
  - The contact is disclosed as the form's Out-of-scope line says.
- **ADR-020.** Nothing it governs.
- **Out-of-scope, item by item, against the head:**
  - wire: none; nothing under protocol/;
  - guarantee: none changed;
  - P6: none (the test's assertion messages are not operator text);
  - §36 sets round 25, item 2 (e) aside, so the five-line form stands;
  - the licence row and the sighting line go to the human (see E-1 to E-7).
- **Seams.** The test uses only real `pub` accessors: `geometry_encoding`, `declared_geometry_types`, `covering` (dataset.rs:975–995), `envelope`, `identity().source().is_session_ordinal()`. Its stream shape follows engine/tests/line_stream.rs:61–78. No `pub` item is added.

## Check 2: the records against the corpus model
- **RECORD row, column by column:**
  - id `LF-1` avoids `#`/`M-`/`R-`, so C4(a)'s `^\| (#|M-|R-)` does not read it;
  - the path is corpus-relative, in backticks;
  - the producer cell names its field (`parquet_footer_created_by`), matching observation line 11;
  - the invocation, ETag, Last-Modified and version id match Amendment 1;
  - inputs: "that object, at that version id";
  - sha256 ea32…c24d and bytes 5545 match observation lines 3–4, and the row holds exactly one 64-hex string;
  - procedure recorded "no" is right under RECORD.md:15's definition, because a version-pinned object URL is not a commit-pinned URL; the why cell is D-1.
- **Size and placement:** RECORD.md stands at 119 lines, under RECORD_MAX_LINES 200. The README-layout pin clause is present.
- **LICENCES row against §2b:**
  - primary source: the rights holder's repository at a commit pin, which is right;
  - consulted sources: the mirror is marked as a processor's statement (S9), which is right;
  - identified: ODbL, per Amendment 1;
  - open: deferred (E-3);
  - set: local-only per OPEN-1 (A), which is right;
  - no licence text is reproduced, which is right;
  - URL and time gaps: E-1.
- **LICENCES_MAX_LINES.** It is the corpus piece's declared ceiling (its §7), applied at that piece's apply rounds (its Amendments 1, 3.1(f), and 2, 4.2(g)). §2b, the section this form adopts, states no size ceiling, and no script enforces one (my search of scripts and source under the worktree found no hit).
  - My reading: it binds that piece's apply rounds, not this piece's ordered section. Note 5 planned about 13 lines into a 98-line file, so passing 100 was foreseeable at form time.
  - What follows: nothing in code. The file is red-line text, so the human sees 111 lines at the sighting; I add it to the question list.

## Check 3: the amendments
- **Amendment 1, class 1.** Its first line says it was written after the results were seen, and the form's §4 order makes the settlement class 1.
  - Its facts match the observation file: row_count 12, `["LineString"]`, no crs key, the five columns with no `id`, a bbox.* covering, the bbox present, `parquet_open_error` null, sha256 and bytes, 111 lines.
  - It matches ruling C's "smallest" rule (PCN, first try).
  - Its licence reading is E-2 and E-4.
- **Amendment 2, class 2.** This is right: §3's registered reason differs from what the fetch found, the cell stays "no", and §3 is not edited.
- **Amendment 3, class 1.** This is right: it records facts that Amendment 1 omitted, and its first line says so. It matches disclosure 3 of the worker's report.
- **Amendment 4, class 6.** This is right: 165 against 150, the Scope line unedited, both gates from dispatch. Its figures match disclosures 1 and 2 of the worker's report.

## Check 4: the tests against the predictions
- **T1** asserts each of Amendment 1's predictions, none weaker:
  - the encoding, as `GeometryEncoding::LineString`, which is the enum for `geoarrow.linestring` (geoarrow.rs:45 and 64);
  - `crs_provenance` `crs:format-default` (the envelope key, envelope.rs:155);
  - the session ordinal;
  - covering paths `bbox.xmin`, `bbox.ymin`, `bbox.xmax`, `bbox.ymax`;
  - plus the declared types (stronger);
  - a hash check before the open and after it.
- **T2** asserts:
  - no refusal;
  - rows equal to 12;
  - 12 unique ids, with a repeat asserted;
  - every vertex within the bbox, inclusive, against BBOX literals equal to observation lines 60–63;
  - a hash check before the open and after the read.
  - N-1 notes its one blind spot.
- **Mutations as the form words them:**
  - M-1 is the line-213 arm;
  - M-2 is in `read_line`;
  - M-3 is the hash comparison in `file_matches`.
- **The RECORDED MUTATION lines** in T1 and T2 each name the mutation, the 40-hex code commit 3b9e0662… and the failing assertion. The outcomes are as predicted:
  - M-1 fails T1 at the encoding and T2 at the `coordinate pairs` downcast;
  - M-2 fails T2 only;
  - M-3 fails both at `pre-open hash`.
- These are the piece's own runs, not verify-mutation runs, so "observed" is correct.

## Check 5: what the piece may not claim
- No timing.
- No byte-reproducibility: the row is "no", and nothing says reproducible.
- No MultiLineString claim.
- No shell, draw, pick or publish claim.
- Nothing off Windows: the tests are ignored and use the absolute CORPUS_ROOT. The test names describe one input and claim nothing beyond it.

Files: `C:/dev/wt/lf1/engine/compat-corpus/LICENCES.md`, `C:/dev/wt/lf1/engine/compat-corpus/RECORD.md`, `C:/dev/wt/lf1/engine/tests/line_corpus.rs`, `C:/dev/spatial-ide/engine/CORPUS-LINE-FILES-PREREGISTRATION.md`.
