*Filed by the custodian: the worker-high's hand-back (claude-opus-5-5), 9546 bytes, sha256 22f1e137b264b80a6019750d30603330bd1001e1526a9a5ebc96847224471c32, below the rule, byte for byte but for three maskings (two hold-line project values as <m>, one scratch-folder path as <S>), with one final newline added. Calls Bash 20, Edit 5, Write 4, Read 3, SubagentHandback 1, none errored, from 2026-11-19T17:22:31Z to 17:32:34Z by its transcript. The same worker-high continued under the 1c form's Amendment 46 (ADV-2026-11-19-28 item 7); its branch pushed at ff6bd07cb2378afab6838f826ba45148381e88e1. It reports one class 8 overrun (src-tauri 27 lines on a ceiling of 25), which goes to the advisor. The custodian then took main in by a signed-off merge at 70335c37eacc479347f811f6332ab197c3cec593, records only, and opened PR 339 in draft.*

---

Built: b2-piece-1c-save-and-reopen P3b-1, continued under Amendment 46, worker-high

The Amendment 46 work is done and pushed. All runs at the head pass, and both K-O26 mutations fail where the ruling predicted, so there is no new stop. The only problem is one class 8 overrun: src-tauri is at 27 lines against its 25 ceiling. I recorded it and changed nothing.

Before starting I checked the worktree: HEAD was 4bffa2b70d69d2d5d187164f4ba670647c9c3fd0 and the porcelain was empty. `git fetch origin` gave rc=0, and origin/main is d3522d779b18059f7c788bc2126ceb82e2626db7. I merged nothing. I read the ruling whole from `git show origin/main:<path>`, saved to `<S>/1cp3b1c-ruling.md` (8 fence lines, so 4 fences). I also read Amendment 46 whole.

## Commits
- 9ca20d5003386ddeb851a59706a5886beb43549f: test: K-O26 records its second mutation, release_ended dropping every entry (1c P3b-1)
  - This is a doc comment only, in `kernel/tests/project_reopen.rs`.
- ff6bd07cb2378afab6838f826ba45148381e88e1: fix: close_dataset starts the lock's release on another thread and does not wait for it (1c P3b-1)
  - Files: `frontends/shell/src-tauri/src/commands.rs`, `kernel/src/project/mod.rs` (doc only), and `kernel/src/project/store.rs` (comment lines only).

**Pushed head:** ff6bd07cb2378afab6838f826ba45148381e88e1. I pushed once with `git push origin cut/b2-piece-1c-p3b-1`, in its own call, rc=0 (`4bffa2b7..ff6bd07c`), and `origin/cut/b2-piece-1c-p3b-1` matches. No PR was opened.

## Runs at ff6bd07c (one hold for tests and clippy, one for the mutations)
- **Kernel tests:** `cargo test --locked -p spatial-kernel --lib` plus the focused targets gave rc=0, with no failures:

  | Target | Passed |
  |---|---|
  | lib | 193 (1 ignored) |
  | no_generation_in_persisted_artifacts | 9 |
  | project_lock_crash | 2 |
  | project_reopen | 43 |
  | project_save | 23 |
  | project_save_skp | 6 |
  | project_store | 5 |
  | session_history | 13 |
  | skp_admission | 10 |
  | skp_admission_remediation | 7 |
  | skp_cancel_terminal_without_credit | 2 |
  | skp_filter_cancellation | 1 |
  | skp_projection | 14 |

- **src-tauri tests:** `cargo test --locked` gave rc=0, 4 targets, 78 passed, 0 failed.
- **Kernel clippy:** `cargo clippy --locked -p spatial-kernel --all-targets` gave rc=0. Its warnings are the same set as before, and none is in a file this part changed.
- **src-tauri clippy:** `cargo clippy --locked --all-targets` gave rc=0 with 3 warnings:
  - two `too_many_arguments` warnings in commands.rs, now at lines 344 and 596 (the same two publish functions, moved by the new doc lines);
  - one `large_enum_variant` in publish.rs:359.
  - Under ruling item 5 these stay.
- **fmt:** `cargo fmt --check -p spatial-kernel` rc=0, `cargo fmt --all --check` rc=0, and src-tauri `cargo fmt --check` rc=0.

## K-O26's two mutations
I applied each with the script `<S>/1cp3b1c-mutate-ko26.mjs`, ran `--exact a_reopen_after_a_session_end_in_the_same_process_takes_the_lock`, then restored the file.

| Mutation | Result | Where it failed | Restored, `git diff --quiet` |
|---|---|---|---|
| KO26-1: `self.release_ended();` removed from `open_project` | rc=101, FAILED | `opened`, project_reopen.rs:763: `expected opened: Err(OpenElsewhere(ProjectUri("spatial://project/bcca...")))` | rc=0 |
| KO26-2: `saved.retain(\|s\| open(&s.dataset) && false);` (drops every entry) | rc=101, FAILED | the assertion named the control, project_reopen.rs:1901: `the control: Ok(Opened(Opened { project: ProjectUri("spatial://project/4feb..."), ...`, as predicted | rc=0 |

## Counts
§2.11's command, with B=99cceff7 and H=ff6bd07c, excluding `governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md`, both numstat columns:

| File | Added | Removed |
|---|---|---|
| frontends/shell/src-tauri/src/commands.rs | 20 | 7 |
| kernel/src/project/mod.rs | 49 | 9 |
| kernel/src/project/store.rs | 5 | 4 |
| kernel/src/session_history.rs | 16 | 7 |
| kernel/tests/no_generation_in_persisted_artifacts.rs | 4 | 2 |
| kernel/tests/project_reopen.rs | 114 | 0 |
| kernel/tests/project_save.rs | 114 | 0 |

| Group | Lines | Ceiling (item 6) |
|---|---|---|
| kernel product | 90 | 95 |
| kernel tests | 234 | 240 |
| src-tauri | **27** | **25** (over by 2) |
| total | 351 | 360 |

The src-tauri overrun is class 8. Under the ceilings rule I recorded it and did not cut or pack anything. The lines come from item 2 (b)'s doc and the two ruled doc texts. `git diff --quiet B...HEAD -- Cargo.lock frontends/shell/src-tauri/Cargo.lock` gave rc 0.

## Doc sentences (byte-copied from the diff)
The three ruled texts were applied by the script `<S>/1cp3b1c-docs.mjs`, which reads the four fences from the filed ruling. For each edit it checks that the old text is found exactly once in the joined paragraph, then rewraps at 100 columns from the changed line on. `session-end forwarder (P3b)` occurred once in store.rs. No other word changed.

- **Fence 1, the D4 sentence** (commands.rs):
  ```
  /// never dropped. `close_dataset` frees the open's project lock: after the host has closed the
  /// dataset, it has [`Projects::release_ended`] run on another thread and does not wait for it.
  ```
- **Fences 2 and 3, `ProjectLock`'s doc** (store.rs):
  ```
  /// a first save (P3a), and `Projects::release_ended` (P3b-1), which drops the lock of an open that
  /// is closed or whose session has ended; the binding has it run after the host's close of a
  /// dataset, and `open_project` calls it before it takes a lock. The seam's end-to-end tests are
  /// that row's: K-O4, K-O5, two named there by working name, E-SECOND and E-CRASH-UNLOCK. Its own
  /// test is T6, in `kernel/tests/project_lock_crash.rs`.
  ```
- **Fence 4, commands.rs's module doc:**
  ```
  //! **This file contains no logic** beyond decode → call one `SkpHost`/state method → serialize
  //! (`close_dataset` alone starts a second call, [`Projects::release_ended`], after the host's
  //! close) — docs/02's "frontends: clients only, no logic" applied to the Rust half of a client.
  //! `lib.rs` lists every command below in its `tauri::generate_handler!` call; adding one here
  //! without adding it there is a command JS can never reach, which is the reason there is exactly
  //! one list.
  ```
- **`close_dataset`'s doc, in my words** (item 2 (b)):
  ```
  /// After the host's close, whatever its result, [`Projects::release_ended`] is started on a thread
  /// of its own, which this command does not wait for: it frees the project lock of each open that
  /// the catalog no longer holds or whose session has ended, and it may first wait for a save in
  /// flight. So when this command replies, the lock can still be held, for as long as that save
  /// takes. A reopen in this process is not affected, since `open_project` runs `release_ended`
  /// itself before it takes a lock; a reopen from another process in that time is refused as already
  /// open.
  ```
  The code it describes:
  ```
      if let Some(projects) = projects.inner().clone() {
          std::thread::spawn(move || projects.release_ended());
  ```
  This replaces the direct `projects.release_ended()` call. The JoinHandle is dropped, so the command does not wait.
- **`release_ended`'s doc, in my words** (item 3 (d)):
  ```
      /// (`require_live`). The shell's `close_dataset` starts it on another thread after the host
      /// has closed the dataset and does not wait for it, and [`Projects::open_project`] calls it
      /// before it takes a lock. It takes the `saved` mutex before the catalog and the generations,
      /// as [`Projects::save`] does, so a save in progress ends before its entry is dropped: until
      /// then the lock is held, after `close_dataset` has replied. A `record_step` that passed its
      /// live check before the session ended can still write after this frees the lock, and after
      /// another process has taken it.
  ```
- **K-O26's doc, the second recorded mutation, in my words:**
  ```
  /// RECORDED MUTATION 2 (Amendment 46 item 1 (b)): `release_ended` drops every entry. Expected
  /// failure: the control's reopen, through the `Projects` that holds the lock while the open is
  /// live, frees that lock and replies `opened`, and this test fails at the assertion named the
  /// control.
  ```

## Departures and stops
- **No stop.**
- **Overrun:** the src-tauri class 8 overrun above.
- **Two commits instead of one test-before-code pair.** The test commit is doc only and passes on its own. It went first, its own commit, and both were pushed together in one push.
- **Not covered, as Amendment 46 item 2 (d) names:** the binding's hand-off. No test of this part reaches `close_dataset`.
- **Background processes:** none of mine is still running. Both holds and every task ended, and I killed nothing.

Model, as the harness reports it: Opus 5.5 (claude-opus-5-5), with no override.

Files:
- C:/dev/wt/1c-p3b-1/frontends/shell/src-tauri/src/commands.rs
- C:/dev/wt/1c-p3b-1/kernel/src/project/mod.rs
- C:/dev/wt/1c-p3b-1/kernel/src/project/store.rs
- C:/dev/wt/1c-p3b-1/kernel/tests/project_reopen.rs

Logs and scripts are in <S>/, named `1cp3b1c-*`.

Hold lines, masked: each hold printed `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:<pid> also=<m> (...)`, then `MACHINE_RELEASED project=<m> ... (cores 0-7)`. None gave an exit code from 96 to 99, a MACHINE_WAITING or a MACHINE_ERROR.
