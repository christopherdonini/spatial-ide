*Filed by the custodian: the worker-high's hand-back (claude-opus-5-5), 4108 bytes, sha256 d5e925a41b40f64e920cf7bfc575a2d9eae42b71ddacab2dc8998de5c934601f, below the rule, byte for byte with one final newline added. Calls Read 9, Bash 17, SubagentHandback 1, none errored, from 2026-11-19T14:38:12Z to 14:41:46Z by its transcript. It stopped at item 20's P-2 read before any code and committed nothing; ADV-2026-11-19-24 (`state/directives/2026-11-19-advisor-ruling-adv-2026-11-19-24-p3b-1s-stop-at-p-2-rightly-taken-option-a-the-checks-under-the-saved-mutex-k-o28-the-ceilings-restated.md`) rules the stop and the 1c form's Amendment 44 declares the remedy.*

---

Built: b2-piece-1c-save-and-reopen P3b-1, worker-high. **I stopped at step 0, before writing any code.** The brief's sha256 is 61543851270ea72b0702e7e21de57785cdde719f1079fe969bd48d88246a8787, which matches. The worktree `C:/dev/wt/1c-p3b-1` is at HEAD c945a3097aff8db4face541a4d2917ec62583488 with an empty porcelain, both before and after.

**Step 0, the reading** (Amendment 43 item 20, P-2):
- **When the release happened before the request arrived, the command refuses both kinds.** In `Projects::save_project`, `check_version`, then `host.catalog().get(name)` gives `SkpError::unknown_dataset` for an open the catalog no longer holds. Then `require_live`, through `GenerationRegistry::live_generation`, refuses an ended open with the end's own code. `NotLive::Ended` comes from `invalidated`, and only `forget_dataset` clears it, at `SkpHost::close_dataset`. Both checks run before `self.save(...)`.
- **The stop: a timing window inside one request reaches the first-save path for both kinds.**
  - The command's two checks run before `Projects::save` takes the `saved` mutex.
  - The close case: a save passes both checks; then `SkpHost::close_dataset` returns, and the binding's planned `release_ended` drops the entry because the catalog no longer holds it. `Projects::save` then finds `known` = `None` and goes into the first-save branch.
  - The ended case: an end lands just after `require_live`, and a same-process `open_project` runs `release_ended` before the save takes the mutex. The save again takes the first-save branch.
  - What happens there: the shipped shell sends `folder: null` on a later save (`frontends/shell/src/project/saveProject.ts`, its module doc), so it is refused as `SaveFailure::FolderRequired` and writes nothing. That refusal's message, that the open has no project to save to, is untrue for this open.
  - An SKP client that sends a folder on a later save, which the protocol allows (a later save ignores `folder`), gets a newly minted identity and a first save into that folder, unless the folder already holds `project.spatial`.
  - This is a different outcome from the window item 6 names ("finish its writes"). On main it does not exist, because the entry is never dropped.
  - Possible remedies, for the advisor to choose; I did not build either: (a) a catalog and live check inside `Projects::save` under the `saved` mutex, so the save and `release_ended` happen one after the other; (b) accept the window and name it.
- **Callers of `Projects::save`:**
  - Product: one only, `Projects::save_project`. `save_project` in `commands.rs` reaches it only through that command, and the shell crate has no direct call.
  - Tests:
    - `no_generation_in_persisted_artifacts.rs`: `a_project_file_carries_no_generation_handle_session_reference_absolute_path_or_user_name`.
    - `project_lock_crash.rs`: `the_second_open_refusal_never_outlives_a_crash`.
    - `project_reopen.rs`: `save_closed`, `a_saved_project_reopens_with_its_data_claims_and_workspace`, `left_by_another_run`, K-O16, K-O18, K-O19, K-O20, K-O21 and K-O22's functions.
    - `project_save.rs`: 21 test functions, 26 calls, K-O17 and K-O24 among them.
    - `project_save_skp.rs`'s `rig.save` calls go through `save_project`, not `Projects::save`.
  - The session-end forwarder in `lib.rs` does not call `Projects`.

**Steps 1 to 6 did not run:**
- No commits and no push, since nothing was committed.
- No P-base or P-head runs, and no holds, so I have no hold lines to report.
- No mutations, no counts, no `pub` items, and no doc sentences placed.
- Item 13's three "not covered" rows are unchanged, because there is no new head.

Self-check: no code was written, so the four failure classes do not apply. No background process was started, and nothing was written outside the reads. Model: Opus 5.5 (claude-opus-5-5), with no override and no context handoff.

Decision for you: whether this in-request window counts as P-2's stop. If it doesn't, P3b-1 can be re-dispatched as briefed. If it does, the advisor rules on (a) or (b), and K-O26's added assertion may need a row that covers the window.
