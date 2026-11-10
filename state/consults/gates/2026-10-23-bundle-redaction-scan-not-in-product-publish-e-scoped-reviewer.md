Reviewed: PR #241 at 147ef82c7d14b537b5c3fc51673090c9b082a1f5, scoped check of (e), reviewer
`cut/bundle-redaction-scan @ 147ef82c7d14b537b5c3fc51673090c9b082a1f5`

Verdict: PASS WITH NOTES

All five checks hold. Nothing in this scope blocks. One note matters for the custodian's plan: the PR now conflicts with main, so the head this check passed is not the final head.

## Findings

### Correctness
None.

### Evidence (non-blocking for this scope; for the custodian before R2)
- **E-1. PR #241 conflicts with main, so the pull_request workflows did not run at 147ef82c.**
  - `gh api repos/{owner}/{repo}/pulls/241` gives `"mergeable":false,"mergeable_state":"dirty"`, and `gh pr view` gives `CONFLICTING`/`DIRTY` (rc 0).
  - Read-only `git merge-tree c7d02156… 384de54b… 147ef82c…` (rc 0) shows one file changed on both sides, `KNOWN-LIMITATIONS.md`, with one conflict block. Main added items `51.` and `52.` after `46.` (main commits 37b9d756, ee39c841, 0ed4b305, milestone 4 PR A). At the same place the branch adds `47.`.
  - At 147ef82c only the four push-event workflows ran: Rust fmt, Governance CI, Ported notices and Product CI — shell, all success. Product CI — Rust workspace, Product CI — bundle viewer, Exposure scan and DCO sign-off ran at 2fc01f59 (pull_request, success) but not at this head.
  - At this head the diff from 2fc01f59 is comment-only in a file the shell workflow covers, and the commit's Signed-off-by email equals the author email (script, rc 0). So there is no evidence gap for (e) itself.
  - **Consequence:** GitHub cannot merge a conflicting PR. Resolving the conflict needs a main merge, which makes a new final head. Under the form's Amendment 7 item 6 and Amendment 8 item 2 (R1 and R2 at the final head), and F7's §2.3 ("If #241 changes before its merge"), that merge reopens R1, R2's installer and F7's §4 item 4 again. Only the custodian or the human can decide whether R2 runs on this head's installer or waits for the merge head.

### Documentation (must-fix before the merge; none found in scope)
None. (e)'s sentence is true as read in ordinary Windows use (check 2). Two cases are named below under the wording-block rule (`state/directives/2026-10-11-direction-after-status-review.md`, item 2). Neither blocks. Record them in the source comment or on the form. `publish.rs` has 1 line left under its 45 (check 3), so the form is the cheaper place.
- **N-1.** If the resource directory resolves but its `bundle-viewer/` is absent, the record is read from `renderer/bundle-viewer`. On Windows this happens only when the cargo-output copy is removed by hand after a build. That is not ordinary use: the shell's build stops when a resource is missing (`copy_resources`, `resource?`).
  - The sentence is true when "one resolved" is read as `resolve_viewer_dir` resolving to the resource-directory candidate. The architect's check (`dir.parent()`, where `dir` comes from `resolve_viewer_dir`) uses that reading.
  - If "one resolved" is read as `resource_dir()` returning `Ok`, the first clause and the dev-tree clause overlap in this case.
- **N-2.** On Linux, a dev run from `target/<profile>` with `.cargo-lock` also resolves to the cargo output directory (tauri-utils 2.9.3 `resource_dir_from`). The parenthetical names only Windows. Linux is unvalidated and macOS is paused, so this is not shipped-app behaviour.

The sentence is not the human's wording: it is the architect's (e), applied under Amendment 9 item 2. No replacement words are owed.

## Check 1 — the diff
- `git diff 2fc01f59… 147ef82c…` gives rc 0. `--stat` gives rc 0: "1 file changed, 5 insertions(+), 3 deletions(-)", only `frontends/shell/src-tauri/src/publish.rs`.
  - There is one hunk (`@@ -1398,9 +1398,11 @@`), and it is the `read_build_record` doc paragraph, now at publish.rs:1401-1405 at the head.
- Script `rds-e-rev-check1.mjs` (rc 0). It took both spans from the consult's item 4 by regex, out of the line for (e) in the "untrue sentences" list and the line for (e) in the replacement words. Nothing was retyped.
  - Old span in the old joined paragraph: 1. New span in the new joined paragraph: 1. Old span in the new paragraph: 0.
  - **The new joined paragraph equals the old joined paragraph with only the span replaced: true.** So the other words are unchanged.
  - Greedy wrap at 100 columns reproduces the five new lines exactly: true. The columns are 96, 90, 98, 98 and 12; the old lines were 92, 95 and 103.
  - The file outside the paragraph is byte-equal at both commits: true.

## Check 2 — (e)'s clause check
Locked versions in `frontends/shell/src-tauri/Cargo.lock` at the head: tauri 2.11.5, tauri-build 2.6.3, tauri-utils 2.9.3. Sources read in the cargo registry.

- **The record's location, "in the viewer directory's parent":**
  - The caller is `bundled_viewer`, publish.rs:1394: `read_build_record(&dir, resource_dir.is_some())`, where `dir` comes from `resolve_viewer_dir` (publish.rs:1386).
  - The path is `dir.parent().unwrap_or(dir).join(VIEWER_BUILD_RECORD)` (publish.rs:1416).
- **"the resource directory when one resolved": true** (reading as in N-1).
  - `resolve_viewer_dir` pushes `dir.join("bundle-viewer")` first when `resource_dir` is `Some` (publish.rs:1455-1456), and returns the first candidate that exists (publish.rs:1460-1464).
  - The parent of that candidate is the resource directory. `tauri.conf.json:42` at the head maps the record to `viewer-asset-hashes.json` at that root.
- **"(a packaged build, or on Windows a `tauri dev` run's cargo output directory)": true.**
  - `commands.rs:323` and `commands.rs:556` pass `app.path().resource_dir().ok()`.
  - tauri `src/path/desktop.rs:230-233` calls `crate::utils::platform::resource_dir` (`pub use tauri_utils as utils`, `src/lib.rs:115`).
  - tauri-utils `src/platform.rs:264-271` uses `current_exe()?` and then `resource_dir_from`. That function returns `Ok(exe_dir)` whenever `cfg!(target_os = "windows")` (`src/platform.rs:297-302`).
  - tauri-build `src/lib.rs` `try_build` copies the `BundleResources::Map` (line 572) into `target_dir`, the profile directory (the third parent of `OUT_DIR`, lines 538-543). `copy_resources` (lines 88-103) puts `bundle-viewer/` and the record beside the executable.
  - So a Windows dev run's resource directory is the cargo output directory, and a packaged run's is the install directory.
- **"`renderer/bundle-viewer` when the dev-tree path was taken": true.**
  - `dev_tree_viewer_dir()` is `CARGO_MANIFEST_DIR/../../../renderer/bundle-viewer/dist` (publish.rs:1443), and `parent()` drops `dist`.

## Check 3 — §7's count for publish.rs
- `git diff -U0 c7d02156…147ef82c -- frontends/shell/src-tauri/src/publish.rs` gives rc 0. `mod resolver_tests` is at line 1506 at the head.
- Script `rds-e-rev-count.mjs` (rc 0): there is one hunk above line 1506 (`@@ -1394 +1394,43 @@`), with **43 added and 1 removed, 44 in total, against 45.** The worker's 44 is confirmed.
- Control at 2fc01f59 (its `mod resolver_tests` at line 1504): 41 + 1 = 42. The change is +2, consistent with 5 added and 3 removed of lines already new in #241.
- The other hunks (new lines 1779, 1801 and 3214) are inside `mod tests` (at 1639). No hunk falls in `resolver_tests` or between it and `mod tests`.
- `--numstat` for the file: 157 added and 4 removed, against 240 (rc 0).

## Check 4 — F7's §4 item 4 at #241's 147ef82c7d14b537b5c3fc51673090c9b082a1f5 (for #244's record)
Script `rds-e-rev-check4.mjs` (rc 0), with each pattern self-tested positive first.

- **[F7] W12:** the self-test passes (the opening pattern matches the form block's first line). The paragraph is at `kernel/src/bin/publish-bundle.rs` lines 47-58 at 147ef82c, followed by a bare `//!`. **With each `//! ` prefix removed, it is byte-equal to the redaction form's W12 `text` block** (form on main 384de54b, lines 807-818 at that commit): OK.
- **[F7] `ViewerAssets::`:** the self-test is positive on publish.rs. In the code lines of `publish-bundle.rs` (comment lines excluded) the only use is line 533, `from_dir`: OK.
- **[F7] `with_build_record`:** the self-test is positive on publish.rs. There are zero matches in `publish-bundle.rs`, comments included: OK.
- **[F7] `run_inner`:** `fn run_inner` is at `kernel/src/publish/mod.rs:691` (body to line 989) at 147ef82c. Its call to `redaction::first_undeclared_findings` passes `|rel, bytes| req.viewer.is_built_asset(rel, bytes),` at line 957, the fourth argument. That argument is `skip: impl Fn(&str, &[u8]) -> bool` (`kernel/src/bundle/redaction.rs:363` at 147ef82c): OK.
- **[F7] `redaction-reviewed.json`:** script `rds-e-rev-rows.mjs` (rc 0; self-test true). There are 3 rows, 2 of them `NOTICE.txt`: `credential` at 19092 and `local-filesystem-path` at 111337. OK.
- **[F7] LICENSES:**
  - As item 4 is worded, `git diff c7d02156..147ef82c -- renderer/bundle-viewer/LICENSES` gives rc 0 and 0 bytes. But that path does not exist at the head (`ls-tree` is empty), so the check is vacuous.
  - F7's Amendment 1 item 2 corrected the path (class 3). The corrected diff, `git diff c7d02156..147ef82c -- LICENSES renderer/bundle-viewer/notice.mjs renderer/bundle-viewer/portedNotices.mjs`, gives rc 0 and **0 bytes**. The paths exist (40 entries: 38 under `LICENSES/`, plus both `.mjs`).
  - Positive control: the same diff with `build.mjs` added is 875 bytes. OK.
- Prediction held. F7's §2.3 re-run is satisfied at 147ef82c. It will be owed again at the merge head (E-1).

## Check 5 — CI at the head
- `gh pr checks 241` gives rc 0, with 6 checks, all pass: cargo fmt --check, cfg boundary, ported-notices, tauri build (NSIS), test · verify:plan · queue/site drift, and typecheck · build · vitest · cargo test.
- `gh pr view` gives headRefOid 147ef82c7d14b537b5c3fc51673090c9b082a1f5. The PR is not a draft and is OPEN.
- `gh run view` (rc 0 each), all event `push`, completed success, created 2026-10-23T17:59:28Z, headSha 147ef82c7d14b537b5c3fc51673090c9b082a1f5:
  - 39999599780, Rust fmt
  - 39999599784, Governance CI
  - 39999599896, Ported notices
  - 39999599912, Product CI — shell. Its jobs are the tauri build (NSIS) and typecheck · build · vitest · cargo test, both success.
- No pull_request-event run exists at this head (`gh run list --branch`, rc 0); see E-1.
- **Artifacts of run 39999599912** (`gh api repos/{owner}/{repo}/actions/runs/39999599912/artifacts`, rc 0): id 12521443661, **`spatial-ide-nsis-installer`, 11,625,686 bytes**, not expired, expires 2027-01-21T17:59:29Z, workflow_run head_sha 147ef82c7d14b537b5c3fc51673090c9b082a1f5. Nothing was downloaded.

Nothing was written outside the scratch folder (files `rds-e-rev-*`). No build ran, and nothing was written in `C:/dev/wt/rds`; all git reads were against the main checkout's object store. No commit, push or PR action.
