*Custodian's filing note (2026-10-02): the reviewer's gate 2 on PR #157, for PLAN node `workspace-rustfmt`, full gating, scoped to the commits after c6d1414. Reviewed: cut/workspace-rustfmt @ 275d305abd62ef5d8ef181d19f1ee61be4074f3f (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b), transcribed from the hand-back message with the harness's two-space indent removed; the text below the rule is the agent's. Its branch-only `path:line` cites are read at 275d305. Verdict FAIL on S1-1, the same §7 file count as the architect's S1-1 (93 lines over 3 files by §7's own command at 275d305). I4 is cleared, with every check green at 275d305; the E1 candidate is Rust fmt pull_request run 37036923635 (rustfmt 1.10.0). S2-1: Amendment 1's superseded index misses §0's line that Governance CI does not trigger on this PR. P1 holds as observed now. Profile paths redacted at filing: none.*

---

VERDICT: FAIL. Reviewed `cut/workspace-rustfmt @ 275d305abd62ef5d8ef181d19f1ee61be4074f3f` (C1 6371d92, C2 c6d1414, merge base with main a0f0da7). PR #157, gate 2, reviewer.

I4 is cleared: every check passes at 275d305, and the shell run's merge ref includes e4e864e. C3 is comment-only and answers all three gate-1 findings. The one failure is in the record: by §7's own counting command the piece is now one file over its declared count, and that overrun is not recorded as class 8.

## Blocking (S1)

**S1-1. A §7 overrun in the file count, not recorded as class 8 (round 25, item 2 (a); `docs/PREREGISTRATION-TEMPLATE.md` class 8).**
- **What §7 declares.** The form's §7 "Size budget" line allows at most 120 lines over at most 2 files, counted by `git diff --numstat <C1> <head> -- . ':!PLAN.yaml' ':!CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**'`.
- **What that command gives at 275d305:**
  - `.git-blame-ignore-revs` 2/0
  - `.github/workflows/rust-fmt.yml` 80/0
  - `WORKSPACE-RUSTFMT-PREREGISTRATION.md` 11/0
  - Total: 93 lines over **3** files.
- **Why the worker's figure differs.** The worker's 82 (and CUT-STATE's "82 of 120") counts only the two named files. That is not what the command outputs: unlike its shape model, this command does not exclude the form itself. The model's command (`scripts/hooks/EXPOSURE-SCAN-CI-BACKSTOP-PREREGISTRATION.md:220`) does, with `':!scripts/hooks/EXPOSURE-SCAN-CI-BACKSTOP-PREREGISTRATION.md'`.
- **Where the extra file comes from.** Amendment 1 (27a6c94) put the form into the branch diff, and the lines are within budget. The I4 ruling (Conditions, §7) set the test itself: "No class 8 applies unless that count is exceeded… counted by its own command."
- **§8 item 3 reads the same way.** It blocks "Any commit after C1 touching a path other than §7's two files", and 27a6c94 touches the form. §10's own append-only amendments and §8 item 3 conflict on their face. The architect should rule whether an appended §10 amendment falls under §8 item 3.
- **Fix:**
  - append a class 8 amendment whose first line carries `budget overrun, §7 not edited`;
  - in it, record the declared 120 lines / 2 files and the final figure by the command at a named commit (that amendment adds its own lines to the form), with the reason: the counting command does not exclude the form;
  - leave §7 unedited.

## Should fix (S2)

**S2-1. Amendment 1 item 6 says "No line of this form is made false", but one is.**
- §0, "The verify tools and moved lines", last sub-bullet, says Governance CI "does not trigger on this PR". Once 27a6c94 put the form in the diff, `**/*PREREGISTRATION*.md` matched. Governance CI — plan, queue, site ran on the PR: run 37036923447, pull_request, 275d305, success.
- The effect is harmless (more checking, and it is green). But the superseded index should list that §0 line instead of "None".
- This can go in S1-1's amendment.

## Nits (N)

- **N-1.** The PR body's "What it is" lists only C1 and C2. It does not mention C3, Amendment 1, or the wait for #158. Nothing in it contradicts the head:
  - "committed before any code at 7b45af8": 7b45af8 adds the form and is on main;
  - "Another 32 are hash-pinned and unaffected": present as asked;
  - "verify-cites and verify-quotes stay green": true at 275d305;
  - the worker report exists on main.
- **N-2.** The I4 ruling's Conditions list cites §0's omissions as "the gate-1 reviewer's S2-2", and CUT-STATE repeats it. The right finding is S2-1, which Amendment 1 item 3 correctly uses. No action on the branch.
- **N-3.** The C3 header says "E1, is this piece's pull_request run" and drops §4's "green at the head marked ready". This is not presented as a quote, so it is acceptable.

## Checks

**1. C1 and C2 are unchanged.**
- `git diff c6d1414 275d305 --stat` shows only `.github/workflows/rust-fmt.yml` (+6/−5) and the form (+11).
- 27a6c94 touches only the form, and 275d305 touches only rust-fmt.yml.
- No `.rs` file changed after C1, so my gate-1 F4 reproduction (tree ba3aa32) carries forward.

**2. C3 is comment-only.**
- Every changed line of rust-fmt.yml starts with `#`. A grep for changed lines not starting with `#` found none, so no key, step, `run` or `on` changed.
- **"Why ubuntu-latest" section:**
  - H1 is scoped to ubuntu-latest against the Windows reference profile;
  - it names E1 as this piece's pull_request run, not "the first run";
  - "every platform" and "one formatter" are gone.
- **"What it does not mean" section:**
  - "this file claims nothing about whether the check is required for merge" (gate-1 architect N1, my S2-2);
  - the label `May not claim` is unquoted;
  - the header contains no quotation marks.

**3. §7.** 93 lines over 3 files by the command at 275d305, against a ceiling of 120/2 (S1-1). Over the two named files only, it is 82, which is the worker's figure.

**4. Amendment 1.**
- **Item 1.**
  - Run 37006671393 is Product CI — shell, pull_request, headSha c6d1414, failure.
  - The pin `frontends/shell/src/publish/PublishPanel.test.ts:222 @ a0f0da7` resolves. Line 222 is the `FILTER_SCOPE_SENTENCE` regex line. Its sha256 over the LF line with a final `\n` (checked with tail -c 1) is 5085eb8f7e98fb63694f53793288104094ddb34fe6074b0d1478c051abe6c2e3, which matches.
  - a0f0da7 is the merge base of 275d305 and origin/main (b38696b) and is on main.
  - The file is unchanged a0f0da7..275d305.
- **Item 2.**
  - The ruling exists on main (f5c87b0).
  - #158 is MERGED with merge commit e4e864ec4d962eed78b1950a3e755f54a7956969.
  - "placed by question round 35" resolves to the round 35 RULED block, item 1.
  - "C3 touches rust-fmt.yml only" is true.
- **Item 3.** It is accurate in combination: my S2-1 names `PublishPanel.test.ts:221` and `:464` (both tests), and the I4 ruling's "text readers" list adds `surfaceCompleteness.test.ts`.
- **Item 4.** It is accurate to my S2-3 (CI rustfmt 1.10.0, local 1.9.0, E1 green, I6 does not fire).
- **Item 5.** PLAN.yaml on main reads `generation: 2` for workspace-rustfmt, bumped in fd48f98. `AUTONOMY.md` §15 is the generation rule.
- **Item 6.** Not right (S2-1).
- **Classes.** 1 and 2 fit: the amendment is post-result, its first line says so, and F6 is not edited. Class 8 is missing (S1-1).
- **Record cap.** The items are references plus the ruling's required content. There is no line cite into DECISIONS-PENDING.md, and the hash reference is at a main commit.

**5. I4 is cleared.** `gh pr checks 157` exits 0 and all 8 checks pass. Run ids, all at 275d305:
- Rust fmt, pull_request: **37036923635**, success. Both check steps succeeded. Version line: `rustfmt 1.10.0-stable (b940084d7e 2026-09-28)`. **This is the E1 candidate** (the PR is not draft).
- Rust fmt, push: 37036915017, success, rustfmt 1.10.0.
- Product CI — Rust: 37036923427, `cargo test --workspace (windows-latest)` success.
- Product CI — shell: 37036924042, success.
  - In "typecheck · build · vitest · cargo test", every step succeeded: the frontend, "Build and test the Tauri backend", and both release-profile checks.
  - The tauri build job succeeded.
  - The checkout log reads `HEAD is now at 53cd8f3 Merge 275d305… into e9430da…`, and e4e864e is an ancestor of e9430da.
- Exposure scan: 37036923560, success.
- DCO: 37036923432, success.
- Governance CI: 37036923447, success.

**6. P1, as observed now.**
- **(a) Open PRs:** only #157.
- **(b) Remote branches.** After `git fetch --prune`, these refs are ahead of main with `.rs` changes:
  - `cloud/wave1-A1`, `-A3`, `-A4`, `-A5`, `cloud/wave2-A1`, `-A2`, `-C`, `cloud/wave3-A`;
  - `cut/b1-close-nul-names`. Its two code commits are patch-equivalent in main (`git cherry` shows `-`), and it was rebranched as `-2` and merged.
  - All of these are named as kept record or evidence branches in CUT-STATE.
  - `origin/cut/stop-hook-stale-continuity` is 0 ahead of main.
- **(c) Worktrees:**
  - local `cut/stop-hook-stale-continuity` (8c96695, 2 unpushed commits) touches `AUTONOMY.md`, `scripts/hooks/README.md`, `hooks.test.mjs`, `session-resume.mjs`, `stop-queue.mjs`: **no `.rs`**;
  - `governance/verify-mutation-header-token` (87c11b0) has 0 `.rs`;
  - `C:/dev/wt/triage-a3-obs3` is detached at 31d7d34 (0 ahead). It holds untracked wave-1 reproduction `.rs` files dated 2026-09-26, recorded in CUT-STATE as kept reproductions, not work in progress.
- **Result:** no open Rust branch now. The custodian re-checks at merge.

**7. The PR body.** It reads "Another 32 are hash-pinned and unaffected". Otherwise see N-1.

**Exit codes on the branch at 275d305:**
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`: 0 (366 pass, 0 fail).
- verify-cites (522e448): 0, 1,073 files.
- verify-quotes (f9444a4): 0, 113 checked, 0 hash-reference errors.
- verify-test-claims (57c626f): 0, 463 claimed.
- `timeout 570 node scripts/plan/verify.mjs` (2607202): 0, PASS.
- verify-mutation (7d24ed1): not run in this scope; no test text changed.

**Profile paths and sign-off.** Neither new commit message or the diff contains a user-profile path, and both commits are signed off.

**State.** Nothing committed or edited, and the worktree porcelain is empty. My only repository-level action was `git fetch --prune origin`. Temp logs were deleted.

Files: `C:/dev/wt/workspace-rustfmt/WORKSPACE-RUSTFMT-PREREGISTRATION.md`, `C:/dev/wt/workspace-rustfmt/.github/workflows/rust-fmt.yml`, `C:/dev/spatial-ide/state/consults/gates/2026-10-02-workspace-rustfmt-i4-architect-ruling.md`, `C:/dev/spatial-ide/scripts/hooks/EXPOSURE-SCAN-CI-BACKSTOP-PREREGISTRATION.md`.
