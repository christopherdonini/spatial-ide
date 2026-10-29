# verify-cites reads a pinned citation at its pinned commit before calling it unresolved — five-line preregistration (`AUTONOMY.md` §21d)

*Committed before any code. Placed by the human's Decision B (`state/directives/2026-10-08-decisions-a-b-c.md` lines 17-24 at the commit that adds it, sha256 55ac849dfa481cb43f579a9edaefa4fa7fd729ec98424fef46595c04a11b32d4; its RULED block in `DECISIONS-PENDING.md`), as a one-off, bounded exception to the 2026-10-05 freeze. Found by `shell-migration-milestone-1` stage 2 (its form's Amendment 4, item 8): that form's citations pinned at 30e77c10 name lines past App.tsx's new end. A single combined reviewer gate (§21b) applies, because none of §21a's categories is touched.*

```
Authority: PLAN node verify-cites-pinned-citations; the human's Decision B of 2026-10-08 (state/directives/2026-10-08-decisions-a-b-c.md, lines 17-24); a one-off exception to the 2026-10-05 freeze, merged before shell-migration-milestone-1 opens its PR
Scope: scripts/plan/verify-cites.mjs and scripts/plan/verify-cites.test.mjs only; 2 files; <= 150 changed lines, tests included, this form excluded
Change: a citation that carries a pin (path:line or path:line-range, then @ and a commit) and does not resolve in the tree is resolved at its pinned commit (the file exists there and the line or range is within it) before it is called unresolved; a pin whose commit is missing, or whose file is missing at that commit, or whose line is out of range there, still fails; unpinned citations are checked against the tree exactly as today, and nothing else in the checker changes (the archived prefixes, the loose and doc-number classes, the output format and the exit codes)
Tests+mutation: four new tests in verify-cites.test.mjs, each on a temporary git repository: P1 a pinned cite past the tree's end that resolves at its commit passes; P2 a pinned cite whose commit does not exist fails by name; P3 a pinned cite whose file is missing at that commit fails by name; P4 an unpinned cite past the tree's end still fails (the old behaviour); mutation for P1: the pinned fallback removed, so P1 fails; for P2: an unknown commit treated as resolved, so P2 fails; for P3: the file check at the commit skipped, so P3 fails; P4 guards the unpinned path against a fallback applied to every cite; each observed, reverted and recorded in a RECORDED MUTATION comment with its commit
Out-of-scope: ADR none; security none; wire none; guarantee none -- §21a's four categories untouched, so the single reviewer gate applies; no product file, no workflow, no record rule and no other checker changes; the freeze stands for everything else
```

## Amendments

Opens empty, append-only.

### Amendment 1 — the gate-1 reviewer's C1 and C2: two tests added after a gate finding (class 4), and the failing pin's reason

*Written by the custodian after the single reviewer gate failed (`state/consults/gates/2026-10-08-verify-cites-pinned-citations-gate1-reviewer.md`, gate-log 441), at the branch head 57e8d2b3, before any code of the fix. Correction round 1 of 2. Nothing below is a quotation.*

1. **C1, the file at the pin.** A pin is read as a file, not as anything the commit can show. `checkPinned` reads the pinned path as a blob, so a path that is a directory at the pinned commit fails, with the pin's reason.
   - **New test P5:** a pinned cite whose path is a directory at that commit fails by name.
   - **Mutation:** the blob read replaced by the current `git show` read, so P5 fails.
2. **The line at the pin.** The Change line's out-of-range clause gets its own test.
   - **New test P6:** a pinned cite whose file exists at that commit, but whose line is past that file's end there, fails by name.
   - **Mutation:** the range check at the pin removed, so P6 fails.
3. **C2, the reason.** When the pin's file is not found at the pinned commit but the tree found a file for the cite, the tree's own reason is kept. The pin's reason replaces it only when it states something true: a missing commit, a directory, or a line out of range at the pin. No cite changes tier.
4. **D1 and D2.** The checker's header states the pinned fallback and its limits: a pin after a closing backtick or two spaces is not read; a pin on a cite that resolves in the tree is not checked; and a hex word right after `@` is read as a pin. `extractCitations`'s JSDoc names the `pin` field.
5. **D3, for the record.** The worker report places the new pattern at line 142 of `verify-cites.mjs`. It is at line 144 at 57e8d2b3. The report is not edited.
6. **The Scope stands:** the same two files, still at most 150 changed lines, tests included. The other tests and the Out-of-scope line are unchanged.

**Superseded index.** The Change line's file-exists clause → item 1. The Tests+mutation line → items 1 and 2 add P5 and P6. None is edited.

### Amendment 2 — the closing record (class 1, with class 2 for the third test and C3)

*Written by the custodian after the outcomes were seen. PR #191 merged at 2026-10-08T16:11:52Z as merge commit f816d46790437a21974e95850a4c18bff7fc9ff8, with parents 3e754dfc99b71aa04b63d4ff676eef605d8b77fb and 04f6332b35271afd234fd931f9df9993a9cd06f3. It routes the gate's record items, under the record cap. References and hashes only. Nothing below is a quotation.*

1. **The PR and its heads:**
   - PR #191, at the merge commit above;
   - the gated head, 2d684ad5bcc1155a1cce568633cdf3342db33ec7;
   - the merged head, 04f6332b. Over the gated head it adds only the attempt-2 D4 clause, a comment in the checker's header. The custodian checked it against its finding by the diff. CI passed 6 of 6 there.
2. **The gate reports,** under `state/consults/gates/`, each with the commit on main that adds it:
   - `2026-10-08-verify-cites-pinned-citations-gate1-reviewer.md`: FAIL, gate-log 441, sha256 5ad442cfed9c5414f2924f3cacf72228410d8629be4b6d972b564b294fea1aa7, at 0ca68cb1fbe61ec037b1ff14ae7d9266a586b506;
   - `2026-10-08-verify-cites-pinned-citations-gate1-reviewer-attempt-2.md`: PASS, gate-log 442, sha256 175c2df523ae112456dcdfe9353a3d8d8209a9c553c3921133026bb0d7ab6756, at c9b8e07d6a94b8f36c414ea5441f91c3591a5917.
   - One correction round was used, of two.
3. **The worker reports,** in `state/consults/`. Each hash is of the file from its line 5 to the end, and each file is unchanged since the commit on main that adds it:
   - `2026-10-08-verify-cites-pinned-citations-worker-report-1.md`: sha256 22864903d1da6e071169477b2416be15c2c374c4cd44642de897ffca05b827e0, at a963b90a09d4ff488de3d273339b33991333848f;
   - `-worker-report-2.md`: sha256 6c406277f60a0f7fa0a9aef1d01bee761fd31b9ab9fe8c2bec664457a7b735b4, at e1e4a6bf6ad79d8893ae0c2d8ed4b65033dd2201.
   - The D4 worker's report is not filed. Its whole change is the one commit 04f6332b, and item 1 records it.
4. **The mutations.**
   - P1 to P3 were observed at 0e092a40 and recorded at 57e8d2b3.
   - P5 and P6 were observed at 7f332caf and recorded at 2d684ad5.
   - The reviewer's attempt 2 re-made P1 to P3, P5, P6, two forms of P4 and the C2 test's mutation at 2d684ad5. Each failed its named test.
5. **The Scope:** 148 changed lines over the 2 files, against at most 150: the checker 47 added and 7 removed, and the tests 94 added. This is from ed396e94 to 04f6332b.
6. **The seam:** against milestone 1's branch, the four cites pinned at 30e77c10 resolve. Its gated count goes from 4 to 0, with the advisory set unchanged (the reviewer's attempt 2).
7. **Recorded, class 2:**
   - **The third test** (the attempt-2 D5). `a_pinned_loose_cite_keeps_the_trees_reason_when_the_pin_path_is_not_found` guards Amendment 1's item 3 and goes beyond its P5 and P6. Its mutation, the reason choice made unconditional, was observed by the reviewer at 2d684ad5. The test file carries no recorded-mutation comment for it.
   - **C3** (the attempt-2 reviewer, low). Amendment 1's item 3 keeps a pin's reason only when it states something true. For a pinned cite that starts at line 0, the pin's reason names the end line and is false. The tree path gives the same wording for the same input, unpinned. The cite still fails, and no tier changes. A proposed node holds it.
   - **The attempt-2 D4 limit,** now stated in the header: a pin is read at the path as written, from the repo root. Resolving a pin the tree's way is a later piece, in the same proposed node.
8. **The attempt-1 D3** is recorded in Amendment 1's item 5.
9. **Done:** PLAN marks the node done, with evidence `{pr: 191}`, at generation 2, in this amendment's commit.

**Superseded index.** Amendment 1, item 3's claim → item 7 (C3). It is not edited.
