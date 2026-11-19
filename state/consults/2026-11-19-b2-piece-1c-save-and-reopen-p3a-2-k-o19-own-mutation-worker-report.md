*Filed by the custodian: the worker's hand-back (claude-sonnet-5-5), 4069 bytes, sha256 4d6d80ab75588d6d8cec0759a8c4127071b1770ec9b1aa07f77b205343eeb8d0, below the rule, byte for byte except: this project's name, four times in hold lines, written <m> (ADV-2026-11-18-07); one final newline added. Calls Bash 17, Write 1, Monitor 1, SubagentHandback 1, one errored (the Monitor call, which is not among its tools), from 2026-11-19T09:31:56Z to 09:35:14Z by its transcript. The run is Amendment 40 item 3's. It committed nothing; PR 337's head stayed at b5c351564dd4798fdd341e783b9d71b0054242e9.*

---

Run: b2-piece-1c-save-and-reopen P3a-2, K-O19's own mutation (Amendment 40 item 3), worker
Result: Both predictions held. K-O19 failed at its step (inside opacity_step, called from K-O19 at 1680), past the mark assertion. K-O18 failed inside its loop at project_reopen.rs:1655 with Withheld(NoStepRecorded). Mutation reverted, nothing committed.

Start checks: head b5c351564dd4798fdd341e783b9d71b0054242e9, porcelain empty, ls-remote same id.
Mutation diff: one added line in kernel/src/session_history.rs: `+            state.open(open).bound = Some(project.clone());` between the `let left` line and the `return Err`. Applied by node script <S>/1cp3a2m-mutate.mjs (refuses unless the anchor occurs exactly once; printed "applied").

K-O19: asked 2026-11-19T09:33:15Z. Hold: MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:27772 also=<m> (...); release: MACHINE_RELEASED project=<m> shell=bash.exe:27772 affinity=FF (cores 0-7). cargo rc=101.
 test result: FAILED. 0 passed; 1 failed; 0 ignored; 0 measured; 38 filtered out; finished in 0.34s
 thread 'the_first_step_after_that_save_meets_no_leftover_folder_and_has_a_record_of_its_own' (43256) panicked at kernel\tests\project_reopen.rs:610:40:
 recorded: SkpError { code: "skp.session_history_unwritable", message: "this step could not be written and flushed to the session history: the record folder: Cannot create a file when that file already exists. (os error 183)", fields: {"detail": "the record folder: Cannot create a file when that file already exists. (os error 183)"} }
 Backtrace: 4: project_reopen::Run::opacity_step / at .\tests\project_reopen.rs:610 ; 5: project_reopen::the_first_step_after_that_save_meets_no_leftover_folder_and_has_a_record_of_its_own / at .\tests\project_reopen.rs:1680 ; 6: ...::closure$0 / at .\tests\project_reopen.rs:1671
 My reading: matches prediction. The mark assertion passed (panic is not at it); failure is inside opacity_step called from K-O19's body, so it counts as failing at its step. The message is create's create_dir refusal on the existing record folder (os error 183), i.e. the Amendment 40 item 5 refusal was reached, no more.

K-O18: asked 2026-11-19T09:34:00Z. Hold: MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:75924 also=<m> (...); release: MACHINE_RELEASED project=<m> shell=bash.exe:75924 affinity=FF (cores 0-7). cargo rc=101.
 test result: FAILED. 0 passed; 1 failed; 0 ignored; 0 measured; 38 filtered out; finished in 0.32s
 thread 'a_save_after_a_reopen_with_no_step_whose_project_record_another_run_left_leaves_it_and_keeps_the_open_unbound' (18168) panicked at kernel\tests\project_reopen.rs:1655:9:
 Withheld(NoStepRecorded)
 Backtrace: 2: project_reopen::a_save_after_a_reopen_with_no_step_whose_project_record_another_run_left_leaves_it_and_keeps_the_open_unbound / at .\tests\project_reopen.rs:1655 ; 3: ...::closure$0 / at .\tests\project_reopen.rs:1645
 My reading: matches prediction. 1655 is `assert!(withheld_unwritable(&mark), "{mark:?}")` inside the `for _ in 0..2` loop; the mark is Withheld(NoStepRecorded), no longer the unwritable one. Neither message nor backtrace carries an iteration index, so they do NOT show the first save passed; that it passed is my inference (first save binds then refuses unwritable; second meets the bound open).

Revert: `git checkout -- kernel/src/session_history.rs`; git diff empty; `git diff --quiet` rc=0.
End state: head b5c351564dd4798fdd341e783b9d71b0054242e9, porcelain empty, no background shells running (all three exited; tasklist grep cargo = 0). Nothing committed or pushed; nothing written in the main checkout. Logs: <S>/1cp3a2m-ko19.log, <S>/1cp3a2m-ko18.log, stamps <S>/1cp3a2m-h1.asked, -h2.asked.
Off-scope noticed: none. No line ceiling met.
Self-check: no cross-module code written; each claim points to a log above; no user-facing messages added; K-O19 reached past its mark assertion to its step as intended.
Model: Sonnet 5.5 (claude-sonnet-5-5) as the harness reports; no override; no context handoff.
