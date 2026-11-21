*Filed by the custodian: P5's applier (ADV-2026-11-21-06 items 8 to 21, the 1c form's Amendment 70), the hand-back of the worker (claude-sonnet-5-5), 3889 bytes, sha256 2fa13dfddfdc29be163bc8a18f2e1f6a07372625369da63f16344a53e71faff8, below the rule, with the scratch folder's path written as <S>. Its calls in the transcript, by unique call ids: Read 3, Bash 32, Write 3, Edit 17, Monitor 1, SubagentHandback 1; errored: 7 (Edit, Monitor). The custodian's script found each of the ruling's 27 fences of items 8 to 20 moved as ruled at 4f09194c and nothing outside the four files of P5's Scope.*

---

Built: the reopen's P5 words at 4f09194c44c84f8f4e09b9592f53bd35e98794c9
Result: ruling items 8 to 20 applied by script, items 4/10/62/69-75 comments written, shell verify passed, committed once and pushed once.

Start state: HEAD af3cd53cc8dff9e3022e309df5dd3f9b52556e3f, porcelain empty, ls-remote the same id.
Script: <S>/p5a-apply.mjs, sha256 bdb0945f116bece879e8a81f4b593dcaa3cec290925457f4ceb57893b14bc569. Output: 27 fences found, item 68 was last and no item 69 existed. Each old text occurred once. Each new fence text then occurs once in its file (the 18 lines printed).
Numstat (HEAD~1..HEAD): KNOWN-LIMITATIONS.md 35/7, MANUAL-WALKTHROUGH.md 12/4, surfaceRegistry.ts 2/2, kernel/README.md 1/1. Sum 64 changed lines, under 100.
Comments (via Edit, in KNOWN-LIMITATIONS.md): new 69-75, item 62 replaced (no line cites), clauses appended to the comments of items 4 (the second comment) and 10. Symbols were found by grep at H0 in:
- kernel/src/project/mod.rs: Projects::open_project and save, data_at, asks, history, Place, write_machine_file, open_error_of, OpenFailure::Cancelled and TargetRefused, Data::NotFound, SaveFailure::LineageNotKept, HistoryMark/Withheld, view_state.
- kernel/src/project/resolver.rs: judge, check_inside, CheckRefused.
- kernel/src/project/store.rs: projects_root, record_dir, mint_identity, ProjectLock::try_lock, LockRefused, KnownFolders::moved_to/with_same, locations_to_bytes, replace.
- kernel/src/project/file.rs: Lineage::NotKept.
- kernel/src/session_history.rs: StepRecorder::reopened/adopt_project/end_session, copy_under, read_lineage.
- kernel/src/skp.rs: open_under.
- engine/src/dataset.rs: cancellable. engine/src/app_dirs.rs: user_data_dir.
- protocol/skp/src/v0/error.rs: project_lineage_not_kept_by_this_version.
- frontends/shell/src-tauri/src/lib.rs: projects_root use.
- frontends/shell/src/project/: openProject.ts (reopenApply, lineagePlaces, reopenRefusalPlace), reopenNotices.ts, saveProject.ts, shownText.ts.
- frontends/shell/src/admission/AdmissionPanel.tsx, formatRefusal.ts; frontends/shell/src/console/ConsolePanel.tsx; frontends/shell/src/App.tsx (handleReopened, reopenViewRef).
No ruling, form or report is quoted; the form is cited by section.
Run (one shared hold, via p5a-run.sh): bundle-viewer npm ci rc=0, npm run build rc=0; shell npm ci rc=0, npm run verify rc=0. Vitest: Test Files 123 passed (123), Tests 1570 passed (1570); the node scripts test showed 7 pass, 0 fail.
Commit 4f09194c; push: af3cd53c..4f09194c cut/1c-p5-words -> cut/1c-p5-words. Porcelain empty after the commit.
Hold lines: MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:<m> also=<m>; MACHINE_RELEASED project=<m> shell=bash.exe:<m> affinity=FF (cores 0-7). No MACHINE_WAITING or MACHINE_ERROR line, exit 0.
Departures: (1) The hold's -MaxWaitMinutes was 8, not the brief's 120, so the wait stays shorter than the call's 600 s timeout, as the machine paragraph requires. (2) The hold's command was a script file (p5a-run.sh) running the four npm commands, because they run in two directories. (3) I waited with until-loops after the hold's own background notice. (4) The script put placeholder comment lines in new items 69-75, which the Edits replaced; none remain (grep count 0). (5) The first batch of six comment Edits failed (file not yet read); I re-issued them after reading.
Not verified (symbols rest on the drafter's (f) plus my greps, not a full reading): the exact clauses of item 62's long comment about Place and ProjectLock at an open, and judge's description in item 69's comment. The reviewer should read both.
Did not do: no edit to protocol/skp/SKP-V0.md; no write in k7-fix; no fetch, merge, amend or PR action.
Model: Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff.
