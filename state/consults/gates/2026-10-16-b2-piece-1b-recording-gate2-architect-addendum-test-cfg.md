Answer to the custodian's question on PR #222, correction round 2 of 2 (the reviewer's E-1). Read-only; I wrote no file. The form is cited by section and item, from kernel/B2-1B-RECORDING-PREREGISTRATION.md on main.

**1. Yes, §8 item 8 covers a `#[cfg(windows)]` on a test function in `kernel/tests/`.**
- **The item:** it names any new `cfg` and limits it to no place. §8's heading says each item is checked on its own.
- **The two sources:** §2.3 gives the same rule in two places, the store-root bullet (No new `cfg`) and the closing bullet (No `cfg`). Both govern the product module. Neither narrows item 8's own text.
- **Precedent and the script do not change this:**
  - the precedent at slice_budgets.rs:141 belongs to another piece's form;
  - cfg-boundary.mjs dropping `tests/` is a tool behaviour, not this form's text.
- **Why the other reading fails:** where this form wanted an exception, it wrote one. §3 grants `LOCALAPPDATA` to the e2e app process by name. There is no such grant for a test `cfg`.
- **The consequence:** a `#[cfg(windows)]` test, and equally a `cfg!(windows)` macro, is a block-on-sight under item 8.

**2. The test can still be written, without a `cfg`.**
- Item 8 names `cfg`, not every platform check. The test needs no Windows-only Rust API: it calls `icacls` through `std::process::Command`, which compiles everywhere.
- **The form it takes:**
  - It is an ordinary `#[test]` in kernel/tests/session_history.rs, a path inside Scope (§2's kernel paths).
  - Its first line checks `std::env::consts::OS != "windows"` at runtime and returns early.
  - Its doc says, in words: on any other operating system it returns at once and proves nothing; the proof is CI's windows-latest job and a local Windows run.
  - Its name must not claim more than a Windows run proves. For example: `on_windows_a_record_whose_locations_write_is_denied_is_removed_and_the_root_is_empty`.
- **What it drives:** only product calls, `StepRecorder::new` and `record_step`. It adds no product option or path, so §8 item 9 holds.
- **The comment at session_history.rs:210-212**, which says no test drives the removal, is replaced by words naming this test and its seam: an inheritable deny-write ACE on the store root, so that `create_dir` succeeds and the `locations.json` write fails.
- **§7:** the added lines extend an overrun already recorded as class 8. They are recorded the same way, and §7 is not edited.

**3. What the test must do for safety and for proof.**
- **Scope of the ACE:**
  - Use a fresh scratch folder per test, made by the existing `scratch(..)` helper.
  - Create the store root inside it, and put the ACE on that root only, never on the scratch folder or anything above it.
  - The principal is the process's own user, the identity `whoami` prints. Never a group such as Everyone.
  - The rights are exactly `(OI)(CI)(WD)`. The deny must not include delete, so that the product's own `remove_dir_all` is what is under test.
- **No vacuous pass on Windows:**
  - Check `icacls`'s exit status when the ACE is applied. If `icacls` is missing or fails, the test fails by name; it never returns early.
- **A drop guard:**
  - Create it right after the ACE is applied.
  - Its `Drop` removes the ACE (for example `icacls <root> /remove:d <user>`, then `/reset` on the root), whether the test passes or panics.
  - After that, the scratch folder is removed as other tests remove theirs.
  - A failing run must leave nothing the next run or a person cannot delete.
- **Prove the intended failure point, then the cleanup:**
  - the refusal's code is `skp.session_history_unwritable`;
  - its `detail` names `locations.json`, which shows the failure came after `create_dir` and not before it;
  - then the store root holds no entry (the existing `records(..)` helper is empty).
- **The recorded mutation in the test's doc:** remove the `.inspect_err(|_| drop(std::fs::remove_dir_all(&dir)))` in `create`. Expected failure: the store root holds one `unsaved-` folder, and the test fails at its empty-root assertion.
  - The reviewer observed it at d2501969.
  - The worker observes it again at the round-2 head on Windows, with the commit id named in the test doc. A `verify-mutation` run is not called an observation (§8 item 13).
- **Nothing else:**
  - no `LOCALAPPDATA` and no new resolver (item 8);
  - no timing assertion (item 12);
  - the user name appears only on the `icacls` command line, never in a file the product writes (item 2 covers history lines and headers).

The form's passages relied on: §8's heading and its item 8 (and items 2, 9, 12 and 13 as named above); §2.3's store-root bullet and closing bullet; §3's opening paragraph; §2's kernel test paths; §7's class-8 rule.

My gate 2 report stands as delivered. NC-1 and ND-1 to ND-5 are unchanged by this answer.
