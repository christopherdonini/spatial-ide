*Custodian's filing note (2026-10-23): the architect's reconciliation of #244's two scoped gates' words, read only at main db3e8ec3 with #244 at abc900f2 and #241 at 2fc01f59, a words consult with no verdict. The run 02:13:52Z to 02:22:12Z by its transcript (Read 32, Grep 24, Glob 10; no Write, Edit or Bash). For the human on Monday 2026-10-26, before #244's click: C1's one replacement for OPEN-4's parenthetical (the architect's gate-2 words); D1's two yes-or-no questions (code spans in OPEN-4's clause; `serve-bundle.mjs` marked in G7), each at 13 lines of §7's 14; D2's row for the amendment that records the answer. Out of scope for #244 and put to the human with #241's R2: item 4, comments of #241's head and of main read as untrue on Windows, with replacement words and what changing them would reopen in #241. Extracted by script from its SubagentHandback call; nothing else is changed. Its sha256, from line 5 to the end, is 5586d557c7e121e5dd481cdb913d257cbe34bcbeaf116e7ca738f0e76d279eb1.*

---

Reconciled: PR #244's gate 2 words, at main db3e8ec3

Read: `cut/walkthrough-row-f7-cli-refusal` @ abc900f2b4706669bc4abbc35024b28a451a5e86 (in `C:/dev/wt/f7`); #241 `cut/bundle-redaction-scan` @ 2fc01f5955a0dc21d51ee4cdffc3e5c55800959d (in `C:/dev/wt/rds`); main @ db3e8ec3794689bb134aa5d71140d4b596701bb8. I took each commit id from the branch refs in the main repository's `.git`. I have no shell, so I give no sha256 values, ran no scripts, and counted columns by hand. This is a words consult, not a gate, so there is no verdict. Nothing was written.

## 1. C1: one replacement for OPEN-4's parenthetical

**Chosen:** the architect's gate-2 words. The parenthetical becomes: (the shell's build stops when either is missing)

**Why these words and not the reviewer's:**
- They cover both conditions in the sentence's "if" (a missing `dist`, a missing record). The reviewer's words cover only the record.
- They stay at 3 lines whichever way D1 is answered.
- They make no claim about where the publish reads the record. That claim depends on the platform (see item 4).

**Is it the human's wording:** yes. The words being replaced are the architect's, which the human approved (`state/directives/2026-10-22-242-h-1-round-72-pin-f7-open-items-milestone-4-open-16-b-adr-020-corrigendum-a-1c-adr-036-words-approved-disk-parity-node.md`, item 2). The human's three answers under §31 apply.

**Clause check** (#241 at 2fc01f59; the shell's `frontends/shell/src-tauri/Cargo.lock` pins tauri 2.11.5, tauri-build 2.6.3 and tauri-utils 2.9.3):
- **"the shell's build":**
  - `frontends/shell/src-tauri/build.rs` (`main`) calls `tauri_build::build()`.
  - tauri-build 2.6.3, `src/lib.rs`, `try_build`: `bundle.resources` in `tauri.conf.json` is a map, so the `BundleResources::Map` arm calls `copy_resources`. No `is_dev()` condition guards that call, and the target directory is the third parent of `OUT_DIR` (the profile directory).
  - At 2fc01f59 the map carries both `renderer/bundle-viewer/dist/*` and `renderer/bundle-viewer/viewer-asset-hashes.json`.
- **"stops":**
  - tauri-build 2.6.3, `src/lib.rs`, `copy_resources` propagates the first resource error (`resource?`).
  - `build()` prints the error and calls `std::process::exit(1)`, so the cargo build fails before any window opens.
- **"when either is missing":**
  - tauri-utils 2.9.3, `src/resources.rs`, `next_pattern`: a pattern containing `*` that matches nothing gives `GlobPathNotFound`, which is the missing-`dist` case.
  - A plain path that does not exist goes through `resource_from_path` and gives `ResourcePathNotFound`, which is the missing-record case.
- **When the build script runs, so that the stop is reached:**
  - tauri-build emits `cargo:rerun-if-changed` for the config file (`try_build`) and for each resource (`copy_resources`).
  - #241 changes `tauri.conf.json`, so the A4 case (a viewer built before #241) reruns the build script and stops.
  - Part A's A1 (`npm run tauri dev`) compiles `src-tauri` (`frontends/shell/MANUAL-WALKTHROUGH.md:130-131 @ db3e8ec3`).
- **The rest of the sentence is unchanged and stays true:**
  - "beside it": `scan-dist.mjs` `main` writes `join(root, 'viewer-asset-hashes.json')`, where `root` is `renderer/bundle-viewer`, the parent of `dist`.
  - "run npm run build": the viewer's `package.json` `build` script runs `build.mjs` and then `scan-dist.mjs`.
- **Corroboration, not proof:** #241's cargo target `D:\wt-targets\rds\debug` holds `viewer-asset-hashes.json`, `bundle-viewer\{index.html,app.js,NOTICE.txt}` and `.cargo-lock` beside `spatial-ide-shell.exe`. This is a file listing only, with no timestamps and no hashes.
- **Named, not blocking** (for the amendment, because a markdown row has no source comment and an HTML comment would add lines):
  - The record or `dist` is removed after a successful shell build: by hand, or by a viewer rebuild whose scan fails (`scan-dist.mjs` deletes the old record first). Neither is ordinary use at 2fc01f59.
  - In that case the running shell keeps publishing from its build-time copy.
  - Whether the next build stops depends on cargo rerunning the build script for a `rerun-if-changed` path that no longer exists. Cargo's source is not in the registry, so I have not settled that.

**The lines.** The kept bytes are line 279's opening up to and including "); " (50 columns before the space). I copied them by reading the file, not by script. Greedy wrap at 100 columns:

Code spans (D1 yes), 3 lines of 91, 78 and 80 columns:
```
publish-bundle` first (from `C:\dev\spatial-ide`); if `renderer/bundle-viewer/dist`, or the
`viewer-asset-hashes.json` beside it, does not exist, run `npm run build` from
`renderer/bundle-viewer` first (the shell's build stops when either is missing).
```
Plain (D1 no), 3 lines of 89, 97 and 55 columns. The first two lines are byte-equal to the head's, and only the third changes:
```
publish-bundle` first (from `C:\dev\spatial-ide`); if renderer/bundle-viewer/dist, or the
viewer-asset-hashes.json beside it, does not exist, run npm run build from renderer/bundle-viewer
first (the shell's build stops when either is missing).
```
**§7:** OPEN-4 is 3 added + 2 removed against B (main's `frontends/shell/MANUAL-WALKTHROUGH.md:279-280 @ db3e8ec3`), so 5 of its 6. With F7 2, OPEN-1 4 and OPEN-2 2, the total is **13 of 14** under either D1 answer. My hand counts for the first two lines of each variant agree with the reviewer's scripted counts (91 and 78; 89 and 97). The reviewer re-counts all three lines by script when the rows are applied.

## 2. D1: two yes/no questions for the human

- **(i) Does OPEN-4's clause carry code spans** (`renderer/bundle-viewer/dist`, `viewer-asset-hashes.json`, `npm run build`, `renderer/bundle-viewer`)?
  - Yes: the first block above. 3 lines, total 13.
  - No: the second block. 3 lines, total 13.
  - I recommend yes: everywhere else the walkthrough puts paths and commands in backticks.
  - (Only the reviewer's longer parenthetical would push the code-span variant to 4 lines and a total of 14; the chosen words do not.)
- **(ii) Does G7's parenthetical mark `serve-bundle.mjs`?**
  - Yes: the parenthetical becomes (on a fresh port, so it does not collide with any other `serve-bundle.mjs` session still running).
  - No: it stays as it is at the head.
  - G7 is one physical line either way, so OPEN-2 stays 1+1 and the total stays 13.
  - I recommend yes, for the same consistency, since the row itself already backticks the command.
- Neither choice touches §4 item 2's checks. The `cargo build` sentence's bytes are kept in all four combinations.

## 3. D2: the row for the amendment that records the human's answer

These are the architect's words, not the human's; class 1 (a post-result record of what a gate's finding invalidates):

> **A4 and OPEN-4's premise (class 1).** §0's (A4) and OPEN-4's "What happens" are superseded on Windows by gate 2's C1 (`state/consults/gates/2026-10-23-walkthrough-row-f7-cli-refusal-gate2-architect.md`, C1 and D2; `state/consults/gates/2026-10-23-walkthrough-row-f7-cli-refusal-gate2-reviewer.md`, C1 and its first out-of-scope item), read at #241's 2fc01f5955a0dc21d51ee4cdffc3e5c55800959d. OPEN-4 (b)'s condition and remedy stand; only the parenthetical changes, by item <n> of this amendment. Nothing above is edited.

(The blockquote is my draft, not a quote. "What happens" is the form's own label; `<n>` is the item that applies C1's words.)

## 4. Out of scope for #244: #241's comments, for the custodian to put to the human with R2

**Are the comments untrue on Windows: yes.** Most of them are older than #241. They have been on main since RELEASE-0.1 item 3 mapped `dist/*` as a resource (`frontends/shell/src-tauri/tauri.conf.json:41 @ db3e8ec3`).
- **Why:**
  - tauri 2.11.5, `src/path/desktop.rs`, `PathResolver::resource_dir` calls tauri-utils' `resource_dir`.
  - In tauri-utils 2.9.3, `src/platform.rs`, `resource_dir_from` returns `Ok(exe_dir)` whenever `cfg!(target_os = "windows")`, and fails only if `current_exe()` fails.
  - Under `tauri dev` the executable sits in the cargo profile directory, where tauri-build copied the resources (item 1).
  - So `resolve_viewer_dir` picks the "packaged resource directory" candidate, which is the copy.
- **The untrue sentences:**
  - **(a)** `bundled_viewer`'s doc comment, its `tauri dev` sentence (`frontends/shell/src-tauri/src/publish.rs:1367-1369 @ db3e8ec3`; the same at 2fc01f59).
  - **(b)** `resolve_viewer_dir`'s comment that `Some` is the packaged signal a `tauri dev` run never supplies (`frontends/shell/src-tauri/src/publish.rs:1433-1434 @ db3e8ec3`).
  - **(c)** The same function's remedy comment, its last two sentences (`frontends/shell/src-tauri/src/publish.rs:1448-1451 @ db3e8ec3`).
  - **(d)** `commands.rs`'s comment at the first `bundled_viewer` call (`frontends/shell/src-tauri/src/commands.rs:319-321 @ db3e8ec3`). The second call's comment (`frontends/shell/src-tauri/src/commands.rs:554 @ db3e8ec3`) states only the order, and it is true.
  - **(e)** At #241 only: `read_build_record`'s doc comment, its "the resource directory when packaged, `renderer/bundle-viewer` in the dev tree" (branch, by symbol, at 2fc01f59).
  - **(f)** Test text: the comments in `no_resource_directory_at_all_tries_only_the_dev_tree_path` and in `no_resource_directory_at_all_and_no_dev_tree_path_gets_the_developer_remedy` (`frontends/shell/src-tauri/src/publish.rs:1487-1488 @ db3e8ec3`, `frontends/shell/src-tauri/src/publish.rs:1523-1525 @ db3e8ec3`).
- **Is W8's dev remedy reachable on Windows: no.**
  - `read_build_record`'s `packaged` is `resource_dir.is_some()`, which is true on Windows unless `current_exe()` fails.
  - W8 itself is reached there only if the copied record in the profile directory is removed or damaged after a build. That is not ordinary use, and the message then carries the packaged remedy.
  - Changing which remedy is chosen changes the code, so it is outside §31.
  - On macOS and Linux the same branch returns the executable's directory when it is `target/<profile>` and holds `.cargo-lock`. That is unvalidated (macOS is paused).
- **Replacement words.** Not the human's wording, so they are applied with no re-gate and listed in the PR body.
  - **(a)** Replace the clause from "a plain `tauri dev`" to the end of that sentence with: "and so does a `tauri dev` build: tauri-build copies the same resources into the cargo output directory beside the executable each time its build script runs, and on Windows `resource_dir()` is the executable's directory, so a `tauri dev` run resolves that copy first and reaches the dev-tree path only when the copy is absent."
    - Check: `try_build` and `copy_resources` (tauri-build 2.6.3); `resource_dir_from` (tauri-utils 2.9.3); the candidate order in `resolve_viewer_dir`.
  - **(b)** "`resource_dir` is `Some` in a packaged build and, on Windows, in a `tauri dev` run too (`commands.rs` passes `resource_dir()`, the executable's directory there), so the suppression also applies to a Windows dev run."
    - Check: as for (a), plus `commands.rs`'s `.ok()`.
  - **(c)** Replace the text after the semicolon of the block's second sentence, and the whole third sentence, with: "the remedy keys on the same `Some`, so a Windows `tauri dev` run that reaches this refusal is given the packaged remedy; `resource_dir` is `None` only when `resource_dir()` fails, which on Windows means the executable's path could not be read."
    - Check: `resource_dir` (`current_exe()?`, then `Ok`); `PathResolver::resource_dir` maps the error to `UnknownPath`; `.ok()`.
  - **(d)** The parenthetical becomes: "(on Windows only if the executable's path cannot be read; a `tauri dev` run there resolves to the cargo output directory, where tauri-build copied the resources)".
  - **(e)** "the resource directory when one resolved (a packaged build, or on Windows a `tauri dev` run's cargo output directory), `renderer/bundle-viewer` when the dev-tree path was taken".
    - Check: `dir.parent()`, where `dir` comes from `resolve_viewer_dir`.
  - **(f)** The first comment becomes: "`resource_dir()` failed and the caller passes `None` (on Windows only when the executable's path cannot be read; a `tauri dev` run there passes `Some`)." The mirror's parenthetical becomes: "(`resource_dir()` failed, which a Windows `tauri dev` run does not reach, and the dev-tree path does not hold the viewer either)".
- **What changing them would reopen in #241:**
  - **Its head:** any change makes a new head, and R1 and R2 run at the final head (the redaction form's Amendment 7 item 6, Amendment 8 item 2). R1 is re-run by a tester under the port-5400 harness; R2 is Monday's anyway.
  - **Its scope:** `publish.rs` is in #241's scope. Its non-test comments count toward the "≤ 45 outside `mod tests` and `resolver_tests`" ceiling (the redaction form's Amendment 3 item 10). (f) is test text, class 3 by the named exception, with no mutation owed and no hash pin at the branch commit. `commands.rs` is not among the 24 files: editing it is a scope addition, class 9, recorded before its code. An overrun is class 8.
  - **Its gates:** the words come from this consult, not from #241's gates. #241's architect adopts them as §31 words, applied with no re-gate; the reviewer's diff and CI check runs at the new head.
  - **F7's §4 item 4:** re-run at #241's final head (§2.3), recorded with the new commit id. Comment-only edits in the shell crate touch none of item 4's files, so it is predicted to hold. R-F7 is not re-run under §2.3.
- **My recommendation:** fix (e) in #241 before R2. It is #241's own new sentence, a Documentation must-fix under the proportional-gates rule, and it costs the R1 re-run. Fix (a) to (d) and (f) in a docs-lane node after #241 merges, because they were already untrue on main before #241. The human decides.

## What I could not settle

- No hashes and no scripted wrap. All column counts are by hand; the reviewer recomputes them when the rows are applied.
- The tauri CLI's own `tauri dev` config injection (`TAURI_CONFIG`) is not in the cargo registry. Item 1 assumes it leaves `bundle.resources` intact. The target listing corroborates this, but does not prove it for `tauri dev` specifically.
- Whether cargo reruns the build script for a `rerun-if-changed` path that has been deleted (item 1's named case).
- Placement: the operator meets the build stop at A1's launch, before Part F's paragraph. The Prerequisites section (`frontends/shell/MANUAL-WALKTHROUGH.md:128-134 @ db3e8ec3`) names no viewer build. A bullet there would be a new path, outside §7. It is a follow-up for the human (OPEN-4's option (c) in kind), not a C1 defect.
- macOS and Linux behaviour of `resource_dir_from` under a dev run (item 4).
