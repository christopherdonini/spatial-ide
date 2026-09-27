*Custodian's note (2026-09-26): the architect consult's draft of Amendment 2 to engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md for PLAN node `corpus-reproducibility-record` (RULED 2026-09-26, the corpus positions, items (2) and (3)), saved as returned, transcribed from the hand-back message with the harness's two-space indent removed. The custodian appends the fenced block after Amendment 1 on cut/corpus-reproducibility-record and dispatches a worker for its 2.2 and 4.1-4.4. Everything below the rule is the agent's text.*

---

**Verdict: pass with notes.** This was a drafting consult, and nothing I read blocks the draft. The notes are the items under "See first" below. The draft follows, ready to append after Amendment 1. I have not written it to any file.

```markdown
### Amendment 2 — post-result: written after Amendment 1's apply-round results (branch head `dce598c`) were seen

It records RULED 2026-09-26, the corpus positions, items (2) and (3), and the results of Amendment 1's apply round. It names the changes a second apply round makes, and it invalidates no commit. Class per item: the results are class 1. The rulings are class 5, the nearest class, as in Amendment 1, item 1. Evidence: `state/consults/2026-09-26-corpus-apply-round-worker-report.md` (on main), cited as "the report". Amendment 1 item 4's decisions are disposed as follows: D1 in 3.1, D2 in 3.2, D3 in 3.3, D5 in 3.4, and D4 by item 2's narrowing.

**1. Results (class 1).** The apply round's checks stand as the report gives them. One hit is new against Amendment 1, item 2.3: C6 lists two P-e hits on a pre-existing line of `LICENSES/README.md` (the report, its C6 bullet). They are outside `PERMITTED_PATH_PREFIXES`, in a file that entered Scope by Amendment 1, item 1.1(d). Block-on-sight 7 routes them to the human (item 5).

**2. Item (2): the regeneration (class 5).** The ruling narrows round 26, item 2 (Amendment 1, item 1.3) for #1–#6 and R-1. Paraphrase: regenerate them with the installed pandas, numpy and DuckDB spatial, compare full hashes, and record as 2.3 says.

- **2.1 What gives way, and how far.**
  - Block-on-sight 10's first clause, and §0 item 5's second clause, give way for exactly two executions in item 4's round: one of a scratch copy of `scripts/gen_geopandas.py` and one of a scratch copy of `scripts/gen_duckdb.py`, made as 2.2 says.
    - No other generator runs.
    - Neither execution is repeated.
    - No tracked copy under `of-record/` is executed.
    - Block-on-sight 10's second clause (any change to the corpus of record) does not give way.
  - Block-on-sight 9 gives way for two things only: the pandas and numpy versions of #1–#3 and R-1, and the spatial extension version of #4–#6. §2a's rules that a version is never filled from a present-day read and that every value names an `of-record/*` field give way in the same bound.
    - Each such value comes from 2.2's run and names `RECORD.md`'s section "Regeneration run".
    - It is written only in a row whose outcome is `equal`.
    - Every other version cell stays under block-on-sight 9. An `unrecorded` in any row that is not `equal` stays.
  - §5's declared-unchanged list holds, including the corpus of record and `target/corpus-venv` (C9).
- **2.2 The run.** STOP means hand back and commit nothing further.
  - (a) **Scratch directory.** STOP if `C:\dev\corpus-regen` exists.
    - Create it with the subdirectories `scripts`, `geopandas`, `duckdb-spatial` and `evidence`. It is outside the repository and outside the corpus of record.
    - It is never named in `RECORD.md` or `LICENCES.md`.
  - (b) **Before the run.** Run these from `C:/dev/spatial-ide`, writing the listings to `evidence/`:
    - C3, then C2;
    - listing L0: every file under `target/fixtures/compat-corpus/`, with relative path, size, mtime and sha256, sorted;
    - listing V0: every file under `target/corpus-venv/`, with relative path, size and mtime, sorted.

    STOP on any C2 or C3 failure.
  - (c) **Read E0.** Use the venv's `Scripts/python.exe` with `PYTHONDONTWRITEBYTECODE=1`, and read:
    - `sys.version` and `platform.platform()`;
    - `importlib.metadata.version` of pandas, numpy, pyarrow, geopandas, shapely, pyproj and duckdb;
    - DuckDB's `PRAGMA version` (`library_version`, `source_id`).

    Then, in a fresh `duckdb.connect()` after `SET autoinstall_known_extensions=false; SET autoload_known_extensions=false;`:
    - from the `duckdb_extensions()` row for `spatial`: `installed`, and `install_mode` and `installed_from` where those columns exist;
    - the sha256, size and mtime of the file at that row's `install_path`. Never print or record the path itself, which may lie under the Windows Users root (3.2);
    - then `LOAD spatial`, and that row's `extension_version`.

    STOP if `installed` is not true.
  - (d) **Copies.** Copy `gen_geopandas.py` and `gen_duckdb.py` from `engine/compat-corpus/of-record/scripts/` into `scripts/`.
    - STOP unless each copy's sha256 equals its value in `RECORD.md` Hazards, item 1.
    - In each copy, change only the `OUT =` line's value, to `C:\dev\corpus-regen\geopandas` and `C:\dev\corpus-regen\duckdb-spatial` respectively.
    - Make the change with a script that asserts exactly one occurrence. Never use an inline Bash literal (Amendment 1, item 2.4).
    - STOP unless `diff` of each original and its copy shows exactly one changed line, the `OUT =` line, and `grep -c` for `compat-corpus` and for `spatial-ide` over the copies gives 0.
    - Both diffs go into the hand-back as printed.
  - (e) **Run.** With working directory `C:\dev\corpus-regen`, the venv's python and `PYTHONDONTWRITEBYTECODE=1`, run `scripts/gen_geopandas.py`, then `scripts/gen_duckdb.py`, once each.
    - Record each exit code and its UTC start and end. STOP on a non-zero exit.
    - `gp-epsg2056-dupint-struid.parquet` (Hazards, item 3) is neither compared nor recorded.
  - (f) **After the run.** Take E1 as in (c), L1 and V1 as in (b), and run C2 and C3 again. STOP if any of these holds:
    - E1's extension facts differ from E0's (installed, install_mode, installed_from, extension_version, and the file's sha256, size and mtime);
    - L1 differs from L0, or V1 differs from V0;
    - C2 or C3 fails.

    Whether the run's `INSTALL spatial` reaches the network is not asserted. A changed extension is detected, and a fetch that leaves the file byte-identical with the same mtime is not.
  - (g) **Compare.** Take the full sha256 of the seven outputs and compare each with `of-record/MANIFEST.json`'s `sha256` for its entry. The outputs are:
    - in scratch `geopandas/`: `gp-epsg2056-intkey` (#1), `gp-nocrs-nokey` (#2), `gp-epsg4326-covering` (#3) and `gp-epsg3857-strkey` (R-1);
    - in scratch `duckdb-spatial/`: the three files of #4–#6.

    The outcome for each id is `equal` or `differs`.
  - (h) **Leave the scratch directory in place.** Nothing under `C:\dev\corpus-regen` enters the repository.
- **2.3 The recording rule.**
  - **{P}:** the phrase that item (2) places in double quotes. It is extracted by script from `state/directives/2026-09-26-corpus-positions-and-stop-hook.md`, §2, the line that begins `(2) `, at the commit on origin/main that added the file. It is never retyped, and it is not reproduced here (round 12, the rider on (b)).
  - **U:** every id whose outcome is `differs`, plus every id built from one by §2a's inputs, transitively.
    - From #1: #7, #9, #10, M-2, M-3, M-1c, M-1a-equivalent, and M-4 (through #7).
    - From #3: #8.
    - From #2, #4, #5, #6 and R-1: none.
  - **An `equal` row:** its versions are pinned as observed to reproduce the file (4.1 (a)–(b)).
  - **A row in U:** it carries {P} (4.1 (d), 4.2 (b)).
- **2.4 Reconciliation with §1.**
  - **The may-not-claim list stands whole.** `equal` records one fact: one named run, with the versions it lists, wrote bytes whose sha256 equals the manifest's. It is an observation of hash equality, of the same kind as C1. It is not the claim that the file is byte-reproducible, and block-on-sight 8 reads it that way. By this ruling, §1's may-claim list gains that observation for #1–#6 and R-1, and nothing more.
  - **§1's definition of "procedure recorded: yes" is not edited.** An `equal` row meets it: the tracked tree holds the invocation, versions of software that wrote those exact bytes, and no input.
    - Its cell reads `yes (versions observed: Regeneration run)`, never a plain `yes`.
    - The human confirms this reading (item 5). The alternative, leaving `no`, is a one-cell change per row.
  - **A row in U** keeps its procedure-recorded value and its set, each with `; {P}` appended. No set changes and no claim widens.

**3. Item (3): the positions (class 5).**

- **3.1 D1.** Paraphrase: the six paths are accepted as a disclosed scope deviation if they are bookkeeping only. The operational test is C13. It applies to every branch commit `<c>` that touches any of the six, `488b641` and any later commit (for example the custodian's pre-push regeneration):
  - (i) `git diff-tree -r --no-commit-id --name-status <c>` lists only the six paths, plus this preregistration (`A`) for `488b641` alone;
  - (ii) every changed line of `git diff <c>^ <c> -- PLAN.yaml` lies inside node `corpus-reproducibility-record`'s block at `<c>`, meaning from its `- id:` line through the line before the next `- id:` line;
  - (iii) in a detached checkout of `<c>` under `C:\dev\wt\`, both `node scripts/plan/queue.mjs --check` and `node scripts/plan/site.mjs --check` exit 0 (the tools as they stand at `<c>`);
  - (iv) `site/data/health.json` has the same set of JSON key paths at `<c>` as at `<c>^`.

  If all four hold, C5 (i)'s hits on those paths are the accepted deviation, and block-on-sight 2 is disposed for them and for nothing else. If any fails, block-on-sight 2 stands for that commit and goes to the human. D1 disposes of no C6 hit (3.2).
- **3.2 D2.** Paraphrase: the literal `%USERPROFILE%` token is accepted as an unexpanded variable token, and any expanded path under the Windows Users root is refused.
  - §7's list already holds the token and is not edited.
  - C6's text and pass condition are unchanged. P-b stays blocking with no exception, and C8 is unchanged.
  - Main's pre-existing `kernel/FIXTURES.md` line is outside this Scope, which is append-only for that file. It carries the P-b hit (refused) and a `D:` P-e hit. A separate node, which the custodian files, removes it.
    - C6 fails on that line at the head, and block-on-sight 7 blocks the merge, until the line is gone from main and main is merged into this branch.
    - The human may rule otherwise at the PR.
  - Block-on-sight 7 is unchanged. The positions dispose of the `%USERPROFILE%` hit only.
- **3.3 D3.** Paraphrase: #12's row lists every licence its source names, with attribution, and the file is fetch-only and never redistributed. `LICENCES.md` changes as 4.2 (d) says.
  - A source entry that names no licence is recorded as `no licence named by the source`. That is not decided here (item 5).
  - The rule of Amendment 1, item 3.1(a) says a third-party row is reproducible only when its licence is identified and open. So #12 stays in the local-only set, annotated fetch-only.
  - It moves only on the human's ruling on that entry.
- **3.4 D5.** Paraphrase: #11's open status is pinned to the SPDX licence list at a pinned release, plus the source repository's `LICENSE` at the pinned commit.
  - The `LICENSE` is already the row's primary source.
  - O1 is no longer #11's pin.
  - §2b's exclusion of SPDX guesses stands. It concerns identifying a licence, and #11's identification stays on its `LICENSE`. The list is read only for the OSI marking of that licence.

  What the worker fetches, under §2b's source rules:
  - **The release:** the latest release of `spdx/license-list-data` at retrieval. Its tag is resolved to a commit with `git ls-remote https://github.com/spdx/license-list-data "refs/tags/<tag>^{}"`, or with the tag ref itself if the tag is not annotated.
  - **The file:** `https://raw.githubusercontent.com/spdx/license-list-data/<commit>/json/licenses.json`, fetched twice with `curl -sL`.
  - **The fields:** `isOsiApproved` of the `licenses[]` entry whose `licenseId` is `Apache-2.0`, and the file's `licenseListVersion`.

  STOP if the two fetches differ, if `licenseListVersion` is not the tag without its leading `v`, or if `isOsiApproved` is not `true`.

**4. The apply round.** A worker applies 2.2, then exactly 4.1–4.2, with one signed-off commit per file, not pushed.
- `of-record/**`, `.gitattributes`, `kernel/FIXTURES.md` and `LICENSES/README.md` are not touched.
- Inserted strings are extracted by script from this amendment or from their named source, and never retyped. `{…}` placeholders are filled from the run's evidence.

- **4.1 `RECORD.md`:**
  - (a) In each `equal` row among #1–#3 and R-1:
    - in the producer-and-version cell, replace `` pandas `unrecorded`; numpy `unrecorded` `` with `pandas {v}; numpy {v} (observed to reproduce this file: Regeneration run)`;
    - set procedure recorded to `yes (versions observed: Regeneration run)`;
    - set the why cell to `` invocation: `scripts/gen_geopandas.py`, block {n}. Versions: Regeneration run's list, observed to write these bytes. No inputs (synthetic) ``, where {n} is 1, 3, 4 and 2 for #1, #2, #3 and R-1.
  - (b) In each `equal` row among #4–#6:
    - in the producer-and-version cell, replace `` spatial extension version `unrecorded` `` with `spatial extension {v} (observed to reproduce this file: Regeneration run)`;
    - set procedure recorded as in (a);
    - set the why cell to `` invocation: `scripts/gen_duckdb.py`, block {X}. Versions: Regeneration run's list, observed to write these bytes. No inputs (synthetic) ``, where {X} is A, B and C.
  - (c) In a `differs` row whose why cell begins `as #1` or `as #4`, where that referent row is `equal`: replace the why cell with the referent's why cell at `dce598c`, byte-copied.
  - (d) In each row in U, append `; {P}` to the procedure-recorded cell.
  - (e) After Hazards and before Verify, insert:
    > ## Regeneration run (the preregistration's Amendment 2)
    >
    > - **Run:** {UTC start} to {UTC end}, with the corpus venv `target/corpus-venv`. Copies of `scripts/gen_geopandas.py` and `scripts/gen_duckdb.py` (sha256 as in Hazards, item 1), with only `OUT` changed to a scratch directory outside the repository and the corpus of record, were each executed once. The corpus of record and the venv were unchanged (C2, C3 and full listings, before and after).
    > - **Versions read:** Python {v}; {platform}; pandas {v}; numpy {v}; pyarrow {v}; geopandas {v}; shapely {v}; pyproj {v}; duckdb {library_version} ({source_id}); spatial extension {extension_version} (`duckdb_extensions()`), binary sha256 {hex}, unchanged by the run.
    > - **Outcome** (the full sha256 of the regenerated bytes against the entry's row):
    > - **What `equal` states:** this one run, with the versions above, wrote bytes with the entry's sha256. It is not a claim that the file is byte-reproducible (the preregistration's §1).
    > - **The mark** in the procedure-recorded cells is the human's phrase, RULED 2026-09-26, the corpus positions, item (2). It is byte-copied by script from `state/directives/2026-09-26-corpus-positions-and-stop-hook.md` @ {rev}, §2, the line beginning `(2) `, sha256:{hash}. The phrase is a sub-line span; the hash is its line's. It marks a file whose bytes did not regenerate, and every file built from one (§2a's inputs).

    Under "Outcome", insert seven sub-bullets in the order #1, #2, #3, #4, #5, #6, R-1, each `  - {id}: equal` or `  - {id}: differs, regenerated sha256 {hex}`. {rev} is `git log origin/main --diff-filter=A --format=%h -1 -- <that path>`, and {hash} is `git show {rev}:<that path> | sed -n '{line}p' | sha256sum`.
- **4.2 `LICENCES.md`:**
  - (a) In Rules, replace the bullet that begins "An identified licence is **open** only when" with:
    > - An identified licence is **open** only when the OSI approved-licence list or the Open Definition conformant-licence list also names it. For #11, OSI approval is read from the SPDX licence list at a pinned release (O4; RULED 2026-09-26, the corpus positions, item (3)).
  - (b) For each row in U, append `; {P}` to its set cell and to its path's line in the reproducible-set list.
  - (c) In #11's licence cell, replace `Open: the OSI list names it (O1)` with `Open: the SPDX licence list at {tag} marks it OSI-approved (O4; RULED 2026-09-26, the corpus positions, item (3))`.
  - (d) #12:
    - **Re-fetch first.** Re-fetch the row's URL. STOP if its sha256 is not the row's, if the buildings section's per-source entries cannot be separated mechanically, or if the licences named differ from the build's report §5 (the theme ODbL; ODbL 2 sources, CC BY 4.0 4 sources, none for 1).
    - **Licence cell:** replace it with `Every licence the source names, with attribution (RULED 2026-09-26, the corpus positions, item (3)). The buildings theme: {licence}. Per source, in the source's order: {entry} — {licence, or no licence named by the source}; … The release's own notes name no licence (S7). The Open Definition list names ODbL-1.0 and CC-BY-4.0 (O3)`.
      - Each {entry} and {licence} is byte-copied by script from the pinned bytes.
      - `|` is escaped as `\|`, and line breaks are joined with one space.
    - **Set cell:** `local-only — fetch-only, never redistributed (RULED 2026-09-26, the corpus positions, item (3))`.
    - **Local-only list:** suffix #12's path with ` — fetch-only, never redistributed`.
  - (e) Replace O2's third sub-bullet with `  - Superseded as #11's pin by O4.` After O3, insert one line:
    > - **O4. SPDX licence list, release {tag} (#11's OSI pin; RULED 2026-09-26, the corpus positions, item (3)).** Source: {commit-pinned URL}, retrieved {UTC}, sha256 {hex} ({byte-stable or not byte-stable}). Its `licenses[]` entry with `licenseId` `Apache-2.0` has `isOsiApproved` `true`; `licenseListVersion` {v}.
  - (f) Replace the line that begins "By regeneration means" with:
    > By regeneration means the procedure `RECORD.md` records. Its section "Regeneration run" gives one run's outcome for #1–#6 and R-1. An entry that carries the human's phrase (RULED 2026-09-26, the corpus positions, item (2)) is one whose regeneration is not established, or is built from one.
  - (g) The sighting line stays last and blank. The file stays at most `LICENCES_MAX_LINES` long.
- **4.3 Checks at the new head.** Hand back counts.
  - C1, C4 (a) and (b), C5 with 1.1(d)'s path, C6 from pattern files (2.4 of Amendment 1), C7, C8, and §7's ceilings.
  - **C9:** L0 = L1, V0 = V1, and C2 and C3 pass before and after.
  - **C10:** E0's extension facts equal E1's, and `installed` is true at E0.
  - **C11:** 2.2 (d).
  - **C12:** read `git diff` of each file cell by cell; the checks below apply to every id.
    - Only the cells 4.1 and 4.2 name change, and each changes as its outcome requires.
    - {P} occurs in `RECORD.md` exactly |U| times, all in procedure-recorded cells, and in `LICENCES.md` exactly 2|U| times. Each occurrence equals the extracted phrase byte for byte.
    - The count of `unrecorded` in `RECORD.md` falls by exactly the cells pinned: 2 per `equal` geopandas row and 1 per `equal` DuckDB row.
    - Neither file names the scratch directory or an extension path.
  - **C13:** 3.1 (i)–(iv).
  - **C14:** the STOP conditions of 3.4 and 4.2 (d).
  - **Resolution step:** resolve every changed cell and every "Regeneration run" line against E0, E1, the outcome hashes, the extracted phrase and the fetched hashes. STOP on a mismatch.
- **4.4 Hand-back.** It contains:
  - the commits;
  - both diffs from 2.2 (d);
  - E0 and E1, with no path;
  - the counts and sha256 of L0, L1, V0 and V1;
  - the seven outcomes, with full sha256;
  - each check, as counts;
  - C6's hit list;
  - the fetch hashes;
  - any STOP.

  The values of `$USERNAME` and `$COMPUTERNAME` are never printed, only the count (§4, P-a), and no path under the Windows Users root is printed. Budget: 90 minutes; at the budget the worker hands back from where it stands.

**The custodian:**
- Amendment 1 item 3's pre-push steps stand. Any commit they make that touches the six paths passes C13.
- The branch stays local until the human has sighted `LICENCES.md` and the scan hits (the directive's item (1)).
- After the reviewer's gate, delete `C:\dev\corpus-regen`.

**5. To the human, at the PR.**
- `LICENCES.md`: the table, both sets and their lists, and the sighting line.
- C6's hits that the positions leave open:
  - the five non-paths (Amendment 1, item 2.3);
  - `kernel/FIXTURES.md`'s `D:` hit, and its Users-root hit (refused; the merge waits for the separate node unless the human rules otherwise, 3.2);
  - `LICENSES/README.md`'s two pre-existing P-e hits (item 1);
  - the worktree path in `488b641`'s `site/data/health.json`, which stays in history (Amendment 1, item 1.4). It is also at the head if the custodian's regeneration has not removed it.
- C13's result for each commit (3.1).
- #12: the source entry that names no licence, and whether #12 moves to `reproducible — by fetch` (3.3).
- The reading in 2.4: `yes (versions observed: Regeneration run)`, or `no` left in place.
- #11: the SPDX release the worker took, the latest at retrieval.
- The merge is by merge commit (Amendment 1, item 1.4).
```

**What the worker applies:** 2.2 (the run, with its STOPs), then 4.1 (`RECORD.md`) and 4.2 (`LICENCES.md`), one signed-off commit each, not pushed. Then 4.3's checks C1, C4–C14 and the resolution step, and the 4.4 hand-back. The worker needs web access for the #12 re-fetch and the SPDX fetch, so dispatch it as general-purpose, as the build was. `LICENCES.md` should end at 98 lines (O4 is the only line added) and `RECORD.md` at about 104.

**What the custodian does:**
- Commit this draft as returned and append it on `cut/corpus-reproducibility-record`.
- Dispatch the worker.
- File the separate `kernel/FIXTURES.md` node. This PR cannot pass C6 until that node lands on main and main is merged into the branch (3.2).
- Run the pre-push steps, then take the item 5 list to the human.
- Delete `C:\dev\corpus-regen` after the reviewer's gate.

**See first:**
1. **The human's phrase is not reproduced in the amendment.** The template's §10 reads class 5's "quoted verbatim" through round 12 (a) and (b). The sentence is understandable without the phrase, and I cannot hash-pin it because I have no Bash. The worker extracts it by script (2.3), and `RECORD.md` carries it with a rev-pinned line hash.
2. **The `RECORD.md` pin carries no `:line`.** The directive file is not on the branch, and `scripts/plan/verify-cites.mjs` resolves rooted `path:line` cites against the working tree and ignores `@ rev`. A `:12` cite would redden C7 on the branch.
3. **I added the phrase to `LICENCES.md` as well as `RECORD.md`.** The brief named `RECORD.md` only. Without the phrase, `reproducible — by regeneration` in the table the human sights would state more than the narrowing allows. Drop 4.2 (b) and C12's `LICENCES.md` count if you disagree.
4. **The venv would otherwise change.** Without `PYTHONDONTWRITEBYTECODE=1`, the imports may write `.pyc` files into `target/corpus-venv`, which §5 declares unchanged. The draft sets it and proves the venv unchanged with V0 = V1.
5. **The DuckDB extension path may lie under the Windows Users root.** The draft forbids printing it. The last hand-back also printed the P-a values; 4.4 forbids that again.
6. **For your information, unverified and not used in the draft:** pyarrow's `from_pandas` normally writes a `pandas_version` into the schema metadata. If #1–#3 and R-1 carry it, a differing installed pandas predicts `differs` before the run. It would be a version source §2a does not allow, so it is not in the draft.
7. **Your pre-push regeneration touches the six paths again.** C13 is written per commit touching them, not only `488b641`, so that commit is covered. It still has to pass (i)–(iv).
8. **#12 stays local-only under the draft.** The build's report §5 names USGS 3DEP as the source entry that names no licence, which is why the draft keeps #12 local-only. If the human's position meant #12 to be reproducible by fetch anyway, that is their one-line ruling at the PR.

Files read:
- `C:/dev/wt/corpus-record/engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md`
- `C:/dev/wt/corpus-record/engine/compat-corpus/RECORD.md`
- `C:/dev/wt/corpus-record/engine/compat-corpus/LICENCES.md`
- `C:/dev/spatial-ide/state/directives/2026-09-26-corpus-positions-and-stop-hook.md`
- `C:/dev/spatial-ide/state/consults/2026-09-26-corpus-record-worker-report.md`
- `C:/dev/spatial-ide/state/consults/2026-09-26-corpus-apply-round-worker-report.md`
- `C:/dev/spatial-ide/target/fixtures/compat-corpus/scripts/gen_geopandas.py`
- `C:/dev/spatial-ide/target/fixtures/compat-corpus/scripts/gen_duckdb.py`
- `C:/dev/spatial-ide/docs/PREREGISTRATION-TEMPLATE.md`
- `C:/dev/spatial-ide/state/directives/2026-09-18-record-cap.md`
- `C:/dev/spatial-ide/scripts/plan/verify-cites.mjs`
- `C:/dev/spatial-ide/scripts/plan/README.md`
- `C:/dev/spatial-ide/PLAN.yaml`
