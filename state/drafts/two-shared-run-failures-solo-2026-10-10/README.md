# Two shared-run failures, re-run alone, 2026-10-10 (the custodian, one exclusive hold)

Under the machine rule, a failure that may depend on timing, seen in a shared run, is not recorded as a failure; the custodian re-runs it alone. Both ran in one exclusive hold with nothing else of this session running.
- **`frontends/shell/src/notices/noticeDeterminism.test.ts`** at PR #203's head 44e6220d (`D:/wt/docb`). In PR #203's gate-1 reviewer run it timed out at vitest's 30 s while cargo waited on a package-cache lock under other builds' holds.
- **`spatial-engine --test filter_type_admission`** at f0fccfaf (`C:/dev/wt/reaim-base`, made for this run). In the re-aim's worker report 3 base run, `the_type_walk_agrees_with_the_binder_over_the_p0_matrix` failed with source-changed refusals under load.

**Outcome: both pass alone.**
- noticeDeterminism: 1 file and 1 test passed, rc 0. Vitest's own duration line reads 3.92s; that is not a claim.
- filter_type_admission: 3 passed and 0 failed, rc 0, the type-walk test among them.
- Each worktree was clean after its run.

The details are in each log and in the hold output. The bytes are the runs', with CRLF stored as LF, and the script copy has its scratch-folder path replaced by a placeholder.

- `hold-output.txt`: bd4b813677d95724595aa7daf104836afab846c8ff32b9d61911f0984b643975
- `notice-determinism.log.txt`: b943a078fa48bed29c5db512b2ffd4cd7825bb9183042b6123a6923911da6b5f
- `filter-type-admission.log.txt`: 25621ac76852670e89bafa3678d206ad132fd5300e3bf1dc9708ff91fca8ab3c
- `flaky-solo.sh.txt`: a003b2989b14137d1c81b4ca8318ed6f7bbf61ce1cdff5c663369aafa409258e
