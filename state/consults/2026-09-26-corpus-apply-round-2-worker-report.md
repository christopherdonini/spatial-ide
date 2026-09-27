*Custodian's filing note (2026-09-26): the hand-back of the worker that ran Amendment 2's item 2.2 (the regeneration of #1-#6 and R-1) and applied its items 4.1-4.4 of `engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md` for PLAN node `corpus-reproducibility-record`, on cut/corpus-reproducibility-record @ e8e0cac, a local branch not pushed until the human's sight. Transcribed from the hand-back message with the harness's two-space indent removed; the report prints no P-a value and no path under the Windows Users root. Every line cite below is into the branch, not into main. Everything below the rule is the worker's text.*

---

Amendment 2's regeneration (item 2.2) ran clean, no STOP, and 4.1/4.2/4.3 are committed. Full item 4.4 list follows.

**Commits** (both `-s`, on `cut/corpus-reproducibility-record`, not pushed):
- `d4d71f3` — `engine/compat-corpus/RECORD.md` per Amendment 2 item 4.1
- `e8e0cac` — `engine/compat-corpus/LICENCES.md` per Amendment 2 item 4.2

**Both diffs from 2.2(d)** (each exactly one changed line, the `OUT =` line; `grep -c` for `compat-corpus`/`spatial-ide` over both copies = 0):
```
gen_geopandas.py: < OUT = r"C:\dev\spatial-ide\target\fixtures\compat-corpus\geopandas"
                  > OUT = r"C:\dev\corpus-regen\geopandas"
gen_duckdb.py:    < OUT = r"C:\dev\spatial-ide\target\fixtures\compat-corpus\duckdb-spatial"
                  > OUT = r"C:\dev\corpus-regen\duckdb-spatial"
```

**E0 / E1 (no path printed or recorded, per 3.2/§4 P-a):** identical on both reads. Python 3.11.9, Windows-10-10.0.19045-SP0; pandas 3.0.5; numpy 2.4.6; pyarrow 25.0.1; geopandas 1.1.4; shapely 2.1.2; pyproj 3.7.2; duckdb v1.5.5 (d8cdaa33fd, Variegata). Spatial extension: `installed`=true both times, `install_mode`=REPOSITORY, `installed_from`=core, `extension_version`=eb1e57c, install-file sha256 d91563a6c570d5d854ef3d31d9de6b84eac3721cd9fb9c441146e88051a9c425, size 55594518, mtime unchanged. No STOP (installed was true; E1 = E0).

**Counts and sha256 of L0/L1/V0/V1:** L0 34 files sha256 d03c8cce5a3dae657245e7623fc4c51cec5b1a92b131a35667056911a154ee68; L1 34 files, identical hash (L0=L1). V0 9256 files sha256 93fd858b9b81604f62bdd5f17b6f91f8302a9b242749204f5639da342da4f19d; V1 9256 files, identical hash (V0=V1). C2/C3 passed before and after (C9).

**Seven outcomes, full sha256 — all `equal`** (so U = ∅, no id carries {P}):
- #1 66afc49203cb97ba72fd347cd27964832965bd8bffbf8db498aa18b5f6ab38f9 — equal
- #2 a55e41bbfd4c3e43d0771484ee99f2543a9089523e9ba90066499a2c136a46a6 — equal
- #3 bbb8d0bcb0c3ef76687cf81cebcdabbe67c12bfa6e03b3a97a2c9cb6d25de265 — equal
- #4 7a9da027167681ee04d7f4d25c85bbfff6795bed9829c5c3ab71addfc9a7e403 — equal
- #5 b471a90f2e87e91e83c2de6c5fd73bc9ea7ab83fbea1c733988eeaef725357af — equal
- #6 94c737ebb4e7f74812cf386b3e70d9318700dc972c7521502d5be2f50440705a — equal
- R-1 fc8a150a551995e9d214eb0ae8019bbe1409666b7aa4be1d10ac2d7977a218dc — equal

{P} extracted mechanically from `state/directives/2026-09-26-corpus-positions-and-stop-hook.md` @ `6e743ed` (git log origin/main --diff-filter=A), §2 line 12, sha256 db32712e1557bd26a38656562c05d6f473686d9bc641a5856e56d9c71c43b08d = "regeneration unpinned: reproducible in intent, not established" — computed by script and cross-checked with the literal `git show 6e743ed:<path> | sed -n '12p' | sha256sum` command; never retyped into the committed files (0 occurrences confirmed, correct since U = ∅).

**Each check, as counts (4.3):**
- C1: 13/13 equal pairs; 13/13 `attr/-text`.
- C4(a): 21 rows, 0 disagree. C4(b): 0 output (no collision).
- C5: 25 total paths across 13 branch commits — (i) fails by the letter on the same 6 pre-existing bookkeeping paths of `488b641` only (unchanged by this round; disposed under D1/C13 below), 19 in-Scope; (ii) DENY_EXT 0 matches; (iii) 31 unique added/modified blobs, max 185521 B < 262144 B ceiling; (iv) 0 PAR1 magic-byte hits; (v) `.gitattributes`/`kernel/FIXTURES.md` diffs: 0 removed lines, hunks begin after base's last line.
- C6 (pattern files, self-tested against positive samples before use, run over the 24 non-preregistration paths): P-a 0/0 (USERNAME/COMPUTERNAME occurrences, counted by direct file search, not printed); P-b 1 hit (`kernel/FIXTURES.md:100`, pre-existing, unchanged this round); P-c 0; P-d 0; P-e 54 total instances across 13 files (same set/count as the prior round's report), 0 of them in `RECORD.md` or `LICENCES.md` — no new hit from this round's edits. No STOP (P-a–P-d all 0).
- C7: `node --test` 311/0 fail; `verify-cites.mjs` PASS (80 pre-existing advisory); `verify-quotes.mjs` PASS (30 baselined + 1 advisory + 2 hash-baselined, all pre-existing, 0 new finding — re-ran `--show-cites` on the two changed files specifically: 1 path:line cite, hash PASS); `verify-test-claims.mjs` PASS; `verify.mjs` PASS; `queue.mjs --check` PASS; `site.mjs --check` PASS.
- C8: command 1 printed `0`; command 2 printed nothing (grep exit 1).
- C9: L0=L1, V0=V1, C2/C3 pass before and after — confirmed above.
- C10: E0 = E1 on every extension fact — confirmed above.
- C11 (2.2(d)): both diffs single-line, both greps 0 — confirmed above.
- C12: only `RECORD.md`/`LICENCES.md` changed vs `dce598c` (plus the Amendment-2-commit's own preregistration file, expected); `unrecorded` count fell by exactly 11 (2×4 geopandas/R-1 rows + 1×3 DuckDB rows); {P} occurs 0 times in both files (U = ∅); no scratch-directory name or extension install path appears in either file.
- C13 (3.1 i–iv, for `488b641`, the only commit touching the six bookkeeping paths): (i) name-status lists exactly the six paths + preregistration `A` — pass; (ii) the one PLAN.yaml diff hunk (`@@ -2441,12 +2441,12 @@`) lies entirely inside the `corpus-reproducibility-record` node block (lines 2439–2456) — pass; (iii) in a detached worktree at `488b641`, `queue.mjs --check` and `site.mjs --check` both exited 0 — pass; (iv) `site/data/health.json` has the same 45 JSON key paths at `488b641` and `488b641^` — pass. All four hold, so block-on-sight 2 is disposed for those six paths per D1/3.1.
- C14: both STOP sets (3.4, 4.2(d)) checked at each step; none fired.
- §7 ceilings: `RECORD.md` 103 lines (≤200); `LICENCES.md` 98 lines (≤100); both LF-only (`grep -c $'\r'` = 0 on both).
- Resolution step (4.3): every changed cell in both files was checked cell-by-cell against E0/E1, the seven outcome hashes, {P}'s extraction and the two fetch hashes below — no mismatch. No STOP.

**C6's hit list:** P-b: `kernel/FIXTURES.md:100` (pre-existing `D:` path + a Users-root path, counted there). P-e: 41 lines / 54 instances across `LICENSES/README.md`, `of-record/MANIFEST.json`, `of-record/PROBE.json`, `of-record/README.md`, five `of-record/scripts/*.py`, `kernel/FIXTURES.md`, `site/data/health.json` — identical set and count to the first apply round's report (nothing in this round's two changed files). Disposition of these is D2/item 5 of Amendment 2, unchanged here.

**Fetch hashes:**
- SPDX `license-list-data`, latest release `v3.29.0` (GitHub API `releases/latest`), tag dereferenced to commit `31ba1a50e5397e00a304dbadc76531740e89ee48` (annotated-tag `^{}`); `json/licenses.json` fetched twice with `curl -sL`, both sha256 47d1cc681abe31166b342b6cc4aab13a6ba8ea5c48794697fe3bf8b1dbaf509a (byte-stable); `licenseListVersion` "3.29.0" = tag minus leading `v`; Apache-2.0 `isOsiApproved` = `true`. No STOP.
- #12 re-fetch (4.2(d)): same URL, sha256 ed39c1ff27eaf6cb021d80bdc9e142c06255f293bb9b95502e645ca8cfb41c89 = the row's existing value; buildings-section per-source entries separate mechanically on the bullet list; licences found (ODbL theme; ODbL 2 sources — OSM, Global ML Building Footprints; CC BY 4.0 4 sources — Esri, Google Open Buildings, Qian Shi et al., BTN 2024; 1 source, USGS, names none) exactly match the build's report §5. No STOP.

**Any STOP:** none fired at any step.

---

**Other required items:**
- `git status --porcelain` (worktree): empty.
- `git ls-remote origin cut/corpus-reproducibility-record`: empty (nothing pushed).
- `C:\dev\corpus-regen` left in place, with its four subdirectories and `evidence/` populated (no path from it is named in either committed file); the custodian deletes it after the reviewer's gate per §10's custodian note.
- **Four-failure-class self-check:** cross-module interface — n/a, docs-only, no code interface touched. Completion claims — every "pass"/"equal"/count above points to a command run this session (shown or referenced), no unproven claims. User-facing messages — n/a, no product-facing text changed. Required tests reaching intended assertions — C7's 311-test suite ran to completion with explicit pass/fail counts; C13's detached-worktree checks ran the actual `queue.mjs`/`site.mjs` commands to their exit codes, not just setup.
- **Model:** ran as claude-sonnet-5 (Sonnet 5) throughout, no override, no context handoff received or produced.
- **Noticed but not changed (off-scope):** the pre-existing P-e/P-b hits in `LICENSES/README.md`, `of-record/*`, `kernel/FIXTURES.md`, `site/data/health.json`, and #12's multi-licence local-only status, D4's premise, and #11's OSI-list disclosure — all left exactly as Amendment 2 item 5 routes them to the human; not this apply round's scope. The stray detached worktree `C:/dev/wt/triage-a3-obs3` (unrelated to this piece) was noticed via `git worktree list` but not touched.

Files touched: `engine/compat-corpus/RECORD.md`, `engine/compat-corpus/LICENCES.md` (both committed). No other tracked file was modified.
