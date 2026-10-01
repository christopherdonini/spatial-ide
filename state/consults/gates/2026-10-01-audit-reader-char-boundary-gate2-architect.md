*Custodian's filing note (2026-10-01): the architect's gate 2 on PR #152, scoped to correction round 1, for PLAN node `audit-reader-char-boundary` at g1. Reviewed: cut/audit-reader-char-boundary @ ad728d94b3d929f05acb5f08fb76c667c0ab170d (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message (enqueued 12:27:54Z) with the harness's two-space indent removed, and the text below the rule is the agent's. Its branch-only `path:line` cites are read at ad728d9. B1 is discharged; no amendment or superseded index is owed, because the test now matches §3 as written. N2 (the observation commits) goes to the closing record by reference. Profile paths redacted at filing: none.*

---

Reviewed: cut/audit-reader-char-boundary @ ad728d94b3d929f05acb5f08fb76c667c0ab170d

**Verdict: pass with notes.** B1 is cleared and no blocker remains. §8 item 16 (the merge must be a merge commit) is still pending.

I confirmed the branch ref as ad728d9 from `.git/refs/heads/cut/audit-reader-char-boundary`. I have no Bash, so I read the files at the worktree head and ran no git command, `od` or hash. The byte-level facts below rest on the custodian's `od -c` and diff checks, recorded in the filing note of worker report 2.

**1. B1: PASS.**
- `reader.rs:464` reads `let at = r"2026-08-17T08:4\u00e9";`. Inside the raw string these are six literal characters, so the JSON that `format!` builds carries the escape. serde decodes it, which samples S5's escape-decode path.
- `stored` (`:465`) and every assertion (`:473-484`) are unchanged.
- §3 S5 now holds as written.

**2. T2's doc: PASS.**
- `:454-456` records M2 at efe19e6, by name and with the commit, as §4 requires.
- `:458-461` records M1 on the new text at efe19e6.
- efe19e6 is the right commit to name: ad728d9 changes only the doc, so the test code it describes is the same.
- The doc says nothing about `verify-mutation` and contains no rooted cite. Commit ids that name an observation are not hash pins, so §8 item 15 is not engaged.

**3. Diff and gate-1 standing: PASS.**
- The reader.rs count moved from 73/21 to 78/21. That +5 equals the M1 paragraph plus its `///` separator, and T2 shifted from line 459 to 464. This is consistent with the custodian's `git diff 1b112b1..ad728d9`.
- §7 is 117 of 175 over 2 files, with no overrun.
- Every other part of the gate-1 verdict stands unchanged (items 1–3, 5, and §8 items 1–15). Gate-1 N1–N3 also stand.

**4. Record: PASS. No row is owed now.**
- §10 is empty. This round changed test code to match §3 as written, so there is no amendment for a superseded index to close. An index with nothing in it is not owed under §10's heading rule.
- The reviewer gate-1 filing note already says its M2 row at 1b112b1 is re-observed on the corrected T2.

**Blocking**
None.

**Non-blocking**

N1. T2's doc records M2 twice: the `:454-456` paragraph, and again as "so does M2 on this text" at `:460`. The duplicate is redundant and harmless. Do not edit it in this round.

N2. Any closing record should name the observation commits as references only:
- T1 and T3: 256154c, plus the reviewer's table at 1b112b1;
- T2: efe19e6.

It should state no prose claim of its own, under the record cap.

N3. §8 item 16: the merge must be a merge commit, so that 256154c, 2a96670 and efe19e6 stay reachable from main.

N4. Reviewer gate 2 should re-observe M2 and M1 on T2 at ad728d9 itself, and run `verify-mutation` with the tool's commit (it does not count as an observation). It should also read branch CI, which the worker saw as pending.

Paths:
- C:/dev/wt/audit-reader-char-boundary/kernel/src/permission/audit/reader.rs
- C:/dev/wt/audit-reader-char-boundary/kernel/AUDIT-READER-CHAR-BOUNDARY-PREREGISTRATION.md
- C:/dev/spatial-ide/state/consults/2026-10-01-audit-reader-char-boundary-worker-report-2.md
