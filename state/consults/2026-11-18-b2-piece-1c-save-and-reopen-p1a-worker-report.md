Built: b2-piece-1c-save-and-reopen P1a, worker-high (the custodian's filing note, 2026-11-18: the worker-high, model claude-opus-5-5, its run 2026-11-16T06:54:55Z to 2026-11-18T08:33:27Z by its transcript, with no call from 2026-11-16T09:01:11Z to 2026-11-18T08:31:20Z while the usage limit stopped it; Read 25, Bash 85, Grep 5, Write 7, Edit 6, four errored; 7894 bytes, sha256 222031f8a2dab6738de83eb44ecdd077a3a2955910248ce57dd4166d12c28478; below byte for byte, with the scratch folder written as <S> in 1 place and the project's name in its hold lines as <m> in 4, with this note and one final newline)

P1a is built and pushed, and nothing stopped it. All five tests pass at the head, every mutation failed its test, the lines are under every ceiling, and the lock files are unchanged. The run was paused by the account's usage limit, but the mutations had already finished; details are under departures.

**Commits** on `cut/b2-piece-1c-p1a`, base bdc72f5fc78734d90f2b1979f3cc4cdc399a6a6f:
- fe162292d419ddc7c69cac5d4f8ac1b6e07ca029 `test: the reopen's P1a, T1 to T5 for the resolver's check_inside, before its code` (2026-11-16T06:58:19Z, pushed rc 0)
- 7e76347271780d20103bb3b4b36b8650a0967456 `feat: the reopen's P1a, the resolver's check_inside and its error type` (08:55:02Z)
- Pushed head: origin/cut/b2-piece-1c-p1a = 7e76347271780d20103bb3b4b36b8650a0967456 (second push rc 0 on 2026-11-18). Porcelain is empty. No PR opened.

**P-base**, run at fe162292 (the hold granted about 08:36Z):
- T1 to T4 (`--test project_resolver`): predicted a missing symbol. Observed E0432, unresolved imports `check_inside` and `CheckRefused`. rc 101.
- T5 (`--lib project::resolver`): predicted a missing symbol. Observed E0425 (`check_inside`) and E0433 (`CheckRefused`). rc 101.
- No test passed at its base.

**P-head**, at 7e763472:
- `--test project_resolver`: 4 passed, 0 failed, rc 0.
- `--lib project::resolver`: 1 passed, 192 filtered out, rc 0.
- `cargo fmt --check` (whole workspace): rc 0, no output.
- `verify-quotes --show-cites` on the 3 files: PASS, 0 checked.

**Mutations**, observed at head 7e763472 by `p1a-mutations.mjs`. Each was applied, its test run, the file restored, and `git diff --quiet` gave rc 0 after each; the final check was also rc 0.
- M1, the link check skipped: T1 FAILED. The junction as an intermediate came back `NotADirectory` instead of `ThroughLink`.
- M2, a missing segment treated as a directory: T2 FAILED (`NotARegularFile` instead of `Unresolvable "data/gone"`).
- M3, the kind check skipped: T3 FAILED (`Unresolvable` instead of `NotADirectory`).
- M4, the folder not canonicalized: T4 FAILED. The path kept `spelled\..` and had no `\\?\` prefix.
- M5, `in_canonical_form` not called: T5 FAILED (`FolderUnresolvable` for `data/NUL.parquet`).

**Counts** (§2.11's command, B = bdc72f5f, H = 7e763472), against item 5 (b):

| File or group | Added / deleted | Ceiling |
|---|---|---|
| `kernel/src/project/resolver.rs` | 95 / 1 | 130 |
| `kernel/src/dataset_ref.rs` | 1 / 1 | 5 |
| Kernel product group | 98 | 135 |
| `kernel/tests/project_resolver.rs` | 145 / 0 | 200 |
| P1a total | 243 lines, 3 files | 335 lines, 3 files |

- No overrun.
- Lock-file check: `git diff --quiet bdc72f5f...HEAD -- Cargo.lock frontends/shell/src-tauri/Cargo.lock` gave rc 0.

**Pre-committed producers.** There are two new `pub` items, `resolver::check_inside` and `resolver::CheckRefused`; the only other visibility change is `in_canonical_form` becoming `pub(crate)`.
- The doc comment on `check_inside` names its consumer, `Projects::open_project`'s data step in P3a. It names the seam's tests: K-R1, K-R2, K-R4, K-R3 as C-7 restates it (working name `a_device_name_or_trailing_dot_target_is_refused_at_read_before_any_open`), then E-REOPEN. It cites Amendment 30 item 5 (d) and ADV-2026-11-16-10 R2.
- The doc comment on `CheckRefused` points to `check_inside`'s and cites item 5 (d).
- Caller grep: they are used only in `resolver.rs` and `kernel/tests/project_resolver.rs`. There is no product caller, as pre-committed.

**Holds**, each giving the status read before, then the re-read after the grant (quiet, average, peaks-over-25, and whether a <m> hold showed):
1. About 07:01Z. Before: False / 23.8% / 13, none. After: False / 29.7% / 42, 3 holds. The checker exited 95, the hold was released and nothing ran.
2. 07:12Z. Before: False / 26.0% / 17, none. After: False / 25.0% / 16, 4 holds. Exit 95.
3. 07:19Z. Before: False / 28.2% / 30, none. After: False / 32.2% / 47, 4 holds. Exit 95.
4. 07:55Z. Before: False / 24.3% / 18, none. After: False / 34.0% / 35, 3 holds. Exit 95.
5. 08:35Z, the base run. Before: False / 26.8% / 26, none. After: False / 27.9% / 29, 1 hold (mine). Ran.
6. 08:55Z, the head run, with -MaxWaitMinutes 120 per your queue message. Before: False / 45.5% / 60, a <m> hold present. After: False / 68.9% / 60, 1 hold. Ran.
7. About 09:01Z, the mutations, -MaxWaitMinutes 120. No read before. After: False / 23.8% / 10, 1 hold. Ran.

- Status reads with a <m> hold present, where I waited instead of holding: 07:25Z (32.8% / 29), 07:31Z (25.7% / 27), 07:40Z (60.9% / 52), 08:03Z (44.7% / 53), 08:22Z (24.8% / 18).
- Every hold and release line carries `<m>`, MACHINE_WAITING included.
- No exit code 96 to 99. No heavy run started beside another hold of this project.

**Departures and gaps:**
- **The pause.** The run stopped on the account's usage limit (HTTP 429) at about 2026-11-16T09:07Z, after the mutation logs were written (09:06 to 09:07Z) and the hold had finished; it resumed 2026-11-18T08:31Z. On resuming I read that hold's output, found it complete and tied to 7e763472, and re-ran nothing. The only work after resuming was the counts, the checker and the push.
- **Repeated refusals.** Four holds were refused at the re-read (exit 95). The status read takes about 60 s, and holds taken during that time were not in it. Three times I waited longer than 120 s after a clear status (167, 221 and 193 s) to stop our requests landing at the same moment.
- **The head hold** was requested while a <m> hold showed, under your message that the script now queues and the status read is no longer required.
- **Harness.** The auto-mode classifier twice returned no verdict. On the first call I fell back to the Read tool; the second, a sleep, went through on its one retry. Neither was a refusal.
- **A variant not named in item 5 (a).** `CheckRefused` has a `FolderUnresolvable` variant, my addition, for a folder that cannot be canonicalized. It is not named in item 5 (a); it is part of the error type and adds no new `pub` item.
- **What T1 tests.** On Windows a junction can only point to a folder, so T1's "link as the final" case uses a folder link. M1 also shows that Windows reports a junction as neither a folder nor a file, so even with the link check skipped the walk never follows one; the symlink case runs only in CI, off Windows.
- **Not tested.** The cloud placeholder case is untested, as item 5 (c) declares; the closing amendment should name the gap.
- **Not done, as the brief says:** e2e or app-window runs, workspace-wide tests, clippy. N-10's comment on `in_canonical_form` is left for P3a.
- **Pre-gate self-check:**
  - The cross-module seam is written against the real `in_canonical_form` and `RefParseError` (`kernel/src/dataset_ref.rs`, the `in_canonical_form` fn and the `RefParseError` enum).
  - Each claim above points to a log in the scratchpad.
  - No user-facing message was added.
  - Each test reaches its assertion: each mutation's failure is an assertion panic, not a setup error.
- **Model:** Opus 5.5 (claude-opus-5-5), overriding worker.md's sonnet line under ADV-2026-11-16-06 item 5. No context handoff.
- **Processes:** none of mine is still running. Every background call finished with its notification, and each hold chain ran its release.

Files touched:
- C:/dev/wt/1c-p1a/kernel/src/project/resolver.rs
- C:/dev/wt/1c-p1a/kernel/src/dataset_ref.rs
- C:/dev/wt/1c-p1a/kernel/tests/project_resolver.rs

Everything is in <S>:
- the scripts: p1a-run-tests.mjs, p1a-mutations.mjs
- the base and head logs: p1a-base-integ.log, p1a-base-lib.log, p1a-head-integ.log, p1a-head-lib.log
- the mutation logs: p1a-mut-summary.txt and p1a-mut-M1.log to p1a-mut-M5.log
- the numstat output: p1a-numstat.txt
