*Custodian's filing note (2026-09-26): gate 1, reviewer (full gating), for PLAN node `corpus-reproducibility-record` at `0fcf006` (local, unpushed), transcribed from the hand-back message with the harness's two-space indent removed. Held outside the repository until the human's sight; filed on main afterwards. Line cites are into the branch at `0fcf006`. Everything below the rule is the reviewer's text. Branch-only path-and-line cites are written as a path and a line number, so that main's verify-cites resolves.*

---

## Gate 1, reviewer (full gating): `corpus-reproducibility-record`
Head reviewed: `0fcf006d7f6612089c79d3cadec6d787de19cbc7` (worktree `C:\dev\wt\corpus-record`, branch unpushed, `ls-remote` empty). Range `origin/main...HEAD` (merge-base `dd4acf3`). I edited, committed and pushed nothing. The worktree porcelain is empty, and the main checkout still has only its pre-existing `?? .codex-remote-attachments/`. For C13(iii) I created two temporary detached worktrees under `C:\dev\wt\`, then removed them (`git worktree list` shows 0 left). `C:\dev\corpus-regen` is left in place.

### Verdicts (AUTONOMY.md §22)
- **Correctness: PASS.** Scope: the whole diff. Every tracked byte checks out: 13 copies byte-identical, 21 rows agree with the manifest and the disk, the 7 regenerated hashes agree, the appends are append-only, and every inserted string matches its amendment. Disposition: none.
- **Evidence: FAIL, medium.** Scope: C6 P-a, C13 on the merge commit, and the run's exit codes and one retrieval time. Disposition: before the human's sight, the C6 hit list must gain the P-a class (finding 1), and C13's merge reading needs a ruling (finding 2). The low items (3, 4) go to the architect's record-cap reduction. This piece has already used its two record-correction rounds, so a third worker round is not the route.
- **Documentation: PASS, with low findings (5, 6).** Scope: `LICENCES.md` #12 and two vacuous sentences. Disposition: the architect accepts or reduces them.

### Findings (path:line at 0fcf006)
1. **Medium, Evidence: C6 P-a is not 0 when run by the letter, and every report says 0.**
   - §4 runs C6 as `grep -rnIiE` with `-F` for P-a, so P-a is case-insensitive.
   - Git Bash's grep 3.0 aborts on `-iF` (SIGABRT, rc 134, confirmed against a positive sample). Through `xargs` or `-r` that abort prints nothing, so the count silently comes out 0. This is the same failure class as the backslash collapse in Amendment 1 item 2.4.
   - I re-ran P-a with a node fixed-string matcher and self-tested it on a positive sample: `$USERNAME` gives **140 hits on 137 lines of `site/index.html` (lines 51–382)**, and `$COMPUTERNAME` gives 0.
   - All 140 sit in the owner segment of the repository's own `github.com/<owner>/spatial-ide/...` URLs, which contains the value in a different case. There are 0 exact-case hits and 0 hits in any line the branch adds. They are pre-existing: 138 at `488b641^`, 140 on `origin/main`.
   - Block-on-sight 7 names "a P-a to P-d hit", and no position disposes of this one. It goes to the human.
   - Suggestion: Amendment 1 item 2.4's positive self-test should cover P-a as well.
2. **Medium, Evidence: C13 on the merge commit `0fcf006`, run both ways (item E1).**
   - C13 applies because `--cc` shows the merge touching 5 of the six paths: the two `CUSTODIAN-QUEUE` files, `PLAN.yaml`, `site/data/plan.json` and `site/index.html`.
   - **As written:**
     - (i) is vacuous: `diff-tree` prints 0 lines for a merge.
     - (ii) **fails**: against the first parent `e8e0cac` there are 8 PLAN.yaml hunks. 7 are outside the node's block (lines 2439–2456): 622, 2208, 2212–2213, 2219, 2318, 2606 and 2619–2672 (+54). The 8th, at 2454, is inside but is main's edit to the summary. All eight are main's content.
     - (iii) passes: queue and site checks exit 0/0 in a detached checkout under `C:\dev\wt\`.
     - (iv) passes on object-key paths (47 = 47). It fails on an array-indexed reading, because `drift.failures` goes from 3 elements to 0.
   - **Under the architect's merge reading:**
     - (i) passes: `diff --name-status dd4acf3 0fcf006` lists 24 paths, all in the union of the branch commits' 25 paths. The one missing is `site/data/health.json`, which the merge takes from main.
     - (ii) passes: the only hunks are 2444 and 2448–2449, inside 2439–2456.
     - (iii) passes, as above.
     - (iv) passes: `health.json` is byte-equal to `dd4acf3`'s (blob `d1066a2`).
   - Under Amendment 2 item 3.1, a failed sub-check sends block-on-sight 2 to the human for that commit. So the as-written failure of (ii) goes to the human unless the merge reading is ruled.
   - **C5 lists no path from `0fcf006`**, because `diff-tree` without `-m` is empty for a merge. The merge's 5 regenerated blobs are therefore outside C5 by the letter. I checked them separately: 188863 bytes at most (under 262144), and none starts or ends with `PAR1`.
   - For `488b641`, C13 (i)–(iv) all pass. (i) lists the six paths plus the preregistration (`A`). (ii) has hunks 2444 and 2448–2449, inside 2439–2456. (iii) exits 0/0. (iv) has equal object-key paths, but an array-indexed reading would fail it too (`drift.failures` goes 2→3). The reading of "key paths" should be named.
3. **Low, Evidence: the Regeneration run (item E2). Evidence under `C:\dev\corpus-regen\`; local time is UTC+2.**
   - **Window, supported.** `evidence/gen_geopandas.log` was created at 19:43:21.570Z (the start), and `evidence/gen_duckdb.log` was last written at 19:43:29.573Z. The last DuckDB output was written at 19:43:29.572Z. The recorded window is 19:43:21Z–19:43:29Z (`engine/compat-corpus/RECORD.md` line 65).
   - **Single execution, supported, with one residual.** Each of the 8 outputs was created 0.001–0.071 s before its last write. Each creation falls inside its script's log span (geopandas 19:43:21.57–24.42Z, duckdb 19:43:29.16–29.57Z). A second run overwriting in place would have left a creation time earlier than the last write. The residual: a delete-then-rerun sequence cannot be excluded from these times alone.
   - **Exit 0, not supported as a recorded fact.** 2.2(e) orders each exit code recorded, and no exit code appears in the evidence or the hand-back. Each log holds only the script's own final `print` (the last statement of both scripts), so each run reached its last line; exit 0 is an inference. `RECORD.md` itself makes no exit-code claim.
   - The sequence L0/V0 → E0 → copies → run → E1 → L1/V1 matches 2.2.
4. **Low, Evidence: O4's retrieval time.** `engine/compat-corpus/LICENCES.md` line 53 records O4 as retrieved at 19:47:35Z. Both fetch files (`evidence/spdx/fetch1.json` and `fetch2.json`) were written at 19:47:24Z, so the evidence does not support the recorded time. Nit: the apply-round-2 report says P-e had 54 instances. At `e8e0cac` I count 55 (53 at the head, plus `health.json`'s 2).
5. **Low, Documentation: two #12 entries are not byte-copied.**
   - In `engine/compat-corpus/LICENCES.md` line 29, entries 6 (Qian Shi et al.) and 7 (BTN 2024 ign.es) have their Markdown link syntax stripped, so neither is a byte substring of the fetched `_generated_attribution.mdx`. 4.2(d) says byte-copied.
   - Entries 1–5, the licences, the theme, the prefix and the suffix are all byte-exact. The cell is not presented as a quotation.
6. **Nit, Documentation: two sentences describe a mark that nothing carries.** `engine/compat-corpus/RECORD.md` line 76 ("The mark in the procedure-recorded cells…") and `engine/compat-corpus/LICENCES.md` line 89 describe the human's phrase, but U = ∅ and no cell carries it. Both sentences were prescribed word for word by 4.1(e) and 4.2(f).

### Checks (counts)
- **C1:** 13 of 13 equal (disk, HEAD blob and working copy); 13 of 13 `i/lf w/lf attr/-text`. The Hazards hashes equal the C1 values, 9 of 9.
- **C2** (main root): 21 OK, 0 size mismatches. Independently, today's listing of the corpus (34 files) is byte-equal to L0.
- **C3:** the manifest hashes to `4b1fbca6c565ad4fd1c59d6d8f79927d20ed170611d448dbc8f39c13224af6b3`, which equals the pin.
- **C4:** (a) 21 rows, 0 hash disagreements, 0 byte-count disagreements. (b) 22 hashes, 0 output. The ids match `engine/tests/admission_p4_corpus.rs`, 17 of 17.
- **C5:**
  - 14 commits: 13 branch commits plus the merge, which lists nothing.
  - 31 path-commit pairs, 25 unique paths.
  - (i) 6 outside Scope, all from `488b641` and all bookkeeping.
  - (ii) 0 `DENY_EXT` matches.
  - (iii) 0 blobs over the ceiling; the largest is 185521 bytes (`site/data/plan.json` at `488b641`).
  - (iv) 0 `PAR1` in 31 blobs.
  - (v) 0 removed lines. Hunks are `-70,0 +71,2`, `-117,0 +118,7` and `-271,0 +272,14`, each after the base's last line. The `LICENSES/README.md` append equals Amendment 1 item 3.3, byte for byte.
- **C6** (24 paths, patterns copied by script from §4's bullets; P-b to P-e each self-tested positive and negative): P-a 140 (see finding 1), P-b 1 line (2 matches), P-c 0, P-d 0, P-e 53 instances on 40 lines (43 permitted, 10 not).
- **C7:** `node --test` 311 tests, 311 pass, 0 fail. `verify-cites`, `verify-quotes` (0 hash-reference errors, no finding in the branch's files), `verify-test-claims`, `verify`, `queue --check` and `site --check` all exit 0.
- **C8:** command 1 prints `0`; command 2 prints nothing (rc 1).
- **C9:** L0 = L1 (34 files, `d03c8cce5a3dae657245e7623fc4c51cec5b1a92b131a35667056911a154ee68`) and V0 = V1 (9256 files, `93fd858b9b81604f62bdd5f17b6f91f8302a9b242749204f5639da342da4f19d`). Today's listings equal both. L0's hashes match the manifest for 21 of 21, and its manifest entry equals the pin, so C2 and C3 before and after follow from the listings.
- **C10:** E0 and E1 are byte-identical (`f25c92f88a288a89704f28440fc08ab65d15712995a064f8d5a8796f28fa4fe0`), with `installed_before_load` true. The extension binary today has size 55594518, mtime 2026-09-10T05:01:58Z and sha256 `d91563a6c570d5d854ef3d31d9de6b84eac3721cd9fb9c441146e88051a9c425`, equal to both E0 and E1.
- **C11:** each copy differs from its original on exactly 1 line (the `OUT =` line). `compat-corpus` and `spatial-ide` each occur 0 times in the copies. The rest of each file is identical.
- **C12:**
  - `RECORD.md`: 21 cells changed (producer, procedure and why, in #1–#6 and R-1). `unrecorded` falls from 11 to 0, as expected (2×4 + 1×3).
  - `LICENCES.md`: only the Rules bullet (4.2a), #11's licence cell (4.2c), #12's licence and set cells (4.2d), O2's third sub-bullet and the new O4 (4.2e), the "By regeneration" line (4.2f) and #12's local-only suffix change.
  - {P} occurs 0 times in `RECORD.md` and 0 in `LICENCES.md` (|U| = 0).
  - 0 mentions of the scratch directory or an extension path.
  - Every inserted fixed string matches its amendment line, and every templated line fills its placeholders from the evidence.
- **C13:** see finding 2.
- **C14:** SPDX fetch1 = fetch2, `licenseListVersion` 3.29.0 = the tag without `v`, `isOsiApproved` true. #12's re-fetch hash equals the row's. The buildings bullets separate into 7, split 2 ODbL / 4 CC BY 4.0 / 1 none, as the build report gives. 0 STOP.
- **Ceilings:** `RECORD.md` 103 of 200 lines, `LICENCES.md` 98 of 100, `FIXTURES.md` append 7 of 15, `.gitattributes` append 2 of 4.
- **LF:** 24 of 24 added or modified files are `i/lf w/lf` with 0 CR bytes. The 13 copies show `attr/-text`, 13 of 13.
- **Amendments:** 1 and 2 are pure appends (`-356,0` and `-457,0`), and each is a contiguous byte substring of its architect draft (`d9e72d6` and `9b77d0f`).
- **Cites:** the only line cites are the three `ADMISSION-RESULTS.md:3 @ 15f558816bf1` pins; `15f5588` is on main. The ledger cites resolve to the RULED blocks for the corpus positions and round 26.

### C6 hit list
**Permitted (43):**
- `C:\Program Files\QGIS 3.44.2` ×16: MANIFEST.json 29, 30, 31, 32, 1904, 2033, 2147, 2251; PROBE.json 2–5; README.md 55; build_manifest.py 24; gen_gdal.py 3; qgis_env.py 17.
- `C:\dev\spatial-ide` ×22: MANIFEST.json 1334, 1441, 1524, 1651, 1748, 1826, 1904×2, 2033×2, 2147×2, 2251×2, 2756, 2797, 2872, 3041, 3179; build_manifest.py 23; gen_duckdb.py 2; gen_geopandas.py 12.
- `C:\OSGeo4W` ×1: README.md 54.
- bare `C:\` ×2: gen_qgis.py 50; probe_producers.py 27.
- `C:\Windows` ×1: qgis_env.py 26.
- `%USERPROFILE%` ×1: README.md 127.

All file names above are under `engine/compat-corpus/of-record/`.

**Disposed by the human's positions:**
- The `%USERPROFILE%` token (of-record README.md:127): RULED 2026-09-26, the corpus positions, item (3).
- 488b641's worktree path in `site/data/health.json` lines 8 and 9: gone from the head (`health.json` is main's, 0 P-e). It stays in history under round 26, item 3. Amendment 2 item 5 still lists it for the human.

**Still for the human:**
- **P-a:** `site/index.html`, 140 hits (finding 1). New; no report lists it.
- **P-b:** `kernel/FIXTURES.md:100`, a public folder under the Windows Users root, pre-existing on main. Position (3) refuses it; per Amendment 2 item 3.2 the merge waits for the separate node unless the human rules otherwise.
- **P-e, not permitted (10):**
  - `kernel/FIXTURES.md:100` ×3: one `D:` path, and the Users-root path counted twice.
  - `LICENSES/README.md:67` ×2: `C:\Program Files` and `C:\Program Files (x86)`, pre-existing.
  - Non-paths ×5: `of-record/MANIFEST.json:38` ×2 and `of-record/PROBE.json:11` ×2 (JSON `\n` after a colon), and `of-record/scripts/build_manifest.py:38` ×1 (a Python `%s%` format).

### Recomputed hashes
- §9 pin: `git show 15f558816bf1:engine/ADMISSION-RESULTS.md | sed -n 3p | sha256sum` gives `e69e59d9887e692dd065db3ff5770da2dcc2ea6403c4e29aaf3ee6114c9169bd`, which matches. The pin is authoritative, and the current tree's line 3 (at `origin/main` and at the head) hashes the same. Its 64-hex value is the manifest hash, `4b1fbca6c565ad4fd1c59d6d8f79927d20ed170611d448dbc8f39c13224af6b3`.
- The 13 copies:
  - PROBE.json `57f43ad2…6556`
  - README.md `7beb9e39…0f93`
  - DERIVATIONS.json `c29f3bd6…b575`
  - build_manifest.py `b736dba6…797a`
  - gen_duckdb.py `5629a4bd…94c5`
  - gen_gdal.py `4f873435…20dd`
  - gen_geopandas.py `c49cb1a7…11d3`
  - gen_mutations.py `476a03ab…6ef8`
  - gen_qgis.py `c0e093b6…eadd`
  - observe.py `68345b38…1d16`
  - probe_producers.py `7c30915f…4de9`
  - qgis_env.py `6aa451bd…0b4e`

  Each equals the value in `RECORD.md`.
- The 7 regenerated files (from `C:\dev\corpus-regen\`), all equal to the manifest in both hash and bytes:
  - #1 `66afc49203cb97ba72fd347cd27964832965bd8bffbf8db498aa18b5f6ab38f9`
  - #2 `a55e41bbfd4c3e43d0771484ee99f2543a9089523e9ba90066499a2c136a46a6`
  - #3 `bbb8d0bcb0c3ef76687cf81cebcdabbe67c12bfa6e03b3a97a2c9cb6d25de265`
  - #4 `7a9da027167681ee04d7f4d25c85bbfff6795bed9829c5c3ab71addfc9a7e403`
  - #5 `b471a90f2e87e91e83c2de6c5fd73bc9ea7ab83fbea1c733988eeaef725357af`
  - #6 `94c737ebb4e7f74812cf386b3e70d9318700dc972c7521502d5be2f50440705a`
  - R-1 `fc8a150a551995e9d214eb0ae8019bbe1409666b7aa4be1d10ac2d7977a218dc`
- {P}'s source line: `state/directives/2026-09-26-corpus-positions-and-stop-hook.md`, line 12 at `6e743ed` (on main; the commit that added the file), hashes to `db32712e1557bd26a38656562c05d6f473686d9bc641a5856e56d9c71c43b08d`. That equals `RECORD.md:76`, and `origin/main`'s line 12 hashes the same.
- Re-fetched once each with `curl -sL`:
  - SPDX list `@31ba1a50e5397e00a304dbadc76531740e89ee48`: `47d1cc681abe31166b342b6cc4aab13a6ba8ea5c48794697fe3bf8b1dbaf509a`, which matches. `ls-remote` shows `v3.29.0^{}` at that commit, and it is still the latest release (published 2026-09-16).
  - Overture `_generated_attribution.mdx @3d742db`: `ed39c1ff27eaf6cb021d80bdc9e142c06255f293bb9b95502e645ca8cfb41c89`, which matches.
- The other sources in `LICENCES.md` were not re-fetched, per the brief. Their hashes equal the build report's §5 values, which is a claim, not a re-proof.

Relevant files:
- `C:\dev\wt\corpus-record\engine\CORPUS-REPRODUCIBILITY-PREREGISTRATION.md`
- `C:\dev\wt\corpus-record\engine\compat-corpus\RECORD.md`
- `C:\dev\wt\corpus-record\engine\compat-corpus\LICENCES.md`
- `C:\dev\wt\corpus-record\site\index.html`
- `C:\dev\wt\corpus-record\kernel\FIXTURES.md`
- `C:\dev\corpus-regen\evidence\`
