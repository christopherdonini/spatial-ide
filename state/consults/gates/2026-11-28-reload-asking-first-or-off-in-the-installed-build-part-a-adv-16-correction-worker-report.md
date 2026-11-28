# The reload keys' Part A, the correction under ADV-2026-11-28-16: the worker's report, at f5b29d89 (node:reload-asking-first-or-off-in-the-installed-build@part-a-adv-16-correction-worker-report)

*Filed by the custodian. The worker (Sonnet) read main at fa848c52 in D:/wt/read-1128r and worked in D:/wt/keys on 5174676a, with its target in D:/wt/keys-target. By the facts script its records run from 2026-11-28T09:08:15Z to 2026-11-28T09:27:15Z, and 51 of its calls ran with the main checkout as its working folder, the shell's start folder. By its completion notice it took 1140192 ms and 52 tool uses. Its hand-back is below as received, with the harness indent removed: 7996 bytes, sha256 3cfc60be62b7a6b024fb069ff3bed0a7ac1da32e551a01264db89aa20132aa96. Its words are the worker's.*

---

Pushed head f5b29d895efaee76c9198d634ad574edc8b59f51 (one commit over 5174676a). Every step completed, no stops. The push runs at this head had not yet appeared in `gh run list` when I read it once, so none is reported at f5b29d89.

**Word changes** (applied by a node script that copies each Old and New from the two read parts; each Old counted exactly 1 before replacing)
- webview_chrome.rs C-1 pair 1: `-//! default context menus off; in a build with them, both browser settings are set to WebView2's own` / `+//! default context menus off; in a build with them, the context-menu setting is set to WebView2's own`
- webview_chrome.rs C-1 pair 2: `-/// any other build turns both off.` / `+/// any other build decides off for both. Without Part B, `Live` neither sets nor reads the key setting.`
- lib.rs D-1: `-// that case; the build's architect gate says whether this read still holds.` / `+// that case; the build's architect gate re-read it at 2.11.4: it holds.`
- webview_chrome.rs D-2: `-/// Only Windows has a WebView2 controller to reach.` / `+/// Only Windows has a WebView2 controller to reach. Off Windows, `setup()` therefore writes` and `+/// `webview-chrome not-applied` at `error` at each start; the shell's CI builds it on Windows only.`
- lib.rs RC-1: `-            // settings are set for this build and read back, and one session-log line says what was` / `+            // context-menu setting is set for this build and read back (Part A makes no call for the key` and `+            // setting), and one session-log line says what was`

**U-7**, in webview_chrome.rs's tests, at lines 329-352 of the committed file. Its doc comment is 3 lines.
```
    #[cfg(windows)]
    #[test]
    fn the_live_settings_of_part_a_alone_set_the_menu_off_and_read_the_keys_unread() {
        use std::cell::Cell;
        let menus = Cell::new(true);
        let set_menus = |on: bool| -> Result<(), ChromeError> {
            menus.set(on);
            Ok(())
        };
        let get_menus = || -> Result<bool, ChromeError> { Ok(menus.get()) };
        let mut live = Live {
            set_menus: &set_menus,
            get_menus: &get_menus,
        };
        let line = readback_line(&apply(&mut live, chrome_for(false)));
        assert_eq!(
            line,
            "webview-chrome context_menus=off accelerator_keys=unread"
        );
        assert!(!menus.get(), "the menu setter did not get false");
    }
```
`Live` is built from two closures with no product change. The asserted line occurs twice in the ruling's file (grep -c = 2).

**ADR and KNOWN-LIMITATIONS**
- ADR-037 appended: the ruling's first fence with `<n>`=1 and `<date>`=2026-11-28. A blank line separates it from the ADR's last line. The git diff shows additions only (27 added, 0 deleted). `verify:adr-index` passed with no change asked (35 ADRs).
  - The fence was taken by a node script.
  - Appended text sha256: a1700fa1d7c1cf82331bb9f82a115f2e137ec8d0c9d4603e9a8a7bdad041908e. It is the 26 lines after the blank, with LF, taken from the commit via git show.
  - The script's own hash of the replaced fence is the same value. That comparison is circular, since the script wrote both.
- KNOWN-LIMITATIONS item appended: the ruling's second and third fences with `NN`=84 and `<path>` replaced. A blank line separates it from item 75, and the diff shows 4 additions and 0 deletions. sha256 of the last 3 lines taken from the commit: deface39ce633015381b2162b5b82265de6022587a682c4830aaf0d7c9a48cb4. It equals the script's hash of the replaced fences.
- NN table (cr-01-nn-table.txt, 56 refs): highest number is 75 on this branch's HEAD and on origin/main. Unmerged origin branches reach 79 (several), 80 (shell-scale-display) and 83 (shell-migration-milestone-5-pr-b). The next unused number is 84.

**cfg-boundary: not touched.** After U-7, `node scripts/plan/cfg-boundary.mjs` still says "24 sites in 8 files, 0 outside every boundary", because the scanner skips test code. `node --test scripts/plan/cfg-boundary.test.mjs` passes 7 of 7.

**Step 6 runs** (logs cr-02 to cr-15 in D:/wt/keys-logs)
- `cargo fmt --all -- --check --color never` from the repo root: exit 0.
- `cargo fmt --manifest-path frontends/shell/src-tauri/Cargo.toml -- --check --color never`: exit 0.
- `cargo test --manifest-path frontends/shell/src-tauri/Cargo.toml --locked` from D:/wt/keys (the workflow's own command): exit 0. The lib suite is 103 passed, and the other result lines are 2 passed and 0 passed. U-7 ok.
- Clippy: no workflow in the repo runs it (grep), so I ran none. I also did not run product-ci-shell's two `cargo check --release` steps; the brief named fmt, clippy and test.
- `node --test` with the three governance-ci globs: exit 0, 623 tests, 623 pass, 0 fail.
- The remaining governance-ci steps, each its own command: verify:cites, verify:quotes, verify:test-claims, verify:plan, buildHealth smoke, queue --check, site --check, moved-map --check and forms-layout all printed PASS or "current" lines. The cfg-boundary job's command printed 24 sites, 0 outside.
- I did not keep those nine steps' individual exit codes. They ran as one chain whose only visible code was the last command's (0), so my evidence is their PASS lines. I did not read the task output file. buildHealth ran with `RUNNER_TEMP` set to a scratch folder and no token, and read anonymously.

**M-U7 at f5b29d89**
- Old: `fn accelerator_keys(&mut self) -> Result<bool, ChromeError> {\n        Err(ChromeError)\n    }`, which counted 1. New: the same with `Ok(true)` in place of `Err(ChromeError)`.
- Applied, I ran `cargo test --manifest-path frontends/shell/src-tauri/Cargo.toml --locked webview_chrome`. It exited 101 and U-7 was FAILED.
- Failing assertion at src\webview_chrome.rs:347:9: left `"webview-chrome context_menus=off accelerator_keys=on"`, right `"webview-chrome context_menus=off accelerator_keys=unread"`. The other 6 webview_chrome tests passed.
- Reverted with `git checkout --`, and `git status --porcelain` is empty.

**Count.** `git diff --numstat 5ce0525a...HEAD` at f5b29d89 gives 473 added and 2 deleted, 475 in total, over 7 files:
```
4 0 KNOWN-LIMITATIONS.md
27 0 docs/adr/ADR-037-main-window-page-lifecycle-and-kernel-held-opens.md
6 0 frontends/shell/e2e/README.md
41 0 frontends/shell/e2e/source-watch-idle.mjs
39 0 frontends/shell/src-tauri/src/lib.rs
353 0 frontends/shell/src-tauri/src/webview_chrome.rs
3 2 scripts/plan/cfg-boundary.test.mjs
```
I did not read §7's Counting command; I used the numstat as given.

**Push runs** (`gh run list --branch ... --limit 10`, read once, right after the push)
- At f5b29d89: none listed yet.
- The newest listed head is 5174676a: Ported notices (46114973284) and Governance CI (46114973221), both completed with success.
- Older runs at 8ba765d9 and bffb4a22 are also listed. Those include the failures already recorded in Amendment 8 (Governance CI at both heads, Rust fmt at bffb4a22).

**Pre-gate four classes**
- Cross-module seams: none touched. U-7 builds `Live` as `reach` does at webview_chrome.rs `reach`.
- Completion claims: each is backed by a log or by the M-U7 failure above.
- User-facing messages: the session-log line is unchanged. The ADR and KNOWN-LIMITATIONS texts are the ruling's bytes.
- Required tests: U-7 reaches its assertion, and M-U7 shows it failing at that assertion.

**Departures and notes**
- The cargo test ran from D:/wt/keys with `--manifest-path`, because the workflow's own command needs that path. The brief said to run it from src-tauri.
- `git commit -s` added the human's configured Signed-off-by trailer. It contains that email address, which I did not type.
- My first U-7 insertion lost its backticks in a doc comment; I repaired it before the commit.

**Model:** I run as Sonnet 5.5 with no override. I received no context handoff and produced none. Logs are in D:/wt/keys-logs (cr-01 to cr-16, cr-commit-msg.txt).

**State:** the branch is at f5b29d89 and equals origin's. `git status --porcelain` is empty.
