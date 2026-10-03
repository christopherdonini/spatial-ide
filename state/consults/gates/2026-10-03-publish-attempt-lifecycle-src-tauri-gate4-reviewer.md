*Custodian's filing note (2026-10-03): the gate-4 reviewer for PR #165 wrote this report to this path itself, under the 2026-10-03 trial directive (part 1). It is committed as written, below the rule. The hash of record (the 2026-10-03 lead-data clarification, C3) of the text below the rule, from its fifth line to the end, is b31970c3d1652b7a111c5a9f2d924170000fdf9569b592f0592c28cd2f4f3998, computed by the custodian from the saved bytes. It equals the reviewer's returned sha256.*

---

VERDICT: PASS
Reviewed cut/publish-attempt-lifecycle-src-tauri @ f73befc6978e2c9197a4594f6158f18e7d042a3a. PR #165, gate 4, reviewer.

Scope: record correction round 2 of 2 only, the one commit f73befc over 7bb01d6 (Amendment 3 of the form's §10). Everything said below about a cited span is paraphrase; nothing is quoted. Nothing is pinned by hash at a branch commit; spans on the branch are named by file, section and amendment item at f73befc. The local branch, its origin ref and PR #165's head all read f73befc6978e2c9197a4594f6158f18e7d042a3a.

## S1 (blocking)

None.

## Checklist results

**1. The commit, 7bb01d6..f73befc**
- One commit, f73befc, carrying a Signed-off-by trailer. `git diff --numstat 7bb01d6..f73befc` names only `frontends/shell/PUBLISH-ATTEMPT-LIFECYCLE-SRC-TAURI-PREREGISTRATION.md`, 7 insertions, 0 deletions; one hunk, at the end of the file.
- Append-only: the form's 42393 bytes at 7bb01d6 are a byte prefix of its 43014 bytes at f73befc (`cmp` over the first 42393 bytes, rc 0). §7 is therefore untouched. The file has no CR and ends in one LF.

**2. Amendment 3 item 1 in place of Amendment 2 item 1 (round 12, item (d))**
- Sentences: after its bold label (the same label shape Amendment 2 used, which gate 3 did not count as a sentence), the item has three sentences: the defect (Amendment 1 item 4's Reason does not give §7's count), the corrected reference (S1-2 of the gate-2 reviewer report), and the proof (§7's own command over the two named ranges). Within the ceiling.
- No restated claim or figure: the item carries no number and does not retell the Reason's sum or the Final pair. This answers gate-3 S1-1 (both roles) and my gate-3 S2-1.
- The reference resolves on main: `state/consults/gates/2026-10-03-publish-attempt-lifecycle-src-tauri-gate2-reviewer.md` exists at origin/main bf01d4274afa503de87b847e912d16d5bd351615 (`git cat-file -e`, rc 0). Its S1-2 is the Reason finding: count up by 21, from 694 to 715, insertions 657 to 675, deletions 37 to 40.
- §7's own command ("Counted by"), re-run by me in the worktree:
  - ff57832...4d92733: 657 insertions, 37 deletions, 694, 5 files (KNOWN-LIMITATIONS 14/0, MANUAL-WALKTHROUGH 32/0, commands.rs 24/21, lib.rs 26/2, publish.rs 561/14).
  - ff57832...0391787: 675 insertions, 40 deletions, 715, 5 files (19/0, 33/0, 28/24, 26/2, 569/14).
  - ff57832...f73befc: identical to 0391787; the round adds no counted line.
  - `git merge-base ff57832 f73befc` is ff57832 itself.
  - Both ranges give the gate-2 S1-2 figures.

**3. The superseded index (Amendment 3 item 2)**
- Present. It names Amendment 2 item 1 as superseded by Amendment 3 item 1, and nothing else.
- Accurate: Amendment 2 item 1 exists at f73befc and is the item both gate-3 S1s named. Amendment 2 item 2 (walkthrough, discharged at gate 3) and Amendment 2 item 3 (its own index, which still reads true: Amendment 1 item 4's Reason bullet stays superseded, now through Amendment 3 item 1) are rightly not named. No Amendment 1 text is newly superseded.

**4. Record form**
- Heading: record correction round 2 of 2, classes 1 and 3 (answers the gate-3 architect's S2-1). First body line: written after gate 3's results were seen, marked a post-result amendment; the body names this the record cap's last record-correction round.
- References only: no `sha256` in Amendment 3 (grep count 0), no `path:line` cite, no line cite into the form or the ledger, nothing marked verbatim or quoted, no discharged or done clause.
- Commits are named by id only. ff57832 and 4d92733 are ancestors of origin/main (rc 0). 0391787 is not yet on main (rc 1); it is a range endpoint, not a hash reference, so round 15 (e) does not reach it, and it reaches main when #165 merges by merge commit.
- Round 25, item 2: §7 not edited; no scope addition; no record calls a `verify-mutation` run an observation; no test-text span is pinned. None fails. The form is the full form, so §21d does not apply.

## Exit codes

All in the worktree at f73befc. Each tool commit is the last commit touching the script, and is the same on origin/main bf01d42.

| Command | rc | Notes |
|---|---|---|
| `node scripts/plan/verify-cites.mjs` | 0 | tool at 522e448d55e089b974e115e23f0c72bfc6e1120a; 1129 files; 33 loose-reference advisories, none in the form |
| `node scripts/plan/verify-quotes.mjs` | 0 | tool at f9444a4d99a9087394c55d4b1d4c414a8b11f980; 113 checked, 82 verified, 30 baselined, 1 advisory, not this piece |
| `node scripts/plan/verify-test-claims.mjs` | 0 | tool at e9735d4749f094f03b69a8b570e8bf10f511c279; 483 claimed tests across 112 files |
| `node scripts/plan/verify.mjs` (verify:plan) | 0 | tool at 260720226f136d1ec7d72da64656f07d29400ed7 |
| `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` | 0 | Governance CI's own step; 408 passed, 0 failed |
| `git merge-tree --write-tree origin/main f73befc` | 0 | clean; the branch is 23 commits behind origin/main |

- No cargo run: the round touches no code (check 1); code is identical to bfd68af, where gate 2 ran the cargo suites.
- At the end the worktree's `git status --porcelain` is empty. Every node process I started exited.

**PR #165 CI, at 2026-10-03T09:52:49Z**, head f73befc. GitHub reads the PR MERGEABLE, merge state UNSTABLE (one run pending).
- Pull-request runs: DCO sign-off 37114156639 success, Exposure scan 37114156589 success, Rust fmt 37114156658 success, Governance CI 37114156638 success, Product CI — shell 37114156946 **in progress**.
- Push runs: Governance CI 37114152876 success, Product CI — shell 37114153019 success.
- The pending pull-request Product CI run tests the same code as the green push run at the same head; the custodian reads its conclusion before merge.

## S2

1. **The gate-2 reviewer's S2-2 and S2-3 (Amendment 1 items 3 and 7 on T4) are not carried by this round.** They were non-blocking. Per the gate-3 architect's Judgment 3, the closing record references them; nothing re-opens.
2. **Merge before the record lands on main:** Amendment 3 names 0391787 by id; that id reaches main only through #165's merge commit, which the PLAN node's `merge: merge-commit` (named in the form's custodian notes, open point (4)) already requires.

## N

1. The bold label "In place of Amendment 2 item 1." reads as a fourth sentence if labels are counted. Gate 3 did not count Amendment 2's labels, and I apply the same reading here.
