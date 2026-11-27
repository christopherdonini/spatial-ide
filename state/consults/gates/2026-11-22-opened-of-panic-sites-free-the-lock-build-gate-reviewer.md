Reviewed: PR 361, the branch cut/opened-of-panic-frees-the-lock at 2d7ae14b08a92d6fc406ce827e15a36c3bfb92b7, in C:/dev/wt/dpanic (the custodian's filing note, 2026-11-23: the reviewer's build gate of node (d), node:opened-of-panic-sites-free-the-lock@build-gate-reviewer-1, dispatched at 2026-11-22T23:14:39Z. Its run stopped at 2026-11-22T23:53:05Z on an API error, the account's monthly spend limit, not on anything in the piece; after the human's typed message of 2026-11-23T03:37:57.915Z (filed beside this) the custodian resumed it by message at 2026-11-23T03:39:10Z; its run: Bash 72, Read 3, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-22T23:14:44Z to 2026-11-23T03:43:50Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 14258 bytes, sha256 e9578ebd713dda934f17efbabe8e3ccffad3b32f68bc8b56b85f2340af6d6b63, byte for byte except one mask: the scratch folder's path, written as <u>/…/scratchpad, once; with one final newline added. PASS WITH NOTES: no Correctness or Evidence finding; D1 and D3 go into the closing amendment; D2, reply_of's doc comment, was applied in its words as d2b8b6e3b0e98f783a9c0295ccecacd871d30fc2 under governance/AUTONOMY.md section 31 item d, with no re-gate, by the worker node:opened-of-panic-sites-free-the-lock@gate-fix-1, dispatched at 2026-11-23T03:51:04Z; the PR body lists them.)

---

Verdict: PASS WITH NOTES
Reviewed: C:/dev/wt/dpanic @ 2d7ae14b08a92d6fc406ce827e15a36c3bfb92b7
Branch: cut/opened-of-panic-frees-the-lock @ 2d7ae14b08a92d6fc406ce827e15a36c3bfb92b7 (PR 361, draft, base B 1938c1b50b84587adaaa747a5ffc23cea092d17b)
REPORT PATH: state/consults/gates/2026-11-22-opened-of-panic-sites-free-the-lock-build-gate-reviewer.md

No Correctness or Evidence finding, so nothing blocks. There are three Documentation findings, all must-fix before the merge. My run was cut off at 2026-11-22T23:53:05Z by the spend limit. When I resumed at 2026-11-23T03:39Z, none of my commands was still running (no cargo, rustc or node process). The worktree was clean at the head, and the file's sha256 equalled its value at the head.

## Correctness
None.
- **Guard.** `ReplyGuard::drop` (mod.rs:942-951) acts only when `std::thread::panicking()`. It holds no mutex when it starts. It calls the host's `close_dataset`, which takes `watches` and then the catalog's write guard, and drops the result. Then it calls `release_ended`, which takes `saved` and then the catalog and generations, as at mod.rs:261. Neither has an `unwrap`, `expect` or `panic!` on this path; both use `unwrap_or_else(into_inner)`.
- **Release.** After the close, the catalog no longer holds the name, because names are minted once per open. So `retain` drops the entry, and with it `_lock`.
- **Thread.** It runs on the `spawn_blocking` thread, before the `JoinHandle` resolves (commands.rs:214-216), so it is off the canvas path.
- `opened_of`'s only caller is `reply_of` (mod.rs:932).

## Evidence
None. Each run below is mine, at the head.

## Documentation (must-fix before the merge)

**D1 — record. M2 fails two tests outside its set.** The closing amendment must record them.
- Under M2 (lines 944 and 949 deleted), `cargo test --locked -p spatial-kernel --no-fail-fast` exits 101: 519 passed, 3 failed, 47 ignored.
- K-D2 fails at its catalog assertion, "the catalog does not hold the dataset" (mod.rs:1663), as §4 says.
- Also failing, in `kernel/tests/project_reopen_skp.rs` (declared unchanged in §5; its text is unedited):
  - `a_saved_project_reopens_through_the_command_from_its_wire_request`, at :120 "recorded" (skp.unknown_dataset);
  - `each_reopen_refusal_reaches_the_wire_as_its_code_with_no_path_it_was_not_given`, at :361 (skp.project_open_elsewhere answered `opened`).
- Through the command, M2 closes the dataset after a reply that succeeded. The run is `<S>/dr-m2-suite-nff.txt`.
- The worker ran only K-D2. K-D2's `RECORDED MUTATION M2` line is true, but it is not the whole outcome.
- The closing amendment records the two extra tests, their assertions and the commit 2d7ae14b08a92d6fc406ce827e15a36c3bfb92b7.

**D2 — code comment. `reply_of`'s doc (mod.rs:921) says "Its one caller".** K-D1 (:1638) and K-D2 (:1662) also call it. This is the worker's wording, not the human's.
- Clause check of the new words:
  - "one product caller ... arm": the only call outside `mod tests` is :917.
  - "K-D1 and K-D2 ... call it directly": :1638, :1662.
  - The rest is unchanged and true: the guard holds no mutex when it starts, it closes the dataset as `open_project`'s `close` closure does (:834-837), and then it calls `release_ended`.
- The old text occurs once in its file. Each new line is 100 columns or fewer.

```text
    /// The `opened` reply of a reopen, built by [`opened_of`]. Its one caller is
    /// [`Projects::open_project_command`]'s `Reopen::Opened` arm. If [`opened_of`] panics, its
    /// guard runs during the unwind, holding no lock: it closes the dataset through the host, as
    /// [`Projects::open_project`] closes it after a refused write, and then calls
    /// [`Projects::release_ended`], which drops the entry and with it the identity's open lock.
```
```text
    /// The `opened` reply of a reopen, built by [`opened_of`]. Its one product caller is
    /// [`Projects::open_project_command`]'s `Reopen::Opened` arm; K-D1 and K-D2 in this module's
    /// tests call it directly. If [`opened_of`] panics, its guard runs during the unwind, holding
    /// no lock: it closes the dataset through the host, as [`Projects::open_project`] closes it
    /// after a refused write, and then calls [`Projects::release_ended`], which drops the entry and
    /// with it the identity's open lock.
```

**D3 — record. M5's closing must carry both warnings and §1's sentence (ADV-2026-11-22-41 item 2).**
- The build gives two warnings, not one: "method `reply_of` is never used" and "struct `ReplyGuard` is never constructed". The `RECORDED MUTATION M5` line quotes only the first. That is true but partial, and the closing amendment records both.
- My words for §1's sentence, which the ruling asks for "in the gate's words":

```text
No test fails when the `Reopen::Opened` arm stops calling `reply_of` (M5): that the product caller calls it is shown by reading (`kernel/src/project/mod.rs:917` at 2d7ae14b08a92d6fc406ce827e15a36c3bfb92b7) and by M5's warning under `cargo build --locked -p spatial-kernel --lib`, "method `reply_of` is never used".
```

## Checks

**1. Diff, §2, §7 and §8 as amended.**
- `<S>/dr-diff.txt` is byte-equal to `<S>/d-diff-2d7ae14b.txt`. It touches one file, `kernel/src/project/mod.rs`.
- §2:
  - item 1: `reply_of` is private, and :917 calls it;
  - item 2: the guard's order;
  - item 3, as D-6 amends it: both doc additions;
  - item 4: `opened_of`'s doc equals D-5's text.
- §8:
  1. Nothing outside the file.
  2. None of (g)'s paths.
  3. No wire, SKP, file.rs, store.rs, binding, lockfile, dependency or workflow change.
  4. `open_project`'s body is untouched.
  5. No added `pub`, no product `cfg(test)`, no hook.
  6. The guard acts only when panicking, holds no lock when it starts, and has no `unwrap`, `expect` or `panic!` (D-4).
  7. No sleep, thread, timeout or ignore in K-D1 or K-D2.
  8. No declared-unchanged test text is edited.
  9. Every `RECORDED MUTATION` line names 378c6cfc. The worker's report calls `verify-mutation` "a heuristic, not an observation".
  10. Within the ceiling, and §7 is unedited.
  11. No DECISIONS-PENDING cite, no hash pin, no bare self-line.
  12. Not merged.

**2. P0, at C1's file, then restored.** Afterwards porcelain was empty and the sha256 was a746b534103b4c26982cbe9456a2e081919f277fb78dfd03f85e883403943f0f.
- K-D1 exits 101. It fails at mod.rs:1607:13, "S1: (ii) the catalog holds the dataset", as S1 (ii) predicts (`<S>/dr-p0-kd1.txt`).
- K-D2 exits 0 and passes (`<S>/dr-p0-kd2.txt`).

**3. M1 to M4.** Each was made by an anchored `sed`, with K-D1 and K-D2 run after it. After each restore, porcelain was empty and the sha256 equalled the head's value.

| Mutation | Lines changed | K-D1 | K-D2 | Logs |
|---|---|---|---|---|
| M1 | 944-949 deleted | rc 101, "S1: (ii) the catalog holds the dataset" | passes | `<S>/dr-m1-{diff,kd1,kd2}.txt` |
| M3 | 945-947 deleted | rc 101, at (ii) | passes | `<S>/dr-m3-*.txt` |
| M4 | 948 deleted | rc 101, "S1: (iii) `saved` holds its entry" | passes | `<S>/dr-m4-*.txt` |
| M2 | 944 and 949 deleted | passes | rc 101 at its catalog assertion | `<S>/dr-m2-*.txt`, `<S>/dr-m2-suite.txt` (a fail-fast run that stopped at the lib target), `<S>/dr-m2-suite-nff.txt` |

- M2's extra failures are D1.
- For M1, M3 and M4 I ran only K-D1 and K-D2. That nothing outside their set fails is my reading, not a run: their changed code acts only while a panic unwinds, and only K-D1 panics inside `reply_of`.

**4. M5, made at commit 2d7ae14b08a92d6fc406ce827e15a36c3bfb92b7.** Line 917 now calls `opened_of(*o)` (`<S>/dr-m5-diff.txt`).
- `cargo build --locked -p spatial-kernel --lib` exits 0 (`<S>/dr-m5-build.txt`). It gives two warnings:
  - "warning: method `reply_of` is never used" at kernel\src\project\mod.rs:926:8, with "= note: `#[warn(dead_code)]` (part of `#[warn(unused)]`) on by default";
  - "warning: struct `ReplyGuard` is never constructed" at mod.rs:937:8;
  - then "warning: `spatial-kernel` (lib) generated 2 warnings".
- Unmutated, the same build exits 0 with no warning (`<S>/dr-m5-base-build.txt`).
- `cargo test --locked -p spatial-kernel --no-fail-fast` exits 0: 62 result lines, 522 passed, 0 failed, 47 ignored. Every test passed (`<S>/dr-m5-tests.txt`).
- **CI:** no job would fail on the warning. I read these files at the head:
  - `product-ci-rust.yml`, whole: `cargo build --workspace --tests --locked`, `cargo test --workspace --locked`, `-- --list --ignored`. No env, no RUSTFLAGS, no `-D`.
  - `product-ci-shell.yml`, its job: cargo test and two `cargo check` runs on src-tauri, which lint only that crate.
  - `tauri-build.yml`, whole, and `release-artifacts.yml`'s jobs: `npm run tauri build`.
  - `rust-fmt.yml`'s job: fmt only.
  - The two adr-003 spike workflows: spike crate only.
  - `governance-ci.yml`'s env lines: tokens only.
  - The config they load: `.cargo/config.toml` sets only the C++ env. There is no `[lints]` or rustflags in the root, kernel or src-tauri Cargo.toml, and no `#![deny(` or `#[deny(` anywhere in kernel/src.
  - Nothing runs clippy in CI.
- **Note for the advisor (none is owed for the merge request):** `#[deny(dead_code)]` on `fn reply_of` turns M5 into a build failure. Under M5 the lib build exits 101 with "error: method `reply_of` is never used" (`<S>/dr-m5-probe-diff.txt`, `<S>/dr-m5-probe-build.txt`). Without M5 it exits 0 with no warning (`<S>/dr-m5-probe-unmut-build.txt`). The non-test lib is built by `cargo test` for the integration tests and by CI's `--tests` build. The file was restored after the probe: porcelain empty, sha256 as at the head.

**5. The worker's two disclosures.**
- The void M3 run is kept, labelled and superseded by its second run, and my own M3 run matches it.
- The `node --test` run without a hold broke the machine rule, but it leaves no claim without evidence: my run in a hold gives 623 passed, 0 failed.

**6. The doc comments, clause by clause.**
- `opened_of` (:1000-1005):
  - "no text of a lineage file's lines, no rule text and no error text": `lineage_refusal_of` (:1084-1094) drops the `rule` of `Damaged` and the `reason` of `Unreadable` (session_history.rs:1674-1676).
  - "a line number where it has one": `OverBound` has an optional line, `Damaged` a line.
  - "It panics if…": the three conditions are sites 1, 2 and 3/4; I found no other panic in the function.
  - "No file the reader accepts reaches any of these": §0, Reachability.
  - "`reply_of` closes … frees the lock": true, since `opened_of`'s only caller is `reply_of`.
- `open_project_command`'s new sentence: true for a panic in `opened_of`.
- `release_ended`'s callers list: true; the guard's call is at :948.
- Only `reply_of`'s doc is untrue (D2).

**7. Suites at the head.**
- `cargo test --locked -p spatial-kernel --no-fail-fast` exits 0: 62 result lines, 522 passed, 0 failed, 47 ignored (`<S>/dr-suite-kernel.txt`). I added `--no-fail-fast`; with every test passing, the outcome is the same as the brief's command.
- `cargo fmt --all -- --check` exits 0 with empty output (`<S>/dr-fmt.txt`).
- `cargo clippy --locked -p spatial-kernel --tests` exits 0 (`<S>/dr-suite-clippy.txt`). Of its 14 warning lines, none is in project/mod.rs; they are in bin/publish-bundle.rs, lib.rs, permission/boundary.rs, publish/mod.rs, skp.rs, renderer canonical.rs and style.rs, and engine app_dirs.rs.
- The `node --test` scripts suite exits 0: 623 tests, 623 pass (`<S>/dr-suite-node-test.txt`).
- The heavy runs were in shared holds. Each hold line was granted (MACHINE_HOLD … also=`<m>`) and released (MACHINE_RELEASED project=`<m>`). There were no MACHINE_WAITING or MACHINE_ERROR lines and no exit codes 96 to 99.

**8. §7.** The numstat command at 1938c1b5...2d7ae14b, with §7's exclusions, gives `219 4 kernel/src/project/mod.rs` (`<S>/dr-numstat.txt`): 223 changed lines in 1 file, within the 240 ceiling.

**9. Caller rule.** `reply_of`'s one product caller is :917. Its other calls are :1638 and :1662, inside `#[cfg(test)] mod tests` (:1391).

**10. PR 361's checks.** I read `gh pr checks 361` at 2026-11-23T03:42:21Z (`<S>/dr-pr-checks.txt`, exit 0): 20 pass, 0 pending, 0 fail. The head is 2d7ae14b and the PR is still a draft.

**Final state.** `git status --porcelain` is empty, and the sha256 of `kernel/src/project/mod.rs` is a746b534103b4c26982cbe9456a2e081919f277fb78dfd03f85e883403943f0f, as at the head. I committed and pushed nothing. One stray `/tmp/x` file was written, by a redirect that was not needed, and then removed.

## Files read
- `C:/dev/wt/read-1122/governance/forms/kernel/OPENED-OF-PANIC-SITES-FREE-THE-LOCK-PREREGISTRATION.md` (whole)
- `C:/dev/wt/read-1122/state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-40-node-d-open-1-to-open-4-the-unwind-guard-the-seam-accepted-s-panic-unchanged-for-the-advisors-reason-d-5s-words.md`
- `C:/dev/wt/read-1122/state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-41-node-d-build-goes-on-with-amendment-1-no-second-gate-attempt-m5-recorded-as-an-observation.md`
- `<S>/d-build-report.md`, `<S>/d-diff-2d7ae14b.txt`, `<S>/d-numstat.txt`, `<S>/d-mut-*.txt`, `<S>/d-m5-*.txt`, `<S>/d-c1-kd2.txt`, `<S>/d-c2-*.txt`, `<S>/d-suite-verify*.txt`, `<S>/d-suite-kernel.txt` (totals)
- `C:/dev/wt/dpanic/kernel/src/project/mod.rs` (:100-140, :240-300, :650-720, :820-1100, the tests), `C:/dev/wt/dpanic/kernel/src/skp.rs` (close_dataset :1614-1675, NoWatchArm :2404-2419), `C:/dev/wt/dpanic/kernel/src/session_history.rs:1670-1694`, `C:/dev/wt/dpanic/engine/src/fixture.rs` (Default, CategoricalZone), `C:/dev/wt/dpanic/renderer/src/style.rs:424-439`, `C:/dev/wt/dpanic/kernel/tests/project_reopen_skp.rs:120-150`, `C:/dev/wt/dpanic/frontends/shell/src-tauri/src/commands.rs:125-160, :205-225`
- `C:/dev/wt/dpanic/.github/workflows/` (product-ci-rust.yml whole; product-ci-shell.yml :160-256; tauri-build.yml whole; release-artifacts.yml :25-102; rust-fmt.yml :25-81; adr-003-spike-ci-linux.yml and adr-003-spike-ci-macos.yml jobs; governance-ci.yml :155-199), `C:/dev/wt/dpanic/.cargo/config.toml`, and the lint and profile lines of the root, kernel and src-tauri Cargo.toml

`<S>` = <u>/…/scratchpad

Model: Opus 5.5 (claude-opus-5-5).
