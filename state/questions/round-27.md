Question round 27 — 2026-09-26 (custodian → human). Six items, in ask order. Items 1 and 2 are RED LINES (public exposure, licensing). They are your sight of the corpus record before anything is pushed: the branch cut/corpus-reproducibility-record is local at 0fcf006, and both gates have read it (Correctness PASS in both; the Evidence items are items 2 and 4 here). The licence table is at C:\dev\wt\corpus-record\engine\compat-corpus\LICENCES.md. Scan hits are described by class and place only, so this file puts none of them on main.

---

1. RED LINE — the licence table (LICENCES.md, 98 lines).
  Reproducible, 17: #11 by fetch (Apache-2.0, named by its LICENSE at the pinned commit; open by the SPDX licence list v3.29.0, which marks it OSI-approved). The 16 project-generated files by regeneration, licence undeclared. #1 to #6 and R-1 were regenerated today from copies of their scripts and all seven matched the manifest byte for byte, so each pins the versions observed to reproduce it (pandas 3.0.5, numpy 2.4.6; DuckDB spatial eb1e57c). #7 to #10 and the five mutations rest on their recorded procedures from those inputs. None carries your "regeneration unpinned" phrase.
  Local-only, 4: #12 (Overture buildings, Bern), fetch-only and never redistributed; R-2 to R-4 (GDAL autotest files, no licence identified).
  After your answers, the table changes only by items 3 and 5 and by the gates' mechanical fixes: O4's retrieval time corrected to its evidence (19:47:24Z); #12's last two source entries byte-copied with their link syntax; a sentence about a mark no row carries reduced; the run's exit codes recorded as not captured.
  (1) Sighted: push after items 2 to 5 are applied and the fixes land (Recommended).
  (2) Sighted, but show me the final table before the push.
  (3) Hold.

---

2. RED LINE — the scan hits (C6) that your positions leave open. Pushing publishes every branch commit, not only the merge.
  (a) P-a, new: the username check was never actually run before. Git Bash's grep aborts on -iF and printed nothing, so every earlier "0" was false. Run properly, it finds 140 case-insensitive matches in site/index.html, all in the owner part of the repository's own GitHub URLs, which are already public. They pre-exist on main; none is in a line this branch adds.
  (b) kernel/FIXTURES.md line 100, on main since 2026-09-15: a public-folder path under the Windows Users root (no user name) and a D: path. Your D2 position refuses the Users-root path. The gates read that as: the corpus merge waits until a separate docs piece rewords that line on main, with history untouched.
  (c) LICENSES/README.md line 67, pre-existing: generic Program Files and Program Files (x86) folder paths.
  (d) Five non-paths: JSON newline escapes after a colon (four), and a Python %s% format (one).
  (e) History: commit 488b641's site/data/health.json names this branch's worktree folder under C:\dev\wt (no user name). The head no longer has it; the push would publish it in history. Removing it would mean a history rewrite, which is itself a red line.
  (1) Accept (a), (c), (d), (e); (b) is reworded on main by a separate docs piece before the corpus merges (Recommended).
  (2) Accept all five, including (b) as it stands; the corpus merge does not wait.
  (3) Hold.

---

3. #12's set and attribution (your D3 position). The source names every licence per contributor: the theme ODbL; OpenStreetMap and Global ML Building Footprints ODbL; Esri, Google Open Buildings, Qian Shi et al. and BTN 2024 CC BY 4.0; USGS 3DEP names no licence. The row lists each contributor with its licence (names, without the source's links).
  (1) #12 stays local-only, fetch-only, never redistributed; attribution as contributor and licence names (Recommended: the USGS entry names no licence, so the file's licence is not fully identified).
  (2) #12 moves to the reproducible set by fetch; attribution as names.
  (3) As (1), and the attribution also carries the source's links.

---

4. A gate ruling: check C13 on a merge commit. C13 proves that a commit touching the six bookkeeping files is bookkeeping only. As written, it compares a commit with its first parent. For the merge of main into the branch (0fcf006) that comparison fails by construction on main's own changes, and one sub-check says nothing. Read against the main parent instead (the architect's merge reading), all four sub-checks pass; 488b641 passes as written.
  (1) Adopt the merge reading for merge commits (Recommended).
  (2) Hold; C13 as written stands and 0fcf006 is disclosed as failing it.

---

5. The equal rows' procedure cell. The seven regenerated files read "yes (versions observed: Regeneration run)": the versions are those observed today to write sha-equal bytes, not the unknown versions of the 2026-09-10 run. Byte-reproducibility is still disclaimed.
  (1) Keep "yes (versions observed: Regeneration run)" (Recommended).
  (2) Leave "no" in those cells, with the run recorded beside them.

---

6. The lease rule (from the Stop-hook piece, PR #131). The hook blocks only when the lease id equals Claude Code's session id; the custodian writes $CLAUDE_CODE_SESSION_ID. AI_DEVELOPMENT.md's rule asks only for "a unique session id", so a custodian writing any other id would have every stop silently allowed.
  (1) Add one line to the lease rule: the lease id is $CLAUDE_CODE_SESSION_ID, the value the hooks receive as session_id (Recommended).
  (2) Leave it for the 2026-10-02 weekly window.
