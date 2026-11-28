# The reload keys, the reviewer's build gate, the read part, at 5174676a (node:reload-asking-first-or-off-in-the-installed-build@build-gate-reviewer-read-part)

*Filed by the custodian at the report path its brief named. The reviewer (Opus) read main at 8cc4fdd8 in D:/wt/read-1128h and the head 5174676a in D:/wt/keys, and made its runs in D:/wt/keys-target. By the facts script its records run from 2026-11-28T07:08:09Z to 2026-11-28T08:12:11Z, and 71 of its calls ran with the main checkout as its working folder, the shell's start folder. By its completion notice it took 3842249 ms and 78 tool uses. It gives no verdict and no gate-log row. Its hand-back is below as received, with the harness indent removed: 22581 bytes, sha256 e8aeb1ab8bfc86868d890c8824b99a7aec1e8f5247bdf790c24469ad94b65198. Its words are the reviewer's.*

---

READ PART: cut/reload-asking-first-or-off-in-the-installed-build @ 5174676a3028238214cc1144a2d333ed82685d02. Main read at 8cc4fdd88f7367307ca5aebd80773baa3ad4a857 (D:/wt/read-1128h). This part gives no verdict and no gate-log row.

I read the form in the order you set: Amendment 11 first, then Amendments 10 down to 1, then the body. Each New that Amendments 2, 4, 5 and 6 apply is read in place of its Old. Nothing here is a quotation unless it is marked verbatim. Everything else is paraphrase. Logs I wrote are `D:/wt/keys-logs/rp-01` to `rp-17`. Disk at the start was C: 40992 MB and D: 26768 MB. At the end it was C: 41885 MB and D: 18026 MB. Every heavy run started only after a read of C: at or above 40960 MB. `D:/wt/keys-target` is 9006 MB (`du -sm`, inside a hold, after the last cargo run).

## Check 1. The diff against §2 and the amendments

`git -C D:/wt/keys diff --name-only 5ce0525a...5174676a` gives 5 paths: `frontends/shell/e2e/README.md`, `frontends/shell/e2e/source-watch-idle.mjs`, `frontends/shell/src-tauri/src/lib.rs`, `frontends/shell/src-tauri/src/webview_chrome.rs` and `scripts/plan/cfg-boundary.test.mjs`. `git merge-base 5ce0525a 5174676a` is 5ce0525a. `git log --oneline 5ce0525a..HEAD` gives the five commits you listed.

File by file:
- **`webview_chrome.rs` (new, 327 lines).** It has:
  - `chrome_for`;
  - the private `ChromeSettings` trait, with the module's own `ChromeError` (A3);
  - `apply`, `seen` and `readback_line`;
  - `log_entry` (EV-2's function);
  - `Live`, whose fields are closures, and whose key setter and getter return `Err` with no WebView2 call (A1, DOC-2, ADV-2026-11-28-05 item 1);
  - `reach`, under `cfg(windows)`;
  - the tests U-1 to U-6, under the names that D2 and EV-2 give.
  - Described by nothing in the form: the `cfg(not(windows))` stub of `reach` (`:178-182`) and the four `#[cfg(windows)]` lines (`:20`, `:125`, `:131`, `:155`). These are a code path inside a Scope file, not a scope addition. The code worker's report discloses them.
- **`lib.rs` (+38, 0 deletions).** Two hunks: `mod webview_chrome;` at `:34`, and the region at `:610-645`, after the measure-build block and before `Box::leak`. That is §2 item 2 with D3's words, plus the three not-applied sites ruled by ADV-2026-11-28-04 item 1 and the source comment ruled by ADV-2026-11-28-05 item 2. The `on_page_load` closure, the handler list and the measure-build block are not in the diff.
- **`source-watch-idle.mjs` (+41).** `WEBVIEW_CHROME_EXPECTED`, `webviewChromeLines()` and step `E1-webview-chrome-line`, straight after the mount gate and before W1. This matches E3, EV-1, EV-2's New 1 and DOC-A.
- **`e2e/README.md` (+6).** One new entry for E-1's step (DOC-1).
- **`cfg-boundary.test.mjs` (+3/-2).** The three expectations of Amendment 8 item 3 and nothing else.

Protected paths and additions:
- `git diff --stat 5ce0525a...5174676a -- frontends/shell/src-tauri/Cargo.toml frontends/shell/src-tauri/Cargo.lock frontends/shell/src-tauri/capabilities frontends/shell/src-tauri/tauri.conf.json Cargo.toml Cargo.lock | wc -c` printed `0`.
- A grep of the added lines for `tauri::command|generate_handler|invoke_handler|listen|addEventListener|TcpListener|bind\(|port|scheme|register_uri|capabilit` printed nothing. No command, listener, port, scheme or capability is added.

## Check 2. §7's count

B's Counting command is `git diff --numstat 5ce0525a...5174676a -- . ':!<form>' ':!governance/PLAN.yaml' ':!governance/CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**'`, summed with awk. It printed 6/0 README, 41/0 suite, 38/0 lib.rs, 327/0 webview_chrome.rs, 3/2 cfg-boundary test, and `TOTAL 417 5`.
- That is 417 lines over 5 files, against 330 lines and 10 files: 87 lines over, and within the file ceiling.
- Class 8 at the count is recorded in Amendments 7 and 9, and §7's line is unedited.

## Check 3. The caller rule (§10)

`grep -rn` over `src/` for the new items gives these product chains, all rooted in `setup()`:
- `lib.rs:616` calls `chrome_for`.
- `lib.rs:620` calls `log_entry` inside `note`. `note` is called at `:625` (no main window) and `:641` (`with_webview` returned `Err`), and inside the closure at `:638`.
- `lib.rs:638` calls `reach` inside the `with_webview` closure. `reach` builds `Live` (`webview_chrome.rs:171`) and calls `apply` (`:175`). `apply` calls `seen` (`:91-92`).
- `log_entry` calls `readback_line` (`:119`).
- The `cfg(not(windows))` `reach` is the same `:638` call when built off Windows.

No item is `pub` outside the crate: the hits are `pub(crate)` at `:25`, `:32`, `:59`, `:66`, `:116`, `:156` and `:180`. The fake is under `#[cfg(test)]` (`:184`). There is no test-only caller of any product item. The rule is met. §10's sentence names the chain incompletely; that is the architect's D-3, and I give no different words.

## Check 4. The mutations at the head (5174676a)

Method:
- Each mutation was applied by one `node -e` command that counts the occurrences of the Old text and exits 3 unless the count is 1. Each printed `applied, occurrences 1`.
- Each was run with `cargo test --locked --lib webview_chrome` in `src-tauri`, inside a shared hold. Each run exited 101.
- Each was reverted with `git -C D:/wt/keys checkout -- frontends/shell/src-tauri/src/webview_chrome.rs`, and `git status --porcelain` was then empty (`CLEAN`).
- No mutation failed to compile. Line numbers below are in the mutated file.
- This replaces §4's patch-file wording, as your brief orders. These runs are the observations of record at 5174676a.

| Mutation | Change | Its own test | Failed where | Also red |
|---|---|---|---|---|
| M-U1 (`rp-02`) | `chrome_for` returns on/on | U-1 | its assertion at `:251` (left on/on, right off/off) | U-2 `:272`, U-3 `:281`, U-5 `:310` |
| M-U2, Part A alone (`rp-03`) | the menu setter call removed from `apply` | U-2 | its assertion at `:270` (`calls.len()`, left 1, right 2) | U-5 `:309` |
| M-U3, E1's New (`rp-04`) | `apply` returns at once on a menu-setter `Err`, both fields `unread` | U-3 | its key-setter-called assertion at `:286`, message `the key setter was not called after the menu setter failed: [("context_menus", false)]` | none |
| M-U4, E2's New (`rp-05`) | `apply` fills the `Readback` from `chrome` | U-4 | its assertion at `:298` (left `on`/`off` expected, got `off off`) | U-6 `:322`, U-3 `:287` |
| M-U5 (`rp-06`) | the not-applied line at `info` | U-5 | its assertion at `:303` (left `("info", …)`, right `("error", …)`) | none |
| M-U6 (`rp-07`) | `Err(_) => Value::Off` | U-6 | its assertion at `:322` (left `context_menus=off`, right `unread`) | none |

Unobserved:
- Under M-U3, U-3's later read-back assertions are never reached.
- Under M-U2 and M-U5, U-5's later assertions are never reached.

The set of failing tests under each mutation is exactly the set the code worker reported at bffb4a22.

**M-E1** was not run. Read from `source-watch-idle.mjs` at the head:
- With no `webview-chrome` line, `found.lines.length !== 1` throws inside `runStep`, which pushes `status: "FAIL"` (`:332`).
- The `finally` block sets `process.exitCode = anyFail ? 1 : 0` (`:638-639`) and exits with it (`:673`).
- The suite has no VOID status anywhere, so M-E1 ends in exit 1.
- The worker's patch (`D:/wt/keys-logs/mut/M-E1.patch`) leaves `chrome` and `reach` unused. That gives warnings only: no `deny(warnings)` is in `lib.rs`, `Cargo.toml` or `.cargo/config.toml` (grep, nothing found).
- One caveat: a missing session-log folder, or a failed launch, also ends in exit 1. The run part should check that E1's FAIL note says `found 0`.

**A probe of my own** (not one of §4's mutations, for question (c); `rp-08`): `Live::accelerator_keys` made to return `Ok(true)`. `cargo test --locked --lib` printed `test result: ok. 102 passed; 0 failed`. No unit test reaches `Live`. Reverted, and `CLEAN`.

## Check 5. The suites at the head that start no app

| Suite | Log | Exit | Counts |
|---|---|---|---|
| `cargo test --locked` (src-tauri) | `rp-01` | 0 | lib 102 passed / 0 failed, main 0, `sole_caller_scan` 2 passed, doc 0 |
| `cargo fmt --check` | `rp-09` | 0 | — |
| `cargo clippy --locked --all-targets` | `rp-10` | 0 | one warning, "large size difference between variants" at `src\publish.rs:359`, reported for lib and lib test (1 duplicate); `publish.rs` is not in the diff, so no warning is in the piece's files |
| `npm run verify` (frontends/shell) | `rp-11` | 0 | Test Files 123 passed, Tests 1570 passed, then `76 passed, 0 failed` and `30 passed, 0 failed` |
| CI's `node --test` (plan, hooks, evidence) | `rp-12` | 0 | tests 623, pass 623, fail 0 |
| `verify-cites` | `rp-13` | 0 | PASS, 3965 files, 269 loose references advised |
| `verify-quotes` | `rp-14` | 0 | PASS, 173 checked, 142 verified, 30 baselined, 1 advisory, 0 hash-reference errors, 950 ruling cites resolved |
| `verify-test-claims` | `rp-15` | 0 | PASS, 1023 claimed tests across 306 files |
| `verify-mutation --base 5ce0525a --head HEAD` | `rp-16`, `rp-17` | 1 | FAIL, 6 of 6 new tests MISS (U-1 to U-6 at `webview_chrome.rs:250`, `:268`, `:277`, `:292`, `:302`, `:317`) |

On `verify-mutation`: the tool reads only a preregistration changed in the diff, or the changed test file. The form is on main, not in the diff, so the tool cannot see the mutations it records. This is a run, not an observation (§9 item 7; round 25 item 2 (c)). It is not a step of the Governance CI workflow.

How these runs were made:
- `rp-16` ran in the same hold as `verify-test-claims`.
- `rp-17` is a re-run of `verify-mutation` alone, about a second, outside a hold. I made it to get the exit code, which the combined call had echoed to a task output file I did not read.

Push runs, by `gh run list --branch cut/reload-asking-first-or-off-in-the-installed-build`:
- At 5174676a: Ported notices 46114973284 success; Governance CI 46114973221 success.
- At 8ba765d9: Product CI (shell) 46109593858, Ported notices 46109593813 and Rust fmt 46109593817 success; Governance CI 46109593852 failure.
- At bffb4a22: Rust fmt 46108184529 failure; Governance CI 46108184551 failure; Ported notices 46108184522 and Product CI (shell) 46108184587 success.

## Check 6. ADV-2026-11-28-09 item 5

**(c) Is E-1 alone enough for the line that a build with Part A alone writes?** Yes, for the seam rule, once its series is green. It has one gap, and I raise it as a suggestion, not a finding.
- `Live` carries no `debug_assertions` cfg. Its key stubs are the same code in the dev build and the installed build. So E-1's exact string `accelerator_keys=unread`, read from the real `with_webview` → `controller` → `CoreWebView2` → `Settings` path, proves the stub from the real shape.
- The installed line differs only in the decision (`chrome_for(false)`, U-1) and in the menu's real setter. That arm is the human's press (§4).
- The gap is my probe in check 4: a change that makes `Live` read the key passes all 102 lib tests. E-1 runs only at the port, not in any CI workflow. So between series nothing automated guards the Part-A-alone `unread`.
- A Windows-only unit test can build `Live` from two closures, call `apply` with `chrome_for(false)`, and assert `accelerator_keys=unread` with the key setter making no call. That test would be in Product CI (shell) (`cargo test`, `windows-2022`). It would add lines under class 8. Whether to add it is the advisor's call.

**(d) Sources 1, 3 and 4 of the worker's KNOWN-LIMITATIONS draft, clause by clause, against the diff:**
- **Source 1:**
  - `chrome_for` with both fields equal to `debug_build`: true (`:32-37`).
  - Called from `setup()` as `webview_chrome::chrome_for(cfg!(debug_assertions))`: true (`lib.rs:616`).
  - After the measure-build block and before `Box::leak`: true (`:610-645`, `Box::leak` at `:650`).
  - "from inside `window.with_webview(...)`": **untrue**. It is called at `:616`, before `get_webview_window` at `:624`, and its `Copy` value is moved into the closure. The architect found the same.
  - "whose closure calls `reach`": true (`:638`).
  - `reach` calls `SetAreDefaultContextMenusEnabled` through `apply`: true. The closure is at `:162-164`; `apply` reaches it through `Live::set_context_menus` (`:88`, `:133-135`). `bindings.rs:35015` is that setter (sed of webview2-com-sys 0.38.2).
  - It reads the setting back with `AreDefaultContextMenusEnabled`, `:35003`: true (`:165-170`, and the sed shows it at 35003).
- **Source 3:**
  - `Live`'s key setter and getter return the module's own error and make no WebView2 call: true (`:143-148`).
  - "`apply` reads that as `unread`": true for the getter (`seen`, `:96-101`); the setter's `Err` is dropped by `let _` (`:89`).
  - The installed build neither sets nor reads the setting: true.
  - Ctrl+R and F5 do what the runtime does when no setting is made: true of the code. wry sets the key setting only when the attribute is `false` (wry-0.55.1 `src/webview2/mod.rs:582-586`), and its default is `true` (`src/lib.rs:1687`, sed). What the runtime does with the keys is not observed, as the draft says.
- **Source 4:**
  - `log_entry` gives the read-back line at `info` and `webview-chrome not-applied` at `error`: true (`:116-121`).
  - Written by `setup()` through the managed `SessionLog`: true (`lib.rs:618-623`). `try_state::<SessionLog>()` finds it because `app.manage(session_log)` runs earlier, at `:530`.
  - The line form is `<ms> <level> <message>` (`state.rs`, `append`).

**(e) Where the lines over the ceiling are.**
- The ceiling is a total, so the 87 cannot be placed on particular lines. Against §7's estimates for the files built, they fall like this:

| File | Actual | Estimate | Breakdown |
|---|---|---|---|
| `webview_chrome.rs` | 327 | 190 | product `:1-183` is 183 lines, 64 of them comment or blank (awk); tests `:184-327` are 144 lines, six tests where §4 planned four |
| `lib.rs` | 38 | 12 | 1 `mod` line and a 37-line region, 14 of them comment lines (awk over `:610-646`) |
| `source-watch-idle.mjs` | 41 | 35 | — |
| `e2e/README.md` | 6 | 4 | — |
| `cfg-boundary.test.mjs` | 5 | no estimate | class 9 |

- Outside §2's plan as amended: only the `cfg(not(windows))` stub and its doc line (`:178-182`) and the four `#[cfg(windows)]` lines, 9 lines in all. Everything else traces to §2 with A1, A3, D2, D3, the -04 and -05 fences, DOC-1, DOC-2, EV-2 and E3. I agree with the architect's (e).
- Still to come, adding to the count: the ADR amendment and the KNOWN-LIMITATIONS item.

## Check 7. §9, Block on sight

1. **The posture stop.** Not met by this read. The diff adds no network call, socket, capability, config or Cargo change (check 1). It is the architect's to rule, and its read part says the stop is not engaged.
2. **A diff outside §7, or to a declared-unchanged path; a new command, listener, port, scheme or capability.** Untrue. All 5 paths are in Scope, and the declared-unchanged paths are untouched (check 1).
3. **A line of the `on_page_load` closure changed.** Untrue. The `lib.rs` hunks are only `:34` and `:610-645`, with 0 deletions.
4. **Part B, or a Cargo byte, before the approval.** Untrue. The Cargo stat is 0 bytes, and the key stubs make no call (`:143-148`).
5. **`unwrap`, `expect`, indexing or `eprintln!` on the apply path, or `setup()` failing on a failed `with_webview`; D5's bound on calls.** Untrue.
   - A grep of `:1-183` finds those words only in a doc comment (`:85-86`).
   - The only `unsafe` blocks wrap one binding call each (`:158`, `:163`, `:167`).
   - `ran.is_err()` is handled with no `?`, and `Ok(())` is at `:652`.
6. **A claim that a key or menu no longer reloads.** Untrue. `webview_chrome.rs:16-18` and the README's "What it proves not" make no such claim.
7. **A `verify-mutation` run called an observation; a mutation named without its commit.** Untrue.
   - The worker's report names bffb4a22 for its mutations.
   - This report names 5174676a for mine and calls the `verify-mutation` run a run.
8. **An overrun not recorded as class 8, or §7 edited to match; a scope addition not class 9 before its code.** Untrue.
   - Class 8 is in Amendments 7 and 9, and §7 is unedited.
   - `git log -S"## Amendment 8 "` on the form gives d3a5f891, committed 2026-11-28T06:49:35+01:00. That commit is an ancestor of origin/main (`merge-base --is-ancestor`, rc 0). 5174676a was committed at 07:04:59+01:00, after it.
9. **A hash at a branch commit, a bare self-line, or a test-text span named without its commit id.** Untrue. The only `:line` cites in the added lines are crate cites with no hash (`lib.rs:629`, `:634`).

## Check 8. The seams of §10

I checked each against the registry sources (tauri-2.11.5, tauri-runtime-wry-2.11.4 and webview2-com-sys-0.38.2, the versions the lock gives at `Cargo.lock:4476`, `:4694` and `:5611`):
- **`WebviewWindow::with_webview`** takes `FnOnce(PlatformWebview) + Send + 'static` and returns `crate::Result<()>` (`webview_window.rs:2371-2376`).
  - The runtime's `send_user_message` handles the message inline on the main thread and returns `Ok` (`lib.rs:239-248`).
  - The drop is the `if let` at `:3751`.
  - The call at `lib.rs:637-639` fits that shape.
- **`PlatformWebview::controller`** returns `ICoreWebView2Controller` with no `Result` (`mod.rs:177-184`), and is used that way (`:157`).
- **The bindings:**
  - `CoreWebView2` returns `windows_core::Result<ICoreWebView2>` (`:9175`, impl at `:8920`).
  - `Settings` returns `Result<ICoreWebView2Settings>` (`:1022`).
  - The getter takes `*mut windows_core::BOOL` and returns `Result<()>` (`:35003-35006`).
  - The setter takes `bool` and returns `Result<()>` (`:35015-35018`).
  - The code matches each.

The tests:
- U-1 to U-6 are present, green at the head (`rp-01`), and red under their own mutations (check 4).
- E-1 is present. It is the one end-to-end test from the real shape, and it has not been run; that is the run part's.
- `SessionLog::append(&self, &str, &str)` writes `{ms} {level} {message}`, which E-1's regex `^\d+ info (webview-chrome .*)$` matches.
- One thing only E-1's series can show: that calling `with_webview` inline from `setup()` does not panic at the runtime's `windows` borrow. The code compiles, but this read cannot rule a panic out.

## Check 9. The workers' departures

Code worker:
- Mutations observed at bffb4a22, not at its head: no result touched. My runs at 5174676a give the same failing sets.
- The §7 overrun not trimmed and not recorded: recorded by the custodian, so no result touched.
- No unit test for `Live`'s `unread`: this touches the evidence for the Part-A-alone key value, which rests on E-1 alone (check 6 (c)).
- The undeclared `cfg(not(windows))` stub, with CI's `node --test` not run: this did touch a result. Its five cfg forms turned Governance CI red at bffb4a22 and 8ba765d9 (Amendment 8 item 2). That result is now corrected: my run is 623/623, and run 46114973221 is green.
- Source 1 of its KNOWN-LIMITATIONS draft has one untrue clause (check 6 (d)).

cfg-boundary worker:
- It opened a task output file: no result touched.
- It lost four exit codes. For `verify-quotes` and `verify-test-claims`, my runs give exit 0 at the head. `verify.mjs` and `buildHealth` I did not re-run; the Governance CI push run 46114973221 at the head covers them.

## Findings

**RC-1 (Correctness, words only; the correction changes no code; not the human's wording, so the worker applies it with no re-gate and the PR body lists it).**
- The region comment in `lib.rs` says that under Part A the WebView2 settings are set and read back. The key setting is neither set nor read (`webview_chrome.rs:143-148`).
- This is the same kind of defect as the architect's C-1, at a place the architect did not name.
- File: `frontends/shell/src-tauri/src/lib.rs`.
- Old, verbatim, one line (`grep -cF` printed 1; a changed text, ending `wax`, printed 0): `            // settings are set for this build and read back, and one session-log line says what was`
- New, two lines:
  `            // context-menu setting is set for this build and read back (Part A makes no call for the key`
  `            // setting), and one session-log line says what was`
- The line before ends `the main window's WebView2`, and the line after goes on `read, or that the settings were not reached.`
- Clause check:
  - the menu setting is set: `apply` at `:88` reaches `Live::set_context_menus`, which calls `SetAreDefaultContextMenusEnabled` (`:163`);
  - it is read back by the getter (`:166-169`);
  - the key gets no call (`:143-148`);
  - the line comes from `log_entry` (`:116-121`).

**On the architect's C-1, D-1 and D-2.**
- Each Old stands once (`grep -cF` printed 1 for `in a build with them, both browser settings are set to WebView2's own`, `/// any other build turns both off.`, `/// Only Windows has a WebView2 controller to reach.` and `that case; the build's architect gate says whether this read still holds.`).
- I checked their clauses against the same lines (checks 6 (d) and 8, including runtime `:239-248` and `:3751`). I agree.
- I give no words of my own for those places, so no pair of differing words goes to the advisor.

**RD-1 (Documentation, must fix before the merge; a record, no code).**
- `verify-mutation --base 5ce0525a --head HEAD` exits 1, with 6 of 6 MISS (`rp-16`, `rp-17`), because the form is not in the diff.
- The closing amendment should record that output as a run, never as an observation, and name this report's check 4 at 5174676a as the observation of record of M-U1 to M-U6 (§9 item 7; round 25 item 2 (c)).

**RD-2 (Documentation; the KNOWN-LIMITATIONS draft; words ruled by the advisor, so none proposed).** Source 1's clause "from inside `window.with_webview(...)`" is untrue (check 6 (d)). It agrees with the architect's note.

**Suggestion S-1 (for the advisor under (c); not a finding).** Add a Windows unit test over `Live`, built from two closures, that asserts `accelerator_keys=unread` and that no key call is made. It would put the Part-A-alone stub under Product CI (shell). My probe shows that nothing in CI guards it now. Its lines would count under class 8.

**For the run part.**
- E-1 at the base and at the head. Check that E1's FAIL note under M-E1, and at the base, is `found 0`.
- E-1's series is also the only evidence that `with_webview`, called inline from `setup()`, runs without a panic.

Nothing was changed in D:/wt/keys except the seven mutations, each reverted; `git status --porcelain` is empty. No app, dev server or e2e suite was started. Nothing in or under C:/dev/spatial-ide was read, and no transcript or task output file was opened. No hook refused a call.
