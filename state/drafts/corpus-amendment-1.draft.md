*Custodian's note (2026-09-26, after the handover flush at 524ead5; untracked, not committed, because the lease was already relinquished): the architect consult's draft of Amendment 1 to engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md for PLAN node `corpus-reproducibility-record`, saved as returned (extracted by script from the agent's hand-back; byte-identical). The incoming custodian commits it (state/drafts/ is exempt from verify-cites) and follows its section 3 and its list of what a worker applies. Everything below the rule is the agent's text.*

---

Amendment 1 is ready to append. The SPDX exemption list goes in a new section appended to `LICENSES/README.md`, and that home needs no new decision from the human. Five items still need the human's ruling (item 4 of the amendment), including one gap in the round 26, item 2 ruling that I applied as ruled but flagged.

Three things the drafting turned up that you should see first:

- **SPDX home (rider (d)).** `LICENSES/README.md` ends with its EPSG acknowledgement section, so appending a section after it edits nothing landed. The documentary audit points to that file: `PRE-PUBLIC-CHECKLIST.md` §1 names it as the record of each part's layer, and §1's counted extensions (`.rs` `.ts` `.mjs` `.html` `.css` `.ps1`) do not include `.py` at all. I rejected `PRE-PUBLIC-CHECKLIST.md` (a completed 2026-08 pass) and `CONTRIBUTING.md` (the list would sit far from its rule). The list names the nine paths one by one, with no pattern.
- **Item 2's stated reason doesn't hold for all 16 files.** The ruling says the tracked scripts, commands and pinned tool versions reproduce them. The build's own `RECORD.md` marks #1–#6 and R-1 "procedure recorded: no" (pandas, numpy and the DuckDB spatial extension versions are unrecorded). #7–#10 and the mutations take #1, #3 or #7 as input, and those bytes are not distributed. The amendment applies the ruling as ruled and makes the gap visible in `LICENCES.md`; D4 puts it to the human.
- **One permitted prefix was never put to the human.** The literal `%USERPROFILE%` token is on §7's permitted list, but it was not among reading (e)'s prefixes in the round 26 question. I added it to D2.

---

### Amendment text (append after the `*(none)*` line of §10; do not remove that line)

```markdown
### Amendment 1 — post-result: written after the build's results (branch head `ae0220b`) were seen

It records round 26's rulings and the build's results, and names the changes an apply round makes. It invalidates no commit of the build; §3's #12 cell, P-5 and P-6 stand as registered and are recorded as not met. Class per item: the rulings take class 5, the nearest class (a ruling changes what the piece does), because class 9 does not exist until PR #129 merges. Evidence: `state/consults/2026-09-26-corpus-record-worker-report.md` (on main), by its section numbers.

**1. Rulings (class 5, nearest).**

- **1.1** Round 26, item 1 adopts readings (a)–(g) as put in `state/questions/round-26.md`, item 1. §2's reading of "data", and §9's human-sight item for it, are thereby ruled.
- **1.1(d)** Rider (d) (paraphrase: the script copies are exempted from the SPDX check by an explicit path list, never a pattern, and `RECORD.md` names their licence) adds one path to Scope: `LICENSES/README.md`, one section appended after its last line (text in 3.3).
  - Why there: no automated SPDX check exists. The header audit is documentary. `PRE-PUBLIC-CHECKLIST.md` §1 is a completed pass whose counted extensions do not include `.py`, and it names `LICENSES/README.md` as the current-state record of each part's layer.
  - Appending after that file's last line edits no landed text.
  - C5 (i) and (v) now include this path, as a consequence of Scope, not a change to the check.
- **1.2** Rider (e) (paraphrase: no path under the Windows Users folder appears in a public copy, asserted by a grep in the PR; entry 49, F-1/F-2) adds check C8. The custodian runs it at the pushed head and carries both commands and their output in the PR body:

      git diff origin/main...HEAD -U0 | grep '^[+]' | grep -v '^[+][+][+]' | grep -ciE '[a-z]:[^a-z0-9]+users[^a-z0-9]|/[a-z]/users/'
      git grep -niE '[a-z]:[^a-z0-9]+users[^a-z0-9]|/[a-z]/users/' HEAD -- engine/compat-corpus/

  - Expected: the first command prints `0`; the second prints nothing.
  - The patterns hold no backslash, so 2.4 does not affect them.
  - C8 covers every line the PR adds and every copy in full. Main's existing lines are outside it (4, D2).
- **1.3** Round 26, item 2: the 16 project-generated rows (#1–#10, M-2, M-3, M-4, M-1c, M-1a-equivalent, R-1) stay undeclared and enter the reproducible set by regeneration. Their bytes are not distributed.
  - §2b's set rule and block-on-sight 6 now govern the third-party rows only (#11, #12, R-2–R-4).
  - The sets become: reproducible 17 (#11 by fetch, the 16 by regeneration); local-only 4 (#12, R-2, R-3, R-4).
  - P-9 is not edited. It held at `ae0220b` (reproducible 1, local-only 20; report §4). The table now departs from it by ruling, not as a prediction result.
- **1.4** Round 26, item 3: records cite this piece's commits, so its PR merges by merge commit only.

**2. Results.**

- **2.1 (class 1)** C1–C4 and C7 pass. P-1 to P-4, P-7 and P-8 hold. No STOP. The corpus of record is unchanged (report §2, §4, §7).
- **2.2 (class 1)** C5 fails on (i) by the letter. `488b641`, the form's commit, carries six paths outside §2's Scope: `PLAN.yaml`, `CUSTODIAN-QUEUE.json`, `CUSTODIAN-QUEUE.md`, `site/data/health.json`, `site/data/plan.json` and `site/index.html`.
  - The build's five commits carry 17 paths, all in Scope, and (ii)–(v) pass (report §2).
  - Cause: §2 did not list the node bookkeeping that the form's commit carries.
  - Block-on-sight 2 holds by the letter. Its disposition is a gate ruling, which is the human's (4, D1).
- **2.3 (class 2, P-6 not met)** C6 fails by the letter: 1 P-b hit and 10 P-e hits outside `PERMITTED_PATH_PREFIXES`. Over the 13 copies alone, P-a to P-d give 0 (report §3). By kind:
  - five non-paths: four JSON `\n` escapes after a colon (`of-record/MANIFEST.json`, `of-record/PROBE.json`) and one Python `%s%` format (`of-record/scripts/build_manifest.py`);
  - three in main's existing second-copy table of `kernel/FIXTURES.md`: one `D:` path, and a shared-folder path under the Windows Users folder counted twice (also the P-b hit). None is in an added line;
  - two in `site/data/health.json` at `488b641`: the worktree path, from that commit's regeneration.

  Block-on-sight 7 routes each hit to the human (4, D2).
- **2.4 (class 1)** Typed inline into the Bash tool, the §4 patterns lose backslashes and silently stop matching (report §3). The patterns are unchanged. The gates copy P-b to P-e out of §4's bullets into pattern files, self-test each against a positive sample, and run `grep -f`.
- **2.5 (class 2)** #12's procedure recorded is **no**, where §3 predicted yes. Its input is a release name and a bbox, which is neither a hash-pinned file nor a commit-pinned URL; §3's cell contradicted §1. P-5 fails on #12 only.
- **2.6 (class 2)** R-2–R-4 have no `how_obtained` field in `retired[]`. `RECORD.md` cites the commit-pinned URL in `retired[n].reason`, following the manifest as it is rather than the field name §2a assumed.
- **2.7 (class 1)** Licences (report §5):
  - #11 is Apache-2.0 at the pinned commit. It counts as open by the OSI list page only; that page is not byte-stable, and OSI's API returns `approved: false` for it (disclosed in `LICENCES.md`).
  - #12 names more than one licence, so it is local-only pending the human.
  - R-2–R-4 are unidentified, so local-only.

**3. Apply round.** `RECORD.md` and `LICENCES.md` are current-state summaries and are revised. `of-record/**`, `.gitattributes` and `kernel/FIXTURES.md` are not touched. A worker applies exactly 3.1–3.4, one signed-off commit per file, not pushed.

- **3.1 `LICENCES.md`:**
  - (a) In the Rules block, replace the bullet that begins "A row is `reproducible` only when" with:
    > - A third-party row (#11, #12, R-2–R-4) is `reproducible` only when its licence is both identified and open, and `local-only` otherwise. A project-generated row is `reproducible — by regeneration`, its licence undeclared and no data file distributed (round 26, item 2).
  - (b) In the 16 project-generated rows, set the licence cell to `undeclared — project-generated (round 26, item 2)` and the set cell to `reproducible — by regeneration`. No other cell changes.
  - (c) Set #11's set cell to `reproducible — by fetch`.
  - (d) Replace the two list sections with `## Reproducible set (17)` and `## Local-only set (4)`:
    - the first lists #11's path suffixed ` — by fetch`, then the 16 paths suffixed ` — by regeneration`, in table order, followed by this one line:
      > By regeneration means the procedure `RECORD.md` records; for #1–#6 and R-1 it lacks versions (procedure recorded: no), and the others take #1, #3 or #7 as input.
    - the second lists the paths of #12, R-2, R-3 and R-4.
  - (e) The sighting line stays last and blank.
  - (f) At most `LICENCES_MAX_LINES`.
- **3.2 `RECORD.md`:** replace the Header bullet that begins "**Licence of the copies:**" with:
  > - **Licence of the copies:** they are project-authored, written for this project on 2026-09-10, and licensed `AGPL-3.0-or-later`, the core layer (`LICENSES/README.md`, its layers table). They carry no SPDX header, because one would break byte identity; the nine scripts are exempt by explicit path in `LICENSES/README.md`, section "Byte-identical copies without an SPDX header" (round 26, item 1, rider (d)).
- **3.3 `LICENSES/README.md`:** append after the last line one blank line, then this section:
  > ## Byte-identical copies without an SPDX header
  >
  > *Appended 2026-09-26 by `corpus-reproducibility-record` (round 26, item 1, rider (d)).* The files below are exempt from the SPDX-header requirement (`CONTRIBUTING.md`; `PRE-PUBLIC-CHECKLIST.md` §1's header audit) by explicit path, never by pattern. Each is a byte-identical copy of a project-authored script, pinned by sha256 in `engine/compat-corpus/RECORD.md`, and a header would break that identity. They are in the core layer, `AGPL-3.0-or-later`, like the rest of `engine/`.
  >
  > - `engine/compat-corpus/of-record/scripts/build_manifest.py`
  > - `engine/compat-corpus/of-record/scripts/gen_duckdb.py`
  > - `engine/compat-corpus/of-record/scripts/gen_gdal.py`
  > - `engine/compat-corpus/of-record/scripts/gen_geopandas.py`
  > - `engine/compat-corpus/of-record/scripts/gen_mutations.py`
  > - `engine/compat-corpus/of-record/scripts/gen_qgis.py`
  > - `engine/compat-corpus/of-record/scripts/observe.py`
  > - `engine/compat-corpus/of-record/scripts/probe_producers.py`
  > - `engine/compat-corpus/of-record/scripts/qgis_env.py`

  First confirm that no script or test reads `LICENSES/README.md`'s bytes or hash (`git grep -n "LICENSES/README" -- '*.ts' '*.mjs' '*.rs'`, each hit read), and report what was found.
- **3.4 Checks, re-run at the new head, with counts handed back:**
  - C1, C4 (a) and (b), and C5 with 1.1(d)'s path;
  - C6, with the patterns from pattern files (2.4), over every path C5 lists;
  - C7, and the line ceilings of §7;
  - C8 (1.2).

**The custodian, before the push:**
- Bring the branch's generated set to a state where every C6 P-e hit at the head falls under a permitted prefix. Use the generated-files directive of 2026-09-19, regenerating from a checkout under a permitted prefix.
- `488b641`'s blob stays in history under 1.4 (4, D2).
- Run C8 and carry its output in the PR body.
- Put `LICENCES.md`, C6's hit list and item 4 to the human. The PR merges by merge commit.

**4. To the human, at the PR (gate rulings and red lines).**

- **D1.** Block-on-sight 2, by the letter (2.2). Either accept the six bookkeeping paths as a recorded deviation, or rewrite `488b641` (the branch is unpushed). Recommended: accept. A rewrite would leave the report on main citing commits no merge brings in, against round 26, item 3's intent.
- **D2.** Block-on-sight 7, over each hit in 2.3:
  - the five non-paths;
  - main's `kernel/FIXTURES.md` line, and whether rider (e) reaches it. It is outside this Scope; if it does, a separate piece handles it;
  - the worktree path in `488b641`'s `site/data/health.json`, which stays in history;
  - the literal `%USERPROFILE%` token, which is on §7's list but was not among reading (e)'s prefixes as put.
- **D3.** #12's set: its source names several licences (2.7).
- **D4.** Round 26, item 2's premise (1.3). For none of the 16 does the tracked tree pin every writing version end to end: #1–#6 and R-1 lack versions, and the others take those files' undistributed bytes as input. It is applied as ruled; confirm or narrow.
- **D5.** #11's open status rests on a list page that is not byte-stable, and OSI's API contradicts it (2.7).
```

---

### What the worker applies (after the custodian commits the amendment)

1. **`engine/compat-corpus/LICENCES.md`**, per 3.1 (a)–(f): the Rules bullet, the 16 licence and set cells, #11's set cell, the two lists re-split 17 / 4 with the one-line note, and the sighting line last and blank. This takes it from 95 to about 96 lines, under the 100 ceiling.
2. **`engine/compat-corpus/RECORD.md`**, per 3.2: the one Header bullet replaced.
3. **`LICENSES/README.md`**, per 3.3: the pre-check (`git grep`, each hit read), then the section appended after the last line, with the nine paths written out.
4. **Checks**, per 3.4: C1, C4 (a)/(b), C5 (with `LICENSES/README.md` in (i) and (v)), C6 (patterns from files), C7, the ceilings and C8. Report counts.
5. **Commit hygiene:** one signed-off commit per file, not pushed. Nothing is touched in `of-record/**`, `.gitattributes`, `kernel/FIXTURES.md`, `tools/corpus/` or `cloud/wave1-B`, and no script is executed.

**The custodian's own steps, not the worker's:**
- Commit the amendment first.
- Before the push, remedy the generated set so `health.json` carries no worktree path at the head.
- Run C8 and put it in the PR body.
- Merge by merge commit only.
- Present `LICENCES.md`, the C6 hit list and D1–D5 to the human.

**Notes:**
- The amendment carries no hash pins and no line cites. Rulings are cited by round and item, entry 49 by its entry number, and the report by section.
- I checked the C8 patterns and the amendment text: the patterns contain no backslash, and neither the amendment nor the committed §4 bullets match them.

Files:
- `C:\dev\wt\corpus-record\engine\CORPUS-REPRODUCIBILITY-PREREGISTRATION.md`
- `C:\dev\wt\corpus-record\engine\compat-corpus\LICENCES.md`
- `C:\dev\wt\corpus-record\engine\compat-corpus\RECORD.md`
- `C:\dev\spatial-ide\LICENSES\README.md`
- `C:\dev\spatial-ide\PRE-PUBLIC-CHECKLIST.md`
- `C:\dev\spatial-ide\CONTRIBUTING.md`
- `C:\dev\spatial-ide\state\consults\2026-09-26-corpus-record-worker-report.md`
