*Custodian's filing note (2026-09-27): the scoped gate read (reviewer) of the corpus record's Amendment 3 apply round, at `43e6d04` (then local; pushed as PR #132), transcribed from the hand-back message with the harness's two-space indent removed. It prints no P-a value, no derivative of one and no profile path. Line cites below are into the branch. Path-and-line cites into files that exist only on the branch until PR #132 merges are written as a path and a line number, so that main's verify-cites resolves. Everything below the rule is the reviewer's text.*

---

## Scoped gate read (reviewer): `corpus-reproducibility-record`, Amendment 3 item 7

**Head read:** `43e6d04` (full `43e6d0450e6a5af2eb90a8724efd8c3a91510529`) in worktree `C:/dev/wt/corpus-record`. I compared it against `dea631c`, used `origin/main` = `d6d9862` and merge-base `dd4acf3`. The tree is clean before and after.

### Verdicts (AUTONOMY.md §22)
- **Correctness: PASS.** No severity. Scope is item 6 and the sighting commit. No disposition needed.
- **Evidence: PASS.** No severity. Every one of the worker's claims (C15, C6 P-a, P-b, P-e, C8) reproduced independently with the same counts. No disposition needed.
- **Documentation: PASS.** No severity. All inserted strings are byte-equal to Amendment 3's blockquotes and item 7's sighting text. No disposition needed.
- **Application mismatches against Amendment 3's text: none.** Nothing needs correcting under item 7.

### C15 (`git diff dea631c 43e6d04`, checked cell by cell by script)
- **{Q} extraction (item 2.1):**
  - `ae92f10` is an ancestor of origin/main.
  - 1 line matches, and the substring occurs once in it.
  - The span is 30 bytes and holds no `|`.
  - sha256 `0cd07644c7972fa63dd0a1ecbf63fba752371bdb0228afcccb299c3dde1a8f23`.
- **{Q} occurrences:** 9 in RECORD.md and 0 in LICENCES.md. The worker's claim matches.
- **The nine cells (6.1(a)), rows #7–#10, M-2, M-3, M-4, M-1c and M-1a-equivalent:**
  - Each read `yes, given #N` at base, with the correct input (#1, #3 or #7).
  - At the head each equals {Q} byte for byte.
  - Each head line equals the base line with only cell 8 replaced.
  - The other 12 rows are byte-unchanged.
- **Procedure-recorded column:** {Q} ×9; `yes (versions observed: Regeneration run)` ×7 (#1–#6, R-1); `yes` ×4 (#11, R-2–R-4); `no` ×1 (#12).
- **6.1(b):** the Run line equals the base line + one space + the blockquote.
- **6.1(c):** the "Not re-run" line equals the blockquote. It sits at the old "The mark" line's position, and no "The mark" line remains.
- **6.2(a):** `19:47:35Z` → `19:47:24Z`, exactly one occurrence.
- **6.2(b), 6.2(c):** each equals its blockquote.
- **#12's row:** unchanged.
- **Line counts:** RECORD.md changes 11 lines and LICENCES.md 4 (the three lines of 6.2 plus the sighting line).
- **Sighting commit `43e6d04`:**
  - It touches LICENCES.md only.
  - Its last line equals item 7's backticked text byte for byte.
  - The base's last line was the blank `Sighted by the human:`.
- **Commits:** `158331a` touches RECORD.md only and `40f243f` touches LICENCES.md only. All three commits are signed off.
- **Line endings:** 0 CR bytes in either file.
- **Ceilings:** RECORD.md has 103 lines (≤200) and LICENCES.md 98 (≤100).

### Fetch files (6.2(a))
- `fetch1.json` mtime is 2026-09-26T19:47:24.486Z and `fetch2.json` is 2026-09-26T19:47:24.751Z. Both fall in the second 19:47:24Z.
- Both are 339359 bytes, with sha256 `47d1cc681abe31166b342b6cc4aab13a6ba8ea5c48794697fe3bf8b1dbaf509a`, which equals O4's recorded hash.

### C1, C3, C4, C5, C7
- **C1:** 13/13 byte-equal pairs. `ls-files --eol` lists 13 entries, all 13 `attr/-text`.
- **C3 (also recomputes the §9 hash):**
  - The local manifest's sha256 appears on `engine/ADMISSION-RESULTS.md:3 @ 15f558816bf1`.
  - That line's LF hash equals `e69e59d9887e692dd065db3ff5770da2dcc2ea6403c4e29aaf3ee6114c9169bd`.
  - The tracked twin equals the local manifest.
- **C4:**
  - (a) 21 rows, 21 agree, 0 disagree; every row holds exactly one 64-hex string.
  - (b) 22 hashes checked, 0 disagreeing full hashes.
- **C5 (merge paths by item 4.2's main-parent reading):**
  - 18 commits and 59 path entries.
  - 0 paths outside Scope other than the six bookkeeping paths, which occur only in `488b641` (6) and `0fcf006` (5, main-parent diff). Neither is new in this round.
  - DENY_EXT 0; largest added blob 188863 (≤262144); PAR1 0.
  - (v): `.gitattributes`, `kernel/FIXTURES.md` and `LICENSES/README.md` each have 0 removed lines and one hunk at or after the base's last line.
  - The three new commits touch none of the six paths, so C13 has nothing new to check.
- **C7:** every suite exits 0.
  - `node --test`: 311 tests, 311 pass, 0 fail.
  - verify-cites, verify-quotes, verify-test-claims, verify, `queue --check` and `site --check`: rc 0.
  - verify-quotes names no file of this piece. Its findings are all pre-existing, outside this piece's files.

### C6 and C8, re-run independently by item 3.2
- **Method:**
  - Scratch was `C:\dev\corpus-scan`, which did not exist beforehand.
  - Patterns were copied by script from §4's bullets and from Amendment 1 item 1.2's commands. The two C8 patterns are identical.
  - Paths came from C5 (24 paths, all present at HEAD), minus the preregistration.
  - Everything ran from one node script through `child_process`, with outputs written to files and only counts and classes printed.
- **Canary:** it ran first and each class passed: P-a user and host (`-n`, `-c`, `-o`), P-b, P-c, P-d, P-e, C8 command 2, C8 command 1's last stage, the node matcher, the residual script, and a masking self-test. Every class exited 0 and listed its own canary line.
- **Tool facts:** git 2.49.0.windows.1; GNU grep 3.0. `grep -i -F`, launched from node, exits abnormally with rc 1536 rather than 0 or 1. It still aborts, but the code differs from Git Bash's 134.
- **P-a:**
  - The username value hits only `site/index.html`: 140 instances on 137 lines.
  - `git grep -iF` and the node fixed-string matcher agree per file on both instances and lines. The node matcher also scanned binary files: 0 binary files had hits.
  - Residual per step 7 is 0.
  - The host value has 0 hits in both matchers.
- **P-b:** 1 line, `kernel/FIXTURES.md:100`, class (b). Both matches name the public folder.
- **P-c:** 0. **P-d:** 0.
- **P-e:** 40 lines (53 matches). Every one passes 3.1's condition. Classes were assigned by script; no line text was printed.
  - (b) `kernel/FIXTURES.md:100`: one `D:` path outside the Users root, plus the public-folder path matched twice.
  - (c) `LICENSES/README.md:67`: Program Files and Program Files (x86).
  - (d) non-paths: `of-record/MANIFEST.json:38` (2), `of-record/PROBE.json:11` (2), `of-record/scripts/build_manifest.py:38` (1). That is 5, as 3.1 states.
  - §7 prefixes, all in `engine/compat-corpus/of-record/`:
    - `MANIFEST.json:29,30,31,32,1334,1441,1524,1651,1748,1826,1904,2033,2147,2251,2756,2797,2872,3041,3179` (spatial-ide, or QGIS 3.44.2, or both)
    - `PROBE.json:2,3,4,5` (QGIS 3.44.2)
    - `README.md:54` (OSGeo4W), `README.md:55` (QGIS 3.44.2), `README.md:127` (the literal `%USERPROFILE%` token)
    - `scripts/build_manifest.py` line 23,24, `scripts/gen_duckdb.py` line 2, `scripts/gen_gdal.py` line 3, `scripts/gen_geopandas.py` line 12, `scripts/qgis_env.py` line 17,26 (Windows)
    - `scripts/gen_qgis.py` line 50 and `scripts/probe_producers.py` line 27 (bare `C:\`)
- **C8:**
  - Command 1: the diff has 5955 lines and 5768 added lines. `grep -c` prints 0 with rc 1, and a node regex cross-check also gives 0.
  - Command 2: nothing, rc 1.
- **Status:** no SCAN ERROR in any class.

### Suggestions
- **Commit trailers (not a C6 finding):** C6 scans file content only. The username value occurs in 18 `Signed-off-by` trailer lines in origin/main..HEAD, and only there. I counted them after the fact; no trailer was printed. They are commit metadata of the kind every main commit carries, so this is not a C6 finding. I note it for the human's red-line sight, because the push publishes branch commits.
- **Exit code in 3.2's tool fact:** the rc depends on the launcher (134 in Git Bash, 1536 via node). A future scan should treat any status other than 0 or 1 as an abort, as step 6 already does.

### Output discipline
No P-a value and nothing derived from one appeared in any tool output: no canary, no `-o` output, no matched line. The scan script had an output guard that would have suppressed all printing if a value appeared, and it did not trip. I also counted after the fact: the printed commit subjects, the RECORD.md and LICENCES.md diffs, the preregistration and the worktree list hold 0 occurrences of either value. No path naming a user profile was printed.

### Housekeeping
- Both scratch directories I created (`C:\dev\corpus-scan` and `C:\dev\corpus-gate-src`) are deleted.
- `C:\dev\corpus-regen` is left in place for the custodian to delete, per item 7.
- I edited, committed and pushed nothing.

Relevant files: `C:/dev/wt/corpus-record/engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md`, `C:/dev/wt/corpus-record/engine/compat-corpus/RECORD.md`, `C:/dev/wt/corpus-record/engine/compat-corpus/LICENCES.md`, `C:/dev/corpus-regen/evidence/spdx/fetch1.json`, `C:/dev/corpus-regen/evidence/spdx/fetch2.json`.
