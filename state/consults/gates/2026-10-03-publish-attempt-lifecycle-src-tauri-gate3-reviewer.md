*Custodian's filing note (2026-10-03): the gate-3 reviewer for PR #165 wrote this report to this path itself, under the 2026-10-03 trial directive (part 1). It is committed as written, below the rule. The hash of record (the 2026-10-03 lead-data clarification, C3) of the text below the rule, from its fifth line to the end, is 84f0f9139a179439df0ba5524dd0c1b404e2e0afcdfa61f3649ae91a7a8a1056, computed by the custodian from the saved bytes. It equals the reviewer's returned sha256.*

---

VERDICT: FAIL
Reviewed cut/publish-attempt-lifecycle-src-tauri @ 7bb01d6be97cfa8879e554f069c4c9faf5f24fad. PR #165, gate 3, reviewer.

Scope: record correction round 1 only, the one commit 7bb01d6 over bfd68af (Amendment 2 of the form's §10). Everything said below about a cited span is paraphrase unless it is marked as quoted. Nothing is pinned by hash at a branch commit; spans on the branch are named by file, section and amendment item at 7bb01d6.

## S1 (blocking)

1. **Amendment 2 item 1 is a correction over the ceiling: four sentences.** Round 12, item (d) caps a correction at three sentences (the defect, the corrected reference, the proof), and the gate fails "a correction over the ceiling" by name.
   - The first bullet carries the defect in two sentences: (1) the Reason's sum does not give §7's count; (2) the round edits lines the piece had already added, so the count rose by 21, not 55. The second bullet is the corrected reference (one sentence), the third the proof (one sentence). Total four.
   - The first of the two defect sentences also restates Amendment 1 item 4's Reason (the 55-onto-694 sum) in order to name it, which (d) forbids in the same clause ("never restates an earlier amendment's claim"). The precedent record corrections on main name the defect without restating the claim (`kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md` Amendments 3 and 4).
   - The content is correct (checklist item 2); only the form fails.
   - Fix, in record round 2 of 2: one defect sentence that does not restate the Reason, for example (paraphrase) that the Reason's sum is not §7's count, which rose by 21 because the round edits lines the piece had added; then the existing reference and proof sentences. The round's superseded index then names Amendment 2 item 1 as superseded (round 12, item (e)).

## Checklist results

**1. The diff, bfd68af..7bb01d6**
- One commit, 7bb01d6, signed off. `git diff --name-only bfd68af..7bb01d6` names only `frontends/shell/PUBLISH-ATTEMPT-LIFECYCLE-SRC-TAURI-PREREGISTRATION.md`; numstat 14/0.
- Append-only: the form's bytes at bfd68af are a byte prefix of its bytes at 7bb01d6 (`cmp` over the first N bytes, rc 0). Against 4d92733 and against ff57832 the form is 49/0. §7 is untouched. The file has no CR.

**2. Amendment 2 item 1 against my gate-2 S1-2**
- §7's own command (§7, "Counted by"), re-run by me:
  - ff57832...4d92733: 657 insertions, 37 deletions, 694, 5 files (KNOWN-LIMITATIONS 14/0, MANUAL-WALKTHROUGH 32/0, commands.rs 24/21, lib.rs 26/2, publish.rs 561/14).
  - ff57832...0391787: 675 insertions, 40 deletions, 715, 5 files (19/0, 33/0, 28/24, 26/2, 569/14).
  - ff57832...7bb01d6: identical to 0391787; the round adds no counted line.
  - `git merge-base ff57832 7bb01d6` is ff57832 itself.
- Both figure pairs in the proof bullet match. The 21 is 715 minus 694. The causal clause (lines the piece had added cancel out of the count) matches my gate-2 S1-2 third bullet, which is the item's named reference.
- Ceiling and restatement: S1-1.
- The proof's 0391787 pair equals Amendment 1 item 4's Final figures. I read that as the proof's recount, which check 2 orders, not a restatement; see S2-1.

**3. Amendment 2 item 2 against my gate-2 S1-1**
- `git diff 4d92733 b125721 -- frontends/shell/MANUAL-WALKTHROUGH.md`: one hunk, one removed line (row R1) and two added lines (row R1, and one "Before R1" bullet, the `publish-bundle.exe` build note). `git log 4d92733..7bb01d6 -- frontends/shell/MANUAL-WALKTHROUGH.md` names b125721 only.
- I split row R1 on its cell separators at 4d92733, b125721 and 7bb01d6 and hashed each cell. The `#` cell and the step cell are byte-identical at all three; only the Expected-outcome cell differs.
- Split into sentences, the Expected-outcome cell has 8 at both commits. Sentences 1-6 and 8 are identical; sentence 7, the next-to-last (the repeat advice), is the only one changed. The last sentence, that row G9 is unchanged, is identical.
- The "Before R1" notes (the walkthrough's bold "Before R1:" lead-in) lost no line and gained one bullet.
- Item 2 is three sentences and names its source (the gate-2 report, S1-1). It discharges S1-1.

**4. The superseded index (Amendment 2 item 3)**
- Present. It names Amendment 1 item 4's Reason bullet and Amendment 1 item 7's walkthrough bullet as superseded by items 1 and 2, and nothing else. Both named bullets exist in Amendment 1 at 7bb01d6, and they are the two my gate-2 S1s named. It is accurate as written; it will need a round-2 entry once S1-1 is corrected.
- My gate-2 S2-3 (Amendment 1 item 7's T4 entry names a line that did not change) was non-blocking and is not taken up. That is consistent with "Nothing else is superseded".

**5. Record form**
- First body line: written after gate 2's results were seen, marked post-result (class 1's first-line shape). The heading reads record correction round 1 (class 3), the labelling `protocol/data-plane/STREAM-REGISTRY-BOUND-PREREGISTRATION.md` Amendment 2 uses on main.
- References only: no `sha256` in the amendment (grep count 0) and no `path:line` cite. Commits are named by id. ff57832, 4d92733 and b125721 are reachable from origin/main through merge 4e3c8a8; 0391787 reaches main when #165 merges by merge commit.
- The report reference `state/consults/gates/2026-10-03-publish-attempt-lifecycle-src-tauri-gate2-reviewer.md` exists at d1f4c87 and on origin/main (d1f4c87; `git cat-file -e` rc 0). Its S1-1 and S1-2 resolve; the custodian's filing note above the rule does not shift the finding ids.
- Record round: the body says round 1 of 2 under the record cap. Amendment 1 was a code-and-docs correction round (classes 8, 1 and 4) answering gate 1's KNOWN-LIMITATIONS 30 finding, not a record correction, so this is the first record round. With this FAIL the next is round 2 of 2, after which the architect reduces the record (the record cap).
- Round 25, item 2: §7 is not edited; no scope addition; no record calls a `verify-mutation` run an observation; no test-text span is pinned at a branch commit. None fails.
- Quotes: the amendment marks nothing as quoted.

## Exit codes

All in the worktree at 7bb01d6. Each tool commit is the last commit touching the script, and is the same on origin/main d1f4c87.

| Command | rc | Notes |
|---|---|---|
| `node scripts/plan/verify-cites.mjs` | 0 | tool at 522e448d55e089b974e115e23f0c72bfc6e1120a; 1129 files; 33 loose-reference advisories, none in the form or the walkthrough |
| `node scripts/plan/verify-quotes.mjs` | 0 | tool at f9444a4d99a9087394c55d4b1d4c414a8b11f980; 113 checked, 82 verified, 30 baselined, 1 advisory, not this piece |
| `node scripts/plan/verify-test-claims.mjs` | 0 | tool at e9735d4749f094f03b69a8b570e8bf10f511c279; 483 claimed tests across 112 files |
| `node scripts/plan/verify.mjs` (verify:plan) | 0 | tool at 260720226f136d1ec7d72da64656f07d29400ed7 |
| `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` | 0 | 408 passed, 0 failed |
| `git merge-tree --write-tree origin/main 7bb01d6` | 0 | clean; the branch is 22 commits behind origin/main |

- No cargo run: the round touches no code (check 1), and gate 2 ran the cargo suites at bfd68af, whose code is identical.
- At the end the worktree's `git status --porcelain` is empty. Every node process I started exited.

**PR #165 CI, at 2026-10-03T09:40:35Z**, head 7bb01d6. Every run at 7bb01d6 is completed and successful.
- Pull-request runs: DCO sign-off 37113259062, Exposure scan 37113259143, Rust fmt 37113259120, Governance CI 37113259067, Product CI — shell 37113259258.
- Push runs: Governance CI 37113255546, Product CI — shell 37113255755.
- Nothing is pending. GitHub's mergeability reads UNKNOWN; the local merge-tree is clean.

## S2

1. **Amendment 2 item 1's proof repeats Amendment 1 item 4's Final pair (675/40).** It is the recount check 2 orders, and as I read round 12, item (d) it is not a restatement. The round-2 correction can avoid the question by making the proof the command at the two named commits and their figures, with nothing that reads as the Final bullet again.
2. **My gate-2 S2-3 stands** (Amendment 1 item 7's T4 entry). It is non-blocking; round 2 may fold it in only if each correction stays within the three-sentence ceiling.

## N

1. The heading's class label and the body's post-result line are the shape main already uses. The GENERATION-CLOSE-RACES shape (post-result, record correction, record round 1 of 2, all in the heading) is one line shorter.
