Reviewed: PR #310 at f56d6efe8050324b1396e4b2d257f33061b31471 (the custodian's filing note, 2026-11-12: the single combined gate, the reviewer, PLAN node known-limitations-item-4-on-main-paragraph, the docs lane; below, the hand-back byte-identical, one final newline added)
Gate: known-limitations-item-4-on-main-paragraph, reviewer, at f56d6efe8050324b1396e4b2d257f33061b31471: PASS

Reviewed: cut/known-limitations-item-4-on-main-paragraph @ f56d6efe8050324b1396e4b2d257f33061b31471 (H), against base c85788f1b9f5d1deb34fec9f91bf5f47d699eb0e (origin/main after the fetch, and the merge-base of H).

**Setup** (every command exited 0)
- The brief's sha256 is c6a2ebe9d9a3f1179d0a33f2c1e159559fb1b3f0b6557b2690f3356425e904aa and it is 4800 bytes, which matches.
- `git fetch -q origin`: origin/main = HEAD of the main checkout = c85788f1b9f5d1deb34fec9f91bf5f47d699eb0e.
- The form, `governance/forms/root/KNOWN-LIMITATIONS-ITEM-4-ON-MAIN-PARAGRAPH-PREREGISTRATION.md`, has sha256 866571f23b8949b27929d9d9aa532ae66811aacc3e31dd3fc5d2f579587aaa59, both in the working tree and through `git show c85788f1…:<path>`. This matches.
- The worktree `C:/dev/wt/kl4`:
  - `git rev-parse HEAD` = f56d6efe8050324b1396e4b2d257f33061b31471.
  - The branch is `cut/known-limitations-item-4-on-main-paragraph`.
  - `git status --porcelain` printed 0 bytes, both before and after the checks.
  - `git ls-remote origin refs/heads/cut/known-limitations-item-4-on-main-paragraph` = f56d6efe8050324b1396e4b2d257f33061b31471.
- `git log c85788f1..H` shows one commit: f56d6efe, "docs: KNOWN-LIMITATIONS item 4's On-main paragraph in the human's words".
- `git diff c85788f1 H` is one hunk in `KNOWN-LIMITATIONS.md`: line 80 replaced, and nothing else.

**Check 1: Out-of-scope** (script `kl4-g-check1.sh` in `<S>`; rc=0, fail=0)
- `git diff --name-only origin/main...H` (rc 0) = `KNOWN-LIMITATIONS.md`. `git diff --name-only c85788f1 H` gives the same.
- `git diff --numstat c85788f1 H` (rc 0) = `1	1	KNOWN-LIMITATIONS.md`.
- Each clause holds:
  - no ADR file;
  - nothing under `protocol/`;
  - no code;
  - no test;
  - no string the app shows (no file under `frontends/` or `renderer/`).
- Each pattern was self-tested on a positive case first.
- The Out-of-scope line (§21d) names no §21a category as touched.

**Check 2: The words, byte for byte** (script `kl4-g-check2.mjs` in `<S>`; rc=0, fail=0)
- `KNOWN-LIMITATIONS.md` has 509 LF lines at both H and c85788f1, with no CR byte.
- Line 80 at H equals the single line in the form's §A `text` fence (the fence opens at form line 15): true.
- Line 80 at H equals three spaces plus the directive's line 25 with its first and last characters (both `"`) removed: true.
- The directive file is byte-identical at ad22478f and at H. At ad22478f:
  - line 25 sha256 = ce8f587d39783002fe502f3be6b4f73141cbce22d78b69d9791a7c070cf564b1;
  - line 23 = f6ccf4950c3ebeb3d3b8a1f1a7cd9da920f8b064776746ebe5622c901cef056f;
  - line 51 = 0aab0b02f3ecd063bee3821905eede887306b118cefab610319294f6faae956a.
  - All three match the form's Authority pins.
- Every other line of the file at H equals its line at c85788f1: no other line differs.
- Line 80 at H is 406 bytes:
  - sha256 with its LF: ff6dbce9bb743e1e67f40757a1cdff873f710cfc90120317389ae31343a0dc59 (a second check, `sed -n 80p | sha256sum`, gives the same);
  - sha256 without the LF: e3753b80684f1b113ee748ed9b4bb0791be3ad6c4fb514147d0057dbad8cbfa1.
  - The full hex dump is in `<S>/kl4-g-check2.out`.

**Check 3: The four sentences, clause by clause, against the code at H**
All cites are at f56d6efe. The worktree was clean at H, and the reads were made in it.

- **S1** ("Opening a file also clears the filter cards, not the filter alone."): **holds.**
  - **Opening a file clears the filter.**
    - `frontends/shell/src/workspace/workspaceState.ts:156`: a rebind sets `filter: null`.
    - `frontends/shell/src/workspace/workspaceState.ts:133`: the first open mints its view with `filter: null`.
    - `frontends/shell/src/App.tsx:1143-1168`: `handleAdmitted` runs on every successful open (first open and every reopen). It also resets `activeFilterRef` (`:1157-1159`) and dispatches `resource.admitted` (`:1168`).
  - **Opening a file clears the cards as well.**
    - `frontends/shell/src/workspace/workspaceState.ts:152-153`: the clauses (the filter cards; see `workspace/filterClauses.ts:63-86`) are removed on every rebind. That code does not depend on whether the key is the same.
  - The style is kept on an open (`workspaceState.ts:108-109`, `:156`). That is consistent with "not the filter alone", which names only the filter and its cards.

- **S2** ("Each filter you apply and each style change you commit is written to the session record item 43 describes."): **holds.**
  - **A filter you apply is recorded.**
    - `frontends/shell/src/App.tsx:1039-1048`: every filter commit, an Apply (`:1049-1052`) or a card change (`:2054`), enqueues one `filter.apply` step.
  - **A style change you commit is recorded.**
    - `frontends/shell/src/App.tsx:2025-2033`: one step per changed property, at each commit.
  - **The steps reach the record.**
    - `frontends/shell/src/App.tsx:857-866`: the queue sends `recordStep`.
    - `frontends/shell/src/workspace/stepRecorder.ts:49-76`: steps are sent in order.
    - `kernel/src/session_history.rs:222-268`: `record_step` creates the record at the first step for the file, and appends and flushes one line (`:264`).
  - **The record is item 43's.**
    - `kernel/src/session_history.rs:197-201`: `default_root` is `<data dir>/spatial-ide/sessions`.
  - The failure paths are in the Notes.

- **S3** ("Saving the project writes the filter, its cards, the style and the view to the project file."): **holds.**
  - **Saving has a product caller.**
    - `frontends/shell/src/App.tsx:2108-2112`: the Save control.
    - `frontends/shell/src/layout/StudioLayout.tsx:243`: the bar's `project.save` entry, wired at `App.tsx:2093`.
    - Both call `handleSaveProject` (`App.tsx:2067-2080`).
  - **The shell sends all four.**
    - `frontends/shell/src/project/saveProject.ts:77-84`: `workspaceOf` sends the filter, the clauses, the style and the view (centre and zoom).
  - **The kernel writes them to the file.**
    - `kernel/src/project/mod.rs:408-435`: `workspace_of` takes the filter, the clauses, the style and the view, and adds the view's space.
    - `kernel/src/project/mod.rs:276-282`: the `ProjectFile` carries that workspace.
    - `kernel/src/project/mod.rs:302`: the file is replaced.
  - **The project file is `project.spatial`.**
    - `kernel/src/project/mod.rs:54`: `PROJECT_FILE_NAME`.
  - The four members are also asserted by `frontends/shell/src/project/saveProject.test.ts:62-89`.

- **S4** ("Nothing yet restores a filter, a style or a view from that record or from a project file."): **holds.**
  - **Nothing restores from the session record.**
    - `kernel/src/session_history.rs:1097` is `recover`. A repository-wide Rust grep for `recover(` finds callers in `kernel/tests/` only (`project_save.rs`, `project_save_skp.rs`, `session_history.rs`, `session_history_crash.rs`, `record_step_crs.rs`, `record_step_match.rs`, `no_generation_in_persisted_artifacts.rs`). None is in kernel/src, src-tauri or protocol.
    - `kernel/src/session_history.rs:18-19` declares `recover` a producer ahead of its consumer.
    - The save's `mark_saved_here` (`kernel/src/session_history.rs:308-336`) compares the in-memory `reached` value (`:324`) and restores nothing.
  - **Nothing restores from a project file.**
    - The only product call of `read_project` is `kernel/src/project/mod.rs:266-271`. It is the later-save check, which refuses a kept lineage or a file the reader refuses. It feeds nothing back into the app.
    - A grep for `open.?project|openProject|project\.open|Open project|PROJECT_FILE_NAME|project\.spatial` over `kernel/src`, `frontends/shell/src`, `frontends/shell/src-tauri/src` and `protocol/skp/src` finds no open or load path for a project file.
    - The style kept across opens is in-memory view state (`workspaceState.ts:156`), not a restore from the record or from a file.

**Check 4: The cross-reference**: **holds.**
- Item 43 at H (`KNOWN-LIMITATIONS.md:436`) describes the per-machine file under `…\spatial-ide\sessions` that holds the filter text and the style values, which a normal close removes.
- That is the record `kernel/src/session_history.rs` writes:
  - `default_root`, `:197-201`;
  - `record_step`, `:222-268`;
  - `end_session`, `:340-347`, which removes the records a save moved as well (`adopt_project`, `:277-298`, moves a record within the same root).

**Check 5: Re-run at H, from the worktree root**
- `node scripts/plan/verify-cites.mjs`: rc=0, PASS, with 2904 files and 193 loose references advised. The advisories are pre-existing `state/drafts/` entries.
- `node scripts/plan/verify-quotes.mjs`: rc=0, PASS:
  - 155 checked, 124 verified, 30 baselined, 1 advisory;
  - 0 hash-reference errors, 2 hash-baselined;
  - 925 ruling cites resolved, 0 ruling-cite errors.
- The harness moved the verify call into the background after 180 s. Its exit (code 0) and both rc lines are in its output file.
- `gh pr checks 310`, read between 2026-11-12T16:08:42Z and 16:08:45Z, rc=0. Four checks, all pass:
  - every commit is signed off;
  - no profile path in the range;
  - ported-notices (×2).

**Blocking findings**: none.

**Notes** (none is an acceptance condition)
1. **S2's failure paths.** I read S2 as holding.
   - A step can fail to reach the record in three ways:
     - the queue is full at 64 waiting steps (`stepRecorder.ts:70-72`);
     - the kernel does not confirm the step (`stepRecorder.ts:56-57`);
     - the 32 MiB cap item 43 states.
   - Each is shown to the operator as a notice and logged (`App.tsx:860-864`), so none is silent.
   - The previous sentence had the same scope.
   - Recorded here for the source comment.
2. **When saving writes nothing.**
   - A save with no view from the canvas writes nothing (`saveProject.ts:96`).
   - A refused save writes no project file (`kernel/src/project/mod.rs:324`).
   - S3 describes a save that completes. I read it as holding.
3. **PLAN.yaml is not in the diff.** The form's Scope names `PLAN.yaml` as a second file, but the diff at H touches `KNOWN-LIMITATIONS.md` alone. This is within Scope, since Scope is a ceiling. If the node's record change is still to come in this PR, it lands after this gate's head.
4. **CI is partial and the PR is a draft.** `gh pr checks 310` lists only the four checks above. `gh pr view` showed the PR as a draft with head f56d6efe. Per Part 1 item 4, CI is a merge condition, not a dispatch condition.
5. **Item 2 does not apply.** Part 1 item 2 (WORDS-ONLY) never applies to the human's wording. No word is proposed.

**Clauses for the human**: none read as untrue.

**Deviations, disclosed**
- The Write tool was not available to me. I created both check scripts in `<S>` with a Bash heredoc instead, so nothing was written outside `<S>`.
- I made one network call the brief does not list: `gh pr view 310 --json headRefOid,headRefName,isDraft,state`, which is read-only.
- No tracked file was edited, and no commit, push, stash or PR action was made. The porcelain was empty after the checks.

**What I read**
- The brief.
- `state/directives/2026-11-05-main-architect-gate-rounds-part-1-rulings-review-packet-design-part-3-additions.md`, whole (Part 1, items 1-9).
- The form, whole.
- The 2026-11-12 directive, lines 20-27.
- At H:
  - `KNOWN-LIMITATIONS.md` lines 72-81 (item 4, whole), 128-137, 436-438 (item 43, whole) and 502-509;
  - `frontends/shell/src/project/saveProject.ts`, whole;
  - `frontends/shell/src/workspace/workspaceState.ts`, whole;
  - `frontends/shell/src/workspace/stepRecorder.ts`, whole;
  - `frontends/shell/src/App.tsx` lines 850-889, 1026-1053, 1120-1169 and 2010-2114;
  - `kernel/src/project/mod.rs` lines 100-453;
  - `kernel/src/session_history.rs` lines 1-30 and 196-355;
  - `frontends/shell/src/project/saveProject.test.ts` lines 59-108;
  - the greps named above.
- The outputs, all under `<S>`:
  - `kl4-g-check1.out`, `kl4-g-check2.out`, `kl4-g-diff.out`;
  - `kl4-g-cites.out` and `kl4-g-quotes.out` (0 bytes; the verify run's output was captured in the background task's file instead);
  - `kl4-g-checks.out`.

**Model**: Opus 5.5 (claude-opus-5-5), as the harness reports it.
