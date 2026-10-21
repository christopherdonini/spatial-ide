*Custodian's filing note (2026-10-21): the worker-high's report for governance D's correction round 1 (the form's Amendment 4), in C:/dev/wt/psa from 2d60ac164e7a65e29e5e55a27eaa202062d31b83 to 510f4bacc1521fb85de84628b8686f334a2970aa, pushed. The run 2026-10-21T02:36:38Z to 02:48:25Z by its transcript (Bash 21, Edit 6, Write 5, Read 10); its one SubagentHandback call, at 02:48:25Z. Checked against the transcript and the branch: two commits, c8c0a294 and 510f4bac, three files changed; each observation has its call (MR15 fails R15 by name at c8c0a294; in the throwaway clone R15 passes on the rotated tree and refuses with the archive removed; the C2 check by patched copies in that clone); the test file 18 of 18 and the CI globs 527 of 527 by their output. The record commit was amended once, before the push, to restore one space its own edit dropped; no pushed commit was rewritten. Extracted by script; one final newline added; nothing else changed.*

---

Correction round 1 of governance D (tag node:governance-plan-summaries-archive@g5) is done and pushed. Both gate-1 code findings are fixed, the five word pairs are applied, and both observations came out as predicted. Every check below passes. The one overrun is the script's line count, 251 against 230, which is class 8 (the same entry as Amendment 2 item 5).

**Head and commits**
- Head: 510f4bacc1521fb85de84628b8686f334a2970aa on `cut/plan-summaries-archive`, from 2d60ac16.
- Fix commit: c8c0a2949c841537d3a3d2800ef4da5b34cf344f (C1, C2 and the five word pairs).
- Record commit: 510f4bacc1521fb85de84628b8686f334a2970aa, comment lines only (numstat 2/1 on the test file, and no non-comment line differs from the fix commit).
- Both were made with `git commit -s -F <file>` and carry the two trailer lines.
- Push: `git push origin cut/plan-summaries-archive` in its own Bash call, an ordinary update to 510f4bac, `push_rc=0`. `HEAD` equals `origin/cut/plan-summaries-archive`.

**C1 and C2**
- **C1:** both changes are in `scripts/plan/rotate-plan-summaries.test.mjs`, in R15.
  - **Archives (lines 345-349 at the fix commit):** `mkRepo`'s first commit, dated PAST, now also holds every `state/cut-archive/PLAN-SUMMARIES-*.yaml` that `git ls-files` lists at REPO_ROOT (pathspec `:(glob)state/cut-archive/PLAN-SUMMARIES-*.yaml`), read as Buffers so the bytes are exact. A same-day run therefore takes `-2`.
  - **`gone` assertion (line 364 at the fix commit):** `gone.length >= 2` became `gone.length >= 1`, and the `synthetic-long-done` and `synthetic-long-ready` checks stay.
- **C2:** in `scripts/plan/rotate-plan-summaries.mjs` (lines 228-240 at the fix commit), the staged-blob check, the "staged:" line, the "blobs:" line and the "Next:" line moved inside the `try` that holds the first write (`mkdirSync`). The `catch` now does `throw e instanceof Stop ? e : new Stop(e.message)`. Every failure after the first write is therefore a STOP (exit 2, the STOP line, nothing rolled back), and the refusal line cannot appear after it.
- **How I checked C2:** no new test, as the brief allows. In a throwaway clone at the fix commit I made two untracked copies of the script, each with `--bogus-flag` added to the post-`git add` `git diff --cached --name-status --no-renames` call.
  - The 2d60ac16 script copy exited 2 with `refusing — git diff --cached ... --bogus-flag failed (...). Nothing was written.` Both files were staged.
  - The fixed script copy exited 2 with `STOP — git diff --cached ... --bogus-flag failed (...). Nothing was rolled back.` Both files were staged.

**The five replacements**
- I checked the words file's sha256 (7dd8947f…55b7c9) before applying anything.
- I applied all five with a Write-tool script. It asserts each `old` occurs exactly once and refuses on a CR byte. It ran once with no refusal and reported "applied 5 pairs to 3 files".
- The five pairs, byte for byte:
  1. README exit-code sentence.
  2. README staging sentence.
  3. Test file header comment.
  4. Test file mutation-commit comment.
  5. The due-call comment in the script. It is now three lines, because the new text has two comment lines plus the code line.

**Observations**
- **MR15 at the fix commit c8c0a294.** I dropped `n.status === 'done' &&` in `findCandidates` by hand and ran the test file. It exited 1, with 11 of 18 failing, and R15 failed by name: `rotate-plan-summaries: from the real PLAN.yaml, after a run the queue differs only in plan_hash, the site's plan.json only in plan_hash and the moved summaries, and both drift checks pass after regeneration`. The other ten failures are the tests that need a good run of the script, as in the earlier record. I reverted with `git checkout` and the porcelain was empty. The RECORDED MUTATION line for MR15 now names `c8c0a2949c84`.
- **R15 on a rotated tree.**
  - **Setup:** a clone of the branch at c8c0a294, with a local bare origin whose `main` and branch were both c8c0a294.
  - **Rotation:** the script, run without `--dry-run`, exited 0. It staged PLAN.yaml and a new archive, moving 153 summaries and 405897 bytes. I committed that in the clone only, as 62b1e3110a4e71d609d139d7853ba779bcef70eb. PLAN.yaml then held 153 pointers.
  - **With the archive:** R15 passed (1 of 1, exit 0). Here `gone` is the synthetic node alone, so this also exercises the `>= 1` change.
  - **Without the archive:** I removed the archive with `git rm` and committed that in the clone only, as fc5a4924afcde397e96fdfd54a2e8437ce91a8e7. R15 then failed by name (exit 1) with `refusing — self-check-false-readings: its pointer names an archive that is not tracked at HEAD or does not hold that id. Nothing was written.`
  - **Cleanup:** nothing was pushed from the clone, and I removed the clone and its origin afterwards. Both outcomes are recorded as one comment line in the test file (`RECORDED OBSERVATION (R15 on a rotated tree)`).

**Checks at 510f4bac**
| Check | Result |
|---|---|
| `node --test scripts/plan/rotate-plan-summaries.test.mjs` | rc 0, tests 18, pass 18, fail 0 |
| CI globs (`scripts/plan`, `scripts/hooks`, `scripts/evidence` test files), heavy, inside a shared hold | tests 527, pass 527, fail 0 |
| `verify.mjs --offline` | rc 0, `verify:plan PASS` |
| `verify-cites.mjs` | rc 0, `PASS` across 2116 files |
| `verify-quotes.mjs` | rc 0, `PASS — 129 checked, 98 verified, 30 baselined, 1 advisory` |
| `verify-test-claims.mjs` | rc 0, `PASS — all 574 claimed test(s)` |
| `verify-mutation.mjs` | rc 0, `PASS — all 18 new test(s) have a recorded mutation naming them` |

- I used the machine script's `hold shared` and `release`; the hold was granted and released, with no 96-99 code.
- For the CI globs, my `exit $rc` form did not print the exit code. The harness reported no failure, and the result is 527 of 527.

**§7 counting command** (merge-base is M0):
| File | Lines | Budget |
|---|---|---|
| `scripts/plan/rotate-plan-summaries.mjs` | 251 | 230 (class 8 overrun, §7 not edited; it was 249 at S5) |
| `scripts/plan/rotate-plan-summaries.test.mjs` | 381 | 420 |
| `scripts/plan/README.md` | 12 | 30 |
| `AUTONOMY.md` | 19 | 42 |
| Total | 663 over 4 files | 800 over 6 |

**§8 item 7:** `cmp -n` against M0 81c34c8b exits 0 for `AUTONOMY.md` (n=104852) and for `scripts/plan/README.md` (n=28112).

**Differences from the brief**
- I made the record commit with a slip (the edit tool dropped the space in `const BASE = 'lead…`), and I noticed it from the diff. I fixed the space and ran `git commit --amend --no-edit` before any push. The pushed record commit is comment-only.
- In the rotated-tree observation, "delete R15's new archive copy" is my reading: I removed the tracked archive with `git rm` in the clone, so R15's `ls-files` copy step finds none.
- C2's check used patched copies in a throwaway clone, not a new test.

**Final state:** the porcelain in `C:/dev/wt/psa` is empty. The scratch files are `psar1-*` in my scratch folder. I removed the clone and its origin, and I did not touch the main checkout.

**Model:** Sonnet 5.5, `claude-sonnet-5-5`. I received or produced no context handoff.
