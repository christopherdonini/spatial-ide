*Filed by the custodian: the worker's hand-back (claude-sonnet-5-5), 6250 bytes, sha256 42fffd58cdbc83f63d3e6ace6136fb4a7ddfe5d96e67f909ffc4b9ba586534fa, below the rule, byte for byte, nothing masked, with one final newline added. Calls Read 2, Bash 21, Write 2, Edit 1, SubagentHandback 1, none errored, from 2026-11-19T18:36:55Z to 18:41:52Z by its transcript. It applied the 1c form's Amendment 47 on PR 339's branch and pushed 4b8d67023461320c44f5ef70631d5057133eab6d.*

---

Built: b2-piece-1c-save-and-reopen P3b-1, Amendment 47, worker

Start: worktree C:/dev/wt/1c-p3b-1, branch cut/b2-piece-1c-p3b-1, HEAD 70335c37eacc479347f811f6332ab197c3cec593, porcelain empty. After fetch, origin/main has Amendment 47 and the ruling file.

Commit: 4b8d67023461320c44f5ef70631d5057133eab6d
"fix: close_dataset starts the lock's release with a thread builder and logs a refused thread; four doc texts (1c P3b-1, Amendment 47)"
Pushed head (ls-remote): 4b8d67023461320c44f5ef70631d5057133eab6d. Porcelain is empty after the commit.

Item 4 diff, byte-copied (the eprintln text came from the ruling's fence by script):
-        std::thread::spawn(move || projects.release_ended());
+        if let Err(e) = std::thread::Builder::new().spawn(move || projects.release_ended()) {
+            eprintln!("[spatial-ide-shell] the project lock's release thread did not start: {e}");
+        }

The four texts, old and new, byte-copied from the script's output (the script's own first run had written item 4 and then stopped on a locate bug, so the rerun printed "item4 already applied"):
5(a) OLD: (`close_dataset` alone starts a second call, [`Projects::release_ended`], after the host's close)
5(a) NEW: (`close_dataset` also starts [`Projects::release_ended`], after the host's close)
5(b) OLD: After the host's close, whatever its result, [`Projects::release_ended`] is started on a thread of its own, which this command does not wait for: it frees the project lock of each open that the catalog no longer holds or whose session has ended, and it may first wait for a save in flight. So when this command replies, the lock can still be held, for as long as that save takes. A reopen in this process is not affected, since `open_project` runs `release_ended` itself before it takes a lock; a reopen from another process in that time is refused as already open.
5(b) NEW: After the host's close, whatever its result, and when there is a [`Projects`] (see `save_project` below), this command hands [`Projects::release_ended`] to a thread of its own and does not wait for it. That call frees the project lock of each open that the catalog no longer holds or whose session has ended. It may first wait for a save in flight, or for anything else that holds the same mutex in [`Projects`]. So when this command replies, the lock can still be held, until that thread has run the call. If the thread cannot be started, the error is logged and nothing is freed then: the lock is freed by a later close or reopen in this process. A reopen in this process is not affected, since `open_project` runs `release_ended` itself before it takes a lock; a reopen from another process in that time is refused as already open.
5(c) OLD: `close_dataset` frees the open's project lock: after the host has closed the dataset, it has [`Projects::release_ended`] run on another thread and does not wait for it.
5(c) NEW: `close_dataset` frees the open's project lock: after the host has closed the dataset, it hands [`Projects::release_ended`] to another thread and does not wait for it; `close_dataset`'s own doc has the cases.
5(d) OLD: so a save in progress ends before its entry is dropped: until then the lock is held, after `close_dataset` has replied. A `record_step` that passed its live check before the session ended can still write after this frees the lock, and after another process has taken it.
5(d) NEW: so a save in progress ends before its entry is dropped. After `close_dataset` has replied, the lock is therefore still held until this call has run, and it waits for whatever holds that mutex: a save, a reopen as it keeps its entry, or another call of this function. A `record_step` that passed its checks before the open was closed or its session ended can still write after this frees the lock, and after another process has taken it.
Each old text was found exactly once. Lines are rewrapped at 100 columns from the changed line on, then `cargo fmt` (src-tauri) and `cargo fmt -p spatial-kernel` both rc 0. The full `git diff` was shown before the commit.

Runs at 4b8d6702, each in a shared hold, background:
- src-tauri `cargo test --locked`: rc 0. 76 passed in one suite, 2 passed in sole_caller_scan, the rest 0-test suites; 0 failed.
- src-tauri `cargo clippy --locked --all-targets`: rc 0. Warnings: commands.rs:348 and commands.rs:600 (too_many_arguments, 9/7, both stay) and publish.rs:359 (large size difference, stays). None sits in a hunk I changed.
- `cargo fmt --check` in src-tauri: rc 0. `cargo fmt --all --check` at the root: rc 0.
- Kernel: `git diff -U0 70335c37 HEAD -- kernel` has 0 `+`/`-` lines that are not comment lines. The only kernel change is the `release_ended` doc in kernel/src/project/mod.rs. No kernel run.

Counts, §2.11's command with B = 99cceff7 and H = 4b8d6702, both columns summed per group, against item 6:
- kernel product: mod.rs 51+9, store.rs 5+4, session_history.rs 16+7 = 92, against 100.
- kernel tests: no_generation_in_persisted_artifacts.rs 4+2, project_reopen.rs 114+0, project_save.rs 114+0 = 234, against 240.
- src-tauri: commands.rs 24+7 = 31, against 40.
- Total of the three groups 357, against 380. No ceiling is exceeded.
- The command's output also lists non-group files: KNOWN-LIMITATIONS.md 15/11, governance and state records, the form's +113, and the consults and directives.
- Lock files: `git diff --quiet B...HEAD -- Cargo.lock frontends/shell/src-tauri/Cargo.lock` rc 0.

Not named by the brief: my script's first run applied item 4 and then stopped on a locate bug (it broke after its first non-matching line). I fixed the script and made item 4 idempotent. The scratch script, its outputs, the form and ruling copies, and the hold task outputs are in the scratchpad under 1cp3b1d- names.
Noticed, not done: nothing off-scope.
Hold lines masked: the hold lines read `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:<pid> also=<m>`, for both holds. The release lines read `MACHINE_RELEASED project=<m> ... affinity=FF (cores 0-7)`. No MACHINE_WAITING or MACHINE_ERROR lines, and no exit code 96 to 99.
No background process of mine is still running.
Model: Sonnet 5.5 (claude-sonnet-5-5) as the harness reports it. No override and no context handoff.
