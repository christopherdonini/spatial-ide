Reviewed: PR #240 at d0c257d9f2ef18e6b7b60228fae7eedcdfd082c0 (base ffae8c52), the scoped re-gate after correction round 1, architect — cut/adr-036-pre-acceptance-block @ d0c257d9f2ef18e6b7b60228fae7eedcdfd082c0
Verdict: PASS WITH NOTES

C-1 is closed. C3's words claim only the check made when the data is opened, which is what the human's B1 sentence allows. No other clause in the new ADR text says that containment or canonical form keeps a path inside the folder or never opens one outside it. There is one Documentation finding, on the §7 count in Amendment 2 item 2. It must be fixed before the merge.

## Correctness
None.

## Evidence
None.

## Documentation (must fix before the merge; no re-gate)

**D-1. Amendment 2 item 2's "§7's count becomes 64" is very likely wrong. The error is my role's own, from gate 1's "62 + 2 = 64".**
- **What is wrong:** §7 counts `git diff --numstat B...H` on ADR-036. C3 rewrites bytes inside head line 95, and that line is already counted in B...H as one insertion, the A4 rewrite of B's line 71. So C3 adds no line to the count. The numstat should still read 44 + 18 = 62.
- **Not run:** I have no shell. The reviewer's §7 command at d0c257d9 settles the number.
- **Why it is not Evidence:** the 64 was written before H existed, as a forecast, and no run stands behind it. Either number is under the ceiling of 90, and no ADR sentence rests on it.
- **What would make it Evidence:** if S3's closing amendment or the PR body records 64 as §7's measured count at H, that is an unsupported measurement claim.
- **Fix:** an item in S3. The form is append-only and Amendment 2 is on main. Suggested words, with the reviewer's numstat filled in:
  "Amendment 2 item 2's "§7's count becomes 64" is superseded: §7's command at d0c257d9f2ef18e6b7b60228fae7eedcdfd082c0 gives <insertions> + <deletions> = <sum>, since C3 rewrites a line that B...H already counts as one insertion. Gate 1's architect report counted that line twice."
- **Clause check:**
  - The quoted span is byte-identical to form line 522 on main (Read).
  - "already counts as one insertion": head :95 replaces B's line 71 (A4), and C3 changes only bytes inside that line (Grep, below).
  - "counted that line twice": the gate 1 architect report, §Correctness C-1, its §7 bullet "62 + 2 = 64".
  - It is two sentences and restates no earlier claim beyond naming the item it corrects.
- **Whose wording:** the gates' and the custodian's, not the human's.

## For the human
Nothing new. C3 is red-line ADR text in the architect's words (Amendment 2 item 2), and the human sees it at the click.

## What I checked, with its evidence

1. **Refs.**
   - The worktree `.git` points to `worktrees/a36`, whose HEAD is `refs/heads/cut/adr-036-pre-acceptance-block`.
   - The local ref and `refs/remotes/origin/...` both read d0c257d9f2ef18e6b7b60228fae7eedcdfd082c0.
   - The branch reflog shows three entries: created from ad921f55, then 70edd381 ("ADR-036's pre-acceptance block applied"), then d0c257d9 ("ADR-036's block, C3 (correction round 1; the form's Amendment 2)").
   - Main's reflog puts ffae8c52, the commit that adds Amendment 2, at 1792598671. C3's commit is at 1792599218. So the class 9 amendment comes before the edit it declares (round 25, item 2, the scope-addition item).

2. **C3, clause by clause.** I read head :95, :102, :103 and :104, and main's `kernel/src/dataset_ref.rs:539-552`.
   - **"Canonical form is checked on the text alone"** is unchanged. It agrees with :103 ("a reader checks on the text, before anything is resolved"). On main, `in_canonical_form` tests the string only, and its doc says "No path type is used, nothing is joined and no file is touched".
   - **"does not by itself show that a path leads inside the project folder"** claims less, not more. Canonical form refuses `..`, a leading `/`, `\` and `:`. A link or junction segment below the folder can still lead outside, and only the resolver's walk at :104 refuses links.
   - **"containment, below, checks that when the data is opened"** is backed in two places:
     - :104: "the resolver that opens the data checks before it opens it".
     - The human's B1 sentence at :104: "The check is made when the data is opened."
   - **Nothing after the open is claimed.** This agrees with the human's "not prevented, at the open or at any later read".
   - **C1 (:102):** C3 mirrors its "is checked to lead inside".
   - **Code on main:** no resolver for `project-relative` exists. A Grep of `kernel/src` for project-relative, containment, reparse, `symlink_metadata` and `canonicalize` finds only the parser, which checks canonical form (`dataset_ref.rs:129`, `:541-542`: containment "is not checked here: piece 1c's resolver checks it"), plus unrelated publish and permission code. So no clause claims behaviour of main's code (§1).

3. **No other containment or canonical-form guarantee in the new text.**
   - A Grep of the head ADR for inside, outside and contain gives 19 hits. Each was read:
     - :6 is A0's provenance line.
     - :36, :56, :65, :147, :159 and :209 are unrelated uses.
     - :95 is C3.
     - :100 is the save-time judgment, not a guarantee.
     - :102 is C1.
     - :104 is the check at the open, plus the human's sentence.
     - :237 is re-linking a dataset outside the folder.
   - A Grep for "keep a path inside", "never open(ed)", "never points" and "stays inside" finds no match. The old C-1 span is gone.

4. **Head against gate 1's head: line 95.**
   - Gate 1's line 95 is the form's A4 New line, form :186 on main. Gate 1's reviewer proved by V1 that 70edd381 equals B with the form's New text applied. Gate 1's architect report byte-copies the line's last span.
   - A whole-line anchored regex finds:
     - form :186 = prefix + "keep a path inside the project folder: containment, below, does;";
     - head :95 = the same prefix + "show that a path leads inside the project folder: containment, below, checks that when the data is opened;", one match.
   - Both spans match Amendment 2's fenced lines, form :516 and :520 (anchored Grep, three-space indent).
   - The head ADR has no CR byte (Grep `\r`: 0).
   - Spot checks at the head, by anchored Grep: C1 :102, :103 and C2 :106 are unchanged, and the human's B1 sentence occurs once.

5. **Not run (no shell):**
   - the byte compare of d0c257d9 against 70edd381 outside line 95 (my evidence is the reflog's single commit, plus Read of the changed lines; the bytes are the reviewer's);
   - V1 rerun, the §7 numstat, the hash recomputations, `gh pr view` / `gh pr checks`, and the verify scripts.
