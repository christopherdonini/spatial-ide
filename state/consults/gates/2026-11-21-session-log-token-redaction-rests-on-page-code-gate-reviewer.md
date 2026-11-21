Reviewed: cut/session-log-token-redaction at fe1389162a3210c6bcf7166c5f3c6cc62adec42d (the custodian's filing note, 2026-11-21: the reviewer's gate of the redaction node, section 9.2; Read 3, Bash 105, SubagentHandback 1, by unique call ids, one Bash call errored (its own mutation script failing safe on an anchor), model claude-opus-5-5, from 2026-11-21T00:50:36Z to 2026-11-21T01:13:17Z by its transcript; the report below byte for byte from its hand-back of 18893 bytes, sha256 1fe8e61808fde730ae4046a115589c6a026cd5400d5e38b20207e72b4b67a250, nothing masked by the custodian, with this note in its first line and one final newline; its mutation logs read by the custodian, the six each 0 passed and 1 failed, the seventh 80 passed), gate, reviewer
Gate: session-log-token-redaction-rests-on-page-code, reviewer, at fe1389162a3210c6bcf7166c5f3c6cc62adec42d
Verdict: PASS WITH NOTES
Reviewed: cut/session-log-token-redaction @ fe1389162a3210c6bcf7166c5f3c6cc62adec42d (base B = d7f27ef8b41869b2e89fcb849ca20f5244cc9e0b; `<W>` was at H with a clean porcelain at the start and at the end)

I read the form in the main checkout at c3250380. Its sha256 is 0b8322114af13c2ce44ffecb5e033dd42ed437b3e5dc9d86bbd98d4763c9bf02. I read Amendment 3 first, then Amendments 1 and 2, then sections 1, 2.4, 4, 7, 8, 9.2 and 11. I also read, each whole: ADV-2026-11-20-20, -22, -24, -26 and -27; ADV-2026-11-21-02 and -21-03, which are now staged in the main checkout; and the three filed worker reports plus `<S>/rdw4-hb-1.md`.

## 1. Scope and the count (section 7's commands, at H)
- `--numstat B...H` over section 7's four files:
  - commands.rs: 177 and 7
  - state.rs: 64 and 6
  - lib.rs: 1 and 1
  - Cargo.toml: no row
  - **Total 256 against the ceiling of 230: over by 26.** This is recorded as counted. It is class 8 in the closing (Amendment 3 item 7), and it is not a finding.
- `--name-only B...H` shows only `frontends/shell/src-tauri/src/commands.rs`, `lib.rs` and `state.rs`.
- `git diff B...H -- '*Cargo.lock' '*Cargo.toml' '*package.json' '*package-lock.json'` is 0 bytes. No dependency or lockfile changed.
- `git merge-base origin/main HEAD` is d7f27ef8 = B.

## 2. The full diff (correctness and security)
- **The redaction path.** The binding's body is one call, `log.append_redacted(&handle.session, &level, &message)` (commands.rs:270). `append_redacted` (state.rs:88-95) is `self.append(&session.redact(level), &session.redact(message))`, and `append` writes `format!("{ms} {} {}\n", one_line(level), one_line(message))`.
- **Why `one_line` cannot undo the redaction.** It replaces characters and removes none. An LF becomes two characters; every other replaced character becomes U+FFFD. The token is lowercase hex (`mint_token` is `hex::encode`, session.rs:135-140), and `\`, `n` and U+FFFD are not hex, so `one_line` can neither rebuild the token nor join two halves of it.
- **The one-line rule.** `one_line`'s set is Cc (`is_control`), the 12 Bidi_Control characters, U+2028 and U+2029. That equals `REPLACED` in shownText.ts:23 (U+0000-001F and U+007F-009F are exactly Cc). No length bound is added.
- **The token's copies (section 8 item 3).**
  - The only copy in shell state is `DataPlaneHandle.session`, a clone of `running.session` (lib.rs:447). The original goes into `Box::leak` (lib.rs:546).
  - `token: String` is gone. The only `token_for_delivery()` call in product code is the attach at commands.rs:248, which is the delivery.
  - `Session` derives only `Clone`; `DataPlaneHandle` derives nothing. Nothing in the diff prints or logs the token.
  - The test comment says failures print no token, and that holds: each test runs `assert!(!session.leaks_into(..))` before any `assert_eq!` on a line, and none of my six mutation failures printed the token.
- **The `pub` items added, and their product callers.**
  - The field `DataPlaneHandle.session` (it replaces `pub token`): commands.rs:248 and :270.
  - `SessionLog::append_redacted`: commands.rs:270. The other calls are in the tests at :757, :771, :786 and :787.
  - `one_line` is private.
- **The seams.**
  - The binding's argument names `level` and `message` match log.ts:22, `invoke("binding_log_session_event", { level, message })`.
  - The new `State<'_, DataPlaneHandle>` cannot fail a log call that used to succeed: `app.manage(data_plane_handle)` (lib.rs:465) runs right before `app.manage(session_log)` (lib.rs:466), in the same `setup`.
  - `Session` is used through its actual API at the base (session.rs:83, 125-126, 129).
- **`allow` and `cfg`.** No `allow` was added. The only new `cfg` is `#[cfg(test)] mod tests`. Every `unwrap` and `expect` in the diff is in the tests.
- **Section 8.** No edit under `protocol/` (item 1), no page or e2e file (item 4), and no shown string (item 8).
- **The tests' folders.** Each test uses `std::env::temp_dir()/spatial-ide-shell-session-log-tests/<k1|k2|k3>`, removed at the start and not at the end. That follows `publish.rs`'s `workspace`. See note N2.

## 3. The credential (section 8 item 6, in Amendment 3 item 5's words)
- K-1, K-2 and K-3 (commands.rs:756, :770, :784) each compose `format!("tok.{}", session.token_for_delivery())`.
- The attach (commands.rs:248) composes `format!("tok.{}", state.session.token_for_delivery())`.
- That is the same format and the same accessor. The tests' `Session` comes from `Session::with_origin`, the constructor the data plane uses (server.rs:295).
- **No difference, so no block.**

## 4. The six mutations, remade at H
- Each mutation and each revert was one call of `node <S>/rdgr-mut.mjs <id> apply|revert`, which exits 1 unless its anchor occurs exactly once.
- My first script failed safe on K-3 (a): "anchor occurs 0 times; nothing changed". A shell layer had collapsed its backslashes. I rewrote it to build the backslash with `String.fromCharCode(92)` and checked it with `node --check`. Nothing was changed by the failed call.
- Each mutation was followed by `git diff --stat` showing the one file, then one `cargo test --locked --lib <name>` in a shared hold, then the reverse replacement and `git diff --quiet` with rc 0. All six reverts gave rc 0.

| Mutation | Change | Red at (byte-copied) | Log |
|---|---|---|---|
| K-1 | `self.append(&session.redact(level), message);` | `test commands::tests::a_token_in_the_pages_message_never_reaches_the_session_log ... FAILED` / `panicked at src\commands.rs:760:9:` / `assertion failed: !session.leaks_into(&text)` | `<S>/rdgr-mut-1.log` |
| K-2 | `self.append(level, &session.redact(message));` | `test commands::tests::a_token_in_the_pages_level_never_reaches_the_session_log ... FAILED` / `panicked at src\commands.rs:774:9:` / `assertion failed: !session.leaks_into(&text)` | `<S>/rdgr-mut-2.log` |
| K-3 (a) | both U+FFFD arms become `line.push(c)`; the LF arm is kept | `... a_control_character_in_the_pages_text_never_breaks_the_session_log_line ... FAILED` / `panicked at src\commands.rs:796:13:` / `assertion failed: !line[..line.len() - 1].chars().any(hidden)`, the hidden-character check | `<S>/rdgr-mut-3.log` |
| K-3 (b) | `format!("{ms} {} {}\n", level, one_line(message))` | the same test `FAILED` / `panicked at src\commands.rs:791:9:` / `assertion `left == right` failed` / `left: 3` / `right: 2`, the line count | `<S>/rdgr-mut-4.log` |
| K-4 (a) | the body becomes `log.append(&level, &message);` | `... the_session_log_binding_calls_append_redacted_and_no_other_line_here_calls_append ... FAILED` / `panicked at src\commands.rs:842:9:` / `binding_log_session_event's body no longer calls log.append_redacted(&handle.session, &level, &message)`, the presence assertion | `<S>/rdgr-mut-5.log` |
| K-4 (b) | the call is kept, and `    log.append(&level, &message);` is added inside the body | the same test `FAILED` / `panicked at src\commands.rs:856:9:` / `a line of commands.rs outside its tests calls append:` / `commands.rs:271: log.append(&level, &message);`, the absence assertion | `<S>/rdgr-mut-6.log` |

Each test is run with its name as the filter, and each result line reads `0 passed; 1 failed; ... 79 filtered out`.

**Where my runs differ from the workers' runs:**
- **Line numbers.** The two words commits moved lines. The workers' 0005d0d3 lines were :762, :776, :798, :793 and :842; at H they are :760, :774, :796, :791 and :842. K-4 (b) was :854 at 0cc509fe and is :856 at H. The insert adds one line each time, so this matches.
- **One test per run.** The worker's K-1 run at 0005d0d3 also failed K-3, because more than the named test ran. I filtered by name, so only the named test ran.
- **How they were made.** My edits match the workers' (K-3 (a) the same two arms; K-4 (b) a line inside the body). Each was made and reverted by an exact-once anchor; the words worker reverted K-4 (b) with `sed -i '271d'`.

**A seventh mutation, beyond the brief's six (exploratory; `<S>/rdgr-mut7.mjs`, `<S>/rdgr-mut-7.log`).**
- The binding's one call was put inside a block comment, `    /* log.append_redacted(&handle.session, &level, &message); */`, so the binding writes nothing.
- The full `--lib` run gave `test result: ok. 80 passed; 0 failed`, K-4 included. The only signal was four `unused variable` warnings.
- Reverted; `git diff --quiet` rc 0. See finding D-1.

## 5. Lints
- `cargo fmt --manifest-path frontends/shell/src-tauri/Cargo.toml -- --check` from `<W>`, not in a hold: rc 0, no output.
- `cargo clippy --locked --all-targets` in a hold (`<S>/rdgr-clippy.log`): rc 0. Its one warning is `warning: large size difference between variants` / `--> src\publish.rs:359:1` (`PrepareOutcome`). That is the known one (Amendment 3 item 8); `PrepareOutcome` is at publish.rs:359 at the base too. There are no warnings in commands.rs, state.rs or lib.rs.

## 6. Runs
**Reused, and not reproduced** (I had no reason to doubt them):
- The words worker's full `cargo test --locked` at 0cc509fe: 80 lib tests passed, then 0, 2 (`sole_caller_scan`) and 0.
- `<S>/rdw4-hb-1.md` at fe138916: `--lib` gave `ok. 80 passed; 0 failed`, and fmt exited 0.
- I also re-checked the K-4 doc: commands.rs:814-819 at H hash to sha256 c863922cbf6fdebba51e9b543893a14dceaa2b466d6711271b8419d46110190d. The brief's byte-copied fence gives the same hash, and it matches ADV-2026-11-21-02 item 3's new fence.

**CI at H, read by me with `gh run list` at 2026-11-21T01:01:11Z:**
- 44846016690, Product CI — shell: completed success. Both jobs succeeded: `typecheck · build · vitest · cargo test` and `tauri build (NSIS …)`.
- 44846016751, Governance CI: completed success.
- 44846016703, Ported notices: completed success.
- 44846016704, Rust fmt: completed success.
- The shell run the custodian saw in progress has now finished green. ADV-2026-11-20-24 item 4 is not triggered, and that run covers `npm run verify`.

## 7. The words (a second reader, beside the architect)
Each clause below was checked against the code at H.
- **Section 2.4 (a), the picker's doc.**
  - "The first save": App.tsx:901.
  - "A reopen": AdmissionPanel.tsx:387.
  - "A folder already chosen": both requests take `folder`.
  - "Native, and `None` on cancel": the body.
  - True. The DEV hook case (`takeSlot`) is dev-only, as the form names it.
- **(b)**: the module doc is main's bytes again; the diff has no hunk there.
- **(c), `SessionLog`'s doc.**
  - "writes them through `append_redacted` … then calls `append`": true (state.rs:94).
  - "The host's own lines … take no token": lib.rs:94, :419, :236 (the ok arm) and pool_poll.rs:223 and :260 carry config text, counts and reasons.
  - The exception: :246 (MISMATCH `actual`) and :267 (UNVERIFIABLE; `NoHost`'s Display holds the URL, origin.rs:92-93).
  - "Other forms are not redacted": `str::replace`.
  - All true.
- **(d), the binding's doc**: true through `append_redacted`.
- **(e), the field doc**: true (commands.rs:248, :270).
- **(f), `append`'s doc and comment.**
  - "from every caller, pass through `one_line`": every caller in the list above, plus state.rs:94, reaches only `append`.
  - The Cc/Bidi/U+2028/U+2029 claim, "written as given", "No length bound", the fields not always separable, and "replaces characters and removes none, and the token is hex": all true.
- **The method's doc**: "its one product caller" is true, per the grep in item 2. Every other clause is true.
- **`one_line`'s doc**: the set equals `shownText`'s `REPLACED`, apart from the LF. True.
- **K-1 to K-3, and the helpers.**
  - `session_log` is made "as publish.rs's `workspace` makes one": the same temp-dir, join and remove pattern (publish.rs:1756-1763).
  - "Each test checks `leaks_into` with `assert!` before any `assert_eq!` on a line": true. K-3's first `assert_eq!` is on a count, not a line.
- **K-4's doc and its new lines (ADV-2026-11-21-02 item 3), read against its filter and scan.**
  - "only a line that starts with `//` is skipped": `code = |line| !line.trim_start().starts_with("//")`. True.
  - "a call inside a `/* */` block, or any other type's `.append(`, is a false offender": true of the absence scan. A `.append(` line inside a block comment does not start with `//`, so it is collected.
  - "A call written in path form, `SessionLog::append(&log, ..)`, holds no `.append(` and is not seen": true; `::append(` does not contain `.append(`.
  - "It shows the call is written, not what it writes": true.
  - The window "from its `fn` line to the first line that is `}` alone": `position(|l| *l == "}")`. True.
  - **No clause is untrue.** But see D-1: the presence half has a gap the doc does not state.

## 8. The residency status (the advisor's question)
**On which thread.** `binding_log_session_event` is a non-`async` `#[tauri::command]`, so it runs on the host's main (UI) thread. It did so at the base as well. The code I read for this, in the local cargo registry:
- tauri-macros-2.6.3 `src/command/wrapper.rs`: the default is `ExecutionContext::Blocking` (:50), and it becomes `Async` only if `function.sig.asyncness.is_some()` (:157-159). `body_blocking` calls the function in place (:404-435).
- tauri-2.11.5 `src/ipc/protocol.rs`: the URI-scheme handler calls `webview.on_message` (:75).
- wry-0.55.1 `src/webview2/mod.rs`: `custom_protocol_handler(` is called (:1021) from inside the `add_WebResourceRequested` handler (:955), which is registered on the thread whose id it records as `main_thread_id` (:953).
- That WebView2 raises this event on the UI thread is WebView2's threading model. I did not read it in code.

**What the diff adds per page line.**
- At the base, the line was `format!("{ms} {level} {}\n", message.replace('\n', "\\n"))`.
- H adds two `str::replace` searches for the token (`Session::redact` on `level` and `message`), and `one_line` on `level` as well as on `message`.
- This is CPU only, linear in the two texts' lengths, with no I/O, no lock and no wait. The existing per-line mutex lock, `write_all` and `flush` are unchanged.

**Whether it can delay the page or a fill.**
- The page does not wait for the reply: `logSessionEvent` returns `void` and only records the result in `.then` (log.ts:20-31).
- Fills arrive over the data plane's WebSocket, not through this binding.
- `stepK7` (regression.mjs:1771-1906) reads `.residency-status` from the page, and holds no session-log read (0 matches in its span).
- No page code, residency code or e2e file is in the diff.
- So on *whether* the page shows the status: nothing in the diff can change it.
- On *when*: the added CPU time is spent on the main thread, so it can delay other main-thread work by that much (the dispatch of later IPC requests, for example). I did not measure that time, and I claim no number (docs/08).
- The base's run (K7 failed in 159536ms, with the same rows passing and failing as at 0cc509fe) fits the failure being independent of the diff.
- **I do not mark this a yes or a Correctness finding.** To the advisor: the "when" part is unmeasured, not shown to be zero.

## Findings by kind
**Correctness:** none.

**Security:** none in the diff. The MISMATCH and UNVERIFIABLE arms' `eprintln!`, and the `emit` of `actual`, are older than this piece and carry no redaction. That is OPEN-2 (i), named in `SessionLog`'s doc.

**Evidence:** none blocking. All six mutations went red by name at the assertions the brief names, at H. Clippy and fmt are clean in the changed files. CI at H is green.

**Documentation (must be settled before the merge):**
- **D-1, to the advisor, unreworded.**
  - The new lines in K-4's doc are true of the absence scan. They do not say that the presence assertion has the opposite failure: `code(l) && l.contains(call)` is also met by the call inside a `/* */` block on a line of its own, or inside a string literal.
  - That is a silent pass. With the binding's only call in a block comment, all 80 lib tests pass (`<S>/rdgr-mut-7.log`), and nothing else in the suite guards the binding's body, because K-1 to K-3 call the method directly.
  - ADV-2026-11-21-02 item 2 already has the gates read the binding's body itself. I read it at H, and it is the one live call, so the code is right.
  - What is missing is a limit the doc leaves unstated. It does not make any stated clause untrue. Whether it goes on the form with N3 (ADV-2026-11-21-02 item 6) is the advisor's call.
- **D-2.** The count at H (256 against 230) is recorded as class 8 in the closing, with the 0005d0d3 and 0cc509fe counts (Amendment 3 item 7). This is a record item, not a finding.

**Notes:**
- **N1.** The (c) doc's bytes break a line early ("…The host's own / lines are composed in this crate and take / no token…"). Those are the advisor's whole-line words from ADV-2026-11-20-26, fmt accepts them, and they are cosmetic only.
- **N2.** The tests do not remove their folders at the end. After a mutation run that leaks (K-1, K-2), the k1 or k2 log holds a test-only session's token until the next run. My last run (the seventh mutation, with the K-1 to K-3 code unmutated) rewrote all three folders. A count of lines holding a 64-hex run, which printed nothing and whose pattern I checked against a positive control, gave 0 in k1, k2 and k3.
- **N3.** At 0cc509fe the advisor's read of K-4 (ADV-2026-11-21-02 items 1-2) agrees with mine. The precedent's own loose sentence (item 7) is not this piece's.

## Runs reused and runs reproduced
- **Reused:**
  - the words worker's full `cargo test` at 0cc509fe (80 lib, 2 `sole_caller_scan`);
  - `<S>/rdw4-hb-1.md` at fe138916 (80 lib passed; fmt rc 0);
  - CI at H, which I read again myself: four runs, completed success.
- **Reproduced by me at H:**
  - fmt `--check` (rc 0);
  - the six mutation runs (`<S>/rdgr-mut-1.log` to `-6.log`, each rc 101 at the named assertion);
  - clippy `--all-targets` (`<S>/rdgr-clippy.log`, rc 0, the one known `publish.rs` warning).
- **Exploratory, not a run of H:** the seventh mutation's full `--lib` run (`<S>/rdgr-mut-7.log`: 80 passed, with the binding's call commented out).
- **Holds:** eight shared holds, all granted and released: six mutations, the seventh, and clippy. Each reads `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:<pid> also=<m> …` and then `MACHINE_RELEASED project=<m> shell=bash.exe:<pid> affinity=FF (cores 0-7)`. There were no MACHINE_WAITING or MACHINE_ERROR lines, and no exit code from 96 to 99.
- **End state:** `<W>` is clean at fe1389162a3210c6bcf7166c5f3c6cc62adec42d, with an empty porcelain. No cargo or rustc process I started is running. No e2e suite was run.
- **Scratch files**, all directly in `<S>`: `rdgr-mut.mjs`, `rdgr-mut7.mjs`, `rdgr-mut-1.log` to `rdgr-mut-7.log`, `rdgr-clippy.log`.

Model: claude-opus-5-5 (Opus 5.5), as the harness reports it.
