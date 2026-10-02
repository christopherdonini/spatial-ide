*Custodian's filing note (2026-10-02): the architect's gate 2 on PR #157, for PLAN node `workspace-rustfmt`, full gating, scoped to the commits after c6d1414 (27a6c94, form Amendment 1; 275d305, C3). Reviewed: cut/workspace-rustfmt @ 275d305 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b), transcribed from the hand-back message with the harness's two-space indent removed; the text below the rule is the agent's. Its branch-only `path:line` cites are read at 275d305. Verdict FAIL. S1-1: §7's counting command does not exclude the form, so Amendment 1 makes the count 3 files against the declared 2; a class 8 amendment is owed. S1-2: §8 item 3 bars any commit after C1 touching a path other than §7's two files, and Amendment 1 does that; the architect calls it a finding for the human under template §10, put to question round 37, and the merge click waits for the answer. C3 and Amendment 1's content pass. Profile paths redacted at filing: none.*

---

VERDICT: FAIL
Reviewed cut/workspace-rustfmt @ 275d305. PR #157, gate 2, architect. Scope: 27a6c94 (form Amendment 1) and 275d305 (C3), the commits after c6d1414.

I had no Bash, so I ran no git diff or numstat, recomputed no hash and read no CI run. I read the worktree at C:/dev/wt/workspace-rustfmt and main's checkout. Every form cite below is read at 275d305; §0 to §9 of the form are byte-identical on main, where §10 is still empty.

## S1 (blocking)

**S1-1. A §7 file-count overrun with no class 8 amendment. Round 25, item 2 fails this by name; it is also form §8 item 13.**
- §7's budget, byte-copied from `WORKSPACE-RUSTFMT-PREREGISTRATION.md:160`: "- **Size budget, C1 excluded:** at most 120 changed lines, insertions plus deletions, over at most 2 files (`.github/workflows/rust-fmt.yml` and `.git-blame-ignore-revs`)."
- Its counting command (a sub-line span of `:161`) is `git diff --numstat <C1> <head> -- . ':!PLAN.yaml' ':!CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**'`. It does not exclude the form itself.
- 27a6c94 appends Amendment 1 to `WORKSPACE-RUSTFMT-PREREGISTRATION.md` on the branch, and main's copy has no amendment. So the command at 275d305 counts 3 files. My count from the files is about 93 lines: 80 + 2 + about 11 for the amendment. The line ceiling holds; the 2-file ceiling does not.
- The worker's "82 of 120" leaves the form out. It is not the output of §7's own command, which is the figure class 8 requires (`docs/PREREGISTRATION-TEMPLATE.md:169`).
- The cause is my drafting. Every sibling form excludes itself, including this form's shape model (`scripts/hooks/EXPOSURE-SCAN-CI-BACKSTOP-PREREGISTRATION.md:220`). My I4 ruling then sent the amendment to "#157's record" without saying where it lands.
- Fix: append Amendment 2 on the branch. Its first line says it is post-result and carries the words `budget overrun, §7 not edited` (template `:169`; form §8 item 14, last bullet). It holds:
  - declared 2 files and 120 lines;
  - the final figure from §7's own command at a named commit;
  - the reason: the command has no self-exclusion.
- §7 stays unedited (`:162`). Amendment 2 adds lines to the same third file but no fourth file. The generation goes to 3 (`AUTONOMY.md:230`).

**S1-2. Form §8 item 3 is hit by 27a6c94, and the branch cannot cure it.**
- Byte-copied from `WORKSPACE-RUSTFMT-PREREGISTRATION.md:169`: "3. Any commit after C1 touching a path other than §7's two files."
- 27a6c94 touches the form. The shape model's matching item has the carve-out that this form lacks, byte-copied from `scripts/hooks/EXPOSURE-SCAN-CI-BACKSTOP-PREREGISTRATION.md:247`: "8. A file outside §7's three, apart from this form and the custodian's generated set."
- None of these cures is available:
  - a revert falls outside round 15 (f)'s restore bound, because an append is not an in-place edit the append-only rule forbade;
  - a force-push is barred by §2 item 1 and §8 item 10;
  - no amendment class removes a block-on-sight item.
- Under template §10 (`docs/PREREGISTRATION-TEMPLATE.md:96-99`) this is a finding for the human. Put one question by option label:
  - (1) **Recommended:** accept the form's own appended amendments as outside §8 item 3's reach, as the shape model's §8 reads;
  - (2) close #157 unmerged and redo it with the record appended on main.
- I read this as not a red line, because round 34 item 1's shape (the two commands' diff plus the check in the same PR) is unchanged. That reading is the human's to confirm.
- Hold the click until the human answers.

## S2

None.

## N

- **N1. The reviewer cite is right and my ruling is wrong.** In the gate-1 reviewer's report, S2-1 is §0's list and S2-2 is the header sentence (`state/consults/gates/2026-10-02-workspace-rustfmt-gate1-reviewer.md:31`, `:33`). Amendment 1 item 3's "S2-1" is correct. My I4 ruling's "S2-2" (`state/consults/gates/2026-10-02-workspace-rustfmt-i4-architect-ruling.md:60`) is the error. That file is a gate report, not a record, so nothing in the form needs correcting.
- **N2. The pin at a0f0da7 is acceptable.**
  - a0f0da7 is the merge base, so it is on main, and round 15 (e) holds. Because it is in the branch's own history, it also resolves at the branch.
  - The pinned line is the pre-fix regex. Main's `:222` now carries #158's regex, so the tree no longer matches the pin.
  - As round 14 requires, I name which is authoritative:
    - the pin, for which reader failed at c6d1414;
    - the tree, for current behaviour.
  - The reviewer still has to recompute the hash.
- **N3. Round 35 is cited without its item.** Amendment 1 item 2 says "placed by question round 35". Round 12 (a) wants round and item, here "question round 35, item 1". The round has one item, so the cite resolves; it is not a line cite. This is a nit.
- **N4. Superseded index "None": I agree.** F6 is a recorded deviation and is not superseded. §0's list is incomplete but not made false. The header is not a record.
- **N5. Merge-time hazard on note 2.** The human's line contains the placeholder `<the rustfmt merge commit>` (`state/directives/2026-10-02-rustfmt-notes.md:16-17`).
  - The closing record must not present that line as a quote with the merge id substituted in. That would not match the source byte for byte, which is a round 10 failure by name.
  - Instead, reference the span by path:line @ a main commit with its hash, and state the merge id separately. If the line is reproduced, it must be byte-copied by script and marked.
  - This flags an existing obligation; it adds no new one.

## Judged items

1. **C3 passes on every point asked.**
   - `.github/workflows/rust-fmt.yml:20-21`: the H1 sentence is limited to the form's H1 (form `:32`) and names E1.
   - `:15-16` states that the file claims nothing about whether the check is required for merge. It makes no merge-requirement claim.
   - `:13`: the section label is unquoted. Nothing in the header is quoted.
   - The header makes no macOS claim (R3, form `:97`).
   - Every non-header line sits exactly one line below where gate 1 cited it (`on:` was `:28` and is `:29`; concurrency was `:53-55` and is `:54-56`; `if` was `:78` and is `:79`). That is consistent with a header-only change of one net line. The reviewer's diff is the proof.
   - §8 item 3 allows this file. It sits inside the line ceiling, but the file count fails under S1-1.
2. **Amendment 1 passes on its content.** It meets the ruling's Conditions:
   - its first line says post-result;
   - run 37006671393;
   - the main-commit pin (N2);
   - F6 unedited;
   - §0's omissions by reference (N1);
   - the rustfmt versions through the reviewer's S2-3;
   - node `publish-panel-rs-regex-layout`, PR #158, merge commit e4e864e;
   - generation 2 on main (`PLAN.yaml:3429`).

   Its presence on the branch is S1-1 and S1-2.
3. **Merge-time obligations: all are in place.** Owed before the click:
   - the answers to S1-1 and S1-2;
   - P1 at merge, recorded (§8 item 9);
   - the head marked ready fully green: product-ci-shell on the merge ref with #158, src-tauri cargo test, both release checks, and E1. The reviewer reads these by run id.
   - the PR body asks for a merge commit (§2 item 6) and carries the C=994 disclosure with the reviewer's N-3 fix. I did not read the PR body.

   Already recorded:
   - `merge: merge-commit` (`PLAN.yaml:3426`);
   - note 2, in the PLAN summary and round 35, item 1.

   After the click:
   - the closing record carries the note 2 line (see N5);
   - the `AUTONOMY.md` section is appended after whatever section is last at that time: §28 on main now;
   - E3 recorded by the custodian.
4. **§8 on the delta.**

| Item | Result |
|---|---|
| 1 | n/a: C1 is untouched. |
| 2 | Pass: no `.rs`. The reviewer confirms by diff. |
| 3 | **FAIL (S1-2).** |
| 4 | Pass: only comments changed; triggers, paths, permissions, actions and commands read as at gate 1. |
| 5 | Pass. |
| 6 | Pass. |
| 7 | Pass, read as an append. The reviewer proves 0 deletions in the form against a0f0da7. The header holds no cite. |
| 8 | Pass: the blame file is untouched. |
| 9 | Open: P1 at merge. |
| 10 | Open until the click. The key is set; no force-push is visible. |
| 11 | Pass on the text. The reviewer checks the commit messages. |
| 12 | Pass. |
| 13 | **FAIL (S1-1).** |
| 14 | Pass: the pin is on main, there is no ledger line cite, no bare self-line and no reproduced text, the index is present and the first line says post-result. N3 is a nit. |

No ADR skeleton is needed. The missing decision is the human's §8 item 3 ruling, which is not an ADR.

Files:
- C:/dev/wt/workspace-rustfmt/WORKSPACE-RUSTFMT-PREREGISTRATION.md
- C:/dev/wt/workspace-rustfmt/.github/workflows/rust-fmt.yml
- C:/dev/spatial-ide/scripts/hooks/EXPOSURE-SCAN-CI-BACKSTOP-PREREGISTRATION.md
- C:/dev/spatial-ide/state/consults/gates/2026-10-02-workspace-rustfmt-i4-architect-ruling.md
- C:/dev/spatial-ide/state/consults/gates/2026-10-02-workspace-rustfmt-gate1-reviewer.md
- C:/dev/spatial-ide/state/directives/2026-10-02-rustfmt-notes.md
- C:/dev/spatial-ide/PLAN.yaml
