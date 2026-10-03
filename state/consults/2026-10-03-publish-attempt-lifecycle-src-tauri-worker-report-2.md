# Worker report 2 — publish-attempt-lifecycle-src-tauri, correction round 1 (2026-10-03)

*Custodian's filing note: the worker-high's hand-back on the correction-round-1 brief for PLAN node `publish-attempt-lifecycle-src-tauri`, after PR #163 merged (merge commit 4e3c8a8, head 4d92733) and both gate-1 reports returned FAIL. It is recorded verbatim with the harness's report indentation removed. It was dispatched before the 2026-10-03 trial directive, so it is a message hand-back. No rooted `path:line` cite needed de-rooting; nothing in the text is changed.*

*The custodian's checks: branch `cut/publish-attempt-lifecycle-src-tauri` at 0391787, read from origin: commits b125721, d0184eb and 0391787 above 4d92733; the worktree is clean.*

*Profile paths redacted at filing: none.*

---

## Hand-back (correction round 1)

Node 8 correction round 1 is done and pushed (plain push). The branch `cut/publish-attempt-lifecycle-src-tauri` was at 4d92733 on origin before I started and is now at 0391787. Every suite passed at each commit with rc 0, except one transient npm verify failure at the second commit, covered under "Suites" below. No PR opened; the worktree is clean.

**Commits**, each signed off and ending with the two attribution lines:
- `b125721 docs: KNOWN-LIMITATIONS 30 and R1 corrected after the gate-1 reports; comments that said too much or too little` covers items 1, 2 and 3. It changes docs and comments only.
- `d0184eb test: T4 joins the publish first and asserts the drain at a zero-length wait` is item 4.
- `0391787 test: M4 re-observed against the T4 that joins first; its recorded text is a paraphrase` is the M4 text fix (N2) and the recorded-mutation update.

**Item 3.** The comments sit at the `Authority` fallback in `execute_with_progress`, in `on_exit_requested`'s doc, in `DrainOutcome`'s doc, and in the prepare-key doc in `commands.rs`. The `commands.rs` doc now says the execute registers only when the key is absent and removes only its own key (`run_exclusive`).

**KNOWN-LIMITATIONS 30**, byte-copied from the file at 0391787:
```
30. **A publish interrupted by an exit the app does not drain can leave a hidden staging directory
    beside its destination, and the audit then shows the attempt with no outcome.** When the last
    window is closed while a publish is running, the app cancels it and waits for it to stop, for at
    most 30 seconds. If it stops within that time, the publish removes its own staging directory and
    the audit records an outcome of cancelled. The audit does not always record cancelled: a cancel
    that arrives after the publish's last cancel check lets the publish finish, and the audit then
    records its normal outcome. The app does not drain, and the publish is not cancelled, in these
    cases: the application menu's Quit on macOS, a SIGTERM, a logout or shutdown, and a forced kill
    or power loss. A separate case is a publish that has not stopped when the 30 seconds end. That
    publish was cancelled; it had not finished stopping, and the process exits anyway. After any of
    these a directory named `.<destination name>.staging-<hex>` can remain in the destination's parent
    folder; nothing removes it, and it is safe to delete. The audit then shows the attempt as its
    intent with no outcome, which `--audit-show` prints as "no outcome (interrupted?)", because the
    app cannot yet record "unknown" explicitly. Only Windows has been exercised. The Tauri shell has
    no support level on macOS or Linux (item 1). What follows is a reading of the pinned Tauri
    sources, not an observation: on macOS and Linux the app also quits when its last window closes;
    it does not follow macOS's convention of staying running.
    <!-- DRAFT wording for the human's sight, not the human's own wording (frontends/shell/PUBLISH-ATTEMPT-LIFECYCLE-SRC-TAURI-PREREGISTRATION.md §1 "May not claim", its last bullet and the paragraph beneath it; §2 item 4; §2 item 5's R3 table, its Exit rows). Authority: the 2026-10-03 exit-drain ruling, condition (b) (state/directives/2026-10-03-exit-drain-ruling.md); question round 40, item 1. The macOS and Linux sentence is the form's own "not verified" for those platforms (§2 item 5, R5), not a measurement. Round-1 revision (the correction round after the gate-1 reports on PR #163): the 30-second case is its own sentence and no longer in the list of exits where the publish is not cancelled; the cancel-after-last-check case is stated; the macOS and Linux sentence is marked as a reading of the source. -->
```
- The "(item 1)" cite assumes #162's item 1 text, which says the shell has no level off Windows. #162 is on main but not on this branch, so the cite resolves once the follow-up merges.
- On this branch, item 1 says "not built, not validated and not claimed".

**R1's changed lines in `frontends/shell/MANUAL-WALKTHROUGH.md`**, byte-copied:
- New "Before R1" bullet, line 1538. It reuses the walkthrough's existing Part F build command:
  `- Build `target\debug\publish-bundle.exe` if it is not yet built, as Part F says: run `cargo build -p spatial-kernel --bin publish-bundle` from `C:\dev\spatial-ide`. Step R1(iv) runs it.`
- Changed tail of row R1's step cell, line 1543. The rest of the row is unchanged:
  `A result of "no outcome (interrupted?)" together with a staging entry is the declared ceiling case (KNOWN-LIMITATIONS 30): record it as a deviation, never as a pass. If step 3's publish finished before the window could be closed, record that and repeat from step 2 with another fresh destination, closing the window while the phase line reads `verifying-source`, which re-hashes the whole source at any viewport. Row G9 is unchanged. |`

**M4 observation.** At commit d0184eb I replaced `cancel_all`'s body line with a comment and ran T4 alone: `cargo test ... --lib -- exit_requested_cancels`. It failed with rc 101, at its `Refused` let-else (`publish.rs:3099`). The panic message begins `got Some(Success {` and prints the publish's summary struct, so the publish ran to completion. I reverted it with `git checkout`, and `git status --porcelain` was empty.
- The recorded comment now names c92b17b and d0184eb, and describes the panic text as a paraphrase.
- It does not quote the payload, because the payload carries an absolute user-profile path.

**§7 figures**, by the form's command at head 0391787:
- Base ff57832: 675 insertions + 40 deletions = **715** over 5 files (overrun of 15 over 700, for the custodian to record as class 8). Before this round, at 4d92733, the figure was 694.
- The round's own figure against base 4d92733: 35 + 20 = **55**, over 4 files. The form's exclusions applied, and no file outside §7's five was touched.

**Suites**, run before each commit:

| Suite | b125721 | d0184eb | 0391787 |
|---|---|---|---|
| `cargo test ... --locked` | 0 | 0 | 0 |
| `cargo fmt ... -- --check` | 0 | 0 | 0 |
| `cargo check --release --locked` | 0 | 0 | 0 |
| `cargo check --release --locked --features measure-build` | 0 | 0 | 0 |
| `npm run verify` | 0 | 1, then 0 on rerun | 0 |
| `node --test` (plan + hooks) | 0 | 0 | 0 |
| `verify-cites`, `verify-quotes`, `verify-test-claims` | 0 | 0 | 0 |
| `verify.mjs` | 0 | 0 | 0 |
| `profile-path-scan --staged` and `--message` | 0 | 0 | 0 |

- The d0184eb npm failure was `noticeDeterminism.test.ts` timing out at 30 s on repeated "Blocking waiting for file lock on package cache" lines, so a cargo process outside my run held the package-cache lock. It is unrelated to the diff. I reran `npm run verify` alone before committing and it passed (72 files, 1096 tests; citation integrity 30 passed, 0 failed).
- `cargo test`: 65 lib tests and 2 `sole_caller_scan` tests passed. The node suite ran 408 tests. The checks were run before the commit that carries each change, and the scan results were taken with the staged diff and that commit's message file.

**Not done as briefed:**
- I could not read the reviewer's report from main when I started. I read it from `origin/main` after your message, and it matches the item list.
- I did not edit the form, did not touch the three routed items (late registration, Park/Settle under a panic, `run_exclusive`'s non-RAII removal), and did not launch the app.
- Not asked, so left alone: KL 30's "Only Windows has been exercised" stays as is. The architect's N1 calls it premature until R1 runs.

**Pre-gate self-check:**
- Cross-module code: none changed, comments only.
- Completion claims: each resolves to the commits and the M4 observation above.
- User-facing message: KL 30 and R1 describe code at this head; no UI string, Display or log line was added.
- Required tests: T4 reaches its intended assertions, shown by the M4 observation above.
- Model: Sonnet 5.5, run at the high-effort variant. No model override and no context handoff.

Files: `C:/dev/wt/publish-lifecycle/KNOWN-LIMITATIONS.md`, `C:/dev/wt/publish-lifecycle/frontends/shell/MANUAL-WALKTHROUGH.md`, `C:/dev/wt/publish-lifecycle/frontends/shell/src-tauri/src/publish.rs`, `C:/dev/wt/publish-lifecycle/frontends/shell/src-tauri/src/commands.rs`.
