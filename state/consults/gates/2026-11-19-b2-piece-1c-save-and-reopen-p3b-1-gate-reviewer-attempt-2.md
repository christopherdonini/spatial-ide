Reviewed: PR #339 at 4b8d67023461320c44f5ef70631d5057133eab6d (the custodian's filing note, 2026-11-19: the reviewer's second attempt at P3b-1, the changed lines alone under ADV-2026-11-19-29 item 8; Read 2, Bash 20, SubagentHandback 1, none errored, model claude-opus-5-5, from 2026-11-19T18:43:07Z to 18:48:14Z by its transcript; the report below byte for byte from its hand-back of 11471 bytes, sha256 23c29c67cde232cf5e9c6b2e7286ebf9a2310c8593731bbd7fc2a1a095a4afca, but for one masking by the custodian (one scratch-folder path as <S>), with this note in its first line and one final newline), gate, reviewer, attempt 2
Gate: PR #339, b2-piece-1c-save-and-reopen P3b-1, reviewer, attempt 2, at 4b8d67023461320c44f5ef70631d5057133eab6d
Verdict: PASS WITH NOTES

Reviewed: `cut/b2-piece-1c-p3b-1 @ 4b8d67023461320c44f5ef70631d5057133eab6d`. The parent is 70335c37eacc479347f811f6332ab197c3cec593. `git fetch -q origin` gave rc 0, and origin/main is ef6dde7c5eebdd6d703eb98588cd92e3f17a8271. At origin/main I read the form's Amendment 47 whole and §2.11, ADV-2026-11-19-29 whole, and both first-attempt reports. ADV-2026-11-19-29 is the advisor's ruling under the delegation, not the human's words. The worktree's porcelain was empty at the start and is empty at the end.

## 1. The diff
- `git diff --stat 70335c37 H` lists two files: `frontends/shell/src-tauri/src/commands.rs` (+24, −18 across both files) and `kernel/src/project/mod.rs` (10 lines). No other file changed.
- Under `kernel/`, `git diff -U0 70335c37 H -- kernel` has 10 `+`/`-` lines. **0 of them are not comment lines.** The pattern is `^[+-][[:space:]]*//`, and I self-tested it on one code line, which counted 1.
- Under `frontends/`, the only changed lines that are not comments are item 4's: one `-` line and three `+` lines.

## 2. Ruling item 4's code (commands.rs:138–146 at H)
- **The start.** `if let Err(e) = std::thread::Builder::new().spawn(move || projects.release_ended()) { eprintln!("[spatial-ide-shell] the project lock's release thread did not start: {e}"); }`. My script checks the log text against item 4 (b)'s fence, read from the filed ruling, and they are equal.
- **The command goes on.** On `Ok`, the `JoinHandle` is dropped and the thread is detached. On `Err`, the closure and its `Arc<Projects>` clone are dropped. That clone is not the last reference, because the managed `State` keeps one.
- **Nothing else changed.** `result` is still returned unchanged, and the pool-poll stop is unchanged. My script reduces both versions of the file to one form: comment lines joined, item 4's lines and the three doc spans replaced by tokens. At 70335c37 and at H the two forms are equal byte for byte.
- **No wait.** `Builder::spawn` does not join, and nothing in the change takes a lock on the main thread.
- **No panic from the start.** `Builder::spawn` panics only for a thread name that holds a NUL byte, and no name is set.
- **The log line can panic in one case** (N2). `eprintln!` panics if the write to stderr fails. This sits on the error branch only, the same as the emitter thread's `eprintln!` in `lib.rs`. On a packaged build stderr has no handle, and std treats that as a silent sink.
- **"Not covered" is true.** No `.rs` file under src-tauri names the log text, and no test calls `commands::close_dataset` (grep at H). Reaching the branch needs the operating system to refuse a thread.

## 3. Ruling item 5's four texts
My script `<S>/g339r2-fences.mjs` does this:
- it reads the five fences of the filed ruling from `git show origin/main:<ruling>`: 4 (b), then 5 (a) to (d);
- it joins the comment lines of both files at 70335c37 and at H;
- it finds each old span by the place item 5 gives.

The result was rc 0 and ALL-OK:
- **(a)** appears once in commands.rs at H, right after `serialize `, as the parenthesis that ends before ` — docs/02`.
- **(b)** appears once, as the whole paragraph that begins "After the host's close".
- **(c)** appears once, running from "`close_dataset` frees the open's project lock:" to the end of the paragraph in `save_project`'s doc.
- **(d)** appears once in mod.rs, from "so a save in progress ends" to the end of the doc. It is followed directly by `pub fn release_ended`.
- **Old texts.** No fence was present at 70335c37, and none of the four old texts is present at H.
- **No other word changed.** With the spans and item 4 replaced by tokens, both files are equal at 70335c37 and at H.
- **Line width.** No changed line is over 100 columns. The lines over 100 columns in either file are all outside the hunks.

## 4. Each clause at H
**(a)** "`close_dataset` also starts [`Projects::release_ended`], after the host's close": true. The thread is started at :141, after `state.close_dataset` at :139. The base sentence it sits in is ruled not this part's (Amendment 47 item 9).

**(b)**
- "After the host's close, whatever its result": true. The start does not depend on `result`.
- "and when there is a [`Projects`] (see `save_project` below)": true. The code is `if let Some(projects)`, and `save_project`'s doc says when `Projects` is `None`.
- "hands [`Projects::release_ended`] to a thread of its own and does not wait for it": true. It is a Builder spawn, and the handle is dropped.
- "That call frees the project lock of each open that the catalog no longer holds or whose session has ended": true. `retain(catalog.get().is_some() && require_live().is_ok())` drops each `SavedProject`, and with it the `_lock: ProjectLock` it owns (mod.rs:126–139). `Drop for ProjectLock` is at store.rs:255.
- "It may first wait for a save in flight, or for anything else that holds the same mutex in [`Projects`]": true. `Projects` has one mutex, `saved`. It is taken at :248 (`release_ended`), :292 (`save`) and :818 (`open_project`'s push). See N4.
- "So when this command replies, the lock can still be held, until that thread has run the call": true as an upper bound. See N3.
- "If the thread cannot be started, the error is logged and nothing is freed then": true. `eprintln!` runs and there is no release. See N1 on where the line goes.
- "the lock is freed by a later close or reopen in this process": true for both. A later close's thread sweeps every entry. `open_project` calls `release_ended` at :732. See N3.
- "A reopen in this process is not affected … a reopen from another process in that time is refused as already open": true and unchanged. The call is at :732, before `try_lock`, and `LockRefused::Held` becomes `OpenElsewhere` at :734.

**(c)** "frees the open's project lock: after the host has closed the dataset, it hands … to another thread and does not wait for it; `close_dataset`'s own doc has the cases": true.

**(d)**
- "so a save in progress ends before its entry is dropped": true. `save` holds `saved` from :292 across its IO.
- "After `close_dataset` has replied, the lock is therefore still held until this call has run": true, subject to N3.
- "it waits for whatever holds that mutex: a save, a reopen as it keeps its entry, or another call of this function": true. These are exactly the three lock sites :292, :818 and :248.
- "A `record_step` that passed its checks before the open was closed or its session ended can still write after this frees the lock, and after another process has taken it": true. `record_step` checks the catalog (session_history.rs:295) and `require_live` (:298) without `saved`, and then writes.

No clause is untrue. Nothing goes to the advisor as untrue.

## 5. Runs
- **Clippy, reproduced.** `cargo clippy --locked --all-targets` ran in `frontends/shell/src-tauri` at H, in one shared hold, with the brief's env. rc 0, log `<S>/g339r2-clippy-tauri.log`.
  - The build finished in 0.98 s. The worker's same-target build at H was current, so clippy's diagnostics were replayed from that cache.
  - There were 3 warnings: commands.rs:348 and :600, `too_many_arguments` (the first attempt's :344 and :596, moved by +4 lines), and publish.rs:359. None is in a changed hunk at H (15–18, 117–125, 141–143, 176–177). All three stay under ADV-2026-11-19-28 item 5. No finding.
- **fmt, reproduced.** Not in a hold (light). `cargo fmt --check` in src-tauri gave rc 0, and `cargo fmt --all --check` at the root gave rc 0.
- **Tests, reused.** I reused the worker's src-tauri `cargo test --locked`: rc 0, 76 + 2 passed, 0 failed. The worker's report ties it to 4b8d6702, and the change adds no test.
- **Kernel runs.** They stand under Amendment 47 item 7 by §1: every changed kernel line is a comment line.

## 6. Counts
I ran §2.11's command over B...H, B = 99cceff7, with the excludes set to the form's present path. B is an ancestor of H. Both numstat columns:

| Group | Files | Count | Ceiling (Amendment 47 item 6) |
|---|---|---|---|
| kernel product | mod.rs 51+9, store.rs 5+4, session_history.rs 16+7 | 92 | 100 |
| kernel tests | no_generation 4+2, project_reopen 114+0, project_save 114+0 | 234 | 240 |
| src-tauri | commands.rs 24+7 | 31 | 40 |
| total | 7 files | 357 | 380 |

`git diff --quiet B...H` on the three lock files gave rc 0. These counts equal the worker's.

## Findings

**Correctness:** none.

**Evidence:** none blocking at this gate.
- E-SAVE at H (Amendment 47 item 7) is not among the facts I was given. It belongs in the merge request's evidence, as item 8 says.

**Documentation (must-fix before the merge):** none.

**Notes** (none blocking; each case needs a thread refusal by the operating system, or timing inside one round trip):
- **N1, to the advisor, unreworded.** "the error is logged" means `eprintln!` only. It is not the shell's `SessionLog`. A packaged build has `windows_subsystem = "windows"` (main.rs:3) and no console, so an operator of the shipped app would not see the line unless stderr is redirected, as the e2e harness does. This matches the emitter thread's own logging and the ruled code. The branch is reached only by an operating-system refusal. Name it in the source comment if wanted.
- **N2.** `eprintln!` panics if the stderr write fails with an error other than an invalid handle, for example a closed pipe. That would be on the main thread, and only on the error branch.
- **N3.** Another call of `release_ended` can run before this one and free the lock first. That call can come from a second close's thread, or from `open_project` once it is bound. So (d)'s "still held until this call has run" holds as "until a call has run". (b)'s "can still be held, until" is unaffected. A lock left by a refused thread is also freed at process exit. `open_project` is not yet bound in the shipped build (P3b-2), so in the shipped app at H only a later close frees it. Each case is timing inside one round trip, or a later part.
- **N4.** `release_ended` also takes the catalog's read lock and the generations mutex, each inside its own method. Waits there are inside one request. The clause is about `saved` and stays true.

## Runs reused and reproduced
- **Reproduced at H:** the src-tauri clippy (in a hold), the src-tauri `cargo fmt --check`, the root `cargo fmt --all --check`, the fence and placement script, the kernel comment-line count, and §2.11's count.
- **Reused from the worker at H:** the src-tauri `cargo test --locked`. Under Amendment 47 item 7, the first attempt's kernel runs stand without a rerun.
- **The hold.** There was one hold, `-What "1c P3b-1 gate 2: src-tauri cargo clippy"`.
  - It printed `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:<pid> also=<m> (...)`, then `MACHINE_RELEASED project=<m> shell=bash.exe:<pid> affinity=FF (cores 0-7)`.
  - There was no MACHINE_WAITING or MACHINE_ERROR line, and no exit code from 96 to 99.
  - I made no mutations. No process I started is still running: the tasklist count of cargo or clippy-driver was 0.
- **Files:** `<S>/g339r2-fences.mjs`, `<S>/g339r2-kernel-lines.txt`, `<S>/g339r2-clippy-tauri.log` and `<S>/g339r2-form.md`, where `<S>` = `<S>`.

Model, as the harness reports it: Opus 5.5 (claude-opus-5-5).
