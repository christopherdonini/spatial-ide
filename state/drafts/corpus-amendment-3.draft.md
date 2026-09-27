*Custodian's note (2026-09-26): the architect consult's draft of Amendment 3 to engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md for PLAN node `corpus-reproducibility-record` (gate 1's results; RULED 2026-09-26 — question round 27, items 1 to 4; the record-cap reduction of gate 1's low findings), saved as returned, transcribed from the hand-back message with the harness's two-space indent removed. The custodian appends the fenced block after Amendment 2 on cut/corpus-reproducibility-record and dispatches a worker for its items 3.2 and 6.1-6.4. Everything below the rule is the agent's text.*

---

**Verdict: pass with notes.** The draft is below. None of the round-27 rulings changes a registered claim, so nothing has to go back to the human as a blocker. Three readings do need to reach the human before the push; they are the first three items of "See first".

I have no Bash, so I computed no hashes and ran no checks. I read the source for #12's entries 6–7 in `C:\dev\corpus-regen\evidence\overture_refetch.mdx`, the buildings section.

## Amendment 3 (append after Amendment 2)

```markdown
### Amendment 3 — post-result: written after gate 1's results (branch head `0fcf006`) were seen

It records gate 1's results (class 1) and RULED 2026-09-26 — question round 27, items 1 to 4 (class 5, the nearest, as in Amendment 1, item 1), and names the changes a third apply round makes. It is the architect's reduction under the record cap (`state/directives/2026-09-18-record-cap.md`, item (3)): this piece's two record rounds are spent, the text below is applied as written, and no record round follows. It invalidates no commit and edits no registered text. Evidence, by finding: `state/consults/2026-09-26-corpus-record-gate1-architect.md` ("the architect report") and `state/consults/2026-09-26-corpus-record-gate1-reviewer.md` ("the reviewer report"). The questions as put: `state/questions/round-27.md`, by item. Superseded index: item 8.

**1. Results (class 1).**

- **1.1** C13 at `0fcf006` passes under the merge reading that round 27, item 4 adopts; `488b641` passes as written (the reviewer report, finding 2; the architect report, E1). C5 by the letter lists no path for a merge; the merge's blobs were checked separately (the reviewer report, finding 2).
- **1.2** P-a: 140 hits, all in `site/index.html` (the reviewer report, finding 1). Every earlier P-a count of 0 came from a command that aborted and printed nothing (3.2). P-6 stays as registered and not met (Amendment 1, item 2.3).
- **1.3** E2: the Regeneration run's window and each script's single execution are supported by the scratch files' times, with the residual stated there; exit 0 is inferred, not recorded (the reviewer report, finding 3).
- **1.4** The reviewer report's findings 4–6 and the architect report's D-a to D-e are disposed in item 5.

**2. Round 27, item 1 (class 5).**

- **2.1 {Q}:** the phrase that round 27, item 1 places in double quotes after `read`. It is extracted by script from `git show ae92f10:DECISIONS-PENDING.md` (the commit that adds the round-27 RULED block): from the one line containing the substring `the five mutations read "`, take the span from the end of that substring up to the next `"`. It is never retyped and is not reproduced here (round 12, the rider on (b)). STOP unless `ae92f10` is an ancestor of `origin/main`, exactly one line matches, and the span is non-empty and holds no `|`.
- **2.2 Cells.** In `RECORD.md`, the procedure-recorded cells of #7, #8, #9, #10, M-2, M-3, M-4, M-1c and M-1a-equivalent read {Q} (6.1(a)). #1–#6 and R-1 keep `yes (versions observed: Regeneration run)`, which settles Amendment 2, item 2.4's reading. #11 and R-2–R-4 keep `yes`, and #12 keeps `no`: the ruling names neither. `LICENCES.md` has no procedure-recorded cell; its one line describing a mark is replaced (6.2(c)).
- **2.3 Reconciliation.**
  - §1 is not edited. {Q} is not "yes", so the nine rows make no "yes" claim, and block-on-sight 8's first clause does not reach them. Their why cells are unchanged. Nothing widens.
  - §2a's yes / no column carries a third value in nine rows by ruling, as Amendment 2, item 2.4 carried a qualified yes.
  - §3's cells for those rows, and P-5, stand as registered. They held at `ae0220b` (Amendment 1, item 2.5). The table departs from them by ruling, not as a prediction result, as Amendment 1, item 1.3 did for P-9.

**3. Round 27, item 2 (class 5).**

- **3.1 Accepted hits and readings.** Hits (a) to (e), as put in `state/questions/round-27.md`, item 2, are accepted, and block-on-sight 7 is disposed for them. Amendment 2, item 3.2's wait on a separate node is withdrawn: no node is filed, `kernel/FIXTURES.md` is untouched and the merge does not wait. Rider (e) of round 26, item 1 reads as clarified: a path naming a user profile is refused, and the public folder under the Windows Users root and every path outside that root are permitted. From now on:
  - **§7's `PERMITTED_PATH_PREFIXES`:** not edited. Its "until the human rules" is met by this item for any path outside the Windows Users root and for the public folder.
  - **C6's pass condition reads:**
    - P-a: every hit lies in the owner segment of the repository's own `github.com/<owner>/spatial-ide` URLs (hit (a)), with a residual of 0 by 3.2, step 7.
    - P-b: every hit names the public folder under the Windows Users root.
    - P-c and P-d: 0.
    - P-e: every hit falls under §7's list, is a path outside the Windows Users root or the public folder under it, or is one of the five non-paths in `of-record/MANIFEST.json` (2), `of-record/PROBE.json` (2) and `of-record/scripts/build_manifest.py` (1). Those five are fixed by C1's byte identity.
    - Any other hit is STOP and goes to the human.
  - **C8:** its commands and expected output are unchanged (Amendment 1, item 1.2). A match whose folder after the Users root is the public folder is permitted and listed; any other match fails. Main's `kernel/FIXTURES.md` line is outside C8 (the same item) and is accepted as hit (b).
  - This preregistration's own `C:\dev\` paths, which C6 excludes, lie outside the Users root (the architect report, human list item 7).
- **3.2 The scan correction, (i) and (ii), binding on C6 and C8 from now on.** It extends Amendment 1, item 2.4's pattern files.
  - Tool fact: GNU grep 3.0 (Git Bash, this machine) aborts with exit 134 when `-i` and `-F` are combined. `git grep -iF`, `grep -i` and `grep -iE` did not abort in the custodian's run after gate 1. Only the canary proves a tool at run time. Git's version goes into the hand-back (6.4).
  1. **Scratch.** Use `C:\dev\corpus-scan`, outside the repository; STOP if it exists. Everything below is written there by a script file, never typed inline (Amendment 1, item 2.4).
  2. **Pattern files**, one pattern per line, LF:
     - `pa-user.txt` and `pa-host.txt`, from `$USERNAME` and `$COMPUTERNAME`, never printed;
     - `pb.txt` to `pe.txt`, each copied by script from the single-quoted span of §4's P-b to P-e bullet;
     - `c8.txt`, copied by script from the single-quoted pattern in Amendment 1, item 1.2's commands.

     STOP if any file is empty or holds an empty line.
  3. **Paths.** `paths.txt` holds C5's path set (4.2 for a merge), minus this preregistration.
  4. **Canary first.**
     - Build `canary.txt` by script from separate parts, so that no tracked line and no pattern file holds a canary string. It holds: each P-a value with the case of its letters inverted; one line each that P-b, P-c, P-d and P-e match; and one line per alternative of C8's pattern.
     - Run step 5's commands on it with `git grep --no-index` from the scratch directory, and run C8 command 1's last stage on it.
     - Each class must exit 0 and list its own canary line, and step 7's script must print at least 1 on it. Otherwise STOP.
  5. **Run at HEAD**, from the worktree root, one class at a time:
     - P-a, per value: `git grep -I -i -F -c -f <file> HEAD -- <paths>` for lines per file; the same with `-o` in place of `-c`, into a scratch file, for instances.
     - P-b to P-e: `git grep -n -I -i -E -f <pX.txt> HEAD -- <paths>`.
     - C8 command 2: `git grep -n -I -i -E -f c8.txt HEAD -- engine/compat-corpus/`.
     - C8 command 1, one stage per command, each writing a file: `git diff origin/main...HEAD -U0`; `grep '^[+]'`; `grep -v '^[+][+][+]'`; `grep -c -i -E -f c8.txt`.
     - Paths are passed as a Bash array, never through `xargs`, and no stage is piped.
  6. **Status.**
     - Exit 0 with output means found. Exit 1 with no output means none; a `grep -c` stage prints `0` and exits 1.
     - Anything else (another exit code, exit 0 without output, or any stderr) prints `SCAN ERROR <class> rc=<n>` and is STOP.
  7. **P-a residual** (hit (a)).
     - A node script reads each value from its file, and each file with a P-a hit through `git show HEAD:<path>`.
     - It replaces the owner segment of every case-insensitive `github.com/<owner>/spatial-ide` with a fixed token, then prints only the count of case-insensitive occurrences of the value that remain.
     - It exits non-zero on any error, which is STOP. Pass: 0 for every file.
  8. **Close.** Delete the scratch directory. Record the counts per class and per file, and the canary result per class.
- **3.3 (iii), owed before the push.**
  - A separate read-only worker lists every earlier exposure check that used the broken command, entry 49's audit included if it did, and re-runs each by 3.2.
  - Its report is filed at `state/consults/2026-09-26-exposure-checks-rerun.md`, with counts and classes only (no P-a value, and no path under the Windows Users root), and goes to the human before the push (item 7).
  - This amendment records only that the report is owed.

**4. Round 27, items 3 and 4 (class 5).**

- **4.1 Item 3.** `LICENCES.md` already reads as ruled: #12 is local-only, fetch-only and never redistributed, and its attribution is contributor and licence names (the reviewer report, C12 and C14). No change.
- **4.2 Item 4.** For a merge commit, C13 compares against the main parent:
  - (i) `git diff --name-status <main parent> <merge>`;
  - (ii) the same diff of `PLAN.yaml`;
  - (iii) as written;
  - (iv) `site/data/health.json` byte-equal to the main parent's (the architect report, E1).

  For a non-merge commit, (iv)'s key paths are object-key paths, the reading under which `488b641` passed (the reviewer report, finding 2). The architect's gate reading, not the ruling: C5 and C6 take a merge's paths from the same main-parent diff.

**5. Low findings, reduced.**

- **5.1** O4's retrieved time becomes the write time of both fetch files (the reviewer report, finding 4); see 6.2(a).
- **5.2** #12's cell gives each source entry as its text with every Markdown link reduced to its link text, entries 6 and 7 as well as 1 to 5. Round 27, item 3 rules names without links. Amendment 2, item 4.2(d)'s "byte-copied" reads, for this cell, as exactly that reduction. The cell is not presented as a quotation (the reviewer report, finding 5; the architect report, C1, item 12). No change.
- **5.3** The two sentences describing a mark no cell carries are replaced (6.1(c), 6.2(c)). This also settles D-d.
- **5.4** The run's exit codes are recorded as not captured (6.1(b)).
- **5.5** O1 is noted as no row's pin (6.2(b)).
- **5.6** D-e is outside this piece. It is a ledger finding and a proposal for the weekly window of 2026-10-02 (the record cap, item (2)). D-a is settled by round 27.

**6. The apply round.** A worker applies 3.2 and exactly 6.1–6.3, with one signed-off commit per file, not pushed.
- Only `RECORD.md` and `LICENCES.md` change. `of-record/**`, `.gitattributes`, `kernel/FIXTURES.md` and `LICENSES/README.md` are not touched.
- Every inserted string is extracted by script from this item's blockquotes or from {Q}'s source, never retyped. Each replacement asserts exactly one occurrence of its target.

- **6.1 `RECORD.md`:**
  - (a) In rows #7, #8, #9, #10, M-2, M-3, M-4, M-1c and M-1a-equivalent, replace the procedure-recorded cell (the eighth) with {Q}. STOP unless each cell reads `yes, given #N` beforehand, N being its input.
  - (b) At the end of the line beginning `- **Run:**`, append one space and:
    > Exit codes: not captured.
  - (c) Replace the line beginning `- **The mark**` with:
    > - **Not re-run:** #7–#10, M-2, M-3, M-4, M-1c and M-1a-equivalent were not executed in this run. Their procedure-recorded cells carry the human's phrase for that, byte-copied by script from RULED 2026-09-26 — question round 27, item 1.
- **6.2 `LICENCES.md`:**
  - (a) In O4, replace `retrieved 2026-09-26T19:47:35Z` with `retrieved 2026-09-26T19:47:24Z`. STOP unless both fetch files under Amendment 2's scratch directory, `evidence/spdx/`, have a UTC mtime in the second 2026-09-26T19:47:24Z.
  - (b) Replace the line `- **O1. OSI approved-licence list.**` with:
    > - **O1. OSI approved-licence list.** No row's pin; superseded by O4.
  - (c) Replace the line beginning `By regeneration means` with:
    > By regeneration means the procedure `RECORD.md` records for each entry, as its procedure-recorded column states.
  - (d) Nothing else changes. The sighting line stays last and blank.
- **6.3 Checks at the new head,** handed back as counts:
  - C1, C4 (a) and (b), C5 (with 4.2's merge paths), C7, and §7's ceilings;
  - C6 and C8, by 3.2;
  - **C15** (`git diff` of each file):
    - `RECORD.md`: only the nine cells of 6.1(a) and the two lines of 6.1(b)–(c) change. The procedure-recorded column over the 21 rows reads {Q} ×9 (#7–#10 and the M rows), `yes (versions observed: Regeneration run)` ×7 (#1–#6, R-1), `yes` ×4 (#11, R-2–R-4) and `no` ×1 (#12).
    - {Q} occurs 9 times in `RECORD.md` and 0 times in `LICENCES.md`.
    - `LICENCES.md`: only the three lines of 6.2 change, and #12's row is unchanged.
  - **Resolution step** (round 15, (a)): resolve every changed cell and line against this amendment, {Q}'s extraction and the fetch files' times. STOP on a mismatch.
- **6.4 Hand-back.** It contains:
  - the commits;
  - {Q}'s extraction: the matching line count, the span's length in bytes and the span's sha256;
  - `git --version` and the first line of `grep --version`;
  - the canary result per class;
  - each check, as counts;
  - C6's hit list: P-a as counts per file only; P-b and P-e by file:line and 3.1's class, with no line text;
  - any STOP.

  No P-a value and no path under the Windows Users root is printed. Budget: 45 minutes; at the budget the worker hands back from where it stands.

**7. The custodian, before the push.**
- Before this amendment is committed: file both gate-1 reports on main at the paths named in the header.
- Put 3.3's report to the human. If it lists a hit outside round 27, item 2's accepted hits, the push waits for the human's word.
- Fill the sighting line, in one commit touching `LICENCES.md` only: `Sighted by the human: RULED 2026-09-26 — question round 27, items 1, 2 and 3.`
- Every commit that touches the six paths passes C13 (4.2).
- Take a scoped gate read (reviewer) of item 6 and the sighting commit: C15, C1, C4, C5 and C7, with C6 and C8 re-run independently by 3.2, and P-a also by a node fixed-string matcher. An application mismatch is corrected to this amendment's text; it is not a record round.
- Keep `C:\dev\corpus-regen` until the scoped read is done, then delete it.
- Push. Run C8 at the pushed head by 3.2, and carry the commands, the canary result and the output in the PR body.
- The merge is by merge commit, the human's click (round 26, item 3).

**8. Superseded index.**
- Amendment 1, item 2.3, and Amendment 2, item 1: P-a's count of 0 (1.2).
- Amendment 1, item 2.4: extended by 3.2, not replaced.
- Amendment 2, item 2.4: the reading it left open, settled (2.2).
- Amendment 2, item 3.2: the merge's wait on a separate node, and C6 failing on `kernel/FIXTURES.md`'s line (3.1).
- Amendment 2, item 4.1(e)'s bullet "The mark" and item 4.2(f)'s line (6.1(c), 6.2(c)).
- Amendment 2, item 4.2(d): "byte-copied", for #12's cell (5.2).
- Amendment 2, item 5: disposed by round 27, items 1 to 4.
- Amendment 2, the custodian's note on deleting `C:\dev\corpus-regen`: deferred (item 7).
```

## What the worker applies
Amendment 3, items 3.2 and 6.1–6.4, exactly as written, in the worktree `C:\dev\wt\corpus-record`. Only `engine/compat-corpus/RECORD.md` and `engine/compat-corpus/LICENCES.md` change. The C6 and C8 run uses the canary and exit-status procedure in 3.2. The hand-back contents are listed in 6.4.

## What the custodian does
1. Files `C:\dev\wt\corpus-gate-reports\2026-09-26-corpus-record-gate1-{architect,reviewer}.md` on main as `state/consults/2026-09-26-corpus-record-gate1-{architect,reviewer}.md`. This has to happen before Amendment 3 is committed, so that the header references resolve to tracked files.
2. Confirms that `ae92f10` is on `origin/main`; otherwise the worker STOPs at 2.1.
3. Commits the draft unchanged and appends it on the local branch.
4. Dispatches the read-only exposure re-run worker (3.3) and the apply-round worker.
5. Carries out Amendment 3, item 7, in order: the report to the human, the sighting line, C13 on any commit touching the six paths, the scoped reviewer read, deleting the scratch directory, the push, C8 in the PR body, and the merge by merge commit.
6. Files D-e as a ledger finding and as a proposal for the 2026-10-02 window.

## See first
1. **Item 1 reading: #11 and R-2–R-4 keep a plain `yes`.** The human wrote "Only the seven files regenerated byte-for-byte today say 'yes (versions observed: Regeneration run)'". I read that as limiting that particular qualified string, not every "yes": the condition names only #7–#10 and the mutations. This is a red-line item, so the report before the push should state the reading in one line.
2. **The #12 fix conflicts with item 3.** Question 1 told the human the gates' fixes included "#12's last two source entries byte-copied with their link syntax", and item 1 sighted that list. Item 3 then ruled "names only". Byte-copying with link syntax would add URLs to entries 6–7, visible in the source file, while 1–5 carry none. I gave item 3 precedence and reduced the fix to a disclosure (5.2), so the cell does not change. The report before the push must say this, because it is a sighted fix that is not being applied as described.
3. **P-a acceptance is defined by class, not by file.** A hit anywhere inside the owner segment of the repository's own GitHub URL passes, as long as the residual is 0. If the regeneration before the push places such URLs in a file other than `site/index.html`, the worker lists it and the report should name it. The narrower alternative, `site/index.html` only, would STOP on that same class of hit.
4. **Keep `C:\dev\corpus-regen`.** 6.2(a) reads the mtimes of its fetch files, which reverses Amendment 2's instruction to delete it after the reviewer's gate.
5. **The PR diff must not match C8.** C8 command 1 scans every added line in the PR, including this preregistration. I kept Amendment 3 free of any drive-colon-then-Users sequence, and 3.2 has the canary strings built at run time rather than written anywhere. Any hand edit or wrapper text must keep that property.
6. **The report path does not exist yet.** `state/consults/2026-09-26-exposure-checks-rerun.md` is named before the file is written. Check that `verify-cites` (C7) ignores bare paths with no line number, or file the report first.
7. **Not carried, under the record cap:**
   - the reviewer's nit on the P-e count (54 vs 55) in the apply-round-2 report;
   - the architect report's human-list item 6, the placement of rider (d). Round 27 did not ask it. Add one line to the report before the push, or treat it as settled by Amendment 1, item 1.1(d).

Paths: `C:/dev/wt/corpus-record/engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md`, `C:/dev/wt/corpus-record/engine/compat-corpus/RECORD.md`, `C:/dev/wt/corpus-record/engine/compat-corpus/LICENCES.md`, `C:/dev/wt/corpus-gate-reports/`, `C:/dev/corpus-regen/evidence/`
